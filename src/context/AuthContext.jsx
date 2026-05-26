// ./pasanaq/src/context/AuthContext.jsx:


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { supabase } from "../services/supabase"

const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function getSession() {

      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user ?? null)

      setLoading(false)
    }

    getSession()

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  async function logout() {

    await supabase.auth.signOut()
  }

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  return useContext(AuthContext)
}
