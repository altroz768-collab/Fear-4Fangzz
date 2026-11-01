import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Tv,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Send,
  MessageSquare,
  Clock,
  Radio,
  Trophy,
  Zap,
  Sliders,
  Share2,
  Sparkles,
  Flame,
  Award,
  ChevronRight
} from "lucide-react";
import { UserSession } from "../types";
import { PLAYERS_LIST, CREATORS_LIST } from "../data";

// Type definitions for our simulated streams
interface LiveStreamer {
  ign: string;
  name: string;
  role: string;
  avatar: string;
  game: string;
  kd: string;
  status: "LIVE" | "OFFLINE";
  platform: "Twitch" | "YouTube Gaming" | "Facebook Gaming";
  viewers: number;
  title: string;
  bgImage: string;
  socials: {
    twitch: string;
    youtube: string;
    twitter: string;
  };
}

interface ChatMessage {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  badgeColor: string;
}

interface LiveChannelsProps {
  session: UserSession;
  awardXp: (amount: number) => void;
  setSystemAlertMessage: (msg: string) => void;
  addCoins?: (amount: number) => void;
}

// Pool of contextual chat messages depending on the active game
const CHAT_POOLS: Record<string, string[]> = {
  "PUBG Mobile": [
    "Slayer's spray control with the M4 is literally hacking-level! 🔥",
    "Did anyone see that bridge block rotate? 300 IQ playbook",
    "CO-ORDINATION IS SECURED, incredible roster synergy here",
    "Which device is this? iPad Pro at 120fps looks liquid smooth",
    "AWM single shot. Clean headshot! OMG",
    "Droppochinok lobby was crazy, Slayer wiped Apex Team solo",
    "Is CV entering the regional qualifiers next week?",
    "That vehicle shield deploy split second timing was unreal",
    "Absolute lasers today 👑",
    "Let's go CV roster!! Championship bound!",
    "Buff the smoke grenade duration! Ahaha Mamba got saved by it",
    "Drop some coins in the chat guys!"
  ],
  "Just Chatting": [
    "Valkyrie's setup is looking sleek as always with the neon red glows!",
    "Can't wait for the grand finales on Saturday. Who's in the starting roster?",
    "Will there be merch drops on the shop? Jersey v2 looks stunning",
    "Owner command center is showing real-time enlisting reviews! Epic",
    "Chatting with the team is always a vibe before the sweat matches",
    "Who is the MVP of 2025? Slayer or Shadow?",
    "CV family on top! Best hub to play mobile competitive",
    "Are we getting a strategy discussion next? Peak or Erangel map?",
    "Drop details about the scrim room custom keys!",
    "Valk is hosting a +1000 Coins giveaway later, stay active chat!"
  ]
};

