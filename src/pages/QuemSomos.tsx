import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SpinBadge } from "@/components/SpinBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, Shield, Target, Sparkles } from "lucide-react";
import { useRef } from "react";
import teamMeeting from "@/assets/quem-somos.webp";
import { Seo } from "@/components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
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
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title={'Quem somos | Quero 1 Síndico'} description={'Somos uma plataforma de headhunting de síndicos profissionais focada em gestão condominial profissional.'} path={'/quem-somos'} />
      <Header />

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-[65vh] flex items-center gradient-mesh overflow-hidden">
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/[0.05] blur-[120px]" />
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-[100px]" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="container relative py-24 md:py-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="lg:col-span-3">
              <motion.div variants={fadeUp} className="mb-6">
                <PageBreadcrumb items={[{ label: "Quem somos" }]} variant="dark" />
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-4xl lg:text-5xl text-white/90 leading-[1.08] tracking-[-0.025em] mb-6" style={{ fontWeight: 300 }}>
                Acreditamos na gestão condominial{" "}
                <span className="text-primary" style={{ fontWeight: 460 }}>profissional</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-white/35 text-base md:text-lg max-w-lg leading-relaxed" style={{ fontWeight: 390 }}>
                O Quero 1 Síndico nasceu para facilitar a conexão entre condomínios e síndicos qualificados — com curadoria, transparência e zero burocracia.
              </motion.p>
            </motion.div>

            <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
              <SpinBadge size={110} color="rgba(255,255,255,0.08)" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== MISSION — editorial asymmetric ===== */}
      <section className="py-28 md:py-36">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.p variants={fadeUp} className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>Nossa proposta</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] leading-tight mb-6" style={{ fontWeight: 350 }}>
                Uma plataforma que resolve um problema real
              </motion.h2>
              <motion.div variants={fadeUp} custom={2} className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 400 }}>
                  A gestão condominial no Brasil envolve milhares de condomínios que precisam de profissionais qualificados — e milhares de síndicos que buscam visibilidade e oportunidades. Mas essa conexão sempre foi informal, dependente de indicações esparsas e sem nenhuma estrutura.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 400 }}>
                  O Quero 1 Síndico organiza esse mercado. Oferecemos uma curadoria de profissionais verificados, acessível gratuitamente a moradores, conselheiros e zeladores.
                </p>
                <p className="text-foreground/80 text-sm leading-relaxed" style={{ fontWeight: 430 }}>
                  Powered by SíndicoLab, trazemos a credibilidade e a experiência de quem entende profundamente o ecossistema condominial brasileiro.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-xl overflow-hidden aspect-[16/10]"
            >
              <img
                src={teamMeeting}
                alt="Equipe profissional em reunião"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1280}
                height={720}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-28 md:py-36 section-dark relative overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]" />
        <div className="container relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
            <motion.p variants={fadeUp} className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>O que nos move</motion.p>
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
                className="glass rounded-xl p-6 md:p-8 group"
              >
                <div className="text-primary/40 mb-4 group-hover:text-primary/70 transition-colors duration-300">{v.icon}</div>
                <h3 className="text-white/80 text-sm mb-2" style={{ fontWeight: 460 }}>{v.title}</h3>
                <p className="text-white/30 text-[13px] leading-relaxed" style={{ fontWeight: 400 }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-28 md:py-36">
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
                <p className="text-4xl md:text-5xl text-foreground tracking-tight mb-2" style={{ fontWeight: 280 }}>{stat.value}</p>
                <p className="text-[11px] text-muted-foreground tracking-widest uppercase" style={{ fontWeight: 420 }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 md:py-36 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
        <div className="container relative">
          <div className="flex items-start justify-between">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl">
              <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 320 }}>
                Faça parte dessa transformação
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-white/30 text-sm mb-8 leading-relaxed" style={{ fontWeight: 400 }}>
                Seja como morador buscando o melhor profissional, ou como síndico ampliando sua presença — estamos aqui para conectar.
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
                  <Button asChild variant="outline" className="rounded-full px-7 h-11 text-[13px] border-white/10 text-white/60 hover:text-white bg-transparent" style={{ fontWeight: 430 }}>
                    <Link to="/cadastro">Cadastre-se como síndico</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="hidden lg:block">
              <SpinBadge size={90} color="rgba(255,255,255,0.06)" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
