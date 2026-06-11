-- Migration Script: Add Curriculum (Learning Paths) Hierarchy
-- Please run this script in your Supabase SQL Editor.

-- 1. Create the new learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT '🔰', -- Emoji or icon class
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add path_id column to modules table
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE;

-- 3. Enable RLS on learning_paths
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for learning_paths
CREATE POLICY "Learning paths are viewable by everyone" ON public.learning_paths
    FOR SELECT USING (true);

-- CREATE POLICY "Admins can insert learning paths" ON public.learning_paths FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('Administrator', 'Mentor')));

-- 5. MIGRATION OF EXISTING DATA
-- Step A: Insert a default "Kurikulum PKI" record
INSERT INTO public.learning_paths (id, title, description, icon)
VALUES (
    '11111111-1111-1111-1111-111111111111', -- Explicit UUID for easy reference
    'Infrastruktur Kunci Publik', 
    'Kurikulum ini dirancang khusus untuk standardisasi pemahaman operasional keamanan informasi di Balai Besar Sertifikasi Elektronik (BSrE).', 
    '🔐'
)
ON CONFLICT (id) DO NOTHING;

-- Step B: Update all existing modules to point to this default curriculum
UPDATE public.modules 
SET path_id = '11111111-1111-1111-1111-111111111111'
WHERE path_id IS NULL;

-- Step C: Make path_id NOT NULL after migration is complete
ALTER TABLE public.modules ALTER COLUMN path_id SET NOT NULL;
