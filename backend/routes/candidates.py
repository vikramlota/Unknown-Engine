from fastapi import APIRouter
import json

router = APIRouter()

RESULTS_PATH = "output/results.json"

@router.get("/candidates")
def get_candidates():
    with open(RESULTS_PATH) as f:
        return json.load(f)


@router.get("/candidates/{candidate_id}")
def get_candidate(candidate_id:str):
    with open(RESULTS_PATH) as f:
        data = json.load(f)
    return next((c for c in data if c["id"] == candidate_id),{"error":"not found"})