import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy, Users, Shield, Award, Plus, Search, User, Globe, MessageSquare,
  Sparkles, Calendar, Heart, ShieldAlert, Star, Compass, Settings, CheckCircle,
  Clock, Share2, Filter, Bell, Send, Edit, Trash2, ShieldCheck, Gamepad2, Info,
  Volume2, Eye, UserPlus, Check, X, Megaphone, Flag, SendHorizontal, ThumbsUp
} from "lucide-react";

interface CVCommunityHubProps {
  userSession: { ign: string; role: string; coins: number; battlePassLevel: number };
  systemAlertMessage: string | null;
  setSystemAlertMessage: (msg: string | null) => void;
  initialTab?: "hosting" | "teams" | "discovery" | "dashboard";
  setGlobalActiveTab?: (tab: string) => void;
}

// Types for Tournament Form & Host Requests
interface TourneyRequest {
  id: string;
  name: string;
  type: string; // Solo, Duo, Squad, TDM, Arena
  region: string;
  description: string;
  rules: string;
  prizePool: string;
  sponsorName: string;
  contactInfo: string;
  preferredDates: string;
  expectedTeams: number;
  streamingPlans: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Requires Changes";
  permissionLevel: "Community Host" | "Verified Host" | "Partner Host" | "Premium Host" | "CV eSports Admin";
  applicantName: string;
  logs: string[];
}

// Types for Community Teams
interface CommunityTeam {
  id: string;
  name: string;
  tag: string;
  logo: string; // Emoji or visual placeholder
  banner: string; // color gradient or image URL
  region: string;
  description: string;
  recruitmentStatus: "Open" | "Closed";
  ownerName: string;
  members: Array<{ name: string; role: "Owner" | "Captain" | "Manager" | "Player"; rating: string }>;
  announcements: Array<{ id: string; msg: string; date: string }>;
  achievements: string[];
  stats: { matches: number; wins: number; ratio: string };
  isVerified: boolean;
  gallery: string[];
  chat: Array<{ sender: string; text: string; time: string }>;
  recruitmentPost?: {
    requiredRank: string;
    rolesNeeded: string[];
    experienceLevel: string;
    availability: string;
  };
}

