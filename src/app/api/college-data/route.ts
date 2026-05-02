import { NextRequest, NextResponse } from 'next/server';
import { invokeSupabaseFunction } from '@/lib/supabase-functions';
import { withApiProtection } from '@/lib/api/server/with-api-protection';

export const POST = withApiProtection(async (_request: NextRequest) => {
  const payload = await invokeSupabaseFunction('college-data');
  return NextResponse.json(payload);
});
