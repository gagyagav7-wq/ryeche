import { NextResponse } from "next/server";

export async function POST() {
  // Bikin response sukses
  const response = NextResponse.json({ message: "Logout success" });
  
  // PERINTAH HAPUS COOKIE 'token'
  // Ini kuncinya! Kita set cookie jadi kosong dan expired sekarang juga.
  response.cookies.delete("token");
  
  return response;
}
