import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Lock, Unlock, Key, RefreshCw, Sliders, Settings, 
  AlertTriangle, HeartPulse, Users, Radio, Sword, Eye, EyeOff, 
  Trash2, LogOut, CheckCircle, XCircle, Tv, Zap, Database, 
  Map, Search, Award, Cpu, FileSpreadsheet, Terminal, Fingerprint, 
  Smartphone, Network, Activity, Bell, History, UserX, X, Check, Globe
} from "lucide-react";

interface CVManagementPortalProps {
  onClose: () => void;
  currentRole: string;
  setSystemAlertMessage: (msg: string) => void;
  awardXp: (amount: number) => void;
  isPlatformLocked: boolean;
  setIsPlatformLocked: (locked: boolean) => void;
  isMaintenanceMode: boolean;
  setIsMaintenanceMode: (maintenance: boolean) => void;
  adminActionsSuspended: boolean;
  setAdminActionsSuspended: (suspended: boolean) => void;
  rolePermissions: Record<string, Record<string, boolean>>;
  setRolePermissions: React.Dispatch<React.SetStateAction<any>>;
  playInteractionSound?: (type: "click" | "success" | "alert" | "hover" | "matchFound" | "tournamentStart") => void;
}

// Simulated predefined accounts
const STAFF_ACCOUNTS = [
  { username: "owner_slayer", password: "crimson2026", role: "Owner" as const, name: "CV Slayer IGL", email: "slayer@cvesports.gg" },
  { username: "head_admin_vortex", password: "vortex2026", role: "Head Admin" as const, name: "Admin Vortex", email: "vortex@cvesports.gg" },
  { username: "tourney_admin_blitz", password: "blitz2026", role: "Admin" as const, name: "Tourney Blitz", email: "blitz@cvesports.gg" },
  { username: "scrim_admin_spectre", password: "spectre2026", role: "Admin" as const, name: "Scrim Spectre", email: "spectre@cvesports.gg" },
  { username: "mod_guardian", password: "guardian2026", role: "Moderator" as const, name: "Mod Guardian", email: "guardian@cvesports.gg" }
];

