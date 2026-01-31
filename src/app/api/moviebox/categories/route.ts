import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // ambil daftar kategori unik
  const rows = await prisma.movie_categories.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  const categories = rows
    .map(r => r.category)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return NextResponse.json({ categories });
}
