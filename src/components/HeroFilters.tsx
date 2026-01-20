import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESPECIALIDADES, REGIOES, CIDADES } from "@/lib/constants";

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
  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
        Encontre os Melhores Síndicos!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Especialidade
          </label>
          <Select value={especialidade} onValueChange={onEspecialidadeChange}>
            <SelectTrigger>
              <SelectValue placeholder="selecione a especialidade..." />
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
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estado/Cidade
          </label>
          <Select value={cidade} onValueChange={onCidadeChange}>
            <SelectTrigger>
              <SelectValue placeholder="selecione a estado/cidade..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {CIDADES.map((cid) => (
                <SelectItem key={cid} value={cid}>
                  {cid.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Região
          </label>
          <Select value={regiao} onValueChange={onRegiaoChange}>
            <SelectTrigger>
              <SelectValue placeholder="selecione a região..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              {REGIOES.map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
