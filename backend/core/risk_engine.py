from typing import List, Dict, Any

COMPOUND_RULES: List[Dict[str, Any]] = [
    {
        "id": "CR-001",
        "name": "Confined Space + Gas Accumulation",
        "conditions": [
            "active_permit.type == 'CONFINED_SPACE'",
            "zone_gas_ppm > 25",
            "ventilation_status == 'OFF'"
        ],
        "severity": "CRITICAL",
        "lead_time_minutes": 45,
        "regulation": "OISD-STD-105 Clause 6.3",
        "historical_incident": "Vizag Steel Plant 2025"
    },
    {
        "id": "CR-002",
        "name": "Hot Work + Elevated Hydrocarbon",
        "conditions": [
            "active_permit.type == 'HOT_WORK'",
            "ch4_ppm > 500 OR hydrocarbon_ppm > 300",
            "distance_to_source < 15"
        ],
        "severity": "CRITICAL",
        "lead_time_minutes": 20,
        "regulation": "OISD-STD-018 Clause 8.1",
        "historical_incident": "Bhilai Gas Leak 2023"
    },
    {
        "id": "CR-003",
        "name": "Shift Changeover + Maintenance Window",
        "conditions": [
            "shift_changeover_active == True",
            "equipment_under_maintenance > 2",
            "handover_documentation_gap == True"
        ],
        "severity": "HIGH",
        "lead_time_minutes": 90,
        "regulation": "Factory Act Section 36",
        "historical_incident": "HPCL Mumbai 2020"
    },
    {
        "id": "CR-004",
        "name": "Multiple Simultaneous Permits in Adjacent Zones",
        "conditions": [
            "simultaneous_permits_same_zone >= 3",
            "any_permit.type in ['HOT_WORK', 'CONFINED_SPACE']",
            "safety_officer_count < 2"
        ],
        "severity": "HIGH",
        "lead_time_minutes": 60,
        "regulation": "DGMS Circular 2019-08",
        "historical_incident": "Pattern — 12 incidents 2018-2024"
    },
    {
        "id": "CR-005",
        "name": "Worker Density + Chemical Exposure",
        "conditions": [
            "workers_in_zone > 8",
            "h2s_ppm > 10 OR co_ppm > 50",
            "wind_direction == 'INTO_ZONE'"
        ],
        "severity": "HIGH",
        "lead_time_minutes": 30,
        "regulation": "OISD-STD-155 Clause 4.2",
        "historical_incident": "NTPC Unchahar 2017"
    }
]

def evaluate_compound_risks(
    sensor_snapshot: Dict[str, Any],
    active_permits: List[Dict[str, Any]],
    shift_status: Dict[str, Any],
    maintenance_log: List[Dict[str, Any]],
    worker_locations: List[Dict[str, Any]],
    simulation_mode: str = "NORMAL"
) -> Dict[str, Any]:
    triggered_rules = []
    base_score = 0.12

    # Check COB1 gas readings for CR-001 & CR-005
    cob1_h2s = sensor_snapshot.get("GAS_H2S_01", {}).get("value", 3.2)
    cob1_co = sensor_snapshot.get("GAS_CO_01", {}).get("value", 15.0)
    bf1_ch4 = sensor_snapshot.get("GAS_CH4_01", {}).get("value", 5.0)

    # Check permits
    has_confined = any(p.get("permit_type") == "CONFINED_SPACE" for p in active_permits)
    has_hot_work = any(p.get("permit_type") == "HOT_WORK" for p in active_permits)

    if simulation_mode in ["PRE_INCIDENT", "INCIDENT"]:
        # Simulate conditions firing based on gas levels
        if cob1_h2s >= 10.0 or cob1_co >= 50.0:
            triggered_rules.append(COMPOUND_RULES[0])  # CR-001
            base_score = min(0.95, base_score + 0.45)
        if bf1_ch4 >= 25.0 or simulation_mode == "INCIDENT":
            triggered_rules.append(COMPOUND_RULES[1])  # CR-002
            base_score = min(0.95, base_score + 0.35)
        # Evaluate active maintenance work orders from SAP CMMS
        active_cmms = maintenance_log if maintenance_log else []
        if not active_cmms:
            try:
                from core.cmms_stream import cmms_stream
                active_cmms = cmms_stream.get_active_work_orders(simulation_mode)
            except Exception:
                pass
        has_active_maint = any(wo.get("status") == "IN_PROGRESS" for wo in active_cmms)

        if shift_status.get("changeover_active", False) or has_active_maint or simulation_mode == "INCIDENT":
            triggered_rules.append(COMPOUND_RULES[2])  # CR-003
            base_score = min(0.95, base_score + 0.20)
        if len(active_permits) >= 2 or simulation_mode == "INCIDENT":
            triggered_rules.append(COMPOUND_RULES[3])  # CR-004
            base_score = min(0.95, base_score + 0.15)
        if cob1_h2s >= 15.0:
            if COMPOUND_RULES[4] not in triggered_rules:
                triggered_rules.append(COMPOUND_RULES[4])  # CR-005
            base_score = min(0.95, base_score + 0.25)
    else:
        # In normal mode, if user explicitly created a confined space permit while gas is slightly elevated
        if has_confined and cob1_h2s > 8.0:
            triggered_rules.append(COMPOUND_RULES[0])
            base_score = 0.55
        if has_hot_work and bf1_ch4 > 15.0:
            triggered_rules.append(COMPOUND_RULES[1])
            base_score = 0.60

    return {
        "triggered_rules": triggered_rules,
        "risk_score": round(base_score, 2)
    }
