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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-xl p-3 max-w-3xl"
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <Select value={especialidade} onValueChange={onEspecialidadeChange}>
          <SelectTrigger className="h-10 rounded-lg bg-white/[0.05] border-white/[0.06] text-white/70 text-[13px] hover:bg-white/[0.08] transition-colors" style={{ fontWeight: 420 }}>
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
          <SelectTrigger className="h-10 rounded-lg bg-white/[0.05] border-white/[0.06] text-white/70 text-[13px] hover:bg-white/[0.08] transition-colors" style={{ fontWeight: 420 }}>
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
          <SelectTrigger className="h-10 rounded-lg bg-white/[0.05] border-white/[0.06] text-white/70 text-[13px] hover:bg-white/[0.08] transition-colors disabled:opacity-25" style={{ fontWeight: 420 }}>
            <SelectValue placeholder={cidade === "all" ? "Selecione a cidade" : "Região"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas as regiões</SelectItem>
            {availableRegioes.map((reg) => (
              <SelectItem key={reg} value={reg}>{reg}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="shrink-0">
          <Button asChild className="h-10 px-5 rounded-lg text-[13px] gap-1.5 w-full sm:w-auto" style={{ fontWeight: 450 }}>
            <Link to={buildSearchUrl()}>
              Buscar
              <ArrowRight size={13} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
