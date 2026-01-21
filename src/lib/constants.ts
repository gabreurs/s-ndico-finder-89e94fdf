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

export const CIDADES_REGIOES: Record<string, string[]> = {
  "São Paulo": [
    "Centro",
    "Zona Sul",
    "Zona Norte",
    "Zona Leste",
    "Zona Oeste",
  ],
  "Guarulhos": [
    "Centro",
    "Região Norte",
    "Região Sul",
    "Região Leste",
    "Região Oeste",
  ],
  "Campinas": [
    "Centro",
    "Barão Geraldo",
    "Cambuí",
    "Taquaral",
    "Sousas",
  ],
  "Santo André": [
    "Centro",
    "Jardim",
    "Paraíso",
    "Vila Assunção",
  ],
  "São Bernardo do Campo": [
    "Centro",
    "Rudge Ramos",
    "Assunção",
    "Planalto",
  ],
  "Osasco": [
    "Centro",
    "Presidente Altino",
    "Bela Vista",
    "Industrial Autonomistas",
  ],
  "Ribeirão Preto": [
    "Centro",
    "Zona Sul",
    "Zona Norte",
    "Zona Leste",
    "Zona Oeste",
  ],
  "Sorocaba": [
    "Centro",
    "Zona Norte",
    "Zona Sul",
    "Zona Leste",
    "Zona Oeste",
  ],
  "Santos": [
    "Centro",
    "Gonzaga",
    "Boqueirão",
    "Ponta da Praia",
    "Embaré",
  ],
  "São José dos Campos": [
    "Centro",
    "Zona Sul",
    "Zona Norte",
    "Zona Leste",
    "Zona Oeste",
  ],
};

export const CIDADES = Object.keys(CIDADES_REGIOES);

export type Especialidade = typeof ESPECIALIDADES[number];
export type Cidade = keyof typeof CIDADES_REGIOES;
