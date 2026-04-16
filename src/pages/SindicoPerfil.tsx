import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SindicoCard } from "@/components/SindicoCard";
import { SpinBadge } from "@/components/SpinBadge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useSindicos } from "@/hooks/useSindicos";
import { motion } from "framer-motion";
import {
  MapPin,
  Award,
  Clock,
  User,
  ExternalLink,
  MessageCircle,
  Building2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Sindico = Tables<"sindicos">;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function SindicoPerfil() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sindico, setSindico] = useState<Sindico | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const especialidadeFilter = searchParams.get("especialidade") || "all";
  const cidadeFilter = searchParams.get("cidade") || "all";
  const regiaoFilter = searchParams.get("regiao") || "all";

  const { data: relatedSindicos } = useSindicos({
    especialidade: especialidadeFilter,
    cidade: cidadeFilter,
    regiao: regiaoFilter,
  });

  const otherSindicos = relatedSindicos?.filter((s) => s.id !== sindico?.id) || [];

  useEffect(() => {
    setImgError(false);
    async function fetchSindico() {
      if (!slug) return;

      // Try by slug first
      let { data } = await supabase
        .from("sindicos")
        .select("*")
        .eq("slug", slug)
        .eq("status", "approved")
        .maybeSingle();

      // Fallback: if slug looks like a UUID, try by id and redirect to slug URL
      if (!data && /^[0-9a-f-]{36}$/.test(slug)) {
        const res = await supabase
          .from("sindicos")
          .select("*")
          .eq("id", slug)
          .eq("status", "approved")
          .maybeSingle();
        data = res.data;
        if (data && (data as any).slug) {
          navigate(`/sindico/${(data as any).slug}`, { replace: true });
          return;
        }
      }

      if (data) setSindico(data);
      setLoading(false);
    }
    fetchSindico();
  }, [slug, navigate]);

  const experienceYears = sindico?.ano_inicio_profissao
    ? new Date().getFullYear() - sindico.ano_inicio_profissao
    : null;

  const handleWhatsAppClick = () => {
    if (!sindico) return;
    const message = `Olá! Encontrei o perfil de ${sindico.nome_completo} no Quero 1 Síndico e gostaria de saber mais sobre este profissional.`;
    window.open(buildRafaelWhatsAppUrl(message), "_blank");
  };

  /* ---------- loading / 404 ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/40 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!sindico) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-lg text-foreground" style={{ fontWeight: 420 }}>
            Síndico não encontrado
          </p>
          <Button asChild size="sm" className="rounded-full gap-1.5" style={{ fontWeight: 450 }}>
            <Link to="/sindicos">
              <ChevronLeft size={13} />
              Ver todos
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const cidadeDisplay = Array.isArray(sindico.cidade) ? sindico.cidade.join(", ") : sindico.cidade;
  const hasPhoto = !!sindico.foto_url && !imgError;

  /* ---------- stats chips ---------- */
  const stats: Array<{ icon: React.ReactNode; label: string }> = [];
  if (experienceYears !== null && experienceYears > 0) {
    stats.push({
      icon: <Clock size={11} className="text-primary/70" />,
      label: `${experienceYears} ${experienceYears === 1 ? "ano" : "anos"} de experiência`,
    });
  }
  if (cidadeDisplay) {
    stats.push({
      icon: <MapPin size={11} className="text-primary/70" />,
      label: cidadeDisplay,
    });
  }
  if (sindico.nome_empresa) {
    stats.push({
      icon: <Building2 size={11} className="text-primary/70" />,
      label: sindico.nome_empresa,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative gradient-mesh overflow-hidden">
        {/* ambient lights */}
        <div className="absolute top-[10%] right-[8%] w-[360px] h-[360px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-[15%] w-[280px] h-[280px] rounded-full bg-accent/[0.04] blur-[100px]" />

        <div className="container relative pt-8 pb-14 md:pt-12 md:pb-20">
          {/* breadcrumb */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
            <PageBreadcrumb
              items={[
                { label: "Síndicos", href: "/sindicos" },
                { label: sindico.nome_completo },
              ]}
              variant="dark"
              className="mb-8"
            />
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* ── Photo column ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 flex justify-center lg:justify-start"
            >
              <div className="relative w-full max-w-[280px] lg:max-w-none">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                  {hasPhoto ? (
                    <img
                      src={sindico.foto_url!}
                      alt={`${sindico.nome_completo} — Síndico profissional`}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={56} className="text-white/10" />
                    </div>
                  )}
                </div>

                {/* badge */}
                <div className="absolute -bottom-5 -right-5 hidden lg:block">
                  <SpinBadge size={72} color="rgba(255,255,255,0.08)" />
                </div>
              </div>
            </motion.div>

            {/* ── Info column ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="lg:col-span-8 flex flex-col justify-center"
            >
              <motion.p
                variants={fadeUp}
                className="text-[10px] text-white/20 tracking-[0.22em] uppercase mb-3"
                style={{ fontWeight: 440 }}
              >
                Síndico profissional
              </motion.p>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-3xl md:text-4xl lg:text-[2.8rem] text-white/95 leading-[1.08] tracking-[-0.03em] mb-3"
                style={{ fontWeight: 360 }}
              >
                {sindico.nome_completo}
              </motion.h1>

              {/* stats chips */}
              {stats.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  custom={2}
                  className="flex flex-wrap gap-2 mb-5"
                >
                  {stats.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[11px] text-white/50 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1"
                      style={{ fontWeight: 420 }}
                    >
                      {s.icon}
                      {s.label}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* short resume in hero */}
              {sindico.breve_resumo && (
                <motion.p
                  variants={fadeUp}
                  custom={3}
                  className="text-white/35 text-[14px] leading-relaxed max-w-xl mb-7 line-clamp-3"
                  style={{ fontWeight: 400 }}
                >
                  {sindico.breve_resumo}
                </motion.p>
              )}

              {/* CTA row */}
              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex flex-wrap gap-2.5"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="bg-[hsl(var(--green-whatsapp))] hover:bg-[hsl(var(--green-whatsapp))]/90 gap-2 rounded-full h-11 px-7 text-[13px] text-white shadow-lg shadow-[hsl(var(--green-whatsapp))]/15"
                    style={{ fontWeight: 460 }}
                  >
                    <MessageCircle size={15} />
                    Conversar pelo WhatsApp
                  </Button>
                </motion.div>

                {sindico.site_redes_sociais && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      asChild
                      className="gap-1.5 rounded-full h-11 px-6 text-[12px] border-white/10 text-white/60 hover:text-white hover:border-white/20 bg-transparent"
                      style={{ fontWeight: 430 }}
                    >
                      <a
                        href={
                          sindico.site_redes_sociais.startsWith("http")
                            ? sindico.site_redes_sociais
                            : `https://${sindico.site_redes_sociais}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={12} />
                        Site / Redes sociais
                      </a>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== DETAIL BODY ===== */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* ── Main content ── */}
            <div className="lg:col-span-8 space-y-12">
              {/* About */}
              {sindico.breve_resumo && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <motion.p
                    variants={fadeUp}
                    className="text-[10px] text-primary/60 tracking-[0.2em] uppercase mb-3"
                    style={{ fontWeight: 450 }}
                  >
                    Sobre o profissional
                  </motion.p>
                  <motion.div variants={fadeUp} custom={1}>
                    <p
                      className="text-[14px] text-muted-foreground leading-[1.75] whitespace-pre-line max-w-2xl"
                      style={{ fontWeight: 400 }}
                    >
                      {sindico.breve_resumo}
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Specialties as visual grid */}
              {sindico.especialidades.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <motion.p
                    variants={fadeUp}
                    className="text-[10px] text-primary/60 tracking-[0.2em] uppercase mb-4"
                    style={{ fontWeight: 450 }}
                  >
                    Especialidades
                  </motion.p>
                  <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2">
                    {sindico.especialidades.map((esp) => (
                      <span
                        key={esp}
                        className="inline-flex items-center gap-1.5 text-[12px] px-3.5 py-1.5 rounded-full border border-border/40 bg-muted/30 text-foreground/80"
                        style={{ fontWeight: 430 }}
                      >
                        <Award size={10} className="text-primary/50" />
                        {esp}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* YouTube */}
              {sindico.link_youtube && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <motion.p
                    variants={fadeUp}
                    className="text-[10px] text-primary/60 tracking-[0.2em] uppercase mb-4"
                    style={{ fontWeight: 450 }}
                  >
                    Vídeo de apresentação
                  </motion.p>
                  <motion.div variants={fadeUp} custom={1}>
                    <div className="aspect-video rounded-xl overflow-hidden bg-muted/30 border border-border/30">
                      <iframe
                        src={getYouTubeEmbedUrl(sindico.link_youtube)}
                        title="Vídeo de apresentação"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20 lg:self-start">
              {/* Coverage */}
              {(sindico.cidade?.length > 0 || sindico.regioes?.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm p-5"
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={13} className="text-primary/50" />
                    <h3 className="text-[12px] text-foreground" style={{ fontWeight: 460 }}>
                      Área de atuação
                    </h3>
                  </div>
                  {cidadeDisplay && (
                    <p className="text-[13px] text-foreground/80 mb-1" style={{ fontWeight: 430 }}>
                      {cidadeDisplay}
                    </p>
                  )}
                  {sindico.regioes.length > 0 && (
                    <p className="text-[12px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                      {sindico.regioes.join(" · ")}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Experience card */}
              {experienceYears !== null && experienceYears > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className="rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm p-5"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={13} className="text-primary/50" />
                    <h3 className="text-[12px] text-foreground" style={{ fontWeight: 460 }}>
                      Experiência
                    </h3>
                  </div>
                  <p className="text-2xl text-foreground tracking-tight" style={{ fontWeight: 300 }}>
                    {experienceYears}{" "}
                    <span className="text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
                      {experienceYears === 1 ? "ano" : "anos"} de atuação
                    </span>
                  </p>
                  {sindico.ano_inicio_profissao && (
                    <p className="text-[11px] text-muted-foreground/50 mt-1" style={{ fontWeight: 400 }}>
                      Desde {sindico.ano_inicio_profissao}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Sticky CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-primary/10 bg-primary/[0.03] p-5"
              >
                <p className="text-[12px] text-foreground/80 mb-3 leading-relaxed" style={{ fontWeight: 420 }}>
                  Interessado neste profissional? Converse diretamente pelo WhatsApp.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-[hsl(var(--green-whatsapp))] hover:bg-[hsl(var(--green-whatsapp))]/90 gap-2 rounded-full h-10 text-[12px] text-white"
                    style={{ fontWeight: 450 }}
                  >
                    <MessageCircle size={14} />
                    Entrar em contato
                  </Button>
                </motion.div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== RELATED ===== */}
      {otherSindicos.length > 0 && (
        <section className="py-20 md:py-28 section-dark relative overflow-hidden">
          <div className="absolute top-[20%] right-[8%] w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="container relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
            >
              <motion.div variants={fadeUp}>
                <p
                  className="text-[10px] text-primary/50 tracking-[0.2em] uppercase mb-2"
                  style={{ fontWeight: 450 }}
                >
                  Descubra mais
                </p>
                <h2
                  className="text-xl md:text-2xl text-white/90 tracking-[-0.02em]"
                  style={{ fontWeight: 340 }}
                >
                  Outros profissionais
                </h2>
              </motion.div>
              <motion.div variants={fadeUp} custom={1}>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-[11px] text-white/40 hover:text-primary group"
                  style={{ fontWeight: 430 }}
                >
                  <Link to="/sindicos">
                    Ver todos
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {otherSindicos.slice(0, 4).map((s, i) => (
                <motion.div key={s.id} variants={fadeUp} custom={i}>
                  <SindicoCard
                    id={s.id}
                    slug={(s as any).slug || s.id}
                    nome={s.nome_completo}
                    foto={s.foto_url || undefined}
                    resumo={s.breve_resumo || undefined}
                    regioes={s.regioes}
                    especialidades={s.especialidades}
                    cidade={s.cidade}
                    anoInicio={s.ano_inicio_profissao || undefined}
                    preserveFilters={{
                      especialidade: especialidadeFilter,
                      cidade: cidadeFilter,
                      regiao: regiaoFilter,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}
