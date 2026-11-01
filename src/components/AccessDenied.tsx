import React from "react";
import { ShieldAlert, Home, Mail } from "lucide-react";
import { motion } from "motion/react";

interface AccessDeniedProps {
  onReturnHome: () => void;
  onContactSupport: () => void;
  title?: string;
  description?: string;
}

export default function AccessDenied({ 
  onReturnHome, 
  onContactSupport,
  title = "ACCESS DENIED",
  description = "You do not have permission to access this section."
}: AccessDeniedProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-[#0f0506]/95 border-2 border-red-900/40 p-10 rounded-2xl text-center space-y-6 max-w-lg mx-auto shadow-[0_0_50px_rgba(255,0,31,0.15)] relative overflow-hidden font-mono"
    >
      {/* Target/reticle corner decorations */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-red-500/70" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-red-500/70" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-red-500/70" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-red-500/70" />
      
      {/* Radar sweeping visual accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="flex flex-col items-center text-center space-y-4 relative z-10">
        <div className="w-16 h-16 bg-red-950/45 border border-red-500 rounded-full flex items-center justify-center text-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <ShieldAlert size={28} />
        </div>
        
        <h2 className="text-lg font-black font-orbitron tracking-[0.2em] text-[#ff2e43] uppercase">
          🚫 {title}
        </h2>
        
        <p className="text-xs text-zinc-300 max-w-md leading-relaxed">
          {description}
        </p>
        
        <div className="w-full h-[1px] bg-red-950/60 my-2" />
        
        <p className="text-[9px] text-zinc-500 max-w-sm leading-relaxed uppercase">
          SECURITY PROTOCOL SEC_NODE_9X ACTIVE. UNAUTHORIZED REQUESTS LOGGED FOR COMPLIANCE REVIEW.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center relative z-10">
        <button
          onClick={onReturnHome}
          className="px-5 py-2 bg-red-900 hover:bg-red-700 text-white font-mono text-[10px] font-black rounded border border-red-650 cursor-pointer uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center justify-center gap-1.5"
        >
          <Home size={12} />
          <span>Return Home</span>
        </button>
        <button
          onClick={onContactSupport}
          className="px-5 py-2 bg-neutral-950 hover:bg-neutral-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 font-mono text-[10px] font-black rounded cursor-pointer uppercase transition-all flex items-center justify-center gap-1.5"
        >
          <Mail size={12} />
          <span>Contact Support</span>
        </button>
      </div>
    </motion.div>
  );
}
