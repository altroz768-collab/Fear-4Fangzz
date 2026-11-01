import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Award,
  Gamepad,
  Video,
  AlertTriangle,
  Scale,
  Users,
  Sliders,
  Play,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  Search,
  MessageSquare,
  HelpCircle,
  FileText,
  Info,
  ChevronRight,
  TrendingUp,
  Globe,
  Radio,
  FileWarning,
  Plus,
  Tv,
  Clock,
  Skull,
  Crosshair,
  UserCheck,
  Zap,
  Check
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
  CartesianGrid
} from "recharts";

// --- TYPES & SCHEMAS ---
export interface LiveTeamRank {
  rank: number;
  teamName: string;
  placementPoints: number;
  eliminationPoints: number;
  totalPoints: number;
  survivalTime: string; // MM:SS
}

export interface KillFeedEvent {
  id: string;
  timestamp: string;
  killer: string;
  killerTeam: string;
  action: "eliminated" | "knocked" | "revived" | "wiped";
  victim: string;
  victimTeam: string;
  weapon?: string;
}

export interface DisputeProtest {
  id: string;
  matchId: string;
  protestingTeam: string;
  accusedTeam: string;
  category: "collusion" | "macros" | "unauthorized-substitution" | "stream-sniping" | "other";
  evidenceDescription: string;
  screenshotUrl: string;
  recordingUrl: string;
  status: "Submitted" | "Under Review" | "Resolved - Action Taken" | "Rejected";
  timestamp: string;
}

export interface MVPContender {
  player: string;
  team: string;
  kills: number;
  assists: number;
  damage: number;
  survivalTime: string; // average survival
  placementContribution: number;
}

// --- SEED STATIC DATA ---
const INITIAL_LIVE_TEAM_RANKINGS: LiveTeamRank[] = [];

const INITIAL_KILL_FEED_EVENTS: KillFeedEvent[] = [];

const INITIAL_DISPUTES: DisputeProtest[] = [];

const INITIAL_MVP_RACE: MVPContender[] = [];

const TOP_FRAGGERS_SEED: any[] = [];

const ANALYTICS_TRENDS = [
  { match: "Match 1", "Fear Elite Alpha": 32, "Zimbabwe Warriors": 22, "Onyx Vipers": 18, "Apex Gladiators": 12 },
  { match: "Match 2", "Fear Elite Alpha": 28, "Zimbabwe Warriors": 34, "Onyx Vipers": 14, "Apex Gladiators": 20 },
  { match: "Match 3", "Fear Elite Alpha": 44, "Zimbabwe Warriors": 25, "Onyx Vipers": 28, "Apex Gladiators": 15 },
  { match: "Match 4", "Fear Elite Alpha": 36, "Zimbabwe Warriors": 40, "Onyx Vipers": 11, "Apex Gladiators": 19 }
];

const BROADCAST_SCHEDULE = [
  { id: "br-1", title: "Fear Grand Slams: Final Shakedown", map: "Erangel Desert", date: "Today", time: "18:00 UTC", caster: "Buster Caster & Analyst Joe", timer: "6 Hours", platform: "YouTube / TikTok" },
  { id: "br-2", title: "Regional Elite Scrim Finals", map: "Sanhok Jungle", date: "Tomorrow", time: "19:30 UTC", caster: "Gigi Plays", timer: "29 Hours", platform: "Twitch / Kick" }
];

const REGIONAL_LEADERBOARDS_DATA = {
  Africa: [
    { rank: 1, team: "Zimbabwe Warriors Esports", points: 285, championName: "Tinashe", logo: "ZIM" },
    { rank: 2, team: "Nairobi Vipers", points: 242, championName: "Kiplagat", logo: "NRB" },
    { rank: 3, team: "Joburg Titans", points: 210, championName: "Lethabo", logo: "JHB" }
  ],
  Europe: [
    { rank: 1, team: "Berlin Overlords", points: 310, championName: "Hans", logo: "BER" },
    { rank: 2, team: "Fear Elite Alpha", points: 305, championName: "Slayer", logo: "CVE" },
    { rank: 3, team: "London Royal Wolves", points: 260, championName: "Pip", logo: "LRW" }
  ],
  Asia: [
    { rank: 1, team: "Seoul Starburst", points: 340, championName: "Min-Jun", logo: "SEO" },
    { rank: 2, team: "Tokyo Ronins", points: 312, championName: "Takeshi", logo: "TOK" },
    { rank: 3, team: "Jakarta Garuda", points: 290, championName: "Budi", logo: "JKT" }
  ],
  "Middle East": [
    { rank: 1, team: "Dubai Desert Kings", points: 294, championName: "Faisal", logo: "DXB" },
    { rank: 2, team: "Riyadh Scorpions", points: 281, championName: "Khalid", logo: "RUH" }
  ],
  "North America": [
    { rank: 1, team: "Texas Outlaws eSports", points: 302, championName: "Dusty", logo: "TEX" },
    { rank: 2, team: "NY Liberty Gun", points: 275, championName: "Vince", logo: "NYL" }
  ],
  "South America": [
    { rank: 1, team: "Sao Paulo Santos", points: 315, championName: "Neymar_X", logo: "SPS" },
    { rank: 2, team: "Buenos Aires Pampas", points: 260, championName: "Lucho", logo: "BAP" }
  ],
  Oceania: [
    { rank: 1, team: "Sydney Sharks", points: 290, championName: "Bruce", logo: "SYD" },
    { rank: 2, team: "Auckland Kiwis", points: 270, championName: "Flynn", logo: "AKL" }
  ]
};

const HISTORICAL_CHAMPIONS = [
  { season: "Season 1", champion: "Fear Elite Alpha", mvp: "FEAR_Mamba_Flick", killRecord: 72, placementPoints: 110, results: "Gold Champion Cup Holders" },
  { season: "Season 2", champion: "Seoul Starburst", mvp: "Min-Jun", killRecord: 85, placementPoints: 124, results: "Asia PMGC Champions League" },
  { season: "Season 3", champion: "Zimbabwe Warriors Esports", mvp: "ZIM_Tinashe", killRecord: 79, placementPoints: 118, results: "Africa Continentals Plate Winners" }
];

