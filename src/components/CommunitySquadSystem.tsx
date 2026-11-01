import React, { useState, useEffect } from "react";
import {
  Users,
  Trophy,
  MessageSquare,
  Megaphone,
  Calendar,
  Image as ImageIcon,
  Compass,
  FileText,
  BarChart2,
  CheckSquare,
  Volume2,
  History,
  Award,
  Shield,
  PlusCircle,
  X,
  Plus,
  Trash2,
  Send,
  Lock,
  Search,
  Check,
  UserPlus,
  Settings,
  ShieldCheck,
  Link as LinkIcon,
  BookOpen,
  Zap,
  Star,
  ArrowRight,
  Activity
} from "lucide-react";

// --- TYPES & INTERFACES ---
export interface SquadMember {
  ign: string;
  role: "Squad Owner" | "Co-Owner" | "Captain" | "Manager" | "Member" | "Recruit";
  joinedAt: string;
}

export interface CommunitySquad {
  id: string;
  name: string;
  logo: string; // Emoji
  banner: string; // Tailwind color string
  region: string;
  game: string;
  description: string;
  squadType: "Public" | "Private";
  requirements: string;
  ownerIgn: string;
  createdAt: string;
  members: SquadMember[];
  joinRequests: string[]; // List of IGNs
}

export interface InvitationLink {
  id: string;
  squadId: string;
  squadName: string;
  inviteCode: string;
  expiresAt: string;
  maxUses: number;
  currentUses: number;
  createdAt: string;
}

export interface SquadAnnouncement {
  id: string;
  squadId: string;
  title: string;
  content: string;
  postedBy: string;
  postedAt: string;
}

