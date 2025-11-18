import Link from 'next/link'
import { Heart, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
          <p className="text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>

          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Ir al Dashboard
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Si crees que esto es un error, por favor contacta a soporte.</p>
        </div>
      </div>
    </div>
  )
}

