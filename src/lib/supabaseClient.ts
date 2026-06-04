import { createClient } from '@supabase/supabase-js'

// Variabel ini harus diletakkan di file .env nantinya untuk keamanan
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)