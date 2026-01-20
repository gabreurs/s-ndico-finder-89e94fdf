import { MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

interface SindicoCardProps {
  id: string;
  nome: string;
  foto?: string;
  regioes: string[];
  especialidades: string[];
  cidade?: string;
}

export function SindicoCard({ id, nome, foto, regioes, especialidades, cidade }: SindicoCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {foto ? (
          <img 
            src={foto} 
            alt={nome} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <User size={64} className="text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground uppercase text-sm mb-2 line-clamp-2">
          {nome}
        </h3>
        
        {(cidade || regioes.length > 0) && (
          <div className="flex items-start gap-1 text-xs text-muted-foreground mb-2">
            <MapPin size={12} className="mt-0.5 shrink-0 text-primary" />
            <span className="line-clamp-1">
              {cidade || regioes.slice(0, 2).join(", ")}
            </span>
          </div>
        )}
        
        {especialidades.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Especialidade: </span>
              <span className="text-primary">{especialidades.slice(0, 2).join(", ")}</span>
              {especialidades.length > 2 && (
                <span className="text-muted-foreground"> +{especialidades.length - 2}</span>
              )}
            </p>
          </div>
        )}
        
        <Link 
          to={`/sindico/${id}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          Ver Perfil
        </Link>
      </div>
    </div>
  );
}
