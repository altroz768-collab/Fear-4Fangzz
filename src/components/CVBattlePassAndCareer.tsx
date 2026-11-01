import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Zap,
  Award,
  Coins,
  Shield,
  Search,
  Sparkles,
  Calendar,
  CheckCircle2,
  Lock,
  ChevronRight,
  User,
  Heart,
  MessageSquare,
  Compass,
  History,
  Crown,
  Eye,
  Flame,
  Star,
  Target,
  RefreshCw,
  Sliders,
  Check,
  UserPlus,
  Play,
  RotateCw,
  ChevronLeft
} from "lucide-react";

// Types
export interface CareerStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  kills: number;
  mvps: number;
  scrims: number;
  tournaments: number;
  arenaRank: string;
  arenaPoints: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardCoins: number;
  targetCount: number;
  currentCount: number;
  unlocked: boolean;
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly";
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export interface BPLevel {
  level: number;
  xpRequired: number;
  freeReward: {
    id: string;
    name: string;
    type: "coins" | "frame" | "title" | "banner" | "tag";
    value: string;
    preview: string;
  } | null;
  premiumReward: {
    id: string;
    name: string;
    type: "coins" | "frame" | "title" | "banner" | "tag" | "effect";
    value: string;
    preview: string;
  } | null;
}

interface CVBattlePassAndCareerProps {
  session: {
    ign: string;
    role: string;
    coins: number;
    battlePassXp: number;
    battlePassLevel: number;
    verified: boolean;
  };
  onUpdateSession: (updated: any) => void;
  showNotification: (msg: string) => void;
}

