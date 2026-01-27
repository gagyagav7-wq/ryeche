import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    // Kita fetch video dari server, menyamar sebagai browser polos
    const response = await fetch(url, {
      headers: {
        // PENTING: Pura-pura jadi browser tapi tanpa referer yang mencurigakan
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://farsunpteltd.com/", // Tembak referer ke dirinya sendiri biar dikira internal
        "Origin": "https://farsunpteltd.com/"
      },
    });

    if (!response.ok) {
      console.error(`Proxy Error: ${response.status} ${response.statusText}`);
      return new NextResponse(`Upstream Error: ${response.status}`, { status: response.status });
    }

    // Streaming data video langsung ke user
    // Kita copy headers penting kayak Content-Type (video/mp4)
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*"); // Biar player frontend seneng

    return new NextResponse(response.body, {
      status: 200,
      headers: newHeaders,
    });

  } catch (error) {
    console.error("Proxy Failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
