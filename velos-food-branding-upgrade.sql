-- Velos Foods launch upgrade: restaurant logos + free pilot registration
-- Review and run in Supabase SQL Editor before deploying the updated frontend.

ALTER TABLE public.food_vendors
  ADD COLUMN IF NOT EXISTS logo_url text;

-- Registration is free during the pilot. Admin can change this in Admin > Settings.
INSERT INTO public.settings(key, value)
VALUES ('site_vendor_reg_fee', '0')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Public logos are display assets; only authenticated users can upload.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('food-logos', 'food-logos', true, 4194304, ARRAY['image/png','image/jpeg','image/webp']::text[])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 4194304,
  allowed_mime_types = ARRAY['image/png','image/jpeg','image/webp']::text[];

DROP POLICY IF EXISTS "Public can view restaurant logos" ON storage.objects;
CREATE POLICY "Public can view restaurant logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'food-logos');

DROP POLICY IF EXISTS "Restaurant owners upload own logo" ON storage.objects;
CREATE POLICY "Restaurant owners upload own logo" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'food-logos'
    AND (EXISTS (
      SELECT 1 FROM public.food_vendors v
      WHERE v.id::text = (storage.foldername(name))[1]
        AND v.user_id = auth.uid()
    ) OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  );

DROP POLICY IF EXISTS "Restaurant owners update own logo files" ON storage.objects;
CREATE POLICY "Restaurant owners update own logo files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'food-logos'
    AND (EXISTS (
      SELECT 1 FROM public.food_vendors v
      WHERE v.id::text = (storage.foldername(name))[1]
        AND v.user_id = auth.uid()
    ) OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  )
  WITH CHECK (
    bucket_id = 'food-logos'
    AND (EXISTS (
      SELECT 1 FROM public.food_vendors v
      WHERE v.id::text = (storage.foldername(name))[1]
        AND v.user_id = auth.uid()
    ) OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  );

CREATE OR REPLACE FUNCTION public.vendor_update_logo(p_logo_url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in first.';
  END IF;
  IF p_logo_url IS NULL OR length(trim(p_logo_url)) < 10 THEN
    RAISE EXCEPTION 'A valid logo URL is required.';
  END IF;
  UPDATE public.food_vendors
    SET logo_url = trim(p_logo_url)
    WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This login is not linked to a restaurant.';
  END IF;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.vendor_update_logo(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.vendor_update_logo(text) TO authenticated;
