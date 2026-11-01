import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame, Trophy, Users, Shield, Award, Play, Pause, RotateCcw,
  Plus, Check, MessageSquare, Send, Radio, MapPin, BarChart3,
  Calendar, Map, Compass, Settings, User, Sliders, Hash, ArrowRight,
  Sparkles, CheckCircle, X, ChevronRight, AlertTriangle, PlayCircle,
  TrendingUp, RefreshCw, Star, Info, Target, Eye
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

interface CVTdmEcosystemProps {
  // Existing simulator states from App.tsx
  tdmSimulatorActive: boolean;
  setTdmSimulatorActive: (active: boolean) => void;
  tdmUserScore: number;
  setTdmUserScore: (score: any) => void;
  tdmEnemyScore: number;
  setTdmEnemyScore: (score: any) => void;
  tdmWeapon: string;
  setTdmWeapon: (weapon: string) => void;
  tdmStrategy: string;
  setTdmStrategy: (strategy: string) => void;
  tdmSecondary: string;
  setTdmSecondary: (sec: string) => void;
  tdmScope: string;
  setTdmScope: (scope: string) => void;
  tdmMuzzle: string;
  setTdmMuzzle: (muzzle: string) => void;
  tdmMagazine: string;
  setTdmMagazine: (mag: string) => void;
  tdmGrip: string;
  setTdmGrip: (grip: string) => void;
  tdmTactical: string;
  setTdmTactical: (tactical: string) => void;
  copiedLoadout: boolean;
  handleCopyLoadoutCode: () => void;
  loadoutInputCode: string;
  setLoadoutInputCode: (code: string) => void;
  handleImportLoadoutCode: (code: string) => void;
  tdmLogs: string[];
  setTdmLogs: React.Dispatch<React.SetStateAction<string[]>>;
  tdmHistory: any[];
  setTdmHistory: React.Dispatch<React.SetStateAction<any[]>>;
  tdmChartData: any[];
  setTdmChartData: React.Dispatch<React.SetStateAction<any[]>>;
  tdmReplayTick: number;
  setTdmReplayTick: React.Dispatch<React.SetStateAction<number>>;
  tdmReplayIsPaused: boolean;
  setTdmReplayIsPaused: (pause: boolean) => void;
  tdmLadder: any[];
  setTdmLadder: React.Dispatch<React.SetStateAction<any[]>>;
  startTdmMatchSim: (weapon: string, strategy: string, opponent: string) => void;
  matchOpponent: string;
  setMatchOpponent: (opp: string) => void;
  selectedContinent: string;
  setSelectedContinent: (cont: string) => void;
  systemAlertMessage: string | null;
  setSystemAlertMessage: (msg: string | null) => void;
  userSession: { ign: string; role: string; coins: number; battlePassLevel: number };
}

