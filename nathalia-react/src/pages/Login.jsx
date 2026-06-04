import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LOGO_URL } from '../lib/constants'

export default function Login() {
  const { signIn, isAuthenticated, loading, authEnabled } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to="/painel" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate('/painel', { replace: true })
    } catch (err) {
      setError(err?.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : 'Nao foi possivel entrar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen marble-bg flex flex-col">
      <header className="px-5 py-6 flex justify-between items-center max-w-lg mx-auto w-full">
        <Link to="/" className="text-[10px] font-semibold text-warm-gray uppercase tracking-wider hover:text-rose-gold transition-colors">
          Voltar ao site
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <img src={LOGO_URL} alt="Nathalia Andrade" className="h-24 mx-auto mb-6" />
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-2">
              Area restrita
            </p>
            <h1 className="font-serif text-2xl text-charcoal tracking-wide">Painel do salao</h1>
            <p className="text-sm text-warm-gray mt-2">Entre com e-mail e senha</p>
          </div>

          {!authEnabled ? (
            <p className="text-sm text-center text-warm-gray card-luxury rounded-2xl p-6">
              Supabase nao configurado neste ambiente.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="card-luxury rounded-2xl p-8 space-y-5">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <div>
                <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">E-mail</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury mt-1"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">Senha</label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-luxury mt-1"
                  placeholder="********"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-luxury py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] disabled:opacity-60"
              >
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  )
}
