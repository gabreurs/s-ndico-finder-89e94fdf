ALTER VIEW public.sindicos_public SET (security_invoker = on);

-- Anonymous visitors: column-limited access, approved rows only
GRANT SELECT (
  id, created_at, updated_at, nome_completo, nome_empresa, foto_url,
  ano_inicio_profissao, site_redes_sociais, breve_resumo, bio_data,
  galeria_urls, link_youtube, regioes, especialidades, cidade, slug, status
) ON public.sindicos TO anon;

CREATE POLICY "Public can view approved sindicos"
ON public.sindicos FOR SELECT TO anon, authenticated
USING (status = 'approved'::approval_status);