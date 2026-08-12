-- 1. Restrict public exposure of sindicos PII
DROP POLICY IF EXISTS "Anyone can view approved sindicos" ON public.sindicos;
REVOKE SELECT ON public.sindicos FROM anon;

CREATE POLICY "Sindicos can view own record"
ON public.sindicos FOR SELECT TO authenticated
USING (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'));

CREATE OR REPLACE VIEW public.sindicos_public AS
SELECT id, created_at, updated_at, nome_completo, nome_empresa, foto_url,
       ano_inicio_profissao, site_redes_sociais, breve_resumo, bio_data,
       galeria_urls, link_youtube, regioes, especialidades, cidade, slug, status
FROM public.sindicos
WHERE status = 'approved'::approval_status;

GRANT SELECT ON public.sindicos_public TO anon, authenticated;

-- 2. user_roles: no cross-user visibility
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 3. SECURITY DEFINER function must not be callable from the API
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;

-- 4. Storage: no anonymous uploads, ownership-scoped writes
DROP POLICY IF EXISTS "Anyone can upload sindico photos" ON storage.objects;

CREATE POLICY "Authenticated users upload own sindico photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'sindicos' AND owner = auth.uid());

CREATE POLICY "Authenticated users update own sindico photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'sindicos' AND owner = auth.uid())
WITH CHECK (bucket_id = 'sindicos' AND owner = auth.uid());

CREATE POLICY "Authenticated users delete own sindico photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'sindicos' AND owner = auth.uid());