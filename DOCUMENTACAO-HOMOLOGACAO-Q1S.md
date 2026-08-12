# DOCUMENTAÇÃO DE HANDOFF E HOMOLOGAÇÃO — QUERO 1 SÍNDICO

Documento gerado para a rodada de estabilização anterior à publicação da nova `dist` em produção.
**Revisão 2 — 12/08/2026:** funções publicadas em produção, SQL de cadastro aplicado, dependências atualizadas e rodada de performance no hero/home (ver seções 20, 25 e 27).
Use-o literalmente como roteiro: cada teste tem passo, resultado esperado e onde investigar em caso de falha.

---

## 0. ESTADO FINAL DO PROJETO

| Item | Valor |
|---|---|
| Projeto | Quero 1 Síndico |
| Domínio de produção | https://quero1sindico.com |
| Hospedagem | Hostinger (upload manual da pasta `dist`) |
| Stack | React 18 + Vite 5 + TypeScript + Tailwind + shadcn/ui |
| Backend | Supabase externo — projeto `ddopekrratkjytkqcqho` |
| Roteamento | React Router (SPA) — fallback via `public/.htaccess` |
| Typecheck | ✅ sem erros (`tsgo --noEmit`) |
| Build | ✅ `vite build` concluído (bundle principal 892 kB / 282 kB gzip, rotas em chunks separados) |
| Registros aprovados em produção no momento da auditoria | **206 síndicos** com `status = approved` |

Nenhuma chave de serviço, senha de banco, JWT privado ou `.env` aparece neste documento — por decisão explícita.

### 0.1 Edge Functions

| Função | Status em produção (verificado por requisição real) |
|---|---|
| `submit-diagnostico` | ✅ publicada e respondendo |
| `submit-sindico` | ✅ publicada e respondendo |
| `upload-sindico-photo` | ❌ **não publicada** (404) — ver Pendências |

#### `submit-diagnostico`
- **Finalidade:** gravar o diagnóstico do condomínio sem expor a tabela `diagnosticos` ao público.
- **Rota/fluxo:** `/diagnostico` → etapa 6 (Contato) → `src/lib/diagnostico.ts::salvarDiagnostico()`.
- **Recebe:** nome, whatsapp, e-mail (opcional), condomínio, cidade, região, objeto `respostas` (wizard completo), `perfil_recomendado`, `perfis_secundarios`, `sindicos_sugeridos`.
- **Grava:** um registro em `public.diagnosticos` com `status = 'novo'` definido **pelo servidor**.
- **Proteções:** validação Zod de todos os campos; lista fechada de perfis válidos (o cliente não inventa rótulos); limite de 40 chaves / 20 KB no objeto `respostas`; máximo 12 síndicos sugeridos; `status` não é aceito do cliente; escrita com service role apenas dentro da função.
- **Erros:** 400 (JSON inválido / payload reprovado, com `fieldErrors`), 405 (método), 500 (erro do banco). O frontend exibe toast de erro e **não** avança para o resultado sem sucesso.

#### `submit-sindico`
- **Finalidade:** cadastro público de síndico sem depender de INSERT anônimo direto na tabela (que já falhou com erro RLS 42501).
- **Rota/fluxo:** `/cadastro` → `handleSubmit` → `supabase.functions.invoke('submit-sindico')`.
- **Recebe:** nome completo, WhatsApp, e-mail, empresa, ano de início, site/redes, resumo gerado pelo Bio Builder, `bio_data` (JSON estruturado), YouTube, regiões, especialidades, cidades, autorizações e `foto_url` (obrigatória, precisa ser URL válida).
- **Grava:** registro em `public.sindicos` com `status = 'pending'` (nunca aprovado automaticamente) e `slug` gerado no banco.
- **Proteções:** Zod com limites de tamanho por campo; verificação de duplicidade por WhatsApp (com e sem máscara) e por e-mail entre cadastros `pending`/`approved`, respondendo 409 com mensagem amigável; foto obrigatória.
- **Erros:** 400 (validação), 409 (duplicado), 500 (banco). O frontend mostra o motivo no toast.

#### `upload-sindico-photo`
- **Finalidade:** receber o arquivo da foto e gravá-lo no bucket `sindicos` sem dar permissão de escrita ao anônimo.
- **Status:** ainda não publicada no projeto. Por isso foi implementado nesta rodada um **fallback** em `src/components/PhotoUpload.tsx`: se a função não responder, o upload é feito direto no Storage (permissão hoje existente em produção) e o cadastro continua funcionando. Ver seção 59 (Pendências).

---

## 1. RESUMO EXECUTIVO DA TRANSFORMAÇÃO (linguagem não técnica)

**Antes:** o site funcionava essencialmente como um diretório. O visitante entrava, filtrava por cidade/especialidade, via uma lista de síndicos e falava com alguém. Toda a inteligência da escolha ficava com o condomínio.

**Agora:** o Quero 1 Síndico se estrutura como um ecossistema especializado em encontrar e validar o síndico certo, cobrindo:

- descoberta de síndicos;
- diagnóstico do condomínio;
- identificação do perfil de gestão necessário;
- matching por evidências reais do cadastro;
- hunting (busca dirigida quando a base não resolve);
- análise e validação de candidatos;
- checagem de referências;
- shortlist para o conselho;
- conteúdo editorial especializado;
- porta de entrada estruturada para profissionais.

**O diretório não foi removido.** Hoje convivem dois caminhos:

1. **Busca direta** — `/sindicos`, com filtros, exatamente como antes (mais estados de erro e de vazio).
2. **Busca orientada** — `/diagnostico`, onde o condomínio responde ao wizard e o site devolve perfil recomendado + profissionais aderentes com justificativa.

---

## 2. IDENTIDADE VISUAL PRESERVADA

Não houve redesign estrutural. As mudanças de produto foram encaixadas no design system existente.

Mantido integralmente:

- tipografia e pesos variáveis já usados (títulos leves, `fontWeight` 320–500);
- paleta navy / azul tecnológico via tokens HSL em `src/index.css` (`--primary`, `--accent`, `--green-whatsapp` etc.);
- `section-dark` e `gradient-mesh` como linguagem de profundidade;
- glass cards (`bg-card/60`, bordas `border-border/30`, blur pontual);
- `SpinBadge` (rodapé) e `Marquee` (home);
- header e footer com a mesma estrutura e hierarquia;
- fotografia e tratamento de imagens existentes;
- animações já existentes (Framer Motion em hover, menus, transições de etapa);
- grid responsivo e breakpoints do projeto.

Ajustes visuais desta rodada foram **corretivos**, não estéticos: respiro do header (80px → 64px ao rolar), remoção do traço divisório em favor de sombra, header opaco para o logo não sumir sobre o hero escuro, e remoção de `backdrop-blur` pesado por custo de pintura.

---

## 3. HOME — ALTERAÇÕES SEÇÃO POR SEÇÃO

Arquivo: `src/pages/Index.tsx`.

### 3.1 Hero
- **Antes:** promessa genérica de diretório ("encontre síndicos em SP").
- **Agora:** H1 “Encontre o síndico certo para o seu condomínio — com método”, posicionando headhunting.
- **Por quê:** o produto deixou de ser lista e passou a ser método.
- **CTAs:** `Encontrar meu síndico` → `/diagnostico`; secundário → `/sindicos`; terciário → `/solucoes`.
- **Dados:** estáticos.
- **Mobile:** altura mínima 100vh, CTAs empilham; parallax da imagem de fundo foi **removido** por jank.
- **Esperado:** carregamento imediato, sem engasgo ao rolar.

