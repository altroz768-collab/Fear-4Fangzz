import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, Activity, Wifi, ShieldAlert, CheckCircle2, RefreshCw, ChevronRight, Zap
} from "lucide-react";
import { ArenaRegion } from "../types/tdm";

interface TdmConnectionTestProps {
  currentRegion: ArenaRegion;
  regionLocked: boolean;
  onSelectAndLockRegion: (region: ArenaRegion) => void;
}

interface TestMetrics {
  ping: number;
  loss: string;
  jitter: string;
  stability: string;
  quality: "EXCELLENT" | "STABLE" | "HIGH-DELAY" | "UNPLAYABLE";
}

export default function TdmConnectionTest({ 
  currentRegion, 
  regionLocked, 
  onSelectAndLockRegion 
}: TdmConnectionTestProps) {
  const [testState, setTestState] = useState<"idle" | "scanning" | "completed">("idle");
  const [scanStep, setScanStep] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<ArenaRegion>(currentRegion);
  const [scanProgress, setScanProgress] = useState(0);

  // High-fidelity latency metrics
  const regionMetrics: Record<ArenaRegion, TestMetrics> = {
    "Africa": { ping: 24, loss: "0.0%", jitter: "1.2ms", stability: "99.8%", quality: "EXCELLENT" },
    "Europe": { ping: 165, loss: "1.2%", jitter: "8.4ms", stability: "97.4%", quality: "HIGH-DELAY" },
    "Asia": { ping: 220, loss: "4.5%", jitter: "12.6ms", stability: "92.1%", quality: "UNPLAYABLE" },
    "Middle East": { ping: 98, loss: "0.0%", jitter: "4.1ms", stability: "98.9%", quality: "STABLE" },
    "North America": { ping: 190, loss: "2.1%", jitter: "9.2ms", stability: "96.5%", quality: "HIGH-DELAY" },
    "South America": { ping: 240, loss: "3.2%", jitter: "14.8ms", stability: "91.8%", quality: "UNPLAYABLE" },
    "Oceania": { ping: 290, loss: "5.8%", jitter: "18.3ms", stability: "88.5%", quality: "UNPLAYABLE" }
  };

  const steps = [
    "Pinging edge-node DNS servers...",
    "Sending 128-byte UDP trace buffers...",
    "Measuring packet delivery & jitter variance...",
    "Analyzing routing hop consistency...",
    "Calculating regional integrity certificate..."
  ];

  const handleStartTest = () => {
    setTestState("scanning");
    setScanProgress(0);
    setScanStep(0);
  };

  useEffect(() => {
    if (testState !== "scanning") return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTestState("completed");
          // Auto-recommend Africa as best since it has 24ms
          setSelectedOpt("Africa");
          return 100;
        }
        
        // Advance step
        const stepIndex = Math.floor((next / 100) * steps.length);
        setScanStep(Math.min(stepIndex, steps.length - 1));
        
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [testState]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "EXCELLENT": return "text-emerald-400 border-emerald-800/30 bg-emerald-950/20";
      case "STABLE": return "text-blue-400 border-blue-800/30 bg-blue-950/20";
      case "HIGH-DELAY": return "text-amber-400 border-amber-800/30 bg-amber-950/20";
      default: return "text-red-500 border-red-950 bg-red-955/20";
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-6 text-left relative overflow-hidden" id="connection-test-container">
      {/* Background neon style accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/10 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="border-b border-zinc-900 pb-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-955/25 border border-[#ff001c]/30 rounded-full text-[9px] text-[#ff001c] font-bold tracking-wider font-mono">
            <Activity size={10} className="animate-pulse" />
            SMART REGION AUDIT SENSOR
          </span>
          <h3 className="text-sm font-black font-orbitron text-white uppercase tracking-wider">
            Network Latency Diagnostics & Region Locking
          </h3>
          <p className="text-[10px] text-zinc-550 max-w-xl leading-relaxed">
            Esports integrity requires players to play on stable, low-ping connections. Run the connection test to analyze current networks and lock your competitive arena location.
          </p>
        </div>

        {regionLocked ? (
          <span className="bg-[#ff001c]/10 text-[#ff001c] border border-[#ff001c]/30 text-[9px] px-2.5 py-1.5 rounded-md font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-500" />
            Season Region Locked
          </span>
        ) : (
          <button
            onClick={handleStartTest}
            disabled={testState === "scanning"}
            className="shrink-0 bg-red-955/20 hover:bg-[#ff001c] text-[#ff001c] hover:text-white border border-[#ff001c]/30 hover:border-transparent font-mono font-bold uppercase text-[9.5px] tracking-wider py-2 px-3.5 rounded-lg transition-all duration-150 flex items-center gap-1.5"
            id="start-connection-test-btn"
          >
            <RefreshCw size={11} className={testState === "scanning" ? "animate-spin" : ""} />
            {testState === "scanning" ? "Scanning Pings..." : "Initiate Network Test"}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {testState === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-4 font-mono text-[10px]"
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[#ff001c] font-bold tracking-widest uppercase">
                {steps[scanStep]}
              </span>
              <span className="text-zinc-500">{scanProgress}%</span>
            </div>

            {/* Simulated tracer logs */}
            <div className="bg-black/85 p-3 rounded-lg border border-zinc-900 text-[8.5px] text-zinc-550 leading-relaxed font-mono space-y-1 select-none">
              <p className="text-zinc-400"># Tracert sequence running. Hop Count: 14</p>
              <p>&gt; ping-test-core-edge.cv-arena.net [184.22.95.10] with 32 bytes of data</p>
              <p>&gt; Reply from 184.22.95.10: bytes=32 time={regionMetrics[selectedOpt].ping}ms TTL=54</p>
              {scanProgress > 30 && <p className="text-zinc-400">&gt; Jitter calculations stable. Standard deviation: {regionMetrics[selectedOpt].jitter}</p>}
              {scanProgress > 60 && <p className="text-zinc-400">&gt; ICMP Packet Audit: Transmitted=10, Received=10, Lost=0 (0% Loss)</p>}
              {scanProgress > 80 && <p className="text-emerald-500 font-bold">&gt; CRYPTOGRAPHIC GATEWAY HANDSHAKE CONFIRMED</p>}
            </div>

            {/* Slider bar */}
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-[#ff001c] rounded-full transition-all duration-75"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </motion.div>
        )}

        {(testState === "completed" || testState === "idle") && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Table of Regions */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-[8.5px] uppercase">
                    <th className="py-2 pl-3">Region Grid</th>
                    <th className="py-2 text-center">Avg Ping</th>
                    <th className="py-2 text-center">Jitter Jive</th>
                    <th className="py-2 text-center">Packet Loss</th>
                    <th className="py-2 text-center">Stability Index</th>
                    <th className="py-2 text-center">Eligibility Rating</th>
                    {!regionLocked && <th className="py-2 text-right pr-3">Selection</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40">
                  {(Object.keys(regionMetrics) as ArenaRegion[]).map((region) => {
                    const metrics = regionMetrics[region];
                    const isSelected = selectedOpt === region;
                    const isRecommended = region === "Africa"; // lowest ping in test preset

                    return (
                      <tr 
                        key={region} 
                        onClick={() => {
                          if (!regionLocked && testState === "completed") {
                            setSelectedOpt(region);
                          }
                        }}
                        className={`transition-all ${
                          !regionLocked && testState === "completed" ? "cursor-pointer hover:bg-zinc-900/20" : ""
                        } ${isSelected ? "bg-red-955/5" : ""}`}
                      >
                        <td className="py-2.5 pl-3 font-bold text-stone-200 flex items-center gap-1.5">
                          <Globe size={11} className={isRecommended ? "text-[#ff001c]" : "text-zinc-500"} />
                          {region}
                          {isRecommended && (
                            <span className="text-[7.5px] bg-[#ff001c]/15 text-[#ff001c] px-1 py-0.2 rounded font-black border border-[#ff001c]/25 tracking-widest uppercase">
                              RECOMMENDED
                            </span>
                          )}
                        </td>
                        <td className={`py-2.5 text-center font-black ${
                          metrics.ping < 50 ? "text-emerald-400" :
                          metrics.ping < 120 ? "text-blue-400" :
                          metrics.ping < 200 ? "text-amber-500" : "text-red-500"
                        }`}>
                          {metrics.ping}ms
                        </td>
                        <td className="py-2.5 text-center text-zinc-400">{metrics.jitter}</td>
                        <td className="py-2.5 text-center text-zinc-400">{metrics.loss}</td>
                        <td className="py-2.5 text-center text-zinc-400">{metrics.stability}</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 text-[8.5px] border font-black rounded ${getQualityColor(metrics.quality)}`}>
                            {metrics.quality}
                          </span>
                        </td>
                        {!regionLocked && (
                          <td className="py-2.5 text-right pr-3">
                            <div className="flex justify-end">
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected ? "border-[#ff001c] bg-[#ff001c]/20 text-[#ff001c]" : "border-zinc-800"
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-[#ff001c] rounded-full" />}
                              </span>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {testState === "completed" && !regionLocked && (
              <div className="bg-[#1c0a0a]/20 border border-red-950/40 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold font-mono">
                    <ShieldAlert size={14} className="text-[#ff001c]" />
                    <span>CRITICAL REGION LOCK DECREE</span>
                  </div>
                  <p className="text-[9.5px] text-zinc-550 leading-relaxed font-mono">
                    Locking region binds your competitive rankings, leaderboards, and MMR to <strong className="text-white">{selectedOpt} Network</strong>. You cannot change this for the current active season!
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectAndLockRegion(selectedOpt);
                    setTestState("idle");
                  }}
                  className="bg-[#ff001c] hover:bg-[#ff1a33] text-white font-mono font-black uppercase text-[9.5px] tracking-wider py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(255,0,28,0.3)] select-none cursor-pointer shrink-0"
                  id="confirm-lock-region-btn"
                >
                  Lock Seasonal Region: {selectedOpt}
                </button>
              </div>
            )}

            {testState === "idle" && !regionLocked && (
              <div className="text-center py-4 bg-zinc-900/10 rounded-xl border border-dashed border-zinc-900 font-mono text-[9px] text-zinc-500 uppercase">
                STANDBY: Run the connection test to enable competitive region choosing and locking.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
