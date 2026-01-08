'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Delivery, DeliveryStatus } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export function useDeliveries(filters?: {
  status?: DeliveryStatus
  search?: string
  driverId?: string
  beneficiaryId?: string
}) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Use singleton client - memoized to prevent recreation on re-renders
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    loadDeliveries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.search, filters?.driverId, filters?.beneficiaryId])

  const loadDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)

      // In development, check if we have a real session
      if (process.env.NODE_ENV === 'development') {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          // Mock user without real session - return empty data silently
          setDeliveries([])
          setLoading(false)
          return
        }
      }

      let query = supabase
        .from('dona_deliveries')
        .select(`
          *,
          donation:dona_donations(*),
          driver:dona_users!dona_deliveries_driver_id_fkey(*),
          beneficiary:dona_users!dona_deliveries_beneficiary_id_fkey(*),
          organization:dona_organizations(*)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.driverId) {
        query = query.eq('driver_id', filters.driverId)
      }

      if (filters?.beneficiaryId) {
        query = query.eq('beneficiary_id', filters.beneficiaryId)
      }

      if (filters?.search) {
        query = query.or(`tracking_number.ilike.%${filters.search}%`)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setDeliveries(data || [])
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error.message)
      // Only show toast in production or if it's not a session error
      if (process.env.NODE_ENV === 'production' || !error.message?.toLowerCase().includes('session')) {
        toast.error('Error al cargar entregas')
      }
      setDeliveries([])
    } finally {
      setLoading(false)
    }
  }

  const createDelivery = async (delivery: Partial<Delivery>) => {
    try {
      // Generate tracking number
      const trackingNumber = `DN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

      const { data, error: createError } = await supabase
        .from('dona_deliveries')
        .insert({
          ...delivery,
          tracking_number: trackingNumber,
        })
        .select(`
          *,
          donation:dona_donations(*),
          driver:dona_users!dona_deliveries_driver_id_fkey(*),
          beneficiary:dona_users!dona_deliveries_beneficiary_id_fkey(*),
          organization:dona_organizations(*)
        `)
        .single()

      if (createError) throw createError

      toast.success('Entrega creada exitosamente')
      await loadDeliveries()
      return data
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al crear la entrega')
      throw err
    }
  }

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('dona_deliveries')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          donation:dona_donations(*),
          driver:dona_users!dona_deliveries_driver_id_fkey(*),
          beneficiary:dona_users!dona_deliveries_beneficiary_id_fkey(*),
          organization:dona_organizations(*)
        `)
        .single()

      if (updateError) throw updateError

      toast.success('Entrega actualizada exitosamente')
      await loadDeliveries()
      return data
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al actualizar la entrega')
      throw err
    }
  }

  const updateDeliveryStatus = async (id: string, status: DeliveryStatus, updates?: Partial<Delivery>) => {
    return updateDelivery(id, { status, ...updates })
  }

  return {
    deliveries,
    loading,
    error,
    createDelivery,
    updateDelivery,
    updateDeliveryStatus,
    refresh: loadDeliveries,
  }
}

