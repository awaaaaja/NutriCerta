const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

export function getSupabaseKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
}

export function supabaseFetch(urlPath: string, options?: RequestInit): Promise<Response> {
  const key = getSupabaseKey()
  const url = `${supabaseUrl}/rest/v1/${urlPath}`
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  return fetch(url, { ...options, headers })
}
