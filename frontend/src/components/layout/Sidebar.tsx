import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, Activity, Map, FileCheck, BrainCircuit, Flame } from 'lucide-react';
import { useSensorStore } from '../../store/sensorStore';

export const Sidebar: React.FC = () => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const isEmergency = score >= 0.85;

  const navItems = [
    { name: 'Command Center', path: '/', icon: Activity },
    { name: 'Safety Map', path: '/map', icon: Map },
    { name: 'Permit Intelligence', path: '/permits', icon: FileCheck },
    { name: 'Incident RAG', path: '/intelligence', icon: BrainCircuit },
    { name: 'Emergency Protocol', path: '/emergency', icon: Flame, danger: true },
  ];

  return (
    <aside className="w-64 bg-sentinel-surface border-r border-sentinel-border flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-sentinel-border gap-3">
        <div className="p-2 bg-sentinel-accent/20 border border-sentinel-accent rounded-lg text-sentinel-accent">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wider text-white">SENTINEL AI</h1>
          <p className="text-[10px] text-sentinel-muted font-mono uppercase">Industrial Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-2 text-[10px] font-mono uppercase text-sentinel-muted mb-3">Core Modules</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                ${isActive
                  ? item.danger
                    ? 'bg-sentinel-critical text-white shadow-lg shadow-sentinel-critical/30 font-semibold'
                    : 'bg-sentinel-accent/15 text-sentinel-accent border border-sentinel-accent/40 shadow-md shadow-sentinel-accent/10 font-semibold'
                  : item.danger && isEmergency
                    ? 'bg-sentinel-critical/20 text-sentinel-critical border border-sentinel-critical animate-pulse font-semibold'
                    : 'text-sentinel-muted hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
              {item.danger && isEmergency && (
                <span className="ml-auto w-2 h-2 rounded-full bg-sentinel-critical animate-ping" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Facility Footer */}
      <div className="p-4 border-t border-sentinel-border bg-sentinel-primary/50">
        <div className="p-3 rounded-lg bg-sentinel-surface border border-sentinel-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-sentinel-muted">FACILITY</span>
            <span className="text-[10px] font-mono text-sentinel-safe">ONLINE</span>
          </div>
          <p className="text-xs font-semibold text-white truncate">Pradhan Integrated Steel</p>
          <p className="text-[10px] text-sentinel-muted font-mono mt-0.5">Dhanbad Belt, JH</p>
        </div>
      </div>
    </aside>
  );
};
