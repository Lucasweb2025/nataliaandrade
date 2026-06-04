import { HashRouter, useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Agenda from './pages/Agenda'
import Painel from './pages/Painel'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'

function AnimatedRoutes() {
  const location = useLocation()
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/agenda', element: <Agenda /> },
    { path: '/painel', element: <Painel /> },
  ])

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>{routes}</PageTransition>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <WhatsAppButton />
      <AnimatedRoutes />
    </HashRouter>
  )
}
