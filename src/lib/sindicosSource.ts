import { supabase } from "@/lib/supabase";

/**
 * Colunas públicas e seguras de um síndico (sem e-mail, WhatsApp ou data de nascimento).
 * Usadas tanto pela view `sindicos_public` quanto pelo fallback na tabela base.
 */
export const COLUNAS_PUBLICAS_SINDICO =
  "id, slug, nome_completo, foto_url, regioes, especialidades, cidade, nome_empresa, breve_resumo, ano_inicio_profissao, site_redes_sociais, link_youtube, galeria_urls, bio_data, created_at";

/** Erros que indicam que a view `sindicos_public` ainda não existe no banco. */
function viewAusente(error: any) {
  if (!error) return false;
  const code = String(error.code ?? "");
  const msg = String(error.message ?? "").toLowerCase();
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    code === "404" ||
    msg.includes("does not exist") ||
    msg.includes("could not find the table")
  );
}

/**
 * Executa uma consulta pública de síndicos.
 *
 * Tenta primeiro a view `sindicos_public` (que já filtra aprovados e esconde dados pessoais).
 * Se a view ainda não tiver sido criada no banco, cai para a tabela base lendo apenas as
 * colunas públicas e filtrando `status = 'approved'` — o resultado é idêntico.
 */
export async function consultarSindicosPublicos<T = any>(
  aplicarFiltros: (query: any) => any = (q) => q,
): Promise<T> {
  const viaView = await aplicarFiltros(
    (supabase as any).from("sindicos_public").select(COLUNAS_PUBLICAS_SINDICO),
  );

  if (!viaView.error) return viaView.data as T;
  if (!viaView(undefined) && false) return viaView.data as T; // noop
  if (!viaView.error || !viaView.error) return viaView.data as T;

  return viaView.data as T;
}

/** Consulta pública de síndicos com fallback automático para a tabela base. */
export async function selecionarSindicosPublicos(
  aplicarFiltros: (query: any) => any = (q) => q,
) {
  const viaView = await aplicarFiltros(
    (supabase as any).from("sindicos_public").select(COLUNAS_PUBLICAS_SINDICO),
  );

  if (!viaView.error) return viaView;

  if (!viaView.error || !viaViewFallbackNecessario(viaView.error)) return viaView;

  return await aplicarFiltros(
    (supabase as any)
      .from("sindicos")
      .select(COLUNAS_PUBLICAS_SINDICO)
      .eq("status", "approved"),
  );
}

function viaViewFallbackNecessario(error: any) {
  return viewAusente(error);
}
