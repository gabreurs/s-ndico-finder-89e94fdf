import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({ children, className, reverse = false, speed = "normal" }: MarqueeProps) {
  const speedMap = {
    slow: "60s",
    normal: "30s",
    fast: "15s",
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        className="flex w-max gap-6"
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
