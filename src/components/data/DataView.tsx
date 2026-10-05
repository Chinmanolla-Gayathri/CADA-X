import React, { useState } from 'react';
import { 
  Upload, 
  Check, 
  FileCheck, 
  Database, 
  Layers, 
  ArrowRight, 
  FileText,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { GeospatialBackground } from '../common/GeospatialBackground';

export const DataView: React.FC = () => {
  const { metadata, setActiveTab, loadDemoDataset, showToast } = useCadastral();
  const [isDragging, setIsDragging] = useState(false);
  const [ingestedFile, setIngestedFile] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setIngestedFile(file.name);
      showToast(`Ingested spatial raster: ${file.name}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIngestedFile(file.name);
      showToast(`Ingested spatial raster: ${file.name}`);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto bg-[#F5F7F9]">
      {/* Subtle Geospatial Cartographic Animation */}
      <GeospatialBackground />

      <div className="relative z-10 space-y-4">
        {/* Title */}
        <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Data & Imagery Ingestion</h2>
            <div className="text-xs text-slate-500 font-medium">Load UAV orthophoto imagery, elevation models and cadastral evidence</div>
          </div>

          <button
            onClick={loadDemoDataset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium shadow-xs transition-colors self-start sm:self-auto"
          >
            <Compass className="w-3.5 h-3.5 text-teal-700" />
            <span>Load Demo Urban Dataset</span>
          </button>
        </div>

        {/* Large Clean Drop Zone (Section 15) */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`p-8 rounded-xl border-2 border-dashed text-center transition-all bg-white shadow-xs ${
            isDragging 
              ? 'border-teal-500 bg-teal-50/30' 
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-500">
            <Upload className="w-6 h-6 text-teal-700" />
          </div>

          <h3 className="text-sm font-bold text-slate-900">Add spatial data</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Drop ORI / GeoTIFF / JPG / PNG with world file (.tfw) or DSM raster
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <label className="cursor-pointer px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-xs transition-colors">
              Browse local file
              <input
                type="file"
                accept=".tif,.tiff,.png,.jpg,.jpeg,.zip,.geojson"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <span className="text-xs text-slate-400 font-mono">or</span>

            {/* Prominent Secondary Demo Loader (Section 15) */}
            <button
              onClick={loadDemoDataset}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors border border-slate-200"
            >
              Load Demo Urban Dataset
            </button>
          </div>

          {ingestedFile && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-teal-50 text-teal-800 text-xs font-mono border border-teal-200">
              <Check className="w-3.5 h-3.5" />
              <span>Ingested: {ingestedFile}</span>
            </div>
          )}
        </div>

        {/* Spatial Evidence Status Checklist (Section 15) */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">
            Spatial Evidence Status
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <span className="text-slate-800 font-medium">ORI / RGB (Orthophoto)</span>
              </div>
              <span className="text-teal-800 font-mono text-[11px] font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                ✓ Ready (Sector 4 Nadir)
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-700" />
                <span className="text-slate-800 font-medium">DSM / DTM (Elevation Raster)</span>
              </div>
              <span className="text-teal-800 font-mono text-[11px] font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                ✓ Ready (Surface Heights)
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-700" />
                <span className="text-slate-800 font-medium">Existing GIS (Reference Cadastre)</span>
              </div>
              <span className="text-teal-800 font-mono text-[11px] font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                ✓ Ready (Ward Revenue Layer)
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 font-medium">Ground Truth / GNSS Benchmarks</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                ○ Optional (5 stations available)
              </span>
            </div>
          </div>
        </div>

        {/* Loaded Dataset Telemetry (Section 13) */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-1">
            Active Dataset Telemetry
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Project CRS</span>
              <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{metadata.crs}</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Estimated Coverage</span>
              <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{metadata.coverageSqKm} km²</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Resolution / GSD</span>
              <span className="font-mono text-slate-900 font-semibold mt-0.5 block">{metadata.gsdCmPerPixel} cm/px ({metadata.resolution})</span>
            </div>
          </div>
        </div>

        {/* Action Next */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveTab('extraction')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <span>Proceed to AI Extraction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
