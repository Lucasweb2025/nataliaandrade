import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import PanelScheduleForm from '../components/PanelScheduleForm'
import { LOGO_URL, HOURS_LABEL } from '../lib/constants'
import {
  fetchBookings,
  subscribeBookings,
  deleteBooking,
  isBlockedBooking,
  confirmationWhatsAppLink,
} from '../lib/bookings'
import { dateKey, formatDateKeyLabel, nextDaysKeys, parseDateKey } from '../lib/dates'

const AGENDA_PUBLIC_URL = `${window.location.origin}${import.meta.env.BASE_URL}#/agenda`

function whatsappChatLink(phone, name, service, date, time) {
  const digits = phone.replace(/\D/g, '')
  const msg = encodeURIComponent(`Olá! Sou ${name}. Agendei ${service} para ${date} às ${time}.`)
  return `https://wa.me/55${digits}?text=${msg}`
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

const NAV = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'semana', label: 'Próximos 7 dias' },
  { id: 'agendar', label: 'Agendar' },
  { id: 'bloquear', label: 'Bloquear' },
]

function BookingCard({ booking, onCancel, cancelling }) {
  const blocked = isBlockedBooking(booking)
  const confirmUrl = confirmationWhatsAppLink(booking)

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border ${
        blocked
          ? 'bg-amber-50/80 border-amber-200/60'
          : 'card-luxury'
      }`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className={`text-center border-r pr-5 shrink-0 ${blocked ? 'border-amber-200/60' : 'border-gold/10'}`}>
          <p className="text-sm font-bold text-charcoal">{booking.time}</p>
          <p className="text-[10px] text-warm-gray">{formatDateKeyLabel(booking.date)}</p>
        </div>
        <div className="min-w-0">
          {blocked ? (
            <>
              <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider mb-0.5">Bloqueado</p>
              <p className="text-sm font-semibold text-charcoal truncate">{booking.name}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-charcoal truncate">{booking.name}</p>
              <p className="text-[11px] text-rose-gold font-medium truncate">{booking.service}</p>
              {booking.phone && booking.phone !== '-' && (
                <p className="text-[10px] text-warm-gray mt-0.5">{booking.phone}</p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap justify-end">
        {!blocked && booking.phone && booking.phone !== '-' && (
          <>
            {confirmUrl && (
              <a
                href={confirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-wider text-rose-gold-dark bg-rose-gold-light/60 px-3 py-2 rounded-full hover:bg-rose-gold-light transition-colors"
              >
                Confirmar
              </a>
            )}
            <a
              href={whatsappChatLink(booking.phone, booking.name, booking.service, booking.date, booking.time)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-2 rounded-full hover:bg-emerald-100 transition-colors"
            >
              WhatsApp
            </a>
          </>
        )}
        <button
          type="button"
          disabled={cancelling}
          onClick={() => onCancel(booking)}
          className="text-[10px] font-bold uppercase tracking-wider text-warm-gray border border-gold/20 px-3 py-2 rounded-full hover:border-rose-gold hover:text-rose-gold-dark transition-colors disabled:opacity-50"
        >
          {blocked ? 'Desbloquear' : 'Cancelar'}
        </button>
      </div>
    </motion.div>
  )
}

export default function Painel() {
  const { user, signOut } = useAuth()
  const [bookings, setBookings] = useState([])
  const [view, setView] = useState('hoje')
  const [cancellingId, setCancellingId] = useState(null)
  const [copyOk, setCopyOk] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  const refresh = useCallback(() => fetchBookings().then(setBookings).catch(() => setBookings([])), [])

  useEffect(() => {
    refresh()
    return subscribeBookings(setBookings)
  }, [refresh])

  const onFormSuccess = () => {
    refresh()
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 3000)
    setView('hoje')
  }

  const today = dateKey(new Date())
  const weekKeys = useMemo(() => nextDaysKeys(new Date(), 7), [])

  const todayList = useMemo(
    () => bookings.filter((b) => b.date === today).sort((a, b) => a.time.localeCompare(b.time)),
    [bookings, today]
  )

  const weekList = useMemo(
    () =>
      bookings
        .filter((b) => weekKeys.includes(b.date))
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [bookings, weekKeys]
  )

  const weekGrouped = useMemo(() => {
    const map = {}
    weekKeys.forEach((k) => {
      map[k] = []
    })
    weekList.forEach((b) => {
      map[b.date].push(b)
    })
    return weekKeys.map((k) => ({ date: k, items: map[k] }))
  }, [weekKeys, weekList])

  const todayClients = useMemo(() => todayList.filter((b) => !isBlockedBooking(b)), [todayList])

  const topService = useMemo(() => {
    const counts = {}
    bookings
      .filter((b) => !isBlockedBooking(b))
      .forEach((b) => {
        counts[b.service] = (counts[b.service] || 0) + 1
      })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0] ? { name: sorted[0][0], count: sorted[0][1] } : null
  }, [bookings])

  const nextBooking = useMemo(() => {
    const now = new Date()
    const upcoming = bookings
      .filter((b) => !isBlockedBooking(b))
      .map((b) => ({ ...b, dt: parseDateKey(b.date) }))
      .filter((b) => {
        const slot = new Date(b.dt)
        const [h, m] = b.time.split(':').map(Number)
        slot.setHours(h, m, 0, 0)
        return slot >= now
      })
      .sort((a, b) => {
        const da = a.date.localeCompare(b.date)
        return da !== 0 ? da : a.time.localeCompare(b.time)
      })
    return upcoming[0] || null
  }, [bookings])

  const handleCancel = async (booking) => {
    const action = isBlockedBooking(booking) ? 'Desbloquear' : 'Cancelar'
    if (!confirm(`${action} ${isBlockedBooking(booking) ? booking.name : booking.name} (${booking.date} às ${booking.time})?`)) return
    setCancellingId(booking.id)
    try {
      await deleteBooking(booking.id)
      await refresh()
    } catch {
      alert('Não foi possível remover. Confira se rodou o SQL de autenticação no Supabase.')
    } finally {
      setCancellingId(null)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(AGENDA_PUBLIC_URL)
      setCopyOk(true)
      setTimeout(() => setCopyOk(false), 2500)
    } catch {
      prompt('Copie o link:', AGENDA_PUBLIC_URL)
    }
  }

  const list = view === 'hoje' ? todayList : view === 'semana' ? weekList : []
  const showList = view === 'hoje' || view === 'semana'

  const NavButtons = ({ className = '' }) => (
    <div className={className}>
      {NAV.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setView(item.id)}
          className={`w-full text-left flex items-center gap-3 px-5 py-3 rounded-full text-xs font-semibold transition-colors ${
            view === item.id ? 'btn-luxury' : 'text-warm-gray hover:bg-marble-warm'
          }`}
        >
          {item.label}
        </button>
      ))}
      <Link
        to="/agenda"
        className="flex items-center gap-3 px-5 py-3 rounded-full text-xs font-medium text-warm-gray hover:bg-marble-warm transition-colors"
      >
        Agenda pública
      </Link>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col lg:flex-row marble-bg">
      <aside className="hidden lg:flex w-72 bg-white border-r border-gold/10 flex-col justify-between p-8 shrink-0">
        <div>
          <img src={LOGO_URL} alt="" className="w-full max-w-[160px] h-auto mb-8" />
          <nav className="space-y-1.5">
            <NavButtons />
          </nav>
        </div>
        <div className="space-y-3 pt-6 border-t border-gold/10">
          <p className="text-[10px] text-warm-gray truncate">{user?.email}</p>
          <button
            type="button"
            onClick={signOut}
            className="w-full py-2.5 rounded-full border border-gold/25 text-[10px] font-bold uppercase tracking-wider text-warm-gray hover:text-charcoal transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 safe-bottom lg:pb-0">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gold/10 sticky top-0 z-20">
          <div className="px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
            <div className="lg:hidden">
              <img src={LOGO_URL} alt="" className="h-12 w-auto" />
            </div>
            <div className="hidden lg:block">
              <span className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.2em]">Dashboard</span>
              <h1 className="text-lg font-semibold text-charcoal">Painel do salão</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="btn-outline-gold px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider"
              >
                {copyOk ? 'Copiado' : 'Link clientes'}
              </button>
              <button type="button" onClick={signOut} className="lg:hidden text-[10px] font-bold uppercase text-warm-gray px-3 py-2">
                Sair
              </button>
            </div>
          </div>
          <div className="lg:hidden flex gap-2 px-5 pb-3 overflow-x-auto">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ${
                  view === item.id ? 'btn-luxury' : 'bg-marble-warm text-warm-gray'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-5 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {savedFlash && (
            <p className="text-center text-xs font-semibold text-emerald-700 bg-emerald-50 py-2.5 rounded-full">
              Salvo com sucesso
            </p>
          )}

          {showList && (
            <>
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-5 col-span-1">
                  <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">Hoje</p>
                  <p className="text-2xl font-light text-charcoal">{todayClients.length}</p>
                  {todayList.length > todayClients.length && (
                    <p className="text-[10px] text-amber-700/80 mt-1">
                      +{todayList.length - todayClients.length} bloqueado(s)
                    </p>
                  )}
                </motion.div>
                <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-5 col-span-1">
                  <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">7 dias</p>
                  <p className="text-2xl font-light text-charcoal">
                    {weekList.filter((b) => !isBlockedBooking(b)).length}
                  </p>
                </motion.div>
                <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-5 col-span-2 lg:col-span-1">
                  <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">Mais pedido</p>
                  <p className="text-sm font-semibold text-charcoal truncate">{topService?.name || '—'}</p>
                  {topService && <p className="text-[10px] text-warm-gray">{topService.count} agend.</p>}
                </motion.div>
                <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-5 col-span-2 lg:col-span-1">
                  <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">Próximo</p>
                  {nextBooking ? (
                    <>
                      <p className="text-sm font-semibold text-charcoal">{nextBooking.name}</p>
                      <p className="text-[10px] text-rose-gold">
                        {formatDateKeyLabel(nextBooking.date)} às {nextBooking.time}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-warm-gray">Nenhum</p>
                  )}
                </motion.div>
              </motion.div>

              <section className="space-y-4">
                <h2 className="font-serif text-xl text-charcoal tracking-wide">
                  {view === 'hoje' ? 'Agenda de hoje' : 'Próximos 7 dias'}
                </h2>

                {list.length === 0 ? (
                  <div className="card-luxury rounded-2xl p-8 text-center text-sm text-warm-gray">
                    Nenhum agendamento neste período.
                  </div>
                ) : view === 'hoje' ? (
                  <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
                    {todayList.map((b) => (
                      <BookingCard key={b.id} booking={b} onCancel={handleCancel} cancelling={cancellingId === b.id} />
                    ))}
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {weekGrouped.map(({ date, items }) =>
                      items.length > 0 ? (
                        <div key={date}>
                          <p className="text-[10px] font-bold text-rose-gold uppercase tracking-wider mb-3">
                            {formatDateKeyLabel(date)}
                            {date === today && ' (hoje)'}
                          </p>
                          <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
                            {items.map((b) => (
                              <BookingCard
                                key={b.id}
                                booking={b}
                                onCancel={handleCancel}
                                cancelling={cancellingId === b.id}
                              />
                            ))}
                          </motion.div>
                        </div>
                      ) : null
                    )}
                    {weekList.length === 0 && (
                      <p className="text-sm text-warm-gray text-center py-6">Sem agendamentos na semana.</p>
                    )}
                  </div>
                )}
              </section>
            </>
          )}

          {view === 'agendar' && (
            <PanelScheduleForm mode="manual" bookings={bookings} onSuccess={onFormSuccess} />
          )}

          {view === 'bloquear' && (
            <PanelScheduleForm mode="block" bookings={bookings} onSuccess={onFormSuccess} />
          )}

          {showList && (
            <section className="card-luxury rounded-2xl p-6">
              <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-2">Funcionamento</p>
              <p className="text-sm text-charcoal">{HOURS_LABEL}</p>
              <p className="text-[10px] text-warm-gray mt-3">Atualização em tempo real via Supabase</p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
