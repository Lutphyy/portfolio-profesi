-- ============================================
-- SUPABASE STORAGE SETUP - SIMPLIFIED VERSION
-- Setup buckets and RLS policies for portfolio
-- ============================================
-- 
-- CARA PAKAI:
-- Jalanin script ini di SQL Editor Supabase Dashboard
-- Kalau masih error, setup manual lewat Storage UI (lihat instruksi di bawah)
-- 
-- ============================================

-- ============================================
-- 1. CREATE BUCKETS
-- ============================================

-- Create 'profiles' bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Create 'projects' bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'projects',
  'projects',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- ============================================
-- 2. DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated uploads to profiles" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to profiles" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from profiles" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to profiles" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated uploads to projects" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to projects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from projects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to projects" ON storage.objects;

-- ============================================
-- 3. CREATE POLICIES FOR 'PROFILES' BUCKET
-- ============================================

CREATE POLICY "Allow authenticated uploads to profiles"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Public read access to profiles"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Allow authenticated deletes from profiles"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profiles');

CREATE POLICY "Allow authenticated updates to profiles"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles')
WITH CHECK (bucket_id = 'profiles');

-- ============================================
-- 4. CREATE POLICIES FOR 'PROJECTS' BUCKET
-- ============================================

CREATE POLICY "Allow authenticated uploads to projects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects');

CREATE POLICY "Public read access to projects"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'projects');

CREATE POLICY "Allow authenticated deletes from projects"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'projects');

CREATE POLICY "Allow authenticated updates to projects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'projects')
WITH CHECK (bucket_id = 'projects');

-- ============================================
-- VERIFY SETUP
-- ============================================

SELECT 
  'Buckets Created' as status,
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id IN ('profiles', 'projects');

-- ============================================
-- DONE! 🎉
-- ============================================
