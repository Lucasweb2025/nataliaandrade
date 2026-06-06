import { SERVICES } from './constants'
import { isBlockedBooking } from './bookings'
import { isCompletedBooking } from './bookingStatus'
import { paymentMethodLabel } from './bookingStatus'

function parsePriceLabel(label) {
  const match = label.match(/R\$\s*([\d.]+),(\d{2})/)
  if (!match) return 0
  return Number(`${match[1].replace(/\./g, '')}.${match[2]}`)
}

export const SERVICE_PRICE_MAP = Object.fromEntries(
  SERVICES.map((s) => [s.title, parsePriceLabel(s.price)])
)

export function suggestedServicePrice(service) {
  return SERVICE_PRICE_MAP[service] || 0
}

export function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Soma valores confirmados no painel (atendimentos realizados) */
export function actualRevenue(bookings) {
  return bookings
    .filter((b) => isCompletedBooking(b))
    .reduce((sum, b) => sum + (b.amount_paid || 0), 0)
}

export function completedBookings(bookings) {
  return bookings.filter((b) => !isBlockedBooking(b) && isCompletedBooking(b))
}

export function estimateRevenue(bookings) {
  return bookings
    .filter((b) => !isBlockedBooking(b) && !isCompletedBooking(b))
    .reduce((sum, b) => sum + (SERVICE_PRICE_MAP[b.service] || 0), 0)
}

export function paymentMethodTotals(bookings) {
  const totals = {}
  completedBookings(bookings).forEach((b) => {
    const key = b.payment_method || 'outro'
    totals[key] = (totals[key] || 0) + (b.amount_paid || 0)
  })
  return Object.entries(totals)
    .map(([id, total]) => ({ id, label: paymentMethodLabel(id), total }))
    .sort((a, b) => b.total - a.total)
}

export function serviceCounts(bookings, limit = 6) {
  const counts = {}
  bookings
    .filter((b) => !isBlockedBooking(b))
    .forEach((b) => {
      counts[b.service] = (counts[b.service] || 0) + 1
    })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
}
