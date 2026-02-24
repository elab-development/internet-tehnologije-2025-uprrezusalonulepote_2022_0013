import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing UNSPLASH_ACCESS_KEY" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "hair salon";
    const perPage = Number(searchParams.get("perPage") || "8");

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${key}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Unsplash API request failed" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const photos = (data.results || []).map((p: any) => ({
      id: p.id,
      alt: p.alt_description || p.description || "Unsplash photo",
      url: p.urls?.regular,
      thumb: p.urls?.thumb,
      author: p.user?.name,
      link: p.links?.html,
    }));

    return NextResponse.json({ query, photos });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}