export interface SquadMessage {
  id: string;
  squadId: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface SquadCalendarEvent {
  id: string;
  squadId: string;
  title: string;
  dateTime: string;
  type: string;
  desc: string;
}

export interface SquadMediaItem {
  id: string;
  squadId: string;
  title: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface SquadFileItem {
  id: string;
  squadId: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface SquadScrimPlan {
  id: string;
  squadId: string;
  opponent: string;
  dateTime: string;
  mapName: string;
  status: "Draft" | "Confirmed" | "Completed";
}

export interface SquadPermissionConfig {
  postAnnouncements: string[]; // roles allowed
  manageMembers: string[];
  scheduleScrims: string[];
  uploadFiles: string[];
  editStrategies: string[];
  accessVault: string[];
}

// --- INITIAL SQUADS (CLEAN STARTING STATE) ---
const INITIAL_COMMUNITY_SQUADS: CommunitySquad[] = [];

const INITIAL_ANNOUNCEMENTS: SquadAnnouncement[] = [];

const INITIAL_MESSAGES: SquadMessage[] = [];

const INITIAL_EVENTS: SquadCalendarEvent[] = [];

const INITIAL_MEDIA_ITEMS: SquadMediaItem[] = [];

const INITIAL_SQUAD_FILES: SquadFileItem[] = [];

const INITIAL_SCRIMS: SquadScrimPlan[] = [];

interface CommunitySquadSystemProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
  onGoHome: () => void;
}

export default function CommunitySquadSystem({ currentIgn, onAlert, onGoHome }: CommunitySquadSystemProps) {
  // --- STATE ---
  const [squads, setSquads] = useState<CommunitySquad[]>(() => {
    const saved = localStorage.getItem("com_squads_db");
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_SQUADS;
  });

  const [squadInvites, setSquadInvites] = useState<InvitationLink[]>(() => {
    const saved = localStorage.getItem("com_squad_invites");
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState<SquadAnnouncement[]>(() => {
    const saved = localStorage.getItem("com_squad_announcements");
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [messages, setMessages] = useState<SquadMessage[]>(() => {
    const saved = localStorage.getItem("com_squad_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [events, setEvents] = useState<SquadCalendarEvent[]>(() => {
    const saved = localStorage.getItem("com_squad_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [mediaItems, setMediaItems] = useState<SquadMediaItem[]>(() => {
    const saved = localStorage.getItem("com_squad_media");
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  const [squadFiles, setSquadFiles] = useState<SquadFileItem[]>(() => {
    const saved = localStorage.getItem("com_squad_files");
    return saved ? JSON.parse(saved) : INITIAL_SQUAD_FILES;
  });

  const [scrimPlans, setScrimPlans] = useState<SquadScrimPlan[]>(() => {
    const saved = localStorage.getItem("com_squad_scrim_plans");
    return saved ? JSON.parse(saved) : INITIAL_SCRIMS;
  });

  const [permissions, setPermissions] = useState<Record<string, SquadPermissionConfig>>(() => {
    const saved = localStorage.getItem("com_squad_permissions");
    if (saved) return JSON.parse(saved);
    // Defaults for cs-2
    return {
      "cs-2": {
        postAnnouncements: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
        manageMembers: ["Squad Owner", "Co-Owner"],
        scheduleScrims: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
        uploadFiles: ["Squad Owner", "Co-Owner", "Captain", "Manager", "Member"],
        editStrategies: ["Squad Owner", "Co-Owner", "Captain"],
        accessVault: ["Squad Owner", "Co-Owner"]
      }
    };
  });

  // Navigation states
  const [activeView, setActiveView] = useState<"landing" | "discovery" | "portal" | "create" | "recruitment">("landing");
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);
  const [portalTab, setPortalTab] = useState<string>("chat");

  // Recruitment Hub States
  const [recruitmentAds, setRecruitmentAds] = useState<any[]>(() => {
    const saved = localStorage.getItem("com_squad_recruitment_ads");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "ad-1",
        squadId: "cs-1",
        squadName: "Apex Overlords",
        squadLogo: "👑",
        requiredRank: "Ace Master / Conqueror",
        rolesNeeded: ["Assaulter", "IGL (In-Game Leader)"],
        description: "Looking for high-reflex frontlines who can handle intense lobby rushes. Daily active scrim participation is mandatory.",
        contactSpec: "Disc: ares_igl#4412",
        region: "Africa",
        createdAt: new Date().toISOString()
      },
      {
        id: "ad-2",
        squadId: "cs-2",
        squadName: "Zimbabwean Elite Gladiators",
        squadLogo: "⚡",
        requiredRank: "Level 100+ & Rank Master",
        rolesNeeded: ["Sniper Specialist", "Anchor Support"],
        description: "Semi-casual crew focusing on Harare weekend matches and tactical setups. Microphones required.",
        contactSpec: "In-game mail to Vesper_CV",
        region: "Africa",
        createdAt: new Date().toISOString()
      },
      {
        id: "ad-3",
        squadId: "cs-3",
        squadName: "Crimson Eclipse",
        squadLogo: "🥀",
        requiredRank: "Grandmaster",
        rolesNeeded: ["Flanker", "Scout Entry"],
        description: "Establishing a backup roster for high-tier European tournaments. Weekly evaluation customs are set.",
        contactSpec: "Telegram @viper_eclipse",
        region: "Europe",
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [recruitmentApps, setRecruitmentApps] = useState<any[]>(() => {
    const saved = localStorage.getItem("com_squad_recruitment_apps");
    return saved ? JSON.parse(saved) : [];
  });

  // Recruitment Ad Form State
  const [adRolesInput, setAdRolesInput] = useState<string>("");
  const [adRankInput, setAdRankInput] = useState<string>("");
  const [adContactInput, setAdContactInput] = useState<string>("");
  const [adDescInput, setAdDescInput] = useState<string>("");
  const [adSquadIdInput, setAdSquadIdInput] = useState<string>("");

  // Application Submission State
  const [selectedAdForApp, setSelectedAdForApp] = useState<any | null>(null);
  const [appRankInput, setAppRankInput] = useState<string>("");
  const [appRoleInput, setAppRoleInput] = useState<string>("");
  const [appNotesInput, setAppNotesInput] = useState<string>("");
  const [appContactInput, setAppContactInput] = useState<string>("");

  // Filtering / Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRegion, setSearchRegion] = useState("All");
  const [searchGame, setSearchGame] = useState("All");

  // Private Code Input
  const [inviteCodeInput, setInviteCodeInput] = useState("");

  // Create Squad Form State
  const [newSquadName, setNewSquadName] = useState("");
  const [newSquadLogo, setNewSquadLogo] = useState("🎯");
  const [newSquadBanner, setNewSquadBanner] = useState("from-purple-900 to-indigo-950");
  const [newSquadRegion, setNewSquadRegion] = useState("Africa");
  const [newSquadGame, setNewSquadGame] = useState("PUBG Mobile");
  const [newSquadDesc, setNewSquadDesc] = useState("");
  const [newSquadReq, setNewSquadReq] = useState("");
  const [newSquadType, setNewSquadType] = useState<"Public" | "Private">("Public");

  // Interactivity inputs
  const [typedMessage, setTypedMessage] = useState("");
  const [typedAnnTitle, setTypedAnnTitle] = useState("");
  const [typedAnnCont, setTypedAnnCont] = useState("");
  const [typedEventTitle, setTypedEventTitle] = useState("");
  const [typedEventDate, setTypedEventDate] = useState("");
  const [typedEventTime, setTypedEventTime] = useState("");
  const [typedEventType, setTypedEventType] = useState("Practice");
  const [typedEventDesc, setTypedEventDesc] = useState("");
  const [typedMediaTitle, setTypedMediaTitle] = useState("");
  const [typedMediaUrl, setTypedMediaUrl] = useState("");
  const [typedFileName, setTypedFileName] = useState("");
  const [typedFileSize, setTypedFileSize] = useState("1.8 MB");
  const [typedScrimOpp, setTypedScrimOpp] = useState("");
  const [typedScrimDate, setTypedScrimDate] = useState("");
  const [typedScrimMap, setTypedScrimMap] = useState("Erangel");

  // Invite Generator inputs
  const [inviteExpDate, setInviteExpDate] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState(5);

  // Strategy custom notes
  const [activeStrategyMap, setActiveStrategyMap] = useState("Erangel");
  const [strategyNotes, setStrategyNotes] = useState<Record<string, string>>({
    Erangel: "Double bridge camp strategy. Maintain IGL command. Keep two vehicles ready in garages for quick rotations.",
    Miramar: "High altitude hills target capture points. Snipers on Pecado Ridge. Hold center of Pecado circle."
  });
  const [strategyPins, setStrategyPins] = useState<{ x: number; y: number; label: string }[]>([
    { x: 35, y: 40, label: "Primary Drop Area" },
    { x: 60, y: 70, label: "Bridge Camp Defensive Gate" }
  ]);
  const [pinInput, setPinInput] = useState("");

  // Attendance Tracker mock State
  const [attendanceLogs, setAttendanceLogs] = useState<Record<string, Record<string, string>>>({
    "e-1": { "CV_Slayer_IGL": "Present", "Shadow_Mamba": "Present", "Rooky_Gamer": "Excused" }
  });

  // Voice channel state
  const [activeVoiceSquad, setActiveVoiceSquad] = useState<string | null>(null);

  // --- PERSISTENCE SYNCS ---
  useEffect(() => {
    localStorage.setItem("com_squads_db", JSON.stringify(squads));
  }, [squads]);
  useEffect(() => {
    localStorage.setItem("com_squad_invites", JSON.stringify(squadInvites));
  }, [squadInvites]);
  useEffect(() => {
    localStorage.setItem("com_squad_announcements", JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem("com_squad_messages", JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem("com_squad_events", JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem("com_squad_media", JSON.stringify(mediaItems));
  }, [mediaItems]);
  useEffect(() => {
    localStorage.setItem("com_squad_files", JSON.stringify(squadFiles));
  }, [squadFiles]);
  useEffect(() => {
    localStorage.setItem("com_squad_scrim_plans", JSON.stringify(scrimPlans));
  }, [scrimPlans]);
  useEffect(() => {
    localStorage.setItem("com_squad_permissions", JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem("com_squad_recruitment_ads", JSON.stringify(recruitmentAds));
  }, [recruitmentAds]);

  useEffect(() => {
    localStorage.setItem("com_squad_recruitment_apps", JSON.stringify(recruitmentApps));
  }, [recruitmentApps]);

  // --- DERIVED SQUAD ACCESS INFO ---
  const mySquads = squads.filter((s) =>
    s.members.some((m) => m.ign.toLowerCase() === currentIgn.toLowerCase())
  );

  const activeSquad = squads.find((s) => s.id === selectedSquadId);
  const activeMemberRecord = activeSquad?.members.find(
    (m) => m.ign.toLowerCase() === currentIgn.toLowerCase()
  );
  const activeMemberRole = activeMemberRecord?.role || "Recruit";

  // Check custom permission
  const checkPermission = (action: keyof SquadPermissionConfig) => {
    if (!selectedSquadId) return false;
    // Owner has bypass bypass power
    if (activeMemberRole === "Squad Owner") return true;
    
    const config = permissions[selectedSquadId] || {
      postAnnouncements: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
      manageMembers: ["Squad Owner", "Co-Owner"],
      scheduleScrims: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
      uploadFiles: ["Squad Owner", "Co-Owner", "Captain", "Manager", "Member"],
      editStrategies: ["Squad Owner", "Co-Owner", "Captain"],
      accessVault: ["Squad Owner", "Co-Owner"]
    };
    
    return config[action]?.includes(activeMemberRole) || false;
  };

  // --- ACTIONS ---

  // Leave / Eviction Auto-Access Control check on mount/updates
  const handleLeaveSquad = (squadId: string, kickUserIgn?: string) => {
    const targetIgn = kickUserIgn || currentIgn;
    setSquads((prev) =>
      prev.map((sq) => {
        if (sq.id !== squadId) return sq;
        return {
          ...sq,
          members: sq.members.filter((m) => m.ign.toLowerCase() !== targetIgn.toLowerCase())
        };
      })
    );

    if (targetIgn.toLowerCase() === currentIgn.toLowerCase()) {
      onAlert(`👋 Left community squad sector for squad ID: ${squadId}. All exclusive resources revoked.`);
      if (selectedSquadId === squadId) {
        setSelectedSquadId(null);
        setActiveView("discovery");
      }
    } else {
      onAlert(`✂️ Member [${targetIgn}] evicted from squad sector successfully. Access revoked instantly.`);
    }
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) {
      onAlert("⚠️ Please state a unique Squad Name.");
      return;
    }

    const squadId = "cs-" + Date.now();
    const createdDate = new Date().toISOString();

    const newSquad: CommunitySquad = {
      id: squadId,
      name: newSquadName,
      logo: newSquadLogo,
      banner: newSquadBanner,
      region: newSquadRegion,
      game: newSquadGame,
      description: newSquadDesc,
      squadType: newSquadType,
      requirements: newSquadReq || "No special level threshold requirements.",
      ownerIgn: currentIgn,
      createdAt: createdDate,
      members: [
        { ign: currentIgn, role: "Squad Owner", joinedAt: createdDate }
      ],
      joinRequests: []
    };

    setSquads((prev) => [...prev, newSquad]);
    // Initialize standard permissions
    setPermissions((prev) => ({
      ...prev,
      [squadId]: {
        postAnnouncements: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
        manageMembers: ["Squad Owner", "Co-Owner"],
        scheduleScrims: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
        uploadFiles: ["Squad Owner", "Co-Owner", "Captain", "Manager", "Member"],
        editStrategies: ["Squad Owner", "Co-Owner", "Captain"],
        accessVault: ["Squad Owner", "Co-Owner"]
      }
    }));

    onAlert(`🎉 "${newSquadName}" created completely separate from official CV roster resources!`);
    
    // reset form
    setNewSquadName("");
    setNewSquadDesc("");
    setNewSquadReq("");
    setSelectedSquadId(squadId);
    setActiveView("portal");
    setPortalTab("chat");
  };

  const submitJoinRequest = (squadId: string) => {
    setSquads((prev) =>
      prev.map((s) => {
        if (s.id !== squadId) return s;
        if (s.joinRequests.includes(currentIgn)) return s;
        return {
          ...s,
          joinRequests: [...s.joinRequests, currentIgn]
        };
      })
    );
    onAlert("📨 Joint request submitted to Squad Owner. Awaiting sector clearance.");
  };

  const approveJoinRequest = (squadId: string, applicantIgn: string) => {
    setSquads((prev) =>
      prev.map((s) => {
        if (s.id !== squadId) return s;
        return {
          ...s,
          joinRequests: s.joinRequests.filter((ign) => ign !== applicantIgn),
          members: [
            ...s.members,
            { ign: applicantIgn, role: "Member", joinedAt: new Date().toISOString() }
          ]
        };
      })
    );
    onAlert(`✅ Approved "${applicantIgn}"! They have been assigned the default Member role.`);
  };

  const rejectJoinRequest = (squadId: string, applicantIgn: string) => {
    setSquads((prev) =>
      prev.map((s) => {
        if (s.id !== squadId) return s;
        return {
          ...s,
          joinRequests: s.joinRequests.filter((ign) => ign !== applicantIgn)
        };
      })
    );
    onAlert(`❌ Rejected join request from ${applicantIgn}.`);
  };

  const handleRoleChange = (squadId: string, memberIgn: string, newRole: any) => {
    setSquads((prev) =>
      prev.map((s) => {
        if (s.id !== squadId) return s;
        return {
          ...s,
          members: s.members.map((m) =>
            m.ign === memberIgn ? { ...m, role: newRole } : m
          )
        };
      })
    );
    onAlert(`🛡️ Role of member [${memberIgn}] updated to [${newRole}] successfully.`);
  };

  const handleTransferOwnership = (squadId: string, targetIgn: string) => {
    setSquads((prev) =>
      prev.map((s) => {
        if (s.id !== squadId) return s;
        return {
          ...s,
          ownerIgn: targetIgn,
          members: s.members.map((m) => {
            if (m.ign === currentIgn) return { ...m, role: "Co-Owner" };
            if (m.ign === targetIgn) return { ...m, role: "Squad Owner" };
            return m;
          })
        };
      })
    );
    onAlert(`👑 Squad leadership transferred to [${targetIgn}]. You are now Co-Owner.`);
  };

  // --- PRIVATE INVITATION GENERATOR LOGIC ---
  const generateInviteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSquadId || !activeSquad) return;

    const code = `${activeSquad.name.substring(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newInvite: InvitationLink = {
      id: "inv-" + Date.now(),
      squadId: selectedSquadId,
      squadName: activeSquad.name,
      inviteCode: code,
      expiresAt: inviteExpDate || new Date(Date.now() + 86450000 * 3).toISOString().slice(0, 10), // Default 3 days
      maxUses: inviteMaxUses,
      currentUses: 0,
      createdAt: new Date().toISOString()
    };

    setSquadInvites((prev) => [...prev, newInvite]);
    onAlert(`🔗 Unique Secure Invite Code generated successfully: ${code}`);
  };

  const deleteInviteCode = (id: string) => {
    setSquadInvites((prev) => prev.filter((i) => i.id !== id));
    onAlert("🗑️ Invitation link deleted and revoked.");
  };

  const tryJoinWithInviteCode = (e: React.FormEvent) => {
    e.preventDefault();
    const invite = squadInvites.find(
      (inv) => inv.inviteCode.toLowerCase().trim() === inviteCodeInput.toLowerCase().trim()
    );

    if (!invite) {
      onAlert("⚠️ Dynamic Invite Code invalid, expired or cancelled by Owner.");
      return;
    }

    // Check expiration
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      onAlert("⏳ This invitation link has expired.");
      return;
    }

    // Check max usages
    if (invite.currentUses >= invite.maxUses) {
      onAlert("⚠️ This invitation capacity threshold has been fully depleted!");
      return;
    }

    // Find squad
    const squad = squads.find((s) => s.id === invite.squadId);
    if (!squad) {
      onAlert("Squad doesn't exist anymore.");
      return;
    }

    // Check if already member
    if (squad.members.some((m) => m.ign.toLowerCase() === currentIgn.toLowerCase())) {
      onAlert("You are already a cleared member of this squad!");
      setSelectedSquadId(squad.id);
      setActiveView("portal");
      setPortalTab("chat");
      return;
    }

    // Increment invite uses
    setSquadInvites((prev) =>
      prev.map((i) =>
        i.id === invite.id ? { ...i, currentUses: i.currentUses + 1 } : i
      )
    );

    // Add to squad
    setSquads((prev) =>
      prev.map((sq) => {
        if (sq.id !== squad.id) return sq;
        return {
          ...sq,
          members: [
            ...sq.members,
            { ign: currentIgn, role: "Member", joinedAt: new Date().toISOString() }
          ]
        };
      })
    );

    onAlert(`🎟️ Welcome to "${squad.name}"! Access unlocked via invitation verification.`);
    setInviteCodeInput("");
    setSelectedSquadId(squad.id);
    setActiveView("portal");
    setPortalTab("chat");
  };

  // --- SUB-TABS LOGIC (12 Isolated Features) ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedSquadId) return;

    const newMsg: SquadMessage = {
      id: "msg-" + Date.now(),
      squadId: selectedSquadId,
      sender: currentIgn,
      role: activeMemberRole,
      text: typedMessage,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);
    setTypedMessage("");
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnnTitle.trim() || !typedAnnCont.trim() || !selectedSquadId) return;

    if (!checkPermission("postAnnouncements")) {
      onAlert("⛔ Restricted Access: Your squad role does not allow Announcements postings.");
      return;
    }

    const newAnn: SquadAnnouncement = {
      id: "ann-" + Date.now(),
      squadId: selectedSquadId,
      title: typedAnnTitle,
      content: typedAnnCont,
      postedBy: currentIgn,
      postedAt: new Date().toISOString()
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setTypedAnnTitle("");
    setTypedAnnCont("");
    onAlert("📢 Squad Bulletin Broadcast successfully posted.");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedEventTitle.trim() || !selectedSquadId) return;

    const newEv: SquadCalendarEvent = {
      id: "ev-" + Date.now(),
      squadId: selectedSquadId,
      title: typedEventTitle,
      dateTime: `${typedEventDate || "2026-06-15"}T${typedEventTime || "12:00"}:00`,
      type: typedEventType,
      desc: typedEventDesc
    };

    setEvents((prev) => [...prev, newEv]);
    setTypedEventTitle("");
    setTypedEventDesc("");
    onAlert("📅 Custom squad log added onto the private operational calendar.");
  };

  const handleUploadMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMediaTitle.trim() || !selectedSquadId) return;

    const newMedia: SquadMediaItem = {
      id: "media-" + Date.now(),
      squadId: selectedSquadId,
      title: typedMediaTitle,
      url: typedMediaUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
      uploadedBy: currentIgn,
      uploadedAt: new Date().toISOString()
    };

    setMediaItems((prev) => [...prev, newMedia]);
    setTypedMediaTitle("");
    setTypedMediaUrl("");
    onAlert("🖼️ Tactical score screenshot catalogued into Media Vault.");
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedFileName.trim() || !selectedSquadId) return;

    if (!checkPermission("uploadFiles")) {
      onAlert("⛔ Restricted Access: Role permissions restrict uploading.");
      return;
    }

    const newFile: SquadFileItem = {
      id: "file-" + Date.now(),
      squadId: selectedSquadId,
      fileName: typedFileName.endsWith(".pdf") || typedFileName.endsWith(".png") ? typedFileName : typedFileName + ".pdf",
      fileSize: typedFileSize,
      uploadedBy: currentIgn,
      uploadedAt: new Date().toISOString()
    };

    setSquadFiles((prev) => [...prev, newFile]);
    setTypedFileName("");
    onAlert("💾 Tactical briefing document saved securely inside private sector storage.");
  };

  const handleCreateScrimPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedScrimOpp.trim() || !selectedSquadId) return;

    if (!checkPermission("scheduleScrims")) {
      onAlert("⛔ Permission denied to manage squad scrimmage operations.");
      return;
    }

    const newScrim: SquadScrimPlan = {
      id: "sp-" + Date.now(),
      squadId: selectedSquadId,
      opponent: typedScrimOpp,
      dateTime: `${typedScrimDate || "2026-06-16"}T18:00:00`,
      mapName: typedScrimMap,
      status: "Confirmed"
    };

    setScrimPlans((prev) => [...prev, newScrim]);
    setTypedScrimOpp("");
    onAlert("⚔️ Community match coordinate mapped with opponent registry.");
  };

  // Toggle user attendance log
  const toggleAttendance = (eventId: string, memberIgn: string, status: string) => {
    setAttendanceLogs((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || {}),
        [memberIgn]: status
      }
    }));
    onAlert(`Check-in changed: [${memberIgn}] marked [${status}].`);
  };

  // Toggle dynamic permissions custom checkbox
  const handleToggleCustomPermission = (action: keyof SquadPermissionConfig, role: string) => {
    if (!selectedSquadId) return;
    setPermissions((prev) => {
      const currentConf = prev[selectedSquadId] || {
        postAnnouncements: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
        manageMembers: ["Squad Owner", "Co-Owner"],
        scheduleScrims: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
        uploadFiles: ["Squad Owner", "Co-Owner", "Captain", "Manager", "Member"],
        editStrategies: ["Squad Owner", "Co-Owner", "Captain"],
        accessVault: ["Squad Owner", "Co-Owner"]
      };

      const hasRole = currentConf[action].includes(role);
      const modifiedList = hasRole 
        ? currentConf[action].filter((r) => r !== role)
        : [...currentConf[action], role];

      return {
        ...prev,
        [selectedSquadId]: {
          ...currentConf,
          [action]: modifiedList
        }
      };
    });
    onAlert(`⚙️ Squad-wide access criteria modified for: ${action}`);
  };

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setStrategyPins([
      ...strategyPins,
      { x: Math.floor(15 + Math.random() * 70), y: Math.floor(15 + Math.random() * 70), label: pinInput }
    ]);
    setPinInput("");
    onAlert("📍 Tactical coordination beacon dropped on community coordinate map!");
  };

  return (
    <div className="space-y-6 text-left" id="community-squads-root-interface">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#ef4444] font-bold block uppercase">
            🛡️ Independent Multiplayer Sectors
          </span>
          <h2 className="text-3xl font-black font-orbitron text-white italic tracking-tighter uppercase">
            👥 Community Hub Squads
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-normal">
            A fully isolated community network. These rosters function autonomously inside private sectors, fully detached from official CV pro teams & coaching assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveView("landing");
              setSelectedSquadId(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === "landing" ? "bg-red-650 text-white" : "bg-[#111] text-zinc-300 border border-zinc-800"
            }`}
          >
            <Compass size={14} />
            <span>🏠 Squads Landing</span>
          </button>
          <button
            onClick={() => {
              setActiveView("discovery");
              setSelectedSquadId(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === "discovery" ? "bg-red-650 text-white" : "bg-[#111] text-zinc-300 border border-zinc-800"
            }`}
          >
            <Users size={14} />
            <span>🌍 Search & Browse</span>
          </button>
          <button
            onClick={() => {
              setActiveView("recruitment");
              setSelectedSquadId(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === "recruitment" ? "bg-red-650 text-white" : "bg-[#111] text-zinc-300 border border-zinc-800"
            }`}
          >
            <Award size={14} />
            <span>🎯 Recruitment Hub</span>
          </button>
          <button
            onClick={() => {
              setActiveView("create");
              setSelectedSquadId(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === "create" ? "bg-red-650 text-white" : "bg-[#111] text-zinc-300 border border-zinc-800"
            }`}
          >
            <PlusCircle size={14} />
            <span>➕ Deploy New Squad</span>
          </button>
        </div>
      </div>

      {/* DISCOVERY SECTION */}
      {activeView === "discovery" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Direct Join with Invite Code Column (Left) */}
            <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 p-5 rounded-2xl relative space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                <Lock size={15} className="text-[#ef4444]" />
                <h4 className="text-xs font-black font-mono tracking-widest uppercase text-white">
                  Join Private Squad Sector
                </h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Private community squads stay hidden. Have a secure invite code from a squad owner? Type it hereunder for instant sector decryption.
              </p>
              
              <form onSubmit={tryJoinWithInviteCode} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. APE-8495"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-red-500 rounded p-2.5 text-xs text-center font-mono placeholder-zinc-700 tracking-widest text-[#ef4444]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#ef4444] hover:bg-red-700 text-white font-mono font-black tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={13} />
                  <span>Verify Sector Invite Code</span>
                </button>
              </form>

              {/* User Active Memberships list */}
              <div className="pt-4 border-t border-zinc-900 space-y-3">
                <span className="text-[9.5px] uppercase font-mono text-zinc-500 block">
                  My Active Sectors ({mySquads.length})
                </span>
                {mySquads.length === 0 ? (
                  <p className="text-[10px] text-zinc-650 italic">Not joined to any community squads yet.</p>
                ) : (
                  <div className="space-y-2">
                    {mySquads.map((ms) => {
                      const userRec = ms.members.find(m => m.ign.toLowerCase() === currentIgn.toLowerCase());
                      return (
                        <div
                          key={ms.id} 
                          className="flex items-center justify-between p-2.5 bg-black/60 rounded border border-zinc-900 hover:border-zinc-800 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg">{ms.logo}</span>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-white truncate block">{ms.name}</span>
                              <span className="text-[8px] bg-red-950/40 border border-red-900/40 text-[#ef4444] px-1 rounded font-mono font-bold uppercase">
                                {userRec?.role}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedSquadId(ms.id);
                              setActiveView("portal");
                              setPortalTab("chat");
                            }}
                            className="bg-zinc-900 hover:bg-red-650 hover:text-white border border-zinc-800 text-zinc-400 px-2 py-1 rounded text-[9.5px] font-mono font-semibold transition-all cursor-pointer"
                          >
                            Enter Sector
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Public Discovery Grid / Filtering (Right) */}
            <div className="lg:col-span-8 bg-[#09090b]/80 border border-zinc-900 p-5 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-red-500" />
                  <h3 className="text-sm font-black font-orbitron tracking-widest text-white uppercase">
                    Squad Discovery Hub
                  </h3>
                </div>
                <div className="text-[9.5px] text-zinc-500 font-mono">
                  Showing active Decoupled Public Sectors
                </div>
              </div>

              {/* SEARCH FILTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search public squad names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-zinc-850 pl-8 pr-2.5 py-1.5 rounded text-xs font-mono placeholder-zinc-650 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <select
                  value={searchRegion}
                  onChange={(e) => setSearchRegion(e.target.value)}
                  className="bg-black border border-zinc-850 rounded px-2 py-1.5 text-xs font-mono text-zinc-300 focus:border-red-500"
                >
                  <option value="All">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="North America">North America</option>
                </select>
                <select
                  value={searchGame}
                  onChange={(e) => setSearchGame(e.target.value)}
                  className="bg-black border border-zinc-850 rounded px-2 py-1.5 text-xs font-mono text-zinc-300 focus:border-red-500"
                >
                  <option value="All">All Esports Games</option>
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="CODM">CODM</option>
                  <option value="Valorant">Valorant</option>
                </select>
              </div>

              {/* CARDS */}
              {(() => {
                const publicSquads = squads.filter((s) => s.squadType === "Public");
                const filtered = publicSquads.filter((s) => {
                  const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesRegion = searchRegion === "All" || s.region === searchRegion;
                  const matchesGame = searchGame === "All" || s.game === searchGame;
                  return matchesSearch && matchesRegion && matchesGame;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-black/40 p-12 rounded-2xl border border-zinc-900 text-center space-y-4">
                      <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl text-red-500 font-mono">
                        🛡️
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white font-orbitron uppercase tracking-wider">No teams available yet. Create a team and start building your roster.</h4>
                        <p className="text-xs text-zinc-500">Found your own community esports team or search again across regional grids.</p>
                      </div>
                      <button
                        onClick={() => setActiveView("create")}
                        className="px-5 py-2.5 bg-red-650 hover:bg-red-600 active:scale-95 text-white font-mono uppercase font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                      >
                        Create Team
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((squad) => {
                      const isMember = squad.members.some(
                        (m) => m.ign.toLowerCase() === currentIgn.toLowerCase()
                      );
                      const requested = squad.joinRequests.includes(currentIgn);

                      return (
                        <div
                          key={squad.id}
                          className="bg-black border border-zinc-850 rounded-xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
                        >
                          {/* Banner & Title */}
                          <div className={`bg-gradient-to-r ${squad.banner} p-4 text-left relative`}>
                            <div className="absolute right-3 top-3 bg-black/50 text-[8px] font-mono px-1.5 py-0.5 rounded text-zinc-300">
                              {squad.region}
                            </div>
                            <div className="flex gap-2.5 items-center">
                              <span className="text-2xl bg-black/40 p-1.5 rounded-lg">{squad.logo}</span>
                              <div>
                                <h4 className="font-extrabold text-white text-sm tracking-tight">{squad.name}</h4>
                                <span className="text-[8px] color-[#ef4444] tracking-wide text-zinc-400 font-mono block uppercase">
                                  {squad.game} • {squad.members.length} Members
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2 text-xs">
                              <p className="text-zinc-400 text-[11px] leading-relaxed italic">
                                "{squad.description}"
                              </p>
                              <div className="bg-zinc-950/60 p-2 rounded border border-zinc-900 text-[9px] font-mono leading-tight">
                                <span className="text-zinc-500 block">JOIN CRITERIA:</span>
                                <span className="text-zinc-300 text-[9.5px] font-semibold">{squad.requirements}</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-900 flex justify-between items-center bg-black/20 text-[9px]">
                              <div>
                                <span className="text-zinc-650 font-mono">Owner: </span>
                                <strong className="text-zinc-450 font-mono">{squad.ownerIgn}</strong>
                              </div>

                              {isMember ? (
                                <button
                                  onClick={() => {
                                    setSelectedSquadId(squad.id);
                                    setActiveView("portal");
                                    setPortalTab("chat");
                                  }}
                                  className="px-3 py-1 bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded font-bold font-mono text-[9px] hover:bg-emerald-650 hover:text-white cursor-pointer"
                                >
                                  Enter Portal
                                </button>
                              ) : requested ? (
                                <span className="text-zinc-500 italic font-mono uppercase font-black text-[9px]">
                                  ⌛ Request Pending
                                </span>
                              ) : (
                                <button
                                  onClick={() => submitJoinRequest(squad.id)}
                                  className="px-3 py-1 bg-[#ef4444] hover:bg-red-700 text-white rounded font-bold font-mono tracking-widest text-[9px] uppercase cursor-pointer"
                                >
                                  Submit Request
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* 1. DEDICATED SQUADS LANDING PAGE */}
      {activeView === "landing" && (
        <div className="space-y-8 animate-fade-in text-left">
          {/* STATS HERO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-zinc-950 via-[#0b0c10] to-[#0d0707] p-5 border border-zinc-900 rounded-3xl relative overflow-hidden flex flex-col justify-between h-40 group hover:border-red-900/35 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[#ef4444] group-hover:scale-110 transition-transform">
                <Users size={80} />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#ef4444] font-black uppercase">COMMUNITY POWER</span>
                <h4 className="text-xl font-extrabold font-orbitron text-white mt-1 uppercase">SQUADS DEPLOYED</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-red-500">{squads.length || 3}</span>
                <span className="text-[10px] text-zinc-500 font-mono font-normal">ACTIVE DECRYPTION SECTORS</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-950 via-[#0b0c10] to-[#040d0a] p-5 border border-zinc-900 rounded-3xl relative overflow-hidden flex flex-col justify-between h-40 group hover:border-emerald-950 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-400 group-hover:scale-110 transition-transform">
                <Award size={80} />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-black uppercase">RECRUITMENT MATRIX</span>
                <h4 className="text-xl font-extrabold font-orbitron text-white mt-1 uppercase">OPEN LISTINGS</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-emerald-400">{recruitmentAds.length || 3}</span>
                <span className="text-[10px] text-zinc-500 font-mono font-normal">VACANT ASSIGNMENTS</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-950 via-[#0b0c10] to-[#050912] p-5 border border-zinc-900 rounded-3xl relative overflow-hidden flex flex-col justify-between h-40 group hover:border-blue-900/30 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-400 group-hover:scale-110 transition-transform">
                <Zap size={80} />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-blue-400 font-black uppercase">TDM ENLISTMENT</span>
                <h4 className="text-xl font-extrabold font-orbitron text-white mt-1 uppercase">Scrim Performance</h4>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-blue-400 font-extrabold">96.8%</span>
                <span className="text-[10px] text-zinc-500 font-mono font-normal">SECTOR STABILITY INDEX</span>
              </div>
            </div>
          </div>

          {/* MAIN GRID - LEFT: FEATURED & QUICK SECTIONS, RIGHT: TOP SQUADS AND SEARCH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: FEATURED SQUADS & WORKFLOWS (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* ⭐ FEATURED SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-red-500 fill-red-500/20" />
                  <h3 className="text-sm font-black font-mono tracking-wider text-white uppercase">
                    ⭐ Spotlight: Featured Elite Squads
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {squads.slice(0, 2).map((sq, idx) => (
                    <div 
                      key={sq.id || idx} 
                      className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl relative overflow-hidden group hover:border-red-900/40 transition-all text-left"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/10 to-transparent blur-xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1 bg-zinc-900 rounded-lg">{sq.logo || "🛡️"}</span>
                          <div className="text-left">
                            <h4 className="font-bold text-white tracking-wide text-xs group-hover:text-red-400 transition-colors uppercase">{sq.name}</h4>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase">{sq.game} • {sq.region}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-full uppercase">
                          VIP Spotlight
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 h-8 leading-normal mb-3 text-left">
                        {sq.description || "Active community combat division practicing daily for private skirmishes."}
                      </p>

                      <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                        <span className="text-zinc-500 font-normal">Roster: <strong className="text-white font-black">{sq.members?.length || 4} Members</strong></span>
                        <button 
                          onClick={() => {
                            setSelectedSquadId(sq.id);
                            setActiveView("portal");
                          }}
                          className="px-2.5 py-1 bg-red-95/20 border border-red-500/30 text-red-400 rounded hover:bg-red-950 hover:text-white transition-all text-[9px] uppercase tracking-wider cursor-pointer"
                        >
                          Access Portal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 👥 CLANS REGISTRIES (CREATE, JOIN, BROWSE CARDS) */}
              <div className="space-y-3">
                <h3 className="text-sm font-black font-mono tracking-wider text-white uppercase flex items-center gap-1.5">
                  <span className="w-1 h-3 bg-red-500 inline-block" />
                  👥 Tactical Alignment Directives
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* CREATE A SQUAD */}
                  <div className="bg-[#090a0d] border border-blue-900/20 p-5 rounded-2xl relative overflow-hidden hover:border-blue-500/30 transition-all flex flex-col justify-between h-48 text-left">
                    <div className="space-y-1">
                      <div className="text-blue-400 text-xl font-bold">👥 Create a Squad</div>
                      <h4 className="text-xs font-black font-mono tracking-widest text-zinc-300 uppercase">Deploy Custom Squad</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Provision a fresh sector, setup customized strategies, upload match maps, and recruit.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveView("create")}
                      className="w-full py-1.5 bg-blue-950/20 hover:bg-blue-950 border border-blue-900/40 text-blue-400 font-mono text-[9px] font-extrabold uppercase rounded tracking-wider cursor-pointer transition-all"
                    >
                      Configure Sector
                    </button>
                  </div>

                  {/* JOIN A SQUAD */}
                  <div className="bg-[#0a0707] border border-red-900/20 p-5 rounded-2xl relative overflow-hidden hover:border-red-500/30 transition-all flex flex-col justify-between h-48 text-left">
                    <div className="space-y-1">
                      <div className="text-red-550 text-xl font-bold">🔥 Join a Squad</div>
                      <h4 className="text-xs font-black font-mono tracking-widest text-zinc-300 uppercase">Quick Join Code</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Have an encrypted squad invite? Decrypt the sector using its unique credentials.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveView("discovery");
                        setTimeout(() => {
                          const inputNode = document.getElementById("invite-code-box");
                          inputNode?.focus();
                        }, 100);
                      }}
                      className="w-full py-1.5 bg-red-950/25 hover:bg-red-950 border border-red-950 text-red-500 font-mono text-[9px] font-extrabold uppercase rounded tracking-wider cursor-pointer transition-all"
                    >
                      Browse Sectors / Input Code
                    </button>
                  </div>

                  {/* BROWSE SQUADS */}
                  <div className="bg-[#0b0c10] border border-zinc-900 p-5 rounded-2xl hover:border-zinc-700 transition-all flex flex-col justify-between h-48 text-left">
                    <div className="space-y-1">
                      <div className="text-zinc-300 text-xl font-bold">🌍 Browse Squads</div>
                      <h4 className="text-xs font-black font-mono tracking-widest text-zinc-300 uppercase">Browse Public Sectors</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Search and inspect globally active independent squad registries and their player logs.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveView("discovery")}
                      className="w-full py-1.5 bg-[#151515] hover:bg-[#1f1f1f] border border-zinc-800 text-stone-300 font-mono text-[9px] font-extrabold uppercase rounded tracking-wider cursor-pointer transition-all"
                    >
                      Open Registries
                    </button>
                  </div>
                </div>
              </div>

              {/* RECRUITMENT SHORTCUT BANNER */}
              <div className="bg-gradient-to-r from-red-950/20 via-zinc-950 to-black border border-red-900/30 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-950/20 border border-red-800/35 rounded-full">
                    <span className="w-1 h-1 bg-red-550 rounded-full animate-ping" />
                    <span className="text-[8px] font-mono text-red-400 tracking-widest uppercase font-bold">RECRUITMENT HUB ADVISORY</span>
                  </div>
                  <h4 className="text-sm font-black font-orbitron text-white uppercase">SQUAD ASSIGNMENTS VACANT</h4>
                  <p className="text-[11px] text-zinc-450 max-w-xl leading-normal">
                    Clans are actively looking for fresh shooters to compete in TDM Arena brackets. Check requirements, send instant trial applications, or post recruitment ads.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveView("recruitment")}
                  className="px-4 py-2 bg-[#d1001f] hover:bg-[#b0001a] border border-red-500/30 text-white font-mono text-[10px] uppercase font-black rounded-xl tracking-wider flex items-center gap-1.5 self-start md:self-center transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(209,0,31,0.25)]"
                >
                  <span>Open Recruitment Hub</span>
                  <ArrowRight size={12} />
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: 🏆 TOP SQUADS BOARD & INFORMATION DECK (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 🏆 TOP SQUADS LEADERBOARD */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500" />
                    <h3 className="text-xs font-black font-mono tracking-widest text-white uppercase">
                      🏆 TOP SQUADS BOARD
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase">ZA SECTOR ONLY</span>
                </div>

                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Apex Overlords", logo: "👑", game: "PUBG Mobile", members: 4, score: "2,840 pts", theme: "border-amber-500/20 bg-amber-950/5 text-amber-400" },
                    { rank: 2, name: "Zim Elite Gladiators", logo: "⚡", game: "CODM", members: 3, score: "2,590 pts", theme: "border-slate-500/10 bg-slate-900/5 text-slate-300" },
                    { rank: 3, name: "Crimson Eclipse", logo: "🥀", game: "PUBG Mobile", members: 2, score: "2,100 pts", theme: "border-amber-700/10 bg-amber-900/5 text-amber-600" },
                    { rank: 4, name: "Harares Vanguard", logo: "🛡️", game: "CODM", members: 5, score: "1,940 pts", theme: "border-zinc-900 bg-black text-zinc-400" },
                    { rank: 5, name: "Toxic Vipers", logo: "🐍", game: "PUBG Mobile", members: 2, score: "1,550 pts", theme: "border-zinc-900 bg-black text-zinc-400" }
                  ].map((lead) => (
                    <div 
                      key={lead.rank} 
                      className={`p-3 border rounded-xl flex items-center justify-between gap-2.5 transition-all hover:bg-zinc-900/40 ${lead.theme}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-black">{lead.rank}</span>
                        <span className="text-base">{lead.logo}</span>
                        <div className="text-left">
                          <strong className="text-xs text-white block truncate max-w-[120px] font-normal">{lead.name}</strong>
                          <span className="text-[8px] text-zinc-500 block uppercase tracking-wide font-mono">{lead.game} • {lead.members} members</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold block">{lead.score}</span>
                        <span className="text-[7px] text-emerald-400 font-mono">OPERATIONAL</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <p className="text-[9px] text-zinc-500 leading-relaxed text-center italic">
                    Points are generated from private league customs, approved scrim results under CV TDM Verification console, and overall member contribution indexes.
                  </p>
                </div>
              </div>

              {/* SYSTEM INFORMATION DECK */}
              <div className="bg-gradient-to-br from-zinc-950 to-stone-950 border border-zinc-900 p-5 rounded-2xl text-xs space-y-2.5 text-left">
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#ef4444] font-extrabold block">
                  SYSTEM CORE INTEGRITY BLOCK
                </span>
                <h4 className="font-extrabold text-white uppercase font-sans">AUTONOMY RULES</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Community Squads are autonomous player coalitions. All communications, strat media vaults, private schedules are client-isolated. Crimson Vipers Esports Guild is not liable for private scrim coordination conflicts.
                </p>
                <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Latency Gateway: <strong className="text-green-500">24ms</strong></span>
                  <span>Encryption: <strong className="text-zinc-300 font-black">SHA-512</strong></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED RECRUITMENT HUB */}
      {activeView === "recruitment" && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* HEADER SUMMARY */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-lg font-black font-orbitron tracking-widest text-white uppercase flex items-center gap-2">
                <span className="p-1 px-2 bg-red-950/40 text-red-500 rounded border border-red-900/30 font-sans text-sm">🎯</span>
                COMMUNITY ROSTER RECRUITMENT INDEX
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Browse open spots across autonomous community squads or publish a listing for your own team roster. Send high-priority audition files and secure contact info.
              </p>
            </div>
            
            <button
              onClick={() => {
                const el = document.getElementById("post-recruitment-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3.5 py-2 bg-red-955/20 hover:bg-red-950 border border-red-500/30 text-red-500 rounded-xl font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer whitespace-nowrap self-start md:self-center"
            >
              📣 Publish Recruitment Ad
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: ROSTER LISTINGS (8 COLS) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* LISTINGS SEARCH FILTER */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60 p-3 border border-zinc-900 rounded-xl text-xs">
                <span className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">
                  Showing <strong className="text-white font-black">{recruitmentAds.length} Active Slots</strong>
                </span>
                <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">REALTIME CLOUD ADVERTISING FEED</span>
              </div>

              {/* LISTINGS FEED CARDS */}
              <div className="space-y-4">
                {recruitmentAds.map((ad) => (
                  <div 
                    key={ad.id} 
                    className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between gap-4 group hover:border-red-500/20 transition-all text-left"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1c0c0c] to-transparent pointer-events-none blur-3xl opacity-65" />
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-3 gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-1 bg-zinc-900 rounded-xl border border-zinc-850">{ad.squadLogo || "🛡️"}</span>
                        <div className="text-left">
                          <h4 className="font-bold text-white tracking-wide text-xs uppercase">{ad.squadName}</h4>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">{ad.region} SECTOR • DISPATCHED</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Required Rank</span>
                        <strong className="text-[#ef4444] font-mono text-xs font-black">{ad.requiredRank}</strong>
                      </div>
                    </div>

                    {/* Roles Tag */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] text-zinc-500 uppercase block font-mono">Needed Roles:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ad.rolesNeeded.map((role: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-[#101010] border border-zinc-800 text-stone-300 text-[10px] font-mono rounded font-medium">
                            ⚔️ {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Desc */}
                    <p className="text-xs text-zinc-400 leading-normal bg-black/30 p-3 rounded-lg border border-zinc-900 text-left">
                      {ad.description}
                    </p>

                    {/* Actions Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 border-t border-zinc-900/65 mt-1">
                      <div className="font-mono text-[10px] text-zinc-550 text-left">
                        Secure Contact: <strong className="text-white font-normal">{ad.contactSpec}</strong>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setSelectedAdForApp(ad);
                          setAppRankInput("");
                          setAppRoleInput(ad.rolesNeeded[0] || "");
                          setAppNotesInput("");
                          setAppContactInput("");
                        }}
                        className="px-4 py-1.5 bg-red-650 hover:bg-red-700 text-white font-mono text-[10px] font-extrabold uppercase rounded tracking-wider flex items-center gap-1.5 cursor-pointer self-end transition-all"
                      >
                        <span>Send Audition Request</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🎯 APPLICATION SUBMISSION FORM MODAL / SHEET INLINE */}
              {selectedAdForApp && (
                <div className="bg-[#0b0c10] border-2 border-red-600/30 rounded-3xl p-6 space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      <div className="text-left">
                        <h4 className="text-[10px] font-black font-mono tracking-widest text-[#ef4444] uppercase">SEND APPLICATION AUDITION TO SQUAD</h4>
                        <strong className="text-sm text-white block uppercase">{selectedAdForApp.squadName}</strong>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedAdForApp(null)}
                      className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!appRankInput || !appRoleInput || !appContactInput) {
                        onAlert("⚠️ Missing information in form fields.");
                        return;
                      }
                      const newApp = {
                        id: "app-" + Date.now(),
                        adId: selectedAdForApp.id,
                        squadId: selectedAdForApp.squadId,
                        squadName: selectedAdForApp.squadName,
                        applicantIgn: currentIgn || "Anonymous Shooter",
                        rank: appRankInput,
                        roleApplied: appRoleInput,
                        skillsNote: appNotesInput,
                        contactInfo: appContactInput,
                        status: "Pending",
                        appliedAt: new Date().toISOString()
                      };
                      const updatedApps = [newApp, ...recruitmentApps];
                      setRecruitmentApps(updatedApps);
                      setSelectedAdForApp(null);
                      onAlert(`🎉 SENT AUDITION! Your application is submitted securely to ${selectedAdForApp.squadName}.`);
                    }}
                    className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                  >
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-zinc-500 mb-1">Applicant Game Character IGN</label>
                      <input 
                        type="text" 
                        disabled 
                        value={currentIgn}
                        className="w-full bg-[#111] text-zinc-500 border border-zinc-800 rounded p-2 focus:outline-none cursor-not-allowed opacity-90 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-zinc-500 mb-1 text-white flex items-center gap-1">Your Match Tier / KD <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Master V / 3.4 KD"
                        value={appRankInput}
                        onChange={(e) => setAppRankInput(e.target.value)}
                        className="w-full bg-black text-white border border-zinc-800 rounded p-2 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-zinc-500 mb-1">Target Roster Role <span className="text-red-500">*</span></label>
                      <select 
                        value={appRoleInput}
                        onChange={(e) => setAppRoleInput(e.target.value)}
                        className="w-full bg-black text-white border border-zinc-800 rounded p-2 focus:border-red-500 focus:outline-none select-none"
                      >
                        {selectedAdForApp.rolesNeeded.map((r: string, idx: number) => (
                          <option key={idx} value={r}>{r}</option>
                        ))}
                        <option value="General Sub/Player">General Sub/Player</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-mono text-zinc-500 mb-1 text-white flex items-center gap-1">Private Discord / WhatsApp <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Disc: reaper#9912"
                        value={appContactInput}
                        onChange={(e) => setAppContactInput(e.target.value)}
                        className="w-full bg-black text-white border border-zinc-800 rounded p-2 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 text-left">
                      <label className="block text-[9px] uppercase font-mono text-zinc-500 mb-1">Brief Roster Audition Statement</label>
                      <textarea 
                        rows={3}
                        placeholder="List competitive experiences, team accomplishments, active hours daily, or specific roles you excel on."
                        value={appNotesInput}
                        onChange={(e) => setAppNotesInput(e.target.value)}
                        className="w-full bg-black text-white border border-[#222] rounded p-2.5 focus:border-red-500 focus:outline-none resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-2.5">
                      <button 
                        type="button" 
                        onClick={() => setSelectedAdForApp(null)}
                        className="px-4 py-2 bg-transparent hover:text-white text-zinc-400 font-mono text-[10px] uppercase rounded-lg border border-zinc-850 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white font-mono text-[10px] uppercase font-black tracking-wider rounded-lg cursor-pointer transition-colors shadow-[0_0_15px_rgba(209,0,31,0.25)]"
                      >
                        Deploy Audition File
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: PUBLISH POST & STATUS DECK (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* STATUS TRACKING DECK */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                  <Activity size={15} className="text-emerald-400" />
                  <h3 className="text-xs font-black font-mono tracking-widest text-white uppercase">
                    📁 MY AUDITIONS SENT
                  </h3>
                </div>

                {recruitmentApps.length === 0 ? (
                  <div className="p-4 bg-zinc-900/30 border border-dashed border-zinc-900 rounded-xl text-center text-zinc-500 text-[11px] leading-relaxed">
                    No active applications found. Target a vacancy listing in the feed and click Apply to dispatch a secure recruitment trial application.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {recruitmentApps.map((app) => (
                      <div key={app.id} className="p-3 bg-black/40 border border-zinc-900 rounded-xl space-y-2 text-[11px] text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-905">
                          <span className="font-extrabold text-white block truncate max-w-[130px] uppercase">{app.squadName}</span>
                          <span className="text-[8px] font-mono font-bold bg-amber-955/20 border border-amber-900/40 text-amber-500 px-1.5 py-0.5 rounded uppercase">
                            {app.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-zinc-500">
                          <div className="flex justify-between"><span className="font-mono">Assign:</span> <span className="text-stone-300 font-bold">{app.roleApplied}</span></div>
                          <div className="flex justify-between"><span className="font-mono">Roster KD:</span> <span className="text-stone-300">{app.rank}</span></div>
                          <div className="flex justify-between"><span className="font-mono">Contact:</span> <span className="text-stone-300 truncate max-w-[100px]">{app.contactInfo}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 📣 PUBLISH RECRUITMENT POST SECTION */}
              <div id="post-recruitment-section" className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 text-left font-sans">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                  <PlusCircle size={15} className="text-red-500" />
                  <h3 className="text-xs font-black font-mono tracking-widest text-white uppercase">
                    📣 CREATE VACANCY AD
                  </h3>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!adSquadIdInput) {
                      onAlert("⚠️ You must specify a local Squad ID alignment.");
                      return;
                    }
                    if (!adRankInput || !adRolesInput || !adContactInput || !adDescInput) {
                      onAlert("⚠️ Please complete all form fields.");
                      return;
                    }
                    const targetSquadObj = squads.find(s => s.id === adSquadIdInput) || squads[0];
                    const newAd = {
                      id: "ad-" + Date.now(),
                      squadId: targetSquadObj.id,
                      squadName: targetSquadObj.name,
                      squadLogo: targetSquadObj.logo || "🛡️",
                      requiredRank: adRankInput,
                      rolesNeeded: adRolesInput.split(",").map(r => r.trim()),
                      description: adDescInput,
                      contactSpec: adContactInput,
                      region: targetSquadObj.region,
                      createdAt: new Date().toISOString()
                    };
                    const updatedAds = [newAd, ...recruitmentAds];
                    setRecruitmentAds(updatedAds);
                    setAdRankInput("");
                    setAdRolesInput("");
                    setAdDescInput("");
                    setAdContactInput("");
                    onAlert(`📢 Published Recruitment Ad for ${targetSquadObj.name} to the global roster feed!`);
                  }}
                  className="space-y-3.5 text-xs text-left"
                >
                  <div>
                    <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1">Select Active Local Squad <span className="text-red-500">*</span></label>
                    <select 
                      required
                      value={adSquadIdInput}
                      onChange={(e) => setAdSquadIdInput(e.target.value)}
                      className="w-full bg-black text-white border border-zinc-800 rounded p-2 focus:outline-none focus:border-red-500 select-none"
                    >
                      <option value="">-- Choose Squad --</option>
                      {squads.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1 text-white">Required Player Rank/KD <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Conqueror / Level 60+"
                      value={adRankInput}
                      onChange={(e) => setAdRankInput(e.target.value)}
                      className="w-full bg-black text-white border border-zinc-805 rounded p-2 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1 text-white">Needed Roles (Comma split) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Flanker, Assaulter, Scout"
                      value={adRolesInput}
                      onChange={(e) => setAdRolesInput(e.target.value)}
                      className="w-full bg-black text-white border border-zinc-805 rounded p-2 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1 text-white">Private Secure Contact Method <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Discord reaper#4912"
                      value={adContactInput}
                      onChange={(e) => setAdContactInput(e.target.value)}
                      className="w-full bg-black text-white border border-zinc-805 rounded p-2 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-mono text-zinc-500 mb-1 text-white">Public Ad Description <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={3} 
                      required
                      maxLength={180}
                      placeholder="Detail squad requirements, active scrim times, playstyle vibes, goals, etc..."
                      value={adDescInput}
                      onChange={(e) => setAdDescInput(e.target.value)}
                      className="w-full bg-black text-white border border-zinc-800 rounded p-2 focus:outline-none focus:border-red-500 resize-none h-16"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-red-650 hover:bg-red-750 text-white font-mono text-[9px] uppercase font-black tracking-widest rounded-lg cursor-pointer transition-all shadow-[0_0_15px_rgba(209,0,31,0.25)]"
                  >
                    Broadcast Vacancy Ad
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CREATE SQUAD VIEW */}
      {activeView === "create" && (
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <h3 className="text-lg font-black font-orbitron tracking-widest text-white uppercase flex items-center gap-1.5">
              <PlusCircle className="text-[#ef4444]" size={18} />
              Set Up New Autonomous Community Squad
            </h3>
            <button
              onClick={() => setActiveView("discovery")}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateSquad} className="space-y-4 text-xs text-zinc-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono block">Squad Faction Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omega Stryke Force"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-red-500 p-2 text-xs text-white placeholder-zinc-700 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono block">Squad Region Sector:</label>
                <select
                  value={newSquadRegion}
                  onChange={(e) => setNewSquadRegion(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-2 text-xs text-zinc-300 rounded"
                >
                  <option value="Africa">Africa</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="North America">North America</option>
                  <option value="Middle East">Middle East</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono block">Esports Esports Game:</label>
                <select
                  value={newSquadGame}
                  onChange={(e) => setNewSquadGame(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-2 text-xs text-zinc-300 rounded"
                >
                  <option value="PUBG Mobile">PUBG Mobile (Esports standard)</option>
                  <option value="CODM">CODM</option>
                  <option value="Valorant">Valorant</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono block">Squad Visibility Type:</label>
                <select
                  value={newSquadType}
                  onChange={(e) => setNewSquadType(e.target.value as any)}
                  className="w-full bg-black border border-zinc-800 p-2 text-xs text-zinc-300 rounded"
                >
                  <option value="Public">Public (visible in Discovery Hub search lists)</option>
                  <option value="Private">Private (fully hidden, join via secure code invitation only)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono block font-bold">Select Emblem Badge Logo:</label>
                <div className="flex gap-2">
                  {["🎯", "🔥", "💀", "🦁", "⚡", "🦖", "🏆", "🦾"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewSquadLogo(emoji)}
                      className={`text-xl p-2.5 rounded bg-black border transition-all ${
                        newSquadLogo === emoji ? "border-red-500 text-white" : "border-zinc-900 text-zinc-400 hover:border-zinc-850"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono block">Select Vector Banner Palette:</label>
                <div className="flex gap-2">
                  {[
                    "from-purple-900 to-indigo-950",
                    "from-amber-900 to-red-950",
                    "from-zinc-900 to-black",
                    "from-emerald-900 to-teal-980"
                  ].map((grad) => (
                    <button
                      key={grad}
                      type="button"
                      onClick={() => setNewSquadBanner(grad)}
                      className={`w-10 h-6 rounded-lg border transition-all bg-gradient-to-r ${grad} ${
                        newSquadBanner === grad ? "border-white" : "border-zinc-900"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-mono block">Squad Goal Description (Publicly viewable):</label>
              <textarea
                required
                rows={2}
                maxLength={150}
                placeholder="Briefly state your community goals or gaming schedule focus..."
                value={newSquadDesc}
                onChange={(e) => setNewSquadDesc(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-red-500 p-2.5 text-xs text-white placeholder-zinc-700 rounded resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-mono block">Recruitment Threshold Requirements:</label>
              <input
                type="text"
                placeholder="e.g. Minimum Tier K/D of 3.0, Android device with audio comms..."
                value={newSquadReq}
                onChange={(e) => setNewSquadReq(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-red-500 p-2 text-xs text-white placeholder-zinc-700 rounded text-left"
              />
            </div>

            <p className="text-[10px] text-zinc-550 leading-snug">
              🚨 <strong>Acknowledge Separation Strategy:</strong> Pre-emptive isolation locks community squads away from any formal Crimson Vipers coaching circles, premium administrative overlays, and primary competitive rosters. Only your approved invitees may enter.
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-red-650 hover:bg-red-700 text-white font-mono font-black tracking-widest text-xs uppercase rounded transition-all cursor-pointer border border-red-550 shadow-lg shadow-red-950/20"
            >
              DEPLOY COMMUNITY SQUAD SYSTEM UNIT
            </button>
          </form>
        </div>
      )}

      {/* SQUAD PORTAL (Member-only Sector Space) */}
      {activeView === "portal" && activeSquad && (
        <div className="space-y-6">
          
          {/* SQUAD HERO METRICS PANEL */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className={`bg-gradient-to-r ${activeSquad.banner} p-6 pb-20 text-left relative`}>
              <div className="absolute right-4 top-4 flex gap-2">
                <span className="text-[9px] font-mono uppercase bg-black/60 px-2 py-1 rounded-sm border border-zinc-800 text-zinc-300">
                  🌐 REGION: {activeSquad.region}
                </span>
                <span className="text-[9px] font-mono uppercase bg-black/60 px-2 py-1 rounded-sm border border-zinc-800 text-zinc-300">
                  🎮 SECTOR: {activeSquad.game}
                </span>
                <span className="text-[9px] font-mono uppercase bg-red-950/70 text-[#ef4444] px-2 py-1 rounded-sm border border-red-900/40">
                  {activeSquad.squadType} Sector
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-4xl p-2 bg-black/50 border border-zinc-800 rounded-xl relative">
                  {activeSquad.logo}
                </span>
                <div>
                  <h3 className="text-2xl font-black font-orbitron italic tracking-tight text-white uppercase leading-none">
                    {activeSquad.name}
                  </h3>
                  <p className="text-xs text-zinc-350 max-w-xl mt-1.5 leading-normal italic">
                    "{activeSquad.description}"
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats ribbon */}
            <div className="bg-black/80 px-6 py-4 border-t border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 -mt-14 relative z-10 mx-4 rounded-xl shadow-xl">
              <div className="flex flex-wrap gap-6 text-xs font-mono">
                <div>
                  <span className="text-zinc-550 block text-[9.5px]">SQUAD SIZE</span>
                  <strong className="text-white text-base">{activeSquad.members.length} Clearances</strong>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div>
                  <span className="text-zinc-550 block text-[9.5px]">ROLE ASSIGNED</span>
                  <strong className="text-red-400 text-base">{activeMemberRole}</strong>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div>
                  <span className="text-zinc-550 block text-[9.5px]">STANDALONE FILES</span>
                  <strong className="text-zinc-300 text-base">
                    {squadFiles.filter(f => f.squadId === activeSquad.id).length} Documents
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeVoiceSquad === activeSquad.id ? (
                  <button
                    onClick={() => {
                      setActiveVoiceSquad(null);
                      onAlert("Disconnected from squad voice feed.");
                    }}
                    className="p-2 bg-emerald-750 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:bg-red-650 hover:text-white"
                  >
                    <Volume2 className="animate-pulse" size={13} />
                    <span>Active Voice Room 📞 Connected</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveVoiceSquad(activeSquad.id);
                      onAlert("Entered secure squad offline-comms channel. Green indicator ripples represent team audio output.");
                    }}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Volume2 size={13} />
                    <span>Connect Voice Room (Mock)</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    handleLeaveSquad(activeSquad.id);
                  }}
                  className="p-2 bg-red-950/20 text-red-500 hover:bg-[#ef4444] border border-red-900/10 hover:text-white rounded-lg text-xs font-mono font-black tracking-widest uppercase transition-colors cursor-pointer"
                >
                  Leave Sector
                </button>
              </div>
            </div>

            {/* TAB SELECT MENU (The 12 Private Features) */}
            <div className="border-t border-zinc-900/60 mt-4 overflow-x-auto">
              <div className="flex p-2 gap-1 px-4 text-xs font-mono bg-[#0c0c0e]">
                {[
                  { id: "chat", label: "💬 Chat" },
                  { id: "announce", label: "📢 Announcements" },
                  { id: "calendar", label: "📅 Calendar" },
                  { id: "media", label: "📸 Media Gallery" },
                  { id: "strategy", label: "📍 Strategy Room" },
                  { id: "scrim", label: "⚔️ Scrim Planning" },
                  { id: "files", label: "💾 File Storage" },
                  { id: "stats", label: "📈 Stats Report" },
                  { id: "attendance", label: "📝 Attendance" },
                  { id: "voice", label: "📞 Voice Logs" },
                  { id: "match", label: "🏆 History" },
                  { id: "awards", label: "🎖️ Achievements" },
                  { id: "settings", label: "⚙️ Management & Invites" }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setPortalTab(tb.id)}
                    className={`px-3 py-2 rounded shrink-0 transition-colors cursor-pointer ${
                      portalTab === tb.id ? "bg-red-650 text-white font-bold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* SQUAD EXCLUSIVE VIEWPORTS */}
          <div className="bg-[#09090b]/80 border border-zinc-900 p-5 rounded-2xl text-left">
            
            {/* 1. SQUAD PRIVATE CHAT */}
            {portalTab === "chat" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-red-500" />
                    Isolated Comms Stream ({activeSquad.name})
                  </h4>
                </div>

                <div className="h-72 overflow-y-auto bg-black border border-zinc-900 p-4 rounded-xl space-y-3 font-sans text-xs flex flex-col justify-end">
                  {messages.filter(m => m.squadId === activeSquad.id).length === 0 ? (
                    <p className="text-zinc-600 text-center italic my-auto">No chats logged. Drop a warmup message!</p>
                  ) : (
                    messages
                      .filter(m => m.squadId === activeSquad.id)
                      .map((msg) => {
                        const isMe = msg.sender.toLowerCase() === currentIgn.toLowerCase();
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-mono text-[9px] text-zinc-500">{msg.sender}</span>
                              <span className="text-[7.5px] bg-zinc-900 text-zinc-400 px-1 rounded block uppercase tracking-wider font-mono">
                                {msg.role}
                              </span>
                            </div>
                            <div className={`p-2.5 rounded-lg max-w-sm ${
                              isMe ? "bg-red-600 text-white rounded-tr-none" : "bg-zinc-900 text-zinc-300 rounded-tl-none"
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Coordinate sector operations..."
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    className="flex-1 bg-black border border-zinc-800 text-xs px-3 rounded focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>
            )}

            {/* 2. SQUAD ANNOUNCEMENTS */}
            {portalTab === "announce" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <Megaphone size={13} className="text-yellow-500 animate-bounce" />
                    Important Announcements
                  </h4>
                  <span className="text-[8px] color-[#ef4444] tracking-wide text-zinc-400 font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded">
                    ADMIN RESTRICTED
                  </span>
                </div>

                {/* POST FORM (Conditionally visible based on user permissions) */}
                {checkPermission("postAnnouncements") ? (
                  <form onSubmit={handlePostAnnouncement} className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block font-bold">Write Announcements Bulletin:</span>
                    <input
                      type="text"
                      required
                      placeholder="Title of Bulletin..."
                      value={typedAnnTitle}
                      onChange={(e) => setTypedAnnTitle(e.target.value)}
                      className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded focus:border-red-500 focus:outline-none"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Write instructions cleanly..."
                      value={typedAnnCont}
                      onChange={(e) => setTypedAnnCont(e.target.value)}
                      className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded focus:border-red-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-red-650 hover:bg-red-700 text-white text-[10px] uppercase font-mono tracking-widest rounded transition-colors cursor-pointer block"
                    >
                      Broadcast Bulletin
                    </button>
                  </form>
                ) : (
                  <div className="bg-zinc-950/40 p-3 rounded border border-zinc-900 text-[10px] text-zinc-500 font-mono">
                    🔒 Currently restricted. Only roles authorized under customizable permissions can post announcements.
                  </div>
                )}

                {/* BULLETIN FEED */}
                <div className="space-y-3">
                  {announcements.filter(a => a.squadId === activeSquad.id).length === 0 ? (
                    <p className="text-zinc-650 italic text-center text-xs">No announcements broadcasted yet.</p>
                  ) : (
                    announcements
                      .filter(a => a.squadId === activeSquad.id)
                      .map((ann) => (
                        <div key={ann.id} className="bg-black border border-zinc-850 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-1">
                            <strong className="text-white text-xs block">{ann.title}</strong>
                            <span className="text-[8.5px] text-zinc-500 font-mono">
                              By {ann.postedBy} • {new Date(ann.postedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-xs font-sans leading-relaxed">{ann.content}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* 3. CALENDAR */}
            {portalTab === "calendar" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <Calendar size={13} className="text-indigo-400" />
                    Squad Operational Calendar Tasks
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  
                  {/* Event Creation Form */}
                  <form onSubmit={handleCreateEvent} className="lg:col-span-2 bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block font-bold">Schedule Clan Event:</span>
                    <input
                      type="text"
                      required
                      placeholder="Practice Session, Clan Sync, etc..."
                      value={typedEventTitle}
                      onChange={(e) => setTypedEventTitle(e.target.value)}
                      className="w-full bg-black border border-[#181818] p-2 text-xs text-white rounded focus:border-red-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={typedEventDate}
                        onChange={(e) => setInviteExpDate(e.target.value)}
                        className="bg-black border border-zinc-850 p-1.5 text-xs text-zinc-400 font-mono rounded"
                      />
                      <input
                        type="time"
                        value={typedEventTime}
                        onChange={(e) => setTypedEventTime(e.target.value)}
                        className="bg-black border border-zinc-850 p-1.5 text-xs text-zinc-400 font-mono rounded"
                      />
                    </div>
                    <select
                      value={typedEventType}
                      onChange={(e) => setTypedEventType(e.target.value)}
                      className="w-full bg-black border border-zinc-850 p-1.5 text-xs text-zinc-350 rounded"
                    >
                      <option value="Practice">🏋️ Practice Warmup</option>
                      <option value="Scrim">⚔️ Unofficial Scrim</option>
                      <option value="Match">🏆 Community Bracket Match</option>
                      <option value="Meeting">🧠 Strategic Discussion</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Notes / lobby details..."
                      value={typedEventDesc}
                      onChange={(e) => setTypedEventDesc(e.target.value)}
                      className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-[9.5px] uppercase font-mono tracking-widest rounded transition-colors cursor-pointer"
                    >
                      Calendar Event Entry
                    </button>
                  </form>

                  {/* Operational list */}
                  <div className="lg:col-span-3 space-y-2">
                    {events.filter(e => e.squadId === activeSquad.id).length === 0 ? (
                      <p className="text-zinc-650 text-center italic text-xs py-10 border border-dashed border-zinc-900 rounded-xl">
                        No events filed. Schedule practice under scheduling controls.
                      </p>
                    ) : (
                      events
                        .filter(e => e.squadId === activeSquad.id)
                        .map((ev) => (
                          <div key={ev.id} className="bg-black/40 border border-zinc-850 p-3 rounded-lg flex justify-between items-center text-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] bg-indigo-950/50 border border-indigo-900/30 text-indigo-400 px-1.5 py-0.5 rounded font-mono uppercase mr-2 font-bold select-none">
                                {ev.type}
                              </span>
                              <strong className="text-white font-sans">{ev.title}</strong>
                              <p className="text-zinc-500 font-mono text-[9px]">{ev.desc}</p>
                            </div>
                            <div className="text-right font-mono text-[10px] text-zinc-400 shrink-0">
                              <span>{ev.dateTime.replace("T", " ")}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 4. MEDIA GALLERY */}
            {portalTab === "media" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-emerald-500" />
                    Squad Multimedia Showcase
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <form onSubmit={handleUploadMedia} className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3 prose flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-zinc-500 block font-bold mb-2">Catalogue Esports Snippet:</span>
                      <input
                        type="text"
                        required
                        placeholder="Clip Title / KD Record..."
                        value={typedMediaTitle}
                        onChange={(e) => setTypedMediaTitle(e.target.value)}
                        className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded mb-2 placeholder-zinc-700"
                      />
                      <input
                        type="text"
                        placeholder="Image URL (empty for Erangel MVP template)"
                        value={typedMediaUrl}
                        onChange={(e) => setTypedMediaUrl(e.target.value)}
                        className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded placeholder-zinc-700 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-650 hover:bg-emerald-700 text-white text-[9.5px] uppercase font-mono tracking-widest rounded transition-colors cursor-pointer mt-4"
                    >
                      Archive Media Node
                    </button>
                  </form>

                  <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaItems.filter(m => m.squadId === activeSquad.id).length === 0 ? (
                      <p className="text-zinc-650 italic text-center py-20 col-span-3 font-mono text-xs">No media logged.</p>
                    ) : (
                      mediaItems
                        .filter(m => m.squadId === activeSquad.id)
                        .map((med) => (
                          <div key={med.id} className="bg-black/60 rounded-xl border border-zinc-850 overflow-hidden text-xs">
                            <div className="w-full h-24 bg-black relative">
                              <img 
                                src={med.url} 
                                alt={med.title} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="p-2.5 text-left space-y-1">
                              <strong className="text-white truncate block">{med.title}</strong>
                              <span className="text-[8px] text-zinc-500 block">Uploaded by {med.uploadedBy}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. STRATEGY ROOM */}
            {portalTab === "strategy" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <BookOpen size={13} className="text-red-400" />
                    Interactive Tactical Blueprint Room
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  
                  {/* Left Controls column */}
                  <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">Select Map Preset:</label>
                        <select
                          value={activeStrategyMap}
                          onChange={(e) => setActiveStrategyMap(e.target.value)}
                          className="bg-black border border-zinc-850 w-full text-xs font-mono text-zinc-300 px-2 py-1.5 rounded"
                        >
                          <option value="Erangel">Erangel (Standard Island Grid)</option>
                          <option value="Miramar">Miramar (Arid High Altitude Zones)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 block uppercase font-mono mb-1">Squad Landing Strategy Instruction:</span>
                        <textarea
                          rows={3}
                          value={strategyNotes[activeStrategyMap] || ""}
                          onChange={(e) => setStrategyNotes({ ...strategyNotes, [activeStrategyMap]: e.target.value })}
                          className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded focus:border-red-500"
                        />
                        <span className="text-[8px] text-zinc-650 block">Changes persist automatically inside isolated state memory.</span>
                      </div>
                    </div>

                    <form onSubmit={handleAddPin} className="border-t border-zinc-900 pt-3 space-y-2">
                      <span className="text-[9px] text-zinc-500 block uppercase font-mono">Simulate Tactical Beacon Pin:</span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ridge Snipers Sector"
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value)}
                          className="flex-1 bg-black border border-zinc-850 text-xs px-2 rounded"
                        />
                        <button
                          type="submit"
                          className="px-3 bg-red-650 text-white rounded text-[10px] font-mono font-bold hover:bg-red-700 cursor-pointer"
                        >
                          Pin
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Interactive Strategy Map Visual Canvas Frame */}
                  <div className="lg:col-span-8 bg-black border border-zinc-900 p-3 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-72">
                    <div className="absolute top-3 left-3 bg-black/80 border border-zinc-900 px-2.5 py-1 rounded text-[10px] font-mono select-none z-10 text-zinc-300">
                      🗺️ Map Grid Sector: <strong className="text-[#ef4444] uppercase">{activeStrategyMap}</strong>
                    </div>

                    <div className="relative w-full max-w-lg aspect-video bg-zinc-900 border border-zinc-850 rounded-xl flex items-center justify-center overflow-hidden">
                      {/* Grid Line simulation overlays */}
                      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                        {[...Array(16)].map((_, i) => (
                          <div key={i} className="border border-zinc-950/20 text-[8px] text-zinc-800 font-mono font-bold p-1 select-none">
                            SEC-{i + 10}
                          </div>
                        ))}
                      </div>

                      {/* Map backdrop simulation */}
                      <div className="absolute inset-10 italic text-[11px] font-sans font-bold text-zinc-800 opacity-20 text-center select-none">
                        CRIMSON SECTOR DECOUPLED OPERATIONS RADAR SYSTEM LAYOUT 
                      </div>

                      {/* Placed coordinates beacons */}
                      {strategyPins.map((pin, i) => (
                        <div
                          key={i} 
                          className="absolute bg-red-600/80 hover:bg-red-600 border border-white text-[9.5px] font-bold text-white font-mono px-2 py-0.5 rounded shadow-lg flex items-center gap-1 cursor-pointer transition-transform duration-200"
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        >
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                          <span>{pin.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 6. SCRIM PLANNING */}
            {portalTab === "scrim" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <Award size={13} className="text-red-500" />
                    Squad Scrim Planning & Rival Standings
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  
                  {/* Scrim Setup controls */}
                  <form onSubmit={handleCreateScrimPlan} className="md:col-span-5 bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block font-bold mb-1">Plan Match Coordinates:</span>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono block">Rival Clan / Opponent:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CV Youth Team, Delta Faction"
                        value={typedScrimOpp}
                        onChange={(e) => setTypedScrimOpp(e.target.value)}
                        className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono block">Date Stamp:</label>
                        <input
                          type="date"
                          value={typedScrimDate}
                          onChange={(e) => setTypedScrimDate(e.target.value)}
                          className="w-full bg-black border border-zinc-850 p-1.5 text-xs text-zinc-400 font-mono rounded"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono block">Tactical Map:</label>
                        <select
                          value={typedScrimMap}
                          onChange={(e) => setTypedScrimMap(e.target.value)}
                          className="w-full bg-black border border-zinc-850 p-1.5 text-xs text-zinc-350 rounded"
                        >
                          <option value="Erangel">Erangel</option>
                          <option value="Miramar">Miramar</option>
                          <option value="Sanhok">Sanhok</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-mono font-black tracking-widest text-[10px] uppercase rounded transition-all cursor-pointer"
                    >
                      Schedule Scrimmage
                    </button>
                  </form>

                  {/* Operational registers */}
                  <div className="md:col-span-7 space-y-2">
                    {scrimPlans.filter(p => p.squadId === activeSquad.id).length === 0 ? (
                      <p className="text-zinc-650 text-center italic text-xs py-8 border border-dashed border-zinc-900 rounded-xl block">
                        No planned scrimmage sessions queued.
                      </p>
                    ) : (
                      scrimPlans
                        .filter(p => p.squadId === activeSquad.id)
                        .map((sp) => (
                          <div key={sp.id} className="bg-black/40 border border-zinc-850 p-3.5 rounded-lg flex justify-between items-center text-xs">
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-mono bg-red-950/40 text-[#ef4444] px-1.5 py-0.5 rounded font-bold border border-red-900/10 mr-2">
                                MAP: {sp.mapName}
                              </span>
                              <strong className="text-white">vs. {sp.opponent}</strong>
                              <p className="text-zinc-550 font-mono text-[8.5px]">{sp.dateTime.replace("T", " ")}</p>
                            </div>
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              {sp.status}
                            </span>
                          </div>
                        ))
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 7. FILE STORAGE */}
            {portalTab === "files" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <FileText size={13} className="text-[#ef4444]" />
                    Private Team Briefing File Storage
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <form onSubmit={handleUploadFile} className="md:col-span-4 bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
                    <span className="text-[9.5px] uppercase font-mono text-zinc-500 block font-bold">Upload Briefing Docs:</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. bridge_camp_defense_matrix"
                      value={typedFileName}
                      onChange={(e) => setTypedFileName(e.target.value)}
                      className="w-full bg-black border border-zinc-850 p-2 text-xs text-white rounded mb-2"
                    />
                    <select
                      value={typedFileSize}
                      onChange={(e) => setTypedFileSize(e.target.value)}
                      className="w-full bg-black border border-zinc-850 p-1.5 text-xs text-zinc-350 rounded mb-2"
                    >
                      <option value="1.2 MB">1.2 MB</option>
                      <option value="1.8 MB">1.8 MB</option>
                      <option value="3.4 MB">3.4 MB</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-red-650 hover:bg-red-700 text-white text-[9.5px] uppercase font-mono tracking-widest rounded transition-colors cursor-pointer"
                    >
                      Store Tactical Node
                    </button>
                  </form>

                  <div className="md:col-span-8 space-y-2">
                    {squadFiles.filter(f => f.squadId === activeSquad.id).length === 0 ? (
                      <p className="text-zinc-650 text-center italic text-xs py-10 rounded border border-dashed border-zinc-900 font-mono">
                        No tactical papers uploaded to storage sector.
                      </p>
                    ) : (
                      squadFiles
                        .filter(f => f.squadId === activeSquad.id)
                        .map((file) => (
                          <div key={file.id} className="bg-black/50 border border-zinc-850 p-3.5 rounded-lg flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2.5">
                              <FileText size={16} className="text-red-500 shrink-0" />
                              <div className="min-w-0">
                                <strong className="text-white truncate block font-sans">{file.fileName}</strong>
                                <span className="text-[8.5px] text-zinc-500 block font-mono">
                                  Size: {file.fileSize} • Uploaded by {file.uploadedBy}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => onAlert(`💾 Downloading independent file: [${file.fileName}]`)}
                              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-[9.5px] font-mono font-bold transition-all cursor-pointer"
                            >
                              Download File
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 8. STATISTICS REPORT */}
            {portalTab === "stats" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <BarChart2 size={13} className="text-emerald-500" />
                    Squad Combat Performance Report (Mock)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "SQUAD KD INDEX (Classic)", val: "3.24", col: "text-red-500" },
                    { title: "CHICKEN DINNER WINRATE", val: "22.5%", col: "text-yellow-500" },
                    { title: "AVERAGE TOP-10 STREAK", val: "78.4%", col: "text-teal-400" }
                  ].map((st, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-center space-y-1 select-none">
                      <span className="text-[9.5px] text-zinc-550 block font-mono uppercase">{st.title}</span>
                      <strong className={`text-2xl font-black font-orbitron italic ${st.col}`}>{st.val}</strong>
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto rounded border border-zinc-900 mt-2">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-500 text-[8px] uppercase border-b border-zinc-900 select-none">
                        <th className="py-2.5 px-3">Squad Fighter IGN</th>
                        <th className="py-2.5 px-2 text-center">Matches</th>
                        <th className="py-2.5 px-2 text-center">Assigned Kills</th>
                        <th className="py-2.5 px-2 text-center">Assigned Deaths</th>
                        <th className="py-2.5 px-3 text-right text-emerald-400">Combat KD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {activeSquad.members.map((mem, idx) => {
                        const simulatedKills = 150 - idx * 25;
                        const simulatedDeaths = 45;
                        const kdVal = (simulatedKills / simulatedDeaths).toFixed(2);
                        return (
                          <tr key={mem.ign} className="hover:bg-zinc-950/40">
                            <td className="py-2 px-3 text-white font-black">{mem.ign}</td>
                            <td className="py-2 text-center text-zinc-400">32</td>
                            <td className="py-2 text-center text-zinc-300 font-bold">{simulatedKills}</td>
                            <td className="py-2 text-center text-zinc-500">45</td>
                            <td className="py-2 px-3 text-right font-black text-emerald-400">{kdVal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. ATTENDANCE TRACKER */}
            {portalTab === "attendance" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <CheckSquare size={13} className="text-red-500" />
                    Squad Active Attendance & Practice Logs
                  </h4>
                </div>

                {(() => {
                  const evs = events.filter(e => e.squadId === activeSquad.id);
                  if (evs.length === 0) {
                    return (
                      <p className="text-zinc-650 italic text-center text-xs py-8 font-mono">
                        No events filed to track attendance logs.
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {evs.map((ev) => {
                        const evAttendeeLogs = attendanceLogs[ev.id] || {};
                        return (
                          <div key={ev.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                              <div>
                                <strong className="text-white text-xs">{ev.title}</strong>
                                <span className="text-[8px] text-zinc-500 font-mono block">Event type: {ev.type}</span>
                              </div>
                              <span className="text-zinc-400 font-mono text-[9px]">{ev.dateTime.replace("T", " ")}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {activeSquad.members.map((m) => {
                                const currentStatus = evAttendeeLogs[m.ign] || "Absent";
                                return (
                                  <div key={m.ign} className="flex items-center justify-between p-2 bg-black/60 rounded border border-zinc-900 text-xs">
                                    <span className="font-bold text-white font-mono">{m.ign}</span>
                                    <div className="flex gap-1.5">
                                      {["Present", "Excused", "Absent"].map((st) => (
                                        <button
                                          key={st}
                                          type="button"
                                          onClick={() => toggleAttendance(ev.id, m.ign, st)}
                                          className={`px-2 py-0.5 text-[8.5px] font-mono rounded cursor-pointer ${
                                            currentStatus === st 
                                              ? (st === "Present" ? "bg-emerald-950 text-emerald-400 font-bold" : st === "Excused" ? "bg-amber-950 text-amber-400 font-bold" : "bg-red-950 text-red-400 font-bold")
                                              : "bg-zinc-900 text-zinc-550"
                                          }`}
                                        >
                                          {st}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 10. VOICE CHANNEL FEED */}
            {portalTab === "voice" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <Volume2 size={13} className="text-red-500" />
                    Voice Logs & Channel Occupancy (Mock)
                  </h4>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 select-none">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#ef4444] font-black">
                      Operational Offline Soundwaves Monitor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/60 p-4 border border-zinc-900 rounded-xl space-y-3">
                      <strong className="text-white text-xs block font-mono">🔊 Tactical Briefing room:</strong>
                      <div className="space-y-2 text-xs">
                        {activeSquad.members.slice(0, 3).map((m, i) => (
                          <div key={m.ign} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-zinc-300 font-mono">{m.ign}</span>
                            <span className="text-[8px] text-zinc-650 italic font-sans">(Speaking with green audio feedback loops)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/60 p-4 border border-zinc-900 rounded-xl space-y-3">
                      <strong className="text-white text-xs block font-mono">💤 AFK Channel:</strong>
                      <div className="space-y-2 text-xs">
                        {activeSquad.members.length > 3 ? (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-600" />
                            <span className="text-zinc-500 font-mono">{activeSquad.members[3].ign}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 italic">No members idling.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 11. MATCH HISTORY */}
            {portalTab === "match" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2 flex justify-between items-center bg-black/20">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <History size={13} className="text-[#ef4444]" />
                    Esports Match Faction Battles Logs
                  </h4>
                </div>

                <div className="overflow-x-auto rounded border border-zinc-900">
                  <table className="w-full text-left font-mono text-[10px]">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-500 text-[8px] uppercase border-b border-zinc-900 select-none">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-2">Opponent Registry</th>
                        <th className="py-2.5 px-2 text-center">Outcome</th>
                        <th className="py-2.5 px-2 text-center">Recorded Kills</th>
                        <th className="py-2.5 px-3 text-right">Trophy MVP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 font-sans">
                      {[
                        { date: "June 09, 2026", opp: "ZIM High Raiders", res: "Win", kills: 14, mvp: "CV_Slayer_IGL" },
                        { date: "June 05, 2026", opp: "Viper Youth Sector", res: "Loss", kills: 9, mvp: "Shadow_Mamba" }
                      ].map((m, idx) => (
                        <tr key={idx} className="hover:bg-zinc-950/40">
                          <td className="py-2.5 px-3 font-mono text-[9px] text-zinc-500">{m.date}</td>
                          <td className="py-2.5 px-2 text-white font-black">{m.opp}</td>
                          <td className="py-2.5 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase select-none ${
                              m.res === "Win" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" : "bg-red-950 text-red-500 border border-red-900/30"
                            }`}>
                              {m.res}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono text-zinc-350">{m.kills} Kills</td>
                          <td className="py-2.5 px-3 text-right font-mono text-xs text-yellow-500">{m.mvp} 🥇</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 12. ACHIEVEMENT SHOWCASE */}
            {portalTab === "awards" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h4 className="text-xs font-black font-orbitron tracking-widest uppercase text-white flex items-center gap-1.5">
                    <Trophy size={13} className="text-yellow-500 animate-bounce" />
                    Badge achievements Shelf & medals Showcase
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: "First Blood Cleared", desc: "Log a competitive team win against any other community squad.", badge: "🦾" },
                    { title: "Perfect Attendance", desc: "All roster slots checked-in with Present status in practice logs.", badge: "📅" },
                    { title: "Sector Conqueror", desc: "Accumulate K/D multiplier ratio greater than 3.0 across 10 games.", badge: "👑" }
                  ].map((aw, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900/80 p-4 rounded-xl text-center space-y-2 flex flex-col items-center justify-between select-none">
                      <span className="text-3xl bg-black/40 p-2.5 rounded-full block">{aw.badge}</span>
                      <div className="text-center">
                        <strong className="text-white text-xs block font-sans">{aw.title}</strong>
                        <p className="text-[10px] text-zinc-555 leading-relaxed mt-1 font-mono">{aw.desc}</p>
                      </div>
                      <span className="text-[8px] font-mono bg-red-950/25 border border-red-900/40 text-[#ef4444] uppercase tracking-widest px-1.5 py-0.5 mt-2 rounded">
                        UNLOCKED SECTOR
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SQUAD OWNER ONLY ADMIN CONFIG (MEMBERSHIP & PERMISSIONS DESIGNATOR) */}
            {portalTab === "settings" && (
              <div className="space-y-6">
                
                {/* 1. SECURE CODES INVITATION MANAGER */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <LinkIcon size={14} className="text-[#ef4444]" />
                    <h5 className="text-[11px] font-black font-mono tracking-widest uppercase text-white">
                      🎫 Secure Invitation Link Manager
                    </h5>
                  </div>
                  
                  {activeMemberRole === "Squad Owner" || activeMemberRole === "Co-Owner" ? (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end text-xs">
                      
                      {/* Generator Form */}
                      <form onSubmit={generateInviteLink} className="md:col-span-2 space-y-3.5 border-r border-zinc-900 pr-5">
                        <span className="text-[9.5px] uppercase font-mono text-zinc-500 block font-bold leading-none">
                          Generate Invite Link (Stored in squadInvites):
                        </span>
                        
                        <div className="space-y-1">
                          <label className="text-[9.5px] text-zinc-500 font-mono block">Expiration Date Stamp:</label>
                          <input
                            type="date"
                            required
                            value={inviteExpDate}
                            onChange={(e) => setInviteExpDate(e.target.value)}
                            className="bg-black w-full border border-zinc-850 p-2 text-xs text-zinc-300 font-mono rounded focus:border-[#ef4444]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] text-zinc-500 font-mono block">Maximum Usage Threshold:</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            required
                            value={inviteMaxUses}
                            onChange={(e) => setInviteMaxUses(parseInt(e.target.value) || 1)}
                            className="bg-black w-full border border-zinc-850 p-2 text-xs text-white font-mono rounded focus:border-[#ef4444]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-red-650 hover:bg-red-700 text-white font-mono font-black tracking-widest text-[9px] uppercase rounded transition-colors cursor-pointer"
                        >
                          Generate Code String
                        </button>
                      </form>

                      {/* Generated List */}
                      <div className="md:col-span-3 space-y-3 font-mono">
                        <span className="text-[9.5px] uppercase text-zinc-500 block font-bold mb-1">
                          Active Invite Links Database ({squadInvites.filter(i => i.squadId === activeSquad.id).length})
                        </span>
                        {squadInvites.filter(i => i.squadId === activeSquad.id).length === 0 ? (
                          <p className="text-[10px] text-zinc-650 italic">No invite keys registered yet. Formulate codes on left.</p>
                        ) : (
                          <div className="space-y-2 h-44 overflow-y-auto">
                            {squadInvites
                              .filter(i => i.squadId === activeSquad.id)
                              .map((inv) => (
                                <div key={inv.id} className="bg-black border border-zinc-850 p-2.5 rounded text-[10px] space-y-1.5 relative group">
                                  <div className="flex justify-between items-center bg-black/35 pb-1">
                                    <strong className="text-white text-xs">{inv.inviteCode}</strong>
                                    <button
                                      onClick={() => deleteInviteCode(inv.id)}
                                      className="text-red-400 hover:text-white transition-colors cursor-pointer"
                                      title="Revoke Verification Code"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                  <p className="text-zinc-500 text-[9px]">
                                    Expires: <span className="text-zinc-300">{inv.expiresAt}</span> • Cleared Uses: <span className="text-zinc-300">{inv.currentUses}/{inv.maxUses}</span>
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="bg-[#111217] p-4 rounded-xl text-center text-[10px] text-zinc-500 font-mono">
                      🔒 Error: Invitation commands restricted to Owners and Co-Owners.
                    </div>
                  )}
                </div>

                {/* 2. CUSTOMIZABLE ROLE PERMISSIONS */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2 select-none">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[#ef4444]" />
                      <h4 className="text-xs font-black font-mono tracking-widest uppercase text-white">
                        🌐 Customizable Role Permissions
                      </h4>
                    </div>
                    <span className="text-[8.5px] uppercase font-mono text-[#ef4444] bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded font-black">
                      OWNER CONFIG ONLY
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Squad Owners can customize exactly who can post announcements, schedule matches, edit strategies, manage members and upload files.
                  </p>

                  <div className="space-y-4 text-xs font-mono">
                    {[
                      { key: "postAnnouncements", label: "Who can post Announcements?" },
                      { key: "scheduleScrims", label: "Who can schedule Scrim Matches?" },
                      { key: "uploadFiles", label: "Who can upload briefing Documents?" },
                      { key: "editStrategies", label: "Who can edit strategies in canvas?" }
                    ].map((permRow) => {
                      const currentList = (permissions[activeSquad.id] || {
                        postAnnouncements: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
                        manageMembers: ["Squad Owner", "Co-Owner"],
                        scheduleScrims: ["Squad Owner", "Co-Owner", "Captain", "Manager"],
                        uploadFiles: ["Squad Owner", "Co-Owner", "Captain", "Manager", "Member"],
                        editStrategies: ["Squad Owner", "Co-Owner", "Captain"],
                        accessVault: ["Squad Owner", "Co-Owner"]
                      })[permRow.key as keyof SquadPermissionConfig];

                      return (
                        <div key={permRow.key} className="bg-black/55 p-3 rounded-lg border border-zinc-900/70 space-y-2">
                          <span className="text-zinc-350 font-bold block">{permRow.label}</span>
                          <div className="flex flex-wrap gap-3">
                            {["Co-Owner", "Captain", "Manager", "Member", "Recruit"].map((role) => {
                              const checked = currentList.includes(role);
                              const disabled = activeMemberRole !== "Squad Owner";
                              return (
                                <label
                                  key={role} 
                                  className={`flex items-center gap-1.5 text-[10px] cursor-pointer ${
                                    disabled ? "opacity-50 select-none cursor-not-allowed" : ""
                                  } ${checked ? "text-[#ef4444] font-bold" : "text-zinc-500"}`}
                                >
                                  <input
                                    type="checkbox"
                                    disabled={disabled}
                                    checked={checked}
                                    onChange={() => handleToggleCustomPermission(permRow.key as keyof SquadPermissionConfig, role)}
                                    className="accent-red-650"
                                  />
                                  <span>{role}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. CORE MANAGE MEMBERS REGISTER */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <Users size={14} className="text-[#ef4444]" />
                    <h5 className="text-[11px] font-black font-mono tracking-widest uppercase text-white">
                      🚪 Clearances & Member Eviction
                    </h5>
                  </div>

                  {activeSquad.joinRequests.length > 0 && (
                    <div className="bg-red-950/20 p-4 border border-red-900/30 rounded-xl space-y-3">
                      <span className="text-[9.5px] uppercase font-mono text-[#ef4444] block font-bold">
                        Pending Join Solicitations ({activeSquad.joinRequests.length}):
                      </span>
                      <div className="space-y-2">
                        {activeSquad.joinRequests.map((reqIgn) => (
                          <div key={reqIgn} className="flex items-center justify-between p-2 bg-black/60 rounded border border-zinc-900 text-xs">
                            <span className="font-bold text-white font-mono">{reqIgn} (Wishes to enlist)</span>
                            <div className="flex gap-1.5 font-mono">
                              <button
                                onClick={() => approveJoinRequest(activeSquad.id, reqIgn)}
                                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[8px] font-bold uppercase transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => rejectJoinRequest(activeSquad.id, reqIgn)}
                                className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-805 text-zinc-400 rounded text-[8px] font-bold uppercase"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {activeSquad.members.map((member) => {
                      const isSelf = member.ign.toLowerCase() === currentIgn.toLowerCase();
                      const canManage = checkPermission("manageMembers") && !isSelf;
                      return (
                        <div key={member.ign} className="flex items-center justify-between p-3.5 bg-black/60 rounded-xl border border-zinc-900 text-xs hover:border-zinc-850 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">👤</span>
                            <div>
                              <strong className="text-white font-mono">{member.ign} {isSelf && "(You)"}</strong>
                              <span className="text-[8.5px] text-zinc-550 block font-mono">
                                Sector Entry: {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-[9.5px] bg-red-950/50 border border-red-900/20 text-[#ef4444] px-2 py-0.5 rounded uppercase font-bold">
                              {member.role}
                            </span>

                            {canManage && activeMemberRole === "Squad Owner" && (
                              <div className="flex gap-1.5">
                                <select
                                  value={member.role}
                                  onChange={(e) => handleRoleChange(activeSquad.id, member.ign, e.target.value as any)}
                                  className="bg-black border border-zinc-800 text-[9px] text-zinc-350 px-1.5 py-0.5 rounded cursor-pointer"
                                >
                                  <option value="Co-Owner">Co-Owner</option>
                                  <option value="Captain">Captain</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Member">Member</option>
                                  <option value="Recruit">Recruit</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleTransferOwnership(activeSquad.id, member.ign)}
                                  className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 border border-yellow-500/10 hover:bg-yellow-650 hover:text-white rounded text-[8px] font-bold uppercase transition-colors cursor-pointer"
                                >
                                  👑 Lead
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleLeaveSquad(activeSquad.id, member.ign)}
                                  className="p-1 bg-red-950 text-red-400 rounded hover:bg-red-900 hover:text-white transition-all cursor-pointer"
                                  title="Evict clearance registry"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
