import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeroFiltersProps {
  especialidade: string;
  cidade: string;
  regiao: string;
  onEspecialidadeChange: (value: string) => void;
  onCidadeChange: (value: string) => void;
  onRegiaoChange: (value: string) => void;
}

export function HeroFilters({
  especialidade,
  cidade,
  regiao,
  onEspecialidadeChange,
  onCidadeChange,
  onRegiaoChange,
}: HeroFiltersProps) {
  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (especialidade !== "all") params.set("especialidade", especialidade);
    if (cidade !== "all") params.set("cidade", cidade);
    if (regiao !== "all") params.set("regiao", regiao);
    const query = params.toString();
    return query ? `/sindicos?${query}` : "/sindicos";
  };

  const availableRegioes = cidade !== "all" ? CIDADES_REGIOES[cidade] || [] : [];

  const handleCidadeChange = (value: string) => {
    onCidadeChange(value);
    onRegiaoChange("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-card/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 max-w-3xl mx-auto border border-border/30"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-foreground mb-2 tracking-tight" style={{ fontWeight: 500 }}>
          Encontre o síndico{" "}
          <span className="text-primary">ideal</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Profissionais qualificados para cada tipo de condomínio
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Especialidade</label>
          <Select value={especialidade} onValueChange={onEspecialidadeChange}>
            <SelectTrigger className="h-10 rounded-lg border-border/50 bg-muted/30 text-sm">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">Todas</SelectItem>
              {ESPECIALIDADES.map((esp) => (
                <SelectItem key={esp} value={esp}>{esp}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Cidade</label>
          <Select value={cidade} onValueChange={handleCidadeChange}>
            <SelectTrigger className="h-10 rounded-lg border-border/50 bg-muted/30 text-sm">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">Todas</SelectItem>
              {CIDADES.map((cid) => (
                <SelectItem key={cid} value={cid}>{cid}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">Região</label>
          <Select value={regiao} onValueChange={onRegiaoChange} disabled={cidade === "all"}>
            <SelectTrigger className="h-10 rounded-lg border-border/50 bg-muted/30 text-sm disabled:opacity-40">
              <SelectValue placeholder={cidade === "all" ? "Cidade primeiro" : "Selecione..."} />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all">Todas</SelectItem>
              {availableRegioes.map((reg) => (
                <SelectItem key={reg} value={reg}>{reg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button 
          asChild 
          className="w-full h-11 text-sm rounded-lg gap-2 transition-all"
        >
          <Link to={buildSearchUrl()}>
            <Search size={16} />
            Buscar síndicos
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
