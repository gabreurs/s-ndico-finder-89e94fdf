import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SindicoCard } from "@/components/SindicoCard";
import { useSindicos } from "@/hooks/useSindicos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Sindicos() {
  const [especialidade, setEspecialidade] = useState("all");
  const [cidade, setCidade] = useState("all");
  const [regiao, setRegiao] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: sindicos, isLoading } = useSindicos({
    especialidade,
    cidade,
    regiao,
  });

  const visibleSindicos = sindicos?.slice(0, visibleCount) || [];
  const hasMore = sindicos && sindicos.length > visibleCount;

  // Get regions for selected city
  const availableRegioes = cidade !== "all" ? CIDADES_REGIOES[cidade] || [] : [];

  // Reset region when city changes
  const handleCidadeChange = (value: string) => {
    setCidade(value);
    setRegiao("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Filters */}
      <section className="bg-muted py-4 border-b border-border sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-wrap gap-4">
            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="selecione a especialidade que precisa..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {ESPECIALIDADES.map((esp) => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cidade} onValueChange={handleCidadeChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="selecione a cidade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {CIDADES.map((cid) => (
                  <SelectItem key={cid} value={cid}>
                    {cid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={regiao} 
              onValueChange={setRegiao}
              disabled={cidade === "all"}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={cidade === "all" ? "Selecione uma cidade" : "selecione a região..."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as regiões</SelectItem>
                {availableRegioes.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Síndicos Grid */}
      <section className="py-8 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-80" />
              ))}
            </div>
          ) : visibleSindicos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleSindicos.map((sindico) => (
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
              
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                  >
                    Ver mais
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhum síndico encontrado com os filtros selecionados.
              </p>
              <Button asChild>
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
