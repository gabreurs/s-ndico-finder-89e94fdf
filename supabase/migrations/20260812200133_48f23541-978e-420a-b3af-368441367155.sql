GRANT SELECT, INSERT ON public.sindicos TO anon;
GRANT SELECT, INSERT, UPDATE ON public.sindicos TO authenticated;
GRANT ALL ON public.sindicos TO service_role;

GRANT INSERT ON public.diagnosticos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;

ALTER TABLE public.sindicos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can register as sindico" ON public.sindicos;
DROP POLICY IF EXISTS "Public can register as sindico" ON public.sindicos;
DROP POLICY IF EXISTS "Authenticated can register as sindico" ON public.sindicos;

CREATE POLICY "Public can register as sindico"
ON public.sindicos
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'::approval_status
  AND length(coalesce(nome_completo, '')) >= 3
  AND length(coalesce(contato_whatsapp, '')) >= 10
  AND coalesce(foto_url, '') <> ''
);

DROP POLICY IF EXISTS "Anyone can view approved sindicos" ON public.sindicos;
CREATE POLICY "Anyone can view approved sindicos"
ON public.sindicos
FOR SELECT
TO anon, authenticated
USING (status = 'approved'::approval_status);

DROP POLICY IF EXISTS "Owner can view own sindico" ON public.sindicos;
CREATE POLICY "Owner can view own sindico"
ON public.sindicos
FOR SELECT
TO authenticated
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS "Owner can update own sindico" ON public.sindicos;
CREATE POLICY "Owner can update own sindico"
ON public.sindicos
FOR UPDATE
TO authenticated
USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
WITH CHECK (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));