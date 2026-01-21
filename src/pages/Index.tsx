import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFilters } from "@/components/HeroFilters";
import { SindicoCard } from "@/components/SindicoCard";
import { useSindicos } from "@/hooks/useSindicos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles, Zap, Target, Users } from "lucide-react";
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
      icon: <Sparkles className="w-6 h-6" />,
      title: "Plataforma gratuita",
      description: "Nossa plataforma gratuita oferece uma maneira acessível e eficaz para conectar síndicos e empregadores.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Rapidez na contratação",
      description: "Simplificamos o processo para que empregadores descubram síndicos qualificados e especializados.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Assertividade na escolha",
      description: "Analise perfis detalhados, avaliações e recomendações para escolher o síndico ideal.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Diversos profissionais",
      description: "Acesso ágil a uma diversidade de especializações em síndicos para atender às suas necessidades.",
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
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
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                <span className="w-8 h-0.5 bg-primary rounded-full" />
                Síndicos na plataforma
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
                Conheça alguns dos síndicos<br />
                profissionais disponíveis
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-2xl h-96" />
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
            <div className="text-center py-16 bg-muted/50 rounded-3xl border border-border">
              <p className="text-muted-foreground text-lg mb-6">
                Ainda não há síndicos aprovados na plataforma.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/cadastro">Seja o primeiro a se cadastrar!</Link>
              </Button>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 gap-2">
              <Link to="/sindicos">
                Ver todos os síndicos
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4">
                <span className="w-8 h-0.5 bg-primary rounded-full" />
                Sobre nós
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                O Quero1síndico está<br />
                <span className="text-primary">mudando o mercado</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                A gestão de um condomínio é uma tarefa complexa que requer habilidades administrativas e conhecimentos específicos para lidar com os desafios cotidianos.
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Encontrar o síndico ideal para liderar e gerenciar o condomínio é uma parte crucial desse processo. É aí que nós agimos, uma plataforma inovadora que simplifica, democratiza e agiliza o processo de contratação de síndicos.
              </p>
              <Button asChild size="lg" className="rounded-full px-8 gap-2">
                <Link to="/como-funciona">
                  Como funciona?
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center shadow-2xl">
                <div className="text-center p-8">
                  <span className="text-8xl mb-4 block">🏢</span>
                  <p className="text-lg font-semibold text-foreground">Gestão condominial moderna</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4 mx-auto">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Benefícios
              <span className="w-8 h-0.5 bg-primary rounded-full" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Por que usar o Quero1síndico?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-foreground text-lg mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                <span className="w-8 h-0.5 bg-primary rounded-full" />
                Depoimentos
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                O que nossos usuários dizem
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-gradient-to-br from-secondary via-secondary to-primary/80 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
                Cadastre-se como síndico e apareça para milhares de condomínios que buscam profissionais qualificados.
              </p>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-secondary hover:bg-white/90 rounded-full px-10 h-14 text-lg font-semibold shadow-xl"
              >
                <Link to="/cadastro">Cadastre-se Gratuitamente</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
