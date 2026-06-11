-- Migration to allow Administrators to update any profile
-- Run this in Supabase SQL Editor

-- Drop the policy if it already exists to avoid errors
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create the policy to allow UPDATE operations for Admins
CREATE POLICY "Admins can update all profiles" 
ON public.profiles
FOR UPDATE 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Administrator'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Administrator'
);
