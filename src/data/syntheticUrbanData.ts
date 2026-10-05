import { 
  ParcelFeature, 
  BuildingFeature, 
  RoadFeature, 
  TopologyIssue, 
  GroundTruthPoint, 
  DatasetMetadata,
  ExtractionStats
} from '../types/cadastral';
import { calculatePolygonArea, calculatePolygonPerimeter, calculateCentroid } from '../utils/turfUtils';

// Base coordinate reference: Urban Cadastral Zone, Sector 4, Hyderabad Urban Development Area
export const MAP_CENTER: [number, number] = [17.4435, 78.3772];
export const DEFAULT_ZOOM = 17;

export const INITIAL_METADATA: DatasetMetadata = {
  name: 'Urban Drone Orthomosaic - Sector 4 East',
  location: 'Sector 4, Urban Development Zone, Hyderabad, TS',
  resolution: '4096 × 4096 px',
  coverageSqKm: 1.84,
  gsdCmPerPixel: 4.2,
  flightAltitudeM: 120,
  sensor: 'Sony Alpha RX1R II 42.4MP UAV Payload',
  flightDate: '2026-03-18',
  crs: 'EPSG:3857 / WGS 84 UTM Zone 44N',
  orthophotoUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d46?auto=format&fit=crop&w=1600&q=80',
  hasDtm: true,
  cloudCoverPercent: 1.2
};

export const INITIAL_STATS: ExtractionStats = {
  parcelsDetected: 128,
  buildingsDetected: 173,
  roadsExtracted: 24,
  validationIssuesCount: 7,
  averageConfidence: 91.4,
  manualHoursPerSqKm: 6.5,
  aiHoursPerSqKm: 1.8,
  effortReductionPercent: 72.3,
  boundaryAgreementPercent: 93.8
};

