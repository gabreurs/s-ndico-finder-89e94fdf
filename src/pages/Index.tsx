import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFilters } from "@/components/HeroFilters";
import { SindicoCard } from "@/components/SindicoCard";
import { Marquee } from "@/components/Marquee";
import { SpinBadge } from "@/components/SpinBadge";
import { useSindicos } from "@/hooks/useSindicos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Building2, Users, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroSp from "@/assets/hero-sp.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const SPECIALTIES_MARQUEE = [
  "Residencial Multitorres", "Condomínio Comercial", "Residencial Clube",
  "Condomínio Horizontal", "Torre Única", "Condomínio Misto",
  "Loteamento", "Condomínio Industrial", "Associação de Moradores",
];

const Index = () => {
  const [especialidade, setEspecialidade] = useState("all");
  const [cidade, setCidade] = useState("all");
  const [regiao, setRegiao] = useState("all");
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 100]);
  const heroBgY = useTransform(heroProgress, [0, 1], [0, 40]);

  const { data: sindicos, isLoading } = useSindicos({ especialidade, cidade, regiao });
  const featuredSindicos = sindicos?.slice(0, 4) || [];

  const benefits = [
    { icon: <Shield className="w-5 h-5" />, title: "Curadoria real", desc: "Perfis verificados e aprovados antes de ir ao ar." },
    { icon: <Clock className="w-5 h-5" />, title: "Contato em minutos", desc: "Compare e converse direto pelo WhatsApp." },
    { icon: <Building2 className="w-5 h-5" />, title: "Grande São Paulo", desc: "Cobertura em SP capital, ABC, interior e litoral." },
    { icon: <Users className="w-5 h-5" />, title: "100% gratuito", desc: "Sem custo para condomínios e moradores." },
  ];

  const testimonials = [
    { name: "Lucas Mendes", role: "Conselheiro fiscal", text: "Como conselheiro, encontrar profissionais qualificados era sempre demorado. Com a plataforma, comparei perfis em minutos.", rating: 5 },
    { name: "Peninsula Síndicos", role: "Administradora", text: "O Quero 1 Síndico se tornou ferramenta essencial para nossas indicações. A curadoria aumentou nossa credibilidade.", rating: 5 },
    { name: "Leonardo Vila", role: "Síndico profissional", text: "A plataforma ampliou minha visibilidade para novos condomínios. Recebo contatos qualificados toda semana.", rating: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <motion.div style={{ y: heroBgY }} className="absolute inset-0">
          <img src={heroSp} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,25%,4%,0.88)] via-[hsl(220,25%,4%,0.92)] to-[hsl(220,25%,4%,0.97)]" />
        </motion.div>

        {/* Ambient light */}
        <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[120px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative container py-24 md:py-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left content */}
            <div className="lg:col-span-3">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-[11px] text-white/25 tracking-[0.25em] uppercase mb-6"
                style={{ fontWeight: 440 }}
              >
                Plataforma de síndicos profissionais
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
                className="text-4xl md:text-5xl lg:text-[3.6rem] text-white leading-[1.06] tracking-[-0.03em] mb-6"
                style={{ fontWeight: 300 }}
              >
                Encontre o síndico{" "}
                <span className="text-primary" style={{ fontWeight: 460 }}>profissional</span>{" "}
                ideal para seu condomínio
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/35 text-base md:text-lg max-w-lg leading-relaxed mb-10"
                style={{ fontWeight: 390 }}
              >
                Perfis verificados, contato direto pelo WhatsApp e cobertura em toda a Grande São Paulo. Gratuito para condomínios.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-10 mb-10"
              >
                {[
                  { value: "100+", label: "Síndicos" },
                  { value: "10+", label: "Cidades" },
                  { value: "100%", label: "Gratuito" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl text-white/80" style={{ fontWeight: 350 }}>{stat.value}</p>
                    <p className="text-[10px] text-white/20 tracking-widest uppercase" style={{ fontWeight: 420 }}>{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Filters */}
              <HeroFilters
                especialidade={especialidade}
                cidade={cidade}
                regiao={regiao}
                onEspecialidadeChange={setEspecialidade}
                onCidadeChange={setCidade}
                onRegiaoChange={setRegiao}
              />
            </div>

            {/* Right — floating glass cards */}
            <div className="lg:col-span-2 relative hidden lg:block h-[480px]">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-52 h-64 rounded-xl glass overflow-hidden"
              >
                <div className="h-28 bg-white/[0.03]" />
                <div className="p-4 space-y-2.5">
                  <div className="h-2.5 w-28 rounded-full bg-white/[0.06]" />
                  <div className="h-2 w-20 rounded-full bg-white/[0.04]" />
                  <div className="flex gap-1.5 mt-3">
                    <div className="h-4 w-14 rounded-full bg-primary/[0.1]" />
                    <div className="h-4 w-10 rounded-full bg-primary/[0.06]" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-20 right-24 w-44 h-56 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.04] overflow-hidden"
              >
                <div className="h-24 bg-white/[0.02]" />
                <div className="p-3 space-y-2">
                  <div className="h-2.5 w-24 rounded-full bg-white/[0.05]" />
                  <div className="h-2 w-16 rounded-full bg-white/[0.03]" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-16 right-8 w-40 h-48 rounded-xl bg-white/[0.015] border border-white/[0.03]"
              />

              {/* Badge */}
              <div className="absolute bottom-0 left-0">
                <SpinBadge size={90} color="rgba(255,255,255,0.12)" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="py-5 border-y border-border/30 bg-muted/30">
        <Marquee speed="slow">
          {SPECIALTIES_MARQUEE.map((spec) => (
            <span key={spec} className="inline-flex items-center text-[13px] text-foreground/45 tracking-wide whitespace-nowrap px-6" style={{ fontWeight: 440 }}>
              {spec}
              <span className="ml-6 text-foreground/15">—</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ===== DISCOVERY ===== */}
      <section className="py-28 md:py-36">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>Descubra perfis</p>
              <h2 className="text-2xl md:text-3xl text-foreground leading-tight tracking-[-0.02em]" style={{ fontWeight: 350 }}>
                Síndicos prontos para transformar<br className="hidden md:block" />
                a gestão do seu condomínio
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground hover:text-primary group" style={{ fontWeight: 430 }}>
                <Link to="/sindicos">
                  Ver todos
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted/30 animate-pulse rounded-xl h-[320px]" />
              ))}
            </div>
          ) : featuredSindicos.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredSindicos.map((sindico, i) => (
                <motion.div key={sindico.id} variants={fadeUp} custom={i}>
                  <SindicoCard
                    id={sindico.id}
                    nome={sindico.nome_completo}
                    foto={sindico.foto_url || undefined}
                    resumo={sindico.breve_resumo || undefined}
                    regioes={sindico.regioes}
                    especialidades={sindico.especialidades}
                    cidade={sindico.cidade}
                    anoInicio={sindico.ano_inicio_profissao || undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 rounded-xl border border-border/30 bg-muted/10">
              <p className="text-muted-foreground mb-4 text-sm" style={{ fontWeight: 400 }}>Ainda não há síndicos aprovados na plataforma.</p>
              <Button asChild size="sm" className="rounded-full px-6" style={{ fontWeight: 450 }}>
                <Link to="/cadastro">Seja o primeiro</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="py-28 md:py-36 section-dark relative overflow-hidden">
        <div className="absolute top-0 left-[30%] w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[150px]" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>Por que existimos</p>
              <h2 className="text-2xl md:text-3xl text-white/90 leading-tight tracking-[-0.02em] mb-6" style={{ fontWeight: 320 }}>
                A gestão condominial merece mais profissionalismo, transparência e facilidade
              </h2>
              <p className="text-white/35 text-sm leading-relaxed mb-8" style={{ fontWeight: 390 }}>
                Encontrar o profissional certo impacta diretamente a qualidade de vida dos moradores e a valorização do patrimônio. Simplificamos essa busca.
              </p>
              <motion.div whileHover={{ x: 4 }} className="inline-block">
                <Button asChild variant="outline" size="sm" className="rounded-full px-6 gap-1.5 border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent" style={{ fontWeight: 430 }}>
                  <Link to="/como-funciona">
                    Saiba como funciona
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i + 2}
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 400 } }}
                  className="glass rounded-xl p-5 group"
                >
                  <div className="text-primary/50 mb-3 group-hover:text-primary/80 transition-colors duration-300">
                    {b.icon}
                  </div>
                  <h3 className="text-white/80 text-[13px] mb-1.5" style={{ fontWeight: 450 }}>{b.title}</h3>
                  <p className="text-white/25 text-[11px] leading-relaxed" style={{ fontWeight: 390 }}>{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-28 md:py-36">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.p variants={fadeUp} className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>Depoimentos</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-14" style={{ fontWeight: 350 }}>
              O que dizem sobre nós
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -3 }}
                className="rounded-xl p-6 border border-border/30 bg-card hover:border-primary/15 transition-colors duration-400"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={12} className="fill-primary/60 text-primary/60" />
                  ))}
                </div>
                <p className="text-muted-foreground text-[13px] mb-6 leading-relaxed" style={{ fontWeight: 400 }}>
                  "{t.text}"
                </p>
                <div>
                  <h4 className="text-foreground text-[13px]" style={{ fontWeight: 460 }}>{t.name}</h4>
                  <p className="text-[11px] text-muted-foreground/60" style={{ fontWeight: 390 }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 md:py-36 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02]" />
        <div className="container relative">
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <p className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-4" style={{ fontWeight: 450 }}>É síndico profissional?</p>
              <h2 className="text-3xl md:text-4xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 320 }}>
                Cadastre seu perfil e seja encontrado por condomínios em toda São Paulo
              </h2>
              <p className="text-white/30 text-sm mb-8 max-w-lg leading-relaxed" style={{ fontWeight: 390 }}>
                Amplie sua visibilidade, receba contatos qualificados e faça parte da maior curadoria de síndicos profissionais do estado.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="lg" className="rounded-full px-8 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                  <Link to="/cadastro">
                    Cadastre-se gratuitamente
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <div className="hidden lg:block">
              <SpinBadge size={100} color="rgba(255,255,255,0.08)" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
