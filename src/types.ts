export type UserRole = 
  | "Owner" 
  | "Head Admin" 
  | "Admin" 
  | "Moderator" 
  | "Team Captain" 
  | "Verified Player" 
  | "Squad Leader" 
  | "Member" 
  | "Recruit"
  | "Visitor"
  | "Guest";

export interface UserSession {
  ign: string;
  role: UserRole;
  coins: number;
  battlePassXp: number;
  battlePassLevel: number;
  verified: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  type: "Solo" | "Duo" | "Squad";
  status: "Open" | "Closed" | "Live";
  game: "PUBG Mobile";
  prizePool: string;
  entryFee: string;
  prizeValueUSD?: number;
  teamsCount: number;
  maxTeams: number;
  countdownDate: string;
  schedule: string;
  matchesCount: number;
  rules: string[];
  registeredTeams: string[];
  mapDetails?: string;
  leaderboard?: {
    rank: number;
    teamName: string;
    matchesPlayed: number;
    kills: number;
    points: number;
  }[];
  brackets?: {
    round: string;
    matches: {
      teamA: string;
      teamB: string;
      scoreA?: number;
      scoreB?: number;
      winner?: string;
    }[];
  }[];
}

export interface RecruitmentApplication {
  id: string;
  ign: string;
  role?: string;
  game: string;
  rank: string;
  device: string;
  experience: string;
  availability: string;
  status: "Pending" | "Approved" | "Rejected";
  timestamp: string;
}

export interface ScrimSession {
  id: string;
  title: string;
  game: string;
  mapName: string;
  dateTime: string;
  maxSlots: number;
  registeredIGNs: string[];
  status: "Open" | "Completed";
}

export interface FeedPost {
  id: string;
  author: string;
  role: UserRole;
  avatarSeed: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: {
    id: string;
    author: string;
    role: UserRole;
    text: string;
    timestamp: string;
  }[];
  timestamp: string;
}

export interface MapStrategy {
  id: string;
  title: string;
  game: string;
  mapName: string;
  imageUrl: string;
  pins: {
    x: number;
    y: number;
    type: "landing" | "rotation" | "danger" | "ambush";
    label: string;
    color?: string;
  }[];
  notes: string;
  author: string;
}

export interface TerritoryRegion {
  id: string;
  name: string;
  ownerFaction: string;
  conqueredCount: number;
  combatRating: number;
  coordinates: { x: number; y: number };
  status: "Stable" | "Contested" | "War Zone";
}

export interface StoreItem {
  id: string;
  name: string;
  category: "Merch" | "Ingame" | "Visual" | "Hardware";
  cost: number;
  image: string;
  desc: string;
}

export interface MapPreset {
  id: string;
  mapId: string;
  presetName: string;
  createdAt: string;
  pins: {
    x: number;
    y: number;
    type: "landing" | "rotation" | "danger" | "ambush";
    label: string;
    color?: string;
  }[];
}

export interface ChatMsg {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  channel: "general" | "team";
}

// --- WORLD CHAT TYPES ---
export interface WorldChatMessage {
  id: string;
  channelId: string;
  senderIgn: string;
  senderRole: string;
  senderAvatar: string;
  senderVerified: boolean;
  senderLevel: number;
  senderReputation: number;
  text: string;
  timestamp: string;
  imageUrl?: string;
  gifUrl?: string;
  replyTo?: {
    id: string;
    sender: string;
    text: string;
  } | null;
  poll?: ChatPoll | null;
  reactions?: Record<string, string[]>; // emoji -> arrays of user IGNs
  pinned?: boolean;
  system?: boolean;
  isFlagged?: boolean;
}

export interface ChatPoll {
  question: string;
  options: {
    text: string;
    votes: string[]; // list of helper user IGNs
  }[];
}

export interface ChatFilterConfig {
  censorMild: boolean;
  blockSevere: boolean;
  mildWords: string[];
  severeWords: string[];
}

export interface ReputationState {
  ign: string;
  score: number;
  level: number;
  verified: boolean;
  warningsCount: number;
  muteExpiresAt?: string | null;
  suspensionExpiresAt?: string | null;
}

export interface ModLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: "Warning" | "Mute" | "Suspend" | "DeleteMessage" | "ClearChannel" | "Ban";
  targetUser: string;
  reason: string;
  durationMinutes?: number;
}

export interface ChatReport {
  id: string;
  messageId: string;
  messageText: string;
  reportedUser: string;
  reporter: string;
  reason: string;
  timestamp: string;
  resolved: boolean;
}



