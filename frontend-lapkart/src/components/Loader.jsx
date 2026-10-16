import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/85 backdrop-blur-md select-none transition-all">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute w-64 h-64 bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Floating Animated Minimalist Laptop */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex flex-col items-center"
      >
        {/* Holographic Radar Waves Beneath Laptop */}
        <div className="absolute -bottom-6 w-32 h-8 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [0.7, 1.3], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-28 h-7 rounded-full border border-cyan-400/40"
          />
          <motion.div
            animate={{ scale: [0.7, 1.3], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
            className="absolute w-28 h-7 rounded-full border border-cyan-400/20"
          />
          <div className="w-16 h-3 rounded-full bg-cyan-400/20 blur-sm" />
        </div>

        {/* Minimal Geometric SVG Laptop */}
        <div className="relative filter drop-shadow-[0_0_24px_rgba(6,182,212,0.35)]">
          <svg
            width="100"
            height="74"
            viewBox="0 0 100 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <defs>
              <linearGradient id="loaderLidGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>

              <linearGradient id="screenDisplayGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#080e1e" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="laserBeamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              <filter id="screenGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Laptop Display Lid (Standing Angle) */}
            <rect
              x="24"
              y="10"
              width="52"
              height="34"
              rx="4"
              stroke="url(#loaderLidGrad)"
              strokeWidth="1.8"
              fill="#090d16"
            />

            {/* Inner Screen Surface */}
            <rect
              x="27.5"
              y="13.5"
              width="45"
              height="27"
              rx="2.5"
              fill="url(#screenDisplayGrad)"
            />

            {/* Scanning Radar Laser Line */}
            <line
              x1="28"
              y1="18"
              x2="72"
              y2="18"
              stroke="url(#laserBeamGrad)"
              strokeWidth="2"
            >
              <animate
                attributeName="y1"
                values="16;38;16"
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values="16;38;16"
                dur="2.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </line>

            {/* Ambient Screen Waveform / Minimal Grid Geometry */}
            <path
              d="M32 30 Q 38 23, 44 28 T 56 26 T 68 28"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.6"
            >
              <animate
                attributeName="d"
                values="
                  M32 30 Q 38 23, 44 28 T 56 26 T 68 28;
                  M32 27 Q 38 31, 44 25 T 56 29 T 68 27;
                  M32 30 Q 38 23, 44 28 T 56 26 T 68 28
                "
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>

            {/* Screen Webcam Sensor */}
            <circle cx="50" cy="11.8" r="0.9" fill="#38bdf8" opacity="0.9" />

            {/* Laptop Base (Tapered Wedge in Perspective) */}
            <path
              d="M14 46 L86 46 L80 56 C79.5 57 78.5 57.5 77.2 57.5 L22.8 57.5 C21.5 57.5 20.5 57 20 56 L14 46 Z"
              stroke="url(#loaderLidGrad)"
              strokeWidth="1.8"
              fill="#090e1a"
            />

            {/* Keyboard Deck Groove */}
            <line
              x1="24"
              y1="48"
              x2="76"
              y2="48"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.4"
            />

            {/* Trackpad Accent with soft cyan glow */}
            <rect
              x="42"
              y="50.5"
              width="16"
              height="4.5"
              rx="1.2"
              fill="#38bdf8"
              opacity="0.45"
            />

            {/* Front Edge Breathing LED */}
            <circle cx="50" cy="56" r="1.2" fill="#38bdf8">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </motion.div>

      {/* Minimalist Progress Indicator */}
      <div className="mt-8 flex flex-col items-center">
        {/* Slender 2px Glowing Laser Track */}
        <div className="w-32 h-[2px] bg-primary/10 rounded-full overflow-hidden relative mb-3">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"
          />
        </div>

        {/* Minimalist Monospace Brand Telemetry */}
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono font-medium tracking-[0.25em] text-muted-foreground uppercase">
            LapKart
          </span>
        </div>
      </div>
    </div>
  );
}
