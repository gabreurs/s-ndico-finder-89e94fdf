import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollBlur() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 0.7, 0.7, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-40"
      aria-hidden="true"
    >
      <div className="w-full h-full bg-gradient-to-t from-background via-background/40 to-transparent" />
    </motion.div>
  );
}
