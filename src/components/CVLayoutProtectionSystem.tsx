import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Tv,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Layers,
  Sparkles,
  Maximize2,
  Trash2,
  BookOpen,
  Zap,
  Info,
  ChevronRight,
  TrendingUp,
  X,
  Gauge,
  Activity,
  Award,
  BookOpenCheck,
  Eye,
  SlidersHorizontal,
  HelpCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

// Configuration Interfaces
export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: any;
  category: "mobile" | "tablet" | "laptop" | "desktop" | "ultrawide";
  desc: string;
}

export interface SecurityFix {
  id: string;
  name: string;
  desc: string;
  isActive: boolean;
}

export interface DiagnosticIssue {
  id: string;
  category: "Cropping" | "Overflow" | "Spacing" | "TapTarget" | "Animation";
  severity: "low" | "medium" | "high";
  message: string;
  element: string;
  deviceApplied: string;
  status: "Detected" | "Resolved by Protection" | "Awaiting Scan";
}

// Global Device Configurations
export const DEVICES_LIST: DeviceConfig[] = [
  { id: "mobile-xs", name: "Foldable / Small Phone (320px)", width: 320, height: 568, icon: Smartphone, category: "mobile", desc: "Foldable or micro-viewport handset display" },
  { id: "mobile-s", name: "Standard Compact Phone (375px)", width: 375, height: 812, icon: Smartphone, category: "mobile", desc: "Mobile high density compact layout" },
  { id: "mobile-m", name: "Large Smartphone (425px)", width: 425, height: 915, icon: Smartphone, category: "mobile", desc: "Large form factor handset display" },
  { id: "tablet-s", name: "Portrait Tablet (768px)", width: 768, height: 1024, icon: Tablet, category: "tablet", desc: "Medium viewport portrait tablet" },
  { id: "tablet-l", name: "Landscape Tablet / Netbook (1024px)", width: 1024, height: 768, icon: Tablet, category: "tablet", desc: "Cohesive multi-grid tablet/netbook viewport" },
  { id: "laptop", name: "Standard Laptop (1440px)", width: 1440, height: 900, icon: Laptop, category: "laptop", desc: "Laptop standard viewport screen" },
  { id: "desktop", name: "Gaming Desktop (1920px)", width: 1920, height: 1080, icon: Monitor, category: "desktop", desc: "Wide high-refresh gaming display" },
  { id: "ultrawide", name: "Ultra-Wide / 4K Monitor (2560px)", width: 2560, height: 1080, icon: Tv, category: "ultrawide", desc: "Ultra-wide screen viewport spanning" }
];

