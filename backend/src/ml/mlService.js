// backend/src/ml/mlService.js
import axios from "axios";

const ML_URL = "http://localhost:5001";

export const mlScoreAndSort = async (complaints) => {
  if (!complaints || complaints.length === 0) return [];

  if (complaints.length === 1) {
    return [{ ...complaints[0].toObject?.() ?? complaints[0], _urgencyScore: 0.5, _rank: 1 }];
  }

  const plain = complaints.map(c => c.toObject?.() ?? c);

  try {
    const response = await axios.post(
      `${ML_URL}/score`,
      { complaints: plain },
      { timeout: 10000 }
    );

    console.log(`[mlService] Scored ${response.data.scored.length} complaints`);
    return response.data.scored;

  } catch (err) {
    console.warn("[mlService] Python ML service unavailable — falling back to JS sort");
    return jsFallbackSort(plain);
  }
};

const jsFallbackSort = (complaints) => {
  const PRIORITY_SCORE = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  const scored = complaints.map(c => ({
    ...c,
    _urgencyScore: (
      (c.votes?.length ?? 0) * 0.60 +
      (PRIORITY_SCORE[c.priority] ?? 2) * 0.40
    ),
    _rank: 0,
  }));

  scored.sort((a, b) => b._urgencyScore - a._urgencyScore);

  return scored.map((c, i) => ({ ...c, _rank: i + 1 }));
};