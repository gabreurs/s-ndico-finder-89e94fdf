import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/como-funciona", label: "Como funciona" },
    { href: "/sindicos", label: "Síndicos" },
    { href: "/quem-somos", label: "Quem somos" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-2xl border-b border-border/10">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-0.5 group">
          <span className="text-lg tracking-tight text-foreground" style={{ fontWeight: 350 }}>Quero</span>
          <span className="text-lg tracking-tight text-primary" style={{ fontWeight: 420 }}>1síndico</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-[13px] tracking-wide transition-colors duration-300 hover:text-foreground ${
                isActive(link.href) ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{ fontWeight: 380 }}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-[19px] left-0 right-0 h-[1.5px] bg-primary/60 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm" className="px-5 h-8 text-[12px] rounded-full" style={{ fontWeight: 420 }}>
            <Link to="/cadastro">Cadastre-se</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
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
            className="lg:hidden border-t border-border/10 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-4 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm transition-colors py-2.5 px-3 rounded-lg ${
                    isActive(link.href) ? "text-foreground bg-muted/40" : "text-muted-foreground"
                  }`}
                  style={{ fontWeight: 380 }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3">
                <Button asChild className="w-full h-10 rounded-full text-sm" style={{ fontWeight: 420 }}>
                  <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>Cadastre-se</Link>
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
