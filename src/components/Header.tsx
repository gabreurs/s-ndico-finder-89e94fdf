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
    { href: "/patrocinadores", label: "Patrocinadores" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-0.5">
          <span className="text-xl text-foreground tracking-tight">Quero</span>
          <span className="text-xl text-primary tracking-tight" style={{ fontWeight: 600 }}>1síndico</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-[13px] tracking-wide transition-colors hover:text-primary ${
                isActive(link.href) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-[21px] left-0 right-0 h-px bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button 
            asChild 
            size="sm"
            className="px-5 h-9 text-xs rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link to="/cadastro">Cadastre-se</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm transition-colors hover:text-primary py-2.5 px-3 rounded-lg ${
                    isActive(link.href) ? "text-primary bg-primary/5" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Button asChild className="w-full h-10 rounded-full text-sm">
                  <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                    Cadastre-se
                  </Link>
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
