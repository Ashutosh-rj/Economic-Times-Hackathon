from typing import Dict, Any, List

class CCTVAnalyticsStream:
    """
    Simulated Optical Edge AI Vision Telemetry Stream.
    Outputs normalized bounding box matrices [x1, y1, x2, y2] and classification confidence
    percentages rendered live on the frontend HTML5 Computer Vision Canvas.
    Transparently designed for instantaneous 15 FPS hackathon live demonstration without GPU overhead.
    """

    @staticmethod
    def get_latest_vision_analytics(mode: str = "PRE_INCIDENT") -> Dict[str, Any]:
        is_hazard = mode in ["PRE_INCIDENT", "INCIDENT"]
        
        return {
            "modality_engine": "Simulated Optical Edge AI Telemetry (HTML5 Canvas Engine v2)",
            "timestamp_utc": "LIVE_15FPS_VISION_STREAM",
            "active_cameras_online": 18,
            "zones_monitored": {
                "COKE_OVEN_BATTERY_1": {
                    "camera_id": "CAM-COB1-04 (Thermal + Optical Vision Viewport)",
                    "personnel_detected_count": 6 if is_hazard else 2,
                    "ppe_compliance_rate_pct": 66.7 if is_hazard else 100.0,
                    "violations": [
                        {
                            "violation_id": "CV-PPE-01",
                            "type": "MISSING_HARD_HAT_OR_RESPIRATOR",
                            "confidence": 0.94,
                            "bounding_box": [142, 88, 195, 210],
                            "severity": "STATUTORY_VIOLATION"
                        },
                        {
                            "violation_id": "CV-ZONE-02",
                            "type": "EXCLUSION_BOUNDARY_INTRUSION",
                            "confidence": 0.98,
                            "bounding_box": [220, 110, 275, 240],
                            "severity": "CRITICAL_TRAP_DANGER"
                        }
                    ] if is_hazard else [],
                    "smoke_plume_detected": mode == "INCIDENT",
                    "crowd_density_index": "HIGH_SIMOPS_CONGESTION" if is_hazard else "NOMINAL"
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
