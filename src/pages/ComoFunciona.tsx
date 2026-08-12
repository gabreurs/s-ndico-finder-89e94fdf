import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SpinBadge } from "@/components/SpinBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, UserCheck, MessageCircle, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import imgFiltros from "@/assets/como-funciona-1-filtros.webp";
import imgPerfis from "@/assets/como-funciona-2-perfis.webp";
import imgWhatsapp from "@/assets/como-funciona-3-whatsapp.webp";
import { Seo } from "@/components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    num: "01",
    icon: <Search size={24} />,
    image: imgFiltros,
    title: "Pesquise com filtros inteligentes",
    description: "Escolha cidade, região, tipo de condomínio e especialidade. A plataforma mostra apenas profissionais verificados e aprovados pela nossa curadoria.",
    detail: "Filtros por cidade, região, especialidade e tipo de condomínio",
  },
  {
    num: "02",
    icon: <UserCheck size={24} />,
    image: imgPerfis,
    title: "Compare perfis detalhados",
    description: "Cada profissional tem um perfil completo com resumo, áreas de atuação, experiência e especializações. Tudo para você tomar a melhor decisão.",
    detail: "Resumo profissional, experiência, certificações e diferenciais",
  },
  {
    num: "03",
    icon: <MessageCircle size={24} />,
    image: imgWhatsapp,
    title: "Converse direto pelo WhatsApp",
    description: "Sem intermediários, sem burocracia, sem custos. Você entra em contato direto com o profissional e negocia nos seus termos.",
    detail: "Contato direto, sem intermediários, 100% gratuito",
  },
];

const comparisons = [
  { old: "Indicação por boca a boca", new: "Curadoria com filtros avançados" },
  { old: "Poucos candidatos disponíveis", new: "Dezenas de perfis verificados" },
  { old: "Sem informações de experiência", new: "Perfis detalhados e transparentes" },
  { old: "Processo demorado e incerto", new: "Busca e contato em minutos" },
];

export default function ComoFunciona() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title={'Como funciona a Quero 1 Síndico'} description={'Do diagnóstico à checagem de referências: entenda as etapas do método Q1S para contratar um síndico profissional.'} path={'/como-funciona'} />
      <Header />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center gradient-mesh overflow-hidden">
        <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] rounded-full bg-accent/[0.04] blur-[100px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container relative py-24 md:py-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="lg:col-span-3">
              <motion.div variants={fadeUp} className="mb-6">
                <PageBreadcrumb items={[{ label: "Como funciona" }]} variant="dark" />
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl text-white/90 leading-[1.08] tracking-[-0.025em] mb-6" style={{ fontWeight: 300 }}>
                Do primeiro filtro ao{" "}
                <span className="text-primary" style={{ fontWeight: 460 }}>contato direto</span>{" "}
                — em poucos minutos
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-white/35 text-base md:text-lg max-w-lg leading-relaxed" style={{ fontWeight: 390 }}>
                Uma jornada simples, transparente e sem custos para encontrar o síndico ideal para o seu condomínio.
              </motion.p>
            </motion.div>

            <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
              <SpinBadge size={120} color="rgba(255,255,255,0.08)" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== JOURNEY STEPS ===== */}
      <section className="py-28 md:py-40">
        <div className="container max-w-6xl">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i < steps.length - 1 ? 'mb-28 md:mb-40' : ''}`}
            >
              <motion.div variants={fadeUp} className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="text-[100px] md:text-[140px] text-foreground/[0.04] leading-none block mb-[-50px] md:mb-[-70px]" style={{ fontWeight: 200 }}>
                  {step.num}
                </span>
                <div className="text-primary/60 mb-4">{step.icon}</div>
                <h3 className="text-xl md:text-2xl text-foreground tracking-[-0.02em] mb-4" style={{ fontWeight: 400 }}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4" style={{ fontWeight: 400 }}>
                  {step.description}
                </p>
                <p className="text-[11px] text-primary/60 tracking-wide" style={{ fontWeight: 450 }}>
                  {step.detail}
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={2}
                className={`aspect-[4/3] rounded-xl overflow-hidden border border-border/30 ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="py-28 md:py-36 section-dark relative overflow-hidden">
        <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]" />
        <div className="container max-w-5xl relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>Comparação</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-14" style={{ fontWeight: 320 }}>
              O jeito antigo versus a nova experiência
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass rounded-xl p-6 md:p-8"
            >
              <p className="text-[11px] text-white/20 tracking-[0.15em] uppercase mb-6" style={{ fontWeight: 450 }}>Processo tradicional</p>
              <div className="space-y-4">
                {comparisons.map((c, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="flex items-start gap-3">
                    <span className="text-white/15 mt-0.5 text-sm">✕</span>
                    <p className="text-white/30 text-sm" style={{ fontWeight: 400 }}>{c.old}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass rounded-xl p-6 md:p-8 border-primary/10"
            >
              <p className="text-[11px] text-primary/50 tracking-[0.15em] uppercase mb-6" style={{ fontWeight: 450 }}>Com Quero 1 Síndico</p>
              <div className="space-y-4">
                {comparisons.map((c, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-primary/60 mt-0.5 shrink-0" />
                    <p className="text-white/60 text-sm" style={{ fontWeight: 430 }}>{c.new}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 md:py-36">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-4" style={{ fontWeight: 350 }}>
              Pronto para encontrar seu síndico?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-sm mb-8 max-w-md leading-relaxed" style={{ fontWeight: 400 }}>
              Explore os perfis disponíveis ou cadastre-se como profissional e amplie sua visibilidade.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="rounded-full px-7 h-11 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                  <Link to="/sindicos">
                    Buscar síndicos
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="rounded-full px-7 h-11 text-[13px] border-border/30" style={{ fontWeight: 430 }}>
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
