import React from 'react';
import { Wifi, WifiOff, Bell, Play, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useSensorStore } from '../../store/sensorStore';
import { useAlertStore } from '../../store/alertStore';

interface HeaderProps {
  onOpenDemoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoModal }) => {
  const isConnected = useSensorStore((state) => state.isConnected);
  const mode = useSensorStore((state) => state.simulationMode);
  const unackCount = useAlertStore((state) => state.alerts.filter(a => !a.acknowledged).length);

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
      <div className="flex items-center gap-4">
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

        {/* Alerts Button */}
        <div className="relative p-2 bg-sentinel-primary hover:bg-white/5 rounded-lg border border-sentinel-border cursor-pointer transition-colors">
          <Bell className="w-5 h-5 text-sentinel-text" />
          {unackCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-sentinel-accent text-white text-[10px] font-bold rounded-full animate-bounce">
              {unackCount}
            </span>
          )}
        </div>

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
