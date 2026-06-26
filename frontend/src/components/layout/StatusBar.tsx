import React from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { useRiskLevel } from '../../hooks/useRiskLevel';
import { Clock, Users, ShieldAlert, Zap } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const workers = useSensorStore((state) => state.workerCountAtRisk);
  const timeToThreshold = useSensorStore((state) => state.timeToThresholdMinutes);
  const lastUpdated = useSensorStore((state) => state.lastUpdated);
  const risk = useRiskLevel();

  const timeStr = new Date(lastUpdated).toLocaleTimeString('en-US', { hour12: false });

  return (
    <div className={`h-12 bg-sentinel-surface border-b border-sentinel-border px-6 flex items-center justify-between transition-colors duration-500 ${risk.level === 'CRITICAL' ? 'bg-sentinel-critical/10' : ''}`}>
      {/* Left Stat Pill */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-sentinel-muted uppercase">COMPOUND RISK:</span>
          <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded border ${risk.bg} ${risk.color} ${risk.border}`}>
            {(score * 100).toFixed(1)}% — {risk.label}
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-sentinel-border pl-6">
          <Users className="w-4 h-4 text-sentinel-warning" />
          <span className="text-xs font-mono text-sentinel-muted uppercase">WORKERS IN EXCLUSION ZONE:</span>
          <span className="text-sm font-bold font-mono text-white">{workers || (score > 0.4 ? 6 : 0)}</span>
        </div>
      </div>

      {/* Right Stat Pill */}
      <div className="flex items-center gap-6">
        {score > 0.35 && (
          <div className="flex items-center gap-2 text-sentinel-accent animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">EST. BREACH LEAD TIME:</span>
            <span className="text-sm font-bold font-mono">{timeToThreshold || Math.floor(45 - score*35)} MINS</span>
          </div>
        )}

        <div className="flex items-center gap-2 border-l border-sentinel-border pl-6 text-sentinel-muted">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[11px] font-mono">SYNC: {timeStr}</span>
        </div>
      </div>
    </div>
  );
};
