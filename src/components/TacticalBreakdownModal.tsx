import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Map, 
  Eye, 
  Radar, 
  Target, 
  Zap, 
  Shield, 
  Flame, 
  Clock, 
  TrendingUp, 
  Compass, 
  Maximize2, 
  Settings, 
  Play, 
  Activity,
  Crosshair,
  Volume2
} from "lucide-react";

export interface PlaystyleMetric {
  label: string;
  value: number; // 0 to 100
}

export interface HeatPoint {
  id: string;
  name: string;
  x: number; // % from left
  y: number; // % from top
  intensity: "high" | "medium" | "low";
  description: string;
  statText: string;
  phase?: "early" | "late";
}

export interface PlayerTacticalData {
  ign: string;
  name: string;
  role: string;
  primaryDrop: string;
  positioningStyle: string;
  survivalRate: string;
  avgEngagementRange: string;
  mapConfidence: string;
  playstyleMetrics: PlaystyleMetric[];
  heatPoints: HeatPoint[];
}

// Complete real-time strategic telemetry data for each player
export const PLAYER_TACTICAL_MAPS: Record<string, PlayerTacticalData> = {
  "CV_Slayer_IGL": {
    ign: "CV_Slayer_IGL",
    name: "Alex Thorne",
    role: "IGL / Mid-Ranger",
    primaryDrop: "Yasnaya Polyana & School Center",
    positioningStyle: "Central Rotation & Compound Fortification",
    survivalRate: "78.4%",
    avgEngagementRange: "150m",
    mapConfidence: "98% Optimum",
    playstyleMetrics: [
      { label: "Rotation Tactics", value: 98 },
      { label: "Combat Aggression", value: 72 },
      { label: "Utility Command", value: 95 },
      { label: "Stealth Dispersion", value: 60 },
      { label: "In-Match Adaptability", value: 92 }
    ],
    heatPoints: [
      { id: "p1_1", name: "School Core Area", x: 55, y: 40, intensity: "high", description: "Central circle anchor point used to command north-south rotations.", statText: "68% Rotation Win Rate", phase: "early" },
      { id: "p1_2", name: "Yasnaya Apartments", x: 73, y: 26, intensity: "high", description: "Secures early-mid game compound fortification lines.", statText: "4.2 K/D in Hold Actions", phase: "late" },
      { id: "p1_3", name: "Pochinki Ridges", x: 48, y: 55, intensity: "medium", description: "Scouts high-terrain lines during transition phases.", statText: "82% Safety Rotation", phase: "early" }
    ]
  },
  "CV_Mamba_Flick": {
    ign: "CV_Mamba_Flick",
    name: "Marcus Sterling",
    role: "Sniper / Entry",
    primaryDrop: "Sosnovka Military Base & South Bridges",
    positioningStyle: "Long-Range Overwatch & Bridge Blockade",
    survivalRate: "62.5%",
    avgEngagementRange: "310m",
    mapConfidence: "95% Optimum",
    playstyleMetrics: [
      { label: "Rotation Tactics", value: 65 },
      { label: "Combat Aggression", value: 88 },
      { label: "Utility Command", value: 50 },
      { label: "Stealth Dispersion", value: 85 },
      { label: "In-Match Adaptability", value: 80 }
    ],
    heatPoints: [
      { id: "p2_1", name: "Military Base Observatory", x: 52, y: 86, intensity: "high", description: "High-intensity sniper overwatch spot.", statText: "14 Snipe Knocks Scored", phase: "early" },
      { id: "p2_2", name: "South Island Bridge", x: 58, y: 75, intensity: "high", description: "Primary bridge choke blockade station.", statText: "8 Bridge Clamps Secured", phase: "late" },
      { id: "p2_3", name: "Mylta Power Siphon", x: 81, y: 56, intensity: "medium", description: "Long-range perimeter lines targeting coastal entries.", statText: "92% Accuracy Rating", phase: "early" }
    ]
  },
  "CV_Shadow_Duo": {
    ign: "CV_Shadow_Duo",
    name: "Lia Ramirez",
    role: "Assaulter / Roamer",
    primaryDrop: "Pochinki Downtown & Georgopol",
    positioningStyle: "Close-Quarter Battle & Direct Flanking",
    survivalRate: "71.0%",
    avgEngagementRange: "25m",
    mapConfidence: "91% Optimum",
    playstyleMetrics: [
      { label: "Rotation Tactics", value: 70 },
      { label: "Combat Aggression", value: 96 },
      { label: "Utility Command", value: 60 },
      { label: "Stealth Dispersion", value: 75 },
      { label: "In-Match Adaptability", value: 85 }
    ],
    heatPoints: [
      { id: "p3_1", name: "Pochinki Main Street", x: 46, y: 48, intensity: "high", description: "Hot zone for close-quarters room clearances.", statText: "12 CQB Room Clears", phase: "early" },
      { id: "p3_2", name: "Georgopol Containers", x: 20, y: 28, intensity: "high", description: "Agile flanking pathways to intercept inbound squads.", statText: "1v3 Clutch conversion (74%)", phase: "late" },
      { id: "p3_3", name: "Ruins Temple Center", x: 35, y: 45, intensity: "medium", description: "Dynamic mid-match stealth scouting perimeter.", statText: "5 Fast Ambush Kills", phase: "early" }
    ]
  },
  "CV_Alpha_Spectre": {
    ign: "CV_Alpha_Spectre",
    name: "Hiroshi Sato",
    role: "Anchor / Support",
    primaryDrop: "Severny Compound & Rozhok Edge",
    positioningStyle: "Support Overwatch & Compound Defense",
    survivalRate: "84.6%",
    avgEngagementRange: "80m",
    mapConfidence: "94% Optimum",
    playstyleMetrics: [
      { label: "Rotation Tactics", value: 88 },
      { label: "Combat Aggression", value: 52 },
      { label: "Utility Command", value: 99 },
      { label: "Stealth Dispersion", value: 80 },
      { label: "In-Match Adaptability", value: 88 }
    ],
    heatPoints: [
      { id: "p4_1", name: "Rozhok North Hill Compound", x: 50, y: 32, intensity: "high", description: "Fortified ridge support layout supplying coverage lines.", statText: "18 Revives Handed Safely", phase: "early" },
      { id: "p4_2", name: "Severny Safehouses", x: 48, y: 12, intensity: "medium", description: "Loot collection and medical fortification compound.", statText: "100% Core Loadout Sourcing", phase: "early" },
      { id: "p4_3", name: "Gatka Trenches Corridor", x: 32, y: 62, intensity: "high", description: "Low-ground flank cover defending low-resource circles.", statText: "440.5 Average Healing Dispensed", phase: "late" }
    ]
  },
  "ZIM_Tinashe": {
    ign: "ZIM_Tinashe",
    name: "Tinashe Chigumba",
    role: "Rusher / Frontline",
    primaryDrop: "Georgopol Docks & Pochinki Apts",
    positioningStyle: "High-Pressure Split-Line Compounds Breach",
    survivalRate: "59.2%",
    avgEngagementRange: "45m",
    mapConfidence: "93% Optimum",
    playstyleMetrics: [
      { label: "Rotation Tactics", value: 60 },
      { label: "Combat Aggression", value: 99 },
      { label: "Utility Command", value: 70 },
      { label: "Stealth Dispersion", value: 40 },
      { label: "In-Match Adaptability", value: 76 }
    ],
    heatPoints: [
      { id: "p5_1", name: "Georgopol North City", x: 18, y: 22, intensity: "high", description: "High-exposure frontline engagement lanes.", statText: "22 In-Match Entry Frags", phase: "early" },
      { id: "p5_2", name: "Pochinki Blocks", x: 49, y: 46, intensity: "high", description: "Rooftop infiltration and aggressive breach vectors.", statText: "8 Squad-Wipes Initiated", phase: "late" },
      { id: "p5_3", name: "School Stadium Courtyard", x: 56, y: 41, intensity: "medium", description: "Hyper-aggressive vertical assault zone.", statText: "310 Damage/Min Combat Pressure", phase: "early" }
    ]
  },
  "Onyx_Cap_Zero": {
    ign: "Onyx_Cap_Zero",
    name: "Takashi Kuro",
    role: "Assaulter / CQB",
    primaryDrop: "Novorepnoye Docks & Shelter Bunker",
    positioningStyle: "Area Denial & Urban Ambush Mechanics",
    survivalRate: "65.8%",
    avgEngagementRange: "95m",
    mapConfidence: "89% Optimum",
    playstyleMetrics: [
      { label: "Rotation Tactics", value: 82 },
      { label: "Combat Aggression", value: 75 },
      { label: "Utility Command", value: 78 },
      { label: "Stealth Dispersion", value: 90 },
      { label: "In-Match Adaptability", value: 81 }
    ],
    heatPoints: [
      { id: "p6_1", name: "Novorepnoye Harbor Crates", x: 77, y: 74, intensity: "high", description: "Ambush pathways and harbor shipping-crate chokes.", statText: "15 Shotgun Ambush Kills", phase: "early" },
      { id: "p6_2", name: "Shelter Sub Caves", x: 68, y: 44, intensity: "high", description: "Hidden underground layouts for unexpected flank counters.", statText: "94% Stealth Ambush Rating", phase: "late" },
      { id: "p6_3", name: "Yasnaya Outer Forest", x: 72, y: 28, intensity: "medium", description: "Edge-of-circle stealth ambush layouts.", statText: "100% Stealth Multiplies", phase: "early" }
    ]
  }
};

