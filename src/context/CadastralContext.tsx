import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ParcelFeature, 
  BuildingFeature, 
  RoadFeature, 
  TopologyIssue, 
  GroundTruthPoint, 
  DatasetMetadata,
  ExtractionStats,
  ParcelStatus
} from '../types/cadastral';
import { 
  INITIAL_PARCELS, 
  INITIAL_BUILDINGS, 
  INITIAL_ROADS, 
  INITIAL_TOPOLOGY_ISSUES, 
  INITIAL_GROUND_TRUTH_POINTS, 
  INITIAL_METADATA, 
  INITIAL_STATS 
} from '../data/syntheticUrbanData';

export type AppTab = 
  | 'overview' 
  | 'data' 
  | 'extraction' 
  | 'map' 
  | 'validation' 
  | 'groundtruth' 
  | 'export';

export interface LayerVisibility {
  orthophoto: boolean;
  parcels: boolean;
  buildings: boolean;
  roads: boolean;
  landUse: boolean;
  existingGis: boolean;
  groundTruth: boolean;
  issues: boolean;
}

interface CadastralContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  metadata: DatasetMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<DatasetMetadata>>;
  parcels: ParcelFeature[];
  buildings: BuildingFeature[];
  roads: RoadFeature[];
  topologyIssues: TopologyIssue[];
  groundTruthPoints: GroundTruthPoint[];
  stats: ExtractionStats;
  selectedParcel: ParcelFeature | null;
  setSelectedParcel: (parcel: ParcelFeature | null) => void;
  selectedIssue: TopologyIssue | null;
  setSelectedIssue: (issue: TopologyIssue | null) => void;
  visibleLayers: LayerVisibility;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setAllLayers: (visible: boolean) => void;
  isProcessing: boolean;
  processingProgress: number;
  processingStage: string;
  processingLogs: string[];
  hasExtracted: boolean;
  runAiExtraction: (onComplete?: () => void) => void;
  launchQuickDemo: () => void;
  isDemoRunning: boolean;
  demoStep: number;
  cancelDemo: () => void;
  loadDemoDataset: () => void;
  updateParcelStatus: (parcelId: string, status: ParcelStatus) => void;
  resolveTopologyIssue: (issueId: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Onboarding & Guided Tour State
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  isTourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  replayTour: () => void;
  exploreDemoFromWelcome: () => void;
  startWithMyDataFromWelcome: () => void;
}

const CadastralContext = createContext<CadastralContextType | undefined>(undefined);

