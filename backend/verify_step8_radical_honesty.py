import os
import sys

def verify_radical_honesty():
    print("===========================================================================")
    print("SENTINEL AI - STEP 8 RADICAL HONESTY & CREDIBILITY RESTORATION AUDIT")
    print("===========================================================================")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Check prohibited fabricated dataset provenance terms
    prohibited_terms = ["PERD", "SWaT", "BATADAL", "Road Safety", "Accidents_2015", "calibration_manifest"]
    files_to_check = [
        os.path.join(base_dir, "core", "risk_engine.py"),
        os.path.join(base_dir, "ml", "forecaster.py"),
        os.path.join(base_dir, "ml", "causal_learner.py"),
        os.path.join(base_dir, "eval", "eval_harness.py")
    ]

    print("\n[1] Scrub Verification (Checking Zero Prohibited Provenance Terms):")
    violations = 0
    for filepath in files_to_check:
        rel_name = os.path.relpath(filepath, base_dir)
        if not os.path.exists(filepath):
            print(f"    [!] Missing file: {rel_name}")
            violations += 1
            continue
        with open(filepath, mode="r", encoding="utf-8") as f:
            content = f.read()
            found = [t for t in prohibited_terms if t in content]
            if found:
                print(f"    [FAIL] {rel_name} contains prohibited terms: {found}")
                violations += 1
            else:
                print(f"    [OK] {rel_name} is 100% free of fabricated dataset provenance.")

    # 2. Test Functional Noisy-OR Bayesian Math Execution
    print("\n[2] Functional Noisy-OR Causal Graph Execution:")
    sys.path.insert(0, base_dir)
    try:
        from core.risk_engine import evaluate_compound_risks
        snapshot = {"GAS_H2S_01": {"value": 22.5}, "GAS_CO_01": {"value": 110.0}}
        risk_res = evaluate_compound_risks(snapshot, [], {}, [], [])
        print("    -> Scoring Methodology:", risk_res.get("scoring_methodology"))
        print("    -> Weight Provenance:", risk_res.get("weight_provenance"))
        print("    -> Calculated Posterior Risk:", risk_res.get("risk_score"))
        if "Domain Expert Assigned" in risk_res.get("weight_provenance", ""):
            print("    -> Verification: SUCCESS [OK]")
        else:
            print("    -> Verification: FAILED [Provenance mismatch]")
            violations += 1
    except Exception as e:
        print(f"    [FAIL] Exception executing Noisy-OR graph: {e}")
        violations += 1

    # 3. Test Synthetic Evaluation Harness
    print("\n[3] Synthetic Failure Injection Scorecard:")
    try:
        from eval.eval_harness import FalseNegativeEvalHarness
        eval_res = FalseNegativeEvalHarness.run_benchmark()
        print("    -> Benchmark Title:", eval_res["metadata"]["benchmark_title"])
        print("    -> Avoided Compound Misses:", eval_res["key_takeaway"]["avoided_compound_misses"])
        print("    -> F1 Score:", eval_res["sentinel_metrics"]["f1_score"], "%")
        if "Synthetic" in eval_res["metadata"]["benchmark_title"]:
            print("    -> Verification: SUCCESS [OK]")
        else:
            print("    -> Verification: FAILED [Not labeled Synthetic]")
            violations += 1
    except Exception as e:
        print(f"    [FAIL] Exception executing eval harness: {e}")
        violations += 1

    print("\n===========================================================================")
    if violations == 0:
        print("ALL STEP 8 RADICAL HONESTY & CREDIBILITY AUDITS PASSED 100%!")
        print("===========================================================================")
        sys.exit(0)
    else:
        print(f"AUDIT FAILED WITH {violations} VIOLATION(S)!")
        print("===========================================================================")
        sys.exit(1)

if __name__ == "__main__":
    verify_radical_honesty()
