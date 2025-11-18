'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useBeneficiaries } from '@/lib/hooks/use-beneficiaries'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar,
  Edit2, Shield, CheckCircle, Clock, AlertCircle, Loader2
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import { User as UserType } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export default function BeneficiaryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const beneficiaryId = params.id as string
  const { verifyBeneficiary } = useBeneficiaries()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [beneficiary, setBeneficiary] = useState<UserType | null>(null)

  useEffect(() => {
    const loadBeneficiary = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('dona_users')
          .select(`
            *,
            organization:dona_organizations(*)
          `)
          .eq('id', beneficiaryId)
          .eq('role', 'beneficiary')
          .single()

        if (error) throw error
        if (!data) throw new Error('Beneficiario no encontrado')

        setBeneficiary(data)
      } catch (err: any) {
        toast.error(err.message || 'Error al cargar el beneficiario')
        router.push('/dashboard/beneficiaries')
      } finally {
        setLoading(false)
      }
    }

    if (beneficiaryId) {
      loadBeneficiary()
    }
  }, [beneficiaryId, supabase, router])

  const handleVerify = async () => {
    try {
      await verifyBeneficiary(beneficiaryId)
      if (beneficiary) {
        setBeneficiary({ ...beneficiary, is_verified: true, verified_at: new Date().toISOString() })
      }
    } catch {
      // Error handled in hook
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!beneficiary) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Beneficiario no encontrado</h3>
            <p className="text-gray-500 mb-4">El beneficiario que buscas no existe o fue eliminado.</p>
            <Link
              href="/dashboard/beneficiaries"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a beneficiarios
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const organization = beneficiary.organization && typeof beneficiary.organization === 'object' && 'name' in beneficiary.organization
    ? beneficiary.organization
    : null
  const address = typeof beneficiary.address === 'object' && beneficiary.address
    ? beneficiary.address
    : null

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/beneficiaries"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a beneficiarios
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{beneficiary.full_name}</h1>
              <div className="mt-2 flex items-center space-x-4">
                {beneficiary.is_verified ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-4 w-4 mr-1" />
                    Pendiente de Verificación
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/dashboard/beneficiaries/${beneficiary.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Link>
              {!beneficiary.is_verified && (
                <button
                  onClick={handleVerify}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Verificar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h2>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                    <User className="h-4 w-4 mr-2" />
                    Nombre Completo
                  </dt>
                  <dd className="text-sm text-gray-900">{beneficiary.full_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Correo Electrónico
                  </dt>
                  <dd className="text-sm text-gray-900">{beneficiary.email}</dd>
                </div>
                {beneficiary.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Teléfono
                    </dt>
                    <dd className="text-sm text-gray-900">{beneficiary.phone}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Address */}
            {address && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Dirección</h2>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    {address.street && <p>{address.street}</p>}
                    <p>
                      {address.city}
                      {address.province && `, ${address.province}`}
                      {address.postal_code && ` ${address.postal_code}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Organization */}
            {organization && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Organización</h2>
                <p className="text-sm text-gray-900">{organization.name}</p>
                {organization.description && (
                  <p className="text-sm text-gray-500 mt-2">{organization.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de la Cuenta</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {beneficiary.is_active !== false ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Verificación</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {beneficiary.is_verified ? 'Verificado' : 'No Verificado'}
                  </p>
                </div>
                {beneficiary.verified_at && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Verificado el</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(beneficiary.verified_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Historial
              </h3>
              <div className="space-y-3">
                {beneficiary.created_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Registrado</p>
                      <p className="text-xs text-gray-500">{formatDate(beneficiary.created_at)}</p>
                    </div>
                  </div>
                )}
                {beneficiary.last_login_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Último Acceso</p>
                      <p className="text-xs text-gray-500">{formatDate(beneficiary.last_login_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

