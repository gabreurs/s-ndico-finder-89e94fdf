export const ESPECIALIDADES = [
  "Associação de moradores (Loteamento)",
  "Cond. Residencial",
  "Cond. Comercial",
  "Residencial multitorres",
  "Condomínio misto (Comercial e residencial)",
  "Condomínio comercial",
  "Condomínio monousuário (Um proprietário)",
  "Condomínio horizontal (Casas)",
  "Condomínio industrial",
  "Residencial clube",
  "Residencial torre única",
  "Outro",
] as const;

export const REGIOES = [
  "Centro de SP",
  "Zona Sul",
  "Zona Norte",
  "Zona Leste",
  "Zona Oeste",
  "Interior de SP",
  "Outro",
] as const;

export const CIDADES = [
  "São Paulo",
  "Brasília",
  "Indaiatuba",
  "São José",
  "Outro",
] as const;

export type Especialidade = typeof ESPECIALIDADES[number];
export type Regiao = typeof REGIOES[number];
export type Cidade = typeof CIDADES[number];
