'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDonations } from '@/lib/hooks/use-donations'
import {
  ArrowLeft, MapPin, User, Heart,
  Eye, Edit2, Trash2, CheckCircle, Clock,
  AlertCircle, Loader2
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

export default function DonationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const donationId = params.id as string
  const { donations, loading, deleteDonation } = useDonations()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const donation = donations.find(d => d.id === donationId)

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; class: string }> = {
      published: { label: 'Publicado', class: 'bg-blue-100 text-blue-800' },
      claimed: { label: 'Reclamado', class: 'bg-yellow-100 text-yellow-800' },
      in_transit: { label: 'En Tránsito', class: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
      pending: { label: 'Pendiente', class: 'bg-gray-100 text-gray-800' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const handleDelete = async () => {
    try {
      await deleteDonation(donationId)
      router.push('/dashboard/donations')
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

  if (!donation) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Donación no encontrada</h3>
            <p className="text-gray-500 mb-4">La donación que buscas no existe o fue eliminada.</p>
            <Link
              href="/dashboard/donations"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a donaciones
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const donor = donation.donor && typeof donation.donor === 'object' && 'full_name' in donation.donor
    ? donation.donor
    : null
  const beneficiary = donation.beneficiary && typeof donation.beneficiary === 'object' && 'full_name' in donation.beneficiary
    ? donation.beneficiary
    : null
  const category = donation.category && typeof donation.category === 'object' && 'name' in donation.category
    ? donation.category
    : null

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/donations"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a donaciones
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{donation.title}</h1>
              <div className="mt-2 flex items-center space-x-4">
                {getStatusBadge(donation.status || 'pending')}
                {donation.is_urgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Urgente
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/dashboard/donations/${donation.id}/edit`}
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
            {/* Images */}
            {donation.images && donation.images.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Imágenes</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Array.isArray(donation.images) ? donation.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${donation.title} - Imagen ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      width={400}
                      height={192}
                    />
                  )) : (
                    <Image
                      src={donation.images}
                      alt={donation.title}
                      className="w-full h-48 object-cover rounded-lg"
                      width={400}
                      height={192}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{donation.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Detalles</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cantidad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{donation.quantity || 1}</dd>
                </div>
                {donation.condition && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Condición</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {donation.condition === 'new' ? 'Nuevo' :
                       donation.condition === 'like_new' ? 'Como Nuevo' :
                       donation.condition === 'good' ? 'Buen Estado' : 'Regular'}
                    </dd>
                  </div>
                )}
                {category && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                    <dd className="mt-1 text-sm text-gray-900">{category.name}</dd>
                  </div>
                )}
                {donation.views_count !== undefined && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Visualizaciones</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {donation.views_count || 0}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donor Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Donante
              </h3>
              {donor ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{donor.full_name}</p>
                  {donor.email && (
                    <p className="text-sm text-gray-500 mt-1">{donor.email}</p>
                  )}
                  {donor.phone && (
                    <p className="text-sm text-gray-500">{donor.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Información no disponible</p>
              )}
            </div>

            {/* Beneficiary Info */}
            {beneficiary && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Beneficiario
                </h3>
                <div>
                  <p className="text-sm font-medium text-gray-900">{beneficiary.full_name}</p>
                  {beneficiary.email && (
                    <p className="text-sm text-gray-500 mt-1">{beneficiary.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {donation.pickup_address && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Ubicación
                </h3>
                <div className="text-sm text-gray-700">
                  {typeof donation.pickup_address === 'string' ? (
                    <p>{donation.pickup_address}</p>
                  ) : (
                    <>
                      {(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).street && <p>{(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).street}</p>}
                      <p>
                        {(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).city}
                        {(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).province && `, ${(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).province}`}
                        {(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).postal_code && ` ${(donation.pickup_address as { street?: string; city?: string; province?: string; postal_code?: string }).postal_code}`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Historial
              </h3>
              <div className="space-y-3">
                {donation.created_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Creada</p>
                      <p className="text-xs text-gray-500">{formatDate(donation.created_at)}</p>
                    </div>
                  </div>
                )}
                {donation.claimed_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full mt-1.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Reclamada</p>
                      <p className="text-xs text-gray-500">{formatDate(donation.claimed_at)}</p>
                    </div>
                  </div>
                )}
                {donation.delivered_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Entregada</p>
                      <p className="text-xs text-gray-500">{formatDate(donation.delivered_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                        Eliminar Donación
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          ¿Estás seguro de que deseas eliminar esta donación? Esta acción no se puede deshacer.
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



