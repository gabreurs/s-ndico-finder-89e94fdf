// Taxonomia interna do Q1S.
// As "Especialidades Q1S" são apresentadas juntas na interface, mas internamente
// são DIMENSÕES COMBINÁVEIS: tipo de empreendimento, porte/padrão, situação/desafio
// e perfil de gestão. Um condomínio pode ser Alto Padrão + Grande + Obras + Recuperação.

export type DimensaoTipo = "tipo" | "porte" | "padrao" | "desafio" | "perfil";

export interface Dimensao {
  key: string;
  label: string;
  tipo: DimensaoTipo;
  descricao: string;
}

/** Tipo de empreendimento */
export const TIPOS_EMPREENDIMENTO: Dimensao[] = [
  { key: "torre-unica", label: "Residencial torre única", tipo: "tipo", descricao: "Edifício residencial único." },
  { key: "multitorres", label: "Residencial multitorres", tipo: "tipo", descricao: "Mais de uma torre no mesmo terreno." },
  { key: "clube", label: "Residencial clube", tipo: "tipo", descricao: "Grande área de lazer e equipe ampliada." },
  { key: "horizontal", label: "Condomínio horizontal", tipo: "tipo", descricao: "Casas, ruas internas e infraestrutura urbana." },
  { key: "comercial", label: "Condomínio comercial", tipo: "tipo", descricao: "Salas, lajes ou centro empresarial." },
  { key: "misto", label: "Condomínio misto", tipo: "tipo", descricao: "Uso residencial e comercial no mesmo empreendimento." },
  { key: "industrial", label: "Condomínio industrial", tipo: "tipo", descricao: "Galpões e operação logística." },
  { key: "associacao", label: "Associação de moradores", tipo: "tipo", descricao: "Loteamento com associação." },
  { key: "monousuario", label: "Condomínio monousuário", tipo: "tipo", descricao: "Um único proprietário." },
];

/** Porte */
export const PORTES: Dimensao[] = [
  { key: "pequeno", label: "Condomínio pequeno", tipo: "porte", descricao: "Até 100 unidades." },
  { key: "medio", label: "Condomínio médio", tipo: "porte", descricao: "De 100 a 300 unidades." },
  { key: "grande", label: "Grande condomínio", tipo: "porte", descricao: "De 300 a 700 unidades." },
  { key: "mega", label: "Condomínio de grande escala", tipo: "porte", descricao: "Mais de 700 unidades." },
];

/** Padrão */
export const PADROES: Dimensao[] = [
  { key: "alto-padrao", label: "Alto padrão", tipo: "padrao", descricao: "Exigência elevada de serviço e discrição." },
  { key: "medio-padrao", label: "Padrão médio", tipo: "padrao", descricao: "Equilíbrio entre custo e serviço." },
  { key: "economico", label: "Padrão econômico", tipo: "padrao", descricao: "Controle de custo como prioridade." },
];

/** Situação / desafio */
export const DESAFIOS: Dimensao[] = [
  { key: "obras", label: "Obras e reformas", tipo: "desafio", descricao: "Retrofit, fachada, reformas estruturais." },
  { key: "recuperacao-financeira", label: "Recuperação financeira", tipo: "desafio", descricao: "Caixa negativo, dívidas, reequilíbrio." },
  { key: "inadimplencia", label: "Inadimplência", tipo: "desafio", descricao: "Redução e recuperação de crédito." },
  { key: "conflitos", label: "Gestão de conflitos", tipo: "desafio", descricao: "Mediação entre condôminos e assembleias tensas." },
  { key: "implantacao", label: "Implantação", tipo: "desafio", descricao: "Condomínio novo, entrega e primeira gestão." },
  { key: "equipe", label: "Gestão de equipes", tipo: "desafio", descricao: "Funcionários próprios, escalas e treinamento." },
  { key: "juridico", label: "Jurídico e regularização", tipo: "desafio", descricao: "Processos, documentação e conformidade." },
  { key: "transparencia", label: "Transparência e prestação de contas", tipo: "desafio", descricao: "Confiança e comunicação com o conselho." },
  { key: "custos", label: "Otimização de custos", tipo: "desafio", descricao: "Contratos, fornecedores e despesas." },
  { key: "tecnologia", label: "Modernização e tecnologia", tipo: "desafio", descricao: "Digitalização da gestão." },
  { key: "sustentabilidade", label: "Sustentabilidade e eficiência", tipo: "desafio", descricao: "Consumo, água, energia e resíduos." },
];

