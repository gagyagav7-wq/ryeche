import { jwtVerify } from 'jose';

export const getJwtSecretKey = () => {
  // Password-nya ngambil dari ENV VPS, jadi aman!
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    // Ini cuma fallback kalau lupa set env, jangan dipake di production
    return new TextEncoder().encode('rahasia-default-jangan-lupa-ganti');
  }
  return new TextEncoder().encode(secret);
};

export async function verifySession(token: string | undefined) {
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload;
  } catch (err) {
    return null;
  }
}