// --- CORE COMPONENT ---
interface CVMatchCenterProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
}

export default function CVMatchCenter({
  currentIgn,
  onAlert
}: CVMatchCenterProps) {
  // Navigation Tabs inside Match Center
  const [activeSubView, setActiveSubView] = useState<"rules" | "live" | "analytics" | "disputes" | "broadcasts" | "regional" | "history">("rules");

  // Read State
  const [rulesRead, setRulesRead] = useState<boolean>(() => {
    return localStorage.getItem("cv_match_rules_read") === "true";
  });

  // Dynamic state databases
  const [liveTeams, setLiveTeams] = useState<LiveTeamRank[]>(() => {
    const saved = localStorage.getItem("cv_live_teams_rank");
    return saved ? JSON.parse(saved) : INITIAL_LIVE_TEAM_RANKINGS;
  });

  const [killFeed, setKillFeed] = useState<KillFeedEvent[]>(() => {
    const saved = localStorage.getItem("cv_live_killfeed");
    return saved ? JSON.parse(saved) : INITIAL_KILL_FEED_EVENTS;
  });

  const [protests, setProtests] = useState<DisputeProtest[]>(() => {
    const saved = localStorage.getItem("cv_live_disputes");
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const [mvpRace, setMvpRace] = useState<MVPContender[]>(INITIAL_MVP_RACE);
  const [topFraggers, setTopFraggers] = useState(TOP_FRAGGERS_SEED);

  // Live Match status triggers
  const [matchStatus, setMatchStatus] = useState<"LIVE" | "WARMUP" | "COMPLETED">("LIVE");
  const [currentMap, setCurrentMap] = useState("Erangel desert (PMGC Match 3)");
  const [matchNumber, setMatchNumber] = useState(3);
  const [remainingTeams, setRemainingTeams] = useState(14);
  const [remainingPlayers, setRemainingPlayers] = useState(42);

  // Broadcaster states
  const [broadcastSchedule, setBroadcastSchedule] = useState(BROADCAST_SCHEDULE);

  // Dispute forms
  const [disputeAccused, setDisputeAccused] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeCategory, setDisputeCategory] = useState<DisputeProtest["category"]>("collusion");
  const [disputeScreenshot, setDisputeScreenshot] = useState("");
  const [disputeRecording, setDisputeRecording] = useState("");

  // Point System administration overrides
  const [placementKillPoint, setPlacementKillPoint] = useState(1);
  const [pointRuleLabel, setPointRuleLabel] = useState("Official PMGC Allocation (1pt per Elimination)");

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("cv_live_teams_rank", JSON.stringify(liveTeams));
  }, [liveTeams]);

  useEffect(() => {
    localStorage.setItem("cv_live_killfeed", JSON.stringify(killFeed));
  }, [killFeed]);

  useEffect(() => {
    localStorage.setItem("cv_live_disputes", JSON.stringify(protests));
  }, [protests]);

  // Is Admin Helper
  const isAdmin = ["CV_Slayer_IGL", "CV_Mamba_Flick", "Admin_Elite", "Owner", "MucheChe_Staff", "Staff"].some(
    (name) => currentIgn.toLowerCase().includes(name.toLowerCase()) || currentIgn === "muchecheprince4@gmail.com"
  );

  // --- ACTIONS ---

  const handleMarkRulesAsRead = () => {
    setRulesRead(true);
    localStorage.setItem("fear_match_rules_read", "true");
    onAlert("✅ Official Fear competitive rulebook registered as READ & ACCEPTED. Account synchronization finished.");
  };

  // Live Match Simulator: Tick!
  const triggerSimulationPulse = () => {
    if (remainingPlayers <= 4) {
      setMatchStatus("COMPLETED");
      setRemainingTeams(1);
      setRemainingPlayers(1);
      onAlert("🏆 Simulated Match Finished! Fear Elite Alpha secured the ultimate Team Wipe Chicken Dinner.");
      return;
    }

    const killers = ["FEAR_Mamba_Flick", "ZIM_Tinashe", "FEAR_Slayer_IGL", "Onyx_Cap_Zero", "Gladiator_Rex", "Pip_Royal"];
    const killerTeams = ["Fear Elite Alpha", "Zimbabwe Warriors Esports", "Fear Elite Alpha", "Onyx Vipers", "Apex Gladiators", "London Royal Wolves"];
    const victims = ["Hype_Reaper", "Viper_Shadow", "Giga_VOD", "Rogue_Gat", "Alpha_Captain", "Nomad_Rider"];
    const victimTeams = ["Delta Reapers", "Onyx Vipers", "Nomad Squad", "Vanguard Wolves", "Fear Elite Alpha", "Nomad Squad"];
    const weapons = ["M416 Single-tap", "AWM Mag", "AKM Spray", "Grenade Blast", "Kar98k Headshot", "Sawn-Off Shotgun"];

    const rIdx = Math.floor(Math.random() * killers.length);
    const actions: KillFeedEvent["action"][] = ["eliminated", "knocked", "revived", "wiped"];
    const chosenAction = actions[Math.floor(Math.random() * actions.length)];

    const feedId = "kf-" + Date.now();
    const cleanTime = new Date().toTimeString().split(" ")[0];

    const nextEvent: KillFeedEvent = {
      id: feedId,
      timestamp: cleanTime,
      killer: killers[rIdx],
      killerTeam: killerTeams[rIdx],
      action: chosenAction,
      victim: victims[Math.floor(Math.random() * victims.length)],
      victimTeam: victimTeams[Math.floor(Math.random() * victimTeams.length)],
      weapon: chosenAction !== "revived" ? weapons[Math.floor(Math.random() * weapons.length)] : undefined
    };

    setKillFeed((prev) => [nextEvent, ...prev.slice(0, 15)]);

    // Update remaining counters
    const eliminatedMinus = chosenAction === "eliminated" || chosenAction === "wiped" ? Math.floor(Math.random() * 2) + 1 : 0;
    const nextPlayers = Math.max(1, remainingPlayers - eliminatedMinus);
    const nextTeams = Math.max(1, Math.ceil(nextPlayers / 3));

    setRemainingPlayers(nextPlayers);
    setRemainingTeams(nextTeams);

    // Update Live Leaderboard rankings with mock simulation addition
    setLiveTeams((prevTeams) => {
      const updated = prevTeams.map((team) => {
        if (team.teamName === killerTeams[rIdx]) {
          const elimPointsBonus = chosenAction === "eliminated" ? placementKillPoint : chosenAction === "wiped" ? placementKillPoint * 3 : 0;
          const nextPoints = team.eliminationPoints + elimPointsBonus;
          return {
            ...team,
            eliminationPoints: nextPoints,
            totalPoints: team.placementPoints + nextPoints
          };
        }
        return team;
      });
      // Sort teams
      return updated
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((t, idx) => ({ ...t, rank: idx + 1 }));
    });

    // Update fraggers and MVP state randomly for interactive engagement
    if (chosenAction === "eliminated") {
      setMvpRace((prev) =>
        prev.map((mvp) => {
          if (mvp.player === killers[rIdx]) {
            return {
              ...mvp,
              kills: mvp.kills + 1,
              damage: mvp.damage + Math.floor(Math.random() * 180 + 50)
            };
          }
          return mvp;
        })
      );

      setTopFraggers((prev) =>
        prev.map((p) => {
          if (p.player === killers[rIdx]) {
            return {
              ...p,
              totalKills: p.totalKills + 1,
              matchKills: p.matchKills + 1,
              avgKills: parseFloat(((p.totalKills + 1) / 8).toFixed(1)),
              damage: p.damage + Math.floor(Math.random() * 190)
            };
          }
          return p;
        })
      );
    }

    onAlert(`💥 Real-time Kill Feed Sync: ${killers[rIdx]} ${chosenAction === "knocked" ? "knocked down" : chosenAction === "revived" ? "revived player" : chosenAction === "wiped" ? "wiped squad" : "eliminated"} opponent.`);
  };

  // Reset Match Centers back to full 64 players
  const resetLiveMatchSim = () => {
    setMatchStatus("LIVE");
    setRemainingTeams(16);
    setRemainingPlayers(64);
    setLiveTeams(INITIAL_LIVE_TEAM_RANKINGS);
    setKillFeed(INITIAL_KILL_FEED_EVENTS);
    onAlert("🔄 Reseeded competitive match states back to Circle #1 guidelines.");
  };

  // Submit Dispute Protest
  const handleLodgeDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeAccused.trim() || !disputeReason.trim()) {
      onAlert("⚠️ Please populate accused opponent identifier and dispute reason description.");
      return;
    }

    const newDispute: DisputeProtest = {
      id: "disp-" + Math.floor(Math.random() * 900 + 100),
      matchId: `CV-PROTEST-${matchNumber}`,
      protestingTeam: currentIgn || "Protesting Team Manager",
      accusedTeam: disputeAccused.trim(),
      category: disputeCategory,
      evidenceDescription: disputeReason.trim(),
      screenshotUrl: disputeScreenshot.trim() || "Generated Mock Signature URL (Safe)",
      recordingUrl: disputeRecording.trim() || "Generated Mock Video Signature URL (Safe)",
      status: "Submitted",
      timestamp: new Date().toISOString()
    };

    setProtests((prev) => [newDispute, ...prev]);
    setDisputeAccused("");
    setDisputeReason("");
    setDisputeScreenshot("");
    setDisputeRecording("");

    onAlert(`⚖️ Official Fear Match Dispute Logged! Tracking ID: ${newDispute.id}`);
  };

  // Administrative Actions for Disputes
  const handleResolveDispute = (id: string, actionTaken: boolean) => {
    setProtests((prev) =>
      prev.map((pro) => {
        if (pro.id !== id) return pro;
        return {
          ...pro,
          status: actionTaken ? "Resolved - Action Taken" : "Rejected"
        };
      })
    );
    onAlert(`⚖️ Dispute Protest #${id} resolved: ${actionTaken ? "Approved & score overrides enforced" : "Dismissed by Admin Desk"}`);
  };

  return (
    <div className="bg-[#0b0b0c] text-neutral-300 rounded-3xl p-6 border border-neutral-900 shadow-2xl space-y-8 text-left relative overflow-hidden font-mono">
      {/* Red Glow Tech Mesh Design */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* COMPONENT TITLE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-850">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-red-950/40 text-[#E10600] border border-red-900/30 text-[9px] font-mono tracking-widest font-black rounded-lg uppercase">
              Official Competitive Rulebook
            </span>
            <span className="text-[10px] text-zinc-500">Fear 4Fangz Match Center v3.5</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-white italic flex items-center gap-2.5">
            <Award className="text-[#E10600]" size={26} />
            FEAR MATCH <span className="text-[#E10600]">RULES & ARENA</span>
          </h1>
          <p className="text-xs text-neutral-400 font-sans max-w-2xl">
            Official guidelines for all Battle Royale, TDM tournaments, Regional championships, and live broadcasts. Ensure your roster is checked in and compliant with fair play protocols.
          </p>
        </div>

        {/* Action Read Status Indicator */}
        <div className="flex items-center gap-2">
          {rulesRead ? (
            <span className="bg-[#0e1610] text-emerald-400 border border-emerald-950/50 p-3.5 rounded-2xl text-[10px] font-bold flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-500" />
              RULES ACCEPTED COMPLIANCE IN SYNC
            </span>
          ) : (
            <button
              onClick={handleMarkRulesAsRead}
              className="p-3 px-5 bg-[#E10600] text-white hover:bg-neutral-900 hover:text-white hover:border-[#E10600] border border-transparent font-black uppercase text-xs rounded-2xl transition-all shadow-lg shadow-red-950/20 active:scale-95 flex items-center gap-2"
            >
              <Zap size={13} className="animate-bounce" />
              MARK RULEBOOK AS READ
            </button>
          )}
        </div>
      </div>

      {/* METAHUD REGISTRATION NOTICE */}
      {!rulesRead && (
        <div className="bg-[#181110] border border-red-900/40 p-4.5 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-[#E10600] shrink-0 mt-0.5" size={18} />
          <div className="space-y-1.5 font-sans">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">REQUIRED COMPETITIVE COMPLIANCE INSTRUCTIONS</h4>
            <p className="text-[11.5px] text-zinc-400 leading-relaxed">
              To keep matches competitive and authorized, every athlete, manager, or guest MUST review indices below. Submitting roster applications for tournaments or participating in scrim lobbies without accepting these directives triggers automated sanctions.
            </p>
          </div>
        </div>
      )}

      {/* CONTROL TABS NAVIGATION RAIL */}
      <div className="flex flex-wrap gap-1 p-1 bg-[#101011] rounded-2xl border border-neutral-850">
        <button
          onClick={() => setActiveSubView("rules")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "rules"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <FileText size={12} />
          Match Rules Rulebook
        </button>

        <button
          onClick={() => setActiveSubView("live")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "live"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <Radio size={12} className="text-[#E10600]" />
          Live Fear Match Center
        </button>

        <button
          onClick={() => setActiveSubView("analytics")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "analytics"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <TrendingUp size={12} />
          Team Analytics Charts
        </button>

        <button
          onClick={() => setActiveSubView("broadcasts")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "broadcasts"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <Tv size={12} />
          Broadcast Schedule
        </button>

        <button
          onClick={() => setActiveSubView("regional")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "regional"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <Globe size={12} />
          Regional Leaderboards
        </button>

        <button
          onClick={() => setActiveSubView("disputes")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "disputes"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <Scale size={12} />
          Disputes Portal ({protests.length})
        </button>

        <button
          onClick={() => setActiveSubView("history")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "history"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <Clock size={12} />
          Historical Hall
        </button>
      </div>

      {/* TRANSITIONS VIEWS CONTAINER */}
      <AnimatePresence mode="wait">

        {/* VIEW A: OFFICIAL COMPETITIVE RULEBOOK */}
        {activeSubView === "rules" && (
          <motion.div
            key="rulesbook"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* 1. BATTLE ROYALE SECTION */}
            <div className="bg-[#101011] border border-neutral-900 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
                <Gamepad className="text-[#E10600]" size={16} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Battle Royale Competitive Rules
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs text-neutral-400">
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Fear 4Fangz Battle Royale events adhere to strict roster validation and execution standards. Match administrators reserve absolute vetoes to ensure compliance.
                  </p>
                  <ul className="space-y-2.5 font-sans list-inside list-disc">
                    <li><strong className="text-white">Registered Accounts:</strong> All players must play with their registered game identifications. Sharing with third parties is strictly forbidden.</li>
                    <li><strong className="text-white">Approved Roster Only:</strong> No alternate users can join rooms without a 2-hour formal substitution notice.</li>
                    <li><strong className="text-white">Pre-lobby Integrity:</strong> Teams must complete connection and roster setups 10 minutes before live coordinate drop.</li>
                  </ul>
                </div>

                <div className="bg-[#050506] border border-neutral-850 p-4 rounded-2xl space-y-3">
                  <h4 className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold">ANTI-CHEAT EXTREMUM DETECT</h4>
                  <p className="text-[11px] leading-relaxed text-zinc-500">
                    The platform's client-side heuristics monitor for macro loops, hardware overlays, or unauthorized emulators. Violations trigger an automated platform ban and forfeiture of all accrued championship points.
                  </p>
                  <div className="flex items-center gap-2 p-2 bg-red-950/10 border border-red-900/20 rounded-xl">
                    <Shield size={14} className="text-[#E10600] shrink-0" />
                    <span className="text-[9.5px] text-zinc-400">Security Gate Sentinel auto-validates GUID signatures on coordinate ingress.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PMGC-STYLE COMPETITIVE FORMAT */}
            <div className="bg-[#101011] border border-neutral-900 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-yellow-500" size={16} />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    PMGC-Style Competitive Points Allocation
                  </h3>
                </div>
                <span className="p-1 px-2.5 bg-yellow-950/30 text-yellow-500 border border-yellow-900/30 text-[9px] font-mono tracking-widest font-black rounded uppercase">
                  Global Standard Format
                </span>
              </div>

              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Placements are structured around survival efficiency. Every single lobby elimination outputs matching baseline points, rewarded directly to team standings.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { pos: "1st Place", pts: "10 Points" },
                  { pos: "2nd Place", pts: "6 Points" },
                  { pos: "3rd Place", pts: "5 Points" },
                  { pos: "4th Place", pts: "4 Points" },
                  { pos: "5th Place", pts: "3 Points" },
                  { pos: "6th Place", pts: "2 Points" },
                  { pos: "7th-8th", pts: "1 Point" },
                  { pos: "9th-16th", pts: "0 Points" },
                  { pos: "Per Kill", pts: "1 Point" },
                  { pos: "Consistency Threshold", pts: "Avg. Plt <= 4.5" }
                ].map((term, i) => (
                  <div key={i} className="bg-[#050506] border border-neutral-850 p-2.5 rounded-xl text-center space-y-0.5">
                    <div className="text-[9px] text-zinc-550 uppercase font-bold">{term.pos}</div>
                    <div className="text-xs font-black text-white">{term.pts}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. TDM COMPETITIVE RULES */}
            <div className="bg-[#101011] border border-neutral-900 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
                <Users className="text-[#E10600]" size={16} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Team Deathmatch (TDM) Format Guidelines
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs text-neutral-400">
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    TDM matches are conducted inside closed customized spaces. Focus centers on raw aiming dexterity and strict compliance with weapon constraints.
                  </p>
                  <ul className="space-y-2 list-inside list-disc">
                    <li><strong className="text-white">Format Options:</strong> Best of 1, Best of 3, Best of 5, or Best of 7 (configured by lobby admins).</li>
                    <li><strong className="text-white">Weapon Restrictions:</strong> Slide features, macro triggers, or unapproved weapons are blocked natively by referee observers.</li>
                    <li><strong className="text-white">Roster Integrity:</strong> Matches started with under 4 players cannot invoke replacement triggers mid-game.</li>
                  </ul>
                </div>

                <div className="bg-[#050506] border border-neutral-850 p-4.5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-black block">TDM REGIONAL MATCH STANDINGS</span>
                    <h4 className="text-xs font-bold text-white uppercase font-mono mt-1">NATIVE API TOURNAMENT INTEGRATION</h4>
                    <p className="text-[11px] text-zinc-550 mt-1 font-sans">
                      Match scores are captured via visual OCR scanners on screen-caps directly. Results update the regional ladders automatically with zero delays.
                    </p>
                  </div>
                  <div className="text-[10px] text-emerald-450 bg-[#0c120e] p-2 border border-[#1b3c25] rounded mt-2">
                    ✓ Verified API pipeline active inside all TDM server corridors.
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SPORTSMANSHIP POLICY */}
            <div className="bg-[#101011] border border-[#a21caf]/20 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#a21caf]/20">
                <Scale className="text-purple-500" size={16} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sportsmanship & Athlete Professionalism Conduct
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Platform success relies on deep mutual respect. Any toxicity, slander directed toward opposing coaches, or bad manners on streams triggers structural penalties.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "RESPECT ALL OFFICIALS", text: "Match caster decisions, lobby admins, and coordinate checkers are final. Address protests via proper formal channels." },
                  { title: "ZERO CHAT TOXICITY", text: "Do not spam slurs or attempt targeted character assassination before, during, or after competitive maps." },
                  { title: "COLLUSION SANCTION", text: "Pooling resources or sharing team strategies in custom Battle Royale channels triggers permanent team exclusion." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-2">
                    <h4 className="font-mono text-[9.5px] text-[#a21caf] font-bold uppercase">{item.title}</h4>
                    <p className="text-[11px] text-zinc-400 font-sans">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW B: LIVE MATCH CENTER & LIVE KILL FEED */}
        {activeSubView === "live" && (
          <motion.div
            key="livecenter"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* LIVE CONSOLE INTERACTION BOARD */}
            <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#050506] p-4 rounded-2xl border border-neutral-850">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 bg-red-950 text-red-500 text-[8px] font-black uppercase rounded animate-pulse">
                        {matchStatus}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase font-mono">{currentMap}</span>
                    </div>
                    <h2 className="text-sm font-black text-white uppercase">
                      LOBBY STREAMER FEED: MATCH #{matchNumber} OF 6
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={triggerSimulationPulse}
                      className="p-2 px-3.5 bg-[#E10600] text-white font-mono hover:bg-neutral-900 hover:text-[#E10600] border border-transparent hover:border-[#E10600] font-black uppercase text-[10px] rounded-xl transition-all flex items-center gap-1"
                    >
                      <Play size={10} />
                      Simulate Next Circle
                    </button>
                    <button
                      onClick={resetLiveMatchSim}
                      className="p-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-zinc-400 font-mono font-black uppercase text-[10px] rounded-xl border border-neutral-800 transition-all"
                    >
                      Reset Sim
                    </button>
                  </div>
                </div>

                {/* MATCH CORE COUNTERS HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#050506] border border-neutral-850 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase">MAP IN POSITION</span>
                    <div className="text-xs font-black text-white uppercase">Erangel Desert</div>
                  </div>

                  <div className="bg-[#050506] border border-neutral-850 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase">REMAINING TEAMS</span>
                    <div className="text-xs font-black text-red-500">{remainingTeams} / 16</div>
                  </div>

                  <div className="bg-[#050506] border border-neutral-850 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase">REMAINING SOLOS</span>
                    <div className="text-xs font-black text-red-500">{remainingPlayers} / 64</div>
                  </div>

                  <div className="bg-[#050506] border border-neutral-850 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase">MATCH CIRCLE</span>
                    <div className="text-xs font-black text-white">#5 (Radiation 2.1 m/s)</div>
                  </div>
                </div>

                {/* LIVE RANKINGS LEDGER */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">
                    LIVE STANDINGS & BRACKET INTEGRITY
                  </h3>

                  <div className="bg-[#050506] border border-neutral-850 rounded-2xl overflow-hidden">
                    <div className="p-3 bg-neutral-950 px-4 grid grid-cols-12 text-[9px] text-zinc-550 font-black uppercase border-b border-neutral-900 text-center">
                      <div className="col-span-2 text-left">RANK</div>
                      <div className="col-span-4 text-left">TEAM NAME</div>
                      <div className="col-span-2">PLT PTS</div>
                      <div className="col-span-2">ELM PTS</div>
                      <div className="col-span-2 text-right">TOTAL</div>
                    </div>

                    <div className="divide-y divide-neutral-900 font-mono text-xs max-h-[290px] overflow-y-auto pr-1">
                      {liveTeams.map((team, idx) => (
                        <div key={idx} className="p-3 px-4 grid grid-cols-12 items-center text-center hover:bg-neutral-900/40">
                          <div className="col-span-2 text-left font-black text-zinc-500">#{team.rank}</div>
                          <div className="col-span-4 text-left font-bold text-white truncate">{team.teamName}</div>
                          <div className="col-span-2 text-zinc-400">{team.placementPoints}</div>
                          <div className="col-span-2 text-zinc-400">{team.eliminationPoints}</div>
                          <div className="col-span-2 text-right font-black text-[#E10600]">{team.totalPoints} pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* LIVE REALTIME KILL FEED RIGHT PANEL */}
              <div className="lg:col-span-4 bg-[#050506] border border-neutral-850 rounded-3xl p-5 space-y-4">
                <div className="pb-3 border-b border-neutral-850 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-white uppercase italic flex items-center gap-1.5">
                    <Skull className="text-[#E10600] animate-pulse" size={13} />
                    LIVE MATCH KILL FEED
                  </h3>
                  <span className="text-[7.5px] font-bold uppercase p-0.5 px-2 bg-red-950/20 text-red-500 rounded">
                    REALTIME TICKER
                  </span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {killFeed.map((kf) => (
                    <div key={kf.id} className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-850 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black font-mono text-zinc-400 uppercase tracking-widest">{kf.killerTeam}</span>
                        <span className="text-[8px] text-zinc-550">{kf.timestamp}</span>
                      </div>

                      <div className="text-[11px] font-sans flex flex-wrap items-center gap-1">
                        <strong className="text-white font-mono">{kf.killer}</strong>
                        {kf.action === "eliminated" && (
                          <span className="p-0.5 px-1 bg-red-950 text-red-500 text-[8px] rounded uppercase font-bold">eliminated</span>
                        )}
                        {kf.action === "knocked" && (
                          <span className="p-0.5 px-1 bg-yellow-950 text-yellow-500 text-[8px] rounded uppercase font-bold">knocked</span>
                        )}
                        {kf.action === "revived" && (
                          <span className="p-0.5 px-1 bg-emerald-950 text-emerald-500 text-[8px] rounded uppercase font-bold">revived</span>
                        )}
                        {kf.action === "wiped" && (
                          <span className="p-0.5 px-1 bg-purple-950 text-purple-400 text-[8px] rounded uppercase font-bold">team wiped</span>
                        )}
                        <strong className="text-white font-mono">{kf.victim}</strong>
                        {kf.killerTeam !== kf.victimTeam && (
                          <span className="text-zinc-550">({kf.victimTeam})</span>
                        )}
                      </div>

                      {kf.weapon && (
                        <div className="text-[9px] text-[#E10600] flex items-center gap-1 italic font-mono uppercase">
                          <Crosshair size={9} />
                          Weapon: {kf.weapon}
                        </div>
                      )}
                    </div>
                  ))}

                  {killFeed.length === 0 && (
                    <div className="text-center text-zinc-700 py-16 text-[11px] font-sans">
                      Start simulating circle phases to index stream coordinate triggers.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MVP RACE & TOP FRAGGER SPLIT VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MVP RACE LEADERBOARD */}
              <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="text-yellow-500" size={13} />
                    MVP Race Standings
                  </h3>
                  <span className="text-[8px] text-zinc-500 uppercase">VERIFIED STATS WEIGHT</span>
                </div>

                <div className="space-y-3">
                  {mvpRace.map((player, idx) => (
                    <div key={idx} className="bg-[#050506] border border-neutral-850 rounded-2xl p-4.5 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-550 font-bold">#{idx + 1}</span>
                          <span className="text-xs font-black text-white font-mono">{player.player}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono">{player.team}</div>
                      </div>

                      <div className="flex gap-4 items-center">
                        <div className="text-right">
                          <span className="text-[8px] text-zinc-550 uppercase block">KILLS</span>
                          <strong className="text-white font-mono text-xs">{player.kills}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-zinc-550 uppercase block">DAMAGE</span>
                          <strong className="text-white font-mono text-xs">{player.damage} HP</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-zinc-550 uppercase block">SURVIVAL</span>
                          <strong className="text-emerald-400 font-mono text-[10px]">{player.survivalTime}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP FRAGGERS LEDGER */}
              <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Skull className="text-[#E10600]" size={13} />
                    Top Fragger Leaderboard
                  </h3>
                  <span className="text-[8px] text-zinc-500 uppercase">PMGC SEASON INDEX</span>
                </div>

                <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-900">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="bg-[#101011] text-[9px] text-[#E10600] font-black uppercase text-center border-b border-neutral-850">
                      <tr>
                        <th className="p-3 text-left">PLAYER</th>
                        <th className="p-3">KILLS</th>
                        <th className="p-3">AVG</th>
                        <th className="p-3">HEADS</th>
                        <th className="p-3 text-right">DAMAGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {topFraggers.map((frag, idx) => (
                        <tr key={idx} className="hover:bg-[#101011] text-center">
                          <td className="p-3 text-left">
                            <div className="font-bold text-white">{frag.player}</div>
                          </td>
                          <td className="p-3 font-bold text-white">{frag.totalKills}</td>
                          <td className="p-3 text-zinc-400">{frag.avgKills}</td>
                          <td className="p-3 text-zinc-400">{frag.headspots}</td>
                          <td className="p-3 text-right text-emerald-450 font-bold">{frag.damage} HP</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW C: TEAM ANALYTICS */}
        {activeSubView === "analytics" && (
          <motion.div
            key="analytical"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
              <div className="pb-3 border-b border-neutral-850 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="text-[#E10600]" size={15} />
                  Performance Trends & Points Consistency Metrics
                </h3>
                <span className="text-[10px] text-zinc-550 uppercase">DATA VISUAL RECHARTS v1.5</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 bg-neutral-950 p-4 rounded-2xl border border-neutral-900 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ANALYTICS_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="match" stroke="#666" style={{ fontSize: 10, fontFamily: "monospace" }} />
                      <YAxis stroke="#666" style={{ fontSize: 10, fontFamily: "monospace" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0b0b0c", border: "1px solid #333", borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Line type="monotone" dataKey="Fear Elite Alpha" stroke="#E10600" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Zimbabwe Warriors" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="Onyx Vipers" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="Apex Gladiators" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="lg:col-span-4 space-y-4 font-sans text-xs text-neutral-400">
                  <h4 className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">
                    CONSISTENCY METRIC DEFINITION
                  </h4>
                  <p className="leading-relaxed">
                    Accuracy algorithms balance placement stability alongside eliminations. Lobbies under PMGC standard map loops emphasize placement points consistency to establish true regional seeds.
                  </p>
                  <div className="bg-[#050506] border border-neutral-850 p-4 rounded-xl space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase">Fear Alpha Consistency:</span>
                      <strong className="text-emerald-400">94.2% (Perfect)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase">ZIM Warriors Consistency:</span>
                      <strong className="text-emerald-400">89.5% (High)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase">Onyx Consistency:</span>
                      <strong className="text-yellow-400">71.0% (Stable)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW D: BROADCAST CENTER */}
        {activeSubView === "broadcasts" && (
          <motion.div
            key="broadcasting"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
              <div className="pb-3 border-b border-neutral-850 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Tv className="text-[#E10600]" size={15} />
                  Official Live Stream Scheduler & Broadcast Center
                </h3>
                <span className="text-[10px] text-zinc-550 uppercase">STREAM HUB INTEGRITY</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {broadcastSchedule.map((stream) => (
                  <div key={stream.id} className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono uppercase">{stream.title}</h4>
                        <span className="p-0.5 px-2 bg-[#181110] text-[#E10600] text-[8px] font-bold rounded font-mono uppercase mt-1.5 inline-block">
                          Map: {stream.map}
                        </span>
                      </div>
                      <span className="p-1 px-2.5 bg-emerald-950 text-emerald-400 text-[9px] font-black uppercase rounded animate-pulse">
                        Countdown: {stream.timer}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-neutral-900 pt-3 text-xs text-neutral-400 font-sans">
                      <div className="flex justify-between">
                        <span>Broadcast Date/Time:</span>
                        <strong className="text-white font-mono">{stream.date} - {stream.time}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Casters / Analyst Desk:</span>
                        <strong className="text-white font-mono">{stream.caster}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Authorized Networks:</span>
                        <strong className="text-[#E10600] font-mono">{stream.platform}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* INTEGRATED CHANNELS BAR */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 space-y-4 text-center">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  SUPPORTED LIVESTREAM DISTRIBUTION NETWORKS
                </h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["TikTok Gaming", "YouTube Live", "Twitch eSports", "Facebook Gaming", "Kick Prime"].map((ch, idx) => (
                    <span
                      key={idx}
                      className="p-2 px-5 bg-[#101011] hover:bg-[#1e1e21] text-zinc-350 hover:text-white text-xs font-bold rounded-xl border border-neutral-850 transition-all cursor-pointer font-mono"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW E: REGIONAL LEADERBOARDS */}
        {activeSubView === "regional" && (
          <motion.div
            key="regions"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
              <div className="pb-3 border-b border-neutral-850">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="text-[#E10600]" size={15} />
                  Official Fear Regional Championship Standings
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(REGIONAL_LEADERBOARDS_DATA).map(([region, listings]) => (
                  <div key={region} className="bg-neutral-950 border border-neutral-900 p-4.5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <span className="text-xs font-black text-white font-mono uppercase tracking-wider">
                        {region} SEED
                      </span>
                      <span className="p-0.5 px-1.5 bg-neutral-900 text-zinc-550 border border-neutral-850 text-[8px] rounded uppercase font-bold font-mono">
                        Active League
                      </span>
                    </div>

                    <div className="space-y-3">
                      {listings.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-bold">#{item.rank}</span>
                            <div className="p-1 px-1.5 bg-red-950/25 text-red-500 text-[8px] font-black uppercase rounded">
                              {item.logo}
                            </div>
                            <span className="text-white truncate max-w-[120px]">{item.team}</span>
                          </div>
                          <strong className="text-[#E10600] font-black">{item.points} pts</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW F: DISPUTES & PROTEST SYSTEM */}
        {activeSubView === "disputes" && (
          <motion.div
            key="protests"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* FILE DISPUTE FORM */}
            <div className="lg:col-span-5 bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
              <div className="pb-2 border-b border-neutral-850">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="text-[#E10600]" size={13} />
                  Submit Match Dispute / Protest
                </h3>
              </div>

              <form onSubmit={handleLodgeDispute} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase text-zinc-500 font-black">ACCUSED TEAM IDENTITY</label>
                  <input
                    type="text"
                    required
                    value={disputeAccused}
                    onChange={(e) => setDisputeAccused(e.target.value)}
                    placeholder="e.g. Delta Reapers"
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 rounded text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase text-zinc-500 font-black">PROTEST CLASSIFICATION</label>
                  <select
                    value={disputeCategory}
                    onChange={(e) => setDisputeCategory(e.target.value as any)}
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 rounded text-white focus:outline-none focus:border-[#E10600]"
                  >
                    <option value="collusion">Collusion / Teaming</option>
                    <option value="macros">Unapproved macro scripts / Glitch manipulation</option>
                    <option value="unauthorized-substitution">Unregistered athlete substitute</option>
                    <option value="stream-sniping">Observer Stream Sniping</option>
                    <option value="other">General Fair-Play Breaches</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase text-zinc-500 font-black">EVIDENCE STATEMENT</label>
                  <textarea
                    rows={4}
                    required
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Specify timestamps and exact occurrences..."
                    className="w-full bg-[#050506] border border-neutral-850 p-3 rounded text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase text-zinc-500 font-black">SCREENSHOT LINK (VOD SNAPSHOT)</label>
                  <input
                    type="text"
                    value={disputeScreenshot}
                    onChange={(e) => setDisputeScreenshot(e.target.value)}
                    placeholder="e.g. img_vipers_bridge.png"
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase text-zinc-500 font-black">RECORDING CLOUD LINK / URL</label>
                  <input
                    type="text"
                    value={disputeRecording}
                    onChange={(e) => setDisputeRecording(e.target.value)}
                    placeholder="e.g. video_reapers_scrim.mp4"
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 rounded text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-3 bg-[#E10600] text-white hover:bg-neutral-900 border border-transparent hover:border-[#E10600] hover:text-[#E10600] font-black uppercase text-xs rounded-xl transition-all"
                >
                  SUBMIT DISPUTE PROTEST
                </button>
              </form>
            </div>

            {/* TRACKING QUEUE PANEL */}
            <div className="lg:col-span-7 bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
              <div className="pb-2 border-b border-neutral-850">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileWarning className="text-yellow-500" size={13} />
                  Match Disputes Progress & Decisions Ledger
                </h3>
              </div>

              <div className="space-y-4">
                {protests.map((p) => (
                  <div key={p.id} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] font-black font-mono text-[#E10600] uppercase tracking-widest">
                        PROTEST #{p.id}
                      </span>
                      <span
                        className={`p-1 px-2 text-[8.5px] font-black uppercase rounded ${
                          p.status === "Submitted"
                            ? "bg-yellow-950/40 text-yellow-450 border border-yellow-900/30"
                            : p.status === "Under Review"
                            ? "bg-blue-950/40 text-blue-450 border border-blue-900/30"
                            : p.status === "Resolved - Action Taken"
                            ? "bg-emerald-950/40 text-emerald-450 border border-emerald-900/40"
                            : "bg-neutral-900 text-zinc-500 border border-neutral-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="text-xs font-sans text-neutral-400 space-y-2">
                      <div className="font-mono text-[10.5px]">
                        <span className="text-zinc-550">PLAINTIFF:</span> <strong className="text-white">{p.protestingTeam}</strong> vs <strong className="text-red-400">{p.accusedTeam}</strong>
                      </div>
                      <p className="bg-[#0b0b0c] p-3 rounded-xl border border-neutral-900 leading-relaxed italic text-[11px]">
                        &quot;{p.evidenceDescription}&quot;
                      </p>

                      <div className="flex gap-4 font-mono text-[9px] text-zinc-500">
                        {p.screenshotUrl && (
                          <div>✓ Screenshot: <strong className="text-zinc-400">{p.screenshotUrl}</strong></div>
                        )}
                        {p.recordingUrl && (
                          <div>✓ Recording: <strong className="text-zinc-400">{p.recordingUrl}</strong></div>
                        )}
                      </div>
                    </div>

                    {/* Admin Executive Resolve Controls inside dispute list */}
                    {isAdmin && p.status !== "Resolved - Action Taken" && p.status !== "Rejected" && (
                      <div className="pt-2 flex justify-end gap-2 border-t border-neutral-900">
                        <button
                          onClick={() => handleResolveDispute(p.id, false)}
                          className="p-1.5 px-3 bg-neutral-900 hover:bg-red-950 hover:text-red-400 border border-neutral-800 rounded text-[9.5px] font-black uppercase transition-all"
                        >
                          DISMISS PROTEST
                        </button>
                        <button
                          onClick={() => handleResolveDispute(p.id, true)}
                          className="p-1.5 px-3 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 hover:text-white border border-emerald-900/30 rounded text-[9.5px] font-black uppercase transition-all"
                        >
                          APPROVE & UPDATE PENALTIES
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {protests.length === 0 && (
                  <div className="text-center text-zinc-700 py-16 text-[11px] font-sans">
                    No active tournament protests or match disputes lodged.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW G: COMPETITIVE FAMILY HISTORY */}
        {activeSubView === "history" && (
          <motion.div
            key="hishall"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] border border-neutral-900 p-6 rounded-3xl space-y-4">
              <div className="pb-3 border-b border-neutral-850">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="text-[#E10600]" size={15} />
                  Official Fear Champions History Wall & Records
                </h3>
              </div>

              <div className="space-y-4">
                {HISTORICAL_CHAMPIONS.map((champ, idx) => (
                  <div key={idx} className="bg-neutral-950 border border-neutral-900 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-2.5 bg-yellow-950/40 text-yellow-500 border border-yellow-900/30 text-[9px] font-mono tracking-widest font-black rounded uppercase">
                          {champ.season} CHAMPION
                        </span>
                        <h4 className="text-xs font-bold text-white font-mono uppercase">
                          {champ.champion}
                        </h4>
                      </div>
                      <p className="text-[11.5px] text-zinc-500 font-sans">{champ.results}</p>
                    </div>

                    <div className="flex gap-6 items-center font-mono text-xs">
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-550 block uppercase">SEASON MVP</span>
                        <strong className="text-white">{champ.mvp}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-550 block uppercase">KILL RECORD</span>
                        <strong className="text-[#E10600] font-black">{champ.killRecord} elims</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-550 block uppercase">PLACEMENT PTS</span>
                        <strong className="text-emerald-450">{champ.placementPoints} pts</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ADMIN LEVEL MANAGEMENT CONTROLS PANEL */}
      {isAdmin && (
        <div className="bg-[#111814] border border-[#1b3c25] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1b3c25]">
            <Sliders className="text-emerald-500" size={17} />
            <span className="text-xs font-black font-mono text-emerald-400 uppercase tracking-widest">
              ADMIN ESCALATION MASTER OVERRIDE CONTROLS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-zinc-300">
            <div className="space-y-2">
              <label className="block text-[9px] uppercase font-bold text-emerald-400">CONFIGURE ELIMINATION POINT MULTIPLIER</label>
              <select
                value={placementKillPoint}
                onChange={(e) => {
                  const pts = parseInt(e.target.value);
                  setPlacementKillPoint(pts);
                  setPointRuleLabel(`Custom Point Override: ${pts}pt per elimination`);
                  onAlert(`🔧 Standings recalculator synced: Multiplier adjusted to ${pts}pt per kill.`);
                }}
                className="w-full bg-[#050506] border border-[#1b3c25]/40 p-2.5 rounded text-white focus:outline-none"
              >
                <option value={1}>1 Point Per Kill (Standard PMGC Format)</option>
                <option value={2}>2 Points Per Kill (Aggressive Multiplier style)</option>
                <option value={3}>3 Points Per Kill (Fragger Heaven Double Score)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] uppercase font-bold text-emerald-400">LIVESTREAM ACTIVE CHANNEL SEED</label>
              <button
                onClick={() => {
                  setBroadcastSchedule([
                    ...broadcastSchedule,
                    { id: "br-custom", title: "Fear Wildcard Scrim Shakedown (Community-led)", map: "Vikendi Snowcap", date: "Today", time: "22:00 UTC", caster: "Buster & Slayer", timer: "10 Hours", platform: "Kick" }
                  ]);
                  onAlert("📺 Dynamically cached a community livestream wildcard onto index grid.");
                }}
                className="w-full p-3 bg-emerald-950/60 hover:bg-[#E10600] border border-[#1e5831]/40 hover:border-transparent rounded font-black uppercase text-[10px] text-emerald-450 hover:text-white transition-all text-center"
              >
                CACHE NEW LIVE STREAM SCHED
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] uppercase font-bold text-emerald-400">EMERGENCY RESET STANDINGS MATRIX</label>
              <button
                onClick={() => {
                  setLiveTeams(INITIAL_LIVE_TEAM_RANKINGS);
                  setKillFeed(INITIAL_KILL_FEED_EVENTS);
                  onAlert("⚠️ Standing recalculators returned to pristine seasonal seeding thresholds.");
                }}
                className="w-full p-3 bg-[#110c0c] hover:bg-neutral-900 text-red-500 border border-red-950 hover:border-red-900 rounded font-black uppercase text-[10.5px] transition-all text-center"
              >
                RESET LIVE SCORES CACHE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
