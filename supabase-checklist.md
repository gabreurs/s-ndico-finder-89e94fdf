# 📋 SUPABASE CHECKLIST — Guia de Navegação

> **Versão:** 1.0  
> **Projeto:** Quero Um Síndico  
> **Última atualização:** 16/04/2025

---

## 🗺️ VISÃO GERAL — Onde fica cada coisa no Supabase

| Seção do Supabase | O que configura lá | Caminho no Menu |
|-------------------|-------------------|-----------------|
| **Table Editor** | Criar/editar tabelas, colunas, tipos de dados | `Database` → `Table Editor` |
| **SQL Editor** | Rodar comandos SQL avançados (funções, triggers) | `SQL Editor` → `New query` |
| **Authentication** | Configurar login, provedores (Google), políticas de usuário | `Authentication` → `Providers` |
| **Storage** | Buckets de arquivos (fotos), políticas de acesso | `Storage` → `Buckets` |
| **Edge Functions** | Código backend serverless (integrações, webhooks) | `Edge Functions` |
| **Database** → **Policies** | Regras de segurança (RLS) — quem pode ver/editar o quê | `Database` → `Policies` |

---

## 📊 ESTRUTURA DE DADOS — Tabelas e Caminhos

### 1. Tabela: `sindicos` (Cadastro de Síndicos)

**📍 ONDE CRIAR/EDITAR:**
```
Database → Table Editor → public schema → sindicos
```

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | uuid | ✅ | Identificador único automático |
| `nome_completo` | text | ✅ | Nome do síndico |
| `contato_whatsapp` | text | ✅ | WhatsApp para contato |
| `email` | text | ❌ | E-mail opcional |
| `cidade` | text[] | ✅ | Array de cidades (pode ter várias) |
| `regioes` | text[] | ✅ | Array de regiões atendidas |
| `especialidades` | text[] | ✅ | Array de especialidades |
| `status` | enum | ✅ | `pending` → `approved` → `rejected` |
| `foto_url` | text | ❌ | URL da foto de perfil no Storage |
| `galeria_urls` | text[] | ❌ | Array de URLs de fotos da galeria |
| `ano_inicio_profissao` | integer | ❌ | Ano que começou a trabalhar |
| `nome_empresa` | text | ❌ | Nome da empresa (se tiver) |
| `site_redes_sociais` | text | ❌ | Link Instagram/LinkedIn |
| `link_youtube` | text | ❌ | Link de vídeo do YouTube |
| `breve_resumo` | text | ❌ | Descrição/bio do síndico |
| `data_nascimento` | date | ❌ | Data de nascimento |
| `aceita_divulgacao_materiais` | boolean | ❌ | Autoriza uso em materiais |
| `autoriza_divulgacao_clientes` | boolean | ❌ | Autoriza divulgação para clientes |
| `created_at` | timestamptz | ✅ | Data de criação automática |
| `updated_at` | timestamptz | ✅ | Data de última atualização |

**📍 ONDE CRIAR O ENUM `approval_status`:**
```
Database → Table Editor → public schema → Enums (tab) → Create enum
Valores: pending, approved, rejected
```

---

### 2. Tabela: `user_roles` (Perfis de Usuário)

**📍 ONDE CRIAR/EDITAR:**
```
Database → Table Editor → public schema → user_roles
```

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | uuid | ✅ | Identificador único |
| `user_id` | uuid | ✅ | ID do usuário (ligado ao Auth) |
| `role` | enum | ✅ | `admin`, `moderator`, `user` |

**📍 ONDE CRIAR O ENUM `app_role`:**
```
Database → Table Editor → public schema → Enums (tab) → Create enum
Valores: admin, moderator, user
```

---

## 🔐 SEGURANÇA (RLS) — Políticas de Acesso

**📍 ONDE CONFIGURAR:**
```
Database → Table Editor → [seleciona a tabela] → Policies (tab)
```

### Tabela `sindicos` — 4 Políticas:

| Nome da Policy | Operação | Regra | O que faz |
|----------------|----------|-------|-----------|
| `Anyone can register as sindico` | INSERT | `true` | Qualquer pessoa pode se cadastrar |
| `Anyone can view approved sindicos` | SELECT | `status = 'approved' OR has_role(auth.uid(), 'admin')` | Público vê só aprovados; admin vê todos |
| `Admins can update sindicos` | UPDATE | `has_role(auth.uid(), 'admin')` | Só admin pode editar |
| `Admins can delete sindicos` | DELETE | `has_role(auth.uid(), 'admin')` | Só admin pode deletar |

### Tabela `user_roles` — 2 Políticas:

| Nome da Policy | Operação | Regra | O que faz |
|----------------|----------|-------|-----------|
| `Authenticated users can view roles` | SELECT | `true` | Usuários logados veem roles |
| `Admins can manage roles` | ALL | `has_role(auth.uid(), 'admin')` | Só admin gerencia roles |

---

## ⚙️ FUNÇÕES E TRIGGERS — SQL Avançado

