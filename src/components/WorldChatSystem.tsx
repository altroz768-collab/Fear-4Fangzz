import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Smile, Image as ImageIcon, Reply, Trash2, Flag, ShieldAlert, Check, X, 
  Pin, UserCheck, Crown, MessageSquare, Plus, Activity, Sparkles, Lock, 
  Settings, Globe, Search, ArrowDown, HelpCircle, Shield, AlertTriangle, 
  FileText, LogIn, Sliders, Layout, Volume2, ThumbsUp, Heart, Star, Award
} from "lucide-react";
import { UserSession, WorldChatMessage, ChatFilterConfig, ReputationState, ModLogEntry, ChatReport } from "../types";

interface WorldChatProps {
  session: UserSession;
  setSystemAlertMessage: (msg: string) => void;
}

// Preset GIFs list for instant esports integration
const MOCK_GIFS = [
  { id: "gif1", tag: "clutch", name: "Clutch Squad Wipe!", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80" },
  { id: "gif2", tag: "winner", name: "Winner Winner Chicken Dinner!", url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80" },
  { id: "gif3", tag: "gg", name: "GG Well Played", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80" },
  { id: "gif4", tag: "rage", name: "Recoil Fail Rage Quit", url: "https://images.unsplash.com/photo-1548685913-fe6574340a49?auto=format&fit=crop&w=400&q=80" },
  { id: "gif5", tag: "defuse", name: "Perfect Frag Defuse", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80" },
  { id: "gif6", tag: "hype", name: "Esports Arena Crowd Roar!", url: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=400&q=80" },
];

const MOCK_MEDIA_UPLOADS = [
  { name: "Erangel Strategy Map", url: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&w=500&q=80" },
  { name: "Recruit Division Certificate", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=500&q=80" },
  { name: "Championship Golden Badge", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80" },
];

export default function WorldChatSystem({ session, setSystemAlertMessage }: WorldChatProps) {
  // 1. Core Channel Configuration
  const CHANNELS = [
    { id: "global", name: "Central Global Chat", category: "Global Hub", icon: Globe },
    { id: "africa", name: "Africa Chat Grid", category: "Regional Track", icon: Globe },
    { id: "europe", name: "Europe Chat Grid", category: "Regional Track", icon: Globe },
    { id: "asia", name: "Asia Chat Grid", category: "Regional Track", icon: Globe },
    { id: "middle_east", name: "Middle East Grid", category: "Regional Track", icon: Globe },
    { id: "north_america", name: "North America Grid", category: "Regional Track", icon: Globe },
    { id: "south_america", name: "South America Grid", category: "Regional Track", icon: Globe },
    { id: "oceania", name: "Oceania Chat Grid", category: "Regional Track", icon: Globe },
  ];

  const [activeChannelId, setActiveChannelId] = useState("global");

  // 2. WebSocket & Client-side states
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Record<string, WorldChatMessage[]>>({
    global: [], africa: [], europe: [], asia: [], middle_east: [], north_america: [], south_america: [], oceania: []
  });
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [streamers, setStreamers] = useState<any[]>([]);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<WorldChatMessage[]>([]);
  const [filterConfig, setFilterConfig] = useState<ChatFilterConfig>({
    censorMild: true, blockSevere: true, mildWords: [], severeWords: []
  });
  const [reputationState, setReputationState] = useState<ReputationState>({
    ign: session.ign, score: session.verified ? 100 : 80, level: 5, verified: session.verified, warningsCount: 0
  });

  // Client messaging entry fields
  const [inputText, setInputText] = useState("");
  const [replyToMsg, setReplyToMsg] = useState<WorldChatMessage | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [gifSearchKey, setGifSearchKey] = useState("");

  // Custom Poll Creation helper
  const [isPollCreatorOpen, setIsPollCreatorOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollChoices, setPollChoices] = useState<string[]>(["", ""]);

  // Moderator / Admin logs and reports states
  const [reports, setReports] = useState<ChatReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<ModLogEntry[]>([]);
  const [reportedMessage, setReportedMessage] = useState<WorldChatMessage | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [selectedAdminUserTab, setSelectedAdminUserTab] = useState<string | null>(null); // selected user for quick admin warning/mute
  const [adminReasonInput, setAdminReasonInput] = useState("");
  const [adminMuteDuration, setAdminMuteDuration] = useState(15);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mobileHeightStyle, setMobileHeightStyle] = useState<string | undefined>(undefined);

  // Profile Card Overlay State
  const [selectedProfileCard, setSelectedProfileCard] = useState<any | null>(null);
  const [editingCustomTitle, setEditingCustomTitle] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState("");
  const [customTitleError, setCustomTitleError] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  const listEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle mobile visualViewport resize when virtual keyboard toggles
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const vpHeight = window.visualViewport.height;
        if (vpHeight < window.innerHeight * 0.75) {
          // Virtual keyboard is active on mobile
          setMobileHeightStyle(`${Math.max(380, Math.round(vpHeight - 40))}px`);
        } else {
          setMobileHeightStyle(undefined);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.visualViewport.removeEventListener("scroll", handleViewportChange);
      }
    };
  }, []);

  // Is staff verification
  const isStaff = ["Owner", "Head Admin", "Admin", "Moderator"].includes(session.role);
  const isOwnerOrAdmin = ["Owner", "Head Admin", "Admin"].includes(session.role);

  // 3. Initialize WebSocket Link
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    // Connect
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Joined Global System World Socket successfully.");
      setIsConnected(true);
      // Initialize player configuration identity
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
        console.log("WebSocket Packet Received:", payload.type);

        switch (payload.type) {
          case "init_data": {
            // Bulk setup
            if (payload.history) setMessages(payload.history);
            if (payload.onlineUsers) setOnlineUsers(payload.onlineUsers);
            if (payload.streamers) setStreamers(payload.streamers);
            if (payload.filterConfig) setFilterConfig(payload.filterConfig);
            if (payload.reports) setReports(payload.reports);
            if (payload.auditLogs) setAuditLogs(payload.auditLogs);
            if (payload.userReputation) {
              setReputationState(prev => ({
                ...prev,
                ...payload.userReputation
              }));
            }
            break;
          }

          case "chat_message": {
            const msg: WorldChatMessage = payload.message;
            setMessages(prev => {
              const updated = { ...prev };
              if (!updated[msg.channelId]) updated[msg.channelId] = [];
              // Prevent duplicates
              if (!updated[msg.channelId].some(m => m.id === msg.id)) {
                updated[msg.channelId] = [...updated[msg.channelId], msg];
              }
              return updated;
            });
            break;
          }

          case "reaction_updated": {
            const { channelId, messageId, reactions } = payload;
            setMessages(prev => {
              const updated = { ...prev };
              const list = updated[channelId] || [];
              const target = list.find(m => m.id === messageId);
              if (target) {
                target.reactions = reactions;
              }
              return { ...prev, [channelId]: [...list] };
            });
            break;
          }

          case "poll_updated": {
            const { channelId, messageId, poll } = payload;
            setMessages(prev => {
              const updated = { ...prev };
              const list = updated[channelId] || [];
              const target = list.find(m => m.id === messageId);
              if (target) {
                target.poll = poll;
              }
              return { ...prev, [channelId]: [...list] };
            });
            break;
          }

          case "presence": {
            setOnlineUsers(payload.onlineUsers);
            break;
          }

          case "reports_updated": {
            setReports(payload.reports);
            break;
          }

          case "audit_logs": {
            setAuditLogs(payload.logs);
            break;
          }

          case "user_reputation": {
            setReputationState(prev => ({
              ...prev,
              ...payload.reputation
            }));
            break;
          }

          case "filter_config_updated": {
            setFilterConfig(payload.config);
            break;
          }

          case "message_deleted": {
            const { channelId, messageId } = payload;
            setMessages(prev => {
              const updated = { ...prev };
              if (updated[channelId]) {
                updated[channelId] = updated[channelId].filter(m => m.id !== messageId);
              }
              return updated;
            });
            break;
          }

          case "channel_cleared": {
            const { channelId, history } = payload;
            setMessages(prev => ({
              ...prev,
              [channelId]: history
            }));
            break;
          }

          case "pin_status_updated": {
            const { channelId, messageId, pinned } = payload;
            setMessages(prev => {
              const updated = { ...prev };
              const list = updated[channelId] || [];
              const target = list.find(m => m.id === messageId);
              if (target) {
                target.pinned = pinned;
              }
              return { ...prev, [channelId]: [...list] };
            });
            break;
          }

          case "system_notify": {
            setSystemAlertMessage(payload.message);
            break;
          }

          case "custom_title_updated": {
            if (payload.ign === session.ign) {
              session.customTitle = payload.customTitle;
            }
            setSelectedProfileCard((prev: any) => {
              if (prev && prev.ign === payload.ign) {
                return { ...prev, customTitle: payload.customTitle };
              }
              return prev;
            });
            setEditingCustomTitle(false);
            setCustomTitleError("");
            setSystemAlertMessage(payload.message || `✨ Custom title updated to "${payload.customTitle}".`);
            break;
          }

          case "custom_title_error": {
            setCustomTitleError(payload.error || "Title rejected by security policy.");
            setSystemAlertMessage("🚫 Title Rejected: " + payload.error);
            break;
          }

          case "chat_error": {
            setSystemAlertMessage("🚫 Action Denied: " + payload.error);
            break;
          }
        }
      } catch (e) {
        console.error("Failed to digest ws packet data:", e);
      }
    };

    ws.onclose = () => {
      console.log("WS Server link dropped. Attempting offline sync...");
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [session.ign, session.role, session.verified]);

  // Scroll to bottom on updates
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChannelId]);

  // 4. Input trigger message dispatcher
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setSystemAlertMessage("🔌 Error: World Chat Server Link Offline. Retrying reconnection...");
      return;
    }

    setIsSending(true);
    const payload = {
      type: "send_chat",
      channelId: activeChannelId,
      text: inputText,
      replyTo: replyToMsg ? { id: replyToMsg.id, sender: replyToMsg.senderIgn, text: replyToMsg.text } : null,
    };

    socket.send(JSON.stringify(payload));
    setInputText("");
    setReplyToMsg(null);
    setTimeout(() => {
      setIsSending(false);
    }, 250);
  };

  // Click emoji reactor
  const handleAddEmojiReaction = (messageId: string, emoji: string) => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: "add_reaction",
      channelId: activeChannelId,
      messageId,
      emoji,
      ign: session.ign
    }));
    setIsEmojiPickerOpen(false);
  };

  // Create Poll dispatch
  const handleCreatePollMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !socket) return;

    if (!session.verified && !isStaff) {
      setSystemAlertMessage("⚠️ Poll Action: Only Verified community members and Staff can create interaction polls.");
      return;
    }

    const validOptions = pollChoices.filter(opt => opt.trim() !== "").map(opt => ({ text: opt, votes: [] }));
    if (validOptions.length < 2) {
      setSystemAlertMessage("⚠️ Vote Selection: You must provide at least 2 valid poll option routes.");
      return;
    }

    socket.send(JSON.stringify({
      type: "send_chat",
      channelId: activeChannelId,
      text: `📊 COMMUNITY POLL: ${pollQuestion}`,
      poll: {
        question: pollQuestion,
        options: validOptions
      }
    }));

    // Reset
    setPollQuestion("");
    setPollChoices(["", ""]);
    setIsPollCreatorOpen(false);
    setSystemAlertMessage("📊 Community vote poll dispatched to chat success!");
  };

  // Send Preset Image
  const handleSendImageMedia = (imageUrl: string) => {
    if (!socket) return;
    
    if (session.role === "Guest") {
      setSystemAlertMessage("🚫 Upload Denied: Guests have read-only files privilege.");
      return;
    }

    socket.send(JSON.stringify({
      type: "send_chat",
      channelId: activeChannelId,
      text: "🖼️ Shared strategic media analysis",
      imageUrl
    }));
    setIsImagePickerOpen(false);
    setSystemAlertMessage("🖼️ Strategic graphic posted successfully.");
  };

  // Send Preset GIF
  const handleSendGIF = (gifUrl: string) => {
    if (!socket) return;

    if (session.role === "Guest") {
      setSystemAlertMessage("🚫 Upload Denied: Guests have read-only files privilege.");
      return;
    }

    socket.send(JSON.stringify({
      type: "send_chat",
      channelId: activeChannelId,
      text: "🎬 Esports Action GIF",
      gifUrl
    }));
    setIsGifPickerOpen(false);
  };

  // Submit active report
  const handleMessageReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedMessage || !reportReason.trim() || !socket) return;

    socket.send(JSON.stringify({
      type: "report_message",
      messageId: reportedMessage.id,
      channelId: activeChannelId,
      reportedUser: reportedMessage.senderIgn,
      reporter: session.ign,
      reason: reportReason
    }));

    setReportReason("");
    setReportedMessage(null);
  };

  // Handle Admin Dashboard Commands
  const handleAdminCommandAction = (action: "Warning" | "Mute" | "Suspend" | "Ban", durationMinutes?: number) => {
    if (!selectedAdminUserTab || !socket) return;

    socket.send(JSON.stringify({
      type: "admin_mod_action",
      action,
      targetIgn: selectedAdminUserTab,
      reason: adminReasonInput || "Community standards and decorum breach protocol.",
      durationMinutes: durationMinutes || adminMuteDuration
    }));

    setAdminReasonInput("");
    setSystemAlertMessage(`⚖️ Administrative Order "${action}" broadcasted on target: ${selectedAdminUserTab}`);
  };

  const handleAdminMessagePurge = (messageId: string) => {
    if (!socket || !window.confirm("Delete this message from community logs?")) return;
    socket.send(JSON.stringify({
      type: "admin_mod_action",
      action: "DeleteMessage",
      channelId: activeChannelId,
      messageId
    }));
  };

  const handleAdminClearHistory = () => {
    if (!socket || !window.confirm("⚠️ INSTANT PURGE WARNING: Clear ALL message history in this regional chat segment? This is final.")) return;
    socket.send(JSON.stringify({
      type: "admin_mod_action",
      action: "ClearChannel",
      channelId: activeChannelId
    }));
  };

  const handleAdminTogglePin = (message: WorldChatMessage) => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: "pin_chat_message",
      channelId: activeChannelId,
      messageId: message.id,
      pin: !message.pinned
    }));
  };

  const handleFilterConfigPush = (newConfig: ChatFilterConfig) => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: "update_filter_config",
      config: newConfig
    }));
  };

  // Add severe keyword route
  const handleAddSevereKeyword = (wordInput: string) => {
    if (!wordInput.trim()) return;
    const updated = [...filterConfig.severeWords, wordInput.trim().toLowerCase()];
    const latest = { ...filterConfig, severeWords: Array.from(new Set(updated)) };
    setFilterConfig(latest);
    handleFilterConfigPush(latest);
  };

  const handleRemoveSevereKeyword = (word: string) => {
    const updated = filterConfig.severeWords.filter(w => w !== word);
    const latest = { ...filterConfig, severeWords: updated };
    setFilterConfig(latest);
    handleFilterConfigPush(latest);
  };

  const currentChannelMessages = messages[activeChannelId] || [];
  const pinnedList = currentChannelMessages.filter(m => m.pinned);

  // Helper colors for user tags matching high-fidelity systems
  const getBadgeStyle = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-red-950/40 text-red-500 border border-red-500/40 font-bold";
      case "Head Admin":
      case "Admin":
        return "bg-amber-950/40 text-amber-500 border border-amber-500/30 font-bold";
      case "Moderator":
        return "bg-purple-950/40 text-purple-400 border border-purple-900/40 font-semibold";
      case "Team Captain":
        return "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 font-semibold";
      default:
        return "bg-zinc-900 text-zinc-400 border border-zinc-800";
    }
  };

  return (
    <div 
      style={{ height: mobileHeightStyle }}
      className={`bg-[#0B0B0C] border border-gray-850 rounded-2xl p-0 shadow-[0_22px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${mobileHeightStyle ? "" : "h-[calc(100dvh-130px)] min-h-[500px] max-h-[850px]"} text-zinc-100 font-sans`}
    >
      
      {/* SECTION TOP COMPLICANCE HEADER BAR */}
      <div className="bg-[#111113] border-b border-gray-850 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-650/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wider uppercase font-mono">CV GLOBAL CHAT TERMINAL</h2>
              <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-black rounded ${isConnected ? "bg-emerald-950/65 text-emerald-450 border border-emerald-500/30" : "bg-red-950/50 text-red-500 border border-red-900/20"}`}>
                ● {isConnected ? "LIVE REAL-TIME CONNECTED" : "OFFLINE COGNITIVE SYNC"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Collaborative social hub communicating with players across {CHANNELS.length} regional sectors.</p>
          </div>
        </div>

        {/* User reputation tracking preview */}
        <div className="flex items-center gap-3 bg-black/45 border border-gray-850 p-2.5 rounded-xl text-xs">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-zinc-500 text-[9px] uppercase font-bold">REPUTATION</span>
              <span className={`font-mono text-xs font-bold ${reputationState.score > 80 ? "text-emerald-400" : reputationState.score > 50 ? "text-amber-400" : "text-red-500"}`}>
                {reputationState.score}/100
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex justify-end gap-1.5 mt-0.5">
              <span>Level <strong className="text-red-500 font-bold">{reputationState.level}</strong></span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 uppercase font-black">{session.role}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-650 flex items-center justify-center font-bold text-lg select-none border border-red-500/30">
            {session.role === "Owner" ? "🎯" : session.role === "Head Admin" || session.role === "Admin" ? "👑" : "🛡️"}
          </div>
        </div>
      </div>

      {/* CORE FRAMEWORK SPLIT CONTAINER */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        
        {/* LEFT COLUMN: CHANNELS NAVIGATION SELECTOR */}
        <div className="w-64 bg-[#0F0F11] border-r border-gray-850 flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-gray-850/55">
            <span className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-widest font-mono">
              ACTIVE SECTOR SEGMENTS
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
            {CHANNELS.map((chan) => {
              const Icon = chan.icon;
              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`w-full text-left py-2.5 px-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                    activeChannelId === chan.id 
                      ? "bg-red-650/15 border border-red-500/30 text-white font-semibold" 
                      : "text-zinc-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={14} className={activeChannelId === chan.id ? "text-red-500 animate-pulse" : "text-zinc-500 group-hover:text-red-400"} />
                    <div className="truncate text-left">
                      <p className="text-xs font-bold leading-none">{chan.name}</p>
                      <span className="text-[9px] text-zinc-500 leading-none">{chan.category}</span>
                    </div>
                  </div>
                  {activeChannelId === chan.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff001c]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-black/35 border-t border-gray-850/60 mt-auto text-[11px] text-zinc-400 space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>ONLINE CHANNELS</span>
              <span>8 / 8 ACTIVE</span>
            </div>
            <p className="text-[10px] leading-snug">Choose your sector to converse regionally. Auto-moderation protects community channels live.</p>
          </div>
        </div>

        {/* MIDDLE COLUMN: REAL-TIME BROADCAST MESSAGE STREAM */}
        <div className="flex-1 flex flex-col bg-[#0B0B0C] relative min-w-0 min-h-0 overflow-hidden">
          
          {/* Mobile Channel Picker Switcher */}
          <div className="p-2 border-b border-gray-850 flex md:hidden gap-1 overflow-x-auto bg-[#0F0F11] shrink-0">
            {CHANNELS.map(chan => (
              <button
                key={chan.id}
                onClick={() => setActiveChannelId(chan.id)}
                className={`py-1.5 px-3 rounded-md text-[10px] uppercase font-mono tracking-wider font-extrabold shrink-0 border ${activeChannelId === chan.id ? "bg-red-650 border-red-500 text-white" : "bg-black/35 border-zinc-800 text-zinc-400"}`}
              >
                {chan.id.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* PINNED STAFF ANNOUNCEMENTS DRAWER SECTION */}
          {pinnedList.length > 0 && (
            <div className="bg-amber-950/10 border-b border-amber-500/20 p-3 px-5 flex items-start gap-3 shrink-0">
              <Pin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1 min-w-0 text-xs">
                <span className="text-[9px] text-amber-500 tracking-widest uppercase font-mono font-bold block">PINNED REGIONAL ANNOUNCEMENT</span>
                <p className="text-zinc-300 font-sans italic line-clamp-2 mt-0.5">
                  &ldquo;{pinnedList[pinnedList.length - 1].text}&rdquo; – <span className="text-amber-500 font-bold">{pinnedList[pinnedList.length - 1].senderIgn}</span>
                </p>
              </div>
              <button 
                onClick={() => setSystemAlertMessage("NOTICE: Staff bulletins are archived in the News room.")}
                className="text-zinc-500 hover:text-white text-[10px] underline shrink-0 uppercase font-mono font-bold"
              >
                View Bulletins ({pinnedList.length})
              </button>
            </div>
          )}

          {/* CORE MESSAGES CONTAINER STREAM - INDEPENDENT SCROLL AREA */}
          <div 
            ref={chatMessagesContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#110B0B] via-[#0B0B0C] to-[#0A0A0A]"
          >
            {currentChannelMessages.filter(m => !(m.system && (m as any).adminOnly && !isStaff)).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 text-xl shadow-lg">
                  💬
                </div>
                <div>
                  <h4 className="text-sm font-mono font-bold tracking-wider text-zinc-200 uppercase">No messages yet</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              currentChannelMessages.filter(m => !(m.system && (m as any).adminOnly && !isStaff)).map((msg) => {
                const isMyMessage = msg.senderIgn === session.ign;
                const badges = getBadgeStyle(msg.senderRole);

                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 group items-start transition-all relative ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}
                  >
                    
                    {/* AVATAR CLICK PREVIEW */}
                    <button 
                      onClick={() => setSelectedProfileCard({
                        ign: msg.senderIgn,
                        role: msg.senderRole,
                        avatar: msg.senderAvatar,
                        verified: msg.senderVerified,
                        level: msg.senderLevel,
                        reputation: msg.senderReputation
                      })}
                      className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-855 border border-gray-800 flex items-center justify-center text-xl shrink-0 cursor-pointer shadow-md select-none transition-transform active:scale-95"
                    >
                      {msg.senderAvatar || "👤"}
                    </button>

                    {/* CORRESPONDING BUBBLE CARD SECTION */}
                    <div className={`max-w-[70%] space-y-1.5 flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}>
                      
                      {/* SENDER INFO BANNER */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span 
                          onClick={() => {
                            setSelectedProfileCard({
                              ign: msg.senderIgn,
                              role: msg.senderRole,
                              customTitle: msg.senderCustomTitle,
                              avatar: msg.senderAvatar,
                              verified: msg.senderVerified,
                              level: msg.senderLevel,
                              reputation: msg.senderReputation
                            });
                            setCustomTitleInput(msg.senderCustomTitle || "");
                            setCustomTitleError("");
                            setEditingCustomTitle(false);
                          }}
                          className="text-xs font-black hover:text-red-400 cursor-pointer"
                        >
                          {msg.senderIgn}
                        </span>
                        
                        <span className={`px-1.5 py-0.5 text-[8px] tracking-wider rounded font-mono uppercase font-black ${badges}`}>
                          {msg.senderRole}
                        </span>

                        {msg.senderCustomTitle && (
                          <span className="px-1.5 py-0.5 text-[8px] tracking-wider rounded font-mono uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 shadow-sm" title="Cosmetic Custom Title (No Permissions)">
                            <Sparkles size={8} className="text-amber-400 shrink-0" />
                            <span>{msg.senderCustomTitle}</span>
                          </span>
                        )}

                        {msg.senderVerified && (
                          <span className="w-3.5 h-3.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[8px] rounded flex items-center justify-center font-bold" title="Verified Champion ID">
                            ✓
                          </span>
                        )}

                        <span className="text-[9px] text-zinc-500 font-mono">
                          Lvl {msg.senderLevel}
                        </span>

                        <span className="text-[9px] text-zinc-400 font-mono scale-90">
                          ({msg.senderReputation} Rep)
                        </span>

                        <span className="text-[8px] text-zinc-650 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {msg.pinned && (
                          <Pin className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                        )}
                      </div>

                      {/* REPLY HEADER PREVIEW INDICATOR */}
                      {msg.replyTo && (
                        <div className="bg-black/45 border border-zinc-850 px-3 py-1 text-[10px] text-zinc-400 italic rounded-md select-none flex items-center gap-1.5 w-max">
                          <Reply className="w-3 h-3 text-zinc-500" />
                          <span>Replying to <strong className="text-zinc-300 font-semibold">@{msg.replyTo.sender}</strong>: &ldquo;{msg.replyTo.text}&rdquo;</span>
                        </div>
                      )}

                      {/* THE TEXT BODY / MEDIA DISPLAY CARD */}
                      <div className={`rounded-2xl p-3.5 text-xs font-sans shadow-lg ${
                        msg.system 
                          ? "bg-red-950/20 text-red-300 border border-red-900/40 w-full" 
                          : isMyMessage 
                            ? "bg-[#18181B] text-white border border-[#27272A]" 
                            : "bg-[#0B0B0C] text-zinc-200 border border-gray-850"
                      }`}>
                        
                        <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.text}</p>

                        {/* ATTACHED IMAGES PREVIEW */}
                        {msg.imageUrl && (
                          <div className="mt-3 overflow-hidden rounded-lg max-w-sm border border-zinc-815">
                            <img src={msg.imageUrl} alt="chat-shared-media" className="w-full object-cover max-h-56" referrerPolicy="no-referrer" />
                          </div>
                        )}

                        {/* ATTACHED SIMULATED GIF PREVIEW */}
                        {msg.gifUrl && (
                          <div className="mt-2 overflow-hidden rounded-lg max-w-xs border border-zinc-800">
                            <img src={msg.gifUrl} alt="chat-shared-gif" className="w-full object-cover max-h-48" referrerPolicy="no-referrer" />
                          </div>
                        )}

                        {/* THE INTERACTIVE COMMUNITY POLL MODULE */}
                        {msg.poll && (
                          <div className="mt-3 bg-black/45 border border-gray-850 rounded-xl p-3.5 space-y-2 max-w-md w-72 md:w-80">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-gray-850/60 mb-2">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider">ACTIVE BALLOT</span>
                            </div>
                            <p className="text-[11px] font-black tracking-wide text-zinc-200 uppercase">{msg.poll.question}</p>
                            
                            <div className="space-y-2 pt-1 text-[11px]">
                              {msg.poll.options.map((opt: any, index: number) => {
                                const hasUserVoted = opt.votes.includes(session.ign);
                                const totalVotes = msg.poll.options.reduce((sum: number, o: any) => sum + o.votes.length, 0) || 1;
                                const percentage = Math.round((opt.votes.length / totalVotes) * 100);

                                return (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      if (session.role === "Guest") {
                                        setSystemAlertMessage("🚫 Guest Read-Only: Guests cannot vote on active community ballot polls.");
                                        return;
                                      }
                                      socket?.send(JSON.stringify({
                                        type: "vote_poll",
                                        channelId: activeChannelId,
                                        messageId: msg.id,
                                        optionIndex: index,
                                        ign: session.ign
                                      }));
                                    }}
                                    className="w-full text-left p-2.5 rounded-lg border border-gray-850/80 hover:border-zinc-700 bg-neutral-900/60 relative overflow-hidden transition-all duration-300 pointer-events-auto"
                                  >
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 bg-red-650/15 transition-all duration-550" 
                                      style={{ width: `${percentage}%` }}
                                    />
                                    <div className="relative flex justify-between items-center z-10 font-bold">
                                      <span className="truncate flex items-center gap-2">
                                        {hasUserVoted && <span className="text-emerald-400">●</span>}
                                        {opt.text}
                                      </span>
                                      <span className="text-[10px] text-zinc-400 font-mono">{opt.votes.length} ({percentage}%)</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* REACTIONS RENDERS & HOVER INTERACTIONS ROW */}
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        
                        {/* Render Active reactions */}
                        {msg.reactions && Object.entries(msg.reactions as Record<string, string[]>).map(([emo, igns]) => {
                          const userHasReacted = (igns as string[]).includes(session.ign);
                          return (
                            <button
                              key={emo}
                              onClick={() => handleAddEmojiReaction(msg.id, emo)}
                              className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${
                                userHasReacted 
                                  ? "bg-red-950/45 border-red-500 text-[#FFD700]" 
                                  : "bg-black/30 border-gray-850 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <span>{emo}</span>
                              <span className="font-mono scale-90 text-[9px] font-bold text-zinc-400">{(igns as string[]).length}</span>
                            </button>
                          );
                        })}

                        {/* HOVER UTILITIES CONTROL PANEL FOR MESSAGES */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-black/85 border border-gray-850/70 rounded-lg px-1.5 py-0.5 ml-2 gap-1.5 shadow-lg select-none">
                          <button 
                            onClick={() => setReplyToMsg(msg)}
                            className="p-1 text-zinc-400 hover:text-white rounded transition-colors"
                            title="Reply to message"
                          >
                            <Reply size={12} />
                          </button>
                          
                          {/* Quick Reactions bar */}
                          {["🔥", "👑", "💀", "👀"].map(emo => (
                            <button
                              key={emo}
                              onClick={() => handleAddEmojiReaction(msg.id, emo)}
                              className="text-xs hover:scale-125 transition-transform"
                            >
                              {emo}
                            </button>
                          ))}

                          {/* Report Flag */}
                          {!isMyMessage && (
                            <button 
                              onClick={() => {
                                setReportedMessage(msg);
                                setReportReason("");
                              }}
                              className="p-1 text-zinc-500 hover:text-red-400 rounded transition-colors"
                              title="Report User violation"
                            >
                              <Flag size={11} />
                            </button>
                          )}

                          {/* Admin Controls */}
                          {isStaff && (
                            <>
                              <button 
                                onClick={() => handleAdminTogglePin(msg)}
                                className={`p-1 rounded transition-colors ${msg.pinned ? "text-amber-400" : "text-zinc-500 hover:text-amber-400"}`}
                                title={msg.pinned ? "Unpin banner" : "Pin announcement banner"}
                              >
                                <Pin size={11} />
                              </button>
                              <button 
                                onClick={() => handleAdminMessagePurge(msg.id)}
                                className="p-1 text-zinc-500 hover:text-red-500 rounded transition-colors"
                                title="Delete message"
                              >
                                <Trash2 size={11} />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedAdminUserTab(msg.senderIgn);
                                  setIsAdminPanelOpen(true);
                                }}
                                className="p-1 text-zinc-500 hover:text-amber-500 rounded transition-colors"
                                title="Admin profiles control block"
                              >
                                <ShieldAlert size={11} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
            <div ref={listEndRef} />
          </div>

          {/* ACTIVE REPLY OVERLAY FLOATER */}
          {replyToMsg && (
            <div className="bg-[#111113] border-t border-gray-850 p-3 px-5 flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Reply className="w-4 h-4 text-red-500 shrink-0" />
                <span>Replying to <strong className="text-red-400 font-bold">@{replyToMsg.senderIgn}</strong>: &ldquo;{replyToMsg.text}&rdquo;</span>
              </div>
              <button 
                onClick={() => setReplyToMsg(null)}
                className="w-5 h-5 bg-neutral-900 hover:bg-neutral-800 rounded-full flex items-center justify-center text-xs ml-2 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* WORLD CHAT COMPOSER FORM VIEW - PERMANENTLY VISIBLE STICKY FOOTER */}
          <div className="bg-[#0F0F11] border-t border-gray-850 p-3 sm:p-4 shrink-0 space-y-2 sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 items-center">
              
              {/* Extra tools panel buttons */}
              <div className="flex items-center gap-1 bg-black/45 border border-zinc-850 rounded-xl p-1 shrink-0">
                
                {/* Image Uploader paste mock button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsImagePickerOpen(!isImagePickerOpen);
                    setIsEmojiPickerOpen(false);
                    setIsGifPickerOpen(false);
                  }}
                  className={`p-2 sm:p-2.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer ${isImagePickerOpen ? "bg-red-950/40 text-red-400 border border-red-900/40" : "text-zinc-400"}`}
                  title="Share tactical media map"
                >
                  <ImageIcon size={16} />
                </button>

                {/* Simulated GIF selector */}
                <button
                  type="button"
                  onClick={() => {
                    setIsGifPickerOpen(!isGifPickerOpen);
                    setIsEmojiPickerOpen(false);
                    setIsImagePickerOpen(false);
                  }}
                  className={`p-2 sm:p-2.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer ${isGifPickerOpen ? "bg-red-950/40 text-red-400 border border-red-900/40" : "text-zinc-400"}`}
                  title="Post action GIFs"
                >
                  <span className="text-[10px] font-black tracking-tighter leading-none border border-current px-0.5 rounded">GIF</span>
                </button>

                {/* Simple Emoji trigger selector */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEmojiPickerOpen(!isEmojiPickerOpen);
                    setIsGifPickerOpen(false);
                    setIsImagePickerOpen(false);
                  }}
                  className={`p-2 sm:p-2.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer ${isEmojiPickerOpen ? "bg-red-950/40 text-red-400 border border-red-900/40" : "text-zinc-400"}`}
                  title="Pick chat emojis"
                >
                  <Smile size={16} />
                </button>

                {/* Poll Creator */}
                {(session.verified || isStaff) && (
                  <button
                    type="button"
                    onClick={() => setIsPollCreatorOpen(!isPollCreatorOpen)}
                    className="p-2 sm:p-2.5 rounded-lg hover:bg-neutral-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Create community poll ballot"
                  >
                    <Sliders size={15} />
                  </button>
                )}
              </div>

              {/* INPUT MESSAGE BAR */}
              <div className="flex-1 relative min-w-0">
                <input
                  type="text"
                  value={inputText}
                  disabled={session.role === "Guest"}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={session.role === "Guest" ? "🚫 READ-ONLY STATE: Assign profile credentials to chat." : "Commence transmission... Use @username to mention active players."}
                  className="w-full bg-black/45 border border-gray-850 focus:border-red-650 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs outline-none transition-all placeholder-zinc-550 leading-relaxed disabled:opacity-50"
                />
              </div>

              {/* DISPATCH ACTION */}
              <button
                type="submit"
                disabled={session.role === "Guest" || !inputText.trim() || isSending}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-red-650 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-650 text-white font-mono uppercase font-black tracking-widest text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shrink-0 shadow-lg shadow-red-950/30"
              >
                <span>{isSending ? "SENDING..." : "TRANSMIT"}</span>
                <Send size={12} className={isSending ? "animate-pulse" : ""} />
              </button>

            </form>

            {/* BOTTOM ALERT WARNING FOR TIMEOUT CHECKS */}
            {reputationState.muteExpiresAt && (
              <p className="text-[10px] text-red-400 font-mono text-center flex items-center gap-1.5 justify-center bg-red-950/15 p-1 border border-red-900/30 rounded">
                <AlertTriangle size={11} className="animate-pulse" />
                SECURITY PROTOCOLS IN EFFECT: Temporary mute restrictions registered on this profile.
              </p>
            )}
          </div>

          {/* EMOJI PICKER OVERLAY FLOATER */}
          {isEmojiPickerOpen && (
            <div className="absolute bottom-20 left-4 bg-[#111113] border border-gray-850 p-3 rounded-xl shadow-2xl flex gap-2 flex-wrap max-w-xs z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {["🏆", "🔥", "👑", "💀", "👀", "👍", "❤️", "😮", "🛡️", "🤝", "💥", "🎯", "🤖", "⚔️", "🍿", "🚀"].map(emo => (
                <button
                  type="button"
                  key={emo}
                  onClick={() => replyToMsg ? handleAddEmojiReaction(replyToMsg.id, emo) : setInputText(p => p + emo)}
                  className="w-8 h-8 flex items-center justify-center bg-zinc-900 hover:bg-neutral-800 rounded text-sm transition-transform hover:scale-120 cursor-pointer"
                >
                  {emo}
                </button>
              ))}
            </div>
          )}

          {/* PRESENCE GIF SELECTION DRAWER */}
          {isGifPickerOpen && (
            <div className="absolute bottom-21 left-16 bg-[#111113] border border-gray-850 p-4 rounded-xl shadow-2xl max-w-sm w-96 flex flex-col gap-3 z-50 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-gray-850/60 text-xs">
                <span className="font-mono text-zinc-400 font-bold uppercase tracking-wider">CHOOSE ESPORTS EVENT GIF</span>
                <button onClick={() => setIsGifPickerOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <div className="flex gap-2 relative bg-black/35 rounded-lg px-2 py-1 items-center">
                <Search size={12} className="text-zinc-500" />
                <input 
                  type="text" 
                  value={gifSearchKey} 
                  onChange={(e) => setGifSearchKey(e.target.value)} 
                  placeholder="Query action tags (eg clutch, winning, gg)..." 
                  className="bg-transparent text-[11px] border-none outline-none flex-1 text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin p-1">
                {MOCK_GIFS.filter(g => g.tag.includes(gifSearchKey.toLowerCase())).map(gif => (
                  <button
                    type="button"
                    key={gif.id}
                    onClick={() => handleSendGIF(gif.url)}
                    className="p-1.5 rounded-lg bg-neutral-900/50 hover:bg-neutral-900 border border-zinc-910 hover:border-red-800 transition-all text-left flex flex-col gap-1.5 group cursor-pointer"
                  >
                    <img src={gif.url} alt={gif.name} className="w-full h-20 object-cover rounded" referrerPolicy="no-referrer" />
                    <span className="text-[9px] text-zinc-400 truncate group-hover:text-red-400">{gif.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRESENCE STRATEGIC IMAGES PICKER DRAWER */}
          {isImagePickerOpen && (
            <div className="absolute bottom-21 left-10 bg-[#111113] border border-gray-850 p-4 rounded-xl shadow-2xl max-w-sm w-80 flex flex-col gap-3 z-50 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-gray-850/60 text-xs text-zinc-300">
                <span className="font-mono text-zinc-400 font-bold uppercase tracking-wider">SHARE ANALYSIS MEDIA</span>
                <button onClick={() => setIsImagePickerOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <p className="text-[10px] text-zinc-550 leading-snug">Attach vector graphic designs directly into global regional segments to assist roster coordination.</p>
              
              <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin">
                {MOCK_MEDIA_UPLOADS.map((media, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleSendImageMedia(media.url)}
                    className="w-full p-2 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-zinc-850 hover:border-red-900 text-left flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <img src={media.url} alt={media.name} className="w-12 h-12 object-cover rounded" referrerPolicy="no-referrer" />
                    <span className="text-[10px] font-mono uppercase tracking-wide font-extrabold text-zinc-300 truncate">{media.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* POLL CREATOR DRAWER CONTENT */}
          {isPollCreatorOpen && (
            <div className="absolute top-20 right-4 left-4 md:right-auto md:left-4 bg-[#111113] border border-gray-850 p-4 rounded-xl shadow-2xl z-50 max-w-md w-92 animate-in fade-in duration-250">
              <div className="flex justify-between items-center pb-2 border-b border-gray-850/60 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">BUILD COMMUNITY BALLOT</span>
                <button onClick={() => setIsPollCreatorOpen(false)} className="text-zinc-500 hover:text-white text-xs">✕</button>
              </div>

              <form onSubmit={handleCreatePollMessage} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 uppercase font-black tracking-wider text-[9px] mb-1">BALLOT VOTE QUESTION</label>
                  <input
                    type="text"
                    required
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="e.g., Which drop zone is prime for Erangel qualifiers?"
                    className="w-full bg-black/45 border border-zinc-800 rounded p-2 text-xs text-zinc-300 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-zinc-400 uppercase font-black tracking-wider text-[9px]">CHOICES ROUTING</label>
                  {pollChoices.map((choice, i) => (
                    <input
                      key={i}
                      type="text"
                      required={i < 2}
                      value={choice}
                      onChange={(e) => {
                        const updated = [...pollChoices];
                        updated[i] = e.target.value;
                        setPollChoices(updated);
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="w-full bg-black/45 border border-zinc-800 rounded p-2 text-xs text-zinc-300 outline-none"
                    />
                  ))}
                </div>

                <div className="flex gap-2 justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setPollChoices(prev => [...prev, ""])}
                    className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-red-500 hover:text-red-400"
                  >
                    + Add option slot
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-650 hover:bg-red-650/90 text-white rounded font-mono uppercase font-black text-[10px]"
                  >
                    DISPATCH POLL BALLOT
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: WORLD CHAT SIDEBAR (ONLINE USERS + STREAMERS + METRICS ARCHIVE) */}
        <div className="w-64 bg-[#0F0F11] border-l border-gray-850 flex flex-col shrink-0 hidden lg:flex">
          
          {/* ONLINE USERS PANEL */}
          <div className="p-4 border-b border-gray-850/50 flex justify-between items-center bg-black/20">
            <span className="text-[10px] text-zinc-500 uppercase font-extrabold tracking-widest font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              ONLINE WARRIORS ({onlineUsers.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {onlineUsers.map((user, i) => (
              <button
                key={i}
                onClick={() => setSelectedProfileCard(user)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900/30 hover:bg-neutral-900 border border-transparent hover:border-gray-850 transition-all text-left group cursor-pointer"
              >
                <div className="w-7 h-7 bg-zinc-950 border border-gray-850 rounded-lg flex items-center justify-center text-sm relative shrink-0">
                  {user.avatar || "👤"}
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F0F11] rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-none text-zinc-200 truncate group-hover:text-red-400">{user.ign}</p>
                  <span className="text-[9px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    {user.role} Lvl {user.level}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ACTIVE STREAMERS SECTION */}
          <div className="p-3.5 border-t border-gray-850/50 bg-black/15">
            <span className="text-[10px] text-red-500 uppercase font-black tracking-widest font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              LIVE STREAM CHANNELS
            </span>
            <div className="space-y-2.5 mt-3">
              {streamers.map((stream, x) => (
                <a
                  key={x}
                  href={stream.link}
                  className="block p-2 rounded-lg bg-[#111113] border border-gray-850/60 hover:border-red-900/50 transition-all text-xs"
                >
                  <div className="flex justify-between items-center pb-1">
                    <span className="font-extrabold tracking-wider text-[10px] text-zinc-300">{stream.name}</span>
                    <span className="px-1.5 py-0.5 bg-red-950/40 border border-red-500/30 text-red-400 text-[8px] font-mono rounded">
                      ● {stream.viewers} VIEWERS
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate leading-snug">{stream.title}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-850 bg-[#0B0B0C] space-y-2.5">
            {isStaff && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="w-full py-2 bg-zinc-950 hover:bg-neutral-900 border border-zinc-800 hover:border-amber-600/40 rounded-xl text-[10px] font-mono uppercase font-black tracking-wider text-amber-500 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Shield size={12} className="animate-pulse" />
                STAFF CONTROL CENTER
              </button>
            )}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase justify-center">
              <span>SECURITY CERTIFIED BY</span>
              <span className="text-red-500">CV SENTINEL v5.1</span>
            </div>
          </div>

        </div>

      </div>

      {/* OVERLAY: COMMUNITY USER PROFILE OVERLAY MODAL */}
      {selectedProfileCard && (
        <div className="fixed inset-0 bg-black/75 z-55 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111113] border border-gray-850 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setSelectedProfileCard(null)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="flex flex-col items-center justify-center text-center space-y-2 pb-3 border-b border-gray-850/60">
              <div className="w-16 h-16 bg-neutral-900 border-2 border-red-500/30 rounded-2xl flex items-center justify-center text-4xl select-none">
                {selectedProfileCard.avatar || "👤"}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-sm font-black tracking-wider uppercase font-mono">{selectedProfileCard.ign}</h3>
                  {selectedProfileCard.verified && (
                    <span className="px-1 py-0.5 bg-sky-500/10 border border-sky-400/30 text-sky-400 text-[8px] rounded uppercase font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>

                {/* ROLE VS CUSTOM TITLE: Distinct visual separation */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-red-950/40 border border-red-500/30 text-red-400 text-[9px] font-mono uppercase font-black rounded" title="Verified System Role">
                    ROLE: {selectedProfileCard.role}
                  </span>
                  {selectedProfileCard.customTitle ? (
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono uppercase font-bold rounded flex items-center gap-1" title="Cosmetic Title (No elevated permissions)">
                      <Sparkles size={9} className="text-amber-400" />
                      {selectedProfileCard.customTitle}
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-500 font-mono italic">No custom title</span>
                  )}
                </div>
              </div>
            </div>

            {/* IF VIEWING OWN PROFILE: INTERACTIVE CUSTOM TITLE EDITOR */}
            {selectedProfileCard.ign === session.ign && (
              <div className="p-3 bg-black/40 border border-zinc-800/80 rounded-xl space-y-2.5 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase font-black text-amber-400 flex items-center gap-1.5">
                    <Sparkles size={11} /> CUSTOM PROFILE TITLE
                  </span>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase">COSMETIC LABEL</span>
                </div>
                
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Personalize your public esports title (e.g. Pro Player, Sniper, Elite Gamer). Titles never grant permissions or alter account role. Reserved administrative titles are strictly protected.
                </p>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-bold block">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "Pro Player",
                      "Esports Competitor",
                      "Sniper",
                      "Team Captain",
                      "Tournament Champion",
                      "Content Creator",
                      "Elite Gamer"
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setCustomTitleInput(preset);
                          setCustomTitleError("");
                        }}
                        className={`px-2 py-0.5 text-[9px] font-mono rounded border transition-colors cursor-pointer ${
                          customTitleInput === preset
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>EDIT TITLE</span>
                    <span>{customTitleInput.length}/24 chars</span>
                  </div>
                  <input
                    type="text"
                    value={customTitleInput}
                    maxLength={24}
                    onChange={(e) => {
                      setCustomTitleInput(e.target.value);
                      setCustomTitleError("");
                    }}
                    placeholder="e.g. Sniper, Pro Player, Elite Gamer"
                    className="w-full bg-black border border-zinc-850 rounded p-2 text-xs font-mono text-zinc-200 outline-none focus:border-amber-500"
                  />
                </div>

                {customTitleError && (
                  <div className="p-2 bg-red-950/40 border border-red-500/40 rounded text-[10px] text-red-300 leading-snug font-sans">
                    ⚠️ {customTitleError}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSavingTitle}
                    onClick={async () => {
                      setIsSavingTitle(true);
                      setCustomTitleError("");
                      try {
                        const res = await fetch("/api/user/custom-title", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ ign: session.ign, customTitle: customTitleInput })
                        });
                        const data = await res.json();
                        if (!res.ok || !data.valid) {
                          setCustomTitleError(data.error || "Failed to update custom title.");
                          setSystemAlertMessage(`🚫 Title Rejected: ${data.error}`);
                        } else {
                          session.customTitle = data.customTitle;
                          setSelectedProfileCard((prev: any) => prev ? { ...prev, customTitle: data.customTitle } : null);
                          setSystemAlertMessage(`✨ ${data.message}`);
                          if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({
                              type: "update_custom_title",
                              customTitle: data.customTitle
                            }));
                          }
                        }
                      } catch (err: any) {
                        setCustomTitleError("Network error updating title.");
                      } finally {
                        setIsSavingTitle(false);
                      }
                    }}
                    className="flex-1 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase font-bold rounded cursor-pointer transition-colors"
                  >
                    {isSavingTitle ? "Saving..." : "Save Title"}
                  </button>
                  {customTitleInput && (
                    <button
                      type="button"
                      disabled={isSavingTitle}
                      onClick={async () => {
                        setCustomTitleInput("");
                        setCustomTitleError("");
                        setIsSavingTitle(true);
                        try {
                          const res = await fetch("/api/user/custom-title", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ign: session.ign, customTitle: "" })
                          });
                          const data = await res.json();
                          session.customTitle = "";
                          setSelectedProfileCard((prev: any) => prev ? { ...prev, customTitle: "" } : null);
                          setSystemAlertMessage("✨ Custom title cleared.");
                          if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({
                              type: "update_custom_title",
                              customTitle: ""
                            }));
                          }
                        } catch (e) {
                          setCustomTitleError("Error clearing title.");
                        } finally {
                          setIsSavingTitle(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-[10px] uppercase rounded cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-black/35 border border-gray-850 p-2.5 rounded-xl space-y-1">
                <span className="text-[9px] text-zinc-550 block uppercase font-bold">REPUTATION DEGREE</span>
                <p className="text-xs font-black text-white">{selectedProfileCard.reputation || 90} / 100</p>
              </div>
              <div className="bg-black/35 border border-gray-850 p-2.5 rounded-xl space-y-1">
                <span className="text-[9px] text-zinc-550 block uppercase font-bold">COMMUNITY LEVEL</span>
                <p className="text-xs font-black text-red-500">Level {selectedProfileCard.level || "8"}</p>
              </div>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>COMMUNITY PARTICIPATION</span>
                <span className="text-emerald-400">EXCELLENT RATING</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">This player exhibits optimal conduct in regional scrims and tournaments across Erangel sectors, upholding standard CV rules.</p>
            </div>

            <div className="pt-2 flex gap-3 text-xs justify-end">
              {isStaff && selectedProfileCard.ign !== session.ign && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAdminUserTab(selectedProfileCard.ign);
                    setIsAdminPanelOpen(true);
                    setSelectedProfileCard(null);
                  }}
                  className="px-3.5 py-1.5 bg-amber-950/20 hover:bg-amber-900/25 border border-amber-500/30 text-amber-500 rounded-lg text-[10px] uppercase font-mono"
                >
                  Admin Action Lock
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedProfileCard(null)}
                className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-lg text-[10px] uppercase font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: USER MESSAGE REPORT VIOLATION DIALOG */}
      {reportedMessage && (
        <div className="fixed inset-0 bg-black/75 z-55 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111113] border border-gray-850 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative text-xs">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">🛡️ SUBMIT VIOLATION REPORT</h3>
            <p className="text-zinc-400">Send an automated message flag to active staff moderators indicating specific policy breaches in chat.</p>
            
            <div className="p-3 bg-black/35 border border-gray-850 rounded-lg">
              <span className="text-[9px] text-zinc-550 uppercase font-black tracking-wider block">TARGET COMMENT ID</span>
              <p className="text-xs font-bold text-red-400 mt-1">@{reportedMessage.senderIgn}</p>
              <p className="text-[11px] text-zinc-400 italic mt-1 font-sans font-medium line-clamp-2">&ldquo;{reportedMessage.text}&rdquo;</p>
            </div>

            <form onSubmit={handleMessageReportSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-zinc-450 uppercase font-black text-[9px] tracking-wider mb-1.5">REASON FOR REPORT ACTION</label>
                <select
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-zinc-300 outline-none focus:border-red-500"
                >
                  <option value="">-- Choose Violation Type --</option>
                  <option value="Hate speech/harassment">Hate Speech & Verbal Harassment</option>
                  <option value="Spam / Bot scams links">Bot Spam & Fake Scam Links</option>
                  <option value="Impersonation / Toxicity">Impersonation Attempt</option>
                  <option value="Excessive profanity/Hostility">Excessive Unsensored Profanity</option>
                  <option value="Severe threats / Doxing">Severe Hostile Threat</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setReportedMessage(null)}
                  className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!reportReason}
                  className="px-4 py-2 bg-red-650 hover:bg-red-600 font-extrabold text-white"
                >
                  FILE COMPLIANCE REPORT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY: ADMINISTRATIVE STAFF PANEL MODAL */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 bg-black/85 z-55 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111113] border border-gray-850 rounded-2xl p-6 max-w-4xl w-full space-y-6 shadow-2xl relative text-xs">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-850/60">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-amber-500" />
                <h2 className="text-sm font-black tracking-wider uppercase font-mono">CV ADMINISTRATIVE CONTROL CENTER</h2>
              </div>
              <button onClick={() => setIsAdminPanelOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            {/* Admin actions container - GRID view */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[500px] overflow-y-auto scrollbar-thin p-1">
              
              {/* TARGET USER CARD CONFIG (COL 5) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] text-zinc-550 block font-mono font-bold uppercase tracking-wider">MANAGE SELECTED MEMBER ACCESS</span>
                
                <div className="space-y-3.5 bg-black/35 border border-gray-850 p-4 rounded-xl">
                  <div>
                    <label className="block text-zinc-500 uppercase font-black text-[9px] mb-1.5">MUTABLE USER SELECT</label>
                    <select
                      value={selectedAdminUserTab || ""}
                      onChange={(e) => setSelectedAdminUserTab(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-zinc-350 outline-none"
                    >
                      <option value="">-- Active Users --</option>
                      {onlineUsers.map((u, o) => (
                        <option key={o} value={u.ign}>{u.ign} ({u.role})</option>
                      ))}
                    </select>
                  </div>

                  {selectedAdminUserTab && (
                    <>
                      <div>
                        <label className="block text-zinc-500 uppercase font-black text-[9px] mb-1.5">REASON SPECIFICATION</label>
                        <input
                          type="text"
                          value={adminReasonInput}
                          onChange={(e) => setAdminReasonInput(e.target.value)}
                          placeholder="Decorum or toxic language violation."
                          className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-zinc-300 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-zinc-500 uppercase font-black text-[9px] mb-1.5">MUTE DURATION</label>
                          <select
                            value={adminMuteDuration}
                            onChange={(e) => setAdminMuteDuration(Number(e.target.value))}
                            className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-zinc-300 outline-none"
                          >
                            <option value={5}>5 minutes</option>
                            <option value={15}>15 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={1440}>24 hours</option>
                          </select>
                        </div>
                        <div className="flex items-end gap-1 font-mono text-[9px]">
                          <button
                            type="button"
                            onClick={() => handleAdminCommandAction("Warning")}
                            className="w-full py-2 bg-zinc-900 border border-amber-800/25 text-amber-500 font-bold uppercase"
                          >
                            WARN
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 font-mono text-[9px] pt-1">
                        <button
                          type="button"
                          onClick={() => handleAdminCommandAction("Mute")}
                          className="flex-1 py-1.5 bg-[#ff001c]/10 hover:bg-[#ff001c]/15 border border-red-500/40 text-red-500 font-extrabold uppercase rounded"
                        >
                          APPLY MUTE
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminCommandAction("Suspend")}
                          className="flex-1 py-1.5 bg-purple-900/20 hover:bg-purple-900/30 border border-purple-500/30 text-purple-400 font-extrabold uppercase rounded"
                        >
                          SUSPEND
                        </button>
                        {session.role === "Owner" && (
                          <button
                            type="button"
                            onClick={() => handleAdminCommandAction("Ban")}
                            className="px-2 py-1.5 bg-black hover:bg-neutral-900 border border-zinc-800 text-zinc-400 font-extrabold uppercase rounded"
                          >
                            BAN
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {session.role === "Owner" && (
                  <div className="space-y-2.5 bg-neutral-950/60 p-4 rounded-xl border border-gray-850">
                    <span className="text-[10px] text-zinc-550 block font-mono font-bold uppercase tracking-wider">ROOM ARCHIVE COMMAND (OWNER ONLY)</span>
                    <p className="text-[10px] text-zinc-500 leading-snug">Owners can instantly purge the active history buffer in the selected regional segment if severe toxic disruptions occur.</p>
                    <button
                      type="button"
                      onClick={handleAdminClearHistory}
                      className="w-full py-1.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 font-mono text-[9px] uppercase tracking-wider"
                    >
                      🗑️ CLEAR CHANNEL CHAT HISTORY
                    </button>
                  </div>
                )}
              </div>

              {/* LIVE REPORTS (COL 7) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* SMART LANGUAGE FILTER CONFIG (ADMIN ONLY) */}
                {isOwnerOrAdmin && (
                  <div className="p-4 bg-black/35 border border-gray-850 rounded-xl space-y-3">
                    <span className="text-[10px] text-zinc-550 block font-mono font-bold uppercase tracking-wider">DYNAMICAL SMART FILTER DICTIONARY</span>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-[10px] uppercase font-bold text-zinc-400 font-mono">
                        <input
                          type="checkbox"
                          checked={filterConfig.censorMild}
                          onChange={(e) => {
                            const latest = { ...filterConfig, censorMild: e.target.checked };
                            setFilterConfig(latest);
                            handleFilterConfigPush(latest);
                          }}
                          className="accent-red-555 w-3.5 h-3.5"
                        />
                        CENSOR MILD PROFANITY
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[10px] uppercase font-bold text-zinc-400 font-mono">
                        <input
                          type="checkbox"
                          checked={filterConfig.blockSevere}
                          onChange={(e) => {
                            const latest = { ...filterConfig, blockSevere: e.target.checked };
                            setFilterConfig(latest);
                            handleFilterConfigPush(latest);
                          }}
                          className="accent-red-555 w-3.5 h-3.5"
                        />
                        BLOCK SEVERE WORDS
                      </label>
                    </div>

                    <div className="space-y-1.5 pt-1.5">
                      <label className="block text-[9px] text-zinc-550 uppercase font-black">EDIT SEVERE PHRASES (DYNAMICAL RELOAD)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="new-severe-word-trigger"
                          placeholder="e.g. hacktool, cheatsite, directscampromocode"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const input = e.currentTarget;
                              handleAddSevereKeyword(input.value);
                              input.value = "";
                            }
                          }}
                          className="flex-1 bg-black border border-zinc-800 rounded p-1 text-[11px] text-zinc-300 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("new-severe-word-trigger") as HTMLInputElement;
                            if (input) {
                              handleAddSevereKeyword(input.value);
                              input.value = "";
                            }
                          }}
                          className="px-3 bg-zinc-900 border border-zinc-800 hover:border-red-900 text-zinc-400 text-[10px] uppercase font-mono rounded"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin p-1">
                        {filterConfig.severeWords.map((word, wIdx) => (
                          <span
                            key={wIdx}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-[10px] text-zinc-400 rounded-md font-mono"
                          >
                            <span>{word}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSevereKeyword(word)}
                              className="text-red-500 hover:text-red-400 font-black scale-105"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* REPORTS AND SECURITY TICKETS LIST */}
                <div className="space-y-3">
                  <span className="text-[10px] text-zinc-550 block font-mono font-bold uppercase tracking-wider">ACTIVE FLAGS REPORTS ({reports.filter(r => !r.resolved).length})</span>
                  
                  <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin p-1">
                    {reports.length === 0 ? (
                      <p className="text-zinc-500 text-[11px] text-center italic py-4">No active user violation records reported.</p>
                    ) : (
                      reports.map((rep) => (
                        <div 
                          key={rep.id} 
                          className={`p-3 rounded-lg border text-[11px] space-y-1.5 ${
                            rep.resolved 
                              ? "bg-zinc-900/15 border-zinc-800/40 opacity-55 text-zinc-500" 
                              : "bg-red-950/10 border-red-900/30 text-zinc-300"
                          }`}
                        >
                          <div className="flex justify-between items-center bg-black/20 p-1 px-2 rounded font-mono text-[9px]">
                            <span>FLAGGED USER: <strong className="text-red-400 font-extrabold">@{rep.reportedUser}</strong></span>
                            <span>REPORTER: {rep.reporter}</span>
                          </div>
                          <p className="font-sans leading-relaxed">
                            <strong>Reason:</strong> <span className="text-amber-500 font-bold">{rep.reason}</span>
                          </p>
                          <p className="italic text-zinc-400 leading-snug font-medium">Comment: &ldquo;{rep.messageText}&rdquo;</p>
                          
                          {!rep.resolved && (
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAdminUserTab(rep.reportedUser);
                                  setAdminReasonInput(`Reported for: ${rep.reason}`);
                                }}
                                className="px-2.5 py-1 bg-amber-950/20 hover:bg-amber-900 hover:text-white border border-amber-500/30 text-amber-500 uppercase rounded font-mono text-[9px]"
                              >
                                Lock User
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* AUDIT LOG EVENTS CHAIN */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] text-zinc-550 block font-mono font-bold uppercase tracking-wider">OFFICIAL SYSTEM AUDIT CHAIN ({auditLogs.length})</span>
                  <div className="bg-[#09090A] border border-gray-850 rounded-xl p-3.5 max-h-44 overflow-y-auto scrollbar-thin font-mono text-[10px] text-zinc-400 space-y-2">
                    {auditLogs.length === 0 ? (
                      <p className="text-center italic py-2 text-zinc-650">No administrative audit records compiled.</p>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="border-b border-gray-850/40 pb-1.5 flex justify-between items-start gap-3">
                          <div className="space-y-0.5">
                            <p className="text-zinc-200">
                              <span className="text-amber-500 font-bold">[{log.action.toUpperCase()}]</span> applied on <strong className="text-red-400 font-bold">@{log.targetUser}</strong> by {log.actor}
                            </p>
                            <p className="text-zinc-500 leading-snug">Reason: {log.reason}</p>
                          </div>
                          <span className="text-[8px] text-zinc-650 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAdminPanelOpen(false)}
                className="px-5 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 rounded-xl uppercase font-mono tracking-wider"
              >
                Exit Control Center
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
