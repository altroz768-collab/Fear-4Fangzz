import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Map,
  Plus,
  Trash2,
  Play,
  Pause,
  Layers,
  Settings,
  Tv,
  Users,
  Grid,
  TrendingUp,
  Flame,
  Volume2,
  VolumeX,
  FileText,
  Lock,
  Unlock,
  Eye,
  MessageSquare,
  Sparkles,
  RefreshCw,
  FolderOpen,
  UserCheck,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
  Camera,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Award,
  AlertTriangle,
  Undo2,
  Redo2,
  RotateCw,
  GripVertical,
  Download,
  Share2,
  FileJson,
  Search
} from "lucide-react";
import { MapStrategy } from "../types";
import { INITIAL_STRATEGY_MAPS } from "../data";

// Official PUBG Maps data
interface MapDetails {
  id: string;
  name: string;
  game: string;
  type: string;
  image: string;
  desc: string;
}

const PUBG_MAPS: MapDetails[] = [
  { id: "erangel", name: "Erangel", game: "PUBG Mobile", type: "8x8 km Forest", image: "/src/assets/images/erangel_tactical_map_1781523653970.jpg", desc: "Classic landmass featuring dense forests, military base, and Pochinki hotspots." },
  { id: "miramar", name: "Miramar", game: "PUBG Mobile", type: "8x8 km Desert", image: "/src/assets/images/miramar_tactical_map_1781523668860.jpg", desc: "Arid desert wasteland with elevated ridges, sniper lines, and heavy city structures." },
  { id: "sanhok", name: "Sanhok", game: "PUBG Mobile", type: "4x4 km Jungle", image: "/src/assets/images/sanhok_tactical_map_1781523683529.jpg", desc: "Intense tropical climate with small island channels, high loot, and rapid circles." },
  { id: "vikendi", name: "Vikendi", game: "PUBG Mobile", type: "6x6 km Snow", image: "/src/assets/images/vikendi_tactical_map_1781523699214.jpg", desc: "Beautiful snow-capped resort featuring icy rivers, Castle compound, and Cosmodrome." },
  { id: "livik", name: "Livik", game: "PUBG Mobile", type: "2x2 km Compact", image: "/src/assets/images/livik_tactical_map_1781523715245.jpg", desc: "Fast hybrid map blending glaciers, desert sand, and rolling meadows." },
  { id: "nusa", name: "Nusa", game: "PUBG Mobile", type: "1x1 km Resort", image: "/src/assets/images/nusa_tactical_map_1781523732749.jpg", desc: "Micro-island resort pack with vertical lift elevators, ziplines, and instant tactical redeploy." },
  { id: "karakin", name: "Karakin", game: "PUBG Mobile", type: "2x2 km Arid", image: "/src/assets/images/karakin_tactical_map_1781523748643.jpg", desc: "Rocky coasts and underground tunnels, subject to demolition zones that level cities." }
];

export interface StrategicZone {
  name: string;
  type: "choke" | "highground" | "compound";
  x: number;
  y: number;
}

export const STRATEGIC_ZONES: Record<string, StrategicZone[]> = {
  erangel: [
    { name: "Pochinki Hills", type: "highground", x: 48, y: 52 },
    { name: "Rozhok Ridge", type: "highground", x: 55, y: 35 },
    { name: "Yasnaya Compound", type: "compound", x: 68, y: 32 },
    { name: "Sosy Bridge (West)", type: "choke", x: 42, y: 78 },
    { name: "Sosy Bridge (East)", type: "choke", x: 58, y: 78 },
    { name: "Georgopol Bridge", type: "choke", x: 28, y: 38 },
    { name: "Mylta Power Complex", type: "compound", x: 82, y: 56 }
  ],
  miramar: [
    { name: "Pecado Hills", type: "highground", x: 49, y: 50 },
    { name: "Hacienda Ridge", type: "highground", x: 54, y: 38 },
    { name: "Chumacera Valley", type: "choke", x: 38, y: 68 },
    { name: "Los Leones Entrance", type: "choke", x: 62, y: 72 },
    { name: "San Martin Pass", type: "choke", x: 52, y: 30 }
  ],
  sanhok: [
    { name: "Bootcamp Bridge", type: "choke", x: 50, y: 45 },
    { name: "Ruins Ridge", type: "highground", x: 35, y: 55 },
    { name: "Paradise Valley", type: "highground", x: 65, y: 38 },
    { name: "Khao Crossing", type: "choke", x: 42, y: 20 }
  ],
  vikendi: [
    { name: "Castle Bridge", type: "choke", x: 52, y: 53 },
    { name: "Mount Kreznic", type: "highground", x: 48, y: 40 },
    { name: "Dobro Mesto Gate", type: "choke", x: 18, y: 48 },
    { name: "Cosmodrome Launch", type: "highground", x: 65, y: 25 }
  ],
  livik: [
    { name: "Midstein Choke", type: "choke", x: 51, y: 52 },
    { name: "Power Plant Highground", type: "highground", x: 70, y: 60 },
    { name: "Gronhus Defenses", type: "compound", x: 35, y: 72 }
  ],
  nusa: [
    { name: "Flame Village Choke", type: "choke", x: 44, y: 50 },
    { name: "Science Center", type: "highground", x: 55, y: 38 }
  ],
  karakin: [
    { name: "Al Habar Highground", type: "highground", x: 60, y: 25 },
    { name: "Bahr Sahari Gate", type: "choke", x: 32, y: 48 }
  ]
};

// Layers configuration
interface LayerState {
  grid: boolean;
  heatmap: boolean;
  dropZones: boolean;
  dangerZones: boolean;
  lootRoutes: boolean;
  vehicleSpawns: boolean;
  sniperPositions: boolean;
  comments: boolean;
}

// Marker Types for annotations
type MarkerType =
  | "drop"
  | "rotation"
  | "danger"
  | "loot"
  | "vehicle"
  | "sniper"
  | "attack"
  | "defense"
  | "aggressive"
  | "defensive";

interface MapMarker {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  type: MarkerType;
  label: string;
  note?: string;
  color: string;
  screenshotUrl?: string;
  voiceUrl?: string; // Simulated voice memo
  createdAt: string;
  comments: { id: string; author: string; role: string; text: string; time: string }[];
  rotation?: number; // rotation in degrees
}

interface StrategyVersion {
  id: string;
  name: string;
  markers: MapMarker[];
  routes: { fromId: string; toId: string }[];
  commentsCount: number;
  updatedAt: string;
  author: string;
  isLocked: boolean;
  category: "tournament" | "scrim" | "squad" | "training";
}

interface MapHistoryState {
  markers: MapMarker[];
  routes: { fromId: string; toId: string }[];
}

