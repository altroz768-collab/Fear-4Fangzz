import { Tournament, RecruitmentApplication, ScrimSession, FeedPost, MapStrategy, TerritoryRegion, StoreItem } from "./types";

export const INITIAL_TOURNAMENTS: Tournament[] = [];

export const INITIAL_RECRUITS: RecruitmentApplication[] = [];

export const INITIAL_SCRIMS: ScrimSession[] = [];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: "post_initial_1",
    author: "CV_Slayer_IGL",
    role: "Team Captain",
    avatarSeed: "slayer",
    content: "🎯 TEAM BRIEFING: Squad, please review our aggressive rotation waypoints and Pochinki Hills setup for the upcoming match. Ensure you practice this entry line in scrims today. Map details on Erangel: https://pubg.com/maps/erangel",
    likes: 12,
    comments: [
      { id: "c1", author: "CV_Mamba_Flick", role: "Team Captain", text: "Got it! Practiced the east ridge bridge hold yesterday.", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
    ],
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "post_initial_2",
    author: "CV_Tactical_Coach",
    role: "Admin",
    avatarSeed: "coach",
    content: "📸 CHAMPIONSHIP VENUE RECON: Check out the physical tournament stage layout, network latency monitors, and team setup specifications for the offline championship! Verify tournament specs: https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
    likes: 8,
    comments: [],
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: "post_initial_3",
    author: "CV_Vance_Scout",
    role: "Squad Leader",
    avatarSeed: "scout",
    content: "🛡️ DEFENSIVE PROTOCOL: We need a secure hold on Pecado Hills to intercept the western rotation pathing. Miramar strategic coordinate: https://pubg.com/maps/miramar",
    likes: 15,
    comments: [],
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const INITIAL_STRATEGY_MAPS: MapStrategy[] = [
  {
    id: "strat_1",
    title: "Erangel Military Base Bridge Blockade",
    game: "PUBG Mobile",
    mapName: "Erangel",
    imageUrl: "/src/assets/images/erangel_tactical_map_1781523653970.jpg",
    pins: [
      { x: 42, y: 78, type: "landing", label: "West Bridge Garrison", color: "#3b82f6" },
      { x: 50, y: 75, type: "rotation", label: "Ferry Pier Boat Grab", color: "#10b981" },
      { x: 58, y: 78, type: "danger", label: "East Bridge Camping Zone", color: "#ef4444" },
      { x: 48, y: 82, type: "ambush", label: "Novorepnoye Ridge Cover", color: "#f59e0b" }
    ],
    notes: "Hold the western bridge with 2 players while the remaining duo secures boats at Ferry Pier. Watch out for players gliding from Military Base or swimming through the channel.",
    author: "CV_Slayer_IGL"
  },
  {
    id: "strat_2",
    title: "Miramar Pecado Stadium Siege Plan",
    game: "PUBG Mobile",
    mapName: "Miramar",
    imageUrl: "/src/assets/images/miramar_tactical_map_1781523668860.jpg",
    pins: [
      { x: 49, y: 50, type: "landing", label: "Pecado Stadium Roof Drop", color: "#ef4444" },
      { x: 52, y: 53, type: "rotation", label: "Casino Flank Route", color: "#10b981" },
      { x: 45, y: 48, type: "danger", label: "Western Apartments Sniper Line", color: "#a855f7" },
      { x: 50, y: 46, type: "ambush", label: "L-Shape Trap Setup", color: "#f59e0b" }
    ],
    notes: "Pecado is extremely chaotic. Land instantly on the stadium roof. If contested, rotate immediately to the southern casino compound and establish a crossfire trap.",
    author: "CV_Tactical_Coach"
  },
  {
    id: "strat_3",
    title: "Sanhok Bootcamp Triple-Warehouse Rush",
    game: "PUBG Mobile",
    mapName: "Sanhok",
    imageUrl: "/src/assets/images/sanhok_tactical_map_1781523683529.jpg",
    pins: [
      { x: 50, y: 45, type: "landing", label: "Bootcamp Y-Building", color: "#ef4444" },
      { x: 53, y: 48, type: "rotation", label: "River Underpass Flank", color: "#10b981" },
      { x: 47, y: 42, type: "danger", label: "Northern Ridge Campers", color: "#ef4444" },
      { x: 52, y: 43, type: "ambush", label: "Bridge Gate Choke Ambush", color: "#f59e0b" }
    ],
    notes: "Drop on the main building, secure the shotgun/SMG spawns, then rotate towards the river to catch players rotating from Paradise Resort. High risk, maximum reward.",
    author: "CV_Shadow_Duo"
  },
  {
    id: "strat_4",
    title: "Vikendi Castle High-Ground Lock",
    game: "PUBG Mobile",
    mapName: "Vikendi",
    imageUrl: "/src/assets/images/vikendi_tactical_map_1781523699214.jpg",
    pins: [
      { x: 52, y: 53, type: "landing", label: "Castle Main Courtyard", color: "#3b82f6" },
      { x: 48, y: 55, type: "rotation", label: "Frozen River Crossway", color: "#10b981" },
      { x: 55, y: 49, type: "danger", label: "East Castle Tower Sniper", color: "#ef4444" },
      { x: 50, y: 58, type: "ambush", label: "Bridge Arch Hideout", color: "#f59e0b" }
    ],
    notes: "Castle is easily defendable. Secure the main towers first, then lock down the 3 bridge entrances. Use smoke cover to cross the frozen river if the zone moves away.",
    author: "CV_Mamba_Flick"
  },
  {
    id: "strat_5",
    title: "Livik Midstein Compound Control",
    game: "PUBG Mobile",
    mapName: "Livik",
    imageUrl: "/src/assets/images/livik_tactical_map_1781523715245.jpg",
    pins: [
      { x: 51, y: 52, type: "landing", label: "Midstein Central Plaza", color: "#ef4444" },
      { x: 54, y: 55, type: "rotation", label: "Gas Station Speed Exit", color: "#10b981" },
      { x: 48, y: 49, type: "danger", label: "North Church Highground", color: "#a855f7" }
    ],
    notes: "Hold Midstein to secure early kills. Be careful of the highground church tower, which gives an overview of the whole town. Rotate early to Power Plant to avoid gatekeepers.",
    author: "CV_Tactical_Coach"
  }
];

export const INITIAL_REGIONS: TerritoryRegion[] = [];

export const STORE_ITEMS: StoreItem[] = [
  { id: "item1", name: "CV Elite Performance Jersey v2", category: "Merch", cost: 1200, image: "👕", desc: "Authentic sub-printed competition jersey featuring red lightning mesh overlays." },
  { id: "item2", name: "Crimson Red Player Card Glow", category: "Visual", cost: 250, image: "✨", desc: "Unlock a custom pulsing neon Crimson border prefix for your public profile card." },
  { id: "item3", name: "Verified Legend Team Banner Slot", category: "Visual", cost: 450, image: "🏆", desc: "Featured team spotlight on the public home lobby countdown banner." },
  { id: "item4", name: "PUBG Mobile 660 UC Token Voucher", category: "Ingame", cost: 1000, image: "💵", desc: "Instantly redeemable game voucher for standard currency in PUBG Mobile." },
  { id: "item5", name: "Royale Pass Elite Upgrade Pack", category: "Ingame", cost: 1200, image: "👑", desc: "Redeemable upgrade key for the current PUBG Mobile Season Royale Pass." },
  { id: "item6", name: "M416 Glacier Skin Draw Raffle Ticket", category: "Ingame", cost: 500, image: "❄️", desc: "Redeemable ticket to join our seasonal PUBG Glacier weapon skin giveaway." }
];

export const PLAYERS_LIST = [
  {
    ign: "CV_Slayer_IGL",
    name: "Alex Thorne",
    role: "IGL / Mid-Ranger",
    avatar: "🎯",
    game: "PUBG Mobile",
    kd: "4.82",
    achievements: ["Championship MVP 2025", "Highest Classic Kills Record"],
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" },
    jerseyNumber: "07",
    bio: "The cornerstone of CV eSports. Alex is renowned across the region for his analytical rotation decisions, high-stress split-second calls, and maintaining flawless composure during chaotic final circles.",
    availabilityStatus: "Available",
    winStreak: 4
  },
  {
    ign: "CV_Mamba_Flick",
    name: "Marcus Sterling",
    role: "Sniper / Entry",
    avatar: "🐍",
    game: "PUBG Mobile",
    kd: "4.15",
    achievements: ["Elite Sniper Award 2026", "22 Kills Miramar Single Match"],
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" },
    jerseyNumber: "24",
    bio: "A venomous sniper with pixel-perfect target tracking. Marcus holds multiple regional records for long-range knocks and provides CV with unparalleled cover fire during aggressive entry pushes.",
    availabilityStatus: "Busy",
    winStreak: 1
  },
  {
    ign: "CV_Shadow_Duo",
    name: "Lia Ramirez",
    role: "Assaulter / Roamer",
    avatar: "⚡",
    game: "PUBG Mobile",
    kd: "5.10",
    achievements: ["Pro League Winner S3", "Territory conquer MVP"],
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" },
    jerseyNumber: "10",
    bio: "An incredibly agile assaulter whose flanking patterns baffle top-tier teams. Lia specializes in close-quarter room clearing and boasts the highest 1v3 clutch conversion rate on the active roster.",
    availabilityStatus: "Available",
    winStreak: 5
  },
  {
    ign: "CV_Alpha_Spectre",
    name: "Hiroshi Sato",
    role: "Anchor / Support",
    avatar: "🛡️",
    game: "PUBG Mobile",
    kd: "3.95",
    achievements: ["SMR King Trophy", "Flawless Scrim 15-0"],
    socials: { twitch: "https://twitch.tv", youtube: "https://youtube.com", twitter: "https://twitter.com" },
    jerseyNumber: "11",
    bio: "The ultimate defensive anchor. Hiroshi excels in resource management and tactical fortification, ensuring teammates have designated fallback cover and dynamic utility setups during critical rotations.",
    availabilityStatus: "Busy",
    winStreak: 3
  }
];

export const COACHES_LIST = [
  { ign: "CV_Tactical_Coach", role: "Head Strategic Coach", avatar: "🧠", details: "Veteran coach with 6+ years in PUBG Mobile competitive scene. Specialties: Edge rotates and timing analysis." },
  { ign: "CV_Dr_Data", role: "Roster Analyst", avatar: "📊", details: "Expert in statistics and Erangel radar matrices. Designs player progression graphs." }
];

export const CREATORS_LIST = [
  { ign: "CV_Valkyrie", role: "Roster Streamer / Content", avatar: "🎙️", details: "Active YouTube streamer producing premium classic guides. 200k subscribers." },
  { ign: "CV_ZapGamer", role: "Video Editor & Shorts Guru", avatar: "🎬", details: "Creates energetic TikTok clips and montages with epic weapon headshots." }
];

export const NEWS_ARTICLES = [];

export const CHAMPIONS_SHOWCASE = [];
