import type { Sindico } from "@/hooks/useSindicos";
import { dimensaoLabel } from "@/lib/dimensoes";
import { derivarRequisitos, type DiagnosticoRespostas } from "@/lib/diagnostico";

/**
 * Matching por evidência.
 * Um motivo de aderência só aparece quando existe DADO REAL no cadastro do
 * profissional que sustente aquela dimensão. Não usamos percentual artificial:
 * o resultado é um nível de aderência + motivos objetivos + lacunas declaradas.
 */

export interface BioDataLike {
  anos_experiencia?: number;
  faixa_condominios?: string;
  faixa_unidades?: string;
  porte_preferido?: string[];
  diferenciais?: string[];
  formacoes?: string[];
}

export type SindicoComBio = Sindico & { bio_data?: BioDataLike | null };

/** Uma dimensão que o profissional comprova, com a fonte do dado. */
export interface Evidencia {
  dimensao: string;
  fonte: string; // frase objetiva citando o dado do cadastro
}

const ESPECIALIDADE_DIMENSOES: Record<string, string[]> = {
  "associação de moradores (loteamento)": ["associacao", "horizontal"],
  "cond. residencial": ["torre-unica"],
  "cond. comercial": ["comercial"],
  "condomínio comercial": ["comercial"],
  "residencial multitorres": ["multitorres"],
  "condomínio misto (comercial e residencial)": ["misto"],
  "condomínio monousuário (um proprietário)": ["monousuario"],
  "condomínio horizontal (casas)": ["horizontal"],
  "condomínio industrial": ["industrial"],
  "residencial clube": ["clube"],
  "residencial torre única": ["torre-unica"],
};

const DIFERENCIAL_DIMENSOES: Record<string, string[]> = {
  "redução de inadimplência": ["inadimplencia", "financeiro"],
  "transparência financeira e prestação de contas": ["transparencia", "financeiro"],
  "gestão de obras e reformas": ["obras", "tecnico"],
  "mediação de conflitos entre condôminos": ["conflitos", "mediador"],
  "gestão e treinamento de funcionários": ["equipe", "operacional"],
  "acompanhamento jurídico e processos": ["juridico"],
  "modernização tecnológica do condomínio": ["tecnologia"],
  "otimização de despesas e contratos": ["custos", "financeiro"],
  "atendimento próximo e disponível": ["operacional"],
  "implantação de novos condomínios": ["implantacao", "implantador"],
  "regularização documental e fiscal": ["juridico"],
  "sustentabilidade e eficiência energética": ["sustentabilidade"],
};

const FAIXA_UNIDADES_PORTE: Record<string, string[]> = {
  "ate-100": ["pequeno"],
  "100-300": ["medio"],
  "300-700": ["grande"],
  "700+": ["mega", "grande"],
};

const PORTE_PREFERIDO_DIMENSOES: Record<string, string[]> = {
  pequeno: ["pequeno"],
  medio: ["medio"],
  grande: ["grande", "mega"],
  "alto-padrao": ["alto-padrao", "executivo"],
};

/** Palavras-chave no resumo livre do profissional — só vira evidência quando o texto realmente contém o termo. */
const RESUMO_KEYWORDS: Record<string, string[]> = {
  obras: ["obra", "retrofit", "reforma", "fachada"],
  tecnico: ["engenharia", "arquitetura", "fiscalização técnica"],
  "recuperacao-financeira": ["recuperação financeira", "caixa negativo", "reequilíbrio financeiro"],
  financeiro: ["financeiro", "orçamento", "fluxo de caixa"],
  inadimplencia: ["inadimplência", "inadimplente", "cobrança"],
  conflitos: ["conflito", "mediação", "mediador"],
  mediador: ["mediação", "conselho atuante"],
  equipe: ["equipe própria", "funcionários", "gestão de pessoas", "colaboradores"],
  operacional: ["rotina operacional", "manutenção preventiva"],
  juridico: ["jurídico", "regularização", "processos judiciais"],
  transparencia: ["prestação de contas", "transparência"],
  implantacao: ["implantação", "condomínio novo", "entrega de obra"],
  implantador: ["implantação de condomínio", "estruturação inicial"],
  custos: ["redução de custos", "negociação de contratos", "fornecedores"],
  executivo: ["alto padrão", "gestão estratégica", "condomínio de luxo"],
  "alto-padrao": ["alto padrão", "luxo"],
  clube: ["condomínio clube", "área de lazer completa"],
  comercial: ["condomínio comercial", "centro empresarial"],
  grande: ["grande condomínio", "grande porte"],
  mega: ["mega condomínio", "escala"],
};

