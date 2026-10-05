import React from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Layers, 
  Database, 
  Cpu, 
  Map, 
  ShieldAlert, 
  Crosshair 
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';

export const GuidedTour: React.FC = () => {
  const { 
    isTourActive, 
    tourStep, 
    nextTourStep, 
    prevTourStep, 
    skipTour 
  } = useCadastral();

  if (!isTourActive) return null;

  const tourSteps = [
    {
      step: 1,
      targetNav: 'Data',
      icon: Database,
      title: '1. Load spatial evidence',
      description: 'Start with drone orthophoto imagery. CADA-X can combine imagery with elevation (DSM/DTM), existing GIS records and ground-truth evidence.',
      tabKey: 'data'
    },
    {
      step: 2,
      targetNav: 'Extraction',
      icon: Cpu,
      title: '2. Extract urban features',
      description: 'CADA-X identifies building footprints, roads/access corridors and land-use features using deep learning segmentation.',
      tabKey: 'extraction'
    },
    {
      step: 3,
      targetNav: 'Parcel Map',
      icon: Map,
      title: '3. Inspect preliminary parcel candidates',
      description: 'Extracted features and spatial evidence are combined through setback reasoning to generate preliminary parcel candidates on the interactive WebGIS.',
      tabKey: 'map'
    },
    {
      step: 4,
      targetNav: 'Validation',
      icon: ShieldAlert,
      title: '4. Check geometry',
      description: 'Review overlaps, gaps, self-intersections and other planar topology issues before surveyor verification.',
      tabKey: 'validation'
    },
    {
      step: 5,
      targetNav: 'Ground Truth',
      icon: Crosshair,
      title: '5. Verify before authoritative use',
      description: 'Compare AI candidates against survey/GNSS evidence and accept, edit, reject or send for field survey signoff.',
      tabKey: 'groundtruth'
    }
  ];

  const current = tourSteps[tourStep - 1] || tourSteps[0];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[9995] pointer-events-none flex items-end sm:items-center justify-center p-4">
      {/* Light dimming backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/25 pointer-events-auto"
        onClick={skipTour}
      />

      {/* Floating Tour Card */}
      <div className="relative pointer-events-auto w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-5 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Top header row */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-teal-50 text-teal-700 border border-teal-200">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
              Guided Tour · Step {tourStep} of 5
            </span>
          </div>

          <button
            onClick={skipTour}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip tour
          </button>
        </div>

        {/* Content */}
        <div className="py-3 space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900">
            {current.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Navigation row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === tourStep 
                    ? 'w-4 bg-teal-600' 
                    : i < tourStep 
                    ? 'bg-teal-300' 
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {tourStep > 1 && (
              <button
                onClick={prevTourStep}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Back
              </button>
            )}

            <button
              onClick={nextTourStep}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <span>{tourStep === 5 ? 'Explore CADA-X' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
