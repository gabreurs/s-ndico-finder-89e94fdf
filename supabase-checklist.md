# 🛠️ SQL COMPLETO — Copiar e Colar no SQL Editor do Supabase

> **Projeto:** Quero Um Síndico  
> **Atualizado em:** 16/04/2025  
> **Como usar:** Abra o **SQL Editor** do Supabase, cole cada bloco na ordem e clique **Run**.  
> Cada bloco é independente — se algo já existe, pule para o próximo.

---

## BLOCO 1 — Criar os ENUMs (Tipos personalizados)

> **O que faz:** Cria os tipos de dados personalizados usados nas tabelas.  
> - `app_role` → define os papéis de usuário: admin, moderator, user  
> - `approval_status` → define os estados do cadastro: pending, approved, rejected  
> **Se já existir:** vai dar erro "already exists" — pode ignorar e seguir pro próximo bloco.

```sql
-- Cria o tipo de papel do usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Cria o tipo de status de aprovação do síndico
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');
```

---

## BLOCO 2 — Criar a tabela `sindicos`

> **O que faz:** Cria a tabela principal onde ficam todos os dados dos síndicos cadastrados.  
> Cada linha = 1 síndico. Campos como `cidade`, `regioes` e `especialidades` aceitam múltiplos valores (arrays).  
> Todo síndico entra como `pending` e precisa ser aprovado pelo admin para aparecer no site.

```sql
CREATE TABLE public.sindicos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    -- Dados pessoais
    nome_completo TEXT NOT NULL,
    data_nascimento DATE,
    contato_whatsapp TEXT NOT NULL,
    email TEXT,

    -- Dados profissionais
    nome_empresa TEXT,
    ano_inicio_profissao INTEGER,
    site_redes_sociais TEXT,
    breve_resumo TEXT,
    link_youtube TEXT,

    -- Localização e atuação (arrays — aceita vários valores)
    cidade TEXT[] NOT NULL DEFAULT '{}',
    regioes TEXT[] NOT NULL DEFAULT '{}',
    especialidades TEXT[] NOT NULL DEFAULT '{}',

    -- Mídia
    foto_url TEXT,
    galeria_urls TEXT[],

    -- Autorizações
    aceita_divulgacao_materiais BOOLEAN DEFAULT false,
    autoriza_divulgacao_clientes BOOLEAN DEFAULT false,

    -- Status de aprovação
    status approval_status NOT NULL DEFAULT 'pending'
);
```

---

## BLOCO 3 — Criar a tabela `user_roles`

> **O que faz:** Controla quem é admin, moderator ou user no sistema.  
> Cada linha liga um usuário (do Auth) a um papel.  
> Sem essa tabela, ninguém consegue aprovar/editar síndicos.

```sql
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
```

---

## BLOCO 4 — Ativar RLS (Row Level Security) nas duas tabelas

> **O que faz:** Liga a segurança por linha nas tabelas.  
> Sem isso, qualquer pessoa com a URL da API consegue ler/editar TUDO.  
> Depois de ativar, só as policies (próximo bloco) definem quem vê o quê.

```sql
ALTER TABLE public.sindicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

---

## BLOCO 5 — Criar a função `has_role` (verificação de permissão)

> **O que faz:** Cria uma função que verifica se um usuário tem determinado papel (ex: admin).  
> É usada dentro das policies de segurança.  
> Usa `SECURITY DEFINER` para não cair em loop recursivo com o RLS.  
> **PRECISA existir ANTES de criar as policies (blocos 6 e 7).**

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;
```

---

## BLOCO 6 — Criar as 4 policies da tabela `sindicos`

> **O que faz:**  
> 1. **Cadastro aberto** — qualquer pessoa pode se cadastrar (INSERT)  
> 2. **Visualização pública** — qualquer pessoa vê síndicos aprovados; admin vê todos (SELECT)  
> 3. **Edição restrita** — só admin pode editar dados (UPDATE)  
> 4. **Exclusão restrita** — só admin pode deletar (DELETE)

