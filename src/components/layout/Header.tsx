import React, { useState } from 'react';
import { Play, HelpCircle, Layers, CheckCircle2, Shield, Compass } from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { AboutModal } from '../about/AboutModal';

export const Header: React.FC = () => {
  const { 
    metadata, 
    launchQuickDemo, 
    isProcessing, 
    isDemoRunning,
    toastMessage,
    replayTour 
  } = useCadastral();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="h-12 px-4 flex items-center justify-between border-b border-slate-200/90 bg-white text-slate-800 z-30 shrink-0 select-none shadow-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-700 inline-block shadow-xs" />
              CADA-X
            </span>
            <span className="text-[11px] text-slate-500 font-medium">UrbanCadastral AI</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-[10px] text-slate-500 hidden md:inline">Preliminary Cadastral Intelligence</span>
          </div>
        </div>

        {/* Center: Active Project Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Project:</span>
            <span className="font-semibold text-slate-800">{metadata.name.split('-')[0].trim()}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            <span>CRS: EPSG:3857</span>
            <span className="text-slate-300">/</span>
            <span>GSD {metadata.gsdCmPerPixel}cm</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-[11px] text-teal-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            <span>Layer Ready</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Governance Notice Tooltip Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-slate-600 bg-slate-50 border border-slate-200" title="AI proposes → GIS validates → Surveyor verifies">
            <Shield className="w-3 h-3 text-teal-700" />
            <span>Preliminary Candidate Mode</span>
          </div>

          {/* Guided Tour Trigger */}
          <button
            onClick={replayTour}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Take guided tour"
          >
            <Compass className="w-3.5 h-3.5 text-teal-700" />
            <span>Guide</span>
          </button>

          {/* Launch Demo button (Professional GIS action) */}
          <button
            onClick={launchQuickDemo}
            disabled={isProcessing || isDemoRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-medium shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Execute automated validation demo sequence"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Launch Demo</span>
          </button>

          {/* Help / Methodology */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="System documentation & CARTO setup"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Status Toast */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded bg-white text-slate-800 border border-slate-200 shadow-lg text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* About & Settings Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};
