from fastapi import APIRouter, HTTPException
from typing import List
import json
from backend.models import Candidate

router = APIRouter()

RESULTS_PATH = "output/results.json"

@router.get("/candidates", response_model=List[Candidate])
def get_candidates():
    try:
        with open(RESULTS_PATH) as f:
            data = json.load(f)
            return [Candidate(**c) for c in data]
    except FileNotFoundError:
        return []


@router.get("/candidates/{candidate_id}", response_model=Candidate)
def get_candidate(candidate_id: str):
    try:
        with open(RESULTS_PATH) as f:
            data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Results not found")
        
    candidate = next((c for c in data if str(c.get("id")) == str(candidate_id)), None)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")
    return Candidate(**candidate)