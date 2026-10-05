/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CadastralProvider, useCadastral } from './context/CadastralContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoRunModal } from './components/layout/DemoRunModal';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { GuidedTour } from './components/onboarding/GuidedTour';
import { OverviewView } from './components/overview/OverviewView';
import { DataView } from './components/data/DataView';
import { ExtractionView } from './components/extraction/ExtractionView';
import { ParcelMapView } from './components/map/ParcelMapView';
import { ValidationView } from './components/validation/ValidationView';
import { GroundTruthView } from './components/groundtruth/GroundTruthView';
import { ExportView } from './components/export/ExportView';

const MainLayout: React.FC = () => {
  const { activeTab } = useCadastral();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F7F9] text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />

        {/* Primary View Workspace */}
        <main className="flex-1 h-full overflow-hidden relative bg-[#F5F7F9]">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'data' && <DataView />}
          {activeTab === 'extraction' && <ExtractionView />}
          {activeTab === 'map' && <ParcelMapView />}
          {activeTab === 'validation' && <ValidationView />}
          {activeTab === 'groundtruth' && <GroundTruthView />}
          {activeTab === 'export' && <ExportView />}
        </main>
      </div>

      {/* First-launch Welcome Modal */}
      <WelcomeModal />

      {/* 5-Step Guided Tour */}
      <GuidedTour />

      {/* Automated Demo Overlay Dialog */}
      <DemoRunModal />
    </div>
  );
};

export default function App() {
  return (
    <CadastralProvider>
      <MainLayout />
    </CadastralProvider>
  );
}
