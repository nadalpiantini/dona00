'use client'

import { useState } from 'react'
import {
  TrendingUp, Users, Package, Truck,
  Calendar, Download, RefreshCw, ChevronUp, ChevronDown,
  DollarSign, Clock, Award,
  FileText, Share2
} from 'lucide-react'

type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'custom'
type ChartType = 'line' | 'bar' | 'pie' | 'area'

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [selectedMetric, setSelectedMetric] = useState('donations')
  const [compareMode, setCompareMode] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock data for charts
  const donationTrends = [
    { month: 'Ene', donations: 45, deliveries: 38, beneficiaries: 125 },
    { month: 'Feb', donations: 52, deliveries: 44, beneficiaries: 142 },
    { month: 'Mar', donations: 48, deliveries: 40, beneficiaries: 138 },
    { month: 'Abr', donations: 61, deliveries: 55, beneficiaries: 165 },
    { month: 'May', donations: 67, deliveries: 60, beneficiaries: 178 },
    { month: 'Jun', donations: 72, deliveries: 65, beneficiaries: 195 },
    { month: 'Jul', donations: 78, deliveries: 70, beneficiaries: 210 },
    { month: 'Ago', donations: 85, deliveries: 78, beneficiaries: 225 },
    { month: 'Sep', donations: 92, deliveries: 85, beneficiaries: 245 },
    { month: 'Oct', donations: 98, deliveries: 90, beneficiaries: 260 },
    { month: 'Nov', donations: 105, deliveries: 95, beneficiaries: 275 },
    { month: 'Dic', donations: 112, deliveries: 102, beneficiaries: 290 }
  ]

  const categoryDistribution = [
    { category: 'Alimentos', value: 35, color: '#3B82F6' },
    { category: 'Ropa', value: 25, color: '#10B981' },
    { category: 'Medicinas', value: 15, color: '#F59E0B' },
    { category: 'Juguetes', value: 10, color: '#EF4444' },
    { category: 'Muebles', value: 8, color: '#8B5CF6' },
    { category: 'Otros', value: 7, color: '#6B7280' }
  ]

  const topDonors = [
    { name: 'Empresa ABC', donations: 45, value: 'RD$ 250,000' },
    { name: 'Fundación XYZ', donations: 38, value: 'RD$ 180,000' },
    { name: 'María González', donations: 32, value: 'RD$ 95,000' },
    { name: 'Juan Pérez', donations: 28, value: 'RD$ 87,000' },
    { name: 'Supermercado Nacional', donations: 25, value: 'RD$ 125,000' }
  ]

  const centerPerformance = [
    { name: 'Centro San José', donations: 145, efficiency: 92 },
    { name: 'Centro Los Alcarrizos', donations: 132, efficiency: 88 },
    { name: 'Centro Herrera', donations: 118, efficiency: 85 },
    { name: 'Centro Villa Mella', donations: 98, efficiency: 78 },
    { name: 'Centro Santiago', donations: 87, efficiency: 82 }
  ]

  const deliveryMetrics = {
    totalDeliveries: 892,
    onTimeRate: 94.5,
    averageTime: '2.5 días',
    satisfactionRate: 4.7,
    costPerDelivery: 'RD$ 450'
  }

  const beneficiaryImpact = {
    totalBeneficiaries: 1250,
    familiesHelped: 320,
    childrenReached: 485,
    eldersSupported: 156,
    monthlyGrowth: 12.5
  }

  const kpis = [
    {
      title: 'Total Donaciones',
      value: '892',
      change: '+15.2%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500',
      description: 'vs mes anterior'
    },
    {
      title: 'Beneficiarios Alcanzados',
      value: '1,250',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
      description: 'personas ayudadas'
    },
    {
      title: 'Valor Total Donado',
      value: 'RD$ 2.5M',
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-purple-500',
      description: 'valor estimado'
    },
    {
      title: 'Tasa de Entrega',
      value: '94.5%',
      change: '+2.1%',
      trend: 'up',
      icon: Truck,
      color: 'bg-orange-500',
      description: 'entregas exitosas'
    },
    {
      title: 'Tiempo Promedio',
      value: '2.5 días',
      change: '-0.5 días',
      trend: 'down',
      icon: Clock,
      color: 'bg-indigo-500',
      description: 'hasta entrega'
    },
    {
      title: 'Satisfacción',
      value: '4.7/5',
      change: '+0.2',
      trend: 'up',
      icon: Award,
      color: 'bg-pink-500',
      description: 'calificación promedio'
    }
  ]

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`)
  }

  const renderLineChart = (data: any[]) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.donations, d.deliveries, d.beneficiaries)))
    return (
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex justify-center space-x-1">
                <div
                  className="w-2 bg-blue-500 rounded-t"
                  style={{ height: `${(item.donations / maxValue) * 200}px` }}
                />
                <div
                  className="w-2 bg-green-500 rounded-t"
                  style={{ height: `${(item.deliveries / maxValue) * 200}px` }}
                />
                <div
                  className="w-2 bg-purple-500 rounded-t"
                  style={{ height: `${(item.beneficiaries / maxValue) * 200}px` }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-2">{item.month.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{maxValue / 2}</span>
          <span>0</span>
        </div>
      </div>
    )
  }

  const renderPieChart = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0

    return (
      <div className="relative h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage} ${100 - percentage}`
              const strokeDashoffset = -cumulativePercentage
              cumulativePercentage += percentage

              return (
                <circle
                  key={index}
                  cx="50%"
                  cy="50%"
                  r="40%"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20%"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{total}%</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="ml-8">
          {data.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.category}</span>
              <span className="ml-2 text-sm font-medium text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
              <p className="mt-1 text-sm text-gray-600">
                Visualiza el impacto y rendimiento de las donaciones
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              <div className="relative">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm font-medium">
                <Share2 className="h-4 w-4 mr-1" />
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                {(['week', 'month', 'quarter', 'year'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      timeRange === range
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {range === 'week' && 'Semana'}
                    {range === 'month' && 'Mes'}
                    {range === 'quarter' && 'Trimestre'}
                    {range === 'year' && 'Año'}
                  </button>
                ))}
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Personalizado
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compareMode}
                    onChange={(e) => setCompareMode(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Comparar períodos</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white shadow rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`${kpi.color} rounded-lg p-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className={`flex items-center text-xs ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.title}</p>
                <p className="text-xs text-gray-400">{kpi.description}</p>
              </div>
            )
          })}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Donation Trends Chart */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tendencias de Donaciones</h3>
              <p className="text-sm text-gray-500">Donaciones, entregas y beneficiarios por mes</p>
            </div>
            <div className="p-6">
              {renderLineChart(donationTrends)}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Donaciones</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Entregas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Beneficiarios</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Distribución por Categoría</h3>
              <p className="text-sm text-gray-500">Tipos de donaciones más frecuentes</p>
            </div>
            <div className="p-6">
              {renderPieChart(categoryDistribution)}
            </div>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Donors */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Donantes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topDonors.map((donor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{donor.name}</p>
                        <p className="text-xs text-gray-500">{donor.donations} donaciones</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{donor.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Performance */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Rendimiento de Centros</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {centerPerformance.map((center, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{center.name}</p>
                      <p className="text-sm text-gray-500">{center.donations}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${center.efficiency}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Eficiencia: {center.efficiency}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Metrics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Métricas de Entrega</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Entregas</span>
                <span className="text-sm font-medium text-gray-900">{deliveryMetrics.totalDeliveries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasa a Tiempo</span>
                <span className="text-sm font-medium text-green-600">{deliveryMetrics.onTimeRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo Promedio</span>
                <span className="text-sm font-medium text-gray-900">{deliveryMetrics.averageTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfacción</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{deliveryMetrics.satisfactionRate}</span>
                  <span className="text-yellow-400 ml-1">★</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Costo/Entrega</span>
                <span className="text-sm font-medium text-gray-900">{deliveryMetrics.costPerDelivery}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Impacto en Beneficiarios</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{beneficiaryImpact.totalBeneficiaries}</div>
                <p className="text-sm text-gray-500 mt-1">Total Beneficiarios</p>
                <div className="flex items-center justify-center mt-2 text-green-600 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+{beneficiaryImpact.monthlyGrowth}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{beneficiaryImpact.familiesHelped}</div>
                <p className="text-sm text-gray-500 mt-1">Familias Ayudadas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{beneficiaryImpact.childrenReached}</div>
                <p className="text-sm text-gray-500 mt-1">Niños Alcanzados</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{beneficiaryImpact.eldersSupported}</div>
                <p className="text-sm text-gray-500 mt-1">Adultos Mayores</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">92%</div>
                <p className="text-sm text-gray-500 mt-1">Satisfacción General</p>
              </div>
            </div>

            {/* Success Stories */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">Historias de Éxito Recientes</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    "Gracias a DONA+ pudimos equipar completamente nuestra escuela con materiales educativos."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Centro Educativo Esperanza</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    "Las donaciones de alimentos han sido vitales para nuestras 25 familias residentes."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Hogar Santa Ana</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    "La plataforma nos permite conectar donantes con necesitados de manera eficiente."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">- Voluntarios San José</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleString('es-DO')}
          </p>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FileText className="h-4 w-4 inline-block mr-1" />
              Generar Informe Detallado
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              <Calendar className="h-4 w-4 inline-block mr-1" />
              Programar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}