**📍 ONDE CRIAR:**
```
SQL Editor → New query → Cole o código → Run
```

### Função 1: `has_role` (Verifica permissão do usuário)

**Propósito:** Verifica se um usuário tem determinado papel (admin, moderator, user)

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

**Como usar:** Esta função é usada nas policies RLS para checar se o usuário é admin.

---

### Função 2: `update_updated_at_column` (Atualiza data automaticamente)

**Propósito:** Toda vez que um registro é atualizado, atualiza o campo `updated_at`

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

### Trigger: `update_sindicos_updated_at`

**Propósito:** Liga a função acima à tabela `sindicos`

```sql
CREATE TRIGGER update_sindicos_updated_at
  BEFORE UPDATE ON public.sindicos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

**⚠️ STATUS ATUAL:** Este trigger precisa ser criado — ele ainda não existe no banco!

---

## 🖼️ STORAGE (Fotos e Arquivos)

**📍 ONDE CONFIGURAR:**
```
Storage → Buckets
```

### Bucket: `sindicos` (Público)

| Configuração | Valor | Significado |
|--------------|-------|-------------|
| **Nome** | `sindicos` | Nome do bucket |
| **Public** | ✅ Sim | Qualquer um pode ver as fotos |
| **Policies** | 2 regras | INSERT (autenticados), SELECT (público) |

**📍 ONDE CRIAR AS POLÍTICAS DO STORAGE:**
```
Storage → Policies → Create a policy from scratch
```

| Policy | Operação | Condição |
|--------|----------|----------|
| Allow authenticated uploads | INSERT | `auth.role() = 'authenticated'` |
| Allow public read | SELECT | `bucket_id = 'sindicos'` |

---

## 📊 STATUS ATUAL DO BANCO

### Síndicos Cadastrados

| Status | Quantidade | Onde ver |
|--------|-----------|----------|
| ✅ Aprovados | 178 | Table Editor → sindicos → Filter: status = approved |
| ⏳ Pendentes | 157 | Table Editor → sindicos → Filter: status = pending |
| **Total** | **335** | — |

### Fotos dos Síndicos

| Situação | Quantidade | O que foi feito |
|----------|-----------|-----------------|
| ✅ Com foto funcional | 28 | Fotos restauradas do backup |
| 🖼️ Com placeholder | 307 | Sem foto, mostra avatar genérico |
| ❌ Links quebrados limpos | 176 | Campos `foto_url` limpos |

---

## 🚨 PENDÊNCIAS CRÍTICAS

| # | Tarefa | Prioridade | Onde executar |
|---|--------|------------|---------------|
| 1 | Criar trigger `update_sindicos_updated_at` | 🔴 Alta | SQL Editor |
| 2 | Aprovar/rejeitar 157 síndicos pendentes | 🟡 Média | Admin do site ou UPDATE direto |
| 3 | Upload de mais fotos dos 28 síndicos | 🟢 Baixa | Storage → Upload |

---

## 📝 COMANDOS SQL ÚTEIS (Copiar e Colar)

**📍 Todos rodam em:** `SQL Editor` → `New query`

### Listar todos os síndicos pendentes:
```sql
SELECT id, nome_completo, contato_whatsapp, created_at 
FROM public.sindicos 
WHERE status = 'pending' 
ORDER BY created_at DESC;
```

### Aprovar um síndico específico:
```sql
UPDATE public.sindicos 
SET status = 'approved' 
WHERE id = 'UUID_AQUI';
```

### Verificar se um usuário é admin:
```sql
SELECT public.has_role('UUID_DO_USUARIO', 'admin');
-- Retorna: true ou false
```

### Contar síndicos por cidade:
```sql
SELECT unnest(cidade) as cidade, COUNT(*) 
FROM public.sindicos 
WHERE status = 'approved' 
GROUP BY cidade 
ORDER BY COUNT(*) DESC;
```

---

## 📞 SUPORTE E CONTATO

| Recurso | Localização |
|---------|-------------|
| **Supabase Docs** | https://supabase.com/docs |
| **Status do projeto** | Preview: https://id-preview--f70ae32b-8823-496a-995d-2ca27141b0f1.lovable.app |
| **Painel Admin** | /admin (requer login de admin) |
| **WhatsApp de contato** | +55 11 96084-1033 |

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar tabela `sindicos` com todas as colunas
- [ ] Criar tabela `user_roles`
- [ ] Criar ENUMs `approval_status` e `app_role`
- [ ] Habilitar RLS em ambas as tabelas
- [ ] Criar todas as 6 policies (4 na sindicos, 2 na user_roles)
- [ ] Criar função `has_role()`
- [ ] Criar função `update_updated_at_column()`
- [ ] Criar trigger `update_sindicos_updated_at` ⚠️ **PENDENTE**
- [ ] Criar bucket `sindicos` no Storage
- [ ] Criar policies do Storage
- [ ] Adicionar primeiro usuário admin na `user_roles`

---

**Documento criado em:** 16/04/2025  
**Responsável:** Manutenção do Sistema Quero Um Síndico