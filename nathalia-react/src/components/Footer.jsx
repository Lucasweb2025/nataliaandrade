import { Link } from 'react-router-dom'
import { PHONE_DISPLAY, ADDRESS, HOURS_LABEL, waLink } from '../lib/constants'

export default function Footer() {
  return (
    <footer className="marble-dark text-white">
      <div className="gold-separator" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
          <div>
            <p className="font-serif text-xl tracking-[0.2em] uppercase">Nathalia Andrade</p>
            <p className="text-[10px] text-rose-gold font-semibold uppercase tracking-[0.25em] mt-1.5">Salão de Beleza</p>
          </div>
          <div className="text-[11px] text-warm-gray-light space-y-2 leading-relaxed">
            <p>{ADDRESS}</p>
            <p>{HOURS_LABEL}</p>
            <nav className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
              <a href="/#servicos" className="hover:text-rose-gold transition-colors">Serviços</a>
              <Link to="/agenda" className="hover:text-rose-gold transition-colors">Agendar</Link>
              <a href="/#localizacao" className="hover:text-rose-gold transition-colors">Local</a>
            </nav>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <a
              href={waLink('Olá! Gostaria de mais informações.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.15em] hover:text-gold transition-colors"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-[10px] text-warm-gray tracking-wider">
            Desenvolvido por{' '}
            <a href="https://github.com/lucasweb2025" target="_blank" rel="noopener noreferrer" className="text-warm-gray-light hover:text-white transition-colors">
              L.A Custom
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
