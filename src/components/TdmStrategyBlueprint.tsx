import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  MapPin, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Info, 
  RefreshCw, 
  FileJson, 
  FileText, 
  Share2, 
  Eye, 
  Crosshair, 
  ShieldCheck, 
  TrendingUp, 
  Compass, 
  Scissors, 
  GitBranch, 
  PlusCircle, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

export interface BlueprintPin {
  id: string;
  x: number; // percentage width 0-100
  y: number; // percentage height 0-100
  type: "attack" | "defense" | "ambush" | "sniper" | "smoke";
  label: string;
  notes?: string;
}

export interface TacticalConnection {
  id: string;
  fromPinId: string;
  toPinId: string;
  type: "rotation" | "lineOfSight" | "assault";
  color?: string;
}

export interface TdmBlueprint {
  id: string;
  name: string;
  mapId: "warehouse" | "hangar" | "containers" | "ruins";
  creator: string;
  description: string;
  pins: BlueprintPin[];
  connections: TacticalConnection[];
  createdAt: string;
}

const PIN_TYPES = {
  attack: { label: "Assault / Attack Point", icon: "💥", color: "#ef4444", bg: "bg-red-500", text: "text-red-400" },
  defense: { label: "Defensive Cover Wall", icon: "🛡️", color: "#3b82f6", bg: "bg-blue-500", text: "text-blue-450" },
  ambush: { label: "Ambush / Flank Bait", icon: "🔌", color: "#f59e0b", bg: "bg-amber-500", text: "text-amber-400" },
  sniper: { label: "Sniper Sightline / Nest", icon: "🎯", color: "#10b981", bg: "bg-emerald-500", text: "text-emerald-400" },
  smoke: { label: "Smoke / Grenade Zone", icon: "💨", color: "#a1a1aa", bg: "bg-zinc-500", text: "text-zinc-400" }
};

const MAPS_META = {
  warehouse: {
    name: "Warehouse (TDM)",
    desc: "Symmetric tactical hangar with central containers and fast flank pathways",
    baseColor: "#ef4444",
    obstacles: [
      { id: "obs-c1", name: "Central Cargo Container", x: 40, y: 35, w: 20, h: 30, color: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.4)" },
      { id: "obs-w1", name: "West Wood Crates", x: 15, y: 40, w: 10, h: 20, color: "rgba(120, 110, 90, 0.2)", border: "rgba(120, 110, 90, 0.4)" },
      { id: "obs-e1", name: "East Steel Shed", x: 75, y: 40, w: 10, h: 20, color: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.4)" },
      { id: "obs-sb", name: "South Red Spawn Shield", x: 45, y: 85, w: 10, h: 8, color: "rgba(220, 38, 38, 0.2)", border: "rgba(220, 38, 38, 0.5)" },
      { id: "obs-nb", name: "North Blue Spawn Shield", x: 45, y: 7, w: 10, h: 8, color: "rgba(29, 78, 216, 0.2)", border: "rgba(29, 78, 216, 0.5)" },
    ]
  },
  hangar: {
    name: "Hangar (Arena TDM)",
    desc: "Aviation hangar featuring central broken helicopter and stacked cargo holds",
    baseColor: "#10b981",
    obstacles: [
      { id: "obs-h1", name: "Decommissioned Helicopter fuselage", x: 38, y: 38, w: 24, h: 24, color: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)" },
      { id: "obs-hl", name: "Left Flanking Airplane Wing", x: 12, y: 25, w: 12, h: 50, color: "rgba(120, 120, 120, 0.15)", border: "rgba(120, 120, 120, 0.3)" },
      { id: "obs-hr", name: "Right Stacked Metal Cargo", x: 76, y: 25, w: 12, h: 50, color: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)" },
    ]
  },
  containers: {
    name: "Containers (Harbor TDM)",
    desc: "High-density cargo seaport with multiple vertical levels and narrow corridors",
    baseColor: "#3b82f6",
    obstacles: [
      { id: "obs-pc1", name: "Primary Red Containment Block", x: 20, y: 20, w: 18, h: 22, color: "rgba(220, 38, 38, 0.15)", border: "rgba(220, 38, 38, 0.4)" },
      { id: "obs-pc2", name: "Primary Blue Containment Block", x: 62, y: 58, w: 18, h: 22, color: "rgba(37, 99, 235, 0.15)", border: "rgba(37, 99, 235, 0.4)" },
      { id: "obs-cr", name: "Central Port Crane Pillar", x: 46, y: 44, w: 8, h: 12, color: "rgba(245, 158, 11, 0.2)", border: "rgba(245, 158, 11, 0.5)" },
      { id: "obs-cor", name: "Choke Point Container A", x: 45, y: 15, w: 10, h: 18, color: "rgba(100, 100, 100, 0.2)", border: "rgba(100, 100, 100, 0.4)" },
      { id: "obs-cor2", name: "Choke Point Container B", x: 45, y: 67, w: 10, h: 18, color: "rgba(100, 100, 100, 0.2)", border: "rgba(100, 100, 100, 0.4)" },
    ]
  },
  ruins: {
    name: "Ruins (Tactical TDM)",
    desc: "Ancient stone labyrinth with elevation platforms and central pillar nodes",
    baseColor: "#f59e0b",
    obstacles: [
      { id: "obs-ru1", name: "Stone Ruinate Tower", x: 42, y: 40, w: 16, h: 20, color: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)" },
      { id: "obs-ruw", name: "West Ancient Pillar Cluster", x: 15, y: 20, w: 12, h: 15, color: "rgba(150, 140, 120, 0.2)", border: "rgba(150, 140, 120, 0.4)" },
      { id: "obs-rue", name: "East Sacred Altar Table", x: 73, y: 65, w: 12, h: 15, color: "rgba(150, 140, 120, 0.2)", border: "rgba(150, 140, 120, 0.4)" },
      { id: "obs-ru-top", name: "North Elevated Landing", x: 20, y: 5, w: 60, h: 10, color: "rgba(100, 100, 100, 0.15)", border: "rgba(100, 100, 100, 0.3)" },
    ]
  }
};

