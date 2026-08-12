import { cn } from "@/lib/utils";

interface Opcao {
  value: string;
  label: string;
  hint?: string;
}

interface Props {
  label: string;
  descricao?: string;
  opcoes: Opcao[];
  value: string | string[];
  onChange: (value: any) => void;
  multi?: boolean;
  max?: number;
  colunas?: number;
}

export function DiagnosticoOpcoes({
  label,
  descricao,
  opcoes,
  value,
  onChange,
  multi = false,
  max,
  colunas = 2,
}: Props) {
  const selecionado = (v: string) =>
    multi ? (value as string[]).includes(v) : value === v;

  const toggle = (v: string) => {
    if (!multi) return onChange(v);
    const atual = value as string[];
    if (atual.includes(v)) return onChange(atual.filter((x) => x !== v));
    if (max && atual.length >= max) return;
    onChange([...atual, v]);
  };

  return (
    <div className="mb-8">
      <p className="text-sm text-foreground mb-1" style={{ fontWeight: 450 }}>
        {label}
      </p>
      {descricao && (
        <p className="text-[12px] text-muted-foreground mb-3" style={{ fontWeight: 390 }}>
          {descricao}
        </p>
      )}
      <div
        className={cn(
          "grid gap-2",
          colunas === 1 ? "grid-cols-1" : colunas === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {opcoes.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "text-left rounded-xl border px-4 py-3 transition-colors duration-200",
              selecionado(o.value)
                ? "border-primary/50 bg-primary/[0.06]"
                : "border-border/30 bg-card hover:border-primary/25",
            )}
          >
            <span className="block text-[13px] text-foreground" style={{ fontWeight: 430 }}>
              {o.label}
            </span>
            {o.hint && (
              <span className="block text-[11px] text-muted-foreground mt-0.5" style={{ fontWeight: 390 }}>
                {o.hint}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
