import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  ShieldCheck,
  Check,
  X,
  Lock,
  Unlock,
  Send,
  History,
  UserCheck,
  Bell,
  Trash2,
  Settings,
  AlertTriangle,
  UserPlus,
  Clock,
  BookOpen,
  Smartphone,
  KeyRound,
  Users,
  QrCode,
  Shield,
  Zap,
  Info,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Globe,
  AlertOctagon,
  HelpCircle
} from "lucide-react";

// Types
export interface LinkedWhatsAppProfile {
  ign: string;
  phoneNumber: string;
  isVerified: boolean;
  isCodeRecipient: boolean;
  enableNotifications: boolean;
  lastNotificationReceived?: string;
  lastNotificationTime?: string;
  dateLinked?: string;
}

export interface WhatsAppNotificationLog {
  id: string;
  recipientIgn: string;
  phoneNumber: string;
  type: "Registration" | "RoomCode" | "Waitlist" | "Appeal" | "Penalty" | "Alert" | "Reminder";
  message: string;
  status: "Delivered" | "Pending" | "Failed";
  timestamp: string;
}

export interface CodeReleaseSession {
  id: string;
  matchName: string;
  map: string;
  roomId: string;
  roomPass: string;
  scheduledTime: string; // HH:MM
  releaseTime: number; // minutes countdown/release timestamp offset
  isReleased: boolean;
  codeRecipient: string;
}

const SEED_NOTIFICATIONS: WhatsAppNotificationLog[] = [
  { id: "wa-1", recipientIgn: "CV_Slayer_IGL", phoneNumber: "+263 77 112 2334", type: "Registration", message: "Your registration for CV Battle Royale Grand Slam has been ACCEPTED. Roster locked.", status: "Delivered", timestamp: "2026-06-22 10:15:30" },
  { id: "wa-2", recipientIgn: "CV_Mamba_Flick", phoneNumber: "+263 71 888 9999", type: "Waitlist", message: "🔥 Waitlist Promotion: Team 'Alpha Squad' has been promoted to Main Bracket Lobby A.", status: "Delivered", timestamp: "2026-06-22 09:30:15" },
  { id: "wa-3", recipientIgn: "CV_Slayer_IGL", phoneNumber: "+263 77 112 2334", type: "Reminder", message: "⚠️ Scrim Lobby check-in expires in 15 minutes. Join Room now to prevent automated strike.", status: "Delivered", timestamp: "2026-06-22 08:00:00" },
  { id: "wa-4", recipientIgn: "ZIM_Tinashe", phoneNumber: "+263 78 445 5566", type: "Appeal", message: "Your penalty protest regarding Match #2 bridge block was reviewed. Discrepancy RESOLVED - points re-allocated.", status: "Delivered", timestamp: "2026-06-21 17:45:12" }
];

const SEED_SCRIMS: CodeReleaseSession[] = [
  { id: "scrim-10", matchName: "PMGC-Style Scrim #12", map: "Erangel Desert", roomId: "9826154", roomPass: "vipers66", scheduledTime: "12:30 GMT", releaseTime: 5, isReleased: false, codeRecipient: "CV_Slayer_IGL" },
  { id: "scrim-11", matchName: "TDM Championship Round 2", map: "Warehouse M24", roomId: "8817293", roomPass: "tdmpro99", scheduledTime: "13:15 GMT", releaseTime: 12, isReleased: false, codeRecipient: "CV_Slayer_IGL" }
];

interface WhatsAppLinkingSystemProps {
  currentIgn: string;
  onAlert: (msg: string) => void;
}

