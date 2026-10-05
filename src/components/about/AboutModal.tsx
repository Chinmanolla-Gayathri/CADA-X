import React from 'react';
import { X, ShieldCheck, Cpu, Layers, BookOpen, ExternalLink, Key } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-slate-200 rounded-xl p-6 text-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-teal-700 font-bold">CADA-X</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">SIH 2024 · PS #26012</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            AI-Assisted Automated Urban Parcel Mapping & Cadastral Feature Extraction
          </h2>
        </div>

        {/* Core Protocol */}
        <div className="mb-4 p-3 rounded-lg bg-teal-50/70 border border-teal-200 text-xs">
          <div className="font-bold text-teal-900 mb-0.5">Cadastral Governance Principle:</div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            <strong className="text-teal-800 font-semibold">AI proposes → GIS validates → Surveyor verifies.</strong> Generated parcel boundaries are preliminary candidates and require certified GNSS RTK survey validation before legal title adoption.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-slate-600">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Problem Statement</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Traditional urban parcel delineation relies on manual digitizing from aerial/satellite imagery, taking weeks per square kilometer and delaying modern land tenure updates.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">CADA-X Multi-Source Spatial Architecture</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
              Instead of attempting to directly guess property boundaries from raw RGB pixels alone, the system integrates spatial cues:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-teal-800 block font-bold mb-0.5">1. Feature Extraction</span>
                Building footprints, road corridors & land use classification.
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-teal-800 block font-bold mb-0.5">2. Spatial Reasoning</span>
                Setback buffer geometry & candidate boundary inference.
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-teal-800 block font-bold mb-0.5">3. Topology Validation</span>
                Planar graph checks for overlaps, gaps & self-intersections via Turf.js.
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-teal-800 block font-bold mb-0.5">4. GNSS Verification</span>
                Comparison against certified ground-truth survey stations.
              </div>
            </div>
          </div>

          {/* CARTO Basemap Setup (Section 28) */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Key className="w-3.5 h-3.5 text-teal-700" />
              <span>CARTO Basemap Configuration</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              To use CARTO Dark or Voyager raster tiles, configure your official CARTO Basemaps API key:
            </p>
            <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-800">
              VITE_CARTO_API_KEY="YOUR_KEY"
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <a
                href="https://carto.com/basemaps/apikey/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>Get a CARTO Basemaps API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-400 text-[10px]">Fallback: OpenStreetMap</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">
            EPSG:3857 / WGS 84 · RFC 7946
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
