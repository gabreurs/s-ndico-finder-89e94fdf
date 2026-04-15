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
import { ArrowRight, Star, Building2, Users, Shield, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-sp.jpg";
import aboutImage from "@/assets/about-condo.jpg";
import teamImage from "@/assets/team-meeting.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const SPECIALTIES_MARQUEE = [
  "Residencial Multitorres", "Condomínio Comercial", "Residencial Clube",
  "Condomínio Horizontal", "Torre Única", "Condomínio Misto",
  "Loteamento", "Condomínio Industrial", "Associação de Moradores",
];

const STATS = [
  { value: "100+", label: "Síndicos cadastrados" },
  { value: "10+", label: "Cidades atendidas" },
  { value: "100%", label: "Gratuito" },
];

const Index = () => {
  const [especialidade, setEspecialidade] = useState("all");
  const [cidade, setCidade] = useState("all");
  const [regiao, setRegiao] = useState("all");
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const aboutImgY = useTransform(aboutProgress, [0, 1], [60, -60]);

  const { data: sindicos, isLoading } = useSindicos({ especialidade, cidade, regiao });
  const featuredSindicos = sindicos?.slice(0, 4) || [];

  const benefits = [
    { icon: <Shield className="w-5 h-5" />, title: "Profissionais verificados", description: "Cada síndico passa por análise e aprovação antes de aparecer na plataforma." },
    { icon: <Clock className="w-5 h-5" />, title: "Processo ágil", description: "Compare perfis detalhados e entre em contato direto pelo WhatsApp em segundos." },
    { icon: <Building2 className="w-5 h-5" />, title: "Cobertura completa", description: "São Paulo capital, Grande SP e principais cidades do interior paulista." },
    { icon: <Users className="w-5 h-5" />, title: "Gratuito para condomínios", description: "Moradores, conselheiros e zeladores usam a plataforma sem nenhum custo." },
  ];

  const testimonials = [
    { name: "Lucas Mendes", role: "Conselheiro fiscal", text: "Como conselheiro, encontrar profissionais qualificados era sempre demorado. Com a plataforma, comparei perfis em minutos.", rating: 5 },
    { name: "Peninsula Síndicos", role: "Administradora", text: "O Quero 1 Síndico se tornou uma ferramenta essencial para nossas indicações. A curadoria de profissionais aumentou nossa credibilidade.", rating: 5 },
    { name: "Leonardo Vila", role: "Síndico profissional", text: "A plataforma ampliou minha visibilidade para novos condomínios. Recebo contatos qualificados toda semana.", rating: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ScrollBlur />
      
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src={heroImage}
            alt="Vista aérea de São Paulo ao entardecer, skyline com arranha-céus"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/75 via-foreground/50 to-background" />
        </motion.div>
        
        <motion.div style={{ opacity: heroOpacity }} className="relative container py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 justify-center mb-5"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase text-primary-foreground/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <Sparkles size={12} className="text-primary" />
              Powered by SíndicoLab
            </span>
          </motion.div>
          
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
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center gap-8 md:gap-12 mt-8"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg md:text-xl text-primary-foreground" style={{ fontWeight: 500 }}>{stat.value}</p>
                <p className="text-[10px] md:text-xs text-primary-foreground/50 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-5 border-y border-border/20 bg-muted/20">
        <Marquee speed="slow">
          {SPECIALTIES_MARQUEE.map((spec) => (
            <span key={spec} className="inline-flex items-center gap-2.5 text-[11px] text-muted-foreground/70 tracking-widest uppercase whitespace-nowrap px-5">
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              {spec}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Featured Síndicos */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] text-primary tracking-widest uppercase mb-2">Síndicos na plataforma</p>
              <h2 className="text-2xl md:text-3xl text-foreground leading-tight tracking-tight" style={{ fontWeight: 450 }}>
                Profissionais prontos para<br />
                <span className="text-gradient">gerenciar seu condomínio</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-primary group">
                <Link to="/sindicos">
                  Ver todos os perfis
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted/50 animate-pulse rounded-2xl h-80" />
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-muted/20 rounded-2xl border border-border/20">
              <p className="text-muted-foreground mb-4 text-sm">Ainda não há síndicos aprovados na plataforma.</p>
              <Button asChild size="sm" className="rounded-full px-6">
                <Link to="/cadastro">Seja o primeiro</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="py-20 md:py-28 overflow-hidden">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[11px] text-primary tracking-widest uppercase mb-3">Sobre a plataforma</p>
              <h2 className="text-2xl md:text-3xl text-foreground mb-6 leading-tight tracking-tight" style={{ fontWeight: 450 }}>
                Conectamos condomínios aos{" "}
                <span className="text-gradient">melhores profissionais</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                A gestão condominial exige competências administrativas, financeiras e interpessoais. Encontrar o profissional certo é uma decisão que impacta diretamente a qualidade de vida dos moradores e a valorização do patrimônio.
              </p>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Nossa plataforma democratiza e agiliza esse processo, oferecendo uma curadoria de síndicos profissionais verificados em São Paulo e região metropolitana — tudo 100% gratuito para condomínios.
              </p>
              
              <div className="flex flex-col gap-2.5 mb-7">
                {["Perfis verificados e aprovados", "Contato direto via WhatsApp", "Filtros por cidade, região e especialidade"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 size={15} className="text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" size="sm" className="rounded-full px-6 gap-1.5 border-border/30">
                  <Link to="/como-funciona">
                    Como funciona
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="relative">
              <motion.div style={{ y: aboutImgY }} className="rounded-2xl overflow-hidden">
                <img src={aboutImage} alt="Lobby moderno de condomínio premium em São Paulo" className="w-full h-auto object-cover" loading="lazy" width={1280} height={960} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 w-28 h-28 rounded-2xl overflow-hidden border-4 border-background shadow-lg"
              >
                <img src={teamImage} alt="Equipe de gestão condominial em reunião" className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-muted/15">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-[11px] text-primary tracking-widest uppercase mb-2">Benefícios</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-tight" style={{ fontWeight: 450 }}>
              Por que escolher o Quero 1 Síndico?
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                custom={index}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}
                className="group bg-card rounded-2xl p-6 border border-border/20 hover:border-primary/10 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-foreground text-sm mb-2" style={{ fontWeight: 450 }}>{benefit.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mb-12">
            <motion.p variants={fadeUp} className="text-[11px] text-primary tracking-widest uppercase mb-2">Depoimentos</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-tight" style={{ fontWeight: 450 }}>
              O que dizem sobre a plataforma
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
                className="bg-card rounded-2xl p-6 border border-border/20 hover:border-primary/10 transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-primary-foreground text-xs" style={{ fontWeight: 450 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-foreground text-sm" style={{ fontWeight: 450 }}>{t.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-hero rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl text-secondary-foreground mb-3 tracking-tight" style={{ fontWeight: 450 }}>
                É síndico profissional?
              </h2>
              <p className="text-secondary-foreground/65 max-w-md mx-auto mb-7 text-sm leading-relaxed">
                Cadastre seu perfil gratuitamente e seja encontrado por milhares de condomínios em São Paulo.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="lg" className="bg-card text-foreground hover:bg-card/90 rounded-full px-8 h-11 text-sm">
                  <Link to="/cadastro">Cadastre-se gratuitamente</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
