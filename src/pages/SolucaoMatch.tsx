import { SolucaoLayout } from "@/components/SolucaoLayout";
import { Target, CheckCircle, Users, BarChart3, Clock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const PASSOS = [
  { icon: <CheckCircle size={16} />, title: "Responda 6 perguntas", desc: "Sobre localização, porte, padrão, desafios e perfil desejado." },
  { icon: <BarChart3 size={16} />, title: "Algoritmo por evidência", desc: "Cruzamos suas respostas com dados reais do cadastro dos síndicos." },
  { icon: <Users size={16} />, title: "Shortlist personalizado", desc: "Receba até 6 perfis com nível de aderência e motivos objetivos." },
  { icon: <Clock size={16} />, title: "Contato em minutos", desc: "Fale com a Q1S ou diretamente com os candidatos pré-selecionados." },
];

export default function SolucaoMatch() {
  return (
    <SolucaoLayout
      icon={<Target size={32} />}
      title="Q1S Match"
      subtitle="Diagnóstico + recomendação de síndicos"
      description="Responda o diagnóstico do condomínio e receba uma shortlist de síndicos cuja experiência, especialidades e dimensões comprovadas atendem o seu cenário."
      benefits={[
        "Diagnóstico gratuito do condomínio",
        "Recomendação baseada em dados reais dos cadastros",
        "Motivos objetivos de aderência para cada perfil",
        "Até 6 candidatos pré-selecionados",
        "Contato direto com a Q1S ou com os síndicos",
      ]}
      cta={{ label: "Iniciar diagnóstico", href: "/diagnostico" }}
    >
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="space-y-12">
        <div className="grid sm:grid-cols-2 gap-4">
          {PASSOS.map((p, i) => (
            <motion.div key={i} variants={fadeUp} custom={i * 0.1} className="rounded-xl border border-border/30 bg-card/40 p-5">
              <div className="text-primary/60 mb-3">{p.icon}</div>
              <h3 className="text-[13px] text-foreground mb-1.5" style={{ fontWeight: 460 }}>{p.title}</h3>
              <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 400 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="rounded-xl border border-border/30 bg-muted/20 p-6">
          <h3 className="text-[15px] text-foreground mb-3" style={{ fontWeight: 460 }}>Por que funciona?</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
            Não exibimos percentuais artificiais. Cada motivo de aderência é extraído de dados reais declarados pelo síndico: especialidades, faixa de unidades gerenciadas, diferenciais, formações e porte preferido. Se não houver evidência, mostramos a lacuna de forma transparente.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3 text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
          <ShieldCheck size={16} className="text-primary/60" />
          Dados de contato do condomínio são armazenados com segurança e acesso restrito a administradores.
        </motion.div>
      </motion.div>
    </SolucaoLayout>
  );
}
