import { Database } from './database.types'

// Helper types for Supabase relations
export type DonationWithRelations = Database['public']['Tables']['dona_donations']['Row'] & {
  donor?: Database['public']['Tables']['dona_users']['Row'] | null
  beneficiary?: Database['public']['Tables']['dona_users']['Row'] | null
  category?: Database['public']['Tables']['dona_categories']['Row'] | null
  center?: Database['public']['Tables']['dona_centers']['Row'] | null
  organization?: Database['public']['Tables']['dona_organizations']['Row'] | null
}

export type CenterWithRelations = Database['public']['Tables']['dona_centers']['Row'] & {
  organization?: Database['public']['Tables']['dona_organizations']['Row'] | null
  manager?: Database['public']['Tables']['dona_users']['Row'] | null
}

export type DeliveryWithRelations = Database['public']['Tables']['dona_deliveries']['Row'] & {
  donation?: Database['public']['Tables']['dona_donations']['Row'] | null
  driver?: Database['public']['Tables']['dona_users']['Row'] | null
  beneficiary?: Database['public']['Tables']['dona_users']['Row'] | null
  organization?: Database['public']['Tables']['dona_organizations']['Row'] | null
}

export type UserWithRelations = Database['public']['Tables']['dona_users']['Row'] & {
  organization?: Database['public']['Tables']['dona_organizations']['Row'] | null
}

