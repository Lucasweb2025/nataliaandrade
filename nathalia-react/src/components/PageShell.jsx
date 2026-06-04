import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import PageHero from './PageHero'

export default function PageShell({ eyebrow, title, subtitle, heroExtra, children, showMobileCta = true }) {
  return (
    <div className="min-h-screen pb-20 sm:pb-0 flex flex-col">
      <Navbar />
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle}>
        {heroExtra}
      </PageHero>
      <main className="flex-1">{children}</main>
      <section className="marble-dark py-14 sm:py-16 border-t border-gold/10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-white mb-4 tracking-wide">Pronta para se cuidar?</h2>
          <p className="text-sm text-warm-gray-light mb-8 max-w-md mx-auto leading-relaxed">
            Escolha o serviço e reserve seu horário online.
          </p>
          <Link
            to="/agenda"
            className="bg-white hover:bg-marble-warm text-charcoal inline-block px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Agendar agora
          </Link>
        </div>
      </section>
      <Footer />
      {showMobileCta && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/90 backdrop-blur-xl border-t border-gold/15 safe-bottom">
          <Link
            to="/agenda"
            className="btn-luxury block w-full text-center py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]"
          >
            Agendar horário
          </Link>
        </div>
      )}
    </div>
  )
}
