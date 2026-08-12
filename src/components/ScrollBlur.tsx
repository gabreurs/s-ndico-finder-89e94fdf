export function ScrollBlur() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 h-20 md:h-24 pointer-events-none z-40"
      aria-hidden="true"
      style={{
        background: 'linear-gradient(to top, hsl(220 28% 6% / 0.58) 0%, hsl(220 28% 6% / 0.22) 46%, transparent 100%)',
      }}
    />
  );
}
