import { create } from 'zustand';

export interface PermitItem {
  permit_id: string;
  permit_type: string;
  zone_id: string;
  worker_count: number;
  contractor_name: string;
  work_description: string;
  start_time: string;
  duration_hours: number;
  status: string;
  ai_decision?: string;
  ai_reasoning?: string;
  ai_risk_score?: number;
  conditions?: string[];
  regulation_reference?: string;
}

interface PermitStoreState {
  permits: PermitItem[];
  setPermits: (permits: PermitItem[]) => void;
  addPermit: (permit: PermitItem) => void;
  updateStatus: (permit_id: string, status: string) => void;
}

export const usePermitStore = create<PermitStoreState>((set) => ({
  permits: [
    {
      permit_id: "PTW-DEMO-001",
      permit_type: "CONFINED_SPACE",
      zone_id: "COKE_OVEN_BATTERY_1",
      worker_count: 6,
      contractor_name: "Apex Industrial Services",
      work_description: "Cleaning & valve inspection in Battery #1 header",
      start_time: new Date().toISOString(),
      duration_hours: 4.0,
      status: "AI_DENIED",
      ai_decision: "DENY",
      ai_reasoning: "Atmospheric Hydrogen Sulfide (H2S at 18.4 ppm) exceeds safe occupational entry threshold established under OISD-STD-105 Clause 6.3.",
      ai_risk_score: 0.88,
      conditions: [],
      regulation_reference: "OISD-STD-105 Clause 6.3"
    },
    {
      permit_id: "PTW-ROUTINE-042",
      permit_type: "HOT_WORK",
      zone_id: "MAINTENANCE_WORKSHOP",
      worker_count: 3,
      contractor_name: "L&T Heavy Engineering",
      work_description: "Structural bracket welding on support beams",
      start_time: new Date(Date.now() - 3600000).toISOString(),
      duration_hours: 6.0,
      status: "ACTIVE",
      ai_decision: "APPROVE_WITH_CONDITIONS",
      ai_reasoning: "Atmospheric combustible gas telemetry within safe limits (0% LEL). Dedicated fire watch mandatory.",
      ai_risk_score: 0.15,
      conditions: ["Station dedicated fire watch with dry chemical extinguisher", "Maintain 15m exclusion cordon"],
      regulation_reference: "OISD-STD-018 Clause 8.1"
    }
  ],
  setPermits: (permits) => set({ permits }),
  addPermit: (permit) => set((state) => ({ permits: [permit, ...state.permits] })),
  updateStatus: (permit_id, status) => set((state) => ({
    permits: state.permits.map(p => p.permit_id === permit_id ? { ...p, status } : p)
  })),
}));
