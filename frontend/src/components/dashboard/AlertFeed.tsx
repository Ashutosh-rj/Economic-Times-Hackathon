import React from 'react';
import { useAlertStore } from '../../store/alertStore';
import { ShieldAlert, CheckCircle2, AlertTriangle, Flame, ArrowRight } from 'lucide-react';

export const AlertFeed: React.FC = () => {
  const alerts = useAlertStore((state) => state.alerts);
  const ack = useAlertStore((state) => state.acknowledgeAlert);

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return { border: 'border-sentinel-critical bg-sentinel-critical/15 text-sentinel-critical', badge: 'bg-sentinel-critical text-white', icon: Flame };
      case 'HIGH':
        return { border: 'border-sentinel-accent bg-sentinel-accent/15 text-sentinel-accent', badge: 'bg-sentinel-accent text-white', icon: AlertTriangle };
      default:
        return { border: 'border-sentinel-warning bg-sentinel-warning/15 text-sentinel-warning', badge: 'bg-sentinel-warning text-black', icon: ShieldAlert };
    }
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-5 flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-sentinel-accent animate-pulse" />
          <h3 className="font-bold text-sm text-white tracking-wide uppercase">Live Compound AI Risk Graph Feed</h3>
        </div>
        <span className="text-xs font-mono text-sentinel-muted">{alerts.length} INTERLOCKS ACTIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-sentinel-muted font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-sentinel-safe mb-2 opacity-50" />
            <span>NO ACTIVE COMPOUND HAZARD INTERLOCKS</span>
          </div>
        ) : (
          alerts.map((a) => {
            const style = getSeverityStyle(a.severity);
            const IconStyle = style.icon;
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border ${style.border} transition-all duration-300 ${a.acknowledged ? 'opacity-60' : 'shadow-md shadow-sentinel-primary'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${style.badge}`}>
                      {a.severity} HAZARD
                    </span>
                    <span className="text-xs font-mono text-white font-semibold">{a.zone_id.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-[10px] font-mono text-sentinel-muted">
                    {new Date(a.created_at).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-sentinel-text leading-relaxed font-sans mb-3">{a.ai_narrative}</p>

                {a.recommended_actions && a.recommended_actions.length > 0 && (
                  <div className="p-2.5 bg-sentinel-primary/80 rounded-lg border border-sentinel-border/80 mb-3 space-y-1">
                    <p className="text-[10px] font-mono text-sentinel-accent uppercase font-bold flex items-center gap-1">
                      <IconStyle className="w-3 h-3" />
                      <span>AUTONOMOUS AGENT RECOMMENDATION:</span>
                    </p>
                    {a.recommended_actions.map((act, i) => (
                      <p key={i} className="text-xs font-mono text-white flex items-center gap-1.5 pl-1">
                        <ArrowRight className="w-3 h-3 text-sentinel-safe shrink-0" />
                        <span>{act}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[10px] font-mono text-sentinel-muted">
                    RISK SCORE: {(a.risk_score * 100).toFixed(0)}%
                  </span>
                  {!a.acknowledged ? (
                    <button
                      onClick={() => ack(a.id)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold uppercase rounded border border-white/20 transition-colors"
                    >
                      Acknowledge Alert
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-sentinel-safe flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> ACKNOWLEDGED
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
