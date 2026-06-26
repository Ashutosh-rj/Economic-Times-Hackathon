import React from 'react';
import { PermitForm } from '../components/permits/PermitForm';
import { PermitCard } from '../components/permits/PermitCard';
import { usePermitStore } from '../store/permitStore';
import { ComplianceAuditPanel } from '../components/permits/ComplianceAuditPanel';

export const PermitsPage: React.FC = () => {
  const permits = usePermitStore((state) => state.permits);
  const updateSt = usePermitStore((state) => state.updateStatus);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">AI PERMIT INTELLIGENCE & SIMOPS REGISTRY</h1>
          <p className="text-xs text-sentinel-muted font-mono">Agent 2 OISD Regulatory Verification & Agent 5 Statutory Audit Interlocks</p>
        </div>
      </div>

      <ComplianceAuditPanel />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <PermitForm />
        </div>

        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-sentinel-muted uppercase font-mono tracking-wider">
              Submitted Permit Requests Directory ({permits.length})
            </h3>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {permits.map((p) => (
              <PermitCard key={p.permit_id} permit={p} onUpdateStatus={(id, st) => updateSt(id, st)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
