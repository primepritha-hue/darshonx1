
-- Add profile_image_url column to site_settings
ALTER TABLE public.site_settings ADD COLUMN profile_image_url text DEFAULT NULL;

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Allow anyone to view profile images
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Allow admins to upload profile images
CREATE POLICY "Admins can upload profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Allow admins to update profile images
CREATE POLICY "Admins can update profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Allow admins to delete profile images
CREATE POLICY "Admins can delete profile images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
