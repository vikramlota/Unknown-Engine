from fastapi import APIRouter
from typing import List
import json
from backend.models import Candidate

router = APIRouter()

RESULTS_PATH = "output/results.json"

@router.get("/known-laws", response_model=List[Candidate])
def get_known_laws():
    try:
        with open(RESULTS_PATH) as f:
            data = json.load(f)
            return [Candidate(**c) for c in data if c.get("is_known_law") is True]
    except FileNotFoundError:
        return []