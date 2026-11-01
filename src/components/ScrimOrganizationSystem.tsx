import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  Shield,
  Gamepad,
  Clock,
  Unlock,
  Lock,
  MessageSquare,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Trash2,
  X,
  Plus,
  Compass,
  FileText,
  Bookmark,
  Activity,
  UserPlus,
  Power,
  Volume2,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Settings,
  Tv,
  Users2,
  Send,
  Zap,
  Info,
  Layers,
  Sparkles
} from "lucide-react";

// --- HOOK-FRIENDLY STATIC ENUMERABLES ---
const REGIONS = [
  "Africa",
  "Europe",
  "Asia",
  "Middle East",
  "North America",
  "South America",
  "Oceania"
];

const PLATFORMS = [
  "Twitch",
  "YouTube",
  "TikTok",
  "Facebook Gaming",
  "Kick"
];

// --- INTERFACES ---
export interface ScrimMember {
  ign: string;
  role: "Owner" | "Manager" | "Captain" | "Player";
  joinedAt: string;
}

export interface ScrimOrganization {
  id: string;
  name: string;
  logo: string; // Emoji
  banner: string; // Tailwind class
  region: string;
  gameTitle: string;
  ownerIgn: string;
  roster: ScrimMember[];
  primaryManager: string;
  secondaryManager: string | null;
  reliabilityScore: number; // 0 - 100
  reliabilityRank: "Excellent" | "Good" | "Average" | "Warning" | "Restricted";
  attendanceCount: number;
  checkInCount: number;
  noShowCount: number;
  sportsmanshipRating: number; // 1-5
  registrationSuspensionUntil: string | null; // ISO Date String
  lateCancellationsCount: number;
  statistics: {
    matches: number;
    wins: number;
    podiums: number;
    kills: number;
  };
}

export interface ScrimEvent {
  id: string;
  title: string;
  region: string;
  gameTitle: string;
  maxSlots: number;
  matchSchedule: string;
  regionRequirements: string;
  registrationOpen: boolean;
  registrationTimer: string; // Dynamic presentation
  roomCode: {
    roomId: string;
    roomPass: string;
    releasedAt: string | null;
  } | null;
  status: "Registration Open" | "Locked" | "Completed";
}

export interface ScrimRegistration {
  id: string;
  scrimId: string;
  teamId: string;
  teamName: string;
  slotNumber: number;
  region: string;
  registeredAt: string;
  managerIgn: string;
  reliabilityRank: "Excellent" | "Good" | "Average" | "Warning" | "Restricted";
}

export interface ScrimWaitlist {
  id: string;
  scrimId: string;
  teamId: string;
  teamName: string;
  region: string;
  queuedAt: string;
  managerIgn: string;
  position: number;
}

