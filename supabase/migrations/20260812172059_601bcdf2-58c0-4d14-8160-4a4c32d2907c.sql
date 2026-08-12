DROP POLICY IF EXISTS "Anonymous can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Authenticated can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Anyone can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "All can submit diagnostico" ON public.diagnosticos;

CREATE POLICY "All can submit diagnostico"
ON public.diagnosticos
FOR ALL
TO public
WITH CHECK (true);
