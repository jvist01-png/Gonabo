import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const base =
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gonabo.vercel.app';
    const redirectTo = `${base.replace(/\/$/, '')}/onboarding`;

    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
