from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

# Defines the shape of the data points for the React scatter chart
class SamplePoint(BaseModel):
    x: float
    y: float

# Defines the full schema for a single discovered relationship
class Candidate(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    var1: str
    var2: str
    method: Optional[str] = "dcor"
    score: float
    pvalue: Optional[float] = None
    p_spearman_adj: Optional[float] = None
    p_spearman: Optional[float] = None
    expression: Optional[str] = None
    hypothesis_text: Optional[str] = "No hypothesis generated"
    train_r2: Optional[float] = 0.0
    test_r2: Optional[float] = None
    is_known_law: bool = False
    known_law_name: Optional[str] = None
    sample_points: List[SamplePoint] = Field(default_factory=list)
    novelty_distance: Optional[float] = None