'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import {
  Package, Users, Truck, MapPin, TrendingUp, TrendingDown,
  Heart, Clock, CheckCircle, AlertCircle, ChevronRight, Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { profile } = useAuth()

  const stats = [
    {
      title: 'Total Donaciones',
      value: '142',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Beneficiarios Activos',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Entregas Completadas',
      value: '67',
      change: '+18%',
      trend: 'up',
      icon: Truck,
      color: 'bg-purple-500',
    },
    {
      title: 'Centros de Acopio',
      value: '12',
      change: '0%',
      trend: 'neutral',
      icon: MapPin,
      color: 'bg-orange-500',
    },
  ]

  const recentDonations = [
    {
      id: 1,
      title: 'Ropa de Niños',
      donor: 'María González',
      status: 'published',
      date: '2024-01-18',
      image: 'https://images.unsplash.com/photo-1594213261338-5a6876cd2f36?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      title: 'Alimentos No Perecederos',
      donor: 'Juan Pérez',
      status: 'claimed',
      date: '2024-01-17',
      image: 'https://images.unsplash.com/photo-1609003040241-02456c0c7d72?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      title: 'Juguetes Educativos',
      donor: 'Ana Rodríguez',
      status: 'delivered',
      date: '2024-01-16',
      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      title: 'Muebles de Hogar',
      donor: 'Carlos Martínez',
      status: 'in_transit',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
    },
  ]

  const upcomingDeliveries = [
    {
      id: 1,
      donation: 'Ropa de Invierno',
      beneficiary: 'Centro Comunitario San José',
      scheduledDate: '2024-01-20',
      driver: 'Pedro Sánchez',
      status: 'scheduled',
    },
    {
      id: 2,
      donation: 'Material Escolar',
      beneficiary: 'Escuela Primaria Los Alcarrizos',
      scheduledDate: '2024-01-21',
      driver: 'Luis García',
      status: 'scheduled',
    },
    {
      id: 3,
      donation: 'Alimentos Básicos',
      beneficiary: 'Hogar de Ancianos Santa Ana',
      scheduledDate: '2024-01-22',
      driver: 'Miguel Herrera',
      status: 'scheduled',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Publicado', class: 'bg-blue-100 text-blue-800' },
      claimed: { label: 'Reclamado', class: 'bg-yellow-100 text-yellow-800' },
      in_transit: { label: 'En Tránsito', class: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
      scheduled: { label: 'Programado', class: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.published

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {profile?.full_name?.split(' ')[0] || 'Usuario'}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Aquí está el resumen de tu actividad en DONA+
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd>
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center text-sm">
                      {stat.trend === 'up' ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">{stat.change}</span>
                          <span className="text-gray-500 ml-1">vs último mes</span>
                        </>
                      ) : stat.trend === 'down' ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600 font-medium">{stat.change}</span>
                          <span className="text-gray-500 ml-1">vs último mes</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-600 font-medium">{stat.change}</span>
                          <span className="text-gray-500 ml-1">sin cambios</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Donations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Donaciones Recientes</h2>
                <Link
                  href="/dashboard/donations"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={donation.image}
                      alt={donation.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {donation.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Por {donation.donor}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(donation.date).toLocaleDateString('es-DO')}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(donation.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deliveries */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Próximas Entregas</h2>
                <Link
                  href="/dashboard/deliveries"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  Ver todas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {delivery.donation}
                      </p>
                      <p className="text-sm text-gray-500">
                        Para: {delivery.beneficiary}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(delivery.scheduledDate).toLocaleDateString('es-DO')}
                        <span className="mx-2">•</span>
                        Conductor: {delivery.driver}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard/donations/new"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nueva Donación</p>
                <p className="text-xs text-gray-500">Publica un artículo para donar</p>
              </div>
            </Link>

            <Link
              href="/dashboard/centers"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <MapPin className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Buscar Centro</p>
                <p className="text-xs text-gray-500">Encuentra centros de acopio</p>
              </div>
            </Link>

            <Link
              href="/dashboard/beneficiaries"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ver Beneficiarios</p>
                <p className="text-xs text-gray-500">Conoce a quienes ayudas</p>
              </div>
            </Link>

            <Link
              href="/dashboard/reports"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ver Reportes</p>
                <p className="text-xs text-gray-500">Analiza tu impacto</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}