const SEED_BLUEPRINTS: TdmBlueprint[] = [
  {
    id: "bp-seed-1",
    name: "VIPERS COLD-RUSH ROTATION",
    mapId: "warehouse",
    creator: "CV_Slayer_IGL",
    description: "Symmetric early rush to dominate the bridge choke-point container and lock sightlines with sniper cover.",
    pins: [
      { id: "pin-s-2", x: 20, y: 50, type: "sniper", label: "Covering Scout", notes: "Locks down central corridor and reports cross rotation" },
      { id: "pin-s-3", x: 50, y: 30, type: "attack", label: "Central Breach Alpha", notes: "Breaches over central crate to bait backline anchors" },
      { id: "pin-s-4", x: 80, y: 48, type: "ambush", label: "Flanker Echo", notes: "Sneaks past the east steel shed to surprise rear defenders" },
      { id: "pin-s-5", x: 50, y: 88, type: "defense", label: "Base Anchor Point", notes: "Holds respawn point and provides fallback covering smoke" }
    ],
    connections: [
      { id: "conn-s-1", fromPinId: "pin-s-5", toPinId: "pin-s-2", type: "rotation" },
      { id: "conn-s-2", fromPinId: "pin-s-2", toPinId: "pin-s-3", type: "assault" },
      { id: "conn-s-3", fromPinId: "pin-s-5", toPinId: "pin-s-4", type: "rotation" },
    ],
    createdAt: "2026-06-07T14:30:10Z"
  },
  {
    id: "bp-seed-2",
    name: "HANGAR FLIGHT DECK CLUSTER",
    mapId: "hangar",
    creator: "CV_Mamba_Flick",
    description: "Multi-layered defensive setup. Ideal for AWM and M416 tracer laser team composition.",
    pins: [
      { id: "pin-h-1", x: 18, y: 30, type: "sniper", label: "Left Wing Sentry", notes: "AWM sniping post with heavy wing cover angles" },
      { id: "pin-h-2", x: 50, y: 50, type: "defense", label: "Fuselage Camp Node", notes: "Fortifies broken aircraft wreckage" },
      { id: "pin-h-3", x: 82, y: 30, type: "attack", label: "Aggressive Container Rush", notes: "Assaults hostile flankers from behind stacked cargo" }
    ],
    connections: [
      { id: "conn-h-1", fromPinId: "pin-h-2", toPinId: "pin-h-1", type: "lineOfSight" },
      { id: "conn-h-2", fromPinId: "pin-h-2", toPinId: "pin-h-3", type: "assault" }
    ],
    createdAt: "2026-06-08T09:15:20Z"
  }
];

interface TdmStrategyBlueprintProps {
  onAddLog: (logText: string) => void;
  userIgn: string;
}

