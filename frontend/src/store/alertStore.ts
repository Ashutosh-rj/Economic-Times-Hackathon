import { create } from 'zustand';

export interface AlertItem {
  id: number;
  rule_id: string;
  zone_id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risk_score: number;
  triggered_conditions: string[];
  ai_narrative: string;
  recommended_actions: string[];
  acknowledged: boolean;
  created_at: string;
}

interface AlertStoreState {
  alerts: AlertItem[];
  addAlert: (alert: AlertItem) => void;
  setAlerts: (alerts: AlertItem[]) => void;
  acknowledgeAlert: (id: number) => void;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  alerts: [
    {
      id: 1,
      rule_id: 'CR-001',
      zone_id: 'COKE_OVEN_BATTERY_1',
      severity: 'HIGH',
      risk_score: 0.72,
      triggered_conditions: ["active_permit.type == 'CONFINED_SPACE'", "zone_gas_ppm > 25"],
      ai_narrative: "Compound Hazard Fired in Zone COB1: Simultaneous outgassing of Hydrogen Sulfide (H2S at 18.4 ppm) and Confined Space occupancy under active PTW #PTW-DEMO-001. Estimated operational lead time before atmospheric lethality threshold breach is 18 minutes.",
      recommended_actions: ["Evacuate Zone COB1 immediately", "Trip emergency blower interlock"],
      acknowledged: false,
      created_at: new Date(Date.now() - 1000 * 120).toISOString(),
    }
  ],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts.filter(a => a.id !== alert.id)].slice(0, 100) })),
  setAlerts: (alerts) => set({ alerts }),
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) => a.id === id ? { ...a, acknowledged: true } : a)
  })),
}));
