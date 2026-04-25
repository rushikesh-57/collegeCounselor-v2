import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { requireJsonObject } from '../_shared/validation.ts';

async function embed(message: string): Promise<number[]> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  const embeddingUrl = Deno.env.get('EMBEDDING_API_URL');
  if (!apiKey || !embeddingUrl) {
    throw new Error('OPENROUTER_API_KEY and EMBEDDING_API_URL are required for chatbot embeddings');
  }
  const response = await fetch(embeddingUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: message, model: Deno.env.get('EMBEDDING_MODEL') ?? 'nomic-embed-text' }),
  });
  if (!response.ok) throw new Error('Embedding service failed');
  const data = await response.json();
  return data.data?.[0]?.embedding ?? data.embedding;
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const body = requireJsonObject(await request.json());
    const message = String(body.message ?? '').trim();
    if (!message) return jsonResponse({ response: 'Please enter a question.' });

    const supabase = serviceClient();
    const queryEmbedding = await embed(message);
    const { data: chunks, error } = await supabase.rpc('match_rag_chunks', {
      query_embedding: queryEmbedding,
      match_count: 3,
    });
    if (error) throw error;

    const context = (chunks ?? []).map((chunk) => chunk.content).join('\n\n');
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is required');

    const llm = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: Deno.env.get('CHAT_MODEL') ?? 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: `You are a Maharashtra engineering college counselling assistant. Use this context when relevant:\n\n${context}` },
          { role: 'user', content: message },
        ],
      }),
    });
    if (!llm.ok) throw new Error('AI service failed');
    const data = await llm.json();
    return jsonResponse({ response: data.choices?.[0]?.message?.content ?? 'No response was generated.' });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});
