export type ArenaMode = "1v1" | "2v2" | "4v4";

export type ArenaRegion = 
  | "Africa" 
  | "Europe" 
  | "Asia" 
  | "North America" 
  | "South America" 
  | "Oceania" 
  | "Middle East";

export interface RankingTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string; // Tailwind class
  glow: string; // glow style
}

export interface PlayerStats {
  points: number;
  wins: number;
  losses: number;
  draws: number;
  kills: number;
  mvps: number;
  currentStreak: number;
  longestStreak: number;
  fairPlayScore: number;
}

export interface PlayerProfile {
  ign: string;
  region: ArenaRegion;
  regionLocked: boolean;
  activeTitle: string;
  activeBanner: string;
  activeFrame: string;
  kills: number;
  headshotPct: number;
  favWeapon: string;
  favLoadout: string;
  avgMatchDuration: string;
  fairPlayScore: number;
  statsByMode: Record<ArenaMode, PlayerStats>;
}

export interface MatchHistoryItem {
  id: string;
  mode: ArenaMode;
  region: ArenaRegion;
  opponent: string;
  result: "WIN" | "LOSS" | "DRAW";
  pts: string;
  date: string;
  map: string;
  scoreBlue: number;
  scoreRed: number;
  duration?: string;
  loadout?: string;
}

export interface MatchVerificationData {
  matchId: string;
  mode: ArenaMode;
  region: ArenaRegion;
  map: string;
  weaponAgreement: string;
  blueScore: number;
  redScore: number;
  blueReport: "win" | "loss" | "draw" | "";
  redReport: "win" | "loss" | "draw" | "";
  evidenceUrl?: string;
  evidenceFileName?: string;
  aiConfidenceScore?: number;
  aiVerdict?: "VERIFIED" | "FLAGGED_MINOR_REVIEW" | "FLAGGED_STAFF_REVIEW" | "PENDING";
  aiNotes?: string;
  aiEngine?: string;
  status: "REGISTERED" | "ACTIVE" | "COMPLETED" | "CONFLICT" | "VERIFIED" | "STAFF_REVIEW";
  suspiciousFlags?: string[];
  auditLogs?: string[];
}
