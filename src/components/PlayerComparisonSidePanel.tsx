import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Sliders, 
  Trophy, 
  Target, 
  Flame, 
  Activity, 
  Shield, 
  Award, 
  TrendingUp, 
  User, 
  Sparkles, 
  Zap, 
  Heart, 
  Info,
  Clock,
  ArrowLeftRight,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from "recharts";

// PlayerStats definition aligned with RosterPlayerComparison
export interface PlayerComparisonStats {
  id: string;
  ign: string;
  name: string;
  avatar: string;
  role: string;
  jerseyNumber: string;
  bio: string;
  kd: number;
  kills: number;
  assists: number;
  damage: number;
  revives: number;
  knockdowns: number;
  matchesPlayed: number;
  wins: number;
  averagePlacement: number;
  survivalMinutes: number;
  mvpAwards: number;
  regionalRank: number;
  achievements: string[];
}

interface PlayerComparisonSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  comparePlayerA: string;
  setComparePlayerA: (ign: string) => void;
  comparePlayerB: string;
  setComparePlayerB: (ign: string) => void;
  onAlertMessage?: (msg: string) => void;
}

export default function PlayerComparisonSidePanel({
  isOpen,
  onClose,
  comparePlayerA,
  setComparePlayerA,
  comparePlayerB,
  setComparePlayerB,
  onAlertMessage
}: PlayerComparisonSidePanelProps) {
  const [players, setPlayers] = useState<PlayerComparisonStats[]>([]);
  const [activeReport, setActiveReport] = useState<string | null>(null);

  // Load and merge stats from localStorage or defaults
  useEffect(() => {
    const defaultStatsMap: PlayerComparisonStats[] = [
      {
        id: "CV-PL-209",
        ign: "CV_Slayer_IGL",
        name: "Alex Thorne",
        avatar: "🎯",
        role: "IGL / Mid-Ranger",
        jerseyNumber: "07",
        bio: "The seasoned cornerstone of CV eSports. Alex is renowned for high-stress final circle tactical rotations and flawless squad utility cohesion.",
        kd: 4.82,
        kills: 145,
        assists: 42,
        damage: 28900,
        revives: 24,
        knockdowns: 87,
        matchesPlayed: 45,
        wins: 18,
        averagePlacement: 3.4,
        survivalMinutes: 24.2,
        mvpAwards: 8,
        regionalRank: 1,
        achievements: ["Veteran Commander", "Circle Edge Strategist", "WWCD Lead Master"]
      },
      {
        id: "CV-PL-314",
        ign: "CV_Mamba_Flick",
        name: "Marcus Sterling",
        avatar: "🐍",
        role: "Sniper / Entry",
        jerseyNumber: "24",
        bio: "A venomous sniper with pixel-perfect tracking. Marcus holds regional squad records for long-range knocks and entry damage output.",
        kd: 4.15,
        kills: 184,
        assists: 19,
        damage: 34500,
        revives: 8,
        knockdowns: 110,
        matchesPlayed: 45,
        wins: 18,
        averagePlacement: 3.4,
        survivalMinutes: 21.8,
        mvpAwards: 12,
        regionalRank: 2,
        achievements: ["Elite Sniper Award 2026", "22 Miramar Single Match Record", "Headshot Champion"]
      },
      {
        id: "CV-PL-105",
        ign: "CV_Shadow_Duo",
        name: "Lia Ramirez",
        avatar: "⚡",
        role: "Assaulter / Roamer",
        jerseyNumber: "10",
        bio: "An incredibly agile close-quarters specialist. Lia's rapid defensive flanking maneuvers achieve the squad's highest 1v3 clutch conversion rate.",
        kd: 5.10,
        kills: 120,
        assists: 49,
        damage: 22400,
        revives: 29,
        knockdowns: 62,
        matchesPlayed: 48,
        wins: 16,
        averagePlacement: 3.9,
        survivalMinutes: 22.5,
        mvpAwards: 5,
        regionalRank: 4,
        achievements: ["Sovereign Champion MVP", "Clutch Specialist S9", "CQB Room Clearer"]
      },
      {
        id: "CV-PL-111",
        ign: "CV_Alpha_Spectre",
        name: "Hiroshi Sato",
        avatar: "🛡️",
        role: "Anchor / Support",
        jerseyNumber: "11",
        bio: "The defensive protector. Hiroshi excels under extreme resource scarcity, managing map fortification boundaries and supplying medical logistics.",
        kd: 3.95,
        kills: 95,
        assists: 68,
        damage: 19800,
        revives: 42,
        knockdowns: 55,
        matchesPlayed: 45,
        wins: 18,
        averagePlacement: 3.2,
        survivalMinutes: 25.1,
        mvpAwards: 6,
        regionalRank: 6,
        achievements: ["Defensive Aegis Winner", "Infinite Revive Specialist", "15-0 Flawless Combat Log"]
      },
      {
        id: "CV-PL-441",
        ign: "ZIM_Tinashe",
        name: "Tinashe Chigumba",
        avatar: "⚔️",
        role: "Rusher / Frontline",
        jerseyNumber: "99",
        bio: "Zimbabwe's paramount hyper-aggressive attacker. Notoriously brave frontline entries that split target lines in the highest-ranked regional lobbies.",
        kd: 3.76,
        kills: 158,
        assists: 38,
        damage: 31200,
        revives: 18,
        knockdowns: 98,
        matchesPlayed: 42,
        wins: 14,
        averagePlacement: 4.1,
        survivalMinutes: 23.9,
        mvpAwards: 9,
        regionalRank: 3,
        achievements: ["Sovereign Champion S4", "Regional Bridge Blocker", "Frontline Spearhead"]
      },
      {
        id: "CV-PL-992",
        ign: "Onyx_Cap_Zero",
        name: "Takashi Kuro",
        avatar: "💀",
        role: "Assaulter / CQB",
        jerseyNumber: "00",
        bio: "Onyx Vipers team captain. Exceptional stealth flank coordination, specialized in urban layout ambushes and rapid close-combat shotgun cycles.",
        kd: 3.06,
        kills: 98,
        assists: 15,
        damage: 18500,
        revives: 12,
        knockdowns: 54,
        matchesPlayed: 32,
        wins: 8,
        averagePlacement: 6.2,
        survivalMinutes: 19.4,
        mvpAwards: 3,
        regionalRank: 7,
        achievements: ["Shadow Stalker Medal", "CQB Destroyer Elite", "Tactical Raid Coordinator"]
      }
    ];

    try {
      const saved = localStorage.getItem("cv_linked_stats_players");
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        const merged = defaultStatsMap.map((def) => {
          const matched = parsedSaved.find((p: any) => p.ign === def.ign);
          if (matched) {
            const kills = matched.kills !== undefined ? matched.kills : def.kills;
            const matchesPlayed = matched.matchesPlayed !== undefined ? matched.matchesPlayed : def.matchesPlayed;
            const calculatedKd = matchesPlayed > 0 ? parseFloat((kills / matchesPlayed).toFixed(2)) : def.kd;

            return {
              ...def,
              id: matched.id || def.id,
              name: matched.name || def.name,
              avatar: matched.avatar || def.avatar,
              role: matched.role || def.role,
              kd: calculatedKd,
              kills,
              assists: matched.assists !== undefined ? matched.assists : def.assists,
              damage: matched.damage !== undefined ? matched.damage : def.damage,
              revives: matched.revives !== undefined ? matched.revives : def.revives,
              knockdowns: matched.knockdowns !== undefined ? matched.knockdowns : def.knockdowns,
              matchesPlayed,
              wins: matched.wins !== undefined ? matched.wins : def.wins,
              averagePlacement: matched.averagePlacement !== undefined ? matched.averagePlacement : def.averagePlacement,
              survivalMinutes: matched.survivalMinutes !== undefined ? matched.survivalMinutes : def.survivalMinutes,
              mvpAwards: matched.mvpAwards !== undefined ? matched.mvpAwards : def.mvpAwards,
              regionalRank: matched.regionalRank !== undefined ? matched.regionalRank : def.regionalRank,
              achievements: matched.achievements || def.achievements
            };
          }
          return def;
        });
        setPlayers(merged);
      } else {
        setPlayers(defaultStatsMap);
      }
    } catch (e) {
      console.error("Error loading comparison database for panel:", e);
      setPlayers(defaultStatsMap);
    }
  }, [comparePlayerA, comparePlayerB]);

  // Find selected players
  const playerA = players.find((p) => p.ign === comparePlayerA) || players[0];
  const playerB = players.find((p) => p.ign === comparePlayerB) || players[1];

  if (!playerA || !playerB) return null;

  // Win rate calculations
  const winRateA = playerA.matchesPlayed > 0 ? parseFloat(((playerA.wins / playerA.matchesPlayed) * 100).toFixed(1)) : 0;
  const winRateB = playerB.matchesPlayed > 0 ? parseFloat(((playerB.wins / playerB.matchesPlayed) * 100).toFixed(1)) : 0;

  // Normalize metrics to 0-100 range for the Radar Chart
  const radarData = [
    {
      subject: "Combat K/D",
      [playerA.ign]: Math.min(100, Math.round((playerA.kd / 6) * 100)),
      [playerB.ign]: Math.min(100, Math.round((playerB.kd / 6) * 100)),
      rawA: playerA.kd.toFixed(2),
      rawB: playerB.kd.toFixed(2),
      unit: " K/D"
    },
    {
      subject: "Win Rate",
      [playerA.ign]: winRateA,
      [playerB.ign]: winRateB,
      rawA: `${winRateA}%`,
      rawB: `${winRateB}%`,
      unit: ""
    },
    {
      subject: "Squad Assists",
      [playerA.ign]: Math.min(100, Math.round((playerA.assists / 80) * 100)),
      [playerB.ign]: Math.min(100, Math.round((playerB.assists / 80) * 100)),
      rawA: playerA.assists,
      rawB: playerB.assists,
      unit: " Asts"
    },
    {
      subject: "Combat Revives",
      [playerA.ign]: Math.min(100, Math.round((playerA.revives / 50) * 100)),
      [playerB.ign]: Math.min(100, Math.round((playerB.revives / 50) * 100)),
      rawA: playerA.revives,
      rawB: playerB.revives,
      unit: " Revs"
    },
    {
      subject: "Survival Time",
      [playerA.ign]: Math.min(100, Math.round((playerA.survivalMinutes / 30) * 100)),
      [playerB.ign]: Math.min(100, Math.round((playerB.survivalMinutes / 30) * 100)),
      rawA: `${playerA.survivalMinutes} Min`,
      rawB: `${playerB.survivalMinutes} Min`,
      unit: ""
    },
    {
      subject: "Damage Output",
      [playerA.ign]: Math.min(100, Math.round((playerA.damage / 40000) * 100)),
      [playerB.ign]: Math.min(100, Math.round((playerB.damage / 40000) * 100)),
      rawA: playerA.damage.toLocaleString(),
      rawB: playerB.damage.toLocaleString(),
      unit: " HP"
    }
  ];

  const handleSwap = () => {
    const temp = comparePlayerA;
    setComparePlayerA(comparePlayerB);
    setComparePlayerB(temp);
    if (onAlertMessage) {
      onAlertMessage(`🔄 Swapped side-panel comparison slots!`);
    }
  };

  const generateReport = () => {
    const kdDiff = Math.abs(playerA.kd - playerB.kd).toFixed(2);
    const wrDiff = Math.abs(winRateA - winRateB).toFixed(1);
    const damageDiff = Math.abs(playerA.damage - playerB.damage).toLocaleString();

    let analysis = "";
    if (playerA.kd > playerB.kd) {
      analysis += `• ${playerA.ign} demonstrates superior offensive dominance with a +${kdDiff} K/D advantage.\n`;
    } else if (playerB.kd > playerA.kd) {
      analysis += `• ${playerB.ign} holds a lethal edge in front-line combat with +${kdDiff} higher K/D ratio.\n`;
    } else {
      analysis += `• Both competitors exhibit perfectly matched raw combat lethality (K/D ratios equal).\n`;
    }

    if (winRateA > winRateB) {
      analysis += `• Strategy Analytics favor ${playerA.ign}, presenting a +${wrDiff}% win cohesion offset.\n`;
    } else if (winRateB > winRateA) {
      analysis += `• Squad rotation telemetry suggests ${playerB.ign} delivers higher final circle victory conversions (+${wrDiff}% WR).\n`;
    }

    const assistsA = playerA.assists;
    const assistsB = playerB.assists;
    if (assistsA > assistsB) {
      analysis += `• ${playerA.ign} acts as the primary layout enabler with ${assistsA} squad assists, emphasizing extreme utility coordination.\n`;
    } else if (assistsB > assistsA) {
      analysis += `• ${playerB.ign} excels in structural utility coordination with ${assistsB} assists, leading team support operations.\n`;
    }

    setActiveReport(`=== CV ESPORTS TACTICAL TELEMETRY RAPID REPORT ===\n\nComparing: [A] ${playerA.ign} (Red) vs [B] ${playerB.ign} (Gold)\n\nLethality Breakdown:\n${analysis}\nConclusion: Recommend tactical positioning ${playerA.kd > playerB.kd ? playerA.ign : playerB.ign} as Primary Entry and ${playerA.assists > playerB.assists ? playerA.ign : playerB.ign} as Secondary Anchor support structure.`);
  };

  // Custom Recharts Radar Tooltip to make it beautiful
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0b0c10]/95 backdrop-blur-md border border-zinc-800 p-3 rounded-xl shadow-2xl font-mono text-left max-w-xs text-[11px] space-y-1.5">
          <p className="text-zinc-400 font-bold uppercase tracking-wider text-[9px] border-b border-zinc-900 pb-1">{data.subject}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-5 items-center">
              <span className="text-red-500 font-bold">🔴 {playerA.ign}:</span>
              <span className="text-white font-black">{data.rawA}</span>
            </div>
            <div className="flex justify-between gap-5 items-center">
              <span className="text-amber-500 font-bold">🟡 {playerB.ign}:</span>
              <span className="text-white font-black">{data.rawB}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Glass Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[90]"
          />

          {/* Slide-out Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg md:max-w-xl bg-[#090a0d] border-l border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,0.85)] z-[100] flex flex-col font-mono text-zinc-300"
          >
            {/* Upper laser line accent */}
            <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 shadow-[0_1px_8px_rgba(239,68,68,0.5)]" />

            {/* HEADER SEGMENT */}
            <div className="p-4 md:p-6 border-b border-zinc-900 flex items-center justify-between bg-[#0e1014]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <Sliders size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                    TACTICAL COMPARATOR
                    <span className="text-[9px] bg-red-950 text-red-400 px-1.5 py-0.2 rounded border border-red-900/30 font-black animate-pulse">LIVE</span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">HUD Hexagonal Radar Analytics Node</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSwap}
                  title="Swap competitor portals"
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/40 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                >
                  <ArrowLeftRight size={15} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/40 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* MAIN PORTAL AREA (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
              
              {/* COMPETE SELECTOR DROPDOWNS DIRECTLY IN PANEL */}
              <div className="grid grid-cols-2 gap-3 bg-[#0d0f14] p-3 rounded-xl border border-zinc-900">
                <div className="space-y-1">
                  <span className="text-[8px] text-red-500 uppercase tracking-wider font-extrabold block">🔴 PORTAL A SELECT</span>
                  <select
                    value={comparePlayerA}
                    onChange={(e) => {
                      setComparePlayerA(e.target.value);
                      if (onAlertMessage) onAlertMessage(`🔴 Swapped Slot A competitor to ${e.target.value}`);
                    }}
                    className="w-full bg-black text-white text-xs border border-zinc-850 p-1.5 rounded outline-none cursor-pointer focus:border-red-500/50"
                  >
                    {players.map(p => (
                      <option key={p.ign} value={p.ign} disabled={p.ign === comparePlayerB}>
                        {p.avatar} {p.ign}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] text-amber-500 uppercase tracking-wider font-extrabold block">🟡 PORTAL B SELECT</span>
                  <select
                    value={comparePlayerB}
                    onChange={(e) => {
                      setComparePlayerB(e.target.value);
                      if (onAlertMessage) onAlertMessage(`🟡 Swapped Slot B competitor to ${e.target.value}`);
                    }}
                    className="w-full bg-black text-white text-xs border border-zinc-850 p-1.5 rounded outline-none cursor-pointer focus:border-amber-500/50"
                  >
                    {players.map(p => (
                      <option key={p.ign} value={p.ign} disabled={p.ign === comparePlayerA}>
                        {p.avatar} {p.ign}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COMPETITOR DUAL HEADERS */}
              <div className="grid grid-cols-2 gap-4">
                {/* Competitor A Details */}
                <div className="bg-gradient-to-br from-[#120708] to-[#0d0f14] p-3.5 rounded-xl border border-red-950/55 text-left relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-red-500/10 text-xl font-black">
                    #{playerA.jerseyNumber}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{playerA.avatar}</span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">{playerA.ign}</h4>
                      <p className="text-[9px] text-zinc-500">{playerA.role}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded max-w-max border border-red-900/30">
                    K/D: {playerA.kd.toFixed(2)} | WR: {winRateA}%
                  </div>
                </div>

                {/* Competitor B Details */}
                <div className="bg-gradient-to-br from-[#121008] to-[#0d0f14] p-3.5 rounded-xl border border-amber-950/45 text-left relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-amber-500/10 text-xl font-black">
                    #{playerB.jerseyNumber}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{playerB.avatar}</span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">{playerB.ign}</h4>
                      <p className="text-[9px] text-zinc-500">{playerB.role}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-amber-400 font-bold bg-amber-950/20 px-2 py-0.5 rounded max-w-max border border-amber-900/20">
                    K/D: {playerB.kd.toFixed(2)} | WR: {winRateB}%
                  </div>
                </div>
              </div>

              {/* 📊 THE HEXAGON RADAR CHART CONTAINER */}
              <div className="bg-[#0b0c10]/70 border border-zinc-900 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center shadow-[inset_0_2px_12px_rgba(0,0,0,0.5)]">
                <div className="w-full flex justify-between items-center pb-2 border-b border-zinc-950 mb-3">
                  <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1">
                    <TrendingUp size={11} className="text-red-500" />
                    HEXAGONAL COMBAT COMPONENT COHESION
                  </span>
                  <span className="text-[8px] bg-[#12141c] text-zinc-400 border border-zinc-800 rounded px-1.5 font-mono">
                    NORMALIZED RATING [100 MAX]
                  </span>
                </div>

                {/* Radar Plot Graphic Area */}
                <div className="w-full h-64 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#222" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#888', fontSize: 9, fontWeight: 'bold', fontFamily: 'monospace' }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: '#444', fontSize: 8 }} 
                        stroke="#1c1c22"
                      />
                      <Radar
                        name={playerA.ign}
                        dataKey={playerA.ign}
                        stroke="#dc2626"
                        fill="#dc2626"
                        fillOpacity={0.25}
                      />
                      <Radar
                        name={playerB.ign}
                        dataKey={playerB.ign}
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.25}
                      />
                      <Tooltip content={<CustomRadarTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", marginTop: "10px" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TACTICAL METRIC HEAD-TO-HEAD MATRIX */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black tracking-widest text-zinc-400 uppercase flex items-center gap-1">
                  <Award size={12} className="text-red-500" />
                  Telemetry Metrics Comparison Diagnostics
                </h4>

                <div className="bg-[#0b0c10] border border-zinc-900 rounded-xl p-3.5 space-y-3">
                  {[
                    { label: "Combat K/D", valA: playerA.kd, valB: playerB.kd, format: (v: number) => v.toFixed(2) },
                    { label: "Win Rate %", valA: winRateA, valB: winRateB, format: (v: number) => `${v}%` },
                    { label: "Squad Assists", valA: playerA.assists, valB: playerB.assists, format: (v: number) => String(v) },
                    { label: "Combat Revives", valA: playerA.revives, valB: playerB.revives, format: (v: number) => String(v) },
                    { label: "Survival Minutes", valA: playerA.survivalMinutes, valB: playerB.survivalMinutes, format: (v: number) => `${v} Min` },
                    { label: "Damage Dealt", valA: playerA.damage, valB: playerB.damage, format: (v: number) => v.toLocaleString() },
                  ].map((stat, idx) => {
                    const isWinA = stat.valA > stat.valB;
                    const isWinB = stat.valB > stat.valA;
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-zinc-900/50 last:border-0 last:pb-0 font-mono">
                        <span className={`w-20 font-bold ${isWinA ? 'text-red-500' : 'text-zinc-500'}`}>
                          {stat.format(stat.valA)} {isWinA && "⚡"}
                        </span>
                        
                        <span className="text-zinc-400 font-sans text-[10px] text-center uppercase tracking-wider">
                          {stat.label}
                        </span>

                        <span className={`w-20 font-bold text-right ${isWinB ? 'text-amber-500' : 'text-zinc-500'}`}>
                          {isWinB && "⚡"} {stat.format(stat.valB)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* INTEL REPORT EXTRACTOR NODE */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black tracking-widest text-zinc-400 uppercase flex items-center gap-1">
                    <Info size={12} className="text-red-500" />
                    Intelligent Decision Guidance
                  </h4>
                  <button
                    onClick={generateReport}
                    className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[9px] font-bold uppercase rounded cursor-pointer transition-all"
                  >
                    Analyze Tactics
                  </button>
                </div>

                {activeReport ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#06080b] border border-red-950/40 p-4 rounded-xl text-[10px] leading-relaxed text-zinc-400 font-mono whitespace-pre-wrap relative"
                  >
                    <button 
                      onClick={() => setActiveReport(null)}
                      className="absolute top-2 right-2 text-[8px] text-zinc-600 hover:text-zinc-400 cursor-pointer"
                    >
                      Clear
                    </button>
                    {activeReport}
                  </motion.div>
                ) : (
                  <div className="bg-[#050608] border border-zinc-950 p-4 rounded-xl text-center text-[10px] text-zinc-600 italic">
                    Click "Analyze Tactics" to compile an instant squad recommendation ledger.
                  </div>
                )}
              </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 bg-[#0e1014] border-t border-zinc-900 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center"
              >
                Close HUD
              </button>
              <button
                onClick={() => {
                  if (onAlertMessage) {
                    onAlertMessage(`🏆 Saved dual-competitor configuration to layout cache.`);
                  }
                  onClose();
                }}
                className="flex-1 py-2.5 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-[#E10600]/80 shadow-[0_0_15px_rgba(225,6,0,0.25)] transition-all cursor-pointer text-center"
              >
                Confirm Setup
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
