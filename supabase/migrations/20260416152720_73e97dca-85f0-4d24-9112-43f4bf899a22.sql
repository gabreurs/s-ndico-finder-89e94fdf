-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view approved sindicos" ON public.sindicos;

-- Recreate as permissive: approved visible to everyone, admins see all
CREATE POLICY "Anyone can view approved sindicos"
ON public.sindicos
AS PERMISSIVE FOR SELECT TO public
USING (status = 'approved');

-- Admins can view all statuses
CREATE POLICY "Admins can view all sindicos"
ON public.sindicos
AS PERMISSIVE FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));