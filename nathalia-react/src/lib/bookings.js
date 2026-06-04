import { supabase, isSupabaseConfigured } from './supabase'
import { BLOCKED_SERVICE } from './constants'
import { formatDateKeyLong } from './dates'

const STORAGE_KEY = 'na-agendamentos'
const TABLE = 'agendamentos'

function fromRow(row) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    service: row.service,
    createdAt: row.created_at || row.createdAt,
    blocked: row.service === BLOCKED_SERVICE,
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return list.map((b) => ({ ...b, blocked: b.service === BLOCKED_SERVICE }))
  } catch {
    return []
  }
}

function saveLocal(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function isBlockedBooking(booking) {
  return booking?.service === BLOCKED_SERVICE || booking?.blocked === true
}

export async function fetchBookings() {
  if (!isSupabaseConfigured) return loadLocal()

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, date, time, name, phone, service, created_at')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (error) {
    console.error('Supabase fetch:', error.message)
    return loadLocal()
  }

  return (data || []).map(fromRow)
}

export async function createBooking(booking) {
  if (!isSupabaseConfigured) {
    const list = loadLocal()
    const entry = {
      ...booking,
      id: booking.id || crypto.randomUUID(),
      blocked: booking.service === BLOCKED_SERVICE,
    }
    saveLocal([...list, entry])
    return entry
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      date: booking.date,
      time: booking.time,
      name: booking.name,
      phone: booking.phone,
      service: booking.service,
    })
    .select('id, date, time, name, phone, service, created_at')
    .single()

  if (error) throw error
  return fromRow(data)
}

export async function createBlockedSlot({ date, time, note = 'Indisponível' }) {
  return createBooking({
    date,
    time,
    name: note.trim() || 'Indisponível',
    phone: '-',
    service: BLOCKED_SERVICE,
  })
}

export function confirmationWhatsAppLink(booking) {
  if (isBlockedBooking(booking) || !booking.phone || booking.phone === '-') return null
  const digits = booking.phone.replace(/\D/g, '')
  if (digits.length < 10) return null
  const when = `${formatDateKeyLong(booking.date)} às ${booking.time}`
  const msg = `Olá, ${booking.name}! Passando para confirmar seu horário no Salão Nathalia Andrade: ${booking.service}, ${when}. Te esperamos!`
  return `https://wa.me/55${digits}?text=${encodeURIComponent(msg)}`
}

export async function deleteBooking(id) {
  if (!isSupabaseConfigured) {
    const list = loadLocal().filter((b) => b.id !== id)
    saveLocal(list)
    return
  }

  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

export function subscribeBookings(onChange) {
  if (!isSupabaseConfigured) return () => {}

  const channel = supabase
    .channel('agendamentos-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE },
      () => {
        fetchBookings().then(onChange).catch(() => {})
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
