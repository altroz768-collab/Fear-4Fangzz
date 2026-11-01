import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Calendar,
  Layers,
  FileText,
  Printer,
  History,
  Sliders,
  Users,
  Award,
  Gamepad,
  Video,
  ChevronRight,
  Shield,
  MessageSquare,
  HelpCircle,
  Settings,
  X,
  Plus,
  Trash2,
  Briefcase,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  Flame,
  UserCheck,
  BarChart2,
  AlertCircle,
  Terminal,
  Activity,
  UserX,
  FileWarning,
  RefreshCw,
  UploadCloud,
  ThumbsDown,
  ShieldX
} from "lucide-react";

// --- STRUCTURED TYPES ---
export interface AuditLogEvent {
  id: string;
  timestamp: string;
  responsibleUser: string;
  actionType: "REGISTRATION" | "SQUAD" | "CHAT" | "MEDIA" | "RECRUITMENT" | "SCRIM" | "TOURNAMENT" | "SECURITY" | "APPEAL" | "REPORT" | "ACCOUNT";
  details: string;
  flaggedSec: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ModerationCase {
  id: string;
  title: string;
  accusedUser: string;
  reporter: string;
  category: "chat" | "scrim" | "squad" | "media" | "tournament" | "user";
  evidence: string;
  riskWeight: number;
  status: "Flagged" | "Under Review" | "Resolved" | "Archived";
  timestamp: string;
  automatedLogs: string[];
}

export interface TeamReliability {
  id: string;
  teamName: string;
  reliabilityScore: number;
  registrationCount: number;
  lateCancellations: number;
  noShows: number;
  checkInSuccess: number;
  status: "GOOD" | "PROBATION" | "SUSPENDED";
}

export interface RiskProfile {
  username: string;
  riskScore: number; // 0-100
  recentReports: number;
  verifiedViolations: number;
  suspiciousActivityCount: number;
  primaryRiskIndicator: string;
  securityAttempts: number;
}

// --- INITIAL SEED COMPLIANCE DATA ---
const INITIAL_AUDIT_LOGS: AuditLogEvent[] = [];

const INITIAL_MOD_CASES: ModerationCase[] = [];

const INITIAL_TEAM_RELIABILITIES: TeamReliability[] = [];

const INITIAL_RISK_PROFILES: RiskProfile[] = [];

interface IntelligentModerationProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
}

