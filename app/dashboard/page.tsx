'use client';
import { useRouter } from 'next/navigation';
import BrutButton from '@/components/BrutButton';
import BrutCard from '@/components/BrutCard';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <main className="min-h-[100dvh] p-6 bg-bg pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-black uppercase">Dashboard</h1>
          <BrutButton onClick={handleLogout} variant="danger" className="text-sm py-2 px-4">Log Out</BrutButton>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <BrutCard title="Saldo"><h2 className="text-4xl font-black">$0.00</h2></BrutCard>
          <BrutCard title="Status" className="bg-accent-2"><p className="font-bold">Akun Aktif ✅</p></BrutCard>
        </div>
      </div>
    </main>
  );
}
