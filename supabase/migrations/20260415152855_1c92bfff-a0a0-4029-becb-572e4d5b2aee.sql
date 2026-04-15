
-- Change cidade from text to text array for multiple cities
ALTER TABLE public.sindicos 
  ALTER COLUMN cidade TYPE text[] USING CASE WHEN cidade IS NULL THEN '{}'::text[] ELSE ARRAY[cidade] END,
  ALTER COLUMN cidade SET DEFAULT '{}'::text[],
  ALTER COLUMN cidade SET NOT NULL;

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Authenticated users can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop old select policy for sindicos and create new ones
DROP POLICY IF EXISTS "Anyone can view approved sindicos" ON public.sindicos;

CREATE POLICY "Anyone can view approved sindicos"
  ON public.sindicos FOR SELECT
  TO public
  USING (status = 'approved' OR public.has_role(auth.uid(), 'admin'));

-- Allow admins to update sindicos (approve/reject)
CREATE POLICY "Admins can update sindicos"
  ON public.sindicos FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete sindicos
CREATE POLICY "Admins can delete sindicos"
  ON public.sindicos FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
