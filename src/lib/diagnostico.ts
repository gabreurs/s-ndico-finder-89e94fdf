import { supabase } from "@/lib/supabase";
import { PERFIS_GESTAO, PRIORIDADE_DIMENSOES, PROBLEMA_DIMENSOES } from "@/lib/dimensoes";

export interface DiagnosticoRespostas {
  // 1. Localização
  cidade: string;
  estado: string;
  regiao: string;

  // 2. Sobre o condomínio
  tipos: string[];          // dimensões de tipo de empreendimento
  unidades: string;         // pequeno | medio | grande | mega
  torres: string;           // 1 | 2-3 | 4+
  padrao: string;           // alto-padrao | medio-padrao | economico
  funcionarios: string;     // ate-5 | 6-15 | 16-30 | 30+
  lazer: string;            // nenhum | basico | completo
  complexidade: string;     // baixa | media | alta

  // 3. Momento atual
  arrecadacao: string;      // ate-50k | 50-150k | 150-400k | 400k+
  inadimplencia: string;    // baixa | media | alta
  momento_financeiro: string; // equilibrado | apertado | deficitario
  obras: string;            // nenhuma | pequenas | grandes | fachada-retrofit
  novo: string;             // sim | nao  (implantação)
  conflitos: string;        // baixo | moderado | alto
  transicao_gestao: string; // planejada | conturbada | nao-aplica
  problemas_administrativos: string[]; // dimensões de problema
  conselho: string;         // ausente | participativo | muito-atuante
  assembleias: string;      // tranquilas | poucas-participam | tensas
  fornecedores: string;     // estruturados | poucos-contratos | problematico
  equipe_situacao: string;  // estavel | rotatividade | sem-equipe

  // 4. Perfil procurado (opcional)
  perfil_desejado: string[]; // dimensões de perfil desejáveis

  // 5. Três prioridades (peso alto)
  prioridades: string[];

  // 6. Contato — relação com o condomínio
  relacao: string;
}

export interface DiagnosticoLead {
  nome: string;
  whatsapp: string;
  email: string;
  condominio: string;
}

export const respostasIniciais: DiagnosticoRespostas = {
  cidade: "",
  estado: "",
  regiao: "",
  tipos: [],
  unidades: "",
  torres: "",
  padrao: "",
  funcionarios: "",
  lazer: "",
  complexidade: "",
  arrecadacao: "",
  inadimplencia: "",
  momento_financeiro: "",
  obras: "",
  novo: "",
  conflitos: "",
  transicao_gestao: "",
  problemas_administrativos: [],
  conselho: "",
  assembleias: "",
  fornecedores: "",
  equipe_situacao: "",
  perfil_desejado: [],
  prioridades: [],
  relacao: "",
};

/** Requisitos derivados: dimensões que o condomínio realmente exige, com peso. */
export interface Requisito {
  key: string;
  peso: number;   // 1 = desejável, 2 = importante, 3 = crítico, 4 = prioridade escolhida
  origem: string; // por que esse requisito existe
}

