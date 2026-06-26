from fastapi import APIRouter
from core.sensor_simulator import sensor_simulator
from core.risk_engine import COMPOUND_RULES

router = APIRouter(tags=["alerts"])

@router.get("/alerts")
async def get_all_alerts():
    score = sensor_simulator.compound_risk_score
    if sensor_simulator.mode == "NORMAL" and score < 0.3:
        return []
    
    return [
        {
            "id": 101,
            "rule_id": "CR-001",
            "zone_id": "COB1",
            "severity": "CRITICAL" if score > 0.7 else "HIGH",
            "risk_score": score,
            "triggered_conditions": ["active_permit.type == 'CONFINED_SPACE'", "zone_gas_ppm > 25"],
            "ai_narrative": f"Compound Hazard Active in Zone COB1: Simultaneous outgassing of toxic H2S (18.4 ppm) and Confined Space occupancy. Estimated lead time before fatality threshold breach is {int(45 - score*35)} minutes.",
            "recommended_actions": ["Evacuate Zone COB1 immediately", "Trip emergency blower interlock"],
            "acknowledged": False,
            "created_at": "2025-01-15T14:32:00Z"
        }
    ]

@router.get("/alerts/active")
async def get_active_alerts():
    return await get_all_alerts()

@router.post("/alerts/{alert_id}/acknowledge")
async def ack_alert(alert_id: int):
    return {"status": "success", "alert_id": alert_id, "acknowledged": True}
