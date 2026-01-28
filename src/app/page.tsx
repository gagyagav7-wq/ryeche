import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function RootPage() {
  const cookieStore = cookies();
  
  // PATCH 6: Konsisten cek 'token' saja (sesuai middleware)
  const token = cookieStore.get('token'); 

  if (token) {
    redirect('/dashboard');
  } else {
    // PATCH 6: Target redirect disamakan dengan Middleware
    redirect('/dracin/latest');
  }

  return null;
}
