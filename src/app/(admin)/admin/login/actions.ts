'use server';

import { createClient } from '@/lib/admin/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface LoginActionResult {
  ok: boolean;
  error?: string;
}

export async function loginAction(
  _prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { ok: false, error: 'Email dan password wajib diisi.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { ok: false, error: 'Email atau kata sandi tidak sesuai.' };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kendala saat login.';
    return { ok: false, error: message };
  }

  revalidatePath('/admin', 'layout');
  redirect('/admin');
}

export async function logoutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error on sign out
  }

  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}