export default function CVManagementPortal({
  onClose,
  currentRole,
  setSystemAlertMessage,
  awardXp,
  isPlatformLocked,
  setIsPlatformLocked,
  isMaintenanceMode,
  setIsMaintenanceMode,
  adminActionsSuspended,
  setAdminActionsSuspended,
  rolePermissions,
  setRolePermissions,
  playInteractionSound
}: CVManagementPortalProps) {
  
  // -------------------------------------------------------------
  // Portal States
  // -------------------------------------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof STAFF_ACCOUNTS[0] | null>(null);
  
  // Login Sequence levels: 1 = Username, 2 = Password, 3 = Email Code, 4 = 2FA Authenticator, 5 = Device Check
  const [loginStep, setLoginStep] = useState<number>(1);
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputEmailCode, setInputEmailCode] = useState("");
  const [input2FA, setInput2FA] = useState("");
  const [inputDeviceCode, setInputDeviceCode] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isTrustedDevice, setIsTrustedDevice] = useState(true); // Toggle to simulate "new device"
  
  const [generatedEmailCode, setGeneratedEmailCode] = useState<string>("");
  const [generated2FACode, setGenerated2FACode] = useState<string>("529381");
  const [generatedDeviceCode, setGeneratedDeviceCode] = useState<string>("SYS_LINK_811");
  const [loginError, setLoginError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // System Stats
  const [activeUsers, setActiveUsers] = useState(254);
  const [liveTournaments, setLiveTournaments] = useState(3);
  const [activeScrims, setActiveScrims] = useState(8);
  const [tdmArenaActivePool, setTdmArenaActivePool] = useState(14);
  const [platformHealth, setPlatformHealth] = useState(99.6);

  // -------------------------------------------------------------
  // Security Audits & Login History Logs
  // -------------------------------------------------------------
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [sessions, setSessions] = useState([
    { id: "s1", location: "Cape Town, ZA", ip: "165.110.12.9", device: "Command Node VPS", type: "Server Auth", active: true },
    { id: "s2", location: "London, UK", ip: "109.11.23.111", device: "Esports Arena IGL Console", type: "Remote Deck", active: true },
    { id: "s3a", location: "San Francisco, USA", ip: "127.0.0.1", device: "This Management Terminal", type: "Browser SSL", active: true },
  ]);

  const [loginHistory, setLoginHistory] = useState([
    { time: "08:12:05", status: "SUCCESS", device: "Command Node VPS", ip: "165.110.12.9", user: "owner_slayer" },
    { time: "07:44:31", status: "SUCCESS", device: "Esports Arena IGL Console", ip: "109.11.23.111", user: "tourney_admin_blitz" },
    { time: "06:15:20", status: "FAILED", device: "Unknown Android", ip: "45.22.115.82", user: "admin_vortex" },
    { time: "05:01:14", status: "FAILED", device: "Unrecognized Browser", ip: "185.90.221.4", user: "root" }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState([
    { id: "a1", time: "06:15:20", type: "EXPLOIT_ATTEMPT", msg: "Lobby injector request blocked by Security Guardian endpoint.", level: "CRITICAL" },
    { id: "a2", time: "05:01:14", type: "FAILED_LOGIN", msg: "Brute force pattern threshold warned for IP 185.90.221.4.", level: "WARNING" }
  ]);

  // Admin Permissions (Owner edits these)
  const [adminPermissions, setAdminPermissions] = useState({
    blitz: { tournament: true, scrims: false, community: false, media: true },
    spectre: { tournament: false, scrims: true, community: true, media: false },
    guardian: { tournament: false, scrims: false, community: true, media: false }
  });

  // Moderate Reports simulation data
  const [pendingReports, setPendingReports] = useState(() => {
    const saved = localStorage.getItem("cv_pending_reports");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default fallback
      }
    }
    return [
      { id: "rep1", reporter: "toxic_buster_99", reported: "cv_hacker_z", reason: "Wall-hack proxy trigger", timestamp: "10m ago" },
      { id: "rep2", reporter: "TeamLiquid_Cap", reported: "noob_spray", reason: "Host sabotage in scrim server", timestamp: "24m ago" },
      { id: "rep3", reporter: "CV_Slayer_IGL", reported: "flame_master_0", reason: "Verbal toxicity in global TDM lobby", timestamp: "1h ago" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("cv_pending_reports", JSON.stringify(pendingReports));
  }, [pendingReports]);

  // Active tournaments on admin panel
  const [adminTournaments, setAdminTournaments] = useState([
    { id: "t1", name: "ZIMBABWE PRO SERIES 2026", pool: "$5,000 USD", status: "MATCH_DAY_3" },
    { id: "t2", name: "CRIMSON SQUAD SHOTDOWN", pool: "3,000 CV Coins", status: "SIGNUPS_OPEN" }
  ]);

  // Active Scrims simulation
  const [adminScrims, setAdminScrims] = useState([
    { id: "sc1", host: "CV_Elite_Unit", teams: "CV vs Fnatic Academy", ping: "22ms", state: "LOBBY_READY" },
    { id: "sc2", host: "Slayer_IGL", teams: "T1 Academy vs CV Recruits", ping: "45ms", state: "MATCH_LIVE" }
  ]);

  // -------------------------------------------------------------
  // CV Health Sentinel System States & Logic
  // -------------------------------------------------------------
  const [sentinelLogs, setSentinelLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] CV Health Sentinel Daemon initialized.`,
    `[${new Date().toLocaleTimeString()}] Monitoring active. Heartbeat cycle bound to 6000ms.`
  ]);
  const [sentinelPings, setSentinelPings] = useState<Record<string, { status: string; latency: number; healthy: boolean }>>({
    "/api/health": { status: "200 OK", latency: 12, healthy: true },
    "/api/tournaments": { status: "200 OK", latency: 18, healthy: true },
    "/api/scrims": { status: "200 OK", latency: 22, healthy: true },
    "/api/users": { status: "200 OK", latency: 15, healthy: true }
  });
  const [sentinelComponents, setSentinelComponents] = useState<Record<string, { mounted: boolean; healthy: boolean }>>({
    "Tournament Control Desk": { mounted: true, healthy: true },
    "Scrims Coordinator Pipeline": { mounted: true, healthy: true }
  });
  const [systemIntegrityHealthy, setSystemIntegrityHealthy] = useState(true);
  const [sentinelChaosActive, setSentinelChaosActive] = useState(false);

  // Re-trigger state initialization function (Self-Repair)
  const triggerSelfRepair = () => {
    // Reset critical mock components data & permissions to default healthy values
    setAdminTournaments([
      { id: "t1", name: "ZIMBABWE PRO SERIES 2026", pool: "$5,000 USD", status: "MATCH_DAY_3" },
      { id: "t2", name: "CRIMSON SQUAD SHOTDOWN", pool: "3,000 CV Coins", status: "SIGNUPS_OPEN" }
    ]);
    setAdminScrims([
      { id: "sc1", host: "CV_Elite_Unit", teams: "CV vs Fnatic Academy", ping: "22ms", state: "LOBBY_READY" },
      { id: "sc2", host: "Slayer_IGL", teams: "T1 Academy vs CV Recruits", ping: "45ms", state: "MATCH_LIVE" }
    ]);
    
    // Ensure the permissions are restored so the components mount!
    setAdminPermissions({
      blitz: { tournament: true, scrims: false, community: false, media: true },
      spectre: { tournament: false, scrims: true, community: true, media: false },
      guardian: { tournament: false, scrims: false, community: true, media: false }
    });
    
    setPlatformHealth(99.6);
    setSentinelChaosActive(false);
    setSystemIntegrityHealthy(true);

    // Refresh sentinel logs immediately
    const time = new Date().toLocaleTimeString();
    setSentinelLogs(prev => [
      `[${time}] 🔧 CV HEALTH SENTINEL: DISPATCHED SELF-REPAIR PROTOCOLS.`,
      `[${time}] 🔧 STATE INITIALIZATION FUNCTIONS RE-TRIGGERED.`,
      `[${time}] 🔧 RESTORED DEFAULT TOURNAMENT & SCRIM ROSTERS.`,
      `[${time}] 🔧 RESET RE-MOUNTED MODULE PERMISSIONS SECURITY MAPS.`,
      ...prev.slice(0, 10)
    ]);

    setSystemAlertMessage("🔧 CV HEALTH SENTINEL: Autonomous repair completed! State initialization re-triggered.");
    showToast("Ecosystem restored via state re-initialization.");
  };

  // Heartbeat Effect: Periodically ping key API endpoints and verify mounted components
  useEffect(() => {
    const runSentinelChecks = () => {
      const time = new Date().toLocaleTimeString();
      
      // Verify critical UI components are mounted and functional in DOM
      const tdmTourneyEl = document.getElementById("admin-tournament-list") !== null;
      const scrimEl = document.getElementById("admin-scrim-dashboard") !== null;

      const isTourneyDataIntact = adminTournaments.length > 0;
      const isScrimDataIntact = adminScrims.length > 0;

      const isTourneyHealthy = tdmTourneyEl && isTourneyDataIntact;
      const isScrimHealthy = scrimEl && isScrimDataIntact;

      // Simulating Endpoint Pings with slight latency drift
      const pingsToPerform = ["/api/health", "/api/tournaments", "/api/scrims", "/api/users"];
      const nextPings: Record<string, { status: string; latency: number; healthy: boolean }> = {};
      let anyPingFailed = false;

      pingsToPerform.forEach(endpoint => {
        const latency = Math.floor(Math.random() * 25) + 5; // 5ms - 30ms
        const isEndpointDown = sentinelChaosActive && (endpoint === "/api/tournaments" || endpoint === "/api/scrims");
        
        nextPings[endpoint] = {
          status: isEndpointDown ? "503 SERVICE UNAVAILABLE" : "200 OK",
          latency: isEndpointDown ? 1500 : latency,
          healthy: !isEndpointDown
        };
        
        if (isEndpointDown) {
          anyPingFailed = true;
        }
      });

      // Update component health status state
      const updatedComponents = {
        "Tournament Control Desk": { mounted: tdmTourneyEl, healthy: isTourneyHealthy && !sentinelChaosActive },
        "Scrims Coordinator Pipeline": { mounted: scrimEl, healthy: isScrimHealthy && !sentinelChaosActive }
      };

      setSentinelPings(nextPings);
      setSentinelComponents(updatedComponents);

      // Verify overall health state
      const isEverythingHealthy = !anyPingFailed && tdmTourneyEl && scrimEl && isTourneyDataIntact && isScrimDataIntact && !sentinelChaosActive;
      setSystemIntegrityHealthy(isEverythingHealthy);

      if (!isEverythingHealthy) {
        setPlatformHealth(p => Math.max(45, Math.floor(p - (Math.random() * 15 + 5))));
      } else {
        setPlatformHealth(99.6);
      }

      // Append logs
      const nextLogs: string[] = [];
      pingsToPerform.forEach(ep => {
        const ping = nextPings[ep];
        if (!ping.healthy) {
          nextLogs.push(`[${time}] 🚨 Ping FAILURE: ${ep} responded ${ping.status} (${ping.latency}ms)`);
        } else {
          // occasional log for activity feel
          if (Math.random() > 0.5) {
            nextLogs.push(`[${time}] 🟢 Ping SUCCESS: ${ep} responded 200 OK (${ping.latency}ms)`);
          }
        }
      });

      if (!tdmTourneyEl) {
        nextLogs.push(`[${time}] ⚠️ Component UNMOUNTED: Tournament Control Desk is not detected in DOM.`);
      } else if (!isTourneyHealthy) {
        nextLogs.push(`[${time}] ⚠️ Component MALFUNCTION: Tournament Control Desk mounted but records empty.`);
      } else {
        nextLogs.push(`[${time}] 🛡️ Component OK: Tournament Control Desk verified functional (Mounted & Active).`);
      }

      if (!scrimEl) {
        nextLogs.push(`[${time}] ⚠️ Component UNMOUNTED: Scrims Coordinator Pipeline is not detected in DOM.`);
      } else if (!isScrimHealthy) {
        nextLogs.push(`[${time}] ⚠️ Component MALFUNCTION: Scrims Coordinator Pipeline mounted but records empty.`);
      } else {
        nextLogs.push(`[${time}] 🛡️ Component OK: Scrims Coordinator Pipeline verified functional (Mounted & Active).`);
      }

      if (sentinelChaosActive) {
        nextLogs.push(`[${time}] ☣️ CHAOS OVERRIDE DETECTED: Packet congestion test-bed injected.`);
      }

      setSentinelLogs(prev => [...nextLogs, ...prev].slice(0, 20));
    };

    // run checks immediately on mount or status change
    runSentinelChecks();

    const intervalId = setInterval(runSentinelChecks, 6000);
    return () => clearInterval(intervalId);
  }, [adminTournaments, adminScrims, adminPermissions, sentinelChaosActive]);

  // TDM chat filter strings
  const [wordFilters, setWordFilters] = useState(["hack", "exploit", "sabotage", "boomer", "noobtrash"]);
  const [newFilter, setNewFilter] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const dispatchAlert = (type: string, msg: string, level: "WARNING" | "CRITICAL") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newAlert = {
      id: `alert_${Date.now()}`,
      time: timeStr,
      type,
      msg,
      level
    };
    setSecurityAlerts(prev => [newAlert, ...prev]);
    setSystemAlertMessage(`🚨 SECURITY ACTION: ${msg}`);
  };

  // -------------------------------------------------------------
  // Login Sequence Handler
  // -------------------------------------------------------------
  const handleNextStep = () => {
    setLoginError("");

    // LEVEL 1: Check Username
    if (loginStep === 1) {
      if (!inputUsername.trim()) {
        setLoginError("Staff username cannot be blank.");
        return;
      }
      const matched = STAFF_ACCOUNTS.find(a => a.username.toLowerCase() === inputUsername.toLowerCase());
      if (!matched) {
        setLoginError("ACCESS DENIED: Unregistered management fingerprint.");
        setFailedAttempts(p => p + 1);
        dispatchAlert("UNAUTHORIZED_USER", `Unregistered user attempt: '${inputUsername}'`, "WARNING");
        return;
      }
      setLoginStep(2);
      return;
    }

    // LEVEL 2: Check Password
    if (loginStep === 2) {
      const matched = STAFF_ACCOUNTS.find(a => a.username.toLowerCase() === inputUsername.toLowerCase());
      if (matched && matched.password === inputPassword) {
        // Trigger simulated Email code transmission
        const simulatedCode = Math.floor(100000 + Math.random() * 90000).toString();
        setGeneratedEmailCode(simulatedCode);
        setLoginStep(3);
        showToast(`Virtual verification code sent to staff email: ${matched.email}`);
        return;
      } else {
        setLoginError("ACCESS DENIED: Mismatched password credentials.");
        setFailedAttempts(p => {
          const updated = p + 1;
          if (updated >= 3) {
            dispatchAlert("BRUTE_FORCE_WARN", `Multiple password failures on account '${inputUsername}'`, "CRITICAL");
          }
          return updated;
        });
        return;
      }
    }

    // LEVEL 3: Check Email Code
    if (loginStep === 3) {
      if (inputEmailCode === generatedEmailCode || inputEmailCode === "999999") {
        setLoginStep(4);
        return;
      } else {
        setLoginError("SECURITY CORRUPTION: Invalid dynamic intercept token.");
        return;
      }
    }

    // LEVEL 4: Check 2FA App Code
    if (loginStep === 4) {
      if (input2FA === generated2FACode || input2FA === "123456") {
        if (!isTrustedDevice) {
          // Device Verification (Level 5) required
          setLoginStep(5);
          dispatchAlert("NEW_DEVICE_PREVENT", `Unrecognized client hardware requested authentication: '${inputUsername}'`, "CRITICAL");
          showToast("A security alert has been dispatched to the account Owner.");
        } else {
          // Trusted - skip to success
          completeLogin();
        }
      } else {
        setLoginError("2FA FAILED: Device sync mismatch. Check authorization app time.");
        return;
      }
    }

    // LEVEL 5: Device Verification
    if (loginStep === 5) {
      if (inputDeviceCode.toUpperCase() === generatedDeviceCode || inputDeviceCode === "SYS_OVERRIDE_00") {
        completeLogin();
      } else {
        setLoginError("DEVICE SYNC REFUSED: Secure payload handshake failed.");
        return;
      }
    }
  };

  const completeLogin = () => {
    const matched = STAFF_ACCOUNTS.find(a => a.username.toLowerCase() === inputUsername.toLowerCase())!;
    setCurrentUser(matched);
    setIsLoggedIn(true);
    awardXp(50);
    setSystemAlertMessage(`🟢 ACCESS APPROVED: Welcome back to CV Operations, ${matched.name}!`);
    
    // Add to Login History
    const now = new Date();
    setLoginHistory(prev => [
      {
        time: now.toTimeString().split(" ")[0],
        status: "SUCCESS",
        device: isTrustedDevice ? "Registered Core Desk" : "NEW SECURE-DEVICE COMPONENT",
        ip: "127.0.0.1",
        user: matched.username
      },
      ...prev
    ]);

    // Truncate some alerts if needed
    if (!isTrustedDevice) {
      dispatchAlert("NEW_DEVICE_APPROVED", `Staff '${matched.username}' registered new secure hardware node from 127.0.0.1.`, "WARNING");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginStep(1);
    setInputUsername("");
    setInputPassword("");
    setInputEmailCode("");
    setInput2FA("");
    setInputDeviceCode("");
    setGeneratedEmailCode("");
    setLoginError("");
    showToast("Operations secure connection terminated successfully.");
  };

  // -------------------------------------------------------------
  // Dashboard Action Handlers
  // -------------------------------------------------------------
  const terminateSession = (id: string, loc: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    dispatchAlert("REMOTE_KILL", `Active session in ${loc} terminated remotely by ${currentUser?.username}.`, "WARNING");
    showToast(`Successfully pruned secure session [${id}] - remote token discarded.`);
  };

  const handleAddWordFilter = () => {
    if (!newFilter.trim()) return;
    setWordFilters(prev => [...prev, newFilter.toLowerCase().trim()]);
    dispatchAlert("DICTIONARY_MUTATION", `Global chat censorship word '${newFilter}' appended.`, "WARNING");
    setNewFilter("");
    showToast("Chat word filter definition appended live.");
  };

  const handleRemoveWordFilter = (word: string) => {
    setWordFilters(prev => prev.filter(w => w !== word));
    dispatchAlert("DICTIONARY_MUTATION", `Global censorship word '${word}' purged.`, "WARNING");
    showToast("Chat word filter removed.");
  };

  const handleToggleAdminPermission = (adminKey: "blitz" | "spectre" | "guardian", permissionKey: "tournament" | "scrims" | "community" | "media") => {
    setAdminPermissions(prev => {
      const updated = {
        ...prev,
        [adminKey]: {
          ...prev[adminKey],
          [permissionKey]: !prev[adminKey][permissionKey]
        }
      };
      dispatchAlert("PERMISSION_CORRUPTION", `Superuser manually toggled ${adminKey} permission ${permissionKey} to ${updated[adminKey][permissionKey] ? "ON" : "OFF"}.`, "WARNING");
      return updated;
    });
  };

  const handleResolveReport = (id: string, decision: string) => {
    setPendingReports(prev => prev.filter(r => r.id !== id));
    showToast(`Case ${id} evaluated: ${decision}. User shadowbanned recursively.`);
    awardXp(15);
  };

  // Owner Emergency System Triggers
  const toggleEmergencyLockdown = () => {
    setIsPlatformLocked(!isPlatformLocked);
    dispatchAlert(
      isPlatformLocked ? "SYSTEM_RESTORATION" : "COMMAND_LOCKDOWN", 
      isPlatformLocked 
        ? "Emergency lockdown override lifted by Owner. Global site restored." 
        : "OWNER EXECUTED IMMEDIATE GLOBAL LAYOUT SHIELD LOCKDOWN. PUBLIC SYSTEM SUSPENDED.", 
      "CRITICAL"
    );
    showToast(isPlatformLocked ? "Command lockdown deactivated. Public app serving normal nodes." : "CRITICAL WARNING: Platform security locked down.");
  };

  const toggleMaintenance = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
    dispatchAlert(
      isMaintenanceMode ? "MAINTENANCE_LIFTED" : "MAINTENANCE_INIT",
      isMaintenanceMode
        ? "Operations finished. Public main server returned online."
        : "Command server initiated physical maintenance grid. General traffic rerouted to static loading placeholder.",
      "CRITICAL"
    );
    showToast(isMaintenanceMode ? "Maintenance mode finished." : "Maintenance mode engaged.");
  };

  const toggleAdminSuspension = () => {
    setAdminActionsSuspended(!adminActionsSuspended);
    dispatchAlert(
      adminActionsSuspended ? "ADMIN_RESTORED" : "ADMIN_SUSPENDED",
      adminActionsSuspended
        ? "Administrative privilege suspension lifted. Staff actions are valid."
        : "OWNER RESTRICTED ADMIN PIPELINE: All subordinate admin and moderator endpoints suspended.",
      "CRITICAL"
    );
    showToast(adminActionsSuspended ? "Admins freed to use toolkit." : "All administrative tools locked.");
  };

  const restoreSystemBackup = () => {
    showToast("Spinning up latest snapshots to sector CV_CORE... Completed successfully.");
    dispatchAlert("SNAPSHOT_RESTORE", "Sectors restored to backup point timestamp: 2026-06-23T00:00:00-07:00", "CRITICAL");
  };

  // Determine helper badge for roles
  const getRoleTitle = (role: string) => {
    if (role === "Owner") return "👑 OWNER COMMAND CENTER";
    if (role === "Head Admin") return "⚙️ HEAD ADMIN CENTER";
    if (role === "Admin") return "🛠️ ADMIN DASHBOARD";
    return "🛡️ MODERATION DASHBOARD";
  };

  // Permissions validation helper for currently logged in Admin
  const hasPermission = (permissionType: "tournament" | "scrims" | "community" | "media") => {
    if (!currentUser) return false;
    if (currentUser.role === "Owner" || currentUser.role === "Head Admin") return true;
    
    // For normal Admins, check their specific user dictionary
    if (currentUser.username === "tourney_admin_blitz") {
      return adminPermissions.blitz[permissionType];
    }
    if (currentUser.username === "scrim_admin_spectre") {
      return adminPermissions.spectre[permissionType];
    }
    if (currentUser.username === "mod_guardian") {
      return adminPermissions.guardian[permissionType];
    }
    return false;
  };

  return (
    <div id="cv-management-access-system" className="fixed inset-0 z-50 bg-[#070303] text-[#fbf5f5] overflow-y-auto font-mono flex flex-col p-4 md:p-8 custom-scrollbar">
      
      {/* GLOWING RED STAIRCASE ACCENT FOR HIGH TECH OPERATIONS CENTER */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-800 via-red-600 to-red-900 shadow-[0_0_20px_rgba(255,0,31,0.85)] z-50 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-red-900/30 pb-4 mb-6 shrink-0 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-950/40 border border-red-500/50 rounded flex items-center justify-center font-black text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse shrink-0">
            <Radio size={20} className="text-red-500 rotate-12" />
          </div>
          <div className="text-left">
            <span className="text-white font-extrabold tracking-widest text-lg font-orbitron flex items-center leading-none">
              CV<span className="text-red-500 font-black">.</span>MGMT <span className="text-[10px] ml-2 text-zinc-400 border border-red-900/50 px-1.5 py-0.5 rounded leading-none">V2.8</span>
            </span>
            <span className="text-[8px] text-zinc-500 tracking-widest block uppercase mt-1">CV ESPORTS SECURITY OPERATIONS CENTER</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right font-mono text-[9px] text-zinc-500">
            <span>PING: <strong className="text-emerald-500">24ms</strong></span>
            <span>GRID: <strong className="text-red-500">SECURE_SSL_NODE</strong></span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-red-950/20 hover:bg-red-950/60 text-red-500 border border-red-900/40 rounded transition-all flex items-center gap-1 cursor-pointer text-xs uppercase hover:scale-105"
            title="Exit Ops Deck"
          >
            <X size={14} />
            <span className="hidden sm:inline font-bold">CLOSE OPS</span>
          </button>
        </div>
      </div>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-950 border border-red-500/80 px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(255,0,31,0.3)] text-[10px] uppercase font-mono flex items-center gap-2 max-w-sm text-center font-bold text-red-400"
          >
            <AlertTriangle size={14} className="text-red-500 animate-bounce shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* =========================================================
            STATE A: SECURE MULTI-LAYER LOGIN GATE
            ========================================================= */}
        {!isLoggedIn ? (
          <div className="w-full flex items-center justify-center py-6">
            <div className="bg-[#0f0707] border border-red-950 rounded-2xl w-full max-w-md overflow-hidden relative shadow-[0_0_40px_rgba(255,0,0,0.12)]">
              
              {/* Radar Grid Graphic Background Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,31,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,31,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              {/* BRANDING CARD HEADER */}
              <div className="bg-red-950/30 p-6 border-b border-red-950 text-center relative">
                <span className="text-[9px] font-black tracking-[0.3em] text-red-500 uppercase block mb-1">
                  TACTICAL OVERRIDE SYSTEM
                </span>
                <h1 className="text-md font-orbitron font-black text-white uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Shield size={16} className="text-red-500" />
                  CV eSports Management Portal
                </h1>
                
                {/* Security status indicator bar */}
                <div className="mt-4 inline-flex items-center gap-2 bg-neutral-950/80 border border-red-900/30 px-3 py-1 rounded-full text-[9px] text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MATRIX ENCRYPT: C-AES-256</span>
                  <span className="text-red-950">|</span>
                  <span className="text-zinc-500">FAULTS: {failedAttempts}</span>
                </div>
              </div>

              <div className="p-6 space-y-4 text-left relative">
                
                {/* STEP INDICATORS */}
                <div className="grid grid-cols-5 gap-1 pb-2">
                  {[1, 2, 3, 4, 5].map((step) => {
                    let indicatorState = "bg-neutral-900 border-zinc-900 text-zinc-600";
                    if (loginStep === step) {
                      indicatorState = "bg-red-950 border-red-600/60 text-red-400 font-extrabold shadow-[0_0_8px_rgba(239,68,68,0.3)]";
                    } else if (loginStep > step) {
                      indicatorState = "bg-red-950/20 border-red-900 text-neutral-500";
                    }
                    return (
                      <div 
                        key={step} 
                        className={`border text-[8px] rounded py-1 text-center font-mono flex flex-col justify-center items-center transition-all ${indicatorState}`}
                      >
                        <span>Lvl {step}</span>
                        {loginStep > step && <span className="text-[6px] text-red-500 font-black">✔</span>}
                      </div>
                    );
                  })}
                </div>

                {/* ERROR PANEL */}
                {loginError && (
                  <div className="bg-red-950/45 border border-red-900/65 rounded-lg p-3 text-[10px] text-red-400 font-mono flex gap-2.5 items-start">
                    <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase tracking-wider">SECURE SHIELD BLOCK:</p>
                      <p>{loginError}</p>
                    </div>
                  </div>
                )}

                {/* DEMO TOOLKIT DRAWER - EXTENDED TO ENCOURAGE FASTER TESTING BY INJECTING PREDEFINED VALUES */}
                <div className="bg-neutral-950/90 border border-red-900/20 rounded-lg p-3 space-y-1.5 text-[9px]">
                  <div className="flex justify-between items-center text-zinc-500 uppercase border-b border-zinc-900/60 pb-1">
                    <span className="font-extrabold">Simulated Tech Demo Account Directory:</span>
                    <span className="text-red-500 animate-pulse font-black font-mono">DEBUG_PAD</span>
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                    {STAFF_ACCOUNTS.map(staff => (
                      <button
                        key={staff.username}
                        type="button"
                        onClick={() => {
                          setInputUsername(staff.username);
                          setInputPassword(staff.password);
                          setLoginStep(1);
                          setLoginError("");
                          showToast(`Injected username & password: ${staff.role}`);
                        }}
                        className="w-full text-left bg-stone-900/40 hover:bg-red-950/20 border border-zinc-900 px-2 py-1 rounded flex justify-between items-center cursor-pointer hover:border-red-900/40 transition-colors"
                      >
                        <span className="text-zinc-300 font-semibold">{staff.username} <span className="text-gray-500">({staff.role})</span></span>
                        <span className="text-red-500 text-[8px] font-mono">In ject 📥</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LAYER FIELDS */}
                <div className="space-y-3 pt-2">
                  
                  {/* LEVEL 1: Username Entry */}
                  {loginStep === 1 && (
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#ff001c] font-black uppercase font-mono tracking-widest block">
                        Level 1 Input: staff user identity
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 text-zinc-500 size={14}" size={14} />
                        <input
                          type="text"
                          value={inputUsername}
                          onChange={(e) => setInputUsername(e.target.value)}
                          placeholder="e.g. owner_slayer"
                          className="w-full bg-black/80 border border-zinc-800 rounded-lg px-9 py-2 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-red-600/80 uppercase"
                          onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
                        />
                      </div>
                    </div>
                  )}

                  {/* LEVEL 2: Password Entry */}
                  {loginStep === 2 && (
                    <div className="space-y-1 animate-fade-in text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] text-[#ff001c] font-black uppercase font-mono tracking-widest block">
                          Level 2 Input: Access Cryptokey
                        </label>
                        <span className="text-[8px] text-zinc-500">ID: {inputUsername}</span>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={inputPassword}
                          onChange={(e) => setInputPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-black/80 border border-zinc-800 rounded-lg px-9 py-2 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-red-600/80"
                          onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-zinc-500 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 3: Email Verification */}
                  {loginStep === 3 && (
                    <div className="space-y-1 animate-fade-in text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] text-[#ff001c] font-black uppercase font-mono tracking-widest block">
                          Level 3 Input: Dynamic Email Code
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const simulatedCode = Math.floor(100000 + Math.random() * 90000).toString();
                            setGeneratedEmailCode(simulatedCode);
                            showToast(`Simulated code dispatched: ${simulatedCode}`);
                          }}
                          className="text-[8px] text-zinc-400 hover:text-red-500 font-extrabold uppercase font-mono underline cursor-pointer"
                        >
                          RESEND_CODE
                        </button>
                      </div>
                      <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-2.5 mb-1.5 text-[9px] text-zinc-400 space-y-1 leading-snug">
                        <p className="text-zinc-300">✉️ Simulated security code sent to registered account mailbox.</p>
                        <p className="font-black text-red-400 tracking-wider">Virtual Code Sent: <span className="p-1 px-1.5 rounded bg-black/90 font-mono text-white text-[10px] select-all font-bold border border-red-950">{generatedEmailCode}</span></p>
                      </div>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                        <input
                          type="text"
                          maxLength={6}
                          value={inputEmailCode}
                          onChange={(e) => setInputEmailCode(e.target.value)}
                          placeholder="Enter 6-digit code or type 999999"
                          className="w-full bg-black/80 border border-zinc-800 rounded-lg px-9 py-2 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-red-600/80 text-center uppercase tracking-widest font-extrabold"
                          onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
                        />
                      </div>
                      <span className="text-[8px] text-zinc-500 text-center block pt-1">Bypass code helper: 999999</span>
                    </div>
                  )}

                  {/* LEVEL 4: 2FA App Code */}
                  {loginStep === 4 && (
                    <div className="space-y-1 animate-fade-in text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] text-[#ff001c] font-black uppercase font-mono tracking-widest block">
                          Level 4 Input: TOTP Authenticator Code
                        </label>
                        <span className="text-[8px] text-zinc-500 font-bold uppercase">SEC: 2FA_SYNC</span>
                      </div>
                      <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-2.5 mb-1.5 text-[9px] text-zinc-400 space-y-1 leading-snug">
                        <p className="text-zinc-300">📱 Open your Authenticator application (Google Authenticator) on your trusted mobile terminal.</p>
                        <p className="font-black text-red-500">Virtual Token Key: <span className="p-1 px-1.5 rounded bg-black text-red-400 font-mono text-[10px] border border-red-950 font-bold select-all">{generated2FACode}</span></p>
                      </div>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                        <input
                          type="text"
                          maxLength={6}
                          value={input2FA}
                          onChange={(e) => setInput2FA(e.target.value)}
                          placeholder="Enter 6-digit 2FA token or type 123456"
                          className="w-full bg-black/80 border border-zinc-800 rounded-lg px-9 py-2 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-red-600/80 text-center uppercase tracking-widest font-extrabold"
                          onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
                        />
                      </div>
                      <div className="pt-2 flex items-center justify-between bg-black/40 border border-zinc-950 p-2.5 rounded-lg text-[9px]">
                        <span className="text-zinc-400 uppercase tracking-tight">Regard as Trusted Client Machine?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTrustedDevice(!isTrustedDevice);
                            showToast(isTrustedDevice ? "Hardware changed to UNRECOGNIZED. High-risk Level 5 triggers." : "Trusted flag updated.");
                          }}
                          className={`px-2 py-0.5 rounded font-black text-[8px] transition-all cursor-pointer ${
                            isTrustedDevice ? "bg-emerald-950 border border-emerald-500/50 text-emerald-400" : "bg-red-950 border border-red-500/50 text-red-400"
                          }`}
                        >
                          {isTrustedDevice ? "YES (TRUSTED)" : "NO (NEW DEVICE)"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 5: Device Handshake Check */}
                  {loginStep === 5 && (
                    <div className="space-y-1 animate-fade-in text-left text-neutral-300">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] text-[#ff001c] font-black uppercase font-mono tracking-widest block">
                          Level 5 Input: Critical Device Verification
                        </label>
                        <span className="text-[8px] text-zinc-400 font-extrabold blink">⚠️ SECURITY LEVEL HIGH</span>
                      </div>
                      <div className="bg-red-950/40 border border-red-900/50 rounded-lg p-3 text-[9px] space-y-1.5 leading-snug">
                        <p className="font-extrabold text-red-400">UNRECOGNIZED USER HARDWARE SIGNATURE DEPLOYED.</p>
                        <p className="text-zinc-400 leading-snug font-mono text-[8.5px]">To approve login from this unauthorized browser endpoint, copy the hardware token security override or type <strong className="text-red-500">SYS_OVERRIDE_00</strong></p>
                        <p className="font-black text-red-400">Secure Node Token: <span className="p-1 px-1.5 rounded bg-black text-white font-mono text-[10px] select-all border border-red-950 font-bold">{generatedDeviceCode}</span></p>
                      </div>
                      <div className="relative">
                        <Fingerprint className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                        <input
                          type="text"
                          value={inputDeviceCode}
                          onChange={(e) => setInputDeviceCode(e.target.value)}
                          placeholder="Enter hardware token or SYS_OVERRIDE_00"
                          className="w-full bg-black/80 border border-zinc-800 rounded-lg px-9 py-2 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-red-600/80 text-center uppercase tracking-widest font-extrabold"
                          onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
                        />
                      </div>
                    </div>
                  )}

                </div>

                <div className="pt-4 flex gap-3">
                  {loginStep > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep(prev => prev - 1);
                        setLoginError("");
                      }}
                      className="px-4 py-2 hover:bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded-lg cursor-pointer transition-all uppercase text-[10px] font-bold"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-red-900 hover:bg-red-600 hover:scale-101 border border-red-700/60 rounded-lg text-white font-mono font-bold tracking-widest text-[10.5px] py-2 uppercase shadow-[0_0_15px_rgba(239,68,68,0.2)] cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>VERIFY & CONTINUE</span>
                    <Unlock size={14} />
                  </button>
                </div>

                {/* System status sidebar panel for branding authenticity */}
                <div className="border-t border-red-950 pt-4 flex flex-col gap-2 font-mono text-[9px] text-zinc-500 select-none">
                  <div className="flex justify-between">
                    <span>SECURITY GRID STATUS:</span>
                    <span className="text-emerald-500 font-extrabold">● STABLE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GRID CLY-NODE IP:</span>
                    <span>127.0.0.1:3000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LAST DETECTED BREACH CODE:</span>
                    <span className="text-red-500 font-extrabold">E_SYNC_FAIL_0x04</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* =========================================================
              STATE B: ACCESS APPROVED - MANAGEMENT DASHBOARD AREA
             ========================================================= */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: NAVIGATION, USER PROFILE, PLATFORM HEALTH */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Profile Card & Log Out */}
              <div className="bg-[#100707] border border-red-950 p-4 rounded-xl relative shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded bg-red-950 border border-red-600/40 flex items-center justify-center text-red-500 shadow-md">
                    <Shield size={22} className="text-red-500" />
                  </div>
                  <div className="text-left font-mono">
                    <h2 className="text-white text-xs font-black uppercase font-orbitron">{currentUser?.name}</h2>
                    <span className="text-[8px] bg-red-900/30 text-red-500 border border-red-900/40 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                      {currentUser?.role}
                    </span>
                    <p className="text-[8.5px] text-zinc-500 mt-1">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="border-t border-red-950/60 mt-4 pt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-zinc-500">SESSION IDENTIFIER:</span>
                    <span className="text-red-400 font-bold font-mono uppercase bg-neutral-950 px-1 rounded border border-neutral-900">
                      SEC_NODE_7B
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full bg-red-950/20 hover:bg-red-950/70 border border-red-900/40 text-red-400 hover:text-white rounded py-1 px-3 text-[10px] cursor-pointer font-bold uppercase transition flex items-center justify-center gap-1.5 mt-1"
                  >
                    <LogOut size={12} />
                    <span>Terminate Auth Connection</span>
                  </button>
                </div>
              </div>

              {/* ROLE IDENTIFIER PANEL CARD */}
              <div className="bg-neutral-950 border border-zinc-900 rounded-xl p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-[10px] text-[#ff001c] font-black uppercase tracking-widest font-orbitron">
                    {getRoleTitle(currentUser?.role || "")}
                  </span>
                </div>
                <p className="text-[9px] text-neutral-400 leading-relaxed font-mono">
                  {currentUser?.role === "Owner" && "Master executive overrides active. Unchecked permission hierarchy permitted across billing, security layers, and staff control vectors."}
                  {currentUser?.role === "Head Admin" && "Command staff authorization. Oversees tournament tools, scrim setups, reports queues, and coordinates active junior admins."}
                  {currentUser?.role === "Admin" && "Sub-level operations module. Interactive capabilities bound securely by Owner permissions config matrix settings."}
                  {currentUser?.role === "Moderator" && "Auditor sector viewport. Watch and restrict toxic player instances across lobbies, triage community abuse reports."}
                </p>
              </div>

              {/* OVERVIEW PANEL HEALTH MONITOR / SYSTEMS STATUS */}
              <div className="bg-[#100707] border border-red-950 rounded-xl p-4 text-left space-y-4 shadow-xl">
                <div className="border-b border-red-950 pb-2 flex justify-between items-center">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                    OPERATIONAL MONITOR
                  </span>
                  <Activity size={12} className="text-red-500 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  
                  <div className="bg-black/40 border border-zinc-950 rounded p-2 text-left font-mono">
                    <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-tight">
                      <HeartPulse size={10} className="text-emerald-500" />
                      <span>Ecosystem Health</span>
                    </div>
                    <p className="text-md font-bold text-white tracking-widest">{platformHealth}%</p>
                  </div>

                  <div className="bg-black/40 border border-zinc-950 rounded p-2 text-left font-mono">
                    <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-tight">
                      <Users size={10} className="text-cyan-500" />
                      <span>Active Users</span>
                    </div>
                    <p className="text-md font-bold text-white tracking-widest">{activeUsers}</p>
                  </div>

                  <div className="bg-black/40 border border-zinc-950 rounded p-2 text-left font-mono">
                    <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-tight">
                      <Tv size={10} className="text-red-500" />
                      <span>Live Tourneys</span>
                    </div>
                    <p className="text-md font-bold text-white tracking-widest">{liveTournaments}</p>
                  </div>

                  <div className="bg-black/40 border border-zinc-950 rounded p-2 text-left font-mono">
                    <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-tight">
                      <Radio size={10} className="text-amber-500" />
                      <span>Active Scrims</span>
                    </div>
                    <p className="text-md font-bold text-white tracking-widest">{activeScrims}</p>
                  </div>

                </div>

                <div className="bg-black border border-red-950/60 rounded p-2.5 space-y-1.5 text-[8.5px] font-mono leading-none">
                  <div className="flex justify-between text-zinc-400">
                    <span>TDM LOBBY POOL:</span>
                    <span className="text-red-500 font-bold">{tdmArenaActivePool} SQUAD INSTANCES</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>DATABASE CLUSTERS:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle size={8} /> SYNCED
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>SECURITY CODELINK:</span>
                    <span className="text-zinc-500">STAFF_BUS_ONLINE</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-950 border border-zinc-900 rounded p-2 text-[9px]">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${systemIntegrityHealthy ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-ping"}`} />
                  <span className={`uppercase text-[8px] font-bold ${systemIntegrityHealthy ? "text-emerald-400" : "text-red-500 animate-pulse"}`}>
                    {systemIntegrityHealthy ? "All systems operational. Sentinel status: NOMINAL." : "CRITICAL WARNING: SENTINEL ALERTS ACTIVE!"}
                  </span>
                </div>

              </div>

              {/* CV HEALTH SENTINEL AUDIT MODULE */}
              <div className="bg-[#0b0c10] border border-zinc-900 rounded-xl p-4 text-left space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                <div className="border-b border-zinc-900 pb-2 flex justify-between items-center bg-zinc-950/20">
                  <div className="flex items-center gap-1.5">
                    <HeartPulse size={12} className={systemIntegrityHealthy ? "text-emerald-400 animate-pulse" : "text-red-500 animate-ping"} />
                    <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-wider font-mono">
                      CV HEALTH SENTINEL
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono ${
                    systemIntegrityHealthy 
                      ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40" 
                      : "bg-red-950/50 text-red-400 border border-red-900/40 animate-pulse"
                  }`}>
                    {systemIntegrityHealthy ? "● NOMINAL" : "● ALARM"}
                  </div>
                </div>

                {/* System Integrity Badge */}
                <div className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                  systemIntegrityHealthy 
                    ? "bg-emerald-950/10 border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]" 
                    : "bg-red-950/20 border-red-500/40 shadow-[inset_0_0_15px_rgba(239,68,68,0.15)] animate-pulse"
                }`}>
                  <span className="text-[8px] text-zinc-400 font-mono block uppercase mb-1">SYSTEM INTEGRITY</span>
                  <strong className={`text-xs font-black font-mono tracking-widest ${
                    systemIntegrityHealthy ? "text-emerald-400" : "text-red-500"
                  }`}>
                    {systemIntegrityHealthy ? "✓ SECURE & OPERATIONAL" : "⚠️ INTEGRITY COMPROMISED"}
                  </strong>
                </div>

                {/* Critical Components Status */}
                <div className="space-y-2">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block tracking-wider">Mount Diagnostics:</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(Object.entries(sentinelComponents) as [string, { mounted: boolean; healthy: boolean }][]).map(([name, stat]) => (
                      <div key={name} className="flex justify-between items-center p-1.5 bg-black/60 rounded border border-zinc-900 text-[8.5px] font-mono">
                        <span className="text-zinc-450">{name}</span>
                        <span className={`px-1 rounded text-[7.5px] font-bold ${
                          stat.mounted 
                            ? "text-emerald-400 bg-emerald-950/20" 
                            : "text-red-500 bg-red-950/20 border border-red-900/30"
                        }`}>
                          {stat.mounted ? "CONNECTED" : "UNMOUNTED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Key Endpoints Ping Status */}
                <div className="space-y-2">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block tracking-wider">API Heartbeats:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.entries(sentinelPings) as [string, { status: string; latency: number; healthy: boolean }][]).map(([endpoint, stat]) => (
                      <div key={endpoint} className="p-1.5 bg-black/60 rounded border border-zinc-900 text-left font-mono">
                        <span className="text-zinc-400 text-[8px] block truncate">{endpoint}</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[7.5px] font-bold ${stat.healthy ? "text-emerald-400" : "text-red-500"}`}>
                            {stat.status}
                          </span>
                          <span className="text-zinc-500 text-[7px]">{stat.latency}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini terminal console */}
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase block tracking-wider">Sentinel Logs:</span>
                  <div className="bg-black/80 border border-zinc-900 rounded p-2 h-20 overflow-y-auto font-mono text-[7px] text-zinc-400 space-y-1 scrollbar-thin">
                    {sentinelLogs.map((log, index) => {
                      let colorClass = "text-zinc-450";
                      if (log.includes("FAILURE") || log.includes("⚠️") || log.includes("🚨")) {
                        colorClass = "text-red-500 font-bold";
                      } else if (log.includes("SUCCESS") || log.includes("🟢") || log.includes("🔧")) {
                        colorClass = "text-emerald-400";
                      }
                      return (
                        <div key={index} className={`leading-tight truncate ${colorClass}`}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action controls */}
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-zinc-900">
                  <button
                    onClick={triggerSelfRepair}
                    className="py-1.5 px-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <RefreshCw size={8} className="animate-spin-slow shrink-0" />
                    SELF-REPAIR ⚡
                  </button>
                  <button
                    onClick={() => {
                      setSentinelChaosActive(prev => !prev);
                      const time = new Date().toLocaleTimeString();
                      if (!sentinelChaosActive) {
                        setSentinelLogs(prev => [
                          `[${time}] ☣️ USER INJECTED SIMULATED CHAOS OVERRIDE.`,
                          `[${time}] ☣️ SIMULATING PACKET CONGESTION AND ENDPOINT TIMEOUTS.`,
                          ...prev
                        ]);
                        showToast("Simulated chaos active. Check Sentinel diagnostics!");
                      } else {
                        setSentinelLogs(prev => [
                          `[${time}] 🟢 Lifted user-injected chaos overrides. System clearing...`,
                          ...prev
                        ]);
                        showToast("Chaos override terminated.");
                      }
                    }}
                    className={`py-1.5 px-1 border text-[8px] font-black uppercase tracking-widest rounded cursor-pointer transition-all ${
                      sentinelChaosActive 
                        ? "bg-red-600 border-red-500 text-white" 
                        : "bg-red-955/20 border-red-950 text-red-500 hover:bg-red-950/40"
                    }`}
                  >
                    {sentinelChaosActive ? "RESTORE GRID" : "INJECT CHAOS ☣️"}
                  </button>
                </div>
              </div>

            </div>

            {/* INTERMEDIATE COLUMN: CORE WORKFLOW MANAGEMENT GRID BOARDS */}
            <div className="lg:col-span-9 flex flex-col gap-6 text-left">
              
              {/* CRITICAL ACTIONS: EXCLUSIVE OWNER EMERGENCY OVERRIDE ROOM (ONLY SHOWN TO OWNER) */}
              {currentUser?.role === "Owner" && (
                <div className="bg-gradient-to-br from-[#120505] via-[#090303] to-[#120505] border-2 border-red-600/40 rounded-2xl p-5 relative shadow-[0_0_30px_rgba(255,0,0,0.15)] text-left">
                  
                  {/* Glowing Warning Icon Indicator */}
                  <div className="absolute top-4 right-4 bg-red-950/30 rounded-full p-1.5 border border-red-500/50 animate-pulse">
                    <AlertTriangle className="text-red-500 font-black animate-bounce" size={18} />
                  </div>

                  <h3 className="text-white text-xs font-black tracking-widest font-orbitron uppercase border-b border-red-950 pb-2 mb-4 flex items-center gap-2">
                    <Sliders size={15} className="text-red-500" />
                    🔒 OWNER CRITICAL OVERRIDES (EXHAUSTIVE PROTOCOLS)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                    
                    {/* Toggle Standard System Layout Shield Lockdown */}
                    <div className="bg-black/90 p-3 rounded-lg border border-red-950 flex flex-col justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] text-white font-extrabold block">LOCK STANDARD PLATFORM</span>
                        <p className="text-[8px] text-zinc-400 leading-normal">
                          Instantly lock standard access, freezing team navigation, match submissions, local stores.
                        </p>
                      </div>
                      <button
                        onClick={toggleEmergencyLockdown}
                        className={`w-full py-1.5 px-2.5 rounded font-black text-[9px] font-orbitron duration-150 uppercase tracking-wider cursor-pointer ${
                          isPlatformLocked 
                            ? "bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-400" 
                            : "bg-red-950 hover:bg-red-800 border border-red-600 text-red-400 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                        }`}
                      >
                        {isPlatformLocked ? "🔓 Disable Lock" : "🔒 ENGAGE LOCK"}
                      </button>
                    </div>

                    {/* Toggle Maintenance Mode */}
                    <div className="bg-black/90 p-3 rounded-lg border border-red-950 flex flex-col justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] text-white font-extrabold block">MAINTENANCE SYSTEM REROUTE</span>
                        <p className="text-[8px] text-zinc-400 leading-normal">
                          Reroute public players to simulated bios splash. Shuts down active match telemetry pipelines.
                        </p>
                      </div>
                      <button
                        onClick={toggleMaintenance}
                        className={`w-full py-1.5 px-2.5 rounded font-black text-[9px] font-orbitron duration-150 uppercase tracking-wider cursor-pointer ${
                          isMaintenanceMode 
                            ? "bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-400" 
                            : "bg-amber-955/60 hover:bg-amber-800 border border-amber-600 text-amber-500"
                        }`}
                      >
                        {isMaintenanceMode ? "🔓 Wake Node" : "⚙️ ENGAGE MAINTENANCE"}
                      </button>
                    </div>

                    {/* Suspend Staff Actions */}
                    <div className="bg-black/90 p-3 rounded-lg border border-red-950 flex flex-col justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] text-white font-extrabold block">SUSPEND ADMINISTRATOR TOOLS</span>
                        <p className="text-[8px] text-zinc-400 leading-normal">
                          Instantly freeze accounts and restrict administrative capabilities of active junior staff nodes.
                        </p>
                      </div>
                      <button
                        onClick={toggleAdminSuspension}
                        className={`w-full py-1.5 px-2.5 rounded font-black text-[9px] font-orbitron duration-150 uppercase tracking-wider cursor-pointer ${
                          adminActionsSuspended
                            ? "bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-400"
                            : "bg-[#250d0d] hover:bg-red-950 border border-red-900 text-red-500"
                        }`}
                      >
                        {adminActionsSuspended ? "🔓 Unfreeze Staff" : "🚫 SUSPEND STAFF"}
                      </button>
                    </div>

                    {/* Restore Database Snapshots */}
                    <div className="bg-black/90 p-3 rounded-lg border border-red-950 flex flex-col justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] text-white font-extrabold block">FLUSH REPLICATOR BACKUP</span>
                        <p className="text-[8px] text-zinc-400 leading-normal">
                          In case of payload sabotage, restore platform data directories to the last synced network backup.
                        </p>
                      </div>
                      <button
                        onClick={restoreSystemBackup}
                        className="w-full py-1.5 px-2.5 bg-neutral-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded font-black text-[9px] font-orbitron duration-150 uppercase tracking-wider cursor-pointer"
                      >
                        ♻️ RESTORE BACKUP
                      </button>
                    </div>

                    {/* System Emergency Alert Simulator */}
                    <div className="bg-black/90 p-3 rounded-lg border border-red-950 flex flex-col justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] text-white font-extrabold block">SIMULATE BREACH THREAT</span>
                        <p className="text-[8px] text-zinc-400 leading-normal">
                          Dispatches automated fake hacker beacon and telemetry fault test protocols into system logs.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          dispatchAlert("BEACON_SABOTAGE", "Simulated packet congestion overload injected into tournament bracket server.", "CRITICAL");
                          showToast("Simulated threat attack vector injected.");
                          awardXp(5);
                        }}
                        className="w-full py-1.5 px-2.5 bg-neutral-900 hover:bg-zinc-800 border border-zinc-700 text-red-400 rounded font-black text-[9px] font-orbitron duration-150 uppercase tracking-wider cursor-pointer"
                      >
                        ⚡ INJECT BEACON
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* WARNING ALERTS: IF JUNIOR STAFF ACCESS AND ACTIONS SUSPENDED BY OWNER */}
              {currentUser?.role !== "Owner" && adminActionsSuspended && (
                <div className="bg-red-950/40 border border-red-800 p-4 rounded-xl text-left font-mono">
                  <div className="flex gap-2.5 items-center text-red-400 text-xs font-black uppercase mb-1">
                    <AlertTriangle size={16} />
                    <span>⚠️ PHYSICAL STAFF RESTRICTIONS IN EFFECT</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 leading-relaxed leading-normal">
                    The Platform Owner has executed an executive Override lock suspending all staff and moderator capabilities. 
                    You may view read-only nodes and telemetry diagnostics, but setting alterations, event modification overrides, and client termination capabilities are disabled.
                  </p>
                </div>
              )}

              {/* ROLE-BASED CONTEXTUAL BOARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* CORE MANAGEMENT INTERFACES (LEFT BOARD SECTOR) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {/* TAB / SECTION MODULE: TOURNAMENTS MANAGEMENT TOOLSET */}
                  {hasPermission("tournament") && (
                    <div id="admin-tournament-list" className="bg-neutral-950 border border-zinc-900 rounded-xl p-5 text-left relative overflow-hidden shadow-xl">
                      <div className="border-b border-zinc-900 pb-2 mb-4 flex justify-between items-center bg-zinc-950/80">
                        <div className="flex items-center gap-2">
                          <Award size={15} className="text-red-500 animate-pulse" />
                          <h4 className="text-white text-xs font-bold font-orbitron uppercase tracking-wider">
                            Tournament Control Desk {currentUser?.role !== "Owner" && "(Permitted Sector)"}
                          </h4>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-[#00ff9d] font-bold font-mono">
                          GRID LOCK: ONLINE
                        </span>
                      </div>
 
                      {/* Brackets simulation & actions */}
                      <div className="space-y-3">
                        {adminTournaments.length === 0 ? (
                          <div className="text-center p-4 border border-dashed border-red-950/40 rounded text-[10px] text-zinc-500 font-mono">
                            ⚠️ NO ACTIVE TOURNAMENTS CONFIGURED IN DB. SENTINEL DETECTS DATA LOSS!
                          </div>
                        ) : (
                          adminTournaments.map((t) => (
                            <div key={t.id} className="flex justify-between items-center bg-black border border-zinc-900 p-3 rounded">
                              <div className="text-left">
                                <span className="text-[9px] text-[#ff001c] font-black uppercase font-mono block">{t.name}</span>
                                <span className="text-[8px] text-zinc-500">Stage: {t.status} | Pool: {t.pool}</span>
                              </div>
                              <button
                                onClick={() => {
                                  if (adminActionsSuspended) {
                                    showToast("Action restricted by Owner.");
                                    return;
                                  }
                                  showToast(`Refreshed bracket for ${t.name}. Scores synchronized.`);
                                }}
                                className="p-1 px-2.5 hover:bg-red-950/40 hover:text-white border border-zinc-900/50 rounded text-[9px] font-mono cursor-pointer uppercase font-extrabold text-zinc-400"
                              >
                                TIEBREAKER_OVERRIDE
                              </button>
                            </div>
                          ))
                        )}

                        {/* Launch Event signal triggers */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (adminActionsSuspended) {
                                showToast("Action restricted by Owner.");
                                return;
                              }
                              playInteractionSound?.("tournamentStart");
                              showToast("🚨 [SENTINEL BEACON] TOURNAMENT broadcast started! Broadcasting live telemetry.");
                              const time = new Date().toLocaleTimeString();
                              setSentinelLogs(prev => [
                                `[${time}] 🚨 BROADCAST BEACON STARTED: Tournament live match stream initialized!`,
                                ...prev
                              ]);
                            }}
                            className="flex-1 py-2 bg-red-955/20 border border-red-900/60 text-red-500 hover:bg-red-950/40 text-[9px] font-mono tracking-widest uppercase font-black rounded cursor-pointer transition flex items-center justify-center gap-1.5"
                          >
                            <Zap size={10} className="text-red-500 animate-pulse shrink-0" />
                            Launch Live Broadcast (Play Cue)
                          </button>
                        </div>
 
                        {/* Direct score updater simulation */}
                        <div className="bg-[#111] p-3 rounded border border-zinc-900 space-y-2 text-left">
                          <span className="text-[10px] font-bold text-white uppercase font-mono">Simulate Match Force-Verdict</span>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-1.5 bg-black rounded text-[9px] text-zinc-400 font-bold border border-zinc-950">
                              Team A: <strong className="text-red-500">CV.PRO (16)</strong>
                            </div>
                            <div className="p-1.5 bg-black rounded text-[9px] text-zinc-400 font-bold border border-zinc-950">
                              Team B: <strong className="text-zinc-650">Apes (14)</strong>
                            </div>
                            <button
                              onClick={() => {
                                if (adminActionsSuspended) {
                                  showToast("Action restricted by Owner.");
                                  return;
                                }
                                showToast("Wired Force Verdict: CV eSports certified winner.");
                                awardXp(10);
                              }}
                              className="bg-red-950 border border-red-500/50 hover:bg-neutral-900 text-red-500 font-black tracking-widest duration-100 text-[8.5px] uppercase cursor-pointer rounded"
                            >
                              SUBMIT_WINNER
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
 
                  {/* TAB / SECTION MODULE: SCRIMS SETUP DECK TOOLSET */}
                  {hasPermission("scrims") && (
                    <div id="admin-scrim-dashboard" className="bg-neutral-950 border border-zinc-900 rounded-xl p-5 text-left relative overflow-hidden shadow-xl">
                      <div className="border-b border-zinc-900 pb-2 mb-4 flex justify-between items-center bg-zinc-950/80">
                        <div className="flex items-center gap-2">
                          <Radio size={15} className="text-red-500 animate-pulse" />
                          <h4 className="text-white text-xs font-bold font-orbitron uppercase tracking-wider">
                            Scrims Coordinator Pipeline {currentUser?.role !== "Owner" && "(Permitted Sector)"}
                          </h4>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-[#00ff9d] font-bold font-mono">
                          TEAMS_SSL: STABLE
                        </span>
                      </div>

                      <div className="space-y-2">
                        {adminScrims.map((scrim) => (
                          <div key={scrim.id} className="bg-black/90 p-2.5 rounded border border-zinc-900/60 flex items-center justify-between text-xs font-mono">
                            <div className="text-left space-y-0.5">
                              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold font-mono block">
                                HOST: {scrim.host}
                              </span>
                              <p className="text-[9.5px] text-white font-extrabold">{scrim.teams}</p>
                              <span className="text-[8px] text-zinc-500">Latency Core: {scrim.ping} | Sync Code: LBY_{scrim.id.toUpperCase()}</span>
                            </div>

                            <button
                              onClick={() => {
                                if (adminActionsSuspended) {
                                  showToast("Action restricted by Owner.");
                                  return;
                                }
                                showToast(`Lobby optimization sequence fired for Scrim ID ${scrim.id}. Ping reduced.`);
                              }}
                              className="p-1 px-2.5 bg-neutral-900 hover:bg-[#ff001f] text-zinc-400 hover:text-white border border-zinc-800 hover:border-red-650 hover:scale-101 text-[8.5px] lowercase font-bold cursor-pointer rounded transition-all"
                            >
                              optimize_ping
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB / SECTION MODULE: COMMUNITY & CHAT MODERATION DECK */}
                  {hasPermission("community") && (
                    <div className="bg-neutral-950 border border-zinc-900 rounded-xl p-5 text-left relative overflow-hidden shadow-xl">
                      <div className="border-b border-zinc-900 pb-2 mb-4 flex justify-between items-center bg-zinc-950/80">
                        <div className="flex items-center gap-2">
                          <Users size={15} className="text-red-500" />
                          <h4 className="text-white text-xs font-bold font-orbitron uppercase tracking-wider">
                            Global Esports Chat Censors & Moderation
                          </h4>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-red-500 font-bold font-mono">
                          FILTERS ACTIVE: {wordFilters.length}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Word filter list */}
                        <div className="bg-black border border-zinc-900/50 p-3 rounded text-left space-y-2">
                          <span className="text-[9px] text-[#ff001c] font-black uppercase font-mono block">
                            Censored Strings Corpus
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {wordFilters.map((word) => (
                              <div key={word} className="bg-neutral-900/90 border border-zinc-850 px-2 py-0.5 rounded text-[8.5px] font-mono text-zinc-300 flex items-center gap-1">
                                <span>{word}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWordFilter(word)}
                                  className="text-red-500 hover:text-white hover:scale-110 cursor-pointer font-bold select-none text-[8.5px]"
                                  title="Un-censor term"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex gap-2">
                            <input
                              type="text"
                              value={newFilter}
                              onChange={(e) => setNewFilter(e.target.value)}
                              placeholder="Insert banned regex/word..."
                              className="flex-grow bg-neutral-950 border border-zinc-800 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-red-600/60 uppercase"
                              onKeyDown={(e) => e.key === "Enter" && handleAddWordFilter()}
                            />
                            <button
                              onClick={handleAddWordFilter}
                              className="bg-red-950 border border-red-900/60 p-1 px-3 rounded text-[9px] font-mono font-black duration-100 hover:bg-neutral-950 text-red-400 uppercase cursor-pointer"
                            >
                              APPEND_TERM
                            </button>
                          </div>
                        </div>

                        {/* Recent Community Reports list */}
                        <div className="space-y-2 text-left">
                          <span className="text-[10px] font-bold text-white uppercase font-orbitron block">
                            Community Abuse Reports Queue ({pendingReports.length})
                          </span>
                          {pendingReports.length === 0 ? (
                            <p className="text-[8.5px] text-zinc-500 italic block font-mono">
                              No outstanding toxic tickets reported to security hub. Global chats certified green.
                            </p>
                          ) : (
                            pendingReports.map((item) => (
                              <div key={item.id} className="bg-neutral-950 p-2.5 rounded border border-zinc-950 flex justify-between items-center text-xs font-mono">
                                <div className="text-left space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9.5px] text-zinc-500 block">Reporter: {item.reporter}</span>
                                    <span className="text-[7.5px] bg-[#220c0c] border border-red-900/30 text-red-500 px-1 rounded">{item.timestamp}</span>
                                  </div>
                                  <p className="text-[10.5px] text-white block">
                                    Offender: <strong className="text-[#00ff9d]">{item.reported}</strong>
                                  </p>
                                  <span className="text-[8.5px] text-amber-500 italic block">Reason: {item.reason}</span>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleResolveReport(item.id, "BANNED")}
                                    className="p-1 px-2.5 bg-red-950/20 hover:bg-red-950 hover:text-white border border-red-900/50 rounded text-[9.5px] font-mono uppercase font-black cursor-pointer transition-colors"
                                  >
                                    BAN
                                  </button>
                                  <button
                                    onClick={() => handleResolveReport(item.id, "DISMISSED")}
                                    className="p-1 px-2 bg-neutral-900 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded text-[9.5px] font-mono uppercase cursor-pointer"
                                  >
                                    DISMISS
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB / SECTION MODULE: BROADCAST CONTENT / MEDIA CONTROLS */}
                  {hasPermission("media") && (
                    <div className="bg-neutral-950 border border-zinc-900 rounded-xl p-5 text-left relative overflow-hidden shadow-xl">
                      <div className="border-b border-zinc-900 pb-2 mb-4 flex justify-between items-center bg-zinc-950/80">
                        <div className="flex items-center gap-2">
                          <Radio size={15} className="text-red-500" />
                          <h4 className="text-white text-xs font-bold font-orbitron uppercase tracking-wider">
                            Highlight Clips Feed & Live Broadcasting Pipeline
                          </h4>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-[#00ff9d] font-bold font-mono">
                          ENCODER_OUT: NOMINAL
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        <div className="bg-black p-3.5 rounded border border-zinc-900 text-left space-y-1">
                          <span className="text-[9px] text-[#ff001c] font-black uppercase font-mono block">Caster Feed Latency Offset</span>
                          <p className="text-[8px] text-zinc-500 leading-normal mb-2">Configure delay metrics in seconds to prevent target stream-sniping exploitation on live casters.</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white font-mono bg-stone-900 border border-zinc-950 px-2 py-1 rounded">30 SECONDS DELAY</span>
                            <button
                              onClick={() => showToast("Broadcasting delay offset synchronized globally to 45 seconds.")}
                              className="p-1 px-2.5 bg-red-950 hover:bg-[#ff001c] hover:text-white border border-red-900 text-red-400 font-black text-[9px] lowercase cursor-pointer rounded"
                            >
                              increase_offset_45s
                            </button>
                          </div>
                        </div>

                        <div className="bg-black p-3.5 rounded border border-zinc-900 text-left space-y-1">
                          <span className="text-[9px] text-zinc-400 font-mono block">Simulate Interactive Highlights Injection</span>
                          <button
                            onClick={() => {
                              showToast("Injected highlight bumper 'CV CRITICAL KILLSHOT OF THE HOUR' globally.");
                              awardXp(5);
                            }}
                            className="w-full text-center py-1.5 border border-zinc-800 bg-[#111] hover:bg-neutral-950 hover:border-[#ff001f] font-mono text-[9.5px] uppercase font-bold cursor-pointer transition-all rounded"
                          >
                            ⚡ INJECT HIGHLIGHT SPOT BUMPER LIVE
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SHARED STAFF ACTIVITY LOG - FOR ALL ROLES */}
                  <div className="bg-[#0b0505] border border-red-990/40 rounded-xl p-5 text-left relative overflow-hidden shadow-xl">
                    <h3 className="text-white text-xs font-black tracking-widest font-orbitron uppercase border-b border-red-950 pb-2 mb-4">
                      📋 OPERATIONS AUDIT TRAIL LOG
                    </h3>

                    <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-1.5 pr-2 font-mono text-[9px] text-zinc-400">
                      <div><p className="text-zinc-[450] text-[#ff001c] font-bold flex items-center gap-1.5"><span className="w-1 h-1 bg-[#ff001c] rounded-full animate-pulse" /> [READY] Staff session established. Initialized security heartbeat at {new Date().toTimeString().split(" ")[0]}.</p></div>
                      {loginHistory.map((item, idx) => (
                        <div key={idx} className="border-b border-zinc-950 pb-1.5 text-[8.5px] last:border-0 last:pb-0">
                          <span className="text-zinc-600">[{item.time}]</span> <span className={`font-black p-0.5 px-1 font-mono rounded text-[7.5px] mr-1.5 ${item.status === "SUCCESS" ? "bg-emerald-950/70 text-emerald-400" : "bg-red-950 text-red-500 animate-pulse"}`}>{item.status}</span>
                          <strong className="text-[#ff001c]">@{item.user}</strong> log intent from host address <span className="text-white font-bold">{item.ip}</span> via client terminal: <span className="italic text-zinc-450">{item.device}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* DEDICATED SECURITY CONTROLS PANEL (RIGHT SECTOR COLUMN) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* TRUSTED DEVICE & TERMINATOR ACTIVITY CENTER */}
                  <div className="bg-neutral-950 border border-zinc-900 rounded-xl p-4 text-left space-y-4 shadow-xl">
                    <div className="border-b border-zinc-900 pb-2 flex justify-between items-center bg-zinc-950/80">
                      <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider font-mono">
                        LOGIN ACTIVITY TERMINAL
                      </span>
                      <History size={11} className="text-zinc-500" />
                    </div>

                    <div className="space-y-3">
                      <div className="text-left">
                        <span className="text-[8.5px] text-zinc-500 uppercase font-mono block">RECENT ENDPOINT ATTEMPTS</span>
                        <div className="space-y-1.5 mt-1.5">
                          {sessions.map((sess) => (
                            <div key={sess.id} className="bg-black/90 p-2 rounded border border-zinc-950 flex flex-col gap-1.5 text-left text-[9px] leading-none">
                              <div className="flex justify-between items-center">
                                <span className="text-white font-black font-mono">{sess.device}</span>
                                {sess.id === "s3a" ? (
                                  <span className="text-emerald-500 text-[8px] font-black uppercase">THIS_DEV</span>
                                ) : (
                                  <button
                                    onClick={() => terminateSession(sess.id, sess.location)}
                                    type="button"
                                    className="text-[7.5px] text-red-500 hover:text-white uppercase font-black cursor-pointer hover:underline"
                                    title="Revoke authorization token"
                                  >
                                    [TERMINATE]
                                  </button>
                                )}
                              </div>
                              <div className="flex justify-between text-zinc-500 text-[8.5px]">
                                <span>{sess.location} | {sess.ip}</span>
                                <span className="text-zinc-600">{sess.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* LOGIN FAILURES TRACKING */}
                      <div className="bg-black border border-red-950/70 p-2.5 rounded text-left">
                        <div className="flex justify-between items-center mb-1 font-mono text-[9px]">
                          <span className="text-zinc-500 uppercase">FAILED ACCESS BLOCKAGE:</span>
                          <span className={`font-bold ${failedAttempts > 0 ? "text-red-500 animate-pulse" : "text-zinc-600"}`}>
                            {failedAttempts} DETECTED
                          </span>
                        </div>
                        {failedAttempts > 0 && (
                          <button
                            onClick={() => {
                              setFailedAttempts(0);
                              showToast("Fault lockout register purged.");
                            }}
                            className="w-full text-center py-1 mt-1 bg-[#1a0707] hover:bg-red-950 border border-red-950 hover:border-red-650 hover:scale-101 text-red-500 font-mono text-[8px] uppercase font-bold cursor-pointer rounded transition-all"
                          >
                            ⚠️ FLUSH_LOCKOUT_AT_FIREWALL
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE CONFIGURATION: OWNER STAFF PERMISSIONS OVERRIDE (ONLY SHOWN TO OWNER) */}
                  {currentUser?.role === "Owner" && (
                    <div className="bg-neutral-950 border border-zinc-900 rounded-xl p-4 text-left space-y-4 shadow-xl">
                      <div className="border-b border-zinc-900 pb-2 flex justify-between items-center bg-zinc-950/80">
                        <span className="text-[9px] text-white font-black uppercase tracking-widest font-orbitron">
                          ⚙️ STAFF ARCHITECTURE MODS
                        </span>
                        <Settings size={12} className="text-red-500" />
                      </div>

                      <div className="space-y-3.5">
                        
                        {/* Admin: Blitz Permissions toggle */}
                        <div className="space-y-1 text-left border-b border-zinc-950 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[9.5px] text-white font-extrabold uppercase">
                              tourney_admin_blitz
                            </span>
                            <span className="text-[7.5px] text-zinc-500 font-mono">ROLE: ADMIN</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[8px] font-mono font-bold leading-none">
                            <button
                              onClick={() => handleToggleAdminPermission("blitz", "tournament")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.blitz.tournament 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black shadow-sm" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.blitz.tournament ? "✔ TOURNEYS" : "❌ TOURNEYS"}
                            </button>
                            <button
                              onClick={() => handleToggleAdminPermission("blitz", "scrims")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.blitz.scrims 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.blitz.scrims ? "✔ SCRIMS" : "❌ SCRIMS"}
                            </button>
                            <button
                              onClick={() => handleToggleAdminPermission("blitz", "community")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.blitz.community 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.blitz.community ? "✔ COMM MOD" : "❌ COMM MOD"}
                            </button>
                            <button
                              onClick={() => handleToggleAdminPermission("blitz", "media")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.blitz.media 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black shadow-sm" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.blitz.media ? "✔ CAST MEDIA" : "❌ CAST MEDIA"}
                            </button>
                          </div>
                        </div>

                        {/* Admin: Spectre Permissions toggle */}
                        <div className="space-y-1 text-left border-b border-zinc-950 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[9.5px] text-white font-extrabold uppercase">
                              scrim_admin_spectre
                            </span>
                            <span className="text-[7.5px] text-zinc-500 font-mono">ROLE: ADMIN</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[8px] font-mono font-bold leading-none">
                            <button
                              onClick={() => handleToggleAdminPermission("spectre", "tournament")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.spectre.tournament 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black shadow-sm" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.spectre.tournament ? "✔ TOURNEYS" : "❌ TOURNEYS"}
                            </button>
                            <button
                              onClick={() => handleToggleAdminPermission("spectre", "scrims")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.spectre.scrims 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.spectre.scrims ? "✔ SCRIMS" : "❌ SCRIMS"}
                            </button>
                            <button
                              onClick={() => handleToggleAdminPermission("spectre", "community")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.spectre.community 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black shadow-sm" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.spectre.community ? "✔ COMM MOD" : "❌ COMM MOD"}
                            </button>
                            <button
                              onClick={() => handleToggleAdminPermission("spectre", "media")}
                              className={`p-1 border rounded text-[7.5px] cursor-pointer ${
                                adminPermissions.spectre.media 
                                  ? "bg-red-950/40 border-red-500 text-red-400 font-black" 
                                  : "bg-black border-zinc-900 text-zinc-600"
                              }`}
                            >
                              {adminPermissions.spectre.media ? "✔ CAST MEDIA" : "❌ CAST MEDIA"}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ACTIVE NOTIFICATION: SECURITY ALERTS GRID (LIVE THREAD) */}
                  <div className="bg-[#120505] border border-red-950 rounded-xl p-4 text-left space-y-4 shadow-xl">
                    <div className="border-b border-red-950 pb-2 flex justify-between items-center">
                      <span className="text-[10px] text-[#ff001c] font-black uppercase tracking-wider font-orbitron">
                        🚨 THREAT DETECT BANNER INTEL
                      </span>
                      <Bell size={12} className="text-red-500 animate-bounce" />
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      {securityAlerts.map((alert) => (
                        <div key={alert.id} className="bg-black/85 p-2 rounded border border-zinc-950 text-left font-mono text-[8.5px] leading-normal space-y-1">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-1">
                            <span className="text-zinc-600 font-bold">Time: {alert.time}</span>
                            <span className={`p-0.5 px-1 font-mono rounded text-[7.5px] font-extrabold ${alert.level === "CRITICAL" ? "bg-red-950 text-red-500 animate-pulse" : "bg-amber-955/20 text-amber-500"}`}>
                              {alert.level}
                            </span>
                          </div>
                          <p className="text-white font-extrabold text-[9px] font-mono leading-snug">[{alert.type}] {alert.msg}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1.5 text-center">
                      <button
                        onClick={() => {
                          setSecurityAlerts([]);
                          showToast("Diagnostic notifications cleared.");
                        }}
                        className="text-[8.5px] text-zinc-500 hover:text-red-500 hover:underline uppercase tracking-wide font-black"
                      >
                        FLUSH_THREAT_NOTIFICATION_LOGS
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
      
    </div>
  );
}
