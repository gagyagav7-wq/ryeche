import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

export async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Login tahan 7 hari
    .sign(SECRET_KEY);

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  cookies().delete('session');
}
