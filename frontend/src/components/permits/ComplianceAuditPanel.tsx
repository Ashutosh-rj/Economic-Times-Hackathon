import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertOctagon, FileCheck, Calendar, ArrowRight } from 'lucide-react';
import axios from 'axios';

export const ComplianceAuditPanel: React.FC = () => {
  const [audit, setAudit] = useState<any>(null);

  useEffect(() => {
    const fetchAudit = () => {
      axios.get('http://localhost:8000/api/compliance/audit')
        .then(res => setAudit(res.data))
        .catch(() => {
          setAudit({
            agent_designation: "Agent 5: Statutory Quality & Compliance Interlock Director",
            overall_compliance_status: "NON_COMPLIANT_SIMOPS_RISK",
            compliance_score_pct: 58.4,
            deviations_flagged: [
              { audit_id: "AUD-OISD-01", clause_reference: "OISD-STD-105 Clause 6.3.2", severity: "STATUTORY_NON_COMPLIANCE", finding: "Confined Space entry authorized without verified forced draft interlock.", remediation_mandate: "Enforce LOTO isolation immediately." }
            ]
          });
        });
    };
    fetchAudit();
    const timer = setInterval(fetchAudit, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!audit) return null;
  const isDanger = audit.compliance_score_pct < 100;

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-2xl p-6 shadow-2xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
        <div className="flex items-center gap-2 text-sentinel-warning">
          <ShieldCheck className="w-5 h-5 animate-pulse" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Agent 5: Statutory Quality & Compliance Interlock</h3>
        </div>
        <span className={`px-2.5 py-1 rounded text-xs font-black uppercase border ${isDanger ? 'bg-sentinel-critical/20 text-sentinel-critical border-sentinel-critical animate-pulse' : 'bg-sentinel-safe/20 text-sentinel-safe border-sentinel-safe'}`}>
          {audit.overall_compliance_status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-sentinel-primary rounded-xl border border-white/5">
          <span className="text-[10px] text-sentinel-muted uppercase block">Statutory Audit Score</span>
          <span className={`text-2xl font-black mt-1 block ${isDanger ? 'text-sentinel-critical' : 'text-sentinel-safe'}`}>
            {audit.compliance_score_pct}%
          </span>
        </div>
        <div className="p-3.5 bg-sentinel-primary rounded-xl border border-white/5">
          <span className="text-[10px] text-sentinel-muted uppercase block">Governing Standards Audited</span>
          <span className="text-xs font-bold text-slate-200 mt-1.5 block truncate">
            OISD-105 • Factories Act Sec 41-B
          </span>
        </div>
      </div>

      {audit.deviations_flagged && audit.deviations_flagged.length > 0 && (
        <div className="space-y-2 pt-2">
          <span className="text-[10px] text-sentinel-critical font-black uppercase block tracking-wider">
            🚨 STATUTORY DEVIATIONS & CORRECTIVE ACTION NOTICES:
          </span>
          {audit.deviations_flagged.map((d: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-sentinel-critical/15 border border-sentinel-critical/60 text-xs space-y-1.5 font-sans">
              <div className="flex justify-between font-mono font-bold text-sentinel-warning">
                <span>{d.audit_id} [{d.clause_reference}]</span>
                <span className="text-[9px] bg-red-900 text-white px-1.5 py-0.2 rounded uppercase">{d.severity}</span>
              </div>
              <p className="text-slate-200">{d.finding}</p>
              <p className="text-emerald-300 font-mono text-[11px] font-semibold pt-1 border-t border-white/10 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 shrink-0" /> MANDATE: {d.remediation_mandate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