// Generate realistic contiguous urban blocks
// Block 1 (North-West: Residential Plots)
// Coordinates in [lat, lng] format
const rawParcelsData = [
  // Block A - Residential Colony
  {
    id: 'P-1001',
    surveyNumber: 'Sy. No. 102/1',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 96.2,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Sector 4 Colony Main Road',
    assessedValueINR: 8450000,
    coords: [
      [17.44520, 78.37520],
      [17.44522, 78.37555],
      [17.44485, 78.37553],
      [17.44483, 78.37518]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 14/B, Plot 21',
      setbackDistanceM: 2.4,
      spatialSeparationScore: 0.94,
      explanation: 'Clear perimeter compound wall detected in ortho-elevation DTM with 2.4m front setback to colony road.'
    }
  },
  {
    id: 'P-1002',
    surveyNumber: 'Sy. No. 102/2',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 94.5,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Sector 4 Colony Main Road',
    assessedValueINR: 9200000,
    coords: [
      [17.44522, 78.37555],
      [17.44524, 78.37592],
      [17.44487, 78.37590],
      [17.44485, 78.37553]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 14/B, Plot 22',
      setbackDistanceM: 2.5,
      spatialSeparationScore: 0.92,
      explanation: 'Boundary inferred along existing hedge line and building footprint margin; 100% agreement with revenue records.'
    }
  },
  {
    id: 'P-1003',
    surveyNumber: 'Sy. No. 102/3',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 93.1,
    status: 'Preliminary' as const,
    buildingCount: 2,
    roadAccess: true,
    roadName: 'Sector 4 Colony Main Road',
    assessedValueINR: 11400000,
    coords: [
      [17.44524, 78.37592],
      [17.44526, 78.37635],
      [17.44489, 78.37632],
      [17.44487, 78.37590]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 14/B, Plot 23',
      setbackDistanceM: 2.8,
      spatialSeparationScore: 0.89,
      explanation: 'Main house and detached outhouse enclosed by unified peripheral boundary inferred from contrast gradient.'
    }
  },
  {
    id: 'P-1004',
    surveyNumber: 'Sy. No. 102/4',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 88.7,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Sector 4 Colony Main Road',
    assessedValueINR: 7900000,
    coords: [
      [17.44526, 78.37635],
      [17.44528, 78.37672],
      [17.44491, 78.37669],
      [17.44489, 78.37632]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 14/B, Plot 24',
      setbackDistanceM: 2.2,
      spatialSeparationScore: 0.87,
      explanation: 'Preliminary candidate; partial vegetation overhang on east boundary adjusted using elevation variance.'
    }
  },
  {
    id: 'P-1005',
    surveyNumber: 'Sy. No. 103/1',
    ward: 'Ward 14 - North Zone',
    landUse: 'Open/Green' as const,
    confidence: 97.4,
    status: 'Verified' as const,
    buildingCount: 0,
    roadAccess: true,
    roadName: 'Sector 4 Colony Main Road',
    assessedValueINR: 4200000,
    coords: [
      [17.44528, 78.37672],
      [17.44531, 78.37725],
      [17.44494, 78.37722],
      [17.44491, 78.37669]
    ],
    reasoning: {
      buildingFootprintDetected: false,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Municipal Layout Open Space Res-A',
      setbackDistanceM: 0.0,
      spatialSeparationScore: 0.98,
      explanation: 'Designated neighborhood park/green belt; fencing identified with high contrast RTK-aligned edges.'
    }
  },

  // Block B - Southern Row (Colony Lane 1)
  {
    id: 'P-1011',
    surveyNumber: 'Sy. No. 104/1',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 95.0,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Colony Lane 1',
    assessedValueINR: 8100000,
    coords: [
      [17.44458, 78.37520],
      [17.44460, 78.37556],
      [17.44422, 78.37554],
      [17.44420, 78.37518]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Colony Phase 2 - Plot 12',
      setbackDistanceM: 2.1,
      spatialSeparationScore: 0.95,
      explanation: 'Orthogonal corner plot aligned with Colony Lane 1 corridor centerline buffer.'
    }
  },
  {
    id: 'P-1012',
    surveyNumber: 'Sy. No. 104/2',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 92.8,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Colony Lane 1',
    assessedValueINR: 8300000,
    coords: [
      [17.44460, 78.37556],
      [17.44462, 78.37594],
      [17.44424, 78.37591],
      [17.44422, 78.37554]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Colony Phase 2 - Plot 13',
      setbackDistanceM: 2.0,
      spatialSeparationScore: 0.91,
      explanation: 'Continuous party-wall detection on lateral faces; frontage matches municipal road alignment.'
    }
  },
  {
    id: 'P-1013',
    surveyNumber: 'Sy. No. 104/3',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 91.9,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Colony Lane 1',
    assessedValueINR: 8600000,
    coords: [
      [17.44462, 78.37594],
      [17.44464, 78.37633],
      [17.44426, 78.37630],
      [17.44424, 78.37591]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Colony Phase 2 - Plot 14',
      setbackDistanceM: 2.3,
      spatialSeparationScore: 0.90,
      explanation: 'Front setback consistent with master plan; boundary verified against UAV nadir image contours.'
    }
  },
  {
    id: 'P-1014',
    surveyNumber: 'Sy. No. 104/4',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 89.4,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Colony Lane 1',
    assessedValueINR: 7800000,
    coords: [
      [17.44464, 78.37633],
      [17.44466, 78.37671],
      [17.44428, 78.37668],
      [17.44426, 78.37630]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Colony Phase 2 - Plot 15',
      setbackDistanceM: 2.0,
      spatialSeparationScore: 0.88,
      explanation: 'Candidate boundary generated using building centroid expansion and road edge constraint.'
    }
  },
  {
    // Topology Issue parcel: Sliver polygon / slight defect
    id: 'P-1015',
    surveyNumber: 'Sy. No. 104/5',
    ward: 'Ward 14 - North Zone',
    landUse: 'Residential' as const,
    confidence: 76.5,
    status: 'Needs Review' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Colony Lane 1',
    assessedValueINR: 6500000,
    coords: [
      [17.44466, 78.37671],
      [17.44468, 78.37705],
      [17.44467, 78.37707], // slight spur vertex
      [17.44430, 78.37704],
      [17.44428, 78.37668]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Colony Phase 2 - Plot 16',
      setbackDistanceM: 1.8,
      spatialSeparationScore: 0.74,
      explanation: 'Sliver spur detected at North-East boundary edge caused by tree canopy interference. Needs review.'
    }
  },

  // Central Commercial / Mixed Use Hub along Arterial Boulevard
  {
    id: 'P-1021',
    surveyNumber: 'Sy. No. 108/1A',
    ward: 'Ward 15 - Central Commercial',
    landUse: 'Commercial' as const,
    confidence: 96.8,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Avenue 4 Arterial Highway',
    assessedValueINR: 38500000,
    coords: [
      [17.44390, 78.37520],
      [17.44393, 78.37580],
      [17.44335, 78.37576],
      [17.44332, 78.37518]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Commercial Zoning Sector 4 - Lot C1',
      setbackDistanceM: 6.0,
      spatialSeparationScore: 0.97,
      explanation: 'Prominent commercial complex with dedicated parking apron; boundaries validated against municipal survey.'
    }
  },
  {
    id: 'P-1022',
    surveyNumber: 'Sy. No. 108/1B',
    ward: 'Ward 15 - Central Commercial',
    landUse: 'Mixed Use' as const,
    confidence: 93.7,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Avenue 4 Arterial Highway',
    assessedValueINR: 24000000,
    coords: [
      [17.44393, 78.37580],
      [17.44396, 78.37638],
      [17.44338, 78.37634],
      [17.44335, 78.37576]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Commercial Zoning Sector 4 - Lot C2',
      setbackDistanceM: 5.5,
      spatialSeparationScore: 0.94,
      explanation: 'Ground floor retail with upper residential flats. Clean geometry aligned with road right-of-way.'
    }
  },
  {
    id: 'P-1023',
    surveyNumber: 'Sy. No. 108/2',
    ward: 'Ward 15 - Central Commercial',
    landUse: 'Commercial' as const,
    confidence: 94.2,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Avenue 4 Arterial Highway',
    assessedValueINR: 31000000,
    coords: [
      [17.44396, 78.37638],
      [17.44400, 78.37702],
      [17.44342, 78.37698],
      [17.44338, 78.37634]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Commercial Zoning Sector 4 - Lot C3',
      setbackDistanceM: 5.2,
      spatialSeparationScore: 0.93,
      explanation: 'Corporate branch building; automated footprint detection isolated perimeter kerb line with 94.2% confidence.'
    }
  },
  {
    id: 'P-1024',
    surveyNumber: 'Sy. No. 109/1',
    ward: 'Ward 15 - Central Commercial',
    landUse: 'Public' as const,
    confidence: 97.8,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Avenue 4 Arterial Highway',
    assessedValueINR: 19500000,
    coords: [
      [17.44400, 78.37702],
      [17.44404, 78.37765],
      [17.44346, 78.37761],
      [17.44342, 78.37698]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Govt. Utility Sub-station & Civic Ward Office',
      setbackDistanceM: 4.8,
      spatialSeparationScore: 0.97,
      explanation: 'Civic facility bounded by masonry compound wall; zero topological conflicts found.'
    }
  },

  // East Sector - Irregular Historic Infill & Plots
  {
    id: 'P-1031',
    surveyNumber: 'Sy. No. 115/1',
    ward: 'Ward 16 - East Sector',
    landUse: 'Residential' as const,
    confidence: 91.0,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'East Link Road',
    assessedValueINR: 6700000,
    coords: [
      [17.44520, 78.37745],
      [17.44522, 78.37790],
      [17.44485, 78.37788],
      [17.44483, 78.37743]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 16, Sub-plot 4',
      setbackDistanceM: 2.1,
      spatialSeparationScore: 0.90,
      explanation: 'Residential duplex with rear garden. Boundary identified via stone fencing on orthophoto.'
    }
  },
  {
    id: 'P-1032',
    surveyNumber: 'Sy. No. 115/2',
    ward: 'Ward 16 - East Sector',
    landUse: 'Residential' as const,
    confidence: 90.3,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'East Link Road',
    assessedValueINR: 7100000,
    coords: [
      [17.44522, 78.37790],
      [17.44525, 78.37835],
      [17.44488, 78.37832],
      [17.44485, 78.37788]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 16, Sub-plot 5',
      setbackDistanceM: 2.0,
      spatialSeparationScore: 0.88,
      explanation: 'Preliminary parcel boundary inferred using Voronoi tessellation between adjacent detected building centroids.'
    }
  },
  {
    id: 'P-1033',
    surveyNumber: 'Sy. No. 115/3',
    ward: 'Ward 16 - East Sector',
    landUse: 'Mixed Use' as const,
    confidence: 88.5,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'East Link Road',
    assessedValueINR: 8900000,
    coords: [
      [17.44525, 78.37835],
      [17.44528, 78.37885],
      [17.44490, 78.37882],
      [17.44488, 78.37832]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 16, Sub-plot 6',
      setbackDistanceM: 2.5,
      spatialSeparationScore: 0.86,
      explanation: 'Mixed grocery shop with residence on first floor. Boundary aligns with road shoulder edge.'
    }
  },

  // Problematic / Overlapping pair for Topology validation demo:
  // P-1042 and P-1043 intentionally overlap slightly
  {
    id: 'P-1042',
    surveyNumber: 'Sy. No. 120/4A',
    ward: 'Ward 16 - East Sector',
    landUse: 'Residential' as const,
    confidence: 79.4,
    status: 'Needs Review' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Sector 4 East Byway',
    assessedValueINR: 6200000,
    coords: [
      [17.44458, 78.37745],
      [17.44461, 78.37795],
      [17.44423, 78.37793],
      [17.44420, 78.37743]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 16/D',
      setbackDistanceM: 1.5,
      spatialSeparationScore: 0.76,
      explanation: 'Overlaps by 4.2 m² with P-1043 along eastern parcel dividing line due to ambiguous compound wall shade.'
    }
  },
  {
    id: 'P-1043',
    surveyNumber: 'Sy. No. 120/4B',
    ward: 'Ward 16 - East Sector',
    landUse: 'Residential' as const,
    confidence: 78.9,
    status: 'Needs Review' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Sector 4 East Byway',
    assessedValueINR: 6400000,
    coords: [
      // Intentionally overlapping slightly with P-1042 (78.37792 vs 78.37795)
      [17.44460, 78.37792],
      [17.44463, 78.37842],
      [17.44425, 78.37840],
      [17.44422, 78.37790]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sheet 16/D',
      setbackDistanceM: 1.6,
      spatialSeparationScore: 0.75,
      explanation: 'Topological conflict: Overlap flagged with P-1042. Requires topological planar partition or surveyor verification.'
    }
  },

  // South Block - Industrial / Institutional & Large Parcels
  {
    id: 'P-1051',
    surveyNumber: 'Sy. No. 131/1',
    ward: 'Ward 17 - Industrial Belt',
    landUse: 'Industrial' as const,
    confidence: 95.7,
    status: 'Verified' as const,
    buildingCount: 2,
    roadAccess: true,
    roadName: 'Industrial Access Spine',
    assessedValueINR: 52000000,
    coords: [
      [17.44290, 78.37520],
      [17.44294, 78.37610],
      [17.44220, 78.37605],
      [17.44216, 78.37518]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'IDC Industrial Estate Plot 7',
      setbackDistanceM: 7.5,
      spatialSeparationScore: 0.96,
      explanation: 'Manufacturing warehouse with large tarmac yard. Perimeter security fence extracted with 95.7% confidence.'
    }
  },
  {
    id: 'P-1052',
    surveyNumber: 'Sy. No. 131/2',
    ward: 'Ward 17 - Industrial Belt',
    landUse: 'Industrial' as const,
    confidence: 93.2,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Industrial Access Spine',
    assessedValueINR: 44000000,
    coords: [
      [17.44294, 78.37610],
      [17.44298, 78.37700],
      [17.44224, 78.37695],
      [17.44220, 78.37605]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'IDC Industrial Estate Plot 8',
      setbackDistanceM: 8.0,
      spatialSeparationScore: 0.93,
      explanation: 'Logistics transfer depot; boundary conforms to road curb and neighboring industrial fence.'
    }
  },
  {
    id: 'P-1053',
    surveyNumber: 'Sy. No. 132/1',
    ward: 'Ward 17 - Industrial Belt',
    landUse: 'Public' as const,
    confidence: 96.1,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Industrial Access Spine',
    assessedValueINR: 28000000,
    coords: [
      [17.44298, 78.37700],
      [17.44302, 78.37790],
      [17.44228, 78.37785],
      [17.44224, 78.37695]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Water Treatment & Booster Pumping Station',
      setbackDistanceM: 6.2,
      spatialSeparationScore: 0.95,
      explanation: 'Municipal public infrastructure compound. Government demarcated boundary verified.'
    }
  },

  // Topology Issue: P-1056 Unclosed Boundary (resolved during topology repair)
  {
    id: 'P-1056',
    surveyNumber: 'Sy. No. 133/3',
    ward: 'Ward 17 - Industrial Belt',
    landUse: 'Open/Green' as const,
    confidence: 81.3,
    status: 'Needs Review' as const,
    buildingCount: 0,
    roadAccess: true,
    roadName: 'Industrial Access Spine',
    assessedValueINR: 9500000,
    coords: [
      [17.44302, 78.37790],
      [17.44305, 78.37860],
      [17.44232, 78.37855],
      [17.44229, 78.37786]
    ],
    reasoning: {
      buildingFootprintDetected: false,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Industrial Buffer Green Strip',
      setbackDistanceM: 0.0,
      spatialSeparationScore: 0.81,
      explanation: 'Boundary geometry was flagged for unclosed vertex tolerance. Resolved by snap-to-neighbor closure.'
    }
  },

  // Additional realistic residential & mixed parcels
  {
    id: 'P-1061',
    surveyNumber: 'Sy. No. 140/1',
    ward: 'Ward 18 - South Residential',
    landUse: 'Residential' as const,
    confidence: 95.4,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'South Colony Road 2',
    assessedValueINR: 8800000,
    coords: [
      [17.44180, 78.37520],
      [17.44182, 78.37560],
      [17.44140, 78.37558],
      [17.44138, 78.37518]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'South Extension Block A-1',
      setbackDistanceM: 2.2,
      spatialSeparationScore: 0.95,
      explanation: 'Clear compound perimeter wall extracted from elevation edge model.'
    }
  },
  {
    id: 'P-1062',
    surveyNumber: 'Sy. No. 140/2',
    ward: 'Ward 18 - South Residential',
    landUse: 'Residential' as const,
    confidence: 93.6,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'South Colony Road 2',
    assessedValueINR: 8500000,
    coords: [
      [17.44182, 78.37560],
      [17.44184, 78.37600],
      [17.44142, 78.37598],
      [17.44140, 78.37558]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'South Extension Block A-2',
      setbackDistanceM: 2.4,
      spatialSeparationScore: 0.92,
      explanation: 'Cadastral candidate generated from building perimeter offset and neighboring boundary snap.'
    }
  },
  {
    id: 'P-1063',
    surveyNumber: 'Sy. No. 140/3',
    ward: 'Ward 18 - South Residential',
    landUse: 'Residential' as const,
    confidence: 92.0,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'South Colony Road 2',
    assessedValueINR: 8900000,
    coords: [
      [17.44184, 78.37600],
      [17.44186, 78.37645],
      [17.44144, 78.37642],
      [17.44142, 78.37598]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'South Extension Block A-3',
      setbackDistanceM: 2.1,
      spatialSeparationScore: 0.90,
      explanation: 'Preliminary parcel geometry with regular rectangular aspect ratio matching colony master plan.'
    }
  },
  {
    id: 'P-1064',
    surveyNumber: 'Sy. No. 140/4',
    ward: 'Ward 18 - South Residential',
    landUse: 'Open/Green' as const,
    confidence: 96.5,
    status: 'Verified' as const,
    buildingCount: 0,
    roadAccess: true,
    roadName: 'South Colony Road 2',
    assessedValueINR: 3500000,
    coords: [
      [17.44186, 78.37645],
      [17.44189, 78.37700],
      [17.44147, 78.37697],
      [17.44144, 78.37642]
    ],
    reasoning: {
      buildingFootprintDetected: false,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Community Garden & Children Play Area',
      setbackDistanceM: 0.0,
      spatialSeparationScore: 0.97,
      explanation: 'Public open recreational parcel clearly demarcated by concrete curb stones.'
    }
  },

  // Discrepancy & Gap Parcels for Topology
  {
    id: 'P-1071',
    surveyNumber: 'Sy. No. 145/1',
    ward: 'Ward 18 - South Residential',
    landUse: 'Residential' as const,
    confidence: 84.6,
    status: 'Needs Review' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'East Link Road',
    assessedValueINR: 7600000,
    coords: [
      [17.44420, 78.37845],
      [17.44422, 78.37885],
      [17.44380, 78.37883],
      [17.44378, 78.37843]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sy 145 Sub-1',
      setbackDistanceM: 1.9,
      spatialSeparationScore: 0.84,
      explanation: 'Duplicate boundary segment detected with neighbor plot P-1072. Flagged for edge simplification.'
    }
  },
  {
    id: 'P-1072',
    surveyNumber: 'Sy. No. 145/2',
    ward: 'Ward 18 - South Residential',
    landUse: 'Residential' as const,
    confidence: 86.2,
    status: 'Preliminary' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'East Link Road',
    assessedValueINR: 7900000,
    coords: [
      [17.44422, 78.37885],
      [17.44424, 78.37925],
      [17.44382, 78.37922],
      [17.44380, 78.37883]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Revenue Sy 145 Sub-2',
      setbackDistanceM: 2.0,
      spatialSeparationScore: 0.85,
      explanation: 'Single family home with clear boundary lines on three sides.'
    }
  },

  // Historic irregular parcels with GNSS ground truth benchmarks
  {
    id: 'P-1081',
    surveyNumber: 'Sy. No. 150/1',
    ward: 'Ward 19 - Heritage & Gaothan Area',
    landUse: 'Mixed Use' as const,
    confidence: 89.1,
    status: 'Flagged for Field Survey' as const,
    buildingCount: 2,
    roadAccess: true,
    roadName: 'Old Village Core Lane',
    assessedValueINR: 9800000,
    coords: [
      [17.44330, 78.37770],
      [17.44332, 78.37820],
      [17.44295, 78.37817],
      [17.44292, 78.37768]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: false,
      existingCadastralRef: 'Gaothan Abadi Section 3',
      setbackDistanceM: 0.8,
      spatialSeparationScore: 0.79,
      explanation: 'Dense historic settlement with irregular building shared walls and zero setback. Field survey flagged.'
    }
  },
  {
    id: 'P-1082',
    surveyNumber: 'Sy. No. 150/2',
    ward: 'Ward 19 - Heritage & Gaothan Area',
    landUse: 'Residential' as const,
    confidence: 87.5,
    status: 'Flagged for Field Survey' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'Old Village Core Lane',
    assessedValueINR: 7200000,
    coords: [
      [17.44332, 78.37820],
      [17.44335, 78.37870],
      [17.44298, 78.37867],
      [17.44295, 78.37817]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: false,
      existingCadastralRef: 'Gaothan Abadi Section 4',
      setbackDistanceM: 0.5,
      spatialSeparationScore: 0.77,
      explanation: 'Overhanging corrugated roof edges obscure true boundary wall. Ground truth GNSS station GT-103 required.'
    }
  },

  // Gap between P-1104 and P-1105 for topology validation
  {
    id: 'P-1104',
    surveyNumber: 'Sy. No. 162/1',
    ward: 'Ward 20 - North-East Sector',
    landUse: 'Residential' as const,
    confidence: 85.0,
    status: 'Needs Review' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'North Peripheral Drive',
    assessedValueINR: 8100000,
    coords: [
      [17.44570, 78.37520],
      [17.44572, 78.37565],
      [17.44535, 78.37563],
      [17.44533, 78.37518]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'North Perimeter Plot 1',
      setbackDistanceM: 2.0,
      spatialSeparationScore: 0.85,
      explanation: 'Gap of 1.2m detected between P-1104 and P-1105 where no public passage is recorded in village map.'
    }
  },
  {
    id: 'P-1105',
    surveyNumber: 'Sy. No. 162/2',
    ward: 'Ward 20 - North-East Sector',
    landUse: 'Residential' as const,
    confidence: 84.8,
    status: 'Needs Review' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'North Peripheral Drive',
    assessedValueINR: 8200000,
    coords: [
      // Intentionally leaving a small sliver gap (78.37568 instead of 78.37565)
      [17.44573, 78.37568],
      [17.44575, 78.37615],
      [17.44538, 78.37612],
      [17.44535, 78.37566]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'North Perimeter Plot 2',
      setbackDistanceM: 2.0,
      spatialSeparationScore: 0.84,
      explanation: 'Cadastral gap issue detected. AI proposes edge-snapping closure algorithm to merge boundary.'
    }
  },
  {
    id: 'P-1106',
    surveyNumber: 'Sy. No. 162/3',
    ward: 'Ward 20 - North-East Sector',
    landUse: 'Residential' as const,
    confidence: 94.0,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'North Peripheral Drive',
    assessedValueINR: 9100000,
    coords: [
      [17.44575, 78.37615],
      [17.44578, 78.37670],
      [17.44540, 78.37667],
      [17.44538, 78.37612]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'North Perimeter Plot 3',
      setbackDistanceM: 2.2,
      spatialSeparationScore: 0.93,
      explanation: 'Verified residential plot with well-defined masonry boundary.'
    }
  },
  {
    id: 'P-1107',
    surveyNumber: 'Sy. No. 162/4',
    ward: 'Ward 20 - North-East Sector',
    landUse: 'Public' as const,
    confidence: 95.8,
    status: 'Verified' as const,
    buildingCount: 1,
    roadAccess: true,
    roadName: 'North Peripheral Drive',
    assessedValueINR: 14500000,
    coords: [
      [17.44578, 78.37670],
      [17.44582, 78.37730],
      [17.44544, 78.37727],
      [17.44540, 78.37667]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Primary Health Center Annex',
      setbackDistanceM: 3.5,
      spatialSeparationScore: 0.96,
      explanation: 'Community health dispensary with perimeter fence aligned with north peripheral right-of-way.'
    }
  },
  {
    id: 'P-1088',
    surveyNumber: 'Sy. No. 168/1',
    ward: 'Ward 20 - North-East Sector',
    landUse: 'Commercial' as const,
    confidence: 91.2,
    status: 'Verified' as const, // Was self-intersecting, now resolved in prototype
    buildingCount: 1,
    roadAccess: true,
    roadName: 'North Peripheral Drive',
    assessedValueINR: 22000000,
    coords: [
      [17.44582, 78.37730],
      [17.44585, 78.37790],
      [17.44547, 78.37787],
      [17.44544, 78.37727]
    ],
    reasoning: {
      buildingFootprintDetected: true,
      roadBoundaryAligned: true,
      existingCadastralRef: 'Retail Bank Branch & ATM Complex',
      setbackDistanceM: 4.0,
      spatialSeparationScore: 0.92,
      explanation: 'Self-intersection knot resolved via planar polygon repair. Conforms to cadastral standard.'
    }
  }
];

