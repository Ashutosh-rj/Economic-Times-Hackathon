from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel

class PermitRequest(BaseModel):
    permit_id: str
    permit_type: Literal["HOT_WORK", "CONFINED_SPACE", "HEIGHT_WORK", "ELECTRICAL_ISOLATION", "EXCAVATION"]
    zone_id: str
    start_time: datetime
    duration_hours: float
    worker_count: int
    contractor_name: str
    work_description: str
    safety_measures: list[str]

class PermitDecision(BaseModel):
    decision: Literal["APPROVE", "APPROVE_WITH_CONDITIONS", "DENY"]
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    reasoning: str
    conditions: list[str] = []
    deny_reason: Optional[str] = None
    regulation_reference: str
    estimated_risk_score: float

class PermitRecordResponse(BaseModel):
    id: int
    permit_id: str
    permit_type: str
    zone_id: str
    worker_count: int
    contractor_name: str
    work_description: str
    safety_measures: list[str]
    start_time: datetime
    end_time: datetime
    status: str
    ai_decision: Optional[str]
    ai_reasoning: Optional[str]
    ai_risk_score: Optional[float]
    conditions: Optional[list[str]]
    regulation_reference: Optional[str]

    class Config:
        from_attributes = True
