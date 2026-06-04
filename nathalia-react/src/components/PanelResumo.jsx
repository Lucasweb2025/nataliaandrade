import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { isBlockedBooking } from '../lib/bookings'
import { formatBRL, estimateRevenue, serviceCounts } from '../lib/pricing'
import { bookingsExportText } from '../lib/panelFilters'
import { formatDateKeyLabel } from '../lib/dates'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function PanelResumo({ todayList, weekList, monthList }) {
  const [exportOk, setExportOk] = useState(false)

  const todayClients = useMemo(() => todayList.filter((b) => !isBlockedBooking(b)), [todayList])
  const weekClients = useMemo(() => weekList.filter((b) => !isBlockedBooking(b)), [weekList])
  const monthClients = useMemo(() => monthList.filter((b) => !isBlockedBooking(b)), [monthList])

  const revenueToday = estimateRevenue(todayClients)
  const revenueWeek = estimateRevenue(weekClients)
  const revenueMonth = estimateRevenue(monthClients)

  const chartData = useMemo(() => serviceCounts(monthClients, 5), [monthClients])
  const maxCount = chartData[0]?.[1] || 1

  const exportWeek = async () => {
    const text = bookingsExportText(weekClients)
    try {
      await navigator.clipboard.writeText(text)
      setExportOk(true)
      setTimeout(() => setExportOk(false), 2500)
    } catch {
      prompt('Copie a lista:', text)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl text-charcoal tracking-wide mb-1">Resumo</h2>
        <p className="text-xs text-warm-gray">Valores estimados com base na tabela de preços do site.</p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-6">
          <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">Hoje</p>
          <p className="text-2xl font-light text-charcoal">{formatBRL(revenueToday)}</p>
          <p className="text-[10px] text-warm-gray mt-2">{todayClients.length} atendimento(s)</p>
        </motion.div>
        <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-6">
          <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">7 dias</p>
          <p className="text-2xl font-light text-charcoal">{formatBRL(revenueWeek)}</p>
          <p className="text-[10px] text-warm-gray mt-2">{weekClients.length} atendimento(s)</p>
        </motion.div>
        <motion.div variants={fadeUp} className="card-luxury rounded-2xl p-6">
          <p className="text-[9px] font-semibold text-warm-gray uppercase tracking-wider mb-2">30 dias</p>
          <p className="text-2xl font-light text-charcoal">{formatBRL(revenueMonth)}</p>
          <p className="text-[10px] text-warm-gray mt-2">{monthClients.length} atendimento(s)</p>
        </motion.div>
      </motion.div>

      <div className="card-luxury rounded-2xl p-6">
        <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.2em] mb-4">
          Serviços — últimos 30 dias
        </p>
        {chartData.length === 0 ? (
          <p className="text-sm text-warm-gray text-center py-4">Sem dados ainda.</p>
        ) : (
          <ul className="space-y-4">
            {chartData.map(([name, count]) => (
              <li key={name}>
                <div className="flex justify-between text-xs mb-1.5 gap-2">
                  <span className="text-charcoal font-medium truncate">{name}</span>
                  <span className="text-warm-gray shrink-0">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-marble-warm overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-gold/70 to-rose-gold-dark transition-all duration-700"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card-luxury rounded-2xl p-6">
        <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-3">
          Exportar semana
        </p>
        <p className="text-xs text-warm-gray mb-4 leading-relaxed">
          Copia a agenda dos próximos 7 dias para colar no WhatsApp, planilha ou bloco de notas.
        </p>
        <button
          type="button"
          onClick={exportWeek}
          className="btn-outline-gold px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em]"
        >
          {exportOk ? 'Copiado' : 'Copiar lista da semana'}
        </button>
      </div>

      {weekClients.length > 0 && (
        <div className="card-luxury rounded-2xl p-6 overflow-x-auto">
          <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em] mb-3">Prévia</p>
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-warm-gray border-b border-gold/10">
                <th className="pb-2 pr-3 font-semibold">Data</th>
                <th className="pb-2 pr-3 font-semibold">Hora</th>
                <th className="pb-2 pr-3 font-semibold">Cliente</th>
                <th className="pb-2 font-semibold">Serviço</th>
              </tr>
            </thead>
            <tbody>
              {weekClients.slice(0, 8).map((b) => (
                <tr key={b.id} className="border-b border-gold/5 text-charcoal">
                  <td className="py-2 pr-3 whitespace-nowrap">{formatDateKeyLabel(b.date)}</td>
                  <td className="py-2 pr-3">{b.time}</td>
                  <td className="py-2 pr-3">{b.name}</td>
                  <td className="py-2 text-rose-gold-dark">{b.service}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {weekClients.length > 8 && (
            <p className="text-[10px] text-warm-gray mt-3">+{weekClients.length - 8} na exportação completa</p>
          )}
        </div>
      )}
    </div>
  )
}