// Simulated stream rosters based on PLAYERS_LIST and CREATORS_LIST
const SIMULATED_STREAMS: LiveStreamer[] = [
  {
    ign: "CV_Slayer_IGL",
    name: "Alex Thorne",
    role: "IGL / Mid-Ranger",
    avatar: "🎯",
    game: "PUBG Mobile",
    kd: "4.82",
    status: "LIVE",
    platform: "Twitch",
    viewers: 1450,
    title: "🏆 PRO LEAGUE ROAD MAPS ─ SCRIM ROTATIONS & HEAVY PRESSURE TESTS",
    bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" }
  },
  {
    ign: "CV_Shadow_Duo",
    name: "Lia Ramirez",
    role: "Assaulter / Roamer",
    avatar: "⚡",
    game: "PUBG Mobile",
    kd: "5.10",
    status: "LIVE",
    platform: "YouTube Gaming",
    viewers: 980,
    title: "⚡ SOLO QUEUE DOMINANCE & FAST ROTATE DRILLS ON MIRAMAR",
    bgImage: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=800",
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" }
  },
  {
    ign: "CV_Alpha_Spectre",
    name: "Hiroshi Sato",
    role: "Anchor / Support",
    avatar: "🛡️",
    game: "PUBG Mobile",
    kd: "3.95",
    status: "LIVE",
    platform: "Twitch",
    viewers: 675,
    title: "🎖️ SECURING THE SPOTS ─ 120 FPS ERANGEL BRACKETS WORKOUT",
    bgImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" }
  },
  {
    ign: "CV_Mamba_Flick",
    name: "Marcus Sterling",
    role: "Sniper / Entry",
    avatar: "🐍",
    game: "PUBG Mobile",
    kd: "4.15",
    status: "LIVE",
    platform: "Facebook Gaming",
    viewers: 520,
    title: "🗼 SNIPING CRITICAL ROTATIONS ── HIGHLIGHT SECURING LOBBIES",
    bgImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800",
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" }
  },
  {
    ign: "CV_Valkyrie",
    name: "Elena Ross",
    role: "Roster Streamer",
    avatar: "🎙️",
    game: "Just Chatting",
    kd: "N/A",
    status: "LIVE",
    platform: "YouTube Gaming",
    viewers: 2150,
    title: "🎙️ INTERVIEWING THE COACHES & ANALYST GUESTS ON ROSTER SHIFTS",
    bgImage: "https://images.unsplash.com/photo-1548685913-fe6574abf1a5?auto=format&fit=crop&q=80&w=800",
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" }
  }
];

const CHATTER_NAMES = [
  "RosterFan_99", "AlphaSlayer", "PingGod_0", "FreeFireWarlord", "ApexTactics",
  "SmokeDodge_4", "Recruit_Delta", "CoD_Scythe", "Championship_Tracker", "Zenith_Force",
  "MambaApprentice", "ViperStrike", "ValkyrieShield", "GlitchKing", "PixelPhantom"
];

const BADGE_COLORS = [
  "text-[#E10600] font-sans",
  "text-white font-mono font-bold",
  "text-red-500 font-sans font-bold",
  "text-[#FF3030] font-mono",
  "text-zinc-300 font-sans",
  "text-red-400 font-mono"
];

const EMBED_PRESETS: Record<string, string> = {
  "CV_Slayer_IGL": "https://www.youtube.com/embed/n_C8T68O09k?autoplay=1&mute=1&playlist=n_C8T68O09k&loop=1",
  "CV_Shadow_Duo": "https://www.youtube.com/embed/lKovX59MbyI?autoplay=1&mute=1&playlist=lKovX59MbyI&loop=1",
  "CV_Alpha_Spectre": "https://www.youtube.com/embed/uD9oZ68L8fI?autoplay=1&mute=1&playlist=uD9oZ68L8fI&loop=1",
  "CV_Mamba_Flick": "https://www.youtube.com/embed/4yCOE9mOQWw?autoplay=1&mute=1&playlist=4yCOE9mOQWw&loop=1",
  "CV_Valkyrie": "https://www.youtube.com/embed/l59b9g_C0F8?autoplay=1&mute=1&playlist=l59b9g_C0F8&loop=1"
};

