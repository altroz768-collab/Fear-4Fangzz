import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Maximize2, 
  Minimize2, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Smile, 
  Compass, 
  ShieldAlert, 
  Clock 
} from "lucide-react";
import { FeedPost, UserRole } from "../types";

interface ExpandableCommentAreaProps {
  post: FeedPost;
  commentInput: string;
  onChangeCommentInput: (val: string) => void;
  onSubmitComment: () => void;
  session: { ign: string; role: UserRole; coins: number };
  awardXp: (amount: number) => void;
  setSystemAlertMessage: (msg: string) => void;
}

export default function ExpandableCommentArea({
  post,
  commentInput,
  onChangeCommentInput,
  onSubmitComment,
  session,
  awardXp,
  setSystemAlertMessage
}: ExpandableCommentAreaProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [characterLimit] = useState(400);
  const [activeMacroCategory, setActiveMacroCategory] = useState<"intel" | "orders" | "emoji">("intel");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 250)}px`;
    }
  }, [commentInput]);

  const insertMacro = (macroText: string) => {
    onChangeCommentInput(commentInput ? `${commentInput} ${macroText}` : macroText);
    awardXp(2);
    setSystemAlertMessage(`🎮 Injected tactical macro: "${macroText}"`);
    // Focus back on the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmitComment();
    }
  };

  const macros = {
    intel: [
      { text: "📍 Pochinki Hills Recon", value: "📍 Pochinki Hills Recon: " },
      { text: "👁️ Squad Sighted", value: "👁️ SQUAD SIGHTED AT COORD: " },
      { text: "📦 Air Drop Incoming", value: "📦 AIR DROP CRATE SECURED AT: " },
      { text: "⚠️ Minefield / Trap Alert", value: "⚠️ WATCH FOR LANDMINES/HOLD POINT AT: " }
    ],
    orders: [
      { text: "🔄 Rotate North-West", value: "🔄 ROTATION ALERT: Pulling North-West route. " },
      { text: "🛡️ Secure Compound", value: "🛡️ COMPOUND SECURE: Establish crossfire setup at building. " },
      { text: "⚡ Hard Push / Ambush", value: "⚡ SPEED ENGAGEMENT: High-speed rotation ambush on: " },
      { text: "🚫 Avoid Sector", value: "🚫 FLANK AVOIDANCE: Steer clear of choke points near: " }
    ],
    emoji: [
      { text: "🔥 Meta", value: "🔥 " },
      { text: "🎯 Target", value: "🎯 " },
      { text: "👑 GG", value: "👑 " },
      { text: "💀 Wiped", value: "💀 " }
    ]
  };

  return (
    <div id={`comments-section-${post.id}`} className="bg-[#0A0A0A] p-4 rounded-xl space-y-3 text-[11px] border border-gray-800/60 mt-2">
      {/* Discussion Header */}
      <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-2">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
          <MessageSquare size={11} className="text-red-500 animate-pulse" />
          <span>Strategy Briefing Discussion ({post.comments.length})</span>
        </h4>
        <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
          Intranet Node Stable
        </span>
      </div>

      {/* Existing Comments */}
      {post.comments.length > 0 ? (
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
          {post.comments.map((comm) => (
            <div 
              key={comm.id} 
              id={`comment-item-${comm.id}`}
              className="border-b border-[#1A1A1A]/80 pb-2 last:border-0 last:pb-0 flex flex-col sm:flex-row justify-between text-gray-300 gap-1.5"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 bg-red-950/40 border border-red-500/20 text-red-400 font-mono text-[8px] font-extrabold rounded uppercase tracking-wider">
                    {comm.role}
                  </span>
                  <span className="text-white font-bold font-mono">@{comm.author}:</span>
                </div>
                <p className="select-text whitespace-pre-wrap text-gray-300 font-sans pl-2 border-l border-red-900/30">
                  {comm.text}
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 text-zinc-500 font-mono text-[8px] uppercase">
                <Clock size={8} />
                <span>{new Date(comm.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-550 text-[10.5px] italic font-sans py-1">
          No strategic analysis feedback submitted yet. Start the briefing below!
        </p>
      )}

      {/* Add Comment Input (Expandable Strategy Textarea) */}
      <div id={`comment-composer-${post.id}`} className="space-y-2 pt-2 border-t border-gray-800/50">
        <div className="flex justify-between items-center bg-[#111111] px-2 py-1.5 rounded-t-lg border-t border-x border-gray-800">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse shrink-0" />
            <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider">
              {isMaximized ? "Tactical Blueprint Draft Mode (Maximized)" : "Tactical Briefing Draft Pad"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`btn-maximize-comment-${post.id}`}
              type="button"
              onClick={() => {
                setIsMaximized(!isMaximized);
                awardXp(3);
                setSystemAlertMessage(isMaximized ? "Collapsed strategy drafting workspace." : "Expanded strategy drafting workspace to full professional draft mode!");
              }}
              className="p-1 text-gray-400 hover:text-white hover:bg-zinc-900 rounded transition-colors flex items-center gap-1 font-mono text-[8px] uppercase font-bold cursor-pointer"
              title={isMaximized ? "Collapse to Compact Pad" : "Expand to Full Strategic Workspace"}
            >
              {isMaximized ? (
                <>
                  <Minimize2 size={10} className="text-red-500" />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <Maximize2 size={10} className="text-red-500" />
                  <span>Expand Workspace</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            id={`comment-textarea-${post.id}`}
            rows={isMaximized ? 6 : 2}
            maxLength={characterLimit}
            placeholder={
              isMaximized
                ? "Draft your high-fidelity rotation blueprint, squad commands, or detailed map feedback here. Click any helper macros below to inject instant strategic telemetry data directly..."
                : "Discuss strategy, suggest rotations, analyze tactical options, or post coordinates..."
            }
            value={commentInput}
            onChange={(e) => onChangeCommentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className={`w-full bg-[#151515] border-x border-b border-gray-800 rounded-b-lg p-3 text-[11px] text-white focus:outline-none focus:border-red-600/50 font-sans placeholder-gray-600 transition-all duration-300 ${
              isMaximized ? "min-h-[140px] text-xs font-mono font-medium leading-relaxed" : "min-h-[50px]"
            }`}
          />
          
          {/* Live Character Count Indicator */}
          <span className="absolute bottom-2.5 right-2.5 font-mono text-[8px] text-zinc-500 select-none">
            {commentInput.length} / {characterLimit}
          </span>
        </div>

        {/* Maximized Toolbelt (Macros/Shortcuts) */}
        <AnimatePresence>
          {isMaximized && (
            <motion.div
              id={`macro-toolbelt-${post.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#0e0e0e] border border-gray-800/80 rounded-xl p-3 space-y-2.5 overflow-hidden"
            >
              <div className="flex gap-2 border-b border-zinc-900 pb-1.5">
                {(["intel", "orders", "emoji"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveMacroCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest transition-colors font-bold cursor-pointer ${
                      activeMacroCategory === cat
                        ? "bg-red-600 text-white"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {cat} macros
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {macros[activeMacroCategory].map((macro) => (
                  <button
                    key={macro.text}
                    type="button"
                    onClick={() => insertMacro(macro.value)}
                    className="p-1.5 bg-[#141414] hover:bg-red-950/20 border border-zinc-850 hover:border-red-500/30 rounded text-[9px] font-mono text-zinc-300 text-left transition-all duration-200 truncate flex items-center justify-between cursor-pointer"
                  >
                    <span>{macro.text}</span>
                    <Sparkles size={8} className="text-red-500 shrink-0 opacity-40" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Controls & Footer Tips */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
          <div className="flex items-center gap-1 text-[9px] text-gray-500">
            <span className="font-mono text-red-500 font-bold">[!] Tip:</span>
            <span>Press Enter to instantly transmit, Shift+Enter for clean row break.</span>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {commentInput.trim() && (
              <button
                id={`btn-clear-comment-${post.id}`}
                type="button"
                onClick={() => onChangeCommentInput("")}
                className="px-2.5 py-1 text-zinc-500 hover:text-zinc-300 text-[9px] font-mono uppercase cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              id={`btn-submit-comment-${post.id}`}
              type="button"
              onClick={onSubmitComment}
              disabled={!commentInput || !commentInput.trim()}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-45 disabled:hover:bg-red-600 text-white font-mono rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              <span>Transmit Response</span>
              <Send size={9} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
