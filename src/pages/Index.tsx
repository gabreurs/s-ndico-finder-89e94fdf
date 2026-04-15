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
import { ArrowRight, Star, Building2, Users, Shield, Clock } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-sp.jpg";
import aboutImage from "@/assets/about-condo.jpg";
import teamImage from "@/assets/team-meeting.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const SPECIALTIES_MARQUEE = [
  "Cond. Residencial", "Cond. Comercial", "Residencial Multitorres",
  "Condomínio Misto", "Condomínio Horizontal", "Residencial Clube",
  "Torre Única", "Condomínio Industrial", "Loteamento",
];

const Index = () => {
  const [especialidade, setEspecialidade] = useState("all");
  const [cidade, setCidade] = useState("all");
  const [regiao, setRegiao] = useState("all");
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: sindicos, isLoading } = useSindicos({ especialidade, cidade, regiao });
  const featuredSindicos = sindicos?.slice(0, 4) || [];

  const benefits = [
    { icon: <Shield className="w-5 h-5" />, title: "Profissionais verificados", description: "Todos os síndicos passam por aprovação antes de aparecer na plataforma." },
    { icon: <Clock className="w-5 h-5" />, title: "Processo ágil", description: "Compare perfis e entre em contato direto pelo WhatsApp." },
    { icon: <Building2 className="w-5 h-5" />, title: "Toda Grande SP", description: "Cobertura completa na capital e região metropolitana." },
    { icon: <Users className="w-5 h-5" />, title: "100% gratuito", description: "Plataforma gratuita para condomínios e moradores." },
  ];

  const testimonials = [
    { name: "Lucas Mendes", role: "Conselheiro", text: "Como conselheiro, encontrar o síndico era sempre um desafio. Com a plataforma, esse processo se tornou simples e rápido.", rating: 5 },
    { name: "Peninsula Síndicos", role: "Administradora", text: "O Quero 1 Síndico se tornou uma ferramenta indispensável. A facilidade em encontrar profissionais aumentou nossa eficiência.", rating: 5 },
    { name: "Leonardo Vila", role: "Síndico profissional", text: "A plataforma foi um divisor de águas na minha carreira. Ter novos contatos regularmente é ótimo para o crescimento.", rating: 5 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ScrollBlur />
      
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt="Skyline de São Paulo ao pôr do sol"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/40 to-background" />
        </motion.div>
        
        <motion.div style={{ opacity: heroOpacity }} className="relative container py-20 md:py-32">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-primary-foreground/70 text-sm mb-4 tracking-widest uppercase text-center"
          >
            Plataforma SíndicoLab
          </motion.p>
          
          <HeroFilters
            especialidade={especialidade}
            cidade={cidade}
            regiao={regiao}
            onEspecialidadeChange={setEspecialidade}
            onCidadeChange={setCidade}
            onRegiaoChange={setRegiao}
          />
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-6 border-y border-border/30 bg-muted/30">
        <Marquee speed="slow">
          {SPECIALTIES_MARQUEE.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground tracking-wide whitespace-nowrap px-4"
            >
              <span className="w-1 h-1 rounded-full bg-primary/50" />
              {spec}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Featured Síndicos */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
          >
            <motion.div variants={fadeUp}>
              <p className="text-xs text-primary tracking-widest uppercase mb-2">Síndicos na plataforma</p>
              <h2 className="text-2xl md:text-3xl text-foreground leading-tight tracking-tight" style={{ fontWeight: 500 }}>
                Profissionais disponíveis
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} custom={1}>
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-primary">
                <Link to="/sindicos">
                  Ver todos
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-xl h-80" />
              ))}
            </div>
          ) : featuredSindicos.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {featuredSindicos.map((sindico, i) => (
                <motion.div key={sindico.id} variants={fadeUp} custom={i}>
                  <SindicoCard
                    id={sindico.id}
                    nome={sindico.nome_completo}
                    foto={sindico.foto_url || undefined}
                    regioes={sindico.regioes}
                    especialidades={sindico.especialidades}
                    cidade={sindico.cidade}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-muted/30 rounded-2xl border border-border/30"
            >
              <p className="text-muted-foreground mb-4">Ainda não há síndicos aprovados na plataforma.</p>
              <Button asChild size="sm" className="rounded-full px-6">
                <Link to="/cadastro">Seja o primeiro</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="text-xs text-primary tracking-widest uppercase mb-3">Sobre nós</p>
              <h2 className="text-2xl md:text-3xl text-foreground mb-5 leading-tight tracking-tight" style={{ fontWeight: 500 }}>
                O Quero 1 Síndico está
                <br />
                <span className="text-primary">transformando o mercado</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                A gestão condominial exige habilidades administrativas e conhecimentos específicos. Encontrar o profissional certo é uma etapa crucial que impacta diretamente a qualidade de vida dos moradores.
              </p>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Nossa plataforma simplifica, democratiza e agiliza o processo de contratação de síndicos, conectando condomínios aos melhores profissionais de São Paulo.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" size="sm" className="rounded-full px-6 gap-1.5">
                  <Link to="/como-funciona">
                    Como funciona
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={aboutImage}
                  alt="Lobby moderno de condomínio em São Paulo"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl overflow-hidden border-4 border-background">
                <img
                  src={teamImage}
                  alt="Equipe de gestão condominial"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} className="text-xs text-primary tracking-widest uppercase mb-2">Benefícios</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-tight" style={{ fontWeight: 500 }}>
              Por que usar o Quero 1 Síndico?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                custom={index}
                whileHover={{ y: -4 }}
                className="group bg-card rounded-xl p-5 border border-border/30 hover:border-primary/15 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-foreground text-sm mb-2" style={{ fontWeight: 500 }}>{benefit.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-10"
          >
            <motion.p variants={fadeUp} className="text-xs text-primary tracking-widest uppercase mb-2">Depoimentos</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-tight" style={{ fontWeight: 500 }}>
              O que dizem nossos usuários
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/15 transition-colors"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-primary-foreground text-xs" style={{ fontWeight: 500 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-foreground text-sm" style={{ fontWeight: 500 }}>{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-2xl p-8 md:p-14 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl text-secondary-foreground mb-3 tracking-tight" style={{ fontWeight: 500 }}>
                Pronto para começar?
              </h2>
              <p className="text-secondary-foreground/70 max-w-lg mx-auto mb-6 text-sm">
                Cadastre-se como síndico profissional e apareça para milhares de condomínios.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-card text-foreground hover:bg-card/90 rounded-full px-8 h-11 text-sm"
                >
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
