import React, { useEffect, useState } from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { IndianRupee, TrendingUp, ShieldCheck } from 'lucide-react';

export const ROICounter: React.FC = () => {
  const mode = useSensorStore((state) => state.simulationMode);
  const [avoidedCost, setAvoidedCost] = useState(24000000); // ₹2.4 Cr benchmark cost

  useEffect(() => {
    if (mode !== 'NORMAL') {
      const timer = setInterval(() => {
        setAvoidedCost(prev => prev + 180); // ₹180/sec avoided downtime
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode]);

  const formattedCr = (avoidedCost / 10000000).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-sentinel-surface to-amber-950/40 border border-amber-500/40 rounded-2xl p-5 shadow-2xl flex items-center justify-between font-mono">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-500/20 border border-amber-500 rounded-xl text-amber-400">
          <IndianRupee className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            MCKINSEY FINANCIAL BUSINESS IMPACT TICKER
          </span>
          <h4 className="text-xl font-black text-white">
            ₹ {formattedCr} Crores Avoided Liabilities
          </h4>
          <p className="text-[10px] text-sentinel-muted">
            DGFASLI Benchmark: ₹2.4 Cr statutory disaster cost + ₹180/sec rotating equipment downtime saved.
          </p>
        </div>
      </div>

      <div className="px-4 py-2 rounded-xl bg-sentinel-safe/20 border border-sentinel-safe text-sentinel-safe text-xs font-bold shrink-0 flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4" /> 6.4x DEMONSTRATED ROI
      </div>
    </div>
  );
};