// Compute area, perimeter, and centroid using Turf for each parcel
export const INITIAL_PARCELS: ParcelFeature[] = rawParcelsData.map((p) => {
  const coordinates = p.coords as [number, number][];
  const areaSqM = calculatePolygonArea(coordinates);
  const perimeterM = calculatePolygonPerimeter(coordinates);
  const centroid = calculateCentroid(coordinates);

  return {
    id: p.id,
    surveyNumber: p.surveyNumber,
    ward: p.ward,
    areaSqM,
    perimeterM,
    landUse: p.landUse,
    confidence: p.confidence,
    status: p.status,
    buildingCount: p.buildingCount,
    roadAccess: p.roadAccess,
    roadName: p.roadName,
    assessedValueINR: p.assessedValueINR,
    coordinates,
    centroid,
    generationReasoning: p.reasoning,
    groundTruthDiscrepancyM: p.confidence > 93 ? 0.08 : p.confidence > 88 ? 0.22 : 0.65
  };
});

// Buildings footprints accurately placed inside parcel boundaries
export const INITIAL_BUILDINGS: BuildingFeature[] = [
  {
    id: 'BLD-1001',
    parcelId: 'P-1001',
    floors: 2,
    heightM: 7.2,
    areaSqM: 92.4,
    confidence: 96.5,
    type: 'RCC Framed Residential',
    coordinates: [
      [17.44512, 78.37526],
      [17.44513, 78.37548],
      [17.44492, 78.37547],
      [17.44491, 78.37525]
    ]
  },
  {
    id: 'BLD-1002',
    parcelId: 'P-1002',
    floors: 3,
    heightM: 10.4,
    areaSqM: 108.6,
    confidence: 95.8,
    type: 'G+2 Residential Villa',
    coordinates: [
      [17.44514, 78.37562],
      [17.44515, 78.37585],
      [17.44494, 78.37583],
      [17.44493, 78.37560]
    ]
  },
  {
    id: 'BLD-1003A',
    parcelId: 'P-1003',
    floors: 2,
    heightM: 7.5,
    areaSqM: 115.0,
    confidence: 94.0,
    type: 'Individual Bungalow',
    coordinates: [
      [17.44516, 78.37600],
      [17.44517, 78.37625],
      [17.44498, 78.37624],
      [17.44497, 78.37598]
    ]
  },
  {
    id: 'BLD-1004',
    parcelId: 'P-1004',
    floors: 2,
    heightM: 7.0,
    areaSqM: 98.2,
    confidence: 92.4,
    type: 'Residential Dwelling',
    coordinates: [
      [17.44518, 78.37642],
      [17.44520, 78.37665],
      [17.44499, 78.37663],
      [17.44498, 78.37640]
    ]
  },
  {
    id: 'BLD-1011',
    parcelId: 'P-1011',
    floors: 2,
    heightM: 6.8,
    areaSqM: 88.0,
    confidence: 96.1,
    type: 'RCC House',
    coordinates: [
      [17.44450, 78.37526],
      [17.44451, 78.37548],
      [17.44430, 78.37547],
      [17.44429, 78.37525]
    ]
  },
  {
    id: 'BLD-1012',
    parcelId: 'P-1012',
    floors: 2,
    heightM: 7.0,
    areaSqM: 95.3,
    confidence: 93.7,
    type: 'RCC House',
    coordinates: [
      [17.44452, 78.37563],
      [17.44453, 78.37586],
      [17.44432, 78.37584],
      [17.44431, 78.37561]
    ]
  },
  {
    id: 'BLD-1021',
    parcelId: 'P-1021',
    floors: 5,
    heightM: 18.2,
    areaSqM: 260.4,
    confidence: 98.2,
    type: 'Multi-Storey Commercial Center',
    coordinates: [
      [17.44382, 78.37530],
      [17.44384, 78.37572],
      [17.44344, 78.37570],
      [17.44342, 78.37528]
    ]
  },
  {
    id: 'BLD-1022',
    parcelId: 'P-1022',
    floors: 4,
    heightM: 14.5,
    areaSqM: 225.8,
    confidence: 96.0,
    type: 'Commercial Mixed Complex',
    coordinates: [
      [17.44385, 78.37590],
      [17.44387, 78.37628],
      [17.44347, 78.37626],
      [17.44345, 78.37588]
    ]
  },
  {
    id: 'BLD-1023',
    parcelId: 'P-1023',
    floors: 4,
    heightM: 15.0,
    areaSqM: 245.0,
    confidence: 95.5,
    type: 'Corporate Branch Building',
    coordinates: [
      [17.44388, 78.37650],
      [17.44391, 78.37692],
      [17.44351, 78.37690],
      [17.44349, 78.37648]
    ]
  },
  {
    id: 'BLD-1024',
    parcelId: 'P-1024',
    floors: 3,
    heightM: 11.0,
    areaSqM: 210.0,
    confidence: 97.9,
    type: 'Municipal Ward Civic Office',
    coordinates: [
      [17.44392, 78.37715],
      [17.44395, 78.37755],
      [17.44355, 78.37752],
      [17.44352, 78.37712]
    ]
  },
  {
    id: 'BLD-1051',
    parcelId: 'P-1051',
    floors: 2,
    heightM: 9.8,
    areaSqM: 420.5,
    confidence: 97.1,
    type: 'Industrial Production Shed',
    coordinates: [
      [17.44280, 78.37532],
      [17.44283, 78.37598],
      [17.44230, 78.37594],
      [17.44227, 78.37530]
    ]
  },
  {
    id: 'BLD-1052',
    parcelId: 'P-1052',
    floors: 1,
    heightM: 8.5,
    areaSqM: 380.0,
    confidence: 96.3,
    type: 'Logistics Distribution Hub',
    coordinates: [
      [17.44284, 78.37622],
      [17.44287, 78.37688],
      [17.44234, 78.37684],
      [17.44231, 78.37620]
    ]
  }
];

