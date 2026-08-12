import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({ children, className, reverse = false, speed = "normal" }: MarqueeProps) {
  const speedMap = { slow: "60s", normal: "40s", fast: "22s" };
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className={cn("overflow-hidden select-none", className)} aria-hidden="true">
      <div
        className="flex w-max"
        style={{
          animation: reduced ? undefined : `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: visible ? "running" : "paused",
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
