import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import PanelScheduleForm from '../components/PanelScheduleForm'
import PanelBookingCard from '../components/PanelBookingCard'
import PanelResumo from '../components/PanelResumo'
import PanelListToolbar from '../components/PanelListToolbar'
import { LOGO_URL, HOURS_LABEL } from '../lib/constants'
import {
  fetchBookings,
  subscribeBookings,
  deleteBooking,
  isBlockedBooking,
} from '../lib/bookings'
import { filterBookings } from '../lib/panelFilters'
import { dateKey, formatDateKeyLabel, nextDaysKeys, pastDaysKeys, parseDateKey, addDays } from '../lib/dates'

const AGENDA_PUBLIC_URL = `${window.location.origin}${import.meta.env.BASE_URL}#/agenda`

const NAV = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'semana', label: 'Semana' },
  { id: 'historico', label: 'Histórico' },
  { id: 'resumo', label: 'Resumo' },
  { id: 'agendar', label: 'Agendar' },
  { id: 'bloquear', label: 'Bloquear' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function BookingList({ items, onCancel, cancellingId, showDate, emptyMessage }) {
  if (items.length === 0) {
    return (
      <div className="card-luxury rounded-2xl p-8 text-center text-sm text-warm-gray">
        {emptyMessage}
      </div>
    )
  }
  return (
    <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
      {items.map((b) => (
        <PanelBookingCard
          key={b.id}
          booking={b}
          onCancel={onCancel}
          cancelling={cancellingId === b.id}
          showDate={showDate}
        />
      ))}
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
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')

  const refresh = useCallback(() => fetchBookings().then(setBookings).catch(() => setBookings([])), [])

  useEffect(() => {
    refresh()
    return subscribeBookings(setBookings)
  }, [refresh])

  useEffect(() => {
    setSearch('')
    setServiceFilter('')
  }, [view])

  const onFormSuccess = () => {
    refresh()
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 3000)
    setView('hoje')
  }

  const today = dateKey(new Date())
  const weekKeys = useMemo(() => nextDaysKeys(new Date(), 7), [])
  const pastKeys = useMemo(() => new Set(pastDaysKeys(new Date(), 30)), [])
  const monthFrom = dateKey(addDays(new Date(), -30))
  const monthTo = weekKeys[weekKeys.length - 1]

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

  const historicoList = useMemo(
    () =>
      bookings
        .filter((b) => pastKeys.has(b.date))
        .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time)),
    [bookings, pastKeys]
  )

  const monthList = useMemo(
    () =>
      bookings
        .filter((b) => b.date >= monthFrom && b.date <= monthTo)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [bookings, monthFrom, monthTo]
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

  const filters = { search, service: serviceFilter }

  const todayFiltered = useMemo(() => filterBookings(todayList, filters), [todayList, search, serviceFilter])
  const weekFiltered = useMemo(() => filterBookings(weekList, filters), [weekList, search, serviceFilter])
  const historicoFiltered = useMemo(
    () => filterBookings(historicoList, filters),
    [historicoList, search, serviceFilter]
  )

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
    if (!confirm(`${action} ${booking.name} (${booking.date} às ${booking.time})?`)) return
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

  const listViews = ['hoje', 'semana', 'historico']
  const showList = listViews.includes(view)
  const showToolbar = showList

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
              <button
                type="button"
                onClick={signOut}
                className="lg:hidden text-[10px] font-bold uppercase text-warm-gray px-3 py-2"
              >
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

          {showToolbar && (
            <PanelListToolbar
              search={search}
              onSearchChange={setSearch}
              serviceFilter={serviceFilter}
              onServiceFilterChange={setServiceFilter}
            />
          )}

          {view === 'hoje' && (
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
                <h2 className="font-serif text-xl text-charcoal tracking-wide">Agenda de hoje</h2>
                <BookingList
                  items={todayFiltered}
                  onCancel={handleCancel}
                  cancellingId={cancellingId}
                  showDate={false}
                  emptyMessage={
                    search || serviceFilter
                      ? 'Nenhum resultado com esses filtros.'
                      : 'Nenhum agendamento hoje.'
                  }
                />
              </section>
            </>
          )}

          {view === 'semana' && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl text-charcoal tracking-wide">Próximos 7 dias</h2>
              {weekFiltered.length === 0 ? (
                <BookingList
                  items={[]}
                  onCancel={handleCancel}
                  cancellingId={cancellingId}
                  showDate
                  emptyMessage={
                    search || serviceFilter
                      ? 'Nenhum resultado com esses filtros.'
                      : 'Sem agendamentos na semana.'
                  }
                />
              ) : (
                <div className="space-y-6">
                  {weekGrouped.map(({ date, items }) => {
                    const filtered = filterBookings(items, filters)
                    if (filtered.length === 0) return null
                    return (
                      <div key={date}>
                        <p className="text-[10px] font-bold text-rose-gold uppercase tracking-wider mb-3">
                          {formatDateKeyLabel(date)}
                          {date === today && ' (hoje)'}
                        </p>
                        <BookingList
                          items={filtered}
                          onCancel={handleCancel}
                          cancellingId={cancellingId}
                          showDate={false}
                          emptyMessage=""
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {view === 'historico' && (
            <section className="space-y-4">
              <div>
                <h2 className="font-serif text-xl text-charcoal tracking-wide">Histórico</h2>
                <p className="text-xs text-warm-gray mt-1">Últimos 30 dias — agendamentos passados.</p>
              </div>
              <BookingList
                items={historicoFiltered}
                onCancel={handleCancel}
                cancellingId={cancellingId}
                showDate
                emptyMessage={
                  search || serviceFilter
                    ? 'Nenhum resultado com esses filtros.'
                    : 'Nenhum agendamento no histórico.'
                }
              />
            </section>
          )}

          {view === 'resumo' && (
            <PanelResumo todayList={todayList} weekList={weekList} monthList={monthList} />
          )}

          {view === 'agendar' && (
            <PanelScheduleForm mode="manual" bookings={bookings} onSuccess={onFormSuccess} />
          )}

          {view === 'bloquear' && (
            <PanelScheduleForm mode="block" bookings={bookings} onSuccess={onFormSuccess} />
          )}

          {(showList || view === 'resumo') && (
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
