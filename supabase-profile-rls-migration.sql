-- Migration to allow users to update their own profile
-- Run this in Supabase SQL Editor

-- Drop the policy if it already exists to avoid errors
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create the policy to allow UPDATE operations for the row owner
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
