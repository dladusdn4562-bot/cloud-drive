import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL } })
  const signOut = () => supabase.auth.signOut()

  return { session, user: session?.user ?? null, loading, signIn, signUp, signOut }
}

export default useAuth
