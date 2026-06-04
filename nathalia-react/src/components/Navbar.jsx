import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LOGO_URL } from '../lib/constants'
import MobileNav from './MobileNav'

const NAV_LINKS = [
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#localizacao', label: 'Local' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-gold/15 shadow-sm py-3'
            : 'bg-white/80 backdrop-blur-xl border-gold/10 py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center min-w-0 shrink">
            <img
              src={LOGO_URL}
              alt="Nathalia Andrade"
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
              }`}
            />
          </Link>

          <div className="hidden sm:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-gray">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-rose-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/agenda"
              className="btn-luxury hidden sm:inline-flex px-6 py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]"
            >
              Agendar
            </Link>
            <button
              type="button"
              className="sm:hidden w-11 h-11 rounded-full border border-gold/25 text-charcoal flex flex-col items-center justify-center gap-1"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span className="w-4 h-0.5 bg-charcoal rounded-full" />
              <span className="w-4 h-0.5 bg-charcoal rounded-full" />
              <span className="w-3 h-0.5 bg-charcoal rounded-full" />
            </button>
          </div>
        </div>
      </nav>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
