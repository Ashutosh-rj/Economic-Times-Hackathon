import React from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { Flame, AlertOctagon, Radio, RefreshCw } from 'lucide-react';
import axios from 'axios';

export const EmergencyBanner: React.FC = () => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const mode = useSensorStore((state) => state.simulationMode);
  const setModeLocal = useSensorStore((state) => state.setSimulationModeLocal);

  const isEmergency = score >= 0.85 || mode === 'INCIDENT';

  const handleReset = async () => {
    try {
      setModeLocal('NORMAL');
      await axios.post('http://localhost:8000/api/emergency/reset');
    } catch (e) {}
  };

  if (!isEmergency) {
    return (
      <div className="p-4 bg-sentinel-surface rounded-2xl border border-sentinel-border flex items-center justify-between text-sentinel-muted font-mono text-xs">
        <span className="flex items-center gap-2 text-sentinel-safe font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-sentinel-safe animate-pulse inline-block" />
          AGENT 4 AUTONOMOUS EMERGENCY RESPONSE PROTOCOL — STANDBY (NOMINAL)
        </span>
        <span>SIREN INTERLOCKS: DISARMED</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-sentinel-critical via-red-900 to-sentinel-critical rounded-2xl border-2 border-white text-white shadow-2xl shadow-sentinel-critical/50 animate-pulse-critical flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="p-3 bg-white text-sentinel-critical rounded-xl animate-bounce shadow-lg">
          <Flame className="w-8 h-8 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-black text-white font-mono font-bold text-xs uppercase tracking-widest animate-pulse">
              AUTONOMOUS TRIP INTERLOCK ENGAGED
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Radio className="w-4 h-4 animate-ping" /> VHF UHF RADIO BROADCAST ACTIVE
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wide">
            CATASTROPHIC COMPOUND HAZARD TRIPPED — COKE OVEN BATTERY #1
          </h2>
          <p className="text-sm font-medium opacity-95 mt-1 font-mono">
            Autonomous SIREN SOUNDED • CONFINED SPACE PERMITS REVOKED • DGFASLI FORM 18 FILED
          </p>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="px-6 py-3 bg-white hover:bg-slate-200 text-sentinel-critical font-black text-xs uppercase tracking-widest rounded-xl shadow-xl transition-transform transform hover:scale-105 flex items-center gap-2 shrink-0"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Reset Emergency Interlock</span>
      </button>
    </div>
  );
};
