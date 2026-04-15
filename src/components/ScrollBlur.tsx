import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollBlur() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40"
      aria-hidden="true"
    >
      <div className="w-full h-full bg-gradient-to-t from-background via-background/60 to-transparent backdrop-blur-sm" />
    </motion.div>
  );
}
