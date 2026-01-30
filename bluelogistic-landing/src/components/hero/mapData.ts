// Map data with exact SVG paths from requirements

export const COLORS = {
  origin: "#D8420E",      // Austria - orange
  destination: "#0D2556", // Blue countries
  background: "#E2E8F0",  // Gray countries
  route: "#D8420E",       // Orange routes
};

// Country SVG paths and positions
export const COUNTRIES = {
  // === AUSTRIA - ORIGIN (Orange with glow) ===
  austria: {
    path: "M265,195 L280,188 L295,190 L310,195 L320,205 L315,218 L300,225 L280,228 L260,225 L245,218 L242,205 L250,195 Z",
    fill: COLORS.origin,
    center: [280, 210] as [number, number],
    isOrigin: true,
  },

  // === DESTINATIONS (Blue) ===
  germany: {
    path: "M230,95 L250,80 L280,75 L305,82 L320,95 L325,120 L320,150 L308,175 L290,185 L265,188 L245,182 L228,165 L220,140 L222,115 Z",
    fill: COLORS.destination,
    center: [270, 130] as [number, number],
  },

  france: {
    path: "M130,120 L155,105 L185,108 L205,125 L215,155 L210,190 L195,220 L165,235 L130,230 L105,210 L100,175 L105,140 Z",
    fill: COLORS.destination,
    center: [155, 170] as [number, number],
  },

  italy: {
    path: "M260,235 L275,240 L285,260 L280,290 L270,320 L255,340 L245,335 L250,310 L255,280 L250,255 L255,240 Z",
    fill: COLORS.destination,
    center: [265, 285] as [number, number],
  },

  netherlands: {
    path: "M205,70 L218,65 L228,72 L225,85 L212,90 L200,82 Z",
    fill: COLORS.destination,
    center: [214, 78] as [number, number],
  },

  belgium: {
    path: "M195,92 L212,90 L222,98 L218,112 L202,115 L190,105 Z",
    fill: COLORS.destination,
    center: [205, 102] as [number, number],
  },

  poland: {
    path: "M330,90 L355,85 L380,95 L388,120 L382,150 L365,168 L340,165 L322,150 L320,120 Z",
    fill: COLORS.destination,
    center: [352, 125] as [number, number],
  },

  // === BACKGROUND (Gray) ===
  switzerland: {
    path: "M210,195 L230,190 L242,200 L238,215 L220,220 L205,210 Z",
    fill: COLORS.background,
  },

  czechia: {
    path: "M280,160 L305,155 L320,165 L315,180 L295,185 L275,178 Z",
    fill: COLORS.background,
  },

  slovakia: {
    path: "M320,175 L345,170 L360,180 L355,195 L335,198 L318,190 Z",
    fill: COLORS.background,
  },

  hungary: {
    path: "M320,200 L350,195 L370,210 L365,235 L340,240 L315,230 L318,210 Z",
    fill: COLORS.background,
  },

  slovenia: {
    path: "M280,225 L300,222 L308,235 L295,245 L275,240 Z",
    fill: COLORS.background,
  },
};

// Shipping routes from Austria to each destination
export const ROUTES = [
  { id: "to-germany", path: "M280,210 Q260,170 270,130", delay: 0, duration: 1.5 },
  { id: "to-france", path: "M280,210 Q220,180 155,170", delay: 0.15, duration: 1.7 },
  { id: "to-italy", path: "M280,210 Q275,250 265,285", delay: 0.25, duration: 1.4 },
  { id: "to-netherlands", path: "M280,210 Q250,140 214,78", delay: 0.1, duration: 1.6 },
  { id: "to-belgium", path: "M280,210 Q240,155 205,102", delay: 0.2, duration: 1.5 },
  { id: "to-poland", path: "M280,210 Q320,165 352,125", delay: 0.12, duration: 1.5 },
];

// Flag configurations
export const FLAGS = [
  {
    country: "austria",
    pos: [280, 210] as [number, number],
    colors: ["#ED2939", "#FFF", "#ED2939"],
    horizontal: true
  },
  {
    country: "germany",
    pos: [270, 130] as [number, number],
    colors: ["#000", "#DD0000", "#FFCC00"],
    horizontal: true
  },
  {
    country: "france",
    pos: [155, 170] as [number, number],
    colors: ["#0055A4", "#FFF", "#EF4135"],
    horizontal: false
  },
  {
    country: "italy",
    pos: [265, 285] as [number, number],
    colors: ["#009246", "#FFF", "#CE2B37"],
    horizontal: false
  },
  {
    country: "netherlands",
    pos: [214, 78] as [number, number],
    colors: ["#AE1C28", "#FFF", "#21468B"],
    horizontal: true
  },
  {
    country: "belgium",
    pos: [205, 102] as [number, number],
    colors: ["#000", "#FAE042", "#ED2939"],
    horizontal: false
  },
  {
    country: "poland",
    pos: [352, 125] as [number, number],
    colors: ["#FFF", "#DC143C"],
    horizontal: true
  },
];

// Package animation timing
export const PACKAGE_CONFIG = [
  { routeIndex: 0, firstPackage: 2.0, travelTime: 2.5, loopInterval: 5.0 }, // Germany
  { routeIndex: 1, firstPackage: 2.2, travelTime: 2.8, loopInterval: 5.3 }, // France
  { routeIndex: 2, firstPackage: 2.4, travelTime: 2.2, loopInterval: 4.8 }, // Italy
  { routeIndex: 3, firstPackage: 2.1, travelTime: 2.6, loopInterval: 5.2 }, // Netherlands
  { routeIndex: 4, firstPackage: 2.3, travelTime: 2.4, loopInterval: 5.0 }, // Belgium
  { routeIndex: 5, firstPackage: 2.15, travelTime: 2.5, loopInterval: 5.1 }, // Poland
];
