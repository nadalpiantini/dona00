'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Heart, Truck, Users, Shield, MapPin, Package, ChevronRight, Menu, X } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: Heart,
      title: 'Donación Fácil',
      description: 'Publica tus donaciones en minutos y conecta con quienes más lo necesitan.',
    },
    {
      icon: Truck,
      title: 'Entrega Segura',
      description: 'Red de transporte confiable para llevar las donaciones a su destino.',
    },
    {
      icon: MapPin,
      title: 'Centros de Acopio',
      description: 'Múltiples puntos de recolección distribuidos estratégicamente.',
    },
    {
      icon: Users,
      title: 'Comunidad Solidaria',
      description: 'Miles de donantes y beneficiarios conectados en una sola plataforma.',
    },
    {
      icon: Shield,
      title: 'Verificación Segura',
      description: 'Todos los participantes son verificados para garantizar transparencia.',
    },
    {
      icon: Package,
      title: 'Seguimiento en Tiempo Real',
      description: 'Rastrea tus donaciones desde la recolección hasta la entrega.',
    },
  ]

  const stats = [
    { number: '10,000+', label: 'Donaciones Realizadas' },
    { number: '5,000+', label: 'Familias Beneficiadas' },
    { number: '50+', label: 'Empresas de Transporte' },
    { number: '100+', label: 'Centros de Acopio' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">DONA+</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Características
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                Cómo Funciona
              </Link>
              <Link href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors">
                Impacto
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link
                href="#features"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link
                href="#stats"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Impacto
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Conectando <span className="text-blue-600">Solidaridad</span> con{' '}
              <span className="text-blue-600">Logística</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              DONA+ es la plataforma que une a donantes, beneficiarios y empresas de transporte
              para hacer llegar ayuda a quienes más lo necesitan de manera eficiente y transparente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Comenzar Ahora
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ver Cómo Funciona
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <Image
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=600&fit=crop"
              alt="Donaciones y solidaridad"
              width={1200}
              height={600}
              className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para donar y recibir
            </h2>
            <p className="text-lg text-gray-600">
              Una plataforma completa diseñada para facilitar el proceso de donación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona DONA+?
            </h2>
            <p className="text-lg text-gray-600">
              Un proceso simple y transparente en 4 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Publica tu donación',
                description: 'Sube fotos y detalles de lo que deseas donar',
              },
              {
                step: '2',
                title: 'Encuentra beneficiario',
                description: 'Conecta con personas u organizaciones que necesitan tu ayuda',
              },
              {
                step: '3',
                title: 'Coordina la entrega',
                description: 'Elige entre entrega directa o a través de nuestros centros de acopio',
              },
              {
                step: '4',
                title: 'Completa la donación',
                description: 'Rastrea tu donación hasta confirmar que llegó a su destino',
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestro Impacto
            </h2>
            <p className="text-lg text-blue-100">
              Juntos estamos construyendo una República Dominicana más solidaria
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¿Listo para hacer la diferencia?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a miles de dominicanos que ya están transformando vidas a través de DONA+
          </p>
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrarse Gratis
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">DONA+</span>
              </div>
              <p className="text-gray-400">
                Conectando solidaridad con logística para un mejor futuro.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">Acerca de</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">Cómo Funciona</Link></li>
                <li><Link href="/centers" className="hover:text-white">Centros de Acopio</Link></li>
                <li><Link href="/partners" className="hover:text-white">Empresas Asociadas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Centro de Ayuda</Link></li>
                <li><Link href="/faq" className="hover:text-white">Preguntas Frecuentes</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contacto</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-white">Términos de Uso</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Política de Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DONA+. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}