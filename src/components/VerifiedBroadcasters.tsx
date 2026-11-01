import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radio,
  Search,
  Award,
  Shield,
  UserPlus,
  ExternalLink,
  Flame,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Check,
  CheckCircle2,
  TrendingUp,
  Compass,
  Play,
  Monitor,
  Power,
  Zap,
  Users,
  RefreshCw,
  Youtube,
  Twitch,
  Facebook,
  Volume2,
  VolumeX,
} from "lucide-react";
import { UserSession } from "../types";

interface Broadcaster {
  id: string;
  ign: string;
  name: string;
  role: string;
  avatar: string;
  game: string;
  status: "LIVE" | "OFFLINE";
  platform: "Twitch" | "YouTube Gaming" | "Facebook Gaming";
  followers: number;
  avgViewers: number;
  streamTitle?: string;
  coverImage?: string;
  schedule: string;
  kd: string;
  activeMetrics?: {
    resolution: string;
    bitrate: string;
    fps: string;
  };
}

interface VerifiedBroadcastersProps {
  session: UserSession;
  awardXp: (amount: number) => void;
  setSystemAlertMessage: (msg: string) => void;
  addCoins?: (amount: number) => void;
}

const INITIAL_BROADCASTERS: Broadcaster[] = [
  {
    id: "bc-1",
    ign: "CV_Slayer_IGL",
    name: "Alex Thorne",
    role: "In-Game Leader (IGL)",
    avatar: "🎯",
    game: "PUBG Mobile",
    status: "LIVE",
    platform: "Twitch",
    followers: 342000,
    avgViewers: 1450,
    streamTitle: "🏆 PRO LEAGUE ROTATIONS ─ SCRIM HARD SHIFTS & HIGHEST PRESSURE ENDGAMES",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    schedule: "Daily @ 16:00 UTC",
    kd: "4.82",
    activeMetrics: { resolution: "1080p", bitrate: "6500Kbps", fps: "120 FPS" }
  },
  {
    id: "bc-2",
    ign: "CV_Valkyrie",
    name: "Elena Ross",
    role: "Lead Faction Broadcaster",
    avatar: "🎙️",
    game: "Just Chatting",
    status: "LIVE",
    platform: "YouTube Gaming",
    followers: 200000,
    avgViewers: 2150,
    streamTitle: "🎙️ CONES AND TEAM ROSTER SHIFTS // TALKING WITH THE HEAVY WEIGHTS",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
    schedule: "Tue, Thu, Sat @ 18:00 UTC",
    kd: "N/A",
    activeMetrics: { resolution: "2K Quad", bitrate: "9000Kbps", fps: "60 FPS" }
  },
  {
    id: "bc-3",
    ign: "CV_Shadow_Duo",
    name: "Lia Ramirez",
    role: "Primary Assaulter / Roamer",
    avatar: "⚡",
    game: "PUBG Mobile",
    status: "LIVE",
    platform: "YouTube Gaming",
    followers: 128500,
    avgViewers: 980,
    streamTitle: "⚡ SOLO QUEUE DOMINANCE & ADVANCED GYROSCOPE ROTATING IN MIRAMAR",
    coverImage: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=800",
    schedule: "Mon, Wed, Fri @ 15:00 UTC",
    kd: "5.10",
    activeMetrics: { resolution: "1080p", bitrate: "6000Kbps", fps: "90 FPS" }
  },
  {
    id: "bc-4",
    ign: "CV_Mamba_Flick",
    name: "Marcus Sterling",
    role: "Frontline Sniper",
    avatar: "🐍",
    game: "PUBG Mobile",
    status: "LIVE",
    platform: "Facebook Gaming",
    followers: 94200,
    avgViewers: 520,
    streamTitle: "Towering High Ground Control ── Absolute Flawless Single Match Highlights",
    coverImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800",
    schedule: "Mon to Sat @ 19:00 UTC",
    kd: "4.15",
    activeMetrics: { resolution: "1080p", bitrate: "5800Kbps", fps: "90 FPS" }
  },
  {
    id: "bc-5",
    ign: "CV_Alpha_Spectre",
    name: "Hiroshi Sato",
    role: "Roster Co-Anchor / Support",
    avatar: "🛡️",
    game: "PUBG Mobile",
    status: "OFFLINE",
    platform: "Twitch",
    followers: 45000,
    avgViewers: 410,
    schedule: "Daily @ 14:00 UTC",
    kd: "3.95"
  },
  {
    id: "bc-6",
    ign: "CV_ZapGamer",
    name: "Kevin Cole",
    role: "Montage Producer",
    avatar: "🎬",
    game: "PUBG Mobile Workshop",
    status: "OFFLINE",
    platform: "YouTube Gaming",
    followers: 82000,
    avgViewers: 320,
    schedule: "Three times weekly",
    kd: "3.40"
  },
  {
    id: "bc-7",
    ign: "CV_Frostbite",
    name: "Tasha Ginn",
    role: "Academy League Starter",
    avatar: "❄️",
    game: "PUBG Mobile",
    status: "OFFLINE",
    platform: "Facebook Gaming",
    followers: 31400,
    avgViewers: 120,
    schedule: "Weekends @ 12:00 UTC",
    kd: "2.85"
  },
  {
    id: "bc-8",
    ign: "CV_CrimsonRose",
    name: "Claire Vance",
    role: "Community Event Caster",
    avatar: "🌹",
    game: "Just Chatting",
    status: "LIVE",
    platform: "Twitch",
    followers: 115000,
    avgViewers: 720,
    streamTitle: "🌹 HOSTING MATE MATCHES & CUSTOM ROOM COIN CHALLENGES",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    schedule: "Saturdays @ 16:00 UTC",
    kd: "3.10",
    activeMetrics: { resolution: "180p", bitrate: "4500Kbps", fps: "60 FPS" }
  }
];

