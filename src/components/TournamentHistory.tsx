import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  Award,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Shield,
  Gamepad2,
  Flame,
  Filter,
  TrendingUp,
  Star,
  Users2
} from "lucide-react";

interface RosterMember {
  name: string;
  role: "IGL" | "Assaulter" | "Sniper" | "Support" | "Fragger" | "Soloist";
  kills: number;
  accuracy: string;
}

interface PastEvent {
  id: string;
  title: string;
  date: string;
  mode: "Solo" | "Duo" | "Squad";
  prizePool: string;
  winningTeam: string;
  roster: RosterMember[];
  stats: {
    totalPoints: number;
    totalKills: number;
    chickenDinners: number;
    placementPoints: number;
  };
  runnerUp: string;
  mvp: string;
  mvpKills: number;
  mvpClass: string;
  description: string;
  mapLineup: string;
}

interface SeasonHistory {
  seasonId: string;
  seasonName: string;
  period: string;
  bannerQuote: string;
  championClub: string;
  events: PastEvent[];
}

const PAST_SEASONS_DATA: SeasonHistory[] = [
  {
    seasonId: "s10",
    seasonName: "Season 10: Crimson Conquest",
    period: "January 2026 - April 2026",
    bannerQuote: "A season dominated by high-intensity combat, military base drops, and tactical split rosters.",
    championClub: "CV Crimson Vipers",
    events: [
      {
        id: "pe1",
        title: "PUBG Mobile Spring Showdown 2026",
        date: "February 24, 2026",
        mode: "Squad",
        prizePool: "$5,000 USD Bounty",
        winningTeam: "CV Crimson Vipers",
        roster: [
          { name: "CV_Krypton", role: "IGL", kills: 18, accuracy: "32%" },
          { name: "CV_HyperBeast", role: "Assaulter", kills: 26, accuracy: "38%" },
          { name: "CV_Apex", role: "Sniper", kills: 22, accuracy: "42%" },
          { name: "CV_ViperSlayer", role: "Support", kills: 16, accuracy: "29%" }
        ],
        stats: {
          totalPoints: 134,
          totalKills: 82,
          chickenDinners: 4,
          placementPoints: 52
        },
        runnerUp: "Team Liquid Academy",
        mvp: "CV_HyperBeast",
        mvpKills: 26,
        mvpClass: "Precision M762 Spammer",
        description: "The Crimson Vipers secured back-to-back Chicken Dinners on Miramar and Erangel military island circles, dominating elevated ridges and maintaining pristine coordinate split streams.",
        mapLineup: "Erangel (x3), Miramar (x2), Sanhok (x1)"
      },
      {
        id: "pe2",
        title: "Tactical Duo Skirmish Cup",
        date: "March 18, 2026",
        mode: "Duo",
        prizePool: "100,000 UC + $1,000 Cash",
        winningTeam: "Hydra Sight Duo",
        roster: [
          { name: "Hydra_Focus", role: "Sniper", kills: 18, accuracy: "45%" },
          { name: "Hydra_Eclipse", role: "Assaulter", kills: 14, accuracy: "34%" }
        ],
        stats: {
          totalPoints: 55,
          totalKills: 32,
          chickenDinners: 2,
          placementPoints: 23
        },
        runnerUp: "Apex Gunners",
        mvp: "Hydra_Focus",
        mvpKills: 18,
        mvpClass: "AWM Long Range Specialist",
        description: "A high-stakes duo tournament with extreme circle settings. Precise covering smokes on Rozhok hill by Hydra Sight Duo in the 7th circle sealed the championship.",
        mapLineup: "Miramar (x2), Vikendi (x1)"
      }
    ]
  },
  {
    seasonId: "s9",
    seasonName: "Season 9: Apex Vanguard",
    period: "September 2025 - December 2025",
    bannerQuote: "Cold snow terrain wars testing rotation times, vehicle protection tactics, and long-range utility efficiency.",
    championClub: "FaZe Vanguard Recruits",
    events: [
      {
        id: "pe3",
        title: "Winter Master Championship 2025",
        date: "December 15, 2025",
        mode: "Squad",
        prizePool: "$3,500 USD Cash",
        winningTeam: "FaZe Vanguard Recruits",
        roster: [
          { name: "FaZe_Raptor", role: "Fragger", kills: 24, accuracy: "39%" },
          { name: "FaZe_Doom", role: "IGL", kills: 15, accuracy: "31%" },
          { name: "FaZe_Viper", role: "Support", kills: 17, accuracy: "28%" },
          { name: "FaZe_Neon", role: "Assaulter", kills: 15, accuracy: "34%" }
        ],
        stats: {
          totalPoints: 118,
          totalKills: 71,
          chickenDinners: 3,
          placementPoints: 47
        },
        runnerUp: "CV Elite Five",
        mvp: "FaZe_Raptor",
        mvpKills: 24,
        mvpClass: "CQC Groza Devastator",
        description: "Vikendi's heavy snow slopes hosted intense snowmobile rotations. Faze recruits defended the high Castle choke points perfectly against CV Elite's aggressive final rush.",
        mapLineup: "Vikendi (x3), Erangel (x2), Miramar (x1)"
      },
      {
        id: "pe4",
        title: "Erangel Solo Survivor Cup",
        date: "November 08, 2025",
        mode: "Solo",
        prizePool: "50,050 UC Value",
        winningTeam: "SoloSlayer_99",
        roster: [
          { name: "SoloSlayer_99", role: "Soloist", kills: 19, accuracy: "40%" }
        ],
        stats: {
          totalPoints: 34,
          totalKills: 19,
          chickenDinners: 1,
          placementPoints: 15
        },
        runnerUp: "CV_Krypton",
        mvp: "SoloSlayer_99",
        mvpKills: 19,
        mvpClass: "Prone Stealth Master",
        description: "A complete masterclass in stealth and positioning. SoloSlayer_99 utilized Ghillie suits on Pochinki fields to meticulously clear out the final top-5 circles.",
        mapLineup: "Erangel (x1)"
      }
    ]
  },
  {
    seasonId: "s8",
    seasonName: "Season 8: Glacier Storm",
    period: "May 2025 - August 2025",
    bannerQuote: "A classic season focusing heavily on fast circles, compound defenses, and pristine bridge blocks.",
    championClub: "BlackMamba Gaming",
    events: [
      {
        id: "pe5",
        title: "Sanhok Jungle Rumble 2025",
        date: "August 12, 2025",
        mode: "Squad",
        prizePool: "$2,500 USD Bounty",
        winningTeam: "BlackMamba Gaming",
        roster: [
          { name: "BM_Cobra", role: "Fragger", kills: 20, accuracy: "36%" },
          { name: "BM_Python", role: "IGL", kills: 12, accuracy: "28%" },
          { name: "BM_Taipan", role: "Sniper", kills: 18, accuracy: "41%" },
          { name: "BM_Viper", role: "Support", kills: 15, accuracy: "30%" }
        ],
        stats: {
          totalPoints: 107,
          totalKills: 65,
          chickenDinners: 3,
          placementPoints: 42
        },
        runnerUp: "Team Frost",
        mvp: "BM_Cobra",
        mvpKills: 20,
        mvpClass: "SMG Close Combat Demon",
        description: "Fierce jungle rain conditions in Sanhok. BlackMamba Gaming set up a flawless bridge barricade on the island chokehold channel, capturing rotating squads off guard.",
        mapLineup: "Sanhok (x4), Karakin (x1)"
      }
    ]
  }
];

