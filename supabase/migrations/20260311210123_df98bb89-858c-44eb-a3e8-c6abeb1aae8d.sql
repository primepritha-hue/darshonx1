
-- Drop restrictive policies and recreate as permissive for skill_tags
DROP POLICY IF EXISTS "Admins can manage skill tags" ON public.skill_tags;
DROP POLICY IF EXISTS "Anyone can read active skill tags" ON public.skill_tags;

CREATE POLICY "Anyone can read skill tags" ON public.skill_tags
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage skill tags" ON public.skill_tags
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
