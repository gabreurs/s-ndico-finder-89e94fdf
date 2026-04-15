import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({ children, className, reverse = false, speed = "normal" }: MarqueeProps) {
  const speedMap = { slow: "50s", normal: "30s", fast: "18s" };

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden="true">
      <div
        className="flex w-max gap-8"
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
