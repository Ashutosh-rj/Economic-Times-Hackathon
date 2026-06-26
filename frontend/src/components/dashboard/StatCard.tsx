import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  bg?: string;
  border?: string;
  sparkline?: number[];
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendUp,
  color = 'text-sentinel-safe',
  bg = 'bg-sentinel-safe/10',
  border = 'border-sentinel-safe/30',
  sparkline = []
}) => {
  return (
    <div className={`p-5 bg-sentinel-surface rounded-xl border ${border} flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-300 hover:border-slate-500`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium text-sentinel-muted uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${bg} ${color} ${border}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className={`text-2xl font-bold font-mono tracking-tight text-white`}>{value}</span>
        {unit && <span className="text-xs font-mono text-sentinel-muted">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-sentinel-border/50">
        {trend ? (
          <span className={`text-[11px] font-mono font-semibold ${trendUp ? 'text-sentinel-critical' : 'text-sentinel-safe'}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-sentinel-muted">TELEMETRY STABLE</span>
        )}
        
        {/* Simple mini bar representation */}
        <div className="flex items-end gap-0.5 h-4">
          {(sparkline.length > 0 ? sparkline : [4,6,8,5,7,9,6,8]).map((v, i) => (
            <div
              key={i}
              className={`w-1 rounded-sm ${color.replace('text-', 'bg-')}`}
              style={{ height: `${Math.min(100, Math.max(15, v * 8))}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
