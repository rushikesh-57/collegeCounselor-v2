export type CollegeRow = Record<string, string | number | null>;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

function functionUrl(name: string) {
  if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL');
  return `${supabaseUrl}/functions/v1/${name}`;
}

async function invoke(name: string, body?: unknown) {
  if (!supabaseAnonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY');

  const response = await fetch(functionUrl(name), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(body ?? {}),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Function ${name} failed with ${response.status}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
}

export async function getCollegeData(): Promise<CollegeRow[]> {
  return invoke('college-data');
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
