import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { SpinBadge } from "./SpinBadge";

export function Footer() {
  return (
    <footer className="relative">
      {/* Top gradient transition */}
      <div className="h-24 bg-gradient-to-b from-background to-[hsl(220,25%,5%)]" />

      <div className="bg-[hsl(220,25%,5%)] text-white/80">
        <div className="container py-14 relative">
          {/* Spinning badge */}
          <div className="absolute top-8 right-8 hidden lg:block">
            <SpinBadge size={72} color="rgba(255,255,255,0.08)" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-baseline gap-0.5 mb-3">
                <span className="text-base text-white/60" style={{ fontWeight: 380 }}>Quero</span>
                <span className="text-base text-primary/80" style={{ fontWeight: 480 }}>1síndico</span>
              </div>
              <p className="text-[12px] text-white/30 leading-relaxed mb-4 max-w-[240px]" style={{ fontWeight: 400 }}>
                A plataforma que conecta condomínios aos melhores síndicos profissionais de São Paulo.
              </p>
              <p className="text-[10px] text-white/15 tracking-widest uppercase" style={{ fontWeight: 440 }}>
                Powered by SíndicoLab
              </p>
            </div>

            <div>
              <h4 className="text-[11px] mb-4 text-white/20 tracking-widest uppercase" style={{ fontWeight: 460 }}>Plataforma</h4>
              <ul className="space-y-2.5">
                {[
                  { to: "/como-funciona", label: "Como funciona" },
                  { to: "/sindicos", label: "Síndicos" },
                  { to: "/cadastro", label: "Cadastre-se" },
                  { to: "/quem-somos", label: "Quem somos" },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-[13px] text-white/35 hover:text-primary/80 transition-colors duration-300" style={{ fontWeight: 410 }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] mb-4 text-white/20 tracking-widest uppercase" style={{ fontWeight: 460 }}>SíndicoLab</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "https://sindicolab.com.br/programas", label: "Programas" },
                  { href: "https://sindicolab.com.br/cursos", label: "Cursos" },
                  { href: "https://sindicolab.com.br/noticias", label: "Notícias" },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-[13px] text-white/35 hover:text-primary/80 transition-colors duration-300" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 410 }}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] mb-4 text-white/20 tracking-widest uppercase" style={{ fontWeight: 460 }}>Contato</h4>
              <a href="mailto:ola@queroumsindico.com" className="text-[13px] text-primary/60 hover:text-primary transition-colors duration-300" style={{ fontWeight: 420 }}>
                ola@queroumsindico.com
              </a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/20" style={{ fontWeight: 390 }}>
              © {new Date().getFullYear()} Quero 1 Síndico — Powered by SíndicoLab
            </p>
          </div>
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
