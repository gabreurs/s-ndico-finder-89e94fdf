import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, Target, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Seo, SITE_URL } from "@/components/Seo";
import { ESPECIALIDADES_Q1S, dimensaoLabel } from "@/lib/dimensoes";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

const GRUPOS: { titulo: string; descricao: string; slugs: string[] }[] = [
  {
    titulo: "Tipo e contexto do condomínio",
    descricao: "O que o empreendimento é: porte, padrão e natureza jurídica.",
    slugs: ["alto-padrao", "condominio-clube", "condominios-comerciais", "grandes-condominios", "condominios-pequenos", "associacoes"],
  },
  {
    titulo: "Situação e desafio do momento",
    descricao: "O que o condomínio está vivendo agora e precisa resolver.",
    slugs: ["obras", "implantacao", "recuperacao-financeira", "gestao-de-conflitos"],
  },
  {
    titulo: "Perfil e repertório do profissional",
    descricao: "O jeito de trabalhar que o cenário exige do síndico.",
    slugs: ["perfil-financeiro", "perfil-operacional"],
  },
];

export default function Especialidades() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Especialidades Q1S",
    url: `${SITE_URL}/especialidades`,
    hasPart: ESPECIALIDADES_Q1S.map((e) => ({
      "@type": "WebPage",
      name: e.titulo,
      url: `${SITE_URL}/especialidades/${e.slug}`,
      description: e.chamada,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Especialidades de síndicos profissionais | Quero 1 Síndico"
        description="As 12 especialidades Q1S: tipo de condomínio, desafio do momento e perfil do profissional. Descubra qual combinação o seu condomínio exige."
        path="/especialidades"
        jsonLd={jsonLd}
      />
      <Header />

      <section className="relative gradient-mesh overflow-hidden pt-10 pb-16 md:pt-16 md:pb-20">
        <div className="absolute top-[10%] right-[8%] w-[360px] h-[360px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="container relative">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} className="text-primary/60 mb-4"><Award size={32} /></motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-[11px] text-white/25 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
              Especialidades Q1S
            </motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="text-3xl md:text-4xl lg:text-5xl text-white/95 leading-[1.08] tracking-[-0.02em] mb-6" style={{ fontWeight: 350 }}>
              Especialidades não são caixas isoladas
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-white/35 text-base md:text-lg leading-relaxed max-w-2xl mb-8" style={{ fontWeight: 390 }}>
              Um condomínio pode ser Alto Padrão, Grande Condomínio, estar em Obras e precisar de um perfil Financeiro — tudo ao mesmo tempo. Por isso trabalhamos com dimensões combináveis, e não com um rótulo único por profissional.
            </motion.p>
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                <Link to="/diagnostico"><Target size={14} />Descobrir meu perfil</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12 text-[13px] gap-2 border-white/[0.15] text-white/80 hover:text-white bg-transparent" style={{ fontWeight: 430 }}>
                <Link to="/sindicos"><Search size={14} />Buscar profissionais</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {GRUPOS.map((grupo, gi) => (
        <section key={grupo.titulo} className={gi % 2 === 1 ? "py-16 md:py-20 bg-muted/20" : "py-16 md:py-20"}>
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="max-w-2xl mb-8">
              <motion.h2 variants={fadeUp} className="text-xl md:text-2xl text-foreground tracking-[-0.02em] mb-2" style={{ fontWeight: 380 }}>
                {grupo.titulo}
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                {grupo.descricao}
              </motion.p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grupo.slugs.map((slug, i) => {
                const esp = ESPECIALIDADES_Q1S.find((e) => e.slug === slug);
                if (!esp) return null;
                return (
                  <motion.div
                    key={esp.slug}
                    variants={fadeUp}
                    custom={i * 0.05}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    whileHover={{ y: -3 }}
                  >
                    <Link
                      to={`/especialidades/${esp.slug}`}
                      className="group block h-full rounded-xl border border-border/30 bg-card p-5 hover:border-primary/25 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Award size={14} className="text-primary/60" />
                        <h3 className="text-[13px] text-foreground" style={{ fontWeight: 460 }}>{esp.titulo}</h3>
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-relaxed mb-4" style={{ fontWeight: 400 }}>{esp.chamada}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {esp.dimensoes.slice(0, 3).map((d) => (
                          <span key={d} className="text-[10px] px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground/80" style={{ fontWeight: 420 }}>
                            {dimensaoLabel(d)}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-primary/80 group-hover:text-primary" style={{ fontWeight: 440 }}>
                        Ver especialidade <ArrowRight size={12} />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 md:py-24 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
        <div className="container relative max-w-2xl">
          <h2 className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 340 }}>
            Não sabe quais especialidades o seu condomínio combina?
          </h2>
          <p className="text-white/35 text-sm leading-relaxed mb-7" style={{ fontWeight: 390 }}>
            O diagnóstico cruza porte, momento financeiro, obras, equipe, conselho e as três prioridades da gestão para indicar o perfil mais aderente — e os profissionais da base que sustentam esse perfil com dados reais.
          </p>
          <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
            <Link to="/diagnostico">Fazer diagnóstico gratuito <ArrowRight size={14} /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
