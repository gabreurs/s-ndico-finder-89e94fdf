import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SolucoesQ1S } from "@/components/SolucoesQ1S";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Solucoes() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Soluções Quero 1 Síndico — match, executive search e auditoria"
        description="Quatro camadas de serviço para escolher um síndico profissional: Q1S Match, Executive Search, Q1S Check e Q1S Referências."
        path="/solucoes"
      />
      <Header />

      <section className="gradient-mesh py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[320px] h-[320px] rounded-full bg-primary/[0.05] blur-[110px]" />
        <div className="container relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <PageBreadcrumb items={[{ label: "Soluções" }]} variant="dark" className="mb-6" />
            <h1 className="text-3xl md:text-4xl text-white/95 leading-[1.1] tracking-[-0.02em] mb-5" style={{ fontWeight: 340 }}>
              Soluções Quero 1 Síndico
            </h1>
            <p className="text-white/35 text-sm md:text-base leading-relaxed mb-8" style={{ fontWeight: 400 }}>
              Cada condomínio chega em um estágio diferente da decisão. Escolha a camada de serviço adequada ao seu momento — do diagnóstico automático ao recrutamento dedicado.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                <Link to="/diagnostico">
                  Não sei por onde começar
                  <ArrowRight size={14} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6 h-12 text-[13px] border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent"
                style={{ fontWeight: 430 }}
              >
                <Link to="/sindicos">Buscar síndicos direto</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SolucoesQ1S />

      <Footer />
    </div>
  );
}
