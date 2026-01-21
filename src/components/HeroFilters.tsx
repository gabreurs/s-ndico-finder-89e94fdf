import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

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

  // Get regions for selected city
  const availableRegioes = cidade !== "all" ? CIDADES_REGIOES[cidade] || [] : [];

  // Handle city change - reset region when city changes
  const handleCidadeChange = (value: string) => {
    onCidadeChange(value);
    onRegiaoChange("all"); // Reset region when city changes
  };

  return (
    <div className="bg-card rounded-3xl p-8 md:p-10 shadow-2xl max-w-4xl mx-auto border border-border/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
          Encontre os Melhores{" "}
          <span className="text-primary">Síndicos!</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Conectamos você aos melhores profissionais do mercado condominial
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Especialidade
          </label>
          <Select value={especialidade} onValueChange={onEspecialidadeChange}>
            <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
              <SelectValue placeholder="selecione a especialidade..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todas as especialidades</SelectItem>
              {ESPECIALIDADES.map((esp) => (
                <SelectItem key={esp} value={esp}>
                  {esp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Cidade
          </label>
          <Select value={cidade} onValueChange={handleCidadeChange}>
            <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors">
              <SelectValue placeholder="selecione a cidade..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todas as cidades</SelectItem>
              {CIDADES.map((cid) => (
                <SelectItem key={cid} value={cid}>
                  {cid}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Região
          </label>
          <Select 
            value={regiao} 
            onValueChange={onRegiaoChange}
            disabled={cidade === "all"}
          >
            <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors disabled:opacity-50">
              <SelectValue placeholder={cidade === "all" ? "Selecione uma cidade primeiro" : "selecione a região..."} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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

      <Button 
        asChild 
        className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all gap-2"
      >
        <Link to={buildSearchUrl()}>
          <Search size={20} />
          Buscar Síndicos
        </Link>
      </Button>
    </div>
  );
}
