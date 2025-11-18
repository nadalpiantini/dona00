'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Donation, DonationStatus } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export function useDonations(filters?: {
  status?: DonationStatus
  categoryId?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const supabase = createClient()

  const loadDonations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('dona_donations')
        .select(`
          *,
          donor:dona_users!dona_donations_donor_id_fkey(*),
          beneficiary:dona_users!dona_donations_beneficiary_id_fkey(*),
          category:dona_categories(*),
          center:dona_centers(*),
          organization:dona_organizations(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        
      // Apply limit/offset before other filters for proper pagination
      const limit = filters?.limit || 10
      const offset = filters?.offset || 0

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)
      query = query.limit(limit)

      const { data, error: queryError, count } = await query

      if (queryError) throw queryError

      setDonations(data || [])
      setTotal(count || 0)
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error.message)
      toast.error('Error al cargar donaciones')
    } finally {
      setLoading(false)
    }
  }, [filters?.status, filters?.categoryId, filters?.search, filters?.limit, filters?.offset, supabase])

  useEffect(() => {
    loadDonations()
  }, [loadDonations])

  const createDonation = useCallback(async (donation: Partial<Donation>) => {
    try {
      const { data, error: createError } = await supabase
        .from('dona_donations')
        .insert(donation)
        .select(`
          *,
          donor:dona_users!dona_donations_donor_id_fkey(*),
          category:dona_categories(*),
          center:dona_centers(*),
          organization:dona_organizations(*)
        `)
        .single()

      if (createError) throw createError

      toast.success('Donación creada exitosamente')
      await loadDonations()
      return data
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al crear la donación')
      throw err
    }
  }, [supabase, loadDonations])

  const updateDonation = useCallback(async (id: string, updates: Partial<Donation>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('dona_donations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          donor:dona_users!dona_donations_donor_id_fkey(*),
          category:dona_categories(*),
          center:dona_centers(*),
          organization:dona_organizations(*)
        `)
        .single()

      if (updateError) throw updateError

      toast.success('Donación actualizada exitosamente')
      await loadDonations()
      return data
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al actualizar la donación')
      throw err
    }
  }, [supabase, loadDonations])

  const deleteDonation = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('dona_donations')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      toast.success('Donación eliminada exitosamente')
      await loadDonations()
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al eliminar la donación')
      throw err
    }
  }, [supabase, loadDonations])

  return {
    donations,
    loading,
    error,
    total,
    createDonation,
    updateDonation,
    deleteDonation,
    refresh: loadDonations,
  }
}

