import { Link, useLocation } from 'react-router-dom'

const LOGO_URL = 'https://i.ibb.co/z0mCqFy/logosemfundo.png'

export default function Navbar() {
  const { hash } = useLocation()

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gold/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src={LOGO_URL}
            alt="Nathalia Andrade"
            className="h-14 sm:h-16 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block' }}
          />
          <span className="hidden font-serif text-sm tracking-[0.2em] uppercase text-charcoal" style={{ display: 'none' }}>
            Nathalia Andrade
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-gray">
          <a href="#servicos" className="hover:text-rose-gold transition-colors duration-300">Servicos</a>
          <a href="#sobre" className="hover:text-rose-gold transition-colors duration-300">Sobre</a>
          <a href="#localizacao" className="hover:text-rose-gold transition-colors duration-300">Local</a>
        </div>

        <Link
          to="/agenda"
          className="btn-luxury shrink-0 px-6 py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]"
        >
          Agendar
        </Link>
      </div>
    </nav>
  )
}
