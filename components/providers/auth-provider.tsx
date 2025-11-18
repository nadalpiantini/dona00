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
        // Only log actual errors, not missing session errors
        if (error) {
          // Check if it's a session missing error (normal state)
          const isSessionMissing = error.message?.includes('session') || 
                                   error.message?.includes('Session') ||
                                   error.name === 'AuthSessionMissingError'
          
          if (!isSessionMissing) {
            // Only log non-session errors
            if (process.env.NODE_ENV === 'development') {
              console.error('Error getting user:', error)
            }
          }
          // Set user to null and stop loading regardless of error type
          setUser(null)
          setLoading(false)
          return
        }

        setUser(user)
        if (user) {
          await fetchProfile(user.id)
        }
      } catch (err) {
        if (!mounted) return
        // Check if it's a session missing error
        const error = err as Error
        const isSessionMissing = error.message?.includes('session') || 
                                 error.message?.includes('Session') ||
                                 error.name === 'AuthSessionMissingError'
        
        if (!isSessionMissing && process.env.NODE_ENV === 'development') {
          console.error('Error in getUser:', err)
        }
        // Set user to null on any error
        setUser(null)
      } finally {
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
          setProfile(null)
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message || 'Error al iniciar sesión')
      throw error
    }

    toast.success('¡Bienvenido de vuelta!')
    router.push('/dashboard')
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        // Check if it's a 401 or network error
        const errorMessage = authError.message || 'Error al crear la cuenta'
        
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Signup auth error:', {
            message: authError.message,
            status: authError.status,
            name: authError.name,
          })
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