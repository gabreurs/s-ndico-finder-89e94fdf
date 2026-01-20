import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ESPECIALIDADES, REGIOES } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-8 flex-1">
        <div className="container max-w-3xl">
          <div className="flex justify-center gap-4 mb-8">
            <Button variant={step === 1 ? "default" : "outline"}>Cadastro de Síndico</Button>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? "bg-primary text-primary-foreground" : "border border-muted-foreground text-muted-foreground"}`}>
                  {s}
                </div>
                <span className={`text-sm ${step === s ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {s === 1 ? "Etapa 1" : s === 2 ? "Etapa 2" : "Etapa Final"}
                </span>
                {s < 3 && <div className={`w-16 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dados Pessoais</h2>
              <div className="grid gap-4">
                <div><Label>Nome Completo *</Label><Input value={formData.nome_completo} onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })} /></div>
                <div><Label>Contato Whatsapp *</Label><Input value={formData.contato_whatsapp} onChange={(e) => setFormData({ ...formData, contato_whatsapp: e.target.value })} placeholder="(XX) XXXXX-XXXX" /></div>
                <div><Label>E-mail</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                <div><Label>Nome da empresa</Label><Input value={formData.nome_empresa} onChange={(e) => setFormData({ ...formData, nome_empresa: e.target.value })} /></div>
              </div>
              <Button onClick={() => setStep(2)} disabled={!formData.nome_completo || !formData.contato_whatsapp}>Próximo</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dados Empresarial</h2>
              <div className="grid gap-4">
                <div><Label>Site ou Redes Sociais</Label><Input value={formData.site_redes_sociais} onChange={(e) => setFormData({ ...formData, site_redes_sociais: e.target.value })} /></div>
                <div><Label>Breve Resumo</Label><Textarea value={formData.breve_resumo} onChange={(e) => setFormData({ ...formData, breve_resumo: e.target.value })} /></div>
                <div><Label>Link do Youtube</Label><Input value={formData.link_youtube} onChange={(e) => setFormData({ ...formData, link_youtube: e.target.value })} /></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                <Button onClick={() => setStep(3)}>Próximo</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Escolha a Região onde atua</h2>
              <div className="grid grid-cols-2 gap-2">
                {REGIOES.map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={formData.regioes.includes(r)} onCheckedChange={(c) => setFormData({ ...formData, regioes: c ? [...formData.regioes, r] : formData.regioes.filter((x) => x !== r) })} />
                    {r}
                  </label>
                ))}
              </div>

              <h2 className="text-2xl font-bold">Escolha suas especialidades</h2>
              <div className="grid grid-cols-2 gap-2">
                {ESPECIALIDADES.map((e) => (
                  <label key={e} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={formData.especialidades.includes(e)} onCheckedChange={(c) => setFormData({ ...formData, especialidades: c ? [...formData.especialidades, e] : formData.especialidades.filter((x) => x !== e) })} />
                    {e}
                  </label>
                ))}
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox checked={formData.autoriza_divulgacao_clientes} onCheckedChange={(c) => setFormData({ ...formData, autoriza_divulgacao_clientes: !!c })} />
                  <span>Você autoriza a divulgação da sua empresa para possíveis clientes?</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                <Button onClick={handleSubmit} disabled={loading || formData.regioes.length === 0 || formData.especialidades.length === 0}>
                  {loading ? "Enviando..." : "Cadastrar Como Síndico"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
