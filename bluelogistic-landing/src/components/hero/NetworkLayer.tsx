'use client';

import { motion } from 'framer-motion';

// Network dots scattered across the map
const networkDots = [
  { x: 180, y: 160 },
  { x: 350, y: 180 },
  { x: 520, y: 170 },
  { x: 250, y: 280 },
  { x: 560, y: 290 },
  { x: 150, y: 380 },
  { x: 330, y: 420 },
  { x: 480, y: 450 },
  { x: 600, y: 350 },
  { x: 200, y: 450 },
  { x: 420, y: 150 },
  { x: 290, y: 340 },
  { x: 580, y: 220 },
  { x: 160, y: 260 },
  { x: 500, y: 380 },
];

// Network lines connecting some dots
const networkLines = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 3, to: 5 },
  { from: 4, to: 8 },
  { from: 6, to: 7 },
  { from: 10, to: 12 },
  { from: 11, to: 6 },
  { from: 13, to: 5 },
];

interface NetworkLayerProps {
  inView: boolean;
}

export function NetworkLayer({ inView }: NetworkLayerProps) {
  return (
    <g opacity={0.5}>
      {/* Network lines */}
      {networkLines.map((line, index) => (
        <motion.line
          key={`line-${index}`}
          x1={networkDots[line.from].x}
          y1={networkDots[line.from].y}
          x2={networkDots[line.to].x}
          y2={networkDots[line.to].y}
          stroke="#3B82F6"
          strokeWidth="1"
          strokeDasharray="4,6"
          opacity={0.2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.2 } : {}}
          transition={{
            duration: 1,
            delay: 0.6 + index * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Network dots with pulsing animation */}
      {networkDots.map((dot, index) => (
        <motion.circle
          key={`dot-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={3}
          fill="#3B82F6"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? {
            scale: [0, 1, 1.2, 1],
            opacity: [0, 0.5, 0.7, 0.5],
          } : {}}
          transition={{
            duration: 2,
            delay: 0.5 + index * 0.03,
            repeat: Infinity,
            repeatDelay: 1 + (index % 3) * 0.5,
          }}
        />
      ))}
    </g>
  );
}
