import React, { useState, useEffect, useRef, FormEvent, MouseEvent, ReactNode, WheelEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  Image as ImageIcon,
  Newspaper,
  Shield,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  Send,
  MapPin,
  Map,
  Settings,
  Coins,
  Lock,
  Unlock,
  Bot,
  Sparkles,
  Gamepad2,
  Tv,
  Flame,
  Trash2,
  Download,
  Archive,
  Play,
  Award,
  BookOpen,
  RefreshCw,
  AlertTriangle,
  Crown,
  Check,
  Copy,
  X,
  ChevronRight,
  UserCheck,
  Calendar,
  MessageSquare,
  ChevronDown,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Activity,
  Phone,
  Target,
  Info,
  History,
  Compass,
  Menu,
  Camera,
  Share2,
  ThumbsUp,
  Search,
  ExternalLink,
  Maximize2,
  Minimize2,
  ChevronUp,
  Smile,
  Flag,
  TrendingUp,
  ListFilter,
  Sun,
  Moon
} from "lucide-react";

import CVLayoutProtectionSystem from "./components/CVLayoutProtectionSystem";
import CVManagementPortal from "./components/CVManagementPortal";
import CVVisibilityInspector from "./components/CVVisibilityInspector";
import CVEsportsPassport from "./components/CVEsportsPassport";
import SeoPreviewSystem from "./components/SeoPreviewSystem";
import ExpandableCommentArea from "./components/ExpandableCommentArea";

import {
  INITIAL_TOURNAMENTS,
  INITIAL_RECRUITS,
  INITIAL_SCRIMS,
  INITIAL_FEED_POSTS,
  INITIAL_STRATEGY_MAPS,
  INITIAL_REGIONS,
  STORE_ITEMS,
  PLAYERS_LIST,
  COACHES_LIST,
  CREATORS_LIST,
  NEWS_ARTICLES,
  CHAMPIONS_SHOWCASE
} from "./data";

import {
  Tournament,
  RecruitmentApplication,
  ScrimSession,
  FeedPost,
  MapStrategy,
  TerritoryRegion,
  StoreItem,
  UserRole,
  UserSession,
  MapPreset,
  ChatMsg
} from "./types";

import CVBot from "./components/CVBot";
import LiveChannels from "./components/LiveChannels";
import ClanChatPanel from "./components/ClanChatPanel";
import VerifiedBroadcasters from "./components/VerifiedBroadcasters";
import ZimbabweTournamentDetail from "./components/ZimbabweTournamentDetail";
import { AnimatedCounter } from "./components/AnimatedCounter";
import TdmRadarScan from "./components/TdmRadarScan";
import TdmStrategyBlueprint from "./components/TdmStrategyBlueprint";
import CVTdmEcosystem from "./components/CVTdmEcosystem";
import CVTdmArena from "./components/CVTdmArena";
import CVCommunityHub from "./components/CVCommunityHub";
import CVBattlePassAndCareer from "./components/CVBattlePassAndCareer";
import InteractiveStrategyMaps from "./components/InteractiveStrategyMaps";
import TournamentHistory from "./components/TournamentHistory";
import TacticalBreakdownModal from "./components/TacticalBreakdownModal";
import ScrimManagementSystem from "./components/ScrimManagementSystem";
import AccessDenied from "./components/AccessDenied";
import CommunitySquadSystem from "./components/CommunitySquadSystem";
import ScrimOrganizationSystem from "./components/ScrimOrganizationSystem";
import RulesAndComplianceSystem, { RulesComplianceGate } from "./components/RulesAndComplianceSystem";
import WhatsAppLinkingSystem from "./components/WhatsAppLinkingSystem";
import PlayerStatsLinkingSystem from "./components/PlayerStatsLinkingSystem";
import WorldChatSystem from "./components/WorldChatSystem";
import RosterPlayerComparison from "./components/RosterPlayerComparison";
import PlayerComparisonSidePanel from "./components/PlayerComparisonSidePanel";
import { useTheme } from "./context/ThemeContext";
import EsportsControlCenter from "./components/EsportsControlCenter";
import CVSecurityGuardian from "./components/CVSecurityGuardian";
import CVAuditLogSystem from "./components/CVAuditLogSystem";
import { CVAestheticEffects } from "./components/CVAestheticEffects";
import html2canvas from "html2canvas";
import {
  HomePageDensity,
  UserDashboardDensity,
  TournamentDensitySection,
  ScrimDensitySection,
  TdmArenaDensitySection,
  CommunityTeamDensitySection,
  StreamerHubDensitySection,
  NewsHubDensitySection,
  RulesDensitySection,
  TeamHubDensitySection,
  StrategyRoomDensitySection,
  IntelligentEmptyState
} from "./components/CVDensityManager";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot } from "recharts";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const getRoleColors = (role: string) => {
    switch (role) {
      case "Owner":
        return {
          textClass: "text-[#FF001C]",
          bgClass: "bg-[#FF001C]/10",
          borderClass: "border-[#FF001C]",
          hoverBorderClass: "hover:border-[#FF001C]",
          shadowClass: "shadow-[0_0_15px_rgba(255,0,28,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(255,0,28,0.6)]",
          chevronClass: "text-[#FF001C]"
        };
      case "Head Admin":
        return {
          textClass: "text-[#FF4500]",
          bgClass: "bg-[#FF4500]/10",
          borderClass: "border-[#FF4500]",
          hoverBorderClass: "hover:border-[#FF4500]",
          shadowClass: "shadow-[0_0_15px_rgba(255,69,0,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(255,69,0,0.6)]",
          chevronClass: "text-[#FF4500]"
        };
      case "Admin":
        return {
          textClass: "text-[#FFD700]",
          bgClass: "bg-[#FFD700]/10",
          borderClass: "border-[#FFD700]",
          hoverBorderClass: "hover:border-[#FFD700]",
          shadowClass: "shadow-[0_0_15px_rgba(255,215,0,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]",
          chevronClass: "text-[#FFD700]"
        };
      case "Moderator":
        return {
          textClass: "text-[#C084FC]",
          bgClass: "bg-[#C084FC]/10",
          borderClass: "border-[#C084FC]",
          hoverBorderClass: "hover:border-[#C084FC]",
          shadowClass: "shadow-[0_0_15px_rgba(192,132,252,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(192,132,252,0.6)]",
          chevronClass: "text-[#C084FC]"
        };
      case "Team Captain":
        return {
          textClass: "text-[#F59E0B]",
          bgClass: "bg-[#F59E0B]/10",
          borderClass: "border-[#F59E0B]",
          hoverBorderClass: "hover:border-[#F59E0B]",
          shadowClass: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]",
          chevronClass: "text-[#F59E0B]"
        };
      case "Squad Leader":
        return {
          textClass: "text-[#06B6D4]",
          bgClass: "bg-[#06B6D4]/10",
          borderClass: "border-[#06B6D4]",
          hoverBorderClass: "hover:border-[#06B6D4]",
          shadowClass: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]",
          chevronClass: "text-[#06B6D4]"
        };
      case "Verified Player":
        return {
          textClass: "text-[#3B82F6]",
          bgClass: "bg-[#3B82F6]/10",
          borderClass: "border-[#3B82F6]",
          hoverBorderClass: "hover:border-[#3B82F6]",
          shadowClass: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]",
          chevronClass: "text-[#3B82F6]"
        };
      case "Member":
        return {
          textClass: "text-[#00FF9D]",
          bgClass: "bg-[#00FF9D]/10",
          borderClass: "border-[#00FF9D]",
          hoverBorderClass: "hover:border-[#00FF9D]",
          shadowClass: "shadow-[0_0_15px_rgba(0,255,157,0.3)]",
          hoverShadowClass: "hover:shadow-[0_0_25px_rgba(0,255,157,0.6)]",
          chevronClass: "text-[#00FF9D]"
        };
      case "Recruit":
        return {
          textClass: "text-[#34D399]",
          bgClass: "bg-[#34D399]/10",
          borderClass: "border-[#34D399]",
          hoverBorderClass: "hover:border-[#34D399]",
          shadowClass: "shadow-[0_0_10px_rgba(52,211,153,0.2)]",
          hoverShadowClass: "hover:shadow-[0_0_18px_rgba(52,211,153,0.4)]",
          chevronClass: "text-[#34D399]"
        };
      case "Visitor":
        return {
          textClass: "text-[#94A3B8]",
          bgClass: "bg-[#94A3B8]/10",
          borderClass: "border-[#94A3B8]",
          hoverBorderClass: "hover:border-[#94A3B8]",
          shadowClass: "shadow-[0_0_10px_rgba(148,163,184,0.15)]",
          hoverShadowClass: "hover:shadow-[0_0_18px_rgba(148,163,184,0.3)]",
          chevronClass: "text-[#94A3B8]"
        };
      case "Guest":
      default:
        return {
          textClass: "text-[#64748B]",
          bgClass: "bg-[#64748B]/10",
          borderClass: "border-[#64748B]",
          hoverBorderClass: "hover:border-[#64748B]",
          shadowClass: "shadow-[0_0_10px_rgba(100,116,139,0.1)]",
          hoverShadowClass: "hover:shadow-[0_0_15px_rgba(100,116,139,0.2)]",
          chevronClass: "text-[#64748B]"
        };
    }
  };

  const handleCommitRosterChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simRosterPlayerIgn.trim()) {
      setSystemAlertMessage("⚠️ Please provide a valid Player IGN gaming tag.");
      return;
    }
    
    const randomHexId = Math.floor(1000 + Math.random() * 9000);
    const dateObj = new Date();
    const formattedDate = dateObj.toISOString().slice(0, 10) + " " + dateObj.toTimeString().slice(0, 5) + " UTC";

    const newLogItem = {
      id: `RH-${randomHexId}`,
      timestamp: formattedDate,
      actionType: simRosterActionType,
      playerIgn: simRosterPlayerIgn.trim(),
      playerName: simRosterPlayerName.trim() || "Unspecified Operative",
      avatar: simRosterAvatar,
      oldValue: simRosterOldValue.trim() || undefined,
      newValue: simRosterNewValue.trim() || undefined,
      captainIgn: simRosterCaptain,
      notes: simRosterNotes.trim() || "Authenticated and approved under official competitive standards."
    };

    setRosterHistoryList(prev => [newLogItem, ...prev]);
    setSystemAlertMessage(`🏆 Committed Roster change ${newLogItem.id} for ${newLogItem.playerIgn}`);
    
    // Reset simulation parameters
    setSimRosterPlayerIgn("");
    setSimRosterPlayerName("");
    setSimRosterOldValue("");
    setSimRosterNewValue("");
    setSimRosterNotes("");
  };

  const getRoleIcon = (role: string) => {
    const r = (role || "").toLowerCase();
    if (r.includes("igl") || r.includes("leader") || r.includes("captain")) {
      return <Crown className="text-red-500 w-3.5 h-3.5 shrink-0" />;
    }
    if (r.includes("sniper") || r.includes("marksman")) {
      return <Target className="text-amber-500 w-3.5 h-3.5 shrink-0" />;
    }
    if (r.includes("support") || r.includes("anchor") || r.includes("defense")) {
      return <Shield className="text-sky-400 w-3.5 h-3.5 shrink-0" />;
    }
    if (r.includes("rusher") || r.includes("cqb") || r.includes("combater") || r.includes("assaulter") || r.includes("entry")) {
      return <Flame className="text-amber-500 w-3.5 h-3.5 shrink-0" />;
    }
    return <Zap className="text-zinc-400 w-3.5 h-3.5 shrink-0" />;
  };

  const getDynamicBadges = (player: any) => {
    if (!player) return [];
    const badges: Array<{
      title: string;
      desc: string;
      icon: any;
      colorClass: string;
      borderClass: string;
      bgClass: string;
      criteria: string;
    }> = [];

    const roleLower = (player.role || "").toLowerCase();
    const kdFloat = parseFloat(player.kd || "0");
    const achievementsCount = (player.achievements || []).length;

    // 1. Squad Leader
    if (roleLower.includes("igl") || roleLower.includes("captain") || roleLower.includes("leader")) {
      badges.push({
        title: "Squad Leader",
        desc: "Authorized team leader running primary rotations & tactical communication channels.",
        icon: Crown,
        colorClass: "text-[#ff001c]",
        borderClass: "border-[#ff001c]/30",
        bgClass: "bg-[#ff001f]/10",
        criteria: "Hold a roster role containing 'IGL', 'Captain', or 'Leader' elements."
      });
    }

    // 2. Top Fragger
    if (kdFloat >= 4.5) {
      badges.push({
        title: "Top Fragger",
        desc: "Dominant combat performer holding an elite battle K/D ratio exceeding 4.5.",
        icon: Flame,
        colorClass: "text-amber-500",
        borderClass: "border-amber-500/30",
        bgClass: "bg-amber-500/10",
        criteria: "Maintain an active elite division player K/D ratio of 4.50 or higher."
      });
    }

    // 3. Sharp Shooter
    if (roleLower.includes("sniper") || roleLower.includes("marksman") || player.ign.toLowerCase().includes("flick")) {
      badges.push({
        title: "Sharp Shooter",
        desc: "Pixel-perfect long-range target containment and suppression mechanics.",
        icon: Target,
        colorClass: "text-sky-400",
        borderClass: "border-sky-400/30",
        bgClass: "bg-sky-400/10",
        criteria: "Assigned as a long-range specialist (Sniper or Marksman player profile)."
      });
    }

    // 4. Tactical Veteran
    if (achievementsCount >= 2 || kdFloat >= 3.8) {
      badges.push({
        title: "Tactical Veteran",
        desc: "Highly experienced operator with multiple certified championship laurels.",
        icon: Award,
        colorClass: "text-purple-400",
        borderClass: "border-purple-500/30",
        bgClass: "bg-purple-500/10",
        criteria: "Document at least 2 system-level championships or a 3.80+ record K/D tier."
      });
    }

    // 5. Iron Wall / Support
    if (roleLower.includes("anchor") || roleLower.includes("support")) {
      badges.push({
        title: "Iron Wall",
        desc: "Flawless defensive support, resource management, and cover layouts.",
        icon: Shield,
        colorClass: "text-emerald-400",
        borderClass: "border-emerald-500/30",
        bgClass: "bg-emerald-500/10",
        criteria: "Deploy with a primary fortifying or resource-focused roster profile."
      });
    }

    // 6. Fast Reflex / Clutch
    if (roleLower.includes("assaulter") || roleLower.includes("roamer") || roleLower.includes("entry")) {
      badges.push({
        title: "Clutch Specialist",
        desc: "Outstanding reaction speeds, room clearing, and high-adrenaline flanking spikes.",
        icon: Zap,
        colorClass: "text-indigo-400",
        borderClass: "border-indigo-500/30",
        bgClass: "bg-indigo-500/10",
        criteria: "Operate as a rapid-strike force member (Assaulter, Roamer, or Entry role)."
      });
    }

    return badges;
  };

  const getPlayerActivityTimeline = (player: any) => {
    if (!player) return [];
    const game = player.game || "PUBG Mobile";
    const kd = parseFloat(player.kd || "4.0").toFixed(2);
    return [
      {
        id: 1,
        time: "3 hours ago",
        title: "Joined Squad Lobby",
        desc: `Participated in the live Tier-1 ${game} scrim session lobby.`,
        icon: Gamepad2,
        colorClass: "text-[#ff001c]",
        bgClass: "bg-[#ff001f]/10"
      },
      {
        id: 2,
        time: "1 day ago",
        title: "Tournament Entry Confirmed",
        desc: `Registered to compete in the main ${game} championship roster division.`,
        icon: Calendar,
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10"
      },
      {
        id: 3,
        time: "2 days ago",
        title: "Unlocked Achievement Award",
        desc: `Earned '${player.achievements?.[0] || "Esports MVP"}' for recent tournament success.`,
        icon: Trophy,
        colorClass: "text-purple-400",
        bgClass: "bg-purple-500/10"
      },
      {
        id: 4,
        time: "4 days ago",
        title: "Maintained Combat Peak",
        desc: `Registered a seasonal average combat ratio of ${kd} K/D across matches.`,
        icon: Activity,
        colorClass: "text-sky-400",
        bgClass: "bg-sky-400/10"
      },
      {
        id: 5,
        time: "1 week ago",
        title: "Operative Roster Integrated",
        desc: `Profile status synchronized with Jersey #${player.jerseyNumber || "12"} under specific '${player.role}' clearance.`,
        icon: Shield,
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-500/10"
      }
    ];
  };

  // Active Simulated User
  const [session, setSession] = useState<UserSession>({
    ign: "CV_Slayer_IGL",
    role: "Owner",
    coins: 750,
    battlePassXp: 120,
    battlePassLevel: 3,
    verified: true
  });

  const [activeTab, setActiveTab ] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view_passport") === "true") {
        return "passport";
      }
    } catch (e) {}
    return "home";
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCompact, setIsSidebarCompact] = useState(false);
  const [layoutRules, setLayoutRules] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("cv_layout_rules");
      return saved ? JSON.parse(saved) : {
        imageGuard: true,
        targetClearance: true,
        layoutClamping: true,
        animationGate: true
      };
    } catch (e) {
      return {
        imageGuard: true,
        targetClearance: true,
        layoutClamping: true,
        animationGate: true
      };
    }
  });
  const [waLinkedState, setWaLinkedState] = useState(false);

  useEffect(() => {
    const checkWa = () => {
      try {
        const saved = localStorage.getItem("cv_whatsapp_user_profiles");
        if (saved) {
          const profiles = JSON.parse(saved);
          setWaLinkedState(!!profiles[session.ign]?.isVerified);
        } else {
          setWaLinkedState(false);
        }
      } catch (e) {
        setWaLinkedState(false);
      }
    };
    checkWa();
    window.addEventListener("cv_whatsapp_update", checkWa);
    return () => window.removeEventListener("cv_whatsapp_update", checkWa);
  }, [session.ign]);

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener("cv_navigate_tab", handleNav);
    return () => window.removeEventListener("cv_navigate_tab", handleNav);
  }, []);

  const [globalSoundEnabled, setGlobalSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("fear_global_sound_enabled");
      return saved === "false" ? false : true;
    } catch {
      return true;
    }
  });

  // Owner Security Audit Logs synchronization states
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "init",
        user: {
          ign: session.ign,
          role: session.role,
          avatar: session.role === "Owner" ? "🎯" : session.role === "Head Admin" ? "👑" : "🛡️",
          verified: session.verified
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "init_data") {
          if (payload.auditLogs) {
            setAuditLogs(payload.auditLogs);
          }
        } else if (payload.type === "audit_logs") {
          setAuditLogs(payload.logs);
        }
      } catch (err) {
        console.error("App WebSocket parsing error in audit logs listener:", err);
      }
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [session.ign, session.role, session.verified]);

  const playInteractionSound = (type: "click" | "success" | "alert" | "hover" | "matchFound" | "tournamentStart" = "click") => {
    if (!globalSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
        
        setTimeout(() => {
          try {
            const audioCtx2 = new AudioCtx();
            if (audioCtx2.state === "suspended") audioCtx2.resume();
            const osc2 = audioCtx2.createOscillator();
            const gain2 = audioCtx2.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx2.destination);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(880, audioCtx2.currentTime); // A5
            gain2.gain.setValueAtTime(0.04, audioCtx2.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx2.currentTime + 0.15);
            osc2.start();
            osc2.stop(audioCtx2.currentTime + 0.17);
          } catch {}
        }, 120);
      } else if (type === "alert") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === "matchFound") {
        // High-energy electronic chiptune arpeggio for Match Acquired
        const playBeep = (freq: number, startTime: number, duration: number, vol: number) => {
          try {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(freq, startTime);
            gain2.gain.setValueAtTime(vol, startTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc2.start(startTime);
            osc2.stop(startTime + duration + 0.05);
          } catch {}
        };
        const now = audioCtx.currentTime;
        playBeep(523.25, now, 0.08, 0.04);       // C5
        playBeep(659.25, now + 0.08, 0.08, 0.04); // E5
        playBeep(783.99, now + 0.16, 0.08, 0.04); // G5
        playBeep(1046.50, now + 0.24, 0.35, 0.05); // C6 (longer sustain)
      } else if (type === "tournamentStart") {
        // Broad epic sci-fi stadium announcer fanfare chord
        const playTone = (freq: number, oscType: OscillatorType, duration: number, vol: number, freqEnd?: number) => {
          try {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = oscType;
            osc2.frequency.setValueAtTime(freq, audioCtx.currentTime);
            if (freqEnd) {
              osc2.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
            }
            gain2.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc2.start();
            osc2.stop(audioCtx.currentTime + duration + 0.05);
          } catch {}
        };
        // Orchestrate a major power triad with synth-saw waves + high sweep
        playTone(130.81, "sawtooth", 0.6, 0.02, 180); // C3 fundamental power sweep
        playTone(196.00, "sawtooth", 0.6, 0.02, 270); // G3 dominant 5th power sweep
        playTone(261.63, "triangle", 0.6, 0.03);      // C4 middle tri tone
        playTone(329.63, "triangle", 0.5, 0.03);      // E4 major 3rd
        playTone(523.25, "sine", 0.8, 0.02, 1046.5);  // High C5 to C6 pitch glide
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      // AudioContext not supported or permission blocked
    }
  };

  const toggleGlobalSound = () => {
    const nextState = !globalSoundEnabled;
    setGlobalSoundEnabled(nextState);
    try {
      localStorage.setItem("fear_global_sound_enabled", String(nextState));
    } catch {}
    
    if (nextState) {
      setTimeout(() => {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioCtx) return;
          const audioCtx = new AudioCtx();
          if (audioCtx.state === "suspended") audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch {}
      }, 50);
    }
  };

  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    playInteractionSound("click");
  }, [activeTab]);

  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [communityHubInitialTab, setCommunityHubInitialTab] = useState<"hosting" | "teams" | "discovery">("teams");
  const [mediaSubTab, setMediaSubTab] = useState<"live" | "broadcasters" | "vault">("live");
  const [leaderboardSubTab, setLeaderboardSubTab] = useState<"rankings" | "linking">("linking");

  const checkRuleAcceptance = (categoryId: string) => {
    try {
      const saved = localStorage.getItem("cv_rule_acceptances");
      if (!saved) return false;
      const acceptances = JSON.parse(saved);
      const rulesBase = localStorage.getItem("cv_system_rules");
      const rules = rulesBase ? JSON.parse(rulesBase) : null;
      
      const expectedObj = (rules || []).find((r: any) => r.categoryId === categoryId);
      const expectedVer = expectedObj ? expectedObj.version : "1.0";
      
      return acceptances.some(
        (acc: any) =>
          acc.categoryId === categoryId &&
          acc.userIgn === session.ign &&
          acc.versionAccepted === expectedVer
      );
    } catch (e) {
      return false;
    }
  };

  const handleGateAgree = (categoryId: string) => {
    try {
      const savedAcc = localStorage.getItem("cv_rule_acceptances");
      const acceptances = savedAcc ? JSON.parse(savedAcc) : [];
      
      const savedRules = localStorage.getItem("cv_system_rules");
      const rulesList = savedRules ? JSON.parse(savedRules) : [];
      const expectedObj = rulesList.find((r: any) => r.categoryId === categoryId);
      const expectedVer = expectedObj ? expectedObj.version : "1.0";

      const updated = acceptances.filter(
        (acc: any) => !(acc.categoryId === categoryId && acc.userIgn === session.ign)
      );

      const newAcceptance = {
        id: "acc-" + Date.now(),
        categoryId,
        categoryName: categoryId, 
        versionAccepted: expectedVer,
        dateAccepted: new Date().toISOString().split("T")[0],
        userIgn: session.ign,
        userRole: "Compliance Participant"
      };

      localStorage.setItem("cv_rule_acceptances", JSON.stringify([...updated, newAcceptance]));
      setSystemAlertMessage(`✅ Compliance ratified for category: ${categoryId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const complianceTabsMap: Record<string, string> = {
    tournaments: "tournaments",
    scrims: "scrims",
    scrimOrgs: "scrims",
    recruitment: "recruitment",
    communitySquads: "communitySquads",
    feed: "teamHub",
    rewards: "teamHub",
    team: "teamHub",
    strategy: "strategyRoom",
    media: "mediaGallery"
  };
  const activeComplianceCategory = complianceTabsMap[activeTab];

  // Initial loading states for esports organization boot animation
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStep, setBootStep] = useState("ESTABLISHING CONTAINER SECURITY TUNNEL...");

  useEffect(() => {
    const steps = [
      "ESTABLISHING SAFELY ENCRYPTED PORT CONFIG...",
      "CALIBRATING TOURNAMENT GRIDS & SCRAMBLING SENSORS...",
      "DECRYPTING WARZONE CLAN COMMS CHANNEL...",
      "SECURING FIREBASE COMPLIANT AUTHENTICATION SHELL...",
      "CRIMSON VIPERS SYSTEM ENGAGED!"
    ];
    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsInitialLoading(false);
          }, 350);
          return 100;
        }
        const nextProgress = prev + Math.floor(Math.random() * 11) + 7;
        const progressTarget = Math.min(nextProgress, 100);
        
        const stepIndex = Math.min(Math.floor((progressTarget / 100) * steps.length), steps.length - 1);
        if (stepIndex !== currentStepIndex) {
          currentStepIndex = stepIndex;
          setBootStep(steps[stepIndex]);
        }
        
        return progressTarget;
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);
  
  // App State Databases
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "leaderboard" | "teams" | "matches">("overview");
  const [tournamentTypeFilter, setTournamentTypeFilter] = useState<string>("All");
  const [tournamentStatusFilter, setTournamentStatusFilter] = useState<string>("All");
  const [minPrizeFilter, setMinPrizeFilter] = useState<number>(0);
  const [prizeSortOrder, setPrizeSortOrder] = useState<"none" | "asc" | "desc">("none");
  const [recruits, setRecruits] = useState<RecruitmentApplication[]>(INITIAL_RECRUITS);
  const [scrims, setScrims] = useState<ScrimSession[]>(INITIAL_SCRIMS);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [feedSortBy, setFeedSortBy] = useState<"newest" | "popular" | "tier">("newest");
  const [expandedFeedPlayerIgn, setExpandedFeedPlayerIgn] = useState<string | null>(null);
  const [strategyMaps, setStrategyMaps] = useState<MapStrategy[]>(INITIAL_STRATEGY_MAPS);
  const [mapPresets, setMapPresets] = useState<MapPreset[]>(() => {
    try {
      const saved = localStorage.getItem("vipers_map_presets");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newPresetName, setNewPresetName] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("vipers_map_presets", JSON.stringify(mapPresets));
    } catch (e) {
      console.error(e);
    }
  }, [mapPresets]);

  const [regions, setRegions] = useState<TerritoryRegion[]>(INITIAL_REGIONS);
  const [purchasedStoreItemIds, setPurchasedStoreItemIds] = useState<string[]>([]);
  const [antiCheatReports, setAntiCheatReports] = useState<{ id: string; targetIgn: string; cheatType: string; evidenceUrl: string; status: string }[]>([
    { id: "1", targetIgn: "NoRecoilMacro_99", cheatType: "Device Emulation / Macros", evidenceUrl: "https://youtube.com/clip/macro-test", status: "Under Review" }
  ]);

  // UI States
  const [selectedMapId, setSelectedMapId] = useState<string>("maps1");
  const [pendingPin, setPendingPin] = useState<{ x: number, y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("default");
  
  // Tactical Map Zoom & Pan State
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoCenterActive, setAutoCenterActive] = useState<boolean>(true);
  const [autoCenterCountdown, setAutoCenterCountdown] = useState<number>(30);
  const lastMapInteractionRef = React.useRef<number>(Date.now());
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFlippedPlayerIds, setIsFlippedPlayerIds] = useState<string[]>([]);

  // Capture screenshot snapshot of the currently visible map telemetry console deck
  const handleTakeTdmSnapshot = async () => {
    const deckElement = document.getElementById("tdm-telemetry-console-deck");
    if (!deckElement) {
      setSystemAlertMessage("⚠️ Error: Telemetry Console Deck container not found.");
      return;
    }
    try {
      setSystemAlertMessage("📷 Initiating high-resolution capture of the map telemetry deck... Please wait.");
      
      const canvas = await html2canvas(deckElement, {
        useCORS: true,
        backgroundColor: "#050202",
        scale: 2, // High resolution scale factor
        scrollX: 0,
        scrollY: 0,
        windowWidth: deckElement.scrollWidth,
        windowHeight: deckElement.scrollHeight,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imgData;
      downloadLink.download = `CV_TDM_Telemetry_Snapshot_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setSystemAlertMessage("🎯 Telemetry Snapshot captured & downloaded successfully!");
      awardXp(15);
    } catch (err) {
      console.error("Screenshot error:", err);
      setSystemAlertMessage("⚠️ Error capturing telemetry snapshot. Please retry.");
    }
  };
  // Player Comparison State Definitions (Hidden by default)
  const [comparePlayerA, setComparePlayerA] = useState<string>("CV_Slayer_IGL");
  const [comparePlayerB, setComparePlayerB] = useState<string>("CV_Mamba_Flick");
  const [isComparePanelOpen, setIsComparePanelOpen] = useState<boolean>(false);
  const [isComparisonWidgetVisible, setIsComparisonWidgetVisible] = useState<boolean>(false);
  const [isRosterComparisonVisible, setIsRosterComparisonVisible] = useState<boolean>(false);

  const [sortRosterByElite, setSortRosterByElite] = useState<boolean>(false);
  const [sortRosterByTier, setSortRosterByTier] = useState<boolean>(false);
  const [selectedRosterRole, setSelectedRosterRole] = useState<string>("All");

  // Active roster list in component state for dynamic updates
  const [rosterPlayers, setRosterPlayers] = useState<any[]>(() => {
    return PLAYERS_LIST.map((player, idx) => {
      // Simulate different lastActive times:
      // Even indices: active recently (Available)
      // Odd indices: active > 10 mins ago (Busy)
      const lastActiveOffsetMinutes = idx % 2 === 0 ? (2 + idx * 2) : (11 + idx * 2);
      const winRate = idx === 0 ? "74%" : idx === 1 ? "68%" : idx === 2 ? "81%" : "62%";
      const totalKills = idx === 0 ? 1240 : idx === 1 ? 984 : idx === 2 ? 1412 : 750;
      const tier = idx === 0 ? "GRANDMASTER" : idx < 3 ? "MASTER" : "DIAMOND";
      const joinDates = ["Jan 15, 2024", "Jun 20, 2024", "Feb 10, 2025", "Nov 22, 2025"];
      return {
        ...player,
        tier,
        availabilityStatus: lastActiveOffsetMinutes <= 10 ? "Available" : "Busy",
        lastActiveInLobby: Date.now() - lastActiveOffsetMinutes * 60 * 1000,
        winRate,
        totalKills,
        isVerified: idx !== 3, // Initial toggle states (one is Pending for demo)
        joinDate: joinDates[idx] || "Jan 01, 2025"
      };
    });
  });

  // Reset the tactical map activity timer whenever map zoom or pan is modified
  useEffect(() => {
    lastMapInteractionRef.current = Date.now();
    setAutoCenterCountdown(30);
  }, [mapZoom, mapPan]);

  // Monitor tactical map inactivity and auto-center after 30 seconds of quiet time
  useEffect(() => {
    if (!autoCenterActive) return;

    const interval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastMapInteractionRef.current;
      const secondsRemaining = Math.max(0, Math.ceil((30000 - timeSinceInteraction) / 1000));
      
      setAutoCenterCountdown(secondsRemaining);

      if (timeSinceInteraction >= 30000) {
        if (mapZoom !== 1.0 || mapPan.x !== 0 || mapPan.y !== 0) {
          setMapZoom(1.0);
          setMapPan({ x: 0, y: 0 });
          setSystemAlertMessage("🎯 Auto-Center Triggered: Map view re-centered automatically after 30 seconds of inactivity.");
        }
        lastMapInteractionRef.current = Date.now();
        setAutoCenterCountdown(30);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoCenterActive, mapZoom, mapPan]);

  // --- CV HEALTH SENTINEL SYSTEM ---
  const [sentinelStatus, setSentinelStatus] = useState({
    integrityScore: 100,
    isHealthy: true,
    lastPingTime: "Never",
    checks: [
      { id: "api", name: "Express Backend Connection", status: "pending", details: "Pinging /api/health..." },
      { id: "tournament", name: "Tournament Grid Module", status: "pending", details: "Scanning state grids..." },
      { id: "scrim", name: "Scrim Dashboard System", status: "pending", details: "Scanning match schedules..." },
      { id: "audio", name: "Intranet Audio Systems", status: "pending", details: "Initializing synthesizers..." }
    ] as { id: string; name: string; status: "success" | "failure" | "pending"; details: string }[]
  });

  const triggerSentinelCheck = async () => {
    // 1. Check API endpoint
    let apiStatus: "success" | "failure" = "success";
    let apiDetails = "Healthy connection";
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error("API status error: " + res.status);
      const data = await res.json();
      apiDetails = `Latency < 12ms (${data.status})`;
    } catch (e: any) {
      apiStatus = "failure";
      apiDetails = e.message || "Connection refused";
    }

    // 2. Check Tournaments State
    const hasTournaments = Array.isArray(tournaments) && tournaments.length > 0;
    const tournamentStatus = hasTournaments ? "success" : "failure";
    const tournamentDetails = hasTournaments ? `${tournaments.length} active tournaments` : "Empty state grid";

    // 3. Check Scrims State
    const hasScrims = Array.isArray(scrims) && scrims.length > 0;
    const scrimStatus = hasScrims ? "success" : "failure";
    const scrimDetails = hasScrims ? `${scrims.length} scheduled scrims` : "Empty schedule database";

    // 4. Check Audio Context
    let audioStatus: "success" | "failure" = "success";
    let audioDetails = "Chiptunes & Announcer ready";
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        audioStatus = "failure";
        audioDetails = "Browser audio context blocked";
      }
    } catch {
      audioStatus = "failure";
      audioDetails = "Audio initialization error";
    }

    // Calculate total integrity score based on check status
    const list = [
      { id: "api", name: "Express Backend Connection", status: apiStatus, details: apiDetails },
      { id: "tournament", name: "Tournament Grid Module", status: tournamentStatus, details: tournamentDetails },
      { id: "scrim", name: "Scrim Dashboard System", status: scrimStatus, details: scrimDetails },
      { id: "audio", name: "Intranet Audio Systems", status: audioStatus, details: audioDetails }
    ];

    const successCount = list.filter(c => c.status === "success").length;
    const score = Math.round((successCount / list.length) * 100);
    const isHealthy = score === 100;

    setSentinelStatus({
      integrityScore: score,
      isHealthy,
      lastPingTime: new Date().toLocaleTimeString(),
      checks: list
    });
  };

  // Run sentinel checks every 5 seconds
  useEffect(() => {
    triggerSentinelCheck();
    const intervalCheck = setInterval(triggerSentinelCheck, 5000);
    return () => clearInterval(intervalCheck);
  }, [tournaments, scrims]);

  const handleSelfRepair = () => {
    setTournaments(INITIAL_TOURNAMENTS);
    setScrims(INITIAL_SCRIMS);
    setRecruits(INITIAL_RECRUITS);
    setFeedPosts(INITIAL_FEED_POSTS);
    setStrategyMaps(INITIAL_STRATEGY_MAPS);
    setSystemAlertMessage("🛠️ CV Self-Repair complete! Re-initialized tournament grids, scrim dashboards, recruitment sheet, and global map layers.");
    // Re-trigger checks immediately after reset
    setTimeout(triggerSentinelCheck, 100);
  };

  // Automatically check player inactivity and set to 'Busy' if over 10 minutes inactive
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setRosterPlayers((prevPlayers) => {
        let changed = false;
        const updated = prevPlayers.map((player) => {
          const inactiveMs = Date.now() - (player.lastActiveInLobby || 0);
          const needsBusy = inactiveMs > 10 * 60 * 1000;
          if (needsBusy && player.availabilityStatus !== "Busy") {
            changed = true;
            return {
              ...player,
              availabilityStatus: "Busy"
            };
          }
          return player;
        });
        return changed ? updated : prevPlayers;
      });
    }, 4000); // Check every 4 seconds

    return () => clearInterval(checkInterval);
  }, []);

  // Helper toggle to simulate custom lobby activity of any player for instant demonstration
  const simulateLobbyActivity = (ign: string) => {
    setRosterPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.ign === ign) {
          return {
            ...player,
            availabilityStatus: "Available",
            lastActiveInLobby: Date.now()
          };
        }
        return player;
      })
    );
    setSystemAlertMessage(`⚡ Simulated lobby check-in for ${ign}! Status updated to Available (Timer reset).`);
  };
  const [isTacticalModalOpen, setIsTacticalModalOpen] = useState<boolean>(false);
  const [tacticalPlayerIgn, setTacticalPlayerIgn] = useState<string>("");
  const [systemAlertMessage, setSystemAlertMessage] = useState<string>("🔥 Welcome to Fear 4Fangz! Fear 4Fangz is your destination for competitive esports, tournaments, scrims, and matchmaking. Connect, compete, and conquer with players across the globe.");
  
  // Custom Toast Notifications for specific events (e.g., dossier download)
  interface CVToast {
    id: string;
    message: string;
    type: "success" | "info" | "error";
  }
  const [toasts, setToasts] = useState<CVToast[]>([]);
  
  const addToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Confirmation state for downloading a player dossier
  const [dossierConfirmData, setDossierConfirmData] = useState<any | null>(null);
  const [hoveredTrajIdx, setHoveredTrajIdx] = useState<number | null>(null);

  // Generate deterministic performance trajectory & games played for any player
  const getPlayerTrajectoryData = (ign: string, kdStr: string, totalKills: number, winRateStr: string) => {
    const seed = ign.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const currentKd = parseFloat(kdStr) || 4.0;
    
    // Generate K/D values for the last 6 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const kdTrajectory = months.map((_, i) => {
      const step = (i - 5) * 0.12; // -0.6 to 0
      const fluctuation = ((seed + i * 13) % 7 - 3) * 0.04; // small deterministic fluctuation
      const val = currentKd + step + fluctuation;
      return Math.max(1.0, Math.round(val * 100) / 100);
    });

    // Replace the last element exactly with current K/D to align perfectly
    kdTrajectory[5] = currentKd;

    // Calculate sparkline bars using unicode blocks
    const minKd = Math.min(...kdTrajectory);
    const maxKd = Math.max(...kdTrajectory);
    const range = maxKd - minKd || 1;
    const blocks = [" ", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
    const sparkline = kdTrajectory.map(val => {
      const ratio = (val - minKd) / range;
      const blockIndex = Math.min(blocks.length - 1, Math.floor(ratio * (blocks.length - 1)));
      return blocks[blockIndex];
    }).join("");

    // Total games played calculation
    const killsVal = totalKills || 800;
    const avgKillsPerMatch = currentKd * 0.85;
    const totalGames = Math.max(50, Math.round(killsVal / avgKillsPerMatch)) || 220;

    const trend = kdTrajectory[5] > kdTrajectory[0] ? "Positive (↗)" : "Stable (→)";

    return {
      months,
      kdTrajectory,
      sparkline,
      totalGames,
      trend
    };
  };
  
  // Modern Dropdown Navigation states & actions
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".cv-nav-dropdown-container")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const handleDropdownAction = (action: string, requires?: string) => {
    if (requires && !hasTabPermission(session.role, requires)) {
      setSystemAlertMessage(
        `🔒 Guard Override Active: Access Denied. Switch to Owner or Captain in Left Panel list to toggle clearance.`
      );
      return;
    }

    switch (action) {
      case "home":
        setActiveTab("home");
        setSystemAlertMessage("🌐 Navigated to CV Home Arena");
        break;
      case "tournaments-solo":
        setTournamentTypeFilter("Solo");
        setTournamentStatusFilter("All");
        setActiveTab("tournaments");
        setSelectedTournamentId(null);
        setSystemAlertMessage("🏆 Loaded Solo Field Tournaments");
        break;
      case "tournaments-duo":
        setTournamentTypeFilter("Duo");
        setTournamentStatusFilter("All");
        setActiveTab("tournaments");
        setSelectedTournamentId(null);
        setSystemAlertMessage("🏆 Loaded Duo Field Tournaments");
        break;
      case "tournaments-squad":
        setTournamentTypeFilter("Squad");
        setTournamentStatusFilter("All");
        setActiveTab("tournaments");
        setSelectedTournamentId(null);
        setSystemAlertMessage("🏆 Loaded Squad Field Tournaments");
        break;
      case "tournaments-live":
        setTournamentTypeFilter("All");
        setTournamentStatusFilter("Live");
        setActiveTab("tournaments");
        setSelectedTournamentId(null);
        setSystemAlertMessage("🔥 Loaded Live Arena Tournaments");
        break;
      case "tournaments-results":
        setTournamentTypeFilter("All");
        setTournamentStatusFilter("Completed");
        setActiveTab("tournaments");
        setSelectedTournamentId(null);
        setSystemAlertMessage("📊 Loaded Completed Tournament Results");
        break;
      case "leaderboards":
        setActiveTab("leaderboards");
        setSystemAlertMessage("🏆 Loaded Official CS Leaderboards");
        break;

      case "team-roster":
        setActiveTab("team");
        setSystemAlertMessage("🎯 Loaded CV Active Player Roster");
        break;
      case "team-coaches":
        setActiveTab("team");
        setSystemAlertMessage("🧠 Loaded Strategic Coaches & Analysts");
        break;
      case "team-analysts":
        setActiveTab("team");
        setSystemAlertMessage("📊 Loaded Roster Analysts & Stats Staff");
        break;
      case "team-creators":
        setActiveTab("team");
        setSystemAlertMessage("🎬 Loaded CV Content Creators & Broadcasters");
        break;
      case "team-hof":
        setActiveTab("team");
        setSystemAlertMessage("⭐ Loaded Hall of Fame Historical Legends");
        break;

      case "media-photos":
        setActiveTab("media");
        setMediaSubTab("vault");
        setSystemAlertMessage("📸 Loaded CV Photo Archive");
        break;
      case "media-videos":
        setActiveTab("media");
        setMediaSubTab("live");
        setSystemAlertMessage("🎥 Loaded Live Match Broadcasts");
        break;
      case "media-highlights":
        setActiveTab("media");
        setMediaSubTab("vault");
        setSystemAlertMessage("🎬 Loaded Tournament Highlights Reels");
        break;
      case "media-posters":
        setActiveTab("media");
        setMediaSubTab("broadcasters");
        setSystemAlertMessage("🎨 Loaded Custom Broadcaster Hub & Posters");
        break;

      case "recruitment":
        setActiveTab("recruitment");
        setSystemAlertMessage("📝 Loaded Recruitments Hub");
        break;
      case "news":
        setActiveTab("news");
        setSystemAlertMessage("📰 Loaded News & Bulletins Hub");
        break;
      case "news-trophy":
        setActiveTab("news");
        setSystemAlertMessage("🏆 Exploring CV Trophy Cabinet and Champions");
        break;

      case "communitySquads":
        setActiveTab("communitySquads");
        setSystemAlertMessage("👥 Entering Independent Community Squad Sector");
        break;

      case "scrimOrgs":
        setActiveTab("scrimOrgs");
        setSystemAlertMessage("🎯 Accessing Dedicated Independent Scrim Organization Hub");
        break;

      case "feed":
        setActiveTab("feed");
        setSystemAlertMessage("📡 Connected to Roster Bulletin Board");
        break;
      case "strategy":
        setActiveTab("strategy");
        setSystemAlertMessage("🗺️ Connected to AI Strategy Map Planner");
        break;
      case "scrims":
        setActiveTab("scrims");
        localStorage.setItem("cv_scrims_active_subtab", "listings");
        window.dispatchEvent(new CustomEvent("cv_set_scrim_subtab", { detail: "listings" }));
        setSystemAlertMessage("🗓️ Loading Scrims & Schedules Listings");
        break;
      case "rules-dashboard":
        setActiveTab("rules-dashboard");
        setSystemAlertMessage("⚖️ Accessing Centralized Rules and Compliance Control System");
        break;
      case "rewards":
        setActiveTab("rewards");
        setSystemAlertMessage("💎 Opened CV Coin Rewards Store");
        break;

      case "dashboard":
        setActiveTab("dashboard");
        setSystemAlertMessage("👑 Accessed Root Command Dashboard");
        break;
      case "owner-audit-logs":
        setActiveTab("owner-audit-logs");
        setSystemAlertMessage("🔐 Accessed Owner Security Audit Ledger");
        break;
      case "admin-control":
        setActiveTab("scrims");
        localStorage.setItem("cv_scrims_active_subtab", "control");
        window.dispatchEvent(new CustomEvent("cv_set_scrim_subtab", { detail: "control" }));
        setSystemAlertMessage("🛠️ Opened Scrim Tournament Control Center");
        break;
      case "admin-members":
        setActiveTab("scrims");
        localStorage.setItem("cv_scrims_active_subtab", "reputation");
        window.dispatchEvent(new CustomEvent("cv_set_scrim_subtab", { detail: "reputation" }));
        setSystemAlertMessage("👥 Opened Captains Reputation Registry");
        break;
      case "admin-announcements":
        setActiveTab("feed");
        setSystemAlertMessage("📢 Broadcaster Communication Central Panel");
        break;
      case "admin-permissions":
        setActiveTab("scrims");
        localStorage.setItem("cv_scrims_active_subtab", "owner");
        window.dispatchEvent(new CustomEvent("cv_set_scrim_subtab", { detail: "owner" }));
        setSystemAlertMessage("🔑 Opened Permission Delegation Console");
        break;
      case "admin-roomcode":
        setActiveTab("scrims");
        localStorage.setItem("cv_scrims_active_subtab", "room");
        window.dispatchEvent(new CustomEvent("cv_set_scrim_subtab", { detail: "room" }));
        setSystemAlertMessage("🛰️ Opened Lobby Room Code Coordinator");
        break;

      default:
        break;
    }

    setOpenDropdownId(null);
  };

  const CV_NAV_STRUCTURE = [
    { id: "home", label: "HOME", type: "link", action: "home" },
    {
      id: "tournaments",
      label: "TOURNAMENTS",
      type: "dropdown",
      links: [
        { label: "Solo Tournaments", action: "tournaments-solo", desc: "1v1 Gladiator Arena" },
        { label: "Duo Tournaments", action: "tournaments-duo", desc: "Twin Fire Showdown" },
        { label: "Squad Tournaments", action: "tournaments-squad", desc: "Full Clan Squad Operations" },
        { label: "Live Tournaments", action: "tournaments-live", desc: "Matches Streaming Real-Time", tag: "LIVE", tagColor: "bg-red-650 text-white" },
        { label: "Results", action: "tournaments-results", desc: "Official Bracket Standings" },
        { label: "Leaderboards", action: "leaderboards", desc: "Global Player Power Index" }
      ]
    },
    {
      id: "team",
      label: "TEAM",
      type: "dropdown",
      links: [
        { label: "Main Roster", action: "team-roster", desc: "Cv elites main squad" },
        { label: "Coaches", action: "team-coaches", desc: "Tactical & Analytics Mentors" },
        { label: "Analysts", action: "team-analysts", desc: "Data Frame Inspectors" },
        { label: "Content Creators", action: "team-creators", desc: "CV Official Streamers" },
        { label: "Hall of Fame", action: "team-hof", desc: "Legendary Clan Veterans" }
      ]
    },
    {
      id: "media",
      label: "MEDIA",
      type: "dropdown",
      links: [
        { label: "Photos", action: "media-photos", desc: "Arena Capture Library" },
        { label: "Videos", action: "media-videos", desc: "Cinematic Match Archives & VODs" },
        { label: "Tournament Highlights", action: "media-highlights", desc: "Epic Game Clicks & Kills" },
        { label: "Posters", action: "media-posters", desc: "Custom Match Vector Designs" }
      ]
    },
    {
      id: "community",
      label: "COMMUNITY",
      type: "dropdown",
      links: [
        { label: "Community Squads 👥", action: "communitySquads", desc: "Autonomous Community Sectors", tag: "NEW", tagColor: "bg-red-950 text-red-400 border border-red-900/30" },
        { label: "CV TDM Arena ⚔️", action: "tdmArena", desc: "Matchmaking & Verification Hub", tag: "ARENA", tagColor: "bg-red-650 text-white" },
        { label: "Scrim Organizations", action: "scrimOrgs", desc: "Separate Independent Scrim Hub", tag: "AUTONOMOUS", tagColor: "bg-red-900 text-red-300 border border-red-700/30" },
        { label: "Recruitment", action: "recruitment", desc: "Apply for Trial Enlistment", tag: "OPEN", tagColor: "bg-emerald-950 text-emerald-400 border border-emerald-900/30" },
        { label: "News Hub", action: "news", desc: "Official Press & Updates" },
        { label: "Trophy Room", action: "news-trophy", desc: "Zimbabwe & Global Champion Cups" },
        { label: "Rankings", action: "leaderboards", desc: "Esports Club Leaderboards" }
      ]
    },
    {
      id: "memberArea",
      label: "MEMBER AREA",
      type: "dropdown",
      links: [
        { label: "Team Hub", action: "feed", desc: "Roster Bulletin & Notes Feed", requires: "Team Hub" },
        { label: "Strategy Room", action: "strategy", desc: "Tactical Sandbox Board", requires: "Strategy Room" },
        { label: "Scrims", action: "scrims", desc: "Schedules & Lobby Setup", requires: "Scrims" },
        { label: "Team Vault", action: "rewards", desc: "Claim Rewards with CV Coins", requires: "Team Hub" }
      ]
    },
    {
      id: "compliance",
      label: "COMPLIANCE",
      type: "dropdown",
      links: [
        { label: "Rules Dashboard", action: "rules-dashboard", desc: "Centralized Rules Registry Index", tag: "LAW", tagColor: "bg-red-950 text-red-400 border border-red-900/30" },
        { label: "Exclusions Ledger", action: "rules-dashboard", desc: "Exclusion & Appeal Logs", tag: "AUDIT", tagColor: "bg-neutral-800 text-neutral-300 border border-neutral-700/30" }
      ]
    },
    {
      id: "adminPanel",
      label: "ADMIN PANEL",
      type: "dropdown",
      requires: "Dashboard",
      links: [
        { label: "Dashboard", action: "dashboard", desc: "Root Command Center", requires: "Dashboard" },
        { label: "Owner Audit Ledger", action: "owner-audit-logs", desc: "Comprehensive, Immutable Audit Records", requires: "Owner Dashboard" },
        { label: "Tournament Control Center", action: "admin-control", desc: "Live Brackets & Sim Settings", requires: "Dashboard" },
        { label: "Member Management", action: "admin-members", desc: "Reputation & Disciplinary Logs", requires: "Dashboard" },
        { label: "Announcement Center", action: "admin-announcements", desc: "Push Global Chat & Feed Posts", requires: "Dashboard" },
        { label: "Permission Manager", action: "admin-permissions", desc: "Roster Security Roles Assign", requires: "Dashboard" },
        { label: "Room Code Management", action: "admin-roomcode", desc: "Configure Custom IDs/Passkeys", requires: "Dashboard" }
      ]
    }
  ];
  
  // Forms State
  const [newPostText, setNewPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [openCommentSections, setOpenCommentSections] = useState<{ [postId: string]: boolean }>({});
  const [postPendingDelete, setPostPendingDelete] = useState<string | null>(null);
  const [expandedPostImage, setExpandedPostImage] = useState<{ src: string, title: string } | null>(null);
  const [reportingPost, setReportingPost] = useState<FeedPost | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportCustomReason, setReportCustomReason] = useState("");
  
  // Scrim input
  const [scrimTitle, setScrimTitle] = useState("");
  const [scrimGame, setScrimGame] = useState("PUBG Mobile");
  const [scrimMap, setScrimMap] = useState("Erangel");

  // Recruitment application form
  const [applyIgn, setApplyIgn] = useState("");
  const [applyRole, setApplyRole] = useState("CV Elite Main Squad Member");
  const [applyGame, setApplyGame] = useState("PUBG Mobile");
  const [applyRank, setApplyRank] = useState("Gold");
  const [applyDevice, setApplyDevice] = useState("iPhone 15 Pro");
  const [applyExp, setApplyExp] = useState("");
  const [applyAvail, setApplyAvail] = useState("");
  const [applyContact, setApplyContact] = useState("");
  const [applyOptional, setApplyOptional] = useState("");
  const [recruitmentSuccess, setRecruitmentSuccess] = useState(false);

  // WhatsApp Notification States
  const [whatsappTournament, setWhatsappTournament] = useState<Tournament | null>(null);
  const [whatsappCaptainNo, setWhatsappCaptainNo] = useState("");
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Captain Records Registry for the WhatsApp notification system
  const [captainRecords, setCaptainRecords] = useState<any[]>([
    {
      id: "cap-rec-1",
      tournamentTitle: "CV PUBG Mobile Solo Showdown",
      captainName: "Kevin Vance",
      teamName: "ViperShoot",
      captainNo: "15555550199",
      schedule: "Every Wednesday & Saturday @ 18:00 UTC",
      mapDetails: "Erangel, Miramar, and Sanhok",
      status: "DISPATCHED"
    },
    {
      id: "cap-rec-2",
      tournamentTitle: "PUBG Mobile Duo Premier League",
      captainName: "Lia Ramirez",
      teamName: "CV_ShadowDuo",
      captainNo: "447111222333",
      schedule: "Monday, Wednesday, Friday @ 20:00 UTC",
      mapDetails: "Miramar, Vikendi, and Sanhok",
      status: "DISPATCHED"
    }
  ]);
  const [registerFormTournamentId, setRegisterFormTournamentId] = useState("");
  const [registerFormCaptainName, setRegisterFormCaptainName] = useState("Alex Thorne");
  const [registerFormTeamName, setRegisterFormTeamName] = useState("Crimson Vipers Alpha");
  const [registerFormCaptainPhone, setRegisterFormCaptainPhone] = useState("+44712345678");

  // TDM BRACKET BUILDER & SIMULATOR STATES
  const [tdmType, setTdmType] = useState<"4v4" | "2v2">("4v4");
  const [tdmMap, setTdmMap] = useState<string>("Warehouse");
  const [tdmWeaponPreset, setTdmWeaponPreset] = useState<string>("Assault Rifles (M4/Beryl)");
  const [tdmTeams, setTdmTeams] = useState<string[]>([
    "CV CRIMSON SQUAD",
    "TEAM LIQUID ACADEMY",
    "FAZE ROSTER RECRUITS",
    "ESL CHAMPIONS ACADEMY"
  ]);
  const [semi1Winner, setSemi1Winner] = useState<string | null>(null);
  const [semi2Winner, setSemi2Winner] = useState<string | null>(null);
  const [tdmChampion, setTdmChampion] = useState<string | null>(null);
  const [semi1Scores, setSemi1Scores] = useState<{ t1: number; t2: number }>({ t1: 0, t2: 0 });
  const [semi2Scores, setSemi2Scores] = useState<{ t1: number; t2: number }>({ t1: 0, t2: 0 });
  const [finalScores, setFinalScores] = useState<{ t1: number; t2: number }>({ t1: 0, t2: 0 });
  const [simulatingMatchId, setSimulatingMatchId] = useState<"semi1" | "semi2" | "final" | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  // CV Gaming interactive TDM specialist state expansions
  const [tdmCaptains, setTdmCaptains] = useState<string[]>(["Tinashe 'Slayer'", "Kudzai 'Alpha'", "Farai 'Raptor'", "Pride 'Lethal'"]);
  const [tdmKDs, setTdmKDs] = useState<string[]>(["1.85", "1.62", "1.45", "1.70"]);
  const [tdmWinRates, setTdmWinRates] = useState<string[]>(["72%", "64%", "58%", "68%"]);
  const [tdmPlaystyles, setTdmPlaystyles] = useState<string[]>(["Aggressive Rush", "Defensive Hold", "Tactical Flank", "Slayer Precision"]);
  
  // Tactical interactive Minimap coordinator for strategic holds
  const [tdmTacticalHolds, setTdmTacticalHolds] = useState<{ [teamIndex: number]: { x: number; y: number; label: string } }>({
    0: { x: 280, y: 340, label: "Elevated Crates Control" },
    1: { x: 720, y: 410, label: "Container L-Tunnel Choke" },
    2: { x: 490, y: 680, label: "High Catwalk Snipe Tower" },
    3: { x: 510, y: 220, label: "Main Alley Active Run" }
  });
  const [activeEditingTeamIndex, setActiveEditingTeamIndex] = useState<number | null>(null);

  // Predictions / Pick'em brackets dashboard
  const [predictedSemi1Winner, setPredictedSemi1Winner] = useState<string | null>(null);
  const [predictedSemi2Winner, setPredictedSemi2Winner] = useState<string | null>(null);
  const [predictedChampion, setPredictedChampion] = useState<string | null>(null);
  const [pickEmResultAlert, setPickEmResultAlert] = useState<string | null>(null);

  // Live Streaming States
  const [activeStreamerId, setActiveStreamerId] = useState("CV_Slayer_IGL");
  const [streamIsBuffering, setStreamIsBuffering] = useState(false);
  const [streamIsMuted, setStreamIsMuted] = useState(false);
  const [streamIsPlaying, setStreamIsPlaying] = useState(true);
  const [streamVolume, setStreamVolume] = useState(80);
  const [streamQuality, setStreamQuality] = useState("1080p60");
  const [streamChatInput, setStreamChatInput] = useState("");
  const [streamCameraView, setStreamCameraView] = useState("Player POV");
  const [streamChatMessages, setStreamChatMessages] = useState<{ [streamerId: string]: { id: string; author: string; message: string; timestamp: string; isUserAction?: boolean }[] }>({
    "CV_Slayer_IGL": [
      { id: "s1", author: "Fanatic_01", message: "IGL positioning is clean", timestamp: "13:21:00" },
      { id: "s2", author: "CV_Mamba_Flick", message: "Pristine smoke screens there boss!", timestamp: "13:21:30" },
      { id: "s3", author: "E_Sniper", message: "How is recoil control this solid?", timestamp: "13:22:00" }
    ],
    "CV_Mamba_Flick": [
      { id: "m1", author: "HeadshotKing", message: "That flick was illegal", timestamp: "13:20:00" },
      { id: "m2", author: "SniperBby", message: "Using the 8x scope like a red dot!", timestamp: "13:21:00" },
      { id: "m3", author: "CV_Slayer_IGL", message: "Cover me on the south hill mamba", timestamp: "13:21:40" }
    ],
    "CV_Shadow_Duo": [
      { id: "sd1", author: "BooyahGod", message: "Incredible rush gameplay on Peak!", timestamp: "13:20:00" },
      { id: "sd2", author: "GarenaFighter", message: "That Gloo Wall placement speed is insane", timestamp: "13:21:10" },
      { id: "sd3", author: "LiaFan", message: "Booyah loading soon!", timestamp: "13:21:55" }
    ],
    "CV_Alpha_Spectre": [
      { id: "as1", author: "TacticalVibe", message: "Best Anchor in S&D", timestamp: "13:19:00" },
      { id: "as2", author: "BombPlanter", message: "Nice grenade lineup", timestamp: "13:20:25" },
      { id: "as3", author: "CV_Tactical_Coach", message: "Stagger the site defense, hold B spawn", timestamp: "13:21:15" }
    ]
  });

  // Custom Tournament Form
  const [createTitle, setCreateTitle] = useState("");
  const [createType, setCreateType] = useState<"Solo" | "Duo" | "Squad">("Squad");
  const [createGame, setCreateGame] = useState<"PUBG Mobile">("PUBG Mobile");
  const [createPrize, setCreatePrize] = useState("10,000 CV Coins");
  const [createFee, setCreateFee] = useState("Free");

  // Custom Faction Base Config
  const [factionBase, setFactionBase] = useState({
    name: "Crimson Forge Citadel",
    shieldLevel: 1,
    scannerStatus: "Active Shield Grid",
    satelliteRotations: "Erangel Focus",
    powerGridLevel: 32
  });

  // Dynamic Role-Based Access Control Permissions State
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem("cv_role_permissions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse role permissions:", e);
      }
    }
    return {
      "Owner": {
        ownerDashboard: true,
        adminDashboard: true,
        permissionManager: true,
        tournamentManagement: true,
        scrimManagement: true,
        staffControls: true,
        securityControls: true,
        financialControls: true,
        databaseControls: true,
        systemControls: true,
        userManagement: true
      },
      "Head Admin": {
        ownerDashboard: false,
        adminDashboard: true,
        permissionManager: false,
        tournamentManagement: true,
        scrimManagement: true,
        staffControls: true,
        securityControls: true,
        financialControls: false,
        databaseControls: false,
        systemControls: true,
        userManagement: true
      },
      "Admin": {
        ownerDashboard: false,
        adminDashboard: true,
        permissionManager: false,
        tournamentManagement: true,
        scrimManagement: true,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: true
      },
      "Moderator": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Team Captain": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Squad Leader": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Verified Player": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Member": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Recruit": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Visitor": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      },
      "Guest": {
        ownerDashboard: false,
        adminDashboard: false,
        permissionManager: false,
        tournamentManagement: false,
        scrimManagement: false,
        staffControls: false,
        securityControls: false,
        financialControls: false,
        databaseControls: false,
        systemControls: false,
        userManagement: false
      }
    };
  });

  // Permissions Manager State
  const [permissions, setPermissions] = useState<{ [role: string]: string[] }>({
    "Owner": ["Team Hub", "Strategy Room", "Scrims", "Vault", "Recruitment", "Dashboard"],
    "Head Admin": ["Team Hub", "Strategy Room", "Scrims", "Vault", "Recruitment", "Dashboard"],
    "Admin": ["Team Hub", "Strategy Room", "Scrims", "Dashboard"],
    "Team Captain": ["Team Hub", "Strategy Room", "Scrims", "Vault"],
    "Member": ["Team Hub", "Strategy Room", "Scrims"],
    "Recruit": ["Team Hub"]
  });

  // Dynamic AI coach state
  const [coachIgn, setCoachIgn] = useState("CV_Slayer_IGL");
  const [coachGame, setCoachGame] = useState("PUBG Mobile");
  const [coachRank, setCoachRank] = useState("Elite");
  const [coachKills, setCoachKills] = useState("142");
  const [coachKd, setCoachKd] = useState("4.85");
  const [coachMatches, setCoachMatches] = useState("24");
  const [coachPlacement, setCoachPlacement] = useState("Top 5");
  const [coachDevice, setCoachDevice] = useState("iPad Pro");
  const [coachExtra, setCoachExtra] = useState("I need tactical advice on rotations around central Erangel Military Island.");
  const [coachAdvice, setCoachAdvice] = useState<string>("");
  const [coachLoading, setCoachLoading] = useState(false);

  // Anti cheat report form
  const [reportIgn, setReportIgn] = useState("");
  const [reportType, setReportType] = useState("ESP / Wallhack");
  const [reportUrl, setReportUrl] = useState("");

  // Simulated Live Match Scorecard Tracker
  const [matchTickerActive, setMatchTickerActive] = useState(false);
  const [tickerLog, setTickerLog] = useState<string[]>([]);
  const [scoreCycle, setScoreCycle] = useState(0);

  // Modern ticking timer for the esports tournament countdown timeline matching mockup aesthetics
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    // Counts down to exactly June 15, 2026 UTC, matching our esports season schedule
    const targetDate = new Date("2026-06-15T18:00:00Z").getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0")
      });
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Modals state for interactable login & signup
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [selectedSquadMemberProfile, setSelectedSquadMemberProfile] = useState<any | null>(null);
  
  // Dedicated CV Management Access System States
  const [isManagementPortalOpen, setIsManagementPortalOpen] = useState(false);
  const [isPlatformLocked, setIsPlatformLocked] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [adminActionsSuspended, setAdminActionsSuspended] = useState(false);

  // ROSTER HISTORY & AUDIT SYSTEM TYPES AND INTERACTIVE STATES
  const [isRosterHistoryModalOpen, setIsRosterHistoryModalOpen] = useState(false);
  const [rosterHistoryList, setRosterHistoryList] = useState<any[]>([
    {
      id: "RH-3809",
      timestamp: "2026-06-11 14:32 UTC",
      actionType: "ADD",
      playerIgn: "CV_Rex_Viper",
      playerName: "Rex Harrison",
      avatar: "🦖",
      newValue: "Assaulter / Roamer",
      captainIgn: "CV_Slayer_IGL",
      notes: "Acquired via mid-season transfer window from Zenith Gaming. Absolute powerhouse added."
    },
    {
      id: "RH-3805",
      timestamp: "2026-06-09 09:15 UTC",
      actionType: "ROLE_UPDATE",
      playerIgn: "CV_Slayer_IGL",
      playerName: "Tinashe 'Slayer'",
      avatar: "👑",
      oldValue: "Assaulter / Entry",
      newValue: "Team Captain & IGL",
      captainIgn: "CV_Tactical_Coach",
      notes: "Appointed as main strategist for squad leadership, coordination, and maps execution."
    },
    {
      id: "RH-3792",
      timestamp: "2026-06-05 18:40 UTC",
      actionType: "ADD",
      playerIgn: "CV_Storm_Snipe",
      playerName: "Alex Mercer",
      avatar: "🎯",
      newValue: "Main Roster Sniper",
      captainIgn: "CV_Slayer_IGL",
      notes: "Promoted from competitive league junior division. Incredible 4.85 bullet precision."
    },
    {
      id: "RH-3755",
      timestamp: "2026-06-01 11:20 UTC",
      actionType: "JERSEY_UPDATE",
      playerIgn: "CV_Valkyrie",
      playerName: "Sarah Jenkins",
      avatar: "⚔️",
      oldValue: "Jersey #17",
      newValue: "Jersey #44",
      captainIgn: "CV_Slayer_IGL",
      notes: "Jersey number reassignment approved to honor previous team franchise legend."
    },
    {
      id: "RH-3691",
      timestamp: "2026-05-28 16:15 UTC",
      actionType: "ROLE_UPDATE",
      playerIgn: "CV_Ghost_07",
      playerName: "Marcus Vance",
      avatar: "👻",
      oldValue: "Tactical Scout",
      newValue: "Lead Strategist & Scout",
      captainIgn: "CV_Slayer_IGL",
      notes: "Promoted to primary point operator for elite tier rotation management."
    },
    {
      id: "RH-3642",
      timestamp: "2026-05-20 10:05 UTC",
      actionType: "REMOVE",
      playerIgn: "CV_Blaze_Ex",
      playerName: "Kyle Broflovski",
      avatar: "🔥",
      oldValue: "Reserve Sub / Frag",
      captainIgn: "CV_Tactical_Coach",
      notes: "Mutually terminated contract. Transferred list to free agency pool."
    }
  ]);

  // Simulation parameters for active user roster action logs
  const [simRosterActionType, setSimRosterActionType] = useState<"ADD" | "REMOVE" | "ROLE_UPDATE" | "JERSEY_UPDATE">("ADD");
  const [simRosterPlayerIgn, setSimRosterPlayerIgn] = useState("");
  const [simRosterPlayerName, setSimRosterPlayerName] = useState("");
  const [simRosterAvatar, setSimRosterAvatar] = useState("🦊");
  const [simRosterOldValue, setSimRosterOldValue] = useState("");
  const [simRosterNewValue, setSimRosterNewValue] = useState("");
  const [simRosterCaptain, setSimRosterCaptain] = useState("CV_Slayer_IGL");
  const [simRosterNotes, setSimRosterNotes] = useState("");
  const [rosterHistorySearch, setRosterHistorySearch] = useState("");
  const [rosterHistorySpecificSearch, setRosterHistorySpecificSearch] = useState("");
  const [rosterHistoryFilter, setRosterHistoryFilter] = useState("ALL");

  const [signUpIgn, setSignUpIgn] = useState("");
  const [signUpGame, setSignUpGame] = useState("PUBG Mobile");
  const [signUpDevice, setSignUpDevice] = useState("iPhone 15 Pro");

  // Leaderboards Search and Filter States
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState("All Games");

  // TDM Arena and WOW Creator Section States
  const [tdmSimulatorActive, setTdmSimulatorActive] = useState(false);
  const [scanDuration, setScanDuration] = useState(5); // horizontal scan duration in seconds
  const [tdmUserScore, setTdmUserScore] = useState(0);
  const [tdmEnemyScore, setTdmEnemyScore] = useState(0);
  const [tdmWeapon, setTdmWeapon] = useState("M416");
  const [tdmStrategy, setTdmStrategy] = useState("Aggressive Rush");

  // Detailed TDM loadout states
  const [tdmSecondary, setTdmSecondary] = useState("Desert Eagle Heavy");
  const [tdmScope, setTdmScope] = useState("Red Dot Sight");
  const [tdmMuzzle, setTdmMuzzle] = useState("Muzzle Compensator");
  const [tdmMagazine, setTdmMagazine] = useState("Extended Quickdraw Mag");
  const [tdmGrip, setTdmGrip] = useState("Vertical Foregrip");
  const [tdmTactical, setTdmTactical] = useState("Frag Grenade");
  const [copiedLoadout, setCopiedLoadout] = useState(false);
  const [loadoutInputCode, setLoadoutInputCode] = useState("");
  const [matchOpponent, setMatchOpponent] = useState("Team Liquid Academy");

  // Simulated Telemetry Hardware Error Engine
  const [telemetryErrors, setTelemetryErrors] = useState<{
    id: string;
    timestamp: string;
    code: string;
    severity: "WARNING" | "CRITICAL" | "DIAGNOSTIC_TRIGGER";
    message: string;
  }[]>([]);

  const [telemetryHistory, setTelemetryHistory] = useState<string[]>([]);

  const errorScrollRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (errorScrollRef.current) {
      errorScrollRef.current.scrollTop = errorScrollRef.current.scrollHeight;
    }
  }, [telemetryErrors, telemetryHistory]);

  useEffect(() => {
    const isScannerActive = tdmSimulatorActive || !(!simulatingMatchId);
    if (!isScannerActive) {
      setTelemetryErrors([]);
      setTelemetryHistory([]);
      return;
    }

    const errorPool = [
      { code: "E_SYNC_FAIL_0x04", severity: "CRITICAL" as const, message: "Host clock drift exceeds 11ms jitter envelope threshold." },
      { code: "PWR_VOLT_UNSTABLE", severity: "WARNING" as const, message: "Telemetry bus power rail dipped to 11.2V. Harmonic distortion detected." },
      { code: "LOBBY_OVERFLOW_0x1E", severity: "CRITICAL" as const, message: "Express gateway connection flooded by concurrent socket requests." },
      { code: "SIGNAL_REFRACTION_WARN", severity: "WARNING" as const, message: "Multi-path interference refraction detected on Sector Delta." },
      { code: "REPLICATOR_OUT_OF_SYNC", severity: "CRITICAL" as const, message: "Matrix state replicator mismatched on sequence frame #819A2." },
      { code: "AES_DECRYPTION_LATENCY", severity: "WARNING" as const, message: "AES-255 hardware processing latency spiked above 18ms." },
      { code: "GPS_COORDINATE_DRIFT", severity: "WARNING" as const, message: "Satellite spatial grounding telemetry reported 0.45m horizontal drift." },
      { code: "MATRIX_NODE_TEMP_HIGH", severity: "CRITICAL" as const, message: "Receiver mainboard junction exceeds safe thermal envelope." },
      { code: "SPECS_OVERLAY_LAG", severity: "WARNING" as const, message: "Viewport presenter overlay dropped 3 buffer frames." },
      { code: "E_BUS_TIMEOUT_0x12", severity: "CRITICAL" as const, message: "SPI peripheral line timeout during system register handshake." },
      { code: "E_PACKET_LOSS_0x2B", severity: "WARNING" as const, message: "Lobby route is dropping frames over virtual ethernet network." },
      { code: "E_GRID_FREQ_DRIFT", severity: "WARNING" as const, message: "Sonar timing generator drift offset: +0.28 milliseconds." }
    ];

    // Seed initial hardware diagnostic error codes immediately for direct user visibility
    const initialErrors = Array.from({ length: 2 }).map((_, idx) => {
      const randomErr = errorPool[Math.floor(Math.random() * errorPool.length)];
      const now = new Date(Date.now() - (2000 - idx * 1000));
      const timeStr = now.toTimeString().split(" ")[0];
      return {
        id: `err_init_${idx}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: timeStr,
        ...randomErr
      };
    });
    setTelemetryErrors(initialErrors);

    // Initial history strings
    const initialHistory = initialErrors.map(err => `${err.timestamp} | ${err.severity} | ${err.code} | ${err.message}`);
    setTelemetryHistory(initialHistory);

    // Regular generic bus/hardware log interval
    const interval = setInterval(() => {
      const randomErr = errorPool[Math.floor(Math.random() * errorPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const uniqueId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

      setTelemetryErrors(prev => {
        const updated = [...prev, {
          id: uniqueId,
          timestamp: timeStr,
          ...randomErr
        }];
        if (updated.length > 50) {
          return updated.slice(updated.length - 50);
        }
        return updated;
      });

      // Appending diagnostic strings to the telemetryHistory log array
      const diagnosticStr = `${timeStr} | ${randomErr.severity} | ${randomErr.code} | ${randomErr.message}`;
      setTelemetryHistory(prev => {
        const updated = [...prev, diagnosticStr];
        if (updated.length > 50) {
          return updated.slice(updated.length - 50);
        }
        return updated;
      });
    }, 1200);

    // 📡 RADAR EVENT 1: Horizontal sweep completes every `scanDuration` seconds
    const horizontalInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const uniqueId = `h_sweep_${Date.now()}`;
      const code = "RADAR_SWEEP_COMPLETE";
      const message = `Horizontal beam completed 360° raster sweep. Scan rate stabilized at ${(11 - scanDuration).toFixed(1)} Hz. Vector coordinates cleared.`;

      setTelemetryErrors(prev => {
        const updated = [...prev, {
          id: uniqueId,
          timestamp: timeStr,
          code,
          severity: "DIAGNOSTIC_TRIGGER" as const,
          message
        }];
        return updated.slice(-50);
      });
      setTelemetryHistory(prev => {
        const updated = [...prev, `${timeStr} | DIAGNOSTIC_TRIGGER | ${code} | ${message}`];
        return updated.slice(-50);
      });
    }, scanDuration * 1000);

    // 📡 RADAR EVENT 2: Vertical raster sweep completed every 4 seconds
    const verticalInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const uniqueId = `v_sweep_${Date.now()}`;
      const code = "VERTICAL_SCAN_COMPLETE";
      const message = `Vertical HUD phosphor sweep completed across Sectors A & B. Match telemetry stream frame synchronized.`;

      setTelemetryErrors(prev => {
        const updated = [...prev, {
          id: uniqueId,
          timestamp: timeStr,
          code,
          severity: "DIAGNOSTIC_TRIGGER" as const,
          message
        }];
        return updated.slice(-50);
      });
      setTelemetryHistory(prev => {
        const updated = [...prev, `${timeStr} | DIAGNOSTIC_TRIGGER | ${code} | ${message}`];
        return updated.slice(-50);
      });
    }, 4000);

    // 📡 RADAR EVENT 3: Random target blip ping logs
    const targetMessages = [
      "Target blip acquired in Sector Delta. Coordinate Lock: AZ-142.6° / EL-12.87°.",
      "Primary magnetron fired. Carrier pulse frequency locked at 9.4 GHz with low dispersion.",
      "High-energy echo returned. Multipath radar refraction corrected automatically.",
      "Secure transceiver beacon registered. Faction identity confirmed on current arena grid."
    ];
    const blipInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const uniqueId = `blip_${Date.now()}`;
      const code = "TARGET_BLIP_PING";
      const message = targetMessages[Math.floor(Math.random() * targetMessages.length)];

      setTelemetryErrors(prev => {
        const updated = [...prev, {
          id: uniqueId,
          timestamp: timeStr,
          code,
          severity: "DIAGNOSTIC_TRIGGER" as const,
          message
        }];
        return updated.slice(-50);
      });
      setTelemetryHistory(prev => {
        const updated = [...prev, `${timeStr} | DIAGNOSTIC_TRIGGER | ${code} | ${message}`];
        return updated.slice(-50);
      });
    }, 2800);

    return () => {
      clearInterval(interval);
      clearInterval(horizontalInterval);
      clearInterval(verticalInterval);
      clearInterval(blipInterval);
    };
  }, [tdmSimulatorActive, simulatingMatchId, scanDuration]);

  const generateLoadoutCode = () => {
    const primaryMap: { [key: string]: string } = {
      "M416 Tracer Spray": "M416",
      "Groza CQB Shredder": "GROZ",
      "AWM Absolute One-Tap": "AWM",
      "UMP45 Laser Beam": "UMP4",
      "M16A4 Burst Trigger": "M16",
      "M416": "M416"
    };
    const secondaryMap: { [key: string]: string } = {
      "Desert Eagle Heavy": "DE",
      "Scorpion Auto-Pistol": "SCORP",
      "P18C Full-Auto": "P18C",
      "None": "NONE"
    };
    const scopeMap: { [key: string]: string } = {
      "Iron Sights": "IRON",
      "Red Dot Sight": "RED",
      "3x Backlit Optic": "3X",
      "4x ACOG Scope": "4X",
      "6x Tactical Scope": "6X"
    };
    const muzzleMap: { [key: string]: string } = {
      "None/Default": "DEF",
      "Muzzle Compensator": "COMP",
      "Viper Suppressor": "SUPP",
      "Flash Hider": "HIDE"
    };
    const magazineMap: { [key: string]: string } = {
      "Standard Mag": "STD",
      "Extended Mag": "EXT",
      "Extended Quickdraw Mag": "EXQ"
    };
    const gripMap: { [key: string]: string } = {
      "None/Default": "NONE",
      "Vertical Foregrip": "VERT",
      "Angled Foregrip": "ANGL",
      "Half Grip": "HALF",
      "Laser Sight": "LAZR"
    };
    const tacticalMap: { [key: string]: string } = {
      "Frag Grenade": "FRAG",
      "Smoke Grenade": "SMOK",
      "Stun Flashbang": "STUN",
      "Molotov Cocktail": "MOLO"
    };

    const p = primaryMap[tdmWeapon] || "M416";
    const s = secondaryMap[tdmSecondary] || "DE";
    const sc = scopeMap[tdmScope] || "RED";
    const m = muzzleMap[tdmMuzzle] || "COMP";
    const mg = magazineMap[tdmMagazine] || "EXQ";
    const g = gripMap[tdmGrip] || "VERT";
    const t = tacticalMap[tdmTactical] || "FRAG";

    return `CV-TDM-${p}-${s}-${sc}-${m}-${mg}-${g}-${t}`;
  };

  const handleCopyLoadoutCode = () => {
    const code = generateLoadoutCode();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedLoadout(true);
      setSystemAlertMessage(`📋 Loadout code copied: ${code}`);
      setTimeout(() => setCopiedLoadout(false), 2000);
    }).catch(() => {
      setSystemAlertMessage(`❌ Failed to copy loadout code automatically`);
    });
  };

  const handleImportLoadoutCode = (codeStr: string) => {
    if (!codeStr) return;
    const cleanCode = codeStr.trim().toUpperCase();
    if (!cleanCode.startsWith("CV-TDM-")) {
      setSystemAlertMessage("❌ Invalid loadout code pattern! Format must start with CV-TDM-...");
      return;
    }
    const parts = cleanCode.split("-");
    if (parts.length < 9) {
      setSystemAlertMessage("❌ Incomplete loadout code string.");
      return;
    }

    const [, , p, s, sc, m, mg, g, t] = parts;

    const primaryReverse: { [key: string]: string } = {
      "M416": "M416 Tracer Spray",
      "GROZ": "Groza CQB Shredder",
      "AWM": "AWM Absolute One-Tap",
      "UMP4": "UMP45 Laser Beam",
      "M16": "M16A4 Burst Trigger"
    };
    const secondaryReverse: { [key: string]: string } = {
      "DE": "Desert Eagle Heavy",
      "SCORP": "Scorpion Auto-Pistol",
      "P18C": "P18C Full-Auto",
      "NONE": "None"
    };
    const scopeReverse: { [key: string]: string } = {
      "IRON": "Iron Sights",
      "RED": "Red Dot Sight",
      "3X": "3x Backlit Optic",
      "4X": "4x ACOG Scope",
      "6X": "6x Tactical Scope"
    };
    const muzzleReverse: { [key: string]: string } = {
      "DEF": "None/Default",
      "COMP": "Muzzle Compensator",
      "SUPP": "Viper Suppressor",
      "HIDE": "Flash Hider"
    };
    const magazineReverse: { [key: string]: string } = {
      "STD": "Standard Mag",
      "EXT": "Extended Mag",
      "EXQ": "Extended Quickdraw Mag"
    };
    const gripReverse: { [key: string]: string } = {
      "NONE": "None/Default",
      "VERT": "Vertical Foregrip",
      "ANGL": "Angled Foregrip",
      "HALF": "Half Grip",
      "LAZR": "Laser Sight"
    };
    const tacticalReverse: { [key: string]: string } = {
      "FRAG": "Frag Grenade",
      "SMOK": "Smoke Grenade",
      "STUN": "Stun Flashbang",
      "MOLO": "Molotov Cocktail"
    };

    if (primaryReverse[p]) setTdmWeapon(primaryReverse[p]);
    if (secondaryReverse[s]) setTdmSecondary(secondaryReverse[s]);
    if (scopeReverse[sc]) setTdmScope(scopeReverse[sc]);
    if (muzzleReverse[m]) setTdmMuzzle(muzzleReverse[m]);
    if (magazineReverse[mg]) setTdmMagazine(magazineReverse[mg]);
    if (gripReverse[g]) setTdmGrip(gripReverse[g]);
    if (tacticalReverse[t]) setTdmTactical(tacticalReverse[t]);

    setSystemAlertMessage(`📥 TDM Loadout successfully imported: ${parts[2]} Loaded!`);
    setLoadoutInputCode("");
  };

  const [tdmLogs, setTdmLogs] = useState<string[]>([
    "🎯 CV TDM Lobby created. Select loadout and strategies to launch the simulation core.",
    "📢 System ready. Target score: 40 points."
  ]);
  const [tdmHistory, setTdmHistory] = useState<any[]>([
    { id: "tdm1", date: "June 03, 2026", weapon: "M416 + M24", opponent: "Hydra Avengers", score: "40 - 32", result: "Victory", mvp: "CV_Slayer_IGL" },
    { id: "tdm2", date: "June 02, 2026", weapon: "Groza + UMP45", opponent: "Viper Squad Intel", score: "40 - 38", result: "Victory", mvp: "CV_Mamba_Flick" },
    { id: "tdm3", date: "May 31, 2026", weapon: "AWM", opponent: "Apex Predators", score: "36 - 40", result: "Defeat", mvp: "Apex_Ghost_IGL" }
  ]);

  // NEW TDM CUSTOM STATE EXTENSIONS
  const [tdmChartData, setTdmChartData] = useState<{ tick: number; CrimsonVipers: number; Opponent: number }[]>([
    { tick: 0, CrimsonVipers: 0, Opponent: 0 },
    { tick: 1, CrimsonVipers: 2, Opponent: 1 },
    { tick: 2, CrimsonVipers: 3, Opponent: 4 },
    { tick: 3, CrimsonVipers: 5, Opponent: 6 },
    { tick: 4, CrimsonVipers: 5, Opponent: 10 },
    { tick: 5, CrimsonVipers: 8, Opponent: 12 },
    { tick: 6, CrimsonVipers: 12, Opponent: 13 },
    { tick: 7, CrimsonVipers: 15, Opponent: 15 },
    { tick: 8, CrimsonVipers: 18, Opponent: 16 },
    { tick: 9, CrimsonVipers: 20, Opponent: 22 },
    { tick: 10, CrimsonVipers: 24, Opponent: 23 },
    { tick: 11, CrimsonVipers: 26, Opponent: 28 },
    { tick: 12, CrimsonVipers: 30, Opponent: 31 },
    { tick: 13, CrimsonVipers: 33, Opponent: 35 },
    { tick: 14, CrimsonVipers: 37, Opponent: 35 },
    { tick: 15, CrimsonVipers: 40, Opponent: 38 }
  ]);

  const [isTdmReplaying, setIsTdmReplaying] = useState<boolean>(false);
  const [tdmReplayTick, setTdmReplayTick] = useState<number>(0);
  const [tdmReplayHighlights, setTdmReplayHighlights] = useState<{
    tick: number;
    type: "lead_change" | "clutch" | "vipers_run" | "opponent_run" | "draw";
    description: string;
    score: string;
  }[]>([]);
  const [tdmReplaySpeed, setTdmReplaySpeed] = useState<number>(400); // Speed: slow play in ms
  const [tdmReplayIsPaused, setTdmReplayIsPaused] = useState<boolean>(true);

  // COMBAT DOSSIER & MANIFEST MATRIX
  const [selectedDossierPlayer, setSelectedDossierPlayer] = useState<any | null>(null);
  const [tdmAutoQueue, setTdmAutoQueue] = useState<boolean>(true);
  const [selectedContinent, setSelectedContinent] = useState<string>("North America");
  const [manualOpponent, setManualOpponent] = useState<string>("Apex Predators");
  const [isAutoQueueSearching, setIsAutoQueueSearching] = useState<boolean>(false);
  const [matchmakerStep, setMatchmakerStep] = useState<number>(0); // 0: inactive, 1: scanning, 2: compiling, 3: acquired
  const [selfReportOpponent, setSelfReportOpponent] = useState<string>("Apex_Ghost_IGL");
  const [selfReportResult, setSelfReportResult] = useState<string>("Win");
  const [selfReportWeapon, setSelfReportWeapon] = useState<string>("M416");
  const [selfReportYourScore, setSelfReportYourScore] = useState<number>(40);
  const [selfReportOpponentScore, setSelfReportOpponentScore] = useState<number>(32);

  const [tdmLadder, setTdmLadder] = useState<any[]>([
    { rank: 1, ign: "CV_Slayer_IGL", points: 2450, tier: "Grandmaster", wins: 42, losses: 10, draws: 5 },
    { rank: 2, ign: "CV_Mamba_Flick", points: 2310, tier: "Grandmaster", wins: 38, losses: 12, draws: 6 },
    { rank: 3, ign: "Apex_Ghost_IGL", points: 2100, tier: "Master", wins: 30, losses: 15, draws: 8 },
    { rank: 4, ign: "ViperShoot_PRO", points: 1950, tier: "Master", wins: 26, losses: 14, draws: 11 },
    { rank: 5, ign: "Hydra_Avenger_1", points: 1780, tier: "Diamond", wins: 22, losses: 18, draws: 4 },
    { rank: 6, ign: "You (Crimson Vipers)", points: 1500, tier: "Platinum", wins: 15, losses: 15, draws: 2 }
  ]);

  // GLOBAL CLAN CHAT STATE & SIMULATION MODULE
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatUnreadCount, setChatUnreadCount] = useState<number>(3); // Initial count to let the user see the system in action on load
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: "m1",
      sender: "CV_Specter",
      role: "Member",
      text: "Who is up for some PUBG Erangel custom squad scrims tonight? Need a reliable secondary fragger.",
      time: "07:15 AM",
      channel: "general"
    },
    {
      id: "m2",
      sender: "Liquid_Ace_99",
      role: "Member",
      text: "The new TDM tournament builder is absolute gas 🔥 tested the 4v4 simulation and seeds work flawlessly.",
      time: "07:18 AM",
      channel: "general"
    },
    {
      id: "m3",
      sender: "ESL_Admin",
      role: "Team Captain",
      text: "Reminder: Sector eligibility relies on playing at least 5 scrim match sessions this week. Keep grinding!",
      time: "07:22 AM",
      channel: "general"
    },
    {
      id: "m4",
      sender: "CV_Slayer_IGL",
      role: "Owner",
      text: "Team, for the CV Solo PUBG Mobile Showdown we are employing strict high-ground rotations. Do not push blind.",
      time: "07:02 AM",
      channel: "team"
    },
    {
      id: "m5",
      sender: "CV_Viper_Sniper",
      role: "Team Captain",
      text: "Understood. I will hold the vertical hangar angles with M24 precision. Apex holds the low flank.",
      time: "07:05 AM",
      channel: "team"
    },
    {
      id: "m6",
      sender: "CV_Apex_Rusher",
      role: "Member",
      text: "Loadouts calibrated to 5.56 assault rifles. Ready to clear containment rows. Let's secure the crown.",
      time: "07:11 AM",
      channel: "team"
    }
  ]);

  useEffect(() => {
    // Dynamic real-time clan message stream simulation
    const messagePool = [
      { sender: "CV_Mamba_Flick", role: "Team Captain", text: "Yo! Just noticed we are seeded against Hydra Avengers on the new tourney map! Let's prep.", channel: "general" },
      { sender: "CV_Slayer_IGL", role: "Owner", text: "Vipers squad Assemble! Practice session starts soon. Double check your weapon presets.", channel: "team" },
      { sender: "Liquid_Ace_99", role: "Member", text: "Did everyone review the map drop pins? Sector row 4 has high ground safety.", channel: "general" },
      { sender: "CV_Specter", role: "Member", text: "Tactical landing zone preset saved. Load it on the strategy board.", channel: "team" },
      { sender: "ESL_Admin", role: "Team Captain", text: "Be sure to double check rules! No tactical gadgets allowed on Miramar.", channel: "general" },
      { sender: "CV_Apex_Rusher", role: "Member", text: "My sniper calibration hits 100% precision. Let's conquer the lobby!", channel: "general" },
      { sender: "ViperShoot_PRO", role: "Member", text: "Check out my new clutch highlight stream in the media room. Absolutely mental!", channel: "general" }
    ];

    const chatInterval = setInterval(() => {
      const randomMsg = messagePool[Math.floor(Math.random() * messagePool.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMsg: ChatMsg = {
        id: "bg_msg_" + Date.now(),
        sender: randomMsg.sender,
        role: randomMsg.role,
        text: randomMsg.text,
        time: timestamp,
        channel: randomMsg.channel as "general" | "team"
      };

      setChatMessages(prev => [...prev, newMsg]);

      // Trigger notification unread increment if closed OR if active tab of the app is not the chat
      if (!isChatOpen || activeTab !== "clanchat") {
        setChatUnreadCount(prev => prev + 1);
        setSystemAlertMessage(`💬 Real-Time Intercom: New message received from ${randomMsg.sender}!`);
      }
    }, 18000);

    return () => clearInterval(chatInterval);
  }, [isChatOpen, activeTab]);

  const [tdmVerificationQueue, setTdmVerificationQueue] = useState<any[]>([
    { id: "vr-1", challenger: "You (Crimson Vipers)", opponent: "Apex_Ghost_IGL", pointsDelta: 50, result: "Win", proof: "PROOF-TDM-8452-SUCCESS", date: "Just now", status: "Pending" },
    { id: "vr-2", challenger: "CV_Slayer_IGL", opponent: "ViperShoot_PRO", pointsDelta: -30, result: "Loss", proof: "PROOF-TDM-1903-FAILED", date: "10 mins ago", status: "Pending" },
    { id: "vr-3", challenger: "CV_Mamba_Flick", opponent: "Hydra_Avenger_1", pointsDelta: 0, result: "Draw", proof: "PROOF-TDM-0021-DRAW", date: "30 mins ago", status: "Pending" }
  ]);

  // Competitive Auto-Refresh / Real-time Sync state
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState<number>(30);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (!autoRefreshEnabled) {
      return;
    }

    const interval = setInterval(() => {
      setAutoRefreshCountdown(prev => {
        if (prev <= 1) {
          // Trigger the state sync mechanism!
          setIsSyncing(true);
          
          // 1. Advance scoreCycle to trigger visual leaderboard refresh
          setScoreCycle(sc => sc + 1);

          // 2. Generate and prepend a random verification log entry to represent incoming real-time submission data
          const poolChallengers = ["CV_Slayer_IGL", "CV_Mamba_Flick", "ViperShoot_PRO", "Apex_Ghost_IGL", "Hydra_Avenger_1"];
          const poolOpponents = ["ZIM_Ghost_07", "Viper_Alpha_01", "CV_Lethal_Pride", "ZIM_Warrior_X"];
          const poolWeapons = ["M416 + M24", "Groza + UMP45", "AWM sniper"];
          const poolResults = ["Win", "Loss", "Draw"];
          
          const randChallenger = poolChallengers[Math.floor(Math.random() * poolChallengers.length)];
          const randOpponent = poolOpponents[Math.floor(Math.random() * poolOpponents.length)];
          const randResult = poolResults[Math.floor(Math.random() * poolResults.length)];
          const randWeapon = poolWeapons[Math.floor(Math.random() * poolWeapons.length)];
          
          const ptsDelta = randResult === "Win" ? 50 : randResult === "Loss" ? -30 : 0;
          const randomProofId = `PROOF-TDM-${Math.floor(1000 + Math.random() * 9000)}-AUTO`;

          const newVerifyItem = {
            id: `vr-auto-${Date.now()}`,
            challenger: randChallenger,
            opponent: randOpponent,
            pointsDelta: ptsDelta,
            result: randResult,
            proof: randomProofId,
            date: "Just now",
            status: "Pending",
            weapon: randWeapon
          };

          setTdmVerificationQueue(prev => [newVerifyItem, ...prev.slice(0, 9)]);

          // 3. Randomly update non-player scores in TDM ladder to simulate active matches completing
          setTdmLadder(prev => {
            const updated = prev.map(p => {
              if (p.ign !== "You (Crimson Vipers)" && Math.random() > 0.4) {
                const ptDelta = (Math.random() > 0.5 ? 1 : -1) * 10;
                const nextPoints = Math.max(1000, p.points + ptDelta);
                const nextTier = nextPoints >= 2200 ? "Grandmaster" : nextPoints >= 1800 ? "Master" : nextPoints >= 1500 ? "Platinum" : "Gold";
                return {
                  ...p,
                  points: nextPoints,
                  tier: nextTier
                };
              }
              return p;
            });
            // Re-sort based on points descending
            return updated.sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));
          });

          // 4. Trigger alert
          setSystemAlertMessage(`🔄 [AUTO-REFRESH] Pull complete! Retrieved 1 new TDM verified log and recalibrated leaderboards from server database.`);
          
          // 5. Remove syncing state after 1 second
          setTimeout(() => {
            setIsSyncing(false);
          }, 1000);

          return 30; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  const [tdmTourneyPlayers, setTdmTourneyPlayers] = useState<string[]>([
    "CV_Slayer_IGL", "CV_Mamba_Flick", "You (Crimson Vipers)", "ViperShoot_PRO",
    "Apex_Ghost_IGL", "Hydra_Avenger_1", "Liquid_Academy_X", "Faze_Recruit_9"
  ]);
  const [newTourneyPlayerName, setNewTourneyPlayerName] = useState("");
  const [tdmTourneyWinner, setTdmTourneyWinner] = useState<string | null>(null);
  const [isTourneySimulating, setIsTourneySimulating] = useState<boolean>(false);

  // WOW (World of Wonder) States
  const [searchWowCode, setSearchWowCode] = useState("");
  const [newWowName, setNewWowName] = useState("");
  const [newWowMode, setNewWowMode] = useState("Parkour Speedrun");
  const [newWowBiome, setNewWowBiome] = useState("Erangel Grasslands");
  const [newWowMaxPlayers, setNewWowMaxPlayers] = useState(16);
  const [newWowDescription, setNewWowDescription] = useState("");
  const [wowPublishedMaps, setWowPublishedMaps] = useState<any[]>([
    { id: "wow1", code: "812-304-102", title: "Cyber Pochinki Gym Parkour", creator: "CV_Slayer_IGL", downloads: 14205, plays: 28540, rating: "94%", biome: "Erangel Grasslands", desc: "Climb over neon-lit platforms and cargo boxes suspended over the classic Pochinki landscape.", isArchived: false },
    { id: "wow2", code: "519-204-620", title: "Ultimate Kar98 Snipping Ridges", creator: "CV_Mamba_Flick", downloads: 8520, plays: 16430, rating: "88%", biome: "Desert Ruins", desc: "An immersive high-altitude sniper shootout set among Miramar canyons with heavy wind simulations.", isArchived: false },
    { id: "wow3", code: "301-925-114", title: "Warehouse 1v1 Duel Arena", creator: "CV_Tactical_Coach", downloads: 22010, plays: 44020, rating: "97%", biome: "Industrial Area", desc: "Symmetrical arena structured with container walls specifically calibrated for competitive 1v1 M416 spray practices.", isArchived: false }
  ]);
  const [wowMapToManage, setWowMapToManage] = useState<any | null>(null);
  const [wowManageAction, setWowManageAction] = useState<"delete" | "archive" | null>(null);
  const [wowShowArchived, setWowShowArchived] = useState<boolean>(false);
  const [wowConfirmChecked, setWowConfirmChecked] = useState<boolean>(false);

  // Helper function to simulate live matches
  useEffect(() => {
    let interval: any;
    if (matchTickerActive) {
      interval = setInterval(() => {
        setScoreCycle(prev => prev + 1);
        const events = [
          "🔥 CV_Slayer_IGL secured an epic double kill on Mil-Island Bridge!",
          "🛡️ ViperShoot is holding defensive block on Erangel Ridge Sector Gamma.",
          "⚡ Tactical zone shrinking in 15 seconds. High rotation urgency!",
          "💥 CV_Mamba_Flick dropped 2 squad fighters with a flawless 400m AWM shot!",
          "👑 CV_Shadow_Duo is dominating Pochinki High Ground with tactical rotation.",
          "🏆 Live Standings updated! CV eSports currently holds 1st rank with 58 accumulated points."
        ];
        const nextEvent = events[Math.floor(Math.random() * events.length)];
        setTickerLog(prev => [nextEvent, ...prev.slice(0, 5)]);

        // Award dynamic XP when match ticker is running
        awardXp(15);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [matchTickerActive]);

  // Dynamic simulated streaming chat generator
  useEffect(() => {
    const gamerNames = ["ProShooter", "CV_Fan_Boy", "LegitMatrix", "HyperActive", "ZoneSurfer", "GlooManiac", "DeltaSquad", "SniperGf", "ViperScythe", "Apex_Legend", "Tactical_Kid", "CoDM_Pro"];
    const commentsList = [
      "Wait, did you see that?!",
      "Absolutely mental aim!",
      "CV represents perfectly!",
      "Sheesh that split-second decision was amazing!",
      "Is that on 120 FPS ipad?",
      "Can we play together next week?",
      "Pristine visual angle!",
      "Let's goooo!",
      "Booyah on the horizon!",
      "Can you show your weapon settings?",
      "That wall-bang was clean as heck!",
      "Double kill clutched!",
      "Is the coach watching this performance?",
      "Unbelievable recovery!",
      "Stream lag solved?",
      "What is your current K/D?",
      "Love the stream vibes!"
    ];

    const chatInterval = setInterval(() => {
      const streamerIds = ["CV_Slayer_IGL", "CV_Mamba_Flick", "CV_Shadow_Duo", "CV_Alpha_Spectre"];
      const targetStreamer = streamerIds[Math.floor(Math.random() * streamerIds.length)];

      const randomAuthor = gamerNames[Math.floor(Math.random() * gamerNames.length)];
      const randomMsg = commentsList[Math.floor(Math.random() * commentsList.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5); // hh:mm format

      setStreamChatMessages(prev => {
        const existingMessages = prev[targetStreamer] || [];
        const newMessage = {
          id: "sim_" + Date.now(),
          author: randomAuthor,
          message: randomMsg,
          timestamp: timeStr
        };
        return {
          ...prev,
          [targetStreamer]: [...existingMessages, newMessage].slice(-20)
        };
      });
    }, 6000);

    return () => clearInterval(chatInterval);
  }, []);

  // Award Battle Pass XP and handle scaling level-up feedback
  const awardXp = (amount: number) => {
    setSession(prev => {
      let currentXp = prev.battlePassXp + amount;
      let currentLevel = prev.battlePassLevel;
      let currentCoins = prev.coins;
      if (currentXp >= 200) {
        currentXp = currentXp - 200;
        currentLevel += 1;
        currentCoins += 300; // Reward free CV Coins on level up!
        setSystemAlertMessage(`🎉 LEVEL UP! You reached Battle Pass Level ${currentLevel} and earned +300 CV Coins!`);
      }
      return {
        ...prev,
        battlePassXp: currentXp,
        battlePassLevel: currentLevel,
        coins: currentCoins
      };
    });
  };

  // Add CV Coins to session dynamically
  const addCoins = (amount: number) => {
    setSession(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  // Flip Player Card Handler
  const togglePlayerCardFlip = (ign: string) => {
    if (isFlippedPlayerIds.includes(ign)) {
      setIsFlippedPlayerIds(isFlippedPlayerIds.filter(id => id !== ign));
    } else {
      setIsFlippedPlayerIds([...isFlippedPlayerIds, ign]);
    }
    awardXp(5);
  };

  const renderPostThumbnail = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const match = content.match(urlRegex);
    if (!match) return null;

    const url = match[0];
    const lowerUrl = url.toLowerCase();
    const isImage = 
      lowerUrl.endsWith(".png") || 
      lowerUrl.endsWith(".jpg") || 
      lowerUrl.endsWith(".jpeg") || 
      lowerUrl.endsWith(".webp") || 
      lowerUrl.endsWith(".gif") ||
      lowerUrl.includes("images.unsplash.com") ||
      lowerUrl.includes("screenshot") ||
      lowerUrl.includes("img") ||
      lowerUrl.includes("photo-") ||
      lowerUrl.includes("map") ||
      lowerUrl.includes("drive.google.com");

    // Detect if content mentions a standard map
    const lowerContent = content.toLowerCase();
    let mapAsset: { name: string; path: string } | null = null;
    if (lowerContent.includes("erangel") || lowerUrl.includes("erangel")) {
      mapAsset = { name: "Erangel Tactical Map Preview", path: "/src/assets/images/erangel_tactical_map_1781523653970.jpg" };
    } else if (lowerContent.includes("miramar") || lowerUrl.includes("miramar")) {
      mapAsset = { name: "Miramar Tactical Map Preview", path: "/src/assets/images/miramar_tactical_map_1781523668860.jpg" };
    } else if (lowerContent.includes("sanhok") || lowerUrl.includes("sanhok")) {
      mapAsset = { name: "Sanhok Tactical Map Preview", path: "/src/assets/images/sanhok_tactical_map_1781523683529.jpg" };
    } else if (lowerContent.includes("vikendi") || lowerUrl.includes("vikendi")) {
      mapAsset = { name: "Vikendi Tactical Map Preview", path: "/src/assets/images/vikendi_tactical_map_1781523699214.jpg" };
    } else if (lowerContent.includes("livik") || lowerUrl.includes("livik")) {
      mapAsset = { name: "Livik Tactical Map Preview", path: "/src/assets/images/livik_tactical_map_1781523715245.jpg" };
    } else if (lowerContent.includes("nusa") || lowerUrl.includes("nusa")) {
      mapAsset = { name: "Nusa Tactical Map Preview", path: "/src/assets/images/nusa_tactical_map_1781523732749.jpg" };
    } else if (lowerContent.includes("karakin") || lowerUrl.includes("karakin")) {
      mapAsset = { name: "Karakin Tactical Map Preview", path: "/src/assets/images/karakin_tactical_map_1781523748643.jpg" };
    }

    // Determine preview image path
    const previewSrc = isImage ? url : (mapAsset ? mapAsset.path : null);
    if (!previewSrc) return null;

    const title = mapAsset ? mapAsset.name : "Tactical Bulletin Screenshot Recon";

    return (
      <div className="mt-3 border border-red-500/20 bg-zinc-950/80 rounded-xl p-3 flex flex-col sm:flex-row gap-4 items-stretch overflow-hidden hover:border-red-500/40 transition-colors group">
        <div className="relative w-full sm:w-40 h-28 bg-black rounded-lg border border-zinc-800 overflow-hidden shrink-0 group-hover:border-zinc-700 transition-colors">
          <img
            src={previewSrc}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            TELEMETRY LINK
          </div>
          <button
            type="button"
            onClick={() => setExpandedPostImage({ src: previewSrc, title })}
            className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded text-white hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
            title="Expand tactical screenshot"
          >
            <Maximize2 size={10} />
          </button>
        </div>
        <div className="flex flex-col justify-between py-1 space-y-2">
          <div>
            <div className="flex items-center gap-1.5">
              <ImageIcon size={11} className="text-red-500" />
              <span className="text-[10px] font-black text-white tracking-widest uppercase font-mono">
                {title}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono mt-1 leading-snug">
              Secure satellite imagery coordinates matched from broadcast stream feed. Open external source to download full high-fidelity assets.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-red-500 font-black tracking-widest hover:text-red-400 transition-colors font-mono uppercase"
            >
              <span>Verify Stream Link</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-zinc-600">•</span>
            <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">
              IPFS CRYPTO SECURE
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleMentionClick = (username: string) => {
    let found = rosterPlayers.find((p) => p.ign.toLowerCase() === username.toLowerCase());

    if (!found && session.ign.toLowerCase() === username.toLowerCase()) {
      found = {
        ign: session.ign,
        name: "You (Crimson Vipers)",
        role: session.role,
        avatar: "👑",
        game: "PUBG Mobile",
        kd: "4.50",
        achievements: ["Elite Commander Medal", "Platform Tactician"],
        tier: "GRANDMASTER",
        winRate: "78%",
        totalKills: 1540
      };
    }

    if (!found) {
      const coach = COACHES_LIST.find((c) => c.ign.toLowerCase() === username.toLowerCase());
      if (coach) {
        found = {
          ign: coach.ign,
          name: "Staff Tactician",
          role: coach.role,
          avatar: coach.avatar,
          game: "PUBG Mobile",
          kd: "3.50",
          achievements: ["6+ Years Competitive Coach", "Edge Rotate Specialist"],
          tier: "MASTER",
          winRate: "65%",
          totalKills: 450,
          bio: coach.details
        };
      }
    }

    if (!found) {
      const creator = CREATORS_LIST.find((c) => c.ign.toLowerCase() === username.toLowerCase());
      if (creator) {
        found = {
          ign: creator.ign,
          name: "Content Creator",
          role: creator.role,
          avatar: creator.avatar,
          game: "PUBG Mobile",
          kd: "3.80",
          achievements: ["YouTube Certified Star", "Gameplay Clip Maestro"],
          tier: "DIAMOND",
          winRate: "62%",
          totalKills: 820,
          bio: creator.details
        };
      }
    }

    if (!found) {
      found = {
        ign: username,
        name: username.split('_').join(' '),
        role: "Tactical Recruit",
        avatar: "👤",
        game: "PUBG Mobile",
        kd: "3.65",
        achievements: ["Lobby Challenger", "Verified Tactical Infiltrator"],
        tier: "DIAMOND",
        winRate: "58%",
        totalKills: 620,
        bio: "A registered tactical operative in the Crimson Vipers satcom network, participating in scrim sessions and community briefings."
      };
    }

    setSelectedDossierPlayer(found);
    awardXp(5);
    setSystemAlertMessage(`👁️ Loaded combat dossier intelligence profile for mentioned user: @${username}`);
  };

  const parseMentions = (content: string) => {
    if (!content) return "";
    const parts = content.split(/(@[a-zA-Z0-9_\-]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1);
        return (
          <button
            key={index}
            onClick={() => handleMentionClick(username)}
            className="text-red-500 hover:text-red-400 font-bold hover:underline font-mono inline-block cursor-pointer align-baseline select-text text-left p-0 bg-transparent border-0"
            style={{ display: "inline" }}
            type="button"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  // Handle store purchases
  const handlePurchaseItem = (item: StoreItem) => {
    if (session.coins < item.cost) {
      setSystemAlertMessage(`❌ Insufficient CV Coins! Challenge more tournaments to earn coins.`);
      return;
    }
    setSession(prev => ({ ...prev, coins: prev.coins - item.cost }));
    setPurchasedStoreItemIds([...purchasedStoreItemIds, item.id]);
    setSystemAlertMessage(`🎁 Successfully purchased ${item.name}! Applied instantly.`);
    awardXp(40);
  };

  // Start Real-Time TDM Combat Tac-Simulation
  const startTdmMatchSim = (selectedWeapon: string, selectedStrategy: string, opponent: string) => {
    if (tdmSimulatorActive) return;
    setIsTdmReplaying(false);
    setTdmUserScore(0);
    setTdmEnemyScore(0);
    setTdmSimulatorActive(true);
    setTdmChartData([{ tick: 0, CrimsonVipers: 0, Opponent: 0 }]);

    const runMatchTicks = (oppName: string) => {
      let userScoreTemp = 0;
      let enemyScoreTemp = 0;
      let tickCount = 1;

      const interval = setInterval(() => {
        // Determine win probabilities based on weapon & strategy multipliers
        const userMulti = selectedWeapon === "Groza CQB Shredder" ? 1.2 : selectedWeapon === "AWM Absolute One-Tap" ? 1.15 : 1.05;
        const stratMulti = selectedStrategy === "Aggressive Rush" ? 1.12 : selectedStrategy === "Tactical Flank" ? 1.08 : 1.0;
        
        const userChance = 0.51 * userMulti * stratMulti;
        const isUserPoint = Math.random() < userChance;

        if (isUserPoint) {
          userScoreTemp += Math.floor(Math.random() * 2) + 1;
          if (userScoreTemp >= 40) userScoreTemp = 40;
        } else {
          enemyScoreTemp += Math.floor(Math.random() * 2) + 1;
          if (enemyScoreTemp >= 40) enemyScoreTemp = 40;
        }

        setTdmUserScore(userScoreTemp);
        setTdmEnemyScore(enemyScoreTemp);

        // Record score point for Recharts Line Chart
        setTdmChartData(prev => [
          ...prev,
          {
            tick: tickCount++,
            CrimsonVipers: userScoreTemp,
            Opponent: enemyScoreTemp
          }
        ]);

        // Creative combat messages
        const userKillEvents = [
          `⚡ CV_Slayer_IGL connected multiple micro-frags using ${selectedWeapon}!`,
          `🎯 CV_Mamba_Flick sniped an entry player with a clean headshot!`,
          `💀 CV_Apex_Rusher trade-killed with a close-quarter jump-spray!`,
          `🔥 CV_Shadow_Duo double-clutched with brilliant slide movement!`,
          `💣 CV_Alpha_Spectre cooked a flawless frag grenade behind container 3!`,
          `🔫 You completed an assist with reliable ${selectedWeapon} suppressor coverage.`
        ];

        const enemyKillEvents = [
          `❌ ${oppName} captain caught CV_Apex_Rusher reloading.`,
          `⚠️ ${oppName} deployed an aggressive crossfire, wiping out 2 of our roamer units.`,
          `💥 ${oppName} sniper obtained high-ground overlook, securing an assist.`,
          `💀 CV_Mamba_Flick fell to an unexpected pre-fire corner slide.`
        ];

        const randomLog = isUserPoint 
          ? userKillEvents[Math.floor(Math.random() * userKillEvents.length)]
          : enemyKillEvents[Math.floor(Math.random() * enemyKillEvents.length)];

        setTdmLogs(prev => [randomLog, ...prev.slice(0, 15)]);

        if (userScoreTemp >= 40 || enemyScoreTemp >= 40) {
          clearInterval(interval);
          setTdmSimulatorActive(false);

          const isUserVictory = userScoreTemp >= 40;
          const resultString = isUserVictory ? "Victory" : "Defeat";
          const mvpName = isUserVictory 
            ? ["CV_Slayer_IGL", "CV_Mamba_Flick", "CV_Shadow_Duo", "You"][Math.floor(Math.random() * 4)] 
            : `${oppName} MVP`;

          // Victory benefits
          if (isUserVictory) {
            setSession(prev => ({
              ...prev,
              coins: prev.coins + 100,
              battlePassXp: Math.min(200, prev.battlePassXp + 25)
            }));
            setSystemAlertMessage(`🏆 TDM Arena Victory over ${oppName}! Gained +100 CV Coins & +25 Battle Pass XP!`);
          } else {
            setSystemAlertMessage(`💀 TDM Arena Defeat against ${oppName}! Adjust loadout configurations and test again.`);
          }

          // Save history session
          const newMatch = {
            id: "tdm-" + Date.now(),
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            weapon: selectedWeapon,
            opponent: oppName,
            score: `${userScoreTemp} - ${enemyScoreTemp}`,
            result: resultString,
            mvp: mvpName
          };
          setTdmHistory(prev => [newMatch, ...prev]);
        }
      }, 850);
    };

    if (tdmAutoQueue) {
      setIsAutoQueueSearching(true);
      setMatchmakerStep(1);
      setTdmLogs([
        "📡 CAPTAIN SOCKET: Auto-Queue matchmaker engine initiated...",
        `🔎 Searching for live wait-listed operators in matching Rank Tiers on server: ${selectedContinent}...`,
      ]);

      const userLadderInfo = tdmLadder.find(p => p.ign.includes("You")) || { tier: "Platinum", points: 1500 };
      const userTier = userLadderInfo.tier;
      const userTierIdx = ["Gold", "Platinum", "Diamond", "Master", "Grandmaster"].indexOf(userTier);

      const waitingApplicants = [
        // North America
        { ign: "Apex_Ghost_IGL", tier: "Master", points: 2100, continent: "North America" },
        { ign: "CV_Lethal_Pride", tier: "Platinum", points: 1520, continent: "North America" },
        { ign: "Texas_Ranger", tier: "Gold", points: 1210, continent: "North America" },
        { ign: "Detroit_Steel", tier: "Diamond", points: 1740, continent: "North America" },
        { ign: "Raptor_F22", tier: "Grandmaster", points: 2420, continent: "North America" },
        // Europe
        { ign: "ViperShoot_PRO", tier: "Master", points: 1950, continent: "Europe" },
        { ign: "Asgard_Loki", tier: "Platinum", points: 1530, continent: "Europe" },
        { ign: "Euro_Slayer", tier: "Master", points: 2050, continent: "Europe" },
        { ign: "London_Fog", tier: "Gold", points: 1230, continent: "Europe" },
        { ign: "Berlin_Wall", tier: "Diamond", points: 1760, continent: "Europe" },
        { ign: "Paris_Viper", tier: "Grandmaster", points: 2410, continent: "Europe" },
        // Asia
        { ign: "Hydra_Avenger_1", tier: "Diamond", points: 1780, continent: "Asia" },
        { ign: "Tokyo_Drifter", tier: "Platinum", points: 1490, continent: "Asia" },
        { ign: "Seoul_Viper", tier: "Master", points: 2050, continent: "Asia" },
        { ign: "Beijing_Dragon", tier: "Gold", points: 1240, continent: "Asia" },
        { ign: "Delhi_Sultan", tier: "Grandmaster", points: 2430, continent: "Asia" },
        // South America
        { ign: "Viper_Alpha_01", tier: "Platinum", points: 1480, continent: "South America" },
        { ign: "Rio_Gaucho", tier: "Platinum", points: 1500, continent: "South America" },
        { ign: "Amazon_Tiger", tier: "Diamond", points: 1720, continent: "South America" },
        { ign: "Samba_Striker", tier: "Gold", points: 1190, continent: "South America" },
        { ign: "Pampas_Condor", tier: "Master", points: 2010, continent: "South America" },
        // Africa
        { ign: "ZIM_Warrior_X", tier: "Diamond", points: 1690, continent: "Africa" },
        { ign: "ZIM_Ghost_07", tier: "Gold", points: 1250, continent: "Africa" },
        { ign: "Cairo_Pharaoh", tier: "Platinum", points: 1480, continent: "Africa" },
        { ign: "CapeTown_Slayer", tier: "Master", points: 1980, continent: "Africa" },
        { ign: "Sahara_Sandstorm", tier: "Grandmaster", points: 2390, continent: "Africa" },
        // Oceania
        { ign: "Sydney_Wallaby", tier: "Platinum", points: 1520, continent: "Oceania" },
        { ign: "Melbourne_Ace", tier: "Diamond", points: 1750, continent: "Oceania" },
        { ign: "Aussie_Sniper", tier: "Diamond", points: 1720, continent: "Oceania" },
        { ign: "KIWI_Flicker", tier: "Gold", points: 1200, continent: "Oceania" },
        { ign: "GreatBarrier_Diver", tier: "Master", points: 1960, continent: "Oceania" }
      ];

      // STRICTLY FILTER BY USER'S SELECT CONTINENT (Ensures identical continent to prevent ms or network spikes)
      const sameContinentApplicants = waitingApplicants.filter(cand => cand.continent === selectedContinent);

      // Find matched competitor from same continent
      let matchedCompetitor = sameContinentApplicants[0] || { ign: "Local_Fighter_TDM", tier: userTier, points: userLadderInfo.points, continent: selectedContinent };
      let minScore = Infinity;

      sameContinentApplicants.forEach(cand => {
        const candTierIdx = ["Gold", "Platinum", "Diamond", "Master", "Grandmaster"].indexOf(cand.tier);
        const tierDistance = Math.abs(userTierIdx - candTierIdx);
        const ptsDistance = Math.abs(cand.points - userLadderInfo.points);
        const matchPenalty = (tierDistance * 1000) + ptsDistance;
        if (matchPenalty < minScore) {
          minScore = matchPenalty;
          matchedCompetitor = cand;
        }
      });

      setTimeout(() => {
        setMatchmakerStep(2);
        setTdmLogs(prev => [
          `⚡ Found ${sameContinentApplicants.length} wait-listed candidates on direct ${selectedContinent} routing. Filter criteria: ${userTier} matches & region alignment.`,
          ...prev
        ]);
      }, 500);

      setTimeout(() => {
        setMatchmakerStep(3);
        playInteractionSound("matchFound");
        setTdmLogs(prev => [
          `🎯 MATCH ACQUIRED: ${matchedCompetitor.ign} (${matchedCompetitor.tier} Tier, ${matchedCompetitor.points} Points)`,
          `📡 Region Server: ${selectedContinent} | Fluctuation check: PASS | Latency stabilized: 12ms.`,
          ...prev
        ]);
      }, 1200);

      setTimeout(() => {
        setMatchmakerStep(0);
        setIsAutoQueueSearching(false);
        setTdmLogs(prev => [
          `⚔️ MATCH LAUNCHED BY CAPTAIN! Crimson Vipers (same continent: ${selectedContinent}) vs ${matchedCompetitor.ign}`,
          `⚙️ Dynamic loadout synchronized: [${selectedWeapon}]`,
          `📢 Entering TDM combat arena [Warehouse] with ultra-stable same-continent network sync...`,
          ...prev
        ]);
        runMatchTicks(matchedCompetitor.ign);
      }, 2100);

    } else {
      playInteractionSound("matchFound");
      setTdmLogs([
        `⚔️ Match launched! CV Crimson Vipers vs ${opponent}`,
        `⚙️ Loadout Synchronized: [${selectedWeapon}] | Tactical Matrix: [${selectedStrategy}]`,
        "📢 First encounter at Warehouse center in 1.5 seconds..."
      ]);
      runMatchTicks(opponent);
    }
  };

  // ANALYZE TACTICAL HIGHLIGHTS / SCORE SWINGS FROM TDM CHART DATA
  const analyzeTdmTrajectory = (data: { tick: number; CrimsonVipers: number; Opponent: number }[]) => {
    const list: {
      tick: number;
      type: "lead_change" | "clutch" | "vipers_run" | "opponent_run" | "draw";
      description: string;
      score: string;
    }[] = [];
    
    if (!data || data.length < 2) return list;
    
    let currentLeader: "vipers" | "opponent" | "draw" = "draw";
    
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const diffPrev = prev.CrimsonVipers - prev.Opponent;
      const diffCurr = curr.CrimsonVipers - curr.Opponent;
      
      let nextLeader: "vipers" | "opponent" | "draw" = "draw";
      if (diffCurr > 0) nextLeader = "vipers";
      else if (diffCurr < 0) nextLeader = "opponent";
      
      // 1. Lead Change moments
      if (nextLeader !== currentLeader && nextLeader !== "draw") {
        list.push({
          tick: curr.tick,
          type: "lead_change",
          description: nextLeader === "vipers"
            ? "🎯 VIPERS OVERTAKE: Crimson Vipers clutch back the match control."
            : "⚠️ CONCEDED LEAD: Opponent tactical breach reverses score momentum.",
          score: `CV ${curr.CrimsonVipers} - ${curr.Opponent} Opp`
        });
      }
      
      currentLeader = nextLeader;
      
      // 2. Big score runs / spikes (e.g. gain is 2 or higher in a single tick)
      const vGain = curr.CrimsonVipers - prev.CrimsonVipers;
      const oGain = curr.Opponent - prev.Opponent;
      
      if (vGain >= 2 && curr.CrimsonVipers < 40) {
        list.push({
          tick: curr.tick,
          type: "vipers_run",
          description: "🔥 CLINICAL FLANK: Vipers secure clean double-frag with active spray cover.",
          score: `CV ${curr.CrimsonVipers} - ${curr.Opponent} Opp`
        });
      } else if (oGain >= 2 && curr.Opponent < 40) {
        list.push({
          tick: curr.tick,
          type: "opponent_run",
          description: "💥 AREA SUPPRESSION: Opponent squad locks target zone with tactical push.",
          score: `CV ${curr.CrimsonVipers} - ${curr.Opponent} Opp`
        });
      }
      
      // 3. Clutch / High-stakes near-victory
      if ((curr.CrimsonVipers >= 35 || curr.Opponent >= 35) && Math.abs(diffCurr) <= 3 && (vGain > 0 || oGain > 0) && curr.CrimsonVipers !== 40 && curr.Opponent !== 40) {
        list.push({
          tick: curr.tick,
          type: "clutch",
          description: "⚡ TENSE SECONDS: Clutch micro-trades in final matchpoint territory!",
          score: `CV ${curr.CrimsonVipers} - ${curr.Opponent} Opp`
        });
      }
      
      // 4. Match point victory
      if (curr.CrimsonVipers === 40 && prev.CrimsonVipers < 40) {
        list.push({
          tick: curr.tick,
          type: "clutch",
          description: "🏆 MATCHPOINT SECURED: Crimson Vipers complete simulated ledger verification!",
          score: `CV 40 - ${curr.Opponent} Opp`
        });
      } else if (curr.Opponent === 40 && prev.Opponent < 40) {
        list.push({
          tick: curr.tick,
          type: "opponent_run",
          description: "💀 MATCHPOINT CONCEDED: Match ledger closed in enemy favor.",
          score: `CV ${curr.CrimsonVipers} - 40 Opp`
        });
      }
    }
    
    return list;
  };

  // Run or change Tactical Replay state
  const handleStartTacticalReplay = () => {
    if (tdmSimulatorActive) return;
    setIsTdmReplaying(true);
    setTdmReplayTick(0);
    setTdmReplayIsPaused(false);
    
    const highlights = analyzeTdmTrajectory(tdmChartData);
    setTdmReplayHighlights(highlights);
    
    setTdmLogs(prev => [
      "📡 TACTICAL REPLAY SOCKET ACTIVE: Initializing slow-motion graph playback...",
      `🎥 Trajectory verified with ${highlights.length} critical score swing anomalies detected.`,
      ...prev
    ]);
  };

  // Keep the replay loop active
  useEffect(() => {
    let intervalId: any = null;
    if (isTdmReplaying && !tdmReplayIsPaused) {
      intervalId = setInterval(() => {
        setTdmReplayTick(prev => {
          if (prev >= tdmChartData.length - 1) {
            clearInterval(intervalId);
            setTdmReplayIsPaused(true);
            setTdmLogs(upd => ["🏁 REPLAY CONCLUDED: Final tactical matrix playback completed.", ...upd]);
            return tdmChartData.length - 1;
          }
          return prev + 1;
        });
      }, tdmReplaySpeed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTdmReplaying, tdmReplayIsPaused, tdmReplaySpeed, tdmChartData.length]);

  const handleSelfReportMatch = () => {
    let pointsDelta = 0;
    if (selfReportResult === "Win") pointsDelta = 50;
    if (selfReportResult === "Loss") pointsDelta = -30;

    const signature = `SIG-SHA256-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(Date.now() / 1000)}`;

    const newVerification = {
      id: "vr-" + Date.now(),
      challenger: "You (Crimson Vipers)",
      opponent: selfReportOpponent,
      pointsDelta: pointsDelta,
      result: selfReportResult,
      proof: signature,
      date: "Just now",
      status: "Pending",
      weapon: selfReportWeapon,
      score: `${selfReportYourScore} - ${selfReportOpponentScore}`
    };

    setTdmVerificationQueue(prev => [newVerification, ...prev]);
    setSystemAlertMessage(`🔒 SELF-REPORT LOGGED: Match against ${selfReportOpponent} uploaded (${selfReportResult === 'Win' ? '🏆 Win' : selfReportResult === 'Loss' ? '💀 Loss' : '🤝 Draw'}). Signature: ${signature}. Dynamic points awaiting Admin Audit!`);
    awardXp(15);
  };

  // NEW TDM CUSTOM CORE ACTION HANDLERS
  const handleChallengePlayer = (opponentIgn: string) => {
    // Run a simulated quick match results generator
    const outcomes = ["Win", "Loss", "Draw"];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    let pointsDelta = 0;
    if (result === "Win") pointsDelta = 50;
    if (result === "Loss") pointsDelta = -30;

    const newVerification = {
      id: "vr-" + Date.now(),
      challenger: "You (Crimson Vipers)",
      opponent: opponentIgn,
      pointsDelta: pointsDelta,
      result: result,
      proof: `PROOF-TDM-${Math.floor(1000 + Math.random() * 9000)}-VERIFY`,
      date: "Just now",
      status: "Pending"
    };

    setTdmVerificationQueue(prev => [newVerification, ...prev]);
    setSystemAlertMessage(`📡 CHALLENGE SUBMITTED: Match against ${opponentIgn} completed (${result === 'Win' ? '🏆 Victory' : result === 'Loss' ? '💀 Defeat' : '🤝 Draw'}). Awaiting Points Verification Audit!`);
  };

  const handleVerifyMatchPoints = (id: string, action: "Approve" | "Reject") => {
    const match = tdmVerificationQueue.find(m => m.id === id);
    if (!match) return;

    if (action === "Approve") {
      setTdmLadder(prev => {
        const updated = prev.map(p => {
          if (p.ign === match.challenger) {
            const newPoints = Math.max(0, p.points + match.pointsDelta);
            const winsDelta = match.result === "Win" ? 1 : 0;
            const lossesDelta = match.result === "Loss" ? 1 : 0;
            const drawsDelta = match.result === "Draw" ? 1 : 0;
            return { 
              ...p, 
              points: newPoints,
              wins: p.wins + winsDelta,
              losses: p.losses + lossesDelta,
              draws: p.draws + drawsDelta,
              tier: newPoints >= 2200 ? "Grandmaster" : newPoints >= 1800 ? "Master" : newPoints >= 1500 ? "Platinum" : "Gold"
            };
          }
          if (p.ign === match.opponent) {
            const oppPointsDelta = -match.pointsDelta;
            const newPoints = Math.max(0, p.points + oppPointsDelta);
            const winsDelta = match.result === "Loss" ? 1 : 0;
            const lossesDelta = match.result === "Win" ? 1 : 0;
            const drawsDelta = match.result === "Draw" ? 1 : 0;
            return { 
              ...p, 
              points: newPoints,
              wins: p.wins + winsDelta,
              losses: p.losses + lossesDelta,
              draws: p.draws + drawsDelta,
              tier: newPoints >= 2200 ? "Grandmaster" : newPoints >= 1800 ? "Master" : newPoints >= 1500 ? "Platinum" : "Gold"
            };
          }
          return p;
        });

        return updated
          .sort((a, b) => b.points - a.points)
          .map((item, index) => ({ ...item, rank: index + 1 }));
      });

      setTdmVerificationQueue(prev => prev.map(m => m.id === id ? { ...m, status: "Verified" } : m));
      setSystemAlertMessage(`✅ POINTS VERIFIED AND APPROVED: Added ${match.pointsDelta} points to Challenger accounts.`);
    } else {
      setTdmVerificationQueue(prev => prev.map(m => m.id === id ? { ...m, status: "Rejected" } : m));
      setSystemAlertMessage(`❌ POINTS REJECTED: Match proof flagged invalid. No points allocated.`);
    }
  };

  const handleRegisterTdmTourneyPlayer = (playerName: string) => {
    if (!playerName.trim()) return;
    if (tdmTourneyPlayers.includes(playerName)) {
      setSystemAlertMessage("⚠️ Player already registered in this TDM tournament!");
      return;
    }
    setTdmTourneyPlayers(prev => [...prev, playerName]);
    setNewTourneyPlayerName("");
    setSystemAlertMessage(`🎮 ${playerName} registered for the TDM Championship!`);
    setTdmTourneyWinner(null);
  };

  const handleResetTdmTourney = () => {
    setTdmTourneyPlayers([
      "CV_Slayer_IGL", "CV_Mamba_Flick", "You (Crimson Vipers)", "ViperShoot_PRO",
      "Apex_Ghost_IGL", "Hydra_Avenger_1", "Liquid_Academy_X", "Faze_Recruit_9"
    ]);
    setTdmTourneyWinner(null);
    setSystemAlertMessage("🔄 TDM tournament rosters reset to default draft squad!");
  };

  const handleRandomizeTdmMatchups = () => {
    setTdmTourneyPlayers(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setTdmTourneyWinner(null);
    setSystemAlertMessage("🎲 Matchups completely randomized! Dynamic groups and matchups updated.");
  };

  const simulateEntireTournament = (players: string[]) => {
    if (players.length === 0) return;
    if (isTourneySimulating) return;

    setIsTourneySimulating(true);
    setTdmTourneyWinner(null);
    playInteractionSound("tournamentStart");
    setSystemAlertMessage("📡 TOURNAMENT MATCHUPS DEPLOYED! Commencing automated seed brackets...");

    setTimeout(() => {
      setSystemAlertMessage("⚔️ QUARTERFINALS UNDERWAY: Dynamic point-decay matrices calculated...");
    }, 800);

    setTimeout(() => {
      setSystemAlertMessage("🔥 SEMIFINALS INTENSE: Server lag tests passed, Grand Finalists seed configured!");
    }, 1600);

    setTimeout(() => {
      const winner = players[Math.floor(Math.random() * players.length)];
      setTdmTourneyWinner(winner);
      setIsTourneySimulating(false);
      playInteractionSound("success");
      setSystemAlertMessage(`🏆 TOURNAMENT COMPLETE! ${winner} emerged as the absolute Champion of TDM brackets!`);
    }, 2400);
  };

  const getDynamicGroups = (players: string[]) => {
    const size = players.length;
    let groups: { name: string; members: string[] }[] = [];

    if (size <= 4) {
      groups = [{ name: "Championship Group", members: [...players] }];
    } else if (size <= 8) {
      groups = [
        { name: "Group A (Alpha Division)", members: players.slice(0, Math.ceil(size / 2)) },
        { name: "Group B (Beta Division)", members: players.slice(Math.ceil(size / 2)) }
      ];
    } else {
      const quarter = Math.ceil(size / 4);
      groups = [
        { name: "Group A (Slayer Wing)", members: players.slice(0, quarter) },
        { name: "Group B (Viper Wing)", members: players.slice(quarter, quarter * 2) },
        { name: "Group C (Predator Wing)", members: players.slice(quarter * 2, quarter * 3) },
        { name: "Group D (Champions Wing)", members: players.slice(quarter * 3) }
      ];
    }
    return groups;
  };

  // Add Comment on Social Feed
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Math.random().toString(),
              author: session.ign,
              role: session.role,
              text: text,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    awardXp(10);
  };

  // Helper function to extract a participant's rank based on their status or fallback mapping
  const getParticipantRank = (ign: string): string => {
    // 1. Check in TDM Ladder list
    const ladderEntry = tdmLadder.find(p => p.ign === ign || (ign.includes("You") && p.ign.includes("You")) || (ign === session.ign && p.ign.includes("You")));
    if (ladderEntry) return ladderEntry.tier;

    // 2. Check in Recruitment applications list
    const recruitEntry = recruits.find(r => r.ign === ign);
    if (recruitEntry) return recruitEntry.rank;

    // 3. Look up in players list
    const playerEntry = rosterPlayers.find(p => p.ign === ign);
    if (playerEntry) {
      const kdNum = parseFloat(playerEntry.kd);
      if (kdNum >= 5.0) return "Conqueror";
      if (kdNum >= 4.5) return "Ace Dominator";
      if (kdNum >= 4.0) return "Ace Master";
      if (kdNum >= 3.5) return "Master";
      return "Diamond";
    }

    // 4. Deterministic hash fallback
    const ranksPool = ["Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Ace Master", "Ace Dominator", "Conqueror"];
    let hash = 0;
    for (let i = 0; i < ign.length; i++) {
      hash = ign.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % ranksPool.length;
    return ranksPool[idx];
  };

  // Map rank names to points value weights
  const getRankWeight = (rank: string): number => {
    const weights: Record<string, number> = {
      "Conqueror": 8,
      "Grandmaster": 8,
      "Ace Dominator": 7,
      "Master": 7,
      "Ace Master": 6,
      "Ace": 6,
      "Crown": 5,
      "Diamond": 5,
      "Platinum": 4,
      "Gold": 3,
      "Silver": 2,
      "Bronze": 1
    };
    return weights[rank] || 4;
  };

  // Map values back to generalized titles
  const getRankFromWeight = (weight: number): string => {
    const list = [
      "Bronze",
      "Silver",
      "Gold",
      "Gold",
      "Platinum",
      "Diamond",
      "Ace Master",
      "Ace Dominator",
      "Conqueror"
    ];
    const rounded = Math.min(8, Math.max(0, Math.round(weight)));
    return list[rounded];
  };

  // Derive competitiveness metrics for scrim session card rendering
  const getScrimCompetitiveness = (registeredIGNs: string[]) => {
    if (!registeredIGNs || registeredIGNs.length === 0) {
      return { avgTier: "N/A", avgValue: "0.0", text: "NO PARTICIPANTS", color: "text-zinc-500 bg-zinc-900 border-zinc-800", breakdown: [] };
    }

    const weights = registeredIGNs.map(ign => getRankWeight(getParticipantRank(ign)));
    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    const avgTier = getRankFromWeight(avgWeight);

    let text = "Challenging";
    let color = "text-amber-400 bg-amber-950/20 border-amber-900/30";

    if (avgWeight >= 7.0) {
      text = "🏆 EXTREME / PRO TIER";
      color = "text-red-400 bg-red-950/20 border-red-500/30 shadow-[0_0_12px_rgba(255,0,28,0.15)] animate-pulse";
    } else if (avgWeight >= 5.5) {
      text = "⚡ COMPETITIVE / ELITE";
      color = "text-orange-400 bg-orange-950/20 border-orange-900/30";
    } else if (avgWeight >= 4.0) {
      text = "🔫 FORMIDABLE / INTERMEDIATE";
      color = "text-sky-400 bg-sky-950/20 border-sky-900/30";
    } else {
      text = "🌱 BEGINNER FRIENDLY";
      color = "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
    }

    return {
      avgTier,
      avgValue: avgWeight.toFixed(1),
      text,
      color,
      breakdown: registeredIGNs.map(ign => ({ ign, rank: getParticipantRank(ign) }))
    };
  };

  // Handle creating simulated team scrims
  const handleCreateScrim = (e: FormEvent) => {
    e.preventDefault();
    if (!scrimTitle.trim()) return;

    const newScrim: ScrimSession = {
      id: "scrim_" + Date.now(),
      title: scrimTitle,
      game: scrimGame,
      mapName: scrimMap,
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      maxSlots: 16,
      registeredIGNs: [session.ign],
      status: "Open"
    };

    setScrims([newScrim, ...scrims]);
    setScrimTitle("");
    setSystemAlertMessage(`🔥 New Scrim "${newScrim.title}" created. Roster open!`);
    awardXp(25);
  };

  // Register for a Scrim Slot
  const handleRegisterScrim = (scrimId: string) => {
    const targetScrim = scrims.find(s => s.id === scrimId);
    if (!targetScrim) return;

    if (targetScrim.registeredIGNs.includes(session.ign)) {
      setSystemAlertMessage("⚠️ Already registered for this scrim session.");
      return;
    }

    setScrims(prev => prev.map(s => {
      if (s.id === scrimId) {
        return {
          ...s,
          registeredIGNs: [...s.registeredIGNs, session.ign]
        };
      }
      return s;
    }));

    // Trigger WhatsApp Notification Modal
    const mockTour: Tournament = {
      id: targetScrim.id,
      title: targetScrim.title,
      type: "Squad",
      status: "Open",
      game: targetScrim.game as any,
      prizePool: "Practice Session (Scrim)",
      entryFee: "Free",
      teamsCount: targetScrim.registeredIGNs.length + 1,
      maxTeams: targetScrim.maxSlots,
      countdownDate: targetScrim.dateTime,
      schedule: new Date(targetScrim.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) + " UTC",
      matchesCount: 1,
      rules: ["Standard practice scrim rules"],
      registeredTeams: [...targetScrim.registeredIGNs, session.ign],
      mapDetails: targetScrim.mapName
    };

    // Add to Captain Dispatch directory
    const newCapRec = {
      id: "cap-rec-" + Date.now(),
      tournamentTitle: targetScrim.title,
      captainName: registerFormCaptainName || session.ign,
      teamName: registerFormTeamName || `${session.ign} Squad`,
      captainNo: registerFormCaptainPhone.replace(/[^0-9]/g, "") || "44712345678",
      schedule: new Date(targetScrim.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) + " UTC",
      mapDetails: targetScrim.mapName,
      status: "PENDING"
    };
    setCaptainRecords(prev => [newCapRec, ...prev]);

    setWhatsappTournament(mockTour);
    setWhatsappCaptainNo(registerFormCaptainPhone);
    setIsWhatsappModalOpen(true);

    setSystemAlertMessage("📝 Scrim attendance registered! Dispatching WhatsApp match details.");
    awardXp(15);
  };

  // Direct recruitment application submission
  const handleRecruitSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!applyIgn.trim() || !applyExp.trim()) {
      alert("Please specify In-game Name and experience.");
      return;
    }

    const fullExp = applyOptional.trim() 
      ? `${applyExp}\n\nAdditional Info: ${applyOptional}` 
      : applyExp;

    const fullAvail = applyContact.trim()
      ? `${applyAvail || "Flexible"} (Contact: ${applyContact})`
      : (applyAvail || "Flexible time");

    const newApp: RecruitmentApplication = {
      id: "rec_" + Date.now(),
      ign: applyIgn,
      role: applyRole,
      game: applyGame,
      rank: applyRank,
      device: applyDevice,
      experience: fullExp,
      availability: fullAvail,
      status: "Pending",
      timestamp: new Date().toISOString()
    };

    setRecruits([newApp, ...recruits]);
    setRecruitmentSuccess(true);
    setApplyIgn("");
    setApplyRank("");
    setApplyDevice("");
    setApplyExp("");
    setApplyAvail("");
    setApplyContact("");
    setApplyOptional("");
    setSystemAlertMessage(`📬 Application lodged. Owner reviews submissions live on Dashboard!`);
    awardXp(30);
  };

  // Handle Recruits Approve / Decline
  const handleApproveRecruit = (appId: string, action: "Approved" | "Rejected") => {
    setRecruits(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: action };
      }
      return app;
    }));
    setSystemAlertMessage(`Roster Application status set to: ${action}`);
    awardXp(20);
  };

  // Strategy Canvas: Drop Pin Dynamically when user clicks on Map layout!
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragActive) {
      setIsDragActive(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000);

    setPendingPin({ x, y });
    setSystemAlertMessage(`📍 Coordinates Chosen. Select a pin type to confirm placement!`);
  };

  const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    setIsPanning(true);
    setPanStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
    setIsDragActive(false);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      setIsDragActive(true);
    }
    // Limit panning boundary to prevent map completely disappearing
    setMapPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMapMouseUp = () => {
    setIsPanning(false);
  };

  const handleMapWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 0.15;
    const nextZoom = e.deltaY < 0 
      ? Math.min(4.0, mapZoom + zoomFactor) 
      : Math.max(1.0, mapZoom - zoomFactor);
    
    // Fixed float precision issue
    const roundedZoom = Math.round(nextZoom * 100) / 100;
    setMapZoom(roundedZoom);
    
    if (roundedZoom === 1.0) {
      setMapPan({ x: 0, y: 0 });
    }
  };

  const handleSelectPinType = (type: "landing" | "rotation" | "danger" | "ambush") => {
    if (!pendingPin) return;
    const { x, y } = pendingPin;

    const labelMap = {
      landing: "Primary Loot Landing Sector",
      rotation: "Strategic Zone Rotation Line",
      danger: "Active Combat & Challenge Area",
      ambush: "Ambush Chokepoint Setup"
    };

    const chosenLabel = labelMap[type];
    const markerColor = selectedColor === "default" ? undefined : selectedColor;

    setStrategyMaps(prev => prev.map(m => {
      if (m.id === selectedMapId) {
        return {
          ...m,
          pins: [...m.pins, { x, y, type, label: `${chosenLabel}`, color: markerColor }]
        };
      }
      return m;
    }));

    setPendingPin(null);
    setSelectedColor("default");
    setSystemAlertMessage(`📍 Successfully placed ${type.toUpperCase()} marker with custom styling!`);
    awardXp(20);
  };

  // clear strategy pins
  const handleClearStrategicMapPins = () => {
    setStrategyMaps(prev => prev.map(m => {
      if (m.id === selectedMapId) return { ...m, pins: [] };
      return m;
    }));
  };

  const handleSaveMapPreset = (e: FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      setSystemAlertMessage("⚠️ Please provide a dynamic label for your tactical preset!");
      return;
    }
    const currentMap = strategyMaps.find(m => m.id === selectedMapId);
    if (!currentMap) return;

    if (currentMap.pins.length === 0) {
      setSystemAlertMessage("⚠️ Place at least one strategic pin configuration on the canvas map first!");
      return;
    }

    const newPreset: MapPreset = {
      id: Date.now().toString(),
      mapId: selectedMapId,
      presetName: newPresetName.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pins: [...currentMap.pins]
    };

    setMapPresets(prev => [...prev, newPreset]);
    setNewPresetName("");
    setSystemAlertMessage(`💾 Tactical setup "${newPreset.presetName}" saved successfully in registry!`);
    awardXp(15);
  };

  const handleLoadMapPreset = (preset: MapPreset) => {
    setStrategyMaps(prev => prev.map(m => {
      if (m.id === preset.mapId) {
        return {
          ...m,
          pins: [...preset.pins]
        };
      }
      return m;
    }));
    setSystemAlertMessage(`📂 Tactical markings restored from preset: "${preset.presetName}"`);
    awardXp(10);
  };

  const handleDeleteMapPreset = (presetId: string, name: string) => {
    setMapPresets(prev => prev.filter(p => p.id !== presetId));
    setSystemAlertMessage(`🗑️ Deleted preset "${name}" from your storage module.`);
  };

  // submit AI coach
  const triggerAICoachAnalysis = async () => {
    setCoachLoading(true);
    setCoachAdvice("");
    try {
      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ign: coachIgn,
          game: coachGame,
          rank: coachRank,
          kills: coachKills,
          kd: coachKd,
          matches: coachMatches,
          placement: coachPlacement,
          device: coachDevice,
          additionalInfo: coachExtra
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCoachAdvice(data.advice);
      } else {
        throw new Error("Coach connection errored");
      }
    } catch {
      setCoachAdvice("⚠️ Unable to connect to critical coaching modules. Configure actual parameters to trigger Gemini.");
    } finally {
      setCoachLoading(false);
      awardXp(35);
    }
  };

  // team war challenge region
  const handleChallengeRegion = (regionId: string) => {
    setRegions(prev => prev.map(reg => {
      if (reg.id === regionId) {
        // randomly challenge and conquer
        const outcome = Math.random() > 0.35;
        return {
          ...reg,
          ownerFaction: outcome ? "CV eSports" : reg.ownerFaction,
          conqueredCount: reg.conqueredCount + (outcome ? 1 : 0),
          combatRating: reg.combatRating + Math.floor(Math.random() * 15) + 5,
          status: outcome ? "Stable" : "War Zone"
        };
      }
      return reg;
    }));
    setSystemAlertMessage("⚔️ Regional Turf War simulation executed score points!");
    awardXp(20);
  };

  // recruitment ban/unban or verify
  const togglePlayerVerify = (playerIgn: string) => {
    setSession(prev => {
      if (prev.ign === playerIgn) {
        return { ...prev, verified: !prev.verified };
      }
      return prev;
    });
    setSystemAlertMessage(`🛡️ Verification status shifted for player.`);
  };

  // Helper to determine tournament prize pool USD equivalent
  const getTournamentPrizeValue = (tour: Tournament): number => {
    if (tour.prizeValueUSD !== undefined) return tour.prizeValueUSD;
    const cleanStr = (tour.prizePool || "").toLowerCase();
    const cashMatch = cleanStr.match(/\$(\d+[\d,]*)/);
    if (cashMatch) {
      return parseInt(cashMatch[1].replace(/,/g, ""), 10);
    }
    const coinMatch = cleanStr.match(/(\d+[\d,]*)/);
    if (coinMatch) {
      const val = parseInt(coinMatch[1].replace(/,/g, ""), 10);
      if (cleanStr.includes("coins") || cleanStr.includes("uc")) {
        return Math.round(val / 100) || 10;
      }
      return val;
    }
    return 0;
  };

  // Owner custom tournament creator
  const handleCreateCustomTournament = (e: FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    const parsedPrizeUSD = (() => {
      const cleanStr = createPrize.toLowerCase();
      const cashMatch = cleanStr.match(/\$(\d+[\d,]*)/);
      if (cashMatch) {
        return parseInt(cashMatch[1].replace(/,/g, ""), 10);
      }
      const coinMatch = cleanStr.match(/(\d+[\d,]*)/);
      if (coinMatch) {
        const val = parseInt(coinMatch[1].replace(/,/g, ""), 10);
        if (cleanStr.includes("coins") || cleanStr.includes("uc")) {
          return Math.round(val / 100) || 10;
        }
        return val;
      }
      return 100; // default for dynamic custom tournaments
    })();

    const newTournament: Tournament = {
      id: "custom_" + Date.now(),
      title: createTitle,
      type: createType,
      status: "Open",
      game: createGame,
      prizePool: createPrize,
      entryFee: createFee,
      prizeValueUSD: parsedPrizeUSD,
      teamsCount: 1,
      maxTeams: 64,
      countdownDate: "2026-06-30T20:00:00Z",
      schedule: "Saturdays 20:00 UTC Live",
      matchesCount: 6,
      rules: [
        "Verified device logs required.",
        "Team captain must attend check-in 1 hour prior.",
        "Spectator slots locked to verified broadcasters."
      ],
      registeredTeams: [session.ign],
      mapDetails: "Erangel and Miramar Custom"
    };

    setTournaments([newTournament, ...tournaments]);
    setCreateTitle("");
    setSystemAlertMessage(`🏆 Tournament "${newTournament.title}" created! Open for registration.`);
    awardXp(40);
  };

  // User registers inside a tournament
  const handleUserRegisterTournament = (tournamentId: string) => {
    const targetTournament = tournaments.find(t => t.id === tournamentId);
    if (!targetTournament) return;

    if (targetTournament.registeredTeams.includes(session.ign)) {
      setSystemAlertMessage("⚠️ Already registered inside this championship bracket.");
      return;
    }

    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          teamsCount: t.teamsCount + 1,
          registeredTeams: [...t.registeredTeams, session.ign]
        };
      }
      return t;
    }));

    // Add to Captain Dispatch directory
    const newCapRec = {
      id: "cap-rec-" + Date.now(),
      tournamentTitle: targetTournament.title,
      captainName: registerFormCaptainName || session.ign,
      teamName: registerFormTeamName || `${session.ign} Squad`,
      captainNo: registerFormCaptainPhone.replace(/[^0-9]/g, "") || "44712345678",
      schedule: targetTournament.schedule,
      mapDetails: targetTournament.mapDetails || "To be decided",
      status: "PENDING"
    };
    setCaptainRecords(prev => [newCapRec, ...prev]);

    // Trigger WhatsApp Notification Modal
    setWhatsappTournament({
      ...targetTournament,
      registeredTeams: [...targetTournament.registeredTeams, session.ign],
      teamsCount: targetTournament.teamsCount + 1
    });
    setWhatsappCaptainNo(registerFormCaptainPhone);
    setIsWhatsappModalOpen(true);

    setSystemAlertMessage("⚔️ Confirmed! Roster slot reserved. Pushing match dispatch details!");
    awardXp(30);
  };

  // TDM BRACKET UTILITIES
  const handleSimulateTdmMatch = (matchId: "semi1" | "semi2" | "final") => {
    if (simulatingMatchId) return;
    
    setSimulatingMatchId(matchId);
    setSimulationProgress(0);
    setSimulationLogs(["📡 Connecting server telemetry nodes...", "⚡ Initializing " + tdmMap + " environment..."]);
    
    const teamA = matchId === "semi1" ? tdmTeams[0] : matchId === "semi2" ? tdmTeams[2] : (semi1Winner || "TBD Team A");
    const teamB = matchId === "semi1" ? tdmTeams[1] : matchId === "semi2" ? tdmTeams[3] : (semi2Winner || "TBD Team B");
    
    const tickers = [
      `🔫 FIRST BLOOD! *${teamA}* scores first on Mid Alley using ${tdmWeaponPreset.split(" ")[0]} presets!`,
      `💥 SLIDE SHOT! *${teamB}* rusher answers back, clearing Sector B with a shotgun!`,
      `🔥 CARNAGE! *${teamA}* is on a killing spree in the central warehouse stacks!`,
      `🎯 CLUTCH HEAL! *${teamB}* player slide-bypasses container fires to secure a crucial double spray!`,
      `⚔️ MATCH POINT! Double death exchange. Thrilling 39-39 standoff. Captains in custom 1v1 on central bridge!`,
      `🏆 VICTORY! *${Math.random() > 0.5 ? teamA : teamB}* lands a glorious close-quarters headshot to secure Phase Win!`
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setSimulationProgress(Math.min((step / tickers.length) * 100, 100));
      
      // Increment scores incrementally
      if (matchId === "semi1") {
        setSemi1Scores(prev => ({
          t1: Math.min(prev.t1 + Math.floor(Math.random() * 8) + 1, 40),
          t2: Math.min(prev.t2 + Math.floor(Math.random() * 8) + 1, 40)
        }));
      } else if (matchId === "semi2") {
        setSemi2Scores(prev => ({
          t1: Math.min(prev.t1 + Math.floor(Math.random() * 8) + 1, 40),
          t2: Math.min(prev.t2 + Math.floor(Math.random() * 8) + 1, 40)
        }));
      } else {
        setFinalScores(prev => ({
          t1: Math.min(prev.t1 + Math.floor(Math.random() * 8) + 1, 40),
          t2: Math.min(prev.t2 + Math.floor(Math.random() * 8) + 1, 40)
        }));
      }
      
      if (step <= tickers.length) {
        setSimulationLogs(prev => [...prev, tickers[step - 1]]);
      }
      
      if (step >= tickers.length) {
        clearInterval(interval);
        
        const isTeamA = Math.random() > 0.5;
        let winner = "";
        
        if (matchId === "semi1") {
          const finalScore = isTeamA ? { t1: 40, t2: 36 } : { t1: 34, t2: 40 };
          setSemi1Scores(finalScore);
          winner = finalScore.t1 === 40 ? teamA : teamB;
          setSemi1Winner(winner);
        } else if (matchId === "semi2") {
          const finalScore = isTeamA ? { t1: 40, t2: 37 } : { t1: 35, t2: 40 };
          setSemi2Scores(finalScore);
          winner = finalScore.t1 === 40 ? teamA : teamB;
          setSemi2Winner(winner);
        } else {
          const finalScore = isTeamA ? { t1: 40, t2: 38 } : { t1: 36, t2: 40 };
          setFinalScores(finalScore);
          winner = finalScore.t1 === 40 ? teamA : teamB;
          setTdmChampion(winner);

          // CV Gaming interactive Pick'em brackets verifier
          let correctCount = 0;
          if (predictedSemi1Winner && predictedSemi1Winner === semi1Winner) correctCount++;
          if (predictedSemi2Winner && predictedSemi2Winner === semi2Winner) correctCount++;
          if (predictedChampion && predictedChampion === winner) correctCount++;

          if (predictedSemi1Winner || predictedSemi2Winner || predictedChampion) {
            if (correctCount === 3) {
              setPickEmResultAlert("🎯 PERFECT CV TICKER BRACKETS! You guessed 3/3 matches correctly! +150 XP Vault Reward!");
              awardXp(150);
            } else if (correctCount > 0) {
              setPickEmResultAlert(`🔥 Solid attempt! You got ${correctCount}/3 Pick'em predictions correct. +50 XP Vault reward!`);
              awardXp(50);
            } else {
              setPickEmResultAlert("📉 The simulation took an unexpected turn! None of your CV Pick'em predictions came true this time.");
            }
          }
        }
        
        setSimulatingMatchId(null);
        awardXp(40);
        setSystemAlertMessage(`🏆 TDM BRACKETS ENGINE: ${winner} won the simulated Deathmatch!`);
      }
    }, 600);
  };

  const handleResetTdmBracket = () => {
    setSemi1Winner(null);
    setSemi2Winner(null);
    setTdmChampion(null);
    setSemi1Scores({ t1: 0, t2: 0 });
    setSemi2Scores({ t1: 0, t2: 0 });
    setFinalScores({ t1: 0, t2: 0 });
    setSimulationLogs([]);
    setSimulationProgress(0);
    setPickEmResultAlert(null);
    setSystemAlertMessage("🔄 TDM tournament rosters re-seeded and scores reset!");
    awardXp(15);
  };

  // Submit anti cheat logs
  const handleSubmitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reportIgn.trim() || !reportUrl.trim()) return;

    const newReport = {
      id: "rep_" + Date.now(),
      targetIgn: reportIgn,
      cheatType: reportType,
      evidenceUrl: reportUrl,
      status: "File Prepared / Alerting Owner"
    };

    setAntiCheatReports([newReport, ...antiCheatReports]);
    setReportIgn("");
    setReportUrl("");
    setSystemAlertMessage("🛡️ Anti-Cheat File securely logged! Owner can audit from Dashboard.");
    awardXp(20);
  };

  // Add Dynamic feed post
  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedPost = {
      id: "post_" + Date.now(),
      author: session.ign,
      role: session.role,
      avatarSeed: "slayer",
      content: newPostText,
      likes: 1,
      comments: [],
      timestamp: new Date().toISOString()
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostText("");
    setSystemAlertMessage("📣 Shared strategic bulletin with invited roster feed.");
    awardXp(20);
  };

  // check if role has access to specific tabs/subscreens
  const hasTabPermission = (role: UserRole, tab: string): boolean => {
    const perms = rolePermissions[role];
    if (!perms) return false;

    // Map tab/feature names to our checkbox keys:
    if (tab === "Dashboard" || tab === "adminPanel") {
      return perms.adminDashboard || perms.ownerDashboard;
    }
    if (tab === "Owner Dashboard") {
      return perms.ownerDashboard;
    }
    if (tab === "Permission Manager") {
      return perms.permissionManager;
    }
    if (tab === "Tournament Management") {
      return perms.tournamentManagement;
    }
    if (tab === "Scrim Management") {
      return perms.scrimManagement;
    }
    if (tab === "Staff Controls") {
      return perms.staffControls;
    }
    if (tab === "Security Controls" || tab === "securityGuardian") {
      return perms.securityControls;
    }
    if (tab === "Financial Controls") {
      return perms.financialControls;
    }
    if (tab === "Database Controls") {
      return perms.databaseControls;
    }
    if (tab === "System Controls" || tab === "layoutProtection") {
      return perms.systemControls;
    }
    if (tab === "User Management" || tab === "Member Management") {
      return perms.userManagement;
    }

    // Default legacy tab mappings
    if (tab === "Team Hub") {
      return ["Owner", "Head Admin", "Admin", "Team Captain", "Member", "Recruit", "Squad Leader", "Verified Player"].includes(role);
    }
    if (tab === "Strategy Room") {
      return ["Owner", "Head Admin", "Admin", "Team Captain", "Member", "Squad Leader", "Verified Player"].includes(role);
    }
    if (tab === "Scrims") {
      return ["Owner", "Head Admin", "Admin", "Team Captain", "Member", "Squad Leader", "Verified Player"].includes(role);
    }
    if (tab === "Vault") {
      return ["Owner", "Head Admin", "Admin", "Team Captain", "Member", "Squad Leader", "Verified Player"].includes(role);
    }
    if (tab === "Recruitment") {
      return ["Owner", "Head Admin", "Admin", "Team Captain", "Member", "Recruit", "Squad Leader", "Verified Player", "Visitor", "Guest"].includes(role);
    }

    const rolesPermissions = permissions[role] || [];
    return rolesPermissions.includes(tab);
  };

  const isCompact = isSidebarCompact || isTablet;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-[#ff001f] selection:text-white custom-scrollbar relative overflow-x-hidden">
      
      {/* 🔮 SCI-FI ESPORTS INITIAL CLIENT LOADING ANIMATION OVERLAY */}
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-6 select-none scanline-overlay text-left font-mono"
          >
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
            
            <div className="max-w-md w-full space-y-8 relative z-10">
              {/* Pulsating brand neon central logo */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t border-b border-dashed border-[#ff001f] opacity-80 shadow-[0_0_15px_rgba(255,0,31,0.4)]"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-1 rounded-full border-r-2 border-l-2 border-[#ff001f] shadow-[0_0_20px_rgba(255,0,31,0.6)]"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="absolute w-16 h-16 bg-red-950/40 rounded-full border border-red-500/30 flex items-center justify-center"
                  >
                    <Flame className="text-[#ff001f] animate-pulse fill-red-500/10" size={28} />
                  </motion.div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold font-sans text-white tracking-tight uppercase">
                    CRIMSON <span className="text-[#ff001f]">VIPERS</span>
                  </h2>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-[0.25em] font-mono font-bold">
                    PREMIUM ESPORTS CLAN SYSTEM
                  </p>
                </div>
              </div>

              {/* Loader telemetry console panel */}
              <div className="space-y-4 bg-neutral-950/90 p-5 rounded-2xl border border-zinc-900 shadow-[0_0_35px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-center text-[8px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                  <span>SYSTEM BOOT ENLISTING PORTAL</span>
                  <span className="text-[#ff001f] tracking-widest">{bootProgress}% SECURED</span>
                </div>

                <div className="h-2 w-full bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: `${bootProgress}%` }}
                    className="h-full bg-gradient-to-r from-red-750 via-[#ff001f] to-red-500 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(255,0,31,0.6)]"
                  />
                </div>

                <div className="flex items-center gap-2.5 text-[10px] text-zinc-300 font-mono italic">
                  <span className="w-2 h-2 bg-[#ff001f] rounded-full animate-ping shrink-0" />
                  <span className="truncate uppercase font-bold text-zinc-400">{bootStep}</span>
                </div>
              </div>

              <div className="text-center font-mono text-[8px] text-zinc-600 tracking-wider">
                © 2026 CRIMSON VIPERS ORG. FORGE THE FIRE, CLAIM YOUR LEGACY.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 PREMIUM MULTI-BACKGROUND & DYNAMIC AESTHETICS OVERLAY */}
      <CVAestheticEffects activeTab={activeTab} />
      
      {/* 🔮 CUSTOM ESPORTS FLOATING TOAST NOTIFICATIONS LAYER */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="pointer-events-auto bg-[#0b0505]/95 backdrop-blur-md border border-[#ff001c]/40 text-stone-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-[0_4px_25px_rgba(255,0,28,0.2)] font-mono text-xs relative overflow-hidden select-none"
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff001c]" />
              
              <div className="flex items-center gap-3 pl-1">
                <Sparkles className="text-[#ff001c] shrink-0 animate-pulse" size={16} />
                <span className="leading-relaxed font-semibold">{toast.message}</span>
              </div>
              
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      

      {/* FLASH NOTIFICATION ALERTS BANNER */}
      {systemAlertMessage && (
        <div className="bg-red-900/90 text-white border-b border-red-500 py-2.5 px-4 text-center text-xs font-mono flex items-center justify-center gap-3 animate-fade-in">
          <Sparkles size={14} className="text-red-400 animate-pulse" />
          <span>{systemAlertMessage}</span>
          <button onClick={() => setSystemAlertMessage("")} className="text-gray-400 hover:text-white cursor-pointer ml-3">
            <X size={14} />
          </button>
        </div>
      )}

      {/* PRIMARY ECOSYSTEM NAVIGATION */}
      <header className="bg-[#050505]/95 backdrop-blur-[20px] border-b border-zinc-900 sticky top-0 z-40 lg:h-20 flex items-center w-full">
        <div className="max-w-[1700px] mx-auto px-6 w-full flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-4 py-2 lg:py-0">
          <div className="flex items-center justify-between w-full lg:w-auto py-1 lg:py-0">
            <div 
              className="flex items-center gap-3 select-none cursor-pointer group" 
              onClick={() => setActiveTab("home")}
            >
              <div className="w-10 h-10 bg-[#ff001f] rounded flex items-center justify-center font-black text-white shadow-[0_0_18px_rgba(255,0,31,0.6)] transition-all duration-300 group-hover:scale-110 shrink-0">
                <Zap className="fill-white text-white rotate-12 shrink-0" size={20} />
              </div>
              <div className="text-left">
                <span className="text-white font-black tracking-widest text-xl font-orbitron flex items-center gap-0.5 leading-none">
                  FEAR<span className="text-[#ff001c] font-black">.</span>4FANGZ
                </span>
                <span className="text-[8px] text-zinc-500 tracking-[0.25em] font-mono block uppercase mt-0.5">FEAR CHAMPION HUB</span>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => {
                setIsMobileSidebarOpen(prev => !prev);
                playInteractionSound("click");
              }}
              type="button"
              className="md:hidden p-2 text-zinc-400 hover:text-white bg-zinc-950/40 hover:bg-zinc-900 border border-zinc-900 rounded-lg cursor-pointer transition-all shrink-0 ml-4 flex items-center justify-center"
              title="Toggle Navigation Menu"
            >
              <Menu size={20} className={isMobileSidebarOpen ? "text-[#ff001f]" : ""} />
            </button>
          </div>
 
          {/* Centered Navigation Links with Crimson Esports Dropdown System */}
          <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 lg:gap-3.5 py-2 font-chakra font-bold z-50 text-xs">
            {CV_NAV_STRUCTURE.map((item) => {
              // Check if user has overall access to this group (e.g. Admin Panel)
              const hasGroupAccess = !item.requires || hasTabPermission(session.role, item.requires);
              if (!hasGroupAccess) return null;

              const isDropdown = item.type === "dropdown";
              const isCurrentOpen = openDropdownId === item.id;
              
              // Determine if this navigation channel is considered active based on state
              const isParentActive = 
                (item.id === "home" && activeTab === "home") ||
                (item.id === "tournaments" && (activeTab === "tournaments" || activeTab === "leaderboards")) ||
                (item.id === "team" && activeTab === "team") ||
                (item.id === "media" && activeTab === "media") ||
                (item.id === "community" && (activeTab === "news" || activeTab === "recruitment")) ||
                (item.id === "memberArea" && ["feed", "strategy", "scrims", "rewards", "bases"].includes(activeTab)) ||
                (item.id === "adminPanel" && activeTab === "dashboard");

              return (
                <div 
                  key={item.id} 
                  className="relative cv-nav-dropdown-container inline-block"
                  onMouseLeave={() => {
                    if (window.innerWidth >= 1024) {
                      setOpenDropdownId(null);
                    }
                  }}
                >
                  <button
                    id={`cv-nav-btn-${item.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDropdown) {
                        setOpenDropdownId(isCurrentOpen ? null : item.id);
                      } else {
                        handleDropdownAction(item.action);
                      }
                    }}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 1024 && isDropdown) {
                        setOpenDropdownId(item.id);
                      }
                    }}
                    className={`transition-all duration-300 py-1.5 px-2.5 text-[11px] font-black tracking-widest relative cursor-pointer uppercase flex items-center gap-1 hover:scale-105 select-none font-orbitron rounded-md border border-transparent ${
                      isParentActive
                        ? "text-[#ff001f] drop-shadow-[0_0_12px_rgba(255,0,31,0.5)]"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isDropdown && (
                      <ChevronDown 
                        size={11} 
                        className={`transition-all duration-300 transform ${
                          isCurrentOpen 
                            ? "rotate-180 text-[#ff001f] drop-shadow-[0_0_5px_#ff001f]" 
                            : "text-zinc-500 group-hover:text-white"
                        }`} 
                      />
                    )}
                    {isParentActive && (
                      <span className="hidden lg:block absolute bottom-[-14px] lg:bottom-[-22px] left-0 right-0 h-[3px] bg-[#ff001f] rounded-t shadow-[0_0_12px_#ff001f]" />
                    )}
                  </button>

                  {/* Dropdown Menu overlay */}
                  <AnimatePresence>
                    {isDropdown && isCurrentOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 mt-2.5 w-[240px] sm:w-[270px] bg-[#0A0A0A]/95 border-2 border-[#D1001F]/40 hover:border-[#D1001F] rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.95)] z-[999] overflow-hidden backdrop-blur-xl"
                      >
                        {/* Red glow neon accent line */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D1001F] to-transparent animate-pulse" />
                        
                        <div className="p-2 border-b border-zinc-900 bg-[#121212]/80 font-mono text-[8px] text-zinc-500 tracking-widest uppercase flex items-center justify-between">
                          <span>SECTOR PROTOCOL</span>
                          <span className="flex items-center gap-1 text-[#ff001c] font-black leading-none shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            SECURE
                          </span>
                        </div>

                        <div className="p-1 space-y-0.5 max-h-[350px] overflow-y-auto no-scrollbar">
                          {item.links.map((link) => {
                            const linkAllowed = !link.requires || hasTabPermission(session.role, link.requires);

                            return (
                              <button
                                key={`${link.action}-${link.label}`}
                                type="button"
                                onClick={() => handleDropdownAction(link.action, link.requires)}
                                className={`w-full p-2 rounded-lg transition-all duration-200 text-left flex flex-col gap-0.5 relative group/item cursor-pointer overflow-hidden ${
                                  !linkAllowed 
                                    ? "opacity-40 hover:opacity-50" 
                                    : "hover:bg-[#D1001F]/10 border border-transparent hover:border-[#D1001F]/20"
                                }`}
                              >
                                {/* Lightning laser backdrop hover flash */}
                                <div className="absolute inset-0 bg-gradient-to-r from-red-650/10 via-transparent to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                                <div className="flex items-center justify-between pointer-events-none w-full relative z-10">
                                  <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 group-hover/item:bg-[#D1001F] transition-colors" />
                                    <span className="text-[11px] font-bold text-zinc-250 group-hover/item:text-white font-chakra uppercase tracking-wide">
                                      {link.label}
                                    </span>
                                  </div>

                                  {link.tag ? (
                                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-black uppercase tracking-wider ${link.tagColor}`}>
                                      {link.tag}
                                    </span>
                                  ) : !linkAllowed ? (
                                    <Lock size={10} className="text-[#D1001F]" />
                                  ) : (
                                    <ChevronRight size={10} className="opacity-0 group-hover/item:opacity-100 translate-x-[-3px] group-hover/item:translate-x-0 transition-all text-[#D1001F]" />
                                  )}
                                </div>

                                {link.desc && (
                                  <span className="text-[9px] text-zinc-500 group-hover/item:text-zinc-400 font-mono pl-3 leading-snug transition-colors pointer-events-none">
                                    {link.desc}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
 
          {/* Right Header Actions matching Mockup */}
          <div className="flex items-center gap-4 text-[11px] font-orbitron font-bold">
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                toggleTheme();
                playInteractionSound("click");
                setSystemAlertMessage(`🌓 Switched theme environment to ${theme === "dark" ? "LIGHT" : "DARK"} mode.`);
              }}
              className="p-2 rounded-lg border border-zinc-800 hover:border-[#ff001c]/40 text-zinc-400 hover:text-white bg-zinc-950/40 hover:bg-zinc-900/50 cursor-pointer transition-all duration-300 flex items-center justify-center shadow-[0_0_8px_rgba(0,0,0,0.5)]"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun size={14} className="text-amber-500 animate-pulse" />
              ) : (
                <Moon size={14} className="text-[#ff001f]" />
              )}
            </button>

            {/* Global Sound Toggle Button */}
            <button
              id="global-sound-toggle-btn"
              onClick={() => {
                toggleGlobalSound();
                setSystemAlertMessage(
                  !globalSoundEnabled 
                    ? "🔊 Interaction sound feedback enabled." 
                    : "🔇 Interaction sound feedback muted."
                );
              }}
              className={`p-2 rounded-lg border hover:border-[#ff001c]/40 cursor-pointer transition-all duration-300 flex items-center justify-center shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                globalSoundEnabled 
                  ? "border-emerald-900/50 text-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20" 
                  : "border-zinc-800 text-zinc-500 bg-zinc-950/40 hover:bg-zinc-900/50 hover:text-white"
              }`}
              title={globalSoundEnabled ? "Mute UI Sounds" : "Unmute UI Sounds"}
            >
              {globalSoundEnabled ? (
                <Volume2 size={14} className="animate-pulse" />
              ) : (
                <VolumeX size={14} />
              )}
            </button>

            {(hasTabPermission(session.role, "Staff Controls") || hasTabPermission(session.role, "Dashboard")) && (
              <button
                onClick={() => {
                  setIsManagementPortalOpen(true);
                  playInteractionSound("click");
                  setSystemAlertMessage("👑 Opening Dedicated Fear Arena Management Portal...");
                }}
                id="fear-mgmt-portal-access-btn"
                className="px-3.5 py-1.5 border border-amber-600/60 rounded text-amber-500 bg-[#0d0703]/80 hover:bg-amber-600/10 hover:border-amber-500 transition-all duration-300 font-black tracking-widest text-[10px] cursor-pointer uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
              >
                <Shield size={11} className="text-amber-500 animate-pulse" />
                <span>👑 MGMT PORTAL</span>
              </button>
            )}
            <div className="h-4 w-[1px] bg-zinc-800" />
            <button 
              onClick={() => {
                setShowLoginModal(true);
                playInteractionSound("click");
                setSystemAlertMessage("🔑 Accessing Fear Arena Login Portal...");
              }}
              className="text-zinc-400 hover:text-[#ff001f] transition-all duration-305 cursor-pointer tracking-widest uppercase hover:scale-105"
            >
              LOGIN
            </button>
            <button 
              onClick={() => {
                setShowSignUpModal(true);
                playInteractionSound("click");
                setSystemAlertMessage("🛡️ Loading CV Recruits Welcome Package...");
              }}
              className="px-5 py-2 border border-[#ff001f] rounded text-[#ff001f] bg-transparent hover:bg-[#ff001f]/10 transition-all duration-300 font-black tracking-widest text-[11px] cursor-pointer uppercase"
            >
              SIGN UP
            </button>
          </div>
        </div>
      </header>

      {/* TAB NAVIGATION RAIL & MAIN ROW */}
      <div className="relative z-10 max-w-[1700px] mx-auto px-4 py-6 flex-1 w-full flex flex-col lg:flex-row gap-6">
        
        {/* SIDE BAR LAYOUT FOR TAB TRIGGERS */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <motion.aside
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`shrink-0 flex-col gap-4 transition-all duration-300 md:flex ${
            isCompact ? "w-18" : "w-18 lg:w-64"
          } ${
            isMobileSidebarOpen 
              ? "fixed inset-y-0 left-0 z-50 bg-[#0c0c0e]/98 border-r border-zinc-900 p-6 w-72 h-full overflow-y-auto flex shadow-2xl animate-fade-in" 
              : "hidden md:flex"
          }`}
        >
          
          {/* Top layout controller for desktop/tablet/mobile */}
          <div className="flex items-center justify-between bg-[#111111] p-2.5 rounded-xl border border-zinc-900 text-xs font-bold leading-none shrink-0">
            <span className={`text-[9px] text-[#ff001c] font-black uppercase font-mono tracking-widest ${isCompact ? "hidden" : "block"}`}>
              CONSOLE MODE
            </span>
            <button
              onClick={() => setIsSidebarCompact(prev => !prev)}
              type="button"
              className="p-1 px-2 bg-zinc-900 hover:bg-[#ff001f] hover:text-white border border-zinc-800 rounded text-[9px] font-mono hover:scale-105 duration-100 uppercase tracking-widest flex items-center gap-1 cursor-pointer mx-auto lg:mx-0 leading-none font-extrabold"
              title={isCompact ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCompact ? "» EXP" : "« COMP"}
            </button>
            {isMobileSidebarOpen && (
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden p-1 text-zinc-550 hover:text-[#ff001f] rounded cursor-pointer leading-none"
                title="Close Drawer"
              >
                <X size={12} />
              </button>
            )}
          </div>
          
           {/* USER ROSTER WALLET & LEVEL CARD */}
          <div className="bg-[#111111] p-4 rounded-xl border border-gray-800 shadow-xl space-y-4">
            <button
              onClick={() => {
                setActiveTab("passport");
                setSystemAlertMessage("🛂 Accessing your live Verified CV Esports Passport...");
              }}
              className="w-full flex items-center gap-3 hover:bg-zinc-900/60 p-1.5 -m-1.5 rounded-lg transition-all text-left group cursor-pointer"
              title="Click to view CV Esports Passport"
            >
              <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center font-mono text-base font-black text-red-500 shadow group-hover:scale-105 transition-transform shrink-0">
                {session.ign ? session.ign[0].toUpperCase() : "C"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="text-xs font-bold text-gray-200 font-mono truncate group-hover:text-red-400 transition-colors">{session.ign}</span>
                  {session.verified && <span className="text-[#FF001C] text-[10px]" title="CV Verified Player">🛡️</span>}
                </div>
                <span className="text-[9px] text-[#FF001C] tracking-wider font-extrabold uppercase">{session.role}</span>
              </div>
            </button>

            <div className="space-y-2 border-t border-gray-800/80 pt-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>BATTLE PASS TRACK</span>
                <span className="text-gray-300 font-bold">LVL {session.battlePassLevel}</span>
              </div>
              <div className="w-full bg-gray-950 rounded-full h-2 relative overflow-hidden border border-gray-850">
                <div
                  className="bg-gradient-to-r from-[#FF001C] to-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(session.battlePassXp / 200) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-gray-550">
                <span>{session.battlePassXp}/200 XP</span>
                <span className="text-red-400">Next level gains +300 Coins!</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-black/40 p-2 py-1.5 px-3 rounded border border-gray-850 text-xs font-bold font-mono">
              <div className="flex items-center gap-1.5 text-red-500">
                <Coins size={14} className="text-red-500 animate-pulse" />
                <span>{session.coins}</span>
              </div>
              <span className="text-[9px] text-gray-500 uppercase font-black">CV COINS</span>
            </div>

            <button
              onClick={() => {
                setActiveTab("settings");
                setSystemAlertMessage("📱 Loading WhatsApp Linking Center...");
              }}
              className={`w-full py-2 rounded font-mono text-[9.5px] font-black uppercase transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                waLinkedState 
                  ? "bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-900/40 text-emerald-400"
                  : "bg-red-950/25 hover:bg-[#ff001c]/10 border-red-500/30 text-red-400"
              }`}
            >
              <span>{waLinkedState ? "🟢 WhatsApp: Connected" : "⚠️ Link WhatsApp Now"}</span>
            </button>
          </div>

          {/* DEDICATED SIDEBAR COMMUNITY PLAYGROUND BUTTONS */}
          <div className="bg-[#111111] p-3 rounded-xl border border-emerald-950/40 shadow-xl space-y-2 text-left">
            <h3 className="text-[9px] font-black text-[#10b981] font-mono tracking-widest uppercase">
              ⚡ COMPLIANCE ACTIONS
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setCommunityHubInitialTab("hosting");
                  setActiveTab("communityHub");
                  setSystemAlertMessage("🏆 Opening community hosting permit requests screen...");
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-transparent hover:scale-103 duration-100 cursor-pointer text-center"
              >
                🏆 Host a Tournament
              </button>
              <button
                onClick={() => {
                  setCommunityHubInitialTab("teams");
                  setActiveTab("communityHub");
                  setSystemAlertMessage("👥 Opening community crew creator...");
                }}
                className="w-full py-2 bg-[#1A1A1A] hover:bg-[#252525] text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg border border-emerald-950/40 hover:scale-103 duration-100 cursor-pointer text-center"
              >
                👥 Create a Team
              </button>
            </div>
          </div>
          
          <div className="bg-[#111111] p-4 rounded-xl border border-gray-800 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-gray-400 font-mono tracking-widest uppercase">
              MAIN CATEGORIES
            </h3>

            <nav className="flex flex-col gap-1">
              {[
                { id: "home", label: "Home Arena", icon: Trophy, category: "public" },
                { id: "passport", label: "Fear Passport 🛂", icon: UserCheck, category: "public" },
                { id: "clanchat", label: "Clan Chat Intercom", icon: MessageSquare, category: "public" },
                { id: "worldChat", label: "World Social Chat 🌐", icon: Globe, category: "public" },
                { id: "tournaments", label: "Tournaments", icon: Gamepad2, category: "public" },
                { id: "tdmArena", label: "Fear Arena ⚔️", icon: Shield, category: "public" },
                { id: "tdm", label: "TDM Arena Customizer", icon: Flame, category: "public" },
                { id: "wow", label: "WOW Creator", icon: Sparkles, category: "public" },
                { id: "teamwar", label: "Team War Map", icon: Map, category: "public" },
                { id: "team", label: "Active Roster", icon: Users, category: "public" },
                { id: "strategy", label: "Tactical & Coach AI", icon: Shield, category: "public" },
                { id: "media", label: "Media & Highlights", icon: ImageIcon, category: "public" },
                { id: "news", label: "News & Bulletins", icon: Newspaper, category: "public" },
                { id: "recruitment", label: "Join Recruitment", icon: Award, category: "public" },
                { id: "communitySquads", label: "Community Squads", icon: Users, category: "public" },
                { id: "communityHub", label: "🌐 Community Playground", icon: Compass, category: "public" },
                { id: "layoutProtection", label: "🛡️ Layout Guard Deck", icon: ShieldCheck, category: "public" },
                { id: "seoPreview", label: "SEO & Search Preview 🔍", icon: Search, category: "public" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === "clanchat") {
                        setIsChatOpen(true);
                        setChatUnreadCount(0);
                      }
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                      activeTab === item.id
                        ? "bg-red-600 font-bold text-white shadow-lg shadow-red-950/40"
                        : "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={`${activeTab === item.id ? "text-white" : "text-gray-400"} shrink-0`} />
                      <span className="truncate">{item.label}</span>
                      {item.id === "clanchat" && chatUnreadCount > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-[#ff001c] text-white text-[9px] font-black font-mono rounded-full animate-bounce shadow-[0_0_8px_#ff001c] shrink-0">
                          {chatUnreadCount}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={12} className={activeTab === item.id ? "rotate-90 transition-transform" : "opacity-40"} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* PRIVATE COMM-CHANNELS SUBSECTION */}
          <div className="bg-[#111111] p-4 rounded-xl border border-gray-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-red-500 font-mono tracking-widest uppercase">
                PRIVATE SECTORS
              </h3>
              <Lock size={12} className="text-red-500 animate-pulse" />
            </div>

            <nav className="flex flex-col gap-1">
              {[
                { id: "feed", label: " Roster bulletin board", icon: Tv, requires: "Team Hub" },
                { id: "scrims", label: " Scrim & Scheduling", icon: Calendar, requires: "Scrims" },
                { id: "settings", label: waLinkedState ? " 🟢 WhatsApp Center" : " 📱 Link WhatsApp ⚠️", icon: Phone, requires: "Team Hub" },
                { id: "securityGuardian", label: " Security Shield & Auto-Fix", icon: ShieldCheck, requires: "Team Hub" },
                { id: "dashboard", label: " Owner Cmd Center", icon: Crown, requires: "Dashboard" },
                { id: "bases", label: " Elite Bases Map", icon: Sparkles, requires: "Strategy Room" },
                { id: "rewards", label: " Fear Coin Rewards Store", icon: Coins, requires: "Team Hub" }
              ].map((item) => {
                const Icon = item.icon;
                const userHasAccess = hasTabPermission(session.role, item.requires);

                return (
                  <button
                    key={item.id}
                    disabled={!userHasAccess}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between text-xs transition-all relative ${
                      !userHasAccess ? "opacity-35 cursor-not-allowed text-gray-600" : "cursor-pointer"
                    } ${
                      activeTab === item.id
                        ? "bg-[#ff001f] font-bold text-white shadow-lg"
                        : "text-gray-400 hover:bg-[#1E1E1E] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={!userHasAccess ? "text-gray-600" : "text-white"} />
                      <span>{item.label}</span>
                    </div>
                    {!userHasAccess ? (
                      <Lock size={11} className="text-gray-500" />
                    ) : (
                      <Unlock size={11} className="text-white" />
                    )}
                  </button>
                );
              })}
            </nav>
            <p className="text-[10px] text-gray-500 italic mt-2">
              ⚠️ Simulated lock adaptively modifies as you click simulator roles in the bottom left switcher panel.
            </p>
          </div>

          {/* ACTIVE SPONSOR ADVERTISEMENT HIGHLIGHT */}
          <div className="bg-[#151515] rounded-xl border border-red-500/15 p-3.5 space-y-2">
            <span className="text-[9px] text-red-500 font-mono tracking-widest uppercase font-extrabold">CV SPONSOR SPOTLIGHT</span>
            <div className="h-20 bg-cover bg-center rounded border border-gray-800 flex items-center justify-center relative overflow-hidden" 
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300')" }}>
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative text-center p-2">
                <p className="text-xs font-black text-white leading-tight">ROG INTEL ALLY v2</p>
                <p className="text-[9px] text-red-400 font-mono font-bold uppercase mt-1">Sponsorship codes: "CV_SQUAD_PRO"</p>
              </div>
            </div>
          </div>

          {/* SECURITY SIMULATOR ROLE SWITCHER CONTROLLER */}
          <div className={`bg-[#111111] p-4 rounded-xl border ${getRoleColors(session.role).borderClass}/30 ${getRoleColors(session.role).shadowClass}/40 shadow-md space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-mono tracking-widest uppercase font-black ${getRoleColors(session.role).textClass}`}>ROLE SIMULATOR</span>
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${session.role === "Owner" ? "bg-[#FF001C]" : ["Admin", "Head Admin", "Team Captain"].includes(session.role) ? "bg-[#FFD700]" : "bg-[#00FF9D]"}`} />
            </div>
            
            <div className="text-[10px] font-mono leading-tight">
              <span className="text-gray-500 block text-[8px] uppercase font-bold tracking-wider">Security Clearance</span>
              <span className={`font-black uppercase tracking-wider ${getRoleColors(session.role).textClass}`}>
                🔐 {
                  session.role === "Owner" ? "FULL ROOT ACCESS" :
                  session.role === "Team Captain" ? "COMMANDER ACCESS" :
                  session.role === "Member" ? "STANDARDIZED SECTOR" : "SANDBOX PLAYGROUND"
                }
              </span>
            </div>

            {/* Glowing Pill Dropper */}
            <div className="relative w-full">
              <button
                id="active-persona-pill-btn"
                onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                className={`w-full relative inline-flex items-center justify-between gap-3 px-4 py-2 bg-gradient-to-r from-stone-950 to-neutral-900 text-white rounded-full border-2 ${getRoleColors(session.role).borderClass} ${getRoleColors(session.role).shadowClass} ${getRoleColors(session.role).hoverShadowClass} font-orbitron font-black text-[11px] h-9 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  {session.role === "Owner" && <span>👑 OWNER CORE</span>}
                  {session.role === "Head Admin" && <span>🔥 HEAD ADMIN</span>}
                  {session.role === "Admin" && <span>⚡ ADMIN</span>}
                  {session.role === "Moderator" && <span>🔮 MODERATOR</span>}
                  {session.role === "Team Captain" && <span>⚡ CAPTAIN CORE</span>}
                  {session.role === "Squad Leader" && <span>💠 SQUAD LEADER</span>}
                  {session.role === "Verified Player" && <span>🛡️ VERIFIED</span>}
                  {session.role === "Member" && <span>🎯 MEMBER UNIT</span>}
                  {session.role === "Recruit" && <span>⭐ RECRUIT APPL</span>}
                  {session.role === "Visitor" && <span>👣 VISITOR</span>}
                  {session.role === "Guest" && <span>👤 GUEST</span>}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-300 shrink-0 ${getRoleColors(session.role).chevronClass} ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* DROPDOWN OVERLAY PANEL */}
              {isRoleDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsRoleDropdownOpen(false)} 
                  />
                  <div 
                    id="persona-dropdown-menu"
                    className={`absolute left-0 bottom-full mb-2 w-full bg-black border-2 ${getRoleColors(session.role).borderClass} rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.95)] z-50 overflow-hidden font-sans text-left animate-fade-in`}
                  >
                    <div className="p-2 border-b border-zinc-900 bg-stone-950 font-mono text-[8px] text-gray-500 tracking-widest uppercase">
                      SELECT DECOY PERSONA
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {[
                        { role: "Owner" as UserRole, label: "👑 OWNER", desc: "Full Unrestricted Override", color: "text-[#FF001C]" },
                        { role: "Head Admin" as UserRole, label: "🔥 HEAD ADMIN", desc: "Command Staff Access", color: "text-[#FF4500]" },
                        { role: "Admin" as UserRole, label: "⚡ ADMIN", desc: "Sub-Level Operations Module", color: "text-[#FFD700]" },
                        { role: "Moderator" as UserRole, label: "🔮 MODERATOR", desc: "Auditor Sector Viewport", color: "text-[#C084FC]" },
                        { role: "Team Captain" as UserRole, label: "🌟 TEAM CAPTAIN", desc: "Commander Decolink Access", color: "text-[#F59E0B]" },
                        { role: "Squad Leader" as UserRole, label: "💠 SQUAD LEADER", desc: "Tactical Squad Control", color: "text-[#06B6D4]" },
                        { role: "Verified Player" as UserRole, label: "🛡️ VERIFIED PLAYER", desc: "Certified Participant", color: "text-[#3B82F6]" },
                        { role: "Member" as UserRole, label: "🎯 ACTIVE MEMBER", desc: "Standard Sector Access", color: "text-[#00FF9D]" },
                        { role: "Recruit" as UserRole, label: "⭐ RECRUIT CANDIDATE", desc: "Roster Audit Only", color: "text-[#34D399]" },
                        { role: "Visitor" as UserRole, label: "👣 VISITOR", desc: "Spectator Clearance Only", color: "text-[#94A3B8]" },
                        { role: "Guest" as UserRole, label: "👤 GUEST", desc: "Read-Only Sandbox Clearance", color: "text-[#64748B]" }
                      ].map((item) => (
                        <button
                          key={item.role}
                          onClick={() => {
                            setSession(prev => ({ ...prev, role: item.role }));
                            setSystemAlertMessage(`🎭 Identity shifted to: ${item.role}`);
                            setIsRoleDropdownOpen(false);
                            // If switching to Recruit/Visitor/Guest, move activeTab to home if restricted
                            if (["Recruit", "Visitor", "Guest"].includes(item.role) && activeTab !== "home" && activeTab !== "recruitment" && activeTab !== "team" && activeTab !== "leaderboards") {
                              setActiveTab("home");
                            }
                          }}
                          className={`w-full p-2.5 hover:bg-neutral-900 cursor-pointer transition-all duration-200 border-b border-zinc-900/50 last:border-0 text-left flex flex-col ${
                            session.role === item.role ? "bg-red-950/40" : ""
                          }`}
                        >
                          <span className={`text-[10px] font-black font-orbitron tracking-wide ${item.color}`}>
                            {item.label}
                          </span>
                          <span className="text-[8px] text-gray-400 font-mono">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </motion.aside>

        {/* PRIMARY LAYOUT CONTENT SPACE */}
        <main className="flex-grow min-w-0">
          <AnimatePresence mode="wait">
            {activeComplianceCategory && !checkRuleAcceptance(activeComplianceCategory) ? (
              <motion.div
                key="compliance-gate"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <RulesComplianceGate
                  categoryId={activeComplianceCategory}
                  currentIgn={session.ign}
                  onAgree={() => handleGateAgree(activeComplianceCategory)}
                />
              </motion.div>
            ) : isPlatformLocked && session.role !== "Owner" ? (
              <motion.div
                key="platform-locked"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black border-2 border-red-950 p-8 rounded-2xl text-center space-y-6 relative max-w-2xl mx-auto my-12 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.15)] font-mono text-left"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_50%,rgba(0,0,0,0)_50%)] bg-[size:100%_4px] pointer-events-none" />
                <div className="absolute -right-24 -top-24 w-48 h-48 bg-red-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-[#ff001c]/10 rounded-full border-2 border-[#ff001c] flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(255,0,0,0.4)] animate-bounce mb-2">
                    <Lock size={28} className="text-[#ff001c]" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-orbitron font-black text-white uppercase tracking-widest leading-none">
                    🚨 SECURE LEVEL COMPLIANCE SHIELD ENGAGED
                  </h1>
                  <span className="text-[10px] text-red-500 font-bold border border-red-500/30 px-2 py-0.5 rounded tracking-widest font-mono uppercase bg-red-950/20">
                    EXECUTIVE OVERRIDE ENABLED BY SYSTEM OWNER
                  </span>
                  <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
                    This sector and general public portals have been temporarily lock-shielded under protocol <strong className="text-white">CV_LOCK_900_SHIELD</strong>. 
                    All tournament servers, scrim brackets, custom profiles, and market store assets are read-only suspended to secure database sync indexes.
                  </p>
                </div>

                <div className="border-t border-red-950 pt-6 space-y-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Are you a member of the Administration Staff?
                  </p>
                  
                  <button
                    onClick={() => setIsManagementPortalOpen(true)}
                    className="mx-auto inline-flex items-center gap-2 px-5 py-2.5 bg-red-950 hover:bg-red-800 border border-red-500 text-white font-orbitron font-black text-[11px] uppercase rounded-lg cursor-pointer duration-150 tracking-wider shadow-[0_0_15px_rgba(255,0,31,0.3)] hover:scale-105"
                  >
                    <Unlock size={12} className="animate-pulse" />
                    <span>👑 ACCESS OPERATIONS MANAGEMENT COMPONENT</span>
                  </button>
                </div>
              </motion.div>
            ) : isMaintenanceMode && session.role !== "Owner" ? (
              <motion.div
                key="maintenance-mode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black border-2 border-red-950 p-8 rounded-2xl text-center space-y-6 relative max-w-2xl mx-auto my-12 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] font-mono text-left"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_50%,rgba(0,0,0,0)_50%)] bg-[size:100%_4px] pointer-events-none" />
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] mb-2 animate-pulse">
                    <RefreshCw size={28} className="text-amber-500" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-orbitron font-black text-white uppercase tracking-widest leading-none">
                    ⚙️ CV GRID SYSTEM ACTIVE MAINTENANCE
                  </h1>
                  <span className="text-[10px] text-amber-500 font-bold border border-amber-500/30 px-2 py-0.5 rounded tracking-widest font-mono uppercase bg-amber-955/20">
                    HARDWARE BIO-FLASHING LIVE IN SEC09
                  </span>
                  <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
                    The principal host database cluster is undergoing safe replication optimizations and packet latency grooming. 
                    Normal operations will serve normal state indices immediately upon system flash complete.
                  </p>
                </div>

                <div className="border-t border-red-950 pt-6 space-y-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Authorize operations credentials bypass:
                  </p>
                  
                  <button
                    onClick={() => setIsManagementPortalOpen(true)}
                    className="mx-auto inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-zinc-800 text-zinc-300 hover:text-white font-orbitron font-black text-[11px] uppercase rounded-lg cursor-pointer duration-150 tracking-wider hover:scale-105"
                  >
                    <Settings size={12} className="text-amber-500 animate-pulse" />
                    <span>👑 GO TO SECURITY PORTAL</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >

          {/* 1. TAB: HOME / LOBBY ARENA */}
          {activeTab === "home" && (
            <div className="space-y-6">
              
              {/* BRAND HERO HIGHLIGHTS BANNER MATCHING MOCKUP DESIGN */}
              <div 
                className="relative overflow-hidden rounded-2xl border border-red-950 p-6 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[440px] bg-black"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 30%, rgba(139, 0, 0, 0.25) 0%, rgba(0, 0, 0, 1) 70%), url('https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1200')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {/* Simulated ambient electric lightning flashes overlay */}
                <div className="absolute inset-0 bg-[#FF001C]/5 mix-blend-color-dodge opacity-50 pointer-events-none animate-pulse" />

                {/* Left Side: Mockup Large Crimson Display Statement */}
                <div className="space-y-6 max-w-xl relative z-10 py-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-950/20 border border-red-500/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF001C] animate-pulse" />
                    <span className="text-[10px] text-red-500 font-extrabold tracking-widest uppercase font-mono">SEASON 5 — LIVE</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-none text-white uppercase">
                      FORGE. FIRE.
                    </h1>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-none text-[#FF001C] uppercase">
                      CROWNED IN CRIMSON.
                    </h1>
                  </div>

                  <p className="text-xs text-gray-400 font-semibold max-w-sm leading-relaxed pt-2">
                    Connect and challenge in premier competitive PUBG Mobile tournaments. Secure territory base sectors and claim your legacy.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={() => {
                        setActiveTab("tournaments");
                        setSystemAlertMessage("🏆 Opening official Tournaments bracket registry...");
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-[#ff001f] to-[#d1001f] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg hover:scale-105 hover:shadow-[0_0_20px_#ff001f] active:scale-95 transition-all duration-300 font-orbitron cursor-pointer border border-[#ff001f]/35"
                    >
                      Join Tournament
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("communitySquads");
                        setSystemAlertMessage("👥 Connecting to autonomous Community Squads sector...");
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-[#0d0707] to-zinc-950 text-white border-2 border-[#ef4444] text-[11px] font-extrabold uppercase tracking-wider rounded-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all duration-300 font-orbitron cursor-pointer flex items-center gap-2"
                    >
                      <span>👥 Community Squads</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("tdmArena");
                        setSystemAlertMessage("⚔️ Matchmaking initiated at CV TDM Arena...");
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-zinc-950 to-[#030906] text-white border-2 border-emerald-500 font-extrabold text-[11px] uppercase tracking-wider rounded-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all duration-300 font-orbitron cursor-pointer flex items-center gap-2"
                    >
                      <span>⚔️ CV TDM Arena</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setSystemAlertMessage("📱 Loading WhatsApp Linking Center...");
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all duration-300 font-orbitron cursor-pointer flex items-center gap-2"
                    >
                      <span>{waLinkedState ? "🟢 WA Status: Connected" : "📱 Link WhatsApp"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("leaderboards");
                        setSystemAlertMessage("📈 Launching esports dynamic team ranks directory!");
                      }}
                      className="px-6 py-3.5 bg-transparent text-white border border-[#ff001f]/50 hover:border-[#ff001f] hover:bg-[#ff001f]/10 text-[11px] font-extrabold uppercase tracking-wider rounded-lg hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,31,0.2)] active:scale-95 transition-all duration-300 font-orbitron cursor-pointer"
                    >
                      View Rankings
                    </button>
                  </div>
                </div>

              </div>

              {/* LIVE ANNOUNCEMENT TICKER */}
              <div className="bg-[#111111] border border-gray-800 p-2.5 px-4 rounded-xl flex items-center gap-4 overflow-hidden relative">
                <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-black tracking-widest font-mono shrink-0 uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse inline-block" />
                  LIVE BULLETIN FEED
                </div>
                <div className="h-5 flex-1 relative overflow-hidden font-mono text-[11px] text-gray-300">
                  <div className="absolute whitespace-nowrap animate-pulse">
                     🔥 Congratulations to **CV_Slayer_IGL** matching top Tier 1 MVP rating! • Scrim bookings now open for Friday Bermuda rosters! • Secure dynamic AI reviews inside the Strategy Room tabs!
                  </div>
                </div>
              </div>

              {/* INTEGRATED MODERN HIGHLY VISIBLE COMMUNITY SECTION */}
              <div className="bg-[#0b0c10]/95 border-2 border-emerald-950/40 p-6 rounded-3xl relative overflow-hidden space-y-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.12),transparent_65%)] pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4 relative z-10 text-left">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-950/30 border border-emerald-500/20 rounded-full font-mono text-[9px] text-[#10b981] font-bold">
                      🌍 GLOBAL HUB
                    </div>
                    <h3 className="text-xl font-black font-orbitron tracking-wide text-white uppercase flex items-center gap-2">
                       COMMUNITY GROUND <span className="text-emerald-500 font-sans">PORTAL</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Host community brackets, forge customize alignments & manage team applications, completely separate from our exclusive roster systems.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCommunityHubInitialTab("hosting");
                        setActiveTab("communityHub");
                        setSystemAlertMessage("🏆 Launching tournament approvals request cockpit...");
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all font-mono"
                    >
                      🏆 Host Tournament
                    </button>
                    <button
                      onClick={() => {
                        setCommunityHubInitialTab("teams");
                        setActiveTab("communityHub");
                        setSystemAlertMessage("👥 Launching personalized alignments wizard...");
                      }}
                      className="px-4 py-2 bg-transparent text-white border border-emerald-800 hover:bg-emerald-950/20 text-[10px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all font-mono"
                    >
                      👥 Create Team
                    </button>
                  </div>
                </div>

                {/* Animated cards grid (6-column structured bento cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10 font-mono">
                  
                  {/* Card 1: Host a Tournament */}
                  <div 
                    onClick={() => {
                      setCommunityHubInitialTab("hosting");
                      setActiveTab("communityHub");
                      setSystemAlertMessage("🏆 Opening community hosting permit requests screen...");
                    }}
                    className="bg-zinc-950/90 border border-zinc-900 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between min-h-[170px] cursor-pointer group hover:-translate-y-1 duration-200 text-left"
                  >
                    <div className="space-y-2 text-left">
                      <div className="w-9 h-9 rounded-xl bg-orange-950/40 border border-orange-500/20 text-orange-500 flex items-center justify-center text-lg">
                        🏆
                      </div>
                      <h4 className="text-xs font-black text-white group-hover:text-emerald-400 duration-150 uppercase">Host a Tournament</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                        Request official host codes and permit clearance to sponsor, direct, and broadcast tournaments.
                      </p>
                    </div>
                    <span className="text-[8.5px] text-emerald-400 font-extrabold tracking-wider uppercase mt-4 block">Request Permit →</span>
                  </div>

                  {/* Card 2: Create a Team */}
                  <div 
                    onClick={() => {
                      setCommunityHubInitialTab("teams");
                      setActiveTab("communityHub");
                      setSystemAlertMessage("👥 Opening community crew creator...");
                    }}
                    className="bg-zinc-950/90 border border-zinc-900 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between min-h-[170px] cursor-pointer group hover:-translate-y-1 duration-200 text-left"
                  >
                    <div className="space-y-2 text-left">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-[#10b981]/20 text-[#10b981] flex items-center justify-center text-lg">
                        👥
                      </div>
                      <h4 className="text-xs font-black text-white group-hover:text-[#10b981] duration-150 uppercase">Create a Team</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                        Deploy your unique logos, establish recruitment codes, publish active applications, and direct squads.
                      </p>
                    </div>
                    <span className="text-[8.5px] text-[#10b981] font-extrabold tracking-wider uppercase mt-4 block">Forge Lineup →</span>
                  </div>

                  {/* Card 3: Community Squads */}
                  <div 
                    onClick={() => {
                      setActiveTab("communitySquads");
                      setSystemAlertMessage("👥 Connecting to autonomous Community Squads sector...");
                    }}
                    className="bg-zinc-950/90 border border-red-950 hover:border-red-500 p-5 rounded-2xl flex flex-col justify-between min-h-[170px] cursor-pointer group hover:-translate-y-1 duration-200 text-left"
                  >
                    <div className="space-y-2 text-left">
                      <div className="w-9 h-9 rounded-xl bg-red-955/40 border border-[#ef4444]/20 text-[#ef4444] flex items-center justify-center text-lg font-bold">
                        👥
                      </div>
                      <h4 className="text-xs font-black text-[#ef4444] duration-150 uppercase">Community Squads</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal font-sans">
                        Enlist in local autonomous squads, review leaderboards, and view featured combat clans.
                      </p>
                    </div>
                    <span className="text-[8.5px] text-red-500 font-extrabold tracking-wider uppercase mt-4 block">Open Squads Sector →</span>
                  </div>

                  {/* Card 4: CV TDM Arena */}
                  <div 
                    onClick={() => {
                      setActiveTab("tdmArena");
                      setSystemAlertMessage("⚔️ Opening CV TDM Arena matchmaking console...");
                    }}
                    className="bg-zinc-950/90 border border-emerald-950 hover:border-[#10b981] p-5 rounded-2xl flex flex-col justify-between min-h-[170px] cursor-pointer group hover:-translate-y-1 duration-200 text-left"
                  >
                    <div className="space-y-2 text-left">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-[#10b981]/20 text-[#10b981] flex items-center justify-center text-lg font-bold">
                        ⚔️
                      </div>
                      <h4 className="text-xs font-black text-emerald-400 duration-150 uppercase">CV TDM Arena</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal font-sans">
                        Queue into automated private Kills & Death matchmaking, check leaderboards, and verify matches.
                      </p>
                    </div>
                    <span className="text-[8.5px] text-[#10b981] font-extrabold tracking-wider uppercase mt-4 block">Enter Arena Gate →</span>
                  </div>

                  {/* Card 5: Join a Team */}
                  <div 
                    onClick={() => {
                      setCommunityHubInitialTab("discovery");
                      setActiveTab("communityHub");
                      setSystemAlertMessage("🔥 Opening Community squads recruitment matching board...");
                    }}
                    className="bg-zinc-950/90 border border-zinc-900 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between min-h-[170px] cursor-pointer group hover:-translate-y-1 duration-200 text-left"
                  >
                    <div className="space-y-2 text-left">
                      <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-[#ff001c]/20 text-[#ff001c] flex items-center justify-center text-lg">
                        🔥
                      </div>
                      <h4 className="text-xs font-black text-white group-hover:text-amber-400 duration-150 uppercase">Join a Team</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                        Browse casual recruitment requirements lists, filtering by platform ranks and regional coverage.
                      </p>
                    </div>
                    <span className="text-[8.5px] text-amber-500 font-extrabold tracking-wider uppercase mt-4 block">Browse Ads →</span>
                  </div>

                  {/* Card 6: Browse Tournaments */}
                  <div 
                    onClick={() => {
                      setActiveTab("tournaments");
                      setSystemAlertMessage("🏆 Opening dynamic field maps and tournaments lists...");
                    }}
                    className="bg-zinc-950/90 border border-zinc-900 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between min-h-[170px] cursor-pointer group hover:-translate-y-1 duration-200 text-left"
                  >
                    <div className="space-y-2 text-left">
                      <div className="w-9 h-9 rounded-xl bg-blue-950/40 border border-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                        🌍
                      </div>
                      <h4 className="text-xs font-black text-white group-hover:text-blue-400 duration-150 uppercase">Browse Tournaments</h4>
                      <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                        Explore available tournament rosters, read active maps pool listings, and view champions brackets.
                      </p>
                    </div>
                    <span className="text-[8.5px] text-blue-400 font-extrabold tracking-wider uppercase mt-4 block">Explore Brackets →</span>
                  </div>

                </div>
              </div>

              {/* FEATURED CHAMPIONS & TROPHY CASE */}
              <SectionTitle text="PUBLIC HALL OF FAME" sub="Recent Tournament Dominance" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CHAMPIONS_SHOWCASE.map((ch, idx) => (
                  <div key={idx} className="bg-[#111111] bg-gradient-to-b from-[#1C1C1C] to-[#0A0A0A] p-4 rounded-2xl border-b-2 border-red-600 border-gray-800 space-y-3 relative hover:scale-[1.02] transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-mono tracking-widest px-2 py-0.5 rounded uppercase font-bold">
                        {ch.year}
                      </span>
                      <Trophy size={18} className="text-red-500" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{ch.trophy}</h3>
                    
                    <div className="pt-2 border-t border-gray-800/60 text-xs flex justify-between text-gray-400">
                      <span>Roster Squad:</span>
                      <strong className="text-red-400 font-mono">{ch.team}</strong>
                    </div>
                    <div className="text-xs flex justify-between text-gray-400">
                      <span>Season MVP:</span>
                      <strong className="text-white font-mono">{ch.mvp}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT MATCH CENTER / TICKER SIMULATOR CONTROLS */}
              <div className="bg-[#111111] p-5 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black tracking-widest font-mono">
                      📡 LIVE MATCH CENTER & TICKER BROADCASTER
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Simulate actual arena tournaments output & dynamic matches scoreboards
                    </p>
                  </div>
                  <button
                    onClick={() => setMatchTickerActive(!matchTickerActive)}
                    className={`px-4 py-2 rounded font-mono text-xs font-black transition-all cursor-pointer ${
                      matchTickerActive
                        ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        : "bg-red-650 hover:bg-red-800 text-white crimson-glow"
                    }`}
                  >
                    {matchTickerActive ? "◽ DISABLE LIVE ANTENNA" : "🔴 ACTIVATE LIVE MATCH SIMULATOR"}
                  </button>
                </div>

                <div className="bg-[#0A0A0A] rounded-lg p-4 border border-gray-800 font-mono text-xs text-gray-300 min-h-24 max-h-48 overflow-y-auto space-y-2.5 custom-scrollbar">
                  {tickerLog.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-6">
                      *Click the toggle button to launch live matches events reporting logs! Matches update dynamically every 5 seconds...*
                    </p>
                  ) : (
                    tickerLog.map((log, index) => (
                      <div key={index} className="flex gap-2.5 animate-fade-in border-b border-[#141414] pb-1.5 last:border-0">
                        <span className="text-red-500 font-bold shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* DENSITY SYSTEM WORKSPACE ACCELERATOR */}
              <HomePageDensity setActiveTab={setActiveTab} onAlert={(msg) => setSystemAlertMessage(msg)} />

            </div>
          )}

          {/* 2. TAB: TOURNAMENTS REGISTER SECTION */}
          {activeTab === "tournaments" && (
            <div className="space-y-8 relative z-10 animate-fade-in text-left font-chakra">
              {selectedTournamentId !== null ? (
                <ZimbabweTournamentDetail
                  tournament={tournaments.find(t => t.id === selectedTournamentId)!}
                  session={session}
                  scoreCycle={scoreCycle}
                  onBack={() => {
                    setSelectedTournamentId(null);
                    setSystemAlertMessage("Returned to tournaments arena list");
                  }}
                  onRegister={(tourId) => handleUserRegisterTournament(tourId)}
                  awardXp={awardXp}
                  setSystemAlertMessage={setSystemAlertMessage}
                />
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#ff001f]/15">
                    <SectionTitle text="CV FIELD TOURNAMENTS" sub="Compete for prizes and rank scoreboards" />
                    
                    {/* Dynamic Filters Bar */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#090909]/90 p-1.5 rounded-xl border border-[#ff001f]/15">
                      <span className="text-[9px] font-mono font-black text-gray-500 uppercase px-2">FILTER:</span>
                      {[
                        { id: "All", label: "ALL" },
                        { id: "Solo", label: "SOLO" },
                        { id: "Duo", label: "DUO" },
                        { id: "Squad", label: "SQUAD" },
                        { id: "Live", label: "LIVE" },
                        { id: "Upcoming", label: "UPCOMING" },
                        { id: "Completed", label: "COMPLETED" }
                      ].map((f) => {
                        const isSelected = (["Solo", "Duo", "Squad"].includes(f.id) && tournamentTypeFilter === f.id) ||
                                          (["Live", "Upcoming", "Completed"].includes(f.id) && tournamentStatusFilter === f.id) ||
                                          (f.id === "All" && tournamentTypeFilter === "All" && tournamentStatusFilter === "All");
                        return (
                          <button
                            key={f.id}
                            onClick={() => {
                              if (f.id === "All") {
                                setTournamentTypeFilter("All");
                                setTournamentStatusFilter("All");
                              } else if (["Solo", "Duo", "Squad"].includes(f.id)) {
                                setTournamentTypeFilter(f.id);
                              } else {
                                setTournamentStatusFilter(f.id);
                              }
                              setSystemAlertMessage(`🔍 Filter applied: ${f.label}`);
                            }}
                            className={`px-3 py-1 text-[10px] font-black tracking-wider uppercase font-orbitron transition-all duration-300 rounded-md cursor-pointer ${
                              isSelected
                                ? "bg-red-650 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] font-extrabold border border-red-500/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sub-Filters: Prize Pool and Sorting range slider */}
                  <div className="bg-[#050505]/90 rounded-2xl p-4 border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Prize Pool Range Slider */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="uppercase tracking-wider font-bold">✨ MINIMUM PRIZE POOL BOUNTY:</span>
                        <span className="text-red-500 font-bold">${minPrizeFilter}+ USD Value</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="1200"
                          step="50"
                          value={minPrizeFilter}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setMinPrizeFilter(val);
                          }}
                          className="flex-1 accent-red-650 h-1 bg-zinc-850 rounded-lg cursor-pointer"
                        />
                        <button
                          onClick={() => setMinPrizeFilter(0)}
                          className="text-[10px] text-zinc-500 hover:text-white underline font-mono cursor-pointer shrink-0"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Sorting Controller */}
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider shrink-0">
                        Sort by Bounty:
                      </span>
                      <div className="flex bg-black p-1 rounded-lg border border-zinc-850">
                        {[
                          { id: "none", label: "Default" },
                          { id: "asc", label: "Lowest" },
                          { id: "desc", label: "Highest" }
                        ].map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              setPrizeSortOrder(o.id as any);
                              setSystemAlertMessage(`📊 Tournaments sorted by: ${o.label} bounty value`);
                            }}
                            className={`px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase rounded cursor-pointer transition ${
                              prizeSortOrder === o.id
                                ? "bg-red-650/20 text-red-500 border border-red-500/30 font-black"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tournament listings mapped inside the app state */}
                  {tournaments.filter((tour) => {
                    const matchType = tournamentTypeFilter === "All" || tour.type === tournamentTypeFilter;
                    const matchStatus = tournamentStatusFilter === "All" || tour.status === tournamentStatusFilter;
                    const matchPrizeUSD = getTournamentPrizeValue(tour) >= minPrizeFilter;
                    return matchType && matchStatus && matchPrizeUSD;
                  }).length === 0 ? (
                    <div className="bg-black/30 border border-zinc-900/40 rounded-2xl p-16 text-center space-y-4 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
                      <div className="mx-auto w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-red-500 animate-pulse font-mono text-base shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        🏆
                      </div>
                      <p className="text-sm font-semibold text-white uppercase tracking-widest font-orbitron">No Active Tournaments Available</p>
                      <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                        The elite championships are currently being prepared by the organization staff.
                        <span className="block mt-1 text-red-500 font-bold uppercase tracking-wider">Upcoming Events Will Be Announced Soon</span>
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setTournamentTypeFilter("All");
                            setTournamentStatusFilter("All");
                            setMinPrizeFilter(0);
                          }}
                          className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-450 hover:text-white border border-zinc-900 rounded-lg text-[10px] cursor-pointer transition-all font-mono uppercase tracking-widest font-bold"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tournaments
                        .filter((tour) => {
                          const matchType = tournamentTypeFilter === "All" || tour.type === tournamentTypeFilter;
                          const matchStatus = tournamentStatusFilter === "All" || tour.status === tournamentStatusFilter;
                          const matchPrizeUSD = getTournamentPrizeValue(tour) >= minPrizeFilter;
                          return matchType && matchStatus && matchPrizeUSD;
                        })
                        .sort((a, b) => {
                          if (prizeSortOrder === "asc") {
                            return getTournamentPrizeValue(a) - getTournamentPrizeValue(b);
                          } else if (prizeSortOrder === "desc") {
                            return getTournamentPrizeValue(b) - getTournamentPrizeValue(a);
                          }
                          return 0;
                        })
                        .map((tour, index) => {
                          const bannerSrc = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=480";
                          return (
                            <motion.div 
                              key={tour.id} 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: Math.min(6, index) * 0.06, ease: "easeOut" }}
                              className="bg-[#0b0f19] rounded-2xl border border-red-500/15 flex flex-col justify-between gap-0 overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:border-red-500/35 transition-all duration-300 group"
                            >
                              {/* Graphical Top Image Banner Overlay */}
                              <div 
                                onClick={() => {
                                  setSelectedTournamentId(tour.id);
                                  setSystemAlertMessage(`🏆 Entered Hub: ${tour.title}`);
                                }}
                                className="relative h-32 w-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                              >
                                <img 
                                  src={bannerSrc} 
                                  alt={tour.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/40" />
                                
                                {/* Floating tags */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                  <span className="text-[9px] bg-red-650 text-white px-2.5 py-1 rounded font-orbitron tracking-widest uppercase font-black shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                                    {tour.type}
                                  </span>
                                  <span className={`text-[9px] px-2.5 py-1 rounded font-orbitron tracking-widest uppercase font-black ${
                                    tour.status === "Live"
                                      ? "bg-red-650 text-white animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                      : "bg-zinc-800 text-gray-300 border border-zinc-750"
                                  }`}>
                                    {tour.status}
                                  </span>
                                </div>
  
                                <div className="absolute bottom-3 left-3">
                                  <h3 className="text-md font-black tracking-tight text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-sans">{tour.title}</h3>
                                  <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase font-orbitron mt-0.5">{tour.game}</p>
                                </div>
                              </div>
  
                              {/* Content Area */}
                              <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div className="bg-black/40 border border-zinc-900 p-3 rounded-lg text-left">
                                    <span className="text-[8px] text-gray-550 block uppercase font-orbitron tracking-wider">CHAMPION prize pool</span>
                                    <strong className="text-red-500 text-base font-black font-sans leading-none">{tour.prizePool}</strong>
                                  </div>
                                  <div className="bg-black/40 border border-zinc-900 p-3 rounded-lg text-left">
                                    <span className="text-[8px] text-gray-550 block uppercase font-orbitron tracking-wider">OFFICIAL FEES</span>
                                    <strong className="text-white text-base font-black font-sans leading-none">{tour.entryFee}</strong>
                                  </div>
                                </div>
  
                                <div className="text-xs space-y-1.5 font-sans">
                                  <div className="flex justify-between text-gray-400">
                                    <span>📅 MATCH SCHEDULE:</span>
                                    <span className="font-mono text-white text-[11px] font-bold">{tour.schedule}</span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>⚔️ TOTAL BATTLES PATH:</span>
                                    <span className="font-mono text-white text-[11px] font-bold">{tour.matchesCount} contested maps</span>
                                  </div>
                                  <div className="flex justify-between text-gray-400">
                                    <span>🚀 ALLOCATED SLOTS:</span>
                                    <span className="font-mono text-white font-black">{tour.registeredTeams.length} / {tour.maxTeams} rosters registered</span>
                                  </div>
                                </div>
  
                                {/* Countdown block */}
                                <div className="bg-stone-950 p-2 text-center rounded border border-red-500/10 flex items-center justify-between px-3 text-[10px] font-mono">
                                  <span className="text-gray-500 uppercase font-black font-orbitron">COUNTDOWN TIMELINE:</span>
                                  <span className="text-red-400 font-black">{timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S</span>
                                </div>
  
                                <div className="">
                                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-orbitron mb-1.5 font-chakra">CHAMPIONSHIP GUIDELINES:</h4>
                                  <ul className="list-disc pl-4 text-[10px] text-gray-450 space-y-1 text-left line-clamp-2 hover:line-clamp-none transition-all duration-300">
                                    {tour.rules.map((rl, index) => (
                                      <li key={index} className="leading-tight">{rl}</li>
                                    ))}
                                  </ul>
                                </div>
  
                                {/* Live Scores Segment & Action controls */}
                                <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3">
                                  {tour.status === "Live" && tour.leaderboard && (
                                    <div className="w-full bg-black p-3 rounded-xl border border-red-500/15 text-left font-mono">
                                      <span className="text-[9px] text-red-500 font-black block mb-2 uppercase animate-pulse">🎮 LIVE STANDINGS (ROSTER TICKER ACTION)</span>
                                      <div className="space-y-1.5">
                                        {tour.leaderboard.map((lb, index) => (
                                          <motion.div
                                            key={lb.rank}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="flex justify-between text-[11px] text-gray-300 hover:text-white py-0.5 border-b border-zinc-900 last:border-0"
                                          >
                                            <span className="font-bold">#{lb.rank} {lb.teamName}</span>
                                            <div className="font-bold">
                                              <span className="text-red-400 mr-2.5">
                                                K: <AnimatedCounter value={lb.kills + (scoreCycle % 3)} />
                                              </span>
                                              <span className="text-white">
                                                PTS: <AnimatedCounter value={lb.points + (scoreCycle * 2)} />
                                              </span>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
  
                                  <div className="flex gap-2">
                                    {tour.status !== "Live" && (
                                      <button
                                        onClick={() => handleUserRegisterTournament(tour.id)}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-red-650 to-red-800 hover:from-white hover:to-white hover:text-red-800 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer flex justify-center items-center gap-1.5 border border-red-500/20 hover:border-red-655 animate-pulse"
                                        type="button"
                                      >
                                        <Trophy size={12} className="shrink-0" />
                                        <span>{tour.registeredTeams.includes(session.ign) ? "SECURED ✔" : "RESERVE"}</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setSelectedTournamentId(tour.id);
                                        setSystemAlertMessage(`🏆 Entered Hub: ${tour.title}`);
                                      }}
                                      className="flex-1 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-red-500 hover:bg-zinc-900 text-stone-200 hover:text-red-400 text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer flex justify-center items-center gap-1.5"
                                      type="button"
                                    >
                                      <Gamepad2 size={12} className="shrink-0 text-red-500 animate-pulse" />
                                      <span>PORTAL HUB</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}

              {/* 🔴 NEW TDM CHAMPIONSHIP BRACKET ENGINE */}
              <div className="mt-12 bg-black border border-[#ff001f]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(255,0,31,0.1)] text-left">
                {/* Visual grid accent */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,0,31,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,31,0.15)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff001f]/10 to-transparent blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#ff001f]/20">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-955/40 border border-[#ff001f]/40 rounded-full mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#ff001f] animate-ping" />
                      <span className="text-[9px] text-[#ff001f] font-black tracking-widest uppercase font-orbitron">TDM BRACKETS ENGINE</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black font-orbitron tracking-tight text-white uppercase">
                      ⚔️ TDM SPECIALIST TEAM DEATHMATCH
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-xl font-sans">
                      Interactive 4v4/2v2 Deathmatch Bracket controller. Select your map configuration, customize initial roster seeds in real-time, click team rows to manually advance brackets, or run full AI caster simulations with real-time kill feed feeds!
                    </p>
                  </div>
                  
                  {/* Reset Brackets button */}
                  <button
                    onClick={handleResetTdmBracket}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-805 text-gray-300 hover:text-white hover:bg-zinc-800 hover:border-[#ff001f]/40 rounded-lg text-xs font-bold font-orbitron tracking-wider transition-all duration-300 flex items-center gap-2 self-start lg:self-center cursor-pointer"
                  >
                    <RefreshCw size={13} className="animate-spin-slow" />
                    WIPE & RE-SEED BRACKETS
                  </button>
                </div>

                {/* CONTROLLER SHELF: PRESETS & ROSTER BUILDER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  {/* Choice 1: Configuration presets */}
                  <div className="bg-[#0b0b0b] border border-[#ff001f]/10 p-4 rounded-xl space-y-4">
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider text-left border-l-2 border-[#ff001f] pl-2">
                      1. ARENA CALIBRATION
                    </h3>
                    
                    <div className="space-y-3 font-sans">
                      {/* 2v2 or 4v4 Mode selection toggle */}
                      <div>
                        <label className="text-[10px] text-gray-500 font-mono block uppercase font-bold mb-1">TEAM STRUCTURE</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setTdmType("4v4");
                              setTdmTeams(["CV CRIMSON SQUAD", "TEAM LIQUID ACADEMY", "FAZE ROSTER RECRUITS", "ESL CHAMPIONS ACADEMY"]);
                              handleResetTdmBracket();
                            }}
                            className={`py-1.5 px-2 rounded-md text-[10px] font-black font-orbitron transition-all duration-300 cursor-pointer ${
                              tdmType === "4v4"
                                ? "bg-[#ff001f] text-white shadow-[0_0_10px_rgba(255,0,31,0.4)]"
                                : "bg-zinc-900 text-gray-400 border border-zinc-80 border-transparent hover:text-white"
                            }`}
                          >
                            4v4 SQUAD
                          </button>
                          <button
                            onClick={() => {
                              setTdmType("2v2");
                              setTdmTeams(["DUO CRIMSON VIPERS", "DUO HYDRA FOCUS", "DUO APEX GUNNERS", "DUO ECLIPSE SIGHT"]);
                              handleResetTdmBracket();
                            }}
                            className={`py-1.5 px-2 rounded-md text-[10px] font-black font-orbitron transition-all duration-300 cursor-pointer ${
                              tdmType === "2v2"
                                ? "bg-[#ff001f] text-white shadow-[0_0_10px_rgba(255,0,31,0.4)]"
                                : "bg-zinc-900 text-gray-400 border border-zinc-80 border-transparent hover:text-white"
                            }`}
                          >
                            2v2 DUO
                          </button>
                        </div>
                      </div>

                      {/* Map selector */}
                      <div>
                        <label className="text-[10px] text-gray-500 font-mono block uppercase font-bold mb-1">CONTESTED OUTPOST MAP</label>
                        <select
                          value={tdmMap}
                          onChange={(e) => {
                            setTdmMap(e.target.value);
                            setSystemAlertMessage(`🗺️ Arena map preset selected: ${e.target.value}`);
                          }}
                          className="w-full bg-[#050505] border border-zinc-800 focus:border-[#ff001f] rounded-lg p-2 text-xs text-white uppercase font-mono font-bold focus:outline-none"
                        >
                          <option value="Warehouse">Warehouse (Containment Yard)</option>
                          <option value="Ruins">Ruins (Symmetrical Vertical)</option>
                          <option value="Hangar">Hangar (Multi-container corridors)</option>
                          <option value="Library">Library (Bookshelf Closures)</option>
                        </select>
                      </div>

                      {/* Weapons Preset selector */}
                      <div>
                        <label className="text-[10px] text-gray-500 font-mono block uppercase font-bold mb-1">LOADOUT PRESET</label>
                        <select
                          value={tdmWeaponPreset}
                          onChange={(e) => {
                            setTdmWeaponPreset(e.target.value);
                            setSystemAlertMessage(`🔫 Weapon loadout defined: ${e.target.value}`);
                          }}
                          className="w-full bg-[#050505] border border-zinc-800 focus:border-[#ff001f] rounded-lg p-2 text-xs text-white uppercase font-mono font-bold focus:outline-none"
                        >
                          <option value="Assault Rifles (M4/Beryl)">Assault Rifles (M416 / Beryl M762)</option>
                          <option value="Sniper ARs (Kar98k/AWM)">Sniper Precision (Kar98k / AWM / M24)</option>
                          <option value="Close SMGs (Uzi/Vector)">Close SMGs (Micro Uzi / Vector CQC)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Choice 2: Seed Roster Editors */}
                  <div className="bg-[#0b0b0b] border border-zinc-900 p-4 rounded-xl space-y-3 col-span-2">
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider text-left border-l-2 border-[#ff001f] pl-2">
                      2. ROSTERS SEEDS & INTEL CUSTOMIZER
                    </h3>
                    
                    <p className="text-[10px] text-gray-500 text-left font-sans leading-tight">
                      Configure details, and map defensive holds in real-time. Changes integrate directly with live match simulation feedback!
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {tdmTeams.map((team, idx) => {
                        const isEditing = activeEditingTeamIndex === idx;
                        return (
                          <div key={idx} className={`bg-black/65 border transition-all duration-300 rounded-lg p-3 space-y-2 ${isEditing ? 'border-[#ff001f]' : 'border-zinc-900 hover:border-zinc-800'}`}>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded bg-zinc-900 border border-[#ff001f]/20 flex items-center justify-center font-mono font-black text-[10px] text-[#ff001f] shrink-0">
                                #{idx + 1}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <label className="text-[7px] text-gray-500 font-bold block font-mono">SEED NAME</label>
                                <input
                                  type="text"
                                  value={team}
                                  onChange={(e) => {
                                    const updated = [...tdmTeams];
                                    updated[idx] = e.target.value.toUpperCase();
                                    setTdmTeams(updated);
                                    setSemi1Winner(null);
                                    setSemi2Winner(null);
                                    setTdmChampion(null);
                                  }}
                                  className="bg-transparent border-0 border-b border-transparent focus:border-[#ff001f]/60 hover:border-zinc-800 text-[11px] text-white font-mono font-black w-full focus:outline-none pt-0.5 truncate"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveEditingTeamIndex(isEditing ? null : idx)}
                                className={`px-2 py-1 text-[8px] font-mono rounded font-bold transition-all cursor-pointer truncate ${
                                  isEditing ? "bg-red-950 text-red-400 border border-[#ff001f]" : "bg-zinc-900 text-gray-400 border border-zinc-805 hover:text-white"
                                }`}
                              >
                                {isEditing ? "CLOSE" : "STATS 🛠️"}
                              </button>
                            </div>
                            
                            <div className="flex justify-between text-[8px] font-mono text-gray-400 bg-black/40 px-2 py-1 rounded border border-zinc-910">
                              <span className="truncate max-w-[80px]">👑 {tdmCaptains[idx]}</span>
                              <span>🔥 KD: {tdmKDs[idx]}</span>
                              <span className="text-red-500">📈 {tdmWinRates[idx]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* INTERACTIVE TEAM CONFIGURATION & COORDINATE PLOTTER GRID */}
                    {activeEditingTeamIndex !== null && (
                      <div className="border border-zinc-800 bg-[#060606] p-4 rounded-xl space-y-4 animate-fade-in text-left">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <h4 className="text-[10px] font-black font-orbitron text-[#ff001f] tracking-wider uppercase">
                            ⚙️ ROSTER CONFIGURATOR: {tdmTeams[activeEditingTeamIndex]}
                          </h4>
                          <span className="text-[8px] text-[#ff001f] font-mono bg-red-950/20 px-2 py-0.5 rounded border border-[#ff001f]/30">ACTIVE</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Config Inputs */}
                          <div className="space-y-3 font-sans">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] text-gray-500 font-bold block font-mono uppercase mb-1">TEAM CAPTAIN</label>
                                <input
                                  type="text"
                                  value={tdmCaptains[activeEditingTeamIndex]}
                                  onChange={(e) => {
                                    const updated = [...tdmCaptains];
                                    updated[activeEditingTeamIndex] = e.target.value;
                                    setTdmCaptains(updated);
                                  }}
                                  className="w-full bg-black border border-zinc-800 focus:border-[#ff001f] p-2 rounded text-xs text-white font-mono focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-gray-500 font-bold block font-mono uppercase mb-1">STRATEGIC PLAYSTYLE</label>
                                <select
                                  value={tdmPlaystyles[activeEditingTeamIndex]}
                                  onChange={(e) => {
                                    const updated = [...tdmPlaystyles];
                                    updated[activeEditingTeamIndex] = e.target.value;
                                    setTdmPlaystyles(updated);
                                  }}
                                  className="w-full bg-black border border-zinc-800 focus:border-[#ff001f] p-2 rounded text-xs text-white font-mono focus:outline-none"
                                >
                                  <option value="Aggressive Rush">Aggressive Rush (Front-line focus)</option>
                                  <option value="Defensive Hold">Defensive Hold (Choke point lock)</option>
                                  <option value="Tactical Flank">Tactical Flank (Pincer coordinate movement)</option>
                                  <option value="Slayer Precision">Slayer Precision (High ground sniper holds)</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] text-gray-500 font-bold block font-mono uppercase mb-1">AVG KD RATIO</label>
                                <input
                                  type="text"
                                  value={tdmKDs[activeEditingTeamIndex]}
                                  onChange={(e) => {
                                    const updated = [...tdmKDs];
                                    updated[activeEditingTeamIndex] = e.target.value;
                                    setTdmKDs(updated);
                                  }}
                                  className="w-full bg-black border border-zinc-800 focus:border-[#ff001f] p-2 rounded text-xs text-white font-mono focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-gray-500 font-bold block font-mono uppercase mb-1">WIN RATE (%)</label>
                                <input
                                  type="text"
                                  value={tdmWinRates[activeEditingTeamIndex]}
                                  onChange={(e) => {
                                    const updated = [...tdmWinRates];
                                    updated[activeEditingTeamIndex] = e.target.value;
                                    setTdmWinRates(updated);
                                  }}
                                  className="w-full bg-black border border-zinc-800 focus:border-[#ff001f] p-2 rounded text-xs text-white font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900 space-y-1">
                              <span className="text-[7px] text-gray-500 uppercase tracking-wider font-mono block font-bold leading-none mb-1">TACTICAL HOLD SPECIFICATIONS</span>
                              <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-gray-400">🏢 Guard Point Zone:</span>
                                <span className="text-red-500 font-extrabold">{tdmTacticalHolds[activeEditingTeamIndex]?.label || "NOT ASSIGNED"}</span>
                              </div>
                              <div className="flex justify-between items-center font-mono text-[10px]">
                                <span className="text-gray-400">📍 Node Coordinate:</span>
                                <span className="text-white">X: {tdmTacticalHolds[activeEditingTeamIndex]?.x || 0}m | Y: {tdmTacticalHolds[activeEditingTeamIndex]?.y || 0}m</span>
                              </div>
                            </div>
                          </div>

                          {/* Coordinate Plotter Area */}
                          <div className="space-y-1.5 flex flex-col">
                            <label className="text-[8px] text-gray-500 font-bold block font-mono uppercase">
                              🎯 CLICK ON BLUEPRINT TO ASSIGN DEFENSIVE HOLD (MAP: {tdmMap.toUpperCase()})
                            </label>
                            
                            <div 
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
                                const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 1000);
                                
                                let tag = "Defensive Stacks Hold";
                                if (clickX < 330 && clickY < 330) tag = "North-West Spawn Entry";
                                else if (clickX > 660 && clickY < 330) tag = "North-East Container Squeeze";
                                else if (clickX < 330 && clickY > 660) tag = "South-West Flank Cover";
                                else if (clickX > 660 && clickY > 660) tag = "South-East Alley Angle";
                                else if (clickX > 400 && clickX < 600 && clickY > 400 && clickY < 600) tag = "Central Mid Stacks Choke";
                                else if (clickY < 300) tag = "Elevated Railings Sniping Loft";
                                else if (clickY > 700) tag = "Lower Ground Trench Shelter";
                                else tag = "Midfield Container Deflation Barrels";

                                setTdmTacticalHolds(prev => ({
                                  ...prev,
                                  [activeEditingTeamIndex]: { x: clickX, y: clickY, label: tag }
                                }));
                                setSystemAlertMessage(`📍 Set spawn strategic hold for ${tdmTeams[activeEditingTeamIndex]}: ${tag}`);
                              }}
                              className="relative flex-1 min-h-[160px] bg-black border border-dashed border-[#ff001f]/30 rounded-lg overflow-hidden cursor-crosshair group flex items-center justify-center select-none"
                            >
                              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ff001f_1.5px,transparent_1.5px)] bg-[size:12px_12px]" />
                              
                              <div className="absolute inset-1 border border-zinc-900 rounded pointer-events-none flex items-center justify-center">
                                <span className="text-[7px] font-mono text-zinc-700 font-bold uppercase tracking-widest text-center">
                                  {tdmMap} Tactical Arena Grid Plotter
                                </span>
                              </div>

                              <div className="absolute top-4 left-4 w-12 h-8 border border-zinc-900 bg-[#0c0c0c] flex items-center justify-center pointer-events-none rounded"><span className="text-[6px] text-zinc-500 font-mono">OBSTACLE A</span></div>
                              <div className="absolute bottom-4 right-4 w-12 h-8 border border-zinc-900 bg-[#0c0c0c] flex items-center justify-center pointer-events-none rounded"><span className="text-[6px] text-zinc-500 font-mono">OBSTACLE B</span></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 border border-dashed border-zinc-800 bg-red-955/10 flex items-center justify-center pointer-events-none"><span className="text-[6px] text-zinc-500 font-mono">CENTER HUB ({tdmMap})</span></div>

                              {/* Render Plotter Marker */}
                              {tdmTacticalHolds[activeEditingTeamIndex] && (
                                <div 
                                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce"
                                  style={{ 
                                    left: `${tdmTacticalHolds[activeEditingTeamIndex].x / 10}%`, 
                                    top: `${tdmTacticalHolds[activeEditingTeamIndex].y / 10}%` 
                                  }}
                                >
                                  <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_#ff001f] relative flex items-center justify-center">
                                    <span className="absolute animate-ping inset-0 rounded-full bg-[#ff001f] opacity-80" />
                                    <span className="text-[8px] text-white font-black">★</span>
                                  </div>
                                  <div className="absolute left-6 -top-2 px-1.5 py-0.5 rounded bg-red-950 border border-[#ff001f]/60 text-white font-mono text-[7px] whitespace-nowrap shadow-lg">
                                    {tdmTacticalHolds[activeEditingTeamIndex].label}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CV TOURNAMENT PICK'EM BANNER & SELECTION MATRIX */}
                <div className="mt-8 bg-[#070707] border border-red-500/20 p-5 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(255,0,31,0.05)] text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-red-500 animate-pulse" />
                      <h4 className="text-xs font-black font-orbitron text-red-500 uppercase tracking-widest leading-none">
                        👑 CV CHAMPIONSHIP PICK'EM PROS
                      </h4>
                    </div>
                    <span className="text-[8px] text-red-500/70 font-mono tracking-wider font-extrabold uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      GUESS BRACKETS & EARN +150 XP
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 font-sans mb-4 leading-relaxed">
                    Test your tactical matchmaking analysis. Secure your predictions below for <strong>Match A</strong>, <strong>Match B</strong>, and the <strong>Grand Finalist Champion</strong> before initiating the live servers simulation feed. Match correctly to unlock massive Faction Merit Points!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pick Match A */}
                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900/85 space-y-2">
                      <span className="text-[8px] font-mono font-black block text-gray-500 uppercase">MATCH A PREDICTOR</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPredictedSemi1Winner(tdmTeams[0]);
                            setSystemAlertMessage(`🔮 Pick'em Lock: Prediction casted for ${tdmTeams[0]} on Match A`);
                          }}
                          className={`p-2 rounded text-[10px] font-mono font-black truncate transition-all text-left flex items-center justify-between gap-1 cursor-pointer ${
                            predictedSemi1Winner === tdmTeams[0]
                              ? "bg-red-500/10 border border-red-500 text-red-500 shadow-[0_0_8px_rgba(255,0,31,0.2)]"
                              : "bg-zinc-950 text-gray-400 border border-zinc-900 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{tdmTeams[0]}</span>
                          <span className="text-[8px] shrink-0">{predictedSemi1Winner === tdmTeams[0] ? "★" : "○"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPredictedSemi1Winner(tdmTeams[1]);
                            setSystemAlertMessage(`🔮 Pick'em Lock: Prediction casted for ${tdmTeams[1]} on Match A`);
                          }}
                          className={`p-1.5 rounded text-[10px] font-mono font-black truncate transition-all text-left flex items-center justify-between gap-1 cursor-pointer ${
                            predictedSemi1Winner === tdmTeams[1]
                              ? "bg-red-500/10 border border-red-500 text-red-500 shadow-[0_0_8px_rgba(255,0,31,0.2)]"
                              : "bg-zinc-950 text-gray-400 border border-zinc-900 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{tdmTeams[1]}</span>
                          <span className="text-[8px] shrink-0">{predictedSemi1Winner === tdmTeams[1] ? "★" : "○"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pick Match B */}
                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900/85 space-y-2">
                      <span className="text-[8px] font-mono font-black block text-gray-500 uppercase">MATCH B PREDICTOR</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPredictedSemi2Winner(tdmTeams[2]);
                            setSystemAlertMessage(`🔮 Pick'em Lock: Prediction casted for ${tdmTeams[2]} on Match B`);
                          }}
                          className={`p-2 rounded text-[10px] font-mono font-black truncate transition-all text-left flex items-center justify-between gap-1 cursor-pointer ${
                            predictedSemi2Winner === tdmTeams[2]
                              ? "bg-red-500/10 border border-red-500 text-red-500 shadow-[0_0_8px_rgba(255,0,31,0.2)]"
                              : "bg-zinc-950 text-gray-400 border border-zinc-900 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{tdmTeams[2]}</span>
                          <span className="text-[8px] shrink-0">{predictedSemi2Winner === tdmTeams[2] ? "★" : "○"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPredictedSemi2Winner(tdmTeams[3]);
                            setSystemAlertMessage(`🔮 Pick'em Lock: Prediction casted for ${tdmTeams[3]} on Match B`);
                          }}
                          className={`p-1.5 rounded text-[10px] font-mono font-black truncate transition-all text-left flex items-center justify-between gap-1 cursor-pointer ${
                            predictedSemi2Winner === tdmTeams[3]
                              ? "bg-red-500/10 border border-red-500 text-red-500 shadow-[0_0_8px_rgba(255,0,31,0.2)]"
                              : "bg-zinc-950 text-gray-400 border border-zinc-900 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{tdmTeams[3]}</span>
                          <span className="text-[8px] shrink-0">{predictedSemi2Winner === tdmTeams[3] ? "★" : "○"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pick Champion */}
                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900/85 space-y-2">
                      <span className="text-[8px] font-mono font-black block text-gray-500 uppercase">CHAMPION CHOSEN</span>
                      <select
                        value={predictedChampion || ""}
                        onChange={(e) => {
                          setPredictedChampion(e.target.value || null);
                          if (e.target.value) setSystemAlertMessage(`🔮 Pick'em Lock: Prediction casted for ${e.target.value} as Champion`);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-900 focus:border-red-500 rounded p-2 text-[10px] text-red-500 font-mono font-black focus:outline-none"
                      >
                        <option value="">-- CLICK & PICK CHAMPION --</option>
                        {tdmTeams.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pick'em result banner */}
                  {pickEmResultAlert && (
                    <div className="mt-3 bg-zinc-950 border border-[#ff001f]/20 p-2.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-2 text-white animate-fade-in">
                      <span className="text-[#ff001f]">🖧 PREDICTOR CORRELATOR:</span>
                      <span>{pickEmResultAlert}</span>
                    </div>
                  )}
                </div>

                {/* THE INTERACTIVE BRACKETS FLOW BOARD */}
                <div className="mt-8 bg-zinc-950 border border-zinc-900 p-6 rounded-xl relative overflow-x-auto select-none font-sans">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 md:min-w-[650px] py-4">
                    
                    {/* SEMIFINALS BOX */}
                    <div className="w-full md:w-[260px] space-y-6">
                      <div className="text-center md:text-left border-b border-zinc-950 pb-2">
                        <span className="text-[10px] text-gray-500 font-mono font-bold block uppercase">STAGE 01</span>
                        <h4 className="text-xs font-black font-orbitron text-[#ff001f] tracking-widest uppercase">SEMIFINALS (BO1)</h4>
                      </div>

                      {/* MATCH 1 */}
                      <div className="bg-[#0b0b0b] border border-zinc-900 rounded-xl p-3 space-y-3 text-left hover:border-[#ff001f]/35 transition-all duration-300 relative">
                        <div className="absolute top-2 right-2 text-[8px] text-zinc-650 font-mono font-bold">MATCH A</div>
                        
                        <div className="space-y-1.5">
                          {/* Team A */}
                          <div 
                            onClick={() => {
                              if (!simulatingMatchId) {
                                setSemi1Winner(tdmTeams[0]);
                                setSystemAlertMessage(`⚖️ Bracket override: ${tdmTeams[0]} advanced directly to finals!`);
                              }
                            }}
                            className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all ${
                              semi1Winner === tdmTeams[0] 
                                ? "bg-red-950/30 border border-[#ff001f] text-white" 
                                : semi1Winner 
                                ? "opacity-45 bg-[#050505] border border-zinc-950" 
                                : "bg-[#050505] border border-zinc-900 hover:border-zinc-850"
                            }`}
                          >
                            <span className="font-mono text-xs font-black truncate max-w-[150px]">{tdmTeams[0]}</span>
                            <span className="font-mono text-xs font-extrabold bg-zinc-900 px-1.5 py-0.5 rounded text-white">{semi1Scores.t1}</span>
                          </div>

                          {/* Team B */}
                          <div 
                            onClick={() => {
                              if (!simulatingMatchId) {
                                setSemi1Winner(tdmTeams[1]);
                                setSystemAlertMessage(`⚖️ Bracket override: ${tdmTeams[1]} advanced directly to finals!`);
                              }
                            }}
                            className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all ${
                              semi1Winner === tdmTeams[1] 
                                ? "bg-red-950/30 border border-[#ff001f] text-white" 
                                : semi1Winner 
                                ? "opacity-45 bg-[#050505] border border-zinc-950" 
                                : "bg-[#050505] border border-zinc-900 hover:border-zinc-850"
                            }`}
                          >
                            <span className="font-mono text-xs font-black truncate max-w-[150px]">{tdmTeams[1]}</span>
                            <span className="font-mono text-xs font-extrabold bg-zinc-900 px-1.5 py-0.5 rounded text-white">{semi1Scores.t2}</span>
                          </div>
                        </div>

                        {/* Simulate Matches controller */}
                        <button
                          disabled={!!simulatingMatchId}
                          onClick={() => handleSimulateTdmMatch("semi1")}
                          className="w-full py-1.5 bg-gradient-to-r from-red-950 to-[#d1001f] hover:from-[#ff001f] hover:to-red-600 font-orbitron font-black text-[9px] uppercase tracking-wider text-white rounded-md cursor-pointer transition-all border border-red-900/40 hover:shadow-[0_0_10px_rgba(255,0,31,0.3)] disabled:opacity-50"
                        >
                          {simulatingMatchId === "semi1" ? "📡 SIMULATING..." : "RUN INTEL SIMULATION 🚀"}
                        </button>
                      </div>

                      {/* MATCH 2 */}
                      <div className="bg-[#0b0b0b] border border-zinc-900 rounded-xl p-3 space-y-3 text-left hover:border-[#ff001f]/35 transition-all duration-300 relative">
                        <div className="absolute top-2 right-2 text-[8px] text-zinc-650 font-mono font-bold">MATCH B</div>
                        
                        <div className="space-y-1.5">
                          {/* Team C */}
                          <div 
                            onClick={() => {
                              if (!simulatingMatchId) {
                                setSemi2Winner(tdmTeams[2]);
                                setSystemAlertMessage(`⚖️ Bracket override: ${tdmTeams[2]} advanced directly to finals!`);
                              }
                            }}
                            className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all ${
                              semi2Winner === tdmTeams[2] 
                                ? "bg-red-950/30 border border-[#ff001f] text-white" 
                                : semi2Winner 
                                ? "opacity-45 bg-[#050505] border border-zinc-950" 
                                : "bg-[#050505] border border-zinc-900 hover:border-zinc-850"
                            }`}
                          >
                            <span className="font-mono text-xs font-black truncate max-w-[150px]">{tdmTeams[2]}</span>
                            <span className="font-mono text-xs font-extrabold bg-zinc-900 px-1.5 py-0.5 rounded text-white">{semi2Scores.t1}</span>
                          </div>

                          {/* Team D */}
                          <div 
                            onClick={() => {
                              if (!simulatingMatchId) {
                                setSemi2Winner(tdmTeams[3]);
                                setSystemAlertMessage(`⚖️ Bracket override: ${tdmTeams[3]} advanced directly to finals!`);
                              }
                            }}
                            className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all ${
                              semi2Winner === tdmTeams[3] 
                                ? "bg-red-950/30 border border-[#ff001f] text-white" 
                                : semi2Winner 
                                ? "opacity-45 bg-[#050505] border border-zinc-950" 
                                : "bg-[#050505] border border-zinc-900 hover:border-zinc-850"
                            }`}
                          >
                            <span className="font-mono text-xs font-black truncate max-w-[150px]">{tdmTeams[3]}</span>
                            <span className="font-mono text-xs font-extrabold bg-zinc-900 px-1.5 py-0.5 rounded text-white">{semi2Scores.t2}</span>
                          </div>
                        </div>

                        {/* Simulate matches controller */}
                        <button
                          disabled={!!simulatingMatchId}
                          onClick={() => handleSimulateTdmMatch("semi2")}
                          className="w-full py-1.5 bg-gradient-to-r from-red-950 to-[#d1001f] hover:from-[#ff001f] hover:to-red-600 font-orbitron font-black text-[9px] uppercase tracking-wider text-white rounded-md cursor-pointer transition-all border border-red-900/40 hover:shadow-[0_0_10px_rgba(255,0,31,0.3)] disabled:opacity-50"
                        >
                          {simulatingMatchId === "semi2" ? "📡 SIMULATING..." : "RUN INTEL SIMULATION 🚀"}
                        </button>
                      </div>
                    </div>

                    {/* RED BRACKET CONNECTOR LINES ACCENT */}
                    <div className="hidden md:flex flex-col justify-around h-72 w-16 relative">
                      <div className="absolute top-1/4 bottom-1/4 left-0 right-1/2 border-t-2 border-b-2 border-r-2 border-dashed border-[#ff001f]/30 rounded-r-lg" />
                      <div className="absolute top-1/2 left-1/2 right-0 border-t-2 border-dashed border-[#ff001f]/30" />
                    </div>

                    {/* GRAND FINALS BOX */}
                    <div className="w-full md:w-[260px] space-y-6">
                      <div className="text-center md:text-left border-b border-zinc-900 pb-2">
                        <span className="text-[10px] text-gray-500 font-mono font-bold block uppercase">STAGE 02</span>
                        <h4 className="text-xs font-black font-orbitron text-red-500 tracking-widest uppercase">CRIMSON FINALS (BO3)</h4>
                      </div>

                      {/* FINALS MATCH CONTAINER */}
                      <div className="bg-[#0b0b0b] border-2 border-[#ff001f]/20 rounded-2xl p-4 space-y-4 text-left hover:border-[#ff001f]/50 transition-all duration-300 relative shadow-[0_0_15px_rgba(255,0,31,0.05)]">
                        <div className="absolute top-2.5 right-2.5 text-[8px] text-red-500 font-mono font-black uppercase tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">FINAL BATTLE</div>
                        
                        <div className="space-y-2.5">
                          {/* Finalist A */}
                          <div 
                            onClick={() => {
                              if (semi1Winner && !simulatingMatchId) {
                                setTdmChampion(semi1Winner);
                                setSystemAlertMessage(`🏆 Faction Triumph: ${semi1Winner} crowned absolute TDM Champions!`);
                              }
                            }}
                            className={`flex justify-between items-center p-2.5 rounded-lg transition-all ${
                              semi1Winner ? "cursor-pointer" : "cursor-not-allowed"
                            } ${
                              tdmChampion === semi1Winner && semi1Winner
                                ? "bg-red-500/10 border border-red-500 text-white shadow-[0_0_10px_rgba(255,0,31,0.2)]" 
                                : tdmChampion 
                                ? "opacity-35 bg-[#050505] border border-zinc-950" 
                                : "bg-[#050505] border border-zinc-900 hover:border-zinc-850"
                            }`}
                          >
                            <span className="font-mono text-xs font-black truncate max-w-[140px] text-gray-200">
                              {semi1Winner || "⏳ WAITING SEMI A"}
                            </span>
                            <span className="font-mono text-xs font-black bg-zinc-900 px-2 py-0.5 rounded text-red-500">{finalScores.t1}</span>
                          </div>

                          {/* Finalist B */}
                          <div 
                            onClick={() => {
                              if (semi2Winner && !simulatingMatchId) {
                                setTdmChampion(semi2Winner);
                                setSystemAlertMessage(`🏆 Faction Triumph: ${semi2Winner} crowned absolute TDM Champions!`);
                              }
                            }}
                            className={`flex justify-between items-center p-2.5 rounded-lg transition-all ${
                              semi2Winner ? "cursor-pointer" : "cursor-not-allowed"
                            } ${
                              tdmChampion === semi2Winner && semi2Winner
                                ? "bg-red-500/10 border border-red-500 text-white shadow-[0_0_10px_rgba(255,0,31,0.2)]" 
                                : tdmChampion 
                                ? "opacity-35 bg-[#050505] border border-zinc-950" 
                                : "bg-[#050505] border border-zinc-900 hover:border-zinc-850"
                            }`}
                          >
                            <span className="font-mono text-xs font-black truncate max-w-[140px] text-gray-200">
                              {semi2Winner || "⏳ WAITING SEMI B"}
                            </span>
                            <span className="font-mono text-xs font-black bg-zinc-900 px-2 py-0.5 rounded text-red-500">{finalScores.t2}</span>
                          </div>
                        </div>

                        {/* Simulate Grand Finals button */}
                        <button
                          disabled={!semi1Winner || !semi2Winner || !!simulatingMatchId}
                          onClick={() => handleSimulateTdmMatch("final")}
                          className="w-full py-2 bg-gradient-to-r from-red-650 to-red-500 hover:from-white hover:to-white hover:text-red-600 font-orbitron font-black text-[10px] uppercase tracking-widest text-white rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed font-extrabold shadow-[0_4px_12px_rgba(239,68,68,0.15)] hover:shadow-[0_4px_20px_#ef4444]"
                        >
                          {simulatingMatchId === "final" ? "📡 STREAMING CLASH..." : "SIMULATE GRAND FINALS 🏆"}
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* THE RED & CRIMSON CHAMPION SHOWCASE BANNER */}
                {tdmChampion && (
                  <div className="mt-8 bg-gradient-to-r from-[#111111] via-red-950/20 to-[#111111] border-2 border-red-500/30 rounded-2xl p-6 text-center animate-pulse relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10 space-y-3">
                      <div className="flex justify-center gap-1.5 text-red-500">
                        <Crown size={28} className="animate-bounce text-red-500" />
                        <Trophy size={28} className="text-red-500" />
                        <Crown size={28} className="animate-bounce text-red-500" />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono tracking-[0.3em] font-black text-red-500 uppercase">OFFICIAL TDM TOURNAMENT CHAMPION</span>
                        <h2 className="text-2xl md:text-3xl font-black font-orbitron text-white tracking-widest uppercase drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                          👑 {tdmChampion} 👑
                        </h2>
                      </div>
                      
                      <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed font-sans text-center">
                        Shattered remaining rosters on <span className="font-mono text-red-500 font-bold">{tdmMap} Arena</span>. Transferred grand championship prize of <strong className="text-white">$2,500 USDC</strong> and <strong className="text-red-500">500 Faction Merit Points</strong> to their secure vaults!
                      </p>
                      
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-500/40 rounded text-[9px] font-mono text-red-500 font-bold uppercase">
                        🥇 TOURNAMENT CONCLUDED SUCCESSFULLY
                      </div>
                    </div>
                  </div>
                )}

                {/* TACTICAL BATTLESTATION COMMAND CENTER & REAL-TIME TELEMETRY DECK */}
                <div id="tdm-telemetry-console-deck" className="mt-8 bg-gradient-to-br from-[#0c0505] via-zinc-950 to-[#050806] border border-[#ff001c]/35 rounded-xl p-6 space-y-4 text-left relative overflow-hidden shadow-[0_0_30px_rgba(255,0,31,0.08)]">
                  {/* Glowing custom background meshes & scrolling vector grid lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1c0a0a,transparent_70%)] pointer-events-none opacity-60" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0707_1px,transparent_1px),linear-gradient(to_bottom,#0f0707_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 animate-pulse" />
                  
                  {/* Subtle CRT Scanline Overlay & Glass Phosphor Glow Effects */}
                  <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-[0.16] z-[5]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#ff001c]/[0.02] via-transparent to-[#ff001c]/[0.03] pointer-events-none z-[5]" />
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff001c]/30 to-transparent pointer-events-none z-[5] animate-pulse" />
                  
                  {/* Three Small Status Indicator LEDs */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-3 bg-[#0a0505]/95 border border-[#ff001c]/20 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(255,0,0,0.05)] select-none">
                    {/* PWR LED */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                      <span className="text-[7.5px] font-mono font-bold text-zinc-400">PWR</span>
                    </div>
                    {/* LINK LED */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_6px_rgba(59,130,246,0.8)] animate-pulse" />
                      <span className="text-[7.5px] font-mono font-bold text-zinc-400">LINK</span>
                    </div>
                    {/* SYNC LED */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        (tdmSimulatorActive || !!simulatingMatchId)
                          ? "bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"
                          : "bg-zinc-700 shadow-none"
                      }`} />
                      <span className="text-[7.5px] font-mono font-bold text-zinc-400">SYNC</span>
                    </div>
                  </div>
                  
                  {/* SVG-based eSports HUD Scanning HUD Sweeper */}
                  {(tdmSimulatorActive || !!simulatingMatchId) && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
                      <svg width="100%" height="100%" className="w-full h-full opacity-60">
                        <defs>
                          {/* Radial & Linear gradients for scanning glows */}
                          <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ff001c" stopOpacity="0" />
                            <stop offset="75%" stopColor="#ff001c" stopOpacity="0.08" />
                            <stop offset="95%" stopColor="#ff001c" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ff001c" stopOpacity="0.9" />
                          </linearGradient>
                          <radialGradient id="crosshairGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ff001c" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ff001c" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Animated tech grids or sonar patterns that react to scanner */}
                        <g className="opacity-15">
                          {/* Circle radar rings on the side */}
                          <circle cx="5%" cy="50%" r="60" stroke="#ff001c" strokeWidth="1" strokeDasharray="4 8" fill="none" />
                          <circle cx="5%" cy="50%" r="100" stroke="#ff001c" strokeWidth="0.5" strokeDasharray="2 4" fill="none" />
                          <circle cx="95%" cy="50%" r="60" stroke="#ff001c" strokeWidth="1" strokeDasharray="4 8" fill="none" />
                          <circle cx="95%" cy="50%" r="100" stroke="#ff001c" strokeWidth="0.5" strokeDasharray="2 4" fill="none" />
                        </g>
                      </svg>
                      
                      {/* Horizontal Sweeper (Sweeps left to right) */}
                      <motion.div
                        key={`h-scan-${scanDuration}`}
                        className="absolute inset-y-0 w-44 pointer-events-none"
                        initial={{ left: "-12rem" }}
                        animate={{ left: "110%" }}
                        transition={{
                          duration: scanDuration,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          background: "linear-gradient(90deg, transparent 0%, rgba(255, 0, 28, 0.02) 40%, rgba(255, 0, 28, 0.08) 80%, rgba(255, 0, 28, 0.35) 100%)",
                        }}
                      >
                        {/* Vertical laser line indicator */}
                        <div className="absolute right-0 inset-y-0 w-[1.5px] bg-gradient-to-b from-transparent via-[#ff001c] to-transparent shadow-[0_0_12px_rgba(255,0,28,0.85)] flex flex-col justify-between py-10 opacity-80">
                          <div className="w-2 h-[1px] bg-[#ff001c] -mr-[3px] opacity-40 ml-auto" />
                          <div className="w-3 h-[1px] bg-[#ff001c] -mr-[4.5px] opacity-70 ml-auto font-mono text-[5px] select-none text-[#ff001c]">SEC_B</div>
                          <div className="w-1.5 h-[1px] bg-[#ff001c] -mr-[2px] opacity-30 ml-auto" />
                          <div className="w-2 h-[1px] bg-[#ff001c] -mr-[3px] opacity-50 ml-auto" />
                          <div className="w-3 h-[1px] bg-[#ff001c] -mr-[4.5px] opacity-70 ml-auto font-mono text-[5px] select-none text-[#ff001c]">SEC_A</div>
                          <div className="w-2 h-[1px] bg-[#ff001c] -mr-[3px] opacity-40 ml-auto" />
                        </div>
                      </motion.div>
                      
                      {/* Sweeping Group utilizing motion */}
                      <motion.div
                        className="absolute inset-x-0 h-40 pointer-events-none"
                        initial={{ top: "-10rem" }}
                        animate={{ top: "110%" }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          background: "linear-gradient(180deg, transparent 0%, rgba(255, 0, 28, 0.03) 50%, rgba(255, 0, 28, 0.12) 85%, rgba(255, 0, 28, 0.5) 100%)",
                        }}
                      >
                        {/* The bright razor scan-line */}
                        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff001c] to-transparent shadow-[0_0_15px_rgba(255,0,28,1)] flex items-center justify-between px-8">
                          {/* Animated Left Notch */}
                          <svg className="w-10 h-6 overflow-visible absolute -left-1 -bottom-3 text-[#ff001c]">
                            <path d="M 0 12 L 15 12 L 20 6 L 30 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <circle cx="20" cy="6" r="2.5" fill="currentColor" />
                          </svg>

                          {/* Center radar blip indicator */}
                          <div className="h-5 w-40 absolute left-1/2 -translate-x-1/2 -bottom-2.5 flex items-center justify-center opacity-70">
                            <span className="text-[7.5px] font-mono font-bold text-[#ff001c] tracking-[0.2em] bg-black/95 border border-[#ff001c]/30 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,0,28,0.4)]">
                              SYS_SCAN_ACTIVE
                            </span>
                          </div>

                          {/* Animated Right Notch */}
                          <svg className="w-10 h-6 overflow-visible absolute -right-1 -bottom-3 text-[#ff001c] scale-x-[-1]">
                            <path d="M 0 12 L 15 12 L 20 6 L 30 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <circle cx="20" cy="6" r="2.5" fill="currentColor" />
                          </svg>
                        </div>
                        
                        {/* Subtly moving light-ray SVG */}
                        <svg className="absolute inset-x-0 bottom-0 w-full h-12 overflow-visible text-[#ff001c]/20">
                          {/* Tech grid ticks under the scanline */}
                          <g>
                            <line x1="5%" y1="0%" x2="5%" y2="40" stroke="currentColor" strokeWidth="1" />
                            <line x1="15%" y1="0%" x2="15%" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="25%" y1="0%" x2="25%" y2="30" stroke="currentColor" strokeWidth="1" />
                            <line x1="35%" y1="0%" x2="35%" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="45%" y1="0%" x2="45%" y2="45" stroke="currentColor" strokeWidth="1" />
                            <line x1="55%" y1="0%" x2="55%" y2="45" stroke="currentColor" strokeWidth="1" />
                            <line x1="65%" y1="0%" x2="65%" y2="15" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="75%" y1="0%" x2="75%" y2="30" stroke="currentColor" strokeWidth="1" />
                            <line x1="85%" y1="0%" x2="85%" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="95%" y1="0%" x2="95%" y2="40" stroke="currentColor" strokeWidth="1" />
                          </g>
                        </svg>
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Corner aesthetic frame-cuts */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff001c]/40" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff001c]/40" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff001c]/40" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff001c]/40" />

                  {/* Header */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#ff001f]/10 border border-[#ff001c]/30 rounded-lg flex items-center justify-center text-[#ff001f] transition-all duration-300 shadow-[0_0_12px_rgba(255,0,31,0.15)] shrink-0 group-hover:scale-105">
                        <Tv size={18} className={simulatingMatchId ? "animate-pulse" : ""} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black font-orbitron text-white uppercase tracking-wider">SPECTATOR CAST SPECS TELEMETRY FLOW</h4>
                          <span className={`px-2 py-0.5 text-[7px] font-mono font-black uppercase rounded border ${simulatingMatchId ? "bg-red-955/30 text-red-500 border-red-500/30 animate-pulse" : "bg-zinc-900/60 text-zinc-550 border-zinc-800"}`}>
                            {simulatingMatchId ? "🔴 ACTIVE SCAN" : "🛰️ STANDBY"}
                          </span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-mono">MAP ARENA: {tdmMap.toUpperCase()} | REGULATION ENGINE: PMGC v2.6</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        id="tdm-autocenter-toggle-btn"
                        type="button"
                        onClick={() => {
                          setAutoCenterActive(!autoCenterActive);
                          setSystemAlertMessage(
                            !autoCenterActive 
                              ? "🎯 Tactical Auto-Center activated. View centers after 30 seconds of inactivity." 
                              : "⚠️ Tactical Auto-Center deactivated."
                          );
                        }}
                        className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase transition-all duration-150 cursor-pointer border flex items-center gap-1.5 active:scale-95 ${
                          autoCenterActive 
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:bg-emerald-950/60" 
                            : "bg-zinc-900/60 text-zinc-550 border-zinc-800 hover:text-white"
                        }`}
                        title="Toggles automatic re-centering of the map view after 30 seconds of inactivity"
                      >
                        <span>Auto-Center</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${autoCenterActive ? "bg-emerald-400 animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.8)]" : "bg-zinc-600"}`} />
                        {autoCenterActive && (
                          <span className="font-mono text-emerald-300 font-black px-1 bg-emerald-950/60 border border-emerald-500/20 rounded text-[8px] animate-pulse">
                            {autoCenterCountdown}s
                          </span>
                        )}
                      </button>
                      <button
                        id="tdm-reset-zoom-btn"
                        type="button"
                        onClick={() => {
                          setMapZoom(1.0);
                          setMapPan({ x: 0, y: 0 });
                          setSystemAlertMessage("🎯 Tactical Map Zoom and Pan coordinates restored to default values.");
                        }}
                        className="px-2.5 py-1 bg-[#ff001c]/10 hover:bg-[#ff001c]/25 text-[#ff001c] border border-[#ff001c]/30 rounded text-[9px] font-mono font-bold uppercase transition-all duration-150 cursor-pointer shadow-[0_0_10px_rgba(255,0,0,0.1)] active:scale-95"
                      >
                        Reset Zoom
                      </button>
                      <button
                        id="tdm-snapshot-btn"
                        type="button"
                        onClick={handleTakeTdmSnapshot}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded text-[9px] font-mono font-bold uppercase transition-all duration-150 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.1)] active:scale-95 flex items-center gap-1.5"
                        title="Takes a high-resolution snapshot screenshot of the currently visible telemetry map view"
                      >
                        <Camera size={11} />
                        <span>Snapshot</span>
                      </button>
                      <div className="flex items-center gap-2 border-l border-zinc-850 pl-3">
                        <span className={`w-2 h-2 rounded-full ${simulatingMatchId ? "bg-red-500 animate-ping shadow-[0_0_8px_red]" : "bg-zinc-700"} `} />
                        <span className="text-[9px] font-mono text-zinc-400 font-black tracking-wide uppercase telemetry-readout-blink">
                          {simulatingMatchId ? "TUNNELING LOBBY DECK" : "DECK: IDLE STANDBY"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE SCANNER SPEED CONTROLLER */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0a0505]/45 border border-zinc-900/80 p-3 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] my-2">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col space-y-0.5 select-none">
                        <span className="w-1.5 h-1.5 bg-[#ff001c] rounded-full animate-pulse shadow-[0_0_6px_rgba(255,0,28,0.8)]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-white tracking-wider block uppercase">HORIZONTAL FREQUENCY MODULATION</span>
                        <span className="text-[8px] font-mono text-zinc-500 block">MANUAL PULSE OSCILLATOR SPEED CONTROLLER</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">MIN</span>
                      <div className="relative flex items-center w-full max-w-[160px] group">
                        <input 
                          type="range"
                          min="1"
                          max="10"
                          step="0.5"
                          value={(11 - scanDuration).toFixed(1)}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setScanDuration(11 - val);
                          }}
                          className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-[#ff001c] border border-red-950/45 focus:outline-none focus:ring-1 focus:ring-[#ff001c]/30"
                          style={{
                            WebkitAppearance: "none"
                          }}
                        />
                        {/* Custom visual glow track to match HUD */}
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#ff001c]/25 to-[#ff001c] pointer-events-none rounded-lg"
                          style={{ width: `${((11 - scanDuration - 1) / 9) * 100}%` }}
                        />
                      </div>
                      <div className="min-w-[62px] text-right">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">SPEED: </span>
                        <span className="text-[10px] font-mono text-[#ff001c] font-black tracking-tighter telemetry-readout-blink">{(11 - scanDuration).toFixed(1)}x</span>
                      </div>
                      <div className="min-w-[85px] text-right border-l border-zinc-800/80 pl-3">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">SCAN_FREQ: </span>
                        <span className="text-[10px] font-mono text-[#ff001c] font-black tracking-tighter telemetry-readout-blink">{(11 - scanDuration).toFixed(1)} Hz</span>
                      </div>
                    </div>
                  </div>

                  {/* HIGH-SPEED DIAGNOSTIC TICKER READOUT */}
                  <div className="relative z-10 overflow-hidden bg-[#0a0404]/90 border-y border-[#ff001c]/15 py-1.5 -mx-6 my-1 select-none">
                    {/* Shadow fading edges for clean infinite look */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0c0505] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#050806] to-transparent z-10 pointer-events-none" />
                    
                    <div className="flex w-max">
                      <motion.div
                        className="flex gap-8 whitespace-nowrap text-[8.5px] font-mono font-bold tracking-wider text-[#ff001c] uppercase"
                        animate={{ x: [0, "-50%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 16,
                          ease: "linear"
                        }}
                      >
                        {/* Set 1 */}
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#ff001c] rounded-full animate-ping" /> NODE_SYNC: 60Hz</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">LATENCY: 11ms</span>
                        <span className="text-zinc-800">|</span>
                        <span>TICKRATE: 64.2Hz</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">PACKET_LOSS: 0.00%</span>
                        <span className="text-zinc-800">|</span>
                        <span>FPS_LIMIT: 240FPS</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">BANDWIDTH: 4.8 GBPS</span>
                        <span className="text-zinc-800">|</span>
                        <span>TUNNEL_ID: TDM_DECK_4</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">SYS_TEMP: 38.4°C</span>
                        <span className="text-zinc-800">|</span>
                        <span>DECK_VOLTAGE: 12.0V</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">KERNEL_LINK: COMPLIANT</span>

                        {/* Duplicate Set 2 */}
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#ff001c] rounded-full animate-ping" /> NODE_SYNC: 60Hz</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">LATENCY: 11ms</span>
                        <span className="text-zinc-800">|</span>
                        <span>TICKRATE: 64.2Hz</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">PACKET_LOSS: 0.00%</span>
                        <span className="text-zinc-800">|</span>
                        <span>FPS_LIMIT: 240FPS</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">BANDWIDTH: 4.8 GBPS</span>
                        <span className="text-zinc-800">|</span>
                        <span>TUNNEL_ID: TDM_DECK_4</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">SYS_TEMP: 38.4°C</span>
                        <span className="text-zinc-800">|</span>
                        <span>DECK_VOLTAGE: 12.0V</span>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-300">KERNEL_LINK: COMPLIANT</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="relative z-10">
                    {simulatingMatchId ? (
                      /* ACTIVE RUNNING STATE CONTENT */
                      <div className="space-y-4">
                        {/* Progress controls bar details */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                            <span className="text-zinc-400">INGEST FEED RE-ASSEMBLY RATIO:</span>
                            <span className="text-[#ff001f] font-black telemetry-readout-blink">{Math.floor(simulationProgress)}% CONNECTED</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 flex p-[1px]">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-red-600 to-[#ff001f] rounded-full shadow-[0_0_12px_#ff001f]"
                              style={{ width: `${simulationProgress}%` }}
                              layout
                            />
                          </div>
                        </div>

                        {/* Scrolling real-time matrix stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#050505]/40 border border-zinc-900/80 p-2.5 rounded-lg select-none">
                          <div className="space-y-0.5 text-left border-r border-zinc-900/40 pr-2">
                            <span className="text-[7.5px] font-mono font-bold text-zinc-550 block uppercase">BUFFER CAPACITY</span>
                            <span className="text-[10px] font-mono font-extrabold text-white text-left block telemetry-readout-blink">
                              {(92 + Math.sin(Date.now() / 2000) * 4).toFixed(1)}% <span className="text-[8px] text-zinc-500 text-left font-normal select-none">MAX</span>
                            </span>
                          </div>
                          <div className="space-y-0.5 text-left border-r border-zinc-900/40 pr-2 pl-1">
                            <span className="text-[7.5px] font-mono font-bold text-zinc-550 block uppercase">SOCKET HOST</span>
                            <span className="text-[10px] font-mono font-extrabold text-red-500 block telemetry-readout-blink">3000:LOCAL</span>
                          </div>
                          <div className="space-y-0.5 text-left border-r border-zinc-900/40 pr-2 pl-1">
                            <span className="text-[7.5px] font-mono font-bold text-zinc-550 block uppercase">LOBBY TICKRATE</span>
                            <span className="text-[10px] font-mono font-extrabold text-emerald-500 block telemetry-readout-blink">60.4 Hz</span>
                          </div>
                          <div className="space-y-0.5 text-left pl-1">
                            <span className="text-[7.5px] font-mono font-bold text-zinc-550 block uppercase">SPECS OVERLAY</span>
                            <span className="text-[10px] font-mono font-extrabold text-[#ff001c] block telemetry-readout-blink">CONNECTED</span>
                          </div>
                        </div>

                        {/* Active Telemetry Ticker Logs */}
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-wider text-left">INCOMING CAST STRATEGIC PROTOCOLS:</span>
                          <div className="bg-black/80 p-4 rounded-lg border border-zinc-900 font-mono text-[11px] text-[#cccccc] space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                            {simulationLogs.map((log, index) => {
                              const cleanLog = log.replace(/\*/g, "");
                              return (
                                <div key={index} className="flex gap-2.5 items-start border-b border-zinc-950 pb-1.5 last:border-0 last:pb-0 animate-fade-in text-left">
                                  <span className="text-red-500 font-black shrink-0">[{index + 1}]</span>
                                  <p className="font-medium text-gray-300">{cleanLog}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* STANDBY STATE CONTENT */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Hardware diagnostics */}
                          <div className="bg-black/60 p-4 rounded-lg border border-zinc-900/80 space-y-3 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[8px] font-mono text-zinc-450 font-bold uppercase select-none">
                                <span>Core Receiver Load</span>
                                <span className="text-zinc-500 telemetry-readout-blink">{(12 + Math.abs(Math.sin(Date.now() / 3000)) * 14).toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                <div 
                                  className="h-full bg-red-650 rounded-full transition-all duration-500"
                                  style={{ width: `${15 + Math.abs(Math.sin(Date.now() / 3000)) * 20}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[8px] font-mono text-zinc-450 font-bold uppercase select-none">
                                <span>Signal Link Strength</span>
                                <span className="text-emerald-500 telemetry-readout-blink">99.8%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                <div className="h-full bg-emerald-500 rounded-full w-[99.8%]" />
                              </div>
                            </div>
                          </div>

                          {/* Network & Hub metrics */}
                          <div className="bg-black/60 p-4 rounded-lg border border-zinc-900/80 space-y-2 text-left font-mono text-[10px] select-none">
                            <div className="flex justify-between border-b border-zinc-900/60 pb-1">
                              <span className="text-zinc-500 uppercase font-black text-[8px]">LOCAL INGEST PATH:</span>
                              <span className="text-zinc-300 font-bold telemetry-readout-blink">127.0.0.1:3000</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900/60 pb-1">
                              <span className="text-zinc-500 uppercase font-black text-[8px]">ACTIVE RADARS:</span>
                              <span className="text-amber-500 font-bold telemetry-readout-blink">ONLINE</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-900/60 pb-1">
                              <span className="text-zinc-500 uppercase font-black text-[8px]">MATRIX REPLICATORS:</span>
                              <span className="text-zinc-300 font-bold telemetry-readout-blink">STANDBY</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500 uppercase font-black text-[8px]">DECK ENCRYPTION:</span>
                              <span className="text-red-500 font-bold telemetry-readout-blink">AES-256</span>
                            </div>
                          </div>

                          {/* Quick trigger action panel */}
                          <div className="bg-gradient-to-br from-[#120606] via-black to-[#050906] p-4 rounded-lg border border-[#ff001c]/15 flex flex-col justify-between">
                            <p className="text-[10px] text-zinc-400 font-sans leading-relaxed text-left">
                              Ready to capture real-time tournament details. Deploy a simulation above to activate full telemetry spectating.
                            </p>
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => handleSimulateTdmMatch("semi1")}
                                className="w-full py-2 bg-red-650 hover:bg-red-700 text-white border border-transparent text-[9px] font-mono font-black tracking-widest uppercase rounded cursor-pointer transition-colors shadow-lg shadow-red-950/40 text-center flex items-center justify-center gap-1.5"
                              >
                                ⚡ SIMULATE TACTICAL ARENA
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Offline fallback logs ticker */}
                        <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-900 font-mono text-[10px] text-zinc-550 leading-relaxed text-left space-y-1 relative">
                          <div className="absolute top-2 right-3 font-mono text-[7px] text-zinc-700 font-black tracking-widest uppercase">STATION CONSOLE</div>
                          <p className="text-zinc-450 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#ff001c] rounded-full animate-pulse shrink-0" /> [READY] Standby receiver telemetry pipeline synced successfully with Node/Express gateway.</p>
                          <p className="flex items-center gap-1.5 border-t border-zinc-900/60 pt-1 mt-1"><span className="w-1.5 h-1.5 bg-zinc-700 rounded-full shrink-0" /> [10:14 PM] Lobby calibration loaded with preset {tdmWeaponPreset.toUpperCase()} and {tdmMap.toUpperCase()}. No congestion flagged.</p>
                        </div>
                      </div>
                    )}

                    {/* 🛠️ HARDWARE ERROR TELEMETRY INTERCEPT LOG AREA */}
                    <div className="mt-5 border-t border-zinc-900/80 pt-4 space-y-2 select-none">
                      <div className="flex justify-between items-center font-mono">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              (tdmSimulatorActive || !(!simulatingMatchId)) ? "bg-red-500" : "bg-zinc-650"
                            }`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${
                              (tdmSimulatorActive || !(!simulatingMatchId)) ? "bg-red-500" : "bg-zinc-700"
                            }`} />
                          </span>
                          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">
                            HARDWARE DIAGNOSTIC INTERCEPTOR LOGS
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {telemetryHistory.length > 0 && (
                            <button
                              onClick={() => {
                                setTelemetryErrors([]);
                                setTelemetryHistory([]);
                              }}
                              type="button"
                              className="text-[9px] text-zinc-300 hover:text-[#ff001c] cursor-pointer hover:underline uppercase tracking-wide font-black"
                              title="Flush all accumulated diagnostic faults"
                            >
                              FLASH_BIOS
                            </button>
                          )}
                          <span className="text-[9px] text-zinc-600 font-bold uppercase">
                            BUS_FAULTS: {telemetryHistory.length}
                          </span>
                        </div>
                      </div>

                      <div 
                        ref={errorScrollRef}
                        className="bg-black/95 rounded-lg border border-red-950/40 p-3 h-28 overflow-y-auto custom-scrollbar font-mono text-[10px] flex flex-col gap-1.5 relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)]"
                      >
                        {telemetryHistory.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-zinc-650 gap-1.5 select-none py-4">
                            <span className="text-[10px] font-black tracking-wider uppercase">
                              {(tdmSimulatorActive || !(!simulatingMatchId)) ? "📡 PROBING HARDWARE BUS..." : "🛰️ RADAR OFFLINE - BUS STANDBY"}
                            </span>
                            <span className="text-[8px] text-zinc-650 tracking-wide text-center max-w-xs">
                              {(tdmSimulatorActive || !(!simulatingMatchId)) 
                                ? "LISTENING TO SIGNAL REFRACTIONS & VOLTAGE JITTER ON TELEMETRY HARNESS..." 
                                : "ACTIVATE SCANNERS TO PROBE REAL-TIME CHASSIS DIAGNOSTICS"}
                            </span>
                          </div>
                        ) : (
                          telemetryHistory.map((errStr, idx) => {
                            const parts = errStr.split(" | ");
                            if (parts.length >= 4) {
                              const [timestamp, severity, code, message] = parts;
                              return (
                                <div key={idx} className="flex gap-2.5 text-left animate-slide-in items-start border-b border-zinc-900/40 pb-1.5 last:border-0 last:pb-0 font-mono">
                                  <span className="text-zinc-600 font-bold shrink-0 text-[9px]">{timestamp}</span>
                                  <span className={`px-1 rounded text-[7.5px] font-black shrink-0 tracking-widest ${
                                    severity === "CRITICAL" ? "bg-red-950/80 text-red-500 border border-red-900/45 animate-pulse" :
                                    severity === "DIAGNOSTIC_TRIGGER" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900/45 shadow-[0_0_8px_rgba(16,185,129,0.15)] animate-pulse" :
                                    "bg-amber-955/40 text-amber-550 border border-amber-900/25"
                                  }`}>
                                    {severity}
                                  </span>
                                  <span className={`${
                                    severity === "DIAGNOSTIC_TRIGGER" ? "text-emerald-500" : "text-[#ff001c]"
                                  } font-black shrink-0 font-semibold`}>[{code}]</span>
                                  <p className={`${
                                    severity === "DIAGNOSTIC_TRIGGER" ? "text-emerald-300" : "text-zinc-450"
                                  } break-all leading-snug`}>{message}</p>
                                </div>
                              );
                            } else {
                              return (
                                <div key={idx} className="flex gap-2.5 text-left animate-slide-in items-start border-b border-zinc-900/40 pb-1.5 last:border-0 last:pb-0 font-mono">
                                  <span className="text-[#ff001c] font-bold">⚡</span>
                                  <span className="text-[#ff001c] font-black font-semibold">[{errStr}]</span>
                                  <span className="text-zinc-550">SYSTEM MONITOR FAULT TRIGGERED</span>
                                </div>
                              );
                            }
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔴 NEW: WHATSAPP MATCH NOTIFICATION & CAPTAIN DISPATCH HUB */}
              <div className="mt-12 bg-[#090909] border border-red-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.05)] text-left">
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(239,68,68,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.15)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-transparent blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-red-500/20">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-500/40 rounded-full mb-3">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[9px] text-red-400 font-black tracking-widest uppercase font-orbitron">AUTOMATED DISPATCH CONSOLE</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black font-orbitron tracking-tight text-white uppercase flex items-center gap-2">
                      🛰️ CAPTAIN WHATSAPP NOTIFICATION MONITOR
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-2xl font-sans">
                      Active check-in telemetry center. Generates automated secure links with tournament start times and map details formatted in **bold** (via `*text*` tags) to instantly notify registered team captains.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                  {/* Left Column: Manual/Simulated Team Registration and Dispatch */}
                  <div className="bg-[#040404] border border-stone-900 p-5 rounded-xl space-y-4 text-left">
                    <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
                      ⚡ 1. REGISTER SQUAD MANUALLY
                    </h3>
                    
                    <div className="space-y-3 font-sans">
                      <div>
                        <label className="text-[10px] text-gray-550 font-mono block uppercase font-bold mb-1">SELECT CHAMPIONSHIP EVENT</label>
                        <select
                          value={registerFormTournamentId}
                          onChange={(e) => setRegisterFormTournamentId(e.target.value)}
                          className="w-full bg-[#0c0c0c] border border-zinc-900 focus:border-red-500 rounded-lg p-2.5 text-xs text-stone-200 uppercase font-mono font-bold focus:outline-none"
                        >
                          <option value="">-- Choose Tournament or Scrim --</option>
                          {tournaments.map(t => (
                            <option key={t.id} value={t.id}>🏆 {t.title}</option>
                          ))}
                          {scrims.map(s => (
                            <option key={s.id} value={s.id}>🔥 SCRIM: {s.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-550 font-mono block uppercase font-bold mb-1">SQUAD / TEAM NAME</label>
                        <input
                          type="text"
                          value={registerFormTeamName}
                          onChange={(e) => setRegisterFormTeamName(e.target.value)}
                          placeholder="e.g. Crimson Vipers Alpha"
                          className="w-full bg-[#0c0c0c] border border-zinc-900 focus:border-red-500 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none font-sans font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-550 font-mono block uppercase font-bold mb-1">CAPTAIN IGN</label>
                          <input
                            type="text"
                            value={registerFormCaptainName}
                            onChange={(e) => setRegisterFormCaptainName(e.target.value)}
                            className="w-full bg-[#0c0c0c] border border-zinc-900 focus:border-red-500 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-550 font-mono block uppercase font-bold mb-1">WHATSAPP PHONE</label>
                          <input
                            type="text"
                            value={registerFormCaptainPhone}
                            onChange={(e) => setRegisterFormCaptainPhone(e.target.value)}
                            placeholder="include country code"
                            className="w-full bg-[#0c0c0c] border border-zinc-900 focus:border-red-500 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none font-mono font-bold text-red-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!registerFormTournamentId) {
                            setSystemAlertMessage("⚠️ Please choose a tournament or scrim to register.");
                            return;
                          }
                          const foundTour = tournaments.find(t => t.id === registerFormTournamentId);
                          const foundScrim = scrims.find(s => s.id === registerFormTournamentId);
                          
                          if (!foundTour && !foundScrim) return;
                          
                          const title = foundTour ? foundTour.title : foundScrim!.title;
                          const sched = foundTour ? foundTour.schedule : new Date(foundScrim!.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) + " UTC";
                          const maps = foundTour ? (foundTour.mapDetails || "TBD") : foundScrim!.mapName;

                          // Register team in tournament list if applicable
                          if (foundTour) {
                            if (!foundTour.registeredTeams.includes(session.ign)) {
                              setTournaments(prev => prev.map(t => {
                                if (t.id === foundTour.id) {
                                  return { ...t, teamsCount: t.teamsCount + 1, registeredTeams: [...t.registeredTeams, session.ign] };
                                }
                                return t;
                              }));
                            }
                          } else if (foundScrim) {
                            if (!foundScrim.registeredIGNs.includes(session.ign)) {
                              setScrims(prev => prev.map(s => {
                                if (s.id === foundScrim.id) {
                                  return { ...s, registeredIGNs: [...s.registeredIGNs, session.ign] };
                                }
                                return s;
                              }));
                            }
                          }

                          const newCapRec = {
                            id: "cap-rec-" + Date.now(),
                            tournamentTitle: title,
                            captainName: registerFormCaptainName,
                            teamName: registerFormTeamName,
                            captainNo: registerFormCaptainPhone.replace(/[^0-9]/g, "") || "44712345678",
                            schedule: sched,
                            mapDetails: maps,
                            status: "PENDING"
                          };

                          setCaptainRecords(prev => [newCapRec, ...prev]);

                          // Construct WhatsApp Tournament template Object for triggering modal prefill
                          const tMock: Tournament = {
                            id: foundTour ? foundTour.id : foundScrim!.id,
                            title: title,
                            type: foundTour ? foundTour.type : "Squad",
                            status: "Open",
                            game: "PUBG Mobile",
                            prizePool: foundTour ? foundTour.prizePool : "Scrim Training Practice",
                            entryFee: foundTour ? foundTour.entryFee : "Free",
                            teamsCount: foundTour ? foundTour.teamsCount : 1,
                            maxTeams: foundTour ? foundTour.maxTeams : 16,
                            countdownDate: foundTour ? foundTour.countdownDate : new Date().toISOString(),
                            schedule: sched,
                            matchesCount: foundTour ? foundTour.matchesCount : 1,
                            rules: foundTour ? foundTour.rules : ["Standard Scrim Guidelines"],
                            registeredTeams: [session.ign],
                            mapDetails: maps
                          };

                          setWhatsappTournament(tMock);
                          setWhatsappCaptainNo(registerFormCaptainPhone);
                          setIsWhatsappModalOpen(true);
                          awardXp(20);
                          setSystemAlertMessage("🎯 Captain registration queued! Proceed with direct WhatsApp dispatch link.");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-red-650 to-red-800 hover:from-white hover:to-white hover:text-red-850 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] text-[11px] font-black font-orbitron tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 border border-red-500/20 hover:border-white"
                      >
                        <UserCheck size={13} />
                        REGISTER & PUSH TELEMETRY
                      </button>
                    </div>
                  </div>

                  {/* Right 2 Columns: Live Monitoring Ledger */}
                  <div className="bg-[#040404] border border-stone-900 p-5 rounded-xl space-y-4 lg:col-span-2 text-left">
                    <div className="flex justify-between items-center border-b border-stone-900 pb-2">
                      <h3 className="text-xs font-black font-orbitron text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
                        📡 2. CAPTAIN STATUS REGISTRY DIRECTORY
                      </h3>
                      <span className="text-[9px] text-gray-550 font-mono uppercase bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                        Total records: {captainRecords.length}
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                      {captainRecords.length === 0 ? (
                        <div className="py-8 text-center text-gray-600 font-mono text-xs">
                          NO ACTIVE CAPTAIN DISPATCHES DETECTED.
                        </div>
                      ) : (
                        captainRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="p-4 bg-zinc-950 hover:bg-zinc-930 rounded-xl border border-stone-900 hover:border-red-500/20 transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 text-xs font-sans relative overflow-hidden"
                          >
                            <div className="space-y-2">
                              {/* Event Name */}
                              <div className="flex items-center gap-2">
                                <span className="text-red-500 font-orbitron font-extrabold tracking-wider">{rec.tournamentTitle}</span>
                                <span className="text-[9px] font-mono text-gray-500 bg-stone-900/50 px-1.5 py-0.5 rounded uppercase font-semibold">
                                  {rec.teamName}
                                </span>
                              </div>

                              {/* Captain Specifications */}
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-300 font-medium">
                                <p>👤 <span className="text-gray-500 font-mono">Captain IGN:</span> {rec.captainName}</p>
                                <p>📞 <span className="text-gray-500 font-mono">WhatsApp Call:</span> +{rec.captainNo}</p>
                              </div>

                              {/* BOLDED NOTIFICATION SPECS */}
                              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 rounded text-white font-extrabold">
                                  📅 SCHEDULE: <strong>*{rec.schedule}*</strong>
                                </span>
                                <span className="px-2 py-0.5 bg-red-950/20 border border-red-850/40 rounded text-red-400 font-extrabold">
                                  🗺️ MAPS: <strong>*{rec.mapDetails}*</strong>
                                </span>
                              </div>
                            </div>

                            {/* Status Indicator and CTA Column */}
                            <div className="flex flex-col justify-center items-start md:items-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-900">
                              {rec.status === "DISPATCHED" ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/20 border border-red-500/40 rounded-full text-[10px] font-mono text-red-400 font-extrabold shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                  ✓ TELEMETRY PUSHED (SENT)
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-2 py-1 bg-[#1a1a1a] border border-zinc-800 text-white text-[9px] font-mono rounded-full font-bold animate-pulse">
                                    ⏳ PENDING TRANSMISSION
                                  </span>
                                  
                                  <a
                                    href={`https://api.whatsapp.com/send?phone=${rec.captainNo}&text=${encodeURIComponent(
                                      `⚔️ *CV eSPORTS MATCH NOTIFICATION DISPATCH* ⚔️\n\n` +
                                      `Captain, your team slot has been registered. Match details are provided below:\n\n` +
                                      `🏆 *Tournament*: ${rec.tournamentTitle}\n` +
                                      `📅 *Start Time*: *${rec.schedule}*\n` +
                                      `🗺️ *Map Details*: *${rec.mapDetails}*\n` +
                                      `👥 *Roster*: ${rec.captainName} (Active Registration)\n\n` +
                                      `_Secure Connection established via CV Warzone Protocol._`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                      awardXp(30);
                                      // Update Captain Record status to DISPATCHED
                                      setCaptainRecords(prev => prev.map(record => {
                                        if (record.id === rec.id) {
                                          return { ...record, status: "DISPATCHED" };
                                        }
                                        return record;
                                      }));
                                      setSystemAlertMessage("📡 WhatsApp telemetry transmission opened successfully!");
                                    }}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] filter hover:brightness-110 flex items-center justify-center gap-1.5 font-mono cursor-pointer"
                                  >
                                    <Send size={11} />
                                    <span>PUSH DISPATCH 🚀</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* HISTORICAL HALL OF FAME CHAMPS & EVENT ARCHIVES */}
              <div className="mt-12 pt-6 border-t border-[#ff001f]/15">
                <TournamentHistory />
              </div>

              {/* TOURNAMENT DENSITY METRICS TRACKER */}
              <TournamentDensitySection />

              <div className="pt-12 text-center">
                <span className="text-gray-650 text-[10px] font-mono tracking-widest uppercase">END OF CV FIELD TOURNAMENTS SEGMENT</span>
              </div>
            </div>
          )}

          {/* 3. TAB: TEAM WAR MAP SYSTEM */}
          {activeTab === "teamwar" && (
            <div className="space-y-6">
              <div className="bg-[#111111] p-5 rounded-2xl border border-gray-800 space-y-4">
                <SectionTitle text="GLOBALLY CONTESTED TEAM WAR LEADERBOARD" sub=" organizações compete for territory of region divisions!" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  Organizations challenge defense ratings across regional maps and zones. Conquer outer sectors, secure your defense score multiplier, and climb the season-wide worldwide leaderboard rankings! Click on contested sectors below to simulate live territory operations.
                </p>

                {/* Territorial conquest score bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-red-500 font-extrabold flex items-center gap-1.5">
                      🔴 CV eSports Controlled Factions:
                    </span>
                    <span className="text-gray-400">Total World Map Ownership Grid Ratio</span>
                    <span className="text-white font-extrabold flex items-center gap-1.5">
                      🏢 Opponent Factions Ownership:
                    </span>
                  </div>
                  <div className="bg-gray-900 rounded-full h-4 overflow-hidden border border-gray-800 flex relative">
                    <div className="bg-red-600 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-mono leading-none" style={{ width: "45%" }}>
                      45% CV
                    </div>
                    <div className="bg-zinc-400 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-mono leading-none text-black font-extrabold" style={{ width: "35%" }}>
                      35% Others
                    </div>
                    <div className="bg-gray-800 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-mono leading-none" style={{ width: "20%" }}>
                      20% Unclaimed
                    </div>
                  </div>
                </div>

                {/* Clickable 3x3 territory grid map system */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                  {regions.map((reg) => (
                    <div key={reg.id} className={`p-4 rounded-xl border relative transition-all ${
                      reg.ownerFaction === "CV eSports"
                        ? "bg-gradient-to-br from-[#1E0105] to-[#0D0D0D] border-red-600/50"
                        : reg.ownerFaction === "Unclaimed Sector"
                        ? "bg-[#141414] border-gray-800"
                        : "bg-zinc-950 border-stone-800"
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-mono text-gray-500">SECTOR COORD: [{reg.coordinates.x}, {reg.coordinates.y}]</span>
                        <span className={`text-[9px] px-1.5 font-bold uppercase ${
                          reg.status === "War Zone"
                            ? "bg-red-600 text-white animate-pulse"
                            : reg.status === "Contested"
                            ? "bg-white text-black font-extrabold"
                            : "bg-[#1F1F1F] text-gray-400"
                        }`}>
                          {reg.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white">{reg.name}</h4>
                      
                      <div className="text-xs space-y-1 my-3 bg-black/40 p-2 rounded">
                        <div className="flex justify-between text-gray-400">
                          <span>Owner:</span>
                          <strong className={reg.ownerFaction === "CV eSports" ? "text-red-500" : "text-white"}>{reg.ownerFaction}</strong>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Conquest Rounds:</span>
                          <span className="font-mono text-white">{reg.conqueredCount} runs</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Combat Rating:</span>
                          <strong className="text-white font-mono">{reg.combatRating} Rating</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleChallengeRegion(reg.id)}
                        className="w-full py-1.5 bg-[#1F1F1F] hover:bg-red-950 text-[11px] font-mono text-gray-300 hover:text-white rounded border border-gray-800 hover:border-red-600 transition-colors cursor-pointer"
                      >
                        ⚡ INITIATE FACTION DISPUTE CHALLENGE
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. TAB: TEAM ROSTER & PLAYER CARDS (FLIP FOR DETAILS) */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-950/70 p-4 rounded-xl border border-zinc-900 shadow-md">
                <div className="text-left space-y-1">
                  <span className="text-[9px] text-[#ff001c] font-black tracking-widest uppercase block font-mono">TRACK ROSTER ROTATIONS</span>
                  <h3 className="text-base font-black font-orbitron tracking-wide text-white">CV ESPORTS PUBLIC DIRECTORY</h3>
                  <p className="text-xs text-zinc-400">
                    Interact with player profiles. Click to flip for social handles, or view their dossiers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsRosterHistoryModalOpen(true);
                    setSystemAlertMessage("📋 Opening Roster History and Audit logs system console...");
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-mono text-[11px] font-black uppercase tracking-wider rounded border border-zinc-800 hover:border-[#ff001c]/30 hover:shadow-[0_0_15px_rgba(255,0,28,0.15)] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shrink-0 align-middle self-start sm:self-auto"
                >
                  <History size={13} className="text-[#ff001c] group-hover/btn:rotate-180 transition-transform duration-500" />
                  <span>VIEW ROSTER AUDIT RECORD</span>
                  <span className="px-1.5 py-0.5 bg-[#ff001f]/10 text-[#ff001c] border border-[#ff001c]/20 text-[9px] rounded font-bold">
                    {rosterHistoryList.length} LOGS
                  </span>
                </button>
              </div>

              {/* Roster Controls and Sorting Panel */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111113]/90 p-4 rounded-xl border border-zinc-900 shadow-lg">
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="text-red-500 font-extrabold animate-pulse">⭐</span>
                  <span>Player cards flip when clicked to reveal detailed tactical analysis reports, social links, and battle stats.</span>
                </p>

                {/* Filter and Sorting Actions */}
                <div className="flex flex-wrap items-center gap-4 self-start lg:self-auto select-none shrink-0">
                  {/* Dropdown Role Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase font-black tracking-widest">ROLE FILTER:</span>
                    <div className="relative">
                      <select
                        id="roster-role-filter-dropdown"
                        value={selectedRosterRole}
                        onChange={(e) => {
                          setSelectedRosterRole(e.target.value);
                          setSystemAlertMessage(`🔍 Filtered roster cards to show roles containing: ${e.target.value.toUpperCase()}`);
                        }}
                        className="bg-[#09090b] hover:bg-zinc-900 text-stone-300 font-mono text-[9.5px] font-black uppercase tracking-wider px-3 py-1.5 pr-8 rounded-lg border border-zinc-800 focus:border-[#ff001c]/65 focus:ring-1 focus:ring-[#ff001c]/45 outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="All">All Roles</option>
                        <option value="IGL">IGL (Team Leader)</option>
                        <option value="Sniper">Sniper (Sharpshooter)</option>
                        <option value="Assaulter">Assaulter (Fragger)</option>
                        <option value="Support">Support (Anchor)</option>
                      </select>
                      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-zinc-500">
                        <ChevronDown size={11} />
                      </div>
                    </div>
                  </div>

                  <span className="h-4 w-px bg-zinc-800 hidden lg:block" />

                  {/* Sorting Actions */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-zinc-550 font-mono uppercase font-black tracking-widest">POSITION DIRECTORY:</span>
                    <div className="bg-[#09090b] p-1 rounded-lg border border-zinc-855 flex items-center gap-1.5 flex-wrap">
                      <button
                        id="roster-sort-default-btn"
                        onClick={() => {
                          setSortRosterByElite(false);
                          setSortRosterByTier(false);
                          setSystemAlertMessage("📋 Public directory ordered by standard registration date.");
                        }}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer ${
                          !sortRosterByElite && !sortRosterByTier
                            ? "bg-red-955/40 text-[#ff001c] border border-red-900/40 font-extrabold shadow-[0_0_8px_rgba(239,68,68,0.2)]" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Default
                      </button>
                      <button
                        id="roster-sort-elite-btn"
                        onClick={() => {
                          setSortRosterByElite(true);
                          setSortRosterByTier(false);
                          setSystemAlertMessage("🏆 Directory sorted to display Tier 1 Elite players (Leaders & Top Fraggers) first.");
                        }}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                          sortRosterByElite 
                            ? "bg-amber-955/40 text-amber-500 border border-amber-900/40 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <span>★ Elite First</span>
                      </button>
                      <button
                        id="roster-sort-tier-btn"
                        onClick={() => {
                          setSortRosterByElite(false);
                          setSortRosterByTier(true);
                          setSystemAlertMessage("👑 Directory reordered to prioritize High Rank Tiers (Grandmaster > Master > Diamond).");
                        }}
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                          sortRosterByTier 
                            ? "bg-purple-955/40 text-purple-400 border border-purple-900/40 font-extrabold shadow-[0_0_10px_rgba(168,85,247,0.2)]" 
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <span>💎 Rank Tier</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const filteredPlayers = [...rosterPlayers].filter((player) => {
                    if (selectedRosterRole === "All") return true;
                    return player.role.toLowerCase().includes(selectedRosterRole.toLowerCase());
                  });

                  if (filteredPlayers.length === 0) {
                    return (
                      <div className="col-span-1 md:col-span-2 py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20 font-mono text-[10px] uppercase tracking-wider">
                        ❌ No active roster players match the selected "{selectedRosterRole}" category filter.
                      </div>
                    );
                  }

                  return filteredPlayers.sort((a, b) => {
                    if (sortRosterByTier) {
                      const getTierWeight = (tierName: string) => {
                        const t = (tierName || "").toUpperCase();
                        if (t.includes("GRANDMASTER")) return 4;
                        if (t.includes("MASTER")) return 3;
                        if (t.includes("DIAMOND")) return 2;
                        if (t.includes("PLATINUM")) return 1;
                        return 0;
                      };
                      const weightDiff = getTierWeight(b.tier) - getTierWeight(a.tier);
                      if (weightDiff !== 0) return weightDiff;
                      return 0;
                    }

                    if (!sortRosterByElite) return 0; // retain default ordering

                    const badgesA = getDynamicBadges(a);
                    const isAElite = badgesA.some(b => b.title === "Squad Leader" || b.title === "Top Fragger");

                    const badgesB = getDynamicBadges(b);
                    const isBElite = badgesB.some(b => b.title === "Squad Leader" || b.title === "Top Fragger");

                    if (isAElite && !isBElite) return -1;
                    if (!isAElite && isBElite) return 1;
                    return 0;
                  }).map((player) => {
                    const isFlipped = isFlippedPlayerIds.includes(player.ign);
                  const badges = getDynamicBadges(player);
                  const isSquadLeader = badges.some(b => b.title === "Squad Leader");
                  const isTopFragger = badges.some(b => b.title === "Top Fragger");

                  let borderClass = "border-gray-850 hover:border-red-600/50";
                  let glowStyle = {};
                  let backBorderClass = "border-red-600";

                  if (isSquadLeader) {
                    borderClass = "border-[#ff001c]/60 shadow-[0_0_15px_rgba(255,0,28,0.25)] hover:border-[#ff001c]";
                    glowStyle = { boxShadow: "0 0 20px rgba(255, 0, 28, 0.35), inset 0 0 10px rgba(255, 0, 28, 0.05)" };
                    backBorderClass = "border-[#ff001c] shadow-[0_0_20px_rgba(255,0,28,0.3)]";
                  } else if (isTopFragger) {
                    borderClass = "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:border-amber-500";
                    glowStyle = { boxShadow: "0 0 20px rgba(245, 158, 11, 0.35), inset 0 0 10px rgba(245, 158, 11, 0.05)" };
                    backBorderClass = "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]";
                  }

                  const isElite = isSquadLeader || isTopFragger;
                  const ringClass = isSquadLeader 
                    ? "ring-2 ring-offset-2 ring-offset-zinc-950 ring-[#ff001c] shadow-[0_0_20px_rgba(255,0,28,0.2)]" 
                    : isTopFragger 
                    ? "ring-2 ring-offset-2 ring-offset-zinc-950 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                    : "";

                  return (
                    <div
                      key={player.ign}
                      onClick={() => togglePlayerCardFlip(player.ign)}
                      className={`cursor-pointer h-52 relative group rounded-xl ${ringClass}`}
                    >
                      {/* CARD FRONT CONTAINER */}
                      <div 
                        className={`absolute inset-0 bg-[#111111] p-4 rounded-xl border flex flex-col justify-between transition-all duration-500 backface-hidden ${borderClass} ${
                          isFlipped ? "rotate-y-180 opacity-0 pointer-events-none" : "rotate-y-0 opacity-100"
                        } group-hover:scale-105`}
                        style={isSquadLeader || isTopFragger ? glowStyle : {}}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <span 
                              className="text-3xl relative transition-all duration-500"
                              style={{
                                filter: player.availabilityStatus === "Busy" ? "grayscale(100%) opacity(0.6) brightness(0.85)" : "none"
                              }}
                            >
                              {player.avatar}
                              {isSquadLeader && (
                                <span className="absolute -top-1 -right-1 text-[11px] animate-bounce">👑</span>
                              )}
                              {isTopFragger && (
                                <span className="absolute -top-1 -right-1 text-[11px] animate-pulse">🔥</span>
                              )}
                            </span>
                            <div 
                              className="cursor-pointer group/name relative z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSquadMemberProfile(player);
                                setSystemAlertMessage(`📁 Accessing profile dossier: ${player.ign}`);
                              }}
                            >
                              <h3 className="text-sm font-black font-mono tracking-tight text-white hover:text-[#ff001c] transition-colors flex items-center gap-1.5">
                                <span>{player.ign}</span>
                                <span className="opacity-0 group-hover/name:opacity-100 text-[9px] text-[#ff001c] transition-opacity font-sans normal-case font-medium tracking-normal">(Dossier 🔍)</span>
                              </h3>
                              <p className="text-xs text-gray-400 group-hover/name:text-white transition-colors">{player.name}</p>
                              <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                                <span className="text-[9px] bg-red-900/40 text-red-00 px-1.5 py-0.5 rounded uppercase font-mono inline-block">
                                  {player.game}
                                </span>
                                {isSquadLeader && (
                                  <span className="bg-[#ff001f]/15 border border-[#ff001c]/30 text-[#ff001c] text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase font-mono animate-pulse">
                                    LEADER
                                  </span>
                                )}
                                {isTopFragger && (
                                  <span className="bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase font-mono animate-pulse">
                                    FRAGGER
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] text-gray-500 font-mono">🛡️ VERIFIED</span>
                            <div className="relative group/status flex items-center gap-1.5 bg-[#161618]/90 border border-zinc-850 px-1.5 py-0.5 rounded-md shadow-inner cursor-pointer">
                              {player.availabilityStatus === "Available" ? (
                                <div className="relative flex items-center justify-center w-1.5 h-1.5 shrink-0">
                                  <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500/40 animate-ping" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse" />
                                </div>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                              )}
                              <span className={`text-[8px] font-mono font-bold tracking-wider uppercase ${player.availabilityStatus === "Available" ? "text-emerald-400" : "text-red-400"}`}>
                                {player.availabilityStatus || "Available"}
                              </span>

                              {/* Interactive Tactical Tooltip */}
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/status:flex flex-col gap-0.5 z-50 bg-black/95 border border-zinc-800 text-[8px] font-mono whitespace-nowrap text-stone-300 font-bold px-2 py-1 rounded shadow-[0_0_15px_rgba(0,0,0,0.8)] pointer-events-none">
                                <span className="text-[7.5px] text-zinc-500 uppercase tracking-widest">STATUS UPDATE</span>
                                <div>
                                  Last active: <span className="text-red-500">{(() => {
                                    const diffMins = Math.floor((Date.now() - (player.lastActiveInLobby || 0)) / 60000);
                                    return diffMins <= 0 ? "Just now" : `${diffMins}m ago`;
                                  })()}</span>
                                </div>
                                {player.winStreak && player.winStreak > 1 && (
                                  <div className="flex items-center gap-1 mt-1 border-t border-zinc-800 pt-1 text-amber-500 font-extrabold animate-pulse">
                                    <Flame size={10} className="text-amber-500 fill-amber-500/20 shrink-0" />
                                    <span>STREAK: {player.winStreak} WINS</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="text-[7.5px] font-mono text-zinc-500 leading-none">
                              Active: {(() => {
                                const diffMins = Math.floor((Date.now() - (player.lastActiveInLobby || 0)) / 60000);
                                return diffMins <= 0 ? "Just now" : `${diffMins}m ago`;
                              })()}
                            </span>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <button
                                onClick={() => {
                                  simulateLobbyActivity(player.ign);
                                }}
                                className="text-[7.5px] bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 px-1 rounded hover:scale-105 active:scale-95 transition-all font-mono py-0.5"
                                title="Set status to Available"
                              >
                                ⚡ ACTIVE NOW
                              </button>
                              <button
                                onClick={() => {
                                  setRosterPlayers(prev => prev.map(p => {
                                    if (p.ign === player.ign) {
                                      return {
                                        ...p,
                                        lastActiveInLobby: Date.now() - 11 * 60 * 1000,
                                        availabilityStatus: "Busy"
                                      };
                                    }
                                    return p;
                                  }));
                                  setSystemAlertMessage(`⏳ Simulated 11m inactive for ${player.ign}. Status set to Busy.`);
                                }}
                                className="text-[7.5px] bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 px-1 rounded hover:scale-105 active:scale-95 transition-all font-mono py-0.5"
                                title="Set status to Busy (>10m idle)"
                              >
                                ⏳ MAKE BUSY
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0A0A0A] p-2.5 rounded border border-gray-800 text-xs">
                          <p className="text-gray-400 block text-[9px] uppercase tracking-wider mb-1">PRIMARY ROLE:</p>
                          <div className="flex items-center gap-1.5">
                            {getRoleIcon(player.role)}
                            <strong className="text-red-500 font-mono">{player.role}</strong>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Combat KD Ratio:</span>
                            <strong className="text-white font-mono text-sm">{player.kd}</strong>
                          </div>

                          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-zinc-900/60 font-mono">
                            <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">STATS COMPARATOR:</span>
                            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setComparePlayerA(player.ign);
                                  setIsComparisonWidgetVisible(true);
                                  setSystemAlertMessage(`🔴 Selected ${player.ign} inside comparison Slot A.`);
                                }}
                                className={`px-2 py-0.5 text-[8px] font-black rounded uppercase border tracking-widest transition-all ${
                                  comparePlayerA === player.ign 
                                    ? "bg-red-950/40 text-[#ff001c] border-red-900/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]" 
                                    : "bg-[#09090b] hover:bg-red-950/20 text-zinc-500 hover:text-white border-zinc-850"
                                }`}
                              >
                                SLOT A
                              </button>
                              <button
                                onClick={() => {
                                  setComparePlayerB(player.ign);
                                  setIsComparisonWidgetVisible(true);
                                  setSystemAlertMessage(`🟡 Selected ${player.ign} inside comparison Slot B.`);
                                }}
                                className={`px-2 py-0.5 text-[8px] font-black rounded uppercase border tracking-widest transition-all ${
                                  comparePlayerB === player.ign 
                                    ? "bg-amber-955/40 text-amber-500 border-amber-900/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]" 
                                    : "bg-[#09090b] hover:bg-amber-955/20 text-zinc-500 hover:text-white border-zinc-850"
                                }`}
                              >
                                SLOT B
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Hover Overlay containing Win Rate and Total Kills mini-stats */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#07070a]/95 backdrop-blur border-t border-[#ff001c]/30 p-2.5 rounded-b-xl flex items-center justify-between gap-4 transition-all duration-350 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 z-30">
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                              <span className="font-bold tracking-widest text-[8px]">WIN RATE:</span>
                              <span className="text-emerald-400 font-extrabold">{player.winRate || "72%"}</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-850 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                                style={{ width: player.winRate || "72%" }} 
                              />
                            </div>
                          </div>
                          <div className="text-right flex flex-col">
                            <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest leading-none font-bold">TOTAL KILLS:</span>
                            <span className="text-xs font-mono font-black text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.45)] mt-1 leading-none">
                              {player.totalKills || "1,120"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK CONTAINER (Flipped stats) */}
                      <div className={`absolute inset-0 bg-[#250106] p-4 rounded-xl border flex flex-col justify-between transition-all duration-500 backface-hidden ${backBorderClass} ${
                        isFlipped ? "rotate-y-0 opacity-100" : "-rotate-y-180 opacity-0 pointer-events-none"
                      }`}>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center border-b border-red-900 pb-1.5">
                            <h4 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSquadMemberProfile(player);
                                setSystemAlertMessage(`📁 Accessing profile dossier: ${player.ign}`);
                              }}
                              className="text-xs font-black font-mono text-red-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {player.ign} STATISTICS 🔍
                            </h4>
                            <span className="text-[9px] text-red-500 font-mono">CV RANK: ELITE CHAMPION</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <p className="text-white font-semibold">🏆 Key Laurels:</p>
                            <ul className="list-disc pl-4 text-[10px] text-gray-300">
                              {player.achievements.map((ach, idx) => (
                                <li key={idx}>{ach}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Social directories links */}
                        <div className="pt-2 border-t border-red-950 flex items-center justify-between text-[11px] font-mono">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTacticalPlayerIgn(player.ign);
                              setIsTacticalModalOpen(true);
                              setSystemAlertMessage(`📊 Querying tactical battle-mapping intelligence for ${player.ign}...`);
                            }}
                            className="text-[9px] bg-[#ff001c]/10 hover:bg-[#ff001c] text-[#ff001c] hover:text-white border border-[#ff001c]/20 hover:border-[#ff001c] px-2 py-1 rounded font-mono font-black tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span>📊 TACTICAL MAP</span>
                          </button>
                          <div className="flex gap-2 text-[10px]" onClick={(e) => e.stopPropagation()}>
                            <span className="text-red-400 hover:underline cursor-pointer">Twitch</span>
                            <span className="text-red-400 hover:underline cursor-pointer">YouTube</span>
                            <span className="text-red-400 hover:underline cursor-pointer">Twitter</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })
              })()}
              </div>

              {/* INTERACTIVE SIDE-BY-SIDE PLAYER COMPARISON ENGINE (TOGGLEABLE) */}
              <div className="my-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 bg-[#0d0e14] p-4 rounded-2xl border border-zinc-850">
                  <div>
                    <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wide flex items-center gap-2">
                      <Activity size={16} className="text-red-500" />
                      <span>TACTICAL PLAYER COMPARISON MATRIX</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                      Compare professional metrics side-by-side.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRosterComparisonVisible(prev => !prev)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-750 hover:border-red-500/50 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    {isRosterComparisonVisible ? <EyeOff size={14} className="text-red-400" /> : <Eye size={14} className="text-emerald-400" />}
                    <span>{isRosterComparisonVisible ? "HIDE COMPARISON MATRIX" : "SHOW COMPARISON MATRIX"}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {isRosterComparisonVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <RosterPlayerComparison 
                        comparePlayerA={comparePlayerA}
                        setComparePlayerA={setComparePlayerA}
                        comparePlayerB={comparePlayerB}
                        setComparePlayerB={setComparePlayerB}
                        onAlertMessage={(msg) => setSystemAlertMessage(msg)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* COACHES & SUPPORT ANALYSTS */}
              <SectionTitle text="STRATEGIC COACHES & ROSTER ANALYSTS" sub="Analyzing frame records & gameplay structures" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COACHES_LIST.map((co, idx) => (
                  <div key={idx} className="bg-[#111111] p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                    <span className="text-3xl">{co.avatar}</span>
                    <div>
                      <h4 className="text-xs font-black font-mono tracking-wider text-red-500 uppercase">{co.role}</h4>
                      <h3 className="text-sm font-bold text-white">{co.ign}</h3>
                      <p className="text-xs text-gray-400 mt-1">{co.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* VALUED CREATORS & OUTREACH TEAM */}
              <SectionTitle text="IN-HOUSE STREAMERS & TEAM BROADCASTERS" sub="Delivering premium daily tactical streams" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREATORS_LIST.map((cr, idx) => (
                  <div key={idx} className="bg-[#111111] p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                    <span className="text-3xl">{cr.avatar}</span>
                    <div>
                      <h4 className="text-xs font-black font-mono tracking-wider text-red-500 uppercase">{cr.role}</h4>
                      <h3 className="text-sm font-bold text-white">{cr.ign}</h3>
                      <p className="text-xs text-gray-400 mt-1">{cr.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* TEAM HUB TRAINING CALENDAR DENSITY */}
              <TeamHubDensitySection />

            </div>
          )}

          {/* 5. TAB: STRATEGY ROOM & AI HEAD COACH */}
          {activeTab === "strategy" && (
            <div className="space-y-6 text-left">
              <InteractiveStrategyMaps />

              {/* INTEGRATED SERVER-SIDE AI COACH CONSULTANT */}
              <div id="ai-coach-console" className="bg-[#111111] p-5 rounded-2xl border border-red-600/30 space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
                  <div className="p-2 bg-red-600/20 rounded border border-red-600">
                    <Bot size={22} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-widest font-mono text-white">
                      🤖 HEAD AI COACH - PERFORMANCE STRATEGIST CONSULTANCY
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Query dynamic coaching feedback generated directly from Gemini AI Coach
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">PLAYER IGN</label>
                      <input
                        type="text"
                        value={coachIgn}
                        onChange={(e) => setCoachIgn(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 focus:border-red-600 rounded p-2 text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">GAME DISCIPLINE</label>
                      <select
                        value={coachGame}
                        onChange={(e) => setCoachGame(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-white focus:outline-none font-mono"
                      >
                        <option value="PUBG Mobile">PUBG Mobile</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">CURRENT RANK LEVEL</label>
                      <select
                        value={coachRank}
                        onChange={(e) => setCoachRank(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-white focus:outline-none font-mono"
                      >
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Elite">Elite</option>
                        <option value="CV Legend">CV Legend</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">K/D RATIO</label>
                        <input
                          type="text"
                          value={coachKd}
                          onChange={(e) => setCoachKd(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">MATCHES COUNT</label>
                        <input
                          type="text"
                          value={coachMatches}
                          onChange={(e) => setCoachMatches(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">MOBILE DEVICE SPEC</label>
                      <input
                        type="text"
                        value={coachDevice}
                        onChange={(e) => setCoachDevice(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">TYPICAL PLACEMENT RATIO</label>
                      <input
                        type="text"
                        value={coachPlacement}
                        onChange={(e) => setCoachPlacement(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-1">WHAT TO IMPROVE ON?</label>
                      <textarea
                        value={coachExtra}
                        onChange={(e) => setCoachExtra(e.target.value)}
                        rows={3}
                        placeholder="E.g., Sniping coverage, initial drop mechanics, survival ratios..."
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={triggerAICoachAnalysis}
                      disabled={coachLoading}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black font-mono tracking-widest uppercase rounded shadow cursor-pointer transition-transform"
                    >
                      {coachLoading ? "🛰️ RETRIEVING META COACH ANALYSIS..." : "🧠 CONSULT HEAD COACH AI"}
                    </button>
                  </div>
                </div>

                {/* Output Panel Advice Box */}
                {(coachAdvice || coachLoading) && (
                  <div className="bg-[#0A0A0A] p-5 rounded-lg border border-red-600/30 space-y-2">
                    <h4 className="text-xs font-bold text-red-500 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                      <Sparkles size={14} className="text-red-500 animate-pulse" />
                      SECURE COMMUNIQUE RETRIEVED:
                    </h4>
                    
                    {coachLoading ? (
                      <div className="py-6 flex flex-col items-center justify-center gap-3">
                        <RefreshCw size={24} className="text-red-500 animate-spin" />
                        <span className="text-xs text-gray-400 font-mono italic">Calculating rotation matrices via Gemini...</span>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-300 leading-relaxed space-y-4 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                        {coachAdvice.split("\n").map((line, idx) => {
                          if (line.startsWith("###")) {
                            return <h3 key={idx} className="text-sm font-black text-white border-b border-gray-805 pb-1 select-text">{line.replace("###", "")}</h3>;
                          }
                          if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) {
                            return <p key={idx} className="text-xs text-red-400 font-semibold pl-2 select-text">{line}</p>;
                          }
                          return <p key={idx} className="select-text">{line}</p>;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STRATEGY ROOM SAVED ROTATIONS INDEX */}
              <StrategyRoomDensitySection />

            </div>
          )}

          {/* 6. TAB: MEDIA & CLIPS highlights */}
          {activeTab === "media" && (
            <div className="space-y-6">
              
              {/* Media Sub-Tab Selection */}
              <div className="flex flex-wrap items-center gap-2.5 border-b border-[#141414] pb-4">
                <button
                  onClick={() => {
                    setMediaSubTab("live");
                    awardXp(5);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    mediaSubTab === "live"
                      ? "bg-[#E10600] text-white font-black shadow-[0_0_15px_rgba(225,6,0,0.3)] border border-red-500"
                      : "bg-[#090909] border border-[#141414] text-gray-400 hover:text-white hover:border-gray-800"
                  }`}
                >
                  <Tv size={14} className={mediaSubTab === "live" ? "animate-pulse" : ""} />
                  <span>📺 LIVE STREAMS</span>
                </button>

                <button
                  onClick={() => {
                    setMediaSubTab("broadcasters");
                    awardXp(10);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    mediaSubTab === "broadcasters"
                      ? "bg-[#E10600] text-white font-black shadow-[0_0_15px_rgba(225,6,0,0.3)] border border-red-500"
                      : "bg-[#090909] border border-[#141414] text-gray-400 hover:text-white hover:border-gray-800"
                  }`}
                >
                  <UserCheck size={14} className={mediaSubTab === "broadcasters" ? "animate-pulse" : ""} />
                  <span>🛰️ BROADCASTER HUB</span>
                </button>
                
                <button
                  onClick={() => {
                    setMediaSubTab("vault");
                    awardXp(5);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    mediaSubTab === "vault"
                      ? "bg-[#E10600] text-white font-black shadow-[0_0_15px_rgba(225,6,0,0.3)] border border-red-500"
                      : "bg-[#090909] border border-[#141414] text-gray-400 hover:text-white hover:border-gray-800"
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>🖼️ MEDIA HIGHLIGHTS</span>
                </button>
              </div>

              {mediaSubTab === "live" ? (
                <LiveChannels
                  session={session}
                  awardXp={awardXp}
                  setSystemAlertMessage={setSystemAlertMessage}
                  addCoins={addCoins}
                />
              ) : mediaSubTab === "broadcasters" ? (
                <VerifiedBroadcasters
                  session={session}
                  awardXp={awardXp}
                  setSystemAlertMessage={setSystemAlertMessage}
                  addCoins={addCoins}
                />
              ) : (
                <div className="space-y-6">
                  <SectionTitle text="CV FIELD HIGHLIGHTS & MEDIA VAULT" sub="Roster snapshots, tournament posters, and gameplay records" />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { title: "PUBG Mobile Masters Grand Finale Moment", type: "Roster Winner", date: "June 2026", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" },
                      { title: "Pochinki Castle Conquest Rotation Highlights", type: "Strategy Streamer", date: "May 2026", image: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=400" },
                      { title: "PUBG Bootcamp 1v4 Flawless Squad Clutch", type: "Roster Clip", date: "April 2026", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400" },
                    ].map((media, idx) => (
                      <div key={idx} className="bg-[#111111] rounded-2xl overflow-hidden border border-gray-850 group hover:border-red-650 transition-all flex flex-col justify-between text-left">
                        <div className="relative h-44 overflow-hidden">
                          <img src={media.image} alt={media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute bottom-3 left-3 bg-red-600/90 text-white text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider">
                            {media.type}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-red-500 transition-colors leading-snug">{media.title}</h3>
                          <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                            <span>LODGED: {media.date}</span>
                            <span className="text-red-400 hover:underline cursor-pointer">LAUNCH HIGHLIGHT CLIPS →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STREAMER HUD EXPANSION WIDGET */}
              <StreamerHubDensitySection />

            </div>
          )}

          {/* 7. TAB: NEWS & BULLETINS */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <SectionTitle text="CV OFFICIAL COMMUNIQUE NEWS HUB" sub="Championship updates, strategic patch shifts and rosters reviews" />

              <div className="space-y-4">
                {NEWS_ARTICLES.map((art) => (
                  <div key={art.id} className="bg-[#111111] p-5 rounded-2xl border border-gray-850 flex flex-col md:flex-row gap-5 items-start">
                    <span className="text-4xl p-3 bg-red-650/10 rounded-xl border border-red-600/20 shrink-0">
                      {art.image}
                    </span>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-red-950 text-red-400 border border-red-600/20 px-2 py-0.5 rounded uppercase font-mono">
                          {art.category}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{art.date}</span>
                      </div>
                      <h3 className="text-base font-black text-white">{art.title}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{art.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* NEWS HUB DENSITY TRENDING ISSUES */}
              <NewsHubDensitySection />

            </div>
          )}

          {/* 6.5. TAB: DYNAMIC LEADERBOARDS */}
          {activeTab === "leaderboards" && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Secondary Navigation selectors */}
              <div className="flex flex-wrap gap-2.5 bg-zinc-950/60 p-2 border border-zinc-900/80 rounded-2xl max-w-2xl">
                <button
                  type="button"
                  onClick={() => setLeaderboardSubTab("linking")}
                  className={`flex-1 sm:flex-none p-2.5 px-5 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all border ${
                    leaderboardSubTab === "linking"
                      ? "bg-red-950/25 border-red-900/45 text-red-500 shadow-md scale-[1.01]"
                      : "bg-[#0A0A0B] border-zinc-900 text-zinc-500 hover:text-white cursor-pointer"
                  }`}
                >
                  📊 IDENTITY & STATS LINKING HUB
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardSubTab("rankings")}
                  className={`flex-1 sm:flex-none p-2.5 px-5 text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all border ${
                    leaderboardSubTab === "rankings"
                      ? "bg-red-950/25 border-red-900/45 text-red-500 shadow-md scale-[1.01]"
                      : "bg-[#0A0A0B] border-zinc-900 text-zinc-500 hover:text-white cursor-pointer"
                  }`}
                >
                  🏆 CLASSIC LIVE CHANNELS & RANKINGS
                </button>
              </div>

              {leaderboardSubTab === "linking" && (
                <PlayerStatsLinkingSystem
                  currentIgn={session.ign}
                  onAlert={(msg) => setSystemAlertMessage(msg)}
                />
              )}

              {leaderboardSubTab === "rankings" && (
                <>
              <div className="bg-gradient-to-r from-red-950/20 via-black to-[#0A0A0A] p-5 lg:p-7 rounded-2xl border border-red-900/40 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <SectionTitle text="CV ESPORTS LIVE STATS LEADERBOARDS" sub="Real-time player records synchronized with Live Match Tick cycles" />
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-gray-400 mt-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                      <span>SIMULATOR STATUS: <span className="text-[#FF001C] font-bold">CYCLE #{scoreCycle}</span></span>
                      <span className="text-gray-600">|</span>
                      <span>ACTIVE PLAYERS: <span className="text-white font-bold">{rosterPlayers.length} ENROLLED</span></span>
                    </div>

                    {/* LIVE REFRESH CONTROLLER */}
                    <div className="mt-3 inline-flex flex-wrap items-center gap-3 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-900/60 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${autoRefreshEnabled ? (isSyncing ? "bg-amber-500 animate-spin" : "bg-emerald-500 animate-pulse") : "bg-zinc-600"}`} />
                        <span className="text-zinc-400 uppercase font-extrabold tracking-wider">LIVE DATA FEED:</span>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          id="leaderboard-auto-refresh-toggle"
                          checked={autoRefreshEnabled} 
                          onChange={(e) => {
                            setAutoRefreshEnabled(e.target.checked);
                            if (e.target.checked) {
                              setAutoRefreshCountdown(30);
                            }
                            setSystemAlertMessage(e.target.checked 
                              ? "🔄 Auto-Refresh activated! Competitive matrix and queues sync every 30 seconds." 
                              : "💡 Switched to manual state rendering."
                            );
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#ff001c] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:after:bg-white"></div>
                        <span className="ml-1.5 text-[10px] text-zinc-300 font-bold uppercase cursor-pointer">
                          {autoRefreshEnabled ? "ACTIVE" : "PAUSED"}
                        </span>
                      </label>

                      {autoRefreshEnabled && (
                        <div className="flex items-center gap-2 border-l border-zinc-900 pl-3">
                          <span className="text-zinc-500">NEXT SYNC:</span>
                          <span className="text-[#ff001c] font-black">{autoRefreshCountdown}s</span>
                          
                          {/* Progress slider bar representer */}
                          <div className="w-16 h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-650 transition-all duration-1000 ease-linear" 
                              style={{ width: `${(autoRefreshCountdown / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setScoreCycle(sc => sc + 1);
                          setSystemAlertMessage("🔄 Launched instantaneous manual poll pull for live match logs!");
                        }}
                        className="ml-2 px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-[#ff001c] rounded border border-zinc-800 cursor-pointer font-bold transition-colors"
                      >
                        FORCE PULL
                      </button>
                    </div>
                  </div>
                  
                  {/* Search Query Input */}
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search player IGN..."
                      value={leaderboardSearch}
                      onChange={(e) => setLeaderboardSearch(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF001C] rounded px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none transition-colors"
                    />
                    {leaderboardSearch && (
                      <button 
                        onClick={() => setLeaderboardSearch("")}
                        className="absolute right-2.5 top-2.5 text-gray-500 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Game specific filtering categories */}
                <div className="flex flex-wrap items-center gap-2 border-t border-gray-900 pt-4">
                  {["PUBG Mobile"].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedLeaderboardGame(g);
                        setSystemAlertMessage(`🎯 Filtering leaderboards for ${g}`);
                      }}
                      className={`px-4 py-1.5 rounded text-[11px] font-mono tracking-widest uppercase font-bold border transition-all cursor-pointer ${
                        selectedLeaderboardGame === g
                          ? "bg-[#FF001C] hover:bg-red-700 text-white border-red-500"
                          : "bg-[#141414] hover:bg-[#202020] text-gray-400 border-gray-800"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard Rankings Roster Grid */}
              <div className="bg-[#111111] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="bg-black/80 text-[10px] text-gray-400 font-mono tracking-widest uppercase border-b border-[#ff001f]/20">
                        <th className="py-4 px-6 text-center">RANK</th>
                        <th className="py-4 px-6">TEAM / PLAYER</th>
                        <th className="py-4 px-6">GAME / DISCIPLINE</th>
                        <th className="py-4 px-6 text-center">MATCHES</th>
                        <th className="py-4 px-6 text-center text-white">WINS</th>
                        <th className="py-4 px-6 text-center text-red-500">KILLS</th>
                        <th className="py-4 px-6 text-center text-zinc-300">PLACEMENT PTS</th>
                        <th className="py-4 px-6 text-right text-white">TOTAL POINTS</th>
                        <th className="py-4 px-6 text-center">TREND</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {rosterPlayers.map((player, idx) => {
                        // Calculate real-time stats based on score cycle
                        const baseKd = parseFloat(player.kd);
                        const cycleOffset = Math.sin(scoreCycle + idx) * 0.12;
                        const activeKd = (baseKd + cycleOffset).toFixed(2);
                        const matchesCount = 45 + (idx * 6) + (scoreCycle % 4);
                        const calculatedKills = Math.floor(matchesCount * parseFloat(activeKd));
                        
                        // New dynamic columns data
                        const winsCount = Math.floor(matchesCount * 0.22) + (scoreCycle % 3);
                        const placementPoints = matchesCount * 8 + (idx * 4);
                        const totalPoints = calculatedKills * 15 + placementPoints + (winsCount * 25);

                        // Filters
                        const queryMatch = player.ign.toLowerCase().includes(leaderboardSearch.toLowerCase()) || 
                                           player.name.toLowerCase().includes(leaderboardSearch.toLowerCase());
                        const gameMatch = selectedLeaderboardGame === "All Games" || player.game === selectedLeaderboardGame;

                        if (!queryMatch || !gameMatch) return null;

                        const rankNum = idx + 1;
                        let rankBadge = `${rankNum}`;
                        let rowBg = "hover:bg-white/[0.01]";
                        if (rankNum === 1) {
                          rankBadge = "🥇 CHAMP";
                          rowBg = "bg-red-500/5 hover:bg-red-500/10 border-l-2 border-red-500";
                        } else if (rankNum === 2) {
                          rankBadge = "🥈 ELITE";
                          rowBg = "bg-slate-300/5 hover:bg-slate-300/10 border-l-2 border-slate-300";
                        } else if (rankNum === 3) {
                          rankBadge = "🥉 PRO";
                          rowBg = "bg-zinc-800/5 hover:bg-zinc-800/10 border-l-2 border-zinc-500";
                        }

                        // Rank trend assignment
                        const isUpTrend = (idx + scoreCycle) % 2 === 0;

                        return (
                          <motion.tr
                            key={player.ign}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.4) }}
                            onClick={() => setSelectedDossierPlayer({ 
                              ...player, 
                              kd: activeKd, 
                              tier: rankNum <= 1 ? "GRANDMASTER" : rankNum <= 3 ? "MASTER" : "DIAMOND", 
                              achievements: rankNum <= 2 ? ["League Elite Challenger", "Championship MVP", "Tier 1 Specialist"] : ["Pro Duelist Medal", "Competitive Challenger"] 
                            })}
                            className={`transition-all duration-150 cursor-pointer hover:border-red-500/30 ${rowBg}`}
                          >
                            {/* RANK */}
                            <td className="py-4 px-6 text-center font-mono font-black text-xs">
                              <span className={`px-2.5 py-1 rounded text-[10px] inline-block min-w-[70px] ${
                                rankNum === 1 ? "bg-red-500/20 text-red-500 border border-red-500/30 font-extrabold" :
                                rankNum === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30 font-extrabold" :
                                rankNum === 3 ? "bg-zinc-850 text-stone-200 border border-zinc-700/50 font-extrabold" :
                                "text-gray-500 bg-zinc-950 border border-zinc-900"
                              }`}>
                                {rankBadge}
                              </span>
                            </td>

                            {/* TEAM / PLAYER */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <span className="text-xl shrink-0" title={player.role}>{player.avatar}</span>
                                <div className="text-left">
                                  <div className="flex items-center gap-1.5 font-mono font-bold text-gray-200">
                                    <span>{player.ign}</span>
                                    {rankNum === 1 && <span className="text-red-400 text-[10px] animate-bounce" title="League Master">👑</span>}
                                  </div>
                                  <span className="text-[9px] text-gray-550 font-mono tracking-tight uppercase block mt-0.5">{player.name} | {player.role}</span>
                                </div>
                              </div>
                            </td>

                            {/* GAME / DISCIPLINE */}
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded text-[9px] bg-black text-gray-300 font-mono border border-zinc-900 uppercase tracking-widest font-bold">
                                {player.game}
                              </span>
                            </td>

                            {/* MATCHES */}
                            <td className="py-4 px-6 text-center font-mono text-gray-300 text-sm font-bold">
                              <AnimatedCounter value={matchesCount} />
                            </td>

                            {/* WINS */}
                            <td className="py-4 px-6 text-center font-mono text-white font-extrabold text-sm">
                              <AnimatedCounter value={winsCount} />
                            </td>

                            {/* TOTAL KILLS */}
                            <td className="py-4 px-6 text-center font-mono text-red-500 font-black text-sm drop-shadow-[0_0_5px_rgba(239,68,68,0.2)]">
                              <AnimatedCounter value={calculatedKills} />
                            </td>

                            {/* PLACEMENT POINTS */}
                            <td className="py-4 px-6 text-center font-mono text-zinc-300 font-bold text-sm">
                              <AnimatedCounter value={placementPoints} />
                            </td>

                            {/* TOTAL POINTS */}
                            <td className="py-4 px-6 text-right font-mono font-black text-[#ff001f] text-sm drop-shadow-[0_0_8px_rgba(255,0,31,0.25)]">
                              <AnimatedCounter value={totalPoints} /> <span className="text-[9px] text-gray-500 font-normal">PTS</span>
                            </td>

                            {/* RANK MOVEMENT TREND */}
                            <td className="py-4 px-6 text-center">
                              {isUpTrend ? (
                                <span className="text-red-500 font-black font-mono text-xs animate-pulse" title="Trending Upwards">
                                  ▲ <span className="text-[8px] text-red-500 font-bold font-mono font-sans font-black">+{1 + (idx % 2)}</span>
                                </span>
                              ) : (
                                <span className="text-white font-black font-mono text-xs" title="Position Steady">
                                  ▼ <span className="text-[8px] text-white font-bold font-mono font-sans font-black">-{idx % 2}</span>
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Empty State when Search returns absolutely nothing */}
                {rosterPlayers.filter(player => player.ign.toLowerCase().includes(leaderboardSearch.toLowerCase())).length === 0 && (
                  <div className="text-center p-12 space-y-3 bg-[#0a0a0a]">
                    <Trophy size={32} className="text-gray-600 mx-auto animate-bounce" />
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">NO MATCHING FACTION RECORDED ON DYNAMIC SECTOR</p>
                    <button 
                      onClick={() => setLeaderboardSearch("")}
                      className="px-5 py-2 bg-gradient-to-r from-[#ff001f] to-[#d1001f] text-white rounded font-orbitron text-[10px] uppercase font-black cursor-pointer shadow-[0_0_15px_#ff001f]"
                    >
                      CLEAR SEARCH FILTER
                    </button>
                  </div>
                )}
              </div>

              {/* MVP & Lifetime Placement Records Deck */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 space-y-3">
                  <span className="text-[9px] text-red-500 font-mono uppercase tracking-widest font-extrabold block">LEAGUE CRIMSON FRAGGER</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <div>
                      <h4 className="text-sm font-black font-mono text-white">CV_Slayer_IGL</h4>
                      <p className="text-xs text-gray-500 font-medium">PUBG Mobile Master Assassin</p>
                    </div>
                  </div>
                  <div className="bg-black/50 p-2 px-3 rounded text-[10px] text-gray-400 font-mono flex justify-between">
                    <span>LIFETIME ASSASSINATIONS</span>
                    <span className="text-red-500 font-bold">2,410 Kills</span>
                  </div>
                </div>

                <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 space-y-3">
                  <span className="text-[9px] text-red-500 font-mono uppercase tracking-widest font-extrabold block">REIGNING CLUTCH CHAMPION</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🐍</span>
                    <div>
                      <h4 className="text-sm font-black font-mono text-white">CV_Mamba_Flick</h4>
                      <p className="text-xs text-gray-500 font-medium font-mono">22 Unanswered Headshots Single Session</p>
                    </div>
                  </div>
                  <div className="bg-black/50 p-2 px-3 rounded text-[10px] text-gray-400 font-mono flex justify-between">
                    <span>WIN OVER MULTIPLE SQUADS</span>
                    <span className="text-red-500 font-bold">12 times</span>
                  </div>
                </div>

                <div className="bg-[#111111] p-5 rounded-xl border border-gray-800 space-y-3">
                  <span className="text-[9px] text-amber-500 font-mono uppercase tracking-widest font-extrabold block">SURVIVAL WAR CONQUEROR</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🛡️</span>
                    <div>
                      <h4 className="text-sm font-black font-mono text-white">CV_Alpha_Spectre</h4>
                      <p className="text-xs text-gray-500 font-mono">Anchor Specialist / High Guardian</p>
                    </div>
                  </div>
                  <div className="bg-black/50 p-2 px-3 rounded text-[10px] text-gray-400 font-mono flex justify-between">
                    <span>MEDIAN OUTPLAY MATCH RATING</span>
                    <span className="text-amber-500 font-bold">#1.8 Average Posture</span>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* Standalone Ranked TDM Ecosystem */}
          {activeTab === "tdmArena" && (
            <div className="space-y-6 animate-fade-in text-left">
              <CVTdmArena 
                userSession={session}
                systemAlertMessage={systemAlertMessage}
                setSystemAlertMessage={setSystemAlertMessage}
              />
              <TdmArenaDensitySection />
            </div>
          )}

          {/* 6.6. TAB: TDM ARENA */}
          {activeTab === "tdm" && (
            <div className="space-y-8 animate-fade-in text-left p-1 border border-[#ff001c]/15 rounded-3xl bg-neutral-950/70 backdrop-blur-2xl relative overflow-hidden">
              {/* Background overlays & grid */}
              <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,0,0,0.1)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,0,0,0.1)_1.5px,transparent_1.5px)] bg-[size:40px_40px] pointer-events-none" />
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-650/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-800/10 rounded-full blur-[120px] pointer-events-none" />

              {/* Graphical Title Header Banner */}
              <div className="relative z-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-red-955/20 via-zinc-950/90 to-black border border-red-655/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-955/40 border border-[#ff001f]/30 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff001c] animate-ping" />
                    <span className="text-[9px] text-[#ff001c] font-black tracking-widest font-mono">CRIMSON VIPERS INTEL OPERATIONS</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold font-orbitron tracking-tight text-white uppercase bg-gradient-to-r from-white via-stone-200 to-red-500 bg-clip-text text-transparent">
                    TDM HQ TACTICAL ARENA
                  </h2>
                  <p className="text-xs text-gray-400 font-medium max-w-xl leading-relaxed">
                    Operate real-time weapon calibrations, coordinate regional squads, register competitive tournament brackets, and verify combat reports on the live Crimson Viper duel ledger.
                  </p>
                </div>
              </div>

              {/* INTEGRATED ESPORTS TDM HQ COMMUNITY HUB */}
              <div className="relative z-10 px-4 pb-4">
                <CVTdmEcosystem 
                  userSession={session}
                  tdmSimulatorActive={tdmSimulatorActive}
                  setTdmSimulatorActive={setTdmSimulatorActive}
                  tdmUserScore={tdmUserScore}
                  setTdmUserScore={setTdmUserScore}
                  tdmEnemyScore={tdmEnemyScore}
                  setTdmEnemyScore={setTdmEnemyScore}
                  tdmWeapon={tdmWeapon}
                  setTdmWeapon={setTdmWeapon}
                  tdmStrategy={tdmStrategy}
                  setTdmStrategy={setTdmStrategy}
                  tdmSecondary={tdmSecondary}
                  setTdmSecondary={setTdmSecondary}
                  tdmScope={tdmScope}
                  setTdmScope={setTdmScope}
                  tdmMuzzle={tdmMuzzle}
                  setTdmMuzzle={setTdmMuzzle}
                  tdmMagazine={tdmMagazine}
                  setTdmMagazine={setTdmMagazine}
                  tdmGrip={tdmGrip}
                  setTdmGrip={setTdmGrip}
                  tdmTactical={tdmTactical}
                  setTdmTactical={setTdmTactical}
                  copiedLoadout={copiedLoadout}
                  handleCopyLoadoutCode={handleCopyLoadoutCode}
                  loadoutInputCode={loadoutInputCode}
                  setLoadoutInputCode={setLoadoutInputCode}
                  handleImportLoadoutCode={handleImportLoadoutCode}
                  tdmLogs={tdmLogs}
                  setTdmLogs={setTdmLogs}
                  tdmHistory={tdmHistory}
                  setTdmHistory={setTdmHistory}
                  tdmChartData={tdmChartData}
                  setTdmChartData={setTdmChartData}
                  tdmReplayTick={tdmReplayTick}
                  setTdmReplayTick={setTdmReplayTick}
                  tdmReplayIsPaused={tdmReplayIsPaused}
                  setTdmReplayIsPaused={setTdmReplayIsPaused}
                  tdmLadder={tdmLadder}
                  setTdmLadder={setTdmLadder}
                  startTdmMatchSim={startTdmMatchSim}
                  matchOpponent={matchOpponent}
                  setMatchOpponent={setMatchOpponent}
                  selectedContinent={selectedContinent}
                  setSelectedContinent={setSelectedContinent}
                  systemAlertMessage={systemAlertMessage}
                  setSystemAlertMessage={setSystemAlertMessage}
                />
              </div>

              {/* TOP SECTION: WEAPON TEST WORKSHOP & PROGRESSION CHARTS */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
                
                {/* Armory Loadout Control Console */}
                <div className="lg:col-span-1 bg-black/90 p-5 rounded-2xl border border-zinc-900 space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                    <Flame className="text-red-500 animate-pulse shrink-0" size={18} />
                    <h3 className="text-xs font-black text-white font-mono tracking-widest uppercase">ARMORY CALIBRATOR</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Continent Selector (Matches same continent for low ping) */}
                    <div>
                      <label className="text-[9px] font-mono text-red-500 block uppercase mb-1 font-bold">
                        MATCHMAKER SERVER REGION (CONTINENT)
                      </label>
                      <select
                        value={selectedContinent}
                        onChange={(e) => {
                          setSelectedContinent(e.target.value);
                          setSystemAlertMessage(`🌐 Matchmaking server switched to ${e.target.value}. Low-latency routing established!`);
                        }}
                        disabled={tdmSimulatorActive}
                        className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001c] text-xs text-white p-2.5 rounded font-mono cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="North America">North America (NA server, ~12ms, No jitter)</option>
                        <option value="Europe">Europe (EU server, ~10ms, No jitter)</option>
                        <option value="Asia">Asia (AS server, ~15ms, No jitter)</option>
                        <option value="South America">South America (SA server, ~22ms, No jitter)</option>
                        <option value="Africa">Africa (AF server, ~19ms, No jitter)</option>
                        <option value="Oceania">Oceania (OC server, ~21ms, No jitter)</option>
                      </select>
                      <p className="text-[8px] text-zinc-500 font-sans mt-1 leading-normal">
                        ⚠️ Strict alignment enforced: Matchmaker filters only same-continent candidates, eliminating high ms & packet fluctuations.
                      </p>
                    </div>

                    {/* Weapon Selector */}
                    <div>
                      <label className="text-[9px] font-mono text-gray-500 block uppercase mb-1 font-bold">PRIMARY WEAPON SPEC</label>
                      <select
                        value={tdmWeapon}
                        onChange={(e) => setTdmWeapon(e.target.value)}
                        disabled={tdmSimulatorActive}
                        className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001f] text-xs text-white p-2.5 rounded font-mono cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="M416 Tracer Spray">M416 (Tracer Bullet Spray)</option>
                        <option value="Groza CQB Shredder">Groza (CQB Bullet Shredder)</option>
                        <option value="AWM Absolute One-Tap">AWM (Absolute One-Tap Sniper)</option>
                        <option value="UMP45 Laser Beam">UMP45 (Laser hip-fire Beam)</option>
                        <option value="M16A4 Burst Trigger">M16A4 (High burst-rate clicker)</option>
                      </select>
                    </div>

                    {/* Secondary Weapon & Scopes Customizations */}
                    <div className="bg-[#050505] p-3 border border-zinc-900/60 rounded-xl space-y-3">
                      <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5 mb-1">
                        <span className="text-[10px] font-mono text-[#ff001c] font-extrabold tracking-wider uppercase">LOADOUT EQUIPMENT & ATTACHMENTS</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-mono text-gray-500 block uppercase mb-0.5 font-bold">SECONDARY WEAPON</label>
                          <select
                            value={tdmSecondary}
                            onChange={(e) => setTdmSecondary(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#0a0a0a] border border-zinc-900 focus:border-[#ff001f] text-[10px] text-white p-1.5 rounded font-mono cursor-pointer"
                          >
                            <option value="Desert Eagle Heavy">Desert Eagle Heavy</option>
                            <option value="Scorpion Auto-Pistol">Scorpion Auto-Pistol</option>
                            <option value="P18C Full-Auto">P18C Full-Auto</option>
                            <option value="None">No Sidearm</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono text-gray-500 block uppercase mb-0.5 font-bold">OPTIC SCOPE</label>
                          <select
                            value={tdmScope}
                            onChange={(e) => setTdmScope(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#0a0a0a] border border-zinc-900 focus:border-[#ff001f] text-[10px] text-white p-1.5 rounded font-mono cursor-pointer"
                          >
                            <option value="Iron Sights">Iron Sights</option>
                            <option value="Red Dot Sight">Red Dot Sight</option>
                            <option value="3x Backlit Optic">3x Scope</option>
                            <option value="4x ACOG Scope">4x ACOG</option>
                            <option value="6x Tactical Scope">6x Scope</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono text-gray-500 block uppercase mb-0.5 font-bold">MUZZLE SPEC</label>
                          <select
                            value={tdmMuzzle}
                            onChange={(e) => setTdmMuzzle(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#0a0a0a] border border-zinc-900 focus:border-[#ff001f] text-[10px] text-white p-1.5 rounded font-mono cursor-pointer"
                          >
                            <option value="None/Default">None/Default</option>
                            <option value="Muzzle Compensator">Compensator</option>
                            <option value="Viper Suppressor">Suppressor</option>
                            <option value="Flash Hider">Flash Hider</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono text-gray-500 block uppercase mb-0.5 font-bold">MAGAZINE SPEC</label>
                          <select
                            value={tdmMagazine}
                            onChange={(e) => setTdmMagazine(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#0a0a0a] border border-zinc-900 focus:border-[#ff001f] text-[10px] text-white p-1.5 rounded font-mono cursor-pointer"
                          >
                            <option value="Standard Mag">Standard Mag</option>
                            <option value="Extended Mag">Extended Mag</option>
                            <option value="Extended Quickdraw Mag">Extended Quickdraw</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono text-gray-500 block uppercase mb-0.5 font-bold">GRIP ATTACHMENT</label>
                          <select
                            value={tdmGrip}
                            onChange={(e) => setTdmGrip(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#0a0a0a] border border-zinc-900 focus:border-[#ff001f] text-[10px] text-white p-1.5 rounded font-mono cursor-pointer"
                          >
                            <option value="None/Default">None/Default</option>
                            <option value="Vertical Foregrip">Vertical Foregrip</option>
                            <option value="Angled Foregrip">Angled Foregrip</option>
                            <option value="Half Grip">Half Grip</option>
                            <option value="Laser Sight">Laser Sight</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono text-gray-500 block uppercase mb-0.5 font-bold">TACTICAL UTILITY</label>
                          <select
                            value={tdmTactical}
                            onChange={(e) => setTdmTactical(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#0a0a0a] border border-zinc-900 focus:border-[#ff001f] text-[10px] text-white p-1.5 rounded font-mono cursor-pointer"
                          >
                            <option value="Frag Grenade">Frag Grenade</option>
                            <option value="Smoke Grenade">Smoke Grenade</option>
                            <option value="Stun Flashbang">Stun Flashbang</option>
                            <option value="Molotov Cocktail">Molotov Cocktail</option>
                          </select>
                        </div>
                      </div>

                      {/* COPY LOADOUT CODE ACTIONS BLOCK */}
                      <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2.5">
                          <button
                            type="button"
                            onClick={handleCopyLoadoutCode}
                            className="w-full py-1.5 px-3 bg-[#111111] hover:bg-neutral-900 text-[10px] text-white border border-zinc-850 hover:border-zinc-700 rounded-lg flex items-center justify-center gap-1.5 font-mono uppercase tracking-wide cursor-pointer select-none active:scale-95 transition-all"
                          >
                            {copiedLoadout ? (
                              <>
                                <Check size={12} className="text-emerald-500" />
                                <span className="text-emerald-500 font-bold">CODE COPIED!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} className="text-red-500" />
                                <span>COPY LOADOUT CODE</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Import Loadout Control */}
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="PASTE CODE (e.g., CV-TDM-M416-...)"
                            value={loadoutInputCode}
                            onChange={(e) => setLoadoutInputCode(e.target.value)}
                            className="flex-1 bg-[#090909] border border-zinc-900 focus:border-[#ff001f] rounded-lg px-2 py-1 text-[9px] font-mono text-white placeholder-zinc-700 uppercase focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleImportLoadoutCode(loadoutInputCode)}
                            className="px-2.5 py-1 bg-red-955 border border-red-550/20 hover:bg-red-655 text-white hover:text-white rounded-lg text-[9px] font-mono font-black uppercase tracking-wider select-none active:scale-95 transition-all text-center"
                          >
                            IMPORT
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Faction Strategy Selector */}
                    <div>
                      <label className="text-[9px] font-mono text-gray-500 block uppercase mb-1 font-bold">TACTICAL ROSTER STRATEGY</label>
                      <select
                        value={tdmStrategy}
                        onChange={(e) => setTdmStrategy(e.target.value)}
                        disabled={tdmSimulatorActive}
                        className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001f] text-xs text-white p-2.5 rounded font-mono cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Aggressive Rush">Aggressive Center Rush</option>
                        <option value="Tactical Flank">Tactical Container Flank</option>
                        <option value="Defensive Crossfire">Passive Spawn Holding</option>
                        <option value="Spawn Sniping">Quick-Scope Lane Sniping</option>
                      </select>
                    </div>

                    {/* AUTO-QUEUE TOGGLE CONTROL */}
                    <div className="bg-[#050505] p-3 border border-red-500/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Zap size={13} className="text-[#ff001c] animate-pulse" />
                          <span className="text-[10px] font-mono text-zinc-300 font-extrabold tracking-wider uppercase">AUTO-QUEUE ENGINE</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            id="tdm-auto-queue-toggle"
                            checked={tdmAutoQueue} 
                            onChange={(e) => {
                              setTdmAutoQueue(e.target.checked);
                              setSystemAlertMessage(e.target.checked 
                                ? "🔄 Auto-Queue Mode Engaged! Ready to auto-pair waiting users of similar Rank Tier." 
                                : "💡 Switched to Manual Opposing Faction selection."
                              );
                            }}
                            disabled={tdmSimulatorActive}
                            className="sr-only peer" 
                          />
                          <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:bg-[#ff001c] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:after:bg-white disabled:opacity-40"></div>
                        </label>
                      </div>
                      
                      <p className="text-[9px] text-zinc-400 font-sans leading-normal">
                        Automatically pair Crimson Vipers with active waiting users holding matching or closest Rank Tiers (Target: <span className="text-red-500 font-black font-mono">{tdmLadder.find(p => p.ign.includes("You"))?.tier || "Platinum"}</span>).
                      </p>

                      {tdmAutoQueue && (
                        <div className="space-y-1.5 pt-1.5 border-t border-zinc-900/60">
                          <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase flex items-center gap-1 font-bold">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            LOBBY QUEUE: RELIABLE SAME-CONTINENT APPLICANTS
                          </span>
                          
                          <div className="grid grid-cols-1 gap-1 text-[9px] font-mono max-h-[110px] overflow-y-auto no-scrollbar">
                            {[
                              // North America
                              { ign: "Apex_Ghost_IGL", tier: "Master", points: 2100, continent: "North America" },
                              { ign: "CV_Lethal_Pride", tier: "Platinum", points: 1520, continent: "North America" },
                              { ign: "Texas_Ranger", tier: "Gold", points: 1210, continent: "North America" },
                              { ign: "Detroit_Steel", tier: "Diamond", points: 1740, continent: "North America" },
                              { ign: "Raptor_F22", tier: "Grandmaster", points: 2420, continent: "North America" },
                              // Europe
                              { ign: "ViperShoot_PRO", tier: "Master", points: 1950, continent: "Europe" },
                              { ign: "Asgard_Loki", tier: "Platinum", points: 1530, continent: "Europe" },
                              { ign: "Euro_Slayer", tier: "Master", points: 2050, continent: "Europe" },
                              { ign: "London_Fog", tier: "Gold", points: 1230, continent: "Europe" },
                              { ign: "Berlin_Wall", tier: "Diamond", points: 1760, continent: "Europe" },
                              { ign: "Paris_Viper", tier: "Grandmaster", points: 2410, continent: "Europe" },
                              // Asia
                              { ign: "Hydra_Avenger_1", tier: "Diamond", points: 1780, continent: "Asia" },
                              { ign: "Tokyo_Drifter", tier: "Platinum", points: 1490, continent: "Asia" },
                              { ign: "Seoul_Viper", tier: "Master", points: 2050, continent: "Asia" },
                              { ign: "Beijing_Dragon", tier: "Gold", points: 1240, continent: "Asia" },
                              { ign: "Delhi_Sultan", tier: "Grandmaster", points: 2430, continent: "Asia" },
                              // South America
                              { ign: "Viper_Alpha_01", tier: "Platinum", points: 1480, continent: "South America" },
                              { ign: "Rio_Gaucho", tier: "Platinum", points: 1500, continent: "South America" },
                              { ign: "Amazon_Tiger", tier: "Diamond", points: 1720, continent: "South America" },
                              { ign: "Samba_Striker", tier: "Gold", points: 1190, continent: "South America" },
                              { ign: "Pampas_Condor", tier: "Master", points: 2010, continent: "South America" },
                              // Africa
                              { ign: "ZIM_Warrior_X", tier: "Diamond", points: 1690, continent: "Africa" },
                              { ign: "ZIM_Ghost_07", tier: "Gold", points: 1250, continent: "Africa" },
                              { ign: "Cairo_Pharaoh", tier: "Platinum", points: 1480, continent: "Africa" },
                              { ign: "CapeTown_Slayer", tier: "Master", points: 1980, continent: "Africa" },
                              { ign: "Sahara_Sandstorm", tier: "Grandmaster", points: 2390, continent: "Africa" },
                              // Oceania
                              { ign: "Sydney_Wallaby", tier: "Platinum", points: 1520, continent: "Oceania" },
                              { ign: "Melbourne_Ace", tier: "Diamond", points: 1750, continent: "Oceania" },
                              { ign: "Aussie_Sniper", tier: "Diamond", points: 1720, continent: "Oceania" },
                              { ign: "KIWI_Flicker", tier: "Gold", points: 1200, continent: "Oceania" },
                              { ign: "GreatBarrier_Diver", tier: "Master", points: 1960, continent: "Oceania" }
                            ]
                            .filter(cand => cand.continent === selectedContinent)
                            .map((app) => {
                              const isClosest = app.tier === (tdmLadder.find(p => p.ign.includes("You"))?.tier || "Platinum");
                              const mockPing = selectedContinent === "Europe" ? "10ms" : selectedContinent === "Asia" ? "15ms" : selectedContinent === "South America" ? "22ms" : selectedContinent === "Africa" ? "19ms" : selectedContinent === "Oceania" ? "21ms" : "12ms";
                              return (
                                <div key={app.ign} className={`px-2 py-1 border rounded flex justify-between items-center transition-colors duration-150 ${isClosest ? "bg-[#140b0c] border-[#ff001c]/25 text-red-100" : "bg-neutral-950 border-zinc-900 text-zinc-400"}`}>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-white">🎮 {app.ign}</span>
                                    <span className="text-[7.5px] text-zinc-500 font-mono">Region: {app.continent}</span>
                                  </div>
                                  <div className="flex gap-1.5 items-center">
                                    <span className={`px-1 rounded text-[7px] font-black uppercase ${app.tier === "Platinum" ? "bg-red-900/40 text-red-400 border border-red-500/20" : app.tier === "Diamond" ? "bg-blue-950/40 text-blue-400 border border-blue-500/10" : "bg-zinc-900 text-zinc-400"}`}>{app.tier}</span>
                                    <span className="text-[8px] text-emerald-500 font-bold font-mono">{mockPing}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Select Team Match Opponent */}
                    {!tdmAutoQueue && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[9px] font-mono text-gray-500 block uppercase mb-1 font-bold">OPPOSING FACTION TEAM</label>
                          <select
                            id="tdm-opponent-team-select"
                            value={manualOpponent}
                            onChange={(e) => setManualOpponent(e.target.value)}
                            disabled={tdmSimulatorActive}
                            className="w-full bg-[#070707] border border-zinc-900 focus:border-[#ff001f] text-xs text-white p-2.5 rounded font-mono cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="Apex Predators">Apex Predators (North America)</option>
                            <option value="Hydra Avengers">Hydra Avengers Esports (Europe)</option>
                            <option value="Viper Squad Intel">Viper Squad Intel (Asia)</option>
                            <option value="Phoenix Esports">Phoenix Esports (South America)</option>
                          </select>
                        </div>

                        {/* Network Latency Handshake Check */}
                        {(() => {
                          const manualOpponentContinents: { [key: string]: string } = {
                            "Apex Predators": "North America",
                            "Hydra Avengers": "Europe",
                            "Viper Squad Intel": "Asia",
                            "Phoenix Esports": "South America"
                          };
                          const opponentContinent = manualOpponentContinents[manualOpponent] || "North America";
                          const isAligned = opponentContinent === selectedContinent;
                          if (!isAligned) {
                            return (
                              <div className="bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg flex items-start gap-2 text-[10px] font-mono text-red-400">
                                <span className="text-sm">⚠️</span>
                                <div className="space-y-1">
                                  <p className="font-bold uppercase tracking-wide text-red-500">REGION JITTER CAUTION (MS SPIKES)</p>
                                  <p className="leading-snug text-gray-400 text-[9px]">
                                    Opponent resides in <span className="text-white font-bold">{opponentContinent}</span>, but your matchmaking server is on <span className="text-white font-bold">{selectedContinent}</span>. This will introduce packet fluctuation / simulation latency of ~150-250ms!
                                  </p>
                                  <button
                                    onClick={() => {
                                      setSelectedContinent(opponentContinent);
                                      setSystemAlertMessage(`🌐 Auto-aligned matchmaking server to ${opponentContinent}!`);
                                    }}
                                    className="px-1.5 py-0.5 mt-1 bg-red-900/40 border border-red-500/20 rounded text-[8px] font-bold text-white uppercase hover:bg-red-650 transition-colors cursor-pointer"
                                  >
                                    [SYNC SERVER TO {opponentContinent.toUpperCase()}]
                                  </button>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg flex items-center gap-2 text-[10px] font-mono text-emerald-400 w-full">
                                <span className="text-sm">✓</span>
                                <div className="leading-snug">
                                  <strong className="block uppercase tracking-wider text-[8px] text-emerald-555">Perfect Region Handshake</strong>
                                  <p className="text-gray-400 text-[9px]">Ping stabilized at {selectedContinent === "Europe" ? "10ms" : selectedContinent === "Asia" ? "15ms" : "12ms"}. Packet jitter and ms fluctuations suppressed.</p>
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}

                    {/* Simulation trigger button */}
                    <button
                      onClick={() => {
                        const selectEl = document.getElementById("tdm-opponent-team-select") as HTMLSelectElement | null;
                        const matchOpponent = selectEl ? selectEl.value : "Hydra Avengers";
                        startTdmMatchSim(tdmWeapon, tdmStrategy, matchOpponent);
                      }}
                      disabled={tdmSimulatorActive}
                      className={`w-full py-3 font-orbitron font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-305 border flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        tdmSimulatorActive
                          ? "bg-zinc-900 border-zinc-850 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-600 to-red-700 hover:from-white hover:to-white hover:text-black hover:border-white text-white border-red-500 hover:shadow-[0_0_20px_rgba(255,0,31,0.4)] hover:scale-102 active:scale-95 duration-300"
                      }`}
                    >
                      {tdmSimulatorActive ? (
                        <>
                          <RefreshCw className="animate-spin text-[#ff001c]" size={14} />
                          <span>SYNCHRONIZING COMBAT SOCKETS...</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} className="text-[#ff001c]" />
                          <span>{tdmAutoQueue ? "LAUNCH MATCH WITH AUTO-QUEUE" : "LAUNCH MATCH SIMULATION"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Scoreboard and Progression Graph Area */}
                <div className="lg:col-span-2 bg-black/90 p-5 rounded-2xl border border-zinc-900 space-y-4 flex flex-col justify-between">
                  {/* Team deathmatch Scoreboard */}
                  <div className="bg-black/60 p-4 rounded-xl border border-zinc-900 flex items-center justify-between gap-4">
                    {/* CV Team */}
                    <div className="text-center space-y-1 flex-1">
                      <span className="text-[9px] font-mono text-red-500 tracking-widest uppercase font-black block">CRIMSON VIPERS</span>
                      <p className="text-4xl font-black font-orbitron text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]">{tdmUserScore}</p>
                      <span className="text-[8px] text-zinc-500 font-mono block">MVP TARGET RATING</span>
                    </div>

                    {/* VS divider */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase font-bold">WAREHOUSE TDM</span>
                      <span className="bg-zinc-900 px-2.5 py-0.5 rounded text-[8px] text-zinc-400 font-mono mt-1">40 LIMIT</span>
                    </div>

                    {/* Opponent Team */}
                    <div className="text-center space-y-1 flex-1">
                      <span className="text-[9px] font-mono text-blue-400 tracking-widest uppercase font-black block">OPPONENTS</span>
                      <p className="text-4xl font-black font-orbitron text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">{tdmEnemyScore}</p>
                      <span className="text-[8px] text-zinc-500 font-mono block">MATCH LEVEL</span>
                    </div>
                  </div>

                  {/* SCORE PROGRESSION RECHARTS PLOT CARD */}
                  {isAutoQueueSearching ? (
                    <TdmRadarScan 
                      step={matchmakerStep} 
                      userTier={tdmLadder.find(p => p.ign.includes("You"))?.tier || "Platinum"} 
                    />
                  ) : (
                    <div className="bg-zinc-950 rounded-xl border border-zinc-900 p-4 space-y-4">
                      
                      {/* Sub-Header Banner with Control/Status */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-1">
                        <div className="flex items-center gap-1.5 text-red-500">
                          <Activity size={12} className="animate-pulse" />
                          <span className="text-[10px] font-mono uppercase font-black tracking-widest">
                            {isTdmReplaying ? "📽️ TACTICAL REPLAY MONITOR" : "LIVE SCORE progression LINE CHART"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isTdmReplaying && (
                            <span className="text-[8px] bg-red-950/60 border border-red-500/20 px-2 py-0.5 rounded font-mono text-red-400 font-extrabold tracking-wider animate-pulse uppercase leading-none">
                              TICK {tdmReplayTick} / {tdmChartData.length - 1} | SPEED: {Math.round(1000 / tdmReplaySpeed)} FPS
                            </span>
                          )}
                          <span className="text-[8px] text-zinc-500 font-mono uppercase">
                            {isTdmReplaying ? "Slo-Mo Trajectory Playback" : "Vipers (Red) vs Opposition (Blue)"}
                          </span>
                        </div>
                      </div>

                      {/* Display active score and ticker for replay */}
                      {isTdmReplaying && (
                        <div className="bg-[#0c0c10] p-2 rounded-lg border border-red-500/15 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-4 pl-1">
                            <div className="text-left">
                              <span className="text-[7px] text-red-500 font-black block leading-none">VIPERS</span>
                              <span className="text-sm font-bold text-red-400">{(tdmChartData[tdmReplayTick] || { CrimsonVipers: 0 }).CrimsonVipers}</span>
                            </div>
                            <span className="text-zinc-650 text-[11px] font-bold">:</span>
                            <div className="text-left">
                              <span className="text-[7px] text-blue-400 font-black block leading-none">OPPONENT</span>
                              <span className="text-sm font-bold text-blue-400">{(tdmChartData[tdmReplayTick] || { Opponent: 0 }).Opponent}</span>
                            </div>
                          </div>

                          {/* Dynamic banner of active highlight */}
                          <div className="flex-1 bg-black/50 border border-zinc-900/80 mx-3 p-1 px-2.5 rounded-md h-8 flex items-center overflow-hidden">
                            {(() => {
                              // Find the most recent highlight that has occurred up to tdmReplayTick
                              const pastHighlights = tdmReplayHighlights.filter(h => h.tick <= tdmReplayTick);
                              if (pastHighlights.length > 0) {
                                const currentH = pastHighlights[pastHighlights.length - 1];
                                return (
                                  <div className="flex items-center gap-1.5 text-[9px] font-sans text-amber-200">
                                    <span className="font-mono text-red-500 font-extrabold shrink-0">{`[TICK ${currentH.tick}]`}</span>
                                    <span className="line-clamp-1 italic text-zinc-200">{currentH.description}</span>
                                  </div>
                                );
                              }
                              return (
                                <span className="text-[8px] text-zinc-650 uppercase font-mono italic">
                                  Analyzing combat telemetry stream...
                                </span>
                              );
                            })()}
                          </div>

                          {/* Close Replay button */}
                          <button
                            type="button"
                            onClick={() => setIsTdmReplaying(false)}
                            className="p-1 px-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded font-mono text-[8px] font-black text-red-400 hover:text-white cursor-pointer transition-colors"
                          >
                            EXIT [X]
                          </button>
                        </div>
                      )}

                      {/* Line Chart */}
                      <div className="h-44 w-full pt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={isTdmReplaying ? tdmChartData.slice(0, tdmReplayTick + 1) : tdmChartData} 
                            margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
                            <XAxis dataKey="tick" stroke="#333" fontSize={8} />
                            <YAxis domain={[0, 42]} stroke="#333" fontSize={8} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#050505', borderColor: '#ef4444', borderWidth: '1px', fontSize: '10px' }} 
                              itemStyle={{ color: '#fff' }} 
                            />
                            <Line type="monotone" dataKey="CrimsonVipers" name="Vipers Score" stroke="#ef4444" strokeWidth={2.5} dot={false} strokeDasharray="" />
                            <Line type="monotone" dataKey="Opponent" name="Opponent Score" stroke="#3b82f6" strokeWidth={2.5} dot={false} strokeDasharray="" />
                            
                            {isTdmReplaying && (
                              <ReferenceLine 
                                x={tdmReplayTick} 
                                stroke="#ff001c" 
                                strokeDasharray="3 3" 
                                label={{ value: `TICK ${tdmReplayTick}`, fill: '#ff001c', fontSize: 7, position: 'top', fontWeight: 'bold' }} 
                              />
                            )}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* TACTICAL REPLAY HUB CONTROLS PANEL */}
                      {isTdmReplaying && (
                        <div className="bg-[#050507] p-3 rounded-xl border border-zinc-900 space-y-3 font-mono">
                          
                          {/* Playback action buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 text-[9px] border-b border-zinc-900 pb-2">
                            <div className="flex items-center gap-1.5">
                              {/* PAUSE / PLAY */}
                              <button
                                type="button"
                                onClick={() => setTdmReplayIsPaused(!tdmReplayIsPaused)}
                                className="py-1 px-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded font-black text-white cursor-pointer flex items-center gap-1 text-[8px]"
                              >
                                {tdmReplayIsPaused ? "▶ PLAY" : "⏸ PAUSE"}
                              </button>

                              {/* STEP BACK */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTdmReplayIsPaused(true);
                                  setTdmReplayTick(prev => Math.max(0, prev - 1));
                                }}
                                className="py-1 px-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded font-bold text-zinc-300 cursor-pointer text-[8px]"
                                title="Previous Tick"
                              >
                                ◀ STEP BACK
                              </button>

                              {/* STEP FORWARD */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTdmReplayIsPaused(true);
                                  setTdmReplayTick(prev => Math.min(tdmChartData.length - 1, prev + 1));
                                }}
                                className="py-1 px-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded font-bold text-zinc-300 cursor-pointer text-[8px]"
                                title="Next Tick"
                              >
                                STEP FORWARD ▶
                              </button>

                              {/* RESET */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTdmReplayTick(0);
                                  setTdmReplayIsPaused(true);
                                }}
                                className="py-1 px-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded text-zinc-400 hover:text-white cursor-pointer text-[8px]"
                              >
                                🔄 REWIND
                              </button>
                            </div>

                            {/* SPEED CONTROL */}
                            <div className="flex items-center gap-1 bg-black p-0.5 border border-zinc-905 rounded">
                              <span className="text-zinc-600 px-1.5 select-none text-[8px] font-black uppercase">SPEED:</span>
                              {[
                                { label: "SLOW", ms: 750 },
                                { label: "MEDIUM", ms: 400 },
                                { label: "FAST", ms: 200 },
                                { label: "WARP", ms: 70 }
                              ].map(speedObj => (
                                <button
                                  key={speedObj.label}
                                  type="button"
                                  onClick={() => setTdmReplaySpeed(speedObj.ms)}
                                  className={`px-2 py-0.5 rounded text-[7px] font-black tracking-tighter cursor-pointer transition-colors ${
                                    tdmReplaySpeed === speedObj.ms
                                      ? "bg-red-950 text-red-400 border border-red-500/30"
                                      : "text-zinc-550 hover:bg-zinc-900 hover:text-white"
                                  }`}
                                >
                                  {speedObj.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* SLIDER FOR TIMELINE DRAG SCRUBBER */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[7px] text-zinc-500 font-bold">
                              <span>START [TICK 0]</span>
                              <span className="text-red-500 font-extrabold uppercase tracking-wide">DRAG SCRUBBER TIMELINE</span>
                              <span>END [TICK {tdmChartData.length - 1}]</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={tdmChartData.length - 1}
                              value={tdmReplayTick}
                              onChange={(e) => {
                                setTdmReplayIsPaused(true);
                                setTdmReplayTick(parseInt(e.target.value, 10));
                              }}
                              className="w-full accent-red-500 bg-zinc-900 h-1.5 rounded-lg cursor-pointer focus:outline-none"
                            />
                          </div>

                          {/* HIGHLIGHTED ANOMALIES / SCORE SWINGS MATRIX */}
                          <div className="space-y-1.5">
                            <span className="text-[8px] text-zinc-450 font-black tracking-wider uppercase block border-b border-zinc-900 pb-1">
                              DETECTED SCANNING ANOMALIES & SCORE SWINGS ({tdmReplayHighlights.length})
                            </span>
                            <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1 select-none no-scrollbar">
                              {tdmReplayHighlights.length === 0 ? (
                                <div className="text-[8px] text-zinc-500 italic text-center p-2">
                                  No notable tactical swing points detected in this match sequence.
                                </div>
                              ) : (
                                tdmReplayHighlights.map((hl, k) => {
                                  const isActive = tdmReplayTick >= hl.tick;
                                  const isExact = tdmReplayTick === hl.tick;
                                  
                                  let badgeColor = "bg-zinc-900 text-zinc-400 border-zinc-800";
                                  let badgeIcon = "▶";
                                  if (hl.type === "lead_change") {
                                    badgeColor = "bg-amber-950 text-amber-400 border-amber-600/30";
                                    badgeIcon = "🎯 LEAD";
                                  } else if (hl.type === "clutch") {
                                    badgeColor = "bg-red-955/40 text-red-200 border-red-500/30";
                                    badgeIcon = "⚡ CLUTCH";
                                  } else if (hl.type === "vipers_run") {
                                    badgeColor = "bg-emerald-950 text-emerald-400 border-emerald-500/20";
                                    badgeIcon = "🔥 RUSH";
                                  } else if (hl.type === "opponent_run") {
                                    badgeColor = "bg-blue-955/40 text-blue-400 border-blue-550/20";
                                    badgeIcon = "💥 DEFICIT";
                                  }

                                  return (
                                    <button
                                      key={k}
                                      type="button"
                                      onClick={() => {
                                        setTdmReplayTick(hl.tick);
                                        setTdmReplayIsPaused(true);
                                        setTdmLogs(p => [`🔍 Trajectory analyzed: Jumped to Tick ${hl.tick}.`, ...p]);
                                      }}
                                      className={`w-full p-1.5 rounded-lg border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                                        isExact 
                                          ? "bg-amber-955/15 border-amber-500 text-amber-200 shadow-xl ring-1 ring-amber-500/40"
                                          : isActive
                                            ? "bg-zinc-900/80 border-zinc-800 text-zinc-300"
                                            : "bg-[#09090b] hover:bg-zinc-905 border-zinc-950 text-zinc-650"
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 max-w-[80%] overflow-hidden">
                                        <span className={`px-1.5 rounded text-[6px] font-black border text-center whitespace-nowrap shrink-0 uppercase leading-none py-0.5 ${badgeColor}`}>
                                          {badgeIcon}
                                        </span>
                                        <span className="text-[8px] font-sans truncate tracking-tight">{hl.description}</span>
                                      </div>
                                      <div className="text-right flex items-center gap-1 shrink-0">
                                        <span className="text-[7px] text-zinc-500 uppercase font-black">TICK {hl.tick}</span>
                                        <span className="text-[8px] font-mono font-bold bg-[#141414] px-1 rounded text-zinc-400 tracking-tighter leading-none border border-zinc-900 py-0.5">
                                          {hl.score}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          
                        </div>
                      )}
                    </div>
                  )}

                  {/* Combat Terminal Outputs */}
                  <div className="bg-[#080808]/90 rounded-xl border border-zinc-900 p-4 h-32 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-1.5 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] text-red-500 tracking-widest uppercase font-black flex items-center gap-1 text-left">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                          LIVE FIELD MATCH FEED
                        </span>

                        <button
                          type="button"
                          onClick={handleStartTacticalReplay}
                          disabled={tdmSimulatorActive || isTdmReplaying}
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all border duration-150 cursor-pointer ${
                            tdmSimulatorActive
                              ? "bg-zinc-950 text-zinc-600 border-zinc-950/40 cursor-not-allowed"
                              : isTdmReplaying
                                ? "bg-red-950/40 text-red-400 border-red-500/20"
                                : "bg-red-950/20 hover:bg-[#ff001c] hover:text-white text-red-400 border-red-500/10"
                          }`}
                        >
                          <Tv size={8} />
                          <span>TACTICAL REPLAY</span>
                        </button>
                      </div>
                      
                      <span className="text-[8px] text-gray-500">
                        {isTdmReplaying ? "📽️ PLAYBACK CONTROL" : "REALTIME DISPATCH"}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto font-mono text-[9px] space-y-1 text-left text-zinc-300 pr-1 select-none no-scrollbar">
                      {tdmLogs.map((log, index) => (
                        <div key={index} className={`flex items-start gap-1 p-1 rounded hover:bg-neutral-900/60 transition-colors duration-150 ${index === 0 ? "text-white font-bold bg-gradient-to-r from-red-950/20 to-transparent border-l border-red-500" : ""}`}>
                          <span className="text-zinc-600 shrink-0 select-none">▶</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* RULES BANNER - REQUIRED SPECS */}
              <div className="relative z-10 mx-4 p-4 rounded-xl border border-red-500/20 bg-red-950/20 text-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-red-400 uppercase block">🛡️ TDM STANDARD RULES & SCORING REGISTRY</span>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    1. **WIN**: Gained +50 Points on validation audit. | 2. **LOSS**: Deduction of -30 Points applied on audit confirmation. | 3. **DRAW**: Awards +0 Points (No change). | 4. **POINT AUDITS**: Mandatory cryptographic signature required under verification portal.
                  </p>
                </div>
                <div className="shrink-0 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black border border-zinc-900 bg-black p-2 rounded">
                  LEDGER STATS: <span className="text-[#ff001c]">SECURED LIVE</span>
                </div>
              </div>

              {/* STRATEGY BLUEPRINT WORKBOARD */}
              <div className="relative z-10 px-4">
                <TdmStrategyBlueprint 
                  onAddLog={(log) => setTdmLogs(prev => [log, ...prev.slice(0, 19)])}
                  userIgn={session.ign}
                />
              </div>

              {/* MIDDLE SECTION: INTERACTIVE CHAMPIONSHIP BRACKET WITH DYNAMIC GROUP DEFINER */}
              <div className="relative z-10 p-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 1. Register and Randomizer Console */}
                <div className="xl:col-span-1 bg-black/95 border border-zinc-900 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-[#ff001c] shrink-0" />
                      <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">BRACKET MANAGER</h4>
                    </div>
                    <span className="text-[8px] font-mono bg-red-950/40 text-red-500 px-2 py-0.5 rounded border border-red-500/20 uppercase font-black">
                      AUTO GROUP
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Enter competitive players below. Active division groups automatically recalculate based on total player load. Use the dynamic shuffler to organize completely randomized matchups!
                  </p>

                  <div className="space-y-3 font-sans pt-1">
                    <div>
                      <label className="text-[9px] font-mono text-zinc-500 block uppercase mb-1 font-bold">REGISTER COMPETITOR PLAYER</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. CV_Lethal_Pride"
                          value={newTourneyPlayerName}
                          onChange={(e) => setNewTourneyPlayerName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRegisterTdmTourneyPlayer(newTourneyPlayerName);
                          }}
                          className="flex-1 bg-[#0a0a0a] border border-zinc-900 text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-[#ff001f] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRegisterTdmTourneyPlayer(newTourneyPlayerName)}
                          className="bg-red-600 hover:bg-red-800 text-white rounded px-3.5 text-xs font-black uppercase font-mono cursor-pointer transition flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-900 text-xs mt-1">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">TOTAL REGISTRANTS:</span>
                      <strong className="text-red-500 font-mono text-xs">{tdmTourneyPlayers.length} Competitors</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-wider font-mono">
                      <button
                        type="button"
                        onClick={handleRandomizeTdmMatchups}
                        className="py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-zinc-900 text-red-500 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <RefreshCw size={11} className="animate-spin-slow text-red-500 shrink-0" />
                        <span>🎲 RANDOMIZER</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleResetTdmTourney}
                        className="py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-zinc-900 text-zinc-400 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>

                    <div className="pt-1.5">
                      <button
                        type="button"
                        disabled={isTourneySimulating}
                        onClick={() => simulateEntireTournament(tdmTourneyPlayers)}
                        className={`w-full py-2.5 text-white font-black text-[10px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition ${
                          isTourneySimulating
                            ? "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed"
                            : "bg-[#ff001c] hover:bg-[#b90014] shadow-[#ff001c]/10"
                        }`}
                      >
                        {isTourneySimulating ? (
                          <RefreshCw size={12} className="text-red-550 animate-spin shrink-0" />
                        ) : (
                          <Zap size={12} className="text-yellow-400 shrink-0" />
                        )}
                        <span>{isTourneySimulating ? "SIMULATING BRACKETS..." : "EXECUTE BRACKET SIMULATION"}</span>
                      </button>
                    </div>

                    {tdmTourneyWinner && (
                      <div className="p-3 bg-gradient-to-r from-yellow-600/10 to-transparent border border-yellow-500/30 rounded-lg text-center mt-3 animate-pulse">
                        <span className="text-[8px] font-mono text-yellow-500 block font-black uppercase tracking-widest">🏆 TDM TOURNAMENT CHAMPION</span>
                        <strong className="text-yellow-400 font-orbitron text-sm uppercase block mt-1">{tdmTourneyWinner}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Dynamic Group Partitions Box */}
                <div className="xl:col-span-2 bg-black/95 border border-zinc-900 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#ff001c]" />
                      <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">
                        DYNAMIC GROUPS DIVISION LAYOUT
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider">
                      GROUPS COUNT: {getDynamicGroups(tdmTourneyPlayers).length}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-mono text-left">
                    *Groups partition dynamically based on player count. 1 Group for 2-4 players, 2 Groups for 5-8 players, 4 Groups for 9+ players.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getDynamicGroups(tdmTourneyPlayers).map((group, gIdx) => (
                      <div key={gIdx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                          <span className="text-[10px] text-red-400 font-black font-mono tracking-wider uppercase">
                            🛡️ {group.name}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 font-bold">{group.members.length} COMBATANTS</span>
                        </div>
                        
                        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                          {group.members.map((member, mIdx) => (
                            <div key={mIdx} className="p-2 rounded bg-black flex items-center justify-between text-xs hover:border-zinc-805 border border-transparent transition-all">
                              <span className="font-mono text-stone-200 truncate pr-2">{mIdx + 1}. {member}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[8px] bg-red-955/40 text-red-400 border border-red-550/20 px-1.5 py-0.5 rounded font-mono uppercase font-black">
                                  REGISTRANT
                                </span>
                                <button
                                  onClick={() => setTdmTourneyPlayers(prev => prev.filter(p => p !== member))}
                                  className="text-[10px] text-zinc-600 hover:text-red-500 cursor-pointer"
                                  type="button"
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual bracket connectors simulation logic */}
                  <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 mt-4">
                    <span className="text-[9px] font-mono text-zinc-500 block mb-2 uppercase font-bold text-center">🎯 ACTIVE MATCHUPS BRACKET FORECAST</span>
                    <div className="flex justify-between items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <div className="flex-1 bg-black p-2 rounded text-center border border-zinc-900 font-extrabold truncate text-red-500">
                        {tdmTourneyPlayers[0] || "TBD Matchup 1"} vs {tdmTourneyPlayers[1] || "TBD Matchup 2"}
                      </div>
                      <span className="text-zinc-600">➔</span>
                      <div className="flex-1 bg-black p-2 rounded text-center border border-zinc-900 font-extrabold truncate text-blue-400">
                        {tdmTourneyPlayers[2] || "TBD Matchup 3"} vs {tdmTourneyPlayers[3] || "TBD Matchup 4"}
                      </div>
                      <span className="text-zinc-600">➔</span>
                      <div className="flex-1 bg-black p-2 rounded text-center border border-yellow-500/20 text-yellow-500 truncate font-black uppercase">
                        {tdmTourneyWinner || "GRAND FINAL"}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION: RANKING LADDER, LEADERBOARDS & POINTS VERIFICATION LEDGER */}
              <div className="relative z-10 p-4 grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* 1. Leaderboard & Challenge Ladder */}
                <div className="bg-black/95 border border-zinc-900 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-amber-500" />
                      <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">
                        TDM DUELS CHALLENGE LADDER
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono font-black text-red-500 animate-pulse">
                      ⚡ LIVE LOBBIES ACTIVE
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[440px] overflow-y-auto no-scrollbar">
                    {tdmLadder.map((p) => {
                      const isSelf = p.ign.includes("You");
                      const playerDetails = rosterPlayers.find(pl => pl.ign === p.ign) || {
                        ign: p.ign,
                        name: p.ign.includes("You") ? session.ign : "Classified Gladiator",
                        role: p.ign.includes("You") ? session.role : "Esports TDM Specialist",
                        avatar: p.ign.includes("You") ? "🛡️" : "🔫",
                        kd: p.ign.includes("You") ? "4.20" : (4.5 - (p.rank * 0.4)).toFixed(2),
                        tier: p.tier,
                        achievements: p.ign.includes("You") ? ["Platform Challenger", "TDM Star Combatant"] : ["Elite Gunfighter Medal", "Custom Duels Champion"]
                      };
                      return (
                        <div 
                          key={p.rank} 
                          onClick={() => setSelectedDossierPlayer(playerDetails)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition duration-150 cursor-pointer ${
                            isSelf 
                              ? "bg-gradient-to-r from-red-955/20 via-black to-black border-red-550/40 shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:border-red-550/60" 
                              : "bg-zinc-955/80 hover:bg-zinc-900 border-zinc-900 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-stone-500 text-xs w-4">#{p.rank}</span>
                            <div>
                              <p className={`font-mono text-xs font-bold ${isSelf ? "text-red-400 font-black" : "text-white"}`}>{p.ign}</p>
                              <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 pt-0.5">
                                <span className="bg-zinc-900 tracking-wider text-stone-300 font-bold uppercase px-1 rounded text-[8px]">
                                  {p.tier}
                                </span>
                                <span>W: {p.wins} | L: {p.losses} | D: {p.draws}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[11px] font-mono font-bold text-red-400 block">{p.points} PTS</span>
                              <span className="text-[8px] text-zinc-500 font-mono block">RATING</span>
                            </div>

                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => handleChallengePlayer(p.ign)}
                                className="px-3 py-1.5 bg-[#ff001c]/10 text-[#ff001c] hover:bg-[#ff001c] hover:text-white border border-[#ff001c]/30 rounded font-orbitron font-black text-[9px] tracking-wider uppercase transition cursor-pointer"
                              >
                                CHALLENGE
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Admin Point Verification Queue / Audit Feed & Self Report */}
                <div className="space-y-6">
                  {/* PLAYER SELF-REPORT VERIFICATION PORTAL DESK */}
                  <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-black border border-red-500/20 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                      <Lock size={14} className="text-red-500 animate-pulse" />
                      <h4 className="text-[11px] font-black font-orbitron tracking-widest text-white uppercase">
                        CRYPTOGRAPHIC DUEL SELF-REPORT PORTAL
                      </h4>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                      Submit manual TDM duels to the point verification ledger. Valid submissions automatically compute secure hashes matching standard point rules.
                    </p>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSelfReportMatch();
                      }}
                      className="grid grid-cols-2 gap-3 text-xs"
                    >
                      <div className="col-span-2">
                        <label className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">SELECT OPPONENT</label>
                        <select 
                          value={selfReportOpponent} 
                          onChange={(e) => setSelfReportOpponent(e.target.value)} 
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs rounded text-white focus:outline-none focus:border-red-600"
                        >
                          {tdmLadder.filter(p => !p.ign.includes("You")).map(p => (
                            <option key={p.ign} value={p.ign}>{p.ign} ({p.tier})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">YOUR RESULT</label>
                        <select 
                          value={selfReportResult} 
                          onChange={(e) => setSelfReportResult(e.target.value)} 
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs rounded text-white focus:outline-none focus:border-red-650"
                        >
                          <option value="Win">🏆 WIN (+50 PTS)</option>
                          <option value="Loss">💀 LOSS (-30 PTS)</option>
                          <option value="Draw">🤝 DRAW (+0 PTS)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">WEAPON LOADOUT</label>
                        <select 
                          value={selfReportWeapon} 
                          onChange={(e) => setSelfReportWeapon(e.target.value)} 
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs rounded text-white focus:outline-none focus:border-red-650"
                        >
                          <option value="M416 + M24">M416 + M24</option>
                          <option value="Groza + UMP45">Groza + UMP45</option>
                          <option value="AWM sniper">AWM sniper</option>
                          <option value="M16A4 Burst">M16A4 Burst</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">YOUR KILLS</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="40" 
                          value={selfReportYourScore} 
                          onChange={(e) => setSelfReportYourScore(parseInt(e.target.value) || 0)} 
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs rounded text-white focus:outline-none focus:border-red-650"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-zinc-500 font-mono uppercase mb-1">OPPONENT KILLS</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="40" 
                          value={selfReportOpponentScore} 
                          onChange={(e) => setSelfReportOpponentScore(parseInt(e.target.value) || 0)} 
                          className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs rounded text-white focus:outline-none focus:border-red-650"
                        />
                      </div>

                      <div className="col-span-2 pt-1">
                        <button 
                          type="submit" 
                          className="w-full py-2 bg-[#ff001c] hover:bg-[#ff001c]/85 text-white rounded font-mono font-black text-[9px] tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          🔑 GENERATE SECURE SIGNATURE & LOG DUEL
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* POINTS VERIFICATION AUDIT MATRIX UNIT */}
                  <div className="bg-black/95 border border-zinc-900 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-[#ff001c]" />
                      <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">
                        POINTS VERIFICATION AUDIT MATRIX
                      </h4>
                    </div>
                    <span className="text-[8px] font-mono bg-emerald-950/20 text-emerald-500 px-2.5 py-0.5 rounded uppercase font-black">
                      AUDIT STREAM ENABLED
                    </span>
                  </div>

                  {/* AUTO-REFRESH CONTROLLER */}
                  <div className="p-3 bg-zinc-950 border border-zinc-900/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between font-mono text-[9px]">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${autoRefreshEnabled ? (isSyncing ? "bg-amber-500 animate-spin" : "bg-emerald-500 animate-pulse") : "bg-zinc-600"}`} />
                        <span className="text-zinc-400 uppercase font-extrabold tracking-wider">LIVE TELEMETRY:</span>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          id="tdm-auto-refresh-toggle"
                          checked={autoRefreshEnabled} 
                          onChange={(e) => {
                            setAutoRefreshEnabled(e.target.checked);
                            if (e.target.checked) {
                              setAutoRefreshCountdown(30);
                            }
                            setSystemAlertMessage(e.target.checked 
                              ? "🔄 Auto-Refresh activated! Competitive matrix and queues sync every 30 seconds." 
                              : "💡 Switched to manual state rendering."
                            );
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-8 h-4 bg-zinc-850 rounded-full peer peer-checked:bg-[#ff001c] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:after:bg-white"></div>
                        <span className="ml-1.5 text-[9px] text-zinc-300 font-bold uppercase cursor-pointer">
                          {autoRefreshEnabled ? "ACTIVE" : "PAUSED"}
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono pt-1 text-zinc-500">
                      <span>NEXT UPDATE: {autoRefreshEnabled ? <span className="text-[#ff001c] font-black">{autoRefreshCountdown}s</span> : "PAUSED"}</span>
                      {autoRefreshEnabled && (
                        <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-650 transition-all duration-1000 ease-linear" 
                            style={{ width: `${(autoRefreshCountdown / 30) * 100}%` }}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setScoreCycle(sc => sc + 1);
                          // Also append a verified log right away
                          const poolChallengers = ["CV_Slayer_IGL", "CV_Mamba_Flick", "ViperShoot_PRO", "Apex_Ghost_IGL", "Hydra_Avenger_1"];
                          const poolOpponents = ["ZIM_Ghost_07", "Viper_Alpha_01", "CV_Lethal_Pride", "ZIM_Warrior_X"];
                          const poolResults = ["Win", "Loss", "Draw"];
                          const randChallenger = poolChallengers[Math.floor(Math.random() * poolChallengers.length)];
                          const randOpponent = poolOpponents[Math.floor(Math.random() * poolOpponents.length)];
                          const randResult = poolResults[Math.floor(Math.random() * poolResults.length)];
                          const ptDelta = randResult === "Win" ? 50 : randResult === "Loss" ? -30 : 0;
                          const randomProofId = `PROOF-TDM-${Math.floor(1000 + Math.random() * 9000)}-MANUAL`;
                          const newItem = {
                            id: `vr-auto-manual-${Date.now()}`,
                            challenger: randChallenger,
                            opponent: randOpponent,
                            pointsDelta: ptDelta,
                            result: randResult,
                            proof: randomProofId,
                            date: "Just now",
                            status: "Pending"
                          };
                          setTdmVerificationQueue(prev => [newItem, ...prev.slice(0, 9)]);
                          setSystemAlertMessage("🔄 Simulated an active verified log query on live mainframe!");
                        }}
                        className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded cursor-pointer transition-colors"
                      >
                        FORCE PULL
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    Verify submitted match results proof codes before approving any manual points. Click check (✔) to credit points to general ledger accounts. Or reject (✖) to flag illegitimate requests.
                  </p>

                  <div className="space-y-2.5 max-h-[440px] overflow-y-auto no-scrollbar">
                    {tdmVerificationQueue.length === 0 ? (
                      <div className="text-center p-8 text-zinc-650 font-mono text-xs">
                        No pending match verification logs found in queue.
                      </div>
                    ) : (
                      tdmVerificationQueue.map((item) => {
                        const isVerified = item.status === "Verified";
                        const isRejected = item.status === "Rejected";
                        const isPending = item.status === "Pending";

                        return (
                          <div 
                            key={item.id} 
                            className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                              isVerified 
                                ? "bg-emerald-950/10 border-emerald-900/30" 
                                : isRejected 
                                  ? "bg-red-955/10 border-red-900/30" 
                                  : "bg-[#0c0c0c] border-zinc-900"
                            }`}
                          >
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                                  item.result === "Win" 
                                    ? "bg-emerald-500/10 text-emerald-400" 
                                    : item.result === "Loss" 
                                      ? "bg-red-500/10 text-red-400" 
                                      : "bg-zinc-500/10 text-zinc-400"
                                }`}>
                                  {item.result} Output
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500">{item.date}</span>
                              </div>
                              <p className="font-mono text-[11px] text-stone-200">
                                <span className="text-red-400 font-bold">{item.challenger}</span> vs <span className="text-blue-400 font-bold">{item.opponent}</span>
                              </p>
                              <div className="text-[9px] font-mono text-zinc-500">
                                Signature Hash: <code className="text-zinc-300 font-bold">{item.proof}</code>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-center">
                              <span className={`font-mono text-[11px] font-extrabold rounded-md px-1.5 py-0.5 text-center ${
                                item.pointsDelta > 0 
                                  ? "text-emerald-500 bg-emerald-950/10" 
                                  : item.pointsDelta < 0 
                                    ? "text-red-500 bg-red-955/10" 
                                    : "text-zinc-500 bg-zinc-900"
                              }`}>
                                {item.pointsDelta > 0 ? `+${item.pointsDelta}` : item.pointsDelta} PTS
                              </span>

                              {isPending ? (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleVerifyMatchPoints(item.id, "Approve")}
                                    className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer transition text-[10px] font-extrabold"
                                    title="Verify & Credit points"
                                    type="button"
                                  >
                                    ✔ APPROVED
                                  </button>
                                  <button
                                    onClick={() => handleVerifyMatchPoints(item.id, "Reject")}
                                    className="p-1 px-2 bg-red-650 hover:bg-red-800 text-white rounded cursor-pointer transition text-[10px] font-extrabold"
                                    title="Bin/Reject points"
                                    type="button"
                                  >
                                    ✖
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                                  isVerified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}>
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

            </div>

              {/* TDM Historical records */}
              <div className="relative z-10 p-5 bg-black/95 border border-zinc-900 rounded-2xl mx-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                  <h3 className="text-xs font-black text-white font-mono tracking-widest uppercase">🛡️ HISTORIC ARENA SESSIONS LOGS</h3>
                  <span className="text-[10px] text-gray-400 font-mono font-bold">TOTAL REGISTERED COMBATS: {tdmHistory.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
                  {tdmHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 text-xs bg-black/40 transition-colors duration-200 ${
                        item.result === "Victory" 
                          ? "border-emerald-500/15 hover:border-emerald-500/30" 
                          : "border-red-500/15 hover:border-red-500/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-zinc-500 text-[9px] font-mono font-bold uppercase">{item.date}</p>
                          <h4 className="font-extrabold text-white text-sm tracking-tight pt-0.5">{item.opponent}</h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded font-mono text-[9px] tracking-widest font-black uppercase ${
                          item.result === "Victory" 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {item.result}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-black/40 p-2 rounded border border-zinc-900 text-[10px] font-mono text-zinc-400">
                        <div>
                          <span className="text-[8px] text-zinc-500 block">FINAL SCORE</span>
                          <strong className="text-white font-bold">{item.score}</strong>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-500 block">LOADOUT CONF</span>
                          <span className="text-white truncate block">{item.weapon}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono border-t border-[#ff001c]/10 pt-2 text-zinc-550">
                        <span>DOMINANT PERFORMANCE MVP</span>
                        <strong className="text-red-500 font-black">{item.mvp}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6.7. TAB: WOW CREATOR */}
          {activeTab === "wow" && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-950/20 via-black to-[#0A0A0A] p-6 rounded-2xl border border-red-600/30">
                <SectionTitle text="WORLD OF WONDER MAP WORKSHOP" sub="Design, deploy, discover, and play custom-calibrated community maps" />
                <p className="text-xs text-gray-400 font-medium max-w-xl leading-relaxed mt-2">
                  Welcome to the world generator terminal. Input structural blueprints, specify landscape/biomes, configure player rules, and generate unique 9-digit map keys for the online catalog.
                </p>
              </div>

              {/* Work station grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Search and Blueprint Generator */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Search Map by Code key */}
                  <div className="bg-[#111111] p-5 rounded-2xl border border-zinc-800 space-y-3">
                    <h3 className="text-xs font-black text-white font-mono tracking-widest uppercase">SEARCH WORLD BY KEY</h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                      Enter a 9-digit WOW map activation key to check status or play.
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="E.g., 812-304-102"
                        value={searchWowCode}
                        onChange={(e) => setSearchWowCode(e.target.value)}
                        className="w-full bg-black border border-zinc-805 focus:border-[#FF001C] p-2.5 rounded font-mono text-xs text-white placeholder-zinc-700"
                      />
                      <button
                        onClick={() => {
                          if (!searchWowCode) return;
                          const formattedInput = searchWowCode.trim();
                          const matched = wowPublishedMaps.find(m => m.code === formattedInput || m.code.replace(/-/g, "") === formattedInput.replace(/-/g, ""));
                          if (matched) {
                            setSystemAlertMessage(`🎮 Found Map matches! Title: "${matched.title}" by ${matched.creator}`);
                          } else {
                            setSystemAlertMessage("❌ Map code not registered in WOW central cloud server databases.");
                          }
                        }}
                        className="absolute right-1.5 top-1.5 bg-[#FF001C] hover:bg-red-700 text-white font-bold text-[9px] uppercase px-3 py-1 rounded font-mono cursor-pointer transition-colors duration-200"
                      >
                        SEARCH
                      </button>
                    </div>
                  </div>

                  {/* Generate/Publish New Map */}
                  <div className="bg-[#111111] p-5 rounded-2xl border border-zinc-850 space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-zinc-800/60">
                      <Sparkles className="text-red-500 animate-pulse" size={16} />
                      <h3 className="text-xs font-black text-white font-mono tracking-widest uppercase">BLUEPRINT CREATOR</h3>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newWowName || !newWowDescription) {
                          setSystemAlertMessage("⚠️ Provide a map name and description to compile blueprints.");
                          return;
                        }
                        // Generate a unique 9 digit code randomly formatted: XXX-XXX-XXX
                        const part1 = Math.floor(Math.random() * 900) + 100;
                        const part2 = Math.floor(Math.random() * 900) + 100;
                        const part3 = Math.floor(Math.random() * 900) + 100;
                        const randomCode = `${part1}-${part2}-${part3}`;

                        const newMap = {
                          id: "wow-" + Date.now(),
                          code: randomCode,
                          title: newWowName,
                          creator: session.ign,
                          downloads: 1,
                          plays: 1,
                          rating: "100%",
                          biome: newWowBiome,
                          desc: newWowDescription,
                          mode: newWowMode,
                          maxPlayers: newWowMaxPlayers,
                          isArchived: false
                        };

                        setWowPublishedMaps(prev => [newMap, ...prev]);
                        setNewWowName("");
                        setNewWowDescription("");
                        setSystemAlertMessage(`🎉 Blueprint successfully compiled! Published as: [ ${randomCode} ]`);
                        awardXp(60);
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold mb-1">MAP OR ARENA TITLE</label>
                        <input
                          type="text"
                          value={newWowName}
                          onChange={(e) => setNewWowName(e.target.value)}
                          placeholder="e.g. Castle Snipers 2.0"
                          required
                          className="w-full bg-black border border-zinc-800 focus:border-[#FF001C] p-2 text-xs text-white placeholder-zinc-700 focus:outline-none rounded font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold mb-1">GAME MODE TYPE</label>
                          <select
                            value={newWowMode}
                            onChange={(e) => setNewWowMode(e.target.value)}
                            className="w-full bg-black border border-zinc-800 focus:border-[#FF001C] p-2 text-xs text-white focus:outline-none rounded font-mono"
                          >
                            <option value="Parkour Speedrun">Parkour Run</option>
                            <option value="1v1 M416 Arena">1v1 M416 Arena</option>
                            <option value="Sniper Ridgeline">Sniper Ridge</option>
                            <option value="Red vs Blue Deathmatch">Team Deathmatch</option>
                            <option value="Infection Survival">Infection</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold mb-1">LANDSCAPE BIOME</label>
                          <select
                            value={newWowBiome}
                            onChange={(e) => setNewWowBiome(e.target.value)}
                            className="w-full bg-black border border-zinc-800 focus:border-[#FF001C] p-2 text-xs text-white focus:outline-none rounded font-mono"
                          >
                            <option value="Erangel Grasslands">Erangel Grass</option>
                            <option value="Desert Miramar Canyons">Desert Miramar</option>
                            <option value="Sanhok Rainforests">Sanhok Rain</option>
                            <option value="Snowy Vikendi Peaks">Snowy Vikendi</option>
                            <option value="Industrial Arena">Industrial Zone</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold mb-1">MAX PLAYERS LIMIT ({newWowMaxPlayers})</label>
                        <input
                          type="range"
                          min={2}
                          max={32}
                          step={2}
                          value={newWowMaxPlayers}
                          onChange={(e) => setNewWowMaxPlayers(Number(e.target.value))}
                          className="w-full filter accent-[#FF001C]"
                        />
                      </div>

                      <div>
                        <label className="text-[8px] font-mono text-zinc-500 block uppercase font-bold mb-1">ARENA BRIEF DESCRIPTION</label>
                        <textarea
                          rows={3}
                          value={newWowDescription}
                          onChange={(e) => setNewWowDescription(e.target.value)}
                          placeholder="Provide details about platform layout, barriers, and optimal custom weapon configurations..."
                          required
                          className="w-full bg-black border border-zinc-800 focus:border-[#FF001C] p-2 text-xs text-white placeholder-zinc-700 focus:outline-none rounded resize-none font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-red-650 to-red-600 text-white font-extrabold text-[10px] uppercase font-mono tracking-widest rounded border border-red-500 text-center cursor-pointer hover:from-red-700 hover:to-red-650 transition-all duration-300"
                      >
                        PUBLISH BLUEPRINT TO CATALOG
                      </button>
                    </form>
                  </div>

                </div>

                {/* Published catalog items roster */}
                <div className="lg:col-span-2 bg-[#111111] p-5 rounded-2xl border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800/60 font-mono gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-black text-gray-400 tracking-widest uppercase">
                        📁 WOW BLUEPRINTS
                      </h3>
                      <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded border border-zinc-850">
                        <button
                          type="button"
                          onClick={() => setWowShowArchived(false)}
                          className={`px-2 py-0.5 text-[8.5px] uppercase font-extrabold rounded cursor-pointer transition-colors ${!wowShowArchived ? 'bg-[#FF001C] text-white font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          Active ({wowPublishedMaps.filter(m => !m.isArchived).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setWowShowArchived(true)}
                          className={`px-2 py-0.5 text-[8.5px] uppercase font-extrabold rounded cursor-pointer transition-colors ${wowShowArchived ? 'bg-amber-600 text-white font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                          Archived ({wowPublishedMaps.filter(m => m.isArchived).length})
                        </button>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#FF001F] font-bold">
                      {wowShowArchived ? "🗄️ OFFLINE STORAGE BLUEPRINTS" : "📡 LIVE ONLINE BLUEPRINTS"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[620px] overflow-y-auto no-scrollbar pr-1">
                    {wowPublishedMaps
                      .filter((m) => !!m.isArchived === wowShowArchived)
                      .map((map) => {
                        const isCreator = map.creator === session.ign || session.role === "Owner";
                        return (
                          <div key={map.id} className="bg-black/50 p-4 rounded-xl border border-zinc-900 hover:border-red-500/30 flex flex-col justify-between gap-4 transition-all duration-200 relative group overflow-hidden">
                            
                            {/* Accent border banner */}
                            <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors ${map.isArchived ? 'bg-amber-600 group-hover:bg-amber-500' : 'bg-red-600 group-hover:bg-red-500'}`} />

                            <div className="space-y-3">
                              {/* Map Preview Image Thumbnail */}
                              <div className="relative w-full h-[140px] rounded-lg overflow-hidden border border-zinc-850 bg-zinc-950 group/thumb">
                                {/* Unsplash Game Atmosphere Thumbnail Dynamic Resolution */}
                                <img
                                  src={
                                    (map.biome || "").toLowerCase().includes("erangel") || (map.biome || "").toLowerCase().includes("grass") 
                                      ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=480"
                                      : (map.biome || "").toLowerCase().includes("desert") || (map.biome || "").toLowerCase().includes("miramar") || (map.biome || "").toLowerCase().includes("ruin")
                                      ? "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=480"
                                      : (map.biome || "").toLowerCase().includes("sanhok") || (map.biome || "").toLowerCase().includes("rain") || (map.biome || "").toLowerCase().includes("jungle")
                                      ? "https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&q=80&w=480"
                                      : (map.biome || "").toLowerCase().includes("snow") || (map.biome || "").toLowerCase().includes("vikendi") || (map.biome || "").toLowerCase().includes("peak") || (map.biome || "").toLowerCase().includes("ice")
                                      ? "https://images.unsplash.com/photo-1482867996988-2faec3cbb4f9?auto=format&fit=crop&q=80&w=480"
                                      : "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=480"
                                  }
                                  alt={map.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover opacity-60 group-hover/thumb:scale-105 transition-transform duration-700 pointer-events-none"
                                />
                                
                                {/* Modern Tactical HUD Wireframe / Laser Grid overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,28,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,28,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

                                {/* Outer Corner Reticle brackets */}
                                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#FF001C]/60" />
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#FF001C]/60" />
                                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#FF001C]/60" />
                                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#FF001C]/60" />

                                {/* Animated scanner laser sweeps */}
                                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF001C]/80 to-transparent shadow-[0_0_8px_#FF001C] pointer-events-none animate-bounce" style={{ top: "35%", animationDuration: "3s" }} />

                                {/* Center targeting reticle */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 group-hover/thumb:opacity-45 transition-opacity">
                                  <div className="w-10 h-10 rounded-full border border-dashed border-[#FF001C] flex items-center justify-center animate-[spin_20s_linear_infinite]">
                                    <div className="w-6 h-6 rounded-full border border-dotted border-[#FF001C]" />
                                  </div>
                                </div>

                                {/* Badge and Metadata Labels overlay */}
                                <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                                  <span className="text-[7.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5 bg-black/90 border border-zinc-805 text-zinc-300 rounded uppercase">
                                    {map.mode || "TACTICAL ARENA"}
                                  </span>
                                  <span className="text-[7.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5 bg-[#FF001C]/90 text-white rounded">
                                    LIMIT: {map.maxPlayers || 16}P
                                  </span>
                                  {isCreator && (
                                    <span className="text-[7.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded uppercase flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                      CREATOR
                                    </span>
                                  )}
                                </div>

                                <span className="absolute top-2 right-2 text-[7.5px] font-mono tracking-wider font-extrabold px-1.5 py-0.5 bg-zinc-950/95 border border-zinc-900 rounded text-amber-500 uppercase">
                                  {(map.biome || "ARENA").split(" ")[0]}
                                </span>
                              </div>

                              <div className="flex justify-between items-start gap-1">
                                <div>
                                  <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[#FF001F] font-bold tracking-widest">
                                    CODE: {map.code}
                                  </span>
                                  <h4 className="text-sm font-black text-white italic tracking-tight pt-1.5 uppercase leading-tight">
                                    {map.title}
                                  </h4>
                                </div>
                                <span className="text-[9px] text-zinc-500 font-mono text-right font-bold uppercase shrink-0">
                                  BY: {map.creator}
                                </span>
                              </div>

                              <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-1">
                                {map.desc}
                              </p>
                            </div>

                            {/* Stats indicator bar */}
                            <div className="grid grid-cols-3 gap-2 bg-black/80 border border-zinc-850 p-2.5 rounded text-[9px] font-mono text-zinc-400">
                              <div>
                                <span className="text-[8px] text-gray-500 block">BIOME</span>
                                <span className="text-zinc-200 truncate block font-bold">{map.biome}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-gray-500 block">RATING</span>
                                <span className="text-[#FF001F] font-bold">♥ {map.rating}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-gray-500 block">TOTAL PLAYS</span>
                                <span className="text-zinc-200 font-bold">{map.plays.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Interactive upvote, download/load and play triggers */}
                            <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-zinc-900">
                              {!map.isArchived ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Dynamically increment downloads & plays list count
                                    setWowPublishedMaps(prev => prev.map(m => {
                                      if (m.id === map.id) {
                                        return { ...m, plays: m.plays + 1205, downloads: m.downloads + 432, rating: "98%" };
                                      }
                                      return m;
                                    }));
                                    setSystemAlertMessage(`🎮 Compiled blueprints of [${map.title}] successfully! Launching map workshop playground...`);
                                  }}
                                  className="bg-[#FF001C] hover:bg-red-700 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded font-mono cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  <Play size={10} />
                                  PLAY MAP
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Restore blueprint from archive
                                    setWowPublishedMaps(prev => prev.map(m => {
                                      if (m.id === map.id) {
                                        return { ...m, isArchived: false };
                                      }
                                      return m;
                                    }));
                                    setSystemAlertMessage(`✅ Blueprint [${map.title}] has been successfully restored to the public active registry.`);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded font-mono cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  <RefreshCw size={10} />
                                  RESTORE ACTIVE
                                </button>
                              )}

                              <div className="flex items-center gap-2">
                                {!map.isArchived ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSystemAlertMessage(`👍 Voted Upvote for Map ID: ${map.code}! Community rating synced.`);
                                      setWowPublishedMaps(prev => prev.map(m => {
                                        if (m.id === map.id) {
                                          return { ...m, rating: "99%" };
                                        }
                                        return m;
                                      }));
                                    }}
                                    className="text-stone-400 hover:text-white transition-colors duration-150 text-[9px] font-mono flex items-center gap-0.5 cursor-pointer"
                                    title="Upvote map blueprint"
                                  >
                                    👍 UPVOTE
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-amber-500 font-mono font-bold uppercase italic">
                                    🗄️ ARCHIVED
                                  </span>
                                )}

                                {/* Creator deletion & archive tools */}
                                {isCreator && (
                                  <div className="flex items-center gap-1 pl-1 border-l border-zinc-800">
                                    {!map.isArchived ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setWowMapToManage(map);
                                          setWowManageAction("archive");
                                          setWowConfirmChecked(false);
                                        }}
                                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-amber-500 hover:border-amber-500/50 transition-all cursor-pointer"
                                        title="Archive Map Blueprint"
                                      >
                                        <Archive size={11} />
                                      </button>
                                    ) : null}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWowMapToManage(map);
                                        setWowManageAction("delete");
                                        setWowConfirmChecked(false);
                                      }}
                                      className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-red-500 hover:border-red-500/50 transition-all cursor-pointer"
                                      title="Permanently Delete Map Blueprint"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                  </div>
                  </div>
                </div>

              </div>
          )}

          {/* 8. TAB: RECRUITMENT Form SUBMISSION */}
          {activeTab === "recruitment" && (
            <div className="space-y-6 animate-fade-in text-left">
              {recruitmentSuccess ? (
                <div className="bg-[#101010] p-8 max-w-xl mx-auto rounded-2xl border border-red-950 text-center space-y-4 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
                  <Trophy size={42} className="text-[#E10600] mx-auto animate-bounce" />
                  <h3 className="text-xl font-black text-white uppercase italic">APPLICATION LODGED!</h3>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto font-medium">
                    Your competitive career portfolio has been compiled and secured on the private database. The Team Lead or Owner will review your statistics under the **Owner Cmd Center** panel tab!
                  </p>
                  <button
                    onClick={() => setRecruitmentSuccess(false)}
                    className="px-5 py-2.5 bg-[#E10600] text-white hover:bg-[#b00500] rounded text-xs font-mono tracking-widest uppercase cursor-pointer animate-pulse"
                  >
                    SUBMIT AN ADDITIONAL APPLICATION Form
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1700px] mx-auto items-stretch">
                  
                  {/* Left Column matching mockup: WHAT WE LOOK FOR & PROCESS */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pt-2 text-left">
                    <div className="space-y-6">
                      <h2 className="text-3xl lg:text-4xl font-black tracking-widest text-[#ff001f] uppercase leading-none font-orbitron">
                        WHAT WE LOOK FOR
                      </h2>
                      
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-xs text-zinc-300 font-medium leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 bg-[#ff001f] shrink-0" />
                          <span>Top 1% rank or proven tournament record</span>
                        </li>
                        <li className="flex items-center gap-3 text-xs text-zinc-300 font-medium leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 bg-[#ff001f] shrink-0" />
                          <span>16+ hours/week availability</span>
                        </li>
                        <li className="flex items-center gap-3 text-xs text-zinc-300 font-medium leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 bg-[#ff001f] shrink-0" />
                          <span>Voice comms & teamwork mindset</span>
                        </li>
                        <li className="flex items-center gap-3 text-xs text-zinc-300 font-medium leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 bg-[#ff001f] shrink-0" />
                          <span>Streaming/social presence is a plus</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-black/20 border border-red-950/40 p-6 rounded-2xl text-left w-full">
                      <h3 className="text-lg font-black tracking-widest text-[#ff001f] uppercase mb-4 font-orbitron">
                        PROCESS
                      </h3>
                      <ol className="space-y-3 font-orbitron text-xs text-zinc-300">
                        <li className="flex gap-2 items-center">
                          <span className="text-[#ff001f] font-black">01.</span>
                          <span className="font-sans text-zinc-400">Submit application</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <span className="text-[#ff001f] font-black">02.</span>
                          <span className="font-sans text-zinc-400">Scrim trial with current roster</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <span className="text-[#ff001f] font-black">03.</span>
                          <span className="font-sans text-zinc-400">Final interview with coach</span>
                        </li>
                        <li className="flex gap-2 items-center">
                          <span className="text-[#ff001f] font-black">04.</span>
                          <span className="font-sans text-zinc-400">Welcome to Fear 4Fangz.</span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Right Column matching mockup: Elegant clean dark form */}
                  <div className="lg:col-span-12 xl:col-span-7 bg-[#0b0b0d]/90 border border-zinc-900 p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <form onSubmit={handleRecruitSubmit} className="space-y-5 text-left">
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">IN-GAME NAME (IGN)</label>
                        <input
                          type="text"
                          required
                          value={applyIgn}
                          onChange={(e) => setApplyIgn(e.target.value)}
                          placeholder="e.g. VOID"
                          className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none font-mono transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">TARGET OFFICIAL ROLE / TITLE</label>
                        <select
                          required
                          value={applyRole}
                          onChange={(e) => setApplyRole(e.target.value)}
                          className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] rounded p-3 text-xs text-white focus:outline-none font-sans transition-colors cursor-pointer"
                        >
                          <option value="CV Elite Main Squad Member">CV Elite Main Squad Member</option>
                          <option value="CV Official Streamer">CV Official Streamer</option>
                          <option value="CV Content Creator">CV Content Creator</option>
                          <option value="CV Team Coach">CV Team Coach</option>
                          <option value="CV Team Analyst">CV Team Analyst</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">CURRENT RANK</label>
                          <input
                            type="text"
                            required
                            value={applyRank}
                            onChange={(e) => setApplyRank(e.target.value)}
                            placeholder="Diamond / Elite / ..."
                            className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none font-sans transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">DEVICE</label>
                          <input
                            type="text"
                            required
                            value={applyDevice}
                            onChange={(e) => setApplyDevice(e.target.value)}
                            placeholder="PC / Console / Mobile"
                            className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none font-sans transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">EXPERIENCE</label>
                        <textarea
                          required
                          rows={4}
                          value={applyExp}
                          onChange={(e) => setApplyExp(e.target.value)}
                          placeholder="Years competing, past teams, tournaments..."
                          className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none resize-none transition-colors leading-relaxed font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">AVAILABILITY</label>
                          <input
                            type="text"
                            required
                            value={applyAvail}
                            onChange={(e) => setApplyAvail(e.target.value)}
                            placeholder="Hours/week, timezone"
                            className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none font-sans transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">CONTACT (DISCORD/EMAIL)</label>
                          <input
                            type="text"
                            required
                            value={applyContact}
                            onChange={(e) => setApplyContact(e.target.value)}
                            placeholder="discord#1234 or email"
                            className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none font-sans transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold">ANYTHING ELSE? (OPTIONAL)</label>
                        <textarea
                          rows={3}
                          value={applyOptional}
                          onChange={(e) => setApplyOptional(e.target.value)}
                          placeholder="Tell us more..."
                          className="w-full bg-[#000000] border border-zinc-900 focus:border-[#ff001f] focus:ring-1 focus:ring-[#ff001f]/50 rounded p-3 text-xs text-white placeholder-zinc-700 focus:outline-none resize-none transition-colors font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-[#ff001f] text-white font-black text-xs uppercase tracking-widest rounded hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer mt-4 shadow-[0_0_15px_rgba(255,0,31,0.3)] hover:shadow-[0_0_25px_rgba(255,0,31,0.5)] leading-none border border-[#ff001f] flex items-center justify-center gap-2"
                      >
                        <UserCheck size={14} />
                        <span>SUBMIT ENLISTMENT APPLICATION</span>
                      </button>
                    </form>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* 9. PRIVATE TAB: TEAM HUB INTRANET FEED */}
          {activeTab === "feed" && (
            <div className="space-y-6">
              <div className="bg-[#111111] p-5 rounded-2xl border border-gray-800 space-y-4">
                <SectionTitle text="🔐 INTRANET FEED BULLETIN BOARD" sub="Private social board for roster updates and match logs" />

                {/* Create dynamic feed post form */}
                <form onSubmit={handleCreatePost} className="bg-black/40 p-4 rounded-xl border border-gray-850 text-xs flex gap-3 items-start">
                  <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-sm select-none">
                    IGL
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder="Share rotation summaries, custom layout tweaks, and battle screenshots..."
                      required
                      className="w-full bg-[#1A1A1A] border border-gray-800 focus:border-red-600 rounded p-2.5 text-xs text-white focus:outline-none"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 italic">Posting securely as simulated persona: **{session.ign}**</span>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold rounded cursor-pointer"
                      >
                        Publish Post Bulletin
                      </button>
                    </div>
                  </div>
                </form>

                {/* Posts mapped list */}
                <div id="feedPosts" className="space-y-4 pt-3">
                  {/* Tactical Feed Header with Sorting Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0c0c0c] border border-gray-800/80 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ListFilter size={14} className="text-red-500 animate-pulse" />
                      <div>
                        <span className="text-[10px] font-black font-mono text-white uppercase tracking-widest block">
                          ROSTER INTELLIGENCE STREAM ({feedPosts.length} bulletins)
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">
                          Secure Decrypted Satcom Channels Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                        Sort bulletins:
                      </span>
                      <div className="relative">
                        <select
                          id="feed-sort-dropdown"
                          value={feedSortBy}
                          onChange={(e) => {
                            const newSort = e.target.value as "newest" | "popular" | "tier";
                            setFeedSortBy(newSort);
                            awardXp(5);
                            setSystemAlertMessage(`📊 Reordered tactical stream by ${newSort === "newest" ? "Newest First" : newSort === "popular" ? "Most Popular Upvotes" : "Highest Rank Tiers First"}.`);
                          }}
                          className="bg-[#151515] border border-gray-800 hover:border-red-500/50 text-white font-mono text-[10px] uppercase font-bold py-1.5 pl-2.5 pr-8 rounded-lg focus:outline-none focus:border-red-500 appearance-none cursor-pointer transition-colors"
                        >
                          <option value="newest">🕒 Newest First</option>
                          <option value="popular">🔥 Most Popular</option>
                          <option value="tier">👑 High Rank Tier First</option>
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-red-500">
                          <ChevronDown size={11} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter / Sort feed posts */}
                  {[...feedPosts]
                    .sort((a, b) => {
                      if (feedSortBy === "tier") {
                        const getTierWeight = (authorName: string, role: string) => {
                          const player = rosterPlayers.find(p => p.ign.toLowerCase() === authorName.toLowerCase());
                          if (player) {
                            const t = (player.tier || "").toUpperCase();
                            if (t.includes("GRANDMASTER")) return 4;
                            if (t.includes("MASTER")) return 3;
                            if (t.includes("DIAMOND")) return 2;
                            if (t.includes("PLATINUM")) return 1;
                            return 0;
                          }
                          const isCoach = COACHES_LIST.some(c => c.ign.toLowerCase() === authorName.toLowerCase());
                          const isOwnerOrAdmin = role === "Owner" || role === "Admin" || authorName.toLowerCase() === "cv_tactical_coach";
                          if (isOwnerOrAdmin) return 4;
                          if (isCoach) return 3;
                          return 2; // Default Diamond
                        };
                        const weightA = getTierWeight(a.author, a.role);
                        const weightB = getTierWeight(b.author, b.role);
                        if (weightB !== weightA) {
                          return weightB - weightA;
                        }
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                      } else if (feedSortBy === "popular") {
                        if (b.likes !== a.likes) {
                          return b.likes - a.likes;
                        }
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                      } else {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                      }
                    })
                    .map((post, index) => {
                      const matchingPlayerIdx = rosterPlayers.findIndex(
                        p => p.ign.toLowerCase() === post.author.toLowerCase()
                      );
                      const matchingPlayer = matchingPlayerIdx !== -1 ? rosterPlayers[matchingPlayerIdx] : null;

                      const isCoach = COACHES_LIST.some(c => c.ign.toLowerCase() === post.author.toLowerCase());
                      const isOwnerOrAdmin = post.role === "Owner" || post.role === "Admin" || post.author.toLowerCase() === "cv_tactical_coach";

                      const authorTier = matchingPlayer?.tier || (isOwnerOrAdmin ? "GRANDMASTER" : isCoach ? "MASTER" : "DIAMOND");
                      const authorRole = matchingPlayer?.role || post.role;
                      const authorAvatar = matchingPlayer?.avatar || (isCoach ? "👨‍🏫" : isOwnerOrAdmin ? "👑" : "👤");

                      const isVerifiedValue = matchingPlayer ? (matchingPlayer.isVerified !== false) : true;
                      const playerJoinDate = matchingPlayer?.joinDate || "Jan 01, 2024";

                      const isVerifiedRoster = 
                        post.role === "Team Captain" || 
                        post.role === "Owner" ||
                        post.role === "Admin" ||
                        post.role === "Squad Leader" ||
                        PLAYERS_LIST.some(p => p.ign.toLowerCase() === post.author.toLowerCase()) ||
                        matchingPlayerIdx !== -1 ||
                        isCoach;

                      const isTeamCaptain = 
                        authorRole === "Team Captain" || 
                        authorRole === "Squad Leader" || 
                        (authorRole || "").toLowerCase().includes("captain") || 
                        (authorRole || "").toLowerCase().includes("igl") || 
                        (authorRole || "").toLowerCase().includes("leader");

                      let indicatorText = "Verified Member";
                      let indicatorColor = "bg-zinc-800 text-zinc-400 border-zinc-700";
                      let indicatorIcon = <ShieldCheck size={10} />;
                      let indicatorGlow = "";

                      if (isVerifiedRoster) {
                        if (isTeamCaptain) {
                          indicatorText = "👑 CAPTAIN VERIFIED";
                          indicatorColor = "bg-red-950/70 text-[#ff001c] border-[#ff001c]/50 font-black";
                          indicatorIcon = <Crown size={10} className="text-[#ff001c] shrink-0 animate-bounce" />;
                          indicatorGlow = "shadow-[0_0_15px_rgba(255,0,28,0.4)]";
                        } else if (authorTier === "GRANDMASTER") {
                          indicatorText = "🏆 GM VERIFIED";
                          indicatorColor = "bg-amber-955/50 text-amber-500 border-amber-900/50 font-black";
                          indicatorIcon = <Award size={10} className="text-amber-500 shrink-0 animate-pulse" />;
                          indicatorGlow = "shadow-[0_0_12px_rgba(245,158,11,0.35)]";
                        } else if (authorTier === "MASTER") {
                          indicatorText = "🛡️ MASTER VERIFIED";
                          indicatorColor = "bg-purple-955/50 text-purple-400 border-purple-900/50 font-extrabold";
                          indicatorIcon = <Shield size={10} className="text-purple-400 shrink-0" />;
                          indicatorGlow = "shadow-[0_0_10px_rgba(168,85,247,0.25)]";
                        } else if (authorTier === "DIAMOND") {
                          indicatorText = "💎 ELITE VERIFIED";
                          indicatorColor = "bg-sky-955/50 text-sky-400 border-sky-900/50 font-extrabold";
                          indicatorIcon = <Zap size={10} className="text-sky-400 shrink-0" />;
                          indicatorGlow = "shadow-[0_0_8px_rgba(56,189,248,0.25)]";
                        } else {
                          indicatorText = "✓ VERIFIED ROSTER";
                          indicatorColor = "bg-emerald-955/50 text-emerald-400 border-emerald-900/50 font-bold";
                          indicatorIcon = <ShieldCheck size={10} className="text-emerald-400 shrink-0" />;
                        }
                      }

                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.35, 
                            delay: Math.min(index * 0.08, 0.8), 
                            ease: "easeOut" 
                          }}
                          className="roster-player-card bg-[#171717] p-5 rounded-2xl border border-[#252525] space-y-3.5 relative"
                        >
                          {/* Compact Icon-Based Verified Badge */}
                          <AnimatePresence>
                            {isVerifiedValue && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute top-4 right-4 z-10 group/verified-tooltip"
                              >
                                <span 
                                  className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 cursor-help hover:scale-110 transition-all duration-200 hover:bg-emerald-900/90 shadow-lg relative"
                                  title={`Verified Roster Member • Joined: ${playerJoinDate}`}
                                >
                                  {/* Elegant pulse animation ring */}
                                  <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />
                                  
                                  <ShieldCheck size={12} className="shrink-0 relative z-10 animate-pulse" />
                                </span>
                                
                                {/* CSS Tooltip on Hover */}
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/verified-tooltip:flex flex-col items-end z-50 pointer-events-none transition-all">
                                  <div className="bg-zinc-950 text-zinc-300 text-[8px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-zinc-800 whitespace-nowrap shadow-2xl flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span>Verified Member</span>
                                    <span className="text-zinc-700">•</span>
                                    <span>📅 Joined: <strong className="text-white">{playerJoinDate}</strong></span>
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-zinc-950 border-r border-b border-zinc-800 rotate-45 -mt-1 mr-2" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex flex-col gap-3">
                            <div 
                              onClick={() => {
                                if (matchingPlayerIdx !== -1) {
                                  setExpandedFeedPlayerIgn(expandedFeedPlayerIgn === post.author ? null : post.author);
                                  setSystemAlertMessage(`ℹ️ Clicked roster card. Accessing simulated verification portal for ${post.author}.`);
                                } else {
                                  setSystemAlertMessage(`ℹ️ Author ${post.author} is a verified administrative role. Sandbox tuning applies to active players.`);
                                }
                              }}
                              className="flex items-start justify-between cursor-pointer group/author bg-zinc-900/30 hover:bg-zinc-900/80 p-2.5 rounded-xl border border-transparent hover:border-zinc-800 transition-all duration-200"
                              title={matchingPlayerIdx !== -1 ? "Click to view Roster Card & Dynamic Sandbox Tuning Station" : "Official Roster Communication Card"}
                            >
                              <div className="flex gap-3">
                                <div className="w-10 h-10 bg-red-950/60 border border-red-600/50 font-extrabold rounded-full flex items-center justify-center text-sm text-red-500 uppercase select-none relative group-hover/author:scale-105 transition-all">
                                  <span className="text-lg">{authorAvatar}</span>
                                  {isVerifiedRoster && (
                                    <span className="absolute -bottom-1 -right-1 bg-black border border-red-500 rounded-full p-0.5 shadow-lg">
                                      {isTeamCaptain ? <Crown size={8} className="text-red-500 shrink-0" /> : <ShieldCheck size={8} className="text-emerald-500 shrink-0" />}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap text-left">
                                    <span className="text-xs font-extrabold text-white font-mono group-hover/author:text-red-400 transition-colors">{post.author}</span>
                                    <span className="text-[9px] bg-[#222222] text-[#999999] px-1.5 py-0.5 rounded font-mono uppercase">
                                      {authorRole}
                                    </span>
                                    {isVerifiedRoster && (
                                      <span 
                                        className={`inline-flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded font-black font-mono uppercase tracking-wider ${indicatorColor} ${indicatorGlow}`}
                                        title={`Official Team Verification - ${authorTier} Tier Roster Member`}
                                      >
                                        {indicatorIcon}
                                        <span>{indicatorText}</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-mono uppercase mt-0.5">
                                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="text-red-400 font-semibold">{(() => {
                                      try {
                                        const diffMs = Date.now() - new Date(post.timestamp).getTime();
                                        const diffMins = Math.floor(diffMs / 60000);
                                        if (diffMins < 1) return "Just now";
                                        if (diffMins < 60) return `${diffMins}m ago`;
                                        const diffHours = Math.floor(diffMins / 60);
                                        if (diffHours < 24) return `${diffHours}h ago`;
                                        const diffDays = Math.floor(diffHours / 24);
                                        return `${diffDays}d ago`;
                                      } catch {
                                        return "Just now";
                                      }
                                    })()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 font-mono">
                                <span className="text-red-500 text-xs cursor-pointer flex items-center gap-1" title="Roster Broadcast">⚡ CV INTERNAL</span>
                                {matchingPlayerIdx !== -1 && (
                                  <span className="text-[8px] text-zinc-500 font-black uppercase tracking-wider group-hover/author:text-red-500 transition-colors">
                                    {expandedFeedPlayerIgn === post.author ? "▲ Hide Portal" : "▼ Tune Player"}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Expanded Interactive Sandbox Roster Player Verification Card */}
                            {expandedFeedPlayerIgn === post.author && matchingPlayer && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.25 }}
                                className="bg-black/85 p-4 rounded-xl border border-zinc-800/80 space-y-4 text-left font-mono overflow-hidden shadow-[0_0_20px_rgba(255,0,0,0.05)]"
                              >
                                <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-zinc-900 pb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="text-3xl bg-zinc-900 p-2 rounded-lg border border-zinc-800 select-none">{authorAvatar}</span>
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className="text-xs font-black text-white">{matchingPlayer.ign}</h4>
                                        <span className="text-[8px] bg-red-955/40 text-red-400 px-1.5 py-0.5 rounded uppercase border border-red-500/20">
                                          {authorTier} TIER
                                        </span>
                                      </div>
                                      <p className="text-[9px] text-zinc-400 mt-0.5">{matchingPlayer.name} — {authorRole}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start md:items-end justify-center text-[9px] leading-tight text-zinc-500 gap-0.5">
                                    <span>REGISTRATION ID: <strong className="text-zinc-400">CV-2026-{matchingPlayer.jerseyNumber || "99"}</strong></span>
                                    <span>LOBBY CODE: <strong className="text-zinc-400">SECURE-{matchingPlayer.ign.slice(3, 6).toUpperCase()}</strong></span>
                                  </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                                    <span className="text-[8px] text-zinc-550 block uppercase font-bold">COMBAT K/D</span>
                                    <strong className="text-red-500 text-sm font-black mt-0.5 block">{matchingPlayer.kd}</strong>
                                  </div>
                                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                                    <span className="text-[8px] text-zinc-550 block uppercase font-bold">WIN RATE</span>
                                    <strong className="text-emerald-400 text-sm font-black mt-0.5 block">{matchingPlayer.winRate}</strong>
                                  </div>
                                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                                    <span className="text-[8px] text-zinc-550 block uppercase font-bold">BATTLE KILLS</span>
                                    <strong className="text-rose-500 text-sm font-black mt-0.5 block">{matchingPlayer.totalKills}</strong>
                                  </div>
                                  <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                                    <span className="text-[8px] text-zinc-550 block uppercase font-bold">LOBBY STATUS</span>
                                    <span className={`text-[9px] font-bold uppercase mt-1 block ${
                                      matchingPlayer.availabilityStatus === "Available" ? "text-emerald-500" : "text-amber-500"
                                    }`}>
                                      ● {matchingPlayer.availabilityStatus}
                                    </span>
                                  </div>
                                </div>

                                {/* Career Trajectory Sparkline Chart */}
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[9px] text-[#ff001c] font-black tracking-widest uppercase">
                                      <TrendingUp size={11} className="text-red-500" />
                                      <span>Career Trajectory (Last 6 Months)</span>
                                    </div>
                                    <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono px-2 py-0.5 rounded uppercase">
                                      Live Elo Sparkline
                                    </span>
                                  </div>

                                  <div className="h-20 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart 
                                        data={(() => {
                                          const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
                                          const tierWeights: Record<string, number> = {
                                            PLATINUM: 1,
                                            DIAMOND: 2,
                                            MASTER: 3,
                                            GRANDMASTER: 4
                                          };
                                          const targetWeight = tierWeights[(matchingPlayer.tier || "DIAMOND").toUpperCase()] || 2;
                                          const seed = matchingPlayer.ign.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                          
                                          return months.map((month, idx) => {
                                            const progress = idx / 5;
                                            const variance = Math.sin(seed + idx * 1.7) * 0.35;
                                            const baseWeight = targetWeight - 0.7 + (seed % 3) * 0.3;
                                            const currentWeight = baseWeight + (targetWeight - baseWeight) * progress + variance;
                                            const clampedWeight = Math.max(0.8, Math.min(4.5, currentWeight));
                                            const rating = Math.floor(clampedWeight * 1000);
                                            
                                            let tierName = "DIAMOND";
                                            if (clampedWeight < 1.5) {
                                              tierName = "PLATINUM";
                                            } else if (clampedWeight < 2.5) {
                                              tierName = "DIAMOND";
                                            } else if (clampedWeight < 3.5) {
                                              tierName = "MASTER";
                                            } else {
                                              tierName = "GRANDMASTER";
                                            }
                                            
                                            return {
                                              name: month,
                                              Rating: rating,
                                              Tier: tierName
                                            };
                                          });
                                        })()}
                                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                      >
                                        <XAxis 
                                          dataKey="name" 
                                          tickLine={false} 
                                          axisLine={false} 
                                          tick={{ fill: "#666", fontSize: 8, fontFamily: "monospace" }}
                                        />
                                        <Tooltip 
                                          cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '3 3' }}
                                          content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                              const data = payload[0].payload;
                                              let badgeColor = "text-sky-400 bg-sky-955/40 border-sky-900/40";
                                              if (data.Tier === "PLATINUM") badgeColor = "text-gray-400 bg-gray-950/40 border-gray-800";
                                              if (data.Tier === "MASTER") badgeColor = "text-purple-400 bg-purple-955/40 border-purple-900/40";
                                              if (data.Tier === "GRANDMASTER") badgeColor = "text-red-400 bg-red-955/40 border-red-900/40";

                                              return (
                                                <div className="bg-black/95 border border-zinc-800 p-2 rounded text-left shadow-2xl font-mono text-[8px] space-y-1">
                                                  <p className="text-zinc-500 uppercase font-black">{data.name} 2026</p>
                                                  <div className="flex items-center gap-1.5">
                                                    <span className={`px-1 py-0.5 rounded border text-[7px] font-black ${badgeColor}`}>
                                                      {data.Tier}
                                                    </span>
                                                    <span className="text-white font-extrabold">{data.Rating} LP</span>
                                                  </div>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }}
                                        />
                                        <Line 
                                          type="monotone" 
                                          dataKey="Rating" 
                                          stroke="#ff001c" 
                                          strokeWidth={1.5}
                                          dot={{ r: 2, stroke: '#ff001c', strokeWidth: 1, fill: '#000' }}
                                          activeDot={{ r: 4, stroke: '#fff', strokeWidth: 1, fill: '#ff001c' }}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>

                                {/* Roster Integrity Verification Details */}
                                <div className="bg-red-950/10 p-3 rounded-lg border border-red-500/10 space-y-2">
                                  <div className="flex items-center gap-1.5 text-[9px] text-[#ff001c] font-bold tracking-wider uppercase">
                                    <ShieldCheck size={11} className="text-red-500" />
                                    <span>ROSTER MEMBERSHIP INTEGRITY SCANNER</span>
                                  </div>
                                  <p className="text-[9.5px] text-zinc-300 leading-normal">
                                    Verification of <strong className="text-white">{matchingPlayer.ign}</strong> is established on the active blockchain ledger. Membership level is dynamically computed from tier level (<strong className="text-white">{authorTier}</strong>) and leadership status (<strong className="text-white">{isTeamCaptain ? "CAPTAIN" : "MEMBER"}</strong>).
                                  </p>
                                </div>

                                {/* SIMULATION TUNING CONTROLS */}
                                <div className="space-y-2 text-left pt-1">
                                  <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-widest">
                                    🔧 SANDBOX SIMULATION: DYNAMICALLY TUNE PLAYER CONFIGS
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {/* Toggle Captain Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRosterPlayers(prev => prev.map(p => {
                                          if (p.ign.toLowerCase() === post.author.toLowerCase()) {
                                            const currentIsCap = p.role === "Team Captain" || p.role === "Squad Leader" || p.role.includes("IGL");
                                            return {
                                              ...p,
                                              role: currentIsCap ? "Elite Member" : "Team Captain"
                                            };
                                          }
                                          return p;
                                        }));
                                        setSystemAlertMessage(`⚡ Toggled Captain status of ${matchingPlayer.ign}! Verification indicator dynamically updated.`);
                                      }}
                                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-red-955/40 text-zinc-300 hover:text-red-400 border border-zinc-800 hover:border-red-900/60 rounded text-[9px] font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                                      title="Promote or demote leadership role in active roster"
                                    >
                                      <Crown size={10} className="text-red-500 shrink-0" />
                                      <span>Toggle Captain Status</span>
                                    </button>

                                    {/* Cycle Tier Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRosterPlayers(prev => prev.map(p => {
                                          if (p.ign.toLowerCase() === post.author.toLowerCase()) {
                                            const tiers = ["GRANDMASTER", "MASTER", "DIAMOND"];
                                            const nextTier = tiers[(tiers.indexOf(p.tier || "DIAMOND") + 1) % tiers.length];
                                            return {
                                              ...p,
                                              tier: nextTier
                                            };
                                          }
                                          return p;
                                        }));
                                        setSystemAlertMessage(`💎 Cycled ${matchingPlayer.ign} Roster Tier! Verification indicator dynamically updated.`);
                                      }}
                                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-amber-955/20 text-zinc-300 hover:text-amber-500 border border-zinc-800 hover:border-amber-900/60 rounded text-[9px] font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                                      title="Cycle ranking level dynamically"
                                    >
                                      <Award size={10} className="text-amber-500 shrink-0" />
                                      <span>Cycle Rank Tier</span>
                                    </button>

                                    {/* Toggle Availability Status Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRosterPlayers(prev => prev.map(p => {
                                          if (p.ign.toLowerCase() === post.author.toLowerCase()) {
                                            return {
                                              ...p,
                                              availabilityStatus: p.availabilityStatus === "Available" ? "Busy" : "Available",
                                              lastActiveInLobby: Date.now()
                                            };
                                          }
                                          return p;
                                        }));
                                        setSystemAlertMessage(`⏳ Toggled Active Lobby presence status for ${matchingPlayer.ign}.`);
                                      }}
                                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-emerald-955/20 text-zinc-300 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-900/60 rounded text-[9px] font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                                      title="Toggle simulated lobby status"
                                    >
                                      <UserCheck size={10} className="text-emerald-500 shrink-0" />
                                      <span>Toggle Availability</span>
                                    </button>

                                    {/* Toggle Simulated Verification Status Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRosterPlayers(prev => prev.map(p => {
                                          if (p.ign.toLowerCase() === post.author.toLowerCase()) {
                                            const newVal = !(p.isVerified !== false);
                                            return {
                                              ...p,
                                              isVerified: newVal
                                            };
                                          }
                                          return p;
                                        }));
                                        setSystemAlertMessage(`✓ Toggled simulated verification status of ${matchingPlayer.ign}!`);
                                      }}
                                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-blue-955/40 text-zinc-300 hover:text-blue-400 border border-zinc-800 hover:border-blue-900/60 rounded text-[9px] font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                                      title="Toggle Verified / Pending Status"
                                    >
                                      <ShieldCheck size={10} className="text-blue-500 shrink-0" />
                                      <span>Toggle Verified Status</span>
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          <p className="text-xs text-gray-200 leading-relaxed font-mono select-text bg-[#0D0D0D] p-3 rounded border border-gray-800/50">
                        {parseMentions(post.content)}
                      </p>

                      {renderPostThumbnail(post.content)}

                      <div className="flex gap-4 items-center text-[11px] font-mono border-t border-gray-805/50 pt-2 text-gray-500">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          onClick={() => {
                            setFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                            awardXp(5);
                            setSystemAlertMessage(`👍 Upvoted ${post.author}'s tactical bulletin post!`);
                          }}
                          className="hover:text-red-500 text-gray-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                          title="Signal appreciation for quality strategic content"
                        >
                          <ThumbsUp size={11} className="text-red-500" />
                          <span>Upvote ({post.likes})</span>
                        </motion.button>

                        <motion.button
                          id={`btn-comment-toggle-${post.id}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          onClick={() => {
                            setOpenCommentSections(prev => ({ ...prev, [post.id]: !prev[post.id] }));
                          }}
                          className="hover:text-red-500 text-gray-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                          title="Discuss strategies or leave feedback on this post"
                        >
                          <MessageSquare size={11} className="text-red-500" />
                          <span>Comment ({post.comments.length})</span>
                        </motion.button>

                        <button
                          onClick={() => {
                            const shareText = `[${post.role}] ${post.author} posted on ${new Date(post.timestamp).toLocaleString()}:\n\n"${post.content}"`;
                            navigator.clipboard.writeText(shareText);
                            setSystemAlertMessage(`📋 Copied ${post.author}'s bulletin post to clipboard!`);
                          }}
                          className="hover:text-red-500 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                          title="Copy post and author details to clipboard"
                        >
                          <Share2 size={11} className="text-red-500" />
                          <span>Share</span>
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const traj = getPlayerTrajectoryData(
                              post.author, 
                              matchingPlayer?.kd || "4.00", 
                              matchingPlayer?.totalKills || 800, 
                              matchingPlayer?.winRate || "65%"
                            );

                            setDossierConfirmData({
                              post,
                              matchingPlayer,
                              isVerifiedRoster,
                              authorTier,
                              authorRole,
                              indicatorText,
                              playerJoinDate,
                              trajectory: traj
                            });
                          }}
                          className="hover:text-red-500 text-gray-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                          title="Download player tactical dossier summary"
                        >
                          <Download size={11} className="text-red-500" />
                          <span>Dossier</span>
                        </motion.button>

                        {post.author === session.ign && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={() => setPostPendingDelete(post.id)}
                            className="hover:text-red-500 text-gray-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                            title="Remove this bulletin post"
                          >
                            <Trash2 size={11} className="text-red-500" />
                            <span>Delete</span>
                          </motion.button>
                        )}

                        {post.author !== session.ign && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={() => setReportingPost(post)}
                            className="hover:text-red-500 text-gray-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                            title="Report inappropriate content or false strategic intel"
                          >
                            <Flag size={11} className="text-red-500" />
                            <span>Report</span>
                          </motion.button>
                        )}

                        <span>🛡️ Verified Bulletins Secure Integrity</span>
                      </div>

                      {postPendingDelete === post.id && (
                        <div className="bg-[#1A0A0A] border border-red-900/60 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between text-[11px] text-red-400 font-mono gap-3 animate-fade-in mt-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-500 animate-pulse shrink-0" />
                            <span>Confirm removal of your tactical bulletin broadcast? This action is irreversible.</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              onClick={() => {
                                setFeedPosts(prev => prev.filter(p => p.id !== post.id));
                                setPostPendingDelete(null);
                                setSystemAlertMessage("🗑️ Tactical bulletin post successfully removed from secure intranet feed.");
                              }}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase text-[9px] cursor-pointer"
                            >
                              Confirm Delete
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              onClick={() => setPostPendingDelete(null)}
                              className="px-2.5 py-1 bg-gray-800 hover:bg-gray-750 text-gray-300 rounded font-bold uppercase text-[9px] cursor-pointer"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Display Comments & Strategy Discussion */}
                      {openCommentSections[post.id] && (
                        <ExpandableCommentArea
                          post={post}
                          commentInput={commentInputs[post.id] || ""}
                          onChangeCommentInput={(val) => setCommentInputs({ ...commentInputs, [post.id]: val })}
                          onSubmitComment={() => handleAddComment(post.id)}
                          session={session}
                          awardXp={awardXp}
                          setSystemAlertMessage={setSystemAlertMessage}
                        />
                      )}

                    </motion.div>
                  ); })}
                </div>
              </div>
            </div>
          )}

          {/* 10. PRIVATE TAB: SCRIMS SCHEDULING MANAGEMENT & VAULT */}
          {activeTab === "scrims" && (
            <div className="space-y-6">
              {!hasTabPermission(session.role, "Scrims") ? (
                <AccessDenied
                  onReturnHome={() => setActiveTab("home")}
                  onContactSupport={() => setSystemAlertMessage("Contact platform Owner for security elevation.")}
                />
              ) : (
                <>
                  <ScrimManagementSystem
                    session={session}
                    setSystemAlertMessage={setSystemAlertMessage}
                    awardXp={awardXp}
                  />
                  <ScrimDensitySection />
                </>
              )}
            </div>
          )}

          {/* 11. PRIVATE TAB: REWARDS STORE & BATTLE PASS SECTOR */}
          {activeTab === "rewards" && (
            <CVBattlePassAndCareer
              session={session}
              onUpdateSession={(updated) => setSession(updated)}
              showNotification={(msg) => setSystemAlertMessage(msg)}
            />
          )}

          {/* CV ESPORTS PASSPORT SYSTEM */}
          {activeTab === "passport" && (
            <CVEsportsPassport
              session={session}
              onUpdateSession={(updated) => setSession(updated)}
              showNotification={(msg) => setSystemAlertMessage(msg)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 12. SPECIAL: THE BASE BUILDER SHIELDS SECTION */}
          {activeTab === "bases" && (
            <div className="space-y-6">
              <div className="bg-[#111111] p-5 rounded-2xl border border-gray-800 space-y-4">
                <SectionTitle text="🧬 IMMERSIVE FACTION BASES CONSOLE Builder" sub="Construct defenses and power up your team base" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  Earn upgrade modules to optimize your esports guild base metrics. Ensure radar connectivity indicators remain stabilized before live scrim matches.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                  <div className="bg-[#1F1F1F] p-4 rounded-xl border border-gray-800 space-y-4">
                    <h4 className="text-xs font-black font-mono text-red-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                      🛠️ UPGRADE BASE SPECIFICATION PARAMETERS
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">FACTION RECTOR BASE NAME:</span>
                        <input
                          type="text"
                          value={factionBase.name}
                          onChange={(e) => setFactionBase({ ...factionBase, name: e.target.value })}
                          className="bg-black/60 border border-gray-800 rounded p-1.5 font-mono text-white text-right w-48 text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">DEFENSIVE PLASMA SHIELD (CURRENT POWER):</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-red-500">Lvl {factionBase.shieldLevel}</span>
                          <button
                            onClick={() => {
                              if (session.coins < 150) {
                                setSystemAlertMessage("❌ Spend limits! Upgrades require 150 CV Coins.");
                                return;
                              }
                              setSession({ ...session, coins: session.coins - 150 });
                              setFactionBase({ ...factionBase, shieldLevel: factionBase.shieldLevel + 1 });
                              setSystemAlertMessage("✓ PLASMA SHIELD upgraded! Max shield capacity boosted +20%.");
                            }}
                            className="bg-[#2B2B2B] hover:bg-red-600 px-2 py-0.5 rounded font-mono text-[9px]"
                          >
                            [UPGRADE FOR 150 COINS]
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">SATELLITE MONITOR TRACKER TARGET:</span>
                        <select
                          value={factionBase.satelliteRotations}
                          onChange={(e) => setFactionBase({ ...factionBase, satelliteRotations: e.target.value })}
                          className="bg-black border border-gray-800 p-1 rounded font-mono text-xs text-white"
                        >
                          <option value="Erangel Focus">Erangel Sector Focus</option>
                          <option value="Miramar Focus">Miramar Sector Focus</option>
                          <option value="Sanhok Focus">Sanhok Sector Focus</option>
                        </select>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">POWER GRID EFFICIENCY FACTOR:</span>
                        <div className="flex gap-1.5 items-center">
                          <strong className="text-white font-mono">98.42% STABLE</strong>
                          <span className="w-2.5 h-2.5 rounded bg-red-650 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#050505] p-5 rounded-xl border border-red-900/30 font-mono text-xs text-gray-500 uppercase flex flex-col justify-between">
                    <div>
                      <p className="text-red-500 font-bold tracking-widest text-[10px] mb-2">📡 CONSTRUCTOR DECK TERMINAL LOGS</p>
                      <ul className="space-y-1.5 text-[10px] leading-tight text-gray-400">
                        <li>• Initializing Crimson Citadel mainframe linkage...</li>
                        <li>• Defensive shield frequency tracking level: {factionBase.shieldLevel}</li>
                        <li>• Targeting Satellite rotations overlay: "{factionBase.satelliteRotations}"</li>
                        <li>• Antigravity platform integration code: SECURE</li>
                        <li>• Local workspace node port: STABILIZED ON SECURE SSL</li>
                      </ul>
                    </div>
                    <div className="text-center pt-4 border-t border-gray-900 mt-4">
                      <span className="text-[9px] text-gray-600 select-none block">CRAFTED UNDER CV VERIFIED PROGRAM GUIDANCE</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 13. PRIVATE TAB: ADMIN CONTROL PANEL / OWNER CMD CENTER */}
          {activeTab === "dashboard" && (
            !hasTabPermission(session.role, "Dashboard") ? (
              <AccessDenied
                onReturnHome={() => setActiveTab("home")}
                onContactSupport={() => setSystemAlertMessage("Contact platform Owner for security elevation.")}
              />
            ) : (
              <EsportsControlCenter
                userSession={session}
                systemAlertMessage={systemAlertMessage}
                setSystemAlertMessage={setSystemAlertMessage}
                setActiveTab={setActiveTab}
                sentinelStatus={sentinelStatus}
                onSelfRepair={handleSelfRepair}
              />
            )
          )}

          {activeTab === "owner-audit-logs" && (
            session.role !== "Owner" ? (
              <AccessDenied
                onReturnHome={() => setActiveTab("home")}
                onContactSupport={() => setSystemAlertMessage("Contact platform Owner for security elevation.")}
              />
            ) : (
              <div className="animate-fade-in text-left">
                <CVAuditLogSystem
                  userSession={session}
                  setSystemAlertMessage={setSystemAlertMessage}
                  auditLogs={auditLogs}
                  socket={socket}
                  rosterHistoryList={rosterHistoryList}
                />
              </div>
            )
          )}

          {activeTab === "securityGuardian" && (
            !hasTabPermission(session.role, "Security Controls") ? (
              <AccessDenied
                onReturnHome={() => setActiveTab("home")}
                onContactSupport={() => setSystemAlertMessage("Contact platform Owner for security elevation.")}
              />
            ) : (
              <div className="animate-fade-in text-left">
                <CVSecurityGuardian />
              </div>
            )
          )}

          {activeTab === "layoutProtection" && (
            !hasTabPermission(session.role, "System Controls") ? (
              <AccessDenied
                onReturnHome={() => setActiveTab("home")}
                onContactSupport={() => setSystemAlertMessage("Contact platform Owner for security elevation.")}
              />
            ) : (
              <div className="animate-fade-in text-left">
                <CVLayoutProtectionSystem 
                  currentRole={session.role}
                  setSystemAlertMessage={setSystemAlertMessage}
                  awardXp={awardXp}
                  layoutRules={layoutRules}
                  setLayoutRules={(rules) => {
                    setLayoutRules(rules);
                    localStorage.setItem("cv_layout_rules", JSON.stringify(rules));
                  }}
                />
              </div>
            )
          )}

          {/* 14. DYNAMIC SUBSECTION: ANTI CHEAT AUDIT FORM */}
          {activeTab === "recruitment" && !recruitmentSuccess && (
            <div className="mt-8 bg-[#151515] p-5 rounded-2xl border border-red-900/30 max-w-2xl mx-auto space-y-4">
              <div className="flex gap-2.5 items-center pb-2 border-b border-gray-800">
                <AlertTriangle className="text-red-500 animate-bounce" size={20} />
                <h3 className="text-xs font-black tracking-widest font-mono text-white select-none">
                  🛡️ CV CORESIGNAL ANTI-CHEAT INTEGRITY REPORT SECURE UNIT
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                CV eSports takes gameplay integrity extremely seriously. If you have clear evidence of a player using emulator modifications, speed macros, or direct ESP hacks in custom tournament rooms, file a secure report using the form below:
              </p>
              
              <form onSubmit={handleSubmitReport} className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-500 mb-1">TARGET PLAYER IGN</label>
                  <input
                    type="text"
                    value={reportIgn}
                    onChange={(e) => setReportIgn(e.target.value)}
                    placeholder="E.g., SpeedHacker_99"
                    required
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-500 mb-1">ALLEGED MODIFICATION CLASS</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2 text-white select-none"
                  >
                    <option value="ESP / Wallhack">ESP / Wallhack</option>
                    <option value="Keyboard & Emulator Bypass">Keyboard & Emulator Bypass</option>
                    <option value="Speed or Glue wall Gliching">Speed or Glue wall Gliching</option>
                    <option value="Aim-Assist Scripts / Cronus Zen">Aim-Assist Scripts / Cronus Zen</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-500 mb-1">EVIDENCE VIDEO OR GRAPHIC URL</label>
                  <input
                    type="url"
                    value={reportUrl}
                    onChange={(e) => setReportUrl(e.target.value)}
                    placeholder="E.g., https://youtube.com/clip/evidence-sample"
                    required
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded p-2 text-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#101010] hover:bg-[#181818] border border-gray-800 text-white font-mono rounded cursor-pointer text-xs"
                  >
                    🔒 LOG ANONYMOUS INTEGRITY CASE
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* COMMUNITY SQUADS TAB */}
          {activeTab === "communitySquads" && (
            <div className="space-y-6">
              {/* STICKY DISCOVERY SHORTCUTS ON COMMUNITY PAGE */}
              <div className="bg-[#111111] p-5 rounded-3xl border border-dashed border-[#10b981]/30 flex flex-col md:flex-row justify-between items-center gap-4 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase block font-mono">⚡ PLAYGROUND DIRECT SHORTCUTS</span>
                  <h4 className="text-sm font-black font-orbitron tracking-wide text-white">COMMUNITY MULTIVERSE PORTAL</h4>
                  <p className="text-xs text-zinc-400">Launch tournaments hosting requests or register your customizable casual squads immediately.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => {
                      setCommunityHubInitialTab("hosting");
                      setActiveTab("communityHub");
                      setSystemAlertMessage("🏆 Opening Tournament Hosting System requests deck!");
                    }}
                    className="flex-1 md:flex-none px-4 py-3 bg-[#10b981] hover:bg-[#059669] text-black text-[10.5px] font-black uppercase rounded-xl tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] duration-200 cursor-pointer"
                  >
                    🏆 Host a Tournament
                  </button>
                  <button
                    onClick={() => {
                      setCommunityHubInitialTab("teams");
                      setActiveTab("communityHub");
                      setSystemAlertMessage("👥 Opening Community Team Creation interface!");
                    }}
                    className="flex-1 md:flex-none px-4 py-3 bg-zinc-900 border border-[#10b981]/40 hover:bg-[#10b981]/15 text-white text-[10.5px] font-black uppercase rounded-xl tracking-wide transition-all duration-200 cursor-pointer"
                  >
                    👥 Create a Team
                  </button>
                </div>
              </div>

              <CommunitySquadSystem
                currentIgn={session.ign}
                onAlert={(msg) => setSystemAlertMessage(msg)}
                onGoHome={() => setActiveTab("home")}
              />
              <CommunityTeamDensitySection />
            </div>
          )}

          {/* REGISTERED STANDALONE COMMUNITY HUB */}
          {activeTab === "communityHub" && (
            <div className="animate-fade-in text-left">
              <CVCommunityHub
                userSession={session}
                systemAlertMessage={systemAlertMessage}
                setSystemAlertMessage={setSystemAlertMessage}
                initialTab={communityHubInitialTab}
                setGlobalActiveTab={setActiveTab}
              />
            </div>
          )}

          {activeTab === "scrimOrgs" && (
            <ScrimOrganizationSystem
              currentIgn={session.ign}
              onAlert={(msg) => setSystemAlertMessage(msg)}
              onGoHome={() => setActiveTab("home")}
            />
          )}

          {/* RULES AND COMPLIANCE SYSTEM TAB */}
          {activeTab === "rules-dashboard" && (
            <div className="space-y-6">
              <RulesAndComplianceSystem
                currentIgn={session.ign}
                onAlert={(msg) => setSystemAlertMessage(msg)}
                onGoHome={() => setActiveTab("home")}
              />
              <RulesDensitySection />
            </div>
          )}

          {/* WHATSAPP LINKING AND CODE DELIVERY SYSTEM SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <WhatsAppLinkingSystem
                currentIgn={session.ign}
                onAlert={(msg) => setSystemAlertMessage(msg)}
              />
              <UserDashboardDensity setActiveTab={setActiveTab} />
            </div>
          )}

          {activeTab === "worldChat" && (
            <WorldChatSystem
              session={session}
              setSystemAlertMessage={setSystemAlertMessage}
            />
          )}

          {activeTab === "seoPreview" && (
            <div className="animate-fade-in text-left">
              <SeoPreviewSystem onAlertMessage={setSystemAlertMessage} />
            </div>
          )}

            </motion.div>
          )}
          </AnimatePresence>
        </main>

      </div>

      {/* CHATBOT INTEGRITY PLUGINS CONTAINER */}
      <CVBot />

      {/* CLAN COMMUNICATIONS CHAT ENGINE (GENERAL, TEAM EXCLUSIVE, ADMIN CHANNELS) */}
      <ClanChatPanel
        session={session}
        recruits={recruits}
        onApproveRecruit={handleApproveRecruit}
        setSystemAlertMessage={setSystemAlertMessage}
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        messages={chatMessages}
        setMessages={setChatMessages}
        unreadCount={chatUnreadCount}
        setUnreadCount={setChatUnreadCount}
      />

      {/* 👑 CV ESPORTS MANAGEMENT PORTAL ACCESS COMPONENT */}
      {isManagementPortalOpen && (
        <CVManagementPortal
          onClose={() => setIsManagementPortalOpen(false)}
          currentRole={session.role}
          setSystemAlertMessage={setSystemAlertMessage}
          awardXp={awardXp}
          isPlatformLocked={isPlatformLocked}
          setIsPlatformLocked={setIsPlatformLocked}
          isMaintenanceMode={isMaintenanceMode}
          setIsMaintenanceMode={setIsMaintenanceMode}
          adminActionsSuspended={adminActionsSuspended}
          setAdminActionsSuspended={setAdminActionsSuspended}
          rolePermissions={rolePermissions}
          setRolePermissions={setRolePermissions}
          playInteractionSound={playInteractionSound}
        />
      )}

      {/* 📁 WOW BLUEPRINT MANAGEMENT DIALOG MODAL (DELETE/ARCHIVE) */}
      {wowMapToManage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left font-mono">
          <div className="bg-[#090909] border border-[#1C1C1C] rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-[0_0_50px_rgba(255,0,0,0.15)]">
            
            {/* Top corner Reticle lines */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-red-650" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-red-650" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-red-650" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-red-650" />

            <button 
              onClick={() => { setWowMapToManage(null); setWowManageAction(null); }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wowManageAction === 'delete' ? 'bg-red-600/10 text-red-500 border border-red-500/30' : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'}`}>
                {wowManageAction === 'delete' ? <Trash2 size={20} /> : <Archive size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-wide uppercase">
                  {wowManageAction === 'delete' ? "Confirm Deletion" : "Confirm Archival"}
                </h3>
                <p className="text-[8.5px] text-zinc-500 uppercase tracking-widest mt-0.5">
                  World of Wonder (WOW) Registry
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-black/40 rounded-lg border border-zinc-900">
                <span className="text-[8px] text-zinc-500 block font-bold">TARGET BLUEPRINT</span>
                <span className="text-xs font-black text-white uppercase italic">{wowMapToManage.title}</span>
                <span className="text-[9px] font-bold text-[#FF001F] block mt-1">CODE: {wowMapToManage.code}</span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                {wowManageAction === 'delete' 
                  ? "Are you absolutely sure you want to permanently delete this map blueprint? This will completely remove it from the central WOW servers. This action is irreversible."
                  : "Are you sure you want to archive this map blueprint? Archiving moves the map offline. It won't appear in the active public catalog but is retained in your archived offline storage."}
              </p>
            </div>

            {/* Quick checkbox/agreement for confirmation */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-[10px] text-zinc-400 hover:text-zinc-300 transition-colors select-none cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={wowConfirmChecked}
                  onChange={(e) => setWowConfirmChecked(e.target.checked)}
                  className="rounded bg-black border-zinc-800 text-red-650 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span>I confirm this action matches tactical roadmap parameters.</span>
              </label>
            </div>

            <div className="flex gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => { setWowMapToManage(null); setWowManageAction(null); }}
                className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-450 hover:text-white rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all"
              >
                Cancel
              </button>
              
              {wowManageAction === 'delete' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!wowConfirmChecked) {
                      setSystemAlertMessage("⚠️ Please check the confirmation checkbox to verify deletion.");
                      return;
                    }
                    // Delete permanently from state
                    setWowPublishedMaps(prev => prev.filter(m => m.id !== wowMapToManage.id));
                    setSystemAlertMessage(`🔥 Blueprint [${wowMapToManage.title}] permanently purged from WOW Registry.`);
                    setWowMapToManage(null);
                    setWowManageAction(null);
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] uppercase font-black tracking-wider cursor-pointer border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  Confirm Purge
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!wowConfirmChecked) {
                      setSystemAlertMessage("⚠️ Please check the confirmation checkbox to verify archival.");
                      return;
                    }
                    // Archive the map
                    setWowPublishedMaps(prev => prev.map(m => {
                      if (m.id === wowMapToManage.id) {
                        return { ...m, isArchived: true };
                      }
                      return m;
                    }));
                    setSystemAlertMessage(`🗄️ Blueprint [${wowMapToManage.title}] successfully moved to Offline Archive.`);
                    setWowMapToManage(null);
                    setWowManageAction(null);
                  }}
                  className="flex-1 py-2 bg-[#D97706] hover:bg-amber-700 text-white rounded text-[10px] uppercase font-black tracking-wider cursor-pointer border border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all"
                >
                  Confirm Archive
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 📋 DOSSIER DOWNLOAD EXPORT CONFIRMATION MODAL */}
      {dossierConfirmData && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-fade-in text-left">
          <div className="bg-[#0b0505] border border-red-950/70 rounded-2xl p-6 max-w-md w-full space-y-5 relative shadow-[0_0_50px_rgba(225,6,0,0.22)] font-mono text-zinc-300">
            {/* Top-right close button */}
            <button 
              onClick={() => setDossierConfirmData(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors text-sm cursor-pointer border-none bg-transparent"
              title="Close Panel"
            >
              ✕
            </button>
            
            {/* Elegant Cyberpunk Header */}
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
              <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-[#ff001c]/40 flex items-center justify-center text-[#ff001c]">
                <Download size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-widest text-[#ff001c] uppercase">COMPLIANCE EXPORT</h3>
                <p className="text-[9px] text-zinc-500 tracking-wider">TACTICAL DOSSIER GENERATOR & SANITY CHECK</p>
              </div>
            </div>

            {/* Dossier Meta Summary Table */}
            <div className="space-y-3">
              <div className="bg-[#050202] p-4 rounded-xl border border-zinc-900/90 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                  <span className="text-zinc-500 uppercase text-[10px]">Roster Subject</span>
                  <span className="text-white font-bold">{dossierConfirmData.post.author}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                  <span className="text-zinc-500 uppercase text-[10px]">Real Name / Role</span>
                  <span className="text-zinc-300">{dossierConfirmData.matchingPlayer?.name || "N/A"} ({dossierConfirmData.authorRole})</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                  <span className="text-zinc-500 uppercase text-[10px]">Roster Tier Level</span>
                  <span className="text-red-500 font-bold tracking-wider">{dossierConfirmData.authorTier}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                  <span className="text-zinc-500 uppercase text-[10px]">Total Games Played</span>
                  <span className="text-emerald-400 font-bold">{dossierConfirmData.trajectory.totalGames} Matches</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase text-[10px]">Combat K/D | Win Rate</span>
                  <span className="text-white font-mono">{dossierConfirmData.matchingPlayer?.kd || "N/A"} K/D | {dossierConfirmData.matchingPlayer?.winRate || "N/A"} WR</span>
                </div>
              </div>

              {/* Sparkline trajectory visualization inside modal */}
              <div className="space-y-2.5 bg-[#050202] p-4 rounded-xl border border-zinc-900/90">
                <div className="flex items-center justify-between text-[10px] uppercase text-zinc-500">
                  <span className="flex items-center gap-1">📈 6-Month Trajectory <span className="text-[8px] text-zinc-600 font-mono">(HOVER BARS TO INSPECT)</span></span>
                  <span className="text-emerald-400 font-semibold">{dossierConfirmData.trajectory.trend}</span>
                </div>
                
                {/* Visual Bar chart sparkline with multi-color dynamic highlight classes */}
                <div className="flex items-end justify-between gap-3 h-20 bg-[#020101] px-4 py-3 rounded-lg border border-zinc-950">
                  {(() => {
                    const vals = dossierConfirmData.trajectory.kdTrajectory;
                    const minVal = Math.min(...vals);
                    const maxVal = Math.max(...vals);
                    const range = maxVal - minVal || 1;
                    
                    return vals.map((val: number, idx: number) => {
                      const heightPercent = ((val - minVal) / range) * 70 + 30; // scaled between 30% and 100% height
                      const isPeak = val === maxVal;
                      const isTrough = val === minVal;
                      
                      let barGradient = "from-red-950 via-red-650 to-[#ff001c] shadow-[0_0_10px_rgba(255,0,28,0.2)]";
                      let tooltipBorder = "border-[#ff001c]/50";
                      let tooltipLabel = "BASELINE";
                      let barActiveGlow = "group-hover:shadow-[0_0_15px_rgba(255,0,28,0.6)]";
                      let textBadgeClass = "text-red-500";
                      
                      if (isPeak) {
                        barGradient = "from-amber-950 via-[#d97706] to-[#ffb100] shadow-[0_0_12px_rgba(255,177,0,0.3)]";
                        tooltipBorder = "border-[#ffb100]/60";
                        tooltipLabel = "PEAK LEVEL";
                        barActiveGlow = "group-hover:shadow-[0_0_20px_rgba(255,177,0,0.8)]";
                        textBadgeClass = "text-amber-400";
                      } else if (isTrough) {
                        barGradient = "from-indigo-950 via-[#4f46e5] to-[#6366f1] shadow-[0_0_12px_rgba(99,102,241,0.3)]";
                        tooltipBorder = "border-[#6366f1]/60";
                        tooltipLabel = "MIN LEVEL";
                        barActiveGlow = "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.8)]";
                        textBadgeClass = "text-indigo-400";
                      }
                      
                      const isHovered = hoveredTrajIdx === idx;
                      
                      return (
                        <div 
                          key={idx} 
                          className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end cursor-crosshair"
                          onMouseEnter={() => setHoveredTrajIdx(idx)}
                          onMouseLeave={() => setHoveredTrajIdx(null)}
                        >
                          {/* Custom visual bar with gradient and glow on hover */}
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className={`w-full bg-gradient-to-t ${barGradient} ${barActiveGlow} hover:brightness-125 rounded-t-md transition-all duration-300 relative ${isHovered ? 'scale-x-110 brightness-115' : ''}`}
                          >
                            {/* State-driven Tooltip on hover */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#070303]/95 backdrop-blur-md border ${tooltipBorder} text-zinc-100 text-[10px] px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap z-50 shadow-[0_4px_15px_rgba(0,0,0,0.9)] flex flex-col items-center transition-all duration-150 ${isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'}`}>
                              <span className="font-bold text-white">{dossierConfirmData.trajectory.months[idx]}: {val.toFixed(2)} K/D</span>
                              <span className={`text-[8px] font-black tracking-widest ${textBadgeClass}`}>{tooltipLabel}</span>
                              {/* Pointer Caret */}
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#070303] border-r border-b ${tooltipBorder} rotate-45 -mt-[4px]`}></div>
                            </div>
                          </div>
                          <span className={`text-[8px] transition-colors mt-1 select-none font-bold ${isHovered ? 'text-white scale-110' : 'text-zinc-500'}`}>{dossierConfirmData.trajectory.months[idx]}</span>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Interactive Dynamic Intelligence HUD Panel */}
                <div className="bg-[#020101] p-3 rounded-lg border border-zinc-900/60 mt-2 font-mono text-[10px] space-y-1.5 relative overflow-hidden transition-all duration-300">
                  <div className="absolute right-2 top-2 text-[8px] text-zinc-700 uppercase tracking-widest font-bold">
                    SYSTEM LEDGER
                  </div>
                  {(() => {
                    const activeIdx = hoveredTrajIdx !== null ? hoveredTrajIdx : 5; // default to latest month (Jun)
                    const activeMonth = dossierConfirmData.trajectory.months[activeIdx];
                    const activeVal = dossierConfirmData.trajectory.kdTrajectory[activeIdx];
                    const minVal = Math.min(...dossierConfirmData.trajectory.kdTrajectory);
                    const maxVal = Math.max(...dossierConfirmData.trajectory.kdTrajectory);
                    
                    let badgeColor = "text-[#ff001c]";
                    let statusLabel = "NOMINAL COMPAT VALUE";
                    
                    if (activeVal === maxVal) {
                      badgeColor = "text-[#ffb100]";
                      statusLabel = "CRITICAL PEAK EFFICIENCY (GOLD HIGHLIGHT)";
                    } else if (activeVal === minVal) {
                      badgeColor = "text-indigo-400";
                      statusLabel = "STABILIZED MINIMUM BOUND (INDIGO HIGHLIGHT)";
                    } else {
                      const firstVal = dossierConfirmData.trajectory.kdTrajectory[0];
                      if (activeVal > firstVal) {
                        badgeColor = "text-emerald-400";
                        statusLabel = "RISING COMBAT VELOCITY";
                      }
                    }
                    
                    return (
                      <div className="space-y-1">
                        <div className="grid grid-cols-2 gap-x-4">
                          <div>
                            <span className="text-zinc-500 uppercase text-[8px]">Inspect Frame:</span>{" "}
                            <span className="text-zinc-200 font-bold">{activeMonth} 2026</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase text-[8px]">Combat Rating:</span>{" "}
                            <span className={`${badgeColor} font-bold`}>{activeVal.toFixed(2)} K/D</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500 uppercase text-[8px]">Classification:</span>{" "}
                          <span className={`${badgeColor} font-bold tracking-wider text-[9px]`}>{statusLabel}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono pt-1.5 border-t border-zinc-950">
                  <span>ASCII Trajectory Record:</span>
                  <span className="text-zinc-300 font-bold bg-zinc-950 px-1.5 py-0.5 rounded tracking-widest">{dossierConfirmData.trajectory.sparkline}</span>
                </div>
              </div>

              {/* Data security policy disclaimer */}
              <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 flex gap-2.5 text-[9px] text-zinc-400 leading-normal">
                <AlertTriangle size={14} className="text-[#ff001c] shrink-0 animate-pulse mt-0.5" />
                <span>
                  <strong>TACTICAL DATA REGULATION NOTICE:</strong> This dossier snapshot contains certified performance records, encrypted feed comments, and biometric ledger codes under secure jurisdiction. Verification checksum will be appended.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDossierConfirmData(null)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg text-[10px] uppercase font-black tracking-widest cursor-pointer border border-zinc-800 transition-all text-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const cleanAuthor = dossierConfirmData.post.author.replace(/[^a-zA-Z0-9_]/g, "");
                  const p = dossierConfirmData.matchingPlayer;
                  const t = dossierConfirmData.trajectory;
                  const dossierText = `==================================================
        CV ESPORTS PLATFORM • OFFICIAL COMPLIANCE DOSSIER
==================================================
[1] SECURITY PROFILE & ROSTER IDENTITY
--------------------------------------------------
Player Name / IGN:   ${p?.name || "N/A"} (${dossierConfirmData.post.author})
Verified Status:     ${dossierConfirmData.isVerifiedRoster ? "VERIFIED ROSTER MEMBER" : "PENDING"} [Tier: ${dossierConfirmData.authorTier}]
Registration ID:     CV-2026-${p?.jerseyNumber || "99"}
Platform Role:       ${dossierConfirmData.authorRole}
Squad Verification:  ${dossierConfirmData.indicatorText}
Roster Join Date:    ${dossierConfirmData.playerJoinDate}

[2] PERFORMANCE & COMPETITIVE STATS SUMMARY
--------------------------------------------------
Combat K/D Ratio:    ${p?.kd || "N/A"}
Lobby Win Rate:      ${p?.winRate || "N/A"}
Total Battle Kills:  ${p?.totalKills || "N/A"}
Lobby Presence:      ${p?.availabilityStatus || "Available"}
Total Games Played:  ${t.totalGames} Matches

[3] PERFORMANCE TRAJECTORY (LAST 6 MONTHS)
--------------------------------------------------
Months Timeline:     Jan    Feb    Mar    Apr    May    Jun
Combat K/D Path:     ${t.kdTrajectory.map(v => v.toFixed(2)).join("   ")}
Sparkline Activity:  ${t.sparkline}
Trajectory Trend:    ${t.trend}

[4] LATEST INTEL BULLETIN / STRATEGIC POST
--------------------------------------------------
Broadcast Time:      ${new Date(dossierConfirmData.post.timestamp).toLocaleString()}
Intel Category:      ${dossierConfirmData.post.role || "Roster Dispatch"}
Bulletins Feed ID:   bulletin-${dossierConfirmData.post.id}
Tactical Content:
"${dossierConfirmData.post.content}"

==================================================
SECURE COMPLIANCE & TELEMETRY LEDGER • SECURE INTEGRITY
Generated: ${new Date().toLocaleString()} (Local Time)
==================================================`;

                  const blob = new Blob([dossierText], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `CV_Dossier_${cleanAuthor}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);

                  setSystemAlertMessage(`💾 Downloaded official tactical dossier file for ${dossierConfirmData.post.author}!`);
                  addToast(`📋 Official tactical dossier generated and downloaded successfully for ${dossierConfirmData.post.author}!`, "success");
                  setDossierConfirmData(null);
                }}
                className="flex-1 py-2.5 bg-[#E10600] hover:bg-red-700 text-white rounded-lg text-[10px] uppercase font-black tracking-widest cursor-pointer border border-[#E10600]/80 shadow-[0_0_15px_rgba(225,6,0,0.3)] transition-all text-center"
              >
                Export & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 INTERACTIVE LOGIN OVERLAY MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-[#090909] border border-[#141414] rounded-2xl p-8 max-w-sm w-full space-y-6 relative shadow-[0_0_40px_rgba(255,0,0,0.12)]">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-[#E10600] rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
                <Lock className="fill-white text-white shrink-0" size={22} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white leading-none uppercase font-sans">ROSTER LOG IN</h3>
                <p className="text-[10px] text-gray-555 font-mono tracking-widest mt-1 uppercase font-bold">VERIFIED ACCESS</p>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowLoginModal(false);
                setSystemAlertMessage(`🔓 Signed in successfully as ${session.ign}! Checked and verified session permissions.`);
              }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-[#B5B5B5] block uppercase tracking-wider">IN-GAME NAME</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Users size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    defaultValue={session.ign}
                    placeholder="VOID"
                    className="w-full bg-[#040404] border border-[#181818] focus:border-[#E10600] rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-[#B5B5B5] block uppercase tracking-wider">SECURE PASSCODE</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters"
                    className="w-full bg-[#040404] border border-[#181818] focus:border-[#E10600] rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-555">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#E10600]" />
                  Remember Faction IP
                </label>
                <span className="text-[#E10600] hover:underline cursor-pointer font-sans text-xs">Unlock Client access</span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#E10600] text-white font-black text-xs uppercase tracking-widest rounded-lg hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer shadow-[0_0_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] border border-red-500 flex items-center justify-center gap-2"
              >
                <UserCheck size={14} />
                <span>PROCEED TO WARZONE</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🎁 INTERACTIVE SIGN UP WELCOMING MODAL (JOIN CV) */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-[#090909] border border-[#141414] rounded-2xl p-8 max-w-sm w-full space-y-6 relative shadow-[0_0_40px_rgba(255,0,0,0.15)]">
            <button 
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base cursor-pointer"
            >
              ✕
            </button>
            
            {/* Header matches mock-up screenshot perfectly */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-[#E10600] rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(225,6,0,0.4)]">
                <Zap className="fill-white text-white shrink-0" size={22} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white leading-none uppercase font-sans">JOIN CV</h3>
                <p className="text-[10px] text-gray-555 font-mono tracking-widest mt-1 uppercase font-bold">FORGE YOUR LEGEND</p>
              </div>
            </div>

            {/* CONTINUE WITH GOOGLE Button */}
            <button
              onClick={() => {
                setShowSignUpModal(false);
                setSession(prev => ({
                  ...prev,
                  ign: "CV_Google_Member",
                  role: "Recruit",
                  coins: prev.coins + 500,
                  verified: true
                }));
                setSystemAlertMessage("🎉 Registered successfully through Google competitive client!");
              }}
              className="w-full bg-[#040404] border border-[#181818] hover:border-gray-500 text-white font-bold text-[10px] font-mono uppercase tracking-widest rounded-lg py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="text-sm font-serif text-[#E10600] font-black mr-0.5">G</span>
              CONTINUE WITH GOOGLE
            </button>

            {/* OR text matching screenshot lines */}
            <div className="flex items-center font-mono text-[10px] text-gray-650">
              <div className="flex-1 border-t border-gray-850"></div>
              <span className="px-3">OR</span>
              <div className="flex-1 border-t border-gray-850"></div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!signUpIgn.trim()) {
                  setSystemAlertMessage("⚠️ Please specify a valid esports gaming tag.");
                  return;
                }
                setSession(prev => ({
                  ...prev,
                  ign: signUpIgn,
                  coins: prev.coins + 500,
                  role: "Recruit",
                  verified: true,
                  battlePassLevel: 1,
                  battlePassXp: 120
                }));
                setShowSignUpModal(false);
                setSystemAlertMessage(`🎉 Welcome to the Club, ${signUpIgn}! Your +500 Coins starter bounty has been unlocked.`);
              }}
              className="space-y-4 text-left"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-[#B5B5B5] block uppercase tracking-wider">IN-GAME NAME</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Users size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="VOID"
                    value={signUpIgn}
                    onChange={(e) => setSignUpIgn(e.target.value)}
                    className="w-full bg-[#040404] border border-[#181818] focus:border-[#E10600] rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-[#B5B5B5] block uppercase tracking-wider">EMAIL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <span className="text-sm font-sans">✉</span>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="player@cv.gg"
                    className="w-full bg-[#040404] border border-[#181818] focus:border-[#E10600] rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-black text-[#B5B5B5] block uppercase tracking-wider">PASSWORD</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters"
                    className="w-full bg-[#040404] border border-[#181818] focus:border-[#E10600] rounded-lg pl-11 pr-4 py-3 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#E10600] text-white font-black text-xs uppercase tracking-widest rounded-lg hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer shadow-[0_0_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] border border-red-500 flex items-center justify-center gap-2 mt-4"
              >
                <UserCheck size={14} />
                <span>CREATE ACCOUNT</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 WHATSAPP MATCH TELEMETRY DISPATCH SYSTEM */}
      {isWhatsappModalOpen && whatsappTournament && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-[#090909] border border-red-500/20 rounded-2xl p-6 md:p-8 max-w-xl w-full space-y-6 relative shadow-[0_0_50px_rgba(239,68,68,0.12)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsWhatsappModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-800"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-red-650 rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <Send className="text-white shrink-0" size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white leading-none uppercase font-sans">WhatsApp Match Dispatch</h3>
                <p className="text-[10px] text-red-500 font-mono tracking-widest mt-1.5 uppercase font-bold text-left">📲 OFFICIAL CAPTAIN NOTIFICATION</p>
              </div>
            </div>

            <div className="bg-[#111111] p-4 rounded-xl border border-gray-850 space-y-3">
              <h4 className="text-xs font-bold text-white tracking-wider font-mono">⚡ WHY IS THIS REQUIRED?</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Esports check-in guidelines mandate pushing tournament schedule times and contested maps to register-checked team captains. We auto-generate the official secure template to prevent team disqualification.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">
                  TEAM CAPTAIN PHONE NO. (WHATSAPP FORMAT)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 font-mono text-xs">
                    ☎
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. 44712345678 or 1234567890 (include country code)"
                    value={whatsappCaptainNo}
                    onChange={(e) => setWhatsappCaptainNo(e.target.value.replace(/[^0-9+]/g, ""))}
                    className="w-full bg-[#040404] border border-[#181818] focus:border-red-500 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-gray-650 focus:outline-none transition-colors font-mono font-bold"
                  />
                  <p className="text-[9px] text-gray-500 font-mono mt-1">
                    * Leave dry-run empty to send a general WhatsApp link wrapper without specific recipient phone prefill.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">
                    📝 AUTOMATED MESSAGE PREVIEW
                  </label>
                  <span className="text-[9px] font-mono text-red-500 uppercase font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20">
                    Bolding (*text*) enabled
                  </span>
                </div>
                
                <div className="w-full bg-[#020202] border border-[#181818] rounded-lg p-5 font-mono text-xs text-stone-300 space-y-2 rounded-xl text-left select-text relative">
                  <div className="absolute top-2 right-2 text-[9px] text-gray-600 font-black">PREVIEW ONLY</div>
                  <p className="text-red-500 font-bold font-sans">⚔️ *CV eSPORTS MATCH NOTIFICATION DISPATCH* ⚔️</p>
                  <br/>
                  <p>Captain, your team slot has been registered. Match details are provided below:</p>
                  <br/>
                  <p>🏆 <strong>*Tournament*:</strong> {whatsappTournament.title}</p>
                  <p>🎮 <strong>*Game*:</strong> {whatsappTournament.game}</p>
                  <p>📅 <strong>*Start Time*:</strong> <span className="text-red-400 font-extrabold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/40">*{whatsappTournament.schedule}*</span></p>
                  <p>🗺️ <strong>*Map Details*:</strong> <span className="text-red-400 font-extrabold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/40">*{whatsappTournament.mapDetails || "To be decided"}*</span></p>
                  <p>👥 <strong>*Roster*:</strong> {session.ign} (Active Registration)</p>
                  <br/>
                  <p>Rules summary:</p>
                  {whatsappTournament.rules && whatsappTournament.rules.length > 0 ? (
                    <div className="pl-3 py-1 bg-[#090909] rounded border border-[#141414] mt-1 space-y-1">
                      {whatsappTournament.rules.slice(0, 2).map((r, i) => (
                        <p key={i} className="text-stone-405 leading-relaxed">• {r}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-450">• Official competition laws apply.</p>
                  )}
                  <br/>
                  <p className="text-[10px] text-gray-500 uppercase">_Secure Connection established via CV Warzone Protocol._</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWhatsappModalOpen(false)}
                  className="flex-1 py-3.5 bg-gray-900 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-gray-850 active:scale-95 transition-all text-center cursor-pointer border border-gray-800"
                >
                  DISMISS CHECK-IN
                </button>
                
                <a
                  href={`https://api.whatsapp.com/send?phone=${whatsappCaptainNo.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(
                    `⚔️ *CV eSPORTS MATCH NOTIFICATION DISPATCH* ⚔️\n\n` +
                    `Captain, your team slot has been registered. Match details are provided below:\n\n` +
                    `🏆 *Tournament*: ${whatsappTournament.title}\n` +
                    `🎮 *Game*: ${whatsappTournament.game}\n` +
                    `📅 *Start Time*: *${whatsappTournament.schedule}*\n` +
                    `🗺️ *Map Details*: *${whatsappTournament.mapDetails || "To be decided"}*\n` +
                    `👥 *Roster*: ${session.ign} (Active Registration)\n\n` +
                    `Rules summary:\n` +
                    `${whatsappTournament.rules ? whatsappTournament.rules.slice(0, 2).map(r => `• ${r}`).join("\n") : "• Standard check-in applies."}\n\n` +
                    `_Secure Connection established via CV Warzone Protocol._`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setIsWhatsappModalOpen(false);
                    awardXp(50);
                    // Update Captain Record status to DISPATCHED
                    setCaptainRecords(prev => prev.map(rec => {
                      if (rec.tournamentTitle === whatsappTournament.title && rec.status === "PENDING") {
                        return { ...rec, status: "DISPATCHED", captainNo: whatsappCaptainNo.replace(/[^0-9]/g, "") };
                      }
                      return rec;
                    }));
                    setSystemAlertMessage("📡 Match notification successfully queued to WhatsApp Web API!");
                  }}
                  className="flex-1 py-3.5 bg-red-650 hover:bg-red-800 text-white font-black text-xs uppercase tracking-widest rounded-lg hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-500 flex items-center justify-center gap-2 font-mono tracking-wider font-extrabold"
                >
                  <span>LAUNCH WHATSAPP LINK 🚀</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🛡️ INTERACTIVE ESPORTS COMBAT DOSSIER MODAL */}
      {selectedDossierPlayer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-[#090909] border-2 border-red-500/30 rounded-2xl p-6 md:p-8 max-w-2xl w-full space-y-6 relative shadow-[0_0_50px_rgba(239,68,68,0.22)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedDossierPlayer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-base cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-800"
            >
              ✕
            </button>
            
            {/* Header profile info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-16 h-16 bg-red-950 border border-red-500/40 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                  {selectedDossierPlayer.avatar || "👤"}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white leading-none uppercase font-sans flex items-center gap-2">
                    {selectedDossierPlayer.ign}
                  </h3>
                  <span className="text-[9px] text-red-500 font-mono tracking-widest mt-1.5 uppercase font-black block">
                    {selectedDossierPlayer.role || "Elite Roster Member"} // {selectedDossierPlayer.game || "PUBG Mobile"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-sans block mt-1">
                    Real Name: <strong className="text-gray-200">{selectedDossierPlayer.name || "Classified Operator"}</strong>
                  </span>
                </div>
              </div>

              {/* STAT HIGHLIGHT */}
              <div className="flex gap-3 text-center">
                <div className="bg-black/80 px-3 py-2 rounded-lg border border-zinc-850 min-w-[70px]">
                  <span className="text-[8px] text-zinc-500 block font-mono">K/D RATIO</span>
                  <strong className="text-red-500 text-sm font-black font-mono">{selectedDossierPlayer.kd || "4.15"}</strong>
                </div>
                <div className="bg-[#1a080a] px-3 py-2 rounded-lg border border-red-950/40 min-w-[70px]">
                  <span className="text-[8px] text-red-400 block font-mono">TIER LEVEL</span>
                  <strong className="text-red-500 text-xs font-bold font-mono uppercase">{selectedDossierPlayer.tier || "MASTER"}</strong>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Skill metrics */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black font-mono tracking-widest text-[#B5B5B5] uppercase border-b border-zinc-900 pb-1">
                  TACTICAL PROWESS FACTOR
                </h4>
                
                <div className="space-y-3 font-mono">
                  {/* Metric 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400">🎯 HEADSHOT ACCURACY</span>
                      <strong className="text-white">{(parseFloat(selectedDossierPlayer.kd || "4") * 6 + 10).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className="bg-gradient-to-r from-red-650 to-red-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, parseFloat(selectedDossierPlayer.kd || "4") * 6 + 10)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400">🔥 RECOIL COMPENSATOR</span>
                      <strong className="text-white">{(75 + parseFloat(selectedDossierPlayer.kd || "4") * 3).toFixed(0)}%</strong>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className="bg-gradient-to-r from-red-650 to-red-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, 75 + parseFloat(selectedDossierPlayer.kd || "4") * 3)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400">⚡ CLUTCH COEFFICIENT</span>
                      <strong className="text-white">{(68 + parseFloat(selectedDossierPlayer.kd || "4") * 4).toFixed(0)}%</strong>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className="bg-gradient-to-r from-red-650 to-red-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, 68 + parseFloat(selectedDossierPlayer.kd || "4") * 4)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400">🛡️ COGNITIVE ROTATIONS</span>
                      <strong className="text-white">{(80 + parseFloat(selectedDossierPlayer.kd || "4") * 2).toFixed(0)}%</strong>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className="bg-gradient-to-r from-red-650 to-red-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, 80 + parseFloat(selectedDossierPlayer.kd || "4") * 2)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111] p-3 rounded-lg border border-zinc-850 space-y-2">
                  <span className="text-[9px] text-zinc-550 font-mono block">ROSTER ACCOLADES & HONOURS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedDossierPlayer.achievements || ["Pro Medal Champion", "Tier 1 Verified", "Aggressive Attacker"]).map((a: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-950/20 text-red-400 border border-red-950/40 text-[9px] font-mono rounded">
                        🏆 {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Combat history chart */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black font-mono tracking-widest text-[#B5B5B5] uppercase border-b border-zinc-900 pb-1">
                  HISTORICAL CORE SCORE PROGRESSION
                </h4>

                <div className="h-44 bg-black/60 rounded-xl border border-zinc-850 p-2 flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart 
                      data={[
                        { match: "Round 1", Score: 20 },
                        { match: "Round 2", Score: Math.floor(parseFloat(selectedDossierPlayer.kd || "4") * 8 + 12) },
                        { match: "Round 3", Score: Math.floor(parseFloat(selectedDossierPlayer.kd || "4") * 6 + 16) },
                        { match: "Round 4", Score: Math.floor(parseFloat(selectedDossierPlayer.kd || "4") * 9 + 10) },
                        { match: "Round 5", Score: Math.floor(parseFloat(selectedDossierPlayer.kd || "4") * 10 + Math.random() * 5) }
                      ]}
                      margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d1d1d" />
                      <XAxis dataKey="match" stroke="#666" fontSize={8} />
                      <YAxis stroke="#666" fontSize={8} />
                      <Tooltip contentStyle={{ backgroundColor: "black", borderColor: "#333", fontSize: "10px", color: "white" }} />
                      <Line type="monotone" dataKey="Score" stroke="#ff001c" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <span className="text-[8px] text-zinc-500 font-mono block text-center uppercase">PREDICTIVE SCORE PROGRESS OVER PAST 5 ROUNDED TICKS</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono justify-between bg-black/40 p-3 rounded-lg border border-zinc-900">
                  <div>
                    <span className="text-zinc-500 text-[8px] block uppercase">SUGGESTED COMBAT ACTION</span>
                    <span className="text-white font-bold leading-relaxed">Direct Challenger duel match</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDossierPlayer(null);
                        setActiveTab("passport");
                        setSystemAlertMessage(`🛂 Accessing permanent verified Esports Passport system dossier...`);
                      }}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold rounded text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      🛂 PASSPORT
                    </button>
                    {selectedDossierPlayer.ign !== "You (Crimson Vipers)" && (
                      <button
                        onClick={() => {
                          handleChallengePlayer(selectedDossierPlayer.ign);
                          setSelectedDossierPlayer(null);
                          setActiveTab("tdm");
                        }}
                        className="px-3 py-1.5 bg-red-650 hover:bg-red-800 text-white font-bold rounded text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        CHALLENGE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏅 SQUAD MEMBER PROFILE MODAL */}
      {selectedSquadMemberProfile && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-[#0b0b0d] border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto custom-scrollbar space-y-6 relative shadow-[0_0_50px_rgba(255,0,31,0.2)]">
            <button 
              onClick={() => setSelectedSquadMemberProfile(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-base cursor-pointer hover:bg-white/5 p-1.5 rounded transition-all border border-transparent hover:border-zinc-800"
            >
              ✕
            </button>
            
            {/* Header / Brand */}
            <div className="flex items-center gap-4 text-left border-b border-zinc-900 pb-4 text-white">
              <div className="w-12 h-12 bg-[#ff001c] rounded flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(255,0,28,0.4)]">
                <span className="text-2xl">{selectedSquadMemberProfile.avatar || "👤"}</span>
              </div>
              <div className="flex-1">
                <span className="text-[9px] text-[#ff001c] font-mono tracking-[0.25em] block uppercase font-black">CV ELITE ROSTER</span>
                <h3 className="text-xl font-black tracking-widest text-white leading-none uppercase font-orbitron mt-0.5">
                  {selectedSquadMemberProfile.ign}
                </h3>
              </div>
              
              {/* Jersey Number design badge */}
              <div className="flex flex-col items-center justify-center px-4 py-2 bg-zinc-950 rounded border border-zinc-900 select-none">
                <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase">JERSEY</span>
                <span className="text-2xl font-black font-orbitron text-[#ff001c] leading-none mt-1">
                  #{selectedSquadMemberProfile.jerseyNumber || "99"}
                </span>
              </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-4 text-zinc-300">
              {/* Role and Real Name block */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">ASSIGNED OFFICIAL ROLE</span>
                  <span className="text-white text-xs font-black font-mono block mt-1.5 uppercase text-red-500 leading-relaxed">
                    🛡️ {selectedSquadMemberProfile.role}
                  </span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">OPERATIVE REAL NAME</span>
                  <span className="text-zinc-300 text-xs font-bold font-sans block mt-1.5 leading-relaxed">
                    👤 {selectedSquadMemberProfile.name}
                  </span>
                </div>
              </div>

              {/* Bio Block */}
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900/60 space-y-1.5 animate-fade-in">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wide">COMPETITIVE BIOGRAPHY</span>
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  {selectedSquadMemberProfile.bio || "No tactical record available."}
                </p>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#111111]/40 p-3 rounded-xl border border-zinc-900 font-mono text-xs">
                <div className="text-center p-2 bg-zinc-950/40 rounded border border-zinc-900/40">
                  <span className="text-zinc-500 text-[8px] block uppercase">BATTLE KD</span>
                  <strong className="text-white text-sm block mt-0.5">{selectedSquadMemberProfile.kd}</strong>
                </div>
                <div className="text-center p-2 bg-zinc-950/40 rounded border border-zinc-900/40">
                  <span className="text-zinc-500 text-[8px] block uppercase">ACTIVE GAME</span>
                  <strong className="text-white text-[10px] block mt-1 uppercase text-ellipsis overflow-hidden whitespace-nowrap">{selectedSquadMemberProfile.game}</strong>
                </div>
                <div className="col-span-2 sm:col-span-1 text-center p-2 bg-zinc-950/40 rounded border border-zinc-900/40 font-mono">
                  <span className="text-zinc-500 text-[8px] block uppercase">STATUS</span>
                  <strong className="text-emerald-500 text-[10px] block mt-1 uppercase tracking-wider">● ONLINE</strong>
                </div>
              </div>

              {/* Dynamic Badges Section */}
              <div className="space-y-2.5">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider text-left">ROSTER STATUS BADGES</span>
                <motion.div 
                  className="grid grid-cols-1 gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.05
                      }
                    }
                  }}
                >
                  {getDynamicBadges(selectedSquadMemberProfile).map((badge, idx) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <motion.div 
                        key={idx} 
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, y: 8 },
                          visible: { 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            transition: {
                              type: "spring",
                              stiffness: 140,
                              damping: 14
                            }
                          }
                        }}
                        className={`relative group/badge flex items-start gap-3.5 p-3 rounded-lg border ${badge.borderClass} ${badge.bgClass} transition-all duration-300 hover:border-zinc-700/80 cursor-help`}
                      >
                        <div className={`p-2 rounded bg-zinc-950/80 ${badge.colorClass} shrink-0 border border-zinc-900`}>
                          <BadgeIcon size={14} className="shrink-0" />
                        </div>
                        <div className="text-left space-y-0.5 flex-1 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`${badge.colorClass} text-[10px] font-black uppercase font-orbitron tracking-widest`}>
                              {badge.title}
                            </span>
                            <Info size={10} className="text-zinc-600 group-hover/badge:text-zinc-400 transition-colors shrink-0" />
                          </div>
                          <p className="text-[10px] text-zinc-400 font-sans leading-normal font-medium">
                            {badge.desc}
                          </p>
                        </div>

                        {/* Interactive Tooltip Card on Hover */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 p-3 bg-black border border-zinc-900 text-zinc-300 text-[10px] rounded-lg opacity-0 scale-95 origin-bottom group-hover/badge:opacity-100 group-hover/badge:scale-100 transition-all duration-200 shadow-2xl z-50 space-y-1">
                          <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5 mb-1.5">
                            <span className="w-1.5 h-1.5 bg-[#ff001c] rounded-full shrink-0" />
                            <span className="text-zinc-400 font-mono tracking-wider uppercase font-black text-[9px]">EARNING CRITERIA</span>
                          </div>
                          <p className="font-sans text-zinc-300 leading-normal text-left">
                            {badge.criteria}
                          </p>
                          {/* Chevron bottom arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Achievements list */}
              {selectedSquadMemberProfile.achievements && selectedSquadMemberProfile.achievements.length > 0 && (
                <div className="space-y-1.5 animate-fade-in">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">OFFICIAL LAURELS & VALORS</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSquadMemberProfile.achievements.map((item: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-[#ff001f]/5 text-zinc-300 border border-[#ff001c]/20 text-[10px] font-mono rounded">
                        🏆 {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Timeline Section */}
              <div className="space-y-3 border-t border-zinc-900 pt-3">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider text-left">HUB ACTIVITY TIMELINE</span>
                <div className="relative pl-3 border-l border-zinc-900/90 ml-1.5 space-y-3.5 pt-1">
                  {getPlayerActivityTimeline(selectedSquadMemberProfile).map((act) => {
                    const ActIcon = act.icon;
                    return (
                      <div key={act.id} className="relative group/timeline text-left">
                        {/* Dot indicator */}
                        <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center transition-all duration-300 group-hover/timeline:border-[#ff001c] group-hover/timeline:bg-[#ff001f]/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 transition-all duration-300 group-hover/timeline:bg-[#ff001c]" />
                        </div>
                        
                        {/* Content block */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-zinc-200 text-[10px] font-black uppercase font-mono tracking-wide flex items-center gap-1.5 group-hover/timeline:text-[#ff001c] transition-colors">
                              <ActIcon size={12} className={`${act.colorClass} shrink-0`} />
                              {act.title}
                            </span>
                            <span className="text-[9px] text-zinc-550 font-mono shrink-0 select-none">
                              {act.time}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                            {act.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 pt-2 text-xs font-mono justify-end border-t border-zinc-900">
              <button
                onClick={() => setSelectedSquadMemberProfile(null)}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-350 hover:text-white font-bold rounded uppercase tracking-wider transition-all cursor-pointer border border-zinc-800"
              >
                CLOSE DOSSIER
              </button>
              <button
                onClick={() => {
                  setSelectedSquadMemberProfile(null);
                  setSelectedDossierPlayer(selectedSquadMemberProfile);
                }}
                className="px-5 py-2.5 bg-[#ff001c] hover:bg-[#d00018] text-white font-bold rounded uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,31,0.3)] hover:shadow-[0_0_20px_rgba(255,0,28,0.5)] border border-[#ff001c]"
              >
                🔍 DEEP TACTICAL INTEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 ROSTER HISTORY & AUDIT LOGS MODAL */}
      <AnimatePresence>
        {isRosterHistoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 z-50 text-left"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0b0d] border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar space-y-6 relative shadow-[0_0_60px_rgba(255,0,31,0.25)] flex flex-col"
            >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff001c]/10 text-[#ff001c] border-[#ff001c]/20 rounded flex items-center justify-center">
                  <History size={18} />
                </div>
                <div>
                  <span className="text-[9px] text-[#ff001c] font-mono tracking-[0.25em] block uppercase font-black">SYSTEM AUDIT TRAIL</span>
                  <h3 className="text-lg md:text-xl font-black tracking-wider text-white uppercase font-orbitron">
                    CV ELITES MAIN SQUAD AUDIT LOGGER
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setIsRosterHistoryModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm cursor-pointer hover:bg-white/5 px-2.5 py-1.5 rounded transition-all border border-zinc-850"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Main Interactive Workstation Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto flex-1 pr-1 font-sans">
              
              {/* Top Row: Full Width Search & Filter bar design */}
              <div className="lg:col-span-12">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3 shrink-0">
                  <span className="text-[9px] text-[#ff001c] font-mono block uppercase font-bold tracking-wider">FILTER COMPLIANCE CODES & AUDIT SEARCH</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* General Search Field */}
                    <div>
                      <label className="text-[8px] text-zinc-400 font-mono block uppercase mb-1 font-bold">General Search</label>
                      <input 
                        type="text"
                        placeholder="Search player, notes or author..."
                        value={rosterHistorySearch}
                        onChange={(e) => setRosterHistorySearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-[#ff001c] transition-colors"
                      />
                    </div>
                    {/* Specific Filter by Player IGN or Captain Name */}
                    <div>
                      <label className="text-[8px] text-zinc-400 font-mono block uppercase mb-1 font-bold">Player IGN / Captain Name Filter</label>
                      <input 
                        type="text"
                        placeholder="Filter specific IGN or Captain..."
                        value={rosterHistorySpecificSearch}
                        onChange={(e) => setRosterHistorySpecificSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-[#ff001c] transition-colors"
                      />
                    </div>
                    {/* Filter Type selective dropdown */}
                    <div>
                      <label className="text-[8px] text-zinc-400 font-mono block uppercase mb-1 font-bold">Event Operation</label>
                      <select 
                        value={rosterHistoryFilter}
                        onChange={(e) => setRosterHistoryFilter(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#ff001c]/80 transition-colors cursor-pointer"
                      >
                        <option value="ALL">All Event Operations</option>
                        <option value="ADD">Roster Additions (ADD)</option>
                        <option value="REMOVE">Roster Removals (REMOVE)</option>
                        <option value="ROLE_UPDATE">Role Updates (ROLE)</option>
                        <option value="JERSEY_UPDATE">Jersey Modifications (JERSEY)</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Pills Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-900/60">
                    <div className="flex flex-wrap gap-1.5">
                      {["ALL", "ADD", "REMOVE", "ROLE_UPDATE", "JERSEY_UPDATE"].map((pill) => {
                        const isActive = rosterHistoryFilter === pill;
                        const labelMap: any = {
                          ALL: "ALL EVENTS",
                          ADD: "ADDITIONS",
                          REMOVE: "REMOVALS",
                          ROLE_UPDATE: "ROLES",
                          JERSEY_UPDATE: "JERSEY #'s"
                        };
                        return (
                          <button
                            key={pill}
                            onClick={() => setRosterHistoryFilter(pill)}
                            className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider transition-all border font-bold cursor-pointer ${
                              isActive 
                                ? "bg-[#ff001f]/10 text-[#ff001c] border-[#ff001c]/30" 
                                : "bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:text-white"
                            }`}
                          >
                            {labelMap[pill]}
                          </button>
                        );
                      })}
                    </div>

                    {(rosterHistorySearch || rosterHistorySpecificSearch || rosterHistoryFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setRosterHistorySearch("");
                          setRosterHistorySpecificSearch("");
                          setRosterHistoryFilter("ALL");
                        }}
                        className="text-[9.5px] font-mono text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer font-bold uppercase"
                      >
                        Reset All Filters 🔄
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Left Column: Logs list & Filter dashboard (7/12 wide) */}
              <div className="lg:col-span-7 space-y-4 flex flex-col">
                
                {/* Audit log scroll pool */}
                <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1.5 custom-scrollbar flex-1 min-h-[35vh]">
                  {(() => {
                    const filtered = rosterHistoryList.filter(item => {
                      const term = rosterHistorySearch.toLowerCase();
                      const specTerm = rosterHistorySpecificSearch.toLowerCase();

                      const matchesGeneral = !term || 
                                           item.playerIgn.toLowerCase().includes(term) || 
                                           item.playerName.toLowerCase().includes(term) ||
                                           item.notes.toLowerCase().includes(term) ||
                                           item.captainIgn.toLowerCase().includes(term);

                      const matchesSpecific = !specTerm || 
                                            item.playerIgn.toLowerCase().includes(specTerm) || 
                                            item.captainIgn.toLowerCase().includes(specTerm);

                      const matchesFilter = rosterHistoryFilter === "ALL" || item.actionType === rosterHistoryFilter;
                      return matchesGeneral && matchesSpecific && matchesFilter;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="py-12 text-center bg-zinc-950 p-6 rounded-xl border border-dashed border-zinc-900 space-y-2">
                          <AlertTriangle className="mx-auto text-zinc-600" size={24} />
                          <p className="text-xs text-zinc-400 font-mono">NO ROSTER INCIDENTS CORRESPONDING TO PARAMS.</p>
                          <button 
                            onClick={() => { setRosterHistorySearch(""); setRosterHistorySpecificSearch(""); setRosterHistoryFilter("ALL"); }}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 text-white rounded font-mono text-[9px] border border-zinc-800 transition-colors"
                          >
                            RESET FILTERS 🔄
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3.5">
                        <AnimatePresence initial={false}>
                          {filtered.map((item, idx) => {
                            // Styling attributes mapping based on actionType
                            let opBadgeColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
                            let opLabel = "ADDITION";
                            let statusIcon = <UserCheck size={11} className="text-emerald-400" />;

                            if (item.actionType === "REMOVE") {
                              opBadgeColor = "text-[#ff001c] border-red-500/20 bg-red-500/5";
                              opLabel = "DEPATRIATED REMOVAL";
                              statusIcon = <Trash2 size={11} className="text-[#ff001c]" />;
                            } else if (item.actionType === "ROLE_UPDATE") {
                              opBadgeColor = "text-sky-400 border-sky-500/20 bg-sky-500/5";
                              opLabel = "ROLE SHIFT";
                              statusIcon = <Shield size={11} className="text-sky-400" />;
                            } else if (item.actionType === "JERSEY_UPDATE") {
                              opBadgeColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
                              opLabel = "JERSEY ASSIGN";
                              statusIcon = <Trophy size={11} className="text-amber-400" />;
                            }

                            return (
                              <motion.div 
                                key={item.id} 
                                initial={{ opacity: 0, x: -30, y: 15 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="group bg-zinc-950 p-4 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-all duration-300 relative space-y-2.5 shadow-sm"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  {/* Left Section: Avatar, Name, Type */}
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-xl bg-zinc-900 w-8 h-8 rounded border border-zinc-800 flex items-center justify-center select-none group-hover:scale-105 transition-transform">
                                      {item.avatar || "👤"}
                                    </span>
                                    <div>
                                      <h4 className="text-xs font-black font-mono tracking-tight text-zinc-100 flex items-center gap-1.5 leading-none">
                                        <span>{item.playerIgn}</span>
                                        <span className="text-[10px] text-zinc-500 font-sans font-medium">({item.playerName})</span>
                                      </h4>
                                      
                                      {/* Action Type Tag */}
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${opBadgeColor} font-extrabold flex items-center gap-1`}>
                                          {statusIcon}
                                          {opLabel}
                                        </span>
                                        <span className="text-[9px] text-zinc-550 font-mono">#{item.id}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Section: Timestamp */}
                                  <div className="text-right flex flex-col items-end gap-1 font-mono">
                                    <span className="text-[9px] text-zinc-550">{item.timestamp}</span>
                                    <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-850 rounded text-[9px] text-zinc-400 font-extrabold tracking-tight flex items-center gap-1">
                                      👑 BY {item.captainIgn}
                                    </span>
                                  </div>
                                </div>

                                {/* Value Transition block (if old vs new applies) */}
                                {(item.oldValue || item.newValue) && (
                                  <div className="bg-zinc-900/60 px-3 py-2 rounded-lg border border-zinc-900 text-[10px] font-mono flex items-center gap-2 text-zinc-300">
                                    {item.oldValue ? (
                                      <>
                                        <span className="text-zinc-500 line-through truncate max-w-[150px]">{item.oldValue}</span>
                                        <span className="text-[#ff001c] font-black select-none">➔</span>
                                      </>
                                    ) : (
                                      <span className="text-emerald-500 font-black">NEW ASSIGNMENT:</span>
                                    )}
                                    <span className="text-white font-extrabold bg-[#ff001f]/5 px-1.5 py-0.5 rounded border border-[#ff001c]/15 truncate max-w-[220px]">
                                      {item.newValue}
                                    </span>
                                  </div>
                                )}

                                {/* Captain tactical note */}
                                <div className="text-xs text-zinc-400 font-sans bg-zinc-900/20 p-2.5 rounded border border-zinc-900/40">
                                  <span className="text-[8px] text-zinc-550 font-mono block uppercase mb-0.5 font-bold">TACTICAL ACTION MEMO:</span>
                                  <p className="leading-relaxed">{item.notes}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: Roster Incident Simulation Dispatch Station (5/12 wide) */}
              <div className="lg:col-span-5 relative">
                <form 
                  onSubmit={handleCommitRosterChange}
                  className="bg-zinc-950 p-5 rounded-xl border border-zinc-900 space-y-4 h-full flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    {/* Simulator Header */}
                    <div className="border-b border-zinc-900 pb-2.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-950/20 border border-red-500/30 rounded text-[9px] text-red-400 font-bold tracking-wider font-mono uppercase mb-1">
                        <span className="w-1.5 h-1.5 bg-[#ff001c] rounded-full animate-pulse" />
                        CAPTAIN TERMINAL PANEL
                      </div>
                      <h4 className="text-xs font-black font-orbitron tracking-wider text-white uppercase block">
                        SPAWN TRIAL ROSTER CHANGE
                      </h4>
                      <p className="text-[10px] text-zinc-450 font-sans">
                        Simulate custom roster compliance journal events in real-time.
                      </p>
                    </div>

                    {/* Choose Transaction Type */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-zinc-500 font-mono block uppercase">OPERATION ACTION CODE</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { val: "ADD", lbl: "+ ADDITION" },
                          { val: "REMOVE", lbl: "- REMOVAL" },
                          { val: "ROLE_UPDATE", lbl: "⚡ ROLE SPEC" },
                          { val: "JERSEY_UPDATE", lbl: "🥋 JERSEY" }
                        ].map((btn) => (
                          <button
                            type="button"
                            key={btn.val}
                            onClick={() => {
                              setSimRosterActionType(btn.val as any);
                              // Auto populate templates optionally depending on selection
                              if (btn.val === "ADD") {
                                setSimRosterOldValue("");
                                setSimRosterNewValue("Combat Specialist");
                              } else if (btn.val === "REMOVE") {
                                setSimRosterOldValue("Primary Assaulter");
                                setSimRosterNewValue("");
                              } else if (btn.val === "ROLE_UPDATE") {
                                setSimRosterOldValue("Co-Scout");
                                setSimRosterNewValue("Lead Backline Scout");
                              } else if (btn.val === "JERSEY_UPDATE") {
                                setSimRosterOldValue("Jersey #13");
                                setSimRosterNewValue("Jersey #77");
                              }
                            }}
                            className={`px-2 py-1.5 text-[9px] font-mono tracking-wider font-bold rounded border text-center transition-all cursor-pointer ${
                              simRosterActionType === btn.val
                                ? "bg-red-600/15 border-red-600/50 text-red-400"
                                : "bg-zinc-900 border-zinc-850 hover:border-zinc-700 text-zinc-350"
                            }`}
                          >
                            {btn.lbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Player Info layout */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Player IGN */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase flex items-center gap-1">
                          IGN TAG <span className="text-red-500">*</span>
                        </span>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. CV_Lethal"
                          value={simRosterPlayerIgn}
                          onChange={(e) => setSimRosterPlayerIgn(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                      
                      {/* Real Name */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">REAL NAME</span>
                        <input 
                          type="text"
                          placeholder="e.g. Liam Foster"
                          value={simRosterPlayerName}
                          onChange={(e) => setSimRosterPlayerName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Avatar Icon Selector and Author Captain */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Emoji Selector */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">AVATAR SPEC</span>
                        <select 
                          value={simRosterAvatar}
                          onChange={(e) => setSimRosterAvatar(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-red-600 transition-colors"
                        >
                          <option value="🦊">🦊 Fox</option>
                          <option value="🦖">🦖 Rex</option>
                          <option value="👑">👑 Crown</option>
                          <option value="🎯">🎯 Sniper</option>
                          <option value="⚔️">⚔️ Swords</option>
                          <option value="👻">👻 Ghost</option>
                          <option value="❄️">❄️ Ice</option>
                          <option value="🔥">🔥 Flame</option>
                        </select>
                      </div>

                      {/* Author Captain Selection */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">AUTHORING CAPTAIN</span>
                        <select 
                          value={simRosterCaptain}
                          onChange={(e) => setSimRosterCaptain(e.target.value)}
                          className="w-full bg-zinc-900 border border-[#ff001c]/25 rounded px-2 py-1 text-xs text-[#ff001c] font-bold font-mono focus:outline-none focus:border-red-600 transition-colors"
                        >
                          <option value="CV_Slayer_IGL">CV_Slayer_IGL</option>
                          <option value="CV_Tactical_Coach">CV_Tactical_Coach</option>
                          <option value="CV_Alpha_Spectre">CV_Alpha_Spectre</option>
                        </select>
                      </div>
                    </div>

                    {/* Old and New Values */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">PREVIOUS VALUE (OLD)</span>
                        <input 
                          type="text"
                          placeholder="e.g. Support"
                          value={simRosterOldValue}
                          onChange={(e) => setSimRosterOldValue(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">NEW SPEC (NEW VALUE)</span>
                        <input 
                          type="text"
                          placeholder="e.g. Lead Attacker"
                          value={simRosterNewValue}
                          onChange={(e) => setSimRosterNewValue(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Tactical memo Description */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase">TACTICAL MEMO / TRANSITION NOTES</span>
                      <textarea 
                        rows={2}
                        placeholder="Explain rationale for roster update compliance clearance..."
                        value={simRosterNotes}
                        onChange={(e) => setSimRosterNotes(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Form Trigger button */}
                  <div className="pt-3 border-t border-zinc-900 mt-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] uppercase font-black tracking-wider rounded transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer filter hover:brightness-110"
                    >
                      <UserCheck size={12} />
                      <span>COMMIT OFFICIAL JOURNAL ENTRY ➔</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Modal Bottom Footer bar */}
            <div className="flex justify-between items-center border-t border-zinc-900 pt-3 md:pt-4 text-[10px] text-zinc-500 font-mono shrink-0">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>ACTIVE SECURED LOG CORRELATION VERIFIED</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset current audit log session to initial standards?")) {
                    setRosterHistoryList([
                      {
                        id: "RH-3809",
                        timestamp: "2026-06-11 14:32 UTC",
                        actionType: "ADD",
                        playerIgn: "CV_Rex_Viper",
                        playerName: "Rex Harrison",
                        avatar: "🦖",
                        newValue: "Assaulter / Roamer",
                        captainIgn: "CV_Slayer_IGL",
                        notes: "Acquired via mid-season transfer window from Zenith Gaming. Absolute powerhouse added."
                      },
                      {
                        id: "RH-3805",
                        timestamp: "2026-06-09 09:15 UTC",
                        actionType: "ROLE_UPDATE",
                        playerIgn: "CV_Slayer_IGL",
                        playerName: "Tinashe 'Slayer'",
                        avatar: "👑",
                        oldValue: "Assaulter / Entry",
                        newValue: "Team Captain & IGL",
                        captainIgn: "CV_Tactical_Coach",
                        notes: "Appointed as main strategist for squad leadership, coordination, and maps execution."
                      },
                      {
                        id: "RH-3792",
                        timestamp: "2026-06-05 18:40 UTC",
                        actionType: "ADD",
                        playerIgn: "CV_Storm_Snipe",
                        playerName: "Alex Mercer",
                        avatar: "🎯",
                        newValue: "Main Roster Sniper",
                        captainIgn: "CV_Slayer_IGL",
                        notes: "Promoted from competitive league junior division. Incredible 4.85 bullet precision."
                      },
                      {
                        id: "RH-3755",
                        timestamp: "2026-06-01 11:20 UTC",
                        actionType: "JERSEY_UPDATE",
                        playerIgn: "CV_Valkyrie",
                        playerName: "Sarah Jenkins",
                        avatar: "⚔️",
                        oldValue: "Jersey #17",
                        newValue: "Jersey #44",
                        captainIgn: "CV_Slayer_IGL",
                        notes: "Jersey number reassignment approved to honor previous team franchise legend."
                      },
                      {
                        id: "RH-3691",
                        timestamp: "2026-05-28 16:15 UTC",
                        actionType: "ROLE_UPDATE",
                        playerIgn: "CV_Ghost_07",
                        playerName: "Marcus Vance",
                        avatar: "👻",
                        oldValue: "Tactical Scout",
                        newValue: "Lead Strategist & Scout",
                        captainIgn: "CV_Slayer_IGL",
                        notes: "Promoted to primary point operator for elite tier rotation management."
                      },
                      {
                        id: "RH-3642",
                        timestamp: "2026-05-20 10:05 UTC",
                        actionType: "REMOVE",
                        playerIgn: "CV_Blaze_Ex",
                        playerName: "Kyle Broflovski",
                        avatar: "🔥",
                        oldValue: "Reserve Sub / Frag",
                        captainIgn: "CV_Tactical_Coach",
                        notes: "Mutually terminated contract. Transferred list to free agency pool."
                      }
                    ]);
                    setSystemAlertMessage("♻️ Roster history audit session records reset to default.");
                  }
                }}
                className="text-[9px] bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-850 cursor-pointer px-2 py-1 rounded transition-colors uppercase font-bold"
              >
                RESET JOURNAL RECORDS
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* 📊 TACTICAL HEAT MAP MODAL */}
      {isTacticalModalOpen && (
        <TacticalBreakdownModal
          isOpen={isTacticalModalOpen}
          onClose={() => setIsTacticalModalOpen(false)}
          playerIgn={tacticalPlayerIgn}
        />
      )}

      {/* 🖼️ BULLET BULLETIN SCREENSHOT PREVIEW LIGHTBOX */}
      {/* ⚠️ REPORT POST MODAL */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md w-full bg-[#0D0D0D] border border-red-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col"
          >
            <div className="p-4 border-b border-zinc-850 flex justify-between items-center bg-zinc-950/80">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                <span className="text-xs font-black tracking-widest text-white uppercase font-mono">
                  Report Bulletin Post
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportingPost(null);
                  setReportReason("");
                  setReportCustomReason("");
                }}
                className="text-gray-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-red-950/20 border border-red-500/10 rounded-xl p-3 space-y-1">
                <p className="text-[11px] font-black text-red-400 font-mono uppercase tracking-wider">
                  Target Bulletin Post:
                </p>
                <p className="text-[10px] text-zinc-400 font-mono italic">
                  Posted by <span className="text-zinc-200 font-bold">@{reportingPost.author}</span> ({reportingPost.role})
                </p>
                <p className="text-[10px] text-zinc-500 font-mono line-clamp-2">
                  "{reportingPost.content}"
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 font-mono uppercase tracking-wider block">
                  Select Violation Reason:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Unfair Tactical Advantage (Cheating/Hacks)",
                    "Sabotaged Scrim Routes (False Intel)",
                    "Inappropriate Language / Verbal Toxicity",
                    "Spam or Advertisement Content",
                    "Custom Reason"
                  ].map((reason) => {
                    const isSelected = reportReason === reason;
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setReportReason(reason)}
                        className={`w-full p-2.5 rounded-lg border text-left text-[10px] font-mono transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-red-950/30 text-white border-red-500"
                            : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-zinc-850"
                        }`}
                      >
                        <span>{reason}</span>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-red-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {reportReason === "Custom Reason" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 font-mono uppercase tracking-wider block">
                    Describe details:
                  </label>
                  <textarea
                    rows={3}
                    value={reportCustomReason}
                    onChange={(e) => setReportCustomReason(e.target.value)}
                    placeholder="Enter explicit details regarding this violation..."
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white font-mono focus:border-red-500/50 focus:outline-none resize-none placeholder-zinc-600"
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-850 bg-zinc-950/80 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setReportingPost(null);
                  setReportReason("");
                  setReportCustomReason("");
                }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-mono text-[9px] font-black uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reportReason || (reportReason === "Custom Reason" && !reportCustomReason.trim())}
                onClick={() => {
                  const finalReason = reportReason === "Custom Reason" ? reportCustomReason : reportReason;
                  const newReport = {
                    id: "rep_" + Date.now(),
                    reporter: session.ign,
                    reported: reportingPost.author,
                    reason: `[Bulletin Post Violation] ${finalReason}`,
                    timestamp: "Just now"
                  };

                  // Load existing reports
                  let currentReports = [];
                  const saved = localStorage.getItem("cv_pending_reports");
                  if (saved) {
                    try {
                      currentReports = JSON.parse(saved);
                    } catch (e) {
                      // ignore
                    }
                  }
                  if (!Array.isArray(currentReports) || currentReports.length === 0) {
                    currentReports = [
                      { id: "rep1", reporter: "toxic_buster_99", reported: "cv_hacker_z", reason: "Wall-hack proxy trigger", timestamp: "10m ago" },
                      { id: "rep2", reporter: "TeamLiquid_Cap", reported: "noob_spray", reason: "Host sabotage in scrim server", timestamp: "24m ago" },
                      { id: "rep3", reporter: "CV_Slayer_IGL", reported: "flame_master_0", reason: "Verbal toxicity in global TDM lobby", timestamp: "1h ago" }
                    ];
                  }

                  // Add new report
                  currentReports.unshift(newReport);
                  localStorage.setItem("cv_pending_reports", JSON.stringify(currentReports));

                  // Trigger update to CVManagementPortal if open, or show confirmation toast
                  setSystemAlertMessage(`🚨 Reported @${reportingPost.author}'s post for: "${finalReason}". Added to security hub review queue.`);
                  awardXp(5);

                  // Close and clean
                  setReportingPost(null);
                  setReportReason("");
                  setReportCustomReason("");
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-[9px] font-black uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Flag size={10} />
                <span>Submit Security Report</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {expandedPostImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full bg-[#0D0D0D] border border-red-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col"
          >
            <div className="p-4 border-b border-zinc-850 flex justify-between items-center bg-zinc-950/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black tracking-widest text-white uppercase font-mono">
                  {expandedPostImage.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedPostImage(null)}
                className="text-gray-400 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="relative bg-black flex items-center justify-center p-2 overflow-hidden max-h-[70vh]">
              <img
                src={expandedPostImage.src}
                alt={expandedPostImage.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain rounded border border-zinc-900"
              />
            </div>
            
            <div className="p-4 border-t border-zinc-850 bg-zinc-950/80 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                TACTICAL INTELLIGENCE PROTOCOL LEVEL-3 SECURE TRANSMISSION
              </p>
              <div className="flex gap-2">
                <a
                  href={expandedPostImage.src}
                  download="CV_Tactical_Intel_Recon.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] font-black uppercase tracking-wider rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink size={10} />
                  <span>Open Full Resource</span>
                </a>
                <button
                  type="button"
                  onClick={() => setExpandedPostImage(null)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-[9px] font-black uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER DETAILS */}
      <footer className="relative z-10 bg-[#0D0D0D] border-t border-gray-900 p-6 text-center text-xs text-gray-500 select-none">
        <div className="max-w-[1700px] mx-auto space-y-3">
          <p className="font-mono text-[10px] text-gray-650 tracking-wider">
            ⚡ CV PLATFORM OVERLAYS STABILITY GUARANTEE CERTIFICATION
          </p>
          <p>© 2026 CV eSports Hub Inc. All gameplay records, in-game coins economy, and strategic map layouts are fully copyrighted.</p>
          <div className="flex justify-center gap-4 text-[10px] text-gray-600 font-mono">
            <span>Server Time check: 12:40 UTC</span>
            <span>•</span>
            <span>Privacy Agreement Policy</span>
            <span>•</span>
            <span>Verified Creator terms</span>
          </div>
        </div>
      </footer>

      {/* 📊 DEDICATED PLAYER COMPARISON SIDE PANEL */}
      <PlayerComparisonSidePanel
        isOpen={isComparePanelOpen}
        onClose={() => setIsComparePanelOpen(false)}
        comparePlayerA={comparePlayerA}
        setComparePlayerA={setComparePlayerA}
        comparePlayerB={comparePlayerB}
        setComparePlayerB={setComparePlayerB}
        onAlertMessage={(msg) => setSystemAlertMessage(msg)}
      />

      {/* FLOATING ACTION TRIGGER COMPANION FOR PLAYER COMPARISON */}
      {comparePlayerA && comparePlayerB && comparePlayerA !== comparePlayerB && !isComparePanelOpen && isComparisonWidgetVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 bg-[#0c0d12]/95 backdrop-blur-md border border-red-500/40 p-3.5 pr-4 rounded-2xl shadow-[0_4px_30px_rgba(239,68,68,0.25)] font-mono text-zinc-300"
        >
          <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-[#ff001c]/50 flex items-center justify-center text-red-500 animate-pulse">
            <Activity size={18} />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">COMPARISON READY</div>
            <div className="text-[11px] text-white font-bold tracking-tight mt-0.5 uppercase">
              {comparePlayerA} vs {comparePlayerB}
            </div>
          </div>
          <button
            onClick={() => setIsComparePanelOpen(true)}
            className="p-1.5 px-3 bg-[#E10600] hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-wider rounded-lg cursor-pointer transition-all shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.4)] ml-1"
          >
            COMPARE TACTICS ⚡
          </button>
          <button
            onClick={() => setIsComparisonWidgetVisible(false)}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
            title="Hide Comparison Widget"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* 🔮 SCI-FI RESPONSIVENESS AND VISIBILITY CORESIGNAL INSPECTION SYSTEM */}
      <CVVisibilityInspector />

    </div>
  );
}

// Visual layout titles helpers
function Heading({ children, size = "xl" }: { children: ReactNode; size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" }) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl font-black text-red-600 leading-tight tracking-tighter"
  };
  return <h2 className={`${sizeClasses[size]} font-extrabold`}>{children}</h2>;
}

function SectionTitle({ text, sub }: { text: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-1 pb-2 border-b border-zinc-900/40"
    >
      <h3 className="text-xs lg:text-sm font-black tracking-widest font-orbitron text-white flex items-center gap-2 uppercase">
        <span className="w-1.5 h-1.5 bg-[#ff001f] inline-block shadow-[0_0_8px_rgba(255,0,31,0.8)] shrink-0" />
        {text}
      </h3>
      {sub && <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{sub}</p>}
    </motion.div>
  );
}
