import { NextRequest, NextResponse } from 'next/server';
import { invokeSupabaseFunction } from '@/lib/supabase-functions';
import { withApiProtection } from '@/lib/api/server/with-api-protection';

export const POST = withApiProtection(async (request: NextRequest) => {
  const body = await request.json();
  const payload = await invokeSupabaseFunction('export-excel', body);
  return NextResponse.json(payload);
});