export default function InteractiveStrategyMaps() {
  // Current chosen game & map
  const [selectedMap, setSelectedMap] = useState<MapDetails>(PUBG_MAPS[0]);
  
  // Strategy search & loading system
  const [stratSearchQuery, setStratSearchQuery] = useState<string>("");
  const [loadedStrategy, setLoadedStrategy] = useState<MapStrategy | null>(null);

  const handleLoadStrategyMap = (strat: MapStrategy) => {
    // 1. Find corresponding official map
    const matchedMap = PUBG_MAPS.find(m => m.name.toLowerCase() === strat.mapName.toLowerCase());
    if (matchedMap) {
      setSelectedMap(matchedMap);
      handleResetView();
    }

    // 2. Map strat.pins into our markers state
    const loadedMarkers: MapMarker[] = strat.pins.map((pin, idx) => {
      let mappedType: MarkerType = "drop";
      if (pin.type === "landing") mappedType = "drop";
      else if (pin.type === "rotation") mappedType = "rotation";
      else if (pin.type === "danger") mappedType = "danger";
      else if (pin.type === "ambush") mappedType = "sniper";

      return {
        id: `strat-marker-${idx}-${Date.now()}`,
        x: pin.x,
        y: pin.y,
        type: mappedType,
        label: pin.label,
        note: strat.notes,
        color: pin.color || "#ef4444",
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " UTC",
        comments: []
      };
    });

    // 3. Update active markers & routes
    setMarkers(loadedMarkers);
    
    // Auto build sequential routes for rotations
    const loadedRoutes: { fromId: string; toId: string }[] = [];
    for (let i = 0; i < loadedMarkers.length - 1; i++) {
      if (loadedMarkers[i].type === "rotation" || loadedMarkers[i + 1].type === "rotation") {
        loadedRoutes.push({
          fromId: loadedMarkers[i].id,
          toId: loadedMarkers[i + 1].id
        });
      }
    }
    setRoutes(loadedRoutes);

    // Save active loaded strategy
    setLoadedStrategy(strat);

    // Show dynamic success notification
    showNotification(`📂 Successfully hot-loaded strategy setup: "${strat.title}" onto the canvas!`);
    
    // Play success sweep sound
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch {}
  };

  const filteredStratMaps = INITIAL_STRATEGY_MAPS.filter((strat) => {
    const query = stratSearchQuery.toLowerCase();
    return (
      strat.title.toLowerCase().includes(query) ||
      strat.mapName.toLowerCase().includes(query) ||
      strat.notes.toLowerCase().includes(query) ||
      strat.author.toLowerCase().includes(query)
    );
  });
  
  // Tactical filters
  const [activeCategory, setActiveCategory] = useState<"all" | "tournament" | "scrim" | "squad" | "training">("all");
  
  // Current user role simulated for Role-Based Access Controls
  const [userRole, setUserRole] = useState<"Coach" | "Leader" | "Analyst" | "Recruit">("Coach");
  const [statusAlert, setStatusAlert] = useState<string>("");

  // Undo/Redo mechanism state
  const [past, setPast] = useState<MapHistoryState[]>([]);
  const [future, setFuture] = useState<MapHistoryState[]>([]);
  
  // Zoom & Pan state
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [liveCoords, setLiveCoords] = useState<{ x: number; y: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isTheatreMode, setIsTheatreMode] = useState<boolean>(false);
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTheatreMode) {
        setIsTheatreMode(false);
        showNotification("📺 Exited Full View mode.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTheatreMode]);
  
  // Layers toggles
  const [layers, setLayers] = useState<LayerState>({
    grid: true,
    heatmap: true,
    dropZones: true,
    dangerZones: true,
    lootRoutes: true,
    vehicleSpawns: true,
    sniperPositions: true,
    comments: true,
  });

  // Markers state & Routes (Paths)
  const [markers, setMarkers] = useState<MapMarker[]>([
    {
      id: "m1",
      x: 48,
      y: 52,
      type: "drop",
      label: "Initial Pochinki Drop",
      note: "Aim for north garages to secure vehicle spawns immediately.",
      color: "#ef4444",
      createdAt: "08:15 UTC",
      comments: [
        { id: "c1", author: "Viper_Slayer", role: "Team Leader", text: "Agreed, let's look out for early gliders from School region.", time: "08:18 UTC" }
      ]
    },
    {
      id: "m2",
      x: 35,
      y: 42,
      type: "vehicle",
      label: "Dacia Spawn Point",
      note: "High probability spawn at three-house cluster.",
      color: "#3b82f6",
      createdAt: "08:16 UTC",
      comments: []
    },
    {
      id: "m3",
      x: 55,
      y: 35,
      type: "rotation",
      label: "Stage 2 Ridge Hold",
      note: "Hold the high ground to scout out Rozhok rotations.",
      color: "#10b981",
      createdAt: "08:17 UTC",
      comments: []
    }
  ]);

  const [routes, setRoutes] = useState<{ fromId: string; toId: string }[]>([
    { fromId: "m1", toId: "m3" }
  ]);

  // Version historical states
  const [versions, setVersions] = useState<StrategyVersion[]>([
    {
      id: "v1",
      name: "Championship Erangel Split Plan V1",
      markers: [
        { id: "mv1", x: 48, y: 52, type: "drop", label: "Pochinki Base", color: "#ef4444", createdAt: "2026-06-09 06:12", comments: [] },
        { id: "mv2", x: 35, y: 42, type: "vehicle", label: "Dacia Spawn Point", color: "#3b82f6", createdAt: "2026-06-09 06:12", comments: [] },
        { id: "mv3", x: 55, y: 35, type: "rotation", label: "Stage 2 Ridge Hold", color: "#10b981", createdAt: "2026-06-09 06:12", comments: [] }
      ],
      routes: [
        { fromId: "mv1", toId: "mv3" }
      ],
      commentsCount: 2,
      updatedAt: "2026-06-09 06:12",
      author: "CV_Tactical_Coach",
      isLocked: false,
      category: "tournament"
    },
    {
      id: "v2",
      name: "Scrim Pecado Siege Lineup",
      markers: [
        { id: "mv4", x: 30, y: 65, type: "attack", label: "Pecado South Entry", color: "#ef4444", createdAt: "2026-06-08 14:02", comments: [] },
        { id: "mv5", x: 50, y: 55, type: "sniper", label: "Roof Snipe Spot", color: "#f59e0b", createdAt: "2026-06-08 14:02", comments: [] },
        { id: "mv6", x: 70, y: 45, type: "defense", label: "Cover Ridge Anchor", color: "#3b82f6", createdAt: "10:10", comments: [] }
      ],
      routes: [
        { fromId: "mv4", toId: "mv5" },
        { fromId: "mv5", toId: "mv6" }
      ],
      commentsCount: 0,
      updatedAt: "2026-06-08 14:02",
      author: "Viper_Slayer",
      isLocked: true,
      category: "scrim"
    }
  ]);
  
  const [selectedVersionId, setSelectedVersionId] = useState<string>("v1");
  const [newVersionName, setNewVersionName] = useState<string>("");
  const [hoveredVersion, setHoveredVersion] = useState<StrategyVersion | null>(null);
  const [deletingVersion, setDeletingVersion] = useState<StrategyVersion | null>(null);

  // Editor mode state
  const [activeTool, setActiveTool] = useState<MarkerType | "path" | "measurement" | "comment" | null>(null);
  
  // Placement placement states
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);
  const [markerLabel, setMarkerLabel] = useState<string>("");
  const [markerNote, setMarkerNote] = useState<string>("");
  const [markerColor, setMarkerColor] = useState<string>("#ef4444");
  const [markerRotation, setMarkerRotation] = useState<number>(0);
  const [voiceSimulated, setVoiceSimulated] = useState<boolean>(false);
  const [screenshotSimulated, setScreenshotSimulated] = useState<string>("");
  
  // Path creation state
  const [pathSourceId, setPathSourceId] = useState<string | null>(null);

  // Comments & Map discussions states
  const [selectedMarkerForComment, setSelectedMarkerForComment] = useState<MapMarker | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>("");

  // Playback engine states
  const [isPlaybackActive, setIsPlaybackActive] = useState<boolean>(false);
  const [playbackTick, setPlaybackTick] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  
  // Real-time Collaboration Simulator flags
  const [isLiveCollabActive, setIsLiveCollabActive] = useState<boolean>(true);
  const [collabCursors, setCollabCursors] = useState<{ id: string; name: string; x: number; y: number; activeMarkerLabel?: string }[]>([
    { id: "col1", name: "Apex_Leader", x: 40, y: 48, activeMarkerLabel: "Placing vehicle marker" },
    { id: "col2", name: "Slayer_Analyst", x: 62, y: 38, activeMarkerLabel: "Reviewing ridge sniper line" }
  ]);

  // Measurement states
  const [measurementPoints, setMeasurementPoints] = useState<{ x: number; y: number }[]>([]);

  // Sound Wave Ref for voice recording bar mock
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  // Drag and drop state for tactical pins sidebar list
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [initialMarkersBeforeDrag, setInitialMarkersBeforeDrag] = useState<MapMarker[] | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setInitialMarkersBeforeDrag(markers);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updated = [...markers];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setMarkers(updated);
  };

  const handleDragEnd = () => {
    if (initialMarkersBeforeDrag) {
      const orderChanged = initialMarkersBeforeDrag.some((m, idx) => m.id !== markers[idx]?.id);
      if (orderChanged) {
        setPast(prev => [...prev, { markers: initialMarkersBeforeDrag, routes }]);
        setFuture([]);
        showNotification("📍 Tactical pins priority sequence reordered successfully!");
      }
    }
    setDraggedIndex(null);
    setInitialMarkersBeforeDrag(null);
  };

  // Export tactical blueprint as JSON configuration
  const exportBlueprintJSON = () => {
    try {
      const blueprint = {
        mapId: selectedMap.id,
        mapName: selectedMap.name,
        markers,
        routes,
        exportedAt: new Date().toISOString(),
        version: "2.0"
      };
      const jsonString = JSON.stringify(blueprint, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `TACTICAL_BLUEPRINT_${selectedMap.id.toUpperCase()}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification("💾 JSON blueprint exported successfully for external sharing!");
    } catch (err) {
      showNotification("❌ Failed to export JSON blueprint configuration.");
    }
  };

  // Import tactical blueprint configuration from a JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawText = event.target?.result as string;
        const data = JSON.parse(rawText);
        
        if (data && Array.isArray(data.markers)) {
          // Check if blueprint belongs to a different map
          const matchedMap = PUBG_MAPS.find(m => m.id === data.mapId);
          if (matchedMap && matchedMap.id !== selectedMap.id) {
            setSelectedMap(matchedMap);
            showNotification(`🗺️ Auto-switched map grid to matches blueprint: ${matchedMap.name}`);
          }

          pushHistory(markers, routes);
          setMarkers(data.markers);
          if (Array.isArray(data.routes)) {
            setRoutes(data.routes);
          } else {
            setRoutes([]);
          }
          showNotification("📥 Tactical blueprint configuration imported successfully!");
        } else {
          showNotification("❌ Invalid blueprint format. Missing markers dataset.");
        }
      } catch (err) {
        showNotification("❌ Failed to parse blueprint file. Ensure it is valid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  };

  // Capture current canvas layout & markers onto an offscreen canvas, export as high-res 1200px PNG
  const exportBlueprintPNG = () => {
    showNotification("📸 Preparing high-resolution tactical blueprint PNG rendering...");
    
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      showNotification("❌ Could not create background canvas rendering context.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedMap.image;

    img.onload = () => {
      try {
        // 1. Draw Map Background
        ctx.drawImage(img, 0, 0, 1200, 1200);

        // 2. Draw Semi-transparent tactical dark film overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(0, 0, 1200, 1200);

        // 3. Draw Grid lines if active
        if (layers.grid) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1;
          ctx.font = "bold 12px monospace";
          ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
          const cellSize = 1200 / 8;

          for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
              const x = col * cellSize;
              const y = row * cellSize;
              ctx.strokeRect(x, y, cellSize, cellSize);
              ctx.fillText(`${labels[col]}${row + 1}`, x + 10, y + 10);
            }
          }
        }

        // 4. Draw Waypoint Connection routes
        routes.forEach((route) => {
          const fromPin = markers.find(m => m.id === route.fromId);
          const toPin = markers.find(m => m.id === route.toId);
          if (fromPin && toPin) {
            const fx = (fromPin.x / 100) * 1200;
            const fy = (fromPin.y / 100) * 1200;
            const tx = (toPin.x / 100) * 1200;
            const ty = (toPin.y / 100) * 1200;

            // Dashed connection route
            ctx.beginPath();
            ctx.strokeStyle = "#ec4899"; // pink-500
            ctx.lineWidth = 4;
            ctx.setLineDash([12, 8]);
            ctx.moveTo(fx, fy);
            ctx.lineTo(tx, ty);
            ctx.stroke();

            // Arrow head
            ctx.setLineDash([]);
            const angle = Math.atan2(ty - fy, tx - fx);
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx - 20 * Math.cos(angle - Math.PI / 6), ty - 20 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(tx - 20 * Math.cos(angle + Math.PI / 6), ty - 20 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fillStyle = "#ec4899";
            ctx.fill();
          }
        });

        // 5. Draw Snapping Landmarks/Tactical zones if snapping is active
        if (snapToGrid) {
          (STRATEGIC_ZONES[selectedMap.id] || []).forEach((zone) => {
            const zx = (zone.x / 100) * 1200;
            const zy = (zone.y / 100) * 1200;
            const isChoke = zone.type === "choke";
            const isHigh = zone.type === "highground";

            ctx.beginPath();
            ctx.arc(zx, zy, 5, 0, 2 * Math.PI);
            ctx.fillStyle = isChoke ? "#ef4444" : isHigh ? "#0ea5e9" : "#10b981";
            ctx.fill();
          });
        }

        // 6. Draw Tactical Callout Pins
        markers.forEach((pin, idx) => {
          const px = (pin.x / 100) * 1200;
          const py = (pin.y / 100) * 1200;
          const color = pin.color || "#ef4444";

          // Outer shadow pulse effect
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.arc(px, py, 16, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          // Emoji symbol inside pin
          const iconEmoji = 
            pin.type === "aggressive" || pin.type === "attack" ? "⚔️" :
            pin.type === "defensive" || pin.type === "defense" ? "🛡️" :
            pin.type === "rotation" ? "🔄" :
            pin.type === "drop" ? "📦" :
            pin.type === "danger" ? "💥" :
            pin.type === "sniper" ? "👁️" :
            pin.type === "vehicle" ? "🚗" : "📍";
          ctx.font = "16px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(iconEmoji, px, py);

          // Priority order index badge
          ctx.beginPath();
          ctx.arc(px - 16, py - 16, 10, 0, 2 * Math.PI);
          ctx.fillStyle = "#18181b";
          ctx.fill();
          ctx.strokeStyle = "#3f3f46";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.font = "bold 9px monospace";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(`#${idx + 1}`, px - 16, py - 16);

          // Label tag plate
          const labelText = pin.label || `Callout ${idx + 1}`;
          ctx.font = "bold 11px sans-serif";
          const textWidth = ctx.measureText(labelText).width;

          ctx.fillStyle = "rgba(10, 12, 18, 0.95)";
          ctx.strokeStyle = "rgba(82, 82, 91, 0.6)";
          ctx.lineWidth = 1;

          const rx = px - textWidth / 2 - 8;
          const ry = py + 24;
          const rw = textWidth + 16;
          const rh = 20;

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(rx, ry, rw, rh, 4);
          } else {
            ctx.rect(rx, ry, rw, rh);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.fillText(labelText, px, py + 34);
        });

        // 7. Render high-end tactical map overlay HUD
        ctx.fillStyle = "rgba(6, 9, 14, 0.96)";
        ctx.fillRect(0, 0, 1200, 80);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(0, 77, 1200, 3);

        ctx.fillStyle = "#ffffff";
        ctx.font = "900 20px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("CV OFFENSIVE STRATEGY BLUEPRINT", 30, 40);

        ctx.fillStyle = "#a1a1aa";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "right";
        ctx.fillText(
          `MAP CONTEXT: ${selectedMap.name.toUpperCase()}  •  PIN COUNTS: ${markers.length} DEPLOYED  •  DATE: ${new Date().toLocaleDateString()}`,
          1170,
          40
        );

        // Download PNG link trigger
        const link = document.createElement("a");
        link.download = `TACTICAL_BLUEPRINT_${selectedMap.id.toUpperCase()}_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification("📸 Premium high-resolution PNG blueprint successfully downloaded!");
      } catch (err) {
        console.error("Canvas export PNG failed: ", err);
        showNotification("❌ Failed to render PNG blueprint. Falling back to JSON export instead.");
        exportBlueprintJSON();
      }
    };

    img.onerror = () => {
      showNotification("⚠️ Rendering sandbox error. Exporting blueprint as JSON file instead.");
      exportBlueprintJSON();
    };
  };

  // Undo/Redo history helper functions
  const pushHistory = (currentMarkers: MapMarker[], currentRoutes: { fromId: string; toId: string }[]) => {
    setPast(prev => [...prev, { markers: currentMarkers, routes: currentRoutes }]);
    setFuture([]); // Clear redo stack on any new change
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setFuture(prev => [{ markers, routes }, ...prev]);
    setMarkers(previous.markers);
    setRoutes(previous.routes);
    showNotification("↩️ Reverted recent change (Undo).");
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setFuture(newFuture);
    setPast(prev => [...prev, { markers, routes }]);
    setMarkers(next.markers);
    setRoutes(next.routes);
    showNotification("↪️ Re-applied change (Redo).");
  };

  // Keyboard shortcuts for Undo and Redo (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleUndoRedoKeys = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if (
        (isMeta && e.key.toLowerCase() === "y") ||
        (isMeta && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleUndoRedoKeys);
    return () => window.removeEventListener("keydown", handleUndoRedoKeys);
  }, [past, future, markers, routes]);

  // Simulated live triggers from collab teammates adding markers randomly to feel truly multiplayer!
  useEffect(() => {
    if (!isLiveCollabActive) return;
    
    const interval = setInterval(() => {
      // randomly move teammate cursors
      setCollabCursors(prev =>
        prev.map(c => ({
          ...c,
          x: Math.min(90, Math.max(10, c.x + (Math.random() * 8 - 4))),
          y: Math.min(90, Math.max(10, c.y + (Math.random() * 8 - 4)))
        }))
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveCollabActive]);

  // Playback Step Simulator
  useEffect(() => {
    let interval: any = null;
    if (isPlaybackActive) {
      interval = setInterval(() => {
        setPlaybackTick(prev => {
          if (prev >= markers.length - 1) {
            setIsPlaybackActive(false);
            showNotification("🎬 PLAYBACK COMPLETE: Entire planned route movement mapped!");
            return 0;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaybackActive, markers.length, playbackSpeed]);

  const showNotification = (msg: string) => {
    setStatusAlert(msg);
    setTimeout(() => setStatusAlert(""), 4000);
  };

  // Check if role is authorized to do critical actions
  const isAuthorized = () => {
    return userRole === "Coach" || userRole === "Leader" || userRole === "Analyst";
  };

  // Grid and Landmark/Zone Snapping function
  const getSnappedCoords = (x: number, y: number, mapId: string) => {
    if (!snapToGrid) return { x, y, snapName: null };

    // 1. Check if we are close to a designated strategic zone (within 8% radius)
    const zones = STRATEGIC_ZONES[mapId] || STRATEGIC_ZONES.erangel || [];
    let closestZone: any = null;
    let minDistance = Infinity;

    for (const zone of zones) {
      const dx = zone.x - x;
      const dy = zone.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
        closestZone = zone;
      }
    }

    // Snap to strategic zone if within 8.5% distance
    if (closestZone && minDistance <= 8.5) {
      return {
        x: closestZone.x,
        y: closestZone.y,
        snapName: `${closestZone.name} [${closestZone.type === "choke" ? "⚠️ CHOKE POINT" : closestZone.type === "highground" ? "🏔️ HIGH GROUND" : "🏢 COMPOUND"}]`
      };
    }

    // 2. Otherwise, snap to the nearest 8x8 grid lines or cell centers
    // Grid size is 12.5%. Snapping to multiples of 6.25% perfectly snaps to either grid lines or cell centers!
    const step = 6.25;
    const snappedX = Math.round(x / step) * step;
    const snappedY = Math.round(y / step) * step;

    const colIndex = Math.max(0, Math.min(7, Math.floor(x / 12.5)));
    const rowIndex = Math.max(0, Math.min(7, Math.floor(y / 12.5)));
    const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cellName = `${labels[colIndex]}${rowIndex + 1}`;

    return {
      x: snappedX,
      y: snappedY,
      snapName: `Grid Cell ${cellName}`
    };
  };

  // Convert click coordinates relative to map container size in percentage
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) return;
    
    // Acquire bounds
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Measurement tool logic
    if (activeTool === "measurement") {
      if (measurementPoints.length >= 2) {
        setMeasurementPoints([{ x, y }]);
      } else {
        const nextPoints = [...measurementPoints, { x, y }];
        setMeasurementPoints(nextPoints);
        if (nextPoints.length === 2) {
          const dx = nextPoints[1].x - nextPoints[0].x;
          const dy = nextPoints[1].y - nextPoints[0].y;
          const distance = Math.sqrt(dx * dx + dy * dy) * 80; // normalized factor for PUBG coordinates
          showNotification(`📐 MEASURED TRACK: Approximately ${(distance / 10).toFixed(2)} km in line distance.`);
        }
      }
      return;
    }

    if (!activeTool || activeTool === "path" ) return;

    if (!isAuthorized()) {
      showNotification("⚠️ ACCESS DENIED: Recruit accounts cannot place markers. Analyst/Leader required!");
      return;
    }

    if (snapToGrid) {
      const snapped = getSnappedCoords(x, y, selectedMap.id);
      setClickCoord({ x: snapped.x, y: snapped.y });
      setMarkerLabel(snapped.snapName ? `${snapped.snapName}` : "");
      setMarkerNote(`Tactical point precisely snapped to ${snapped.snapName || 'Grid'}.`);
      showNotification(`⚡ Snapped directly to: ${snapped.snapName || 'Grid intersect'}`);
    } else {
      setClickCoord({ x, y });
      setMarkerLabel("");
      setMarkerNote("");
    }
    
    setMarkerRotation(0);
    setVoiceSimulated(false);
    setScreenshotSimulated("");
  };

  // Confirm placing marker
  const handleConfirmAddMarker = () => {
    if (!clickCoord || !activeTool) return;

    const newMarker: MapMarker = {
      id: `m-${Date.now()}`,
      x: snapToGrid ? clickCoord.x : Math.round(clickCoord.x),
      y: snapToGrid ? clickCoord.y : Math.round(clickCoord.y),
      type: activeTool as MarkerType,
      label: markerLabel || `Tactical point ${markers.length + 1}`,
      note: markerNote,
      color: markerColor,
      rotation: markerRotation,
      screenshotUrl: screenshotSimulated,
      voiceUrl: voiceSimulated ? "Simulated vocal briefing wave" : undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " UTC",
      comments: []
    };

    pushHistory(markers, routes);
    setMarkers(prev => [...prev, newMarker]);
    setClickCoord(null);
    showNotification(`📍 Marker "${newMarker.label}" locked on coordinates Grid!`);

    // Auto-save simulation
    triggerAutoSave();
  };

  // Triggers simulator version tracking updates
  const triggerAutoSave = () => {
    // Also push updates to Versioning system
    setVersions(prev => {
      const updated = [...prev];
      const matchIndex = updated.findIndex(v => v.id === selectedVersionId);
      if (matchIndex !== -1 && !updated[matchIndex].isLocked) {
        updated[matchIndex] = {
          ...updated[matchIndex],
          markers: [...markers],
          routes: [...routes],
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return updated;
    });
  };

  // Create a connection route path between markers
  const handleMarkerClickToRoute = (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool !== "path") {
      // fallback to open annotation metadata/comment
      const targetMarker = markers.find(m => m.id === targetId);
      if (targetMarker) {
        setSelectedMarkerForComment(targetMarker);
      }
      return;
    }

    if (!isAuthorized()) {
      showNotification("⚠️ ACCESS DENIED: Role cannot define tactical routes.");
      return;
    }

    if (!pathSourceId) {
      setPathSourceId(targetId);
      showNotification("🔗 SOURCE PIN ESTABLISHED: Click another marker to secure rotation trajectory path.");
    } else {
      if (pathSourceId === targetId) {
        setPathSourceId(null);
        return;
      }
      // Add path link
      const alreadyExists = routes.some(
        r => (r.fromId === pathSourceId && r.toId === targetId) || (r.fromId === targetId && r.toId === pathSourceId)
      );

      if (!alreadyExists) {
        pushHistory(markers, routes);
        const newRoute = { fromId: pathSourceId, toId: targetId };
        setRoutes(prev => [...prev, newRoute]);
        showNotification("⚡ ROTATION Trajectory linked securely in Operational Frame.");
        triggerAutoSave();
      }
      setPathSourceId(null);
    }
  };

  // Remove individual marker
  const handleDeleteMarker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthorized()) {
      showNotification("⚠️ Permissions check failed to delete element.");
      return;
    }
    pushHistory(markers, routes);
    setMarkers(prev => prev.filter(m => m.id !== id));
    setRoutes(prev => prev.filter(r => r.fromId !== id && r.toId !== id));
    if (selectedMarkerForComment?.id === id) {
      setSelectedMarkerForComment(null);
    }
    showNotification("🗑️ Element deleted from active canvas frame.");
    triggerAutoSave();
  };

  // Live update marker rotation
  const handleUpdateMarkerRotation = (id: string, degrees: number) => {
    setMarkers(prev =>
      prev.map(m => (m.id === id ? { ...m, rotation: degrees } : m))
    );
    setSelectedMarkerForComment(prev => {
      if (prev && prev.id === id) {
        return { ...prev, rotation: degrees };
      }
      return prev;
    });
    triggerAutoSave();
  };

  // Add a comment to a marker coordinate thread
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedMarkerForComment) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: userRole === "Coach" ? "CV_Tac_Coach" : "Viper_Combatant",
      role: userRole,
      text: newCommentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " UTC"
    };

    pushHistory(markers, routes);
    setMarkers(prev =>
      prev.map(m => {
        if (m.id === selectedMarkerForComment.id) {
          const updatedMarker = {
            ...m,
            comments: [...m.comments, newComment]
          };
          // Keep active view refreshed
          setSelectedMarkerForComment(updatedMarker);
          return updatedMarker;
        }
        return m;
      })
    );

    setNewCommentText("");
    showNotification("💬 Coordinate comment posted live on tactics panel.");
    triggerAutoSave();
  };

  // Pan actions
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool) return; // ignore panning when tool selected
    setIsPanning(true);
    panStart.current = { x: e.clientX - mapPan.x, y: e.clientY - mapPan.y };

    // Set initial coordinate
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect) {
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      setLiveCoords({ x: Math.round(pctX * 10) / 10, y: Math.round(pctY * 10) / 10 });
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const nextPan = { x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y };
    // bound the pan limits roughly
    setMapPan({
      x: Math.max(-500, Math.min(500, nextPan.x)),
      y: Math.max(-500, Math.min(500, nextPan.y))
    });

    const rect = e.currentTarget.getBoundingClientRect();
    if (rect) {
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      setLiveCoords({ x: Math.round(pctX * 10) / 10, y: Math.round(pctY * 10) / 10 });
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setLiveCoords(null);
  };

  // Zoom control simple
  const handleZoomIn = () => setMapZoom(prev => Math.min(4.0, prev + 0.25));
  const handleZoomOut = () => setMapZoom(prev => Math.max(1.0, prev - 0.25));
  const handleResetView = () => {
    setMapZoom(1.0);
    setMapPan({ x: 0, y: 0 });
    setMeasurementPoints([]);
    setPathSourceId(null);
  };

  // Save manual named strategy version snapshot
  const handleSaveNamedVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;

    if (!isAuthorized()) {
      showNotification("⚠️ Only Coaches/Analysts can authorize new version locks.");
      return;
    }

    const nextVer: StrategyVersion = {
      id: `ver-${Date.now()}`,
      name: newVersionName,
      markers: [...markers],
      routes: [...routes],
      commentsCount: 0,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: userRole === "Coach" ? "CV_Tac_Coach" : "Viper_Leader",
      isLocked: false,
      category: activeCategory === "all" ? "training" : activeCategory as any
    };

    setVersions(prev => [nextVer, ...prev]);
    setSelectedVersionId(nextVer.id);
    setNewVersionName("");
    showNotification(`💾 Version "${nextVer.name}" saved as active strategy profile!`);
  };

  // Restore previous historical version
  const handleRestoreVersion = (ver: StrategyVersion) => {
    pushHistory(markers, routes);
    setMarkers(ver.markers);
    setRoutes(ver.routes);
    setSelectedVersionId(ver.id);
    showNotification(`🔄 Active canvas restored to: "${ver.name}"`);
  };

  const handleDeleteVersionConfirm = () => {
    if (!deletingVersion) return;

    if (deletingVersion.isLocked && userRole !== "Coach") {
      showNotification("⚠️ Unauthorized: Locked presets can only be purged by Coach authorizations.");
      setDeletingVersion(null);
      return;
    }

    setVersions(prev => prev.filter(v => v.id !== deletingVersion.id));

    if (selectedVersionId === deletingVersion.id) {
      const remaining = versions.filter(v => v.id !== deletingVersion.id);
      if (remaining.length > 0) {
        setMarkers(remaining[0].markers);
        setRoutes(remaining[0].routes);
        setSelectedVersionId(remaining[0].id);
      } else {
        setMarkers([]);
        setRoutes([]);
        setSelectedVersionId("");
      }
    }

    showNotification(`🗑️ Strategy preset "${deletingVersion.name}" purged permanently.`);
    setDeletingVersion(null);
  };

  // Toggle Lock status on a version profile
  const handleToggleVersionLock = (vId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (userRole !== "Coach") {
      showNotification("⚠️ Only Lead coaches hold version override access.");
      return;
    }
    setVersions(prev =>
      prev.map(v => (v.id === vId ? { ...v, isLocked: !v.isLocked } : v))
    );
    showNotification("🔒 Version lock status toggled.");
  };

  // Simulated Voice Recording Action
  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setVoiceSimulated(true);
      showNotification("🎙️ Audio wave parsed: Voice annotation attached successfully!");
    } else {
      setIsRecordingVoice(true);
      setVoiceSimulated(false);
    }
  };

  // Simulated Screenshot attachment selector click
  const simulateScreenshot = () => {
    const urls = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&q=80&w=300"
    ];
    const picked = urls[Math.floor(Math.random() * urls.length)];
    setScreenshotSimulated(picked);
    showNotification("📸 Mock Scrim verification screenshot integrated.");
  };

  // Filter versions relative to category filters
  const filteredVersions = versions.filter(
    v => activeCategory === "all" || v.category === activeCategory
  );

  return (
    <div
      id="interactive-maps-root"
      className={`${
        isTheatreMode
          ? "fixed inset-0 z-[100] m-0 rounded-none bg-[#07080a] p-8 overflow-y-auto flex flex-col h-screen overflow-x-hidden"
          : "bg-[#0b0c0e] rounded-3xl border border-zinc-800 p-6 space-y-6 relative overflow-hidden"
      } text-white text-left font-chakra`}
    >
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[110px] pointer-events-none" />

      {/* HEADER CONTROLS BANNER */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-red-950/50 border border-red-500/20 text-red-500 rounded-lg">
              <Map size={18} />
            </span>
            <div className="text-left">
              <h1 className="text-sm font-black font-mono tracking-widest text-red-500 uppercase flex items-center gap-1.5 leading-none">
                INTERACTIVE STRATEGY MAP MODULE
                <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black tracking-normal uppercase leading-none">PRO-TACTICS</span>
              </h1>
              <p className="text-[10px] text-zinc-450 font-mono mt-1">
                Configure precise rotation nodes on high-fidelity multi-game deployment frames.
              </p>
            </div>
          </div>
        </div>

        {/* Access Role & Simulation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* SIMULATED ROLE SWITCHER */}
          <div className="flex items-center gap-1.5 bg-[#14161b] p-1 rounded-xl border border-zinc-800">
            <span className="text-[8px] text-zinc-500 font-mono font-bold px-2 select-none uppercase">SIMULATED ROLE:</span>
            {["Coach", "Leader", "Analyst", "Recruit"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setUserRole(role as any);
                  showNotification(`👤 Switched active workspace to simulated [${role}] role permissions.`);
                }}
                className={`px-3 py-1 text-[8px] font-black tracking-wider rounded-lg transition-colors cursor-pointer ${
                  userRole === role
                    ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                    : "text-zinc-450 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>

          {/* LIVE COLLAB SWITCHER */}
          <button
            type="button"
            onClick={() => {
              setIsLiveCollabActive(!isLiveCollabActive);
              showNotification(
                isLiveCollabActive
                  ? "📡 Live connection paused. Offline sandbox mode active."
                  : "📡 Collaboration sockets initialized! Active telemetry indicators online."
              );
            }}
            className={`px-3 py-1.5 rounded-lg border text-[9px] font-black tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
              isLiveCollabActive
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-500"
            }`}
          >
            <Users size={11} className={isLiveCollabActive ? "animate-pulse" : ""} />
            <span>{isLiveCollabActive ? "COLLAB ACTIVE" : "GO MULTIPLAYER"}</span>
          </button>
        </div>
      </div>

      {/* QUICK NOTIFICATION CENTER */}
      {statusAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/95 border border-red-500/30 text-amber-200 p-2.5 px-4 rounded-xl text-center font-mono text-[10px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-2xl shrink-0"
        >
          <Sparkles size={11} className="text-red-500 animate-spin" />
          <span>{statusAlert}</span>
        </motion.div>
      )}

      {/* TACTICAL STRATEGY SEARCH & LOAD CONTROLLER */}
      <div className="bg-[#101216] p-4 rounded-2xl border border-zinc-850 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-red-600/10 text-red-500 rounded-lg border border-red-500/20">
              <Search size={16} />
            </span>
            <div>
              <h3 className="text-xs font-black tracking-widest font-mono text-white uppercase flex items-center gap-1.5">
                🔍 Strategy Directory Search
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Search & load pre-configured tactical maps from the team vault.
              </p>
            </div>
          </div>
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500">
              <Search size={13} />
            </div>
            <input
              type="text"
              value={stratSearchQuery}
              onChange={(e) => setStratSearchQuery(e.target.value)}
              placeholder="Search strategy by title, author, map, notes..."
              className="w-full bg-black/60 border border-zinc-800 focus:border-red-650 rounded-xl py-1.5 pl-9 pr-16 text-[11px] text-white focus:outline-none font-mono placeholder-zinc-600 transition-all"
            />
            {stratSearchQuery && (
              <button
                type="button"
                onClick={() => setStratSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white text-[9px] uppercase font-mono font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS CONTAINER */}
        <div className="border-t border-zinc-800/50 pt-3 mt-2">
          {filteredStratMaps.length === 0 ? (
            <div className="text-center py-4 text-zinc-500 text-[10px] font-mono uppercase">
              ⚠️ No matching tactical strategy maps found in the team vault directory.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredStratMaps.map((strat) => (
                <div
                  key={strat.id}
                  className="bg-black/40 border border-zinc-850 rounded-xl p-2.5 hover:border-red-500/30 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="text-[10px] font-black text-white leading-tight font-mono tracking-wide">
                        {strat.title}
                      </span>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-black tracking-normal leading-none bg-red-950/40 text-red-400 border border-red-900/30 shrink-0">
                        {strat.mapName}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-400 line-clamp-2 mt-1 leading-normal font-sans">
                      {strat.notes}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-900/60 pt-2 text-[8.5px]">
                    <span className="text-zinc-500 font-mono">
                      By: <span className="text-amber-500 font-bold">{strat.author}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLoadStrategyMap(strat)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-mono font-black tracking-wider uppercase text-[8px] cursor-pointer shadow-lg shadow-red-950/20 hover:scale-[1.02] transition-all"
                    >
                      📂 LOAD STRATEGY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE LOADED STRATEGY BRIEFING CARD */}
      {loadedStrategy && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-950/10 border border-red-500/30 p-3.5 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4 text-left shadow-[0_0_15px_rgba(239,68,68,0.05)]"
        >
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-600 text-white leading-none font-mono">
                ACTIVE BRIEFING LOADED
              </span>
              <h4 className="text-xs font-black tracking-wide text-zinc-100 font-mono uppercase">
                {loadedStrategy.title}
              </h4>
            </div>
            <p className="text-[10px] text-zinc-350 leading-relaxed font-sans">
              <span className="text-amber-500 font-mono font-bold uppercase mr-1">Tactical Orders:</span> {loadedStrategy.notes}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8.5px] text-zinc-500 font-mono uppercase pt-1">
              <span>Coach/Author: <strong className="text-zinc-350">{loadedStrategy.author}</strong></span>
              <span>Primary Grid: <strong className="text-zinc-350">{loadedStrategy.mapName}</strong></span>
              <span>Overlay Markers: <strong className="text-zinc-350">{loadedStrategy.pins.length} active</strong></span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoadedStrategy(null);
              showNotification("🔓 Active briefing dismissed. Canvas unlocked.");
            }}
            className="text-[8.5px] text-zinc-450 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg font-mono font-black uppercase cursor-pointer shrink-0 transition-all bg-black/45"
          >
            DISMISS BRIEFING
          </button>
        </motion.div>
      )}

      {/* MAPS DISCOVERY & FILTER TABS (Official Map Selection) */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-1.5 bg-[#101216] p-1.5 rounded-2xl border border-zinc-850">
        {PUBG_MAPS.map((m) => {
          const isSelected = selectedMap.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMap(m);
                handleResetView();
                showNotification(`🗺️ Map switched to official ${m.name} [${m.type}] grid metrics.`);
              }}
              className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                isSelected
                  ? "bg-gradient-to-br from-red-950/40 to-black border-red-500/50 shadow-lg shadow-red-950/20"
                  : "bg-black/40 border-zinc-950 hover:bg-[#15181e] hover:border-zinc-800/70"
              }`}
            >
              <span className="text-[10px] font-black block tracking-wider leading-none text-zinc-200">
                {m.name.toUpperCase()}
              </span>
              <span className="text-[7.5px] text-zinc-500 font-mono uppercase block mt-1">
                {m.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1: LAYERS & DRAWING CONTROL PALETTE (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* TOOLBOX ANNOTATIONS HEADER */}
          <div className="bg-[#121419] p-4 rounded-2xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-450 uppercase border-b border-zinc-800 pb-2">
              🛠️ TACTICAL MARKER PALETTE
            </h3>

            {/* Instruction block */}
            <p className="text-[9px] text-zinc-500 font-sans leading-normal leading-relaxed">
              Activate an operational tool icon below, then click onto the coordinates map container to overlay specific locations.
            </p>

            {/* Actions palette */}
            <div className="space-y-3">
              {[
                {
                  category: "Aggressive",
                  desc: "Assault & offensive actions",
                  accentClass: "border-red-950/40 bg-red-950/5",
                  textColor: "text-red-400",
                  items: [
                    { tool: "aggressive", label: "Aggressive Assault", icon: Flame, color: "text-red-500 border-red-500/20 bg-red-950/10", defaultColor: "#ef4444" },
                    { tool: "sniper", label: "Sniper Sightline", icon: Eye, color: "text-purple-500 border-purple-500/20 bg-purple-950/10", defaultColor: "#a855f7" },
                    { tool: "danger", label: "Danger / Ambush", icon: AlertTriangle, color: "text-amber-500 border-amber-500/20 bg-amber-950/10", defaultColor: "#f59e0b" },
                  ]
                },
                {
                  category: "Defensive",
                  desc: "Holding lines & safety coordinates",
                  accentClass: "border-blue-950/40 bg-blue-950/5",
                  textColor: "text-blue-400",
                  items: [
                    { tool: "defensive", label: "Defensive Hold", icon: Shield, color: "text-blue-400 border-blue-500/20 bg-blue-950/10", defaultColor: "#3b82f6" },
                    { tool: "drop", label: "Drop Hotspot", icon: MapPin, color: "text-rose-500 border-rose-500/20 bg-rose-950/10", defaultColor: "#f43f5e" },
                    { tool: "loot", label: "High Loot Zone", icon: FolderOpen, color: "text-yellow-500 border-yellow-500/20 bg-yellow-950/10", defaultColor: "#eab308" },
                  ]
                },
                {
                  category: "Rotation",
                  desc: "Mobility & map rotation pathing",
                  accentClass: "border-emerald-950/40 bg-emerald-950/5",
                  textColor: "text-emerald-400",
                  items: [
                    { tool: "rotation", label: "Rotation Waypoint", icon: Play, color: "text-emerald-500 border-emerald-500/20 bg-emerald-950/10", defaultColor: "#10b981" },
                    { tool: "vehicle", label: "Vehicle Carrier", icon: TrendingUp, color: "text-cyan-500 border-cyan-500/20 bg-cyan-950/10", defaultColor: "#06b6d4" },
                  ]
                },
                {
                  category: "Utilities",
                  desc: "Connections & measurements",
                  accentClass: "border-zinc-900/40 bg-zinc-900/5",
                  textColor: "text-zinc-400",
                  items: [
                    { tool: "path", label: "Rotation Connector", icon: RefreshCw, color: "text-pink-500 border-pink-500/20 bg-pink-955/10", defaultColor: "#ec4899" },
                    { tool: "measurement", label: "Measure Lines (km)", icon: Maximize2, color: "text-teal-500 border-teal-500/20 bg-teal-950/10", defaultColor: "#14b8a6" }
                  ]
                }
              ].map((cat) => (
                <div key={cat.category} className={`p-2 rounded-xl border ${cat.accentClass} space-y-1.5`}>
                  <div className="flex items-center justify-between px-0.5">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest ${cat.textColor}`}>
                      {cat.category}
                    </span>
                    <span className="text-[7.5px] text-zinc-500 font-mono">{cat.desc}</span>
                  </div>
                  <div className="space-y-1">
                    {cat.items.map((item) => {
                      const isCurrent = activeTool === item.tool;
                      return (
                        <button
                          key={item.tool}
                          type="button"
                          onClick={() => {
                            if (activeTool === item.tool) {
                              setActiveTool(null);
                              setPathSourceId(null);
                            } else {
                              setActiveTool(item.tool as any);
                              setPathSourceId(null);
                              setMeasurementPoints([]);
                              if (item.defaultColor) {
                                setMarkerColor(item.defaultColor);
                              }
                              showNotification(`🛠️ Tool [${item.label}] loaded! Click on the central map grid context.`);
                            }
                          }}
                          className={`w-full p-1.5 rounded-lg border text-[9px] font-black transition-all flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? "bg-red-600 text-white border-red-500 scale-[1.01]"
                              : `bg-zinc-950 hover:bg-[#1a1c22] ${item.color} border-zinc-900/60`
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <item.icon size={11} className={isCurrent ? "text-white" : ""} />
                            <span>{item.label}</span>
                          </div>
                          {isCurrent && <span className="text-[6.5px] bg-white text-black px-1 rounded font-black tracking-normal leading-none uppercase">ACTIVE</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Clear button */}
            {markers.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  pushHistory(markers, routes);
                  setMarkers([]);
                  setRoutes([]);
                  setMeasurementPoints([]);
                  showNotification("🧹 Active markers successfully swept & cleared!");
                }}
                className="w-full py-2 border border-zinc-805 bg-black hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all"
              >
                Clear Map Items
              </button>
            )}
          </div>

          {/* ACTIVE TACTICAL PINS - DRAG & DROP REORDERING PANEL */}
          <div className="bg-[#121419] p-4 rounded-2xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-450 uppercase border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span>Tactical Pins Sequence</span>
              <span className="text-[9px] font-mono text-red-500 font-extrabold bg-red-955/15 px-1.5 py-0.5 rounded border border-red-900/10">
                {markers.length} ON MAP
              </span>
            </h3>

            <p className="text-[9px] text-zinc-500 font-sans leading-normal">
              Drag & drop pins below to customize rotation priorities. Click any item to focalize and inspect.
            </p>

            {markers.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-zinc-850 rounded-xl bg-black/20 text-zinc-550 text-[9.5px] font-sans select-none">
                No active tactical pins.
                <span className="block mt-1 text-[8.5px] text-zinc-650">Select a tool and click map to drop landmarks.</span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                {markers.map((pin, idx) => {
                  const isSelected = selectedMarkerForComment?.id === pin.id;
                  const iconEmoji = 
                    pin.type === "aggressive" || pin.type === "attack" ? "⚔️" :
                    pin.type === "defensive" || pin.type === "defense" ? "🛡️" :
                    pin.type === "rotation" ? "🔄" :
                    pin.type === "drop" ? "📦" :
                    pin.type === "danger" ? "💥" :
                    pin.type === "sniper" ? "👁️" :
                    pin.type === "vehicle" ? "🚗" : "📍";
                  
                  return (
                    <div
                      key={pin.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-grab active:cursor-grabbing group select-none ${
                        draggedIndex === idx
                          ? "bg-red-955/10 border-red-500/50 opacity-40 scale-[0.98]"
                          : isSelected
                            ? "bg-red-955/5 border-red-500/30"
                            : "bg-black/40 border-zinc-950 hover:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {/* Drag Handle Icon */}
                        <div className="text-zinc-650 hover:text-zinc-400 p-0.5 cursor-grab">
                          <GripVertical size={11} />
                        </div>

                        {/* Priority Index Badge */}
                        <span className="text-[8.5px] font-mono font-black bg-zinc-900 text-zinc-400 px-1 py-0.5 rounded border border-zinc-800">
                          #{idx + 1}
                        </span>

                        {/* Visual type identifier */}
                        <span className="text-xs leading-none shrink-0" style={{ textShadow: `0 0 5px ${pin.color}50` }}>
                          {iconEmoji}
                        </span>

                        {/* Details */}
                        <div 
                          className="text-left min-w-0 cursor-pointer"
                          onClick={() => {
                            setSelectedMarkerForComment(pin);
                            showNotification(`🎯 Selected pin: ${pin.label}`);
                          }}
                        >
                          <p className="text-[10px] font-bold text-white truncate leading-none mb-0.5 group-hover:text-red-400 transition-colors">
                            {pin.label}
                          </p>
                          <p className="text-[7.5px] text-zinc-500 font-mono leading-none">
                            X: {pin.x}% • Y: {pin.y}%
                          </p>
                        </div>
                      </div>

                      {/* Right side delete action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMarker(pin.id, e);
                        }}
                        className="p-1 rounded hover:bg-red-955/20 text-zinc-605 hover:text-red-400 border border-transparent hover:border-red-900/30 cursor-pointer transition-all shrink-0 opacity-40 group-hover:opacity-100"
                        title="Remove callout"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* VISIBILITY LAYER TOGGLES */}
          <div className="bg-[#121419] p-4 rounded-2xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-450 uppercase border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span>Layers Visibility</span>
              <Layers size={12} className="text-zinc-650" />
            </h3>

            <div className="grid grid-cols-2 gap-2 text-[9px]">
              {[
                { id: "grid", label: "Grid Lines" },
                { id: "heatmap", label: "Glow Heatmap" },
                { id: "dropZones", label: "Drop Indicators" },
                { id: "dangerZones", label: "Danger Areas" },
                { id: "lootRoutes", label: "Loot Enclaves" },
                { id: "vehicleSpawns", label: "Vehicles Layer" },
                { id: "sniperPositions", label: "Sniper Overlooks" },
                { id: "comments", label: "Comments Layer" }
              ].map((lay) => {
                const val = (layers as any)[lay.id];
                return (
                  <button
                    key={lay.id}
                    type="button"
                    onClick={() => {
                      setLayers(l => ({ ...l, [lay.id]: !val }));
                    }}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      val
                        ? "bg-[#181a20] border-red-500/20 text-red-400 font-extrabold"
                        : "bg-black/60 border-zinc-950 text-zinc-600 font-medium"
                    }`}
                  >
                    {lay.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BLUEPRINT IMPORT / EXPORT OPERATIONS */}
          <div className="bg-[#121419] p-4 rounded-2xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-450 uppercase border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span>Blueprint Management</span>
              <Share2 size={12} className="text-red-500" />
            </h3>

            <p className="text-[9px] text-zinc-500 font-sans leading-normal leading-relaxed">
              Share tactical layouts with team mates or export a high-fidelity image for offline match briefings.
            </p>

            <div className="space-y-2">
              {/* High-Res PNG Button */}
              <button
                type="button"
                onClick={exportBlueprintPNG}
                disabled={markers.length === 0}
                className={`w-full py-2.5 px-3 rounded-xl border text-[9.5px] font-black transition-all flex items-center justify-between cursor-pointer ${
                  markers.length > 0
                    ? "bg-gradient-to-r from-red-950/20 to-zinc-950 border-red-500/30 text-stone-200 hover:text-white hover:border-red-500 hover:scale-[1.01]"
                    : "bg-zinc-950/50 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50"
                }`}
                title="Download high-resolution PNG snapshot with coordinates HUD"
              >
                <div className="flex items-center gap-2">
                  <Camera size={11} className={markers.length > 0 ? "text-red-500 animate-pulse" : ""} />
                  <span>Export High-Res PNG</span>
                </div>
                <span className="text-[8px] font-mono bg-zinc-900 px-1 py-0.5 rounded text-zinc-400">1200px</span>
              </button>

              {/* JSON Export Button */}
              <button
                type="button"
                onClick={exportBlueprintJSON}
                disabled={markers.length === 0}
                className={`w-full py-2.5 px-3 rounded-xl border text-[9.5px] font-black transition-all flex items-center justify-between cursor-pointer ${
                  markers.length > 0
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-950 border-zinc-800 text-stone-200 hover:text-white hover:border-zinc-700 hover:scale-[1.01]"
                    : "bg-zinc-950/50 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50"
                }`}
                title="Download customizable JSON coordinates config"
              >
                <div className="flex items-center gap-2">
                  <FileJson size={11} className={markers.length > 0 ? "text-amber-500" : ""} />
                  <span>Export Blueprint JSON</span>
                </div>
                <span className="text-[8px] font-mono bg-zinc-900 px-1 py-0.5 rounded text-zinc-400">CONFIG</span>
              </button>

              {/* Blueprint JSON Import Button (Styled Input) */}
              <label
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-black/30 hover:bg-[#15171d] text-zinc-400 hover:text-stone-200 text-[9.5px] font-black transition-all flex items-center justify-between cursor-pointer"
                title="Import layout from previously exported TACTICAL_BLUEPRINT JSON file"
              >
                <div className="flex items-center gap-2">
                  <Download size={11} className="text-emerald-500" />
                  <span>Import Blueprint JSON</span>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <span className="text-[8px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">LOAD</span>
              </label>
            </div>
          </div>
        </div>

        {/* COLUMN 2: PRIMARY INTERACTIVE MAP CANVAS (xl:col-span-6) */}
        <div className="xl:col-span-6 space-y-4">
          
          {/* MAP CANVAS CONTAINER */}
          <div className="bg-[#121419] p-3 rounded-2xl border border-zinc-800 space-y-3">
            
            {/* CANVAS HEADS-UP */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono border-b border-zinc-800 pb-2 mb-1">
              
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-zinc-400 font-black tracking-wider uppercase">
                  {selectedMap.name} Tactics Platform Map
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-550 lowercase italic">{selectedMap.type}</span>
              </div>

              {/* Interaction Guide Context */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="toggle-theatre-mode-btn"
                  onClick={() => {
                    setIsTheatreMode(prev => !prev);
                    showNotification(isTheatreMode ? "📺 Exited Full View mode." : "📺 Entered immersive Full View theatre mode.");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold font-mono uppercase rounded border transition-all cursor-pointer ${
                    isTheatreMode
                      ? "bg-red-955/40 text-red-500 border-red-500/40 hover:bg-zinc-900"
                      : "bg-black/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                  }`}
                  title={isTheatreMode ? "Exit Full View" : "View Map in Full"}
                >
                  {isTheatreMode ? (
                    <>
                      <Minimize2 size={9} className="text-red-500 animate-pulse" />
                      <span>Standard View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 size={9} />
                      <span>Full View</span>
                    </>
                  )}
                </button>

                {/* Undo / Redo Control Stack */}
                <div className="flex items-center bg-black/50 p-0.5 rounded border border-zinc-850">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={past.length === 0}
                    className="px-2 py-1 hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent text-zinc-400 hover:text-white disabled:text-zinc-600 rounded text-[9px] font-bold font-mono uppercase cursor-pointer flex items-center gap-1.5 transition-all duration-150 active:scale-95"
                    title="Undo last pin action (Ctrl+Z)"
                  >
                    <Undo2 size={10} />
                    <span>Undo</span>
                  </button>
                  <div className="w-[1px] h-3 bg-zinc-850 mx-0.5" />
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={future.length === 0}
                    className="px-2 py-1 hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent text-zinc-400 hover:text-white disabled:text-zinc-600 rounded text-[9px] font-bold font-mono uppercase cursor-pointer flex items-center gap-1.5 transition-all duration-150 active:scale-95"
                    title="Redo last reverted action (Ctrl+Y)"
                  >
                    <span>Redo</span>
                    <Redo2 size={10} />
                  </button>
                </div>

                {/* Snap to Grid Toggle Button */}
                <button
                  type="button"
                  id="toggle-snap-grid-btn"
                  onClick={() => {
                    const nextVal = !snapToGrid;
                    setSnapToGrid(nextVal);
                    // Automatically turn on visual grid layer if they enable snapping, to help them align visually!
                    if (nextVal) {
                      setLayers(l => ({ ...l, grid: true }));
                      showNotification("⚡ SNAP TO GRID ACTIVE: Tactical pins will automatically align to nearest strategic high-grounds, choke points, or grid intersection lines.");
                    } else {
                      showNotification("⚠️ Snap to Grid disabled.");
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold font-mono uppercase rounded border transition-all cursor-pointer ${
                    snapToGrid
                      ? "bg-red-950/40 text-red-400 border-red-500/40 hover:bg-red-950/60"
                      : "bg-black/50 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white"
                  }`}
                  title="Snap tactical pins automatically to grid intersections or high-ground zones / choke points"
                >
                  <Grid size={10} className={snapToGrid ? "animate-pulse text-red-500" : ""} />
                  <span>Snap {snapToGrid ? "ON" : "OFF"}</span>
                </button>

                <div className="flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-zinc-850">
                  <span className="text-zinc-650">ZOOM:</span>
                  <span className="text-red-500 font-black">{Math.round(mapZoom * 100)}%</span>
                </div>
                <div className="flex bg-black/50 p-0.5 rounded border border-zinc-850">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="px-1.5 py-0.5 hover:bg-zinc-800 hover:text-white rounded-md text-[9px] cursor-pointer"
                  >
                    ➖
                  </button>
                  <button
                    type="button"
                    onClick={handleResetView}
                    className="px-1.5 py-0.5 hover:bg-zinc-800 hover:text-white rounded-md text-[9px] text-zinc-500 font-bold uppercase cursor-pointer"
                  >
                    Reset Zoom
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="px-1.5 py-0.5 hover:bg-zinc-800 hover:text-white rounded-md text-[9px] cursor-pointer"
                  >
                    ➕
                  </button>
                </div>
              </div>
            </div>

            {/* THE ACTUAL INTERACTIVE GRAPH STAGE FRAME */}
            <div
              id="map-container"
              className={`bg-black/90 rounded-xl border border-zinc-900 overflow-hidden relative select-none transition-all ${
                isTheatreMode ? "h-[650px] md:h-[68vh]" : "h-[410px]"
              } ${
                activeTool ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
              }`}
              onClick={handleMapClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ touchAction: "none" }}
            >
              {/* Reset Map View Button inside selector #map-container */}
              <button
                type="button"
                id="reset-map-view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMapZoom(1.0);
                  setMapPan({ x: 0, y: 0 });
                  showNotification("🔄 Map view restored to default zoom and pan!");
                }}
                className="absolute top-4 right-4 z-40 bg-black/85 hover:bg-zinc-900 text-stone-200 hover:text-white border border-zinc-800 hover:border-red-500/50 px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-black/50 transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw size={10} className="text-red-500" />
                <span>Reset View</span>
              </button>

              {/* Live Coordinate Tooltip during Dragging/Panning */}
              {isPanning && liveCoords && (
                <div
                  className="absolute z-50 pointer-events-none bg-black/95 text-white border border-red-500/50 rounded px-2.5 py-1.5 font-mono text-[9px] shadow-xl flex flex-col gap-1 tracking-wider"
                  style={{
                    left: `${Math.min(isTheatreMode ? 900 : 300, Math.max(10, tooltipPos.x + 15))}px`,
                    top: `${Math.min(isTheatreMode ? 600 : 360, Math.max(10, tooltipPos.y + 15))}px`,
                  }}
                >
                  <div className="flex items-center gap-1.5 border-b border-zinc-850 pb-1 mb-0.5 text-[8px] font-black text-red-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    <span>Tactical Grid</span>
                  </div>
                  <div className="flex gap-3 text-stone-200">
                    <span>X: <strong className="text-white">{liveCoords.x.toFixed(1)}%</strong></span>
                    <span>Y: <strong className="text-white">{liveCoords.y.toFixed(1)}%</strong></span>
                  </div>
                </div>
              )}
              
              {/* STRETCH PHYSICAL MAP CONTAINER */}
              <div
                className="w-full h-full relative origin-center transition-transform duration-100 ease-out"
                style={{
                  backgroundImage: `url('${selectedMap.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`,
                }}
              >
                {/* DARK SEMANTIC GRID LAYER overlay */}
                <div className="absolute inset-0 bg-black/35 hover:bg-black/15 pointer-events-none transition-colors" />

                {/* THE GRID SYSTEM LAYERS (8x8 grid: A-H & 1-8 coordinates) */}
                {layers.grid && (
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-zinc-800/10 pointer-events-none text-zinc-500 text-[6px] font-mono select-none">
                    {Array.from({ length: 64 }).map((_, idx) => {
                      const col = idx % 8;
                      const row = Math.floor(idx / 8);
                      const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
                      return (
                        <div
                          key={idx}
                          className="border border-zinc-700/15 relative flex items-start justify-start p-0.5"
                        >
                          <span className="opacity-40">{`${labels[col]}${row + 1}`}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STRATEGIC SNAPPING LANDMARKS / ZONES OVERLAY */}
                {snapToGrid && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {(STRATEGIC_ZONES[selectedMap.id] || []).map((zone, idx) => (
                      <div
                        key={`zone-${idx}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-none"
                        style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                      >
                        <span className={`absolute inline-flex h-3 w-3 rounded-full animate-ping opacity-60 ${
                          zone.type === "choke"
                            ? "bg-red-500/40"
                            : zone.type === "highground"
                              ? "bg-sky-500/40"
                              : "bg-emerald-500/40"
                        }`} />
                        <div className={`w-2 h-2 rounded-full border ${
                          zone.type === "choke"
                            ? "bg-red-600 border-red-400"
                            : zone.type === "highground"
                              ? "bg-sky-600 border-sky-400"
                              : "bg-emerald-600 border-emerald-400"
                        } shadow-[0_0_6px_rgba(239,68,68,0.35)]`} />
                        <div className="bg-black/90 text-[6px] text-zinc-300 font-mono scale-[0.8] mt-1 px-1 py-0.5 rounded border border-zinc-850/80 whitespace-nowrap opacity-80 shadow-lg">
                          <span className={
                            zone.type === "choke"
                              ? "text-red-400"
                              : zone.type === "highground"
                                ? "text-sky-400"
                                : "text-emerald-400"
                          }>
                            {zone.type === "choke" ? "⚠️ CHOKE" : zone.type === "highground" ? "🏔️ HIGH" : "🏢 COMPOUND"}
                          </span>
                          <span className="mx-0.5 text-zinc-600">|</span>
                          <span>{zone.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* VISUAL SCRIM HEATMAP GLOW LAYERS - COMMON ENGAGEMENT SCARS */}
                {layers.heatmap && (
                  <div className="absolute inset-0 pointer-events-none z-10 select-none">
                    {/* Glowing hotspots spots centered on Erangel major cities */}
                    <div className="absolute top-[48%] left-[45%] w-24 h-24 bg-red-600/30 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute top-[35%] left-[55%] w-16 h-16 bg-red-500/25 rounded-full blur-xl" />
                    <div className="absolute top-[68%] left-[50%] w-20 h-20 bg-amber-500/25 rounded-full blur-xl animate-pulse" />
                    <div className="absolute top-[28%] left-[30%] w-14 h-14 bg-red-600/20 rounded-full blur-xl" />
                    <div className="absolute bottom-[20%] left-[80%] w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl font-mono text-[7px] text-emerald-400 font-extrabold flex items-center justify-center">
                      <span className="rotate-12 uppercase tracking-wide bg-black/60 px-1 py-0.5 border border-emerald-500/10 rounded">Safe looting delta</span>
                    </div>
                  </div>
                )}

                {/* LINES ROTATION CONNECTOR PATHS */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ec4899" />
                    </marker>
                    <marker id="playback-arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                    </marker>
                  </defs>

                  {/* Draw link chains */}
                  {routes.map((route, rIndex) => {
                    const fromPin = markers.find(m => m.id === route.fromId);
                    const toPin = markers.find(m => m.id === route.toId);
                    if (!fromPin || !toPin) return null;
                    
                    return (
                      <g key={rIndex}>
                        <line
                          x1={`${fromPin.x}%`}
                          y1={`${fromPin.y}%`}
                          x2={`${toPin.x}%`}
                          y2={`${toPin.y}%`}
                          stroke="#ec4899"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                          className="opacity-75"
                          markerEnd="url(#arrow)"
                        />
                        <circle
                          cx={`${(fromPin.x + toPin.x) / 2}%`}
                          cy={`${(fromPin.y + toPin.y) / 2}%`}
                          r="5.5"
                          fill="#ec4899"
                          className="opacity-80 animate-ping"
                        />
                      </g>
                    );
                  })}

                  {/* PLAYBACK ACTIVATION TRACK PATHING OVERLAY - step focus marker */}
                  {isPlaybackActive && markers.length > 1 && (
                    <g>
                      {/* Line to current tick */}
                      {(() => {
                        const nextIndex = Math.min(markers.length - 1, playbackTick + 1);
                        const currPin = markers[playbackTick];
                        const nextPin = markers[nextIndex];
                        if (currPin.id !== nextPin.id) {
                          return (
                            <line
                              x1={`${currPin.x}%`}
                              y1={`${currPin.y}%`}
                              x2={`${nextPin.x}%`}
                              y2={`${nextPin.y}%`}
                              stroke="#ff0021"
                              strokeWidth="4"
                              markerEnd="url(#playback-arrow)"
                              className="animate-pulse"
                            />
                          );
                        }
                        return null;
                      })()}
                    </g>
                  )}

                  {/* Draw measurement path */}
                  {activeTool === "measurement" && measurementPoints.map((pt, k) => {
                    if (k === 0 && measurementPoints.length === 2) {
                      const endPt = measurementPoints[1];
                      return (
                        <line
                          key={k}
                          x1={`${pt.x}%`}
                          y1={`${pt.y}%`}
                          x2={`${endPt.x}%`}
                          y2={`${endPt.y}%`}
                          stroke="#14f7ff"
                          strokeWidth="2"
                        />
                      );
                    }
                    return null;
                  })}
                </svg>

                {/* MEASUREMENT POINTER DOTS */}
                {activeTool === "measurement" && measurementPoints.map((pt, index) => (
                  <div
                    key={index}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 border border-white rounded-full z-20"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  />
                ))}

                {/* COLLABORATIVE ACTIVE PLAYERS CURSOR POINTERS MOCKED */}
                {isLiveCollabActive && collabCursors.map((cursor) => (
                  <div
                    key={cursor.id}
                    className="absolute -translate-x-1 translate-y-1 z-35 flex flex-col items-center pointer-events-none transition-all duration-1000 select-none cursor-none"
                    style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
                  >
                    {/* Tiny custom cursors */}
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      <span className="text-[10px]">↖️</span>
                    </div>
                    <div className="bg-black/90 p-1 rounded font-mono text-[6px] text-zinc-100 whitespace-nowrap border border-zinc-700 leading-none">
                      👤 {cursor.name} <span className="text-red-400 italic">({cursor.activeMarkerLabel})</span>
                    </div>
                  </div>
                ))}

                {/* MAP NODES / ANNOTATIONS PINS */}
                {(() => {
                  // A. Filter visible markers based on layer states
                  const visibleMarkers = markers.filter((pin) => {
                    if (pin.type === "drop" && !layers.dropZones) return false;
                    if (pin.type === "danger" && !layers.dangerZones) return false;
                    if (pin.type === "loot" && !layers.lootRoutes) return false;
                    if (pin.type === "vehicle" && !layers.vehicleSpawns) return false;
                    if (pin.type === "sniper" && !layers.sniperPositions) return false;
                    return true;
                  });

                  // B. Calculate clusters dynamically based on current map zoom
                  // When map is zoomed out (e.g., zoom is < 1.8), pins merge if they are close.
                  // We decrease the clustering threshold as the user zooms in so they disperse.
                  const isZoomedOut = mapZoom < 1.8;
                  const clusterRadius = isZoomedOut ? 8.0 : 0; // percentage-based clustering radius
                  
                  interface Cluster {
                    id: string;
                    isCluster: boolean;
                    center: { x: number; y: number };
                    markers: MapMarker[];
                  }

                  const calculatedClusters: Cluster[] = [];
                  const groupedIds = new Set<string>();

                  visibleMarkers.forEach((marker) => {
                    if (groupedIds.has(marker.id)) return;

                    // Find unvisited visible markers in range
                    const group: MapMarker[] = [marker];
                    groupedIds.add(marker.id);

                    if (clusterRadius > 0) {
                      visibleMarkers.forEach((other) => {
                        if (groupedIds.has(other.id)) return;
                        const dx = marker.x - other.x;
                        const dy = marker.y - other.y;
                        const distance = Math.hypot(dx, dy);
                        if (distance < clusterRadius) {
                          group.push(other);
                          groupedIds.add(other.id);
                        }
                      });
                    }

                    if (group.length > 1) {
                      const avgX = group.reduce((sum, item) => sum + item.x, 0) / group.length;
                      const avgY = group.reduce((sum, item) => sum + item.y, 0) / group.length;
                      calculatedClusters.push({
                        id: `cluster-${marker.id}`,
                        isCluster: true,
                        center: { x: avgX, y: avgY },
                        markers: group,
                      });
                    } else {
                      calculatedClusters.push({
                        id: marker.id,
                        isCluster: false,
                        center: { x: marker.x, y: marker.y },
                        markers: [marker],
                      });
                    }
                  });

                  // Render each item (cluster or single marker)
                  return calculatedClusters.map((cluster) => {
                    if (cluster.isCluster) {
                      const isExpanded = expandedClusterId === cluster.id;
                      return (
                        <div
                          key={cluster.id}
                          className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                          style={{ left: `${cluster.center.x}%`, top: `${cluster.center.y}%` }}
                        >
                          {/* CLUSTER INDICATOR */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              // Centering on cluster center & zoom in slightly to naturally expand/disperse
                              const nextZoom = Math.min(4.0, mapZoom + 0.5);
                              setMapZoom(nextZoom);
                              
                              // Translate towards cluster center in grid coordinates
                              setMapPan({
                                x: Math.max(-500, Math.min(500, (50 - cluster.center.x) * 4 * nextZoom)),
                                y: Math.max(-500, Math.min(500, (50 - cluster.center.y) * 4 * nextZoom)),
                              });
                              setExpandedClusterId(isExpanded ? null : cluster.id);
                              showNotification(`🎯 Centered viewport on cluster! Expanded directory of ${cluster.markers.length} zones.`);
                            }}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-950 text-white font-chakra text-[10px] font-black tracking-tighter border-2 border-red-500 shadow-xl shadow-red-950/50 flex flex-col items-center justify-center transition-all duration-300 hover:scale-115 cursor-pointer hover:border-white ring-4 ring-red-500/20 active:scale-95 animate-pulse"
                            title="Tactical Cluster Group"
                          >
                            <span>{cluster.markers.length}</span>
                            <span className="text-[6px] tracking-widest font-mono text-red-300 -mt-0.5">PINS</span>
                          </div>

                          {/* EXPANDED PIN LIST OVERLAY (EXPANDED ON CLICK) */}
                          {isExpanded && (
                            <div 
                              className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/95 rounded-xl border border-red-500/40 p-2.5 w-60 shadow-2xl z-50 text-left font-chakra space-y-2 max-h-56 overflow-y-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-[8px] font-black text-red-500 uppercase tracking-widest border-b border-zinc-850 pb-1 flex justify-between items-center select-none">
                                <span>📦 CLUSTER {cluster.markers.length} DIRECTORY</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedClusterId(null);
                                  }}
                                  className="text-[9px] text-zinc-550 hover:text-white cursor-pointer font-bold"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="space-y-1.5 pt-0.5">
                                {cluster.markers.map((pin) => {
                                  const isSelectedForComment = selectedMarkerForComment?.id === pin.id;
                                  return (
                                    <div
                                      key={pin.id}
                                      onClick={(e) => {
                                        setExpandedClusterId(null);
                                        handleMarkerClickToRoute(pin.id, e);
                                      }}
                                      className={`flex items-center justify-between p-1.5 rounded border text-[10px] font-mono select-none hover:bg-zinc-900 transition-colors cursor-pointer ${
                                        isSelectedForComment ? "bg-red-950/20 border-red-500/40" : "bg-zinc-950 border-zinc-900"
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate pr-2 w-[70%]">
                                        <div
                                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px]"
                                          style={{ backgroundColor: pin.color }}
                                        >
                                          {pin.type === "aggressive" || pin.type === "attack" ? "⚔️" :
                                           pin.type === "defensive" || pin.type === "defense" ? "🛡️" :
                                           pin.type === "rotation" ? "🔄" :
                                           pin.type === "drop" ? "📦" :
                                           pin.type === "danger" ? "💥" :
                                           pin.type === "sniper" ? "👁️" : "🚗"}
                                        </div>
                                        <span className="font-sans font-bold text-stone-200 truncate">{pin.label}</span>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {pin.comments.length > 0 && (
                                          <span className="text-[8px] text-red-400">💬{pin.comments.length}</span>
                                        )}
                                        {isAuthorized() && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteMarker(pin.id, e);
                                            }}
                                            className="text-zinc-500 hover:text-red-500 text-[9px] p-0.5 px-1 font-bold cursor-pointer"
                                            title="Delete Pin"
                                          >
                                            ✕
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Otherwise, render normal single pin
                    const pin = cluster.markers[0];
                    const isPlaybackFocus = isPlaybackActive && markers[playbackTick]?.id === pin.id;
                    const isSelectedForComment = selectedMarkerForComment?.id === pin.id;

                    return (
                      <div
                        key={pin.id}
                        onClick={(e) => handleMarkerClickToRoute(pin.id, e)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto z-20 cursor-pointer ${
                          pathSourceId === pin.id ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-black rounded-full" : ""
                        }`}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      >
                        {/* TACTICAL ORIENTATION FIELD-OF-VIEW CONE */}
                        {pin.rotation !== undefined && (
                          <div 
                            className="absolute pointer-events-none z-10"
                            style={{
                              width: '56px',
                              height: '56px',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <svg 
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                              style={{
                                transform: `rotate(${pin.rotation}deg)`,
                                transformOrigin: '50% 50%',
                              }}
                            >
                              {/* Dynamic semi-transparent color field-of-view cone */}
                              <path 
                                d="M 50 50 L 75 15 A 40 40 0 0 0 25 15 Z" 
                                fill={pin.color} 
                                fillOpacity="0.3" 
                                stroke={pin.color}
                                strokeWidth="1"
                                strokeOpacity="0.5"
                                strokeDasharray="2 2"
                              />
                              {/* Tactical direction pointer */}
                              <polygon 
                                points="50,5 45,15 55,15" 
                                fill={pin.color} 
                                opacity="0.9"
                              />
                            </svg>
                          </div>
                        )}

                        {/* PIN BODY STYLES */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white border-2 shadow-lg transition-all relative z-20 ${
                            isPlaybackFocus
                              ? "bg-red-500 scale-125 border-yellow-300 ring-4 ring-red-500/50 animate-bounce"
                              : isSelectedForComment
                                ? "scale-115 border-white ring-2 ring-zinc-100"
                                : "border-black hover:scale-110"
                          }`}
                          style={{ backgroundColor: pin.color }}
                        >
                          <span 
                            className="text-[9px] font-black tracking-tighter inline-block transition-transform duration-200"
                            style={{ transform: `rotate(${pin.rotation || 0}deg)` }}
                          >
                            {pin.type === "aggressive" || pin.type === "attack" ? "⚔️" :
                             pin.type === "defensive" || pin.type === "defense" ? "🛡️" :
                             pin.type === "rotation" ? "🔄" :
                             pin.type === "drop" ? "📦" :
                             pin.type === "danger" ? "💥" :
                             pin.type === "sniper" ? "👁️" : "🚗"}
                          </span>
                        </div>

                        {/* LABELS POPUP DESCRIPTOR */}
                        <div className="absolute left-7 top-0 bg-black/95 text-white text-[8px] font-mono px-2 py-0.5 rounded border border-zinc-800 whitespace-nowrap shadow-lg flex items-center gap-1 hover:z-50 select-none">
                          <span className="font-sans font-bold text-zinc-100">{pin.label}</span>
                          {pin.comments.length > 0 && layers.comments && (
                            <span className="bg-red-950 text-red-400 px-1 rounded font-black text-[7px]" title="Discussion counts">
                              💬 {pin.comments.length}
                            </span>
                          )}
                          
                          {/* Authorized removal trigger */}
                          {isAuthorized() && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteMarker(pin.id, e)}
                              className="ml-2 hover:text-red-500 text-zinc-500 text-[10px] p-0.5 font-bold cursor-pointer"
                              title="Remove pin"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* ACTIVE CONFIRMED CLICK COORD MARKER ADD FORM DIALOG */}
                {clickCoord && (
                  <div
                    className="absolute z-40 bg-[#090b0e]/95 border-2 border-red-500 rounded-2xl p-4 shadow-2xl w-60 text-left font-chakra text-white pointer-events-auto"
                    style={{
                      left: `${clickCoord.x}%`,
                      top: `${clickCoord.y}%`,
                      transform: clickCoord.y < 50 ? 'translate(-50%, 15px)' : 'translate(-50%, -105%)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-zinc-800">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1 font-mono">
                        🚩 PLACE {
                          activeTool === "aggressive" ? "⚔️ AGGRESSIVE" :
                          activeTool === "defensive" ? "🛡️ DEFENSIVE" :
                          activeTool === "rotation" ? "🔄 ROTATION" :
                          activeTool?.toString().toUpperCase()
                        } PIN
                      </span>
                      <button
                        type="button"
                        onClick={() => setClickCoord(null)}
                        className="text-[10px] text-zinc-550 hover:text-white font-bold cursor-pointer font-mono"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-500 uppercase leading-none block">MARKER LANDMARK NAME</label>
                        <input
                          type="text"
                          placeholder="e.g. Rozhok Bridge block"
                          value={markerLabel}
                          onChange={(e) => setMarkerLabel(e.target.value)}
                          className="w-full bg-black border border-zinc-850 rounded px-2 py-1.5 text-[10px] font-sans focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Custom note */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-500 uppercase leading-none block">TACTICAL INSTRUCTION NOTE</label>
                        <textarea
                          placeholder="Provide custom squad briefing coordinates instructions..."
                          value={markerNote}
                          onChange={(e) => setMarkerNote(e.target.value)}
                          className="w-full bg-black border border-zinc-850 rounded px-2 py-1 text-[10px] font-sans focus:outline-none focus:border-red-500 h-11 resize-none"
                        />
                      </div>

                      {/* VOICE AND SCREENSHOTS ATTACHMENTS */}
                      <div className="bg-black/60 p-2 rounded-lg border border-zinc-900 flex items-center justify-between gap-2">
                        
                        {/* Voice Simulated Button */}
                        <button
                          type="button"
                          onClick={toggleVoiceRecording}
                          className={`flex-1 py-1 px-1.5 rounded text-[8px] font-black tracking-tight border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            isRecordingVoice
                              ? "bg-red-950 border-red-500 text-red-400 animate-pulse"
                              : voiceSimulated
                                ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Volume2 size={10} />
                          <span>{isRecordingVoice ? "RECORDING..." : voiceSimulated ? "🎙️ AUDIO OK" : "TAP TO RECORD"}</span>
                        </button>

                        {/* Screenshot clip */}
                        <button
                          type="button"
                          onClick={simulateScreenshot}
                          className={`flex-1 py-1 px-1.5 rounded text-[8px] font-black tracking-tight border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            screenshotSimulated
                              ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Camera size={10} />
                          <span>{screenshotSimulated ? "📸 ATTACHED" : "+ ATTACH PIC"}</span>
                        </button>
                      </div>
                      
                      {/* ROTATION SLIDER FOR TACTICAL ORIENTATION */}
                      <div className="space-y-1.5 border-t border-zinc-850 pt-2.5">
                        <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase leading-none">
                          <label htmlFor="marker-rotation-slider">Tactical Line-of-Sight Orientation</label>
                          <span className="text-red-400 font-mono text-[9px]">{markerRotation}°</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="marker-rotation-slider"
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={markerRotation}
                            onChange={(e) => setMarkerRotation(Number(e.target.value))}
                            className="flex-1 accent-red-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            min="0"
                            max="360"
                            value={markerRotation}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(360, Number(e.target.value) || 0));
                              setMarkerRotation(val);
                            }}
                            className="w-10 bg-black border border-zinc-800 rounded px-1 py-0.5 text-[9px] font-mono text-center focus:outline-none focus:border-red-500 text-zinc-300"
                          />
                        </div>
                        <div className="flex justify-between text-[7px] font-mono text-zinc-600 px-0.5">
                          <span>N (0°)</span>
                          <span>E (90°)</span>
                          <span>S (180°)</span>
                          <span>W (270°)</span>
                        </div>
                      </div>

                      {/* Color layout picker */}
                      <div className="grid grid-cols-6 gap-1 border-t border-zinc-850 pt-2 justify-items-center">
                        {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ffffff"].map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => setMarkerColor(col)}
                            className={`w-3.5 h-3.5 rounded-full cursor-pointer border ${
                              markerColor === col ? "border-white ring-2 ring-red-500/40 scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmAddMarker}
                        className="w-full py-1.5 bg-[#ff001c] text-white hover:bg-red-700 rounded text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        Confirm Placement
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STRATEGY PLAYBACK TIMELINE ENGINE */}
            <div className="bg-[#191b22] p-4 rounded-xl border border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono border-b border-zinc-850 pb-2">
                <span className="text-red-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Tv size={12} className="text-red-500" />
                  Planned Rotations Playback Mode
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-zinc-550 select-none uppercase">SPEED DETECT:</span>
                  {[
                    { label: "1x", ms: 1200 },
                    { label: "2x", ms: 600 },
                    { label: "WARP", ms: 250 }
                  ].map((speedObj) => (
                    <button
                      key={speedObj.label}
                      type="button"
                      onClick={() => setPlaybackSpeed(speedObj.ms)}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-tight cursor-pointer transition-colors ${
                        playbackSpeed === speedObj.ms
                          ? "bg-red-950 text-red-400 border border-red-500/20"
                          : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      {speedObj.label}
                    </button>
                  ))}
                </div>
              </div>

              {markers.length < 2 ? (
                <div className="text-[10.5px] text-zinc-550 italic text-center py-2 font-sans">
                  Set at least two tactical path markers to compute playback rotations.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px]">
                  
                  {/* Action Play toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsPlaybackActive(!isPlaybackActive)}
                      className={`py-1.5 px-3 rounded-lg font-black tracking-wide text-[9px] cursor-pointer flex items-center gap-1.5 transition-colors ${
                        isPlaybackActive
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "bg-red-650 text-white hover:bg-red-700"
                      }`}
                    >
                      {isPlaybackActive ? <Pause size={10} /> : <Play size={10} />}
                      <span>{isPlaybackActive ? "PAUSE PLAYBACK" : "PLAY ROTATION RUN"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPlaybackActive(false);
                        setPlaybackTick(0);
                        showNotification("🔄 Timeline rewinded successfully.");
                      }}
                      className="py-1.5 px-2 bg-zinc-950 hover:bg-zinc-800 rounded-lg text-zinc-400 cursor-pointer text-[8.5px]"
                    >
                      REWIND
                    </button>
                  </div>

                  {/* Playback Ticker stats */}
                  <div className="text-zinc-300 font-bold flex items-center gap-3">
                    <span className="text-[9px] bg-black px-2 py-1 rounded border border-zinc-850">
                      FOCUS NODE: <span className="text-red-500">#{playbackTick + 1}</span> {markers[playbackTick]?.label}
                    </span>
                    <span className="text-zinc-550">
                      STEP {playbackTick + 1} / {markers.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 3: STRATEGY PROFILE REGISTRY & MAP COMMENTS CHAT CHANNELS (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* MAP SPECIFIC COMMENTS DIALOG */}
          <div className="bg-[#121419] p-4 rounded-2xl border border-zinc-800 space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-[#14f7ff] uppercase border-b border-zinc-850 pb-2 flex items-center justify-between">
              <span>Coordinate Comments</span>
              <MessageSquare size={12} className="text-zinc-600" />
            </h3>

            {selectedMarkerForComment ? (
              <div className="space-y-3 select-none">
                <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-850/80 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-red-400 font-mono tracking-wide leading-none">
                      📌 {selectedMarkerForComment.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedMarkerForComment(null)}
                      className="text-[9px] text-zinc-550 hover:text-white"
                    >
                      ✕ CLOSE
                    </button>
                  </div>
                  <p className="text-[9.5px] text-zinc-400 font-sans italic my-1.5">
                    "{selectedMarkerForComment.note || "No custom briefing attached."}"
                  </p>

                  {/* Screenshots preview */}
                  {selectedMarkerForComment.screenshotUrl && (
                    <div className="my-2 border border-zinc-800 rounded-lg overflow-hidden relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={selectedMarkerForComment.screenshotUrl}
                        alt="attachment"
                        className="w-full h-16 object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[5px] font-mono text-zinc-400 tracking-normal uppercase">
                        Verified Screenshot Attachment
                      </span>
                    </div>
                  )}

                  {/* Voice annotation playback mock visualizer */}
                  {selectedMarkerForComment.voiceUrl && (
                    <div className="p-1 px-2.5 bg-zinc-950 rounded-lg border border-red-500/10 flex items-center justify-between text-[8px] font-mono mb-2">
                      <span className="text-red-400 animate-pulse font-extrabold flex items-center gap-1">
                        🔊 █ ▆ ▅ AUDIO LOCK
                      </span>
                      <button
                        type="button"
                        onClick={() => showNotification("🔊 Playback simulation of voice annotation initiated.")}
                        className="text-zinc-300 hover:text-white hover:underline cursor-pointer"
                      >
                        [LISTEN briefings]
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 mt-2 pt-1.5 border-t border-zinc-850/80">
                    <span className="text-[7.5px] text-zinc-600 font-mono">
                      COORD METRICS: X: {selectedMarkerForComment.x}%, Y: {selectedMarkerForComment.y}%
                    </span>
                    
                    {/* LIVE ORIENTATION ADJUSTER */}
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase leading-none">
                        <span className="flex items-center gap-1 text-red-400"><RotateCw size={8} /> Live Rotation</span>
                        <span className="text-red-400 font-mono text-[9px]">{selectedMarkerForComment.rotation || 0}°</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="5"
                          value={selectedMarkerForComment.rotation || 0}
                          onChange={(e) => handleUpdateMarkerRotation(selectedMarkerForComment.id, Number(e.target.value))}
                          className="flex-1 accent-red-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment feeds list */}
                <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 text-left no-scrollbar">
                  {selectedMarkerForComment.comments.length === 0 ? (
                    <p className="text-[10px] text-zinc-550 italic text-center py-2 font-sans">
                      No discussions placed here yet. Start the coordination thread below!
                    </p>
                  ) : (
                    selectedMarkerForComment.comments.map((comm) => (
                      <div key={comm.id} className="bg-[#0b0c0e] p-2 rounded-lg border border-zinc-900 leading-tight">
                        <div className="flex justify-between text-[8px] font-mono font-black mb-1">
                          <span className="text-red-400">{comm.author} <span className="text-[7px] text-zinc-650">({comm.role})</span></span>
                          <span className="text-zinc-650">{comm.time}</span>
                        </div>
                        <p className="text-[9.5px] text-zinc-300 font-sans">{comm.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Post response form */}
                <form onSubmit={handleAddComment} className="flex gap-1.5 mt-1">
                  <input
                    type="text"
                    placeholder="Write a response..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-black border border-zinc-850 rounded px-2 py-1 text-[10px] font-sans focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-red-650 hover:bg-red-700 text-white rounded text-[8.5px] font-bold uppercase cursor-pointer"
                  >
                    POST
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-500 italic text-[11px] font-sans select-none border border-dashed border-zinc-850 rounded-xl bg-black/20">
                👉 Hover or click coordinates markers on the canvas grid to inspect precision threads and post comments!
              </div>
            )}
          </div>

          {/* STRATEGY SAVE & HISTORICAL VERSION BLOCK (CUSTOM LAYOUTS FOLDER) */}
          <div className="bg-[#121419] p-4 rounded-2xl border border-zinc-800 space-y-3 relative">
            <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-450 uppercase border-b border-zinc-850 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FolderOpen size={13} className="text-red-500" />
                <span>Custom Layouts Folder</span>
              </span>
              <Lock size={12} className="text-zinc-650" />
            </h3>

            {/* Organize category filter buttons */}
            <div className="flex bg-black/60 p-0.5 rounded-lg border border-zinc-900 gap-1 select-none">
              {[
                { id: "all", label: "ALL" },
                { id: "tournament", label: "TOURNEY" },
                { id: "scrim", label: "SCRIM" },
                { id: "squad", label: "SQUAD" },
                { id: "training", label: "TRAIN" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex-1 py-1 rounded text-[7.5px] font-black tracking-tighter cursor-pointer uppercase ${
                    activeCategory === cat.id
                      ? "bg-red-955/35 text-red-500"
                      : "text-zinc-650 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Save strategy list items */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto no-scrollbar pr-1">
              {filteredVersions.length === 0 ? (
                <p className="text-[10px] text-zinc-600 text-center py-4 font-sans select-none">
                  No strategy versions matches current filter.
                </p>
              ) : (
                filteredVersions.map((v) => {
                  const isActive = selectedVersionId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => handleRestoreVersion(v)}
                      onMouseEnter={() => setHoveredVersion(v)}
                      onMouseLeave={() => setHoveredVersion(null)}
                      className={`p-2 rounded-xl border text-left flex items-start justify-between gap-1.5 cursor-pointer transition-all ${
                        isActive
                          ? "bg-gradient-to-br from-red-955/20 to-black border-red-500/40"
                          : "bg-black/40 border-zinc-950 hover:border-zinc-800"
                      }`}
                    >
                      <div className="text-left space-y-1 overflow-hidden">
                        <p className="text-[10.5px] font-black text-white leading-tight font-sans truncate pr-2" title={v.name}>
                          {v.name}
                        </p>
                        <p className="text-[7.5px] text-zinc-550 font-mono uppercase tracking-normal">
                          {v.author} • {v.updatedAt} • {v.category}
                        </p>
                        <span className="inline-block bg-[#161a22] text-zinc-300 font-mono text-[7px] px-1 py-0.5 rounded font-bold border border-zinc-800 leading-none">
                          {v.markers.length} pinned nodes
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        
                        {/* Lock overlay status */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleVersionLock(v.id, e)}
                          className={`p-1 rounded bg-[#16171b] border transition-colors hover:text-white ${
                            v.isLocked ? "border-amber-500/20 text-amber-400" : "border-zinc-800 text-zinc-605"
                          }`}
                          title={v.isLocked ? "Lead Authorized lock active" : "Unlocked for roster editing"}
                        >
                          {v.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                        </button>

                        {/* Purge / Delete version preset */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (v.isLocked && userRole !== "Coach") {
                              showNotification("⚠️ Unauthorized: This preset is LOCKED by coach authorization.");
                              return;
                            }
                            setDeletingVersion(v);
                          }}
                          className="p-1 rounded bg-[#16171b] border border-zinc-800 text-zinc-550 hover:text-red-500 hover:border-red-500/40 transition-colors"
                          title="Purge Tactical Blueprint Preset"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* DYNAMIC HOVER TACTICAL PREVIEW OVERLAY FLYOUT */}
            <AnimatePresence>
              {hoveredVersion && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-full mr-3 top-0 z-55 w-80 bg-[#121419]/95 border-2 border-red-500/40 rounded-xl p-3 shadow-[0_0_30px_rgba(239,68,68,0.25)] backdrop-blur-md pointer-events-none hidden lg:block"
                >
                  {/* Visual indicator corner brackets */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#ff001c]/60" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#ff001c]/60" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#ff001c]/60" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#ff001c]/60" />

                  {/* HUD Header */}
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
                    <div>
                      <span className="text-[7.5px] font-mono text-zinc-500 block font-bold leading-none tracking-widest uppercase">LAYOUT PREVIEW SPECIFICATION</span>
                      <span className="text-[10px] font-mono font-black text-[#ff001c] block leading-tight truncate max-w-[210px] uppercase">
                        {hoveredVersion.name}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-extrabold bg-[#ff001c] text-white px-1.5 py-0.5 rounded leading-none shrink-0 uppercase">
                      {selectedMap.name}
                    </span>
                  </div>

                  {/* Map thumbnail and pin overlay container */}
                  <div className="relative w-full h-[180px] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-850">
                    <img
                      src={selectedMap.image}
                      alt={hoveredVersion.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-45 transform scale-102"
                    />

                    {/* Laser Scan grid overlay lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.025)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 pointer-events-none" />

                    {/* Animated scanner laser sweep */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff001c]/80 to-transparent shadow-[0_0_8px_#ff001c] pointer-events-none animate-bounce" style={{ top: "35%", animationDuration: "2.5s" }} />

                    {/* Center targeting brackets overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-12 h-12 rounded-full border border-dashed border-[#ff001c] flex items-center justify-center animate-[spin_25s_linear_infinite]" />
                    </div>

                    {/* Connection vectors overlay (SVG lines in preview image coordinate spaces) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {hoveredVersion.routes.map((route, rIdx) => {
                        const fromPin = hoveredVersion.markers.find(m => m.id === route.fromId);
                        const toPin = hoveredVersion.markers.find(m => m.id === route.toId);
                        if (!fromPin || !toPin) return null;

                        const x1 = `${fromPin.x}%`;
                        const y1 = `${fromPin.y}%`;
                        const x2 = `${toPin.x}%`;
                        const y2 = `${toPin.y}%`;

                        return (
                          <line
                            key={`pre-route-${rIdx}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#ff001c"
                            strokeWidth="1.5"
                            strokeDasharray="3,3"
                            className="opacity-75 animate-pulse"
                          />
                        );
                      })}
                    </svg>

                    {/* Overlaid markers pins on map thumbnail */}
                    {hoveredVersion.markers.map((marker) => {
                      const pinClr = marker.color || "#ef4444";
                      return (
                        <div
                          key={`pre-pin-${marker.id}`}
                          style={{
                            left: `${marker.x}%`,
                            top: `${marker.y}%`,
                            transform: "translate(-50%, -50%)"
                          }}
                          className="absolute w-4 h-4 flex items-center justify-center pointer-events-none z-10"
                        >
                          <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ backgroundColor: pinClr, animationDuration: "2s" }} />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 border border-zinc-950 shadow shadow-black" style={{ backgroundColor: pinClr }} />
                          
                          {/* Interactive marker label balloon */}
                          <div className="absolute left-full ml-1 bg-[#121419]/95 border border-zinc-800 rounded font-sans text-[6.5px] text-white px-1 leading-normal uppercase font-bold tracking-tight select-none pointer-events-none truncate max-w-[55px]">
                            {marker.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Info and statistics fields */}
                  <div className="mt-2 space-y-1 text-[8.5px] font-mono text-zinc-455">
                    <div className="flex justify-between text-zinc-500">
                      <span>CREATOR: <strong className="text-zinc-300">{hoveredVersion.author}</strong></span>
                      <span>UPDATED: <strong className="text-zinc-400">{hoveredVersion.updatedAt.split(" ")[0]}</strong></span>
                    </div>
                    <div className="flex justify-between items-center bg-black/45 px-2 py-1 rounded border border-zinc-900 mt-1">
                      <span className="text-[#ff001c] font-black uppercase text-[7px] tracking-widest">{hoveredVersion.category} SPEC</span>
                      <span className="flex gap-2">
                        <span>PINS: <strong className="text-red-400">{hoveredVersion.markers.length}</strong></span>
                        <span>PATHS: <strong className="text-blue-400">{hoveredVersion.routes.length}</strong></span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* New Version Snapshot save action bar */}
            {isAuthorized() && (
              <form onSubmit={handleSaveNamedVersion} className="flex gap-1 border-t border-zinc-850 pt-3">
                <input
                  type="text"
                  placeholder="Version name (e.g., Erangel Bridge Split V2)..."
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="flex-1 bg-black border border-zinc-850 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-[9.5px] text-white focus:outline-none font-sans"
                />
                
                <button
                  type="submit"
                  disabled={!newVersionName.trim()}
                  className="px-2.5 py-1.5 bg-red-650 text-white rounded-lg hover:bg-red-700 text-[9px] font-black uppercase cursor-pointer"
                >
                  SAVE LOCK
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER METRIC BANNER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[9px] font-mono text-zinc-600 border-t border-zinc-850 pt-4.5 select-none text-left">
        <div className="flex flex-wrap items-center gap-4">
          <span>OPERATIONAL SQUAD FRAME: Active</span>
          <span>•</span>
          <span>REST API WEBSOCKET CONTEXT: Simulated Connected</span>
          <span>•</span>
          <span>COMPATIBILITY RATIO: 120 FPS Gyro Ready</span>
        </div>
        <div className="text-right">
          <span>CRIMSON VIPERS E-SPORTS DIGITAL LEDGER</span>
        </div>
      </div>

      {/* 🚨 TACTICAL PRESET DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingVersion && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="max-w-md w-full bg-[#0e1014] border-2 border-red-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,0,0,0.25)] relative overflow-hidden"
              id="preset-delete-confirmation-modal"
            >
              {/* Sci-fi bracket accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-red-500/40" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-red-500/40" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-red-500/40" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-red-500/40" />

              <div className="space-y-4 text-center">
                <div className="mx-auto w-12 h-12 bg-red-955/40 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 animate-pulse">
                  <AlertTriangle size={24} />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-black text-red-500 tracking-widest uppercase block">
                    TACTICAL BLUEPRINT PURGE PROTOCOL
                  </span>
                  <h3 className="text-sm font-bold text-white font-sans leading-snug">
                    Are you absolutely sure you want to delete <br />
                    <span className="text-red-400 font-mono text-[13px] bg-red-955/25 px-2 py-0.5 rounded border border-red-900/30 inline-block mt-1">
                      {deletingVersion.name}
                    </span>?
                  </h3>
                </div>

                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed text-left bg-black/40 p-3 rounded-xl border border-zinc-900">
                  ⚠️ <strong>Accidental deletion warning:</strong> This will permanently erase the blueprint layout containing <strong>{deletingVersion.markers.length} pinned nodes</strong> and <strong>{deletingVersion.routes.length} connection route paths</strong> designed for the <strong>{deletingVersion.category.toUpperCase()}</strong> roster. This action cannot be undone.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingVersion(null)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-[#16171b] text-zinc-300 hover:text-white text-xs font-bold uppercase transition-all duration-200 cursor-pointer"
                  >
                    ABORT PROTOCOL
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteVersionConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-red-650 hover:bg-red-700 text-white text-xs font-black uppercase transition-all duration-200 shadow-lg shadow-red-955/50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    CONFIRM PURGE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
