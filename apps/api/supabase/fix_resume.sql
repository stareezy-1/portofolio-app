-- Run this in Supabase SQL Editor to fix the resume pdf_url issue
-- https://app.supabase.com/project/_/sql

-- Step 1: Check what's currently in the resume table
SELECT id, pdf_url, updated_at FROM resume;

-- Step 2: Check what's in storage
SELECT name, bucket_id, created_at 
FROM storage.objects 
WHERE bucket_id = 'files' AND name LIKE '%resume%';

-- Step 3: If pdf_url is NULL but file exists in storage, manually set it
-- Replace YOUR_PROJECT_ID with your actual Supabase project ID
UPDATE resume 
SET 
  pdf_url = 'https://coxuudggtdspnlgyumwu.supabase.co/storage/v1/object/public/files/resumes/resume-1778257133598212000.pdf',
  updated_at = NOW()
WHERE id = (SELECT id FROM resume LIMIT 1);

-- Step 4: Verify the update
SELECT id, pdf_url, updated_at FROM resume;

-- Step 5: Make sure RLS policies allow service role to update
DROP POLICY IF EXISTS "Service role full access resume" ON resume;
CREATE POLICY "Service role full access resume"
  ON resume FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 6: Also ensure storage update policy exists
DROP POLICY IF EXISTS "Authenticated update files" ON storage.objects;
CREATE POLICY "Authenticated update files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'files')
  WITH CHECK (bucket_id = 'files');
