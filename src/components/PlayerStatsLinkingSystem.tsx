import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Award,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Database,
  Lock,
  Unlock,
  Sparkles,
  Info,
  Calendar,
  Gamepad2,
  Filter,
  RefreshCw,
  Clock,
  Skull,
  Crosshair,
  UserCheck,
  Activity,
  UserX,
  PlusCircle,
  BarChart4,
  MapPin,
  Check,
  ChevronRight,
  HelpCircle,
  FileCheck2,
  Trophy,
  ActivitySquare
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

// --- TYPES & INTERFACES ---
export interface PlayerIdentity {
  id: string; // CV-PL-xxxx
  ign: string;
  name: string;
  verifiedEmail: string;
  emailLinked: boolean;
  avatar: string;
  team: string;
  squadAssignment: string; // Exclusive Squad Account name
  reliabilityScore: number; // 0-100%
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
  achievements: string[];
  regionalRank: number;
  rankHistory: number[]; // placement rank over last 6 scrim seasons
}

export interface SquadAnalytics {
  name: string;
  exclusiveCode: string; // Private authorization passcode needed
  wins: number;
  matchesPlayed: number;
  top5: number;
  top10: number;
  totalEliminations: number;
  averagePlacement: number;
  averageDamage: number;
  survivalSeconds: number;
  attendanceRate: number; // %
  mvpAwards: number;
  consistencyScore: number; // 0-100%
}

export interface MatchImportPayload {
  matchId: string;
  eventName: string;
  category: "Scrim" | "Tournament" | "Championship" | "TDM League";
  date: string;
  mvpCandidate: string;
  rawLogs: string;
  records: {
    playerIgn: string;
    kills: number;
    assists: number;
    damage: number;
    survivalSecs: number;
    placement: number;
    teamName: string;
  }[];
}

export interface ImportConflict {
  id: string;
  matchId: string;
  playerIgn: string;
  conflictType: "Unassigned IGN" | "Duplicate Statistics Detect" | "Squad Roster Mismatch" | "Unlinked Security Lock";
  description: string;
  suggestedIdentity?: string; // ID mapping
  isResolved: boolean;
}

// --- SEED SECTIONS ---
const INITIAL_PLAYERS: PlayerIdentity[] = [
  {
    id: "CV-PL-209",
    ign: "CV_Slayer_IGL",
    name: "Alex Thorne",
    verifiedEmail: "alex.thorne@vipers.gg",
    emailLinked: true,
    avatar: "🎯",
    team: "CV Elite Alpha",
    squadAssignment: "Delta Shadows Squad",
    reliabilityScore: 99,
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
    achievements: ["Veteran Commander", "Circle Edge Strategist", "Flawless IGL S10"],
    regionalRank: 1,
    rankHistory: [5, 3, 2, 2, 1, 1]
  },
  {
    id: "CV-PL-314",
    ign: "CV_Mamba_Flick",
    name: "Marcus Sterling",
    verifiedEmail: "m.sterling@vipers.gg",
    emailLinked: true,
    avatar: "🐍",
    team: "CV Elite Alpha",
    squadAssignment: "Delta Shadows Squad",
    reliabilityScore: 96,
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
    achievements: ["Infinite K/D Holder", "22 Miramar Skull Award", "Rapid Headshot Master"],
    regionalRank: 2,
    rankHistory: [12, 8, 4, 3, 2, 2]
  },
  {
    id: "CV-PL-441",
    ign: "ZIM_Tinashe",
    name: "Tinashe Chigumba",
    verifiedEmail: "tinashe@warriors.co.zw",
    emailLinked: true,
    avatar: "⚔️",
    team: "Zimbabwe Warriors Esports",
    squadAssignment: "Onyx Venom Squad",
    reliabilityScore: 98,
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
    achievements: ["Sovereign Champion S4", "Regional Bridge Blocker", "Revival Savior Award"],
    regionalRank: 3,
    rankHistory: [8, 7, 5, 2, 5, 3]
  },
  {
    id: "CV-PL-105",
    ign: "CV_Shadow_Duo",
    name: "Lia Ramirez",
    verifiedEmail: "ramirez.lia@vipers.gg",
    emailLinked: true,
    avatar: "⚡",
    team: "CV Elite Alpha",
    squadAssignment: "Delta Shadows Squad",
    reliabilityScore: 94,
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
    achievements: ["Territory King MVP", "Clutch Assist Pioneer"],
    regionalRank: 4,
    rankHistory: [14, 11, 8, 5, 4, 4]
  },
  {
    id: "CV-PL-992",
    ign: "Onyx_Cap_Zero",
    name: "Takashi Kuro",
    verifiedEmail: "takashi.kuro@onyx.jp",
    emailLinked: false,
    avatar: "💀",
    team: "Onyx Vipers",
    squadAssignment: "Cyber Venom Squad",
    reliabilityScore: 82,
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
    achievements: ["Shadow Stalker", "CQB Destroyer"],
    regionalRank: 7,
    rankHistory: [22, 18, 15, 12, 10, 7]
  }
];

