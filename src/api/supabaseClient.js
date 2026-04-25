import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function invokeFunction(name, body = undefined) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Copy .env.example to .env and set project values.');
  }

  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    throw new Error(error.message || `Function ${name} failed`);
  }
  return data;
}
