'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types/database.types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: SupabaseUser | null
  profile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('dona_users')
        .select('*, organization:dona_organizations(*)')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      } else if (error) {
        // Only log in development, and only if it's not a "not found" error (which is normal for new users)
        if (process.env.NODE_ENV === 'development' && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching profile:', err)
      }
    }
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (!mounted) return

        // AuthSessionMissingError is normal when user is not logged in
        // Silently handle all session-related errors - they're expected
        if (error) {
          // Check if it's a session missing error (normal state)
          const isSessionMissing = 
            error.message?.toLowerCase().includes('session') || 
            error.message?.toLowerCase().includes('auth session') ||
            error.name === 'AuthSessionMissingError' ||
            error.status === 401 ||
            error.message?.includes('JWT')
          
          // Never log session missing errors - they're completely normal
          // Only log unexpected errors in development
          if (!isSessionMissing && process.env.NODE_ENV === 'development') {
            console.error('Error getting user:', error)
          }
          
          // In development, create a mock user if no real user exists
          if (isSessionMissing && process.env.NODE_ENV === 'development') {
            const mockUser = {
              id: 'dev-mock-user-id',
              email: 'dev@dona.local',
              created_at: new Date().toISOString(),
            } as SupabaseUser
            
            const mockProfile: User = {
              id: 'dev-mock-user-id',
              email: 'dev@dona.local',
              full_name: 'Usuario Demo',
              role: 'org_admin',
              is_active: true,
              is_verified: true,
              created_at: new Date().toISOString(),
            }
            
            setUser(mockUser)
            setProfile(mockProfile)
            if (mounted) {
              setLoading(false)
            }
            return
          }
          
          // Set user to null and stop loading regardless of error type
          setUser(null)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        setUser(user)
        if (user) {
          await fetchProfile(user.id)
        } else if (process.env.NODE_ENV === 'development') {
          // In development, create a mock user if no real user exists
          const mockUser = {
            id: 'dev-mock-user-id',
            email: 'dev@dona.local',
            created_at: new Date().toISOString(),
          } as SupabaseUser
          
          const mockProfile: User = {
            id: 'dev-mock-user-id',
            email: 'dev@dona.local',
            full_name: 'Usuario Demo',
            role: 'org_admin',
            is_active: true,
            is_verified: true,
            created_at: new Date().toISOString(),
          }
          
          setUser(mockUser)
          setProfile(mockProfile)
        }
        if (mounted) {
          setLoading(false)
        }
      } catch (err) {
        if (!mounted) return
        // Check if it's a session missing error
        const error = err as Error & { name?: string; message?: string; status?: number }
        const isSessionMissing = 
          error.message?.toLowerCase().includes('session') || 
          error.message?.toLowerCase().includes('auth session') ||
          error.name === 'AuthSessionMissingError' ||
          error.status === 401 ||
          error.message?.includes('JWT')
        
        // Never log session missing errors
        if (!isSessionMissing && process.env.NODE_ENV === 'development') {
          console.error('Error in getUser:', err)
        }
        
        // In development, create a mock user if no real user exists
        if (isSessionMissing && process.env.NODE_ENV === 'development') {
          const mockUser = {
            id: 'dev-mock-user-id',
            email: 'dev@dona.local',
            created_at: new Date().toISOString(),
          } as SupabaseUser
          
          const mockProfile: User = {
            id: 'dev-mock-user-id',
            email: 'dev@dona.local',
            full_name: 'Usuario Demo',
            role: 'org_admin',
            is_active: true,
            is_verified: true,
            created_at: new Date().toISOString(),
          }
          
          setUser(mockUser)
          setProfile(mockProfile)
          if (mounted) {
            setLoading(false)
          }
          return
        }
        
        // Set user to null on any error
        setUser(null)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          // In development, create a mock user if no real user exists
          if (process.env.NODE_ENV === 'development') {
            const mockUser = {
              id: 'dev-mock-user-id',
              email: 'dev@dona.local',
              created_at: new Date().toISOString(),
            } as SupabaseUser
            
            const mockProfile: User = {
              id: 'dev-mock-user-id',
              email: 'dev@dona.local',
              full_name: 'Usuario Demo',
              role: 'org_admin',
              is_active: true,
              is_verified: true,
              created_at: new Date().toISOString(),
            }
            
            setUser(mockUser)
            setProfile(mockProfile)
          } else {
            setProfile(null)
          }
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signIn = async (email: string, password: string) => {
    try {
      // Validate Supabase configuration before attempting login
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        const errorMsg = 'Error de configuración: Variables de entorno de Supabase no encontradas'
        if (process.env.NODE_ENV === 'development') {
          console.error('Missing Supabase env vars:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
        }
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Log detailed error in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('SignIn error:', {
            message: error.message,
            status: error.status,
            name: error.name,
            supabaseUrl: supabaseUrl ? 'configured' : 'missing',
            anonKey: supabaseAnonKey ? 'configured' : 'missing',
          })
        }
        
        // Provide user-friendly error messages
        let errorMessage = 'Error al iniciar sesión'
        const errorMsgLower = error.message?.toLowerCase() || ''
        
        if (error.status === 401) {
          // Check for specific error messages from Supabase
          if (errorMsgLower.includes('email not confirmed') || errorMsgLower.includes('email_not_confirmed')) {
            errorMessage = 'Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
          } else if (errorMsgLower.includes('invalid login credentials') || errorMsgLower.includes('invalid_credentials')) {
            errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
          } else if (errorMsgLower.includes('user not found')) {
            errorMessage = 'No existe una cuenta con este email. ¿Quieres registrarte?'
          } else {
            errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
          }
        } else if (error.status === 400) {
          errorMessage = error.message || 'Datos inválidos. Verifica tu email y contraseña.'
        } else if (error.status === 429) {
          errorMessage = 'Demasiados intentos. Por favor intenta más tarde.'
        } else {
          errorMessage = error.message || 'Error al iniciar sesión. Por favor intenta de nuevo.'
        }
        
        toast.error(errorMessage)
        throw error
      }

      toast.success('¡Bienvenido de vuelta!')
      router.push('/dashboard')
    } catch (err) {
      // Re-throw to let caller handle it
      throw err
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      // Verify Supabase client is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        const errorMsg = 'Error de configuración: Variables de entorno de Supabase no encontradas'
        if (process.env.NODE_ENV === 'development') {
          console.error('Missing Supabase env vars:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
        }
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (authError) {
        // Log detailed error in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('Signup auth error:', {
            message: authError.message,
            status: authError.status,
            name: authError.name,
            supabaseUrl: supabaseUrl ? 'configured' : 'missing',
            anonKey: supabaseAnonKey ? 'configured' : 'missing',
          })
        }
        
        // Provide user-friendly error messages
        let errorMessage = 'Error al crear la cuenta'
        if (authError.status === 401) {
          errorMessage = 'Error de autenticación. Verifica que las credenciales de Supabase estén correctas.'
        } else if (authError.status === 422) {
          errorMessage = authError.message || 'Datos inválidos. Verifica tu email y contraseña.'
        } else if (authError.status === 429) {
          errorMessage = 'Demasiados intentos. Por favor intenta más tarde.'
        } else {
          errorMessage = authError.message || 'Error al crear la cuenta. Por favor intenta de nuevo.'
        }
        
        toast.error(errorMessage)
        throw authError
      }

      // Step 2: Create user profile if user was created
      if (authData.user) {
        // Wait a bit to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Get current session to ensure we have auth context
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session && process.env.NODE_ENV === 'development') {
          console.warn('No session after signup, user may need email confirmation')
        }

        // Create user profile
        const { data: profileData, error: profileError } = await supabase
          .from('dona_users')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            phone: phone || null,
            role: 'donor',
          })
          .select()
          .single()

        if (profileError) {
          // Log detailed error
          if (process.env.NODE_ENV === 'development') {
            console.error('Profile creation error:', {
              message: profileError.message,
              code: profileError.code,
              details: profileError.details,
              hint: profileError.hint,
            })
          }
          
          // If profile creation fails, try to clean up auth user
          // (Note: We can't delete auth users from client, but we log it)
          const errorMessage = profileError.message || 'Error al crear el perfil de usuario'
          toast.error(errorMessage)
          throw profileError
        }

        // Update local state if profile was created
        if (profileData) {
          setProfile(profileData)
        }
      }

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        toast.success('¡Cuenta creada! Por favor verifica tu correo electrónico para activar tu cuenta.')
        router.push('/login')
        return
      }

      toast.success('¡Cuenta creada exitosamente!')
      router.push('/dashboard')
    } catch (err) {
      // Re-throw to let caller handle it
      throw err
    }
  }

  const signOut = async () => {
    // In development with mock user, just clear state
    if (process.env.NODE_ENV === 'development' && user?.id === 'dev-mock-user-id') {
      setUser(null)
      setProfile(null)
      toast.success('Sesión cerrada exitosamente')
      router.push('/')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error al cerrar sesión')
      throw error
    }

    setUser(null)
    setProfile(null)
    toast.success('Sesión cerrada exitosamente')
    router.push('/')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      toast.error('No hay usuario autenticado')
      throw new Error('No user logged in')
    }

    const { data, error } = await supabase
      .from('dona_users')
      .update(updates)
      .eq('id', user.id)
      .select('*, organization:dona_organizations(*)')
      .single()

    if (error) {
      toast.error('Error al actualizar el perfil')
      throw error
    }

    setProfile(data)
    toast.success('Perfil actualizado exitosamente')
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}