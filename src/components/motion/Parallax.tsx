import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Total vertical travel in px across the scroll range. Keep it small. */
  amount?: number;
  /** Disabled below this breakpoint (mobile stays flat and cheap). */
  desktopOnly?: boolean;
}

export function Parallax({ children, className, amount = 60, desktopOnly = true }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(desktopOnly ? "(min-width: 1024px)" : "all", () => {
        const tween = gsap.fromTo(
          el,
          { yPercent: 0, y: -amount / 2, force3D: true },
          {
            y: amount / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [amount, desktopOnly]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
