import { useSensorStore } from '../store/sensorStore';

export const useRiskLevel = () => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const mode = useSensorStore((state) => state.simulationMode);

  if (score >= 0.85 || mode === 'INCIDENT') {
    return { level: 'CRITICAL', label: 'CRITICAL EMERGENCY', color: 'text-sentinel-critical', bg: 'bg-sentinel-critical/20', border: 'border-sentinel-critical' };
  } else if (score >= 0.60 || mode === 'PRE_INCIDENT') {
    return { level: 'HIGH', label: 'HIGH RISK (SIMOPS)', color: 'text-sentinel-accent', bg: 'bg-sentinel-accent/20', border: 'border-sentinel-accent' };
  } else if (score >= 0.35) {
    return { level: 'ELEVATED', label: 'ELEVATED WARNING', color: 'text-sentinel-warning', bg: 'bg-sentinel-warning/20', border: 'border-sentinel-warning' };
  }
  return { level: 'SAFE', label: 'NOMINAL SAFE', color: 'text-sentinel-safe', bg: 'bg-sentinel-safe/20', border: 'border-sentinel-safe' };
};
