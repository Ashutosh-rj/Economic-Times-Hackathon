import React from 'react';
import { RAGSearchBox } from '../components/rag/RAGSearchBox';

export const IncidentIntelligencePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-sentinel-border">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">STATUTORY & HISTORICAL INCIDENT RAG</h1>
          <p className="text-xs text-sentinel-muted font-mono">ChromaDB Vector Retrieval across Indian Steel Plant Accident Reports</p>
        </div>
      </div>

      <RAGSearchBox />
    </div>
  );
};
