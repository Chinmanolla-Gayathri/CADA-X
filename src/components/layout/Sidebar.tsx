import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Cpu, 
  Map, 
  ShieldAlert, 
  Crosshair, 
  Download,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCadastral, AppTab } from '../../context/CadastralContext';

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeTone?: 'neutral' | 'alert' | 'highlight';
  tourStepMatch?: number;
}

export const Sidebar: React.FC<{ isCollapsed?: boolean; onToggleCollapse?: () => void }> = ({
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    topologyIssues,
    isTourActive,
    tourStep 
  } = useCadastral();

  const unresolvedCount = topologyIssues.filter(i => i.status !== 'Resolved').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'data', label: 'Data', icon: Database, tourStepMatch: 1 },
    { id: 'extraction', label: 'Extraction', icon: Cpu, tourStepMatch: 2 },
    { id: 'map', label: 'Parcel Map', icon: Map, badge: 'Main', badgeTone: 'highlight', tourStepMatch: 3 },
    { 
      id: 'validation', 
      label: 'Validation', 
      icon: ShieldAlert, 
      badge: unresolvedCount > 0 ? `${unresolvedCount}` : undefined,
      badgeTone: 'alert',
      tourStepMatch: 4
    },
    { id: 'groundtruth', label: 'Ground Truth', icon: Crosshair, tourStepMatch: 5 },
    { id: 'export', label: 'Export', icon: Download }
  ];

  return (
    <aside className={`shrink-0 flex flex-col border-r border-slate-200 bg-[#f8fafc] text-slate-700 select-none transition-all duration-150 shadow-xs ${
      isCollapsed ? 'w-16' : 'w-56'
    }`}>
      {/* Top project indicator / mini-brand in sidebar */}
      <div className="h-11 px-3 border-b border-slate-200/80 flex items-center justify-between bg-white">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-teal-700" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 font-mono">
              WORKBENCH
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Layers className="w-3.5 h-3.5 text-teal-700" />
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Primary Navigation List (Only 7 items) */}
      <nav className="flex-1 py-2 px-1.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlightedByTour = isTourActive && item.tourStepMatch === tourStep;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-all ${
                isHighlightedByTour
                  ? 'bg-teal-100 text-teal-900 font-bold ring-2 ring-teal-600 ring-offset-1'
                  : isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${
                isActive || isHighlightedByTour ? 'text-teal-700' : 'text-slate-400'
              }`} />
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono leading-none ${
                      item.badgeTone === 'alert'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : item.badgeTone === 'highlight'
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: Project & Status (Section 4 requirement) */}
      <div className="p-3 border-t border-slate-200 bg-white text-[11px] space-y-1">
        {!isCollapsed ? (
          <>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Project</div>
            <div className="text-slate-800 font-medium truncate" title="Sector 4 East Urban Corridor">
              Sector 4 East Urban
            </div>
            <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Prototype Ready</span>
            </div>
          </>
        ) : (
          <div className="flex justify-center" title="Sector 4 East Urban Corridor (Prototype Ready)">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          </div>
        )}
      </div>
    </aside>
  );
};
