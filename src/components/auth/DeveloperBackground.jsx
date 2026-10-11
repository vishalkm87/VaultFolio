import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * DeveloperBackground
 * An innovative, monochromatic, text-free animated SVG background
 * symbolizing web development and modern systems engineering.
 * Dynamically adjusts contrast for both Dark and Light themes:
 * - Event Loop orbital rings with counter-rotation
 * - Flowing data highway streams & packet pulses
 * - Geometric code syntax symbols (< />, { }, >_, //)
 * - Distributed AST tree nodes & circuit traces
 * - Tech grid with glowing intersection points and framing crosshairs
 */
export const DeveloperBackground = () => {
  const { darkMode } = useTheme();

  // Color tokens adapt automatically based on active theme
  const strokeColor = darkMode ? '#ffffff' : '#0f172a';
  const secondaryStroke = darkMode ? '#a1a1aa' : '#475569';
  const gridDotColor = darkMode ? '#ffffff' : '#0f172a';
  const gridDotOpacity = darkMode ? 0.15 : 0.08;
  const gridLineOpacity = darkMode ? 0.035 : 0.04;
  const glowNodeColor = darkMode ? '#ffffff' : '#2563eb';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base gradient adapting to dark or light themes */}
          <linearGradient id="devBg" x1="0%" y1="0%" x2="100%" y2="100%">
            {darkMode ? (
              <>
                <stop offset="0%" stopColor="#09090b" />
                <stop offset="40%" stopColor="#0f0f13" />
                <stop offset="70%" stopColor="#141419" />
                <stop offset="100%" stopColor="#08080a" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="var(--bg-canvas, #f8fafc)" />
                <stop offset="45%" stopColor="var(--bg-canvas, #f1f5f9)" />
                <stop offset="85%" stopColor="var(--bg-subtle, #e2e8f0)" />
                <stop offset="100%" stopColor="var(--bg-canvas, #f8fafc)" />
              </>
            )}
          </linearGradient>

          {/* Radial spotlight centered behind vault card */}
          <radialGradient id="centerSpotlight" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={darkMode ? '#ffffff' : '#000000'} stopOpacity={darkMode ? '0.08' : '0.03'} />
            <stop offset="40%" stopColor={darkMode ? '#71717a' : '#64748b'} stopOpacity={darkMode ? '0.03' : '0.015'} />
            <stop offset="100%" stopColor={darkMode ? '#000000' : '#ffffff'} stopOpacity="0" />
          </radialGradient>

          {/* Secondary ambient glow */}
          <radialGradient id="ambientOrb" cx="75%" cy="30%" r="45%">
            <stop offset="0%" stopColor={darkMode ? '#ffffff' : '#2563eb'} stopOpacity={darkMode ? '0.06' : '0.025'} />
            <stop offset="60%" stopColor={darkMode ? '#27272a' : '#94a3b8'} stopOpacity={darkMode ? '0.015' : '0.008'} />
            <stop offset="100%" stopColor={darkMode ? '#000000' : '#ffffff'} stopOpacity="0" />
          </radialGradient>

          {/* Dynamic strokes */}
          <linearGradient id="silverTrace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={darkMode ? '0.45' : '0.35'} />
            <stop offset="50%" stopColor={secondaryStroke} stopOpacity={darkMode ? '0.2' : '0.15'} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={darkMode ? '0.06' : '0.04'} />
          </linearGradient>

          <linearGradient id="streamPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
            <stop offset="30%" stopColor={strokeColor} stopOpacity={darkMode ? '0.45' : '0.35'} />
            <stop offset="50%" stopColor={strokeColor} stopOpacity={darkMode ? '0.85' : '0.65'} />
            <stop offset="70%" stopColor={secondaryStroke} stopOpacity={darkMode ? '0.35' : '0.25'} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>

          {/* Blueprint Engineering Grid */}
          <pattern id="devGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={strokeColor} strokeWidth="0.75" strokeOpacity={gridLineOpacity} />
            <circle cx="50" cy="50" r="0.8" fill={gridDotColor} fillOpacity={gridDotOpacity} />
          </pattern>

          {/* High-density dot matrix pattern */}
          <pattern id="dotField" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.9" fill={gridDotColor} fillOpacity={gridDotOpacity * 0.7} />
          </pattern>

          {/* Node Glow Filter */}
          <filter id="devGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>{`
            @keyframes spinClockwise {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spinCounter {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes waveFlowForward {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -1000; }
            }
            @keyframes waveFlowReverse {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 1000; }
            }
            @keyframes pulseBreathing {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.9; transform: scale(1.2); }
            }
            @keyframes floatDriftA {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-12px, -18px); }
            }
            @keyframes floatDriftB {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(15px, -14px); }
            }
            @keyframes blinkCursor {
              0%, 45% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }

            .orbit-loop-1 {
              transform-origin: 800px 450px;
              animation: spinClockwise 75s linear infinite;
            }
            .orbit-loop-2 {
              transform-origin: 800px 450px;
              animation: spinCounter 55s linear infinite;
            }
            .orbit-loop-3 {
              transform-origin: 800px 450px;
              animation: spinClockwise 40s linear infinite;
            }
            .data-packet-stream {
              stroke-dasharray: 12 28;
              animation: waveFlowForward 24s linear infinite;
            }
            .data-packet-stream-rev {
              stroke-dasharray: 10 32;
              animation: waveFlowReverse 30s linear infinite;
            }
            .pulsing-dev-node {
              animation: pulseBreathing 4s ease-in-out infinite;
              transform-origin: center;
            }
            .float-element-a {
              animation: floatDriftA 9s ease-in-out infinite;
            }
            .float-element-b {
              animation: floatDriftB 11s ease-in-out infinite;
            }
            .cursor-blink {
              animation: blinkCursor 1.2s step-end infinite;
            }
          `}</style>
        </defs>

        {/* 1. Base Canvas */}
        <rect width="1600" height="900" fill="url(#devBg)" />

        {/* 2. Ambient Spotlights */}
        <rect width="1600" height="900" fill="url(#centerSpotlight)" />
        <rect width="1600" height="900" fill="url(#ambientOrb)" />

        {/* 3. Tech Architecture Grid & Micro-Dot Matrix */}
        <rect width="1600" height="900" fill="url(#devGrid)" />
        <rect x="0" y="0" width="1600" height="900" fill="url(#dotField)" />

        {/* 4. Precision Blueprint Corner Framing Brackets */}
        <g stroke={strokeColor} strokeWidth="1.4" opacity={darkMode ? 0.3 : 0.25}>
          {/* Top-Left */}
          <path d="M 40 56 L 64 56" />
          <path d="M 56 40 L 56 64" />
          {/* Top-Right */}
          <path d="M 1560 56 L 1536 56" />
          <path d="M 1544 40 L 1544 64" />
          {/* Bottom-Left */}
          <path d="M 40 844 L 64 844" />
          <path d="M 56 860 L 56 836" />
          {/* Bottom-Right */}
          <path d="M 1560 844 L 1536 844" />
          <path d="M 1544 860 L 1544 836" />
        </g>

        {/* 5. Center-Stage: The Event Loop & Architecture Orbital System */}
        {/* Center: (800, 450) */}
        <g className="orbit-loop-1" opacity={darkMode ? 0.4 : 0.3}>
          {/* Outer Event Loop Cycle Ring */}
          <circle cx="800" cy="450" r="380" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="16 28 4 28" />
          <circle cx="1180" cy="450" r="4.5" fill={glowNodeColor} filter="url(#devGlow)" />
          <circle cx="420" cy="450" r="3.5" fill={secondaryStroke} />
          <circle cx="800" cy="830" r="3.5" fill={secondaryStroke} />
          <circle cx="800" cy="70" r="4" fill={glowNodeColor} filter="url(#devGlow)" />
        </g>

        <g className="orbit-loop-2" opacity={darkMode ? 0.32 : 0.24}>
          {/* Middle Runtime / Compiler Ring */}
          <circle cx="800" cy="450" r="280" fill="none" stroke={secondaryStroke} strokeWidth="1.3" strokeDasharray="32 20 6 20" />
          <circle cx="998" cy="252" r="4" fill={glowNodeColor} filter="url(#devGlow)" />
          <circle cx="602" cy="648" r="3" fill={strokeColor} />
          <circle cx="602" cy="252" r="3.5" fill={secondaryStroke} />
          <circle cx="998" cy="648" r="4" fill={glowNodeColor} filter="url(#devGlow)" />
        </g>

        <g className="orbit-loop-3" opacity={darkMode ? 0.25 : 0.18}>
          {/* Inner Core Engine Ring */}
          <circle cx="800" cy="450" r="190" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="8 12" />
          <circle cx="800" cy="260" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" />
          <circle cx="800" cy="640" r="3" fill={secondaryStroke} />
          <circle cx="990" cy="450" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" />
          <circle cx="610" cy="450" r="3" fill={secondaryStroke} />
        </g>

        {/* 6. Sinuous Data Highway Waves (Full-Stack Data Streams) */}
        <g opacity={darkMode ? 0.45 : 0.35}>
          {/* Primary wave */}
          <path
            d="M -100 680 C 320 680, 520 280, 880 340 C 1240 400, 1380 180, 1720 220"
            fill="none"
            stroke="url(#streamPulseGrad)"
            strokeWidth="2"
          />
          {/* Secondary counter-harmonic wave */}
          <path
            d="M -100 240 C 360 220, 560 620, 920 560 C 1280 500, 1420 720, 1720 680"
            fill="none"
            stroke="url(#silverTrace)"
            strokeWidth="1.4"
            opacity="0.65"
          />
          {/* Flowing animated packet streams */}
          <path
            d="M -100 680 C 320 680, 520 280, 880 340 C 1240 400, 1380 180, 1720 220"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            className="data-packet-stream"
            opacity={darkMode ? 0.9 : 0.75}
          />
          <path
            d="M -100 240 C 360 220, 560 620, 920 560 C 1280 500, 1420 720, 1720 680"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.4"
            className="data-packet-stream-rev"
            opacity={darkMode ? 0.75 : 0.6}
          />
        </g>

        {/* 7. Innovative Web Developer Geometry (Clean Minimalist Symbols - NO TEXT) */}
        {/* Floating Developer Symbol 1 (Top Left): Code Tag Bracket < / > */}
        <g className="float-element-a" opacity={darkMode ? 0.55 : 0.45}>
          {/* Opening < */}
          <path
            d="M 230 180 L 195 210 L 230 240"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Slash / */}
          <line
            x1="250"
            y1="244"
            x2="270"
            y2="176"
            stroke={secondaryStroke}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Closing > */}
          <path
            d="M 290 180 L 325 210 L 290 240"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glowing Vertex Node */}
          <circle cx="260" cy="210" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" className="pulsing-dev-node" />
          {/* Bus connection line to AST tree */}
          <line x1="325" y1="210" x2="420" y2="210" stroke="url(#silverTrace)" strokeWidth="1.2" strokeDasharray="3 6" />
          <circle cx="420" cy="210" r="3" fill={secondaryStroke} />
        </g>

        {/* Floating Developer Symbol 2 (Bottom Left): Curly Braces { } (Object / JSON / Functions) */}
        <g className="float-element-b" opacity={darkMode ? 0.5 : 0.4}>
          {/* Left Brace { */}
          <path
            d="M 260 680 C 240 680, 240 705, 225 710 C 240 715, 240 740, 260 740"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Middle node */}
          <circle cx="280" cy="710" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" className="pulsing-dev-node" />
          {/* Right Brace } */}
          <path
            d="M 300 680 C 320 680, 320 705, 335 710 C 320 715, 320 740, 300 740"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Connection line to network */}
          <line x1="280" y1="710" x2="280" y2="640" stroke="url(#silverTrace)" strokeWidth="1.2" strokeDasharray="4 6" />
          <circle cx="280" cy="640" r="3" fill={strokeColor} />
        </g>

        {/* Floating Developer Symbol 3 (Top Right): Terminal Command Prompt Chevron >_ with blinking cursor */}
        <g className="float-element-b" opacity={darkMode ? 0.55 : 0.45}>
          {/* Command prompt chevron > */}
          <path
            d="M 1320 180 L 1348 205 L 1320 230"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Underscore cursor _ (Blinking) */}
          <line
            x1="1362"
            y1="230"
            x2="1390"
            y2="230"
            stroke={strokeColor}
            strokeWidth="3.6"
            strokeLinecap="round"
            className="cursor-blink"
          />
          {/* Terminal node connect */}
          <line x1="1348" y1="205" x2="1260" y2="205" stroke="url(#silverTrace)" strokeWidth="1.2" strokeDasharray="3 6" />
          <circle cx="1260" cy="205" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" />
        </g>

        {/* Floating Developer Symbol 4 (Bottom Right): Logic / Binary Matrix Nodes (Tree & Branch) */}
        <g className="float-element-a" opacity={darkMode ? 0.5 : 0.4}>
          {/* Root node */}
          <circle cx="1320" cy="720" r="5.5" fill={glowNodeColor} filter="url(#devGlow)" className="pulsing-dev-node" />
          {/* Branch lines (AST / Git DAG) */}
          <line x1="1320" y1="720" x2="1270" y2="670" stroke="url(#silverTrace)" strokeWidth="1.6" />
          <line x1="1320" y1="720" x2="1370" y2="670" stroke="url(#silverTrace)" strokeWidth="1.6" />
          <line x1="1320" y1="720" x2="1320" y2="780" stroke="url(#silverTrace)" strokeWidth="1.6" />
          {/* Branch nodes */}
          <circle cx="1270" cy="670" r="4" fill={strokeColor} />
          <circle cx="1370" cy="670" r="4" fill={secondaryStroke} />
          <circle cx="1320" cy="780" r="4.5" fill={glowNodeColor} filter="url(#devGlow)" />
          {/* Sub-branch */}
          <line x1="1270" y1="670" x2="1230" y2="670" stroke="url(#silverTrace)" strokeWidth="1.2" strokeDasharray="2 4" />
          <circle cx="1230" cy="670" r="3" fill={secondaryStroke} />
        </g>

        {/* 8. Micro Constellation Network */}
        <g opacity={darkMode ? 0.38 : 0.28} stroke={strokeColor} strokeWidth="1">
          <line x1="480" y1="360" x2="560" y2="310" />
          <line x1="560" y1="310" x2="620" y2="370" />
          <circle cx="480" cy="360" r="3" fill={strokeColor} />
          <circle cx="560" cy="310" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" />
          <circle cx="620" cy="370" r="3" fill={secondaryStroke} />

          <line x1="1040" y1="580" x2="1120" y2="540" />
          <line x1="1120" y1="540" x2="1180" y2="610" />
          <circle cx="1040" cy="580" r="3" fill={secondaryStroke} />
          <circle cx="1120" cy="540" r="3.5" fill={glowNodeColor} filter="url(#devGlow)" />
          <circle cx="1180" cy="610" r="3" fill={strokeColor} />
        </g>
      </svg>
    </div>
  );
};

export default DeveloperBackground;
