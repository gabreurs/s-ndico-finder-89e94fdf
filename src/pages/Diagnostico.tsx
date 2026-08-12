import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiagnosticoOpcoes } from "@/components/DiagnosticoOpcoes";
import { DiagnosticoResultado } from "@/components/DiagnosticoResultado";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { CIDADES, CIDADES_REGIOES } from "@/lib/constants";
import {
  DESAFIOS,
  PERFIS_GESTAO,
  TIPOS_EMPREENDIMENTO,
  PRIORIDADES,
  PROBLEMAS_ADMINISTRATIVOS,
  RELACOES_CONDOMINIO,
} from "@/lib/dimensoes";
import {
  respostasIniciais,
  recomendarPerfis,
  salvarDiagnostico,
  type DiagnosticoLead,
  type DiagnosticoRespostas,
} from "@/lib/diagnostico";
import { ranquearSindicos, type SindicoComBio } from "@/lib/matching";
import { useSindicos } from "@/hooks/useSindicos";
import { Seo } from "@/components/Seo";

const ESTADOS = ["SP", "RJ", "MG", "PR", "SC", "RS", "BA", "DF", "Outro"];

const PASSOS = ["Localização", "Sobre o condomínio", "Momento atual", "Perfil procurado", "Prioridades", "Contato"];