```sql
-- 1. Qualquer pessoa pode se cadastrar como síndico
CREATE POLICY "Anyone can register as sindico"
ON public.sindicos
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Público vê só aprovados; admin vê todos
CREATE POLICY "Anyone can view approved sindicos"
ON public.sindicos
FOR SELECT
TO public
USING (
    status = 'approved'::approval_status
    OR has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Só admin pode editar síndicos
CREATE POLICY "Admins can update sindicos"
ON public.sindicos
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Só admin pode deletar síndicos
CREATE POLICY "Admins can delete sindicos"
ON public.sindicos
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
```

---

## BLOCO 7 — Criar as 2 policies da tabela `user_roles`

> **O que faz:**  
> 1. **Leitura** — qualquer usuário logado pode ver os papéis (necessário pro sistema funcionar)  
> 2. **Gerenciamento** — só admin pode criar/editar/deletar papéis

```sql
-- 1. Usuários logados podem ver papéis
CREATE POLICY "Authenticated users can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- 2. Só admin gerencia papéis
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

---

## BLOCO 8 — Criar a função de atualização automática do `updated_at`

> **O que faz:** Cria uma função que atualiza o campo `updated_at` automaticamente toda vez que um registro é editado.  
> Sem isso, o campo `updated_at` fica com a data da criação pra sempre.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
```

---

## BLOCO 9 — Criar o trigger que liga a função à tabela `sindicos`

> **O que faz:** Conecta a função do bloco 8 à tabela `sindicos`.  
> A partir daqui, todo UPDATE na tabela atualiza o `updated_at` sozinho.  
> ⚠️ **Este trigger ainda NÃO existe no banco — é obrigatório criar.**

```sql
CREATE TRIGGER update_sindicos_updated_at
    BEFORE UPDATE ON public.sindicos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
```

---

## BLOCO 10 — Criar o bucket de Storage para fotos

> **O que faz:** Cria o bucket `sindicos` no Storage para guardar as fotos de perfil.  
> É público (qualquer um pode ver as fotos), mas só usuários autenticados podem fazer upload.

```sql
-- Cria o bucket público para fotos dos síndicos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sindicos', 'sindicos', true)
ON CONFLICT (id) DO NOTHING;

-- Qualquer pessoa pode ver as fotos
CREATE POLICY "Public read access on sindicos bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sindicos');

-- Só usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload to sindicos bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sindicos');

-- Só usuários autenticados podem atualizar arquivos
CREATE POLICY "Authenticated users can update sindicos files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sindicos');

-- Só usuários autenticados podem deletar arquivos
CREATE POLICY "Authenticated users can delete sindicos files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'sindicos');
```

---

## BLOCO 11 — Adicionar o primeiro admin

> **O que faz:** Insere seu usuário como admin na tabela `user_roles`.  
> ⚠️ **ANTES de rodar:** Vá em `Authentication` → `Users` e copie o UUID do seu usuário.  
> Cole no lugar de `SEU_UUID_AQUI`.

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('SEU_UUID_AQUI', 'admin');
```

---

## BLOCO 12 — Consultas úteis (rodar quando quiser)

> **Não são obrigatórias.** Use quando precisar checar o estado do banco.

### Ver todos os síndicos pendentes:
```sql
SELECT id, nome_completo, contato_whatsapp, cidade, created_at
FROM public.sindicos
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Aprovar todos os pendentes de uma vez:
```sql
UPDATE public.sindicos
SET status = 'approved'
WHERE status = 'pending';
```

### Aprovar um síndico específico:
```sql
UPDATE public.sindicos
SET status = 'approved'
WHERE id = 'UUID_DO_SINDICO_AQUI';
```

### Ver quantos síndicos por cidade:
```sql
SELECT unnest(cidade) AS cidade, COUNT(*)
FROM public.sindicos
WHERE status = 'approved'
GROUP BY cidade
ORDER BY COUNT(*) DESC;
```

### Ver quantos síndicos têm foto:
```sql
SELECT
    COUNT(*) FILTER (WHERE foto_url IS NOT NULL AND foto_url != '') AS com_foto,
    COUNT(*) FILTER (WHERE foto_url IS NULL OR foto_url = '') AS sem_foto,
    COUNT(*) AS total
FROM public.sindicos;
```

### Verificar se o trigger existe:
```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'sindicos';
```

---

**FIM DO DOCUMENTO**  
**Ordem de execução:** Bloco 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11  
**Contato:** WhatsApp +55 11 96084-1033