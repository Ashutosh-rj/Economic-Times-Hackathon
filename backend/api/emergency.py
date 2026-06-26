from fastapi import APIRouter
from core.sensor_simulator import sensor_simulator
from agents.emergency_orchestrator import emergency_orchestrator_node

router = APIRouter(tags=["emergency"])

emergency_store = {}

@router.get("/emergency/status")
async def get_emergency_status():
    is_active = sensor_simulator.compound_risk_score >= 0.85 or emergency_store.get("triggered", False)
    return {
        "active": is_active,
        "risk_score": sensor_simulator.compound_risk_score,
        "report": emergency_store.get("report")
    }

@router.post("/emergency/trigger")
async def trigger_emergency():
    res = await emergency_orchestrator_node({
        "current_risk_score": 0.92,
        "emergency_triggered": True,
        "sensor_snapshot": sensor_simulator.latest_snapshot,
        "active_permits": sensor_simulator.active_permits,
        "worker_locations": sensor_simulator.worker_locations,
        "compound_risks": [{"id": "CR-001", "name": "Confined Space + Gas Accumulation"}]
    })
    emergency_store["triggered"] = True
    emergency_store["report"] = res.get("emergency_report")
    sensor_simulator.set_mode("INCIDENT")
    return {"status": "triggered", "report": res.get("emergency_report")}

@router.post("/emergency/reset")
async def reset_emergency():
    emergency_store["triggered"] = False
    emergency_store["report"] = None
    sensor_simulator.set_mode("NORMAL")
    return {"status": "reset"}

@router.get("/emergency/report/{id}")
async def get_emergency_report(id: str):
    return emergency_store.get("report") or {"error": "No report generated yet"}
