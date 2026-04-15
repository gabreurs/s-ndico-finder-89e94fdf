import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"forming" | "hold" | "exit">("forming");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Create text particles
    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 640;
    const fontSize = isMobile ? 28 : W < 1024 ? 42 : 56;
    const lineGap = fontSize * 1.3;

    // Render text to get pixel positions
    const offscreen = document.createElement("canvas");
    offscreen.width = W * dpr;
    offscreen.height = H * dpr;
    const octx = offscreen.getContext("2d")!;
    octx.scale(dpr, dpr);
    octx.fillStyle = "#fff";
    octx.font = `380 ${fontSize}px "Mona Sans", system-ui, sans-serif`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";

    const line1 = "Quer 1síndico?";
    const line2 = "Te ajudamos com isso.";
    const cy = H / 2;

    octx.fillText(line1, W / 2, cy - lineGap / 2);
    octx.fillText(line2, W / 2, cy + lineGap / 2);

    const imageData = octx.getImageData(0, 0, W * dpr, H * dpr);
    const pixels = imageData.data;

    const step = isMobile ? 4 : 3;
    interface Particle {
      tx: number; ty: number;
      x: number; y: number;
      alpha: number;
      targetAlpha: number;
      size: number;
      delay: number;
      speed: number;
    }

    const particles: Particle[] = [];
    for (let y = 0; y < H * dpr; y += step) {
      for (let x = 0; x < W * dpr; x += step) {
        const i = (y * W * dpr + x) * 4;
        if (pixels[i + 3] > 128) {
          const tx = x / dpr;
          const ty = y / dpr;
          const dist = Math.hypot(tx - W / 2, ty - cy);
          particles.push({
            tx, ty,
            x: tx + (Math.random() - 0.5) * 300,
            y: ty + (Math.random() - 0.5) * 200 + Math.random() * 60,
            alpha: 0,
            targetAlpha: 0.6 + Math.random() * 0.4,
            size: 1 + Math.random() * 0.8,
            delay: dist * 0.002 + Math.random() * 0.4,
            speed: 0.015 + Math.random() * 0.015,
          });
        }
      }
    }

    let startTime = performance.now();
    let currentPhase = "forming";

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, W, H);

      let allSettled = true;

      for (const p of particles) {
        const t = Math.max(0, elapsed - p.delay);

        if (currentPhase === "forming") {
          const progress = Math.min(1, t * p.speed * 60);
          const ease = 1 - Math.pow(1 - progress, 3);
          p.x += (p.tx - p.x) * (p.speed * 2 + ease * 0.08);
          p.y += (p.ty - p.y) * (p.speed * 2 + ease * 0.08);
          p.alpha += (p.targetAlpha - p.alpha) * 0.04;

          if (Math.abs(p.x - p.tx) > 0.5 || Math.abs(p.y - p.ty) > 0.5) {
            allSettled = false;
          }
        } else if (currentPhase === "exit") {
          p.x += (Math.random() - 0.5) * 2;
          p.y -= Math.random() * 1.5;
          p.alpha *= 0.96;
        }

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = `hsl(215, 60%, ${70 + Math.random() * 15}%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (currentPhase === "forming" && allSettled && elapsed > 1.5) {
        currentPhase = "hold";
        setPhase("hold");
        setTimeout(() => {
          currentPhase = "exit";
          setPhase("exit");
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 900);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "hsl(220, 25%, 4%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.06] blur-[180px]" />

          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Overlay text for legibility during hold */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "hold" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-[28px] sm:text-[42px] lg:text-[56px] text-white/90 text-center leading-[1.3] tracking-[-0.03em]"
              style={{ fontWeight: 380, fontFamily: "'Mona Sans', system-ui, sans-serif" }}
            >
              Quer 1síndico?
            </h1>
            <p
              className="text-[28px] sm:text-[42px] lg:text-[56px] text-white/90 text-center leading-[1.3] tracking-[-0.03em]"
              style={{ fontWeight: 380, fontFamily: "'Mona Sans', system-ui, sans-serif" }}
            >
              Te ajudamos com isso.
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[9999]"
          style={{ background: "hsl(220, 25%, 4%)" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