// Roads network extracted from orthophoto
export const INITIAL_ROADS: RoadFeature[] = [
  {
    id: 'RD-01',
    name: 'Sector 4 Colony Main Road',
    widthM: 12.0,
    surface: 'Asphalt',
    confidence: 96.5,
    coordinates: [
      [17.44470, 78.37500],
      [17.44472, 78.37600],
      [17.44474, 78.37730],
      [17.44476, 78.37850],
      [17.44478, 78.37950]
    ]
  },
  {
    id: 'RD-02',
    name: 'Avenue 4 Arterial Highway',
    widthM: 24.0,
    surface: 'Concrete',
    confidence: 98.2,
    coordinates: [
      [17.44405, 78.37500],
      [17.44408, 78.37620],
      [17.44410, 78.37740],
      [17.44412, 78.37860],
      [17.44414, 78.37960]
    ]
  },
  {
    id: 'RD-03',
    name: 'Industrial Access Spine',
    widthM: 15.0,
    surface: 'Asphalt',
    confidence: 95.0,
    coordinates: [
      [17.44310, 78.37500],
      [17.44312, 78.37630],
      [17.44314, 78.37750],
      [17.44316, 78.37870]
    ]
  },
  {
    id: 'RD-04',
    name: 'North Peripheral Drive',
    widthM: 10.0,
    surface: 'Asphalt',
    confidence: 93.8,
    coordinates: [
      [17.44588, 78.37500],
      [17.44590, 78.37640],
      [17.44593, 78.37780],
      [17.44595, 78.37920]
    ]
  },
  {
    id: 'RD-05',
    name: 'Cross Sector Lane 1 (North-South)',
    widthM: 7.5,
    surface: 'Paved Lane',
    confidence: 91.4,
    coordinates: [
      [17.44600, 78.37735],
      [17.44470, 78.37732],
      [17.44405, 78.37730],
      [17.44210, 78.37728]
    ]
  }
];

