import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'

const LOGO_URL = 'https://i.ibb.co/z0mCqFy/logosemfundo.png'
const STORAGE_KEY = 'na-agendamentos'

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function whatsappLink(phone, name, service, date, time) {
  const digits = phone.replace(/\D/g, '')
  const msg = encodeURIComponent(`Ola! Sou ${name}. Agendei ${service} para ${date} as ${time}.`)
  return `https://wa.me/55${digits}?text=${msg}`
}

const SERVICES_LIST = [
  { category: 'Cabelo', items: ['Progressivas', 'Selagem Termica', 'Botox Capilar'] },
  { category: 'Estetica', items: ['Manicure & Pedicure', 'Design de Sobrancelhas', 'Sobrancelhas com Henna'] },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Painel() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        setBookings(raw ? JSON.parse(raw) : [])
      } catch { setBookings([]) }
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const today = dateKey(new Date())
  const todayList = bookings
    .filter(b => b.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="flex min-h-screen flex-col lg:flex-row marble-bg">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gold/10 flex-col justify-between p-8 shrink-0">
        <div>
          <div className="mb-10">
            <img src={LOGO_URL} alt="Nathalia Andrade" className="w-full max-w-[180px] h-auto" />
          </div>
          <nav className="space-y-1.5">
            <Link
              to="/painel"
              className="flex items-center gap-3 px-5 py-3 rounded-full text-xs font-semibold btn-luxury"
            >
              <span className="opacity-70">01.</span> Painel
            </Link>
            <Link
              to="/agenda"
              className="flex items-center gap-3 px-5 py-3 rounded-full text-xs font-medium text-warm-gray hover:bg-marble-warm transition-colors"
            >
              <span className="opacity-40">02.</span> Agenda / Agendar
            </Link>
          </nav>
        </div>
        <div className="pt-6 border-t border-gold/10">
          <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-1.5">Atelie de Beleza</p>
          <p className="text-[11px] font-medium text-charcoal leading-relaxed">
            Rua Julio Frank, 111 A<br />
            <span className="text-warm-gray">Parque Arariba, SP</span>
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gold/10 sticky top-0 z-30">
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <Link to="/agenda" className="shrink-0 btn-luxury px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Agendar
          </Link>
          <img src={LOGO_URL} alt="Nathalia Andrade" className="h-14 sm:h-16 w-auto object-contain" />
          <span className="w-[72px] shrink-0" />
        </div>
        <nav className="flex gap-2 px-5 pb-3 overflow-x-auto">
          <Link to="/painel" className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold btn-luxury">
            Painel
          </Link>
          <Link to="/agenda" className="shrink-0 px-4 py-2 rounded-full text-xs font-medium text-warm-gray bg-marble-warm">
            Agenda
          </Link>
        </nav>
      </header>

      <div className="flex-1 flex flex-col min-w-0 safe-bottom lg:pb-0">
        {/* Desktop header */}
        <header className="hidden lg:flex bg-white/80 backdrop-blur-xl border-b border-gold/10 py-5 px-8 items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.2em]">Painel da Nathalia</span>
            <h1 className="text-lg font-semibold text-charcoal tracking-wide">Dashboard de Atendimento</h1>
          </div>
          <Link to="/agenda" className="btn-luxury px-6 py-2.5 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase">
            Agendar
          </Link>
        </header>

        <main className="p-5 sm:p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">
          <div className="lg:hidden">
            <span className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.2em]">Painel</span>
            <h1 className="text-lg font-semibold text-charcoal">Agendamentos de hoje</h1>
          </div>

          {/* Stats cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-6">
              <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-3">Agendamentos hoje</p>
              <p className="text-2xl font-light text-charcoal">
                {todayList.length} <span className="text-sm text-warm-gray-light">Hoje</span>
              </p>
              <p className="text-[10px] text-warm-gray mt-2">Atualizado em tempo real</p>
            </motion.div>

            <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-6">
              <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-3">Link para clientes</p>
              <Link to="/agenda" className="text-sm font-semibold text-rose-gold hover:text-rose-gold-dark transition-colors">
                Abrir pagina de agendamento
              </Link>
              <p className="text-[10px] text-warm-gray mt-2">Envie este link no WhatsApp</p>
            </motion.div>

            <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
              <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-3">Horario de funcionamento</p>
              <p className="text-sm font-medium text-charcoal">Terca a Sabado</p>
              <p className="text-sm text-warm-gray">9h as 18h</p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Today's appointments */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h2 className="font-serif text-xl text-charcoal tracking-wide">Agenda de Hoje</h2>
                <Link to="/agenda" className="text-[11px] font-semibold text-rose-gold uppercase border-b border-rose-gold/30 hover:border-rose-gold self-start transition-colors">
                  Abrir calendario completo
                </Link>
              </div>

              {todayList.length === 0 ? (
                <div className="card-luxury rounded-2xl p-8 text-center">
                  <p className="text-sm text-warm-gray mb-3">Nenhum agendamento hoje.</p>
                  <Link to="/agenda" className="text-rose-gold font-semibold text-sm hover:text-rose-gold-dark transition-colors">
                    Compartilhar link de agendamento
                  </Link>
                </div>
              ) : (
                <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
                  {todayList.map(b => (
                    <motion.div
                      key={b.id}
                      variants={fadeUp}
                      className="card-luxury rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-center gap-5 min-w-0">
                        <div className="text-center border-r border-gold/10 pr-5 shrink-0">
                          <p className="text-sm font-bold text-charcoal">{b.time}</p>
                          <p className="text-[10px] text-warm-gray font-medium">
                            {parseInt(b.time) >= 12 ? 'PM' : 'AM'}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-charcoal truncate">{b.name}</p>
                          <p className="text-[11px] text-rose-gold font-medium truncate">{b.service}</p>
                          {b.phone && <p className="text-[10px] text-warm-gray mt-0.5">{b.phone}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="w-2 h-2 rounded-full bg-rose-gold" />
                        {b.phone && (
                          <a
                            href={whatsappLink(b.phone, b.name, b.service, b.date, b.time)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full hover:bg-emerald-100 transition-colors"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Services sidebar */}
            <ScrollReveal>
              <div className="marble-dark rounded-2xl p-7 text-white border border-gold/10">
                <h2 className="font-serif text-xl sm:text-2xl mb-6 tracking-wide">
                  Servicos <span className="text-rose-gold italic">Signature</span>
                </h2>
                <div className="space-y-6 text-[11px] font-light tracking-wide">
                  {SERVICES_LIST.map(cat => (
                    <div key={cat.category}>
                      <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-[0.3em] mb-3">{cat.category}</p>
                      <ul className="space-y-2.5">
                        {cat.items.map(item => (
                          <li key={item} className="flex justify-between gap-2 border-b border-white/5 pb-2.5">
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-[10px] text-center text-warm-gray italic font-serif tracking-wider">
                  Realcando sua beleza natural com excelencia.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Location mobile */}
          <section className="lg:hidden card-luxury rounded-2xl p-6">
            <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-2">Localizacao</p>
            <p className="text-sm font-semibold text-charcoal">Rua Julio Frank, 111 A</p>
            <p className="text-sm text-warm-gray">Parque Arariba, SP</p>
          </section>
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gold/10 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around">
        <Link to="/painel" className="flex flex-col items-center gap-1 px-3 py-2 text-rose-gold min-w-0">
          <span className="text-[9px] font-semibold uppercase tracking-wider">Painel</span>
        </Link>
        <Link to="/agenda" className="flex flex-col items-center gap-1 px-3 py-2 text-warm-gray min-w-0">
          <span className="text-[9px] font-semibold uppercase tracking-wider">Agendar</span>
        </Link>
        <Link to="/agenda" className="flex flex-col items-center gap-1 py-2 btn-luxury rounded-xl px-4 min-w-0 text-white">
          <span className="text-[9px] font-semibold uppercase tracking-wider">Novo</span>
        </Link>
      </nav>
    </div>
  )
}
