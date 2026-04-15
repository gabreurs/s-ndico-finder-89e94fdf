import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollBlur() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 0.7, 0.7, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 h-36 pointer-events-none z-40"
      aria-hidden="true"
    >
      <div className="w-full h-full bg-gradient-to-t from-[hsl(220,25%,4%)] via-[hsl(220,25%,4%,0.6)] to-transparent" />
    </motion.div>
  );
}
