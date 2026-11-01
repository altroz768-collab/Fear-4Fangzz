import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import IntelligentModerationSystem from "./IntelligentModerationSystem";
import CVMatchCenter from "./CVMatchCenter";
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
  CheckSquare,
  BookmarkCheck,
  Megaphone,
  Bell,
  Sliders,
  Users,
  Award,
  Gamepad,
  Video,
  ChevronRight,
  Shield,
  MessageSquare,
  HelpCircle,
  FileSpreadsheet,
  Settings,
  X,
  Plus,
  Edit3,
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
  ExternalLink,
  ChevronDown
} from "lucide-react";

// --- CATEGORIES DEFINITIONS & SYSTEM ICON LINKS ---
export const RULE_CATEGORIES = [
  { id: "cvMatchRules", label: "CV Match Rules", icon: Award, color: "text-red-500", border: "border-red-900/30" },
  { id: "tdmArenaRules", label: "TDM Arena Rules", icon: Gamepad, color: "text-orange-500", border: "border-orange-950/30" },
  { id: "tournaments", label: "Tournament Rules", icon: Award, color: "text-yellow-500", border: "border-yellow-900/30" },
  { id: "scrims", label: "Scrim Rules", icon: Sliders, color: "text-emerald-500", border: "border-emerald-900/30" },
  { id: "communityRules", label: "Community Rules", icon: Users, color: "text-purple-500", border: "border-purple-900/30" },
  { id: "worldChatRules", label: "World Chat Rules", icon: MessageSquare, color: "text-pink-500", border: "border-pink-900/30" },
  { id: "recruitment", label: "Recruitment Rules", icon: FileText, color: "text-blue-500", border: "border-blue-900/30" },
  { id: "teamRules", label: "Team Rules", icon: Layers, color: "text-indigo-500", border: "border-indigo-900/30" },
  { id: "squadRules", label: "Squad Rules", icon: Users, color: "text-teal-500", border: "border-teal-900/30" },
  { id: "streamers", label: "Streamer Rules", icon: Sparkles, color: "text-cyan-500", border: "border-cyan-900/30" },
  { id: "creatorRules", label: "Creator Rules", icon: Flame, color: "text-amber-500", border: "border-amber-900/30" },
  { id: "staff", label: "Staff Rules", icon: Briefcase, color: "text-rose-500", border: "border-rose-900/30" },
  { id: "accountRules", label: "Account Rules", icon: UserCheck, color: "text-lime-500", border: "border-lime-900/30" },
  { id: "securityRules", label: "Security Rules", icon: Lock, color: "text-zinc-400", border: "border-zinc-800" },
  { id: "fairPlayRules", label: "Fair Play Rules", icon: Scale, color: "text-[#E10600]", border: "border-red-900/40" },
  { id: "antiCheating", label: "Anti-Cheating Rules", icon: ShieldAlert, color: "text-red-600", border: "border-red-950/45" },
  { id: "appealRules", label: "Appeal Rules", icon: HelpCircle, color: "text-slate-300", border: "border-slate-800" },
  { id: "reportingRules", label: "Reporting Rules", icon: AlertTriangle, color: "text-yellow-600", border: "border-yellow-950/40" }
];

