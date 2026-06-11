-- Migration Script: Add Subjects Hierarchy
-- Please run this script in your Supabase SQL Editor.

-- 1. Create the new subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    storage_path TEXT,
    content_type VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'video', 'text'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the user_subject_progress table to track which specific subjects the user has finished
CREATE TABLE IF NOT EXISTS public.user_subject_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Belum Selesai', -- 'Belum Selesai', 'Selesai'
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, subject_id) -- Ensure a user only has one progress record per subject
);

-- 3. Enable RLS (Row Level Security) on the new tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subject_progress ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for subjects (Everyone can read, only Admins/Mentors can write)
CREATE POLICY "Subjects are viewable by everyone" ON public.subjects
    FOR SELECT USING (true);

-- Note: You may need to add INSERT/UPDATE/DELETE policies for Admins based on your existing setup.
-- Example assuming role is checked via profiles or JWT metadata:
-- CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('Administrator', 'Mentor')));

-- 5. Create RLS Policies for user_subject_progress
CREATE POLICY "Users can view their own subject progress" ON public.user_subject_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subject progress" ON public.user_subject_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subject progress" ON public.user_subject_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. MIGRATION OF EXISTING DATA (Optional but highly recommended)
-- This creates a single default subject for every existing module that has a storage_path, 
-- ensuring you don't lose access to your current PDFs.
INSERT INTO public.subjects (module_id, title, description, storage_path, content_type, order_index)
SELECT 
    id, 
    'Materi Utama', 
    'Materi dasar untuk modul ini.', 
    storage_path, 
    'pdf', 
    1
FROM public.modules
WHERE storage_path IS NOT NULL AND storage_path != 'pending-upload-storage'
ON CONFLICT DO NOTHING;
