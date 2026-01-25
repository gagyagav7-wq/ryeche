import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: 'Akun gak ketemu' }, { status: 401 });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Password salah' }, { status: 401 });

    const token = await createSession({ userId: user.id, username: user.username });
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Gagal login' }, { status: 500 });
  }
}