// --- STATIC BASE RULES DATA SHIELD ---
const INITIAL_RULES_BASE = [
  {
    id: "cvMatchRules-1",
    categoryId: "cvMatchRules",
    title: "Official Competitive CV Match Guidelines",
    description: "Required compliance terms for PMGC BR Lobbies and customized TDM arena tourney groups.",
    clauses: [
      "Must use verified, registered credentials and match usernames perfectly.",
      "Account sharing, macro scripts, and server emulator bypass protocols cause immediate deletion.",
      "Review Live Match Stream rules before submitting your verified rosters."
    ],
    version: "3.5",
    lastUpdated: "2026-06-10"
  },
  {
    id: "tdmArenaRules-1",
    categoryId: "tdmArenaRules",
    title: "Ranked TDM Arena Regulations",
    description: "Standard operating rules for all 1v1, 2v2, and 4v4 TDM competitive matches.",
    clauses: [
      "No custom layout files editing or modifying game textures to gain vision advantages.",
      "Weapon restrictions must be strictly honored as declared by the lobby coordinator.",
      "Leaving matches prematurely will trigger a 15-point MMR deduction."
    ],
    version: "2.1",
    lastUpdated: "2026-06-12"
  },
  {
    id: "tournaments-1",
    categoryId: "tournaments",
    title: "Tournament Eligibility & Rosters",
    description: "Teams registering for Crimson Vipers official bracket schedules must show correct identity proofs.",
    clauses: [
      "All squad players must list matching In-Game Names (IGNs) precisely. Overlays or alternate accounts will void prizes.",
      "Rosters cannot hold active bans in any previous seasonal league.",
      "Prize disbursements are wired only to verified team owners after anti-cheat log sign-off."
    ],
    version: "1.5",
    lastUpdated: "2026-06-05"
  },
  {
    id: "scrims-1",
    categoryId: "scrims",
    title: "Lobby Attendance & Cancellation Terms",
    description: "Every registered system organization must complete matches fully. Late cancellations cause platform restrictions.",
    clauses: [
      "Confirm lobby slot check-ins 15 minutes prior to scheduled maps.",
      "Early Withdrawals (3hr+ lead) trigger no penalty whatsoever.",
      "Late Withdrawals under 3 hours generate an automated 2-day platform suspension and reliability score deduction."
    ],
    version: "1.8",
    lastUpdated: "2026-06-10"
  },
  {
    id: "communityRules-1",
    categoryId: "communityRules",
    title: "Platform Community Guidelines",
    description: "Rules for general public conduct, forums, profile configurations and social media interactions.",
    clauses: [
      "Always maintain a respectful posture toward fellow competitors and platform staff.",
      "Do not spam community forums or comment areas with external commercial ads or self-promotional links.",
      "Inappropriate or highly offensive profile avatars will be hidden by moderator action immediately."
    ],
    version: "1.2",
    lastUpdated: "2026-05-30"
  },
  {
    id: "worldChatRules-1",
    categoryId: "worldChatRules",
    title: "World Chat & Direct Messages Standards",
    description: "Conduct guidelines governing public lobbies, match chats, and global messaging networks.",
    clauses: [
      "Toxicity, spamming, and shouting in capital letters excessively are strictly regulated.",
      "No shareable malicious links, IP trackers, or phishing sites are permitted.",
      "Violations lead to a graduated muted-user status ranging from 15 minutes to 48 hours."
    ],
    version: "2.3",
    lastUpdated: "2026-06-15"
  },
  {
    id: "recruitment-1",
    categoryId: "recruitment",
    title: "Enlistment Veracity & Trial Requirements",
    description: "Applying for CV elite team roles requires absolute honesty and verified device streams.",
    clauses: [
      "You must accurately declare your device models and average frame rate outputs.",
      "Any falsified competitive history or fake stats graphs will blacklists future trials.",
      "Co-signing recruitment forms with false anti-cheat integrity reports is grounds for a system-wide ban."
    ],
    version: "1.2",
    lastUpdated: "2026-05-20"
  },
  {
    id: "teamRules-1",
    categoryId: "teamRules",
    title: "Clan & Faction Hub Operational Policies",
    description: "Rules governing verified teams, rosters, trade windows, and intellectual property.",
    clauses: [
      "Sharing screenshots of scheduled roster exercises outside CV channels is restricted.",
      "Do not share raw gameplay analysis VODs with non-affiliated analysts.",
      "Keep internal debates constructive. Escalate internal disputes directly to management."
    ],
    version: "1.0",
    lastUpdated: "2026-03-01"
  },
  {
    id: "squadRules-1",
    categoryId: "squadRules",
    title: "Autonomous Squad Management",
    description: "Independent community captains hold full executive oversight over their roster lines.",
    clauses: [
      "Captains are held accountable for toxic conduct represented by any squad sub-members.",
      "Recruitments cannot steal active players from CV elite main lines without official trade permissions.",
      "Respect player privacy; do not share teammate personal info without explicit written consent."
    ],
    version: "1.1",
    lastUpdated: "2026-04-10"
  },
  {
    id: "streamers-1",
    categoryId: "streamers",
    title: "Official Broadcaster Conduct & Representation",
    description: "Streamers authorized to display the Crimson Vipers logo must show perfect sportsmanship.",
    clauses: [
      "No toxic trash-talking or calling out opponent player profiles on live streams.",
      "Must show professional visual overlays and keep sponsor credits transparent.",
      "Violations on stream during matches trigger immediate broadcaster badge deletion."
    ],
    version: "1.3",
    lastUpdated: "2026-05-18"
  },
  {
    id: "creatorRules-1",
    categoryId: "creatorRules",
    title: "Creator Code & Audio-Visual Limitations",
    description: "All creators are subject to official community guidelines for highlight creation.",
    clauses: [
      "Clips containing glitched matches or buggy gameplay edits cannot be published.",
      "Disclose clear sponsorships or affiliated commercial ties explicitly under local laws.",
      "Music tracks in edits must not cause copyright violations or DMCA warnings."
    ],
    version: "1.1",
    lastUpdated: "2026-04-20"
  },
  {
    id: "staff-1",
    categoryId: "staff",
    title: "Staff Impartiality & Conflict Controls",
    description: "Admin & Moderator operators must enforce rules without personal bias or favoritism.",
    clauses: [
      "Staff cannot operate as active players in tournaments they are officiating.",
      "Respect data confidentiality; do not lookup player IP logs without verified security reports.",
      "Never accept external tips, donations, or packages to prioritize disputed ticket results."
    ],
    version: "1.7",
    lastUpdated: "2026-06-01"
  },
  {
    id: "accountRules-1",
    categoryId: "accountRules",
    title: "Account Ownership & Identification",
    description: "Identity standards, profile updates, and authentication protocols of platform accounts.",
    clauses: [
      "Users are restricted to exactly one primary eSports career account on the platform.",
      "Mock identity credentials or fake WhatsApp linkage numbers trigger automatic profile locks.",
      "Account ownership transfer is strictly prohibited without written approval from platform administrators."
    ],
    version: "1.1",
    lastUpdated: "2026-06-18"
  },
  {
    id: "securityRules-1",
    categoryId: "securityRules",
    title: "User Data Isolation & System Firewalls",
    description: "Platform keeps all personal names, contact e-mails, and game logs secured.",
    clauses: [
      "Under no circumstances is player account transfer allowed without admin token codes.",
      "Platform uses cookie-secure tokens to persist user compliance status logs safely.",
      "In-game telemetry remains anonymous and isolated from external analytics entities."
    ],
    version: "1.5",
    lastUpdated: "2026-05-01"
  },
  {
    id: "fairPlayRules-1",
    categoryId: "fairPlayRules",
    title: "Fair Play Standards & Graduated Penalty Matrix",
    description: "Ensuring an untainted eSports sandbox. Prohibiting Hacking, Cheating, Exploits, Account Sharing, Impersonation, Match Fixing, Toxic Behavior, Harassment, Hate Speech, and Scamming.",
    clauses: [
      "PROHIBITED INFRACTIONS: Absolutely no Hacking, Cheating (Aimbots/ESP), wall Exploits, Account Sharing, Impersonating players/staff, Match Fixing, Toxic Behavior, Harassment, Hate Speech, or Scamming other users.",
      "PENALTY TIER 1 (Warnings & Mutes): Toxic conduct, mild harassment, or minor chat spam results in immediate 2-hour mute and -10 compliance score.",
      "PENALTY TIER 2 (Rank Locks & Temp Suspensions): Account sharing, matching tampering, or minor glitch abuse triggers a 7-day ranked queue lock and -30 compliance score.",
      "PENALTY TIER 3 (Permanent Blacklisting): Hacking, injection scripts, emulator bypass, match-fixing or scamming results in immediate permanent IP/Account ban with zero asset refund."
    ],
    version: "3.0",
    lastUpdated: "2026-07-03"
  },
  {
    id: "antiCheating-1",
    categoryId: "antiCheating",
    title: "Anti-Cheating Protocol & Handcam Audits",
    description: "Strict validation procedures protecting matches from hardware or software injections.",
    clauses: [
      "Any suspicious player flagged by the automated anti-cheat telemetry must submit a continuous unedited handcam video within 24 hours.",
      "No external clip-on buttons, trigger mechanisms, or emulators can be rigged to physical smartphones.",
      "Any third-party memory modification tool detected running in background results in instant device blacklisting."
    ],
    version: "2.4",
    lastUpdated: "2026-07-01"
  },
  {
    id: "appealRules-1",
    categoryId: "appealRules",
    title: "Appeals Pipeline & Review Policy",
    description: "Systematic recourse for suspended players to present verifiable clean-game telemetry.",
    clauses: [
      "Appeals must be formally submitted within exactly 7 days of the infraction lock timestamp.",
      "The applicant must attach unedited visual footage with visible touch indicators enabled.",
      "Re-offending or harassing staff during an ongoing appeal review causes instant cancellation of the ticket."
    ],
    version: "1.5",
    lastUpdated: "2026-06-25"
  },
  {
    id: "reportingRules-1",
    categoryId: "reportingRules",
    title: "Reporting Infractions & Accusations",
    description: "Guidelines on how to report suspected cheaters, toxic behavior, or match fixing safely and effectively.",
    clauses: [
      "All player reports must include high-definition video files of the target matching instance.",
      "False accusations or coordinate manipulation to frame rival squads will trigger reciprocal penalties.",
      "Submit reports confidentially via the designated Intel Sentinel Moderator tool to prevent target alert leaks."
    ],
    version: "1.2",
    lastUpdated: "2026-06-29"
  }
];

