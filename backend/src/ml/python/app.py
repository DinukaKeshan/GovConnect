# backend/src/ml/python/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import compute_scores
import traceback

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/score", methods=["POST"])
def score():
    try:
        data       = request.get_json()
        complaints = data.get("complaints", [])

        if not complaints:
            return jsonify({"error": "No complaints provided"}), 400

        scores = compute_scores(complaints)

        scored = []
        for complaint, s in zip(complaints, scores):
            scored.append({**complaint, "_urgencyScore": round(float(s), 4)})

        # Sort by urgency score descending
        scored.sort(key=lambda c: c["_urgencyScore"], reverse=True)

        for i, c in enumerate(scored):
            c["_rank"] = i + 1

        print(f"[ML] Scored {len(scored)} complaints")
        print(f"[ML] Top 3: {[(c.get('title','?')[:30], c['_urgencyScore']) for c in scored[:3]]}")

        return jsonify({
            "scored": scored,
            "model_info": {
                "weights": {"votes": 0.50, "priority": 0.35, "recency": 0.15},
                "n_complaints": len(scored),
            }
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("[ML Service] Starting on http://localhost:5001")
    app.run(port=5001, debug=False)