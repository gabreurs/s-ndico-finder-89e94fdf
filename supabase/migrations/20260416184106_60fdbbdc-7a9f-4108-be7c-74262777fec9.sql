-- Allow admins to also delete via the admin policy already exists.
-- Add an index for sindicos.email for faster lookup
CREATE INDEX IF NOT EXISTS idx_sindicos_email ON public.sindicos (lower(email));