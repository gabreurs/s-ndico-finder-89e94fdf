GRANT INSERT ON public.diagnosticos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;

-- Garantir política pública de INSERT
DROP POLICY IF EXISTS "Anyone can submit diagnostico" ON public.diagnosticos;
CREATE POLICY "Anyone can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO public
WITH CHECK (true);

-- Políticas admin (SELECT, UPDATE, DELETE)
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

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_diagnosticos_updated_at ON public.diagnosticos;
CREATE TRIGGER update_diagnosticos_updated_at
  BEFORE UPDATE ON public.diagnosticos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Coluna bio_data para sindicos (caso não exista)
ALTER TABLE public.sindicos ADD COLUMN IF NOT EXISTS bio_data JSONB;

-- Índices úteis
CREATE INDEX IF NOT EXISTS diagnosticos_created_at_idx ON public.diagnosticos (created_at DESC);
CREATE INDEX IF NOT EXISTS diagnosticos_status_idx ON public.diagnosticos (status);
