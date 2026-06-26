import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface CitProps {
  document: string;
  relevance: number;
}

export const CitationCard: React.FC<CitProps> = ({ document, relevance }) => {
  return (
    <div className="p-3.5 bg-sentinel-surface rounded-xl border border-sentinel-border hover:border-sentinel-accent/50 transition-all shadow-md flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 rounded-lg bg-sentinel-primary border border-sentinel-border text-sentinel-warning shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="truncate">
          <h6 className="text-xs font-mono font-bold text-white truncate">{document}</h6>
          <p className="text-[10px] font-mono text-sentinel-muted">ChromaDB Persistent Store</p>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-xs font-mono font-bold text-sentinel-safe">{(relevance * 100).toFixed(0)}%</span>
        <span className="text-[9px] font-mono text-sentinel-muted uppercase">COSINE SIM</span>
      </div>
    </div>
  );
};
