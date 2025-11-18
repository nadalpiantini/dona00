'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'

export function useStats() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    publishedDonations: 0,
    claimedDonations: 0,
    deliveredDonations: 0,
    totalCenters: 0,
    activeCenters: 0,
    totalDeliveries: 0,
    inTransitDeliveries: 0,
    totalBeneficiaries: 0,
    verifiedBeneficiaries: 0,
  })
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()
  const supabase = createClient()

  const loadStats = useCallback(async () => {
    try {
      setLoading(true)

      const organizationFilter = profile?.organization_id
        ? { organization_id: profile.organization_id }
        : {}

      // Donations stats
      const [donationsRes, publishedRes, claimedRes, deliveredRes] = await Promise.all([
        supabase.from('dona_donations').select('id', { count: 'exact', head: true }).match(organizationFilter),
        supabase.from('dona_donations').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, status: 'published' }),
        supabase.from('dona_donations').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, status: 'claimed' }),
        supabase.from('dona_donations').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, status: 'delivered' }),
      ])

      // Centers stats
      const [centersRes, activeCentersRes] = await Promise.all([
        supabase.from('dona_centers').select('id', { count: 'exact', head: true }).match(organizationFilter),
        supabase.from('dona_centers').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, status: 'active' }),
      ])

      // Deliveries stats
      const [deliveriesRes, inTransitRes] = await Promise.all([
        supabase.from('dona_deliveries').select('id', { count: 'exact', head: true }).match(organizationFilter),
        supabase.from('dona_deliveries').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, status: 'in_transit' }),
      ])

      // Beneficiaries stats
      const [beneficiariesRes, verifiedRes] = await Promise.all([
        supabase.from('dona_users').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, role: 'beneficiary' }),
        supabase.from('dona_users').select('id', { count: 'exact', head: true }).match({ ...organizationFilter, role: 'beneficiary', is_verified: true }),
      ])

      setStats({
        totalDonations: donationsRes.count || 0,
        publishedDonations: publishedRes.count || 0,
        claimedDonations: claimedRes.count || 0,
        deliveredDonations: deliveredRes.count || 0,
        totalCenters: centersRes.count || 0,
        activeCenters: activeCentersRes.count || 0,
        totalDeliveries: deliveriesRes.count || 0,
        inTransitDeliveries: inTransitRes.count || 0,
        totalBeneficiaries: beneficiariesRes.count || 0,
        verifiedBeneficiaries: verifiedRes.count || 0,
      })
    } catch (err) {
      // Error logging - keep for debugging but don't expose to user
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading stats:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [profile?.organization_id, supabase])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    loading,
    refresh: loadStats,
  }
}

