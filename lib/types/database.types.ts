export type UserRole = 'super_admin' | 'org_admin' | 'org_member' | 'driver' | 'beneficiary' | 'donor'
export type DonationStatus = 'pending' | 'published' | 'claimed' | 'in_transit' | 'delivered' | 'cancelled'
export type DeliveryStatus = 'pending' | 'scheduled' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'failed'
export type CenterStatus = 'active' | 'inactive' | 'full' | 'accepting'

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website?: string
  phone?: string
  email: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: Record<string, unknown>
  subscription_plan?: string
  subscription_expires_at?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: UserRole
  organization_id?: string
  organization?: Organization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences?: Record<string, unknown>
  is_active?: boolean
  is_verified?: boolean
  verified_at?: string
  last_login_at?: string
  created_at?: string
  updated_at?: string
}

export interface Center {
  id: string
  organization_id: string
  organization?: Organization
  name: string
  description?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address: Record<string, unknown>
  coordinates?: { lat: number; lng: number } | null
  phone?: string
  email?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operating_hours?: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  capacity_info?: Record<string, unknown>
  accepted_items?: string[]
  status?: CenterStatus
  manager_id?: string
  manager?: User
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  parent_id?: string
  sort_order?: number
  is_active?: boolean
  created_at?: string
}

export interface Donation {
  id: string
  organization_id: string
  organization?: Organization
  donor_id: string
  donor?: User
  category_id?: string
  category?: Category
  center_id?: string
  center?: Center
  title: string
  description: string
  quantity?: number
  condition?: 'new' | 'like_new' | 'good' | 'fair'
  images?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickup_address?: Record<string, unknown>
  pickup_coordinates?: { lat: number; lng: number } | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availability_schedule?: Record<string, unknown>
  status?: DonationStatus
  beneficiary_id?: string
  beneficiary?: User
  claimed_at?: string
  delivered_at?: string
  is_urgent?: boolean
  is_featured?: boolean
  views_count?: number
  tags?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface Delivery {
  id: string
  organization_id: string
  organization?: Organization
  donation_id: string
  donation?: Donation
  driver_id?: string
  driver?: User
  beneficiary_id: string
  beneficiary?: User
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickup_address: Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delivery_address: Record<string, unknown>
  pickup_coordinates?: { lat: number; lng: number } | null
  delivery_coordinates?: { lat: number; lng: number } | null
  scheduled_pickup_at?: string
  actual_pickup_at?: string
  scheduled_delivery_at?: string
  actual_delivery_at?: string
  status?: DeliveryStatus
  delivery_fee?: number
  payment_status?: string
  payment_method?: string
  tracking_number?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tracking_updates?: Array<Record<string, unknown>>
  driver_notes?: string
  beneficiary_rating?: number
  beneficiary_feedback?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proof_of_delivery?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface Conversation {
  id: string
  organization_id: string
  organization?: Organization
  donation_id?: string
  donation?: Donation
  delivery_id?: string
  delivery?: Delivery
  participants: string[]
  last_message_at?: string
  is_active?: boolean
  created_at?: string
}

export interface Message {
  id: string
  conversation_id: string
  conversation?: Conversation
  sender_id: string
  sender?: User
  content: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments?: Array<Record<string, unknown> | string>
  is_read?: boolean
  read_at?: string
  is_edited?: boolean
  edited_at?: string
  created_at?: string
}

export interface Advertisement {
  id: string
  organization_id?: string
  organization?: Organization
  advertiser_name: string
  title: string
  description?: string
  image_url: string
  target_url?: string
  placement: string
  start_date: string
  end_date: string
  impressions?: number
  clicks?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}