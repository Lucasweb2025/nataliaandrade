import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { GALLERY_IMAGES } from '../lib/constants'

const PLACEHOLDERS = [
  { label: 'Ambiente do salão' },
  { label: 'Tratamentos capilares' },
  { label: 'Detalhes e acabamento' },
]

export default function Gallery({ hideHeader = false }) {
  const hasPhotos = GALLERY_IMAGES.length > 0

  return (
    <section id="galeria" className={`bg-white ${hideHeader ? 'py-12 sm:py-16' : 'py-20 sm:py-28 scroll-mt-24'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {!hideHeader && (
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-4">Galeria</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-wide">
              Conheça o <span className="text-rose-gold italic">espaço</span>
            </h2>
            <p className="text-sm text-warm-gray mt-4 max-w-lg mx-auto leading-relaxed">
              {hasPhotos
                ? 'Fotos reais do nosso salão e dos nossos trabalhos.'
                : 'Em breve, fotos do salão e dos trabalhos realizados.'}
            </p>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {hasPhotos
            ? GALLERY_IMAGES.map((img, i) => (
                <motion.figure
                  key={img.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="aspect-[4/5] rounded-2xl overflow-hidden border border-gold/15 bg-marble"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.figure>
              ))
            : PLACEHOLDERS.map((item, i) => (
                <div
                  key={item.label}
                  className="aspect-[4/5] rounded-2xl border border-dashed border-gold/25 bg-marble flex flex-col items-center justify-center p-6 text-center"
                >
                  <span className="font-serif text-4xl text-gold/25 mb-3">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-xs font-semibold text-warm-gray uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
