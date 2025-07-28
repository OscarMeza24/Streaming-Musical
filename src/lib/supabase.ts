// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseKey = 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Note: In production, these would come from environment variables
// and connect to your actual Supabase project





