import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, Crown, Users, Trophy, Gamepad2, Database, AlertOctagon, Terminal,
  Coins, TrendingUp, Cpu, Globe, Server, RefreshCw, Key, Search, FileText,
  UserCheck, ShieldAlert, BadgeInfo, Bell, Send, Edit, Trash2, CheckCircle,
  Plus, Settings, DollarSign, Activity, Lock, Unlock, Eye, HelpCircle,
  Mail, Video, Award, Star, List, Filter, Play, Trash, Check, X, Smartphone,
  Radio, Volume2, ShieldCheck, Flame, Zap
} from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  ign: string;
  role: "Owner" | "Head Admin" | "Admin" | "Captain" | "Player" | "User";
  status: "Active" | "Suspended" | "Banned" | "Pending Approval";
  region: string;
  reputation: number;
}

interface EsportsControlCenterProps {
  userSession: { ign: string; role: string; coins: number; battlePassLevel: number };
  systemAlertMessage: string | null;
  setSystemAlertMessage: (msg: string | null) => void;
  setActiveTab?: (tab: string) => void;
  sentinelStatus?: {
    integrityScore: number;
    isHealthy: boolean;
    lastPingTime: string;
    checks: { id: string; name: string; status: "success" | "failure" | "pending"; details: string }[];
  };
  onSelfRepair?: () => void;
}

