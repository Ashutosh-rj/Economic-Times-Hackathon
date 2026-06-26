import React from 'react';
import { EmergencyBanner } from '../components/emergency/EmergencyBanner';
import { IncidentReportCard } from '../components/emergency/IncidentReportCard';
import { EvacuationMap } from '../components/emergency/EvacuationMap';

export const EmergencyPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-sentinel-critical">AUTONOMOUS EMERGENCY RESPONSE PROTOCOL</h1>
          <p className="text-xs text-sentinel-muted font-mono">Agent 4 Statutory DGFASLI Notification & Sirens Director</p>
        </div>
      </div>

      <EmergencyBanner />

      <div className="grid grid-cols-2 gap-6">
        <IncidentReportCard />
        <EvacuationMap />
      </div>
    </div>
  );
};
