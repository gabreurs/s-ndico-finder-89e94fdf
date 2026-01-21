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
    cidade: "",
    aceita_divulgacao_materiais: false,
    autoriza_divulgacao_clientes: false,
    foto_url: null as string | null,
  });

  // Get available regions based on selected city
  const availableRegioes = formData.cidade ? CIDADES_REGIOES[formData.cidade] || [] : [];

  const handleCidadeChange = (value: string) => {
    setFormData({ 
      ...formData, 
      cidade: value,
      regioes: [] // Reset regions when city changes
    });
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
        cidade: formData.cidade || null,
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
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
      {[
        { num: 1, label: "Dados Pessoais" },
        { num: 2, label: "Dados Profissionais" },
        { num: 3, label: "Regiões e Especialidades" },
      ].map((s, index) => (
        <div key={s.num} className="flex items-center gap-2 md:gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all ${
                step > s.num
                  ? "bg-primary text-primary-foreground"
                  : step === s.num
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <Check size={20} /> : s.num}
            </div>
            <span
              className={`text-xs md:text-sm text-center ${
                step === s.num ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
          {index < 2 && (
            <div
              className={`w-8 md:w-16 h-1 rounded-full -mt-6 ${
                step > s.num ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <section className="py-10 md:py-16 flex-1">
        <div className="container max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Cadastro de Síndico
            </h1>
            <p className="text-muted-foreground">
              Preencha seus dados para aparecer na plataforma
            </p>
          </div>

          <StepIndicator />

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Dados Pessoais
                </h2>

                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Foto de Perfil
                    </Label>
                    <PhotoUpload
                      value={formData.foto_url || undefined}
                      onChange={(url) => setFormData({ ...formData, foto_url: url })}
                    />
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Nome Completo <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.nome_completo}
                        onChange={(e) =>
                          setFormData({ ...formData, nome_completo: e.target.value })
                        }
                        placeholder="Digite seu nome completo"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Contato WhatsApp <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.contato_whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, contato_whatsapp: e.target.value })
                        }
                        placeholder="(XX) XXXXX-XXXX"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">E-mail</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="seu@email.com"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Nome da Empresa
                      </Label>
                      <Input
                        value={formData.nome_empresa}
                        onChange={(e) =>
                          setFormData({ ...formData, nome_empresa: e.target.value })
                        }
                        placeholder="Nome da sua empresa (opcional)"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.nome_completo || !formData.contato_whatsapp}
                    className="w-full md:w-auto h-12 px-8"
                  >
                    Próximo Passo
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Dados Profissionais
                </h2>

                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Cidade onde atua <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.cidade} onValueChange={handleCidadeChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione a cidade..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CIDADES.map((cid) => (
                          <SelectItem key={cid} value={cid}>
                            {cid}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Ano de início na profissão
                    </Label>
                    <Input
                      type="number"
                      value={formData.ano_inicio_profissao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ano_inicio_profissao: parseInt(e.target.value) || new Date().getFullYear(),
                        })
                      }
                      placeholder="Ex: 2015"
                      className="h-12"
                      min={1990}
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Site ou Redes Sociais
                    </Label>
                    <Input
                      value={formData.site_redes_sociais}
                      onChange={(e) =>
                        setFormData({ ...formData, site_redes_sociais: e.target.value })
                      }
                      placeholder="https://seusite.com ou @instagram"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Breve Resumo
                    </Label>
                    <Textarea
                      value={formData.breve_resumo}
                      onChange={(e) =>
                        setFormData({ ...formData, breve_resumo: e.target.value })
                      }
                      placeholder="Conte um pouco sobre sua experiência e diferenciais..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Link do YouTube (opcional)
                    </Label>
                    <Input
                      value={formData.link_youtube}
                      onChange={(e) =>
                        setFormData({ ...formData, link_youtube: e.target.value })
                      }
                      placeholder="https://youtube.com/watch?v=..."
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-12 px-6"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    className="h-12 px-8"
                    disabled={!formData.cidade}
                  >
                    Próximo Passo
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    Regiões de Atuação em {formData.cidade}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableRegioes.map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.regioes.includes(r)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={formData.regioes.includes(r)}
                          onCheckedChange={(c) =>
                            setFormData({
                              ...formData,
                              regioes: c
                                ? [...formData.regioes, r]
                                : formData.regioes.filter((x) => x !== r),
                            })
                          }
                        />
                        <span className="text-sm font-medium">{r}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Especialidades
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ESPECIALIDADES.map((e) => (
                      <label
                        key={e}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.especialidades.includes(e)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={formData.especialidades.includes(e)}
                          onCheckedChange={(c) =>
                            setFormData({
                              ...formData,
                              especialidades: c
                                ? [...formData.especialidades, e]
                                : formData.especialidades.filter((x) => x !== e),
                            })
                          }
                        />
                        <span className="text-sm font-medium">{e}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 cursor-pointer">
                    <Checkbox
                      checked={formData.autoriza_divulgacao_clientes}
                      onCheckedChange={(c) =>
                        setFormData({ ...formData, autoriza_divulgacao_clientes: !!c })
                      }
                      className="mt-0.5"
                    />
                    <span className="text-sm">
                      Você autoriza a divulgação da sua empresa para possíveis clientes?
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="h-12 px-6"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      formData.regioes.length === 0 ||
                      formData.especialidades.length === 0
                    }
                    className="h-12 px-8"
                  >
                    {loading ? "Enviando..." : "Cadastrar Como Síndico"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
