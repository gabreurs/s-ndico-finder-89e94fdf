import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="section-dark text-secondary-foreground/80">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-baseline gap-0.5 mb-3">
              <span className="text-base text-secondary-foreground/70" style={{ fontWeight: 350 }}>Quero</span>
              <span className="text-base text-primary/80" style={{ fontWeight: 420 }}>1síndico</span>
            </div>
            <p className="text-xs text-muted-foreground/60 leading-relaxed mb-4 max-w-[240px]">
              A plataforma que conecta condomínios aos melhores síndicos profissionais de São Paulo.
            </p>
            <p className="text-[10px] text-muted-foreground/30 tracking-widest uppercase">
              Powered by SíndicoLab
            </p>
          </div>

          <div>
            <h4 className="text-[11px] mb-4 text-secondary-foreground/30 tracking-widest uppercase" style={{ fontWeight: 420 }}>Plataforma</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/como-funciona", label: "Como funciona" },
                { to: "/sindicos", label: "Síndicos" },
                { to: "/cadastro", label: "Cadastre-se" },
                { to: "/quem-somos", label: "Quem somos" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[13px] text-muted-foreground/50 hover:text-primary/80 transition-colors duration-300" style={{ fontWeight: 380 }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] mb-4 text-secondary-foreground/30 tracking-widest uppercase" style={{ fontWeight: 420 }}>SíndicoLab</h4>
            <ul className="space-y-2.5">
              {[
                { href: "https://sindicolab.com.br/programas", label: "Programas" },
                { href: "https://sindicolab.com.br/cursos", label: "Cursos" },
                { href: "https://sindicolab.com.br/noticias", label: "Notícias" },
              ].map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-[13px] text-muted-foreground/50 hover:text-primary/80 transition-colors duration-300" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 380 }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] mb-4 text-secondary-foreground/30 tracking-widest uppercase" style={{ fontWeight: 420 }}>Contato</h4>
            <a href="mailto:ola@queroumsindico.com" className="text-[13px] text-primary/70 hover:text-primary transition-colors duration-300" style={{ fontWeight: 380 }}>
              ola@queroumsindico.com
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/30" style={{ fontWeight: 350 }}>
            © {new Date().getFullYear()} Quero 1 Síndico — Powered by SíndicoLab
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[hsl(var(--green-whatsapp))] flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50 shadow-xl shadow-[hsl(var(--green-whatsapp))]/20"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="text-white" size={22} />
      </a>
    </footer>
  );
}
