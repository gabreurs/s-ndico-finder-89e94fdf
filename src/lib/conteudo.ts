// Modelo e helpers do módulo editorial "Conteúdo" do Quero 1 Síndico.

export type CtaTipo = "diagnostico" | "referencias" | "executive-search" | "check" | "busca";

export type BlocoConteudo =
  | { tipo: "h2"; texto: string }
  | { tipo: "h3"; texto: string }
  | { tipo: "p"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "citacao"; texto: string };

export interface Artigo {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data: string; // ISO 8601
  conteudo: BlocoConteudo[];
  ctaTipo: CtaTipo;
  relacionados: string[];
  keywords: string[];
}

export interface ArtigoComLeitura extends Artigo {
  tempoLeitura: number; // minutos
}

const WORDS_PER_MINUTE = 200;

function contarPalavras(conteudo: BlocoConteudo[]): number {
  return conteudo.reduce((total, bloco) => {
    if (bloco.tipo === "lista") {
      return total + bloco.itens.join(" ").split(/\s+/).filter(Boolean).length;
    }
    return total + bloco.texto.split(/\s+/).filter(Boolean).length;
  }, 0);
}

export function calcularTempoLeitura(conteudo: BlocoConteudo[]): number {
  const palavras = contarPalavras(conteudo);
  return Math.max(3, Math.round(palavras / WORDS_PER_MINUTE));
}

import { artigoComoContratar } from "@/content/artigos/como-contratar-um-sindico-profissional";
import { artigoQuantoCusta } from "@/content/artigos/quanto-custa-um-sindico-profissional";
import { artigoComoComparar } from "@/content/artigos/como-comparar-propostas-de-sindicos-profissionais";
import { artigoPerguntas } from "@/content/artigos/perguntas-para-fazer-antes-de-contratar-um-sindico";
import { artigoComoTrocar } from "@/content/artigos/como-trocar-de-sindico-profissional";
import { artigoComoAvaliarReferencias } from "@/content/artigos/como-avaliar-referencias-de-um-sindico";
import { artigoCurriculo } from "@/content/artigos/o-que-analisar-no-curriculo-de-um-sindico-profissional";
import { artigoSindicoIdeal } from "@/content/artigos/sindico-ideal-existe";
import { artigoCondominioClube } from "@/content/artigos/o-que-muda-na-gestao-de-um-condominio-clube";
import { artigoObras } from "@/content/artigos/como-escolher-um-sindico-para-condominio-com-obras";
import { artigoTransicao } from "@/content/artigos/como-organizar-a-transicao-entre-sindicos";
import { artigoExecutiveSearch } from "@/content/artigos/quando-contratar-executive-search-para-sindico";

const ARTIGOS_RAW: Artigo[] = [
  artigoComoContratar,
  artigoQuantoCusta,
  artigoComoComparar,
  artigoPerguntas,
  artigoComoTrocar,
  artigoComoAvaliarReferencias,
  artigoCurriculo,
  artigoSindicoIdeal,
  artigoCondominioClube,
  artigoObras,
  artigoTransicao,
  artigoExecutiveSearch,
];

const ARTIGOS: ArtigoComLeitura[] = ARTIGOS_RAW.map((a) => ({
  ...a,
  tempoLeitura: calcularTempoLeitura(a.conteudo),
})).sort((a, b) => (a.data < b.data ? 1 : -1));

export function listarArtigos(): ArtigoComLeitura[] {
  return ARTIGOS;
}

export function artigoPorSlug(slug: string): ArtigoComLeitura | undefined {
  return ARTIGOS.find((a) => a.slug === slug);
}

export function categorias(): string[] {
  return Array.from(new Set(ARTIGOS.map((a) => a.categoria)));
}

export function artigosRelacionados(artigo: ArtigoComLeitura): ArtigoComLeitura[] {
  return artigo.relacionados
    .map((slug) => artigoPorSlug(slug))
    .filter((a): a is ArtigoComLeitura => Boolean(a));
}

export function artigosPorCategoria(categoria: string | null): ArtigoComLeitura[] {
  if (!categoria) return ARTIGOS;
  return ARTIGOS.filter((a) => a.categoria === categoria);
}
