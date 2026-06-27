-- ============================================
-- MIGRATION: Add Multiple Images Support for Projects
-- ============================================
-- This migration changes image_url (single) to images (array)
-- 
-- BACKUP EXISTING DATA FIRST!
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Add new 'images' column (text array)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Step 2: Migrate existing image_url data to images array
-- Only migrate if image_url is not null/empty
UPDATE projects 
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url != '';

-- Step 3: For safety, keep image_url column for now
-- You can drop it later after confirming everything works:
-- ALTER TABLE projects DROP COLUMN image_url;

-- Step 4: Verify the migration
SELECT 
  id, 
  title, 
  image_url as old_single_image,
  images as new_image_array,
  array_length(images, 1) as image_count
FROM projects
LIMIT 5;

-- ============================================
-- DONE! 🎉
-- After running this:
-- 1. Test the new multiple image upload feature
-- 2. Verify all projects display correctly
-- 3. Once confirmed, you can drop the old image_url column
-- ============================================
