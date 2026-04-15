import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Patrocinadores() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="gradient-hero py-14 md:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl md:text-3xl text-secondary-foreground mb-2 tracking-tight" style={{ fontWeight: 450 }}>
              Patrocinadores
            </h1>
            <p className="text-secondary-foreground/60 text-sm">Empresas que acreditam na gestão condominial profissional.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Em breve você poderá conhecer nossos patrocinadores e parceiros que apoiam o Quero 1 Síndico e o ecossistema condominial.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
