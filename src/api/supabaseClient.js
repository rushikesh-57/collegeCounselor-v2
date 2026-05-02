import { createClient } from '@supabase/supabase-js';
import { env } from '../shared/config/env';
import { captureApiMetric } from '../shared/lib/monitoring';

const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

async function parseFunctionError(error, functionName) {
  if (!error) return `Function ${functionName} failed`;
  let message = error.message || `Function ${functionName} failed`;

  const context = error.context;
  if (context) {
    try {
      const payload = await context.json();
      if (payload?.error) message = payload.error;
      else if (payload?.message) message = payload.message;
    } catch {
      try {
        const text = await context.text();
        if (text) {
          try {
            const payload = JSON.parse(text);
            message = payload?.error || payload?.message || text;
          } catch {
            message = text;
          }
        }
      } catch {
        // keep fallback message
      }
    }
  }

  return message;
}

export async function invokeFunction(name, body = undefined) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Copy .env.example to .env and set project values.');
  }

  const startedAt = performance.now();

  const { data, error } = await supabase.functions.invoke(name, { body });
  const durationMs = Math.round(performance.now() - startedAt);

  if (error) {
    captureApiMetric({ endpoint: name, durationMs, success: false });
    const message = await parseFunctionError(error, name);
    throw new Error(message);
  }

  captureApiMetric({ endpoint: name, durationMs, success: true });
  return data;
}
