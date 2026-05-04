---
name: Bio Builder (Resumo guiado)
description: Resumo profissional gerado por questionário estruturado. Salva respostas em sindicos.bio_data (jsonb) e o texto montado em breve_resumo.
type: feature
---
Síndicos novos preenchem questionário (BioBuilder.tsx) com: anos de experiência, faixa de condomínios já administrados, faixa de unidades atuais, porte preferido, até 3 diferenciais (lista fixa), formações e frase pessoal opcional (max 140 chars). buildBio() em src/lib/bioBuilder.ts monta texto padronizado.

Coluna `bio_data jsonb` na tabela sindicos guarda as respostas. `breve_resumo` (text) guarda o texto final renderizado.

Em MeuPerfil, síndico pode alternar entre "texto livre" e "resumo guiado" via toggle. Quando bio_data existe, abre direto no modo guiado.

isBioComplete exige: anos_experiencia + faixa_condominios + ao menos 1 diferencial.
