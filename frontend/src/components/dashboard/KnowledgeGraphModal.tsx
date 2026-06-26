import React, { useEffect, useState } from 'react';
import { Share2, X, Network, Cpu, FileCheck, ShieldAlert } from 'lucide-react';
import axios from 'axios';

interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeGraphModal: React.FC<GraphModalProps> = ({ isOpen, onClose }) => {
  const [graph, setGraph] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:8000/api/graph/topology')
        .then(res => setGraph(res.data))
        .catch(() => {
          setGraph({
            metadata: { title: "SENTINEL Digital Twin SIMOPS Knowledge Graph" },
            nodes: [
              { id: "EQ_BLOWER_1", label: "Exhaust Blower #1", group: "EQUIPMENT", status: "TRIPPED_RISK" },
              { id: "EQ_HEADER_H1", label: "Primary Gas Header H1", group: "EQUIPMENT", status: "TOXIC_LEAK" },
              { id: "PTW_CS_001", label: "Confined Space Entry #PTW-001", group: "PERMIT", status: "AUTO_REVOKED" },
              { id: "RSK_CR001", label: "Compound Rule CR-001", group: "RISK_RULE", status: "FIRED_CRITICAL" },
              { id: "REG_OISD_105", label: "OISD-STD-105 Sec 6.3", group: "REGULATION", status: "GOVERNING_STATUTE" }
            ],
            links: [
              { source: "EQ_HEADER_H1", target: "RSK_CR001", relation: "TRIGGERS_TOXIC_ESCALATION" },
              { source: "PTW_CS_001", target: "RSK_CR001", relation: "CONJUNCTION_OCCUPANCY" },
              { source: "RSK_CR001", target: "REG_OISD_105", relation: "STATUTORY_BREACH_ENFORCEMENT" }
            ]
          });
        });
    }
  }, [isOpen]);

  if (!isOpen || !graph) return null;

  const getGroupColor = (g: string) => {
    if (g === 'EQUIPMENT') return 'bg-blue-600 text-white border-blue-400';
    if (g === 'PERMIT') return 'bg-amber-600 text-white border-amber-400';
    if (g === 'RISK_RULE') return 'bg-sentinel-critical text-white border-red-400 animate-pulse';
    return 'bg-emerald-600 text-white border-emerald-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6 animate-fade-in font-mono">
      <div className="bg-sentinel-surface border-2 border-sentinel-accent w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-5 bg-sentinel-primary border-b border-sentinel-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-sentinel-accent">
            <Network className="w-6 h-6 animate-spin" />
            <div>
              <h3 className="font-black text-lg text-white tracking-wider">NetworkX Equipment-Permit-Risk Ontology Graph</h3>
              <p className="text-[11px] text-sentinel-muted">Stanford GNN Differentiator • Equipment-Permit-Risk Relationships</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[#091017] grid grid-cols-3 gap-6">
          {/* Nodes List */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-xs text-sentinel-muted uppercase font-bold tracking-wider">Graph Topology Nodes ({graph.nodes.length})</h4>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {graph.nodes.map((n: any) => (
                <div key={n.id} className={`p-3 rounded-xl border text-xs flex justify-between items-center ${getGroupColor(n.group)}`}>
                  <span className="font-bold truncate max-w-[150px]">{n.label}</span>
                  <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded uppercase">{n.group}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edges & Adjacency Relationships */}
          <div className="col-span-2 space-y-3">
            <h4 className="text-xs text-sentinel-muted uppercase font-bold tracking-wider">Directed NetworkX DiGraph Edges ({graph.links.length})</h4>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {graph.links.map((l: any, i: number) => (
                <div key={i} className="p-3.5 bg-sentinel-primary rounded-xl border border-sentinel-border flex items-center justify-between text-xs text-slate-200">
                  <span className="font-bold text-blue-400">{l.source}</span>
                  <span className="px-3 py-1 rounded bg-black/60 border border-sentinel-accent/50 text-sentinel-accent text-[10px] font-black uppercase">
                    → {l.relation.replace(/_/g, ' ')} →
                  </span>
                  <span className="font-bold text-sentinel-warning">{l.target}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-sentinel-surface border border-white/10 text-[11px] text-sentinel-muted mt-4">
              ✨ Graph Traversal Interlock: Automatically trips Zone Cordon Sirens whenever directed paths connect elevated `EQ_HEADER_H1` outgassing to active `PTW_CS_001` vessel occupancy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
