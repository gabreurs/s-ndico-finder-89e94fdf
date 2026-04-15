import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className={cn("pointer-events-none select-none", className)}
      style={{ width: size, height: size }}
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
    </motion.div>
  );
}
