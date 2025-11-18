'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import {
  Search, Plus, Filter, Download, Upload, MoreVertical,
  MapPin, Phone, Mail, Calendar, Users, Heart, Package,
  TrendingUp, CheckCircle, Clock, AlertTriangle, Star,
  Edit, Trash2, Eye, FileText, Award, Shield, Home
} from 'lucide-react'

type Beneficiary = {
  id: string
  name: string
  type: 'individual' | 'family' | 'organization'
  status: 'active' | 'pending' | 'inactive' | 'verified'
  avatar?: string
  registrationDate: string
  lastActivity: string
  location: {
    address: string
    city: string
    coordinates?: { lat: number; lng: number }
  }
  contact: {
    phone: string
    email?: string
    preferredContact: 'phone' | 'email' | 'whatsapp'
  }
  demographics: {
    familySize?: number
    ages?: string
    specialNeeds?: string[]
    income?: 'low' | 'medium-low' | 'medium'
  }
  needs: {
    categories: string[]
    urgency: 'high' | 'medium' | 'low'
    notes?: string
  }
  history: {
    totalDonationsReceived: number
    lastDonationDate?: string
    preferredCategories?: string[]
  }
  verification: {
    isVerified: boolean
    verifiedBy?: string
    verificationDate?: string
    documents?: string[]
  }
  assignedCenter?: string
  rating?: number
  notes?: string
}

