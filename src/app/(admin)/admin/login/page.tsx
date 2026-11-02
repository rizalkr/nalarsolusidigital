'use client';

import React, { useActionState } from 'react';
import { loginAction, type LoginActionResult } from './actions';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const initialState: LoginActionResult = { ok: true };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-xl shadow-md">
            N
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-primary">
          Admin Nalar Solusi Digital
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Sistem manajemen internal dan operasional CRM leads
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-border rounded-2xl sm:px-10">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div
                role="alert"
                className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-primary mb-1.5"
              >
                Email
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@nalarsolusidigital.my.id"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-primary mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus-visible:outline-brand-accent focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary/90 focus-visible:outline-brand-accent transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                <span>{isPending ? 'Memproses...' : 'Masuk ke Admin'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
