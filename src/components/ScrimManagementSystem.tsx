import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  Award,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Shield,
  Gamepad2,
  Flame,
  Filter,
  TrendingUp,
  Star,
  Users2,
  Clock,
  Lock,
  Unlock,
  Settings,
  Activity,
  FileText,
  CheckSquare,
  RefreshCw,
  UserCheck,
  Plus,
  Trash2,
  Edit,
  Share2,
  Send,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Play,
  RotateCcw,
  Zap,
  Download,
  AlertCircle,
  Camera,
  Upload,
  Image
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

// Interfaces & Types
import { UserRole, UserSession } from "../types";

export interface ScrimSession {
  id: string;
  title: string;
  game: string;
  mapName: string;
  maxSlots: number;
  vipSlots: number; // Reserved slots for VIPs
  registrationOpenTime: string; // "YYYY-MM-DDTHH:mm"
  registrationCloseTime: string; // "YYYY-MM-DDTHH:mm"
  roomReleaseTime: string; // "YYYY-MM-DDTHH:mm"
  scrimTime: string; // "YYYY-MM-DDTHH:mm"
  status: "Scheduling" | "Open" | "Closed" | "Completed";
  registeredTeams: ScrimTeamRegistration[];
  waitlistedTeams: ScrimTeamRegistration[];
  roomCode: {
    roomId: string;
    roomPass: string;
    released: boolean;
  };
  announcement: string;
  rulesText: string;
  region?: "Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania";
  crossRegionEnabled?: boolean;
  recommendedServer?: string;
  estimatedLatencyMs?: number;
  allowedTier?: "Elite" | "Challenger" | "Contender" | "Open";
  competitionTier?: "Elite" | "Challenger" | "Contender" | "Open";
  serverCompatibilityRule?: "Strict" | "Flexible";
  pmgcRulesActive?: boolean;
}

export interface TeamRegionProfile {
  teamName: string;
  captainIgn: string;
  primaryRegion: "Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania";
  continent: string;
  playerLocations: string[]; // e.g., ["South Africa", "Zimbabwe", "Kenya"]
  serverRegionPreference: string; // e.g. "Cape Town 1"
  accountHistoryRating: "Elite" | "Good" | "Average" | "Suspect";
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
}

export interface RegionTransferRequest {
  id: string;
  teamName: string;
  currentRegion: "Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania";
  requestedRegion: "Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania";
  reason: string;
  status: "Pending" | "Approved" | "Denied";
  timestamp: string;
  reviewedBy?: string;
}

export interface RegionalAdmin {
  name: string;
  regionScope: "Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania" | "Global";
  contact: string;
  activeLobbies: number;
}

export interface ScrimTeamRegistration {
  teamName: string;
  captainIgn: string;
  reputationScore: number;
  isVip: boolean;
  registeredAt: string; // Time string
  checkedIn: boolean;
  checkInStatus: "Pending" | "CheckedIn" | "Late" | "NoShow";
  promotedFromWaitlist?: boolean;
  promoExpiration?: string; // Time string if promoted
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: "Security" | "Scrim" | "RoomCode" | "Permission" | "Reputation";
  details: string;
}

export interface TeamReputation {
  teamName: string;
  ign: string;
  reliabilityScore: number; // 0 to 100
  history: {
    points: number;
    reason: string;
    date: string;
  }[];
}

interface NotificationMsg {
  id: string;
  timestamp: string;
  type: "Registration" | "Promotion" | "RoomCode" | "Reminder";
  title: string;
  message: string;
  channel: "website" | "email" | "bot" | "mobile";
  read: boolean;
}

export interface BannedTeam {
  id: string;
  teamName: string;
  reason: string;
  bannedAt: string;
  suspendedUntil: string;
}

export interface AutomatedAlertLog {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  message: string;
  recipient: string;
}

export interface MatchScreenshotSubmission {
  id: string;
  scrimId: string;
  teamName: string;
  matchNumber: number;
  placement: number;
  kills: number;
  points: number;
  screenshotUrl: string;
  submittedAt: string;
  submittedBy: string;
  verified: boolean;
}

const INITIAL_SCREENSHOTS: MatchScreenshotSubmission[] = [];

const INITIAL_BANNED_TEAMS: BannedTeam[] = [];

// Mock Initial Data
const INITIAL_TEAMS_REPUTATION: TeamReputation[] = [];

const INITIAL_SCRIMS: ScrimSession[] = [];

const INITIAL_AUDIT: AuditLogEntry[] = [];

const INITIAL_TEAM_REGIONS: TeamRegionProfile[] = [
  {
    teamName: "CV Crimson",
    captainIgn: "CV_Slayer_IGL",
    primaryRegion: "Africa",
    continent: "Africa",
    playerLocations: ["Zimbabwe", "South Africa", "Kenya"],
    serverRegionPreference: "Cape Town 1",
    accountHistoryRating: "Elite",
    verified: true,
    verifiedBy: "Kudzai 'Alpha'",
    verificationDate: "2026-06-01T12:00:00Z"
  },
  {
    teamName: "Sponsor Kings Roster",
    captainIgn: "VIP_Zeus",
    primaryRegion: "Europe",
    continent: "Europe",
    playerLocations: ["United Kingdom", "Germany", "France"],
    serverRegionPreference: "London 2",
    accountHistoryRating: "Elite",
    verified: true,
    verifiedBy: "Farai 'Raptor'",
    verificationDate: "2026-06-02T12:00:00Z"
  },
  {
    teamName: "Hydra Eclipse",
    captainIgn: "Hydra_Focus",
    primaryRegion: "Africa",
    continent: "Africa",
    playerLocations: ["South Africa", "Nigeria", "Ghana"],
    serverRegionPreference: "Cape Town 1",
    accountHistoryRating: "Good",
    verified: true,
    verifiedBy: "Kudzai 'Alpha'",
    verificationDate: "2026-06-03T10:00:00Z"
  },
  {
    teamName: "Frost Giants",
    captainIgn: "Frost_Odin",
    primaryRegion: "Europe",
    continent: "Europe",
    playerLocations: ["Sweden", "Norway", "Finland"],
    serverRegionPreference: "Stockholm 1",
    accountHistoryRating: "Good",
    verified: true,
    verifiedBy: "Farai 'Raptor'",
    verificationDate: "2026-06-04T12:00:00Z"
  },
  {
    teamName: "Team Toxic",
    captainIgn: "ToxicCoder_99",
    primaryRegion: "North America",
    continent: "North America",
    playerLocations: ["United States", "Canada"],
    serverRegionPreference: "N. Virginia",
    accountHistoryRating: "Suspect",
    verified: false
  },
  {
    teamName: "Hacker Clan",
    captainIgn: "HackerOne",
    primaryRegion: "Asia",
    continent: "Asia",
    playerLocations: ["China", "India"],
    serverRegionPreference: "Singapore 1",
    accountHistoryRating: "Suspect",
    verified: false
  },
  {
    teamName: "Desert Hawks",
    captainIgn: "ArabianKnight",
    primaryRegion: "Middle East",
    continent: "Asia",
    playerLocations: ["United Arab Emirates", "Saudi Arabia"],
    serverRegionPreference: "Dubai 2",
    accountHistoryRating: "Good",
    verified: true,
    verifiedBy: "Tinashe 'Slayer'",
    verificationDate: "2026-06-05T08:15:00Z"
  }
];

const INITIAL_TRANSFER_REQUESTS: RegionTransferRequest[] = [];

const INITIAL_REGIONAL_ADMINS: RegionalAdmin[] = [
  { name: "Kudzai 'Alpha'", regionScope: "Africa", contact: "alpha@crimsonvipers.gm", activeLobbies: 2 },
  { name: "Farai 'Raptor'", regionScope: "Europe", contact: "raptor@crimsonvipers.gm", activeLobbies: 1 },
  { name: "Pride 'Lethal'", regionScope: "Asia", contact: "lethal@crimsonvipers.gm", activeLobbies: 1 },
  { name: "Sponsor Zeus", regionScope: "North America", contact: "zeus@kings.esports", activeLobbies: 0 },
  { name: "Tinashe 'Slayer'", regionScope: "Global", contact: "slayer@crimsonvipers.gm", activeLobbies: 4 }
];

interface Props {
  session: UserSession;
  setSystemAlertMessage: (msg: string | null) => void;
  awardXp: (amount: number) => void;
}

