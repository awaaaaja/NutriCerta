import { NextRequest, NextResponse } from 'next/server'

const ACCESS_KEY = 'bK4FMVdZsWvyL3b4Hnhmxyq7K4aw3gCocwRB91evD70'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'nutrition hospital'
  const count = Math.min(Number(searchParams.get('count')) || 1, 6)

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    )
    if (!res.ok) {
      if (res.status === 403) return NextResponse.json([{ urls: { regular: '/fallback-hero.jpg' }, alt_description: null, user: { name: 'Unsplash' }, links: { html: '#' } }])
      throw new Error(`Unsplash: ${res.status}`)
    }
    const data = await res.json()
    const items = Array.isArray(data) ? data : [data]
    return NextResponse.json(items.map((i: any) => ({
      url: i.urls?.regular || i.urls?.raw,
      thumb: i.urls?.thumb,
      alt: i.alt_description || query,
      credit: i.user?.name || 'Unsplash',
      link: i.links?.html || '#',
    })))
  } catch {
    return NextResponse.json([{ url: '/fallback-hero.jpg', alt: query, credit: 'Unsplash', link: '#' }])
  }
}
