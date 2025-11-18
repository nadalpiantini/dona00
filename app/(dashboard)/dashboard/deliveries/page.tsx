'use client'

import { useState } from 'react'
import {
  Truck, Search, Filter, Package, MapPin, Clock, User,
  Phone, Calendar, CheckCircle, XCircle, AlertCircle,
  Navigation, FileText, Star, ChevronRight, MoreVertical,
  TrendingUp, DollarSign, Route
} from 'lucide-react'

export default function DeliveriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [view, setView] = useState<'list' | 'map'>('list')

  // Mock data - en producción vendría de Supabase
  const deliveries = [
    {
      id: 1,
      tracking_number: 'DN-2024-0001',
      donation: {
        title: 'Ropa de Invierno - 20 piezas',
        category: 'Ropa y Calzado',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=100&h=100&fit=crop'
      },
      donor: {
        name: 'María González',
        phone: '809-555-0101',
        location: 'Santo Domingo Norte'
      },
      beneficiary: {
        name: 'Centro Comunitario San José',
        contact: 'Juan Pérez',
        phone: '809-555-0202',
        location: 'Los Alcarrizos'
      },
      driver: {
        name: 'Pedro Sánchez',
        phone: '809-555-0303',
        vehicle: 'Toyota Hilux - A123456',
        rating: 4.8
      },
      status: 'in_transit',
      priority: 'normal',
      scheduled_pickup: '2024-01-20 09:00',
      actual_pickup: '2024-01-20 09:15',
      scheduled_delivery: '2024-01-20 11:00',
      estimated_arrival: '2024-01-20 10:45',
      distance: '15.5 km',
      delivery_fee: 350,
      payment_status: 'pending',
      tracking_updates: [
        { time: '09:15', status: 'Recogido en origen', location: 'Santo Domingo Norte' },
        { time: '09:45', status: 'En tránsito', location: 'Av. Jacobo Majluta' },
        { time: '10:15', status: 'Próximo a destino', location: 'Los Alcarrizos' }
      ]
    },
    {
      id: 2,
      tracking_number: 'DN-2024-0002',
      donation: {
        title: 'Material Escolar - 50 unidades',
        category: 'Libros y Material Educativo',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&h=100&fit=crop'
      },
      donor: {
        name: 'Librería Nacional',
        phone: '809-555-0404',
        location: 'Piantini'
      },
      beneficiary: {
        name: 'Escuela Primaria Los Jardines',
        contact: 'Ana Rodríguez',
        phone: '809-555-0505',
        location: 'Herrera'
      },
      driver: {
        name: 'Luis García',
        phone: '809-555-0606',
        vehicle: 'Nissan Frontier - B234567',
        rating: 4.5
      },
      status: 'delivered',
      priority: 'high',
      scheduled_pickup: '2024-01-19 08:00',
      actual_pickup: '2024-01-19 08:10',
      scheduled_delivery: '2024-01-19 10:00',
      actual_delivery: '2024-01-19 09:50',
      distance: '22.3 km',
      delivery_fee: 450,
      payment_status: 'paid',
      beneficiary_rating: 5,
      beneficiary_feedback: 'Excelente servicio, todo llegó en perfectas condiciones',
      tracking_updates: [
        { time: '08:10', status: 'Recogido en origen', location: 'Piantini' },
        { time: '08:30', status: 'En tránsito', location: 'Av. Winston Churchill' },
        { time: '09:00', status: 'En ruta', location: 'Av. Isabel Aguiar' },
        { time: '09:50', status: 'Entregado', location: 'Herrera' }
      ]
    },
    {
      id: 3,
      tracking_number: 'DN-2024-0003',
      donation: {
        title: 'Alimentos No Perecederos - 100kg',
        category: 'Alimentos',
        image: 'https://images.unsplash.com/photo-1609003040241-02456c0c7d72?w=100&h=100&fit=crop'
      },
      donor: {
        name: 'Supermercado El Popular',
        phone: '809-555-0707',
        location: 'Santiago'
      },
      beneficiary: {
        name: 'Hogar de Ancianos Santa Ana',
        contact: 'Carmen López',
        phone: '809-555-0808',
        location: 'Santiago Centro'
      },
      driver: {
        name: 'Miguel Herrera',
        phone: '809-555-0909',
        vehicle: 'Isuzu NPR - C345678',
        rating: 4.9
      },
      status: 'pending',
      priority: 'urgent',
      scheduled_pickup: '2024-01-21 07:00',
      scheduled_delivery: '2024-01-21 08:30',
      distance: '8.2 km',
      delivery_fee: 250,
      payment_status: 'pending'
    },
    {
      id: 4,
      tracking_number: 'DN-2024-0004',
      donation: {
        title: 'Muebles de Oficina - 5 piezas',
        category: 'Muebles',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'
      },
      donor: {
        name: 'Empresa Tech Solutions',
        phone: '809-555-1010',
        location: 'Naco'
      },
      beneficiary: {
        name: 'Fundación Educativa Esperanza',
        contact: 'Roberto Díaz',
        phone: '809-555-1111',
        location: 'Villa Mella'
      },
      driver: null,
      status: 'accepted',
      priority: 'normal',
      scheduled_pickup: '2024-01-22 10:00',
      scheduled_delivery: '2024-01-22 12:00',
      distance: '18.7 km',
      delivery_fee: 500,
      payment_status: 'pending'
    },
    {
      id: 5,
      tracking_number: 'DN-2024-0005',
      donation: {
        title: 'Juguetes Educativos - 30 unidades',
        category: 'Juguetes',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=100&h=100&fit=crop'
      },
      donor: {
        name: 'Ana Rodríguez',
        phone: '809-555-1212',
        location: 'La Romana'
      },
      beneficiary: {
        name: 'Guardería Infantil Arcoíris',
        contact: 'Isabel Martínez',
        phone: '809-555-1313',
        location: 'La Romana Este'
      },
      driver: {
        name: 'Carlos Jiménez',
        phone: '809-555-1414',
        vehicle: 'Mitsubishi L200 - D456789',
        rating: 4.7
      },
      status: 'cancelled',
      priority: 'low',
      scheduled_pickup: '2024-01-18 14:00',
      scheduled_delivery: '2024-01-18 15:30',
      distance: '12.1 km',
      delivery_fee: 300,
      payment_status: 'refunded',
      cancellation_reason: 'Beneficiario no disponible'
    }
  ]

  const statuses = {
    all: 'Todos',
    pending: 'Pendiente',
    accepted: 'Aceptado',
    picked_up: 'Recogido',
    in_transit: 'En Tránsito',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', class: 'bg-gray-100 text-gray-800', icon: Clock },
      accepted: { label: 'Aceptado', class: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      picked_up: { label: 'Recogido', class: 'bg-indigo-100 text-indigo-800', icon: Package },
      in_transit: { label: 'En Tránsito', class: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800', icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { label: 'Urgente', class: 'bg-red-100 text-red-800' },
      high: { label: 'Alta', class: 'bg-orange-100 text-orange-800' },
      normal: { label: 'Normal', class: 'bg-gray-100 text-gray-800' },
      low: { label: 'Baja', class: 'bg-blue-100 text-blue-800' }
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          delivery.donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          delivery.beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Entregas</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona y rastrea las entregas de donaciones
              </p>
            </div>

            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Truck className="h-4 w-4 mr-2" />
              Nueva Entrega
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">En Tránsito</dt>
                    <dd className="text-2xl font-semibold text-gray-900">12</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Entregadas Hoy</dt>
                    <dd className="text-2xl font-semibold text-gray-900">8</dd>
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
                    <dd className="text-2xl font-semibold text-gray-900">5</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Route className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Km Recorridos</dt>
                    <dd className="text-2xl font-semibold text-gray-900">234</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Ingresos</dt>
                    <dd className="text-2xl font-semibold text-gray-900">$4,850</dd>
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
                    placeholder="Buscar por número de seguimiento, donación..."
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {Object.entries(statuses).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Más Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDeliveries.map((delivery) => (
              <li key={delivery.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={delivery.donation.image}
                        alt=""
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {delivery.donation.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Tracking: {delivery.tracking_number}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPriorityBadge(delivery.priority)}
                            {getStatusBadge(delivery.status)}
                          </div>
                        </div>

                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex sm:space-x-6">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {delivery.donor.location} → {delivery.beneficiary.location}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Route className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {delivery.distance}
                            </div>
                            {delivery.driver && (
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {delivery.driver.name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tracking Updates for In Transit */}
                        {delivery.status === 'in_transit' && delivery.tracking_updates && (
                          <div className="mt-3 bg-blue-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-900 mb-2">
                              Actualizaciones de Seguimiento
                            </p>
                            <div className="space-y-1">
                              {delivery.tracking_updates.slice(-2).map((update, index) => (
                                <div key={index} className="flex items-center text-xs text-blue-700">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className="font-medium mr-2">{update.time}</span>
                                  <span>{update.status}</span>
                                  {update.location && (
                                    <span className="ml-1 text-blue-600">• {update.location}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Beneficiary Feedback for Delivered */}
                        {delivery.status === 'delivered' && delivery.beneficiary_rating && (
                          <div className="mt-3 bg-green-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < delivery.beneficiary_rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-600">
                                  {delivery.beneficiary_feedback}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(delivery.scheduled_delivery).toLocaleDateString('es-DO')}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              RD${delivery.delivery_fee}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              delivery.payment_status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : delivery.payment_status === 'refunded'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {delivery.payment_status === 'paid' ? 'Pagado' :
                               delivery.payment_status === 'refunded' ? 'Reembolsado' : 'Pendiente'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                              Ver Detalles
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-500">
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}