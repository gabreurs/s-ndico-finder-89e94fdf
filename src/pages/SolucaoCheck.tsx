import { SolucaoLayout } from "@/components/SolucaoLayout";
import { ClipboardCheck, Search, CheckCircle, XCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const ITENS = [
  { ok: true, title: "Verificação de identidade e cadastro", desc: "Confirmação de dados profissionais e presença na base Q1S." },
  { ok: true, title: "Análise de referências", desc: "Conferência de histórico e reputação no mercado." },
  { ok: true, title: "Aderência ao condomínio", desc: "Match entre experiência comprovada e dimensões do diagnóstico." },
  { ok: false, title: "Red flags", desc: "Sinais de alerta que merecem atenção do conselho." },
  { ok: true, title: "Relatório resumido", desc: "Parecer objetivo para apoiar a decisão do conselho." },
];

export default function SolucaoCheck() {
  return (
    <SolucaoLayout
      seo={{
        title: 'Q1S Check — verificação de síndicos profissionais',
        description: 'Checagem estruturada do histórico, repertório e consistência do síndico antes da contratação.',
        path: '/solucoes/check',
      }}
      icon={<ClipboardCheck size={32} />}
      title="Q1S Check"
      subtitle="Auditoria de candidatos a síndico"
      description="Já tem um candidato em mãos? Validamos perfil, referências, formação e aderência ao condomínio antes da decisão final."
      benefits={[
        "Verificação de cadastro e identidade",
        "Análise de referências profissionais",
        "Match com as dimensões do condomínio",
        "Relatório de red flags e pontos de atenção",
        "Parecer resumido para o conselho",
      ]}
      cta={{ label: "Enviar candidato para validação", href: "#whatsapp", whatsapp: true }}
      whatsappMessage="Olá, Rafael. Quero contratar o Q1S Check para validar um candidato a síndico do meu condomínio."
      secondaryCta={{ label: "Ver síndicos já validados", href: "/solucoes/referencias" }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {ITENS.map((item, i) => (
            <motion.div key={i} variants={fadeUp} custom={i * 0.08} className="rounded-xl border border-border/30 bg-card/40 p-5">
              <div className="flex items-center gap-2 mb-3">
                {item.ok ? (
                  <CheckCircle size={16} className="text-emerald-500/70" />
                ) : (
                  <XCircle size={16} className="text-red-400/70" />
                )}
                <h3 className="text-[13px] text-foreground" style={{ fontWeight: 460 }}>{item.title}</h3>
              </div>
              <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 400 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="rounded-xl border border-border/30 bg-muted/20 p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-primary/60" />
            <h3 className="text-[15px] text-foreground" style={{ fontWeight: 460 }}>Entregável</h3>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
            Você recebe um parecer objetivo com status de validação, pontos fortes, lacunas e recomendação final. O conselho decide com mais segurança e menos risco.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
          <Search size={16} className="text-primary/60" />
          O Q1S Check não substitui due diligence jurídica, mas acelera a triagem inicial.
        </motion.div>
      </motion.div>
    </SolucaoLayout>
  );
}
