import { MapPin, User, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SindicoCardProps {
  id: string;
  nome: string;
  foto?: string;
  regioes: string[];
  especialidades: string[];
  cidade?: string[];
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

  const cidadeDisplay = Array.isArray(cidade) ? cidade.join(", ") : cidade;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        to={buildProfileUrl()}
        className="group block bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/20 transition-colors"
      >
        <div className="aspect-[4/5] bg-muted relative overflow-hidden">
          {foto ? (
            <img 
              src={foto} 
              alt={`Síndico profissional ${nome}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <User size={48} className="text-muted-foreground/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={14} className="text-primary-foreground" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-foreground text-sm mb-2 line-clamp-1 tracking-wide" style={{ fontWeight: 500 }}>
            {nome}
          </h3>
          
          {(cidadeDisplay || regioes.length > 0) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <MapPin size={12} className="shrink-0 text-primary/70" />
              <span className="line-clamp-1">
                {cidadeDisplay || regioes.slice(0, 2).join(", ")}
              </span>
            </div>
          )}
          
          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {especialidades.slice(0, 2).map((esp) => (
                <span
                  key={esp}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary/80"
                >
                  {esp.length > 20 ? esp.slice(0, 20) + "…" : esp}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
