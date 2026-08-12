DROP POLICY IF EXISTS "Anonymous can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Authenticated can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Anyone can submit diagnostico" ON public.diagnosticos;

CREATE POLICY "Anyone can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO public
WITH CHECK (true);

GRANT INSERT ON public.diagnosticos TO anon;
GRANT INSERT ON public.diagnosticos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;
