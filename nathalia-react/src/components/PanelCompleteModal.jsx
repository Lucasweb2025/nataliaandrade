import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { formatBRL, suggestedServicePrice } from '../lib/pricing'
import { PAYMENT_METHODS } from '../lib/bookingStatus'
import { usePostHog } from '@posthog/react'

function parseAmountInput(raw) {
  const s = String(raw || '').trim().replace(/[^\d,.-]/g, '').replace(',', '.')
  const n = parseFloat(s)
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null
}

function formatAmountInput(value) {
  if (value == null || value === '') return ''
  return Number(value).toFixed(2).replace('.', ',')
}

export default function PanelCompleteModal({ booking, onClose, onSave, saving }) {
  const posthog = usePostHog()
  const suggested = booking ? suggestedServicePrice(booking.service) : 0
  const [amountInput, setAmountInput] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('pix')

  useEffect(() => {
    if (!booking) return
    const existing = booking.amount_paid
    if (booking.status === 'completed' && existing != null) {
      setAmountInput(formatAmountInput(existing))
      setPaymentMethod(booking.payment_method || 'pix')
    } else {
      setAmountInput(suggested > 0 ? formatAmountInput(suggested) : '')
      setPaymentMethod('pix')
    }
  }, [booking, suggested])

  if (!booking) return null

  const amount = parseAmountInput(amountInput)

  const handleSave = () => {
    if (amount == null || amount <= 0) {
      alert('Informe o valor cobrado.')
      return
    }
    if (!paymentMethod) {
      alert('Escolha a forma de pagamento.')
      return
    }
    posthog?.capture('admin_booking_completed', {
      service: booking.service,
      date: booking.date,
      time: booking.time,
      amount_paid: amount,
      payment_method: paymentMethod,
    })
    onSave({ amount_paid: amount, payment_method: paymentMethod })
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="complete-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl border-t-2 border-gold p-6 max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-serif text-xl text-charcoal mb-1 tracking-wide">Atendimento realizado</h3>
          <p className="text-sm text-rose-gold font-medium mb-1">{booking.name}</p>
          <p className="text-xs text-warm-gray mb-6">{booking.service}</p>

          <div className="mb-5">
            <label
              htmlFor="complete-amount"
              className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]"
            >
              Valor cobrado (R$)
            </label>
            <input
              id="complete-amount"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 75,00"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="input-luxury mt-1 text-base"
              autoFocus
            />
            {suggested > 0 && (
              <p className="text-[10px] text-warm-gray mt-2">
                Sugerido: {formatBRL(suggested)}{' '}
                <button
                  type="button"
                  onClick={() => setAmountInput(formatAmountInput(suggested))}
                  className="font-bold text-rose-gold hover:underline"
                >
                  usar este valor
                </button>
              </p>
            )}
            {suggested === 0 && (
              <p className="text-[10px] text-amber-700 mt-2">Digite o valor que você cobrou.</p>
            )}
          </div>

          <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em] mb-2">
            Forma de pagamento
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id)}
                className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  paymentMethod === pm.id ? 'btn-luxury' : 'border border-gold/20 text-warm-gray'
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="flex-1 py-3 rounded-full btn-outline-gold text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="flex-1 py-3 rounded-full btn-luxury text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