### 3.2 Marquee / faixa de credibilidade
- Mantida, sem alteração funcional. Puramente visual, CSS-driven.

### 3.3 Divisão condomínio × síndico (duas portas)
- **Antes:** um único caminho.
- **Agora:** bloco com dois destinos claros: condomínio (`/sindicos`, `/diagnostico`) e profissional (`/sou-sindico`, `/cadastro`).
- **Por quê:** os dois públicos tinham a mesma home e se atrapalhavam.

### 3.4 Tese “Não procure apenas um síndico”
- Bloco `section-dark` com o argumento central: contratar por perfil, não por lista.
- CTA: `/como-funciona`.

### 3.5 Seis atributos
- Grade de atributos que o Q1S avalia (repertório, evidência, aderência etc.). Conteúdo estático.

### 3.6 Processo de 9 etapas
- Componente `src/components/Q1SProcesso.tsx`, com progressão ligada ao scroll (GSAP ScrollTrigger).
- **Por quê:** tornar a metodologia visível; é o principal diferencial de posicionamento.
- **Mobile:** vira lista vertical, sem animação de linha custosa.

### 3.7 Especialidades
- Componente `src/components/EspecialidadesQ1S.tsx`, 12 especialidades, cada card leva para `/especialidades/:slug`.

### 3.8 Soluções (Match, Executive Search, Check, Referências)
- Componente `src/components/SolucoesQ1S.tsx`; cada card leva à sua página em `/solucoes/...`.

### 3.9 Síndicos em destaque
- Lê dados **reais** do banco (mesma fonte de `/sindicos`). Quando não há registros, exibe estado vazio com CTA `Seja o primeiro` → `/cadastro`. Não há mock.

### 3.10 Conteúdo
- Chamada para `/conteudo` com link textual destacado.

### 3.11 CTA final
- Dois blocos: condomínio (`/diagnostico`, `/sindicos`) e profissional (`/sou-sindico`, `/cadastro`).

---

## 4. BUSCA DIRETA — `/sindicos`

Arquivos: `src/pages/Sindicos.tsx`, `src/hooks/useSindicos.ts`, `src/lib/sindicosSource.ts`.

- **Fonte:** tenta a view `public.sindicos_public` (que já esconde e-mail, WhatsApp e nascimento). Se a view não existir no banco, cai para a tabela `public.sindicos` lendo **apenas colunas públicas** e filtrando `status = 'approved'`. A decisão é memoizada: a view é testada uma vez por sessão, não a cada busca.
- **Critério para aparecer:** `status = 'approved'`. Cadastro novo entra como `pending` e **não** aparece na listagem.
- **Filtros:** especialidade (`contains` em `especialidades`), cidade (`contains` em `cidade`), região (`contains` em `regioes`). Sincronizados com a query string, então `/sindicos?especialidade=Cond.%20Comercial` funciona e é compartilhável.
- **Ordenação:** `created_at` desc.
- **Paginação:** 12 cards por vez, botão `Carregar mais`.
- **Estados distintos:** `carregando` (skeleton), `sem resultados` (texto orientando a limpar filtros), `erro de banco` (mensagem explícita + botão “Tentar novamente” que refaz a query). Erro **nunca** é apresentado como “nenhum resultado”.

### 4.1 Regressão dos síndicos que sumiram — causa e correção
- **Causa exata:** a rodada de segurança criou a view `sindicos_public` e passou os hooks a consultarem essa view; a migração **nunca foi aplicada no banco de produção**. Toda consulta retornava 404 (`PGRST205`) e a tela ficava vazia — o que parecia “base sem dados”.
- **Correção aplicada:** `src/lib/sindicosSource.ts` passou a detectar a ausência da view e consultar a tabela base com as mesmas colunas públicas e o mesmo filtro `approved`, memoizando a fonte. Não é mock: são os dados reais.
- **Arquivos envolvidos:** `src/lib/sindicosSource.ts`, `src/hooks/useSindicos.ts`, `src/pages/Sindicos.tsx`.
- **Número esperado agora:** **206** perfis aprovados no banco no momento desta auditoria (consulta real com contagem exata).
- **Como confirmar que não voltou:** abrir `/sindicos` sem filtro; devem aparecer 12 cards e o botão “Carregar mais”. No DevTools → Network, a chamada `sindicos?...status=eq.approved` deve retornar 200 com registros. Um 404 em `sindicos_public` é esperado e inofensivo enquanto a view não for criada.

### 4.2 Fotos — situação real hoje
- Dos 206 aprovados, **176 ainda têm `foto_url` apontando para `queroumsindico.com.br` (WordPress antigo)**. Esse domínio **não resolve mais** (falha de DNS), então essas fotos aparecem quebradas em produção.
- Isso **não é bug de frontend**: o dado no banco aponta para um host morto. A correção definitiva é migrar essas imagens para o Storage do Supabase (script `migrate.js` já entregue) ou substituir manualmente.
- Nenhum aprovado está com `foto_url` nulo (verificado: 0 registros).

---

## 5. PERFIL DO SÍNDICO — `/sindico/:slug`

Arquivo: `src/pages/SindicoPerfil.tsx`.

Blocos e comportamento quando falta dado:

| Bloco | Fonte | Se não houver dado |
|---|---|---|
| Foto, nome, empresa | `sindicos` | avatar com inicial |
| Cidades de atuação | `cidade[]` | bloco não é exibido |
| Regiões | `regioes[]` | bloco não é exibido |
| Sobre o profissional | `breve_resumo` (gerado pelo Bio Builder ou texto livre) | bloco não é exibido |
| Especialidades | `especialidades[]` | bloco não é exibido |
| Experiência (anos) | `ano_inicio_profissao` / `bio_data.anos_experiencia` | bloco não é exibido |
| Vídeo | `link_youtube` | embed não é exibido |
| Site / redes | `site_redes_sociais` | link não é exibido |
| CTA WhatsApp | link centralizado (ver seção 9) | sempre presente |
| Outros síndicos | consulta à mesma fonte pública | some se não houver outros |

Nada é inventado: o perfil só mostra o que existe no cadastro. Perfil `pending` ou inexistente resulta em “Síndico não encontrado”.

---

## 6. CADASTRO DE SÍNDICO — `/sou-sindico` e `/cadastro`

Fluxo: `/sou-sindico` (página de venda para o profissional) → `/cadastro` → `submit-sindico` → banco (`pending`) → `/meu-perfil`.

`/cadastro` tem 3 etapas:

1. **Dados pessoais** — foto (obrigatória, JPG/PNG/WebP, máx. 5 MB, mín. 300×300 px), nome, WhatsApp com máscara, e-mail, senha + confirmação (mín. 6 caracteres).
2. **Perfil profissional** — empresa, ano de início, site/redes, YouTube e o **Bio Builder** (questionário estruturado que gera o texto de apresentação padronizado, evitando textos ruins e quebra de layout). O JSON das respostas fica em `bio_data` e alimenta o matching.
3. **Atuação** — cidades, regiões, especialidades e autorizações.

