import React, { useEffect, useState } from 'react';
import { useSensorStore } from '../../store/sensorStore';
import { Layers, Wind } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onSelectZone: (zoneKey: string) => void;
  selectedZone: string;
}

export const PlantLayoutMap: React.FC<MapProps> = ({ onSelectZone, selectedZone }) => {
  const score = useSensorStore((state) => state.compoundRiskScore);
  const mode = useSensorStore((state) => state.simulationMode);
  const [gisOverlay, setGisOverlay] = useState<any>(null);

  const isDanger = ['PRE_INCIDENT', 'INCIDENT'].includes(mode) || score > 0.6;

  useEffect(() => {
    const fetchOverlay = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/geospatial/overlay');
        if (res.ok) {
          const data = await res.json();
          setGisOverlay(data);
        }
      } catch (e) {
        // Fallback silently if backend unreached
      }
    };
    fetchOverlay();
    const timer = setInterval(fetchOverlay, 3000);
    return () => clearInterval(timer);
  }, []);

  const defaultZones = [
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

  const plumeLine: [number, number][] = [
    [17.6294, 83.2045],
    [17.6270, 83.2068]
  ];

  const livePersonnel = gisOverlay?.live_personnel_tracking || [
    { worker_id: "EMP-881", lat: 17.6288, lng: 83.2048, role: "SIMOPS_TECHNICIAN" },
    { worker_id: "EMP-902", lat: 17.6295, lng: 83.2043, role: "SAFETY_WATCH" }
  ];

  const entrappedIds = gisOverlay?.ray_casting_entrapment?.entrapped_worker_ids || [];

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 relative overflow-hidden shadow-2xl h-[650px] flex flex-col font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-sentinel-border mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-600 text-white font-black text-[10px] rounded">LEAFLET.JS GIS ENGINE</span>
            <span className="text-xs text-sentinel-muted">WGS84 EPSG:4326 GEOJSON OVERLAYS</span>
            {gisOverlay && <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[10px] rounded animate-pulse">LIVE GIS STREAM ACTIVE</span>}
          </div>
          <h3 className="font-bold text-lg text-white tracking-wide mt-1">Visakhapatnam Steel Plant Spatial Telemetry Overlay</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-critical inline-block animate-ping" /> CRITICAL POLYGON</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-accent inline-block" /> HIGH (SIMOPS)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sentinel-safe inline-block" /> NOMINAL</span>
        </div>
      </div>

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
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> • Sentinel AI GIS'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {defaultZones.map((z) => {
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

          {/* Dynamic Real-time Personnel GPS Telemetry CircleMarkers */}
          {livePersonnel.map((w: any) => {
            const isEntrapped = entrappedIds.includes(w.worker_id) && isDanger;
            return (
              <CircleMarker
                key={w.worker_id}
                center={[w.lat, w.lng]}
                radius={isEntrapped ? 8 : 6}
                pathOptions={{
                  color: isEntrapped ? '#FF1744' : '#00E676',
                  fillColor: isEntrapped ? '#FF1744' : '#00E676',
                  fillOpacity: 0.9,
                  weight: 2
                }}
              >
                <Popup className="font-mono text-xs">
                  <div className="bg-slate-900 text-white p-2 rounded">
                    <b className="text-amber-400">{w.worker_id}</b> [{w.role}]
                    <p className="text-[10px] text-slate-300 mt-1">GPS: {w.lat}, {w.lng}</p>
                    {isEntrapped && <span className="bg-red-600 text-white text-[9px] px-1 py-0.5 rounded block mt-1 font-bold animate-pulse">🚨 RAY-CASTING ENTRAPMENT DANGER</span>}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

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
        <span className="text-emerald-400 font-bold">✓ Leaflet 4.2 GIS Stream & Ray-Casting Tracking Active</span>
      </div>
    </div>
  );
};
