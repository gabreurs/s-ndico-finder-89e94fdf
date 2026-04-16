import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Sindico {
  id: string;
  slug: string;
  nome_completo: string;
  foto_url: string | null;
  regioes: string[];
  especialidades: string[];
  cidade: string[];
  contato_whatsapp: string;
  nome_empresa: string | null;
  breve_resumo: string | null;
  ano_inicio_profissao: number | null;
  site_redes_sociais: string | null;
  link_youtube: string | null;
}

interface UseSindicosParams {
  especialidade?: string;
  cidade?: string;
  regiao?: string;
}

export function useSindicos(params?: UseSindicosParams) {
  return useQuery({
    queryKey: ["sindicos", params],
    queryFn: async () => {
      let query = supabase
        .from("sindicos")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (params?.especialidade && params.especialidade !== "all") {
        query = query.contains("especialidades", [params.especialidade]);
      }

      if (params?.cidade && params.cidade !== "all") {
        query = query.contains("cidade", [params.cidade]);
      }

      if (params?.regiao && params.regiao !== "all") {
        query = query.contains("regioes", [params.regiao]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as unknown as Sindico[];
    },
  });
}
