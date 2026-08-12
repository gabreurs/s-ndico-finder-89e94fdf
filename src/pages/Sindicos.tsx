import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SindicoCard } from "@/components/SindicoCard";
import { useSindicos } from "@/hooks/useSindicos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, SlidersHorizontal, AlertTriangle, RefreshCw } from "lucide-react";
import { Seo } from "@/components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.04 },
  }),
};

export default function Sindicos() {
  // Filtros podem chegar pela URL (links de especialidades, campanhas, compartilhamento).
  const [searchParams, setSearchParams] = useSearchParams();
  const [especialidade, setEspecialidade] = useState(searchParams.get("especialidade") || "all");
  const [cidade, setCidade] = useState(searchParams.get("cidade") || "all");
  const [regiao, setRegiao] = useState(searchParams.get("regiao") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: sindicos, isLoading, isError, error, refetch, isFetching } = useSindicos({ especialidade, cidade, regiao });

  // Mantém a URL em sincronia com os filtros ativos.
  useEffect(() => {
    const next = new URLSearchParams();
    if (especialidade !== "all") next.set("especialidade", especialidade);
    if (cidade !== "all") next.set("cidade", cidade);
    if (regiao !== "all") next.set("regiao", regiao);
    setSearchParams(next, { replace: true });
  }, [especialidade, cidade, regiao, setSearchParams]);

  const filteredSindicos = sindicos?.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.nome_completo.toLowerCase().includes(q) ||
      s.breve_resumo?.toLowerCase().includes(q) ||
      s.especialidades.some((e) => e.toLowerCase().includes(q)) ||
      s.cidade.some((c) => c.toLowerCase().includes(q)) ||
      s.regioes.some((r) => r.toLowerCase().includes(q))
    );
  }) || [];

  const visibleSindicos = filteredSindicos.slice(0, visibleCount);
  const hasMore = filteredSindicos.length > visibleCount;
  const availableRegioes = cidade !== "all" ? CIDADES_REGIOES[cidade] || [] : [];

  const handleCidadeChange = (value: string) => {
    setCidade(value);
    setRegiao("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title={'Síndicos profissionais — busca por especialidade, cidade e região'} description={'Consulte síndicos profissionais aprovados e filtre por especialidade, cidade e região para encontrar o repertório certo.'} path={'/sindicos'} />
      <Header />

      {/* Hero */}
      <section ref={heroRef} className="gradient-mesh py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/[0.05] blur-[100px]" />
        <motion.div style={{ opacity: heroOpacity }} className="container relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <PageBreadcrumb items={[{ label: "Síndicos" }]} variant="dark" className="mb-6" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-white/90 mb-3 tracking-[-0.02em]" style={{ fontWeight: 320 }}>
              Síndicos Profissionais
            </h1>
            <p className="text-white/35 text-sm max-w-lg leading-relaxed" style={{ fontWeight: 400 }}>
              Explore perfis verificados e encontre o profissional ideal para seu condomínio em São Paulo e região.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="py-3 border-b border-border/30 sticky top-14 z-40 bg-background/85 backdrop-blur-2xl">
        <div className="container">
          <div className="flex flex-wrap gap-2.5 items-center">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, cidade..."
                className="h-9 text-[13px] pl-9 rounded-lg border-border/30 bg-muted/30"
                style={{ fontWeight: 420 }}
              />
            </div>

            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger className="w-full md:w-[190px] h-9 text-[13px] rounded-lg border-border/30 bg-muted/30" style={{ fontWeight: 420 }}>
                <SelectValue placeholder="Especialidade..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {ESPECIALIDADES.map((esp) => (
                  <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cidade} onValueChange={handleCidadeChange}>
              <SelectTrigger className="w-full md:w-[160px] h-9 text-[13px] rounded-lg border-border/30 bg-muted/30" style={{ fontWeight: 420 }}>
                <SelectValue placeholder="Cidade..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todas as cidades</SelectItem>
                {CIDADES.map((cid) => (
                  <SelectItem key={cid} value={cid}>{cid}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regiao} onValueChange={setRegiao} disabled={cidade === "all"}>
              <SelectTrigger className="w-full md:w-[160px] h-9 text-[13px] rounded-lg border-border/30 bg-muted/30" style={{ fontWeight: 420 }}>
                <SelectValue placeholder={cidade === "all" ? "Cidade primeiro" : "Região..."} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todas as regiões</SelectItem>
                {availableRegioes.map((reg) => (
                  <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 flex-1">
        <div className="container">
          {!isLoading && !isError && (
            <p className="text-[11px] text-muted-foreground/60 mb-6" style={{ fontWeight: 420 }}>
              {filteredSindicos.length} {filteredSindicos.length === 1 ? "profissional encontrado" : "profissionais encontrados"}
            </p>
          )}

          {isError ? (
            <div className="text-center py-24 max-w-md mx-auto">
              <AlertTriangle size={28} className="text-destructive/70 mx-auto mb-4" />
              <p className="text-foreground text-sm mb-2" style={{ fontWeight: 450 }}>
                Não conseguimos carregar os síndicos agora.
              </p>
              <p className="text-muted-foreground text-[13px] mb-5" style={{ fontWeight: 400 }}>
                Houve uma falha na consulta ao banco de dados. Isso não significa que a base esteja vazia.
              </p>
              <Button size="sm" className="rounded-full px-6 gap-2" style={{ fontWeight: 450 }} onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw size={13} className={isFetching ? "animate-spin" : undefined} />
                Tentar novamente
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted/20 animate-pulse rounded-xl h-[320px]" />
              ))}
            </div>
          ) : visibleSindicos.length > 0 ? (
            <>
              <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {visibleSindicos.map((sindico, i) => (
                  <motion.div key={sindico.id} variants={fadeUp} custom={i}>
                    <SindicoCard
                      id={sindico.id}
                      slug={(sindico as any).slug || sindico.id}
                      nome={sindico.nome_completo}
                      foto={sindico.foto_url || undefined}
                      resumo={sindico.breve_resumo || undefined}
                      regioes={sindico.regioes}
                      especialidades={sindico.especialidades}
                      cidade={sindico.cidade}
                      anoInicio={sindico.ano_inicio_profissao || undefined}
                      preserveFilters={{ especialidade, cidade, regiao }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-8 border-border/30 text-[12px]"
                    style={{ fontWeight: 430 }}
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                  >
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-sm mb-4" style={{ fontWeight: 400 }}>Nenhum síndico encontrado com os filtros selecionados.</p>
              <Button asChild size="sm" className="rounded-full px-6" style={{ fontWeight: 450 }}>
                <Link to="/cadastro">Cadastre-se como síndico</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
