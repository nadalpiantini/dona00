'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, MapPin, Phone, Mail, Clock, Package, Users,
  Edit2, Trash2, CheckCircle, XCircle, AlertCircle, Loader2,
  Building2
} from 'lucide-react'
import { Center } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export default function CenterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const centerId = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [center, setCenter] = useState<Center | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const loadCenter = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('dona_centers')
          .select(`
            *,
            organization:dona_organizations(*),
            manager:dona_users!dona_centers_manager_id_fkey(*)
          `)
          .eq('id', centerId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Centro no encontrado')

        setCenter(data)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el centro'
        toast.error(errorMessage)
        router.push('/dashboard/centers')
      } finally {
        setLoading(false)
      }
    }

    if (centerId) {
      loadCenter()
    }
  }, [centerId, supabase, router])

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('dona_centers')
        .delete()
        .eq('id', centerId)

      if (error) throw error
      toast.success('Centro eliminado exitosamente')
      router.push('/dashboard/centers')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el centro'
      toast.error(errorMessage)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
      active: { label: 'Activo', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      accepting: { label: 'Aceptando', class: 'bg-blue-100 text-blue-800', icon: Package },
      full: { label: 'Lleno', class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      inactive: { label: 'Inactivo', class: 'bg-red-100 text-red-800', icon: XCircle }
    }
    const config = statusConfig[status] || statusConfig.active
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!center) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Centro no encontrado</h3>
            <p className="text-gray-500 mb-4">El centro que buscas no existe o fue eliminado.</p>
            <Link
              href="/dashboard/centers"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a centros
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const organization = center.organization && typeof center.organization === 'object' && 'name' in center.organization
    ? center.organization
    : null
  const manager = center.manager && typeof center.manager === 'object' && 'full_name' in center.manager
    ? center.manager
    : null
  const address = typeof center.address === 'object' 
    ? center.address as { street?: string; city?: string; province?: string; postal_code?: string }
    : null
  const operatingHours = typeof center.operating_hours === 'object' 
    ? center.operating_hours as { monday_friday?: string; saturday?: string; sunday?: string }
    : null
  const acceptedItems = Array.isArray(center.accepted_items) ? center.accepted_items : []
  const capacityInfo = typeof center.capacity_info === 'object' 
    ? center.capacity_info as { used?: number; total?: number; percentage?: number }
    : { used: 0, total: 0, percentage: 0 }
  const capacityPercentage = capacityInfo.percentage || 0

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/centers"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a centros
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{center.name}</h1>
              <div className="mt-2 flex items-center space-x-4">
                {getStatusBadge(center.status || 'active')}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/dashboard/centers/${center.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {center.description && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Descripción</h2>
                <p className="text-gray-700">{center.description}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h2>
              <dl className="grid grid-cols-1 gap-4">
                {center.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Teléfono
                    </dt>
                    <dd className="text-sm text-gray-900">{center.phone}</dd>
                  </div>
                )}
                {center.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Correo Electrónico
                    </dt>
                    <dd className="text-sm text-gray-900">{center.email}</dd>
                  </div>
                )}
                {manager && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      Encargado
                    </dt>
                    <dd className="text-sm text-gray-900">{manager.full_name}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Address */}
            {address && Object.keys(address).length > 0 && (
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

            {/* Operating Hours */}
            {operatingHours && Object.keys(operatingHours).length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horario de Atención
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  {operatingHours.monday_friday && <p>Lunes a Viernes: {operatingHours.monday_friday}</p>}
                  {operatingHours.saturday && <p>Sábado: {operatingHours.saturday}</p>}
                  {operatingHours.sunday && <p>Domingo: {operatingHours.sunday}</p>}
                </div>
              </div>
            )}

            {/* Accepted Items */}
            {acceptedItems.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Artículos Aceptados</h2>
                <div className="flex flex-wrap gap-2">
                  {acceptedItems.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization */}
            {organization && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Organización
                </h3>
                <p className="text-sm text-gray-900">{organization.name}</p>
              </div>
            )}

            {/* Capacity */}
            {center.status !== 'inactive' && capacityInfo && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Capacidad</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uso</span>
                    <span className="font-medium">{capacityPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        capacityPercentage < 50 ? 'bg-green-500' :
                        capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${capacityPercentage}%` }}
                    />
                  </div>
                  {capacityInfo.used !== undefined && capacityInfo.total !== undefined && (
                    <p className="text-xs text-gray-500">
                      {capacityInfo.used} / {capacityInfo.total} espacios usados
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Eliminar Centro
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás seguro de que deseas eliminar este centro de acopio? Esta acción no se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

