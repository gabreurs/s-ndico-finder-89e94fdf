-- =====================================================================
-- Q1S — Correção do cadastro público de síndicos (erro 42501 / RLS)
-- Rode no SQL Editor do SEU projeto Supabase (ddopekrratkjytkqcqho).
-- =====================================================================

-- 1) DIAGNÓSTICO — veja o estado atual antes de aplicar (opcional)
-- SELECT policyname, cmd, roles, qual, with_check
-- FROM pg_policies WHERE schemaname = 'public' AND tablename = 'sindicos';
-- SELECT grantee, privilege_type FROM information_schema.role_table_grants
-- WHERE table_schema = 'public' AND table_name = 'sindicos';

-- 2) GRANTS da Data API
GRANT SELECT, INSERT ON public.sindicos TO anon;
GRANT SELECT, INSERT, UPDATE ON public.sindicos TO authenticated;
GRANT ALL ON public.sindicos TO service_role;

GRANT INSERT ON public.diagnosticos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnosticos TO authenticated;
GRANT ALL ON public.diagnosticos TO service_role;

ALTER TABLE public.sindicos ENABLE ROW LEVEL SECURITY;

-- 3) POLÍTICA DE INSERT — cadastro público volta a funcionar,
--    exigindo os dados mínimos obrigatórios (inclusive foto).
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

-- 4) LEITURA PÚBLICA — apenas aprovados (não aparece na listagem antes de aprovar)
DROP POLICY IF EXISTS "Anyone can view approved sindicos" ON public.sindicos;
CREATE POLICY "Anyone can view approved sindicos"
ON public.sindicos
FOR SELECT
TO anon, authenticated
USING (status = 'approved'::approval_status);

-- 5) O próprio profissional enxerga e edita o cadastro dele pelo e-mail logado
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

-- 6) VERIFICAÇÃO — deve retornar as políticas acima
-- SELECT policyname, cmd, roles FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'sindicos' ORDER BY policyname;
