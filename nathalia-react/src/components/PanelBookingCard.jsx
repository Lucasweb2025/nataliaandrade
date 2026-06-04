import { motion } from 'framer-motion'
import { confirmationWhatsAppLink, isBlockedBooking } from '../lib/bookings'
import { formatDateKeyLabel } from '../lib/dates'

function whatsappChatLink(phone, name, service, date, time) {
  const digits = phone.replace(/\D/g, '')
  const msg = encodeURIComponent(`Olá! Sou ${name}. Agendei ${service} para ${date} às ${time}.`)
  return `https://wa.me/55${digits}?text=${msg}`
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function PanelBookingCard({ booking, onCancel, cancelling, showDate }) {
  const blocked = isBlockedBooking(booking)
  const confirmUrl = confirmationWhatsAppLink(booking)

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border ${
        blocked ? 'bg-amber-50/80 border-amber-200/60' : 'card-luxury'
      }`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className={`text-center border-r pr-5 shrink-0 ${blocked ? 'border-amber-200/60' : 'border-gold/10'}`}>
          <p className="text-sm font-bold text-charcoal">{booking.time}</p>
          {showDate && <p className="text-[10px] text-warm-gray">{formatDateKeyLabel(booking.date)}</p>}
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
