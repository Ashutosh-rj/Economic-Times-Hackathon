import time
import math
import random
from typing import Dict, Any, List

class CCTVAnalyticsStream:
    """
    Kinematic Optical Edge AI Vision Telemetry Stream.
    Outputs dynamic bounding box matrices [x1, y1, x2, y2] updating spatial coordinates
    continuously over frame viewports via physics-based velocity vector tracking.
    """
    def __init__(self):
        # Initialize dynamic kinematic state for tracked personnel
        self.tracked_workers = [
            {"id": "W-01", "box": [140.0, 85.0, 190.0, 205.0], "vx": 1.2, "vy": 0.5, "ppe_viol": True},
            {"id": "W-02", "box": [215.0, 105.0, 270.0, 235.0], "vx": -0.8, "vy": 0.3, "ppe_viol": False},
            {"id": "W-03", "box": [310.0, 120.0, 365.0, 250.0], "vx": 0.5, "vy": -0.6, "ppe_viol": False}
        ]
        self.last_update = time.time()

    def _step_kinematics(self, is_hazard: bool):
        now = time.time()
        dt = min(0.5, now - self.last_update)
        self.last_update = now

        for w in self.tracked_workers:
            # Random walk velocity mutation
            w["vx"] += random.uniform(-0.2, 0.2)
            w["vy"] += random.uniform(-0.2, 0.2)
            
            # Speed cap
            w["vx"] = max(-3.0, min(3.0, w["vx"]))
            w["vy"] = max(-3.0, min(3.0, w["vy"]))

            # Position step
            w["box"][0] += w["vx"]
            w["box"][1] += w["vy"]
            w["box"][2] += w["vx"]
            w["box"][3] += w["vy"]

            # Viewport boundary reflection (viewport size 640x480)
            if w["box"][0] < 10 or w["box"][2] > 630: w["vx"] *= -1
            if w["box"][1] < 10 or w["box"][3] > 470: w["vy"] *= -1

    def get_latest_vision_analytics(self, mode: str = "PRE_INCIDENT") -> Dict[str, Any]:
        is_hazard = mode in ["PRE_INCIDENT", "INCIDENT"]
        self._step_kinematics(is_hazard)
        
        violations = []
        if is_hazard:
            w1 = self.tracked_workers[0]
            violations.append({
                "violation_id": "CV-PPE-01",
                "type": "MISSING_HARD_HAT_OR_RESPIRATOR",
                "confidence": round(random.uniform(0.91, 0.97), 2),
                "bounding_box": [int(x) for x in w1["box"]],
                "severity": "STATUTORY_VIOLATION"
            })
            w2 = self.tracked_workers[1]
            violations.append({
                "violation_id": "CV-ZONE-02",
                "type": "EXCLUSION_BOUNDARY_INTRUSION",
                "confidence": round(random.uniform(0.95, 0.99), 2),
                "bounding_box": [int(x) for x in w2["box"]],
                "severity": "CRITICAL_TRAP_DANGER"
            })

        return {
            "modality_engine": "Kinematic Optical Vision Replay Simulator v2.4",
            "connection_status": "LOCAL_SIMULATED_TESTBED (No Live ONVIF/RTSP Optical Hardware Attached)",
            "data_provenance": "Generated via stateful software kinematic bounding box replay",
            "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "active_cameras_online": 18,
            "zones_monitored": {
                "COKE_OVEN_BATTERY_1": {
                    "camera_id": "CAM-COB1-04 (Simulated Viewport)",
                    "personnel_detected_count": len(self.tracked_workers) if is_hazard else 2,
                    "ppe_compliance_rate_pct": 66.7 if is_hazard else 100.0,
                    "violations": violations,
                    "smoke_plume_detected": mode == "INCIDENT",
                    "crowd_density_index": "HIGH_SIMOPS_CONGESTION" if is_hazard else "NOMINAL",
                    "live_worker_trajectories": [{"worker_id": w["id"], "bbox": [int(x) for x in w["box"]]} for w in self.tracked_workers]
                },
                "BLAST_FURNACE": {
                    "camera_id": "CAM-BF1-02",
                    "personnel_detected_count": 4,
                    "ppe_compliance_rate_pct": 100.0,
                    "violations": [],
                    "smoke_plume_detected": False,
                    "crowd_density_index": "NOMINAL"
                }
            }
        }

cctv_stream = CCTVAnalyticsStream()
