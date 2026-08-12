import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { ensureGsap, prefersReducedMotion } from "@/lib/motion";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

/**
 * Single source of truth for scrolling:
 * Lenis drives the page, GSAP's ticker drives Lenis, ScrollTrigger listens to Lenis.
 * One RAF loop only. Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();

    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    // Suavização curta: o scroll acompanha a roda quase 1:1 (durações maiores
    // dão sensação de lag/atraso, principalmente no topo da página).
    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: true,
      syncTouch: false, // keep native, predictable touch scrolling
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Late-loading images / fonts can shift trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts;
    fontsReady?.ready.then(refresh).catch(() => undefined);

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.clearTimeout(resizeTimer);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // After a route change the DOM is new: reset scroll and recompute triggers.
  useEffect(() => {
    const { ScrollTrigger } = ensureGsap();
    lenisInstance?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
