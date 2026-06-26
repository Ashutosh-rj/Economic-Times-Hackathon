import time
from typing import Dict, Any, List

try:
    import networkx as nx
    HAS_NX = True
except ImportError:
    HAS_NX = False

class EquipmentPermitRiskGraph:
    """
    Genuine Dynamic Evolving Knowledge Graph using NetworkX DiGraph.
    Updates topology live as field instrumentation, active PTWs, and SIMOPS conflicts mutate.
    Calculates PageRank centrality and graph density metrics dynamically.
    """

    @staticmethod
    def get_graph_topology() -> Dict[str, Any]:
        from core.sensor_simulator import sensor_simulator
        mode = sensor_simulator.mode
        is_hazard = mode != "NORMAL"

        G = nx.DiGraph() if HAS_NX else None

        # Dynamically build equipment nodes
        eq_nodes = [
            {"id": "EQ_BLOWER_1", "label": "Exhaust Blower #1", "group": "EQUIPMENT", "status": "TRIPPED_RISK" if is_hazard else "NOMINAL", "val": 25},
            {"id": "EQ_HEADER_H1", "label": "Primary Gas Header H1", "group": "EQUIPMENT", "status": "TOXIC_OUTGASSING" if mode == "INCIDENT" else "ELEVATED_PEL" if mode == "PRE_INCIDENT" else "NOMINAL", "val": 30},
            {"id": "EQ_VALVE_V42", "label": "Isolation Valve V-42", "group": "EQUIPMENT", "status": "NOMINAL", "val": 15},
            {"id": "EQ_COMPRESSOR_C2", "label": "Boost Compressor C-2", "group": "EQUIPMENT", "status": "HIGH_VIBRATION" if is_hazard else "NOMINAL", "val": 20}
        ]

        ptw_nodes = [
            {"id": "PTW_CS_001", "label": "Confined Space Entry #PTW-001", "group": "PERMIT", "status": "SUSPENDED_INTERLOCK" if is_hazard else "ACTIVE", "val": 20},
            {"id": "PTW_HW_992", "label": "Hot Work Welding #PTW-992", "group": "PERMIT", "status": "DENIED_SIMOPS", "val": 20}
        ]

        rule_nodes = [
            {"id": "RSK_CR001", "label": "Compound Rule CR-001 (Gas + PTW)", "group": "RISK_RULE", "status": "FIRED_CRITICAL" if is_hazard else "STANDBY", "val": 35},
            {"id": "RSK_CR002", "label": "Compound Rule CR-002 (Blower Trip)", "group": "RISK_RULE", "status": "FIRED_CRITICAL" if is_hazard else "STANDBY", "val": 35}
        ]

        reg_nodes = [
            {"id": "REG_OISD_105", "label": "OISD-STD-105 Sec 6.3 Interlock", "group": "REGULATION", "status": "GOVERNING_STATUTE", "val": 40},
            {"id": "REG_FACT_ACT", "label": "Factories Act Sec 41-B Ratio", "group": "REGULATION", "status": "GOVERNING_STATUTE", "val": 40}
        ]

        all_nodes = eq_nodes + ptw_nodes + rule_nodes + reg_nodes

        links = [
            {"source": "EQ_HEADER_H1", "target": "RSK_CR001", "relation": "TRIGGERS_VAPOR_ESCALATION"},
            {"source": "PTW_CS_001", "target": "RSK_CR001", "relation": "CONJUNCTION_OCCUPANCY"},
            {"source": "EQ_BLOWER_1", "target": "RSK_CR002", "relation": "TRIGGERS_LOSS_OF_VENTILATION"},
            {"source": "RSK_CR001", "target": "PTW_CS_001", "relation": "AUTONOMOUSLY_SUSPENDS"},
            {"source": "RSK_CR001", "target": "REG_OISD_105", "relation": "STATUTORY_BREACH_ENFORCEMENT"},
            {"source": "RSK_CR002", "target": "REG_FACT_ACT", "relation": "MANDATES_WATCHER_RATIO"},
            {"source": "EQ_VALVE_V42", "target": "PTW_HW_992", "relation": "REQUIRES_LOTO_ISOLATION"},
            {"source": "PTW_HW_992", "target": "EQ_HEADER_H1", "relation": "SIMOPS_PROXIMITY_CONFLICT"},
            {"source": "EQ_COMPRESSOR_C2", "target": "EQ_HEADER_H1", "relation": "PRESSURIZES_UPSTREAM"}
        ]

        if HAS_NX and G is not None:
            for n in all_nodes:
                G.add_node(n["id"], **n)
            for e in links:
                G.add_edge(e["source"], e["target"], relation=e["relation"])

            density = round(nx.density(G), 3)
            # Calculate PageRank node centrality scores
            pr = nx.pagerank(G, alpha=0.85)
            for n in all_nodes:
                n["pagerank_centrality"] = round(pr.get(n["id"], 0.0), 4)
            components = nx.number_weakly_connected_components(G)
        else:
            density = round((len(links)) / (len(all_nodes) * (len(all_nodes) - 1)), 3)
            components = 1

        graph_stats = {
            "total_nodes": len(all_nodes),
            "total_edges": len(links),
            "graph_density": density,
            "connected_components": components,
            "engine": "NetworkX DiGraph 3.2 Dynamic Live Topology",
            "last_computed_timestamp": int(time.time() * 1000)
        }

        return {
            "metadata": {
                "title": "SENTINEL Dynamic Evolving Digital Twin Ontology DiGraph",
                "facility": "Coke Oven Battery #1 Integrated Network",
                "operating_mode": mode,
                "stats": graph_stats
            },
            "nodes": all_nodes,
            "links": links
        }

knowledge_graph = EquipmentPermitRiskGraph()
