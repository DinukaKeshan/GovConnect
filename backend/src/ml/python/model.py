# backend/src/ml/python/model.py
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.pipeline import Pipeline
import joblib
import os
from datetime import datetime, timezone

MODEL_PATH = os.path.join(os.path.dirname(__file__), "complaint_model.pkl")

PRIORITY_MAP = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}

def extract_features(complaints: list[dict]) -> np.ndarray:
    rows = []
    for c in complaints:
        votes    = len(c.get("votes", []))
        priority = PRIORITY_MAP.get(c.get("priority", "MEDIUM"), 2)

        created_at = c.get("createdAt", "")
        try:
            dt = datetime.fromisoformat(str(created_at).replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            recency_days = max(0, (now - dt).total_seconds() / 86400)
        except Exception:
            recency_days = 0.0

        rows.append([votes, priority, recency_days])
    return np.array(rows, dtype=float)


def compute_scores(complaints: list[dict]) -> list[float]:
    """
    Simple weighted formula — no CSV needed.
    Weights: votes 50%, priority 35%, recency 15%
    """
    if not complaints:
        return []

    features = extract_features(complaints)  # shape (n, 3)

    votes_col    = features[:, 0]
    priority_col = features[:, 1]
    recency_col  = features[:, 2]

    def normalize(arr):
        mn, mx = arr.min(), arr.max()
        if mx == mn:
            return np.full(len(arr), 0.5)
        return (arr - mn) / (mx - mn)

    votes_norm    = normalize(votes_col)
    priority_norm = normalize(priority_col)
    recency_norm  = 1 - normalize(recency_col)  # newer = higher score

    scores = (
        0.50 * votes_norm    +
        0.35 * priority_norm +
        0.15 * recency_norm
    )

    return np.clip(scores, 0, 1).tolist()