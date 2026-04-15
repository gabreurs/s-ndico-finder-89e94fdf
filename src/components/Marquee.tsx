import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({ children, className, reverse = false, speed = "normal" }: MarqueeProps) {
  const speedMap = { slow: "60s", normal: "40s", fast: "22s" };

  return (
    <div className={cn("overflow-hidden select-none", className)} aria-hidden="true">
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${speedMap[speed]} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
