import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ShieldCheck, AlertTriangle, Flame, Zap } from 'lucide-react';
import { useSensorStore } from '../../store/sensorStore';
import axios from 'axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoToggleModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const currentMode = useSensorStore((state) => state.simulationMode);
  const setSimulationModeLocal = useSensorStore((state) => state.setSimulationModeLocal);

  const handleSetMode = async (mode: string) => {
    try {
      setSimulationModeLocal(mode);
      await axios.post('http://localhost:8000/api/simulation/mode', { mode });
    } catch (e) {
      console.error("Failed to set simulation mode on API:", e);
    }
    onClose();
  };

  const modes = [
    {
      id: 'NORMAL',
      title: 'Mode 1: Nominal Operations',
      subtitle: 'All plant telemetry green. No SIMOPS interlocks.',
      desc: 'Simulates baseline daily operations at Coke Oven Battery #1 and Blast Furnace GCP. Sensors broadcast nominal telemetry (H2S < 3 ppm, 0% LEL). AI Permit Intelligence approves standard PTW requests.',
      icon: ShieldCheck,
      color: 'text-sentinel-safe border-sentinel-safe bg-sentinel-safe/10 hover:bg-sentinel-safe/20',
      activeBorder: 'ring-2 ring-sentinel-safe shadow-lg shadow-sentinel-safe/20'
    },
    {
      id: 'PRE_INCIDENT',
      title: 'Mode 2: Pre-Incident SIMOPS Trap',
      subtitle: 'H2S creeping up (14 ppm) + Confined Space request',
      desc: 'Demonstrates SENTINEL AI catching a fatal blindspot 45 minutes before disaster. H2S outgassing begins in Coke Oven Battery #1 while a contractor submits Confined Space PTW #PTW-DEMO-001. Watch AI Agent 1 & 2 correlate IoT telemetry with PTW interlocks live.',
      icon: AlertTriangle,
      color: 'text-sentinel-accent border-sentinel-accent bg-sentinel-accent/10 hover:bg-sentinel-accent/20',
      activeBorder: 'ring-2 ring-sentinel-accent shadow-lg shadow-sentinel-accent/20'
    },
    {
      id: 'INCIDENT',
      title: 'Mode 3: Catastrophic Incident & Evacuation',
      subtitle: 'H2S breach (>25 ppm) + Blower Trip interlock',
      desc: 'Simulates the exact January 2025 Vizag Steel Plant disaster condition. Toxic vapor exceeds lethal thresholds while mechanical blower trips. Watch AI Agent 4 trigger autonomous emergency protocols, plant sirens, and DGFASLI regulatory notifications instantly.',
      icon: Flame,
      color: 'text-sentinel-critical border-sentinel-critical bg-sentinel-critical/10 hover:bg-sentinel-critical/20',
      activeBorder: 'ring-2 ring-sentinel-critical shadow-lg shadow-sentinel-critical/20'
    }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 shadow-2xl z-50 text-white focus:outline-none">
          <div className="flex items-center justify-between pb-4 border-b border-sentinel-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sentinel-accent/20 rounded-lg text-sentinel-accent border border-sentinel-accent/50">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold">Judges Live Demo Scenario Director</Dialog.Title>
                <Dialog.Description className="text-xs text-sentinel-muted font-mono">
                  Instantaneous telemetry & interlock state injection (5-minute demonstration loop)
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-lg text-sentinel-muted hover:text-white hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="py-6 space-y-4">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = currentMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSetMode(m.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${m.color} ${isActive ? m.activeBorder : 'border-sentinel-border bg-sentinel-primary/40 hover:bg-white/5'}`}
                >
                  <div className={`p-3 rounded-lg border shrink-0 ${isActive ? 'bg-white/10' : 'bg-sentinel-surface border-sentinel-border'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-white">{m.title}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white text-sentinel-primary">
                          ACTIVE STATE
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold font-mono mb-1.5 opacity-90">{m.subtitle}</p>
                    <p className="text-xs text-sentinel-muted leading-relaxed">{m.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-sentinel-primary border border-sentinel-border flex items-center justify-between text-[11px] font-mono text-sentinel-muted">
            <span>JUDGING WEIGHT: 20% TECHNICAL EXCELLENCE</span>
            <span>BACKEND WEBSOCKET TELEMETRY: 2000MS INTERVAL</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
