import math
from typing import Dict, Any, List

# True WGS84 GPS Coordinates centered on Visakhapatnam Steel Plant (Rashtriya Ispat Nigam Ltd)
PLANT_ZONES: Dict[str, Any] = {
    "COKE_OVEN_BATTERY_1": {
        "id": "COB1",
        "name": "Coke Oven Battery #1",
        "coordinates": {"x": 120, "y": 80},
        "gps": {
            "centroid": {"lat": 17.6294, "lng": 83.2045},
            "polygon": [
                {"lat": 17.6299, "lng": 83.2040},
                {"lat": 17.6299, "lng": 83.2050},
                {"lat": 17.6289, "lng": 83.2050},
                {"lat": 17.6289, "lng": 83.2040}
            ]
        },
        "area_sqm": 2400,
        "hazard_class": "Zone-1 (Explosive H2S / CO Gas Atmosphere)",
        "sensors": ["GAS_H2S_01", "GAS_CO_01", "TEMP_01", "PRESS_01"],
        "adjacent": ["COKE_OVEN_BATTERY_2", "CHEMICAL_STORAGE"]
    },
    "COKE_OVEN_BATTERY_2": {
        "id": "COB2",
        "name": "Coke Oven Battery #2",
        "coordinates": {"x": 280, "y": 80},
        "gps": {
            "centroid": {"lat": 17.6294, "lng": 83.2058},
            "polygon": [
                {"lat": 17.6299, "lng": 83.2053},
                {"lat": 17.6299, "lng": 83.2063},
                {"lat": 17.6289, "lng": 83.2063},
                {"lat": 17.6289, "lng": 83.2053}
            ]
        },
        "area_sqm": 2400,
        "hazard_class": "Zone-1",
        "sensors": ["GAS_H2S_02", "GAS_CO_02", "TEMP_02", "PRESS_02"],
        "adjacent": ["COKE_OVEN_BATTERY_1", "BLAST_FURNACE", "CONTROL_ROOM"]
    },
    "BLAST_FURNACE": {
        "id": "BF1",
        "name": "Blast Furnace GCP Area",
        "coordinates": {"x": 450, "y": 150},
        "gps": {
            "centroid": {"lat": 17.6308, "lng": 83.2072},
            "polygon": [
                {"lat": 17.6315, "lng": 83.2065},
                {"lat": 17.6315, "lng": 83.2080},
                {"lat": 17.6300, "lng": 83.2080},
                {"lat": 17.6300, "lng": 83.2065}
            ]
        },
        "area_sqm": 3600,
        "hazard_class": "Zone-0 (Continuous Flammable Outgassing)",
        "sensors": ["GAS_CO_03", "GAS_CH4_01", "TEMP_03", "VIBRATION_01"],
        "adjacent": ["COKE_OVEN_BATTERY_2", "MAINTENANCE_WORKSHOP"]
    },
    "CHEMICAL_STORAGE": {
        "id": "CS1",
        "name": "Chemical Storage Yard",
        "coordinates": {"x": 180, "y": 280},
        "gps": {
            "centroid": {"lat": 17.6280, "lng": 83.2045},
            "polygon": [
                {"lat": 17.6286, "lng": 83.2039},
                {"lat": 17.6286, "lng": 83.2051},
                {"lat": 17.6274, "lng": 83.2051},
                {"lat": 17.6274, "lng": 83.2039}
            ]
        },
        "area_sqm": 1200,
        "hazard_class": "Zone-1",
        "sensors": ["GAS_H2S_03", "GAS_NH3_01", "TEMP_04", "LEVEL_01"],
        "adjacent": ["COKE_OVEN_BATTERY_1", "CONTROL_ROOM"]
    },
    "CONTROL_ROOM": {
        "id": "CR1",
        "name": "Central Control Room",
        "coordinates": {"x": 350, "y": 300},
        "gps": {
            "centroid": {"lat": 17.6280, "lng": 83.2062},
            "polygon": [
                {"lat": 17.6284, "lng": 83.2057},
                {"lat": 17.6284, "lng": 83.2067},
                {"lat": 17.6276, "lng": 83.2067},
                {"lat": 17.6276, "lng": 83.2057}
            ]
        },
        "area_sqm": 400,
        "hazard_class": "Zone-2 (Safe Positive Pressure Vault)",
        "sensors": ["TEMP_05", "SMOKE_01"],
        "adjacent": ["COKE_OVEN_BATTERY_2", "CHEMICAL_STORAGE", "MAINTENANCE_WORKSHOP"]
    },
    "MAINTENANCE_WORKSHOP": {
        "id": "MW1",
        "name": "Maintenance Workshop",
        "coordinates": {"x": 520, "y": 320},
        "gps": {
            "centroid": {"lat": 17.6282, "lng": 83.2080},
            "polygon": [
                {"lat": 17.6288, "lng": 83.2073},
                {"lat": 17.6288, "lng": 83.2087},
                {"lat": 17.6276, "lng": 83.2087},
                {"lat": 17.6276, "lng": 83.2073}
            ]
        },
        "area_sqm": 800,
        "hazard_class": "Zone-2",
        "sensors": ["TEMP_06", "SMOKE_02"],
        "adjacent": ["BLAST_FURNACE", "CONTROL_ROOM"]
    }
}

