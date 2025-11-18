'use client'

import { useState } from 'react'
import { useBeneficiaries } from '@/lib/hooks/use-beneficiaries'
import { useStats } from '@/lib/hooks/use-stats'
import {
  Search, Plus, Users, MapPin, Phone, Mail, Calendar,
  CheckCircle, Clock, AlertTriangle, Edit, Trash2, Eye,
  Loader2, Shield
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

export default function BeneficiariesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVerified, setFilterVerified] = useState<boolean | 'all'>('all')

  const { beneficiaries, loading, verifyBeneficiary, refresh } = useBeneficiaries({
    search: searchTerm || undefined,
    verified: filterVerified !== 'all' ? filterVerified : undefined,
  })

  const { stats } = useStats()

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Beneficiarios</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona los beneficiarios registrados en la plataforma
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Beneficiario
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Beneficiarios</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalBeneficiaries}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verificados</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.verifiedBeneficiaries}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.totalBeneficiaries - stats.verifiedBeneficiaries}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
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
                    placeholder="Buscar por nombre, email o teléfono..."
                  />
                </div>
              </div>

              <select
                value={filterVerified === 'all' ? 'all' : filterVerified ? 'verified' : 'unverified'}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterVerified(value === 'all' ? 'all' : value === 'verified')
                }}
                className="block w-full lg:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">Todos</option>
                <option value="verified">Verificados</option>
                <option value="unverified">No Verificados</option>
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

        {/* Beneficiaries Grid */}
        {!loading && beneficiaries.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay beneficiarios</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterVerified !== 'all'
                ? 'No se encontraron beneficiarios con los filtros seleccionados'
                : 'Comienza registrando tu primer beneficiario'}
            </p>
            {!searchTerm && filterVerified === 'all' && (
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Beneficiario
              </button>
            )}
          </div>
        )}

        {!loading && beneficiaries.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{beneficiary.full_name}</h3>
                      <p className="text-sm text-gray-500">{beneficiary.email}</p>
                    </div>
                    {beneficiary.is_verified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {beneficiary.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {beneficiary.phone}
                      </div>
                    )}
                    {beneficiary.address && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2">
                          {typeof beneficiary.address === 'string' 
                            ? beneficiary.address 
                            : `${beneficiary.address.street || ''} ${beneficiary.address.city || ''}`.trim()}
                        </span>
                      </div>
                    )}
                    {beneficiary.created_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        Registrado: {formatDate(beneficiary.created_at)}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      {!beneficiary.is_verified && (
                        <button
                          onClick={() => verifyBeneficiary(beneficiary.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600"
                          title="Verificar beneficiario"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
