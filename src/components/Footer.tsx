import { Link } from "react-router-dom";
import { Youtube, Linkedin, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-purple-dark text-secondary-foreground">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-0.5 mb-3">
              <span className="text-lg text-cyan">Síndico</span>
              <span className="text-lg text-primary">Lab</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Conectando condomínios aos melhores profissionais do mercado.
            </p>
          </div>

          <div>
            <h4 className="text-sm mb-3 text-secondary-foreground/80">Plataforma</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><Link to="/como-funciona" className="hover:text-primary transition-colors">Como funciona</Link></li>
              <li><Link to="/sindicos" className="hover:text-primary transition-colors">Síndicos</Link></li>
              <li><Link to="/cadastro" className="hover:text-primary transition-colors">Cadastre-se</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm mb-3 text-secondary-foreground/80">SíndicoLab</h4>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li><a href="https://sindicolab.com.br/programas" className="hover:text-primary transition-colors">Programas</a></li>
              <li><a href="https://sindicolab.com.br/cursos" className="hover:text-primary transition-colors">Cursos</a></li>
              <li><a href="https://sindicolab.com.br/noticias" className="hover:text-primary transition-colors">Notícias</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm mb-3 text-secondary-foreground/80">Contato</h4>
            <a href="mailto:ola@queroumsindico.com" className="text-sm text-primary hover:underline">
              ola@queroumsindico.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Quero 1 Síndico — um produto SíndicoLab
          </p>
          
          <div className="flex items-center gap-1">
            {[
              { icon: Youtube, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Instagram, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className="p-2 rounded-full text-muted-foreground hover:text-primary transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-whatsapp flex items-center justify-center hover:scale-105 transition-transform z-50"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="text-primary-foreground" size={22} />
      </a>
    </footer>
  );
}
