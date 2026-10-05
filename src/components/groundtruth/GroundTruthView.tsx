import React, { useState } from 'react';
import { 
  Crosshair, 
  ShieldCheck, 
  Check, 
  X, 
  Edit3, 
  MapPin, 
  Info,
  Shield
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { ParcelFeature } from '../../types/cadastral';

export const GroundTruthView: React.FC = () => {
  const { 
    parcels, 
    groundTruthPoints, 
    selectedParcel, 
    setSelectedParcel, 
    updateParcelStatus, 
    setActiveTab,
    showToast 
  } = useCadastral();

  const [activeParcel, setActiveParcel] = useState<ParcelFeature>(selectedParcel || parcels[0]);
  const [toleranceM, setToleranceM] = useState<number>(0.15);

  const handleAccept = () => {
    updateParcelStatus(activeParcel.id, 'Verified');
    showToast(`Parcel ${activeParcel.id} accepted by surveyor`);
  };

  const handleFieldSurvey = () => {
    updateParcelStatus(activeParcel.id, 'Flagged for Field Survey');
    showToast(`Parcel ${activeParcel.id} marked for GNSS field survey`);
  };

  const handleReject = () => {
    updateParcelStatus(activeParcel.id, 'Needs Review');
    showToast(`Parcel ${activeParcel.id} marked for manual boundary review`);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-5xl mx-auto bg-[#F5F7F9]">
      {/* Title */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Ground Truth & GNSS Verification</h2>
          <div className="text-xs text-slate-500 font-medium">Verify AI candidate boundaries against geodetic survey benchmarks</div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs text-teal-800 font-medium">
          <Shield className="w-3.5 h-3.5 text-teal-700" />
          <span>AI proposes → GIS validates → Surveyor verifies</span>
        </div>
      </div>

      {/* Main Comparative Workstation Grid (Section 22) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Map Comparison Visualizer */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-900">
                Candidate vs. Ground Truth
              </span>
              <span className="font-mono text-teal-800 font-bold">{activeParcel.id}</span>
            </div>

            {/* Geometric Vector Comparison Visualizer */}
            <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col items-center justify-center min-h-[260px]">
              <svg viewBox="0 0 380 200" className="w-full max-w-sm h-auto">
                <defs>
                  <pattern id="lightGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="380" height="200" fill="url(#lightGrid)" />

                {/* Ground Truth Reference Boundary (Solid Cyan/Teal) */}
                <polygon
                  points="60,35 320,38 305,165 75,160"
                  fill="rgba(15, 118, 110, 0.08)"
                  stroke="#0f766e"
                  strokeWidth="2"
                />

                {/* AI Candidate Boundary (Dashed Blue) */}
                <polygon
                  points="64,39 316,42 308,162 72,157"
                  fill="rgba(2, 132, 199, 0.12)"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />

                {/* Building Footprint */}
                <polygon
                  points="130,70 245,72 240,135 125,133"
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth="1.2"
                />
                <text x="185" y="106" textAnchor="middle" fill="#334155" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                  Structure Footprint
                </text>

                {/* GNSS Benchmark Marker */}
                <circle cx="60" cy="35" r="4.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                <text x="70" y="34" fill="#9f1239" fontSize="8" fontFamily="monospace">GT-101 (RTK)</text>
              </svg>

              {/* Minimal Legend */}
              <div className="flex items-center gap-4 mt-3 text-[11px] font-medium">
                <div className="flex items-center gap-1.5 text-teal-800">
                  <span className="w-3.5 h-1 bg-teal-700 rounded-xs inline-block" />
                  <span>GNSS Ground Truth</span>
                </div>
                <div className="flex items-center gap-1.5 text-sky-700">
                  <span className="w-3.5 h-1 border-t-2 border-dashed border-sky-600 inline-block" />
                  <span>AI Candidate</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                  <span>RTK Station</span>
                </div>
              </div>
            </div>

            {/* Tolerance Control (Section 22) */}
            <div className="pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600 font-medium">Admissible tolerance:</span>
                <span className="font-mono text-teal-800 font-bold">±{toleranceM.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.01"
                value={toleranceM}
                onChange={(e) => setToleranceM(parseFloat(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer h-1.5 bg-slate-200 rounded"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.05m (Sub-decimeter)</span>
                <span>0.15m (Cadastral Standard)</span>
                <span>0.50m (Rural)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Telemetry & Actions (Section 22) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-3.5 text-xs">
            {/* Parcel selector */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Candidate Parcel</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{activeParcel.id}</span>
              </div>
              <select
                value={activeParcel.id}
                onChange={(e) => {
                  const target = parcels.find(p => p.id === e.target.value);
                  if (target) {
                    setActiveParcel(target);
                    setSelectedParcel(target);
                  }
                }}
                className="bg-slate-50 text-slate-800 text-xs rounded-lg px-2.5 py-1 border border-slate-200 font-mono focus:outline-none"
              >
                {parcels.map(p => (
                  <option key={p.id} value={p.id}>{p.id} ({p.surveyNumber})</option>
                ))}
              </select>
            </div>

            {/* Metrics (Section 22) */}
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Confidence</span>
                <span className="text-slate-900 font-semibold">{activeParcel.confidence}%</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Ground Truth</span>
                <span className="text-teal-800 font-medium">Available (RTK Benchmarks)</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Agreement</span>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold text-xs">93.8%</span>
                  <span className="text-[9px] text-slate-400 block font-sans italic">Demo agreement indicator</span>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-sans">Boundary Discrepancy</span>
                <span className="text-slate-800">±{activeParcel.groundTruthDiscrepancyM || 0.12} m</span>
              </div>
            </div>

            {/* Actions (Section 22) */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleAccept}
                className="w-full px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept AI Boundary</span>
              </button>

              <button
                onClick={() => showToast(`Geometry edit mode active for ${activeParcel.id}`)}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Boundary</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={handleReject}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs border border-slate-200 transition-colors"
                >
                  Reject
                </button>

                {/* Prominent Field Survey action (Section 22) */}
                <button
                  onClick={handleFieldSurvey}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Crosshair className="w-3.5 h-3.5 text-amber-700" />
                  <span>Field Survey</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 font-mono leading-tight">
              * Official cadastral adoption requires surveyor RTK benchmark sign-off.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
