/* ./pasanaq/src/pages/Dashboard.jsx: */

import { useAuth } from "../context/AuthContext"
import CreatePasanaqForm from "../components/CreatePasanaqForm"
import PasanaqList from "../components/PasanaqList"
export default function Dashboard() {

  const { user, logout } = useAuth()

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold text-petroleum">

        Bienvenido a Pasanaq

      </h1>

      <p className="mt-4 text-dark">

        {user?.email}

      </p>

      <button
        onClick={logout}
        className="
          mt-6
          bg-savings
          text-white
          px-6
          py-3
          rounded-xl
        "
      >
        Cerrar sesión
      </button>
      <div className="mt-10">
        <CreatePasanaqForm />
      </div>
      <br></br>
      <h2 className="text-3xl font-bold text-petroleum">
        Mis pasanakus:
      </h2>
      <br></br>
      <div>
        <PasanaqList />
      </div>

    </div>
  )
}

