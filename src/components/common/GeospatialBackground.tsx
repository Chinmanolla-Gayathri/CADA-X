import React from 'react';

interface GeospatialBackgroundProps {
  variant?: 'overview' | 'welcome' | 'default';
  showDecorations?: boolean;
  className?: string;
}

export const GeospatialBackground: React.FC<GeospatialBackgroundProps> = ({
  variant = 'overview',
  showDecorations = false,
  className = ''
}) => {
  const svgWidth = 1600;
  const svgHeight = 1000;

  // Opacity fine-tuned for high contrast readability and authentic GIS cartographic presence
  const baseOpacity = variant === 'welcome' ? 'opacity-90' : 'opacity-75';

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0 ${baseOpacity} ${className}`}
    >
      <svg
        className="w-full h-full text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Coordinate Micro Grid: 40px sub-grid & 160px primary grid */}
          <pattern id="cadastralFineGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.35" strokeOpacity="0.12" />
          </pattern>

          <pattern id="cadastralPrimaryGrid" width="160" height="160" patternUnits="userSpaceOnUse">
            <rect width="160" height="160" fill="url(#cadastralFineGrid)" />
            <path d="M 160 0 L 0 0 0 160" fill="none" stroke="#475569" strokeWidth="0.65" strokeOpacity="0.22" />
            {/* Corner Crosshair Ticks at 160px intersections */}
            <path
              d="M -6 0 L 6 0 M 0 -6 L 0 6 M 154 0 L 166 0 M 160 -6 L 160 6 M -6 160 L 6 160 M 0 154 L 0 166 M 154 160 L 166 160 M 160 154 L 160 166"
              fill="none"
              stroke="#0f766e"
              strokeWidth="0.85"
              strokeOpacity="0.45"
            />
          </pattern>

          {/* Diagonal Hatch for Utility / Easement Corridors */}
          <pattern id="easementHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#d97706" strokeWidth="1.2" strokeOpacity="0.25" />
          </pattern>

          {/* Green Open Space Stipple Pattern */}
          <pattern id="greenStipple" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="#0f766e" fillOpacity="0.25" />
            <circle cx="15" cy="15" r="1" fill="#0f766e" fillOpacity="0.25" />
          </pattern>

          {/* UAV Nadir Scan Gradient */}
          <linearGradient id="uavScanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f766e" stopOpacity="0" />
            <stop offset="50%" stopColor="#0f766e" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
          </linearGradient>

          {/* Vignette mask to softly blend around extreme edges */}
          <linearGradient id="gisFadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
          </linearGradient>

          <mask id="gisCanvasMask">
            <rect width="100%" height="100%" fill="url(#gisFadeGrad)" />
          </mask>
        </defs>

        <g mask="url(#gisCanvasMask)">
          {/* ========================================================= */}
          {/* LAYER 0: BASE CARTOGRAPHIC COORDINATE GRID & TICKS */}
          {/* ========================================================= */}
          <rect width="100%" height="100%" fill="url(#cadastralPrimaryGrid)" />

          {/* Perimeter Coordinate Labels (WGS84 & UTM 44N) */}
          <g fill="#475569" fontSize="8.5" fontFamily="ui-monospace, monospace" fillOpacity="0.55" fontWeight="500">
            {/* Latitudes along left & right margins */}
            <text x="14" y="90">17°26'55"N · N 1930800</text>
            <text x="14" y="250">17°26'45"N · N 1930640</text>
            <text x="14" y="410">17°26'35"N · N 1930480</text>
            <text x="14" y="570">17°26'25"N · N 1930320</text>
            <text x="14" y="730">17°26'15"N · N 1930160</text>
            <text x="14" y="890">17°26'05"N · N 1930000</text>

            <text x="1480" y="90" textAnchor="end">17°26'55"N</text>
            <text x="1480" y="250" textAnchor="end">17°26'45"N</text>
            <text x="1480" y="410" textAnchor="end">17°26'35"N</text>
            <text x="1480" y="570" textAnchor="end">17°26'25"N</text>
            <text x="1480" y="730" textAnchor="end">17°26'15"N</text>
            <text x="1480" y="890" textAnchor="end">17°26'05"N</text>

            {/* Longitudes along top & bottom */}
            <text x="160" y="24" textAnchor="middle">78°22'15"E · E 221160</text>
            <text x="320" y="24" textAnchor="middle">78°22'25"E · E 221320</text>
            <text x="480" y="24" textAnchor="middle">78°22'35"E · E 221480</text>
            <text x="640" y="24" textAnchor="middle">78°22'45"E · E 221640</text>
            <text x="800" y="24" textAnchor="middle">78°22'55"E · E 221800</text>
            <text x="960" y="24" textAnchor="middle">78°23'05"E · E 221960</text>
            <text x="1120" y="24" textAnchor="middle">78°23'15"E · E 222120</text>
            <text x="1280" y="24" textAnchor="middle">78°23'25"E · E 222280</text>
            <text x="1440" y="24" textAnchor="middle">78°23'35"E · E 222440</text>

            <text x="160" y="986" textAnchor="middle">78°22'15"E</text>
            <text x="480" y="986" textAnchor="middle">78°22'35"E</text>
            <text x="800" y="986" textAnchor="middle">78°22'55"E</text>
            <text x="1120" y="986" textAnchor="middle">78°23'15"E</text>
            <text x="1440" y="986" textAnchor="middle">78°23'35"E</text>
          </g>

          {/* Coordinate intersection micro crosshair text */}
          <g fill="#64748b" fontSize="7" fontFamily="ui-monospace, monospace" fillOpacity="0.4">
            <text x="324" y="258">+ 221.32k / 1930.64k</text>
            <text x="644" y="258">+ 221.64k / 1930.64k</text>
            <text x="964" y="258">+ 221.96k / 1930.64k</text>
            <text x="1284" y="258">+ 222.28k / 1930.64k</text>

            <text x="324" y="578">+ 221.32k / 1930.32k</text>
            <text x="644" y="578">+ 221.64k / 1930.32k</text>
            <text x="964" y="578">+ 221.96k / 1930.32k</text>
            <text x="1284" y="578">+ 222.28k / 1930.32k</text>
          </g>

          {/* ========================================================= */}
          {/* LAYER 1: TOPOGRAPHIC ELEVATION CONTOURS (DTM / TERRAIN) */}
          {/* ========================================================= */}
          <g fill="none">
            {/* Intermediate 2m contours */}
            <path
              d="M -50 160 C 240 110, 560 210, 880 140 C 1140 80, 1340 180, 1650 120"
              stroke="#94a3b8"
              strokeWidth="0.7"
              strokeDasharray="4 4"
              strokeOpacity="0.32"
            />
            {/* Index 540m contour */}
            <path
              d="M -50 310 C 260 270, 520 370, 860 300 C 1120 240, 1310 330, 1650 280"
              stroke="#64748b"
              strokeWidth="1.1"
              strokeOpacity="0.38"
            />
            {/* Intermediate 542m contour */}
            <path
              d="M -50 490 C 220 440, 480 540, 820 470 C 1090 410, 1280 520, 1650 460"
              stroke="#94a3b8"
              strokeWidth="0.7"
              strokeDasharray="4 4"
              strokeOpacity="0.3"
            />
            {/* Index 544m contour */}
            <path
              d="M -50 670 C 240 620, 580 720, 940 640 C 1160 580, 1320 670, 1650 620"
              stroke="#64748b"
              strokeWidth="1.1"
              strokeOpacity="0.38"
            />
            {/* Intermediate 546m contour */}
            <path
              d="M -50 830 C 280 790, 540 880, 890 820 C 1150 760, 1350 850, 1650 800"
              stroke="#94a3b8"
              strokeWidth="0.7"
              strokeDasharray="4 4"
              strokeOpacity="0.3"
            />

            {/* Contour Elevation Labels */}
            <text x="210" y="306" fill="#64748b" fontSize="8" fontFamily="ui-monospace, monospace" fillOpacity="0.55" fontWeight="600">
              540m
            </text>
            <text x="910" y="296" fill="#64748b" fontSize="8" fontFamily="ui-monospace, monospace" fillOpacity="0.55" fontWeight="600">
              540m
            </text>
            <text x="230" y="666" fill="#64748b" fontSize="8" fontFamily="ui-monospace, monospace" fillOpacity="0.55" fontWeight="600">
              544m
            </text>
            <text x="990" y="636" fill="#64748b" fontSize="8" fontFamily="ui-monospace, monospace" fillOpacity="0.55" fontWeight="600">
              544m
            </text>
          </g>

          {/* ========================================================= */}
          {/* LAYER 2: ROAD CORRIDORS, RIGHT-OF-WAYS & CENTERLINES */}
          {/* ========================================================= */}
          <g>
            {/* 1. Primary East-West Arterial Corridor (ROW 24.0m) */}
            <g>
              {/* Road Buffer & Pavement */}
              <rect x="-20" y="440" width="1640" height="42" fill="#e2e8f0" fillOpacity="0.45" stroke="#cbd5e1" strokeWidth="1" />
              {/* Sidewalk curb lines */}
              <line x1="-20" y1="446" x2="1620" y2="446" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="-20" y1="476" x2="1620" y2="476" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.4" />
              {/* Double dashed centerline */}
              <line x1="-20" y1="460" x2="1620" y2="460" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="8 6" strokeOpacity="0.45" />
              <line x1="-20" y1="462" x2="1620" y2="462" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="8 6" strokeOpacity="0.45" />
              {/* Road label */}
              <text x="360" y="456" fill="#475569" fontSize="8.5" fontFamily="sans-serif" fontWeight="700" letterSpacing="1.2" fillOpacity="0.55">
                SECTOR 4 CENTRAL ARTERIAL BOULEVARD (ROW 24.0m)
              </text>
              <text x="1100" y="456" fill="#475569" fontSize="8.5" fontFamily="sans-serif" fontWeight="700" letterSpacing="1.2" fillOpacity="0.55">
                SECTOR 4 CENTRAL ARTERIAL BOULEVARD (ROW 24.0m)
              </text>
            </g>

            {/* 2. North-South Avenue (ROW 16.0m) */}
            <g>
              <rect x="760" y="-20" width="34" height="1040" fill="#e2e8f0" fillOpacity="0.45" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="765" y1="-20" x2="765" y2="1020" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="789" y1="-20" x2="789" y2="1020" stroke="#94a3b8" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="777" y1="-20" x2="777" y2="1020" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="8 6" strokeOpacity="0.45" />
              {/* Vertical road name */}
              <text
                x="773"
                y="180"
                fill="#475569"
                fontSize="8"
                fontFamily="sans-serif"
                fontWeight="700"
                letterSpacing="1"
                fillOpacity="0.55"
                transform="rotate(-90 773 180)"
              >
                AVENUE 4 EAST (ROW 16.0m)
              </text>
              <text
                x="773"
                y="740"
                fill="#475569"
                fontSize="8"
                fontFamily="sans-serif"
                fontWeight="700"
                letterSpacing="1"
                fillOpacity="0.55"
                transform="rotate(-90 773 740)"
              >
                AVENUE 4 EAST (ROW 16.0m)
              </text>
            </g>

            {/* 3. North Colony Access Road with Cul-de-Sac */}
            <g>
              <path
                d="M 120 180 L 460 180 C 490 180, 520 200, 520 240 L 520 340 L 480 340"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="24"
                strokeLinecap="round"
                strokeOpacity="0.5"
              />
              <path
                d="M 120 180 L 460 180 C 490 180, 520 200, 520 240 L 520 340 L 480 340"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                strokeOpacity="0.45"
              />
              {/* Cul-de-Sac bulb */}
              <circle cx="280" cy="280" r="30" fill="#e2e8f0" fillOpacity="0.4" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="280" y1="180" x2="280" y2="280" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.45" />
              <text x="140" y="174" fill="#64748b" fontSize="7.5" fontFamily="sans-serif" fontWeight="600" fillOpacity="0.5">
                COLONY CRESCENT · 9.0m ROW
              </text>
            </g>

            {/* 4. Diagonal Historic Revenue Road (Angled corridor) */}
            <g>
              <path
                d="M 1080 30 L 1520 390 L 1580 500"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="22"
                strokeOpacity="0.45"
              />
              <path
                d="M 1080 30 L 1520 390 L 1580 500"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                strokeOpacity="0.4"
              />
              <text
                x="1260"
                y="190"
                fill="#64748b"
                fontSize="7.5"
                fontFamily="sans-serif"
                fontWeight="600"
                transform="rotate(38 1260 190)"
                fillOpacity="0.5"
              >
                OLD REVENUE CART TRACK / BOUNDARY (ROW 12.0m)
              </text>
            </g>

            {/* 5. South Industrial Service Road */}
            <g>
              <rect x="80" y="740" width="680" height="26" fill="#e2e8f0" fillOpacity="0.45" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="80" y1="753" x2="760" y2="753" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.4" />
              <text x="100" y="749" fill="#64748b" fontSize="7.5" fontFamily="sans-serif" fontWeight="600" fillOpacity="0.5">
                INDUSTRIAL ACCESS SPINE · 12.0m ROW
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* LAYER 3: URBAN CADASTRAL PARCELS (CADASTRAL BOUNDARY FABRIC) */}
          {/* ========================================================= */}
          {/* BLOCK A: North-West Residential Subdivision (Plots 101/1 to 101/8) */}
          <g>
            {/* Parcel P-101/1 */}
            <polygon
              points="100,50 200,50 200,165 100,165"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="150" y="105" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/1
            </text>
            <text x="150" y="116" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              425 m²
            </text>

            {/* Parcel P-101/2 */}
            <polygon
              points="200,50 300,50 300,165 200,165"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="250" y="105" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/2
            </text>
            <text x="250" y="116" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              425 m²
            </text>

            {/* Parcel P-101/3 */}
            <polygon
              points="300,50 400,50 400,165 300,165"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="350" y="105" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/3
            </text>
            <text x="350" y="116" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              425 m²
            </text>

            {/* Parcel P-101/4 (AI Highlighted Candidate Parcel!) */}
            <polygon
              points="400,50 510,50 510,165 400,165"
              fill="#0f766e"
              fillOpacity="0.06"
              stroke="#0f766e"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              strokeOpacity="0.75"
              className="animate-analysis-glow"
            />
            <text x="455" y="102" textAnchor="middle" fill="#0f766e" fontSize="8.5" fontFamily="ui-monospace, monospace" fontWeight="bold" fillOpacity="0.85">
              SY 101/4
            </text>
            <text x="455" y="114" textAnchor="middle" fill="#0f766e" fontSize="7" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.7">
              [AI CANDIDATE · 96.2%]
            </text>
            <text x="455" y="124" textAnchor="middle" fill="#0f766e" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.6">
              468 m²
            </text>

            {/* Parcel P-101/5 */}
            <polygon
              points="510,50 630,50 630,165 510,165"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="570" y="105" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/5
            </text>
            <text x="570" y="116" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              510 m²
            </text>

            {/* Parcel P-101/6 */}
            <polygon
              points="630,50 740,50 740,165 630,165"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="685" y="105" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/6
            </text>
            <text x="685" y="116" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              468 m²
            </text>

            {/* Boundary Dimension Hash Ticks along road frontage */}
            <g fill="#64748b" fontSize="6" fontFamily="ui-monospace, monospace" fillOpacity="0.5">
              <text x="145" y="162">20.0m</text>
              <text x="245" y="162">20.0m</text>
              <text x="345" y="162">20.0m</text>
              <text x="450" y="162">22.0m</text>
              <text x="565" y="162">24.0m</text>
              <text x="680" y="162">22.0m</text>
            </g>

            {/* Boundary Monument Corner Markers (small circles at parcel junctions) */}
            <circle cx="100" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="200" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="300" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="400" cy="50" r="2.2" fill="#0f766e" fillOpacity="0.8" />
            <circle cx="510" cy="50" r="2.2" fill="#0f766e" fillOpacity="0.8" />
            <circle cx="630" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="740" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="100" cy="165" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="200" cy="165" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="300" cy="165" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="400" cy="165" r="2.2" fill="#0f766e" fillOpacity="0.8" />
            <circle cx="510" cy="165" r="2.2" fill="#0f766e" fillOpacity="0.8" />
            <circle cx="630" cy="165" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="740" cy="165" r="2.2" fill="#475569" fillOpacity="0.6" />
          </g>

          {/* South Row of Block A (Facing Colony Crescent) */}
          <g>
            <polygon
              points="100,195 210,195 210,310 100,310"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="155" y="250" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/7
            </text>
            <text x="155" y="261" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              460 m²
            </text>

            <polygon
              points="320,195 440,195 440,310 320,310"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="380" y="250" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/8
            </text>
            <text x="380" y="261" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              480 m²
            </text>

            <polygon
              points="440,195 560,195 560,310 440,310"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="500" y="250" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/9
            </text>
            <text x="500" y="261" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              480 m²
            </text>

            <polygon
              points="560,195 740,195 740,310 560,310"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="650" y="250" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 101/10 · CORNER PLOT
            </text>
            <text x="650" y="261" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              720 m²
            </text>
          </g>

          {/* Setback Lines (2.5m inside parcels - dashed grey line) */}
          <g fill="none" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.35">
            <rect x="110" y="60" width="80" height="95" />
            <rect x="210" y="60" width="80" height="95" />
            <rect x="310" y="60" width="80" height="95" />
            <rect x="410" y="60" width="90" height="95" stroke="#0f766e" strokeOpacity="0.5" />
            <rect x="520" y="60" width="100" height="95" />
            <rect x="640" y="60" width="90" height="95" />
          </g>

          {/* ========================================================= */}
          {/* BLOCK B: North-East Commercial / Tech Arcade (Plots 105/1 to 105/5) */}
          {/* ========================================================= */}
          <g>
            <polygon
              points="810,50 960,50 960,200 810,200"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="885" y="118" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 105/1 · TECH PLAZA
            </text>
            <text x="885" y="129" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              1,125 m²
            </text>

            <polygon
              points="960,50 1100,50 1100,200 960,200"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="1030" y="118" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 105/2 · COMMERCIAL
            </text>
            <text x="1030" y="129" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              1,050 m²
            </text>

            {/* Angled lots along the diagonal revenue track */}
            <polygon
              points="1100,50 1250,50 1180,200 1100,200"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="1155" y="118" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 105/3
            </text>

            <polygon
              points="1250,50 1440,50 1340,200 1180,200"
              fill="#0f766e"
              fillOpacity="0.06"
              stroke="#0f766e"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              strokeOpacity="0.75"
              className="animate-analysis-glow"
            />
            <text x="1290" y="115" textAnchor="middle" fill="#0f766e" fontSize="8.5" fontFamily="ui-monospace, monospace" fontWeight="bold" fillOpacity="0.85">
              SY 105/4 · [AI VERIFIED]
            </text>
            <text x="1290" y="127" textAnchor="middle" fill="#0f766e" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.7">
              1,840 m² · FRONTAGE 38m
            </text>

            {/* Corner Monument markers */}
            <circle cx="810" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="960" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="1100" cy="50" r="2.2" fill="#475569" fillOpacity="0.6" />
            <circle cx="1250" cy="50" r="2.2" fill="#0f766e" fillOpacity="0.8" />
            <circle cx="1440" cy="50" r="2.2" fill="#0f766e" fillOpacity="0.8" />
          </g>

          {/* ========================================================= */}
          {/* BLOCK C: South Mixed-Use, Public Park & Drainage Easement */}
          {/* ========================================================= */}
          <g>
            {/* Public Community Park & Open Space */}
            <polygon
              points="100,500 480,500 480,710 100,710"
              fill="url(#greenStipple)"
              stroke="#0f766e"
              strokeWidth="1.1"
              strokeOpacity="0.45"
            />
            <rect x="100" y="500" width="380" height="210" fill="#0f766e" fillOpacity="0.03" />
            <text x="290" y="590" textAnchor="middle" fill="#0f766e" fontSize="9" fontFamily="sans-serif" fontWeight="700" letterSpacing="1" fillOpacity="0.7">
              COMMUNITY OPEN GREEN SPACE & PARK
            </text>
            <text x="290" y="605" textAnchor="middle" fill="#0f766e" fontSize="7.5" fontFamily="ui-monospace, monospace" fillOpacity="0.6">
              SY 110/P · PUBLIC CADASTRE RESERVATION (31,920 m²)
            </text>

            {/* Stormwater Drainage Canal / Easement buffer through park */}
            <g>
              <path
                d="M 100 660 C 220 640, 360 670, 480 650"
                fill="none"
                stroke="#d97706"
                strokeWidth="16"
                strokeOpacity="0.15"
              />
              <path
                d="M 100 660 C 220 640, 360 670, 480 650"
                fill="none"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
              />
              <text x="210" y="656" fill="#b45309" fontSize="7" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.65">
                15.0m STORMWATER DRAINAGE EASEMENT BUFFER
              </text>
            </g>

            {/* Municipal Water Booster Station */}
            <polygon
              points="500,500 740,500 740,620 500,620"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="620" y="555" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 112/1 · PUMPING BOOSTER
            </text>
            <text x="620" y="566" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              MUNICIPAL PUBLIC ASSET
            </text>

            {/* Substation */}
            <polygon
              points="500,630 740,630 740,710 500,710"
              fill="url(#easementHatch)"
              stroke="#d97706"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text x="620" y="675" textAnchor="middle" fill="#92400e" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="bold" fillOpacity="0.75">
              SY 112/2 · 33KV POWER SUBSTATION
            </text>
          </g>

          {/* ========================================================= */}
          {/* BLOCK D: South-East Industrial Belt (Logistics & Production) */}
          {/* ========================================================= */}
          <g>
            <polygon
              points="810,500 1140,500 1140,710 810,710"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="975" y="595" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 120/1 · LOGISTICS TRANSFER DEPOT
            </text>
            <text x="975" y="607" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              23,100 m² · ROAD ACCESS SPINE
            </text>

            <polygon
              points="1160,500 1520,500 1520,710 1160,710"
              fill="#f8fafc"
              fillOpacity="0.3"
              stroke="#475569"
              strokeWidth="0.9"
              strokeOpacity="0.45"
            />
            <text x="1340" y="595" textAnchor="middle" fill="#334155" fontSize="8.5" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              SY 120/2 · ADVANCED FABRICATION UNIT
            </text>
            <text x="1340" y="607" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="ui-monospace, monospace" fillOpacity="0.45">
              25,200 m²
            </text>
          </g>

          {/* ========================================================= */}
          {/* LAYER 4: BUILDING FOOTPRINTS (EXTRACTED STRUCTURES) */}
          {/* ========================================================= */}
          <g fill="#94a3b8" fillOpacity="0.28" stroke="#475569" strokeWidth="0.8" strokeOpacity="0.45">
            {/* Residential Buildings in Block A */}
            <rect x="125" y="75" width="50" height="60" />
            <rect x="225" y="75" width="50" height="60" />
            <rect x="325" y="75" width="50" height="60" />
            {/* Building in AI Candidate Parcel P-101/4 */}
            <polygon points="420,75 490,75 490,135 440,135 440,115 420,115" fill="#0f766e" fillOpacity="0.15" stroke="#0f766e" strokeOpacity="0.6" />
            <rect x="535" y="75" width="65" height="60" />
            <rect x="650" y="75" width="55" height="60" />

            {/* South row residences */}
            <rect x="130" y="215" width="55" height="65" />
            <rect x="345" y="215" width="60" height="65" />
            <rect x="465" y="215" width="60" height="65" />
            <polygon points="585,215 700,215 700,285 585,285" />

            {/* Commercial Buildings in Block B */}
            <polygon points="835,75 935,75 935,175 835,175" />
            <rect x="980" y="75" width="90" height="100" />
            <polygon points="1210,75 1400,75 1310,175 1190,175" />

            {/* Industrial Warehouses in Block D */}
            <rect x="850" y="530" width="240" height="130" />
            <rect x="1200" y="530" width="260" height="130" />

            {/* Municipal Pump House */}
            <rect x="540" y="525" width="80" height="65" />
          </g>

          {/* ========================================================= */}
          {/* LAYER 5: GEODETIC SURVEY NETWORK & CONTROL TRAVERSE */}
          {/* ========================================================= */}
          {/* Traverse Baseline Tie-lines connecting Primary Benchmarks */}
          <g fill="none" stroke="#0f766e" strokeWidth="1.1" strokeDasharray="6 4" strokeOpacity="0.45">
            <line x1="80" y1="180" x2="480" y2="440" />
            <line x1="480" y1="440" x2="777" y2="220" />
            <line x1="777" y1="220" x2="1360" y2="340" />
            <line x1="480" y1="440" x2="480" y2="720" />
            <line x1="480" y1="720" x2="1140" y2="760" />
          </g>

          {/* Traverse Bearing & Distance Callouts */}
          <g fill="#0f766e" fontSize="7.5" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.75">
            <text x="240" y="300" transform="rotate(33 240 300)">
              TIE-01: S 54°22' E · 472.4m
            </text>
            <text x="610" y="320" transform="rotate(-36 610 320)">
              TIE-02: N 53°10' E · 368.1m
            </text>
            <text x="1040" y="270" transform="rotate(11 1040 270)">
              TIE-03: S 78°44' E · 594.8m
            </text>
            <text x="780" y="730" transform="rotate(3 780 730)">
              TIE-04: S 86°30' E · 661.2m
            </text>
          </g>

          {/* Primary Survey Control Stations (△ Benchmark Symbol) */}
          <g>
            {/* Station 1: GCP-01 */}
            <g transform="translate(80, 180)">
              <polygon points="0,-8 7,5 -7,5" fill="none" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#0f766e" className="animate-pulse-benchmark" />
              <circle cx="0" cy="0" r="1" fill="#ffffff" />
              <text x="10" y="3" fill="#0f766e" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="bold">
                △ GCP-01 (EL 541.2m)
              </text>
            </g>

            {/* Station 2: BM-14 / CENTRAL TIE */}
            <g transform="translate(480, 440)">
              <polygon points="0,-8 7,5 -7,5" fill="none" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#0f766e" className="animate-pulse-benchmark" />
              <circle cx="0" cy="0" r="1" fill="#ffffff" />
              <text x="10" y="-4" fill="#0f766e" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="bold">
                △ BM-14A [PRIMARY REVENUE PEG]
              </text>
              <text x="10" y="6" fill="#64748b" fontSize="7" fontFamily="ui-monospace, monospace">
                N 17°26'34.8" · E 78°22'35.2"
              </text>
            </g>

            {/* Station 3: GCP-04 */}
            <g transform="translate(777, 220)">
              <polygon points="0,-8 7,5 -7,5" fill="none" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#0f766e" className="animate-pulse-benchmark" />
              <circle cx="0" cy="0" r="1" fill="#ffffff" />
              <text x="10" y="3" fill="#0f766e" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="bold">
                △ GCP-04 [LEICA GNSS RTK]
              </text>
            </g>

            {/* Station 4: GCP-07 */}
            <g transform="translate(480, 720)">
              <polygon points="0,-8 7,5 -7,5" fill="none" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#0f766e" className="animate-pulse-benchmark" />
              <circle cx="0" cy="0" r="1" fill="#ffffff" />
              <text x="10" y="3" fill="#0f766e" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="bold">
                △ GCP-07 [SOI PERMANENT BM]
              </text>
            </g>

            {/* Station 5: GCP-09 */}
            <g transform="translate(1360, 340)">
              <polygon points="0,-8 7,5 -7,5" fill="none" stroke="#0f766e" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2.5" fill="#0f766e" className="animate-pulse-benchmark" />
              <circle cx="0" cy="0" r="1" fill="#ffffff" />
              <text x="10" y="3" fill="#0f766e" fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="bold">
                △ GCP-09 (EL 545.6m)
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* LAYER 6: LIVING SATELLITE / UAV SCAN SWATH LINE */}
          {/* ========================================================= */}
          <g className="animate-geo-scan">
            <line
              x1="0"
              y1="220"
              x2={svgWidth}
              y2="220"
              stroke="#0f766e"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.45"
            />
            <rect
              x="0"
              y="200"
              width={svgWidth}
              height="40"
              fill="url(#uavScanGrad)"
              opacity="0.35"
            />
            {/* Small text indicating active photogrammetric swath */}
            <text x="30" y="215" fill="#0f766e" fontSize="7" fontFamily="ui-monospace, monospace" fontWeight="600" fillOpacity="0.6">
              NADIR PHOTOGRAMMETRY SWATH · GSD 4.2cm · SENSOR RES 4096x4096px
            </text>
          </g>
        </g>
      </svg>

      {/* ========================================================= */}
      {/* CARTOGRAPHIC MARGINALIA: NORTH ARROW, GRAPHIC SCALE & CRS */}
      {/* ========================================================= */}
      {showDecorations && (
        <div className="absolute bottom-3 right-4 z-10 hidden sm:flex items-center gap-3 p-1.5 px-2.5 rounded bg-white/80 backdrop-blur-xs border border-slate-200/90 text-[10px] text-slate-500 font-mono shadow-2xs select-none">
          {/* Official Cadastral Sheet Tag */}
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold border-r border-slate-200 pr-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
            <span className="text-[9px] uppercase tracking-wider text-slate-800">CADASTRAL SHEET 14/B</span>
          </div>

          {/* North Arrow */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 flex items-center justify-center font-bold text-teal-800 border border-slate-300 rounded-full text-[9px] bg-slate-50">
              N↑
            </div>
            <span className="font-semibold text-slate-700 text-[9px]">TRUE NORTH</span>
          </div>

          <span className="w-px h-3 bg-slate-200" />

          {/* Alternating Graphic Scale Bar */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-0 w-20 h-1.5 border border-slate-500 bg-slate-200">
              <span className="w-1/4 h-full bg-slate-800" />
              <span className="w-1/4 h-full bg-white" />
              <span className="w-1/4 h-full bg-slate-800" />
              <span className="w-1/4 h-full bg-white" />
            </div>
            <div className="flex justify-between text-[7.5px] text-slate-500 leading-none">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>100m</span>
            </div>
          </div>

          <span className="w-px h-3 bg-slate-200" />

          {/* Geodetic Reference */}
          <div className="flex flex-col text-[8.5px] leading-tight text-slate-500">
            <span className="font-semibold text-slate-700">WGS 84 / UTM 44N</span>
            <span className="text-[7.5px] text-slate-400">EPSG:3857 · 1:1,000</span>
          </div>
        </div>
      )}
    </div>
  );
};
