import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, AlertTriangle, Scale, Check, X, ShieldAlert, FileText, Search, Eye, Sparkles, UserCheck, RefreshCw, Star
} from "lucide-react";
import { MatchVerificationData, ArenaRegion, ArenaMode } from "../types/tdm";

interface TdmStaffReviewCenterProps {
  disputedMatches: MatchVerificationData[];
  onResolveDispute: (matchId: string, finalVerdict: "blue" | "red" | "draw" | "nullify", penaltyUser?: string) => void;
}

export default function TdmStaffReviewCenter({ 
  disputedMatches, 
  onResolveDispute 
}: TdmStaffReviewCenterProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "audit">("queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<MatchVerificationData | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock static historical audit log entries
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: "audit-101", matchId: "m-9923", region: "Middle East", mode: "1v1", map: "Warehouse", loadout: "M416 Only", decision: "BLUE WINNER CONFIRMED", staff: "CV_Mod_Krypton", reason: "AI OCR read score 40-35 Blue victory. Evidence screenshot verified.", date: "July 15, 2026" },
    { id: "audit-102", matchId: "m-8834", region: "Europe", mode: "2v2", map: "Ruins", loadout: "None (All Weapons)", decision: "MATCH NULLIFIED", staff: "CV_Admin_Zeus", reason: "Queue manipulation detected. Both players verified boosting alt accounts.", date: "July 14, 2026" },
    { id: "audit-103", matchId: "m-7712", region: "Africa", mode: "4v4", map: "Library", loadout: "Snipers Only", decision: "RED WINNER CONFIRMED", staff: "CV_Mod_Viper", reason: "Discrepancy cleared. Both captains submitted correct score logs on late sync.", date: "July 12, 2026" }
  ]);

  const handleResolve = (matchId: string, verdict: "blue" | "red" | "draw" | "nullify", penaltyUser?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onResolveDispute(matchId, verdict, penaltyUser);
      
      // Append to local audit log
      const matched = disputedMatches.find(m => m.matchId === matchId);
      if (matched) {
        setAuditLogs(prev => [
          {
            id: `audit-${Date.now()}`,
            matchId: matched.matchId,
            region: matched.region,
            mode: matched.mode,
            map: matched.map,
            loadout: matched.weaponAgreement,
            decision: verdict === "blue" ? "BLUE WINNER OVERRIDE" : verdict === "red" ? "RED WINNER OVERRIDE" : "NULLIFIED / PENALTY",
            staff: "CV_Agent_Staff",
            reason: staffNotes || "Staff manual override after reviewing logs & evidence screenshots.",
            date: "Today"
          },
          ...prev
        ]);
      }

      setSelectedMatch(null);
      setStaffNotes("");
      setIsProcessing(false);
    }, 1200);
  };

  const getConfidenceBadge = (score: number = 100) => {
    if (score >= 95) return "text-emerald-400 border-emerald-800/30 bg-emerald-950/20";
    if (score >= 75) return "text-amber-400 border-amber-800/30 bg-amber-950/20";
    return "text-red-500 border-red-950 bg-red-955/20";
  };

  const filteredAudits = auditLogs.filter(
    a => a.matchId.toLowerCase().includes(searchQuery.toLowerCase()) || 
         a.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
         a.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-6 text-left relative" id="staff-review-center">
      <div className="border-b border-zinc-900 pb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-955/25 border border-red-500/30 rounded text-[9px] text-[#ff001c] font-bold font-mono uppercase tracking-wider">
            <Scale size={11} className="text-[#ff001c]" />
            Staff Security & Adjudication Deck
          </span>
          <h2 className="text-base font-extrabold font-orbitron tracking-wide text-white uppercase">
            CV TDM Arena Staff Review & Manual Audits
          </h2>
          <p className="text-[10px] text-zinc-550 max-w-xl leading-relaxed font-sans">
            Review live dual-report discrepancies, analyze AI OCR confidence scores, examine attached visual screenshots, check weapon compliance logs, and hand down manual competitive points overrides.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 bg-black/45 p-1 border border-zinc-900 rounded-lg shrink-0 font-mono text-[9px]">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-3 py-1.5 rounded uppercase font-black cursor-pointer transition-all ${
              activeTab === "queue"
                ? "bg-[#ff001c]/15 text-[#ff001c]"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Review Queue ({disputedMatches.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded uppercase font-black cursor-pointer transition-all ${
              activeTab === "audit"
                ? "bg-[#ff001c]/15 text-[#ff001c]"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            Audit Logs Ledger ({auditLogs.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "queue" && (
          <motion.div
            key="queue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {disputedMatches.length === 0 ? (
              <div className="text-center py-12 bg-black/25 rounded-2xl border border-zinc-900 flex flex-col items-center justify-center space-y-3">
                <ShieldCheck size={36} className="text-emerald-500/40" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-stone-200 font-orbitron">No Discrepancies in Queue</h4>
                  <p className="text-[9.5px] text-zinc-500 font-mono">ALL DUEL LOGS REPORTED ARE AUTO-VERIFIED & MUTUALLY ALIGNED</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List pane */}
                <div className="lg:col-span-1 space-y-2.5">
                  <h3 className="text-[8.5px] font-bold text-zinc-650 tracking-wider uppercase font-mono">
                    Awaiting Adjudication:
                  </h3>

                  <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                    {disputedMatches.map((match) => (
                      <div
                        key={match.matchId}
                        onClick={() => {
                          setSelectedMatch(match);
                          setStaffNotes("");
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer font-mono text-[9px] relative overflow-hidden ${
                          selectedMatch?.matchId === match.matchId
                            ? "bg-[#ff001c]/5 border-[#ff001c]/40"
                            : "bg-black/35 border-zinc-900 hover:border-zinc-800"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-zinc-550 block text-[8px]">ID: {match.matchId}</span>
                            <strong className="text-white block uppercase text-[10.5px] font-orbitron mt-0.5">{match.mode} Ranked Duel</strong>
                          </div>
                          <span className={`px-1.5 py-0.2 border text-[8px] font-black rounded ${getConfidenceBadge(match.aiConfidenceScore)}`}>
                            AI: {match.aiConfidenceScore}%
                          </span>
                        </div>

                        <div className="flex justify-between text-[8px] text-zinc-500 mt-2">
                          <span>{match.region} • {match.weaponAgreement}</span>
                          <span className="text-red-500 font-bold">{match.suspiciousFlags?.length ? "FLAGGED" : "DISCREPANCY"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adjudication Viewport */}
                <div className="lg:col-span-2">
                  {selectedMatch ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-[#050505]/80 border border-zinc-900 rounded-2xl p-5 space-y-5"
                    >
                      <div className="border-b border-zinc-900 pb-3 flex justify-between items-start">
                        <div>
                          <span className="text-[8px] bg-red-955/20 text-[#ff001c] px-2 py-0.5 rounded border border-red-800/25 uppercase font-black font-mono">
                            ACTIVE SECURITY DISPUTE ADJUDICATION CASE
                          </span>
                          <h4 className="text-xs font-extrabold font-orbitron text-white uppercase mt-1.5">
                            Match Case File: {selectedMatch.matchId}
                          </h4>
                          <p className="text-[9.5px] text-zinc-500 font-mono mt-1">
                            Mode: {selectedMatch.mode} | Region: {selectedMatch.region} | Map: {selectedMatch.map} | Agreed Loadout: {selectedMatch.weaponAgreement}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[9.5px] font-bold border font-mono uppercase ${getConfidenceBadge(selectedMatch.aiConfidenceScore)}`}>
                          AI Confidence: {selectedMatch.aiConfidenceScore}%
                        </span>
                      </div>

                      {/* Split reported metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[9.5px]">
                        {/* Blue */}
                        <div className="bg-blue-955/5 border border-blue-900/30 p-3.5 rounded-xl space-y-2">
                          <strong className="text-blue-400 block uppercase font-bold tracking-wider">Blue Team Submitted Ledger:</strong>
                          <div className="space-y-1 text-zinc-400">
                            <p>Outcome Claimed: <span className="text-white font-bold">{selectedMatch.blueReport.toUpperCase()}</span></p>
                            <p>Declared Score: <span className="text-white font-bold">{selectedMatch.blueScore}</span></p>
                            <p>Rule Violation Claim: <span className="text-amber-500">None Reported</span></p>
                          </div>
                        </div>

                        {/* Red */}
                        <div className="bg-red-955/5 border border-red-900/30 p-3.5 rounded-xl space-y-2">
                          <strong className="text-red-400 block uppercase font-bold tracking-wider">Red Team Submitted Ledger:</strong>
                          <div className="space-y-1 text-zinc-400">
                            <p>Outcome Claimed: <span className="text-white font-bold">{selectedMatch.redReport.toUpperCase()}</span></p>
                            <p>Declared Score: <span className="text-white font-bold">{selectedMatch.redScore}</span></p>
                            <p>Rule Violation Claim: <span className="text-red-400 font-bold">Unapproved weapon used (UZI)</span></p>
                          </div>
                        </div>
                      </div>

                      {/* AI Copilot Scan Readout */}
                      <div className="bg-black/60 border border-[#ff001c]/15 p-4 rounded-xl font-mono text-[9.5px] space-y-2">
                        <div className="flex items-center gap-1.5 text-[#ff001c] font-black uppercase tracking-wider">
                          <Sparkles size={13} className="animate-pulse" />
                          <span>AI-Assistant Scoreboard Vision OCR Analysis:</span>
                        </div>
                        
                        <div className="bg-black border border-zinc-900 p-2.5 rounded font-mono text-[8.5px] text-zinc-500 leading-normal">
                          <span className="text-zinc-400 block mb-1">OCR EXTRACTED ARTIFACTS READOUT:</span>
                          &gt; OCR DETECTED SCORE: Blue Outpost [40] - Red Outpost [32]<br />
                          &gt; TELEMETRY MATCH CONFIDENCE VERDICT: 98% Score match<br />
                          &gt; WEAPON RESTRICTION COMPLIANCE: FLAGGED. Opponent Red Team has 12 eliminations registered with "Micro UZI" on feed records, violating "${selectedMatch.weaponAgreement}" restriction.
                        </div>

                        <p className="text-zinc-400 leading-normal leading-relaxed text-[9px]">
                          <strong>AI Verdict:</strong> {selectedMatch.aiNotes}
                        </p>
                      </div>

                      {/* Action Overrides Form */}
                      <div className="space-y-3 font-mono">
                        <span className="text-[8.5px] font-bold text-zinc-550 block uppercase tracking-wide">
                          Hand Down Adjudication Directive & Override Parameters:
                        </span>

                        <input
                          type="text"
                          placeholder="Provide rational reasoning logs (e.g., Falsified score, loadout compliance check failed for Red Team, warning logged)..."
                          value={staffNotes}
                          onChange={(e) => setStaffNotes(e.target.value)}
                          className="w-full bg-black border border-zinc-900 focus:border-[#ff001c] text-white p-2.5 rounded-lg text-xs outline-none"
                        />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] font-black">
                          <button
                            onClick={() => handleResolve(selectedMatch.matchId, "blue")}
                            disabled={isProcessing}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg cursor-pointer uppercase transition-colors"
                          >
                            Award Blue Win
                          </button>
                          <button
                            onClick={() => handleResolve(selectedMatch.matchId, "red")}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg cursor-pointer uppercase transition-colors"
                          >
                            Award Red Win
                          </button>
                          <button
                            onClick={() => handleResolve(selectedMatch.matchId, "draw")}
                            disabled={isProcessing}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2 rounded-lg cursor-pointer uppercase transition-colors"
                          >
                            Declare Draw
                          </button>
                          <button
                            onClick={() => handleResolve(selectedMatch.matchId, "nullify", "opponent")}
                            disabled={isProcessing}
                            className="bg-[#1c0a0a] hover:bg-[#2c0a0a] border border-red-950 text-[#ff001c] py-2 rounded-lg cursor-pointer uppercase transition-colors"
                          >
                            Void & Penalize
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed border-zinc-900 rounded-2xl p-8 text-center text-zinc-550 font-mono text-[9px] uppercase">
                      STANDBY: SELECT A PENDING REVIEW CASE FROM THE DISPATCH QUEUE TO LAUNCH ADJUDICATION CAPABILITIES
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 font-mono"
          >
            {/* Search Audits */}
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Search audit trail records by Match ID, staff name, decision verdict..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-[#ff001c] text-white p-2.5 pl-9 rounded-lg text-xs outline-none"
              />
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto text-[9.5px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-550 text-[8.5px] uppercase">
                    <th className="py-2 pl-3">Case ID</th>
                    <th className="py-2">Grid/Mode</th>
                    <th className="py-2">Loadout Limit</th>
                    <th className="py-2">Decision Verdict</th>
                    <th className="py-2">Adjudicator</th>
                    <th className="py-2">Resolution Justification Reason Log</th>
                    <th className="py-2 text-right pr-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40 text-stone-300">
                  {filteredAudits.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/10">
                      <td className="py-3 pl-3 font-bold text-[#ff001c]">{item.matchId}</td>
                      <td className="py-3">{item.region} ({item.mode})</td>
                      <td className="py-3 text-zinc-500">{item.loadout}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black border uppercase ${
                          item.decision.includes("BLUE WINNER") ? "bg-blue-950/20 text-blue-400 border-blue-900/30" :
                          item.decision.includes("RED WINNER") ? "bg-red-955/20 text-[#ff001c] border-red-900/30" :
                          "bg-zinc-900 text-zinc-400 border-zinc-800"
                        }`}>
                          {item.decision}
                        </span>
                      </td>
                      <td className="py-3 font-semibold">{item.staff}</td>
                      <td className="py-3 text-zinc-550 leading-relaxed max-w-sm whitespace-normal">{item.reason}</td>
                      <td className="py-3 text-right pr-3 text-zinc-500">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
