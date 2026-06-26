from typing import Literal
from pydantic import BaseModel

class SensorReadingSnapshot(BaseModel):
    sensor_id: str
    zone_id: str
    value: float
    unit: str
    status: Literal["NORMAL", "WARNING", "CRITICAL"]
    trend: Literal["RISING", "FALLING", "STABLE"]
    rate_of_change: float
    sparkline: list[float] = []

class WebSocketSensorStream(BaseModel):
    timestamp: str
    simulation_mode: str
    sensors: list[SensorReadingSnapshot]
    compound_risk_score: float
    active_rules_triggered: list[str]
    zones_at_risk: list[str]
    worker_count_at_risk: int
    time_to_threshold_minutes: int
