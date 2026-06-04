import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import { LOGO_URL, BOOKING_SERVICES, ADDRESS, HOURS_LABEL, SLOT_TIMES, waLink } from '../lib/constants'
import { formatPhone } from '../lib/utils'
const STORAGE_KEY = 'na-agendamentos'
const WORK_DAYS = [2, 3, 4, 5, 6]

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function isWorkingDay(d) {
  return WORK_DAYS.includes(d.getDay())
}

function isPastDate(d) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const check = new Date(d.getTime())
  check.setHours(0, 0, 0, 0)
  return check < today
}

function isPastTime(dateStr, time) {
  if (dateStr !== dateKey(new Date())) return false
  const [h, m] = time.split(':').map(Number)
  const slot = new Date()
  slot.setHours(h, m, 0, 0)
  return slot <= new Date()
}

function formatDateLabel(dateStr) {
  return parseDateKey(dateStr).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function newId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `b-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function Agenda() {
  const [bookings, setBookings] = useState([])
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [searchParams] = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [lastBooking, setLastBooking] = useState(null)
  const [phone, setPhone] = useState('')
  const [service, setService] = useState(() => {
    const s = searchParams.get('s')
    return s && BOOKING_SERVICES.includes(s) ? s : ''
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setBookings(raw ? JSON.parse(raw) : [])
    } catch { setBookings([]) }
  }, [])

  useEffect(() => {
    const nextDay = new Date()
    nextDay.setDate(nextDay.getDate() + 1)
    while (!isWorkingDay(nextDay) || isPastDate(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1)
    }
    setSelectedDate(dateKey(nextDay))
  }, [])

  const saveBookings = useCallback((updated) => {
    setBookings(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [])

  const isBooked = useCallback((dateStr, time) => {
    return bookings.some(b => b.date === dateStr && b.time === time)
  }, [bookings])

  const bookingsOnDate = useCallback((dateStr) => {
    return bookings.filter(b => b.date === dateStr)
  }, [bookings])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const selectDate = (key) => {
    setSelectedDate(key)
    setSelectedTime(null)
  }

  const openModal = (time) => {
    setSelectedTime(time)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTime(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    if (isBooked(selectedDate, selectedTime)) {
      alert('Este horario acabou de ser reservado. Escolha outro.')
      closeModal()
      return
    }
    const fd = new FormData(e.target)
    const updated = [...bookings, {
      id: newId(),
      date: selectedDate,
      time: selectedTime,
      name: String(fd.get('name') || '').trim(),
      phone: phone.trim() || String(fd.get('phone') || '').trim(),
      service: service || fd.get('service'),
      createdAt: new Date().toISOString(),
    }]
    const booking = updated[updated.length - 1]
    saveBookings(updated)
    setLastBooking(booking)
    setPhone('')
    setService('')
    closeModal()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 8000)
  }

  // Calendar grid
  const first = new Date(viewYear, viewMonth, 1)
  const last = new Date(viewYear, viewMonth + 1, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const todayKey = dateKey(new Date())
  const monthTitle = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const calendarDays = []
  for (let i = 0; i < startPad; i++) calendarDays.push(null)
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day)

  // Time slots
  const slotsAvailable = selectedDate && isWorkingDay(parseDateKey(selectedDate))

  return (
    <div className="min-h-screen marble-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gold/10 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-2">
          <Link to="/" className="text-[10px] sm:text-[11px] font-semibold text-warm-gray uppercase tracking-[0.15em] hover:text-rose-gold transition-colors duration-300">
            Inicio
          </Link>
          <img src={LOGO_URL} alt="Nathalia Andrade" className="h-14 sm:h-16 w-auto object-contain" />
          <span className="w-12 shrink-0" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 sm:py-12 safe-bottom space-y-8">
        <ScrollReveal className="text-center">
          <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-3">
            Agendamento online
          </p>
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide">
            Escolha data e horário
          </h1>
          <p className="text-sm text-warm-gray mt-3 max-w-md mx-auto leading-relaxed">
            Toque no dia no calendário e depois no horário disponível.
            Horários já reservados aparecem em verde.
          </p>
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {['Data', 'Horário', 'Confirmar'].map((label, i) => (
              <span
                key={label}
                className={`text-[9px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                  (i === 0 && selectedDate) || (i === 1 && selectedTime) || (i === 2 && showModal)
                    ? 'border-rose-gold text-rose-gold bg-rose-gold-light/50'
                    : 'border-gold/20 text-warm-gray-light'
                }`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
        </ScrollReveal>

        {/* Legenda */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md border-2 border-warm-gray-light/40 bg-white" />
            Disponivel
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-emerald-500" />
            Reservado
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-charcoal" />
            Seu horario
          </span>
        </div>

        {/* Calendario */}
        <ScrollReveal>
          <section className="card-luxury rounded-2xl p-5 sm:p-7">
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="w-10 h-10 rounded-full hover:bg-marble-warm text-warm-gray font-bold transition-colors text-lg">
                ‹
              </button>
              <h2 className="font-serif text-xl text-charcoal capitalize tracking-wide">{monthTitle}</h2>
              <button onClick={nextMonth} className="w-10 h-10 rounded-full hover:bg-marble-warm text-warm-gray font-bold transition-colors text-lg">
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['Dom','Seg','Ter','Qua','Qui','Sex','Sab'].map(d => (
                <span key={d} className="text-[10px] font-semibold text-warm-gray-light py-1 tracking-wider">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`pad-${i}`} />
                const d = new Date(viewYear, viewMonth, day)
                const key = dateKey(d)
                const past = isPastDate(d)
                const closed = !isWorkingDay(d)
                const disabled = past || closed
                const hasBookings = bookingsOnDate(key).length > 0
                const isSelected = selectedDate === key
                const isToday = key === todayKey

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDate(key)}
                    className={`
                      relative aspect-square rounded-xl text-sm font-medium transition-all duration-200
                      ${disabled ? 'text-warm-gray-light/50 cursor-not-allowed' : 'hover:bg-rose-gold-light text-charcoal cursor-pointer'}
                      ${isSelected ? 'day-selected font-semibold' : ''}
                      ${isToday && !disabled && !isSelected ? 'ring-2 ring-rose-gold/40' : ''}
                      ${hasBookings && !disabled ? 'day-has-bookings' : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* Horarios */}
        <AnimatePresence>
          {selectedDate && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="card-luxury rounded-2xl p-6"
            >
              <h3 className="font-serif text-lg text-charcoal mb-1 tracking-wide">Horarios disponiveis</h3>
              <p className="text-sm text-rose-gold font-medium mb-5">{formatDateLabel(selectedDate)}</p>

              {!slotsAvailable ? (
                <p className="text-sm text-warm-gray text-center py-6">
                  Salao fechado neste dia. Escolha de terca a sabado.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {SLOT_TIMES.map(time => {
                      const booked = isBooked(selectedDate, time)
                      const past = isPastTime(selectedDate, time)

                      if (booked) {
                        return (
                          <button key={time} disabled className="py-3 rounded-xl text-xs font-bold border-2 slot-booked">
                            {time}
                          </button>
                        )
                      }
                      if (past) {
                        return (
                          <button key={time} disabled className="py-3 rounded-xl text-xs font-bold border-2 border-warm-gray-light/20 bg-marble text-warm-gray-light/50 cursor-not-allowed">
                            {time}
                          </button>
                        )
                      }
                      return (
                        <button
                          key={time}
                          onClick={() => openModal(time)}
                          className={`py-3 rounded-xl text-xs font-bold border-2 transition-all duration-200
                            ${selectedTime === time ? 'slot-selected' : 'border-gold/15 bg-white text-charcoal slot-available'}`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                  {SLOT_TIMES.every(t => isBooked(selectedDate, t) || isPastTime(selectedDate, t)) && (
                    <p className="text-sm text-warm-gray text-center py-4 mt-2">
                      Todos os horarios deste dia estao reservados. Tente outra data.
                    </p>
                  )}
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="text-center text-[11px] text-warm-gray space-y-1">
          <p>{ADDRESS}</p>
          <p>Atendimento: {HOURS_LABEL}</p>
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/90 backdrop-blur-xl border-t border-gold/10 flex justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link to="/" className="flex flex-col items-center text-warm-gray text-[9px] font-semibold uppercase py-2 tracking-wider">
          <span className="text-sm mb-0.5">Inicio</span>
        </Link>
        <Link to="/agenda" className="flex flex-col items-center text-rose-gold text-[9px] font-semibold uppercase py-2 tracking-wider">
          <span className="text-sm mb-0.5">Agendar</span>
        </Link>
      </nav>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl border-t-2 border-gold p-6 max-h-[92vh] overflow-y-auto"
            >
              <h3 className="font-serif text-xl text-charcoal mb-1 tracking-wide">Confirmar agendamento</h3>
              <p className="text-sm text-rose-gold font-medium mb-6">
                {selectedDate && formatDateLabel(selectedDate)} as {selectedTime}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">Seu nome</label>
                  <input
                    type="text" name="name" required placeholder="Ex: Maria Silva"
                    className="input-luxury mt-1"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">WhatsApp</label>
                  <input
                    type="tel" name="phone" required placeholder="(11) 99999-9999"
                    className="input-luxury mt-1"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">Serviço</label>
                  <select
                    name="service" required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="input-luxury mt-1"
                  >
                    <option value="">Selecione...</option>
                    {BOOKING_SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button" onClick={closeModal}
                    className="flex-1 py-3 rounded-full btn-outline-gold text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full btn-luxury text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && lastBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] w-full max-w-sm"
          >
            <div className="mx-4 bg-charcoal text-white px-5 py-4 rounded-2xl shadow-2xl border border-gold/20 text-center">
              <p className="text-sm font-semibold mb-3">Agendamento confirmado</p>
              <a
                href={waLink(
                  `Olá! Sou ${lastBooking.name}. Agendei ${lastBooking.service} para ${formatDateLabel(lastBooking.date)} às ${lastBooking.time}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Avisar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