const norm = (s: string) => s.trim().toLowerCase();

/** Extrai todas as dimensões comprovadas por dados reais do cadastro. */
export function extrairEvidencias(s: SindicoComBio): Evidencia[] {
  const ev: Evidencia[] = [];
  const push = (dimensao: string, fonte: string) => {
    if (!ev.some((e) => e.dimensao === dimensao)) ev.push({ dimensao, fonte });
  };

  (s.especialidades ?? []).forEach((esp) => {
    (ESPECIALIDADE_DIMENSOES[norm(esp)] ?? []).forEach((d) =>
      push(d, `Declara atuação em ${esp.toLowerCase()}`),
    );
  });

  const bio = s.bio_data ?? undefined;

  (bio?.diferenciais ?? []).forEach((dif) => {
    (DIFERENCIAL_DIMENSOES[norm(dif)] ?? []).forEach((d) =>
      push(d, `Diferencial declarado: ${dif.toLowerCase()}`),
    );
  });

  if (bio?.faixa_unidades) {
    (FAIXA_UNIDADES_PORTE[bio.faixa_unidades] ?? []).forEach((d) =>
      push(d, `Gere hoje condomínios na faixa de ${bio.faixa_unidades!.replace("-", " a ").replace("ate", "até")} unidades`),
    );
  }

  (bio?.porte_preferido ?? []).forEach((p) => {
    (PORTE_PREFERIDO_DIMENSOES[p] ?? []).forEach((d) =>
      push(d, `Informa foco em condomínios de ${dimensaoLabel(p).toLowerCase()}`),
    );
  });

  (bio?.formacoes ?? []).forEach((f) => {
    const n = norm(f);
    if (n.includes("engenharia") || n.includes("arquitetura")) push("tecnico", `Formação em ${f}`);
    if (n.includes("direito")) push("juridico", `Formação em ${f}`);
    if (n.includes("contabil")) push("financeiro", `Formação em ${f}`);
    if (n.includes("administra") || n.includes("gestão")) push("executivo", `Formação em ${f}`);
  });

  // Anos de profissão como evidência de senioridade executiva.
  const anos = anosDeExperiencia(s);
  if (anos !== null && anos >= 8) {
    push("executivo", `${anos} anos de atuação como síndico profissional`);
  }

  // Resumo livre (breve_resumo) — busca por termos objetivos, nunca inferência.
  const resumo = s.breve_resumo ? norm(s.breve_resumo) : "";
  if (resumo) {
    Object.entries(RESUMO_KEYWORDS).forEach(([dimensao, termos]) => {
      const achado = termos.find((t) => resumo.includes(t));
      if (achado) push(dimensao, `Menciona "${achado}" no resumo profissional`);
    });
  }

  return ev;
}

export function anosDeExperiencia(s: SindicoComBio): number | null {
  if (s.bio_data?.anos_experiencia) return s.bio_data.anos_experiencia;
  if (s.ano_inicio_profissao) return new Date().getFullYear() - s.ano_inicio_profissao;
  return null;
}

export type NivelAderencia = "alta" | "media" | "baixa";

