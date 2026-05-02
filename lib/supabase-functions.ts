const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

function functionUrl(name: string) {
  if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL');
  return `${supabaseUrl}/functions/v1/${name}`;
}

export async function invokeSupabaseFunction(name: string, body: unknown = {}, accessToken?: string) {
  if (!supabaseAnonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY');

  const response = await fetch(functionUrl(name), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || `Function ${name} failed`);
  }

  return payload;
}
