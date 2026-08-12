import { useEffect, useRef } from "react";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";

/** Thin reading-progress bar for long-form articles. */
export function ReadingProgress({ targetId }: { targetId?: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const target = targetId ? document.getElementById(targetId) : document.body;
    if (!target) return;

    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = target.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: target, start: "top top", end: "bottom bottom", scrub: 0.25 },
        }
      );
    });
    return () => ctx.revert();
  }, [targetId]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left bg-primary/70 will-change-transform" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
