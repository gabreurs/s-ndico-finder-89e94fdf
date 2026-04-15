import { MapPin, User, ArrowRight, Clock } from "lucide-react";
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
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const cidadeDisplay = Array.isArray(cidade) && cidade.length > 0 ? cidade.join(", ") : null;
  const experiencia = anoInicio ? new Date().getFullYear() - anoInicio : null;
  const truncatedResumo = resumo && resumo.length > 100 ? resumo.slice(0, 100) + "…" : resumo;

  return (
    <Link to={buildProfileUrl()} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative rounded-2xl overflow-hidden bg-card border border-border/10 hover:border-primary/10 transition-colors duration-500"
      >
        {/* Image */}
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          {foto ? (
            <img
              src={foto}
              alt={`${nome} — Síndico profissional`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={40} className="text-muted-foreground/20" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Experience badge */}
          {experiencia !== null && experiencia > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/70 backdrop-blur-md text-foreground text-[10px] px-2.5 py-1 rounded-full" style={{ fontWeight: 420 }}>
              <Clock size={10} className="text-primary/70" />
              {experiencia} {experiencia === 1 ? 'ano' : 'anos'}
            </div>
          )}

          {/* Arrow on hover */}
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <ArrowRight size={14} className="text-primary-foreground" />
          </div>

          {/* Name overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            {truncatedResumo && (
              <p className="text-white/80 text-[11px] leading-relaxed line-clamp-2" style={{ fontWeight: 350 }}>
                {truncatedResumo}
              </p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-foreground text-sm tracking-tight line-clamp-1" style={{ fontWeight: 420 }}>
            {nome}
          </h3>

          {cidadeDisplay && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin size={10} className="shrink-0 text-primary/50" />
              <span className="line-clamp-1" style={{ fontWeight: 350 }}>{cidadeDisplay}</span>
            </div>
          )}

          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {especialidades.slice(0, 2).map((esp) => (
                <span
                  key={esp}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary/[0.06] text-primary/70"
                  style={{ fontWeight: 380 }}
                >
                  {esp.length > 20 ? esp.slice(0, 20) + "…" : esp}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
