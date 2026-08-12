import { useQuery } from "@tanstack/react-query";
import { selecionarSindicosPublicos } from "@/lib/sindicosSource";

export interface Sindico {
  id: string;
  slug: string;
  nome_completo: string;
  foto_url: string | null;
  regioes: string[];
  especialidades: string[];
  cidade: string[];
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
      const { data, error } = await selecionarSindicosPublicos((query) => {
        let q = query.order("created_at", { ascending: false });

        if (params?.especialidade && params.especialidade !== "all") {
          q = q.contains("especialidades", [params.especialidade]);
        }
        if (params?.cidade && params.cidade !== "all") {
          q = q.contains("cidade", [params.cidade]);
        }
        if (params?.regiao && params.regiao !== "all") {
          q = q.contains("regioes", [params.regiao]);
        }
        return q;
      });

      if (error) throw error;
      return data as unknown as Sindico[];
    },
  });
}
