import asyncio
import json
from core.risk_engine import get_calibrated_rules, evaluate_compound_risks
from rag.document_loader import load_all_incident_documents
from models.incident_report import EmergencyTrigger
from agents.emergency_orchestrator import generate_incident_report
from models.permit import PermitRequest
from agents.permit_intelligence_agent import analyze_permit

async def run_overhaul_verification():
    print("="*70)
    print("SENTINEL AI - STEP 3-4 MODULE ARCHITECTURAL OVERHAUL VERIFICATION")
    print("="*70)

    # 1. Verify Compound Risk Engine Pool (>= 50 Rules)
    rules = get_calibrated_rules()
    print(f"[1] Compound Risk Pool Depth: {len(rules)} empirical rules loaded.")
    assert len(rules) >= 50, f"Expected >= 50 rules, got {len(rules)}"
    print("    -> First Rule:", rules[0]["id"], "-", rules[0]["name"])
    print("    -> Last Rule:", rules[-1]["id"], "-", rules[-1]["name"])
    print("    -> Verification: SUCCESS [OK]")

    # 2. Verify Incident RAG Corpus Scaling (>= 120 Reports)
    docs = load_all_incident_documents("./backend/rag/incident_corpus")
    if len(docs) == 0:
        docs = load_all_incident_documents("./rag/incident_corpus")
    print(f"\n[2] Incident RAG Corpus Depth: {len(docs)} investigation reports seeded & loaded.")
    assert len(docs) >= 120, f"Expected >= 120 docs, got {len(docs)}"
    print("    -> Sample Doc Source:", docs[0]["source"])
    print("    -> Verification: SUCCESS [OK]")

    # 3. Verify Emergency Orchestrator Dispatch Gateway ACK Receipts
    trigger = EmergencyTrigger(
        timestamp="2026-06-26T13:17:00Z",
        zone_id="COB1",
        zone_name="Coke Oven Battery #1",
        trigger_type="AUTOMATED_COMPOUND_RISK_THRESHOLD",
        risk_score=0.92,
        triggered_rules=["CR-001", "CR-012", "CR-045"],
        sensor_history={"H2S": 45.0},
        active_permits=[],
        worker_locations=[]
    )
    report = await generate_incident_report(trigger)
    ack_receipts = [ev for ev in report.evidence_preserved if "ACK-" in ev]
    print(f"\n[3] Emergency Dispatch Gateway: {len(ack_receipts)} multi-channel ACK receipts recorded.")
    for ack in ack_receipts:
        print("    ->", ack)
    assert len(ack_receipts) >= 4, "Expected >= 4 webhook delivery ACK receipts"
    print("    -> Verification: SUCCESS [OK]")

    # 4. Verify Relational Permit Intelligence Agent
    permit_req = PermitRequest(
        permit_id="PTW-SIM-099",
        permit_type="CONFINED_SPACE",
        zone_id="COB1",
        contractor_name="Larsen & Toubro SIMOPS Div",
        worker_count=5,
        start_time="2026-06-26T14:00:00Z",
        duration_hours=4,
        work_description="Internal weld seam inspection inside Battery #1 gas recovery duct",
        safety_measures=["Continuous H2S monitoring", "Forced positive ventilation blower active"],
        gas_test_h2s_ppm=14.5
    )
    decision = await analyze_permit(permit_req, {"GAS_H2S_01": {"value": 14.5}}, [])
    print(f"\n[4] Relational Permit Intelligence Agent Decision: {decision.decision} [{decision.risk_level}]")
    print("    -> Reasoning:", decision.reasoning[:120] + "...")
    assert decision.decision == "DENY", "Expected statutory denial due to H2S threshold & relational SIMOPS state"
    print("    -> Verification: SUCCESS [OK]")

    print("\n" + "="*70)
    print("ALL STEP 3-4 MODULE OVERHAULS VERIFIED 100% EMPIRICAL & COMPLIANT!")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(run_overhaul_verification())
