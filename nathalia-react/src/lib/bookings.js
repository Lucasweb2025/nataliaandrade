import { supabase, isSupabaseConfigured } from './supabase'
import { BLOCKED_SERVICE } from './constants'
import { formatDateKeyLong } from './dates'
import { BOOKING_STATUS } from './bookingStatus'

const STORAGE_KEY = 'na-agendamentos'
const TABLE = 'agendamentos'

const SELECT_FIELDS =
  'id, date, time, name, phone, service, created_at, status, amount_paid, payment_method'

function fromRow(row) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    name: row.name,
    phone: row.phone,
    service: row.service,
    createdAt: row.created_at || row.createdAt,
    status: row.status || BOOKING_STATUS.SCHEDULED,
    amount_paid: row.amount_paid != null ? Number(row.amount_paid) : null,
    payment_method: row.payment_method || null,
    blocked: row.service === BLOCKED_SERVICE,
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return list.map((b) => ({
      ...fromRow({ ...b, created_at: b.createdAt }),
      blocked: b.service === BLOCKED_SERVICE,
    }))
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
    .select(SELECT_FIELDS)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  if (error) {
    console.error('Supabase fetch:', error.message)
    return loadLocal()
  }

  return (data || []).map(fromRow)
}

export async function createBooking(booking) {
  const payload = {
    date: booking.date,
    time: booking.time,
    name: booking.name,
    phone: booking.phone,
    service: booking.service,
    status: BOOKING_STATUS.SCHEDULED,
  }

  if (!isSupabaseConfigured) {
    const list = loadLocal()
    const entry = {
      ...payload,
      id: booking.id || crypto.randomUUID(),
      blocked: booking.service === BLOCKED_SERVICE,
      amount_paid: null,
      payment_method: null,
    }
    saveLocal([...list, entry])
    return entry
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select(SELECT_FIELDS)
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

export async function completeBooking(id, { amount_paid, payment_method }) {
  const patch = {
    status: BOOKING_STATUS.COMPLETED,
    amount_paid,
    payment_method,
  }

  if (!isSupabaseConfigured) {
    const list = loadLocal().map((b) => (b.id === id ? { ...b, ...patch } : b))
    saveLocal(list)
    return list.find((b) => b.id === id)
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return fromRow(data)
}

export async function markBookingNoShow(id) {
  const patch = {
    status: BOOKING_STATUS.NO_SHOW,
    amount_paid: null,
    payment_method: null,
  }

  if (!isSupabaseConfigured) {
    const list = loadLocal().map((b) => (b.id === id ? { ...b, ...patch } : b))
    saveLocal(list)
    return
  }

  const { error } = await supabase.from(TABLE).update(patch).eq('id', id)
  if (error) throw error
}

export async function resetBookingStatus(id) {
  const patch = {
    status: BOOKING_STATUS.SCHEDULED,
    amount_paid: null,
    payment_method: null,
  }

  if (!isSupabaseConfigured) {
    const list = loadLocal().map((b) => (b.id === id ? { ...b, ...patch } : b))
    saveLocal(list)
    return
  }

  const { error } = await supabase.from(TABLE).update(patch).eq('id', id)
  if (error) throw error
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
