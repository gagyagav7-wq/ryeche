'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrutButton from '@/components/BrutButton';
import BrutCard from '@/components/BrutCard';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    if (mode === 'REGISTER' && form.password !== form.confirmPassword) {
      setError('Password beda bro!'); setLoading(false); return;
    }

    const res = await fetch(mode === 'LOGIN' ? '/api/auth/login' : '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Error');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-4 bg-bg pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Papoyo</h1>
          <p className="font-bold bg-surface border-brut border-main inline-block px-3 py-1 shadow-brut-sm -rotate-2">
            {mode === 'LOGIN' ? 'Welcome Back!' : 'Join the Club'}
          </p>
        </div>

        <BrutCard className="w-full bg-surface" noPadding>
          <div className="flex border-b-brut border-main">
            {['LOGIN', 'REGISTER'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`flex-1 py-4 font-black text-lg uppercase ${mode === m ? 'bg-accent text-main' : 'bg-surface text-main/50'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-danger text-white p-3 font-bold border-brut border-main shadow-brut-sm">{error}</div>}
              
              <input 
                placeholder="Username" 
                className="w-full bg-bg border-brut border-main p-3 font-bold focus:shadow-brut outline-none"
                onChange={(e) => setForm({...form, username: e.target.value})}
              />
              <input 
                type="password" placeholder="Password" 
                className="w-full bg-bg border-brut border-main p-3 font-bold focus:shadow-brut outline-none"
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
              {mode === 'REGISTER' && (
                <input 
                  type="password" placeholder="Confirm Password" 
                  className="w-full bg-bg border-brut border-main p-3 font-bold focus:shadow-brut outline-none"
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                />
              )}

              <BrutButton type="submit" fullWidth disabled={loading} variant={mode === 'LOGIN' ? 'primary' : 'danger'}>
                {loading ? 'Sabar...' : (mode === 'LOGIN' ? 'GAS MASUK' : 'DAFTAR')}
              </BrutButton>
            </form>
          </div>
        </BrutCard>
      </div>
    </main>
  );
}
