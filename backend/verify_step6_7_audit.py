import asyncio
import json
import os
from core.live_weather_connector import LiveOpenMeteoWeatherConnector
from eval.ablation_study import ComparativeAblationHarness
from benchmark_latency import SentinelLatencyBenchmarkHarness
from core.scada_gateway import VirtualModbusSCADAGateway
from core.cctv_stream import cctv_stream

def verify_step6_and_7_technical_rigor_overhaul():
    print("="*75)
    print("SENTINEL AI - STEP 6 & STEP 7 TECHNICAL CREDIBILITY & COMPETITIVE AUDIT")
    print("="*75)

    backend_dir = os.path.dirname(__file__)

    # 1. Assert zero car crash datasets or D:\ hardcoded paths exist in core engines
    print("\n[1] STEP 6 Audit Scrub (Statistical Integrity & Path Isolation Verification):")
    for mod_rel in ["core/risk_engine.py", "ml/causal_learner.py", "ml/forecaster.py", "eval/eval_harness.py"]:
        mod_p = os.path.join(backend_dir, mod_rel)
        txt = open(mod_p, encoding="utf-8").read()
        assert "Accidents_2015" not in txt, f"Car crash dataset citation found in {mod_rel}!"
        assert "UK-Road-Safety" not in txt, f"UK Road Safety citation found in {mod_rel}!"
        assert r"D:\Hackthaon" not in txt, f"Hardcoded local D:\\ path found in {mod_rel}!"
        print(f"    -> Verified Clean Module: {mod_rel} [OK]")

    # 2. Assert unmistakable simulator labeling
    scada_res = VirtualModbusSCADAGateway.get_instance().read_holding_registers("NORMAL")
    cctv_res = cctv_stream.get_latest_vision_analytics("PRE_INCIDENT")
    print("\n[2] STEP 6 Deceptive Branding Scrub (Hardware Simulation Disclosure):")
    print("    -> SCADA Connection Status:", scada_res["protocol_meta"]["connection_status"])
    print("    -> Vision Connection Status:", cctv_res["connection_status"])
    assert "LOCAL_SIMULATED_TESTBED" in scada_res["protocol_meta"]["connection_status"], "Missing SCADA testbed disclosure"
    assert "LOCAL_SIMULATED_TESTBED" in cctv_res["connection_status"], "Missing Vision testbed disclosure"
    print("    -> Verification: SUCCESS [OK]")

    # 3. Verify Live External Weather API Connector (STEP 7 Major)
    weather = LiveOpenMeteoWeatherConnector.fetch_live_plant_atmospheric_data()
    print("\n[3] STEP 7 Competitive Edge (Live Open-Meteo Weather API Connector):")
    print("    -> Status:", weather["connection_status"])
    print("    -> Provider:", weather["external_provider"])
    print("    -> Disclosed Limitations:", weather["disclosed_limitations"][:70] + "...")
    assert "Open-Meteo" in weather["external_provider"], "Expected Open-Meteo provider"
    print("    -> Verification: SUCCESS [OK]")

    # 4. Verify Automated Architectural Ablation Study (STEP 7 Critical/Major)
    ablation = ComparativeAblationHarness.run_ablation_analysis()
    m_eval = ablation["models_evaluated"]
    print("\n[4] STEP 7 Competitive Edge (Automated 3-Way Comparative Ablation Study):")
    print(f"    -> Rule Engine F1: {m_eval['1_standalone_deterministic_rule_engine']['f1_score']}%")
    print(f"    -> ML Engine F1:   {m_eval['2_standalone_gradient_boosting_survival_ml']['f1_score']}%")
    print(f"    -> Hybrid Graph F1: {m_eval['3_sentinel_compound_hybrid_bayesian_graph']['f1_score']}%")
    assert m_eval['3_sentinel_compound_hybrid_bayesian_graph']['f1_score'] > m_eval['1_standalone_deterministic_rule_engine']['f1_score'], "Expected hybrid gain over rules"
    print("    -> Verification: SUCCESS [OK]")

    # 5. Verify Sensor-to-Alert SLA Latency Benchmarks (STEP 7 Critical)
    print("\n[5] STEP 7 Competitive Edge (Real Async Latency SLA Distribution Suite):")
    lat_res = asyncio.run(SentinelLatencyBenchmarkHarness.execute_latency_benchmarks(iterations=30))
    pcts = lat_res["latency_percentiles_ms"]
    print(f"    -> p50 Median Latency: {pcts['p50_median_latency_ms']} ms")
    print(f"    -> p95 Tail Latency:   {pcts['p95_tail_latency_ms']} ms")
    print(f"    -> p99 Strict SLA Lat: {pcts['p99_strict_sla_latency_ms']} ms")
    print(f"    -> Grade: {lat_res['sla_compliance']['grade']}")
    assert pcts["p99_strict_sla_latency_ms"] < 250.0, "Expected SLA compliance < 250ms"
    print("    -> Verification: SUCCESS [OK]")

    print("\n" + "="*75)
    print("ALL STEP 6 & STEP 7 AUDIT DEFICITS SCRUBBED & COMPETITIVE BENCHMARKS PASSED!")
    print("="*75)

if __name__ == "__main__":
    verify_step6_and_7_technical_rigor_overhaul()
