import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "up" | "fade" | "mask" | "scale" | "clip";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Motion language — vary it so not everything "slides up". */
  variant?: Variant;
  /** Stagger direct children instead of the wrapper itself. */
  stagger?: boolean;
  delay?: number;
  as?: ElementType;
  start?: string;
}

const FROM: Record<Variant, gsap.TweenVars> = {
  up: { opacity: 0, y: 18 },
  fade: { opacity: 0 },
  mask: { opacity: 0, yPercent: 30 },
  scale: { opacity: 0, scale: 0.97 },
  clip: { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
};

const TO: Record<Variant, gsap.TweenVars> = {
  up: { opacity: 1, y: 0, duration: 0.6 },
  fade: { opacity: 1, duration: 0.5 },
  mask: { opacity: 1, yPercent: 0, duration: 0.8 },
  scale: { opacity: 1, scale: 1, duration: 0.7 },
  clip: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
};

export function Reveal({
  children,
  className,
  variant = "up",
  stagger = false,
  delay = 0,
  as: Tag = "div",
  start = "top 88%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      return;
    }

    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.fromTo(targets, FROM[variant], {
        ...TO[variant],
        delay,
        stagger: stagger ? 0.07 : 0,
        overwrite: "auto",
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, stagger, delay, start]);

  return (
    <Tag ref={ref} className={cn(variant === "mask" && "overflow-hidden", className)}>
      {children}
    </Tag>
  );
}