Ao enviar:
- cria a conta de acesso (`supabase.auth.signUp`) com o e-mail e a senha informados — é isso que dá acesso a `/meu-perfil`;
- envia o payload para `submit-sindico`;
- duplicidade por e-mail/WhatsApp retorna mensagem clara (409);
- sucesso: toast “Cadastro enviado com sucesso” e redirecionamento para `/meu-perfil`;
- o `slug` é gerado no banco; o perfil só aparece em `/sindicos` depois da aprovação no `/admin`.

### 6.1 Teste obrigatório — criar um síndico de QA
1. Abrir `https://quero1sindico.com/cadastro`.
2. Foto: use qualquer imagem ≥ 300×300 px (o upload é o passo mais frágil — veja Pendências).
3. Nome: `QA Teste Q1S` · WhatsApp: use um número real seu (a duplicidade é checada) · E-mail: `qa+sindico@seudominio.com` · Senha: defina uma senha de QA (não reutilize senha pessoal).
4. Preencher o Bio Builder e escolher cidade `São Paulo`, região `Zona Sul`, 2–3 especialidades.
5. Enviar → esperado: toast de sucesso e redirecionamento para `/meu-perfil`.
6. Conferir em `/admin` → aba **Síndicos** → filtro `pending`: o registro `QA Teste Q1S` deve estar lá.
7. Conferir em `/sindicos`: **não** deve aparecer (ainda pendente). Aprovar no admin e recarregar: deve aparecer.

**Como remover depois:** `/admin` → aba Síndicos → localizar `QA Teste Q1S` → botão de exclusão. A conta de autenticação criada permanece; para reaproveitar o mesmo e-mail em novo cadastro, o gatilho de exclusão previsto libera a restrição (ver `supabase-checklist.md`).

---

## 7. DIAGNÓSTICO — `/diagnostico`

Arquivos: `src/pages/Diagnostico.tsx`, `src/lib/diagnostico.ts`, `src/lib/dimensoes.ts`, `src/lib/matching.ts`, `src/components/DiagnosticoOpcoes.tsx`, `src/components/DiagnosticoResultado.tsx`.

Seis etapas (`PASSOS`):

| # | Etapa | O que pergunta | Persistido |
|---|---|---|---|
| 1 | Localização | cidade, estado, região | sim (`cidade`, `regiao` também em colunas próprias) |
| 2 | Sobre o condomínio | tipos (multi), unidades, torres, padrão, funcionários, lazer, complexidade | sim (dentro de `respostas`) |
| 3 | Momento atual | arrecadação, inadimplência, momento financeiro, obras, condomínio novo, conflitos, transição de gestão, problemas administrativos, conselho, assembleias, fornecedores, situação da equipe | sim |
| 4 | Perfil procurado | perfis desejados (opcional, multi) | sim |
| 5 | Três prioridades | exatamente 3 entre 14 prioridades | sim |
| 6 | Contato | nome, WhatsApp, e-mail, condomínio, relação com o condomínio | sim (colunas dedicadas) |

- **Validação:** o botão de avanço fica desabilitado enquanto a etapa não estiver completa; a etapa 5 exige exatamente 3 escolhas; a etapa 6 exige nome, WhatsApp e condomínio.
- **Cálculo:** `derivarRequisitos()` converte as respostas em dimensões com peso (1 desejável → 4 prioridade escolhida). `recomendarPerfis()` soma os pesos por perfil de gestão e ordena.
- **Perfis possíveis:** executivo, financeiro, técnico de obras, governança/mediação, operacional, implantação.
- **Matching:** `ranquearSindicos()` avalia cada síndico aprovado por evidência (ver seção 8).
- **Persistência:** `salvarDiagnostico()` chama `submit-diagnostico`. Se a função falhar, o usuário vê o erro e o resultado **não** é apresentado como se tivesse sido salvo.

---

## 8. RESULTADO DO DIAGNÓSTICO

**Rota:** não existe `/diagnostico/resultado`. O resultado é renderizado **na própria rota `/diagnostico`**, substituindo o wizard após o envio (componente `DiagnosticoResultado`). Isso é intencional: evita que a URL de resultado seja compartilhada sem dados.

- **Perfil principal:** perfil com maior soma de pesos nos requisitos derivados; junto vem o motivo objetivo (“Situação financeira deficitária”, “Obras estruturais em curso ou previstas” etc.).
- **Perfis secundários:** os demais perfis com score > 0, em ordem.
- **Níveis de aderência:** `alta` (cobertura ponderada ≥ 60% e ao menos 60% dos requisitos críticos comprovados), `media` (≥ 35%), `baixa` (o restante). **Não há percentual exibido** — por decisão de produto, mostramos nível + motivos.
- **Motivos:** cada motivo cita o dado real que o sustenta (“Declara atuação em residencial clube”, “Menciona ‘retrofit’ no resumo profissional”, “12 anos de atuação”). Sem evidência, não há motivo.
- **Lacunas:** requisitos críticos sem comprovação são listados como lacuna — o site não esconde o que falta.
- **Profissionais retornados:** até 6, ordenados por críticos atendidos → cobertura → quantidade de motivos.
- **CTAs:** ver perfil completo; falar no WhatsApp; e, quando a aderência é fraca, chamada para **Executive Search** (`/solucoes/executive-search`), que é a resposta honesta quando a base não resolve.

**Calculado vs. banco:** perfil, perfis secundários, níveis, motivos e lacunas são **calculados no cliente** a partir das respostas. Os dados dos profissionais (nome, foto, cidades, especialidades, resumo, `bio_data`, anos) vêm **direto do banco**. O registro salvo guarda os dois lados: respostas cruas + resultado calculado.

---

## 9. TESTE REAL DE DIAGNÓSTICO (cenário de QA já validado)

Este cenário foi **executado contra a base real de produção** (206 aprovados) durante esta rodada.

**Condomínio QA Quero 1 Síndico**
- Localização: São Paulo / SP — Zona Sul (região com profissionais reais na base).
- Tipos: Residencial clube + Residencial multitorres.
- Porte: Grande (300–700 unidades), 4+ torres, alto padrão.
- Funcionários: 16–30 · Lazer completo · Complexidade alta.
- Momento: arrecadação 150–400k, inadimplência alta, financeiro **deficitário**, obras de **fachada/retrofit**, conflitos altos, transição de gestão conturbada, prestação de contas falha, assembleias tensas, rotatividade na equipe.
- Perfil procurado: executivo.
- Prioridades: reduzir inadimplência · conduzir obras · reduzir conflitos.
- Contato: `QA Diagnóstico Q1S`, WhatsApp de teste, `qa+diagnostico@seudominio.com`, relação “Presidente do conselho”.

**Resultado esperado (medido):**
- Perfil principal: **Financeiro** (score 4 — “Situação financeira deficitária”).
- Secundários: **Técnico de obras** (4), **Governança/mediação** (4), **Executivo** (3).
- Profissionais prováveis no topo (base atual): `luciana-oliveira-tolentino` (**alta**), `ronaldo-ivan-dias`, `paulo-fittipaldi`, `marcos-almeida` (média), `fernanda-ramos`, `juliete-nunes-paz` (parcial).
- Registro esperado no banco: 1 linha em `diagnosticos` com `status = 'novo'`, `cidade = 'São Paulo'`, `regiao = 'Zona Sul'`, `perfil_recomendado = 'financeiro'` e `sindicos_sugeridos` com os slugs acima.

Se o topo do ranking mudar, verifique se novos cadastros entraram na base — o ranking é dinâmico por definição.

