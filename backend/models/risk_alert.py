from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

class CompoundRuleSchema(BaseModel):
    id: str
    name: str
    conditions: list[str]
    severity: str
    lead_time_minutes: int
    regulation: str
    historical_incident: str

class RiskAlertResponse(BaseModel):
    id: int
    rule_id: str
    zone_id: str
    severity: str
    risk_score: float
    triggered_conditions: list[str]
    ai_narrative: str
    recommended_actions: list[str]
    acknowledged: bool
    acknowledged_by: Optional[str]
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True
