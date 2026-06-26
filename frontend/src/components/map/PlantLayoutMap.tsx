import React, { useState } from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { ShieldAlert, Users, Flame, CheckCircle } from 'lucide-react';

interface MapProps {
  onSelectZone: (zoneKey: string) => void;
  selectedZone: string;
}

export const PlantLayoutMap: React.FC<MapProps> = ({ onSelectZone, selectedZone }) => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const mode = useSensorStore((state) => state.simulationMode);

  const zones = [
    { key: 'COKE_OVEN_BATTERY_1', name: 'Coke Oven Battery #1', x: 80, y: 100, w: 220, h: 140, workers: 6, risk: mode in ['PRE_INCIDENT', 'INCIDENT'] || score > 0.6 ? 'CRITICAL' : 'SAFE' },
    { key: 'BLAST_FURNACE_GCP', name: 'Blast Furnace GCP', x: 350, y: 80, w: 240, h: 160, workers: 4, risk: score > 0.4 ? 'HIGH' : 'SAFE' },
    { key: 'CHEMICAL_STORAGE_YARD', name: 'Chemical Storage Yard', x: 100, y: 280, w: 200, h: 120, workers: 2, risk: 'SAFE' },
    { key: 'MAINTENANCE_WORKSHOP', name: 'Maintenance Workshop', x: 350, y: 280, w: 240, h: 120, workers: 8, risk: 'SAFE' },
    { key: 'CENTRAL_CONTROL_ROOM', name: 'Central Control Room', x: 260, y: 440, w: 180, h: 80, workers: 5, risk: 'SAFE' },
  ];

  const getZoneFill = (risk: string, isSel: boolean) => {
    if (risk === 'CRITICAL') return isSel ? '#FF1744' : 'rgba(255, 23, 68, 0.35)';
    if (risk === 'HIGH') return isSel ? '#FF4B1F' : 'rgba(255, 75, 31, 0.35)';
    return isSel ? '#00D084' : 'rgba(0, 208, 132, 0.15)';
  };

  const getZoneStroke = (risk: string, isSel: boolean) => {
    if (risk === 'CRITICAL') return '#FF1744';
    if (risk === 'HIGH') return '#FF4B1F';
    return isSel ? '#00D084' : '#1E3048';
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 relative overflow-hidden shadow-2xl h-[600px] flex flex-col">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-sentinel-border">
        <div>
          <h3 className="font-bold text-lg text-white">Live Geospatial SIMOPS Risk Overlay</h3>
          <p className="text-xs font-mono text-sentinel-muted">Interactive SVG Telemetry Map — Pradhan Integrated Steel Works</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-critical inline-block animate-ping" /> CRITICAL (BREACH TRAP)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-accent inline-block" /> HIGH (SIMOPS)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-safe inline-block" /> NOMINAL</span>
        </div>
      </div>

      <div className="flex-1 w-full bg-[#091017] rounded-xl border border-sentinel-border relative overflow-hidden flex items-center justify-center p-4">
        <svg viewBox="0 0 700 550" className="w-full h-full max-h-[480px]">
          {/* Grid lines background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162032" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Interconnecting pipelines */}
          <path d="M 300 170 L 350 160" stroke="#FF4B1F" strokeWidth="4" strokeDasharray="6,6" fill="none" className="animate-pulse" />
          <path d="M 200 240 L 200 280" stroke="#00D084" strokeWidth="3" fill="none" />
          <path d="M 470 240 L 470 280" stroke="#1E3048" strokeWidth="3" fill="none" />

          {/* Zones */}
          {zones.map((z) => {
            const isSel = selectedZone === z.key;
            const isCrit = z.risk === 'CRITICAL' || (z.key === 'COKE_OVEN_BATTERY_1' && mode !== 'NORMAL');
            return (
              <g
                key={z.key}
                onClick={() => onSelectZone(z.key)}
                className="cursor-pointer transition-transform hover:opacity-90"
              >
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="12"
                  fill={getZoneFill(isCrit ? 'CRITICAL' : z.risk, isSel)}
                  stroke={getZoneStroke(isCrit ? 'CRITICAL' : z.risk, isSel)}
                  strokeWidth={isSel ? "3" : "2"}
                  className={isCrit ? "animate-pulse" : ""}
                />
                <text x={z.x + 16} y={z.y + 28} fill="white" fontWeight="bold" fontSize="14" fontFamily="Inter">
                  {z.name}
                </text>
                <text x={z.x + 16} y={z.y + 48} fill="#6B8096" fontSize="11" fontFamily="JetBrains Mono">
                  ZONE ID: {z.key.substring(0, 10)}...
                </text>

                {/* Worker badge */}
                <rect x={z.x + z.w - 75} y={z.y + 12} width="60" height="24" rx="6" fill="#162032" stroke="#1E3048" strokeWidth="1" />
                <text x={z.x + z.w - 65} y={z.y + 28} fill="#FFB800" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                  👥 {z.workers}
                </text>

                {/* Alert Beacon icon */}
                {isCrit && (
                  <circle cx={z.x + z.w/2} cy={z.y + z.h/2 + 10} r="20" fill="#FF1744" className="animate-ping opacity-75" />
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-4 left-4 p-3 bg-sentinel-surface/90 border border-sentinel-border rounded-lg text-[11px] font-mono text-sentinel-muted">
          CLICK ANY POLYGON FOR TELEMETRY DRILLDOWN & ACTIVE PERMITS
        </div>
      </div>
    </div>
  );
};
