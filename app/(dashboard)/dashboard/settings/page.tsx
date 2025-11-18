'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import {
  User, Bell, Shield, Palette, Globe, CreditCard, Users,
  Mail, Phone, MapPin, Camera, Save, Check, X, AlertCircle,
  Key, Smartphone, Monitor, Moon, Sun, ChevronRight,
  Package, Truck, Heart, FileText, Download, Upload,
  HelpCircle, ExternalLink, ToggleLeft, ToggleRight
} from 'lucide-react'

type TabType = 'profile' | 'notifications' | 'security' | 'appearance' | 'organization' | 'billing' | 'integrations'

export default function SettingsPage() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || 'Usuario Demo',
    email: profile?.email || 'demo@dona.do',
    phone: '+1 809-555-0100',
    address: 'Santo Domingo, República Dominicana',
    bio: 'Apasionado por ayudar a mi comunidad a través de donaciones.',
    avatar: 'https://i.pravatar.cc/150?u=demo'
  })

  const [notifications, setNotifications] = useState({
    email: {
      newDonation: true,
      claimedDonation: true,
      deliveryUpdate: true,
      weeklyReport: false,
      marketing: false
    },
    push: {
      newDonation: true,
      claimedDonation: true,
      deliveryUpdate: true,
      messages: true
    },
    sms: {
      urgentOnly: true,
      deliveryConfirmation: false
    }
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    apiAccess: false,
    sessions: [
      { id: 1, device: 'Chrome - Windows', location: 'Santo Domingo', lastActive: '2 minutos' },
      { id: 2, device: 'Safari - iPhone', location: 'Santiago', lastActive: '1 hora' },
      { id: 3, device: 'Firefox - Mac', location: 'Santo Domingo', lastActive: '3 días' }
    ]
  })

  const [appearance, setAppearance] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    language: 'es',
    dateFormat: 'DD/MM/YYYY',
    currency: 'DOP'
  })

  const [organization, setOrganization] = useState({
    name: 'Transportes Rápidos SRL',
    type: 'transport_company',
    ruc: '123456789',
    address: 'Av. Winston Churchill #123',
    phone: '+1 809-555-0200',
    website: 'https://transportesrapidos.do',
    logo: 'https://i.pravatar.cc/150?u=company'
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1500)
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Perfil', icon: User },
    { id: 'notifications' as TabType, label: 'Notificaciones', icon: Bell },
    { id: 'security' as TabType, label: 'Seguridad', icon: Shield },
    { id: 'appearance' as TabType, label: 'Apariencia', icon: Palette },
    { id: 'organization' as TabType, label: 'Organización', icon: Users },
    { id: 'billing' as TabType, label: 'Facturación', icon: CreditCard },
    { id: 'integrations' as TabType, label: 'Integraciones', icon: Package }
  ]

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra tu cuenta y preferencias de la plataforma
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Información Personal</h2>

                  {/* Avatar */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto de Perfil
                    </label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={profileData.avatar}
                        alt="Avatar"
                        className="h-20 w-20 rounded-full"
                      />
                      <div>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <Camera className="h-4 w-4 inline-block mr-1" />
                          Cambiar Foto
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Biografía
                      </label>
                      <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Cuéntanos sobre ti..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Preferencias de Notificación</h2>

                  {/* Email Notifications */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      <Mail className="h-5 w-5 inline-block mr-2" />
                      Notificaciones por Email
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.email).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {key === 'newDonation' && 'Nueva donación publicada'}
                            {key === 'claimedDonation' && 'Donación reclamada'}
                            {key === 'deliveryUpdate' && 'Actualización de entrega'}
                            {key === 'weeklyReport' && 'Reporte semanal'}
                            {key === 'marketing' && 'Comunicaciones y ofertas'}
                          </span>
                          <button
                            onClick={() => setNotifications({
                              ...notifications,
                              email: { ...notifications.email, [key]: !value }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      <Smartphone className="h-5 w-5 inline-block mr-2" />
                      Notificaciones Push
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.push).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {key === 'newDonation' && 'Nueva donación publicada'}
                            {key === 'claimedDonation' && 'Donación reclamada'}
                            {key === 'deliveryUpdate' && 'Actualización de entrega'}
                            {key === 'messages' && 'Mensajes directos'}
                          </span>
                          <button
                            onClick={() => setNotifications({
                              ...notifications,
                              push: { ...notifications.push, [key]: !value }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      <Phone className="h-5 w-5 inline-block mr-2" />
                      Notificaciones SMS
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(notifications.sms).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {key === 'urgentOnly' && 'Solo notificaciones urgentes'}
                            {key === 'deliveryConfirmation' && 'Confirmación de entrega'}
                          </span>
                          <button
                            onClick={() => setNotifications({
                              ...notifications,
                              sms: { ...notifications.sms, [key]: !value }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Seguridad de la Cuenta</h2>

                  {/* Password */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Contraseña</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-700">Contraseña actual</p>
                        <p className="text-xs text-gray-500">Última actualización hace 3 meses</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Cambiar Contraseña
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Autenticación de Dos Factores</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-700">Protege tu cuenta con 2FA</p>
                        <p className="text-xs text-gray-500">
                          {security.twoFactor ? 'Activado' : 'Desactivado'}
                        </p>
                      </div>
                      <button
                        onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          security.twoFactor
                            ? 'border border-red-300 text-red-700 bg-white hover:bg-red-50'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {security.twoFactor ? 'Desactivar' : 'Activar'} 2FA
                      </button>
                    </div>
                  </div>

                  {/* Login Alerts */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Alertas de Inicio de Sesión</h3>
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-700">Recibir alertas de nuevos inicios de sesión</p>
                        <p className="text-xs text-gray-500">Te notificaremos de accesos desde nuevos dispositivos</p>
                      </div>
                      <button
                        onClick={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  </div>

                  {/* Active Sessions */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Sesiones Activas</h3>
                    <div className="space-y-3">
                      {security.sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Monitor className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-700">{session.device}</p>
                              <p className="text-xs text-gray-500">
                                {session.location} • Activo hace {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {session.id !== 1 && (
                            <button className="text-sm text-red-600 hover:text-red-700">
                              Cerrar Sesión
                            </button>
                          )}
                          {session.id === 1 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Sesión Actual
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Apariencia y Preferencias</h2>

                  {/* Theme */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Tema</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setAppearance({ ...appearance, theme: theme as any })}
                          className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                            appearance.theme === theme
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {theme === 'light' && <Sun className="h-8 w-8 text-yellow-500" />}
                          {theme === 'dark' && <Moon className="h-8 w-8 text-gray-700" />}
                          {theme === 'auto' && (
                            <div className="flex">
                              <Sun className="h-8 w-8 text-yellow-500 -mr-2" />
                              <Moon className="h-8 w-8 text-gray-700" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {theme === 'light' && 'Claro'}
                            {theme === 'dark' && 'Oscuro'}
                            {theme === 'auto' && 'Automático'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Idioma</h3>
                    <select
                      value={appearance.language}
                      onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Formato de Fecha</h3>
                    <select
                      value={appearance.dateFormat}
                      onChange={(e) => setAppearance({ ...appearance, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Moneda</h3>
                    <select
                      value={appearance.currency}
                      onChange={(e) => setAppearance({ ...appearance, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DOP">DOP - Peso Dominicano</option>
                      <option value="USD">USD - Dólar Estadounidense</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Organization Tab */}
              {activeTab === 'organization' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Información de la Organización</h2>

                  {/* Logo */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo de la Empresa
                    </label>
                    <div className="flex items-center space-x-4">
                      <img
                        src={organization.logo}
                        alt="Logo"
                        className="h-20 w-20 rounded-lg border border-gray-200"
                      />
                      <div>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <Upload className="h-4 w-4 inline-block mr-1" />
                          Cambiar Logo
                        </button>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG. Max 2MB. Recomendado 200x200px</p>
                      </div>
                    </div>
                  </div>

                  {/* Organization Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la Empresa
                      </label>
                      <input
                        type="text"
                        value={organization.name}
                        onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        RNC/RUC
                      </label>
                      <input
                        type="text"
                        value={organization.ruc}
                        onChange={(e) => setOrganization({ ...organization, ruc: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={organization.phone}
                        onChange={(e) => setOrganization({ ...organization, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        value={organization.website}
                        onChange={(e) => setOrganization({ ...organization, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={organization.address}
                        onChange={(e) => setOrganization({ ...organization, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Organización
                      </label>
                      <select
                        value={organization.type}
                        onChange={(e) => setOrganization({ ...organization, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="transport_company">Empresa de Transporte</option>
                        <option value="ngo">ONG</option>
                        <option value="foundation">Fundación</option>
                        <option value="business">Empresa</option>
                        <option value="government">Gobierno</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Facturación y Suscripción</h2>

                  {/* Current Plan */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Plan Actual</h3>
                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Plan Profesional</h4>
                          <p className="text-sm text-gray-600">RD$ 2,999 / mes</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          Activo
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700 mb-4">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Donaciones ilimitadas
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          5 conductores incluidos
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Reportes avanzados
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          Soporte prioritario
                        </li>
                      </ul>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                          Actualizar Plan
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Cancelar Suscripción
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Método de Pago</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-700">Visa terminada en 4242</p>
                            <p className="text-xs text-gray-500">Expira 12/2025</p>
                          </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Editar
                        </button>
                      </div>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        + Agregar Método de Pago
                      </button>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Historial de Facturación</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Fecha
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Descripción
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Monto
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Estado
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Factura
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-3 py-3 text-sm text-gray-900">18 Ene 2024</td>
                            <td className="px-3 py-3 text-sm text-gray-900">Plan Profesional</td>
                            <td className="px-3 py-3 text-sm text-gray-900">RD$ 2,999</td>
                            <td className="px-3 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Pagado
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Download className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-3 text-sm text-gray-900">18 Dic 2023</td>
                            <td className="px-3 py-3 text-sm text-gray-900">Plan Profesional</td>
                            <td className="px-3 py-3 text-sm text-gray-900">RD$ 2,999</td>
                            <td className="px-3 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Pagado
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Download className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Integraciones</h2>

                  <div className="space-y-4">
                    {/* WhatsApp */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">WhatsApp Business</h4>
                          <p className="text-sm text-gray-500">Recibe notificaciones en WhatsApp</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                        Conectar
                      </button>
                    </div>

                    {/* Google Calendar */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Google Calendar</h4>
                          <p className="text-sm text-gray-500">Sincroniza entregas con tu calendario</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Conectado</span>
                    </div>

                    {/* API Access */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Key className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">API Access</h4>
                          <p className="text-sm text-gray-500">Integra con tu sistema</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Generar API Key
                      </button>
                    </div>

                    {/* Export Data */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Exportar Datos</h4>
                          <p className="text-sm text-gray-500">Descarga todos tus datos</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Exportar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div>
                  {saved && (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-2" />
                      <span className="text-sm">Cambios guardados exitosamente</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">¿Necesitas ayuda?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Consulta nuestra documentación o contacta con soporte
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                <FileText className="h-4 w-4 inline-block mr-1" />
                Documentación
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                <Mail className="h-4 w-4 inline-block mr-1" />
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}