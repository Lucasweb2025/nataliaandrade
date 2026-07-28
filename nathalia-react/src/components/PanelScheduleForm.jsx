import { useState, useMemo } from 'react'
import { BOOKING_SERVICES } from '../lib/constants'
import { createBooking, createBlockedSlot } from '../lib/bookings'
import { formatDateKeyLabel, nextDaysKeys, parseDateKey } from '../lib/dates'
import { isWorkingDay, nextWorkingDateKey, slotStatesForDate } from '../lib/schedule'
import { formatPhone } from '../lib/utils'
import { usePostHog } from '@posthog/react'

export default function PanelScheduleForm({ mode, bookings, onSuccess }) {
  const posthog = usePostHog()
  const isBlock = mode === 'block'
  const [date, setDate] = useState(() => nextWorkingDateKey())
  const [time, setTime] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const dayOptions = useMemo(() => nextDaysKeys(new Date(), 21), [])
  const slots = useMemo(() => slotStatesForDate(date, bookings), [date, bookings])
  const closed = !isWorkingDay(parseDateKey(date))

  const resetForm = () => {
    setTime(null)
    if (!isBlock) {
      setName('')
      setPhone('')
      setService('')
    } else {
      setNote('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!time || submitting) return
    setError('')
    setSubmitting(true)
    try {
      if (isBlock) {
        await createBlockedSlot({ date, time, note: note || 'Indisponível' })
        posthog?.capture('admin_slot_blocked', { date, time })
      } else {
        const bookingService = service || BOOKING_SERVICES[0]
        await createBooking({
          date,
          time,
          name: name.trim(),
          phone: phone.trim(),
          service: bookingService,
        })
        posthog?.capture('admin_booking_created', { date, time, service: bookingService })
      }
      resetForm()
      onSuccess?.()
    } catch (err) {
      const msg =
        err?.code === '23505'
          ? 'Este horário já está ocupado.'
          : 'Não foi possível salvar. Tente de novo.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-luxury rounded-2xl p-6 space-y-5">
      <div>
        <h3 className="font-serif text-lg text-charcoal tracking-wide mb-1">
          {isBlock ? 'Bloquear horário' : 'Agendar manualmente'}
        </h3>
        <p className="text-xs text-warm-gray leading-relaxed">
          {isBlock
            ? 'O horário some da agenda pública (almoço, folga, compromisso).'
            : 'Para clientes que agendaram por WhatsApp ou presencialmente.'}
        </p>
      </div>

      <div>
        <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">Data</label>
        <select
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setTime(null)
          }}
          className="input-luxury mt-1"
        >
          {dayOptions.map((key) => (
            <option key={key} value={key}>
              {formatDateKeyLabel(key)}
            </option>
          ))}
        </select>
      </div>

      {closed ? (
        <p className="text-sm text-warm-gray text-center py-4">Salão fechado neste dia (segunda ou domingo).</p>
      ) : (
        <div>
          <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em] mb-2 block">
            Horário
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map(({ time: t, available, booked, past }) => (
              <button
                key={t}
                type="button"
                disabled={!available}
                onClick={() => setTime(t)}
                className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                  time === t
                    ? 'slot-selected'
                    : available
                      ? 'border-gold/15 bg-white text-charcoal hover:border-rose-gold/40'
                      : booked
                        ? 'slot-booked cursor-not-allowed'
                        : 'border-warm-gray-light/20 text-warm-gray-light/50 cursor-not-allowed'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {isBlock ? (
        <div>
          <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">
            Motivo (opcional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Almoço, folga, compromisso"
            className="input-luxury mt-1"
          />
        </div>
      ) : (
        <>
          <div>
            <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da cliente"
              className="input-luxury mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">WhatsApp</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="input-luxury mt-1"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">Serviço</label>
            <select
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="input-luxury mt-1"
            >
              <option value="">Selecione...</option>
              {BOOKING_SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {error && <p className="text-xs text-rose-gold-dark text-center">{error}</p>}

      <button
        type="submit"
        disabled={!time || closed || submitting}
        className="w-full py-3.5 rounded-full btn-luxury text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50"
      >
        {submitting ? 'Salvando...' : isBlock ? 'Bloquear horário' : 'Salvar agendamento'}
      </button>
    </form>
  )
}
