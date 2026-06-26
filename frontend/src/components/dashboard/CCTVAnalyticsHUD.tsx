import React, { useEffect, useState, useRef } from 'react';
import { Camera, ShieldAlert, Users, Eye, AlertTriangle, Video, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const CCTVAnalyticsHUD: React.FC = () => {
  const [cctv, setCctv] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation frame reference for live simulated vision frame rate
  useEffect(() => {
    let animId: number;
    let frame = 0;

    const renderVisionFrame = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          // Clear dark walkway background
          ctx.fillStyle = '#080F18';
          ctx.fillRect(0, 0, w, h);

          // Draw CCTV perspective grid walkway
          ctx.strokeStyle = '#132235';
          ctx.lineWidth = 1;
          for (let i = 0; i < w; i += 40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 30, h); ctx.stroke();
          }
          for (let j = 0; j < h; j += 30) {
            ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
          }

          frame++;
          // Simulate 2 moving personnel across the camera frame
          const x1 = 120 + Math.sin(frame * 0.05) * 40;
          const y1 = 60 + Math.cos(frame * 0.03) * 20;

          const x2 = 240 + Math.cos(frame * 0.04) * 50;
          const y2 = 80 + Math.sin(frame * 0.02) * 15;

          // Worker 1 (No Helmet / PPE Violation)
          ctx.fillStyle = '#FF5722'; // Orange hazard jumpsuit
          ctx.fillRect(x1, y1, 24, 55);
          ctx.fillStyle = '#FFE0B2'; // Bare head (Violation)
          ctx.beginPath(); ctx.arc(x1 + 12, y1 - 8, 10, 0, Math.PI * 2); ctx.fill();

          // YOLOv8 Bounding Box 1 (Violation)
          ctx.strokeStyle = '#FF1744';
          ctx.lineWidth = 2;
          ctx.strokeRect(x1 - 6, y1 - 22, 36, 82);
          ctx.fillStyle = '#FF1744';
          ctx.fillRect(x1 - 6, y1 - 36, 150, 14);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('🚨 PPE VIOLATION (0.94 CONF)', x1 - 4, y1 - 26);

          // Worker 2 (Cordon Intrusion)
          ctx.fillStyle = '#2196F3'; // Blue contractor suit
          ctx.fillRect(x2, y2, 24, 55);
          ctx.fillStyle = '#FFEB3B'; // Hard hat
          ctx.beginPath(); ctx.arc(x2 + 12, y2 - 8, 10, 0, Math.PI * 2); ctx.fill();

          // YOLOv8 Bounding Box 2 (Intrusion)
          ctx.strokeStyle = '#FF9100';
          ctx.lineWidth = 2;
          ctx.strokeRect(x2 - 6, y2 - 22, 36, 82);
          ctx.fillStyle = '#FF9100';
          ctx.fillRect(x2 - 6, y2 - 36, 160, 14);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('⚠️ CORDON INTRUSION (0.98 CONF)', x2 - 4, y2 - 26);

          // Timestamp HUD overlay
          ctx.fillStyle = '#00E676';
          ctx.font = '10px monospace';
          ctx.fillText(`🛰️ CAM-COB1-04 OPTICAL EDGE STREAM [15 FPS LIVE]`, 10, 20);
        }
      }
      animId = requestAnimationFrame(renderVisionFrame);
    };

    animId = requestAnimationFrame(renderVisionFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const fetchCctv = () => {
      axios.get('http://localhost:8000/api/cctv/analytics')
        .then(res => setCctv(res.data))
        .catch(() => {
          setCctv({
            active_cameras_online: 18,
            zones_monitored: {
              COKE_OVEN_BATTERY_1: {
                personnel_detected_count: 6,
                ppe_compliance_rate_pct: 66.7,
                violations: [
                  { violation_id: "CV-PPE-01", type: "MISSING_RESPIRATOR_SCBA", confidence: 0.94 },
                  { violation_id: "CV-ZONE-02", type: "EXCLUSION_CORDON_BREACH", confidence: 0.98 }
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

  const cob = cctv?.zones_monitored?.COKE_OVEN_BATTERY_1 || { personnel_detected_count: 6, ppe_compliance_rate_pct: 66.7, violations: [1, 2] };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-5 shadow-2xl flex flex-col justify-between font-mono">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-sentinel-border">
        <div className="flex items-center gap-2 text-sentinel-accent">
          <Video className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Live Edge AI Optical Vision Modality</h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-emerald-400 border border-emerald-500/40">
          HTML5 VISION CANVAS • 18 CAMERAS ONLINE
        </span>
      </div>

      {/* Live Canvas Computer Vision Viewport */}
      <div className="w-full h-[180px] bg-black rounded-xl overflow-hidden border border-slate-800 relative mb-4 flex items-center justify-center shadow-inner">
        <canvas ref={canvasRef} width={420} height={180} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="p-2.5 bg-[#09121C] rounded-xl border border-white/5">
          <span className="text-[9px] text-sentinel-muted uppercase block">Zone COB1 Occupancy</span>
          <span className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Users className="w-4 h-4 text-amber-400" /> {cob.personnel_detected_count} Personnel Tracked
          </span>
        </div>
        <div className="p-2.5 bg-[#09121C] rounded-xl border border-white/5">
          <span className="text-[9px] text-sentinel-muted uppercase block">PPE Helmet / SCBA Rate</span>
          <span className={`text-base font-bold mt-0.5 block ${cob.ppe_compliance_rate_pct < 100 ? 'text-sentinel-critical animate-pulse' : 'text-sentinel-safe'}`}>
            {cob.ppe_compliance_rate_pct}% COMPLIANT
          </span>
        </div>
      </div>

      <div className="p-3 bg-sentinel-critical/15 border border-sentinel-critical/80 rounded-xl space-y-1.5 text-xs">
        <span className="text-[10px] text-sentinel-critical font-black uppercase flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> ACTIVE OPTICAL DETECTION ALARMS
        </span>
        <div className="flex justify-between items-center text-white text-[11px] bg-black/50 p-1.5 rounded">
          <span>🚨 MISSING RESPIRATOR SCBA [ID: CV-01]</span>
          <span className="text-red-400 font-bold">94% CONFIDENCE</span>
        </div>
        <div className="flex justify-between items-center text-white text-[11px] bg-black/50 p-1.5 rounded">
          <span>⚠️ EXCLUSION CORDON INTRUSION [ID: CV-02]</span>
          <span className="text-amber-400 font-bold">98% CONFIDENCE</span>
        </div>
      </div>
    </div>
  );
};
