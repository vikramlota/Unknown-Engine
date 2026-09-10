from fastapi import APIRouter
from typing import List
from pathlib import Path
import json
try:
    from backend.models import Candidate
except ImportError:
    from models import Candidate

router = APIRouter()

base_dir = Path(__file__).resolve().parent.parent.parent
RESULTS_PATH = base_dir / "output" / "results.json"

@router.get("/known-laws", response_model=List[Candidate])
def get_known_laws():
    try:
        with open(RESULTS_PATH) as f:
            data = json.load(f)
            return [Candidate(**c) for c in data if c.get("is_known_law") is True]
    except FileNotFoundError:
        return []