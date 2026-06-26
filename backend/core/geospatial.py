import math
from typing import Dict, Any, List

PLANT_ZONES: Dict[str, Any] = {
    "COKE_OVEN_BATTERY_1": {
        "id": "COB1",
        "name": "Coke Oven Battery #1",
        "coordinates": {"x": 120, "y": 80},
        "area_sqm": 2400,
        "hazard_class": "Zone-1",
        "sensors": ["GAS_H2S_01", "GAS_CO_01", "TEMP_01", "PRESS_01"],
        "adjacent": ["COKE_OVEN_BATTERY_2", "CHEMICAL_STORAGE"]
    },
    "COKE_OVEN_BATTERY_2": {
        "id": "COB2",
        "name": "Coke Oven Battery #2",
        "coordinates": {"x": 280, "y": 80},
        "area_sqm": 2400,
        "hazard_class": "Zone-1",
        "sensors": ["GAS_H2S_02", "GAS_CO_02", "TEMP_02", "PRESS_02"],
        "adjacent": ["COKE_OVEN_BATTERY_1", "BLAST_FURNACE", "CONTROL_ROOM"]
    },
    "BLAST_FURNACE": {
        "id": "BF1",
        "name": "Blast Furnace Area",
        "coordinates": {"x": 450, "y": 150},
        "area_sqm": 3600,
        "hazard_class": "Zone-0",
        "sensors": ["GAS_CO_03", "GAS_CH4_01", "TEMP_03", "VIBRATION_01"],
        "adjacent": ["COKE_OVEN_BATTERY_2", "MAINTENANCE_WORKSHOP"]
    },
    "CHEMICAL_STORAGE": {
        "id": "CS1",
        "name": "Chemical Storage Yard",
        "coordinates": {"x": 180, "y": 280},
        "area_sqm": 1200,
        "hazard_class": "Zone-1",
        "sensors": ["GAS_H2S_03", "GAS_NH3_01", "TEMP_04", "LEVEL_01"],
        "adjacent": ["COKE_OVEN_BATTERY_1", "CONTROL_ROOM"]
    },
    "CONTROL_ROOM": {
        "id": "CR1",
        "name": "Central Control Room",
        "coordinates": {"x": 350, "y": 300},
        "area_sqm": 400,
        "hazard_class": "Zone-2",
        "sensors": ["TEMP_05", "SMOKE_01"],
        "adjacent": ["COKE_OVEN_BATTERY_2", "CHEMICAL_STORAGE", "MAINTENANCE_WORKSHOP"]
    },
    "MAINTENANCE_WORKSHOP": {
        "id": "MW1",
        "name": "Maintenance Workshop",
        "coordinates": {"x": 520, "y": 320},
        "area_sqm": 800,
        "hazard_class": "Zone-2",
        "sensors": ["TEMP_06", "SMOKE_02"],
        "adjacent": ["BLAST_FURNACE", "CONTROL_ROOM"]
    }
}

def calculate_distance(zone1_key: str, zone2_key: str) -> float:
    if zone1_key not in PLANT_ZONES or zone2_key not in PLANT_ZONES:
        return 999.0
    c1 = PLANT_ZONES[zone1_key]["coordinates"]
    c2 = PLANT_ZONES[zone2_key]["coordinates"]
    # Convert SVG units (~0.25 meters per unit)
    dx = (c1["x"] - c2["x"]) * 0.25
    dy = (c1["y"] - c2["y"]) * 0.25
    return math.sqrt(dx * dx + dy * dy)

def get_adjacent_zones(zone_key: str) -> List[str]:
    zone = PLANT_ZONES.get(zone_key)
    return zone["adjacent"] if zone else []

def get_zone_by_id(short_id: str) -> str:
    for k, v in PLANT_ZONES.items():
        if v["id"] == short_id:
            return k
    return "COKE_OVEN_BATTERY_1"
