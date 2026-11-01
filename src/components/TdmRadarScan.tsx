import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radio, Crosshair, Target, Shield, Cpu } from "lucide-react";

interface TdmRadarScanProps {
  step: number; // 1: scanning, 2: compiling, 3: acquired
  userTier?: string;
}

export default function TdmRadarScan({ step, userTier = "Platinum" }: TdmRadarScanProps) {
  const [blips, setBlips] = useState<{ id: number; x: number; y: number; size: number; delay: number; active: boolean }[]>([]);

  // Generate randomized radar blips representing wait-listed opponents
  useEffect(() => {
    if (step === 1) {
      // Initialize with a few ambient wait-listed background signals
      setBlips([
        { id: 1, x: 25, y: 35, size: 6, delay: 0.2, active: true },
        { id: 2, x: 70, y: 20, size: 4, delay: 0.8, active: true },
        { id: 3, x: 80, y: 75, size: 5, delay: 1.4, active: true },
        { id: 4, x: 30, y: 80, size: 4, delay: 0.5, active: false }
      ]);
    } else if (step === 2) {
      // Activate more candidates as matching filters apply
      setBlips(prev =>
        prev.map(b => (b.id === 4 ? { ...b, active: true } : b)).concat([
          { id: 5, x: 45, y: 22, size: 8, delay: 0.1, active: true },
          { id: 6, x: 58, y: 65, size: 7, delay: 0.3, active: true }
        ])
      );
    }
  }, [step]);

  // Determine current status message text
  const getStatusText = () => {
    switch (step) {
      case 1:
        return "BROADCASTING PING BEACON...";
      case 2:
        return "COMPILING CHANNELS...";
      case 3:
        return "HANDSHAKE LOCKED!";
      default:
        return "STANDBY";
    }
  };

  const getSubText = () => {
    switch (step) {
      case 1:
        return "Searching matching tier pool matches...";
      case 2:
        return `Evaluating waitlist latency bounds vs ${userTier}...`;
      case 3:
        return "Calibrating tactical mainframe for duel...";
      default:
        return "Ready to boot socket.";
    }
  };

  return (
    <div className="relative w-full h-44 bg-[#050505] rounded-xl border border-zinc-900/80 overflow-hidden flex flex-col md:flex-row items-center justify-between p-4 gap-4 select-none">
      
      {/* LEFT: INTERACTIVE RADAR WAVE STAGE */}
      <div className="relative w-36 h-36 aspect-square rounded-full border border-zinc-900 bg-[#070707] flex items-center justify-center shrink-0">
        
        {/* Concentric Circle Rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-zinc-900/60" />
        <div className="absolute w-[55%] h-[55%] rounded-full border border-zinc-900/40" />
        <div className="absolute w-[30%] h-[30%] rounded-full border border-zinc-900/20" />

        {/* Crosshair grids */}
        <div className="absolute h-full w-[1px] bg-zinc-900/50" />
        <div className="absolute w-full h-[1px] bg-zinc-900/50" />

        {/* Pulsing Concentric Waves */}
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className="absolute w-[50%] h-[50%] rounded-full bg-red-500/10 border border-red-500/20 pointer-events-none"
        />

        {/* Sweep Scan Wedge - Infinite rotation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          style={{ originX: "50%", originY: "50%" }}
          className="absolute inset-0 w-full h-full rounded-full pointer-events-none origin-center"
        >
          {/* Half line sweep wedge */}
          <div 
            className="absolute top-0 left-1/2 w-1/2 h-1/2" 
            style={{ 
              background: "linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0) 65%)",
              transformRule: "preserve-3d",
              transformOrigin: "0% 100%",
              transform: "rotate(-25deg)"
            }} 
          />
          <div className="absolute top-0 left-1/2 w-[1.5px] h-1/2 bg-red-500/50" />
        </motion.div>

        {/* Interactive Random Blips (Waiting Applicants) */}
        <AnimatePresence>
          {blips.map(
            (blip) =>
              blip.active && (
                <motion.div
                  key={blip.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0.4], scale: [1, 1.2, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, delay: blip.delay }}
                  className="absolute rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                  style={{
                    left: `${blip.x}%`,
                    top: `${blip.y}%`,
                    width: `${blip.size}px`,
                    height: `${blip.size}px`
                  }}
                />
              )
          )}
        </AnimatePresence>

        {/* LOCKED TARGET TARGET MATCH AT CENTER (Step 3: Matches found) */}
        <AnimatePresence>
          {step === 3 && (
            <>
              {/* Outer pulsing ring lock and indicator pointer */}
              <motion.div
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, type: "spring", damping: 15 }}
                className="absolute w-12 h-12 rounded-full border border-red-500 flex items-center justify-center bg-red-950/20"
                style={{ left: "calc(50% - 24px)", top: "calc(50% - 24px)" }}
              >
                <Crosshair size={18} className="text-[#ff001c] animate-spin-slow" />
              </motion.div>

              {/* Pulsing Dot pinpoint */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ff001c]"
                style={{ left: "calc(50% - 5px)", top: "calc(50% - 5px)" }}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: TEXT AND DISPATCH telemetry MODULE */}
      <div className="flex-1 space-y-2 text-left w-full">
        <div className="flex items-center gap-1.5 justify-between border-b border-zinc-900 pb-1.5">
          <div className="flex items-center gap-1">
            <Radio size={12} className={`text-red-500 ${step < 3 ? "animate-pulse" : ""}`} />
            <span className="text-[9px] font-mono font-black tracking-widest text-[#ff001c] block uppercase">
              AUTO-MATCHMAKER SIMULATION
            </span>
          </div>
          <span className="text-[8px] font-mono text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900">
            PING RANGE : &lt;15ms
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h5 className="text-[11px] font-mono font-black text-white uppercase tracking-widest">
              {getStatusText()}
            </h5>
            {step === 3 ? (
              <span className="px-1 py-px bg-red-950/60 text-[7px] text-red-400 font-extrabold rounded border border-red-500/20 tracking-wider font-mono animate-bounce uppercase">
                TARGET FOUND
              </span>
            ) : (
              <span className="px-1 py-px bg-zinc-900 text-[7px] text-zinc-500 font-bold rounded tracking-wider font-mono animate-pulse uppercase">
                SEARCHING
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
            {getSubText()}
          </p>
        </div>

        {/* Dynamic telemetry indicators bar progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
            <span>RADAR GAIN SENSITIVITY: 98.4%</span>
            <span>STAGE: {step} / 3</span>
          </div>
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "33%" }}
              animate={{ 
                width: step === 1 ? "33%" : step === 2 ? "70%" : "100%" 
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-red-650"
            />
          </div>
        </div>

        {/* Additional status logs ticker mini */}
        <div className="flex gap-2 text-[8px] font-mono text-zinc-650 pt-0.5">
          <span className="flex items-center gap-1">
            <Target size={8} /> BEACON: ACTIVE
          </span>
          <span className="flex items-center gap-1">
            <Shield size={8} /> FILTER: {userTier.toUpperCase()} TIERS
          </span>
          <span className="flex items-center gap-1">
            <Cpu size={8} /> CORE: ONLINE
          </span>
        </div>
      </div>

    </div>
  );
}
