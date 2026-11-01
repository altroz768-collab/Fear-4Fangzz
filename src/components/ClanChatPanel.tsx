import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Lock, ShieldAlert, Check, Ban, Terminal, Users, Sparkles, MessageCircle } from "lucide-react";
import { UserSession, RecruitmentApplication, ChatMsg } from "../types";

interface ClanChatPanelProps {
  session: UserSession;
  recruits: RecruitmentApplication[];
  onApproveRecruit: (appId: string, action: "Approved" | "Rejected") => void;
  setSystemAlertMessage: (msg: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  messages?: ChatMsg[];
  setMessages?: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  unreadCount?: number;
  setUnreadCount?: React.Dispatch<React.SetStateAction<number>>;
}

export default function ClanChatPanel({
  session,
  recruits,
  onApproveRecruit,
  setSystemAlertMessage,
  isOpen: propsIsOpen,
  setIsOpen: propsSetIsOpen,
  messages: propsMessages,
  setMessages: propsSetMessages,
  unreadCount: propsUnreadCount,
  setUnreadCount: propsSetUnreadCount
}: ClanChatPanelProps) {
  const getRoleColorClasses = (role: string) => {
    switch (role) {
      case "Owner":
        return {
          badge: "bg-[#FF001C]/15 text-[#FF001C] border border-[#FF001C]/30",
          text: "text-[#FF001C]"
        };
      case "Head Admin":
      case "Admin":
      case "Team Captain":
      case "Moderator":
        return {
          badge: "bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30",
          text: "text-[#FFD700]"
        };
      case "Member":
      case "Recruit":
      default:
        return {
          badge: "bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30",
          text: "text-[#00FF9D]"
        };
    }
  };

  const [localIsOpen, localSetIsOpen] = useState(false);
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : localIsOpen;
  const setIsOpen = propsSetIsOpen !== undefined ? propsSetIsOpen : localSetIsOpen;

  const [localUnreadCount, localSetUnreadCount] = useState(0);
  const unreadCount = propsUnreadCount !== undefined ? propsUnreadCount : localUnreadCount;
  const setUnreadCount = propsSetUnreadCount !== undefined ? propsSetUnreadCount : localSetUnreadCount;

  const [activeChannel, setActiveChannel] = useState<"general" | "team" | "admin">("general");
  const [generalInputValue, setGeneralInputValue] = useState("");
  const [teamInputValue, setTeamInputValue] = useState("");
  const [adminCommandInput, setAdminCommandInput] = useState("");
  
  // Immersive mock list matching esports branding
  const [localMessages, localSetMessages] = useState<ChatMsg[]>([
    {
      id: "m1",
      sender: "CV_Specter",
      role: "Member",
      text: "Who is up for some PUBG Erangel custom squad scrims tonight? Need a reliable secondary fragger.",
      time: "07:15 AM",
      channel: "general"
    },
    {
      id: "m2",
      sender: "Liquid_Ace_99",
      role: "Member",
      text: "The new TDM tournament builder is absolute gas 🔥 tested the 4v4 simulation and seeds work flawlessly.",
      time: "07:18 AM",
      channel: "general"
    },
    {
      id: "m3",
      sender: "ESL_Admin",
      role: "Team Captain",
      text: "Reminder: Sector eligibility relies on playing at least 5 scrim match sessions this week. Keep grinding!",
      time: "07:22 AM",
      channel: "general"
    },
    {
      id: "m4",
      sender: "CV_Slayer_IGL",
      role: "Owner",
      text: "Team, for the CV Solo PUBG Mobile Showdown we are employing strict high-ground rotations. Do not push blind.",
      time: "07:02 AM",
      channel: "team"
    },
    {
      id: "m5",
      sender: "CV_Viper_Sniper",
      role: "Team Captain",
      text: "Understood. I will hold the vertical hangar angles with M24 precision. Apex holds the low flank.",
      time: "07:05 AM",
      channel: "team"
    },
    {
      id: "m6",
      sender: "CV_Apex_Rusher",
      role: "Member",
      text: "Loadouts calibrated to 5.56 assault rifles. Ready to clear containment rows. Let's secure the crown.",
      time: "07:11 AM",
      channel: "team"
    }
  ]);
  const messages = propsMessages !== undefined ? propsMessages : localMessages;
  const setMessages = propsSetMessages !== undefined ? propsSetMessages : localSetMessages;

  // Clear unreadCount when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen, setUnreadCount]);


  const [adminLogs, setAdminLogs] = useState<string[]>([
    "🛡️ Telemetry secure: Anti-Cheat daemon running on background node [v54.8]",
    "⚔️ Dynamic bracket re-seeding verified successfully for TDM Championship",
    "⚡ System ready to analyze incoming prospect applicant signatures..."
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activeChannel, isOpen]);

  const handleSendMessage = (channel: "general" | "team") => {
    const textVal = channel === "general" ? generalInputValue : teamInputValue;
    if (!textVal.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMsg = {
      id: "msg_" + Date.now(),
      sender: session.ign,
      role: session.role,
      text: textVal,
      time: timestamp,
      channel: channel
    };

    setMessages(prev => [...prev, newMsg]);
    if (channel === "general") setGeneralInputValue("");
    else setTeamInputValue("");

    // Hype-inducing dynamic responses to simulate lively esports server activity!
    setTimeout(() => {
      const responses: Record<"general" | "team", string[]> = {
        general: [
          `🎯 @${session.ign} I'm down! Count me in. Let's create a custom lobby right away.`,
          `🔥 Solid run, boys. Faction ranking is going straight to the top.`,
          `👀 I saw that training heat map strategy. Absolute masterclass.`,
          `⚡ Let's register standard rosters before the live countdown timer expires!`
        ],
        team: [
          `⚔️ Locked and loaded, captain @${session.ign}. Tactical rotation standard confirmed.`,
          `🚀 Secure behind the container walls. Waiting for coordination ping.`,
          `🥇 Outstanding logic. The prize pool is ours for sure.`
        ]
      };

      const pool = responses[channel];
      const randomResponse = pool[Math.floor(Math.random() * pool.length)];
      
      const bots = [
        { name: "CV_Viper_Sniper", role: "Team Captain" },
        { name: "CV_Apex_Rusher", role: "Member" },
        { name: "Liquid_Ace_99", role: "Member" }
      ];
      const selectedBot = bots[Math.floor(Math.random() * bots.length)];

      const botMsg: ChatMsg = {
        id: "msg_reply_" + Date.now(),
        sender: selectedBot.name,
        role: selectedBot.role,
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: channel
      };

      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleExecuteAdminCommand = () => {
    if (!adminCommandInput.trim()) return;
    const input = adminCommandInput.trim().toLowerCase();
    setAdminCommandInput("");

    if (input === "/help") {
      setAdminLogs(prev => [
        ...prev,
        "💻 Available Commands:",
        "💡 /clear - Wipe current command terminals log",
        "💡 /audit - Trigger instant security checksum check",
        "💡 /boost - Allocate simulated +50 Coins to roster admins for diagnostic checks"
      ]);
    } else if (input === "/clear") {
      setAdminLogs(["🧼 Terminal buffer cleared successfully."]);
    } else if (input === "/audit") {
      setAdminLogs(prev => [
        ...prev,
        "🔍 Executing global memory security scans...",
        "🟢 Checksum Match! No cheating traces detected in telemetry packet stacks."
      ]);
      setSystemAlertMessage("🛡️ Live anti-cheat radar sweeps finished! System secure.");
    } else if (input === "/boost") {
      setAdminLogs(prev => [
        ...prev,
        "💰 Diagnostic reward dispatched to active terminal session (+50 Coins)."
      ]);
      setSystemAlertMessage("💳 Admin diagnostics: Granted 50 bonus Coins!");
    } else {
      setAdminLogs(prev => [
        ...prev,
        `❌ Command unrecognized: "${input}". Type /help for terminal specs.`
      ]);
    }
  };

  const isUserTeamMember = ["Owner", "Team Captain", "Member", "Head Admin", "Admin"].includes(session.role);
  const isUserAdmin = ["Owner", "Team Captain", "Head Admin", "Admin"].includes(session.role);

  // Filter pending recruits to show in real-time
  const pendingRecruits = recruits.filter(r => r.status === "Pending");

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* 🔴 Expandable Toggle Button */}
      {!isOpen && (
        <button
          id="clan-chat-toggle-btn"
          onClick={() => {
            setIsOpen(true);
            setSystemAlertMessage("📡 Initializing clan communications network...");
          }}
          className="relative bg-black hover:bg-[#ff001c]/10 text-white rounded-full p-4 shadow-lg shadow-black/80 hover:shadow-[0_0_20px_rgba(255,0,28,0.3)] transition-all duration-300 hover:scale-105 group border border-[#ff001c]/40 flex items-center justify-center cursor-pointer"
        >
          {unreadCount > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#ff001c] text-white text-[10px] font-black font-mono rounded-full flex items-center justify-center animate-bounce shadow-[0_0_12px_#ff001c] border border-white/20">
              {unreadCount}
            </span>
          ) : (
            pendingRecruits.length > 0 && isUserAdmin && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff001f] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-[0_0_10px_#ff001f] border border-white/20">
                {pendingRecruits.length}
              </span>
            )
          )}
          <MessageCircle size={24} className="text-[#ff001f] group-hover:rotate-6 transition-transform" />
          <span className="absolute left-14 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg border border-[#ff001f]/35 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Interact Client Chats
          </span>
        </button>
      )}

      {/* 🔮 CHAT CONSOLE MODULE */}
      {isOpen && (
        <div
          id="clan-chat-window"
          className="w-80 sm:w-[380px] h-[480px] bg-[#0d0d0d] border-2 border-[#ff001f]/40 rounded-xl overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.85)] flex flex-col relative text-left"
        >
          {/* Futuristic subtle scanner lines overlay */}
          <div className="absolute inset-0 bg-transparent opacity-[0.015] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />

          {/* Header Bar */}
          <div className="bg-gradient-to-r from-stone-950 to-neutral-900 px-4 py-3 border-b border-[#ff001f]/20 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff001f] animate-ping" />
              <div>
                <h4 className="text-xs font-black font-orbitron tracking-widest text-white uppercase">CV CLAN INTERCOM</h4>
                <p className="text-[8px] font-mono text-gray-500 tracking-wider">ACTIVE INTERACTION PORT: 3000</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>

          {/* CHANNEL SELECTION TABS */}
          <div className="bg-black/90 px-2 py-1 border-b border-zinc-900 flex items-center gap-1">
            <button
              onClick={() => setActiveChannel("general")}
              className={`flex-1 py-1 px-1 text-[9px] font-black font-orbitron tracking-wider rounded transition-all uppercase cursor-pointer ${
                activeChannel === "general"
                  ? "bg-[#ff001f] text-white shadow-[0_0_8px_rgba(255,0,31,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              📢 General
            </button>
            <button
              onClick={() => setActiveChannel("team")}
              className={`flex-1 py-1 px-1 text-[9px] font-black font-orbitron tracking-wider rounded transition-all uppercase cursor-pointer flex items-center justify-center gap-1 ${
                activeChannel === "team"
                  ? "bg-[#ff001f] text-white shadow-[0_0_8px_rgba(255,0,31,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              🔒 Team Locked
            </button>
            
            {/* Admin exclusive tab */}
            {isUserAdmin && (
              <button
                onClick={() => setActiveChannel("admin")}
                className={`py-1 px-2 text-[9px] font-black font-orbitron tracking-wider rounded transition-all uppercase cursor-pointer flex items-center justify-center gap-1 relative ${
                  activeChannel === "admin"
                    ? "bg-[#ff001f] text-white shadow-[0_0_8px_rgba(255,0,31,0.3)] font-black"
                    : "text-red-500 hover:text-red-400 hover:bg-red-500/5 border border-red-500/20"
                }`}
              >
                🎮 Admin
                {pendingRecruits.length > 0 && (
                  <span className="w-1.5 h-1.5 bg-[#ff001f] rounded-full animate-ping absolute right-1 top-1" />
                )}
              </button>
            )}
          </div>

          {/* CONVERSATION MESSAGE LIST CONTAINER */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080808] custom-scrollbar"
          >
            {/* GENERAL CHANNEL CONTENT */}
            {activeChannel === "general" && (
              messages
                .filter(m => m.channel === "general")
                .map((msg) => {
                  const roleStyle = getRoleColorClasses(msg.role);
                  return (
                    <div key={msg.id} className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${roleStyle.badge}`}>
                          {msg.role}
                        </span>
                        <strong className={`text-[10px] font-mono font-black ${roleStyle.text}`}>{msg.sender}</strong>
                        <span className="text-[8px] text-gray-600 font-mono ml-auto">{msg.time}</span>
                      </div>
                      <p className={`text-xs text-gray-300 pl-2 border-l ${msg.role === "Owner" ? "border-[#FF001C]/30" : ["Admin", "Head Admin", "Team Captain", "Moderator"].includes(msg.role) ? "border-[#FFD700]/30" : "border-[#00FF9D]/30"} bg-white/[0.01] py-1 rounded-r-md`}>
                        {msg.text}
                      </p>
                    </div>
                  );
                })
            )}

            {/* TEAM LOCKED CHANNEL CONTENT */}
            {activeChannel === "team" && (
              !isUserTeamMember ? (
                /* Locked screen for recruit applicant */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-12 h-12 bg-red-950/40 border border-[#ff001f]/40 rounded-full flex items-center justify-center text-[#ff001f] animate-pulse">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h5 className="text-white text-xs font-black font-orbitron tracking-widest uppercase mb-1">🔐 DECRYPTION KEY EXPIRED</h5>
                    <p className="text-[10px] text-gray-400 font-sans max-w-xs leading-relaxed mx-auto">
                      Access to Private Tactical Team files is restricted to authorized Vipers members. Submit your application under the **Join Roster recruitment** tab for verification.
                    </p>
                  </div>
                </div>
              ) : (
                messages
                  .filter(m => m.channel === "team")
                  .map((msg) => {
                    const roleStyle = getRoleColorClasses(msg.role);
                    return (
                      <div key={msg.id} className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${roleStyle.badge}`}>
                            {msg.role}
                          </span>
                          <strong className={`text-[10px] font-mono font-black ${roleStyle.text}`}>{msg.sender}</strong>
                          <span className="text-[8px] text-gray-600 font-mono ml-auto">{msg.time}</span>
                        </div>
                        <p className={`text-xs text-stone-200 pl-2 border-l ${msg.role === "Owner" ? "border-[#FF001C]/30" : ["Admin", "Head Admin", "Team Captain", "Moderator"].includes(msg.role) ? "border-[#FFD700]/30" : "border-[#00FF9D]/30"} bg-black/40 py-1 rounded-r-md italic`}>
                          {msg.text}
                        </p>
                      </div>
                    );
                  })
              )
            )}

            {/* ADMIN EXCLUSIVE AUDIT COMMANDS CHANNEL */}
            {activeChannel === "admin" && isUserAdmin && (
              <div className="space-y-4 text-left font-mono">
                {/* Real-time Recruits Audit Desk Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-red-500/20 pb-1.5">
                    <span className="text-[8px] text-red-500 font-black tracking-widest uppercase flex items-center gap-1">
                      <Terminal size={10} /> PROSPECT REAL-TIME PIPELINE ({pendingRecruits.length})
                    </span>
                    <span className="text-[7px] text-gray-500 font-sans font-bold">SECURE CONNECTOR ACTIVE</span>
                  </div>

                  {pendingRecruits.length === 0 ? (
                    <div className="p-3 bg-black/40 border border-zinc-900 rounded-lg text-center py-4">
                      <Users size={20} className="text-zinc-700 mx-auto mb-1.5 opacity-55" />
                      <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-extrabold">No pending recruits awaiting evaluation</p>
                    </div>
                  ) : (
                    pendingRecruits.map((prospect) => (
                      <div 
                        key={prospect.id}
                        className="bg-stone-950 border border-red-500/20 p-2.5 rounded-lg space-y-2 relative shadow-inner overflow-hidden"
                      >
                        <div className="absolute top-1 right-2 text-[7px] text-gray-500">APPLY LOG</div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            <strong className="text-red-500 font-black uppercase text-[11px]">{prospect.ign}</strong>
                          </div>
                          <p className="text-[9px] text-[#cccccc] font-sans">
                            <span className="text-gray-500 uppercase font-mono font-bold">GAME:</span> {prospect.game} <br />
                            <span className="text-gray-500 uppercase font-mono font-bold">DEVICE:</span> {prospect.device} <br />
                            <span className="text-gray-500 uppercase font-mono font-bold">ROSTER EXP:</span> <span className="line-clamp-1 italic text-zinc-400">{prospect.experience}</span>
                          </p>
                        </div>

                        {/* Interactive Real-Time Decision controls inside Chat Panel */}
                        <div className="flex gap-1.5 pt-1 border-t border-zinc-900">
                          <button
                            onClick={() => {
                              onApproveRecruit(prospect.id, "Approved");
                              setSystemAlertMessage(`🎉 Approved ${prospect.ign} to team ranks directly from intercom!`);
                            }}
                            className="flex-1 py-1 bg-white hover:bg-zinc-200 text-black border border-white rounded text-[9px] font-black uppercase flex items-center justify-center gap-1 transition-all pointer-events-auto cursor-pointer"
                          >
                            <Check size={9} /> Validate
                          </button>
                          <button
                            onClick={() => {
                              onApproveRecruit(prospect.id, "Rejected");
                              setSystemAlertMessage(`🚫 Denied application for ${prospect.ign}`);
                            }}
                            className="flex-1 py-1 bg-red-950/65 hover:bg-red-850 text-red-400 border border-red-800/40 hover:border-red-500 rounded text-[9px] font-black uppercase flex items-center justify-center gap-1 transition-all pointer-events-auto cursor-pointer"
                          >
                            <Ban size={9} /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* System Checksum telemetry streams */}
                <div className="space-y-1.5 bg-black p-2.5 rounded border border-zinc-900 mt-2">
                  <div className="text-[7px] text-gray-400 font-bold uppercase tracking-widest bg-zinc-900/60 px-1.5 py-0.5 rounded inline-block">TERMINAL LOG DESK:</div>
                  <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1 text-[9px] text-zinc-400">
                    {adminLogs.map((log, lIdx) => (
                      <p key={lIdx} className="leading-tight text-[10px]">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CHAT INPUT FIELD */}
          <div className="p-3 bg-black border-t border-[#ff001f]/15">
            {activeChannel === "general" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage("general");
                }}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={generalInputValue}
                  onChange={(e) => setGeneralInputValue(e.target.value)}
                  placeholder="Type in general sector..."
                  className="flex-1 bg-[#121212] border border-zinc-800 focus:border-[#ff001f]/50 text-xs px-3 py-2 rounded text-white focus:outline-none placeholder-gray-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={!generalInputValue.trim()}
                  className="bg-[#ff001f] disabled:opacity-30 hover:bg-red-700 text-white rounded p-2 transition-colors cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            )}

            {activeChannel === "team" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage("team");
                }}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  disabled={!isUserTeamMember}
                  value={teamInputValue}
                  onChange={(e) => setTeamInputValue(e.target.value)}
                  placeholder={isUserTeamMember ? "Input secure team code..." : "Locked Area"}
                  className="flex-1 bg-[#121212] border border-zinc-800 focus:border-[#ff001f]/50 text-xs px-3 py-2 rounded text-white focus:outline-none placeholder-gray-500 disabled:opacity-40 font-sans"
                />
                <button
                  type="submit"
                  disabled={!teamInputValue.trim() || !isUserTeamMember}
                  className="bg-[#ff001f] disabled:opacity-30 hover:bg-red-700 text-white rounded p-2 transition-colors cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            )}

            {activeChannel === "admin" && isUserAdmin && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteAdminCommand();
                }}
                className="flex gap-2 items-center"
              >
                <span className="text-[10px] text-red-500 font-black font-mono shrink-0">$</span>
                <input
                  type="text"
                  value={adminCommandInput}
                  onChange={(e) => setAdminCommandInput(e.target.value)}
                  placeholder="Type command (/help, /audit, /clear, /boost)..."
                  className="flex-1 bg-[#121212] border border-red-500/20 focus:border-red-500/60 text-xs px-3 py-2 rounded text-white focus:outline-none placeholder-stone-605 font-mono text-[11px]"
                />
                <button
                  type="submit"
                  disabled={!adminCommandInput.trim()}
                  className="bg-red-650 hover:bg-red-700 disabled:opacity-30 text-white rounded p-2 transition-colors cursor-pointer"
                >
                  <Terminal size={12} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
