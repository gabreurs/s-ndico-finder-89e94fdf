import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFilters } from "@/components/HeroFilters";
import { SindicoCard } from "@/components/SindicoCard";
import { ScrollBlur } from "@/components/ScrollBlur";
import { Marquee } from "@/components/Marquee";
import { useSindicos } from "@/hooks/useSindicos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, Building2, Users, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
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
  const discoveryRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 80]);

  const { data: sindicos, isLoading } = useSindicos({ especialidade, cidade, regiao });
  const featuredSindicos = sindicos?.slice(0, 3) || [];

  const benefits = [
    { icon: <Shield className="w-4 h-4" />, title: "Verificados", desc: "Cada perfil é aprovado antes de ir ao ar." },
    { icon: <Clock className="w-4 h-4" />, title: "Ágil", desc: "Compare e converse direto pelo WhatsApp." },
    { icon: <Building2 className="w-4 h-4" />, title: "Cobertura", desc: "São Paulo, Grande SP e interior paulista." },
    { icon: <Users className="w-4 h-4" />, title: "Gratuito", desc: "Sem custo para condomínios e moradores." },
  ];

  const testimonials = [
    { name: "Lucas Mendes", role: "Conselheiro fiscal", text: "Como conselheiro, encontrar profissionais qualificados era sempre demorado. Com a plataforma, comparei perfis em minutos.", rating: 5 },
    { name: "Peninsula Síndicos", role: "Administradora", text: "O Quero 1 Síndico se tornou ferramenta essencial para nossas indicações. A curadoria aumentou nossa credibilidade.", rating: 5 },
    { name: "Leonardo Vila", role: "Síndico profissional", text: "A plataforma ampliou minha visibilidade para novos condomínios. Recebo contatos qualificados toda semana.", rating: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ScrollBlur />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden gradient-mesh">
        {/* Ambient light effects */}
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />

        {/* Spinning badge */}
        <div className="absolute top-20 right-[8%] hidden lg:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border border-white/[0.06] flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-white/20" style={{ fontSize: '8.5px', fontWeight: 380, letterSpacing: '3px' }}>
                <textPath href="#circlePath">POWERED BY SÍNDICOLAB • POWERED BY SÍNDICOLAB •</textPath>
              </text>
            </svg>
          </motion.div>
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative container py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[11px] text-white/30 tracking-[0.2em] uppercase mb-6"
              style={{ fontWeight: 380 }}
            >
              Plataforma de síndicos profissionais
            </motion.p>

            <h1
              className="text-4xl md:text-5xl lg:text-[3.5rem] text-white leading-[1.1] tracking-[-0.025em] mb-6"
              style={{ fontWeight: 320 }}
            >
              Encontre o síndico{" "}
              <span className="text-primary" style={{ fontWeight: 400 }}>profissional</span>{" "}
              que seu condomínio merece
            </h1>

            <p
              className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed mb-10"
              style={{ fontWeight: 350 }}
            >
              Perfis verificados, contato direto pelo WhatsApp e cobertura em toda a Grande São Paulo. Gratuito para condomínios.
            </p>
          </motion.div>

          {/* Filters inline */}
          <HeroFilters
            especialidade={especialidade}
            cidade={cidade}
            regiao={regiao}
            onEspecialidadeChange={setEspecialidade}
            onCidadeChange={setCidade}
            onRegiaoChange={setRegiao}
          />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-10 mt-14"
          >
            {[
              { value: "100+", label: "Síndicos" },
              { value: "10+", label: "Cidades" },
              { value: "100%", label: "Gratuito" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg text-white/80" style={{ fontWeight: 400 }}>{stat.value}</p>
                <p className="text-[10px] text-white/25 tracking-widest uppercase" style={{ fontWeight: 380 }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="py-4 border-y border-border/[0.06] bg-muted/10">
        <Marquee speed="slow">
          {SPECIALTIES_MARQUEE.map((spec) => (
            <span key={spec} className="inline-flex items-center gap-4 text-[11px] text-muted-foreground/40 tracking-[0.15em] uppercase whitespace-nowrap px-6" style={{ fontWeight: 380 }}>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              {spec}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ===== DISCOVERY ===== */}
      <section ref={discoveryRef} className="py-24 md:py-32">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] text-primary/60 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 420 }}>Descubra perfis</p>
              <h2 className="text-2xl md:text-3xl text-foreground leading-tight tracking-[-0.02em]" style={{ fontWeight: 350 }}>
                Síndicos prontos para transformar<br className="hidden md:block" />
                a gestão do seu condomínio
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-[12px] text-muted-foreground hover:text-primary group" style={{ fontWeight: 400 }}>
                <Link to="/sindicos">
                  Ver todos
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted/30 animate-pulse rounded-2xl h-[420px]" />
              ))}
            </div>
          ) : featuredSindicos.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 glass rounded-2xl">
              <p className="text-muted-foreground mb-4 text-sm" style={{ fontWeight: 380 }}>Ainda não há síndicos aprovados na plataforma.</p>
              <Button asChild size="sm" className="rounded-full px-6" style={{ fontWeight: 420 }}>
                <Link to="/cadastro">Seja o primeiro</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="py-24 md:py-32 section-dark relative overflow-hidden">
        <div className="absolute top-0 left-[30%] w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[150px]" />
        <div className="container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 420 }}>Por que existimos</p>
              <h2 className="text-2xl md:text-3xl text-white/90 leading-tight tracking-[-0.02em] mb-6" style={{ fontWeight: 320 }}>
                A gestão condominial merece mais profissionalismo, transparência e facilidade
              </h2>
              <p className="text-white/30 text-sm leading-relaxed mb-8" style={{ fontWeight: 350 }}>
                Encontrar o profissional certo impacta diretamente a qualidade de vida dos moradores e a valorização do patrimônio. Simplificamos essa busca.
              </p>
              <motion.div whileHover={{ x: 4 }} className="inline-block">
                <Button asChild variant="outline" size="sm" className="rounded-full px-6 gap-1.5 border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent" style={{ fontWeight: 400 }}>
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
                  <div className="text-primary/60 mb-3 group-hover:text-primary transition-colors duration-300">
                    {b.icon}
                  </div>
                  <h3 className="text-white/80 text-[13px] mb-1.5" style={{ fontWeight: 420 }}>{b.title}</h3>
                  <p className="text-white/25 text-[11px] leading-relaxed" style={{ fontWeight: 350 }}>{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.p variants={fadeUp} className="text-[11px] text-primary/60 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 420 }}>Depoimentos</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-14" style={{ fontWeight: 350 }}>
              O que dizem sobre nós
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -3 }}
                className={`rounded-2xl p-6 border border-border/10 transition-colors duration-300 hover:border-primary/10 ${
                  i === 0 ? "md:row-span-1 bg-muted/20" : "bg-card"
                }`}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={12} className="fill-primary/60 text-primary/60" />
                  ))}
                </div>
                <p className="text-muted-foreground text-[13px] mb-6 leading-relaxed" style={{ fontWeight: 370 }}>
                  "{t.text}"
                </p>
                <div>
                  <h4 className="text-foreground text-[13px]" style={{ fontWeight: 420 }}>{t.name}</h4>
                  <p className="text-[11px] text-muted-foreground/60" style={{ fontWeight: 350 }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 md:py-32 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-4" style={{ fontWeight: 420 }}>É síndico profissional?</p>
            <h2 className="text-3xl md:text-4xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 320 }}>
              Cadastre seu perfil e seja encontrado por condomínios em toda São Paulo
            </h2>
            <p className="text-white/30 text-sm mb-8 max-w-lg leading-relaxed" style={{ fontWeight: 350 }}>
              Amplie sua visibilidade, receba contatos qualificados e faça parte da maior curadoria de síndicos profissionais do estado.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-[13px] gap-2" style={{ fontWeight: 420 }}>
                <Link to="/cadastro">
                  Cadastre-se gratuitamente
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
