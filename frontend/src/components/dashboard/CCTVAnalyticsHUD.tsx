import React, { useEffect, useState } from 'react';
import { Camera, ShieldAlert, Users, Eye, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export const CCTVAnalyticsHUD: React.FC = () => {
  const [cctv, setCctv] = useState<any>(null);

  useEffect(() => {
    const fetchCctv = () => {
      axios.get('http://localhost:8000/api/cctv/analytics')
        .then(res => setCctv(res.data))
        .catch(() => {
          setCctv({
            active_cameras_online: 18,
            zones_monitored: {
              COKE_OVEN_BATTERY_1: {
                camera_id: "CAM-COB1-04 (Thermal + Optical Edge AI)",
                personnel_detected_count: 6,
                ppe_compliance_rate_pct: 66.7,
                violations: [
                  { violation_id: "CV-PPE-01", type: "MISSING_RESPIRATOR_SCBA", confidence: 0.94, severity: "STATUTORY_VIOLATION" },
                  { violation_id: "CV-ZONE-02", type: "EXCLUSION_CORDON_BREACH", confidence: 0.98, severity: "CRITICAL_TRAP_DANGER" }
                ]
              }
            }
          });
        });
    };
    fetchCctv();
    const interval = setInterval(fetchCctv, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!cctv) return null;
  const cob = cctv.zones_monitored?.COKE_OVEN_BATTERY_1 || {};
  const hasViolations = cob.violations && cob.violations.length > 0;

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-2 text-sentinel-accent">
          <Camera className="w-5 h-5 animate-pulse" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Simulated Edge AI CCTV Vision Modality</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-emerald-400 border border-emerald-500/40">
          YOLOv8 EDGE STREAM • 18 CAMERAS ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-sentinel-primary rounded-xl border border-white/5 font-mono">
          <span className="text-[10px] text-sentinel-muted uppercase block">Zone COB1 Personnel</span>
          <span className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Users className="w-4 h-4 text-amber-400" /> {cob.personnel_detected_count || 4} Detected
          </span>
        </div>
        <div className="p-3 bg-sentinel-primary rounded-xl border border-white/5 font-mono">
          <span className="text-[10px] text-sentinel-muted uppercase block">PPE Helmet / SCBA Rate</span>
          <span className={`text-lg font-bold mt-0.5 block ${cob.ppe_compliance_rate_pct < 100 ? 'text-sentinel-critical animate-pulse' : 'text-sentinel-safe'}`}>
            {cob.ppe_compliance_rate_pct || 100}% COMPLIANT
          </span>
        </div>
      </div>

      {hasViolations ? (
        <div className="p-3.5 bg-sentinel-critical/15 border border-sentinel-critical rounded-xl space-y-2 font-mono text-xs">
          <span className="text-[10px] text-sentinel-critical font-black uppercase flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> COMPUTER VISION BOUNDING BOX INTERLOCK ALERT
          </span>
          {cob.violations.map((v: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-white text-[11px] bg-black/40 p-2 rounded">
              <span>🚨 {v.type.replace(/_/g, ' ')}</span>
              <span className="text-sentinel-warning font-bold">{(v.confidence * 100).toFixed(0)}% CONF</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-sentinel-safe/10 border border-sentinel-safe/30 rounded-xl text-center text-xs font-mono text-sentinel-safe">
          ✓ Zero Optical Cordon Intrusions or PPE Violations Flagged
        </div>
      )}
    </div>
  );
};
