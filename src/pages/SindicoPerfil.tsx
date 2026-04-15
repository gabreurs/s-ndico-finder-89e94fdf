import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SindicoCard } from "@/components/SindicoCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSindicos } from "@/hooks/useSindicos";
import { motion } from "framer-motion";
import { MapPin, Award, Clock, User, ExternalLink, MessageCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Sindico = Tables<"sindicos">;

export default function SindicoPerfil() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [sindico, setSindico] = useState<Sindico | null>(null);
  const [loading, setLoading] = useState(true);

  const especialidadeFilter = searchParams.get("especialidade") || "all";
  const cidadeFilter = searchParams.get("cidade") || "all";
  const regiaoFilter = searchParams.get("regiao") || "all";

  const { data: relatedSindicos } = useSindicos({
    especialidade: especialidadeFilter,
    cidade: cidadeFilter,
    regiao: regiaoFilter,
  });

  const otherSindicos = relatedSindicos?.filter((s) => s.id !== id) || [];

  useEffect(() => {
    async function fetchSindico() {
      if (!id) return;
      const { data, error } = await supabase
        .from("sindicos")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (!error && data) setSindico(data);
      setLoading(false);
    }
    fetchSindico();
  }, [id]);

  const experienceYears = sindico?.ano_inicio_profissao
    ? new Date().getFullYear() - sindico.ano_inicio_profissao
    : null;

  const handleWhatsAppClick = () => {
    if (!sindico?.contato_whatsapp) return;
    const phone = sindico.contato_whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá ${sindico.nome_completo}! Encontrei seu perfil no Quero 1 Síndico e gostaria de saber mais sobre seus serviços.`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <h1 className="text-lg text-foreground" style={{ fontWeight: 430 }}>Síndico não encontrado</h1>
          <Button asChild size="sm" className="rounded-full" style={{ fontWeight: 450 }}>
            <Link to="/sindicos">Ver todos</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const cidadeDisplay = Array.isArray(sindico.cidade) ? sindico.cidade.join(", ") : sindico.cidade;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="relative">
        <div className="h-36 md:h-48 gradient-mesh" />

        <div className="container">
          <div className="py-4">
            <PageBreadcrumb items={[
              { label: "Síndicos", href: "/sindicos" },
              { label: sindico.nome_completo },
            ]} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative -mt-14 md:-mt-18 pb-8"
          >
            <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted">
                      {sindico.foto_url ? (
                        <img src={sindico.foto_url} alt={sindico.nome_completo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={40} className="text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h1 className="text-xl md:text-2xl text-foreground tracking-[-0.02em]" style={{ fontWeight: 420 }}>
                        {sindico.nome_completo}
                      </h1>
                      <p className="text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>Síndico profissional</p>
                      {sindico.nome_empresa && (
                        <p className="text-[12px] text-primary/70 mt-0.5" style={{ fontWeight: 450 }}>{sindico.nome_empresa}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleWhatsAppClick} size="sm" className="bg-green-whatsapp hover:bg-green-whatsapp/90 gap-1.5 rounded-full text-[12px]" style={{ fontWeight: 450 }}>
                          <MessageCircle size={13} />
                          Entrar em contato
                        </Button>
                      </motion.div>
                      {sindico.site_redes_sociais && (
                        <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-full text-[12px] border-border/30" style={{ fontWeight: 430 }}>
                          <a href={sindico.site_redes_sociais.startsWith("http") ? sindico.site_redes_sociais : `https://${sindico.site_redes_sociais}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={11} />
                            Site / Redes
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-6">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-4">
              {sindico.especialidades.length > 0 && (
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <div className="flex items-center gap-1.5 text-primary/60 mb-3">
                    <Award size={14} />
                    <h3 className="text-[13px] text-foreground" style={{ fontWeight: 450 }}>Especialidades</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {sindico.especialidades.map((esp) => (
                      <li key={esp} className="text-[13px] text-muted-foreground" style={{ fontWeight: 410 }}>{esp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sindico.regioes.length > 0 && (
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <div className="flex items-center gap-1.5 text-primary/60 mb-3">
                    <MapPin size={14} />
                    <h3 className="text-[13px] text-foreground" style={{ fontWeight: 450 }}>Atuação</h3>
                  </div>
                  <p className="text-[13px] text-muted-foreground" style={{ fontWeight: 410 }}>
                    {cidadeDisplay && `${cidadeDisplay} — `}
                    {sindico.regioes.join(", ")}
                  </p>
                </div>
              )}

              {experienceYears !== null && (
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <div className="flex items-center gap-1.5 text-primary/60 mb-3">
                    <Clock size={14} />
                    <h3 className="text-[13px] text-foreground" style={{ fontWeight: 450 }}>Experiência</h3>
                  </div>
                  <p className="text-[13px] text-muted-foreground" style={{ fontWeight: 410 }}>
                    {experienceYears} {experienceYears === 1 ? "ano" : "anos"} de atuação
                  </p>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              {sindico.breve_resumo && (
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <h3 className="text-[13px] text-foreground mb-3" style={{ fontWeight: 450 }}>Sobre</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line" style={{ fontWeight: 400 }}>
                    {sindico.breve_resumo}
                  </p>
                </div>
              )}

              {sindico.link_youtube && (
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <h3 className="text-[13px] text-foreground mb-3" style={{ fontWeight: 450 }}>Vídeo de apresentação</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={getYouTubeEmbedUrl(sindico.link_youtube)}
                      title="Vídeo de apresentação"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {otherSindicos.length > 0 && (
        <section className="py-12 section-dark">
          <div className="container">
            <div className="mb-6">
              <h2 className="text-base text-white/80 tracking-tight" style={{ fontWeight: 430 }}>Outros profissionais</h2>
              <p className="text-[11px] text-white/25 mt-0.5" style={{ fontWeight: 400 }}>Baseado nos seus filtros de busca</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {otherSindicos.slice(0, 4).map((s) => (
                <SindicoCard
                  key={s.id}
                  id={s.id}
                  nome={s.nome_completo}
                  foto={s.foto_url || undefined}
                  regioes={s.regioes}
                  especialidades={s.especialidades}
                  cidade={s.cidade}
                  preserveFilters={{ especialidade: especialidadeFilter, cidade: cidadeFilter, regiao: regiaoFilter }}
                />
              ))}
            </div>
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
