import { NextRequest, NextResponse } from 'next/server';
import { invokeSupabaseFunction } from '@/lib/supabase-functions';
import { withApiProtection } from '@/lib/api/server/with-api-protection';

export const POST = withApiProtection(async (request: NextRequest) => {
  const body = await request.json();
  const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '').trim();
  const payload = await invokeSupabaseFunction('recommend-colleges', body, accessToken || undefined);
  return NextResponse.json(payload);
});
