import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, Cpu, Sparkles, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";

// Performance Quality options
export type VisualQuality = "ultra" | "medium" | "eco" | "off";

interface AestheticEffectsProps {
  activeTab: string;
}

export function CVAestheticEffects({ activeTab }: AestheticEffectsProps) {
  const [quality, setQuality] = useState<VisualQuality>(() => {
    const saved = localStorage.getItem("cv_visual_quality");
    if (saved === "ultra" || saved === "medium" || saved === "eco" || saved === "off") {
      return saved as VisualQuality;
    }
    // Auto-detect mobile devices for eco-mode
    if (typeof window !== "undefined") {
      const isMobile = /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) || window.innerWidth < 768;
      return isMobile ? "eco" : "ultra";
    }
    return "medium";
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [fps, setFps] = useState(60);

  // FPS Telemetry Counter
  useEffect(() => {
    if (quality === "off") return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = () => {
      frameCount++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };
    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, [quality]);

  // Save selection
  const handleQualityChange = (newQual: VisualQuality) => {
    setQuality(newQual);
    localStorage.setItem("cv_visual_quality", newQual);
  };

  if (quality === "off") {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <VisualQualityTrigger 
          quality={quality} 
          fps={fps} 
          showConfig={showConfig} 
          setShowConfig={setShowConfig} 
          qualityList={["ultra", "medium", "eco", "off"] as VisualQuality[]}
          onQualityChange={handleQualityChange}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      </div>
    );
  }

  return (
    <>
      {/* Visual Quality / Sound Controller Float - Styled like a premium HUD HUD widget */}
      <div className="fixed bottom-3 right-3 z-50">
        <VisualQualityTrigger 
          quality={quality} 
          fps={fps} 
          showConfig={showConfig} 
          setShowConfig={setShowConfig} 
          qualityList={["ultra", "medium", "eco", "off"] as VisualQuality[]}
          onQualityChange={handleQualityChange}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      </div>

      {/* Main dynamic multi-background canvas container */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-[1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}_${quality}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The base uniform tactical grids across tabs */}
            <div className="absolute inset-0 bg-black" />
            
            {/* Conditional Background Renderings based on tabs */}
            {activeTab === "home" && <CommandCenterBackground quality={quality} soundEnabled={soundEnabled} />}
            {(activeTab === "tournaments" || activeTab === "leaderboards" || activeTab === "rewards") && <ChampionshipArenaBackground quality={quality} />}
            {activeTab === "scrims" && <TacticalOpsBackground quality={quality} />}
            {(activeTab === "tdmArena" || activeTab === "tdm") && <CombatZoneBackground quality={quality} />}
            {activeTab === "strategy" && <WarRoomBackground quality={quality} />}
            {(activeTab === "recruitment" || activeTab === "communityHub" || activeTab === "worldChat" || activeTab === "feed" || activeTab === "communitySquads") && <EsportsSocialHubBackground quality={quality} />}
            {activeTab === "media" && <BroadcastStudioBackground quality={quality} />}
            {activeTab === "news" && <EsportsNetworkNewsBackground quality={quality} />}
            {(activeTab === "team" || activeTab === "teamwar") && <TeamHeadquartersBackground quality={quality} />}
            {(activeTab === "dashboard" || activeTab === "securityGuardian") && <GlobalOperationsBackground quality={quality} />}
            {activeTab === "settings" && <GenericAmbientBackground quality={quality} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

// Float Configurator Widget
interface TriggerProps {
  quality: VisualQuality;
  fps: number;
  showConfig: boolean;
  setShowConfig: (v: boolean) => void;
  qualityList: VisualQuality[];
  onQualityChange: (v: VisualQuality) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
}

function VisualQualityTrigger({
  quality,
  fps,
  showConfig,
  setShowConfig,
  qualityList,
  onQualityChange,
  soundEnabled,
  setSoundEnabled
}: TriggerProps) {
  return (
    <div className="relative font-mono text-[10px] text-zinc-300">
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-11 right-0 w-52 bg-zinc-950/98 border border-[#ff001c]/40 rounded-xl p-3.5 space-y-3 shadow-[0_0_20px_rgba(255,0,31,0.25)] backdrop-blur-md"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
              <span className="font-bold text-white flex items-center gap-1">
                <Cpu size={12} className="text-[#ff001c]" /> HUD AESTHETICS
              </span>
              <span className="text-[9px] text-[#ff001c] font-black">{fps} FPS</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] text-zinc-500 uppercase block">FX Render Quality</span>
              <div className="grid grid-cols-4 gap-1">
                {qualityList.map((q) => (
                  <button
                    key={q}
                    onClick={() => onQualityChange(q)}
                    className={`py-1 rounded text-center text-[8px] font-bold uppercase transition-all cursor-pointer ${
                      quality === q
                        ? "bg-[#ff001c] text-white shadow-[0_0_8px_rgba(255,0,31,0.5)]"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[8px] text-zinc-500 uppercase block">Ambient SFX</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-full py-1 px-2 rounded flex items-center justify-between text-[8px] font-bold uppercase transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-[#ff001c]/20 border border-[#ff001c]/60 text-white"
                    : "bg-zinc-900 text-zinc-500"
                }`}
              >
                <span>{soundEnabled ? "Atmosphere Online" : "Atmosphere Muted"}</span>
                {soundEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
              </button>
            </div>

            <div className="text-[8px] text-zinc-500 italic leading-relaxed pt-1 border-t border-zinc-900">
              ⚡ Ultra-HD runs real-time dynamic Canvas weather modules, ray-casts, and particles.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowConfig(!showConfig)}
        className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-black/98 border border-[#ff001c]/35 text-white hover:border-[#ff001c] rounded-full shadow-[0_0_15px_rgba(255,0,31,0.15)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
      >
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
        <span className="uppercase text-[9px]">Aesthetic Engine: {quality}</span>
        <Sparkles size={11} className="text-[#ff001c]" />
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// 🏠 1. HOME CENTER: "CV eSports Command Center" (Animated Storm and HD lightning canvas)
// -------------------------------------------------------------
function CommandCenterBackground({ quality, soundEnabled }: { quality: VisualQuality; soundEnabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Weather particles
    interface RainParticle {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    }

    const rain: RainParticle[] = [];
    const maxParticles = quality === "ultra" ? 60 : quality === "medium" ? 25 : 8;

    for (let i = 0; i < maxParticles; i++) {
      rain.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        length: Math.random() * 25 + 10,
        speed: Math.random() * 12 + 10,
        opacity: Math.random() * 0.15 + 0.05
      });
    }

    // Lightning strike controllers
    let lightningTrigger = 0;
    let flashOpacity = 0;
    let boltSegments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    const triggerLightningBolt = () => {
      boltSegments = [];
      let startX = Math.random() * width;
      let startY = 0;
      let segments = Math.floor(Math.random() * 12) + 8;
      
      let x = startX;
      let y = startY;

      for (let i = 0; i < segments; i++) {
        let nextX = x + (Math.random() * 80 - 40);
        let nextY = y + (height / segments) * (Math.random() * 0.4 + 0.8);
        boltSegments.push({ x1: x, y1: y, x2: nextX, y2: nextY });
        x = nextX;
        y = nextY;
      }
      flashOpacity = Math.random() * 0.35 + 0.15;

      // Play lightning sound if enabled
      if (soundEnabled && typeof Audio !== "undefined") {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          // Create synthetic thunder crack
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(32, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 1.2);
          
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 1.6);
        } catch (e) {
          // ignore context restrictions or errors
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dark ambient background gradient
      const baseGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
      baseGrad.addColorStop(0, "#080404");
      baseGrad.addColorStop(0.5, "#030202");
      baseGrad.addColorStop(1, "#000000");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Grid lines
      if (quality !== "eco") {
        ctx.strokeStyle = "rgba(209, 0, 31, 0.03)";
        ctx.lineWidth = 1;
        const gridSize = 45;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 3. Storm Clouds Atmosphere Glowing Circles
      if (quality !== "eco") {
        ctx.fillStyle = "rgba(209, 0, 31, 0.015)";
        ctx.beginPath();
        ctx.arc(width * 0.3, height * 0.1, 400, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.2, 500, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Update rain particles
      ctx.strokeStyle = "rgba(209, 0, 31, 0.2)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < rain.length; i++) {
        const r = rain[i];
        ctx.strokeStyle = `rgba(209, 0, 31, ${r.opacity})`;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 1, r.y + r.length);
        ctx.stroke();

        r.y += r.speed;
        if (r.y > height) {
          r.y = -r.length;
          r.x = Math.random() * width;
        }
      }

      // 5. Lightning logic
      lightningTrigger += Math.random() * 100;
      const triggerThreshold = quality === "ultra" ? 17500 : 25000;
      if (lightningTrigger > triggerThreshold) {
        triggerLightningBolt();
        lightningTrigger = 0;
      }

      // Render Active Lightning Bolt
      if (boltSegments.length > 0 && flashOpacity > 0.01) {
        // Core white bolt
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = quality === "ultra" ? 2.5 : 1.8;
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(209,0,31,0.8)";
        ctx.beginPath();
        boltSegments.forEach((seg, idx) => {
          if (idx === 0) ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        });
        ctx.stroke();

        // Neon Crimson Envelope Outliner
        ctx.strokeStyle = "rgba(209,0,31,0.65)";
        ctx.lineWidth = quality === "ultra" ? 6.0 : 4.0;
        ctx.stroke();

        // Atmospheric full-screen dynamic flash
        ctx.fillStyle = `rgba(209, 0, 31, ${flashOpacity * 0.15})`;
        ctx.fillRect(0, 0, width, height);

        // Ambient Spotlight reflecting on the page
        const spots = [
          { x: width * 0.25, y: height * 0.75 },
          { x: width * 0.75, y: height * 0.8 }
        ];
        spots.forEach(sp => {
          const glow = ctx.createRadialGradient(sp.x, sp.y, 10, sp.x, sp.y, 450);
          glow.addColorStop(0, `rgba(209,0,31,${flashOpacity * 0.08})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);
        });

        flashOpacity *= 0.88; // Fades out sequentially
        ctx.shadowBlur = 0; // Reset canvas property
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality, soundEnabled]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// 🏆 2. CHAMPIONSHIP ARENA: Esports Stadium ambiance & Moving holograms
// -------------------------------------------------------------
function ChampionshipArenaBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Spotlight beams
    interface Beam {
      x: number;
      targetX: number;
      speed: number;
      angle: number;
      range: number;
      opacity: number;
    }

    const beams: Beam[] = [
      { x: width * 0.2, targetX: width * 0.3, speed: 0.003, angle: 0, range: 400, opacity: 0.15 },
      { x: width * 0.5, targetX: width * 0.5, speed: 0.001, angle: 0, range: 250, opacity: 0.1 },
      { x: width * 0.8, targetX: width * 0.7, speed: 0.004, angle: 0, range: 350, opacity: 0.14 }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark arena base
      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, width, height);

      // Arena neon horizon line
      const horizonY = height * 0.65;
      const grad = ctx.createLinearGradient(0, horizonY - 140, 0, horizonY + 240);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.3, "rgba(209, 0, 31, 0.04)");
      grad.addColorStop(0.5, "rgba(209, 0, 31, 0.16)");
      grad.addColorStop(0.7, "rgba(209, 0, 31, 0.04)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, horizonY - 140, width, 450);

      // Holographic Trophy Ring Circles (Floating)
      if (quality !== "eco") {
        ctx.strokeStyle = "rgba(209, 0, 31, 0.1)";
        ctx.lineWidth = 1.2;
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time) * 15;

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 280 + pulse, 0, Math.PI * 2);
        ctx.setLineDash([10, 20]);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 340 - pulse, 0, Math.PI * 2);
        ctx.setLineDash([5, 30]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      }

      // Draw Stadium spotlight sweeps
      beams.forEach((b) => {
        b.angle += b.speed;
        const currentSweepX = b.x + Math.sin(b.angle) * b.range;

        const beamGrad = ctx.createLinearGradient(b.x, 0, currentSweepX, height);
        beamGrad.addColorStop(0, `rgba(209, 0, 31, ${b.opacity})`);
        beamGrad.addColorStop(0.5, `rgba(209, 0, 31, ${b.opacity * 0.4})`);
        beamGrad.addColorStop(1, "transparent");

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(b.x - 20, 0);
        ctx.lineTo(b.x + 20, 0);
        ctx.lineTo(currentSweepX + 160, height);
        ctx.lineTo(currentSweepX - 160, height);
        ctx.closePath();
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// 🎯 3. TACTICAL OPERATIONS: Tactical grid, radars & grid lines
// -------------------------------------------------------------
function TacticalOpsBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let radarSweepAngle = 0;
    const radarCenter = { x: width * 0.8, y: height * 0.75 };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Ops background base
      ctx.fillStyle = "#030406";
      ctx.fillRect(0, 0, width, height);

      // Tactical tech matrix grids
      ctx.strokeStyle = "rgba(16, 185, 129, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Radar rings & sweeps (Classic TOC style)
      if (quality !== "eco") {
        radarSweepAngle += 0.015;
        const maxRadius = Math.max(width, height) * 0.28;

        // Radial green circles around center
        ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
        ctx.strokeRect(radarCenter.x - 10, radarCenter.y - 10, 20, 20);
        
        ctx.beginPath();
        ctx.arc(radarCenter.x, radarCenter.y, maxRadius * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radarCenter.x, radarCenter.y, maxRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radarCenter.x, radarCenter.y, maxRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Sweeping beam
        ctx.save();
        ctx.translate(radarCenter.x, radarCenter.y);
        ctx.rotate(radarSweepAngle);

        const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
        sweepGrad.addColorStop(0, "rgba(16, 185, 129, 0.22)");
        sweepGrad.addColorStop(1, "transparent");

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, 0, Math.PI * 0.18);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Dummy random radar target dots blink
        const timeVal = Math.floor(Date.now() / 1500);
        if (timeVal % 2 === 0) {
          ctx.fillStyle = "rgba(239, 68, 68, 0.7)"; // Red hostile marks
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ef4444";
          ctx.beginPath();
          ctx.arc(radarCenter.x - 120, radarCenter.y - 80, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(16, 185, 129, 0.8)"; // Green ally mark
          ctx.shadowColor = "#10b981";
          ctx.beginPath();
          ctx.arc(radarCenter.x + 190, radarCenter.y - 40, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      radarCenter.x = width * 0.8;
      radarCenter.y = height * 0.75;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// ⚔️ 4. COMBAT ZONE: Dynamic diagonal grids & glowing electric streams
// -------------------------------------------------------------
function CombatZoneBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Energy nodes
    interface EnergyRay {
      coord: number;
      speed: number;
      width: number;
      opacity: number;
    }

    const rays: EnergyRay[] = [];
    const maxRays = quality === "ultra" ? 15 : quality === "medium" ? 8 : 3;

    for (let i = 0; i < maxRays; i++) {
      rays.push({
        coord: Math.random() * width,
        speed: Math.random() * 2 + 1,
        width: Math.random() * 4 + 1,
        opacity: Math.random() * 0.2 + 0.05
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark energetic red/black mix gradient
      const gradient = ctx.createRadialGradient(width / 2, height, height * 0.1, width / 2, height, height * 0.9);
      gradient.addColorStop(0, "#0e0505");
      gradient.addColorStop(0.6, "#040202");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Diagonal Combat Grid (Angled perspective layout)
      ctx.strokeStyle = "rgba(209, 0, 31, 0.04)";
      ctx.lineWidth = 1.2;
      
      const factor = 40;
      for (let x = -width; x < width * 2; x += factor) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + width * 0.5, height);
        ctx.stroke();
      }

      // Vertical streams moving across
      rays.forEach((r) => {
        ctx.strokeStyle = `rgba(209, 0, 31, ${r.opacity})`;
        ctx.lineWidth = r.width;
        ctx.beginPath();
        ctx.moveTo(r.coord, 0);
        ctx.lineTo(r.coord - 80, height);
        ctx.stroke();

        r.coord -= r.speed;
        if (r.coord < -80) {
          r.coord = width + 80;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// 🗺️ 5. WAR ROOM: Blueprint grids, route markers, planning matrix
// -------------------------------------------------------------
function WarRoomBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#020305";
      ctx.fillRect(0, 0, width, height);

      // Precise engineer drafting grids
      ctx.strokeStyle = "rgba(209, 0, 31, 0.02)";
      ctx.lineWidth = 0.5;
      const smallGrid = 15;
      for (let x = 0; x < width; x += smallGrid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += smallGrid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Dynamic Holographic map lines & nodes
      if (quality !== "eco") {
        ctx.strokeStyle = "rgba(209, 0, 31, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 12]);

        // Draw a simulated flight battle route
        ctx.beginPath();
        ctx.moveTo(width * 0.1, height * 0.4);
        ctx.bezierCurveTo(width * 0.35, height * 0.15, width * 0.65, height * 0.85, width * 0.9, height * 0.5);
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Sector marker dots
        const spots = [
          { x: width * 0.1, label: "MILITARY BASE (ZONE A)", color: "rgba(220, 38, 38, 0.7)" },
          { x: width * 0.5, label: "POCHINKI SPLIT COMPOUND", color: "rgba(37, 99, 235, 0.7)" },
          { x: width * 0.9, label: "SCHOOL BLOCK CHECKPOINT", color: "rgba(16, 185, 129, 0.7)" }
        ];

        spots.forEach((sp, idx) => {
          const yCoord = idx === 0 ? height * 0.4 : idx === 1 ? height * 0.52 : height * 0.5;
          ctx.fillStyle = sp.color;
          ctx.beginPath();
          ctx.arc(sp.x, yCoord, 6, 0, Math.PI * 2);
          ctx.fill();

          // Outward ripple ring
          const radiusPulse = 12 + Math.sin(Date.now() * 0.003 + idx) * 5;
          ctx.strokeStyle = sp.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sp.x, yCoord, radiusPulse, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-70" />;
}

// -------------------------------------------------------------
// 👥 6. ESPORTS SOCIAL HUB: Community ambient grid & slowly rising profile particles
// -------------------------------------------------------------
function EsportsSocialHubBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }

    const bubbles: Bubble[] = [];
    const maxBubbles = quality === "ultra" ? 30 : quality === "medium" ? 15 : 5;

    for (let i = 0; i < maxBubbles; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height + height,
        radius: Math.random() * 40 + 10,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.04 + 0.015
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Simple grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gap = 60;
      for (let x = 0; x < width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw bubbles
      bubbles.forEach((b) => {
        ctx.fillStyle = `rgba(209, 0, 31, ${b.opacity})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        b.y -= b.speed;
        if (b.y < -b.radius * 2) {
          b.y = height + b.radius * 2;
          b.x = Math.random() * width;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// 🎥 7. BROADCAST STUDIO: Professional LED sweeps & subtle lens flare sweeps
// -------------------------------------------------------------
function BroadcastStudioBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let sweepVal = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#040405";
      ctx.fillRect(0, 0, width, height);

      // Studio vertical projection sweep
      sweepVal += 0.003;
      const xCoord = width * 0.5 + Math.sin(sweepVal) * (width * 0.35);

      const radGrad = ctx.createRadialGradient(xCoord, height * 0.1, 5, xCoord, height * 0.1, Math.max(width, height) * 0.45);
      radGrad.addColorStop(0, "rgba(209, 0, 31, 0.08)");
      radGrad.addColorStop(1, "transparent");

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // TV Broadcast indicator grid
      if (quality !== "eco") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
        ctx.lineWidth = 1;
        const divider = 80;
        for (let x = 0; x < width; x += divider) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + 50, height);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// 📰 8. ESPORTS NETWORK NEWS: Modern dark linear card sweepers
// -------------------------------------------------------------
function EsportsNetworkNewsBackground({ quality }: { quality: VisualQuality }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#050505] via-[#090505] to-[#040405]">
      {/* Moving slow ticker ambient bars */}
      {quality !== "eco" && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-red-500 shadow-[0_0_20px_#ff001c] animate-pulse" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500 shadow-[0_0_20px_#ff001c] animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-0 w-full h-[1px] bg-red-500 shadow-[0_0_20px_#ff001c] animate-pulse delay-2000" />
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 🔒 9. TEAM HEADQUARTERS: Heavy concrete slate, neon logos & banners
// -------------------------------------------------------------
function TeamHeadquartersBackground({ quality }: { quality: VisualQuality }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505]">
      {/* Linear abstract spotlight on center logo area */}
      <div className="absolute top-[-20%] left-1/4 w-[50%] h-[140%] bg-radial-gradient from-red-650/4 to-transparent pointer-events-none" />
      {quality !== "eco" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(209,0,31,0.06),transparent_60%)] pointer-events-none" />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 👑 10. GLOBAL OPERATIONS / PORTAL: Futuristic Command screens & cyber grids
// -------------------------------------------------------------
function GlobalOperationsBackground({ quality }: { quality: VisualQuality }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Futuristic glowing operations room
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(209, 0, 31, 0.035)";
      ctx.lineWidth = 1;
      const scale = 50;
      for (let x = 0; x < width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Live activity streams (glowing rings around center)
      if (quality !== "eco") {
        ctx.strokeStyle = "rgba(209, 0, 31, 0.08)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 220, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 380, 0, Math.PI * 2);
        ctx.setLineDash([5, 15]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [quality]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// -------------------------------------------------------------
// 11. GENERIC AMBIENT: Base fallback layout
// -------------------------------------------------------------
function GenericAmbientBackground({ quality }: { quality: VisualQuality }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505]">
      {quality !== "eco" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(209,0,31,0.04),transparent_50%)] pointer-events-none" />
      )}
    </div>
  );
}