const renderInlineBold = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-amber-400 font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const renderEvaluationMarkdown = (text: string) => {
  if (!text) return null;
  return text.split("\n").map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("###")) {
      return (
        <h4 key={idx} className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2 mb-1 font-mono">
          {trimmed.replace(/^###\s*/, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <h4 key={idx} className="text-[10px] font-black text-white uppercase tracking-widest mt-1.5 mb-1 font-mono">
          {trimmed.replace(/\*\*/g, "")}
        </h4>
      );
    }
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      const content = trimmed.replace(/^[\*\-]\s*/, "");
      return (
        <div key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-300 font-sans pl-1.5 leading-relaxed py-0.5">
          <span className="text-[#ff001c] font-black mt-0.5 shrink-0">•</span>
          <span>{renderInlineBold(content)}</span>
        </div>
      );
    }
    if (trimmed === "") {
      return <div key={idx} className="h-1" />;
    }
    return (
      <p key={idx} className="text-[10px] text-zinc-400 font-sans leading-relaxed py-0.5">
        {renderInlineBold(trimmed)}
      </p>
    );
  });
};

interface TacticalBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerIgn: string;
}

export default function TacticalBreakdownModal({
  isOpen,
  onClose,
  playerIgn
}: TacticalBreakdownModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [activePreset, setActivePreset] = useState<"standard" | "aggressive" | "championship">("standard");
  const [selectedPoint, setSelectedPoint] = useState<HeatPoint | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<"all" | "early" | "late">("all");

  const [aiEvaluation, setAiEvaluation] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback map data
  const rawPlayerData = PLAYER_TACTICAL_MAPS[playerIgn] || PLAYER_TACTICAL_MAPS["CV_Slayer_IGL"];

  // Clear specific states on load or change
  useEffect(() => {
    setSelectedPoint(null);
    setSelectedPhase("all");
    setAiEvaluation("");
    setError(null);
  }, [playerIgn]);

  useEffect(() => {
    setAiEvaluation("");
    setError(null);
  }, [activePreset, selectedPhase]);

  if (!isOpen) return null;

  // Let's create dynamic points according to custom presets to simulate real-time mapping adjustment
  const getPlaystylePoints = (): HeatPoint[] => {
    const basePoints = rawPlayerData.heatPoints;
    if (activePreset === "standard") return basePoints;

    return basePoints.map((pt, index) => {
      // Modify offset locations and descriptions to indicate real-time simulation loading!
      if (activePreset === "aggressive") {
        return {
          ...pt,
          x: Math.max(10, Math.min(90, pt.x + (index % 2 === 0 ? 3 : -4))),
          y: Math.max(10, Math.min(90, pt.y + (index % 2 === 0 ? -3 : 5))),
          name: `${pt.name} (COMBAT ADJ)`,
          description: `Rerouted positioning vector under heavy early-game squad fire. High-risk sector.`,
          intensity: "high",
          statText: "92% Aggressive Exchange"
        };
      } else {
        // Championship Preset
        return {
          ...pt,
          x: Math.max(10, Math.min(90, pt.x + (index % 2 === 0 ? -4 : 2))),
          y: Math.max(10, Math.min(90, pt.y + (index % 2 === 0 ? 5 : -4))),
          name: `${pt.name} (TOURNEY CAP)`,
          description: `Supervised compound hold coordinates finalized during regional tier-1 grand championship.`,
          intensity: index === 0 ? "high" : "medium",
          statText: "WWCD Certified Hold"
        };
      }
    });
  };

  const currentPoints = getPlaystylePoints().filter(p => {
    if (selectedPhase === "all") return true;
    return p.phase === selectedPhase;
  });

  const handleTriggerRadarScan = () => {
    setIsScanning(true);
    setSelectedPoint(null);
    setTimeout(() => {
      setIsScanning(false);
      // Select the first point automatically as a highlight action!
      if (currentPoints.length > 0) {
        setSelectedPoint(currentPoints[0]);
      }
    }, 1800);
  };

  const runAiEvaluation = async () => {
    setIsEvaluating(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/heatmap-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerIgn: rawPlayerData.ign,
          role: rawPlayerData.role,
          primaryDrop: rawPlayerData.primaryDrop,
          positioningStyle: rawPlayerData.positioningStyle,
          activePreset,
          selectedPhase,
          metrics: rawPlayerData.playstyleMetrics,
          heatPoints: currentPoints
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status + " generating suggestions");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiEvaluation(data.evaluation || "No specific coaching insight was generated.");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to contact eSports Coach Server.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md">
        
        {/* Backdrop trigger */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          id="tactical-field-map-modal"
          className="bg-[#0b0c10] border border-zinc-900 rounded-2.5xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col z-10 text-left font-mono"
        >
          {/* Neon scan-line glow borders */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-650 via-[#ff001c] to-amber-500" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-zinc-800 to-red-650" />

          {/* TOP BAR BAR */}
          <div className="border-b border-zinc-900 p-4 flex justify-between items-center bg-zinc-950/80">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-red-950/40 border border-red-900/30 rounded-lg text-red-500 leading-none">
                <Compass className="animate-pulse" size={18} />
              </span>
              <div>
                <span className="text-[9px] text-[#ff001c] font-black tracking-widest uppercase block">GEOFENCED RADAR RECONNAISSANCE SYSTEMS</span>
                <h3 className="text-sm md:text-base font-black font-orbitron text-white tracking-wide uppercase flex items-center gap-2">
                  TACTICAL FIELD HEATMAP: {rawPlayerData.ign}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* MAIN TWO-COLUMN BODY CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-900 h-auto lg:h-[580px]">
            
            {/* LEFT PORTAL: THE ERANGEL RADAR MAP (7/12 spaces) */}
            <div className="lg:col-span-7 bg-[#050507] p-4 flex flex-col justify-between relative overflow-hidden select-none">
              
              {/* Tactical scanner status watermarks */}
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-extrabold pb-2 mb-2 border-b border-zinc-900/60 font-mono tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? "bg-amber-500 animate-ping" : "bg-red-500 animate-pulse"}`} />
                  <span>CHANNEL: ERANGEL_S9_AISTUDIO_98C</span>
                </div>
                <div>
                  LAT_SCALE: 8440_MTR | GPS_SYNC: OK
                </div>
              </div>

              {/* GAME PHASE FILTER TOGGLE */}
              <div className="bg-zinc-950/90 rounded-xl p-2 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3 font-mono shrink-0">
                <div className="flex items-center gap-1.5 pl-1">
                  <span className="text-[10px] text-zinc-400 font-black tracking-widest uppercase">GAME PHASE:</span>
                </div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  {[
                    { id: "all", label: "ALL PHASES", count: rawPlayerData.heatPoints.length },
                    { id: "early", label: "Early Game Rotations", count: rawPlayerData.heatPoints.filter(p => p.phase === "early").length },
                    { id: "late", label: "End Game Survival", count: rawPlayerData.heatPoints.filter(p => p.phase === "late").length },
                  ].map((phase) => (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => {
                        setSelectedPhase(phase.id as any);
                        setSelectedPoint(null);
                      }}
                      className={`flex-1 sm:flex-initial px-3 py-1 font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer text-[8px] flex items-center justify-center gap-1 border ${
                        selectedPhase === phase.id
                          ? "bg-[#ff001c]/15 text-[#ff001c] border-[#ff001c]/40 font-black shadow-[0_0_8px_rgba(255,0,28,0.15)]"
                          : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-500 hover:text-stone-300 border-zinc-800"
                      }`}
                    >
                      <span>{phase.label}</span>
                      <span className="text-[7.5px] opacity-75 font-mono">({phase.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CORE SVG MAP CONTAINER */}
              <div className="w-full aspect-[4/3] rounded-xl border border-zinc-900 bg-black/60 relative overflow-hidden flex items-center justify-center my-auto shadow-inner">
                
                {/* CYBER BACKGROUND CORRD SYSTEMS GRIDS */}
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                    {Array.from({ length: 64 }).map((_, index) => {
                      const row = Math.floor(index / 8);
                      const col = index % 8;
                      const cellAlpha = String.fromCharCode(65 + row); // A to H
                      const cellNum = col + 1;

                      return (
                        <div 
                          key={index} 
                          className="border-[0.5px] border-zinc-950/40 relative flex items-start justify-start p-1"
                        >
                          {col === 0 && (
                            <span className="text-[7px] text-zinc-700 font-extrabold absolute left-0.5 top-0.5">
                              {cellAlpha}
                            </span>
                          )}
                          {row === 0 && (
                            <span className="text-[7px] text-zinc-700 font-extrabold absolute right-0.5 top-0.5">
                              {cellNum}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DYNAMIC SWEEPING RADAR SCAN LINE */}
                {(isScanning || !isScanning) && (
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r from-red-650/0 via-red-650/4 to-red-650/0 origin-center pointer-events-none z-10`}
                    style={{
                      transform: `rotate(${isScanning ? "360deg" : "155deg"})`,
                      transition: isScanning ? "transform 1.8s linear" : "transform 15s linear",
                      animation: isScanning ? "spin 1.8s linear infinite" : "none"
                    }}
                  />
                )}

                {/* THE ERANGEL MAP CUSTOM SVG VECTOR DESIGN */}
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full text-zinc-600 pointer-events-none"
                  style={{ opacity: isScanning ? 0.35 : 0.85, transition: "opacity 0.4s" }}
                >
                  {/* Rivers / Ocean background implicitly black */}
                  
                  {/* MAIN ISLAND LANDMASS (North Island) */}
                  <path
                    d="M 60,60 
                       C 90,40 180,30 220,50 
                       C 270,70 330,60 350,90 
                       C 370,120 380,180 340,210 
                       C 300,230 280,240 250,225
                       C 220,210 200,210 180,225
                       C 160,240 120,235 90,210
                       C 60,185 40,160 50,120
                       C 60,80 40,80 60,60 Z"
                    fill="#15171d"
                    stroke="#222"
                    strokeWidth="1.5"
                  />

                  {/* SOSNOVKA ISLAND LANDMASS (South Island) */}
                  <path
                    d="M 140,250 
                       C 180,242 220,242 260,250 
                       C 285,255 290,280 270,290 
                       C 240,298 160,298 130,290 
                       C 115,280 120,255 140,250 Z"
                    fill="#15171d"
                    stroke="#222"
                    strokeWidth="1.5"
                  />

                  {/* CONNECTING BRIDGES TO SOUTH ISLAND */}
                  {/* West Bridge */}
                  <line x1="170" y1="226" x2="170" y2="251" stroke="#333" strokeWidth="2.5" />
                  {/* East Bridge */}
                  <line x1="230" y1="225" x2="230" y2="251" stroke="#333" strokeWidth="2.5" />

                  {/* LABELED MAJOR TOWNS */}
                  <g fill="#444" fontSize="7" fontWeight="bold">
                    {/* Yasnaya Polyana */}
                    <rect x="272" y="70" width="35" height="10" rx="1.5" fill="black/40" />
                    <text x="275" y="77" fill="#888">YASNAYA</text>
                    
                    {/* School */}
                    <rect x="205" y="115" width="30" height="10" rx="1.5" fill="black/40" />
                    <text x="209" y="122" fill="#888">SCHOOL</text>

                    {/* Pochinki */}
                    <rect x="175" y="155" width="32" height="10" rx="1.5" fill="black/40" />
                    <text x="178" y="162" fill="#888">POCHINKI</text>

                    {/* Military Base */}
                    <rect x="170" y="265" width="45" height="10" rx="1.5" fill="black/40" />
                    <text x="174" y="272" fill="#888">MILITARY BASE</text>

                    {/* Georgopol */}
                    <rect x="65" y="90" width="38" height="10" rx="1.5" fill="black/40" />
                    <text x="68" y="97" fill="#888">GEORGOPOL</text>

                    {/* Novorepnoye */}
                    <rect x="250" y="222" width="40" height="10" rx="1.5" fill="black/40" />
                    <text x="253" y="229" fill="#888">NOVOREPNOYE</text>

                    {/* Rozhok */}
                    <rect x="185" y="85" width="30" height="10" rx="1.5" fill="black/40" />
                    <text x="189" y="92" fill="#888">ROZHOK</text>
                  </g>
                </svg>

                {/* PULSING HEATMAP OVERLAYS AND INTERACTIVE PLACEMENT BUTTONS */}
                {!isScanning && (
                  <>
                    {currentPoints.map((pt) => {
                      const isActive = selectedPoint?.id === pt.id;
                      const intensityColor = pt.intensity === "high" ? "bg-red-500 shadow-red-500/80" : "bg-amber-500 shadow-amber-500/80";
                      const intensityRing = pt.intensity === "high" ? "border-red-500/40" : "border-amber-500/40";

                      return (
                        <div
                          key={pt.id}
                          className="absolute pointer-events-auto cursor-pointer group z-20"
                          style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%, -50%)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPoint(pt);
                          }}
                        >
                          {/* Pulsing ring */}
                          <span className={`absolute -inset-2.5 rounded-full border border-dashed animate-pulse ${intensityRing} ${isActive ? "scale-125 opacity-100 border-white/60" : "scale-100 opacity-65"}`} />
                          
                          {/* Inner glowing core */}
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white/40 shadow-[0_0_12px] transition-all transform hover:scale-135 ${intensityColor} ${isActive ? "scale-125 ring-2 ring-white" : ""}`}>
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                          </div>

                          {/* Hover Tooltip name tags */}
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#09090b] border border-zinc-800 text-[9px] font-black tracking-wide text-white px-1.5 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 whitespace-nowrap uppercase">
                            {pt.name}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Interactive map location tooltip box */}
                {selectedPoint && !isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-3 left-3 right-3 bg-black/95 p-3 rounded-lg border border-[#ff001c]/40 shadow-2xl backdrop-blur-md text-left z-20 pointer-events-auto"
                  >
                    <div className="flex justify-between items-start mb-1 border-b border-zinc-900 pb-1">
                      <h5 className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <span>{selectedPoint.name} DETAILED DATA</span>
                      </h5>
                      <span className="text-[9px] bg-red-950 px-1 text-[#ff001c] font-black tracking-tight rounded uppercase">
                        {selectedPoint.statText}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-300 font-sans leading-relaxed">
                      {selectedPoint.description}
                    </p>
                  </motion.div>
                )}

                {/* Scanning Backdrop HUD */}
                {isScanning && (
                  <div className="absolute inset-0 bg-red-950/10 flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                    <span className="text-sm font-Orbitron font-black text-[#ff001c] tracking-widest uppercase animate-pulse">
                      🚨 ACTIVE RADAR SCAN IN PROGRESS 🚨
                    </span>
                    <span className="text-[9px] text-[#ff001c]/60 max-w-xs font-mono">
                      Querying local SQLite database segments... verifying historical match spatial positioning logbooks.
                    </span>
                  </div>
                )}

              </div>

              {/* ACTION BUTTON CONSOLES */}
              <div className="flex justify-between items-center bg-zinc-950/85 p-3 rounded-lg border border-zinc-900 gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleTriggerRadarScan}
                  disabled={isScanning}
                  className={`px-3 py-2 bg-[#ff001c] hover:bg-red-700 disabled:bg-zinc-900 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-transparent shadow-[0_0_15px_rgba(255,0,28,0.2)] ${isScanning ? "animate-pulse" : "active:scale-95"}`}
                >
                  <Radar size={12} className={isScanning ? "animate-spin" : ""} />
                  <span>{isScanning ? "SCANNING ERANGEL..." : "TRIGGER RADAR SCAN"}</span>
                </button>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 text-[10px] rounded border uppercase font-extrabold cursor-pointer transition-all ${showGrid ? "bg-zinc-900 border-zinc-800 text-white" : "border-zinc-900 text-zinc-550"}`}
                    title="Toggle GPS Grid Map Coordinates"
                  >
                    GRID
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT PORTAL: PLAYSTYLE PARAMETERS & ENGAGEMENT METRICS (5/12 spaces) */}
            <div className="lg:col-span-5 p-5 flex flex-col justify-between bg-[#0b0c10]/40 overflow-y-auto custom-scrollbar h-full lg:max-h-[580px]">
              
              <div className="space-y-4">
                {/* Profile Overview Card */}
                <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-900 space-y-1.5 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-[#ff001f]/10 text-[#ff001c] border border-[#ff001c]/20 px-1.5 py-0.2 rounded font-black tracking-widest text-[8px] uppercase">
                      ACTIVE SQUAD VERIFICATION
                    </span>
                    <span className="text-zinc-550 font-mono text-[9px]">{rawPlayerData.avgEngagementRange} ENGAGEMENT</span>
                  </div>
                  <h4 className="text-sm font-black font-orbitron text-white leading-none">
                    {rawPlayerData.name}
                  </h4>
                  <p className="text-[10px] text-zinc-450 uppercase tracking-widest font-bold">
                    Primary Drop: <span className="text-[#ff001c] font-black font-mono">{rawPlayerData.primaryDrop}</span>
                  </p>
                </div>

                {/* Simulation Combat Mode presets */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase block pb-0.5">LOAD COMBAT MATCH MODEL REGIME:</span>
                  <div className="grid grid-cols-3 gap-1.5 bg-black/95 p-1 rounded-lg border border-zinc-900">
                    {[
                      { key: "standard", label: "SCRIMS" },
                      { key: "aggressive", label: "HOT DROPS" },
                      { key: "championship", label: "GRAND FINALS" }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => {
                          setActivePreset(mode.key as any);
                          setSelectedPoint(null);
                        }}
                        className={`py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer text-center ${
                          activePreset === mode.key
                            ? "bg-[#ff001c]/15 text-[#ff001c] border border-[#ff001c]/30 font-black shadow-[0_0_8px_rgba(255,0,28,0.2)]"
                            : "text-zinc-500 hover:text-stone-300"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Core tactical telemetry specs listing */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase block">GEOLATEST PERFORMANCE DIAGNOSTICS:</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2.5 bg-black/40 border border-zinc-900 rounded-lg space-y-0.5">
                      <span className="text-[8px] text-zinc-550 uppercase tracking-wide block">Rotation Pattern:</span>
                      <strong className="text-stone-200">{rawPlayerData.positioningStyle}</strong>
                    </div>

                    <div className="p-2.5 bg-black/40 border border-zinc-900 rounded-lg space-y-0.5">
                      <span className="text-[8px] text-zinc-550 uppercase tracking-wide block">Match Confidence:</span>
                      <strong className="text-emerald-400 font-extrabold">{rawPlayerData.mapConfidence}</strong>
                    </div>

                    <div className="p-2.5 bg-black/40 border border-zinc-900 rounded-lg space-y-0.5 col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] text-zinc-550 uppercase tracking-wide block">Drop Survival success rate:</span>
                        <strong className="text-white font-mono">{rawPlayerData.survivalRate} WWII Ratio</strong>
                      </div>
                      <span className="text-[10px] text-stone-200 bg-red-950/30 p-1 px-2 border border-red-900/30 rounded font-black font-mono">
                        🔥 HOT DROP OK
                      </span>
                    </div>

                  </div>
                </div>

                {/* Dynamic Playstyle metrics Bars visualizer */}
                <div className="space-y-2 pt-1 border-t border-zinc-900/60">
                  <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase block">RADAR RECON METRIC INDEX:</span>
                  
                  <div className="space-y-2 bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                    {rawPlayerData.playstyleMetrics.map((met, idx) => {
                      return (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-stone-300 font-semibold">{met.label}</span>
                            <span className="text-red-500 font-bold">{met.value}/100</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${met.value}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05 }}
                              className="h-full bg-gradient-to-r from-red-650 to-amber-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 🧠 AI POSITIONING EVALUATION SECTION */}
                <div className="space-y-2 pt-3 border-t border-zinc-900/60 font-mono">
                  <span className="text-[9px] text-zinc-500 font-black tracking-widest uppercase block flex items-center gap-1.5">
                    <Zap size={11} className="text-[#ff001c] animate-pulse" />
                    <span>AI POSITIONING STIPULATIONS (GEMINI)</span>
                  </span>

                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 space-y-3">
                    {!aiEvaluation ? (
                      <div className="space-y-2 text-center py-1">
                        <p className="text-[9px] text-zinc-400 font-mono leading-relaxed">
                          Compute custom spatial coaching feedback based on recent Erangel rotation maps, landing patterns, and strategy modes.
                        </p>
                        <button
                          type="button"
                          onClick={runAiEvaluation}
                          disabled={isEvaluating}
                          className="w-full py-2 bg-gradient-to-r from-[#ff001c]/10 to-[#ff001c]/20 hover:from-[#ff001c]/20 hover:to-[#ff001c]/30 disabled:from-zinc-950 disabled:to-zinc-950 text-[#ff001c] hover:text-white disabled:text-zinc-600 border border-[#ff001c]/25 hover:border-[#ff001c]/50 disabled:border-zinc-900 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          {isEvaluating ? (
                            <>
                              <span className="w-2.5 h-2.5 border-2 border-[#ff001c] border-t-transparent rounded-full animate-spin" />
                              <span>COACH SCANNING RADAR LOGS...</span>
                            </>
                          ) : (
                            <>
                              <span>🧠 EVALUATE HEATMAP POSITIONING</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="bg-black/30 p-3 rounded-lg border border-zinc-900/80 max-h-[220px] overflow-y-auto custom-scrollbar">
                          {renderEvaluationMarkdown(aiEvaluation)}
                        </div>
                        <div className="flex justify-between items-center gap-2 border-t border-zinc-900/60 pt-2.5">
                          <span className="text-[8px] text-emerald-400 font-extrabold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <span>COACH ANALYSIS DEPLOYED</span>
                          </span>
                          <button
                            type="button"
                            onClick={runAiEvaluation}
                            disabled={isEvaluating}
                            className="bg-zinc-900 hover:bg-zinc-800 text-[8px] text-stone-300 font-black px-2.5 py-1 rounded border border-zinc-800 transition-colors uppercase cursor-pointer"
                          >
                            {isEvaluating ? "RE-CHECKING..." : "RE-EVALUATE"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {error && (
                      <p className="text-[9px] text-[#ff001c] font-black text-center mt-1 bg-red-950/20 p-1.5 rounded border border-[#ff001c]/20">
                        🚨 ERROR: {error}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Status footer information memo */}
              <div className="text-[9px] text-zinc-550 font-sans border-t border-zinc-900/80 pt-3 leading-relaxed flex items-start gap-1.5 select-none font-bold mt-4">
                <span className="p-0.5 bg-red-950 border border-red-900/30 text-[#ff001c] rounded leading-none shrink-0 font-bold uppercase text-[7.5px]">
                  MEMO
                </span>
                <p>
                  Telemetry compiled from local SQL database logs & past PUBG 2026 championships. Click on the heat indicators directly on the map coordinates grid on the left to read tactical hotspot details.
                </p>
              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
