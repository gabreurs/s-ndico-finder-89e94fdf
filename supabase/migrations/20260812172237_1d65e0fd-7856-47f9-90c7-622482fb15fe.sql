CREATE TABLE IF NOT EXISTS public.diagnosticos_backup AS SELECT * FROM public.diagnosticos;

DROP TABLE public.diagnosticos CASCADE;

CREATE TABLE public.diagnosticos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  condominio TEXT,
  cidade TEXT,
  regiao TEXT,
  respostas JSONB NOT NULL DEFAULT '{}'::jsonb,
  perfil_recomendado TEXT,
  perfis_secundarios TEXT[] NOT NULL DEFAULT '{}',
  sindicos_sugeridos JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'novo'
);

INSERT INTO public.diagnosticos (id, created_at, updated_at, nome, whatsapp, email, condominio, cidade, regiao, respostas, perfil_recomendado, perfis_secundarios, sindicos_sugeridos, status)
SELECT id, created_at, updated_at, nome, whatsapp, email, condominio, cidade, regiao, respostas, perfil_recomendado, perfis_secundarios, sindicos_sugeridos, status
FROM public.diagnosticos_backup;

DROP TABLE public.diagnosticos_backup;

GRANT INSERT ON public.diagnosticos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;

ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit diagnostico" ON public.diagnosticos;
CREATE POLICY "Anyone can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO public
WITH CHECK (true);

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

DROP TRIGGER IF EXISTS update_diagnosticos_updated_at ON public.diagnosticos;
CREATE TRIGGER update_diagnosticos_updated_at
  BEFORE UPDATE ON public.diagnosticos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX diagnosticos_created_at_idx ON public.diagnosticos (created_at DESC);
CREATE INDEX diagnosticos_status_idx ON public.diagnosticos (status);
