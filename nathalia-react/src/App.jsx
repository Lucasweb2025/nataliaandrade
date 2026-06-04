import { HashRouter, useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Galeria from './pages/Galeria'
import Sobre from './pages/Sobre'
import Local from './pages/Local'
import Agenda from './pages/Agenda'
import Painel from './pages/Painel'
import Login from './pages/Login'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'

function AnimatedRoutes() {
  const location = useLocation()
  const hideWhatsApp = location.pathname === '/login' || location.pathname === '/painel'

  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/servicos', element: <Servicos /> },
    { path: '/galeria', element: <Galeria /> },
    { path: '/sobre', element: <Sobre /> },
    { path: '/local', element: <Local /> },
    { path: '/agenda', element: <Agenda /> },
    { path: '/login', element: <Login /> },
    {
      path: '/painel',
      element: (
        <ProtectedRoute>
          <Painel />
        </ProtectedRoute>
      ),
    },
  ])

  return (
    <>
      {!hideWhatsApp && <WhatsAppButton />}
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>{routes}</PageTransition>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <AnimatedRoutes />
      </HashRouter>
    </AuthProvider>
  )
}
