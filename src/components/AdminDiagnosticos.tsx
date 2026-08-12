import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Phone, Mail, Building2, MapPin, AlertTriangle, Trash2 } from "lucide-react";
import { listarDiagnosticos, atualizarStatusDiagnostico, excluirDiagnostico, STATUS_DIAGNOSTICO, statusDiagnosticoLabel, type DiagnosticoRegistro } from "@/lib/diagnostico";
import { perfilLabel, dimensaoLabel, relacaoLabel } from "@/lib/dimensoes";
import { useToast } from "@/hooks/use-toast";

const LABELS: Record<string, string> = {
  unidades: "Unidades",
  torres: "Torres",
  padrao: "Padrão",
  funcionarios: "Funcionários",
  lazer: "Lazer",
  arrecadacao: "Arrecadação",
  inadimplencia: "Inadimplência",
  momento_financeiro: "Momento financeiro",
  obras: "Obras",
  conflitos: "Conflitos",
  conselho: "Conselho",
  novo: "Em implantação",
  estado: "Estado",
  complexidade: "Complexidade",
  transicao_gestao: "Transição de gestão",
  assembleias: "Assembleias",
  fornecedores: "Fornecedores",
  equipe_situacao: "Equipe",
};

export function AdminDiagnosticos() {
  const [dados, setDados] = useState<DiagnosticoRegistro[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [aberto, setAberto] = useState<string | null>(null);
  const { toast } = useToast();

  const carregar = async () => {
    setCarregando(true);
    try {
      setDados(await listarDiagnosticos());
      setErro(null);
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao carregar diagnósticos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const mudarStatus = async (id: string, status: string) => {
    try {
      await atualizarStatusDiagnostico(id, status);
      toast({ title: "Status atualizado" });
      carregar();
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message, variant: "destructive" });
    }
  };

  const remover = async (id: string, nome: string) => {
    if (!window.confirm(`Excluir definitivamente o diagnóstico de "${nome}"?`)) return;
    try {
      await excluirDiagnostico(id);
      toast({ title: "Diagnóstico excluído" });
      carregar();
    } catch (e: any) {
      toast({ title: "Erro ao excluir", description: e?.message, variant: "destructive" });
    }
  };

  if (carregando) {
    return <p className="text-sm text-muted-foreground py-8">Carregando diagnósticos...</p>;
  }

  if (erro) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.04] p-5 flex gap-3">
        <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground mb-1" style={{ fontWeight: 450 }}>
            A tabela de diagnósticos ainda não existe no banco
          </p>
          <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 390 }}>
            Rode o arquivo <code>supabase-diagnosticos.sql</code> no SQL Editor do projeto para ativar a persistência. Detalhe técnico: {erro}
          </p>
        </div>
      </div>
    );
  }

  if (dados.length === 0) {
    return <p className="text-sm text-muted-foreground py-8">Nenhum diagnóstico recebido ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {dados.map((d) => {
        const expandido = aberto === d.id;
        return (
          <div key={d.id} className="rounded-2xl border border-border/20 bg-card p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm text-foreground truncate" style={{ fontWeight: 450 }}>{d.nome}</h3>
                  <Badge variant={d.status === "novo" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {statusDiagnosticoLabel(d.status)}
                  </Badge>
                  {d.perfil_recomendado && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/25 bg-primary/[0.06] text-primary">
                      {perfilLabel(d.perfil_recomendado)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone size={10} />{d.whatsapp}</span>
                  {d.email && <span className="flex items-center gap-1"><Mail size={10} />{d.email}</span>}
                  {d.condominio && <span className="flex items-center gap-1"><Building2 size={10} />{d.condominio}</span>}
                  {d.cidade && <span className="flex items-center gap-1"><MapPin size={10} />{d.cidade}{d.regiao ? ` · ${d.regiao}` : ""}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1">
                  {new Date(d.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap">
                {STATUS_DIAGNOSTICO.filter((s) => s.value !== d.status).map((s) => (
                  <Button
                    key={s.value}
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs rounded-full border-border/20"
                    onClick={() => mudarStatus(d.id, s.value)}
                  >
                    {s.label}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" className="h-8 px-3 text-xs rounded-full gap-1" onClick={() => setAberto(expandido ? null : d.id)}>
                  {expandido ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Detalhes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 text-xs rounded-full gap-1 text-destructive hover:text-destructive"
                  onClick={() => remover(d.id, d.nome)}
                >
                  <Trash2 size={12} /> Excluir
                </Button>
              </div>
            </div>

            {expandido && (
              <div className="mt-4 pt-4 border-t border-border/20 grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-[11px] text-foreground mb-2" style={{ fontWeight: 450 }}>Respostas</p>
                  <div className="space-y-1">
                    {Object.entries(LABELS).map(([k, label]) => {
                      const v = (d.respostas as any)?.[k];
                      if (!v) return null;
                      return (
                        <p key={k} className="text-[11px] text-muted-foreground">
                          <span className="text-muted-foreground/60">{label}:</span> {String(v)}
                        </p>
                      );
                    })}
                    {(d.respostas?.tipos ?? []).length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        <span className="text-muted-foreground/60">Tipos:</span> {d.respostas.tipos.map(dimensaoLabel).join(", ")}
                      </p>
                    )}
                    {d.respostas?.relacao && (
                      <p className="text-[11px] text-muted-foreground">
                        <span className="text-muted-foreground/60">Relação com o condomínio:</span> {relacaoLabel(d.respostas.relacao)}
                      </p>
                    )}
                    {(d.respostas?.perfil_desejado ?? []).length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        <span className="text-muted-foreground/60">Perfil procurado:</span> {d.respostas.perfil_desejado.map(dimensaoLabel).join(", ")}
                      </p>
                    )}
                    {(d.respostas?.problemas_administrativos ?? []).length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        <span className="text-muted-foreground/60">Problemas administrativos:</span> {d.respostas.problemas_administrativos.map(dimensaoLabel).join(", ")}
                      </p>
                    )}
                    {(d.respostas?.prioridades ?? []).length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        <span className="text-muted-foreground/60">Prioridades:</span> {d.respostas.prioridades.map(dimensaoLabel).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-foreground mb-2" style={{ fontWeight: 450 }}>Profissionais sugeridos</p>
                  {(d.sindicos_sugeridos ?? []).length === 0 ? (
                    <p className="text-[11px] text-muted-foreground">Nenhum profissional com aderência sustentada.</p>
                  ) : (
                    <div className="space-y-2">
                      {(d.sindicos_sugeridos ?? []).map((s) => (
                        <div key={s.id} className="rounded-lg border border-border/20 p-2.5">
                          <p className="text-[11px] text-foreground" style={{ fontWeight: 440 }}>
                            {s.nome} <span className="text-muted-foreground/60">· {s.nivel}</span>
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {(s.motivos ?? []).slice(0, 3).map((m) => (
                              <li key={m} className="text-[10px] text-muted-foreground">— {m}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {(d.perfis_secundarios ?? []).length > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-3">
                      <span className="text-muted-foreground/60">Perfis complementares:</span>{" "}
                      {(d.perfis_secundarios ?? []).map(perfilLabel).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
