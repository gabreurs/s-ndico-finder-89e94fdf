DROP POLICY IF EXISTS "Anonymous can submit diagnostico" ON public.diagnosticos;
DROP POLICY IF EXISTS "Authenticated can submit diagnostico" ON public.diagnosticos;

CREATE POLICY "Anonymous can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO anon
WITH CHECK (current_user = 'authenticated');

CREATE POLICY "Authenticated can submit diagnostico"
ON public.diagnosticos
FOR INSERT
TO authenticated
WITH CHECK (current_user = 'authenticated');
