import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "INÍCIO" },
    { href: "/como-funciona", label: "COMO FUNCIONA" },
    { href: "/sindicos", label: "SÍNDICOS" },
    { href: "/patrocinadores", label: "PATROCINADORES" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-foreground tracking-tight">Quero</span>
          <span className="text-2xl font-extrabold text-primary tracking-tight">1síndico</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-sm font-semibold tracking-wide transition-colors hover:text-primary ${
                isActive(link.href) 
                  ? "text-primary after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full" 
                  : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button 
            asChild 
            className="px-6 h-11 text-sm font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Link to="/cadastro">Cadastre-se</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-background p-6 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-semibold transition-colors hover:text-primary py-2 ${
                isActive(link.href) ? "text-primary" : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full h-12 rounded-full mt-4">
            <Link to="/cadastro" onClick={() => setMobileMenuOpen(false)}>
              Cadastre-se
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
