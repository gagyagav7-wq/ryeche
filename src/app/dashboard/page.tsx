import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  // Double check: Pastikan cookie ada sebelum render layout dashboard
  if (!session) {
    redirect('/login');
  }

  return (
    <section>
      {/* Layout dashboard kamu yang sudah ada */}
      {children}
    </section>
  );
}
