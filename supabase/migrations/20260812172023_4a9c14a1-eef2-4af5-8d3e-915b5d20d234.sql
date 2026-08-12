DROP POLICY IF EXISTS "Anonymous can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Authenticated can submit diagnostico" ON public.diagnosticos;

CREATE POLICY "Anonymous can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO anon
WITH CHECK (1 = 1);

CREATE POLICY "Authenticated can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO authenticated
WITH CHECK (1 = 1);
