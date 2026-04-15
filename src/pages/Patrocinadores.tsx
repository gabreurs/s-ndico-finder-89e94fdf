import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Patrocinadores() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-14 flex-1">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl text-foreground mb-3 tracking-tight" style={{ fontWeight: 500 }}>
              Patrocinadores
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Em breve você poderá conhecer nossos patrocinadores e parceiros que apoiam o Quero 1 Síndico.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