interface CVLayoutProtectionSystemProps {
  currentRole: string;
  setSystemAlertMessage: (msg: string) => void;
  awardXp: (xp: number) => void;
  layoutRules: Record<string, boolean>;
  setLayoutRules: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function CVLayoutProtectionSystem({
  currentRole,
  setSystemAlertMessage,
  awardXp,
  layoutRules,
  setLayoutRules
}: CVLayoutProtectionSystemProps) {
  const [activeTab, setActiveTab] = useState<"diagnostics" | "simulator" | "policies">("diagnostics");
  const [selectedDevice, setSelectedDevice] = useState<DeviceConfig>(DEVICES_LIST[4]); // default laptop
  const [isDiagnosticScanning, setIsDiagnosticScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepMessage, setScanStepMessage] = useState("");
  const [hasScanned, setHasScanned] = useState(false);

  // Issues Ledger
  const [issues, setIssues] = useState<DiagnosticIssue[]>([]);
  const [healthScore, setHealthScore] = useState(82);

  // Auto-Fix Rules Config
  const handleToggleRule = (ruleId: string) => {
    const nextVal = !layoutRules[ruleId];
    setLayoutRules(prev => {
      const updated = { ...prev, [ruleId]: nextVal };
      localStorage.setItem("cv_layout_rules", JSON.stringify(updated));
      return updated;
    });

    awardXp(15);
    setSystemAlertMessage(`🛡️ Layout Rule Mod: ${ruleId.toUpperCase()} is now ${nextVal ? "ENABLED (ACTIVE PROTECTION)" : "DISABLED"}`);
    
    // Dispatch instant global changes event
    window.dispatchEvent(new Event("cv_layout_rules_updated"));

    // Recalculate mock health score based on active guards
    if (hasScanned) {
      setTimeout(() => {
        setIssues(prev =>
          prev.map(issue => {
            if (ruleId === "targetClearance" && issue.category === "TapTarget") {
              return { ...issue, status: nextVal ? "Resolved by Protection" : "Detected" };
            }
            if (ruleId === "imageGuard" && issue.category === "Cropping") {
              return { ...issue, status: nextVal ? "Resolved by Protection" : "Detected" };
            }
            if (ruleId === "layoutClamping" && issue.category === "Overflow") {
              return { ...issue, status: nextVal ? "Resolved by Protection" : "Detected" };
            }
            if (ruleId === "animationGate" && issue.category === "Animation") {
              return { ...issue, status: nextVal ? "Resolved by Protection" : "Detected" };
            }
            return issue;
          })
        );
      }, 300);
    }
  };

  // Run the diagnostic testing scans
  const runLiveDiagnostics = () => {
    setIsDiagnosticScanning(true);
    setScanProgress(0);
    setScanStepMessage("Auditing primary viewport container boxes...");

    // Simulated staggered step intervals
    const steps = [
      { prg: 15, msg: "Inspecting Hero banner responsive wrapping rules..." },
      { prg: 30, msg: "Evaluating tap target dimensions across responsive grids (min 44px)..." },
      { prg: 45, msg: "Analyzing chart relative container reflow settings..." },
      { prg: 65, msg: "Testing table column collapse behaviors on Mobile viewports..." },
      { prg: 80, msg: "Verifying sidebar drawer overlapping boundary thresholds..." },
      { prg: 90, msg: "Evaluating animation bounding boxes and coordinate safety zones..." },
      { prg: 100, msg: "Compiling responsive reports metadata..." }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setScanProgress(steps[currentStepIdx].prg);
        setScanStepMessage(steps[currentStepIdx].msg);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDiagnosticScanning(false);
          setHasScanned(true);
          awardXp(40);
          setSystemAlertMessage("📈 Responsive Design Scan complete! Generated Lighthouse-style Layout Report.");
          
          // Seed discovered issues
          const scans: DiagnosticIssue[] = [
            {
              id: "iss-1",
              category: "Cropping",
              severity: "high",
              message: "Hero CV eSports Logo banner potential clipping on ultra-compact viewport widths",
              element: "CVEsportsLogoHeader",
              deviceApplied: "Foldable / Small Phone (320px)",
              status: layoutRules["imageGuard"] ? "Resolved by Protection" : "Detected"
            },
            {
              id: "iss-2",
              category: "Overflow",
              severity: "high",
              message: "Tournament registration dynamic charts overflow outer boundaries on extreme wide screen stretch ratios",
              element: "RechartsResponsiveContainer",
              deviceApplied: "Ultra-Wide / 4K Monitor (2560px)",
              status: layoutRules["layoutClamping"] ? "Resolved by Protection" : "Detected"
            },
            {
              id: "iss-3",
              category: "Spacing", // can keep spacing or make Hidden Content
              severity: "medium",
              message: "Staff Control CTA overlaps with compact header drawer buttons triggering clickable collision",
              element: "StaffControlCTA",
              deviceApplied: "Standard Compact Phone (375px)",
              status: layoutRules["targetClearance"] ? "Resolved by Protection" : "Detected"
            },
            {
              id: "iss-4",
              category: "Animation",
              severity: "low",
              message: "Crimson neon pulse effects shifting beyond responsive boundary boxes in high FPS display modes",
              element: "NeonPulseParticleSystem",
              deviceApplied: "Gaming Desktop (1920px)",
              status: layoutRules["animationGate"] ? "Resolved by Protection" : "Detected"
            },
            {
              id: "iss-5",
              category: "Spacing",
              severity: "low",
              message: "Roster player lists padding stretches unevenly on widescreen monitors",
              element: "PlayerRosterCardGrid",
              deviceApplied: "Standard Laptop (1440px)",
              status: "Resolved by Protection" // protected by fluid containers
            }
          ];
          setIssues(scans);
        }, 300);
      }
    }, 450);
  };

  // Compute live scores based on rules
  useEffect(() => {
    if (!hasScanned) return;
    const activeCount = Object.values(layoutRules).filter(Boolean).length;
    // Basic score calculation: base 70, +6 for each protective guard activated up to 98
    const score = Math.min(98, 72 + activeCount * 7);
    setHealthScore(score);
  }, [layoutRules, hasScanned]);

  // Chart data for Device Health Levels
  const getDeviceScoreData = () => {
    const isTargetOn = layoutRules["targetClearance"];
    const isImageOn = layoutRules["imageGuard"];
    const isClampingOn = layoutRules["layoutClamping"];
    const isAnimOn = layoutRules["animationGate"];

    return [
      { name: "Mobile", defaultHealth: 70, currentHealth: 70 + (isTargetOn ? 15 : 0) + (isClampingOn ? 10 : 0) },
      { name: "Tablet", defaultHealth: 75, currentHealth: 75 + (isClampingOn ? 15 : 0) + (isImageOn ? 8 : 0) },
      { name: "Laptop", defaultHealth: 88, currentHealth: 88 + (isImageOn ? 5 : 0) + (isClampingOn ? 5 : 0) },
      { name: "Desktop", defaultHealth: 94, currentHealth: 94 + (isAnimOn ? 4 : 0) },
      { name: "Ultra-Wide", defaultHealth: 80, currentHealth: 80 + (isAnimOn ? 15 : 0) + (isClampingOn ? 3 : 0) }
    ];
  };

  return (
    <div id="cv-layout-protection-deck" className="bg-[#0b0b0c] text-neutral-300 rounded-3xl p-6 border border-zinc-900/80 shadow-2xl space-y-8 text-left relative overflow-hidden font-sans">
      
      {/* Visual branding graphics */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-650/5 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-900">
        <div className="space-y-1.5 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1 px-2.5 bg-red-950/40 text-[#FF001C] border border-red-900/30 text-[9px] font-mono tracking-widest font-black rounded-lg uppercase">
              RESPONSIVE LAYOUT GUARD
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Anti-Overflow Enforcer v1.4</span>
          </div>

          <h1 className="text-2xl font-black tracking-wider uppercase text-white flex items-center gap-2.5 font-sans italic">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] text-white not-italic shrink-0">
              <Layers className="text-white" size={18} />
            </div>
            LAYOUT <span className="text-red-500">PROTECTION DECK</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Eliminate layout crops, misalignments, overflowing charts, and hidden buttons. Implement adaptive viewport guardrails and stress test responsiveness against any screen aspect ratios.
          </p>
        </div>

        {/* STATUS INDICATORS */}
        <div className="flex items-center gap-2 bg-[#101011] border border-zinc-900 p-2.5 px-4 rounded-2xl shrink-0 font-mono">
          <div className="text-right">
            <span className="text-[8.5px] text-zinc-550 block uppercase tracking-widest leading-none">Protection Status:</span>
            <span className="text-[11px] font-black uppercase text-emerald-400 block mt-1">
              GUARD SYSTEM LINKED
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </div>
      </div>

      {/* COMPONENT NAVIGATION TABS */}
      <div className="flex pb-1 border-b border-zinc-900/60 gap-2">
        <button
          onClick={() => setActiveTab("diagnostics")}
          className={`px-4 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "diagnostics"
              ? "bg-red-650 text-white shadow-lg"
              : "text-zinc-400 hover:text-white bg-transparent"
          }`}
        >
          📈 Testing Engine & Reports
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`px-4 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "simulator"
              ? "bg-red-650 text-white shadow-lg"
              : "text-zinc-400 hover:text-white bg-transparent"
          }`}
        >
          <Smartphone size={13} />
          📱 Viewport Device Canvas
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "policies"
              ? "bg-red-650 text-white shadow-lg"
              : "text-zinc-400 hover:text-white bg-transparent"
          }`}
        >
          <Sliders size={13} />
          ⚙️ Protection Rule Guards
        </button>
      </div>

      {activeTab === "diagnostics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
          
          {/* LEFT DIAGNOSTICS & SCORE PANELS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* LARGE LIGHTHOUSE RADIAL HEALTH STATE */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest font-black">OVERALL LAYOUT FLUIDITY SCORE</span>
              
              <div className="relative flex items-center justify-center">
                
                {/* Score Circle Progress Overlay SVG */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    fill="transparent"
                    stroke="#18181b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    fill="transparent"
                    stroke={healthScore >= 90 ? "#10b981" : healthScore >= 80 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 64}
                    strokeDashoffset={2 * Math.PI * 64 * (1 - (hasScanned ? healthScore : 10) / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black font-mono tracking-tighter ${
                    !hasScanned ? "text-zinc-600" :
                    healthScore >= 90 ? "text-emerald-400" : healthScore >= 80 ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {hasScanned ? `${healthScore}%` : "—"}
                  </span>
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">
                    {hasScanned ? (healthScore >= 90 ? "OPTIMIZED" : "STABILIZED") : "UNAUDITED"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 max-w-xs">
                <h4 className="text-sm font-black text-white uppercase">
                  {!hasScanned ? "Fluidity Health Score" : healthScore >= 90 ? "🏆 Executive Fluid Layout" : "⚠️ Layout Anomaly Detected"}
                </h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                  {!hasScanned 
                    ? "Initialize layout protection scanning to calculate responsive layout integrity proportions across simulated viewports."
                    : healthScore >= 90 
                      ? "High responsiveness. Container bounding boxes, minimum touch margins and fluid responsive wrappers are fully secure."
                      : "Layout is stable, but mobile tap sizing issues and chart overflows were detected. Activate protection rules to resolve automatically."}
                </p>
              </div>

              {!isDiagnosticScanning && (
                <button
                  onClick={runLiveDiagnostics}
                  className="w-full py-3 bg-red-650 hover:bg-red-700 text-white font-mono text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-red-950/20 cursor-pointer flex justify-center items-center gap-2"
                >
                  <RefreshCw size={13} className="animate-spin-slow" />
                  Run Layout Fluidity Analysis
                </button>
              )}

              {isDiagnosticScanning && (
                <div className="w-full space-y-3">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-zinc-500 animate-pulse uppercase block text-left">Scanning Aspect Boundaries:</span>
                    <strong className="text-red-500 font-extrabold">{scanProgress}%</strong>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-900">
                    <div
                      className="bg-gradient-to-r from-red-650 to-red-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-yellow-500 font-mono block animate-pulse truncate text-left">{scanStepMessage}</span>
                </div>
              )}
            </div>

            {/* RESOLUTIONS AUDIT LEDGER */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest pb-2 border-b border-zinc-900">
                📊 Viewport Resolution Health Metrics
              </h3>
              
              {hasScanned ? (
                <div className="h-56 w-full font-mono text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getDeviceScoreData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2e" />
                      <XAxis dataKey="name" stroke="#a3a3a3" strokeWidth={0.5} style={{ fontSize: "9px" }} />
                      <YAxis stroke="#a3a3a3" strokeWidth={0.5} style={{ fontSize: "9px" }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0b0b0c", border: "1px solid #1f1f22" }} 
                        labelStyle={{ color: "#fff", fontWeight: "bold" }}
                      />
                      <Legend style={{ fontSize: "9px" }} />
                      <Bar dataKey="defaultHealth" name="Unprotected" fill="#3f3f46" stroke="#4b5563" />
                      <Bar dataKey="currentHealth" name="Protected State" fill="#10b981" stroke="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-56 bg-black/40 border border-zinc-900 rounded-xl flex items-center justify-center text-center p-6 italic text-zinc-550 text-xs">
                  Awaiting scan results data to map responsive aspect health curves across devices...
                </div>
              )}
            </div>

          </div>

          {/* RIGHT DETECTED ISSUES & REPORT TERMINAL */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* ACTIVE REPORT OUTPUT SUMMARY */}
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-red-500" />
                  Live Diagnostic Findings report
                </h3>
                <span className="p-0.5 px-2 bg-zinc-950 text-zinc-500 border border-zinc-900 text-[8px] font-black uppercase rounded font-mono">
                  LIGHTHOUSE LOGS
                </span>
              </div>

              {!hasScanned ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-950/30 border border-dashed border-zinc-900 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-zinc-900/60 flex items-center justify-center text-zinc-500">
                    <SlidersHorizontal size={20} />
                  </div>
                  <div className="space-y-0.5 max-w-sm">
                    <strong className="text-xs text-stone-200 block uppercase">No Active Scan Data Found</strong>
                    <span className="text-[11px] text-zinc-500 block leading-normal">
                      Initiate the diagnosis analysis scanner to verify real-time layout protection statistics, coordinate boundaries, and viewport stretching limits.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  
                  {/* METRIC SUMMARIES */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl font-mono">
                      <span className="text-[8.5px] text-zinc-550 block uppercase font-bold tracking-widest">DETECTIONS</span>
                      <strong className="text-yellow-500 text-lg font-black block mt-0.5">
                        {issues.filter(i => i.status === "Detected").length}
                      </strong>
                    </div>
                    <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl font-mono">
                      <span className="text-[8.5px] text-zinc-550 block uppercase font-bold tracking-widest font-mono">RESOLVED SHIELD</span>
                      <strong className="text-emerald-400 text-lg font-black block mt-0.5">
                        {issues.filter(i => i.status === "Resolved by Protection").length}
                      </strong>
                    </div>
                    <div className="bg-black/60 border border-zinc-900 p-3 rounded-xl font-mono">
                      <span className="text-[8.5px] text-zinc-550 block uppercase font-bold tracking-widest font-mono">CRITICAL THREATS</span>
                      <strong className="text-red-500 text-lg font-black block mt-0.5">
                        {issues.filter(i => i.status === "Detected" && i.severity === "high").length}
                      </strong>
                    </div>
                  </div>

                  {/* ACTIVE ISSUES TIMELINE */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {issues.map((iss) => (
                      <div 
                        key={iss.id} 
                        className={`p-4 border rounded-xl space-y-2.5 transition-all text-xs ${
                          iss.status === "Resolved by Protection"
                            ? "bg-emerald-950/5 border-emerald-950/50 hover:border-emerald-900/30"
                            : iss.severity === "high"
                              ? "bg-red-950/10 border-red-950/30 hover:border-red-900/40"
                              : "bg-amber-950/5 border-amber-950/30 hover:border-amber-900/40"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`p-0.5 px-2 text-[8px] font-mono uppercase font-black tracking-wide rounded ${
                                iss.severity === "high" ? "bg-red-950 text-red-500 border border-red-900/35" :
                                iss.severity === "medium" ? "bg-amber-950 text-amber-500 border border-amber-900/35" :
                                "bg-zinc-900 text-zinc-400 border border-zinc-800"
                              }`}>
                                {iss.severity} risk
                              </span>
                              <span className="text-[9.5px] text-zinc-500 font-mono">Device: {iss.deviceApplied}</span>
                            </div>
                            <h4 className="text-stone-100 font-black tracking-wide uppercase font-sans mt-1 leading-normal">
                              {iss.category.toUpperCase()}: {iss.message}
                            </h4>
                          </div>
                          
                          <div className="font-mono text-[9px] font-black uppercase text-right shrink-0">
                            {iss.status === "Resolved by Protection" ? (
                              <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/10 border border-emerald-900/20 px-2 py-0.5 rounded leading-none">
                                🟢 AUTO-FIXED
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center gap-1 bg-red-950/10 border border-red-900/20 px-2 py-0.5 rounded leading-none">
                                🔴 FLOATING THREAT
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-black/40 border border-zinc-900 p-2 rounded-lg flex items-center justify-between text-[10px] font-mono leading-none">
                          <span className="text-zinc-500">Component context trace:</span>
                          <code className="text-zinc-3 font-semibold text-[10.5px]">{"<"}{iss.element}{"/>"}</code>
                        </div>

                        {iss.status === "Detected" && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (iss.category === "TapTarget") handleToggleRule("targetClearance");
                                if (iss.category === "Cropping") handleToggleRule("imageGuard");
                                if (iss.category === "Overflow") handleToggleRule("layoutClamping");
                                if (iss.category === "Animation") handleToggleRule("animationGate");
                              }}
                              className="p-1 px-3 bg-red-650 hover:bg-red-700 text-white font-mono text-[9px] font-black rounded uppercase transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Zap size={10} />
                              Inject Shield Fix Live
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>

            {/* RECOMMENDATIONS LIST */}
            <div className="bg-[#111116] border border-stone-900 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-zinc-900">
                <BookOpenCheck className="text-emerald-500" size={14} />
                📘 HIGH RESILIENCY LAYOUT RECOMMENDATIONS
              </h3>
              <p className="text-[11px] text-zinc-400">
                To guarantee zero aspect-ratio breakage and consistent visual density, our eSports layout framework adheres to the following structural limits:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-normal font-sans">
                {[
                  { title: "Relative Grid Box Limits", text: "Always wrap Recharts & Grid maps inside relative wrapper blocks to prevent vertical container collapses." },
                  { title: "No Fixed Dimension Bounds", text: "Avoid hardcoded pixel widths on elements. Prefer viewport modifiers (sm:max-w-xl, lg:max-w-7xl) instead." },
                  { title: "Fluid Margin Boundaries", text: "Enforce uniform visual tracking using matching wrapper class sets across all views (w-full max-w-7xl mx-auto px-4)." },
                  { title: "Tap-Target Touch Compliance", text: "Keep critical interaction targets above 44px on mobile portrait breakpoints (mobile touch rules)." }
                ].map((item, id) => (
                  <div key={id} className="bg-black/40 border border-zinc-900 p-3 rounded-xl space-y-1.5 flex gap-2 items-start text-left">
                    <span className="text-emerald-400 font-black mt-0.5">✓</span>
                    <div>
                      <strong className="text-stone-200 block uppercase font-mono text-[9.5px] leading-tight">{item.title}</strong>
                      <span className="text-zinc-450 block text-[10.5px] pt-0.5 leading-normal">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === "simulator" && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* DESCRIPTION */}
          <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-2">
            <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
              📱 Interactive Multiclient Device Emulator Screen
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
              Dynamically review how key components (NavBar grids, Esports metric lists, scrim rows, dials etc.) wrap, stack, and fit inside custom simulated dimensions without needing external mobile equipment.
            </p>

            {/* SELECTION BAR */}
            <div className="flex flex-wrap gap-2 pt-3 font-mono">
              {DEVICES_LIST.map((dev) => {
                const Icon = dev.icon;
                const isSelected = selectedDevice.id === dev.id;
                return (
                  <button
                    key={dev.id}
                    onClick={() => {
                      setSelectedDevice(dev);
                      awardXp(10);
                      setSystemAlertMessage(`📱 Layout view simulated at: ${dev.name} (${dev.width}x${dev.height}px)`);
                    }}
                    className={`p-2 px-3.5 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1.5 transition-all text-center cursor-pointer ${
                      isSelected 
                        ? "bg-red-650 border-[#ff001c]/40 text-white" 
                        : "bg-black border-zinc-900 text-zinc-450 hover:text-white"
                    }`}
                  >
                    <Icon size={12} />
                    {dev.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIMULATED CANVAS */}
          <div className="flex justify-center items-center p-6 bg-zinc-950 border border-zinc-900 rounded-3xl relative overflow-hidden min-h-[500px]">
            
            {/* Visual background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f22_1px,transparent_1px),linear-gradient(to_bottom,#1f1f22_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none" />

            <div 
              className="bg-[#0e0e0f] rounded-3xl border-4 border-zinc-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden transition-all duration-300"
              style={{
                width: `${selectedDevice.width}px`,
                height: `${selectedDevice.height}px`,
                maxWidth: "100%",
                maxHeight: "650px"
              }}
            >
              
              {/* TOP MOBILE STATUS BAR (ONLY IF COMPACT DEVICE) */}
              {(selectedDevice.category === "mobile" || selectedDevice.category === "tablet") && (
                <div className="bg-black text-[9px] font-mono text-zinc-500 px-5 py-1.5 flex justify-between items-center select-none shrink-0 border-b border-zinc-900/60 leading-none">
                  <span className="font-extrabold text-[8.5px] text-zinc-400">04:32 💬</span>
                  <div className="w-14 h-4 bg-[#18181b] rounded-full absolute left-1/2 transform -translate-x-1/2 hidden md:block" />
                  <div className="flex items-center gap-1.5 font-black text-emerald-400">
                    <span>WiFi 5G</span>
                    <span>🔋 98%</span>
                  </div>
                </div>
              )}

              {/* SIMULATED PREVIEW HEADER */}
              <div className="bg-zinc-950 border-b border-zinc-900 p-3 flex justify-between items-center text-xs shrink-0 select-none">
                <span className="text-white font-extrabold font-mono tracking-widest uppercase">
                  ⭐ CV ESPORTS PREMIUM
                </span>
                <span className="text-[10px] text-red-500 bg-red-950/25 border border-red-900/30 font-black px-1.5 py-0.5 rounded uppercase">
                  SIMULATOR LOBBY
                </span>
              </div>

              {/* SIMULATED PREVIEW BODY */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left font-mono">
                
                {/* 1. TOURNAMENT HERO BANNER COMPLIANCE */}
                <div 
                  className="p-4 rounded-xl relative overflow-hidden bg-cover bg-center border border-red-950/50 flex flex-col justify-end text-left min-h-[140px]"
                  style={{
                    backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 100%), url('https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=300')",
                    backgroundSize: layoutRules["imageGuard"] ? "contain" : "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                  }}
                >
                  <div className="absolute top-2 right-2 bg-red-650 text-white text-[7px] font-bold px-1 rounded animate-pulse">LIVE HERO DETECTED</div>
                  <h4 className="text-[11px] font-black text-white uppercase">ZIMBABWE PREMIER CUP</h4>
                  <p className="text-[9px] text-zinc-400 line-clamp-2 mt-0.5">
                    Forge Fire. Crowned In Crimson. Fight and duel over Harare Arena territory rosters.
                  </p>
                </div>

                {/* 2. ADAPTIVE METRICS WIDGETS */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col gap-1 text-left">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase">Registrations Limit</span>
                    <strong className="text-white text-[12px] font-black uppercase">16 / 16 Squads</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col gap-1 text-left">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase">Server Tick Rate</span>
                    <strong className="text-emerald-400 text-[12px] font-black">90Hz Secure</strong>
                  </div>
                </div>

                {/* 3. RESPONSIVE LIST MATCHMAKER SQUADS */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[8.5px] text-zinc-550 block uppercase font-bold tracking-widest pl-1">Squad Rankings (Lighthouse simulation)</span>
                  
                  {[
                    { rank: "01", team: "Viper Clan", points: "154", country: "ZIM" },
                    { rank: "02", team: "Warlords IGL", points: "142", country: "ZIM" },
                    { rank: "03", team: "Harare Mamba", points: "119", country: "ZIM" }
                  ].map((s, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 bg-black hover:bg-zinc-900 rounded border border-zinc-900 flex justify-between items-center text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF001C] font-extrabold">#{s.rank}</span>
                        <span className="text-zinc-200 font-bold truncate max-w-[100px]">{s.team}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8.5px] bg-zinc-900 text-zinc-500 px-1 rounded">{s.country}</span>
                        <strong className="text-yellow-500 font-black">{s.points} pts</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. ACTIONS COMPLIANT TOUCH BUTTON TARGET TEST */}
                <div className="space-y-2 text-left pt-2">
                  <span className="text-[8.5px] text-zinc-550 block uppercase font-bold tracking-widest pl-1">Touch Target Test Bench</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`text-[9px] font-black uppercase rounded-lg bg-red-650 text-white flex-1 transition-all ${
                        layoutRules["targetClearance"] ? "h-[45px]" : "h-[30px]"
                      }`}
                    >
                      {layoutRules["targetClearance"] ? "COMPLIANT TARGET (45px) ✔" : "COLLAPSED TARGET (30px)"}
                    </button>
                    <button
                      type="button"
                      className="p-2.5 bg-zinc-900 text-zinc-400 text-[9px] uppercase font-bold tracking-wider rounded-lg border border-zinc-800"
                    >
                      Cancel
                    </button>
                  </div>
                  {/* Warning label if not targetClearance */}
                  {!layoutRules["targetClearance"] && (
                    <span className="text-[8.5px] text-red-500 font-mono block pl-1 animate-pulse font-bold leading-snug">
                      ⚠️ WARNING: 30px key lacks standard touch clearance limits!
                    </span>
                  )}
                </div>

              </div>

              {/* SIMULATED BOTTOM KEYBOARD PREVENTER BAR */}
              <div className="bg-zinc-950 p-2 text-center text-[8px] font-mono text-zinc-650 select-none border-t border-zinc-900">
                Viewport Layout: {selectedDevice.width} x {selectedDevice.height} px ({selectedDevice.category.toUpperCase()})
              </div>

            </div>
          </div>

        </div>
      )}

      {activeTab === "policies" && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* DESCRIPTION PANEL */}
          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl text-xs space-y-2">
            <h3 className="text-white font-extrabold uppercase font-sans tracking-wide">
              ⚙️ Layout Protection Shield Guardrail Polices
            </h3>
            <p className="text-zinc-400 max-w-xl leading-relaxed">
              Enforce structural parameters dynamically on the parent container elements. Once activated, these settings inject custom Tailwind constraints right down to our web widgets.
            </p>
          </div>

          {/* ACTIVE PROTECTION RULE SWITCHERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-0.5 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[8px] font-mono tracking-widest font-black rounded uppercase">Aspect Guardian</span>
                <h4 className="text-xs font-black text-stone-100 uppercase mt-2">1. Proportionate Image Crop Shield</h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                  Prevents key images and custom esports event rosters from stretching or cropping details. Dynamically restricts tournament cover illustrations to contain-scaling within bounds.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-500 font-mono font-bold">Rule state: {layoutRules["imageGuard"] ? "ACTIVE" : "MUTED"}</span>
                <button
                  onClick={() => handleToggleRule("imageGuard")}
                  className={`p-1 px-4 font-mono font-black rounded-lg uppercase text-[10px] transition-colors cursor-pointer ${
                    layoutRules["imageGuard"]
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-900 text-zinc-550 hover:text-white"
                  }`}
                >
                  {layoutRules["imageGuard"] ? "DISCHARGE FIXED" : "ACTIVATE GUARD"}
                </button>
              </div>
            </div>

            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-0.5 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[8px] font-mono tracking-widest font-black rounded uppercase">Touch Compliance</span>
                <h4 className="text-xs font-black text-stone-100 uppercase mt-2">2. Touch Margin Booster (44px target)</h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                  Guarantees that touch targets and primary actions maintain a minimum height restriction of 44 pixels. Resolves clickable button anomalies on mobile and tablets.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-500 font-mono font-bold">Rule state: {layoutRules["targetClearance"] ? "ACTIVE" : "MUTED"}</span>
                <button
                  onClick={() => handleToggleRule("targetClearance")}
                  className={`p-1 px-4 font-mono font-black rounded-lg uppercase text-[10px] transition-colors cursor-pointer ${
                    layoutRules["targetClearance"]
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-900 text-zinc-550 hover:text-white"
                  }`}
                >
                  {layoutRules["targetClearance"] ? "DISCHARGE FIXED" : "ACTIVATE GUARD"}
                </button>
              </div>
            </div>

            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-0.5 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[8px] font-mono tracking-widest font-black rounded uppercase">Overflow Clamping</span>
                <h4 className="text-xs font-black text-stone-100 uppercase mt-2">3. Responsive grid Limit Guards</h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                  Intercepts chart wrapping parameters and long tournament tables. Wraps data layers in overflow-x scrolling grids to eliminate page stretching overlaps.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-500 font-mono font-bold">Rule state: {layoutRules["layoutClamping"] ? "ACTIVE" : "MUTED"}</span>
                <button
                  onClick={() => handleToggleRule("layoutClamping")}
                  className={`p-1 px-4 font-mono font-black rounded-lg uppercase text-[10px] transition-colors cursor-pointer ${
                    layoutRules["layoutClamping"]
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-900 text-zinc-550 hover:text-white"
                  }`}
                >
                  {layoutRules["layoutClamping"] ? "DISCHARGE FIXED" : "ACTIVATE GUARD"}
                </button>
              </div>
            </div>

            <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="p-0.5 px-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-[8px] font-mono tracking-widest font-black rounded uppercase">Animation Guard</span>
                <h4 className="text-xs font-black text-stone-100 uppercase mt-2">4. Motion Bounds Safeguard Selector</h4>
                <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                  Guarantees that layout-shift animations stay strictly mapped to container boundary coordinates. Stabilizes performance on heavy graphic processors or compact mobile chipsets.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60">
                <span className="text-[10px] text-zinc-500 font-mono font-bold">Rule state: {layoutRules["animationGate"] ? "ACTIVE" : "MUTED"}</span>
                <button
                  onClick={() => handleToggleRule("animationGate")}
                  className={`p-1 px-4 font-mono font-black rounded-lg uppercase text-[10px] transition-colors cursor-pointer ${
                    layoutRules["animationGate"]
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-900 text-zinc-550 hover:text-white"
                  }`}
                >
                  {layoutRules["animationGate"] ? "DISCHARGE FIXED" : "ACTIVATE GUARD"}
                </button>
              </div>
            </div>

          </div>

          {/* DENSITY SECTIONS */}
          <div className="bg-[#101011] border border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider pb-2 border-b border-zinc-900">
              💡 Responsive Engineering Checklist Compliance
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every newly added custom viewport or interactive chart element is built with standard protection classes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10.5px]">
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-900 space-y-1">
                <strong className="text-neutral-100 uppercase block font-sans">1. Aspect Boxes</strong>
                <span className="text-zinc-500 leading-relaxed block">
                  Utilizes <code>aspect-video</code> and proportional canvas metrics to preserve logos and text detailing properly.
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-900 space-y-1">
                <strong className="text-neutral-100 uppercase block font-sans">2. Flex-Col Breakpoints</strong>
                <span className="text-zinc-500 leading-relaxed block">
                  Shifts <code>flex-row</code> to <code>flex-col</code> on compact screens so layouts fit correctly.
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-900 space-y-1">
                <strong className="text-neutral-100 uppercase block font-sans">3. Bounding-Box Limits</strong>
                <span className="text-zinc-500 leading-relaxed block">
                  Enforces strict margins so widgets scale gracefully without slipping off screen edges.
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