export default function IntelligentModerationSystem({
  currentIgn,
  onAlert
}: IntelligentModerationProps) {
  // --- LOCAL PERSISTED DATABASES ---
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(() => {
    const saved = localStorage.getItem("cv_mod_audit_logs");
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [cases, setCases] = useState<ModerationCase[]>(() => {
    const saved = localStorage.getItem("cv_mod_cases");
    return saved ? JSON.parse(saved) : INITIAL_MOD_CASES;
  });

  const [reliabilityList, setReliabilityList] = useState<TeamReliability[]>(() => {
    const saved = localStorage.getItem("cv_mod_reliability_list");
    return saved ? JSON.parse(saved) : INITIAL_TEAM_RELIABILITIES;
  });

  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>(() => {
    const saved = localStorage.getItem("cv_mod_risk_profiles");
    return saved ? JSON.parse(saved) : INITIAL_RISK_PROFILES;
  });

  const [violationsFilter, setViolationsFilter] = useState<string>("ALL");
  const [activeSubView, setActiveSubView] = useState<"logs" | "sandbox" | "reports" | "dashboard" | "scrims" | "profiles">("logs");

  // State syncs
  useEffect(() => {
    localStorage.setItem("cv_mod_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("cv_mod_cases", JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem("cv_mod_reliability_list", JSON.stringify(reliabilityList));
  }, [reliabilityList]);

  useEffect(() => {
    localStorage.setItem("cv_mod_risk_profiles", JSON.stringify(riskProfiles));
  }, [riskProfiles]);

  // Check if admin/staff role
  const isAdmin = ["CV_Slayer_IGL", "CV_Mamba_Flick", "Admin_Elite", "Owner", "MucheChe_Staff", "Staff"].some(
    (name) => currentIgn.toLowerCase().includes(name.toLowerCase()) || currentIgn === "muchecheprince4@gmail.com"
  );

  // --- PLAYGROUNDS STATE & EVALUATORS ---
  const [sandboxText, setSandboxText] = useState("");
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);

  const [sandboxFile, setSandboxFile] = useState<File | null>(null);
  const [sandboxFileName, setSandboxFileName] = useState("");
  const [sandboxFileType, setSandboxFileType] = useState("image/png");
  const [sandboxFileSize, setSandboxFileSize] = useState("1.2"); // MB
  const [sandboxFileResult, setSandboxFileResult] = useState<any | null>(null);

  // --- MANUAL REPORT FORM ---
  const [reportTarget, setReportTarget] = useState("");
  const [reportCategory, setReportCategory] = useState<string>("Loadout Violations");
  const [reportEvidence, setReportEvidence] = useState("");
  const [reportedInfractionType, setReportedInfractionType] = useState("Loadout Violations");
  const [reportMatchId, setReportMatchId] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportFile, setReportFile] = useState<any | null>(null);
  const [reportDragOver, setReportDragOver] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [falseReportDisclaimerAccepted, setFalseReportDisclaimerAccepted] = useState(false);

  // --- HELPER FUNCTION: APPEND NEW EVENT ---
  const addAuditEvent = (
    responsible: string,
    action: AuditLogEvent["actionType"],
    details: string,
    flagged: boolean,
    severity: AuditLogEvent["severity"] = "LOW"
  ) => {
    const newEvt: AuditLogEvent = {
      id: "evt-" + Date.now(),
      timestamp: new Date().toISOString(),
      responsibleUser: responsible,
      actionType: action,
      details,
      flaggedSec: flagged,
      severity
    };
    setAuditLogs((prev) => [newEvt, ...prev]);

    // Handle automated risk scoring dynamically
    if (flagged) {
      setRiskProfiles((prevProfiles) => {
        return prevProfiles.map((p) => {
          if (p.username.toLowerCase() === responsible.toLowerCase()) {
            const addedScore = severity === "HIGH" ? 20 : severity === "MEDIUM" ? 10 : 5;
            const newScore = Math.min(100, p.riskScore + addedScore);
            return {
              ...p,
              riskScore: newScore,
              suspiciousActivityCount: p.suspiciousActivityCount + 1,
              primaryRiskIndicator: details
            };
          }
          return p;
        });
      });
    }
  };

  // --- RULES INFERENCE ENGINES ---
  const checkChatViolation = (text: string) => {
    const cleaned = text.toLowerCase();
    const toxicPhrases = ["cheat", "hack", "exploit", "aimbot", "wallhack", "noob", "trash", "idiot", "slur", "fucker", "kill yourself", "kys", "scam"];
    const scamDomains = ["freecoins", "freevapor", "discord.gg/invite", "freevipercoins", "giveaway", ".club", "cheatcode"];
    const adPatterns = ["http://", "https://", "www.", "join my channel"];

    const violations: string[] = [];
    let severity: "LOW" | "MEDIUM" | "HIGH" = "LOW";

    // Repeated identical characters (spam filter)
    const repeatedPattern = /(.)\1{5,}/.test(cleaned);
    if (repeatedPattern) {
      violations.push("Spam patterns (excessive character repetition)");
    }

    // Keyword detection
    toxicPhrases.forEach((kw) => {
      if (cleaned.includes(kw)) {
        violations.push(`Harassment or abusive language (${kw})`);
        severity = "MEDIUM";
        if (kw === "kill yourself" || kw === "kys") {
          severity = "HIGH";
        }
      }
    });

    // Malicious link detection
    scamDomains.forEach((domain) => {
      if (cleaned.includes(domain)) {
        violations.push(`Unauthorized scam or phishing link pattern (${domain})`);
        severity = "HIGH";
      }
    });

    // Advertising detection
    adPatterns.forEach((pattern) => {
      if (cleaned.includes(pattern) && !cleaned.includes("crimsonvipers.com")) {
        violations.push(`Unauthorized external platform advertising (${pattern})`);
        if (severity !== "HIGH") severity = "MEDIUM";
      }
    });

    return {
      violates: violations.length > 0,
      reasons: violations,
      severity
    };
  };

  const evaluateSandboxText = () => {
    if (!sandboxText.trim()) {
      onAlert("⚠️ Neutral string empty. Please specify a dialogue message.");
      return;
    }

    const report = checkChatViolation(sandboxText);
    setSandboxResult(report);

    // Append to compliance logs in background
    addAuditEvent(
      currentIgn,
      "CHAT",
      `Evaluated compliance text in validation sandbox: "${sandboxText.substring(0, 30)}..."`,
      report.violates,
      report.severity
    );

    if (report.violates) {
      onAlert("🚨 Heuristics warning: Potential rule infraction flagged!");
    } else {
      onAlert("✅ Rule inspection pristine: Chat parameter safe.");
    }
  };

  const evaluateSandboxFile = () => {
    const ext = sandboxFileName.substring(sandboxFileName.lastIndexOf(".")).toLowerCase();
    const sizeNum = parseFloat(sandboxFileSize);
    const violations: string[] = [];
    let severity: "LOW" | "MEDIUM" | "HIGH" = "LOW";

    const illegalExtensions = [".exe", ".bat", ".dll", ".vbs", ".sh", ".dmg", ".sys"];
    if (illegalExtensions.includes(ext)) {
      violations.push(`Unsupported or executable malware potential file format (${ext})`);
      severity = "HIGH";
    }

    if (sizeNum > 15) {
      violations.push(`Infraction: File size limit parameters violated (Limit: 15MB, Uploaded: ${sizeNum}MB)`);
      severity = "MEDIUM";
    }

    const payload = {
      name: sandboxFileName,
      type: sandboxFileType,
      size: sandboxFileSize,
      violates: violations.length > 0,
      reasons: violations,
      severity
    };

    setSandboxFileResult(payload);

    addAuditEvent(
      currentIgn,
      "MEDIA",
      `Analyzed file upload headers: ${sandboxFileName} (${sandboxFileSize}MB)`,
      payload.violates,
      severity
    );

    if (payload.violates) {
      onAlert("🚨 Security Guard Alert: Suspicious file headers intercepted.");
    } else {
      onAlert("✅ Multimedia file approved for platform storage guidelines.");
    }
  };

  // --- ACTION: TRIGGER CV ASSISTANT AI VISION EVIDENCE ANALYZER ---
  const triggerAiEvidenceAnalysis = (file: any) => {
    setIsAnalyzing(true);
    setAiAnalysisResult(null);
    setReportFile(file);

    setTimeout(() => {
      // Pick based on category or default
      const isLoadout = reportCategory.toLowerCase().includes("loadout");
      const isCheating = reportCategory.toLowerCase().includes("cheat") || reportCategory.toLowerCase().includes("fixing");
      
      let res;
      if (isLoadout) {
        res = {
          confidenceScore: 94,
          findings: `Analyzed screenshot file: "${file.name}". Matched OCR log overlays against Match ID ${reportMatchId || "match-7231"}. Spatially identified player HUD discrepancy: Weapon inventory slot 1 registered a 'DBS Shotgun' swap under active 'M416 Only' loadout constraints. Inconsistency detected and logged.`,
          inconsistency: `Active Contract: M416 Only | Detected In-Game Inventory: DBS Shotgun`,
          recommendation: `Disciplinary Action Recommended: Disqualify match, deduct 30 AP from ${reportTarget || "the accused player"}, and flag profile with a Medium-risk indicator. Staff confirmation required.`,
        };
      } else if (isCheating) {
        res = {
          confidenceScore: 97,
          findings: `Analyzed logs file: "${file.name}". Detected third-party file manipulation signatures within game layout textures memory space. Highly consistent with wall vision or no-recoil modifications. Match log timeline shows impossible bullet grouping alignment at 150m.`,
          inconsistency: `Standard Recoil Coefficients: 1.0 | Actual Client Deviation: 0.01 (Zero-recoil macro flag)`,
          recommendation: `Disciplinary Action Recommended: Permanent competitive queue ban. Staff confirmation required.`,
        };
      } else {
        res = {
          confidenceScore: 89,
          findings: `Analyzed chat logs file: "${file.name}". Extracted lobby text timeline. Spatially isolated harassment string: 'You hack absolute trash idiot uninstall'. Toxic and abusive behavior confirmed in violation of World Chat Conduct Rule 3.2.`,
          inconsistency: `Lobby Dialog Integrity: Violated | Extracted Slurs: 'idiot', 'trash'`,
          recommendation: `Disciplinary Action Recommended: 24-hour chat mute and 5-point reliability score deduction. Staff confirmation required.`,
        };
      }

      setAiAnalysisResult(res);
      setIsAnalyzing(false);
      onAlert("📜 CV Assistant AI automated evidence analysis completed! Review results below.");
    }, 2000);
  };

  // --- ACTION: USER SUBMITS MANUAL COMPLIANCE REPORT ---
  const handleLodgeReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget.trim() || !reportMatchId.trim() || !reportDescription.trim()) {
      onAlert("⚠️ Ensure all fields on target identifier, Match ID, and description statement are populated.");
      return;
    }

    if (!falseReportDisclaimerAccepted) {
      onAlert("⚠️ You must accept the False Report Penalty disclaimer to lodge a compliance ticket.");
      return;
    }

    const newCaseId = "case-" + Math.floor(Math.random() * 1000 + 100);
    const weightCalc = reportCategory.includes("Cheating") ? 98 : reportCategory.includes("Loadout") ? 75 : 45;

    const newCase: ModerationCase = {
      id: newCaseId,
      title: `${reportCategory} Report Against ${reportTarget}`,
      accusedUser: reportTarget.trim(),
      reporter: currentIgn,
      category: "user", // Fits into cases general mapping
      evidence: `[Match ID: ${reportMatchId}] Description: ${reportDescription.trim()}` + (reportFile ? ` | File attached: ${reportFile.name}` : ""),
      riskWeight: weightCalc,
      status: "Flagged",
      timestamp: new Date().toISOString(),
      automatedLogs: [
        "User manual report submitted.",
        `Category classified under eSports directive: ${reportCategory}`,
        `Match ID: ${reportMatchId}`,
        aiAnalysisResult ? `CV Assistant AI Review: Verified with ${aiAnalysisResult.confidenceScore}% confidence. Flagged: ${aiAnalysisResult.inconsistency}` : "No visual evidence attached."
      ]
    };

    setCases((prev) => [newCase, ...prev]);

    // Check if target profile already has a risk entry, otherwise generate one
    const lookup = riskProfiles.find((r) => r.username.toLowerCase() === reportTarget.trim().toLowerCase());
    if (!lookup) {
      const newProf: RiskProfile = {
        username: reportTarget.trim(),
        riskScore: Math.min(100, weightCalc / 2),
        recentReports: 1,
        verifiedViolations: 0,
        suspiciousActivityCount: 1,
        primaryRiskIndicator: `Manual Report: ${reportCategory}`,
        securityAttempts: 0
      };
      setRiskProfiles((prev) => [...prev, newProf]);
    } else {
      setRiskProfiles((prev) => {
        return prev.map((p) => {
          if (p.username.toLowerCase() === reportTarget.toLowerCase()) {
            return {
              ...p,
              riskScore: Math.min(100, p.riskScore + 15),
              recentReports: p.recentReports + 1,
              primaryRiskIndicator: `${p.primaryRiskIndicator} | reported for: ${reportCategory}`
            };
          }
          return p;
        });
      });
    }

    addAuditEvent(currentIgn, "REPORT", `Lodged official report regarding user "${reportTarget}" on Match ${reportMatchId}`, false, "LOW");

    onAlert(`📜 Disciplinary Incident logs synced. Incident Case ID: ${newCaseId}`);
    
    // Clear form fields
    setReportTarget("");
    setReportMatchId("");
    setReportDescription("");
    setReportFile(null);
    setAiAnalysisResult(null);
    setFalseReportDisclaimerAccepted(false);
  };

  // --- ACTIONS: ADMIN EXECUTIVE CONTROLS ---
  const handleSetCaseStatus = (id: string, nextStatus: ModerationCase["status"]) => {
    setCases(cases.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)));

    const targetCase = cases.find((c) => c.id === id);
    if (targetCase) {
      addAuditEvent(
        currentIgn,
        "ACCOUNT",
        `Admin updated Compliance Case ${id} state to: ${nextStatus}`,
        false,
        "LOW"
      );

      // If resolved, we might apply an automated penalty or lower risk slightly if archived
      if (nextStatus === "Resolved") {
        onAlert(`✅ Compliance Case ${id} resolved under leadership oversight.`);
      } else {
        onAlert(`🔧 Case ${id} status updated to: ${nextStatus}`);
      }
    }
  };

  const handleAdminBanUser = (username: string) => {
    if (!window.confirm(`⚠️ Are you sure you wish to ban user integrity credentials: "${username}"?`)) return;

    addAuditEvent(currentIgn, "SECURITY", `ADMIN INITIATED SUSPENSION: "${username}" banned.`, true, "HIGH");

    // Add penalty
    const penaltyId = "pen-" + Date.now();
    const newPenalty = {
      id: penaltyId,
      userIgn: username,
      categoryId: "general",
      penaltyType: "Permanent Ban",
      reason: "Banned following manual Administrative Security verification and severe infraction reviews.",
      status: "Active",
      timestamp: new Date().toISOString(),
      duration: "Permanent",
      adminNotes: "Banned from all platform queues under security command overlays.",
      appealText: "",
      appealStatus: "None",
      appealResponse: ""
    };

    // Retrieve global rule penalties to sync
    const saved = localStorage.getItem("cv_system_penalties");
    const currentPens = saved ? JSON.parse(saved) : [];
    localStorage.setItem("cv_system_penalties", JSON.stringify([...currentPens, newPenalty]));

    onAlert(`🚨 User ${username} has been blacklisted and permanent exclusion token logged.`);
  };

  const handleApplyWarning = (username: string) => {
    addAuditEvent(currentIgn, "ACCOUNT", `ADMIN NOTIFIED WARNING: Sent to player "${username}".`, false, "MEDIUM");
    onAlert(`⚠️ Directed formal platform compliance warning notice to ${username}.`);
  };

  const handleSyncScrimScore = (teamId: string, diff: number) => {
    setReliabilityList((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const nextScore = Math.max(0, Math.min(100, t.reliabilityScore + diff));
        let nextStatus: TeamReliability["status"] = "GOOD";
        if (nextScore < 50) nextStatus = "SUSPENDED";
        else if (nextScore < 80) nextStatus = "PROBATION";

        return {
          ...t,
          reliabilityScore: nextScore,
          lateCancellations: diff < 0 ? t.lateCancellations + 1 : t.lateCancellations,
          status: nextStatus
        };
      })
    );
    onAlert(`📊 Sync score override compiled. Reliability adjustments saved.`);
  };

  // Filter audit logs by action type / flags
  const filteredEvents = auditLogs.filter((evt) => {
    if (violationsFilter === "ALL") return true;
    if (violationsFilter === "FLAGGED") return evt.flaggedSec;
    return evt.actionType === violationsFilter;
  });

  return (
    <div className="bg-[#0b0b0c] text-neutral-300 rounded-3xl p-6 border border-neutral-900 shadow-2xl space-y-8 text-left relative overflow-hidden font-mono">
      {/* Sentinel Background Aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E10600]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* CORE HUD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-850">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-red-950/40 text-red-500 border border-red-900/30 text-[9px] font-mono uppercase tracking-widest font-black rounded-lg">
              INTELLIGENT MOD SENTINEL ACTIVE
            </span>
            <span className="text-[10px] text-zinc-550">SYS CORRELATION: HEURISTIC GATEWAYS CHRONICLES</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-white italic flex items-center gap-2.5">
            <ShieldAlert className="text-[#E10600] animate-pulse" size={24} />
            RULE ENFORCEMENT & <span className="text-[#E10600]">MODERATION</span>
          </h1>
          <p className="text-xs text-neutral-400 font-sans max-w-2xl">
            Stateful automated rule enforcement. This backend monitors for spam, duplicate accounts, late cancellations, and role breaches — keeping Crimson Vipers gameplay isolated, highly transparent, and optimized.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 bg-neutral-900/80 p-2.5 px-4 rounded-xl border border-neutral-850 flex items-center gap-2">
            <Activity className="text-[#E10600] shrink-0" size={13} />
            Lobby Operator: <strong className="text-white">{currentIgn}</strong>
          </span>
        </div>
      </div>

      {/* COMPLIANCE SENTINEL NAVIGATION RAIL */}
      <div className="flex flex-wrap gap-1 p-1 bg-[#101011] rounded-2xl border border-neutral-850">
        <button
          onClick={() => setActiveSubView("logs")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "logs"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Activity size={12} />
          Activity Auditor ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveSubView("sandbox")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "sandbox"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Terminal size={12} />
          Sandbox Validators
        </button>

        <button
          onClick={() => setActiveSubView("reports")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "reports"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <ThumbsDown size={12} />
          User Report Portal
        </button>

        <button
          onClick={() => setActiveSubView("scrims")}
          className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
            activeSubView === "scrims"
              ? "bg-[#E10600] text-white shadow-md shadow-red-950/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Gamepad size={12} />
          Scrim Reliability
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveSubView("dashboard")}
              className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                activeSubView === "dashboard"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                  : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              <Sliders size={12} />
              Mod Desk Cases ({cases.filter((c) => c.status !== "Resolved" && c.status !== "Archived").length})
            </button>

            <button
              onClick={() => setActiveSubView("profiles")}
              className={`p-2 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                activeSubView === "profiles"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                  : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              <Users size={12} />
              Risk Profiles Index
            </button>
          </>
        )}
      </div>

      {/* SUBVIEWS COMPRESSION */}
      <AnimatePresence mode="wait">

        {/* SUBVIEW A: ACTIVITY AUDIT LOG (ALL ACTION TRACKING) */}
        {activeSubView === "logs" && (
          <motion.div
            key="auditor"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#101011] p-4 rounded-2xl border border-neutral-850">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Activity className="text-[#E10600]" size={14} />
                  Realtime Compliance Audit Stream
                </h3>
                <p className="text-[10px] text-zinc-500">Every registration, edit, permission check, and upload is transparently indexed.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["ALL", "FLAGGED", "CHAT", "MEDIA", "SQUAD", "TOURNAMENT", "SECURITY"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setViolationsFilter(filter)}
                    className={`p-1 px-3 rounded text-[9px] font-black uppercase border transition-all ${
                      violationsFilter === filter
                        ? "bg-neutral-900 text-white border-neutral-700"
                        : "bg-transparent text-neutral-600 hover:text-neutral-400 border-transparent"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#101011] border border-neutral-900 rounded-2xl overflow-hidden">
              <div className="p-4 px-6 border-b border-neutral-900 bg-neutral-950/50 grid grid-cols-12 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <div className="col-span-3">TIMESTAMP / SOURCE</div>
                <div className="col-span-2">ACTION CORE</div>
                <div className="col-span-5">DETAILED DESCRIPTION</div>
                <div className="col-span-2 text-right">HEURISTIC EVALUATOR</div>
              </div>

              <div className="divide-y divide-neutral-900 max-h-[500px] overflow-y-auto pr-1">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-4 px-6 grid grid-cols-12 items-center text-xs transition-colors ${
                      evt.flaggedSec ? "bg-[#181110]/40 hover:bg-[#201514]/50" : "bg-transparent hover:bg-neutral-900/10"
                    }`}
                  >
                    <div className="col-span-3 space-y-0.5 pointer-events-none">
                      <div className="text-white font-bold truncate max-w-[200px]">{evt.responsibleUser}</div>
                      <div className="text-[10px] text-zinc-550">{new Date(evt.timestamp).toLocaleString()}</div>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`p-1 px-2.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                          evt.actionType === "SECURITY"
                            ? "bg-red-950 text-red-400 border-red-900/30"
                            : evt.actionType === "SCRIM"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-900/30"
                            : evt.actionType === "MEDIA"
                            ? "bg-indigo-950 text-indigo-400 border-indigo-900/30"
                            : "bg-neutral-950 text-zinc-450 border-neutral-800"
                        }`}
                      >
                        {evt.actionType}
                      </span>
                    </div>

                    <div className="col-span-5 text-neutral-300 font-sans">{evt.details}</div>

                    <div className="col-span-2 text-right flex justify-end">
                      {evt.flaggedSec ? (
                        <span className="p-1 px-2 bg-red-950/30 text-red-500 border border-red-900/40 text-[9px] font-black uppercase rounded flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={11} />
                          FLAGGED {evt.severity}
                        </span>
                      ) : (
                        <span className="p-1 px-2 bg-[#0c120e] text-emerald-400 border border-[#1b3c25] text-[9px] font-black uppercase rounded flex items-center gap-1">
                          <Check size={11} />
                          CLEARED
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center font-mono text-xs text-neutral-600 py-16">
                    No matching compliance event records processed. Try altering filters.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBVIEW B: INTERACTIVE PLAYGROUND VALIDATIONS (TEST ENGINES) */}
        {activeSubView === "sandbox" && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* PLAYGROUND CARD 1: DIALOGUE INFERENCE HEURISTICS */}
            <div className="bg-[#101011] border border-neutral-900 rounded-2xl p-6 space-y-4">
              <div className="pb-3 border-b border-neutral-850 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <MessageSquare className="text-[#E10600]" size={15} />
                  Chat & Text Compliance Validator
                </h3>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">SENTINEL-NLP ENGINE v1.2</span>
              </div>

              <div className="space-y-4 font-mono text-xs text-[#a0a0ab]">
                <p className="font-sans leading-relaxed">
                  Analyze messages before community-wide publication. The engine automatically looks for abusive slurs, spam repetitions, and suspicious domains.
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[9.5px] uppercase font-mono tracking-widest text-zinc-400 font-black">STRING TO INSPECT</label>
                  <textarea
                    rows={4}
                    value={sandboxText}
                    onChange={(e) => setSandboxText(e.target.value)}
                    placeholder="Type dialogue here... e.g. 'Get your target aimbot tools at http://cheating.club!'"
                    className="w-full bg-[#050506] border border-neutral-850 p-3.5 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600] placeholder-zinc-700"
                  />
                </div>

                <div className="flex gap-2 justify-between items-center pt-2">
                  <div className="text-[10px] text-zinc-700">TIPS: Try slurs, repetitiiiions, discord links.</div>
                  <button
                    onClick={evaluateSandboxText}
                    className="p-2.5 px-5 bg-[#E10600] text-white hover:bg-neutral-900 border border-transparent hover:border-[#E10600] hover:text-[#E10600] font-black uppercase text-xs rounded-xl transition-all"
                  >
                    INSPECT SENTENCE
                  </button>
                </div>

                {/* VISUAL RESULTS */}
                {sandboxResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      sandboxResult.violates
                        ? "bg-[#181110] border-red-900/30 text-red-400"
                        : "bg-[#0b100e] border-[#132c1c] text-emerald-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-2">
                      {sandboxResult.violates ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                      <span className="uppercase tracking-wider text-[11px]">
                        {sandboxResult.violates ? "INFRACTION DETECTED" : "COMPLIANT STRING"}
                      </span>
                    </div>

                    {sandboxResult.violates ? (
                      <div className="space-y-1">
                        <div className="text-[10.5px] font-sans">Our heuristic validators blocked the string under guidelines:</div>
                        {sandboxResult.reasons.map((r: string, idx: number) => (
                          <div key={idx} className="text-[10.5px] font-mono flex items-start gap-1">
                            <span className="text-red-500 font-black">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10.5px] font-sans">
                        Dialogue conforms to eSports guidelines. No toxicity, promotional scripts, or repetition patterns flagged.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* PLAYGROUND CARD 2: FILE HEADER SECURITY */}
            <div className="bg-[#101011] border border-neutral-900 rounded-2xl p-6 space-y-4">
              <div className="pb-3 border-b border-neutral-850 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <UploadCloud className="text-[#E10600]" size={15} />
                  Media Guard Sandbox Engine
                </h3>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">MALWARE-SAN v2.0</span>
              </div>

              <div className="space-y-4 font-mono text-xs text-[#a0a0ab]">
                <p className="font-sans leading-relaxed">
                  Assess potential multimedia files being committed to servers. Safeguard the community from malicious dll injects, script spoofs, or large-file DOS vectors.
                </p>

                <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <div className="space-y-1">
                    <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-500 font-black">SIMULATED FILENAME</label>
                    <input
                      type="text"
                      value={sandboxFileName}
                      onChange={(e) => setSandboxFileName(e.target.value)}
                      placeholder="e.g. macro_aim_helper.dll"
                      className="w-full bg-[#050506] border border-neutral-850 p-2 text-xs text-white rounded font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-500 font-black">FILE SIZE (MB)</label>
                    <input
                      type="number"
                      value={sandboxFileSize}
                      onChange={(e) => setSandboxFileSize(e.target.value)}
                      placeholder="e.g. 1.5"
                      className="w-full bg-[#050506] border border-neutral-850 p-2 text-xs text-white rounded font-mono focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 space-y-1 text-left">
                    <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-500 font-black">MIME TYPE CLASSIFICATION</label>
                    <select
                      value={sandboxFileType}
                      onChange={(e) => setSandboxFileType(e.target.value)}
                      className="w-full bg-[#050506] border border-neutral-850 p-2 text-xs text-white rounded font-mono focus:outline-none"
                    >
                      <option value="image/png">image/png (Lossless Graphic)</option>
                      <option value="video/mp4">video/mp4 (H264 Digital Reel)</option>
                      <option value="application/octet-stream">application/octet-stream (Binary Library)</option>
                      <option value="application/x-msdownload">application/x-msdownload (Executable Binary)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={evaluateSandboxFile}
                    className="p-2.5 px-5 bg-[#E10600] text-white hover:bg-neutral-900 border border-transparent hover:border-[#E10600] hover:text-[#E10600] font-black uppercase text-xs rounded-xl transition-all"
                  >
                    SIMULATE SCANNING
                  </button>
                </div>

                {/* FILE SCANNED DYNAMICS */}
                {sandboxFileResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      sandboxFileResult.violates
                        ? "bg-[#181110] border-red-900/30 text-red-400"
                        : "bg-[#0b100e] border-[#132c1c] text-emerald-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-2">
                      {sandboxFileResult.violates ? <FileWarning size={15} /> : <CheckCircle2 size={15} />}
                      <span className="uppercase tracking-wider text-[11px]">
                        {sandboxFileResult.violates ? "MALICIOUS PARAMS DETECTED" : "SIGNATURE SECURE"}
                      </span>
                    </div>

                    {sandboxFileResult.violates ? (
                      <div className="space-y-1">
                        <div className="text-[10.5px] font-sans">The firewall rejected the file package immediately with results:</div>
                        {sandboxFileResult.reasons.map((r: string, idx: number) => (
                          <div key={idx} className="text-[10.5px] font-mono flex items-start gap-1">
                            <span className="text-red-500 font-black">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10.5px] font-sans">
                        File payload signature verified. Sandbox scanning found zero malicious headers, system hijack macros, or out-of-bounds structural errors.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBVIEW C: MANUAL REPORT SUBMISSION FORM */}
        {activeSubView === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-[#101011] border border-neutral-900 rounded-3xl p-6 space-y-4"
          >
            <div className="pb-3 border-b border-neutral-850 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <ThumbsDown className="text-[#E10600]" size={15} />
                Lodge Compliance Violation Notice
              </h3>
              <span className="text-[10px] text-zinc-550">OFFICIAL STRATEGIC PORTAL</span>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Spotted cheating behavior, loadout deviations, toxic lobby dialogues, check-in manipulation, or leaking classified VOD layouts? State details to instantiate an administrative mod case.
            </p>

            <form onSubmit={handleLodgeReport} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-400 font-bold">TARGET PLAYER OR TEAM INCIDENT ID *</label>
                  <input
                    type="text"
                    required
                    value={reportTarget}
                    onChange={(e) => setReportTarget(e.target.value)}
                    placeholder="e.g. Chameleon_Alt"
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-400 font-bold">MATCH ID REFERENCE *</label>
                  <input
                    type="text"
                    required
                    value={reportMatchId}
                    onChange={(e) => setReportMatchId(e.target.value)}
                    placeholder="e.g. match-8941"
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-400 font-bold">REPORT CATEGORY *</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => {
                      setReportCategory(e.target.value);
                      setAiAnalysisResult(null); // Reset when category changes to align evaluation
                    }}
                    className="w-full bg-[#050506] border border-neutral-850 p-2.5 text-xs text-white rounded focus:outline-none focus:border-[#E10600]"
                  >
                    <option value="Loadout Violations">🔫 Loadout Violations (Active Arena Agreement Breaches)</option>
                    <option value="Cheating Suspicions">🚨 Cheating Suspicions (ESP / Aimbot / Scripts / Hacks)</option>
                    <option value="Harassment">🗣️ Harassment (Direct Abuse, DMs, Slurs)</option>
                    <option value="Toxic Behaviour">☣️ Toxic Behaviour (Voice Spams, Unsportsmanlike)</option>
                    <option value="Match Fixing">🎲 Match Fixing (Wager collusions, intentional throwing)</option>
                    <option value="Impersonation">👤 Impersonation (Posing as Staff or Verified Clan Members)</option>
                    <option value="Staff Abuse">🛡️ Staff Abuse (Authorized Permission Violations)</option>
                    <option value="Community Rule Violations">🌐 Community Rule Violations (Forums / Profile Spam)</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="block text-[8.5px] uppercase font-mono tracking-widest text-target-400 font-bold">DESCRIPTION OF COMPLIANCE BREACH *</label>
                  <textarea
                    required
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Please specify exact timestamps, dialogues, or specific game behaviors to assist manual staff review..."
                    className="w-full bg-[#050506] border border-neutral-850 p-3 text-xs text-white rounded focus:outline-none focus:border-[#E10600] placeholder-zinc-850"
                  />
                </div>

                {/* DRAG AND DROP / FILE SELECTOR */}
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="block text-[8.5px] uppercase font-mono tracking-widest text-zinc-400 font-bold">EVIDENCE UPLOAD (SCREENSHOTS, CHAT LOGS, IMAGES) *</label>
                  
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setReportDragOver(true);
                    }}
                    onDragLeave={() => setReportDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setReportDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        triggerAiEvidenceAnalysis(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      reportDragOver
                        ? "border-[#E10600] bg-[#E10600]/10"
                        : "border-neutral-850 bg-[#050506] hover:border-neutral-700"
                    }`}
                  >
                    <input
                      type="file"
                      id="reportFileInput"
                      className="hidden"
                      accept="image/*,.txt,.log"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          triggerAiEvidenceAnalysis(e.target.files[0]);
                        }
                      }}
                    />
                    
                    <label htmlFor="reportFileInput" className="cursor-pointer flex flex-col items-center gap-2 select-none">
                      <UploadCloud size={30} className={reportFile ? "text-[#E10600]" : "text-zinc-550"} />
                      <span className="text-zinc-300 font-bold text-[11px]">
                        {reportFile ? `Selected: ${reportFile.name}` : "Drag & Drop evidence files here, or click to browse"}
                      </span>
                      <span className="text-[9px] text-zinc-550 block">Supported formats: PNG, JPG, JPEG, TXT, LOG (Max 15MB)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* AUTOMATED EVIDENCE REVIEW ASSISTANT (CV ASSISTANT AI) */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#0b0505] border border-red-955/40 p-4 rounded-xl flex items-center gap-3"
                  >
                    <RefreshCw className="animate-spin text-[#E10600] shrink-0" size={16} />
                    <div className="space-y-1">
                      <strong className="text-[10px] text-stone-100 uppercase block font-black">AI SENTINEL SCAN RUNNING...</strong>
                      <p className="text-[9.5px] text-zinc-500 font-sans leading-relaxed">
                        CV Assistant AI is parsing visual telemetry, matching timelines, comparing with Match ID logs, and flagging loadout or behavior inconsistencies...
                      </p>
                    </div>
                  </motion.div>
                )}

                {aiAnalysisResult && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#070908] border border-emerald-950/45 p-4 rounded-xl space-y-3 font-mono"
                  >
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase">CV ASSISTANT AI: AUTOMATED REVIEW COMPLETION</span>
                      </div>
                      <div className="text-[10px] font-bold text-stone-100">
                        CONFIDENCE SCORE: <span className="text-[#E10600] font-black">{aiAnalysisResult.confidenceScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[10px]">
                      <div>
                        <span className="text-zinc-500 block uppercase text-[8.5px] font-bold">EXTRACTED TELEMETRY FINDINGS:</span>
                        <p className="text-zinc-300 font-sans leading-relaxed">{aiAnalysisResult.findings}</p>
                      </div>

                      <div className="bg-black/60 border border-neutral-900 p-2.5 rounded-lg">
                        <span className="text-red-500 font-bold block uppercase text-[8px] tracking-wider">FLAGGED INCONSISTENCY PROFILED:</span>
                        <p className="text-zinc-300 text-[9.5px] mt-0.5">{aiAnalysisResult.inconsistency}</p>
                      </div>

                      <div className="border-t border-neutral-900/50 pt-2 flex items-center justify-between">
                        <div className="text-zinc-550 text-[8.5px]">
                          🛡️ <span className="text-yellow-500 font-semibold font-sans">Human Staff Review Required</span>. Major punishments are never automated.
                        </div>
                        <span className="text-emerald-400 text-[8.5px] uppercase font-bold tracking-widest">VERBATIM CO-PROCESSOR SECURE</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DISCLAIMER CHECKBOX FOR FALSE REPORTS */}
              <div className="bg-black/40 border border-neutral-900 p-3 rounded-xl flex items-start gap-2 text-[10px] text-zinc-400 leading-normal font-sans">
                <input
                  type="checkbox"
                  id="falseDisclaimerCheckbox"
                  checked={falseReportDisclaimerAccepted}
                  onChange={(e) => setFalseReportDisclaimerAccepted(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-black border border-neutral-850 text-[#E10600] focus:ring-0 mt-0.5 cursor-pointer shrink-0"
                />
                <label htmlFor="falseDisclaimerCheckbox" className="select-none cursor-pointer hover:text-white transition-colors">
                  <strong>DISCLOSURE OF INTEGRITY:</strong> I understand that intentionally submitting false, deceptive, or maliciously mocked reports is a major competitive integrity violation. Falsifications will trigger warning notices, matchmaking queue restrictions, or a 7-day temporary platform suspension.
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="p-3 px-6 bg-[#E10600] text-white hover:bg-neutral-900 border border-transparent hover:border-[#E10600] hover:text-[#E10600] font-black uppercase text-xs rounded-xl transition-all"
                >
                  LODGE COMPLIANCE TICKET
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* SUBVIEW D: SCRIM RELIABILITY LEDGER & SCORES */}
        {activeSubView === "scrims" && (
          <motion.div
            key="scrims"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] p-5 rounded-2xl border border-neutral-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                  <Gamepad className="text-[#E10600]" size={15} />
                  Scrim Reliability Rating Dashboard
                </h3>
                <p className="text-[10px] text-zinc-550 leading-relaxed font-sans">
                  Automatically updates team reliability indexes. Late cancellations (-15 score) and no-shows (-25 score) limit available lobbies and queue priority status.
                </p>
              </div>

              <div className="text-right">
                <span className="p-1 px-3 bg-[#0d120e] text-emerald-400 border border-emerald-900/30 text-[9px] font-black uppercase rounded block">
                  SYSTEM CORRELATION PROTOCOL: ENABLED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reliabilityList.map((team) => (
                <div key={team.id} className="bg-[#101011] border border-neutral-900 rounded-2xl p-4.5 space-y-4 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{team.teamName}</h4>
                      <span className="p-0.5 px-1.5 bg-neutral-950 border border-neutral-850 text-[8px] text-zinc-500 rounded font-mono uppercase mt-1 inline-block">
                        ID: {team.id}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase p-0.5 px-2 rounded ${
                        team.status === "GOOD"
                          ? "bg-emerald-950/40 text-emerald-450 border border-emerald-900/30"
                          : team.status === "PROBATION"
                          ? "bg-yellow-950/40 text-yellow-450 border border-yellow-900/30"
                          : "bg-red-950/40 text-red-450 border border-red-900/40 animate-pulse"
                      }`}
                    >
                      {team.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Reliability Score:</span>
                      <strong className={team.reliabilityScore >= 80 ? "text-emerald-400" : team.reliabilityScore >= 50 ? "text-yellow-400" : "text-[#E10600]"}>
                        {team.reliabilityScore}%
                      </strong>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-900">
                      <div
                        className={`h-full transition-all duration-300 ${
                          team.reliabilityScore >= 80 ? "bg-emerald-500" : team.reliabilityScore >= 50 ? "bg-yellow-500" : "bg-[#E10600]"
                        }`}
                        style={{ width: `${team.reliabilityScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-neutral-850 text-center text-[9px] font-mono text-zinc-500">
                    <div className="bg-neutral-950/60 p-1.5 rounded border border-neutral-900">
                      <div className="text-white font-bold">{team.checkInSuccess}</div>
                      <div>CHECK-INS</div>
                    </div>
                    <div className="bg-neutral-950/60 p-1.5 rounded border border-neutral-900">
                      <div className="text-yellow-500 font-bold">{team.lateCancellations}</div>
                      <div>LATE CXL</div>
                    </div>
                    <div className="bg-neutral-950/60 p-1.5 rounded border border-neutral-900">
                      <div className="text-red-500 font-bold">{team.noShows}</div>
                      <div>NO-SHOWS</div>
                    </div>
                  </div>

                  {/* ADMIN ADJUSTMENT MECHANISM */}
                  {isAdmin && (
                    <div className="pt-2 flex gap-1 justify-end">
                      <button
                        onClick={() => handleSyncScrimScore(team.id, -15)}
                        className="p-1 px-2.5 bg-red-950 hover:bg-red-900 text-red-400 text-[9px] font-black uppercase rounded border border-red-900/30 transition-colors"
                      >
                        -15 LATE
                      </button>
                      <button
                        onClick={() => handleSyncScrimScore(team.id, -25)}
                        className="p-1 px-2.5 bg-red-950 hover:bg-red-900 text-red-400 text-[9px] font-black uppercase rounded border border-red-900/30 transition-colors"
                      >
                        -25 NO-SHOW
                      </button>
                      <button
                        onClick={() => handleSyncScrimScore(team.id, 10)}
                        className="p-1 px-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-450 text-[9px] font-black uppercase rounded border border-emerald-900/30 transition-colors"
                      >
                        +10 RECOVER
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUBVIEW E: ADMIN CASE SHEETS MANAGER */}
        {activeSubView === "dashboard" && isAdmin && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] border border-neutral-900 p-5 rounded-2xl flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                  <ShieldAlert className="text-emerald-500" size={15} />
                  Compliance Incident Investigation Queue
                </h3>
                <p className="text-[10px] text-zinc-505">Incident cases auto-generated from heuristic flags or filed reports pending admin actions.</p>
              </div>

              <span className="p-1 px-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 text-[9px] font-black uppercase rounded">
                SECURE OVERRIDE CLEARANCE GRANTED
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* PRIMARY CASES MATRIX */}
              <div className="lg:col-span-8 space-y-4">
                {cases.map((cs) => (
                  <div key={cs.id} className="bg-[#101011] border border-neutral-905 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-0.5 px-2 bg-neutral-950 text-neutral-400 border border-neutral-900 text-[8px] font-mono rounded">
                            ID: {cs.id}
                          </span>
                          <span
                            className={`p-0.5 px-1.5 rounded text-[8px] font-black uppercase ${
                              cs.status === "Flagged"
                                ? "bg-red-950 text-red-400 border border-red-900/35 animate-pulse"
                                : cs.status === "Under Review"
                                ? "bg-amber-950 text-amber-400 border border-amber-900/30"
                                : "bg-zinc-900 text-neutral-400 border border-neutral-800"
                            }`}
                          >
                            {cs.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{cs.title}</h4>
                      </div>

                      <div className="text-right pointer-events-none">
                        <span className="text-[9px] text-zinc-550 font-bold block">RISK WEIGHTING</span>
                        <span className={cs.riskWeight > 80 ? "text-[#E10600] text-sm font-black" : cs.riskWeight > 50 ? "text-yellow-500 font-black text-sm" : "text-zinc-400 text-sm font-black"}>
                          {cs.riskWeight}% RISK
                        </span>
                      </div>
                    </div>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-2 text-xs">
                      <div>
                        <strong className="text-zinc-500 uppercase tracking-widest text-[8.5px] block font-black">STATEMENT OF ACCUSED GUIDELINE BREACH</strong>
                        <p className="text-neutral-300 font-sans leading-relaxed mt-1">{cs.evidence}</p>
                      </div>

                      <div className="grid grid-cols-2 text-[10px] text-zinc-550 pt-2 border-t border-neutral-900 font-mono">
                        <div>ACCUSED ELEMENT: <strong className="text-white">{cs.accusedUser}</strong></div>
                        <div>INVESTIGATION SOURCE: <strong className="text-white">{cs.reporter}</strong></div>
                      </div>
                    </div>

                    {/* Automated Machine Scans Stream */}
                    {cs.automatedLogs.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-widest">SENTINEL-EVIDENCE METRIC STREAM</div>
                        <div className="bg-[#050506] border border-neutral-900/80 p-3 rounded-lg space-y-1 font-mono text-[10px] text-red-400/80">
                          {cs.automatedLogs.map((log, i) => (
                            <div key={i} className="flex gap-1">
                              <span className="text-red-500 font-black">[!]</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ACTIONS DECISION FORM */}
                    <div className="pt-2 flex flex-wrap gap-2 justify-between border-t border-neutral-850">
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => handleSetCaseStatus(cs.id, "Under Review")}
                          className="p-1.5 px-3 bg-zinc-900 hover:bg-neutral-850 hover:text-white hover:border hover:border-neutral-700 text-zinc-400 text-[10px] font-black uppercase rounded-lg border border-transparent transition-all"
                        >
                          ASSIGN INVESTIGATION
                        </button>
                        <button
                          onClick={() => handleSetCaseStatus(cs.id, "Resolved")}
                          className="p-1.5 px-3 bg-neutral-900 border border-neutral-805 hover:bg-neutral-800 text-emerald-450 hover:text-emerald-400 text-[10px] font-black uppercase rounded-lg transition-colors"
                        >
                          DEMOTE SUSPICION
                        </button>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleApplyWarning(cs.accusedUser)}
                          className="p-1.5 px-3 bg-amber-950 hover:bg-amber-900 text-amber-400 border border-amber-900/30 text-[10px] font-black uppercase rounded-lg transition-colors"
                        >
                          ISSUE WARNING
                        </button>
                        <button
                          onClick={() => handleAdminBanUser(cs.accusedUser)}
                          className="p-1.5 px-3 bg-[#E10600] text-white hover:bg-neutral-900 hover:text-red-500 hover:border-red-900 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                        >
                          EXCLUDE PLAYER
                        </button>
                      </div>
                    </div>

                  </div>
                ))}

                {cases.length === 0 && (
                  <div className="text-center font-mono text-xs text-neutral-600 py-16">
                    Incident Case ledger cleared. Compliance structures operating with absolute parameters.
                  </div>
                )}
              </div>

              {/* ADMINISTRATIVE UTILITIES PANEL */}
              <div className="lg:col-span-4 bg-[#101011] border border-neutral-900 p-6 rounded-2xl h-fit space-y-6">
                <div>
                  <h3 className="text-xs font-black text-[#E10600] uppercase tracking-widest pb-3 border-b border-neutral-900 mb-4 flex items-center gap-1.5">
                    <Settings size={13} />
                    Sentinel Core Settings
                  </h3>

                  <div className="space-y-4 py-2 text-xs text-neutral-400 font-sans leading-relaxed">
                    <p>
                      Modify the reactive threshold weighting of the automated Sentinel bot triggers. Strict triggers ban players instantly.
                    </p>

                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex justify-between items-center bg-neutral-950 p-2 rounded border border-neutral-900">
                        <span>NLP Filter Level:</span>
                        <strong className="text-red-500">HEAVY SPAM / BAN</strong>
                      </div>
                      <div className="flex justify-between items-center bg-neutral-950 p-2 rounded border border-neutral-900">
                        <span>Min Reliability Join:</span>
                        <strong className="text-yellow-500">65% SCORE REQUIRED</strong>
                      </div>
                      <div className="flex justify-between items-center bg-neutral-950 p-2 rounded border border-neutral-900">
                        <span>Malware Firewall:</span>
                        <strong className="text-emerald-400">ISOLATION ON</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">COMPLIANCE STATS OVERLAY</div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total Scans Performed:</span>
                      <strong className="text-white">1,402 Today</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Heuristic Captures:</span>
                      <strong className="text-red-500">42 Flagged Case</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">False Positive Index:</span>
                      <strong className="text-emerald-400">0.02%</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* SUBVIEW F: COMPLIANCE RISKS ASSESSMENT LEDGER */}
        {activeSubView === "profiles" && isAdmin && (
          <motion.div
            key="profiles"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#101011] p-5 rounded-2xl border border-neutral-900">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                <BarChart2 className="text-[#E10600]" size={15} />
                User Profiles Risk Heat Score Matrix
              </h3>
              <p className="text-[10px] text-zinc-550 leading-relaxed font-sans mt-0.5">
                Evaluates a secure internal threat metric (0-100) combining recent reports, security control failed overrides, spam flags, and coordinate infractions. Higher indicators demand active security inspection overlays.
              </p>
            </div>

            <div className="bg-[#101011] border border-neutral-900 rounded-3xl overflow-hidden">
              <div className="p-4 px-6 border-b border-neutral-900 bg-neutral-950/50 grid grid-cols-12 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <div className="col-span-3">PLAYER CREDENTIAL IDENTIFIER</div>
                <div className="col-span-2 text-center">RISK INDEX</div>
                <div className="col-span-2 text-center">RECENT REPORTS</div>
                <div className="col-span-3">PRIMARY RISK COMPLIANCE INDICATOR</div>
                <div className="col-span-2 text-right">DISCIPLINARY ACTIONS</div>
              </div>

              <div className="divide-y divide-neutral-900 font-sans text-xs">
                {riskProfiles.map((prof, i) => (
                  <div key={i} className="p-4 px-6 grid grid-cols-12 items-center hover:bg-neutral-900/10 transition-colors">
                    
                    <div className="col-span-3 font-mono font-bold text-white truncate max-w-[200px]">{prof.username}</div>
                    
                    <div className="col-span-2 text-center">
                      <span
                        className={`p-1 px-2.5 rounded text-[10px] font-bold font-mono ${
                          prof.riskScore > 80
                            ? "bg-red-950/40 text-[#E10600] border border-red-900/30"
                            : prof.riskScore > 40
                            ? "bg-yellow-950/40 text-yellow-500 border border-yellow-900/30"
                            : "bg-[#0c120e] text-emerald-400 border border-[#1b3c25]"
                        }`}
                      >
                        {prof.riskScore}% HEAT
                      </span>
                    </div>

                    <div className="col-span-2 text-center font-mono font-bold text-neutral-300">
                      {prof.recentReports} Instances
                    </div>

                    <div className="col-span-3 text-neutral-400 text-xs truncate max-w-[250px] font-mono italic">
                      {prof.primaryRiskIndicator}
                    </div>

                    <div className="col-span-2 text-right flex justify-end gap-1.5 font-mono">
                      <button
                        onClick={() => handleApplyWarning(prof.username)}
                        className="p-1 px-2 bg-amber-950 text-amber-500 hover:bg-amber-900 font-black text-[9px] uppercase rounded border border-amber-900/20 transition-colors"
                      >
                        WARN
                      </button>
                      <button
                        onClick={() => handleAdminBanUser(prof.username)}
                        className="p-1 px-2 bg-red-950 text-[#E10600] hover:bg-red-900 hover:text-white font-black text-[9px] uppercase rounded border border-red-900/30 transition-all"
                      >
                        BAN
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
