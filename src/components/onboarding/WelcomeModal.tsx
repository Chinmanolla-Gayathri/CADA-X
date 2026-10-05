import React from 'react';
import { 
  X, 
  Play, 
  Upload, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Check 
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { GeospatialBackground } from '../common/GeospatialBackground';

export const WelcomeModal: React.FC = () => {
  const { 
    showWelcomeModal, 
    setShowWelcomeModal, 
    exploreDemoFromWelcome, 
    startWithMyDataFromWelcome,
    startTour,
    skipTour 
  } = useCadastral();

  if (!showWelcomeModal) return null;

  const pipeline = [
    { title: 'Imagery', subtitle: 'ORI / DSM rasters' },
    { title: 'AI Extraction', subtitle: 'Footprints & roads' },
    { title: 'Spatial Inference', subtitle: 'Setback reasoning' },
    { title: 'Topology QA', subtitle: 'Planar integrity' },
    { title: 'Survey Verification', subtitle: 'Ground truth RTK' }
  ];

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden">
        {/* Subtle Geospatial Background Animation */}
        <GeospatialBackground />

        {/* Close button */}
        <button
          onClick={skipTour}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Box */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200 rounded">
                CADA-X Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">SIH PS #26012</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight pt-1">
              Welcome to CADA-X
            </h2>
            <div className="text-xs font-semibold text-teal-700 tracking-tight">
              Cadastral AI eXtraction & Validation Engine
            </div>
            <p className="text-sm text-slate-600 pt-0.5">
              From drone imagery to preliminary parcel intelligence.
            </p>
          </div>

          {/* Simple Visual Workflow (Section 11) */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              End-to-End Processing Architecture
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {pipeline.map((item, idx) => (
                <div key={idx} className="relative p-2 rounded bg-white border border-slate-200/90 text-center">
                  <div className="text-[10px] font-mono text-teal-600 font-bold mb-0.5">0{idx + 1}</div>
                  <div className="text-[11px] font-semibold text-slate-800 truncate">{item.title}</div>
                  <div className="text-[9px] text-slate-500 truncate">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Core Callout */}
          <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-100 flex items-start gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-teal-900">Governance Principle: </span>
              AI proposes → GIS validates → Surveyor verifies. All generated boundaries are preliminary candidates requiring certified survey review.
            </div>
          </div>

          {/* Two Primary Action Buttons + Guided Tour Option (Section 11 & 14) */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={exploreDemoFromWelcome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-sm transition-all active:scale-[0.99]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Explore Demo (Sector 4)</span>
              </button>

              <button
                onClick={startWithMyDataFromWelcome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Start with My Data</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={startTour}
                className="text-teal-700 hover:text-teal-800 font-medium hover:underline flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Take 5-step guided tour</span>
              </button>

              <button
                onClick={skipTour}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip introduction →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
