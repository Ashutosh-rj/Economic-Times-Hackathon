from fastapi import APIRouter
from models.permit import PermitRequest
from agents.permit_intelligence_agent import analyze_permit
from core.sensor_simulator import sensor_simulator

router = APIRouter(tags=["permits"])

@router.get("/permits")
async def get_permits():
    permits = list(sensor_simulator.active_permits)
    if not any(p["permit_id"] == "PTW-DEMO-001" for p in permits):
        permits.append({
            "permit_id": "PTW-DEMO-001",
            "permit_type": "CONFINED_SPACE",
            "zone_id": "COKE_OVEN_BATTERY_1",
            "worker_count": 6,
            "contractor_name": "Apex Industrial Services",
            "work_description": "Cleaning & valve inspection in Battery #1 header",
            "start_time": "2025-01-15T14:00:00Z",
            "duration_hours": 4.0,
            "status": "AI_DENIED" if sensor_simulator.mode != "NORMAL" else "ACTIVE",
            "ai_decision": "DENY" if sensor_simulator.mode != "NORMAL" else "APPROVE_WITH_CONDITIONS",
            "ai_reasoning": "Atmospheric H2S telemetry (18.4 ppm) exceeds safe pre-entry threshold per OISD-STD-105 Clause 6.3." if sensor_simulator.mode != "NORMAL" else "Parameters within acceptable occupational safety limits.",
            "regulation_reference": "OISD-STD-105 Clause 6.3"
        })
    return permits

@router.post("/permits")
async def create_permit(req: PermitRequest):
    dec = await analyze_permit(req, sensor_simulator.latest_snapshot, sensor_simulator.active_permits)
    
    new_p = {
        "permit_id": req.permit_id,
        "permit_type": req.permit_type,
        "zone_id": req.zone_id,
        "worker_count": req.worker_count,
        "contractor_name": req.contractor_name,
        "work_description": req.work_description,
        "start_time": req.start_time.isoformat(),
        "duration_hours": req.duration_hours,
        "status": "AI_" + dec.decision,
        "ai_decision": dec.decision,
        "ai_reasoning": dec.reasoning,
        "ai_risk_score": dec.estimated_risk_score,
        "conditions": dec.conditions,
        "regulation_reference": dec.regulation_reference
    }
    if dec.decision != "DENY":
        sensor_simulator.active_permits.append(new_p)
    return new_p

@router.get("/permits/{permit_id}")
async def get_permit_detail(permit_id: str):
    for p in await get_permits():
        if p["permit_id"] == permit_id:
            return p
    return {"error": "Permit not found"}

@router.put("/permits/{permit_id}/status")
async def update_permit_status(permit_id: str, status: str):
    return {"status": "success", "permit_id": permit_id, "new_status": status}
