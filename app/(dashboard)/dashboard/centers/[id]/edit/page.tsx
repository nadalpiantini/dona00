'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useCenters } from '@/lib/hooks/use-centers'
import { ArrowLeft, Loader2, AlertCircle, Save, MapPin, Phone, Mail, Clock, Users } from 'lucide-react'
import { Center, CenterStatus } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export default function EditCenterPage() {
  const params = useParams()
  const router = useRouter()
  const centerId = params.id as string
  const { updateCenter } = useCenters()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [center, setCenter] = useState<Center | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    status: 'active' as CenterStatus,
    address: {
      street: '',
      city: '',
      province: '',
      postal_code: '',
    },
    operating_hours: {
      monday_friday: '',
      saturday: '',
      sunday: '',
    },
    accepted_items: [] as string[],
  })

  useEffect(() => {
    const loadCenter = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('dona_centers')
          .select('*')
          .eq('id', centerId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Centro no encontrado')

        setCenter(data)
        setFormData({
          name: data.name || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          status: data.status || 'active',
          address: typeof data.address === 'object' && data.address
            ? {
                street: data.address.street || '',
                city: data.address.city || '',
                province: data.address.province || '',
                postal_code: data.address.postal_code || '',
              }
            : { street: '', city: '', province: '', postal_code: '' },
          operating_hours: typeof data.operating_hours === 'object' && data.operating_hours
            ? {
                monday_friday: data.operating_hours.monday_friday || '',
                saturday: data.operating_hours.saturday || '',
                sunday: data.operating_hours.sunday || '',
              }
            : { monday_friday: '', saturday: '', sunday: '' },
          accepted_items: Array.isArray(data.accepted_items) ? data.accepted_items : [],
        })
      } catch (err: any) {
        toast.error(err.message || 'Error al cargar el centro')
        router.push('/dashboard/centers')
      } finally {
        setLoading(false)
      }
    }

    if (centerId) {
      loadCenter()
    }
  }, [centerId, supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateCenter(centerId, {
        name: formData.name,
        description: formData.description || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        status: formData.status,
        address: formData.address,
        operating_hours: formData.operating_hours,
        accepted_items: formData.accepted_items,
      })
      router.push(`/dashboard/centers/${centerId}`)
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false)
    }
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

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/centers/${centerId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a detalles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Centro</h1>
          <p className="mt-1 text-sm text-gray-600">
            Modifica la información del centro de acopio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre del Centro *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo Electrónico
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CenterStatus })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="accepting">Aceptando</option>
                    <option value="full">Lleno</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Dirección</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Calle y Número
                  </label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Provincia
                  </label>
                  <input
                    type="text"
                    id="province"
                    value={formData.address.province}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, province: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Horario de Atención
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="monday_friday" className="block text-sm font-medium text-gray-700">
                    Lunes a Viernes
                  </label>
                  <input
                    type="text"
                    id="monday_friday"
                    value={formData.operating_hours.monday_friday}
                    onChange={(e) => setFormData({
                      ...formData,
                      operating_hours: { ...formData.operating_hours, monday_friday: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 8:00 AM - 5:00 PM"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="saturday" className="block text-sm font-medium text-gray-700">
                      Sábado
                    </label>
                    <input
                      type="text"
                      id="saturday"
                      value={formData.operating_hours.saturday}
                      onChange={(e) => setFormData({
                        ...formData,
                        operating_hours: { ...formData.operating_hours, saturday: e.target.value }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 9:00 AM - 1:00 PM"
                    />
                  </div>
                  <div>
                    <label htmlFor="sunday" className="block text-sm font-medium text-gray-700">
                      Domingo
                    </label>
                    <input
                      type="text"
                      id="sunday"
                      value={formData.operating_hours.sunday}
                      onChange={(e) => setFormData({
                        ...formData,
                        operating_hours: { ...formData.operating_hours, sunday: e.target.value }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Cerrado"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href={`/dashboard/centers/${centerId}`}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