const INITIAL_SQUADS: Record<string, SquadAnalytics> = {
  "Delta Shadows Squad": {
    name: "Delta Shadows Squad",
    exclusiveCode: "SHADOW99",
    wins: 38,
    matchesPlayed: 100,
    top5: 64,
    top10: 82,
    totalEliminations: 412,
    averagePlacement: 3.2,
    averageDamage: 82000,
    survivalSeconds: 1290,
    attendanceRate: 98,
    mvpAwards: 22,
    consistencyScore: 94
  },
  "Onyx Venom Squad": {
    name: "Onyx Venom Squad",
    exclusiveCode: "VENOM70",
    wins: 29,
    matchesPlayed: 100,
    top5: 48,
    top10: 71,
    totalEliminations: 356,
    averagePlacement: 4.8,
    averageDamage: 71000,
    survivalSeconds: 1140,
    attendanceRate: 95,
    mvpAwards: 14,
    consistencyScore: 88
  },
  "Cyber Venom Squad": {
    name: "Cyber Venom Squad",
    exclusiveCode: "CYBER88",
    wins: 18,
    matchesPlayed: 100,
    top5: 32,
    top10: 55,
    totalEliminations: 232,
    averagePlacement: 6.5,
    averageDamage: 54000,
    survivalSeconds: 980,
    attendanceRate: 85,
    mvpAwards: 6,
    consistencyScore: 78
  }
};

const STATS_HISTORY_DATA = [
  { name: "Week 1", "Delta Shadows Squad": 22, "Onyx Venom Squad": 14, "Cyber Venom Squad": 10 },
  { name: "Week 2", "Delta Shadows Squad": 28, "Onyx Venom Squad": 21, "Cyber Venom Squad": 15 },
  { name: "Week 3", "Delta Shadows Squad": 45, "Onyx Venom Squad": 32, "Cyber Venom Squad": 18 },
  { name: "Week 4", "Delta Shadows Squad": 58, "Onyx Venom Squad": 39, "Cyber Venom Squad": 25 },
  { name: "Week 5", "Delta Shadows Squad": 74, "Onyx Venom Squad": 48, "Cyber Venom Squad": 32 },
  { name: "Week 6", "Delta Shadows Squad": 94, "Onyx Venom Squad": 62, "Cyber Venom Squad": 40 }
];

const INITIAL_COMPILER_MATCHES: MatchImportPayload[] = [];

const INITIAL_CONFLICTS: ImportConflict[] = [];

interface PlayerStatsLinkingSystemProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
}

