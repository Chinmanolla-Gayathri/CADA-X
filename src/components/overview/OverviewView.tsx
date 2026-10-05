import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Building, 
  Map as MapIcon, 
  Navigation, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight,
  Shield,
  Layers,
  Check,
  CircleDot
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { GeospatialBackground } from '../common/GeospatialBackground';

export const OverviewView: React.FC = () => {
  const { 
    metadata, 
    stats, 
    setActiveTab, 
    topologyIssues 
  } = useCadastral();

  const [activeTabSub, setActiveTabSub] = useState<'summary' | 'analytics'>('summary');

  const unresolvedCount = topologyIssues.filter(i => i.status !== 'Resolved').length;

  // 4 Compact Metric Blocks (Section 7)
  const compactMetrics = [
    {
      label: 'Preliminary parcels',
      value: stats.parcelsDetected,
      descriptor: 'Demo dataset candidates',
      tone: 'teal'
    },
    {
      label: 'Building footprints',
      value: stats.buildingsDetected,
      descriptor: 'Extracted structures',
      tone: 'slate'
    },
    {
      label: 'Road/access corridors',
      value: stats.roadsExtracted,
      descriptor: 'Centerlines & margins',
      tone: 'slate'
    },
    {
      label: 'Topology alerts',
      value: 5,
      descriptor: 'Review issues flagged',
      tone: 'amber',
      isAlert: true
    }
  ];

  // Workflow Timeline Stages (Section 8)
  const workflowTimeline = [
    { num: 1, key: 'Data', status: 'Loaded', icon: Check, isDone: true, tab: 'data' as const },
    { num: 2, key: 'Extract', status: 'Extracted', icon: Check, isDone: true, tab: 'extraction' as const },
    { num: 3, key: 'Infer', status: 'Generated', icon: Check, isDone: true, tab: 'map' as const },
    { num: 4, key: 'Validate', status: '5 Alerts', icon: AlertCircle, isAlert: true, tab: 'validation' as const },
    { num: 5, key: 'Verify', status: 'Pending', icon: CircleDot, tab: 'groundtruth' as const },
    { num: 6, key: 'Export', status: 'Ready', icon: CircleDot, tab: 'export' as const }
  ];

  // Compact Analytics Data (Section 19)
  const workflowData = [
    { stage: 'Digitization', Manual: 6.5, AI_Assisted: 1.8 },
    { stage: 'Boundary Drafting', Manual: 4.8, AI_Assisted: 0.9 },
    { stage: 'Review & QA', Manual: 2.2, AI_Assisted: 0.8 }
  ];

  const landUseData = [
    { name: 'Residential', value: 62, color: '#0f766e' },
    { name: 'Commercial', value: 18, color: '#d97706' },
    { name: 'Mixed Use', value: 11, color: '#0284c7' },
    { name: 'Public/Open', value: 9, color: '#7c3aed' }
  ];

  const confidenceData = [
    { range: '95-100%', count: 48 },
    { range: '90-94%', count: 52 },
    { range: '85-89%', count: 20 },
    { range: '<85%', count: 8 }
  ];

  return (
    <div className="relative h-full w-full overflow-y-auto min-h-full">
      {/* Subtle Living Cadastral & Cartographic Background */}
      <GeospatialBackground variant="overview" showDecorations={true} />

      <div className="relative z-10 p-4 md:p-6 space-y-4 max-w-5xl mx-auto min-h-full">
        {/* Top Header & Sub-tab Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Sector 4 East Urban Corridor
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-teal-100/80 text-teal-800 border border-teal-200/60">
                ZONE 4-B
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Preliminary cadastral intelligence workspace · High-resolution UAV orthomosaic
            </div>
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded bg-slate-200/80 text-xs">
            <button
              onClick={() => setActiveTabSub('summary')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTabSub === 'summary'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Control Summary
            </button>
            <button
              onClick={() => setActiveTabSub('analytics')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTabSub === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analytics & Estimates
            </button>
          </div>
        </div>

        {activeTabSub === 'summary' ? (
          <div className="space-y-4">
            {/* Horizontal Information Bar (Section 6) */}
            <div className="p-3.5 rounded-lg border border-slate-200/90 bg-white/94 backdrop-blur-xs shadow-xs text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="sm:pr-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-medium">Coverage</span>
                  <span className="font-semibold text-slate-900 text-sm">{metadata.coverageSqKm} km²</span>
                  <span className="text-[10px] text-slate-500 block">Urban jurisdiction</span>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-medium">CRS</span>
                  <span className="font-mono text-slate-900 font-semibold text-sm">EPSG:3857</span>
                  <span className="text-[10px] text-slate-500 block">WGS 84 Web Mercator</span>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-medium">GSD</span>
                  <span className="font-mono text-slate-900 font-semibold text-sm">{metadata.gsdCmPerPixel} cm</span>
                  <span className="text-[10px] text-slate-500 block">Sub-decimeter nadir</span>
                </div>
                <div className="pt-2 sm:pt-0 sm:pl-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-medium">Imagery</span>
                  <span className="font-semibold text-teal-800 text-sm">UAV Orthophoto</span>
                  <span className="text-[10px] text-emerald-600 font-medium block">✓ Calibrated Raster</span>
                </div>
              </div>
            </div>

            {/* 4 Compact Refined Metric Blocks (Section 7) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {compactMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200/90 bg-white/94 backdrop-blur-xs shadow-xs flex flex-col justify-between"
                >
                  <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                  <div className="py-1">
                    <span className={`text-2xl font-bold font-mono tracking-tight ${
                      m.isAlert ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                      {m.value}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{m.descriptor}</div>
                </div>
              ))}
            </div>

            {/* Workflow Timeline Connecting Line (Section 8) */}
            <div className="p-4 rounded-lg border border-slate-200/90 bg-white/94 backdrop-blur-xs shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase text-[11px] text-slate-500 font-semibold">
                  Cadastral Processing Sequence
                </span>
                <span className="text-[10px] text-slate-400">Continuous spatial pipeline</span>
              </div>

              {/* Connecting line workflow */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                {workflowTimeline.map((step) => {
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.key}
                      onClick={() => setActiveTab(step.tab)}
                      className={`p-2.5 rounded-lg text-left border transition-all hover:bg-slate-50 relative ${
                        step.isAlert
                          ? 'border-amber-300 bg-amber-50/50 text-amber-900 shadow-xs ring-1 ring-amber-400/40'
                          : step.isDone
                          ? 'border-slate-200 bg-white text-slate-800'
                          : 'border-slate-200/80 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>0{step.num}</span>
                        <Icon className={`w-3 h-3 ${
                          step.isAlert ? 'text-amber-600' : step.isDone ? 'text-teal-700' : 'text-slate-400'
                        }`} />
                      </div>
                      <div className="text-xs font-semibold text-slate-900">{step.key}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">{step.status}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Elegant Governance Principle Callout (Section 9) */}
            <div className="p-4 rounded-lg border border-teal-200/90 bg-teal-50/85 backdrop-blur-xs shadow-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 font-mono">
                  Cadastral Governance Principle
                </h4>
              </div>
              
              <div className="text-sm font-semibold text-teal-950 pl-6">
                AI proposes → GIS validates → Surveyor verifies
              </div>

              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Generated parcel boundaries are preliminary candidates and require appropriate survey/GNSS verification before authoritative use.
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 bg-white/80 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200/80">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Prototype confidence indicator: <strong className="text-slate-800 font-mono">91.4% average</strong></span>
              </span>
              <button
                onClick={() => setActiveTab('map')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs transition-colors cursor-pointer"
              >
                <span>Launch WebGIS Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Analytics Sub-tab (Section 19) */
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-50/90 backdrop-blur-xs border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Notice: Prototype / simulated workflow estimates — not validated field-trial measurements.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workflow Comparison Chart */}
              <div className="p-4 rounded-lg border border-slate-200/90 bg-white/94 backdrop-blur-xs shadow-xs space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs">Manual vs. AI-Assisted Time (hrs/km²)</h4>
                <p className="text-[11px] text-slate-500">Simulated labor workflow estimate (~72.3% reduction)</p>

                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="stage" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                      <Bar dataKey="Manual" fill="#94a3b8" name="Manual Digitization" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="AI_Assisted" fill="#0f766e" name="AI-Assisted Workflow" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Land Use Classification Share */}
              <div className="p-4 rounded-lg border border-slate-200/90 bg-white/94 backdrop-blur-xs shadow-xs space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs">Land-Use Feature Distribution</h4>
                <p className="text-[11px] text-slate-500">Inferred from drone texture & cadastral spatial analysis</p>

                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={landUseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {landUseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, 'Coverage']}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Confidence Histogram */}
            <div className="p-3.5 rounded-lg border border-slate-200/90 bg-white/94 backdrop-blur-xs shadow-xs space-y-2 text-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                Prototype Confidence Histogram (128 Parcels)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {confidenceData.map((item, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50/80 border border-slate-200 text-center">
                    <div className="text-slate-500 text-[10px] font-mono">{item.range}</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{item.count} Parcels</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{((item.count / 128) * 100).toFixed(0)}% of total</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
