CREATE UNIQUE INDEX idx_sindicos_unique_whatsapp_active 
ON public.sindicos (contato_whatsapp) 
WHERE status IN ('pending', 'approved') AND contato_whatsapp != '';