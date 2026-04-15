import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, UserCheck, MessageCircle, Building2, Shield, Star, Zap } from "lucide-react";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const steps = [
  {
    icon: <Search size={24} />,
    title: "Pesquise profissionais",
    description: "Utilize os filtros por cidade, região, especialidade e perfil para encontrar síndicos que atendam às necessidades do seu condomínio.",
  },
  {
    icon: <UserCheck size={24} />,
    title: "Compare perfis detalhados",
    description: "Analise resumo profissional, áreas de atuação, tempo de experiência, especialidades e certificações de cada síndico.",
  },
  {
    icon: <MessageCircle size={24} />,
    title: "Entre em contato direto",
    description: "Converse diretamente com o profissional via WhatsApp. Sem intermediários, sem burocracia, sem custos.",
  },
];

const audiences = [
  { icon: <Building2 size={20} />, title: "Moradores", description: "Encontre o síndico ideal para garantir valorização e boa gestão do seu patrimônio." },
  { icon: <Shield size={20} />, title: "Conselheiros", description: "Compare profissionais qualificados para recomendar na próxima assembleia." },
  { icon: <Star size={20} />, title: "Síndicos", description: "Cadastre-se gratuitamente e amplie sua visibilidade para novos condomínios." },
  { icon: <Zap size={20} />, title: "Zeladores", description: "Indique a plataforma para o conselho e facilite a transição profissional." },
];

export default function ComoFunciona() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section ref={heroRef} className="relative gradient-hero py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <motion.div style={{ opacity: heroOpacity }} className="container relative">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl mx-auto text-center">
            <motion.p variants={fadeUp} className="text-[11px] text-secondary-foreground/50 tracking-widest uppercase mb-4">Como funciona</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl text-secondary-foreground mb-4 tracking-tight leading-tight" style={{ fontWeight: 450 }}>
              Encontrar o síndico ideal nunca foi tão simples
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-secondary-foreground/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Do primeiro filtro ao contato direto pelo WhatsApp — tudo em poucos minutos, sem custos e sem burocracia.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-0">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-6 md:gap-8 relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-14 w-px h-[calc(100%-2rem)] bg-border/30" />
                )}
                <div className="shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="pb-12">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-primary/60 tracking-widest uppercase">Passo {i + 1}</span>
                  </div>
                  <h3 className="text-lg text-foreground mb-2 tracking-tight" style={{ fontWeight: 450 }}>{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Audiences */}
      <section className="py-20 md:py-28 bg-muted/15">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-[11px] text-primary tracking-widest uppercase mb-2">Para quem é</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-tight" style={{ fontWeight: 450 }}>
              Uma plataforma para todo o ecossistema condominial
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {audiences.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                className="bg-card rounded-2xl p-6 border border-border/20 hover:border-primary/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-foreground text-sm mb-1.5" style={{ fontWeight: 450 }}>{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl text-foreground mb-3 tracking-tight" style={{ fontWeight: 450 }}>
              Pronto para encontrar seu síndico?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-sm text-muted-foreground mb-7 max-w-md mx-auto leading-relaxed">
              Explore os perfis disponíveis ou cadastre-se como profissional e amplie sua visibilidade.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="rounded-full px-7 h-11 text-sm gap-1.5">
                  <Link to="/sindicos">
                    Buscar síndicos
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="rounded-full px-7 h-11 text-sm border-border/30">
                  <Link to="/cadastro">Sou síndico profissional</Link>
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
