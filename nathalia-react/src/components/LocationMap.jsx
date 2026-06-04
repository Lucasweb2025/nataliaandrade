import ScrollReveal from './ScrollReveal'
import { ADDRESS, MAPS_URL, MAPS_EMBED_URL } from '../lib/constants'

export default function LocationMap() {
  return (
    <ScrollReveal className="mt-6">
      <div className="rounded-2xl overflow-hidden border border-gold/15 aspect-[16/10] sm:aspect-[2/1] bg-marble">
        <iframe
          title="Localização — Nathalia Andrade Salão de Beleza"
          src={MAPS_EMBED_URL}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="text-[11px] text-warm-gray text-center mt-3">{ADDRESS}</p>
      <p className="text-center mt-2">
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-rose-gold uppercase tracking-wider hover:text-rose-gold-dark transition-colors"
        >
          Abrir rotas no Google Maps
        </a>
      </p>
    </ScrollReveal>
  )
}
