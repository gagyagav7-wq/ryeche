import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

// Pastikan SECRET ini sama persis dengan yang ada di .env dan Middleware!
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 1. VALIDASI USERNAME & PASSWORD
    // (Ganti logika ini dengan cek Database lu yang sebenernya)
    // Contoh sederhana: Asal password bukan kosong, dianggap sukses.
    if (username !== "doombee11" || password !== "admin123") {
         // ^ GANTI DENGAN LOGIC CEK DB LU SENDIRI
         // return NextResponse.json({ error: "Password salah!" }, { status: 401 });
    }

    // Fail-safe kalau lupa set ENV
    if (!JWT_SECRET) {
      console.error("JWT_SECRET belum diset di .env!");
      return NextResponse.json({ error: "Server Error: Config Missing" }, { status: 500 });
    }

    // 2. BIKIN TOKEN JWT
    // Kita pakai 'jose' biar sinkron sama Middleware
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ 
        username: username, 
        role: "admin" // Bisa tambah data lain
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token berlaku 7 hari
      .sign(secretKey);

    // 3. SET COOKIE (INI BAGIAN PALING KRUSIAL!)
    // Tanpa konfigurasi ini, Middleware di root '/' gak bakal bisa baca cookie.
    cookies().set("token", token, {
      httpOnly: true, // Gak bisa dibaca JS client (Aman dari XSS)
      secure: process.env.NODE_ENV === "production", // Wajib HTTPS kalau production
      sameSite: "lax", // Aman buat redirect antar halaman
      path: "/", // <--- WAJIB: Biar cookie kebaca di halaman Root ('/')
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    // 4. Response Sukses
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
