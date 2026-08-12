import { useEffect, useRef, type ElementType } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HeadlineRevealProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Trigger on scroll instead of on mount (mount = hero). */
  onScroll?: boolean;
  style?: React.CSSProperties;
  /** Words rendered in the accent color (exact match, case sensitive). */
  accentWords?: string[];
}

/**
 * Word-by-word mask reveal for high-impact headlines only.
 * Semantics are preserved: the full string stays in a single heading element.
 */
export function HeadlineReveal({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  onScroll = false,
  style,
  accentWords = [],
}: HeadlineRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-word]"),
        { yPercent: 108, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.045,
          delay,
          ...(onScroll
            ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
            : {}),
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, onScroll]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <span
            data-word
            className={cn("inline-block will-change-transform", accentWords.includes(word) && "text-primary")}
            style={accentWords.includes(word) ? { fontWeight: 460 } : undefined}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
