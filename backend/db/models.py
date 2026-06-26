from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON
from db.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String, index=True)
    zone_id = Column(String, index=True)
    value = Column(Float)
    unit = Column(String)
    status = Column(String)  # NORMAL/WARNING/CRITICAL
    timestamp = Column(DateTime, default=datetime.utcnow)

class CompoundRiskAlert(Base):
    __tablename__ = "compound_risk_alerts"

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(String, index=True)
    zone_id = Column(String, index=True)
    severity = Column(String)
    risk_score = Column(Float)
    triggered_conditions = Column(JSON)
    ai_narrative = Column(String)
    recommended_actions = Column(JSON)
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class PermitRecord(Base):
    __tablename__ = "permits"

    id = Column(Integer, primary_key=True, index=True)
    permit_id = Column(String, unique=True, index=True)
    permit_type = Column(String)
    zone_id = Column(String, index=True)
    worker_count = Column(Integer)
    contractor_name = Column(String)
    work_description = Column(String)
    safety_measures = Column(JSON)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String, default="PENDING")  # PENDING/AI_APPROVED/AI_DENIED/HUMAN_APPROVED/ACTIVE/EXPIRED
    ai_decision = Column(String, nullable=True)
    ai_reasoning = Column(String, nullable=True)
    ai_risk_score = Column(Float, nullable=True)
    conditions = Column(JSON, nullable=True)
    regulation_reference = Column(String, nullable=True)

class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String, unique=True, index=True)
    trigger_type = Column(String)
    zone_id = Column(String)
    risk_score_at_trigger = Column(Float)
    triggered_rules = Column(JSON)
    sensor_snapshot = Column(JSON)
    report_content = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    emergency_id = Column(String)
