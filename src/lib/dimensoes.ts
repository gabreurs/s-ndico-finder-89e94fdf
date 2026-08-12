// Taxonomia interna do Q1S.
// As "Especialidades Q1S" são apresentadas juntas na interface, mas internamente
// são DIMENSÕES COMBINÁVEIS: tipo de empreendimento, porte/padrão, situação/desafio
// e perfil de gestão. Um condomínio pode ser Alto Padrão + Grande + Obras + Recuperação.

export type DimensaoTipo = "tipo" | "porte" | "padrao" | "desafio" | "perfil" | "prioridade" | "problema";

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
  { key: "transicao-gestao", label: "Transição de gestão", tipo: "desafio", descricao: "Troca de síndico ou de administradora em curso." },
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

/** As 3 prioridades do síndico procurado — peso alto na análise. */
export const PRIORIDADES: Dimensao[] = [
  { key: "reduzir-inadimplencia", label: "Reduzir a inadimplência", tipo: "prioridade", descricao: "Recuperar crédito e cobrar com método." },
  { key: "organizar-financas", label: "Organizar as finanças", tipo: "prioridade", descricao: "Prestação de contas clara e orçamento sob controle." },
  { key: "conduzir-obras", label: "Conduzir obras", tipo: "prioridade", descricao: "Fiscalizar reformas e retrofit com segurança." },
  { key: "profissionalizar-processos", label: "Profissionalizar processos", tipo: "prioridade", descricao: "Rotinas, contratos e governança mais maduros." },
  { key: "melhorar-comunicacao", label: "Melhorar a comunicação", tipo: "prioridade", descricao: "Diálogo mais claro com moradores e conselho." },
  { key: "reduzir-conflitos", label: "Reduzir conflitos", tipo: "prioridade", descricao: "Mediar grupos divididos e assembleias tensas." },
  { key: "reorganizar-fornecedores", label: "Reorganizar fornecedores", tipo: "prioridade", descricao: "Revisar contratos e prestadores de serviço." },
  { key: "gerir-equipe", label: "Gerir a equipe", tipo: "prioridade", descricao: "Funcionários próprios, escalas e treinamento." },
  { key: "implantar-condominio", label: "Implantar o condomínio", tipo: "prioridade", descricao: "Primeira gestão, entrega e estruturação do zero." },
  { key: "elevar-padrao-gestao", label: "Elevar o padrão de gestão", tipo: "prioridade", descricao: "Gestão mais estratégica e sofisticada." },
  { key: "melhorar-governanca", label: "Melhorar a governança", tipo: "prioridade", descricao: "Regras, conselho e processos decisórios mais claros." },
  { key: "recuperar-confianca", label: "Recuperar a confiança", tipo: "prioridade", descricao: "Reconstruir credibilidade junto aos condôminos." },
  { key: "estruturar-manutencao", label: "Estruturar a manutenção", tipo: "prioridade", descricao: "Plano de manutenção preventiva e corretiva." },
  { key: "controlar-custos", label: "Controlar custos", tipo: "prioridade", descricao: "Reduzir desperdício e renegociar contratos." },
];

/** Cada prioridade aponta para as dimensões reais que ela exige do profissional. */
export const PRIORIDADE_DIMENSOES: Record<string, string[]> = {
  "reduzir-inadimplencia": ["inadimplencia", "financeiro"],
  "organizar-financas": ["financeiro", "transparencia"],
  "conduzir-obras": ["obras", "tecnico"],
  "profissionalizar-processos": ["executivo", "operacional"],
  "melhorar-comunicacao": ["transparencia", "mediador"],
  "reduzir-conflitos": ["conflitos", "mediador"],
  "reorganizar-fornecedores": ["custos", "operacional"],
  "gerir-equipe": ["equipe", "operacional"],
  "implantar-condominio": ["implantacao", "implantador"],
  "elevar-padrao-gestao": ["executivo"],
  "melhorar-governanca": ["transparencia", "executivo"],
  "recuperar-confianca": ["transparencia", "mediador"],
  "estruturar-manutencao": ["operacional", "tecnico"],
  "controlar-custos": ["custos", "financeiro"],
};

/** Problemas administrativos do momento atual — opcional, multi. */
export const PROBLEMAS_ADMINISTRATIVOS: Dimensao[] = [
  { key: "documentacao", label: "Documentação desorganizada", tipo: "problema", descricao: "Atas, contratos e regularização em atraso." },
  { key: "prestacao-contas", label: "Prestação de contas falha", tipo: "problema", descricao: "Falta de transparência com condôminos." },
  { key: "conformidade-legal", label: "Pendências legais", tipo: "problema", descricao: "Processos judiciais ou exigências não cumpridas." },
  { key: "comunicacao-moradores", label: "Comunicação falha com moradores", tipo: "problema", descricao: "Canais de comunicação ausentes ou ruidosos." },
  { key: "gestao-contratos", label: "Contratos mal geridos", tipo: "problema", descricao: "Fornecedores sem controle ou fiscalização." },
];

export const PROBLEMA_DIMENSOES: Record<string, string[]> = {
  documentacao: ["juridico"],
  "prestacao-contas": ["transparencia", "financeiro"],
  "conformidade-legal": ["juridico"],
  "comunicacao-moradores": ["transparencia", "mediador"],
  "gestao-contratos": ["custos", "operacional"],
};

export const RELACOES_CONDOMINIO: { value: string; label: string }[] = [
  { value: "presidente-conselho", label: "Presidente do conselho" },
  { value: "conselheiro", label: "Conselheiro" },
  { value: "morador", label: "Morador" },
  { value: "sindico-atual", label: "Síndico atual" },
  { value: "subsindico", label: "Subsíndico" },
  { value: "administradora", label: "Administradora" },
  { value: "incorporadora", label: "Incorporadora" },
  { value: "outro", label: "Outro" },
];

export const TODAS_DIMENSOES: Dimensao[] = [
  ...TIPOS_EMPREENDIMENTO,
  ...PORTES,
  ...PADROES,
  ...DESAFIOS,
  ...PERFIS_GESTAO,
  ...PRIORIDADES,
  ...PROBLEMAS_ADMINISTRATIVOS,
];

export const dimensaoLabel = (key: string) =>
  TODAS_DIMENSOES.find((d) => d.key === key)?.label ?? key;

export const perfilLabel = (key: string) =>
  PERFIS_GESTAO.find((p) => p.key === key)?.label ?? key;

export const perfilDescricao = (key: string) =>
  PERFIS_GESTAO.find((p) => p.key === key)?.descricao ?? "";

export const prioridadeLabel = (key: string) =>
  PRIORIDADES.find((p) => p.key === key)?.label ?? key;

export const relacaoLabel = (key: string) =>
  RELACOES_CONDOMINIO.find((r) => r.value === key)?.label ?? key;

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
