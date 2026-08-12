import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight, User } from "lucide-react";
import { perfilDescricao, perfilLabel, dimensaoLabel } from "@/lib/dimensoes";
import { derivarRequisitos, type DiagnosticoLead, type DiagnosticoRespostas, type PerfilRecomendado } from "@/lib/diagnostico";
import { NIVEL_LABEL, type ResultadoMatch } from "@/lib/matching";
import { WHATSAPP_URL } from "@/lib/whatsapp";

interface Props {
  respostas: DiagnosticoRespostas;
  perfis: PerfilRecomendado[];
  matches: ResultadoMatch[];
  lead: DiagnosticoLead;
}

const nivelClasse: Record<string, string> = {
  alta: "bg-primary/10 text-primary border-primary/25",
  media: "bg-accent/10 text-accent border-accent/25",
  baixa: "bg-muted text-muted-foreground border-border/40",
};

export function DiagnosticoResultado({ respostas, perfis, matches, lead }: Props) {
  const principal = perfis[0];
  const requisitosCriticos = derivarRequisitos(respostas).filter((x) => x.peso >= 3);

  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
          Diagnóstico registrado
        </p>
        <h1 className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-3" style={{ fontWeight: 350 }}>
          {lead.condominio ? `Resultado para ${lead.condominio}` : "Resultado do seu diagnóstico"}
        </h1>
        <p className="text-sm text-muted-foreground mb-10 max-w-xl leading-relaxed" style={{ fontWeight: 390 }}>
          Recebemos suas respostas. Abaixo está o perfil de gestão indicado para o momento do condomínio e os profissionais da base com aderência sustentada por dados do cadastro.
        </p>
      </motion.div>

      {/* Perfil recomendado */}
      {principal && (
        <div className="rounded-2xl border border-border/30 bg-card p-6 mb-6">
          <p className="text-[11px] text-muted-foreground tracking-[0.18em] uppercase mb-2" style={{ fontWeight: 450 }}>
            Perfil indicado
          </p>
          <h2 className="text-xl text-foreground mb-2" style={{ fontWeight: 400 }}>
            {perfilLabel(principal.key)}
          </h2>
          <p className="text-[13px] text-muted-foreground mb-4" style={{ fontWeight: 390 }}>
            {perfilDescricao(principal.key)}
          </p>
          <ul className="space-y-1.5">
            {principal.motivos.map((m) => (
              <li key={m} className="flex gap-2 text-[12px] text-muted-foreground" style={{ fontWeight: 390 }}>
                <CheckCircle2 size={13} className="text-primary/60 mt-0.5 shrink-0" />
                {m}
              </li>
            ))}
          </ul>
          {perfis.length > 1 && (
            <p className="text-[12px] text-muted-foreground/70 mt-4" style={{ fontWeight: 390 }}>
              Perfis complementares: {perfis.slice(1, 3).map((p) => perfilLabel(p.key)).join(" · ")}
            </p>
          )}
        </div>
      )}

      {/* Requisitos críticos */}
      {requisitosCriticos.length > 0 && (
        <div className="rounded-2xl border border-border/30 bg-muted/20 p-6 mb-10">
          <p className="text-[12px] text-foreground mb-3" style={{ fontWeight: 450 }}>
            O que este condomínio exige do próximo síndico
          </p>
          <div className="flex flex-wrap gap-1.5">
            {requisitosCriticos.map((req) => (
              <span
                key={req.key}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border/40 bg-card text-muted-foreground"
                style={{ fontWeight: 400 }}
              >
                {dimensaoLabel(req.key)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Profissionais */}
      <h2 className="text-lg text-foreground mb-1" style={{ fontWeight: 400 }}>
        Profissionais com aderência ao seu cenário
      </h2>
      <p className="text-[12px] text-muted-foreground mb-6" style={{ fontWeight: 390 }}>
        Cada motivo abaixo vem de um dado declarado no cadastro do profissional. Nada é estimado.
      </p>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-border/30 bg-muted/10 p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4" style={{ fontWeight: 390 }}>
            Ainda não há profissionais na base com dados suficientes para sustentar aderência a este cenário. Um especialista vai conduzir a busca manualmente.
          </p>
          <Button asChild size="sm" className="rounded-full px-6 h-9 text-[12px]" style={{ fontWeight: 450 }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Falar com um especialista</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m, i) => (
            <motion.div
              key={m.sindico.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/30 bg-card p-5"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                  {m.sindico.foto_url ? (
                    <img src={m.sindico.foto_url} alt={m.sindico.nome_completo} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={18} className="text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-sm text-foreground" style={{ fontWeight: 450 }}>{m.sindico.nome_completo}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${nivelClasse[m.nivel]}`} style={{ fontWeight: 450 }}>
                      {NIVEL_LABEL[m.nivel]}
                    </span>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {m.motivos.slice(0, 5).map((motivo) => (
                      <li key={motivo} className="flex gap-2 text-[12px] text-muted-foreground" style={{ fontWeight: 390 }}>
                        <CheckCircle2 size={12} className="text-primary/60 mt-[3px] shrink-0" />
                        {motivo}
                      </li>
                    ))}
                  </ul>
                  {m.lacunas.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {m.lacunas.slice(0, 2).map((l) => (
                        <li key={l} className="flex gap-2 text-[11px] text-muted-foreground/70" style={{ fontWeight: 390 }}>
                          <AlertCircle size={12} className="mt-[3px] shrink-0" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button asChild variant="ghost" size="sm" className="h-7 px-0 text-[12px] gap-1 text-primary hover:bg-transparent">
                    <Link to={`/sindico/${m.sindico.slug}`}>
                      Ver dossiê <ArrowRight size={12} />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border/30 bg-muted/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[13px] text-foreground" style={{ fontWeight: 420 }}>
          Quer que a Q1S conduza a busca e a seleção junto ao conselho?
        </p>
        <Button asChild size="sm" className="rounded-full px-6 h-9 text-[12px] shrink-0" style={{ fontWeight: 450 }}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Falar com um especialista</a>
        </Button>
      </div>
    </div>
  );
}
