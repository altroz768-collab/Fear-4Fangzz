import React, { useEffect, useState } from "react";
import { 
  Trophy, 
  Award, 
  Activity, 
  Sparkles, 
  Zap, 
  Target, 
  Flame, 
  Shield, 
  Clock, 
  Heart,
  TrendingUp,
  Sliders,
  CheckCircle,
  TrendingDown,
  User,
  Crown
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

// PlayerStats definition
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

interface RosterPlayerComparisonProps {
  comparePlayerA: string;
  setComparePlayerA: (ign: string) => void;
  comparePlayerB: string;
  setComparePlayerB: (ign: string) => void;
  onAlertMessage?: (msg: string) => void;
}

export default function RosterPlayerComparison({
  comparePlayerA,
  setComparePlayerA,
  comparePlayerB,
  setComparePlayerB,
  onAlertMessage
}: RosterPlayerComparisonProps) {
  const [players, setPlayers] = useState<PlayerComparisonStats[]>([]);

  // Load and refresh stats from localStorage or fallbacks
  useEffect(() => {
    // Exact defaults mapped to data.ts & PlayerStatsLinkingSystem.tsx
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
        // Let's merge the saved player statistics into our default stats array
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
      console.error("Error linking comparison player database:", e);
      setPlayers(defaultStatsMap);
    }
  }, []);

  // Get active selected player stats
  const playerA = players.find((p) => p.ign === comparePlayerA) || players[0];
  const playerB = players.find((p) => p.ign === comparePlayerB) || players[1];

  if (!playerA || !playerB) {
    return <div className="text-zinc-550 py-4 font-mono">Loading Comparison Engines...</div>;
  }

  // Calculate percentage ratios for side-by-side progression representation 
  const getComparisonBalance = (valA: number, valB: number, inverted: boolean = false) => {
    if (valA === 0 && valB === 0) return { pctA: 50, pctB: 50 };
    // For inverted stats (like regional rank or average placement - lower is better)
    if (inverted) {
      const total = valA + valB;
      const pctA = ((total - valA) / total) * 100;
      return { pctA, pctB: 100 - pctA };
    } else {
      const pctA = (valA / (valA + valB)) * 100;
      return { pctA, pctB: 100 - pctA };
    }
  };

  // Compare statistics winner
  const getWinnerClass = (valA: number, valB: number, inverted: boolean = false) => {
    if (valA === valB) return { aClass: "text-white", bClass: "text-white" };
    if (inverted) {
      return valA < valB 
        ? { aClass: "text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]", bClass: "text-zinc-550" }
        : { aClass: "text-zinc-550", bClass: "text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" };
    } else {
      return valA > valB
        ? { aClass: "text-red-500 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]", bClass: "text-zinc-550" }
        : { aClass: "text-zinc-550", bClass: "text-red-500 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" };
    }
  };

  // Win rates
  const winRateA = playerA.matchesPlayed > 0 ? parseFloat(((playerA.wins / playerA.matchesPlayed) * 100).toFixed(1)) : 0;
  const winRateB = playerB.matchesPlayed > 0 ? parseFloat(((playerB.wins / playerB.matchesPlayed) * 100).toFixed(1)) : 0;

  // Chart data preparing
  const barChartData = [
    {
      name: "🎯 K/D Ratio",
      [playerA.ign]: playerA.kd,
      [playerB.ign]: playerB.kd
    },
    {
      name: "🏆 Wins Count",
      [playerA.ign]: playerA.wins,
      [playerB.ign]: playerB.wins
    },
    {
      name: "⚡ MVPs",
      [playerA.ign]: playerA.mvpAwards,
      [playerB.ign]: playerB.mvpAwards
    },
    {
      name: "🚪 Avg Place (Lower Better)",
      // Multiply by 3 for pleasant scale on bar chart alongside kills/wins
      [playerA.ign]: parseFloat((12 - playerA.averagePlacement).toFixed(1)),
      [playerB.ign]: parseFloat((12 - playerB.averagePlacement).toFixed(1))
    }
  ];

  const handleSwapSelection = () => {
    const temp = comparePlayerA;
    setComparePlayerA(comparePlayerB);
    setComparePlayerB(temp);
    if (onAlertMessage) {
      onAlertMessage("🔄 Swapped comparison placement channels.");
    }
  };

  return (
    <div id="roster-comparison-view" className="bg-[#0b0c10] border border-zinc-900 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden font-mono text-left space-y-6">
      
      {/* Visual neon lines */}
      <div className="absolute top-0 left-1/2 -ml-0.5 w-[1px] h-full bg-gradient-to-b from-zinc-900 via-red-950/20 to-transparent pointer-events-none hidden md:block" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-650/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SEGMENT */}
      <div className="border-b border-zinc-900 pb-5 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[9px] bg-red-950/40 text-red-500 border border-red-900/30 font-black tracking-widest px-2 py-0.5 rounded uppercase block w-max">
              STAT COMPARATOR ENGINE
            </span>
            <h3 className="text-lg md:text-xl font-black font-orbitron tracking-wide text-white uppercase flex items-center gap-2">
              <Sliders size={18} className="text-red-500" />
              TACTICAL PLAYER COMPONENT COMPARISON
            </h3>
            <p className="text-xs text-zinc-400 font-sans">
              Compare professional parameters side-by-side. Stats are compiled in real-time from our local match standings verification system.
            </p>
          </div>

          <button
            onClick={handleSwapSelection}
            className="p-2 px-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-red-500/30 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer block align-middle max-w-max self-start sm:self-auto shrink-0"
          >
            🔄 SWAP CHANNELS
          </button>
        </div>

        {/* CHOOSE DROP DOWNS GRIDS WITH CENTERED SWAP BUTTON */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-3 pt-2 items-center">
          {/* Player A Selector */}
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900">
            <label className="text-[10px] font-black text-[#ff001c] tracking-wider uppercase block">🔴 SQUAD ENROLLEE A (LEFT PORTAL)</label>
            <select
              value={comparePlayerA}
              onChange={(e) => {
                setComparePlayerA(e.target.value);
                if (onAlertMessage) onAlertMessage(`🔴 Set Comparison Sloter A to ${e.target.value}`);
              }}
              className="w-full bg-black text-white text-xs border border-zinc-850 p-2 rounded focus:border-[#ff001c] outline-none cursor-pointer"
            >
              {players.map(p => (
                <option key={p.ign} value={p.ign} disabled={p.ign === comparePlayerB}>
                  {p.avatar} {p.ign} - {p.role}
                </option>
              ))}
            </select>
          </div>

          {/* Centered Swap Button */}
          <div className="flex justify-center items-center py-1 md:py-0">
            <button
              onClick={handleSwapSelection}
              type="button"
              title="Instantly swap Player A and Player B positions"
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/40 text-stone-200 hover:text-red-500 rounded-full transition-all duration-300 transform hover:rotate-180 active:scale-90 cursor-pointer shadow-lg flex items-center justify-center shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-right">
                <path d="M8 3 3 8l5 5" />
                <path d="M3 8h18" />
                <path d="m16 21 5-5-5-5" />
                <path d="M21 16H3" />
              </svg>
            </button>
          </div>

          {/* Player B Selector */}
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900">
            <label className="text-[10px] font-black text-amber-500 tracking-wider uppercase block">🟡 SQUAD ENROLLEE B (RIGHT PORTAL)</label>
            <select
              value={comparePlayerB}
              onChange={(e) => {
                setComparePlayerB(e.target.value);
                if (onAlertMessage) onAlertMessage(`🟡 Set Comparison Sloter B to ${e.target.value}`);
              }}
              className="w-full bg-black text-white text-xs border border-zinc-850 p-2 rounded focus:border-amber-500 outline-none cursor-pointer"
            >
              {players.map(p => (
                <option key={p.ign} value={p.ign} disabled={p.ign === comparePlayerA}>
                  {p.avatar} {p.ign} - {p.role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CORE HERO PROFILE COMPARISONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Profile Card A (Red accent) */}
        <div className="bg-[#111113] p-5 rounded-2xl border border-red-500/10 space-y-3 relative hover:border-red-500/20 transition-all">
          <div className="absolute top-3 right-3 text-red-500/20 font-black font-orbitron text-4xl">
            #{playerA.jerseyNumber}
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-4xl p-2 bg-black rounded-xl border border-zinc-850 leading-none shadow-md">
              {playerA.avatar}
            </span>
            <div className="text-left space-y-0.5">
              <span className="text-[8px] bg-red-950 text-red-500 px-1 py-0.2 rounded font-black tracking-widest font-mono uppercase">
                {playerA.id}
              </span>
              <h4 className="text-sm font-black text-white font-orbitron tracking-tight flex items-center gap-1.5">
                <span>{playerA.ign}</span>
                <span className="text-xs text-red-500 font-mono font-bold">#{playerA.jerseyNumber}</span>
              </h4>
              <p className="text-xs text-zinc-450">{playerA.name}</p>
            </div>
          </div>
          
          <div className="p-2.5 bg-black/50 border border-zinc-900 rounded-lg text-xs">
            <span className="text-[9px] text-[#ff001c] uppercase tracking-wider block font-black">TACTICAL ROLE SPECIFICITY</span>
            <strong className="text-white font-bold block">{playerA.role}</strong>
          </div>

          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed italic border-l-2 border-red-650 pl-3">
            "{playerA.bio}"
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {playerA.achievements.map((ach, idx) => (
              <span key={idx} className="bg-red-950/15 text-[10px] text-red-400 px-2 py-0.5 rounded border border-red-950/30 font-semibold">
                ★ {ach}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Card B (Amber accent) */}
        <div className="bg-[#111113] p-5 rounded-2xl border border-amber-500/10 space-y-3 relative hover:border-amber-500/20 transition-all">
          <div className="absolute top-3 right-3 text-amber-500/20 font-black font-orbitron text-4xl">
            #{playerB.jerseyNumber}
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-4xl p-2 bg-black rounded-xl border border-zinc-850 leading-none shadow-md">
              {playerB.avatar}
            </span>
            <div className="text-left space-y-0.5">
              <span className="text-[8px] bg-amber-950/60 text-amber-500 px-1 py-0.2 rounded font-black tracking-widest font-mono uppercase">
                {playerB.id}
              </span>
              <h4 className="text-sm font-black text-white font-orbitron tracking-tight flex items-center gap-1.5">
                <span>{playerB.ign}</span>
                <span className="text-xs text-amber-500 font-mono font-bold">#{playerB.jerseyNumber}</span>
              </h4>
              <p className="text-xs text-zinc-450">{playerB.name}</p>
            </div>
          </div>
          
          <div className="p-2.5 bg-black/50 border border-zinc-900 rounded-lg text-xs">
            <span className="text-[9px] text-amber-500 uppercase tracking-wider block font-black">TACTICAL ROLE SPECIFICITY</span>
            <strong className="text-white font-bold block">{playerB.role}</strong>
          </div>

          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed italic border-l-2 border-amber-500 pl-3">
            "{playerB.bio}"
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {playerB.achievements.map((ach, idx) => (
              <span key={idx} className="bg-amber-950/15 text-[10px] text-amber-500 px-2 py-0.5 rounded border border-amber-950/30 font-semibold">
                ★ {ach}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED STATS COMPARISON MATRIX */}
      <SectionDivider label="Core Telemetry Performance Diagnostics" />

      <div className="space-y-4 pt-1 bg-zinc-950/30 p-4.5 rounded-2xl border border-zinc-900/60">
        
        {/* STAT LINE CODES */}
        {[
          { key: "regionalRank", label: "🌍 Global Regional Power Rank", valA: playerA.regionalRank, valB: playerB.regionalRank, inverted: true, unit: "Rank #_X_" },
          { key: "kd", label: "🎯 Kill / Death Combat Ratio", valA: playerA.kd, valB: playerB.kd, inverted: false, format: (v: number) => v.toFixed(2), icon: Flame },
          { key: "kills", label: "💀 Total Confirmed Eliminations", valA: playerA.kills, valB: playerB.kills, inverted: false, icon: Target },
          { key: "damage", label: "💥 Average Roster Damage Dealt", valA: playerA.damage, valB: playerB.damage, inverted: false, format: (v: number) => v.toLocaleString() + " HP" },
          { key: "winRate", label: "🏆 Custom Match SMR Win Rate", valA: winRateA, valB: winRateB, inverted: false, format: (v: number) => `${v}%`, icon: Trophy },
          { key: "averagePlacement", label: "🚪 Average Leaderboard Placement", valA: playerA.averagePlacement, valB: playerB.averagePlacement, inverted: true, format: (v: number) => `Place #${v}` },
          { key: "survivalMinutes", label: "⏱️ Average Map Survival duration", valA: playerA.survivalMinutes, valB: playerB.survivalMinutes, inverted: false, format: (v: number) => `${v} Min`, icon: Clock },
          { key: "revives", label: "🩹 Roster Safe Revives Handed", valA: playerA.revives, valB: playerB.revives, inverted: false, icon: Heart },
          { key: "knockdowns", label: "🎯 Hostile Knockdowns Scored", valA: playerA.knockdowns, valB: playerB.knockdowns, inverted: false },
          { key: "mvpAwards", label: "🎖️ Season Match MVP Awards", valA: playerA.mvpAwards, valB: playerB.mvpAwards, inverted: false, icon: Award }
        ].map((item, idx) => {
          const balance = getComparisonBalance(item.valA, item.valB, item.inverted);
          const winners = getWinnerClass(item.valA, item.valB, item.inverted);

          const displayA = item.format ? item.format(item.valA) : (item.unit ? item.unit.replace("_X_", String(item.valA)) : item.valA);
          const displayB = item.format ? item.format(item.valB) : (item.unit ? item.unit.replace("_X_", String(item.valB)) : item.valB);

          return (
            <div key={idx} className="space-y-1 pb-3.5 border-b border-zinc-900/40 last:border-0 last:pb-0">
              <div className="flex justify-between items-center text-xs">
                {/* Left Stat Value */}
                <span className={`font-mono text-xs text-right w-24 shrink-0 font-extrabold ${winners.aClass}`}>
                  {displayA}
                </span>

                {/* Main Middle Title */}
                <span className="text-zinc-400 font-semibold font-sans text-center text-[11px] px-2 flex items-center justify-center gap-1.5">
                  {item.icon && <item.icon size={11} className="text-red-500 shrink-0" />}
                  {item.label}
                </span>

                {/* Right Stat Value */}
                <span className={`font-mono text-xs text-left w-24 shrink-0 font-extrabold ${winners.bClass}`}>
                  {displayB}
                </span>
              </div>

              {/* Graphical Balance Bars */}
              <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-red-600 h-full transition-all duration-500 ease-out border-r border-[#000]/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]"
                  style={{ width: `${balance.pctA}%` }}
                />
                <div 
                  className="bg-amber-500 h-full transition-all duration-500 ease-out border-l border-[#000]/30 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]"
                  style={{ width: `${balance.pctB}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAPH RECHARTS DISPLAY COMPARISON */}
      <div className="bg-[#101012] border border-zinc-900 p-5 rounded-2xl space-y-4">
        <h4 className="text-xs uppercase font-extrabold text-white tracking-widest flex items-center gap-1.5">
          <TrendingUp className="text-red-500" size={13} />
          Grouped Parameters Combat Performance Matrix
        </h4>

        <div className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c22" />
              <XAxis dataKey="name" stroke="#666" fontSize={10} strokeWidth={0.5} />
              <YAxis stroke="#666" fontSize={10} strokeWidth={0.5} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0b0c10", border: "1px solid #1c1c22", borderRadius: "10px" }}
                itemStyle={{ fontSize: "11px", fontFamily: "monospace" }}
                labelStyle={{ color: "#FFF", fontSize: "11px", fontWeight: "bold" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
              <Bar dataKey={playerA.ign} fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey={playerB.ign} fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

// Sub components
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-[1px] bg-zinc-900 flex-1" />
      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest shrink-0 font-mono">
        {label}
      </span>
      <div className="h-[1px] bg-zinc-900 flex-1" />
    </div>
  );
}
