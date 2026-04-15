import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Cadastro() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome_completo: "",
    data_nascimento: "",
    contato_whatsapp: "",
    nome_empresa: "",
    email: "",
    ano_inicio_profissao: new Date().getFullYear(),
    site_redes_sociais: "",
    breve_resumo: "",
    link_youtube: "",
    regioes: [] as string[],
    especialidades: [] as string[],
    cidades: [] as string[],
    aceita_divulgacao_materiais: false,
    autoriza_divulgacao_clientes: false,
    foto_url: null as string | null,
  });

  // Get available regions based on selected cities
  const availableRegioes = formData.cidades.flatMap(c => CIDADES_REGIOES[c] || []);
  const uniqueRegioes = [...new Set(availableRegioes)];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("sindicos").insert({
        nome_completo: formData.nome_completo,
        contato_whatsapp: formData.contato_whatsapp,
        nome_empresa: formData.nome_empresa || null,
        email: formData.email || null,
        ano_inicio_profissao: formData.ano_inicio_profissao,
        site_redes_sociais: formData.site_redes_sociais || null,
        breve_resumo: formData.breve_resumo || null,
        link_youtube: formData.link_youtube || null,
        regioes: formData.regioes,
        especialidades: formData.especialidades,
        cidade: formData.cidades,
        aceita_divulgacao_materiais: formData.aceita_divulgacao_materiais,
        autoriza_divulgacao_clientes: formData.autoriza_divulgacao_clientes,
        foto_url: formData.foto_url,
      });

      if (error) throw error;

      toast({
        title: "Cadastro enviado!",
        description: "Seu cadastro foi enviado para aprovação. Entraremos em contato em breve.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {[
        { num: 1, label: "Dados Pessoais" },
        { num: 2, label: "Dados Profissionais" },
        { num: 3, label: "Regiões e Especialidades" },
      ].map((s, index) => (
        <div key={s.num} className="flex items-center gap-2 md:gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all ${
                step > s.num
                  ? "bg-primary text-primary-foreground"
                  : step === s.num
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`text-[10px] md:text-xs text-center ${step === s.num ? "text-primary" : "text-muted-foreground"}`}>
              {s.label}
            </span>
          </div>
          {index < 2 && (
            <div className={`w-8 md:w-12 h-px -mt-5 ${step > s.num ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-8 md:py-14 flex-1">
        <div className="container max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl text-foreground mb-1 tracking-tight" style={{ fontWeight: 500 }}>
              Cadastro de Síndico
            </h1>
            <p className="text-sm text-muted-foreground">Preencha seus dados para aparecer na plataforma</p>
          </div>

          <StepIndicator />

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-xl border border-border/30 p-5 md:p-7"
          >
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-sm text-foreground flex items-center gap-2" style={{ fontWeight: 500 }}>
                  <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center text-xs">1</span>
                  Dados Pessoais
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Foto de Perfil</Label>
                    <PhotoUpload value={formData.foto_url || undefined} onChange={(url) => setFormData({ ...formData, foto_url: url })} />
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Nome Completo <span className="text-destructive">*</span></Label>
                      <Input value={formData.nome_completo} onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })} placeholder="Digite seu nome completo" className="h-10 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">WhatsApp <span className="text-destructive">*</span></Label>
                      <Input value={formData.contato_whatsapp} onChange={(e) => setFormData({ ...formData, contato_whatsapp: e.target.value })} placeholder="(XX) XXXXX-XXXX" className="h-10 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">E-mail</Label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" className="h-10 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Empresa</Label>
                      <Input value={formData.nome_empresa} onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })} placeholder="Nome da empresa (opcional)" className="h-10 text-sm" />
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button onClick={() => setStep(2)} disabled={!formData.nome_completo || !formData.contato_whatsapp} className="w-full md:w-auto h-10 px-6 text-sm rounded-full">
                    Próximo
                  </Button>
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-sm text-foreground flex items-center gap-2" style={{ fontWeight: 500 }}>
                  <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center text-xs">2</span>
                  Dados Profissionais
                </h2>

                <div className="grid gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Cidades de atuação <span className="text-destructive">*</span></Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {CIDADES.map((cid) => (
                        <label
                          key={cid}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                            formData.cidades.includes(cid) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <Checkbox
                            checked={formData.cidades.includes(cid)}
                            onCheckedChange={(c) =>
                              setFormData({
                                ...formData,
                                cidades: c ? [...formData.cidades, cid] : formData.cidades.filter((x) => x !== cid),
                                regioes: c ? formData.regioes : formData.regioes.filter(r => !(CIDADES_REGIOES[cid] || []).includes(r)),
                              })
                            }
                          />
                          <span className="text-xs">{cid}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Ano de início</Label>
                    <Input type="number" value={formData.ano_inicio_profissao} onChange={(e) => setFormData({ ...formData, ano_inicio_profissao: parseInt(e.target.value) || new Date().getFullYear() })} className="h-10 text-sm" min={1990} max={new Date().getFullYear()} />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Site ou Redes Sociais</Label>
                    <Input value={formData.site_redes_sociais} onChange={(e) => setFormData({ ...formData, site_redes_sociais: e.target.value })} placeholder="https://seusite.com" className="h-10 text-sm" />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Breve Resumo</Label>
                    <Textarea value={formData.breve_resumo} onChange={(e) => setFormData({ ...formData, breve_resumo: e.target.value })} placeholder="Conte sobre sua experiência..." className="min-h-[100px] resize-none text-sm" />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Link do YouTube</Label>
                    <Input value={formData.link_youtube} onChange={(e) => setFormData({ ...formData, link_youtube: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="h-10 text-sm" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="h-10 px-5 text-sm rounded-full">Voltar</Button>
                  <Button onClick={() => setStep(3)} className="h-10 px-6 text-sm rounded-full" disabled={formData.cidades.length === 0}>Próximo</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {uniqueRegioes.length > 0 && (
                  <div>
                    <h2 className="text-sm text-foreground flex items-center gap-2 mb-3" style={{ fontWeight: 500 }}>
                      <span className="w-7 h-7 rounded-lg bg-primary/8 text-primary flex items-center justify-center text-xs">3</span>
                      Regiões de Atuação
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {uniqueRegioes.map((r) => (
                        <label
                          key={r}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            formData.regioes.includes(r) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <Checkbox checked={formData.regioes.includes(r)} onCheckedChange={(c) => setFormData({ ...formData, regioes: c ? [...formData.regioes, r] : formData.regioes.filter((x) => x !== r) })} />
                          <span className="text-xs">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-sm text-foreground mb-3" style={{ fontWeight: 500 }}>Especialidades</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ESPECIALIDADES.map((e) => (
                      <label
                        key={e}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          formData.especialidades.includes(e) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                        }`}
                      >
                        <Checkbox checked={formData.especialidades.includes(e)} onCheckedChange={(c) => setFormData({ ...formData, especialidades: c ? [...formData.especialidades, e] : formData.especialidades.filter((x) => x !== e) })} />
                        <span className="text-xs">{e}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30 cursor-pointer">
                  <Checkbox checked={formData.autoriza_divulgacao_clientes} onCheckedChange={(c) => setFormData({ ...formData, autoriza_divulgacao_clientes: !!c })} className="mt-0.5" />
                  <span className="text-xs text-muted-foreground">Autorizo a divulgação da minha empresa para possíveis clientes</span>
                </label>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="h-10 px-5 text-sm rounded-full">Voltar</Button>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button onClick={handleSubmit} disabled={loading || formData.regioes.length === 0 || formData.especialidades.length === 0} className="h-10 px-6 text-sm rounded-full">
                      {loading ? "Enviando..." : "Cadastrar"}
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