export default function ScrimManagementSystem({ session, setSystemAlertMessage, awardXp }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<"listings" | "room" | "control" | "owner" | "reputation" | "stats" | "notifications" | "regionSys">(() => {
    const saved = localStorage.getItem("cv_scrims_active_subtab");
    if (saved && ["listings", "room", "control", "owner", "reputation", "stats", "notifications", "regionSys"].includes(saved)) {
      return saved as any;
    }
    return "listings";
  });

  useEffect(() => {
    const handleSubTabChange = (e: any) => {
      if (e.detail && ["listings", "room", "control", "owner", "reputation", "stats", "notifications", "regionSys"].includes(e.detail)) {
        setActiveSubTab(e.detail);
      }
    };
    window.addEventListener("cv_set_scrim_subtab" as any, handleSubTabChange);
    return () => {
      window.removeEventListener("cv_set_scrim_subtab" as any, handleSubTabChange);
    };
  }, []);
  
  // Real-time local states backed by LocalStorage for total user reliability
  const [scrims, setScrims] = useState<ScrimSession[]>(() => {
    const saved = localStorage.getItem("cv_scrim_sessions");
    return saved ? JSON.parse(saved) : INITIAL_SCRIMS;
  });

  const [reputations, setReputations] = useState<TeamReputation[]>(() => {
    const saved = localStorage.getItem("cv_team_reputations");
    return saved ? JSON.parse(saved) : INITIAL_TEAMS_REPUTATION;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem("cv_scrim_audit_logs");
    return saved ? JSON.parse(saved) : INITIAL_AUDIT;
  });

  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);

  // Special Permissions Managed by Owner Console
  const [roomManagers, setRoomManagers] = useState<string[]>(() => {
    const saved = localStorage.getItem("cv_room_managers");
    return saved ? JSON.parse(saved) : ["Owner", "Head Admin", "Team Captain"];
  });

  // Owner's Custom Active Command state
  const [ownerCommand, setOwnerCommand] = useState<string>("");
  const [ownerCommandResult, setOwnerCommandResult] = useState<string>("");

  // Create Scrim form values
  const [newTitle, setNewTitle] = useState("");
  const [newMap, setNewMap] = useState("Erangel");
  const [newMaxSlots, setNewMaxSlots] = useState(12);
  const [newVipSlots, setNewVipSlots] = useState(2);
  const [newRegOpenTime, setNewRegOpenTime] = useState("2026-06-09T08:30");
  const [newRegCloseTime, setNewRegCloseTime] = useState("2026-06-09T17:30");
  const [newRoomReleaseTime, setNewRoomReleaseTime] = useState("2026-06-09T18:45");
  const [newScrimTime, setNewScrimTime] = useState("2026-06-09T19:00");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [newRules, setNewRules] = useState("");
  const [newPmgcRulesActive, setNewPmgcRulesActive] = useState<boolean>(true);

  // Regional System States
  const [teamProfiles, setTeamProfiles] = useState<TeamRegionProfile[]>(() => {
    const saved = localStorage.getItem("cv_team_region_profile");
    return saved ? JSON.parse(saved) : INITIAL_TEAM_REGIONS;
  });

  const [transferRequests, setTransferRequests] = useState<RegionTransferRequest[]>(() => {
    const saved = localStorage.getItem("cv_team_region_transfers");
    return saved ? JSON.parse(saved) : INITIAL_TRANSFER_REQUESTS;
  });

  const [regionalAdmins, setRegionalAdmins] = useState<RegionalAdmin[]>(() => {
    const saved = localStorage.getItem("cv_regional_admins");
    return saved ? JSON.parse(saved) : INITIAL_REGIONAL_ADMINS;
  });

  const [verificationStrictness, setVerificationStrictness] = useState<"Strict" | "Flexible">(() => {
    const saved = localStorage.getItem("cv_verification_strictness");
    return saved ? JSON.parse(saved) : "Strict";
  });

  const [selectedUserTeam, setSelectedUserTeam] = useState<string>("CV Crimson");

  // Create Scrim regional attributes
  const [newScrimRegion, setNewScrimRegion] = useState<"Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania">("Africa");
  const [newCrossRegionEnabled, setNewCrossRegionEnabled] = useState<boolean>(false);
  const [newRecommendedServer, setNewRecommendedServer] = useState<string>("Cape Town 1");
  const [newEstimatedLatencyMs, setNewEstimatedLatencyMs] = useState<number>(25);
  const [newAllowedTier, setNewAllowedTier] = useState<"Elite" | "Challenger" | "Contender" | "Open">("Open");
  const [newServerCompatibilityRule, setNewServerCompatibilityRule] = useState<"Strict" | "Flexible">("Strict");

  // Region Browser view states
  const [regionBrowserSelected, setRegionBrowserSelected] = useState<"Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania">("Africa");

  // Dashboard filter states
  const [dashContinent, setDashContinent] = useState<string>("All");
  const [dashCountry, setDashCountry] = useState<string>("All");
  const [dashGameTitle, setDashGameTitle] = useState<string>("All");
  const [dashSkillLevel, setDashSkillLevel] = useState<string>("All");
  const [dashCompetitionTier, setDashCompetitionTier] = useState<string>("All");

  // Transfer request form states
  const [transferTargetRegion, setTransferTargetRegion] = useState<"Africa" | "Europe" | "Asia" | "Middle East" | "North America" | "South America" | "Oceania">("Europe");
  const [transferReason, setTransferReason] = useState<string>("");

  // Latency Diagnostic states
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagLogs, setDiagLogs] = useState<string[]>([]);

  // Regional Subview selector state
  const [regionSubView, setRegionSubView] = useState<"dash" | "profiles" | "diagnostics" | "policy">("dash");

  // Notifications toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [botEnabled, setBotEnabled] = useState(true);

  // Filter lists
  const [listingsFilter, setListingsFilter] = useState<"All" | "Open" | "WaitlistActive" | "Completed">("All");

  // Promoted waitlist team validation timers
  const [promotedWaitlistState, setPromotedWaitlistState] = useState<{
    scrimId: string;
    teamName: string;
    expiresInSeconds: number;
    timerActive: boolean;
  } | null>(null);

  // Time metrics tracking
  const [currentMockTime, setCurrentMockTime] = useState<Date>(new Date("2026-06-09T07:43:08Z"));

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem("cv_scrim_sessions", JSON.stringify(scrims));
  }, [scrims]);

  useEffect(() => {
    localStorage.setItem("cv_team_reputations", JSON.stringify(reputations));
  }, [reputations]);

  useEffect(() => {
    localStorage.setItem("cv_scrim_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("cv_room_managers", JSON.stringify(roomManagers));
  }, [roomManagers]);

  useEffect(() => {
    localStorage.setItem("cv_team_region_profile", JSON.stringify(teamProfiles));
  }, [teamProfiles]);

  useEffect(() => {
    localStorage.setItem("cv_team_region_transfers", JSON.stringify(transferRequests));
  }, [transferRequests]);

  useEffect(() => {
    localStorage.setItem("cv_regional_admins", JSON.stringify(regionalAdmins));
  }, [regionalAdmins]);

  useEffect(() => {
    localStorage.setItem("cv_verification_strictness", JSON.stringify(verificationStrictness));
  }, [verificationStrictness]);

  // Screenshot submissions states
  const [screenshotSubmissions, setScreenshotSubmissions] = useState<MatchScreenshotSubmission[]>(() => {
    const saved = localStorage.getItem("cv_screenshot_submissions");
    return saved ? JSON.parse(saved) : INITIAL_SCREENSHOTS;
  });

  useEffect(() => {
    localStorage.setItem("cv_screenshot_submissions", JSON.stringify(screenshotSubmissions));
  }, [screenshotSubmissions]);

  // Temporary form states per scrim (keyed by scrimId)
  const [ssTeam, setSsTeam] = useState<Record<string, string>>({});
  const [ssMatchNum, setSsMatchNum] = useState<Record<string, number>>({});
  const [ssPlacement, setSsPlacement] = useState<Record<string, number>>({});
  const [ssKills, setSsKills] = useState<Record<string, number>>({});
  const [ssImage, setSsImage] = useState<Record<string, string>>({});

  // Smart Auto-Decline & Banned/Suspended Teams State
  const [smartAutoDecline, setSmartAutoDecline] = useState<boolean>(() => {
    const saved = localStorage.getItem("cv_smart_auto_decline");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [bannedTeams, setBannedTeams] = useState<BannedTeam[]>(() => {
    const saved = localStorage.getItem("cv_banned_teams");
    return saved ? JSON.parse(saved) : INITIAL_BANNED_TEAMS;
  });

  const [banInputTeamName, setBanInputTeamName] = useState("");
  const [banInputReason, setBanInputReason] = useState("");
  const [banInputDuration, setBanInputDuration] = useState("Permanent"); // Permanent, 1, 3, 7, 30

  useEffect(() => {
    localStorage.setItem("cv_smart_auto_decline", JSON.stringify(smartAutoDecline));
  }, [smartAutoDecline]);

  useEffect(() => {
    localStorage.setItem("cv_banned_teams", JSON.stringify(bannedTeams));
  }, [bannedTeams]);

  // Automated Alert Notification Log state for captains' accountability
  const [automatedAlertsLog, setAutomatedAlertsLog] = useState<AutomatedAlertLog[]>(() => {
    const saved = localStorage.getItem("cv_automated_alerts_log");
    return saved ? JSON.parse(saved) : [
      {
        id: "alert-init-1",
        timestamp: "2026-06-09T07:15:00.000Z",
        type: "Registration",
        title: "Active Slot Secured",
        message: "Team 'ZIM Warrior X' has reserved an active slot in 'Daily PMCO PMGC Level Trials'. Registration confirmed.",
        recipient: "Captain: ZIM Warrior X"
      },
      {
        id: "alert-init-2",
        timestamp: "2026-06-09T07:22:15.000Z",
        type: "Promotion",
        title: "Waitlist Promotion Pending Close",
        message: "Team 'Hacker Clan' copy promoted to claim empty slot in session. Roster has 60 seconds to claim or auto-decline passes.",
        recipient: "Captain: Hacker Clan"
      },
      {
        id: "alert-init-3",
        timestamp: "2026-06-09T07:30:00.000Z",
        type: "RoomCode",
        title: "Room Coordinates Released",
        message: "Match lobby IDs have been made visible to all captains. Coordinates: 94200427, Pass: vipersX9.",
        recipient: "All Checked-In Captains"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("cv_automated_alerts_log", JSON.stringify(automatedAlertsLog));
  }, [automatedAlertsLog]);

  const [selectedAlertFilter, setSelectedAlertFilter] = useState<string>("All");
  const [alertSearchQuery, setAlertSearchQuery] = useState<string>("");

  // Handle ticking timer simulations for waitlist promotability and mock time progression
  useEffect(() => {
    const interval = setInterval(() => {
      // Step simulated mock time by 1 second
      setCurrentMockTime(prev => new Date(prev.getTime() + 1000));

      // Handle promoted waitlist visual feedback ticking
      setPromotedWaitlistState(prev => {
        if (!prev || !prev.timerActive) return null;
        if (prev.expiresInSeconds <= 1) {
          // Timer expired! Trigger automatic decline & pass to next waitlisted team
          handleAutomaticallyDeclinePromotion(prev.scrimId, prev.teamName);
          return null;
        }
        return {
          ...prev,
          expiresInSeconds: prev.expiresInSeconds - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [promotedWaitlistState]);

  // Log audit helper
  const addAuditLog = (action: string, category: AuditLogEntry["category"], details: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: currentMockTime.toISOString(),
      actor: session.ign,
      action,
      category,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Add system notifications helper
  const triggerNotification = (
    type: NotificationMsg["type"],
    title: string,
    message: string
  ) => {
    const newMsgs: NotificationMsg[] = [];
    
    // Automatically determine appropriate recipient based on the notification content
    let recipient = "All Team Captains";
    if (message.includes('Team "')) {
      const match = message.match(/Team "(.*?)"/);
      if (match && match[1]) {
        recipient = `Captain: ${match[1]}`;
      }
    } else if (message.includes('team "')) {
      const match = message.match(/team "(.*?)"/);
      if (match && match[1]) {
        recipient = `Captain: ${match[1]}`;
      }
    } else if (title.includes("Reputation") || message.includes("reputation")) {
      recipient = "Specific Team Captain";
    } else if (type === "RoomCode") {
      recipient = "All Checked-In Captains";
    }

    // Capture in Automated Alerts accountability ledger
    const newLogItem: AutomatedAlertLog = {
      id: `alert-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: currentMockTime.toISOString(),
      type,
      title,
      message,
      recipient
    };
    setAutomatedAlertsLog(prev => [newLogItem, ...prev]);
    
    if (soundEnabled) {
      newMsgs.push({
        id: `noti-${Date.now()}-web`,
        timestamp: currentMockTime.toLocaleTimeString(),
        type,
        title,
        message,
        channel: "website",
        read: false
      });
    }
    if (emailEnabled) {
      newMsgs.push({
        id: `noti-${Date.now()}-mail`,
        timestamp: currentMockTime.toLocaleTimeString(),
        type,
        title,
        message,
        channel: "email",
        read: false
      });
    }
    if (botEnabled) {
      newMsgs.push({
        id: `noti-${Date.now()}-bot`,
        timestamp: currentMockTime.toLocaleTimeString(),
        type,
        title,
        message,
        channel: "bot",
        read: false
      });
    }

    setNotifications(prev => [...newMsgs, ...prev]);
  };

  // 1. ADVANCED REGISTRATION LOGIC

  // Claim a slot in a scrim session
  const handleRegisterTeam = (scrimId: string, customTeamName?: string, isVipRegistry = false) => {
    const scrim = scrims.find(s => s.id === scrimId);
    if (!scrim) return;

    // Check if registration window is currently open (relative to simulated clock)
    const openTime = new Date(scrim.registrationOpenTime);
    const closeTime = new Date(scrim.registrationCloseTime);
    
    if (currentMockTime < openTime) {
      setSystemAlertMessage(`⏳ ERROR: Scrim registration is not open yet! Count down to launch.`);
      return;
    }
    if (currentMockTime > closeTime) {
      setSystemAlertMessage(`❌ ERROR: Scrim registration window has closed.`);
      return;
    }

    const teamToRegister = customTeamName || session.ign.split("_")[0] || "Guest Clan";
    
    // SMART AUTO-DECLINE FILTER (BANNED/SUSPENDED ROSTER MATCHMAKER BLOCK)
    const teamBan = bannedTeams.find(
      b => b.teamName.trim().toLowerCase() === teamToRegister.trim().toLowerCase()
    );
    const isSuspendedOrBanned = teamBan && (
      teamBan.suspendedUntil === "Permanent" ||
      new Date(teamBan.suspendedUntil) > currentMockTime
    );

    if (isSuspendedOrBanned) {
      if (smartAutoDecline) {
        setSystemAlertMessage(`🚫 SMART AUTO-DECLINE: Team "${teamToRegister}" registration auto-rejected! Cause: ${teamBan.reason}. Ban state: ${teamBan.suspendedUntil === "Permanent" ? "PERMANENT" : `SUSPENDED until ${new Date(teamBan.suspendedUntil).toLocaleString()}`}`);
        addAuditLog(
          "Auto-Decline Register",
          "Security",
          `Auto-rejected registration query from banned/suspended team: ${teamToRegister}. Reason: ${teamBan.reason}`
        );
        triggerNotification(
          "Registration",
          "Auto-Decline Triggered",
          `Blocked registration query from ${teamToRegister} (Active restriction).`
        );
        return;
      } else {
        // If Smart Auto-Decline is deactivated, issue custom warning logging inside platform security log and proceed!
        addAuditLog(
          "Auto-Decline Override",
          "Security",
          `Warning: Banned team "${teamToRegister}" registered while Smart Auto-Decline was deactivated!`
        );
      }
    }
    
    // Check if team is already registered
    const alreadyRegistered = scrim.registeredTeams.some(t => t.teamName === teamToRegister) || 
                              scrim.waitlistedTeams.some(t => t.teamName === teamToRegister);
    if (alreadyRegistered) {
      setSystemAlertMessage(`❌ Team "${teamToRegister}" already requested a slot in this scrim.`);
      return;
    }

    // Get team reputation info
    const teamRep = reputations.find(r => r.teamName === teamToRegister) || { reliabilityScore: 80 };
    
    // Fall back check for registration lock due to awful reputation score (< 50)
    if (teamRep.reliabilityScore < 50) {
      setSystemAlertMessage(`⛔ REGISTRATION BLOCKED: Roster reliability score (${teamRep.reliabilityScore}%) is below priority lock thresholds.`);
      return;
    }

    // REGIONAL COMPATIBILITY & VERIFICATION SYSTEM ENGINE
    const scrimRegion = scrim.region || "Africa";
    let profile = teamProfiles.find(p => p.teamName.trim().toLowerCase() === teamToRegister.trim().toLowerCase());
    
    if (!profile) {
      // Lazily seed a profile for unrecognized or new teams to guarantee uptime
      const matchesAfrica = scrimRegion === "Africa";
      profile = {
        teamName: teamToRegister,
        captainIgn: customTeamName ? `Capt_${customTeamName}` : session.ign,
        primaryRegion: matchesAfrica ? "Africa" : "Europe",
        continent: matchesAfrica ? "Africa" : "Europe",
        playerLocations: matchesAfrica ? ["Zimbabwe", "South Africa"] : ["United Kingdom", "Germany"],
        serverRegionPreference: matchesAfrica ? "Cape Town 1" : "London 2",
        accountHistoryRating: "Good",
        verified: false
      };
      setTeamProfiles(prev => [...prev, profile!]);
    }

    const primaryRegionMatch = profile.primaryRegion === scrimRegion;
    const isCrossRegionEnabled = scrim.crossRegionEnabled || false;

    // Check roster geographical locations compatibility percentage
    const matchingPlayersCount = profile.playerLocations.filter(loc => {
      const l = loc.toLowerCase();
      if (scrimRegion === "Africa" && ["zimbabwe", "south africa", "kenya", "nigeria", "ghana"].includes(l)) return true;
      if (scrimRegion === "Europe" && ["united kingdom", "germany", "france", "sweden", "norway", "finland", "italy"].includes(l)) return true;
      if (scrimRegion === "Asia" && ["china", "india", "singapore", "japan", "korea"].includes(l)) return true;
      if (scrimRegion === "Middle East" && ["united arab emirates", "saudi arabia", "dubai", "kuwait", "qatar"].includes(l)) return true;
      if (scrimRegion === "North America" && ["united states", "canada", "mexico"].includes(l)) return true;
      if (scrimRegion === "South America" && ["brazil", "argentina", "colombia"].includes(l)) return true;
      if (scrimRegion === "Oceania" && ["australia", "new zealand", "aus"].includes(l)) return true;
      return false;
    }).length;

    const rosterGeoMatchPct = Math.round((matchingPlayersCount / Math.max(1, profile.playerLocations.length)) * 100);

    // Simulate reactive host routing latency details
    let simulatedPing = 20;
    if (!primaryRegionMatch) {
      simulatedPing = 175 + Math.floor(Math.random() * 70); // High Trans-oceanic delay
    } else {
      simulatedPing = 12 + Math.floor(Math.random() * 20); // Low Regional routing ping
    }

    const isEligible = primaryRegionMatch && (rosterGeoMatchPct >= 50) && (profile.accountHistoryRating !== "Suspect");
    let isFlaggedForReview = false;

    if (!isEligible && !isCrossRegionEnabled) {
      if (verificationStrictness === "Strict") {
        setSystemAlertMessage(
          `⛔ REGISTRATION BLOCKED (Strict Region Verification Lock):\n` +
          `Team "${teamToRegister}" failed regional compatibility rules for the "${scrimRegion}" series.\n` +
          `• Primary Region: ${profile.primaryRegion} (Expected: ${scrimRegion})\n` +
          `• Geolocation Match: ${rosterGeoMatchPct}% of active roster in ${scrimRegion}\n` +
          `• Account History Rating: ${profile.accountHistoryRating} Checkmarks\n` +
          `• Host Connection latency: ${simulatedPing}ms (Estimated Jitter Warning)\n\n` +
          `Organizers must enable Cross-Region participation or switch to Flexible verification mode to override.`
        );
        addAuditLog("Region Lock Block", "Security", `Blocked out-of-region team "${teamToRegister}" from joining "${scrim.title}".`);
        return;
      } else {
        // Flexible Mode: Flag and prompt warning
        isFlaggedForReview = true;
        setSystemAlertMessage(
          `⚠️ GEOGRAPHIC WARNING (Flexible Verification Active):\n` +
          `Team "${teamToRegister}" does not meet standard parameters for "${scrimRegion}" (Estimated Ping: ${simulatedPing}ms). ` +
          `Your registration is accepted but flagged for manual administrator review.`
        );
        addAuditLog("Region Flag Warning", "Scrim", `Flagged out-of-region team "${teamToRegister}" registration in "${scrim.title}". Ping estimate is ${simulatedPing}ms.`);
      }
    }

    const newRosterEntry: ScrimTeamRegistration & {
      regionalStatus?: "Flagged" | "Approved";
      simulatedPing?: number;
      geoMatchPct?: number;
    } = {
      teamName: teamToRegister,
      captainIgn: customTeamName ? `Capt_${customTeamName}` : session.ign,
      reputationScore: teamRep.reliabilityScore,
      isVip: isVipRegistry,
      registeredAt: currentMockTime.toISOString(),
      checkedIn: false,
      checkInStatus: "Pending",
      regionalStatus: isFlaggedForReview ? "Flagged" : "Approved",
      simulatedPing: simulatedPing,
      geoMatchPct: rosterGeoMatchPct
    };

    let updatedScrims = scrims.map(s => {
      if (s.id !== scrimId) return s;

      const totalRegisteredLength = s.registeredTeams.length;
      const slotThreshold = s.maxSlots;

      if (totalRegisteredLength < slotThreshold) {
        // We have empty slot, register public or VIP
        return {
          ...s,
          registeredTeams: [...s.registeredTeams, newRosterEntry]
        };
      } else {
        // Place in waitlist queue
        return {
          ...s,
          waitlistedTeams: [...s.waitlistedTeams, newRosterEntry]
        };
      }
    });

    setScrims(updatedScrims);
    awardXp(15);

    const isQueued = scrim.registeredTeams.length >= scrim.maxSlots;
    if (isQueued) {
      setSystemAlertMessage(`📝 Slots filled! Team "${teamToRegister}" was placed into the Waitlist (Queue Spot #${scrim.waitlistedTeams.length + 1}).`);
      addAuditLog("Waitlist Registration", "Scrim", `Team "${teamToRegister}" queued into ${scrim.title} waitlist.`);
      triggerNotification("Registration", "Waitlist Registered", `Team "${teamToRegister}" entered waitlist queue due to slot saturation.`);
    } else {
      setSystemAlertMessage(`✅ Slot Reserved! Team "${teamToRegister}" has claimed an active scrim slot.`);
      addAuditLog("Register Slot Claimed", "Scrim", `Team "${teamToRegister}" reserved active slot in ${scrim.title}.`);
      triggerNotification("Registration", "Active Slot Secured", `Team "${teamToRegister}" claimed slot. Registration confirmed.`);
    }
  };

  // Cancel slot: promoting waitlist team immediately if empty slots emerge
  const handleCancelRegistration = (scrimId: string, teamName: string) => {
    const scrim = scrims.find(s => s.id === scrimId);
    if (!scrim) return;

    let isPromoting = false;
    let fallbackTeam: ScrimTeamRegistration | null = null;

    const updatedScrims = scrims.map(s => {
      if (s.id !== scrimId) return s;

      // Filter out canceled team
      const isRegistered = s.registeredTeams.some(t => t.teamName === teamName);
      
      let nextRegistered = s.registeredTeams.filter(t => t.teamName !== teamName);
      let nextWaitlist = s.waitlistedTeams.filter(t => t.teamName !== teamName);

      if (isRegistered && s.waitlistedTeams.length > 0) {
        // Promote first waitlisted team to pending confirmation state
        fallbackTeam = s.waitlistedTeams[0];
        isPromoting = true;

        // Auto move to registered slots immediately to claim, marked as promoted
        nextRegistered = [...nextRegistered, {
          ...fallbackTeam!,
          promotedFromWaitlist: true,
          promoExpiration: new Date(currentMockTime.getTime() + 60000).toISOString() // 60s config
        }];
        // Drop from waitlist
        nextWaitlist = s.waitlistedTeams.slice(1);
      }

      return {
        ...s,
        registeredTeams: nextRegistered,
        waitlistedTeams: nextWaitlist
      };
    });

    setScrims(updatedScrims);
    addAuditLog("Cancel Registration", "Scrim", `Team "${teamName}" cancelled registration for ${scrim.title}.`);
    
    if (isPromoting && fallbackTeam) {
      const promotedTeam = (fallbackTeam as ScrimTeamRegistration).teamName;
      setSystemAlertMessage(`⚠️ Team "${teamName}" cancelled. Waitlister "${promotedTeam}" promoted! Awaiting confirmation.`);
      
      // Arm the confirmation ticking timer
      setPromotedWaitlistState({
        scrimId,
        teamName: promotedTeam,
        expiresInSeconds: 60,
        timerActive: true
      });

      // Blast smart notifications across website, CV Bot, etc.
      triggerNotification(
        "Promotion",
        "Waitlist Promotion Pending Close",
        `Team "${promotedTeam}" has been promoted to claim empty slot! 60s remaining to accept.`
      );
    } else {
      setSystemAlertMessage(`✅ Registration canceled for Team "${teamName}" successfully.`);
    }
  };

  // Handle Waitlist Promotion Confirm/Decline
  const handleConfirmPromotion = (scrimId: string, teamName: string) => {
    // Confirm simply clears the pending promotions timers
    setPromotedWaitlistState(null);
    setSystemAlertMessage(`🎉 Championship access accepted! Team "${teamName}" confirmed their promoted scrim slot.`);
    addAuditLog("Promote Confirmed", "Scrim", `Team "${teamName}" accepted waitlist promotion.`);
    triggerNotification("Promotion", "Promotion Accepted", `Team "${teamName}" responded and confirmed spot.`);
    awardXp(10);
  };

  const handleDeclinePromotion = (scrimId: string, teamName: string) => {
    setPromotedWaitlistState(null);
    // Remove the declining team and pull the next candidate
    setSystemAlertMessage(`❌ Team "${teamName}" declined promotion. Handing off to the next waitlisted team.`);
    addAuditLog("Promote Declined", "Scrim", `Team "${teamName}" rejected promotion option.`);
    
    // We treat decline by filtering them out of registered, then executing slot cancel logic to trigger next promotion cascade!
    let nextWaitlisted: ScrimTeamRegistration | null = null;
    const updated = scrims.map(s => {
      if (s.id !== scrimId) return s;
      const strippedReg = s.registeredTeams.filter(t => t.teamName !== teamName);
      let waitlist = s.waitlistedTeams;
      
      if (waitlist.length > 0) {
        nextWaitlisted = waitlist[0];
        waitlist = waitlist.slice(1);
      }

      return {
        ...s,
        registeredTeams: nextWaitlisted ? [...strippedReg, {
          ...nextWaitlisted!,
          promotedFromWaitlist: true,
          promoExpiration: new Date(currentMockTime.getTime() + 60000).toISOString()
        }] : strippedReg,
        waitlistedTeams: waitlist
      };
    });

    setScrims(updated);

    if (nextWaitlisted) {
      const nextTeamName = (nextWaitlisted as ScrimTeamRegistration).teamName;
      setPromotedWaitlistState({
        scrimId,
        teamName: nextTeamName,
        expiresInSeconds: 60,
        timerActive: true
      });
      triggerNotification(
        "Promotion",
        "Waitlist Cascaded Promotion",
        `New promotion pending for team "${nextTeamName}". 60s to confirm.`
      );
    }
  };

  // Internally timed automatic decline
  const handleAutomaticallyDeclinePromotion = (scrimId: string, teamName: string) => {
    handleDeclinePromotion(scrimId, teamName);
    triggerNotification("Promotion", "Timeout Auto-Pass", `Team "${teamName}" promotion expired due to inactivity.`);
  };

  // 2. SCRIM CONTROL ACTIONS (Admin commands)

  const handleCreateNewScrim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setSystemAlertMessage("❌ Specify a scrim title.");
      return;
    }

    const isAuthorized = ["Owner", "Head Admin", "Admin", "Team Captain"].includes(session.role);
    if (!isAuthorized) {
      setSystemAlertMessage("❌ Access Denied: You do not possess Scrim Scheduling credentials.");
      return;
    }

    // Geographically scoped administrative checking
    if (session.role === "Admin" || session.role === "Moderator" || session.role === "Team Captain") {
      const adminScope = regionalAdmins.find(
        a => a.name.toLowerCase().includes(session.ign.toLowerCase()) || 
             session.ign.toLowerCase().includes(a.name.toLowerCase())
      );
      if (adminScope && adminScope.regionScope !== "Global" && adminScope.regionScope !== newScrimRegion) {
        setSystemAlertMessage(`❌ Scoped Region Lock: Your administrative privileges are restricted to the "${adminScope.regionScope}" region. You cannot schedule scrims in "${newScrimRegion}".`);
        return;
      }
    }

    const created: ScrimSession = {
      id: `scrim-${Date.now()}`,
      title: newTitle,
      game: "PUBG Mobile",
      mapName: newMap,
      maxSlots: newMaxSlots,
      vipSlots: newVipSlots,
      registrationOpenTime: newRegOpenTime,
      registrationCloseTime: newRegCloseTime,
      roomReleaseTime: newRoomReleaseTime,
      scrimTime: newScrimTime,
      status: "Open",
      registeredTeams: [],
      waitlistedTeams: [],
      roomCode: {
        roomId: (Math.floor(Math.random() * 9000000) + 1000000).toString(),
        roomPass: "CV" + Math.floor(Math.random() * 9000),
        released: false
      },
      announcement: newAnnouncement || "Default daily tactical session announcement.",
      rulesText: newRules || "Respect host boundaries. Active check-in mandatory before entry.",
      region: newScrimRegion,
      crossRegionEnabled: newCrossRegionEnabled,
      recommendedServer: newRecommendedServer,
      estimatedLatencyMs: newEstimatedLatencyMs,
      allowedTier: newAllowedTier,
      competitionTier: newAllowedTier,
      serverCompatibilityRule: newServerCompatibilityRule,
      pmgcRulesActive: newPmgcRulesActive
    };

    setScrims(prev => [created, ...prev]);
    addAuditLog("Create Scrim Profile", "Scrim", `Spawned new regional scrim: "${newTitle}" assigned to ${newScrimRegion} (${newRecommendedServer}).`);
    setSystemAlertMessage(`🎉 Scrim Created! ${newScrimRegion} lobby published on ${newRecommendedServer} (${newEstimatedLatencyMs}ms average regional latency estimate).`);
    
    // Clear form
    setNewTitle("");
    setNewAnnouncement("");
    setNewRules("");
    awardXp(30);
  };

  const handleUpdateRules = (scrimId: string, rules: string) => {
    setScrims(prev => prev.map(s => s.id === scrimId ? { ...s, rulesText: rules } : s));
    addAuditLog("Modify Rules Data", "Scrim", `Updated rules constraints on Scrim ID: ${scrimId}`);
    setSystemAlertMessage("📋 Custom match rules uploaded successfully.");
  };

  const handlePublishAnnouncement = (scrimId: string, text: string) => {
    setScrims(prev => prev.map(s => s.id === scrimId ? { ...s, announcement: text } : s));
    addAuditLog("Publish Scrim News", "Scrim", `Broadcasted message update for Scrim ID: ${scrimId}`);
    setSystemAlertMessage("📢 Announcement published across match board.");
  };

  // Attendance checking status triggers
  const handleUpdateAttendanceStatus = (scrimId: string, teamName: string, status: ScrimTeamRegistration["checkInStatus"]) => {
    setScrims(prev => prev.map(s => {
      if (s.id !== scrimId) return s;

      const reg = s.registeredTeams.map(t => {
        if (t.teamName !== teamName) return t;
        const wasCheckedIn = status === "CheckedIn";
        return {
          ...t,
          checkedIn: wasCheckedIn,
          checkInStatus: status
        };
      });

      return {
        ...s,
        registeredTeams: reg
      };
    }));

    // Penalty check: missing check-in triggers reputation penalty
    if (status === "NoShow" || status === "Late") {
      const penalty = status === "NoShow" ? -15 : -5;
      
      setReputations(prev => prev.map(r => {
        if (r.teamName !== teamName) return r;
        
        const newScore = Math.max(0, r.reliabilityScore + penalty);
        const newHistoryLog = {
          points: penalty,
          reason: `Auto ${status} Penalty for Scrim ID ${scrimId}`,
          date: currentMockTime.toISOString().split("T")[0]
        };

        return {
          ...r,
          reliabilityScore: newScore,
          history: [newHistoryLog, ...r.history]
        };
      }));

      addAuditLog("Impose Penalty", "Reputation", `Deducted ${Math.abs(penalty)} pts from "${teamName}" due to ${status}.`);
      triggerNotification("Reminder", "Reputation Alert", `Team "${teamName}" reputation reduced due to attendance infraction (${status}).`);
    } else {
      // Checked in on time
      setReputations(prev => prev.map(r => {
        if (r.teamName !== teamName) return r;
        const newScore = Math.min(100, r.reliabilityScore + 3);
        return {
          ...r,
          reliabilityScore: newScore,
          history: [{ 
            points: 3, 
            reason: "Standard Checked In On Time Bonus", 
            date: currentMockTime.toISOString().split("T")[0] 
          }, ...r.history]
        };
      }));
    }

    setSystemAlertMessage(`📊 Attendance updated: ${teamName} marked as ${status}.`);
  };

  // Auto no-show scanner
  const handleTriggerNoShowDetection = (scrimId: string) => {
    const scrim = scrims.find(s => s.id === scrimId);
    if (!scrim) return;

    let flaggedCount = 0;
    scrim.registeredTeams.forEach(team => {
      if (team.checkInStatus === "Pending") {
        handleUpdateAttendanceStatus(scrimId, team.teamName, "NoShow");
        flaggedCount++;
      }
    });

    setSystemAlertMessage(`⚡ Automatic No-Show finished. Flagged and penalized ${flaggedCount} unresponsive teams.`);
    addAuditLog("Scan Unresponsive Scrims", "Scrim", `Auto scan flagged non-attendance rosters.`);
  };

  // 3. DYNAMIC ROOM CODE MANAGEMENT

  const isRoomCodeAuthorized = () => {
    // Check if roles have been allowed
    return roomManagers.includes(session.role);
  };

  const handleUpdateRoomCodes = (scrimId: string, customId: string, customPass: string) => {
    if (!isRoomCodeAuthorized()) {
      setSystemAlertMessage("⛔ SECURITY ERROR: You do not possess Room Management authority.");
      return;
    }

    setScrims(prev => prev.map(s => {
      if (s.id !== scrimId) return s;
      return {
        ...s,
        roomCode: {
          ...s.roomCode,
          roomId: customId,
          roomPass: customPass
        }
      };
    }));

    addAuditLog("Update Lobby Codes", "RoomCode", `Modified active room code values for Scrim ID: ${scrimId}`);
    setSystemAlertMessage("🔑 Room coordinates modified successfully. Distributing logs.");
  };

  const handleToggleRoomRelease = (scrimId: string, state: boolean) => {
    if (!isRoomCodeAuthorized()) {
      setSystemAlertMessage("⛔ Authorization Denied: Access Locked.");
      return;
    }

    const matchedScrim = scrims.find(s => s.id === scrimId);
    const mapName = matchedScrim ? matchedScrim.mapName : "Unknown Map";
    const scrimTitle = matchedScrim ? matchedScrim.title : "Scrim Session";

    setScrims(prev => prev.map(s => {
      if (s.id !== scrimId) return s;
      return {
        ...s,
        roomCode: {
          ...s.roomCode,
          released: state
        }
      };
    }));

    addAuditLog(state ? "Release Room Codes" : "Revoke Room Codes", "RoomCode", `Set release state to ${state} for Scrim ID: ${scrimId} (Map: ${mapName})`);
    setSystemAlertMessage(state ? `🔓 Room Codes & Map (${mapName}) published to active participants!` : `🔒 Room Codes hidden for Map: ${mapName}.`);
    
    if (state) {
      triggerNotification("RoomCode", `Room Coordinates Released: ${mapName}`, `Active Room credentials for ${scrimTitle} are now accessible to registered teams on Map: ${mapName}. Connect immediately!`);
    }
  };

  const calculatePlacementPoints = (place: number): number => {
    if (place === 1) return 10;
    if (place === 2) return 6;
    if (place === 3) return 5;
    if (place === 4) return 4;
    if (place === 5) return 3;
    if (place === 6) return 2;
    if (place === 7 || place === 8) return 1;
    return 0;
  };

  const handleRecordMatchResult = (scrimId: string) => {
    const matchedScrim = scrims.find(s => s.id === scrimId);
    if (!matchedScrim) return;

    const team = ssTeam[scrimId] || (matchedScrim.registeredTeams[0]?.teamName || "CV Crimson");
    const matchNum = ssMatchNum[scrimId] || 1;
    const placement = ssPlacement[scrimId] || 1;
    const kills = ssKills[scrimId] || 0;
    const imageUrl = ssImage[scrimId] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop";

    const plPoints = calculatePlacementPoints(placement);
    const totPoints = plPoints + kills;

    // Check if team already submitted for this specific match
    const existing = screenshotSubmissions.find(s => s.scrimId === scrimId && s.teamName === team && s.matchNumber === matchNum);
    if (existing) {
      setSystemAlertMessage(`⚠️ Duplicate Blocked: "${team}" already has statistics recorded for Match #${matchNum}.`);
      return;
    }

    // Create a new submission record
    const newSub: MatchScreenshotSubmission = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      scrimId,
      teamName: team,
      matchNumber: matchNum,
      placement,
      kills,
      points: totPoints,
      screenshotUrl: imageUrl,
      submittedAt: currentMockTime.toISOString(),
      submittedBy: session.ign || "Lobby Captain",
      verified: true
    };

    setScreenshotSubmissions(prev => [newSub, ...prev]);
    addAuditLog(
      "Submit Match Score", 
      "Scrim", 
      `For Scrim ID: ${scrimId}, registered Match #${matchNum} score for team "${team}" - Placement #${placement} (${plPoints} pts) + ${kills} kills. Total: ${totPoints} pts.`
    );
    setSystemAlertMessage(`🎉 Match score recorded! Team "${team}" gets +${totPoints} points on the live standings scoreboard.`);
    awardXp(20);

    // Reset default form inputs for this scrim to prevent accidental duplicates
    setSsKills(prev => ({ ...prev, [scrimId]: 0 }));
    setSsPlacement(prev => ({ ...prev, [scrimId]: 1 }));
  };

  const handleDeleteScreenshotSubmission = (subId: string, teamName: string) => {
    setScreenshotSubmissions(prev => prev.filter(s => s.id !== subId));
    addAuditLog("Delete Match Score", "Scrim", `User deleted recorded score submission for team: "${teamName}".`);
    setSystemAlertMessage(`🗑️ Score entry for team "${teamName}" was removed from standings.`);
  };

  // BAN/SUSPENSION MANAGE LOGIC (Smart Auto-Decline Helpers)
  const getSuspensionStatusText = (bannedTeam: BannedTeam) => {
    if (bannedTeam.suspendedUntil === "Permanent") {
      return { text: "Permanent Ban", color: "text-red-500 bg-red-950/40 border-red-500/20" };
    }
    const until = new Date(bannedTeam.suspendedUntil);
    if (until < currentMockTime) {
      return { text: "Suspension Expired", color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/20" };
    }
    const diffMs = until.getTime() - currentMockTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours >= 24) {
      const days = Math.floor(diffHours / 24);
      return { text: `Suspended (${days}d remaining)`, color: "text-amber-500 bg-amber-955/25 border-amber-500/20" };
    }
    return { text: `Suspended (${diffHours}h ${diffMins}m remaining)`, color: "text-amber-500 bg-amber-955/25 border-amber-500/20" };
  };

  const handleAddBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banInputTeamName.trim()) {
      setSystemAlertMessage("❌ Specify a team name to sanction.");
      return;
    }

    let suspendedUntilStr = "Permanent";
    if (banInputDuration !== "Permanent") {
      const days = parseInt(banInputDuration);
      const targetDate = new Date(currentMockTime.getTime() + days * 24 * 60 * 60 * 1000);
      suspendedUntilStr = targetDate.toISOString();
    }

    const newBan: BannedTeam = {
      id: `ban-${Date.now()}`,
      teamName: banInputTeamName.trim(),
      reason: banInputReason.trim() || "Unspecified tactical rule violation",
      bannedAt: currentMockTime.toISOString(),
      suspendedUntil: suspendedUntilStr
    };

    setBannedTeams(prev => [newBan, ...prev]);
    addAuditLog(
      "Add Team Ban",
      "Security",
      `Sanctioned "${banInputTeamName}" (until: ${banInputDuration === "Permanent" ? "Permanent" : `${banInputDuration} Days`}). Reason: ${newBan.reason}`
    );
    setSystemAlertMessage(`🔒 Team "${banInputTeamName}" registered in the security sanctions database.`);
    
    // Clear inputs
    setBanInputTeamName("");
    setBanInputReason("");
    setBanInputDuration("Permanent");
    awardXp(15);
  };

  const handleLiftBan = (id: string, teamName: string) => {
    setBannedTeams(prev => prev.filter(b => b.id !== id));
    addAuditLog(
      "Lift Team Ban",
      "Security",
      `Pardoned & lifted active restrictions for team "${teamName}".`
    );
    setSystemAlertMessage(`🔓 Sanction lifted for Team "${teamName}" successfully.`);
    awardXp(10);
  };

  // 4. OWNER COMMAND CONSOLE PROCESSING

  const handleExecuteOwnerCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (session.role !== "Owner") {
      setSystemAlertMessage("⛔ CONSOLE ACCESS DENIED: Requires Owner level authorization.");
      return;
    }

    const command = ownerCommand.trim().toLowerCase();
    if (!command) return;

    let logDesc = "";
    if (command === "/grant-all-captains") {
      setRoomManagers(prev => Array.from(new Set([...prev, "Team Captain"])));
      setOwnerCommandResult("SUCCESS: Granted Room Code manager roles to all 'Team Captain' identities.");
      logDesc = "Executed grant-all-captains console override.";
    } else if (command === "/revoke-all-assistants") {
      setRoomManagers(["Owner"]);
      setOwnerCommandResult("SECURITY SECURED: Revoked room permissions from all roles other than 'Owner'.");
      logDesc = "Executed emergency security lockdown console command.";
    } else if (command === "/reset-all-reputations") {
      setReputations(prev => prev.map(r => ({ ...r, reliabilityScore: 100 })));
      setOwnerCommandResult("SUCCESS: Reset all team reputation scores back to 100% standard.");
      logDesc = "Wiped competitive penalty reputations via console override.";
    } else if (command.startsWith("/grant-role ")) {
      const parts = command.split(" ");
      const roleStr = parts.slice(1).join(" ");
      
      // Capitalize properly
      const formattedRole = roleStr.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      if (["Head Admin", "Admin", "Moderator", "Team Captain", "Member"].includes(formattedRole)) {
        setRoomManagers(prev => Array.from(new Set([...prev, formattedRole])));
        setOwnerCommandResult(`GRANTED: Authorized role "${formattedRole}" to write/edit room coordinates.`);
        logDesc = `Console granted lobby authority to: ${formattedRole}`;
      } else {
        setOwnerCommandResult("ERROR: Unrecognized platform security role.");
      }
    } else {
      setOwnerCommandResult(`ERROR: Command "${command}" not recognized in Owner firmware v4.1`);
    }

    if (logDesc) {
      addAuditLog("Execution Command", "Security", logDesc);
    }
    setOwnerCommand("");
    awardXp(15);
  };

  // Reputation management updates
  const handleModifyReputationManual = (teamName: string, amount: number, reason: string) => {
    setReputations(prev => prev.map(r => {
      if (r.teamName !== teamName) return r;
      const score = Math.max(0, Math.min(100, r.reliabilityScore + amount));
      return {
        ...r,
        reliabilityScore: score,
        history: [{
          points: amount,
          reason,
          date: currentMockTime.toISOString().split("T")[0]
        }, ...r.history]
      };
    }));

    addAuditLog("Manual Reputation Adjustment", "Reputation", `Adjusted "${teamName}" score by ${amount} pts. Reason: ${reason}`);
    setSystemAlertMessage(`📉 Roster Reputation changed by ${amount} points.`);
  };

  // Mock analytics helper metrics for graphs
  const MOCK_ANALYTICS_DATA = [
    { name: "Week 1", "Total Registrations": 42, "Waitlist Claims": 12, "Attendance Rate %": 82 },
    { name: "Week 2", "Total Registrations": 68, "Waitlist Claims": 18, "Attendance Rate %": 90 },
    { name: "Week 3", "Total Registrations": 95, "Waitlist Claims": 25, "Attendance Rate %": 96 },
    { name: "Week 4", "Total Registrations": 128, "Waitlist Claims": 42, "Attendance Rate %": 98 }
  ];

  return (
    <div id="cv-scrim-management-system-node" className="bg-[#0b0c10] border border-zinc-900 rounded-3xl p-4 sm:p-6 space-y-6 text-white relative font-chakra overflow-hidden">
      
      {/* Decorative Cybernetic Grid lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[90px] pointer-events-none" />

      {/* TOP HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-zinc-850 pb-5">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-650/10 border border-red-600/30 rounded-lg text-red-500 font-mono text-[9px] uppercase tracking-widest leading-none">
            <Zap size={11} className="animate-pulse" />
            <span>CV Esports Pro Scrim Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-orbitron tracking-tight text-white uppercase flex items-center gap-2">
            🛡️ SCRIM SYSTEM & COMMAND CONTROL
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Daily Lobby schedules, instant queue promotions, automated penalties, and owner permission logs.
          </p>
        </div>

        {/* Dynamic Simulated Clock display */}
        <div className="bg-black/60 px-4 py-2 rounded-xl border border-zinc-850 flex items-center gap-3 self-stretch lg:self-auto justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">MOCK CLOCK:</span>
          </div>
          <span className="text-sm font-bold font-mono text-white tracking-widest leading-none">
            {currentMockTime.toLocaleDateString()} {currentMockTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* DYNAMICS ALERTS POPUPS FOR SEEN ACCEPTED PROMOTIONS / TIMEOUT OPTIONS */}
      <AnimatePresence>
        {promotedWaitlistState && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="bg-gradient-to-r from-red-950 via-zinc-950 to-black border-2 border-red-505 p-5 rounded-2xl shadow-xl shadow-red-950/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-red-600 animate-pulse" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <span className="text-[10px] bg-red-900/40 text-red-400 px-2.5 py-0.5 rounded border border-red-500/20 font-mono font-bold uppercase tracking-wider block w-max">
                  ⚠️ WAITLIST PROMOTION PENDING ACT
                </span>
                <p className="text-sm font-black text-white font-orbitron uppercase">
                  TEAM "{promotedWaitlistState.teamName}" PROMOTED TO ACTIVE ROSTER!
                </p>
                <p className="text-xs text-zinc-300">
                  An empty slot emerged. Check-in must be confirmed or pass will decline automatically.
                </p>
                
                {/* Visual countdown progress */}
                <div className="flex items-center gap-2 pt-2">
                  <Clock size={12} className="text-red-500" />
                  <span className="text-xs font-mono text-zinc-400">Time to respond: <strong className="text-white font-black">{promotedWaitlistState.expiresInSeconds}s</strong></span>
                  <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${(promotedWaitlistState.expiresInSeconds / 60) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => handleConfirmPromotion(promotedWaitlistState.scrimId, promotedWaitlistState.teamName)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-mono text-xs font-bold rounded-xl text-white cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check size={12} />
                  <span>CONFIRM SLOT</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeclinePromotion(promotedWaitlistState.scrimId, promotedWaitlistState.teamName)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 font-mono text-xs text-zinc-300 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 border border-zinc-800"
                >
                  <X size={12} />
                  <span>DECLINE & PASS</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HORIZONTAL TAB NAVIGATION SYSTEM */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-900 pb-1.5">
        {[
          { id: "listings", label: "🗓️ Scrim Listings", desc: "Slots & Waitlist" },
          { id: "room", label: "🔑 Room Codes", desc: "Dynamic Coordination" },
          { id: "control", label: "⚡ Control Center", desc: "Admins Only" },
          { id: "regionSys", label: "🗺️ Regional System", desc: "Multi-Region Hub" },
          { id: "owner", label: "👑 Owner Console", desc: "Security Overrides" },
          { id: "reputation", label: "📊 Team Reputation", desc: "Reliability score" },
          { id: "stats", label: "📈 Scrim Statistics", desc: "Attendance Reports" },
          { id: "notifications2", idMatch: "notifications", label: "🔔 Alerts Panel", desc: "Channels simulator" }
        ].map((t) => {
          const matchId = t.idMatch || t.id;
          const isActive = activeSubTab === matchId;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(matchId as any)}
              className={`px-3 py-2 text-left rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? "bg-red-650/10 border-red-600/30 text-white shadow-md"
                  : "bg-black/40 border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="text-xs font-black uppercase tracking-wider">{t.label}</div>
              <div className="text-[9px] text-zinc-500 font-mono leading-none mt-0.5">{t.desc}</div>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. SCRIM LISTINGS & SCHEDULING (PUBLIC PREVIEW) */}
      {activeSubTab === "listings" && (() => {
        const userTeamProfile = teamProfiles.find(p => p.teamName === selectedUserTeam) || {
          teamName: selectedUserTeam,
          primaryRegion: "Africa" as const,
          playerLocations: ["Zimbabwe", "South Africa"],
          serverRegionPreference: "Cape Town 1",
          accountHistoryRating: "Good" as const,
          verified: true
        };
        const userAssignedRegion = userTeamProfile.primaryRegion;

        return (
          <div className="space-y-6">
            
            {/* Acting Team Selector for high-fidelity regional simulation */}
            <div className="bg-[#111217] p-4 rounded-2xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-left font-mono">
                <span className="text-[10px] text-zinc-500 uppercase block tracking-wider font-bold">ROSTER SESSION CONTEXT</span>
                <span className="text-sm font-black text-white font-sans">
                  Browsing as: <span className="text-red-500 font-bold">{userTeamProfile.teamName}</span>
                </span>
                <div className="flex gap-2.5 items-center mt-1 text-[10px] text-zinc-400">
                  <span>Primary Region: <strong className="text-zinc-200">{userAssignedRegion}</strong></span>
                  <span className="text-zinc-700">|</span>
                  <span>Roster: <strong className="text-zinc-200">{userTeamProfile.playerLocations.join(", ")}</strong></span>
                  <span className="text-zinc-700">|</span>
                  <span>Verification Status: <strong className={userTeamProfile.verified ? "text-emerald-400" : "text-amber-400"}>{userTeamProfile.verified ? "VERIFIED ✅" : "UNVERIFIED ⚠️"}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-[10px] text-zinc-500 font-mono uppercase">Change Acting Team:</label>
                <select
                  value={selectedUserTeam}
                  onChange={(e) => setSelectedUserTeam(e.target.value)}
                  className="bg-black border border-zinc-850 px-2 py-1 text-xs text-white rounded font-mono"
                >
                  {teamProfiles.map((tp) => (
                    <option key={tp.teamName} value={tp.teamName}>
                      {tp.teamName} ({tp.primaryRegion})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* WHATSAPP LINK REMINDER FOR RECEIVING SCRIM LOBBY CODES */}
            {(() => {
              const isWaLinked = (() => {
                try {
                  const saved = localStorage.getItem("cv_whatsapp_user_profiles");
                  if (!saved) return false;
                  return !!JSON.parse(saved)[session.ign]?.isVerified;
                } catch (e) {
                  return false;
                }
              })();

              return (
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                  isWaLinked 
                    ? "bg-emerald-950/15 border-emerald-900/30 text-emerald-450"
                    : "bg-amber-950/20 border-amber-900/30 text-amber-500 animate-pulse"
                }`}>
                  <div className="space-y-1 text-left">
                    <strong className="text-xs font-mono font-black uppercase tracking-widest block flex items-center gap-1.5">
                      📱 {isWaLinked ? "VERIFIED WHATSAPP DELIVERY NODE DETECTED" : "⚠️ REGISTER PROFILE CELLPHONE (CRITICAL ACTION)"}
                    </strong>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-2xl">
                      {isWaLinked 
                         ? "Your verified dial endpoint is connected dynamically. Lobby codes and match releases will dispatch automatically to your handset on match release."
                         : "Linking WhatsApp is required to receive Scrim Custom Room IDs, passcodes, rosters check-ins and system promotions. Do not miss match placements!"}
                    </p>
                  </div>
                  
                  {!isWaLinked && (
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("cv_navigate_tab", { detail: "settings" }));
                        setSystemAlertMessage("📱 Launching WhatsApp Linking Center & dial deck...");
                        awardXp(10);
                      }}
                      className="p-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black font-mono text-[9.5px] rounded-xl uppercase tracking-wider shrink-0 cursor-pointer text-center"
                    >
                      Link WhatsApp Now 📱
                    </button>
                  )}
                </div>
              );
            })()}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-left">
                <h3 className="text-sm font-black font-orbitron tracking-widest text-zinc-300 uppercase">
                  📅 ACTIVE AND SCHEDULING SCRIMS
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block mt-1">
                  Scoped Region Filters: Showing <span className="text-red-400">{userAssignedRegion}</span> matches & Cross-Region Events
                </span>
              </div>
              
              {/* Filter controls */}
              <div className="flex items-center gap-1.5 bg-black p-1 border border-zinc-850 rounded-xl">
                {(["All", "Open", "WaitlistActive", "Completed"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setListingsFilter(opt)}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      listingsFilter === opt
                        ? "bg-zinc-800 text-white font-black"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {opt === "WaitlistActive" ? "Waitlists Active" : opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Fair Play Latency Policy Disclaimer inside core views */}
            <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-3 text-left font-mono text-[10px] text-zinc-400">
              <span className="text-red-500 font-black block mb-0.5 uppercase tracking-wider">⚠️ Fair Play Geolocation & Latency Policy</span>
              Our matchmaking engine optimizes server selections based on participants' routing nodes to maximize stability. Actual in-game ping results can vary and zero latency cannot be guaranteed as packet routing details are subject to third-party game clients and external network fluctuations.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const filteredScrims = scrims
                  .filter(s => {
                    if (listingsFilter === "Open") return s.status === "Open" && s.registeredTeams.length < s.maxSlots;
                    if (listingsFilter === "WaitlistActive") return s.registeredTeams.length >= s.maxSlots;
                    if (listingsFilter === "Completed") return s.status === "Completed";
                    return true;
                  })
                  .filter(s => {
                    // Admins & Owners override regional filters
                    if (["Owner", "Head Admin", "Admin", "Moderator"].includes(session.role)) {
                      return true;
                    }
                    const sRegion = s.region || "Africa";
                    const xRegion = s.crossRegionEnabled || false;
                    return sRegion === userAssignedRegion || xRegion;
                  });

                if (filteredScrims.length === 0) {
                  return (
                    <div className="col-span-2 bg-black/30 border border-zinc-900/40 rounded-2xl p-16 text-center space-y-4 shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
                      <div className="mx-auto w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-red-500 animate-pulse font-mono text-base shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        🔥
                      </div>
                      <p className="text-sm font-semibold text-white uppercase tracking-widest font-orbitron">No Active Scrims Available</p>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-sans">
                        There are currently no scheduled practice scrim lobbys active. 
                        <span className="block mt-1 text-red-500 font-bold uppercase tracking-wider font-mono text-[11px]">Upcoming Events Will Be Announced Soon</span>
                      </p>
                    </div>
                  );
                }

                return filteredScrims.map((sc, index) => {
                  const totalSlots = sc.maxSlots;
                  const claimedSlots = sc.registeredTeams.length;
                  const remainingSlots = Math.max(0, totalSlots - claimedSlots);
                  const isFull = claimedSlots >= totalSlots;
                  const registrationOpen = currentMockTime >= new Date(sc.registrationOpenTime);

                  // Latency estimation display
                  const matchingRegion = (sc.region || "Africa") === userAssignedRegion;
                  let pingEstimate = 20;
                  let pingQuality = "Excellent";
                  let pingColor = "text-emerald-400 border-emerald-900/40 bg-emerald-950/20";

                  if (!matchingRegion) {
                    pingEstimate = 210 + Math.floor(Math.random() * 45);
                    pingQuality = "High Delay";
                    pingColor = "text-red-400 border-red-900/40 bg-red-950/20";
                  } else {
                    pingEstimate = 12 + Math.floor(Math.random() * 15);
                    pingQuality = "Highly Stable";
                    pingColor = "text-emerald-400 border-emerald-900/40 bg-emerald-950/20";
                  }

                  // Get countdown timer values
                  const timeDiff = new Date(sc.registrationOpenTime).getTime() - currentMockTime.getTime();
                  const secondsLeft = Math.max(0, Math.floor(timeDiff / 1000));
                  const hoursLeft = Math.floor(secondsLeft / 3600);
                  const minutesLeft = Math.floor((secondsLeft % 3600) / 60);
                  const secsRemaining = secondsLeft % 60;

                  return (
                    <motion.div
                      key={sc.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(6, index) * 0.06, ease: "easeOut" }}
                      className="bg-[#111217] rounded-2xl border border-zinc-900 p-5 flex flex-col justify-between gap-5 relative overflow-hidden"
                    >
                      {/* Corner Tag */}
                      <div className="absolute top-0 right-0 flex items-center">
                        <span className="px-2.5 py-1 bg-red-650/15 text-red-500 text-[8px] font-mono rounded-bl border-l border-b border-zinc-800">
                          REGION: {sc.region || "Africa"}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Metas row */}
                        <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono">
                          <span className="bg-red-500/15 text-red-400 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                            {sc.game}
                          </span>
                          <span className="text-zinc-550">•</span>
                          <span className="text-zinc-400 uppercase">Map: <strong className="text-white font-sans">{sc.mapName}</strong></span>
                          {sc.crossRegionEnabled && (
                            <>
                              <span className="text-zinc-550">•</span>
                              <span className="bg-blue-900/40 border border-blue-800/40 text-blue-400 text-[8px] px-1.5 rounded font-bold uppercase">Cross-Region Approved</span>
                            </>
                          )}
                        </div>

                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-base font-black text-white font-orbitron tracking-wide uppercase leading-tight">
                              {sc.title}
                            </h4>
                            {sc.pmgcRulesActive && (
                              <span className="bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase font-mono animate-pulse">
                                🏆 PMGC RULES ACTIVE
                              </span>
                            )}
                          </div>
                          
                          {/* Rules preview snapshot */}
                          <div className="text-xs text-zinc-450 space-y-0.5">
                            <p className="truncate">💡 Match rules: "{sc.rulesText}"</p>
                            {sc.pmgcRulesActive && (
                              <p className="text-[9.5px] text-amber-500/90 font-mono font-semibold flex items-center gap-1">
                                <span>⚖️ 10pt PMGC Point matrix + mobile telemetry diagnostics scan in effect</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Connection suitability stats */}
                        <div className="grid grid-cols-2 gap-2 text-left font-mono">
                          <div className="bg-black/50 border border-zinc-900 p-2 rounded-xl">
                            <span className="block text-[8px] text-zinc-500 uppercase">HOST CENTER</span>
                            <span className="text-xs text-zinc-300 font-bold">{sc.recommendedServer || "Cape Town 1"}</span>
                          </div>
                          <div className={`border p-2 rounded-xl text-left ${pingColor}`}>
                            <span className="block text-[8px] opacity-70 uppercase font-bold">ESTIMATED LATENCY</span>
                            <span className="text-xs font-black font-sans">{pingEstimate}ms ({pingQuality})</span>
                          </div>
                        </div>

                        {/* Launch clock and daily registry schedules */}
                        <div className="bg-black/40 p-3 rounded-xl border border-zinc-900/60 font-mono text-[10.5px]">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-zinc-550 uppercase">Scrim Workout:</span>
                            <span className="text-zinc-300 font-bold">{new Date(sc.scrimTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-550 uppercase">Reg opens at:</span>
                            <span className="text-zinc-300">{new Date(sc.registrationOpenTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
                          </div>
                        </div>

                      {/* COUNTDOWN TIMER FOR REGS */}
                      {!registrationOpen ? (
                        <div className="bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-xl text-center">
                          <span className="text-[9px] text-amber-500 font-black tracking-widest uppercase block mb-1">⏳ PUBLIC REGISTRATION REVEALS IN</span>
                          <strong className="text-lg font-mono font-black text-white tracking-widest">
                            {hoursLeft.toString().padStart(2, "0")}:{minutesLeft.toString().padStart(2, "0")}:{secsRemaining.toString().padStart(2, "0")}
                          </strong>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-xl text-center flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] text-emerald-400 font-mono uppercase font-black tracking-wider">REGISTRATION INTAKE OPEN & ACTIVE</span>
                        </div>
                      )}

                      {/* Visual Slots metric progress bar */}
                      <div className="space-y-1.5 pt-1 text-left">
                        <div className="flex justify-between text-[11px] font-mono leading-none">
                          <span className="text-zinc-400">Slots Claimed:</span>
                          <span className="text-zinc-300 font-black font-orbitron">{claimedSlots} / {totalSlots} <span className="text-zinc-650 text-[9px]">({remainingSlots} left)</span></span>
                        </div>

                        <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isFull ? "bg-red-650 animate-pulse" : claimedSlots > totalSlots * 0.75 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, (claimedSlots / totalSlots) * 100)}%` }}
                          />
                        </div>

                        {/* Special Reservation tag indicators */}
                        {sc.vipSlots > 0 && (
                          <div className="text-[9px] text-amber-400/90 font-mono flex items-center gap-1.5">
                            <Star size={10} className="fill-amber-500/40" />
                            <span>Reserved VIP Partner protection slots: <strong>{sc.vipSlots} pre-assigned</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Register lists Breakdown visual */}
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-wider block">Claimed slots ({claimedSlots}) :</span>
                          <div className="max-h-24 overflow-y-auto pr-1 space-y-1 bg-black/60 p-2 rounded-lg border border-zinc-900 font-mono text-[10px]">
                            {sc.registeredTeams.length === 0 ? (
                              <span className="text-zinc-600 italic">No squads checked-in yet.</span>
                            ) : (
                              sc.registeredTeams.map((team, tIdx) => (
                                <div key={tIdx} className="flex justify-between items-center text-zinc-300">
                                  <span className="truncate max-w-[80px] font-bold text-white">{team.teamName}</span>
                                  {team.isVip && (
                                    <span className="text-[7px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1 rounded uppercase">VIP</span>
                                  )}
                                  {teamNameIsUsers(team.teamName) && (
                                    <button
                                      onClick={() => handleCancelRegistration(sc.id, team.teamName)}
                                      className="text-red-500 hover:underline hover:text-red-400 text-[8px] cursor-pointer"
                                      title="Cancel Slot"
                                    >
                                      [Cancel]
                                    </button>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-wider block">Waitlist Queue ({sc.waitlistedTeams.length}) :</span>
                          <div className="max-h-24 overflow-y-auto pr-1 space-y-1 bg-black/60 p-2 rounded-lg border border-zinc-900 font-mono text-[10px]">
                            {sc.waitlistedTeams.length === 0 ? (
                              <span className="text-zinc-600 italic">Queue remains empty.</span>
                            ) : (
                              sc.waitlistedTeams.map((team, tIdx) => (
                                <div key={tIdx} className="flex justify-between items-center text-zinc-400">
                                  <span>#{tIdx + 1} {team.teamName}</span>
                                  {teamNameIsUsers(team.teamName) && (
                                    <button
                                      onClick={() => handleCancelRegistration(sc.id, team.teamName)}
                                      className="text-red-500 hover:underline hover:text-red-400 text-[8px]"
                                    >
                                      [Cancel]
                                    </button>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-3 border-t border-zinc-90s/50">
                      <div className="flex gap-2">
                        {/* Public Registration trigger button */}
                        <button
                          disabled={!registrationOpen || sc.registeredTeams.some(t => teamNameIsUsers(t.teamName)) || sc.waitlistedTeams.some(t => teamNameIsUsers(t.teamName))}
                          onClick={() => handleRegisterTeam(sc.id)}
                          className="flex-1 py-2 bg-red-650 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-650 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition cursor-pointer"
                        >
                          {sc.registeredTeams.some(t => teamNameIsUsers(t.teamName)) || sc.waitlistedTeams.some(t => teamNameIsUsers(t.teamName)) ? (
                            "✓ Registered"
                          ) : isFull ? (
                            "⚠️ REGISTER INTO WAITLIST"
                          ) : (
                            "CLAIM SCRIM SLOT"
                          )}
                        </button>

                        {/* Interactive VIP Roster Check simulation (Helps demo the Sponsor slots / Waitlist Promotions) */}
                        <button
                          disabled={!registrationOpen}
                          onClick={() => {
                            // Prompt for quick sponsor name
                            const names = ["Apex Raiders", "Zero Elite", "Sponsor Kings Roster", "Elite Force", "Hydra Eclipse", "Toxic Esports"];
                            const random = names[Math.floor(Math.random() * names.length)];
                            handleRegisterTeam(sc.id, random, Math.random() > 0.5);
                          }}
                          title="Simulate registrations from external teams to test the slot saturation and Waitlist Promotion flow"
                          className="px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 cursor-pointer font-mono text-xs"
                        >
                          ⚔️ SIM REG
                        </button>
                      </div>

                      <div className="text-[9px] text-zinc-500 font-mono text-center uppercase tracking-wide">
                        Registration and queue priority aligns with Team Reputation score status
                      </div>
                    </div>

                  </motion.div>
                );
              })
            })()}
          </div>

        </div>
      );
    })()}

      {/* 2. DYNAMIC ROOM CODES MANAGER */}
      {activeSubTab === "room" && (
        <div className="space-y-6">
          
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h3 className="text-sm font-black font-orbitron tracking-widest text-zinc-300 uppercase">
                🔑 DYNAMIC ROOM CODE ARCHITECTURE
              </h3>
              <p className="text-xs text-zinc-550 leading-relaxed font-mono">
                Only validated captains or security administrators hold power to manage coordinates. Codes release based on config.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-lg border border-red-950">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-zinc-400 font-mono uppercase">LOBBY HOSTS: <strong className="text-white">{roomManagers.join(", ")}</strong></span>
            </div>
          </div>

          <div className="space-y-4">
            {scrims.map((sc) => {
              const userInScrim = sc.registeredTeams.some(t => teamNameIsUsers(t.teamName));
              const isAuthorized = isRoomCodeAuthorized();
              const codesReleased = sc.roomCode.released;

              return (
                <div key={sc.id} className="bg-[#101115] p-5 rounded-2xl border border-zinc-900 text-left space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase">{sc.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">MAP: {sc.mapName}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        codesReleased ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-900 text-zinc-500"
                      }`}>
                        {codesReleased ? "🔓 CODES PUBLISHED" : "🔒 CODES LOCKED"}
                      </span>
                    </div>
                  </div>

                  {/* ROOM VALUES SCREEN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Security reveal for registered players */}
                    <div className="bg-black/40 p-4 rounded-xl border border-zinc-900 font-mono">
                      <span className="text-[9px] text-[#ef4444] block mb-2 uppercase font-black tracking-widest">PARTICIPANT RETRIEVAL HUD</span>
                      
                      {codesReleased ? (
                        userInScrim || isAuthorized ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-3 text-center">
                              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                                <span className="text-zinc-650 text-[8px] block w-full text-center">ROOM ID</span>
                                <strong className="text-white text-base tracking-widest">{sc.roomCode.roomId}</strong>
                              </div>
                              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900">
                                <span className="text-zinc-650 text-[8px] block w-full text-center font-mono">PASSWORD</span>
                                <strong className="text-[#ef4444] text-base tracking-widest">{sc.roomCode.roomPass}</strong>
                              </div>
                            </div>
                            <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded text-center text-[10px] font-sans">
                              <span className="text-zinc-400 font-mono">Battleground Map: </span>
                              <strong className="text-emerald-400 uppercase font-black font-sans">{sc.mapName}</strong>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-zinc-500 space-y-2">
                            <Lock size={20} className="mx-auto text-zinc-70s hover:text-[#ef4444] transition-colors" />
                            <p className="text-[10.5px] font-bold text-zinc-400">ACCESS RESTRICTED</p>
                            <p className="text-[9px]">Lobby credentials released but only available to checked-in participants.</p>
                          </div>
                        )
                      ) : (
                        <div className="py-4 text-center text-zinc-500 space-y-2">
                          <Lock size={20} className="mx-auto" />
                          <p className="text-[10.5px] font-bold text-zinc-400">CREDENTIALS WITHHELD</p>
                          <p className="text-[9px] text-zinc-600">Releases dynamically 15 mins before matches start.</p>
                        </div>
                      )}
                    </div>
 
                    {/* Admin Override Inputs (Visible to authorized room managers only) */}
                    <div className="bg-black/20 p-4 rounded-xl border border-zinc-900/60 text-xs text-left space-y-3">
                      <div className="flex justify-between items-center pb-1 border-b border-zinc-900/55">
                        <span className="text-[9px] text-zinc-450 uppercase font-black font-mono tracking-widest">COORDINATES OVERRIDE (ADMIN ONLY)</span>
                        {!isAuthorized && <Lock size={11} className="text-zinc-650" />}
                      </div>
 
                      {isAuthorized ? (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8px] text-zinc-500 block uppercase font-mono">ROOM ID:</label>
                              <input
                                id={`room-id-override-${sc.id}`}
                                type="text"
                                defaultValue={sc.roomCode.roomId}
                                className="w-full bg-[#151515] border border-zinc-800 text-xs px-2 py-1 text-white font-mono rounded"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-zinc-500 block uppercase font-mono">PASSWORD:</label>
                              <input
                                id={`room-pass-override-${sc.id}`}
                                type="text"
                                defaultValue={sc.roomCode.roomPass}
                                className="w-full bg-[#151515] border border-zinc-800 text-xs px-2 py-1 text-white font-mono rounded"
                              />
                            </div>
                          </div>
 
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const idel = document.getElementById(`room-id-override-${sc.id}`) as HTMLInputElement;
                                const passel = document.getElementById(`room-pass-override-${sc.id}`) as HTMLInputElement;
                                handleUpdateRoomCodes(sc.id, idel.value, passel.value);
                              }}
                              className="px-3 py-1 bg-red-650 hover:bg-red-700 font-mono text-[9px] text-white rounded font-bold cursor-pointer transition-colors uppercase"
                            >
                              Update Codes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleRoomRelease(sc.id, !codesReleased)}
                              className={`px-3 py-1 font-mono text-[9px] rounded font-bold cursor-pointer transition-colors uppercase ${
                                codesReleased ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              }`}
                            >
                              {codesReleased ? "🔒 Revoke release" : "🔓 Publish to Teams"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-550 leading-relaxed font-mono">
                          Requires security roles with Room Code permissions. Switch role above in the top right to explore admin tools.
                        </p>
                      )}
                    </div>
 
                  </div>

                  {/* SCREENSHOTS SUBMISSION & REALTIME LEADERBOARD SYSTEM */}
                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-yellow-500 animate-bounce" />
                        <span className="text-[11px] font-black font-orbitron tracking-widest text-[#ef4444] uppercase">
                          🏆 SCRIM MATCH RESULTS & LIVE LEADERBOARD
                        </span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        Active Map: <strong className="text-white uppercase">{sc.mapName}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                      
                      {/* 1. SCREENSHOT & SCORE SUBMISSION FORM (2 columns) */}
                      <div className="lg:col-span-2 bg-black/40 p-4 rounded-xl border border-zinc-900/85 space-y-3.5 text-xs text-left">
                        <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                          <Camera size={13} className="text-red-500" />
                          <span className="text-[10px] font-bold text-zinc-300 font-mono uppercase">Submit Match Statistics</span>
                        </div>

                        <div className="space-y-3">
                          
                          {/* TEAM SELECT */}
                          <div>
                            <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">SELECT checked-in TEAM:</label>
                            <select
                              value={ssTeam[sc.id] || (sc.registeredTeams[0]?.teamName || "")}
                              onChange={(e) => setSsTeam(prev => ({ ...prev, [sc.id]: e.target.value }))}
                              className="w-full bg-[#151515] border border-zinc-800 text-xs px-2.5 py-1.5 text-white font-mono rounded focus:border-red-500"
                            >
                              {sc.registeredTeams.length === 0 ? (
                                <option value="">No teams checked-in yet</option>
                              ) : (
                                sc.registeredTeams.map(t => (
                                  <option key={t.teamName} value={t.teamName}>
                                    {t.teamName} {t.checkedIn ? "✅ Checked-In" : "⏳ Pending"}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* MATCH SELECTION */}
                            <div>
                              <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">MATCH NUMBER:</label>
                              <select
                                value={ssMatchNum[sc.id] || 1}
                                onChange={(e) => setSsMatchNum(prev => ({ ...prev, [sc.id]: parseInt(e.target.value) || 1 }))}
                                className="w-full bg-[#151515] border border-zinc-800 text-xs px-2 py-1 text-white font-mono rounded shadow-inner"
                              >
                                <option value={1}>Match 1 ({sc.mapName})</option>
                                <option value={2}>Match 2 ({sc.mapName})</option>
                                <option value={3}>Match 3 ({sc.mapName})</option>
                                <option value={4}>Match 4 ({sc.mapName})</option>
                              </select>
                            </div>

                            {/* PLACEMENT SELECTION */}
                            <div>
                              <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">PLACEMENT PLACE:</label>
                              <select
                                value={ssPlacement[sc.id] || 1}
                                onChange={(e) => setSsPlacement(prev => ({ ...prev, [sc.id]: parseInt(e.target.value) || 1 }))}
                                className="w-full bg-[#151515] border border-zinc-800 text-xs px-2 py-1 text-white font-mono rounded focus:border-red-500 shadow-inner"
                              >
                                <option value={1}>1st Place (10 pts)</option>
                                <option value={2}>2nd Place (6 pts)</option>
                                <option value={3}>3rd Place (5 pts)</option>
                                <option value={4}>4th Place (4 pts)</option>
                                <option value={5}>5th Place (3 pts)</option>
                                <option value={6}>6th Place (2 pts)</option>
                                <option value={7}>7th-8th Place (1 pt)</option>
                                <option value={9}>9th-16th Place (0 pts)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* KILLS INPUT */}
                            <div>
                              <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">TOTAL KILLS (1pt/ea):</label>
                              <input
                                type="number"
                                min="0"
                                max="40"
                                value={ssKills[sc.id] !== undefined ? ssKills[sc.id] : 0}
                                onChange={(e) => {
                                  let val = parseInt(e.target.value);
                                  if (isNaN(val) || val < 0) val = 0;
                                  setSsKills(prev => ({ ...prev, [sc.id]: val }));
                                }}
                                className="w-full bg-[#151515] border border-zinc-800 text-xs px-2 py-1 text-white font-mono rounded"
                              />
                            </div>

                            {/* ESTIMATE SCORE DYNAMIC PREVIEW */}
                            <div>
                              <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">CALCULATED SCORE:</label>
                              <div className="bg-zinc-950 px-2 py-1 border border-zinc-900 rounded text-center text-emerald-400 font-bold font-mono">
                                {calculatePlacementPoints(ssPlacement[sc.id] || 1) + (ssKills[sc.id] || 0)} PTS
                              </div>
                            </div>
                          </div>

                          {/* SCREENSHOT FILE UPLOADER */}
                          <div>
                            <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">UPLOAD MATCH SCREENSHOT:</label>
                            
                            <div className="space-y-2">
                              {/* Drag and Drop Zone */}
                              <div 
                                className="border-2 border-dashed border-zinc-800 hover:border-red-500/50 bg-[#121214] p-3 rounded-lg text-center cursor-pointer transition-colors space-y-1 relative group"
                                onClick={() => {
                                  const fileInput = document.getElementById(`ss-file-${sc.id}`) as HTMLInputElement;
                                  if (fileInput) fileInput.click();
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    const file = e.dataTransfer.files[0];
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      setSsImage(prev => ({ ...prev, [sc.id]: reader.result as string }));
                                      setSystemAlertMessage(`📸 Genuine file uploaded successfully to match queue.`);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              >
                                <input 
                                  id={`ss-file-${sc.id}`}
                                  type="file" 
                                  accept="image/*"
                                  className="hidden" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        setSsImage(prev => ({ ...prev, [sc.id]: reader.result as string }));
                                        setSystemAlertMessage(`📸 Genuine file uploaded successfully to match queue.`);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <Upload size={16} className="mx-auto text-zinc-500 group-hover:text-red-400 transition-colors" />
                                <p className="text-[10px] text-zinc-400 font-sans">
                                  Drag & drop or <span className="text-red-400 font-bold underline">click to select image</span>
                                </p>
                                <p className="text-[8px] text-zinc-600 font-mono">
                                  PNG, JPG, JPEG (will save locally in browser state)
                                </p>
                              </div>

                              {/* PRESETS */}
                              <div className="space-y-1 bg-black/60 p-2 rounded border border-zinc-900/60 font-sans">
                                <span className="text-[8.5px] text-zinc-500 uppercase block font-mono">Or Use Esports Sim Screenshots:</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { name: "🏆 Erangel Hub Victory", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" },
                                    { name: "🌵 Miramar Snipe", url: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop" },
                                    { name: "🌴 Sanhok Jungle Win", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" },
                                    { name: "❄️ Vikendi Avalanche", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop" }
                                  ].map(pres => {
                                    const defaultVal = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop";
                                    const isSelected = ssImage[sc.id] === pres.url || (!ssImage[sc.id] && pres.url === defaultVal);
                                    return (
                                      <button
                                        key={pres.name}
                                        type="button"
                                        onClick={() => setSsImage(prev => ({ ...prev, [sc.id]: pres.url }))}
                                        className={`px-1.5 py-1 text-[8px] text-left uppercase truncate rounded border transition-all truncate block ${
                                          isSelected ? "bg-red-950/40 border-red-500/40 text-white font-bold" : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                                        }`}
                                      >
                                        {pres.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DYNAMIC SCREENSHOT PREVIEW BAR */}
                          <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded border border-zinc-900">
                            <div className="w-10 h-10 rounded overflow-hidden bg-black shrink-0 relative border border-zinc-800">
                              <img 
                                src={ssImage[sc.id] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"} 
                                alt="screenshot"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-left py-0.5 min-w-0">
                              <span className="text-[8px] text-zinc-550 block font-mono">SELECTED SCREENSHOT SOURCE:</span>
                              <p className="text-[9.5px] font-mono text-zinc-350 truncate">
                                {ssImage[sc.id] ? (ssImage[sc.id].startsWith("data:") ? "Custom raw file upload payload" : ssImage[sc.id]) : "Standard Erangel Victory Plate"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRecordMatchResult(sc.id)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-950/20 active:translate-y-px text-white rounded font-mono font-black tracking-widest text-[9px] uppercase cursor-pointer transition-all border border-emerald-500/30 flex items-center justify-center gap-1.5"
                          >
                            <Camera size={12} />
                            <span>📢 RECORD MATCH SCREENSHOT DETAILS</span>
                          </button>
                        </div>
                      </div>

                      {/* 2. REALTIME LEADERBOARD & SCREENSHOT RECORDS GALLERY (3 columns) */}
                      <div className="lg:col-span-3 bg-black/20 p-4 rounded-xl border border-zinc-900/40 space-y-4">
                        
                        {/* Standings Table */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                            <span className="text-[10px] font-bold text-zinc-300 font-mono uppercase flex items-center gap-1.5">
                              <Trophy size={11} className="text-yellow-500" />
                              Active Scrim Live Leaderboard Standings
                            </span>
                            <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest bg-zinc-900 px-1.5 py-0.5 rounded">
                              LIVE
                            </span>
                          </div>

                          {(() => {
                            const scSubs = screenshotSubmissions.filter(sub => sub.scrimId === sc.id);
                            
                            // Compile unique registered teams
                            const allTeams = Array.from(new Set([
                              ...sc.registeredTeams.map(t => t.teamName),
                              ...scSubs.map(s => s.teamName)
                            ]));

                            const dynamicRows = allTeams.map(teamName => {
                              const teamSubs = scSubs.filter(s => s.teamName === teamName);
                              const matchesPlayed = teamSubs.length;
                              const kills = teamSubs.reduce((acc, sub) => acc + sub.kills, 0);
                              const totalPts = teamSubs.reduce((acc, sub) => acc + sub.points, 0);
                              const placementPts = totalPts - kills;

                              return {
                                teamName,
                                matchesPlayed,
                                kills,
                                placementPts,
                                totalPts
                              };
                            });

                            // Sort: Points DESC, then Kills DESC
                            dynamicRows.sort((a, b) => b.totalPts - a.totalPts || b.kills - a.kills);

                            return (
                              <div className="overflow-x-auto rounded border border-zinc-900">
                                <table className="w-full text-left font-mono text-[9.5px]">
                                  <thead>
                                    <tr className="bg-zinc-950 text-zinc-500 text-[8px] uppercase border-b border-zinc-900">
                                      <th className="py-2 px-3 text-center w-10">Rank</th>
                                      <th className="py-2 px-2">Team Name</th>
                                      <th className="py-2 px-2 text-center w-14">Matches</th>
                                      <th className="py-2 px-2 text-center w-12">Kills</th>
                                      <th className="py-2 px-2 text-center w-14">Pl. Pts</th>
                                      <th className="py-2 px-3 text-right text-emerald-400 w-16">Total Pts</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-900/60 bg-black/10">
                                    {dynamicRows.length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="py-6 text-center text-zinc-600 italic font-sans">
                                          No match stats reported. Match screenshots can be uploaded using the submit form on the left.
                                        </td>
                                      </tr>
                                    ) : (
                                      dynamicRows.map((row, idx) => {
                                        const isTop = idx === 0 && row.totalPts > 0;
                                        const isSecond = idx === 1 && row.totalPts > 0;
                                        const isThird = idx === 2 && row.totalPts > 0;
                                        
                                        return (
                                          <tr key={row.teamName} className={`hover:bg-zinc-950/40 relative transition-colors ${
                                            isTop ? "bg-yellow-950/10" : ""
                                          }`}>
                                            <td className="py-2 px-1 text-center font-bold">
                                              {isTop && "🥇"}
                                              {isSecond && "🥈"}
                                              {isThird && "🥉"}
                                              {!isTop && !isSecond && !isThird && `#${idx + 1}`}
                                            </td>
                                            <td className={`py-2 px-2 truncate font-sans font-bold max-w-[140px] truncate ${
                                              isTop ? "text-yellow-400 font-black" : "text-white"
                                            }`}>
                                              {row.teamName}
                                            </td>
                                            <td className="py-2 px-2 text-center text-zinc-400">{row.matchesPlayed}</td>
                                            <td className="py-2 px-2 text-center text-zinc-300 font-bold">{row.kills}</td>
                                            <td className="py-2 px-2 text-center text-zinc-500">{row.placementPts}</td>
                                            <td className={`py-2 px-3 text-right font-black ${
                                              isTop ? "text-yellow-400 text-xs animate-pulse" : "text-emerald-400"
                                            }`}>{row.totalPts} pts</td>
                                          </tr>
                                        );
                                      })
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Submitted Screenshot Evidence History */}
                        <div className="space-y-1.5 pt-1.5 border-t border-zinc-900/40">
                          <span className="text-[9.5px] font-bold text-zinc-450 font-mono uppercase block">
                            🖼️ MATCH SCREENSHOT EVIDENCE GALLERY
                          </span>
                          
                          {(() => {
                            const scSubs = screenshotSubmissions.filter(sub => sub.scrimId === sc.id);
                            if (scSubs.length === 0) {
                              return (
                                <p className="text-[9px] text-zinc-600 italic pl-1 leading-snug font-sans">
                                  No screenshot files uploaded. Standings are computed live once files are filed.
                                </p>
                              );
                            }
                            return (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                                {scSubs.map((sub) => (
                                  <div key={sub.id} className="bg-black/50 p-2 rounded border border-zinc-900 text-[8.5px] leading-tight space-y-1.5 relative group overflow-hidden">
                                    <div className="w-full h-16 rounded overflow-hidden bg-black border border-zinc-850 relative">
                                      <img 
                                        src={sub.screenshotUrl} 
                                        alt="screenshot submission"
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                                        <div className="text-right">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteScreenshotSubmission(sub.id, sub.teamName)}
                                            className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900 hover:text-white transition-colors cursor-pointer"
                                            title="Delete Submission Record"
                                          >
                                            <Trash2 size={10} />
                                          </button>
                                        </div>
                                        <span className="text-[7.5px] text-zinc-350 truncate">Cap: {sub.submittedBy}</span>
                                      </div>
                                    </div>

                                    <div className="text-left font-mono">
                                      <p className="text-white font-sans font-bold truncate">{sub.teamName}</p>
                                      <p className="text-zinc-500 font-sans">Match #{sub.matchNumber} Statistics</p>
                                      <div className="flex justify-between items-center text-[8px] pt-1 border-t border-zinc-900/60 text-zinc-450">
                                        <span>Place #{sub.placement} ({sub.kills} K)</span>
                                        <span className="text-emerald-400 font-bold">{sub.points} PTS</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 3. SCRIM CONTROL CENTER */}
      {activeSubTab === "control" && (
        <div className="space-y-6 text-left">
          
          {["Owner", "Head Admin", "Admin"].includes(session.role) ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* CREATE SCRIM FORM PANEL */}
              <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4 lg:col-span-1">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
                  <Plus size={16} className="text-red-500 animate-pulse" />
                  <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">
                    ⚡ CREATE NEW SCRIM SESSION
                  </h4>
                </div>

                <form onSubmit={handleCreateNewScrim} className="space-y-3 font-mono text-xs text-left">
                  <div>
                    <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Scrim Session Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Daily PMCO PMGC Level Trials"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      className="w-full bg-black border border-zinc-850 focus:border-red-500 rounded px-2 py-1.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Match Map</label>
                      <select
                        value={newMap}
                        onChange={(e) => setNewMap(e.target.value)}
                        className="w-full bg-black border border-zinc-850 rounded px-2 py-1 text-white"
                      >
                        <option value="Erangel Military Island">Erangel</option>
                        <option value="Miramar Canyon">Miramar</option>
                        <option value="Sanhok Jungle">Sanhok</option>
                        <option value="Vikendi Glacier">Vikendi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Max Slots Count</label>
                      <input
                        type="number"
                        min="2"
                        max="24"
                        value={newMaxSlots}
                        onChange={(e) => setNewMaxSlots(parseInt(e.target.value) || 12)}
                        className="w-full bg-black border border-zinc-850 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Reserved VIP Slots</label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        step="1"
                        value={newVipSlots}
                        onChange={(e) => setNewVipSlots(parseInt(e.target.value) || 0)}
                        className="w-full bg-black border border-zinc-850 rounded px-2 py-1 text-white animate-pulse"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Lobby Release (Min Before)</label>
                      <span className="w-full block bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-zinc-400">15 mins before</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-900/60 space-y-2">
                    <span className="text-[8px] text-zinc-500 uppercase block tracking-wider font-bold">TIMELINES SCHEDULER</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[7.5px] text-zinc-500 uppercase">Reg opens:</label>
                        <input
                          type="datetime-local"
                          value={newRegOpenTime}
                          onChange={(e) => setNewRegOpenTime(e.target.value)}
                          className="w-full bg-black border border-zinc-850 text-[10px] p-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[7.5px] text-zinc-500 uppercase">Reg closes:</label>
                        <input
                          type="datetime-local"
                          value={newRegCloseTime}
                          onChange={(e) => setNewRegCloseTime(e.target.value)}
                          className="w-full bg-black border border-zinc-850 text-[10px] p-1 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- REGIONAL SCRIM PARAMETERS --- */}
                  <div className="pt-2 border-t border-zinc-900/60 space-y-2">
                    <span className="text-[8px] text-zinc-500 uppercase block tracking-wider font-bold">REGIONAL ROUTING DESIGNATION</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Primary Region</label>
                        <select
                          value={newScrimRegion}
                          onChange={(e) => {
                            const reg = e.target.value as any;
                            setNewScrimRegion(reg);
                            // Auto recommend corresponding server
                            if (reg === "Africa") { setNewRecommendedServer("Cape Town 1"); setNewEstimatedLatencyMs(25); }
                            else if (reg === "Europe") { setNewRecommendedServer("London 2"); setNewEstimatedLatencyMs(18); }
                            else if (reg === "Asia") { setNewRecommendedServer("Singapore 1"); setNewEstimatedLatencyMs(35); }
                            else if (reg === "Middle East") { setNewRecommendedServer("Dubai 2"); setNewEstimatedLatencyMs(42); }
                            else if (reg === "North America") { setNewRecommendedServer("N. Virginia"); setNewEstimatedLatencyMs(22); }
                            else if (reg === "South America") { setNewRecommendedServer("Sao Paulo"); setNewEstimatedLatencyMs(30); }
                            else if (reg === "Oceania") { setNewRecommendedServer("Sydney 2"); setNewEstimatedLatencyMs(45); }
                          }}
                          className="w-full bg-black border border-zinc-850 rounded p-1 text-white text-[11px]"
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

                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Recommended Host</label>
                        <input
                          type="text"
                          value={newRecommendedServer}
                          onChange={(e) => setNewRecommendedServer(e.target.value)}
                          className="w-full bg-black border border-zinc-850 rounded p-1 text-white text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Estimated Latency</label>
                        <input
                          type="number"
                          value={newEstimatedLatencyMs}
                          onChange={(e) => setNewEstimatedLatencyMs(parseInt(e.target.value) || 20)}
                          className="w-full bg-black border border-zinc-850 rounded p-1 text-white text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Match Series Tier</label>
                        <select
                          value={newAllowedTier}
                          onChange={(e) => setNewAllowedTier(e.target.value as any)}
                          className="w-full bg-black border border-zinc-850 rounded p-1 text-white text-[11px]"
                        >
                          <option value="Open">Open (All Ranks)</option>
                          <option value="Contender">Contender (Tier 2)</option>
                          <option value="Challenger">Challenger (Tier 1)</option>
                          <option value="Elite">Elite (Pro Only)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Compatibility Rule</label>
                        <select
                          value={newServerCompatibilityRule}
                          onChange={(e) => setNewServerCompatibilityRule(e.target.value as any)}
                          className="w-full bg-black border border-zinc-850 rounded p-1 text-white text-[11px]"
                        >
                          <option value="Strict">Strict (Region Locked)</option>
                          <option value="Flexible">Flexible (Flag Outsiders)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="crossRegionInput"
                            checked={newCrossRegionEnabled}
                            onChange={(e) => setNewCrossRegionEnabled(e.target.checked)}
                            className="accent-red-500 cursor-pointer"
                          />
                          <label htmlFor="crossRegionInput" className="text-[9px] text-zinc-400 select-none uppercase font-bold cursor-pointer">Cross-Region</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pmgcMatchRulesInput"
                            checked={newPmgcRulesActive}
                            onChange={(e) => setNewPmgcRulesActive(e.target.checked)}
                            className="accent-amber-500 cursor-pointer"
                          />
                          <label htmlFor="pmgcMatchRulesInput" className="text-[9px] text-amber-500 select-none uppercase font-bold cursor-pointer animate-pulse">PMGC Rules</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Official Announcements</label>
                    <textarea
                      placeholder="Special instructions for checked-in teams."
                      value={newAnnouncement}
                      onChange={(e) => setNewAnnouncement(e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-zinc-850 text-xs p-1.5 text-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-500 mb-0.5 uppercase">Specific Match Rules</label>
                    <textarea
                      placeholder="e.g. 1. SMG usage banned..."
                      value={newRules}
                      onChange={(e) => setNewRules(e.target.value)}
                      rows={2}
                      className="w-full bg-black border border-zinc-850 text-xs p-1.5 text-white font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded-xl cursor-pointer"
                  >
                    PUBLISH LOBBY SCHEDULE
                  </button>
                </form>
              </div>

              {/* ACTIVE SESSION ATTENDANCE TRACKER & BULK REG CONTROL */}
              <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 lg:col-span-2 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-90s pb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckSquare size={16} className="text-red-500" />
                      <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">
                        🔍 COMPREHENSIVE LOBBY CONTROL & CHIEF ATTENDANCE
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4 pt-3">
                    {scrims.map((sc) => (
                      <div key={sc.id} className="bg-black/60 p-4 rounded-xl border border-zinc-900 space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <strong className="text-xs text-white uppercase font-sans">{sc.title}</strong>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleTriggerNoShowDetection(sc.id)}
                              className="px-2 py-1 bg-red-950 hover:bg-red-900/60 text-red-400 border border-red-500/20 rounded font-mono text-[8px] uppercase font-bold cursor-pointer"
                              title="Toggles any team with 'Pending' checkInStatus to 'No-Show' instantly and penalize reputation scores automatically"
                            >
                              ⏳ Trigger Auto No-Show Scan
                            </button>
                          </div>
                        </div>

                        {/* Roster list attendance control buttons */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-[10px] font-mono">
                            <thead>
                              <tr className="border-b border-zinc-900 text-zinc-550">
                                <th className="pb-1 uppercase">Clans Team Name</th>
                                <th className="pb-1 uppercase text-center">Registrar Role</th>
                                <th className="pb-1 uppercase text-center">Checking Record</th>
                                <th className="pb-1 uppercase text-right">Interactive Command Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sc.registeredTeams.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="py-2 text-center text-zinc-650 italic">
                                    No checked-in roster registries. Simulated team registers on listings panel above.
                                  </td>
                                </tr>
                              ) : (
                                sc.registeredTeams.map((team) => (
                                  <tr key={team.teamName} className="border-b border-zinc-900/50 hover:bg-zinc-950/20">
                                    <td className="py-2 text-white font-bold">{team.teamName}</td>
                                    <td className="py-2 text-center text-zinc-400">
                                      {team.isVip ? <span className="text-amber-500 uppercase font-black text-[9px]">⭐ VIP</span> : <span className="text-zinc-600">PUBLIC</span>}
                                    </td>
                                    <td className="py-2 text-center">
                                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[8px] ${
                                        team.checkInStatus === "CheckedIn" 
                                          ? "bg-emerald-550/10 text-emerald-400" 
                                          : team.checkInStatus === "Late"
                                          ? "bg-amber-500/10 text-amber-500" 
                                          : team.checkInStatus === "NoShow"
                                          ? "bg-red-550/10 text-red-500" 
                                          : "bg-zinc-900 text-zinc-500"
                                      }`}>
                                        {team.checkInStatus}
                                      </span>
                                    </td>
                                    <td className="py-2 text-right">
                                      <div className="flex gap-1 justify-end">
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateAttendanceStatus(sc.id, team.teamName, "CheckedIn")}
                                          className="p-1 hover:bg-emerald-950/40 text-emerald-500 border border-transparent hover:border-emerald-500/30 rounded"
                                          title="Check In Roster"
                                        >
                                          ✓ check
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateAttendanceStatus(sc.id, team.teamName, "Late")}
                                          className="p-1 hover:bg-amber-950/40 text-amber-500 border border-transparent hover:border-amber-500/30 rounded"
                                          title="Mark Late"
                                        >
                                          ⏰ Late
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateAttendanceStatus(sc.id, team.teamName, "NoShow")}
                                          className="p-1 hover:bg-red-955/40 text-red-500 border border-transparent hover:border-red-500/30 rounded"
                                          title="Mark No Show"
                                        >
                                          ✕ Miss
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl flex items-center justify-between text-[10px] font-mono mt-4">
                  <span className="text-zinc-600">CAPTAIN COMMANDS CONVERTED ACCESS V1.0</span>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Simulated publishing match results. Syncing to Team Hub dashboard registry.");
                    }}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    [Finalize All Match Placements]
                  </button>
                </div>
              </div>

            </div>

            {/* SMART AUTO-DECLINE & SANCTIONS MANAGEMENT MATRIX */}
            <div id="cv-smart-auto-decline-panel" className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-850 pb-3 gap-3">
                <div className="flex items-center gap-2.5 text-left">
                  <Shield id="cv-smart-shield-icon" size={18} className="text-red-500 animate-pulse animate-duration-3000" />
                  <div>
                    <h4 id="cv-smart-shield-title" className="text-xs font-black font-orbitron tracking-widest text-white uppercase">
                      🛡️ Smart Auto-Decline Settings & Sanctions Database
                    </h4>
                    <p id="cv-smart-shield-desc" className="text-[10px] text-zinc-500 font-mono">
                      Reject banned teams automatically and shield competitive lobby reliability.
                    </p>
                  </div>
                </div>

                {/* Smart Toggle */}
                <div id="cv-smart-auto-decline-toggle-wrap" className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-zinc-850">
                  <span id="cv-smart-decline-status-indic" className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
                    {smartAutoDecline ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 font-bold uppercase tracking-wider">Smart Auto-Decline: ACTIVE</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-amber-500 font-bold uppercase tracking-wider">Smart Auto-Decline: INACTIVE</span>
                      </>
                    )}
                  </span>
                  <button
                    id="cv-smart-auto-decline-toggle-btn"
                    type="button"
                    onClick={() => {
                      const nextState = !smartAutoDecline;
                      setSmartAutoDecline(nextState);
                      setSystemAlertMessage(nextState 
                        ? "🛡️ Smart Auto-Decline has been ACTIVATED. Banned/Suspended rosters will be automatically rejected."
                        : "⚠️ Smart Auto-Decline has been DEACTIVATED. Banned/Suspended rosters are now permitted to request slots (audited)."
                      );
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-bold rounded-lg cursor-pointer transition-all border ${
                      smartAutoDecline 
                        ? "bg-red-950/40 text-red-400 border-red-550/35 hover:bg-red-900/60" 
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {smartAutoDecline ? "[DEACTIVATE]" : "[ACTIVATE]"}
                  </button>
                </div>
              </div>

              <div id="cv-smart-auto-decline-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form to ban / suspend a team */}
                <div id="cv-ban-form-col" className="bg-black/40 p-4 rounded-xl border border-zinc-900/60 space-y-3 lg:col-span-1 text-left font-mono">
                  <div className="flex items-center gap-1.5 border-b border-zinc-900/50 pb-1.5">
                    <AlertCircle id="cv-ban-alert-icon" size={13} className="text-red-500" />
                    <span id="cv-ban-form-heading" className="text-[10px] font-bold font-orbitron tracking-widest text-[#ef4444] uppercase">
                      Impose Roster Sanctions
                    </span>
                  </div>

                  <form id="cv-roster-ban-form" onSubmit={handleAddBan} className="space-y-3 text-[11px]">
                    <div>
                      <label id="cv-lbl-ban-name" className="block text-[8px] text-zinc-550 mb-0.5 uppercase font-bold">Clan / Team Name</label>
                      <input
                        id="cv-input-ban-name"
                        type="text"
                        required
                        placeholder="e.g. Rebel Force, Hack Squad"
                        value={banInputTeamName}
                        onChange={(e) => setBanInputTeamName(e.target.value)}
                        className="w-full bg-black border border-zinc-850 focus:border-red-500 rounded px-2.5 py-1.5 text-white placeholder-zinc-700 text-[11px]"
                      />
                    </div>

                    <div>
                      <label id="cv-lbl-ban-reason" className="block text-[8px] text-zinc-550 mb-0.5 uppercase font-bold">Reason for Restriction</label>
                      <input
                        id="cv-input-ban-reason"
                        type="text"
                        required
                        placeholder="e.g. Intentional lobby sabotage / toxic behaviors"
                        value={banInputReason}
                        onChange={(e) => setBanInputReason(e.target.value)}
                        className="w-full bg-black border border-zinc-850 focus:border-red-500 rounded px-2.5 py-1.5 text-white placeholder-zinc-700 text-[11px]"
                      />
                    </div>

                    <div>
                      <label id="cv-lbl-ban-duration" className="block text-[8px] text-zinc-550 mb-0.5 uppercase font-bold">Restriction Period</label>
                      <select
                        id="cv-select-ban-duration"
                        value={banInputDuration}
                        onChange={(e) => setBanInputDuration(e.target.value)}
                        className="w-full bg-black border border-zinc-850 rounded px-2 py-1.5 text-white text-[11px]"
                      >
                        <option value="Permanent">Permanent Ban</option>
                        <option value="1">1 Day temporary suspension</option>
                        <option value="3">3 Days temporary suspension</option>
                        <option value="7">7 Days temporary suspension</option>
                        <option value="30">30 Days temporary suspension</option>
                      </select>
                    </div>

                    <button
                      id="cv-submit-ban-btn"
                      type="submit"
                      className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-bold tracking-widest uppercase rounded-lg cursor-pointer transition-colors mt-2 text-[11px]"
                    >
                      🔒 REGISTER SANCTION
                    </button>
                  </form>
                </div>

                {/* List of currently banned / suspended teams */}
                <div id="cv-ban-list-col" className="bg-black/40 p-4 rounded-xl border border-zinc-900/60 flex flex-col justify-between lg:col-span-2 text-left h-full min-h-[220px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-zinc-900/50 pb-1.5">
                      <span id="cv-ban-list-heading" className="text-[10px] font-bold font-orbitron tracking-widest text-zinc-300 uppercase">
                        🔒 Active Sanctions & Restriction Registry
                      </span>
                      <span id="cv-ban-list-count" className="text-[9px] text-zinc-500 font-mono">
                        Total: {bannedTeams.length} restricted records
                      </span>
                    </div>

                    <div id="cv-ban-records-scroll" className="max-h-[145px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar text-left font-mono">
                      {bannedTeams.length === 0 ? (
                        <div id="cv-no-bans-alert" className="text-center py-6 text-zinc-650 italic text-[11px] font-mono">
                          No teams are currently subject to active sanctions.
                        </div>
                      ) : (
                        bannedTeams.map((ban) => {
                          const status = getSuspensionStatusText(ban);
                          return (
                            <div
                              id={`cv-ban-entry-${ban.id}`}
                              key={ban.id}
                              className="bg-black/80 px-3 py-2 border border-zinc-900 rounded-lg flex items-center justify-between gap-3 text-[10px] hover:border-zinc-800 transition-colors"
                            >
                              <div id={`cv-ban-info-${ban.id}`} className="space-y-0.5 text-left">
                                <div className="flex items-center gap-2">
                                  <span id={`cv-ban-team-name-${ban.id}`} className="font-bold text-white text-[11px]">🎮 {ban.teamName}</span>
                                  <span id={`cv-ban-status-badge-${ban.id}`} className={`px-1 rounded text-[7.5px] font-black uppercase border ${status.color}`}>
                                    {status.text}
                                  </span>
                                </div>
                                <div id={`cv-ban-reason-text-${ban.id}`} className="text-zinc-450 leading-tight">
                                  Reason: <span className="text-zinc-300">{ban.reason}</span>
                                </div>
                                <div id={`cv-ban-date-text-${ban.id}`} className="text-[7.5px] text-zinc-600 leading-none">
                                  Registered: {new Date(ban.bannedAt).toLocaleString()}
                                </div>
                              </div>

                              <button
                                id={`cv-lift-ban-btn-${ban.id}`}
                                type="button"
                                onClick={() => handleLiftBan(ban.id, ban.teamName)}
                                className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 rounded text-[8.5px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap"
                              >
                                [Pardon / Lift]
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <p id="cv-ban-disclaimer" className="text-[8.5px] text-zinc-550 font-sans leading-normal mt-3 pt-2 border-t border-zinc-900/40">
                    💡 <strong>System Core:</strong> The Smart Matchmaker references these constraints during public or VIP slots registration. If auto-decline is disabled, active bans are logged as caution overrides under security audit records.
                  </p>
                </div>
                
              </div>
            </div>

            {/* AUTOMATED CAPTAIN NOTIFICATION DISPATCH LEDGER */}
            <div id="cv-captain-notifications-log-panel" className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-850 pb-3 gap-3">
                <div className="flex items-center gap-2.5 text-left">
                  <Bell id="cv-noti-bell-icon" size={18} className="text-red-500 animate-pulse duration-4000 animate-infinite" />
                  <div>
                    <h4 id="cv-noti-log-title" className="text-xs font-black font-orbitron tracking-widest text-white uppercase flex items-center gap-2">
                      🔔 AUTOMATED CAPTAIN ALERTS & DISPATCH LOG
                    </h4>
                    <p id="cv-noti-log-desc" className="text-[10px] text-zinc-500 font-mono">
                      Accountability registry of all automated alerts, waitlist promotions, and lobby open updates sent to captains.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    id="cv-trigger-mock-promotion-btn"
                    type="button"
                    onClick={() => {
                      triggerNotification(
                        "Promotion",
                        "Waitlist Promotion Pending Close",
                        `Team "ZIM_Ghost_07" waitlist slot elevated to Active Entry! 60s remaining to confirm.`
                      );
                      setSystemAlertMessage("🔔 Automated simulation: Waitlist Promotion Alert dispatched to Captain ZIM_Ghost_07.");
                    }}
                    className="px-2.5 py-1 bg-black text-[9px] hover:text-white hover:border-red-550 border border-zinc-850 rounded font-mono text-zinc-400 cursor-pointer uppercase transition-all"
                  >
                    ⚡ [Simulate Promotion Alert]
                  </button>
                  <button
                    id="cv-clear-noti-log-btn"
                    type="button"
                    onClick={() => {
                      setAutomatedAlertsLog([]);
                      setSystemAlertMessage("🧹 Automated alerts log archive has been purged.");
                    }}
                    className="px-2.5 py-1 bg-black text-[9px] text-red-400 hover:text-red-300 hover:border-red-900/50 border border-zinc-850 rounded font-mono cursor-pointer uppercase transition-all"
                  >
                    🗑️ [Purge Log]
                  </button>
                </div>
              </div>

              {/* Filtering & Search Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-black/40 p-3 rounded-xl border border-zinc-900">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold font-mono">Filter Alert Type:</span>
                  <div className="flex gap-1">
                    {["All", "Registration", "Promotion", "RoomCode", "Reminder"].map((type) => {
                      const isActive = selectedAlertFilter === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedAlertFilter(type)}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                            isActive 
                              ? "bg-red-950/50 text-red-400 border border-red-550/40" 
                              : "bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search by Team, Recipient or Message..."
                    value={alertSearchQuery}
                    onChange={(e) => setAlertSearchQuery(e.target.value)}
                    className="bg-black border border-zinc-850 focus:border-red-500 rounded px-2.5 py-1.5 text-white placeholder-zinc-700 text-[10px] w-full sm:w-64 font-mono"
                  />
                </div>
              </div>

              {/* Alerts List */}
              <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1 no-scrollbar text-left font-mono">
                {(() => {
                  const filteredLogs = automatedAlertsLog.filter(log => {
                    const matchesType = selectedAlertFilter === "All" || log.type === selectedAlertFilter;
                    const matchesSearch = log.recipient.toLowerCase().includes(alertSearchQuery.toLowerCase()) || 
                                          log.message.toLowerCase().includes(alertSearchQuery.toLowerCase()) ||
                                          log.title.toLowerCase().includes(alertSearchQuery.toLowerCase());
                    return matchesType && matchesSearch;
                  });

                  if (filteredLogs.length === 0) {
                    return (
                      <div className="text-center py-8 text-zinc-650 italic text-[11px]">
                        No automated alerts match selected telemetry filters.
                      </div>
                    );
                  }

                  return filteredLogs.map((log) => {
                    const iconColor = 
                      log.type === "Promotion" ? "text-amber-500 bg-amber-955/20 border-amber-500/20" :
                      log.type === "RoomCode" ? "text-blue-400 bg-blue-955/20 border-blue-500/20" :
                      log.type === "Registration" ? "text-emerald-400 bg-emerald-955/20 border-emerald-500/20" :
                      "text-zinc-400 bg-zinc-955/20 border-zinc-500/20";

                    return (
                      <div
                        id={`cv-alert-log-${log.id}`}
                        key={log.id}
                        className="bg-black/75 px-3 py-2.5 border border-zinc-900 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] hover:border-zinc-800 transition-colors"
                      >
                        <div className="space-y-1 text-left flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border tracking-wider leading-none ${iconColor}`}>
                              {log.type}
                            </span>
                            <span id={`cv-alert-title-${log.id}`} className="font-bold text-white text-[10.5px] tracking-wide font-sans">{log.title}</span>
                            <span id={`cv-alert-recipient-${log.id}`} className="text-[7.5px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900/60 font-mono">
                              Recipient: {log.recipient}
                            </span>
                          </div>
                          <p id={`cv-alert-msg-${log.id}`} className="text-zinc-450 leading-snug font-sans text-[10.5px]">{log.message}</p>
                        </div>

                        <div className="text-right shrink-0 flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 border-t sm:border-t-0 border-zinc-900 pt-1.5 sm:pt-0">
                          <span id={`cv-alert-time-${log.id}`} className="text-zinc-550 text-[8.5px] font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-emerald-950/20 text-emerald-400 rounded-lg border border-emerald-900/50 uppercase font-black tracking-widest leading-none flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            DELIVERED
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="text-left bg-zinc-950 border border-zinc-900 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[8.5px] font-mono text-zinc-555 leading-normal">
                <span className="flex items-center gap-1">
                  💡 <strong>Compliance Matrix:</strong> Automated alert logs act as deterministic records. Whenever a team registers, gets promoted, or codes release, an automated digital alert is transmitted to captain hubs.
                </span>
                <span className="whitespace-nowrap font-bold text-zinc-550 text-right uppercase">AUTOMATED AUDIT ACTIVE</span>
              </div>
            </div>

          </>
        ) : (
            <div className="bg-[#111217] p-8 rounded-2xl border border-zinc-900 text-center space-y-3">
              <Shield size={36} className="mx-auto text-zinc-500 h-10 w-10 animate-pulse" />
              <h4 className="text-sm font-black font-orbitron tracking-widest text-[#ef4444] uppercase">
                🔒 ADMIN SECURE LOCKED SECTOR
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
                The Control Center is restricted to <strong className="text-white">Admins Only</strong> (Owners, Head Admins, and Admins). Swap your user role at the top right to access these management parameters.
              </p>
            </div>
          )}

        </div>
      )}

      {/* 4. OWNER COMMAND CONSOLE */}
      {activeSubTab === "owner" && (
        <div className="space-y-6 text-left animate-fade-in">
          
          {session.role === "Owner" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* INTERACTIVE COMMAND SHELL */}
              <div className="bg-black/90 p-5 rounded-2xl border-2 border-red-655 relative overflow-hidden lg:col-span-1 flex flex-col justify-between h-[360px]">
                
                {/* Visual red scanner sweep background animation */}
                <div className="absolute inset-x-0 h-0.5 bg-red-600 top-0 opacity-15 animate-pulse" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-850 pb-2">
                    <Shield size={16} className="text-[#ff001c] animate-pulse" />
                    <h4 className="text-xs font-black font-orbitron tracking-wider text-white uppercase">
                      👑 OWNER ADMINISTRATIVE CONSOLE v4.1
                    </h4>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                    Execute privileged directives directly inside eSports system cores. Adjust roles permission vectors instantly.
                  </p>

                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-950/80 font-mono text-[9px] text-[#ef4444] space-y-1.5">
                    <strong>AVAILABLE DIRECT COMMANDS:</strong>
                    <div className="space-y-1 text-zinc-400 font-bold">
                      <p>• <span className="text-zinc-200">/grant-all-captains</span> : Assign lobby coordinate credentials</p>
                      <p>• <span className="text-zinc-200">/revoke-all-assistants</span> : Force system strict lockdowns</p>
                      <p>• <span className="text-zinc-200">/reset-all-reputations</span> : Restore reliability matrices</p>
                      <p>• <span className="text-zinc-200">/grant-role [Role_Name]</span> : Enable specify roles</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-900">
                  <form onSubmit={handleExecuteOwnerCommand} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. /grant-all-captains"
                      value={ownerCommand}
                      onChange={(e) => setOwnerCommand(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-850 focus:border-[#ef4444] rounded px-3 py-1.5 text-xs text-white font-mono placeholder-zinc-700 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-red-650 hover:bg-red-750 text-white font-mono text-[10px] font-black rounded cursor-pointer uppercase shrink-0"
                    >
                      EXECUTE
                    </button>
                  </form>
                  
                  {ownerCommandResult && (
                    <div className="py-2 px-3 bg-red-955/20 border border-red-500/20 rounded font-mono text-[9.5px] text-emerald-400 leading-tight">
                      {ownerCommandResult}
                    </div>
                  )}
                </div>

              </div>

              {/* REAL-TIME AUDIT LOGS OVERVIEW */}
              <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 lg:col-span-2 flex flex-col justify-between h-[360px]">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                    <h4 className="text-xs font-black font-orbitron tracking-widest text-zinc-400 uppercase">
                      📜 SECURITY LEDGER & ROLE AUDIT TRAILS
                    </h4>
                    <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono">ENCRYPTED PROTOCOL</span>
                  </div>

                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 pt-3 font-mono text-[10.5px]">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-2 bg-black/60 rounded border border-zinc-900/80 hover:border-zinc-800 transition flex items-start gap-3">
                        <span className="text-[10px] shrink-0 text-red-500">
                          {log.category === "Security" ? "🚨" : log.category === "RoomCode" ? "🔑" : "⚙️"}
                        </span>
                        <div className="text-left space-y-0.5 flex-1">
                          <div className="flex justify-between items-center text-[9px] text-zinc-500">
                            <strong>ACTOR: {log.actor}</strong>
                            <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-zinc-200 font-bold">{log.action}</p>
                          <p className="text-zinc-450 text-[9px] font-sans">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <span className="text-[9px] text-zinc-550 block font-mono text-center pt-2 uppercase">
                  Systems compliance auditing logs locked down to cryptographic databases
                </span>
              </div>

            </div>
          ) : (
            <div className="bg-red-950/20 border border-red-500/25 p-8 rounded-3xl text-center space-y-3">
              <AlertCircle size={40} className="mx-auto text-red-500 animate-pulse w-12 h-12" />
              <h4 className="text-sm font-black font-orbitron tracking-widest text-[#ef4444] uppercase">
                ⛔ SYSTEM SECURITY OVERRIDE BLOCKED
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Owner administrative consoles are strictly restricted in compliance with system parameters. Ensure your profile credentials possess the "Owner" authorization factor above.
              </p>
            </div>
          )}

        </div>
      )}

      {activeSubTab === "regionSys" && (() => {
        // Find user team profile context
        const userTeamProfile = teamProfiles.find(p => p.teamName === selectedUserTeam) || {
          teamName: selectedUserTeam,
          primaryRegion: "Africa" as const,
          playerLocations: ["Zimbabwe", "South Africa"],
          serverRegionPreference: "Cape Town 1",
          accountHistoryRating: "Good" as const,
          verified: true
        };

        const runPingDiagnostics = () => {
          if (diagRunning) return;
          setDiagRunning(true);
          setDiagLogs([
            "⚡ INITIALIZING ANYCAST NETWORK DIAGNOSTICS...",
            "🛰️ CONTACTING NEAREST CRIMSON VIPERS ROUTING GATEWAYS...",
            "🔍 DETECTING ACTIVE FIREWALL STACKS & HOP ROUTING..."
          ]);
          
          setTimeout(() => {
            setDiagLogs(prev => [
              ...prev,
              "🌐 Hop 1: Local ISP Gateway Node (10.0.0.1) — Time: 1.2ms [Excellent]",
              "🌐 Hop 2: Regional fiber backbone (165.25.10.1) — Time: 12.8ms [Highly Stable]",
              "🌐 Hop 3: SeaCom Submarine Optical Cable (104.9.44.20) — Time: 42.5ms",
              "🔍 REACHED ANYCAST DNS OVERLAYS — TESTING LOBBY HOST CENTE PINGS..."
            ]);
          }, 500);

          setTimeout(() => {
            setDiagLogs(prev => [
              ...prev,
              "📡 querying: CAPE TOWN 1 (196.22.4.1)  ──> Response of 24.5ms (Jitter: 0.4ms) [Optimal]",
              "📡 querying: LONDON 2 (128.2.14.3)     ──> Response of 142.1ms (Jitter: 1.8ms) [High latency]",
              "📡 querying: DUBAI 2 (85.25.18.2)     ──> Response of 195.8ms (Jitter: 2.1ms) [High Jitter]",
              "📡 querying: SINGAPORE 1 (18.15.2.12)  ──> Response of 215.3ms (Jitter: 4.5ms) [Warp Warning]",
              "📡 querying: N. VIRGINIA (52.4.11.9)   ──> Response of 268.0ms (Jitter: 6.2ms) [Unsuitable]",
              "📊 SUMMARY: 6 nodes tested, 0% packet loss metrics resolved.",
              "✅ ANYCAST DIAGNOSTIC COMPLETE: CAPE TOWN 1 is recommended (Minimal delay)."
            ]);
            setDiagRunning(false);
            setSystemAlertMessage("🎉 Diagnostics Complete! Host Cape Town 1 (Average delay: 24.5ms) is resolved.");
            awardXp(15);
          }, 1500);
        };

        const handleRequestTransfer = (e: React.FormEvent) => {
          e.preventDefault();
          if (!transferReason.trim()) {
            setSystemAlertMessage("❌ Specify a reason for requesting a region transfer.");
            return;
          }

          const alreadyPending = transferRequests.some(r => r.teamName === selectedUserTeam && r.status === "Pending");
          if (alreadyPending) {
            setSystemAlertMessage("❌ An active region transfer request is already pending verification for this team.");
            return;
          }

          const newRequest: RegionTransferRequest = {
            id: `transfer-${Date.now()}`,
            teamName: selectedUserTeam,
            currentRegion: userTeamProfile.primaryRegion,
            requestedRegion: transferTargetRegion,
            reason: transferReason,
            status: "Pending",
            timestamp: currentMockTime.toISOString()
          };

          setTransferRequests(prev => [newRequest, ...prev]);
          setTransferReason("");
          addAuditLog("Region Request Filed", "Scrim", `Team "${selectedUserTeam}" filed Region Transfer to ${transferTargetRegion}`);
          setSystemAlertMessage(`📩 Transfer Request Filed! Regional administrators have been alerted for multi-factor document and location reviews.`);
        };

        const handleProcessTransfer = (reqId: string, action: "Approved" | "Rejected") => {
          setTransferRequests(prev => prev.map(r => {
            if (r.id !== reqId) return r;
            
            if (action === "Approved") {
              // Update Team region Profile
              setTeamProfiles(profiles => profiles.map(p => {
                if (p.teamName === r.teamName) {
                  return {
                    ...p,
                    primaryRegion: r.requestedRegion,
                    verified: true,
                    verifiedBy: session.ign,
                    verificationDate: currentMockTime.toISOString()
                  };
                }
                return p;
              }));
              addAuditLog("Region Transfer Pass", "Permission", `Approved "${r.teamName}" transfer request to ${r.requestedRegion}.`);
              setSystemAlertMessage(`✅ Region transfer processed! Team "${r.teamName}" region updated to ${r.requestedRegion}.`);
            } else {
              addAuditLog("Region Transfer Deny", "Permission", `Rejected "${r.teamName}" region transfer.`);
              setSystemAlertMessage(`❌ Region transfer request rejected.`);
            }

            return {
              ...r,
              status: action
            };
          }));
        };

        const handleToggleVerifyProfile = (teamName: string) => {
          if (!["Owner", "Head Admin", "Admin"].includes(session.role)) {
            setSystemAlertMessage("❌ Access Denied: verification toggling is restricted to administrators.");
            return;
          }

          setTeamProfiles(prev => prev.map(p => {
            if (p.teamName === teamName) {
              const nextStatus = !p.verified;
              if (nextStatus) {
                return {
                  ...p,
                  verified: true,
                  verifiedBy: session.ign,
                  verificationDate: currentMockTime.toISOString()
                };
              } else {
                return {
                  ...p,
                  verified: false,
                  verifiedBy: undefined,
                  verificationDate: undefined
                };
              }
            }
            return p;
          }));
          addAuditLog("Toggle Region Verify", "Security", `Toggled verification state for roster: ${teamName}`);
          setSystemAlertMessage(`🔄 Updated verification state for "${teamName}".`);
        };

        return (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-black font-orbitron tracking-widest text-zinc-300 uppercase flex items-center gap-2">
                  🛡️ REGIONAL SCRIM MANAGEMENT SYSTEM
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono uppercase block mt-1">
                  Segmented Multi-Region Lobbying, Latency optimizations, and Multi-Factor Geographic Auditing
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-zinc-550 uppercase">VERIFICATION STRICTOR POLICY:</span>
                <button
                  onClick={() => {
                    if (!["Owner", "Head Admin"].includes(session.role)) {
                      setSystemAlertMessage("❌ Security Authorization Error: Global Policy variables restricted to Owner/Head Admin.");
                      return;
                    }
                    const next = verificationStrictness === "Strict" ? "Flexible" : "Strict";
                    setVerificationStrictness(next);
                    addAuditLog("Change Region strictness", "Security", `Set verification strictness parameter to: ${next}`);
                    setSystemAlertMessage(`⚙️ Policy changed: Region block strictness set to ${next}.`);
                  }}
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${
                    verificationStrictness === "Strict"
                      ? "bg-red-500/15 border-red-650 text-red-400"
                      : "bg-blue-500/15 border-blue-650 text-blue-400"
                  }`}
                >
                  {verificationStrictness} Block
                </button>
              </div>
            </div>

            {/* TAB INNER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Regional workspace sidebar controls */}
              <div className="bg-[#111217] p-4 rounded-2xl border border-zinc-900 lg:col-span-1 space-y-2 h-fit">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold mb-3 border-b border-zinc-900 pb-2">WORKSPACE MODULES</span>
                {[
                  { id: "dash", label: "📊 Regional Dashboard", desc: "Segmented activity stats", icon: Activity },
                  { id: "profiles", label: "🛡️ Team Region Profiles", desc: "Verified country parameters", icon: UserCheck },
                  { id: "diagnostics", label: "🛰️ Server Latency Optimizer", desc: "Diagnostic tracing engine", icon: Zap },
                  { id: "policy", label: "⚖️ Quality & Latency Policy", desc: "Rules and jitter criteria", icon: CheckSquare }
                ].map((item) => {
                  const isActive = regionSubView === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setRegionSubView(item.id as any)}
                      className={`w-full p-2.5 rounded-xl text-left border flex items-center gap-3 transition-all cursor-pointer ${
                        isActive
                          ? "bg-red-650/10 border-red-500/30 text-white"
                          : "bg-black/30 border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-black/50"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-red-500" : "text-zinc-500"} />
                      <div>
                        <div className="text-xs font-black uppercase tracking-wide leading-none">{item.label}</div>
                        <div className="text-[8px] text-zinc-500 font-mono mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Primary regional view screens */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* 1. REGIONAL DASHBOARD */}
                {regionSubView === "dash" && (
                  <div className="space-y-6">
                    
                    {/* Activity filtering panel */}
                    <div className="bg-[#111217] p-4 rounded-xl border border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-4 text-left font-mono text-xs">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase font-bold mb-1">Continent</label>
                        <select
                          value={dashContinent}
                          onChange={(e) => setDashContinent(e.target.value)}
                          className="w-full bg-black border border-zinc-850 px-2 py-1 text-white rounded"
                        >
                          <option value="All">All Continents</option>
                          <option value="Africa">Africa</option>
                          <option value="Europe">Europe</option>
                          <option value="Asia">Asia</option>
                          <option value="North America">North America</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase font-bold mb-1">Country Base</label>
                        <select
                          value={dashCountry}
                          onChange={(e) => setDashCountry(e.target.value)}
                          className="w-full bg-black border border-zinc-850 px-2 py-1 text-white rounded"
                        >
                          <option value="All">All Countries</option>
                          <option value="Zimbabwe">Zimbabwe</option>
                          <option value="South Africa">South Africa</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase font-bold mb-1">Mobile Game</label>
                        <select
                          value={dashGameTitle}
                          onChange={(e) => setDashGameTitle(e.target.value)}
                          className="w-full bg-black border border-zinc-850 px-2 py-1 text-white rounded"
                        >
                          <option value="All">All Games</option>
                          <option value="PUBG Mobile">PUBG Mobile</option>
                          <option value="Free Fire">Free Fire</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase font-bold mb-1">Competitive level</label>
                        <select
                          value={dashSkillLevel}
                          onChange={(e) => setDashSkillLevel(e.target.value)}
                          className="w-full bg-black border border-zinc-850 px-2 py-1 text-white rounded"
                        >
                          <option value="All">All Tiers</option>
                          <option value="Elite">Elite (T1)</option>
                          <option value="Challenger">Challenger</option>
                          <option value="Contender">Contender</option>
                          <option value="Open">Open League</option>
                        </select>
                      </div>
                    </div>

                    {/* Regional activity metrics bento box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#111217] p-4 rounded-xl border border-zinc-900 text-left font-mono">
                        <span className="block text-[8px] text-zinc-500 uppercase mb-1 font-bold">TOTAL REGIONAL TEAMS</span>
                        <div className="text-xl font-orbitron font-black text-white">{teamProfiles.length} Rosters</div>
                        <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">100% active verified</span>
                      </div>
                      <div className="bg-[#111217] p-4 rounded-xl border border-zinc-900 text-left font-mono">
                        <span className="block text-[8px] text-zinc-500 uppercase mb-1 font-bold">SYSTEM ACTIVE LOBBIES</span>
                        <div className="text-xl font-orbitron font-black text-red-500">{scrims.length} Matches</div>
                        <span className="text-[9px] text-zinc-500 block mt-0.5">All Anycast server nodes</span>
                      </div>
                      <div className="bg-[#111217] p-4 rounded-xl border border-zinc-900 text-left font-mono">
                        <span className="block text-[8px] text-zinc-500 uppercase mb-1 font-bold">AVERAGE SUITABLE PING</span>
                        <div className="text-xl font-orbitron font-black text-emerald-400">22.4 ms</div>
                        <span className="text-[9px] text-emerald-400/90 block mt-0.5">Jitter fluctuation 1.4ms</span>
                      </div>
                      <div className="bg-[#111217] p-4 rounded-xl border border-zinc-900 text-left font-mono">
                        <span className="block text-[8px] text-zinc-500 uppercase mb-1 font-bold">FLAGGED COMPATIBILITIES</span>
                        <div className="text-xl font-orbitron font-black text-amber-400">
                          {scrims.reduce((acc, sc) => acc + sc.registeredTeams.filter((t: any) => t.regionalStatus === "Flagged").length, 0)} Teams
                        </div>
                        <span className="text-[9px] text-zinc-500 block mt-0.5">Awaiting manual review</span>
                      </div>
                    </div>

                    {/* Region segmented lobby panels */}
                    <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-zinc-900">
                        <strong className="text-xs uppercase text-zinc-400 font-orbitron block">ACTIVE REGIONAL SCRIM MATRIX</strong>
                        
                        {/* Region quick filter tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                          {(["Africa", "Europe", "Asia", "Middle East", "North America"] as const).map((reg) => {
                            const isSel = regionBrowserSelected === reg;
                            return (
                              <button
                                key={reg}
                                onClick={() => setRegionBrowserSelected(reg)}
                                className={`px-2 py-1 rounded border ${
                                  isSel
                                    ? "bg-red-500/15 border-red-500 text-red-400 font-bold"
                                    : "bg-black/30 border-transparent text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {reg}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Filter matches for the specific continent selected */}
                      <div className="space-y-3">
                        {(() => {
                          const matchedScrims = scrims.filter(s => (s.region || "Africa") === regionBrowserSelected);
                          if (matchedScrims.length === 0) {
                            return (
                              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                                No active scrim schedules allocated for region "{regionBrowserSelected}" currently.
                              </div>
                            );
                          }

                          return matchedScrims.map((sc) => (
                            <div key={sc.id} className="bg-black/50 border border-zinc-900/60 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
                              <div className="text-left space-y-1">
                                <span className="bg-red-650/15 p-1 rounded text-[8px] text-red-400 uppercase font-black">{sc.game} — {sc.mapName}</span>
                                <h5 className="text-xs font-black text-white font-sans uppercase mt-1">{sc.title}</h5>
                                <div className="text-[10px] text-zinc-500 flex flex-wrap gap-2.5 items-center">
                                  <span>Time: <strong className="text-zinc-300">{new Date(sc.scrimTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })} UTC</strong></span>
                                  <span>|</span>
                                  <span>Slots: <strong className="text-zinc-300">{sc.registeredTeams.length} / {sc.maxSlots}</strong></span>
                                  <span>|</span>
                                  <span>Host Server: <strong className="text-zinc-300">{sc.recommendedServer || "Anycast"}</strong></span>
                                </div>
                              </div>

                              <button
                                onClick={() => setActiveSubTab("listings")}
                                className="px-3.5 py-1.5 bg-zinc-920 hover:bg-zinc-800 text-white font-bold rounded-lg border border-zinc-800 tracking-wider uppercase text-[10px]"
                              >
                                View Listing Node
                              </button>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Flagged review queues for Administrators */}
                    {["Owner", "Head Admin", "Admin", "Moderator"].includes(session.role) && (
                      <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4 text-left">
                        <strong className="text-xs uppercase text-zinc-400 font-orbitron block pb-2 border-b border-zinc-900">
                          👮 OUT-OF-REGION PLACEMENT REVIEW QUEUE (ADMIN PRIVILEGES)
                        </strong>
                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                          The Geographically Scoped review stack identifies and holds registrations that are mismatched, have out-of-boundary routing hops, or exhibit history flags. Review actions update real-time check-in authorizations.
                        </p>

                        <div className="space-y-3">
                          {(() => {
                            // Find all flagged registrants across all scrims items
                            const flaggedList: Array<{ scrim: ScrimSession, roster: ScrimTeamRegistration & { simulatedPing?: number, geoMatchPct?: number } }> = [];
                            scrims.forEach(s => {
                              s.registeredTeams.forEach((t: any) => {
                                if (t.regionalStatus === "Flagged" || t.checkInStatus === "Flagged") {
                                  flaggedList.push({ scrim: s, roster: t });
                                }
                              });
                            });

                            if (flaggedList.length === 0) {
                              return (
                                <div className="p-6 bg-black/30 border border-zinc-950 rounded-xl text-center text-zinc-500 font-mono text-[11px]">
                                  No flagged registrations pending out-of-region safety overrides Currently.
                                </div>
                              );
                            }

                            return flaggedList.map((item) => (
                              <div key={`${item.scrim.id}-${item.roster.teamName}`} className="bg-black p-4 rounded-xl border border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
                                <div className="text-left space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-white">{item.roster.teamName}</span>
                                    <span className="bg-amber-900/30 border border-amber-800/40 text-amber-500 text-[8px] px-1 rounded">Mismatched Region Flag</span>
                                  </div>
                                  <p className="text-[10px] text-zinc-500 font-sans leading-none mt-0.5">
                                    Registered for Scrim: <strong className="text-zinc-300 font-mono">{item.scrim.title} ({item.scrim.region})</strong>
                                  </p>
                                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-1">
                                    <span>Roster Locale: <strong className="text-zinc-300">{item.roster.geoMatchPct}% compatibility</strong></span>
                                    <span>|</span>
                                    <span>Est. Ping Delay: <strong className="text-red-400 font-bold">{item.roster.simulatedPing || 190}ms</strong></span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      // Approve the flagged registrant
                                      setScrims(scrims.map(s => {
                                        if (s.id !== item.scrim.id) return s;
                                        return {
                                          ...s,
                                          registeredTeams: s.registeredTeams.map(t => {
                                            if (t.teamName === item.roster.teamName) {
                                              return {
                                                ...t,
                                                checkInStatus: "Approved",
                                                regionalStatus: "Approved"
                                              } as any;
                                            }
                                            return t;
                                          })
                                        };
                                      }));
                                      addAuditLog("Approve Regional Flag", "Security", `Manually approved flagged out-of-region registration for: ${item.roster.teamName} in "${item.scrim.title}".`);
                                      setSystemAlertMessage(`✅ Cleared region check flag! Team "${item.roster.teamName}" is authorized.`);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-700/20 hover:bg-emerald-700 text-emerald-400 hover:text-white font-bold rounded text-[10px] border border-emerald-900/30 transition-all cursor-pointer"
                                  >
                                    Clear Check / Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Decline Flagged registrant (remove from registered lists)
                                      setScrims(scrims.map(s => {
                                        if (s.id !== item.scrim.id) return s;
                                        return {
                                          ...s,
                                          registeredTeams: s.registeredTeams.filter(t => t.teamName !== item.roster.teamName)
                                        };
                                      }));
                                      addAuditLog("Reject Regional Flag", "Security", `Canceled flagged out-of-region registration for: ${item.roster.teamName} in "${item.scrim.title}".`);
                                      setSystemAlertMessage(`🚫 Registration removed due to geo-block rules.`);
                                    }}
                                    className="px-2.5 py-1 bg-red-700/20 hover:bg-red-700 text-red-400 hover:text-white font-bold rounded text-[10px] border border-red-900/30 transition-all cursor-pointer"
                                  >
                                    Deny / Block
                                  </button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* 2. TEAM REGION PROFILES */}
                {regionSubView === "profiles" && (
                  <div className="space-y-6">
                    
                    {/* List of Team Region Profiles */}
                    <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 text-left space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <strong className="text-xs text-zinc-400 font-orbitron uppercase block">TEAM GEOLOACATION PROFILE MASTER DATABASE</strong>
                        <span className="text-[10px] text-zinc-500 font-mono">AUTHORIZED VERIFICATION REGISTERS</span>
                      </div>

                      <div className="overflow-x-auto text-[11px] font-mono">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-850 text-zinc-650 font-black uppercase">
                              <th className="pb-2">Registered Team</th>
                              <th className="pb-2 text-center">Assigned Continent</th>
                              <th className="pb-2 text-center">Major Roster Locales</th>
                              <th className="pb-2 text-center">Pref Server Node</th>
                              <th className="pb-2 text-center">Vetting Rating</th>
                              <th className="pb-2 text-center">Verification Status</th>
                              {["Owner", "Head Admin", "Admin"].includes(session.role) && <th className="pb-2 text-right">Admin Switch</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {teamProfiles.map((tp) => (
                              <tr key={tp.teamName} className="border-b border-zinc-900 hover:bg-zinc-950/20">
                                <td className="py-2.5 text-white font-sans font-bold">{tp.teamName}</td>
                                <td className="py-2.5 text-center text-zinc-300">{tp.primaryRegion}</td>
                                <td className="py-2.5 text-center text-zinc-400 text-[10px]">{tp.playerLocations.join(", ")}</td>
                                <td className="py-2.5 text-center text-zinc-400 text-[10px]">{tp.serverRegionPreference}</td>
                                <td className="py-2.5 text-center">
                                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                                    tp.accountHistoryRating === "Elite" ? "bg-emerald-950/35 border border-emerald-900/45 text-emerald-400" :
                                    tp.accountHistoryRating === "Good" ? "bg-blue-950/35 border border-blue-900/45 text-blue-400" :
                                    "bg-amber-950/35 border border-amber-900/45 text-amber-500"
                                  }`}>
                                    {tp.accountHistoryRating}
                                  </span>
                                </td>
                                <td className="py-2.5 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                                    tp.verified ? "bg-emerald-900/10 text-emerald-400 border border-emerald-900/20" : "bg-amber-900/10 text-amber-400 border border-amber-900/20"
                                  }`}>
                                    {tp.verified ? "VERIFIED ✅" : "PENDING REVIEW ⚠️"}
                                  </span>
                                </td>
                                {["Owner", "Head Admin", "Admin"].includes(session.role) && (
                                  <td className="py-2.5 text-right">
                                    <button
                                      onClick={() => handleToggleVerifyProfile(tp.teamName)}
                                      className="px-2 py-0.5 bg-zinc-920 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 uppercase transition-all cursor-pointer"
                                    >
                                      Toggle Vet
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Regional Transfer Request Zone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      
                      {/* Form request profile transfer */}
                      <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <strong className="text-xs uppercase text-zinc-400 font-orbitron block pb-2 border-b border-zinc-900">
                          📩 REQUEST REGIONAL TRANSFER PROFILE
                        </strong>
                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                          Captains cannot change their primary playing regions freely. Changing regions launches a routing vetting system, checking network capabilities.
                        </p>

                        <form onSubmit={handleRequestTransfer} className="space-y-3 font-mono text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Origin Base Region</label>
                              <span className="block bg-zinc-900 border border-zinc-850 rounded px-2.5 py-1 text-zinc-400 font-bold">{userTeamProfile.primaryRegion}</span>
                            </div>
                            <div>
                              <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Requested Destination</label>
                              <select
                                value={transferTargetRegion}
                                onChange={(e) => setTransferTargetRegion(e.target.value as any)}
                                className="w-full bg-black border border-zinc-850 rounded px-2 py-1 text-white"
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

                          <div>
                            <label className="block text-[8px] text-zinc-500 uppercase mb-0.5">Transfer Reason / Supporting metrics</label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Relocated bootcamp office parameters or signed new server region local players."
                              value={transferReason}
                              onChange={(e) => setTransferReason(e.target.value)}
                              className="w-full bg-black border border-zinc-850 rounded p-1.5 text-white font-sans text-xs"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl tracking-widest uppercase text-[10.5px] cursor-pointer"
                          >
                            FILE TRANSFER REQUEST
                          </button>
                        </form>
                      </div>

                      {/* Request verification list for Admin */}
                      <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4">
                        <strong className="text-xs uppercase text-zinc-400 font-orbitron block pb-2 border-b border-zinc-900">
                          📜 REGIONAL PROFILE TRANSFER PIPELINE
                        </strong>
                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                          Active submissions in the regional transfer queue. Admins must verify routing compliance before clearance.
                        </p>

                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                          {transferRequests.length === 0 ? (
                            <div className="p-8 text-center text-zinc-650 font-mono text-[10px]">
                              No region transfer requests filed in database.
                            </div>
                          ) : (
                            transferRequests.map((req) => {
                              const isPend = req.status === "Pending";
                              return (
                                <div key={req.id} className="bg-black/60 border border-zinc-950 p-3 rounded-lg text-xs font-mono space-y-1.5 text-left relative">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-white uppercase">{req.teamName}</span>
                                    <span className={`px-1 rounded text-[8px] font-black ${
                                      req.status === "Approved" ? "bg-emerald-900/10 text-emerald-400" :
                                      req.status === "Rejected" ? "bg-red-900/10 text-red-400" :
                                      "bg-amber-900/10 text-amber-400 animate-pulse"
                                    }`}>
                                      {req.status}
                                    </span>
                                  </div>

                                  <p className="text-[9.5px] text-zinc-450 leading-tight">
                                    Requested: <span className="text-red-400">{req.currentRegion}</span> ──&gt; <span className="text-emerald-400">{req.requestedRegion}</span>
                                  </p>

                                  <p className="text-[9.5px] text-zinc-500 font-sans italic truncate">
                                    Reason: "{req.reason}"
                                  </p>

                                  {isPend && ["Owner", "Head Admin", "Admin"].includes(session.role) && (
                                    <div className="flex justify-end gap-1.5 pt-1 border-t border-zinc-900 mt-1">
                                      <button
                                        onClick={() => handleProcessTransfer(req.id, "Approved")}
                                        className="px-2 py-0.5 bg-emerald-700/20 hover:bg-emerald-700 text-emerald-400 hover:text-white font-bold rounded text-[8.5px] transition-all cursor-pointer"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleProcessTransfer(req.id, "Rejected")}
                                        className="px-2 py-0.5 bg-red-700/20 hover:bg-red-700 text-red-400 hover:text-white font-bold rounded text-[8.5px] transition-all cursor-pointer"
                                      >
                                        Deny
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. SERVER LATENCY DIAGNOSTICS */}
                {regionSubView === "diagnostics" && (
                  <div className="space-y-6">
                    
                    <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 text-left space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <div>
                          <strong className="text-xs uppercase text-zinc-400 font-orbitron block">ANYCAST FIBER ROUTING LATENCY CALIBRATOR</strong>
                          <span className="text-[9.5px] text-zinc-500 font-mono uppercase block mt-1">Tests hops telemetry endpoints mapped by active player nodes</span>
                        </div>
                        <button
                          onClick={runPingDiagnostics}
                          disabled={diagRunning}
                          className="px-4 py-2 bg-red-650 hover:bg-red-700 disabled:bg-zinc-805 text-white font-bold font-mono uppercase text-[10px] rounded-lg tracking-wider border border-red-600/20 flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <RefreshCw size={11} className={diagRunning ? "animate-spin" : ""} />
                          {diagRunning ? "Diagnosing Node Hops..." : "Run Anycast Diagnostics"}
                        </button>
                      </div>

                      <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                        This network diagnostic logs simulated connections through trans-continental underwater pipelines and core BGP Anycast exchanges. Check optimal routing nodes to maintain stable lobbies.
                      </p>

                      {/* Cool terminal logs readout */}
                      <div className="bg-black border border-zinc-900 rounded-xl p-4 font-mono text-[10.5px] text-emerald-400 min-h-[220px] max-h-[300px] overflow-y-auto space-y-1 scrollbar-thin text-left">
                        {diagLogs.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full pt-12 text-zinc-600">
                            <Activity className="text-zinc-700 mb-2 animate-pulse" size={30} />
                            <span>Diagnostic interface idle. Trigger calibrated testing run above...</span>
                          </div>
                        ) : (
                          diagLogs.map((log, i) => (
                            <div key={i} className="leading-relaxed whitespace-pre-wrap">
                              {log}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Interactive ping helper info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono text-[10px]">
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900/60 leading-relaxed text-zinc-400">
                          <strong className="text-white block uppercase mb-1">🔍 Server Compatibility Recommendations</strong>
                          Teams located in <strong className="text-red-400">Southern / Central Africa</strong> must schedule meetings aligned with our <strong className="text-red-400">Cape Town 1</strong> local cluster center. Playing on London 2 is fully allowed if matchmaking administrators configure a <strong>Cross-Region Session</strong>.
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900/60 leading-relaxed text-zinc-400">
                          <strong className="text-white block uppercase mb-1">🎮 Local Ping Stability</strong>
                          Routing estimates optimize packet integrity. Ensure multi-hop connections do not include concurrent active VPN wrappers or peer sharing proxies to preserve jitter targets under 1.5ms bounds.
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. LATENCY POLICY */}
                {regionSubView === "policy" && (
                  <div className="space-y-6">
                    
                    <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 text-left space-y-4 font-mono text-xs">
                      <div className="pb-2 border-b border-zinc-900">
                        <strong className="text-xs uppercase text-zinc-400 font-orbitron block">FAIR PLAY NETWORK QUALITY POLICY & RATENCY CAPS</strong>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold mt-1">PROMOTING GEO-HYPOTHETICAL SPORTS INTEGRITY</span>
                      </div>

                      <p className="text-[10px] bg-red-950/15 border border-red-950 p-3 rounded-xl text-zinc-400 leading-relaxed">
                        ⚠️ <strong className="text-white uppercase font-black">Latency Caps Disclaimer:</strong> Internet performance depends directly on final player telemetry conditions, local internet plans, dynamic carrier server updates, and device bottlenecks. While our Regional Scrim system optimizes game selections and recommends optimal servers, Crimson Vipers eSports platform does not claim to enforce zero latency, zero ping, or zero network fluctuations outside our web host's control boundaries.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl space-y-1.5">
                          <strong className="text-red-500 uppercase font-black text-[10px] block">📏 Rule 1: Latency Cap Thresholds</strong>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Maximum playing latency allowed inside region-locked scrims is capped at <strong>250ms</strong>. If a team registers utilizing an out-of-region proxy and average packet hops exceed 250ms, admins can manually drop or suspend registration slots.
                          </p>
                        </div>

                        <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl space-y-1.5">
                          <strong className="text-red-500 uppercase font-black text-[10px] block">🛡️ Rule 2: 50% Geographic Roster Match</strong>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            At least **50%** of an active scrim roster must possess country locales matching the assigned scrim continent to pass strict automated verification pipelines. Failing this tags the team registered entry as <strong>Flagged</strong>.
                          </p>
                        </div>

                        <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl space-y-1.5">
                          <strong className="text-red-500 uppercase font-black text-[10px] block">📡 Rule 3: Jitter Caps & Fluctuations</strong>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Packet latency fluctuations (Jitter) must match stability standards (<strong className="text-emerald-400">&lt; 15ms</strong> deviation). High Jitter triggers warp effects on client terminals, altering competitive bounds.
                          </p>
                        </div>

                        <div className="bg-black/40 border border-zinc-900 p-3 rounded-xl space-y-1.5">
                          <strong className="text-red-500 uppercase font-black text-[10px] block">⚡ Rule 4: Cross-Region Authorization</strong>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Cross-Region sessions allow international teams to interact with local servers. These lobbies are marked on listings so participants can anticipate latency differences.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        );
      })()}

      {/* 5. TEAM REPUTATION LOGS */}
      {activeSubTab === "reputation" && (
        <div className="space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-black font-orbitron tracking-widest text-zinc-300 uppercase">
              📊 GLOBAL ROSTERS & CLANS REPUTATION MATRIX
            </h3>
            <span className="text-[9.5px] text-zinc-500 font-mono">AUTOMATED LATE PENALTIES CONFIGURED</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LOBBY REPUTATION RATINGS TABLE */}
            <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 lg:col-span-2 space-y-4">
              <strong className="text-xs uppercase text-zinc-400 block pb-2 border-b border-zinc-90s font-orbitron">CLUBS ATTENDANCE SCOREBOARDS</strong>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-850 text-zinc-650 font-bold uppercase">
                      <th className="pb-1.5">Registered Clan</th>
                      <th className="pb-1.5 text-center">Captain IG</th>
                      <th className="pb-1.5 text-center">Reliability Score %</th>
                      <th className="pb-1.5 text-right">Restrict Priority Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reputations.map((team) => {
                      const isLocked = team.reliabilityScore < 50;
                      return (
                        <tr key={team.teamName} className="border-b border-zinc-900 hover:bg-zinc-950/20">
                          <td className="py-3 text-white font-bold">{team.teamName}</td>
                          <td className="py-3 text-center text-zinc-400">{team.ign}</td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <strong className={`font-orbitron font-black ${
                                team.reliabilityScore > 90 ? "text-emerald-400" : team.reliabilityScore > 60 ? "text-amber-500" : "text-red-500"
                              }`}>
                                {team.reliabilityScore}%
                              </strong>
                              <div className="w-12 h-1 bg-zinc-950 rounded-full overflow-hidden shrink-0 border border-zinc-900">
                                <div className={`h-full ${
                                  team.reliabilityScore > 90 ? "bg-emerald-500" : team.reliabilityScore > 60 ? "bg-amber-500" : "bg-red-500"
                                }`} style={{ width: `${team.reliabilityScore}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            {isLocked ? (
                              <span className="text-[9px] bg-red-650/15 text-red-500 px-2 py-0.5 rounded border border-red-950 font-black animate-pulse uppercase">
                                🚫 BLOCKED PRIORITY
                              </span>
                            ) : (
                              <span className="text-[9px] bg-emerald-650/10 text-emerald-400 px-2 py-0.5 rounded uppercase font-black">
                                ✓ Certified Clear
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MANUAL REPUTATION ADJUSTMENT PANEL (Captain Overrides) */}
            <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4 lg:col-span-1">
              <strong className="text-xs uppercase text-zinc-400 block pb-2 border-b border-zinc-900 font-orbitron">⚖️ ADJUST RELIABILITY OVERLAYS</strong>

              {["Owner", "Head Admin", "Admin"].includes(session.role) ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const targetEl = document.getElementById("manual-rep-team") as HTMLSelectElement;
                    const amountEl = document.getElementById("manual-rep-amount") as HTMLInputElement;
                    const reasonEl = document.getElementById("manual-rep-reason") as HTMLInputElement;
                    handleModifyReputationManual(
                      targetEl.value,
                      parseInt(amountEl.value) || 0,
                      reasonEl.value || "Manual safety override correction."
                    );
                    reasonEl.value = "";
                  }}
                  className="space-y-3 font-mono text-xs text-left"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-550 block uppercase">TARGET CLAN:</label>
                    <select id="manual-rep-team" className="w-full bg-black border border-zinc-850 rounded px-2.5 py-1.5 text-white text-xs">
                      {reputations.map(r => (
                        <option key={r.teamName} value={r.teamName}>{r.teamName} (Has {r.reliabilityScore}%)</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-550 block uppercase">ADJUSTMENT POINTS:</label>
                    <input
                      id="manual-rep-amount"
                      type="number"
                      placeholder="e.g. -15 or +10"
                      className="w-full bg-black border border-zinc-850 rounded px-2.5 py-1 text-white text-xs"
                      defaultValue="-10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-550 block uppercase">EXPLICIT REASON:</label>
                    <input
                      id="manual-rep-reason"
                      type="text"
                      placeholder="e.g. Failure to comply with checkins"
                      required
                      className="w-full bg-black border border-zinc-850 rounded px-2.5 py-1 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-black tracking-wider uppercase rounded-xl cursor-pointer"
                  >
                    Adjust Reliability Profile
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-red-955/20 border border-red-950 rounded text-[10px] text-red-400 leading-relaxed font-mono text-center">
                  ⚠️ Require Admin role capabilities to override team reputation ratings manually. Modify roles at the top selector to demo.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 6. SCRIM ANALYTICS DASHBOARD */}
      {activeSubTab === "stats" && (
        <div className="space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-black font-orbitron tracking-widest text-[#ef4444] uppercase">
              📊 SEASONAL COMBAT WORKOUT DIAGNOSTICS & STATS
            </h3>
            <span className="text-xs text-zinc-500 font-mono">WEEKS AGGREGATES v2.9</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* BIG ANALYTICS CHARTS SCREEN */}
            <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 lg:col-span-2 space-y-4">
              <strong className="text-xs uppercase text-zinc-400 block pb-1 border-b border-zinc-900 font-orbitron">📊 PARTICIPATION & WAITLIST OVERLOOK DEMAND</strong>
              
              <div className="w-full h-64 font-sans text-xs pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ffd700" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="name" stroke="#555" />
                    <YAxis stroke="#555" />
                    <Tooltip contentStyle={{ backgroundColor: "#0b0c10", borderColor: "#222" }} />
                    <Legend />
                    <Area type="monotone" dataKey="Total Registrations" stroke="#ef4444" fillOpacity={1} fill="url(#colorRegs)" />
                    <Area type="monotone" dataKey="Waitlist Claims" stroke="#ffd700" fillOpacity={1} fill="url(#colorClaims)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK HEALTH METRICS PANEL */}
            <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 space-y-4 lg:col-span-1 text-left flex flex-col justify-between">
              <div>
                <strong className="text-xs uppercase text-zinc-400 block pb-2 border-b border-zinc-900 font-orbitron">📈 CHIEF STATS FACT CARD</strong>
                
                <div className="space-y-3.5 pt-3 font-mono text-xs">
                  <div className="bg-black/40 p-2.5 rounded border border-zinc-900 flex justify-between items-center">
                    <span className="text-zinc-500">Waitlist Success Rate:</span>
                    <strong className="text-white text-sm font-black text-emerald-450">74.2%</strong>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded border border-zinc-900 flex justify-between items-center">
                    <span className="text-zinc-500">Average lobby fill time:</span>
                    <strong className="text-white text-sm">4m 12s</strong>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded border border-zinc-900 flex justify-between items-center">
                    <span className="text-zinc-500">Check-in Compliance:</span>
                    <strong className="text-[#ef4444] text-sm font-black">96.8%</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-90s mt-4">
                <button
                  type="button"
                  onClick={() => {
                    alert("Generating raw CSV logs... Download simulation completed.");
                  }}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-850 hover:text-white rounded-xl text-zinc-400 font-mono text-xs transition uppercase flex items-center justify-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Export Season Report</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 7. SMART NOTIFICATIONS CHANNEL SIMULATOR */}
      {activeSubTab === "notifications" && (
        <div className="space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-sm font-black font-orbitron tracking-widest text-zinc-300 uppercase">
              🔔 SECURE CHANNELS & SMART MESSAGING CONSOLE
            </h3>
            <span className="text-xs text-zinc-500 font-mono font-bold">MUTUAL NOTIFIER ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* TOGGLE CHANNELS CONTROLLER */}
            <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 lg:col-span-1 space-y-4 text-left">
              <strong className="text-xs uppercase text-zinc-400 block pb-2 border-b border-zinc-900 font-orbitron">🔔 BROADCAST CHANNELS</strong>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-red-500" />
                    <span>Website Sounds Alert</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 text-red-500 outline-none rounded border border-zinc-800"
                  />
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-amber-500" />
                    <span>Mock Email notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 outline-none rounded border border-zinc-800"
                  />
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40 border border-zinc-900">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-emerald-500" />
                    <span>CV Automate BOT stream</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={botEnabled}
                    onChange={(e) => setBotEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 outline-none rounded"
                  />
                </div>
              </div>

              <div className="p-3 bg-red-955/20 border border-red-950 rounded text-[9.5px] text-zinc-400 leading-relaxed font-mono">
                💡 Reminders trigger automatically when roster check-ins launch, lobby keys publish, or slot promotions change.
              </div>
            </div>

            {/* LIVE SIMULATED MESSAGE FEED TERMINAL */}
            <div className="bg-[#111217] p-5 rounded-2xl border border-zinc-900 lg:col-span-2 space-y-4 flex flex-col justify-between h-[360px]">
              <div>
                <strong className="text-xs uppercase text-zinc-400 block pb-2 border-b border-zinc-900 font-orbitron">📟 SIMULATED MESSAGE FEED INBOX</strong>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 pt-3 font-mono text-xs">
                  {notifications.length === 0 ? (
                    <p className="text-zinc-600 text-center py-8 italic font-sans">
                      Simulate register slot bookings, promotion acceptances above to receive instant live stream messages!
                    </p>
                  ) : (
                    notifications.map((msg) => (
                      <div key={msg.id} className="p-2.5 bg-black rounded border border-zinc-900 hover:border-zinc-800 transition flex items-center justify-between gap-3 text-left">
                        <div className="flex items-start gap-2.5">
                          <span className="text-red-500 ring-2 ring-red-950/20 p-1 bg-zinc-950/80 rounded-lg">
                            {msg.channel === "email" ? "✉️" : msg.channel === "bot" ? "🤖" : "📱"}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-white block uppercase tracking-wide leading-tight">{msg.title}</span>
                            <span className="text-zinc-[350] text-[10px] block font-sans">{msg.message}</span>
                          </div>
                        </div>

                        <span className="text-[8px] text-zinc-600 shrink-0 font-bold whitespace-nowrap">{msg.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <span className="text-[9px] text-zinc-550 block font-mono text-center pt-2 uppercase">
                Dual end-to-end socket messaging simulated telemetry
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// Inline helper checks
function teamNameIsUsers(teamName: string) {
  return teamName === "CV Crimson";
}

// Quality algorithm for computing average workout rank based on rosters checked-in
function getScrimCompetitiveness(igns: string[]) {
  if (igns.length === 0) {
    return {
      text: "Pending Members",
      avgTier: "Unranked Mode",
      avgValue: 0.0,
      color: "bg-zinc-950/20 border-zinc-850 text-zinc-450"
    };
  }

  // Pre-seed some default ranks for simulation
  const ranksSeed: Record<string, { tier: string, value: number }> = {
    "CV_Slayer_IGL": { tier: "Conqueror", value: 8.0 },
    "VIP_Zeus": { tier: "Grandmaster", value: 7.2 },
    "Hydra_Focus": { tier: "Ace Master", value: 6.5 },
    "Frost_Odin": { tier: "Ace", value: 5.8 },
    "ToxicCoder_99": { tier: "Crown III", value: 4.2 },
    "Capt_Apex Raiders": { tier: "Ace Master", value: 6.5 },
    "Capt_Zero Elite": { tier: "Conqueror", value: 8.0 },
    "Capt_Elite Force": { tier: "Diamond II", value: 3.2 }
  };

  const playersMapped = igns.map(ign => {
    return {
      ign,
      rank: ranksSeed[ign]?.tier || "Crown I",
      val: ranksSeed[ign]?.value || 4.5
    };
  });

  const aggregateValue = playersMapped.reduce((acc, curr) => acc + curr.val, 0);
  const avg = Number((aggregateValue / igns.length).toFixed(1));

  let textStatus = "Standard training";
  let tierLabel = "Ace";
  let styling = "bg-[#111]/60 border-zinc-900 text-zinc-400";

  if (avg > 7.0) {
    textStatus = "⭐ PRO SQUAD CLASH";
    tierLabel = "Conqueror Elite";
    styling = "bg-gradient-to-r from-red-950/30 to-black/40 border-red-500/15 text-red-400";
  } else if (avg > 5.5) {
    textStatus = "🔥 ADVANCED ELITE SCRIMS";
    tierLabel = "Ace Master";
    styling = "bg-gradient-to-r from-amber-500/5 to-black/30 border-amber-550/15 text-amber-500";
  }

  return {
    text: textStatus,
    avgTier: tierLabel,
    avgValue: avg,
    color: styling,
    breakdown: playersMapped
  };
}
