import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // --- 1. VALIDASI MANUAL (GANTI SESUAI DATABASE LU) ---
    // Sementara kita hardcode buat testing biar lu bisa masuk dashboard
    if (username !== "doombee11" || password !== "admin123") {
         return NextResponse.json({ error: "Username/Password Salah!" }, { status: 401 });
    }
    // -----------------------------------------------------

    if (!JWT_SECRET) {
      console.error("JWT_SECRET missing in .env");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // 2. GENERATE TOKEN
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ username, role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") 
      .sign(secretKey);

    // 3. SET COOKIE (KRITIK POIN 5 - FIXED)
    // Kita set path: '/' supaya middleware di root bisa baca.
    // Secure: true karena lu pake TryCloudflare (HTTPS).
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // True di VPS/Cloudflare
      sameSite: "lax", // 'lax' cukup dan aman buat navigasi normal
      path: "/",       // <--- INI KUNCINYA. JANGAN DIHAPUS.
      maxAge: 60 * 60 * 24 * 7, // 7 Hari
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Login API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
