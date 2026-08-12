import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string; description?: string }[];
}

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Hysteresis avoids a "nervous" header toggling around the threshold.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setScrolled((prev) => (prev ? window.scrollY > 12 : window.scrollY > 40));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const navLinks: NavItem[] = [
    { href: "/sindicos", label: "Encontrar um síndico" },
    { href: "/sou-sindico", label: "Sou síndico" },
    {
      href: "/solucoes",
      label: "Soluções",
      children: [
        { href: "/solucoes/match", label: "Q1S Match", description: "Diagnóstico + shortlist" },
        { href: "/solucoes/executive-search", label: "Executive Search", description: "Recrutamento dedicado" },
        { href: "/solucoes/check", label: "Q1S Check", description: "Auditoria de candidatos" },
        { href: "/solucoes/referencias", label: "Q1S Referências", description: "Banco de perfis validados" },
      ],
    },
    { href: "/como-funciona", label: "Como funciona" },
    { href: "/especialidades", label: "Especialidades" },
    { href: "/conteudo", label: "Conteúdo" },
    { href: "/quem-somos", label: "Quem somos" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-background shadow-[0_1px_0_hsl(var(--border)/0.6),0_12px_30px_-22px_hsl(var(--foreground)/0.35)]"
          : "bg-background"
      }`}
    >
      <div
        className={`container flex items-center justify-between gap-8 transition-[height] duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link to="/" className="flex items-baseline gap-1 group shrink-0">
          <span
            className="text-xl tracking-tight text-foreground/90 transition-colors duration-300 group-hover:text-primary"
            style={{ fontWeight: 380 }}
          >
            Quero
          </span>
          <span
            className="text-xl tracking-tight text-primary transition-colors duration-300 group-hover:text-foreground"
            style={{ fontWeight: 500 }}
          >
            1síndico
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-5 2xl:gap-7">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.href} className="relative group">
                <button
                  className="relative flex items-center gap-1 text-[13px] tracking-wide whitespace-nowrap transition-colors duration-300 hover:text-foreground text-muted-foreground"
                  style={{ fontWeight: 420 }}
                >
                  {link.label}
                  <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="rounded-xl border border-border/30 bg-background/95 backdrop-blur-2xl shadow-xl p-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-[13px] text-foreground" style={{ fontWeight: 450 }}>{child.label}</p>
                        {child.description && (
                          <p className="text-[11px] text-muted-foreground/60" style={{ fontWeight: 390 }}>{child.description}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-[13px] tracking-wide whitespace-nowrap transition-colors duration-300 hover:text-foreground ${
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                }`}
                style={{ fontWeight: 420 }}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            )
          )}
        </nav>

        <div className="hidden xl:flex items-center gap-2 shrink-0 pl-2">
          <Button asChild variant="ghost" size="sm" className="px-4 h-9 text-[12.5px] rounded-full text-muted-foreground hover:text-foreground" style={{ fontWeight: 430 }}>
            <Link to="/meu-perfil">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="px-5 h-9 text-[12.5px] rounded-full" style={{ fontWeight: 450 }}>
            <Link to="/diagnostico">Encontrar meu síndico</Link>
          </Button>
        </div>

        <button
          className="xl:hidden p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu de navegação"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-4 space-y-0.5">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.href} className="py-2">
                    <p className="text-sm text-foreground/60 px-3 mb-1" style={{ fontWeight: 420 }}>{link.label}</p>
                    <div className="space-y-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm text-muted-foreground transition-colors py-2 px-3 pl-5 rounded-lg hover:bg-muted/40"
                          style={{ fontWeight: 420 }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm transition-colors py-2.5 px-3 rounded-lg ${
                      isActive(link.href) ? "text-foreground bg-muted/40" : "text-muted-foreground"
                    }`}
                    style={{ fontWeight: 420 }}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-3 space-y-2">
                <Button asChild variant="outline" className="w-full h-10 rounded-full text-sm" style={{ fontWeight: 430 }}>
                  <Link to="/meu-perfil" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
                </Button>
                <Button asChild className="w-full h-10 rounded-full text-sm" style={{ fontWeight: 450 }}>
                  <Link to="/diagnostico" onClick={() => setMobileMenuOpen(false)}>Encontrar meu síndico</Link>
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
