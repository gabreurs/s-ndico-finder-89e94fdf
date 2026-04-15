import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ComoFunciona() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="gradient-hero py-14 md:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-2xl"
          >
            <h1 className="text-2xl md:text-3xl text-secondary-foreground mb-3 tracking-tight" style={{ fontWeight: 500 }}>
              Nossa plataforma simplifica o processo de encontrar o síndico ideal.
            </h1>
            <p className="text-secondary-foreground/70 text-sm">
              Conheça como funciona o Quero 1 Síndico e comece a usar.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container max-w-3xl">
          <h2 className="text-xl text-primary mb-4 tracking-tight" style={{ fontWeight: 500 }}>
            Perguntas frequentes
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            A seleção do síndico adequado para liderar e administrar o condomínio é de extrema importância. Nossa plataforma foi desenvolvida para atender às necessidades dos síndicos e dos empregadores que buscam otimizar seu tempo.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-muted/20">
        <div className="container max-w-3xl">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Gerenciar um condomínio é uma responsabilidade complexa. Estamos aqui para oferecer suporte. Se surgirem dúvidas, entre em contato pelo WhatsApp.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="sm" className="gap-1.5 bg-green-whatsapp hover:bg-green-whatsapp/90 rounded-full">
              <MessageCircle size={14} />
              Entre em contato
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
