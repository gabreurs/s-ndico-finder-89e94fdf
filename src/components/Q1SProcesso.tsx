import { motion } from "framer-motion";
import { ClipboardList, Search, Filter, Users, BarChart3, Phone, FileCheck, Handshake, Rocket } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const PASSOS = [
  {
    num: "01",
    icon: <ClipboardList size={18} />,
    title: "Briefing do condomínio",
    desc: "Entendemos o perfil do empreendimento, desafios e expectativas do conselho.",
  },
  {
    num: "02",
    icon: <Search size={18} />,
    title: "Mapeamento da base",
    desc: "Cruzamos cidade, região, porte, especialidades e dimensões do diagnóstico.",
  },
  {
    num: "03",
    icon: <Filter size={18} />,
    title: "Triagem curada",
    desc: "Avaliamos aderência real: só apresentamos profissionais com dados que sustentam o match.",
  },
  {
    num: "04",
    icon: <Users size={18} />,
    title: "Shortlist de perfis",
    desc: "Entregamos de 3 a 6 candidatos pré-qualificados, com motivos objetivos de aderência.",
  },
  {
    num: "05",
    icon: <BarChart3 size={18} />,
    title: "Validação de referências",
    desc: "Conferimos histórico, formação e portfólio compatível com a vaga.",
  },
  {
    num: "06",
    icon: <Phone size={18} />,
    title: "Entrevista de alinhamento",
    desc: "Conversamos com o condomínio e os candidatos para garantir fit cultural e técnico.",
  },
  {
    num: "07",
    icon: <FileCheck size={18} />,
    title: "Proposta e contrato",
    desc: "Apoiamos na estrutura de remuneração, escopo e formalização da relação.",
  },
  {
    num: "08",
    icon: <Handshake size={18} />,
    title: "Onboarding do síndico",
    desc: "Acompanhamento inicial para acelerar a integração e primeiras entregas.",
  },
  {
    num: "09",
    icon: <Rocket size={18} />,
    title: "Acompanhamento contínuo",
    desc: "Check-ins periódicos para garantir que a gestão evolua com excelência.",
  },
];

export function Q1SProcesso() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[140px]" />

      <div className="container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mb-16"
        >
          <motion.p variants={fadeUp} className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
            Metodologia Q1S
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-4" style={{ fontWeight: 350 }}>
            Headhunter de síndicos: do briefing à entrega
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-sm leading-relaxed" style={{ fontWeight: 400 }}>
            Não somos um diretório. Aplicamos uma metodologia de recrutamento e seleção para encontrar o síndico certo para cada condomínio.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PASSOS.map((passo, i) => (
            <motion.div
              key={passo.num}
              variants={fadeUp}
              custom={i * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 400 } }}
              className="group relative rounded-xl border border-border/30 bg-card/50 p-5 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary/60 group-hover:text-primary/80 transition-colors">
                  {passo.icon}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/50 mb-1" style={{ fontWeight: 500 }}>{passo.num}</p>
                  <h3 className="text-[13px] text-foreground mb-1.5" style={{ fontWeight: 460 }}>{passo.title}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>{passo.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
