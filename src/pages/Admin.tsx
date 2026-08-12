import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/PhotoUpload";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Check, X, Clock, User, MapPin, Search, Edit2, Save, ChevronLeft, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Tables } from "@/integrations/supabase/types";
import { AdminMetrics } from "@/components/AdminMetrics";
import { AdminDiagnosticos } from "@/components/AdminDiagnosticos";

type Sindico = Tables<"sindicos">;
type Status = "pending" | "approved" | "rejected";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sindicos, setSindicos] = useState<Sindico[]>([]);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Sindico>>({});
  const [aba, setAba] = useState<"sindicos" | "diagnosticos">("sindicos");
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
      else { setIsAdmin(false); setLoading(false); }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdmin(session.user.id);
      else setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
    setLoading(false);
    if (data) fetchSindicos();
  };

  const fetchSindicos = async () => {
    const { data } = await supabase.from("sindicos").select("*").order("created_at", { ascending: false });
    if (data) setSindicos(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro no login", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("sindicos").update({ status }).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: status === "approved" ? "Síndico aprovado" : status === "rejected" ? "Síndico rejeitado" : "Marcado como pendente" }); fetchSindicos(); }
  };

  const deleteSindico = async (id: string, nome: string) => {
    const { error } = await supabase.from("sindicos").delete().eq("id", id);
    if (error) toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    else { toast({ title: `${nome} excluído com sucesso` }); fetchSindicos(); }
  };

  const startEdit = (sindico: Sindico) => {
    setEditingId(sindico.id);
    setEditData({
      nome_completo: sindico.nome_completo,
      email: sindico.email,
      contato_whatsapp: sindico.contato_whatsapp,
      nome_empresa: sindico.nome_empresa,
      breve_resumo: sindico.breve_resumo,
      site_redes_sociais: sindico.site_redes_sociais,
      link_youtube: sindico.link_youtube,
      ano_inicio_profissao: sindico.ano_inicio_profissao,
      foto_url: sindico.foto_url,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("sindicos").update(editData).eq("id", editingId);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Dados atualizados" }); setEditingId(null); fetchSindicos(); }
  };

  const filtered = sindicos.filter((s) => {
    const matchStatus = filter === "all" || s.status === filter;
    if (!searchQuery.trim()) return matchStatus;
    const q = searchQuery.toLowerCase();
    return matchStatus && (
      s.nome_completo.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.contato_whatsapp.includes(q) ||
      (Array.isArray(s.cidade) && s.cidade.some((c) => c.toLowerCase().includes(q)))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl text-foreground tracking-tight" style={{ fontWeight: 450 }}>Painel Admin</h1>
            <p className="text-xs text-muted-foreground mt-1">Acesso restrito a administradores</p>
          </div>
          <form onSubmit={handleLogin} className="bg-card rounded-2xl border border-border/20 p-6 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 text-sm rounded-lg" required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 text-sm rounded-lg" required />
            </div>
            <Button type="submit" className="w-full h-10 text-sm rounded-full">Entrar</Button>
          </form>
          {session && !isAdmin && (
            <p className="text-xs text-destructive text-center mt-3">Você não tem permissão de administrador.</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <h1 className="text-sm text-foreground tracking-tight" style={{ fontWeight: 450 }}>
            Admin — Quero 1 Síndico
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-xs">
            <LogOut size={14} />
            Sair
          </Button>
        </div>
      </header>

      <div className="container py-6">
        <AdminMetrics />

        {/* Abas */}
        <div className="flex gap-2 mb-5 border-b border-border/20">
          {([["sindicos", "Síndicos"], ["diagnosticos", "Diagnósticos"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAba(key)}
              className={`text-[13px] px-1 pb-2 -mb-px border-b-2 transition-colors ${
                aba === key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: 430 }}
            >
              {label}
            </button>
          ))}
        </div>

        {aba === "diagnosticos" && <AdminDiagnosticos />}

        {aba === "sindicos" && (
        <>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-full px-4 h-8 border-border/20"
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "Todos" : s === "pending" ? "Pendentes" : s === "approved" ? "Aprovados" : "Rejeitados"}
              {s !== "all" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  {sindicos.filter((x) => x.status === s).length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, email, telefone, cidade..."
            className="h-9 text-sm pl-9 rounded-lg border-border/20"
          />
        </div>

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} resultados</p>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((sindico) => (
              <motion.div
                key={sindico.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-2xl border border-border/20 p-4 md:p-5"
              >
                {editingId === sindico.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="h-7 px-2 text-xs">
                        <ChevronLeft size={14} />
                      </Button>
                      <span className="text-sm text-foreground" style={{ fontWeight: 450 }}>Editando perfil</span>
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground mb-1.5 block">Foto</label>
                      <PhotoUpload value={editData.foto_url || undefined} onChange={(url) => setEditData({ ...editData, foto_url: url })} />
                    </div>
                    <Input value={editData.nome_completo || ""} onChange={(e) => setEditData({ ...editData, nome_completo: e.target.value })} placeholder="Nome completo" className="h-9 text-sm rounded-lg" />
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" className="h-9 text-sm rounded-lg" />
                      <Input value={editData.contato_whatsapp || ""} onChange={(e) => setEditData({ ...editData, contato_whatsapp: e.target.value })} placeholder="WhatsApp" className="h-9 text-sm rounded-lg" />
                    </div>
                    <Input value={editData.nome_empresa || ""} onChange={(e) => setEditData({ ...editData, nome_empresa: e.target.value })} placeholder="Empresa" className="h-9 text-sm rounded-lg" />
                    <Textarea value={editData.breve_resumo || ""} onChange={(e) => setEditData({ ...editData, breve_resumo: e.target.value })} placeholder="Resumo" className="min-h-[80px] text-sm rounded-lg resize-none" />
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input value={editData.site_redes_sociais || ""} onChange={(e) => setEditData({ ...editData, site_redes_sociais: e.target.value })} placeholder="Site / Redes sociais" className="h-9 text-sm rounded-lg" />
                      <Input value={editData.link_youtube || ""} onChange={(e) => setEditData({ ...editData, link_youtube: e.target.value })} placeholder="Link YouTube" className="h-9 text-sm rounded-lg" />
                    </div>
                    <Input type="number" value={editData.ano_inicio_profissao || ""} onChange={(e) => setEditData({ ...editData, ano_inicio_profissao: parseInt(e.target.value) || null })} placeholder="Ano início profissão" className="h-9 text-sm rounded-lg max-w-[200px]" />
                    <Button size="sm" onClick={saveEdit} className="h-8 px-4 text-xs rounded-full gap-1">
                      <Save size={12} /> Salvar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted">
                        {sindico.foto_url ? (
                          <img src={sindico.foto_url} alt={sindico.nome_completo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={20} className="text-muted-foreground/25" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm text-foreground truncate" style={{ fontWeight: 450 }}>{sindico.nome_completo}</h3>
                        <Badge
                          variant={sindico.status === "approved" ? "default" : sindico.status === "pending" ? "secondary" : "destructive"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {sindico.status === "pending" && <Clock size={10} className="mr-0.5" />}
                          {sindico.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                        {sindico.cidade && sindico.cidade.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {Array.isArray(sindico.cidade) ? sindico.cidade.join(", ") : sindico.cidade}
                          </span>
                        )}
                        <span>{sindico.contato_whatsapp}</span>
                        {sindico.email && <span>{sindico.email}</span>}
                      </div>
                      {sindico.breve_resumo && (
                        <p className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-1">{sindico.breve_resumo}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground/50 mt-1">
                        Cadastrado em {new Date(sindico.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="flex gap-1.5 shrink-0 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => startEdit(sindico)} className="h-8 px-3 text-xs rounded-full gap-1 border-border/20">
                        <Edit2 size={12} /> Editar
                      </Button>
                      {sindico.status !== "approved" && (
                        <Button size="sm" onClick={() => updateStatus(sindico.id, "approved")} className="h-8 px-3 text-xs rounded-full gap-1">
                          <Check size={12} /> Aprovar
                        </Button>
                      )}
                      {sindico.status !== "rejected" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(sindico.id, "rejected")} className="h-8 px-3 text-xs rounded-full gap-1 border-border/20">
                          <X size={12} /> Rejeitar
                        </Button>
                      )}
                      {sindico.status !== "pending" && (
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(sindico.id, "pending")} className="h-8 px-3 text-xs rounded-full gap-1">
                          <Clock size={12} /> Pendente
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 px-3 text-xs rounded-full gap-1 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={12} /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir síndico?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir <strong>{sindico.nome_completo}</strong>? Essa ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSindico(sindico.id, sindico.nome_completo)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">Nenhum síndico nesta categoria.</p>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
