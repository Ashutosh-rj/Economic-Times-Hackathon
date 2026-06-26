from fastapi import APIRouter
from core.sensor_simulator import sensor_simulator
from core.geospatial import PLANT_ZONES
from core.risk_engine import COMPOUND_RULES

router = APIRouter(tags=["sensors"])

@router.get("/sensors/live")
async def get_live_sensors():
    return {
        "simulation_mode": sensor_simulator.mode,
        "compound_risk_score": sensor_simulator.compound_risk_score,
        "sensors": list(sensor_simulator.latest_snapshot.values())
    }

@router.get("/sensors/{sensor_id}/history")
async def get_sensor_history(sensor_id: str, minutes: int = 30):
    sparkline = sensor_simulator.sparklines.get(sensor_id, [0.0]*20)
    return {
        "sensor_id": sensor_id,
        "minutes": minutes,
        "history": sparkline
    }

@router.get("/zones")
async def get_zones():
    # Return zones with live risk info
    zones_list = []
    score = sensor_simulator.compound_risk_score
    for z_k, z_data in PLANT_ZONES.items():
        z_risk = "LOW"
        if sensor_simulator.mode in ["PRE_INCIDENT", "INCIDENT"] and "COB" in z_k:
            z_risk = "CRITICAL" if score > 0.7 else "HIGH"
        elif sensor_simulator.mode == "INCIDENT":
            z_risk = "HIGH"
        zones_list.append({
            "key": z_k,
            **z_data,
            "current_risk_level": z_risk,
            "risk_score": score if "COB" in z_k else round(score * 0.4, 2)
        })
    return zones_list

@router.get("/zones/{zone_id}/risk")
async def get_zone_risk(zone_id: str):
    score = sensor_simulator.compound_risk_score if "COB" in zone_id else 0.15
    return {
        "zone_id": zone_id,
        "compound_risk_score": score,
        "active_rules": [r["id"] for r in COMPOUND_RULES if "COB" in r.get("historical_incident", "")],
        "workers_at_risk": 6 if "COB" in zone_id else 4
    }

@router.get("/analytics/false-negatives")
async def get_false_negatives_benchmark():
    from eval.eval_harness import FalseNegativeEvalHarness
    return FalseNegativeEvalHarness.run_benchmark()

@router.get("/geospatial/geojson")
async def get_facility_geojson():
    from core.geospatial import generate_geojson_overlay
    from core.sensor_simulator import sensor_simulator
    return generate_geojson_overlay(
        risk_score=sensor_simulator.compound_risk_score,
        wind_bearing=135,
        wind_speed_kmh=14.5
    )

@router.get("/graph/topology")
async def get_knowledge_graph():
    from core.knowledge_graph import EquipmentPermitRiskGraph
    return EquipmentPermitRiskGraph.get_graph_topology()

@router.get("/cmms/orders")
async def get_cmms_orders():
    from core.cmms_stream import cmms_stream
    from core.sensor_simulator import sensor_simulator
    return cmms_stream.get_active_work_orders(sensor_simulator.mode)

@router.get("/cctv/analytics")
async def get_cctv_analytics():
    from core.cctv_stream import cctv_stream
    from core.sensor_simulator import sensor_simulator
    return cctv_stream.get_latest_vision_analytics(sensor_simulator.mode)

@router.get("/compliance/audit")
async def get_statutory_compliance_audit():
    from agents.compliance_agent import compliance_audit_agent
    from core.sensor_simulator import sensor_simulator
    return compliance_audit_agent.audit_facility_compliance(sensor_simulator.mode)




