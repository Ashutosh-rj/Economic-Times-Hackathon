import asyncio
import random
from datetime import datetime
from typing import Dict, Any, List
from core.websocket_manager import ws_manager
from core.risk_engine import evaluate_compound_risks
from models.sensor_data import SensorReadingSnapshot

class SensorSimulator:
    def __init__(self):
        self.mode: str = "NORMAL"
        self.ticks_in_mode: int = 0
        self.running: bool = False
        self.active_permits: List[Dict[str, Any]] = []
        self.shift_status: Dict[str, Any] = {
            "shift": "Shift B (14:00 - 22:00)",
            "changeover_active": False,
            "handover_gap": False
        }
        self.worker_locations: List[Dict[str, Any]] = [
            {"zone_id": "COB1", "count": 6},
            {"zone_id": "COB2", "count": 4},
            {"zone_id": "BF1", "count": 12},
            {"zone_id": "CS1", "count": 3},
            {"zone_id": "CR1", "count": 5},
            {"zone_id": "MW1", "count": 8}
        ]
        
        # Base state for 12 sensors
        self.sensors: Dict[str, Dict[str, Any]] = {
            "GAS_H2S_01": {"zone": "COB1", "val": 3.2, "unit": "ppm", "normal": (1.0, 4.5), "warn": 10.0, "crit": 20.0},
            "GAS_CO_01":  {"zone": "COB1", "val": 18.0, "unit": "ppm", "normal": (10.0, 24.0), "warn": 50.0, "crit": 100.0},
            "TEMP_01":    {"zone": "COB1", "val": 45.2, "unit": "°C", "normal": (40.0, 55.0), "warn": 80.0, "crit": 120.0},
            "PRESS_01":   {"zone": "COB1", "val": 1012.0, "unit": "mbar", "normal": (1005.0, 1030.0), "warn": 1100.0, "crit": 1200.0},
            
            "GAS_H2S_02": {"zone": "COB2", "val": 2.1, "unit": "ppm", "normal": (1.0, 4.0), "warn": 10.0, "crit": 20.0},
            "GAS_CO_02":  {"zone": "COB2", "val": 14.5, "unit": "ppm", "normal": (10.0, 22.0), "warn": 50.0, "crit": 100.0},
            "TEMP_02":    {"zone": "COB2", "val": 43.8, "unit": "°C", "normal": (40.0, 55.0), "warn": 80.0, "crit": 120.0},
            "PRESS_02":   {"zone": "COB2", "val": 1015.0, "unit": "mbar", "normal": (1005.0, 1030.0), "warn": 1100.0, "crit": 1200.0},
            
            "GAS_CO_03":  {"zone": "BF1",  "val": 22.0, "unit": "ppm", "normal": (15.0, 30.0), "warn": 50.0, "crit": 100.0},
            "GAS_CH4_01": {"zone": "BF1",  "val": 4.5, "unit": "% LEL", "normal": (2.0, 8.0), "warn": 25.0, "crit": 50.0},
            "TEMP_03":    {"zone": "BF1",  "val": 58.0, "unit": "°C", "normal": (50.0, 65.0), "warn": 85.0, "crit": 125.0},
            "VIBRATION_01": {"zone": "BF1", "val": 2.8, "unit": "mm/s", "normal": (1.0, 4.5), "warn": 8.0, "crit": 15.0},
            
            "GAS_H2S_03": {"zone": "CS1",  "val": 1.5, "unit": "ppm", "normal": (0.5, 3.0), "warn": 10.0, "crit": 20.0},
            "GAS_NH3_01": {"zone": "CS1",  "val": 5.2, "unit": "ppm", "normal": (2.0, 8.0), "warn": 25.0, "crit": 50.0},
            "TEMP_04":    {"zone": "CS1",  "val": 28.4, "unit": "°C", "normal": (25.0, 35.0), "warn": 50.0, "crit": 80.0},
            "LEVEL_01":   {"zone": "CS1",  "val": 72.0, "unit": "%", "normal": (60.0, 80.0), "warn": 90.0, "crit": 95.0},
            
            "TEMP_05":    {"zone": "CR1",  "val": 23.5, "unit": "°C", "normal": (21.0, 26.0), "warn": 30.0, "crit": 40.0},
            "SMOKE_01":   {"zone": "CR1",  "val": 0.02, "unit": "% OBS", "normal": (0.0, 0.05), "warn": 0.2, "crit": 0.5},
            
            "TEMP_06":    {"zone": "MW1",  "val": 31.0, "unit": "°C", "normal": (28.0, 36.0), "warn": 45.0, "crit": 60.0},
            "SMOKE_02":   {"zone": "MW1",  "val": 0.03, "unit": "% OBS", "normal": (0.0, 0.05), "warn": 0.2, "crit": 0.5}
        }
        self.sparklines: Dict[str, List[float]] = {k: [v["val"]]*20 for k, v in self.sensors.items()}
        self.latest_snapshot: Dict[str, Any] = {}
        self.compound_risk_score: float = 0.12

    def set_mode(self, new_mode: str):
        self.mode = new_mode
        self.ticks_in_mode = 0
        if new_mode == "NORMAL":
            # Reset values
            for k, v in self.sensors.items():
                v["val"] = round(random.uniform(*v["normal"]), 2)
            self.shift_status["changeover_active"] = False
        elif new_mode == "PRE_INCIDENT":
            # Add a mock confined space permit if not present so compound rule fires
            if not any(p["permit_type"] == "CONFINED_SPACE" for p in self.active_permits):
                self.active_permits.append({
                    "permit_id": "PTW-DEMO-001",
                    "permit_type": "CONFINED_SPACE",
                    "zone_id": "COB1",
                    "contractor_name": "Apex Industrial Services",
                    "work_description": "Cleaning & valve inspection in Battery #1 header"
                })
        elif new_mode == "INCIDENT":
            self.shift_status["changeover_active"] = True

    async def start_loop(self, supervisor_agent_callback=None):
        self.running = True
        while self.running:
            self.ticks_in_mode += 1
            self.update_sensor_values()
            
            # Build snapshot
            sensor_list = []
            snapshot_dict = {}
            for s_id, s_data in self.sensors.items():
                val = s_data["val"]
                warn = s_data["warn"]
                crit = s_data["crit"]
                
                status = "NORMAL"
                if val >= crit:
                    status = "CRITICAL"
                elif val >= warn:
                    status = "WARNING"
                    
                trend = "STABLE"
                sp = self.sparklines[s_id]
                if len(sp) >= 2:
                    diff = sp[-1] - sp[-2]
                    if diff > 0.1: trend = "RISING"
                    elif diff < -0.1: trend = "FALLING"
                    
                item = {
                    "sensor_id": s_id,
                    "zone_id": s_data["zone"],
                    "value": round(val, 2),
                    "unit": s_data["unit"],
                    "status": status,
                    "trend": trend,
                    "rate_of_change": round(random.uniform(0.1, 0.9), 2),
                    "sparkline": sp[-20:]
                }
                sensor_list.append(item)
                snapshot_dict[s_id] = item
                
            self.latest_snapshot = snapshot_dict
            
            # Evaluate compound risk
            risk_res = evaluate_compound_risks(
                sensor_snapshot=snapshot_dict,
                active_permits=self.active_permits,
                shift_status=self.shift_status,
                maintenance_log=[],
                worker_locations=self.worker_locations,
                simulation_mode=self.mode
            )
            self.compound_risk_score = risk_res["risk_score"]
            triggered_rules = risk_res["triggered_rules"]
            
            # If callback to supervisor graph
            if supervisor_agent_callback and len(triggered_rules) > 0:
                asyncio.create_task(supervisor_agent_callback({
                    "sensor_snapshot": snapshot_dict,
                    "active_permits": self.active_permits,
                    "shift_status": self.shift_status,
                    "worker_locations": self.worker_locations,
                    "compound_risks": triggered_rules,
                    "current_risk_score": self.compound_risk_score
                }))

            # Broadcast via WebSocket
            payload = {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "simulation_mode": self.mode,
                "sensors": sensor_list,
                "compound_risk_score": self.compound_risk_score,
                "active_rules_triggered": [r["id"] for r in triggered_rules],
                "zones_at_risk": list(set(r.get("historical_incident", "COB1")[:4] if "COB" in r.get("historical_incident", "") else "COB1" for r in triggered_rules)) if triggered_rules else [],
                "worker_count_at_risk": sum(w["count"] for w in self.worker_locations if w["zone_id"] == "COB1") if triggered_rules else 0,
                "time_to_threshold_minutes": max(5, int(45 - (self.compound_risk_score * 35)))
            }
            await ws_manager.broadcast_sensors(payload)
            await asyncio.sleep(2.0)

    def update_sensor_values(self):
        for s_id, s_data in self.sensors.items():
            norm_min, norm_max = s_data["normal"]
            cur = s_data["val"]
            
            if self.mode == "NORMAL":
                # Slight jitter around normal
                target = random.uniform(norm_min, norm_max)
                new_val = cur + (target - cur) * 0.2 + random.uniform(-0.1, 0.1)
                new_val = max(0.0, new_val)
            elif self.mode == "PRE_INCIDENT":
                # Gradual rise for COB1 H2S and CO
                if s_id == "GAS_H2S_01":
                    # climb towards 18.5 ppm
                    new_val = min(19.5, cur + random.uniform(0.4, 1.2))
                elif s_id == "GAS_CO_01":
                    new_val = min(65.0, cur + random.uniform(1.5, 3.5))
                elif s_id == "GAS_CH4_01":
                    new_val = min(28.0, cur + random.uniform(0.5, 1.5))
                else:
                    new_val = cur + random.uniform(-0.2, 0.2)
            elif self.mode == "INCIDENT":
                if s_id in ["GAS_H2S_01", "GAS_H2S_02"]:
                    new_val = min(35.0, cur + random.uniform(1.0, 2.5))
                elif s_id in ["GAS_CO_01", "GAS_CO_03"]:
                    new_val = min(120.0, cur + random.uniform(3.0, 8.0))
                elif s_id == "GAS_CH4_01":
                    new_val = min(55.0, cur + random.uniform(2.0, 4.0))
                else:
                    new_val = cur + random.uniform(-0.3, 0.3)
            else:
                new_val = cur

            s_data["val"] = round(new_val, 2)
            self.sparklines[s_id].append(s_data["val"])
            if len(self.sparklines[s_id]) > 30:
                self.sparklines[s_id].pop(0)

sensor_simulator = SensorSimulator()