export const CadastralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [metadata, setMetadata] = useState<DatasetMetadata>(INITIAL_METADATA);
  const [parcels, setParcels] = useState<ParcelFeature[]>(INITIAL_PARCELS);
  const [buildings, setBuildings] = useState<BuildingFeature[]>(INITIAL_BUILDINGS);
  const [roads, setRoads] = useState<RoadFeature[]>(INITIAL_ROADS);
  const [topologyIssues, setTopologyIssues] = useState<TopologyIssue[]>(INITIAL_TOPOLOGY_ISSUES);
  const [groundTruthPoints, setGroundTruthPoints] = useState<GroundTruthPoint[]>(INITIAL_GROUND_TRUTH_POINTS);
  const [stats, setStats] = useState<ExtractionStats>(INITIAL_STATS);
  const [selectedParcel, setSelectedParcel] = useState<ParcelFeature | null>(INITIAL_PARCELS[0]);
  const [selectedIssue, setSelectedIssue] = useState<TopologyIssue | null>(null);

  const [visibleLayers, setVisibleLayers] = useState<LayerVisibility>({
    orthophoto: true,
    parcels: true,
    buildings: true,
    roads: true,
    landUse: true,
    existingGis: false,
    groundTruth: true,
    issues: true,
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(100);
  const [processingStage, setProcessingStage] = useState<string>('Ready');
  const [processingLogs, setProcessingLogs] = useState<string[]>([
    'Imagery ingested: Sector 4 East Urban Corridor (GSD 4.2 cm/px)',
    'Loaded spatial evidence: Drone ORI, DSM/DTM surface model, municipal road network',
    'Feature extraction complete: 173 building footprints, 24 road corridors',
    'Spatial reasoning executed: 128 preliminary parcel candidates generated',
    'Topology QA complete: 5 alerts detected for surveyor verification'
  ]);
  const [hasExtracted, setHasExtracted] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Demo run overlay state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Onboarding & Guided Tour State
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Check first-time visitor in localStorage
  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem('cadax_onboarding_completed');
      if (!hasCompleted) {
        setShowWelcomeModal(true);
      }
    } catch (e) {
      // Local storage disabled or SSR
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleLayer = (layer: keyof LayerVisibility) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const setAllLayers = (visible: boolean) => {
    setVisibleLayers({
      orthophoto: visible,
      parcels: visible,
      buildings: visible,
      roads: visible,
      landUse: visible,
      existingGis: visible,
      groundTruth: visible,
      issues: visible,
    });
  };

  const updateParcelStatus = (parcelId: string, status: ParcelStatus) => {
    setParcels(prev =>
      prev.map(p => (p.id === parcelId ? { ...p, status } : p))
    );
    if (selectedParcel && selectedParcel.id === parcelId) {
      setSelectedParcel(prev => prev ? { ...prev, status } : null);
    }
    showToast(`Parcel ${parcelId} marked as ${status}`);
  };

  const resolveTopologyIssue = (issueId: string) => {
    setTopologyIssues(prev =>
      prev.map(iss => (iss.id === issueId ? { ...iss, status: 'Resolved' } : iss))
    );
    const targetIssue = topologyIssues.find(i => i.id === issueId);
    if (targetIssue) {
      setParcels(prev =>
        prev.map(p =>
          p.id === targetIssue.parcelId ? { ...p, status: 'Preliminary' } : p
        )
      );
    }
    showToast(`Topology issue ${issueId} resolved`);
  };

  const loadDemoDataset = () => {
    setMetadata(INITIAL_METADATA);
    setParcels(INITIAL_PARCELS);
    setBuildings(INITIAL_BUILDINGS);
    setRoads(INITIAL_ROADS);
    setTopologyIssues(INITIAL_TOPOLOGY_ISSUES);
    setGroundTruthPoints(INITIAL_GROUND_TRUTH_POINTS);
    setStats(INITIAL_STATS);
    setHasExtracted(true);
    showToast('Loaded Sector 4 East Urban Corridor dataset');
  };

  const runAiExtraction = (onComplete?: () => void) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingLogs([
      'Loading orthophoto and elevation rasters...',
      'Project CRS: EPSG:3857 / WGS 84 UTM Zone 44N'
    ]);

    const stages = [
      { progress: 15, stage: 'Image preprocessing', log: 'Calibrated 4.2 cm/px orthophoto raster and DTM' },
      { progress: 30, stage: 'Building extraction', log: 'Extracted 173 building footprints with height parameters' },
      { progress: 48, stage: 'Road/access extraction', log: 'Traced 24 road corridors and setback margins' },
      { progress: 65, stage: 'Land-use classification', log: 'Classified residential, commercial, mixed, and public parcels' },
      { progress: 80, stage: 'Spatial fusion & parcel inference', log: 'Inferred 128 preliminary parcel candidate polygons' },
      { progress: 92, stage: 'Geometry validation', log: 'Regularized parcel polygons to cadastral tolerance' },
      { progress: 100, stage: 'Topology QA audit', log: 'Executed planar topology checks; 5 issues flagged for review' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < stages.length) {
        const item = stages[currentStep];
        setProcessingProgress(item.progress);
        setProcessingStage(item.stage);
        setProcessingLogs(prev => [...prev, item.log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setHasExtracted(true);
        showToast('Feature extraction complete — 128 candidates generated');
        if (onComplete) onComplete();
      }
    }, 550);
  };

  const launchQuickDemo = () => {
    setIsDemoRunning(true);
    setDemoStep(1); // Data loaded

    setTimeout(() => {
      setDemoStep(2); // Feature extraction
    }, 1500);

    setTimeout(() => {
      setDemoStep(3); // Spatial inference
    }, 3200);

    setTimeout(() => {
      setDemoStep(4); // Topology validation
    }, 5000);

    setTimeout(() => {
      setDemoStep(5); // WebGIS ready
    }, 6800);

    setTimeout(() => {
      setIsDemoRunning(false);
      setActiveTab('map');
      setSelectedParcel(INITIAL_PARCELS[0]);
      showToast('Demo pipeline complete: WebGIS ready');
    }, 8000);
  };

  const cancelDemo = () => {
    setIsDemoRunning(false);
    setActiveTab('map');
  };

  // Onboarding handlers
  const startTour = () => {
    setShowWelcomeModal(false);
    setIsTourActive(true);
    setTourStep(1);
    setActiveTab('data');
  };

  const nextTourStep = () => {
    if (tourStep < 5) {
      const next = tourStep + 1;
      setTourStep(next);
      // Switch active tab based on tour step
      if (next === 2) setActiveTab('extraction');
      if (next === 3) setActiveTab('map');
      if (next === 4) setActiveTab('validation');
      if (next === 5) setActiveTab('groundtruth');
    } else {
      endTour();
    }
  };

  const prevTourStep = () => {
    if (tourStep > 1) {
      const prev = tourStep - 1;
      setTourStep(prev);
      if (prev === 1) setActiveTab('data');
      if (prev === 2) setActiveTab('extraction');
      if (prev === 3) setActiveTab('map');
      if (prev === 4) setActiveTab('validation');
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    try {
      localStorage.setItem('cadax_onboarding_completed', 'true');
    } catch (e) {}
    setActiveTab('map');
    showToast('Ready to inspect cadastral candidates');
  };

  const skipTour = () => {
    setIsTourActive(false);
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('cadax_onboarding_completed', 'true');
    } catch (e) {}
  };

  const replayTour = () => {
    setIsTourActive(true);
    setTourStep(1);
    setActiveTab('data');
  };

  const exploreDemoFromWelcome = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('cadax_onboarding_completed', 'true');
    } catch (e) {}
    launchQuickDemo();
  };

  const startWithMyDataFromWelcome = () => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem('cadax_onboarding_completed', 'true');
    } catch (e) {}
    setActiveTab('data');
  };

  return (
    <CadastralContext.Provider
      value={{
        activeTab,
        setActiveTab,
        metadata,
        setMetadata,
        parcels,
        buildings,
        roads,
        topologyIssues,
        groundTruthPoints,
        stats,
        selectedParcel,
        setSelectedParcel,
        selectedIssue,
        setSelectedIssue,
        visibleLayers,
        toggleLayer,
        setAllLayers,
        isProcessing,
        processingProgress,
        processingStage,
        processingLogs,
        hasExtracted,
        runAiExtraction,
        launchQuickDemo,
        isDemoRunning,
        demoStep,
        cancelDemo,
        loadDemoDataset,
        updateParcelStatus,
        resolveTopologyIssue,
        toastMessage,
        showToast,
        showWelcomeModal,
        setShowWelcomeModal,
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        skipTour,
        replayTour,
        exploreDemoFromWelcome,
        startWithMyDataFromWelcome
      }}
    >
      {children}
    </CadastralContext.Provider>
  );
};

export const useCadastral = () => {
  const context = useContext(CadastralContext);
  if (!context) {
    throw new Error('useCadastral must be used within a CadastralProvider');
  }
  return context;
};
