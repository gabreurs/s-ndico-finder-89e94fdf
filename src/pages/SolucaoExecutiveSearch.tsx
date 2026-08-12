import { SolucaoLayout } from "@/components/SolucaoLayout";
import { Search, Lock, UserCog, FileSearch, Phone, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const ETAPAS = [
  { icon: <FileSearch size={16} />, title: "Briefing exclusivo", desc: "Entendemos a fundo o perfil do condomínio, desafios e expectativas do conselho." },
  { icon: <Search size={16} />, title: "Caça ativa", desc: "Mapeamos a base Q1S e o mercado externo para encontrar candidatos alinhados." },
  { icon: <UserCog size={16} />, title: "Triagem técnica", desc: "Entrevistas, verificação de referências e análise de aderência." },
  { icon: <Phone size={16} />, title: "Entrevista de alinhamento", desc: "Condomínio e candidatos se conhecem com mediação da Q1S." },
  { icon: <CalendarCheck size={16} />, title: "Acompanhamento pós-contratação", desc: "Check-ins para garantir integração e resultados rápidos." },
];

export default function SolucaoExecutiveSearch() {
  return (
    <SolucaoLayout
      icon={<Search size={32} />}
      title="Q1S Executive Search"
      subtitle="Recrutamento dedicado de síndicos"
      description="Para condomínios que não podem esperar ou que exigem um perfil muito específico. Abre uma vaga exclusiva e caçamos o síndico ideal com dedicação total."
      benefits={[
        "Vaga exclusiva e dedicada",
        "Mapeamento da base Q1S + mercado externo",
        "Entrevistas técnicas e comportamentais",
        "Verificação de referências",
        "Mediação na proposta e contrato",
        "Acompanhamento pós-contratação",
      ]}
      cta={{ label: "Solicitar vaga exclusiva", href: "https://api.whatsapp.com/send/?phone=5511960841033&text&type=phone_number&app_absent=0", whatsapp: true }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-8">
        <div className="rounded-xl border border-border/30 bg-card/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-primary/60" />
            <h3 className="text-[15px] text-foreground" style={{ fontWeight: 460 }}>Quando indicar?</h3>
          </div>
          <ul className="space-y-2">
            {[
              "Condomínio em crise financeira ou recuperação judicial",
              "Alto padrão com exigência elevada de serviço",
              "Grandes empreendimentos com múltiplas torres",
              "Substituição urgente com alta sensibilidade política",
              "Condomínio novo em implantação",
            ].map((item, i) => (
              <li key={i} className="text-[13px] text-muted-foreground flex items-start gap-2" style={{ fontWeight: 400 }}>
                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {ETAPAS.map((e, i) => (
            <motion.div key={i} variants={fadeUp} custom={i * 0.08} className="flex items-start gap-4 rounded-xl border border-border/30 bg-card/40 p-5">
              <div className="text-primary/60 shrink-0">{e.icon}</div>
              <div>
                <h3 className="text-[13px] text-foreground mb-1" style={{ fontWeight: 460 }}>{e.title}</h3>
                <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 400 }}>{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SolucaoLayout>
  );
}
