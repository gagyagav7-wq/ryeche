import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // penting biar gak ke-cache jadi static

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const tab = (searchParams.get("tab") || "latest").toLowerCase();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(12, Number(searchParams.get("limit") || 36)));

  const skip = (page - 1) * limit;

  // urutan sesuai tab (lu bisa ubah sesuai selera)
  const orderBy =
    tab === "hot"
      ? [{ scraped_at: "desc" as const }]
      : tab === "foryou"
      ? [{ scraped_at: "desc" as const }]
      : [{ scraped_at: "desc" as const }];

  const where: any = { status: "OK" }; // kalau status lu pake "OK"

  const [items, total] = await Promise.all([
    prisma.movies.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        url: true,
        title: true,
        poster: true,
        synopsis: true,
        iframe_link: true,
        stream_link: true,
        scraped_at: true,
        status: true,
      },
    }),
    prisma.movies.count({ where }),
  ]);

  return NextResponse.json({
    tab,
    page,
    limit,
    total,
    items,
    hasMore: skip + items.length < total,
  });
}