export default function TournamentHistory() {
  const [selectedSeason, setSelectedSeason] = useState<string>("s10");
  const [searchQuery, setSearchQuery] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<"All" | "Solo" | "Duo" | "Squad">("All");
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Filter based on active conditions
  const activeSeasonData = PAST_SEASONS_DATA.find(s => s.seasonId === selectedSeason);
  
  const filteredEvents = activeSeasonData
    ? activeSeasonData.events.filter(e => {
        const matchesMode = modeFilter === "All" || e.mode === modeFilter;
        const matchesSearch = searchQuery === "all" || 
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          e.winningTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.mvp.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMode && matchesSearch;
      })
    : [];

  const toggleEventExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <div id="tournament-history-section" className="bg-[#0c0d12]/90 border border-zinc-800 rounded-3xl p-6 text-white space-y-6 relative overflow-hidden font-chakra">
      
      {/* Decorative Corner Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-505/10 border border-amber-500/20 rounded-lg text-amber-400 font-mono text-[9px] uppercase tracking-widest leading-none mb-1">
            <Trophy size={11} className="text-amber-500 animate-pulse" />
            <span>ARCHIVED HALL OF FAME</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-orbitron text-white tracking-tight uppercase flex items-center gap-2">
            🏆 TOURNAMENT HISTORIES & WINNING ROSTERS
          </h2>
          <p className="text-[11px] text-zinc-450 font-mono uppercase tracking-wide">
            Detailed archives, complete champions, roster diagnostics and MVPs since Season 8
          </p>
        </div>

        {/* Season Nav Selector pills */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-zinc-80s">
          {PAST_SEASONS_DATA.map((s) => (
            <button
              key={s.seasonId}
              type="button"
              onClick={() => {
                setSelectedSeason(s.seasonId);
                setExpandedEventId(null);
              }}
              className={`px-3 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all rounded-lg cursor-pointer ${
                selectedSeason === s.seasonId
                  ? "bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
              }`}
            >
              {s.seasonName.split(":")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Season Fast Fact Board */}
      {activeSeasonData && (
        <div className="bg-gradient-to-r from-amber-500/10 via-red-950/20 to-zinc-950/40 border border-amber-500/15 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h3 className="text-xs font-black font-mono tracking-widest text-amber-400 uppercase">
              {activeSeasonData.seasonName.toUpperCase()} CHAMPIONSHIP SUMMARY
            </h3>
            <p className="text-xs text-zinc-300 italic">
              "{activeSeasonData.bannerQuote}"
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">
              📅 PERIOD ACTIVE: <span className="text-zinc-300 font-sans italic">{activeSeasonData.period}</span>
            </p>
          </div>
          
          <div className="bg-black/80 border border-amber-500/20 p-3 rounded-xl text-left shrink-0 max-w-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-550/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20">
              <Shield size={18} />
            </div>
            <div>
              <span className="text-[8px] text-zinc-500 block uppercase font-mono leading-none mb-1">SEASON CLUB CHIEF :</span>
              <strong className="text-sm font-black text-white hover:text-amber-400 tracking-wider font-orbitron uppercase">
                {activeSeasonData.championClub}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter tools */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between bg-black/40 p-2.5 rounded-2xl border border-zinc-900">
        
        {/* Search input */}
        <div className="flex-1 relative flex items-center">
          <Search size={14} className="absolute left-3 text-zinc-550" />
          <input
            type="text"
            placeholder="Search by Event, Winner Name, MVP..."
            onChange={(e) => setSearchQuery(e.target.value.trim() === "" ? "all" : e.target.value)}
            className="w-full bg-[#050505] text-xs px-9 py-2 rounded-xl focus:outline-none border border-zinc-850 focus:border-amber-500 font-sans text-white placeholder-zinc-650"
          />
        </div>

        {/* Mode filter buttons */}
        <div className="flex items-center gap-1.5 bg-black/90 p-1 border border-zinc-850 rounded-xl">
          <span className="text-[8px] text-zinc-500 font-mono px-2 font-black">GAMEPLAY:</span>
          {(["All", "Solo", "Duo", "Squad"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setModeFilter(m);
                setExpandedEventId(null);
              }}
              className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                modeFilter === m
                  ? "bg-zinc-800 text-white border border-zinc-700 font-black"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Past tournament elements listings */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-[#08090d]/80 border border-zinc-900 rounded-2xl p-10 text-center text-zinc-500 font-mono space-y-2">
            <Gamepad2 className="mx-auto text-zinc-755 stroke-[1.5]" size={32} />
            <p className="text-xs font-black uppercase text-amber-500">No past championships match query</p>
            <p className="text-[10px] text-zinc-500">Refine your search word or swap game mode filters.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isExpanded = expandedEventId === evt.id;
            
            return (
              <div
                key={evt.id}
                className={`bg-[#0a0a0f] border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-amber-500/40 shadow-xl shadow-amber-950/10"
                    : "border-zinc-850 hover:border-zinc-800"
                }`}
              >
                
                {/* HEAD SUMMARY ROW */}
                <div
                  onClick={() => toggleEventExpand(evt.id)}
                  className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-950/30 transition-colors select-none"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] bg-amber-955/30 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md font-orbitron tracking-widest font-black uppercase">
                        {evt.mode}
                      </span>
                      <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md font-mono">
                        {evt.date}
                      </span>
                    </div>
                    
                    <h3 className="text-sm md:text-base font-black text-white hover:text-amber-400 font-orbitron uppercase tracking-snug">
                      {evt.title}
                    </h3>
                    
                    <p className="text-[11px] text-zinc-500 font-sans leading-tight">
                      📍 Map rotation coordinates: <span className="text-zinc-350 italic">{evt.mapLineup}</span>
                    </p>
                  </div>

                  {/* Core Winners highlights */}
                  <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t border-zinc-900 lg:border-t-0 pt-3 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[8px] text-zinc-500 block uppercase font-mono leading-none mb-1">
                        🏆 WINNING ROSTER:
                      </span>
                      <strong className="text-amber-400 text-sm font-black font-orbitron uppercase tracking-wider block">
                        {evt.winningTeam}
                      </strong>
                    </div>

                    <div className="text-left lg:text-right">
                      <span className="text-[8px] text-zinc-500 block uppercase font-mono leading-none mb-1">
                        💰 PRIZE DECLARED:
                      </span>
                      <strong className="text-emerald-400 text-sm font-black font-sans leading-none block">
                        {evt.prizePool}
                      </strong>
                    </div>

                    {/* EXPAND TOGGLE BTN */}
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-amber-500/40 transition cursor-pointer self-center`}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* DETAILED DIAGNOSTICS AREA */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-zinc-900 bg-[#07080b]"
                    >
                      <div className="p-5 space-y-6">
                        
                        {/* Summary description & general notes */}
                        <div className="space-y-1.5 text-left bg-black/40 p-4 rounded-xl border border-zinc-900">
                          <h4 className="text-[10px] font-black font-orbitron tracking-widest text-[#ef4444] uppercase">
                            🗒️ CHAMPIONS CHRONICLE LINEUP RESUME
                          </h4>
                          <p className="text-xs text-zinc-305 leading-relaxed font-sans">
                            {evt.description}
                          </p>
                        </div>

                        {/* Middle grid: Stats block & MVP feature */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          
                          {/* 1. TEAM STATS DIAGNOSTICS */}
                          <div className="bg-black/70 p-4 rounded-xl border border-zinc-900 text-left space-y-4">
                            <h4 className="text-[10px] font-black font-orbitron tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
                              <Star size={11} className="text-amber-500" />
                              <span>WINNER SCOREBOARD MATRIX</span>
                            </h4>

                            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                              <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
                                <span className="text-zinc-600 block text-[8px] uppercase">TOTAL POINTS</span>
                                <strong className="text-white text-base font-bold">{evt.stats.totalPoints} pts</strong>
                              </div>
                              <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
                                <span className="text-zinc-600 block text-[8px] uppercase">TOTAL SQUAD KILLS</span>
                                <strong className="text-amber-400 text-base font-bold">{evt.stats.totalKills} kills</strong>
                              </div>
                              <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
                                <span className="text-zinc-600 block text-[8px] uppercase">CHICKEN DINNERS</span>
                                <strong className="text-emerald-400 text-base font-bold">{evt.stats.chickenDinners} Wins</strong>
                              </div>
                              <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
                                <span className="text-zinc-600 block text-[8px] uppercase">PLACEMENT POINTS</span>
                                <strong className="text-zinc-300 text-base font-bold">{evt.stats.placementPoints} pts</strong>
                              </div>
                            </div>
                            
                            {/* Performance visual meter */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[9px] font-mono text-zinc-550">
                                <span>ROTATION EFFICIENCY:</span>
                                <span className="text-zinc-300 font-bold">94% Optimum</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" style={{ width: "94%" }} />
                              </div>
                            </div>
                          </div>

                          {/* 2. EXTREME CHAMPIONSHIP MVP SPOTLIGHT */}
                          <div className="bg-gradient-to-br from-red-950/20 to-zinc-950 p-4 rounded-xl border border-red-550/10 text-left space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 bg-red-650/10 border-b border-l border-red-500/20 text-red-400 text-[8px] font-mono rounded-bl">
                              MVP BADGE
                            </div>

                            <h4 className="text-[10px] font-black font-orbitron tracking-widest text-[#ef4444] uppercase flex items-center gap-1.5">
                              <Flame size={12} className="text-red-500 animate-pulse" />
                              <span>TOURNAMENT HIGH FRAG MVP</span>
                            </h4>

                            <div className="space-y-1">
                              <span className="text-[10px] text-zinc-500 font-mono block">PLAYER IDENTIFIER:</span>
                              <strong className="text-lg font-black text-white font-orbitron tracking-wide uppercase block">
                                {evt.mvp}
                              </strong>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                              <div className="bg-black/60 p-1.5 rounded">
                                <span className="text-zinc-500 block text-[7px]">CHAMPION KILLS</span>
                                <strong className="text-red-400 text-xs font-black">{evt.mvpKills} Direct Frags</strong>
                              </div>
                              <div className="bg-black/60 p-1.5 rounded">
                                <span className="text-zinc-500 block text-[7px]">LOADOUT PREFER</span>
                                <strong className="text-zinc-300 text-[9px] block whitespace-nowrap overflow-hidden text-ellipsis">{evt.mvpClass}</strong>
                              </div>
                            </div>

                            <p className="text-[10.5px] italic text-zinc-400 font-sans leading-tight pt-1">
                              "Constant aggressive push metrics on final ridge skirmishes. Highly agile rotations and 1v3 squad wipeout execution."
                            </p>
                          </div>

                          {/* 3. RUNNER UP CARD INFO */}
                          <div className="bg-black/70 p-4 rounded-xl border border-zinc-900 text-left flex flex-col justify-between">
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black font-orbitron tracking-widest text-zinc-450 uppercase flex items-center gap-1.5">
                                <Users size={12} className="text-zinc-500" />
                                <span>RUNNER UP ROSTERS</span>
                              </h4>

                              <div className="bg-zinc-950 p-3 rounded border border-zinc-900/70 space-y-2">
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-zinc-500 font-mono">2ND PLACE CORNER:</span>
                                  <strong className="text-zinc-300 font-bold font-orbitron uppercase">{evt.runnerUp}</strong>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-zinc-500 font-mono">SCORING GAIN GAP:</span>
                                  <span className="text-red-400 font-semibold font-mono">-{evt.stats.totalPoints - Math.round(evt.stats.totalPoints * 0.85)} pts behind</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-[10px] text-zinc-550 font-mono border-t border-zinc-900/65 pt-3 mt-4 flex items-center gap-1.5">
                              <Star size={10} className="text-zinc-500" />
                              <span>Fair-play certified roster matches</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Winning Members grid list with details */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black font-orbitron tracking-widest text-zinc-450 uppercase text-left border-l-2 border-amber-500 pl-2">
                            👥 CHAMPIONS ROSTER INDIVIDUAL METRICS
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {evt.roster.map((player) => (
                              <div
                                key={player.name}
                                className="bg-[#111218] border border-zinc-900 hover:border-zinc-800 p-3 rounded-xl text-left space-y-2"
                              >
                                <div className="flex justify-between items-center">
                                  <strong className="text-xs font-black text-white hover:text-amber-400 font-mono">
                                    {player.name}
                                  </strong>
                                  <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-black uppercase">
                                    {player.role}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                                  <div className="bg-black/50 p-1 rounded">
                                    <span className="text-zinc-650 text-[7px] block">FRAG KILLS</span>
                                    <strong className="text-zinc-200">{player.kills} Kills</strong>
                                  </div>
                                  <div className="bg-black/50 p-1 rounded">
                                    <span className="text-zinc-650 text-[7px] block">ACCURACY</span>
                                    <strong className="text-zinc-200">{player.accuracy}</strong>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Hall of fame guidelines watermark */}
      <div className="bg-black/40 border border-zinc-900 p-3 rounded-2xl flex items-center justify-between gap-4 text-[10px] font-mono">
        <span className="text-zinc-600 uppercase">Season roster snapshot verification scanner active v2.1</span>
        <button
          type="button"
          onClick={() => {
            alert("Rosters metadata updated. Verified and encrypted by CV Esports Ledger.");
          }}
          className="text-amber-500 hover:underline cursor-pointer"
        >
          [View Ledger Certifications]
        </button>
      </div>

    </div>
  );
}