export default function Diagnostico() {
  const [passo, setPasso] = useState(0);
  const [r, setR] = useState<DiagnosticoRespostas>(respostasIniciais);
  const [lead, setLead] = useState<DiagnosticoLead>({ nome: "", whatsapp: "", email: "", condominio: "" });
  const [salvando, setSalvando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const { toast } = useToast();
  const { data: sindicos } = useSindicos();

  const set = <K extends keyof DiagnosticoRespostas>(k: K, v: DiagnosticoRespostas[K]) =>
    setR((prev) => ({ ...prev, [k]: v }));

  const perfis = useMemo(() => recomendarPerfis(r), [r]);
  const matches = useMemo(
    () => ranquearSindicos((sindicos ?? []) as SindicoComBio[], r),
    [sindicos, r],
  );

  const podeAvancar = () => {
    switch (passo) {
      case 0: return !!r.cidade && r.tipos.length > 0;
      case 1: return !!r.unidades && !!r.funcionarios && !!r.complexidade;
      case 2: return !!r.momento_financeiro && !!r.inadimplencia && !!r.obras && !!r.novo && !!r.conflitos && !!r.conselho;
      case 3: return true; // perfil procurado é sempre opcional
      case 4: return r.prioridades.length === 3;
      default: return true;
    }
  };

  const enviar = async () => {
    if (!lead.nome.trim() || lead.whatsapp.trim().length < 8) {
      toast({ title: "Preencha nome e WhatsApp", variant: "destructive" });
      return;
    }
    if (!r.relacao) {
      toast({ title: "Selecione sua relação com o condomínio", variant: "destructive" });
      return;
    }
    setSalvando(true);
    try {
      await salvarDiagnostico({
        lead,
        respostas: r,
        perfil_recomendado: perfis[0]?.key ?? null,
        perfis_secundarios: perfis.slice(1, 3).map((p) => p.key),
        sindicos_sugeridos: matches.map((m) => ({
          id: m.sindico.id,
          slug: m.sindico.slug,
          nome: m.sindico.nome_completo,
          nivel: m.nivel,
          motivos: m.motivos,
        })),
      });
      setConcluido(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      toast({
        title: "Não foi possível registrar seu diagnóstico",
        description: e?.message ?? "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  if (concluido) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Seo title={'Diagnóstico do condomínio — descubra o perfil de síndico ideal'} description={'Responda ao diagnóstico Q1S e receba o perfil de síndico recomendado e profissionais com aderência ao seu contexto.'} path={'/diagnostico'} />
        <Header />
        <main className="flex-1 container py-10">
          <PageBreadcrumb items={[{ label: "Diagnóstico" }]} className="mb-6" />
          <DiagnosticoResultado respostas={r} perfis={perfis} matches={matches} lead={lead} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-10 max-w-3xl">
        <PageBreadcrumb items={[{ label: "Diagnóstico" }]} className="mb-6" />

        <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-3" style={{ fontWeight: 450 }}>
          Diagnóstico do condomínio
        </p>
        <h1 className="text-2xl md:text-3xl text-foreground tracking-[-0.02em] mb-6" style={{ fontWeight: 350 }}>
          Antes de indicar um síndico, entendemos o seu condomínio
        </h1>

        {/* Progresso */}
        <div className="flex items-center gap-1.5 mb-2">
          {PASSOS.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                i <= passo ? "bg-primary/70" : "bg-border/40"
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mb-8" style={{ fontWeight: 400 }}>
          Etapa {passo + 1} de {PASSOS.length} — {PASSOS[passo]}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={passo}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* 1. Localização */}
            {passo === 0 && (
              <>
                <DiagnosticoOpcoes
                  label="Em qual cidade fica o condomínio?"
                  opcoes={CIDADES.map((c) => ({ value: c, label: c }))}
                  value={r.cidade}
                  onChange={(v) => { set("cidade", v); set("regiao", ""); }}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Estado"
                  descricao="Quando aplicável — ajuda em cidades com nomes repetidos."
                  opcoes={ESTADOS.map((e) => ({ value: e, label: e }))}
                  value={r.estado}
                  onChange={(v) => set("estado", v)}
                  colunas={3}
                />
                {r.cidade && (CIDADES_REGIOES[r.cidade] ?? []).length > 0 && (
                  <DiagnosticoOpcoes
                    label="Região"
                    descricao="Opcional, mas ajuda a priorizar profissionais próximos."
                    opcoes={(CIDADES_REGIOES[r.cidade] ?? []).map((x) => ({ value: x, label: x }))}
                    value={r.regiao}
                    onChange={(v) => set("regiao", v)}
                    colunas={3}
                  />
                )}
                <DiagnosticoOpcoes
                  label="Que tipo de empreendimento é?"
                  descricao="Pode marcar mais de um."
                  opcoes={TIPOS_EMPREENDIMENTO.map((t) => ({ value: t.key, label: t.label, hint: t.descricao }))}
                  value={r.tipos}
                  onChange={(v) => set("tipos", v)}
                  multi
                />
              </>
            )}

            {/* 2. Sobre o condomínio */}
            {passo === 1 && (
              <>
                <DiagnosticoOpcoes
                  label="Quantas unidades?"
                  opcoes={[
                    { value: "pequeno", label: "Até 100 unidades" },
                    { value: "medio", label: "100 a 300 unidades" },
                    { value: "grande", label: "300 a 700 unidades" },
                    { value: "mega", label: "Mais de 700 unidades" },
                  ]}
                  value={r.unidades}
                  onChange={(v) => set("unidades", v)}
                />
                <DiagnosticoOpcoes
                  label="Quantas torres ou blocos?"
                  opcoes={[
                    { value: "1", label: "Torre única" },
                    { value: "2-3", label: "2 a 3 torres" },
                    { value: "4+", label: "4 ou mais" },
                  ]}
                  value={r.torres}
                  onChange={(v) => set("torres", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Qual o padrão do condomínio?"
                  opcoes={[
                    { value: "alto-padrao", label: "Alto padrão" },
                    { value: "medio-padrao", label: "Padrão médio" },
                    { value: "economico", label: "Padrão econômico" },
                  ]}
                  value={r.padrao}
                  onChange={(v) => set("padrao", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Quantos funcionários próprios?"
                  opcoes={[
                    { value: "ate-5", label: "Até 5" },
                    { value: "6-15", label: "6 a 15" },
                    { value: "16-30", label: "16 a 30" },
                    { value: "30+", label: "Mais de 30" },
                  ]}
                  value={r.funcionarios}
                  onChange={(v) => set("funcionarios", v)}
                />
                <DiagnosticoOpcoes
                  label="Estrutura de lazer"
                  opcoes={[
                    { value: "nenhum", label: "Praticamente nenhuma" },
                    { value: "basico", label: "Básica" },
                    { value: "completo", label: "Completa (clube)" },
                  ]}
                  value={r.lazer}
                  onChange={(v) => set("lazer", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Complexidade operacional"
                  descricao="O quanto a rotina de gestão exige presença e estrutura."
                  opcoes={[
                    { value: "baixa", label: "Baixa" },
                    { value: "media", label: "Média" },
                    { value: "alta", label: "Alta" },
                  ]}
                  value={r.complexidade}
                  onChange={(v) => set("complexidade", v)}
                  colunas={3}
                />
              </>
            )}

            {/* 3. Momento atual */}
            {passo === 2 && (
              <>
                <DiagnosticoOpcoes
                  label="Arrecadação mensal aproximada"
                  opcoes={[
                    { value: "ate-50k", label: "Até R$ 50 mil" },
                    { value: "50-150k", label: "R$ 50 mil a R$ 150 mil" },
                    { value: "150-400k", label: "R$ 150 mil a R$ 400 mil" },
                    { value: "400k+", label: "Acima de R$ 400 mil" },
                  ]}
                  value={r.arrecadacao}
                  onChange={(v) => set("arrecadacao", v)}
                />
                <DiagnosticoOpcoes
                  label="Momento financeiro"
                  opcoes={[
                    { value: "equilibrado", label: "Equilibrado", hint: "Contas em dia e fundo de reserva saudável" },
                    { value: "apertado", label: "Apertado", hint: "Fecha o mês no limite" },
                    { value: "deficitario", label: "Deficitário", hint: "Dívidas ou caixa negativo" },
                  ]}
                  value={r.momento_financeiro}
                  onChange={(v) => set("momento_financeiro", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Nível de inadimplência"
                  opcoes={[
                    { value: "baixa", label: "Baixa", hint: "Até 5%" },
                    { value: "media", label: "Média", hint: "5% a 15%" },
                    { value: "alta", label: "Alta", hint: "Acima de 15%" },
                  ]}
                  value={r.inadimplencia}
                  onChange={(v) => set("inadimplencia", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Obras em curso ou previstas"
                  opcoes={[
                    { value: "nenhuma", label: "Nenhuma" },
                    { value: "pequenas", label: "Reformas pontuais" },
                    { value: "grandes", label: "Obras estruturais" },
                    { value: "fachada-retrofit", label: "Fachada / retrofit" },
                  ]}
                  value={r.obras}
                  onChange={(v) => set("obras", v)}
                />
                <DiagnosticoOpcoes
                  label="O condomínio é novo / em implantação?"
                  opcoes={[
                    { value: "sim", label: "Sim, em implantação" },
                    { value: "nao", label: "Não, já em operação" },
                  ]}
                  value={r.novo}
                  onChange={(v) => set("novo", v)}
                />
                <DiagnosticoOpcoes
                  label="Nível de conflito entre condôminos"
                  opcoes={[
                    { value: "baixo", label: "Baixo" },
                    { value: "moderado", label: "Moderado" },
                    { value: "alto", label: "Alto" },
                  ]}
                  value={r.conflitos}
                  onChange={(v) => set("conflitos", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Há transição de gestão em curso?"
                  descricao="Troca de síndico ou de administradora."
                  opcoes={[
                    { value: "nao-aplica", label: "Não se aplica" },
                    { value: "planejada", label: "Sim, planejada" },
                    { value: "conturbada", label: "Sim, conturbada" },
                  ]}
                  value={r.transicao_gestao}
                  onChange={(v) => set("transicao_gestao", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Existem problemas administrativos hoje?"
                  descricao="Opcional. Pode marcar mais de um."
                  opcoes={PROBLEMAS_ADMINISTRATIVOS.map((p) => ({ value: p.key, label: p.label, hint: p.descricao }))}
                  value={r.problemas_administrativos}
                  onChange={(v) => set("problemas_administrativos", v)}
                  multi
                />
                <DiagnosticoOpcoes
                  label="Como é o conselho?"
                  opcoes={[
                    { value: "ausente", label: "Pouco presente" },
                    { value: "participativo", label: "Participativo" },
                    { value: "muito-atuante", label: "Muito atuante" },
                  ]}
                  value={r.conselho}
                  onChange={(v) => set("conselho", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Como são as assembleias?"
                  opcoes={[
                    { value: "tranquilas", label: "Tranquilas" },
                    { value: "poucas-participam", label: "Baixa participação" },
                    { value: "tensas", label: "Tensas" },
                  ]}
                  value={r.assembleias}
                  onChange={(v) => set("assembleias", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Como estão os fornecedores?"
                  opcoes={[
                    { value: "estruturados", label: "Estruturados" },
                    { value: "poucos-contratos", label: "Poucos contratos formalizados" },
                    { value: "problematico", label: "Situação problemática" },
                  ]}
                  value={r.fornecedores}
                  onChange={(v) => set("fornecedores", v)}
                  colunas={3}
                />
                <DiagnosticoOpcoes
                  label="Como está a equipe hoje?"
                  opcoes={[
                    { value: "estavel", label: "Estável" },
                    { value: "rotatividade", label: "Alta rotatividade" },
                    { value: "sem-equipe", label: "Sem equipe própria" },
                  ]}
                  value={r.equipe_situacao}
                  onChange={(v) => set("equipe_situacao", v)}
                  colunas={3}
                />
              </>
            )}

            {/* 4. Perfil procurado (opcional) */}
            {passo === 3 && (
              <DiagnosticoOpcoes
                label="Existe um perfil de gestão preferido?"
                descricao="Opcional — nunca é obrigatório. Pode marcar mais de um repertório desejável."
                opcoes={PERFIS_GESTAO.map((p) => ({ value: p.key, label: p.label, hint: p.descricao }))}
                value={r.perfil_desejado}
                onChange={(v) => set("perfil_desejado", v)}
                multi
              />
            )}

            {/* 5. Três prioridades */}
            {passo === 4 && (
              <DiagnosticoOpcoes
                label="Quais são as 3 principais prioridades desta gestão?"
                descricao="Escolha exatamente 3. A ordem de escolha pesa bastante na análise de aderência."
                opcoes={PRIORIDADES.map((d) => ({ value: d.key, label: d.label, hint: d.descricao }))}
                value={r.prioridades}
                onChange={(v) => set("prioridades", v)}
                multi
                max={3}
              />
            )}

            {/* 6. Contato */}
            {passo === 5 && (
              <div className="rounded-2xl border border-border/30 bg-card p-6">
                <p className="text-sm text-foreground mb-1" style={{ fontWeight: 450 }}>
                  Para onde enviamos o resultado?
                </p>
                <p className="text-[12px] text-muted-foreground mb-5" style={{ fontWeight: 390 }}>
                  Registramos o diagnóstico e um especialista pode acompanhar o processo com o condomínio.
                </p>
                <div className="space-y-3">
                  <Input
                    placeholder="Seu nome"
                    value={lead.nome}
                    onChange={(e) => setLead({ ...lead, nome: e.target.value })}
                    className="h-10 text-sm rounded-lg"
                  />
                  <Input
                    placeholder="WhatsApp com DDD"
                    value={lead.whatsapp}
                    onChange={(e) => setLead({ ...lead, whatsapp: e.target.value })}
                    className="h-10 text-sm rounded-lg"
                  />
                  <Input
                    placeholder="E-mail"
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="h-10 text-sm rounded-lg"
                  />
                  <Input
                    placeholder="Nome do condomínio"
                    value={lead.condominio}
                    onChange={(e) => setLead({ ...lead, condominio: e.target.value })}
                    className="h-10 text-sm rounded-lg"
                  />
                </div>
                <div className="mt-5">
                  <DiagnosticoOpcoes
                    label="Qual sua relação com o condomínio?"
                    opcoes={RELACOES_CONDOMINIO}
                    value={r.relacao}
                    onChange={(v) => set("relacao", v)}
                    colunas={3}
                  />
                </div>
                <Button
                  onClick={enviar}
                  disabled={salvando}
                  className="mt-2 h-11 px-7 rounded-full text-[13px] gap-2 w-full sm:w-auto"
                  style={{ fontWeight: 450 }}
                >
                  {salvando ? <Loader2 size={14} className="animate-spin" /> : null}
                  Ver o resultado do diagnóstico
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            size="sm"
            disabled={passo === 0}
            onClick={() => setPasso((p) => Math.max(0, p - 1))}
            className="gap-1.5 text-[12px]"
          >
            <ArrowLeft size={13} /> Voltar
          </Button>
          {passo < PASSOS.length - 1 && (
            <Button
              size="sm"
              disabled={!podeAvancar()}
              onClick={() => { setPasso((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="rounded-full px-6 h-9 text-[12px] gap-1.5"
              style={{ fontWeight: 450 }}
            >
              Continuar <ArrowRight size={13} />
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
