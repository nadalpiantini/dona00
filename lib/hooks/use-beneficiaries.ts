'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export function useBeneficiaries(filters?: {
  search?: string
  verified?: boolean
  organizationId?: string
}) {
  const [beneficiaries, setBeneficiaries] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadBeneficiaries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.search, filters?.verified, filters?.organizationId])

  const loadBeneficiaries = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('dona_users')
        .select(`
          *,
          organization:dona_organizations(*)
        `)
        .eq('role', 'beneficiary')
        .order('created_at', { ascending: false })

      if (filters?.verified !== undefined) {
        query = query.eq('is_verified', filters.verified)
      }

      if (filters?.organizationId) {
        query = query.eq('organization_id', filters.organizationId)
      }

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      setBeneficiaries(data || [])
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error.message)
      toast.error('Error al cargar beneficiarios')
    } finally {
      setLoading(false)
    }
  }

  const createBeneficiary = async (beneficiary: Partial<User>) => {
    try {
      const { data, error: createError } = await supabase
        .from('dona_users')
        .insert({
          ...beneficiary,
          role: 'beneficiary',
        })
        .select(`
          *,
          organization:dona_organizations(*)
        `)
        .single()

      if (createError) throw createError

      toast.success('Beneficiario creado exitosamente')
      await loadBeneficiaries()
      return data
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al crear el beneficiario')
      throw err
    }
  }

  const updateBeneficiary = async (id: string, updates: Partial<User>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('dona_users')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          organization:dona_organizations(*)
        `)
        .single()

      if (updateError) throw updateError

      toast.success('Beneficiario actualizado exitosamente')
      await loadBeneficiaries()
      return data
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      toast.error(error.message || 'Error al actualizar el beneficiario')
      throw err
    }
  }

  const verifyBeneficiary = async (id: string) => {
    return updateBeneficiary(id, {
      is_verified: true,
      verified_at: new Date().toISOString(),
    })
  }

  return {
    beneficiaries,
    loading,
    error,
    createBeneficiary,
    updateBeneficiary,
    verifyBeneficiary,
    refresh: loadBeneficiaries,
  }
}

