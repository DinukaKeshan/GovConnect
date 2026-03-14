# backend/src/ml/python/model.py
import numpy as np

PRIORITY_MAP = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}

def extract_features(complaints: list[dict]) -> np.ndarray:
    rows = []
    for c in complaints:
        votes    = len(c.get("votes", []))
        priority = PRIORITY_MAP.get(c.get("priority", "MEDIUM"), 2)
        rows.append([votes, priority])
    return np.array(rows, dtype=float)


def compute_scores(complaints: list[dict]) -> list[float]:
    if not complaints:
        return []

    features = extract_features(complaints)

    votes_col    = features[:, 0]
    priority_col = features[:, 1]

    def normalize(arr):
        mn, mx = arr.min(), arr.max()
        if mx == mn:
            return np.full(len(arr), 0.5)
        return (arr - mn) / (mx - mn)

    votes_norm    = normalize(votes_col)
    priority_norm = normalize(priority_col)

    scores = (
        0.60 * votes_norm    +
        0.40 * priority_norm
    )

    return np.clip(scores, 0, 1).tolist()