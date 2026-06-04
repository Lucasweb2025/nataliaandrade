import { supabase, isSupabaseConfigured } from './supabase'

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
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocal(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
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
    const entry = { ...booking, id: booking.id || crypto.randomUUID() }
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
