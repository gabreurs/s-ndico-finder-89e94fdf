import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <h1 className="text-xl" style={{ fontWeight: 500 }}>Síndico não encontrado</h1>
          <Button asChild size="sm" className="rounded-full">
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
        <div className="h-40 md:h-52 gradient-hero" />
        
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative -mt-16 md:-mt-20 pb-8"
          >
            <div className="bg-card rounded-xl border border-border/30 overflow-hidden">
              <div className="p-5 md:p-7">
                <div className="flex flex-col md:flex-row gap-5 md:gap-7 items-start">
                  <div className="shrink-0">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-muted border-4 border-card">
                      {sindico.foto_url ? (
                        <img src={sindico.foto_url} alt={sindico.nome_completo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={48} className="text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h1 className="text-xl md:text-2xl text-foreground tracking-tight" style={{ fontWeight: 500 }}>
                        {sindico.nome_completo}
                      </h1>
                      <p className="text-sm text-muted-foreground">Síndico profissional</p>
                      {sindico.nome_empresa && (
                        <p className="text-xs text-primary mt-0.5" style={{ fontWeight: 500 }}>{sindico.nome_empresa}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleWhatsAppClick} size="sm" className="bg-green-whatsapp hover:bg-green-whatsapp/90 text-primary-foreground gap-1.5 rounded-full">
                          <MessageCircle size={14} />
                          Entrar em contato
                        </Button>
                      </motion.div>
                      {sindico.site_redes_sociais && (
                        <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-full">
                          <a href={sindico.site_redes_sociais.startsWith("http") ? sindico.site_redes_sociais : `https://${sindico.site_redes_sociais}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={12} />
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
                <div className="bg-card rounded-xl border border-border/30 p-5">
                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    <Award size={16} />
                    <h3 className="text-sm" style={{ fontWeight: 500 }}>Especialidades</h3>
                  </div>
                  <ul className="space-y-1">
                    {sindico.especialidades.map((esp) => (
                      <li key={esp} className="text-sm text-foreground">{esp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sindico.regioes.length > 0 && (
                <div className="bg-card rounded-xl border border-border/30 p-5">
                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    <MapPin size={16} />
                    <h3 className="text-sm" style={{ fontWeight: 500 }}>Atuação</h3>
                  </div>
                  <p className="text-sm text-foreground">
                    {cidadeDisplay && `${cidadeDisplay} — `}
                    {sindico.regioes.join(", ")}
                  </p>
                </div>
              )}

              {experienceYears !== null && (
                <div className="bg-card rounded-xl border border-border/30 p-5">
                  <div className="flex items-center gap-1.5 text-primary mb-3">
                    <Clock size={16} />
                    <h3 className="text-sm" style={{ fontWeight: 500 }}>Experiência</h3>
                  </div>
                  <p className="text-sm text-foreground">
                    {experienceYears} {experienceYears === 1 ? "ano" : "anos"} de atuação
                  </p>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              {sindico.breve_resumo && (
                <div className="bg-card rounded-xl border border-border/30 p-5">
                  <h3 className="text-sm text-primary mb-3" style={{ fontWeight: 500 }}>Sobre</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {sindico.breve_resumo}
                  </p>
                </div>
              )}

              {sindico.link_youtube && (
                <div className="bg-card rounded-xl border border-border/30 p-5">
                  <h3 className="text-sm text-primary mb-3" style={{ fontWeight: 500 }}>Vídeo de apresentação</h3>
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
        <section className="py-10 bg-muted/20">
          <div className="container">
            <div className="mb-6">
              <h2 className="text-lg text-foreground tracking-tight" style={{ fontWeight: 500 }}>
                Outros profissionais
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Baseado nos seus filtros de busca</p>
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
