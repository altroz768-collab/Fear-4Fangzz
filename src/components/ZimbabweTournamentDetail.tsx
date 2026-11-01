import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Trophy, Users, Calendar, Shield, ArrowLeft, Clock, Map, 
  Flag, Zap, CheckCircle, Info, Settings, Phone, MessageSquare, AlertCircle, Share2, Play,
  Brain, Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell 
} from "recharts";
import { Tournament, UserSession } from "../types";
import TournamentLoungeChat from "./TournamentLoungeChat";

interface ZimbabweTournamentDetailProps {
  tournament: Tournament;
  session: UserSession;
  scoreCycle: number;
  onBack: () => void;
  onRegister: (tournamentId: string) => void;
  awardXp: (xp: number) => void;
  setSystemAlertMessage: (msg: string) => void;
}

export default function ZimbabweTournamentDetail({
  tournament,
  session,
  scoreCycle,
  onBack,
  onRegister,
  awardXp,
  setSystemAlertMessage
}: ZimbabweTournamentDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "leaderboard" | "teams" | "brackets" | "lounge">("overview");
  const [claimStatus, setClaimStatus] = useState<"none" | "claiming" | "claimed">("none");
  const [copyStatus, setCopyStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // PMGC Match Style interactive calculator states
  const [calcPlacement, setCalcPlacement] = useState<number>(1);
  const [calcKills, setCalcKills] = useState<number>(6);
  const [pmgcTabMode, setPmgcTabMode] = useState<"pmgc" | "standard">("pmgc");

  // AI Match Predictor states
  const [predictedTeamA, setPredictedTeamA] = useState<string>("CVZ");
  const [predictedTeamB, setPredictedTeamB] = useState<string>("CV");
  const [isAiTooltipOpen, setIsAiTooltipOpen] = useState(false);

  const getScrimStats = (tag: string) => {
    switch (tag) {
      case "CVZ": return { name: "CV Zimbabwe Esports", kd: 1.85, synergy: 94, formValue: 92, formText: "Excellent (W-W-W-L)" };
      case "CV": return { name: "Crimson Vipers Pro", kd: 1.72, synergy: 88, formValue: 85, formText: "Strong (W-L-W-W)" };
      case "S10": return { name: "Slaying Ten", kd: 1.45, synergy: 82, formValue: 78, formText: "Steady (L-W-L-W)" };
      case "ROSE": return { name: "Desert Roses Elite", kd: 1.38, synergy: 79, formValue: 74, formText: "Average (W-L-L-W)" };
      case "ZIMX": return { name: "Zim Warriors Clan", kd: 1.25, synergy: 75, formValue: 68, formText: "Unstable (L-L-W-W)" };
      case "NXS": return { name: "Nexus Esports Apex", kd: 1.18, synergy: 70, formValue: 60, formText: "Struggling (L-L-L-W)" };
      default: return { name: tag, kd: 1.0, synergy: 50, formValue: 50, formText: "Average" };
    }
  };

  // Calculate countdown time
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(tournament.countdownDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 65)
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [tournament.countdownDate]);

  // Points distribution pool mock based on standard competitive rules
  const pointSystem = [
    { place: "1st Place (WWCD 🍗)", points: 15 },
    { place: "2nd Place", points: 12 },
    { place: "3rd Place", points: 10 },
    { place: "4th Place", points: 8 },
    { place: "5th Place", points: 6 },
    { place: "6th Place", points: 4 },
    { place: "7th - 10th Place", points: 2 },
    { place: "Each Confirmed Kill 🎯", points: 1 }
  ];

  const mapPoolList = [
    { name: "Erangel", description: "Battlefield of choice, critical rotations", status: "Active" },
    { name: "Miramar", description: "Vast desert sniper-focused ridges", status: "Active" },
    { name: "Sanhok", description: "Fast-paced jungle, raw CQB fights", status: "Active" }
  ];

  // Mock list of team player names based on CV Zimbabwe community
  const zimbabweClans = [
    { tag: "CVZ", name: "CV Zimbabwe Esports", captain: "Panashe_ZIM", flag: "🇿🇼", logoColor: "text-red-500" },
    { tag: "CV", name: "Crimson Vipers Pro", captain: "CV_Slayer_IGL", flag: "🇿🇼", logoColor: "text-white" },
    { tag: "S10", name: "Slaying Ten", captain: "Chipo_Rogue", flag: "🇿🇼", logoColor: "text-red-400" },
    { tag: "ROSE", name: "Desert Roses Elite", captain: "Tinotenda_99", flag: "🇿🇼", logoColor: "text-zinc-300" },
    { tag: "ZIMX", name: "Zim Warriors Clan", captain: "Farai_Sniper", flag: "🇿🇼", logoColor: "text-white" },
    { tag: "NXS", name: "Nexus Esports Apex", captain: "Tariq_OP", flag: "🇿🇼", logoColor: "text-red-650" }
  ];

  const handleShare = () => {
    setCopyStatus(true);
    navigator.clipboard.writeText(window.location.href);
    setSystemAlertMessage("🔗 Tournament connection link copied to clipboard! Share across WhatsApp community chats.");
    awardXp(10);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const isUserRegistered = tournament.registeredTeams.includes(session.ign) || tournament.registeredTeams.includes(`${session.ign} Squad`);

  // Simulated live leaderboards matching the CV Zimbabwe ranking criteria
  const getLeaderboardData = () => {
    if (tournament.leaderboard && tournament.leaderboard.length > 0) {
      return tournament.leaderboard.map((team, idx) => {
        // Add dynamic fluctuations based on scoreCycle for realistic presentation
        const killsAdjust = team.kills + (scoreCycle % 4) * (idx === 0 ? 2 : 1);
        const placementAdjust = (15 - idx * 3) + (scoreCycle % 3);
        const wwcdCount = idx === 0 ? 2 : idx === 1 ? 1 : 0;
        return {
          ...team,
          kills: killsAdjust,
          placePoints: placementAdjust,
          wwcd: wwcdCount,
          points: team.points + (killsAdjust * 1.5) + placementAdjust
        };
      });
    }

    // Default scoreboard if none is provided
    return [
      { rank: 1, teamName: "CV Zimbabwe Esports", matchesPlayed: 4, kills: 38, placePoints: 48, wwcd: 2, points: 86 },
      { rank: 2, teamName: "Crimson Vipers Pro", matchesPlayed: 4, kills: 29, placePoints: 36, wwcd: 1, points: 65 },
      { rank: 3, teamName: "Slaying Ten", matchesPlayed: 4, kills: 21, placePoints: 32, wwcd: 1, points: 53 },
      { rank: 4, teamName: "Desert Roses Elite", matchesPlayed: 4, kills: 18, placePoints: 22, wwcd: 0, points: 40 },
      { rank: 5, teamName: "Zim Warriors Clan", matchesPlayed: 4, kills: 15, placePoints: 18, wwcd: 0, points: 33 },
      { rank: 6, teamName: "Nexus Esports Apex", matchesPlayed: 4, kills: 11, placePoints: 12, wwcd: 0, points: 23 }
    ];
  };

  return (
    <div className="space-y-6 relative z-10 animate-fade-in text-left">
      
      {/* CV ZIMBABWE HEADER NAVIGATION BANNER */}
      <div className="flex items-center justify-between bg-[#0d0d0d] p-4 rounded-xl border border-red-500/20 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black font-chakra text-gray-300 hover:text-red-400 group transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO LOBBY</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-red-950/20 text-red-500 border border-red-500/20 px-3 py-1 rounded font-russo uppercase tracking-widest animate-pulse flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            CV Zimbabwe Co-Core
          </span>
          <button
            onClick={handleShare}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500/40 text-gray-300 rounded-lg transition-all cursor-pointer"
            title="Copy Invite Connection Core"
          >
            <Share2 size={13} />
          </button>
        </div>
      </div>

      {/* GIANT CHAMPIONSHIP HERO MODULE */}
      <div className="relative rounded-2xl border-2 border-red-500/20 bg-[#090909] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.08)]">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(239,68,68,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.08)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent blur-[120px] pointer-events-none animate-lightning" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent blur-[120px] pointer-events-none" />

        {/* Graphical Top Cover Image Banner Overlay */}
        <div className="relative h-48 md:h-64 w-full">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=960" 
            alt={tournament.title}
            className="w-full h-full object-cover opacity-35 filter brightness-90 saturate-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/45 to-zinc-950/40" />

          {/* Floating Live Indicator Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-[10px] bg-red-650 text-white px-3 py-1 rounded font-russo tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              {tournament.type} CHAMPIONSHIP
            </span>
            <span className={`text-[10px] px-3 py-1 rounded font-russo tracking-widest uppercase font-bold text-white shadow-md ${
              tournament.status === "Live"
                ? "bg-red-600 animate-pulse"
                : "bg-red-950 border border-red-500/20"
            }`}>
              {tournament.status}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[11px] text-red-500 font-extrabold tracking-widest uppercase font-chakra mb-1 block">🏆 ZIMBABWE REGIONAL PUBG DIRECTORY</span>
            <h1 className="text-2xl md:text-4xl font-black font-russo tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] max-w-3xl leading-tight">
              {tournament.title}
            </h1>
            <p className="text-xs text-gray-300 font-chakra mt-2 uppercase tracking-wide flex items-center gap-4">
              <span>GAME: <strong className="text-white">{tournament.game}</strong></span>
              <span className="text-gray-600">|</span>
              <span>MAPS: <strong className="text-white">{tournament.mapDetails || "Erangel / Sanhok"}</strong></span>
            </p>
          </div>
        </div>

        {/* Hero Bottom quick bar metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-red-500/20 bg-[#0b0b0b] text-xs text-stone-200">
          <div className="p-4 border-r border-b lg:border-b-0 border-red-500/10 flex flex-col justify-center">
            <span className="text-[9px] text-gray-500 block uppercase font-chakra font-black tracking-wider">CHAMPIONSHIP POOL</span>
            <strong className="text-red-500 text-lg md:text-xl font-russo leading-none mt-1">{tournament.prizePool}</strong>
          </div>
          <div className="p-4 border-r border-b lg:border-b-0 border-red-500/10 flex flex-col justify-center">
            <span className="text-[9px] text-gray-500 block uppercase font-chakra font-black tracking-wider">PLATFORM REGISTRATIONS</span>
            <strong className="text-white text-lg md:text-xl font-russo leading-none mt-1">{tournament.entryFee}</strong>
          </div>
          <div className="p-4 border-r border-red-500/10 flex flex-col justify-center">
            <span className="text-[9px] text-gray-500 block uppercase font-chakra font-black tracking-wider">REGISTRATION COUNTDOWN</span>
            <strong className="text-red-400 text-md md:text-lg font-mono font-bold mt-1 tracking-wider leading-none">
              {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
            </strong>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[9px] text-gray-500 block uppercase font-chakra font-black tracking-wider">FILLED SEATS RATIO</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-russo text-lg leading-none text-white">
                {tournament.registeredTeams.length} / {tournament.maxTeams}
              </span>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900/50">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((tournament.registeredTeams.length / tournament.maxTeams) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧠 AI MATCH PROBABILITY PREDICTOR WITH REAL-TIME SCRIM METRICS */}
      {(() => {
        const statsA = getScrimStats(predictedTeamA);
        const statsB = getScrimStats(predictedTeamB);

        const scoreA = (statsA.kd * 40) + (statsA.synergy * 0.3) + (statsA.formValue * 0.3);
        const scoreB = (statsB.kd * 40) + (statsB.synergy * 0.3) + (statsB.formValue * 0.3);

        const probA = Math.max(15, Math.min(85, Math.round((scoreA / (scoreA + scoreB)) * 100)));
        const probB = 100 - probA;

        return (
          <div className="relative rounded-xl border border-red-500/25 bg-[#090d16]/95 p-5 text-left shadow-[0_0_20px_rgba(239,68,68,0.06)] overflow-hidden font-mono">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-650/10 to-transparent blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-gradient-to-tr from-cyan-500/5 to-transparent blur-xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/10 pb-4 mb-4 font-mono">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-950/40 border border-red-500/30 rounded-lg text-red-500 animate-pulse">
                  <Brain size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black font-russo text-white uppercase tracking-wider">
                      🧠 AI CO-CORE WIN PROBABILITY PREDICTOR
                    </h3>
                    <span className="bg-red-500/15 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase">
                      BETA ENGAGE
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                    Real-time neural probability calculated from live performance indices and historical scrim pools.
                  </p>
                </div>
              </div>

              {/* Matchup Selector */}
              <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-900 text-[10px] self-start md:self-auto font-mono">
                <select
                  value={predictedTeamA}
                  onChange={(e) => {
                    if (e.target.value === predictedTeamB) {
                      setPredictedTeamB(predictedTeamA);
                    }
                    setPredictedTeamA(e.target.value);
                  }}
                  className="bg-transparent border-0 text-red-400 font-bold focus:ring-0 cursor-pointer max-w-[110px]"
                >
                  {zimbabweClans.map((clan) => (
                    <option key={clan.tag} value={clan.tag} className="bg-[#090d16] text-white">
                      {clan.tag} ({clan.name})
                    </option>
                  ))}
                </select>

                <span className="text-zinc-600 font-black text-[9px] px-0.5">VS</span>

                <select
                  value={predictedTeamB}
                  onChange={(e) => {
                    if (e.target.value === predictedTeamA) {
                      setPredictedTeamA(predictedTeamB);
                    }
                    setPredictedTeamB(e.target.value);
                  }}
                  className="bg-transparent border-0 text-cyan-400 font-bold focus:ring-0 cursor-pointer max-w-[110px]"
                >
                  {zimbabweClans.map((clan) => (
                    <option key={clan.tag} value={clan.tag} className="bg-[#090d16] text-white">
                      {clan.tag} ({clan.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Prediction Bar */}
            <div className="space-y-3 relative font-mono">
              <div className="flex justify-between items-end text-xs font-chakra">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-black font-russo text-red-500">{statsA.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold">({predictedTeamA})</span>
                </div>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-[11px] text-zinc-500 font-semibold uppercase">AI CONFIDENCE:</span>
                  <strong className="text-red-500 font-russo text-lg">{probA}%</strong>
                  <span className="text-zinc-500 font-light">vs</span>
                  <strong className="text-cyan-400 font-russo text-lg">{probB}%</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-mono font-bold">({predictedTeamB})</span>
                  <span className="text-[13px] font-black font-russo text-cyan-400">{statsB.name}</span>
                </div>
              </div>

              {/* Progress Bar Container with Interactive Tooltip Hover Area */}
              <div 
                className="relative h-7 rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950 flex shadow-inner group cursor-help transition-all duration-300 hover:border-red-500/40"
                onMouseEnter={() => setIsAiTooltipOpen(true)}
                onMouseLeave={() => setIsAiTooltipOpen(false)}
                onClick={() => setIsAiTooltipOpen(!isAiTooltipOpen)}
              >
                {/* Team A Side Bar */}
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: `${probA}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  className="h-full bg-gradient-to-r from-red-700/90 to-red-500/80 flex items-center pl-3 border-r border-red-950/60 shadow-[inset_0_-10px_15px_rgba(0,0,0,0.2)] overflow-hidden"
                >
                  <span className="text-[10px] font-russo text-white tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] whitespace-nowrap">
                    {probA}%
                  </span>
                </motion.div>

                {/* Divider node with glow */}
                <motion.div 
                  initial={{ left: "calc(50% - 2px)" }}
                  animate={{ left: `calc(${probA}% - 2px)` }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-[0_0_8px_#ffffff] pointer-events-none" 
                />

                {/* Team B Side Bar */}
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: `${probB}%` }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  className="h-full bg-gradient-to-l from-cyan-700/90 to-cyan-500/80 flex items-center justify-end pr-3 shadow-[inset_0_-10px_15px_rgba(0,0,0,0.2)] animate-pulse overflow-hidden"
                >
                  <span className="text-[10px] font-russo text-white tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] whitespace-nowrap">
                    {probB}%
                  </span>
                </motion.div>

                {/* Hover indicator floating overlay */}
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-[8px] bg-neutral-900/95 border border-red-500/30 text-red-400 px-2.5 py-1 rounded font-mono font-bold tracking-widest uppercase flex items-center gap-1 shadow-md">
                    <Sparkles size={8} className="animate-spin" /> CLICK OR HOVER FOR NEURAL DRIVERS
                  </span>
                </div>
              </div>

              {/* Factors Driver Subtext */}
              <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  SCRIM STATISTICS ANALYSIS UNIT ACTIVE
                </span>
                <span className="text-[8.5px] text-red-400/80 italic">
                  *Based on {tournament.title} live qualifier data.
                </span>
              </div>

              {/* 📊 INTERACTIVE NEURAL BREAKDOWN TOOLTIP / POP OVER */}
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ 
                  opacity: isAiTooltipOpen ? 1 : 0.85, 
                  y: 0, 
                  scale: 1,
                  borderColor: isAiTooltipOpen ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.1)"
                }}
                transition={{ duration: 0.2 }}
                className={`mt-3 p-4 rounded-lg border bg-[#04060b]/98 text-zinc-300 font-sans shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative ${
                  isAiTooltipOpen ? "bg-[#050914]/98 ring-1 ring-red-500/20" : ""
                }`}
              >
                {/* Glowing connector or active status */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#04060b] border-t border-l border-red-500/25 rotate-45" />

                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-black font-russo text-white uppercase tracking-wider">
                    <Sparkles size={12} className="text-red-500" />
                    <span>🧠 AI NEURAL CO-CORES FACTOR BREAKDOWN</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase">Confidence Multipliers Active</span>
                </div>

                {/* The three key factors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-chakra">
                  {/* 1. Scrim K/D Ratio */}
                  <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900 hover:border-red-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wide">⚔️ SCRIM K/D RATIO</span>
                        <span className="bg-red-950 text-red-400 text-[8px] px-1 rounded uppercase font-bold">40% Weight</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 leading-snug">
                        Measures historical frag efficiency and survival zones. High values indicate strong fire superiority.
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-900/60 flex justify-between items-center text-[11px] font-mono">
                      <span className="text-red-500 font-black">{statsA.kd.toFixed(2)} K/D</span>
                      <span className="text-zinc-650">vs</span>
                      <span className="text-cyan-400 font-black">{statsB.kd.toFixed(2)} K/D</span>
                    </div>
                  </div>

                  {/* 2. Roster Synergy */}
                  <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900 hover:border-red-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wide">🧩 ROSTER SYNERGY</span>
                        <span className="bg-yellow-950 text-yellow-500 text-[8px] px-1 rounded uppercase font-bold">30% Weight</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 leading-snug">
                        Computed based on line-up longevity, trade-kills density, and safe-zone rotations coordination.
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-900/60 flex justify-between items-center text-[11px] font-mono">
                      <span className="text-red-500 font-black">{statsA.synergy}%</span>
                      <span className="text-zinc-650">vs</span>
                      <span className="text-cyan-400 font-black">{statsB.synergy}%</span>
                    </div>
                  </div>

                  {/* 3. Recent Form */}
                  <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900 hover:border-red-500/20 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wide">🔥 RECENT FORM</span>
                        <span className="bg-cyan-950 text-cyan-400 text-[8px] px-1 rounded uppercase font-bold">30% Weight</span>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 leading-snug">
                        Tracks placements in the past 5 scrim pools. WWCD streaks drastically elevate form.
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-900/60 flex justify-between items-center text-[11px] font-mono flex-wrap gap-1">
                      <span className="text-red-500 font-black text-[10px]" title={statsA.formText}>{statsA.formText}</span>
                      <span className="text-zinc-650">vs</span>
                      <span className="text-cyan-400 font-black text-[10px]" title={statsB.formText}>{statsB.formText}</span>
                    </div>
                  </div>
                </div>

                {isAiTooltipOpen && (
                  <div className="mt-3 pt-2 border-t border-zinc-900 flex justify-between items-center text-[9px] text-red-400/80 font-mono uppercase">
                    <span>🤖 NEURAL SIMULATION ACTIVE: ACCURACY ESTIMATE +/- 3.2%</span>
                    <span>Click elsewhere or move cursor to dim</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        );
      })()}

      {/* TWO COLUMN CONTENT FLOW: LEFT SIDEBAR WIDGETS + RIGHT DETAILED SWITCHER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: ACTIVE TOURNAMENT TELEMETRY WIDGETS */}
        <div className="space-y-6">
          
          {/* ACTION REGISTRATION CALL TO ACTION CARD */}
          <div className="bg-[#070b17] border border-red-500/20 p-5 rounded-xl text-left relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/10 rounded-full blur-xl" />
            <h3 className="text-xs font-black font-russo text-white uppercase tracking-wider border-l-2 border-red-500 pl-2 mb-3">
              ⚔️ SQUAD RESERVATION CELL
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-chakra mb-4">
              Submit your team credentials to guarantee place brackets in the upcoming CV Zimbabwe Warzone matches. Captain must coordinate communications.
            </p>

            {isUserRegistered ? (
              <div className="space-y-3">
                <div className="bg-red-950/25 border border-red-500/30 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="text-red-500 shrink-0" size={16} />
                  <span className="text-xs font-bold font-chakra text-red-500">YOUR SQUAD SLOT IS RESERVED ✔</span>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900 font-mono text-[9px] text-gray-500 leading-tight">
                  ROSTER CO-CORE MATCH SLOTS: {session.ign} & 3 Reserve Cadets. Check-in starts 15 mins prior.
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onRegister(tournament.id);
                  awardXp(40);
                }}
                disabled={tournament.status === "Closed" || tournament.status === "Live"}
                className={`w-full py-3 text-[11px] font-black font-russo tracking-wider uppercase rounded-lg transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer ${
                  tournament.status === "Closed" || tournament.status === "Live"
                    ? "bg-stone-800 text-stone-500 border border-stone-900 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-650 to-red-800 hover:from-white hover:to-white hover:text-red-800 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-500/30 hover:border-red-600"
                }`}
              >
                <Trophy size={14} />
                <span>RESERVE SQUAD SLOT</span>
              </button>
            )}

            {/* Quick Zimbabwe community link badge */}
            <div className="mt-4 pt-4 border-t border-red-500/10 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span>ZIM REGION POOL: HARARE / PROV</span>
              <span className="text-red-400 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* WHATSAPP COMMUNICATIONS REMINDER CARD */}
          {(() => {
            const isWaLinked = (() => {
              try {
                const saved = localStorage.getItem("cv_whatsapp_user_profiles");
                if (!saved) return false;
                return !!JSON.parse(saved)[session.ign]?.isVerified;
              } catch (e) {
                return false;
              }
            })();

            return (
              <div className={`p-4 rounded-xl border space-y-2 text-left transition-all ${
                isWaLinked 
                  ? "bg-emerald-950/15 border-emerald-900/30 text-emerald-400"
                  : "bg-red-950/15 border-red-950/40 text-red-500 animate-pulse"
              }`}>
                <strong className="text-[10px] font-mono font-black uppercase tracking-widest block">
                  {isWaLinked ? "🟢 WHATSAPP DELIVERY ACTIVE" : "⚠️ WHATSAPP UNCONNECTED"}
                </strong>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  {isWaLinked 
                     ? "Real-time custom room IDs, passwords, and waitlist promos will route directly to your WhatsApp."
                     : "You must connect your WhatsApp to receive direct room keys and passcodes for brackets!"}
                </p>
                {!isWaLinked && (
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("cv_navigate_tab", { detail: "settings" }));
                      setSystemAlertMessage("📱 Launching WhatsApp Linking Center & dial deck...");
                      awardXp(10);
                    }}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black font-mono text-[9.5px] rounded-lg uppercase tracking-wider cursor-pointer text-center"
                  >
                    📱 Connect WhatsApp Now
                  </button>
                )}
              </div>
            );
          })()}

          {/* ACTIVE MAP DETAILS & RULES HIGHLIGHT */}
          <div className="bg-[#050914] border border-stone-900 p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-black font-russo text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              🗺️ MAP ROTATIONS POOL
            </h3>
            
            <div className="space-y-2 font-chakra">
              {mapPoolList.map((mp, index) => (
                <div key={index} className="bg-zinc-950 p-3 rounded-lg border border-stone-900 hover:border-red-500/20 transition-all flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Map size={12} className="text-red-400" />
                      <strong className="text-xs text-white uppercase">{mp.name}</strong>
                    </div>
                    <span className="text-[10px] text-gray-550">{mp.description}</span>
                  </div>
                  <span className="text-[8px] bg-red-950/40 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    {mp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SYSTEM AND SERVER INFORMATION PANEL */}
          <div className="bg-[#050914] border border-stone-900 p-5 rounded-xl space-y-3 font-chakra text-xs">
            <h3 className="text-xs font-black font-russo text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              🛰️ AUTOMATED DISPATCH META
            </h3>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Upon registering, secure custom mobile configurations can be pushed to registered team captains via WhatsApp Web linkages to notify on custom lobbies!
            </p>
            <div className="p-3 bg-zinc-950 rounded border border-stone-900 space-y-1 text-[11px]">
              <div className="flex justify-between text-gray-505">
                <span>WARZONE API SHELL:</span>
                <span className="text-white font-mono">CV_v3.2_SECURE</span>
              </div>
              <div className="flex justify-between text-gray-505">
                <span>ANTI-CHEAT ENGAGED:</span>
                <span className="text-red-400 font-mono">STRICT CRITERIA</span>
              </div>
              <div className="flex justify-between text-gray-505">
                <span>ZIM HOST SERVER:</span>
                <span className="text-red-500 font-mono">AWS_CAPE_TOWN</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL TABS CONTROLLED MATRIX */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB BAR NAVIGATION SWITCHER */}
          <div className="flex border-b border-red-500/20 bg-[#0b0b0b] p-1 rounded-xl">
            {[
              { id: "overview", label: "📖 DETAILED OVERVIEW", icon: Info },
              { id: "leaderboard", label: "📊 STANDINGS", icon: Trophy },
              { id: "teams", label: "👥 CONTESTED TEAMS", icon: Users },
              { id: "brackets", label: "📋 BRACKETS", icon: Shield },
              { id: "lounge", label: "💬 TOURNAMENT LOUNGE", icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-2 text-[10px] md:text-xs font-black tracking-widest font-russo uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected 
                      ? "bg-red-650 text-white shadow-md border border-red-500/20" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={13} className="shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="inline sm:hidden">{tab.label.split(" ").pop()}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTAINER BODY CONTENTS */}
          <div className="bg-[#070b17] border border-red-500/20 rounded-xl p-6 shadow-xl text-left">
            
            {/* 1. OVERVIEW TAB PANEL */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in font-chakra">
                
                {/* ABOUT HEADER AND REGULATORY COMPLIANCE SYSTEM METRICS */}
                <div className="flex flex-col md:flex-row gap-5 items-start bg-[#0d0f1a] p-5 rounded-2xl border border-red-500/10">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-red-650 text-white font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full">PMGC LEVEL COMPLIANTS</span>
                      <span className="text-stone-500 text-[10px] font-mono">•</span>
                      <span className="text-zinc-400 text-[10px] font-mono uppercase">Tournament Host ID: CV-PM-09</span>
                    </div>
                    <h4 className="text-sm font-black font-russo text-white uppercase text-red-500">📖 ABOUT THE CHAMPIONSHIP</h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Welcome to the elite tournament matches hosted by CV esports — Zimbabwe's paramount PUBG Mobile Esports sanctioning body. This championship uses official **PMGC (PUBG Mobile Global Championship) Standard Match Rules**. Every custom room enforces real-time hardware telemetry diagnostics to preserve absolute integrity.
                    </p>
                  </div>
                  <div className="w-full md:w-64 bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 space-y-2">
                    <span className="text-[9px] text-zinc-500 block uppercase font-mono font-black">Active Regulations</span>
                    <ul className="space-y-1.5 text-[10px] font-sans font-semibold text-stone-300">
                      <li className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Official 10-Point PMGC Matrix
                      </li>
                      <li className="flex items-center gap-1.5 text-red-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        iPad & Emulator Blocks Active
                      </li>
                      <li className="flex items-center gap-1.5 text-yellow-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        Third-Party Triggers Restrained
                      </li>
                      <li className="flex items-center gap-1.5 text-cyan-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Strict Anti-Teaming Scanners
                      </li>
                    </ul>
                  </div>
                </div>

                {/* PRIZE POOL DISTRIBUTION VISUALIZATION */}
                {(() => {
                  const getPrizeValue = () => {
                    if (tournament.prizeValueUSD) return tournament.prizeValueUSD;
                    const cleanStr = (tournament.prizePool || "").toLowerCase();
                    const cashMatch = cleanStr.match(/\$(\d+[\d,]*)/);
                    if (cashMatch) {
                      return parseInt(cashMatch[1].replace(/,/g, ""), 10);
                    }
                    const coinMatch = cleanStr.match(/(\d+[\d,]*)/);
                    if (coinMatch) {
                      return parseInt(coinMatch[1].replace(/,/g, ""), 10);
                    }
                    return 1000; // fallback
                  };

                  const formatPrizeAmount = (val: number) => {
                    const isUSD = (tournament.prizePool || "").includes("$") || (tournament.prizePool || "").toLowerCase().includes("usd") || (tournament.prizePool || "").toLowerCase().includes("cash");
                    if (isUSD) {
                      return `$${val.toLocaleString()}`;
                    }
                    const isCoins = (tournament.prizePool || "").toLowerCase().includes("coin");
                    if (isCoins) {
                      return `${val.toLocaleString()} Coins`;
                    }
                    const isUC = (tournament.prizePool || "").toLowerCase().includes("uc");
                    if (isUC) {
                      return `${val.toLocaleString()} UC`;
                    }
                    const isMerit = (tournament.prizePool || "").toLowerCase().includes("merit");
                    if (isMerit) {
                      return `${val.toLocaleString()} Merits`;
                    }
                    return `$${val.toLocaleString()}`;
                  };

                  const prizeVal = getPrizeValue();
                  const distributionData = [
                    { rank: "1st Place", percentage: 50, amount: Math.round(prizeVal * 0.50), color: "#f43f5e", label: "Champions (WWCD)" },
                    { rank: "2nd Place", percentage: 30, amount: Math.round(prizeVal * 0.30), color: "#38bdf8", label: "Runners-Up" },
                    { rank: "3rd Place", percentage: 15, amount: Math.round(prizeVal * 0.15), color: "#facc15", label: "Second Runners-Up" },
                    { rank: "MVP / Fragger", percentage: 5, amount: Math.round(prizeVal * 0.05), color: "#10b981", label: "Championship MVP" }
                  ];

                  return (
                    <div className="bg-[#0b0f1a] p-5 rounded-2xl border border-red-500/10 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800 pb-3">
                        <div>
                          <h4 className="text-sm font-black font-russo text-white uppercase text-red-500 flex items-center gap-2">
                            <Trophy size={15} className="text-red-500 animate-pulse" />
                            🏆 PRIZE POOL DISTRIBUTION
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                            Interactive allocation breakdown by finishing position for <span className="text-white font-semibold font-mono">{tournament.title}</span>
                          </p>
                        </div>
                        <div className="bg-red-955/15 px-3 py-1.5 rounded-lg border border-red-900/20 flex flex-col items-end shrink-0">
                          <span className="text-[9px] text-zinc-550 uppercase font-mono font-bold">TOTAL TOURNAMENT POOL</span>
                          <span className="text-sm font-russo font-black text-red-500 leading-none mt-0.5">{tournament.prizePool}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Recharts Bar Chart */}
                        <div className="lg:col-span-7 h-[200px] w-full bg-zinc-950/40 rounded-xl p-2 border border-zinc-900 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={distributionData}
                              layout="vertical"
                              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                            >
                              <XAxis type="number" stroke="#52525b" fontSize={9} tickFormatter={(val) => `${val}%`} />
                              <YAxis dataKey="rank" type="category" stroke="#a1a1aa" fontSize={10} width={75} />
                              <RechartsTooltip
                                cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-[#080a10] border border-red-500/30 p-2.5 rounded-lg text-xs shadow-xl font-chakra space-y-1">
                                        <p className="font-russo uppercase text-white font-bold text-[11px] tracking-wide" style={{ color: data.color }}>{data.rank}</p>
                                        <p className="text-zinc-400 text-[10px]">{data.label}</p>
                                        <div className="flex justify-between gap-4 border-t border-zinc-800 pt-1 mt-1 text-[10px] font-mono">
                                          <span className="text-zinc-550">Share:</span>
                                          <span className="text-white font-bold">{data.percentage}%</span>
                                        </div>
                                        <div className="flex justify-between gap-4 text-[10px] font-mono">
                                          <span className="text-zinc-550">Payout:</span>
                                          <span className="text-emerald-400 font-bold">{formatPrizeAmount(data.amount)}</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar dataKey="percentage" barSize={14} radius={[0, 4, 4, 0]}>
                                {distributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Breakdown details columns/list */}
                        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                          {distributionData.map((item) => (
                            <div 
                              key={item.rank}
                              className="p-3 rounded-xl border border-zinc-900 bg-zinc-950/80 hover:border-zinc-800 transition-all flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {/* Color indicator with absolute pulse */}
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-65" style={{ backgroundColor: item.color }} />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: item.color }} />
                                </span>
                                
                                <div className="min-w-0">
                                  <strong className="text-[11px] font-russo uppercase text-stone-100 tracking-wider block leading-none">
                                    {item.rank}
                                  </strong>
                                  <span className="text-[8.5px] text-zinc-500 font-mono tracking-normal block mt-0.5">
                                    {item.label}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[12px] font-mono font-black text-white block leading-none">
                                  {formatPrizeAmount(item.amount)}
                                </span>
                                <span className="text-[8px] bg-zinc-900 text-zinc-400 font-mono px-1.5 py-0.5 rounded border border-zinc-850 inline-block mt-1">
                                  {item.percentage}% SHARE
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* SIDE-BY-SIDE POINTS COMPARISON AND INTERACTIVE PMGC MATCH CALCULATOR */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Point System Matrix Grid comparison side-by-side */}
                  <div className="bg-zinc-950 p-4 rounded-xl border border-stone-900 xl:col-span-2 space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                      <h5 className="text-xs font-black font-russo text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={13} />
                        POINT MATRICES COMPARISON: STANDARD VS PMGC
                      </h5>
                      <span className="text-[9px] text-zinc-400 font-mono">10PT Standard Since 2023</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      {/* Standard Columns */}
                      <div className="space-y-2 bg-zinc-900/35 p-3 rounded-lg border border-zinc-900/50">
                        <span className="text-[10px] text-zinc-400 block font-bold border-b border-zinc-850 pb-1.5 uppercase font-sans">Classic 15pt Point System</span>
                        <div className="space-y-1.5">
                          <div className="flex justify-between"><span>1st Place (WWCD)</span><span className="font-extrabold text-white">15 PTS</span></div>
                          <div className="flex justify-between"><span>2nd Place</span><span className="text-stone-300">12 PTS</span></div>
                          <div className="flex justify-between"><span>3rd Place</span><span className="text-stone-300">10 PTS</span></div>
                          <div className="flex justify-between"><span>4th Place</span><span className="text-stone-300">8 PTS</span></div>
                          <div className="flex justify-between"><span>5th Place</span><span className="text-stone-300">6 PTS</span></div>
                          <div className="flex justify-between"><span>6th Place</span><span className="text-stone-400">4 PTS</span></div>
                          <div className="flex justify-between"><span>7th - 10th Place</span><span className="text-stone-400">2 PTS</span></div>
                          <div className="flex justify-between text-red-500 font-semibold"><span>Confirmed Kill 🎯</span><span>1 PT Ea</span></div>
                        </div>
                      </div>

                      {/* Official PMGC Columns */}
                      <div className="space-y-2 bg-[#090e1c] p-3 rounded-lg border border-red-500/10">
                        <span className="text-[10px] text-red-400 block font-bold border-b border-red-950/40 pb-1.5 uppercase font-sans flex items-center justify-between">
                          <span>PMGC 10pt System</span>
                          <span className="bg-red-950 text-red-500 text-[8px] px-1.5 rounded uppercase font-bold tracking-widest border border-red-800/30">ACTIVE</span>
                        </span>
                        <div className="space-y-1.5 text-stone-200">
                          <div className="flex justify-between text-red-400 font-bold"><span>1st Place (WWCD) 🍗</span><span>10 PTS</span></div>
                          <div className="flex justify-between"><span>2nd Place</span><span className="text-stone-300">6 PTS</span></div>
                          <div className="flex justify-between"><span>3rd Place</span><span className="text-stone-400">5 PTS</span></div>
                          <div className="flex justify-between"><span>4th Place</span><span className="text-stone-400">4 PTS</span></div>
                          <div className="flex justify-between"><span>5th Place</span><span className="text-stone-400">3 PTS</span></div>
                          <div className="flex justify-between"><span>6th Place</span><span className="text-stone-400">2 PTS</span></div>
                          <div className="flex justify-between"><span>7th - 8th Place</span><span className="text-stone-500">1 PT</span></div>
                          <div className="flex justify-between text-yellow-500 font-bold"><span>Confirmed Kill 🎯</span><span>1 PT Ea</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-red-950/10 border border-red-900/35 rounded-lg text-[9.5px] leading-relaxed text-red-400">
                      📊 <strong>Tactical note:</strong> PMGC point configurations reduce variance. Rather than placing a premium on pure placement camping, the modern 10pt system rewards high-aggression squads that secure proactive map territory control.
                    </div>
                  </div>

                  {/* INTERACTIVE SCORE CONVERTER TOOL CLOCK */}
                  <div className="bg-[#0b0c13] p-4 rounded-xl border border-red-500/20 font-sans space-y-4 text-left">
                    <div className="border-b border-zinc-900 pb-2">
                      <h5 className="text-xs font-black font-russo text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Settings size={13} className="text-red-500 animate-spinStyle" style={{ animationDuration: "12s" }} />
                        PMGC POINTS CALCULATOR
                      </h5>
                      <span className="text-[10px] text-zinc-550 block font-chakra font-medium">Model custom scenarios and compare points in real time!</span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="block text-[8.5px] text-zinc-400 font-sans uppercase mb-1">Squad Finish Rank:</label>
                        <select
                          value={calcPlacement}
                          onChange={(e) => setCalcPlacement(parseInt(e.target.value) || 1)}
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white font-mono rounded"
                        >
                          <option value="1">1st Place (Winner Winner Chicken Dinner 🍗)</option>
                          <option value="2">2nd Place</option>
                          <option value="3">3rd Place</option>
                          <option value="4">4th Place</option>
                          <option value="5">5th Place</option>
                          <option value="6">6th Place</option>
                          <option value="7">7th Place</option>
                          <option value="8">8th Place</option>
                          <option value="9">9th Place (No placement pts)</option>
                          <option value="10">10th Place+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8.5px] text-zinc-400 font-sans uppercase mb-1">Squad Confirmed Kills Count:</label>
                        <input
                          type="number"
                          min="0"
                          max="40"
                          value={calcKills}
                          onChange={(e) => setCalcKills(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white font-mono rounded"
                        />
                      </div>

                      {/* Display Computed outcomes side-by-side */}
                      <div className="bg-[#040508] p-3 rounded-lg border border-zinc-900/60 font-chakra space-y-2">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold font-mono">SIMULATION RESULT:</span>
                        
                        {/* PMGC Math */}
                        {(() => {
                          let pmgcPlacementPts = 0;
                          if (calcPlacement === 1) pmgcPlacementPts = 10;
                          else if (calcPlacement === 2) pmgcPlacementPts = 6;
                          else if (calcPlacement === 3) pmgcPlacementPts = 5;
                          else if (calcPlacement === 4) pmgcPlacementPts = 4;
                          else if (calcPlacement === 5) pmgcPlacementPts = 3;
                          else if (calcPlacement === 6) pmgcPlacementPts = 2;
                          else if (calcPlacement === 7 || calcPlacement === 8) pmgcPlacementPts = 1;

                          let classicPlacementPts = 0;
                          if (calcPlacement === 1) classicPlacementPts = 15;
                          else if (calcPlacement === 2) classicPlacementPts = 12;
                          else if (calcPlacement === 3) classicPlacementPts = 10;
                          else if (calcPlacement === 4) classicPlacementPts = 8;
                          else if (calcPlacement === 5) classicPlacementPts = 6;
                          else if (calcPlacement === 6) classicPlacementPts = 4;
                          else if (calcPlacement >= 7 && calcPlacement <= 10) classicPlacementPts = 2;

                          const pmgcTotal = pmgcPlacementPts + calcKills;
                          const classicTotal = classicPlacementPts + calcKills;

                          return (
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-stone-300">
                                <span className="font-mono text-xs">PMGC Score:</span>
                                <strong className="text-red-500 font-russo text-base font-bold text-right">{pmgcTotal} <span className="text-[10px] text-zinc-500 font-mono">PTS</span></strong>
                              </div>
                              <div className="text-[9.5px] text-zinc-500 font-mono border-b border-zinc-900/60 pb-1.5 leading-none flex gap-1 justify-end">
                                <span>({pmgcPlacementPts} Place</span>
                                <span>+</span>
                                <span>{calcKills} Kills)</span>
                              </div>

                              <div className="flex justify-between items-center text-zinc-400">
                                <span className="font-mono text-[11px]">Classic Score:</span>
                                <strong className="text-zinc-200 font-russo text-sm text-right">{classicTotal} <span className="text-[10px] text-zinc-500 font-mono font-normal">PTS</span></strong>
                              </div>
                              <div className="text-[9px] text-zinc-650 font-mono leading-none flex gap-1 justify-end">
                                <span>({classicPlacementPts} Place</span>
                                <span>+</span>
                                <span>{calcKills} Kills)</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                </div>

                {/* CHAMPIONSHIP GUIDELINES DIRECTORIES */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-[#ff001f]/10 pb-2">
                    <h4 className="text-sm font-black font-russo text-white uppercase text-red-500 flex items-center gap-2">
                      <Shield size={16} />
                      PLATFORM PMGC REGULATORY COMPLIANCE DIRECTORY
                    </h4>
                    <span className="text-[9px] text-zinc-500 font-mono">UPDATED FOR ACTIVE REGISTRATION</span>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 list-none">
                    {/* Device limitations */}
                    <li className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-500/20 transition-all flex gap-3 text-left">
                      <Phone size={22} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <strong className="text-xs font-russo text-white uppercase tracking-wider block">🛡️ DEVICE & TELEMETRY CHECKS</strong>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Only approved in-hand mobile smartphones are permitted. No computer emulators, no iPads or tablet screens, and absolutely no external clip-on buttons, cooling fans with integrated physical triggers, or macro scripts can be rigged. Any detection of cross-device code overrides triggers automatic instant lobby bans.
                        </p>
                      </div>
                    </li>

                    {/* Team check-ins */}
                    <li className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-500/20 transition-all flex gap-3 text-left">
                      <Clock size={22} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-xs font-russo text-white uppercase tracking-wider block">⏱️ 15-MINUTE LOCK & NO-SHOW POLICY</strong>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Squad captains must execute teammate check-ins inside the Strategy Rooms or Chat Panel exactly 15 minutes before maps initialize. Failure to confirm active presence will pass the reservation slot to the waitlist queue instantly, and trigger automatic Team Reliability Score deductions.
                        </p>
                      </div>
                    </li>

                    {/* Map pool */}
                    <li className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-500/20 transition-all flex gap-3 text-left">
                      <Map size={22} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-xs font-russo text-white uppercase tracking-wider block">🌍 STRICT MAP CONFIGURATIONS</strong>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          All lobby games are generated with official TPP (Third Person Perspective) settings in Erangel, Miramar, and Sanhok. Standard PMGC zone progression speed, and default safe-line ratios are managed automatically by the CV Host Cape Town servers shell. No custom server speedups.
                        </p>
                      </div>
                    </li>

                    {/* Tie breakers */}
                    <li className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-500/20 transition-all flex gap-3 text-left">
                      <Trophy size={22} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-xs font-russo text-white uppercase tracking-wider block">🏅 PMGC COMPREHENSIVE TIE-BREAKERS</strong>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          If total bracket scores end in ties: (1) Total Chicken Dinner (WWCD) counts will triumph, followed by (2) Cumulative Placement points, then (3) Cumulative kill counters, and finally (4) Best finish rank obtained in the final map of the round schedule.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Additional Tournament Rules */}
                <div className="bg-[#05060b] p-4 rounded-xl border border-zinc-901 space-y-2">
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">General Championship Rules</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-sans text-stone-300">
                    {tournament.rules.map((rule, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-black/40 p-2 rounded border border-zinc-900">
                        <CheckCircle className="text-emerald-500 shrink-0" size={13} />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. LEADERBOARD / STANDINGS TAB PANEL */}
            {activeTab === "leaderboard" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                  <div>
                    <h4 className="text-sm font-black font-russo text-white uppercase text-red-500">📊 OFFICIAL LEADERBOARD REVIEWS</h4>
                    <p className="text-[10px] text-gray-400 font-chakra mt-0.5">Real-time match scoring and kills metrics computed on live client updates.</p>
                  </div>
                  <span className="text-[9px] bg-red-950 border border-red-800 text-red-400 font-mono px-2 py-0.5 rounded uppercase font-black animate-pulse">
                    Live Ticker Feed
                  </span>
                </div>

                {/* Gaming Standings Responsive Board */}
                <div className="overflow-x-auto relative rounded-lg border border-stone-900 custom-scrollbar bg-[#02040a]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-900/40 text-gray-400 uppercase font-mono border-b border-stone-800 text-[10px]">
                        <th className="py-3 px-4 font-black">POS</th>
                        <th className="py-3 px-4 font-black">TEAM / SQUAD NO</th>
                        <th className="py-3 px-4 font-black text-center">MATCHES</th>
                        <th className="py-3 px-4 font-black text-center">CONFIRMED KILLS</th>
                        <th className="py-3 px-4 font-black text-center">PLACE PTS</th>
                        <th className="py-3 px-4 font-black text-center">WWCD 🍗</th>
                        <th className="py-3 px-4 font-black text-right text-red-500">TOTAL POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 text-stone-200">
                      {getLeaderboardData().map((team, index) => {
                        const rankStyles = 
                          index === 0 ? "bg-red-500/10 text-red-500 border border-red-500/30 font-black animate-pulse" :
                          index === 1 ? "bg-stone-200/10 text-[#CCCCCC] border border-[#CCCCCC]/20" :
                          index === 2 ? "bg-zinc-850 text-white border border-stone-800" :
                          "bg-zinc-950 text-gray-500 border border-zinc-900";
                        return (
                          <tr key={index} className="hover:bg-zinc-900/30 transition-all font-sans font-medium">
                            <td className="py-3.5 px-4">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-russo text-[10px] font-black ${rankStyles}`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                              <span>🇿🇼</span>
                              <span className="font-chakra">{team.teamName}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold">{team.matchesPlayed || 4}</td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400">{team.kills}</td>
                            <td className="py-3.5 px-4 text-center font-mono text-stone-400">{team.placePoints || (15 - index * 2)}</td>
                            <td className="py-3.5 px-4 text-center font-mono text-red-500 font-extrabold">{team.wwcd || (index === 0 ? 2 : index === 1 ? 1 : 0)}</td>
                            <td className="py-3.5 px-4 text-right font-mono font-black text-white text-sm">
                              {team.points}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-zinc-950 border border-stone-900 rounded-lg text-[10px] text-gray-500 leading-normal font-mono uppercase text-center">
                  PLACEMENT CRITERIA DETERMINES TIE-BREAKS. ALL RESULTS RECORDED BY CV HOSTS AND CV SECURE SHELL CORES.
                </div>
              </div>
            )}

            {/* 3. TEAMS TAB PANEL */}
            {activeTab === "teams" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                  <div>
                    <h4 className="text-sm font-black font-russo text-white uppercase text-red-500">👥 REGISTERED CHAMPIONSHIP TEAMS</h4>
                    <p className="text-[10px] text-gray-400 font-chakra mt-0.5">Rosters validated on the system. Zimbabwe region certified gamers directory.</p>
                  </div>
                  <span className="text-[9px] bg-zinc-950 border border-stone-850 text-red-500 font-mono px-2.5 py-0.5 rounded uppercase font-black">
                    {tournament.registeredTeams.length} TOTAL SQUADS
                  </span>
                </div>

                {/* Grid of contestant clans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {zimbabweClans.map((clan, idx) => {
                    const isUserClan = clan.captain === session.ign;
                    return (
                      <div 
                        key={idx} 
                        className={`p-4 bg-zinc-950 hover:bg-stone-900/40 rounded-xl border transition-all duration-300 relative overflow-hidden flex items-center justify-between font-chakra ${
                          isUserClan ? "border-red-500" : "border-stone-900"
                        }`}
                      >
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{clan.flag}</span>
                            <span className="font-russo text-xs text-white uppercase font-black">{clan.name}</span>
                            {isUserClan && (
                              <span className="text-[8px] bg-red-500/15 text-red-500 border border-red-500/30 px-1.5 py-0.2 rounded uppercase font-extrabold font-mono animate-pulse">
                                YOU
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[11px] text-gray-550">
                            CAPTAIN: <strong className="text-stone-300 font-mono">{clan.captain}</strong>
                          </p>

                          <div className="text-[10px] text-gray-500 font-mono uppercase flex gap-4 pt-1">
                            <span>MEMBERS: 4/4</span>
                            <span className="text-red-400">✓ CERTIFIED</span>
                          </div>
                        </div>

                        <span className={`font-russo font-black text-2xl opacity-15 selection:bg-transparent ${clan.logoColor}`}>
                          #{clan.tag}
                        </span>
                      </div>
                    );
                  })}

                  {/* Dynamically register your squad if not registered */}
                  {!isUserRegistered && (
                    <div className="p-4 bg-red-950/10 border-2 border-dashed border-red-500/20 hover:border-red-500/40 rounded-xl transition-all flex flex-col justify-center items-center font-chakra cursor-pointer space-y-2 py-6 text-center"
                         onClick={() => onRegister(tournament.id)}>
                      <Users className="text-red-500 animate-bounce" size={24} />
                      <div>
                        <strong className="text-sm text-red-500 uppercase block font-russo font-black">RESERVE YOUR ROSTER NOW</strong>
                        <span className="text-[10px] text-gray-400 font-medium">Add {session.ign} squad to the registered contestant clans directory!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. BRACKETS AND FIXTURES */}
            {activeTab === "brackets" && (
              <div className="space-y-5 animate-fade-in font-chakra">
                <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                  <div>
                    <h4 className="text-sm font-black font-russo text-white uppercase text-red-500">📋 BRACKETS, ROOMS & MATCHES DIRECTORY</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Custom lobbies coordinate schedules. Match IDs are secure.</p>
                  </div>
                  <span className="text-[9px] bg-red-950/40 border border-red-500/40 text-red-500 font-mono px-2 py-0.5 rounded font-black">
                    Rooms Dispatched via Core
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { matchNum: 1, name: "Placement Match #01", map: "Erangel", time: "18:00 UTC", status: "Room Dispatched", lobbyId: "888891", lobbyPass: "zimpubg" },
                    { matchNum: 2, name: "Championship Round #02", map: "Miramar", time: "19:00 UTC", status: "Queued / Pending", lobbyId: "TBD", lobbyPass: "TBD" },
                    { matchNum: 3, name: "Combat Final Round #03", map: "Sanhok", time: "20:00 UTC", status: "Queued / Pending", lobbyId: "TBD", lobbyPass: "TBD" }
                  ].map((match, i) => (
                    <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-stone-900 hover:border-red-500/10 transition-all text-left">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-stone-900 text-stone-200 border border-zinc-800 rounded flex items-center justify-center font-mono text-[10px] font-black">
                              M{match.matchNum}
                            </span>
                            <h5 className="font-russo text-xs text-white uppercase tracking-wider">{match.name}</h5>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                              match.status.includes("Dispatched") 
                                ? "bg-red-950/40 border border-red-500/30 text-red-400 animate-pulse" 
                                : "bg-stone-900 text-stone-400"
                            }`}>
                              {match.status}
                            </span>
                          </div>

                          <div className="flex gap-4 text-[11px] text-gray-500">
                            <span>MAP: <strong className="text-stone-300 font-mono">{match.map}</strong></span>
                            <span>TIME: <strong className="text-white font-mono">{match.time}</strong></span>
                          </div>
                        </div>

                        {/* Room Credentials (show only if first match, others TBD) */}
                        <div className="p-3 bg-zinc-950 rounded-lg border border-red-500/20 md:w-64 font-mono text-[11px] space-y-1 text-left">
                          <div className="flex justify-between">
                            <span className="text-gray-500 uppercase font-black text-[9px]">LOBBY ROOM ID:</span>
                            <span className="text-white font-extrabold">{match.lobbyId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 uppercase font-black text-[9px]">LOBBY PASSWORD:</span>
                            <span className="text-red-500 font-extrabold">{match.lobbyPass}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-red-950/10 border border-red-950 text-red-400 text-[10px] rounded-lg leading-snug flex items-center gap-3">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>
                    🚯 <strong>CAPTAINS' SECURITY SYSTEM:</strong> Do NOT share room details outside the registered squad chat panels. Leaking credentials will cause instantaneous platform permanent disqualifications.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "lounge" && (
              <div className="animate-fade-in">
                <TournamentLoungeChat
                  tournamentId={tournament.id}
                  tournamentTitle={tournament.title}
                  session={session}
                  awardXp={awardXp}
                  setSystemAlertMessage={setSystemAlertMessage}
                />
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
