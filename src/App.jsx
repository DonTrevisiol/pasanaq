// ./pasanaq/src/App.jsx:

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Login from "./pages/Login"

import PasanaqDetail from "./pages/PasanaqDetail"

import ProfilePage from "./pages/ProfilePage"

import InvitePage from "./pages/InvitePage"

import Dashboard from "./pages/Dashboard"

import { useAuth } from "./context/AuthContext"

function ProtectedRoute({ children }) {

  const { user, loading } = useAuth()

  if (loading) {

    return <p>Cargando...</p>
  }

  if (!user) {

    return <Navigate to="/" />
  }

  return children
}

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>

            <Dashboard />

          </ProtectedRoute>
        }
      />

      <Route
        path="/pasanaq/:id"
        element={
          <ProtectedRoute>

            <PasanaqDetail />

          </ProtectedRoute>
        }
      />

      <Route
        path="/invite/:token"
        element={<InvitePage />}
      />

      <Route
        path="/profile/:id"
        element={<ProfilePage />}
      />

    </Routes>
  )
}

export default App
