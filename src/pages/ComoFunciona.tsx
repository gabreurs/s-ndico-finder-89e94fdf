import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-secondary-foreground">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">
                Nossa plataforma simplifica o processo de encontrar o síndico ideal para o seu condomínio.
              </h1>
              <a href="#video" className="inline-flex items-center gap-2 text-secondary-foreground hover:underline">
                Assista o vídeo ao lado →
              </a>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-purple-dark/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[20px] border-l-secondary-foreground border-y-[12px] border-y-transparent ml-1" />
                </div>
              </div>
              <p className="absolute bottom-4 left-4 text-secondary-foreground text-sm">
                Conquiste novos<br />
                <span className="text-primary font-semibold">condomínios!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground mb-8">
            A seleção do síndico adequado para liderar e administrar o condomínio é de extrema importância. Estamos comprometidos em auxiliá-lo nesse processo. Nossa plataforma foi pensada e desenvolvida para atender às necessidades dos síndicos e dos empregadores de síndicos que buscam otimizar seu tempo e alcançar sucesso nessa etapa crucial. Esclareça suas principais dúvidas e comece a utilizar nossa plataforma!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container max-w-4xl">
          <p className="text-muted-foreground mb-6">
            Gerenciar um condomínio é uma responsabilidade complexa que demanda habilidades administrativas e conhecimento especializado para enfrentar os desafios do dia a dia. Estamos aqui para oferecer suporte em todas as frentes. Se surgirem dúvidas, não hesite em entrar em contato conosco através do nosso canal no WhatsApp. Estamos prontos para ajudar.
          </p>
          <Button className="gap-2 bg-green-whatsapp hover:bg-green-whatsapp/90">
            <MessageCircle size={18} />
            Entre em contato
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
