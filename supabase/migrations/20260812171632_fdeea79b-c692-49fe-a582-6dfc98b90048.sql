DROP POLICY IF EXISTS "Anyone can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Anonymous can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Authenticated can submit diagnostico" ON public.diagnosticos;

CREATE POLICY "Anonymous can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Garantir grants novamente
GRANT INSERT ON public.diagnosticos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;
