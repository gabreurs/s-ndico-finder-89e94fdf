import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMeuPerfilRedirectUrl, supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { BioBuilder } from "@/components/BioBuilder";
import { BioData, buildBio } from "@/lib/bioBuilder";
import { motion } from "framer-motion";
import { LogOut, Save, Mail, Loader2, Lock, KeyRound, Sparkles, Pencil } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Sindico = Tables<"sindicos">;
type Mode = "login" | "forgot";

export default function MeuPerfil() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sindico, setSindico] = useState<Sindico | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState<Partial<Sindico>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.email) {
        fetchProfile(nextSession.user.email);
      } else {
        setSindico(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user.email) {
        fetchProfile(currentSession.user.email);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userEmail: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("sindicos")
      .select("*")
      .ilike("email", userEmail)
      .maybeSingle();

    if (data) {
      setSindico(data);
      setFormData(data);
    } else {
      setSindico(null);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setResetSent(true);
      toast({ title: "E-mail enviado!", description: "Verifique sua caixa de entrada para redefinir a senha." });
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setSindico(null);
  };

  const handleSave = async () => {
    if (!sindico) return;
    setSaving(true);
    const { error } = await supabase
      .from("sindicos")
      .update({
        nome_completo: formData.nome_completo,
        contato_whatsapp: formData.contato_whatsapp,
        nome_empresa: formData.nome_empresa,
        breve_resumo: formData.breve_resumo,
        site_redes_sociais: formData.site_redes_sociais,
        link_youtube: formData.link_youtube,
        ano_inicio_profissao: formData.ano_inicio_profissao,
        especialidades: formData.especialidades,
        cidade: formData.cidade,
        regioes: formData.regioes,
        foto_url: formData.foto_url,
      })
      .eq("id", sindico.id);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
      setSindico({ ...sindico, ...formData } as Sindico);
    }
    setSaving(false);
  };

  const availableRegioes = (formData.cidade || []).flatMap(c => CIDADES_REGIOES[c] || []);
  const uniqueRegioes = [...new Set(availableRegioes)];

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/40 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Login screen ── */
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="text-xl text-foreground tracking-tight" style={{ fontWeight: 450 }}>
                {mode === "forgot" ? "Recuperar senha" : "Meu Perfil"}
              </h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                {mode === "forgot"
                  ? "Enviaremos um link para redefinir sua senha."
                  : "Acesse com seu e-mail e senha cadastrados."}
              </p>
            </div>

            {mode === "login" && (
              <form onSubmit={handleLogin} className="bg-card rounded-2xl border border-border/20 p-6 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="h-11 text-sm rounded-lg" required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Senha</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 text-sm rounded-lg" required minLength={6} />
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-11 text-sm rounded-full gap-2">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                  Entrar
                </Button>
                <div className="flex flex-col gap-2 pt-2 border-t border-border/20">
                  <button type="button" onClick={() => { setMode("forgot"); setResetSent(false); }} className="text-[12px] text-primary hover:underline">
                    Esqueci minha senha
                  </button>
                  <a href="/cadastro" className="text-[12px] text-muted-foreground hover:text-foreground">
                    Não tem conta? Cadastre-se
                  </a>
                </div>
              </form>
            )}

            {mode === "forgot" && !resetSent && (
              <form onSubmit={handleForgotPassword} className="bg-card rounded-2xl border border-border/20 p-6 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-mail cadastrado</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="h-11 text-sm rounded-lg" required />
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-11 text-sm rounded-full gap-2">
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                  Enviar link de recuperação
                </Button>
                <button type="button" onClick={() => setMode("login")} className="text-[12px] text-muted-foreground hover:text-foreground w-full text-center">
                  Voltar ao login
                </button>
              </form>
            )}

            {mode === "forgot" && resetSent && (
              <div className="bg-card rounded-2xl border border-border/20 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail size={20} className="text-primary" />
                </div>
                <h2 className="text-sm text-foreground" style={{ fontWeight: 450 }}>E-mail enviado!</h2>
                <p className="text-[12px] text-muted-foreground">
                  Enviamos um link para <strong>{email}</strong>. Verifique sua caixa de entrada (e spam) para redefinir sua senha.
                </p>
                <Button variant="ghost" size="sm" onClick={() => { setMode("login"); setResetSent(false); }} className="text-xs">
                  Voltar ao login
                </Button>
              </div>
            )}
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── No profile found ── */
  if (!sindico) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <Mail size={28} className="text-destructive" />
          </div>
          <p className="text-foreground text-center text-lg" style={{ fontWeight: 420 }}>
            E-mail não vinculado a nenhum perfil
          </p>
          <p className="text-[13px] text-muted-foreground text-center max-w-md">
            O e-mail <strong>{session.user.email}</strong> não corresponde a nenhum cadastro de síndico aprovado.
            Para acessar, use o mesmo e-mail informado no cadastro.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full text-xs h-9">
              <a href="/cadastro">Criar cadastro</a>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-xs h-9">
              <LogOut size={12} /> Sair
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Profile edit ── */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-10 md:py-16 flex-1">
        <div className="container max-w-2xl">
          <PageBreadcrumb items={[{ label: "Meu Perfil" }]} className="mb-6" />

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl text-foreground tracking-[-0.02em]" style={{ fontWeight: 400 }}>
                Editar meu perfil
              </h1>
              <p className="text-[12px] text-muted-foreground mt-1">
                {session.user.email}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-xs">
              <LogOut size={14} /> Sair
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/30 bg-card p-6 md:p-8 space-y-6"
          >
            <div>
              <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>Foto de perfil</Label>
              <PhotoUpload
                value={formData.foto_url || undefined}
                onChange={(url) => setFormData({ ...formData, foto_url: url })}
              />
            </div>

            <div className="grid gap-4">
              <div>
                <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Nome completo</Label>
                <Input value={formData.nome_completo || ""} onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })} className="h-11 text-[13px] rounded-lg border-border/30" />
              </div>
              <div>
                <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>WhatsApp</Label>
                <Input value={formData.contato_whatsapp || ""} onChange={(e) => setFormData({ ...formData, contato_whatsapp: e.target.value })} className="h-11 text-[13px] rounded-lg border-border/30" />
              </div>
              <div>
                <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Empresa</Label>
                <Input value={formData.nome_empresa || ""} onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })} className="h-11 text-[13px] rounded-lg border-border/30" />
              </div>
            </div>

            <div>
              <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Ano de início na profissão</Label>
              <Input type="number" value={formData.ano_inicio_profissao || ""} onChange={(e) => setFormData({ ...formData, ano_inicio_profissao: parseInt(e.target.value) || null })} className="h-11 text-[13px] rounded-lg border-border/30 max-w-[160px]" min={1990} max={new Date().getFullYear()} />
            </div>

            <div>
              <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Resumo profissional</Label>
              <Textarea value={formData.breve_resumo || ""} onChange={(e) => setFormData({ ...formData, breve_resumo: e.target.value })} className="min-h-[120px] resize-none text-[13px] rounded-lg border-border/30" />
            </div>

            <div className="grid gap-4">
              <div>
                <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Site / Redes sociais</Label>
                <Input value={formData.site_redes_sociais || ""} onChange={(e) => setFormData({ ...formData, site_redes_sociais: e.target.value })} className="h-11 text-[13px] rounded-lg border-border/30" />
              </div>
              <div>
                <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Vídeo YouTube</Label>
                <Input value={formData.link_youtube || ""} onChange={(e) => setFormData({ ...formData, link_youtube: e.target.value })} className="h-11 text-[13px] rounded-lg border-border/30" />
              </div>
            </div>

            <div>
              <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>Cidades de atuação</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CIDADES.map((cid) => (
                  <label key={cid} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${(formData.cidade || []).includes(cid) ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"}`}>
                    <Checkbox checked={(formData.cidade || []).includes(cid)} onCheckedChange={(c) => setFormData({ ...formData, cidade: c ? [...(formData.cidade || []), cid] : (formData.cidade || []).filter((x) => x !== cid), regioes: c ? formData.regioes : (formData.regioes || []).filter(r => !(CIDADES_REGIOES[cid] || []).includes(r)) })} />
                    <span className="text-[12px]" style={{ fontWeight: 420 }}>{cid}</span>
                  </label>
                ))}
              </div>
            </div>

            {uniqueRegioes.length > 0 && (
              <div>
                <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>Regiões de atuação</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {uniqueRegioes.map((r) => (
                    <label key={r} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${(formData.regioes || []).includes(r) ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"}`}>
                      <Checkbox checked={(formData.regioes || []).includes(r)} onCheckedChange={(c) => setFormData({ ...formData, regioes: c ? [...(formData.regioes || []), r] : (formData.regioes || []).filter((x) => x !== r) })} />
                      <span className="text-[12px]" style={{ fontWeight: 420 }}>{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>Especialidades</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ESPECIALIDADES.map((esp) => (
                  <label key={esp} className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${(formData.especialidades || []).includes(esp) ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"}`}>
                    <Checkbox checked={(formData.especialidades || []).includes(esp)} onCheckedChange={(c) => setFormData({ ...formData, especialidades: c ? [...(formData.especialidades || []), esp] : (formData.especialidades || []).filter((x) => x !== esp) })} />
                    <span className="text-[12px]" style={{ fontWeight: 420 }}>{esp}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={handleSave} disabled={saving} className="h-11 px-8 text-[13px] rounded-full gap-2" style={{ fontWeight: 450 }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Salvar alterações
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