// --- PENALTY LOGS SIMULATION ---
const INITIAL_PENALTIES = [
  {
    id: "pen-101",
    userIgn: "SoloSlayer_99",
    categoryId: "scrims",
    penaltyType: "Scrim Suspension",
    reason: "Late cancellation on Erangel Pro League. Second offense this cycle.",
    status: "Active",
    timestamp: "2026-06-09T15:30:00Z",
    duration: "48 hours",
    adminNotes: "Team pulled out 10 minutes prior to room release. Automated lock applied.",
    appealText: "",
    appealStatus: "Pending", // "Pending" | "Approved" | "Rejected" | "None"
    appealResponse: ""
  },
  {
    id: "pen-102",
    userIgn: "Viper_Alpha_01",
    categoryId: "general",
    penaltyType: "Warning",
    reason: "Slight toxic language in global liaison lobbies.",
    status: "Resolved",
    timestamp: "2026-06-05T09:12:00Z",
    duration: "N/A",
    adminNotes: "Player apologized. Logged warning on compliance file.",
    appealText: "I was provoked but I understand the rules. I will ignore the instigators.",
    appealStatus: "Approved",
    appealResponse: "Warning acknowledged and marked resolved. Thank you for compliance."
  }
];

// --- VERSION TIMELINE HISTORY ---
const VERSION_LOGS = [
  { date: "2026-06-10", author: "CV_Slayer_IGL", categoryName: "Scrim Rules", changes: "Updated Late Cancellation parameters to 2-day suspension and automatic waitlist progression triggers.", version: "1.8" },
  { date: "2026-06-08", author: "CV_Mamba_Flick", categoryName: "Chat & Communication Rules", changes: "Added rules strictly banning hacking files, cheat discussions, and device emulators.", version: "2.2" },
  { date: "2026-06-01", author: "CV_Slayer_IGL", categoryName: "General Platform Rules", changes: "General cleanup of anti-toxicity guidelines. Imposed graduated mute durations.", version: "2.1" },
  { date: "2026-05-25", author: "Admin_Elite", categoryName: "Appeals & Penalty Rules", changes: "Created centralized 7-day appeal rule with active video verification proofs schema.", version: "1.6" }
];

interface RulesAndComplianceProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
  onGoHome: () => void;
}

