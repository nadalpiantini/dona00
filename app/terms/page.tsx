import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones de Uso</h1>
            <p className="text-gray-600 mt-2">Última actualización: {new Date().toLocaleDateString('es-DO')}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-700 mb-4">
                Al acceder y utilizar DONA+, aceptas cumplir con estos términos y condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-700 mb-4">
                DONA+ es una plataforma que conecta donantes con organizaciones beneficiarias, 
                facilitando la gestión de donaciones y entregas. El servicio incluye:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Registro y gestión de donaciones</li>
                <li>Coordinación de entregas</li>
                <li>Comunicación entre donantes y beneficiarios</li>
                <li>Reportes y seguimiento de actividades</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cuenta de Usuario</h2>
              <p className="text-gray-700 mb-4">
                Para usar DONA+, debes crear una cuenta proporcionando información precisa y actualizada. 
                Eres responsable de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Mantener la confidencialidad de tu contraseña</li>
                <li>Todas las actividades que ocurran bajo tu cuenta</li>
                <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
                <li>Proporcionar información veraz y actualizada</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Uso Aceptable</h2>
              <p className="text-gray-700 mb-4">
                Te comprometes a usar DONA+ de manera legal y ética. Está prohibido:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Usar el servicio para actividades ilegales</li>
                <li>Intentar acceder a áreas restringidas del sistema</li>
                <li>Interferir con el funcionamiento del servicio</li>
                <li>Publicar información falsa o engañosa</li>
                <li>Violar derechos de propiedad intelectual</li>
                <li>Harassment o comportamiento abusivo hacia otros usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Donaciones y Entregas</h2>
              <p className="text-gray-700 mb-4">
                DONA+ facilita la conexión entre donantes y beneficiarios, pero:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>No garantizamos la calidad o condición de las donaciones</li>
                <li>No somos responsables por el contenido de las donaciones</li>
                <li>Los donantes y beneficiarios son responsables de coordinar entregas</li>
                <li>Debes cumplir con todas las leyes aplicables al realizar donaciones</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Propiedad Intelectual</h2>
              <p className="text-gray-700 mb-4">
                Todo el contenido de DONA+, incluyendo diseño, texto, gráficos y código, es propiedad 
                de DONA+ o sus licenciantes y está protegido por leyes de propiedad intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-gray-700 mb-4">
                DONA+ se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. No seremos responsables por:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Daños indirectos, incidentales o consecuentes</li>
                <li>Pérdida de datos o información</li>
                <li>Interrupciones del servicio</li>
                <li>Disputas entre donantes y beneficiarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Modificaciones del Servicio</h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del 
                servicio en cualquier momento, con o sin previo aviso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Terminación</h2>
              <p className="text-gray-700 mb-4">
                Podemos terminar o suspender tu cuenta inmediatamente, sin previo aviso, si violas 
                estos términos o por cualquier otra razón a nuestra discreción.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Ley Aplicable</h2>
              <p className="text-gray-700 mb-4">
                Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa 
                será resuelta en los tribunales competentes de la República Dominicana.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Cambios a los Términos</h2>
              <p className="text-gray-700 mb-4">
                Podemos actualizar estos términos ocasionalmente. Los cambios entrarán en vigor cuando 
                se publiquen en esta página. Te recomendamos revisar estos términos periódicamente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre estos términos, puedes contactarnos a través de la plataforma 
                o en la sección de configuración de tu cuenta.
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

