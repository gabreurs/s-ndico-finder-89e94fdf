import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SindicoCard } from "@/components/SindicoCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSindicos } from "@/hooks/useSindicos";
import { 
  MapPin, 
  Award, 
  Clock, 
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Sindico = Tables<"sindicos">;

export default function SindicoPerfil() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [sindico, setSindico] = useState<Sindico | null>(null);
  const [loading, setLoading] = useState(true);

  // Get filters from URL params to show related síndicos
  const especialidadeFilter = searchParams.get("especialidade") || "all";
  const cidadeFilter = searchParams.get("cidade") || "all";
  const regiaoFilter = searchParams.get("regiao") || "all";

  const { data: relatedSindicos } = useSindicos({
    especialidade: especialidadeFilter,
    cidade: cidadeFilter,
    regiao: regiaoFilter,
  });

  // Filter out current síndico from related
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

      if (!error && data) {
        setSindico(data);
      }
      setLoading(false);
    }

    fetchSindico();
  }, [id]);

  const getExperienceYears = () => {
    if (!sindico?.ano_inicio_profissao) return null;
    const years = new Date().getFullYear() - sindico.ano_inicio_profissao;
    return years;
  };

  const experienceYears = getExperienceYears();

  const handleWhatsAppClick = () => {
    if (!sindico?.contato_whatsapp) return;
    const phone = sindico.contato_whatsapp.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá ${sindico.nome_completo}! Encontrei seu perfil na plataforma Quero 1 Síndico e gostaria de saber mais sobre seus serviços.`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!sindico) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Síndico não encontrado</h1>
          <Button asChild>
            <Link to="/sindicos">Ver todos os síndicos</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero/Header Section */}
      <section className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-secondary via-primary/80 to-primary" />
        
        <div className="container">
          <div className="relative -mt-20 md:-mt-24 pb-8">
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  {/* Profile Photo */}
                  <div className="shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-muted border-4 border-card shadow-lg">
                      {sindico.foto_url ? (
                        <img
                          src={sindico.foto_url}
                          alt={sindico.nome_completo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <User size={64} className="text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        {sindico.nome_completo}
                      </h1>
                      <p className="text-muted-foreground">Síndico Profissional</p>
                      {sindico.nome_empresa && (
                        <p className="text-sm text-primary font-medium mt-1">
                          {sindico.nome_empresa}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleWhatsAppClick}
                        className="bg-green-whatsapp hover:bg-green-whatsapp/90 text-white gap-2"
                      >
                        <MessageCircle size={18} />
                        Entrar em contato
                      </Button>

                      {sindico.site_redes_sociais && (
                        <Button
                          variant="outline"
                          asChild
                          className="gap-2"
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
                            <ExternalLink size={16} />
                            Site / Redes
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="space-y-6">
              {/* Especialidades */}
              {sindico.especialidades.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Award size={20} />
                    <h3 className="font-semibold">Especialidade:</h3>
                  </div>
                  <ul className="space-y-2">
                    {sindico.especialidades.map((esp) => (
                      <li key={esp} className="text-foreground">
                        {esp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Região de Atuação */}
              {sindico.regioes.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <MapPin size={20} />
                    <h3 className="font-semibold">Região de atuação:</h3>
                  </div>
                  <p className="text-foreground">
                    {sindico.cidade && `${sindico.cidade} - `}
                    {sindico.regioes.join(", ")}
                  </p>
                </div>
              )}

              {/* Tempo de Atuação */}
              {experienceYears !== null && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Clock size={20} />
                    <h3 className="font-semibold">Tempo de atuação:</h3>
                  </div>
                  <p className="text-foreground">
                    {experienceYears} {experienceYears === 1 ? "ano" : "anos"}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - About */}
            <div className="md:col-span-2 space-y-6">
              {/* Breve Resumo */}
              {sindico.breve_resumo && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Award size={20} />
                    <h3 className="font-semibold">Breve resumo:</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {sindico.breve_resumo}
                  </p>
                </div>
              )}

              {/* YouTube Video */}
              {sindico.link_youtube && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-primary mb-4">
                    Vídeo de apresentação
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={getYouTubeEmbedUrl(sindico.link_youtube)}
                      title="Vídeo de apresentação"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Síndicos Carousel */}
      {otherSindicos.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Outros síndicos que podem te interessar
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Baseado nos seus filtros de busca
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherSindicos.slice(0, 4).map((s) => (
                <SindicoCard
                  key={s.id}
                  id={s.id}
                  nome={s.nome_completo}
                  foto={s.foto_url || undefined}
                  regioes={s.regioes}
                  especialidades={s.especialidades}
                  cidade={s.cidade || undefined}
                  preserveFilters={{
                    especialidade: especialidadeFilter,
                    cidade: cidadeFilter,
                    regiao: regiaoFilter,
                  }}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link
                  to={`/sindicos?especialidade=${especialidadeFilter}&cidade=${cidadeFilter}&regiao=${regiaoFilter}`}
                >
                  Ver todos os síndicos
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string {
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}
