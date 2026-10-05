import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Search, 
  Maximize2, 
  ChevronDown, 
  ChevronUp, 
  Crosshair, 
  ShieldAlert, 
  SlidersHorizontal, 
  Check, 
  AlertTriangle, 
  Ruler, 
  Hand, 
  MousePointer, 
  Info, 
  CheckCircle2, 
  X,
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useCadastral } from '../../context/CadastralContext';
import { ParcelFeature, LandUseType } from '../../types/cadastral';
import { MAP_CENTER, DEFAULT_ZOOM } from '../../data/syntheticUrbanData';

// Professional GIS color styling (light theme)
const LAND_USE_COLORS: Record<LandUseType, { fill: string; stroke: string }> = {
  Residential: { fill: '#0f766e', stroke: '#0d9488' },
  Commercial: { fill: '#d97706', stroke: '#b45309' },
  'Mixed Use': { fill: '#0284c7', stroke: '#0369a1' },
  Industrial: { fill: '#7c3aed', stroke: '#6d28d9' },
  Public: { fill: '#2563eb', stroke: '#1d4ed8' },
  'Open/Green': { fill: '#65a30d', stroke: '#4d7c0f' }
};

export const ParcelMapView: React.FC = () => {
  const { 
    parcels, 
    buildings, 
    roads, 
    topologyIssues, 
    groundTruthPoints, 
    selectedParcel, 
    setSelectedParcel,
    visibleLayers,
    toggleLayer,
    updateParcelStatus,
    showToast
  } = useCadastral();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const layersRef = useRef<{
    basemapLayer?: L.TileLayer;
    parcelLayerGroup?: L.LayerGroup;
    buildingLayerGroup?: L.LayerGroup;
    roadLayerGroup?: L.LayerGroup;
    gtLayerGroup?: L.LayerGroup;
    issueLayerGroup?: L.LayerGroup;
  }>({});

  // Toolbar & Inspector state
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'measure'>('select');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGeometryDetails, setShowGeometryDetails] = useState(false);
  const [showExplainDrawer, setShowExplainDrawer] = useState(true);

  // Basemap options: 'carto_dark' | 'osm' | 'satellite'
  const [basemapChoice, setBasemapChoice] = useState<'carto_dark' | 'osm' | 'satellite'>('satellite');
  const [cartoNotice, setCartoNotice] = useState<string | null>(null);

  // Measurement tool state
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measureDistanceM, setMeasureDistanceM] = useState<number | null>(null);
  const measureLineRef = useRef<L.Polyline | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MAP_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    layersRef.current.parcelLayerGroup = L.layerGroup().addTo(map);
    layersRef.current.buildingLayerGroup = L.layerGroup().addTo(map);
    layersRef.current.roadLayerGroup = L.layerGroup().addTo(map);
    layersRef.current.gtLayerGroup = L.layerGroup().addTo(map);
    layersRef.current.issueLayerGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap & CARTO Dark API key handling (Section 28)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (layersRef.current.basemapLayer) {
      map.removeLayer(layersRef.current.basemapLayer);
    }

    const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
    let newTileLayer: L.TileLayer;

    if (basemapChoice === 'carto_dark') {
      if (cartoApiKey && cartoApiKey.trim().length > 0) {
        newTileLayer = L.tileLayer(
          `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`,
          {
            maxZoom: 19,
            subdomains: 'abcd',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        );
        setCartoNotice(null);
      } else {
        // Fallback cleanly to OpenStreetMap per requirement
        newTileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        );
        setCartoNotice('CARTO Dark unavailable — configure CARTO API key (falling back to OpenStreetMap)');
      }
    } else if (basemapChoice === 'osm') {
      newTileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      );
      setCartoNotice(null);
    } else {
      // Satellite (Esri World Imagery)
      newTileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
      );
      setCartoNotice(null);
    }

    newTileLayer.addTo(map);
    newTileLayer.bringToBack();
    layersRef.current.basemapLayer = newTileLayer;
  }, [basemapChoice]);

  // Handle measurement clicks
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (activeTool !== 'measure') return;

      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMeasurePoints(prev => {
        const next = [...prev, newPoint];
        if (next.length >= 2) {
          let totalDist = 0;
          for (let i = 0; i < next.length - 1; i++) {
            totalDist += map.distance(next[i], next[i + 1]);
          }
          setMeasureDistanceM(Math.round(totalDist * 10) / 10);
        }
        return next;
      });
    };

    map.on('click', onMapClick);
    return () => {
      map.off('click', onMapClick);
    };
  }, [activeTool]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (measureLineRef.current) {
      map.removeLayer(measureLineRef.current);
      measureLineRef.current = null;
    }

    if (measurePoints.length >= 2) {
      const line = L.polyline(measurePoints, {
        color: '#0f766e',
        weight: 2.5,
        dashArray: '4, 4'
      }).addTo(map);
      measureLineRef.current = line;
    }
  }, [measurePoints]);

  const clearMeasurement = () => {
    setMeasurePoints([]);
    setMeasureDistanceM(null);
    if (measureLineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(measureLineRef.current);
      measureLineRef.current = null;
    }
  };

  // Render Vector Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Parcels
    const parcelGroup = layersRef.current.parcelLayerGroup;
    if (parcelGroup) {
      parcelGroup.clearLayers();
      if (visibleLayers.parcels) {
        parcels.forEach((parcel) => {
          const isSelected = selectedParcel?.id === parcel.id;
          const colors = LAND_USE_COLORS[parcel.landUse] || LAND_USE_COLORS.Residential;

          const poly = L.polygon(parcel.coordinates, {
            color: isSelected ? '#ffffff' : colors.stroke,
            weight: isSelected ? 3 : 1.5,
            fillColor: visibleLayers.landUse ? colors.fill : '#0f766e',
            fillOpacity: isSelected ? 0.55 : 0.28,
            dashArray: parcel.status === 'Preliminary' ? '4, 4' : undefined
          });

          poly.bindTooltip(
            `<div class="p-1 font-mono text-[11px] leading-tight">
              <span class="font-bold text-slate-900">${parcel.id}</span> · ${parcel.landUse}
              <div class="text-[10px] text-teal-700">Confidence: ${(parcel.confidence / 100).toFixed(2)}</div>
            </div>`,
            { sticky: true, className: 'cadastral-tooltip' }
          );

          poly.on('click', () => {
            if (activeTool === 'select') {
              setSelectedParcel(parcel);
            }
          });

          poly.addTo(parcelGroup);
        });
      }
    }

    // 2. Buildings
    const bldGroup = layersRef.current.buildingLayerGroup;
    if (bldGroup) {
      bldGroup.clearLayers();
      if (visibleLayers.buildings) {
        buildings.forEach((bld) => {
          const poly = L.polygon(bld.coordinates, {
            color: '#64748b',
            weight: 1,
            fillColor: '#f1f5f9',
            fillOpacity: 0.8
          });

          poly.bindTooltip(
            `<div class="text-[11px] font-mono leading-tight">
              <strong>${bld.id}</strong> (${bld.type})
              <div>${bld.floors} fl · ${bld.areaSqM} m²</div>
            </div>`,
            { sticky: true, className: 'cadastral-tooltip' }
          );

          poly.addTo(bldGroup);
        });
      }
    }

    // 3. Roads
    const roadGroup = layersRef.current.roadLayerGroup;
    if (roadGroup) {
      roadGroup.clearLayers();
      if (visibleLayers.roads) {
        roads.forEach((rd) => {
          const line = L.polyline(rd.coordinates, {
            color: '#0284c7',
            weight: Math.max(2.5, rd.widthM / 3.5),
            opacity: 0.85
          });

          line.bindTooltip(
            `<div class="text-[11px] font-mono">${rd.name} (${rd.widthM}m ROW)</div>`,
            { sticky: true, className: 'cadastral-tooltip' }
          );
          line.addTo(roadGroup);
        });
      }
    }

    // 4. Ground Truth
    const gtGroup = layersRef.current.gtLayerGroup;
    if (gtGroup) {
      gtGroup.clearLayers();
      if (visibleLayers.groundTruth) {
        groundTruthPoints.forEach((gt) => {
          const marker = L.circleMarker([gt.latitude, gt.longitude], {
            radius: 5.5,
            fillColor: '#0f766e',
            color: '#ffffff',
            weight: 2,
            fillOpacity: 1
          });

          marker.bindTooltip(
            `<div class="text-[11px] font-mono">
              <strong class="text-teal-800">${gt.id}</strong>: ${gt.stationName}
              <div>Acc: ±${gt.accuracyCm} cm · Elev: ${gt.elevationM}m</div>
            </div>`,
            { sticky: true, className: 'cadastral-tooltip' }
          );

          marker.addTo(gtGroup);
        });
      }
    }

    // 5. Topology Issues
    const issueGroup = layersRef.current.issueLayerGroup;
    if (issueGroup) {
      issueGroup.clearLayers();
      if (visibleLayers.issues) {
        topologyIssues.forEach((issue) => {
          if (issue.coordinates) {
            const isResolved = issue.status === 'Resolved';
            const marker = L.circleMarker(issue.coordinates, {
              radius: 6,
              fillColor: isResolved ? '#10b981' : '#f59e0b',
              color: '#ffffff',
              weight: 2,
              fillOpacity: 0.95
            });

            marker.bindTooltip(
              `<div class="text-[11px] font-mono">
                <strong class="${isResolved ? 'text-emerald-700' : 'text-amber-700'}">${issue.id}</strong>: ${issue.type}
                <div>Parcel: ${issue.parcelId} (${issue.severity})</div>
              </div>`,
              { sticky: true, className: 'cadastral-tooltip' }
            );

            marker.on('click', () => {
              const targetP = parcels.find(p => p.id === issue.parcelId);
              if (targetP) setSelectedParcel(targetP);
            });

            marker.addTo(issueGroup);
          }
        });
      }
    }
  }, [parcels, buildings, roads, topologyIssues, groundTruthPoints, selectedParcel, visibleLayers, activeTool]);

  const zoomToExtent = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(MAP_CENTER, DEFAULT_ZOOM, { duration: 0.5 });
    }
  };

  const filteredParcels = parcels.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-[#F5F7F9]">
      {/* 75-85% Dominant Map Canvas (Section 17) */}
      <div className="relative flex-1 h-full w-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Compact Floating Map Toolbar (Section 17) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 p-1 rounded-lg bg-white/95 border border-slate-200 shadow-md backdrop-blur-xs text-xs text-slate-700">
          <button
            onClick={() => {
              setActiveTool('select');
              clearMeasurement();
            }}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'select' ? 'bg-teal-700 text-white' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Select Parcel"
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setActiveTool('pan');
              clearMeasurement();
            }}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'pan' ? 'bg-teal-700 text-white' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Pan Map"
          >
            <Hand className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setActiveTool('measure');
              clearMeasurement();
            }}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'measure' ? 'bg-teal-700 text-white' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Measure Distance"
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3.5 bg-slate-200 mx-0.5" />

          <button
            onClick={zoomToExtent}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            title="Fit to Project Extent"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              isLayerPanelOpen ? 'bg-teal-700 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="Toggle Layer Panel"
          >
            <Layers className={`w-3.5 h-3.5 ${isLayerPanelOpen ? 'text-white' : 'text-teal-700'}`} />
            <span className="text-[11px] font-medium">Layers</span>
          </button>

          <span className="w-px h-3.5 bg-slate-200 mx-0.5" />

          {/* Compact Quick Search */}
          <div className="relative flex items-center">
            <Search className="w-3 h-3 absolute left-2 text-slate-400" />
            <input
              type="text"
              placeholder="Find parcel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-28 pl-6 pr-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:w-36 transition-all"
            />
          </div>
        </div>

        {/* Measure Distance Banner */}
        {activeTool === 'measure' && (
          <div className="absolute top-12 left-3 z-10 px-3 py-1.5 rounded-lg bg-white/95 border border-teal-500/40 text-xs text-slate-800 shadow-md flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-teal-700" />
            <span className="font-mono">
              {measureDistanceM !== null
                ? `Measured: ${measureDistanceM} m (${measurePoints.length} vertices)`
                : 'Click map to place measurement points'}
            </span>
            {measurePoints.length > 0 && (
              <button
                onClick={clearMeasurement}
                className="text-[10px] text-teal-700 hover:underline ml-2"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Professional Collapsible Layer Panel (Section 18) */}
        {isLayerPanelOpen && (
          <div className="absolute top-12 left-3 z-20 w-64 rounded-lg bg-white/95 border border-slate-200 p-3 shadow-xl backdrop-blur-xs text-xs text-slate-800 animate-in fade-in duration-100">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500">GIS Layer Manager</span>
              <button
                onClick={() => setIsLayerPanelOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {/* Basemap Selection */}
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">Basemap</div>
                <div className="space-y-1">
                  {[
                    { id: 'carto_dark', label: 'CARTO Dark' },
                    { id: 'osm', label: 'OpenStreetMap' },
                    { id: 'satellite', label: 'Satellite (Esri)' }
                  ].map((bm) => (
                    <label key={bm.id} className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                      <input
                        type="radio"
                        name="basemapChoice"
                        checked={basemapChoice === bm.id}
                        onChange={() => setBasemapChoice(bm.id as any)}
                        className="accent-teal-700"
                      />
                      <span>{bm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cadastral Layer Group */}
              <div className="pt-1 border-t border-slate-100">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">Cadastral</div>
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={visibleLayers.parcels}
                    onChange={() => toggleLayer('parcels')}
                    className="accent-teal-700"
                  />
                  <span className="font-medium">AI Parcel Candidates</span>
                </label>
              </div>

              {/* Features Layer Group */}
              <div className="pt-1 border-t border-slate-100">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">Features</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={visibleLayers.buildings}
                      onChange={() => toggleLayer('buildings')}
                      className="accent-teal-700"
                    />
                    <span>Building Footprints</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={visibleLayers.roads}
                      onChange={() => toggleLayer('roads')}
                      className="accent-teal-700"
                    />
                    <span>Road / Access Corridors</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={visibleLayers.landUse}
                      onChange={() => toggleLayer('landUse')}
                      className="accent-teal-700"
                    />
                    <span>Land Use Zoning</span>
                  </label>
                </div>
              </div>

              {/* QA & Verification */}
              <div className="pt-1 border-t border-slate-100">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-semibold">QA & Survey</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={visibleLayers.issues}
                      onChange={() => toggleLayer('issues')}
                      className="accent-amber-600"
                    />
                    <span>Topology Issues ({topologyIssues.length})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700">
                    <input
                      type="checkbox"
                      checked={visibleLayers.groundTruth}
                      onChange={() => toggleLayer('groundTruth')}
                      className="accent-teal-700"
                    />
                    <span>GNSS / Ground Truth ({groundTruthPoints.length})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-blocking CARTO Dark API key status & setup helper (Section 28) */}
        {cartoNotice && (
          <div className="absolute bottom-6 left-3 z-10 max-w-md px-3 py-2 rounded-lg bg-white/95 border border-slate-200 text-[11px] text-slate-700 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <div>
                <span>{cartoNotice}</span>
                <a
                  href="https://carto.com/basemaps/apikey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-teal-700 font-semibold hover:underline mt-0.5"
                >
                  Get official CARTO Basemaps API key →
                </a>
              </div>
            </div>
            <button
              onClick={() => setCartoNotice(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 15-25% Refined Bright Parcel Inspector (Section 19) */}
      <div className="w-72 md:w-80 shrink-0 border-l border-slate-200 bg-white text-slate-800 flex flex-col z-20 shadow-xs">
        {selectedParcel ? (
          <div className="h-full flex flex-col justify-between overflow-y-auto">
            <div className="p-4 space-y-3.5">
              {/* Header */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm font-bold text-slate-900 tracking-tight">
                    PARCEL {selectedParcel.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {selectedParcel.surveyNumber}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedParcel.status === 'Verified' ? 'bg-emerald-600' : 'bg-teal-600'
                  }`} />
                  <span className="text-xs font-semibold text-slate-700">
                    Candidate · {selectedParcel.status === 'Verified' ? 'Verified' : 'Review Required'}
                  </span>
                </div>
              </div>

              {/* Compact Attribute Table (Section 19) */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Area</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedParcel.areaSqM.toLocaleString()} m²</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Perimeter</span>
                  <span className="font-mono text-slate-900">{selectedParcel.perimeterM} m</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Confidence</span>
                  <span className="font-mono text-teal-800 font-semibold">
                    {(selectedParcel.confidence / 100).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Buildings</span>
                  <span className="font-mono text-slate-900">{selectedParcel.buildingCount}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Land Use</span>
                  <span className="text-slate-800 font-medium">{selectedParcel.landUse}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Topology</span>
                  <span className={`font-mono text-[11px] font-medium ${
                    selectedParcel.status === 'Needs Review' ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {selectedParcel.status === 'Needs Review' ? '⚠ Review Flag' : '✓ Valid'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Ground Truth</span>
                  <span className={`font-mono text-[11px] ${
                    selectedParcel.status === 'Verified' ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                  }`}>
                    {selectedParcel.status === 'Verified' ? '✓ Verified' : '○ Not verified'}
                  </span>
                </div>
              </div>

              {/* Review Actions (Section 19) */}
              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-2">
                  Surveyor Review Actions
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => updateParcelStatus(selectedParcel.id, 'Verified')}
                    className="px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs transition-colors"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => showToast(`Boundary editor active for ${selectedParcel.id}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors border border-slate-200"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => updateParcelStatus(selectedParcel.id, 'Needs Review')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                  >
                    Reject
                  </button>

                  {/* Prominent Field Survey Action (Section 19) */}
                  <button
                    onClick={() => updateParcelStatus(selectedParcel.id, 'Flagged for Field Survey')}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Crosshair className="w-3 h-3 text-amber-700" />
                    <span>Field Survey</span>
                  </button>
                </div>
              </div>

              {/* Expandable Explainability Drawer (Section 20) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowExplainDrawer(!showExplainDrawer)}
                  className="w-full flex items-center justify-between text-xs text-slate-800 hover:text-teal-800 py-1 transition-colors font-semibold"
                >
                  <span>How was this candidate generated?</span>
                  {showExplainDrawer ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>

                {showExplainDrawer && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-2 text-slate-700 font-mono">
                    <div>
                      <span className="text-slate-400 uppercase text-[9px] block mb-1 font-semibold">Evidence</span>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span>Building footprint</span>
                          <span className="text-emerald-700 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Road/access relationship</span>
                          <span className="text-emerald-700 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Elevation evidence</span>
                          <span className="text-emerald-700 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Existing GIS agreement</span>
                          <span className="text-amber-600 font-bold">△</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ground truth</span>
                          <span className="text-slate-400">○</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200">
                      <span className="text-slate-400 uppercase text-[9px] block mb-0.5 font-semibold">Spatial Inference</span>
                      <div className="text-[10px] text-slate-600 leading-tight">
                        Spatial relationship analysis → Candidate boundary
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200">
                      <span className="text-slate-400 uppercase text-[9px] block mb-1 font-semibold">Topology Validation</span>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span>Geometry valid</span>
                          <span className="text-emerald-700 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>No self-intersection</span>
                          <span className="text-emerald-700 font-bold">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>No overlap</span>
                          <span className="text-emerald-700 font-bold">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expandable Geometry Details */}
              <div className="border-t border-slate-100 pt-2">
                <button
                  onClick={() => setShowGeometryDetails(!showGeometryDetails)}
                  className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 py-1 transition-colors"
                >
                  <span>View geometry details</span>
                  {showGeometryDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showGeometryDetails && (
                  <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 space-y-1">
                    <div>CRS: EPSG:4326 (WGS 84)</div>
                    <div>Centroid: {selectedParcel.centroid[0].toFixed(5)}, {selectedParcel.centroid[1].toFixed(5)}</div>
                    <div>Vertices: {selectedParcel.coordinates.length} points</div>
                    <div>Front setback: {selectedParcel.generationReasoning.setbackDistanceM}m</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Governance Note */}
            <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono bg-slate-50/50">
              AI candidate parcel · Requires surveyor verification
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6 text-center text-xs text-slate-400">
            Select a parcel on the map to inspect attributes.
          </div>
        )}
      </div>
    </div>
  );
};
