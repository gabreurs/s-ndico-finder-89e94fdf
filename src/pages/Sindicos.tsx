import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SindicoCard } from "@/components/SindicoCard";
import { useSindicos } from "@/hooks/useSindicos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: sindicos, isLoading } = useSindicos({ especialidade, cidade, regiao });
  const visibleSindicos = sindicos?.slice(0, visibleCount) || [];
  const hasMore = sindicos && sindicos.length > visibleCount;
  const availableRegioes = cidade !== "all" ? CIDADES_REGIOES[cidade] || [] : [];

  const handleCidadeChange = (value: string) => {
    setCidade(value);
    setRegiao("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="bg-muted/30 py-3 border-b border-border/30 sticky top-16 z-40 backdrop-blur-xl">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger className="w-full md:w-[220px] h-9 text-sm rounded-lg border-border/50">
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
              <SelectTrigger className="w-full md:w-[180px] h-9 text-sm rounded-lg border-border/50">
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
              <SelectTrigger className="w-full md:w-[180px] h-9 text-sm rounded-lg border-border/50">
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

      <section className="py-8 flex-1">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-xl h-72" />
              ))}
            </div>
          ) : visibleSindicos.length > 0 ? (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {visibleSindicos.map((sindico, i) => (
                  <motion.div key={sindico.id} variants={fadeUp} custom={i}>
                    <SindicoCard
                      id={sindico.id}
                      nome={sindico.nome_completo}
                      foto={sindico.foto_url || undefined}
                      regioes={sindico.regioes}
                      especialidades={sindico.especialidades}
                      cidade={sindico.cidade}
                      preserveFilters={{ especialidade, cidade, regiao }}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              {hasMore && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="sm" className="rounded-full px-6" onClick={() => setVisibleCount((prev) => prev + 12)}>
                    Ver mais
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm mb-4">Nenhum síndico encontrado com os filtros selecionados.</p>
              <Button asChild size="sm" className="rounded-full">
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