export default function CVCommunityHub({ userSession, systemAlertMessage, setSystemAlertMessage, initialTab = "teams", setGlobalActiveTab }: CVCommunityHubProps) {
  // Navigation: "hosting-requests" | "host-dashboard" | "teams-manager" | "team-discovery"
  const [activeTab, setActiveTab] = useState<"hosting-requests" | "host-dashboard" | "teams-manager" | "team-discovery">(
    initialTab === "hosting" ? "hosting-requests" : initialTab === "dashboard" ? "host-dashboard" : initialTab === "teams" ? "teams-manager" : "team-discovery"
  );

  // States for Tourney Request System
  const [tourRequests, setTourRequests] = useState<TourneyRequest[]>([
    {
      id: "tr-1",
      name: "Crimson Strike Invitational",
      type: "Squad",
      region: "Africa",
      description: "A community squad exhibition with custom streaming on Twitch and cash bounty giveaways.",
      rules: "No emulator allowed. Mandatory wireframe proof on discord screenshare.",
      prizePool: "$250 USD + 5000 Coins",
      sponsorName: "RedLine Fuel Drinks",
      contactInfo: "redline@esports.com",
      preferredDates: "2026-07-15",
      expectedTeams: 32,
      streamingPlans: "Twitch Primary Cast @cv_invitational",
      status: "Approved",
      permissionLevel: "Verified Host",
      applicantName: userSession.ign || "ApexPlayer",
      logs: ["Submitted request", "Assigned permissions: Verified Host", "Status changed to Approved"]
    },
    {
      id: "tr-2",
      name: "TDM Gladiator 1v1 Clash",
      type: "TDM",
      region: "Middle East",
      description: "Direct shootout ladder of 64 duelists over a 3-day bracket weekend.",
      rules: "First to 40 kills or 10 min cap. Warehouse only.",
      prizePool: "15000 CV Coins + Dynamic Badges",
      sponsorName: "Community Crowdfunded",
      contactInfo: "clashmaster@gmail.com",
      preferredDates: "2026-06-30",
      expectedTeams: 64,
      streamingPlans: "Discord High-Definition Stream server links",
      status: "Pending Review",
      permissionLevel: "Community Host",
      applicantName: "Rival_Gamer",
      logs: ["Submitted request", "Awaiting admin confirmation"]
    }
  ]);

  // Host rating stats
  const hostStats = {
    eventsHosted: 12,
    successfulEvents: 11,
    playerReviews: 4.8,
    reliabilityScore: "96%",
    communityRatings: "Excellent (45 votes)"
  };

  // Tournament Submission Modal/Form state
  const [reqName, setReqName] = useState("");
  const [reqType, setReqType] = useState("Squad");
  const [reqRegion, setReqRegion] = useState("Africa");
  const [reqDesc, setReqDesc] = useState("");
  const [reqRules, setReqRules] = useState("");
  const [reqPrize, setReqPrize] = useState("");
  const [reqSponsor, setReqSponsor] = useState("");
  const [reqContact, setReqContact] = useState("");
  const [reqDate, setReqDate] = useState("");
  const [reqTeams, setReqTeams] = useState<number>(16);
  const [reqStream, setReqStream] = useState("");

  const [activeHostTab, setActiveHostTab] = useState<"creation" | "registration" | "scheduling" | "announcements" | "results">("creation");
  const [schedulingMatch, setSchedulingMatch] = useState({ round: "Quarterfinals", bName: "Vipers A", rName: "Hydra B", date: "June 25", time: "18:00 UTC", server: "ZA_Host_A1" });

  // Community Teams Storage
  const [communityTeams, setCommunityTeams] = useState<CommunityTeam[]>([
    {
      id: "ct-1",
      name: "Bermuda Snipers Corp",
      tag: "BSC",
      logo: "🎯",
      banner: "from-blue-900 to-indigo-950",
      region: "Africa",
      description: "A friendly community lineup of sharpshooters playing seasonal scrambles and TDM.",
      recruitmentStatus: "Open",
      ownerName: userSession.ign || "ApexPlayer",
      members: [
        { name: userSession.ign || "ApexPlayer", role: "Owner", rating: "Ranked Legend" },
        { name: "Delta_Viper", role: "Captain", rating: "Platinum" },
        { name: "Slayer_01", role: "Player", rating: "Elite" }
      ],
      announcements: [
        { id: "an-1", msg: "Duo practice begins tonight at 20:00!", date: "Today" }
      ],
      achievements: ["S2 Weekly Champion", "TDM Arena Diamond Tier"],
      stats: { matches: 45, wins: 30, ratio: "66%" },
      isVerified: true,
      gallery: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=50"],
      chat: [
        { sender: "Delta_Viper", text: "Ready for scrims?", time: "12:30" },
        { sender: "Slayer_01", text: "Locked and loaded! Ready when you are.", time: "12:32" }
      ],
      recruitmentPost: {
        requiredRank: "Platinum V",
        rolesNeeded: ["Sniper", "Entry Fragger"],
        experienceLevel: "Tier 2 Scrim experience",
        availability: "Wed/Fri Nights"
      }
    },
    {
      id: "ct-2",
      name: "Ares Vanguard",
      tag: "ARES",
      logo: "⚔️",
      banner: "from-red-950 to-neutral-950",
      region: "Europe",
      description: "Uncontrolled aggression and tactical layout control. Looking for solid TDM mechanics.",
      recruitmentStatus: "Open",
      ownerName: "Ares_Leader",
      members: [
        { name: "Ares_Leader", role: "Owner", rating: "Legend" },
        { name: "Shadow_Mage", role: "Captain", rating: "Elite" }
      ],
      announcements: [],
      achievements: [],
      stats: { matches: 12, wins: 8, ratio: "66%" },
      isVerified: false,
      gallery: [],
      chat: [],
      recruitmentPost: {
        requiredRank: "Diamond I",
        rolesNeeded: ["Support / Utility Coordinator"],
        experienceLevel: "Tournament player",
        availability: "Daily"
      }
    }
  ]);

  // States for Community Team Creation Process
  const [cTeamName, setCTeamName] = useState("");
  const [cTeamTag, setCTeamTag] = useState("");
  const [cTeamLogo, setCTeamLogo] = useState("🛡️");
  const [cTeamBanner, setCTeamBanner] = useState("from-orange-950 to-neutral-900");
  const [cTeamRegion, setCTeamRegion] = useState("Africa");
  const [cTeamDesc, setCTeamDesc] = useState("");
  const [cTeamRecruitment, setCTeamRecruitment] = useState<"Open" | "Closed">("Open");

  // Team controls states
  const [selectedMyTeamId, setSelectedMyTeamId] = useState<string>("ct-1");
  const [invitePlayerName, setInvitePlayerName] = useState("");
  const [promoteMemberName, setPromoteMemberName] = useState("");
  const [selectedMemberRole, setSelectedMemberRole] = useState<"Captain" | "Manager" | "Player">("Player");
  const [newAnnouncementMsg, setNewAnnouncementMsg] = useState("");
  const [teamChatMessage, setTeamChatMessage] = useState("");

  // Team Discovery Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("All");
  const [filterRecruiting, setFilterRecruiting] = useState<string>("All");

  // Recruitment post creator states
  const [reqRank, setReqRank] = useState("Gold III");
  const [reqRoles, setReqRoles] = useState("Assaulter, Sniper");
  const [reqExp, setReqExp] = useState("Basic tournament communication skills");
  const [reqAvail, setReqAvail] = useState("Weekends");

  // Team Application Dialog Status
  const [appliedTeams, setAppliedTeams] = useState<string[]>([]);
  const [verifyChecklistStatus, setVerifyChecklistStatus] = useState({
    activity: true,
    standing: true,
    completeProfile: true,
    tournamentJoined: false,
  });

  const handleCreateTournamentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName || !reqDesc || !reqPrize || !reqContact || !reqDate) {
      setSystemAlertMessage("⚠️ Please fill in all required highlighted tournament parameters!");
      return;
    }

    const newReq: TourneyRequest = {
      id: `tr-${Date.now()}`,
      name: reqName,
      type: reqType,
      region: reqRegion,
      description: reqDesc,
      rules: reqRules || "Standard CV Rules Apply",
      prizePool: reqPrize,
      sponsorName: reqSponsor || "None",
      contactInfo: reqContact,
      preferredDates: reqDate,
      expectedTeams: reqTeams,
      streamingPlans: reqStream || "None",
      status: "Pending Review",
      permissionLevel: "Community Host",
      applicantName: userSession.ign || "ApexPlayer",
      logs: ["Submitted request for review"]
    };

    setTourRequests(prev => [newReq, ...prev]);
    setSystemAlertMessage(`🎉 Tournament "${reqName}" request submitted successfully! Tracking ID set.`);
    
    // reset form
    setReqName("");
    setReqDesc("");
    setReqRules("");
    setReqPrize("");
    setReqSponsor("");
    setReqContact("");
    setReqDate("");
    setReqStream("");
  };

  const handleCreateCommunityTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTeamName || !cTeamTag || !cTeamDesc) {
      setSystemAlertMessage("⚠️ Please provide Team Name, short Tag, and Description!");
      return;
    }

    const newTeam: CommunityTeam = {
      id: `ct-${Date.now()}`,
      name: cTeamName,
      tag: cTeamTag.toUpperCase(),
      logo: cTeamLogo,
      banner: cTeamBanner,
      region: cTeamRegion,
      description: cTeamDesc,
      recruitmentStatus: cTeamRecruitment,
      ownerName: userSession.ign || "ApexPlayer",
      members: [
        { name: userSession.ign || "ApexPlayer", role: "Owner", rating: "Gold II" }
      ],
      announcements: [
        { id: "an-init", msg: "Team established! Setup profiles and recruit players.", date: "Just now" }
      ],
      achievements: [],
      stats: { matches: 0, wins: 0, ratio: "0%" },
      isVerified: false,
      gallery: [],
      chat: [],
      recruitmentPost: cTeamRecruitment === "Open" ? {
        requiredRank: "Gold I",
        rolesNeeded: ["Assaulter"],
        experienceLevel: "Casual/Competitive",
        availability: "Flexible schedule"
      } : undefined
    };

    setCommunityTeams(prev => [newTeam, ...prev]);
    setSelectedMyTeamId(newTeam.id);
    setSystemAlertMessage(`👥 Community Team "${cTeamName}" [${newTeam.tag}] established successfully!`);
    
    // Clear forms
    setCTeamName("");
    setCTeamTag("");
    setCTeamDesc("");
  };

  const handleInvitePlayer = () => {
    if (!invitePlayerName) return;
    
    setCommunityTeams(prev => prev.map(t => {
      if (t.id === selectedMyTeamId) {
        // Prevent duplicate
        if (t.members.some(m => m.name.toLowerCase() === invitePlayerName.toLowerCase())) return t;
        return {
          ...t,
          members: [...t.members, { name: invitePlayerName, role: "Player", rating: "Silver II" }],
          chat: [...t.chat, { sender: "System", text: `${invitePlayerName} joined the team roster!`, time: "Now" }]
        };
      }
      return t;
    }));

    setSystemAlertMessage(`✅ Sent member invitation to "${invitePlayerName}" and pre-allocated squad space.`);
    setInvitePlayerName("");
  };

  const handlePromoteMember = () => {
    if (!promoteMemberName) return;

    setCommunityTeams(prev => prev.map(t => {
      if (t.id === selectedMyTeamId) {
        return {
          ...t,
          members: t.members.map(m => {
            if (m.name === promoteMemberName) {
              return { ...m, role: selectedMemberRole };
            }
            return m;
          }),
          chat: [...t.chat, { sender: "System", text: `${promoteMemberName} role reassigned to ${selectedMemberRole}.`, time: "Now" }]
        };
      }
      return t;
    }));

    setSystemAlertMessage(`🎉 Demoted/Promoted member "${promoteMemberName}" to ${selectedMemberRole}!`);
    setPromoteMemberName("");
  };

  const handleTeamPostAnnouncement = () => {
    if (!newAnnouncementMsg) return;

    setCommunityTeams(prev => prev.map(t => {
      if (t.id === selectedMyTeamId) {
        return {
          ...t,
          announcements: [
            { id: `an-${Date.now()}`, msg: newAnnouncementMsg, date: "Today" },
            ...t.announcements
          ]
        };
      }
      return t;
    }));

    setNewAnnouncementMsg("");
    setSystemAlertMessage("📢 New announcement bulletin published to all team devices.");
  };

  const handleSendTeamChat = () => {
    if (!teamChatMessage) return;

    setCommunityTeams(prev => prev.map(t => {
      if (t.id === selectedMyTeamId) {
        return {
          ...t,
          chat: [
            ...t.chat,
            { sender: userSession.ign || "ApexPlayer", text: teamChatMessage, time: "Now" }
          ]
        };
      }
      return t;
    }));

    setTeamChatMessage("");
  };

  const handlePublishRecruitment = () => {
    setCommunityTeams(prev => prev.map(t => {
      if (t.id === selectedMyTeamId) {
        return {
          ...t,
          recruitmentStatus: "Open",
          recruitmentPost: {
            requiredRank: reqRank,
            rolesNeeded: reqRoles.split(",").map(r => r.trim()),
            experienceLevel: reqExp,
            availability: reqAvail
          }
        };
      }
      return t;
    }));

    setSystemAlertMessage("🔥 Active Recruitment Board post populated for your team profile!");
  };

  const handleApplyToTeam = (teamId: string) => {
    if (appliedTeams.includes(teamId)) return;
    setAppliedTeams(prev => [...prev, teamId]);
    setSystemAlertMessage("📩 Roster entry application forwarded to the division Captain!");
  };

  const handleApplyTeamVerification = (teamId: string) => {
    if (!verifyChecklistStatus.tournamentJoined) {
      setSystemAlertMessage("⚠️ Your team must sign up for at least one active tournament match before request certification!");
      return;
    }

    setCommunityTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, isVerified: true };
      }
      return t;
    }));
    setSystemAlertMessage("✅ Dynamic qualification check passed! Certified Verified Team badge granted!");
  };

  const selectedMyTeam = communityTeams.find(t => t.id === selectedMyTeamId);
  const activeTourneyCreation = tourRequests.find(t => t.status === "Approved") || tourRequests[0];

  // Filters calculation
  const displayedTeams = communityTeams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === "All" || t.region === filterRegion;
    const matchesRecruiting = filterRecruiting === "All" || (filterRecruiting === "Open" && t.recruitmentStatus === "Open") || (filterRecruiting === "Closed" && t.recruitmentStatus === "Closed");
    return matchesSearch && matchesRegion && matchesRecruiting;
  });

  return (
    <div className="bg-[#090909] border border-zinc-900 rounded-3xl p-6 space-y-6 text-left relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0c1d1a,transparent_75%)] pointer-events-none opacity-45" />

      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/20 border border-emerald-500/20 rounded-full">
            <Compass size={11} className="text-emerald-400" />
            <span className="text-[8px] text-emerald-400 font-extrabold tracking-widest font-mono uppercase">CV COMMUNITY HUB</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-orbitron tracking-wide text-white uppercase">
            COMMUNITY <span className="text-emerald-500">PLAYGROUND</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            Host local community tournaments or create customized Teams to practice and recruit within our non-exclusive, casual ecosystem.
          </p>
        </div>

        {/* Action Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={() => setActiveTab("teams-manager")}
            className={`px-3 py-1.5 border rounded-lg text-[9px] uppercase tracking-wider transition-colors ${
              activeTab === "teams-manager"
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/55 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-black/30 text-zinc-400 border-zinc-900 hover:text-white"
            }`}
          >
            👥 My Community Teams
          </button>
          <button
            onClick={() => setActiveTab("team-discovery")}
            className={`px-3 py-1.5 border rounded-lg text-[9px] uppercase tracking-wider transition-colors ${
              activeTab === "team-discovery"
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/55 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-black/30 text-zinc-400 border-zinc-900 hover:text-white"
            }`}
          >
            🔍 Discovery Hub
          </button>
          <button
            onClick={() => setActiveTab("hosting-requests")}
            className={`px-3 py-1.5 border rounded-lg text-[9px] uppercase tracking-wider transition-colors ${
              activeTab === "hosting-requests"
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/55 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-black/30 text-zinc-400 border-zinc-900 hover:text-white"
            }`}
          >
            🏆 Request Host Permission
          </button>
          <button
            onClick={() => setActiveTab("host-dashboard")}
            className={`px-3 py-1.5 border rounded-lg text-[9px] uppercase tracking-wider transition-colors ${
              activeTab === "host-dashboard"
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/55 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                : "bg-black/30 text-zinc-400 border-zinc-900 hover:text-white"
            }`}
          >
            ⚙️ Approved Host Deck
          </button>
        </div>
      </div>

      {/* PROMOTION OF SEPARATE HIGHER SECTORS (COMMUNITY SQUADS & TDM ARENA) */}
      <div className="relative z-10 bg-gradient-to-r from-red-950/20 via-[#07130f]/30 to-zinc-950 border border-[#ff001c]/15 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left space-y-1">
          <span className="text-[8px] font-mono font-extrabold text-[#ff001c] tracking-widest uppercase bg-red-950/40 border border-red-500/20 px-2 py-0.5 rounded-full inline-block">
            RECOMMENDED FOR CLANS
          </span>
          <h4 className="text-xs font-black text-white uppercase font-orbitron">Looking for Authorized Squads or Live TDM Matchmaking?</h4>
          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans max-w-xl">
            Our exclusive **Community Squads** registry and **CV TDM Arena** match certification systems are located in their own dedicated workspaces for premium competitive gameplay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono">
          <button
            onClick={() => {
              if (setGlobalActiveTab) {
                setGlobalActiveTab("communitySquads");
                setSystemAlertMessage("👥 Direct navigated to Community Squads Hub in 1-Click.");
              }
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-[#500e16] to-[#af0e20]/60 hover:from-red-650 hover:to-red-500 text-white text-[9.5px] font-bold uppercase rounded-lg hover:scale-105 transition-all cursor-pointer border border-[#ff001c]/35 shadow-[0_0_10px_rgba(255,0,31,0.15)]"
          >
            👥 Community Squads Hub
          </button>
          <button
            onClick={() => {
              if (setGlobalActiveTab) {
                setGlobalActiveTab("tdmArena");
                setSystemAlertMessage("⚔️ Direct navigated to CV TDM Arena Matchmaking in 1-Click.");
              }
            }}
            className="px-3.5 py-2 bg-[#0c1f18] hover:bg-[#10b981]/25 border border-emerald-500/30 text-emerald-400 text-[9.5px] font-bold uppercase rounded-lg hover:scale-105 transition-all cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            ⚔️ CV TDM Arena
          </button>
        </div>
      </div>

      {/* RENDER VIEWPORTS */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">

          {/* ================================== TOURNAMENT HOST REQUEST SYSTEM ================================== */}
          {activeTab === "hosting-requests" && (
            <motion.div
              key="hosting-requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#040908]/90 border border-emerald-950/50 p-6 rounded-2xl space-y-4">
                  <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">APPLICATION REGISTRY</span>
                      <h4 className="text-sm font-black font-orbitron text-white uppercase flex items-center gap-1.5">
                        <Trophy size={14} className="text-emerald-500" />
                        SUBMIT NEW TOURNAMENT INTENTION REPORT
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">Form validation active</span>
                  </div>

                  <form onSubmit={handleCreateTournamentRequest} className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Tournament Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Thunderdome Winter Finals"
                          value={reqName}
                          onChange={(e) => setReqName(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-400 block uppercase">Format *</label>
                          <select
                            value={reqType}
                            onChange={(e) => setReqType(e.target.value)}
                            className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                          >
                            <option value="Solo">Solo Match</option>
                            <option value="Duo">Duo Match</option>
                            <option value="Squad">Squad Match</option>
                            <option value="TDM">TDM Arena</option>
                            <option value="Arena">1v1 Gladiators</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-400 block uppercase">Network Area *</label>
                          <select
                            value={reqRegion}
                            onChange={(e) => setReqRegion(e.target.value)}
                            className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                          >
                            <option value="Africa">Africa Network</option>
                            <option value="Europe">Europe Network</option>
                            <option value="Asia">Asia Network</option>
                            <option value="Middle East">Middle East</option>
                            <option value="North America">North America</option>
                            <option value="South America">South America</option>
                            <option value="Oceania">Oceania</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 block uppercase">Event Concept Description *</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Detail the target audience, format structure, maps played, or community goal..."
                        value={reqDesc}
                        onChange={(e) => setReqDesc(e.target.value)}
                        className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 block uppercase">Match/TDM Ruleset Parameters</label>
                      <textarea
                        rows={2}
                        placeholder="Rules, bans (e.g. tablet device limitations, specific throwables bans)..."
                        value={reqRules}
                        onChange={(e) => setReqRules(e.target.value)}
                        className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Prize Pool Offering *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. $500 cash bounty"
                          value={reqPrize}
                          onChange={(e) => setReqPrize(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Sponsor Support</label>
                        <input
                          type="text"
                          placeholder="e.g. G-Fuel, Self-funded"
                          value={reqSponsor}
                          onChange={(e) => setReqSponsor(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Preferred Dates *</label>
                        <input
                          type="date"
                          required
                          value={reqDate}
                          onChange={(e) => setReqDate(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Contact Info *</label>
                        <input
                          type="text"
                          required
                          placeholder="WhatsApp, Telegram or Discord tag"
                          value={reqContact}
                          onChange={(e) => setReqContact(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Expected Roster volume</label>
                        <input
                          type="number"
                          value={reqTeams}
                          onChange={(e) => setReqTeams(parseInt(e.target.value) || 16)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400 block uppercase">Streaming Details</label>
                        <input
                          type="text"
                          placeholder="Twitch/YouTube handle linkage"
                          value={reqStream}
                          onChange={(e) => setReqStream(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer duration-150 active:scale-95 text-center block"
                    >
                      SUBMIT HOSTING INTENT DISPATCH 🚀
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar tracker: Application status list & Host Rating details */}
              <div className="space-y-6">
                
                {/* TRACK APPLICATION */}
                <div className="bg-[#050510]/50 border border-blue-950/50 p-5 rounded-2xl space-y-4">
                  <div className="border-b border-zinc-900 pb-2">
                    <span className="text-[8px] font-mono text-blue-400 block uppercase">REAL-TIME MONITOR</span>
                    <h4 className="text-xs font-black font-orbitron text-white uppercase">SUBMITTED DISPATCH STATUS</h4>
                  </div>

                  <div className="space-y-3 font-mono">
                    {tourRequests.map((tr) => (
                      <div key={tr.id} className="bg-black/60 p-3.5 rounded-xl border border-zinc-900 space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[11px] font-bold text-white uppercase truncate">{tr.name}</span>
                          <span className={`px-2 py-0.5 text-[8px] font-black rounded border-0 uppercase ${
                            tr.status === "Approved" ? "bg-emerald-950/30 text-emerald-400" :
                            tr.status === "Pending Review" ? "bg-amber-950/30 text-amber-500" :
                            tr.status === "Requires Changes" ? "bg-blue-955/30 text-blue-400" :
                            "bg-red-955/30 text-red-500"
                          }`}>
                            {tr.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[9px] text-zinc-400">
                          <span>REG: <strong>{tr.region}</strong></span>
                          <span>LEVEL: <strong>{tr.permissionLevel}</strong></span>
                        </div>

                        <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[8px] text-zinc-500">
                          <span>Dates: {tr.preferredDates}</span>
                          <span className="text-zinc-650">Host: {tr.applicantName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TRUSTED HOST RATINGS */}
                <div className="bg-[#0b0805]/50 border border-amber-955/20 p-5 rounded-2xl space-y-4">
                  <div className="border-b border-zinc-900 pb-2">
                    <span className="text-[8px] font-mono text-amber-500 block uppercase">CREDIBILITY DECK</span>
                    <h4 className="text-xs font-black font-orbitron text-white uppercase">COMMUNITY HOST METRIC CORE</h4>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Events Completed:</span>
                      <strong className="text-white text-[11px]">{hostStats.eventsHosted} matches</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reliability Index:</span>
                      <strong className="text-emerald-400 text-[11px] font-bold">{hostStats.reliabilityScore}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Community Reviews:</span>
                      <span className="text-[10px] text-amber-400 font-bold">★ {hostStats.playerReviews} / 5</span>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900/80 flex items-center gap-3">
                      <ShieldCheck size={28} className="text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-wide block">TRUSTED COMPLIANCE BADGE</span>
                        <p className="text-[8.5px] text-zinc-500">Granted to operators with over 10 validated error-free brackets.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ================================== TOURNAMENT HOST DASHBOARD (APPROVED) ================================== */}
          {activeTab === "host-dashboard" && (
            <motion.div
              key="host-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 space-y-4 font-mono">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
                  <div>
                    <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">HOST WORKSPACE DECK</span>
                    <h2 className="text-lg font-black text-stone-100 uppercase">
                      MANAGER CONSOLE — {activeTourneyCreation?.name || "No Event Managed"}
                    </h2>
                  </div>
                  <div className="flex bg-black/80 rounded-lg p-1 border border-zinc-800">
                    {[
                      { id: "creation", label: "Tools" },
                      { id: "registration", label: "Registration" },
                      { id: "scheduling", label: "Schedule" },
                      { id: "announcements", label: "Announce" },
                      { id: "results", label: "Winner Reports" }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setActiveHostTab(st.id as any)}
                        className={`px-3 py-1 text-[8.5px] rounded border uppercase font-bold tracking-wider ${
                          activeHostTab === st.id
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/60"
                            : "bg-transparent border-transparent text-zinc-400 hover:text-stone-200"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub Tab Viewpoints */}
                <div className="p-4 bg-black/40 border border-zinc-900 rounded-xl">
                  {activeHostTab === "creation" && (
                    <div className="space-y-3 text-xs">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider text-emerald-400">🚨 CORE TOURNAMENT CREATION ENGINE</h4>
                      <p className="text-[11px] text-zinc-400">Use this cockpit to deploy visual bracket trees, configure dynamic double elimination parameters, or pre-allocate custom host matches directly inside our server nodes.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <button onClick={() => setSystemAlertMessage("📡 Initializing bracket registry. Auto-allocating 16 slots nodes...")} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-900/40 px-3 py-2.5 rounded-lg text-left">
                          <strong className="block text-[10px] font-black uppercase text-white">Generate Bracket Matrix</strong>
                          <span className="text-[8.5px] text-zinc-500">Auto seed team slots based on signup order.</span>
                        </button>
                        <button onClick={() => setSystemAlertMessage("📡 Loading custom map layout maps to server registry index...")} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 px-3 py-2.5 rounded-lg text-left">
                          <strong className="block text-[10px] font-bold uppercase text-white">Preload Lobby maps</strong>
                          <span className="text-[8.5px] text-zinc-500">Veto active maps for bracket maps pool.</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeHostTab === "registration" && (
                    <div className="space-y-3 text-xs">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider text-emerald-400">📋 REGISTERED SQUAD APPLICATIONS DIALOG</h4>
                      <p className="text-[11px] text-zinc-400">Incoming entry lists received. Approved squads qualify for matches seeding.</p>
                      
                      <div className="bg-zinc-950/80 rounded-xl border border-zinc-900 p-2.5 space-y-2">
                        <div className="flex justify-between items-center text-[10px] bg-black/60 p-2 rounded border border-zinc-900">
                          <div>
                            <span className="text-white font-black">[SNIP] Shadow Snipers (Africa)</span>
                            <span className="text-zinc-500 block text-[8.5px]">Avg Rank: Platinum III | Verified: Yes</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSystemAlertMessage("Approved team slots")} className="px-2 py-1 bg-emerald-950/30 text-emerald-400 rounded border border-emerald-800/30 font-bold uppercase text-[8px]">Accept</button>
                            <button onClick={() => setSystemAlertMessage("Rejected registration")} className="px-2 py-1 bg-red-955/30 text-red-500 rounded border border-red-800/20 font-bold uppercase text-[8px]">Decline</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHostTab === "scheduling" && (
                    <div className="space-y-4 text-xs">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider text-emerald-400">📅 BRACKET MATCH SCHEDULER & BROADCAST DECK</h4>
                      
                      <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[8.5px] text-zinc-500 block uppercase">ACTIVE DUEL SADDLE</span>
                            <div className="text-xs space-y-1 font-bold">
                              <div>Match ROUND: <span className="text-emerald-400">{schedulingMatch.round}</span></div>
                              <div>BLUE: <span className="text-white">{schedulingMatch.bName}</span> vs RED: <span className="text-red-500">{schedulingMatch.rName}</span></div>
                              <div>Date/Time: <span className="text-zinc-400">{schedulingMatch.date} @ {schedulingMatch.time}</span></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] text-zinc-500 block uppercase">Assign Cast Stream</label>
                            <input
                              type="text"
                              className="bg-black text-[#ff001c] text-xs font-mono border border-zinc-850 p-1.5 rounded w-full outline-none focus:border-[#ff001c]"
                              defaultValue="https://twitch.tv/cv_esports_cast"
                            />
                            <button onClick={() => setSystemAlertMessage("Broadcast stream linked successfully!")} className="w-full bg-[#ff001c] hover:bg-[#ff1c33] text-white text-[9px] font-black uppercase py-1 px-2 rounded">
                              Link Stream Feed
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHostTab === "announcements" && (
                    <div className="space-y-3 text-xs">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider text-emerald-400">📢 OPERATIONAL ANNOUNCEMENT DISPATCH</h4>
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Submit bracket delay notification, rules adjustment reminders..."
                          className="w-full bg-black border border-zinc-800 p-2 text-white outline-none text-xs"
                        />
                        <button onClick={() => setSystemAlertMessage("📢 Announcement posted!")} className="bg-emerald-500 text-black font-black text-[9px] uppercase px-3 py-1.5 rounded">
                          Broadcast Bulletin
                        </button>
                      </div>
                    </div>
                  )}

                  {activeHostTab === "results" && (
                    <div className="space-y-3 text-xs">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-wider text-emerald-400">🛡️ WINNER SCOREBOARDS REPORT ACCORDION</h4>
                      <p className="text-[11px] text-zinc-400">Approve final validated leaderboard entries submitted by player representatives.</p>
                      
                      <div className="bg-[#111] p-3 rounded-xl border border-zinc-900 flex justify-between items-center text-[10px]">
                        <div>
                          <strong>MATCH #24 RESULT REPORT:</strong>
                          <span className="block text-zinc-500 text-[8.5px]">Blue Crew A wins (40 - 32) vs Red Crew B</span>
                        </div>
                        <button onClick={() => setSystemAlertMessage("Leaderboard points applied successfully!")} className="bg-emerald-500 text-black font-black uppercase text-[8.5px] px-3 py-1 rounded">
                          Validate & Append AP Points
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================================== TS COMMUNITY TEAMS MANAGER ================================== */}
          {activeTab === "teams-manager" && (
            <motion.div
              key="teams-manager"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 animate-fade-in"
            >
              {/* Creator Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Creator Panel */}
                <div className="bg-[#050b07]/60 border border-emerald-950/45 p-5 rounded-2xl space-y-4">
                  <div className="border-b border-zinc-900 pb-2">
                    <span className="text-[8px] font-mono text-emerald-400 block uppercase font-black">ESTABLISHMENT COMPLIANCE</span>
                    <h3 className="text-sm font-black font-orbitron text-white uppercase">CREATE A NEW SQUAD LINEUP</h3>
                  </div>

                  <form onSubmit={handleCreateCommunityTeam} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 uppercase block">Team Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Vipers Academy"
                        value={cTeamName}
                        onChange={(e) => setCTeamName(e.target.value)}
                        className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 uppercase block">Official Tag (3 chars) *</label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          placeholder="BSC"
                          value={cTeamTag}
                          onChange={(e) => setCTeamTag(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none uppercase"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 uppercase block">Team Region *</label>
                        <select
                          value={cTeamRegion}
                          onChange={(e) => setCTeamRegion(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
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

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 uppercase block">Emblem Emblem</label>
                        <select
                          value={cTeamLogo}
                          onChange={(e) => setCTeamLogo(e.target.value)}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        >
                          <option value="🛡️">🛡️ Shield Emblem</option>
                          <option value="⚔️">⚔️ Ares Swords</option>
                          <option value="🎯">🎯 Marksman Bullseye</option>
                          <option value="🔥">🔥 Crimson Fire</option>
                          <option value="👑">👑 Apex Crown</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 uppercase block">Recruitment Status</label>
                        <select
                          value={cTeamRecruitment}
                          onChange={(e) => setCTeamRecruitment(e.target.value as "Open" | "Closed")}
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none"
                        >
                          <option value="Open">Open recruiting</option>
                          <option value="Closed">Invite only</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-400 uppercase block">Description *</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Detail team objectives, schedules, entry requirement standards..."
                        value={cTeamDesc}
                        onChange={(e) => setCTeamDesc(e.target.value)}
                        className="w-full bg-black border border-zinc-800 focus:border-emerald-500 rounded p-2 text-white outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[9.5px] uppercase tracking-wider rounded-xl cursor-pointer duration-150 active:scale-95 text-center block"
                    >
                      ESTABLISH SQUAD LINEUP 🚀
                    </button>
                  </form>
                </div>

                {/* Team Roster / Settings Console */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Select established team tabs */}
                  <div className="flex bg-black p-1 border border-zinc-900 rounded-xl">
                    {communityTeams.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedMyTeamId(t.id)}
                        className={`flex-1 py-2 text-[10px] font-mono rounded border uppercase font-bold tracking-wider ${
                          selectedMyTeamId === t.id
                            ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/60"
                            : "bg-transparent border-transparent text-zinc-500 hover:text-stone-300"
                        }`}
                      >
                        {t.logo} {t.name} [{t.tag}]
                      </button>
                    ))}
                  </div>

                  {selectedMyTeam ? (
                    <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl relative overflow-hidden space-y-6">
                      
                      {/* Gradient header banner */}
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedMyTeam.banner} flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative`}>
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{selectedMyTeam.logo}</span>
                            <h2 className="text-lg font-black font-orbitron text-white tracking-wide uppercase">
                              {selectedMyTeam.name}
                            </h2>
                            {selectedMyTeam.isVerified && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-500 text-emerald-400 text-[8px] font-black uppercase rounded-full">
                                <ShieldCheck size={9} /> VERIFIED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-300 max-w-md">{selectedMyTeam.description}</p>
                        </div>

                        {/* Verify status checklist helper */}
                        {!selectedMyTeam.isVerified && (
                          <div className="bg-black/80 p-3 rounded-lg border border-zinc-800 text-[9px] font-mono text-zinc-400 max-w-xs text-left">
                            <span className="text-amber-500 font-bold block uppercase mb-1">✅ APPLY FOR CERTIFIED BADGE</span>
                            <div className="space-y-1 text-[8.5px]">
                              <div>• Account Standing check: <span className="text-emerald-400">PASSED</span></div>
                              <div>• complete team Profile details: <span className="text-emerald-400">PASSED</span></div>
                              <div className="flex items-center justify-between">
                                <span>• Join 1 community tourney:</span>
                                <button onClick={() => setVerifyChecklistStatus(prev => ({ ...prev, tournamentJoined: true }))} className="px-1.5 py-0.2 bg-zinc-800 text-stone-300 rounded hover:bg-zinc-700">Set Mock Joined</button>
                              </div>
                            </div>
                            <button
                              onClick={() => handleApplyTeamVerification(selectedMyTeam.id)}
                              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[8px] py-1 uppercase rounded"
                            >
                              CLAIM CERTIFICATION BADGE
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Team Stats Summary */}
                      <div className="grid grid-cols-3 gap-3 text-center font-mono">
                        <div className="bg-black/50 p-3 rounded-xl border border-zinc-900/60">
                          <span className="text-[8px] text-zinc-550 block uppercase">MATCHES</span>
                          <strong className="text-sm font-bold text-white mt-1 block">{selectedMyTeam.stats.matches}</strong>
                        </div>
                        <div className="bg-black/50 p-3 rounded-xl border border-zinc-900/60">
                          <span className="text-[8px] text-zinc-550 block uppercase">W / L LEDGERS</span>
                          <strong className="text-sm font-bold text-emerald-400 mt-1 block">{selectedMyTeam.stats.wins} Wins</strong>
                        </div>
                        <div className="bg-black/50 p-3 rounded-xl border border-zinc-900/60">
                          <span className="text-[8px] text-zinc-550 block uppercase">WIN RATIO</span>
                          <strong className="text-sm font-bold text-amber-500 mt-1 block">{selectedMyTeam.stats.ratio} WR</strong>
                        </div>
                      </div>

                      {/* Owner Controls Module */}
                      <div className="border-t border-zinc-900/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Invites & promotions options */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-white font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                            <Settings size={12} /> OWNER MANAGEMENT CONSOLE
                          </h4>

                          <div className="space-y-3 font-mono text-[10px]">
                            {/* Invite Block */}
                            <div className="space-y-1">
                              <label className="text-zinc-400 uppercase">Invite Player by IGN / ID</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="e.g. CV_Slayer"
                                  value={invitePlayerName}
                                  onChange={(e) => setInvitePlayerName(e.target.value)}
                                  className="flex-1 bg-black border border-zinc-800 p-1.5 text-white outline-none rounded"
                                />
                                <button
                                  type="button"
                                  onClick={handleInvitePlayer}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-3 rounded text-[9px] uppercase"
                                >
                                  Invite
                                </button>
                              </div>
                            </div>

                            {/* Promote Block */}
                            <div className="space-y-1">
                              <label className="text-zinc-400 uppercase">Reassign Crew Roles</label>
                              <div className="flex gap-1.5">
                                <select
                                  value={promoteMemberName}
                                  onChange={(e) => setPromoteMemberName(e.target.value)}
                                  className="flex-1 bg-black border border-zinc-800 text-white p-1 text-[9.5px] outline-none rounded"
                                >
                                  <option value="">Select Member...</option>
                                  {selectedMyTeam.members.map(m => (
                                    <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                                  ))}
                                </select>
                                <select
                                  value={selectedMemberRole}
                                  onChange={(e) => setSelectedMemberRole(e.target.value as any)}
                                  className="bg-black border border-zinc-800 text-stone-200 text-[9.5px] outline-none rounded p-1"
                                >
                                  <option value="Captain">Captain</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Player">Player</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={handlePromoteMember}
                                  className="bg-zinc-800 hover:bg-zinc-700 text-stone-300 font-bold px-3 rounded text-[9px] uppercase"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Announcements & team chat boards */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-white font-mono uppercase tracking-widest text-[#10b981] flex items-center gap-1.5">
                            <Megaphone size={12} /> BULLETIN DISPATCH
                          </h4>

                          <div className="space-y-2 font-mono text-[10px]">
                            <textarea
                              rows={2}
                              placeholder="Dispatch squad rules bulletin or training hours schedules..."
                              value={newAnnouncementMsg}
                              onChange={(e) => setNewAnnouncementMsg(e.target.value)}
                              className="w-full bg-black border border-zinc-800 p-2 text-white outline-none rounded text-xs resize-none"
                            />
                            <button
                              type="button"
                              onClick={handleTeamPostAnnouncement}
                              className="bg-emerald-500 text-black font-black text-[8.5px] py-1 px-3 uppercase rounded block ml-auto"
                            >
                              Dispatch Announcement
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Recruitment publisher page block */}
                      <div className="border-t border-zinc-900/60 pt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-white font-mono uppercase tracking-widest text-[#10b981] flex items-center gap-1.5">
                            <Sparkles size={12} /> SQUAD RECRUITMENT PARAMETERS DECK
                          </h4>
                          <span className="text-[8.5px] font-mono text-zinc-500">Board listing is active</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[10px] font-mono">
                          <div className="space-y-1">
                            <label className="text-zinc-500 block uppercase">Min Tier Required</label>
                            <input type="text" value={reqRank} onChange={(e) => setReqRank(e.target.value)} className="w-full bg-black border border-zinc-855 rounded p-1.5 text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 block uppercase">Vacant Roles Needed</label>
                            <input type="text" value={reqRoles} onChange={(e) => setReqRoles(e.target.value)} className="w-full bg-black border border-zinc-855 rounded p-1.5 text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 block uppercase">Minimum Experience</label>
                            <input type="text" value={reqExp} onChange={(e) => setReqExp(e.target.value)} className="w-full bg-black border border-zinc-855 rounded p-1.5 text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-zinc-500 block uppercase">Weekly Availability</label>
                            <input type="text" value={reqAvail} onChange={(e) => setReqAvail(e.target.value)} className="w-full bg-black border border-zinc-855 rounded p-1.5 text-white" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handlePublishRecruitment}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black uppercase rounded-lg tracking-wider"
                        >
                          PUBLISH SQUAD VACANCY dispatches
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-10 bg-black/40 border border-zinc-900 rounded-2xl">
                      <Users size={32} className="text-zinc-650 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400">Establish or choose a Community roster to enable owner systems.</p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* ================================== TS SQUAD RECRUITMENT DISCOVERY HUB ================================== */}
          {activeTab === "team-discovery" && (
            <motion.div
              key="team-discovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filter hub header */}
              <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 relative w-full max-w-sm">
                  <Search size={14} className="text-zinc-500 absolute left-2.5" />
                  <input
                    type="text"
                    placeholder="Search by Team Name or short Tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-zinc-850 rounded p-1.5 pl-8 text-white focus:border-emerald-500 outline-none placeholder-zinc-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500 uppercase text-[9px]">Region:</span>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="bg-black border border-zinc-850 rounded text-stone-200 p-1 font-sans text-xs"
                    >
                      <option value="All">All Networks</option>
                      <option value="Africa">Africa</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Middle East">Middle East</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500 uppercase text-[9px]">Recruiting:</span>
                    <select
                      value={filterRecruiting}
                      onChange={(e) => setFilterRecruiting(e.target.value)}
                      className="bg-black border border-zinc-850 rounded text-stone-200 p-1 font-sans text-xs"
                    >
                      <option value="All">All States</option>
                      <option value="Open">Recruitment Open</option>
                      <option value="Closed">Closed / Full</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Roster entries bento lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTeams.map(t => (
                  <div key={t.id} className="bg-[#050505] p-5 rounded-2xl border border-zinc-900/90 relative overflow-hidden flex flex-col justify-between hover:border-zinc-850 duration-200">
                    <div className="space-y-4">
                      {/* Logo tag banner row */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{t.logo}</span>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-white uppercase">{t.name}</span>
                              {t.isVerified && <span className="inline-block text-[#10b981] text-[9px]">✅</span>}
                            </div>
                            <span className="text-[9px] font-mono font-black text-emerald-400">[{t.tag}] • {t.region} Region</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded ${
                          t.recruitmentStatus === "Open" ? "bg-emerald-950/20 text-[#10b981]" : "bg-zinc-900 text-zinc-500"
                        }`}>
                          RECRUIT: {t.recruitmentStatus}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 leading-normal font-sans py-1">{t.description}</p>

                      {/* Recruitment rules post context */}
                      {t.recruitmentPost && (
                        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 space-y-1.5 text-[9.5px] font-mono text-left">
                          <span className="text-emerald-400 font-extrabold uppercase block text-[8px]">🎯 VACATION REQUIREMENTS BOARD</span>
                          <div>• Target Bracket: <span className="text-white font-bold">{t.recruitmentPost.requiredRank}</span></div>
                          <div>• Roles Open: <span className="text-white">{t.recruitmentPost.rolesNeeded.join(", ")}</span></div>
                          <div className="text-zinc-500 italic block mt-0.5">"{t.recruitmentPost.experienceLevel}"</div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-zinc-900/60 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1 font-bold text-zinc-400">
                        <span>👥 {t.members.length} members</span>
                        <span className="text-zinc-700 font-normal">|</span>
                        <span>WR: <strong className="text-emerald-400">{t.stats.ratio}</strong></span>
                      </div>

                      <button
                        onClick={() => handleApplyToTeam(t.id)}
                        disabled={appliedTeams.includes(t.id) || t.recruitmentStatus !== "Open"}
                        className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-wider cursor-pointer duration-150 ${
                          appliedTeams.includes(t.id)
                            ? "bg-emerald-950/20 text-[#10b981] border-emerald-800/40"
                            : t.recruitmentStatus === "Open"
                            ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981]/20 active:scale-95"
                            : "bg-zinc-950 text-zinc-650 border-zinc-900 cursor-not-allowed"
                        }`}
                      >
                        {appliedTeams.includes(t.id) ? "Applied ✓" : "Apply Entry"}
                      </button>
                    </div>
                  </div>
                ))}

                {displayedTeams.length === 0 && (
                  <div className="col-span-full text-center py-10 bg-black/40 border border-zinc-900 rounded-3xl font-mono text-xs text-zinc-500">
                    No community lines matched search matrices. Create yours above!
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
