import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SindicoCard } from "@/components/SindicoCard";
import { useSindicos } from "@/hooks/useSindicos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
};

export default function Sindicos() {
  const [especialidade, setEspecialidade] = useState("all");
  const [cidade, setCidade] = useState("all");
  const [regiao, setRegiao] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: sindicos, isLoading } = useSindicos({ especialidade, cidade, regiao });
  
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
      <Header />
      
      {/* Hero */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl md:text-3xl text-secondary-foreground mb-2 tracking-tight" style={{ fontWeight: 450 }}>
              Síndicos Profissionais
            </h1>
            <p className="text-secondary-foreground/60 text-sm max-w-lg">
              Explore perfis verificados e encontre o profissional ideal para seu condomínio em São Paulo e região.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-card/80 py-4 border-b border-border/20 sticky top-16 z-40 backdrop-blur-xl">
        <div className="container">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, cidade..."
                className="h-9 text-sm pl-9 rounded-lg border-border/30 bg-muted/30"
              />
            </div>

            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger className="w-full md:w-[200px] h-9 text-sm rounded-lg border-border/30 bg-muted/30">
                <SelectValue placeholder="Especialidade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {ESPECIALIDADES.map((esp) => (
                  <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cidade} onValueChange={handleCidadeChange}>
              <SelectTrigger className="w-full md:w-[170px] h-9 text-sm rounded-lg border-border/30 bg-muted/30">
                <SelectValue placeholder="Cidade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {CIDADES.map((cid) => (
                  <SelectItem key={cid} value={cid}>{cid}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regiao} onValueChange={setRegiao} disabled={cidade === "all"}>
              <SelectTrigger className="w-full md:w-[170px] h-9 text-sm rounded-lg border-border/30 bg-muted/30">
                <SelectValue placeholder={cidade === "all" ? "Cidade primeiro" : "Região..."} />
              </SelectTrigger>
              <SelectContent>
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
      <section className="py-8 flex-1">
        <div className="container">
          {!isLoading && (
            <p className="text-xs text-muted-foreground mb-5">
              {filteredSindicos.length} {filteredSindicos.length === 1 ? "profissional encontrado" : "profissionais encontrados"}
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted/50 animate-pulse rounded-2xl h-80" />
              ))}
            </div>
          ) : visibleSindicos.length > 0 ? (
            <>
              <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {visibleSindicos.map((sindico, i) => (
                  <motion.div key={sindico.id} variants={fadeUp} custom={i}>
                    <SindicoCard
                      id={sindico.id}
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
                <div className="text-center mt-10">
                  <Button variant="outline" size="sm" className="rounded-full px-7 border-border/30" onClick={() => setVisibleCount((prev) => prev + 12)}>
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm mb-4">Nenhum síndico encontrado com os filtros selecionados.</p>
              <Button asChild size="sm" className="rounded-full px-6">
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
