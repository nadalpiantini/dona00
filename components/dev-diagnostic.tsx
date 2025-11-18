'use client'

import { useEffect } from 'react'
import { runDiagnostics } from '@/lib/utils/diagnose'

/**
 * Development-only component that exposes diagnostic functions globally
 * Only renders in development mode
 */
export function DevDiagnostic() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Expose diagnostic function globally for console access
    if (typeof window !== 'undefined') {
      ;(window as any).diagnoseSupabase = runDiagnostics
      console.log(
        '%c🔍 Diagnóstico de Supabase disponible',
        'color: #3b82f6; font-weight: bold; font-size: 12px;'
      )
      console.log(
        '%cEjecuta: diagnoseSupabase()',
        'color: #6b7280; font-size: 11px;'
      )
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).diagnoseSupabase
      }
    }
  }, [])

  return null
}