export default function EsportsControlCenter({ 
  userSession, 
  systemAlertMessage, 
  setSystemAlertMessage, 
  setActiveTab,
  sentinelStatus,
  onSelfRepair
}: EsportsControlCenterProps) {
  const [isWaLinked, setIsWaLinked] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cv_whatsapp_user_profiles");
      if (saved) {
        const profiles = JSON.parse(saved);
        setIsWaLinked(!!profiles[userSession.ign]?.isVerified);
      }
    } catch (e) {
      console.error(e);
    }
  }, [userSession.ign]);

  // Main Panel Mode Toggle
  const [panelViewMode, setPanelViewMode] = useState<"owner" | "admin">("owner");
  const [mobileSimulatorActive, setMobileSimulatorActive] = useState(false);

  // Active sub-tabs
  const [ownerActiveTab, setOwnerActiveTab] = useState<"overview" | "platform" | "analytics" | "finance" | "ai" | "regional" | "events" | "security" | "audit">("overview");
  const [adminActiveTab, setAdminActiveTab] = useState<"members" | "tournaments" | "scrims" | "tdm" | "banners" | "content" | "streamers" | "teams" | "rewards" | "legends">("members");

  // Mock database states that update dynamically
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [emergencyAnnouncement, setEmergencyAnnouncement] = useState("");
  const [liveLogStream, setLiveLogStream] = useState<string[]>([
    "🛡️ System initialization complete. Security matrix fully loaded.",
    "📡 Server Node ZA-Primary reporting sub-12ms global gateway ping.",
    "🤖 Match Verification Bot verified TDM Duel ID #19385.",
    "🏆 Sponsor G-Fuel deposited $1,500 priority bounty balance.",
    "👥 Community Team [BSC] requested Verified Status badge."
  ]);

  // Terminal log additions
  const addLog = (logText: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLiveLogStream(prev => [`[${timestamp}] ${logText}`, ...prev.slice(0, 7)]);
  };

  // Stats Counters
  const [metrics, setMetrics] = useState({
    totalUsers: 14285,
    totalTeams: 342,
    totalCommSquads: 184,
    totalExclSquads: 16,
    totalTournaments: 48,
    totalScrims: 195,
    totalTdmMatches: 1205,
    activeRegistrations: 74,
    activeStreamers: 12,
    healthStatus: "100% Operational"
  });

  // User directory
  const [users, setUsers] = useState<UserRecord[]>([
    { id: "usr-1", name: "Prince Mucheche", ign: "Ares_Leader", role: "Owner", status: "Active", region: "Africa", reputation: 98 },
    { id: "usr-2", name: "Slayer Vesper", ign: "Vesper_CV", role: "Head Admin", status: "Active", region: "Europe", reputation: 95 },
    { id: "usr-3", name: "Tariq Malik", ign: "Zodiac_Rider", role: "Admin", status: "Active", region: "Middle East", reputation: 90 },
    { id: "usr-4", name: "John Doe", ign: "ToxicSniper", role: "User", status: "Pending Approval", region: "North America", reputation: 45 },
    { id: "usr-5", name: "Sarah Connor", ign: "Chrono_Queen", role: "Captain", status: "Suspended", region: "South America", reputation: 70 },
    { id: "usr-6", name: "Akira Tanaka", ign: "Shinobi_7", role: "Player", status: "Active", region: "Asia", reputation: 88 }
  ]);

  // Financial Ledger
  const [sponsors, setSponsors] = useState([
    { id: "sp-1", name: "G-FUEL Energy", tier: "Diamond Sponsor", pledged: 8500, status: "Active" },
    { id: "sp-2", name: "DXRacer Gaming", tier: "Gold Partner", pledged: 4200, status: "Active" }
  ]);
  const [financials, setFinancials] = useState({
    prizeFund: 18500,
    contributions: 12700,
    tournamentRev: 21400,
    eventExpenses: 9400
  });

  const [sponsorName, setSponsorName] = useState("");
  const [sponsorTier, setSponsorTier] = useState("Gold Partner");
  const [sponsorPledge, setSponsorPledge] = useState("");

  const handleCreateSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName || !sponsorPledge) return;
    const pledgeAmount = parseFloat(sponsorPledge) || 0;
    const newSponsor = {
      id: `sp-${Date.now()}`,
      name: sponsorName,
      tier: sponsorTier,
      pledged: pledgeAmount,
      status: "Active"
    };
    setSponsors(prev => [...prev, newSponsor]);
    setFinancials(prev => ({
      ...prev,
      contributions: prev.contributions + pledgeAmount,
      prizeFund: prev.prizeFund + pledgeAmount
    }));
    setSponsorName("");
    setSponsorPledge("");
    setSystemAlertMessage(`💰 Added new Sponsor "${sponsorName}" with pledged funds of $${pledgeAmount}`);
    addLog(`Audit: Sponsor "${sponsorName}" added with $${pledgeAmount} balance.`);
  };

  // AI config states
  const [aiConfig, setAiConfig] = useState({
    temp: 0.65,
    maxTokens: 500,
    moderationLevel: "Medium Safeguards",
    knowledgeBaseFacts: [
      "No toxic language allowed in lobbies.",
      "Matches must submit valid PNG victory screenshots.",
      "Tournament registration locks 2 hours before bracket start."
    ]
  });
  const [newAiFact, setNewAiFact] = useState("");

  // Regional management admins
  const [regionalAdmins, setRegionalAdmins] = useState([
    { region: "Africa", admin: "Ares_Leader", activity: "High (150 scans/day)" },
    { region: "Europe", admin: "Vesper_CV", activity: "High (201 scans/day)" },
    { region: "Asia", admin: "Shinobi_7", activity: "Moderate (90 scans/day)" },
    { region: "Middle East", admin: "Zodiac_Rider", activity: "High (120 scans/day)" },
    { region: "North America", admin: "None Assigned", activity: "Low" }
  ]);
  const [regInputRegion, setRegInputRegion] = useState("Africa");
  const [regInputAdmin, setRegInputAdmin] = useState("");

  // Events master controller states
  const [events, setEvents] = useState([
    { id: "evt-1", title: "CV Africa Winter ScScrims", type: "Scrim", owner: "CV Staff", status: "Live", region: "Africa" },
    { id: "evt-2", title: "TDM Gladiator Ladder Season 1", type: "TDM", owner: "Community Bob", status: "Suspended", region: "Europe" },
    { id: "evt-3", title: "Apex Legend Duo Shootout", type: "Tournament", owner: "Slayer Vesper", status: "Live", region: "Asia" }
  ]);

  // Security and failed login stream
  const [securityAlerts, setSecurityAlerts] = useState([
    { ip: "192.168.1.34", reason: "Multiple failed owner passkeys attempts", severity: "High", timestamp: "10 min ago" },
    { ip: "204.45.19.120", reason: "API flooding on /api/scrims", severity: "Critical", timestamp: "Just now" }
  ]);

  // Audit Logs database
  const [auditLogs, setAuditLogs] = useState([
    { id: "aud-1", staff: "Ares_Leader", action: "Granted head-admin privileges to Slayer Vesper", cat: "Role Change", time: "02:30 AM" },
    { id: "aud-2", staff: "Vesper_CV", action: "Locked user Account ToxicSniper", cat: "Security Override", time: "02:45 AM" },
    { id: "aud-3", staff: "Ares_Leader", action: "Toggle maintenance mode: Active", cat: "Platform Setup", time: "02:50 AM" }
  ]);

  // Scrim Creator / Dispatch state
  const [scrims, setScrims] = useState([
    { id: "scrim-1", title: "Elite Africa Mirror Match", slotsMax: 20, slotsAvailable: 15, code: "---", status: "Created" }
  ]);
  const [newScrimTitle, setNewScrimTitle] = useState("");
  const [newScrimCode, setNewScrimCode] = useState("");

  // TDM ranked multiplier state
  const [tdmMultiplier, setTdmMultiplier] = useState(1.5);
  const [tdmActiveSeason, setTdmActiveSeason] = useState("Season 2: Cyber Reckoning");

  // Community team verify requests queue
  const [teamVerifyRequests, setTeamVerifyRequests] = useState([
    { id: "tvr-1", name: "Bermuda Snipers Corp", tag: "BSC", activity: "High (45 games)", completePro: "100%", status: "Pending Check" },
    { id: "tvr-2", name: "Ares Vanguard", tag: "ARES", activity: "Low (12 games)", completePro: "60%", status: "Requires Playtime" }
  ]);

  // Streamer lists
  const [streamers, setStreamers] = useState([
    { name: "Apex_Stream_Live", platform: "Twitch", views: "1.2k", verified: true },
    { name: "Zimbabwe_Procaster", platform: "YouTube", views: "450", verified: false }
  ]);

  // Legend awards Hall of Fame
  const [legends, setLegends] = useState([
    { name: "Prince Mucheche", honor: "CV Founder Shield", season: "Established 2025" },
    { name: "Slayer_01", honor: "Highest TDM Streak (48 kills)", season: "Season 1 Apex" }
  ]);
  const [newLegendName, setNewLegendName] = useState("");
  const [newLegendHonor, setNewLegendHonor] = useState("");

  return (
    <div className="bg-black text-zinc-100 min-h-screen p-4 md:p-6 font-mono border-t border-red-500/30">
      
      {/* GLOW ATMOSPHERE BANNER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-zinc-900 pb-6 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] uppercase tracking-widest text-red-500 font-black">CV Esports Control Node</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase font-orbitron text-white">
            CENTRALIZED <span className="text-red-500">OPERATIONS CONTROL</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Real-time telemetry, advanced logistics automation, regional administration tools, financial audits, security overrides, and emergency announcements dispatch center.
          </p>
        </div>

        {/* Global Control Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => {
              setPanelViewMode("owner");
              setSystemAlertMessage("👑 Accessed Owner Super Control console.");
            }}
            className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              panelViewMode === "owner"
                ? "bg-red-950/50 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Crown size={12} className={panelViewMode === "owner" ? "text-red-500" : "text-zinc-500"} />
            Owner Dashboard
          </button>

          <button
            onClick={() => {
              setPanelViewMode("admin");
              setSystemAlertMessage("⚙️ Accessed Admin Field operations cockpit.");
            }}
            className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              panelViewMode === "admin"
                ? "bg-emerald-950/55 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Shield size={12} className={panelViewMode === "admin" ? "text-emerald-400" : "text-zinc-500"} />
            Admin Dashboard
          </button>

          <button
            onClick={() => {
              setMobileSimulatorActive(!mobileSimulatorActive);
              setSystemAlertMessage("📱 Toggled Mobile Field Operations Mode simulation layout!");
            }}
            className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-black tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              mobileSimulatorActive
                ? "bg-blue-950/60 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "bg-transparent border-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            <Smartphone size={12} className={mobileSimulatorActive ? "text-blue-400" : "text-zinc-500"} />
            Mobile Simulator {mobileSimulatorActive ? "ON" : "OFF"}
          </button>

        </div>
      </div>

      {/* CORE WRAPPER: WITH SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* MOCK TELEMETRY ACTIVITY TICKER LOG */}
        <div className="lg:col-span-12 bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs gap-4 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1 bg-red-500" />
          <div className="flex items-center gap-2 text-red-500 shrink-0 font-bold">
            <Terminal size={14} className="animate-pulse" />
            <span>LIVE COMM CENTRE FEED:</span>
          </div>
          <div className="flex-1 overflow-hidden h-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={liveLogStream[0]}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                className="text-zinc-300 truncate"
              >
                {liveLogStream[0]}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500 shrink-0">
            <span>Latency: <strong className="text-emerald-400">14ms</strong></span>
            <span>Uptime: <strong className="text-stone-300">99.98%</strong></span>
          </div>
        </div>

        {/* MOBILE SIMULATOR PREVIEW OVERLAY IF ACTIVE */}
        {mobileSimulatorActive && (
          <div className="lg:col-span-12 bg-[#0c0d12] border-2 border-dashed border-blue-500/30 p-6 rounded-3xl relative">
            <div className="absolute top-2 right-4 text-[9px] text-blue-400 font-extrabold uppercase font-mono tracking-widest bg-blue-950/20 border border-blue-900/30 px-2 py-0.5 rounded-full">
              Simulated Viewport Active
            </div>
            
            <div className="max-w-sm mx-auto bg-black p-5 border-4 border-zinc-800 rounded-[3rem] h-[550px] shadow-2xl relative flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-4 bg-zinc-800 flex justify-center items-center">
                <span className="w-16 h-3 bg-black rounded-b-md" />
              </div>
              
              <div className="flex justify-between items-center text-[10px] text-zinc-500 border-b border-zinc-900 pb-2 mt-2">
                <span>📶 LTE</span>
                <span>03:02 AM</span>
                <span>🎮 92%</span>
              </div>

              {/* simulated mobile app screen */}
              <div className="flex-1 overflow-y-auto space-y-4 py-3 text-left">
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-wider">📱 CV Operations Mobile Panel</h4>
                  <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">Direct simplified operations center. Fast touch actions optimized for small fields of visibility.</p>
                </div>

                {/* Instant Actions Grid */}
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
                  <button 
                    onClick={() => {
                      setMetrics(prev => ({ ...prev, activeRegistrations: Math.max(0, prev.activeRegistrations - 1) }));
                      addLog("Mobile: Checked and Approved user application.");
                      setSystemAlertMessage("✓ Rapid approved user profile!");
                    }}
                    className="p-3 bg-emerald-950/30 hover:bg-emerald-950 border border-emerald-900/40 rounded-xl text-emerald-400 text-left block cursor-pointer"
                  >
                    🚀 FAST MATCH
                    <span className="block font-normal text-[8px] text-zinc-400">Approve User Slot</span>
                  </button>

                  <button 
                    onClick={() => {
                      setNewScrimCode("ZA-COMM-3492");
                      addLog("Mobile: Auto-dispatched scrim room code.");
                      setSystemAlertMessage("📡 Released mobile Scrim Room Code: ZA-COMM-3492!");
                    }}
                    className="p-3 bg-red-950/20 hover:bg-red-950 border border-red-900/40 rounded-xl text-red-500 text-left block cursor-pointer"
                  >
                    🔑 DISPATCH ROOMS
                    <span className="block font-normal text-[8px] text-zinc-400">Force publish keys</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMaintenanceMode(!isMaintenanceMode);
                      addLog(`Mobile: Toggled maintenance mode to ${!isMaintenanceMode}`);
                      setSystemAlertMessage(`Platform maintenance mode updated: ${!isMaintenanceMode}`);
                    }}
                    className="p-3 bg-zinc-900 hover:bg-zinc-850 rounded-xl text-white text-left block cursor-pointer"
                  >
                    🛠️ TOGGLE STATUS
                    <span className="block font-normal text-[8px] text-zinc-400">Maintenance toggle</span>
                  </button>

                  <button 
                    onClick={() => {
                      setLiveLogStream(prev => ["📢 [PUSH ALERT] High traffic detected in Asia sector queue.", ...prev]);
                      setSystemAlertMessage("📢 Sentinel warning alert broadcasted!");
                    }}
                    className="p-3 bg-blue-950/20 hover:bg-blue-950 border border-blue-900/40 rounded-xl text-blue-400 text-left block cursor-pointer"
                  >
                    📢 SEND PUSH
                    <span className="block font-normal text-[8px] text-zinc-400">Warning notifications</span>
                  </button>
                </div>

                {/* Simulated notifications feed */}
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 space-y-1.5 text-[9px]">
                  <strong className="text-zinc-400 block uppercase">Real-Time Mobile Queue Logs</strong>
                  <div className="text-stone-300">● Tarik appeal approved</div>
                  <div className="text-stone-300">● Toxic sniper account locked</div>
                  <div className="text-zinc-500">● Refresh queue active</div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-2 flex justify-center">
                <button 
                  onClick={() => setMobileSimulatorActive(false)}
                  className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center cursor-pointer border border-zinc-800"
                >
                  <span className="w-4 h-4 rounded-full border-2 border-zinc-650" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR NAVIGATION TAB SWITCH */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl space-y-4">
            
            {panelViewMode === "owner" ? (
              <>
                <div className="border-b border-zinc-800 pb-2 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-red-500 font-black block tracking-widest uppercase">ROLE LEVEL: ACCESS DECK</span>
                    {sentinelStatus && (
                      <span className={`px-1.5 py-0.5 text-[7.5px] font-mono font-black rounded border flex items-center gap-0.5 ${
                        sentinelStatus.isHealthy 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/45" 
                          : "bg-red-950/40 text-red-500 border-red-800/45 animate-pulse"
                      }`}>
                        {sentinelStatus.isHealthy ? "● SECURE" : "● COMPROMISED"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1">
                    <Crown size={12} className="text-red-550" />
                    OWNER COM-DECK
                  </h3>
                </div>

                <div className="flex flex-col gap-1.5 text-left text-xs">
                  {[
                    { id: "overview", label: "Overview & Recents", icon: Activity },
                    { id: "platform", label: "Platform Command", icon: Server },
                    { id: "analytics", label: "Telemetry & Analytics", icon: TrendingUp },
                    { id: "finance", label: "Financial Core Ledger", icon: DollarSign },
                    { id: "ai", label: "AI Management Center", icon: Cpu },
                    { id: "regional", label: "Regional Boundaries", icon: Globe },
                    { id: "events", label: "Event Super Control", icon: ShieldAlert },
                    { id: "security", label: "Security & Audits", icon: Key },
                    { id: "audit", label: "Website Audit Ledger", icon: FileText }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setOwnerActiveTab(tab.id as any)}
                        className={`w-full text-left p-2 rounded-lg border transition-all flex items-center gap-2 ${
                          ownerActiveTab === tab.id
                            ? "bg-red-955/35 border-red-800 text-white font-black"
                            : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={ownerActiveTab === tab.id ? "text-red-500" : "text-zinc-500"} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-zinc-800 pb-2 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-emerald-400 font-black block tracking-widest uppercase">ROLE LEVEL: ADMINISTRATIVE</span>
                    {sentinelStatus && (
                      <span className={`px-1.5 py-0.5 text-[7.5px] font-mono font-black rounded border flex items-center gap-0.5 ${
                        sentinelStatus.isHealthy 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/45" 
                          : "bg-red-950/40 text-red-500 border-red-800/45 animate-pulse"
                      }`}>
                        {sentinelStatus.isHealthy ? "● SECURE" : "● COMPROMISED"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-black text-white flex items-center gap-1">
                    <Shield size={12} className="text-emerald-450" />
                    ADMIN CONTROL PANEL
                  </h3>
                </div>

                <div className="flex flex-col gap-1.5 text-left text-xs">
                  {[
                    { id: "members", label: "Member Management", icon: Users },
                    { id: "tournaments", label: "Tournament Control", icon: Trophy },
                    { id: "scrims", label: "Scrim Control Arena", icon: Gamepad2 },
                    { id: "tdm", label: "TDM Ranked Config", icon: Flame },
                    { id: "banners", label: "Global Bulletins Center", icon: Bell },
                    { id: "content", label: "CMS News & Spotlights", icon: List },
                    { id: "streamers", label: "Streamer Verifier System", icon: Video },
                    { id: "teams", label: "Community Teams Mod", icon: ShieldCheck },
                    { id: "rewards", label: "Reward badging deck", icon: Award },
                    { id: "legends", label: "CV Legends Register", icon: Star }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAdminActiveTab(tab.id as any)}
                        className={`w-full text-left p-2 rounded-lg border transition-all flex items-center gap-2 ${
                          adminActiveTab === tab.id
                            ? "bg-emerald-950/40 border-emerald-800 text-white font-black"
                            : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={adminActiveTab === tab.id ? "text-emerald-400" : "text-zinc-500"} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Quick overview of security levels */}
            <div className="p-3 bg-zinc-900 rounded-lg text-[9px] text-zinc-500 leading-normal text-left">
              🔑 **AUTHENTICATED LEVEL**: Complete admin encryption tokens loaded. Actions performed bypass local user restrictions. Keep logs audit-compliant.
            </div>

          </div>
        </div>

        {/* TAB WORKSPACES CONTAINER */}
        <div className="lg:col-span-9 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 space-y-6">
          <AnimatePresence mode="wait">

            {/* ==================== OWNER PANELS ==================== */}
            {panelViewMode === "owner" && (
              <div className="space-y-6">

                {/* OVERVIEW TAB */}
                {ownerActiveTab === "overview" && (
                  <motion.div
                    key="owner-overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-zinc-900 pb-3 text-left">
                      <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block font-mono">OWNER DIRECT OVERVIEW</span>
                      <h4 className="text-base font-black text-white uppercase">PLATFORM DYNAMIC QUANTITIES TELEMETRY</h4>
                    </div>

                    {/* HIGH VISIBILITY WHATSAPP LINKING ALERT BANNER */}
                    <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                      isWaLinked 
                        ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-450"
                        : "bg-red-950/25 border-[#ff001c]/30 text-red-500 animate-pulse"
                    }`}>
                      <div className="space-y-1 text-left">
                        <strong className="text-xs font-mono font-black uppercase tracking-widest block">
                          {isWaLinked ? "🟢 WHATSAPP LINK STATUS: VERIFIED" : "⚠️ WHATSAPP COMMUNICATIONS ACTION REQUIRED"}
                        </strong>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-xl">
                          {isWaLinked 
                             ? "Real-time match room credentials, waitlist updates, penalties and results notifications are successfully binding to your phone."
                             : "You have not linked your WhatsApp account! Route custom room entry passcode updates right to your mobile handset instantly."}
                        </p>
                      </div>
                      
                      {!isWaLinked && setActiveTab && (
                        <button
                          onClick={() => {
                            setActiveTab("settings");
                            setSystemAlertMessage("📱 Launching WhatsApp Linking Center...");
                          }}
                          className="p-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black font-mono text-[9.5px] rounded-xl uppercase transition-all duration-150 tracking-widest shrink-0 cursor-pointer"
                        >
                          Link WhatsApp Now 📱
                        </button>
                      )}
                    </div>

                    {/* DEDICATED VERIFIED ESPORTS PASSPORT BANNER */}
                    <div className="p-4 rounded-2xl border bg-gradient-to-r from-red-950/20 via-[#111113] to-red-950/20 border-red-500/30 text-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <strong className="text-xs font-mono font-black uppercase tracking-widest text-red-500 block">
                          🛂 CV ESPORTS PASSPORT STATUS: ACTIVE & SECURED
                        </strong>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-xl">
                          Your permanent digital eSports resume, competitive trophy achievements, reputation scoreboard, and TDM division ranking statistics are compiled in a certified profile deck.
                        </p>
                      </div>
                      
                      {setActiveTab && (
                        <button
                          onClick={() => {
                            setActiveTab("passport");
                            setSystemAlertMessage("🛂 Navigating to your permanent Esports Passport identity card...");
                          }}
                          className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-black font-mono text-[9.5px] rounded-xl uppercase transition-all duration-150 tracking-widest shrink-0 cursor-pointer border border-red-500/20"
                        >
                          View My Passport 🛂
                        </button>
                      )}
                    </div>

                    {/* Stats metric blocks */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Total Platform Users", value: metrics.totalUsers, accent: "text-white" },
                        { label: "Community Teams", value: metrics.totalTeams, accent: "text-emerald-400" },
                        { label: "Active Community Squads", value: metrics.totalCommSquads, accent: "text-blue-400" },
                        { label: "CV Exclusive Squads", value: metrics.totalExclSquads, accent: "text-red-500" },
                        { label: "Active Tournaments", value: metrics.totalTournaments, accent: "text-amber-500" },
                        { label: "Scrim Matches Managed", value: metrics.totalScrims, accent: "text-zinc-300" },
                        { label: "Ranked TDM Matches", value: metrics.totalTdmMatches, accent: "text-red-400" },
                        { label: "Pending Registrations", value: metrics.activeRegistrations, accent: "text-orange-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-black/60 p-4 border border-zinc-900 rounded-2xl text-left space-y-1">
                          <span className="text-[10px] text-zinc-500 block uppercase font-mono">{item.label}</span>
                          <strong className={`text-xl font-bold font-mono tracking-tight ${item.accent}`}>{item.value.toLocaleString()}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Real-time CV Health Sentinel & Self-Repair System */}
                      <div className="bg-[#050510]/50 border border-blue-950/50 p-5 rounded-2xl text-left space-y-3.5">
                        <div className="flex justify-between items-center pb-1.5 border-b border-zinc-900">
                          <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${sentinelStatus?.isHealthy ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-ping"}`} />
                              🛡️ CV HEALTH SENTINEL SYSTEM
                            </h4>
                            <span className="text-[8px] text-zinc-500 font-mono block uppercase">Real-Time Endpoint & Component Monitor</span>
                          </div>
                          
                          {onSelfRepair && (
                            <button
                              onClick={() => {
                                if (onSelfRepair) onSelfRepair();
                              }}
                              className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white font-mono text-[9px] font-black uppercase rounded tracking-wider transition-all duration-150 border border-red-500/30 flex items-center gap-1 hover:scale-[1.02] cursor-pointer"
                              title="Re-trigger global state initialization and reload modules"
                            >
                              ⚡ SELF-REPAIR
                            </button>
                          )}
                        </div>

                        <div className="space-y-2.5 text-[11px] font-mono text-zinc-300">
                          {sentinelStatus?.checks.map((check) => (
                            <div key={check.id} className="flex justify-between items-center gap-2">
                              <span className="text-zinc-400 font-medium">{check.name}:</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-zinc-500 text-[9px] max-w-[120px] truncate">{check.details}</span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                                  check.status === "success" 
                                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40" 
                                    : check.status === "failure" 
                                    ? "bg-red-950/40 text-red-500 border border-red-800/40 animate-pulse" 
                                    : "bg-zinc-900 text-zinc-500"
                                }`}>
                                  {check.status === "success" ? "PASS" : check.status === "failure" ? "FAIL" : "WAIT"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1 flex justify-between items-center text-[9px] text-zinc-550 font-mono">
                          <span>PING RATE: 5.0s</span>
                          <span>LAST HEARTBEAT: {sentinelStatus?.lastPingTime || "Just now"}</span>
                        </div>
                      </div>

                      {/* Recents audit mini list */}
                      <div className="bg-[#090b07]/50 border border-emerald-950/40 p-5 rounded-2xl text-left space-y-3">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">📝 RECENT PLATFORM MODIFICATION DECK</h4>
                        <div className="space-y-2 text-xs">
                          {auditLogs.slice(0, 3).map((log) => (
                            <div key={log.id} className="text-zinc-400 font-mono text-[11px] leading-snug border-b border-zinc-900 pb-1 flex justify-between">
                              <span>{log.action}</span>
                              <span className="text-zinc-650 font-sans text-[10px] shrink-0 font-normal">{log.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* PLATFORM PRIORITY PROMOTIONS & DIRECT ACCESS BAR */}
                    <div className="bg-[#070b09]/60 border border-red-950/40 p-5 rounded-3xl space-y-4">
                      <div>
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block font-mono">⚡ DYNAMIC REDIRECT MATRIX</span>
                        <h4 className="text-xs font-black text-white uppercase">PRIMARY COMMUNITY DEPLOYMENT DIRECTIVES</h4>
                        <p className="text-[10px] text-zinc-400 leading-normal font-sans mt-0.5">
                          Quick-link access lanes designed for zero-click matchmaking and community alignment monitoring.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-[#0c0505] to-[#120808] border border-red-900/15 p-4 rounded-xl flex items-center justify-between gap-4">
                          <div className="text-left">
                            <h5 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-pulse" />
                              👥 COMMUNITY SQUADS HUB
                            </h5>
                            <p className="text-[9.5px] text-zinc-500 leading-tight font-sans mt-1">
                              Manage open slots lists, audit squad applications, and monitor community clans.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (setActiveTab) {
                                setActiveTab("communitySquads");
                                setSystemAlertMessage("👥 Direct-routed to Community Squads Landing View.");
                              }
                            }}
                            className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-650 border border-red-500/30 text-red-520 text-[9px] uppercase font-mono font-bold tracking-wider rounded transition-all cursor-pointer whitespace-nowrap"
                          >
                            Launch →
                          </button>
                        </div>

                        <div className="bg-gradient-to-br from-[#050c08] to-[#08120c] border border-emerald-950/30 p-4 rounded-xl flex items-center justify-between gap-4">
                          <div className="text-left">
                            <h5 className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              ⚔️ CV TDM MATCHMAKING
                            </h5>
                            <p className="text-[9.5px] text-zinc-500 leading-tight font-sans mt-1">
                              Launch custom Duel matches, log active challenge codes, and view verified brackets.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (setActiveTab) {
                                setActiveTab("tdmArena");
                                setSystemAlertMessage("⚔️ Direct-routed to CV TDM Arena Machmaking Center.");
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-955/20 hover:bg-emerald-500 hover:text-black border border-emerald-900/30 text-emerald-400 text-[9px] uppercase font-mono font-bold tracking-wider rounded transition-all cursor-pointer whitespace-nowrap"
                          >
                            Launch →
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PLATFORM COMMAND */}
                {ownerActiveTab === "platform" && (
                  <motion.div
                    key="owner-platform"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono">PLATFORM DEPLOYMENT OVERRIDES</span>
                      <h4 className="text-base font-black text-white uppercase">EMERGENCY SYSTEM SERVICE DECKS</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Maintenance mode console */}
                      <div className="bg-[#0f0a0d]/90 border border-red-950/40 p-5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <AlertOctagon size={14} className="text-red-500" />
                          Platform Global State Blockade
                        </h4>
                        
                        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                          Toggling Maintenance Mode immediately locks down the user-facing web framework, serving an adaptive "Under Construction / Bracket Seeding Season" overlay except for authorized Owners/Admins IPs.
                        </p>

                        <div className="flex items-center justify-between bg-black p-3 rounded-xl border border-zinc-900">
                          <div className="space-y-0.5">
                            <span className="text-stone-300 text-xs font-bold font-mono">Maintenance Overrides</span>
                            <span className="text-[9px] text-zinc-500 block">Status: {isMaintenanceMode ? "🛑 ENABLED" : "🟢 DISABLED"}</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              setIsMaintenanceMode(!isMaintenanceMode);
                              addLog(`Audit: Platform Maintenance mode toggled to: ${!isMaintenanceMode}`);
                              setSystemAlertMessage(`Platform Maintenance Toggled: ${!isMaintenanceMode ? "ENABLED" : "DISABLED"}`);
                            }}
                            className={`px-3 py-1.5 rounded text-[11.5px] uppercase font-bold cursor-pointer transition-all ${
                              isMaintenanceMode 
                                ? "bg-emerald-500 text-black hover:bg-emerald-400" 
                                : "bg-red-650 hover:bg-red-700 text-white font-mono"
                            }`}
                          >
                            {isMaintenanceMode ? "DISABLE LOCKDOWN" : "ENABLE LOCKDOWN"}
                          </button>
                        </div>
                      </div>

                      {/* Immediate Broadcast Bulletins */}
                      <div className="bg-[#050c0b]/55 p-5 rounded-2xl border border-emerald-950/50 space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <Radio size={14} className="text-emerald-400 animate-pulse" />
                          EMERGENCY BROADCAST TRANSMITTER
                        </h4>
                        
                        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                          Transmit an active red emergency ticker banner straight to every player device or world matches chat panel instantly.
                        </p>

                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Type emergency text (e.g. Scrim #4 DELAYED due to severe lobby connection error)..."
                            value={emergencyAnnouncement}
                            onChange={(e) => setEmergencyAnnouncement(e.target.value)}
                            className="bg-black text-[#ff001c] text-xs font-mono border border-zinc-800 p-2.5 rounded-lg w-full outline-none focus:border-red-600"
                          />
                          <button
                            onClick={() => {
                              if (!emergencyAnnouncement) return;
                              setSystemAlertMessage(`🚨 EMERGENCY BROADCAST SENT: "${emergencyAnnouncement}"`);
                              addLog(`Audit: Emergency Broadcast sent: "${emergencyAnnouncement}"`);
                              setEmergencyAnnouncement("");
                            }}
                            className="w-full bg-[#ff001c] hover:bg-[#ff1b31] py-2 text-white text-[10px] uppercase font-black tracking-wider rounded-lg cursor-pointer"
                          >
                            BROADCAST EMERGENCY ALIGN 🚀
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Reboot console simulating terminal logs */}
                    <div className="bg-zinc-950/90 border border-zinc-900 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <h4 className="text-xs font-bold text-stone-200 uppercase tracking-widest">⚙️ SYSTEM REBOOT TERMINAL LOGIC</h4>
                        <span className="text-[9px] text-zinc-500 font-mono">Node ID: cv-west-run-7a</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => {
                            setSystemAlertMessage("📡 Initializing server subsystem recycle. Retents clearing...");
                            addLog("System: Executed server node memory sweep and recycled network cache sockets.");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-3 rounded-xl block text-left"
                        >
                          <strong className="text-red-500 text-[10.5px] uppercase font-bold block">RECYCLE CACHE FLUSH</strong>
                          <span className="text-[8.5px] text-zinc-500">Purges session caches</span>
                        </button>

                        <button
                          onClick={() => {
                            setSystemAlertMessage("📡 Checking for platform security update triggers... Installed patch v4.2.9");
                            addLog("System: Instantly patched container image files to production hotcheck v4.2.9");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-3 rounded-xl block text-left"
                        >
                          <strong className="text-white text-[10.5px] uppercase font-bold block">APPLY SECURE PATCH</strong>
                          <span className="text-[8.5px] text-zinc-500">Hot-apply security modules</span>
                        </button>

                        <button
                          onClick={() => {
                            setSystemAlertMessage("📡 Scheduling global system maintenance window for July 1st, 02:00 UTC");
                            addLog("System: Scheduled Maintenance Window for July 1st. Push notifications configured.");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-3 rounded-xl block text-left"
                        >
                          <strong className="text-emerald-400 text-[10.5px] uppercase font-bold block">SCHEDULE WINDOW</strong>
                          <span className="text-[8.5px] text-zinc-500">Book future downtime</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ADVANCED ANALYTICS */}
                {ownerActiveTab === "analytics" && (
                  <motion.div
                    key="owner-analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono">TELEMETRY QUANTITIES REPORT</span>
                      <h4 className="text-base font-black text-white uppercase">DYNAMIC TRAFFIC GROWTH ANALYTICS</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Daily Active Users (DAU)", v: "3,480", rate: "+15%" },
                        { label: "Monthly Actives (MAU)", v: "14,285", rate: "+32%" },
                        { label: "Most Active Sector", v: "Africa Network", rate: "45% Vol" },
                        { label: "Total Stream Views", v: "125,000+", rate: "Premium tier" }
                      ].map((card, idx) => (
                        <div key={idx} className="bg-black/60 p-4 rounded-xl border border-zinc-900">
                          <span className="text-[9.5px] text-zinc-500 uppercase block font-medium">{card.label}</span>
                          <div className="flex justify-between items-baseline mt-1.5">
                            <strong className="text-lg font-mono text-white">{card.v}</strong>
                            <span className="text-[9px] text-emerald-400 font-extrabold">{card.rate}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Beautiful manual responsive charts representation built elegantly */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
                          <TrendingUp size={14} className="text-red-500" />
                          WEEKLY REGISTRATIONS GROWTH MATRIX
                        </h4>
                        <button
                          onClick={() => setSystemAlertMessage("📂 Analytics PDF report spreadsheet generated for Mucheche Operations Core.")}
                          className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] text-zinc-300 rounded border border-zinc-800 text-[8.5px] uppercase font-bold"
                        >
                          Export CSV Report
                        </button>
                      </div>

                      {/* Custom styled mock chart using interactive CSS blocks */}
                      <div className="pt-4 h-48 flex items-end gap-3 justify-between border-b border-l border-zinc-900 pb-2 pl-2">
                        {[
                          { label: "Mon", val: "30%" },
                          { label: "Tue", val: "45%" },
                          { label: "Wed", val: "55%" },
                          { label: "Thu", val: "85%" },
                          { label: "Fri", val: "70%" },
                          { label: "Sat", val: "95%" },
                          { label: "Sun", val: "90%" }
                        ].map((bar, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-[#1c1c1c] rounded-t-md relative hover:bg-emerald-500/10 min-h-[14px]">
                              <div 
                                style={{ height: bar.val }} 
                                className="w-full bg-gradient-to-t from-red-650 to-[#ff001c] rounded-t-md relative duration-300 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]" 
                              />
                            </div>
                            <span className="text-[8.5px] text-zinc-500 font-mono uppercase">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* FINANCIAL CORE */}
                {ownerActiveTab === "finance" && (
                  <motion.div
                    key="owner-finance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono">LEDGER TRANSACTION METRICS</span>
                      <h4 className="text-base font-black text-white uppercase">FINANCIAL AUDIT & BUDGER CONSOLE</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { label: "Prize Fund Allocation", v: financials.prizeFund, accent: "text-amber-500" },
                        { label: "Pledged Contributions", v: financials.contributions, accent: "text-emerald-400" },
                        { label: "Tournament Match Fees", v: financials.tournamentRev, accent: "text-white" },
                        { label: "Event Operation Costs", v: financials.eventExpenses, accent: "text-red-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-black/60 p-4 rounded-xl border border-zinc-900">
                          <span className="text-[10px] text-zinc-500 block uppercase">{item.label}</span>
                          <strong className={`text-lg font-mono tracking-tight block ${item.accent}`}>${item.v.toLocaleString()} USD</strong>
                        </div>
                      ))}
                    </div>

                    {/* Progress tracking line */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-3">
                      <span className="text-[9.5px] text-zinc-400 font-bold block uppercase font-mono">PRIZE CAP SECURITY RESERVE</span>
                      <div className="w-full h-2.5 bg-[#161616] rounded-full overflow-hidden relative border border-zinc-900">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "74%" }} />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-zinc-500">
                        <span>Allocated: <strong>$18,500 USD</strong></span>
                        <span>Threshold Limit: <strong>$25,000 USD (74%)</strong></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Sponsor submissions */}
                      <div className="lg:col-span-2 bg-[#0a0505]/60 border border-red-950/20 p-5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-stone-100 uppercase tracking-widest">🏆 REGISTER NEW SPONSOR CONTRACT</h4>
                        
                        <form onSubmit={handleCreateSponsor} className="space-y-4 text-xs font-mono">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9.5px] text-zinc-400 block uppercase">Sponsor/Partner Name *</label>
                              <input
                                type="text"
                                required
                                value={sponsorName}
                                onChange={(e) => setSponsorName(e.target.value)}
                                placeholder="e.g. RedBull Ltd"
                                className="w-full bg-black border border-zinc-850 p-2 text-white outline-none focus:border-red-500 rounded"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9.5px] text-zinc-400 block uppercase">Funding Level *</label>
                              <select
                                value={sponsorTier}
                                onChange={(e) => setSponsorTier(e.target.value)}
                                className="w-full bg-black border border-zinc-850 p-2 text-white outline-none rounded"
                              >
                                <option value="Diamond Sponsor">Diamond Sponsor</option>
                                <option value="Gold Partner">Gold Partner</option>
                                <option value="Premium Host Sponsor">Premium Host Sponsor</option>
                                <option value="Casual Community Patron">Casual Community Patron</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9.5px] text-zinc-400 block uppercase font-mono">Pledged Amount (USD) *</label>
                            <input
                              type="number"
                              required
                              value={sponsorPledge}
                              onChange={(e) => setSponsorPledge(e.target.value)}
                              placeholder="e.g. 5000"
                              className="w-full bg-black border border-zinc-850 p-2 text-white outline-none focus:border-red-500 rounded"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-red-650 hover:bg-red-700 font-black text-[9.5px] uppercase py-2.5 px-4 rounded-lg tracking-wider"
                          >
                            COMMITT SPONSORSHIP TRANSACTION 🚀
                          </button>
                        </form>
                      </div>

                      {/* Sponsor roster list */}
                      <div className="bg-[#050905]/50 border border-emerald-950/40 p-5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">📝 RECENT PLEDGES</h4>
                        
                        <div className="space-y-2 text-xs font-mono">
                          {sponsors.map((sp) => (
                            <div key={sp.id} className="bg-black/80 p-2.5 border border-zinc-900 rounded-xl space-y-1">
                              <div className="flex justify-between font-bold">
                                <span className="text-white">{sp.name}</span>
                                <span className="text-emerald-400 font-black">+${sp.pledged.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-zinc-500">
                                <span>{sp.tier}</span>
                                <span>{sp.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* AI MANAGEMENT */}
                {ownerActiveTab === "ai" && (
                  <motion.div
                    key="owner-ai"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono">MODELS LOGISTICS ENGINE</span>
                      <h4 className="text-base font-black text-white uppercase">CV INTELLECTUAL AI Cockpit</h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: configuration dials */}
                      <div className="lg:col-span-2 bg-[#050510]/50 border border-blue-950/50 p-5 rounded-2xl space-y-5">
                        <h4 className="text-xs font-black text-stone-100 uppercase tracking-widest flex items-center gap-1.5">
                          <Cpu size={14} className="text-blue-400 animate-pulse" />
                          COGNITIVE PARSING DRIVER DIALS
                        </h4>

                        <div className="space-y-4 text-xs font-mono">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-400">TEMPERATURE MULTIPLIER (CREATIVITY):</span>
                              <strong className="text-blue-400">{aiConfig.temp}</strong>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={aiConfig.temp}
                              onChange={(e) => setAiConfig(prev => ({ ...prev, temp: parseFloat(e.target.value) }))}
                              className="w-full accent-blue-500"
                            />
                          </div>

                          <div className="space-y-1 border-t border-zinc-900 pt-3">
                            <span className="text-zinc-400 block pb-1">DEFAULT BOTS ACTIVES STATUS:</span>
                            <div className="grid grid-cols-2 gap-2 text-[9px]">
                              <button onClick={() => setSystemAlertMessage("🤖 Verified Scrim check initialized")} className="p-2 bg-emerald-950/30 text-emerald-400 rounded border border-emerald-800/40 text-left cursor-pointer">
                                🟢 MatchVerifier Bot - Live
                              </button>
                              <button onClick={() => setSystemAlertMessage("🤖 Moderation check active")} className="p-2 bg-emerald-950/30 text-emerald-400 rounded border border-emerald-800/40 text-left cursor-pointer">
                                🟢 Moderation Filter - Live
                              </button>
                              <button onClick={() => setSystemAlertMessage("🤖 Automated registration active")} className="p-2 bg-emerald-950/30 text-emerald-400 rounded border border-emerald-800/40 text-left cursor-pointer">
                                🟢 Reg_Bot_Agent - Live
                              </button>
                              <button onClick={() => setSystemAlertMessage("🤖 Verified recruitment scanning ongoing")} className="p-2 bg-blue-955/30 text-blue-400 rounded border border-blue-800/20 text-left cursor-pointer">
                                🟢 Recruit_Scanner - Standby
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: facts / custom rules build */}
                      <div className="bg-[#0b0c10]/95 border border-zinc-900 p-5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">📝 BOTS DECISION KNOWLEDGE BASE</h4>
                        
                        <div className="space-y-2 text-[10px] font-mono text-zinc-400">
                          {aiConfig.knowledgeBaseFacts.map((fact, idx) => (
                            <div key={idx} className="bg-black/60 p-2 rounded border border-zinc-900 leading-normal">
                              • {fact}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 text-xs">
                          <input
                            type="text"
                            placeholder="Add fact (e.g. Scrim players must verify mobile)..."
                            value={newAiFact}
                            onChange={(e) => setNewAiFact(e.target.value)}
                            className="w-full bg-black border border-zinc-800 p-1.5 focus:border-blue-500 rounded text-xs text-white outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!newAiFact) return;
                              setAiConfig(prev => ({ ...prev, knowledgeBaseFacts: [...prev.knowledgeBaseFacts, newAiFact] }));
                              setNewAiFact("");
                              setSystemAlertMessage("📝 Knowledge base fact trained successfully!");
                              addLog("Training: AI Knowledge bases appended.");
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-1.5 text-white uppercase text-[9.5px] font-black tracking-wider rounded"
                          >
                            Tutor Bot Facts Engine
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* REGIONAL MANAGEMENT */}
                {ownerActiveTab === "regional" && (
                  <motion.div
                    key="owner-regional"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono">REGIONAL NETWORKS GRID</span>
                      <h4 className="text-base font-black text-white uppercase">SATELLITE SECTOR CHROME DECK</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Assign admins block */}
                      <div className="md:col-span-5 bg-zinc-950 p-5 border border-zinc-900 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-stone-100 uppercase tracking-widest">Assign Regional Overlord Officer</h4>
                        
                        <div className="space-y-3 text-xs font-mono">
                          <div className="space-y-1">
                            <label className="text-[9.5px] text-zinc-500 block">Select Target Region Area:</label>
                            <select
                              value={regInputRegion}
                              onChange={(e) => setRegInputRegion(e.target.value)}
                              className="w-full bg-black border border-zinc-800 rounded p-2 text-white"
                            >
                              <option value="Africa">Africa Network</option>
                              <option value="Europe">Europe Network</option>
                              <option value="Asia">Asia Network</option>
                              <option value="Middle East">Middle East</option>
                              <option value="North America">North America</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9.5px] text-zinc-500 block">Assign Overlord Operator Name:</label>
                            <input
                              type="text"
                              value={regInputAdmin}
                              onChange={(e) => setRegInputAdmin(e.target.value)}
                              placeholder="e.g. tarid_malik"
                              className="w-full bg-black border border-zinc-800 rounded p-2 text-white focus:border-red-500 outline-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              if (!regInputAdmin) return;
                              setRegionalAdmins(prev => prev.map(row => {
                                if (row.region === regInputRegion) {
                                  return { ...row, admin: regInputAdmin };
                                }
                                return row;
                              }));
                              setSystemAlertMessage(`🎉 Assigned Overlord Operator "${regInputAdmin}" to "${regInputRegion}"!`);
                              addLog(`Audit: Region "${regInputRegion}" assigned to operator "${regInputAdmin}".`);
                              setRegInputAdmin("");
                            }}
                            className="w-full bg-red-650 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-wider py-2 rounded-lg cursor-pointer"
                          >
                            RE-ALLOCATE SECTOR ASSIGNMENT 🚀
                          </button>
                        </div>
                      </div>

                      {/* Active Sector Directory list */}
                      <div className="md:col-span-7 bg-[#0b0b14]/50 border border-zinc-900 p-5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Active Overlord Operators Directory</h4>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-stone-300 font-mono text-left">
                            <thead>
                              <tr className="border-b border-zinc-900 text-zinc-500 text-[9.5px]">
                                <th className="pb-2">SECTOR GRID</th>
                                <th className="pb-2">ACTIVE OVERLORD ADMIN</th>
                                <th className="pb-2">ACTIVITY TRACKER</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                              {regionalAdmins.map((row, idx) => (
                                <tr key={idx}>
                                  <td className="py-2.5 text-white font-bold">{row.region}</td>
                                  <td className="py-2.5 text-red-500">{row.admin}</td>
                                  <td className="py-2.5 text-zinc-500 text-[10px]">{row.activity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* EVENT SUPER CONTROL */}
                {ownerActiveTab === "events" && (
                  <motion.div
                    key="owner-events"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono">Logistical Scrim Overwrite</span>
                      <h4 className="text-base font-black text-white uppercase">EVENTS DIRECT OVERWRITE SYSTEM</h4>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-4 space-y-3 font-mono">
                      <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest pl-1">Live Global Brackets Monitor</h4>
                      
                      <div className="space-y-3">
                        {events.map((evt) => (
                          <div key={evt.id} className="bg-black/60 p-4 border border-zinc-900 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[8.5px] font-black rounded uppercase ${
                                  evt.type === "Scrim" ? "bg-emerald-950 text-emerald-400" :
                                  evt.type === "TDM" ? "bg-red-950 text-red-400" :
                                  "bg-blue-955 text-blue-400"
                                }`}>{evt.type}</span>
                                <strong className="text-white text-sm">{evt.title}</strong>
                              </div>
                              <p className="text-zinc-500 text-[10px]">Manager: <span className="text-zinc-300">{evt.owner}</span> | Region: <span className="text-zinc-400">{evt.region}</span></p>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  setSystemAlertMessage(`🎉 Spotlight Featured Match: "${evt.title}"`);
                                  addLog(`Audit: Event "${evt.title}" marked as spotlight featured.`);
                                }}
                                className="px-2 py-1 bg-amber-955/20 text-amber-500 rounded border border-amber-900/30 text-[9px] uppercase font-bold cursor-pointer"
                              >
                                ★ Spotlight Feature
                              </button>
                              <button
                                onClick={() => {
                                  setEvents(prev => prev.map(e => e.id === evt.id ? { ...e, status: "Suspended" } : e));
                                  setSystemAlertMessage(`⚠️ Suspended Event: "${evt.title}"`);
                                  addLog(`Audit: Event "${evt.title}" manually suspended.`);
                                }}
                                className="px-2 py-1 bg-red-955/20 text-red-500 rounded border border-red-900/30 text-[9px] uppercase font-bold cursor-pointer"
                              >
                                Suspend Event
                              </button>
                              <button
                                onClick={() => {
                                  setEvents(prev => prev.filter(e => e.id !== evt.id));
                                  setSystemAlertMessage(`🗑️ Archived Event: "${evt.title}"`);
                                  addLog(`Audit: Event "${evt.title}" archived and wiped.`);
                                }}
                                className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded border border-zinc-800 text-[9px] uppercase font-bold cursor-pointer"
                              >
                                Archive
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SECURITY OVERRIDES */}
                {ownerActiveTab === "security" && (
                  <motion.div
                    key="owner-security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-red-500 font-black block uppercase font-mono font-bold">SENTINEL LOCK MATRIX</span>
                      <h4 className="text-base font-black text-white uppercase">SECURITY AUDITS & ACCOUNT CONTROLS</h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Active failed alerts queue */}
                      <div className="lg:col-span-2 bg-[#120a0b]/60 border border-red-955/20 p-5 rounded-2xl space-y-4">
                        <h4 className="text-xs font-black text-stone-100 uppercase tracking-widest flex items-center gap-1.5">
                          <ShieldAlert size={14} className="text-red-500 animate-pulse" />
                          UNAUTHORIZED FIREWALL BLOCKED TRIGGERS
                        </h4>

                        <div className="space-y-2 text-xs font-mono">
                          {securityAlerts.map((alert, idx) => (
                            <div key={idx} className="bg-black/8 w-full p-3 border border-red-950/40 rounded-xl flex justify-between items-center">
                              <div>
                                <span className="text-red-500 font-bold block">[ALERT] IP: {alert.ip}</span>
                                <span className="text-zinc-400 text-[10px]">{alert.reason}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-red-950 text-red-500 font-black rounded text-[9px] uppercase">{alert.severity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ban / Reset Accounts cockpit */}
                      <div className="bg-zinc-950 p-5 border border-zinc-900 rounded-2xl space-y-4 font-mono">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Rapid Admin Blockade Override</h4>
                        
                        <div className="space-y-3 text-xs">
                          <button
                            onClick={() => {
                              setSystemAlertMessage("✓ Dispatched global force API password resets to all roster accounts!");
                              addLog("Security: Forced comprehensive system password updates.");
                            }}
                            className="w-full bg-[#1A1A1A] hover:bg-[#252525] border border-zinc-800 text-white font-semibold uppercase p-3 rounded-lg text-left"
                          >
                            🔄 Force All Password Resets
                          </button>

                          <button
                            onClick={() => {
                              setSystemAlertMessage("✓ Platform signup locks toggled active!");
                              addLog("Security: Sealed public registration signups temporarily.");
                            }}
                            className="w-full bg-[#1A1A1A] hover:bg-[#252525] border border-zinc-800 text-[#ff001c] font-black uppercase p-3 rounded-lg text-left"
                          >
                            🔒 Seal Registration gate
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* AUDIT LOGS */}
                {ownerActiveTab === "audit" && (
                  <motion.div
                    key="owner-audit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-[#ff001c] font-black block uppercase font-mono font-bold">CRYPTO COMPLIANCE BLOCK</span>
                      <h4 className="text-base font-black text-white uppercase">SOCIETY SECURITY LOGS AUDIT</h4>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-3 font-mono">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <span className="text-xs text-zinc-400">Total Audit Ledger records: <strong>3 files logged</strong></span>
                        <input
                          type="text"
                          placeholder="Search overrides..."
                          className="bg-black border border-zinc-800 text-[10.5px] px-2 py-1 rounded outline-none w-48 text-white focus:border-red-500"
                        />
                      </div>

                      <div className="space-y-2 text-[11.5px]">
                        {auditLogs.map((item) => (
                          <div key={item.id} className="bg-black/60 p-3 border border-zinc-900 rounded-xl flex justify-between items-baseline">
                            <div className="space-y-1">
                              <strong>{item.staff}</strong>
                              <span className="text-zinc-400 block font-normal">{item.action}</span>
                            </div>
                            <span className="text-[9px] text-red-500 uppercase font-bold shrink-0">{item.cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            )}

            {/* ==================== ADMIN PANELS ==================== */}
            {panelViewMode === "admin" && (
              <div className="space-y-6">

                {/* MEMBER MODERATION */}
                {adminActiveTab === "members" && (
                  <motion.div
                    key="admin-members"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-emerald-400 font-black block uppercase font-mono">ADMIN COMPLIANCE OFFICERS</span>
                      <h4 className="text-base font-black text-white uppercase">MEMBER DIRECTORY MODERATION</h4>
                    </div>

                    <div className="space-y-3 font-mono">
                      {users.map((app) => (
                        <div key={app.id} className="bg-black/60 p-4 border border-zinc-900 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <strong className="text-white text-sm">{app.ign}</strong>
                              <span className="text-zinc-500 font-sans text-[11px]">({app.name})</span>
                              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 border border-emerald-900/40 rounded uppercase font-bold">{app.role}</span>
                            </div>
                            <p className="text-zinc-500 text-[10px]">Region: <span className="text-zinc-400">{app.region}</span> | Safety Reputation Score: <span className={`font-bold ${app.reputation >= 80 ? "text-emerald-400" : "text-red-500"}`}>{app.reputation}/100</span></p>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {app.status === "Pending Approval" ? (
                              <>
                                <button
                                  onClick={() => {
                                    setUsers(prev => prev.map(u => u.id === app.id ? { ...u, status: "Active" } : u));
                                    setSystemAlertMessage(`✓ User "${app.ign}" profile has been approved!`);
                                    addLog(`Admin: Approved member profile: ${app.ign}`);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-500 text-black rounded text-[9.5px] font-black uppercase cursor-pointer"
                                >
                                  ✓ Approve User
                                </button>
                                <button
                                  onClick={() => {
                                    setUsers(prev => prev.filter(u => u.id !== app.id));
                                    setSystemAlertMessage(`✗ User signups request declined.`);
                                  }}
                                  className="px-2.5 py-1 bg-red-650 hover:bg-red-700 text-white rounded text-[9.5px] font-bold uppercase cursor-pointer"
                                >
                                  ✗ Decline
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setUsers(prev => prev.map(u => u.id === app.id ? { ...u, status: "Suspended" } : u));
                                    setSystemAlertMessage(`⚠️ User "${app.ign}" suspended for inspection.`);
                                    addLog(`Admin: Users status suspended: ${app.ign}`);
                                  }}
                                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded text-[9px] font-bold uppercase border border-zinc-800"
                                >
                                  Suspend IP
                                </button>
                                <button
                                  onClick={() => {
                                    setUsers(prev => prev.map(u => u.id === app.id ? { ...u, status: "Banned" } : u));
                                    setSystemAlertMessage(`🛑 Account "${app.ign}" has been permanently banned from matching!`);
                                    addLog(`Admin: Permanent ban applied: ${app.ign}`);
                                  }}
                                  className="px-2 py-1 bg-red-955/35 text-red-500 rounded text-[9px] font-black uppercase border border-red-900/30"
                                >
                                  BAN ACCOUNT
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* TOURNAMENT CONTROL */}
                {adminActiveTab === "tournaments" && (
                  <motion.div
                    key="admin-tournaments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left font-mono"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase block">OFFICER BRACKET MAKERS</span>
                      <h4 className="text-base font-black text-white uppercase">TOURNAMENT CONTROL CENTER</h4>
                    </div>

                    {/* Simple dynamic seed generator */}
                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                      <h4 className="text-xs font-black text-stone-100 uppercase tracking-widest pl-1">Create Admin Sanctioned Event</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-zinc-500 text-[10px]">Sanction Winner Trophy title:</label>
                          <input type="text" placeholder="e.g. CV Blitz Championship Africa" className="bg-black border border-zinc-800 p-2 text-white outline-none rounded w-full" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-zinc-500 text-[10px]">Maximum Teams Slots Seeding Count:</label>
                          <select className="bg-black border border-zinc-800 p-2 text-white outline-none rounded w-full">
                            <option>16 Matches Nodes</option>
                            <option>32 Matches Nodes</option>
                            <option>64 Matches Nodes</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setMetrics(prev => ({ ...prev, totalTournaments: prev.totalTournaments + 1 }));
                          setSystemAlertMessage("🏆 Admin Sanctioned Tournament active! Bracket seeded and live signup boards allocated.");
                          addLog("Admin: Created and sanctioned official regional tournament bracket.");
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] uppercase font-black tracking-wider rounded-lg"
                      >
                        Sanction Dynamic Bracket Group 🚀
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* SCRIMS CONTROL */}
                {adminActiveTab === "scrims" && (
                  <motion.div
                    key="admin-scrims"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase block">KEYS DISPATCH & OVERWRITE</span>
                      <h4 className="text-base font-black text-white uppercase font-sans">SCRIM CONTROL CENTER</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Create lobby */}
                      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 font-mono">
                        <h4 className="text-xs font-black text-stone-100 uppercase tracking-widest pl-1">Establish Lobbies Node</h4>
                        
                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500">Scrim Mirror Name:</label>
                            <input
                              type="text"
                              value={newScrimTitle}
                              onChange={(e) => setNewScrimTitle(e.target.value)}
                              placeholder="e.g. Erangel Squad Practice ZA-1"
                              className="w-full bg-black border border-zinc-800 p-2 text-white rounded outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500">Active Room Code Key Pass:</label>
                            <input
                              type="text"
                              value={newScrimCode}
                              onChange={(e) => setNewScrimCode(e.target.value)}
                              placeholder="e.g. ZA_LOBBY_9381"
                              className="w-full bg-black border border-zinc-800 p-2 text-white rounded outline-none text-[#ff001c] font-bold"
                            />
                          </div>

                          <button
                            onClick={() => {
                              if (!newScrimTitle || !newScrimCode) return;
                              setScrims(prev => [...prev, {
                                id: `scrim-${Date.now()}`,
                                title: newScrimTitle,
                                slotsMax: 20,
                                slotsAvailable: 20,
                                code: newScrimCode,
                                status: "Live Code"
                              }]);
                              setSystemAlertMessage(`📡 Scrim lobby "${newScrimTitle}" established! Room keys broadcasted.`);
                              addLog(`Admin: Dispatched scrim keys: "${newScrimCode}"`);
                              setNewScrimTitle("");
                              setNewScrimCode("");
                            }}
                            className="bg-emerald-500 text-black font-extrabold text-[10px] uppercase py-2 px-3.5 rounded duration-100 hover:bg-emerald-400"
                          >
                            DISPATCH KEY AND BROADCAST 🚀
                          </button>
                        </div>
                      </div>

                      {/* Right: Active scrim list */}
                      <div className="bg-[#040806]/80 p-5 rounded-2xl border border-emerald-950/45 space-y-4 text-xs font-mono">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Active Lobbies Keys Index</h4>
                        
                        <div className="space-y-3">
                          {scrims.map((sc) => (
                            <div key={sc.id} className="bg-black p-3 border border-zinc-900 rounded-xl space-y-1.5">
                              <div className="flex justify-between items-baseline font-bold text-white">
                                <span>{sc.title}</span>
                                <span className="text-[#ff001c] font-black">{sc.code}</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-zinc-500">
                                <span>Status: {sc.status}</span>
                                <button
                                  onClick={() => {
                                    setScrims(prev => prev.filter(s => s.id !== sc.id));
                                    setSystemAlertMessage("🗑️ Scrim code retracted.");
                                  }}
                                  className="text-red-500 hover:underline"
                                >
                                  [Retract Passcode]
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* TDM RANKED SEASONS */}
                {adminActiveTab === "tdm" && (
                  <motion.div
                    key="admin-tdm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left font-mono"
                  >
                    <div className="border-b border-zinc-900 pb-3">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase block">LADDER MULTIPLIERS CAP</span>
                      <h4 className="text-base font-black text-white uppercase">TDM RANKED SEASONS CONFIG</h4>
                    </div>

                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-200 uppercase tracking-wider block">Ranked Season Title:</label>
                        <input
                          type="text"
                          value={tdmActiveSeason}
                          onChange={(e) => setTdmActiveSeason(e.target.value)}
                          className="bg-black border border-zinc-800 p-2 text-white font-bold text-sm rounded outline-none focus:border-emerald-500 w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-400">XP Points Rank Multiplier:</span>
                          <strong className="text-emerald-400 font-bold">{tdmMultiplier}x multiplier points</strong>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.1"
                          value={tdmMultiplier}
                          onChange={(e) => setTdmMultiplier(parseFloat(e.target.value))}
                          className="w-full accent-emerald-500"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSystemAlertMessage(`🥈 TDM Ranked multiplier updated to ${tdmMultiplier}x for "${tdmActiveSeason}"!`);
                          addLog(`Admin: Set TDM Ladder point boost to ${tdmMultiplier}x.`);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[9.5px] uppercase rounded"
                      >
                        Commit seasonal coefficients 💎
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* BULLETINS */}
                {adminActiveTab === "banners" && (
                  <motion.div
                    key="admin-banners"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase block">GLOBAL REFRESH LOGS</span>
                      <h4 className="text-base font-black text-white uppercase">GLOBAL ANNOUNCEMENTS CENTER</h4>
                    </div>

                    <div className="bg-zinc-950 p-5 border border-zinc-900 rounded-2xl space-y-4 text-xs font-mono">
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 block uppercase">Operational Announcement Message:</label>
                        <textarea
                          rows={3}
                          placeholder="Broadcast rules shifts, live brackets additions..."
                          className="w-full bg-black border border-zinc-800 focus:border-emerald-500 p-2 text-white outline-none rounded text-xs"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSystemAlertMessage("📢 Global dashboard bulletin updated!");
                          addLog("Admin: Broadcasted general platform announcement bulletin.");
                        }}
                        className="px-4 py-2 bg-emerald-500 text-black font-black text-[10px] uppercase rounded hover:bg-emerald-400"
                      >
                        Publish General Bulletin
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* CMS News & stream Spotlight */}
                {adminActiveTab === "content" && (
                  <motion.div
                    key="admin-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase block">Home CMS Modules</span>
                      <h4 className="text-base font-black text-white uppercase">HOMEPAGE NEWS & SLIDER CONTENT MANAGEMENT</h4>
                    </div>

                    <div className="bg-zinc-950 p-5 border border-zinc-900 rounded-2xl space-y-4 text-xs font-mono">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest pl-1">Highlight Spotlight Streamer</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9.5px] text-zinc-500 block">Streamer Name:</label>
                          <input type="text" placeholder="e.g. mucheche_pro_cast" className="bg-black border border-zinc-800 p-2 text-white rounded outline-none w-full" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9.5px] text-zinc-500 block">Streaming platform coverage:</label>
                          <select className="bg-black border border-zinc-800 p-2 text-white rounded outline-none w-full">
                            <option>Twitch primary streamer</option>
                            <option>YouTube Live caster</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => setSystemAlertMessage("✓ Streamer spotlights updated! Marked for homepage display highlights.")}
                        className="px-3.5 py-2 bg-emerald-500 text-black font-black text-[10px] uppercase rounded"
                      >
                        Update Spotlight Slider Index
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STREAMERS VERIFIER */}
                {adminActiveTab === "streamers" && (
                  <motion.div
                    key="admin-streamers"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono">
                      <span className="text-[9px] text-emerald-400 font-extrabold uppercase block">LIVE GRID BROADCASTERS</span>
                      <h4 className="text-base font-black text-white uppercase">STREAMER VERIFICATION SYSTEM</h4>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      {streamers.map((st, idx) => (
                        <div key={idx} className="bg-black/60 p-4 border border-zinc-900 rounded-xl flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-white text-sm">{st.name}</strong>
                              <span className="text-[9px] uppercase tracking-wider bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">{st.platform}</span>
                            </div>
                            <span className="text-zinc-500 text-[10px] block font-sans">Estimated live viewership: {st.views}</span>
                          </div>

                          <div>
                            {st.verified ? (
                              <span className="text-emerald-400 text-xs font-black">🟢 CERTIFIED CASTER BADGE</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setStreamers(prev => prev.map((s, i) => i === idx ? { ...s, verified: true } : s));
                                  setSystemAlertMessage(`🎉 Approved broadcaster certification for: ${st.name}`);
                                  addLog(`Admin: Certified broadcaster: ${st.name}`);
                                }}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black uppercase font-black tracking-wider text-[9px] rounded"
                              >
                                Certify Broadcasting License
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* TEAM VERIFIER */}
                {adminActiveTab === "teams" && (
                  <motion.div
                    key="admin-teams"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono">
                      <span className="text-[9px] text-emerald-400 font-extrabold block uppercase">ALIGNMENTS AUDITING QUEUE</span>
                      <h4 className="text-base font-black text-white uppercase font-sans">COMMUNITY SQUADS MODERATOR DECK</h4>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      {teamVerifyRequests.map((rec) => (
                        <div key={rec.id} className="bg-black/60 p-4 border border-zinc-900 rounded-xl flex justify-between items-center">
                          <div className="space-y-1.5">
                            <strong className="text-white text-sm">{rec.name} [{rec.tag}]</strong>
                            <p className="text-zinc-500 text-[10px]">Playtime volume: <span className="text-zinc-300">{rec.activity}</span> | Profile Checklist complete: <span className="text-zinc-300">{rec.completePro}</span></p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setTeamVerifyRequests(prev => prev.filter(r => r.id !== rec.id));
                                setSystemAlertMessage(`🎉 Verified Status granted to Community team: "${rec.name}"!`);
                                addLog(`Admin: Verified Community Team Badge conferred to "${rec.name}"`);
                              }}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black uppercase font-black text-[9px] rounded"
                            >
                              GRANT CAPTAIN CERTIFICATE ✓
                            </button>
                            <button
                              onClick={() => {
                                setTeamVerifyRequests(prev => prev.map(r => r.id === rec.id ? { ...r, status: "Insufficient Activity" } : r));
                                setSystemAlertMessage("⚠️ Verification delayed. Requested more scrimmage hours.");
                              }}
                              className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[9px] rounded"
                            >
                              Report Playtime Delay
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* REWARDS STORE DEPLOYER */}
                {adminActiveTab === "rewards" && (
                  <motion.div
                    key="admin-rewards"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono">
                      <span className="text-[9px] text-emerald-400 font-black block uppercase">AUTOMATED MEDAL DISTRIBUTOR</span>
                      <h4 className="text-base font-black text-white uppercase">REWARDS BADGING MATRIX</h4>
                    </div>

                    <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 font-mono text-xs">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest pl-1">Confer Medal Dynamic Badge to Captains</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        
                        <button
                          onClick={() => {
                            setSystemAlertMessage("🎖️ Custom badge 'SEASON 1 GLADIATOR' award triggers dispatched to all top 10 TDM!");
                            addLog("Rewards: Distributed season-finish badges to eligible athletes.");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-850 p-3 rounded-xl border border-zinc-800 text-left"
                        >
                          <strong className="text-amber-500 font-black tracking-wide block text-[10px] uppercase">RANKED SEASONS BRONZE WINNERS</strong>
                          <span className="text-[8.5px] text-zinc-500 block">Confer Bronze star accolade badge</span>
                        </button>

                        <button
                          onClick={() => {
                            setSystemAlertMessage("🎖️ Custom badge 'TOP DECORATED CASTER' dispatched to verified streamers!");
                            addLog("Rewards: Handed caster elite badges to streamers log.");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-850 p-3 rounded-xl border border-zinc-800 text-left"
                        >
                          <strong className="text-emerald-400 font-black tracking-wide block text-[10px] uppercase">SPOTLIGHT STREAMER ACCREDIT</strong>
                          <span className="text-[8.5px] text-zinc-500 block">Confer microphone visual overlay badge</span>
                        </button>

                        <button
                          onClick={() => {
                            setSystemAlertMessage("🎖️ Custom badge 'UNBLEMISHED STANDING' dispatched to all community accounts!");
                          }}
                          className="bg-zinc-900 hover:bg-zinc-850 p-3 rounded-xl border border-zinc-800 text-left"
                        >
                          <strong className="text-white font-black tracking-wide block text-[10px] uppercase">HOLISTIC REPUTATION SHIELDS</strong>
                          <span className="text-[8.5px] text-zinc-500 block">Give safety badge to stars reputation 90+</span>
                        </button>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CV LEGENDS HO FORUM */}
                {adminActiveTab === "legends" && (
                  <motion.div
                    key="admin-legends"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 text-left"
                  >
                    <div className="border-b border-zinc-900 pb-3 font-mono font-bold">
                      <span className="text-[9px] text-emerald-400 block uppercase">HALL OF FAME CHRONICLES</span>
                      <h4 className="text-base font-black text-white uppercase">CV LEGENDS REGISTER MANAGER</h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: adding records */}
                      <div className="lg:col-span-1.5 bg-zinc-950 p-5 border border-zinc-900 rounded-2xl space-y-4 font-mono text-xs">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest pl-1">Inscribe Legend Profile</h4>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-zinc-500">Legend Ign/Athlete Name:</label>
                            <input
                              type="text"
                              value={newLegendName}
                              onChange={(e) => setNewLegendName(e.target.value)}
                              placeholder="e.g. tarid_cv_legend"
                              className="w-full bg-black border border-zinc-800 rounded p-2 text-white outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-zinc-500">Decorated Accomplishments Honor:</label>
                            <input
                              type="text"
                              value={newLegendHonor}
                              onChange={(e) => setNewLegendHonor(e.target.value)}
                              placeholder="e.g. Erangel Arena Triple Champion"
                              className="w-full bg-black border border-zinc-800 rounded p-2 text-white outline-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              if (!newLegendName || !newLegendHonor) return;
                              setLegends(prev => [...prev, {
                                name: newLegendName,
                                honor: newLegendHonor,
                                season: "Conferred Season 2"
                              }]);
                              setSystemAlertMessage(`🏆 Inscribed "${newLegendName}" into our historic hall of eSports Legends!`);
                              addLog(`Admin: Appended Legend Profile record: "${newLegendName}"`);
                              setNewLegendName("");
                              setNewLegendHonor("");
                            }}
                            className="bg-emerald-500 text-black font-extrabold uppercase text-[10px] py-2 px-3.5 rounded"
                          >
                            Confer Legend Status 🚀
                          </button>
                        </div>
                      </div>

                      {/* Right: listed records */}
                      <div className="md:col-span-1.5 bg-[#0a0c0b]/50 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs font-mono">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest pl-1">Inscribed Hall of Fame</h4>
                        
                        <div className="space-y-2.5">
                          {legends.map((leg, idx) => (
                            <div key={idx} className="bg-black border border-zinc-900 p-3 rounded-xl">
                              <strong className="text-white block text-sm">{leg.name}</strong>
                              <span className="text-[10.5px] text-amber-500 block font-normal">{leg.honor}</span>
                              <span className="text-[9px] text-zinc-500 block font-sans">{leg.season}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
