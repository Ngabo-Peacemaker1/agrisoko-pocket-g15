"""AgriSoko Pocket G15 — AI matching API."""
from pathlib import Path
import pickle
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.metrics.pairwise import cosine_similarity

BASE = Path(__file__).parent
MODEL_DIR = BASE / "model"
MODEL_DIR.mkdir(exist_ok=True)

if not (MODEL_DIR / "index.pkl").exists():
    import subprocess, sys
    subprocess.check_call([sys.executable, str(BASE / "build_index.py")])

with open(MODEL_DIR / "index.pkl", "rb") as f:
    MODEL = pickle.load(f)
with open(MODEL_DIR / "model_info.json") as f:
    META = json.load(f)

THRESHOLD = META["threshold"]
MEMBERS = MODEL["members"]
VECTORIZER = MODEL["vectorizer"]
MATRIX = MODEL["matrix"]

app = FastAPI(title="AgriSoko Pocket G15 API", version=META["modelVersion"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": META["modelVersion"],
        "groupCode": META["groupCode"],
    }


@app.get("/members")
def list_members():
    return [
        {
            "id": m["id"],
            "fullName": m["fullName"],
            "role": m["role"],
            "skills": m["skills"],
            "feature": m["feature"],
        }
        for m in MEMBERS
    ]


@app.get("/members/{member_id}")
def get_member(member_id: str):
    for m in MEMBERS:
        if m["id"] == member_id:
            return m
    raise HTTPException(404, f"Member {member_id} not found")


@app.post("/ask")
def ask(req: AskRequest):
    q = req.question.strip()
    if not q:
        raise HTTPException(400, "Empty question")

    qvec = VECTORIZER.transform([q])
    scores = cosine_similarity(qvec, MATRIX)[0]
    best_idx = int(scores.argmax())
    best_score = float(scores[best_idx])

    lower = q.lower()
    for i, m in enumerate(MEMBERS):
        tokens = [m["fullName"].lower()] + [a.lower() for a in m["aliases"]]
        if any(t and t in lower for t in tokens):
            best_idx = i
            best_score = max(best_score, 0.85)
            break

    if best_score < THRESHOLD:
        return {
            "match": None,
            "confidence": round(best_score, 3),
            "reason": "No confident match found.",
            "suggestions": [
                {"name": m["fullName"], "role": m["role"]} for m in MEMBERS
            ],
            "modelVersion": META["modelVersion"],
            "groupCode": META["groupCode"],
        }

    member = MEMBERS[best_idx]
    return {
        "match": member,
        "confidence": round(best_score, 3),
        "reason": f"Matched based on: {q}",
        "introduction": member["introductionDraft"],
        "modelVersion": META["modelVersion"],
        "groupCode": META["groupCode"],
    }


@app.get("/model-info")
def model_info():
    return META