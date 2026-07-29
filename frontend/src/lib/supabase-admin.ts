export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!
}

export function getSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
}

export function supabaseFetch(path: string, options?: RequestInit) {
  const url = `${getSupabaseUrl()}/rest/v1/${path}`
  return fetch(url, {
    headers: {
      apikey: getSupabaseKey(),
      Authorization: `Bearer ${getSupabaseKey()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    },
    ...options,
  })
}
