import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sindico {
  id: string;
  nome_completo: string;
  foto_url: string | null;
  regioes: string[];
  especialidades: string[];
  cidade: string | null;
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
        .order("created_at", { ascending: false });

      // Filter by especialidade
      if (params?.especialidade && params.especialidade !== "all") {
        query = query.contains("especialidades", [params.especialidade]);
      }

      // Filter by cidade
      if (params?.cidade && params.cidade !== "all") {
        query = query.eq("cidade", params.cidade);
      }

      // Filter by regiao
      if (params?.regiao && params.regiao !== "all") {
        query = query.contains("regioes", [params.regiao]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Sindico[];
    },
  });
}
