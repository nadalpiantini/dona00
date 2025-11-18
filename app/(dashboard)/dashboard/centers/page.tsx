'use client'

import { useState } from 'react'
import {
  MapPin, Plus, Search, Filter, Phone, Mail, Clock, Package,
  Edit2, Trash2, ChevronRight, AlertCircle, CheckCircle, XCircle,
  Building2, Users, Calendar, TrendingUp, Navigation
} from 'lucide-react'

export default function CentersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null)

  // Mock data - en producción vendría de Supabase
  const centers = [
    {
      id: 1,
      name: 'Centro de Acopio Santo Domingo Norte',
      organization: 'Transporte Unidos RD',
      address: {
        street: 'Av. Hermanas Mirabal #123',
        city: 'Santo Domingo Norte',
        province: 'Santo Domingo',
        postal_code: '11203'
      },
      phone: '809-555-0101',
      email: 'centro.sdn@transporteunidos.do',
      manager: 'Juan Pérez',
      status: 'active',
      capacity: {
        total: 1000,
        used: 650,
        percentage: 65
      },
      operating_hours: {
        monday_friday: '8:00 AM - 6:00 PM',
        saturday: '8:00 AM - 2:00 PM',
        sunday: 'Cerrado'
      },
      accepted_items: ['Ropa', 'Alimentos', 'Juguetes', 'Muebles', 'Electrodomésticos'],
      current_donations: 45,
      total_donations: 1234,
      volunteers: 12,
      coordinates: { lat: 18.5110, lng: -69.8658 }
    },
    {
      id: 2,
      name: 'Centro Comunitario Santiago',
      organization: 'Logística Cibao',
      address: {
        street: 'Calle del Sol #45',
        city: 'Santiago',
        province: 'Santiago',
        postal_code: '51000'
      },
      phone: '809-555-0202',
      email: 'centro.santiago@logisticacibao.do',
      manager: 'María González',
      status: 'active',
      capacity: {
        total: 800,
        used: 720,
        percentage: 90
      },
      operating_hours: {
        monday_friday: '7:00 AM - 7:00 PM',
        saturday: '8:00 AM - 4:00 PM',
        sunday: '9:00 AM - 1:00 PM'
      },
      accepted_items: ['Ropa', 'Alimentos', 'Material Educativo', 'Medicamentos'],
      current_donations: 67,
      total_donations: 2345,
      volunteers: 18,
      coordinates: { lat: 19.4517, lng: -70.6970 }
    },
    {
      id: 3,
      name: 'Almacén La Romana',
      organization: 'Caribe Express',
      address: {
        street: 'Av. Libertad #789',
        city: 'La Romana',
        province: 'La Romana',
        postal_code: '22000'
      },
      phone: '809-555-0303',
      email: 'almacen.lr@caribeexpress.do',
      manager: 'Carlos Martínez',
      status: 'full',
      capacity: {
        total: 500,
        used: 500,
        percentage: 100
      },
      operating_hours: {
        monday_friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 12:00 PM',
        sunday: 'Cerrado'
      },
      accepted_items: ['Ropa', 'Juguetes', 'Artículos del Hogar'],
      current_donations: 89,
      total_donations: 987,
      volunteers: 8,
      coordinates: { lat: 18.4273, lng: -68.9728 }
    },
    {
      id: 4,
      name: 'Centro de Distribución Puerto Plata',
      organization: 'Norte Logistics',
      address: {
        street: 'Malecón #321',
        city: 'Puerto Plata',
        province: 'Puerto Plata',
        postal_code: '57000'
      },
      phone: '809-555-0404',
      email: 'centro.pp@nortelogistics.do',
      manager: 'Ana Rodríguez',
      status: 'accepting',
      capacity: {
        total: 1200,
        used: 400,
        percentage: 33
      },
      operating_hours: {
        monday_friday: '7:30 AM - 6:30 PM',
        saturday: '8:00 AM - 3:00 PM',
        sunday: '10:00 AM - 2:00 PM'
      },
      accepted_items: ['Ropa', 'Alimentos', 'Juguetes', 'Muebles', 'Material Escolar', 'Electrodomésticos'],
      current_donations: 23,
      total_donations: 654,
      volunteers: 15,
      coordinates: { lat: 19.7808, lng: -70.6871 }
    },
    {
      id: 5,
      name: 'Punto de Recolección San Cristóbal',
      organization: 'Sur Transport',
      address: {
        street: 'Av. Constitución #567',
        city: 'San Cristóbal',
        province: 'San Cristóbal',
        postal_code: '91000'
      },
      phone: '809-555-0505',
      email: 'punto.sc@surtransport.do',
      manager: 'Pedro Sánchez',
      status: 'inactive',
      capacity: {
        total: 600,
        used: 0,
        percentage: 0
      },
      operating_hours: {
        monday_friday: 'Temporalmente Cerrado',
        saturday: 'Temporalmente Cerrado',
        sunday: 'Temporalmente Cerrado'
      },
      accepted_items: [],
      current_donations: 0,
      total_donations: 432,
      volunteers: 0,
      coordinates: { lat: 18.4167, lng: -70.1000 }
    }
  ]

  const statuses = {
    all: 'Todos',
    active: 'Activo',
    accepting: 'Aceptando',
    full: 'Lleno',
    inactive: 'Inactivo'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Activo', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      accepting: { label: 'Aceptando', class: 'bg-blue-100 text-blue-800', icon: Package },
      full: { label: 'Lleno', class: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      inactive: { label: 'Inactivo', class: 'bg-red-100 text-red-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
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

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          center.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          center.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || center.status === filterStatus

    return matchesSearch && matchesStatus
  })

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
                    <dd className="text-2xl font-semibold text-gray-900">{centers.length}</dd>
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
                    <dd className="text-2xl font-semibold text-gray-900">
                      {centers.filter(c => c.status === 'active' || c.status === 'accepting').length}
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
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Donaciones Activas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {centers.reduce((sum, c) => sum + c.current_donations, 0)}
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
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Voluntarios</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {centers.reduce((sum, c) => sum + c.volunteers, 0)}
                    </dd>
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
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full lg:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {Object.entries(statuses).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCenters.map((center) => (
            <div key={center.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                    <p className="text-sm text-gray-500">{center.organization}</p>
                  </div>
                  {getStatusBadge(center.status)}
                </div>

                {/* Address and Contact */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                    <div>
                      <p>{center.address.street}</p>
                      <p>{center.address.city}, {center.address.province} {center.address.postal_code}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {center.phone}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {center.email}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    Encargado: {center.manager}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="mb-4">
                  <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Horario de Atención
                  </div>
                  <div className="text-xs text-gray-600 space-y-1 ml-6">
                    <p>Lun-Vie: {center.operating_hours.monday_friday}</p>
                    <p>Sábado: {center.operating_hours.saturday}</p>
                    <p>Domingo: {center.operating_hours.sunday}</p>
                  </div>
                </div>

                {/* Capacity Bar */}
                {center.status !== 'inactive' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Capacidad</span>
                      <span className="font-medium">{center.capacity.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCapacityColor(center.capacity.percentage)}`}
                        style={{ width: `${center.capacity.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {center.capacity.used} / {center.capacity.total} espacios usados
                    </p>
                  </div>
                )}

                {/* Accepted Items */}
                {center.accepted_items.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Artículos Aceptados</p>
                    <div className="flex flex-wrap gap-1">
                      {center.accepted_items.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900">{center.current_donations}</p>
                    <p className="text-xs text-gray-500">Donaciones Actuales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900">{center.total_donations}</p>
                    <p className="text-xs text-gray-500">Total Histórico</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900">{center.volunteers}</p>
                    <p className="text-xs text-gray-500">Voluntarios</p>
                  </div>
                </div>

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
                      <Navigation className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCenters.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron centros</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros o términos de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}