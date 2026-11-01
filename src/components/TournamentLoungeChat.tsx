import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Send, Users, Shield, Zap, AlertCircle, 
  CheckCircle, HelpCircle, Flame, Target, MessageCircle, Info,
  BookOpen, X, Check
} from "lucide-react";
import { UserSession, WorldChatMessage } from "../types";

interface TournamentLoungeChatProps {
  tournamentId: string;
  tournamentTitle: string;
  session: UserSession;
  awardXp: (xp: number) => void;
  setSystemAlertMessage: (msg: string) => void;
}

export default function TournamentLoungeChat({
  tournamentId,
  tournamentTitle,
  session,
  awardXp,
  setSystemAlertMessage
}: TournamentLoungeChatProps) {
  const channelId = `tournament_lounge_${tournamentId}`;
  
  const [messages, setMessages] = useState<WorldChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeUsersCount, setActiveUsersCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lounge rules modal & gate state
  const [hasAcceptedRules, setHasAcceptedRules] = useState<boolean>(() => {
    return localStorage.getItem(`accepted_rules_${tournamentId}`) === "true";
  });
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initial localized mock messages to populate if history is empty
  const getInitialMocks = (): WorldChatMessage[] => [
    {
      id: `mock-1-${tournamentId}`,
      channelId,
      senderIgn: "CV_Slayer_IGL",
      senderRole: "Team Captain",
      senderAvatar: "🎯",
      senderVerified: true,
      senderLevel: 45,
      senderReputation: 100,
      text: `Welcome, everyone! This is the official lounge for the ${tournamentTitle}. Let's keep it tactical! ⚔️`,
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: `mock-2-${tournamentId}`,
      channelId,
      senderIgn: "Panashe_ZIM",
      senderRole: "Team Captain",
      senderAvatar: "🇿🇼",
      senderVerified: true,
      senderLevel: 32,
      senderReputation: 98,
      text: "Any free-agent players with > 2.5 K/D? We might need 1 substitute assaulter for the Sanhok map.",
      timestamp: new Date(Date.now() - 180000).toISOString()
    },
    {
      id: `mock-3-${tournamentId}`,
      channelId,
      senderIgn: "CV_Mamba_Flick",
      senderRole: "Team Captain",
      senderAvatar: "🐍",
      senderVerified: true,
      senderLevel: 32,
      senderReputation: 100,
      text: "Friendly tip: Watch the ridge edge gatekeepers near Gatka. Always hold smokes for rotation covers! 💨",
      timestamp: new Date(Date.now() - 60000).toISOString()
    }
  ];

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setErrorText(null);
      
      // Initialize configuration identity
      ws.send(JSON.stringify({
        type: "init",
        user: {
          ign: session.ign,
          role: session.role,
          avatar: session.role === "Owner" ? "🎯" : session.role === "Head Admin" ? "👑" : "🛡️",
          verified: session.verified
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        switch (payload.type) {
          case "init_data": {
            // Load messages for our specific tournament lounge channel
            if (payload.history && payload.history[channelId]) {
              setMessages(payload.history[channelId]);
            } else {
              setMessages(getInitialMocks());
            }
            if (payload.onlineUsers) {
              // Set a reasonable dynamic number of users for this room based on overall count
              const count = Math.max(1, Math.floor(payload.onlineUsers.length * 0.4));
              setActiveUsersCount(count + 2);
            }
            break;
          }

          case "chat_message": {
            const msg: WorldChatMessage = payload.message;
            if (msg.channelId === channelId) {
              setMessages(prev => {
                // Prevent duplicate message IDs
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
              setErrorText(null);
            }
            break;
          }

          case "presence": {
            if (payload.onlineUsers) {
              const count = Math.max(1, Math.floor(payload.onlineUsers.length * 0.4));
              setActiveUsersCount(count + 2);
            }
            break;
          }

          case "chat_error": {
            setErrorText(payload.error);
            setSystemAlertMessage(`⚠️ ${payload.error}`);
            break;
          }

          case "system_notify": {
            setSystemAlertMessage(payload.message);
            awardXp(15);
            break;
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
      setErrorText("Connection lost. Trying to reconnect...");
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [channelId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sending message function
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !isConnected) return;
    
    setErrorText(null);
    setIsSubmitting(true);

    try {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: "send_chat",
          channelId,
          text: textToSend
        }));
        
        awardXp(2); // Small XP boost for positive community participation
      } else {
        setErrorText("Socket is disconnected. Message not sent.");
      }
    } catch (err) {
      setErrorText("Failed to transmit message payload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText);
    setInputText("");
  };

  // Pre-configured Strategy & Team-find presets
  const presets = [
    {
      label: "⚔️ Need Sub Player",
      text: "Need 1 last-minute substitute teammate for the roster! Drop IGN and stats."
    },
    {
      label: "🎯 Looking for Squad",
      text: "Free-agent player looking to join a competitive squad. I play anchor/support!"
    },
    {
      label: "🗺️ Let's Dropspot Split",
      text: "What dropspots are squads planning for Map 1? Yasnaya or Pochinki?"
    },
    {
      label: "🏔️ West Rotations Warning",
      text: "Watch the West Hills around Erangel! High-ground snipers always gatekeep there."
    },
    {
      label: "💨 Save Smoke Grenades",
      text: "Pro tip: Stock up at least 4 smokes each for final circle rotations."
    }
  ];

  // Format timestamp helper
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  // Role color assignment helper
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "Head Admin":
      case "Admin":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "Moderator":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30";
      case "Team Captain":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-zinc-900 text-gray-400 border border-zinc-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-chakra">
      
      {/* LEFT COLUMN: TACTICAL DESK & PRESETS */}
      <div className="space-y-6">
        
        {/* ROOM STATUS & STATS PANEL */}
        <div className="bg-[#050914] border border-stone-900 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-black font-russo text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
            🛰️ LOUNGE TELEMETRY
          </h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-stone-900">
              <span className="text-gray-400">Connection Status</span>
              {isConnected ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-500 font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  OFFLINE
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-stone-900">
              <span className="text-gray-400">Tactics Level</span>
              <span className="text-red-500 font-bold font-mono uppercase">PMGC STANDARD</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-stone-900">
              <span className="text-gray-400">Active Recruits & Captains</span>
              <span className="font-mono text-white font-bold">{activeUsersCount} present</span>
            </div>
          </div>
        </div>

        {/* ONE-CLICK TACTICAL PRESET MESSAGES */}
        <div className="bg-[#050914] border border-stone-900 p-5 rounded-xl space-y-3">
          <div className="space-y-1">
            <h3 className="text-xs font-black font-russo text-white uppercase tracking-wider border-l-2 border-red-500 pl-2">
              📢 TACTICAL QUICK CALLS
            </h3>
            <p className="text-[10px] text-gray-500">
              Tap a preset button below to instantaneously broadcast match strategies or recruitment calls:
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleSendMessage(preset.text);
                  setSystemAlertMessage(`Sent quick call: "${preset.label}"`);
                }}
                disabled={!isConnected}
                className="w-full p-2.5 bg-zinc-950 hover:bg-red-950/20 text-left text-[11px] text-stone-300 rounded-lg border border-stone-900 hover:border-red-500/20 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{preset.label}</span>
                <span className="text-gray-500 group-hover:text-red-500 transition-colors font-mono text-[9px] uppercase font-bold">SEND →</span>
              </button>
            ))}
          </div>
        </div>

        {/* INTEGRITY AND RULES WARNING */}
        <div className="bg-[#050914] border border-stone-900 p-5 rounded-xl text-left space-y-2">
          <div className="flex items-center gap-1.5 text-red-500">
            <Shield size={14} />
            <strong className="text-[10px] font-mono uppercase tracking-wider font-black">Lounge Rules Guidelines</strong>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
            This workspace lounge operates strict automated anti-cheat filters. Do not leak match passwords to unregistered teams, and avoid toxic language. Infractions result in immediate server mutes.
          </p>
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="w-full mt-2.5 py-2 px-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded-lg text-[10px] font-mono uppercase font-black tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen size={12} />
            <span>Open Platform Standards</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN CHAT STREAM INTERACTIVE SCREEN */}
      <div className="lg:col-span-2 bg-[#050914] border border-stone-900 rounded-xl overflow-hidden flex flex-col h-[550px]">
        
        {/* CHAT HEADER */}
        <div className="p-4 bg-zinc-950 border-b border-stone-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-950/20 border border-red-500/30 text-red-500 rounded-lg">
              <MessageSquare size={14} className="animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black font-russo text-white uppercase tracking-wider">
                TOURNAMENT STRATEGY LOUNGE
              </h4>
              <p className="text-[10px] text-gray-400">
                Match coordination lobby • {tournamentTitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded text-[9px] text-red-400 font-mono uppercase font-bold animate-pulse">
            <Flame size={10} className="text-red-500" />
            <span>REAL-TIME FEED</span>
          </div>
        </div>

        {/* MESSAGES VIEW GRID CONTAINER / GATED ENTRY SCREEN */}
        {!hasAcceptedRules ? (
          <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center bg-zinc-950/40 relative">
            <div className="absolute inset-0 bg-radial-gradient from-red-950/25 to-transparent pointer-events-none opacity-40" />
            
            <div className="max-w-md w-full space-y-5 text-center relative z-10 p-5 bg-black/60 rounded-xl border border-red-950/40 shadow-2xl backdrop-blur-md">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-500">
                <Shield size={24} className="animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-black font-russo text-white uppercase tracking-wider">
                  CONDUCT STANDARDS VERIFICATION
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  To maintain the integrity of the tournament ecosystem and scout recruiting, you must acknowledge the **CV Esports Lounge Standards** before participating.
                </p>
              </div>

              {/* Conduct bullets */}
              <div className="space-y-2.5 text-left border-t border-b border-stone-900 py-4">
                <div className="flex gap-2.5 text-xs">
                  <span className="text-red-500 text-[12px] font-bold font-mono">01.</span>
                  <div>
                    <strong className="text-stone-200 block font-chakra text-[11px] uppercase tracking-wider">Roster & Room Code Integrity</strong>
                    <span className="text-[10px] text-stone-400 font-sans">Do not leak lobbies, server passwords, or brackets coordinates to external parties.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 text-xs">
                  <span className="text-red-500 text-[12px] font-bold font-mono">02.</span>
                  <div>
                    <strong className="text-stone-200 block font-chakra text-[11px] uppercase tracking-wider">Professional Combat Conduct</strong>
                    <span className="text-[10px] text-stone-400 font-sans">Zero tolerance for toxic behaviors, aggressive personal feuds, slurs, or flame wars. Keep it tactical.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 text-xs">
                  <span className="text-red-500 text-[12px] font-bold font-mono">03.</span>
                  <div>
                    <strong className="text-stone-200 block font-chakra text-[11px] uppercase tracking-wider">Zero Advertising & Spam</strong>
                    <span className="text-[10px] text-stone-400 font-sans">Do not post discord referral codes, commercial advertisements, or promote competitive leagues.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 text-xs">
                  <span className="text-red-500 text-[12px] font-bold font-mono">04.</span>
                  <div>
                    <strong className="text-stone-200 block font-chakra text-[11px] uppercase tracking-wider">Anti-Cheat Compliance</strong>
                    <span className="text-[10px] text-stone-400 font-sans">Do not offer hack tools, performance exploit tips, or recruit cheat developers.</span>
                  </div>
                </div>
              </div>

              {/* Accept Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setHasAcceptedRules(true);
                  localStorage.setItem(`accepted_rules_${tournamentId}`, "true");
                  setSystemAlertMessage("🔓 Lounge unlocked! Welcome to the Strategy Lounge.");
                  awardXp(10); // Reward with 10 XP for compliance
                }}
                className="w-full py-2.5 bg-red-650 hover:bg-white hover:text-red-850 text-white font-black font-russo rounded-lg text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
              >
                <CheckCircle size={14} />
                <span>ACCEPT STANDARDS & JOIN CHAT</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* MESSAGES VIEW GRID CONTAINER */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-black/20">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center text-stone-500 space-y-2">
                  <MessageCircle size={32} className="text-zinc-800" />
                  <p className="text-xs">No strategy communications posted yet.</p>
                  <p className="text-[10px] text-gray-500 max-w-xs">Be the first squad member to send a combat tips or teammate find message!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = msg.senderIgn === session.ign;
                  const isSystemMsg = msg.system;
                  
                  if (isSystemMsg) {
                    return (
                      <div key={msg.id} className="flex justify-center">
                        <div className="px-3 py-1.5 bg-red-950/20 border border-red-950/40 rounded-lg text-[10px] text-red-400 max-w-md flex gap-1.5 items-center justify-center font-mono">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex gap-3 text-left ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      
                      {/* Left Avatar (only if not current user) */}
                      {!isCurrentUser && (
                        <span className="w-8 h-8 rounded-full bg-zinc-900 border border-stone-800 flex items-center justify-center text-sm shrink-0 self-start mt-1">
                          {msg.senderAvatar || "👤"}
                        </span>
                      )}

                      {/* Message Bubble Container */}
                      <div className={`space-y-1 max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}>
                        
                        {/* Username and Tags */}
                        <div className={`flex gap-1.5 items-center text-[10px] ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                          <strong className={`font-bold font-chakra ${isCurrentUser ? "text-red-400" : "text-white"}`}>
                            {msg.senderIgn}
                          </strong>
                          <span className={`px-1.5 py-0.2 rounded font-mono font-black uppercase text-[8px] ${getRoleBadgeStyle(msg.senderRole)}`}>
                            {msg.senderRole}
                          </span>
                          {msg.senderVerified && (
                            <CheckCircle size={10} className="text-red-500 shrink-0" />
                          )}
                          <span className="text-[8px] text-gray-550 font-mono">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>

                        {/* Chat Text Bubble */}
                        <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          isCurrentUser 
                            ? "bg-red-950/25 border-red-500/30 text-stone-200 rounded-tr-none text-left" 
                            : "bg-zinc-950 border-stone-900 text-stone-300 rounded-tl-none"
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>

                      {/* Right Avatar (only if current user) */}
                      {isCurrentUser && (
                        <span className="w-8 h-8 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-sm shrink-0 self-start mt-1">
                          {session.role === "Owner" ? "🎯" : session.role === "Head Admin" ? "👑" : "🛡️"}
                        </span>
                      )}

                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT FORM CONTAINER BOX */}
            <div className="p-4 bg-zinc-950 border-t border-stone-900 shrink-0">
              <form onSubmit={onSubmitForm} className="space-y-2">
                
                {errorText && (
                  <div className="flex items-center gap-1.5 text-[10px] text-red-500 bg-red-950/10 border border-red-900/30 p-2 rounded">
                    <AlertCircle size={11} className="shrink-0" />
                    <span>{errorText}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={!isConnected || isSubmitting}
                    maxLength={250}
                    placeholder={
                      isConnected 
                        ? "Type tactical tips, drop points or teammate finds..." 
                        : "Connecting to real-time networks..."
                    }
                    className="flex-1 bg-black/40 border border-stone-900 focus:border-red-500/60 p-2.5 rounded-lg text-xs text-white placeholder-gray-550 font-sans focus:outline-none focus:ring-1 focus:ring-red-500/40 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || !isConnected || isSubmitting}
                    className="px-4 bg-red-650 hover:bg-white hover:text-red-800 text-white font-black font-russo rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:hover:bg-red-650 disabled:hover:text-white"
                  >
                    <span>SEND</span>
                    <Send size={11} />
                  </button>
                </div>

                <div className="flex justify-between items-center text-[9px] text-gray-550 font-mono">
                  <span>{inputText.length} / 250 characters max</span>
                  <span className="flex items-center gap-1">
                    <Info size={9} />
                    <span>Standard chat filters are active</span>
                  </span>
                </div>
              </form>
            </div>
          </>
        )}

      </div>

      {/* MANUAL LOUNGE RULES MODAL POPUP */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#050914] border border-stone-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-stone-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Modal header */}
            <div className="p-6 border-b border-stone-900 bg-zinc-950 flex items-center gap-2.5">
              <div className="p-2 bg-red-950/20 border border-red-500/30 text-red-500 rounded-lg">
                <Shield size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black font-russo text-white uppercase tracking-wider">
                  CV ESPORTS PLATFORM STANDARDS
                </h4>
                <p className="text-[10px] text-gray-500 font-sans">
                  Lounge communication rules & match lobby guidelines
                </p>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar text-left text-xs">
              <p className="text-stone-400 leading-relaxed font-sans text-[11px]">
                These rules apply across all local strategy channels and lounge networks. Infractions result in automated or manual moderation actions, including temporary/permanent mute states.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[10px] font-black text-red-400 font-mono">
                    1
                  </div>
                  <div>
                    <h5 className="font-chakra font-black text-white text-[11px] uppercase tracking-wider">Lobby Passwords & Room Security</h5>
                    <p className="text-stone-400 text-[10.5px] leading-relaxed font-sans mt-0.5">
                      Never publish direct room credentials or lobby passwords to unregistered teams or external social feeds. Roster security is vital.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[10px] font-black text-red-400 font-mono">
                    2
                  </div>
                  <div>
                    <h5 className="font-chakra font-black text-white text-[11px] uppercase tracking-wider">Toxicity & Competitive Sportsmanship</h5>
                    <p className="text-stone-400 text-[10.5px] leading-relaxed font-sans mt-0.5">
                      Competitive play can get intense, but harassment, racial slurs, derogatory references, or threat levels result in profile locks. Maintain the high standard of Zimbabwean esports!
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[10px] font-black text-red-400 font-mono">
                    3
                  </div>
                  <div>
                    <h5 className="font-chakra font-black text-white text-[11px] uppercase tracking-wider">Self-Promotion & Affiliate Spam</h5>
                    <p className="text-stone-400 text-[10.5px] leading-relaxed font-sans mt-0.5">
                      This is a tactical strategy match lounge. Avoid distributing referral links, selling merchandise, or marketing other tournaments without explicit admin consent.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[10px] font-black text-red-400 font-mono">
                    4
                  </div>
                  <div>
                    <h5 className="font-chakra font-black text-white text-[11px] uppercase tracking-wider">Fair Play & Integrity</h5>
                    <p className="text-stone-400 text-[10.5px] leading-relaxed font-sans mt-0.5">
                      Do not discuss, distribute, or recommend illegal software enhancers, macro tools, config modding scripts, or bugs exploits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 bg-zinc-950 border-t border-stone-900 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 bg-red-650 hover:bg-white hover:text-red-800 text-white font-black font-russo rounded-lg text-xs tracking-wider transition-all cursor-pointer"
              >
                CLOSE COMPLIANCE STANDARDS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