export function derivarRequisitos(r: DiagnosticoRespostas): Requisito[] {
  const req: Requisito[] = [];
  const add = (key: string, peso: number, origem: string) => {
    const existente = req.find((x) => x.key === key);
    if (existente) {
      existente.peso = Math.max(existente.peso, peso);
      return;
    }
    req.push({ key, peso, origem });
  };

  // 1. Localização — tratada à parte no matching (evidência de cidade/região).

  // 2. Sobre o condomínio
  r.tipos.forEach((t) => add(t, 2, "Tipo de empreendimento informado"));
  if (r.unidades) add(r.unidades, 2, "Porte do condomínio");
  if (r.padrao) add(r.padrao, r.padrao === "alto-padrao" ? 3 : 1, "Padrão do condomínio");
  if (r.torres === "4+") add("multitorres", 2, "Condomínio com 4 ou mais torres");
  if (r.funcionarios === "16-30" || r.funcionarios === "30+") {
    add("equipe", 3, "Equipe própria numerosa");
    add("operacional", 2, "Equipe própria numerosa");
  } else if (r.funcionarios === "6-15") {
    add("equipe", 2, "Equipe própria intermediária");
  }
  if (r.lazer === "completo") add("operacional", 2, "Estrutura de lazer completa");
  if (r.complexidade === "alta") add("executivo", 2, "Complexidade operacional alta");

  // 3. Momento atual
  if (r.momento_financeiro === "deficitario") {
    add("recuperacao-financeira", 3, "Situação financeira deficitária");
    add("financeiro", 3, "Situação financeira deficitária");
  } else if (r.momento_financeiro === "apertado") {
    add("custos", 2, "Orçamento apertado");
    add("financeiro", 2, "Orçamento apertado");
  }

  if (r.inadimplencia === "alta") {
    add("inadimplencia", 3, "Inadimplência alta");
    add("financeiro", 2, "Inadimplência alta");
  } else if (r.inadimplencia === "media") {
    add("inadimplencia", 2, "Inadimplência relevante");
  }

  if (r.obras === "grandes" || r.obras === "fachada-retrofit") {
    add("obras", 3, "Obras estruturais em curso ou previstas");
    add("tecnico", 2, "Obras estruturais em curso ou previstas");
  } else if (r.obras === "pequenas") {
    add("obras", 1, "Reformas pontuais previstas");
  }

  if (r.novo === "sim") {
    add("implantacao", 3, "Condomínio em implantação");
    add("implantador", 3, "Condomínio em implantação");
  }

  if (r.conflitos === "alto") {
    add("conflitos", 3, "Nível alto de conflitos");
    add("mediador", 3, "Nível alto de conflitos");
  } else if (r.conflitos === "moderado") {
    add("conflitos", 1, "Conflitos pontuais");
  }

  if (r.transicao_gestao === "conturbada") {
    add("transicao-gestao", 2, "Transição de gestão conturbada");
    add("mediador", 2, "Transição de gestão conturbada");
  }

  r.problemas_administrativos.forEach((p) => {
    (PROBLEMA_DIMENSOES[p] ?? []).forEach((d) => add(d, 2, "Problema administrativo relatado"));
  });

  if (r.conselho === "muito-atuante") {
    add("transparencia", 2, "Conselho muito atuante");
    add("mediador", 1, "Conselho muito atuante");
  }
  if (r.conselho === "ausente") add("executivo", 1, "Conselho pouco presente exige autonomia");

  if (r.assembleias === "tensas") {
    add("conflitos", 2, "Assembleias tensas");
    add("mediador", 2, "Assembleias tensas");
  }

  if (r.fornecedores === "problematico") {
    add("custos", 2, "Fornecedores mal geridos");
    add("operacional", 1, "Fornecedores mal geridos");
  }

  if (r.equipe_situacao === "rotatividade" || r.equipe_situacao === "sem-equipe") {
    add("equipe", 2, "Situação da equipe exige reestruturação");
    add("operacional", 1, "Situação da equipe exige reestruturação");
  }

  if (r.unidades === "grande" || r.unidades === "mega") add("executivo", 2, "Escala do condomínio");
  if (r.padrao === "alto-padrao") add("executivo", 3, "Alto padrão");
  if (r.arrecadacao === "400k+") add("executivo", 2, "Orçamento mensal elevado");
  if (r.tipos.includes("comercial") || r.tipos.includes("industrial")) add("executivo", 2, "Empreendimento não residencial");
  if (r.tipos.includes("associacao") || r.tipos.includes("horizontal")) add("juridico", 2, "Loteamento/associação exige regularização");

  // 4. Perfil procurado — peso baixo, é preferência declarada, não crítica.
  r.perfil_desejado.forEach((p) => add(p, 1, "Perfil de gestão preferido pelo condomínio"));

  // 5. Três prioridades — peso alto, é o que mais pesa na recomendação.
  r.prioridades.forEach((p) => {
    (PRIORIDADE_DIMENSOES[p] ?? []).forEach((d) => add(d, 4, "Prioridade escolhida pelo condomínio"));
  });

  return req;
}

export interface PerfilRecomendado {
  key: string;
  score: number;
  motivos: string[];
}

/** Perfil de gestão recomendado — regra explícita, sem caixa-preta. */
export function recomendarPerfis(r: DiagnosticoRespostas): PerfilRecomendado[] {
  const req = derivarRequisitos(r);
  const perfis = PERFIS_GESTAO.map((p) => {
    const diretos = req.filter((x) => x.key === p.key);
    const score = diretos.reduce((acc, x) => acc + x.peso, 0);
    const motivos = Array.from(new Set(diretos.map((x) => x.origem)));
    return { key: p.key, score, motivos };
  });
  return perfis.filter((p) => p.score > 0).sort((a, b) => b.score - a.score);
}

/* ---------------------------------- persistência --------------------------------- */

export interface DiagnosticoRegistro {
  id: string;
  created_at: string;
  nome: string;
  whatsapp: string;
  email: string | null;
  condominio: string | null;
  cidade: string | null;
  regiao: string | null;
  respostas: DiagnosticoRespostas;
  perfil_recomendado: string | null;
  perfis_secundarios: string[] | null;
  sindicos_sugeridos: { id: string; slug: string; nome: string; nivel: string; motivos: string[] }[] | null;
  status: string;
}

export interface SalvarDiagnosticoInput {
  lead: DiagnosticoLead;
  respostas: DiagnosticoRespostas;
  perfil_recomendado: string | null;
  perfis_secundarios: string[];
  sindicos_sugeridos: { id: string; slug: string; nome: string; nivel: string; motivos: string[] }[];
}

export async function salvarDiagnostico(input: SalvarDiagnosticoInput) {
  const payload = {
    nome: input.lead.nome.trim(),
    whatsapp: input.lead.whatsapp.trim(),
    email: input.lead.email.trim() || null,
    condominio: input.lead.condominio.trim() || null,
    cidade: input.respostas.cidade || null,
    regiao: input.respostas.regiao || null,
    // respostas carrega o wizard completo, incluindo campos novos (relacao, prioridades, estado etc.)
    respostas: input.respostas as unknown as Record<string, unknown>,
    perfil_recomendado: input.perfil_recomendado,
    perfis_secundarios: input.perfis_secundarios,
    sindicos_sugeridos: input.sindicos_sugeridos as unknown as Record<string, unknown>[],
  };

  const { data, error } = await supabase.functions.invoke("submit-diagnostico", {
    body: payload,
  });

  if (error) throw error;
  if (!data?.success || !data?.id) throw new Error("Resposta inesperada do servidor");
  return { id: data.id as string };
}


export async function listarDiagnosticos(): Promise<DiagnosticoRegistro[]> {
  const { data, error } = await supabase
    .from("diagnosticos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DiagnosticoRegistro[];
}

export async function atualizarStatusDiagnostico(id: string, status: string) {
  const { error } = await supabase.from("diagnosticos").update({ status }).eq("id", id);
  if (error) throw error;
}
