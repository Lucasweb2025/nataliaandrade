import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { usePostHog } from '@posthog/react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const posthog = usePostHog()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) {
        posthog?.identify(data.session.user.id, { email: data.session.user.email })
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [posthog])

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase nao configurado')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setSession(data.session)
    posthog?.identify(data.session.user.id, { email: data.session.user.email })
    return data.session
  }

  const signOut = async () => {
    posthog?.reset()
    if (supabase) await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signIn,
        signOut,
        isAuthenticated: Boolean(session),
        authEnabled: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
