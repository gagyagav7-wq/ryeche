import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    // --- MOCK FILTERS ---
    // Pastikan value ID-nya huruf kecil semua biar cocok sama logic filter di atas
    
    const genres = [
      { id: "action", label: "Action", value: "action" },
      { id: "drama", label: "Drama", value: "drama" },
      { id: "horror", label: "Horror", value: "horror" },
      { id: "comedy", label: "Comedy", value: "comedy" },
      { id: "romance", label: "Romance", value: "romance" },
      { id: "scifi", label: "Sci-Fi", value: "scifi" },
      { id: "history", label: "History", value: "history" },
    ];

    const years = [
      { id: "2024", label: "2024", value: "2024" },
      { id: "2023", label: "2023", value: "2023" },
      { id: "2022", label: "2022", value: "2022" },
      { id: "2021", label: "2021", value: "2021" },
    ];

    return NextResponse.json({
      genres,
      years,
      types: [
        { id: "movie", label: "Movies", value: "movie" },
        { id: "series", label: "Series", value: "series" }
      ]
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to load filters" }, { status: 500 });
  }
}
