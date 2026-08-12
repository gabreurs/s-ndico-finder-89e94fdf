import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Award, Target, Search, CheckCircle2 } from "lucide-react";
import { especialidadePorSlug, dimensaoLabel } from "@/lib/dimensoes";
import { especialidadeConteudoPorSlug } from "@/lib/especialidadesConteudo";
import { Seo } from "@/components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export default function Especialidade() {
  const { slug } = useParams<{ slug: string }>();
  const especialidade = slug ? especialidadePorSlug(slug) : undefined;
  const conteudo = slug ? especialidadeConteudoPorSlug(slug) : undefined;

  if (!especialidade || !conteudo) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={`${especialidade.titulo} | Quero 1 Síndico`}
        description={especialidade.chamada.slice(0, 155)}
        path={`/especialidades/${especialidade.slug}`}
      />
      <Header />

      <section className="relative gradient-mesh overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="absolute top-[10%] right-[8%] w-[360px] h-[360px] rounded-full bg-primary/[0.06] blur-[120px]" />

        <div className="container relative">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} className="text-primary/60 mb-4"><Award size={32} /></motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-[11px] text-white/25 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
              Especialidade Q1S
            </motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="text-3xl md:text-4xl lg:text-5xl text-white/95 leading-[1.08] tracking-[-0.02em] mb-6" style={{ fontWeight: 350 }}>
              {especialidade.titulo}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-white/35 text-base md:text-lg leading-relaxed max-w-2xl mb-6" style={{ fontWeight: 390 }}>
              {especialidade.chamada}
            </motion.p>
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-2 mb-8">
              {especialidade.dimensoes.map((d) => (
                <span key={d} className="text-[11px] px-2.5 py-1 rounded-full border border-white/[0.1] text-white/55" style={{ fontWeight: 420 }}>
                  {dimensaoLabel(d)}
                </span>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} custom={5} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 h-12 text-[13px] gap-2" style={{ fontWeight: 450 }}>
                <Link to="/diagnostico">
                  <Target size={14} />
                  Fazer diagnóstico
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-12 text-[13px] border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent" style={{ fontWeight: 430 }}>
                <Link to={`/sindicos?especialidade=${especialidade.slug}`}>
                  Ver profissionais aderentes
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                <motion.h2 variants={fadeUp} className="text-[13px] text-primary/70 tracking-[0.15em] uppercase mb-3" style={{ fontWeight: 450 }}>Cenário</motion.h2>
                <motion.p variants={fadeUp} custom={1} className="text-[14px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                  {conteudo.cenario}
                </motion.p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                <motion.h2 variants={fadeUp} className="text-[13px] text-primary/70 tracking-[0.15em] uppercase mb-4" style={{ fontWeight: 450 }}>Problemas típicos</motion.h2>
                <div className="space-y-2.5">
                  {conteudo.problemasTipicos.map((item, i) => (
                    <motion.div key={i} variants={fadeUp} custom={i + 1} className="flex items-start gap-2.5 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                  <motion.h2 variants={fadeUp} className="text-[13px] text-primary/70 tracking-[0.15em] uppercase mb-4" style={{ fontWeight: 450 }}>Necessidades do condomínio</motion.h2>
                  <div className="space-y-2.5">
                    {conteudo.necessidades.map((item, i) => (
                      <motion.div key={i} variants={fadeUp} custom={i + 1} className="flex items-start gap-2.5 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
                        <CheckCircle2 size={14} className="text-primary/50 mt-0.5 shrink-0" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
                  <motion.h2 variants={fadeUp} className="text-[13px] text-primary/70 tracking-[0.15em] uppercase mb-4" style={{ fontWeight: 450 }}>Competências do síndico</motion.h2>
                  <div className="space-y-2.5">
                    {conteudo.competencias.map((item, i) => (
                      <motion.div key={i} variants={fadeUp} custom={i + 1} className="flex items-start gap-2.5 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
                        <CheckCircle2 size={14} className="text-primary/50 mt-0.5 shrink-0" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="rounded-xl border border-border/30 bg-muted/20 p-6">
                <motion.h2 variants={fadeUp} className="text-[15px] text-foreground mb-3" style={{ fontWeight: 460 }}>Repertórios que buscamos</motion.h2>
                <div className="space-y-2">
                  {conteudo.repertorios.map((item, i) => (
                    <motion.p key={i} variants={fadeUp} custom={i + 1} className="text-[13px] text-muted-foreground flex items-start gap-2" style={{ fontWeight: 400 }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                      {item}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="rounded-xl border border-border/30 bg-card/40 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Search size={16} className="text-primary/60" />
                  <motion.h2 variants={fadeUp} className="text-[15px] text-foreground" style={{ fontWeight: 460 }}>Como o Q1S procura</motion.h2>
                </div>
                <motion.p variants={fadeUp} custom={1} className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                  {conteudo.comoQ1SProcura}
                </motion.p>
              </motion.div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div className="rounded-xl border border-border/30 bg-card/60 p-6">
                <h3 className="text-[13px] text-foreground mb-3" style={{ fontWeight: 460 }}>Diagnóstico</h3>
                <p className="text-[12px] text-muted-foreground mb-4 leading-relaxed" style={{ fontWeight: 400 }}>
                  {conteudo.diagnostico}
                </p>
                <Button asChild size="sm" className="w-full rounded-full h-10 text-[12px] gap-1.5" style={{ fontWeight: 450 }}>
                  <Link to="/diagnostico">
                    Fazer diagnóstico
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/30 p-6">
                <h3 className="text-[13px] text-foreground mb-2" style={{ fontWeight: 460 }}>Profissionais aderentes</h3>
                <p className="text-[12px] text-muted-foreground mb-4" style={{ fontWeight: 400 }}>
                  Veja síndicos com repertório declarado nesta especialidade no banco de referências Q1S.
                </p>
                <Button asChild variant="outline" className="w-full rounded-full h-10 text-[12px] gap-1.5" style={{ fontWeight: 430 }}>
                  <Link to={`/sindicos?especialidade=${especialidade.slug}`}>
                    Ver perfis
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
