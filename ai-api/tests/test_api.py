from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_members():
    r = client.get("/members")
    assert r.status_code == 200
    assert len(r.json()) >= 4


def test_member_404():
    assert client.get("/members/nope").status_code == 404


def test_ask_empty():
    r = client.post("/ask", json={"question": ""})
    assert r.status_code == 422


def test_ask_no_match():
    r = client.post("/ask", json={"question": "What is the weather in Kigali today?"})
    assert r.status_code == 200
    assert r.json()["match"] is None


def test_ask_returns_schema():
    r = client.post("/ask", json={"question": "Who built offline mode?"})
    body = r.json()
    assert "confidence" in body
    assert "modelVersion" in body
    assert "groupCode" in body


def test_model_info():
    r = client.get("/model-info")
    assert "fingerprint" in r.json()
    assert "threshold" in r.json()