'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await fetchProfile(user.id)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('dona_users')
      .select('*, organization:dona_organizations(*)')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
  }

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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      toast.error(authError.message || 'Error al crear la cuenta')
      throw authError
    }

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('dona_users')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          phone: phone || null,
          role: 'donor',
        })

      if (profileError) {
        toast.error('Error al crear el perfil de usuario')
        throw profileError
      }
    }

    toast.success('¡Cuenta creada exitosamente!')
    router.push('/dashboard')
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