---

## 10. ADMIN — `/admin`

Arquivos: `src/pages/Admin.tsx`, `src/components/AdminDiagnosticos.tsx`, `src/components/AdminMetrics.tsx`.

- **Autenticação:** e-mail + senha (Supabase Auth). Sem sessão, a página mostra apenas o formulário de login.
- **Permissão:** depois do login, é consultada `public.user_roles` procurando `role = 'admin'` para o `user_id`. Sem esse registro, o acesso é negado mesmo com login válido. Papéis ficam em tabela separada — nunca no perfil.
- **Abas:** `Síndicos` e `Diagnósticos`. Métricas (usuários ativos e cadastros por mês) aparecem no topo.
- **Aba Síndicos:** busca, filtro por status, contadores por status, edição de campos, aprovar (`approved`), rejeitar (`rejected`), voltar para pendente (`pending`) e excluir.
- **Aba Diagnósticos:** lista com contato, condomínio, relação, cidade/região, respostas completas, perfil indicado, perfis secundários, profissionais sugeridos com nível e motivos; permite alterar status e excluir.
- **Status de diagnóstico:** `novo` → `em-contato` → `em-analise` → `concluido`.

---

## 11. ACESSOS PARA HOMOLOGAÇÃO

### ADMIN
- URL: https://quero1sindico.com/admin
- **Não existe atualmente uma conta de QA preparada para este perfil**, e as contas administrativas existentes são pessoais — suas senhas não serão reveladas aqui.
- **Como criar uma conta admin de QA (recomendado):**
  1. Crie a conta pelo fluxo público: acesse `/meu-perfil`, use “Esqueci minha senha” não; use o cadastro do Supabase Auth criando o usuário pelo formulário de cadastro (`/cadastro`) com o e-mail `qa-admin@seudominio.com` e uma senha exclusiva de QA, **ou** crie o usuário diretamente no painel de autenticação do seu projeto Supabase.
  2. Com o `user_id` desse usuário, insira o papel:
     ```sql
     insert into public.user_roles (user_id, role)
     values ('<user_id_do_qa>', 'admin');
     ```
  3. Faça login em `/admin` com esse e-mail e senha.
  4. Ao fim da homologação, remova a linha de `user_roles` e o usuário.

### SÍNDICO DE TESTE
- URL: https://quero1sindico.com/meu-perfil
- **Não existe atualmente uma conta de QA preparada para este perfil.** Ela deve ser criada pelo fluxo oficial descrito na seção 6.1 (`/cadastro`), com e-mail `qa+sindico@seudominio.com` e senha exclusiva de QA. Após os testes, exclua o registro pelo `/admin`.

### OUTROS PERFIS
Não existem outros níveis de acesso. Visitante e conselho navegam sem login; diagnóstico não exige conta.

---

## 12. SOLUÇÕES

### 12.1 Q1S Match — `/solucoes/match`
- **Objetivo:** indicar profissionais com aderência real ao contexto do condomínio.
- **Motor:** o mesmo do diagnóstico (`derivarRequisitos` + `avaliarAderencia`), com evidência declarada.
- **Relação com o diagnóstico:** o Match é o resultado prático do diagnóstico; a página explica a metodologia e conduz para ele.
- **CTA principal:** `Fazer o diagnóstico` → `/diagnostico`. **CTA secundário:** ver base de profissionais → `/sindicos`. **Lateral:** dúvida no WhatsApp (mensagem contextual de Match).

### 12.2 Executive Search — `/solucoes/executive-search`
- **Proposta:** quando a base não resolve, o Q1S vai ao mercado buscar o profissional.
- **Etapas descritas:** briefing → mapeamento/hunting → entrevistas → validação técnica → checagem de referências → matching → shortlist para o conselho.
- **CTA principal:** WhatsApp com mensagem de contratação de Executive Search. **Secundário:** `/diagnostico` (para qualificar antes).

### 12.3 Q1S Check — `/solucoes/check`
- **Função:** auditar um candidato que o condomínio já tem em mãos (identidade, referências, aderência, red flags, parecer).
- **Regressão anterior:** os botões “Enviar candidato para validação” e o CTA secundário apontavam **ambos** para `/diagnostico`, ou seja, duas intenções diferentes com o mesmo destino.
- **Correção:** `SolucaoLayout` passou a aceitar `secondaryCta` e `whatsappMessage` por página. Destinos atuais **validados nesta rodada**:
  - `Enviar candidato para validação` → WhatsApp com a mensagem “…contratar o Q1S Check para validar um candidato…”;
  - `Ver síndicos já validados` → `/solucoes/referencias`;
  - `Tirar dúvida no WhatsApp` (lateral) → WhatsApp com mensagem de dúvida sobre o Check.

### 12.4 Q1S Referências — `/solucoes/referencias`
- **Função:** checagem estruturada de referências e banco de perfis já validados.
- **CTAs:** contratação via WhatsApp com mensagem própria; secundário para `/sindicos`; lateral para dúvida.
- **Integração:** é a etapa que sustenta Match, Check e Executive Search — todos referenciam a validação.

---

## 13. ESPECIALIDADES — `/especialidades` e as 12 páginas

Fonte: `src/lib/dimensoes.ts` (`ESPECIALIDADES_Q1S`) + `src/lib/especialidadesConteudo.ts` (texto editorial).

Conceitualmente as 12 **não** são uma taxonomia única: são dimensões combináveis (um condomínio pode ser Alto Padrão + Grande + Obras + Recuperação Financeira ao mesmo tempo).

| Especialidade | Slug | Tipo conceitual | CTA principal | Destino |
|---|---|---|---|---|
| Alto Padrão | `alto-padrao` | Tipo/contexto + Perfil | Fazer diagnóstico | `/diagnostico` |
| Condomínio Clube | `condominio-clube` | Tipo/contexto | Ver profissionais | `/sindicos?especialidade=Residencial clube` |
| Obras | `obras` | Situação/desafio | Fazer diagnóstico | `/diagnostico` |
| Perfil Financeiro | `perfil-financeiro` | Perfil/repertório | Fazer diagnóstico | `/diagnostico` |
| Implantação | `implantacao` | Situação/desafio | Fazer diagnóstico | `/diagnostico` |
| Recuperação Financeira | `recuperacao-financeira` | Situação/desafio | Fazer diagnóstico | `/diagnostico` |
| Gestão de Conflitos | `gestao-de-conflitos` | Situação/desafio | Fazer diagnóstico | `/diagnostico` |
| Condomínios Comerciais | `condominios-comerciais` | Tipo/contexto | Ver profissionais | `/sindicos?especialidade=Cond. Comercial` |
| Grandes Condomínios | `grandes-condominios` | Tipo/contexto | Ver profissionais | `/sindicos?especialidade=Residencial multitorres` |
| Condomínios Pequenos | `condominios-pequenos` | Tipo/contexto | Ver profissionais | `/sindicos?especialidade=Residencial torre única` |
| Associações | `associacoes` | Tipo/contexto | Ver profissionais | `/sindicos?especialidade=Associação de moradores (Loteamento)` |
| Perfil Operacional | `perfil-operacional` | Perfil/repertório | Fazer diagnóstico | `/diagnostico` |

