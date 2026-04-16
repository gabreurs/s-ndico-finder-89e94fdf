import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase auto-detects session from URL when detectSessionInUrl is on
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setHasRecoverySession(true);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasRecoverySession(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Senhas não conferem", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setDone(true);
      setTimeout(() => navigate("/meu-perfil"), 1800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl text-foreground tracking-tight" style={{ fontWeight: 450 }}>
              Redefinir senha
            </h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Defina uma nova senha para sua conta.
            </p>
          </div>

          {done ? (
            <div className="bg-card rounded-2xl border border-border/20 p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 size={20} className="text-primary" />
              </div>
              <p className="text-sm text-foreground" style={{ fontWeight: 450 }}>Senha atualizada!</p>
              <p className="text-[12px] text-muted-foreground">Redirecionando para seu perfil…</p>
            </div>
          ) : !hasRecoverySession ? (
            <div className="bg-card rounded-2xl border border-border/20 p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Link inválido ou expirado. Solicite uma nova recuperação.
              </p>
              <Button asChild size="sm" className="rounded-full text-xs">
                <a href="/meu-perfil">Voltar ao login</a>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/20 p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nova senha</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 text-sm rounded-lg" required minLength={6} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Confirmar senha</label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="h-11 text-sm rounded-lg" required minLength={6} />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-11 text-sm rounded-full gap-2">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Atualizar senha
              </Button>
            </form>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
