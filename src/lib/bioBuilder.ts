// Bio guiado por questionário — gera texto padronizado a partir de respostas estruturadas.
// Mantém o layout do site intacto e impede texto livre desorganizado.

export const FAIXA_CONDOMINIOS = [
  { value: "1-5", label: "1 a 5 condomínios" },
  { value: "6-15", label: "6 a 15 condomínios" },
  { value: "16-30", label: "16 a 30 condomínios" },
  { value: "30+", label: "Mais de 30 condomínios" },
] as const;

export const FAIXA_UNIDADES = [
  { value: "ate-100", label: "Até 100 unidades" },
  { value: "100-300", label: "Entre 100 e 300 unidades" },
  { value: "300-700", label: "Entre 300 e 700 unidades" },
  { value: "700+", label: "Mais de 700 unidades" },
] as const;

export const PORTE_PREFERIDO = [
  { value: "pequeno", label: "Pequeno porte" },
  { value: "medio", label: "Médio porte" },
  { value: "grande", label: "Grande porte" },
  { value: "alto-padrao", label: "Alto padrão" },
] as const;

export const DIFERENCIAIS = [
  "Redução de inadimplência",
  "Transparência financeira e prestação de contas",
  "Gestão de obras e reformas",
  "Mediação de conflitos entre condôminos",
  "Gestão e treinamento de funcionários",
  "Acompanhamento jurídico e processos",
  "Modernização tecnológica do condomínio",
  "Otimização de despesas e contratos",
  "Atendimento próximo e disponível",
  "Implantação de novos condomínios",
  "Regularização documental e fiscal",
  "Sustentabilidade e eficiência energética",
] as const;

export const FORMACOES = [
  "Curso de Síndico Profissional",
  "Administração",
  "Contabilidade",
  "Direito",
  "Engenharia",
  "Arquitetura",
  "Gestão Condominial (CRA)",
  "Outros",
] as const;

export type BioData = {
  anos_experiencia?: number;
  faixa_condominios?: string;
  faixa_unidades?: string;
  porte_preferido?: string[];
  diferenciais?: string[]; // máx 3
  formacoes?: string[];
  frase_pessoal?: string; // até 140 chars
};

const labelOf = (
  list: ReadonlyArray<{ value: string; label: string }>,
  value?: string,
) => list.find((x) => x.value === value)?.label;

const join = (arr: string[]) => {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} e ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")} e ${arr[arr.length - 1]}`;
};

/**
 * Gera o texto do bio a partir das respostas estruturadas.
 * Cada frase só aparece se houver dados — sem buracos nem "undefined".
 */
export function buildBio(data: BioData, especialidades?: string[]): string {
  const partes: string[] = [];

  // Frase 1: experiência + volume
  const f1: string[] = [];
  if (data.anos_experiencia && data.anos_experiencia > 0) {
    f1.push(
      `Síndico profissional com ${data.anos_experiencia} ${data.anos_experiencia === 1 ? "ano" : "anos"} de atuação`,
    );
  } else {
    f1.push("Síndico profissional");
  }
  const cond = labelOf(FAIXA_CONDOMINIOS, data.faixa_condominios);
  if (cond) f1.push(`com experiência em ${cond.toLowerCase()}`);
  const uni = labelOf(FAIXA_UNIDADES, data.faixa_unidades);
  if (uni) f1.push(`gerindo atualmente ${uni.toLowerCase()}`);
  partes.push(f1.join(", ") + ".");

  // Frase 2: tipos + porte
  const f2: string[] = [];
  if (especialidades && especialidades.length > 0) {
    const esp = especialidades.slice(0, 3);
    f2.push(`Atua em ${join(esp.map((e) => e.toLowerCase()))}`);
  }
  if (data.porte_preferido && data.porte_preferido.length > 0) {
    const portes = data.porte_preferido
      .map((p) => labelOf(PORTE_PREFERIDO, p)?.toLowerCase())
      .filter(Boolean) as string[];
    if (portes.length > 0) {
      f2.push(`com foco em condomínios de ${join(portes)}`);
    }
  }
  if (f2.length > 0) partes.push(f2.join(", ") + ".");

  // Frase 3: diferenciais
  if (data.diferenciais && data.diferenciais.length > 0) {
    const dif = data.diferenciais.slice(0, 3);
    partes.push(`Destaca-se por ${join(dif.map((d) => d.toLowerCase()))}.`);
  }

  // Frase 4: formação
  if (data.formacoes && data.formacoes.length > 0) {
    partes.push(`Formação: ${join(data.formacoes)}.`);
  }

  // Frase 5: frase pessoal (validada)
  if (data.frase_pessoal && data.frase_pessoal.trim().length > 0) {
    const frase = data.frase_pessoal.trim().slice(0, 140);
    const final = /[.!?]$/.test(frase) ? frase : frase + ".";
    partes.push(final);
  }

  return partes.join(" ");
}

export function isBioComplete(data: BioData): boolean {
  return !!(
    data.anos_experiencia &&
    data.faixa_condominios &&
    data.diferenciais &&
    data.diferenciais.length > 0
  );
}
