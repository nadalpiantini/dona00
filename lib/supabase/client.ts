import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton instance for browser client
let browserClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  // Return existing instance if available (singleton pattern)
  if (browserClient) {
    return browserClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    )
  }

  // Create singleton instance with realtime configuration
  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return browserClient
}

// Helper to get singleton without creating (for cleanup scenarios)
export function getClient(): SupabaseClient | null {
  return browserClient
}

// Reset client (useful for testing or forced reconnection)
export function resetClient(): void {
  if (browserClient) {
    // Remove all realtime channels before resetting
    browserClient.removeAllChannels()
  }
  browserClient = null
}
