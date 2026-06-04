import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../lib/nav'

const LINKS = [...NAV_LINKS, { to: '/agenda', label: 'Agendar', primary: true }]

export default function MobileNav({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.nav
            className="fixed top-0 right-0 z-[70] h-full w-[min(100%,320px)] bg-white shadow-2xl border-l border-gold/15 flex flex-col sm:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-gold/10">
              <span className="font-serif text-sm tracking-[0.15em] uppercase text-charcoal">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-gold/20 text-warm-gray hover:text-charcoal transition-colors"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-1 p-5">
              {LINKS.map((link) =>
                link.primary ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className="btn-luxury text-center py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] mt-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className="py-4 px-4 text-sm font-semibold text-charcoal border-b border-gold/8 hover:text-rose-gold transition-colors uppercase tracking-[0.12em]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
