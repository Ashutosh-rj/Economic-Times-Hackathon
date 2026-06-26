import { create } from 'zustand';

export interface SensorSnapshot {
  sensor_id: string;
  zone_id: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  trend: 'RISING' | 'FALLING' | 'STABLE';
  rate_of_change: number;
  sparkline: number[];
}

interface SensorStoreState {
  sensors: SensorSnapshot[];
  simulationMode: string;
  compoundRiskScore: number;
  activeRulesTriggered: string[];
  zonesAtRisk: string[];
  workerCountAtRisk: number;
  timeToThresholdMinutes: number;
  lastUpdated: string;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  updateFromStream: (payload: any) => void;
  setSimulationModeLocal: (mode: string) => void;
}

export const useSensorStore = create<SensorStoreState>((set) => ({
  sensors: [],
  simulationMode: 'NORMAL',
  compoundRiskScore: 0.12,
  activeRulesTriggered: [],
  zonesAtRisk: [],
  workerCountAtRisk: 0,
  timeToThresholdMinutes: 45,
  lastUpdated: new Date().toISOString(),
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  updateFromStream: (payload) => set({
    sensors: payload.sensors || [],
    simulationMode: payload.simulation_mode || 'NORMAL',
    compoundRiskScore: payload.compound_risk_score ?? 0.12,
    activeRulesTriggered: payload.active_rules_triggered || [],
    zonesAtRisk: payload.zones_at_risk || [],
    workerCountAtRisk: payload.worker_count_at_risk || 0,
    timeToThresholdMinutes: payload.time_to_threshold_minutes || 45,
    lastUpdated: payload.timestamp || new Date().toISOString(),
  }),
  setSimulationModeLocal: (mode) => set({ simulationMode: mode }),
}));
