'use client'

import { useState } from 'react'
import { useDeliveries } from '@/lib/hooks/use-deliveries'
import { useStats } from '@/lib/hooks/use-stats'
import {
  Truck, Search, Package, MapPin, Clock, User,
  Phone, Calendar, CheckCircle, XCircle, AlertCircle,
  ChevronRight, Loader2
} from 'lucide-react'
import { DeliveryStatus } from '@/lib/types/database.types'
import { formatDate } from '@/lib/utils/format'

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | 'all'>('all')

  const { deliveries, loading, updateDeliveryStatus, refresh } = useDeliveries({
    status: filterStatus !== 'all' ? filterStatus : undefined,
    search: searchTerm || undefined,
  })

  const { stats } = useStats()

  const statuses = {
    all: 'Todos',
    pending: 'Pendiente',
    scheduled: 'Programada',
    in_transit: 'En Tránsito',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
    failed: 'Fallida'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
      pending: { label: 'Pendiente', class: 'bg-gray-100 text-gray-800', icon: Clock },
      scheduled: { label: 'Programada', class: 'bg-blue-100 text-blue-800', icon: Calendar },
      in_transit: { label: 'En Tránsito', class: 'bg-yellow-100 text-yellow-800', icon: Truck },
      delivered: { label: 'Entregada', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelada', class: 'bg-red-100 text-red-800', icon: XCircle },
      failed: { label: 'Fallida', class: 'bg-red-100 text-red-800', icon: AlertCircle },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const handleStatusUpdate = async (id: string, newStatus: DeliveryStatus) => {
    try {
      await updateDeliveryStatus(id, newStatus)
    } catch (err) {
      // Error already handled in hook
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Entregas</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona y rastrea todas las entregas de donaciones
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Entregas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalDeliveries}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">En Tránsito</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.inTransitDeliveries}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Completadas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.deliveredDonations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                    <dd className="text-2xl font-semibold text-gray-900">-</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
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
                    placeholder="Buscar por número de tracking..."
                  />
                </div>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as DeliveryStatus | 'all')}
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

        {/* Deliveries List */}
        {!loading && deliveries.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'No se encontraron entregas con los filtros seleccionados'
                : 'Aún no hay entregas registradas'}
            </p>
          </div>
        )}

        {!loading && deliveries.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {deliveries.map((delivery) => {
                const donation = delivery.donation && typeof delivery.donation === 'object' && 'title' in delivery.donation 
                  ? delivery.donation 
                  : null
                const driver = delivery.driver && typeof delivery.driver === 'object' && 'full_name' in delivery.driver
                  ? delivery.driver
                  : null
                const beneficiary = delivery.beneficiary && typeof delivery.beneficiary === 'object' && 'full_name' in delivery.beneficiary
                  ? delivery.beneficiary
                  : null

                return (
                  <li key={delivery.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex-shrink-0">
                            <Package className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {delivery.tracking_number}
                              </p>
                              {getStatusBadge(delivery.status || 'pending')}
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {donation && 'title' in donation ? donation.title : 'Donación'}
                            </p>
                            <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                              {driver && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {'full_name' in driver ? driver.full_name : 'Sin conductor'}
                                </span>
                              )}
                              {beneficiary && (
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {'full_name' in beneficiary ? beneficiary.full_name : 'Beneficiario'}
                                </span>
                              )}
                              {delivery.scheduled_delivery_at && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(delivery.scheduled_delivery_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {delivery.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(delivery.id, 'scheduled')}
                              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                            >
                              Programar
                            </button>
                          )}
                          {delivery.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(delivery.id, 'in_transit')}
                              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                            >
                              Iniciar
                            </button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <button
                              onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                            >
                              Completar
                            </button>
                          )}
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
