import { SERVICES } from './constants'
import { isBlockedBooking } from './bookings'

function parsePriceLabel(label) {
  const match = label.match(/R\$\s*([\d.]+),(\d{2})/)
  if (!match) return 0
  return Number(`${match[1].replace(/\./g, '')}.${match[2]}`)
}

export const SERVICE_PRICE_MAP = Object.fromEntries(
  SERVICES.map((s) => [s.title, parsePriceLabel(s.price)])
)

export function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function estimateRevenue(bookings) {
  return bookings
    .filter((b) => !isBlockedBooking(b))
    .reduce((sum, b) => sum + (SERVICE_PRICE_MAP[b.service] || 0), 0)
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
