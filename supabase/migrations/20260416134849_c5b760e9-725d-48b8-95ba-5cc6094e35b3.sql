
-- Add slug column
ALTER TABLE public.sindicos ADD COLUMN slug text;

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION public.generate_slug(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT regexp_replace(
    regexp_replace(
      lower(
        translate(
          normalize(input_text, NFD),
          'àáâãäåèéêëìíîïòóôõöùúûüýÿñçÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÑÇ',
          'aaaaaaeeeeiiiioooooouuuuyyncAAAAAAEEEEIIIIOOOOOUUUUYYNC'
        )
      ),
      '[^a-z0-9]+', '-', 'g'
    ),
    '(^-|-$)', '', 'g'
  )
$$;

-- Populate slugs for existing records
UPDATE public.sindicos SET slug = generate_slug(nome_completo);

-- Handle any slug collisions by appending a number
DO $$
DECLARE
  r RECORD;
  counter INT;
BEGIN
  FOR r IN 
    SELECT id, slug FROM public.sindicos 
    WHERE slug IN (SELECT slug FROM public.sindicos GROUP BY slug HAVING count(*) > 1)
    ORDER BY slug, created_at
  LOOP
    SELECT count(*) INTO counter 
    FROM public.sindicos 
    WHERE slug = r.slug AND id < r.id;
    
    IF counter > 0 THEN
      UPDATE public.sindicos SET slug = r.slug || '-' || counter WHERE id = r.id;
    END IF;
  END LOOP;
END $$;

-- Make slug not null and unique
ALTER TABLE public.sindicos ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX idx_sindicos_slug ON public.sindicos (slug);

-- Create a trigger to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION public.set_sindico_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $func$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := generate_slug(NEW.nome_completo);
    final_slug := base_slug;
    LOOP
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.sindicos WHERE slug = final_slug AND id != NEW.id);
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$func$;

CREATE TRIGGER trg_set_sindico_slug
  BEFORE INSERT OR UPDATE ON public.sindicos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_sindico_slug();
