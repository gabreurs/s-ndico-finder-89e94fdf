import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Search, ClipboardCheck, UserCheck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const SOLUCOES = [
  {
    slug: "match",
    icon: <Target size={20} />,
    title: "Q1S Match",
    subtitle: "Diagnóstico + recomendação",
    desc: "Responda sobre seu condomínio e receba os perfis de síndicos com maior aderência técnica.",
    cta: "Conhecer o Q1S Match",
    href: "/solucoes/match",
    color: "text-primary/70",
  },
  {
    slug: "executive-search",
    icon: <Search size={20} />,
    title: "Q1S Executive Search",
    subtitle: "Recrutamento exclusivo",
    desc: "Vaga fechada e dedicada: caçamos o síndico ideal para cenários complexos ou alta escala.",
    cta: "Conhecer o Executive Search",
    href: "/solucoes/executive-search",
    color: "text-accent/70",
  },
  {
    slug: "check",
    icon: <ClipboardCheck size={20} />,
    title: "Q1S Check",
    subtitle: "Auditoria de candidatos",
    desc: "Já tem um candidato? Validamos referências, histórico, formação e aderência ao condomínio.",
    cta: "Conhecer o Q1S Check",
    href: "/solucoes/check",
    color: "text-emerald-400/70",
  },
  {
    slug: "referencias",
    icon: <UserCheck size={20} />,
    title: "Q1S Referências",
    subtitle: "Banco de profissionais validados",
    desc: "Acesse síndicos pré-aprovados pela curadoria Quero 1 Síndico e pela reputação do mercado.",
    cta: "Conhecer o Q1S Referências",
    href: "/solucoes/referencias",
    color: "text-amber-400/70",
  },
];

export function SolucoesQ1S() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] rounded-full ambient-glow-accent" />

      <div className="container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mb-14"
        >
          <motion.p variants={fadeUp} className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
            Soluções Q1S
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-4" style={{ fontWeight: 350 }}>
            Mais de uma forma de encontrar o síndico certo
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 400 }}>
            Do match automático ao recrutamento exclusivo, oferecemos camadas de serviço para cada grau de urgência e complexidade.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {SOLUCOES.map((sol, i) => (
            <motion.div
              key={sol.slug}
              variants={fadeUp}
              custom={i * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
              className="group rounded-xl border border-border/30 bg-card/50 p-6 hover:border-primary/20 hover:bg-card/80 transition-all duration-300"
            >
              <div className={`mb-4 ${sol.color}`}>{sol.icon}</div>
              <p className="text-[10px] text-muted-foreground/60 mb-1" style={{ fontWeight: 500 }}>{sol.subtitle}</p>
              <h3 className="text-[15px] text-foreground mb-2" style={{ fontWeight: 460 }}>{sol.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-5" style={{ fontWeight: 400 }}>{sol.desc}</p>
              <Link
                to={sol.href}
                className="inline-flex items-center gap-1.5 text-[12px] text-primary/70 hover:text-primary transition-colors group/link"
                style={{ fontWeight: 430 }}
              >
                {sol.cta}
                <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
