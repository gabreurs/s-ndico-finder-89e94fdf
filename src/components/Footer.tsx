import { Link } from "react-router-dom";
import { Youtube, Linkedin, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[hsl(var(--purple-dark))] text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-0.5 mb-3">
              <span className="text-lg text-secondary-foreground/90" style={{ fontWeight: 400 }}>Quero</span>
              <span className="text-lg text-primary" style={{ fontWeight: 500 }}>1síndico</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Conectando condomínios aos melhores síndicos profissionais de São Paulo.
            </p>
            <p className="text-[10px] text-muted-foreground/60 tracking-wide uppercase">
              Powered by SíndicoLab
            </p>
          </div>

          <div>
            <h4 className="text-xs mb-3 text-secondary-foreground/70 tracking-wide uppercase">Plataforma</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><Link to="/como-funciona" className="hover:text-primary transition-colors">Como funciona</Link></li>
              <li><Link to="/sindicos" className="hover:text-primary transition-colors">Síndicos</Link></li>
              <li><Link to="/cadastro" className="hover:text-primary transition-colors">Cadastre-se</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs mb-3 text-secondary-foreground/70 tracking-wide uppercase">SíndicoLab</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><a href="https://sindicolab.com.br/programas" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Programas</a></li>
              <li><a href="https://sindicolab.com.br/cursos" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Cursos</a></li>
              <li><a href="https://sindicolab.com.br/noticias" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Notícias</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs mb-3 text-secondary-foreground/70 tracking-wide uppercase">Contato</h4>
            <a href="mailto:ola@queroumsindico.com" className="text-sm text-primary hover:underline">
              ola@queroumsindico.com
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} Quero 1 Síndico — Powered by SíndicoLab
          </p>
          
          <div className="flex items-center gap-1">
            {[
              { icon: Youtube, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Instagram, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className="p-2 rounded-full text-muted-foreground/50 hover:text-primary transition-colors" aria-label={`Rede social ${i + 1}`}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[hsl(var(--green-whatsapp))] flex items-center justify-center hover:scale-105 transition-transform z-50 shadow-lg"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="text-white" size={22} />
      </a>
    </footer>
  );
}