export default function PlayerStatsLinkingSystem({
  currentIgn,
  onAlert
}: PlayerStatsLinkingSystemProps) {
  // Stateful stores
  const [players, setPlayers] = useState<PlayerIdentity[]>(() => {
    const saved = localStorage.getItem("cv_linked_stats_players");
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [squads, setSquads] = useState<Record<string, SquadAnalytics>>(() => {
    const saved = localStorage.getItem("cv_linked_stats_squads");
    return saved ? JSON.parse(saved) : INITIAL_SQUADS;
  });

  const [conflicts, setConflicts] = useState<ImportConflict[]>(() => {
    const saved = localStorage.getItem("cv_linked_stats_conflicts");
    return saved ? JSON.parse(saved) : INITIAL_CONFLICTS;
  });

  const [compilerMatches, setCompilerMatches] = useState<MatchImportPayload[]>(() => {
    const saved = localStorage.getItem("cv_linked_stats_compiler");
    return saved ? JSON.parse(saved) : INITIAL_COMPILER_MATCHES;
  });

  // UI Selection States
  const [activeTab, setActiveTab] = useState<"directory" | "compile" | "squads" | "records">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerIdentity>(players[0]);

  // Squad authorization lock panel simulation rules
  const [selectedSquadName, setSelectedSquadName] = useState<string>("Delta Shadows Squad");
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [authorizedSquads, setAuthorizedSquads] = useState<string[]>(["Delta Shadows Squad"]); // Default unlocked for default selected user

  // Compiler/Simulation State
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [compilationMessage, setCompilationMessage] = useState("");
  const [selectedMatchToImport, setSelectedMatchToImport] = useState<string>("M-IMP-9195");

  // Synchronizers
  useEffect(() => {
    localStorage.setItem("cv_linked_stats_players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("cv_linked_stats_squads", JSON.stringify(squads));
  }, [squads]);

  useEffect(() => {
    localStorage.setItem("cv_linked_stats_conflicts", JSON.stringify(conflicts));
  }, [conflicts]);

  useEffect(() => {
    localStorage.setItem("cv_linked_stats_compiler", JSON.stringify(compilerMatches));
  }, [compilerMatches]);

  // Dynamic derivation
  const activeSquad = squads[selectedSquadName];

  // --- ACTIONS ---

  // Compile Match Results Process Simulation with accurate arithmetic updates
  const handleCompileResults = (matchId: string) => {
    const match = compilerMatches.find((m) => m.matchId === matchId);
    if (!match) {
      onAlert("⚠️ Match payload not found in system storage index.");
      return;
    }

    setIsCompiling(true);
    setCompilationProgress(10);
    setCompilationMessage("[Phase 1/4] Running Secure Player Identity Verification...");

    setTimeout(() => {
      setCompilationProgress(40);
      setCompilationMessage("[Phase 2/4] Cross-referencing registered PUBG Mobile IGNs against CV ID records...");
      
      setTimeout(() => {
        setCompilationProgress(75);
        setCompilationMessage("[Phase 3/4] Sweeping for conflicts, double assignment & duplicate statistics...");

        // Check if Slayer_PUBGM_Alt conflict is still active
        const hasUnresolvedAlt = conflicts.some(c => c.matchId === matchId && !c.isResolved && c.playerIgn === "Slayer_PUBGM_Alt");

        setTimeout(() => {
          setCompilationProgress(100);
          setIsCompiling(false);

          if (hasUnresolvedAlt) {
            setCompilationMessage("❌ COMPILATION BLOCKED: Conflict Sweeper flagged outstanding unmapped player ID logs.");
            onAlert("❌ Data Accuracy Lock triggered! Slayer_PUBGM_Alt is unmapped in the CV database, which prevents automated statistics compilation.");
            return;
          }

          // Process and add stats dynamically to players
          const updatedPlayers = players.map((p) => {
            const record = match.records.find((rec) => rec.playerIgn === p.ign);
            if (record) {
              const matchesPlayedNew = p.matchesPlayed + 1;
              const killsNew = p.kills + record.kills;
              const assistsNew = p.assists + record.assists;
              const damageNew = p.damage + record.damage;
              const winsNew = record.placement === 1 ? p.wins + 1 : p.wins;
              const avgPlacementNew = parseFloat(((p.averagePlacement * p.matchesPlayed + record.placement) / matchesPlayedNew).toFixed(2));
              const mvpNew = match.mvpCandidate === p.ign ? p.mvpAwards + 1 : p.mvpAwards;

              return {
                ...p,
                matchesPlayed: matchesPlayedNew,
                kills: killsNew,
                assists: assistsNew,
                damage: damageNew,
                wins: winsNew,
                averagePlacement: avgPlacementNew,
                mvpAwards: mvpNew,
                reliabilityScore: Math.min(100, p.reliabilityScore + 1)
              };
            }
            return p;
          });

          // Process the corresponding Squad Analytics too
          const updatedSquads = { ...squads };
          match.records.forEach((record) => {
            // Find which player's squad this maps to
            const matchedPlayer = players.find(p => p.ign === record.playerIgn);
            if (matchedPlayer && matchedPlayer.squadAssignment && updatedSquads[matchedPlayer.squadAssignment]) {
              const sq = updatedSquads[matchedPlayer.squadAssignment];
              sq.matchesPlayed += 1;
              sq.totalEliminations += record.kills;
              sq.wins += record.placement === 1 ? 1 : 0;
              if (record.placement <= 5) sq.top5 += 1;
              if (record.placement <= 10) sq.top10 += 1;
              sq.averageDamage = Math.round((sq.averageDamage * (sq.matchesPlayed - 1) + record.damage) / sq.matchesPlayed);
              sq.averagePlacement = parseFloat(((sq.averagePlacement * (sq.matchesPlayed - 1) + record.placement) / sq.matchesPlayed).toFixed(2));
            }
          });

          setPlayers(updatedPlayers);
          setSquads(updatedSquads);

          // Update the selectedPlayer state if currently viewing it
          const currentlySelectedInList = updatedPlayers.find(p => p.id === selectedPlayer.id);
          if (currentlySelectedInList) {
            setSelectedPlayer(currentlySelectedInList);
          }

          // Remove the match from compiler backlog so it can't be reprocessed (prevents duplicate stats)
          setCompilerMatches((prev) => prev.filter((m) => m.matchId !== matchId));

          setCompilationMessage(`✅ Compilation Completed successfully! Match '${match.eventName}' stats synchronized.`);
          onAlert(`🎉 Verified results for "${match.eventName}" processed! Player and Exclusive Squad profiles updated live.`);
        }, 800);
      }, 800);
    }, 800);
  };

  // Resolve conflict process
  const handleResolveConflict = (conflictId: string) => {
    const targetConf = conflicts.find((c) => c.id === conflictId);
    if (!targetConf) return;

    // Resolve Slayer_PUBGM_Alt
    if (targetConf.playerIgn === "Slayer_PUBGM_Alt") {
      // Create permanent mapping to Alex Thorne
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === "CV-PL-209") {
            return {
              ...p,
              achievements: [...p.achievements, "Alt Identity Linked"],
              reliabilityScore: 100
            };
          }
          return p;
        })
      );

      // Set conflict as resolved
      setConflicts((prev) =>
        prev.map((c) => (c.id === conflictId ? { ...c, isResolved: true } : c))
      );

      onAlert("✅ Unassigned IGN conflict resolved! Identity mapped to CV-PL-209 (Alex Thorne). Roster stats unlocked.");
    } else if (targetConf.conflictType === "Unlinked Security Lock") {
      // Simulate User verification linkage
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.ign === "Onyx_Cap_Zero") {
            return { ...p, emailLinked: true, reliabilityScore: 95 };
          }
          return p;
        })
      );

      setConflicts((prev) =>
        prev.map((c) => (c.id === conflictId ? { ...c, isResolved: true } : c))
      );

      onAlert("🔑 User Account 'takashi@onyx.jp' verifies successfully! Security stats lock removed.");
    }
  };

  // Squad passcode verification
  const handleVerifySquadCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSquad) return;

    if (enteredPasscode.trim() === activeSquad.exclusiveCode) {
      setAuthorizedSquads((prev) => [...prev, selectedSquadName]);
      setEnteredPasscode("");
      onAlert(`🔓 Secure Access Approved! Private detailed analytics unlocked for Exclusive Squad: ${selectedSquadName}.`);
    } else {
      onAlert("❌ Restricted: Invalid Exclusive Squad authorization passcode. Administrative error logged.");
    }
  };

  // Filter player list
  const filteredPlayers = players.filter((player) => {
    return (
      player.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.squadAssignment.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-[#0c0c0e] text-zinc-300 rounded-3xl p-6 border border-zinc-900 shadow-2xl space-y-8 text-left relative overflow-hidden font-mono">
      {/* Visual background elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-650/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-6 border-b border-zinc-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-red-950/40 text-red-500 border border-red-900/30 text-[9px] tracking-widest font-black rounded uppercase">
              AUTOMATED COMPLIANCE CORE
            </span>
            <span className="text-[10px] text-zinc-550">Secure Sync Gateway S12</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white italic tracking-wider flex items-center gap-2.5">
            <Database className="text-red-500 animate-pulse" size={24} />
            PLAYER IDENTITY & <span className="text-red-500">STATISTICS LINKING</span> SYSTEM
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-3xl">
            Automatically processes scrimmage maps and championship standings, matches unassigned user accounts, sweeps duplicate data entries, and distributes private Exclusive Squad metrics.
          </p>
        </div>

        {/* CONTROLLING NAVIGATION */}
        <div className="flex flex-wrap gap-2 pt-2 lg:pt-0">
          {[
            { id: "directory", label: "👤 PLAYER IDENTITY", icon: Users },
            { id: "compile", label: "⚙️ PROCESS ENGINE", icon: RefreshCw, count: compilerMatches.length },
            { id: "squads", label: "👥 EXCLUSIVE SQUAD", icon: Trophy },
            { id: "records", label: "🏆 CAREER SYSTEM", icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery("");
                }}
                className={`p-2 px-3 focus:outline-none transition-all duration-250 font-bold uppercase text-[11px] rounded-xl flex items-center gap-1.5 border relative ${
                  isSelected
                    ? "bg-red-950/20 text-red-400 border-red-900/40 shadow-lg shadow-red-950/30 scale-[1.02]"
                    : "bg-surface border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="p-0.5 px-1.5 bg-red-650 text-white rounded text-[9px] font-bold animate-pulse">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER VIEWPORTS */}

      {/* TAB 1: PLAYER DIREC & STATS PROFILE */}
      {activeTab === "directory" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PLAYER DIRECTORY SIDER (4 Col) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#101012] border border-zinc-900 p-4.5 rounded-2xl space-y-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 block">Search Core Player Registry</span>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by IGN, ID, or Squad..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* LIST PLAYER CAPSULES */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredPlayers.map((player) => {
                  const isSelected = selectedPlayer.id === player.id;
                  return (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isSelected
                          ? "bg-zinc-950 border-red-900/40 shadow shadow-red-950/20"
                          : "bg-black/40 hover:bg-zinc-950/50 border-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{player.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-[#FFF] text-xs">{player.ign}</h4>
                            {player.emailLinked && <CheckCircle2 size={11} className="text-emerald-500" title="Verified Roster User" />}
                          </div>
                          <span className="text-[10px] text-zinc-500 block font-sans">{player.name} • {player.id}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="p-0.5 px-1.5 bg-neutral-900 text-red-500 border border-zinc-800 text-[8px] font-black rounded-sm">
                          REG #{player.regionalRank}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredPlayers.length === 0 && (
                  <p className="text-xs text-zinc-550 text-center py-8">No matched identities in active register logs.</p>
                )}
              </div>
            </div>

            {/* LIVE INTEGRATION SUMMARY */}
            <div className="bg-[#101012] border border-zinc-900 p-4 rounded-xl flex items-center gap-3">
              <Info size={16} className="text-amber-500 shrink-0" />
              <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                Accounts must link ownership keys in user settings to remove automatic regulatory statistics locks. Unlinked characters have limited progression badges.
              </p>
            </div>
          </div>

          {/* ACTIVE INDIVIDUAL PLAYER ANALYTICS CAR (8 Col) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* PLAYER PROFILE BANNER */}
            <div className="bg-[#101012] border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-650/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-4">
                  <span className="text-4xl p-2 bg-zinc-950 rounded-2xl border border-zinc-850 shadow-md">
                    {selectedPlayer.avatar}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{selectedPlayer.ign}</h3>
                      {selectedPlayer.emailLinked ? (
                        <span className="p-0.5 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[8.5px] font-bold rounded">
                          VERIFIED LOG LINKED
                        </span>
                      ) : (
                        <span className="p-0.5 px-2 bg-yellow-950/30 text-yellow-500 border border-yellow-900/20 text-[8.5px] font-bold rounded">
                          LOCK STATUS LACKING
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-zinc-400 font-sans flex flex-wrap gap-x-4">
                      <span>CV ID: <strong className="text-white font-mono">{selectedPlayer.id}</strong></span>
                      <span>Squad: <strong className="text-white">{selectedPlayer.squadAssignment}</strong></span>
                      <span>Team: <strong className="text-white">{selectedPlayer.team}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-950/15 border border-red-900/30 p-2.5 rounded-xl text-center shadow">
                  <span className="text-[8px] text-zinc-500 block uppercase font-mono tracking-wider">REGIONAL POWER INDEX</span>
                  <strong className="text-red-500 font-mono text-base block font-black">RANK #{selectedPlayer.regionalRank}</strong>
                </div>
              </div>

              {/* LIVE PERFORMANCE STATS METRIC GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4.5 pt-6 text-xs">
                <div className="bg-black/45 border border-zinc-850 p-3.5 rounded-xl space-y-1 text-center">
                  <span className="text-zinc-550 block text-[9px] uppercase tracking-widest">K/D RATIO</span>
                  <strong className="text-white text-base font-black">{(selectedPlayer.kills / selectedPlayer.matchesPlayed).toFixed(2)}</strong>
                </div>

                <div className="bg-black/45 border border-zinc-850 p-3.5 rounded-xl space-y-1 text-center">
                  <span className="text-zinc-550 block text-[9px] uppercase tracking-widest">ACCUMULATED KILLS</span>
                  <strong className="text-white text-base font-black">{selectedPlayer.kills}</strong>
                </div>

                <div className="bg-black/45 border border-zinc-850 p-3.5 rounded-xl space-y-1 text-center">
                  <span className="text-zinc-550 block text-[9px] uppercase tracking-widest">WINS / PLAYED</span>
                  <string className="text-white text-base font-black">{selectedPlayer.wins} / {selectedPlayer.matchesPlayed}</string>
                </div>

                <div className="bg-black/45 border border-zinc-850 p-3.5 rounded-xl space-y-1 text-center">
                  <span className="text-zinc-550 block text-[9px] uppercase tracking-widest">RELIABILITY INDEX</span>
                  <strong className="text-emerald-400 text-base font-black">{selectedPlayer.reliabilityScore}%</strong>
                </div>
              </div>

              {/* LIVE SEGMENTS: PERFORMANCE STAT BARS */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CAREER DETAILS */}
                <div className="space-y-3.5">
                  <h4 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-900/60">
                    <ActivitySquare size={13} className="text-red-500" />
                    Interactive Performance Tracker
                  </h4>

                  <div className="space-y-3 font-sans">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-500">Kills / Assist Ratio</span>
                        <span className="text-white font-mono font-bold">{selectedPlayer.kills} : {selectedPlayer.assists}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-650 h-full" style={{ width: `${Math.min(100, (selectedPlayer.kills / (selectedPlayer.kills + selectedPlayer.assists)) * 100)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-500">Average Placement (Leaderboard)</span>
                        <span className="text-white font-mono font-bold">{selectedPlayer.averagePlacement} Avg Place</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: `${Math.max(10, 100 - (selectedPlayer.averagePlacement * 8))}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-500">Avg Combat Survival Time</span>
                        <span className="text-white font-mono font-bold">{selectedPlayer.survivalMinutes} Minutes</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#00FFBD] h-full" style={{ width: `${(selectedPlayer.survivalMinutes / 30) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* HISTORICAL RANK PROGRESS CHART */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-zinc-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-900/60">
                    <TrendingUp size={13} className="text-red-500" />
                    Seasonal Progress (Regional Rank)
                  </h4>

                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={selectedPlayer.rankHistory.map((rank, i) => ({ season: `S${5 + i}`, Rank: rank }))}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="season" stroke="#666" fontSize={9} />
                        <YAxis stroke="#666" fontSize={9} reversed />
                        <Tooltip contentStyle={{ backgroundColor: "#0e0e11", border: "1px solid #33s" }} />
                        <Area type="monotone" dataKey="Rank" stroke="#ff001c" fill="rgba(255, 0, 28, 0.05)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ACHIEVEMENTS AND REGULAR AWARDS */}
              <div className="pt-6 border-t border-zinc-900/60 mt-6 space-y-3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">Unlocked Achievements Badges</span>
                <div className="flex flex-wrap gap-2.5">
                  {selectedPlayer.achievements.map((ach, i) => (
                    <span key={i} className="p-1 px-3 bg-zinc-950 border border-zinc-850 hover:border-red-500/20 text-[#FFF] text-[10px] rounded-lg shadow-sm flex items-center gap-1.5">
                      <Sparkles size={11} className="text-yellow-500" />
                      {ach}
                    </span>
                  ))}
                  <span className="p-1 px-3 bg-zinc-950 border border-zinc-850 text-yellow-500 text-[10px] rounded-lg shadow-sm flex items-center gap-1.5 font-bold">
                    <Award size={11} />
                    {selectedPlayer.mvpAwards}x Match MVPs
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: AUTOMATIC COMPILATION PROCESSOR */}
      {activeTab === "compile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PROCESSING CONTROLS AND PENDING QUEUE (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* INPORT QUEUE CARD */}
            <div className="bg-[#101012] border border-zinc-900 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Database size={13} className="text-zinc-400" />
                  Roster Result Compilation Block
                </h3>
                <span className="p-0.5 px-2 bg-yellow-950/30 text-yellow-500 border border-yellow-900/20 text-[8.5px] font-bold rounded">
                  {compilerMatches.length} Pending
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Matches listed below are retrieved dynamically from the server lobby ticker and require verification checks to prevent incorrect statistical pollution.
              </p>

              {/* MATCH CARDS */}
              <div className="space-y-3 pt-2">
                {compilerMatches.map((match) => (
                  <div key={match.matchId} className="bg-black/60 border border-zinc-850 rounded-xl p-4 space-y-3 hover:border-zinc-805 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="p-0.5 px-2 bg-neutral-900 text-yellow-500 border border-neutral-800 text-[8px] font-black rounded uppercase">
                          {match.category}
                        </span>
                        <h4 className="text-xs font-bold text-white">{match.eventName}</h4>
                      </div>
                      <span className="text-[10px] text-zinc-550 font-mono italic">{match.date}</span>
                    </div>

                    {/* MATCH PAYLOAD PREVIEW */}
                    <div className="p-2 bg-zinc-950 border border-zinc-900 rounded font-mono text-[9px] text-zinc-550">
                      Roster: {match.records.map((r) => r.playerIgn).join(", ")}
                    </div>

                    {/* COMPILE TRIGGER */}
                    <button
                      onClick={() => handleCompileResults(match.matchId)}
                      disabled={isCompiling}
                      className="w-full p-2 bg-red-650 hover:bg-red-700 disabled:bg-neutral-900 text-white font-mono uppercase text-[10px] font-black tracking-wider rounded-lg transition-all"
                    >
                      {isCompiling ? "Processing verification checks..." : "⚡ Compile & Update Leaderboard"}
                    </button>
                  </div>
                ))}

                {compilerMatches.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-zinc-900 rounded-xl space-y-2">
                    <CheckCircle2 className="mx-auto text-emerald-500" size={30} />
                    <p className="text-xs font-sans text-zinc-550">No compilation backlogs remaining. Live sync active.</p>
                  </div>
                )}
              </div>
            </div>

            {/* LIVE VERIFICATION SIMULATION LEDGER */}
            {isCompiling && (
              <div className="bg-black font-mono border border-zinc-850 p-4 rounded-xl space-y-3">
                <span className="text-[9px] text-yellow-500 font-bold block">COMPILING LOBBY METRICS</span>
                <p className="text-[11px] text-zinc-400">{compilationMessage}</p>
                
                {/* Simulated slider progress bar */}
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${compilationProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* IDENTITY RESOLUTION & CONFLICT SWEEPER (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-[#101012] border border-zinc-900 p-6 rounded-2xl space-y-4">
              <div className="pb-2 border-b border-zinc-900 flex justify-between items-center text-xs">
                <span className="text-[10.5px] uppercase font-bold text-white tracking-widest flex items-center gap-1.5">
                  <AlertTriangle className="text-yellow-500" size={14} />
                  Regulatory Integrity & Identity Conflict Sweeper
                </span>
                <span className="p-0.5 px-2 bg-red-950/20 text-red-500 border border-red-900/30 text-[8px] font-black rounded uppercase">
                  SWEEPER STATUS: SECURE
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                If the automated results pipeline finds discrepancy logs (e.g. unmapped visitor names, unassigned team lineups, or unlinked profiles), stats are locked until admin mapping verifies true identities.
              </p>

              {/* CONFLICTS LIST */}
              <div className="space-y-3.5 pt-2">
                {conflicts.map((conf) => (
                  <div
                    key={conf.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      conf.isResolved
                        ? "bg-[#0b120d] border-emerald-900/20"
                        : "bg-black/50 border-yellow-900/20"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9.5px] uppercase font-bold text-red-400">{conf.conflictType}</span>
                      {conf.isResolved ? (
                        <span className="p-0.5 px-2 bg-emerald-950 text-emerald-400 rounded text-[9px] font-black font-mono uppercase">
                          ✓ RESOLVED & LINKED
                        </span>
                      ) : (
                        <span className="p-0.5 px-2 bg-yellow-950 text-yellow-500 rounded text-[9px] font-black font-mono uppercase animate-pulse">
                          ⚠️ PENDING RESOLUTION
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{conf.description}</p>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-zinc-900/50">
                      <div className="text-[10px] text-zinc-550">
                        <span>Lobby Subject: <strong className="text-white font-mono">{conf.playerIgn}</strong></span>
                        {conf.suggestedIdentity && (
                          <span className="block mt-0.5">Suggested Account link: <strong className="text-yellow-550">{conf.suggestedIdentity} (Alex Thorne)</strong></span>
                        )}
                      </div>

                      {!conf.isResolved && (
                        <button
                          onClick={() => handleResolveConflict(conf.id)}
                          className="p-1.5 px-3 bg-zinc-950 border border-yellow-900/30 text-yellow-500 hover:border-yellow-500/50 hover:bg-zinc-900 font-mono text-[9px] font-extrabold uppercase rounded-lg transition-all cursor-pointer"
                        >
                          Resolve & Map Stats Identity
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HOW PLAYERS IDENTITIES LINK ADVISORY */}
            <div className="bg-[#111115] border border-zinc-900 p-6 rounded-2xl space-y-3">
              <h4 className="text-xs uppercase font-bold text-white flex items-center gap-1.5">
                <FileCheck2 size={13} className="text-red-500" />
                Player Matching Protocol (Precision Rules)
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-[11.5px] font-sans text-zinc-400 leading-normal">
                <li>Matches verified accounts using stored profile signature hashes.</li>
                <li>Saves results automatically to active, historical, and seasonal leaderboard rosters.</li>
                <li>Roster verification checks ensure matches linked to an alternate IGN still process results under the player's core Unique ID.</li>
                <li>Administrators are immediately notified if statistics clash or map to unregistered players.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: EXCLUSIVE SQUAD SPACE */}
      {activeTab === "squads" && (
        <div className="space-y-6">
          
          {/* SELECT SQUAD AND PRIVATE ACCESS BLOCK */}
          <div className="bg-[#101012] border border-zinc-900 p-6 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-900">
              <div className="space-y-1">
                <span className="text-[9.5px] text-red-500 uppercase tracking-widest font-black block">CLAN SQUAD ANALYTICS GATEWAY</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#FFF] uppercase tracking-wide">Select Exclusive Clan Squad</h3>
                  <span className="p-0.5 px-2 bg-zinc-950 border border-zinc-850 text-[10px] text-zinc-500 uppercase">PRIVATE VAULT</span>
                </div>
              </div>

              {/* SQUAD SELECTION SELECTOR */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(squads).map((sqName) => {
                  const isSelected = selectedSquadName === sqName;
                  return (
                    <button
                      key={sqName}
                      onClick={() => {
                        setSelectedSquadName(sqName);
                      }}
                      className={`p-2 px-3 text-[10px] font-mono font-bold uppercase rounded-lg transition-all ${
                        isSelected
                          ? "bg-red-950/20 text-red-400 border border-red-900/30"
                          : "bg-black border border-zinc-900 text-zinc-500 hover:text-white"
                      }`}
                    >
                      {sqName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECURITY GATE CHECK: ONLY AUTHORIZED USERS */}
            {activeSquad && (
              <AnimatePresence mode="wait">
                {!authorizedSquads.includes(selectedSquadName) ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8 bg-zinc-950 border border-red-900/10 rounded-xl space-y-4 max-w-xl mx-auto text-center"
                  >
                    <Lock className="mx-auto text-red-500 animate-bounce" size={32} />
                    <div className="space-y-1.5">
                      <h4 className="text-white text-sm font-black uppercase">RESTRICTED: SQUAD AUTHORIZATION REQUIRED</h4>
                      <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
                        Detailed performance records inside the "{selectedSquadName}" space are locked to verified squad roster members only. Simulate entering the passcode to unlock.
                      </p>
                    </div>

                    <form onSubmit={handleVerifySquadCode} className="space-y-3 max-w-xs mx-auto text-xs font-sans">
                      <div className="space-y-1">
                        <label className="text-[9.5px] text-zinc-550 font-mono tracking-widest uppercase font-bold">Squad Invitation PASSCODE</label>
                        <input
                          type="password"
                          value={enteredPasscode}
                          onChange={(e) => setEnteredPasscode(e.target.value)}
                          placeholder="Passcode (Shadows: SHADOW99, Venom: VENOM70)"
                          className="w-full text-center tracking-widest bg-black border border-zinc-850 rounded-lg py-2 font-mono text-white placeholder-zinc-700"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full p-2 bg-red-650 hover:bg-red-700 text-white font-mono uppercase text-xs font-black rounded-lg transition-all"
                      >
                        Unlock Private Analytics
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    {/* STATS TILES (5 Col) */}
                    <div className="lg:col-span-5 space-y-4">
                      
                      <div className="p-1 px-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 text-[9.5px] font-bold rounded-lg uppercase inline-flex items-center gap-1.5">
                        <Unlock size={11} className="text-emerald-500" />
                        Access Cleared: Official Squad Ledger Active
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-xl">
                          <span className="text-[9px] text-zinc-550 block uppercase font-mono tracking-wider">MATCHES PLAYED</span>
                          <strong className="text-[#FFF] text-base">{activeSquad.matchesPlayed}</strong>
                        </div>

                        <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-xl">
                          <span className="text-[9px] text-zinc-550 block uppercase font-mono tracking-wider">TOTAL CHAMP WINS</span>
                          <strong className="text-emerald-400 text-base">{activeSquad.wins}</strong>
                        </div>

                        <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-xl">
                          <span className="text-[9px] text-zinc-550 block uppercase font-mono tracking-wider">ELIMINATIONS CONTRI</span>
                          <strong className="text-[#FFF] text-base">{activeSquad.totalEliminations}</strong>
                        </div>

                        <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-xl">
                          <span className="text-[9px] text-zinc-550 block uppercase font-mono tracking-wider">AVERAGE DAMAGE</span>
                          <strong className="text-[#FFF] text-base">{activeSquad.averageDamage}</strong>
                        </div>

                        <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-xl">
                          <span className="text-[9px] text-zinc-550 block uppercase font-mono tracking-wider">ATTENDANCE RATE</span>
                          <strong className="text-[#FFF] text-base">{activeSquad.attendanceRate}%</strong>
                        </div>

                        <div className="bg-black/40 border border-zinc-850 p-3.5 rounded-xl text-yellow-500 border-yellow-900/20">
                          <span className="text-[9px] text-zinc-550 block uppercase font-mono tracking-wider">CONSISTENCY SCORE</span>
                          <strong className="text-yellow-400 text-base">{activeSquad.consistencyScore}%</strong>
                        </div>
                      </div>

                      {/* STAT RATIOS BLOCK */}
                      <div className="bg-black/20 border border-zinc-850 p-4.5 rounded-xl text-left space-y-3.5">
                        <span className="text-[10px] text-zinc-450 uppercase block">Roster Placement Consistency Ratios</span>
                        
                        <div className="space-y-2 font-sans text-xs">
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-zinc-500">Top 5 Finishes</span>
                              <span className="text-white font-mono font-bold">{activeSquad.top5}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${activeSquad.top5}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-zinc-500">Top 10 Finishes</span>
                              <span className="text-white font-mono font-bold">{activeSquad.top10}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-yellow-500 h-full" style={{ width: `${activeSquad.top10}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SQUAD PERFORMANCE VISUALIZATION GRAPH (7 Col) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="bg-black/45 border border-zinc-850 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white uppercase font-mono tracking-wide">Squad Power Rating Trends</span>
                          <span className="text-zinc-600 font-sans">Last 6 active tournaments</span>
                        </div>
                        
                        <div className="h-48 pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={STATS_HISTORY_DATA}
                              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                              <XAxis dataKey="name" stroke="#666" fontSize={9} />
                              <YAxis stroke="#666" fontSize={9} />
                              <Tooltip contentStyle={{ backgroundColor: "#0e0e11", border: "1px solid #33s" }} />
                              <Legend wrapperStyle={{ fontSize: 9 }} />
                              <Line type="monotone" dataKey={selectedSquadName} stroke="#ff001c" strokeWidth={2.5} activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* TEAM CONTRIBUTIONS PROFILE LINK */}
                      <div className="bg-[#05055] border border-zinc-900 rounded-xl p-4.5 space-y-3 text-left">
                        <span className="text-[10px] text-zinc-500 uppercase block font-bold">Roster Lineup Linked to Faction</span>
                        <div className="grid grid-cols-2 gap-3.5">
                          {players
                            .filter((p) => p.squadAssignment === selectedSquadName)
                            .map((p) => (
                              <div key={p.id} className="bg-black/50 border border-zinc-850 p-2.5 rounded-lg flex items-center gap-2">
                                <span className="text-lg">{p.avatar}</span>
                                <div>
                                  <strong className="text-xs text-white block">{p.ign}</strong>
                                  <span className="text-[9px] text-zinc-500 block">Kills contrib: {p.kills}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LONG-TERM CAREER RECORDS HALL */}
      {activeTab === "records" && (
        <div className="space-y-6">
          <div className="bg-[#101012] border border-zinc-900 p-6 rounded-2xl space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest pb-2 border-b border-zinc-900 flex items-center gap-1.5">
              <Trophy className="text-yellow-500 animate-pulse" size={15} />
              CV Match History permanent Hall of Fame records
            </h3>

            <p className="text-xs text-zinc-405 font-sans leading-relaxed">
              Historical esports statistics compiled verified matching credentials. Lifetime highest scores across all official tournaments and regional scrimmages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[
                { label: "🔥 MOST SEASONAL KILLS", val: "184 Kills", holder: "CV_Mamba_Flick", icon: Skull },
                { label: "👑 MOST CHAMPIONSHIP WINS", val: "18 Victories", holder: "CV_Slayer_IGL", icon: Trophy },
                { label: "⚡ HIGHEST MATCH DAMAGE", val: "34,500 HP", holder: "CV_Mamba_Flick", icon: Crosshair },
                { label: "⭐ MOST MVP TROPHIES", val: "12 MVP Awards", holder: "CV_Mamba_Flick", icon: Award },
                { label: "📊 BEST AVERAGE PLACEMENT", val: "3.4 Avg Placement", holder: "CV_Slayer_IGL", icon: TrendingUp },
                { label: "🤝 CLUTCH REVIVAL DEFENDER", val: "29 Revives", holder: "CV_Shadow_Duo", icon: UserCheck }
              ].map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <div key={idx} className="bg-black/50 border border-zinc-850 hover:border-red-500/25 p-5 rounded-2xl space-y-3.5 transition-all text-center">
                    <div className="w-10 h-10 rounded-full bg-red-950/20 text-red-500 border border-red-900/20 flex items-center justify-center mx-auto">
                      <Icon size={18} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-widest leading-none mb-1">
                        {rec.label}
                      </span>
                      <strong className="text-white text-lg font-black block tracking-tight">
                        {rec.val}
                      </strong>
                    </div>

                    <div className="border-t border-zinc-900 pt-2 text-[11px] text-zinc-400">
                      Holder: <strong className="text-[#00FFBD]">{rec.holder}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
