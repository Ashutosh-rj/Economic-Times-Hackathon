import React from 'react';
import { FileText, ShieldAlert, CheckCircle, ArrowRight, Share2, Printer } from 'lucide-react';

export const IncidentReportCard: React.FC = () => {
  const report = {
    report_id: "INC-20250115-001",
    incident_datetime: new Date().toISOString(),
    facility_section: "Coke Oven Battery #1 (Pradhan Integrated Steel Works)",
    incident_category: "Dangerous Occurrence (Statutory Fatality Prevention Interlock)",
    description: "Automated safety interlock triggered in Coke Oven Battery #1 following multi-sensor compound risk score escalation to 0.92. Acute Hydrogen Sulfide (H2S at 28.4 ppm) outgassing coincided with active confined space occupancy under Permit #PTW-DEMO-001 and mechanical blower trip.",
    immediate_cause: "Atmospheric toxic vapor outgassing compounding mechanical forced ventilation failure.",
    contributing_factors: [
      "Simultaneous Confined Space occupancy without active positive forced draft",
      "Local acoustic alarm silenced by shift operations",
      "Disconnected telemetry between SCADA and PTW registry"
    ],
    persons_at_risk: 6,
    immediate_actions_taken: [
      "Auto-revoked Confined Space Permit #PTW-DEMO-001",
      "Sounded Zone COB1 automated evacuation siren",
      "Tripped emergency electrical interlock on forced blower units",
      "Preserved 30-minute high-frequency SCADA historian package"
    ],
    statutory_notifications_required: [
      "Chief Inspector of Factories (State Labour Dept under Factory Act Sec 88)",
      "DGFASLI Nodal Industrial Safety Desk",
      "OISD Incident Reporting Directorate"
    ]
  };

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-start justify-between pb-4 border-b border-sentinel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sentinel-critical/20 border border-sentinel-critical rounded-xl text-sentinel-critical">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sentinel-critical">{report.report_id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-white">
                DGFASLI FORM 18 COMPLIANT
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Preliminary Statutory Incident Dossier</h3>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => window.print()} className="p-2 rounded-lg bg-sentinel-primary hover:bg-white/10 border border-sentinel-border text-slate-300">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-sentinel-primary hover:bg-white/10 border border-sentinel-border text-slate-300">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3 bg-sentinel-primary rounded-xl border border-sentinel-border">
          <span className="text-[10px] text-sentinel-muted uppercase block mb-1">DATETIME UTC</span>
          <span className="text-white font-bold">{new Date(report.incident_datetime).toLocaleString()}</span>
        </div>
        <div className="p-3 bg-sentinel-primary rounded-xl border border-sentinel-border">
          <span className="text-[10px] text-sentinel-muted uppercase block mb-1">EXPOSED PERSONNEL</span>
          <span className="text-sentinel-warning font-bold">👥 {report.persons_at_risk} Personnel Evacuated</span>
        </div>
        <div className="p-3 bg-sentinel-primary rounded-xl border border-sentinel-border">
          <span className="text-[10px] text-sentinel-muted uppercase block mb-1">SEVERITY CLASSIFICATION</span>
          <span className="text-sentinel-critical font-bold">STATUTORY DANGEROUS OCCURRENCE</span>
        </div>
      </div>

      {/* Narrative Body */}
      <div className="space-y-4 text-xs font-sans text-sentinel-text">
        <div>
          <h5 className="font-mono font-bold text-[11px] text-sentinel-muted uppercase mb-1">INCIDENT SUMMARY NARRATIVE</h5>
          <p className="p-3.5 bg-sentinel-primary/70 rounded-xl border border-sentinel-border leading-relaxed text-white">
            {report.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-sentinel-primary/70 rounded-xl border border-sentinel-border space-y-2">
            <h5 className="font-mono font-bold text-[11px] text-sentinel-accent uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> CONTRIBUTING COMPOUND HAZARD FACTORS
            </h5>
            {report.contributing_factors.map((cf, idx) => (
              <p key={idx} className="font-mono text-[11px] text-slate-300 flex items-start gap-1.5">
                <span className="text-sentinel-critical">•</span> {cf}
              </p>
            ))}
          </div>

          <div className="p-4 bg-sentinel-primary/70 rounded-xl border border-sentinel-border space-y-2">
            <h5 className="font-mono font-bold text-[11px] text-sentinel-safe uppercase flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> AUTONOMOUS MITIGATION ACTIONS TAKEN
            </h5>
            {report.immediate_actions_taken.map((iat, idx) => (
              <p key={idx} className="font-mono text-[11px] text-slate-300 flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-sentinel-safe shrink-0 mt-0.5" /> {iat}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-sentinel-surface rounded-xl border border-sentinel-warning/40">
          <h5 className="font-mono font-bold text-[11px] text-sentinel-warning uppercase mb-2">
            📋 MANDATORY STATUTORY NOTIFICATIONS FILED (FACTORY ACT SEC 88)
          </h5>
          <div className="flex flex-wrap gap-2">
            {report.statutory_notifications_required.map((sn, idx) => (
              <span key={idx} className="px-3 py-1 bg-sentinel-warning/15 border border-sentinel-warning/40 text-white rounded-lg font-mono text-[10px] font-semibold">
                ✓ {sn}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
