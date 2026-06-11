-- Migration to add score to user_progress
-- Run this in Supabase SQL Editor

ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;

-- You can optionally backfill scores if needed, but 0 is a safe default.