export default function WhatsAppLinkingSystem({
  currentIgn,
  onAlert
}: WhatsAppLinkingSystemProps) {
  // Navigation tabs within WhatsApp Center
  const [activeCenterSubTab, setActiveCenterSubTab] = useState<"linking" | "guide" | "help">("linking");

  // Profiles database per user in localStorage
  const [profiles, setProfiles] = useState<Record<string, LinkedWhatsAppProfile>>(() => {
    const saved = localStorage.getItem("cv_whatsapp_user_profiles");
    return saved ? JSON.parse(saved) : {};
  });

  const [notificationLogs, setNotificationLogs] = useState<WhatsAppNotificationLog[]>(() => {
    const saved = localStorage.getItem("cv_whatsapp_notification_logs");
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [activeScrims, setActiveScrims] = useState<CodeReleaseSession[]>(() => {
    const saved = localStorage.getItem("cv_whatsapp_scrim_sessions");
    return saved ? JSON.parse(saved) : SEED_SCRIMS;
  });

  const [auditRecords, setAuditRecords] = useState<{ id: string; msg: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem("cv_whatsapp_audit_records");
    return saved ? JSON.parse(saved) : [
      { id: "aud-0", msg: "WhatsApp System initialized in secure sandbox environment.", timestamp: "2026-06-22T08:00:00Z" }
    ];
  });

  // User input states for Linking Process
  const [phoneInput, setPhoneInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // FAQ Expanded index state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Active user's profile state
  const currentProfile: LinkedWhatsAppProfile = profiles[currentIgn] || {
    ign: currentIgn,
    phoneNumber: "",
    isVerified: false,
    isCodeRecipient: ["CV_Slayer_IGL", "CV_Mamba_Flick"].includes(currentIgn),
    enableNotifications: true
  };

  // Synchronizers
  useEffect(() => {
    localStorage.setItem("cv_whatsapp_user_profiles", JSON.stringify(profiles));
    // Trigger dispatch event so other components see state change
    window.dispatchEvent(new Event("cv_whatsapp_update"));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("cv_whatsapp_notification_logs", JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  useEffect(() => {
    localStorage.setItem("cv_whatsapp_scrim_sessions", JSON.stringify(activeScrims));
  }, [activeScrims]);

  useEffect(() => {
    localStorage.setItem("cv_whatsapp_audit_records", JSON.stringify(auditRecords));
  }, [auditRecords]);

  // Is Admin Checks for administrative tools
  const isAdmin = ["CV_Slayer_IGL", "CV_Mamba_Flick", "Admin_Elite", "Owner", "MucheChe_Staff", "Staff"].some(
    (name) => currentIgn.toLowerCase().includes(name.toLowerCase()) || currentIgn === "muchecheprince4@gmail.com"
  );

  // --- ACTIONS ---

  // Trigger simulated send of SMS/WhatsApp OTP
  const handleInitiateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = phoneInput.trim();
    
    // Country code prefix verification simple regex
    if (!cleanedPhone.startsWith("+") || cleanedPhone.replace(/\s+/g, "").length < 9) {
      onAlert("⚠️ Invalid phone format! Please include international country code prefix (e.g., +263771122334, +27718889999).");
      return;
    }

    // Check for duplicate number abuse
    const isDuplicate = (Object.values(profiles) as LinkedWhatsAppProfile[]).some(
      (p) => p.isVerified && p.phoneNumber.replace(/\s+/g, "") === cleanedPhone.replace(/\s+/g, "") && p.ign !== currentIgn
    );

    if (isDuplicate) {
      onAlert(`❌ Duplicate Number Error! Phone number ${cleanedPhone} is already linked and verified by another user roster profile.`);
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    addAuditRecord(`Initialized linking process for ${cleanedPhone}. Code generated.`);
    onAlert(`📨 [CV OTP Gateway Simulation] Verification token sent successfully to ${cleanedPhone}! OTP code is: ${randomOtp}`);
  };

  // Validate user entered verification code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (otpInput.trim() === generatedOtp) {
        // Success
        const updatedProfile: LinkedWhatsAppProfile = {
          ...currentProfile,
          phoneNumber: phoneInput.trim(),
          isVerified: true,
          enableNotifications: true,
          lastNotificationReceived: "WhatsApp Linked & Audited Successfully",
          lastNotificationTime: new Date().toLocaleTimeString(),
          dateLinked: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        };

        const nextProfiles = {
          ...profiles,
          [currentIgn]: updatedProfile
        };

        setProfiles(nextProfiles);
        setOtpSent(false);
        setOtpInput("");
        setPhoneInput("");

        // Log audit
        addAuditRecord(`User ${currentIgn} linked & verified WhatsApp number ${updatedProfile.phoneNumber}`);
        onAlert(`✅ WhatsApp account successfully verified! Active event announcements synchronizations enabled.`);
      } else {
        onAlert("❌ Incorrect verification token. Review the simulated alert top-level header or check the code.");
      }
    }, 700);
  };

  // Change or unlink number
  const handleUnlinkNumber = () => {
    const prevNum = currentProfile.phoneNumber;
    const updatedProfile: LinkedWhatsAppProfile = {
      ...currentProfile,
      phoneNumber: "",
      isVerified: false,
      isCodeRecipient: false
    };

    setProfiles((prev) => ({
      ...prev,
      [currentIgn]: updatedProfile
    }));

    addAuditRecord(`User ${currentIgn} unlinked WhatsApp number ${prevNum}`);
    onAlert("🛡️ Linked WhatsApp account removed. Status shifted to Unlinked.");
  };

  // Toggle notification updates
  const handleToggleNotifications = (val: boolean) => {
    const updated = {
      ...currentProfile,
      enableNotifications: val
    };
    setProfiles((prev) => ({
      ...prev,
      [currentIgn]: updated
    }));
    onAlert(`🔔 Push notifications ${val ? "ENABLED" : "MUTED"} for your connected WhatsApp.`);
  };

  // Helper code manager
  const addAuditRecord = (msg: string) => {
    const newRecord = {
      id: "aud-" + Date.now(),
      msg,
      timestamp: new Date().toISOString()
    };
    setAuditRecords((prev) => [newRecord, ...prev]);
  };

  // Transfer Code Recipient Authorization
  const handleTransferRecipient = (targetUser: string) => {
    if (!isAdmin) {
      onAlert("🚫 Unauthorized action. Only organization team captains or officials can delegate room code recipients.");
      return;
    }

    // Revoke from previous recipient, give permission to new one
    const updatedProfiles = { ...profiles };
    let previousRecipient = "None";

    Object.keys(updatedProfiles).forEach((ignKey) => {
      if (updatedProfiles[ignKey].isCodeRecipient) {
        previousRecipient = ignKey;
        updatedProfiles[ignKey].isCodeRecipient = false;
      }
    });

    if (!updatedProfiles[targetUser]) {
      updatedProfiles[targetUser] = {
        ign: targetUser,
        phoneNumber: "",
        isVerified: false,
        isCodeRecipient: true,
        enableNotifications: true
      };
    } else {
      updatedProfiles[targetUser].isCodeRecipient = true;
    }

    setProfiles(updatedProfiles);

    // Update active scrims assigned code recipient
    setActiveScrims((prev) =>
      prev.map((s) => ({ ...s, codeRecipient: targetUser }))
    );

    addAuditRecord(`Transferred room code delivery priority from ${previousRecipient} to ${targetUser}`);
    onAlert(`🏆 Roster updated! Code delivery shift validated. New Designated Recipient: [${targetUser}].`);
  };

  // Release Room codes now via WhatsApp Log
  const triggerReleaseCodes = (scrimId: string) => {
    const sc = activeScrims.find((s) => s.id === scrimId);
    if (!sc) return;

    setActiveScrims((prev) =>
      prev.map((s) => (s.id === scrimId ? { ...s, isReleased: true } : s))
    );

    const recipient = sc.codeRecipient;
    const profile = profiles[recipient];

    if (!profile || !profile.isVerified || !profile.phoneNumber) {
      const failedLog: WhatsAppNotificationLog = {
        id: "wa-f-" + Date.now(),
        recipientIgn: recipient,
        phoneNumber: profile?.phoneNumber || "None Logged",
        type: "RoomCode",
        message: `❌ DISPATCH FAILED: Could not transmit Room ${sc.roomId} / Pass ${sc.roomPass} credentials because the designated target recipient [${recipient}] has not linked or verified their WhatsApp account.`,
        status: "Failed",
        timestamp: new Date().toLocaleTimeString()
      };
      setNotificationLogs((prev) => [failedLog, ...prev]);
      addAuditRecord(`Failed Room Code delivery for ${sc.matchName} to ${recipient} (unlinked/unverified profile)`);
      onAlert(`⚠️ Delivery Inhibited: Recipient [${recipient}] is unlinked! Connect WhatsApp via configuration panel.`);
      return;
    }

    const successMsg = `🔑 OFFICIAL CV MATCH ROOM CREDENTIALS:\nMatch: ${sc.matchName}\nMap: ${sc.map}\nRoom ID: ${sc.roomId}\nPassword: ${sc.roomPass}\nDo NOT forward or leak this transmission. GLHF!`;
    const newLog: WhatsAppNotificationLog = {
      id: "wa-s-" + Date.now(),
      recipientIgn: recipient,
      phoneNumber: profile.phoneNumber,
      type: "RoomCode",
      message: successMsg,
      status: "Delivered",
      timestamp: new Date().toLocaleTimeString()
    };

    setNotificationLogs((prev) => [newLog, ...prev]);

    setProfiles((prev) => ({
      ...prev,
      [recipient]: {
        ...prev[recipient],
        lastNotificationReceived: `Room Released - ID ${sc.roomId}`,
        lastNotificationTime: new Date().toLocaleTimeString()
      }
    }));

    addAuditRecord(`Successfully transmitted WhatsApp Room credentials of ${sc.matchName} to ${recipient} (${profile.phoneNumber})`);
    onAlert(`✅ Room credentials successfully dispatched! Live WhatsApp notice pushed safely to IGL.`);
  };

  // Dispatch standard notifications dynamically for demonstration
  const handleTriggerSimulatedAlert = (type: WhatsAppNotificationLog["type"]) => {
    if (!currentProfile.isVerified) {
      onAlert("⚠️ You must register and link your WhatsApp number before transmitting simulated system telemetry.");
      return;
    }

    let message = "";
    switch (type) {
      case "Registration":
        message = `📝 CV DIRECTIVE: Your roster submission has been ACCEPTED. Scrim bracket registration validated successfully.`;
        break;
      case "Waitlist":
        message = `🚀 SPECIAL COMMUNIQUE: High priority! Your crew was promoted from waitlist queue to ACTIVE Bracket Lobby B. Check-in starts now.`;
        break;
      case "Penalty":
        message = `⚖️ DISCIPLINARY AUTOMATION: 1 warning strike logged for delay-of-game connection on round #3 lobby. Play fair!`;
        break;
      case "Alert":
        message = `🔥 SPECIAL CUP ENTRY: CV Zimbabwe Championship Registration phase is now LIVE. Click dashboard to lock slots!`;
        break;
      default:
        message = `🔔 General CV Esports sync update transmission. Verified status green.`;
    }

    const nextLog: WhatsAppNotificationLog = {
      id: "wa-sim-" + Date.now(),
      recipientIgn: currentIgn,
      phoneNumber: currentProfile.phoneNumber,
      type,
      message,
      status: "Delivered",
      timestamp: new Date().toLocaleTimeString()
    };

    setNotificationLogs((prev) => [nextLog, ...prev]);

    setProfiles((prev) => ({
      ...prev,
      [currentIgn]: {
        ...prev[currentIgn],
        lastNotificationReceived: message,
        lastNotificationTime: new Date().toLocaleTimeString()
      }
    }));

    onAlert(`📩 Mock dispatch success: Simulated WhatsApp notification of type '${type}' pushed to ledger!`);
  };

  const getActiveStep = () => {
    if (currentProfile.isVerified) return 8;
    if (otpSent) return 5;
    if (phoneInput.trim().length > 4) return 3;
    return 1;
  };

  const activeStep = getActiveStep();

  return (
    <div id="whatsapp-linking-center-dock" className="bg-[#0b0b0c] text-neutral-300 rounded-3xl p-6 border border-zinc-900/80 shadow-2xl space-y-8 text-left relative overflow-hidden font-sans">
      
      {/* WhatsApp branding glow vector */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* TOP BRANDING BAR WITH ICON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-900">
        <div className="space-y-1.5 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1 px-2.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[9px] font-mono tracking-widest font-black rounded-lg uppercase">
              RELIABLE ROOM CODE ROUTING
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Verified AES Interface v3.2</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-white flex items-center gap-2.5 font-sans italic">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] text-black not-italic shrink-0">
              <Phone className="fill-black text-black" size={18} />
            </div>
            WHATSAPP <span className="text-emerald-500">LINKING CENTER</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Connecting your WhatsApp credentials guarantees swift, automatic receipt of Match Custom Lobby entries, event progress promos, and proctor notices.
          </p>
        </div>

        {/* BRIGHT LINK STATUS BADGE FOR MAXIMUM VISIBILITY */}
        <div className="flex items-center gap-2.5 bg-[#101011] border border-zinc-900 p-2.5 px-4 rounded-2xl shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-550">WhatsApp Delivery:</span>
          {currentProfile.isVerified ? (
            <span className="text-emerald-400 font-mono font-black text-xs flex items-center gap-1 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              🟢 LINKED
            </span>
          ) : (
            <span className="text-red-500 font-mono font-black text-xs flex items-center gap-1 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              🔴 NOT LINKED
            </span>
          )}
        </div>
      </div>

      {/* SUB TAB CONTROLS */}
      <div className="flex border-b border-zinc-900/60 pb-1 gap-2">
        <button
          onClick={() => setActiveCenterSubTab("linking")}
          className={`px-4 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all ${
            activeCenterSubTab === "linking"
              ? "bg-emerald-500 text-black shadow-lg"
              : "text-zinc-400 hover:text-white bg-transparent"
          }`}
        >
          📱 Connection Console
        </button>
        <button
          onClick={() => setActiveCenterSubTab("guide")}
          className={`px-4 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
            activeCenterSubTab === "guide"
              ? "bg-emerald-500 text-black shadow-lg"
              : "text-zinc-400 hover:text-white bg-transparent"
          }`}
        >
          <BookOpen size={13} />
          📖 Setup Guide (Steps 1-8)
        </button>
        <button
          onClick={() => setActiveCenterSubTab("help")}
          className={`px-4 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all ${
            activeCenterSubTab === "help"
              ? "bg-emerald-500 text-black shadow-lg"
              : "text-zinc-400 hover:text-white bg-transparent"
          }`}
        >
          ❓ Help & FAQ Support
        </button>
      </div>

      {activeCenterSubTab === "linking" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* PROFILE CARD & SETUP FORM */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* LINK STATUS DETAILS CARD */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">REGISTRATION CONTEXT</span>
                <span className="text-[10px] text-zinc-400 font-mono font-bold bg-zinc-950 p-1 px-2 rounded">{currentIgn}</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-black/40 p-2 px-3 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500">Contact Status:</span>
                  {currentProfile.isVerified ? (
                    <span className="text-emerald-400 font-black">🟢 Connected</span>
                  ) : (
                    <span className="text-red-500 font-black">🔴 Not Linked</span>
                  )}
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2 px-3 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500">Linked Number:</span>
                  <span className="text-white font-black">{currentProfile.phoneNumber || "Pending Linkage"}</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2 px-3 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500">Verification Status:</span>
                  <span className={currentProfile.isVerified ? "text-emerald-400 font-black" : "text-amber-500 font-black"}>
                    {currentProfile.isVerified ? "🔒 Verified Owner" : "⚠️ Needs Register"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2 px-3 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500 font-sans">Date Linked:</span>
                  <span className="text-zinc-400 font-bold">{currentProfile.dateLinked || "Not Yet Registered"}</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-2 px-3 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500 font-sans">Notification Delivery:</span>
                  <span className="text-zinc-400 font-bold">{currentProfile.enableNotifications ? "⚡ ACTIVE (REAL-TIME)" : "MUTED"}</span>
                </div>
              </div>

              {currentProfile.isVerified && (
                <div className="flex items-center justify-between p-3.5 bg-emerald-950/10 border border-emerald-900/30 rounded-xl">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] text-white font-extrabold uppercase tracking-widest font-mono block">AUTOMATIC MATCH DISPATCH</span>
                    <span className="text-[9px] text-zinc-550 leading-snug block">Deliver scrim lobby codes instantly</span>
                  </div>
                  <button
                    onClick={() => handleToggleNotifications(!currentProfile.enableNotifications)}
                    className={`p-1 px-3.5 font-mono font-black rounded-lg uppercase text-[9px] transition-colors ${
                      currentProfile.enableNotifications
                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                        : "bg-zinc-900 text-zinc-550 hover:text-white"
                    }`}
                  >
                    {currentProfile.enableNotifications ? "ENABLE" : "MUTE"}
                  </button>
                </div>
              )}
            </div>

            {/* LIVE REGISTER PANEL */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-extrabold tracking-wider font-mono text-white uppercase flex items-center gap-1.5 pb-2 border-b border-zinc-900">
                <QrCode size={13} className="text-emerald-400" />
                Live Configuration Terminal
              </h3>

              {!currentProfile.isVerified && !otpSent && (
                <form onSubmit={handleInitiateLink} className="space-y-4 text-xs">
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Provide your mobile number below, starting with the exact dial prefix (e.g., +263, +27, +44), to route the verification dispatch payload.
                  </p>

                  <div className="space-y-2 text-left">
                    <label className="text-[9.5px] font-mono uppercase tracking-widest text-zinc-450 font-black block">Dial Prefix & Mobile Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-650">
                        <Phone size={13} className="text-emerald-500" />
                      </span>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+263 77 112 2334"
                        className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl pl-9 pr-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-zinc-550 font-mono font-bold leading-normal">
                      <span>Supported range: Global</span>
                      <span>Must include '+' prefix</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full p-2.5 pb-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono uppercase text-xs font-black tracking-wider rounded-xl transition-all shadow-lg hover:shadow-emerald-950/20 cursor-pointer flex justify-center items-center gap-2"
                  >
                    <Send size={12} />
                    📱 Send Verification Code
                  </button>
                </form>
              )}

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs font-mono bg-zinc-950 border border-zinc-900 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-yellow-500 font-extrabold tracking-widest uppercase flex items-center gap-1 font-mono">
                      <KeyRound size={11} />
                      VERIFICATION GATEWAY
                    </span>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-zinc-500 hover:text-white">✕</button>
                  </div>

                  <p className="text-zinc-400 text-[10px] leading-relaxed">
                    Enter the 6-digit verification code sent to <strong className="text-[#00FF9D]">{phoneInput}</strong>. Check top alert banner.
                  </p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="ENTER PIN CODE"
                      className="w-full text-center tracking-[0.5em] bg-black border border-zinc-900 rounded-xl py-3 font-mono text-md text-yellow-500 uppercase focus:outline-none focus:border-emerald-500 font-black"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 p-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Verify Account ✅
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="p-2 px-3.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-400 rounded-xl font-bold uppercase text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {currentProfile.isVerified && (
                <div className="space-y-3 pt-1 text-left">
                  <p className="text-xs text-zinc-400">
                    Your number is verified in the system. To register a different phone number, disconnect this linkage.
                  </p>
                  <button
                    onClick={handleUnlinkNumber}
                    className="w-full p-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-500 font-mono text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    Unlink Phone Connection
                  </button>
                </div>
              )}
            </div>

            {/* WHY LINK WHATSAPP SECTION */}
            <div className="bg-[#111116] border border-blue-950/40 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-zinc-900">
                <ShieldCheck className="text-emerald-500" size={14} />
                🎯 WHY LINK WHATSAPP?
              </h3>
              <p className="text-[11px] text-zinc-400">
                Linking WhatsApp is required for complete automated registration operations. Check out what you instantly unlock:
              </p>
              <div className="grid grid-cols-1 gap-2.5 font-mono text-[10.5px]">
                {[
                  { label: "Credentials Dispatch", text: "Receive Match Room ID & Passwords" },
                  { label: "Notification Signals", text: "Match Check-in reminders & lobby details" },
                  { label: "Roster Acceptance", text: "Tournament waitlist promotions & accept notices" },
                  { label: "Announcements Board", text: "Schedule modifications & proctor announcements" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2 p-2 bg-black/60 rounded-xl border border-zinc-900 items-start">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <strong className="text-white block uppercase text-[10px]">{item.label}</strong>
                      <span className="text-zinc-550 block text-[9.5px]">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* TELEMETRY CONSOLE TIMELINE */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* MATCH FLOW ROUTING MECHANISM */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Code Recipient Router Timeline
                </h3>
                <span className="p-0.5 px-2 bg-yellow-950/30 text-yellow-500 border border-yellow-900/30 text-[8px] font-black uppercase rounded">
                  LOBBY TIMELINE
                </span>
              </div>

              <p className="text-xs text-zinc-400 max-w-xl">
                Match server IDs and private credentials remain securely locked. Only the currently verified and assigned team recipient receives the broadcast text before the matches block.
              </p>

              <div className="space-y-3 pt-2">
                {activeScrims.map((sc) => (
                  <div key={sc.id} className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 space-y-3.5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-zinc-900 text-zinc-450 p-1 rounded font-mono font-bold uppercase">{sc.map}</span>
                        <h4 className="text-xs font-black text-white uppercase">{sc.matchName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-550 font-mono font-bold uppercase block">RELEASE TARGET</span>
                        <strong className="text-yellow-500 font-mono text-[10.5px]">{sc.scheduledTime}</strong>
                      </div>
                    </div>

                    <div className="bg-black/60 border border-zinc-900 p-3 rounded-lg flex items-center justify-between gap-4">
                      <span className="text-[9.5px] text-zinc-500 font-mono">Payload Lock Status:</span>
                      <div className="font-mono text-xs text-white">
                        {sc.isReleased ? (
                          <div className="flex gap-3">
                            <span>ROOM: <strong className="text-emerald-400 font-black">{sc.roomId}</strong></span>
                            <span>PASS: <strong className="text-emerald-400 font-black">{sc.roomPass}</strong></span>
                          </div>
                        ) : (
                          <span className="text-zinc-650 font-black uppercase text-[10px] tracking-wide animate-pulse">🔒 LOCKED SECURE</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-zinc-900/60 mt-1">
                      <div>
                        <span className="text-[8px] text-zinc-550 block uppercase font-mono font-bold">Authorized Lobby Recipient</span>
                        <span className="text-xs text-white font-bold tracking-tight">{sc.codeRecipient}</span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {!sc.isReleased ? (
                          <button
                            onClick={() => triggerReleaseCodes(sc.id)}
                            className="flex-1 sm:flex-none p-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase font-mono text-[10px] rounded hover:scale-103 duration-100 cursor-pointer"
                          >
                            Release via WA Now
                          </button>
                        ) : (
                          <span className="p-1 px-2.5 bg-emerald-950/45 border border-emerald-900/30 text-emerald-400 rounded text-[9px] font-black uppercase flex items-center gap-1">
                            ✓ DISPATCHED TO WHATSAPP
                          </span>
                        )}

                        {isAdmin && (
                          <select
                            onChange={(e) => handleTransferRecipient(e.target.value)}
                            value={sc.codeRecipient}
                            className="bg-black hover:bg-zinc-950 text-zinc-400 text-[10.5px] font-mono border border-zinc-900 rounded p-1 px-2 focus:outline-none"
                          >
                            <option value="CV_Slayer_IGL">Assign CV_Slayer_IGL</option>
                            <option value="CV_Mamba_Flick">Assign CV_Mamba_Flick</option>
                            <option value="ZIM_Tinashe">Assign ZIM_Tinashe</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIMULATED EVENTS TESTING */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black tracking-wider font-mono text-zinc-405 text-left uppercase flex items-center gap-1.5 pb-2 border-b border-zinc-900">
                <Bell className="text-emerald-500 animate-pulse" size={13} />
                WhatsApp Telemetry Push Dispatcher
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Fire mock platform actions instantly to verify that WhatsApp delivery endpoints trace correctly down to the communication timeline.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {[
                  { label: "Acceptance Notice", type: "Registration" },
                  { label: "Waitlist Promo", type: "Waitlist" },
                  { label: "Penalty Alarm", type: "Penalty" },
                  { label: "Championship Live", type: "Alert" }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleTriggerSimulatedAlert(act.type as WhatsAppNotificationLog["type"])}
                    className="p-2 font-mono hover:border-emerald-500/50 hover:bg-neutral-900 text-white bg-black border border-zinc-900 rounded-xl uppercase text-[10px] cursor-pointer duration-100"
                  >
                    🛰️ {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LEDGER ARCHIVES */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <History size={13} className="text-emerald-500 animate-spin-slow" />
                  Live Notification Dispatch History
                </h3>
                <span className="text-[8px] font-mono text-zinc-550 uppercase">SECURED BY SSL ENTRIES</span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {notificationLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center font-mono">
                      <span className="p-0.5 px-2 bg-zinc-900 border border-zinc-850 text-emerald-400 text-[8px] uppercase tracking-wide font-black rounded">{log.type} notice</span>
                      <span className="text-[8px] text-zinc-550">{log.timestamp}</span>
                    </div>

                    <p className="text-[11px] font-sans text-neutral-400 leading-relaxed py-1 text-left whitespace-pre-line">{log.message}</p>

                    <div className="flex justify-between items-center pt-1 border-t border-zinc-900/40 text-[9.5px] font-mono leading-none">
                      <span className="text-zinc-500">To: {log.recipientIgn} ({log.phoneNumber})</span>
                      <span className={log.status === "Delivered" ? "text-emerald-450 font-black" : "text-red-500 font-black"}>
                        ● {log.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY LOG TRAILS */}
            {auditRecords.length > 0 && (
              <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-3 text-left">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[9.5px] text-zinc-550 uppercase font-black tracking-widest font-mono">Gateway Protection Records</span>
                  <span className="text-[8.5px] text-zinc-600 font-bold uppercase">SSL V2 APPROVED</span>
                </div>
                <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                  {auditRecords.map((aud) => (
                    <div key={aud.id} className="text-[10px] font-mono text-zinc-450 border-l border-zinc-800 pl-3 leading-relaxed py-0.5">
                      <span className="text-zinc-600">[{new Date(aud.timestamp).toLocaleTimeString()}]</span> {aud.msg}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {activeCenterSubTab === "guide" && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-8 animate-fade-in text-left">
          <div className="pb-3 border-b border-zinc-900/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-extrabold text-white uppercase font-sans">How to Link WhatsApp Official Guide</h2>
              <p className="text-xs text-zinc-500 leading-snug">Follow these clear 8 stages to bind your profile communication node successfully.</p>
            </div>
            <div className="text-emerald-500 font-mono text-xs border border-emerald-9c0/20 bg-emerald-950/20 p-1.5 px-3 rounded-lg font-black uppercase">
              SETUP COMPLIANT
            </div>
          </div>

          {/* ACTIVE 8-STAGE VISUAL INDICATOR */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { id: 1, label: "Dashboard" },
              { id: 2, label: "Click Link" },
              { id: 3, label: "Enter No." },
              { id: 4, label: "Send OTP" },
              { id: 5, label: "Receive Code" },
              { id: 6, label: "Enter OTP" },
              { id: 7, label: "Verify Account" },
              { id: 8, label: "Success!" }
            ].map((step, idx) => {
              const isDone = activeStep >= step.id;
              const isCurrent = activeStep === step.id;
              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border flex flex-col justify-between h-20 transition-all ${
                    isCurrent 
                      ? "bg-emerald-950/30 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-105"
                      : isDone 
                        ? "bg-zinc-900/40 border-emerald-900/40 text-emerald-400"
                        : "bg-zinc-950 border-zinc-900 text-zinc-550"
                  }`}
                >
                  <div className="flex justify-between items-start font-mono text-xs">
                    <span className="font-extrabold">{step.id}</span>
                    {isDone && <Check size={11} className="text-emerald-400 animate-pulse" />}
                  </div>
                  <span className="text-[10px] font-sans font-black uppercase truncate mt-2 leading-none block">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* THE STEP BY STEP DETAILED CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            
            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">1</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide">STAGE 01: OPEN DASHBOARD</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                Gain access to your secure account command deck. Navigate seamlessly to the personal overview page.
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">2</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide">STAGE 02: INITIATE ACTION</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                Click on the prominent, bright emerald <strong className="text-white">📱 Link WhatsApp</strong> trigger button to initialize bindings window.
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">3</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide">STAGE 03: DIAL PAYLOAD</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                Enter your exact country dial code following numerical characters. Standard input examples: 
                <span className="bg-black text-[#00FF5E] p-1 px-1.5 rounded text-[9px] block font-mono mt-1 w-fit">+263771122334, +27718889999</span>
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">4</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide font-sans">STAGE 04: REQUEST OTP Code</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
                Click: <strong className="text-white">✅ Send Verification Code</strong> on the dialog layout to fire the SMS OTP payload directly.
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2 font-sans">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">5</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide font-sans">STAGE 05: RECEIVE OTP Payload</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
                Receive the verification code packet. Look at the live simulation system flash notifications at top screen margin.
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2 font-sans">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">6</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide font-sans font-sans">STAGE 06: INPUT OTP KEY</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
                Enter the numerical six-character verification pin inside the prompt field of the dynamic verify container.
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2 font-sans">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">7</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide font-sans">STAGE 07: COMMENCE VERIFY</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
                Click <strong className="text-white">✅ Verify Account</strong> to authorize. If validated, SSL linkage gets authorized immediately.
              </p>
            </div>

            <div className="bg-[#101011] p-4 rounded-xl border border-zinc-900 text-xs text-left space-y-2 font-sans">
              <span className="w-6 h-6 bg-emerald-500 text-black text-xs font-mono font-black flex items-center justify-center rounded-lg">8</span>
              <h4 className="text-white text-[11px] font-mono font-black uppercase tracking-wide font-sans font-sans">STAGE 08: SECURE LINKED STATUS</h4>
              <p className="text-zinc-400 text-[11.5px] leading-relaxed font-sans">
                System shifts to <span className="text-[#00FF5E] font-bold">🟢 Linked</span>. Enjoy real-time room credentials alerts automatically!
              </p>
            </div>

          </div>

          <div className="bg-[#111116] border border-emerald-950/40 p-5 rounded-2xl mt-4 text-left">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-widest pb-2 border-b border-zinc-900 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500 animate-pulse" size={15} />
              🏆 CODE RECIPIENT GUIDE & SECURITY CRITERIA
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed mt-2">
              For security, room ID credentials and passcodes are strictly protected under competitive proctor systems. To comply with requirements:
            </p>
            <ul className="list-disc list-inside text-xs mt-2 text-zinc-400 space-y-1.5 font-sans pl-2">
              <li>The team designated <strong className="text-white uppercase font-mono text-[10.5px]">Code Recipient</strong> acts as the sole secure node authorized to receive room details.</li>
              <li>Only linked and verified WhatsApp accounts can qualify to receive credentials alerts.</li>
              <li>The team manager or manager proxies can easily assign or delegate a different Code Recipient before lobby registration seals.</li>
              <li>Once designated, credentials dispatch automatically routes exclusively to the validated cellphone on record.</li>
            </ul>
          </div>
        </div>
      )}

      {activeCenterSubTab === "help" && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6 animate-fade-in text-left">
          <div className="pb-3 border-b border-zinc-900/60 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white uppercase font-sans">🎥 QUICK HELP & TROUBLESHOOTING CENTER</h2>
              <p className="text-xs text-zinc-500 leading-snug">Resolve linkage conflicts or access manual chat proctors for swift assistance.</p>
            </div>
            <HelpCircle className="text-emerald-450 animate-pulse" size={18} />
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="space-y-3 font-sans text-xs">
            {[
              {
                q: "❓ Why should I link WhatsApp?",
                a: "Connecting WhatsApp is mandatory because room passcodes, qualifier listings, registration status reports, waitlist promotions, and tournament schedules dispatches sync securely via our SSL mobile text gateway. This prevents match delay issues."
              },
              {
                q: "❓ How do I change my number?",
                a: "Easy! Enter the Connection Console, click on 'Unlink Phone Connection' to reset ownership tags, then dial and verify your updated mobile number."
              },
              {
                q: "❓ I didn't receive my mock verification code. What should I do?",
                a: "Since this is operating in a sandboxed developer simulation, SMS carrier charges are bypassed. The actual 6-digit verification code is instantly highlighted at the top screen margin or inside the simulated alert bar."
              },
              {
                q: "❓ How do I receive active room codes?",
                a: "Once registered as the designated team proxy, the automated gateway dispatch transmits matching room codes exactly 10 minutes before the scheduled custom match launch timestamp."
              },
              {
                q: "❓ Can I remove my WhatsApp account?",
                a: "Yes! At any time, you could select 'Unlink Phone Connection' to erase your record from local databases. Note that this might suspend automated custom room deliveries immediately."
              }
            ].map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="bg-[#101011] border border-zinc-900 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 hover:bg-zinc-900 text-white font-extrabold flex items-center justify-between transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-emerald-500 font-black">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-zinc-950 text-zinc-400 leading-relaxed border-t border-zinc-900">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Troubleshooting and Contact Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#1a1212]/30 border border-red-950 p-4.5 rounded-xl space-y-2">
              <span className="text-red-500 font-mono text-[9.5px] font-black uppercase tracking-widest flex items-center gap-1">
                <AlertOctagon size={12} />
                SYSTEM TROUBLESHOOTING
              </span>
              <p className="text-zinc-400 text-xs leading-relaxed">
                If the verification status card reports errors, ensure your IGN session is validated. Clear browser cookies/localStorage to reset the test databases if you face severe linking loops.
              </p>
            </div>

            <div className="bg-emerald-950/10 border border-emerald-900/40 p-4.5 rounded-xl space-y-2.5 flex flex-col justify-between items-start">
              <div>
                <span className="text-emerald-400 font-mono text-[9.5px] font-black uppercase tracking-widest block">ASSISTED PROCTOR SUPPORT</span>
                <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                  Connect live with organization support proctors to retrieve manual room code assignments.
                </p>
              </div>
              <button
                onClick={() => {
                  onAlert("📞 Manual assistance ticket created. A live organization proctor will sync on WhatsApp.");
                }}
                className="p-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-mono uppercase text-xs font-black rounded-lg transition-all cursor-pointer"
              >
                Contact Support Official
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
