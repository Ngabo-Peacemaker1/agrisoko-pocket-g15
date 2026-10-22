"""Builds the TF-IDF index for AgriSoko Pocket G15."""
import json
import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer

BASE = Path(__file__).parent
MODEL_DIR = BASE / "model"
MODEL_DIR.mkdir(exist_ok=True)

DATA_PATH = BASE / "data" / "members.json"

GROUP_CODE = "G15"
MODEL_VERSION = "tfidf-v1"
THRESHOLD = 0.35  # lowered a bit so queries match more easily


def build():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        members = json.load(f)

    if not members:
        raise ValueError("members.json is empty — add at least one member")

    # Combine the fields the AI should "see"
    def doc(m):
        parts = [
            m.get("fullName", ""),
            " ".join(m.get("aliases", [])),
            m.get("role", ""),
            " ".join(m.get("skills", [])),
            m.get("problem", ""),
            m.get("contribution", ""),
            m.get("feature", ""),
            m.get("targetUser", ""),
        ]
        return " ".join(p for p in parts if p)

    docs = [doc(m) for m in members]

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(docs)

    payload = {
        "members": members,
        "vectorizer": vectorizer,
        "matrix": matrix,
    }

    with open(MODEL_DIR / "index.pkl", "wb") as f:
        pickle.dump(payload, f)

    info = {
        "modelVersion": MODEL_VERSION,
        "groupCode": GROUP_CODE,
        "threshold": THRESHOLD,
        "numMembers": len(members),
        "features": "TF-IDF (1-2 grams, English stopwords)",
        "limitations": "Offline keyword matching only; no semantic understanding.",
    }
    with open(MODEL_DIR / "model_info.json", "w") as f:
        json.dump(info, f, indent=2)

    print(f"Built index for {len(members)} members → {MODEL_DIR}")


if __name__ == "__main__":
    build()