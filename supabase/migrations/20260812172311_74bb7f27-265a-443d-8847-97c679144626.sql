CREATE TABLE IF NOT EXISTS public.test_rls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT
);

GRANT INSERT ON public.test_rls TO anon;
GRANT ALL ON public.test_rls TO service_role;
ALTER TABLE public.test_rls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "test_insert" ON public.test_rls;
CREATE POLICY "test_insert"
ON public.test_rls
FOR INSERT
TO public
WITH CHECK (true);
