import time
from typing import Dict, Any, List
import random

class TimeSeriesSensorFusionAgent:
    """
    Sensor Fusion Agent (Autonomous LangGraph Agent 6).
    Computes multi-modal exponential moving averages (EMA), threshold crossing velocity (TCV),
    and differential rate-of-change across streaming plant time-series sparklines.
    """

    @staticmethod
    def analyze_trend_kinetics(sensor_snapshot: Dict[str, Any], mode: str = "PRE_INCIDENT") -> Dict[str, Any]:
        """
        Derives predictive velocity metrics over raw sensor buffers.
        """
        fusion_metrics = {}
        highest_velocity_sensor = None
        max_rate = -1.0

        for s_id, s_data in sensor_snapshot.items():
            val = s_data.get("value", 1.0)
            sparkline = s_data.get("sparkline", [val]*10)
            
            # Compute Exponential Moving Average (EMA) alpha=0.3
            ema = sparkline[0]
            alpha = 0.3
            for pt in sparkline[1:]:
                ema = alpha * pt + (1.0 - alpha) * ema

            # Compute Differential Rate of Change (dP/dt or dC/dt)
            if len(sparkline) >= 3:
                delta_t_sec = 4.0 # 2 ticks * 2s
                dp_dt = (sparkline[-1] - sparkline[-3]) / delta_t_sec
            else:
                dp_dt = 0.0

            # Compute Threshold Crossing Velocity (sec to IDLH breach)
            crit_threshold = 25.0 if "H2S" in s_id else 100.0 if "CO" in s_id else 50.0
            gap = crit_threshold - val
            if dp_dt > 0.01:
                tcv_seconds = round(gap / dp_dt, 1)
            else:
                tcv_seconds = 9999.0

            if dp_dt > max_rate:
                max_rate = dp_dt
                highest_velocity_sensor = s_id

            fusion_metrics[s_id] = {
                "current_value": val,
                "exponential_moving_average_ema": round(ema, 2),
                "differential_velocity_unit_per_sec": round(dp_dt, 4),
                "threshold_crossing_velocity_tcv_sec": tcv_seconds if tcv_seconds > 0 else 0.0,
                "kinetics_classification": "ACUTE_ESCALATION" if dp_dt > 0.5 else "CREEPING_HAZARD" if dp_dt > 0.1 else "STABLE_EQUILIBRIUM"
            }

        return {
            "agent_designation": "Agent 6: Autonomous Time-Series Sensor Fusion Kinetics Director",
            "timestamp_ms": int(time.time() * 1000),
            "operating_mode_evaluated": mode,
            "governing_acute_vector": highest_velocity_sensor or "GAS_H2S_01",
            "sensor_fusion_kinetics": fusion_metrics,
            "supervisor_recommendation": "ACTIVATE_PREEMPTIVE_EVACUATION_SIREN" if max_rate > 0.4 else "ENFORCE_CONTINUOUS_VENTILATION_MONITORING"
        }

sensor_fusion_agent = TimeSeriesSensorFusionAgent()