export default function RulesAndComplianceSystem({
  currentIgn,
  onAlert,
  onGoHome
}: RulesAndComplianceProps) {
  // --- SYSTEM STATES ---
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("cv_system_rules");
    return saved ? JSON.parse(saved) : INITIAL_RULES_BASE;
  });

  const [penalties, setPenalties] = useState<any[]>(() => {
    const saved = localStorage.getItem("cv_system_penalties");
    return saved ? JSON.parse(saved) : INITIAL_PENALTIES;
  });

  const [acceptances, setAcceptances] = useState<any[]>(() => {
    const saved = localStorage.getItem("cv_rule_acceptances");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("cv_rule_notifications");
    return saved ? JSON.parse(saved) : [
      { id: "not-1", message: "⚡ SCRIM REGISTRATION UPDATE: Version 1.8 has been published today. Please re-accept scrim guidelines.", categoryId: "scrims", read: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem("cv_system_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem("cv_system_penalties", JSON.stringify(penalties));
  }, [penalties]);

  useEffect(() => {
    localStorage.setItem("cv_rule_acceptances", JSON.stringify(acceptances));
  }, [acceptances]);

  useEffect(() => {
    localStorage.setItem("cv_rule_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // UI Navigation
  const [activeSubTab, setActiveSubTab] = useState<"index" | "penalties" | "admin" | "history" | "moderation" | "match-center">("index");
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [searchPhrase, setSearchPhrase] = useState("");

  // Print Window Simulate
  const [printDocument, setPrintDocument] = useState<any | null>(null);

  // Appeal Modal Form State
  const [appealTargetPen, setAppealTargetPen] = useState<any | null>(null);
  const [appealTextBody, setAppealTextBody] = useState("");

  // Admin Crud States
  const [adminSelectedCategory, setAdminSelectedCategory] = useState("general");
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [newRuleClauses, setNewRuleClauses] = useState("");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Simulated Admin Credentials Check
  const isAdmin = ["CV_Slayer_IGL", "CV_Mamba_Flick", "Admin_Elite", "Owner", "MucheChe_Staff", "Staff"].some(
    (name) => currentIgn.toLowerCase().includes(name.toLowerCase()) || currentIgn === "muchecheprince4@gmail.com"
  );

  // --- DERIVED VIEWING COMPUTATION ---
  const filteredRules = rules.filter((rule: any) => {
    const matchesCategory = rule.categoryId === selectedCategory;
    const matchesSearch =
      rule.title.toLowerCase().includes(searchPhrase.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchPhrase.toLowerCase()) ||
      rule.clauses.some((c: string) => c.toLowerCase().includes(searchPhrase.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const acceptedCategoriesMap = acceptances
    .filter((acc) => acc.userIgn === currentIgn)
    .reduce((acc: any, cur: any) => {
      acc[cur.categoryId] = cur.versionAccepted;
      return acc;
    }, {});

  // For visual alert indicators
  const unacceptedCategories = RULE_CATEGORIES.filter((cat) => {
    const activeVer = rules.filter((r: any) => r.categoryId === cat.id)[0]?.version || "1.0";
    return acceptedCategoriesMap[cat.id] !== activeVer;
  });

  // Help Calculate Acceptance Percentages for Admin Stats
  const getAcceptanceCountForCategory = (catId: string) => {
    return acceptances.filter((acc) => acc.categoryId === catId).length + 42; // simulated scale for professional index
  };

  // --- CORE COMPLIANCE ACTORS ---
  const handleAcceptRulesCategory = (categoryId: string) => {
    const ruleGroup = rules.filter((r: any) => r.categoryId === categoryId);
    if (ruleGroup.length === 0) {
      onAlert("⚠️ Rules format failure. No records under this category to accept.");
      return;
    }
    const targetVersion = ruleGroup[0].version;

    // Filter existing for replacement
    const updated = acceptances.filter(
      (acc) => !(acc.categoryId === categoryId && acc.userIgn === currentIgn)
    );

    const newAcceptance = {
      id: "acc-" + Date.now(),
      categoryId,
      categoryName: RULE_CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId,
      versionAccepted: targetVersion,
      dateAccepted: new Date().toISOString().split("T")[0],
      userIgn: currentIgn,
      userRole: "Compliance Participant"
    };

    setAcceptances([...updated, newAcceptance]);
    setNotifications(notifications.filter((n) => n.categoryId !== categoryId));
    onAlert(`⭐ Rules verification approved! Compliance records logged for version ${targetVersion}`);
  };

  const handlePostAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealTextBody.trim()) {
      onAlert("⚠️ Please state the grounds for your appeal clearly.");
      return;
    }

    setPenalties(
      penalties.map((pen) => {
        if (pen.id !== appealTargetPen.id) return pen;
        return {
          ...pen,
          appealText: appealTextBody.trim(),
          appealStatus: "Pending"
        };
      })
    );

    onAlert("📜 Appeal submitted to compliance staff. Status updated to Pending.");
    setAppealTargetPen(null);
    setAppealTextBody("");
  };

  const handlePrintDocumentSimulate = (catId: string) => {
    const categoryInfo = RULE_CATEGORIES.find((c) => c.id === catId);
    const categoryRules = rules.filter((r: any) => r.categoryId === catId);
    if (!categoryInfo) return;

    setPrintDocument({
      categoryInfo,
      categoryRules,
      timestamp: new Date().toLocaleString(),
      org: "CRIMSON VIPERS INTEL OPERATIONS"
    });
  };

  // --- ADMIN OVERRIDES ---
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleDesc.trim()) {
      onAlert("⚠️ Please fill out the Rule Title and Description fields.");
      return;
    }

    const clauseArray = newRuleClauses
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (editingRuleId) {
      // Edit mode
      const updatedRules = rules.map((r: any) => {
        if (r.id !== editingRuleId) return r;
        const currentVer = parseFloat(r.version);
        const nextVer = (currentVer + 0.1).toFixed(1); // Auto increment version

        // Trigger notification check for reset
        const resetAcceptanceForUsers = () => {
          // Reset local acceptances under this category so they must re-accept
          setAcceptances((prev) => prev.filter((acc) => acc.categoryId !== r.categoryId));
          // Push notification banner
          const categoryName = RULE_CATEGORIES.find((c) => c.id === r.categoryId)?.label || r.categoryId;
          const newNotification = {
            id: "not-change-" + Date.now(),
            message: `⚡ RULE CHANGED: ${categoryName} updated to version ${nextVer}. Please re-accept to access features.`,
            categoryId: r.categoryId,
            read: false
          };
          setNotifications((prev) => [newNotification, ...prev]);
        };

        resetAcceptanceForUsers();

        return {
          ...r,
          title: newRuleTitle.trim(),
          description: newRuleDesc.trim(),
          clauses: clauseArray.length > 0 ? clauseArray : r.clauses,
          version: nextVer,
          lastUpdated: new Date().toISOString().split("T")[0]
        };
      });

      setRules(updatedRules);
      onAlert("🔧 Rule has been updated. Version incremented. All user acceptances reset.");
      setEditingRuleId(null);
    } else {
      // Create mode
      const newId = `${adminSelectedCategory}-${Date.now()}`;
      const newRuleObj = {
        id: newId,
        categoryId: adminSelectedCategory,
        title: newRuleTitle.trim(),
        description: newRuleDesc.trim(),
        clauses: clauseArray.length > 0 ? clauseArray : ["Draft clause point. Customize as needed."],
        version: "1.0",
        lastUpdated: new Date().toISOString().split("T")[0]
      };

      setRules([...rules, newRuleObj]);
      onAlert(`➕ New compliance check published under ${RULE_CATEGORIES.find((c) => c.id === adminSelectedCategory)?.label}!`);
    }

    setNewRuleTitle("");
    setNewRuleDesc("");
    setNewRuleClauses("");
  };

  const handleDeleteRule = (id: string) => {
    if (!window.confirm("⚠️ Deleting this rule cannot be undone. Confirm action?")) return;
    setRules(rules.filter((r: any) => r.id !== id));
    onAlert("🗑️ Disciplinary directive purged from compliance ledger.");
  };

  const handleAdminApproveAppeal = (penId: string) => {
    setPenalties(
      penalties.map((pen) => {
        if (pen.id !== penId) return pen;
        return {
          ...pen,
          status: "Resolved",
          appealStatus: "Approved",
          appealResponse: "Disciplinary measure revoked and cleared post strategic review. Maintain integrity!"
        };
      })
    );
    onAlert("✅ Approved appeal. Disciplinary measure resolved successfully.");
  };

  const handleAdminRejectAppeal = (penId: string) => {
    setPenalties(
      penalties.map((pen) => {
        if (pen.id !== penId) return pen;
        return {
          ...pen,
          appealStatus: "Rejected",
          appealResponse: "Appeal rejected. Provided technical data does not match ledger tracking files."
        };
      })
    );
    onAlert("❌ Appeal rejected. Retaining platform suspension status.");
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-[#0c0c0d] text-[#e4e4e7] min-h-screen p-4 md:p-8 rounded-3xl border border-neutral-900 overflow-hidden relative font-sans">
      
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-950/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-yellow-950/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* HEADER BAR */}
      <div className="border-b border-neutral-900 pb-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 bg-red-950/30 text-red-500 border border-red-900/40 text-[9px] font-mono uppercase tracking-widest font-black rounded-md">
              CENTRAL ENFORCEMENT PROTOCOL
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">LEDGER v2.4</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-wider text-white flex items-center gap-2.5">
            <Scale className="text-[#E10600] animate-bounce" size={26} />
            RULES & <span className="text-[#E10600]">COMPLIANCE</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            Centralized portal governing competitive parameters, fair play structures, and automated account integrity auditing. Agree to directives before accessing platform channels.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {unacceptedCategories.length > 0 ? (
            <div className="flex items-center gap-2 p-2 bg-yellow-950/20 text-yellow-500 border border-yellow-900/30 rounded-xl px-4 animate-pulse">
              <AlertTriangle size={15} />
              <span className="text-xs font-mono font-bold">{unacceptedCategories.length} RULE MANUALS TO ACCEPT</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 rounded-xl px-4">
              <CheckCircle2 size={15} />
              <span className="text-xs font-mono font-bold">ALL RULES RESOLVED</span>
            </div>
          )}

          <button
            onClick={() => {
              onGoHome();
              onAlert("🏆 Returning to home quadrant");
            }}
            className="p-2.5 px-4 bg-zinc-900/50 hover:bg-zinc-805 text-zinc-400 hover:text-white font-mono text-xs rounded-xl border border-neutral-800 transition-all font-bold flex items-center gap-1.5"
          >
            HOMEPAGE
          </button>
        </div>
      </div>

      {/* RULE CHANGE BROADCAST NOTIFICATION GATE */}
      {notifications.length > 0 && (
        <div className="mb-6 space-y-2">
          {notifications.map((not) => (
            <div
              key={not.id}
              className="bg-[#120f0e] border border-yellow-900/30 rounded-xl p-3 px-4 flex justify-between items-center gap-4 text-xs font-mono text-yellow-500 animate-fade-in"
            >
              <div className="flex items-center gap-2.5">
                <Bell size={14} className="animate-bounce" />
                <span>{not.message}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(not.categoryId);
                    setActiveSubTab("index");
                    onAlert(`🔍 Focused on updated rulebook: ${not.categoryId}`);
                  }}
                  className="p-1 px-3 bg-yellow-950 hover:bg-yellow-900 text-[10px] font-black tracking-widest uppercase rounded-lg border border-yellow-805 text-yellow-400 transition-colors"
                >
                  REVIEW NOW
                </button>
                <button
                  onClick={() => handleDismissNotification(not.id)}
                  className="p-1 text-zinc-650 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPLIANCE CORE INDEX MENU */}
      <div className="bg-[#101011] p-1.5 rounded-2xl border border-neutral-900 flex flex-wrap gap-1 mb-6">
        <button
          onClick={() => setActiveSubTab("index")}
          className={`p-2 px-4 transition-all duration-200 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
            activeSubTab === "index"
              ? "bg-[#E10600] text-white shadow-lg shadow-red-900/20"
              : "bg-transparent text-neutral-500 hover:text-white"
          }`}
        >
          <BookOpen size={11} />
          Rules Registry Hub
        </button>
        <button
          onClick={() => {
            setActiveSubTab("penalties");
            onAlert("📂 Opening penalties & exclusion tracking interface");
          }}
          className={`p-2 px-4 transition-all duration-200 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
            activeSubTab === "penalties"
              ? "bg-[#E10600] text-white shadow-lg shadow-red-900/20"
              : "bg-transparent text-[#9797a1] hover:text-white"
          }`}
        >
          <Scale size={11} />
          Exclusions & Penalties ({penalties.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("moderation");
            onAlert("🛡️ Synchronized Intelligent Sentinel Moderation stream.");
          }}
          className={`p-2 px-4 transition-all duration-200 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
            activeSubTab === "moderation"
              ? "bg-[#E10600] text-white shadow-lg shadow-red-900/20"
              : "bg-transparent text-[#9797a1] hover:text-white"
          }`}
        >
          <ShieldAlert size={11} className="animate-pulse" />
          Intel Sentinel Mod
        </button>
        <button
          onClick={() => {
            setActiveSubTab("match-center");
            onAlert("🏆 Opening Live Match Center & Competitive Rules Arena");
          }}
          className={`p-2 px-4 transition-all duration-200 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
            activeSubTab === "match-center"
              ? "bg-[#E10600] text-white shadow-lg shadow-red-900/20"
              : "bg-transparent text-[#9797a1] hover:text-white"
          }`}
        >
          <Award size={11} className="animate-bounce" />
          CV Match Arena & Rules
        </button>
        <button
          onClick={() => {
            setActiveSubTab("history");
            onAlert("📂 Accessing rules modification logs");
          }}
          className={`p-2 px-4 transition-all duration-200 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
            activeSubTab === "history"
              ? "bg-[#E10600] text-white shadow-lg shadow-red-900/20"
              : "bg-transparent text-[#9797a1] hover:text-white"
          }`}
        >
          <History size={11} />
          Rule Change History
        </button>

        {isAdmin && (
          <button
            onClick={() => {
              setActiveSubTab("admin");
              onAlert("⚙️ Accessing Administrator Compliance Settings Panel");
            }}
            className={`p-2 px-4 ml-auto transition-all duration-200 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
              activeSubTab === "admin"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                : "bg-transparent text-emerald-400 hover:text-emerald-300"
            }`}
          >
            <Settings size={11} className="animate-spin" />
            Admin Panel
          </button>
        )}
      </div>

      {/* INNER VIEWPORTS */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: RULES REGISTRY INDEX */}
        {activeSubTab === "index" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* LEFT 4 COLUMNS: CATEGORY RAIL SELECTOR */}
            <div className="lg:col-span-4 space-y-2">
              <div className="p-3 bg-neutral-900/40 rounded-xl border border-neutral-900">
                <div className="flex items-center bg-[#09090a] px-3 py-2 rounded-lg border border-neutral-800">
                  <Search size={14} className="text-neutral-500 mr-2" />
                  <input
                    type="text"
                    value={searchPhrase}
                    onChange={(e) => setSearchPhrase(e.target.value)}
                    placeholder="Search specific rules or clauses..."
                    className="bg-transparent text-xs text-white focus:outline-none w-full font-mono"
                  />
                  {searchPhrase && (
                    <button onClick={() => setSearchPhrase("")} className="text-neutral-500">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#101011] border border-neutral-900 p-2.5 rounded-2xl space-y-1">
                <div className="text-[10px] text-zinc-500 font-mono uppercase font-bold p-2">RULEBOOKS CATALOGUE</div>
                
                <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
                  {RULE_CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    const isAccepted = acceptedCategoriesMap[cat.id] === rules.filter((r: any) => r.categoryId === cat.id)[0]?.version;
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          onAlert(`📁 Selected compliance file: ${cat.label}`);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between border transition-all text-xs ${
                          isSelected
                            ? "bg-neutral-900/85 border-[#E10600]/40 text-white"
                            : "bg-transparent border-transparent hover:bg-neutral-900/20 text-neutral-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CatIcon className={`${cat.color} shrink-0`} size={15} />
                          <span className="font-mono text-[11px] font-bold tracking-wide truncate max-w-[180px]">{cat.label}</span>
                        </div>
                        
                        {isAccepted ? (
                          <span className="p-0.5 px-1.5 bg-emerald-950 text-emerald-400 text-[8px] font-mono rounded font-black">
                            AGREED
                          </span>
                        ) : (
                          <span className="p-0.5 px-1.5 bg-yellow-950 text-yellow-500 text-[8px] font-mono rounded font-black animate-pulse">
                            PENDING
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT 8 COLUMNS: DETAILED MANUALS VIEW */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#101011] border border-neutral-900 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 py-4 opacity-5 pointer-events-none">
                  <Scale size={180} />
                </div>
                
                {/* ACTIVE DIRECTIVE HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-800 mb-6">
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-wider text-white">
                      {RULE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">
                      VERSION {rules.filter((r: any) => r.categoryId === selectedCategory)[0]?.version || "1.0"} • UPDATED {rules.filter((r: any) => r.categoryId === selectedCategory)[0]?.lastUpdated || "2026-06-10"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrintDocumentSimulate(selectedCategory)}
                      className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-850 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                    >
                      <Printer size={12} />
                      PRINT RULES
                    </button>
                  </div>
                </div>

                {/* DYNAMIC RULE TILES */}
                <div className="space-y-6">
                  {filteredRules.map((rule: any) => (
                    <div key={rule.id} className="bg-[#080809] border border-neutral-900 rounded-xl p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-black font-mono tracking-wider text-[#E10600] uppercase">
                          {rule.title}
                        </h3>
                        <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1">
                          {rule.description}
                        </p>
                      </div>

                      <div className="bg-[#0d0d0e] border border-neutral-900 rounded-lg p-4 space-y-2.5">
                        <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest font-black">CLAUSES & ENFORCEMENT PARAMETERS</div>
                        {rule.clauses.map((clause: string, i: number) => (
                          <div key={i} className="flex gap-2 text-xs text-neutral-300 font-mono leading-relaxed items-start">
                            <span className="text-[#E10600] font-black">{i + 1}.</span>
                            <span>{clause}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredRules.length === 0 && (
                    <div className="text-center text-neutral-600 py-12 px-4 font-mono text-xs">
                      No disciplinary sub-directives logged. Adjust search phrase keywords.
                    </div>
                  )}
                </div>

                {/* ACCEPTANCE PROMPT GATE */}
                <div className="mt-8 pt-6 border-t border-neutral-850 bg-[#0a0a0b] p-5 rounded-xl border border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className="text-[#E10600]" size={14} />
                      <h4 className="text-xs font-black font-mono tracking-wide text-white uppercase">MANDATORY COMPLIANCE ACKNOWLEDGMENT</h4>
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-normal max-w-sm font-mono uppercase">
                      By agreeing, you certify that you have read, processed, and accepted all platform, security, and gameplay integrity guidelines above.
                    </p>
                  </div>

                  <div>
                    {acceptedCategoriesMap[selectedCategory] === rules.filter((r: any) => r.categoryId === selectedCategory)[0]?.version ? (
                      <div className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 p-2.5 px-4 rounded-xl flex items-center gap-2 text-xs font-mono font-bold">
                        <Check size={14} />
                        COMPLIANCE RATIFIED
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcceptRulesCategory(selectedCategory)}
                        className="bg-[#E10600] text-white p-2.5 px-5 font-mono text-xs font-black tracking-widest uppercase rounded-xl hover:bg-neutral-900 hover:text-red-500 hover:border-red-900 transition-all flex items-center gap-2"
                      >
                        <UserCheck size={14} />
                        I ACCEPT AND AGREE
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: EXCLUSIONS & PENALTIES ACTIVE DIRECTIVES */}
        {activeSubTab === "penalties" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* COMPLIANCE STATUS BOX */}
            <div className="bg-[#101011] border border-neutral-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-1.5 text-center">
                <AlertTriangle className="text-yellow-500 mx-auto" size={18} />
                <div className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">MY ACTIVE PENALTY TICKETS</div>
                <div className="text-lg font-black text-white font-mono">
                  {penalties.filter((p) => p.userIgn === currentIgn && p.status === "Active").length}
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-1.5 text-center">
                <ShieldAlert className="text-red-500 mx-auto" size={18} />
                <div className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">COMMUNITY RESTRICTION COUNT</div>
                <div className="text-lg font-black text-[#E10600] font-mono">
                  {penalties.filter((p) => p.status === "Active").length} SYSTEM WIDE
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-1.5 text-center">
                <Scale className="text-blue-400 mx-auto" size={18} />
                <div className="text-[10px] text-zinc-550 uppercase tracking-widest font-mono">APPEAL EFFICIENCY RATING</div>
                <div className="text-lg font-black text-blue-400 font-mono">92% COMPLETED</div>
              </div>
            </div>

            {/* PENALTIES HISTORICAL LEDGER */}
            <div className="bg-[#101011] border border-neutral-900 rounded-2xl p-6">
              <h2 className="text-md font-black italic uppercase tracking-wider text-white mb-4 flex items-center gap-2 font-mono pb-2 border-b border-neutral-900">
                <Scale className="text-[#E10600]" size={15} />
                Disciplinary Enforcement Registry
              </h2>

              <div className="space-y-4">
                {penalties.map((pen) => {
                  const categoryName = RULE_CATEGORIES.find((c) => c.id === pen.categoryId)?.label || pen.categoryId;
                  return (
                    <div
                      key={pen.id}
                      className="bg-[#09090a] border border-neutral-900 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                    >
                      <div className="lg:col-span-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-0.5 px-2 bg-neutral-900 border border-neutral-800 text-[8px] font-mono text-zinc-400 rounded">
                            ID: {pen.id}
                          </span>
                          <span className="p-0.5 px-1.5 bg-red-950 text-red-400 text-[8px] font-mono rounded uppercase font-black">
                            {pen.penaltyType}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{pen.userIgn}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{categoryName}</div>
                      </div>

                      <div className="lg:col-span-5 space-y-1 text-xs">
                        <div className="text-[10px] text-zinc-500 font-mono">INFRACTION LOGGED</div>
                        <p className="text-neutral-300 font-sans leading-relaxed">{pen.reason}</p>
                        <div className="text-[9px] text-[#E10600] font-mono mt-1">DURATION: {pen.duration}</div>
                      </div>

                      <div className="lg:col-span-4 flex flex-col items-end gap-2 text-right">
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono block">APPEAL STATUS</span>
                          <span
                            className={`p-0.5 px-2 rounded font-mono text-[9px] font-black uppercase ${
                              pen.appealStatus === "Approved"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                                : pen.appealStatus === "Pending"
                                ? "bg-yellow-950 text-yellow-500 border border-yellow-900/30 animate-pulse"
                                : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                            }`}
                          >
                            {pen.appealStatus === "None" ? "No Active Appeal" : pen.appealStatus}
                          </span>
                        </div>

                        {/* RESPONSE DISPLAY */}
                        {pen.appealResponse && (
                          <div className="text-[10px] text-zinc-400 italic font-mono bg-[#111112] p-2 rounded border border-neutral-850 mt-1 max-w-sm">
                            &quot;{pen.appealResponse}&quot;
                          </div>
                        )}

                        {/* ALLOW USER TO LODGE APPEAL FOR THEIR PENALTY */}
                        {pen.userIgn === currentIgn && pen.appealStatus === "None" && pen.status === "Active" && (
                          <button
                            onClick={() => {
                              setAppealTargetPen(pen);
                              onAlert(`📜 Selected penalty ticket ${pen.id} to appeal`);
                            }}
                            className="p-1 px-3 bg-[#E10600] hover:bg-neutral-900 text-white hover:text-[#E10600] hover:border hover:border-[#E10600] font-mono text-[9px] font-black uppercase tracking-wider rounded transition-all"
                          >
                            LODGE TICKET APPEAL
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {penalties.length === 0 && (
                  <div className="text-center text-neutral-600 font-mono text-xs py-12">
                    Clean disciplinary slate community-wide. Excellent sportsmanship records persist.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: RULE MODIFICATION TIMELINE LOGS */}
        {activeSubTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#101011] border border-neutral-900 rounded-2xl p-6"
          >
            <h2 className="text-md font-black italic uppercase tracking-wider text-white mb-6 flex items-center gap-2 font-mono pb-2 border-b border-neutral-900">
              <History className="text-[#E10600]" size={15} />
              Chronological Rules Version Release Timeline
            </h2>

            <div className="space-y-6 relative border-l border-neutral-800/80 ml-4 pl-6">
              {VERSION_LOGS.map((log, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-[#E10600] border-2 border-[#101011]" />
                  
                  <div className="bg-[#09090a] p-4.5 rounded-xl border border-neutral-900 space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                      <span className="text-[10px] font-mono text-[#E10600] uppercase font-bold tracking-widest bg-neutral-950 p-1 px-2.5 rounded border border-neutral-900">
                        {log.categoryName} • VERSION {log.version}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase">{log.date} BY {log.author}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">{log.changes}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: ADMINISTRATOR CONTROLS */}
        {activeSubTab === "admin" && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* COLUMN 1: FORM TO COMPOSE DIRECTIVES */}
            <div className="lg:col-span-5 bg-[#101011] border border-neutral-900 p-6 rounded-2xl h-fit">
              <h3 className="text-xs font-black font-mono text-[#E10600] uppercase tracking-widest pb-3 border-b border-neutral-900 mb-4 flex items-center gap-2">
                <Sliders size={14} />
                {editingRuleId ? "MODULIZE ACTIVE COMPLIANCE" : "COMPOSE REGISTRY RULE"}
              </h3>

              <form onSubmit={handleSaveRule} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-zinc-400 font-black">RULEBOOK CATALOGUE</label>
                  <select
                    value={adminSelectedCategory}
                    onChange={(e) => setAdminSelectedCategory(e.target.value)}
                    disabled={!!editingRuleId}
                    className="w-full bg-[#050506] border border-neutral-850 p-3 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600]"
                  >
                    {RULE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-zinc-400 font-black">DIRECTIVE TITLE</label>
                  <input
                    type="text"
                    required
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    placeholder="e.g. Map Collision Cheat Abuses"
                    className="w-full bg-[#050506] border border-neutral-850 p-3 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-zinc-400 font-black">DETAILED DESCRIPTION SUMMARY</label>
                  <textarea
                    required
                    rows={3}
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    placeholder="Provide a high-level summary overview of this compliance rule context..."
                    className="w-full bg-[#050506] border border-neutral-850 p-3 text-xs text-white rounded font-sans focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-zinc-400 font-black">CLAUSES / BYLAWS (ONE PER LINE)</label>
                  <textarea
                    rows={4}
                    value={newRuleClauses}
                    onChange={(e) => setNewRuleClauses(e.target.value)}
                    placeholder="Enter discrete enforcement points...&#10;Point 1&#10;Point 2"
                    className="w-full bg-[#050506] border border-neutral-850 p-3 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div className="pt-2 gap-2 flex">
                  {editingRuleId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRuleId(null);
                        setNewRuleTitle("");
                        setNewRuleDesc("");
                        setNewRuleClauses("");
                      }}
                      className="flex-1 bg-zinc-850 hover:bg-zinc-800 text-xs text-white font-mono p-3 uppercase rounded font-black transition-colors"
                    >
                      CANCEL EDIT
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className={`${editingRuleId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#E10600] hover:bg-neutral-900'} flex-1 text-xs text-white hover:text-[#E10600] hover:border hover:border-[#E10600] font-mono p-3 uppercase rounded font-black transition-all flex items-center justify-center gap-1.5`}
                  >
                    <Sliders size={12} />
                    {editingRuleId ? "PUBLISH INCREMENT" : "PUBLISH COMPLIANCE"}
                  </button>
                </div>
              </form>
            </div>

            {/* COLUMN 2: ACTIVE RULES LISTING & APPEAL AUDITS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* COMPLIANCE RULES ADMIN MANAGER */}
              <div className="bg-[#101011] border border-neutral-900 p-6 rounded-2xl">
                <h3 className="text-xs font-black font-mono text-white tracking-wider pb-2 border-b border-neutral-900 mb-4 uppercase">
                  ACTIVE RULE SETS BY CATEGORY
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                  {rules.map((rule: any) => {
                    const categoryLabel = RULE_CATEGORIES.find((c) => c.id === rule.categoryId)?.label || rule.categoryId;
                    return (
                      <div
                        key={rule.id}
                        className="bg-[#080809] border border-neutral-900 rounded-xl p-3.5 flex justify-between items-center gap-4 text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{categoryLabel} • v{rule.version}</span>
                          <div className="font-bold text-[#E10600]">{rule.title}</div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingRuleId(rule.id);
                              setNewRuleTitle(rule.title);
                              setNewRuleDesc(rule.description);
                              setNewRuleClauses(rule.clauses.join("\n"));
                              onAlert("🔧 Edit request acknowledged. Edit form populated below.");
                            }}
                            className="p-1 px-3 bg-neutral-900 border border-neutral-805 hover:bg-neutral-800 text-zinc-300 rounded hover:text-white transition-colors"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 text-red-500 hover:bg-red-950/40 rounded transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE APPEALS AUDITING PANEL */}
              <div className="bg-[#101011] border border-neutral-900 p-6 rounded-2xl">
                <h3 className="text-xs font-black font-mono text-white tracking-wider pb-2 border-b border-neutral-900 mb-4 uppercase">
                  INCOMING USER EXCLUSION APPEALS
                </h3>

                <div className="space-y-4">
                  {penalties.filter((p) => p.appealStatus === "Pending").map((pen) => {
                    const categoryName = RULE_CATEGORIES.find((c) => c.id === pen.categoryId)?.label || pen.categoryId;
                    return (
                      <div key={pen.id} className="bg-[#050506] border border-neutral-900 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-yellow-500">
                            APPEAL ENTRANCE: {pen.userIgn}
                          </span>
                          <span className="text-[9px] text-zinc-550 font-mono">ID: {pen.id}</span>
                        </div>

                        <div className="text-[11px] font-sans text-neutral-400 bg-zinc-950 p-3 rounded">
                          <div className="text-[9px] font-mono text-zinc-500 uppercase">APPELLANT STATEMENT</div>
                          &quot;{pen.appealText}&quot;
                        </div>

                        <div className="pt-2 flex justify-end gap-2 text-xs font-mono font-bold">
                          <button
                            onClick={() => handleAdminRejectAppeal(pen.id)}
                            className="p-1 px-3 bg-neutral-900 border border-neutral-800 hover:bg-red-950/40 hover:border-red-900 hover:text-red-500 text-neutral-450 rounded mr-1 text-[10px] tracking-wide uppercase font-black transition-all"
                          >
                            DENY AND MAINTAIN
                          </button>
                          <button
                            onClick={() => handleAdminApproveAppeal(pen.id)}
                            className="p-1 px-3 bg-emerald-950 hover:bg-[#E10600] hover:text-white border border-emerald-900/30 text-emerald-400 rounded text-[10px] tracking-wide uppercase font-black transition-all"
                          >
                            REVOKE EXCLUSION
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {penalties.filter((p) => p.appealStatus === "Pending").length === 0 && (
                    <div className="text-center text-neutral-600 font-mono text-[11px] py-12">
                      No compliance override appeals pending verification.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: INTELLIGENT SENTINEL MODERATION SYSTEM */}
        {activeSubTab === "moderation" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <IntelligentModerationSystem
              currentIgn={currentIgn}
              onAlert={onAlert}
            />
          </motion.div>
        )}

        {/* TAB 6: CV MATCH RULES & LIVE CENTER */}
        {activeSubTab === "match-center" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CVMatchCenter
              currentIgn={currentIgn}
              onAlert={onAlert}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* DETAILED PRINTABLE VIEW / MODAL SCREEN */}
      {printDocument && (
        <div className="fixed inset-0 bg-neutral-950/95 flex justify-center items-center p-4 md:p-8 z-55 scroll-y-auto animate-fade-in text-neutral-950">
          <div className="bg-white border rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <button
              onClick={() => setPrintDocument(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-left space-y-6">
              <div className="border-b-2 border-black pb-4 text-center">
                <h1 className="text-2xl font-black italic tracking-wide uppercase font-sans">
                  {printDocument.org}
                </h1>
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1">OFFICIAL STRATEGIC COMPLIANCE DOCUMENT</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold font-sans uppercase underline">{printDocument.categoryInfo.label}</h2>
                <div className="grid grid-cols-2 text-xs font-mono text-zinc-650">
                  <div>REGISTRY: Crimson Vipers Law Node</div>
                  <div>VERSION: {printDocument.categoryRules[0]?.version || "1.0"}</div>
                  <div>LAST PRINTED: {printDocument.timestamp}</div>
                  <div>STATUS: RATIFIED & INTERNALLY ENFORCED</div>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t">
                {printDocument.categoryRules.map((r: any, idx: number) => (
                  <div key={r.id} className="space-y-2">
                    <h3 className="text-sm font-bold font-mono text-black uppercase">
                      ARTICLE {idx + 1}: {r.title}
                    </h3>
                    <p className="text-xs text-zinc-750 leading-relaxed font-sans italic">{r.description}</p>
                    <div className="space-y-1.5 pl-4">
                      {r.clauses.map((c: string, cIdx: number) => (
                        <div key={cIdx} className="text-xs font-mono text-neutral-800 flex gap-2">
                          <span>{idx + 1}.{cIdx + 1}</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-8 flex justify-between items-center text-[10px] font-mono text-neutral-500">
              <div>CRIMSON VIPERS ESPORTS &copy; 2026. ALL STRATEGIC PROPERTIES REGISTERED.</div>
              <button
                onClick={() => {
                  window.print();
                  onAlert("🖨️ Initialized printer system parameters");
                }}
                className="p-1.5 px-4 bg-black hover:bg-zinc-800 text-white text-xs font-mono font-bold uppercase rounded-lg transition-all"
              >
                PRINT SHEET NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG SHEET: LIFT EXCLUSION APPEAL FORM */}
      {appealTargetPen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-40 animate-fade-in">
          <div className="bg-[#101011] border border-neutral-900 rounded-2xl p-6 text-left max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-805">
              <h3 className="text-xs font-black font-mono text-white tracking-widest uppercase flex items-center gap-1.5">
                <Scale className="text-[#E10600]" size={15} />
                LODGE DISCIPLINARY EXCLUSION APPEAL
              </h3>
              <button onClick={() => setAppealTargetPen(null)} className="text-neutral-500 hover:text-white-0 border border-transparent">
                <X size={16} />
              </button>
            </div>

            <div className="bg-[#0e0e0f] p-3.5 rounded border border-neutral-900 text-xs text-neutral-400 font-mono space-y-1">
              <div><strong className="text-zinc-305 text-white">INFRACTION LOGGED:</strong> {appealTargetPen.reason}</div>
              <div><strong className="text-zinc-305 text-white">PENALTY CLASSIFICATION:</strong> {appealTargetPen.penaltyType} ({appealTargetPen.duration})</div>
            </div>

            <form onSubmit={handlePostAppeal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase font-mono tracking-widest text-zinc-400 font-black">STATEMENT & TECHNICAL VERIFICATION PROOFS</label>
                <textarea
                  required
                  rows={4}
                  value={appealTextBody}
                  onChange={(e) => setAppealTextBody(e.target.value)}
                  placeholder="Provide technical proofs to review e.g. handcam links, device screen recording IDs, or match telemetry files clearly..."
                  className="w-full bg-[#050506] border border-neutral-850 p-3 text-xs text-white rounded font-mono focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAppealTargetPen(null)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-xs font-mono font-bold uppercase p-2.5 rounded transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#E10600] text-white hover:bg-neutral-900 hover:text-red-500 hover:border-red-900 text-xs font-mono font-black uppercase tracking-widest p-2.5 rounded transition-all"
                >
                  SUBMIT APPEAL ENTRAND
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// --- GATE OVERLAY COMPONENT ---
interface RulesComplianceGateProps {
  categoryId: string;
  currentIgn: string;
  onAgree: () => void;
}

export function RulesComplianceGate({
  categoryId,
  currentIgn,
  onAgree
}: RulesComplianceGateProps) {
  const categoryInfo = RULE_CATEGORIES.find((c) => c.id === categoryId) || RULE_CATEGORIES[0];
  const activeRules = INITIAL_RULES_BASE.filter((r) => r.categoryId === categoryId);
  
  return (
    <div className="bg-[#0a0a0b] p-8 max-w-2xl mx-auto rounded-3xl border border-neutral-900 text-left space-y-6 shadow-[0_4px_30px_rgba(225,6,0,0.05)] relative overflow-hidden my-6">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 pb-4 border-b border-neutral-850">
        <Scale className="text-[#E10600] animate-pulse" size={28} />
        <div>
          <span className="p-0.5 px-2.5 bg-red-950/30 text-red-500 border border-red-900/40 text-[9px] font-mono uppercase tracking-widest font-black rounded-md">
            MANDATORY LOCK GATE
          </span>
          <h2 className="text-xl font-black uppercase text-white tracking-wide font-sans mt-0.5">
            AGREE TO {categoryInfo.label.toUpperCase()}
          </h2>
        </div>
      </div>

      <p className="text-xs text-neutral-400 font-sans leading-relaxed">
        Before accessing this secure quadrant of the platform, you must read, process, and agree to the current version guidelines listed below. Your acceptance token will be synced to the public compliance ledger.
      </p>

      <div className="space-y-4">
        {activeRules.map((rule) => (
          <div key={rule.id} className="bg-neutral-950 p-4 rounded-xl border border-neutral-900/80 space-y-3">
            <div>
              <h3 className="text-xs font-black font-mono tracking-wider text-[#E10600] uppercase">
                {rule.title}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1">{rule.description}</p>
            </div>

            <div className="space-y-1.5 pl-3 border-l border-neutral-850">
              {rule.clauses.map((clause, idx) => (
                <div key={idx} className="text-[11px] font-mono text-neutral-300 flex gap-2">
                  <span className="text-[#E10600] font-black">{idx + 1}.</span>
                  <span>{clause}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-neutral-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-[9px] text-zinc-550 font-mono uppercase leading-relaxed max-w-sm">
          TOKEN REGISTRY: {currentIgn} • VERSION v{activeRules[0]?.version || "1.0"} • CORESIGNAL STRICT ANTI-CHEAT ACTIVE
        </div>
        <button
          onClick={onAgree}
          className="bg-[#E10600] text-white hover:bg-neutral-900 hover:text-red-500 border border-transparent hover:border-[#E10600] p-2.5 px-6 rounded-xl font-mono text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2"
        >
          <CheckCircle2 size={13} />
          I AGREE & ENTER
        </button>
      </div>

    </div>
  );
}
