export function ScrollBlur() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-40"
      aria-hidden="true"
      style={{
        background: 'linear-gradient(to top, hsl(220 25% 4% / 0.7) 0%, hsl(220 25% 4% / 0.3) 40%, transparent 100%)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
      }}
    />
  );
}
