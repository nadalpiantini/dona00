'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package, Plus, Search, Filter, Eye, Edit2, Trash2, Heart,
  Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight,
  Grid, List, Download, Upload, Share2, AlertCircle
} from 'lucide-react'

export default function DonationsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedDonations, setSelectedDonations] = useState<number[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [donationToDelete, setDonationToDelete] = useState<number | null>(null)

  // Mock data - en producción vendría de Supabase
  const donations = [
    {
      id: 1,
      title: 'Ropa de Niños - Tallas 4-8 años',
      description: 'Conjunto completo de ropa infantil en excelente estado. Incluye pantalones, camisas y zapatos.',
      category: 'Ropa y Calzado',
      quantity: 15,
      condition: 'like_new',
      status: 'published',
      images: ['https://images.unsplash.com/photo-1594213261338-5a6876cd2f36?w=400&h=300&fit=crop'],
      location: 'Santo Domingo Norte',
      donor: 'María González',
      created_at: '2024-01-18',
      views: 234,
      claims: 5,
      is_urgent: false,
    },
    {
      id: 2,
      title: 'Alimentos No Perecederos - 50kg',
      description: 'Arroz, habichuelas, aceite, azúcar y otros productos básicos.',
      category: 'Alimentos',
      quantity: 1,
      condition: 'new',
      status: 'claimed',
      images: ['https://images.unsplash.com/photo-1609003040241-02456c0c7d72?w=400&h=300&fit=crop'],
      location: 'Santiago',
      donor: 'Supermercado El Popular',
      beneficiary: 'Fundación Niños Felices',
      created_at: '2024-01-17',
      views: 567,
      claims: 12,
      is_urgent: true,
    },
    {
      id: 3,
      title: 'Juguetes Educativos para Primaria',
      description: 'Juegos didácticos, libros ilustrados y material educativo para niños de 6-10 años.',
      category: 'Juguetes',
      quantity: 30,
      condition: 'good',
      status: 'delivered',
      images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'],
      location: 'La Romana',
      donor: 'Ana Rodríguez',
      beneficiary: 'Escuela Primaria San José',
      created_at: '2024-01-16',
      delivered_at: '2024-01-19',
      views: 890,
      claims: 8,
      is_urgent: false,
    },
    {
      id: 4,
      title: 'Muebles de Oficina',
      description: 'Escritorios, sillas y archivadores en buen estado para oficina o estudio.',
      category: 'Muebles',
      quantity: 8,
      condition: 'good',
      status: 'published',
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'],
      location: 'San Cristóbal',
      donor: 'Empresa Tech Solutions',
      created_at: '2024-01-15',
      views: 123,
      claims: 2,
      is_urgent: false,
    },
    {
      id: 5,
      title: 'Material Escolar Completo',
      description: 'Mochilas, cuadernos, lápices, colores y útiles escolares nuevos.',
      category: 'Libros y Material Educativo',
      quantity: 50,
      condition: 'new',
      status: 'in_transit',
      images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop'],
      location: 'Puerto Plata',
      donor: 'Librería Nacional',
      beneficiary: 'Centro Comunitario Los Alcarrizos',
      created_at: '2024-01-14',
      views: 445,
      claims: 15,
      is_urgent: true,
    },
    {
      id: 6,
      title: 'Electrodomésticos del Hogar',
      description: 'Nevera, estufa y microondas funcionando perfectamente.',
      category: 'Electrodomésticos',
      quantity: 3,
      condition: 'good',
      status: 'published',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
      location: 'Santo Domingo Este',
      donor: 'Carlos Martínez',
      created_at: '2024-01-13',
      views: 678,
      claims: 9,
      is_urgent: false,
    }
  ]

  const categories = [
    'Todos',
    'Ropa y Calzado',
    'Alimentos',
    'Muebles',
    'Electrodomésticos',
    'Juguetes',
    'Libros y Material Educativo',
    'Artículos del Hogar',
    'Otros'
  ]

  const statuses = {
    all: 'Todos',
    published: 'Publicado',
    claimed: 'Reclamado',
    in_transit: 'En Tránsito',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Publicado', class: 'bg-blue-100 text-blue-800' },
      claimed: { label: 'Reclamado', class: 'bg-yellow-100 text-yellow-800' },
      in_transit: { label: 'En Tránsito', class: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.published

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getConditionLabel = (condition: string) => {
    const conditions = {
      new: 'Nuevo',
      like_new: 'Como Nuevo',
      good: 'Buen Estado',
      fair: 'Regular'
    }
    return conditions[condition as keyof typeof conditions] || condition
  }

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || donation.status === filterStatus
    const matchesCategory = filterCategory === 'all' || donation.category === filterCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSelectDonation = (id: number) => {
    setSelectedDonations(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedDonations.length === filteredDonations.length) {
      setSelectedDonations([])
    } else {
      setSelectedDonations(filteredDonations.map(d => d.id))
    }
  }

  const handleDeleteDonation = (id: number) => {
    setDonationToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // Aquí iría la lógica para eliminar de Supabase
    console.log('Deleting donation:', donationToDelete)
    setShowDeleteModal(false)
    setDonationToDelete(null)
  }

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
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Importar
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
                    <dd className="text-2xl font-semibold text-gray-900">1,234</dd>
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
                    <dd className="text-2xl font-semibold text-gray-900">456</dd>
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
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Entregadas</dt>
                    <dd className="text-2xl font-semibold text-gray-900">544</dd>
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
                    placeholder="Buscar donaciones..."
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

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">Todas las Categorías</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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

            {/* Selected Actions */}
            {selectedDonations.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 px-4 py-2 rounded-md">
                <span className="text-sm text-blue-700">
                  {selectedDonations.length} donacion(es) seleccionada(s)
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Publicar
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Archivar
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donations Grid/List */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    className="h-48 w-full object-cover"
                    src={donation.images[0]}
                    alt={donation.title}
                  />
                  {donation.is_urgent && (
                    <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Urgente
                    </span>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(donation.status)}
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
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {donation.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(donation.created_at).toLocaleDateString('es-DO')}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Cantidad: <span className="font-medium">{donation.quantity}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {getConditionLabel(donation.condition)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{donation.views}</span>
                      <Heart className="h-4 w-4 ml-2" />
                      <span>{donation.claims}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Share2 className="h-4 w-4" />
                      </button>
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
              {filteredDonations.map((donation) => (
                <li key={donation.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-16 w-16 rounded-lg object-cover" src={donation.images[0]} alt="" />
                        </div>
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
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {donation.location}
                            </span>
                            <span>Cantidad: {donation.quantity}</span>
                            <span>{getConditionLabel(donation.condition)}</span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {donation.views}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {donation.claims}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-5">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(donation.status)}
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Share2 className="h-5 w-5" />
                          </button>
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
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Anterior
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
                <span className="font-medium">97</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
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