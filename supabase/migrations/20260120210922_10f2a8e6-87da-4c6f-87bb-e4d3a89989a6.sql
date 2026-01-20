-- Create enum for approval status
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create table for síndicos
CREATE TABLE public.sindicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados Pessoais (Etapa 1)
  nome_completo TEXT NOT NULL,
  data_nascimento DATE,
  contato_whatsapp TEXT NOT NULL,
  nome_empresa TEXT,
  foto_url TEXT,
  
  -- Dados Empresariais (Etapa 2)
  ano_inicio_profissao INTEGER,
  site_redes_sociais TEXT,
  breve_resumo TEXT,
  galeria_urls TEXT[],
  link_youtube TEXT,
  
  -- Região e Especialidades (Etapa 3)
  regioes TEXT[] NOT NULL DEFAULT '{}',
  especialidades TEXT[] NOT NULL DEFAULT '{}',
  cidade TEXT,
  
  -- Termos e Condições
  aceita_divulgacao_materiais BOOLEAN DEFAULT false,
  autoriza_divulgacao_clientes BOOLEAN DEFAULT false,
  
  -- Status de aprovação
  status approval_status NOT NULL DEFAULT 'pending',
  
  -- Email para contato (opcional)
  email TEXT
);

-- Enable Row Level Security
ALTER TABLE public.sindicos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only approved síndicos)
CREATE POLICY "Anyone can view approved sindicos"
ON public.sindicos
FOR SELECT
USING (status = 'approved');

-- Create policy for public insert (anyone can register)
CREATE POLICY "Anyone can register as sindico"
ON public.sindicos
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sindicos_updated_at
BEFORE UPDATE ON public.sindicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for sindico photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sindicos', 'sindicos', true);

-- Create policy for public access to sindico photos
CREATE POLICY "Anyone can view sindico photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'sindicos');

-- Create policy for anyone to upload sindico photos
CREATE POLICY "Anyone can upload sindico photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'sindicos');