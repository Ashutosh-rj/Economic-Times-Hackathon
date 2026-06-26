import React from 'react';
import { usePermitStore } from '../../store/permitStore';
import { FileCheck, Users, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivePermitsSummary: React.FC = () => {
  const permits = usePermitStore((state) => state.permits);

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-5 flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-sentinel-warning" />
          <h3 className="font-bold text-sm text-white tracking-wide uppercase">Digital SIMOPS Registry</h3>
        </div>
        <Link to="/permits" className="text-xs font-mono text-sentinel-accent hover:underline">
          VIEW ALL ({permits.length}) →
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {permits.map((p) => {
          const isDenied = p.status.includes('DENIED') || p.ai_decision === 'DENY';
          return (
            <div
              key={p.permit_id}
              className={`p-3.5 rounded-xl border transition-all ${isDenied ? 'bg-sentinel-critical/10 border-sentinel-critical/50' : 'bg-sentinel-primary/60 border-sentinel-border'}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-white">{p.permit_id}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${isDenied ? 'bg-sentinel-critical text-white' : 'bg-sentinel-safe/20 text-sentinel-safe border border-sentinel-safe/40'}`}>
                    {p.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-sentinel-muted">{p.permit_type.replace(/_/g, ' ')}</span>
              </div>

              <p className="text-xs font-medium text-sentinel-text truncate mb-2">{p.work_description}</p>

              <div className="flex items-center justify-between text-[11px] font-mono text-sentinel-muted pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-white">
                  <Users className="w-3 h-3 text-sentinel-warning" /> {p.worker_count} Workers
                </span>
                <span className="truncate max-w-[120px]">{p.contractor_name}</span>
              </div>

              {isDenied && (
                <div className="mt-2 p-2 bg-sentinel-critical/20 rounded border border-sentinel-critical/40 flex items-start gap-1.5 text-[10px] text-sentinel-critical font-mono">
                  <Ban className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{p.ai_reasoning}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
