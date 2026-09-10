from fastapi import APIRouter
import json

router = APIRouter()

RESULTS_PATH = "output/results.json"

@router.get("/known-laws")
def get_known_laws():
    with open(RESULTS_PATH) as f:
        data = json.load(f)
    return [c for c in data if c["is_known_law"] is True]    