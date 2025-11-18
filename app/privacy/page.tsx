import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">DONA+</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
            <p className="text-gray-600 mt-2">Última actualización: {new Date().toLocaleDateString('es-DO')}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-700 mb-4">
                En DONA+, recopilamos información que nos ayuda a proporcionar y mejorar nuestros servicios. 
                Esta información incluye:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Información de cuenta (nombre, correo electrónico, teléfono)</li>
                <li>Información de donaciones y entregas</li>
                <li>Datos de navegación y uso de la plataforma</li>
                <li>Información de dispositivos y conexión</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cómo Usamos tu Información</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Gestionar donaciones y entregas</li>
                <li>Comunicarnos contigo sobre tu cuenta y actividades</li>
                <li>Mejorar y personalizar tu experiencia</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Compartir Información</h2>
              <p className="text-gray-700 mb-4">
                No vendemos tu información personal. Podemos compartir información en las siguientes situaciones:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Con organizaciones beneficiarias para coordinar entregas</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Seguridad de Datos</h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información 
                personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Tus Derechos</h2>
              <p className="text-gray-700 mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia. 
                Puedes gestionar tus preferencias de cookies en la configuración de tu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cambios a esta Política</h2>
              <p className="text-gray-700 mb-4">
                Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos de 
                cualquier cambio significativo publicando la nueva política en esta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través 
                de la plataforma o en la sección de configuración de tu cuenta.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

