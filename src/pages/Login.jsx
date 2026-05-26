/* ./pasanaq/src/pages/Login.jsx: */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabase"
import toast from "react-hot-toast"

export default function Login() {

  const [isRegister, setIsRegister] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleAuth(event) {

    event.preventDefault()

    if (isRegister) {

      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      navigate("/dashboard")

    } else {

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        toast.error(error.message)
        return
      }

      navigate("/dashboard")
    }
  }

  async function handleGoogleLogin() {

    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  return (

    <div className="min-h-screen bg-light flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-petroleum">
            Pasanaq
          </h1>

          <p className="text-dark mt-2">
            Ahorro comunitario moderno
          </p>

        </div>

        <form
          onSubmit={handleAuth}
          className="space-y-5"
        >

          <div>

            <label className="block text-dark mb-2">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                border
                border-silver
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-fintech
              "
            />

          </div>

          <div>

            <label className="block text-dark mb-2">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                border
                border-silver
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-fintech
              "
            />

          </div>

          <button
            type="submit"
            className="
              w-full
              bg-savings
              hover:opacity-90
              text-white
              font-semibold
              py-3
              rounded-xl
              transition
            "
          >
            {isRegister
              ? "Crear cuenta"
              : "Iniciar sesión"}
          </button>

          {/*<button
            type="button"
            onClick={handleGoogleLogin}
            className="
              w-full
              border
              border-silver
              text-dark
              py-3
              rounded-xl
              hover:bg-gray-50
              transition
            "
          >
            Continuar con Google
          </button>
          */}

        </form>

        <div className="mt-6 text-center">

          <button
            onClick={() =>
              setIsRegister(!isRegister)
            }
            className="
              text-fintech
              font-medium
            "
          >
            {isRegister
              ? "Ya tengo cuenta"
              : "Crear una cuenta"}
          </button>

        </div>

      </div>

    </div>
  )
}
