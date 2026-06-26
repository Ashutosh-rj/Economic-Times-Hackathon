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