Regra aplicada: só existe link para busca filtrada quando há um valor equivalente **real** no campo `especialidades` do cadastro. Nas demais, o CTA leva ao diagnóstico ou à busca completa — nunca a um filtro que o banco desconhece (isso já causou tela vazia antes).

---

## 14. CONTEÚDO / BLOG — `/conteudo` e `/conteudo/:slug`

- **Fonte:** arquivos TypeScript versionados em `src/content/artigos/*.ts`, agregados por `src/lib/conteudo.ts`. Não há CMS nem tabela — publicar exige deploy.
- **Estrutura de cada artigo:** slug, título, resumo, categoria, data, tempo de leitura (calculado), corpo em blocos, artigos relacionados.
- **Categorias:** derivadas dos próprios artigos (`categorias()`), usadas como filtro na listagem.
- **Links internos:** cada artigo aponta para especialidades, soluções e para o diagnóstico.
- **CTA contextual:** ao final do artigo, chamada para `/diagnostico` ou para a solução relacionada.
- **SEO:** `title`, `description`, `canonical` e Open Graph via componente `Seo`; **Article JSON-LD** injetado por artigo; todas as URLs estão em `public/sitemap.xml`.

Artigos publicados nesta versão (12):

| Título (resumido) | Slug |
|---|---|
| Como avaliar referências de um síndico | `como-avaliar-referencias-de-um-sindico` |
| Como comparar propostas de síndicos profissionais | `como-comparar-propostas-de-sindicos-profissionais` |
| Como contratar um síndico profissional | `como-contratar-um-sindico-profissional` |
| Como escolher um síndico para condomínio com obras | `como-escolher-um-sindico-para-condominio-com-obras` |
| Como organizar a transição entre síndicos | `como-organizar-a-transicao-entre-sindicos` |
| Como trocar de síndico profissional | `como-trocar-de-sindico-profissional` |
| O que analisar no currículo de um síndico profissional | `o-que-analisar-no-curriculo-de-um-sindico-profissional` |
| O que muda na gestão de um condomínio clube | `o-que-muda-na-gestao-de-um-condominio-clube` |
| Perguntas para fazer antes de contratar um síndico | `perguntas-para-fazer-antes-de-contratar-um-sindico` |
| Quando contratar executive search para síndico | `quando-contratar-executive-search-para-sindico` |
| Quanto custa um síndico profissional | `quanto-custa-um-sindico-profissional` |
| Síndico ideal existe? | `sindico-ideal-existe` |

---

## 15. HEADER

Arquivo: `src/components/Header.tsx`. Sticky, opaco, 80px de altura (64px após rolar), sombra no lugar do traço. Nav completa a partir de `xl`; abaixo disso, menu hambúrguer.

| Item | Desktop (≥ xl) | Mobile / tablet | Destino |
|---|---|---|---|
| Logo “Quero 1síndico” | visível, muda de cor no hover | visível | `/` |
| Encontrar um síndico | link | item do menu | `/sindicos` |
| Sou síndico | link | item do menu | `/sou-sindico` |
| Soluções | dropdown (hover) | grupo expandido no menu | `/solucoes` |
| — Q1S Match | item do dropdown | subitem | `/solucoes/match` |
| — Executive Search | item do dropdown | subitem | `/solucoes/executive-search` |
| — Q1S Check | item do dropdown | subitem | `/solucoes/check` |
| — Q1S Referências | item do dropdown | subitem | `/solucoes/referencias` |
| Como funciona | link | item do menu | `/como-funciona` |
| Especialidades | link | item do menu | `/especialidades` |
| Conteúdo | link | item do menu | `/conteudo` |
| Quem somos | link | item do menu | `/quem-somos` |
| Entrar | botão | botão no menu | `/meu-perfil` |

---

## 16. FOOTER

Arquivo: `src/components/Footer.tsx`.

| Coluna | Item | Destino |
|---|---|---|
| Plataforma | Como funciona | `/como-funciona` |
| Plataforma | Síndicos | `/sindicos` |
| Plataforma | Sou síndico | `/sou-sindico` |
| Plataforma | Conteúdo | `/conteudo` |
| Plataforma | Cadastre-se | `/cadastro` |
| Plataforma | Quem somos | `/quem-somos` |
| SíndicoLab | Programas | https://sindicolab.com.br/programas (nova aba) |
| SíndicoLab | Cursos | https://sindicolab.com.br/cursos (nova aba) |
| SíndicoLab | Notícias | https://sindicolab.com.br/noticias (nova aba) |
| Contato | +55 11 96084-1033 | WhatsApp direto |
| Contato | ola@queroumsindico.com | `mailto:` |

Observação: **não existem páginas legais** (Termos de Uso / Política de Privacidade) nesta versão — ver Pendências. O `SpinBadge` permanece no canto superior direito em telas grandes.

---

## 17. WHATSAPP

- **Botão flutuante** (canto inferior direito, presente em **todas as páginas**, pois vive no `Footer`): usa **https://wa.me/message/GZ5YOZ3EGOA2F1** — ajustado nesta rodada.
- **Demais CTAs de WhatsApp** (soluções, perfil do síndico, rodapé) usam o link direto para o número oficial (`5511960841033`) com mensagem contextual pré-preenchida, centralizando todo o contato no Rafael. O WhatsApp individual de cada síndico continua guardado no banco, mas **não é exposto publicamente**.
- **Desktop:** abre o WhatsApp Web em nova aba. **Mobile:** abre o app. Testar nos dois.

---

## 18. MATRIZ DE CTAs (QA)

Destinos abaixo foram lidos do DOM renderizado nesta rodada; a coluna Status é para você preencher em produção.

| Página | Elemento | Texto | Destino esperado | Validado no preview | Status |
|---|---|---|---|---|---|
| Home | Hero primário | Encontrar meu síndico | `/diagnostico` | ✅ | ☐ |
| Home | Hero secundário | Ver profissionais | `/sindicos` | ✅ | ☐ |
| Home | Hero terciário | Ver todas as soluções | `/solucoes` | ✅ | ☐ |
| Home | Bloco condomínio | Buscar síndicos | `/sindicos` | ✅ | ☐ |
| Home | Bloco condomínio | Fazer diagnóstico | `/diagnostico` | ✅ | ☐ |
| Home | Bloco profissional | Sou síndico | `/sou-sindico` | ✅ | ☐ |
| Home | Bloco profissional | Cadastre-se | `/cadastro` | ✅ | ☐ |
| Home | Tese | Como funciona | `/como-funciona` | ✅ | ☐ |
| Home | Destaques vazio | Seja o primeiro | `/cadastro` | ✅ | ☐ |
| Home | Conteúdo | Ver conteúdo | `/conteudo` | ✅ | ☐ |
| Header | Entrar | Entrar | `/meu-perfil` | ✅ | ☐ |
| Check | CTA principal | Enviar candidato para validação | WhatsApp (mensagem Check) | ✅ | ☐ |
| Check | CTA secundário | Ver síndicos já validados | `/solucoes/referencias` | ✅ | ☐ |
| Check | Lateral | Tirar dúvida no WhatsApp | WhatsApp (dúvida Check) | ✅ | ☐ |
| Match | CTA principal | Fazer o diagnóstico | `/diagnostico` | ✅ | ☐ |
| Match | CTA secundário | Ver profissionais | `/sindicos` | ✅ | ☐ |
| Executive Search | CTA principal | Contratar Executive Search | WhatsApp (mensagem ES) | ✅ | ☐ |
| Executive Search | CTA secundário | Fazer diagnóstico | `/diagnostico` | ✅ | ☐ |
| Referências | CTA principal | Solicitar checagem | WhatsApp (mensagem Referências) | ✅ | ☐ |
| Referências | CTA secundário | Ver profissionais | `/sindicos` | ✅ | ☐ |
| Especialidade | CTA | Fazer diagnóstico / Ver profissionais | conforme tabela seção 13 | ✅ | ☐ |
| Perfil do síndico | CTA | Conversar pelo WhatsApp | WhatsApp com nome do profissional | ✅ | ☐ |
| Rodapé | Flutuante | ícone WhatsApp | `wa.me/message/GZ5YOZ3EGOA2F1` | ✅ | ☐ |

