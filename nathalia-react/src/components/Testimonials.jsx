import ScrollReveal from './ScrollReveal'
import { TESTIMONIALS } from '../lib/constants'

export default function Testimonials() {
  if (!TESTIMONIALS.length) return null

  return (
    <section id="depoimentos" className="py-20 sm:py-28 marble-bg scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-4">Depoimentos</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-wide">
            O que dizem nossas <span className="text-rose-gold italic">clientes</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <blockquote className="card-luxury rounded-2xl p-8 h-full flex flex-col">
                <p className="font-serif text-lg text-charcoal italic leading-relaxed flex-1 mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer>
                  <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                  <p className="text-[11px] text-rose-gold font-medium mt-0.5">{t.service}</p>
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
