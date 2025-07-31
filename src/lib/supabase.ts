// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Note: In production, these would come from environment variables
// and connect to your actual Supabase project
