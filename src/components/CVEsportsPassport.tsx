import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ShieldCheck,
  Award,
  Trophy,
  User,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Star,
  Users,
  Flame,
  Activity,
  Phone,
  Target,
  History,
  TrendingUp,
  Share2,
  FileText,
  Video,
  ExternalLink,
  Crown,
  Heart,
  MessageSquare,
  Compass,
  Zap,
  Grid,
  Map,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Twitch,
  Youtube,
  Twitter
} from "lucide-react";

// Passport Data Types
export interface PassportDetails {
  username: string;
  playerID: string;
  pubgIgn: string;
  region: string;
  country: string;
  currentTeam: string;
  currentSquad: string;
  verified: boolean;
  avatarUrl: string;
  bannerStyle: string;
  equippedTitle: string;
  twitch?: string;
  youtube?: string;
  twitter?: string;
}

export interface TrophyItem {
  id: string;
  event: string;
  date: string;
  placement: string;
  team: string;
  tier: "championship" | "regional" | "arena" | "special";
  icon: string;
  color: string;
}

export interface CareerMilestone {
  id: string;
  date: string;
  event: string;
  type: "team" | "transfer" | "tournament" | "scrim" | "achievement";
  description: string;
}

interface CVEsportsPassportProps {
  session: {
    ign: string;
    role: string;
    coins: number;
    battlePassXp: number;
    battlePassLevel: number;
    verified: boolean;
  };
  onUpdateSession: (updated: any) => void;
  showNotification: (msg: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export default function CVEsportsPassport({
  session,
  onUpdateSession,
  showNotification,
  onNavigateToTab
}: CVEsportsPassportProps) {
  // Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<"identity" | "records" | "timeline" | "reputation" | "resume" | "vault">("identity");

  // Share Resume states
  const [isSharedView, setIsSharedView] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Customizer controls
  const [isEditingCard, setIsEditingCard] = useState<boolean>(false);

  // Background Theme
  const [passportTheme, setPassportTheme] = useState<string>(() => {
    return localStorage.getItem("cv_passport_theme") || "cyber-pulse";
  });

  // Level & XP (Persistent)
  const [passportLevel, setPassportLevel] = useState<number>(() => {
    const saved = localStorage.getItem("cv_passport_level");
    return saved ? parseInt(saved) : 5;
  });
  const [passportXp, setPassportXp] = useState<number>(() => {
    const saved = localStorage.getItem("cv_passport_xp");
    return saved ? parseInt(saved) : 650;
  });

  // Core Identity State (Persistent)
  const [identity, setIdentity] = useState<PassportDetails>(() => {
    const saved = localStorage.getItem("cv_passport_identity");
    if (saved) return JSON.parse(saved);
    return {
      username: session.ign || "CV_Viper_Pro",
      playerID: "CV-89209-X9",
      pubgIgn: session.ign || "CV・VIPER",
      region: "Southern Africa",
      country: "Zimbabwe",
      currentTeam: "Crimson Vipers Pro",
      currentSquad: "Squad Hydra Team Alpha",
      verified: session.verified ?? true,
      avatarUrl: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&q=80&w=150",
      bannerStyle: "bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border-red-500/35",
      equippedTitle: "CV Legend",
      twitch: "twitch.tv/cv_viper_pro",
      youtube: "youtube.com/c/CrimsonVipersEsports",
      twitter: "x.com/cv_viper_pro"
    };
  });

  // Reputation & Sportsmanship States
  const [reputationLevel, setReputationLevel] = useState<number>(() => {
    const saved = localStorage.getItem("cv_passport_rep_level");
    return saved ? parseInt(saved) : 4;
  });
  const [reliabilityScore, setReliabilityScore] = useState<number>(() => {
    const saved = localStorage.getItem("cv_passport_reliability");
    return saved ? parseInt(saved) : 98; // Percentage out of 100
  });
  const [communityRating, setCommunityRating] = useState<number>(() => {
    const saved = localStorage.getItem("cv_passport_rating");
    return saved ? parseFloat(saved) : 4.9; // Rating out of 5
  });

  // Trophies / Championships Cabinet
  const [trophies, setTrophies] = useState<TrophyItem[]>(() => {
    const saved = localStorage.getItem("cv_passport_trophies");
    if (saved) return JSON.parse(saved);
    return [
      { id: "tr_1", event: "Harare Grand Championship Cup", date: "Jan 12, 2026", placement: "1st Place (Gold Medalist)", team: "Crimson Vipers Pro", tier: "championship", icon: "🏆", color: "from-amber-400 via-yellow-300 to-amber-500" },
      { id: "tr_2", event: "Southern Africa Region Qualifier", date: "Mar 05, 2026", placement: "2nd Place (Silver Core)", team: "Crimson Vipers Pro", tier: "regional", icon: "🌍", color: "from-sky-400 via-indigo-300 to-sky-500" },
      { id: "tr_3", event: "CV TDM Arena Grandmasters", date: "May 20, 2026", placement: "1st Place Elite", team: "Squad Hydra Team Alpha", tier: "arena", icon: "⚔️", color: "from-red-500 via-pink-400 to-rose-600" },
      { id: "tr_4", event: "Founders Inaugural Arena Clash", date: "Dec 18, 2025", placement: "3rd Place Podium", team: "Viper Recruit Roster", tier: "special", icon: "⭐", color: "from-emerald-400 via-teal-300 to-emerald-500" }
    ];
  });

  // History & transfers timeline
  const [historyTimeline, setHistoryTimeline] = useState<CareerMilestone[]>(() => {
    const saved = localStorage.getItem("cv_passport_timeline");
    if (saved) return JSON.parse(saved);
    return [
      { id: "ml_1", date: "Dec 01, 2025", event: "Platform Registration Complete", type: "transfer", description: "Created permanent eSports Passport ID. Started as Rookie Recruit." },
      { id: "ml_2", date: "Dec 15, 2025", event: "Joined Community Team: Viper Recruit Roster", type: "team", description: "Drafted as support fragger under Captain Alpha." },
      { id: "ml_3", date: "Dec 18, 2025", event: "Founders Inaugural Arena Clash Competition", type: "tournament", description: "Secured 3rd place podium. Awarded MVP honors in Semifinal match." },
      { id: "ml_4", date: "Jan 10, 2026", event: "Transferred to Crimson Vipers Pro", type: "transfer", description: "Promoted to official pro league roster after standout performance in scrim sessions." },
      { id: "ml_5", date: "Jan 12, 2026", event: "1st Place: Harare Grand Championship Cup", type: "tournament", description: "Secured absolute tournament victory. Earned permanent Trophy ID #tr_1." },
      { id: "ml_6", date: "Feb 22, 2026", event: "Reached TDM Arena Diamond Tier Elite", type: "achievement", description: "Achieved highest Arena Rank of Gladiator Diamond with an active 12-win streak." }
    ];
  });

  // Achievement Vault
  const [achievements, setAchievements] = useState<any[]>(() => {
    const saved = localStorage.getItem("cv_passport_achievements");
    if (saved) return JSON.parse(saved);
    return [
      { id: "ach_win_1", title: "First Win", description: "Secure your first competitive tournament victory.", dateEarned: "Dec 18, 2025", icon: "🥇", points: 150, category: "Competitive" },
      { id: "ach_kills_100", title: "100 Kills", description: "Accumulate 100 total eliminations across TDM or Scrims.", dateEarned: "Jan 04, 2026", icon: "🔥", points: 200, category: "In-Game" },
      { id: "ach_arena_champ", title: "Arena Champion", description: "Reach Gladiator Division in the TDM Arena.", dateEarned: "Feb 22, 2026", icon: "⚔️", points: 300, category: "Arena" },
      { id: "ach_scrim_vet", title: "Scrim Veteran", description: "Complete 20 official scheduled custom lobby scrims.", dateEarned: "Mar 14, 2026", icon: "🎯", points: 250, category: "Scrims" },
      { id: "ach_mvp_coll", title: "MVP Collector", description: "Earn 15 Official Match MVP citations.", dateEarned: "Apr 02, 2026", icon: "🏅", points: 400, category: "Competitive" },
      { id: "ach_regional", title: "Regional Champion", description: "Compete and place in regional qualifier tournaments.", dateEarned: "May 10, 2026", icon: "🌍", points: 500, category: "Special" },
      { id: "ach_cv_legend", title: "CV Legend", description: "Reach Level 10 Passport or Level 20 Seasonal Battle Pass.", dateEarned: "June 20, 2026", icon: "👑", points: 600, category: "Prestige" }
    ];
  });

  // Media clips & highlights showcase
  const [mediaItems, setMediaItems] = useState<any[]>(() => {
    const saved = localStorage.getItem("cv_passport_media");
    if (saved) return JSON.parse(saved);
    return [
      { id: "md_1", title: "1v4 Clutch vs Elite Squad", type: "highlight", link: "https://youtube.com/watch?v=mock-clip", desc: "Clutched the 4th zone rotation with a grenade double-kill.", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=250" },
      { id: "md_2", title: "TDM Arena 15-Kills Sweep", type: "screenshot", link: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=250", desc: "Highest personal kill rating in a single 4v4 arena match.", thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=250" }
    ];
  });

  const [newMediaTitle, setNewMediaTitle] = useState<string>("");
  const [newMediaLink, setNewMediaLink] = useState<string>("");
  const [newMediaDesc, setNewMediaDesc] = useState<string>("");

  // Statistics
  const [stats, setStats] = useState<any>(() => {
    const saved = localStorage.getItem("cv_passport_stats");
    if (saved) return JSON.parse(saved);
    return {
      totalMatches: 148,
      wins: 89,
      losses: 52,
      draws: 7,
      kills: 624,
      assists: 184,
      mvps: 22,
      tournamentsEntered: 12,
      tournamentsWon: 3,
      scrimsPlayed: 45,
      arenaMatchesPlayed: 84,
      arenaSeasonsCompleted: 3,
      // Arena division specifics
      arenaPoints: 4620,
      highestRank: "Gladiator Master",
      highestWinStreak: 12,
      tdm1v1: { matches: 20, wins: 15, losses: 5, mvp: 10 },
      tdm2v2: { matches: 24, wins: 16, losses: 8, mvp: 6 },
      tdm4v4: { matches: 40, wins: 28, losses: 12, mvp: 16 },
      regionalRanking: "Top #15 Southern Zone"
    };
  });

  // Store and sync passport data to local storage (only if NOT in shared view)
  useEffect(() => {
    if (isSharedView) return;
    try {
      localStorage.setItem("cv_passport_theme", passportTheme);
      localStorage.setItem("cv_passport_level", String(passportLevel));
      localStorage.setItem("cv_passport_xp", String(passportXp));
      localStorage.setItem("cv_passport_identity", JSON.stringify(identity));
      localStorage.setItem("cv_passport_rep_level", String(reputationLevel));
      localStorage.setItem("cv_passport_reliability", String(reliabilityScore));
      localStorage.setItem("cv_passport_rating", String(communityRating));
      localStorage.setItem("cv_passport_trophies", JSON.stringify(trophies));
      localStorage.setItem("cv_passport_timeline", JSON.stringify(historyTimeline));
      localStorage.setItem("cv_passport_achievements", JSON.stringify(achievements));
      localStorage.setItem("cv_passport_media", JSON.stringify(mediaItems));
      localStorage.setItem("cv_passport_stats", JSON.stringify(stats));
    } catch (e) {
      console.error("Local storage synchronization failed:", e);
    }
  }, [passportTheme, passportLevel, passportXp, identity, reputationLevel, reliabilityScore, communityRating, trophies, historyTimeline, achievements, mediaItems, stats, isSharedView]);

  // Load and parse shared passport parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("view_passport") === "true") {
        setIsSharedView(true);
        setActiveSubTab("resume");
        
        // Retrieve and override all user stats and details
        setIdentity({
          username: params.get("username") || "CV_Viper_Pro",
          playerID: params.get("playerID") || "CV-89209-X9",
          pubgIgn: params.get("pubgIgn") || "CV・VIPER",
          region: params.get("region") || "Southern Africa",
          country: params.get("country") || "Zimbabwe",
          currentTeam: params.get("currentTeam") || "Crimson Vipers Pro",
          currentSquad: params.get("currentSquad") || "Squad Hydra Team Alpha",
          verified: params.get("verified") === "true",
          avatarUrl: params.get("avatarUrl") || "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&q=80&w=150",
          bannerStyle: params.get("bannerStyle") || "bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border-red-500/35",
          equippedTitle: params.get("equippedTitle") || "CV Legend",
          twitch: params.get("twitch") || "",
          youtube: params.get("youtube") || "",
          twitter: params.get("twitter") || ""
        });
        
        if (params.get("level")) setPassportLevel(parseInt(params.get("level")!));
        if (params.get("xp")) setPassportXp(parseInt(params.get("xp")!));
        if (params.get("repLevel")) setReputationLevel(parseInt(params.get("repLevel")!));
        if (params.get("reliability")) setReliabilityScore(parseInt(params.get("reliability")!));
        if (params.get("rating")) setCommunityRating(parseFloat(params.get("rating")!));
        
        setStats((prev: any) => ({
          ...prev,
          totalMatches: parseInt(params.get("totalMatches") || "148"),
          wins: parseInt(params.get("wins") || "89"),
          kills: parseInt(params.get("kills") || "624"),
          assists: parseInt(params.get("assists") || "184"),
          mvps: parseInt(params.get("mvps") || "22"),
          tournamentsEntered: parseInt(params.get("tournaments") || "12"),
          regionalRanking: params.get("regionalRanking") || "Top #15 Southern Zone",
          arenaPoints: parseInt(params.get("arenaPoints") || "4620"),
          highestRank: params.get("highestRank") || "Gladiator Master"
        }));

        showNotification("🛂 Loaded shared public Esports Passport. Welcome!");
      }
    } catch (e) {
      console.error("Failed parsing shared passport query params:", e);
    }
  }, []);

  // Helper to generate a unique public URL containing all esports stats
  const getShareableUrl = () => {
    try {
      const origin = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();
      params.set("view_passport", "true");
      params.set("username", identity.username);
      params.set("playerID", identity.playerID);
      params.set("pubgIgn", identity.pubgIgn);
      params.set("region", identity.region);
      params.set("country", identity.country);
      params.set("currentTeam", identity.currentTeam);
      params.set("currentSquad", identity.currentSquad);
      params.set("verified", identity.verified ? "true" : "false");
      params.set("equippedTitle", identity.equippedTitle);
      params.set("avatarUrl", identity.avatarUrl);
      params.set("bannerStyle", identity.bannerStyle);
      params.set("level", String(passportLevel));
      params.set("xp", String(passportXp));
      params.set("repLevel", String(reputationLevel));
      params.set("reliability", String(reliabilityScore));
      params.set("rating", String(communityRating));
      params.set("totalMatches", String(stats.totalMatches));
      params.set("wins", String(stats.wins));
      params.set("kills", String(stats.kills));
      params.set("assists", String(stats.assists));
      params.set("mvps", String(stats.mvps));
      params.set("tournaments", String(stats.tournamentsEntered));
      params.set("regionalRanking", String(stats.regionalRanking));
      params.set("arenaPoints", String(stats.arenaPoints));
      params.set("highestRank", String(stats.highestRank));
      if (identity.twitch) params.set("twitch", identity.twitch);
      if (identity.youtube) params.set("youtube", identity.youtube);
      if (identity.twitter) params.set("twitter", identity.twitter);
      return `${origin}?${params.toString()}`;
    } catch (e) {
      return window.location.href;
    }
  };

  // Action helper to copy shareable URL to clipboard
  const handleCopyShareableUrl = () => {
    const url = getShareableUrl();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showNotification("🔗 Unique shareable Esports Passport URL copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      showNotification("⚠️ Clipboard API not supported, please copy it manually from the display field.");
    }
  };

  // Action helper to draw a high-definition certified esports resume card on HTML5 Canvas and trigger direct download
  const handleDownloadPng = async () => {
    setIsGeneratingPng(true);
    showNotification("🎨 Initializing Canvas Graphics rendering engine...");
    
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not construct 2D graphics rendering context.");

      // 1. Fill Background Gradient (Deep metallic charcoal with red hues)
      const grad = ctx.createLinearGradient(0, 0, 1200, 630);
      grad.addColorStop(0, "#08080a");
      grad.addColorStop(0.5, "#130f0f");
      grad.addColorStop(1, "#050507");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 630);

      // 2. Draw Futuristic Grid Matrix Overlay
      ctx.strokeStyle = "rgba(239, 68, 68, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < 1200; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 630);
        ctx.stroke();
      }
      for (let y = 0; y < 630; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1200, y);
        ctx.stroke();
      }

      // 3. Draw Outer Tech Framing Border (Red neon line + dark padding frame)
      ctx.strokeStyle = "#FF001C";
      ctx.lineWidth = 3;
      ctx.strokeRect(15, 15, 1170, 600);

      ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(22, 22, 1156, 586);

      // Draw corner brackets for tech-look
      ctx.fillStyle = "#FF001C";
      const bracketSize = 30;
      // Top-Left corner bracket
      ctx.fillRect(10, 10, bracketSize, 6);
      ctx.fillRect(10, 10, 6, bracketSize);
      // Top-Right corner bracket
      ctx.fillRect(1200 - bracketSize - 10, 10, bracketSize, 6);
      ctx.fillRect(1200 - 16, 10, 6, bracketSize);
      // Bottom-Left corner bracket
      ctx.fillRect(10, 630 - 16, 6, bracketSize);
      ctx.fillRect(10, 630 - 16, bracketSize, 6);
      // Bottom-Right corner bracket
      ctx.fillRect(1200 - bracketSize - 10, 630 - 16, bracketSize, 6);
      ctx.fillRect(1200 - 16, 630 - bracketSize - 10, 6, bracketSize);

      // 4. Header Section Title & Subtitle
      ctx.fillStyle = "#FF001C";
      ctx.font = "bold 20px monospace, sans-serif";
      ctx.fillText("🛂 CRIMSON VIPERS ESPORTS DIGITAL AUTHENTICATOR", 50, 62);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 12px monospace, sans-serif";
      ctx.fillText("OFFICIAL COMPETITIVE PASSPORT & RESUME CARD | LICENSE ID: " + identity.playerID, 50, 85);

      // Horizontal tech separator line
      ctx.strokeStyle = "rgba(239, 68, 68, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 105);
      ctx.lineTo(1150, 105);
      ctx.stroke();

      // 5. Draw Player Avatar Frame
      const avatarX = 70;
      const avatarY = 140;
      const avatarW = 180;
      const avatarH = 180;

      // Draw Avatar slots
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(avatarX, avatarY, avatarW, avatarH);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(avatarX, avatarY, avatarW, avatarH);

      // Load avatar image asynchronously with CORS fallback support
      const loadedImg = await new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = identity.avatarUrl;
      });

      if (loadedImg) {
        ctx.drawImage(loadedImg, avatarX + 4, avatarY + 4, avatarW - 8, avatarH - 8);
      } else {
        // Fallback: draw vector placeholder
        ctx.fillStyle = "rgba(239, 68, 68, 0.12)";
        ctx.fillRect(avatarX + 4, avatarY + 4, avatarW - 8, avatarH - 8);
        ctx.fillStyle = "#FF001C";
        ctx.beginPath();
        ctx.arc(avatarX + avatarW / 2, avatarY + avatarH / 2 - 15, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(avatarX + avatarW / 2, avatarY + avatarH / 2 + 45, 45, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw "VERIFIED PLAYER" badge overlay under avatar
      ctx.fillStyle = "#FF001C";
      ctx.fillRect(avatarX, avatarY + avatarH + 15, avatarW, 30);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🛡️ CERTIFIED PLAYER", avatarX + avatarW / 2, avatarY + avatarH + 34);
      ctx.textAlign = "left"; // Reset

      // 6. Draw Player Core Credentials next to Avatar
      const infoX = 280;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText(identity.username.toUpperCase(), infoX, 175);

      ctx.fillStyle = "#FF001C";
      ctx.font = "bold 14px monospace, sans-serif";
      ctx.fillText(`👑 ${identity.equippedTitle} | ELITE LEVEL ${passportLevel}`, infoX, 205);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px sans-serif";
      ctx.fillText(`PUBG IGN:  `, infoX, 240);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace, sans-serif";
      ctx.fillText(identity.pubgIgn, infoX + 85, 240);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px sans-serif";
      ctx.fillText(`TEAM SQUAD: `, infoX, 268);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`${identity.currentTeam} (${identity.currentSquad})`, infoX + 105, 268);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px sans-serif";
      ctx.fillText(`REGION ZONE: `, infoX, 296);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`${identity.region} (🇿🇼 ${identity.country})`, infoX + 110, 296);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px sans-serif";
      ctx.fillText(`REPUTATION: `, infoX, 324);
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 13px monospace, sans-serif";
      ctx.fillText(`★ LEVEL ${reputationLevel}.0 SPORTSMANSHIP (${reliabilityScore}% ACC)`, infoX + 100, 324);

      // 6.5 Draw Social Channels for Scouts
      ctx.fillStyle = "#FF001C";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.fillText(`🌐 SCOUT REVIEW CHANNELS`, infoX, 362);

      // Twitch
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "11px sans-serif";
      ctx.fillText(`Twitch: `, infoX, 386);
      ctx.fillStyle = identity.twitch ? "#a991d4" : "#52525b";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.fillText(identity.twitch ? identity.twitch.replace("https://", "").replace("www.", "") : "Not connected", infoX + 50, 386);

      // YouTube
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "11px sans-serif";
      ctx.fillText(`YouTube: `, infoX, 410);
      ctx.fillStyle = identity.youtube ? "#ff8888" : "#52525b";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.fillText(identity.youtube ? identity.youtube.replace("https://", "").replace("www.", "") : "Not connected", infoX + 60, 410);

      // X (Twitter)
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "11px sans-serif";
      ctx.fillText(`X (Twitter): `, infoX, 434);
      ctx.fillStyle = identity.twitter ? "#8ecdf8" : "#52525b";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.fillText(identity.twitter ? identity.twitter.replace("https://", "").replace("www.", "") : "Not connected", infoX + 70, 434);

      // 7. Right Panel: Scoreboard Box (Competitive Metrics Box)
      const scoreboardX = 640;
      const scoreboardY = 140;
      const scoreboardW = 490;
      const scoreboardH = 410;

      // Draw scoreboard background container
      ctx.fillStyle = "rgba(12, 12, 14, 0.92)";
      ctx.fillRect(scoreboardX, scoreboardY, scoreboardW, scoreboardH);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(scoreboardX, scoreboardY, scoreboardW, scoreboardH);

      // Scoreboard header
      ctx.fillStyle = "rgba(239, 68, 68, 0.08)";
      ctx.fillRect(scoreboardX + 2, scoreboardY + 2, scoreboardW - 4, 40);
      ctx.fillStyle = "#FF001C";
      ctx.font = "bold 13px monospace, sans-serif";
      ctx.fillText("⚔️ COMPETITIVE SCOREBOARD STAT MATRIX", scoreboardX + 20, scoreboardY + 26);

      // Stat Matrix Rows
      const statsToDraw = [
        { label: "TOTAL COMPLETED MATCHES", value: `${stats.totalMatches} matches` },
        { label: "WINS VICTORY (PERCENTAGE)", value: `${stats.wins} wins (${((stats.wins / stats.totalMatches) * 100).toFixed(0)}% WR)` },
        { label: "TOTAL CAREER KILLS (ELIMS)", value: `${stats.kills} elims` },
        { label: "OFFICIAL MVP CITATIONS", value: `${stats.mvps} MVPs` },
        { label: "ATTENDANCE RELIABILITY RATE", value: `${reliabilityScore}% reliable` },
        { label: "TDM ARENA CURRENT SCORE", value: `${stats.arenaPoints} RP` },
        { label: "TDM HIGHEST ARENA DIVISION", value: `${stats.highestRank}` },
        { label: "REGIONAL PLACEMENT RANKING", value: `${stats.regionalRanking}` }
      ];

      let rowY = scoreboardY + 70;
      statsToDraw.forEach((st) => {
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "11px monospace, sans-serif";
        ctx.fillText(st.label, scoreboardX + 20, rowY);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px monospace, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(st.value, scoreboardX + scoreboardW - 20, rowY);
        ctx.textAlign = "left"; // Reset

        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scoreboardX + 20, rowY + 12);
        ctx.lineTo(scoreboardX + scoreboardW - 20, rowY + 12);
        ctx.stroke();

        rowY += 40;
      });

      // 8. Footer Section (With Barcode & Authenticator Stamp)
      const barcodeX = 70;
      const barcodeY = 510;
      
      // Draw mock barcode
      let currX = barcodeX;
      const barcodeHeights = 32;
      const linePatterns = [2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4];
      linePatterns.forEach((width, index) => {
        ctx.fillStyle = index % 2 === 0 ? "#ffffff" : "transparent";
        ctx.fillRect(currX, barcodeY, width * 2, barcodeHeights);
        currX += width * 2 + 1;
      });

      ctx.fillStyle = "#71717a";
      ctx.font = "9px monospace, sans-serif";
      ctx.fillText(`AUTHENTICATION BARCODE SECURED BY CRIMSON AUTOMATION | PLAYER LICENSE: ${identity.playerID}`, barcodeX, barcodeY + 45);

      ctx.fillStyle = "#52525b";
      ctx.font = "bold 11px monospace, sans-serif";
      ctx.fillText("CV SECURITY PROTOCOLS ONLINE. HIGH PERFORMANCE ESPORTS RESUME STANDARDS COMPLIANT.", 70, 582);

      // Draw custom holographic approved stamp
      const stampX = 540;
      const stampY = 500;
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(stampX, stampY, 32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(239, 68, 68, 0.04)";
      ctx.beginPath();
      ctx.arc(stampX, stampY, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 8px monospace, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CV SECURED", stampX, stampY - 5);
      ctx.font = "bold 8px monospace, sans-serif";
      ctx.fillText("APPROVED", stampX, stampY + 7);
      ctx.font = "5.5px monospace, sans-serif";
      ctx.fillText("CV CERT v2.5", stampX, stampY + 16);
      ctx.textAlign = "left"; // Reset

      // 9. Download the generated data URL
      const dataUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `CV_Esports_Resume_${identity.username}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      earnPassportXp(150, "Downloaded Certified Resume Graphics Card");
      showNotification("🖼️ Certified Esports Resume PNG Image downloaded successfully!");
    } catch (e: any) {
      console.error(e);
      showNotification(`⚠️ Canvas rendering failed: ${e.message || e}`);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  // Earn Passport XP Helper
  const earnPassportXp = (amount: number, reason: string) => {
    let nextXp = passportXp + amount;
    let nextLevel = passportLevel;
    let leveledUp = false;

    while (nextXp >= 1000) {
      nextXp -= 1000;
      nextLevel += 1;
      leveledUp = true;
    }

    setPassportXp(nextXp);
    if (nextLevel !== passportLevel) {
      setPassportLevel(nextLevel);
      showNotification(`🎉 PASSPORT LEVEL UP! Reached level ${nextLevel}! Exclusive cosmetics unlocked.`);
    } else {
      showNotification(`⚡ +${amount} Passport XP earned: ${reason}`);
    }
  };

  // Add Custom Media highlight
  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim() || !newMediaLink.trim()) {
      showNotification("⚠️ Please fill in all required fields!");
      return;
    }

    const item = {
      id: "md_" + Date.now(),
      title: newMediaTitle,
      type: "highlight",
      link: newMediaLink,
      desc: newMediaDesc || "My competitive showcase clip.",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=250"
    };

    setMediaItems(prev => [item, ...prev]);
    setNewMediaTitle("");
    setNewMediaLink("");
    setNewMediaDesc("");
    earnPassportXp(120, "Uploaded Career Media Clip");
    showNotification("📸 Showcase clip successfully pinned to your Esports Passport!");
  };

  // Simulate reputation boost
  const triggerReputationAction = (type: "sportsmanship" | "attendance" | "positive" | "completed") => {
    let repAdd = 0.1;
    let reliAdd = 1;
    let msg = "";

    if (type === "sportsmanship") {
      msg = "Vouched for Good Sportsmanship by competitors!";
      repAdd = 0.1;
      reliAdd = 1;
    } else if (type === "attendance") {
      msg = "Registered 100% Reliable Attendance at tournament lobby check-in!";
      repAdd = 0.15;
      reliAdd = 2;
    } else if (type === "positive") {
      msg = "Received Positive Community Behavior Commendations!";
      repAdd = 0.2;
      reliAdd = 1;
    } else if (type === "completed") {
      msg = "Finished active scrimmage with no leaves/AFK!";
      repAdd = 0.05;
      reliAdd = 1;
    }

    setCommunityRating(prev => Math.min(5.0, parseFloat((prev + repAdd).toFixed(2))));
    setReliabilityScore(prev => Math.min(100, prev + reliAdd));
    
    if (communityRating >= 4.9 && reputationLevel < 5) {
      setReputationLevel(prev => Math.min(5, prev + 1));
      showNotification("🛡️ Reputation Level Up! Your profile is highly verified.");
    }

    earnPassportXp(100, msg);
  };

  // Preset Avatar options
  const AVATARS = [
    "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=150"
  ];

  // Preset Banners
  const BANNERS = [
    { name: "Crimson Eclipse", value: "bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border-red-500/35" },
    { name: "Galactic Void", value: "bg-gradient-to-r from-purple-950 via-zinc-900 to-blue-950 border-purple-500/30" },
    { name: "Golden Valor", value: "bg-gradient-to-r from-yellow-950 via-zinc-900 to-amber-950 border-yellow-500/30" },
    { name: "Cyberpunk Grid", value: "bg-gradient-to-r from-[#071311] via-zinc-900 to-[#122b27] border-emerald-500/30" }
  ];

  // Preset Titles
  const TITLES = [
    "Rookie",
    "Challenger",
    "Warrior",
    "Veteran",
    "Champion",
    "Elite",
    "Arena King",
    "MVP Hunter",
    "CV Legend"
  ];

  // Theme styling helpers
  const getThemeClass = () => {
    switch (passportTheme) {
      case "emerald-matrix":
        return {
          bg: "from-zinc-950 via-emerald-950/20 to-zinc-950",
          border: "border-emerald-500/20",
          textAccent: "text-emerald-400",
          accentColor: "emerald",
          btnColor: "bg-emerald-600 hover:bg-emerald-500"
        };
      case "neon-purple":
        return {
          bg: "from-zinc-950 via-purple-950/20 to-zinc-950",
          border: "border-purple-500/20",
          textAccent: "text-purple-400",
          accentColor: "purple",
          btnColor: "bg-purple-600 hover:bg-purple-500"
        };
      case "cyber-pulse":
      default:
        return {
          bg: "from-[#0a0707] via-red-950/15 to-black",
          border: "border-red-500/20",
          textAccent: "text-red-500",
          accentColor: "red",
          btnColor: "bg-red-650 hover:bg-red-700"
        };
    }
  };

  const theme = getThemeClass();

  // Simulate copy profile link
  const handleShareProfile = () => {
    const profileLink = `https://cv.esports/passport/${identity.playerID}`;
    navigator.clipboard?.writeText?.(profileLink);
    showNotification(`🔗 Professional Esports Resume Link copied to clipboard! Share on WhatsApp or Twitter.`);
  };

  return (
    <div id="cv-esports-passport-root" className={`bg-gradient-to-b ${theme.bg} p-4 md:p-6 rounded-3xl border ${theme.border} space-y-6 text-zinc-100 shadow-2xl`}>
      
      {/* PUBLIC PORTAL SHARING BANNER */}
      {isSharedView && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#120a0a] to-red-950/40 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[9.5px] font-mono font-black text-red-500 uppercase tracking-widest block">
              🛂 PUBLIC PORTAL VIEWER MODE
            </span>
            <p className="text-xs text-zinc-200 leading-snug">
              You are viewing the shared public esports passport profile of <strong className="text-white text-sm font-mono font-black">{identity.username}</strong>. This profile carries verified eSports credentials.
            </p>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, "", window.location.pathname);
              setIsSharedView(false);
              showNotification("🔄 Returned to your personalized eSports dashboard.");
            }}
            className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-mono font-black text-[10px] rounded-lg border border-red-500/20 uppercase transition-all whitespace-nowrap cursor-pointer"
          >
            Go to My Dashboard ⎋
          </button>
        </div>
      )}
      
      {/* 1. PASSPORT DECK TOP CONTROLS */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-${theme.accentColor}-500/10 ${theme.textAccent} border border-${theme.accentColor}-500/30`}>
              Permanent Esports Passport
            </span>
            <span className="text-zinc-600 font-mono text-[10px]">VERIFIED DIGITAL ID v2.5</span>
          </div>
          <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase flex items-center gap-2">
            🛂 CV ESPORTS DIGITAL PASSPORT
          </h2>
          <p className="text-xs text-zinc-400">
            Your comprehensive esports resume, competitive stats, reputation score, and verified championship records.
          </p>
        </div>

        {/* Theme Changer Selector */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-zinc-800/80">
          <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase pl-1 pr-2">Theme:</span>
          <button
            onClick={() => setPassportTheme("cyber-pulse")}
            className={`w-4 h-4 rounded-full bg-red-600 border ${passportTheme === "cyber-pulse" ? "border-white scale-125 shadow-lg" : "border-transparent"}`}
            title="Crimson Eclipse"
          />
          <button
            onClick={() => setPassportTheme("neon-purple")}
            className={`w-4 h-4 rounded-full bg-purple-600 border ${passportTheme === "neon-purple" ? "border-white scale-125 shadow-lg" : "border-transparent"}`}
            title="Galactic Void"
          />
          <button
            onClick={() => setPassportTheme("emerald-matrix")}
            className={`w-4 h-4 rounded-full bg-emerald-600 border ${passportTheme === "emerald-matrix" ? "border-white scale-125 shadow-lg" : "border-transparent"}`}
            title="Matrix Cyber"
          />
        </div>
      </div>

      {/* 2. DYNAMIC DIGITAL PLAYER ID CARD (GLASSMORPHISM CARD CHASSIS) */}
      <div className="relative">
        <div className={`rounded-3xl overflow-hidden border border-zinc-800 bg-[#0c0c0e]/80 shadow-2xl relative ${identity.bannerStyle} p-6 transition-all duration-300`}>
          
          {/* Subtle Ambient Glow and tech pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4 text-[9px] font-mono text-zinc-500 tracking-widest font-black uppercase pointer-events-none select-none">
            CV ESPORTS PORTAL AUTHENTICATOR
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-left">
            {/* Player Avatar with Frame Slot */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-zinc-700/80 shadow-xl bg-zinc-950 relative">
                <img 
                  referrerPolicy="no-referrer" 
                  src={identity.avatarUrl} 
                  alt={identity.username} 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Verified Badge */}
              {identity.verified && (
                <div className="absolute -bottom-2 -right-2 bg-red-600 border-2 border-zinc-900 text-white rounded-full p-1.5 shadow-[0_0_8px_rgba(239,68,68,0.7)]" title="CV Verified Player">
                  <ShieldCheck size={14} className="fill-current text-white" />
                </div>
              )}
            </div>

            {/* Profile Core Credentials Block */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-white tracking-wide font-mono uppercase">{identity.username}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">#{identity.playerID}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs text-red-500 font-mono font-bold bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20 shadow-sm uppercase flex items-center gap-1">
                      <Crown size={11} /> {identity.equippedTitle}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">PUBG IGN: <strong className="text-zinc-200">{identity.pubgIgn}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingCard(!isEditingCard)}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10.5px] font-mono font-bold uppercase rounded-lg text-zinc-300 transition-all flex items-center gap-1.5"
                  >
                    Customize Card
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-3 py-1.5 bg-red-650 hover:bg-red-700 border border-red-500/20 text-[10.5px] font-mono font-bold uppercase rounded-lg text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-red-500/10"
                  >
                    <Share2 size={12} /> Share Passport
                  </button>
                </div>
              </div>

              {/* Dynamic Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">TEAM REPRESENTATIVE</span>
                  <strong className="text-white font-medium truncate block">{identity.currentTeam}</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">ACTIVE SQUAD UNIT</span>
                  <strong className="text-zinc-300 font-medium truncate block">{identity.currentSquad}</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">REGION ZONE</span>
                  <strong className="text-zinc-300 font-medium truncate block">{identity.region}</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">COUNTRY NATIVE</span>
                  <strong className="text-zinc-300 font-medium truncate block">🇿🇼 {identity.country}</strong>
                </div>
              </div>

              {/* Badge Rack */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block mr-2">Passport Badges:</span>
                <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  ✅ Verified Player
                </span>
                <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  🏆 Champion
                </span>
                <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  👑 CV Legend
                </span>
                <span className="text-[10px] bg-sky-950/40 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  🎯 Arena Master
                </span>
                <span className="text-[10px] bg-yellow-950/40 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  ⭐ MVP
                </span>
              </div>

              {/* Connected Social Channels for Scouts */}
              <div className="pt-3 border-t border-zinc-800/40 mt-3 flex flex-wrap items-center gap-3">
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block mr-1">🎥 Scouting Channels:</span>
                
                {identity.twitch ? (
                  <a
                    href={identity.twitch.startsWith("http") ? identity.twitch : `https://${identity.twitch}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#6441a5]/10 hover:bg-[#6441a5]/20 border border-[#6441a5]/30 text-[#b39ddb] font-mono text-[10.5px] transition-all hover:scale-105"
                  >
                    <Twitch size={12} className="text-[#b39ddb]" />
                    <span>Twitch</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-zinc-600 font-mono bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-900 flex items-center gap-1">
                    <Twitch size={11} className="text-zinc-700" />
                    <span>Offline</span>
                  </span>
                )}

                {identity.youtube ? (
                  <a
                    href={identity.youtube.startsWith("http") ? identity.youtube : `https://${identity.youtube}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ff0000]/10 hover:bg-[#ff0000]/20 border border-[#ff0000]/30 text-[#ff8a80] font-mono text-[10.5px] transition-all hover:scale-105"
                  >
                    <Youtube size={12} className="text-[#ff8a80]" />
                    <span>YouTube</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-zinc-600 font-mono bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-900 flex items-center gap-1">
                    <Youtube size={11} className="text-zinc-700" />
                    <span>Offline</span>
                  </span>
                )}

                {identity.twitter ? (
                  <a
                    href={identity.twitter.startsWith("http") ? identity.twitter : `https://${identity.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 border border-[#1da1f2]/30 text-[#80d8ff] font-mono text-[10.5px] transition-all hover:scale-105"
                  >
                    <Twitter size={12} className="text-[#80d8ff]" />
                    <span>X (Twitter)</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-zinc-600 font-mono bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-900 flex items-center gap-1">
                    <Twitter size={11} className="text-zinc-700" />
                    <span>Offline</span>
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* CUSTOMIZER EXPANSION PANEL */}
        <AnimatePresence>
          {isEditingCard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#111113] border border-zinc-800 rounded-3xl p-5 mt-3 space-y-4 text-left overflow-hidden relative z-25"
            >
              <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                <h4 className="text-xs font-black text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                  🎨 CUSTOMIZE MY DIGITAL PASSPORT CARD
                </h4>
                <button
                  onClick={() => setIsEditingCard(false)}
                  className="text-zinc-500 hover:text-white font-mono text-xs"
                >
                  Close X
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                {/* A. Choose Avatar */}
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono block uppercase font-bold">Select Profile Picture Preset</label>
                  <div className="flex gap-2">
                    {AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIdentity(prev => ({ ...prev, avatarUrl: url }));
                          showNotification("🖼️ Profile picture preset selected!");
                        }}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          identity.avatarUrl === url ? "border-red-500 scale-105" : "border-zinc-800"
                        }`}
                      >
                        <img referrerPolicy="no-referrer" src={url} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* B. Choose Banner styling */}
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono block uppercase font-bold">Choose Canvas Card Banner Styling</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BANNERS.map((banner, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIdentity(prev => ({ ...prev, bannerStyle: banner.value }));
                          showNotification(`🎨 Applied custom card banner: ${banner.name}`);
                        }}
                        className={`p-1.5 rounded-lg border text-[9.5px] font-mono truncate transition-all text-zinc-300 ${
                          identity.bannerStyle === banner.value 
                            ? "border-red-500 bg-red-950/20 text-white font-bold" 
                            : "border-zinc-800 bg-black/40 hover:bg-zinc-900"
                        }`}
                      >
                        {banner.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* C. Select Title */}
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 font-mono block uppercase font-bold">Equip Prestigious Title</label>
                  <select
                    value={identity.equippedTitle}
                    onChange={(e) => {
                      setIdentity(prev => ({ ...prev, equippedTitle: e.target.value }));
                      showNotification(`🏷️ Custom Title equipped: ${e.target.value}`);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
                  >
                    {TITLES.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input details form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[9px] text-zinc-500 font-mono block uppercase font-bold mb-1">User Handle</label>
                  <input
                    type="text"
                    value={identity.username}
                    onChange={(e) => setIdentity(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-sans text-white focus:outline-none focus:border-red-500"
                    placeholder="Viper Handle"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-mono block uppercase font-bold mb-1">PUBG Mobile IGN</label>
                  <input
                    type="text"
                    value={identity.pubgIgn}
                    onChange={(e) => setIdentity(prev => ({ ...prev, pubgIgn: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
                    placeholder="PUBG IGN"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 font-mono block uppercase font-bold mb-1">Current Team</label>
                  <input
                    type="text"
                    value={identity.currentTeam}
                    onChange={(e) => setIdentity(prev => ({ ...prev, currentTeam: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-sans text-white focus:outline-none"
                    placeholder="Team Name"
                  />
                </div>
              </div>

              {/* Social Channels section */}
              <div className="pt-3 border-t border-zinc-900/60 space-y-2">
                <span className="text-[9.5px] font-mono font-black text-red-400 uppercase tracking-wider block">
                  🌐 CONNECT SCOUT CHANNELS (TWITCH, YOUTUBE, X / TWITTER)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[9px] text-zinc-500 font-mono block uppercase font-bold mb-1">Twitch Channel URL</label>
                    <input
                      type="text"
                      value={identity.twitch || ""}
                      onChange={(e) => setIdentity(prev => ({ ...prev, twitch: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50"
                      placeholder="e.g. twitch.tv/my_channel"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 font-mono block uppercase font-bold mb-1">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={identity.youtube || ""}
                      onChange={(e) => setIdentity(prev => ({ ...prev, youtube: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-red-500/50"
                      placeholder="e.g. youtube.com/c/my_channel"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 font-mono block uppercase font-bold mb-1">X (Twitter) Profile URL</label>
                    <input
                      type="text"
                      value={identity.twitter || ""}
                      onChange={(e) => setIdentity(prev => ({ ...prev, twitter: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500/50"
                      placeholder="e.g. x.com/my_handle"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. PASSPORT EXPERIENCE AND LEVEL STATUS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 p-4 rounded-2xl border border-zinc-800/40">
        <div className="flex items-center gap-3 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900 text-left">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <Zap size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">PASSPORT PROGRESS</span>
            <div className="flex items-baseline gap-1.5">
              <strong className="text-xl font-mono font-black text-white">Lvl {passportLevel}</strong>
              <span className="text-xs text-zinc-400 font-mono">({passportXp}/1000 XP)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900 text-left space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span>PASSPORT RANK TIERS BOOST</span>
            <span className="text-white font-bold">XP Level multipliers Active</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className={`h-full ${theme.textAccent.replace("text", "bg")} transition-all duration-500`} style={{ width: `${(passportXp / 1000) * 100}%` }} />
          </div>
        </div>

        {/* Action simulator button */}
        <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-mono text-zinc-500 block">PASSPORT XP BOOSTER</span>
            <span className="text-[11px] text-zinc-300">Complete matches to trigger level up.</span>
          </div>
          <button
            onClick={() => earnPassportXp(250, "Completed Scrim training lobby matches")}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10.5px] font-mono font-bold uppercase rounded-lg text-white transition-all scale-100 hover:scale-105"
          >
            🎮 Play Arena (+250 XP)
          </button>
        </div>
      </div>

      {/* 4. SUBSECTION NAVIGATION tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-850 pb-2">
        {(["identity", "records", "vault", "timeline", "reputation", "resume"] as const).map((tab) => {
          let label = "";
          let icon = null;

          if (tab === "identity") { label = "IDENTITY CARD"; icon = <User size={13} />; }
          else if (tab === "records") { label = "TDM ARENA RECORDS"; icon = <Flame size={13} />; }
          else if (tab === "timeline") { label = "CAREER JOURNEY"; icon = <History size={13} />; }
          else if (tab === "reputation") { label = "REPUTATION SCORE"; icon = <Shield size={13} />; }
          else if (tab === "resume") { label = "CV ESPORTS RESUME"; icon = <FileText size={13} />; }
          else if (tab === "vault") { label = "ACHIEVEMENT VAULT"; icon = <Award size={13} />; }

          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex items-center gap-2 px-3 py-1.5 text-[10.5px] font-mono font-bold uppercase rounded-lg border transition-all ${
                activeSubTab === tab
                  ? "bg-red-950/50 text-red-400 border-red-500/30"
                  : "bg-transparent text-zinc-400 border-transparent hover:text-white"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. SUBVIEW PANELS */}
      <div className="mt-4">
        
        {/* TAB A: IDENTITY, OVERVIEW STATS & CHAMPIONSHIP TROPHY CABINET */}
        {activeSubTab === "identity" && (
          <div className="space-y-6">
            
            {/* Stats Summary Grid block */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Matches Played", value: stats.totalMatches, icon: <Activity size={12} />, color: "text-zinc-400" },
                { label: "Wins Victory", value: stats.wins, icon: <Trophy size={12} />, color: "text-amber-400" },
                { label: "Total Kills", value: stats.kills, icon: <Flame size={12} />, color: "text-red-500" },
                { label: "Total Assists", value: stats.assists, icon: <CheckCircle2 size={12} />, color: "text-emerald-400" },
                { label: "MVPs Earned", value: stats.mvps, icon: <Star size={12} />, color: "text-yellow-400" },
                { label: "Tournaments Played", value: stats.tournamentsEntered, icon: <Award size={12} />, color: "text-indigo-400" }
              ].map((item, idx) => (
                <div key={idx} className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-900 text-left space-y-1 hover:border-zinc-800 transition-all">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono uppercase">
                    <span>{item.label}</span>
                    <span className={item.color}>{item.icon}</span>
                  </div>
                  <strong className="text-lg font-mono font-black text-white">{item.value}</strong>
                </div>
              ))}
            </div>

            {/* TROPHY CABINET (Championship Collection) */}
            <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-zinc-900 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                <div>
                  <h3 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                    🏆 CHAMPIONSHIP TROPHY CABINET
                  </h3>
                  <p className="text-[10px] text-zinc-500">Every official first, second, and third-place podium finish is permanently archived.</p>
                </div>
                <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                  Total trophies: {trophies.length}
                </span>
              </div>

              {/* Trophy shelf render */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {trophies.map((trophy) => (
                  <div 
                    key={trophy.id}
                    className="p-4 bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900/80 hover:border-zinc-850 rounded-xl transition-all flex flex-col justify-between text-left space-y-3 relative overflow-hidden group"
                  >
                    <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      <Trophy size={48} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[15px] font-bold p-1 bg-gradient-to-r ${trophy.color} rounded-lg text-black inline-block`}>
                          {trophy.icon}
                        </span>
                        <span className="text-[8px] font-mono font-bold bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded uppercase">
                          {trophy.tier}
                        </span>
                      </div>
                      <h4 className="text-[11.5px] font-black text-zinc-200 line-clamp-2 leading-snug">{trophy.event}</h4>
                    </div>

                    <div className="pt-2 border-t border-zinc-900/80 space-y-1 font-mono text-[9px] text-zinc-400">
                      <p className="font-bold text-white truncate">{trophy.placement}</p>
                      <div className="flex justify-between items-center">
                        <span>🗓️ {trophy.date}</span>
                        <span className="text-zinc-500">{trophy.team}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cabinet simulator action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-zinc-900/30 rounded-xl border border-zinc-850/40">
                <span className="text-[10px] text-zinc-400">Won another platform cup? Add your new championship trophy manually:</span>
                <button
                  onClick={() => {
                    const newTrophy: TrophyItem = {
                      id: "tr_" + Date.now(),
                      event: "CV Zimbabwe Pro League Grand Final",
                      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                      placement: "1st Place Champions (Gold)",
                      team: identity.currentTeam,
                      tier: "championship",
                      icon: "🏆",
                      color: "from-yellow-400 via-amber-300 to-yellow-600"
                    };
                    setTrophies(prev => [...prev, newTrophy]);
                    earnPassportXp(300, "Acquired Zimbabwe Pro Championship Trophy");
                    showNotification("🏆 New Trophy successfully minted to your permanent cabinet!");
                  }}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[9.5px] font-mono font-black uppercase rounded-lg text-white transition-all"
                >
                  🏆 Acquire Pro Trophy (+300 XP)
                </button>
              </div>
            </div>

            {/* 🌐 SCOUT RADAR: SOCIAL CHANNELS & CONTENT HUB */}
            <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-zinc-900 space-y-4 text-left">
              <div>
                <h3 className="text-xs font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Globe className="text-red-500 animate-pulse" size={14} /> 🌐 PRO SCOUT RADAR: SOCIAL MEDIA & STREAM CHANNELS
                </h3>
                <p className="text-[10px] text-zinc-500 font-sans">
                  Recruitment coordinators, scouts, and clan executives can review your live broadcast content, video archives, and community updates below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Twitch Card */}
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3 hover:border-[#6441a5]/40 hover:shadow-[0_0_15px_rgba(100,65,165,0.15)] transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#6441a5]/10 border border-[#6441a5]/30 text-[#b39ddb]">
                        <Twitch size={18} />
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block leading-none">Twitch Stream</span>
                        <strong className="text-xs font-mono font-bold text-white group-hover:text-[#b39ddb] transition-colors">
                          {identity.twitch ? identity.twitch.replace("https://", "").replace("www.", "") : "Offline"}
                        </strong>
                      </div>
                    </div>
                    {identity.twitch ? (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    )}
                  </div>
                  
                  <div className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                    Review official scrimmage broadcasts, competitive tournament VODs, and live commentary.
                  </div>

                  <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between">
                    {identity.twitch ? (
                      <a
                        href={identity.twitch.startsWith("http") ? identity.twitch : `https://${identity.twitch}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono font-bold text-[#b39ddb] hover:underline flex items-center gap-1"
                      >
                        Launch Channel <ExternalLink size={10} />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditingCard(true);
                          showNotification("📝 Connect your Twitch URL in the Customize Card section below!");
                        }}
                        className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Link Twitch Account +
                      </button>
                    )}
                  </div>
                </div>

                {/* YouTube Card */}
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3 hover:border-[#ff0000]/40 hover:shadow-[0_0_15px_rgba(255,0,0,0.15)] transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#ff0000]/10 border border-[#ff0000]/30 text-[#ff8a80]">
                        <Youtube size={18} />
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block leading-none">YouTube Hub</span>
                        <strong className="text-xs font-mono font-bold text-white group-hover:text-[#ff8a80] transition-colors">
                          {identity.youtube ? identity.youtube.replace("https://", "").replace("www.", "") : "Offline"}
                        </strong>
                      </div>
                    </div>
                    {identity.youtube ? (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    )}
                  </div>
                  
                  <div className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                    Check out official team montages, career highpoint highlight clips, and strategic map analysis.
                  </div>

                  <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between">
                    {identity.youtube ? (
                      <a
                        href={identity.youtube.startsWith("http") ? identity.youtube : `https://${identity.youtube}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono font-bold text-[#ff8a80] hover:underline flex items-center gap-1"
                      >
                        Launch Channel <ExternalLink size={10} />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditingCard(true);
                          showNotification("📝 Connect your YouTube URL in the Customize Card section below!");
                        }}
                        className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Link YouTube +
                      </button>
                    )}
                  </div>
                </div>

                {/* X (Twitter) Card */}
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-3 hover:border-[#1da1f2]/40 hover:shadow-[0_0_15px_rgba(29,161,242,0.15)] transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#1da1f2]/10 border border-[#1da1f2]/30 text-[#80d8ff]">
                        <Twitter size={18} />
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block leading-none">X / Twitter</span>
                        <strong className="text-xs font-mono font-bold text-white group-hover:text-[#80d8ff] transition-colors">
                          {identity.twitter ? identity.twitter.replace("https://", "").replace("www.", "") : "Offline"}
                        </strong>
                      </div>
                    </div>
                    {identity.twitter ? (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-zinc-700" />
                    )}
                  </div>
                  
                  <div className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                    View player transfers, tournament victory announcements, and scrimmage schedules.
                  </div>

                  <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between">
                    {identity.twitter ? (
                      <a
                        href={identity.twitter.startsWith("http") ? identity.twitter : `https://${identity.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono font-bold text-[#80d8ff] hover:underline flex items-center gap-1"
                      >
                        Launch Profile <ExternalLink size={10} />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setIsEditingCard(true);
                          showNotification("📝 Connect your X (Twitter) URL in the Customize Card section below!");
                        }}
                        className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Link X Profile +
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* REGIONAL TRACKS & HIGHLIGHT MEDIA SHOWCASE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Regional Track List */}
              <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-zinc-900 text-left space-y-3">
                <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider border-l-2 border-red-500 pl-2">
                  🌍 Regional Footprint & Rankings
                </h4>
                <p className="text-[10px] text-zinc-500">Official registry of competitive regions you have represented.</p>

                <div className="space-y-2">
                  {[
                    { region: "Southern Africa Zone", placement: "Top #15 Active Roster", tournaments: 8, record: "18 Kill Sweep Semis" },
                    { region: "East Africa Continent", placement: "Top #40 Qualifier", tournaments: 3, record: "Perfect Zone Rotate Zone 6" },
                    { region: "Global Invitational Series", placement: "Top #150 Seed", tournaments: 1, record: "Round 2 Stage Winner" }
                  ].map((reg, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950/70 border border-zinc-900 rounded-xl flex justify-between items-center">
                      <div className="space-y-0.5">
                        <h5 className="text-[11px] font-bold text-zinc-200">{reg.region}</h5>
                        <p className="text-[9.5px] text-zinc-400 font-mono">Record: {reg.record}</p>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <span className="text-red-500 font-black block">{reg.placement}</span>
                        <span className="text-zinc-500 text-[9px]">{reg.tournaments} Tourneys</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media highlights Showcase Upload */}
              <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-zinc-900 text-left space-y-3">
                <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider border-l-2 border-red-500 pl-2">
                  📸 Career Highlight Media Showcase
                </h4>
                <p className="text-[10px] text-zinc-500 font-sans">Pin your stream clips or screenshots for recruitment officers.</p>

                {/* upload form */}
                <form onSubmit={handleAddMedia} className="space-y-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-900/60 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Clip Title (e.g., 1v4 Clutch)"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      className="bg-black/40 border border-zinc-800 rounded p-1.5 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="YouTube / Video Link"
                      value={newMediaLink}
                      onChange={(e) => setNewMediaLink(e.target.value)}
                      className="bg-black/40 border border-zinc-800 rounded p-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Brief Description (Zone rotation details)"
                      value={newMediaDesc}
                      onChange={(e) => setNewMediaDesc(e.target.value)}
                      className="flex-1 bg-black/40 border border-zinc-800 rounded p-1.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-650 hover:bg-red-700 text-white text-[10px] font-mono font-bold uppercase rounded transition-all"
                    >
                      PIN CLIP
                    </button>
                  </div>
                </form>

                {/* Clips list */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {mediaItems.map((item) => (
                    <div key={item.id} className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative group">
                      <div className="h-20 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.thumbnail})` }}>
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center text-white opacity-60 group-hover:opacity-100 transition-opacity">
                          <Video size={24} />
                        </a>
                      </div>
                      <div className="p-2 text-left space-y-0.5">
                        <h5 className="text-[10px] font-black text-zinc-200 truncate">{item.title}</h5>
                        <p className="text-[9px] text-zinc-400 line-clamp-1 font-mono leading-none">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB B: TDM ARENA DETAILED RECORDS */}
        {activeSubTab === "records" && (
          <div className="space-y-6 text-left">
            
            {/* Arena stats summary header */}
            <div className="bg-gradient-to-r from-red-950/20 to-zinc-950 p-5 rounded-2xl border border-zinc-850/60 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-red-500 font-mono tracking-widest font-black uppercase">CURRENT TDM ARENA SEASON 4</span>
                <h3 className="text-base font-extrabold text-white uppercase font-mono">⚔️ TDM ARENA DETAILED PERFORMANCE DOSSIER</h3>
                <p className="text-xs text-zinc-400">Track separate records for specialized 1v1 duels, 2v2 tactical skirmishes, and 4v4 team battles.</p>
              </div>
              
              <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                <div className="text-left">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block">CURRENT ARENA DIVISION</span>
                  <strong className="text-sm font-mono font-black text-red-400">{stats.highestRank}</strong>
                </div>
                <div className="text-right border-l border-zinc-800 pl-3">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block">ARENA POINTS</span>
                  <strong className="text-sm font-mono font-black text-white">{stats.arenaPoints} RP</strong>
                </div>
              </div>
            </div>

            {/* Three Arena Subtypes Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 1v1 Arena */}
              <div className="bg-[#0c0c0e] p-5 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-black text-zinc-200 font-mono uppercase flex items-center gap-1.5">
                    👤 1v1 Solo Arena
                  </h4>
                  <span className="text-[8px] font-mono text-zinc-500">RATING: ELITE</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Matches:</span>
                    <strong className="text-white">{stats.tdm1v1.matches}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Win Rate:</span>
                    <strong className="text-emerald-400">{((stats.tdm1v1.wins / stats.tdm1v1.matches) * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">MVP Medals:</span>
                    <strong className="text-yellow-400">{stats.tdm1v1.mvp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Highest Win Streak:</span>
                    <strong className="text-red-500">6 Wins</strong>
                  </div>
                </div>
              </div>

              {/* 2v2 Arena */}
              <div className="bg-[#0c0c0e] p-5 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-black text-zinc-200 font-mono uppercase flex items-center gap-1.5">
                    👥 2v2 Duo Arena
                  </h4>
                  <span className="text-[8px] font-mono text-zinc-500">RATING: SEMI-PRO</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Matches:</span>
                    <strong className="text-white">{stats.tdm2v2.matches}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Win Rate:</span>
                    <strong className="text-emerald-400">{((stats.tdm2v2.wins / stats.tdm2v2.matches) * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">MVP Medals:</span>
                    <strong className="text-yellow-400">{stats.tdm2v2.mvp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Partner synergy:</span>
                    <strong className="text-purple-400">92% Excellent</strong>
                  </div>
                </div>
              </div>

              {/* 4v4 Arena */}
              <div className="bg-[#0c0c0e] p-5 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-black text-zinc-200 font-mono uppercase flex items-center gap-1.5">
                    🛡️ 4v4 Squad Arena
                  </h4>
                  <span className="text-[8px] font-mono text-zinc-500">RATING: GRANDMASTER</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Matches:</span>
                    <strong className="text-white">{stats.tdm4v4.matches}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Win Rate:</span>
                    <strong className="text-emerald-400">{((stats.tdm4v4.wins / stats.tdm4v4.matches) * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">MVP Medals:</span>
                    <strong className="text-yellow-400">{stats.tdm4v4.mvp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Squad Role:</span>
                    <strong className="text-red-500">Entry Fragger</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Arena records checklist achievements list */}
            <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-zinc-900 space-y-3 text-left">
              <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider">TDM Arena Records & Placements</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
                  <span className="text-zinc-500 block uppercase text-[9px]">Highest Arena Rank</span>
                  <strong className="text-white">Gladiator Master (Season 3)</strong>
                </div>
                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
                  <span className="text-zinc-500 block uppercase text-[9px]">Max Win Streak</span>
                  <strong className="text-emerald-400">12 Wins (Active record)</strong>
                </div>
                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
                  <span className="text-zinc-500 block uppercase text-[9px]">Hall of Fame Placements</span>
                  <strong className="text-yellow-400">2 Appearances</strong>
                </div>
                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
                  <span className="text-zinc-500 block uppercase text-[9px]">Average Arena Rating</span>
                  <strong className="text-white">4,620 RP</strong>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB C: ACHIEVEMENT VAULT */}
        {activeSubTab === "vault" && (
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase font-mono">🏅 PERMANENT ACHIEVEMENT VAULT</h3>
                <p className="text-[11px] text-zinc-500">Legacy credentials earned are locked forever and cannot be wiped by resets.</p>
              </div>
              <span className="text-[10px] bg-red-950/30 text-red-400 px-2 py-1 rounded font-mono border border-red-900/30">
                POINTS: {achievements.reduce((acc, current) => acc + (current.points || 0), 0)} AP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-900 flex items-start gap-3.5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1.5 text-[8px] font-mono bg-zinc-900 text-zinc-505 rounded-bl uppercase">
                    {ach.category}
                  </div>
                  
                  <span className="text-2xl p-2 bg-zinc-900 rounded-xl block shrink-0">{ach.icon}</span>

                  <div className="space-y-1 text-left flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white leading-tight uppercase tracking-wide flex items-center gap-1.5">
                      {ach.title}
                    </h4>
                    <p className="text-[10.5px] text-zinc-400 font-sans leading-relaxed">{ach.description}</p>
                    <div className="flex justify-between items-center pt-1.5 text-[9px] font-mono text-zinc-500">
                      <span>📆 Claimed: {ach.dateEarned}</span>
                      <span className="text-yellow-400">+{ach.points} Achievement Points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB D: CAREER HISTORY TIMELINE */}
        {activeSubTab === "timeline" && (
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase font-mono">🏛️ CAREER TIMELINE & TEAM TRANSFER HISTORY</h3>
                <p className="text-[11px] text-zinc-500">Permanent digital record of your recruitment transfers and championship timeline.</p>
              </div>
              <button
                onClick={() => {
                  const newMilestone: CareerMilestone = {
                    id: "ml_" + Date.now(),
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                    event: "Custom Scrim Clash Winner",
                    type: "scrim",
                    description: "Earned MVP in a 16-squad custom training session."
                  };
                  setHistoryTimeline(prev => [newMilestone, ...prev]);
                  earnPassportXp(150, "Added career historical milestone");
                  showNotification("📜 Career Journey timeline updated with a new historical record!");
                }}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[9.5px] font-mono font-bold uppercase rounded-lg text-white transition-all flex items-center gap-1"
              >
                <Plus size={11} /> Add Record (+150 XP)
              </button>
            </div>

            {/* History timeline visualizer */}
            <div className="relative border-l border-zinc-800 pl-4 ml-2 space-y-6 pt-3 pb-3">
              {historyTimeline.map((milestone) => {
                let badgeStyle = "bg-zinc-900 text-zinc-400";
                if (milestone.type === "tournament") badgeStyle = "bg-red-950/40 text-red-400 border border-red-900/30";
                else if (milestone.type === "team") badgeStyle = "bg-indigo-950/40 text-indigo-400 border border-indigo-900/30";
                else if (milestone.type === "achievement") badgeStyle = "bg-yellow-950/40 text-yellow-400 border border-yellow-900/30";

                return (
                  <div key={milestone.id} className="relative group text-left">
                    {/* Circle timeline nodes */}
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-zinc-950 group-hover:bg-red-500 transition-colors" />
                    
                    <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-900 space-y-1 hover:border-zinc-850 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-zinc-500 font-mono font-bold">{milestone.date}</span>
                        <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded font-black uppercase ${badgeStyle}`}>
                          {milestone.type}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white uppercase">{milestone.event}</h4>
                      <p className="text-xs text-zinc-400 leading-snug">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB E: REPUTATION & SPORTSMANSHIP SCORE */}
        {activeSubTab === "reputation" && (
          <div className="space-y-6 text-left">
            
            {/* Reputation status cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Reputation Level Star Display */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">REPUTATION RATING</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={18} className={idx < reputationLevel ? "fill-current" : "text-zinc-800"} />
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-white uppercase pt-1">REPUTATION LEVEL: {reputationLevel}</h4>
                  <p className="text-xs text-zinc-400">Awarded to high integrity players who complete matching commitments.</p>
                </div>
                <div className="text-[9.5px] font-mono text-zinc-500 uppercase">
                  ✓ Elite Commendations Secured
                </div>
              </div>

              {/* Reliability Score Percent */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">RELIABILITY INDEX</span>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-3xl font-mono font-black text-emerald-400">{reliabilityScore}%</strong>
                    <span className="text-zinc-500 font-mono text-xs">/ 100</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase">EVENT ATTENDANCE RECORD</h4>
                  <p className="text-xs text-zinc-400">High index score ensures priority matchmaker queues and instant team placements.</p>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${reliabilityScore}%` }} />
                </div>
              </div>

              {/* Community rating score */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">COMMUNITY RATING</span>
                  <div className="flex items-baseline gap-1">
                    <strong className="text-3xl font-mono font-black text-amber-400">{communityRating}</strong>
                    <span className="text-zinc-500 font-mono text-xs">/ 5.0</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase">COMMENDATIONS AND REVIEW</h4>
                  <p className="text-xs text-zinc-400">Weighted scorecard rating based on teammates' end-of-match feedback reviews.</p>
                </div>
                <div className="text-[9.5px] font-mono text-zinc-500 uppercase">
                  🏆 Ranked #1 for sportsmanship
                </div>
              </div>

            </div>

            {/* REPUTATION ACTS Simulators */}
            <div className="bg-[#0b0b0d] p-5 rounded-2xl border border-zinc-900 space-y-4">
              <div className="border-b border-zinc-850 pb-2">
                <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                  🛡️ SPORTSMANSHIP AND INTEGRITY BOOST ACTION CONSOLE
                </h4>
                <p className="text-[10px] text-zinc-500">Perform positive sportsmanship acts to raise your verified reputation rating in real-time.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => triggerReputationAction("sportsmanship")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-xl text-left space-y-1 transition-all"
                >
                  <span className="text-lg block">🤝</span>
                  <strong className="text-white block">Vouch Competitors</strong>
                  <p className="text-[9.5px] text-zinc-400">+0.1 Rating / Good Sportsmanship.</p>
                </button>
                <button
                  onClick={() => triggerReputationAction("attendance")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-xl text-left space-y-1 transition-all"
                >
                  <span className="text-lg block">⏰</span>
                  <strong className="text-white block">Check In On-Time</strong>
                  <p className="text-[9.5px] text-zinc-400">+2% Reliability Score booster.</p>
                </button>
                <button
                  onClick={() => triggerReputationAction("positive")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-xl text-left space-y-1 transition-all"
                >
                  <span className="text-lg block">💬</span>
                  <strong className="text-white block">Friendly Chatting</strong>
                  <p className="text-[9.5px] text-zinc-400">Gain +100 Passport XP points.</p>
                </button>
                <button
                  onClick={() => triggerReputationAction("completed")}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-xl text-left space-y-1 transition-all"
                >
                  <span className="text-lg block">🏁</span>
                  <strong className="text-white block">No Leave Scrims</strong>
                  <p className="text-[9.5px] text-zinc-400">Complete matches with zero leaves.</p>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB F: CV PROFESSIONAL ESPORTS RESUME MODE */}
        {activeSubTab === "resume" && (
          <div className="space-y-6 text-left">
            
            {/* Resume Mode Info */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex justify-between items-center flex-wrap gap-3">
              <div className="space-y-0.5">
                <span className="text-[9px] text-red-500 font-bold font-mono block uppercase">📋 RESUME MODE INJECTOR</span>
                <p className="text-xs text-zinc-300">Displays a clean, printable, professional recruitment-friendly CV Esports Resume layout.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white border border-red-500/40 text-[10.5px] font-mono font-black uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                >
                  <Share2 size={13} /> SHARE & DOWNLOAD RESUME
                </button>
              </div>
            </div>

            {/* Clean CV Layout (Aesthetic, high contrast dark theme print card) */}
            <div className="bg-white text-zinc-950 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl relative border-2 border-zinc-200">
              
              {/* Header Resume Banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-zinc-200 pb-5 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest block">CV ESPORTS CERTIFIED CV RESUME</span>
                  <h1 className="text-2xl font-mono font-black text-black uppercase leading-none">{identity.username}</h1>
                  <p className="text-sm font-bold text-red-600 font-mono uppercase">{identity.equippedTitle} | #{identity.playerID}</p>
                </div>
                <div className="text-left md:text-right font-mono text-xs text-zinc-600 space-y-0.5">
                  <p>🇿🇼 <strong>Country:</strong> {identity.country}</p>
                  <p>🎮 <strong>PUBG IGN:</strong> {identity.pubgIgn}</p>
                  <p>🌐 <strong>Region:</strong> {identity.region}</p>
                </div>
              </div>

              {/* Career Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-black uppercase text-zinc-800 tracking-wider border-b border-zinc-200 pb-1">
                  I. PROFESSIONAL SUMMARY
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans font-medium">
                  Active tier-one competitive {identity.equippedTitle} presently representing {identity.currentTeam} in the {identity.region} server. 
                  Demonstrated command of tactical zone rotations, high mechanical capability with {stats.kills} career eliminations, 
                  and a high sportsmanship reliability rating of {reliabilityScore}%. Seeking elite custom lobby squad recruitment opportunities.
                </p>
              </div>

              {/* Grid: Stats & Reputation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Stats Columns */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-black uppercase text-zinc-800 tracking-wider border-b border-zinc-200 pb-1">
                    II. CORE COMPETITIVE STATISTICS
                  </h3>
                  <div className="space-y-1 text-xs text-zinc-700 font-mono">
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Total Matches:</span>
                      <strong className="text-zinc-950">{stats.totalMatches}</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Victory Wins (WR):</span>
                      <strong className="text-emerald-700">{stats.wins} Wins ({((stats.wins / stats.totalMatches) * 100).toFixed(0)}%)</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Total Eliminations (Kills):</span>
                      <strong className="text-zinc-950">{stats.kills}</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Official MVP Awards:</span>
                      <strong className="text-yellow-600">{stats.mvps}</strong>
                    </div>
                  </div>
                </div>

                {/* Reputation & rankings columns */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-black uppercase text-zinc-800 tracking-wider border-b border-zinc-200 pb-1">
                    III. PLATFORM STANDING & REPUTATION
                  </h3>
                  <div className="space-y-1 text-xs text-zinc-700 font-mono">
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Reputation Level:</span>
                      <strong className="text-zinc-950">⭐ Level {reputationLevel} / 5</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Attendance Reliability:</span>
                      <strong className="text-emerald-700">{reliabilityScore}% (Highly Reliable)</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>Regional Placement rank:</span>
                      <strong className="text-zinc-950">{stats.regionalRanking}</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 py-1">
                      <span>TDM Arena points:</span>
                      <strong className="text-indigo-700">{stats.arenaPoints} RP ({stats.highestRank})</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Championships trophy list summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-black uppercase text-zinc-800 tracking-wider border-b border-zinc-200 pb-1">
                  IV. TROPHY CABINET & MAJOR ACHIEVEMENTS
                </h3>
                <div className="space-y-1.5 text-xs text-zinc-600 font-mono">
                  {trophies.map((trophy, idx) => (
                    <div key={idx} className="flex justify-between items-start border-b border-zinc-100 pb-1.5">
                      <div>
                        <strong className="text-zinc-950">{trophy.event}</strong>
                        <p className="text-[10px] text-zinc-400">Team: {trophy.team} | Date: {trophy.date}</p>
                      </div>
                      <span className="font-bold text-red-600">{trophy.placement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Channels Resume Section */}
              <div className="space-y-2 border-t border-zinc-200 pt-4">
                <h3 className="text-xs font-mono font-black uppercase text-zinc-800 tracking-wider pb-1">
                  V. CONNECTED SOCIAL CHANNELS (FOR SCOUT CONTACT)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-zinc-700">
                  <div className="flex items-center gap-2 border border-zinc-200/80 p-2.5 rounded-xl bg-zinc-50/50">
                    <span className="p-1 rounded bg-[#6441a5]/10 text-[#6441a5] font-sans">📺</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">Twitch Broadcast</span>
                      <a 
                        href={identity.twitch?.startsWith("http") ? identity.twitch : `https://${identity.twitch}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-zinc-950 font-bold truncate hover:text-purple-700 hover:underline block"
                      >
                        {identity.twitch ? identity.twitch.replace("https://", "").replace("www.", "") : "Not Linked"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border border-zinc-200/80 p-2.5 rounded-xl bg-zinc-50/50">
                    <span className="p-1 rounded bg-[#ff0000]/10 text-[#ff0000] font-sans">🎥</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">YouTube Channel</span>
                      <a 
                        href={identity.youtube?.startsWith("http") ? identity.youtube : `https://${identity.youtube}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-zinc-950 font-bold truncate hover:text-red-700 hover:underline block"
                      >
                        {identity.youtube ? identity.youtube.replace("https://", "").replace("www.", "") : "Not Linked"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border border-zinc-200/80 p-2.5 rounded-xl bg-zinc-50/50">
                    <span className="p-1 rounded bg-[#1da1f2]/10 text-[#1da1f2] font-sans">🐦</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">X (Twitter) Profile</span>
                      <a 
                        href={identity.twitter?.startsWith("http") ? identity.twitter : `https://${identity.twitter}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-zinc-950 font-bold truncate hover:text-sky-700 hover:underline block"
                      >
                        {identity.twitter ? identity.twitter.replace("https://", "").replace("www.", "") : "Not Linked"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Certified stamps */}
              <div className="border-t-2 border-zinc-200 pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>CV ESPORTS VERIFICATION SEAL: VERIFIED PRO</span>
                <span>AUTHENTIC LICENSE ID: {identity.playerID}</span>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 6. INTERACTIVE SHARE RESUME MODAL CONSOLE */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#0b0b0d] border-2 border-red-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-zinc-100 shadow-[0_0_50px_rgba(239,68,68,0.2)] space-y-6 relative overflow-hidden"
            >
              {/* Tech details background glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-650/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-650/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors font-mono text-xs uppercase cursor-pointer bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg"
              >
                Close X
              </button>

              {/* Modal Header */}
              <div className="text-left space-y-1">
                <span className="text-[9.5px] font-mono font-black text-red-500 uppercase tracking-widest block">
                  📡 ESPORTS BROADCAST ROUTER
                </span>
                <h3 className="text-xl font-black font-mono text-white uppercase flex items-center gap-2">
                  <Share2 className="text-red-500" size={20} /> SHARE ESPORTS RESUME LICENSE
                </h3>
                <p className="text-xs text-zinc-400">
                  Select your sharing transmission protocol to publish your verified player credentials, battle statistics, and trophies.
                </p>
              </div>

              {/* Grid: Option 1 (Public URL) & Option 2 (PNG Graphics Card) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* PART A: PROTOCOL 01: DIGITAL URL */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] p-1.5 bg-red-950/40 text-red-400 border border-red-500/20 rounded-lg">
                        <Globe size={16} />
                      </span>
                      <strong className="text-xs font-mono font-black text-white uppercase tracking-wider">
                        01. UNIQUE PUBLIC URL
                      </strong>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Generates an encrypted shareable hyperlink. Anyone visiting this link will land directly on your verified eSports resume in full graphics mode.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative font-mono">
                      <input
                        type="text"
                        readOnly
                        value={getShareableUrl().substring(0, 42) + "..."}
                        className="w-full bg-black/60 border border-zinc-850 rounded-xl p-2.5 pl-3 pr-10 text-[10px] text-zinc-400 select-all"
                      />
                      <span className="absolute right-3 top-2.5 text-zinc-600 text-[10px] font-mono">URL</span>
                    </div>

                    <button
                      onClick={handleCopyShareableUrl}
                      className={`w-full py-2.5 rounded-xl font-mono text-[10px] font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                        copiedLink 
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30" 
                          : "bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <CheckCircle2 size={13} /> COPY SUCCESSFUL!
                        </>
                      ) : (
                        <>
                          <FileText size={13} /> COPY PUBLIC RESUME LINK
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mock QR Code HUD Visual */}
                  <div className="pt-2 border-t border-zinc-900 flex items-center gap-3 bg-black/20 p-2 rounded-xl">
                    <div className="w-12 h-12 bg-white p-1 rounded-lg shrink-0 relative overflow-hidden flex items-center justify-center border border-zinc-800">
                      <div className="grid grid-cols-5 gap-0.5 w-full h-full">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-sm ${(i * 3 + 7) % 5 === 0 || i % 4 === 0 || i === 0 || i === 4 || i === 20 || i === 24 ? "bg-black" : "bg-transparent"}`} 
                          />
                        ))}
                      </div>
                      <div className="absolute inset-x-0 h-[1.5px] bg-red-500 animate-bounce top-0" />
                    </div>
                    <div className="text-left font-mono text-[9px] text-zinc-500">
                      <span className="text-zinc-400 font-bold block uppercase">VERIFIABLE DIGITAL SEAL</span>
                      Scan on mobile device to instantly load this profile's live records.
                    </div>
                  </div>

                </div>

                {/* PART B: PROTOCOL 02: GRAPHICS CARD EXPORT */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] p-1.5 bg-red-950/40 text-red-400 border border-red-500/20 rounded-lg">
                        <Award size={16} />
                      </span>
                      <strong className="text-xs font-mono font-black text-white uppercase tracking-wider">
                        02. DOWNLOADABLE PNG CARD
                      </strong>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Compiles your player identity, equipped titles, competitive TDM & Scrim statistics, and sportsmanship badges onto a beautiful cyber-grid eSports license graphics card.
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="bg-black/40 p-3 rounded-xl border border-zinc-900 space-y-1.5 font-mono text-[9.5px] text-zinc-400">
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span className="text-white font-bold">1200 x 630 px</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format Output:</span>
                      <span className="text-white font-bold">image/png</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certified Seal:</span>
                      <span className="text-emerald-400 font-bold">CLASS A LICENSE</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleDownloadPng}
                      disabled={isGeneratingPng}
                      className="w-full py-3 bg-red-650 hover:bg-red-700 text-white font-mono font-black text-[10.5px] rounded-xl uppercase transition-all tracking-widest cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                    >
                      {isGeneratingPng ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>EXPORTING IMAGE...</span>
                        </div>
                      ) : (
                        <>
                          📥 DOWNLOAD PNG LICENSE
                        </>
                      )}
                    </button>
                    
                    {isGeneratingPng && (
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 animate-pulse" style={{ width: "70%" }} />
                        </div>
                        <span className="text-[8.5px] font-mono text-zinc-500 block text-center animate-pulse">
                          Compiling profile data matrix...
                        </span>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850 flex items-center gap-3">
                <span className="text-base">🛡️</span>
                <p className="text-[9.5px] font-mono text-zinc-500 text-left leading-normal">
                  Note: All shared resume URLs and digital graphics cards represent self-authored platform achievements. Crimson Vipers automatically guarantees verification for listed TDM ladder metrics.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
