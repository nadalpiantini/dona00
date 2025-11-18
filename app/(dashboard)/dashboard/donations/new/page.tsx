'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDonations } from '@/lib/hooks/use-donations'
import { useCategories } from '@/lib/hooks/use-categories'
import { useCenters } from '@/lib/hooks/use-centers'
import { useAuth } from '@/components/providers/auth-provider'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { DonationStatus } from '@/lib/types/database.types'

export default function NewDonationPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const { createDonation } = useDonations()
  const { categories } = useCategories()
  const { centers } = useCenters()
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!profile?.id) {
        throw new Error('Usuario no autenticado')
      }

      if (!profile.organization_id) {
        throw new Error('Usuario no tiene organización asignada')
      }

      await createDonation({
        organization_id: profile.organization_id,
        donor_id: profile.id,
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id || null,
        center_id: formData.center_id || null,
        quantity: formData.quantity,
        condition: formData.condition,
        status: formData.status,
        is_urgent: formData.is_urgent,
        images: images,
        pickup_address: formData.pickup_address,
        tags: formData.tags,
      })

      router.push('/dashboard/donations')
    } catch (err: any) {
      // Error already handled by toast in hook
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In production, upload to Supabase Storage
    // For now, convert to data URLs
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

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/donations"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a donaciones
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Donación</h1>
          <p className="mt-1 text-sm text-gray-600">
            Completa el formulario para publicar una nueva donación
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
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
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
                      Estado Inicial
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as DonationStatus })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="published">Publicado</option>
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
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
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
              href="/dashboard/donations"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Crear Donación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

