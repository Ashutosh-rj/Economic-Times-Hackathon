import React, { useState, useRef, useEffect } from 'react';
import { Wifi, WifiOff, Bell, Play, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2, CheckCheck, X } from 'lucide-react';
import { useSensorStore } from '../../store/sensorStore';
import { useAlertStore } from '../../store/alertStore';

interface HeaderProps {
  onOpenDemoModal: () => void;
  onOpenGraphModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoModal, onOpenGraphModal }) => {
  const isConnected = useSensorStore((state) => state.isConnected);
  const mode = useSensorStore((state) => state.simulationMode);
  const alerts = useAlertStore((state) => state.alerts);
  const unackCount = alerts.filter(a => !a.acknowledged).length;
  const acknowledgeAlert = useAlertStore((state) => state.acknowledgeAlert);
  const acknowledgeAllAlerts = useAlertStore((state) => state.acknowledgeAllAlerts);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModeBadge = () => {
    switch (mode) {
      case 'INCIDENT':
        return { bg: 'bg-sentinel-critical/20 text-sentinel-critical border-sentinel-critical', label: 'INCIDENT TRIGGERED', icon: AlertTriangle };
      case 'PRE_INCIDENT':
        return { bg: 'bg-sentinel-accent/20 text-sentinel-accent border-sentinel-accent', label: 'PRE-INCIDENT SIMOPS', icon: AlertTriangle };
      default:
        return { bg: 'bg-sentinel-safe/20 text-sentinel-safe border-sentinel-safe', label: 'NOMINAL OPERATIONS', icon: ShieldCheck };
    }
  };

  const badge = getModeBadge();
  const ModeIcon = badge.icon;

  return (
    <header className="h-16 bg-sentinel-surface/80 backdrop-blur border-b border-sentinel-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left title area */}
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-lg text-white">Zero-Harm Operations Monitor</h2>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${badge.bg}`}>
          <ModeIcon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Connection indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sentinel-primary rounded-lg border border-sentinel-border">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-sentinel-safe animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-sentinel-critical" />
          )}
          <span className="text-xs font-mono text-sentinel-muted uppercase">
            {isConnected ? 'TELEMETRY LIVE' : 'RECONNECTING...'}
          </span>
        </div>

        {/* Alerts Button with Interactive Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-lg border transition-all cursor-pointer ${
              isNotificationsOpen
                ? 'bg-sentinel-accent/20 border-sentinel-accent text-white shadow-lg shadow-sentinel-accent/20'
                : 'bg-sentinel-primary hover:bg-white/5 border-sentinel-border text-sentinel-text'
            }`}
            title="View Active Safety Interlocks"
          >
            <Bell className="w-5 h-5" />
            {unackCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-sentinel-accent text-white text-[10px] font-bold rounded-full animate-bounce shadow">
                {unackCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 sm:w-[420px] max-h-[80vh] bg-[#0B131C] border border-sentinel-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="p-4 bg-sentinel-surface border-b border-sentinel-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sentinel-accent animate-pulse" />
                  <span className="font-bold text-xs uppercase tracking-wider text-white">
                    Active Compound Interlocks ({unackCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {unackCount > 0 && (
                    <button
                      onClick={acknowledgeAllAlerts}
                      className="flex items-center gap-1 px-2 py-1 bg-sentinel-safe/20 hover:bg-sentinel-safe text-sentinel-safe hover:text-black border border-sentinel-safe/40 rounded text-[10px] font-mono font-bold transition-all"
                      title="Mark all notifications as acknowledged"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>ACK ALL</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 text-sentinel-muted hover:text-white rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[60vh]">
                {alerts.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-sentinel-muted font-mono text-xs">
                    <CheckCircle2 className="w-8 h-8 text-sentinel-safe mb-2 opacity-50" />
                    <span>NO RECORDED SAFETY INTERLOCKS</span>
                  </div>
                ) : (
                  alerts.map((a) => (
                    <div
                      key={a.id}
                      className={`p-3 rounded-lg border transition-all ${
                        a.acknowledged
                          ? 'bg-sentinel-surface/40 border-sentinel-border/50 opacity-60'
                          : a.severity === 'CRITICAL'
                          ? 'bg-sentinel-critical/15 border-sentinel-critical text-sentinel-critical shadow-sm'
                          : 'bg-sentinel-accent/15 border-sentinel-accent text-sentinel-accent shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            a.severity === 'CRITICAL' ? 'bg-sentinel-critical text-white' : 'bg-sentinel-accent text-white'
                          }`}>
                            {a.severity}
                          </span>
                          <span className="text-xs font-mono text-white font-bold">{a.zone_id.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-[10px] font-mono text-sentinel-muted">
                          {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 font-sans leading-relaxed mb-2.5">
                        {a.ai_narrative}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[10px] font-mono text-sentinel-muted">
                          RISK: {(a.risk_score * 100).toFixed(0)}%
                        </span>
                        {!a.acknowledged ? (
                          <button
                            onClick={() => acknowledgeAlert(a.id)}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/25 text-white font-mono text-[10px] font-bold uppercase rounded border border-white/20 transition-all"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-sentinel-safe flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> ACKNOWLEDGED
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-sentinel-surface border-t border-sentinel-border text-center">
                <span className="text-[10px] font-mono text-sentinel-muted uppercase">
                  Showing latest {alerts.length} safety interlock records
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Graph CTA */}
        {onOpenGraphModal && (
          <button
            onClick={onOpenGraphModal}
            className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 rounded-lg text-xs font-mono font-bold transition-all"
          >
            🕸 Ontology Graph
          </button>
        )}

        {/* Demo Toggle CTA */}
        <button
          onClick={onOpenDemoModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sentinel-accent to-amber-600 hover:from-amber-600 hover:to-sentinel-accent text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-sentinel-accent/20 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Judges Demo Toggle</span>
        </button>
      </div>
    </header>
  );
};

