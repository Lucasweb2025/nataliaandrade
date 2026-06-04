import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, authEnabled } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen marble-bg flex items-center justify-center">
        <p className="text-sm text-warm-gray font-medium">Carregando...</p>
      </div>
    )
  }

  if (!authEnabled) {
    return (
      <div className="min-h-screen marble-bg flex items-center justify-center px-6">
        <p className="text-sm text-warm-gray text-center max-w-md">
          Login indisponivel: configure Supabase no ambiente de producao.
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
