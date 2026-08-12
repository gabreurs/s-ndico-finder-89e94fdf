-- =====================================================================
-- Q1S — Tabela de diagnósticos do condomínio
-- Rode este bloco inteiro no SQL Editor do projeto Supabase (ddopekrratkjytkqcqho).
-- Depois disso, o diagnóstico passa a gravar leads e o /admin lista tudo.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.diagnosticos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- contato do condomínio
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  condominio TEXT,

  -- localização (repetida fora do JSON para facilitar filtro no admin)
  cidade TEXT,
  regiao TEXT,

  -- respostas completas do wizard
  respostas JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- saída da análise
  perfil_recomendado TEXT,
  perfis_secundarios TEXT[] NOT NULL DEFAULT '{}',
  sindicos_sugeridos JSONB NOT NULL DEFAULT '[]'::jsonb,

  status TEXT NOT NULL DEFAULT 'novo'
);

-- Permissões da Data API
GRANT INSERT ON public.diagnosticos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;

ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode registrar o próprio diagnóstico...
DROP POLICY IF EXISTS "Anyone can submit diagnostico" ON public.diagnosticos;
CREATE POLICY "Anyone can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO public
WITH CHECK (true);

-- ...mas apenas admin lê, edita e apaga (dados de contato são sensíveis).
DROP POLICY IF EXISTS "Admins can view diagnosticos" ON public.diagnosticos;
CREATE POLICY "Admins can view diagnosticos"
ON public.diagnosticos
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update diagnosticos" ON public.diagnosticos;
CREATE POLICY "Admins can update diagnosticos"
ON public.diagnosticos
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete diagnosticos" ON public.diagnosticos;
CREATE POLICY "Admins can delete diagnosticos"
ON public.diagnosticos
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- updated_at automático
DROP TRIGGER IF EXISTS update_diagnosticos_updated_at ON public.diagnosticos;
CREATE TRIGGER update_diagnosticos_updated_at
  BEFORE UPDATE ON public.diagnosticos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS diagnosticos_created_at_idx ON public.diagnosticos (created_at DESC);
CREATE INDEX IF NOT EXISTS diagnosticos_status_idx ON public.diagnosticos (status);

-- =====================================================================
-- Necessário também para o matching por evidência (caso ainda não exista):
-- =====================================================================
ALTER TABLE public.sindicos ADD COLUMN IF NOT EXISTS bio_data JSONB;
