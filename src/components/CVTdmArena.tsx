import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame, Trophy, Users, Shield, Award, Play, Pause, Search, User,
  Globe, BarChart3, Clock, AlertCircle, Sparkles, CheckCircle2, X,
  RefreshCw, Star, Info, Target, Eye, Tv, ArrowRight, Activity,
  BookOpen, Crown, ChevronRight, Check, Plus, ShieldCheck, Zap, Scale, Trash
} from "lucide-react";
import { ArenaMode, ArenaRegion, RankingTier, PlayerStats, PlayerProfile, MatchHistoryItem, MatchVerificationData } from "../types/tdm";
import TdmConnectionTest from "./TdmConnectionTest";
import TdmMatchVerification from "./TdmMatchVerification";
import TdmStaffReviewCenter from "./TdmStaffReviewCenter";

interface CVTdmArenaProps {
  userSession: { ign: string; role: string; coins: number; battlePassLevel: number };
  systemAlertMessage: string | null;
  setSystemAlertMessage: (msg: string | null) => void;
}

const RANKING_TIERS: RankingTier[] = [
  { name: "Bronze", minPoints: 0, maxPoints: 199, icon: "🥉", color: "text-amber-700 bg-amber-955/15 border-amber-800/30", glow: "shadow-[0_0_15px_rgba(180,83,9,0.15)]" },
  { name: "Silver", minPoints: 200, maxPoints: 499, icon: "🥈", color: "text-slate-300 bg-slate-900/40 border-slate-700/30", glow: "shadow-[0_0_15px_rgba(203,213,225,0.15)]" },
  { name: "Gold", minPoints: 500, maxPoints: 999, icon: "🥇", color: "text-yellow-500 bg-yellow-955/10 border-yellow-800/35", glow: "shadow-[0_0_15px_rgba(234,179,8,0.2)]" },
  { name: "Platinum", minPoints: 1000, maxPoints: 1499, icon: "💠", color: "text-cyan-400 bg-cyan-955/10 border-cyan-800/35", glow: "shadow-[0_0_15px_rgba(34,211,238,0.25)]" },
  { name: "Diamond", minPoints: 1500, maxPoints: 1999, icon: "💎", color: "text-indigo-400 bg-indigo-955/10 border-indigo-800/35", glow: "shadow-[0_0_15px_rgba(129,140,248,0.25)]" },
  { name: "Crown", minPoints: 2000, maxPoints: 2499, icon: "👑", color: "text-purple-400 bg-purple-955/10 border-purple-800/35", glow: "shadow-[0_0_15px_rgba(168,85,247,0.25)]" },
  { name: "Ace", minPoints: 2500, maxPoints: 2999, icon: "🔥", color: "text-red-500 bg-red-955/10 border-red-800/40", glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]" },
  { name: "Ace Master", minPoints: 3000, maxPoints: 3499, icon: "⭐", color: "text-yellow-400 bg-yellow-955/15 border-yellow-500/50", glow: "shadow-[0_0_22px_rgba(234,179,8,0.35)]" },
  { name: "Ace Dominator", minPoints: 3500, maxPoints: 3999, icon: "⚡", color: "text-orange-500 bg-orange-955/15 border-orange-500/50", glow: "shadow-[0_0_25px_rgba(249,115,22,0.4)]" },
  { name: "Conqueror", minPoints: 4000, maxPoints: 4499, icon: "🏆", color: "text-emerald-400 bg-emerald-955/15 border-emerald-500/50", glow: "shadow-[0_0_25px_rgba(16,185,129,0.45)]" },
  { name: "Fear Legend", minPoints: 4500, maxPoints: 99999, icon: "👑", color: "text-amber-400 bg-amber-955/20 border-amber-500/60", glow: "shadow-[0_0_30px_rgba(245,158,11,0.55)]" },
];

