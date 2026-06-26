import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StatusBar } from './components/layout/StatusBar';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { DemoToggleModal } from './components/dashboard/DemoToggleModal';
import { KnowledgeGraphModal } from './components/dashboard/KnowledgeGraphModal';
import { useWebSocket } from './hooks/useWebSocket';

import { DashboardPage } from './pages/DashboardPage';
import { PlantMapPage } from './pages/PlantMapPage';
import { PermitsPage } from './pages/PermitsPage';
import { IncidentIntelligencePage } from './pages/IncidentIntelligencePage';
import { EmergencyPage } from './pages/EmergencyPage';

export const App: React.FC = () => {
  // Initialize WebSockets
  useWebSocket();

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-sentinel-primary text-sentinel-text font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          onOpenDemoModal={() => setIsDemoModalOpen(true)} 
          onOpenGraphModal={() => setIsGraphModalOpen(true)} 
        />
        <StatusBar />

        <main className="flex-1 overflow-y-auto p-6 bg-[#0B131C]">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/map" element={<PlantMapPage />} />
              <Route path="/permits" element={<PermitsPage />} />
              <Route path="/intelligence" element={<IncidentIntelligencePage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>

      <DemoToggleModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <KnowledgeGraphModal isOpen={isGraphModalOpen} onClose={() => setIsGraphModalOpen(false)} />
    </div>
  );
};
export default App;