def haversine_gps_distance(zone1_key: str, zone2_key: str) -> float:
    """Calculates true Earth surface geodesic distance in meters between zone centroids."""
    if zone1_key not in PLANT_ZONES or zone2_key not in PLANT_ZONES:
        return 999.0
    g1 = PLANT_ZONES[zone1_key]["gps"]["centroid"]
    g2 = PLANT_ZONES[zone2_key]["gps"]["centroid"]
    
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(g1["lat"])
    phi2 = math.radians(g2["lat"])
    delta_phi = math.radians(g2["lat"] - g1["lat"])
    delta_lambda = math.radians(g2["lng"] - g1["lng"])

    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_distance(zone1_key: str, zone2_key: str) -> float:
    """Legacy compatibility wrapper utilizing true Haversine GPS calculations."""
    return haversine_gps_distance(zone1_key, zone2_key)

def get_adjacent_zones(zone_key: str) -> List[str]:
    zone = PLANT_ZONES.get(zone_key)
    return zone["adjacent"] if zone else []

def get_zone_by_id(short_id: str) -> str:
    for k, v in PLANT_ZONES.items():
        if v["id"] == short_id:
            return k
    return "COKE_OVEN_BATTERY_1"

def generate_geojson_overlay(risk_score: float = 0.15, wind_bearing: int = 135, wind_speed_kmh: float = 14.5) -> Dict[str, Any]:
    """
    Generates standard WGS84 GeoJSON FeatureCollection with dynamic hazard buffer radii
    and wind dispersion plume vectors for GIS rendering engines (Leaflet / Mapbox).
    """
    features = []
    
    for z_k, z_data in PLANT_ZONES.items():
        is_cob = z_k == "COKE_OVEN_BATTERY_1"
        z_risk = "CRITICAL" if (is_cob and risk_score >= 0.75) else "HIGH" if (is_cob and risk_score >= 0.40) else "LOW"
        
        # Polygon feature
        poly_coords = [[p["lng"], p["lat"]] for p in z_data["gps"]["polygon"]]
        poly_coords.append(poly_coords[0])  # close loop
        
        features.append({
            "type": "Feature",
            "properties": {
                "zone_key": z_k,
                "zone_id": z_data["id"],
                "name": z_data["name"],
                "hazard_class": z_data["hazard_class"],
                "risk_level": z_risk,
                "compound_risk_score": risk_score if is_cob else round(risk_score * 0.3, 2),
                "active_workers": 6 if is_cob else 4
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly_coords]
            }
        })
        
        # Plume Dispersion Vector (LineString) if Critical
        if z_risk == "CRITICAL":
            c_lat = z_data["gps"]["centroid"]["lat"]
            c_lng = z_data["gps"]["centroid"]["lng"]
            # Plume length based on wind speed (e.g. 200m)
            plume_dist_deg = 0.0025 * (wind_speed_kmh / 10.0)
            p_lat = c_lat + plume_dist_deg * math.cos(math.radians(wind_bearing))
            p_lng = c_lng + plume_dist_deg * math.sin(math.radians(wind_bearing))
            
            features.append({
                "type": "Feature",
                "properties": {
                    "type": "WIND_PLUME_VECTOR",
                    "wind_bearing_deg": wind_bearing,
                    "wind_speed_kmh": wind_speed_kmh,
                    "dispersion_hazard": "IDLH H2S VAPOR DISPERSION"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [c_lng, c_lat],
                        [p_lng, p_lat]
                    ]
                }
            })

    return {
        "type": "FeatureCollection",
        "metadata": {
            "facility": "Rashtriya Ispat Nigam Ltd (Visakhapatnam Steel Plant)",
            "crs": "urn:ogc:def:crs:OGC:1.3:CRS84",
            "meteorology": {
                "wind_bearing": wind_bearing,
                "wind_direction_compass": "SE",
                "wind_speed_kmh": wind_speed_kmh
            }
        },
        "features": features
    }
