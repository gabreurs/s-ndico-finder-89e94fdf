import { MapPin, User, ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SindicoCardProps {
  id: string;
  nome: string;
  foto?: string;
  resumo?: string;
  regioes: string[];
  especialidades: string[];
  cidade?: string[];
  anoInicio?: number;
  preserveFilters?: {
    especialidade?: string;
    cidade?: string;
    regiao?: string;
  };
}

export function SindicoCard({ id, nome, foto, resumo, regioes, especialidades, cidade, anoInicio, preserveFilters }: SindicoCardProps) {
  const buildProfileUrl = () => {
    const base = `/sindico/${id}`;
    if (!preserveFilters) return base;
    const params = new URLSearchParams();
    if (preserveFilters.especialidade && preserveFilters.especialidade !== "all") params.set("especialidade", preserveFilters.especialidade);
    if (preserveFilters.cidade && preserveFilters.cidade !== "all") params.set("cidade", preserveFilters.cidade);
    if (preserveFilters.regiao && preserveFilters.regiao !== "all") params.set("regiao", preserveFilters.regiao);
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const cidadeDisplay = Array.isArray(cidade) && cidade.length > 0 ? cidade.join(", ") : null;
  const experiencia = anoInicio ? new Date().getFullYear() - anoInicio : null;
  const truncatedResumo = resumo && resumo.length > 80 ? resumo.slice(0, 80) + "…" : resumo;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      <Link
        to={buildProfileUrl()}
        className="group block bg-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/15 transition-all duration-300"
      >
        <div className="aspect-[4/5] bg-muted relative overflow-hidden">
          {foto ? (
            <img 
              src={foto} 
              alt={`Foto do síndico profissional ${nome}`}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                const fallback = document.createElement('div');
                fallback.className = 'flex items-center justify-center w-full h-full';
                fallback.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted-foreground/30"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                target.parentElement?.appendChild(fallback);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <User size={48} className="text-muted-foreground/25" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={14} className="text-primary-foreground" />
          </div>

          {experiencia !== null && experiencia > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground text-[10px] px-2 py-0.5 rounded-full">
              <Clock size={10} />
              {experiencia}a
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-foreground text-sm mb-1.5 line-clamp-1 tracking-wide" style={{ fontWeight: 450 }}>
            {nome}
          </h3>
          
          {truncatedResumo && (
            <p className="text-muted-foreground text-[11px] leading-relaxed mb-2 line-clamp-2">{truncatedResumo}</p>
          )}

          {(cidadeDisplay || regioes.length > 0) && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-2.5">
              <MapPin size={11} className="shrink-0 text-primary/60" />
              <span className="line-clamp-1">
                {cidadeDisplay || regioes.slice(0, 2).join(", ")}
              </span>
            </div>
          )}
          
          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {especialidades.slice(0, 2).map((esp) => (
                <span key={esp} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/6 text-primary/75">
                  {esp.length > 22 ? esp.slice(0, 22) + "…" : esp}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
