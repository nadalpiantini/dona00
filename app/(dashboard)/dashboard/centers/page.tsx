'use client'

import { useState } from 'react'
import { useCenters } from '@/lib/hooks/use-centers'
import { useStats } from '@/lib/hooks/use-stats'
import {
  MapPin, Plus, Search, Phone, Mail, Clock, Package,
  Edit2, Trash2, ChevronRight, AlertCircle, CheckCircle, XCircle,
  Building2, Users, Loader2
} from 'lucide-react'
import { CenterStatus } from '@/lib/types/database.types'

export default function CentersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<CenterStatus | 'all'>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [centerToDelete, setCenterToDelete] = useState<string | null>(null)

  const { centers, loading, deleteCenter } = useCenters({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    search: searchTerm || undefined,
  })

  const { stats } = useStats()

  const handleDeleteCenter = (id: string) => {
    setCenterToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (centerToDelete) {
      try {
        await deleteCenter(centerToDelete)
        setShowDeleteModal(false)
        setCenterToDelete(null)
      } catch {
        // Error already handled in hook
      }
    }
  }

  const statuses = {
    all: 'Todos',
    active: 'Activo',
    accepting: 'Aceptando',
    full: 'Lleno',
    inactive: 'Inactivo'
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getCapacityColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centros de Acopio</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona los centros de recolección y distribución de donaciones
              </p>
            </div>

            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Centro
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Centros</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalCenters}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.activeCenters}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Donaciones Activas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">-</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Voluntarios</dt>
                    <dd className="text-2xl font-semibold text-gray-900">-</dd>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Buscar centros, ciudades, organizaciones..."
                  />
                </div>
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CenterStatus | 'all')}
                className="block w-full lg:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {Object.entries(statuses).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Centers Grid */}
        {!loading && centers.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay centros de acopio</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'No se encontraron centros con los filtros seleccionados'
                : 'Comienza creando tu primer centro de acopio'}
            </p>
          </div>
        )}

        {!loading && centers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {centers.map((center) => {
              const address = typeof center.address === 'object' ? center.address : {}
              const operatingHours = typeof center.operating_hours === 'object' ? center.operating_hours : {}
              const acceptedItems = Array.isArray(center.accepted_items) ? center.accepted_items : []
              const capacityInfo = typeof center.capacity_info === 'object' ? center.capacity_info : {}
              const capacityPercentage = capacityInfo.percentage || 0

              return (
                <div key={center.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                        <p className="text-sm text-gray-500">
                          {center.organization && typeof center.organization === 'object' && 'name' in center.organization
                            ? center.organization.name
                            : 'Organización'}
                        </p>
                      </div>
                      {getStatusBadge(center.status || 'active')}
                    </div>

                    {/* Address and Contact */}
                    <div className="space-y-2 mb-4">
                      {address && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                          <div>
                            {address.street && <p>{address.street}</p>}
                            <p>{address.city}{address.province && `, ${address.province}`} {address.postal_code || ''}</p>
                          </div>
                        </div>
                      )}

                      {center.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {center.phone}
                        </div>
                      )}

                      {center.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {center.email}
                        </div>
                      )}

                      {center.manager && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          Encargado: {center.manager && typeof center.manager === 'object' && 'full_name' in center.manager
                            ? center.manager.full_name
                            : 'Sin asignar'}
                        </div>
                      )}
                    </div>

                    {/* Operating Hours */}
                    {operatingHours && Object.keys(operatingHours).length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <Clock className="h-4 w-4 mr-2" />
                          Horario de Atención
                        </div>
                        <div className="text-xs text-gray-600 space-y-1 ml-6">
                          {operatingHours.monday_friday && <p>Lun-Vie: {operatingHours.monday_friday}</p>}
                          {operatingHours.saturday && <p>Sábado: {operatingHours.saturday}</p>}
                          {operatingHours.sunday && <p>Domingo: {operatingHours.sunday}</p>}
                        </div>
                      </div>
                    )}

                    {/* Capacity Bar */}
                    {center.status !== 'inactive' && capacityInfo && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Capacidad</span>
                          <span className="font-medium">{capacityPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getCapacityColor(capacityPercentage)}`}
                            style={{ width: `${capacityPercentage}%` }}
                          />
                        </div>
                        {capacityInfo.used !== undefined && capacityInfo.total !== undefined && (
                          <p className="text-xs text-gray-500 mt-1">
                            {capacityInfo.used} / {capacityInfo.total} espacios usados
                          </p>
                        )}
                      </div>
                    )}

                    {/* Accepted Items */}
                    {acceptedItems.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Artículos Aceptados</p>
                        <div className="flex flex-wrap gap-1">
                          {acceptedItems.slice(0, 5).map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {item}
                            </span>
                          ))}
                          {acceptedItems.length > 5 && (
                            <span className="text-xs text-gray-500">+{acceptedItems.length - 5} más</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCenter(center.id)}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver detalles
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCenter(center.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setCenterToDelete(null)
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
