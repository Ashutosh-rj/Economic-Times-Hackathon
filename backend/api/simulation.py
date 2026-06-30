from fastapi import APIRouter
from pydantic import BaseModel
from core.sensor_simulator import sensor_simulator

router = APIRouter(tags=["simulation"])

class ModeRequest(BaseModel):
    mode: str

@router.get("/simulation/mode")
async def get_mode():
    return {"mode": sensor_simulator.mode}

@router.post("/simulation/mode")
async def set_mode(req: ModeRequest):
    new_m = req.mode.upper()
    if new_m in ["NORMAL", "PRE_INCIDENT", "INCIDENT"]:
        sensor_simulator.set_mode(new_m)
        return {"status": "success", "mode": new_m}
    return {"status": "error", "message": "Invalid simulation mode"}

@router.get("/graph/topology")
async def get_graph_topology():
    return {
        "metadata": {
            "title": "SENTINEL Digital Twin SIMOPS & LangGraph Ontology Graph",
            "description": "NetworkX Differentiator fusing Physical Equipment, Active Permits, Statutory Regulations, and Autonomous LangGraph Agents."
        },
        "nodes": [
            {"id": "EQ_BLOWER_1", "label": "Exhaust Blower #1 (4200 CFM)", "group": "EQUIPMENT", "status": "TRIPPED_RISK"},
            {"id": "EQ_HEADER_H1", "label": "Primary Coke Gas Header H1", "group": "EQUIPMENT", "status": "TOXIC_LEAK"},
            {"id": "PTW_CS_001", "label": "Confined Space Entry #PTW-001", "group": "PERMIT", "status": "AUTO_REVOKED"},
            {"id": "PTW_HW_204", "label": "Hot Work Spark Permit #PTW-204", "group": "PERMIT", "status": "SUSPENDED"},
            {"id": "RSK_CR001", "label": "Compound Rule CR-001 (SIMOPS Trap)", "group": "RISK_RULE", "status": "FIRED_CRITICAL"},
            {"id": "REG_OISD_105", "label": "OISD-STD-105 Sec 6.3 Statute", "group": "REGULATION", "status": "GOVERNING_STATUTE"},
            {"id": "REG_OSHA_1910", "label": "OSHA 29 CFR 1910.146 Confined Space", "group": "REGULATION", "status": "GOVERNING_STATUTE"},
            {"id": "AGT_SENSOR", "label": "IoT Sensor Ingestion Agent", "group": "LANGGRAPH_AGENT", "status": "ACTIVE_LOOP"},
            {"id": "AGT_RISK", "label": "Bayesian Causal Risk Agent", "group": "LANGGRAPH_AGENT", "status": "DAG_POSTERIOR_0.98"},
            {"id": "AGT_ROUTER", "label": "Supervisor Router Agent", "group": "LANGGRAPH_AGENT", "status": "INTERLOCK_ENGAGED"},
            {"id": "AGT_PTW", "label": "Permit Intelligence Agent", "group": "LANGGRAPH_AGENT", "status": "STATUTORY_DENIAL"},
            {"id": "AGT_EMERGENCY", "label": "Emergency Orchestrator Agent", "group": "LANGGRAPH_AGENT", "status": "WEBHOOKS_DISPATCHED"}
        ],
        "links": [
            {"source": "EQ_HEADER_H1", "target": "RSK_CR001", "relation": "TRIGGERS_TOXIC_OUTGASSING"},
            {"source": "EQ_BLOWER_1", "target": "RSK_CR001", "relation": "VENTILATION_LOSS_FACTOR"},
            {"source": "PTW_CS_001", "target": "RSK_CR001", "relation": "CONFINED_SPACE_OCCUPANCY"},
            {"source": "PTW_HW_204", "target": "RSK_CR001", "relation": "SIMOPS_SPARK_CLASH"},
            {"source": "RSK_CR001", "target": "REG_OISD_105", "relation": "BREACHES_SAFETY_STATUTE"},
            {"source": "RSK_CR001", "target": "REG_OSHA_1910", "relation": "BREACHES_SAFETY_STATUTE"},
            {"source": "AGT_SENSOR", "target": "AGT_RISK", "relation": "FEEDS_TELEMETRY_SNAPSHOT"},
            {"source": "AGT_RISK", "target": "AGT_ROUTER", "relation": "EMITS_RISK_POSTERIOR"},
            {"source": "AGT_ROUTER", "target": "AGT_PTW", "relation": "INVOKES_PERMIT_INTERLOCK"},
            {"source": "AGT_ROUTER", "target": "AGT_EMERGENCY", "relation": "TRIGGERS_AUTONOMOUS_SIRENS"}
        ]
    }