---

## 19. MOTION DESIGN

| Biblioteca | Onde é usada |
|---|---|
| **Framer Motion** | estados de componente, hover, entradas de seção, transições de etapa do wizard e do cadastro, menu mobile (`AnimatePresence`), cards de soluções/especialidades, `SolucaoLayout`, `IntroAnimation` |
| **GSAP** | `src/lib/motion.ts` (registro central), `Q1SProcesso` (progressão das 9 etapas), `HeadlineReveal` (revelação de títulos por máscara/stagger), `Reveal`, `Parallax`, `ReadingProgress` |
| **ScrollTrigger** | mesmos componentes acima; todos com `kill()` no cleanup e `ScrollTrigger.refresh()` após troca de rota, `load` e `fonts.ready` |
| **Lenis** | `src/components/motion/SmoothScroll.tsx` — `lerp: 0.16`, `smoothWheel: true`, `syncTouch: false` (toque nativo), `wheelMultiplier: 1`, `touchMultiplier: 1.6`. Um único RAF: o ticker do GSAP dirige o Lenis e o ScrollTrigger escuta o Lenis. Desativado por completo sob `prefers-reduced-motion`. Ao trocar de rota, scroll volta ao topo e os triggers são recalculados. |
| **Parallax** | componente `Parallax` em seções internas. **Removido do hero da Home** por custo de repaint. |
| **Outros** | `ReadingProgress` nos artigos; `MagneticButton` em CTAs selecionados; `SpinBadge` e `Marquee` em CSS puro |

---

## 20. PERFORMANCE

Otimizações aplicadas:

- **Code splitting** por rota (`React.lazy` + `Suspense` em `App.tsx`): bundle principal caiu de ~1,5 MB para ~892 kB (282 kB gzip); `/admin` isolado em chunk próprio (404 kB) e só baixa quando acessado.
- **Cleanup de ScrollTrigger** e remoção de listeners (`scroll`, `resize`, `orientationchange`, ticker do GSAP) em todos os `useEffect`.
- **Um único RAF** no site (Lenis dirigido pelo ticker do GSAP) — não há loops concorrentes.
- **Remoção de `backdrop-blur`** do header e do overlay fixo do rodapé (reprocessavam a tela inteira a cada frame).
- **Zero `filter: blur()` em camadas de fundo** — todas as luzes ambientes usam `radial-gradient` (`.ambient-glow`).
- **Promoção para GPU** (`transform-gpu`, `will-change: transform`) nas camadas animadas do hero.
- **Parallax do hero removido**; animações restritas a `transform`/`opacity`.
- **Skeletons** em `/sindicos` para evitar layout shift durante o carregamento.
- **Lazy loading** de imagens de card e dimensões reservadas.
- **`prefers-reduced-motion`** desliga Lenis e reduz as animações.
- **Cache de dados** com React Query e `staleTime` ajustado; invalidação manual após edições.

### Rodada 2 de performance (12/08/2026) — lag do hero em produção

Após a publicação, o site apresentou lag forte na home, principalmente ao descer do hero para a próxima seção. Causas e correções:

1. **`filter: blur()` em camadas gigantes.** Havia 25 divs de "luz ambiente" com `blur-[100px]`–`blur-[160px]` sobre círculos de até 600 px. Cada uma força o navegador a rasterizar e reprocessar uma área enorme a cada frame de scroll — é o item mais caro da página. Substituídos por `.ambient-glow` / `.ambient-glow-accent` (`radial-gradient`), efeito visual praticamente idêntico e custo próximo de zero.
2. **Transform de scroll sobre todo o conteúdo do hero.** O `useScroll` + `useTransform` do Framer Motion animava `opacity` e `y` do container inteiro do hero (texto, botões, cards, badge) a cada frame — repintura de tela cheia exatamente na transição hero → próxima seção. Removido; a entrada do hero continua animada na montagem.
3. **Overlay fixo do rodapé (`ScrollBlur`).** Tinha `mask-image` + `box-shadow: inset` — ambos recompostos a cada frame. Reduzido a um gradiente simples.

Correções anteriores (rodada 1): remoção de `backdrop-blur` do header, parallax do hero desligado, suavização do Lenis encurtada, animações restritas a `transform`/`opacity`.

### Checklist de motion (seção 28 do briefing)
☐ scroll lento · ☐ scroll rápido (flick) · ☐ resize da janela · ☐ troca de rota · ☐ voltar/avançar do navegador · ☐ mobile real · ☐ gesto de toque · ☐ `prefers-reduced-motion` ativo · ☐ múltiplas navegações seguidas · ☐ scroll logo após o carregamento das imagens.
**Esperado:** nenhum engasgo perceptível, nenhum trigger duplicado, nenhum salto de scroll.

---

## 21. SEO

- Componente `src/components/Seo.tsx` define, por rota: `title`, `meta description`, `canonical`, `og:title/description/url/type/site_name`, `twitter:card` e JSON-LD opcional. Limpa as tags ao desmontar (não vaza metadata entre rotas).
- Domínio canônico: `https://quero1sindico.com`. Não há referência residual ao domínio antigo **no código** — mas há no **banco**, em 176 `foto_url` (ver 4.2).
- `public/robots.txt`: libera todos os crawlers e aponta o sitemap.
- `public/sitemap.xml`: home, busca, diagnóstico, cadastro, sou-síndico, como funciona, quem somos, conteúdo, soluções (4), especialidades e todos os 12 artigos.
- **Limitação honesta:** o SEO é client-side. Googlebot executa JS e lê as tags; crawlers de preview social (LinkedIn, Slack, Facebook) leem só o `index.html` estático. Previews por página exigiriam SSR.
- Rotas sem `Seo` próprio (herdam o título padrão): `/meu-perfil`, `/admin`, `/reset-password` e a 404 — corretas por serem privadas/utilitárias, mas anotadas como melhoria.

---

## 22. ROTEIRO DE HOMOLOGAÇÃO EM PRODUÇÃO

> Publique a `dist` na Hostinger **incluindo o `.htaccess`** (ele está em `public/.htaccess` e é copiado para `dist/`). Sem ele, refresh em rota interna retorna 404.

### TESTE 01 — Home (`/`)
Validar: carregamento, logo legível, header com respiro, hero, busca, entrada do diagnóstico, síndicos em destaque, especialidades, soluções, conteúdo, CTA final, footer, botão de WhatsApp, animações.
**Esperado:** título “Quero 1 Síndico — headhunting de síndicos profissionais”; H1 “Encontre o síndico certo para o seu condomínio — com método”.