export default function BeneficiariesPage() {
  const { profile } = useAuth()
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null)

  useEffect(() => {
    // Load mock beneficiaries
    const mockBeneficiaries: Beneficiary[] = [
      {
        id: '1',
        name: 'Familia González',
        type: 'family',
        status: 'verified',
        avatar: 'https://i.pravatar.cc/150?u=fam1',
        registrationDate: '2024-01-05',
        lastActivity: '2024-01-18',
        location: {
          address: 'Calle 15 #234',
          city: 'Santo Domingo Este'
        },
        contact: {
          phone: '809-555-0101',
          email: 'gonzalez@email.com',
          preferredContact: 'whatsapp'
        },
        demographics: {
          familySize: 5,
          ages: '2 adultos, 3 niños (5-12 años)',
          specialNeeds: ['diabetes', 'alergias alimentarias'],
          income: 'low'
        },
        needs: {
          categories: ['alimentos', 'ropa infantil', 'medicinas'],
          urgency: 'high',
          notes: 'Necesitan insulina mensualmente'
        },
        history: {
          totalDonationsReceived: 12,
          lastDonationDate: '2024-01-15',
          preferredCategories: ['alimentos', 'medicinas']
        },
        verification: {
          isVerified: true,
          verifiedBy: 'Ana Martínez',
          verificationDate: '2024-01-05',
          documents: ['ID', 'Carta de residencia']
        },
        assignedCenter: 'Centro Comunitario San José',
        rating: 4.8,
        notes: 'Familia muy responsable, siempre agradecida'
      },
      {
        id: '2',
        name: 'María Rodríguez',
        type: 'individual',
        status: 'active',
        avatar: 'https://i.pravatar.cc/150?u=maria2',
        registrationDate: '2024-01-10',
        lastActivity: '2024-01-17',
        location: {
          address: 'Av. Independencia #567',
          city: 'Santo Domingo'
        },
        contact: {
          phone: '809-555-0102',
          preferredContact: 'phone'
        },
        demographics: {
          specialNeeds: ['movilidad reducida'],
          income: 'low'
        },
        needs: {
          categories: ['medicinas', 'alimentos', 'silla de ruedas'],
          urgency: 'medium',
          notes: 'Necesita asistencia para movilizarse'
        },
        history: {
          totalDonationsReceived: 8,
          lastDonationDate: '2024-01-17'
        },
        verification: {
          isVerified: false
        },
        rating: 4.5
      },
      {
        id: '3',
        name: 'Hogar de Ancianos Santa Ana',
        type: 'organization',
        status: 'verified',
        avatar: 'https://i.pravatar.cc/150?u=org1',
        registrationDate: '2023-12-01',
        lastActivity: '2024-01-19',
        location: {
          address: 'Calle Principal #89',
          city: 'Los Alcarrizos'
        },
        contact: {
          phone: '809-555-0103',
          email: 'hogarsantaana@org.do',
          preferredContact: 'email'
        },
        demographics: {
          familySize: 25,
          ages: 'Adultos mayores 65+',
          specialNeeds: ['medicinas crónicas', 'dietas especiales'],
          income: 'low'
        },
        needs: {
          categories: ['alimentos', 'medicinas', 'productos de higiene', 'ropa'],
          urgency: 'high',
          notes: 'Necesidades constantes por cantidad de residentes'
        },
        history: {
          totalDonationsReceived: 45,
          lastDonationDate: '2024-01-19',
          preferredCategories: ['alimentos', 'productos de higiene']
        },
        verification: {
          isVerified: true,
          verifiedBy: 'Sistema',
          verificationDate: '2023-12-01',
          documents: ['RNC', 'Certificación CONAPE']
        },
        assignedCenter: 'Centro de Acopio Los Alcarrizos',
        rating: 5.0,
        notes: 'Organización con 15 años de servicio comunitario'
      },
      {
        id: '4',
        name: 'Familia Pérez Santana',
        type: 'family',
        status: 'pending',
        avatar: 'https://i.pravatar.cc/150?u=fam2',
        registrationDate: '2024-01-18',
        lastActivity: '2024-01-18',
        location: {
          address: 'Residencial Las Flores',
          city: 'Santo Domingo Norte'
        },
        contact: {
          phone: '809-555-0104',
          email: 'perez.santana@email.com',
          preferredContact: 'whatsapp'
        },
        demographics: {
          familySize: 7,
          ages: '2 adultos, 5 niños (2-15 años)',
          income: 'low'
        },
        needs: {
          categories: ['alimentos', 'ropa', 'útiles escolares'],
          urgency: 'medium',
          notes: 'Padre desempleado recientemente'
        },
        history: {
          totalDonationsReceived: 0
        },
        verification: {
          isVerified: false
        }
      },
      {
        id: '5',
        name: 'Centro Educativo Esperanza',
        type: 'organization',
        status: 'verified',
        avatar: 'https://i.pravatar.cc/150?u=org2',
        registrationDate: '2024-01-02',
        lastActivity: '2024-01-16',
        location: {
          address: 'Calle Educación #45',
          city: 'Herrera'
        },
        contact: {
          phone: '809-555-0105',
          email: 'info@centroesperanza.edu.do',
          preferredContact: 'email'
        },
        demographics: {
          familySize: 120,
          ages: 'Niños 5-14 años',
          specialNeeds: ['material educativo', 'uniformes'],
          income: 'low'
        },
        needs: {
          categories: ['útiles escolares', 'libros', 'uniformes', 'computadoras'],
          urgency: 'high',
          notes: 'Inicio de clases próximo, necesitan materiales'
        },
        history: {
          totalDonationsReceived: 15,
          lastDonationDate: '2024-01-16',
          preferredCategories: ['útiles escolares', 'libros']
        },
        verification: {
          isVerified: true,
          verifiedBy: 'Ministerio de Educación',
          verificationDate: '2024-01-02',
          documents: ['Certificación MINERD']
        },
        assignedCenter: 'Centro de Acopio Herrera',
        rating: 4.9
      },
      {
        id: '6',
        name: 'Juan Carlos Méndez',
        type: 'individual',
        status: 'inactive',
        avatar: 'https://i.pravatar.cc/150?u=juan',
        registrationDate: '2023-11-15',
        lastActivity: '2023-12-20',
        location: {
          address: 'Barrio Nuevo #123',
          city: 'Santiago'
        },
        contact: {
          phone: '809-555-0106',
          preferredContact: 'phone'
        },
        demographics: {
          income: 'medium-low'
        },
        needs: {
          categories: ['empleo', 'capacitación'],
          urgency: 'low',
          notes: 'Encontró trabajo, ya no requiere asistencia regular'
        },
        history: {
          totalDonationsReceived: 3,
          lastDonationDate: '2023-12-20'
        },
        verification: {
          isVerified: true,
          verifiedBy: 'Sistema',
          verificationDate: '2023-11-15'
        },
        rating: 4.2
      }
    ]

    setBeneficiaries(mockBeneficiaries)
  }, [])

  const stats = {
    total: beneficiaries.length,
    verified: beneficiaries.filter(b => b.status === 'verified').length,
    active: beneficiaries.filter(b => b.status === 'active').length,
    highNeed: beneficiaries.filter(b => b.needs.urgency === 'high').length
  }

  const getStatusBadge = (status: Beneficiary['status']) => {
    const statusConfig = {
      verified: { label: 'Verificado', class: 'bg-green-100 text-green-800' },
      active: { label: 'Activo', class: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
      inactive: { label: 'Inactivo', class: 'bg-gray-100 text-gray-800' }
    }
    const config = statusConfig[status]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      high: { label: 'Alta', class: 'bg-red-100 text-red-800' },
      medium: { label: 'Media', class: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Baja', class: 'bg-green-100 text-green-800' }
    }
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig]
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getTypeBadge = (type: Beneficiary['type']) => {
    const typeConfig = {
      individual: { label: 'Individual', icon: <Users className="h-3 w-3" /> },
      family: { label: 'Familia', icon: <Home className="h-3 w-3" /> },
      organization: { label: 'Organización', icon: <Shield className="h-3 w-3" /> }
    }
    const config = typeConfig[type]
    return (
      <span className="inline-flex items-center space-x-1 text-xs text-gray-600">
        {config.icon}
        <span>{config.label}</span>
      </span>
    )
  }

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beneficiary.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beneficiary.needs.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || beneficiary.status === selectedStatus
    const matchesType = selectedType === 'all' || beneficiary.type === selectedType
    const matchesUrgency = selectedUrgency === 'all' || beneficiary.needs.urgency === selectedUrgency
    return matchesSearch && matchesStatus && matchesType && matchesUrgency
  })

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Beneficiarios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona y da seguimiento a las personas y organizaciones beneficiarias
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Beneficiarios
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.total}
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
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Verificados
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.verified}
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
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Activos
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.active}
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
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Necesidad Alta
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stats.highNeed}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, ciudad o necesidad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="verified">Verificados</option>
                  <option value="active">Activos</option>
                  <option value="pending">Pendientes</option>
                  <option value="inactive">Inactivos</option>
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="individual">Individuales</option>
                  <option value="family">Familias</option>
                  <option value="organization">Organizaciones</option>
                </select>

                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toda urgencia</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="h-4 w-4 inline-block mr-1" />
                  Importar
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 inline-block mr-1" />
                  Exportar
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiaries List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo / Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Necesidades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Historial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={beneficiary.avatar || 'https://i.pravatar.cc/150'}
                        alt={beneficiary.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {beneficiary.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {beneficiary.contact.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getTypeBadge(beneficiary.type)}
                      {getStatusBadge(beneficiary.status)}
                      {beneficiary.verification.isVerified && (
                        <div className="flex items-center text-xs text-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{beneficiary.location.city}</div>
                    <div className="text-sm text-gray-500">{beneficiary.location.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getUrgencyBadge(beneficiary.needs.urgency)}
                      <div className="flex flex-wrap gap-1">
                        {beneficiary.needs.categories.slice(0, 3).map((cat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {cat}
                          </span>
                        ))}
                        {beneficiary.needs.categories.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{beneficiary.needs.categories.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {beneficiary.history.totalDonationsReceived} donaciones
                    </div>
                    {beneficiary.history.lastDonationDate && (
                      <div className="text-sm text-gray-500">
                        Última: {new Date(beneficiary.history.lastDonationDate).toLocaleDateString('es-DO')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {beneficiary.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{beneficiary.rating}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBeneficiary(beneficiary)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {selectedBeneficiary && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedBeneficiary.avatar || 'https://i.pravatar.cc/150'}
                      alt={selectedBeneficiary.name}
                      className="h-16 w-16 rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedBeneficiary.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTypeBadge(selectedBeneficiary.type)}
                        {getStatusBadge(selectedBeneficiary.status)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBeneficiary(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Información de Contacto</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedBeneficiary.contact.phone}</span>
                      </div>
                      {selectedBeneficiary.contact.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{selectedBeneficiary.contact.email}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedBeneficiary.location.address}, {selectedBeneficiary.location.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Demografía</h3>
                    <div className="space-y-2 text-sm">
                      {selectedBeneficiary.demographics.familySize && (
                        <div>
                          <span className="font-medium">Tamaño familiar:</span> {selectedBeneficiary.demographics.familySize} personas
                        </div>
                      )}
                      {selectedBeneficiary.demographics.ages && (
                        <div>
                          <span className="font-medium">Edades:</span> {selectedBeneficiary.demographics.ages}
                        </div>
                      )}
                      {selectedBeneficiary.demographics.specialNeeds && (
                        <div>
                          <span className="font-medium">Necesidades especiales:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedBeneficiary.demographics.specialNeeds.map((need, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Needs */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Necesidades</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Urgencia:</span>
                        {getUrgencyBadge(selectedBeneficiary.needs.urgency)}
                      </div>
                      <div>
                        <span className="text-sm font-medium">Categorías:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBeneficiary.needs.categories.map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedBeneficiary.needs.notes && (
                        <div>
                          <span className="text-sm font-medium">Notas:</span>
                          <p className="text-sm text-gray-600 mt-1">{selectedBeneficiary.needs.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* History */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Historial</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Total donaciones recibidas:</span> {selectedBeneficiary.history.totalDonationsReceived}
                      </div>
                      {selectedBeneficiary.history.lastDonationDate && (
                        <div>
                          <span className="font-medium">Última donación:</span> {new Date(selectedBeneficiary.history.lastDonationDate).toLocaleDateString('es-DO')}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Registrado:</span> {new Date(selectedBeneficiary.registrationDate).toLocaleDateString('es-DO')}
                      </div>
                      <div>
                        <span className="font-medium">Última actividad:</span> {new Date(selectedBeneficiary.lastActivity).toLocaleDateString('es-DO')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBeneficiary.notes && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Notas</h3>
                    <p className="text-sm text-gray-600">{selectedBeneficiary.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FileText className="h-4 w-4 inline-block mr-1" />
                    Generar Reporte
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Package className="h-4 w-4 inline-block mr-1" />
                    Ver Donaciones
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                    <Heart className="h-4 w-4 inline-block mr-1" />
                    Asignar Donación
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