export default function CVBattlePassAndCareer({
  session,
  onUpdateSession,
  showNotification
}: CVBattlePassAndCareerProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<"pass" | "missions" | "profile" | "finder" | "shop">("pass");
  
  // Seasonal Toggling
  const [activeSeason, setActiveSeason] = useState<number>(1); // Season 1: Crimson Eclipse, 0: Founders Dawn, 2: Cybernetic Wasteland

  // Premium Battle Pass Status
  const [hasPremium, setHasPremium] = useState<boolean>(() => {
    return localStorage.getItem("cv_bp_premium") === "true";
  });

  // Level & XP State (Persistent)
  const [bpLevel, setBpLevel] = useState<number>(() => {
    const saved = localStorage.getItem("cv_bp_level");
    return saved ? parseInt(saved) : session.battlePassLevel;
  });
  const [bpXp, setBpXp] = useState<number>(() => {
    const saved = localStorage.getItem("cv_bp_xp");
    return saved ? parseInt(saved) : session.battlePassXp;
  });
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem("cv_coins");
    return saved ? parseInt(saved) : session.coins;
  });

  // Equipped Cosmetics
  const [equippedFrame, setEquippedFrame] = useState<string>(() => {
    return localStorage.getItem("cv_eq_frame") || "none";
  });
  const [equippedTitle, setEquippedTitle] = useState<string>(() => {
    return localStorage.getItem("cv_eq_title") || "Recruit";
  });
  const [equippedBanner, setEquippedBanner] = useState<string>(() => {
    return localStorage.getItem("cv_eq_banner") || "bg-zinc-900";
  });
  const [equippedEffect, setEquippedEffect] = useState<string>(() => {
    return localStorage.getItem("cv_eq_effect") || "none";
  });
  const [equippedTag, setEquippedTag] = useState<string>(() => {
    return localStorage.getItem("cv_eq_tag") || "";
  });

  // Owned/Unlocked cosmetics collection
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<string[]>(() => {
    const saved = localStorage.getItem("cv_unlocked_cosmetics");
    return saved ? JSON.parse(saved) : ["none", "Recruit", "bg-zinc-900"];
  });

  // Career Statistics
  const [stats, setStats] = useState<CareerStats>(() => {
    const saved = localStorage.getItem("cv_career_stats");
    return saved ? JSON.parse(saved) : {
      totalMatches: 84,
      wins: 48,
      losses: 32,
      draws: 4,
      kills: 312,
      mvps: 14,
      scrims: 25,
      tournaments: 6,
      arenaRank: "Gladiator Diamond",
      arenaPoints: 3450
    };
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("cv_achievements");
    if (saved) return JSON.parse(saved);
    return [
      { id: "ach_win_1", title: "First Victory", description: "Secure your first tournament or scrim match win", rewardXp: 200, rewardCoins: 100, targetCount: 1, currentCount: 1, unlocked: true, icon: "🥇" },
      { id: "ach_kill_100", title: "100 Kills", description: "Accumulate 100 total eliminations across platforms", rewardXp: 500, rewardCoins: 250, targetCount: 100, currentCount: 100, unlocked: true, icon: "🔥" },
      { id: "ach_tourney_champ", title: "Tournament Champion", description: "Reach 1st place in any official community tournament", rewardXp: 1200, rewardCoins: 600, targetCount: 1, currentCount: 0, unlocked: false, icon: "🏆" },
      { id: "ach_arena_champ", title: "Arena Champion", description: "Reach Arena Diamond division rank in TDM matches", rewardXp: 800, rewardCoins: 400, targetCount: 1, currentCount: 1, unlocked: true, icon: "⚔️" },
      { id: "ach_scrim_vet", title: "Scrim Veteran", description: "Participate in 20 competitive custom lobby scrims", rewardXp: 600, rewardCoins: 300, targetCount: 20, currentCount: 20, unlocked: true, icon: "🎯" },
      { id: "ach_mvp_coll", title: "MVP Collector", description: "Secure 15 official matches MVP titles", rewardXp: 1000, rewardCoins: 500, targetCount: 15, currentCount: 14, unlocked: false, icon: "🏅" },
      { id: "ach_regional", title: "Regional Champion", description: "Compete and represent in regional qualifiers", rewardXp: 1500, rewardCoins: 750, targetCount: 1, currentCount: 0, unlocked: false, icon: "🌍" },
      { id: "ach_cv_legend", title: "Fear Legend", description: "Reach level 20 in the seasonal Battle Pass", rewardXp: 2000, rewardCoins: 1000, targetCount: 20, currentCount: 3, unlocked: false, icon: "👑" }
    ];
  });

  // Daily, Weekly, Monthly Missions
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem("cv_missions");
    if (saved) return JSON.parse(saved);
    return [
      { id: "mis_daily_tdm", title: "Play 1 Arena TDM Match", type: "daily", targetCount: 1, currentCount: 0, rewardXp: 150, rewardCoins: 50, completed: false, claimed: false },
      { id: "mis_daily_scrim", title: "Join 1 Custom Lobby Scrim", type: "daily", targetCount: 1, currentCount: 1, rewardXp: 150, rewardCoins: 50, completed: true, claimed: false },
      { id: "mis_daily_chat", title: "Send 10 World Chat Messages", type: "daily", targetCount: 10, currentCount: 4, rewardXp: 100, rewardCoins: 30, completed: false, claimed: false },
      { id: "mis_daily_stream", title: "Watch 1 Broadcaster Stream (5m)", type: "daily", targetCount: 1, currentCount: 0, rewardXp: 100, rewardCoins: 30, completed: false, claimed: false },
      { id: "mis_daily_check", title: "Daily Calendar Web Check-in", type: "daily", targetCount: 1, currentCount: 1, rewardXp: 80, rewardCoins: 20, completed: true, claimed: true },
      
      { id: "mis_weekly_tdm_3", title: "Win 3 Arena TDM Matches", type: "weekly", targetCount: 3, currentCount: 1, rewardXp: 400, rewardCoins: 150, completed: false, claimed: false },
      { id: "mis_weekly_scrim_5", title: "Participate in 5 Scrims", type: "weekly", targetCount: 5, currentCount: 3, rewardXp: 500, rewardCoins: 200, completed: false, claimed: false },
      { id: "mis_weekly_recruit", title: "Apply to Community Team Roster", type: "weekly", targetCount: 1, currentCount: 0, rewardXp: 350, rewardCoins: 100, completed: false, claimed: false },
      { id: "mis_weekly_challenge", title: "Complete Community Survey/Vote", type: "weekly", targetCount: 1, currentCount: 1, rewardXp: 300, rewardCoins: 100, completed: true, claimed: false },
      
      { id: "mis_monthly_champ", title: "Win a Platform Tournament Cup", type: "monthly", targetCount: 1, currentCount: 0, rewardXp: 1200, rewardCoins: 500, completed: false, claimed: false },
      { id: "mis_monthly_kills", title: "Reach 100 In-Game Kills This Season", type: "monthly", targetCount: 100, currentCount: 45, rewardXp: 1000, rewardCoins: 400, completed: false, claimed: false }
    ];
  });

  // Daily check-in streak
  const [checkInDays, setCheckInDays] = useState<boolean[]>(() => {
    const saved = localStorage.getItem("cv_checkin_days");
    return saved ? JSON.parse(saved) : [true, false, false, false, false, false, false];
  });

  // Unlock animation modal trigger
  const [unlockModal, setUnlockModal] = useState<{
    show: boolean;
    rewardName: string;
    rewardType: string;
    rewardPreview: string;
  } | null>(null);

  // AI Team Finder state
  const [finderRank, setFinderRank] = useState<string>("Platinum");
  const [finderRegion, setFinderRegion] = useState<string>("Southern Africa");
  const [finderPlaystyle, setFinderPlaystyle] = useState<string>("Entry Fragger");
  const [finderAvailability, setFinderAvailability] = useState<string>("Evenings");
  const [finderExperience, setFinderExperience] = useState<string>("Semi-Pro");
  const [finderScanning, setFinderScanning] = useState<boolean>(false);
  const [finderStep, setFinderStep] = useState<string>("");
  const [recommendedTeams, setRecommendedTeams] = useState<any[] | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("cv_bp_premium", String(hasPremium));
    localStorage.setItem("cv_bp_level", String(bpLevel));
    localStorage.setItem("cv_bp_xp", String(bpXp));
    localStorage.setItem("cv_coins", String(coins));
    localStorage.setItem("cv_eq_frame", equippedFrame);
    localStorage.setItem("cv_eq_title", equippedTitle);
    localStorage.setItem("cv_eq_banner", equippedBanner);
    localStorage.setItem("cv_eq_effect", equippedEffect);
    localStorage.setItem("cv_eq_tag", equippedTag);
    localStorage.setItem("cv_unlocked_cosmetics", JSON.stringify(unlockedCosmetics));
    localStorage.setItem("cv_career_stats", JSON.stringify(stats));
    localStorage.setItem("cv_achievements", JSON.stringify(achievements));
    localStorage.setItem("cv_missions", JSON.stringify(missions));
    localStorage.setItem("cv_checkin_days", JSON.stringify(checkInDays));

    // Update parent state as well
    onUpdateSession({
      ...session,
      coins: coins,
      battlePassXp: bpXp,
      battlePassLevel: bpLevel
    });
  }, [hasPremium, bpLevel, bpXp, coins, equippedFrame, equippedTitle, equippedBanner, equippedEffect, equippedTag, unlockedCosmetics, stats, achievements, missions, checkInDays]);

  // BP levels definition
  const BATTLE_PASS_LEVELS: BPLevel[] = Array.from({ length: 20 }, (_, idx) => {
    const level = idx + 1;
    let freeReward: BPLevel["freeReward"] = null;
    let premiumReward: BPLevel["premiumReward"] = null;

    if (level === 2) {
      premiumReward = { id: "p_frame_neon", name: "Crimson Neon Spark Frame", type: "frame", value: "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse", preview: "🖼️" };
    } else if (level === 3) {
      freeReward = { id: "f_title_gladi", name: "TDM Gladiator Title", type: "title", value: "🏆 TDM Gladiator", preview: "🏷️" };
    } else if (level === 5) {
      freeReward = { id: "f_coins_200", name: "200 Fear Coins", type: "coins", value: "200", preview: "🪙" };
      premiumReward = { id: "p_tag_elite", name: "[ELITE] Chat Tag", type: "tag", value: "[ELITE]", preview: "💬" };
    } else if (level === 7) {
      premiumReward = { id: "p_banner_phoenix", name: "Fiery Phoenix Banner", type: "banner", value: "bg-gradient-to-r from-red-800 via-orange-600 to-yellow-500", preview: "🚩" };
    } else if (level === 10) {
      freeReward = { id: "f_tag_vet", name: "[VETERAN] Chat Tag", type: "tag", value: "[VETERAN]", preview: "💬" };
      premiumReward = { id: "p_effect_glow", name: "Crimson Pulse Name Effect", type: "effect", value: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] font-extrabold tracking-wide", preview: "✨" };
    } else if (level === 12) {
      premiumReward = { id: "p_title_assas", name: "Silent Assassin Title", type: "title", value: "👤 Silent Assassin", preview: "🏷️" };
    } else if (level === 15) {
      freeReward = { id: "f_coins_400", name: "400 Fear Coins", type: "coins", value: "400", preview: "🪙" };
      premiumReward = { id: "p_frame_champ", name: "Diamond Champion Crest", type: "frame", value: "border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] border-double border-4", preview: "🖼️" };
    } else if (level === 18) {
      premiumReward = { id: "p_banner_cyber", name: "Cyberpunk Grid Banner", type: "banner", value: "bg-gradient-to-r from-purple-900 via-violet-950 to-indigo-900 border border-purple-500/35", preview: "🚩" };
    } else if (level === 20) {
      freeReward = { id: "f_title_legend", name: "Fear Legend Title", type: "title", value: "👑 Fear Legend", preview: "🏷️" };
      premiumReward = { id: "p_effect_rainbow", name: "Cyber Rainbow Name Effect", type: "effect", value: "text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-[#00FF99] to-[#00E5FF] animate-pulse font-black tracking-widest", preview: "✨" };
    } else {
      // Filler coin levels
      if (level % 2 === 0) {
        freeReward = { id: `f_coins_${level}`, name: "100 Fear Coins", type: "coins", value: "100", preview: "🪙" };
      }
      premiumReward = { id: `p_coins_${level}`, name: "150 Fear Coins", type: "coins", value: "150", preview: "🪙" };
    }

    return {
      level,
      xpRequired: 1000,
      freeReward,
      premiumReward
    };
  });

  // Level Up logic helper
  const addXp = (amount: number) => {
    let newXp = bpXp + amount;
    let newLevel = bpLevel;
    let leveledUp = false;

    while (newXp >= 1000 && newLevel < 20) {
      newXp -= 1000;
      newLevel += 1;
      leveledUp = true;
      // Gain 300 level bounty coins
      setCoins(prev => prev + 300);
    }

    setBpXp(newXp);
    if (newLevel !== bpLevel) {
      setBpLevel(newLevel);
      showNotification(`🎉 BATTLE PASS LEVEL UP! Reached Tier ${newLevel}! +300 Fear Coins Added.`);
      
      // Update achievements bp level count
      setAchievements(prev => prev.map(ach => {
        if (ach.id === "ach_cv_legend") {
          const nextCount = Math.min(20, newLevel);
          return {
            ...ach,
            currentCount: nextCount,
            unlocked: nextCount >= 20
          };
        }
        return ach;
      }));
    } else {
      showNotification(`⚡ Earned +${amount} Battle Pass XP!`);
    }
  };

  // Claim Reward
  const claimReward = (reward: { id: string; name: string; type: string; value: string; preview: string }, isPremium: boolean) => {
    if (isPremium && !hasPremium) {
      showNotification("💎 Premium Battle Pass required to claim this tier reward!");
      return;
    }
    if (unlockedCosmetics.includes(reward.id)) {
      showNotification("✓ You have already claimed this seasonal reward!");
      return;
    }

    // Process Reward
    if (reward.type === "coins") {
      const valueInt = parseInt(reward.value);
      setCoins(prev => prev + valueInt);
    } else {
      setUnlockedCosmetics(prev => [...prev, reward.id]);
    }

    // Modal Trigger
    setUnlockModal({
      show: true,
      rewardName: reward.name,
      rewardType: reward.type,
      rewardPreview: reward.preview
    });

    showNotification(`🎁 Claimed Reward: ${reward.name}!`);
  };

  // Buy Premium Battle Pass
  const handleBuyPremium = () => {
    if (coins < 600) {
      showNotification("⚠️ Insufficient Fear Coins! You need 600 Fear Coins to purchase the Elite Battle Pass.");
      return;
    }
    setCoins(prev => prev - 600);
    setHasPremium(true);
    showNotification("💎 ELITE PREMIUM BATTLE PASS ACTIVATED! Unlock premium tiers instantly!");
  };

  // Check in Day Click
  const handleCheckInClick = (dayIdx: number) => {
    if (dayIdx !== checkInDays.filter(Boolean).length) {
      showNotification("⚠️ You must check-in sequentially day by day!");
      return;
    }
    if (checkInDays[dayIdx]) {
      showNotification("✓ Already claimed check-in reward for this day!");
      return;
    }

    const updated = [...checkInDays];
    updated[dayIdx] = true;
    setCheckInDays(updated);

    // Reward
    const xpReward = 100 + dayIdx * 25;
    const coinReward = 30 + dayIdx * 10;
    addXp(xpReward);
    setCoins(prev => prev + coinReward);
    showNotification(`📆 Daily Check-in Day ${dayIdx + 1} claimed! +${xpReward} XP & +${coinReward} Coins.`);
  };

  // Claim Mission Rewards
  const claimMission = (missionId: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId) {
          if (!m.completed) return m;
          if (m.claimed) return m;
          // Claim
          addXp(m.rewardXp);
          setCoins(c => c + m.rewardCoins);
          showNotification(`🎯 Challenge "${m.title}" rewarded: +${m.rewardXp} XP & +${m.rewardCoins} Fear Coins!`);
          return { ...m, claimed: true };
        }
        return m;
      })
    );
  };

  // Run AI Team Finder Analysis
  const runAiTeamFinder = () => {
    setFinderScanning(true);
    setRecommendedTeams(null);
    setFinderStep("Initiating Neural Core Analysis...");

    setTimeout(() => {
      setFinderStep(`Mapping competitive stats for: "${session.ign}" (Rank: ${finderRank})`);
      setTimeout(() => {
        setFinderStep(`Matching playstyle "${finderPlaystyle}" in "${finderRegion}"...`);
        setTimeout(() => {
          setFinderStep("Filtering team vacancy availability & minimum training schedule requirements...");
          setTimeout(() => {
            // Generate mock recommendations based on actual selections
            const options = [
              {
                teamName: "Chaos Victory Elite",
                score: 98,
                captain: "CV_Alpha_IGL",
                playstyleRequired: finderPlaystyle,
                region: finderRegion,
                desc: `Premier professional tier looking for a skilled ${finderPlaystyle} with immediate ${finderAvailability} availability. Matches your exact competitive footprint.`
              },
              {
                teamName: "Vanguard Harare Zenith",
                score: 87,
                captain: "VNG_Shox",
                playstyleRequired: "Entry/Support",
                region: finderRegion,
                desc: "Active league contender competing in regional cups. Looking to round out their core roster for upcoming season tournaments."
              },
              {
                teamName: "Apex Rebellion",
                score: 74,
                captain: "APX_Rage",
                playstyleRequired: "Support & Flanker",
                region: "Global Southern",
                desc: "An aggressive community squad focusing on high-level TDM matches and daily custom lobby scrims."
              }
            ];

            // Shuffle slightly or sort by score
            setRecommendedTeams(options);
            setFinderScanning(false);
            showNotification("🤖 AI match-making process complete! 3 vacancies identified.");
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  // Simulate XP Events (Matches)
  const handleSimulateMatch = (type: "tournament" | "scrim" | "tdm" | "mvp") => {
    let xpAwarded = 0;
    let coinsAwarded = 0;
    let matchText = "";

    // update career stats
    setStats(prev => {
      const wins = Math.random() > 0.4 ? prev.wins + 1 : prev.wins;
      const losses = wins === prev.wins ? prev.losses + 1 : prev.losses;
      const killsAdded = Math.floor(2 + Math.random() * 8);
      const isMvp = Math.random() > 0.8;

      return {
        ...prev,
        totalMatches: prev.totalMatches + 1,
        wins: wins,
        losses: losses,
        kills: prev.kills + killsAdded,
        mvps: isMvp ? prev.mvps + 1 : prev.mvps,
        scrims: type === "scrim" ? prev.scrims + 1 : prev.scrims,
        tournaments: type === "tournament" ? prev.tournaments + 1 : prev.tournaments,
        arenaPoints: type === "tdm" ? prev.arenaPoints + (wins > prev.wins ? 45 : -20) : prev.arenaPoints
      };
    });

    if (type === "tournament") {
      xpAwarded = 350;
      coinsAwarded = 150;
      matchText = "Simulated a Tournament Championship match!";
    } else if (type === "scrim") {
      xpAwarded = 200;
      coinsAwarded = 80;
      matchText = "Participated in a 16-Squad Lobby Scrim!";
    } else if (type === "tdm") {
      xpAwarded = 120;
      coinsAwarded = 40;
      matchText = "Played a tactical TDM Arena skirmish!";
    } else if (type === "mvp") {
      xpAwarded = 300;
      coinsAwarded = 100;
      matchText = "Awarded Official Match MVP Command Honor!";
    }

    addXp(xpAwarded);
    setCoins(prev => prev + coinsAwarded);
    showNotification(`🎮 ${matchText} Awarded +${xpAwarded} XP & +${coinsAwarded} Coins.`);

    // Progress active missions dynamically!
    setMissions(prev =>
      prev.map(m => {
        if (m.claimed) return m;
        let progress = m.currentCount;
        if (type === "tdm" && m.id === "mis_daily_tdm") {
          progress = Math.min(m.targetCount, progress + 1);
        }
        if (type === "tdm" && m.id === "mis_weekly_tdm_3") {
          progress = Math.min(m.targetCount, progress + 1);
        }
        if (type === "scrim" && m.id === "mis_daily_scrim") {
          progress = Math.min(m.targetCount, progress + 1);
        }
        if (type === "scrim" && m.id === "mis_weekly_scrim_5") {
          progress = Math.min(m.targetCount, progress + 1);
        }
        if (type === "tournament" && m.id === "mis_monthly_champ") {
          progress = Math.min(m.targetCount, progress + 1);
        }

        const isCompleted = progress >= m.targetCount;
        if (isCompleted && !m.completed) {
          showNotification(`🔔 CHALLENGE COMPLETED: "${m.title}"! Claim rewards in the Missions tab.`);
        }
        return {
          ...m,
          currentCount: progress,
          completed: isCompleted
        };
      })
    );

    // Update kill achievement
    setAchievements(prev => prev.map(ach => {
      if (ach.id === "ach_kill_100") {
        return {
          ...ach,
          currentCount: Math.min(100, stats.kills + 4),
          unlocked: stats.kills + 4 >= 100
        };
      }
      return ach;
    }));
  };

  // Cosmetics Shop items
  const SHOP_ITEMS = [
    { id: "shop_frame_cosmic", name: "Cosmic Portal Frame", type: "frame" as const, cost: 1200, preview: "🌌", value: "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] border-dotted border-4 animate-spin-slow" },
    { id: "shop_title_apex", name: "Apex Predator Title", type: "title" as const, cost: 800, preview: "🦅", value: "🦅 Apex Predator" },
    { id: "shop_banner_gold", name: "Golden Valor Crest Banner", type: "banner" as const, cost: 1000, preview: "👑", value: "bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-600 border-t border-yellow-300" },
    { id: "shop_effect_gold", name: "Golden Radiance Effect", type: "effect" as const, cost: 1500, preview: "✨", value: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] font-black" },
    { id: "shop_tag_mod", name: "[VIP CHAMPION] Tag", type: "tag" as const, cost: 900, preview: "🛡️", value: "[VIP CHAMPION]" }
  ];

  const handleBuyShopItem = (item: typeof SHOP_ITEMS[0]) => {
    if (coins < item.cost) {
      showNotification("⚠️ Insufficient Fear Coins! Earn more from completing daily missions or leveling up.");
      return;
    }
    if (unlockedCosmetics.includes(item.id)) {
      showNotification("✓ Already unlocked this shop cosmetic!");
      return;
    }

    setCoins(prev => prev - item.cost);
    setUnlockedCosmetics(prev => [...prev, item.id]);
    showNotification(`🛍️ Purchased "${item.name}"! Equip it anytime from your Profile screen.`);
  };

  // Equip item
  const handleEquipItem = (id: string, type: string, value: string) => {
    if (!unlockedCosmetics.includes(id) && id !== "none" && id !== "Recruit" && id !== "bg-zinc-900") {
      showNotification("🔒 You must unlock this item in the Battle Pass or Store before equipping it!");
      return;
    }

    if (type === "frame") {
      setEquippedFrame(value);
      showNotification("🖼️ Equipped profile avatar frame!");
    } else if (type === "title") {
      setEquippedTitle(value);
      showNotification("🏷️ Equipped competitive title!");
    } else if (type === "banner") {
      setEquippedBanner(value);
      showNotification("🚩 Equipped career display banner!");
    } else if (type === "effect") {
      setEquippedEffect(value);
      showNotification("✨ Equipped animated name glow effect!");
    } else if (type === "tag") {
      setEquippedTag(value);
      showNotification("💬 Equipped special chat cosmetic tag!");
    }
  };

  // Render proper seasonal theme classes
  const getSeasonThemeClasses = () => {
    switch (activeSeason) {
      case 0: // Season 0
        return {
          bg: "from-zinc-950 via-amber-950/25 to-zinc-950",
          border: "border-amber-500/20",
          textAccent: "text-amber-400",
          barColor: "bg-amber-500",
          badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          accentGlow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]"
        };
      case 2: // Season 2
        return {
          bg: "from-black via-emerald-950/20 to-black",
          border: "border-emerald-500/20",
          textAccent: "text-emerald-400",
          barColor: "bg-emerald-500",
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          accentGlow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        };
      case 1: // Season 1
      default:
        return {
          bg: "from-[#0d0909] via-red-950/20 to-black",
          border: "border-red-500/20",
          textAccent: "text-red-500",
          barColor: "bg-red-600",
          badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
          accentGlow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]"
        };
    }
  };

  const theme = getSeasonThemeClasses();

  return (
    <div id="cv-progression-ecosystem" className={`bg-gradient-to-b ${theme.bg} p-4 md:p-6 rounded-3xl border ${theme.border} space-y-6 text-zinc-100 ${theme.accentGlow} transition-colors duration-500`}>
      
      {/* HEADER CONTROLS & SEASON STATE SELECTOR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${theme.badgeBg}`}>
              Level Progression 2.0
            </span>
            <span className="text-zinc-600 font-mono text-[10px]">Active Season</span>
          </div>
          <h2 className="text-xl font-black font-mono tracking-tight text-white uppercase flex items-center gap-2">
            👑 FEAR ESPORTS PRO CAREER & BATTLE PASS
          </h2>
          <p className="text-xs text-zinc-400">
            Progress your eSports credentials, claim reward cosmetics, complete missions, and get matched with elite squads.
          </p>
        </div>

        {/* Seasonal Selector Toggle */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-800/80 w-full lg:w-auto">
          <button
            onClick={() => {
              setActiveSeason(0);
              showNotification("⏳ Switched context to Legacy Season 0: Founders Dawn!");
            }}
            className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
              activeSeason === 0 
                ? "bg-amber-950/50 text-amber-400 border border-amber-500/30" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            S0: Founders
          </button>
          <button
            onClick={() => {
              setActiveSeason(1);
              showNotification("🔥 Season 1: Crimson Eclipse active! Climb the ranks.");
            }}
            className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
              activeSeason === 1 
                ? "bg-red-950/50 text-red-400 border border-red-500/30" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            S1: Eclipse
          </button>
          <button
            onClick={() => {
              setActiveSeason(2);
              showNotification("🛰️ Season 2: Cyber Wasteland Preview loaded!");
            }}
            className={`flex-1 lg:flex-none px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
              activeSeason === 2 
                ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/30" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            S2: Preview
          </button>
        </div>
      </div>

      {/* METRICS ROW (XP, Level, Coins, Premium status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-black/40 p-4 rounded-2xl border border-zinc-800/40">
        <div className="flex items-center gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
          <div className={`p-2 rounded-lg bg-red-650/10 border border-red-500/20 text-red-500`}>
            <Trophy size={20} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">CURRENT LEVEL</span>
            <div className="flex items-baseline gap-1.5">
              <strong className="text-lg font-mono font-black text-white">{bpLevel}</strong>
              <span className="text-[10px] text-zinc-400 font-mono">/ 20</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span>XP PROGRESS</span>
            <span className="text-white font-bold">{bpXp} / 1000 XP</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className={`h-full ${theme.barColor} transition-all duration-500`} style={{ width: `${(bpXp / 1000) * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
          <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            <Coins size={20} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 font-mono uppercase block">FEAR BANK COINS</span>
            <strong className="text-lg font-mono font-black text-yellow-400">{coins} Coins</strong>
          </div>
        </div>

        <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${hasPremium ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}>
              <Crown size={20} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">PASS STATUS</span>
              <strong className={`text-xs font-mono font-black block ${hasPremium ? "text-purple-400 uppercase" : "text-zinc-400"}`}>
                {hasPremium ? "💎 PREMIUM ELITE" : "🆓 FREE PASS"}
              </strong>
            </div>
          </div>
          {!hasPremium && (
            <button
              onClick={handleBuyPremium}
              className="px-2.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 text-[9px] font-black uppercase rounded-lg border border-purple-400/35 hover:from-purple-600 hover:to-indigo-600 text-white transition-all scale-100 hover:scale-105"
            >
              Unlock Elite (600c)
            </button>
          )}
        </div>
      </div>

      {/* QUICK MATCH/XP SIMULATORS BLOCK (Forces progression) */}
      <div className="bg-gradient-to-r from-zinc-900/60 via-black/40 to-zinc-900/60 p-3 rounded-xl border border-zinc-850/50 text-left flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider block">🎮 XP INJECTOR CONTROLS</span>
          <p className="text-[10.5px] text-zinc-400">Simulate platform competitive events to earn instant XP bonuses, coins and progress pending tasks.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => handleSimulateMatch("tdm")}
            className="flex-1 md:flex-none px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold uppercase rounded-lg transition-all text-zinc-300"
          >
            ⚔️ Play TDM (+120xp)
          </button>
          <button
            onClick={() => handleSimulateMatch("scrim")}
            className="flex-1 md:flex-none px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold uppercase rounded-lg transition-all text-zinc-300"
          >
            🎯 Lobby Scrim (+200xp)
          </button>
          <button
            onClick={() => handleSimulateMatch("tournament")}
            className="flex-1 md:flex-none px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-[10px] font-mono font-bold uppercase rounded-lg transition-all text-red-400"
          >
            🏆 Tournament Match (+350xp)
          </button>
          <button
            onClick={() => handleSimulateMatch("mvp")}
            className="flex-1 md:flex-none px-3 py-1.5 bg-yellow-950/20 hover:bg-yellow-950/40 border border-yellow-900/40 text-[10px] font-mono font-bold uppercase rounded-lg transition-all text-yellow-400"
          >
            🏅 Win MVP (+300xp)
          </button>
        </div>
      </div>

      {/* CORE NAVIGATION DECK */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-800/50 pb-2">
        {(["pass", "missions", "profile", "shop", "finder"] as const).map((tab) => {
          let label = "";
          let icon = null;

          if (tab === "pass") {
            label = "BATTLE PASS TRACK";
            icon = <Award size={14} />;
          } else if (tab === "missions") {
            label = "CHALLENGES & MISSIONS";
            icon = <Target size={14} />;
          } else if (tab === "profile") {
            label = "MY esports PRO CARD";
            icon = <User size={14} />;
          } else if (tab === "shop") {
            label = "COSMETIC COIN SHOP";
            icon = <Coins size={14} />;
          } else if (tab === "finder") {
            label = "AI SQUAD TEAM FINDER";
            icon = <Search size={14} />;
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-[10.5px] font-mono font-black uppercase rounded-lg transition-all border ${
                activeTab === tab
                  ? `${theme.badgeBg} border-red-500/40`
                  : "bg-black/30 text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/40"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBVIEWS COMPARTMENTS */}
      <div className="mt-4">
        {/* TAB 1: BATTLE PASS REWARDS TRAIL */}
        {activeTab === "pass" && (
          <div className="space-y-6 text-left">
            
            {/* Header Promo Banner */}
            <div className={`p-4 rounded-2xl border ${theme.border} bg-zinc-950/80 flex flex-col md:flex-row items-center justify-between gap-4`}>
              <div className="space-y-1">
                <span className="text-[9px] text-red-500 font-bold uppercase font-mono block">🎯 CURRENT THEME: Crimson Eclipse</span>
                <h3 className="text-sm font-extrabold text-white uppercase font-mono">BATTLE PASS MILESTONES (TIER 1 - 20)</h3>
                <p className="text-xs text-zinc-400">Claims unlocked items. Premium track items are marked with 💎 and require elite activation.</p>
              </div>
              <div className="flex items-center gap-2 bg-black/50 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 font-mono">STREAK CHECKS:</span>
                <div className="flex gap-1">
                  {checkInDays.map((checked, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCheckInClick(idx)}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold font-mono transition-all ${
                        checked 
                          ? "bg-emerald-600 text-white" 
                          : idx === checkInDays.filter(Boolean).length 
                            ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse cursor-pointer" 
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                      title={`Day ${idx + 1} Check-in`}
                    >
                      {checked ? "✓" : idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Battle Pass track horizontal scroll list */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Rewards Track Milestones</span>
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {BATTLE_PASS_LEVELS.map((tier) => {
                  const isLocked = tier.level > bpLevel;
                  
                  return (
                    <div 
                      key={tier.level}
                      className={`min-w-[190px] w-[190px] rounded-2xl flex flex-col justify-between p-3.5 border transition-all relative ${
                        tier.level === bpLevel
                          ? "bg-red-950/20 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          : isLocked
                            ? "bg-zinc-950/80 border-zinc-900 opacity-60"
                            : "bg-[#111] border-zinc-800/50"
                      }`}
                    >
                      {/* Tier Tag */}
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                          tier.level === bpLevel ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400"
                        }`}>
                          TIER {tier.level}
                        </span>
                        {isLocked ? (
                          <Lock size={12} className="text-zinc-600" />
                        ) : (
                          <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase">✓ Unlocked</span>
                        )}
                      </div>

                      {/* Rewards Track Container */}
                      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                        {/* A. Free Reward Box */}
                        <div className="bg-black/40 p-2 rounded-xl border border-zinc-900 space-y-1 relative group">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-zinc-500 font-bold uppercase font-mono">FREE TRACK</span>
                            {tier.freeReward && unlockedCosmetics.includes(tier.freeReward.id) && (
                              <span className="text-[8px] text-emerald-500 font-bold">CLAIMED</span>
                            )}
                          </div>
                          {tier.freeReward ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{tier.freeReward.preview}</span>
                              <div className="text-left">
                                <h5 className="text-[9.5px] font-bold text-white truncate leading-tight w-[110px]">{tier.freeReward.name}</h5>
                                <span className="text-[8px] text-zinc-400 capitalize font-mono block">{tier.freeReward.type}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[9px] text-zinc-600 italic block">No Free Reward</span>
                          )}
                          {tier.freeReward && !isLocked && !unlockedCosmetics.includes(tier.freeReward.id) && (
                            <button
                              onClick={() => claimReward(tier.freeReward!, false)}
                              className="w-full mt-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white text-[8px] font-mono font-black uppercase rounded"
                            >
                              CLAIM FREE
                            </button>
                          )}
                        </div>

                        {/* B. Premium Reward Box */}
                        <div className="bg-purple-950/10 p-2 rounded-xl border border-purple-900/30 space-y-1 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-purple-400 font-bold uppercase font-mono">👑 ELITE TRACK</span>
                            {tier.premiumReward && unlockedCosmetics.includes(tier.premiumReward.id) && (
                              <span className="text-[8px] text-purple-400 font-bold">CLAIMED</span>
                            )}
                          </div>
                          {tier.premiumReward ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{tier.premiumReward.preview}</span>
                              <div className="text-left">
                                <h5 className="text-[9.5px] font-bold text-purple-200 truncate leading-tight w-[110px]">{tier.premiumReward.name}</h5>
                                <span className="text-[8px] text-purple-400 capitalize font-mono block">{tier.premiumReward.type}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[9px] text-purple-950 italic block">No Elite Reward</span>
                          )}
                          {tier.premiumReward && !isLocked && !unlockedCosmetics.includes(tier.premiumReward.id) && (
                            <button
                              onClick={() => claimReward(tier.premiumReward!, true)}
                              className={`w-full mt-2 py-1 text-[8px] font-mono font-black uppercase rounded ${
                                hasPremium 
                                  ? "bg-purple-600 hover:bg-purple-500 text-white cursor-pointer" 
                                  : "bg-purple-900/40 text-purple-400 border border-purple-800/40 cursor-not-allowed"
                              }`}
                            >
                              {hasPremium ? "CLAIM ELITE" : "🔒 ACTIVATE BP"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Reward Showcase Previews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
              <div className="space-y-1">
                <span className="text-lg">✨</span>
                <h4 className="text-xs font-bold text-white uppercase">Crimson Pulse Glow Effect</h4>
                <p className="text-[10px] text-zinc-400">Unlock at Tier 10 Premium. Gives your name tag a blazing crimson dynamic light effect in world chat profiles.</p>
              </div>
              <div className="space-y-1">
                <span className="text-lg">🖼️</span>
                <h4 className="text-xs font-bold text-purple-300 uppercase">Diamond Champion Crest Frame</h4>
                <p className="text-[10px] text-zinc-400">Unlock at Tier 15 Premium. An elite, dual border aesthetic frame to highlight your player avatar.</p>
              </div>
              <div className="space-y-1">
                <span className="text-lg">👑</span>
                <h4 className="text-xs font-bold text-yellow-400 uppercase">Fear Legend Title</h4>
                <p className="text-[10px] text-zinc-400">Unlock at Tier 20 Free. The ultimate prestige badge proving supreme active longevity on the competitive portal.</p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MISSIONS PANEL (DAILY/WEEKLY/MONTHLY) */}
        {activeTab === "missions" && (
          <div className="space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <h3 className="text-sm font-extrabold text-white uppercase font-mono">🎯 PLATFORM CHALLENGES DECK</h3>
              <span className="text-[10px] text-zinc-400 font-mono">Reset timer: 14h 42m</span>
            </div>

            {/* Filter by Challenge Span */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Daily Missions Column */}
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-black text-red-400 font-mono uppercase flex items-center gap-1.5">
                    <Calendar size={12} /> Daily Missions
                  </h4>
                  <span className="text-[9px] bg-red-950/30 text-red-400 px-1.5 py-0.5 rounded font-mono border border-red-900/30">
                    24H ROTATION
                  </span>
                </div>

                <div className="space-y-2">
                  {missions.filter(m => m.type === "daily").map(m => (
                    <div key={m.id} className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-900 space-y-2">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[10px] font-bold text-zinc-200 leading-tight w-[80%]">{m.title}</h5>
                        {m.claimed ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : m.completed ? (
                          <span className="text-[8px] bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-900/30 font-bold uppercase">Claimable</span>
                        ) : (
                          <span className="text-[8px] text-zinc-500 font-mono">IN PROGRESS</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-zinc-500 font-mono">{m.currentCount} / {m.targetCount}</span>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <span className="text-red-400 font-mono">+{m.rewardXp}xp</span>
                          <span>|</span>
                          <span className="text-yellow-400 font-mono">+{m.rewardCoins}c</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(m.currentCount / m.targetCount) * 100}%` }} />
                      </div>

                      {m.completed && !m.claimed && (
                        <button
                          onClick={() => claimMission(m.id)}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-mono font-black uppercase rounded-lg"
                        >
                          CLAIM REWARD
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Missions Column */}
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-black text-purple-400 font-mono uppercase flex items-center gap-1.5">
                    <Flame size={12} /> Weekly Challenges
                  </h4>
                  <span className="text-[9px] bg-purple-950/30 text-purple-400 px-1.5 py-0.5 rounded font-mono border border-purple-900/30">
                    7D SEASONAL
                  </span>
                </div>

                <div className="space-y-2">
                  {missions.filter(m => m.type === "weekly").map(m => (
                    <div key={m.id} className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-900 space-y-2">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[10px] font-bold text-zinc-200 leading-tight w-[80%]">{m.title}</h5>
                        {m.claimed ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : m.completed ? (
                          <span className="text-[8px] bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-900/30 font-bold uppercase">Claimable</span>
                        ) : (
                          <span className="text-[8px] text-zinc-500 font-mono">IN PROGRESS</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-zinc-500 font-mono">{m.currentCount} / {m.targetCount}</span>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <span className="text-purple-400 font-mono">+{m.rewardXp}xp</span>
                          <span>|</span>
                          <span className="text-yellow-400 font-mono">+{m.rewardCoins}c</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(m.currentCount / m.targetCount) * 100}%` }} />
                      </div>

                      {m.completed && !m.claimed && (
                        <button
                          onClick={() => claimMission(m.id)}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-mono font-black uppercase rounded-lg"
                        >
                          CLAIM REWARD
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly & Achievements Column */}
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h4 className="text-xs font-black text-yellow-400 font-mono uppercase flex items-center gap-1.5">
                    <Trophy size={12} /> Monthly Elite Targets
                  </h4>
                  <span className="text-[9px] bg-yellow-950/30 text-yellow-400 px-1.5 py-0.5 rounded font-mono border border-yellow-900/30">
                    SEASON-LONG
                  </span>
                </div>

                <div className="space-y-2">
                  {missions.filter(m => m.type === "monthly").map(m => (
                    <div key={m.id} className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-900 space-y-2">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[10px] font-bold text-zinc-200 leading-tight w-[80%]">{m.title}</h5>
                        {m.claimed ? (
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        ) : m.completed ? (
                          <span className="text-[8px] bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-900/30 font-bold uppercase">Claimable</span>
                        ) : (
                          <span className="text-[8px] text-zinc-500 font-mono">IN PROGRESS</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-zinc-500 font-mono">{m.currentCount} / {m.targetCount}</span>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <span className="text-yellow-400 font-mono">+{m.rewardXp}xp</span>
                          <span>|</span>
                          <span className="text-yellow-400 font-mono">+{m.rewardCoins}c</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${(m.currentCount / m.targetCount) * 100}%` }} />
                      </div>

                      {m.completed && !m.claimed && (
                        <button
                          onClick={() => claimMission(m.id)}
                          className="w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-mono font-black uppercase rounded-lg"
                        >
                          CLAIM REWARD
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: CAREER PROFILE CARD & STATS */}
        {activeTab === "profile" && (
          <div className="space-y-6 text-left">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Profile Card Column (4 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Esports Profile Identity Card</span>
                
                {/* Visual Card body */}
                <div className={`rounded-3xl overflow-hidden border border-zinc-850 bg-zinc-950 relative shadow-2xl`}>
                  
                  {/* Banner display */}
                  <div className={`h-24 ${equippedBanner} relative`}>
                    <div className="absolute inset-0 bg-black/40" />
                    <span className="absolute top-2 right-3 text-[8px] font-mono bg-black/70 px-2 py-0.5 rounded border border-zinc-850 text-zinc-400">
                      S1 COMPETITIVE CARD
                    </span>
                  </div>

                  {/* Profile content details */}
                  <div className="p-5 pt-0 relative">
                    
                    {/* Avatar placement with absolute positioning overlapping the banner */}
                    <div className="flex justify-between items-end -mt-10 mb-4">
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-full overflow-hidden bg-zinc-900 border-2 flex items-center justify-center relative ${equippedFrame}`}>
                          {/* PFP Icon representation */}
                          <span className="text-4xl">🐱</span>
                        </div>
                        {session.verified && (
                          <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#00FF9D] text-black text-[9px] font-black rounded-full flex items-center justify-center border border-zinc-950" title="Verified Pro Player">
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Region/Status Tags */}
                      <div className="text-right space-y-1">
                        <span className="text-[10.5px] bg-[#00FF9D]/10 text-[#00FF9D] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#00FF9D]/30 block text-center">
                          🔥 {equippedTitle}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono block">Region: Southern Africa</span>
                      </div>
                    </div>

                    {/* IGN / Role Text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-lg font-mono font-black tracking-tight ${equippedEffect}`}>
                          {session.ign}
                        </h4>
                        {equippedTag && (
                          <span className="text-[8.5px] bg-red-950/40 text-red-400 font-mono font-extrabold px-1.5 py-0.5 rounded border border-red-500/30">
                            {equippedTag}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                        <span>Role: <strong className="text-white">{session.role}</strong></span>
                        <span>•</span>
                        <span>BP Tier <strong className="text-red-400">{bpLevel}</strong></span>
                      </div>
                    </div>

                    {/* Custom Meta details (Squads / Teams) */}
                    <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block">Affiliated Squad</span>
                        <span className="text-white font-bold block truncate">🏆 Fear Elite Alpha</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block">Arena League Rank</span>
                        <span className="text-red-500 font-mono font-bold block truncate">⚔️ {stats.arenaRank}</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Cosmetic Equipper selectors */}
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3">
                  <h4 className="text-xs font-black text-white font-mono uppercase">🎒 CABINET OF UNLOCKED COSMETICS</h4>
                  
                  <div className="space-y-3 text-xs">
                    {/* Choose Equipped Frames */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Avatar Frames</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleEquipItem("none", "frame", "none")}
                          className={`px-2 py-1 rounded text-[10px] font-mono border ${
                            equippedFrame === "none" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                          }`}
                        >
                          Default Frame
                        </button>
                        {unlockedCosmetics.includes("p_frame_neon") && (
                          <button
                            onClick={() => handleEquipItem("p_frame_neon", "frame", "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedFrame.includes("border-red-500") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            ⚡ Neon Spark
                          </button>
                        )}
                        {unlockedCosmetics.includes("p_frame_champ") && (
                          <button
                            onClick={() => handleEquipItem("p_frame_champ", "frame", "border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] border-double border-4")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedFrame.includes("border-sky-400") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            💎 Champion Crest
                          </button>
                        )}
                        {unlockedCosmetics.includes("shop_frame_cosmic") && (
                          <button
                            onClick={() => handleEquipItem("shop_frame_cosmic", "frame", "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)] border-dotted border-4 animate-spin-slow")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedFrame.includes("border-purple-500") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            🌌 Cosmic Portal
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Choose Equipped Titles */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Honorary Player Titles</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleEquipItem("Recruit", "title", "Recruit")}
                          className={`px-2 py-1 rounded text-[10px] font-mono border ${
                            equippedTitle === "Recruit" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                          }`}
                        >
                          Recruit
                        </button>
                        {unlockedCosmetics.includes("f_title_gladi") && (
                          <button
                            onClick={() => handleEquipItem("f_title_gladi", "title", "🏆 TDM Gladiator")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedTitle === "🏆 TDM Gladiator" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            TDM Gladiator
                          </button>
                        )}
                        {unlockedCosmetics.includes("p_title_assas") && (
                          <button
                            onClick={() => handleEquipItem("p_title_assas", "title", "👤 Silent Assassin")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedTitle === "👤 Silent Assassin" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            Silent Assassin
                          </button>
                        )}
                        {unlockedCosmetics.includes("f_title_legend") && (
                          <button
                            onClick={() => handleEquipItem("f_title_legend", "title", "👑 Fear Legend")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedTitle === "👑 Fear Legend" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            Fear Legend
                          </button>
                        )}
                        {unlockedCosmetics.includes("shop_title_apex") && (
                          <button
                            onClick={() => handleEquipItem("shop_title_apex", "title", "🦅 Apex Predator")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedTitle === "🦅 Apex Predator" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            Apex Predator
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Choose Equipped Name Glow Effects */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Animated Name Glow Effect</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleEquipItem("none", "effect", "")}
                          className={`px-2 py-1 rounded text-[10px] font-mono border ${
                            equippedEffect === "" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                          }`}
                        >
                          None
                        </button>
                        {unlockedCosmetics.includes("p_effect_glow") && (
                          <button
                            onClick={() => handleEquipItem("p_effect_glow", "effect", "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] font-extrabold tracking-wide")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedEffect.includes("from-red-500") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            ✨ Crimson Pulse
                          </button>
                        )}
                        {unlockedCosmetics.includes("p_effect_rainbow") && (
                          <button
                            onClick={() => handleEquipItem("p_effect_rainbow", "effect", "text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] via-[#00FF99] to-[#00E5FF] animate-pulse font-black tracking-widest")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedEffect.includes("from-[#FF0055]") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            ⚡ Cyber Rainbow
                          </button>
                        )}
                        {unlockedCosmetics.includes("shop_effect_gold") && (
                          <button
                            onClick={() => handleEquipItem("shop_effect_gold", "effect", "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] font-black")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedEffect.includes("from-yellow-500") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            👑 Golden Radiance
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Choose Banner background */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-mono uppercase block">Profile Banner Background</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleEquipItem("bg-zinc-900", "banner", "bg-zinc-900")}
                          className={`px-2 py-1 rounded text-[10px] font-mono border ${
                            equippedBanner === "bg-zinc-900" ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                          }`}
                        >
                          Classic Slate
                        </button>
                        {unlockedCosmetics.includes("p_banner_phoenix") && (
                          <button
                            onClick={() => handleEquipItem("p_banner_phoenix", "banner", "bg-gradient-to-r from-red-800 via-orange-600 to-yellow-500")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedBanner.includes("from-red-800") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            🚩 Fiery Phoenix
                          </button>
                        )}
                        {unlockedCosmetics.includes("p_banner_cyber") && (
                          <button
                            onClick={() => handleEquipItem("p_banner_cyber", "banner", "bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-900 border border-purple-500/35")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedBanner.includes("from-purple-900") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            🌌 Cyber Grid
                          </button>
                        )}
                        {unlockedCosmetics.includes("shop_banner_gold") && (
                          <button
                            onClick={() => handleEquipItem("shop_banner_gold", "banner", "bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-600 border-t border-yellow-300")}
                            className={`px-2 py-1 rounded text-[10px] font-mono border ${
                              equippedBanner.includes("from-yellow-700") ? "bg-red-500/10 text-red-400 border-red-500/40" : "bg-zinc-900 border-transparent text-zinc-400"
                            }`}
                          >
                            🏆 Golden Valor
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Stats and Achievements Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Stats grid */}
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3">
                  <h4 className="text-xs font-black text-white font-mono uppercase border-b border-zinc-900 pb-2">
                    📊 LIFETIME COMPETITIVE STATISTICS
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-zinc-500 font-mono uppercase block">TOTAL MATCHES</span>
                      <strong className="text-base font-mono text-white block">{stats.totalMatches}</strong>
                    </div>
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-[#00FF9D] font-mono uppercase block">W / L RECORD</span>
                      <strong className="text-base font-mono text-[#00FF9D] block">{stats.wins} - {stats.losses}</strong>
                    </div>
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-zinc-500 font-mono uppercase block">TOTAL KILLS</span>
                      <strong className="text-base font-mono text-white block">{stats.kills}</strong>
                    </div>
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-red-500 font-mono uppercase block">MVP HONORS</span>
                      <strong className="text-base font-mono text-red-400 block">{stats.mvps}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-zinc-500 font-mono uppercase block">K/D RATIO</span>
                      <strong className="text-base font-mono text-zinc-300 block">
                        {stats.totalMatches > 0 ? (stats.kills / stats.totalMatches).toFixed(2) : "0.00"}
                      </strong>
                    </div>
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-zinc-500 font-mono uppercase block">WIN RATIO</span>
                      <strong className="text-base font-mono text-zinc-300 block">
                        {stats.totalMatches > 0 ? ((stats.wins / stats.totalMatches) * 100).toFixed(0) : "0"}%
                      </strong>
                    </div>
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-zinc-500 font-mono uppercase block">SCRIMS ATTENDED</span>
                      <strong className="text-base font-mono text-zinc-300 block">{stats.scrims}</strong>
                    </div>
                    <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 text-left">
                      <span className="text-[8.5px] text-zinc-500 font-mono uppercase block">TOURNAMENTS PLAYED</span>
                      <strong className="text-base font-mono text-zinc-300 block">{stats.tournaments}</strong>
                    </div>
                  </div>
                </div>

                {/* Achievements List */}
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3">
                  <h4 className="text-xs font-black text-white font-mono uppercase border-b border-zinc-900 pb-2">
                    🏅 COMPLETED CAREER ACHIEVEMENTS
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {achievements.map((ach) => (
                      <div 
                        key={ach.id} 
                        className={`p-2.5 rounded-xl border flex gap-2.5 items-center justify-between text-left ${
                          ach.unlocked 
                            ? "bg-zinc-950/80 border-zinc-800" 
                            : "bg-zinc-950/40 border-zinc-900 opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">{ach.icon}</span>
                          <div>
                            <h5 className="text-[10.5px] font-bold text-white leading-tight">{ach.title}</h5>
                            <p className="text-[9px] text-zinc-400 leading-snug w-[140px] truncate">{ach.description}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {ach.unlocked ? (
                            <span className="text-[8px] text-emerald-400 font-bold uppercase font-mono">✓ Unlocked</span>
                          ) : (
                            <span className="text-[8px] text-zinc-500 font-mono">
                              {ach.currentCount}/{ach.targetCount}
                            </span>
                          )}
                          <div className="text-[7.5px] text-zinc-500 font-mono mt-0.5">
                            +{ach.rewardCoins}c / +{ach.rewardXp}xp
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career History timeline */}
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-900 space-y-3 text-left">
                  <h4 className="text-xs font-black text-white font-mono uppercase border-b border-zinc-900 pb-2">
                    🏛️ PROFESSIONAL CAREER CHRONOLOGY
                  </h4>

                  <div className="space-y-3 pl-2 relative border-l border-zinc-800">
                    <div className="relative">
                      <span className="absolute -left-[12px] top-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                      <div className="text-xs">
                        <span className="text-[9px] text-red-500 font-mono block">JUNE 2026 (PRESENT)</span>
                        <h5 className="font-bold text-white">Joined Chaos Victory Elite Squad</h5>
                        <p className="text-[10px] text-zinc-400">Assumed support flanker positioning in regional PUBG Mobile tournament series.</p>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[12px] top-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <div className="text-xs">
                        <span className="text-[9px] text-zinc-500 font-mono block">APRIL 2026</span>
                        <h5 className="font-bold text-zinc-300">Registered on Fear 4Fangz platform</h5>
                        <p className="text-[10px] text-zinc-400">First registered gaming tag, connected Discord profiles, and began custom scrim duels.</p>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[12px] top-1.5 w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <div className="text-xs">
                        <span className="text-[9px] text-zinc-500 font-mono block">FEBRUARY 2026</span>
                        <h5 className="font-bold text-zinc-300">Championship Winner - TDM Arena Cup</h5>
                        <p className="text-[10px] text-zinc-400">Secured 1st place in the community 2v2 tactical duels with Zimbabwe Apex teammate.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: COSMETIC REWARDS SHOP */}
        {activeTab === "shop" && (
          <div className="space-y-6 text-left">
            <div className="p-4 rounded-2xl border border-zinc-800 bg-gradient-to-r from-yellow-950/20 via-black to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] text-yellow-400 font-mono uppercase font-bold tracking-widest block">💰 FEAR CUSTOM CABINET STORE</span>
                <h3 className="text-sm font-extrabold text-white uppercase font-mono">EXCLUSIVE COIN SHOP</h3>
                <p className="text-xs text-zinc-400">Spend hard-earned Fear Coins acquired through daily platform usage, tournaments, scrims or level tiers.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-black p-2.5 rounded-xl border border-zinc-800">
                <Coins size={14} className="text-yellow-400" />
                <span className="text-xs font-mono font-bold text-white">{coins} Coins Available</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHOP_ITEMS.map((item) => {
                const isBought = unlockedCosmetics.includes(item.id);
                return (
                  <div key={item.id} className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-900 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded font-mono font-bold uppercase">
                          {item.type}
                        </span>
                        <span className="text-2xl bg-zinc-900 p-2 rounded-xl border border-zinc-850">{item.preview}</span>
                      </div>
                      <h4 className="text-sm font-black text-white">{item.name}</h4>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        {item.type === "frame" && "Equip this decorative avatar border so everyone in comments sees your pro prestige status."}
                        {item.type === "title" && "Showcase this exclusive competitive title underneath your IGN in custom profiles."}
                        {item.type === "banner" && "Transform your career card with this premium high-contrast background gradient design."}
                        {item.type === "effect" && "Ignite your chat logs with beautiful animated color text overlays and light glow effects."}
                        {item.type === "tag" && "Adds a prestigious VIP prefix in custom global matchmaking lounges."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-yellow-500 flex items-center gap-1">
                        <Coins size={12} />
                        {item.cost} COINS
                      </span>
                      
                      <button
                        disabled={isBought}
                        onClick={() => handleBuyShopItem(item)}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold transition-all ${
                          isBought
                            ? "bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed"
                            : "bg-yellow-650 hover:bg-yellow-600 text-black cursor-pointer hover:scale-105 active:scale-95"
                        }`}
                      >
                        {isBought ? "✓ UNLOCKED" : "SPEND COINS"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: AI TEAM SQUAD FINDER */}
        {activeTab === "finder" && (
          <div className="space-y-6 text-left">
            <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-850 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] text-[#00FF9D] font-mono font-bold uppercase tracking-widest block">🤖 NEURAL SQUAD RECRUITMENT</span>
                <h3 className="text-sm font-extrabold text-white uppercase font-mono">Fear 4Fangz AI Team Finder</h3>
                <p className="text-xs text-zinc-400">
                  Our advanced matchmaking engine cross-analyzes your player rank, region, active schedule availability and tactical playstyle to pinpoint active vacancies.
                </p>
              </div>

              {/* Input Criteria selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Playstyle</label>
                  <select
                    value={finderPlaystyle}
                    onChange={(e) => setFinderPlaystyle(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-[#00FF9D]"
                  >
                    <option value="Entry Fragger">Entry Fragger</option>
                    <option value="In-Game Leader (IGL)">In-Game Leader (IGL)</option>
                    <option value="Sniper Support">Sniper Support</option>
                    <option value="Squad Flanker">Squad Flanker</option>
                    <option value="Strategic Coach">Strategic Coach</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Active Rank</label>
                  <select
                    value={finderRank}
                    onChange={(e) => setFinderRank(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-[#00FF9D]"
                  >
                    <option value="Silver V">Silver V</option>
                    <option value="Gold III">Gold III</option>
                    <option value="Platinum I">Platinum I</option>
                    <option value="Diamond Division">Diamond Division</option>
                    <option value="Fear Master Tier">Fear Master Tier</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Region Zone</label>
                  <select
                    value={finderRegion}
                    onChange={(e) => setFinderRegion(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-[#00FF9D]"
                  >
                    <option value="Southern Africa">Southern Africa</option>
                    <option value="Zimbabwe Core">Zimbabwe Core</option>
                    <option value="Europe Qualifier">Europe Qualifier</option>
                    <option value="North America Central">North America Central</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Availability</label>
                  <select
                    value={finderAvailability}
                    onChange={(e) => setFinderAvailability(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-[#00FF9D]"
                  >
                    <option value="Evenings">Evenings (6PM - 10PM)</option>
                    <option value="Weekends Only">Weekends Only</option>
                    <option value="Full-Time Competitive">Full-Time Competitive</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase block">Experience level</label>
                  <select
                    value={finderExperience}
                    onChange={(e) => setFinderExperience(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-[#00FF9D]"
                  >
                    <option value="Casual Gamer">Casual Gamer</option>
                    <option value="Semi-Pro Scrimmer">Semi-Pro Scrimmer</option>
                    <option value="Tournament Veteran">Tournament Veteran</option>
                  </select>
                </div>
              </div>

              {/* Scan Trigger Button */}
              <div className="flex justify-end pt-2 border-t border-zinc-900">
                <button
                  disabled={finderScanning}
                  onClick={runAiTeamFinder}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-[#00FF9D] text-black text-xs font-black uppercase rounded-lg font-mono transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  {finderScanning ? <RotateCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  <span>{finderScanning ? "AI SCANNING..." : "RUN NEURAL VACANCY ANALYSIS"}</span>
                </button>
              </div>
            </div>

            {/* Scanning Overlay State */}
            {finderScanning && (
              <div className="bg-black/80 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
                <div className="relative w-12 h-12 mx-auto">
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin" />
                </div>
                <h4 className="text-xs font-bold font-mono text-[#00FF9D] animate-pulse">
                  {finderStep}
                </h4>
                <div className="max-w-md mx-auto h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF9D] animate-ping" />
                </div>
              </div>
            )}

            {/* Results Grid display */}
            {recommendedTeams && !finderScanning && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-zinc-500 font-mono uppercase">
                  ✓ IDENTIFIED VACANCIES BASED ON PROFILES METRICS
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedTeams.map((team, idx) => (
                    <div key={idx} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col justify-between gap-4 relative">
                      <div className="absolute top-3 right-3 text-emerald-400 font-mono text-sm font-black">
                        {team.score}% MATCH
                      </div>

                      <div className="space-y-2">
                        <span className="text-[8px] bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 px-2 py-0.5 rounded font-mono font-bold block w-fit">
                          {team.region}
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase font-mono">{team.teamName}</h4>
                        <p className="text-[11.5px] text-zinc-400 leading-relaxed">{team.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                          <span>Team Owner: <strong className="text-zinc-300">{team.captain}</strong></span>
                        </div>
                        <button
                          onClick={() => {
                            showNotification(`📧 Sent immediate application ping to team "${team.teamName}"! Checked by AI.`);
                          }}
                          className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-[10.5px] font-mono font-black uppercase rounded-lg transition-colors"
                        >
                          Send Join Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* POPUP REWARD UNLOCK ANIMATION MODAL */}
      <AnimatePresence>
        {unlockModal && unlockModal.show && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-6 rounded-3xl border border-yellow-500/40 max-w-sm w-full text-center space-y-4 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-yellow-500 font-black tracking-widest font-mono uppercase block">🎉 SEASON UNLOCKED</span>
                <h3 className="text-base font-black text-white font-mono uppercase">REWARD CLAIMED!</h3>
              </div>

              {/* Large graphic */}
              <div className="relative w-32 h-32 mx-auto bg-black rounded-2xl border border-zinc-850 flex items-center justify-center text-5xl">
                <div className="absolute inset-0 rounded-2xl bg-yellow-500/5 animate-pulse" />
                <span>{unlockModal.rewardPreview}</span>
              </div>

              <div className="space-y-1">
                <strong className="text-sm text-yellow-400 block font-mono font-black uppercase">
                  {unlockModal.rewardName}
                </strong>
                <span className="text-[11px] text-zinc-400 font-mono capitalize">
                  Type: {unlockModal.rewardType}
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setUnlockModal(null)}
                  className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-mono font-black uppercase rounded-xl transition-all"
                >
                  ✓ PROCEED & EQUIP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
