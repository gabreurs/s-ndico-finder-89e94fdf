import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { ESPECIALIDADES_Q1S } from "@/lib/dimensoes";
import { dimensaoLabel } from "@/lib/dimensoes";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: "easeOut" as const },
  }),
};

export function EspecialidadesQ1S() {
  return (
    <section className="py-24 md:py-32 section-dark relative overflow-hidden">
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[150px]" />

      <div className="container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mb-14"
        >
          <motion.p variants={fadeUp} className="text-[11px] text-primary/50 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
            Especialidades Q1S
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-white/90 tracking-[-0.02em] mb-4" style={{ fontWeight: 350 }}>
            Dimensões combináveis, não caixas isoladas
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-white/30 text-sm leading-relaxed" style={{ fontWeight: 400 }}>
            Um condomínio pode ser Alto Padrão + Grande + Obras + Recuperação Financeira ao mesmo tempo. Cada card abaixo é uma combinação de dimensões técnicas.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ESPECIALIDADES_Q1S.map((esp, i) => (
            <motion.div
              key={esp.slug}
              variants={fadeUp}
              custom={i * 0.04}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.05] p-5 hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <Award size={14} className="text-primary/60" />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
