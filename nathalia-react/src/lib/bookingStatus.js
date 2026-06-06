export const BOOKING_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
}

export const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix' },
  { id: 'credito', label: 'Crédito' },
  { id: 'debito', label: 'Débito' },
  { id: 'dinheiro', label: 'Dinheiro' },
]

export function paymentMethodLabel(id) {
  return PAYMENT_METHODS.find((p) => p.id === id)?.label || id || ''
}

export function isCompletedBooking(booking) {
  return booking?.status === BOOKING_STATUS.COMPLETED
}

export function isNoShowBooking(booking) {
  return booking?.status === BOOKING_STATUS.NO_SHOW
}

export function isScheduledBooking(booking) {
  if (!booking || booking.blocked) return false
  const s = booking.status || BOOKING_STATUS.SCHEDULED
  return s === BOOKING_STATUS.SCHEDULED
}

export function statusLabel(booking) {
  if (!booking || booking.blocked) return null
  if (isCompletedBooking(booking)) return 'Realizado'
  if (isNoShowBooking(booking)) return 'Não compareceu'
  return 'Agendado'
}
