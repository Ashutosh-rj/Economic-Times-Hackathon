import React from 'react';
import { Radio, Users, ArrowRight } from 'lucide-react';

export const EvacuationMap: React.FC = () => {
  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 shadow-2xl h-[450px] flex flex-col">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-sentinel-border">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-sentinel-critical animate-ping" /> Autonomous Evacuation Assembly Director
          </h3>
          <p className="text-xs font-mono text-sentinel-muted">Zone COB1 Cordon Exclusion & Muster Point Telemetry</p>
        </div>
        <span className="px-3 py-1 rounded bg-sentinel-safe/20 text-sentinel-safe font-mono text-xs font-bold border border-sentinel-safe">
          MUSTER POINT A: ALL ACCOUNTED (6/6)
        </span>
      </div>

      <div className="flex-1 bg-[#091017] rounded-xl border border-sentinel-border relative overflow-hidden flex items-center justify-center p-4">
        <svg viewBox="0 0 600 300" className="w-full h-full">
          {/* Background zones */}
          <rect x="50" y="50" width="180" height="120" rx="10" fill="rgba(255, 23, 68, 0.25)" stroke="#FF1744" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
          <text x="70" y="80" fill="#FF1744" fontWeight="bold" fontSize="12" fontFamily="JetBrains Mono">
            🚫 EXCLUSION ZONE (COB1)
          </text>

          {/* Safe Assembly Muster Point */}
          <circle cx="480" cy="110" r="45" fill="rgba(0, 208, 132, 0.2)" stroke="#00D084" strokeWidth="3" />
          <text x="440" y="115" fill="#00D084" fontWeight="bold" fontSize="12" fontFamily="JetBrains Mono">
            🟢 MUSTER A
          </text>

          {/* Animated Evacuation Arrows */}
          <path d="M 240 110 L 420 110" stroke="#00D084" strokeWidth="4" fill="none" markerEnd="url(#arrow)" strokeDasharray="8,8" className="animate-pulse" />
          
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#00D084" />
            </marker>
          </defs>

          {/* Worker dots moving */}
          <circle cx="470" cy="100" r="6" fill="#FFB800" />
          <circle cx="485" cy="105" r="6" fill="#FFB800" />
          <circle cx="490" cy="120" r="6" fill="#FFB800" />
          <circle cx="475" cy="125" r="6" fill="#FFB800" />
          <circle cx="460" cy="115" r="6" fill="#FFB800" />
          <circle cx="500" cy="110" r="6" fill="#FFB800" />
        </svg>

        <div className="absolute bottom-4 right-4 p-3 bg-sentinel-surface/90 border border-sentinel-border rounded-lg text-xs font-mono text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-sentinel-warning" />
          <span>VHF UHF Radio Roll-Call Confirmed: Zero Personnel Left Behind</span>
        </div>
      </div>
    </div>
  );
};
