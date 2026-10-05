import React from 'react';
import { 
  Download, 
  FileCode, 
  FileSpreadsheet, 
  FolderArchive, 
  ShieldCheck, 
  Shield 
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { downloadGeoJSON, downloadParcelsCSV, downloadShapefileBundle } from '../../utils/turfUtils';

export const ExportView: React.FC = () => {
  const { 
    parcels, 
    buildings, 
    roads, 
    topologyIssues, 
    showToast 
  } = useCadastral();

  const handleExportGeoJSON = () => {
    downloadGeoJSON(parcels, buildings, roads, topologyIssues);
    showToast('Exported UrbanCadastral_Parcels.geojson (RFC 7946)');
  };

  const handleExportCSV = () => {
    downloadParcelsCSV(parcels);
    showToast('Exported UrbanCadastral_Parcels.csv');
  };

  const handleExportShapefile = () => {
    downloadShapefileBundle(parcels, buildings, roads, topologyIssues);
    showToast('Exported GIS Package (.geojson + .prj projection)');
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto bg-[#F5F7F9]">
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Export GIS Data</h2>
        <div className="text-xs text-slate-500 font-medium">
          Current project: <span className="font-semibold text-slate-800">Sector 4 East Urban Corridor</span> (EPSG:4326 / WGS 84)
        </div>
      </div>

      {/* Available Formats (Section 23) */}
      <div className="space-y-3">
        {/* GeoJSON */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">GeoJSON</span>
              <span className="text-[10px] font-mono text-teal-800 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 font-semibold">
                RFC 7946 Standard
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Parcel polygons + attributes ({parcels.length} candidate parcels, {buildings.length} footprints, {roads.length} roads)
            </p>
          </div>

          <button
            onClick={handleExportGeoJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* CSV */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">CSV</span>
              <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">
                Tabular Register
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Parcel attribute register with Area (m²), Land-use class, Centroid coordinates, and Surveyor status
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Shapefile package */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">Shapefile package</span>
              <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">
                GIS Bundle (.prj)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              GIS-compatible parcel package bundled with WGS 84 (.prj) projection specification for QGIS & ArcGIS
            </p>
          </div>

          <button
            onClick={handleExportShapefile}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Cadastral Statutory Disclaimer (Section 23) */}
      <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/70 text-xs text-slate-700 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong className="text-teal-950 font-semibold">Cadastral Disclaimer: </strong>
          Preliminary cadastral candidates require appropriate survey verification before authoritative use. Final property titling and revenue adoption requires official state GNSS surveyor approval.
        </p>
      </div>
    </div>
  );
};