// Topology Issues detected via Turf geometry validation
export const INITIAL_TOPOLOGY_ISSUES: TopologyIssue[] = [
  {
    id: 'T-001',
    parcelId: 'P-1042',
    secondaryParcelId: 'P-1043',
    type: 'Overlap',
    severity: 'High',
    status: 'Needs Review',
    description: 'Polygons P-1042 and P-1043 overlap by 4.2 m² along boundary between longitudes 78.37790 and 78.37795.',
    coordinates: [17.44440, 78.37793],
    affectedAreaSqM: 4.2
  },
  {
    id: 'T-002',
    parcelId: 'P-1088',
    type: 'Self Intersection',
    severity: 'High',
    status: 'Resolved',
    description: 'Self-intersection polygon bow-tie corrected via automatic planar vertex untangling.',
    coordinates: [17.44565, 78.37758],
    affectedAreaSqM: 1.1
  },
  {
    id: 'T-003',
    parcelId: 'P-1104',
    secondaryParcelId: 'P-1105',
    type: 'Gap',
    severity: 'Medium',
    status: 'Needs Review',
    description: 'Unaccounted cadastral sliver gap (1.2m width, ~8.4 m²) between legal plots with no municipal easement record.',
    coordinates: [17.44554, 78.37566],
    affectedAreaSqM: 8.4
  },
  {
    id: 'T-004',
    parcelId: 'P-1015',
    type: 'Sliver Polygon',
    severity: 'Low',
    status: 'Needs Review',
    description: 'Extraneous sharp vertex spur detected along rear boundary caused by tree shadow canopy.',
    coordinates: [17.44467, 78.37707],
    affectedAreaSqM: 0.9
  },
  {
    id: 'T-005',
    parcelId: 'P-1056',
    type: 'Unclosed Boundary',
    severity: 'High',
    status: 'Needs Review',
    description: 'Endpoint vertex distance 0.28m exceeded tolerance of 0.05m before closure snapping.',
    coordinates: [17.44229, 78.37786],
    affectedAreaSqM: 2.3
  },
  {
    id: 'T-006',
    parcelId: 'P-1021',
    type: 'Duplicate Boundary',
    severity: 'Low',
    status: 'Needs Review',
    description: 'Collinear segment shares exact road right-of-way vertex without assigned attribute parity.',
    coordinates: [17.44390, 78.37520],
    affectedAreaSqM: 0.0
  },
  {
    id: 'T-007',
    parcelId: 'P-1071',
    secondaryParcelId: 'P-1072',
    type: 'Duplicate Boundary',
    severity: 'Low',
    status: 'Resolved',
    description: 'Shared party boundary synchronized and aligned to 0.02m precision.',
    coordinates: [17.44401, 78.37884],
    affectedAreaSqM: 0.0
  }
];

