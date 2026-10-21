"""Build TF-IDF index for member matching."""
import json
import hashlib
import pickle
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer

BASE = Path(__file__).parent
DATA = BASE / "data" / "members.json"
MODEL_DIR = BASE / "model"
MODEL_DIR.mkdir(exist_ok=True)

REQUIRED = [
    "id", "fullName", "registrationNumber", "aliases", "githubUsername",
    "role", "skills", "targetUser", "problem", "contribution",
    "feature", "outcomeMetric", "evidenceLinks", "testerFeedback",
    "introductionDraft",
]


def validate(members):
    seen = set()
    for m in members:
        missing = [f for f in REQUIRED if f not in m]
        if missing:
            raise ValueError(f"Member {m.get('id','?')} missing: {missing}")
        if m["id"] in seen:
            raise ValueError(f"Duplicate id: {m['id']}")
        seen.add(m["id"])


def make_document(m):
    return " ".join([
        m["fullName"],
        " ".join(m["aliases"]),
        m["role"],
        " ".join(m["skills"]),
        m["feature"],
        m["problem"],
        m["contribution"],
        m["targetUser"],
    ])


def build():
    raw = DATA.read_bytes()
    data = json.loads(raw)
    members = data["members"]
    validate(members)
    docs = [make_document(m) for m in members]
    vectorizer = TfidfVectorizer(
        lowercase=True, ngram_range=(1, 2),
        stop_words="english", sublinear_tf=True,
    )
    matrix = vectorizer.fit_transform(docs)
    fingerprint = hashlib.sha256(raw).hexdigest()
    with open(MODEL_DIR / "index.pkl", "wb") as f:
        pickle.dump({"vectorizer": vectorizer, "matrix": matrix, "members": members}, f)
    meta = {
        "vectorizer": "TF-IDF word (1-2 grams), sublinear_tf",
        "threshold": 0.45,
        "fingerprint": fingerprint,
        "modelVersion": "1.0.0",
        "groupCode": data.get("groupCode", "G15"),
        "memberCount": len(members),
        "limitations": [
            "Only matches against the approved member dataset",
            "Queries below 0.45 confidence return no-match",
            "Typos can reduce confidence",
        ],
    }
    (MODEL_DIR / "model_info.json").write_text(json.dumps(meta, indent=2))
    print(f"Indexed {len(members)} members. Fingerprint: {fingerprint[:16]}...")


if __name__ == "__main__":
    build()