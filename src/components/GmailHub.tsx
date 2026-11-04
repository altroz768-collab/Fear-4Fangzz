import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Send, 
  Trash2, 
  RefreshCw, 
  Search, 
  Inbox, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  Sparkles, 
  ShieldAlert,
  X,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { User } from "firebase/auth";
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken 
} from "../services/gmailAuth";
import { 
  listGmailMessages, 
  getGmailMessage, 
  sendGmailEmail, 
  deleteGmailMessage, 
  GmailMessageSummary,
  SendEmailPayload 
} from "../services/gmailService";

export const GmailHub: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Email state
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusNotification, setStatusNotification] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Compose form state
  const [activeTab, setActiveTab] = useState<"inbox" | "compose">("inbox");
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Destructive Confirmation Dialog State (MANDATORY per Workspace guidelines)
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState<{
    open: boolean;
    messageId: string;
    subject: string;
  }>({ open: false, messageId: "", subject: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  // Listen for Auth State on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(Boolean(token));
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
        setMessages([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch messages once token is present
  useEffect(() => {
    if (hasToken) {
      handleRefreshMessages();
    }
  }, [hasToken]);

  const showNotify = (text: string, type: "success" | "error" | "info" = "info") => {
    setStatusNotification({ text, type });
    setTimeout(() => {
      setStatusNotification(null);
    }, 5000);
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setHasToken(true);
        showNotify("Connected to Gmail with user permission.", "success");
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      showNotify(err.message || "Failed to sign in with Google.", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setCurrentUser(null);
      setHasToken(false);
      setMessages([]);
      setSelectedMessage(null);
      showNotify("Disconnected from Gmail.", "info");
    } catch (err: any) {
      console.error("Sign-out error:", err);
    }
  };

  const handleRefreshMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const list = await listGmailMessages(15, searchQuery);
      setMessages(list);
    } catch (err: any) {
      console.error("Fetch messages failed:", err);
      showNotify("Could not load Gmail messages: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleApplyTemplate = (type: "scrim" | "tournament" | "support") => {
    if (type === "scrim") {
      setComposeSubject("[Fear 4Fangz] Scrim Lobby Challenge Invitation - 18:00 UTC");
      setComposeBody(
        "Greetings Captain,\n\n" +
        "Fear 4Fangz esports management extends an invitation for today's high-tier TDM/Battle Royale scrim lobby.\n\n" +
        "Details:\n" +
        "• Match Launch: 18:00 UTC\n" +
        "• Roster Format: Squad 4v4 TDM / Erangel BR\n" +
        "• Room Credentials: Will be broadcasted 15 mins prior\n\n" +
        "Please confirm your roster availability by replying to this dispatch.\n\n" +
        "Best regards,\n" +
        "Fear 4Fangz Competitive Operations"
      );
    } else if (type === "tournament") {
      setComposeSubject("[Fear 4Fangz] Tournament Squad Registration Confirmation");
      setComposeBody(
        "Hello Esports Team Leader,\n\n" +
        "Your squad registration has been received for the upcoming CV Championship series.\n\n" +
        "Roster Checklist:\n" +
        "1. Ensure all 4 active players have linked their in-game credentials.\n" +
        "2. Review the official rulebook in the Strategy Room tab.\n" +
        "3. Keep your WhatsApp contact active for lobby drop alerts.\n\n" +
        "See you on the battlefield!\n" +
        "CV Esports Hub Administration"
      );
    } else {
      setComposeTo("contact@fear4fangz.com");
      setComposeSubject("[Fear 4Fangz Support] Clan Roster & Dispute Inquiry");
      setComposeBody(
        "To the Fear 4Fangz Community Oversight Team,\n\n" +
        "I am writing regarding my recent tournament match / clan roster inquiry.\n\n" +
        "Player IGN: \n" +
        "Match/Ticket ID: \n" +
        "Description of Request: \n\n" +
        "Thank you for your time."
      );
    }
    setActiveTab("compose");
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      showNotify("Please fill in recipient email, subject, and message body.", "error");
      return;
    }

    setIsSending(true);
    try {
      const payload: SendEmailPayload = {
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        body: composeBody.trim()
      };
      await sendGmailEmail(payload);
      showNotify("Email dispatched successfully through Gmail!", "success");
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setActiveTab("inbox");
      handleRefreshMessages();
    } catch (err: any) {
      console.error("Email send error:", err);
      showNotify("Failed to send email: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsSending(false);
    }
  };

  // Trigger Destructive Deletion Confirmation
  const promptDeleteMessage = (messageId: string, subject?: string) => {
    setDeleteConfirmationModal({
      open: true,
      messageId,
      subject: subject || "Selected Message"
    });
  };

  // Execute Deletion after explicit User Confirmation
  const confirmExecuteDelete = async () => {
    const { messageId } = deleteConfirmationModal;
    if (!messageId) return;

    setIsDeleting(true);
    try {
      await deleteGmailMessage(messageId);
      showNotify("Message deleted from Gmail account.", "info");
      setMessages(prev => prev.filter(m => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      setDeleteConfirmationModal({ open: false, messageId: "", subject: "" });
    } catch (err: any) {
      console.error("Deletion failed:", err);
      showNotify("Could not delete message: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-stone-950 via-zinc-900 to-neutral-950 border border-red-950/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                <Mail size={22} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black font-orbitron text-white tracking-wider flex items-center gap-2">
                  GMAIL ESPORTS DISPATCH
                  <span className="text-[10px] bg-red-600/30 text-red-400 font-mono px-2 py-0.5 rounded-full border border-red-500/40">
                    WORKSPACE 1P
                  </span>
                </h1>
                <p className="text-xs text-gray-400 font-rajdhani font-semibold">
                  Send official tournament invites, scrim challenges, and receive captain communications with Google Gmail.
                </p>
              </div>
            </div>
          </div>

          {/* AUTH STATUS & GOOGLE BUTTON */}
          <div className="flex items-center gap-3">
            {currentUser && hasToken ? (
              <div className="flex items-center gap-3 bg-stone-900/90 border border-zinc-800 px-4 py-2 rounded-xl">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || "Google User"} className="w-8 h-8 rounded-full border border-red-500/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center text-xs text-white">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white truncate max-w-[150px]">
                    {currentUser.displayName || "Google Account"}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Disconnect Google Account"
                  className="p-1.5 ml-2 hover:bg-neutral-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              /* REQUIRED OFFICIAL GOOGLE SIGN-IN BUTTON SPECIFICATION */
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white text-gray-800 hover:bg-gray-100 rounded-xl font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="font-semibold">{isLoggingIn ? "Connecting..." : "Sign in with Google"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NOTIFICATION BANNER */}
      {statusNotification && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-mono border ${
          statusNotification.type === "success" 
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400" 
            : statusNotification.type === "error"
            ? "bg-red-950/40 border-red-500/40 text-red-400"
            : "bg-blue-950/40 border-blue-500/40 text-blue-400"
        }`}>
          <div className="flex items-center gap-2">
            {statusNotification.type === "success" && <CheckCircle size={16} />}
            {statusNotification.type === "error" && <AlertCircle size={16} />}
            {statusNotification.type === "info" && <Sparkles size={16} />}
            <span>{statusNotification.text}</span>
          </div>
          <button onClick={() => setStatusNotification(null)} className="hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* MAIN BODY: SIGN-IN GATEWAY OR APP TABS */}
      {!currentUser || !hasToken ? (
        <div className="bg-stone-950 border border-zinc-900 rounded-2xl p-10 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <Mail size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black font-orbitron text-white">Gmail Integration Ready</h2>
            <p className="text-xs text-gray-400 font-rajdhani">
              Connect your Google Workspace account with user permission to view and send esports tournament invites, scrim schedules, and team verification emails directly within the Fear 4Fangz hub.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-left text-xs text-gray-300 space-y-2 font-mono">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-red-400" />
              What you can do:
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
              <li>Send official Scrim challenge emails directly to registered captains</li>
              <li>Dispatch tournament bracket alerts and confirmation notices</li>
              <li>Read incoming communications directly in your secure hub</li>
              <li>Protected by Google OAuth token security stored in memory</li>
            </ul>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{isLoggingIn ? "Authorizing Google Account..." : "Sign in with Google to Access Gmail"}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* NAVIGATION TABS & QUICK TEMPLATES */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("inbox")}
                className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "inbox"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-zinc-900 text-gray-400 hover:text-white"
                }`}
              >
                <Inbox size={15} />
                INBOX & DISPATCHES
                {messages.length > 0 && (
                  <span className="bg-stone-950 text-red-400 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                    {messages.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("compose")}
                className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === "compose"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-zinc-900 text-gray-400 hover:text-white"
                }`}
              >
                <Send size={15} />
                COMPOSE DISPATCH
              </button>
            </div>

            {/* QUICK PRESET BUTTONS */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-gray-500 text-[11px] hidden sm:inline">Templates:</span>
              <button
                onClick={() => handleApplyTemplate("scrim")}
                className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 hover:text-red-300 rounded-lg border border-red-900/40 text-[11px] transition-colors cursor-pointer"
              >
                ⚔️ Scrim Challenge
              </button>
              <button
                onClick={() => handleApplyTemplate("tournament")}
                className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 rounded-lg border border-amber-900/40 text-[11px] transition-colors cursor-pointer"
              >
                🏆 Tourney Confirm
              </button>
              <button
                onClick={() => handleApplyTemplate("support")}
                className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-900/40 text-[11px] transition-colors cursor-pointer"
              >
                🛡️ Clan Support
              </button>
            </div>
          </div>

          {/* TAB 1: INBOX */}
          {activeTab === "inbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* MESSAGE LIST */}
              <div className={`${selectedMessage ? "lg:col-span-5" : "lg:col-span-12"} space-y-4`}>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRefreshMessages()}
                      placeholder="Search messages (e.g. Scrim, Tournament)..."
                      className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    onClick={handleRefreshMessages}
                    disabled={isLoadingMessages}
                    title="Refresh Gmail"
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-gray-300 rounded-xl border border-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={15} className={isLoadingMessages ? "animate-spin text-red-500" : ""} />
                  </button>
                </div>

                {isLoadingMessages ? (
                  <div className="bg-stone-950 border border-zinc-900 rounded-2xl p-10 text-center text-xs text-gray-400 space-y-3">
                    <RefreshCw size={24} className="animate-spin text-red-500 mx-auto" />
                    <p className="font-mono">Loading dispatches directly from Gmail API...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="bg-stone-950 border border-zinc-900 rounded-2xl p-12 text-center text-xs text-gray-400 space-y-3">
                    <Inbox size={32} className="text-gray-600 mx-auto" />
                    <p className="font-mono font-bold text-gray-300">No emails match the current criteria.</p>
                    <p className="text-[11px] text-gray-500">
                      Use the "Compose Dispatch" tab to send scrim challenges or tournament invitations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                          selectedMessage?.id === msg.id
                            ? "bg-red-950/20 border-red-500/60 shadow-lg shadow-red-950/30"
                            : "bg-stone-950 border-zinc-900 hover:border-zinc-800 hover:bg-neutral-900/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 truncate">
                            {msg.unread && (
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            )}
                            <span className="text-xs font-bold text-white truncate font-rajdhani">
                              {msg.from}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono shrink-0">
                            {msg.date ? new Date(msg.date).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-gray-200 truncate mb-1">
                          {msg.subject}
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-2">
                          {msg.snippet || "(No content preview)"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MESSAGE DETAIL VIEW */}
              {selectedMessage && (
                <div className="lg:col-span-7 bg-stone-950 border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <h2 className="text-base font-black font-orbitron text-white">
                      DISPATCH DETAIL
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => promptDeleteMessage(selectedMessage.id, selectedMessage.subject)}
                        title="Delete this message"
                        className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg border border-red-800/40 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="p-1.5 hover:bg-neutral-800 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase block">Subject</span>
                      <span className="text-white text-sm font-bold font-sans">{selectedMessage.subject}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase block">From</span>
                        <span className="text-gray-300 break-all">{selectedMessage.from}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase block">Date</span>
                        <span className="text-gray-300">{selectedMessage.date || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/60 border border-zinc-900 rounded-xl max-h-96 overflow-y-auto whitespace-pre-wrap text-xs text-gray-300 leading-relaxed font-sans">
                    {selectedMessage.bodyText || selectedMessage.snippet}
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
                    <button
                      onClick={() => {
                        setComposeTo(selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || "");
                        setComposeSubject(`Re: ${selectedMessage.subject}`);
                        setComposeBody(`\n\n--- On ${selectedMessage.date}, ${selectedMessage.from} wrote:\n> ${selectedMessage.bodyText || selectedMessage.snippet}`);
                        setActiveTab("compose");
                      }}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-orbitron font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Send size={13} />
                      Reply via Gmail
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPOSE NEW EMAIL */}
          {activeTab === "compose" && (
            <div className="max-w-2xl mx-auto bg-stone-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div>
                  <h2 className="text-base font-black font-orbitron text-white">
                    COMPOSE GMAIL DISPATCH
                  </h2>
                  <p className="text-xs text-gray-400 font-rajdhani">
                    Dispatched directly from your authenticated Google Workspace account: <strong className="text-white">{currentUser.email}</strong>
                  </p>
                </div>
                <Send size={20} className="text-red-500" />
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">
                    Recipient Email Address (e.g. Opponent Captain / Team Lead) *
                  </label>
                  <input
                    type="email"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="captain@opponentclan.com"
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="[Fear 4Fangz] Scrim Lobby Challenge Invitation"
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-1">
                    Email Message Content *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    placeholder="Write your tournament or scrim dispatch details..."
                    className="w-full p-4 bg-neutral-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setActiveTab("inbox")}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-gray-400 rounded-xl text-xs font-mono cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-orbitron font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Send size={14} className={isSending ? "animate-pulse" : ""} />
                    {isSending ? "Sending Dispatch via Gmail..." : "Send Gmail Dispatch"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* MANDATORY EXPLICIT CONFIRMATION MODAL FOR DESTRUCTIVE GMAIL ACTIONS */}
      {deleteConfirmationModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-red-600/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert size={28} />
              <h3 className="text-base font-black font-orbitron text-white">
                Confirm Permanent Deletion
              </h3>
            </div>
            
            <p className="text-xs text-gray-300 font-rajdhani leading-relaxed">
              Are you sure you want to permanently delete this email from your Google Workspace account?
            </p>

            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs font-mono text-gray-300 truncate">
              <strong>Target:</strong> "{deleteConfirmationModal.subject}"
            </div>

            <p className="text-[11px] text-gray-500 font-mono">
              ⚠️ This destructive action modifies your personal Gmail messages and cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmationModal({ open: false, messageId: "", subject: "" })}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-gray-300 rounded-xl text-xs font-mono cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmExecuteDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-orbitron font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50 transition-all"
              >
                <Trash2 size={14} />
                {isDeleting ? "Deleting from Gmail..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailHub;