export default function CVTdmArena({ userSession, systemAlertMessage, setSystemAlertMessage }: CVTdmArenaProps) {
  // Navigation tabs
  const [activeSubSection, setActiveSubSection] = useState<"dashboard" | "lobby" | "challenges" | "leaderboards" | "guide" | "profile" | "staff">("dashboard");

  // Selected state
  const [arenaMode, setArenaMode] = useState<ArenaMode>("1v1");
  const [selectedRegion, setSelectedRegion] = useState<ArenaRegion>("Africa");
  const [regionLocked, setRegionLocked] = useState<boolean>(false);
  
  // Toggle for Network Diagnostic Tool
  const [showNetworkDiagnostic, setShowNetworkDiagnostic] = useState(false);

  // Initializing separate data grids for each region and mode
  const [regionalLadders, setRegionalLadders] = useState<Record<ArenaRegion, Record<ArenaMode, PlayerStats>>>(() => {
    const defaultStats = (): PlayerStats => ({
      points: 650, // Starts at Gold
      wins: 15,
      losses: 8,
      draws: 2,
      kills: 145,
      mvps: 8,
      currentStreak: 2,
      longestStreak: 5,
      fairPlayScore: 100
    });

    const regions: ArenaRegion[] = ["Africa", "Europe", "Asia", "North America", "South America", "Oceania", "Middle East"];
    const modes: ArenaMode[] = ["1v1", "2v2", "4v4"];

    const matrix = {} as any;
    regions.forEach(r => {
      matrix[r] = {};
      modes.forEach(m => {
        // Vary starting points slightly per region to make it feel super realistic
        const baseOffset = r === "Africa" ? 250 : r === "Europe" ? 120 : r === "Asia" ? -150 : 0;
        const statsObj = defaultStats();
        statsObj.points = Math.max(100, statsObj.points + baseOffset);
        matrix[r][m] = statsObj;
      });
    });
    return matrix;
  });

  // History & Disputes list
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([
    { id: "m-101", mode: "1v1", region: "Africa", opponent: "Delta_Spectre", result: "WIN", pts: "+25", date: "June 16, 2026", map: "Warehouse", scoreBlue: 40, scoreRed: 32 },
    { id: "m-102", mode: "2v2", region: "Africa", opponent: "Apex_Wolf & Ghost", result: "WIN", pts: "+30", date: "June 15, 2026", map: "Ruins", scoreBlue: 40, scoreRed: 38 },
    { id: "m-103", mode: "4v4", region: "Africa", opponent: "Team Liquid Academy", result: "LOSS", pts: "-15", date: "June 14, 2026", map: "Library", scoreBlue: 35, scoreRed: 40 },
  ]);

  const [disputedMatches, setDisputedMatches] = useState<MatchVerificationData[]>([
    {
      matchId: "FEAR-M-892110",
      mode: "1v1",
      region: "Asia",
      map: "Warehouse",
      weaponAgreement: "M416 Only",
      blueScore: 40,
      redScore: 32,
      blueReport: "win",
      redReport: "win", // Mismatch!
      status: "CONFLICT",
      aiConfidenceScore: 45,
      aiVerdict: "FLAGGED_STAFF_REVIEW",
      aiNotes: "CRITICAL COMP DISPUTE: Both players declared victory. Telemetry scanner read M416 restriction compliance flags.",
      suspiciousFlags: ["Falsified Score Report"]
    }
  ]);

  // Profile customization cosmetics
  const [activeTitle, setActiveTitle] = useState("Mid Alley Surgeon 🎯");
  const [activeBanner, setActiveBanner] = useState("Vaporware Flare");
  const [activeFrame, setActiveFrame] = useState("Red Laser Wire");

  // Leaderboard lists
  const [searchQuery, setSearchQuery] = useState("");
  const [challengeResults, setChallengeResults] = useState<any[]>([]);

  // Daily & Weekly challenges
  const [dailyMissions, setDailyMissions] = useState([
    { id: "dm1", title: "Complete two 1v1 duels", progress: "1/2", done: false, reward: "30 Coins" },
    { id: "dm2", title: "Acquire three MVP badges", progress: "3/3", done: true, reward: "50 Coins" },
  ]);

  const [weeklyChallenges, setWeeklyChallenges] = useState([
    { id: "wc1", title: "Maintain a 5-win streak", progress: "3/5", done: false, reward: "100 Coins + Specialist Banner" },
    { id: "wc2", title: "Eliminate 40 opponents of similar tier", progress: "28/40", done: false, reward: "150 Coins" },
  ]);

  // Rivalries list
  const [rivalsList] = useState([
    { ign: "Delta_Spectre", record: "5W - 3L", lastResult: "WIN", state: "Online" },
    { ign: "Hydra_Hulk", record: "2W - 4L", lastResult: "LOSS", state: "In Queue" },
  ]);

  // Selected Rules & Map restrictions for custom queue
  const [weaponAgreement, setWeaponAgreement] = useState("M416 Only");

  // Promotion Notification state
  const [promotionCelebration, setPromotionCelebration] = useState<string | null>(null);

  // Active statistics helper
  const getActiveStats = (): PlayerStats => {
    return regionalLadders[selectedRegion][arenaMode];
  };

  const getTierAndRank = (pts: number): RankingTier => {
    for (let i = RANKING_TIERS.length - 1; i >= 0; i--) {
      if (pts >= RANKING_TIERS[i].minPoints) {
        return RANKING_TIERS[i];
      }
    }
    return RANKING_TIERS[0];
  };

  const activeStats = getActiveStats();
  const activeTier = getTierAndRank(activeStats.points);

  const handleSelectAndLockRegion = (region: ArenaRegion) => {
    setSelectedRegion(region);
    setRegionLocked(true);
    setShowNetworkDiagnostic(false);
    setSystemAlertMessage(`🔒 Region Lock Applied: Commencing Ranked Season 4 on ${region} Network Cluster.`);
  };

  // Called when Match Verification succeeds and outcomes are ready
  const handleMatchCompleted = (verifiedData: MatchVerificationData) => {
    // Check if it goes to staff queue
    if (verifiedData.status === "STAFF_REVIEW") {
      setDisputedMatches(prev => [verifiedData, ...prev]);
      setSystemAlertMessage(`⚠️ Conflict flagged! Match ${verifiedData.matchId} routed to Staff Review queue. No points changed yet.`);
      setActiveSubSection("dashboard");
      return;
    }

    // Apply points changes
    const outcome = verifiedData.blueReport;
    const statsObj = { ...regionalLadders[selectedRegion][arenaMode] };
    const currentTierName = getTierAndRank(statsObj.points).name;

    let apChange = 0;
    let streakBonus = 0;

    if (outcome === "win") {
      // Base rewards
      apChange = arenaMode === "1v1" ? 25 : arenaMode === "2v2" ? 30 : 35;
      statsObj.wins += 1;
      statsObj.currentStreak += 1;
      
      // Calculate streaks bonuses
      if (statsObj.currentStreak >= 15) streakBonus = 40;
      else if (statsObj.currentStreak >= 10) streakBonus = 20;
      else if (statsObj.currentStreak >= 5) streakBonus = 10;
      else if (statsObj.currentStreak >= 3) streakBonus = 5;

      if (statsObj.currentStreak > statsObj.longestStreak) {
        statsObj.longestStreak = statsObj.currentStreak;
      }
      
      // Random MVP allocation
      if (Math.random() > 0.4) {
        statsObj.mvps += 1;
      }
    } else if (outcome === "draw") {
      apChange = -5;
      statsObj.draws += 1;
      statsObj.currentStreak = 0;
    } else {
      apChange = -15;
      statsObj.losses += 1;
      statsObj.currentStreak = 0;
    }

    const finalApChange = apChange + (outcome === "win" ? streakBonus : 0);
    const newPoints = Math.max(0, statsObj.points + finalApChange);
    statsObj.points = newPoints;
    statsObj.kills += Math.floor(Math.random() * 15 + 10);

    // Update state
    setRegionalLadders(prev => ({
      ...prev,
      [selectedRegion]: {
        ...prev[selectedRegion],
        [arenaMode]: statsObj
      }
    }));

    // Check for rank promotion celebration!
    const newTierName = getTierAndRank(newPoints).name;
    if (newTierName !== currentTierName && newPoints > getTierAndRank(statsObj.points).minPoints) {
      // Ascended rank!
      setPromotionCelebration(newTierName);
    }

    // Add match to history
    const historyItem: MatchHistoryItem = {
      id: verifiedData.matchId,
      mode: arenaMode,
      region: selectedRegion,
      opponent: "Zim_Slayer_X",
      result: outcome.toUpperCase() as "WIN" | "LOSS" | "DRAW",
      pts: finalApChange >= 0 ? `+${finalApChange}` : `${finalApChange}`,
      date: "Today",
      map: "Warehouse",
      scoreBlue: verifiedData.blueScore,
      scoreRed: verifiedData.redScore,
      loadout: weaponAgreement,
      duration: "05:40"
    };

    setMatchHistory(prev => [historyItem, ...prev]);
    setSystemAlertMessage(`🎉 Points synchronized: ${historyItem.pts} AP. Win Streak: ${statsObj.currentStreak}`);
    setActiveSubSection("dashboard");
  };

  const handleResolveDispute = (matchId: string, verdict: "blue" | "red" | "draw" | "nullify", penaltyUser?: string) => {
    // Remove from queue
    setDisputedMatches(prev => prev.filter(m => m.matchId !== matchId));
    setSystemAlertMessage(`⚖️ Dispute Resolved: Match ID ${matchId} updated in ledger logs successfully.`);
  };

  return (
    <div className="bg-[#090909] border border-zinc-900 rounded-3xl p-6 space-y-6 text-left relative overflow-hidden shadow-2xl">
      {/* Background graphics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1c0a0a,transparent_75%)] pointer-events-none opacity-60" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff001c]/30 to-transparent" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-955/35 border border-[#ff001c]/30 rounded-full">
            <Flame size={12} className="text-[#ff001c] animate-pulse" />
            <span className="text-[9px] text-[#ff001c] font-black tracking-widest font-mono uppercase">FEAR PRO PLATFORM</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-orbitron tracking-wide text-white uppercase flex items-center gap-2">
            FEAR TDM <span className="text-red-500 font-black">ARENA</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed font-sans">
            Esports-grade regional matchmaking ladders, 11-tiered competitive ranks, secure dual-report visual AI match verification registries, and comprehensive audit logs.
          </p>
        </div>

        {/* Global profile statistics summary */}
        <div className="flex flex-wrap items-center gap-3 bg-[#0a0505]/90 border border-[#ff001c]/15 p-2 px-4 rounded-xl">
          <div className="text-center min-w-[70px] border-r border-zinc-850 pr-3">
            <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">CURRENT LEVEL</span>
            <span className="text-xs font-mono font-black text-amber-400 flex items-center justify-center gap-1">
              {activeTier.icon} {activeTier.name}
            </span>
          </div>
          <div className="text-center min-w-[75px] border-r border-zinc-850 pr-3">
            <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">ARENA POINTS</span>
            <span className="text-xs font-mono font-black text-white">{activeStats.points} AP</span>
          </div>
          <div className="text-center min-w-[50px]">
            <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">WIN RATE</span>
            <span className="text-xs font-mono font-bold text-red-500">
              {activeStats.wins + activeStats.losses > 0
                ? `${((activeStats.wins / (activeStats.wins + activeStats.losses)) * 100).toFixed(0)}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>

      {/* SYSTEM NOTIFICATION ALERT */}
      {systemAlertMessage && (
        <div className="relative z-10 bg-[#0c0505] border border-red-950 p-3 rounded-lg flex items-center justify-between gap-3 text-xs text-red-400 font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{systemAlertMessage}</span>
          </div>
          <button onClick={() => setSystemAlertMessage(null)} className="text-zinc-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* QUICK STATUS & DIAGNOSTICS SENSOR PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#0a0404]/80 border border-zinc-900/90 p-4 rounded-xl relative z-10 font-mono text-[10px]">
        <div>
          <span className="text-[8px] font-bold text-zinc-500 uppercase block tracking-wider mb-0.5">CURRENT REGION GRID</span>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-red-500 shrink-0" />
            <span className="font-bold text-white uppercase">{selectedRegion} Network</span>
            <button
              onClick={() => setShowNetworkDiagnostic(p => !p)}
              className="text-[#ff001c] hover:underline text-[8px] font-black uppercase cursor-pointer"
            >
              [Change]
            </button>
          </div>
        </div>

        <div>
          <span className="text-[8px] font-bold text-zinc-500 uppercase block tracking-wider mb-0.5">PING ACCESS RATIO</span>
          <span className="text-stone-200 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            24ms Jitter <span className="text-[8px] text-zinc-550 font-normal">(0.0% loss)</span>
          </span>
        </div>

        <div>
          <span className="text-[8px] font-bold text-zinc-500 uppercase block tracking-wider mb-0.5">STATUS ELIGIBILITY</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/30 w-max leading-none inline-block">
            CERTIFIED DUEL READY
          </span>
        </div>

        <div>
          <span className="text-[8px] font-bold text-zinc-500 uppercase block tracking-wider mb-0.5">REGION LOCK INDEX</span>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className={regionLocked ? "text-emerald-400" : "text-amber-500"} />
            <span className="font-bold text-white">
              {regionLocked ? "SEASON LOCKED ACTIVE" : "LOCK OUTSTANDING"}
            </span>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE LATENCY DIAGNOSTICS MODULE */}
      {showNetworkDiagnostic && (
        <div className="relative z-10">
          <TdmConnectionTest
            currentRegion={selectedRegion}
            regionLocked={regionLocked}
            onSelectAndLockRegion={handleSelectAndLockRegion}
          />
        </div>
      )}

      {/* COMPONENT SUBSECTION NAVIGATION TABS */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 border-b border-zinc-900 pb-3">
        {[
          { id: "dashboard", label: "Dashboard Core", icon: Flame },
          { id: "lobby", label: "Ranked Arena Lobby", icon: Trophy },
          { id: "challenges", label: "Competitors Finder", icon: Target },
          { id: "leaderboards", label: "Top 100 Leaderboards", icon: BarChart3 },
          { id: "guide", label: "AP Matrix Guide", icon: BookOpen },
          { id: "profile", label: "Dossier Card", icon: User },
          { id: "staff", label: "Staff Review Center", icon: Scale }
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSubSection(sec.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-all duration-150 ${
                isActive
                  ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.1)]"
                  : "bg-black/35 text-zinc-400 border-zinc-900 hover:text-white hover:border-zinc-800"
              }`}
            >
              <Icon size={12} className={isActive ? "text-[#ff001c] animate-pulse" : "text-zinc-500"} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* CORE CAROUSEL VIEWS */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* ======================= VIEWPORT A: DASHBOARD CORE ======================= */}
          {activeSubSection === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Mode Selector Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "1v1", label: "⚔️ 1v1 Gladiator Ranked", desc: "Posture duel, low-ping lock, fast pacing", modeLabel: "1v1" },
                  { id: "2v2", label: "🤝 2v2 Tactical Duo", desc: "Coordinate flank strategies with duo team-up", modeLabel: "2v2" },
                  { id: "4v4", label: "🛡️ 4v4 Tactical Squad", desc: "Form roster linkages for squad dominance", modeLabel: "4v4" }
                ].map((item) => {
                  const mStats = regionalLadders[selectedRegion][item.id as ArenaMode];
                  const mTier = getTierAndRank(mStats.points);
                  const isSelected = arenaMode === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => setArenaMode(item.id as ArenaMode)}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-gradient-to-b from-[#110606] to-[#040404] border-[#ff001c]/60 shadow-[0_0_20px_rgba(255,0,28,0.12)]"
                          : "bg-zinc-950/70 border-zinc-900 hover:border-zinc-800"
                      }`}
                    >
                      <div className="space-y-3 font-mono">
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-[11px] text-white uppercase font-orbitron">{item.label}</span>
                          <span className={`px-2 py-0.2 rounded text-[8.5px] border ${mTier.color} font-bold`}>
                            {mTier.icon} {mTier.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-550 leading-relaxed font-sans">{item.desc}</p>
                        
                        <div className="border-t border-zinc-900/60 pt-2 flex justify-between text-[9px] text-zinc-400">
                          <span>RP: <strong className="text-white">{mStats.points}</strong></span>
                          <span>Streak: <strong className="text-[#ff001c] font-black">{mStats.currentStreak} 🔥</strong></span>
                          <span>Wins: <strong className="text-white">{mStats.wins}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom half: Stats & Live feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-[10px]">
                {/* Stats Ledger Card */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 lg:col-span-1">
                  <div className="border-b border-zinc-900 pb-2 flex justify-between">
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                      Dossier Statistics
                    </h3>
                    <span className="text-[8.5px] text-[#ff001c] font-bold">MODE: {arenaMode}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-black/45 p-3 rounded-xl border border-zinc-900/80">
                      <span className="text-zinc-550 text-[8px] block">TOTAL DUELS</span>
                      <strong className="text-stone-200 text-sm mt-1 block">{activeStats.wins + activeStats.losses + activeStats.draws}</strong>
                    </div>
                    <div className="bg-black/45 p-3 rounded-xl border border-zinc-900/80">
                      <span className="text-zinc-550 text-[8px] block">WIN RATE RATIO</span>
                      <strong className="text-red-500 text-sm mt-1 block">
                        {activeStats.wins + activeStats.losses > 0 
                          ? `${((activeStats.wins / (activeStats.wins + activeStats.losses)) * 100).toFixed(0)}%`
                          : "0%"}
                      </strong>
                    </div>
                    <div className="bg-black/45 p-3 rounded-xl border border-zinc-900/80">
                      <span className="text-zinc-550 text-[8px] block">ELIMINATIONS</span>
                      <strong className="text-stone-200 text-sm mt-1 block">{activeStats.kills}</strong>
                    </div>
                    <div className="bg-black/45 p-3 rounded-xl border border-zinc-900/80">
                      <span className="text-zinc-550 text-[8px] block">MVP MATCHES</span>
                      <strong className="text-yellow-500 text-sm mt-1 block">🏆 {activeStats.mvps}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-black border border-zinc-900 rounded-xl space-y-2 text-[9px] text-zinc-400">
                    <div className="flex justify-between"><span>Longest Streak Record:</span> <strong className="text-white">{activeStats.longestStreak} games</strong></div>
                    <div className="flex justify-between"><span>Fair Play Rating:</span> <strong className="text-emerald-400">{activeStats.fairPlayScore} / 100</strong></div>
                  </div>
                </div>

                {/* Match History logs */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 lg:col-span-2 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                      <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={13} className="text-zinc-500" />
                        Match History Ledger ({selectedRegion})
                      </h3>
                      <button
                        onClick={() => {
                          setMatchHistory([]);
                          setSystemAlertMessage("Match history logs cleared from visual browser memory cache.");
                        }}
                        className="text-zinc-650 hover:text-red-500 text-[8.5px] font-bold uppercase transition-all flex items-center gap-1"
                      >
                        <Trash size={10} /> Clear Logs
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {matchHistory.filter(m => m.region === selectedRegion).length === 0 ? (
                        <div className="text-center py-10 text-zinc-650 uppercase text-[9px]">
                          No verified matches logged in {selectedRegion} this season.
                        </div>
                      ) : (
                        matchHistory.filter(m => m.region === selectedRegion).map((match) => (
                          <div key={match.id} className="bg-black/35 rounded-xl border border-zinc-900 p-3 flex justify-between items-center text-[9px]">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                                  match.result === "WIN" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-850/40" :
                                  match.result === "LOSS" ? "bg-red-955/20 text-[#ff001c] border border-red-900/30" :
                                  "bg-zinc-900 text-zinc-500 border border-zinc-800"
                                }`}>
                                  {match.result}
                                </span>
                                <span className="font-bold text-stone-200">vs {match.opponent}</span>
                                <span className="text-[8px] text-zinc-500 uppercase font-bold">({match.mode})</span>
                              </div>
                              <p className="text-zinc-550">Map: {match.map} | Date: {match.date} | Loadout: {match.loadout || "M416 Only"}</p>
                            </div>

                            <div className="text-right">
                              <span className={`text-[10.5px] font-orbitron font-black ${match.result === "WIN" ? "text-emerald-400" : "text-[#ff001c]"}`}>
                                {match.pts} AP
                              </span>
                              <span className="text-[7.5px] text-zinc-600 block mt-0.5">{match.scoreBlue} - {match.scoreRed}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-zinc-900/60 pt-3 flex justify-between items-center text-[8.5px] text-zinc-550">
                    <span>* Straightforward matches proceed automatically. Discrepancies go directly to Staff Review Queue.</span>
                    <button
                      onClick={() => setActiveSubSection("lobby")}
                      className="text-[#ff001c] hover:underline font-bold uppercase"
                    >
                      ENTER ARENA PORTAL [X]
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================= VIEWPORT B: RANKED ARENA LOBBY ======================= */}
          {activeSubSection === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Weapon Agreement Selection Selector */}
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-[10px]">
                <div className="space-y-0.5">
                  <strong className="text-white block uppercase tracking-wider">Configure Lobby Restriction:</strong>
                  <p className="text-zinc-550 text-[9px]">Agree on weapon boundaries before entering queue tracking.</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {["M416 Only", "AKM Only", "Snipers Only", "All Weapons"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setWeaponAgreement(opt)}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase cursor-pointer transition-all ${
                        weaponAgreement === opt
                          ? "bg-[#ff001c]/15 border-[#ff001c]/40 text-[#ff001c]"
                          : "bg-black border-zinc-900 text-zinc-500 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Verification lifecycle wrapper */}
              <TdmMatchVerification
                mode={arenaMode}
                region={selectedRegion}
                weaponAgreement={weaponAgreement}
                onMatchCompleted={handleMatchCompleted}
              />
            </motion.div>
          )}

          {/* ======================= VIEWPORT C: COMPETITORS FINDER ======================= */}
          {activeSubSection === "challenges" && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={14} className="text-[#ff001c] animate-pulse" />
                    1V1 Gladiator Arena Finder & Duel Inviter
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                    Enter any player In-Game Name (IGN) to find active competitors. Direct duels can only be accepted by competitors within matching MMR sectors to preserve ranked integrity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                  <div className="md:col-span-2 relative flex items-center">
                    <Search size={14} className="absolute left-3 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search active player IGNs or IDs (e.g., Apex, Hydra)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#ff001c] text-white p-2.5 pl-9 rounded-lg text-xs outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!searchQuery.trim()) {
                        setSystemAlertMessage("⚠️ Please provide a competitor search term!");
                        return;
                      }
                      setChallengeResults([
                        { id: "c1", ign: `${searchQuery}_TDM`, rank: "Gold II", points: 680, matching: true, rating: "1.25", stat: "1.34 KD / 58% WR" },
                        { id: "c2", ign: `${searchQuery}_Apex`, rank: "Silver V", points: 310, matching: false, reason: "TIER GAP EXCEEDS MARGIN", rating: "0.89" },
                        { id: "c3", ign: `Pro_${searchQuery}`, rank: "Gold I", points: 820, matching: true, rating: "1.41", stat: "1.41 KD / 63% WR" }
                      ]);
                      setSystemAlertMessage(`🔍 Scanning Network cluster for matching active records...`);
                    }}
                    className="bg-[#ff001c] hover:bg-[#ff1a33] text-stone-100 font-mono font-bold uppercase rounded-lg text-[10px] tracking-wider py-2.5 cursor-pointer"
                  >
                    SCAN FOR PLAYERS
                  </button>
                </div>

                {/* Challenge Result cards */}
                {challengeResults.length > 0 && (
                  <div className="space-y-3 pt-3 font-mono text-[10px]">
                    <h4 className="text-[9px] font-bold text-zinc-650 uppercase tracking-widest">
                      Active Matches Found:
                    </h4>

                    {challengeResults.map(res => (
                      <div key={res.id} className="bg-black/55 rounded-xl border border-zinc-900 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-white uppercase">{res.ign}</span>
                            <span className="px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 text-[8.5px] rounded font-bold text-[#ff001c]">
                              {res.rank} ({res.points} AP)
                            </span>
                          </div>
                          <p className="text-[9px] text-zinc-550">Outplay factor: {res.rating} | Statistics history: {res.stat || "No records"}</p>
                        </div>

                        {res.matching ? (
                          <button
                            onClick={() => {
                              setSystemAlertMessage(`🎮 Duel Invite routed to ${res.ign}. Setting up connection sensor hooks.`);
                              setActiveSubSection("lobby");
                            }}
                            className="bg-[#ff001c]/20 hover:bg-[#ff001c] text-[#ff001c] hover:text-white border border-[#ff001c]/30 font-bold uppercase text-[9.5px] tracking-wider py-1.5 px-4 rounded-md transition-all shrink-0 cursor-pointer"
                          >
                            ISSUE 1v1 CHALLENGE
                          </button>
                        ) : (
                          <span className="text-[9px] text-red-500 bg-red-955/20 px-3 py-1.5 border border-red-950 rounded font-black uppercase tracking-wider shrink-0">
                            {res.reason}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rivals head-to-head records list */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 font-mono text-[10px]">
                <div className="border-b border-zinc-900 pb-2.5">
                  <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                    Esports Rivals & Nemesis ledger
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rivalsList.map(riv => (
                    <div key={riv.ign} className="bg-black/45 border border-zinc-900/80 p-4 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <strong className="text-xs font-bold text-stone-100 uppercase">{riv.ign}</strong>
                        </div>
                        <p className="text-[9px] text-zinc-550">HEAD-TO-HEAD COMP: <span className="text-white font-bold">{riv.record}</span></p>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[7.5px] text-zinc-600 block">LAST MATCH</span>
                        <span className={`text-[9.5px] font-black uppercase ${riv.lastResult === "WIN" ? "text-emerald-400" : "text-red-500"}`}>
                          {riv.lastResult === "WIN" ? "VICTORY" : "DEFEAT"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================= VIEWPORT D: LEADERBOARDS DIVISION ======================= */}
          {activeSubSection === "leaderboards" && (
            <motion.div
              key="leaderboards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-3 gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                      Regional Top 100 Champion Standings
                    </h3>
                    <p className="text-[9.5px] text-zinc-500">Live rankings recorded across regional networks exclusively</p>
                  </div>

                  <div className="flex flex-wrap gap-2 font-mono text-[9px]">
                    <select
                      value={arenaMode}
                      onChange={(e) => setArenaMode(e.target.value as ArenaMode)}
                      className="bg-black text-[9.5px] font-bold text-stone-300 border border-zinc-800 rounded px-2.5 py-1 focus:border-[#ff001c] outline-none cursor-pointer"
                    >
                      <option value="1v1">1v1 Gladiator</option>
                      <option value="2v2">2v2 Duo Team</option>
                      <option value="4v4">4v4 Squad Team</option>
                    </select>

                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value as ArenaRegion)}
                      className="bg-black text-[9.5px] font-bold text-[#ff001c] border border-zinc-800 rounded px-2.5 py-1 focus:border-[#ff001c] outline-none cursor-pointer"
                    >
                      {["Africa", "Europe", "Asia", "North America", "South America", "Oceania", "Middle East"].map(r => (
                        <option key={r} value={r}>{r} Region</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto font-mono text-[10px]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-900/60 text-zinc-500 text-[8.5px] uppercase">
                        <th className="py-2 text-center w-12">RANK</th>
                        <th className="py-2">COMPETITOR IGN</th>
                        <th className="py-2 text-center">ARENA POINTS</th>
                        <th className="py-2 text-center">RANK TIER</th>
                        <th className="py-2 text-center">WIN RATE</th>
                        <th className="py-2 text-right">MVP INDEX</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-stone-300">
                      {[
                        { rank: 1, ign: "FEAR_Slayer_X", points: 4610, tier: "Fear Legend", wr: "78%", mvps: 82, you: false },
                        { rank: 2, ign: "Alpha 'Viper'", points: 4120, tier: "Conqueror", wr: "72%", mvps: 62, you: false },
                        { rank: 3, ign: "Lethal 'Sniper'", points: 3680, tier: "Ace Dominator", wr: "65%", mvps: 58, you: false },
                        { rank: 4, ign: userSession.ign, points: activeStats.points, tier: activeTier.name, wr: "62%", mvps: activeStats.mvps, you: true },
                        { rank: 5, ign: "Mumba_Blitz", points: 1950, tier: "Diamond", wr: "58%", mvps: 34, you: false },
                        { rank: 6, ign: "Zim_Sniper_9", points: 1420, tier: "Platinum", wr: "54%", mvps: 18, you: false }
                      ].sort((a, b) => b.points - a.points).map((player, idx) => (
                        <tr key={player.ign} className={`${player.you ? "bg-red-955/5 border border-red-950/25" : ""} hover:bg-zinc-900/10`}>
                          <td className="py-3 text-center">
                            <span className={`inline-block w-5 h-5 rounded-md leading-5 font-black text-center text-[9px] ${
                              idx === 0 ? "bg-yellow-500 text-black shadow-[0_0_8px_rgba(234,179,8,0.4)]" :
                              idx === 1 ? "bg-slate-300 text-black" :
                              idx === 2 ? "bg-amber-700 text-stone-100" :
                              "bg-zinc-900 text-zinc-500"
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 font-semibold text-stone-200">
                            {player.ign} {player.you && <span className="text-[8px] bg-[#ff001c] text-white px-1.5 rounded py-0.2 ml-1 font-black">YOU</span>}
                          </td>
                          <td className="py-3 text-center text-[#ff001c] font-black font-orbitron">{player.points} AP</td>
                          <td className="py-3 text-center">
                            <span className="text-[9px] font-bold text-stone-300">
                              {player.tier}
                            </span>
                          </td>
                          <td className="py-3 text-center text-zinc-500 font-bold">{player.wr}</td>
                          <td className="py-3 text-right font-black text-yellow-500">🏆 {player.mvps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================= VIEWPORT E: AP MATRIX GUIDE ======================= */}
          {activeSubSection === "guide" && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-900 space-y-6 text-left leading-relaxed">
                <div className="border-b border-zinc-900 pb-3">
                  <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={14} className="text-[#ff001c]" />
                    LADDER AP ALLOCATIONS & STREAKS PROTOCOLS
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[10px]">
                  <div className="bg-black/55 p-4 rounded-xl border border-zinc-900 space-y-3">
                    <strong className="text-stone-200 block uppercase border-b border-zinc-900 pb-2 font-black">⚔️ 1v1 GLADIATOR SYSTEMS</strong>
                    <div className="space-y-1 text-zinc-400">
                      <div className="flex justify-between"><span>Match Victory:</span> <strong className="text-emerald-400">+25 AP</strong></div>
                      <div className="flex justify-between"><span>Match Draw:</span> <strong className="text-zinc-500">-5 AP</strong></div>
                      <div className="flex justify-between"><span>Match Defeat:</span> <strong className="text-red-500">-15 AP</strong></div>
                    </div>
                  </div>

                  <div className="bg-black/55 p-4 rounded-xl border border-zinc-900 space-y-3">
                    <strong className="text-stone-200 block uppercase border-b border-zinc-900 pb-2 font-black">🤝 2v2 TACTICAL DUOS</strong>
                    <div className="space-y-1 text-zinc-400">
                      <div className="flex justify-between"><span>Match Victory:</span> <strong className="text-emerald-400">+30 AP</strong></div>
                      <div className="flex justify-between"><span>Match Draw:</span> <strong className="text-zinc-500">-5 AP</strong></div>
                      <div className="flex justify-between"><span>Match Defeat:</span> <strong className="text-red-500">-15 AP</strong></div>
                    </div>
                  </div>

                  <div className="bg-black/55 p-4 rounded-xl border border-zinc-900 space-y-3">
                    <strong className="text-stone-200 block uppercase border-b border-zinc-900 pb-2 font-black">🛡️ 4v4 TACTICAL SQUADS</strong>
                    <div className="space-y-1 text-zinc-400">
                      <div className="flex justify-between"><span>Match Victory:</span> <strong className="text-emerald-400">+35 AP</strong></div>
                      <div className="flex justify-between"><span>Match Draw:</span> <strong className="text-zinc-500">-5 AP</strong></div>
                      <div className="flex justify-between"><span>Match Defeat:</span> <strong className="text-red-500">-15 AP</strong></div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/35 p-4 rounded-xl border border-zinc-900 space-y-3 font-mono text-[10px]">
                  <strong className="text-stone-200 block uppercase font-black text-[#ff001c]">🔥 CONSISTENT WIN STREAK BONUS COEFFICIENTS</strong>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-450 leading-relaxed text-[9.5px]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><span>3 Consecutive Victories:</span> <span className="text-white font-bold">+5 AP bonus</span></div>
                      <div className="flex justify-between"><span>5 Consecutive Victories:</span> <span className="text-white font-bold">+10 AP bonus</span></div>
                      <div className="flex justify-between"><span>10 Consecutive Victories:</span> <span className="text-white font-bold">+20 AP bonus</span></div>
                      <div className="flex justify-between"><span>15 Consecutive Victories:</span> <span className="text-white font-bold">+40 AP bonus</span></div>
                    </div>
                    <div>
                      <span className="text-[#ff001c] font-bold block uppercase border-l-2 border-red-950 pl-2 mb-1.5">💎 PROGRESSIVE COMEBACK REWARDS</span>
                      Defeating an opponent with higher rank points yields up to +12 AP additional progressive difficulty rewards. Repeatedly matching/winning against the same players triggers point-decay multipliers to prevent farming.
                    </div>
                  </div>
                </div>

                {/* Tiers distribution display */}
                <div className="space-y-3 font-mono text-[10px]">
                  <strong className="text-stone-200 block uppercase font-black">🏆 11 RANKED SECTORS REGISTER</strong>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 text-center">
                    {RANKING_TIERS.map(t => (
                      <div key={t.name} className={`p-2 rounded-lg border text-center ${t.color} ${t.glow}`}>
                        <span className="text-base block mb-0.5">{t.icon}</span>
                        <span className="text-[9.5px] font-bold block uppercase">{t.name}</span>
                        <span className="text-[8px] text-zinc-500 mt-0.5 block">{t.minPoints}+ AP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================= VIEWPORT F: DOSSIER CARD ======================= */}
          {activeSubSection === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Editor panel */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 font-mono text-[10px]">
                  <div className="border-b border-zinc-900 pb-2 flex justify-between">
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">
                      Dossier Cosmetics
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-zinc-550 text-[8px] block uppercase mb-1">ARENA TITLE PLATFORM</label>
                      <select
                        value={activeTitle}
                        onChange={(e) => setActiveTitle(e.target.value)}
                        className="bg-black text-white p-1.5 border border-zinc-800 rounded w-full outline-none focus:border-[#ff001c] cursor-pointer"
                      >
                        <option value="Mid Alley Surgeon 🎯">Mid Alley Surgeon 🎯</option>
                        <option value="TDM Overlord 🔥">TDM Overlord 🔥</option>
                        <option value="Surgical Strategist 🧠">Surgical Strategist 🧠</option>
                        <option value="Unconquered Legend 👑">Unconquered Legend 👑</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-550 text-[8px] block uppercase mb-1">CARD BACKGROUND THEME</label>
                      <select
                        value={activeBanner}
                        onChange={(e) => setActiveBanner(e.target.value)}
                        className="bg-black text-white p-1.5 border border-zinc-800 rounded w-full outline-none focus:border-[#ff001c] cursor-pointer"
                      >
                        <option value="Vaporware Flare">Vaporware Flare (Cosmic Crimson)</option>
                        <option value="Chrome Horizon">Chrome Horizon (Slate Steel)</option>
                        <option value="Void Walker">Void Walker (Deep Obsidian)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-550 text-[8px] block uppercase mb-1">AVATAR NEON FRAME</label>
                      <select
                        value={activeFrame}
                        onChange={(e) => setActiveFrame(e.target.value)}
                        className="bg-black text-white p-1.5 border border-zinc-800 rounded w-full outline-none focus:border-[#ff001c] cursor-pointer"
                      >
                        <option value="Red Laser Wire">Red Laser Wire (Elite)</option>
                        <option value="Cyan Neon Cable">Cyan Neon Cable (Platinum)</option>
                        <option value="Gilded Border Frame">Gilded Frame (Conqueror)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Virtual Profile Card */}
                <div className="lg:col-span-2 bg-[#0a0505]/65 border border-zinc-900 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between font-mono text-[10px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/10 rounded-full blur-[50px] pointer-events-none" />

                  <div className="space-y-4">
                    <div className="flex md:flex-row flex-col gap-4 text-center md:text-left items-center md:items-start justify-between border-b border-zinc-900/60 pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl relative ${
                          activeFrame.includes("Gilded") ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" :
                          activeFrame.includes("Cyan") ? "border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]" :
                          "border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                        }`}>
                          🐍
                        </div>
                        <div>
                          <span className="text-[8px] text-[#ff001c] font-bold block tracking-wider uppercase">{activeTitle}</span>
                          <h3 className="text-base font-black text-white uppercase mt-1 leading-none">{userSession.ign}</h3>
                          <span className="text-[8px] text-zinc-500 block mt-1">ARENA SECTOR ID: #FEAR-AM-99211</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[7.5px] text-zinc-550 block">SEASON HIGHEST</span>
                        <strong className="text-xs font-bold text-amber-500">{activeTier.icon} {activeTier.name} ({activeStats.points} AP)</strong>
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-[10px]">
                      <h4 className="text-[9px] font-bold text-zinc-650 block uppercase tracking-wider border-l border-red-800 pl-2">
                        Competitive Career Dossier Record (Current Region)
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-zinc-300">
                        <div className="bg-black/60 p-2.5 border border-zinc-900 rounded-xl">
                          <span className="text-zinc-650 text-[8px] block">1v1 RANK POINTS</span>
                          <strong className="text-[#ff001c] font-black mt-1 block font-orbitron">{regionalLadders[selectedRegion]["1v1"].points} AP</strong>
                        </div>
                        <div className="bg-black/60 p-2.5 border border-zinc-900 rounded-xl">
                          <span className="text-zinc-650 text-[8px] block">2v2 RANK POINTS</span>
                          <strong className="text-emerald-400 font-black mt-1 block font-orbitron">{regionalLadders[selectedRegion]["2v2"].points} AP</strong>
                        </div>
                        <div className="bg-black/60 p-2.5 border border-zinc-900 rounded-xl">
                          <span className="text-zinc-650 text-[8px] block">4v4 RANK POINTS</span>
                          <strong className="text-blue-400 font-black mt-1 block font-orbitron">{regionalLadders[selectedRegion]["4v4"].points} AP</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-900/60 pt-4 flex md:flex-row flex-col justify-between gap-3 text-xs mt-4">
                    <div className="space-y-0.5">
                      <span className="text-zinc-550 text-[8px] uppercase font-bold">RECALIBRATION TIMELINE</span>
                      <strong className="text-white font-bold block text-[10px]">Season 4: Apex Glories Active</strong>
                    </div>

                    <button
                      onClick={() => {
                        setRegionLocked(false);
                        setSystemAlertMessage("🔄 Seasonal recalibration logs cleared. Region Access unlocked.");
                      }}
                      className="px-4 py-2 border border-zinc-800 hover:border-red-955 bg-zinc-950 text-red-500 hover:bg-red-955/15 font-bold uppercase text-[9px] tracking-wider rounded-lg transition-colors"
                    >
                      Clear Regional Lock
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================= VIEWPORT G: STAFF REVIEW CENTER ======================= */}
          {activeSubSection === "staff" && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TdmStaffReviewCenter
                disputedMatches={disputedMatches}
                onResolveDispute={handleResolveDispute}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ======================= GRAPHICAL CELEBRATION MODAL INTERFACE ======================= */}
      <AnimatePresence>
        {promotionCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            id="promotion-celebration-modal"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#090909] border border-[#ff001c]/30 rounded-3xl p-6 text-center space-y-6 relative overflow-hidden font-mono"
            >
              {/* Spinning background rays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1c0a0a,transparent_60%)] pointer-events-none opacity-80" />

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff001c]/10 border border-[#ff001c]/40 rounded-full text-[9px] text-[#ff001c] font-black tracking-widest uppercase">
                  🏆 RANK SECURED ASCENSION
                </span>
                <h2 className="text-2xl font-black text-white font-orbitron uppercase tracking-wide mt-2">
                  CONGRATULATIONS WARRIOR!
                </h2>
                <p className="text-[10px] text-zinc-500">Your competitive standing has ascended securely on regional databases.</p>
              </div>

              {/* Massive animated icon tier badge */}
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-[#1c0a0a]/50 border-2 border-[#ff001c] flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(255,0,28,0.4)] animate-bounce">
                  {getTierAndRank(activeStats.points).icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-yellow-500 font-orbitron uppercase leading-none mt-2">
                    {promotionCelebration}
                  </h3>
                  <span className="text-[9px] text-zinc-500 mt-1 block">NEW THRESHOLD DISPATCH: {activeStats.points} AP</span>
                </div>
              </div>

              <button
                onClick={() => setPromotionCelebration(null)}
                className="w-full bg-[#ff001c] hover:bg-[#ff1a33] text-white font-bold py-2.5 rounded-xl border border-transparent font-mono text-[9.5px] uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,28,0.25)] select-none cursor-pointer"
              >
                Dismiss & Continue Dominating
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
