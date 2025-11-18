'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDonations } from '@/lib/hooks/use-donations'
import { useCategories } from '@/lib/hooks/use-categories'
import { useStats } from '@/lib/hooks/use-stats'
import {
  Package, Plus, Search, Eye, Edit2, Trash2, Heart,
  Calendar, MapPin, Users, Grid, List, Download,
  AlertCircle, Loader2
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import { DonationStatus } from '@/lib/types/database.types'

export default function DonationsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<DonationStatus | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [donationToDelete, setDonationToDelete] = useState<string | null>(null)
  const itemsPerPage = 12

  const { donations, loading, total, deleteDonation } = useDonations({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    categoryId: filterCategory !== 'all' ? filterCategory : undefined,
    search: searchTerm || undefined,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  })

  const { categories } = useCategories()
  const { stats } = useStats()

  const statuses = {
    all: 'Todos',
    pending: 'Pendiente',
    published: 'Publicado',
    claimed: 'Reclamado',
    in_transit: 'En Tránsito',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; class: string }> = {
      published: { label: 'Publicado', class: 'bg-blue-100 text-blue-800' },
      claimed: { label: 'Reclamado', class: 'bg-yellow-100 text-yellow-800' },
      in_transit: { label: 'En Tránsito', class: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
      pending: { label: 'Pendiente', class: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status] || statusConfig.published

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getConditionLabel = (condition: string) => {
    const conditions: Record<string, string> = {
      new: 'Nuevo',
      like_new: 'Como Nuevo',
      good: 'Buen Estado',
      fair: 'Regular'
    }
    return conditions[condition] || condition
  }

  const handleDeleteDonation = (id: string) => {
    setDonationToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (donationToDelete) {
      try {
        await deleteDonation(donationToDelete)
        setShowDeleteModal(false)
        setDonationToDelete(null)
      } catch {
        // Error already handled in hook
      }
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donaciones</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona todas las donaciones publicadas en la plataforma
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
              <Link
                href="/dashboard/donations/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Donación
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Donaciones</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalDonations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Heart className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Publicadas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.publishedDonations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reclamadas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.claimedDonations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Entregadas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.deliveredDonations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Buscar donaciones..."
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as DonationStatus | 'all')
                    setCurrentPage(1)
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {Object.entries(statuses).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow' : ''}`}
                  >
                    <Grid className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow' : ''}`}
                  >
                    <List className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Donations Grid/List */}
        {!loading && donations.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay donaciones</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'No se encontraron donaciones con los filtros seleccionados'
                : 'Comienza creando tu primera donación'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
              <Link
                href="/dashboard/donations/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Donación
              </Link>
            )}
          </div>
        )}

        {!loading && donations.length > 0 && (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {donation.images && donation.images.length > 0 && (
                        <img
                          className="h-48 w-full object-cover"
                          src={Array.isArray(donation.images) ? donation.images[0] : donation.images}
                          alt={donation.title}
                        />
                      )}
                      {donation.is_urgent && (
                        <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgente
                        </span>
                      )}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(donation.status || 'pending')}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {donation.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {donation.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        {donation.pickup_address && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="truncate max-w-[150px]">
                              {typeof donation.pickup_address === 'string' 
                                ? donation.pickup_address 
                                : donation.pickup_address.city || 'Ubicación'}
                            </span>
                          </div>
                        )}
                        {donation.created_at && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(donation.created_at)}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Cantidad: <span className="font-medium">{donation.quantity || 1}</span>
                        </span>
                        {donation.condition && (
                          <span className="text-sm text-gray-500">
                            {getConditionLabel(donation.condition)}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{donation.views_count || 0}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Link
                            href={`/dashboard/donations/${donation.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/donations/${donation.id}/edit`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteDonation(donation.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {donations.map((donation) => (
                    <li key={donation.id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="flex items-center">
                            {donation.images && donation.images.length > 0 && (
                              <div className="flex-shrink-0">
                                <img 
                                  className="h-16 w-16 rounded-lg object-cover" 
                                  src={Array.isArray(donation.images) ? donation.images[0] : donation.images} 
                                  alt={donation.title} 
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="flex items-center">
                                <h3 className="text-lg font-medium text-gray-900">{donation.title}</h3>
                                {donation.is_urgent && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Urgente
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{donation.description}</p>
                              <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                {donation.pickup_address && (
                                  <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {typeof donation.pickup_address === 'string' 
                                      ? donation.pickup_address 
                                      : donation.pickup_address.city || 'Ubicación'}
                                  </span>
                                )}
                                <span>Cantidad: {donation.quantity || 1}</span>
                                {donation.condition && (
                                  <span>{getConditionLabel(donation.condition)}</span>
                                )}
                                <span className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {donation.views_count || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0 sm:ml-5">
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(donation.status || 'pending')}
                              <Link
                                href={`/dashboard/donations/${donation.id}`}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              <Link
                                href={`/dashboard/donations/${donation.id}/edit`}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Edit2 className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteDonation(donation.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, total)}</span> de{' '}
                      <span className="font-medium">{total}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === pageNum
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            } text-sm font-medium`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

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
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDonationToDelete(null)
                    }}
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
