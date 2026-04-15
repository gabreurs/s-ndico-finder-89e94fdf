import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col md:flex-row items-stretch md:items-center gap-3 max-w-3xl"
    >
      <div className="flex flex-col sm:flex-row flex-1 gap-2">
        <Select value={especialidade} onValueChange={onEspecialidadeChange}>
          <SelectTrigger className="h-11 rounded-xl bg-white/[0.06] border-white/[0.08] text-white/80 text-[13px] backdrop-blur-md hover:bg-white/[0.1] transition-colors">
            <SelectValue placeholder="Especialidade" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas as especialidades</SelectItem>
            {ESPECIALIDADES.map((esp) => (
              <SelectItem key={esp} value={esp}>{esp}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={cidade} onValueChange={handleCidadeChange}>
          <SelectTrigger className="h-11 rounded-xl bg-white/[0.06] border-white/[0.08] text-white/80 text-[13px] backdrop-blur-md hover:bg-white/[0.1] transition-colors">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas as cidades</SelectItem>
            {CIDADES.map((cid) => (
              <SelectItem key={cid} value={cid}>{cid}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={regiao} onValueChange={onRegiaoChange} disabled={cidade === "all"}>
          <SelectTrigger className="h-11 rounded-xl bg-white/[0.06] border-white/[0.08] text-white/80 text-[13px] backdrop-blur-md hover:bg-white/[0.1] transition-colors disabled:opacity-30">
            <SelectValue placeholder={cidade === "all" ? "Selecione a cidade" : "Região"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas as regiões</SelectItem>
            {availableRegioes.map((reg) => (
              <SelectItem key={reg} value={reg}>{reg}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button asChild className="h-11 px-6 rounded-xl text-[13px] gap-2 whitespace-nowrap" style={{ fontWeight: 420 }}>
          <Link to={buildSearchUrl()}>
            Buscar síndicos
            <ArrowRight size={14} />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