export default function CVTdmEcosystem({
  tdmSimulatorActive,
  setTdmSimulatorActive,
  tdmUserScore,
  setTdmUserScore,
  tdmEnemyScore,
  setTdmEnemyScore,
  tdmWeapon,
  setTdmWeapon,
  tdmStrategy,
  setTdmStrategy,
  tdmSecondary,
  setTdmSecondary,
  tdmScope,
  setTdmScope,
  tdmMuzzle,
  setTdmMuzzle,
  tdmMagazine,
  setTdmMagazine,
  tdmGrip,
  setTdmGrip,
  tdmTactical,
  setTdmTactical,
  copiedLoadout,
  handleCopyLoadoutCode,
  loadoutInputCode,
  setLoadoutInputCode,
  handleImportLoadoutCode,
  tdmLogs,
  setTdmLogs,
  tdmHistory,
  setTdmHistory,
  tdmChartData,
  setTdmChartData,
  tdmReplayTick,
  setTdmReplayTick,
  tdmReplayIsPaused,
  setTdmReplayIsPaused,
  tdmLadder,
  setTdmLadder,
  startTdmMatchSim,
  matchOpponent,
  setMatchOpponent,
  selectedContinent,
  setSelectedContinent,
  systemAlertMessage,
  setSystemAlertMessage,
  userSession
}: CVTdmEcosystemProps) {
  // ECOSYSTEM TAB STATE
  const [tdmSubTab, setTdmSubTab] = useState<"battlefield" | "leagues" | "profiles" | "teamhub" | "analytics" | "hall" | "admin">("battlefield");

  // 1. MATCH TELEMETRY HUD STATES
  const [matchStatus, setMatchStatus] = useState<"LIVE" | "WAITING" | "UPCOMING" | "CONCLUDED">("WAITING");
  const [simulationTimer, setSimulationTimer] = useState("06:00");
  const [activeMvp, setActiveMvp] = useState("Alpha 'Viper'");
  
  // Real-time dynamic player stats for scoreboard (refreshes/simulates changes)
  const [blueScoreboard, setBlueScoreboard] = useState([
    { name: userSession.ign, kills: 14, deaths: 8, assists: 6, kd: 1.75, hs: "42%", dmg: 2450, rcv: 1800, streak: 5, maxStreak: 7, mvpPts: 320 },
    { name: "Alpha 'Viper'", kills: 12, deaths: 10, assists: 9, kd: 1.2, hs: "25%", dmg: 1980, rcv: 2100, streak: 3, maxStreak: 5, mvpPts: 260 },
    { name: "Lethal 'Sniper'", kills: 9, deaths: 7, assists: 4, kd: 1.28, hs: "66%", dmg: 2100, rcv: 1540, streak: 4, maxStreak: 6, mvpPts: 235 },
    { name: "Slayer 'Rush'", kills: 5, deaths: 11, assists: 5, kd: 0.45, hs: "20%", dmg: 1120, rcv: 2300, streak: 1, maxStreak: 3, mvpPts: 120 },
  ]);

  const [redScoreboard, setRedScoreboard] = useState([
    { name: "Hydra Raider", kills: 11, deaths: 11, assists: 5, kd: 1.0, hs: "28%", dmg: 1680, rcv: 1980, streak: 2, maxStreak: 4, mvpPts: 190 },
    { name: "Tox1c Slayer", kills: 10, deaths: 10, assists: 3, kd: 1.0, hs: "40%", dmg: 1840, rcv: 1890, streak: 3, maxStreak: 5, mvpPts: 215 },
    { name: "Krypton King", kills: 9, deaths: 12, assists: 7, kd: 0.75, hs: "22%", dmg: 1450, rcv: 2110, streak: 1, maxStreak: 3, mvpPts: 170 },
    { name: "Mamba Blitz", kills: 6, deaths: 7, assists: 2, kd: 0.85, hs: "16%", dmg: 1200, rcv: 1600, streak: 2, maxStreak: 3, mvpPts: 135 },
  ]);

  // Upcoming matches schedules
  const [upcomingMatches, setUpcomingMatches] = useState([
    { id: "u1", teamA: "Crimson Vipers (YOU)", teamB: "NAVI Academy", time: "19:30 UTC", map: "Warehouse", format: "4v4 Squad", state: "Countdown", secondsSec: 1800 },
    { id: "u2", teamA: "Crimson Vipers (YOU)", teamB: "Sentinels Pro", time: "21:15 UTC", map: "Ruins", format: "4v4 Squad", state: "Upcoming", secondsSec: 8100 },
    { id: "u3", teamA: "Feisty Foxes", teamB: "Hydra Focus", time: "Tomorrow", map: "Library", format: "2v2 Duo", state: "Scheduled", secondsSec: 0 },
  ]);

  // Featured match details
  const [featuredMatches, setFeaturedMatches] = useState({
    title: "CV REDEMPTION DUELS S3",
    desc: "Crimson Vipers represent Africa against top European Academy teams in real-time tactical duels.",
    reward: "500 CV Coins + Elite Badge",
    spectators: "4.2K Live",
  });

  // 2. PLAYER DOSSIERS & PERFORMANCE SYSTEM
  const [selectedProfilePlayer, setSelectedProfilePlayer] = useState("Alpha 'Viper'");
  const playerCareerDatabase: { [key: string]: any } = {
    [userSession.ign]: {
      kills: 1450, deaths: 980, assists: 670, kd: "1.48", hsPercent: "38%", winRate: "68%", mvps: 45, matches: 120,
      recentPerformance: [1.4, 1.8, 1.2, 1.6, 2.1, 1.5],
      records: "Most Damage (3,890), High Streak (12)",
      tier: "Diamond"
    },
    "Alpha 'Viper'": {
      kills: 2180, deaths: 1420, assists: 920, kd: "1.53", hsPercent: "34%", winRate: "72%", mvps: 62, matches: 180,
      recentPerformance: [1.8, 1.4, 1.9, 2.0, 1.1, 1.6],
      records: "Most Kills in Match (28), Longest Team Streak (18)",
      tier: "Elite"
    },
    "Lethal 'Sniper'": {
      kills: 1240, deaths: 710, assists: 480, kd: "1.74", hsPercent: "64%", winRate: "65%", mvps: 38, matches: 90,
      recentPerformance: [2.1, 1.9, 1.5, 2.3, 1.8, 2.0],
      records: "Most Headshots in warehouse (18), No-scope precision MVP",
      tier: "CV Legend"
    },
    "Slayer 'Rush'": {
      kills: 990, deaths: 940, assists: 810, kd: "1.05", hsPercent: "24%", winRate: "59%", mvps: 20, matches: 110,
      recentPerformance: [0.9, 1.2, 1.0, 1.1, 1.4, 1.0],
      records: "Highest assists per duel, Smoke deployment coverage MVP",
      tier: "Platinum"
    }
  };

  // Dedicated TDM Ranking standards
  const rankingTiers = [
    { tier: "CV Legend", icon: "👑", points: "2500+ PTS", color: "text-amber-400 border-amber-500/30 bg-amber-950/20", requirement: "Win Weekly Leagues & Maintain >= 1.60 K/D" },
    { tier: "Elite", icon: "🔥", points: "2100 - 2490 PTS", color: "text-red-500 border-red-500/30 bg-red-950/20", requirement: "Accumulate 40+ MVP Awards" },
    { tier: "Diamond", icon: "💠", points: "1800 - 2090 PTS", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20", requirement: "Reach 50+ Career Wins" },
    { tier: "Platinum", icon: "💎", points: "1500 - 1790 PTS", color: "text-teal-300 border-teal-500/30 bg-teal-950/20", requirement: "Reach 30+ Completed Matches" },
    { tier: "Gold", icon: "🥇", points: "1200 - 1490 PTS", color: "text-yellow-500 border-yellow-500/30 bg-yellow-950/20", requirement: "Win rate above 50%" },
    { tier: "Silver", icon: "🥈", points: "900 - 1190 PTS", color: "text-slate-300 border-slate-300/30 bg-slate-950/20", requirement: "Accumulate 100+ Total Kils" },
    { tier: "Bronze", icon: "🥉", points: "0 - 890 PTS", color: "text-amber-700 border-amber-800/20 bg-amber-950/10", requirement: "Complete Calibration Duel" }
  ];

  // 3. LEAGUES & TOURNAMENT BRACKETS
  const [leagues, setLeagues] = useState([
    { id: "l1", name: "Daily TDM Gladiator Duels", freq: "Daily", type: "Championship", rewards: "150 Coins", registrations: "14/16 Squads", region: "Africa", status: "Active" },
    { id: "l2", name: "Slaying Arena Weekly Series", freq: "Weekly League", type: "Double Elimination", rewards: "500 Coins + Signature Jersey", registrations: "32/32 Squads", region: "Europe", status: "Signups Full" },
    { id: "l3", name: "Continental Apex Championships", freq: "Monthly Cup", type: "Swiss Format", rewards: "2500 Coins + Hall of Fame", registrations: "8/16 Squads", region: "Middle East", status: "Registration Open" },
    { id: "l4", name: "Pro Invitational Warzone Duels", freq: "Invitational", type: "Round Robin", rewards: "Gear & Devices Bundle", registrations: "8/8 Teams", region: "North America", status: "Pre-Locked" },
  ]);

  // League Creator Form States
  const [newLeagueName, setNewLeagueName] = useState("");
  const [newLeagueFreq, setNewLeagueFreq] = useState("Weekly League");
  const [newLeagueFormat, setNewLeagueFormat] = useState("Single Elimination");
  const [newLeagueRewards, setNewLeagueRewards] = useState("200 CV Coins");
  const [newLeagueRegion, setNewLeagueRegion] = useState("Africa");

  // Tournament visual brackets formats (Single / Double / Round Robin / Swiss)
  const [bracketFormat, setBracketFormat] = useState<"Single" | "Double" | "Swiss">("Single");

  // Mock brackets for display
  const bracketsData = {
    Single: [
      { round: "QUARTER FINALS", matches: [
        { id: "s1", teamA: "Crimson Vipers (YOU)", teamB: "Feisty Foxes", scoreA: 40, scoreB: 34, winner: "Crimson Vipers (YOU)" },
        { id: "s2", teamA: "NAVI Academy", teamB: "Hydra Focus", scoreA: 40, scoreB: 38, winner: "NAVI Academy" },
        { id: "s3", teamA: "FaZe recruits", teamB: "Apex Raiders", scoreA: 36, scoreB: 40, winner: "Apex Raiders" },
        { id: "s4", teamA: "Team Liquid Cadets", teamB: "Mamba Esports", scoreA: 40, scoreB: 37, winner: "Team Liquid Cadets" },
      ]},
      { round: "SEMI FINALS", matches: [
        { id: "s5", teamA: "Crimson Vipers (YOU)", teamB: "NAVI Academy", scoreA: 40, scoreB: 39, winner: "Crimson Vipers (YOU)" },
        { id: "s6", teamA: "Apex Raiders", teamB: "Team Liquid Cadets", scoreA: 32, scoreB: 40, winner: "Team Liquid Cadets" },
      ]},
      { round: "FINALS", matches: [
        { id: "s7", teamA: "Crimson Vipers (YOU)", teamB: "Team Liquid Cadets", scoreA: undefined, scoreB: undefined, winner: undefined },
      ]}
    ],
    Double: [
      { round: "WINNERS BRACKET", matches: [
        { id: "d1", teamA: "Crimson Vipers (YOU)", teamB: "Sentinels Pro", scoreA: 40, scoreB: 38, winner: "Crimson Vipers (YOU)" },
        { id: "d2", teamA: "Hydra Focus", teamB: "Mamba Blitz", scoreA: 31, scoreB: 40, winner: "Mamba Blitz" }
      ]},
      { round: "LOSERS BRACKET S1", matches: [
        { id: "d3", teamA: "Sentinels Pro", teamB: "Hydra Focus", scoreA: 40, scoreB: 29, winner: "Sentinels Pro" }
      ]},
      { round: "GRAND FINALS", matches: [
        { id: "d4", teamA: "Crimson Vipers (YOU)", teamB: "Sentinels Pro", scoreA: undefined, scoreB: undefined, winner: undefined }
      ]}
    ],
    Swiss: [
      { round: "ROUND 1 [3-0 SEEDING]", matches: [
        { id: "sw1", teamA: "Crimson Vipers (YOU)", teamB: "Mamba Blitz", scoreA: 40, scoreB: 31, winner: "Crimson Vipers (YOU)" },
        { id: "sw2", teamA: "NAVI Academy", teamB: "FaZe recruits", scoreA: 40, scoreB: 35, winner: "NAVI Academy" },
        { id: "sw3", teamA: "Team Liquid Cadets", teamB: "Apex Raiders", scoreA: 38, scoreB: 40, winner: "Apex Raiders" },
        { id: "sw4", teamA: "Feisty Foxes", teamB: "Hydra Focus", scoreA: 40, scoreB: 38, winner: "Feisty Foxes" }
      ]},
      { round: "ROUND 2 [HIGH LOSS ELIMINATOR]", matches: [
        { id: "sw5", teamA: "Crimson Vipers (YOU)", teamB: "NAVI Academy", scoreA: undefined, scoreB: undefined, winner: undefined },
        { id: "sw6", teamA: "Apex Raiders", teamB: "Feisty Foxes", scoreA: undefined, scoreB: undefined, winner: undefined },
        { id: "sw7", teamA: "Team Liquid Cadets", teamB: "FaZe recruits", scoreA: undefined, scoreB: undefined, winner: undefined },
        { id: "sw8", teamA: "Mamba Blitz", teamB: "Hydra Focus", scoreA: undefined, scoreB: undefined, winner: undefined }
      ]}
    ]
  };

  // 4. LIVE LEADERBOARDS
  const [leaderboardCategory, setLeaderboardCategory] = useState<"kills" | "kd" | "wins" | "mvps">("kills");
  const [leaderboardRegion, setLeaderboardRegion] = useState("Global");
  const listLeaderboardData = () => {
    const data = [
      { name: "Alpha 'Viper'", team: "Crimson Vipers", kills: 2180, kd: 1.53, wins: 122, mvps: 62, region: "Africa" },
      { name: "Mamba Blitz", team: "Mamba Esports", kills: 1950, kd: 1.45, wins: 98, mvps: 51, region: "Europe" },
      { name: "Slayer 'Viper'", team: "Crimson Vipers", kills: 1840, kd: 1.48, wins: 110, mvps: 45, region: "Africa" },
      { name: "Lethal 'Sniper'", team: "Crimson Vipers", kills: 1720, kd: 1.74, wins: 105, mvps: 58, region: "Middle East" },
      { name: "NAVI Sniper", team: "NAVI Academy", kills: 1690, kd: 1.39, wins: 88, mvps: 40, region: "Europe" },
      { name: "Hydra Focus", team: "Hydra Esports", kills: 1540, kd: 1.25, wins: 76, mvps: 31, region: "South America" },
      { name: "Apex Gunner", team: "Apex Raider", kills: 1480, kd: 1.30, wins: 85, mvps: 37, region: "North America" },
      { name: "Sentinels MVP", team: "Sentinels Pro", kills: 1350, kd: 1.41, wins: 91, mvps: 50, region: "North America" },
      { name: "Liquid Reroll", team: "Liquid Cadets", kills: 1280, kd: 1.18, wins: 64, mvps: 22, region: "Africa" },
      { name: "Zeus Slayer", team: "Olympus Kings", kills: 1120, kd: 1.12, wins: 52, mvps: 18, region: "Oceania" },
    ];

    let filtered = [...data];
    if (leaderboardRegion !== "Global") {
      filtered = filtered.filter(p => p.region === leaderboardRegion);
    }

    return filtered.sort((a, b) => {
      if (leaderboardCategory === "kills") return b.kills - a.kills;
      if (leaderboardCategory === "kd") return b.kd - a.kd;
      if (leaderboardCategory === "wins") return b.wins - a.wins;
      return b.mvps - a.mvps;
    });
  };

  // 5. TEAM TDM PROFILES
  const [teamProfiles, setTeamProfiles] = useState([
    { name: "Crimson Vipers", kills: 6380, winRate: "74%", wins: 337, matches: 450, rank: "#1 in Africa", achievements: ["Continental Cup Champion", "Season 2 Gladiator Ring"] },
    { name: "NAVI Academy", kills: 5840, winRate: "66%", wins: 284, matches: 430, rank: "#3 in Europe", achievements: ["EMEA Cadets Finalist"] },
    { name: "Team Liquid Cadets", kills: 5210, winRate: "62%", wins: 245, matches: 395, rank: "#4 in World", achievements: ["Pro League Challenger Star"] },
    { name: "Mamba Esports", kills: 4890, winRate: "58%", wins: 210, matches: 360, rank: "#8 Global", achievements: ["Speed runner gold medal"] },
  ]);

  // 6. TDM BROADCAST CENTER (Simulates a stream)
  const [selectedBroadcaster, setSelectedBroadcaster] = useState({
    name: "TDM Grand Finals [African Regional Finals]",
    platform: "YouTube",
    url: "https://youtube.com/live",
    caster: "Pansy & GoldenBoy",
    analysts: "Bacon & Machine",
    viewers: "1,245 viewing",
    timeRemaining: "Next Match starts in 04:12"
  });

  const broadcastChatSeeds = [
    "OMG SLAYER WITH THE CLUTCH SPRAY!",
    "Is AWM allowed in the rules?",
    "M416 Tracer bundle lookin sick",
    "What server is NA on? Low ping",
    "Navi is throwin",
    "VIPERS ON TOP!",
    "Amazing casting guys!",
    "Check out that crosshair placement"
  ];
  const [broadcastChat, setBroadcastChat] = useState<string[]>([
    "[System] Stream loaded. Welcome to the TDM Main Stage broadcast feed.",
    "User_3489: lets go vipers!",
    "Caster_Crew: Ready for double elimination draft!"
  ]);

  // Append simulated chat periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomSeed = broadcastChatSeeds[Math.floor(Math.random() * broadcastChatSeeds.length)];
      setBroadcastChat(prev => [...prev.slice(-9), `Viewer_${Math.floor(Math.random() * 9000) + 1000}: ${randomSeed}`]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // 7. ADVANCED ANALYTICS (Heatmap + Weapon usage)
  const [selectedMapHeat, setSelectedMapHeat] = useState<"Warehouse" | "Ruins" | "Library">("Warehouse");
  // Pins placed by players on the visual board
  const [heatmapPins, setHeatmapPins] = useState<Array<{ x: number, y: number, type: string, note: string }>>([
    { x: 45, y: 55, type: "kill", note: "Alpha triple kill" },
    { x: 30, y: 40, type: "death", note: "Frag grenade hazard area" },
    { x: 75, y: 65, type: "spawn", note: "Sniper camping container" },
  ]);
  const [selectedHeatmapTool, setSelectedHeatmapTool] = useState<"kill" | "death" | "spawn">("kill");
  const [analyticsMapNote, setAnalyticsMapNote] = useState("");

  const handlePlaceHeatmapPin = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    const newPin = {
      x,
      y,
      type: selectedHeatmapTool,
      note: analyticsMapNote || `Custom bullet drop point (${x}%, ${y}%)`
    };

    setHeatmapPins(p => [...p, newPin]);
    setSystemAlertMessage(`🎯 Bullet strike point coordinates logged at: X:${x} Y:${y}`);
    setAnalyticsMapNote("");
  };

  // Weapon Usage Chart Data
  const weaponUsageData = [
    { name: "M416 Tracer", usage: 48, accuracy: "82%", recoilControl: "S Tier" },
    { name: "Groza CQB", usage: 22, accuracy: "74%", recoilControl: "A Tier" },
    { name: "AWM Sniper", usage: 15, accuracy: "94%", recoilControl: "C Tier" },
    { name: "UMP45 Laser", usage: 10, accuracy: "68%", recoilControl: "S Tier" },
    { name: "M16A4 Burst", usage: 5, accuracy: "88%", recoilControl: "B Tier" }
  ];

  // 8. TDM HIGHLIGHTS & CLUTCHES
  const [tdmHighlights, setTdmHighlights] = useState([
    { id: "h1", player: "Alpha 'Viper'", title: "Warehouse 1v4 Roster Wipe", type: "Clutch", videoSeed: "Play simulation clip (AWM Headshot snap)", duration: "18s" },
    { id: "h2", player: "Lethal 'Sniper'", title: "Triple Tap Jump Shot across Mid Alley", type: "Sniper Accuracy", videoSeed: "Play simulation clip (6x laser snap)", duration: "12s" },
    { id: "h3", player: "You", title: "Defending Blue Spawn - 7x Kill Streak", type: "Rampage", videoSeed: "Recollecting frame calibration indexes", duration: "25s" }
  ]);

  // 9. ACHIEVEMENTS SYSTEM
  const tdmAchievements = [
    { id: "ach1", title: "First Blood", desc: "Secure 1 Victory on any official TDM bracket (50 CV Coins)", unlocked: true, count: "1/1" },
    { id: "ach2", title: "Viper Headhunter", desc: "Accumulate 500 overall Headshots on ledger (120 CV Coins)", unlocked: true, count: "500/500" },
    { id: "ach3", title: "Golden Gladiator", desc: "Earn 15 decisive MVP titles on tournaments (200 CV Coins)", unlocked: false, count: "8/15" },
    { id: "ach4", title: "Undefeated Season", desc: "Maintain a flawless 10-0 run in Daily Leagues", unlocked: false, count: "4/10" },
  ];

  // 10. TEAM HUB & PRIVATE TEAMMATE CHAT
  const [teamAnnouncements, setTeamAnnouncements] = useState([
    { author: "Owner", text: "Continental League start postponed to Friday 18:00 UTC due to lobby updates.", time: "Today 08:31" },
    { author: "Alpha", text: "Everyone check loadout equipment comps. RED DOT or 3X for Ruins standard.", time: "Yesterday" }
  ]);
  const [teamChatHistory, setTeamChatHistory] = useState([
    { sender: "Alpha 'Viper'", role: "Cap", text: "Yo team! Anyone up for some matches?" },
    { sender: "Lethal 'Sniper'", role: "Member", text: "Ready to hold angles. I'll take Red Spawn box." },
    { sender: "Slayer 'Rush'", role: "Member", text: "I have M416 Tracer calbs ready, ready to push Mid Alley." }
  ]);
  const [typedTeamMessage, setTypedTeamMessage] = useState("");

  const handleSendTeamMessage = () => {
    if (!typedTeamMessage.trim()) return;

    const userMsg = {
      sender: userSession.ign,
      role: "YOU",
      text: typedTeamMessage
    };

    setTeamChatHistory(prev => [...prev, userMsg]);
    setTypedTeamMessage("");

    // Simulate reactive teammate suggestion
    setTimeout(() => {
      const responses = [
        "Alpha 'Viper': Sounds supreme. I'll backup your push from left flank. Keep eye on danger spots!",
        "Lethal 'Sniper': Got you covered. Don't run into warehouse center blindly.",
        "Slayer 'Rush': Roger that, launching smoke cover now. Go go go!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const [sender, ...rest] = randomResponse.split(": ");
      setTeamChatHistory(prev => [...prev, {
        sender: sender.trim(),
        role: "Teammate",
        text: rest.join(": ")
      }]);
    }, 1200);
  };

  // 11. HALL OF FAME
  const hallOfFame = [
    { id: "hof1", player: "Lethal 'Sniper'", achievements: "S3 Europe Gladiator Cup Winner", stat: "1.89 Career K/D", season: "Season 1 & 2" },
    { id: "hof2", player: "Alpha 'Viper'", achievements: "Season 2 Global MVP Champion", stat: "2,450 Overall kills", season: "Season 2" },
    { id: "hof3", player: "Mamba Blitz", achievements: "Continental Heavyweight Champ", stat: "25 Match Unbeaten Streak", season: "Season 3" },
  ];

  // 12. OWNER CONTROLS STATE DEFAULT CONFIG
  const [ruleAllowEmulators, setRuleAllowEmulators] = useState(false);
  const [ruleFriendlyFireFactor, setRuleFriendlyFireFactor] = useState("0.0 (Disabled)");
  const [ruleKillsMultiplier, setRuleKillsMultiplier] = useState(1);
  const [ruleBattleLength, setRuleBattleLength] = useState("6 mins");

  // Synchronize score dynamics into scoreboard on active simulations progress!
  useEffect(() => {
    if (tdmSimulatorActive) {
      setMatchStatus("LIVE");
      const interval = setInterval(() => {
        // Randomly adjust scores but align with current tdmUserScore and tdmEnemyScore
        setBlueScoreboard(prev => {
          return prev.map((player, idx) => {
            if (idx === 0) {
              return { ...player, kills: Math.floor(tdmUserScore * 0.4), mvpPts: Math.floor(tdmUserScore * 10) };
            } else if (idx === 1) {
              return { ...player, kills: Math.floor(tdmUserScore * 0.3) };
            } else {
              return { ...player, kills: Math.floor(tdmUserScore * 0.15) };
            }
          });
        });

        setRedScoreboard(prev => {
          return prev.map((player, idx) => {
            if (idx === 0) {
              return { ...player, kills: Math.floor(tdmEnemyScore * 0.45) };
            } else if (idx === 1) {
              return { ...player, kills: Math.floor(tdmEnemyScore * 0.3) };
            } else {
              return { ...player, kills: Math.floor(tdmEnemyScore * 0.1) };
            }
          });
        });

        // Track active simulated MVP mathematically
        const highBlue = blueScoreboard.reduce((prev, curr) => prev.kills > curr.kills ? prev : curr);
        const highRed = redScoreboard.reduce((prev, curr) => prev.kills > curr.kills ? prev : curr);
        setActiveMvp(highBlue.kills >= highRed.kills ? highBlue.name : highRed.name);

      }, 1000);
      return () => clearInterval(interval);
    } else {
      setMatchStatus(tdmUserScore > 0 || tdmEnemyScore > 0 ? "CONCLUDED" : "WAITING");
    }
  }, [tdmSimulatorActive, tdmUserScore, tdmEnemyScore]);

  return (
    <div className="space-y-6">
      {/* PROFESSIONAL TDM ECOSYSTEM MENU */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-3">
        <button
          onClick={() => setTdmSubTab("battlefield")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "battlefield"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <Flame size={14} className={tdmSubTab === "battlefield" ? "animate-pulse text-red-500" : ""} />
          <span>BATTLE SYSTEM HQ</span>
        </button>

        <button
          onClick={() => setTdmSubTab("leagues")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "leagues"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <Trophy size={14} />
          <span>LEAGUES & BRACKETS</span>
        </button>

        <button
          onClick={() => setTdmSubTab("profiles")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "profiles"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <Award size={14} />
          <span>DOSSIERS & TIERS</span>
        </button>

        <button
          onClick={() => setTdmSubTab("teamhub")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "teamhub"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <Users size={14} />
          <span>PRO HUB & COMS</span>
        </button>

        <button
          onClick={() => setTdmSubTab("analytics")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "analytics"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <BarChart3 size={14} />
          <span>ANALYTICS & STREAMS</span>
        </button>

        <button
          onClick={() => setTdmSubTab("hall")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "hall"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <Star size={14} />
          <span>HALL OF FAME</span>
        </button>

        <button
          onClick={() => setTdmSubTab("admin")}
          className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl font-mono text-xs uppercase tracking-wider cursor-pointer duration-150 active:scale-95 ${
            tdmSubTab === "admin"
              ? "bg-[#ff001c]/20 text-[#ff001c] border-[#ff001c]/30 font-black shadow-[0_0_15px_rgba(255,0,0,0.15)]"
              : "bg-[#090909] text-gray-400 border-zinc-900 hover:text-white"
          }`}
        >
          <Shield size={14} />
          <span>OWNER OPERANDI</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ======================= TAB 1: BATTLE FIELD ======================= */}
        {tdmSubTab === "battlefield" && (
          <motion.div
            key="battlefield"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* MATCH CENTER TELEMETRY HEADBOARD */}
            <div className="bg-gradient-to-b from-[#090909] to-black rounded-3xl border border-zinc-900 p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <span className={`px-3 py-1 text-[9px] font-mono rounded-full font-black border tracking-widest leading-none ${
                  matchStatus === "LIVE" ? "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse" :
                  matchStatus === "CONCLUDED" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  "bg-zinc-850 text-gray-400 border-zinc-700"
                }`}>
                  ● {matchStatus}
                </span>
              </div>

              {/* Header Grid: Team A vs Team B Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left relative z-10">
                {/* BLUE TEAM (CRIMSON VIPERS) */}
                <div className="flex md:flex-row flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-950 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <span className="text-3xl font-extrabold text-white">🐍</span>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-base font-black text-white font-mono tracking-wider uppercase">CRIMSON VIPERS</h3>
                    <p className="text-[10px] text-red-500 font-mono tracking-widest font-bold">ALLIANCE SPONSOR [YOU]</p>
                  </div>
                </div>

                {/* SCORES AND VS TELEMETRY */}
                <div className="flex flex-col items-center justify-center gap-1 bg-[#050505] py-4 px-6 rounded-2xl border border-zinc-900/60 max-w-sm mx-auto">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black font-orbitron text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                      {tdmUserScore}
                    </span>
                    <span className="text-zinc-600 font-bold font-mono text-sm">VS</span>
                    <span className="text-3xl font-black font-orbitron text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]">
                      {tdmEnemyScore}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                    TIMER: <span className="text-white font-bold font-orbitron">{tdmSimulatorActive ? "LIVE RUN" : "06:00"}</span>
                  </div>
                </div>

                {/* RED TEAM (OPPONENT) */}
                <div className="flex md:flex-row-reverse flex-col items-center gap-4 text-center md:text-right">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-zinc-900 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <span className="text-3xl font-extrabold text-white">⚙️</span>
                  </div>
                  <div className="text-center md:text-right">
                    <h3 className="text-base font-black text-white font-mono tracking-wider uppercase">{matchOpponent.replace(/\[.*\]\s*/, "")}</h3>
                    <p className="text-[10px] text-blue-400 font-mono tracking-widest font-bold">MATCHMAKER HOST</p>
                  </div>
                </div>
              </div>

              {/* MVP Live Tracker */}
              <div className="border-t border-zinc-900/60 pt-4 flex flex-col md:flex-row justify-between items-center text-xs gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#ff001c] animate-bounce shrink-0" />
                  <span className="text-gray-450 font-mono">ACTIVE MATCH MVP CORNER:</span>
                  <span className="text-white font-bold bg-[#ff001c]/10 text-[#ff001c] px-2.5 py-1 rounded-lg border border-[#ff001c]/24">{activeMvp}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono uppercase">
                  <span>SPECTATORS REACH:</span>
                  <strong className="text-white font-black">{featuredMatches.spectators}</strong>
                </div>
              </div>
            </div>

            {/* LIVE TDM SCOREBOARD GRAPH PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blue Roster Table */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-650 rounded-full" /> CRIMSON VIPERS DIVISION
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">{tdmUserScore} Total Kills</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-900/60 text-zinc-500 text-[8.5px] uppercase">
                        <th className="py-2">PLAYER</th>
                        <th className="py-2 text-center">K / D / A</th>
                        <th className="py-2 text-center">K/D</th>
                        <th className="py-2 text-center">HEADSHOTS</th>
                        <th className="py-2 text-center">DAMAGE</th>
                        <th className="py-2 text-center">STREAK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40">
                      {blueScoreboard.map((p, idx) => (
                        <tr key={p.name} className={`${p.name === userSession.ign ? "bg-red-955/5" : ""} hover:bg-zinc-900/20`}>
                          <td className="py-2 font-bold text-white flex items-center gap-1">{p.name} {idx === 0 && "👑"}</td>
                          <td className="py-2 text-center text-gray-300 font-bold">{p.kills} / {p.deaths} / {p.assists}</td>
                          <td className="py-2 text-center text-red-500 font-black">{(p.kills / Math.max(1, p.deaths)).toFixed(2)}</td>
                          <td className="py-2 text-center text-gray-400">{p.hs}</td>
                          <td className="py-2 text-center text-gray-300">{p.dmg}</td>
                          <td className="py-2 text-center text-yellow-500 font-black">{p.streak} (Max {p.maxStreak})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Red Roster Table */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-blue-650 rounded-full" /> OPPONENT TEAM DIVISION
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">{tdmEnemyScore} Total Kills</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-900/60 text-zinc-500 text-[8.5px] uppercase">
                        <th className="py-2">PLAYER</th>
                        <th className="py-2 text-center">K / D / A</th>
                        <th className="py-2 text-center">K/D</th>
                        <th className="py-2 text-center">HEADSHOTS</th>
                        <th className="py-2 text-center">DAMAGE</th>
                        <th className="py-2 text-center">STREAK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40">
                      {redScoreboard.map((p, idx) => (
                        <tr key={p.name} className="hover:bg-zinc-900/20">
                          <td className="py-2 font-bold text-white">{p.name}</td>
                          <td className="py-2 text-center text-gray-300 font-bold">{p.kills} / {p.deaths} / {p.assists}</td>
                          <td className="py-2 text-center text-blue-400 font-black">{(p.kills / Math.max(1, p.deaths)).toFixed(2)}</td>
                          <td className="py-2 text-center text-gray-400">{p.hs}</td>
                          <td className="py-2 text-center text-gray-300">{p.dmg}</td>
                          <td className="py-2 text-center text-yellow-500 font-black">{p.streak} (Max {p.maxStreak})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* UPCOMING MATCHES & SCHEDULERS */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#ff001c] shrink-0" />
                  <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">UPCOMING SCHEDULES</h4>
                </div>
                <span className="text-[9px] font-mono text-[#ff001c] bg-[#ff001c]/10 px-2 py-0.5 rounded border border-[#ff001c]/20 uppercase">
                  Next Duel Pending
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingMatches.map((m) => (
                  <div key={m.id} className="bg-black/45 border border-zinc-900/80 p-3.5 rounded-xl space-y-2 relative overflow-hidden group hover:border-[#ff001c]/30 duration-150">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-gray-500 uppercase">{m.map} • {m.format}</span>
                      <span className="px-1.5 py-0.2 text-[8px] bg-red-955/20 text-[#ff001c] rounded border border-red-550/15 font-bold uppercase">{m.state}</span>
                    </div>
                    <div className="font-bold text-xs text-white uppercase font-sans truncate">
                      {m.teamA} <span className="text-red-500">vs</span> {m.teamB}
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono border-t border-zinc-900/60 pt-2 text-zinc-500">
                      <span>TIME DETECTED</span>
                      <strong className="text-white font-bold">{m.time}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 2: LEAGUES & BRACKETS ======================= */}
        {tdmSubTab === "leagues" && (
          <motion.div
            key="leagues"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Owner & Administrator League Core Creator */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
                <Sliders size={15} className="text-red-500" />
                <h3 className="text-xs font-black text-white font-mono tracking-widest uppercase">CREATOR COMMISSION: REGISTER NEW TDM LEAGUE</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[8px] font-mono text-gray-500 block uppercase mb-1 font-bold">LEAGUE / TOURNAMENTS TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g., Summer Masters Duo"
                    value={newLeagueName}
                    onChange={(e) => setNewLeagueName(e.target.value)}
                    className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] rounded p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[8px] font-mono text-gray-500 block uppercase mb-1 font-bold">FREQUENCY / DURATION</label>
                  <select
                    value={newLeagueFreq}
                    onChange={(e) => setNewLeagueFreq(e.target.value)}
                    className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] rounded p-2 text-xs text-white font-mono"
                  >
                    <option value="Daily">Daily Event</option>
                    <option value="Weekly League">Weekly League</option>
                    <option value="Monthly Championship">Monthly Championship</option>
                    <option value="Regional Cup">Regional Cup</option>
                    <option value="Invitational">Invitational Cup</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-mono text-gray-500 block uppercase mb-1 font-bold">BRACKET FORMAT CONFIG</label>
                  <select
                    value={newLeagueFormat}
                    onChange={(e) => setNewLeagueFormat(e.target.value)}
                    className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] rounded p-2 text-xs text-white font-mono"
                  >
                    <option value="Single Elimination">Single Elimination</option>
                    <option value="Double Elimination">Double Elimination</option>
                    <option value="Round Robin">Round Robin</option>
                    <option value="Swiss Format">Swiss Format</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-mono text-gray-500 block uppercase mb-1 font-bold text-red-400">REGIONAL ZONE SELECT</label>
                  <select
                    value={newLeagueRegion}
                    onChange={(e) => setNewLeagueRegion(e.target.value)}
                    className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] rounded p-2 text-xs text-white font-mono font-bold"
                  >
                    <option value="Africa">Africa</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Middle East">Middle East</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!newLeagueName) return;
                    const newL = {
                      id: `l-${Date.now()}`,
                      name: newLeagueName,
                      freq: newLeagueFreq,
                      type: newLeagueFormat,
                      rewards: newLeagueRewards,
                      registrations: "1/16 Squads [YOU]",
                      region: newLeagueRegion,
                      status: "Active"
                    };
                    setLeagues(prev => [newL, ...prev]);
                    setNewLeagueName("");
                    setSystemAlertMessage(`🏆 Registered New TDM Tournament: "${newL.name}"!`);
                  }}
                  className="px-4 py-2 bg-[#ff001c] hover:bg-red-700 text-white font-mono font-bold text-xs uppercase rounded-xl select-none active:scale-95 duration-150"
                >
                  DEPLOY LEAGUE OPERANDI
                </button>
              </div>
            </div>

            {/* Active Leagues Shelf */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">ACTIVE REGIONAL COMPETITIONS</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {leagues.map((l) => (
                  <div key={l.id} className="bg-black/95 p-4 rounded-xl border border-zinc-900 space-y-3 flex flex-col justify-between group hover:border-[#ff001c]/30 duration-150">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-red-500 bg-red-955/20 px-1.5 py-0.5 rounded border border-red-550/15 font-black uppercase">{l.region}</span>
                        <span className="text-[8px] font-mono text-gray-500 uppercase">{l.freq}</span>
                      </div>
                      <h5 className="font-black text-xs text-white uppercase tracking-tight group-hover:text-red-500 duration-150 leading-relaxed pt-1">{l.name}</h5>
                    </div>

                    <div className="border-t border-zinc-900 pt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>FORMAT:</span>
                        <span className="text-white font-bold">{l.type}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>REWARDS:</span>
                        <span className="text-yellow-500 font-extrabold">{l.rewards}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>SLOTS:</span>
                        <span className="text-blue-400 font-black">{l.registrations}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISUAL BRACKET MANAGER MODULE */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-5">
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-900 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="text-[#ff001c]" size={15} />
                  <h4 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">TDM BRACKETS TOURNAMENT MATRIX</h4>
                </div>
                
                {/* Format switcher */}
                <div className="flex bg-black p-1 rounded-xl border border-zinc-900 gap-1.5 shrink-0">
                  {["Single", "Double", "Swiss"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setBracketFormat(f as any)}
                      className={`px-3 py-1 font-mono text-[9px] uppercase font-black rounded ${
                        bracketFormat === f ? "bg-red-955/40 text-red-500 border border-red-550/20" : "text-gray-550 hover:text-white"
                      }`}
                    >
                      {f} Elimination / Bracket
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphical Bracket Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {bracketsData[bracketFormat].map((round, idx) => (
                  <div key={round.round} className="space-y-4">
                    <div className="flex items-center gap-1.5 bg-black/50 py-1 px-2 rounded border border-zinc-900 text-[9px] font-mono text-gray-500 font-black tracking-widest uppercase">
                      <Hash size={10} className="text-red-500" />
                      <span>{round.round}</span>
                    </div>

                    <div className="space-y-3">
                      {round.matches.map((m) => (
                        <div key={m.id} className="bg-[#050505] p-3 rounded-xl border border-zinc-900/80 space-y-2 hover:border-[#ff001f]/20 duration-150">
                          {/* Team A Node */}
                          <div className={`flex items-center justify-between text-[10px] font-mono ${
                            m.winner === m.teamA ? "text-[#ff001c] font-black" : m.winner ? "text-gray-600 line-through" : "text-gray-300"
                          }`}>
                            <span>{m.teamA}</span>
                            <strong>{m.scoreA !== undefined ? m.scoreA : "—"}</strong>
                          </div>
                          
                          {/* Connector node separator */}
                          <div className="h-[1px] bg-zinc-950" />

                          {/* Team B Node */}
                          <div className={`flex items-center justify-between text-[10px] font-mono ${
                            m.winner === m.teamB ? "text-[#ff001c] font-black" : m.winner ? "text-gray-600 line-through" : "text-gray-300"
                          }`}>
                            <span>{m.teamB}</span>
                            <strong>{m.scoreB !== undefined ? m.scoreB : "—"}</strong>
                          </div>

                          {m.winner && (
                            <div className="text-[8px] font-mono text-zinc-550 border-t border-zinc-900/60 pt-1 flex items-center gap-1">
                              <Check size={9} className="text-[#ff001c]" /> WINNER PROMOTED: {m.winner}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 3: LEADERS & DOSSIERS ======================= */}
        {tdmSubTab === "profiles" && (
          <motion.div
            key="profiles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* COMPREHENSIVE DOSSIER VISUAL MATRIX */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
                <User size={15} className="text-[#ff001c]" />
                <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">CRIMSON VIPERS SQUAD COMPASS: DOSSIER FILES</h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.keys(playerCareerDatabase).map((pname) => (
                  <button
                    key={pname}
                    type="button"
                    onClick={() => setSelectedProfilePlayer(pname)}
                    className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg border cursor-pointer duration-150 ${
                      selectedProfilePlayer === pname
                        ? "bg-red-955/20 border-red-500/30 text-red-500"
                        : "bg-black border-zinc-900 text-gray-400 hover:text-white"
                    }`}
                  >
                    💂 {pname}
                  </button>
                ))}
              </div>

              {/* Dossier Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 bg-black/45 p-4 rounded-xl border border-zinc-900">
                {/* Stats list */}
                <div className="space-y-2 md:col-span-1 border-r border-zinc-900/80 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">👤</span>
                    <div>
                      <h4 className="font-bold text-sm text-white uppercase">{selectedProfilePlayer}</h4>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase">Division Rank: {playerCareerDatabase[selectedProfilePlayer].tier}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {[
                      { l: "Matches Played", v: playerCareerDatabase[selectedProfilePlayer].matches },
                      { l: "Total Career Kills", v: playerCareerDatabase[selectedProfilePlayer].kills },
                      { l: "Total Career Deaths", v: playerCareerDatabase[selectedProfilePlayer].deaths },
                      { l: "Overall K/D Ratio", v: playerCareerDatabase[selectedProfilePlayer].kd, isRed: true },
                      { l: "Headshot Ratio", v: playerCareerDatabase[selectedProfilePlayer].hsPercent },
                      { l: "Overall Win Rate", v: playerCareerDatabase[selectedProfilePlayer].winRate, isRed: true },
                      { l: "Total MVP Awards", v: `${playerCareerDatabase[selectedProfilePlayer].mvps} Medals` }
                    ].map((item) => (
                      <div key={item.l} className="flex justify-between items-center text-[10.5px] font-mono border-b border-zinc-955/30 py-1 text-zinc-400">
                        <span>{item.l}</span>
                        <strong className={item.isRed ? "text-[#ff001c] font-black" : "text-white"}>{item.v}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytical Trend Graph */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-900/60 text-[9px] font-mono text-zinc-500">
                    <span>HISTORICAL DUELS PERFORMANCE TRENDS [6 RECENT MATCHES K/D RATIO]</span>
                    <TrendingUp size={12} className="text-[#ff001c]" />
                  </div>
                  
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={playerCareerDatabase[selectedProfilePlayer].recentPerformance.map((kd: number, i: number) => ({ match: `M${i+1}`, KD: kd }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                        <XAxis dataKey="match" stroke="#444" style={{ fontSize: 9 }} />
                        <YAxis stroke="#444" style={{ fontSize: 9 }} />
                        <Tooltip contentStyle={{ background: "#050505", border: "1px solid #222" }} />
                        <Line type="monotone" dataKey="KD" stroke="#ff001c" strokeWidth={3} dot={{ fill: "#000", stroke: "#ff001c", strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-2.5 bg-[#ff001c]/5 text-[#ff001c] border border-[#ff001c]/15 rounded-lg text-[10px] font-mono leading-normal">
                    🔥 <strong>ACHIEVED MILESTONE RECORD:</strong> {playerCareerDatabase[selectedProfilePlayer].records}
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE LEADERBOARDS AND RANK RULES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaderboards Display (Col-span 2) */}
              <div className="lg:col-span-2 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-[#ff001c]" size={15} />
                    <h4 className="text-xs font-black font-orbitron text-white uppercase">TDM ECOSYSTEM LEADERBOARD</h4>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex bg-black p-1 rounded-xl border border-zinc-900 gap-1 sm:self-end">
                    {[
                      { cat: "kills", label: "KILLS" },
                      { cat: "kd", label: "K/D" },
                      { cat: "wins", label: "WINS" },
                      { cat: "mvps", label: "MVPs" }
                    ].map((btn) => (
                      <button
                        key={btn.cat}
                        onClick={() => setLeaderboardCategory(btn.cat as any)}
                        className={`px-3 py-1 font-mono text-[9px] uppercase font-black rounded ${
                          leaderboardCategory === btn.cat ? "bg-red-955/40 text-red-500 border border-red-550/15" : "text-gray-550"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-550 pb-1">
                  <span>RANK</span>
                  <span>PLAYER</span>
                  <span>VALUE LOGS</span>
                </div>

                <div className="space-y-2">
                  {listLeaderboardData().slice(0, 6).map((p, idx) => (
                    <div key={p.name} className="flex items-center justify-between p-2.5 rounded-lg bg-black border border-zinc-900/70 hover:border-[#ff001c]/25 duration-150">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black font-mono text-[#ff001c] min-w-[20px]">#{idx + 1}</span>
                        <div>
                          <span className="font-bold text-xs text-white uppercase block">{p.name}</span>
                          <span className="text-[8px] font-mono text-gray-500 uppercase">{p.team} • {p.region}</span>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-black text-red-500 drop-shadow-[0_0_5px_rgba(255,0,0,0.1)] pr-1">
                        {leaderboardCategory === "kills" && `${p.kills} KILLS`}
                        {leaderboardCategory === "kd" && `${p.kd.toFixed(2)} K/D`}
                        {leaderboardCategory === "wins" && `${p.wins} WINS`}
                        {leaderboardCategory === "mvps" && `${p.mvps} MVPs`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranking System Standards Descriptions (Col-span 1) */}
              <div className="lg:col-span-1 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
                  <Sliders size={14} className="text-[#ff001c]" />
                  <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">TDM COMPETITIVE RANKS</h4>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {rankingTiers.map((t) => (
                    <div key={t.tier} className={`p-2.5 border rounded-xl flex items-center justify-between gap-3 ${t.color}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <strong className="text-white text-xs block uppercase tracking-wide">{t.tier}</strong>
                          <span className="text-[8.5px] text-gray-400 block font-mono leading-tight">{t.requirement}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-black shrink-0 text-white bg-black/60 px-2 py-0.5 rounded border border-zinc-900">{t.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 4: TEAM HUB_ ======================= */}
        {tdmSubTab === "teamhub" && (
          <motion.div
            key="teamhub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Private Team Chat Panel & Strategy Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Private interactive chat (Col-span 2) */}
              <div className="lg:col-span-2 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col justify-between space-y-4 h-[440px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={15} className="text-red-500 shrink-0" />
                    <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">CRIMSON VIPERS INTRA- roster CHAT</h4>
                  </div>
                  <span className="text-[8px] font-mono text-[#ff001c] bg-[#ff001c]/10 border border-[#ff001c]/20 px-2.5 py-0.5 rounded-full uppercase">
                    🔒 encrypted channels
                  </span>
                </div>

                {/* Messages scroller */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
                  {teamChatHistory.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.role === "YOU" ? "items-end" : "items-start"}`}>
                      <span className="text-[8px] font-mono text-gray-500 uppercase px-1 pb-0.5">{m.sender} [{m.role}]</span>
                      <div className={`p-2.5 rounded-xl max-w-sm text-xs ${
                        m.role === "YOU"
                          ? "bg-red-955/20 text-white border border-red-550/25"
                          : "bg-black/85 text-zinc-300 border border-zinc-9D0"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Typed messaging input */}
                <div className="flex gap-2 pt-2 border-t border-zinc-900 shrink-0">
                  <input
                    type="text"
                    placeholder="COMPOSE STRATEGIC COMMAND TO TEAM..."
                    value={typedTeamMessage}
                    onChange={(e) => setTypedTeamMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendTeamMessage()}
                    className="flex-1 bg-[#090909] border border-zinc-900 focus:border-[#ff001f] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-700 uppercase focus:outline-none"
                  />
                  <button
                    onClick={handleSendTeamMessage}
                    className="px-4 py-2 bg-red-955 border border-[#ff001f]/30 text-white hover:border-[#ff001c] rounded-xl text-xs font-mono font-black"
                  >
                    <Send size={12} className="inline mr-1" /> TRANSMIT
                  </button>
                </div>
              </div>

              {/* Faction Announcements & Match Planning (Col-span 1) */}
              <div className="lg:col-span-1 bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col justify-between h-[440px]">
                <div className="space-y-4 overflow-y-auto pr-1">
                  <div className="border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                    <Radio size={14} className="text-red-500 animate-ping" />
                    <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">TACTICAL BRIEFINGS</h4>
                  </div>

                  <div className="space-y-3">
                    {teamAnnouncements.map((a, idx) => (
                      <div key={idx} className="bg-black/45 p-3 rounded-lg border border-zinc-900 text-left space-y-1">
                        <div className="flex justify-between items-center text-[8.5px] font-mono text-red-500">
                          <span>AUTH: {a.author.toUpperCase()}</span>
                          <span>{a.time}</span>
                        </div>
                        <p className="text-[10.5px] text-zinc-400 font-sans leading-relaxed">{a.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactical hold planner */}
                <div className="pt-4 border-t border-zinc-900 bg-[#ff001c]/5 p-3 rounded-xl border border-[#ff001c]/15 text-left space-y-1.5 shrink-0">
                  <span className="text-[9px] font-mono text-red-500 tracking-wider uppercase font-black block">📍 TEAM PLANNING OBJECTIVES</span>
                  <p className="text-[10px] text-zinc-300 font-sans leading-normal">
                    1. Alpha defends ruins spawns.<br />
                    2. Lethal sets angle coverage with sniper AWM.<br />
                    3. Mid Alley aggressive hold. Do not over-extend single lane!
                  </p>
                </div>
              </div>
            </div>

            {/* TEAM TDM PROFILES INDEX */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                <Users size={15} className="text-[#ff001c]" />
                <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">REGISTERED COMPETITOR CLAN ROSTERS</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamProfiles.map((tp) => (
                  <div key={tp.name} className="bg-black/40 border border-zinc-900 rounded-xl p-4 space-y-3 hover:border-[#ff001c]/20 duration-150 text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-[#ff001c] uppercase text-sm font-sans tracking-wide">{tp.name}</h4>
                        <span className="text-[9px] font-mono text-zinc-550 border border-zinc-9D0 bg-[#070707] px-2 py-0.2 rounded mt-1.5 inline-block">{tp.rank}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 font-mono text-right shrink-0">
                        <div>
                          <span className="text-[8px] text-zinc-550 block">WIN RATE</span>
                          <strong className="text-white text-xs block">{tp.winRate}</strong>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-550 block">WINS</span>
                          <strong className="text-white text-xs block">{tp.wins}</strong>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-550 block">KILLS</span>
                          <strong className="text-white text-xs block">{tp.kills}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900/40 pt-2 flex flex-wrap gap-1">
                      {tp.achievements.map((ach, idx) => (
                        <span key={idx} className="bg-zinc-9D0 border border-zinc-850/60 text-stone-300 text-[8.5px] font-mono px-2 py-0.5 rounded uppercase">
                          🏆 {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 5: ANALYTICS & BROADCASTS ======================= */}
        {tdmSubTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* TDM BROADCAST FEED STAGE OVERLAY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stream panel (Col-span 2) */}
              <div className="lg:col-span-2 bg-[#050505] border border-zinc-900 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <div className="flex items-center gap-2">
                    <Radio size={14} className="text-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white uppercase font-black">
                      STAGED BROADCAST: {selectedBroadcaster.name} [{selectedBroadcaster.platform}]
                    </span>
                  </div>
                  <span className="text-[9px] text-[#ff001c] bg-red-955/20 border border-red-550/15 px-2 py-0.5 rounded font-bold">
                    🔴 {selectedBroadcaster.viewers}
                  </span>
                </div>

                {/* Video window mock */}
                <div className="aspect-video bg-[#0d0d0d] rounded-2xl border border-zinc-900 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff001c_1px,transparent_1px)] bg-[size:16px_16px]" />
                  
                  <PlayCircle size={40} className="text-red-500 mb-3 animate-ping" />
                  <h4 className="text-sm font-black text-white font-mono tracking-widest uppercase">CRIMSON VIPERS DUEL CAST</h4>
                  <p className="text-[10.5px] text-zinc-500 font-sans max-w-sm mt-1">{selectedBroadcaster.caster} on microphones. Analytical review desk setup completed.</p>
                  
                  <div className="absolute bottom-4 bg-[#ff001c]/10 text-[#ff001c] px-3.5 py-1 rounded-xl text-[9px] font-mono border border-[#ff001c]/20">
                    ⏲️ {selectedBroadcaster.timeRemaining}
                  </div>
                </div>

                {/* Broadcaster controls */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-zinc-500">
                  <span>PLATFORMS SUPPORT:</span>
                  <span className="text-red-500 font-bold bg-[#111] px-2 py-0.5 rounded">Twitch</span>
                  <span className="text-red-500 font-bold bg-[#111] px-2 py-0.5 rounded">YouTube</span>
                  <span className="text-red-500 font-bold bg-[#111] px-2 py-0.5 rounded">TikTok Live</span>
                  <span className="text-red-500 font-bold bg-[#111] px-2 py-0.5 rounded">Kick Stream</span>
                </div>
              </div>

              {/* Chat streamer overlay (Col-span 1) */}
              <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 flex flex-col justify-between h-[390px]">
                <div className="border-b border-zinc-900 pb-2.5 shrink-0 flex items-center justify-between">
                  <span className="text-xs font-black text-white font-mono uppercase tracking-wider">LIVE FEED INTERNET CHAT</span>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase">Auto-moderated v3</span>
                </div>

                {/* Scroller chats */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-2 font-mono text-[9px]">
                  {broadcastChat.map((line, idx) => (
                    <div key={idx} className="bg-black/35 p-1 px-2 border border-zinc-900/60 rounded text-stone-300">
                      {line}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-9a0 shrink-0 text-[8px] font-mono text-zinc-550 italic uppercase">
                  📡 Broadcasting matrix proxies routing low-recoil delay streams of CV competitive centers.
                </div>
              </div>
            </div>

            {/* INTERACTIVE BULLET STRIKE HEATMAP CREATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">MAP INTEL BULLET STRIKE HEATMAP</h4>
                    
                    <select
                      value={selectedMapHeat}
                      onChange={(e) => setSelectedMapHeat(e.target.value as any)}
                      className="bg-[#050505] border border-zinc-900 text-[10px] text-white p-1 rounded font-mono"
                    >
                      <option value="Warehouse">Warehouse HQ</option>
                      <option value="Ruins">Ruins Temple</option>
                      <option value="Library">Strategic Library</option>
                    </select>
                  </div>
                  <p className="text-[9.5px] text-zinc-500 font-sans">
                    Click anywhere on the schematic canvas layout map to log simulated target bullet impacts, grenade pins, or clutch kill spots for team review.
                  </p>
                </div>

                {/* Active Heatmap schematic board */}
                <div
                  onClick={handlePlaceHeatmapPin}
                  className="aspect-video bg-[#0d0d0d] rounded-2xl border border-zinc-900 relative overflow-hidden cursor-crosshair group flex items-center justify-center"
                >
                  {/* Schematic outline visuals */}
                  <div className="absolute inset-x-0 h-[10px] bg-red-955/15 border-b border-red-550/20 top-1/2 flex items-center justify-between px-4 text-[7px] text-gray-700 font-mono tracking-widest uppercase pointer-events-none">
                    <span>MID ALLEY WAY CANYON</span>
                    <span>RESTRICTED TARGET ZONE</span>
                  </div>

                  <div className="absolute inset-y-0 w-[10px] bg-red-955/10 border-r border-[#ff001c]/10 left-1/2 pointer-events-none" />

                  {/* spawn visual zones */}
                  <span className="absolute top-4 left-4 bg-red-915 text-white border border-[#ff001c]/25 text-[7px] px-1.5 py-0.5 rounded font-mono select-none pointer-events-none">BLUE RESPAWN COOP</span>
                  <span className="absolute bottom-4 right-4 bg-blue-915 text-white border border-blue-500/25 text-[7px] px-1.5 py-0.5 rounded font-mono select-none pointer-events-none">RED RESPAWN COOP</span>

                  {/* Render Pins */}
                  {heatmapPins.map((pin, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group/pin"
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    >
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center animate-ping absolute -inset-1 ${
                        pin.type === "kill" ? "bg-red-500/40" : pin.type === "death" ? "bg-amber-500/40" : "bg-cyan-500/40"
                      }`} />
                      
                      <div className={`w-2.5 h-2.5 rounded-full border border-black flex items-center justify-center ${
                        pin.type === "kill" ? "bg-red-500" : pin.type === "death" ? "bg-amber-500" : "bg-cyan-500"
                      }`} />

                      {/* Tooltip text */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 bg-[#050505] border border-zinc-900 text-[8px] text-white p-1 rounded whitespace-nowrap z-55 pointer-events-none select-none uppercase font-mono shadow-xl transition-opacity">
                        {pin.note}
                      </div>
                    </div>
                  ))}

                  <span className="text-[10px] text-zinc-700 font-mono select-none pointer-events-none uppercase tracking-widest font-black uppercase">Warehouse Tactical Schematic</span>
                </div>

                {/* Heatmap Tool Selectors */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex gap-2">
                    {[
                      { type: "kill", label: "🎯 Strike Spot", color: "bg-red-500 border-red-400/30 text-white" },
                      { type: "death", label: "⚠️ Hazard Pin", color: "bg-amber-500 border-amber-400/30 text-black" },
                      { type: "spawn", label: "⚓ Recon base", color: "bg-cyan-500 border-cyan-400/30 text-black" }
                    ].map((tool) => (
                      <button
                        key={tool.type}
                        onClick={() => setSelectedHeatmapTool(tool.type as any)}
                        className={`px-3 py-1 font-mono text-[9px] uppercase font-black rounded border cursor-pointer duration-120 ${
                          selectedHeatmapTool === tool.type ? tool.color : "bg-black border-zinc-900 text-gray-500 hover:text-white"
                        }`}
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Enter review note to append on spot..."
                    value={analyticsMapNote}
                    onChange={(e) => setAnalyticsMapNote(e.target.value)}
                    className="flex-1 max-w-xs bg-[#090909] border border-zinc-900 focus:border-[#ff001f] rounded px-2.5 py-1 text-[10px] font-mono text-white focus:outline-none"
                  />
                  
                  <button
                    onClick={() => {
                      setHeatmapPins([
                        { x: 45, y: 55, type: "kill", note: "Alpha triple kill" },
                        { x: 30, y: 40, type: "death", note: "Frag grenade hazard area" },
                        { x: 75, y: 65, type: "spawn", note: "Sniper camping container" },
                      ]);
                      setSystemAlertMessage(`🧹 Bullet strike spots logs cleared!`);
                    }}
                    className="px-2.5 py-1 text-[8px] font-mono text-gray-550 border border-zinc-900 bg-transparent rounded uppercase"
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* Weapon usage Statistics charts */}
              <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">WEAPON PREFERENCE CALIBRATION RATIOS</h4>
                  <span className="text-[10px] font-mono text-zinc-500">Global Match analysis</span>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weaponUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                      <XAxis dataKey="name" stroke="#444" style={{ fontSize: 9 }} />
                      <YAxis stroke="#444" style={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ background: "#050505", border: "1px solid #222" }} />
                      <Bar dataKey="usage" fill="#ff001c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1 bg-black/50 p-3 rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500">
                  <span className="text-white font-bold block mb-1">RECOMMENDED META SELECTION TRACE:</span>
                  <p>• M416 Tracer holds S-Tier priority with high recoil recoil stability coefficients on Library Presets.</p>
                  <p>• Groza CQB delivers peak damage close up, but suffers high bullet velocity decay dropoff outside 45 meters.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 6: HALL OF FAME ======================= */}
        {tdmSubTab === "hall" && (
          <motion.div
            key="hall"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* VETERANS HALL OF FAMER GLORY */}
            <div className="bg-gradient-to-b from-red-955/20 to-zinc-950 p-6 rounded-3xl border border-red-500/20 text-center relative overflow-hidden space-y-4">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff001c_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/20 rounded-full text-amber-500 font-mono font-bold text-[9px] uppercase tracking-wider">
                👑 MEMORIALIZED VETERAN GRID
              </div>
              <h3 className="text-2xl font-black font-orbitron tracking-widest text-[#ff001c] uppercase">CV eSPORTS TDM HALL OF FAME</h3>
              <p className="text-xs text-stone-300 font-medium max-w-xl mx-auto leading-relaxed">
                Paying respects to the tactical masters, highest division earners, unbeatable rosters, and competitive duel champions who defined the peak of the Crimson Vipers platform history.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                {hallOfFame.map((v) => (
                  <div key={v.id} className="bg-[#050505] p-4 rounded-2xl border border-zinc-900 space-y-3 relative group hover:border-[#ff001c]/30 duration-150 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-550 border-b border-zinc-900 pb-1.5">
                        <span>SEASON ELIGIBILITY</span>
                        <strong>{v.season.toUpperCase()}</strong>
                      </div>
                      <h4 className="font-extrabold text-sm text-white uppercase font-sans pt-1 tracking-wide">{v.player}</h4>
                      <p className="text-[11px] text-[#ff001c] font-mono font-black">{v.achievements}</p>
                    </div>

                    <div className="pt-2 bg-red-955/5 p-2 rounded border border-red-550/10 font-mono text-[9px] text-[#ff001c] text-center uppercase tracking-wider">
                      HISTORICAL SCORE RECORD: {v.stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TDM HIGHLIGHTS AND PLAY CLIPS */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="border-b border-zinc-900 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle size={15} className="text-[#ff001c]" />
                  <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">AUTOMATED CLUTCH HIGHLIGHT CLIPS</h4>
                </div>
                <span className="text-[9px] font-mono text-zinc-550 italic uppercase">Re-render telemetry live</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tdmHighlights.map((hl) => (
                  <div key={hl.id} className="bg-black/55 p-3.5 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3 group hover:border-red-500/30 duration-150">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-[#ff001c] uppercase bg-red-955/15 border border-[#ff001c]/20 px-1.5 py-0.2 rounded font-black">{hl.type}</span>
                        <span className="text-[8px] font-mono text-gray-550">{hl.duration}</span>
                      </div>
                      <h5 className="font-bold text-xs text-white uppercase group-hover:text-red-550 duration-150 pt-1 leading-normal">{hl.title}</h5>
                      <p className="text-[8.5px] text-zinc-550 font-mono">RECORDED BY: {hl.player}</p>
                    </div>

                    <button
                      onClick={() => setSystemAlertMessage(`🎥 Streaming tactical highlights replay buffer for target player ${hl.player}...`)}
                      className="w-full py-1 bg-[#111] hover:bg-neutral-900 text-[8.5px] font-mono rounded text-stone-200 border border-zinc-850 uppercase cursor-pointer"
                    >
                      ▶️ Simulated Replay Matrix
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* UNLOCKED BADGES SHELF ACCOMPLISHMENTS */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 text-left">
              <div className="border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <Award size={15} className="text-[#ff001c]" />
                <h4 className="text-xs font-black font-mono text-white tracking-widest uppercase">TDM ACCOMPLISHMENTS ACHIEVEMENTS PLATFORM</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tdmAchievements.map((ach) => (
                  <div key={ach.id} className={`p-4 rounded-xl border space-y-2 relative overflow-hidden flex flex-col justify-between ${
                    ach.unlocked
                      ? "bg-red-955/5 border-red-550/25"
                      : "bg-black/65 border-zinc-900/60 opacity-60"
                  }`}>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[8.5px] font-mono text-zinc-550 pb-1">
                        <span>UNLOCKED PROGRESS</span>
                        <strong className={ach.unlocked ? "text-emerald-500 font-bold" : "text-amber-500 font-medium"}>{ach.count}</strong>
                      </div>
                      <h5 className="font-extrabold text-xs text-white uppercase tracking-tight">{ach.title}</h5>
                      <p className="text-[10px] text-zinc-550 leading-relaxed font-sans">{ach.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-900/60 flex justify-between items-center text-[9px] font-mono">
                      <span>STATUS LOG</span>
                      <strong className={ach.unlocked ? "text-red-400 uppercase font-black" : "text-gray-500 uppercase font-bold"}>
                        {ach.unlocked ? "✅ ENABLED SPOT" : "🔒 CURRENTLY LOCKED"}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 7: COMMISSION DIRECTIVES (OWNER MENU) ======================= */}
        {tdmSubTab === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* OWNER DECISION CONTROL BOARD */}
            <div className="bg-[#050505] p-6 rounded-3xl border border-zinc-900 space-y-5">
              <div className="pb-3 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-[#ff001c]" />
                  <h3 className="text-sm font-black font-orbitron tracking-widest text-white uppercase">COMMISSIONER CONTROL OPERANDI</h3>
                </div>
                <span className="text-[10px] text-[#ff001c] font-mono font-black border border-red-550/25 px-2.5 py-0.5 rounded uppercase">
                  ACTIVE AUTHORITY: {userSession.role.toUpperCase()}
                </span>
              </div>

              {/* Controls toggle items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Rule emulator check */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-white text-xs block font-sans tracking-wide">COMPETITIVE EMULATOR BRACKETS BAN</strong>
                      <span className="text-[9.5px] text-zinc-500 font-sans block pt-0.5">If activated, the system filters out candidates utilizing keymapped computer rigs.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!ruleAllowEmulators}
                        onChange={(e) => {
                          setRuleAllowEmulators(!e.target.checked);
                          setSystemAlertMessage(`⚙️ Emulator filters: ${e.target.checked ? "Activated STRICT MOBILE-ONLY" : "De-activated"}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff001c]"></div>
                    </label>
                  </div>
                </div>

                {/* Friendly fire coefficient multiplier */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/80 space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 block uppercase font-bold">LOBBY FRIENDLY FIRE MULTIPLIER</label>
                  <select
                    value={ruleFriendlyFireFactor}
                    onChange={(e) => {
                      setRuleFriendlyFireFactor(e.target.value);
                      setSystemAlertMessage(`⚙️ Friendly Fire modifier calibrated to ${e.target.value}`);
                    }}
                    className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] text-xs text-white p-2 rounded font-mono"
                  >
                    <option value="0.0 (Disabled)">0.0 (Disabled Standard competitive)</option>
                    <option value="0.5 (Reduced)">0.5 (Reduced Tactical Training)</option>
                    <option value="1.0 (Full Damage)">1.0 (Full Damage hardcore mode)</option>
                  </select>
                </div>

                {/* Points weight multiplier */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/80 space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 block uppercase font-bold">KILL POINT WEIGHT MULTIPLIER</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={ruleKillsMultiplier}
                      onChange={(e) => {
                        setRuleKillsMultiplier(parseInt(e.target.value, 10));
                        setSystemAlertMessage(`⚙️ Kill Weight factor: Earn +${e.target.value} points per certified strike`);
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-650"
                    />
                    <span className="text-white text-xs font-mono font-bold shrink-0">{ruleKillsMultiplier}x Point Weight</span>
                  </div>
                </div>

                {/* Match length */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/80 space-y-2">
                  <label className="text-[9px] font-mono text-gray-500 block uppercase font-bold">MAX DUEL LENGTH SPEC</label>
                  <select
                    value={ruleBattleLength}
                    onChange={(e) => {
                      setRuleBattleLength(e.target.value);
                      setSystemAlertMessage(`⚙️ Time Cap set to ${e.target.value}`);
                    }}
                    className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] text-xs text-white p-2 rounded font-mono"
                  >
                    <option value="6 mins">6 Minutes Match (Competitive Blitz)</option>
                    <option value="10 mins">10 Minutes Match (Championship Marathon)</option>
                    <option value="Unlimited">Unlimited Time Cap (Survival Mode)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-red-955/15 text-[#ff001c] border border-red-550/15 rounded-xl text-[10.5px] font-mono text-center flex items-center justify-center gap-2">
                <AlertTriangle size={14} className="animate-pulse shrink-0" />
                <span>COMMISSION SECURITY WARNING: Changes applied directly alter client-side matchmaking queues and standard point registries across all regions!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
