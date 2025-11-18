'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useDonations } from '@/lib/hooks/use-donations'
import { useCategories } from '@/lib/hooks/use-categories'
import { useCenters } from '@/lib/hooks/use-centers'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { DonationStatus, Donation } from '@/lib/types/database.types'
import toast from 'react-hot-toast'

export default function EditDonationPage() {
  const params = useParams()
  const router = useRouter()
  const donationId = params.id as string
  const { updateDonation } = useDonations()
  const { categories } = useCategories()
  const { centers } = useCenters()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [donation, setDonation] = useState<Donation | null>(null)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    center_id: '',
    quantity: 1,
    condition: 'good' as 'new' | 'like_new' | 'good' | 'fair',
    status: 'pending' as DonationStatus,
    is_urgent: false,
    pickup_address: {
      street: '',
      city: '',
      province: '',
      postal_code: '',
    },
    tags: [] as string[],
  })

  useEffect(() => {
    const loadDonation = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('dona_donations')
          .select(`
            *,
            donor:dona_users!dona_donations_donor_id_fkey(*),
            category:dona_categories(*),
            center:dona_centers(*)
          `)
          .eq('id', donationId)
          .single()

        if (error) throw error
        if (!data) throw new Error('Donación no encontrada')

        setDonation(data)
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category_id: data.category_id || '',
          center_id: data.center_id || '',
          quantity: data.quantity || 1,
          condition: data.condition || 'good',
          status: data.status || 'pending',
          is_urgent: data.is_urgent || false,
          pickup_address: typeof data.pickup_address === 'object' && data.pickup_address
            ? data.pickup_address
            : { street: '', city: '', province: '', postal_code: '' },
          tags: Array.isArray(data.tags) ? data.tags : [],
        })
        setImages(Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []))
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar la donación'
        toast.error(errorMessage)
        router.push('/dashboard/donations')
      } finally {
        setLoading(false)
      }
    }

    if (donationId) {
      loadDonation()
    }
  }, [donationId, supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateDonation(donationId, {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id || undefined,
        center_id: formData.center_id || undefined,
        quantity: formData.quantity,
        condition: formData.condition,
        status: formData.status,
        is_urgent: formData.is_urgent,
        images: images,
        pickup_address: formData.pickup_address,
        tags: formData.tags,
      })

      router.push(`/dashboard/donations/${donationId}`)
    } catch {
      // Error already handled by toast in hook
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          setImages(prev => [...prev, reader.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
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

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/donations/${donationId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a detalles
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Donación</h1>
          <p className="mt-1 text-sm text-gray-600">
            Modifica la información de la donación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Ropa de niños tallas 4-8 años"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe los artículos que deseas donar..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Categoría
                    </label>
                    <select
                      id="category"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                      Condición *
                    </label>
                    <select
                      id="condition"
                      required
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'new' | 'like_new' | 'good' | 'fair' })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="new">Nuevo</option>
                      <option value="like_new">Como Nuevo</option>
                      <option value="good">Buen Estado</option>
                      <option value="fair">Regular</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as DonationStatus })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="published">Publicado</option>
                      <option value="claimed">Reclamado</option>
                      <option value="in_transit">En Tránsito</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Imágenes</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click para subir</span> o arrastra y suelta
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG o GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={img}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={96}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ubicación de Recolección</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Calle y Número
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={formData.pickup_address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickup_address: { ...formData.pickup_address, street: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.pickup_address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickup_address: { ...formData.pickup_address, city: e.target.value }
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
                    value={formData.pickup_address.province}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickup_address: { ...formData.pickup_address, province: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Opciones</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="urgent"
                    type="checkbox"
                    checked={formData.is_urgent}
                    onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
                    Marcar como urgente
                  </label>
                </div>

                <div>
                  <label htmlFor="center" className="block text-sm font-medium text-gray-700">
                    Centro de Acopio (Opcional)
                  </label>
                  <select
                    id="center"
                    value={formData.center_id}
                    onChange={(e) => setFormData({ ...formData, center_id: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Ninguno (entrega directa)</option>
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link
              href={`/dashboard/donations/${donationId}`}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