export interface ResultadoMatch {
  sindico: SindicoComBio;
  nivel: NivelAderencia;
  motivos: string[];
  lacunas: string[];
  criticosAtendidos: number;
  criticosTotais: number;
  cobertura: number; // uso interno de ordenação, não exibido como "%" de match
}

export function avaliarAderencia(
  sindico: SindicoComBio,
  respostas: DiagnosticoRespostas,
): ResultadoMatch {
  const requisitos = derivarRequisitos(respostas);
  const evidencias = extrairEvidencias(sindico);
  const temEvidencia = (k: string) => evidencias.find((e) => e.dimensao === k);

  const motivos: string[] = [];
  const lacunas: string[] = [];
  let pesoTotal = 0;
  let pesoAtendido = 0;
  let criticosTotais = 0;
  let criticosAtendidos = 0;

  requisitos.forEach((req) => {
    pesoTotal += req.peso;
    if (req.peso >= 3) criticosTotais += 1;
    const e = temEvidencia(req.key);
    if (e) {
      pesoAtendido += req.peso;
      if (req.peso >= 3) criticosAtendidos += 1;
      motivos.push(`${dimensaoLabel(req.key)} — ${e.fonte}.`);
    } else if (req.peso >= 3) {
      lacunas.push(`${dimensaoLabel(req.key)} não está comprovado no cadastro.`);
    }
  });

  // Localização — só entra como motivo se houver dado real.
  if (respostas.cidade && (sindico.cidade ?? []).includes(respostas.cidade)) {
    motivos.unshift(`Atende ${respostas.cidade} — cidade declarada de atuação.`);
    pesoAtendido += 2;
    pesoTotal += 2;
  } else if (respostas.cidade) {
    pesoTotal += 2;
    lacunas.push(`Não declara atuação em ${respostas.cidade}.`);
  }
  if (respostas.regiao && (sindico.regioes ?? []).includes(respostas.regiao)) {
    motivos.splice(1, 0, `Atua na região ${respostas.regiao}.`);
  }

  // Experiência — dado objetivo, entra como motivo apenas quando existe.
  const anos = anosDeExperiencia(sindico);
  const exigeSenioridade =
    respostas.padrao === "alto-padrao" ||
    respostas.unidades === "grande" ||
    respostas.unidades === "mega" ||
    respostas.complexidade === "alta";
  if (anos !== null) {
    if (anos >= 8 && !motivos.some((m) => m.includes("anos de atuação"))) {
      motivos.push(`${anos} anos de atuação como síndico profissional.`);
    } else if (exigeSenioridade && anos < 4) {
      lacunas.push(`Experiência declarada de ${anos} ano(s) para um cenário que pede senioridade.`);
    }
  }

  const cobertura = pesoTotal > 0 ? pesoAtendido / pesoTotal : 0;
  const criticosOk = criticosTotais === 0 || criticosAtendidos / criticosTotais >= 0.6;

  let nivel: NivelAderencia = "baixa";
  if (cobertura >= 0.6 && criticosOk) nivel = "alta";
  else if (cobertura >= 0.35) nivel = "media";

  return { sindico, nivel, motivos, lacunas, criticosAtendidos, criticosTotais, cobertura };
}

export function ranquearSindicos(
  sindicos: SindicoComBio[],
  respostas: DiagnosticoRespostas,
  limite = 6,
): ResultadoMatch[] {
  return sindicos
    .map((s) => avaliarAderencia(s, respostas))
    .filter((r) => r.motivos.length > 0)
    .sort((a, b) => {
      if (b.criticosAtendidos !== a.criticosAtendidos) return b.criticosAtendidos - a.criticosAtendidos;
      if (b.cobertura !== a.cobertura) return b.cobertura - a.cobertura;
      return b.motivos.length - a.motivos.length;
    })
    .slice(0, limite);
}

export const NIVEL_LABEL: Record<NivelAderencia, string> = {
  alta: "Alta aderência",
  media: "Boa aderência",
  baixa: "Aderência parcial",
};