### TESTE 02 — Busca direta (`/sindicos`)
Sem filtro → 12 cards + “Carregar mais”. Testar cidade, especialidade, região e combinações; limpar filtros. Abrir 3 perfis.
**Esperado:** dados reais; nenhum perfil pendente na lista; fotos do WordPress podem aparecer quebradas (ver 4.2).

### TESTE 03 — Diagnóstico (`/diagnostico`)
Rodar o wizard inteiro com o cenário da seção 9. Conferir progressão, validação por etapa, exigência de 3 prioridades, contato, envio, resultado, perfil, profissionais e CTAs. Depois abrir `/admin` → Diagnósticos.
**Esperado:** registro novo com `status = novo` e os dados do cenário.

### TESTE 04 — Cadastro de síndico
Seguir a seção 6.1 inteira, incluindo a exclusão do registro de QA ao final.

### TESTE 05 a 08 — Soluções
Match, Executive Search, Check e Referências: clicar em **cada** botão e conferir contra a matriz da seção 18. Atenção redobrada no Check.

### TESTE 09 — Especialidades
Abrir `/especialidades` e as 12 páginas; conferir title, H1, conteúdo, imagem, CTA e comportamento mobile.

### TESTE 10 — Conteúdo
`/conteudo` e os 12 artigos: card, slug, corpo, imagem, links internos, relacionados, CTA e metadata.

### TESTE 11 — Admin
Login com a conta de QA criada (seção 11), abas, aprovação/rejeição, status de diagnóstico, logout.

### TESTE 12 — Autenticação
Login correto, senha incorreta (mensagem de erro), logout, “Esqueci minha senha” (e-mail chega e `/reset-password` funciona), sessão persistente após refresh, acesso direto a `/admin` sem login (deve mostrar o login, não o painel).

### TESTE 13 a 15 — Responsividade
Mobile 390px e 430px · Tablet 768px e 1024px · Desktop 1366/1440/1920px. Verificar menu, hero, busca, cards, wizard, cadastro, perfil, soluções, blog, footer, WhatsApp. Nenhuma largura pode gerar scroll horizontal.

### TESTE 16 — Links
Percorrer header, footer e páginas principais procurando 404, `href="#"`, link vazio, rota antiga, botão sem ação ou destino duplicado sem justificativa.

### TESTE 17 — Erros no console
DevTools aberto em cada página. **Aceitável:** um 404 de `sindicos_public` (view ausente — fallback assumido). **Não aceitável:** erro de JS, CORS, chunk faltando, fonte 404.

### TESTE 18 — Performance no domínio final
Primeira carga, scroll, mudança de rota, imagens, animações, input delay, layout shift.

### TESTE 19 — SEO
Por página: title, description, canonical, H1 único, Open Graph, indexabilidade.

### TESTE 20 — Sitemap e robots
https://quero1sindico.com/sitemap.xml e https://quero1sindico.com/robots.txt devem responder 200 e listar as rotas novas.

### TESTE 21 — 404
Abrir `/teste-404-q1s` → H1 “Página não encontrada” com retorno para a navegação.

### TESTE 22 — Navegação real (sem barra de endereço)
Home → diagnóstico → resultado → perfil → solução → conteúdo → Home. Depois: Home → Sou Síndico → cadastro → login/perfil.

### TESTE 23 — Voltar/avançar
Usar os botões do navegador repetidamente: scroll volta ao topo, Lenis não trava, animações recalculam, filtros e rota permanecem coerentes.

### TESTE 24 — Refresh em rotas internas
Atualizar direto em `/sindicos`, `/diagnostico`, `/solucoes/check`, `/especialidades/obras`, `/conteudo/<slug>` e `/sindico/<slug>`. **Esperado:** a página carrega (SPA fallback do `.htaccess`), não 404 da Hostinger.

### TESTE 25 — Persistência em produção
No DevTools → Network, confirmar chamadas a `ddopekrratkjytkqcqho.supabase.co` (REST e `/functions/v1/submit-*`). Enviar um diagnóstico real no domínio e conferir no `/admin`.

---

## 23. SE ACONTECER X, VERIFIQUE Y

| Sintoma | Onde investigar |
|---|---|
| Não aparecem síndicos | Network: a chamada `sindicos?...status=eq.approved` retornou 200? Veio array vazio? Há filtro ativo na URL? Se a chamada falhar, é backend/RLS; se vier vazia com filtro, é dado. |
| Fotos quebradas | A `foto_url` aponta para `queroumsindico.com.br`? Então é dado antigo, não frontend — migrar imagens. |
| Diagnóstico não envia | Network: `POST /functions/v1/submit-diagnostico` — status 400 (payload reprovado, veja `fieldErrors`), 500 (banco), erro de CORS (função não publicada). |
| Cadastro não envia | `POST /functions/v1/submit-sindico` — 409 é duplicidade (esperado), 400 é validação, 500 é banco. Se travar na foto, ver `upload-sindico-photo`/fallback de Storage. |
| Upload de foto falha | Console mostra “Edge Function indisponível, usando upload direto”? Se o fallback também falhar, é permissão de Storage. |
| Rota dá 404 após refresh | `.htaccess` não subiu junto com a `dist` ou o `mod_rewrite` está desativado na Hostinger. |
| Login no admin não abre o painel | O usuário não tem linha em `user_roles` com `role = 'admin'`. |
| Animação trava | Verificar GSAP/ScrollTrigger duplicados, cleanup do RAF do Lenis, e se `prefers-reduced-motion` está ativo no sistema. |

---

## 24. CHECKLIST DE APROVAÇÃO FINAL

☐ Home · ☐ Busca direta · ☐ Síndicos reais aparecendo · ☐ Perfis · ☐ Diagnóstico · ☐ Persistência do diagnóstico · ☐ Matching · ☐ Cadastro de síndico · ☐ Persistência do cadastro · ☐ Login · ☐ Meu Perfil · ☐ Admin · ☐ Match · ☐ Executive Search · ☐ Check · ☐ Referências · ☐ 12 especialidades · ☐ Conteúdo · ☐ Artigos · ☐ Header · ☐ Footer · ☐ WhatsApp · ☐ CTAs auditados · ☐ Mobile · ☐ Tablet · ☐ Desktop · ☐ Motion · ☐ Performance · ☐ Console sem erros críticos · ☐ SEO · ☐ Sitemap · ☐ 404 · ☐ Refresh em rotas internas · ☐ Produção conectada ao Supabase correto

---

## 25. CHANGELOG TÉCNICO

### Rev. 2 — 12/08/2026
- Performance: luzes ambientes migradas de `blur()` para `radial-gradient` (`.ambient-glow` em `src/index.css`, 25 ocorrências em 15 arquivos).
- Performance: removido o `useScroll`/`useTransform` do hero da home (`src/pages/Index.tsx`).
- Performance: `ScrollBlur` simplificado (sem `mask-image` nem `box-shadow` inset).
- Segurança: `react-router-dom` 6.30.4, `vite` 5.4.21, `postcss` 8.5.26, `vitest` 4, `jsdom` 30.
- Infra: `submit-sindico`, `submit-diagnostico` e `upload-sindico-photo` publicadas em produção; `supabase-fix-cadastro.sql` aplicado.

