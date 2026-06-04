export function matchesSearch(booking, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  const hay = [booking.name, booking.phone, booking.service, booking.date, booking.time]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

export function filterBookings(bookings, { search = '', service = '' }) {
  return bookings.filter((b) => {
    if (service && b.service !== service) return false
    return matchesSearch(b, search)
  })
}

export function bookingsExportText(bookings) {
  const header = 'Data\tHorario\tCliente\tWhatsApp\tServico'
  const rows = bookings.map(
    (b) => `${b.date}\t${b.time}\t${b.name}\t${b.phone}\t${b.service}`
  )
  return [header, ...rows].join('\n')
}
