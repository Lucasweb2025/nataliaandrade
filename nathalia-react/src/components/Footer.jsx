import { Link } from 'react-router-dom'

const WA_LINK = 'https://wa.me/5511984270908'

export default function Footer() {
  return (
    <footer className="marble-dark text-white">
      <div className="gold-separator" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div>
            <p className="font-serif text-xl tracking-[0.2em] uppercase">Nathalia Andrade</p>
            <p className="text-[10px] text-rose-gold font-semibold uppercase tracking-[0.25em] mt-1.5">
              Salao de Beleza
            </p>
          </div>

          <div className="text-[11px] text-warm-gray-light space-y-1.5 leading-relaxed">
            <p>Rua Julio Frank, 111 A — Parque Arariba, SP</p>
            <p>Terca a Sabado, 9h as 18h</p>
          </div>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.15em] hover:text-gold transition-colors duration-300"
          >
            (11) 98427-0908
          </a>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-[10px] text-warm-gray tracking-wider">
            Desenvolvido por{' '}
            <a
              href="https://github.com/lucasweb2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-gray-light hover:text-white transition-colors duration-300"
            >
              L.A Custom
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
