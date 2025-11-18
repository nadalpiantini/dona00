'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Center, CenterStatus } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export function useCenters(filters?: {
  status?: CenterStatus
  search?: string
  organizationId?: string
}) {
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadCenters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.search, filters?.organizationId])

  const loadCenters = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('dona_centers')
        .select(`
          *,
          organization:dona_organizations(*),
          manager:dona_users!dona_centers_manager_id_fkey(*)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.organizationId) {
        query = query.eq('organization_id', filters.organizationId)
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setCenters(data || [])
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error.message)
      toast.error('Error al cargar centros de acopio')
    } finally {
      setLoading(false)
    }
  }

  const createCenter = async (center: Partial<Center>) => {
    try {
      const { data, error: createError } = await supabase
        .from('dona_centers')
        .insert(center)
        .select(`
          *,
          organization:dona_organizations(*),
          manager:dona_users!dona_centers_manager_id_fkey(*)
        `)
        .single()

      if (createError) throw createError

      toast.success('Centro de acopio creado exitosamente')
      await loadCenters()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al crear el centro de acopio')
      throw err
    }
  }

  const updateCenter = async (id: string, updates: Partial<Center>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('dona_centers')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          organization:dona_organizations(*),
          manager:dona_users!dona_centers_manager_id_fkey(*)
        `)
        .single()

      if (updateError) throw updateError

      toast.success('Centro de acopio actualizado exitosamente')
      await loadCenters()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al actualizar el centro de acopio')
      throw err
    }
  }

  const deleteCenter = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('dona_centers')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      toast.success('Centro de acopio eliminado exitosamente')
      await loadCenters()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al eliminar el centro de acopio')
      throw err
    }
  }

  return {
    centers,
    loading,
    error,
    createCenter,
    updateCenter,
    deleteCenter,
    refresh: loadCenters,
  }
}

