import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Seo, SITE_URL } from "@/components/Seo";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import { artigoPorSlug, artigosRelacionados, type BlocoConteudo, type CtaTipo } from "@/lib/conteudo";

const CTAS: Record<CtaTipo, { titulo: string; texto: string; label: string; href: string }> = {
  diagnostico: {
    titulo: "Descubra o perfil que o seu condomínio precisa",
    texto: "O diagnóstico traduz o contexto do condomínio em um perfil de gestão e indica profissionais aderentes.",
    label: "Fazer diagnóstico",
    href: "/diagnostico",
  },
  referencias: {
    titulo: "Referências checadas com método",
    texto: "O Q1S Referências estrutura a checagem em critérios objetivos, sempre com a pergunta decisiva ao final.",
    label: "Conhecer o Q1S Referências",
    href: "/solucoes/referencias",
  },
  "executive-search": {
    titulo: "Quando a busca precisa ser dedicada",
    texto: "No Executive Search, conduzimos hunting, entrevistas, validação e shortlist para cenários complexos.",
    label: "Conhecer o Executive Search",
    href: "/solucoes/executive-search",
  },
  check: {
    titulo: "Mais informação para uma decisão mais segura",
    texto: "O Q1S Check analisa currículo, histórico, referências e informações públicas pertinentes do candidato.",
    label: "Conhecer o Q1S Check",
    href: "/solucoes/check",
  },
  busca: {
    titulo: "Já sabe o que procura?",
    texto: "Busque profissionais por especialidade, cidade e região no banco de referências do Q1S.",
    label: "Buscar profissionais",
    href: "/sindicos",
  },
};

function formatarData(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Bloco({ bloco }: { bloco: BlocoConteudo }) {
  switch (bloco.tipo) {
    case "h2":
      return (
        <h2 className="text-lg md:text-xl text-foreground tracking-[-0.02em] mt-10 mb-3" style={{ fontWeight: 400 }}>
          {bloco.texto}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-[15px] text-foreground mt-7 mb-2" style={{ fontWeight: 450 }}>
          {bloco.texto}
        </h3>
      );
    case "lista":
      return (
        <ul className="my-4 space-y-2">
          {bloco.itens.map((item) => (
            <li key={item} className="text-[14px] text-muted-foreground leading-relaxed pl-4 relative" style={{ fontWeight: 400 }}>
              <span className="absolute left-0 top-[0.6em] w-1 h-1 rounded-full bg-primary/50" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "citacao":
      return (
        <blockquote className="my-7 border-l-2 border-primary/40 pl-5 text-[15px] text-foreground/90 italic leading-relaxed" style={{ fontWeight: 380 }}>
          {bloco.texto}
        </blockquote>
      );
    default:
      return (
        <p className="text-[14px] text-muted-foreground leading-[1.85] mb-4" style={{ fontWeight: 400 }}>
          {bloco.texto}
        </p>
      );
  }
}

export default function ConteudoArtigo() {
  const { slug } = useParams<{ slug: string }>();
  const artigo = useMemo(() => (slug ? artigoPorSlug(slug) : undefined), [slug]);
  const relacionados = useMemo(() => (artigo ? artigosRelacionados(artigo) : []), [artigo]);

  const jsonLd = useMemo(
    () =>
      artigo
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: artigo.titulo,
            description: artigo.resumo,
            datePublished: artigo.data,
            dateModified: artigo.data,
            inLanguage: "pt-BR",
            keywords: artigo.keywords.join(", "),
            mainEntityOfPage: `${SITE_URL}/conteudo/${artigo.slug}`,
            author: { "@type": "Organization", name: "Quero 1 Síndico" },
            publisher: { "@type": "Organization", name: "Quero 1 Síndico" },
          }
        : undefined,
    [artigo],
  );

  if (!artigo) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center">
          <div className="container max-w-2xl py-24 text-center">
            <h1 className="text-xl text-foreground mb-3" style={{ fontWeight: 400 }}>
              Artigo não encontrado
            </h1>
            <p className="text-[13px] text-muted-foreground mb-6" style={{ fontWeight: 400 }}>
              O conteúdo que você procura pode ter sido movido ou ainda não foi publicado.
            </p>
            <Link
              to="/conteudo"
              className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-primary/80 transition-colors"
              style={{ fontWeight: 440 }}
            >
              <ArrowLeft size={13} /> Ver todos os conteúdos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cta = CTAS[artigo.ctaTipo];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={`${artigo.titulo} | Quero 1 Síndico`}
        description={artigo.resumo}
        path={`/conteudo/${artigo.slug}`}
        jsonLd={jsonLd}
      />
      <Header />

      <ReadingProgress targetId="artigo-conteudo" />

      <main className="flex-1">
        <article id="artigo-conteudo" className="py-10 md:py-16">
          <div className="container max-w-3xl">
            <PageBreadcrumb
              items={[{ label: "Conteúdo", href: "/conteudo" }, { label: artigo.categoria }]}
              className="mb-6"
            />

            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-9">
              <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
                {artigo.categoria}
              </p>
              <h1 className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-4 leading-tight" style={{ fontWeight: 350 }}>
                {artigo.titulo}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4" style={{ fontWeight: 400 }}>
                {artigo.resumo}
              </p>
              <p className="text-[11px] text-muted-foreground/60 flex items-center gap-2">
                <time dateTime={artigo.data}>{formatarData(artigo.data)}</time>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} /> {artigo.tempoLeitura} min de leitura
                </span>
              </p>
            </motion.header>

            <div className="border-t border-border/30 pt-8">
              {artigo.conteudo.map((bloco, i) => (
                <Bloco key={i} bloco={bloco} />
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border/30 bg-card/60 p-7">
              <h2 className="text-lg text-foreground tracking-[-0.02em] mb-2" style={{ fontWeight: 380 }}>
                {cta.titulo}
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-5" style={{ fontWeight: 400 }}>
                {cta.texto}
              </p>
              <Link
                to={cta.href}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2 text-[12px] transition-colors"
                style={{ fontWeight: 450 }}
              >
                {cta.label} <ArrowRight size={13} />
              </Link>
            </div>

            {relacionados.length > 0 && (
              <section className="mt-14">
                <h2 className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-5" style={{ fontWeight: 450 }}>
                  Leia também
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relacionados.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/conteudo/${rel.slug}`}
                      className="rounded-xl border border-border/30 bg-card/50 p-5 hover:border-primary/20 hover:bg-card/80 transition-all duration-300"
                    >
                      <p className="text-[10px] text-muted-foreground/60 mb-1.5" style={{ fontWeight: 500 }}>
                        {rel.categoria}
                      </p>
                      <p className="text-[13px] text-foreground leading-snug" style={{ fontWeight: 440 }}>
                        {rel.titulo}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12">
              <Link
                to="/conteudo"
                className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontWeight: 430 }}
              >
                <ArrowLeft size={13} /> Ver todos os conteúdos
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
