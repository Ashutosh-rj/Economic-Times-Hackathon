import React from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { ShieldAlert, Users, Flame, Wind, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Polyline, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onSelectZone: (zoneKey: string) => void;
  selectedZone: string;
}

export const PlantLayoutMap: React.FC<MapProps> = ({ onSelectZone, selectedZone }) => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const mode = useSensorStore((state) => state.simulationMode);

  const isDanger = ['PRE_INCIDENT', 'INCIDENT'].includes(mode) || score > 0.6;


  const zones = [
    {
      key: 'COKE_OVEN_BATTERY_1',
      name: 'Coke Oven Battery #1',
      id: 'COB1',
      hazard: 'Zone-1 (Explosive H2S / CO Gas)',
      workers: 6,
      risk: isDanger ? 'CRITICAL' : 'SAFE',
      positions: [
        [17.6299, 83.2040],
        [17.6299, 83.2050],
        [17.6289, 83.2050],
        [17.6289, 83.2040]
      ] as [number, number][]
    },
    {
      key: 'COKE_OVEN_BATTERY_2',
      name: 'Coke Oven Battery #2',
      id: 'COB2',
      hazard: 'Zone-1 (Flammable Outgassing)',
      workers: 4,
      risk: score > 0.4 ? 'HIGH' : 'SAFE',
      positions: [
        [17.6299, 83.2053],
        [17.6299, 83.2063],
        [17.6289, 83.2063],
        [17.6289, 83.2053]
      ] as [number, number][]
    },
    {
      key: 'BLAST_FURNACE',
      name: 'Blast Furnace GCP Area',
      id: 'BF1',
      hazard: 'Zone-0 (Continuous Flammable Gas)',
      workers: 4,
      risk: score > 0.4 ? 'HIGH' : 'SAFE',
      positions: [
        [17.6315, 83.2065],
        [17.6315, 83.2080],
        [17.6300, 83.2080],
        [17.6300, 83.2065]
      ] as [number, number][]
    },
    {
      key: 'CHEMICAL_STORAGE',
      name: 'Chemical Storage Yard',
      id: 'CS1',
      hazard: 'Zone-1 (Toxic Ammonia & Acids)',
      workers: 2,
      risk: 'SAFE',
      positions: [
        [17.6286, 83.2039],
        [17.6286, 83.2051],
        [17.6274, 83.2051],
        [17.6274, 83.2039]
      ] as [number, number][]
    },
    {
      key: 'CONTROL_ROOM',
      name: 'Central Control Vault',
      id: 'CR1',
      hazard: 'Zone-2 (Positive Pressure Safe Vault)',
      workers: 5,
      risk: 'SAFE',
      positions: [
        [17.6284, 83.2057],
        [17.6284, 83.2067],
        [17.6276, 83.2067],
        [17.6276, 83.2057]
      ] as [number, number][]
    },
    {
      key: 'MAINTENANCE_WORKSHOP',
      name: 'Maintenance Workshop',
      id: 'MW1',
      hazard: 'Zone-2 (SIMOPS Hot Work Corridor)',
      workers: 8,
      risk: 'SAFE',
      positions: [
        [17.6288, 83.2073],
        [17.6288, 83.2087],
        [17.6276, 83.2087],
        [17.6276, 83.2073]
      ] as [number, number][]
    }
  ];

  const getPolygonColor = (risk: string, isSel: boolean) => {
    if (risk === 'CRITICAL') return { color: '#FF1744', fillColor: '#FF1744', fillOpacity: isSel ? 0.6 : 0.4 };
    if (risk === 'HIGH') return { color: '#FF4B1F', fillColor: '#FF4B1F', fillOpacity: isSel ? 0.5 : 0.35 };
    return { color: isSel ? '#00D084' : '#1E3048', fillColor: '#00D084', fillOpacity: isSel ? 0.3 : 0.15 };
  };

  // Plume vector LineString from COB1 centroid towards SE
  const plumeLine: [number, number][] = [
    [17.6294, 83.2045],
    [17.6270, 83.2068]
  ];

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 relative overflow-hidden shadow-2xl h-[650px] flex flex-col font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-sentinel-border mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-600 text-white font-black text-[10px] rounded">LEAFLET.JS GIS ENGINE</span>
            <span className="text-xs text-sentinel-muted">WGS84 EPSG:4326 GEOJSON OVERLAYS</span>
          </div>
          <h3 className="font-bold text-lg text-white tracking-wide mt-1">Visakhapatnam Steel Plant Spatial Telemetry Overlay</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-critical inline-block animate-ping" /> CRITICAL POLYGON</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-accent inline-block" /> HIGH (SIMOPS)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-safe inline-block" /> NOMINAL</span>
        </div>
      </div>

      {/* GIS Telemetry HUD Banner */}
      <div className="bg-[#0A1624] px-4 py-2.5 rounded-xl border border-blue-500/30 mb-3 flex items-center justify-between text-xs text-blue-300">
        <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-400" /> CENTER: 17.6294° N, 83.2045° E (RASHTRIYA ISPAT NIGAM LTD)</span>
        <span className="flex items-center gap-2"><Wind className="w-4 h-4 text-amber-400 animate-pulse" /> DISPERSION VECTOR: WIND 14.5 KM/H SE (135°) VAPOR PLUME</span>
      </div>

      <div className="flex-1 w-full rounded-xl overflow-hidden border border-sentinel-border relative z-10">
        <MapContainer 
          center={[17.6294, 83.2058]} 
          zoom={16} 
          style={{ height: '100%', width: '100%', background: '#091017' }}
        >
          {/* CartoDB Dark Matter Base Map TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> • Sentinel AI GIS'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Render Plant Zone Polygons */}
          {zones.map((z) => {
            const isSel = selectedZone === z.key;
            const styles = getPolygonColor(z.risk, isSel);

            return (
              <Polygon
                key={z.key}
                positions={z.positions}
                pathOptions={{
                  color: styles.color,
                  fillColor: styles.fillColor,
                  fillOpacity: styles.fillOpacity,
                  weight: isSel ? 3 : 2,
                  dashArray: z.risk === 'CRITICAL' ? '6, 6' : undefined
                }}
                eventHandlers={{
                  click: () => onSelectZone(z.key)
                }}
              >
                <Tooltip direction="center" permanent className="font-mono text-[10px] bg-black/80 text-white border-0 shadow-none">
                  {z.id} [{z.risk}]
                </Tooltip>

                <Popup className="font-mono text-xs">
                  <div className="p-1 space-y-1 bg-slate-900 text-white rounded">
                    <span className="text-[10px] font-black text-sentinel-accent block uppercase">{z.hazard}</span>
                    <h4 className="font-bold text-sm">{z.name}</h4>
                    <p className="text-slate-300">Active Occupancy: <b className="text-amber-400">{z.workers} Personnel</b></p>
                    <p className="text-[10px] text-slate-400">Compound AI Score: {(score*100).toFixed(0)}% Index</p>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Render Wind Plume Dispersion Polyline if Critical */}
          {isDanger && (
            <Polyline
              positions={plumeLine}
              pathOptions={{
                color: '#FFB300',
                weight: 4,
                dashArray: '8, 8'
              }}
            >
              <Tooltip sticky>🚨 IDLH Toxic H2S Gas Dispersion Vector (Wind 14.5 km/h SE)</Tooltip>
            </Polyline>
          )}
        </MapContainer>
      </div>

      <div className="mt-3 flex justify-between items-center text-[11px] text-sentinel-muted px-2">
        <span>✨ Click any WGS84 GIS polygon to inspect SIMOPS permit conflicts and real-time outgassing sensor telemetry.</span>
        <span className="text-emerald-400 font-bold">✓ Leaflet 4.2 GIS Integration Active</span>
      </div>
    </div>
  );
};
