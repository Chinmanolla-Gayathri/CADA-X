import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { TopologyIssue } from '../../types/cadastral';

export const ValidationView: React.FC = () => {
  const { 
    topologyIssues, 
    resolveTopologyIssue, 
    parcels, 
    setSelectedParcel, 
    setActiveTab, 
    showToast 
  } = useCadastral();

  // Top 5 issues requiring attention as specified in Section 21
  const [selectedIssue, setSelectedIssue] = useState<TopologyIssue>(topologyIssues[0]);

  const unresolvedCount = topologyIssues.filter(i => i.status !== 'Resolved').length;

  const handleReviewGeometry = (issue: TopologyIssue) => {
    const target = parcels.find(p => p.id === issue.parcelId);
    if (target) {
      setSelectedParcel(target);
    }
    setActiveTab('map');
  };

  const handleMarkResolved = (issueId: string) => {
    resolveTopologyIssue(issueId);
    showToast(`Marked topology issue ${issueId} as resolved`);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-5xl mx-auto bg-[#F5F7F9]">
      {/* Title & Summary (Section 21) */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Topology Validation</h2>
          <div className="text-xs text-slate-500 font-medium">Planar geometry checks for preliminary cadastral boundaries</div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-amber-800 font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300">
            5 issues requiring attention
          </span>
          <span className="text-slate-500 font-mono">128 parcels audited</span>
        </div>
      </div>

      {/* Main Grid: Issue Table (Left) + Geometry Checks (Right) (Section 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Table (Section 21) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs">
            <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-2">
              Planar Topology Register
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-mono text-slate-400 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5">Parcel</th>
                    <th className="py-2 px-2.5">Issue</th>
                    <th className="py-2 px-2.5">Severity</th>
                    <th className="py-2 px-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {topologyIssues.slice(0, 5).map((issue) => {
                    const isSelected = selectedIssue?.id === issue.id;
                    const isOpen = issue.status !== 'Resolved';

                    return (
                      <tr
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-teal-50/70 text-slate-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="py-2.5 px-2.5 font-bold text-teal-800">{issue.parcelId}</td>
                        <td className="py-2.5 px-2.5 text-slate-800 font-sans">{issue.type}</td>
                        <td className="py-2.5 px-2.5">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                            issue.severity === 'High' || issue.severity === 'Critical'
                              ? 'bg-red-50 text-red-700 border border-red-200 font-semibold'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold'
                          }`}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5">
                          <span className={isOpen ? 'text-amber-700 font-semibold' : 'text-emerald-700'}>
                            {isOpen ? 'Open' : 'Resolved'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Geometry Checks & Action Box (Section 21) */}
        <div className="lg:col-span-5 space-y-3">
          {selectedIssue ? (
            <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-3.5 text-xs">
              <div className="pb-2.5 border-b border-slate-100">
                <span className="font-mono text-teal-800 font-bold">{selectedIssue.id} · {selectedIssue.parcelId}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedIssue.type}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{selectedIssue.description}</p>
              </div>

              {/* Geometry Checks Checklist (Section 21) */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="text-[10px] uppercase text-slate-400 font-sans font-semibold">Geometry Checks</div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Closed polygon</span>
                    <span className="text-emerald-700 font-bold">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Valid geometry structure</span>
                    <span className="text-emerald-700 font-bold">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>No self-intersection</span>
                    <span className="text-emerald-700 font-bold">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-900 font-semibold">
                    <span>Planar boundary adjacency</span>
                    <span className="text-amber-700 font-bold">⚠ Overlap detected</span>
                  </div>
                </div>
              </div>

              {/* Actions (Section 21) */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleReviewGeometry(selectedIssue)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs border border-slate-300 shadow-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>Review Geometry on Map</span>
                </button>

                <button
                  onClick={() => handleMarkResolved(selectedIssue.id)}
                  disabled={selectedIssue.status === 'Resolved'}
                  className="w-full px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  {selectedIssue.status === 'Resolved' ? 'Marked Resolved' : 'Mark Resolved'}
                </button>
              </div>

              <div className="text-[10px] text-slate-400 italic">
                * Automated boundary snapping is provisional; authoritative boundary definition requires surveyor confirmation.
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg border border-slate-200 bg-white text-xs text-slate-400 text-center">
              Select an issue from the register to inspect checks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
