import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, Shield, Target, Sparkles } from "lucide-react";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const values = [
  { icon: <Target className="w-5 h-5" />, title: "Curadoria real", desc: "Cada profissional passa por análise e aprovação. Não somos um diretório genérico — somos uma plataforma curada." },
  { icon: <Users className="w-5 h-5" />, title: "Para todo o ecossistema", desc: "Moradores, conselheiros, zeladores e síndicos se encontram em um único lugar, com ferramentas pensadas para cada público." },
  { icon: <Shield className="w-5 h-5" />, title: "Transparência total", desc: "Perfis detalhados com experiência, especialidades e contato direto. Sem intermediários, sem taxas, sem surpresas." },
  { icon: <Sparkles className="w-5 h-5" />, title: "Visibilidade qualificada", desc: "Para o síndico profissional, a plataforma é vitrine e ferramenta de posicionamento. Contatos que chegam são qualificados." },
];

export default function QuemSomos() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center gradient-mesh overflow-hidden">
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[120px]" />
        
        <motion.div style={{ opacity: heroOpacity }} className="container relative py-24 md:py-32">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.p variants={fadeUp} className="text-[11px] text-white/25 tracking-[0.2em] uppercase mb-6" style={{ fontWeight: 380 }}>
              Quem somos
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl text-white/90 leading-[1.1] tracking-[-0.025em] mb-6" style={{ fontWeight: 300 }}>
              Acreditamos na gestão condominial{" "}
              <span className="text-primary" style={{ fontWeight: 380 }}>profissional</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-white/30 text-base md:text-lg max-w-lg leading-relaxed" style={{ fontWeight: 350 }}>
              O Quero 1 Síndico nasceu para facilitar a conexão entre condomínios e síndicos qualificados — com curadoria, transparência e zero burocracia.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-5 gap-12 lg:gap-20"
          >
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <p className="text-[11px] text-primary/60 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 420 }}>Nossa proposta</p>
              <h2 className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] leading-tight" style={{ fontWeight: 350 }}>
                Uma plataforma que resolve um problema real
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="lg:col-span-3 space-y-5">
              <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 370 }}>
                A gestão condominial no Brasil envolve milhares de condomínios que precisam de profissionais qualificados — e milhares de síndicos que buscam visibilidade e oportunidades. Mas essa conexão sempre foi informal, dependente de indicações esparsas e sem nenhuma estrutura.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 370 }}>
                O Quero 1 Síndico organiza esse mercado. Oferecemos uma curadoria de profissionais verificados, acessível gratuitamente a moradores, conselheiros e zeladores. Para síndicos profissionais, somos uma vitrine qualificada que gera contatos reais.
              </p>
              <p className="text-foreground/80 text-sm leading-relaxed" style={{ fontWeight: 400 }}>
                Powered by SíndicoLab, trazemos a credibilidade e a experiência de quem entende profundamente o ecossistema condominial brasileiro.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-24 md:py-32 section-dark relative overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]" />
        <div className="container relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
            <motion.p variants={fadeUp} className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 420 }}>O que nos move</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em]" style={{ fontWeight: 320 }}>
              Princípios que orientam a plataforma
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-6 md:p-8 group"
              >
                <div className="text-primary/40 mb-4 group-hover:text-primary/70 transition-colors duration-300">{v.icon}</div>
                <h3 className="text-white/80 text-sm mb-2" style={{ fontWeight: 420 }}>{v.title}</h3>
                <p className="text-white/25 text-[13px] leading-relaxed" style={{ fontWeight: 350 }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "100+", label: "Síndicos cadastrados" },
              { value: "10+", label: "Cidades atendidas" },
              { value: "0", label: "Custo para condomínios" },
              { value: "100%", label: "Contato direto" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="text-center">
                <p className="text-3xl md:text-4xl text-foreground tracking-tight mb-2" style={{ fontWeight: 300 }}>{stat.value}</p>
                <p className="text-[11px] text-muted-foreground tracking-widest uppercase" style={{ fontWeight: 380 }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 md:py-32 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
        <div className="container relative max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 320 }}>
              Faça parte dessa transformação
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-white/30 text-sm mb-8 leading-relaxed" style={{ fontWeight: 350 }}>
              Seja como morador buscando o melhor profissional, ou como síndico ampliando sua presença — estamos aqui para conectar.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="rounded-full px-7 h-11 text-[13px] gap-2" style={{ fontWeight: 420 }}>
                  <Link to="/sindicos">
                    Buscar síndicos
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="rounded-full px-7 h-11 text-[13px] border-white/10 text-white/60 hover:text-white bg-transparent" style={{ fontWeight: 400 }}>
                  <Link to="/cadastro">Cadastre-se como síndico</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
