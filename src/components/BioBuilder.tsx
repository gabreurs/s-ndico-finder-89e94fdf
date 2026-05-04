import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BioData,
  FAIXA_CONDOMINIOS,
  FAIXA_UNIDADES,
  PORTE_PREFERIDO,
  DIFERENCIAIS,
  FORMACOES,
  buildBio,
} from "@/lib/bioBuilder";
import { Sparkles } from "lucide-react";

interface BioBuilderProps {
  value: BioData;
  onChange: (data: BioData) => void;
  especialidades?: string[];
}

export function BioBuilder({ value, onChange, especialidades }: BioBuilderProps) {
  const update = (patch: Partial<BioData>) => onChange({ ...value, ...patch });

  const toggleArr = (key: "porte_preferido" | "diferenciais" | "formacoes", item: string, max?: number) => {
    const current = (value[key] || []) as string[];
    const exists = current.includes(item);
    if (exists) {
      update({ [key]: current.filter((x) => x !== item) } as any);
    } else {
      if (max && current.length >= max) return;
      update({ [key]: [...current, item] } as any);
    }
  };

  const preview = buildBio(value, especialidades);

  const labelStyle = { fontWeight: 430 } as const;
  const labelClass = "text-[12px] text-muted-foreground mb-2 block";

  const radioCard = (active: boolean) =>
    `flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
      active ? "border-primary/30 bg-primary/[0.04]" : "border-border/20 hover:border-border/40"
    }`;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-primary/[0.04] border border-primary/10 p-3 flex items-start gap-2">
        <Sparkles size={14} className="text-primary/70 mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Responda as perguntas abaixo e seu resumo profissional será montado automaticamente, mantendo o padrão do site.
        </p>
      </div>

      {/* Anos de experiência */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Anos de experiência como síndico
        </Label>
        <Input
          type="number"
          min={0}
          max={60}
          value={value.anos_experiencia ?? ""}
          onChange={(e) => update({ anos_experiencia: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="Ex: 8"
          className="h-11 text-[13px] rounded-lg border-border/30 max-w-[160px]"
        />
      </div>

      {/* Faixa de condomínios */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Quantos condomínios você já administrou no total?
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {FAIXA_CONDOMINIOS.map((opt) => (
            <label key={opt.value} className={radioCard(value.faixa_condominios === opt.value)}>
              <input
                type="radio"
                name="faixa_condominios"
                checked={value.faixa_condominios === opt.value}
                onChange={() => update({ faixa_condominios: opt.value })}
                className="accent-primary"
              />
              <span className="text-[12px]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Faixa de unidades */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Quantas unidades você gere atualmente?
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {FAIXA_UNIDADES.map((opt) => (
            <label key={opt.value} className={radioCard(value.faixa_unidades === opt.value)}>
              <input
                type="radio"
                name="faixa_unidades"
                checked={value.faixa_unidades === opt.value}
                onChange={() => update({ faixa_unidades: opt.value })}
                className="accent-primary"
              />
              <span className="text-[12px]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Porte preferido */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Porte de condomínio que mais atende (pode marcar mais de um)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {PORTE_PREFERIDO.map((opt) => {
            const checked = (value.porte_preferido || []).includes(opt.value);
            return (
              <label key={opt.value} className={radioCard(checked)}>
                <Checkbox checked={checked} onCheckedChange={() => toggleArr("porte_preferido", opt.value)} />
                <span className="text-[12px]">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Diferenciais */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Seus 3 principais diferenciais{" "}
          <span className="text-muted-foreground/60">
            ({(value.diferenciais || []).length}/3)
          </span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {DIFERENCIAIS.map((d) => {
            const checked = (value.diferenciais || []).includes(d);
            const disabled = !checked && (value.diferenciais || []).length >= 3;
            return (
              <label
                key={d}
                className={`${radioCard(checked)} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Checkbox
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={() => toggleArr("diferenciais", d, 3)}
                />
                <span className="text-[12px]">{d}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Formação */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Formação e certificações (pode marcar várias)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {FORMACOES.map((f) => {
            const checked = (value.formacoes || []).includes(f);
            return (
              <label key={f} className={radioCard(checked)}>
                <Checkbox checked={checked} onCheckedChange={() => toggleArr("formacoes", f)} />
                <span className="text-[12px]">{f}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Frase pessoal */}
      <div>
        <Label className={labelClass} style={labelStyle}>
          Frase pessoal (opcional, máx. 140 caracteres)
        </Label>
        <Textarea
          value={value.frase_pessoal || ""}
          onChange={(e) => update({ frase_pessoal: e.target.value.slice(0, 140) })}
          placeholder="Ex: Acredito que um bom síndico transforma a rotina dos moradores."
          className="min-h-[60px] resize-none text-[13px] rounded-lg border-border/30"
          maxLength={140}
        />
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          {(value.frase_pessoal || "").length}/140
        </p>
      </div>

      {/* Preview */}
      {preview && (
        <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-4">
          <p className="text-[10px] text-primary/60 uppercase tracking-[0.18em] mb-2" style={{ fontWeight: 500 }}>
            Prévia do seu resumo
          </p>
          <p className="text-[13px] text-foreground/85 leading-relaxed" style={{ fontWeight: 400 }}>
            {preview}
          </p>
        </div>
      )}
    </div>
  );
}
