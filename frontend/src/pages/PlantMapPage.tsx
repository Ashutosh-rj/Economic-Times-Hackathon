import React, { useState } from 'react';
import { PlantLayoutMap } from '../components/map/PlantLayoutMap';
import { ZoneDetailPanel } from '../components/map/ZoneDetailPanel';

export const PlantMapPage: React.FC = () => {
  const [selZone, setSelZone] = useState('COKE_OVEN_BATTERY_1');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">INTERACTIVE SAFETY GEOSPATIAL MAP</h1>
          <p className="text-xs text-sentinel-muted font-mono">Live SVG Cordon Exclusion & Telemetry Drilldown</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PlantLayoutMap onSelectZone={(k) => setSelZone(k)} selectedZone={selZone} />
        </div>
        <div>
          <ZoneDetailPanel zoneKey={selZone} />
        </div>
      </div>
    </div>
  );
};
