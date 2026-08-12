import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Seo, SITE_URL } from "@/components/Seo";
import { listarArtigos, categorias, type ArtigoComLeitura } from "@/lib/conteudo";

function formatarData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ArtigoCard({ artigo, index }: { artigo: ArtigoComLeitura; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className="group rounded-xl border border-border/30 bg-card/50 p-6 hover:border-primary/20 hover:bg-card/80 transition-all duration-300 flex flex-col"
    >
      <p className="text-[10px] text-primary/70 tracking-[0.16em] uppercase mb-2" style={{ fontWeight: 500 }}>
        {artigo.categoria}
      </p>
      <h2 className="text-[15px] text-foreground mb-2 leading-snug" style={{ fontWeight: 460 }}>
        <Link to={`/conteudo/${artigo.slug}`} className="hover:text-primary transition-colors">
          {artigo.titulo}
        </Link>
      </h2>
      <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 flex-1" style={{ fontWeight: 400 }}>
        {artigo.resumo}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
          <Clock size={11} /> {artigo.tempoLeitura} min · {formatarData(artigo.data)}
        </span>
        <Link
          to={`/conteudo/${artigo.slug}`}
          className="inline-flex items-center gap-1.5 text-[12px] text-primary/70 hover:text-primary transition-colors group/link"
          style={{ fontWeight: 430 }}
        >
          Ler
          <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}

export default function Conteudo() {
  const artigos = useMemo(() => listarArtigos(), []);
  const listaCategorias = useMemo(() => categorias(), []);
  const [categoria, setCategoria] = useState<string | null>(null);

  const [destaque, ...demais] = artigos;
  const filtrados = categoria ? demais.filter((a) => a.categoria === categoria) : demais;

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Inteligência para contratar e gerir melhor",
      url: `${SITE_URL}/conteudo`,
      hasPart: artigos.map((a) => ({
        "@type": "Article",
        headline: a.titulo,
        url: `${SITE_URL}/conteudo/${a.slug}`,
        datePublished: a.data,
      })),
    }),
    [artigos],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Conteúdo | Inteligência para contratar e gerir melhor"
        description="Artigos sobre contratação de síndico profissional, comparação de propostas, referências, obras e gestão condominial. Conteúdo do Quero 1 Síndico."
        path="/conteudo"
        jsonLd={jsonLd}
      />
      <Header />

      <main className="flex-1">
        <section className="py-10 md:py-16">
          <div className="container">
            <PageBreadcrumb items={[{ label: "Conteúdo" }]} className="mb-6" />

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-10">
              <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-2" style={{ fontWeight: 450 }}>
                Conteúdo Q1S
              </p>
              <h1 className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-3" style={{ fontWeight: 350 }}>
                Inteligência para contratar e gerir melhor
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                Material objetivo para conselhos, síndicos e moradores decidirem com critério: como contratar,
                como comparar, o que checar e o que muda conforme o perfil do condomínio.
              </p>
            </motion.div>

            {destaque && (
              <motion.article
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border/30 bg-card/60 p-7 md:p-10 mb-10"
              >
                <p className="text-[10px] text-accent/70 tracking-[0.18em] uppercase mb-3" style={{ fontWeight: 500 }}>
                  Em destaque · {destaque.categoria}
                </p>
                <h2 className="text-xl md:text-2xl text-foreground tracking-[-0.02em] mb-3 max-w-3xl" style={{ fontWeight: 380 }}>
                  <Link to={`/conteudo/${destaque.slug}`} className="hover:text-primary transition-colors">
                    {destaque.titulo}
                  </Link>
                </h2>
                <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6" style={{ fontWeight: 400 }}>
                  {destaque.resumo}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    to={`/conteudo/${destaque.slug}`}
                    className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-primary/80 transition-colors"
                    style={{ fontWeight: 440 }}
                  >
                    Ler artigo <ArrowRight size={13} />
                  </Link>
                  <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
                    <Clock size={11} /> {destaque.tempoLeitura} min de leitura
                  </span>
                </div>
              </motion.article>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              <button
                type="button"
                onClick={() => setCategoria(null)}
                className={`text-[11px] rounded-full border px-3.5 py-1.5 transition-colors ${
                  categoria === null
                    ? "border-primary/40 text-foreground bg-primary/10"
                    : "border-border/30 text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontWeight: 430 }}
              >
                Todos
              </button>
              {listaCategorias.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoria(c)}
                  className={`text-[11px] rounded-full border px-3.5 py-1.5 transition-colors ${
                    categoria === c
                      ? "border-primary/40 text-foreground bg-primary/10"
                      : "border-border/30 text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ fontWeight: 430 }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtrados.map((artigo, i) => (
                <ArtigoCard key={artigo.slug} artigo={artigo} index={i} />
              ))}
            </div>

            {filtrados.length === 0 && (
              <p className="text-[13px] text-muted-foreground">Nenhum artigo nesta categoria por enquanto.</p>
            )}

            <div className="mt-14 rounded-2xl border border-border/30 bg-card/50 p-7 md:p-9">
              <h2 className="text-lg md:text-xl text-foreground tracking-[-0.02em] mb-2" style={{ fontWeight: 380 }}>
                Não sabe qual perfil o seu condomínio precisa?
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl mb-5" style={{ fontWeight: 400 }}>
                O diagnóstico do Q1S traduz o contexto do condomínio em um perfil de gestão e indica profissionais
                com aderência sustentada por evidência.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/diagnostico"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 text-[12px] transition-colors"
                  style={{ fontWeight: 450 }}
                >
                  Fazer diagnóstico <ArrowRight size={13} />
                </Link>
                <Link
                  to="/sindicos"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 px-4 py-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                  style={{ fontWeight: 440 }}
                >
                  Buscar profissionais
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
