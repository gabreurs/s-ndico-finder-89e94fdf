import { Link } from "react-router-dom";
import { Youtube, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-purple-dark text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan to-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div>
                <span className="text-lg font-bold text-cyan">SÍNDICO</span>
                <span className="text-lg font-bold text-primary">LAB</span>
              </div>
            </div>
          </div>

          {/* SíndicoLab */}
          <div>
            <h4 className="font-semibold mb-4">SíndicoLab</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://sindicolab.com.br/programas" className="hover:text-primary transition-colors">Programas</a></li>
              <li><a href="https://sindicolab.com.br/cursos" className="hover:text-primary transition-colors">Cursos</a></li>
              <li><a href="https://sindicolab.com.br/livros" className="hover:text-primary transition-colors">Livros</a></li>
              <li><a href="https://sindicolab.com.br/noticias" className="hover:text-primary transition-colors">Notícias</a></li>
            </ul>
          </div>

          {/* Quero 1 síndico */}
          <div>
            <h4 className="font-semibold mb-4">Quero 1 síndico</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/como-funciona" className="hover:text-primary transition-colors">Como Funciona</Link></li>
              <li><Link to="/sindicos" className="hover:text-primary transition-colors">Síndicos</Link></li>
            </ul>
          </div>

          {/* Patrocinadores */}
          <div>
            <h4 className="font-semibold mb-4">Patrocinadores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/patrocinadores" className="hover:text-primary transition-colors">Patrocinadores</Link></li>
            </ul>
          </div>

          {/* Ajuda + Contato */}
          <div>
            <h4 className="font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li><a href="mailto:ola@queroumsindico.com" className="hover:text-primary transition-colors">Fale conosco</a></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>

            <div className="bg-purple-darker rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Contato:</p>
              <a href="mailto:ola@queroumsindico.com" className="text-sm text-primary hover:underline">
                ola@queroumsindico.com
              </a>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-8 pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Quero 1 Síndico. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Acompanhe nossas redes</span>
            <a href="#" className="p-2 rounded-full hover:bg-secondary/20 transition-colors">
              <Youtube size={18} />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-secondary/20 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-secondary/20 transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="p-2 rounded-full hover:bg-secondary/20 transition-colors">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-whatsapp flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="text-primary-foreground" size={28} />
      </a>
    </footer>
  );
}
