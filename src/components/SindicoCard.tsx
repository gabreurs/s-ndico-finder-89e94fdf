import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

interface SindicoCardProps {
  id: string;
  nome: string;
  foto?: string;
  regioes: string[];
  especialidades: string[];
  cidade?: string;
  preserveFilters?: {
    especialidade?: string;
    cidade?: string;
    regiao?: string;
  };
}

export function SindicoCard({ id, nome, foto, regioes, especialidades, cidade, preserveFilters }: SindicoCardProps) {
  const buildProfileUrl = () => {
    const base = `/sindico/${id}`;
    if (!preserveFilters) return base;
    
    const params = new URLSearchParams();
    if (preserveFilters.especialidade && preserveFilters.especialidade !== "all") {
      params.set("especialidade", preserveFilters.especialidade);
    }
    if (preserveFilters.cidade && preserveFilters.cidade !== "all") {
      params.set("cidade", preserveFilters.cidade);
    }
    if (preserveFilters.regiao && preserveFilters.regiao !== "all") {
      params.set("regiao", preserveFilters.regiao);
    }
    
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {foto ? (
          <img 
            src={foto} 
            alt={nome} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <User size={64} className="text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-foreground uppercase text-sm mb-3 line-clamp-2 tracking-wide">
          {nome}
        </h3>
        
        {(cidade || regioes.length > 0) && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
            <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
            <span className="line-clamp-1">
              {cidade || regioes.slice(0, 2).join(", ")}
            </span>
          </div>
        )}
        
        {especialidades.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Especialidade: </span>
              <span className="text-primary font-medium">{especialidades.slice(0, 2).join(", ")}</span>
              {especialidades.length > 2 && (
                <span className="text-muted-foreground"> +{especialidades.length - 2}</span>
              )}
            </p>
          </div>
        )}
        
        <Link 
          to={buildProfileUrl()}
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Ver Perfil
        </Link>
      </div>
    </div>
  );
}
