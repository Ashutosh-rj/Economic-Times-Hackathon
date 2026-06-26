from typing import TypedDict, Optional, List, Dict, Any
from langgraph.graph import StateGraph, END
from agents.compound_risk_agent import compound_risk_node
from agents.permit_intelligence_agent import permit_intelligence_node
from agents.incident_rag_agent import rag_agent_node
from agents.emergency_orchestrator import emergency_orchestrator_node

class SentinelState(TypedDict, total=False):
    sensor_snapshot: dict
    active_permits: list
    shift_status: dict
    worker_locations: list
    compound_risks: list
    permit_decisions: list
    rag_query: Optional[str]
    rag_response: Optional[dict]
    emergency_triggered: bool
    emergency_report: Optional[dict]
    current_risk_score: float
    alerts_to_emit: list

async def sensor_ingestion_node(state: Dict[str, Any]) -> Dict[str, Any]:
    # Ingestion pass-through
    return {"sensor_snapshot": state.get("sensor_snapshot", {})}

async def alert_emitter_node(state: Dict[str, Any]) -> Dict[str, Any]:
    alerts = state.get("alerts_to_emit", [])
    if alerts:
        from core.websocket_manager import ws_manager
        for a in alerts:
            await ws_manager.broadcast_alert(a)
    return {"alerts_to_emit": alerts}

def route_emergency(state: Dict[str, Any]) -> str:
    score = state.get("current_risk_score", 0.0)
    if score >= 0.85 or state.get("emergency_triggered", False):
        return "emergency"
    return "normal"

# Build Graph
graph = StateGraph(SentinelState)

graph.add_node("sensor_ingestion", sensor_ingestion_node)
graph.add_node("compound_risk_detector", compound_risk_node)
graph.add_node("permit_intelligence", permit_intelligence_node)
graph.add_node("rag_agent", rag_agent_node)
graph.add_node("emergency_orchestrator", emergency_orchestrator_node)
graph.add_node("alert_emitter", alert_emitter_node)

graph.set_entry_point("sensor_ingestion")
graph.add_edge("sensor_ingestion", "compound_risk_detector")
graph.add_edge("compound_risk_detector", "permit_intelligence")

graph.add_conditional_edges(
    "compound_risk_detector",
    route_emergency,
    {
        "emergency": "emergency_orchestrator",
        "normal": "alert_emitter"
    }
)

graph.add_edge("permit_intelligence", "alert_emitter")
graph.add_edge("emergency_orchestrator", "alert_emitter")
graph.add_edge("alert_emitter", END)
graph.add_edge("rag_agent", END)

compiled_graph = graph.compile()
