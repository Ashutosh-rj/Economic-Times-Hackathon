import React from 'react';
import { PermitItem } from '../../store/permitStore';
import { Users, Clock, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';

interface CardProps {
  permit: PermitItem;
  onUpdateStatus?: (id: string, st: string) => void;
}

export const PermitCard: React.FC<CardProps> = ({ permit, onUpdateStatus }) => {
  const isDenied = permit.status.includes('DENIED') || permit.ai_decision === 'DENY';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${isDenied ? 'bg-sentinel-critical/10 border-sentinel-critical/60 hover:border-sentinel-critical' : 'bg-sentinel-surface border-sentinel-border hover:border-slate-500 shadow-xl'}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-sm text-white">{permit.permit_id}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${isDenied ? 'bg-sentinel-critical text-white' : 'bg-sentinel-safe/20 text-sentinel-safe border border-sentinel-safe/40'}`}>
              {permit.status}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">{permit.work_description}</h4>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-sentinel-muted uppercase block">ZONE</span>
          <span className="text-xs font-mono font-bold text-sentinel-accent">{permit.zone_id.replace(/_/g, ' ')}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono text-sentinel-muted py-2.5 border-y border-white/5 my-3">
        <span className="flex items-center gap-1.5 text-white">
          <Users className="w-4 h-4 text-sentinel-warning" /> {permit.worker_count} Exposed Personnel
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {permit.duration_hours} Hrs Duration
        </span>
        <span className="truncate ml-auto text-slate-400">{permit.contractor_name}</span>
      </div>

      {permit.ai_reasoning && (
        <div className={`p-3 rounded-xl border text-xs font-sans leading-relaxed ${isDenied ? 'bg-sentinel-critical/20 border-sentinel-critical/50 text-white' : 'bg-sentinel-primary border-sentinel-border text-sentinel-text'}`}>
          <div className="flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase mb-1 opacity-90">
            {isDenied ? <Ban className="w-3.5 h-3.5 text-sentinel-critical" /> : <CheckCircle2 className="w-3.5 h-3.5 text-sentinel-safe" />}
            <span>{isDenied ? 'STATUTORY SAFETY REJECTION RATIONALE:' : 'AI ADJUDICATION RATIONALE:'}</span>
          </div>
          <p>{permit.ai_reasoning}</p>
          {permit.regulation_reference && (
            <p className="font-mono text-[10px] text-sentinel-accent mt-1.5 pt-1.5 border-t border-white/10 font-bold">
              STATUTORY INTERLOCK REFERENCE: {permit.regulation_reference}
            </p>
          )}
        </div>
      )}

      {onUpdateStatus && permit.status === 'ACTIVE' && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onUpdateStatus(permit.permit_id, 'REVOKED')}
            className="px-3 py-1.5 bg-sentinel-critical/20 hover:bg-sentinel-critical text-sentinel-critical hover:text-white font-mono text-[10px] font-bold uppercase rounded-lg border border-sentinel-critical transition-colors"
          >
            Emergency Revoke PTW
          </button>
        </div>
      )}
    </div>
  );
};
