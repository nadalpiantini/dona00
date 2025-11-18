/**
 * Diagnostic utility to check Supabase configuration and connectivity
 * Can be called from browser console or used in development UI
 */

export interface DiagnosticResult {
  check: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

export async function diagnoseSupabase(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = []

  // Check 1: Environment Variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  results.push({
    check: 'Environment Variables',
    status: supabaseUrl && supabaseAnonKey ? 'pass' : 'fail',
    message: supabaseUrl && supabaseAnonKey
      ? 'Variables de entorno configuradas'
      : 'Faltan variables de entorno (NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY)',
    details: {
      url: supabaseUrl ? '✓ Configurado' : '✗ Faltante',
      anonKey: supabaseAnonKey ? '✓ Configurado' : '✗ Faltante',
    }
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    return results // Stop here if env vars are missing
  }

  // Check 2: Supabase URL Format
  const urlValid = supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')
  results.push({
    check: 'Supabase URL Format',
    status: urlValid ? 'pass' : 'fail',
    message: urlValid
      ? 'URL de Supabase tiene formato correcto'
      : 'URL de Supabase no tiene el formato esperado (debe ser https://*.supabase.co)',
    details: { url: supabaseUrl }
  })

  // Check 3: Anon Key Format
  const keyValid = supabaseAnonKey.length > 100 && supabaseAnonKey.startsWith('eyJ')
  results.push({
    check: 'Anon Key Format',
    status: keyValid ? 'pass' : 'warning',
    message: keyValid
      ? 'Anon Key tiene formato correcto (JWT)'
      : 'Anon Key puede tener formato incorrecto (debe ser un JWT)',
    details: { keyLength: supabaseAnonKey.length }
  })

  // Check 4: Network Connectivity
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    
    results.push({
      check: 'Network Connectivity',
      status: response.ok || response.status === 404 ? 'pass' : 'fail',
      message: response.ok || response.status === 404
        ? 'Conexión a Supabase exitosa'
        : `Error de conexión: ${response.status} ${response.statusText}`,
      details: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }
    })
  } catch (error) {
    results.push({
      check: 'Network Connectivity',
      status: 'fail',
      message: `Error de red: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    })
  }

  // Check 5: Auth Endpoint
  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey
      }
    })
    
    results.push({
      check: 'Auth Endpoint',
      status: authResponse.ok ? 'pass' : 'warning',
      message: authResponse.ok
        ? 'Endpoint de autenticación accesible'
        : `Endpoint de auth respondió con: ${authResponse.status}`,
      details: {
        status: authResponse.status,
        statusText: authResponse.statusText
      }
    })
  } catch (error) {
    results.push({
      check: 'Auth Endpoint',
      status: 'warning',
      message: `No se pudo verificar endpoint de auth: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    })
  }

  // Check 6: Client Initialization
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const client = createClient()
    
    results.push({
      check: 'Client Initialization',
      status: 'pass',
      message: 'Cliente de Supabase se inicializa correctamente',
      details: { clientType: typeof client }
    })

    // Check 7: Test Auth State
    try {
      const { data: { session }, error } = await client.auth.getSession()
      
      results.push({
        check: 'Current Session',
        status: error ? 'warning' : 'pass',
        message: session
          ? 'Sesión activa encontrada'
          : error
          ? `Error al obtener sesión: ${error.message}`
          : 'No hay sesión activa (normal si no estás logueado)',
        details: {
          hasSession: !!session,
          userId: session?.user?.id,
          error: error?.message
        }
      })
    } catch (error) {
      results.push({
        check: 'Current Session',
        status: 'warning',
        message: `Error al verificar sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        details: { error: error instanceof Error ? error.message : String(error) }
      })
    }
  } catch (error) {
    results.push({
      check: 'Client Initialization',
      status: 'fail',
      message: `Error al inicializar cliente: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      details: { error: error instanceof Error ? error.message : String(error) }
    })
  }

  return results
}

/**
 * Run diagnostics and log results to console
 */
export async function runDiagnostics() {
  console.group('🔍 Diagnóstico de Supabase')
  const results = await diagnoseSupabase()
  
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
    console.log(`${icon} ${result.check}: ${result.message}`)
    if (result.details) {
      console.log('   Detalles:', result.details)
    }
  })
  
  const failed = results.filter(r => r.status === 'fail')
  const warnings = results.filter(r => r.status === 'warning')
  
  console.log(`\n📊 Resumen: ${results.length - failed.length - warnings.length} pasaron, ${warnings.length} advertencias, ${failed.length} fallaron`)
  console.groupEnd()
  
  return results
}

