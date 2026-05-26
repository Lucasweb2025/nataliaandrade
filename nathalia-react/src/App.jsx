import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Agenda from './pages/Agenda'
import Painel from './pages/Painel'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  return (
    <HashRouter>
      <WhatsAppButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/painel" element={<Painel />} />
      </Routes>
    </HashRouter>
  )
}
