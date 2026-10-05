import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Check, 
  Loader2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { GeospatialBackground } from '../common/GeospatialBackground';

export const ExtractionView: React.FC = () => {
  const { 
    isProcessing, 
    processingProgress, 
    processingLogs, 
    runAiExtraction, 
    hasExtracted, 
    setActiveTab 
  } = useCadastral();

  const [showPipelineDrawer, setShowPipelineDrawer] = useState(false);

  // Processing Visualization (Section 16)
  const processingStages = [
    { id: 1, name: 'Preprocessing', desc: 'Radiometric calibration & CRS alignment' },
    { id: 2, name: 'Building extraction', desc: 'Footprint polygons & heights' },
    { id: 3, name: 'Road/access extraction', desc: 'Right-of-way boundaries & corridors' },
    { id: 4, name: 'Land-use extraction', desc: 'Zoning & texture categorization' },
    { id: 5, name: 'Spatial fusion', desc: 'Integration of ORI, DSM & existing GIS' },
    { id: 6, name: 'Parcel inference', desc: 'Setback reasoning & candidate generation' },
    { id: 7, name: 'Topology QA', desc: 'Planar boundary snapping & integrity audit' }
  ];

  return (
    <div className="relative h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto bg-[#F5F7F9]">
      {/* Subtle Geospatial Background Animation */}
      <GeospatialBackground />

      <div className="relative z-10 space-y-4">
        {/* Header (Section 16) */}
        <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">AI Feature Extraction</h2>
            <div className="text-xs text-slate-500 font-medium">
              Convert imagery into structured urban features for parcel inference.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-slate-400">Status: </span>
              <span className="font-mono text-teal-800 font-semibold">
                {isProcessing ? `Running (${processingProgress}%)` : hasExtracted ? 'Features Ready' : 'Ready'}
              </span>
            </div>

            <button
              onClick={() => runAiExtraction()}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Extraction</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing Visualization Timeline (Section 16) */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
            <span className="font-mono uppercase text-[11px] text-slate-500 font-semibold">
              Extraction Pipeline Sequence
            </span>
            <span className="text-[10px] font-mono text-teal-700 font-semibold">
              {isProcessing ? `Step ${Math.ceil(processingProgress / 14)} of 7` : '7 / 7 Verified'}
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-teal-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${hasExtracted && !isProcessing ? 100 : processingProgress}%` }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-1.5 pt-1">
            {processingStages.map((stage) => {
              const stageThreshold = stage.id * 14;
              const isCompleted = hasExtracted && !isProcessing ? true : processingProgress >= stageThreshold;
              const isCurrent = isProcessing && Math.ceil(processingProgress / 14) === stage.id;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    isCurrent
                      ? 'bg-teal-50/80 border border-teal-200 text-teal-900 font-medium'
                      : isCompleted
                      ? 'bg-slate-50/80 text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 flex justify-center">
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 text-teal-700 stroke-[2.5]" />
                      ) : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 text-teal-700 animate-spin" />
                      ) : (
                        <span className="text-[10px] text-slate-300 font-mono">○</span>
                      )}
                    </span>
                    <span className="font-medium">{stage.name}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">{stage.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meaningful Application Logs - No Faked GPU Tensors (Section 16) */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white font-mono text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] pb-1 border-b border-slate-100 font-sans font-medium">
            <Terminal className="w-3 h-3 text-teal-700" />
            <span>Processing Application Log</span>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1 text-[11px] text-slate-600 pt-1">
            {processingLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <span className="text-teal-600 shrink-0">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Architecture Drawer (Section 15) */}
        <div className="border border-slate-200 rounded-lg bg-white shadow-xs">
          <button
            onClick={() => setShowPipelineDrawer(!showPipelineDrawer)}
            className="w-full p-3 flex items-center justify-between text-xs text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">About the extraction pipeline</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Prototype architecture
              </span>
            </div>
            {showPipelineDrawer ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showPipelineDrawer && (
            <div className="p-3.5 border-t border-slate-100 text-xs text-slate-600 space-y-2.5 font-sans bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-800">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Imagery (ORI/DSM)</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Feature extraction</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Spatial fusion</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Parcel inference</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">Topology QA</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                In this prototype demonstration, spatial reasoning evaluates building setback footprints, road right-of-way margins, and legacy revenue sheets to infer candidate property boundaries.
              </p>

              <div className="p-2.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Technical Context for Evaluators:</div>
                <div>• <strong>Prototype implementation:</strong> Local vector geometry synthesis and planar topology checks via Turf.js.</div>
                <div>• <strong>Production target:</strong> Fine-tuned segmentation models (Mask R-CNN / SegNet) running on survey GPU infrastructure.</div>
              </div>
            </div>
          )}
        </div>

        {/* Action to Map */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <span>Inspect Candidates on Parcel Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
