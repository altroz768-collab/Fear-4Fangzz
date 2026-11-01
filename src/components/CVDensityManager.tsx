import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy, Flame, Users, Layers, ShieldCheck, Gamepad2, Compass, Award,
  Sparkles, Calendar, BookOpen, Clock, Play, Map, User, HelpCircle,
  TrendingUp, CircleDot, Zap, CheckCircle, BarChart2, Star, Send, Shield,
  Activity, Users2, Mail, ExternalLink, RefreshCw, Bell, AlertTriangle,
  Volume2, Video, Eye, ThumbsUp, ChevronRight, CheckSquare, MessageSquare,
  Lock, BookOpenCheck, Sliders, DollarSign, Download, CloudRain
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// --- GLOBAL CHAT PREVIEW MOCK DATA ---
const GLOBAL_CHAT_MESSAGES = [
  { id: "1", user: "CV_Slayer_IGL", text: "Scrim room is open, pass is: vipers66!", time: "2m ago" },
  { id: "2", user: "Snip3rElite", text: "Look at my squad stats comparison! 94% win rate is crazy.", time: "4m ago" },
  { id: "3", user: "Mamba_Flick", text: "Anyone ready for casual TDM duels?", time: "6m ago" }
];

// --- 1. HOME PAGE DENSITY ACTIONS & SPOTLIGHTS ---
export function HomePageDensity({ setActiveTab, onAlert }: { setActiveTab: (tab: string) => void; onAlert?: (msg: string) => void }) {
  const [countdown, setCountdown] = useState("04h 32m 11s");
  
  useEffect(() => {
    const timer = setInterval(() => {
      const h = Math.floor(Math.random() * 24).toString().padStart(2, "0");
      const m = Math.floor(Math.random() * 60).toString().padStart(2, "0");
      const s = Math.floor(Math.random() * 60).toString().padStart(2, "0");
      setCountdown(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 pt-4">
      {/* Dynamic Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Tournament Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 p-5 bg-gradient-to-br from-red-950/40 via-black to-zinc-950 text-left">
          <div className="absolute top-2 right-2 bg-red-650 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded tracking-widest animate-pulse">FEATURED TOURNAMENT</div>
          <span className="text-[10px] text-red-400 font-mono font-bold block">🏆 PREMIUM CHAMPIONS LEAGUE</span>
          <h4 className="text-sm font-black text-white uppercase font-sans mt-1">Zimbabwe Esports Cup: Season 5</h4>
          <p className="text-[11px] text-zinc-400 font-sans mt-2">Prize Pool: <strong className="text-white">$10,000 USD</strong>. Registration ends soon.</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              <Clock size={11} /> Ends in: {countdown}
            </span>
            <button
              onClick={() => {
                setActiveTab("tournaments");
                if (onAlert) onAlert("🏆 Opening Premier tournament registry details!");
              }}
              className="px-3 py-1.5 bg-red-650 hover:bg-red-700 font-bold text-white text-[10px] font-mono rounded uppercase transition-transform hover:scale-105 cursor-pointer"
            >
              Verify Slot & Register
            </button>
          </div>
        </div>

        {/* Featured Scrim Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 p-5 bg-gradient-to-br from-emerald-950/40 via-black to-zinc-950 text-left">
          <div className="absolute top-2 right-2 bg-emerald-650 text-black font-mono text-[8px] font-black px-2 py-0.5 rounded tracking-widest">LIVE PRACTICE ROOM</div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold block">🎯 TIER 1 SQUAD PRACTICE</span>
          <h4 className="text-sm font-black text-white uppercase font-sans mt-1">Harare Elite Scrims Matchmaker</h4>
          <p className="text-[11px] text-zinc-400 font-sans mt-2">Active slots: <strong className="text-white">14/16 Squads Registered</strong>.</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono">Status: Check-In Active</span>
            <button
              onClick={() => {
                setActiveTab("scrims");
                if (onAlert) onAlert("🎯 Fetching active open scrimmage registers.");
              }}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 font-bold text-black text-[10px] font-mono rounded uppercase transition-transform hover:scale-105 cursor-pointer"
            >
              Secure Lobby Pass
            </button>
          </div>
        </div>
      </div>

      {/* Feature expansions block 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Match Center, Hall of Fame & Highlight (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Live Match Center */}
          <div className="bg-zinc-950/90 border border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
              <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
                <Play size={12} className="text-red-550 animate-ping" />
                Live matches scoreboard (Auto-updated)
              </h4>
              <span className="px-2 py-0.5 bg-red-950 border border-red-900 text-red-400 text-[8px] font-mono rounded">PMGC PRESET LOBBY</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-black/60 p-3.5 border border-zinc-900 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block">MAP #3: ERANGEL (ZONE 4 ACTIVE)</span>
                  <strong className="text-white">CV Battle Royale Grand Slam Finals</strong>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-300">
                  <div className="text-center bg-zinc-900 px-2.5 py-1 rounded">
                    <span className="text-[9px] text-red-500 block animate-pulse">● LIVE</span>
                    <span>18 Alive / 6 Teams</span>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab("media");
                      if (onAlert) onAlert("📺 Linking official verified Twitch caster layout...");
                    }} 
                    className="p-1 px-2.5 bg-red-650 hover:bg-red-700 text-white rounded text-[10px] uppercase font-mono cursor-pointer"
                  >
                    View stream
                  </button>
                </div>
              </div>

              <div className="bg-black/60 p-3.5 border border-zinc-900 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 block">MAP #4: MIRAMAR STATUS (DUE IN 10 MINS)</span>
                  <strong className="text-white">Zimbabwe Regional Duel Playoff</strong>
                </div>
                <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-1 rounded">MATCHMAKING STANDBY</span>
              </div>
            </div>
          </div>

          {/* Hall of Fame & Spotlight */}
          <div className="bg-zinc-950/90 border border-zinc-900 p-5 rounded-2xl text-left space-y-4">
            <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
              <Award size={14} className="text-yellow-500" />
              CV HALL OF FAMERS & MVP RACE
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-gradient-to-br from-yellow-950/20 to-black rounded-xl border border-yellow-905/30">
                <span className="text-[9px] text-yellow-500 font-bold block mb-1">👑 MONTHLY OVERALL CHAMPION</span>
                <strong className="text-white text-xs block">CV_Mamba_Flick</strong>
                <p className="text-[10px] text-zinc-500 font-sans mt-1">Lobby Points: 15,240 • Winchester master</p>
              </div>

              <div className="p-3 bg-gradient-to-br from-red-950/20 to-black rounded-xl border border-red-955/30">
                <span className="text-[9px] text-red-400 font-bold block mb-1">🔥 WEEKLY MVP ACCUMULATOR</span>
                <strong className="text-white text-xs block">ZIM_Tinashe</strong>
                <p className="text-[10px] text-zinc-500 font-sans mt-1">Accuracy index: 94.2% • 18 clutch rescues</p>
              </div>

              <div className="p-3 bg-gradient-to-br from-blue-950/20 to-black rounded-xl border border-blue-955/30">
                <span className="text-[9px] text-blue-400 font-bold block mb-1">🎯 SHARPSHOT TDM LEADER</span>
                <strong className="text-white text-xs block">CV_Hunter_IGL</strong>
                <p className="text-[10px] text-zinc-500 font-sans mt-1">M24 duel winstreak: +11 straight wins</p>
              </div>
            </div>
          </div>

          {/* Spotlights grid (TDM Arena, Recruitment, Community Team) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-left">
              <span className="text-[9px] text-amber-500 font-mono block">⚔️ TDM ARENA SPOTLIGHT</span>
              <h5 className="text-xs font-black text-white uppercase mt-0.5">Arena Duel Room #4</h5>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">Fast matchmaking. 1v1 M416 duels active continuously.</p>
              <button onClick={() => setActiveTab("tdmArena")} className="text-[9px] text-red-500 hover:underline font-mono mt-2 block">Fight Arena Now →</button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-left">
              <span className="text-[9px] text-emerald-400 font-mono block">👥 SQUAD CONSTR INDEX</span>
              <h5 className="text-xs font-black text-white uppercase mt-0.5">Alpha Recruits Portal</h5>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">Active recruitment postings by regional squad captains.</p>
              <button onClick={() => setActiveTab("recruitment")} className="text-[9px] text-[#10b981] hover:underline font-mono mt-2 block">Apply to Roster →</button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-left">
              <span className="text-[9px] text-blue-400 font-mono block">🏆 TOURNAMENTS PREVIEW</span>
              <h5 className="text-xs font-black text-white uppercase mt-0.5">PMGC Winter Slam</h5>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">$500 Entry Prize Pool matches pending approval.</p>
              <button onClick={() => setActiveTab("tournaments")} className="text-[9px] text-blue-400 hover:underline font-mono mt-2 block">Browse Brackets →</button>
            </div>
          </div>

        </div>

        {/* Home Right Sidebar Widgets (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Access Portal buttons */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-left space-y-3">
            <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">🚀 INSTANT SHORTCUT DASHBOARD</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button onClick={() => setActiveTab("clanchat")} className="p-2.5 bg-black hover:bg-zinc-900 rounded-lg text-white border border-zinc-850 truncate text-left">💬 My Clan Chat</button>
              <button onClick={() => setActiveTab("strategy")} className="p-2.5 bg-black hover:bg-zinc-900 rounded-lg text-white border border-zinc-850 truncate text-left">🗺️ Coach strategy</button>
              <button onClick={() => setActiveTab("rewards")} className="p-2.5 bg-black hover:bg-zinc-900 rounded-lg text-white border border-zinc-850 truncate text-left">🪙 Coins Shop</button>
              <button onClick={() => setActiveTab("worldChat")} className="p-2.5 bg-black hover:bg-zinc-900 rounded-lg text-white border border-zinc-850 truncate text-left">🌐 World Chat</button>
            </div>
          </div>

          {/* Global Chat Preview */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">🌐 GLOBAL CHAT PREVIEW</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {GLOBAL_CHAT_MESSAGES.map((msg) => (
                <div key={msg.id} className="bg-black/50 p-2 border border-zinc-900 rounded-lg font-mono text-[10.5px] leading-tight space-y-0.5">
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <strong className="text-stone-300 font-black">{msg.user}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-zinc-400">{msg.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("worldChat")}
              className="w-full py-1.5 bg-zinc-904 border border-zinc-800 text-[10px] text-zinc-300 font-mono text-center block rounded-md hover:text-white"
            >
              Open Live chat room interlink
            </button>
          </div>

          {/* Sponsor Showcase & Community Stats */}
          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-900 text-left space-y-3 text-xs">
            <span className="text-[9.5px] font-mono text-zinc-500 block uppercase font-bold">📢 SPONSOR OVERVIEW & PLATFORM RATIO</span>
            
            <div className="grid grid-cols-2 gap-2 text-center text-zinc-400 bg-black/40 p-2.5 rounded-xl border border-zinc-900 font-mono">
              <div>
                <span className="text-[17px] text-white font-black block">2.4k+</span>
                <span className="text-[8px] text-zinc-500 block uppercase">Active Players</span>
              </div>
              <div>
                <span className="text-[17px] text-white font-black block">440+</span>
                <span className="text-[8px] text-zinc-500 block uppercase">Scrim Room codes</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 font-sans italic text-center">
              Partnered with CV VERIFIED Esports Program and Harare High-Precision Servers.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- 2. USER DASHBOARD EXPANDED DENSITY ---
export function UserDashboardDensity({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-6 pt-4 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Statistics and Matches (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest flex items-center gap-1.5 font-orbitron">
              <TrendingUp size={14} className="text-red-500" />
              My Career Detailed Statistics (Vitals)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">MATCHES PLAYED</span>
                <strong className="text-white text-base font-black">188</strong>
                <span className="text-[9px] text-emerald-400 block mt-0.5">+4 vs last week</span>
              </div>
              <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">REPUTATION POINTS</span>
                <strong className="text-white text-base font-black">4,820</strong>
                <span className="text-[9px] text-[#10b981] block mt-0.5">Top 5% in Region</span>
              </div>
              <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">K/D SYSTEM RATIO</span>
                <strong className="text-white text-base font-black">3.84</strong>
                <span className="text-[9px] text-red-500 block mt-0.5">Aggressive role</span>
              </div>
              <div className="bg-black/60 p-3 border border-zinc-900 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">SCRIM ATTENDANCE</span>
                <strong className="text-white text-base font-black">98.6%</strong>
                <span className="text-[9px] text-emerald-400 block mt-0.5">Complying ✓</span>
              </div>
            </div>
          </div>

          {/* Pending Active Registrations & Tournament Schedules */}
          <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
            <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest">📋 MY ACTIVE STAT LISTS & MATCH HISTORY</h4>
            
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-black/60 rounded-xl border border-zinc-900 flex justify-between items-center">
                <div>
                  <strong className="text-white block">[06/20] CV Battle Royale Season 5</strong>
                  <span className="text-[10px] text-zinc-500">Roster Locked • Team Captain Checkin standard</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/20 px-2.5 py-0.5 rounded font-black uppercase">REGISTERED</span>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-zinc-900 flex justify-between items-center">
                <div>
                  <strong className="text-white block">[Yesterday] Harare TDM Duel Room 10</strong>
                  <span className="text-[10px] text-zinc-500">Won against Snip3rElite (15-12 kills)</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-black px-2.5 py-0.5 rounded font-bold">WIN ✓</span>
              </div>
            </div>
          </div>

        </div>

        {/* Daily Challenges (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1">
              <Zap size={14} className="text-yellow-500" />
              DAILY EXP MISSIONS
            </h4>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span>🎯 Earn 3 TDM arena duel wins</span>
                  <strong className="text-yellow-500">2/3 Done</strong>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-1.5 rounded-full w-[66%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-zinc-300">
                  <span>💬 Write 2 World Chat posts</span>
                  <strong className="text-emerald-400">Claims Ready!</strong>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden animate-pulse">
                  <div className="bg-[#10b981] h-1.5 rounded-full w-full" />
                </div>
              </div>
              
              <div className="space-y-1 opacity-60">
                <div className="flex justify-between text-zinc-400">
                  <span>📂 Share 1 coach map layout</span>
                  <strong>0/1</strong>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-zinc-800 h-1.5 rounded-full w-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- 3. TOURNAMENT HIGHLIGHTS & PRIZE POOL TRACKER ---
export function TournamentDensitySection() {
  return (
    <div className="space-y-6 pt-4 text-left">
      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
        <div className="border-b border-zinc-900 pb-2.5 flex justify-between items-center flex-wrap gap-2">
          <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-500" />
            Tournament Stats tracker & predictions
          </h4>
          <span className="text-[9px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-900 font-bold font-mono">PRIZE CAP: $50,000 COINS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-black/60 p-4 border border-zinc-900 rounded-xl space-y-1">
            <span className="text-zinc-500 block text-[9px] uppercase">TOTAL FUND DISPATCHED</span>
            <strong className="text-white text-base block font-black">$4,500.00 USD</strong>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">Distributed directly to verified Zimbabwe mobile wallets.</p>
          </div>

          <div className="bg-black/60 p-4 border border-zinc-900 rounded-xl space-y-1">
            <span className="text-zinc-500 block text-[9px] uppercase">MOST CHOSEN MVP TEAM</span>
            <strong className="text-white text-base block font-black">Alpha Crimson</strong>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">74% fan votes predict they win Erangel final match.</p>
          </div>

          <div className="bg-black/60 p-4 border border-zinc-900 rounded-xl space-y-1">
            <span className="text-zinc-500 block text-[9px] uppercase">RELIABILITY METRIC</span>
            <strong className="text-emerald-400 text-base block font-black">100% Verified Match</strong>
            <p className="text-[10px] text-zinc-500 mt-1 font-sans">Zero match delays registered during Season 5 brackets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. SCRIM SECTION EXPANDED METRICS ---
export function ScrimDensitySection() {
  return (
    <div className="space-y-6 pt-4 text-left">
      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
        <h4 className="text-xs font-black text-white uppercase tracking-widest font-orbitron">🎯 Waitlist tracking & scrimmage reliability rating</h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
          To maintain tournament parity, teams that register and do not participate are given reliability warnings. Continuous reliability scores are listed below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono text-center">
          {[
            { tag: "Reliability Index", val: "99.2%", desc: "Average checkin promptness" },
            { tag: "Open Lobby Codes", val: "4 Active", desc: "Available for join registers" },
            { tag: "Active Scrim Clans", val: "16+ Teams", desc: "Regular regional challengers" },
            { tag: "Fastest Match Slot", val: "2.4 Mins", desc: "Average lobby fill period" }
          ].map((scrimItem, idx) => (
            <div key={idx} className="bg-black/60 p-3 border border-zinc-900 rounded-xl space-y-1">
              <span className="text-[8.5px] text-zinc-500 uppercase block font-bold">{scrimItem.tag}</span>
              <strong className="text-white text-sm block font-black">{scrimItem.val}</strong>
              <span className="text-[9px] text-zinc-500 block font-sans">{scrimItem.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 5. TDM ARENA ADDITIONAL METRIC GRAPHICS ---
export function TdmArenaDensitySection() {
  return (
    <div className="space-y-6 pt-4 text-left">
      <div className="bg-zinc-950/95 border border-zinc-905 p-5 rounded-3xl relative overflow-hidden space-y-4">
        <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest font-orbitron flex items-center gap-1">
          <Flame size={13} className="text-red-550" />
          TDM DAILY CHALLENGES & WIN STREAK LEADERBOARD
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-black p-4 rounded-xl border border-zinc-900">
            <span className="text-[9px] text-[#ff001c] font-black block">🔥 TOP KILLER STREAK</span>
            <strong className="text-white text-sm block mt-1">CV_Tinashe (+11 Wins)</strong>
            <p className="text-[10.5px] text-zinc-400 mt-1 font-sans">Winning duels strictly with classic M416 iron-sights setup.</p>
          </div>

          <div className="bg-black p-4 rounded-xl border border-zinc-900">
            <span className="text-[9px] text-yellow-500 font-bold block">🎯 DAILY ARENA QUEST</span>
            <strong className="text-white text-xs block mt-1">Headshots Bounty Challenge</strong>
            <p className="text-[10.5px] text-zinc-500 mt-0.5 font-sans">Accumulate 10 high-precision sniper headshots inside TDM matches.</p>
            <span className="text-[8px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded mt-2 inline-block font-mono">Bounty: +25 CV Coins</span>
          </div>

          <div className="bg-black p-4 rounded-xl border border-zinc-900">
            <span className="text-[9px] text-blue-400 font-bold block">📊 DYNAMIC MATCH COUNT</span>
            <strong className="text-white text-sm block mt-1">428 duels resolved today</strong>
            <p className="text-[10.5px] text-zinc-500 mt-1 font-sans">Active ping latency from Harare servers: 18ms average.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 6. COMMUNITY SQUAD SECTION ADD-ON ---
export function CommunityTeamDensitySection() {
  return (
    <div className="space-y-4 pt-4 text-left">
      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 space-y-2 text-xs">
        <strong className="text-white text-xs uppercase tracking-wide block font-orbitron">🔥 Recruitment matches spotlight feed</strong>
        <p className="text-[10.5px] text-zinc-500 font-sans leading-normal">
          Check out newly created communities seeking additional dual shooters. Send recruitment inquiries to the corresponding team coordinators.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
          <div className="bg-black p-3 rounded-lg border border-zinc-900 flex justify-between items-center">
            <div>
              <strong className="text-white block text-[11px]">Zimbabwe Elite Fighters</strong>
              <span className="text-[9px] text-zinc-500">Formed 2 hours ago • Open for recruit registers</span>
            </div>
            <span className="text-[9px] text-yellow-500 font-bold uppercase">ACTIVE CAPTAIN</span>
          </div>

          <div className="bg-black p-3 rounded-lg border border-zinc-900 flex justify-between items-center">
            <div>
              <strong className="text-white block text-[11px]">Bulawayo Viper Squad</strong>
              <span className="text-[9px] text-zinc-500">14 out of 20 players matching requirements</span>
            </div>
            <span className="text-[9px] text-emerald-400 font-bold uppercase">APPROVED CREW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 7. STREAMER SCHEDULER HUB DENSITY ---
export function StreamerHubDensitySection() {
  return (
    <div className="space-y-6 pt-4 text-left">
      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4">
        <h4 className="text-xs font-black text-white uppercase tracking-widest font-orbitron flex items-center gap-1.5">
          <Video size={14} className="text-red-550" />
          Official Broadcast channels streamer schedule
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-black/60 border border-zinc-900 rounded-xl space-y-1">
            <span className="text-[9px] text-yellow-500 font-extrabold block">● LIVE STREAMING NOW</span>
            <strong className="text-white text-xs block">CV_Broadcaster_HQ</strong>
            <p className="text-[10.5px] text-zinc-500 font-sans">Spectating PMGC-style tier 1 scrims. 142 viewers.</p>
          </div>

          <div className="p-3 bg-black/60 border border-zinc-900 rounded-xl space-y-1">
            <span className="text-[9px] text-[#ff001c] font-black block">🗓️ FRIDAY MATCHCASTING DUE</span>
            <strong className="text-white text-xs block">Viper_Ares_Caster</strong>
            <p className="text-[10.5px] text-zinc-500 font-sans">Bermuda tournament final matches map casting.</p>
          </div>

          <div className="p-3 bg-black/60 border border-zinc-900 rounded-xl space-y-1">
            <span className="text-[9px] text-[#10b981] font-bold block">✓ VERIFIED ARCHIVE CLIPS</span>
            <strong className="text-white text-xs block">Mamba clutch 1v4 wipe</strong>
            <p className="text-[10.5px] text-zinc-500 font-sans">Erangel compound bridge blocking shootout cliptag.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 8. NEWS FEED NEWS DENSITY ---
export function NewsHubDensitySection() {
  return (
    <div className="space-y-4 pt-4 text-left font-mono">
      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-905 space-y-2">
        <span className="text-[9px] text-red-500 block uppercase font-black">🔥 ESPORTS TRENDING DISCUSSIONS & ARTICLES</span>
        <strong className="text-xs text-white block uppercase font-orbitron">Lobby rules update regarding recoil injection logs</strong>
        <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
          Our Automated Auto-Fix & isolation system is actively running script checkers on uploaded files. Anyone utilizing unverified configuration overrides in TDM tournaments will trigger automated bans. Take proper precaution and download genuine files from Verified Vaults.
        </p>
      </div>
    </div>
  );
}

// --- 9. RULES DASHBOARD POPULAR QUESTIONS ---
export function RulesDensitySection() {
  return (
    <div className="space-y-4 pt-4 text-left text-xs font-mono">
      <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-900 space-y-3">
        <strong className="text-stone-200 block text-xs uppercase tracking-wide">📋 COMPLIANCE, APPEAL & PENALTY INDEX STATS</strong>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-black p-3.5 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[9px] uppercase">Compliance rate</span>
            <strong className="text-white text-base block font-black">99.4% Complying</strong>
            <p className="text-[10.2px] text-zinc-550 font-sans">Average roster verification logs matched flawlessly.</p>
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[9px] uppercase">Penalty cards dispatched</span>
            <strong className="text-amber-500 text-base block font-black">3 Warning flags issued</strong>
            <p className="text-[10.2px] text-zinc-550 font-sans">Mainly concerning delays in Bermuda lobby schedules.</p>
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-zinc-900">
            <span className="text-zinc-500 block text-[9px] uppercase">Review appeals pending</span>
            <strong className="text-blue-400 text-base block font-black">0 Appeals active</strong>
            <p className="text-[10.2px] text-zinc-550 font-sans">Auto-resolved under verification panel guidelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 10. TEAM HUB TRAINING SCHEDULE & CALENDAR ---
export function TeamHubDensitySection() {
  return (
    <div className="space-y-6 pt-4 text-left">
      <div className="bg-[#111111] p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs">
        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1">
          <Calendar size={13} className="text-red-550" />
          ACTIVE TEAM TRAINING SCHEDULE & COHESION STATS
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black p-4 rounded-xl border border-zinc-900 space-y-3">
            <strong className="text-[#10b981] block uppercase font-mono text-[10px]">🗓️ SQUAD PRE-MATCH SCHEDULES</strong>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between items-center text-zinc-400">
                <span>🔥 Compound Rotation drill</span>
                <span className="text-white">Tonight, 20:00 UTC</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>💬 Tactical Map walkthrough</span>
                <span className="text-white">Friday, 18:00 UTC</span>
              </div>
            </div>
          </div>

          <div className="bg-black p-4 rounded-xl border border-zinc-900 space-y-2">
            <strong className="text-white block font-mono text-[10px]">🎖️ REQUISITE COMBAT READINESS</strong>
            <p className="text-[11.5px] text-zinc-550 font-sans">Roster chemistry metrics verify that communication latency remains exceptionally secure for tournament matchmaking pools.</p>
            <span className="text-[10px] text-emerald-400 block font-mono font-bold">LOBBY COMPATIBILITY INDEX: 98% GOOD ★</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 11. STRATEGY ROOM MOCK SAVED BLUEPRINTS ---
export function StrategyRoomDensitySection() {
  return (
    <div className="space-y-4 pt-4 text-left text-xs font-mono">
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-2">
        <strong className="text-white font-black block text-[11px] uppercase">🗺️ Rotation library & Tactical templates spotlight</strong>
        <p className="text-[11.2px] text-zinc-550 font-sans leading-normal">
          Save blueprints dynamically using our coaching overlay options. Explore optimized military base drops and secure compound covers automatically.
        </p>
        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="p-2.5 bg-black rounded-lg border border-zinc-900">
            <strong className="text-stone-300 block">Pochinki Split Blueprint</strong>
            <span className="text-zinc-500 font-sans">Optimal cover setup for squads. (2 rotated angles)</span>
          </div>
          <div className="p-2.5 bg-black rounded-lg border border-zinc-900">
            <strong className="text-stone-300 block">Military Bridge blockade</strong>
            <span className="text-zinc-500 font-sans">High accuracy choke-point blocking strategies.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 12. INTELLIGENT EMPTY-STATE WIDGET ---
export function IntelligentEmptyState({ title, subtitle, actionLabel, onAction }: { title: string; subtitle: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="p-6 bg-gradient-to-br from-[#0c0d12] to-zinc-950 rounded-2xl border border-zinc-900 text-center space-y-4 font-mono max-w-lg mx-auto my-6 text-xs">
      <div className="w-12 h-12 bg-red-955/20 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl animate-pulse">
        🤖
      </div>
      <div className="space-y-1">
        <strong className="text-white block uppercase text-[12px]">{title} Right Now</strong>
        <p className="text-[10.5px] text-zinc-500 font-sans leading-normal">{subtitle}</p>
      </div>

      <div className="p-3 bg-black rounded-xl border border-zinc-900 text-left space-y-2">
        <span className="text-[9.5px] text-zinc-500 block uppercase font-bold">💡 CV SENTINEL RECOMMENDED ACTION:</span>
        <p className="text-[10.5px] text-zinc-405 leading-normal font-sans">To get started seamlessly, you should register in our open lobbies list or read our recently verified gameplay rule guidelines.</p>
      </div>

      <button
        onClick={onAction}
        className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded uppercase tracking-wide cursor-pointer text-[10.5px]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