### Added
- Diagnóstico do condomínio em 6 etapas (`/diagnostico`) com persistência.
- Motor de matching por evidência (`src/lib/matching.ts`) e taxonomia multidimensional (`src/lib/dimensoes.ts`).
- Páginas de solução: `/solucoes`, `/solucoes/match`, `/solucoes/executive-search`, `/solucoes/check`, `/solucoes/referencias`.
- Hub e páginas de especialidades: `/especialidades` e 12 páginas `/especialidades/:slug`.
- Editorial: `/conteudo` e `/conteudo/:slug` com 12 artigos versionados em código.
- `/sou-sindico` como porta de entrada do profissional.
- Bio Builder (`src/lib/bioBuilder.ts`, `src/components/BioBuilder.tsx`) para gerar apresentação padronizada.
- Admin: aba de diagnósticos (`AdminDiagnosticos`) e métricas (`AdminMetrics`).
- Edge Functions `submit-diagnostico`, `submit-sindico`, `upload-sindico-photo`.
- `public/.htaccess` (SPA fallback + HTTPS + cache) e `public/sitemap.xml`.
- Camada de motion: `SmoothScroll`, `Reveal`, `HeadlineReveal`, `Parallax`, `ReadingProgress`, `MagneticButton`.

### Changed
- Home reorganizada em torno do método (sem redesign da identidade).
- Header: 80px/64px, opaco, sombra no lugar do traço, colapso do menu em `xl`.
- Autenticação de síndico passou a e-mail + senha com “esqueci minha senha”.
- Todos os CTAs de WhatsApp centralizados no contato oficial, com mensagens contextuais.
- Botão flutuante de WhatsApp passou a usar o link curto `wa.me/message/GZ5YOZ3EGOA2F1`.
- `/sindicos` com filtros sincronizados à URL e paginação por “Carregar mais”.

### Fixed
- Síndicos sumindo da listagem: fallback memoizado para a tabela base quando a view `sindicos_public` não existe.
- Q1S Check com dois botões apontando para o mesmo destino: CTAs secundários e mensagens de WhatsApp agora são por página.
- Cadastro público falhando por RLS (42501): fluxo movido para Edge Function.
- Perfil pendente aparecendo na listagem e resultando em “síndico não encontrado”.
- Filtro de especialidade editorial que levava a resultado vazio: mapeamento explícito `urlBuscaEspecialidade`.
- Crash da home por animação GSAP sobre variável CSS (trocado por classe).
- Upload de foto travando o cadastro quando a Edge Function não está publicada (fallback direto no Storage).

### Security
- Colunas sensíveis (e-mail, WhatsApp, nascimento) fora de qualquer consulta pública.
- `status` de síndico e de diagnóstico definidos apenas pelo servidor.
- Validação Zod com limites de tamanho em ambas as funções públicas.
- Papéis em tabela separada (`user_roles`) com verificação por `has_role`; `/admin` exige papel admin.
- Duplicidade de cadastro bloqueada no servidor.

### Performance
- Code splitting por rota (~1,5 MB → ~892 kB no bundle principal).
- Remoção de `backdrop-blur` em camadas fixas; promoção para GPU; parallax do hero removido.
- RAF único (Lenis + ticker do GSAP), cleanup completo de ScrollTrigger e listeners.
- Skeletons e lazy loading para evitar layout shift.

### SEO
- Componente `Seo` por rota com canonical, Open Graph e JSON-LD (Article nos posts).
- `robots.txt` e `sitemap.xml` cobrindo todas as rotas públicas.

### Backend
- Tabela `diagnosticos` com status operacional (`novo`, `em-contato`, `em-analise`, `concluido`).
- Coluna `bio_data` (JSONB) em `sindicos` alimentando o matching.
- Scripts SQL versionados: `supabase-fix-cadastro.sql`, `supabase-diagnosticos.sql`, `supabase-checklist.md`.

---

## 26. ARQUIVOS IMPORTANTES

| Arquivo | Função |
|---|---|
| `src/lib/supabase.ts` | Cliente Supabase (projeto `ddopekrratkjytkqcqho`) e URL de redirecionamento de auth |
| `src/lib/sindicosSource.ts` | Fonte pública de síndicos com fallback view → tabela |
| `src/hooks/useSindicos.ts` | Query e cache da listagem |
| `src/lib/dimensoes.ts` | Taxonomia (tipos, portes, padrões, desafios, perfis, prioridades) e as 12 especialidades Q1S |
| `src/lib/diagnostico.ts` | Modelo das respostas, derivação de requisitos, recomendação de perfis e persistência |
| `src/lib/matching.ts` | Extração de evidências, níveis de aderência, motivos, lacunas e ranking |
| `src/lib/bioBuilder.ts` | Geração do texto de apresentação a partir das respostas estruturadas |
| `src/lib/conteudo.ts` + `src/content/artigos/*` | Base editorial |
| `src/lib/whatsapp.ts` | Centralização dos links de WhatsApp |
| `src/components/Seo.tsx` | Metadata por rota |
| `src/components/motion/SmoothScroll.tsx` | Lenis + ticker do GSAP + ScrollTrigger |
| `src/components/PhotoUpload.tsx` | Validação e upload da foto (função + fallback) |
| `src/pages/Diagnostico.tsx` / `DiagnosticoResultado.tsx` | Wizard e resultado |
| `src/pages/Admin.tsx` / `AdminDiagnosticos.tsx` / `AdminMetrics.tsx` | Backoffice |
| `supabase/functions/submit-diagnostico/index.ts` | Gravação segura do diagnóstico |
| `supabase/functions/submit-sindico/index.ts` | Cadastro público seguro |
| `supabase/functions/upload-sindico-photo/index.ts` | Upload de foto server-side (a publicar) |
| `public/.htaccess` | SPA fallback na Hostinger |
| `public/sitemap.xml` / `public/robots.txt` | Indexação |

---

## 27. PENDÊNCIAS CONHECIDAS

### Críticas — resolver antes ou logo após a publicação
1. **176 fotos apontando para o WordPress morto.** `queroumsindico.com.br` não resolve; essas imagens aparecem quebradas em `/sindicos` e nos perfis. Solução: rodar a migração de imagens para o Storage (script `migrate.js`, exige a chave de serviço **executada localmente por você**, nunca neste documento) ou substituir manualmente pelo `/admin`.
2. ~~**Edge Function `upload-sindico-photo` não publicada.**~~ **Resolvido** — as três funções estão publicadas em produção.
3. **Nenhuma conta de QA existente** (admin ou síndico). Criar conforme a seção 11 antes de iniciar a homologação.

### Importantes — podem ser validadas durante a homologação
4. ~~**View `sindicos_public` ausente no banco.**~~ **Resolvido** — a view existe em produção; o fallback permanece no código apenas como rede de segurança.
5. ~~**`supabase-fix-cadastro.sql` não aplicado.**~~ **Resolvido** — aplicado no banco de produção.
6. **Permissão de escrita anônima no bucket `sindicos` ainda ativa** em produção (é o que permite o fallback). Depois de publicar a função de upload, revogar.
7. **Páginas legais inexistentes** (Termos de Uso e Política de Privacidade) — relevantes por captar dados pessoais no diagnóstico e no cadastro.

### Melhorias futuras — não impedem o lançamento
8. Metadata própria para `/meu-perfil`, `/admin` e página 404.
9. Chunk do `/admin` (404 kB) poderia ser dividido.
10. Previews sociais por página exigem SSR (hoje o preview social usa o `index.html` estático).
11. Blog exige deploy para publicar — migrar para tabela no futuro, se a frequência aumentar.
