'use client';

// Simplified route visualization - clean static lines
const ROUTES = [
  { name: 'Germany', path: 'M250,200 L270,130', color: '#0D2556' },
  { name: 'France', path: 'M250,200 Q200,180 155,170', color: '#0D2556' },
  { name: 'Italy', path: 'M250,200 L270,290', color: '#0D2556' },
  { name: 'Netherlands', path: 'M250,200 L230,85', color: '#0D2556' },
  { name: 'Poland', path: 'M250,200 Q310,165 370,125', color: '#0D2556' },
  { name: 'Spain', path: 'M250,200 Q180,220 105,250', color: '#64748B' },
];

export function EuropeMap() {
  return (
    <g>
      {/* Simplified background */}
      <rect
        x="50"
        y="50"
        width="400"
        height="300"
        fill="none"
        stroke="#0D2556"
        strokeWidth="1"
        strokeOpacity="0.1"
      />

      {/* Central hub (Austria) */}
      <g>
        {/* Static ring */}
        <circle
          cx="250"
          cy="200"
          r="30"
          fill="none"
          stroke="#D8420E"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Center dot */}
        <circle
          cx="250"
          cy="200"
          r="12"
          fill="#D8420E"
        />

        {/* Flag */}
        <text
          x="250"
          y="206"
          textAnchor="middle"
          fontSize="16"
          style={{ userSelect: 'none' }}
        >
          🇦🇹
        </text>

        {/* Label */}
        <text
          x="250"
          y="230"
          textAnchor="middle"
          fill="#fff"
          fontSize="12"
          fontWeight="700"
        >
          AUSTRIA
        </text>
      </g>

      {/* Static route lines */}
      {ROUTES.map((route) => (
        <path
          key={route.name}
          d={route.path}
          fill="none"
          stroke={route.color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8,4"
          opacity="0.6"
        />
      ))}

      {/* Corner indicators */}
      <g opacity="0.4">
        <text x="60" y="70" fill="#D8420E" fontSize="10" fontWeight="700">29+ COUNTRIES</text>
        <text x="340" y="340" fill="#22C55E" fontSize="10" fontWeight="700" textAnchor="end">LIVE TRACKING</text>
      </g>
    </g>
  );
}

export const COUNTRIES = [];
