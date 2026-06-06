import { motion } from 'framer-motion'
import { confirmationWhatsAppLink, isBlockedBooking } from '../lib/bookings'
import { formatDateKeyLabel } from '../lib/dates'
import {
  isCompletedBooking,
  isNoShowBooking,
  statusLabel,
  paymentMethodLabel,
} from '../lib/bookingStatus'
import { formatBRL } from '../lib/pricing'

function whatsappChatLink(phone, name, service, date, time) {
  const digits = phone.replace(/\D/g, '')
  const msg = encodeURIComponent(`Olá! Sou ${name}. Agendei ${service} para ${date} às ${time}.`)
  return `https://wa.me/55${digits}?text=${msg}`
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function StatusBadge({ booking }) {
  const label = statusLabel(booking)
  if (!label) return null

  let className = 'bg-marble-warm text-warm-gray'
  if (isCompletedBooking(booking)) className = 'bg-emerald-50 text-emerald-800'
  if (isNoShowBooking(booking)) className = 'bg-red-50 text-red-800/90'

  return (
    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}

export default function PanelBookingCard({
  booking,
  onCancel,
  onComplete,
  onNoShow,
  onEditComplete,
  onResetStatus,
  cancelling,
  showDate,
}) {
  const blocked = isBlockedBooking(booking)
  const confirmUrl = confirmationWhatsAppLink(booking)
  const completed = isCompletedBooking(booking)
  const noShow = isNoShowBooking(booking)
  const pending = !blocked && !completed && !noShow

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border ${
        blocked
          ? 'bg-amber-50/80 border-amber-200/60'
          : completed
            ? 'bg-emerald-50/40 border-emerald-200/40'
            : noShow
              ? 'bg-red-50/30 border-red-100'
              : 'card-luxury'
      }`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className={`text-center border-r pr-5 shrink-0 ${blocked ? 'border-amber-200/60' : 'border-gold/10'}`}>
          <p className="text-sm font-bold text-charcoal">{booking.time}</p>
          {showDate && <p className="text-[10px] text-warm-gray">{formatDateKeyLabel(booking.date)}</p>}
        </div>
        <div className="min-w-0 space-y-1">
          {blocked ? (
            <>
              <p className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider">Bloqueado</p>
              <p className="text-sm font-semibold text-charcoal truncate">{booking.name}</p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-charcoal truncate">{booking.name}</p>
                <StatusBadge booking={booking} />
              </div>
              <p className="text-[11px] text-rose-gold font-medium truncate">{booking.service}</p>
              {completed && booking.amount_paid != null && (
                <p className="text-[10px] text-charcoal font-medium">
                  {formatBRL(booking.amount_paid)}
                  {booking.payment_method && (
                    <span className="text-warm-gray"> · {paymentMethodLabel(booking.payment_method)}</span>
                  )}
                </p>
              )}
              {booking.phone && booking.phone !== '-' && (
                <p className="text-[10px] text-warm-gray">{booking.phone}</p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap justify-end">
        {pending && (
          <>
            <button
              type="button"
              onClick={() => onComplete(booking)}
              className="text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-600 px-3 py-2 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Realizado
            </button>
            <button
              type="button"
              onClick={() => onNoShow(booking)}
              className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-2 rounded-full hover:bg-red-100 transition-colors"
            >
              Não veio
            </button>
          </>
        )}
        {completed && (
          <button
            type="button"
            onClick={() => onEditComplete(booking)}
            className="text-[10px] font-bold uppercase tracking-wider text-warm-gray border border-gold/20 px-3 py-2 rounded-full hover:border-rose-gold transition-colors"
          >
            Editar
          </button>
        )}
        {noShow && (
          <button
            type="button"
            onClick={() => onResetStatus(booking)}
            className="text-[10px] font-bold uppercase tracking-wider text-warm-gray border border-gold/20 px-3 py-2 rounded-full"
          >
            Desfazer
          </button>
        )}
        {!blocked && booking.phone && booking.phone !== '-' && pending && (
          <>
            {confirmUrl && (
              <a
                href={confirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-wider text-rose-gold-dark bg-rose-gold-light/60 px-3 py-2 rounded-full hover:bg-rose-gold-light transition-colors"
              >
                Avisar
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
