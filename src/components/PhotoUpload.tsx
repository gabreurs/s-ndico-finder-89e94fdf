import { useState, useRef } from "react";
import { Upload, X, AlertCircle, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface PhotoUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_DIMENSION = 300;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File): Promise<{ valid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        resolve({
          valid: false,
          error: "Formato inválido. Use JPG, PNG ou WebP.",
        });
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        resolve({
          valid: false,
          error: "Arquivo muito grande. Máximo 5MB.",
        });
        return;
      }

      // Check dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
          resolve({
            valid: false,
            error: `Imagem muito pequena. Mínimo ${MIN_DIMENSION}x${MIN_DIMENSION}px.`,
          });
        } else {
          resolve({ valid: true });
        }
      };
      img.onerror = () => {
        resolve({
          valid: false,
          error: "Não foi possível processar a imagem.",
        });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const validation = await validateImage(file);
      if (!validation.valid) {
        setError(validation.error || "Erro na validação");
        setUploading(false);
        return;
      }

      // Caminho preferencial: Edge Function (valida tipo/tamanho no servidor).
      const { data, error: uploadError } = await supabase.functions.invoke(
        "upload-sindico-photo",
        {
          body: file,
          headers: { "x-file-type": file.type },
        },
      );

      if (!uploadError && data?.url) {
        onChange(data.url as string);
        return;
      }

      // Fallback: envio direto ao Storage. Necessário enquanto a Edge Function
      // não estiver publicada no projeto — sem isso o cadastro trava na foto.
      console.warn("[PhotoUpload] Edge Function indisponível, usando upload direto.", uploadError);
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `profiles/${crypto.randomUUID()}.${ext}`;
      const { error: storageError } = await supabase.storage
        .from("sindicos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (storageError) throw storageError;

      const { data: pub } = supabase.storage.from("sindicos").getPublicUrl(path);
      if (!pub?.publicUrl) throw new Error("Falha ao obter URL pública da foto");
      onChange(pub.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Erro ao fazer upload. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
          dragOver
            ? "border-primary bg-primary/5"
            : error
            ? "border-destructive bg-destructive/5"
            : value
            ? "border-green-500 bg-green-500/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="p-6 flex flex-col items-center gap-4">
          {value ? (
            <div className="relative">
              <img
                src={value}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <User size={48} className="text-muted-foreground/50" />
              )}
            </div>
          )}

          <div className="text-center">
            {uploading ? (
              <p className="text-sm text-muted-foreground">Enviando foto...</p>
            ) : value ? (
              <p className="text-sm text-green-600 font-medium">
                Foto enviada com sucesso!
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground mb-1">
                  Arraste sua foto ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou WebP • Máx. 5MB • Mín. 300x300px
                </p>
              </>
            )}
          </div>

          {!value && !uploading && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={16} />
              Escolher foto
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">📸 Dicas para uma foto profissional:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-1">
          <li>Use uma foto com boa iluminação e fundo neutro</li>
          <li>Centralize seu rosto na imagem</li>
          <li>Evite fotos com óculos escuros ou bonés</li>
          <li>Prefira roupas formais ou smart casual</li>
        </ul>
      </div>
    </div>
  );
}