export default function LiveChannels({ session, awardXp, setSystemAlertMessage, addCoins }: LiveChannelsProps) {
  const getRoleColorClasses = (role: string) => {
    switch (role) {
      case "Owner":
        return {
          badge: "bg-[#FF001C]/15 text-[#FF001C] border border-[#FF001C]/30",
          text: "text-[#FF001C]"
        };
      case "Head Admin":
      case "Admin":
      case "Team Captain":
      case "Moderator":
        return {
          badge: "bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30",
          text: "text-[#FFD700]"
        };
      case "Member":
      case "Recruit":
      default:
        return {
          badge: "bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30",
          text: "text-[#00FF9D]"
        };
    }
  };

  // State variables
  const [selectedStreamer, setSelectedStreamer] = useState<LiveStreamer>(SIMULATED_STREAMS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [streamQuality, setStreamQuality] = useState("1080p60 Source");
  const [isSyncing, setIsSyncing] = useState(false);
  const [dynamicViewers, setDynamicViewers] = useState(selectedStreamer.viewers);
  const [streamMode, setStreamMode] = useState<"simulator" | "actual">("simulator");
  const [customEmbedUrl, setCustomEmbedUrl] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Audio state (procedural audio context)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Chat Log states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userComment, setUserComment] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Killfeed state for game overlays
  const [killFeed, setKillFeed] = useState<string[]>([]);

    // Setup initial chat list and dynamic chat additions
    useEffect(() => {
      // Generate initial messages
      const initialTextPool = CHAT_POOLS[selectedStreamer.game] || CHAT_POOLS["Just Chatting"];
      const initialMessages: ChatMessage[] = Array.from({ length: 6 }).map((_, i) => {
        const chatter = CHATTER_NAMES[Math.floor(Math.random() * CHATTER_NAMES.length)];
        const text = initialTextPool[Math.floor(Math.random() * initialTextPool.length)];
        const randomVal = Math.random();
        const role = randomVal > 0.95 ? "Owner" : randomVal > 0.85 ? "Admin" : randomVal > 0.70 ? "Moderator" : "Member";
        const color = BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)];
        return {
          id: `chat_${Date.now()}_${i}`,
          author: chatter,
          role,
          text,
          timestamp: new Date(Date.now() - (6 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          badgeColor: color
        };
      });
      setChatMessages(initialMessages);
      setDynamicViewers(selectedStreamer.viewers);
  
      // Initial killfeed mock
      triggerNewKillfeed();
    }, [selectedStreamer]);
  
    // Periodic automatic chat messages (simulating live active streaming)
    useEffect(() => {
      const chatInterval = setInterval(() => {
        if (!isPlaying) return;
  
        const textPool = CHAT_POOLS[selectedStreamer.game] || CHAT_POOLS["Just Chatting"];
        const chatter = CHATTER_NAMES[Math.floor(Math.random() * CHATTER_NAMES.length)];
        const text = textPool[Math.floor(Math.random() * textPool.length)];
        const randomVal = Math.random();
        const role = randomVal > 0.95 ? "Owner" : randomVal > 0.85 ? "Admin" : randomVal > 0.70 ? "Moderator" : "Member";
        const color = BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)];

      const newMessage: ChatMessage = {
        id: `chat_${Date.now()}`,
        author: chatter,
        role,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        badgeColor: color
      };

      setChatMessages(prev => [...prev.slice(-25), newMessage]); // Keep last 25 messages only
      
      // Slightly fluctuate viewers for live effect
      setDynamicViewers(prev => prev + Math.floor(Math.random() * 9) - 4);
    }, 4500);

    const killInterval = setInterval(() => {
      if (isPlaying && selectedStreamer.game !== "Just Chatting") {
        triggerNewKillfeed();
      }
    }, 6000);

    return () => {
      clearInterval(chatInterval);
      clearInterval(killInterval);
    };
  }, [selectedStreamer, isPlaying]);

  // Auto scroll chat to the bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Simulated killfeed generation depending on the active game
  const triggerNewKillfeed = () => {
    const victims = ["TotalChaos_99", "SniperGf", "ViperShoot_Leader", "HydressGamer", "Apex_Demon_PvP", "SoloSlayer_99"];
    const weapons = ["M416", "AWM", "M249", "Grenade", "AKM", "UMP45", "Groza"];
    const victim = victims[Math.floor(Math.random() * victims.length)];
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];
    
    // 35% chance that the selected streamer is the killer!
    const isStreamerKiller = Math.random() > 0.65;
    const killer = isStreamerKiller ? selectedStreamer.ign : CHATTER_NAMES[Math.floor(Math.random() * CHATTER_NAMES.length)];
    
    const statusText = "knocked out";

    const killMsg = `${killer} [${weapon}] ${victim} (${isStreamerKiller ? "HEADSHOT!" : "TACTICAL"})`;
    setKillFeed(prev => [killMsg, ...prev.slice(0, 2)]);
  };

  // Change selected stream with sleek transition state
  const handleStreamSelect = (streamer: LiveStreamer) => {
    setIsSyncing(true);
    setSelectedStreamer(streamer);
    triggerBeep(320, 0.08); // Strategic UI click sound context
    
    setTimeout(() => {
      setIsSyncing(false);
      awardXp(5); // Small reward for supporting the faction broadcasters
    }, 1200);
  };

  // Procedural UI sound generation (Beep synthesizer)
  const triggerBeep = (freq = 440, duration = 0.1) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked by sandbox permissions
    }
  };

  // User chat submission
  const handleUserMessageSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    triggerBeep(520, 0.05);

    const userMessage: ChatMessage = {
      id: `chat_user_${Date.now()}`,
      author: session.ign,
      role: session.role || "Member",
      text: userComment,
      badgeColor: "text-[#E10600] font-sans font-black",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserComment("");

    // Award chat interaction xp
    awardXp(8);

    // 25% chance of picking up +5 CV Coins as a streamer chat bounty!
    if (Math.random() > 0.75 && addCoins) {
      setTimeout(() => {
        addCoins(5);
        const bountyMsg: ChatMessage = {
          id: `bounty_${Date.now()}`,
          author: "CV_TRANS_BOT",
          role: "System",
          text: `🎉 CONGRATS ${session.ign}! Checked & verified chat engagement: +5 CV Coins starter active bounty credited!`,
          badgeColor: "text-red-500 font-mono tracking-widest block font-black",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setChatMessages(prev => [...prev, bountyMsg]);
        triggerBeep(880, 0.2);
        setSystemAlertMessage("📬 Chat Engagement Reward: Earned +5 CV Coins live stream chatter bounty!");
      }, 1000);
    } else {
      // Simulate typical quick replies in twitch chat under 1.5 seconds!
      setTimeout(() => {
        const standardReplies = [
          `@${session.ign} absolutely correct!`,
          `Welcome to the stream @${session.ign}! CV ON TOP!`,
          `Lmaooo true @${session.ign}!`,
          `Huge target locking right there`,
          "Wait, are you enlisting soon?",
          "Can we join squad scrimmage room next?"
        ];
        const randomReply = standardReplies[Math.floor(Math.random() * standardReplies.length)];
        const replier = CHATTER_NAMES[Math.floor(Math.random() * CHATTER_NAMES.length)];
        const color = BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)];
        
        const botReply: ChatMessage = {
          id: `reply_${Date.now()}`,
          author: replier,
          role: "Player",
          text: randomReply,
          badgeColor: color,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setChatMessages(prev => [...prev, botReply]);
      }, 1500);
    }
  };

  // Secure Live Stream Moment CLIP button
  const handleClipStream = () => {
    triggerBeep(750, 0.25);
    awardXp(15);
    
    const notificationText = `🎬 SECURED HIGH-DEFINITION STREAM CLIP: Saved "${selectedStreamer.ign}: ${selectedStreamer.title.slice(0, 30)}..." to Faction Cloud database! Securing +15 Battle Pass XP.`;
    setSystemAlertMessage(notificationText);

    // Append beautiful clip system notification directly to active stream chat
    const clipMessage: ChatMessage = {
      id: `clip_${Date.now()}`,
      author: "CV_LOGGER_REC",
      role: "System",
      text: `🎬 CLIP LOGGED! ${session.ign} recorded a dynamic 30-second live highlights segment check.`,
      badgeColor: "text-red-500 font-sans tracking-wide font-black",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setChatMessages(prev => [...prev, clipMessage]);
  };

  return (
    <div id="live-channels-container" className="space-y-6 animate-fade-in text-left">
      
      {/* Dynamic transmitting header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#090909] p-5 rounded-2xl border border-[#141414]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E10600]/10 border border-[#E10600]/30 rounded-xl flex items-center justify-center text-[#E10600] animate-pulse">
            <Radio size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white uppercase tracking-tight flex items-center gap-1.5 leading-none">
              LIVE BROADCASTS CENTER
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#E1061C] animate-ping" />
            </h2>
            <p className="text-[10px] text-gray-550 font-mono uppercase tracking-widest mt-1">
              Active faction transmissions, tactical logs, and streaming overlays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#040404] px-4 py-2 rounded-lg border border-[#181818] text-xs font-mono">
          <span className="text-[#E10600] font-black uppercase">STATUS:</span>
          <span className="text-gray-300 font-bold">{SIMULATED_STREAMS.length} TRANSMITTING LIVE</span>
        </div>
      </div>

      {/* Main Streaming Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left COLUMN: Active broadcasters selection panel */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-xs font-black tracking-wider text-gray-400 uppercase font-mono pl-1">
            BROADCAST DIRECTORY
          </h3>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {SIMULATED_STREAMS.map((streamer) => {
              const isSelected = selectedStreamer.ign === streamer.ign;
              return (
                <button
                  key={streamer.ign}
                  onClick={() => handleStreamSelect(streamer)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex items-center gap-3.5 group cursor-pointer ${
                    isSelected
                      ? "bg-[#101010] border-[#E10600]/80 shadow-[0_0_15px_rgba(225,6,0,0.15)]"
                      : "bg-[#090909] border-[#141414] hover:border-gray-800 hover:bg-[#0b0b0b]"
                  }`}
                >
                  {/* Avatar Badge */}
                  <div className="w-10 h-10 bg-[#040404] rounded-lg border border-[#181818] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    {streamer.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white uppercase tracking-tight block truncate">
                        {streamer.ign}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[9px] text-[#E10600] font-mono font-bold uppercase animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E1061C]" />
                        LIVE
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono block uppercase mt-0.5 truncate">
                      {streamer.game}
                    </span>
                    <span className="text-[9px] text-gray-550 font-sans block mt-1 truncate font-medium">
                      {streamer.platform} • {streamer.ign === selectedStreamer.ign ? dynamicViewers : streamer.viewers} spectating
                    </span>
                  </div>

                  {/* Indicator slice */}
                  {isSelected && (
                    <div className="absolute right-0 top-1/4 bottom-1/4 w-0.5 bg-[#E10600] rounded-l" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-[#090909] p-4 rounded-xl border border-[#121212] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase">
              <Sparkles size={14} className="text-[#E10600]" />
              <span>TRANSMISSION BOUNTIES</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
              Engage with active streams! Secure epic highlight **clips (+15 XP)** or interact in stream chats for randomly triggered active chest bounties credited instantly.
            </p>
          </div>
        </div>

        {/* MIDDLE COLUMN: Video screen representation (Simulated player overlay) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div className="bg-[#090909] border border-[#141414] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between">
            
            {/* Embedded Header HUD */}
            <div className="bg-[#040404] px-4 py-2 border-b border-[#141414] flex flex-wrap justify-between items-center text-xs font-mono gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E10600] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E10600]" />
                </span>
                <span className="font-extrabold text-white text-[10px] uppercase tracking-wider">
                  {selectedStreamer.platform.toUpperCase()} BROADCAST FEED
                </span>
              </div>

              {/* Tactical Mode Selector (Simulated vs Actual Video Embed) */}
              <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-gray-850">
                <button
                  type="button"
                  onClick={() => {
                    setStreamMode("simulator");
                    triggerBeep(380, 0.08);
                    setSystemAlertMessage("📡 Subscribed to simulated HUD scan telemetry overlay.");
                  }}
                  className={`px-2 py-1 text-[9px] font-mono rounded font-black transition-all cursor-pointer ${
                    streamMode === "simulator"
                      ? "bg-[#E10600] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Toggle Simulated Gameplay Overlay"
                >
                  TAC-SIM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStreamMode("actual");
                    triggerBeep(450, 0.08);
                    setSystemAlertMessage(`📺 Switched to actual live-streaming broadcast loop!`);
                  }}
                  className={`px-2 py-1 text-[9px] font-mono rounded font-black transition-all cursor-pointer ${
                    streamMode === "actual"
                      ? "bg-red-650 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Watch Real Live Stream Playback Embed"
                >
                  LIVE BROADCAST
                </button>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold ml-auto sm:ml-0">
                <span>VIEWERS: <span className="text-white">{dynamicViewers}</span></span>
                <span className="hidden sm:inline">RESOLUTION: <span className="text-red-400">{streamQuality}</span></span>
              </div>
            </div>

            {/* Video Canvas screen viewport */}
            <div className="relative aspect-video bg-[#040404] overflow-hidden group">
              
              {/* Actual Video Iframe Embed Mode */}
              {streamMode === "actual" && isPlaying && !isSyncing ? (
                <iframe
                  src={EMBED_PRESETS[selectedStreamer.ign]}
                  title={selectedStreamer.title}
                  className="w-full h-full border-0 absolute inset-0 z-10 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : null}

              {/* Synchronizing feed overlay loading */}
              {isSyncing ? (
                <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 border-2 border-[#E10600] border-t-transparent rounded-full animate-spin" />
                  <div className="text-center font-mono space-y-1">
                    <p className="text-xs text-white uppercase font-black tracking-widest animate-pulse">
                      SYNCHRONIZING EMULATOR STREAM FEED...
                    </p>
                    <p className="text-[9px] text-gray-550 uppercase">
                      PULLING RAW SPECTATOR CHANNELS AT 8.2mbps • LATENCY 14ms
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Offline screen / Pause overlay */}
              {!isPlaying && !isSyncing ? (
                <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center space-y-2">
                  <button
                    onClick={() => { setIsPlaying(true); triggerBeep(480, 0.1); }}
                    className="w-14 h-14 bg-[#E10600] text-white rounded-full flex items-center justify-center pl-1.5 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(225,6,0,0.5)] cursor-pointer"
                  >
                    <Play size={24} fill="currentColor" />
                  </button>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    STREAM FEED STANDBY
                  </span>
                </div>
              ) : null}

              {/* Actual Background simulation (Unsplash Gaming graphics context) */}
              <img
                src={selectedStreamer.bgImage}
                alt="Gameplay"
                className="w-full h-full object-cover select-none brightness-[0.75]"
              />

              {/* Modern Cinema Vignette and Subtle Ambient Shadow Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Watermark Logo */}
              <div className="absolute top-4 left-4 bg-black/75 px-2.5 py-1.5 rounded border border-gray-850 text-[10px] font-black text-white uppercase tracking-widest select-none flex items-center gap-1.5 font-mono shadow-md">
                <span className="w-1.5 h-1.5 bg-[#E10600] rounded-sm" />
                CV CLAN REC • {selectedStreamer.ign}
              </div>

              {/* Dynamic Game overlay HUD - Only if not Just Chatting */}
              {selectedStreamer.game !== "Just Chatting" && isPlaying && !isSyncing && (
                <>
                  {/* Left Bottom Match overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/70 p-3 rounded-lg border border-gray-850/80 font-mono text-[9px] text-gray-300 space-y-1 block max-w-xs shadow-lg">
                    <p className="text-[10px] font-bold text-[#E10600] uppercase tracking-wider">
                      TACTICAL MATCH FEED
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>FPS RATE:</span>
                      <span className="text-white font-extrabold">120 FPS</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>BITRATE:</span>
                      <span className="text-white font-extrabold">6500 KBPS</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>NETWORK:</span>
                      <span className="text-white font-extrabold">14ms LOSS 0%</span>
                    </p>
                  </div>

                  {/* Right Top Live Kill Ticker */}
                  <div className="absolute top-4 right-4 space-y-1 text-right pointer-events-none max-w-sm">
                    {killFeed.map((msg, index) => (
                      <div
                        key={index}
                        className={`px-2.5 py-1 border rounded text-[9px] font-mono tracking-tight shadow-md transition-all ${
                          msg.includes(selectedStreamer.ign)
                            ? "bg-red-950/75 border-[#E10600] text-white animate-pulse"
                            : "bg-black/75 border-gray-850 text-gray-200"
                        }`}
                      >
                        {msg}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Audio visual wave indicator - only displays when playing and audio is open */}
              {isPlaying && !isMuted && !isSyncing && (
                <div className="absolute right-4 bottom-4 flex items-end gap-0.5 h-6 opacity-80 pointer-events-none">
                  <div className="w-0.5 bg-red-500 animate-[bounce_0.8s_infinite] h-2 delay-100" />
                  <div className="w-0.5 bg-red-500 animate-[bounce_1s_infinite] h-4 delay-300" />
                  <div className="w-0.5 bg-red-500 animate-[bounce_0.7s_infinite] h-5 delay-200" />
                  <div className="w-0.5 bg-red-500 animate-[bounce_1.1s_infinite] h-3 delay-500" />
                  <div className="w-0.5 bg-red-500 animate-[bounce_0.9s_infinite] h-1" />
                </div>
              )}
            </div>

            {/* Custom Control panel bar */}
            <div className="bg-[#040404] p-3 sm:px-4 border-t border-[#141414] flex justify-between items-center text-gray-400 font-mono text-[10px]">
              
              {/* Play Pause and Audio controls */}
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors cursor-pointer"
                  title={isPlaying ? "Pause Broadcast" : "Play Broadcast"}
                >
                  {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current animate-pulse" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  title={isMuted ? "Unmute Broadcast Audio" : "Mute Broadcast Audio"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>

              {/* Quality & Action Buttons centered */}
              <div className="flex items-center gap-3">
                
                {/* HD Selector button */}
                <select
                  value={streamQuality}
                  onChange={(e) => {
                    setStreamQuality(e.target.value);
                    triggerBeep(400, 0.05);
                    setSystemAlertMessage(`🎥 Streaming output quality scaled to ${e.target.value}`);
                  }}
                  className="bg-black border border-gray-850 rounded px-2 py-0.5 text-xs text-white focus:outline-none cursor-pointer max-w-[120px]"
                >
                  <option value="1080p60 Source">1080p60</option>
                  <option value="720p60">720p60</option>
                  <option value="480p">480p</option>
                  <option value="Auto">Auto Match</option>
                </select>

                {/* Securing moment clip button */}
                <button
                  onClick={handleClipStream}
                  className="bg-red-950/40 border border-red-800 hover:border-[#E10600] text-white hover:bg-[#E10600] transition-all px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer font-black font-sans leading-none uppercase text-[9px] tracking-widest"
                >
                  <Award size={11} className="shrink-0" />
                  <span>CLIP LIVE MOMENT</span>
                </button>
              </div>

              {/* Bitrate analytics indicator */}
              <div className="hidden sm:flex items-center gap-1 bg-[#101010] border border-[#181818] px-2 py-1 rounded text-[9px] text-gray-500 font-bold">
                <Sliders size={10} className="text-[#E10600]" />
                <span className="text-white">6.5 MBPS</span>
              </div>
            </div>

          </div>

          {/* Broadcaster Profile snapshot card */}
          <div className="bg-[#090909] border border-[#141414] p-5 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-[#101010] p-1 rounded-md border border-[#181818]">
                  {selectedStreamer.avatar}
                </span>
                <div>
                  <h4 className="text-base font-black text-white leading-none">
                    {selectedStreamer.ign}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-0.5">
                    Broadcaster: {selectedStreamer.name} • {selectedStreamer.role}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white leading-relaxed font-semibold pr-2 select-text font-sans">
                {selectedStreamer.title}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5 font-mono text-[10px] shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
              <div className="flex items-center gap-2 sm:w-full sm:justify-end">
                <span className="text-gray-500">KD LIMIT:</span>
                <span className="text-white font-extrabold">{selectedStreamer.kd}</span>
              </div>
              <div className="flex items-center gap-2 sm:w-full sm:justify-end">
                <span className="text-gray-500">BROADCAST GAME:</span>
                <span className="text-[#E10600] font-black uppercase">{selectedStreamer.game}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <a href={selectedStreamer.socials.twitch} target="_blank" rel="noopener noreferrer" className="p-1 px-2 border border-gray-850 rounded hover:border-[#E10600] transition-colors hover:text-white cursor-pointer select-none text-[9px]">
                  TWITCH
                </a>
                <a href={selectedStreamer.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-1 px-2 border border-gray-850 rounded hover:border-[#E10600] transition-colors hover:text-white cursor-pointer select-none text-[9px]">
                  YOUTUBE
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Stream Chat log module (Simulated chat overlay) */}
        <div className="lg:col-span-3 bg-[#090909] border border-[#141414] p-4 rounded-2xl flex flex-col justify-between max-h-[640px] items-stretch">
          
          <div className="flex justify-between items-center pb-3 border-b border-[#141414] text-xs font-mono select-none">
            <span className="font-extrabold text-[#E1061C] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} className="stroke-[2.5]" />
              BROADCAST CHAT
            </span>
            <span className="text-[10px] text-gray-500 font-bold">
              VERIFIED CHATROOM
            </span>
          </div>

          {/* Messages layout */}
          <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 max-h-[440px] text-left select-text">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-650 font-mono text-xs">
                No active chat logs synchronised...
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isUserRef = msg.author === session.ign;
                const isSystemLog = msg.author === "CV_TRANS_BOT" || msg.author === "CV_LOGGER_REC";
                
                return (
                  <div key={msg.id} className={`text-xs space-y-1 leading-snug break-words ${isSystemLog ? "bg-red-950/20 p-2.5 rounded-lg border border-red-900/30 text-xs" : ""}`}>
                    
                    {!isSystemLog && (
                      <div className="flex items-center justify-between pointer-events-none select-none text-[10px]">
                        <span className={`font-mono text-[9px] tracking-widest uppercase font-black px-1.5 py-0.5 rounded mr-1.5 ${getRoleColorClasses(msg.role).badge}`}>
                          {msg.role}
                        </span>
                        <span className="text-gray-600 font-mono text-[9px]">{msg.timestamp}</span>
                      </div>
                    )}
                    
                    <div>
                      {!isSystemLog ? (
                        <>
                          <span className={`${getRoleColorClasses(msg.role).text} font-black hover:underline cursor-pointer mr-1.5`}>
                            {msg.author}
                          </span>
                          <span className="text-gray-200 select-text font-medium leading-relaxed font-sans block mt-0.5">
                            {msg.text}
                          </span>
                        </>
                      ) : (
                        <div className="font-mono text-gray-300">
                          <p className="font-black text-[#E10600] text-[9px] uppercase tracking-wide block mb-1">
                            {msg.author} • SYSTEM LOG ({msg.timestamp})
                          </p>
                          <p className="text-[11px] leading-relaxed select-text font-medium">{msg.text}</p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Send interactive message form */}
          <form onSubmit={handleUserMessageSubmit} className="pt-3 border-t border-[#141414]">
            <div className="relative">
              <input
                type="text"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Interact in chat..."
                maxLength={80}
                className="w-full bg-[#040404] border border-[#141414] focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] rounded-xl pl-3.5 pr-12 py-3.5 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={!userComment.trim()}
                className={`absolute right-2 top-2 bottom-2 px-3 rounded-lg flex items-center justify-center transition-all ${
                  userComment.trim()
                    ? "bg-[#E10600] text-white hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                    : "text-gray-700 bg-transparent cursor-not-allowed"
                }`}
              >
                <Send size={12} className="fill-current" />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[9px] text-gray-550 font-mono mt-2 px-1 select-none pointer-events-none">
              <span>ACTIVE CHAT: VERIFIED CLIENT</span>
              <span>80 CHARS MAX</span>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