export default function VerifiedBroadcasters({
  session,
  awardXp,
  setSystemAlertMessage,
  addCoins,
}: VerifiedBroadcastersProps) {
  const [broadcasters, setBroadcasters] = useState<Broadcaster[]>(INITIAL_BROADCASTERS);
  const [filterPlatform, setFilterPlatform] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [selectedStream, setSelectedStream] = useState<Broadcaster | null>(null);

  // Application Form States
  const [formHandle, setFormHandle] = useState("");
  const [formPlatform, setFormPlatform] = useState("Twitch");
  const [formFollowers, setFormFollowers] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formApplying, setFormApplying] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Live Stream Simulation Stats & Feed
  const [isMuted, setIsMuted] = useState(true);
  const [simViewerCount, setSimViewerCount] = useState(0);
  const [liveChatMessages, setLiveChatMessages] = useState<string[]>([]);
  const [chatInputValue, setChatInputValue] = useState("");

  // Handle subscriber tracking increment
  const handleFollow = (bcId: string, ign: string) => {
    if (followedIds.includes(bcId)) {
      setFollowedIds(prev => prev.filter(id => id !== bcId));
      setBroadcasters(prev =>
        prev.map(b => (b.id === bcId ? { ...b, followers: b.followers - 1 } : b))
      );
      setSystemAlertMessage(`Unfollowed ${ign}`);
    } else {
      setFollowedIds(prev => [...prev, bcId]);
      setBroadcasters(prev =>
        prev.map(b => (b.id === bcId ? { ...b, followers: b.followers + 1 } : b))
      );
      awardXp(15);
      if (addCoins) addCoins(10);
      setSystemAlertMessage(`🎉 Subscribed to ${ign}! +15 XP & +10 CV Coins`);
    }
  };

  // Launch stream simulation component
  const launchPlayerSimulation = (bc: Broadcaster) => {
    setSelectedStream(bc);
    setSimViewerCount(bc.avgViewers + Math.floor(Math.random() * 80) - 30);
    setIsMuted(true);
    // Generate initial live chat events
    const initialMsgs = [
      "Let's go Crimson Vipers! 👑",
      `${bc.ign} is on fire! 🔥`,
      "Great rotational control inside Rozhok!",
      "Is that an iPad M4? Smooth frame times",
      "That bullet tracking is top-tier mechanics!",
      "Can we participate in the scrim custom rooms?",
    ];
    setLiveChatMessages(initialMsgs);
    awardXp(10);
    setSystemAlertMessage(`🛰️ Connecting to ${bc.ign}'s active broadcast system...`);
  };

  // Chat simulation running while stream monitor is open
  useEffect(() => {
    if (!selectedStream) return;

    const interval = setInterval(() => {
      const userComments = [
        "Boom! Solid spray control with the red dot!",
        "OMG those reflexes! Clutch squad wipe!",
        "Insane. Headshot headshot headshot!",
        "I just joined, what's current score line?",
        "Subscribed and followed! Keep executing!",
        "CV elite roster on peak form tonight ✨",
        "Next Miramar match looks promising",
        "Is Gyro sensitivity set to 350? Fast rotating",
        "POG CHAMP IN CHAT boys!",
        "Mamba's cover smoke was perfectly timed",
      ];
      setLiveChatMessages(prev => {
        const next = [...prev, userComments[Math.floor(Math.random() * userComments.length)]];
        if (next.length > 25) next.shift();
        return next;
      });
      // randomly spike viewers
      setSimViewerCount(prev => prev + Math.floor(Math.random() * 15) - 7);
    }, 3803);

    return () => clearInterval(interval);
  }, [selectedStream]);

  // Submit streaming credential form handler
  const handleApplyBroadcaster = (e: FormEvent) => {
    e.preventDefault();
    if (!formHandle || !formFollowers) return;

    setFormApplying(true);
    setTimeout(() => {
      setFormApplying(false);
      setFormSuccess(true);
      awardXp(30);

      // Create a speculative temporary pending broadcaster to showcase in registry
      const newBC: Broadcaster = {
        id: `bc-temp-${Date.now()}`,
        ign: formHandle.trim(),
        name: session.ign,
        role: "PENDING VERIFICATION TEAM",
        avatar: "⚡",
        game: "PUBG Mobile Arena",
        status: "OFFLINE",
        platform: formPlatform as any,
        followers: parseInt(formFollowers) || 1200,
        avgViewers: 0,
        schedule: "Pending Audit Evaluation"
      } as any;

      setBroadcasters(prev => [newBC, ...prev]);
      setSystemAlertMessage("🛡️ TELEMETRY SECURED: Stream application loaded with Pending designation!");
    }, 1800);
  };

  // Filter & Search Logic
  const filteredBroadcasters = broadcasters.filter(bc => {
    const matchesSearch =
      bc.ign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bc.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = filterPlatform === "All" || bc.platform.includes(filterPlatform);
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "LIVE" && bc.status === "LIVE") ||
      (filterStatus === "OFFLINE" && bc.status === "OFFLINE");

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Analytics calculators
  const liveCount = broadcasters.filter(b => b.status === "LIVE").length;
  const totalFollowers = broadcasters.reduce((acc, curr) => acc + curr.followers, 0);

  return (
    <div className="space-y-6 text-left">
      {/* 🚀 HUB METRICS REHEAT BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-zinc-950 via-zinc-950 to-red-950/20 p-5 rounded-2xl border border-red-950/40 relative overflow-hidden"
        >
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <Radio size={80} className="text-[#FF001C]" />
          </div>
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-1 text-[10px] text-red-500 font-mono font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-ping" />
              <span>FACILITY REACH MATRIX</span>
            </div>
            <h3 className="text-3xl font-black font-mono text-white tracking-tight">
              {(totalFollowers / 1000000).toFixed(2)}M
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">Over {broadcasters.length} certified broadcasters</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-zinc-950 via-zinc-950 to-purple-950/10 p-5 rounded-2xl border border-zinc-900 relative overflow-hidden"
        >
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <Users size={80} className="text-purple-500" />
          </div>
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-1 text-[10px] text-purple-400 font-mono font-bold uppercase tracking-widest">
              <span>BROADCASTING LIVE</span>
            </div>
            <h3 className="text-3xl font-black font-mono text-purple-400 tracking-tight">
              {liveCount} Active
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">Real-time telemetry indicators engaged</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-zinc-950 via-zinc-950 to-red-950/10 p-5 rounded-2xl border border-zinc-900 relative overflow-hidden"
        >
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <TrendingUp size={80} className="text-red-500" />
          </div>
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-1 text-[10px] text-red-400 font-mono font-bold uppercase tracking-widest">
              <span>COMMUNITY FEEDBACK</span>
            </div>
            <h3 className="text-3xl font-black font-mono text-red-400 tracking-tight">
              {followedIds.length} <span className="text-sm font-bold text-zinc-500">FOLLOWED</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">Supporting active roster streamers</p>
          </div>
        </motion.div>
      </div>

      {/* 🔴 INTERACTIVE TOOLBAR PANEL */}
      <div className="bg-[#111111] p-4 rounded-2xl border border-[#1a1a1a] flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Active Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search by broadcaster IGN, real name or faction role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#050505] border border-zinc-900 rounded-xl py-3 pl-11 pr-4 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-red-650 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Filtering options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status pills */}
            <div className="flex bg-[#050505] p-1 rounded-xl border border-zinc-900">
              <button
                onClick={() => setFilterStatus("All")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all ${
                  filterStatus === "All"
                    ? "bg-[#E10600] text-white font-black"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                All Signs
              </button>
              <button
                onClick={() => setFilterStatus("LIVE")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all flex items-center gap-1 ${
                  filterStatus === "LIVE"
                    ? "bg-[#E10600] text-white font-black"
                    : "text-zinc-500 hover:text-red-400"
                }`}
              >
                <span className="w-1.5 h-1.5 bg-[#E10600] rounded-full animate-ping" />
                Live
              </button>
              <button
                onClick={() => setFilterStatus("OFFLINE")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all ${
                  filterStatus === "OFFLINE"
                    ? "bg-[#E10600] text-white font-black"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Offline
              </button>
            </div>

            {/* Platform pills */}
            <div className="flex bg-[#050505] p-1 rounded-xl border border-zinc-900">
              {["All", "Twitch", "YouTube", "Facebook"].map(p => (
                <button
                  key={p}
                  onClick={() => setFilterPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all ${
                    filterPlatform === p
                      ? "bg-zinc-800 text-white font-bold"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 🔴 GRID OF VERIFIED STREAMERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBroadcasters.map((bc, idx) => {
            const isFollowed = followedIds.includes(bc.id);
            const isLive = bc.status === "LIVE";
            const isPending = bc.role.includes("PENDING");

            // Define platform styling variables
            const platformIcon =
              bc.platform === "Twitch" ? (
                <Twitch size={13} className="text-purple-400" />
              ) : bc.platform === "YouTube Gaming" ? (
                <Youtube size={13} className="text-red-500" />
              ) : (
                <Facebook size={13} className="text-blue-500" />
              );

            const platformBadgeBg =
              bc.platform === "Twitch"
                ? "bg-purple-950/30 border-purple-800/40 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                : bc.platform === "YouTube Gaming"
                ? "bg-red-950/30 border-red-800/40 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                : "bg-blue-950/30 border-blue-800/40 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]";

            return (
              <motion.div
                key={bc.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className={`bg-[#111111] rounded-2xl overflow-hidden border transition-all flex flex-col justify-between text-left relative group ${
                  isLive
                    ? "border-red-900/60 shadow-[0_0_20px_rgba(255,0,28,0.06)] hover:border-red-650"
                    : "border-zinc-900 hover:border-zinc-700"
                }`}
              >
                {/* Immersive cover frame or status image */}
                {isLive ? (
                  <div className="relative h-44 overflow-hidden bg-black">
                    <img
                      src={bc.coverImage}
                      alt={bc.streamTitle}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/50" />
                    
                    {/* Live overlay markers */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#E10600] text-white text-[9px] font-mono px-2.5 py-1 rounded font-black tracking-widest uppercase animate-neon-pulse shadow-[0_0_15px_rgba(225,6,0,0.4)]">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                      <span>LIVE SIGNAL</span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/75 px-2 py-1 rounded border border-zinc-800 text-[9px] font-mono text-zinc-300 font-bold">
                      <Users size={10} className="text-zinc-500" />
                      {bc.avgViewers} VIEWERS
                    </div>

                    {/* Streamer details overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-[10px] text-red-500 font-mono font-bold tracking-wider mb-0.5 uppercase">
                        {bc.game}
                      </p>
                      <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1">
                        {bc.streamTitle}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#111111] to-[#111111] border-b border-zinc-900 flex items-center px-4 overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-zinc-950 rounded-full blur-xl opacity-40 pointer-events-none" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">
                        METRICS SIGNAL STANDBY
                      </span>
                    </div>
                  </div>
                )}

                {/* Sender card core layout content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar container */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] relative">
                          {bc.avatar}
                        </div>
                        {isLive && (
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-650 border-2 border-[#111111] text-[7px] text-white font-bold leading-none animate-bounce">
                            ON
                          </span>
                        )}
                      </div>

                      {/* Main handle designations */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white hover:text-red-500 transition-colors uppercase tracking-tight block truncate">
                            {bc.ign}
                          </span>
                          {isPending ? (
                            <span className="text-[7px] bg-red-950 text-red-500 border border-red-800/30 px-1 py-0.2 rounded font-mono font-black animate-pulse">
                              AUDIT
                            </span>
                          ) : (
                            <CheckCircle2 size={12} className="text-red-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-555 font-mono uppercase tracking-wide truncate">
                          {bc.name} • <span className="text-zinc-500 font-semibold">{bc.role}</span>
                        </p>
                      </div>
                    </div>

                    {/* Platform Badge overlay status */}
                    <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-mono font-bold flex items-center gap-1.5 shrink-0 ${platformBadgeBg}`}>
                      {platformIcon}
                      <span className="uppercase">{bc.platform.replace(" Gaming", "")}</span>
                    </div>
                  </div>

                  {/* Core Statistics row metrics */}
                  <div className="grid grid-cols-3 gap-2.5 bg-black/60 p-2.5 rounded-xl border border-zinc-900/60 text-center font-mono text-[10px]">
                    <div>
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold text-center">FOLLOWER REACH</span>
                      <span className="text-white font-bold text-center">
                        {(bc.followers).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold text-center">TRIAL K/D Ratio</span>
                      <span className="text-red-500 font-bold text-center">
                        {bc.kd}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold text-center">AVG AUDIENCE</span>
                      <span className="text-white font-bold text-center">
                        {bc.avgViewers > 0 ? bc.avgViewers : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 font-medium flex items-center gap-1 font-mono">
                    <span className="text-zinc-650">SCHEDULE:</span>
                    <span>{bc.schedule}</span>
                  </div>

                  {/* Dynamic control and action footer */}
                  <div className="flex gap-2 pt-2 border-t border-zinc-900/80">
                    <button
                      onClick={() => handleFollow(bc.id, bc.ign)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isFollowed
                          ? "bg-zinc-900 text-zinc-400 border-zinc-800 shadow-inner"
                          : "bg-[#090909] text-white border-zinc-800 hover:border-red-600 hover:bg-zinc-950/30"
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <Check size={11} className="text-red-500 stroke-[3px]" />
                          <span>SUBSCRIBED</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={11} className="text-red-500" />
                          <span>FOLLOW ROSTER</span>
                        </>
                      )}
                    </button>

                    {isLive && (
                      <button
                        onClick={() => launchPlayerSimulation(bc)}
                        className="bg-red-650/90 hover:bg-red-650 px-3.5 rounded-lg text-white font-mono text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(225,6,0,0.15)] group-hover:shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:scale-[1.02]"
                      >
                        <Play size={10} className="fill-white" />
                        <span>TUNE IN</span>
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 🔴 INTERACTIVE STREAM MONITOR DOCK MODAL */}
      <AnimatePresence>
        {selectedStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-6 text-left"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="bg-[#0b0b0b] w-full max-w-5xl rounded-2xl border border-red-950 overflow-hidden shadow-[0_0_50px_rgba(255,0,28,0.25)] flex flex-col lg:flex-row relative"
            >
              <button
                onClick={() => setSelectedStream(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 border border-zinc-900 rounded-lg text-zinc-400 hover:text-white cursor-pointer hover:border-zinc-700 transition"
              >
                Close Station ✕
              </button>

              {/* LEFT FRAME: Simulated Gameplay Stream Video Monitor */}
              <div className="flex-1 bg-black flex flex-col justify-between relative overflow-hidden group min-h-[360px] lg:min-h-[480px]">
                {/* Decorative retro scanning grid line overlay */}
                <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
                
                {/* Simulated gameplay backdrop */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={selectedStream.coverImage}
                    alt={selectedStream.streamTitle}
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>

                {/* Telemetry metadata overlay header */}
                <div className="relative z-10 p-4 flex justify-between items-start font-mono text-[9px] text-[#ff2240] tracking-widest bg-gradient-to-b from-black to-transparent">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 font-bold uppercase">
                      <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-ping" />
                      SECURE TRANS: CLAN NET ENCRYPTION v6.4
                    </p>
                    <p className="text-zinc-400">CASTER: {selectedStream.ign}</p>
                  </div>
                  <div className="text-right space-y-1 text-zinc-400">
                    <p className="text-[#ff2240] font-bold uppercase">
                      {selectedStream.activeMetrics?.resolution} @ {selectedStream.activeMetrics?.fps}
                    </p>
                    <p>BITRATE: {selectedStream.activeMetrics?.bitrate}</p>
                  </div>
                </div>

                {/* Central playback overlay banner */}
                <div className="relative z-10 m-auto flex flex-col items-center gap-3 scale-95 md:scale-100 select-none">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-full bg-red-650/20 border border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(255,0,28,0.4)] cursor-pointer hover:bg-red-650/40"
                  >
                    <Monitor size={32} />
                  </motion.div>
                  <p className="text-[10px] tracking-widest font-mono text-zinc-300 font-bold bg-[#0a0a0a]/80 py-1.5 px-4 rounded-full border border-zinc-800">
                    LOCKED TUNNEL: ACTIVE DECODING
                  </p>
                </div>

                {/* Control bar bottom console */}
                <div className="relative z-10 p-4 flex flex-wrap justify-between items-center gap-3 bg-gradient-to-t from-black to-transparent font-mono text-[10px] text-zinc-300">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-[#111111] p-2 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-300"
                    >
                      {isMuted ? <VolumeX size={13} className="text-red-500" /> : <Volume2 size={13} />}
                    </button>
                    <span className="text-zinc-500 font-bold">
                      {isMuted ? "MONITOR MUTED SPECIAL PREVIEW" : "MONITOR SPEAKERS ENGAGED"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-red-550" />
                      <span className="font-bold text-white">{simViewerCount}</span> spectating
                    </span>
                    <span className="bg-red-950/50 border border-red-800/20 text-[#ff2240] px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[8px]">
                      {selectedStream.platform}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT FRAME: Dynamic Simulated Stream Chat and Feedback Console */}
              <div className="w-full lg:w-80 bg-[#0f0f0f] border-t lg:border-t-0 lg:border-l border-zinc-900 p-4 flex flex-col justify-between h-[360px] lg:h-auto font-mono text-xs">
                <div className="space-y-4 flex flex-col h-full justify-between">
                  <div>
                    <div className="pb-3 border-b border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-bold tracking-wider">
                      <span>LIVE BROADCAST FEEDS CHAT</span>
                      <span className="text-[#ff2240] animate-pulse">● FEED ONLINE</span>
                    </div>

                    {/* Chat Logs Area scrolling */}
                    <div className="space-y-2 max-h-[220px] lg:max-h-[320px] overflow-y-auto pt-3 pr-1">
                      {liveChatMessages.map((msg, idx) => (
                        <div key={idx} className="text-[11px] leading-relaxed text-zinc-300 break-words">
                          <span className="text-zinc-500 font-bold">Anonymous_Rider: </span>
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Send interactable comment input inside modal */}
                  <div className="space-y-2 pt-3 border-t border-zinc-900">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (!chatInputValue.trim()) return;
                        setLiveChatMessages(prev => [...prev, `${chatInputValue.trim()} (YOUR TRANSMISSION)`]);
                        setChatInputValue("");
                        awardXp(5);
                        setSystemAlertMessage("💬 Message patched into simulated stream database! +5 XP");
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Intercept chat..."
                        value={chatInputValue}
                        onChange={e => setChatInputValue(e.target.value)}
                        className="flex-1 bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-650"
                      />
                      <button
                        type="submit"
                        className="bg-red-650 text-white px-3.5 rounded-lg border border-red-500 font-bold text-xs uppercase"
                      >
                        Send
                      </button>
                    </form>
                    <p className="text-[8px] text-zinc-500 font-mono leading-normal">
                      Patching message transmits telemetry feedback directly to target broadcaster metrics.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛡️ APPLY / ENLIST STREAM CREDENTIALS REGISTRY FORM */}
      <div className="bg-[#090909] p-6 rounded-2xl border border-red-950/40 relative overflow-hidden">
        {/* Glowing visual backdrop */}
        <div className="absolute right-0 top-0 w-44 h-44 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-sm lg:text-base font-black tracking-widest font-mono text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-3 bg-red-600 inline-block" />
              SOLICIT VERIFIED BROADCASTER BADGE
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              Apply to integrate your Twitch, YouTube, or Facebook broadcast streams into our official Crimson Vipers portal telemetry!
            </p>
          </div>

          <form onSubmit={handleApplyBroadcaster} className="space-y-4 text-xs font-mono text-zinc-300">
            {formSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#150204]/90 border border-red-950 p-4 rounded-xl space-y-2 animate-pulse"
              >
                <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px]">
                  <CheckCircle2 size={14} className="text-red-500 shrink-0" />
                  <span>TRANSMISSION SECURED FOR AUDIT</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Your broadcaster credentials have been captured and queued into our database telemetry under standard enlisting safeguards! Roster admins evaluate submissions in upcoming score cycles. Maintain regular live schedules to secure approval rating.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSuccess(false);
                    setFormHandle("");
                    setFormFollowers("");
                    setFormBio("");
                  }}
                  className="bg-black border border-red-500/20 text-red-500 px-3 py-1.5 rounded text-[9px] font-bold hover:bg-red-955/30 hover:border-red-500/40 transition mt-1 cursor-pointer font-mono"
                >
                  SOLICIT NEW LINK
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Caster Handle field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase block">STREAMER IG HANDLEX</label>
                    <input
                      type="text"
                      placeholder="e.g. CV_AimbotKing"
                      value={formHandle}
                      onChange={e => setFormHandle(e.target.value)}
                      required
                      className="w-full bg-black border border-zinc-900 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-red-650"
                    />
                  </div>

                  {/* Platform Selection field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase block">PRIMARY STATION PLATFORM</label>
                    <select
                      value={formPlatform}
                      onChange={e => setFormPlatform(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-red-650"
                    >
                      <option value="Twitch">Twitch</option>
                      <option value="YouTube Gaming">YouTube Gaming</option>
                      <option value="Facebook Gaming">Facebook Gaming</option>
                    </select>
                  </div>

                  {/* Followers reach count field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase block">FOLLOWER COUNT METRIC</label>
                    <input
                      type="number"
                      placeholder="e.g. 12500"
                      value={formFollowers}
                      onChange={e => setFormFollowers(e.target.value)}
                      required
                      className="w-full bg-black border border-zinc-900 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-red-650"
                    />
                  </div>

                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase block">GAMEPLAY SYNERGY & INTENTIONAL BIO</label>
                  <textarea
                    rows={2}
                    placeholder="Provide details of your competitive gaming coverage, typical active times, current matches, teams setup, and devices..."
                    value={formBio}
                    onChange={e => setFormBio(e.target.value)}
                    className="w-full bg-black border border-zinc-900 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-red-650"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formApplying}
                  className="bg-[#E10600] text-white py-3 px-5 rounded-xl border border-red-500 font-bold text-[10px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(225,6,0,0.15)] hover:shadow-[0_0_20px_rgba(225,6,0,0.3)] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                >
                  {formApplying ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <span>INJECTING STREAM SIGNALS DATA TELEMETRY...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={10} />
                      <span>TRANSMIT BADGE APPLICATIONS REGULATION</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

    </div>
  );
}
