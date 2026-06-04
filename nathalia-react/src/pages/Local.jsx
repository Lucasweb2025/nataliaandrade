import PageShell from '../components/PageShell'
import ScrollReveal from '../components/ScrollReveal'
import LocationMap from '../components/LocationMap'
import { ADDRESS, MAPS_URL, PHONE_DISPLAY, HOURS_LABEL, waLink } from '../lib/constants'

const HOURS = [
  ['Segunda-feira', 'Fechado', true],
  ['Terça a Sexta', '9h às 19h', false],
  ['Sábado', '9h às 19h', false],
  ['Domingo', 'Fechado', true],
]

export default function Local() {
  return (
    <PageShell
      eyebrow="Localização"
      title="Ateliê de Beleza"
      subtitle={ADDRESS}
      heroExtra={
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-gold inline-flex mt-8 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]"
        >
          Abrir no Google Maps
        </a>
      }
    >
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ScrollReveal>
              <div className="card-luxury rounded-2xl p-8 sm:p-10 h-full">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">Horário</p>
                <p className="text-sm text-warm-gray mb-6">{HOURS_LABEL}</p>
                <div className="space-y-3.5">
                  {HOURS.map(([day, time, closed]) => (
                    <div key={day} className="flex justify-between text-sm border-b border-gold/8 pb-3">
                      <span className="text-warm-gray">{day}</span>
                      <span className={`font-medium ${closed ? 'text-warm-gray-light' : 'text-charcoal'}`}>
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="card-luxury rounded-2xl p-8 sm:p-10 h-full flex flex-col">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">Contato</p>
                <p className="text-sm text-warm-gray leading-relaxed mb-4 flex-1">{ADDRESS}</p>
                <p className="text-sm font-semibold text-charcoal mb-6">{PHONE_DISPLAY}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={waLink('Olá! Gostaria de saber como chegar ao salão.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury text-center px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold text-center px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em]"
                  >
                    Como chegar
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <LocationMap />
        </div>
      </section>
    </PageShell>
  )
}
