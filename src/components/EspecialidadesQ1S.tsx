import { Reveal } from "@/components/motion/Reveal";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { ESPECIALIDADES_Q1S } from "@/lib/dimensoes";
import { dimensaoLabel } from "@/lib/dimensoes";

export function EspecialidadesQ1S() {
  return (
    <section className="py-24 md:py-32 section-dark relative overflow-hidden">
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[150px]" />

      <div className="container relative">
        <Reveal stagger className="max-w-2xl mb-14">
          <p className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
            Especialidades Q1S
          </p>
          <h2 className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 350 }}>
            Dimensões combináveis, não caixas isoladas
          </h2>
          <p className="text-white/30 text-sm leading-relaxed" style={{ fontWeight: 400 }}>
            Um condomínio pode ser Alto Padrão + Grande + Obras + Recuperação Financeira ao mesmo tempo. Cada card abaixo é uma combinação de dimensões técnicas.
          </p>
        </Reveal>

        <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" variant="up">
          {ESPECIALIDADES_Q1S.map((esp) => (
            <div
              key={esp.slug}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.05] p-5 hover:bg-white/[0.08] hover:border-primary/30 hover:-translate-y-1 transition-[transform,background-color,border-color,box-shadow] duration-300 hover:shadow-[0_10px_40px_-20px_hsl(var(--primary)/0.5)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Award size={14} className="text-primary/60 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-[13px] text-white/95" style={{ fontWeight: 460 }}>{esp.titulo}</h3>
              </div>
              <p className="text-[12px] text-white/65 leading-relaxed mb-4" style={{ fontWeight: 400 }}>{esp.chamada}</p>
              <div className="flex flex-wrap gap-1.5">
                {esp.dimensoes.slice(0, 3).map((d) => (
                  <span key={d} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.1] text-white/55" style={{ fontWeight: 420 }}>
                    {dimensaoLabel(d)}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Link
                  to={`/especialidades/${esp.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] text-primary/60 hover:text-primary/80 transition-colors group/link"
                  style={{ fontWeight: 430 }}
                >
                  Saiba mais
                  <ArrowRight size={11} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to={`/sindicos?especialidade=${esp.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 transition-colors"
                  style={{ fontWeight: 430 }}
                >
                  Ver perfis
                </Link>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
