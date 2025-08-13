'use client';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

// v0.10.x expects no arguments
export const supabase = createPagesBrowserClient();
