from typing import Any
from pydantic import BaseModel

class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 5

class RAGSource(BaseModel):
    document: str
    relevance: float

class RAGResponse(BaseModel):
    answer: str
    sources: list[RAGSource]

class EmergencyTrigger(BaseModel):
    timestamp: str
    zone_id: str
    zone_name: str
    trigger_type: str
    risk_score: float
    triggered_rules: list[str]
    sensor_history: dict[str, Any]
    active_permits: list[dict[str, Any]]
    worker_locations: list[dict[str, Any]]

class IncidentReport(BaseModel):
    report_id: str
    incident_datetime: str
    facility_section: str
    incident_category: str
    description: str
    immediate_cause: str
    contributing_factors: list[str]
    persons_at_risk: int
    immediate_actions_taken: list[str]
    statutory_notifications_required: list[str]
    evidence_preserved: list[str]
    regulatory_references: list[str]
    preliminary_recommendations: list[str]
