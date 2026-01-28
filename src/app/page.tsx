// src/app/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  const cookieStore = cookies();
  const session = cookieStore.get('session'); // Cek cookie 'session'

  if (session) {
    // Ada sesi -> Lempar ke Dashboard
    redirect('/dashboard');
  } else {
    // Tidak ada sesi -> Lempar ke Public Landing (/dracin)
    redirect('/dracin');
  }

  // Return null karena halaman ini cuma perantara, gak nampilin apa-apa
  return null;
}