export interface ScrimAnnouncement {
  id: string;
  scrimId: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface ScrimChatMessage {
  id: string;
  scrimId: string;
  senderIgn: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface LiveStream {
  id: string;
  streamerName: string;
  teamName: string;
  region: string;
  streamTime: string;
  platform: string;
  directStreamLink: string;
}

interface ScrimOrganizationSystemProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
  onGoHome: () => void;
}

export default function ScrimOrganizationSystem({
  currentIgn,
  onAlert,
  onGoHome
}: ScrimOrganizationSystemProps) {
  // --- STATE ---
  const [activeRegion, setActiveRegion] = useState<string>("Africa");
  const [organizations, setOrganizations] = useState<ScrimOrganization[]>([
    {
      id: "org-1",
      name: "Zulu Combat Squad",
      logo: "🦁",
      banner: "bg-gradient-to-r from-amber-950 to-red-950",
      region: "Africa",
      gameTitle: "PUBG Mobile",
      ownerIgn: "Z_Tiger_IGL",
      primaryManager: "Z_Tiger_IGL",
      secondaryManager: null,
      reliabilityScore: 98,
      reliabilityRank: "Excellent",
      attendanceCount: 15,
      checkInCount: 15,
      noShowCount: 0,
      sportsmanshipRating: 4.9,
      registrationSuspensionUntil: null,
      lateCancellationsCount: 0,
      roster: [
        { ign: "Z_Tiger_IGL", role: "Owner", joinedAt: "2026-01-10" },
        { ign: "Z_Rhino_M4", role: "Captain", joinedAt: "2026-01-12" },
        { ign: "Z_Leopard_Scope", role: "Player", joinedAt: "2026-01-15" },
        { ign: "Z_Eagle_CQB", role: "Player", joinedAt: "2026-01-15" }
      ],
      statistics: { matches: 20, wins: 5, podiums: 11, kills: 142 }
    },
    {
      id: "org-2",
      name: "Cyber Vikings",
      logo: "⚡",
      banner: "bg-gradient-to-r from-cyan-950 to-blue-950",
      region: "Europe",
      gameTitle: "PUBG Mobile",
      ownerIgn: "CV_Thor_Elite",
      primaryManager: "CV_Thor_Elite",
      secondaryManager: "CV_Freya_Strategy",
      reliabilityScore: 94,
      reliabilityRank: "Excellent",
      attendanceCount: 22,
      checkInCount: 21,
      noShowCount: 1,
      sportsmanshipRating: 4.7,
      registrationSuspensionUntil: null,
      lateCancellationsCount: 1,
      roster: [
        { ign: "CV_Thor_Elite", role: "Owner", joinedAt: "2026-03-01" },
        { ign: "CV_Freya_Strategy", role: "Manager", joinedAt: "2026-03-02" },
        { ign: "CV_Odin_Lead", role: "Captain", joinedAt: "2026-03-05" },
        { ign: "CV_Loki_Flick", role: "Player", joinedAt: "2026-03-10" }
      ],
      statistics: { matches: 30, wins: 9, podiums: 17, kills: 233 }
    },
    {
      id: "org-3",
      name: "Kuro Shana Instinct",
      logo: "⚔️",
      banner: "bg-gradient-to-r from-red-950 to-emerald-950",
      region: "Asia",
      gameTitle: "PUBG Mobile",
      ownerIgn: "Kuro_Kaze",
      primaryManager: "Kuro_Kaze",
      secondaryManager: null,
      reliabilityScore: 82,
      reliabilityRank: "Average",
      attendanceCount: 12,
      checkInCount: 10,
      noShowCount: 2,
      sportsmanshipRating: 4.1,
      registrationSuspensionUntil: null,
      lateCancellationsCount: 2,
      roster: [
        { ign: "Kuro_Kaze", role: "Owner", joinedAt: "2026-02-15" },
        { ign: "Chrono_Slayer", role: "Captain", joinedAt: "2026-02-18" },
        { ign: "Genji_Tracer", role: "Player", joinedAt: "2026-02-20" },
        { ign: "Hanzo_AWM", role: "Player", joinedAt: "2026-02-20" }
      ],
      statistics: { matches: 15, wins: 2, podiums: 5, kills: 78 }
    },
    {
      id: "org-4",
      name: "Raging Shamans",
      logo: "🌪️",
      banner: "bg-gradient-to-r from-purple-950 to-fuchsia-950",
      region: "Africa",
      gameTitle: "PUBG Mobile",
      ownerIgn: "Shaman_Vibe",
      primaryManager: "Shaman_Vibe",
      secondaryManager: null,
      reliabilityScore: 68,
      reliabilityRank: "Warning",
      attendanceCount: 8,
      checkInCount: 5,
      noShowCount: 3,
      sportsmanshipRating: 3.5,
      registrationSuspensionUntil: null,
      lateCancellationsCount: 3,
      roster: [
        { ign: "Shaman_Vibe", role: "Owner", joinedAt: "2026-04-01" },
        { ign: "Spooky_Dancer", role: "Captain", joinedAt: "2026-04-02" },
        { ign: "Bones_Shooter", role: "Player", joinedAt: "2026-04-04" },
        { ign: "Grave_Digger", role: "Player", joinedAt: "2026-04-04" }
      ],
      statistics: { matches: 8, wins: 1, podiums: 2, kills: 41 }
    }
  ]);

  const [scrimEvents, setScrimEvents] = useState<ScrimEvent[]>([
    {
      id: "scrim-af-1",
      title: "Zulu Apex Tier-1 Squad Combat",
      region: "Africa",
      gameTitle: "PUBG Mobile",
      maxSlots: 10,
      matchSchedule: "Tonight @ 20:00 UTC (4 Maps: Erangel, Miramar, Sanhok, Vikendi)",
      regionRequirements: "Must hold an Excellent or Good Team Reliability rank. Minimum 4 verified players on Roster.",
      registrationOpen: false,
      registrationTimer: "Closed",
      roomCode: {
        roomId: "ID-1182743",
        roomPass: "zulu2026",
        releasedAt: "2026-06-13T09:00:00Z"
      },
      status: "Completed"
    },
    {
      id: "scrim-eu-1",
      title: "Euro Gladiators Pro Lobby",
      region: "Europe",
      gameTitle: "PUBG Mobile",
      maxSlots: 12,
      matchSchedule: "Tomorrow @ 18:00 UTC (3 Maps: Erangel, Erangel, Miramar)",
      regionRequirements: "Must present local European latency proof under 80ms. Fully verified roster.",
      registrationOpen: false,
      registrationTimer: "Closed",
      roomCode: {
        roomId: "ID-9082348",
        roomPass: "euro2026",
        releasedAt: "2026-06-13T09:00:00Z"
      },
      status: "Completed"
    },
    {
      id: "scrim-as-1",
      title: "Nippon-ASEAN Speedrun Scrims",
      region: "Asia",
      gameTitle: "PUBG Mobile",
      maxSlots: 15,
      matchSchedule: "Completed Just Now (Match ID: CV-AS-8492)",
      regionRequirements: "No active suspensions allowed. Open registration with automatic waitlist promote.",
      registrationOpen: false,
      registrationTimer: "Closed",
      roomCode: {
        roomId: "ID-8829402",
        roomPass: "scrim2026",
        releasedAt: "2026-06-10T09:00:00Z"
      },
      status: "Completed"
    }
  ]);

  const [registrations, setRegistrations] = useState<ScrimRegistration[]>([
    {
      id: "reg-1",
      scrimId: "scrim-af-1",
      teamId: "org-1",
      teamName: "Zulu Combat Squad",
      slotNumber: 1,
      region: "Africa",
      registeredAt: "2026-06-10T08:15:00Z",
      managerIgn: "Z_Tiger_IGL",
      reliabilityRank: "Excellent"
    }
  ]);

  const [waitlists, setWaitlists] = useState<ScrimWaitlist[]>([]);

  const [announcements, setAnnouncements] = useState<ScrimAnnouncement[]>([
    {
      id: "ann-1",
      scrimId: "scrim-af-1",
      title: "Lobby Rules & Anti-Cheat Check",
      content: "Ensure all players have their anti-cheat integrity logs synced prior to entering room slots. Check-ins open 15 minutes before match schedule.",
      timestamp: "10 mins ago"
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ScrimChatMessage[]>([
    {
      id: "chat-1",
      scrimId: "scrim-af-1",
      senderIgn: "Z_Tiger_IGL",
      role: "Owner",
      message: "Zulu Combat is present and fully synchronized! Ready for coordinates.",
      timestamp: "5 mins ago"
    }
  ]);

  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([
    {
      id: "stream-1",
      streamerName: "NinjaStrike_ZIM",
      teamName: "Zulu Combat Squad",
      region: "Africa",
      streamTime: "20:00 - 22:30 BST",
      platform: "YouTube",
      directStreamLink: "https://youtube.com"
    },
    {
      id: "stream-2",
      streamerName: "VikingsLive_EU",
      teamName: "Cyber Vikings",
      region: "Europe",
      streamTime: "18:00 - 20:30 CET",
      platform: "Twitch",
      directStreamLink: "https://twitch.tv"
    }
  ]);

  // UI State
  const [activeSubTab, setActiveSubTab] = useState<"lobby" | "organizations" | "streaming" | "reliability">("lobby");
  const [selectedOrgs, setSelectedOrgs] = useState<string | null>(null);

  // Forms
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgLogo, setNewOrgLogo] = useState("🦊");
  const [newOrgRegion, setNewOrgRegion] = useState("Africa");
  
  const [inviteIgnAddress, setInviteIgnAddress] = useState("");
  const [inviteRoleSelection, setInviteRoleSelection] = useState<"Manager" | "Captain" | "Player">("Player");

  const [newStreamer, setNewStreamer] = useState({
    name: "",
    team: "",
    region: "Africa",
    time: "",
    platform: "Twitch",
    link: ""
  });

  const [lobbyInputText, setLobbyInputText] = useState("");

  const [adminRoomId, setAdminRoomId] = useState("");
  const [adminRoomPass, setAdminRoomPass] = useState("");

  // --- DERIVED SATE & UTILS ---
  // Find current user's organization ownership/managed status
  const userOrganizations = organizations.filter(
    (org) =>
      org.ownerIgn === currentIgn ||
      org.primaryManager === currentIgn ||
      org.secondaryManager === currentIgn ||
      org.roster.some((m) => m.ign === currentIgn)
  );

  const activeScrim = scrimEvents.find((evt) => evt.region === activeRegion && evt.status !== "Completed") || scrimEvents[0];

  const currentRegionRegistrations = registrations.filter((r) => r.scrimId === activeScrim?.id);
  const currentRegionWaitlists = waitlists.filter((w) => w.scrimId === activeScrim?.id);

  // Determine if the user has a registered team in the active scrim
  const userRegisteredUnderScrim = currentRegionRegistrations.find((reg) => {
    const org = organizations.find((o) => o.id === reg.teamId);
    if (!org) return false;
    return (
      org.ownerIgn === currentIgn ||
      org.primaryManager === currentIgn ||
      org.secondaryManager === currentIgn ||
      org.roster.some((m) => m.ign === currentIgn)
    );
  });

  // Determine if waitlisted
  const userWaitlistedUnderScrim = currentRegionWaitlists.find((wt) => {
    const org = organizations.find((o) => o.id === wt.teamId);
    if (!org) return false;
    return (
      org.ownerIgn === currentIgn ||
      org.primaryManager === currentIgn ||
      org.secondaryManager === currentIgn ||
      org.roster.some((m) => m.ign === currentIgn)
    );
  });

  // Identify user's team relation context for credentials
  const userTeamIdInActiveScrim = userRegisteredUnderScrim?.teamId || userWaitlistedUnderScrim?.teamId;
  const userTeamInActiveScrim = organizations.find((o) => o.id === userTeamIdInActiveScrim);

  // Checks recipient access
  // "The person who registers the team automatically becomes the Primary Manager. Only the Primary Manager can: Receive room codes, access chat, etc. If a Secondary Manager is assigned, the Primary Manager stops receiving. Only Secondary receives."
  const isAuthorizedRecipient = () => {
    if (!userTeamInActiveScrim) return false;
    if (userTeamInActiveScrim.secondaryManager) {
      return userTeamInActiveScrim.secondaryManager === currentIgn;
    }
    return userTeamInActiveScrim.primaryManager === currentIgn;
  };

  const hasScrimAccess = userRegisteredUnderScrim !== undefined;
  const hasWaitlistAccess = userWaitlistedUnderScrim !== undefined;

  // --- HANDLERS ---
  const handleCreateOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) {
      onAlert("⚠️ Organization Name cannot be blank.");
      return;
    }

    const collision = organizations.find((org) => org.name.toLowerCase() === newOrgName.trim().toLowerCase());
    if (collision) {
      onAlert("⚠️ An organization with this identical name exists.");
      return;
    }

    const newOrg: ScrimOrganization = {
      id: "org-" + Date.now(),
      name: newOrgName.trim(),
      logo: newOrgLogo,
      banner: "bg-gradient-to-r from-red-950 to-neutral-900",
      region: newOrgRegion,
      gameTitle: "PUBG Mobile",
      ownerIgn: currentIgn,
      primaryManager: currentIgn,
      secondaryManager: null,
      reliabilityScore: 100,
      reliabilityRank: "Excellent",
      attendanceCount: 0,
      checkInCount: 0,
      noShowCount: 0,
      sportsmanshipRating: 5.0,
      registrationSuspensionUntil: null,
      lateCancellationsCount: 0,
      roster: [
        { ign: currentIgn, role: "Owner", joinedAt: new Date().toISOString().split("T")[0] }
      ],
      statistics: { matches: 0, wins: 0, podiums: 0, kills: 0 }
    };

    setOrganizations([...organizations, newOrg]);
    setSelectedOrgs(newOrg.id);
    setNewOrgName("");
    onAlert(`🛡️ Registered Scrim Organization ${newOrg.name} has been initiated successfully!`);
  };

  const handleInviteToOrg = (orgId: string) => {
    if (!inviteIgnAddress.trim()) {
      onAlert("⚠️ Please declare a target player Gamer Tag (IGN).");
      return;
    }

    setOrganizations(
      organizations.map((org) => {
        if (org.id !== orgId) return org;
        if (org.roster.some((m) => m.ign.toLowerCase() === inviteIgnAddress.toLowerCase())) {
          return org;
        }
        return {
          ...org,
          roster: [
            ...org.roster,
            { ign: inviteIgnAddress.trim(), role: inviteRoleSelection, joinedAt: new Date().toISOString().split("T")[0] }
          ]
        };
      })
    );

    onAlert(`➕ Invited ${inviteIgnAddress.trim()} as ${inviteRoleSelection} to the Organization roster.`);
    setInviteIgnAddress("");
  };

  const handleUpdateSecondaryManager = (orgId: string, secondary: string | null) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id !== orgId) return org;
        return {
          ...org,
          secondaryManager: secondary ? secondary : null
        };
      })
    );
    if (secondary) {
      onAlert(`🔒 Assigned Secondary Manager ${secondary}. Primary Manager access is now securely suspended.`);
    } else {
      onAlert(`🔓 Secondary Manager cleared. Primary Manager access is restored.`);
    }
  };

  const handleKickMember = (orgId: string, ign: string) => {
    if (ign === currentIgn) {
      onAlert("⚠️ You cannot kick yourself from your own organization.");
      return;
    }
    setOrganizations(
      organizations.map((org) => {
        if (org.id !== orgId) return org;
        return {
          ...org,
          roster: org.roster.filter((r) => r.ign !== ign),
          primaryManager: org.primaryManager === ign ? org.ownerIgn : org.primaryManager,
          secondaryManager: org.secondaryManager === ign ? null : org.secondaryManager
        };
      })
    );
    onAlert(`🚪 Removed ${ign} from the organization roster.`);
  };

  const handleRegisterActiveScrim = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (!org) return;

    // Check suspension
    if (org.registrationSuspensionUntil && new Date(org.registrationSuspensionUntil) > new Date()) {
      const remainingHours = Math.ceil(
        (new Date(org.registrationSuspensionUntil).getTime() - new Date().getTime()) / 3600000
      );
      onAlert(`🚨 Your organization is suspended from scrim registration for late-withdrawal. Under restriction for ${remainingHours} hours.`);
      return;
    }

    // Check region
    if (org.region !== activeScrim.region) {
      onAlert(`⚠️ Regional Mismatch! ${org.name} belongs to ${org.region}, while this hub is reserved for ${activeScrim.region}.`);
      return;
    }

    // Check roster count (min 4 players)
    if (org.roster.length < 4) {
      onAlert(`⚠️ Minimum Requirements failure: Scrim organization roster requires at least 4 registered players (currently ${org.roster.length}).`);
      return;
    }

    // Check already registered
    const alreadyReg = registrations.find((r) => r.scrimId === activeScrim.id && r.teamId === orgId);
    const alreadyWait = waitlists.find((r) => r.scrimId === activeScrim.id && r.teamId === orgId);
    if (alreadyReg || alreadyWait) {
      onAlert(`⚠️ Your organization is already scheduled in this scrimmage.`);
      return;
    }

    const isFull = currentRegionRegistrations.length >= activeScrim.maxSlots;

    if (!isFull) {
      // Direct registration
      const newRegistration: ScrimRegistration = {
        id: "reg-" + Date.now(),
        scrimId: activeScrim.id,
        teamId: org.id,
        teamName: org.name,
        slotNumber: currentRegionRegistrations.length + 1,
        region: org.region,
        registeredAt: new Date().toISOString(),
        managerIgn: currentIgn,
        reliabilityRank: org.reliabilityRank
      };

      setRegistrations([...registrations, newRegistration]);
      onAlert(`✅ Successfully REGISTERED ${org.name} for the scrimmage! Slot #${newRegistration.slotNumber} assigned.`);
    } else {
      // Place into waitlist
      const waitlistPos = currentRegionWaitlists.length + 1;
      const newWaitlisted: ScrimWaitlist = {
        id: "wait-" + Date.now(),
        scrimId: activeScrim.id,
        teamId: org.id,
        teamName: org.name,
        region: org.region,
        queuedAt: new Date().toISOString(),
        managerIgn: currentIgn,
        position: waitlistPos
      };

      setWaitlists([...waitlists, newWaitlisted]);
      onAlert(`⏳ Scrim Hub Filled! ${org.name} has been placed on the regional waitlist at position #${waitlistPos}.`);
    }
  };

  const handleWithdrawScrim = (teamId: string) => {
    // Check if cancellation is late (within 3 hours / mock check)
    // We will do a mock late check based on simple state
    const isLateCancel = Math.random() > 0.4; // 60% probability check or selection for immersive realism
    const org = organizations.find((o) => o.id === teamId);
    if (!org) return;

    // Remove from registrations
    const isInRegistrations = registrations.some((r) => r.scrimId === activeScrim.id && r.teamId === teamId);

    if (isInRegistrations) {
      setRegistrations(registrations.filter((r) => !(r.scrimId === activeScrim.id && r.teamId === teamId)));

      if (isLateCancel) {
        // Late cancellation penalty
        const suspensionDate = new Date();
        suspensionDate.setDate(suspensionDate.getDate() + 2); // 2-day suspension
        const suspensionISO = suspensionDate.toISOString();

        let newRank: "Excellent" | "Good" | "Average" | "Warning" | "Restricted" = "Good";
        if (org.reliabilityScore <= 70) newRank = "Restricted";
        else if (org.reliabilityScore <= 80) newRank = "Warning";
        else if (org.reliabilityScore <= 90) newRank = "Average";

        setOrganizations(
          organizations.map((o) => {
            if (o.id !== teamId) return o;
            const updatedScore = Math.max(0, o.reliabilityScore - 15);
            return {
              ...o,
              reliabilityScore: updatedScore,
              lateCancellationsCount: o.lateCancellationsCount + 1,
              registrationSuspensionUntil: suspensionISO,
              reliabilityRank: updatedScore >= 90 ? "Excellent" : updatedScore >= 80 ? "Good" : updatedScore >= 70 ? "Average" : updatedScore >= 50 ? "Warning" : "Restricted"
            };
          })
        );

        onAlert(`🚨 LATE CANCELLATION DETECTED! Automated 2-day suspension applied to ${org.name}. Reliability score reduced.`);
      } else {
        onAlert(`✅ EARLY CANCELLATION: ${org.name} withdrew from scrimmage. No penalty applied.`);
      }

      // Automatically promote first waitlisted team
      const regionalWaitlisted = waitlists.filter((w) => w.scrimId === activeScrim.id);
      if (regionalWaitlisted.length > 0) {
        const sortedWait = [...regionalWaitlisted].sort((a, b) => a.position - b.position);
        const promotedTeam = sortedWait[0];

        // Assign spot
        const newReg: ScrimRegistration = {
          id: "reg-prom-" + Date.now(),
          scrimId: activeScrim.id,
          teamId: promotedTeam.teamId,
          teamName: promotedTeam.teamName,
          slotNumber: currentRegionRegistrations.length, // Fill the empty index safely
          region: promotedTeam.region,
          registeredAt: new Date().toISOString(),
          managerIgn: promotedTeam.managerIgn,
          reliabilityRank: organizations.find((o) => o.id === promotedTeam.teamId)?.reliabilityRank || "Excellent"
        };

        // Remove from waitlist & promote
        setWaitlists(waitlists.filter((w) => w.id !== promotedTeam.id));
        setRegistrations((prevReg) => {
          // Re-sort existing and insert new slot numbers
          const withoutWithdrawn = prevReg.filter((r) => !(r.scrimId === activeScrim.id && r.teamId === teamId));
          const withNew = [...withoutWithdrawn, newReg];
          return withNew.map((r, index) => ({ ...r, slotNumber: index + 1 }));
        });

        onAlert(`⚡ WAITLIST PROMOTED! ${promotedTeam.teamName} has been upgraded to official registered status. Slot assigned!`);
      } else {
        // Re-calculate slots logic
        setRegistrations((prevReg) => {
          const filtered = prevReg.filter((r) => r.teamId !== teamId);
          return filtered.map((r, index) => ({ ...r, slotNumber: index + 1 }));
        });
      }
    } else {
      // Simply remove from waitlist
      setWaitlists(waitlists.filter((w) => !(w.scrimId === activeScrim.id && w.teamId === teamId)));
      onAlert(`✅ Withdrew organization from the active waitlist.`);
    }

    // Re-index remaining waitlists
    setWaitlists((prevWait) => {
      const activeWait = prevWait.filter((w) => w.scrimId === activeScrim.id && w.teamId !== teamId);
      const otherRegions = prevWait.filter((w) => w.scrimId !== activeScrim.id);
      const reindexed = activeWait.map((w, index) => ({ ...w, position: index + 1 }));
      return [...otherRegions, ...reindexed];
    });
  };

  const handleAdminUpdateSlot = (regId: string, currentSlot: number, direction: "up" | "down") => {
    const sorted = [...currentRegionRegistrations].sort((a, b) => a.slotNumber - b.slotNumber);
    const index = sorted.findIndex((r) => r.id === regId);
    if (index === -1) return;

    let targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    // Swap slots
    const itemA = sorted[index];
    const itemB = sorted[targetIdx];

    const tempSlot = itemA.slotNumber;
    itemA.slotNumber = itemB.slotNumber;
    itemB.slotNumber = tempSlot;

    setRegistrations(
      registrations.map((reg) => {
        if (reg.id === itemA.id) return { ...reg, slotNumber: itemA.slotNumber };
        if (reg.id === itemB.id) return { ...reg, slotNumber: itemB.slotNumber };
        return reg;
      })
    );
    onAlert(`⚙️ Admin updated squad slot placements.`);
  };

  const handlePublishRoomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRoomId.trim() || !adminRoomPass.trim()) {
      onAlert("⚠️ Lobby details are required.");
      return;
    }

    setScrimEvents(
      scrimEvents.map((evt) => {
        if (evt.id !== activeScrim.id) return evt;
        return {
          ...evt,
          roomCode: {
            roomId: adminRoomId.trim(),
            roomPass: adminRoomPass.trim(),
            releasedAt: new Date().toISOString()
          }
        };
      })
    );

    const matchInfoBroadcast: ScrimAnnouncement = {
      id: "ann-rm-" + Date.now(),
      scrimId: activeScrim.id,
      title: "📡 LOBBY ROOM CODE SECURE BROADCAST",
      content: `LOBBY COORDINATES RELEASED ONLY TO TEAM RECIPIENTS. ROOM ID: ${adminRoomId.trim()} | PASSKEY: ${adminRoomPass.trim()}`,
      timestamp: "Just now"
    };

    setAnnouncements([matchInfoBroadcast, ...announcements]);
    setAdminRoomId("");
    setAdminRoomPass("");
    onAlert("🔑 Custom Room Codes have been securely dispatched to registered team recipients!");
  };

  const handleAdminLockScrim = () => {
    setScrimEvents(
      scrimEvents.map((evt) => {
        if (evt.id !== activeScrim.id) return evt;
        return {
          ...evt,
          status: "Locked",
          registrationOpen: false
        };
      })
    );
    onAlert("🔒 Registration locked. Official Squad List matches are now frozen and generated.");
  };

  const handleAdminConcludeScrim = () => {
    // 1. Grant attendance/ratings to registered squads
    const updatedOrgs = organizations.map((org) => {
      const isRegistered = currentRegionRegistrations.some((r) => r.teamId === org.id);
      if (!isRegistered) return org;

      // Attendance check
      const didCheckIn = Math.random() > 0.15; // 85% normal match check-in status
      const scoreGain = didCheckIn ? 2 : -25;
      const finalScore = Math.min(100, Math.max(0, org.reliabilityScore + scoreGain));

      let rank: "Excellent" | "Good" | "Average" | "Warning" | "Restricted" = "Excellent";
      if (finalScore <= 50) rank = "Restricted";
      else if (finalScore <= 70) rank = "Warning";
      else if (finalScore <= 80) rank = "Average";
      else if (finalScore <= 90) rank = "Good";

      return {
        ...org,
        attendanceCount: org.attendanceCount + 1,
        checkInCount: org.checkInCount + (didCheckIn ? 1 : 0),
        noShowCount: org.noShowCount + (didCheckIn ? 0 : 1),
        reliabilityScore: finalScore,
        reliabilityRank: rank,
        statistics: {
          ...org.statistics,
          matches: org.statistics.matches + 1,
          wins: org.statistics.wins + (Math.random() > 0.9 ? 1 : 0),
          podiums: org.statistics.podiums + (Math.random() > 0.7 ? 1 : 0),
          kills: org.statistics.kills + Math.floor(Math.random() * 15 + 5)
        }
      };
    });

    setOrganizations(updatedOrgs);

    // 2. Clear current registered & waitlists for future scrims
    setRegistrations(registrations.filter((r) => r.scrimId !== activeScrim.id));
    setWaitlists(waitlists.filter((w) => w.scrimId !== activeScrim.id));

    // 3. Mark completed
    setScrimEvents(
      scrimEvents.map((evt) => {
        if (evt.id !== activeScrim.id) return evt;
        return {
          ...evt,
          status: "Completed",
          roomCode: null
        };
      })
    );

    onAlert("🏁 Scrim concluded! Access permissions flushed, team records and reliability stats safely archived.");
  };

  const handlePostLobbyMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lobbyInputText.trim()) return;

    const newMsg: ScrimChatMessage = {
      id: "msg-" + Date.now(),
      scrimId: activeScrim.id,
      senderIgn: currentIgn,
      role: activeSubTab === "organizations" ? "Owner/Manager" : "Verified Participant",
      message: lobbyInputText.trim(),
      timestamp: "Just now"
    };

    setChatMessages([...chatMessages, newMsg]);
    setLobbyInputText("");
  };

  const handleRegisterStreamer = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, team, region, time, platform, link } = newStreamer;
    if (!name || !team || !time || !link) {
      onAlert("⚠️ All visual streaming fields must be finalized.");
      return;
    }

    const newStreamObj: LiveStream = {
      id: "stream-" + Date.now(),
      streamerName: name,
      teamName: team,
      region,
      streamTime: time,
      platform,
      directStreamLink: link
    };

    setLiveStreams([newStreamObj, ...liveStreams]);
    setNewStreamer({
      name: "",
      team: "",
      region: "Africa",
      time: "",
      platform: "Twitch",
      link: ""
    });
    onAlert(`📺 Live schedule initialized for secondary streamer: ${name}`);
  };

  return (
    <div className="bg-[#0b0b0c] text-[#f3f4f6] min-h-screen p-4 md:p-8 font-sans border border-neutral-900 rounded-3xl overflow-hidden mt-2 select-none">
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-900 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 px-2.5 bg-red-950/40 text-red-500 border border-red-900/30 font-mono text-[9px] uppercase font-bold tracking-widest rounded-md">
              OFFICIAL COMPILATION
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">ID: {activeScrim?.id || "N/A"}</span>
          </div>
          <h1 className="text-3xl font-black italic tracking-wide uppercase text-white flex items-center gap-3">
            <Trophy className="text-[#E10600] animate-pulse" size={28} />
            CV SCRIM <span className="text-[#E10600]">ORGANIZATIONS</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-1 leading-relaxed">
            Multi-region independent professional scrim hub. Form custom squad entities, earn attendance ratings, unlock waitlists, and coordinate custom scrim lobbies dynamically.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onGoHome();
              onAlert("🏆 Returning to home quadrant");
            }}
            className="p-2.5 px-4 bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 font-mono text-xs rounded-xl border border-neutral-800/40 transition-all flex items-center gap-2 font-bold"
          >
            <Compass size={14} />
            HOMEPAGE
          </button>
        </div>
      </div>

      {/* REGIONAL CONTROLLER BAR */}
      <div className="bg-[#101011] p-2 rounded-2xl border border-neutral-900 flex flex-wrap gap-1 mb-6">
        {REGIONS.map((region) => {
          const isActive = activeRegion === region;
          return (
            <button
              key={region}
              onClick={() => {
                setActiveRegion(region);
                onAlert(`📡 Synchronized to regional hub: ${region.toUpperCase()}`);
              }}
              className={`p-2 px-4 transition-all duration-250 font-mono text-xs font-black rounded-xl uppercase tracking-wider flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#E10600] text-white shadow-lg shadow-red-900/20"
                  : "bg-transparent text-neutral-500 hover:text-white"
              }`}
            >
              {region === activeRegion && <Zap size={11} className="animate-pulse" />}
              {region}
            </button>
          );
        })}
      </div>

      {/* INNER SUB-TABS */}
      <div className="flex flex-wrap border-b border-neutral-900 mb-6 gap-2">
        <button
          onClick={() => setActiveSubTab("lobby")}
          className={`pb-3 text-xs font-mono font-black uppercase tracking-widest flex items-center gap-2 px-2 transition-all relative ${
            activeSubTab === "lobby" ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Gamepad size={14} />
          {activeRegion} Hub Lobby
          {activeSubTab === "lobby" && (
            <motion.div layoutId="subtabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E10600]" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("organizations")}
          className={`pb-3 text-xs font-mono font-black uppercase tracking-widest flex items-center gap-2 px-2 transition-all relative ${
            activeSubTab === "organizations" ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Users size={14} />
          Scrim Organizations ({organizations.filter((o) => o.region === activeRegion).length})
          {activeSubTab === "organizations" && (
            <motion.div layoutId="subtabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E10600]" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("streaming")}
          className={`pb-3 text-xs font-mono font-black uppercase tracking-widest flex items-center gap-2 px-2 transition-all relative ${
            activeSubTab === "streaming" ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Tv size={14} />
          Who's Streaming today
          {activeSubTab === "streaming" && (
            <motion.div layoutId="subtabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E10600]" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("reliability")}
          className={`pb-3 text-xs font-mono font-black uppercase tracking-widest flex items-center gap-2 px-2 transition-all relative ${
            activeSubTab === "reliability" ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Activity size={14} />
          Team Reliability Scoreboard
          {activeSubTab === "reliability" && (
            <motion.div layoutId="subtabBorder" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E10600]" />
          )}
        </button>
      </div>

      {/* TAB CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: LOBBY HUB AREA */}
        {activeSubTab === "lobby" && (
          <>
            {/* LEFT 7 COLUMNS: ACTIVE SCRIM & CHANNELS */}
            <div className="lg:col-span-8 space-y-6">
              {activeScrim ? (
                <div className="bg-[#111112] border border-neutral-900 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/20 rounded-full blur-3xl -z-10" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-neutral-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-0.5 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[9px] font-mono tracking-widest uppercase rounded">
                          {activeScrim.status}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">MAX SLOTS: {activeScrim.maxSlots}</span>
                      </div>
                      <h2 className="text-xl font-bold text-white uppercase italic mt-1.5">{activeScrim.title}</h2>
                    </div>

                    <div className="bg-[#09090a] border border-neutral-800/80 p-2.5 px-4 rounded-xl flex items-center gap-3">
                      <Clock size={16} className="text-red-500" />
                      <div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">REGISTRATION TIMER</div>
                        <div className="text-xs font-black text-red-400 font-mono">{activeScrim.registrationTimer}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-neutral-300 mb-6 bg-[#0a0a0b] p-4 rounded-xl border border-neutral-800/20">
                    <div>
                      <span className="text-[#E10600] font-black mr-1">🗺️ MAP ROTATION:</span> {activeScrim.matchSchedule}
                    </div>
                    <div>
                      <span className="text-[#E10600] font-black mr-1">🛡️ REGION AUDIT:</span> {activeScrim.regionRequirements}
                    </div>
                  </div>

                  {/* ACCOUNT SUMMARY INTEGRATION IN LOBBY */}
                  <div className="bg-[#070708] border border-neutral-800/60 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">GAMER IDENTITY</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{currentIgn}</span>
                        <span className="p-0.5 px-1.5 bg-zinc-800 text-zinc-400 text-[9px] uppercase font-bold rounded">
                          PARTICIPANT
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {userOrganizations.filter((o) => o.region === activeRegion).map((org) => {
                        const isRegistered = currentRegionRegistrations.some((r) => r.teamId === org.id);
                        const isWaitlisted = currentRegionWaitlists.some((w) => w.teamId === org.id);

                        return (
                          <div key={org.id} className="flex items-center gap-2 bg-[#121213] p-1.5 px-3 rounded-lg border border-neutral-800">
                            <span className="text-xs">{org.logo}</span>
                            <span className="text-xs font-mono font-medium text-neutral-300 mr-2">{org.name}</span>
                            
                            {isRegistered ? (
                              <button
                                onClick={() => handleWithdrawScrim(org.id)}
                                className="p-1 px-2.5 bg-red-950/40 hover:bg-red-900 border border-red-900/40 text-[#E10600] text-[10px] uppercase font-mono tracking-widest rounded-md font-black transition-colors"
                              >
                                WITHDRAW
                              </button>
                            ) : isWaitlisted ? (
                              <button
                                onClick={() => handleWithdrawScrim(org.id)}
                                className="p-1 px-2.5 bg-yellow-950/40 hover:bg-yellow-900 border border-yellow-900/40 text-yellow-500 text-[10px] uppercase font-mono tracking-widest rounded-md font-black transition-colors"
                              >
                                LEAVE WAITLIST
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRegisterActiveScrim(org.id)}
                                className="p-1 px-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/40 text-emerald-400 text-[10px] uppercase font-mono tracking-widest rounded-md font-black transition-all flex items-center gap-1.5"
                              >
                                <Plus size={10} /> REGISTER TEAM
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {userOrganizations.filter((o) => o.region === activeRegion).length === 0 && (
                        <div className="text-xs text-neutral-500 italic flex items-center gap-2">
                          <Info size={12} />
                          No Organizations constructed in {activeRegion}. Please form an organization to schedule matches.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#111112] p-8 rounded-2xl border border-neutral-900 text-center text-neutral-500 font-mono text-xs">
                  ❌ No scrim events active in this region. Form an event or check alternative region hubs.
                </div>
              )}

              {/* AUTOMATED ACCESSIBILITY CHANNEL CONTROL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CHANNEL 1: LOBBY ANNOUNCEMENTS */}
                <div className="bg-[#101011] border border-neutral-950 rounded-2xl p-5 flex flex-col h-[340px]">
                  <h3 className="text-xs font-black tracking-widest font-mono text-white select-none pb-2 header-bar flex items-center gap-2 border-b border-neutral-800 uppercase">
                    <Megaphone size={14} className="text-[#E10600] animate-bounce" />
                    Lobby Announcements
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-3 py-3 scrollbar-thin">
                    {announcements.filter((ann) => ann.scrimId === activeScrim?.id).map((ann) => (
                      <div key={ann.id} className="bg-[#09090a] p-3 rounded-lg border border-neutral-900 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider font-mono">
                            {ann.title}
                          </span>
                          <span className="text-[8px] text-neutral-500 font-mono">{ann.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed font-mono">{ann.content}</p>
                      </div>
                    ))}
                    {announcements.filter((ann) => ann.scrimId === activeScrim?.id).length === 0 && (
                      <div className="text-center text-neutral-600 font-mono text-[11px] pt-12">
                        No official announcements published.
                      </div>
                    )}
                  </div>
                </div>

                {/* CHANNEL 2: CHATS & MESSAGES COORDINATION */}
                <div className="bg-[#101011] border border-[#121213] rounded-2xl p-5 flex flex-col h-[340px]">
                  <h3 className="text-xs font-black tracking-widest font-mono text-white select-none pb-2 header-bar flex items-center justify-between border-b border-neutral-800 uppercase">
                    <span className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-[#E10600]" />
                      Manager & Participant Chat
                    </span>
                    <span className="p-0.5 px-2 bg-neutral-900 text-neutral-500 text-[8px] font-mono rounded">
                      {hasScrimAccess ? "WRITE GRANTED" : "LOCKED"}
                    </span>
                  </h3>

                  {hasScrimAccess ? (
                    <>
                      <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-2 scrollbar-thin">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className="text-xs space-y-0.5">
                            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400">
                              <span className="font-bold text-neutral-300">
                                {msg.senderIgn}{" "}
                                <span className="text-[8px] uppercase tracking-widest text-[#E10600] font-black bg-neutral-900 p-0.5 px-1 rounded ml-1">
                                  {msg.role}
                                </span>
                              </span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <div className="bg-[#141415] border border-neutral-900 p-2.5 rounded text-neutral-200">
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handlePostLobbyMessage} className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={lobbyInputText}
                          onChange={(e) => setLobbyInputText(e.target.value)}
                          placeholder="Broadcast tactical dispatch to lobby..."
                          className="flex-1 bg-[#09090a] border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="bg-[#E10600] text-white p-2 px-3.5 rounded text-xs transition-colors hover:bg-neutral-900 flex items-center gap-1.5 font-bold"
                        >
                          <Send size={11} />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                      <Lock className="text-neutral-500 mb-2" size={20} />
                      <div className="text-xs font-mono font-bold text-neutral-400">RESTRICTED MEMBRES AREA</div>
                      <p className="text-[10px] text-neutral-600 max-w-xs mt-1 leading-normal font-mono uppercase">
                        Requires official active registered team status under {activeRegion} to view and participate in tactical manager conversations.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* CREDENTIALS ROOM DEPLOYMENT */}
              <div className="p-5 bg-[#141416] border border-neutral-950 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="text-yellow-500" size={14} />
                    <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">LOBBY ENTRANCE DETAILS</h3>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase leading-relaxed">
                    Custom IDs or passkeys are sent automatically. Only the active recipient can retrieve codes.
                  </p>
                </div>

                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900 min-w-[240px] flex flex-col gap-1 text-center font-mono">
                  {userTeamInActiveScrim ? (
                    isAuthorizedRecipient() ? (
                      activeScrim.roomCode ? (
                        <>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">TARGET ROOM SPECIFICATIONS</div>
                          <div className="text-md font-bold text-[#E10600] mt-1">ROOM ID: {activeScrim.roomCode.roomId}</div>
                          <div className="text-xs text-zinc-300">PASSKEY: {activeScrim.roomCode.roomPass}</div>
                          <div className="text-[8px] text-zinc-500 mt-1">RELEASED: {new Date(activeScrim.roomCode.releasedAt!).toLocaleTimeString()}</div>
                        </>
                      ) : (
                        <div className="text-xs text-zinc-500 italic p-2">
                          ⏳ Lobby coordinates schedule pending release. Watch Announcements.
                        </div>
                      )
                    ) : (
                      <div className="text-xs text-yellow-600 border border-yellow-900/30 bg-yellow-950/20 rounded p-2 text-left italic">
                        🚫 Primary access redirected. Recipients rights have been designated to secondary managers roles. Wait for communications.
                      </div>
                    )
                  ) : (
                    <div className="text-xs text-neutral-500 italic p-2">
                      🔒 No scheduled team registered is eligible to fetch active entrance.
                    </div>
                  )}
                </div>
              </div>

              {/* ADMIN PANEL CONSOLE (DUMMY AUTH) */}
              <div className="bg-red-950/10 border border-red-900/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-red-900/20">
                  <Shield className="text-red-500" size={18} />
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">ADMIN SECURITY CONSOLE</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAdminLockScrim}
                    disabled={activeScrim?.status !== "Registration Open"}
                    className="p-2 px-4 bg-red-950/50 hover:bg-red-900 border border-red-900/30 text-white font-mono text-[11px] font-black uppercase rounded-lg transition-all disabled:opacity-50"
                  >
                    Lock Registration
                  </button>
                  <button
                    onClick={handleAdminConcludeScrim}
                    className="p-2 px-4 bg-zinc-900 hover:bg-zinc-800 border border-neutral-800 text-zinc-300 font-mono text-[11px] font-black uppercase rounded-lg transition-all"
                  >
                    Conclude Scrim (Clear & Record Stats)
                  </button>
                </div>

                <form onSubmit={handlePublishRoomCode} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 items-end">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">ROOM ID</label>
                    <input
                      required
                      type="text"
                      value={adminRoomId}
                      onChange={(e) => setAdminRoomId(e.target.value)}
                      placeholder="e.g. 849204"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded p-2 text-xs text-white uppercase focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">PASSKEY</label>
                    <input
                      required
                      type="text"
                      value={adminRoomPass}
                      onChange={(e) => setAdminRoomPass(e.target.value)}
                      placeholder="e.g. cv91"
                      className="w-full bg-neutral-950 border border-neutral-900 rounded p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#E10600] text-white p-2 rounded text-xs transition-colors hover:bg-neutral-900 font-bold uppercase tracking-wider font-mono"
                  >
                    Broadcast Coordinates
                  </button>
                </form>
              </div>

            </div>

            {/* RIGHT 4 COLUMNS: SQUAD LIST & WAITLIST PANELS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* SQUAD LIST SYSTEM */}
              <div className="bg-[#101011] border border-neutral-900 p-5 rounded-2xl flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-805">
                  <h3 className="text-xs font-black tracking-widest font-mono text-white select-none uppercase flex items-center gap-1.5">
                    <Layers size={14} className="text-red-500" />
                    Squad Slots Available ({currentRegionRegistrations.length}/{activeScrim?.maxSlots})
                  </h3>
                  <span className="p-0.5 px-2 bg-red-950 text-red-400 text-[8px] font-mono rounded font-black">
                    {activeScrim?.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 overflow-y-auto max-h-[350px] scrollbar-thin">
                  {currentRegionRegistrations.map((reg, index) => {
                    const org = organizations.find((o) => o.id === reg.teamId);
                    return (
                      <div key={reg.id} className="bg-[#09090a] p-3 rounded-lg border border-neutral-800/40 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1 px-2.5 bg-neutral-900 text-neutral-400 border border-neutral-800 text-[10px] font-mono font-black rounded-md">
                            #{reg.slotNumber}
                          </span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                              {reg.teamName}
                              {org?.reliabilityRank === "Excellent" && <Sparkles size={11} className="text-yellow-500" />}
                            </div>
                            <div className="text-[9px] text-zinc-500 font-mono">{reg.managerIgn}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Admin arrows to adjust slots */}
                          <button
                            onClick={() => handleAdminUpdateSlot(reg.id, reg.slotNumber, "up")}
                            disabled={index === 0}
                            className="p-1 bg-neutral-900 text-neutral-400 transition-colors hover:text-white rounded disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleAdminUpdateSlot(reg.id, reg.slotNumber, "down")}
                            disabled={index === currentRegionRegistrations.length - 1}
                            className="p-1 bg-neutral-900 text-neutral-400 transition-colors hover:text-white rounded disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {currentRegionRegistrations.length === 0 && (
                    <div className="text-center font-mono text-[10px] text-zinc-600 italic py-12">
                      Lobby roster empty. Ready for registrations.
                    </div>
                  )}
                </div>
              </div>

              {/* AUTOMATED WAITLIST PANEL */}
              <div className="bg-[#101011] border border-neutral-900 p-5 rounded-2xl flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-805">
                  <h3 className="text-xs font-black tracking-widest font-mono text-white select-none uppercase flex items-center gap-1.5">
                    <Clock size={14} className="text-[#E10600]" />
                    Waitlist Ledger ({currentRegionWaitlists.length})
                  </h3>
                </div>

                <div className="mt-4 space-y-2 overflow-y-auto max-h-[300px] scrollbar-thin">
                  {currentRegionWaitlists.map((wt) => (
                    <div key={wt.id} className="bg-[#101011] p-3 rounded-lg border border-neutral-800/30 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white font-mono">{wt.teamName}</div>
                        <div className="text-[9px] text-neutral-500 font-mono">POS #{wt.position} | {wt.managerIgn}</div>
                      </div>
                      <span className="p-1 px-2.5 bg-yellow-950/20 text-yellow-500 text-[9px] font-mono rounded">
                        QUEUEING
                      </span>
                    </div>
                  ))}

                  {currentRegionWaitlists.length === 0 && (
                    <div className="text-center text-zinc-600 font-mono text-[10px] italic py-12">
                      No organizations currently waitlisted.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </>
        )}

        {/* TAB 2: ORGANIZATIONS MANAGER */}
        {activeSubTab === "organizations" && (
          <div className="lg:col-span-12 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT 5 COLUMNS: SCRIM ORG LIST & INITIAL FORM */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* INITIAL ORG FORM */}
                <div className="bg-[#101011] border border-neutral-950 p-5 rounded-2xl">
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest pb-3 border-b border-neutral-800 mb-4">
                    🛠️ FORM NEW SCRIM ORGANIZATION
                  </h3>

                  <form onSubmit={handleCreateOrganizationSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-mono tracking-widest text-[#B5B5B5] font-black font-sans">ORGANIZATION NAME</label>
                      <input
                        required
                        type="text"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        placeholder="e.g. Zulu Combat Squad"
                        className="w-full bg-neutral-950 border border-neutral-900 rounded p-3 text-xs text-white focus:outline-none focus:border-[#E10600] font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-[#B5B5B5] font-black font-sans font-mono">EMOJI LOGO</label>
                        <select
                          value={newOrgLogo}
                          onChange={(e) => setNewOrgLogo(e.target.value)}
                          className="w-full bg-[#0a0a0b] border border-neutral-900 rounded p-3 text-xs text-white"
                        >
                          <option value="🦁">🦁 LION</option>
                          <option value="⚔️">⚔️ BLADES</option>
                          <option value="⚡">⚡ BLITZ</option>
                          <option value="🌪️">🌪️ VORTEX</option>
                          <option value="🐍">🐍 PYTHON</option>
                          <option value="🐺">🐺 WOLVES</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-[#B5B5B5] font-black font-sans font-mono">REGULATORY REGION</label>
                        <select
                          value={newOrgRegion}
                          onChange={(e) => setNewOrgRegion(e.target.value)}
                          className="w-full bg-[#0a0a0b] border border-neutral-900 p-3 text-xs text-white"
                        >
                          {REGIONS.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E10600] text-white p-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all hover:bg-neutral-900 flex items-center justify-center gap-2"
                    >
                      <Plus size={14} /> Establish Team Profile
                    </button>
                  </form>
                </div>

                {/* CURRENT SQUADS SECTION REGIONAL FILTER */}
                <div className="bg-[#101011] p-5 rounded-2xl border border-neutral-950 space-y-3">
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                    Organizations registered in {activeRegion}
                  </h3>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
                    {organizations.filter((o) => o.region === activeRegion).map((org) => {
                      const isOwner = org.ownerIgn === currentIgn;
                      return (
                        <div
                          key={org.id}
                          onClick={() => setSelectedOrgs(org.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                            selectedOrgs === org.id
                              ? "bg-red-950/20 border-red-900"
                              : "bg-[#09090a] border-neutral-900 hover:border-neutral-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{org.logo}</span>
                            <div>
                              <h4 className="font-bold text-white text-xs font-mono">{org.name}</h4>
                              <p className="text-[10px] text-neutral-500 font-mono">HQ OWNER: {org.ownerIgn}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase">RELIABILITY score</div>
                            <div className={`text-xs font-black font-mono ${
                              org.reliabilityScore >= 90
                                ? "text-emerald-400"
                                : org.reliabilityScore >= 70
                                ? "text-yellow-500"
                                : "text-[#E10600]"
                            }`}>
                              {org.reliabilityScore}% ({org.reliabilityRank})
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {organizations.filter((o) => o.region === activeRegion).length === 0 && (
                      <div className="text-center text-zinc-600 font-mono text-xs italic py-12">
                        No team profiles registered in {activeRegion}.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT 7 COLUMNS: PARTICULARS & ROSTER ACTIONS */}
              <div className="lg:col-span-7">
                {selectedOrgs ? (
                  (() => {
                    const org = organizations.find((o) => o.id === selectedOrgs);
                    if (!org) return null;
                    const canEdit = org.ownerIgn === currentIgn || org.primaryManager === currentIgn;
                    return (
                      <div className="bg-[#101011] border border-neutral-950 p-6 rounded-2xl space-y-6">
                        {/* ROSTER HEADER HERO BANNER */}
                        <div className={`p-6 rounded-xl ${org.banner} border border-neutral-800 flex justify-between items-center`}>
                          <div className="flex items-center gap-4">
                            <span className="text-4xl p-2 bg-neutral-950/60 rounded-xl border border-neutral-800">{org.logo}</span>
                            <div>
                              <h3 className="text-xl font-bold font-mono text-white tracking-wide uppercase italic">{org.name}</h3>
                              <p className="text-xs text-neutral-300 font-mono">{org.region} Region • {org.gameTitle}</p>
                            </div>
                          </div>

                          <div className="text-center bg-black/40 p-3 rounded-lg border border-neutral-800 min-w-[120px]">
                            <div className="text-[9px] text-[#E10600] font-black font-mono uppercase tracking-widest">reliability</div>
                            <div className="text-lg font-black font-mono text-white">{org.reliabilityScore}%</div>
                            <div className="text-[9px] text-zinc-400 uppercase font-mono font-bold mt-0.5">{org.reliabilityRank}</div>
                          </div>
                        </div>

                        {/* RECIPIENT DESIGNATION CONFIGURATION */}
                        <div className="p-4 bg-zinc-950 rounded-xl border border-[#131213] space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                            <span className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Shield size={14} className="text-[#E10600]" />
                              Authorized Scrim Coordinates Recipient
                            </span>
                            <span className="text-[8px] font-mono bg-red-950 text-red-400 p-0.5 px-2 rounded font-black">
                              AUTOMATED PERMS
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-500 font-mono lowercase leading-relaxed">
                            Assign secondary managers to securely delegate coordination rights. Only one manager can receive codes at any single frame to avoid lobby cross-talk leaks.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-xs">
                            <div className="p-3 bg-[#0a0a0b] rounded border border-neutral-900">
                              <span className="text-[#E10600] font-bold block text-[10px] uppercase">PRIMARY MANAGER</span>
                              <span className="text-white font-mono">{org.primaryManager}</span>
                              <span className="text-[9px] text-zinc-500 block">
                                {org.secondaryManager ? "Access Redirected / Locked" : "RECEIVING ACTIVE ROOM CODES"}
                              </span>
                            </div>

                            <div className="p-3 bg-[#0a0a0b] rounded border border-neutral-900 space-y-1">
                              <span className="text-[#E10600] font-bold block text-[10px] uppercase">SECONDARY RECIPIENT</span>
                              {org.secondaryManager ? (
                                <div className="flex justify-between items-center bg-neutral-950 p-1.5 px-2.5 rounded border border-neutral-800">
                                  <span>{org.secondaryManager}</span>
                                  {canEdit && (
                                    <button
                                      onClick={() => handleUpdateSecondaryManager(org.id, null)}
                                      className="text-[9px] text-red-400 uppercase tracking-widest font-black"
                                    >
                                      CLEAR
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-neutral-500 italic block text-[10px]">None appointed.</span>
                                  {canEdit && (
                                    <div className="flex gap-1.5 pt-1">
                                      <select
                                        id="secondary-manager-select"
                                        onChange={(e) => handleUpdateSecondaryManager(org.id, e.target.value)}
                                        className="bg-neutral-950 border border-neutral-800 text-[10px] p-1 rounded font-mono text-zinc-300 w-full"
                                        defaultValue=""
                                      >
                                        <option value="" disabled>-- ELECT RECIPIENT --</option>
                                        {org.roster
                                          .filter((r) => r.ign !== org.primaryManager)
                                          .map((m) => (
                                            <option key={m.ign} value={m.ign}>
                                              {m.ign} ({m.role})
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ROSTER MATRIX PARTICIPANTS */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                            Roster Participants ({org.roster.length}/10)
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {org.roster.map((member) => (
                              <div key={member.ign} className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-900 flex justify-between items-center text-xs">
                                <div>
                                  <div className="font-mono font-bold text-white flex items-center gap-1.5">
                                    {member.ign}
                                    <span className="p-0.5 px-1 bg-red-950/60 text-red-400 text-[7px] font-mono tracking-widest font-black uppercase rounded">
                                      {member.role}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-neutral-500 font-mono">ENROLLED: {member.joinedAt}</span>
                                </div>

                                {canEdit && member.ign !== currentIgn && (
                                  <button
                                    onClick={() => handleKickMember(org.id, member.ign)}
                                    className="p-1 px-1.5 text-zinc-600 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ROSTER RECRUITMENT INVITE ACCELERATOR */}
                        {canEdit && (
                          <div className="p-4 bg-zinc-950 rounded-xl border border-[#131314] space-y-3">
                            <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                              ➕ Enlist Crew Members
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={inviteIgnAddress}
                                onChange={(e) => setInviteIgnAddress(e.target.value)}
                                placeholder="Gamer Tag (IGN)..."
                                className="bg-[#0c0c0d] border border-neutral-900 rounded p-2 text-xs text-white"
                              />

                              <select
                                value={inviteRoleSelection}
                                onChange={(e: any) => setInviteRoleSelection(e.target.value)}
                                className="bg-[#0c0c0d] border border-neutral-900 rounded p-2 text-xs text-white"
                              >
                                <option value="Manager">Manager</option>
                                <option value="Captain">Captain</option>
                                <option value="Player">Player</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleInviteToOrg(org.id)}
                                className="bg-[#E10600] text-white p-2 rounded text-xs transition-colors hover:bg-neutral-900 font-bold uppercase tracking-wider font-mono"
                              >
                                Enlist Member
                              </button>
                            </div>
                          </div>
                        )}

                        {/* STATISTICS SECTOR */}
                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                            Verified Combat Ledger
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                              <div className="text-[9px] font-mono text-[#E20600] uppercase font-black">MATCHES SECURED</div>
                              <div className="text-md font-bold text-white mt-0.5">{org.statistics.matches}</div>
                            </div>
                            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                              <div className="text-[9px] font-mono text-[#E20600] uppercase font-black">FIRST CLASSIFIED</div>
                              <div className="text-md font-bold text-white mt-0.5">{org.statistics.wins}</div>
                            </div>
                            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                              <div className="text-[9px] font-mono text-[#E20600] uppercase font-black">PODIUM FINISHES</div>
                              <div className="text-md font-bold text-white mt-0.5">{org.statistics.podiums}</div>
                            </div>
                            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                              <div className="text-[9px] font-mono text-[#E20600] uppercase font-black">FRAG RECORDS</div>
                              <div className="text-md font-bold text-white mt-0.5">{org.statistics.kills}</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-[#101011] p-12 rounded-2xl border border-neutral-900 text-center text-neutral-500 font-mono text-xs italic">
                    🦁 Please select or instantiate an organization profile to view particulars.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: WHO'S STREAMING TODAY */}
        {activeSubTab === "streaming" && (
          <div className="lg:col-span-12 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT 5 COLUMNS: SCHEDULE A LIVE STREAM */}
              <div className="lg:col-span-5 bg-[#101011] p-5 rounded-2xl border border-neutral-950">
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest pb-3 border-b border-neutral-800 mb-4">
                  📺 PUBLICIZE STREAM SCHEDULE
                </h3>

                <form onSubmit={handleRegisterStreamer} className="space-y-4 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">STREAMER IDENTITY (IGN)</label>
                    <input
                      required
                      type="text"
                      value={newStreamer.name}
                      onChange={(e) => setNewStreamer({ ...newStreamer, name: e.target.value })}
                      placeholder="e.g. NinjaStrike_ZIM"
                      className="w-full bg-[#0a0a0b] border border-neutral-900 rounded p-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">AFFILIATED INDEPENDENT TEAM</label>
                    <input
                      required
                      type="text"
                      value={newStreamer.team}
                      onChange={(e) => setNewStreamer({ ...newStreamer, team: e.target.value })}
                      placeholder="e.g. Zulu Combat Squad"
                      className="w-full bg-[#0a0a0b] border border-neutral-900 rounded p-3 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">STREAM DIRECTORY REGION</label>
                      <select
                        value={newStreamer.region}
                        onChange={(e) => setNewStreamer({ ...newStreamer, region: e.target.value })}
                        className="w-full bg-[#0a0a0b] border border-neutral-900 p-3 rounded text-zinc-300"
                      >
                        {REGIONS.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">BROADCAST PLATFORM</label>
                      <select
                        value={newStreamer.platform}
                        onChange={(e) => setNewStreamer({ ...newStreamer, platform: e.target.value })}
                        className="w-full bg-[#0a0a0b] border border-neutral-900 p-3 rounded text-zinc-300"
                      >
                        {PLATFORMS.map((plat) => (
                          <option key={plat} value={plat}>
                            {plat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">BROADCAST WINDOW TIME</label>
                      <input
                        required
                        type="text"
                        value={newStreamer.time}
                        onChange={(e) => setNewStreamer({ ...newStreamer, time: e.target.value })}
                        placeholder="e.g. 20:00 - 22:30 BST"
                        className="w-full bg-[#0a0a0b] border border-neutral-900 rounded p-3 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold font-mono text-zinc-500 uppercase">DESTINATION INTEGRITY LINK</label>
                      <input
                        required
                        type="url"
                        value={newStreamer.link}
                        onChange={(e) => setNewStreamer({ ...newStreamer, link: e.target.value })}
                        placeholder="e.g. https://twitch.tv"
                        className="w-full bg-[#0a0a0b] border border-neutral-900 rounded p-3 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E10600] text-white p-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all hover:bg-neutral-900"
                  >
                    🚀 Release Broadcast Schedule
                  </button>
                </form>
              </div>

              {/* RIGHT 7 COLUMNS: BROADCASTING TODAY LISTINGS */}
              <div className="lg:col-span-7 bg-[#101011] p-5 rounded-2xl border border-neutral-950">
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest pb-3 border-b border-neutral-800 mb-4 flex items-center gap-1.5">
                  <Tv size={14} className="text-red-500 animate-pulse" />
                  ACTIVE BROADCASTING NETWORKS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveStreams.map((stream) => (
                    <div key={stream.id} className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 flex flex-col justify-between h-[160px] relative overflow-hidden">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="p-0.5 px-2 bg-red-950/40 text-red-400 border border-red-900/40 text-[8px] font-mono uppercase rounded font-black">
                            {stream.platform}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">{stream.region} Region</span>
                        </div>
                        <h4 className="font-bold text-white text-md tracking-tight">{stream.streamerName}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5">Team: {stream.teamName}</p>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-2 border-t border-neutral-900">
                        <span className="text-[9px] text-[#E10600] font-mono leading-none">{stream.streamTime}</span>
                        <a
                          href={stream.directStreamLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 px-3 bg-zinc-900 hover:bg-zinc-805 text-zinc-300 border border-neutral-800 rounded-lg text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors font-bold"
                        >
                          WATCH <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: RELIABILITY CONSOLE PANEL */}
        {activeSubTab === "reliability" && (
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-[#101011] p-6 rounded-2xl border border-neutral-950 space-y-4">
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                📊 SQUAD INTEGRITY LEDGER MATRIX ({activeRegion} Region)
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl">
                Only highly-rated organizations gain premium placement priority during event fill schedules. Attendance, sportsmanship, check-ins, and rules discipline are compiled in real-time.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-900 text-zinc-500">
                      <th className="py-3 px-4 uppercase font-bold text-[9px] tracking-widest">ORGANIZATION NAME</th>
                      <th className="py-3 px-4 uppercase font-bold text-[9px] tracking-widest">ATTENDANCE RATING</th>
                      <th className="py-3 px-4 uppercase font-bold text-[9px] tracking-widest">CHECK-INS</th>
                      <th className="py-3 px-4 uppercase font-bold text-[9px] tracking-widest">NO SHOWS</th>
                      <th className="py-3 px-4 uppercase font-bold text-[9px] tracking-widest">LATE EXITS</th>
                      <th className="py-3 px-4 uppercase font-bold text-[9px] tracking-widest">STATUS RATING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.filter((o) => o.region === activeRegion).map((org) => (
                      <tr key={org.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/30">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="text-lg">{org.logo}</span>
                          {org.name}
                        </td>
                        <td className="py-3.5 px-4">{org.reliabilityScore}% Reliability</td>
                        <td className="py-3.5 px-4 text-emerald-400">{org.checkInCount}/{org.attendanceCount} Sets</td>
                        <td className="py-3.5 px-4 text-[#E10600]">{org.noShowCount} Matches</td>
                        <td className="py-3.5 px-4 text-orange-500">{org.lateCancellationsCount} Exits</td>
                        <td className="py-3.5 px-4">
                          <span className={`p-1 px-2.5 rounded text-[10px] font-bold ${
                            org.reliabilityRank === "Excellent"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                              : org.reliabilityRank === "Good"
                              ? "bg-blue-950 text-blue-400 border border-blue-900/30"
                              : org.reliabilityRank === "Average"
                              ? "bg-amber-950/40 text-amber-500 border border-amber-900/20"
                              : "bg-red-950 text-red-500 border border-red-900/35"
                          }`}>
                            {org.reliabilityRank}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
