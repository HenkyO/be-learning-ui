require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function applySoftDeleteMigration() {
  console.log('Starting soft delete migration...');
  
  // Try using RPC if a generic query executor exists, otherwise we'll instruct the user.
  // Since we can't reliably execute arbitrary DDL via the standard supabase-js client
  // without a specific RPC function setup for it, we will print the SQL needed.
  console.log(`
=====================================================================
⚠️ ACTION REQUIRED: DATABASE MIGRATION ⚠️
=====================================================================
Please run the following SQL commands in your Supabase SQL Editor
to enable soft-deletion and prevent the destruction of historical
user progress records.

-- 1. Add is_deleted flag to modules
ALTER TABLE public.modules ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- 2. Modify foreign key constraint on progress to avoid cascade delete
-- First, find the name of the existing constraint (often progress_module_id_fkey)
ALTER TABLE public.progress DROP CONSTRAINT IF EXISTS progress_module_id_fkey;

-- Then add it back with ON DELETE SET NULL
ALTER TABLE public.progress
  ADD CONSTRAINT progress_module_id_fkey
  FOREIGN KEY (module_id)
  REFERENCES public.modules(id)
  ON DELETE SET NULL;
  
-- 3. Modify foreign key constraint on questions
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_module_id_fkey;

ALTER TABLE public.questions
  ADD CONSTRAINT questions_module_id_fkey
  FOREIGN KEY (module_id)
  REFERENCES public.modules(id)
  ON DELETE CASCADE; -- Questions can cascade delete if we choose to hard delete later, but usually soft delete is enough.
=====================================================================
  `);
}

applySoftDeleteMigration();
