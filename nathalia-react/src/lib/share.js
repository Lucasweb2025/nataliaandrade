import { formatDateKeyLong } from './dates'

/** Mensagem pronta para a cliente avisar o salão após agendar */
export function clientBookingWhatsAppMessage({ name, service, date, time }) {
  const when = `${formatDateKeyLong(date)} às ${time}`
  return `Olá! Sou ${name}. Agendei ${service} para ${when}.`
}
