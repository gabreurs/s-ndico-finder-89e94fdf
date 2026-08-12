import { SolucaoLayout } from "@/components/SolucaoLayout";
import { UserCheck, ShieldCheck, Award, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const PILARES = [
  { icon: <ShieldCheck size={16} />, title: "Curadoria", desc: "Cada perfil passa por aprovação antes de ir ao ar." },
  { icon: <Award size={16} />, title: "Formação", desc: "Registramos formações, certificações e especializações." },
  { icon: <Star size={16} />, title: "Reputação", desc: "Referências e histórico profissional são verificadas." },
  { icon: <Users size={16} />, title: "Experiência comprovada", desc: "Anos de atuação, porte e tipo de condomínios gerenciados." },
];

export default function SolucaoReferencias() {
  return (
    <SolucaoLayout
      seo={{
        title: 'Q1S Referências — checagem de referências de síndicos',
        description: 'Coleta e leitura de referências de condomínios anteriores para decidir com informação real.',
        path: '/solucoes/referencias',
      }}
      icon={<UserCheck size={32} />}
      title="Q1S Referências"
      subtitle="Banco de síndicos validados"
      description="Acesse síndicos profissionais pré-aprovados pela curadoria Quero 1 Síndico. Cada perfil tem dados técnicos, experiência e aderência comprovada."
      benefits={[
        "Acesso a perfis aprovados e verificados",
        "Filtros por cidade, região, especialidade e dimensões",
        "Contato direto pelo WhatsApp",
        "Busca manual com visualização de dossier profissional",
        "Sem custo para o condomínio",
      ]}
      cta={{ label: "Ver banco de referências", href: "/sindicos" }}
      secondaryCta={{ label: "Descobrir o perfil ideal", href: "/diagnostico" }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {PILARES.map((p, i) => (
            <motion.div key={i} variants={fadeUp} custom={i * 0.08} className="rounded-xl border border-border/30 bg-card/40 p-5">
              <div className="text-primary/60 mb-3">{p.icon}</div>
              <h3 className="text-[13px] text-foreground mb-1.5" style={{ fontWeight: 460 }}>{p.title}</h3>
              <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 400 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="rounded-xl border border-border/30 bg-muted/20 p-6">
          <h3 className="text-[15px] text-foreground mb-3" style={{ fontWeight: 460 }}>Quando usar o banco de referências?</h3>
          <ul className="space-y-2">
            {[
              "O condomínio quer conhecer opções antes de abrir uma vaga",
              "Já existe um síndico interino e a busca não é urgente",
              "O conselheiro prefere explorar perfis por conta própria",
              "O perfil desejado é comum e bem atendido pela base",
            ].map((item, i) => (
              <li key={i} className="text-[13px] text-muted-foreground flex items-start gap-2" style={{ fontWeight: 400 }}>
                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </SolucaoLayout>
  );
}