export default function TdmStrategyBlueprint({ onAddLog, userIgn }: TdmStrategyBlueprintProps) {
  const [blueprints, setBlueprints] = useState<TdmBlueprint[]>(() => {
    try {
      const saved = localStorage.getItem("tdm_tactical_blueprints");
      return saved ? JSON.parse(saved) : SEED_BLUEPRINTS;
    } catch {
      return SEED_BLUEPRINTS;
    }
  });

  const [activeBpId, setActiveBpId] = useState<string>("bp-seed-1");
  const [activeMapId, setActiveMapId] = useState<"warehouse" | "hangar" | "containers" | "ruins">("warehouse");
  const [hoveredBp, setHoveredBp] = useState<TdmBlueprint | null>(null);

  // Local drawing/editing state of the canvas
  const [currentPins, setCurrentPins] = useState<BlueprintPin[]>([]);
  const [currentConns, setCurrentConns] = useState<TacticalConnection[]>([]);
  const [bpName, setBpName] = useState<string>("");
  const [bpDesc, setBpDesc] = useState<string>("");

  // Grid hover tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const [subSector, setSubSector] = useState<string>("A1");

  // Selection/Input popups states
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [pendingClickCoords, setPendingClickCoords] = useState<{ x: number; y: number } | null>(null);
  const [newPinLabel, setNewPinLabel] = useState<string>("");
  const [newPinType, setNewPinType] = useState<"attack" | "defense" | "ambush" | "sniper" | "smoke">("attack");
  const [newPinNotes, setNewPinNotes] = useState<string>("");

  // Connection plotting state
  const [connectingFromPinId, setConnectingFromPinId] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState<"rotation" | "lineOfSight" | "assault">("rotation");

  // JSON Import / Export Portals
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>("");
  const [jsonActionType, setJsonActionType] = useState<"export" | "import">("export");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Status Banner Flash
  const [blueprintStatusAlert, setBlueprintStatusAlert] = useState<string>("");

  // Save blueprints state to localStorage when blueprints change
  useEffect(() => {
    try {
      localStorage.setItem("tdm_tactical_blueprints", JSON.stringify(blueprints));
    } catch (err) {
      console.error("Local storage error in blueprints", err);
    }
  }, [blueprints]);

  // Sync editor whenever the active Blueprint changes
  useEffect(() => {
    const selected = blueprints.find(bp => bp.id === activeBpId);
    if (selected) {
      setCurrentPins(selected.pins);
      setCurrentConns(selected.connections);
      setBpName(selected.name);
      setBpDesc(selected.description);
      setActiveMapId(selected.mapId);
    } else if (activeBpId === "new-blank") {
      setCurrentPins([]);
      setCurrentConns([]);
      setBpName("CUSTOM SQUAD LAYOUT");
      setBpDesc("Describe the central rotation or defensive layout goals...");
    }
  }, [activeBpId, blueprints]);

  // Track cursor grid positions & mathematically calculate sector sub-coordinate boxes
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    // Safety clamp percentages
    const clampedX = Math.min(100, Math.max(0, x));
    const clampedY = Math.min(100, Math.max(0, y));
    
    setHoverCoords({ x: clampedX, y: clampedY });

    // Grid Column (A-J range, representing blocks of 10%)
    const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
    const colIdx = Math.min(10, Math.floor(clampedX / 10));
    const rowIdx = Math.min(10, Math.floor(clampedY / 10)) + 1;
    setSubSector(`${chars[colIdx]}-${rowIdx}`);
  };

  const handleMouseLeave = () => {
    setHoverCoords(null);
  };

  // Map canvas container click coordinates registration
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // If we're clicking a button, pin dot, or interactive popup, do not spawn a new pin popup.
    const target = e.target as HTMLElement;
    if (target.closest(".interactive-pin") || target.closest(".canvas-overlay-popup") || target.closest(".button-control")) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    setPendingClickCoords({ x, y });
    setNewPinLabel(`Sector ${subSector} Sentry`);
    setNewPinNotes("");
  };

  // Create & save a newly drawn custom pin to layout state
  const handleCreatePin = () => {
    if (!pendingClickCoords) return;
    const newPin: BlueprintPin = {
      id: `pin-${Date.now()}`,
      x: pendingClickCoords.x,
      y: pendingClickCoords.y,
      type: newPinType,
      label: newPinLabel || `Node ${currentPins.length + 1}`,
      notes: newPinNotes
    };

    setCurrentPins([...currentPins, newPin]);
    onAddLog(`📍 Added Tactical Node: "${newPin.label}" (${newPin.type.toUpperCase()}) at [X: ${newPin.x}%, Y: ${newPin.y}%]`);
    setBlueprintStatusAlert("🎯 Tactical node added to blueprint! Save draft to persist.");

    // Reset modals and selections
    setPendingClickCoords(null);
  };

  // Delete a specific target pin
  const handleDeletePin = (pinId: string) => {
    const toDelete = currentPins.find(p => p.id === pinId);
    setCurrentPins(currentPins.filter(p => p.id !== pinId));
    // Also strip connections matching this pin
    setCurrentConns(currentConns.filter(c => c.fromPinId !== pinId && c.toPinId !== pinId));
    if (toDelete) {
      onAddLog(`🗑️ Erased Tactical Node: "${toDelete.label}"`);
    }
    if (selectedPinId === pinId) {
      setSelectedPinId(null);
    }
    setBlueprintStatusAlert("🧹 Cleared node and associated connections.");
  };

  // Connection management flow: Connect two pins relative
  const handleInitiateConnection = (pinId: string) => {
    setConnectingFromPinId(pinId);
    setBlueprintStatusAlert("🔗 Select target node to establish vector stream connection...");
  };

  const handleCompleteConnection = (toPinId: string) => {
    if (!connectingFromPinId) return;
    if (connectingFromPinId === toPinId) {
      setConnectingFromPinId(null);
      return;
    }

    // Check if duplicate connection exists
    const exists = currentConns.some(
      c => (c.fromPinId === connectingFromPinId && c.toPinId === toPinId) || 
           (c.fromPinId === toPinId && c.toPinId === connectingFromPinId)
    );

    if (exists) {
      setBlueprintStatusAlert("⚠️ Vector connection already registered.");
      setConnectingFromPinId(null);
      return;
    }

    const fromPin = currentPins.find(p => p.id === connectingFromPinId);
    const toPin = currentPins.find(p => p.id === toPinId);

    if (fromPin && toPin) {
      const newConn: TacticalConnection = {
        id: `conn-${Date.now()}`,
        fromPinId: connectingFromPinId,
        toPinId,
        type: connectionType
      };

      setCurrentConns([...currentConns, newConn]);
      onAddLog(`⚡ Connected Nodes: "${fromPin.label}" ➔ "${toPin.label}" [Vector: ${connectionType.toUpperCase()}]`);
      setBlueprintStatusAlert(`🔗 Linked vector trace from ${fromPin.label} to ${toPin.label}`);
    }

    setConnectingFromPinId(null);
  };

  const handleClearAllDraftCoords = () => {
    setCurrentPins([]);
    setCurrentConns([]);
    setBlueprintStatusAlert("🗑️ Map blackboard completely wiped.");
    onAddLog("🧹 Strategy Blueprint blackboard wiped clean by Captain.");
  };

  // Save current whiteboard state draft either into active or create new
  const handleSaveChanges = () => {
    if (!bpName.trim()) {
      setBlueprintStatusAlert("⚠️ Blueprint name registry field is empty!");
      return;
    }

    const updatedBlueprint: TdmBlueprint = {
      id: activeBpId === "new-blank" ? `bp-user-${Date.now()}` : activeBpId,
      name: bpName,
      mapId: activeMapId,
      creator: userIgn,
      description: bpDesc,
      pins: currentPins,
      connections: currentConns,
      createdAt: new Date().toISOString()
    };

    if (activeBpId === "new-blank") {
      setBlueprints([...blueprints, updatedBlueprint]);
      setActiveBpId(updatedBlueprint.id);
      onAddLog(`💾 Saved NEW Team Tactical Layout: [${updatedBlueprint.name}]`);
    } else {
      setBlueprints(blueprints.map(bp => bp.id === activeBpId ? updatedBlueprint : bp));
      onAddLog(`💾 Overwrote Draft Strategy Layout: [${updatedBlueprint.name}]`);
    }

    setBlueprintStatusAlert("🚀 Blueprint configuration saved successfully! (Browser Persistent)");
  };

  // Boot standard preset strategy
  const handleAddNewBlueprintSetup = () => {
    setActiveBpId("new-blank");
    setCurrentPins([]);
    setCurrentConns([]);
    setBpName("OPERATOR RUSHLINE DELTA");
    setBpDesc("Formulate container positions in secondary defense block tiering...");
    setBlueprintStatusAlert("✏️ Switched to blank tactical whiteboard. Place nodes and save!");
  };

  // EXPORT JSON ACTION
  const handleExecuteExportJson = () => {
    const currentSetup: TdmBlueprint = {
      id: activeBpId,
      name: bpName,
      mapId: activeMapId,
      creator: userIgn,
      description: bpDesc,
      pins: currentPins,
      connections: currentConns,
      createdAt: new Date().toISOString()
    };

    const strJson = JSON.stringify(currentSetup, null, 2);
    setJsonText(strJson);
    setJsonActionType("export");
    setShowJsonModal(true);
    setErrorMessage("");
  };

  // IMPORT JSON ACTION
  const handleExecuteImportJson = () => {
    setJsonText("");
    setJsonActionType("import");
    setShowJsonModal(true);
    setErrorMessage("");
  };

  const handleImportJsonPayloadSubmit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.name || !parsed.mapId || !Array.isArray(parsed.pins)) {
        throw new Error("Missing mandatory keys (name, mapId, pins[])");
      }

      // Check map validity
      if (!MAPS_META[parsed.mapId as "warehouse"]) {
        parsed.mapId = "warehouse"; // safe fallback
      }

      const importedBlueprint: TdmBlueprint = {
        id: `bp-import-${Date.now()}`,
        name: parsed.name.toUpperCase(),
        mapId: parsed.mapId,
        creator: parsed.creator || "Imported Operator",
        description: parsed.description || "No description provided during importing.",
        pins: parsed.pins,
        connections: parsed.connections || [],
        createdAt: new Date().toISOString()
      };

      setBlueprints([...blueprints, importedBlueprint]);
      setActiveBpId(importedBlueprint.id);
      setShowJsonModal(false);
      setBlueprintStatusAlert("⚡ Configuration imported successfully! Matchmaker is active.");
      onAddLog(`📂 Imported Strategy Layout from JSON Config: [${importedBlueprint.name}]`);
    } catch (err: any) {
      setErrorMessage(`Parse Exception: ${err.message || "Invalid JSON syntax configuration string"}`);
    }
  };

  const handleCopyToClipboard = () => {
    try {
      navigator.clipboard.writeText(jsonText);
      setBlueprintStatusAlert("📋 Copied JSON configuration string to clipboard!");
    } catch {
      setBlueprintStatusAlert("⚠️ Forced copy fail, please select and copy block manually.");
    }
  };

  const downloadJsonFile = () => {
    try {
      const blob = new Blob([jsonText], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bpName.toLowerCase().replace(/\s+/g, "_")}_tdm_strategy.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setBlueprintStatusAlert("💾 File Download initiated! check your downloads folder.");
    } catch {
      setBlueprintStatusAlert("⚠️ Unable to initiate download on this frame context.");
    }
  };

  // Get active map details
  const activeMapMeta = MAPS_META[activeMapId] || MAPS_META.warehouse;

  return (
    <div className="bg-[#111111] p-5 rounded-2xl border border-zinc-800 space-y-6 select-none relative z-10" id="tdm-strategy-blueprint-module">
      
      {/* MODULE HEADER TITLE CARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#ff001c]">
            <Compass size={18} className="animate-spin-slow text-[#ff001c]" />
            <h3 className="text-xs font-mono font-black tracking-widest uppercase">
              TDM STRATEGY BLUEPRINT MAINBOARD
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Design, coordinate, and plot custom vector annotation layers on tactical arenas. Export JSON configurations to deploy configurations directly.
          </p>
        </div>

        {/* TOP CONTROLS FOR IMPORT AND EXPORT QUICK CONFIG */}
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={handleExecuteImportJson}
            className="flex-1 sm:flex-none py-1.5 px-3 bg-[#1A1A1A] hover:bg-zinc-800 border border-zinc-800 font-mono text-[10px] text-zinc-300 rounded cursor-pointer transition-colors flex items-center justify-center gap-1 uppercase"
          >
            <Upload size={10} className="text-red-500" /> [IMPORT JSON]
          </button>
          <button
            type="button"
            onClick={handleExecuteExportJson}
            className="flex-1 sm:flex-none py-1.5 px-3 bg-[#1A1A1A] hover:bg-zinc-800 border border-zinc-800 font-mono text-[10px] text-zinc-300 rounded cursor-pointer transition-colors flex items-center justify-center gap-1 uppercase"
          >
            <Download size={10} className="text-emerald-500" /> [EXPORT CURRENT]
          </button>
        </div>
      </div>

      {/* CORE CONTROL DIVISION SPLIT: BLUEPRINT LIST & ACTIVE DRAFT MODES */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* LEFT COLUMN: SAVED TACTICAL SCHEMAS INDEX (1/4 Width) */}
        <div className="lg:col-span-1 border border-zinc-900 rounded-xl bg-black/40 p-3 space-y-3 flex flex-col justify-between relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 animate-pulse">
              <span className="text-[9px] font-mono font-black text-zinc-400 tracking-wider">SELECT BLUEPRINT SHEETS</span>
              <span className="text-[8px] bg-red-955 text-[#ff001c] px-1.5 py-0.5 rounded font-mono font-bold uppercase transition-all">
                {blueprints.length} SHEMAS
              </span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 select-none no-scrollbar">
              {blueprints.map(bp => (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => setActiveBpId(bp.id)}
                  onMouseEnter={() => setHoveredBp(bp)}
                  onMouseLeave={() => setHoveredBp(null)}
                  className={`w-full text-left p-2.5 rounded-lg border font-mono transition-all duration-150 relative block group/item ${
                    activeBpId === bp.id 
                      ? "bg-red-955/20 border-red-500/50 text-white" 
                      : "bg-[#070707] hover:bg-zinc-900/60 border-zinc-900 text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-black truncate uppercase group-hover/item:text-red-400 transition-colors">{bp.name}</span>
                    <span className="text-[7px] text-zinc-500 font-bold uppercase text-right leading-none shrink-0 border border-zinc-900 bg-[#141414] px-1 py-px rounded">
                      {bp.mapId.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[8px] text-zinc-500 line-clamp-1">{bp.description}</div>
                  <div className="text-[7px] text-[#ff001c] mt-1 text-right">By: {bp.creator}</div>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC HOVER TACTICAL PREVIEW OVERLAY FLYOUT */}
          <AnimatePresence>
            {hoveredBp && (
              <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-full top-0 ml-4 z-50 w-80 bg-zinc-950 border-2 border-red-950/80 rounded-xl p-3 shadow-[0_0_25px_rgba(255,0,28,0.15)] pointer-events-none hidden lg:block"
              >
                {/* Visual indicator corner brackets */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#ff001c]/60" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#ff001c]/60" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#ff001c]/60" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#ff001c]/60" />

                {/* HUD Header */}
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-2">
                  <div>
                    <span className="text-[7.5px] font-mono text-zinc-550 block font-bold leading-none tracking-widest uppercase">TACTICAL LAYOUT PREVIEW</span>
                    <span className="text-[10px] font-mono font-black text-rose-500 block leading-tight truncate max-w-[210px] uppercase">
                      {hoveredBp.name}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono font-extrabold bg-[#ff001c] text-white px-1.5 py-0.5 rounded leading-none shrink-0">
                    {hoveredBp.mapId.toUpperCase()}
                  </span>
                </div>

                {/* Map thumbnail and pin overlay container */}
                <div className="relative w-full h-[160px] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-850">
                  {/* Map image from Unsplash representation */}
                  <img
                    src={
                      hoveredBp.mapId === "warehouse"
                        ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300"
                        : hoveredBp.mapId === "hangar"
                        ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300"
                        : hoveredBp.mapId === "containers"
                        ? "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=300"
                        : hoveredBp.mapId === "ruins"
                        ? "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=300"
                        : "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300"
                    }
                    alt={hoveredBp.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-35"
                  />

                  {/* Tech HUD Scan Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px] opacity-60 mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                  {/* Radar sweep beam animation */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff001c]/70 to-transparent shadow-[0_0_8px_#ff001c] pointer-events-none animate-bounce" style={{ top: "45%", animationDuration: "2.4s" }} />

                  {/* Connection vectors overlay (SVG line) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {hoveredBp.connections.map((conn) => {
                      const fromPin = hoveredBp.pins.find(p => p.id === conn.fromPinId);
                      const toPin = hoveredBp.pins.find(p => p.id === conn.toPinId);
                      if (!fromPin || !toPin) return null;

                      const x1 = `${fromPin.x}%`;
                      const y1 = `${fromPin.y}%`;
                      const x2 = `${toPin.x}%`;
                      const y2 = `${toPin.y}%`;

                      let traceClr = "#f43f5e";
                      let isDash = false;
                      if (conn.type === "lineOfSight") {
                        traceClr = "#10b981";
                        isDash = true;
                      } else if (conn.type === "rotation") {
                        traceClr = "#3b82f6";
                        isDash = true;
                      }

                      return (
                        <line
                          key={conn.id}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={traceClr}
                          strokeWidth="1.5"
                          strokeDasharray={isDash ? "2.5,2.5" : undefined}
                          className="opacity-75 animate-pulse"
                        />
                      );
                    })}
                  </svg>

                  {/* Overlaid pins/nodes on map */}
                  {hoveredBp.pins.map((pin) => {
                    const pinColor = 
                      pin.type === "attack" ? "#ef4444" : 
                      pin.type === "defense" ? "#3b82f6" : 
                      pin.type === "ambush" ? "#f59e0b" : 
                      pin.type === "sniper" ? "#10b981" : "#a1a1aa";

                    return (
                      <div
                        key={pin.id}
                        style={{
                          left: `${pin.x}%`,
                          top: `${pin.y}%`,
                          transform: "translate(-50%, -50%)"
                        }}
                        className="absolute w-3.5 h-3.5 flex items-center justify-center pointer-events-none z-10"
                      >
                        <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: pinColor, animationDuration: "1.8s" }} />
                        <span className="relative inline-flex rounded-full h-2 w-2 border border-zinc-950 shadow shadow-black" style={{ backgroundColor: pinColor }} />
                        
                        {/* Miniature text tag */}
                        <div className="absolute left-full ml-1 bg-black/95 border border-zinc-900 rounded font-sans text-[6px] text-white px-0.5 leading-none pointer-events-none select-none uppercase tracking-tighter truncate max-w-[45px]">
                          {pin.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Metadata stats */}
                <div className="mt-2 space-y-1.5 font-mono text-[8px]">
                  <div className="text-zinc-400 leading-tight italic line-clamp-2">
                    "{hoveredBp.description}"
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-900 pt-1.5 text-zinc-500">
                    <span>PILOT: <strong className="text-zinc-300">{hoveredBp.creator}</strong></span>
                    <span className="flex gap-2">
                      <span>PINS: <strong className="text-red-400">{hoveredBp.pins.length}</strong></span>
                      <span>LINKS: <strong className="text-blue-400">{hoveredBp.connections.length}</strong></span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <button
              onClick={handleAddNewBlueprintSetup}
              className="w-full py-2 bg-[#ff001c]/10 hover:bg-[#ff001c]/20 text-[#ff001c] border border-[#ff001c]/30 text-[10px] font-mono font-black tracking-wider uppercase rounded cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              <PlusCircle size={11} /> CREATE BLANK BOARD
            </button>
            {activeBpId !== "bp-seed-1" && activeBpId !== "bp-seed-2" && activeBpId !== "new-blank" && (
              <button
                onClick={() => {
                  setBlueprints(blueprints.filter(bp => bp.id !== activeBpId));
                  setActiveBpId("bp-seed-1");
                  onAddLog(`🗑️ Deleted Custom Strategy Sheet.`);
                  setBlueprintStatusAlert("🧹 Selected strategy sheet removed from local registries.");
                }}
                className="w-full py-1.5 bg-zinc-950 hover:bg-red-955 text-zinc-500 hover:text-red-100 text-[9px] font-mono border border-zinc-900 rounded cursor-pointer transition-colors flex items-center justify-center gap-1 uppercase"
              >
                <Trash2 size={9} /> DELETE SELECT SHEET
              </button>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: LIVE VECTOR BLACKBOARD WORKSHOP (2/4 Width) */}
        <div className="lg:col-span-2 space-y-3 flex flex-col justify-between">
          
          {/* HEADER BAR FOR SELECTED MAP DETAILS */}
          <div className="flex justify-between items-center bg-black/80 border border-zinc-900 px-3 py-2 rounded-xl text-xs gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🧭</span>
              <div>
                <div className="font-mono text-white text-[11px] font-black uppercase flex items-center gap-1.5">
                  ACTIVE MATRIX MAP: <span className="text-red-500">{activeMapMeta.name}</span>
                </div>
                <div className="text-[9px] text-zinc-505 font-mono capitalize leading-none pt-0.5">{activeMapMeta.desc}</div>
              </div>
            </div>

            {/* Select Map Picker */}
            <div className="text-right">
              <select
                value={activeMapId}
                onChange={(e) => setActiveMapId(e.target.value as any)}
                className="bg-[#0c0c0c] border border-zinc-800 text-[9px] text-zinc-300 p-1.5 rounded font-mono cursor-pointer uppercase font-black"
                id="tdm-tactical-map-selector"
              >
                <option value="warehouse">Warehouse (TDM)</option>
                <option value="hangar">Hangar (Arena)</option>
                <option value="containers">Containers (Harbor)</option>
                <option value="ruins">Ruins (Ancient)</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC INTERACTIVE STRATEGY VECTOR BOARD GRAPHIC */}
          <div className="relative w-full">
            <div
              ref={containerRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-[340px] border border-zinc-900 bg-[#040406] rounded-xl overflow-hidden cursor-crosshair flex items-center justify-center select-none"
              id="tdm-blueprint-vector-canvas"
            >
              {/* Background blueprint aesthetics: Laser grids */}
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(#4d5460_1px,transparent_1px),linear-gradient(90deg,#4d5460_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              
              {/* Decorative radial coordinate radar sweeps */}
              <div className="absolute w-[95%] h-[95%] border-[1.5px] border-zinc-900/10 rounded-full pointer-events-none" />
              <div className="absolute w-[60%] h-[60%] border border-zinc-900/15 rounded-full pointer-events-none" />

              {/* Axis Labeling indicators in corners of matrix map */}
              <div className="absolute top-2 left-3 font-mono text-[8px] text-zinc-650 pointer-events-none font-bold">GRID SYNC ENGINE (10x10)</div>
              <div className="absolute bottom-2 left-3 font-mono text-[8px] text-zinc-650 pointer-events-none">CV PROTOCOL S38</div>
              <div className="absolute bottom-2 right-3 font-mono text-[8px] text-zinc-650 pointer-events-none">MATRIX TACTICAL</div>

              {/* VECTOR DRAW LAYER: RENDERING PRESET OBSTACLES */}
              {activeMapMeta.obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute rounded border flex items-center justify-center p-1 text-center font-mono text-[7px] text-zinc-550 pointer-events-none leading-none border-dashed transition-all"
                  style={{
                    left: `${obs.x}%`,
                    top: `${obs.y}%`,
                    width: `${obs.w}%`,
                    height: `${obs.h}%`,
                    backgroundColor: obs.color,
                    borderColor: obs.border
                  }}
                >
                  <span className="uppercase text-center p-0.5 tracking-tighter block select-none break-all opacity-40">
                    {obs.name}
                  </span>
                </div>
              ))}

              {/* VECTOR DRAW LAYER: SVG VECTOR VIRTUAL CONNECTING PIPELINE ARROWS */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff001c" />
                  </marker>
                  <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#024ef1" />
                  </marker>
                  <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                </defs>

                {currentConns.map((conn) => {
                  const fromPin = currentPins.find(p => p.id === conn.fromPinId);
                  const toPin = currentPins.find(p => p.id === conn.toPinId);
                  if (!fromPin || !toPin) return null;

                  // Convert percentage positions from parents width and height
                  const x1 = `${fromPin.x}%`;
                  const y1 = `${fromPin.y}%`;
                  const x2 = `${toPin.x}%`;
                  const y2 = `${toPin.y}%`;

                  // Determine connector lines attributes base color
                  let tracerColor = "#ef4444";
                  let markerId = "arrow";
                  let isDashed = false;

                  if (conn.type === "lineOfSight") {
                    tracerColor = "#10b981";
                    markerId = "arrow-green";
                    isDashed = true;
                  } else if (conn.type === "rotation") {
                    tracerColor = "#024ef1";
                    markerId = "arrow-blue";
                    isDashed = true;
                  }

                  return (
                    <g key={conn.id}>
                      {/* Interactive visual line with arrow */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={tracerColor}
                        strokeWidth="1.5"
                        strokeDasharray={isDashed ? "3,3" : undefined}
                        markerEnd={`url(#${markerId})`}
                        className="opacity-70 animate-pulse"
                      />
                      {/* Highlight core loop animation line */}
                      <circle cx={x1} cy={y1} r="2" fill={tracerColor} />
                    </g>
                  );
                })}
              </svg>

              {/* VECTOR DRAW LAYER: RENDERING PLACED SQUAD PINS / NODES */}
              <AnimatePresence>
                {currentPins.map((pin) => {
                  const pType = PIN_TYPES[pin.type] || PIN_TYPES.attack;
                  const isSelected = selectedPinId === pin.id;
                  const isConnectingSrc = connectingFromPinId === pin.id;

                  return (
                    <motion.div
                      key={pin.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      style={{
                        left: `${pin.x}%`,
                        top: `${pin.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      className="absolute z-30 interactive-pin"
                    >
                      {/* Trigger pin-point handle button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (connectingFromPinId) {
                            handleCompleteConnection(pin.id);
                          } else {
                            setSelectedPinId(isSelected ? null : pin.id);
                          }
                        }}
                        className={`relative w-7 h-7 rounded-full border shadow-lg flex items-center justify-center transition-all cursor-pointer ${
                          isConnectingSrc 
                            ? "border-amber-400 bg-amber-950 text-amber-500 scale-125 animate-pulse" 
                            : isSelected 
                              ? "border-red-500 bg-red-950 text-white scale-125 ring-2 ring-red-650"
                              : "border-zinc-800 bg-[#0a0a0c] text-zinc-300 hover:border-zinc-650 hover:scale-110"
                        }`}
                        title={pin.label}
                      >
                        <span className="text-xs leading-none select-none">{pType.icon}</span>
                        {/* Ripple pulses for premium gameplay style */}
                        <span className={`absolute -inset-0.5 rounded-full border border-dashed animate-ping opacity-30 ${pType.color}`} style={{ animationDuration: '3s' }} />
                      </button>

                      {/* Floating Indicator Label */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/90 border border-zinc-900/90 text-[8px] font-mono font-bold py-0.5 px-1.5 rounded whitespace-nowrap text-zinc-300 pointer-events-none uppercase tracking-wide">
                        {pin.label}
                      </div>

                      {/* SECTOR POPUP PRECISE CARD CONTROLLER (When selected) */}
                      {isSelected && (
                        <div className="absolute bottom-10 left-12 transform -translate-x-12 z-50 w-52 p-3 rounded-xl border border-zinc-850 bg-[#08080a]/95 backdrop-blur-md shadow-2xl text-[10px] space-y-2 canvas-overlay-popup">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 font-mono">
                            <span className="font-extrabold text-[#ff001c] uppercase tracking-wider">TACTICAL NODE INFO</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPinId(null);
                              }}
                              className="text-zinc-500 hover:text-white uppercase font-black text-[9px]"
                            >
                              [X]
                            </button>
                          </div>

                          <div className="space-y-1 font-mono">
                            <p className="text-white font-heavy uppercase font-bold text-[10px]">{pin.label}</p>
                            <p className="text-zinc-500 uppercase text-[8px]">TYPE: <span className={pType.text}>{pType.label}</span></p>
                            {pin.notes && <p className="text-zinc-400 font-sans text-[9px] leading-relaxed italic bg-zinc-950 p-1 border border-zinc-900/60 rounded mt-1">"{pin.notes}"</p>}
                            <p className="text-zinc-600 font-mono text-[7px] pt-1">GRID COORDINATES: X: {pin.x}%, Y: {pin.y}%</p>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-zinc-900/80">
                            <button
                              type="button"
                              onClick={() => handleInitiateConnection(pin.id)}
                              className="py-1 bg-[#1A1A1A] hover:bg-[#1E1E2E] border border-zinc-800 text-[8px] font-mono text-zinc-300 uppercase rounded cursor-pointer text-center button-control"
                              title="Connect trace vector arrow from this slot to other target"
                            >
                              🔗 Connect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePin(pin.id)}
                              className="py-1 bg-red-955/20 hover:bg-red-955 hover:text-white border border-red-900 text-[8px] font-mono text-red-400 uppercase rounded cursor-pointer text-center button-control"
                            >
                              🗑️ Delete
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              try {
                                navigator.clipboard.writeText(`X: ${pin.x}%, Y: ${pin.y}%`);
                                setBlueprintStatusAlert(`📋 Copied node coordinates [X: ${pin.x}%, Y: ${pin.y}%] to clipboard!`);
                              } catch {
                                setBlueprintStatusAlert("⚠️ Unable to copy automatically, please copy manually.");
                              }
                              onAddLog(`📋 Copied coordinates for "${pin.label}": X: ${pin.x}%, Y: ${pin.y}%`);
                            }}
                            className="w-full py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-[8px] font-mono text-zinc-300 uppercase rounded cursor-pointer text-center button-control flex items-center justify-center gap-1"
                          >
                            📋 Copy Coordinates
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* DYNAMIC FORM PANE OVERLAY (When user clicked coordinates to spawn new pin) */}
              <AnimatePresence>
                {pendingClickCoords && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    className="absolute z-[100] inset-x-4 bottom-4 p-4 rounded-xl border border-zinc-850 bg-black/95 backdrop-blur-xl shadow-2xl space-y-3 font-sans max-h-[85%] overflow-y-auto canvas-overlay-popup"
                  >
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                      <div className="flex items-center gap-1.5 text-[#ff001c]">
                        <Compass className="animate-pulse" size={13} />
                        <span className="text-[10px] font-mono font-black uppercase text-white">
                          PLOT STRATEGY NODE AT GRID [X: {pendingClickCoords.x}%, Y: {pendingClickCoords.y}%]
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPendingClickCoords(null)}
                        className="text-zinc-500 hover:text-white font-mono text-[9px] font-black"
                      >
                        [CANCEL]
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
                      {/* Name input */}
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-1">NODE TITLE / NAME</label>
                        <input
                          type="text"
                          value={newPinLabel}
                          onChange={(e) => setNewPinLabel(e.target.value)}
                          placeholder="e.g. AWM Overlook Ridge"
                          className="w-full bg-[#0d0d0f] border border-zinc-800 text-white rounded p-1.5 text-xs text-left"
                        />
                      </div>

                      {/* Type select */}
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-1">STRATEGIC CATEGORY</label>
                        <select
                          value={newPinType}
                          onChange={(e) => setNewPinType(e.target.value as any)}
                          className="w-full bg-[#0d0d0f] border border-zinc-805 text-white rounded p-1.5 text-xs cursor-pointer uppercase font-black"
                        >
                          <option value="attack">💥 Assault / Breach</option>
                          <option value="defense">🛡️ Cover Barrier</option>
                          <option value="ambush">🔌 Bait & Hook</option>
                          <option value="sniper">🎯 Distance Sniper</option>
                          <option value="smoke">💨 Utility / Smoke</option>
                        </select>
                      </div>

                      {/* Notes input */}
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase tracking-widest font-black mb-1">TACTICAL BRIEFING GUIDANCE</label>
                        <input
                          type="text"
                          value={newPinNotes}
                          onChange={(e) => setNewPinNotes(e.target.value)}
                          placeholder="Hold angle or support breach..."
                          className="w-full bg-[#0d0d0f] border border-zinc-800 text-white rounded p-1.5 text-xs text-left"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1 border-t border-zinc-900 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setPendingClickCoords(null)}
                        className="px-3 py-1.5 bg-[#141414] hover:bg-zinc-850 text-zinc-400 rounded cursor-pointer text-center uppercase"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={handleCreatePin}
                        className="px-4 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded cursor-pointer font-black text-center uppercase"
                      >
                        Confirm Slot Node
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FLOATING CURSOR TELEMETRY COORDINATES */}
              {hoverCoords && (
                <div className="absolute right-3 top-3 bg-black/90 border border-zinc-905 px-2 py-1 rounded font-mono text-[8px] text-zinc-400 select-none pointer-events-none space-x-1 uppercase tracking-wide">
                  <span className="text-red-500 font-extrabold">SYS OVERLAY:</span>
                  <span>SECTOR <span className="text-white font-heavy">{subSector}</span></span>
                  <span>|</span>
                  <span>X: <span className="text-white">{hoverCoords.x}%</span> Y: <span className="text-white">{hoverCoords.y}%</span></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECAP & METRIC ATTRIBUTES INPUTS (1/4 Width) */}
        <div className="lg:col-span-1 border border-zinc-900 rounded-xl bg-black/40 p-4 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4 text-xs">
            <div className="border-b border-zinc-900 pb-2">
              <span className="text-[9px] font-mono font-black text-zinc-400 tracking-wider">BLUEPRINT SHEET REGISTRY</span>
            </div>

            {/* Title / Name */}
            <div className="space-y-1">
              <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-black block">BLUEPRINT TITLE</label>
              <input
                type="text"
                value={bpName}
                onChange={(e) => setBpName(e.target.value.toUpperCase())}
                placeholder="Give strategy a distinct name..."
                className="w-full bg-[#0a0a0c] border border-zinc-900 text-xs text-white p-2 rounded focus:outline-none focus:border-[#ff001c] font-mono tracking-wide uppercase font-black"
                id="tdm-tactical-blueprint-title"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-black block">TACTICAL EXECUTIONS SYNOPSIS</label>
              <textarea
                value={bpDesc}
                onChange={(e) => setBpDesc(e.target.value)}
                placeholder="Detail core player assignments..."
                rows={3}
                className="w-full bg-[#0a0a0c] border border-zinc-900 text-xs text-zinc-300 p-2 rounded focus:outline-none focus:border-[#ff001c] font-serif leading-relaxed text-left resize-none"
              />
            </div>

            {/* Trace setup connectors config helper */}
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-400 space-y-1.5 leading-relaxed">
              <span className="text-[8px] text-zinc-500 font-black block uppercase tracking-wide">VECTOR CONNECTOR MATRIX</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500">TYPE:</span>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as any)}
                  className="bg-black/60 border border-zinc-800 text-[8px] text-zinc-300 p-1 rounded font-mono cursor-pointer uppercase font-black"
                >
                  <option value="rotation">🔵 Rotation Path (Dashed)</option>
                  <option value="lineOfSight">🟢 Sniper LOS (Dashed)</option>
                  <option value="assault">🔴 Assault Charge (Solid)</option>
                </select>
              </div>
              <p className="text-[8px] text-zinc-600">
                Tip: Click a mapped node pin, click **🔗 Connect**, then click another target node.
              </p>
            </div>

            {/* Quick Summary Info details of current board */}
            <div className="p-2.5 bg-zinc-950/80 rounded-lg border border-zinc-900/60 font-mono text-[8px] text-zinc-500 space-y-1">
              <div className="flex justify-between">
                <span>TOTAL ROTATION NODES:</span>
                <span className="text-white font-bold">{currentPins.length}</span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE CONNECTORS / VECTORS:</span>
                <span className="text-white font-bold">{currentConns.length}</span>
              </div>
              <div className="flex justify-between">
                <span>LAST SAVED BY:</span>
                <span className="text-red-400 font-bold uppercase">{activeBpId === "new-blank" ? "PROVISIONAL" : blueprints.find(b => b.id === activeBpId)?.creator || "SYSTEM"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-zinc-900">
            <button
              onClick={handleSaveChanges}
              className="w-full py-2 bg-[#ff001c] hover:bg-red-700 text-white border border-transparent text-[10px] font-mono font-black tracking-widest uppercase rounded cursor-pointer transition-colors flex items-center justify-center gap-1 shadow-md shadow-red-950/40"
            >
              <CheckCircle size={12} /> CONFIRM & SAVE LAYOUT
            </button>
            <button
              onClick={handleClearAllDraftCoords}
              className="w-full py-1 bg-transparent hover:bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-900 text-[9px] font-mono rounded cursor-pointer transition-colors uppercase font-bold"
            >
              CLEAR MAP BOARD
            </button>
          </div>
        </div>

      </div>

      {/* TOP NOTIFICATIONS DOCK FEED */}
      {blueprintStatusAlert && (
        <div className="bg-[#0c0c0e] border border-zinc-850 px-4 py-2 rounded-xl flex items-center justify-between text-[10px] font-mono tracking-wide text-zinc-350">
          <span className="flex items-center gap-1.5 select-none leading-none">
            <Info size={11} className="text-red-500" />
            {blueprintStatusAlert}
          </span>
          <button
            type="button"
            onClick={() => setBlueprintStatusAlert("")}
            className="text-zinc-650 hover:text-white uppercase font-black cursor-pointer text-[8px]"
          >
            [DISMISS]
          </button>
        </div>
      )}

      {/* MODAL WINDOW PORTAL FOR JSON LOADING / TRANSMITTING */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl bg-[#09090b] border border-zinc-900 rounded-3xl p-6 space-y-4 text-left select-text relative shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="text-[#ff001c]" size={16} />
                <h4 className="text-xs font-black font-mono tracking-widest text-white uppercase">
                  {jsonActionType === "export" ? "EXPORT TACTICAL STRATEGY CONFIGURATION" : "IMPORT TACTICAL STRATEGY CONFIGURATION"}
                </h4>
              </div>
              <button
                type="button"
                className="text-zinc-500 hover:text-white cursor-pointer uppercase font-mono text-[10px] font-black"
                onClick={() => setShowJsonModal(false)}
              >
                [CLOSE]
              </button>
            </div>

            {jsonActionType === "export" ? (
              <div className="space-y-2">
                <p className="text-[10px] font-sans text-zinc-400 leading-relaxed">
                  The following JSON records map nodes, coordinates, custom overlays, vectors, and brief notes. Save or copy this string block directly to deploy configurations instantly.
                </p>
                <textarea
                  readOnly
                  value={jsonText}
                  rows={10}
                  className="w-full bg-[#050505] p-3 text-[9px] font-mono text-[#ff001c] rounded-xl border border-zinc-900 resize-none outline-none focus:border-[#ff001c] select-all cursor-text leading-relaxed"
                />
                <div className="flex justify-between items-center gap-3 pt-2">
                  <span className="text-[8px] font-mono text-zinc-650 uppercase">SIZE: {Math.round(jsonText.length)} CHARACTERS</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={downloadJsonFile}
                      className="py-1.5 px-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 font-mono text-[9px] text-[#ff001c] rounded cursor-pointer uppercase font-black"
                    >
                      💾 DOWNLOAD JSON FILE
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyToClipboard}
                      className="py-1.5 px-4 bg-red-650 hover:bg-red-700 text-white font-mono text-[9px] rounded cursor-pointer uppercase font-black"
                    >
                      💥 COPY STRING
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] font-sans text-zinc-400 leading-relaxed font-mono">
                  PASTE AN AUTHORIZED LOBBY STRATEGY SCHEMATIC JSON STRING BELOW FOR REHYDRATION IN LOCAL BLACKBOARD MAIN FRAME:
                </p>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='{ "name": "VIPERS ASSAULT SHEETS", "mapId": "warehouse", "pins": [...] }'
                  rows={8}
                  className="w-full bg-[#050505] p-3 text-[9.5px] font-mono text-zinc-300 rounded-xl border border-zinc-900 resize-none outline-none focus:border-[#ff001c] cursor-text leading-relaxed font-semibold"
                />
                
                {errorMessage && (
                  <p className="text-[9px] font-mono text-red-500 font-black tracking-wide uppercase bg-red-950/20 border border-red-900/45 p-2 rounded">
                    🛑 {errorMessage}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJsonModal(false)}
                    className="py-1.5 px-4 bg-zinc-950 text-zinc-550 border border-zinc-900 font-mono text-[9px] rounded cursor-pointer uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImportJsonPayloadSubmit}
                    className="py-1.5 px-5 bg-[#ff001c] hover:bg-red-700 text-white font-mono text-[9px] rounded cursor-pointer uppercase font-black"
                  >
                    🚀 DEPLOY SCHEME
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
