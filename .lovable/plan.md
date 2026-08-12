# Evolução do Quero 1 Síndico — de diretório a operação de headhunting condominial

## Princípio

Zero redesign. A identidade atual (navy/azul tech, Mona Sans, glass cards, SpinBadge, Marquee, header/footer, animações Framer) é a fonte de verdade visual. Tudo que for criado reutiliza os componentes e tokens existentes. O protótipo do Rafael entra como referência de **produto**; a Michael Page apenas como benchmark de **arquitetura**.

## Auditoria do que já existe

| Existe hoje | Destino |
|---|---|
| `/` Home (hero + filtros + cards + benefícios + depoimentos + CTA) | Evoluir conteúdo, manter estética |
| `/sindicos` listagem com filtros | Preservar, recontextualizar como "base de profissionais" |
| `/sindico/:slug` perfil | Evoluir para dossiê profissional |
| `/cadastro` (multi-step + foto obrigatória + BioBuilder + senha) | Evoluir para "entrada na base de talentos" |
| `/meu-perfil`, `/reset-password`, `/admin` | Preservar; admin ganha aba de diagnósticos |
| `/como-funciona`, `/quem-somos` | Realinhar copy ao processo de 9 etapas |
| Header (4 links) / Footer | Reestruturar navegação por intenção, visual idêntico |
| `ESPECIALIDADES` (12 tipos de condomínio) | Convive com a nova taxonomia de **perfil de gestão** |

Nenhuma rota indexada é removida. Toda nova rota é adicional.

## Nova arquitetura de informação

```text
/                         Home evoluída
/diagnostico              Wizard do condomínio (jornada principal)
/diagnostico/resultado    Perfil sugerido + shortlist da base
/sindicos                 Base de profissionais (existente)
/sindico/:slug            Dossiê profissional (evoluído)
/sou-sindico              Landing da jornada do profissional
/cadastro                 Entrada na base (existente, evoluído)
/como-funciona            Processo Q1S de 9 etapas
/especialidades           Índice das 12 especialidades
/especialidades/:slug     12 páginas com conteúdo próprio
/solucoes/match           Q1S Match
/solucoes/executive-search
/solucoes/check
/solucoes/referencias
/conteudo                 Índice editorial
/conteudo/:slug           Artigos
/contato                  Falar com especialista
/privacidade  /termos     Páginas legais
```

Header: Encontrar um síndico · Sou síndico · Como funciona · Especialidades · Soluções (dropdown) · Conteúdo — com "Entrar" e "Encontrar meu síndico". Mesma altura, tipografia e comportamento do header atual.

## Jornada do condomínio — diagnóstico

Wizard progressivo de 5 passos (não formulário único), mobile-first, com barra de progresso no estilo do projeto:

1. Localização e tipo de condomínio
2. Porte: unidades, torres, funcionários, estrutura de lazer
3. Financeiro: faixa de arrecadação, inadimplência, momento financeiro
4. Contexto: obras em curso/previstas, conflitos, conselho, assembleias
5. Prioridades: principais desafios e perfil de gestão desejado

O resultado deriva um **perfil de gestão recomendado** por regra de pontuação explícita (nada de "algoritmo mágico"), explica por que aquele perfil, e lista profissionais da base com maior aderência — cada card mostrando os motivos da aderência. CTA final: falar com especialista ou iniciar Executive Search.

## Especialidades

12 páginas com conteúdo real e distinto: cenário em que faz sentido, desafios típicos, competências necessárias, o que o Q1S avalia na busca, como o processo funciona, profissionais compatíveis vindos do banco, CTA para diagnóstico. Sem texto duplicado com palavra-chave trocada.

## Soluções

Quatro páginas com estrutura própria: o que é, para quem, como funciona (etapas), critérios avaliados, o que o condomínio recebe, CTA. Linguagem consultiva, sem promessa de garantia — especialmente no Check.

## Perfil profissional (dossiê)

Reorganização dos blocos já existentes + novos: apresentação, atuação, experiência e repertório, especialidades e competências, tipos de condomínio atendidos, disponibilidade, validações Q1S quando houver, e bloco "Por que este profissional tem aderência" quando o usuário chega vindo de um diagnóstico. WhatsApp continua direcionando para o número central.

## Conteúdo editorial

Camada de artigos com conteúdo redigido de verdade (contratação, custo, comparação de propostas, entrevista, troca de síndico, transição de gestão). Começa com conteúdo em arquivo tipado no projeto, pronto para migrar a tabela depois — evita backend prematuro.

## Detalhes técnicos

- **Banco**: o app aponta para o Supabase externo em `src/lib/supabase.ts`. Persistir diagnósticos exige uma tabela nova (`diagnosticos`) nesse projeto — vou entregar o SQL pronto para você rodar no SQL Editor. Até você rodar, o wizard funciona ponta a ponta com o resultado calculado no cliente, sem gravar lead. Nada é simulado visualmente sem indicação.
- **Matching**: função pura em `src/lib/matching.ts`, com pesos legíveis e testável, cruzando respostas do diagnóstico com `especialidades`, `cidade`, `regioes` e anos de experiência dos registros aprovados.
- **Componentes novos**: `WhatsAppFloat` (link `wa.me/message/GZ5YOZ3EGOA2F1`), `ProcessSteps` (9 etapas), `IntentSplit`, `SolutionCard`, `DiagnosticWizard` — todos montados sobre os tokens e o glass já existentes.
- **SEO**: `react-helmet-async` para title/description/canonical por rota, JSON-LD `Service` nas soluções e `Article` no conteúdo, `sitemap.xml` atualizado com as novas rotas. Corrijo também o canonical do `index.html`, hoje apontando para o domínio antigo `queroumsindico.com.br`.
- **Nenhuma URL existente muda.**

## Ordem de execução

1. Fundações: helmet, rotas, header/footer, WhatsApp flutuante, dados de especialidades e soluções
2. Home evoluída
3. Diagnóstico + resultado + matching
4. 12 páginas de especialidade + índice
5. 4 páginas de solução
6. Sou síndico + evolução do cadastro
7. Dossiê do perfil
8. Conteúdo editorial + páginas legais + contato
9. Revisão mobile/tablet, SEO, links e auditoria final no navegador

## Fora de escopo nesta rodada

Área logada de oportunidades para o síndico (candidatura a processos) e painel de gestão de diagnósticos com notificação por e-mail — dependem de modelagem de backend maior. Deixo a arquitetura preparada e trato numa etapa seguinte, se você quiser.
