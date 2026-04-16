import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ESPECIALIDADES, CIDADES_REGIOES, CIDADES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const availableRegioes = formData.cidades.flatMap(c => CIDADES_REGIOES[c] || []);
  const uniqueRegioes = [...new Set(availableRegioes)];

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

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
        title: "Cadastro enviado com sucesso",
        description: "Seu perfil foi enviado para aprovação. Você será notificado quando for publicado.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="py-10 md:py-16 flex-1">
        <div className="container max-w-2xl">
          {/* Breadcrumb */}
          <PageBreadcrumb items={[{ label: "Cadastro profissional" }]} className="mb-6" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <p className="text-[11px] text-primary/70 tracking-[0.2em] uppercase mb-2" style={{ fontWeight: 450 }}>Cadastro profissional</p>
            <h1 className="text-xl md:text-2xl text-foreground tracking-[-0.02em] mb-2" style={{ fontWeight: 400 }}>
              Crie seu perfil de síndico
            </h1>
            <p className="text-[13px] text-muted-foreground" style={{ fontWeight: 400 }}>
              Preencha as informações abaixo. Seu perfil será analisado antes da publicação.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-full h-1 rounded-full transition-colors duration-300 ${step >= s ? 'bg-primary/60' : 'bg-muted/60'}`} />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/60 mb-6" style={{ fontWeight: 420 }}>
            Etapa {step} de {totalSteps} — {step === 1 ? "Dados pessoais" : step === 2 ? "Perfil profissional" : "Atuação e especialidades"}
          </p>

          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-border/30 bg-card p-6 md:p-8"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>Foto de perfil</Label>
                    <PhotoUpload value={formData.foto_url || undefined} onChange={(url) => setFormData({ ...formData, foto_url: url })} />
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>
                        Nome completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.nome_completo}
                        onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                        placeholder="Seu nome completo"
                        className="h-11 text-[13px] rounded-lg border-border/30"
                        style={{ fontWeight: 420 }}
                      />
                    </div>
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>
                        WhatsApp <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.contato_whatsapp}
                        onChange={(e) => setFormData({ ...formData, contato_whatsapp: formatWhatsApp(e.target.value) })}
                        placeholder="(11) 99999-9999"
                        className="h-11 text-[13px] rounded-lg border-border/30"
                        style={{ fontWeight: 420 }}
                      />
                    </div>
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>E-mail</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="h-11 text-[13px] rounded-lg border-border/30"
                        style={{ fontWeight: 420 }}
                      />
                    </div>
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Empresa (opcional)</Label>
                      <Input
                        value={formData.nome_empresa}
                        onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })}
                        placeholder="Nome da empresa"
                        className="h-11 text-[13px] rounded-lg border-border/30"
                        style={{ fontWeight: 420 }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.nome_completo || !formData.contato_whatsapp}
                    className="h-11 px-6 text-[13px] rounded-full gap-2"
                    style={{ fontWeight: 450 }}
                  >
                    Próximo <ArrowRight size={14} />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>
                      Cidades de atuação <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {CIDADES.map((cid) => (
                        <label
                          key={cid}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            formData.cidades.includes(cid) ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"
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
                          <span className="text-[12px]" style={{ fontWeight: 420 }}>{cid}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Ano de início na profissão</Label>
                    <Input
                      type="number"
                      value={formData.ano_inicio_profissao}
                      onChange={(e) => setFormData({ ...formData, ano_inicio_profissao: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="h-11 text-[13px] rounded-lg border-border/30 max-w-[160px]"
                      style={{ fontWeight: 420 }}
                      min={1990}
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Resumo profissional</Label>
                    <Textarea
                      value={formData.breve_resumo}
                      onChange={(e) => setFormData({ ...formData, breve_resumo: e.target.value })}
                      placeholder="Descreva sua experiência, diferenciais e abordagem como síndico profissional..."
                      className="min-h-[120px] resize-none text-[13px] rounded-lg border-border/30"
                      style={{ fontWeight: 420 }}
                    />
                    <p className="text-[10px] text-muted-foreground/50 mt-1.5" style={{ fontWeight: 400 }}>
                      Um bom resumo ajuda moradores a entenderem seu perfil rapidamente.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Site ou redes sociais</Label>
                      <Input
                        value={formData.site_redes_sociais}
                        onChange={(e) => setFormData({ ...formData, site_redes_sociais: e.target.value })}
                        placeholder="https://seusite.com"
                        className="h-11 text-[13px] rounded-lg border-border/30"
                        style={{ fontWeight: 420 }}
                      />
                    </div>
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-1.5 block" style={{ fontWeight: 430 }}>Vídeo de apresentação (YouTube)</Label>
                      <Input
                        value={formData.link_youtube}
                        onChange={(e) => setFormData({ ...formData, link_youtube: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="h-11 text-[13px] rounded-lg border-border/30"
                        style={{ fontWeight: 420 }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="h-11 px-5 text-[13px] rounded-full gap-1.5 border-border/30" style={{ fontWeight: 430 }}>
                      <ArrowLeft size={14} /> Voltar
                    </Button>
                    <Button onClick={() => setStep(3)} className="h-11 px-6 text-[13px] rounded-full gap-2" disabled={formData.cidades.length === 0} style={{ fontWeight: 450 }}>
                      Próximo <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {uniqueRegioes.length > 0 && (
                    <div>
                      <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>Regiões de atuação</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {uniqueRegioes.map((r) => (
                          <label
                            key={r}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              formData.regioes.includes(r) ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"
                            }`}
                          >
                            <Checkbox
                              checked={formData.regioes.includes(r)}
                              onCheckedChange={(c) => setFormData({ ...formData, regioes: c ? [...formData.regioes, r] : formData.regioes.filter((x) => x !== r) })}
                            />
                            <span className="text-[12px]" style={{ fontWeight: 420 }}>{r}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-[12px] text-muted-foreground mb-2 block" style={{ fontWeight: 430 }}>
                      Especialidades <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {ESPECIALIDADES.map((e) => (
                        <label
                          key={e}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            formData.especialidades.includes(e) ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"
                          }`}
                        >
                          <Checkbox
                            checked={formData.especialidades.includes(e)}
                            onCheckedChange={(c) => setFormData({ ...formData, especialidades: c ? [...formData.especialidades, e] : formData.especialidades.filter((x) => x !== e) })}
                          />
                          <span className="text-[12px]" style={{ fontWeight: 420 }}>{e}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/20 cursor-pointer">
                    <Checkbox
                      checked={formData.autoriza_divulgacao_clientes}
                      onCheckedChange={(c) => setFormData({ ...formData, autoriza_divulgacao_clientes: !!c })}
                      className="mt-0.5"
                    />
                    <span className="text-[12px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                      Autorizo a divulgação do meu perfil para condomínios e possíveis clientes na plataforma.
                    </span>
                  </label>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/[0.03] border border-primary/[0.08]">
                    <Info size={14} className="text-primary/50 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed" style={{ fontWeight: 400 }}>
                      Seu cadastro será enviado para análise. Após aprovação, seu perfil ficará visível na plataforma. Você será notificado por e-mail.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="h-11 px-5 text-[13px] rounded-full gap-1.5 border-border/30" style={{ fontWeight: 430 }}>
                      <ArrowLeft size={14} /> Voltar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || formData.especialidades.length === 0}
                      className="h-11 px-6 text-[13px] rounded-full gap-2"
                      style={{ fontWeight: 450 }}
                    >
                      {loading ? "Enviando..." : "Enviar cadastro"}
                      {!loading && <ArrowRight size={14} />}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