// Ground Truth Survey benchmarks (GNSS RTK field points)
export const INITIAL_GROUND_TRUTH_POINTS: GroundTruthPoint[] = [
  {
    id: 'GT-101',
    stationName: 'CP-101 (Sector 4 Benchmark)',
    equipment: 'Trimble R12 GNSS RTK',
    latitude: 17.44520,
    longitude: 78.37520,
    elevationM: 542.18,
    accuracyCm: 0.8,
    associatedParcelId: 'P-1001',
    surveyDate: '2026-03-20',
    surveyor: 'Er. R. Sharma (Surveyor General Dep.)',
    status: 'Verified'
  },
  {
    id: 'GT-102',
    stationName: 'CP-102 (Colony Central Pillar)',
    equipment: 'Trimble R12 GNSS RTK',
    latitude: 17.44472,
    longitude: 78.37600,
    elevationM: 541.65,
    accuracyCm: 1.1,
    associatedParcelId: 'P-1003',
    surveyDate: '2026-03-20',
    surveyor: 'Er. R. Sharma (Surveyor General Dep.)',
    status: 'Verified'
  },
  {
    id: 'GT-103',
    stationName: 'CP-103 (Gaothan Boundary Station)',
    equipment: 'Leica GS18 T',
    latitude: 17.44332,
    longitude: 78.37820,
    elevationM: 539.42,
    accuracyCm: 1.4,
    associatedParcelId: 'P-1081',
    surveyDate: '2026-03-21',
    surveyor: 'M. K. Varma (State Cadastral Cell)',
    status: 'Pending'
  },
  {
    id: 'GT-104',
    stationName: 'CP-104 (Highway Curb Reference)',
    equipment: 'Total Station TS16',
    latitude: 17.44408,
    longitude: 78.37620,
    elevationM: 540.10,
    accuracyCm: 0.5,
    associatedParcelId: 'P-1022',
    surveyDate: '2026-03-22',
    surveyor: 'S. Namboodiri (Municipal Survey Unit)',
    status: 'Verified'
  },
  {
    id: 'GT-105',
    stationName: 'CP-105 (Industrial Boundary Marker)',
    equipment: 'Trimble R12 GNSS RTK',
    latitude: 17.44294,
    longitude: 78.37610,
    elevationM: 537.89,
    accuracyCm: 0.9,
    associatedParcelId: 'P-1051',
    surveyDate: '2026-03-22',
    surveyor: 'S. Namboodiri (Municipal Survey Unit)',
    status: 'Verified'
  }
];
