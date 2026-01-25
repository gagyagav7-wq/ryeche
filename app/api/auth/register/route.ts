import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || password.length < 6) {
      return NextResponse.json({ error: 'Min 6 karakter password bro!' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Username udah dipake orang lain!' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

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
    return NextResponse.json({ error: 'Server lagi pusing' }, { status: 500 });
  }
}
