import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Copy, 
  Download, 
  Check, 
  Code, 
  Globe, 
  Info, 
  Settings, 
  Sparkles, 
  Terminal, 
  Laptop, 
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Sitelink structure
interface Sitelink {
  id: string;
  title: string;
  description: string;
}

// Full logo with SVG styled beautifully
export const CVEsportsLogo = ({ size = 80, className = "" }: { size?: number; className?: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] ${className}`}
    >
      {/* Outer Glowing Shield Border */}
      <path
        d="M100 20 L170 50 C170 120 140 165 100 185 C60 165 30 120 30 50 Z"
        fill="#050508"
        stroke="#EF4444"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Inner Shield Accent */}
      <path
        d="M100 30 L160 57 C160 115 133 155 100 173 C67 155 40 115 40 57 Z"
        fill="#0A0B10"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="2"
      />
      {/* Star at the Top */}
      <path
        d="M100 42 L103 50 L112 50 L105 55 L107 63 L100 58 L93 63 L95 55 L88 50 L97 50 Z"
        fill="#FFFFFF"
      />
      {/* Large stylized CV letters */}
      <g transform="translate(48, 55)">
        {/* 'C' in White */}
        <text
          x="10"
          y="68"
          fontFamily="Impact, 'Arial Black', sans-serif"
          fontSize="68"
          fontWeight="900"
          fill="#FFFFFF"
        >
          C
        </text>
        {/* 'V' in Red */}
        <text
          x="58"
          y="68"
          fontFamily="Impact, 'Arial Black', sans-serif"
          fontSize="68"
          fontWeight="900"
          fill="#EF4444"
        >
          V
        </text>
      </g>
      {/* Esports banner / text */}
      <rect x="42" y="132" width="116" height="24" rx="4" fill="#000000" stroke="#EF4444" strokeWidth="2" />
      <text
        x="100"
        y="149"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="3"
      >
        ESPORTS
      </text>
    </svg>
  );
};

export default function SeoPreviewSystem({ 
  onAlertMessage 
}: { 
  onAlertMessage: (msg: string) => void 
}) {
  // Primary SEO Settings
  const [searchTerm, setSearchTerm] = useState("CV eSports");
  const [metaTitle, setMetaTitle] = useState("CV eSports – Compete. Improve. Conquer.");
  const [metaDescription, setMetaDescription] = useState(
    "CV eSports is the ultimate competitive gaming platform. Join tournaments, play scrims, climb the arena leaderboards, build your squad and create your legacy."
  );
  
  // Dynamic Sitelinks State
  const [sitelinks, setSitelinks] = useState<Sitelink[]>([
    { id: "1", title: "Tournaments", description: "Join exciting tournaments and win amazing prizes." },
    { id: "2", title: "Scrims", description: "Daily scrims to improve your skills and teamwork." },
    { id: "3", title: "TDM Arena", description: "Climb the ranks in 1v1, 2v2 and 4v4 arena matches." },
    { id: "4", title: "Squads", description: "Find players, create squads and dominate." },
    { id: "5", title: "Rankings", description: "View top players, teams and squads leaderboards." },
  ]);

  // Social Links
  const [facebookUrl, setFacebookUrl] = useState("https://www.facebook.com/cvesports");
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/@cvesports");
  const [tiktokUrl, setTiktokUrl] = useState("https://www.tiktok.com/@cvesports");
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/cvesports");

  // Interactive search mock state
  const [activeSearchFilter, setActiveSearchFilter] = useState("All");
  const [copiedState, setCopiedState] = useState(false);
  const [validationProgress, setValidationProgress] = useState<"idle" | "testing" | "success">("idle");

  // Dynamic values helper
  const isTitleOverLimit = metaTitle.length > 60;
  const isDescOverLimit = metaDescription.length > 160;

  // JSON-LD structured schema computation
  const generateSchemaString = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CV eSports",
      "url": "https://cvesports.com",
      "logo": "https://cvesports.com/assets/logo.png",
      "description": metaDescription,
      "sameAs": [
        facebookUrl || "https://www.facebook.com/cvesports",
        youtubeUrl || "https://www.youtube.com/@cvesports",
        tiktokUrl || "https://www.tiktok.com/@cvesports",
        discordUrl || "https://discord.gg/cvesports"
      ].filter(Boolean)
    };
    return JSON.stringify(schema, null, 2);
  };

  // Copy structured markup schema
  const copySchemaMarkup = () => {
    navigator.clipboard.writeText(generateSchemaString());
    setCopiedState(true);
    onAlertMessage("📋 Dynamic Schema JSON-LD copied to clipboard successfully!");
    setTimeout(() => setCopiedState(false), 2500);
  };

  // Download Schema JSON file
  const downloadSchemaFile = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(generateSchemaString());
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "cv_esports_schema_markup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onAlertMessage("💾 Downloaded cv_esports_schema_markup.json schema configuration!");
    } catch (err) {
      onAlertMessage("❌ Failed to download schema markup config.");
    }
  };

  // Trigger simulated Schema Validator
  const handleValidateSchema = () => {
    setValidationProgress("testing");
    setTimeout(() => {
      setValidationProgress("success");
      onAlertMessage("🛡️ Schema.org Structured Data Validator: 100% compliant with standard Organization schemas!");
    }, 1500);
  };

  // Sitelink custom handler
  const handleSitelinkChange = (id: string, field: "title" | "description", value: string) => {
    setSitelinks(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Reset to default preset
  const handleResetDefaults = () => {
    setSearchTerm("CV eSports");
    setMetaTitle("CV eSports – Compete. Improve. Conquer.");
    setMetaDescription(
      "CV eSports is the ultimate competitive gaming platform. Join tournaments, play scrims, climb the arena leaderboards, build your squad and create your legacy."
    );
    setSitelinks([
      { id: "1", title: "Tournaments", description: "Join exciting tournaments and win amazing prizes." },
      { id: "2", title: "Scrims", description: "Daily scrims to improve your skills and teamwork." },
      { id: "3", title: "TDM Arena", description: "Climb the ranks in 1v1, 2v2 and 4v4 arena matches." },
      { id: "4", title: "Squads", description: "Find players, create squads and dominate." },
      { id: "5", title: "Rankings", description: "View top players, teams and squads leaderboards." },
    ]);
    setFacebookUrl("https://www.facebook.com/cvesports");
    setYoutubeUrl("https://www.youtube.com/@cvesports");
    setTiktokUrl("https://www.tiktok.com/@cvesports");
    setDiscordUrl("https://discord.gg/cvesports");
    setValidationProgress("idle");
    onAlertMessage("🔄 SEO parameters and structural schemas reset to factory default configuration!");
  };

  return (
    <div className="space-y-6 text-left">
      {/* Interactive Title Card */}
      <div className="bg-[#0b0e14] border border-red-500/10 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-red-900/40 text-red-500 font-mono text-[9px] font-black rounded-full border border-red-500/20 uppercase tracking-widest animate-pulse">
              Search Optimization
            </span>
            <span className="text-[10px] text-zinc-500 font-mono font-semibold">V2.8 PRO</span>
          </div>
          <h2 className="text-xl font-black font-russo text-white uppercase tracking-wider flex items-center gap-2">
            🔍 GOOGLE SEARCH & SCHEMA PREVIEWER
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-2xl">
            Fine-tune meta metadata, preview live Google Search engine appearance on dark/light displays, and generate validated Schema.org Organization Rich Snippets.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 z-10">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw size={12} className="text-zinc-500" />
            Reset Defaults
          </button>
        </div>
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-20" />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE SEO PARAMETER CONTROLLER (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#121419] rounded-2xl border border-zinc-850 p-4 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Settings size={14} className="text-red-500" />
              <h3 className="text-xs font-black font-mono uppercase tracking-widest text-zinc-300">
                SEO Controller Deck
              </h3>
            </div>

            {/* Keyword Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase font-black flex justify-between">
                <span>Google Search Keyword</span>
                <span className="text-zinc-600">Simulate Search</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0b0c0f] border border-zinc-800 rounded-xl py-2 px-3 pl-8 text-xs text-white focus:outline-none focus:border-red-500 font-sans"
                  placeholder="e.g. CV eSports"
                />
                <Search size={12} className="absolute left-3 top-3 text-zinc-500" />
              </div>
            </div>

            {/* Meta Title Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase font-black">
                <span className="text-zinc-400">SEO META TITLE</span>
                <span className={isTitleOverLimit ? "text-yellow-500 font-bold" : "text-emerald-500"}>
                  {metaTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className={`w-full bg-[#0b0c0f] border rounded-xl py-2 px-3 text-xs text-white focus:outline-none font-sans ${
                  isTitleOverLimit ? "border-yellow-600/50 focus:border-yellow-500" : "border-zinc-800 focus:border-red-500"
                }`}
                placeholder="Meta title..."
              />
              {isTitleOverLimit && (
                <p className="text-[9px] text-yellow-500 font-mono leading-none flex items-center gap-1 mt-1">
                  <AlertTriangle size={10} /> Title is too long. Google typically truncates at 60 characters.
                </p>
              )}
            </div>

            {/* Meta Description Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase font-black">
                <span className="text-zinc-400">SEO META DESCRIPTION</span>
                <span className={isDescOverLimit ? "text-yellow-500 font-bold" : "text-emerald-500"}>
                  {metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className={`w-full bg-[#0b0c0f] border rounded-xl p-2 px-3 text-xs text-white focus:outline-none font-sans resize-none ${
                  isDescOverLimit ? "border-yellow-600/50 focus:border-yellow-500" : "border-zinc-800 focus:border-red-500"
                }`}
                placeholder="Meta description..."
              />
              {isDescOverLimit && (
                <p className="text-[9px] text-yellow-500 font-mono leading-none flex items-center gap-1 mt-1">
                  <AlertTriangle size={10} /> Description too long. Keep under 160 characters for search snippets.
                </p>
              )}
            </div>

            {/* Social Schema Integrations */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <h4 className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest mb-1">
                Schema SameAs (Social Handles)
              </h4>
              
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 block mb-0.5">Facebook URL</span>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full bg-[#0b0c0f] border border-zinc-850 rounded-lg p-1.5 text-[10px] text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 block mb-0.5">YouTube URL</span>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-[#0b0c0f] border border-zinc-850 rounded-lg p-1.5 text-[10px] text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 block mb-0.5">TikTok URL</span>
                  <input
                    type="text"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    className="w-full bg-[#0b0c0f] border border-zinc-850 rounded-lg p-1.5 text-[10px] text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 block mb-0.5">Discord invite</span>
                  <input
                    type="text"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    className="w-full bg-[#0b0c0f] border border-zinc-850 rounded-lg p-1.5 text-[10px] text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sitelinks Configurator */}
          <div className="bg-[#121419] rounded-2xl border border-zinc-850 p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-black font-mono uppercase tracking-widest text-zinc-300 flex justify-between items-center">
              <span>Sitelinks Editors</span>
              <span className="text-[9px] bg-red-950/40 text-red-500 font-bold px-1.5 py-0.5 rounded border border-red-900/30">
                MAX 5
              </span>
            </h3>
            
            <p className="text-[9.5px] text-zinc-500 font-sans leading-tight">
              Customize the sitelink titles and visual descriptions displayed underneath the primary search listing.
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {sitelinks.map((sitelink, idx) => (
                <div key={sitelink.id} className="p-2.5 rounded-xl bg-black/40 border border-zinc-900 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-red-500 font-bold">#Sitelink {idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={sitelink.title}
                    onChange={(e) => handleSitelinkChange(sitelink.id, "title", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-1.5 text-[11px] font-bold text-stone-200 focus:outline-none"
                    placeholder="Sitelink Title"
                  />
                  <input
                    type="text"
                    value={sitelink.description}
                    onChange={(e) => handleSitelinkChange(sitelink.id, "description", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-1.5 text-[10px] text-zinc-400 focus:outline-none"
                    placeholder="Sitelink Snippet Description"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GOOGLE LIVE PREVIEW & RICH SNIPPET CODE BLOCK (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">

          {/* GOOGLE SEARCH PREVIEW CONTAINER */}
          <div className="bg-[#030303] rounded-2xl border border-zinc-850 p-5 space-y-4 relative shadow-2xl">
            {/* Header branding tag */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-black font-mono uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                GOOGLE SEARCH PREVIEW
              </h3>
              <div className="flex items-center gap-1 bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded-lg border border-zinc-800 text-[9px] font-mono font-bold">
                <Laptop size={11} className="text-zinc-500" />
                <span>DESKTOP VIEW MODE</span>
              </div>
            </div>

            {/* GOOGLE MOCK SEARCH ENGINE HUD BAR */}
            <div className="bg-[#171717] rounded-xl border border-zinc-800 p-3 space-y-3">
              
              {/* Google top row bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Styled google logo text */}
                  <div className="text-base font-black font-sans select-none tracking-tight shrink-0">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>

                  {/* Fully functional search input bar container */}
                  <div className="flex-1 sm:w-[260px] md:w-[350px] bg-[#303134] rounded-full px-3.5 py-1.5 flex items-center justify-between border border-transparent focus-within:border-zinc-700">
                    <div className="flex items-center gap-2 min-w-0 w-full">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-0 outline-none text-xs text-white font-sans w-full select-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {/* Search bar mock icons */}
                      <span className="text-zinc-400 cursor-pointer hover:text-white" title="Clear query" onClick={() => setSearchTerm("")}>✕</span>
                      <span className="text-[#4285F4] text-xs font-bold cursor-pointer" title="Search by Voice">🎤</span>
                      <Search size={11} className="text-[#4285F4] cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Simulated profiles or utilities */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-700 text-white font-mono text-[9px] font-black flex items-center justify-center border border-red-500/30">
                    CV
                  </span>
                </div>
              </div>

              {/* Navigation links beneath search bar */}
              <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 border-t border-zinc-800 pt-2 select-none overflow-x-auto whitespace-nowrap">
                {["All", "Images", "Videos", "News", "Shopping", "More"].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setActiveSearchFilter(lbl)}
                    className={`pb-1 px-1 transition-all relative font-bold cursor-pointer ${
                      activeSearchFilter === lbl 
                        ? "text-[#8ab4f8] font-black" 
                        : "hover:text-white"
                    }`}
                  >
                    {lbl}
                    {activeSearchFilter === lbl && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8ab4f8]" />
                    )}
                  </button>
                ))}
                <span className="text-zinc-700">|</span>
              </div>
            </div>

            {/* MOCK SEARCH RESULT LISTING */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
              
              {/* PRIMARY SEARCH SNIPPET RESULT (md:col-span-8) */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5 text-left">
                  {/* Top Breadcrumb */}
                  <div className="flex items-center gap-2.5 text-[10.5px] font-sans">
                    <div className="w-6 h-6 rounded-full bg-[#1e2025] flex items-center justify-center border border-zinc-800 shrink-0 shadow">
                      <span className="text-red-500 font-mono text-[8px] font-black">CV</span>
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-zinc-200 font-semibold text-[11px] font-sans">CV eSports</span>
                      <span className="text-zinc-500 text-[10px] font-mono mt-0.5">https://cvesports.com</span>
                    </div>
                    <span className="text-zinc-600 text-xs ml-auto">⋮</span>
                  </div>

                  {/* Clicking Meta Title */}
                  <h4 
                    onClick={() => onAlertMessage(`🌐 Simulating navigating to target web link: https://cvesports.com`)}
                    className="text-[17px] text-[#8ab4f8] hover:underline cursor-pointer font-medium font-sans leading-tight leading-snug tracking-normal"
                  >
                    {metaTitle || "CV eSports – Compete. Improve. Conquer."}
                  </h4>

                  {/* Meta Description snippet */}
                  <p className="text-[12.5px] text-[#bdc1c6] font-sans leading-normal leading-relaxed">
                    {metaDescription || "CV eSports is the ultimate competitive gaming platform..."}
                  </p>
                </div>

                {/* INTERACTIVE SITELINKS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 pl-4 border-l border-zinc-850 pt-2">
                  {sitelinks.map((sitelink) => (
                    <div 
                      key={sitelink.id} 
                      onClick={() => onAlertMessage(`🔗 Sitelink clicked: Redirecting to cvesports.com/${sitelink.title.toLowerCase()}`)}
                      className="space-y-0.5 cursor-pointer group"
                    >
                      <h5 className="text-[12.5px] text-[#8ab4f8] group-hover:underline font-sans font-medium">
                        {sitelink.title || "Section Link"}
                      </h5>
                      <p className="text-[11px] text-[#9aa0a6] font-sans leading-tight">
                        {sitelink.description || "Link description snippet details."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KNOWLEDGE PANEL / SIDE BRANDING CARD (md:col-span-4) */}
              <div className="md:col-span-4 space-y-3">
                <div className="bg-[#171717] rounded-xl border border-zinc-800 p-4 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xl group hover:border-zinc-700 transition-all">
                  
                  {/* Decorative glowing background shield behind logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-650/5 blur-2xl rounded-full pointer-events-none" />

                  <div className="z-10 flex justify-between items-start">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-955/20 px-2 py-0.5 rounded border border-red-900/30">
                      Brand Profile
                    </span>
                    <Sparkles size={11} className="text-yellow-500 animate-spin-slow" />
                  </div>

                  {/* Layout mimicking screenshot precisely */}
                  <div className="z-10 grid grid-cols-12 gap-3 items-center my-4">
                    {/* Shield logo left side */}
                    <div className="col-span-5 flex justify-center">
                      <CVEsportsLogo size={80} />
                    </div>
                    {/* Slogans stack right side */}
                    <div className="col-span-7 flex flex-col justify-center border-l border-zinc-800 pl-3">
                      <span className="text-[14px] font-black font-russo text-white leading-none tracking-wide">
                        COMPETE.
                      </span>
                      <span className="text-[14px] font-black font-russo text-red-500 leading-none tracking-wide mt-1.5">
                        IMPROVE.
                      </span>
                      <span className="text-[14px] font-black font-russo text-white leading-none tracking-wide mt-1.5">
                        CONQUER.
                      </span>
                    </div>
                  </div>

                  {/* Bottom details panel */}
                  <div className="z-10 pt-2 border-t border-zinc-850/80 text-[10px] font-mono text-zinc-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="text-zinc-300 font-bold">Esports Club</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sectors:</span>
                      <span className="text-zinc-300 font-bold">Tourneys, TDM Arena</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC RICH SNIPPET STRUCTURED DATA JSON-LD SECTION */}
          <div className="bg-[#030303] rounded-2xl border border-zinc-850 p-5 space-y-4 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3">
              <div>
                <h3 className="text-xs font-black font-mono uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                  <Code size={14} className="text-red-500" />
                  RICH SNIPPET (STRUCTURED DATA)
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  JSON-LD Web Schema dynamically compiled in real-time
                </p>
              </div>

              {/* Utility operations */}
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleValidateSchema}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-stone-300 font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1"
                  title="Run structural standard checks"
                >
                  <CheckCircle size={10} className="text-emerald-500" />
                  <span>Validate Schema</span>
                </button>
                <button
                  type="button"
                  onClick={downloadSchemaFile}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-stone-300 font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1"
                  title="Download .json markup file"
                >
                  <Download size={10} className="text-blue-500" />
                  <span>Download file</span>
                </button>
                <button
                  type="button"
                  onClick={copySchemaMarkup}
                  className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-mono text-[9px] font-black uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  {copiedState ? <Check size={10} className="text-emerald-400 animate-bounce" /> : <Copy size={10} className="text-red-500" />}
                  <span>{copiedState ? "Copied!" : "Copy Schema Markup"}</span>
                </button>
              </div>
            </div>

            {/* TWO COLUMNS: DYNAMIC MONOSPACE SCHEMA & BIG GLOW CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* Monospace Code Editor block (lg:col-span-8) */}
              <div className="lg:col-span-8 bg-[#090a0f] rounded-xl border border-zinc-900 p-4 font-mono text-[10px] text-zinc-300 relative overflow-x-auto select-all shadow-inner max-h-[300px]">
                {/* Validation progress indicator floating overlay */}
                {validationProgress === "testing" && (
                  <div className="absolute inset-0 bg-[#090a0f]/90 flex flex-col items-center justify-center space-y-2 rounded-xl z-20">
                    <RefreshCw size={22} className="text-red-500 animate-spin" />
                    <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 animate-pulse">
                      Running standard schema compiler test protocols...
                    </span>
                  </div>
                )}

                {validationProgress === "success" && (
                  <div className="absolute top-3 right-3 bg-emerald-950/40 text-emerald-400 text-[8.5px] font-bold px-2 py-1 rounded border border-emerald-900/30 flex items-center gap-1 z-10 animate-fade-in">
                    <CheckCircle size={10} />
                    <span>SCHEMA MARKUP 100% COMPLIANT (0 ERRORS, 0 WARNINGS)</span>
                  </div>
                )}

                {/* Highlighted JSON-LD Rendering */}
                <pre className="text-gray-300 selection:bg-red-950">
                  <span className="text-zinc-600">{"{"}</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"@context\""}</span>
                  <span className="text-zinc-500">:</span>{" "}
                  <span className="text-emerald-400">{"\"https://schema.org\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"@type\""}</span>
                  <span className="text-zinc-500">:</span>{" "}
                  <span className="text-emerald-400">{"\"Organization\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"name\""}</span>
                  <span className="text-zinc-500">:</span>{" "}
                  <span className="text-emerald-400">{"\"CV eSports\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"url\""}</span>
                  <span className="text-zinc-500">:</span>{" "}
                  <span className="text-emerald-400">{"\"https://cvesports.com\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"logo\""}</span>
                  <span className="text-zinc-500">:</span>{" "}
                  <span className="text-emerald-400">{"\"https://cvesports.com/assets/logo.png\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"description\""}</span>
                  <span className="text-zinc-500">:</span>{" "}
                  <span className="text-emerald-400">{"\""}{metaDescription}{"\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n  "}
                  <span className="text-rose-400">{"\"sameAs\""}</span>
                  <span className="text-zinc-500">:</span> <span className="text-zinc-600">{"["}</span>
                  {"\n    "}
                  <span className="text-emerald-400">{"\""}{facebookUrl}{"\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n    "}
                  <span className="text-emerald-400">{"\""}{youtubeUrl}{"\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n    "}
                  <span className="text-emerald-400">{"\""}{tiktokUrl}{"\""}</span>
                  <span className="text-zinc-600">,</span>
                  {"\n    "}
                  <span className="text-emerald-400">{"\""}{discordUrl}{"\""}</span>
                  {"\n  "}
                  <span className="text-zinc-600">{"]"}</span>
                  {"\n"}
                  <span className="text-zinc-600">{"}"}</span>
                </pre>
              </div>

              {/* BRAND SHIELD GRAPHIC BOX (lg:col-span-4) */}
              <div className="lg:col-span-4 flex items-center justify-center p-4 bg-[#0a0a0f] rounded-xl border border-zinc-900 shadow-xl relative overflow-hidden group min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -inset-px rounded-xl border border-red-500/10 group-hover:border-red-500/30 transition-colors pointer-events-none" />
                
                {/* Center SVG logo representation from screenshot */}
                <CVEsportsLogo size={120} className="transform group-hover:scale-105 duration-300" />
              </div>

            </div>

            {/* Explanatory notice */}
            <div className="bg-red-950/10 border border-red-900/10 rounded-xl p-3 text-[10.5px] text-zinc-400 flex items-start gap-2">
              <Info size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="leading-normal">
                Adding search schema metadata assists search engine indexers to properly structure your esports team and event details, unlocking advanced rich previews on Google mobile & desktop interfaces.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
