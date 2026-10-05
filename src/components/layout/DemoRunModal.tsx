import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';

export const DemoRunModal: React.FC = () => {
  const { isDemoRunning, demoStep, cancelDemo } = useCadastral();

  if (!isDemoRunning) return null;

  const steps = [
    { id: 1, label: 'Data loaded (ORI / DSM / GIS evidence)' },
    { id: 2, label: 'Feature extraction (Footprints & Roads)' },
    { id: 3, label: 'Spatial inference (Parcel candidates)' },
    { id: 4, label: 'Topology validation (Planar checks)' },
    { id: 5, label: 'WebGIS ready (EPSG:3857)' }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-5 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Automated Pipeline</div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">CADA-X Demo Run</h3>
          </div>
          <button
            onClick={cancelDemo}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Skip to Map →
          </button>
        </div>

        <div className="py-4 space-y-2">
          {steps.map((s) => {
            const isCompleted = demoStep > s.id;
            const isCurrent = demoStep === s.id;

            return (
              <div
                key={s.id}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                  isCurrent
                    ? 'bg-teal-50 border border-teal-200 text-teal-900 font-medium'
                    : isCompleted
                    ? 'bg-slate-50 text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-slate-400 w-3">{s.id}.</span>
                  <span>{s.label}</span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-teal-700 animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Sector 4 East Urban Corridor</span>
          <span>~8s runtime</span>
        </div>
      </div>
    </div>
  );
};
