import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const FORM_DURATION = 1200;
const HOLD_DURATION = 650;
const EXIT_DURATION = 700;

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"forming" | "hold" | "exit">("forming");
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const completedRef = useRef(false);

  const finishIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    const formMs = shouldReduceMotion ? 300 : FORM_DURATION;
    const holdMs = shouldReduceMotion ? 350 : HOLD_DURATION;
    const exitMs = shouldReduceMotion ? 380 : EXIT_DURATION;

    const holdTimer = window.setTimeout(() => setPhase("hold"), formMs);
    const exitTimer = window.setTimeout(() => setPhase("exit"), formMs + holdMs);
    const completeTimer = window.setTimeout(finishIntro, formMs + holdMs + exitMs);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setParticlesEnabled(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      setParticlesEnabled(false);
      return;
    }

    let cancelled = false;

    const initParticles = async () => {
      try {
        if ("fonts" in document) {
          await document.fonts.ready;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width < 768;
        const fontSize = isMobile ? 32 : width < 1200 ? 54 : 72;
        const lineGap = fontSize * 1.22;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const offscreen = document.createElement("canvas");
        offscreen.width = width * dpr;
        offscreen.height = height * dpr;
        const octx = offscreen.getContext("2d");

        if (!octx) {
          setParticlesEnabled(false);
          return;
        }

        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        octx.clearRect(0, 0, width, height);
        octx.fillStyle = "#ffffff";
        octx.font = `360 ${fontSize}px "Mona Sans", system-ui, sans-serif`;
        octx.textAlign = "center";
        octx.textBaseline = "middle";

        const line1 = "Quer 1síndico?";
        const line2 = "Te ajudamos com isso.";
        const centerY = height / 2;

        octx.fillText(line1, width / 2, centerY - lineGap / 2);
        octx.fillText(line2, width / 2, centerY + lineGap / 2);

        const { data } = octx.getImageData(0, 0, offscreen.width, offscreen.height);
        const step = isMobile ? 6 : 5;
        const particles: Array<{
          tx: number;
          ty: number;
          sx: number;
          sy: number;
          size: number;
          alpha: number;
          drift: number;
        }> = [];

        for (let y = 0; y < offscreen.height; y += step) {
          for (let x = 0; x < offscreen.width; x += step) {
            const i = (y * offscreen.width + x) * 4;
            if (data[i + 3] > 150) {
              const tx = x / dpr;
              const ty = y / dpr;
              particles.push({
                tx,
                ty,
                sx: tx + (Math.random() - 0.5) * (isMobile ? 120 : 220),
                sy: ty + (Math.random() - 0.5) * (isMobile ? 80 : 140) + (isMobile ? 12 : 20),
                size: isMobile ? 0.95 : 1.15,
                alpha: 0.18 + Math.random() * 0.42,
                drift: (Math.random() - 0.5) * 28,
              });
            }
          }
        }

        if (!particles.length) {
          setParticlesEnabled(false);
          return;
        }

        const totalDuration = FORM_DURATION + HOLD_DURATION + EXIT_DURATION;
        const startedAt = performance.now();

        const render = (now: number) => {
          if (cancelled) return;

          const elapsed = now - startedAt;
          const formProgress = Math.min(1, elapsed / FORM_DURATION);
          const easedForm = 1 - Math.pow(1 - formProgress, 3);
          const exitStart = FORM_DURATION + HOLD_DURATION;
          const exitProgress = elapsed > exitStart ? Math.min(1, (elapsed - exitStart) / EXIT_DURATION) : 0;

          ctx.clearRect(0, 0, width, height);

          for (const particle of particles) {
            const x = particle.sx + (particle.tx - particle.sx) * easedForm + particle.drift * exitProgress;
            const y = particle.sy + (particle.ty - particle.sy) * easedForm - 28 * exitProgress;
            const alpha = (0.08 + particle.alpha * easedForm) * (1 - exitProgress);

            ctx.fillStyle = `hsla(214, 88%, 73%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          }

          if (elapsed < totalDuration) {
            animFrameRef.current = requestAnimationFrame(render);
          }
        };

        animFrameRef.current = requestAnimationFrame(render);
      } catch {
        setParticlesEnabled(false);
      }
    };

    initParticles();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [shouldReduceMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
      initial={false}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(circle at 20% 18%, hsl(214 80% 18% / 0.18), transparent 28%), radial-gradient(circle at 80% 72%, hsl(216 72% 12% / 0.16), transparent 30%), hsl(220 28% 5%)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute top-1/2 left-1/2 h-[44vw] w-[44vw] min-h-[280px] min-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full ambient-glow" />

      {particlesEnabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          initial={false}
          animate={{
            opacity: phase === "forming" ? 0.46 : phase === "hold" ? 1 : 0,
            y: phase === "forming" ? 10 : phase === "hold" ? 0 : -6,
            scale: phase === "forming" ? 0.988 : phase === "hold" ? 1 : 1.012,
            filter: phase === "forming" ? "blur(10px)" : phase === "hold" ? "blur(0px)" : "blur(8px)",
          }}
          transition={{ duration: phase === "forming" ? 1.05 : 0.55, ease: "easeOut" }}
          className="max-w-5xl text-center"
        >
          {/* Splash decorativo: não é o H1 semântico da página (evita H1 duplicado em todas as rotas). */}
          <p
            aria-hidden="true"
            className="text-[clamp(2.1rem,6vw,4.8rem)] text-white/95 leading-[1.08] tracking-[-0.045em]"
            style={{ fontWeight: 360, fontFamily: "'Mona Sans', system-ui, sans-serif" }}
          >
            Quer 1síndico?<br />Te ajudamos com isso.
          </p>

          <motion.div
            initial={false}
            animate={{ opacity: phase === "hold" ? 1 : 0, scaleX: phase === "hold" ? 1 : 0.6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto mt-6 h-px w-24 bg-white/14"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
