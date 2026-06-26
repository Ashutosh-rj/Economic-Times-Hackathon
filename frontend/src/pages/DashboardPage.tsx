import React from 'react';
import { useSensorStore } from '../store/sensorStore';
import { StatCard } from '../components/dashboard/StatCard';
import { AlertFeed } from '../components/dashboard/AlertFeed';
import { ActivePermitsSummary } from '../components/dashboard/ActivePermitsSummary';
import { FalseNegativeExhibit } from '../components/dashboard/FalseNegativeExhibit';
import { CCTVAnalyticsHUD } from '../components/dashboard/CCTVAnalyticsHUD';
import { ROICounter } from '../components/dashboard/ROICounter';
import { Activity, Wind, Flame, Users, Zap, ShieldAlert } from 'lucide-react';


export const DashboardPage: React.FC = () => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const mode = useSensorStore((state) => state.simulationMode);
  const workers = useSensorStore((state) => state.workerCountAtRisk);
  const timeToThreshold = useSensorStore((state) => state.timeToThresholdMinutes);

  const h2sVal = mode === 'INCIDENT' ? '28.4' : mode === 'PRE_INCIDENT' ? '14.2' : '2.1';
  const blowerSt = mode === 'INCIDENT' ? 'TRIPPED' : 'NOMINAL';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome / Situation Banner */}
      <div className="p-6 bg-gradient-to-r from-sentinel-surface via-[#132036] to-sentinel-surface border border-sentinel-border rounded-2xl flex items-center justify-between shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sentinel-accent/20 text-sentinel-accent border border-sentinel-accent/40 font-mono text-[10px] font-bold uppercase">
              HACKATHON DEMO LOOP ACTIVE
            </span>
            <span className="text-xs font-mono text-sentinel-muted">• PRADHAN STEEL WORKS (COB1)</span>
          </div>
          <h1 className="text-2xl font-black tracking-wide text-white">INDUSTRIAL SAFETY INTELLIGENCE COMMAND CENTER</h1>
          <p className="text-xs text-sentinel-muted max-w-2xl font-sans">
            Real-time correlation graph fusing IoT telemetry, Permit-to-Work interlocks, and worker geospatial density to achieve Zero-Harm Operations.
          </p>
        </div>

        <div className="flex items-center gap-4 text-right shrink-0">
          <div className="p-3 bg-sentinel-primary rounded-xl border border-sentinel-border">
            <span className="text-[10px] font-mono text-sentinel-muted block uppercase">LANGGRAPH AGENTS</span>
            <span className="text-lg font-bold font-mono text-sentinel-safe">5 ONLINE</span>
          </div>
          <div className="p-3 bg-sentinel-primary rounded-xl border border-sentinel-border">
            <span className="text-[10px] font-mono text-sentinel-muted block uppercase">TELEMETRY SYNC</span>
            <span className="text-lg font-bold font-mono text-white">2000 MS</span>
          </div>
        </div>
      </div>

      {/* Financial ROI Counter */}
      <ROICounter />

      {/* Primary Judging Criterion Exhibit: False Negative Reduction Harness */}
      <FalseNegativeExhibit />

      {/* 4 Core Metric Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          title="Atmospheric H2S Header"
          value={h2sVal}
          unit="ppm"
          icon={Wind}
          trend={mode !== 'NORMAL' ? '+16.3 ppm/hr' : '-0.2 ppm/hr'}
          trendUp={mode !== 'NORMAL'}
          color={mode !== 'NORMAL' ? 'text-sentinel-critical' : 'text-sentinel-safe'}
          bg={mode !== 'NORMAL' ? 'bg-sentinel-critical/20' : 'bg-sentinel-safe/10'}
          border={mode !== 'NORMAL' ? 'border-sentinel-critical' : 'border-sentinel-safe/30'}
          sparkline={mode === 'INCIDENT' ? [2,4,8,14,18,22,26,28] : [2,2,3,2,2,2,2,2]}
        />

        <StatCard
          title="Compound SIMOPS Risk"
          value={`${(score * 100).toFixed(0)}%`}
          unit="AI INDEX"
          icon={Activity}
          trend={score > 0.4 ? 'ESCALATING' : 'BASELINE'}
          trendUp={score > 0.4}
          color={score > 0.7 ? 'text-sentinel-critical' : score > 0.4 ? 'text-sentinel-accent' : 'text-sentinel-safe'}
          bg={score > 0.7 ? 'bg-sentinel-critical/20' : score > 0.4 ? 'bg-sentinel-accent/20' : 'bg-sentinel-safe/10'}
          border={score > 0.7 ? 'border-sentinel-critical' : score > 0.4 ? 'border-sentinel-accent' : 'border-sentinel-safe/30'}
          sparkline={score > 0.4 ? [12,15,25,45,65,75,85,92] : [10,12,11,12,13,12,11,12]}
        />

        <StatCard
          title="Exclusion Zone Personnel"
          value={workers || (mode !== 'NORMAL' ? 6 : 0)}
          unit="PERSONNEL"
          icon={Users}
          trend={mode !== 'NORMAL' ? 'MANDATORY EVAC' : 'NOMINAL'}
          trendUp={mode !== 'NORMAL'}
          color={mode !== 'NORMAL' ? 'text-sentinel-warning' : 'text-slate-300'}
          bg={mode !== 'NORMAL' ? 'bg-sentinel-warning/20' : 'bg-slate-800'}
          border={mode !== 'NORMAL' ? 'border-sentinel-warning' : 'border-slate-700'}
        />

        <StatCard
          title="Forced Draft Ventilation"
          value={blowerSt}
          unit={blowerSt === 'TRIPPED' ? '0 CFM' : '4200 CFM'}
          icon={Zap}
          trend={blowerSt === 'TRIPPED' ? 'INTERLOCK TRIP' : 'ONLINE'}
          trendUp={blowerSt === 'TRIPPED'}
          color={blowerSt === 'TRIPPED' ? 'text-sentinel-critical' : 'text-sentinel-safe'}
          bg={blowerSt === 'TRIPPED' ? 'bg-sentinel-critical/20' : 'bg-sentinel-safe/10'}
          border={blowerSt === 'TRIPPED' ? 'border-sentinel-critical' : 'border-sentinel-safe/30'}
        />
      </div>

      {/* Edge AI Vision HUD & Feed Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <CCTVAnalyticsHUD />
        </div>
        <div className="col-span-1">
          <AlertFeed />
        </div>
        <div className="col-span-1">
          <ActivePermitsSummary />
        </div>
      </div>
    </div>
  );
};
