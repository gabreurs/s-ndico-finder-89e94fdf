import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

interface SpinBadgeProps {
  text?: string;
  size?: number;
  className?: string;
  color?: string;
}

export function SpinBadge({
  text = "POWERED BY SÍNDICOLAB •",
  size = 100,
  className,
  color = "currentColor",
}: SpinBadgeProps) {
  const doubled = `${text} ${text}`;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // Stop burning CPU/GPU while the badge is off-screen.
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none select-none", className)}
      style={{
        width: size,
        height: size,
        animation: reduced ? undefined : "spin-slow 20s linear infinite",
        animationPlayState: visible ? "running" : "paused",
        willChange: visible ? "transform" : undefined,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <path
            id="spinCircle"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text
          fill={color}
          style={{ fontSize: "8px", fontFamily: "Mona Sans, system-ui", fontWeight: 440, letterSpacing: "2.5px" }}
        >
          <textPath href="#spinCircle">{doubled}</textPath>
        </text>
      </svg>
    </div>
  );
}
