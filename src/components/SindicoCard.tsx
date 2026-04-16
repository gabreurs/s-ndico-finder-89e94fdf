import { MapPin, User, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SindicoCardProps {
  id: string;
  slug: string;
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

export function SindicoCard({ slug, nome, foto, resumo, regioes, especialidades, cidade, anoInicio, preserveFilters }: SindicoCardProps) {
  const buildProfileUrl = () => {
    const base = `/sindico/${slug}`;
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

  return (
    <Link to={buildProfileUrl()} className="group block">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative h-[320px] rounded-xl overflow-hidden bg-card border border-border/40 hover:border-primary/20 transition-colors duration-400 flex flex-col"
      >
        {/* Image — fixed 160px */}
        <div className="h-[160px] shrink-0 relative overflow-hidden bg-muted">
          {foto ? (
            <img
              src={foto}
              alt={`${nome} — Síndico profissional`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={32} className="text-muted-foreground/20" />
            </div>
          )}

          {/* Experience badge */}
          {experiencia !== null && experiencia > 0 && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-background/80 backdrop-blur-md text-foreground text-[10px] px-2 py-0.5 rounded-full" style={{ fontWeight: 440 }}>
              <Clock size={9} className="text-primary/70" />
              {experiencia}a
            </div>
          )}

          {/* Arrow on hover */}
          <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <ArrowRight size={12} className="text-primary-foreground" />
          </div>
        </div>

        {/* Info — fills remaining space */}
        <div className="flex-1 p-3.5 flex flex-col justify-between min-h-0">
          <div className="space-y-1.5">
            <h3 className="text-foreground text-[13px] tracking-tight line-clamp-1" style={{ fontWeight: 480 }}>
              {nome}
            </h3>

            {cidadeDisplay && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin size={9} className="shrink-0 text-primary/50" />
                <span className="line-clamp-1" style={{ fontWeight: 400 }}>{cidadeDisplay}</span>
              </div>
            )}

            {resumo && (
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed line-clamp-2" style={{ fontWeight: 390 }}>
                {resumo}
              </p>
            )}
          </div>

          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {especialidades.slice(0, 2).map((esp) => (
                <span
                  key={esp}
                  className="text-[9px] px-2 py-0.5 rounded-full bg-primary/[0.07] text-primary/80"
                  style={{ fontWeight: 420 }}
                >
                  {esp.length > 18 ? esp.slice(0, 18) + "…" : esp}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
