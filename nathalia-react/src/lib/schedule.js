import { SLOT_TIMES } from './constants'
import { dateKey, parseDateKey } from './dates'

export const WORK_DAYS = [2, 3, 4, 5, 6]

export function isWorkingDay(d) {
  return WORK_DAYS.includes(d.getDay())
}

export function isPastDate(d) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const check = new Date(d.getTime())
  check.setHours(0, 0, 0, 0)
  return check < today
}

export function isPastTime(dateStr, time) {
  if (dateStr !== dateKey(new Date())) return false
  const [h, m] = time.split(':').map(Number)
  const slot = new Date()
  slot.setHours(h, m, 0, 0)
  return slot <= new Date()
}

export function nextWorkingDateKey(from = new Date()) {
  const d = new Date(from)
  if (!isPastDate(d) && isWorkingDay(d)) return dateKey(d)
  d.setDate(d.getDate() + 1)
  while (isPastDate(d) || !isWorkingDay(d)) {
    d.setDate(d.getDate() + 1)
  }
  return dateKey(d)
}

export function slotStatesForDate(dateStr, bookings) {
  const bookedSet = new Set(
    bookings.filter((b) => b.date === dateStr).map((b) => b.time)
  )
  return SLOT_TIMES.map((time) => ({
    time,
    booked: bookedSet.has(time),
    past: isPastTime(dateStr, time),
    available: !bookedSet.has(time) && !isPastTime(dateStr, time),
  }))
}
