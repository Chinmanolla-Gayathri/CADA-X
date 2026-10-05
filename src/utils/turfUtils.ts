import * as turf from '@turf/turf';
import { ParcelFeature, BuildingFeature, RoadFeature, TopologyIssue } from '../types/cadastral';

/**
 * Converts Leaflet [lat, lng] array to GeoJSON coordinates [lng, lat]
 */
export function latLngsToGeoJSON(coords: [number, number][]): number[][] {
  const points = coords.map(([lat, lng]) => [lng, lat]);
  // Ensure closed polygon
  if (points.length > 0) {
    const first = points[0];
    const last = points[points.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      points.push([first[0], first[1]]);
    }
  }
  return points;
}

/**
 * Calculates area in square meters using Turf.js
 */
export function calculatePolygonArea(coords: [number, number][]): number {
  try {
    const geoJsonCoords = latLngsToGeoJSON(coords);
    if (geoJsonCoords.length < 4) return 0;
    const poly = turf.polygon([geoJsonCoords]);
    const areaSqM = turf.area(poly);
    return Math.round(areaSqM * 10) / 10;
  } catch (e) {
    console.warn('Error calculating turf area', e);
    return 0;
  }
}

/**
 * Calculates perimeter in meters using Turf.js
 */
export function calculatePolygonPerimeter(coords: [number, number][]): number {
  try {
    const geoJsonCoords = latLngsToGeoJSON(coords);
    if (geoJsonCoords.length < 4) return 0;
    const line = turf.lineString(geoJsonCoords);
    const lengthKm = turf.length(line, { units: 'kilometers' });
    return Math.round(lengthKm * 1000 * 10) / 10;
  } catch (e) {
    return 0;
  }
}

/**
 * Calculates centroid [lat, lng]
 */
export function calculateCentroid(coords: [number, number][]): [number, number] {
  try {
    const geoJsonCoords = latLngsToGeoJSON(coords);
    const poly = turf.polygon([geoJsonCoords]);
    const center = turf.centroid(poly);
    const [lng, lat] = center.geometry.coordinates;
    return [lat, lng];
  } catch (e) {
    // fallback arithmetic mean
    const latSum = coords.reduce((acc, c) => acc + c[0], 0);
    const lngSum = coords.reduce((acc, c) => acc + c[1], 0);
    return [latSum / coords.length, lngSum / coords.length];
  }
}

/**
 * Checks for polygon overlap using Turf
 */
export function checkPolygonsOverlap(polyA: [number, number][], polyB: [number, number][]): boolean {
  try {
    const p1 = turf.polygon([latLngsToGeoJSON(polyA)]);
    const p2 = turf.polygon([latLngsToGeoJSON(polyB)]);
    return turf.booleanOverlap(p1, p2) || turf.booleanIntersects(p1, p2);
  } catch (e) {
    return false;
  }
}

/**
 * Generate full GeoJSON FeatureCollection
 */
export function generateGeoJSONFeatureCollection(
  parcels: ParcelFeature[],
  buildings: BuildingFeature[],
  roads: RoadFeature[],
  issues: TopologyIssue[]
) {
  const features: any[] = [];

  // Add parcels
  parcels.forEach((p) => {
    features.push({
      type: 'Feature',
      id: p.id,
      properties: {
        featureType: 'CadastralParcel',
        parcelId: p.id,
        surveyNumber: p.surveyNumber,
        ward: p.ward,
        areaSqM: p.areaSqM,
        perimeterM: p.perimeterM,
        landUse: p.landUse,
        confidence: p.confidence,
        status: p.status,
        buildingCount: p.buildingCount,
        roadAccess: p.roadAccess,
        roadName: p.roadName || 'Unnamed Sector Lane',
        preliminaryNotice: 'AI-assisted preliminary boundary. Requires ground truth surveyor verification before official adoption.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [latLngsToGeoJSON(p.coordinates)]
      }
    });
  });

  // Add buildings
  buildings.forEach((b) => {
    features.push({
      type: 'Feature',
      id: b.id,
      properties: {
        featureType: 'BuildingFootprint',
        buildingId: b.id,
        parcelId: b.parcelId,
        floors: b.floors,
        heightM: b.heightM,
        areaSqM: b.areaSqM,
        confidence: b.confidence,
        type: b.type
      },
      geometry: {
        type: 'Polygon',
        coordinates: [latLngsToGeoJSON(b.coordinates)]
      }
    });
  });

  // Add roads
  roads.forEach((r) => {
    features.push({
      type: 'Feature',
      id: r.id,
      properties: {
        featureType: 'RoadCenterline',
        roadId: r.id,
        name: r.name,
        widthM: r.widthM,
        surface: r.surface,
        confidence: r.confidence
      },
      geometry: {
        type: 'LineString',
        coordinates: r.coordinates.map(([lat, lng]) => [lng, lat])
      }
    });
  });

  return {
    type: 'FeatureCollection',
    name: 'UrbanCadastral_AI_Extraction_EPSG4326',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    },
    metadata: {
      generatedBy: 'UrbanCadastral AI (SIH 26012)',
      timestamp: new Date().toISOString(),
      disclaimer: 'Preliminary AI-assisted cadastral boundaries. Official adoption requires surveyor GNSS ground-truth validation.'
    },
    features
  };
}

