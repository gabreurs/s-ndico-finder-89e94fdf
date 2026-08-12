import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
import { Seo } from "@/components/Seo";
  ArrowRight,
  UserPlus,
  ClipboardList,
  ShieldCheck,
  Database,
  Sparkles,
  Award,
  Target,
  MessageSquareQuote,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" as const },
  }),
};

const FLUXO = [
  { icon: <UserPlus size={18} />, title: "Cadastro", desc: "Você preenche seu perfil profissional: experiência, formação, especialidades e diferenciais." },
  { icon: <ClipboardList size={18} />, title: "Construção do perfil", desc: "Organizamos seus dados nas dimensões Q1S — tipo de condomínio, porte, padrão e desafios que você domina." },
  { icon: <ShieldCheck size={18} />, title: "Qualificação e validação", desc: "Curadoria analisa o cadastro e, quando aplicável, conferimos referências antes da aprovação." },
  { icon: <Database size={18} />, title: "Base de talentos", desc: "Seu perfil passa a compor a base consultada em buscas diretas, no Q1S Match e em processos de Executive Search." },
  { icon: <Sparkles size={18} />, title: "Possíveis oportunidades compatíveis", desc: "Quando surgem condomínios com aderência ao seu repertório declarado, seu perfil pode ser considerado." },
];

const AVALIADO = [
  "Experiência prévia e tempo de atuação como síndico",
  "Tipos e portes de condomínio já administrados",
  "Especialidades e desafios com repertório comprovado",
  "Formações, certificações e diferenciais técnicos",
  "Referências de conselhos e condomínios anteriores",
];

export default function SouSindico() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title={'Sou síndico — cadastre seu repertório profissional'} description={'Cadastre-se na Quero 1 Síndico e estruture seu dossiê profissional para ser encontrado por condomínios com o seu perfil.'} path={'/sou-sindico'} />
      <Header />

      <section className="relative gradient-mesh overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="absolute top-[10%] right-[8%] w-[360px] h-[360px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-[15%] w-[280px] h-[280px] rounded-full bg-accent/[0.04] blur-[100px]" />

        <div className="container relative">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} className="text-[11px] text-white/25 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
              Para síndicos profissionais
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl text-white/95 leading-[1.08] tracking-[-0.02em] mb-6" style={{ fontWeight: 350 }}>
              Sua experiência é o seu repertório. Cadastre-a com método.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-white/35 text-base md:text-lg leading-relaxed max-w-2xl mb-8" style={{ fontWeight: 390 }}>
              O Quero 1 Síndico é uma base de talentos curada, não uma lista aberta. Seu cadastro organiza sua trajetória em dimensões técnicas para que condomínios com aderência ao seu perfil possam encontrá-lo — em buscas diretas, no Q1S Match e em processos de Executive Search.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                <Link to="/cadastro">
                  Cadastre seu perfil
                  <ArrowRight size={14} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-12 text-[13px] border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent" style={{ fontWeight: 430 }}>
                <Link to="/sindicos">Ver base de referências</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="max-w-2xl mb-12">
            <motion.p variants={fadeUp} className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>Como funciona</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em]" style={{ fontWeight: 350 }}>
              Do cadastro à oportunidade compatível
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {FLUXO.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-border/30 bg-card/50 p-5"
              >
                <div className="text-primary/60 mb-3">{f.icon}</div>
                <h3 className="text-[13px] text-foreground mb-1.5" style={{ fontWeight: 460 }}>{f.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="rounded-xl border border-border/30 bg-muted/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-primary/60" />
                <motion.h3 variants={fadeUp} className="text-[15px] text-foreground" style={{ fontWeight: 460 }}>O que é avaliado no seu perfil</motion.h3>
              </div>
              <div className="space-y-2.5">
                {AVALIADO.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i + 1} className="flex items-start gap-2.5 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="rounded-xl border border-border/30 bg-card/40 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-primary/60" />
                <motion.h3 variants={fadeUp} className="text-[15px] text-foreground" style={{ fontWeight: 460 }}>Especialidades e aderência</motion.h3>
              </div>
              <motion.p variants={fadeUp} custom={1} className="text-[13px] text-muted-foreground leading-relaxed mb-3" style={{ fontWeight: 400 }}>
                As especialidades Q1S organizam seu repertório em dimensões combináveis — tipo de empreendimento, porte, padrão e desafios que você já enfrentou. Quanto mais completo e específico o cadastro, mais precisa é a leitura de aderência entre o seu perfil e o cenário de cada condomínio.
              </motion.p>
              <motion.p variants={fadeUp} custom={2} className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                Referências e validações declaradas reforçam essa leitura, mas não substituem a curadoria: cada cadastro é analisado antes de entrar na base.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-10 rounded-xl border border-border/30 bg-muted/30 p-6 flex items-start gap-3"
          >
            <MessageSquareQuote size={18} className="text-primary/60 shrink-0 mt-0.5" />
            <p className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
              Fazer parte da base Q1S amplia sua visibilidade e organiza seu repertório profissional, mas não garante contratação ou volume de oportunidades. Processos compatíveis surgem conforme a aderência entre o seu perfil declarado e as necessidades de cada condomínio.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 320 }}>
              Organize seu repertório e faça parte da base Q1S
            </h2>
            <p className="text-white/30 text-sm mb-8 max-w-lg leading-relaxed" style={{ fontWeight: 390 }}>
              Cadastro gratuito, curadoria séria e visibilidade para condomínios que buscam exatamente o seu perfil.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
              <Link to="/cadastro">
                Cadastre-se gratuitamente
                <ArrowRight size={14} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
