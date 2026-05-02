export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'College Counselor',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  nodeEnv: import.meta.env.MODE,
};

export function assertRequiredEnv() {
  const missing = [];
  if (!env.supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!env.supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  return missing;
}
