import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFilters } from "@/components/HeroFilters";
import { SindicoCard } from "@/components/SindicoCard";
import { useSindicos } from "@/hooks/useSindicos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Star } from "lucide-react";
import heroImage from "@/assets/hero-city.jpg";

const Index = () => {
  const [especialidade, setEspecialidade] = useState("all");
  const [cidade, setCidade] = useState("all");
  const [regiao, setRegiao] = useState("all");

  const { data: sindicos, isLoading } = useSindicos({
    especialidade,
    cidade,
    regiao,
  });

  const featuredSindicos = sindicos?.slice(0, 4) || [];

  const benefits = [
    {
      icon: "💰",
      title: "Plataforma gratuita",
      description: "Nossa plataforma gratuita oferece uma maneira acessível e eficaz para conectar síndicos e empregadores, proporcionando um ambiente inclusivo para o avanço da sua carreira.",
    },
    {
      icon: "⚡",
      title: "Rapidez na contratação",
      description: "Simplificamos o processo para que empregadores descubram síndicos qualificados e especializados em seu setor. Isso possibilita decisões mais rápidas e eficientes.",
    },
    {
      icon: "🎯",
      title: "Assertividade na escolha",
      description: "Garantimos que suas decisões sejam tomadas com confiança e precisão. Analise perfis detalhados, avaliações e recomendações para escolher o síndico ideal.",
    },
    {
      icon: "👥",
      title: "Diversos profissionais disponíveis",
      description: "Proporcionamos acesso ágil e descomplicado a uma diversidade de especializações em síndicos para atender às suas necessidades.",
    },
  ];

  const testimonials = [
    {
      name: "Lucas Mendes",
      role: "Conselheiro",
      text: "Como conselheiro de um condomínio residencial, encontrar o síndico era sempre um desafio. Com a plataforma esse desafio se tornou uma tarefa simplificada e rápida.",
      rating: 5,
    },
    {
      name: "Peninsula Síndicos",
      role: "Administradora",
      text: "Como administradora, o Quero 1 síndico se tornou uma ferramenta indispensável. A facilidade em encontrar síndicos ideais para os condomínios que gerenciamos aumentou nossa eficiência operacional.",
      rating: 5,
    },
    {
      name: "Leonardo Vila",
      role: "Síndico profissional",
      text: "A plataforma 'Quero um síndico' foi um divisor de águas na minha carreira como síndico. Ter novos contatos regularmente é ótimo.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        
        <div className="relative container py-16 md:py-24">
          <HeroFilters
            especialidade={especialidade}
            cidade={cidade}
            regiao={regiao}
            onEspecialidadeChange={setEspecialidade}
            onCidadeChange={setCidade}
            onRegiaoChange={setRegiao}
          />
        </div>
      </section>

      {/* Featured Síndicos */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary text-sm">📋 Síndicos que já estão na plataforma</span>
          </div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Conheça alguns dos síndicos profissionais disponíveis<br />
              para contratação em São Paulo.
            </h2>
            <div className="hidden md:flex items-center gap-2">
              <button className="w-8 h-8 rounded border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-80" />
              ))}
            </div>
          ) : featuredSindicos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSindicos.map((sindico) => (
                <SindicoCard
                  key={sindico.id}
                  id={sindico.id}
                  nome={sindico.nome_completo}
                  foto={sindico.foto_url || undefined}
                  regioes={sindico.regioes}
                  especialidades={sindico.especialidades}
                  cidade={sindico.cidade || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground mb-4">
                Ainda não há síndicos aprovados na plataforma.
              </p>
              <Button asChild>
                <Link to="/cadastro">Seja o primeiro a se cadastrar!</Link>
              </Button>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/sindicos">Ver todos os síndicos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                O Quero1síndico está mudando o mercado
              </h2>
              <p className="text-muted-foreground mb-4">
                A gestão de um condomínio é uma tarefa complexa que requer habilidades administrativas e conhecimentos específicos para lidar com os desafios cotidianos.
              </p>
              <p className="text-muted-foreground mb-6">
                Encontrar o síndico ideal para liderar e gerenciar o condomínio é uma parte crucial desse processo. É aí que nós agimos, uma plataforma inovadora que simplifica, democratiza e agiliza o processo de contratação de síndicos.
              </p>
              <Button asChild>
                <Link to="/como-funciona">Como funciona?</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-6xl">🏢</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Estamos ao seu lado para você ter sucesso na gestão condominial
              </h2>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center mt-8">
                <span className="text-8xl">👨‍💼</span>
              </div>
            </div>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan to-primary flex items-center justify-center text-xl">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary text-sm">💬 Depoimento de síndicos e empregadores</span>
          </div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              O que nossos usuários dizem
            </h2>
            <div className="hidden md:flex items-center gap-2">
              <button className="w-8 h-8 rounded border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{testimonial.text}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A seleção do síndico adequado para liderar e administrar o condomínio é de extrema importância. Estamos comprometidos em auxiliá-lo nesse processo.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/faq">Ver todas as perguntas</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
