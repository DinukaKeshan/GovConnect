// backend/src/ml/mlService.js
// Node.js client for the Python ML microservice
// Falls back to JS scorer if Python service is unavailable

import axios from "axios";
import { scoreAndSortComplaints } from "./complaintScorer.js"; // JS fallback

// Using env variable with localhost fallback
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";
const TIMEOUT_MS = 10000; // 10s timeout

/**
 * Score and sort complaints using Python ML microservice.
 * Falls back to JS linear regression if Python service is down.
 */
export const mlScoreAndSort = async (complaints) => {
  // 1. Maintain consistent { scored, model_info } return structure
  if (!complaints || complaints.length === 0) {
    return { scored: [], model_info: null };
  }
  
  // 2. Safely handle single complaints with the same structure
  if (complaints.length === 1) {
    const single = complaints[0].toObject ? complaints[0].toObject() : complaints[0];
    return { 
      scored: [{ ...single, _urgencyScore: 0.5, _rank: 1 }], 
      model_info: { note: "Single complaint" } 
    };
  }

  try {
    // Serialize complaints to plain objects for JSON transport
    const plain = complaints.map((c) =>
      c.toObject ? c.toObject() : c
    );

    const response = await axios.post(
      `${ML_SERVICE_URL}/score`,
      { complaints: plain },
      { timeout: TIMEOUT_MS }
    );

    const { scored, model_info } = response.data;

    if (model_info?.feature_importances) {
      console.log("[ML] Python model feature importances:", model_info.feature_importances);
    }

    // 3. 👈 FIXED: Return both so the React UI can display the ML banner!
    return { scored, model_info };

  } catch (err) {
    // Python service unavailable — fall back to JS scorer
    console.warn("[ML] Python service unavailable, using JS fallback:", err.message);
    
    // JS fallback (which we just updated) already returns { scored, model_info }
    return scoreAndSortComplaints(complaints);
  }
};

/**
 * Check if the Python ML service is running
 */
export const checkMlService = async () => {
  try {
    const res = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
    return res.data?.status === "ok";
  } catch {
    return false;
  }
};