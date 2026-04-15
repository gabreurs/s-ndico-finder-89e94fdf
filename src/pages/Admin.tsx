import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Check, X, Clock, User, MapPin } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

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
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
    setLoading(false);
    if (data) fetchSindicos();
  };

  const fetchSindicos = async () => {
    const { data } = await supabase
      .from("sindicos")
      .select("*")
      .order("created_at", { ascending: false });
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
    const { error } = await supabase
      .from("sindicos")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "Síndico aprovado" : "Síndico rejeitado" });
      fetchSindicos();
    }
  };

  const filtered = filter === "all" ? sindicos : sindicos.filter((s) => s.status === filter);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <h1 className="text-xl text-foreground tracking-tight" style={{ fontWeight: 500 }}>Painel Admin</h1>
            <p className="text-xs text-muted-foreground mt-1">Acesso restrito a administradores</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card rounded-xl border border-border/30 p-5 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">E-mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 text-sm" required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Senha</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 text-sm" required />
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
      <header className="border-b border-border/30 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <h1 className="text-sm text-foreground tracking-tight" style={{ fontWeight: 500 }}>
            Admin — Quero 1 Síndico
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-xs">
            <LogOut size={14} />
            Sair
          </Button>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              className="text-xs rounded-full px-4 h-8"
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "Todos" : s === "pending" ? "Pendentes" : s === "approved" ? "Aprovados" : "Rejeitados"}
              {s !== "all" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {sindicos.filter((x) => x.status === s).length}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((sindico) => (
              <motion.div
                key={sindico.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl border border-border/30 p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted">
                    {sindico.foto_url ? (
                      <img src={sindico.foto_url} alt={sindico.nome_completo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={20} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm text-foreground truncate" style={{ fontWeight: 500 }}>{sindico.nome_completo}</h3>
                    <Badge
                      variant={sindico.status === "approved" ? "default" : sindico.status === "pending" ? "secondary" : "destructive"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {sindico.status === "pending" && <Clock size={10} className="mr-0.5" />}
                      {sindico.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {sindico.cidade && sindico.cidade.length > 0 && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {Array.isArray(sindico.cidade) ? sindico.cidade.join(", ") : sindico.cidade}
                      </span>
                    )}
                    <span>{sindico.contato_whatsapp}</span>
                    {sindico.email && <span>{sindico.email}</span>}
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  {sindico.status !== "approved" && (
                    <Button size="sm" onClick={() => updateStatus(sindico.id, "approved")} className="h-8 px-3 text-xs rounded-full gap-1">
                      <Check size={12} />
                      Aprovar
                    </Button>
                  )}
                  {sindico.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(sindico.id, "rejected")} className="h-8 px-3 text-xs rounded-full gap-1">
                      <X size={12} />
                      Rejeitar
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">Nenhum síndico nesta categoria.</p>
          )}
        </div>
      </div>
    </div>
  );
}
