export type LandUseType = 
  | 'Residential' 
  | 'Commercial' 
  | 'Mixed Use' 
  | 'Industrial' 
  | 'Public' 
  | 'Open/Green';

export type ParcelStatus = 
  | 'Preliminary' 
  | 'Verified' 
  | 'Needs Review' 
  | 'Flagged for Field Survey';

export interface ParcelFeature {
  id: string; // e.g. P-1023
  surveyNumber: string; // e.g. Sy. No. 42/1A
  ward: string; // e.g. Ward 14 - North Zone
  areaSqM: number;
  perimeterM: number;
  landUse: LandUseType;
  confidence: number; // 0 - 100
  status: ParcelStatus;
  buildingCount: number;
  roadAccess: boolean;
  roadName?: string;
  assessedValueINR?: number;
  coordinates: [number, number][]; // [lat, lng] array for Leaflet polygon
  centroid: [number, number]; // [lat, lng]
  generationReasoning: {
    buildingFootprintDetected: boolean;
    roadBoundaryAligned: boolean;
    existingCadastralRef: string;
    setbackDistanceM: number;
    spatialSeparationScore: number;
    explanation: string;
  };
  notes?: string;
  groundTruthDiscrepancyM?: number;
}

export interface BuildingFeature {
  id: string;
  parcelId?: string;
  floors: number;
  heightM: number;
  areaSqM: number;
  confidence: number;
  type: string;
  coordinates: [number, number][];
}

export interface RoadFeature {
  id: string;
  name: string;
  widthM: number;
  surface: 'Asphalt' | 'Concrete' | 'Paved Lane' | 'Unpaved';
  confidence: number;
  coordinates: [number, number][]; // line coordinates [lat, lng]
}

export type TopologySeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type TopologyIssueType = 
  | 'Overlap' 
  | 'Self Intersection' 
  | 'Gap' 
  | 'Duplicate Boundary' 
  | 'Sliver Polygon'
  | 'Unclosed Boundary';

export interface TopologyIssue {
  id: string; // T-001
  parcelId: string;
  secondaryParcelId?: string;
  type: TopologyIssueType;
  severity: TopologySeverity;
  status: 'Needs Review' | 'Resolved' | 'Ignored';
  description: string;
  coordinates?: [number, number];
  affectedAreaSqM?: number;
}

export interface GroundTruthPoint {
  id: string; // GT-101
  stationName: string;
  equipment: 'Trimble R12 GNSS RTK' | 'Leica GS18 T' | 'Total Station TS16';
  latitude: number;
  longitude: number;
  elevationM: number;
  accuracyCm: number;
  associatedParcelId: string;
  surveyDate: string;
  surveyor: string;
  status: 'Verified' | 'Pending' | 'Flagged';
}

export interface DatasetMetadata {
  name: string;
  location: string;
  resolution: string; // '4096 × 4096 px'
  coverageSqKm: number; // 1.84 km²
  gsdCmPerPixel: number; // 4.2 cm/pixel
  flightAltitudeM: number; // 120 m
  sensor: string; // 'Sony Alpha RX1R II (42.4 MP)'
  flightDate: string;
  crs: string; // 'EPSG:3857 / WGS 84 UTM Zone 43N'
  orthophotoUrl: string;
  hasDtm: boolean;
  cloudCoverPercent: number;
}

export interface ExtractionStats {
  parcelsDetected: number;
  buildingsDetected: number;
  roadsExtracted: number;
  validationIssuesCount: number;
  averageConfidence: number;
  manualHoursPerSqKm: number;
  aiHoursPerSqKm: number;
  effortReductionPercent: number;
  boundaryAgreementPercent: number;
}