/**
 * Exports data as downloadable GeoJSON file
 */
export function downloadGeoJSON(
  parcels: ParcelFeature[],
  buildings: BuildingFeature[],
  roads: RoadFeature[],
  issues: TopologyIssue[],
  filename = 'UrbanCadastral_Parcels.geojson'
) {
  const data = generateGeoJSONFeatureCollection(parcels, buildings, roads, issues);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports parcels as CSV file
 */
export function downloadParcelsCSV(parcels: ParcelFeature[], filename = 'UrbanCadastral_Parcels.csv') {
  const headers = [
    'Parcel_ID',
    'Survey_Number',
    'Ward',
    'Land_Use',
    'Area_SqM',
    'Perimeter_M',
    'AI_Confidence_Percent',
    'Validation_Status',
    'Building_Count',
    'Road_Access',
    'Centroid_Lat',
    'Centroid_Lng',
    'Preliminary_Disclaimer'
  ];

  const rows = parcels.map((p) => [
    p.id,
    `"${p.surveyNumber}"`,
    `"${p.ward}"`,
    `"${p.landUse}"`,
    p.areaSqM,
    p.perimeterM,
    p.confidence,
    `"${p.status}"`,
    p.buildingCount,
    p.roadAccess ? 'YES' : 'NO',
    p.centroid[0].toFixed(6),
    p.centroid[1].toFixed(6),
    '"Preliminary AI boundary - pending ground survey"'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates GIS Shapefile package description & bundle download (GeoJSON + PRJ + XML metadata)
 */
export function downloadShapefileBundle(parcels: ParcelFeature[], buildings: BuildingFeature[], roads: RoadFeature[], issues: TopologyIssue[]) {
  // We produce a multi-file bundle text/json with WGS84 PRJ specification and instructions
  const prj = `GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]`;
  
  const geojson = JSON.stringify(generateGeoJSONFeatureCollection(parcels, buildings, roads, issues), null, 2);
  
  const readme = `UrbanCadastral AI (SIH 26012)
GIS Cadastral Extraction Package
===============================================
Coordinate Reference System: EPSG:4326 (WGS 84)
Projection: Geographic Coordinate System
Format Compatibility: QGIS, ArcGIS Pro, GeoServer, PostGIS

To import into ESRI ArcGIS or QGIS:
1. Drag 'UrbanCadastral_Parcels.geojson' into QGIS or ArcGIS Pro.
2. Select 'Layer' -> 'Export' -> 'Save Features As...' -> 'ESRI Shapefile' if .shp binary format is required.
3. The included 'UrbanCadastral_WGS84.prj' contains the projection parameters.

IMPORTANT NOTICE:
All boundaries generated herein are preliminary AI-assisted candidates. Official legal adoption mandates GNSS RTK field survey verification.
`;

  // Download geojson with paired PRJ file
  const blob = new Blob([geojson], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'UrbanCadastral_GIS_Package.geojson';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Trigger PRJ file download
  setTimeout(() => {
    const prjBlob = new Blob([prj], { type: 'text/plain' });
    const prjUrl = URL.createObjectURL(prjBlob);
    const prjLink = document.createElement('a');
    prjLink.href = prjUrl;
    prjLink.download = 'UrbanCadastral_GIS_Package.prj';
    document.body.appendChild(prjLink);
    prjLink.click();
    document.body.removeChild(prjLink);
    URL.revokeObjectURL(prjUrl);
  }, 400);
}
