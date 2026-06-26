import React from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { usePermitStore } from '../../store/permitStore';
import { ShieldAlert, Activity, FileCheck, Users, Ban, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ZonePanelProps {
  zoneKey: string;
}

export const ZoneDetailPanel: React.FC<ZonePanelProps> = ({ zoneKey }) => {
  const mode = useSensorStore((state) => state.simulationMode);
  const score = useSensorStore((state) => state.compoundRiskScore);
  const permits = usePermitStore((state) => state.permits.filter(p => p.zone_id === zoneKey || 'COKE_OVEN_BATTERY_1' === zoneKey));

  const isCob = zoneKey === 'COKE_OVEN_BATTERY_1';
  const isDanger = isCob && mode !== 'NORMAL';

  const zoneNames: Record<string, string> = {
    'COKE_OVEN_BATTERY_1': 'Coke Oven Battery #1',
    'BLAST_FURNACE_GCP': 'Blast Furnace GCP',
    'CHEMICAL_STORAGE_YARD': 'Chemical Storage Yard',
    'MAINTENANCE_WORKSHOP': 'Maintenance Workshop',
    'CENTRAL_CONTROL_ROOM': 'Central Control Room',
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 h-[600px] flex flex-col justify-between shadow-2xl">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-sentinel-border">
          <div>
            <span className="text-[10px] font-mono text-sentinel-muted uppercase">SELECTED FACILITY ZONE</span>
            <h3 className="text-xl font-bold text-white mt-0.5">{zoneNames[zoneKey] || zoneKey}</h3>
            <p className="text-xs font-mono text-sentinel-muted mt-1">ZONE CODE: {zoneKey}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs uppercase border ${isDanger ? 'bg-sentinel-critical text-white border-sentinel-critical animate-pulse' : 'bg-sentinel-safe/20 text-sentinel-safe border-sentinel-safe'}`}>
            {isDanger ? 'SIMOPS TRAP ACTIVE' : 'ALL CLEAR'}
          </div>
        </div>

        {/* Live Telemetry Pill */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-mono font-bold text-sentinel-muted uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sentinel-accent" /> Active IoT Telemetry
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-sentinel-primary/80 rounded-xl border border-sentinel-border">
              <span className="text-[10px] font-mono text-sentinel-muted uppercase">Primary Gas Header</span>
              <p className={`text-xl font-bold font-mono mt-1 ${isDanger ? 'text-sentinel-critical animate-pulse' : 'text-white'}`}>
                {isCob ? (mode === 'INCIDENT' ? '28.5 ppm' : mode === 'PRE_INCIDENT' ? '14.2 ppm' : '2.1 ppm') : '0.4 ppm'}
              </p>
              <span className="text-[10px] font-mono text-sentinel-muted">H2S / Sulfides (PEL: 10 ppm)</span>
            </div>

            <div className="p-3.5 bg-sentinel-primary/80 rounded-xl border border-sentinel-border">
              <span className="text-[10px] font-mono text-sentinel-muted uppercase">Exhaust Blower</span>
              <p className={`text-xl font-bold font-mono mt-1 ${mode === 'INCIDENT' && isCob ? 'text-sentinel-critical' : 'text-sentinel-safe'}`}>
                {mode === 'INCIDENT' && isCob ? 'TRIPPED (0 CFM)' : 'RUNNING (4200 CFM)'}
              </p>
              <span className="text-[10px] font-mono text-sentinel-muted">Mechanical Forced Draft</span>
            </div>
          </div>
        </div>

        {/* Active PTW Permits in Zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-sentinel-muted uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-sentinel-warning" /> Active PTW Permits ({permits.length})
            </h4>
            <Link to="/permits" className="text-[11px] font-mono text-sentinel-accent hover:underline flex items-center">
              Submit New PTW <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
            {permits.map((p) => {
              const isDenied = p.status.includes('DENIED') || p.ai_decision === 'DENY';
              return (
                <div key={p.permit_id} className={`p-3 rounded-xl border text-xs ${isDenied ? 'bg-sentinel-critical/15 border-sentinel-critical' : 'bg-sentinel-primary border-sentinel-border'}`}>
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="font-bold text-white">{p.permit_id}</span>
                    <span className={isDenied ? 'text-sentinel-critical font-bold' : 'text-sentinel-safe'}>{p.status}</span>
                  </div>
                  <p className="text-sentinel-text font-sans truncate">{p.work_description}</p>
                  {isDenied && (
                    <p className="text-[10px] font-mono text-sentinel-critical mt-1.5 pt-1.5 border-t border-sentinel-critical/30">
                      ⚠️ {p.ai_reasoning}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statutory Footer */}
      <div className="p-4 bg-sentinel-primary rounded-xl border border-sentinel-border text-xs font-mono space-y-1">
        <div className="flex justify-between text-sentinel-muted">
          <span>COMPOUND ZONE RISK:</span>
          <span className="text-white font-bold">{(isCob ? score * 100 : 12).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sentinel-muted">
          <span>GOVERNING STANDARD:</span>
          <span className="text-sentinel-accent font-bold">OISD-STD-105 Sec 6</span>
        </div>
      </div>
    </div>
  );
};
