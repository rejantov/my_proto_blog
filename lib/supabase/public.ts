import { createClient } from "@supabase/supabase-js"
import { getSupabaseConfig } from "@/lib/supabase/config"

// Cookie-free client for public portfolio reads.
// Does NOT call cookies() so pages using this client can be
// statically cached by Next.js / Vercel ISR.
// Returns `any` so callers don't need a Database generic — same
// behaviour as the previous server client at the query result level.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPublicClient(): Promise<any> {
  const { url, publishableKey } = getSupabaseConfig()
  return createClient(url, publishableKey)
}
