import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  const cookieStore = cookies();
  
  // Cek dua-duanya juga biar sinkron sama middleware
  const session = cookieStore.get('session') || cookieStore.get('token');

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/dracin');
  }

  return null;
}