/** Perfil de gestão */
export const PERFIS_GESTAO: Dimensao[] = [
  { key: "executivo", label: "Perfil executivo", tipo: "perfil", descricao: "Gestão estratégica, alto padrão e relação madura com o conselho." },
  { key: "financeiro", label: "Perfil financeiro", tipo: "perfil", descricao: "Reequilíbrio de caixa, inadimplência e controle orçamentário." },
  { key: "tecnico", label: "Perfil técnico de obras", tipo: "perfil", descricao: "Condução de obras, fiscalização e contratos técnicos." },
  { key: "mediador", label: "Perfil de governança e mediação", tipo: "perfil", descricao: "Assembleias, conflitos e conselho atuante." },
  { key: "operacional", label: "Perfil operacional", tipo: "perfil", descricao: "Rotina, equipe própria e presença constante." },
  { key: "implantador", label: "Perfil de implantação", tipo: "perfil", descricao: "Condomínio novo, estruturação do zero." },
];

export const TODAS_DIMENSOES: Dimensao[] = [
  ...TIPOS_EMPREENDIMENTO,
  ...PORTES,
  ...PADROES,
  ...DESAFIOS,
  ...PERFIS_GESTAO,
];

export const dimensaoLabel = (key: string) =>
  TODAS_DIMENSOES.find((d) => d.key === key)?.label ?? key;

export const perfilLabel = (key: string) =>
  PERFIS_GESTAO.find((p) => p.key === key)?.label ?? key;

export const perfilDescricao = (key: string) =>
  PERFIS_GESTAO.find((p) => p.key === key)?.descricao ?? "";

/**
 * Especialidades Q1S — apresentação. Cada card é uma COMBINAÇÃO de dimensões.
 * Isso permite que um condomínio caia em várias ao mesmo tempo.
 */
export interface EspecialidadeQ1S {
  slug: string;
  titulo: string;
  chamada: string;
  dimensoes: string[];
}

export const ESPECIALIDADES_Q1S: EspecialidadeQ1S[] = [
  { slug: "alto-padrao", titulo: "Síndico para Alto Padrão", chamada: "Exigência de serviço, discrição e relação madura com o conselho.", dimensoes: ["alto-padrao", "executivo"] },
  { slug: "condominio-clube", titulo: "Síndico para Condomínio Clube", chamada: "Lazer completo, equipe ampliada e operação de serviços.", dimensoes: ["clube", "operacional", "equipe"] },
  { slug: "obras", titulo: "Síndico especialista em Obras", chamada: "Retrofit, fachada e reformas estruturais conduzidas com método.", dimensoes: ["obras", "tecnico"] },
  { slug: "perfil-financeiro", titulo: "Síndico com perfil Financeiro", chamada: "Orçamento, contratos e controle de despesas sob rédea curta.", dimensoes: ["custos", "financeiro", "transparencia"] },
  { slug: "implantacao", titulo: "Síndico para Implantação", chamada: "Condomínio novo: estruturar regras, equipe e rotina do zero.", dimensoes: ["implantacao", "implantador"] },
  { slug: "recuperacao-financeira", titulo: "Síndico para Recuperação Financeira", chamada: "Caixa negativo, dívidas e inadimplência alta.", dimensoes: ["recuperacao-financeira", "inadimplencia", "financeiro"] },
  { slug: "gestao-de-conflitos", titulo: "Síndico para Gestão de Conflitos", chamada: "Assembleias tensas, grupos divididos e ruído com o conselho.", dimensoes: ["conflitos", "mediador"] },
  { slug: "condominios-comerciais", titulo: "Síndico para Condomínios Comerciais", chamada: "Lajes, salas e centros empresariais com lógica própria.", dimensoes: ["comercial", "executivo"] },
  { slug: "grandes-condominios", titulo: "Síndico para Grandes Condomínios", chamada: "Alta escala, múltiplas torres e equipe numerosa.", dimensoes: ["grande", "mega", "multitorres", "equipe"] },
  { slug: "condominios-pequenos", titulo: "Síndico para Condomínios Pequenos", chamada: "Estrutura enxuta, custo controlado e presença objetiva.", dimensoes: ["pequeno", "custos"] },
  { slug: "associacoes", titulo: "Síndico para Associações", chamada: "Loteamentos e associações de moradores.", dimensoes: ["associacao", "horizontal", "juridico"] },
  { slug: "perfil-operacional", titulo: "Síndico com perfil Operacional", chamada: "Rotina, manutenção e equipe própria no dia a dia.", dimensoes: ["operacional", "equipe"] },
];

export const especialidadePorSlug = (slug: string) =>
  ESPECIALIDADES_Q1S.find((e) => e.slug === slug);
