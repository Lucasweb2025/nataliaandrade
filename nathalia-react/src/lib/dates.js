export function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function parseDateKey(key) {
  const [y, m, day] = key.split('-').map(Number)
  return new Date(y, m - 1, day)
}

export function formatDateKeyLabel(key) {
  return parseDateKey(key).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatDateKeyLong(key) {
  return parseDateKey(key).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function nextDaysKeys(fromDate, count) {
  const keys = []
  for (let i = 0; i < count; i++) {
    keys.push(dateKey(addDays(fromDate, i)))
  }
  return keys
}
