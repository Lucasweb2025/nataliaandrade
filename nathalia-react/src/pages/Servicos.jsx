import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import ScrollReveal from '../components/ScrollReveal'
import { SERVICES, waLink } from '../lib/constants'

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Servicos() {
  return (
    <PageShell
      eyebrow="Nossos serviços"
      title={
        <>
          Salão de <span className="text-rose-gold italic">beleza</span>
        </>
      }
      subtitle='Valores "a partir de" podem variar conforme comprimento e tipo de cabelo. Toque em Agendar para escolher data e horário.'
      heroExtra={
        <a
          href={waLink('Olá! Gostaria de saber mais sobre os serviços.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-gold inline-flex mt-8 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]"
        >
          Tirar dúvidas no WhatsApp
        </a>
      }
    >
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {SERVICES.map((svc) => (
              <motion.div key={svc.title} variants={staggerItem}>
                <div className="card-luxury rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="font-serif text-lg font-semibold text-charcoal tracking-wide">{svc.title}</h2>
                    <span className="text-[10px] font-semibold text-warm-gray uppercase tracking-wider shrink-0 pt-1">
                      {svc.duration}
                    </span>
                  </div>
                  <p className="font-serif text-xl text-rose-gold-dark mb-3 tracking-wide">{svc.price}</p>
                  <p className="text-sm text-warm-gray leading-relaxed flex-1">{svc.desc}</p>
                  <Link
                    to={`/agenda?s=${encodeURIComponent(svc.title)}`}
                    className="inline-block mt-5 text-[10px] font-bold text-rose-gold uppercase tracking-[0.18em] border-b border-rose-gold/40 hover:border-rose-gold pb-0.5 transition-colors duration-300 self-start"
                  >
                    Agendar
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <ScrollReveal className="mt-14 text-center">
            <p className="text-sm text-warm-gray mb-6 max-w-lg mx-auto leading-relaxed">
              Não encontrou o que procura? Entre em contato — montamos o atendimento ideal para você.
            </p>
            <a
              href={waLink('Olá! Gostaria de informações sobre um serviço.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold inline-flex px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]"
            >
              Falar no WhatsApp
            </a>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
