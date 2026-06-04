import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { GALLERY_IMAGES } from '../lib/constants'

export default function Gallery({ hideHeader = false }) {
  const hasPhotos = GALLERY_IMAGES.length > 0

  return (
    <section id="galeria" className={`bg-white ${hideHeader ? 'py-12 sm:py-16' : 'py-20 sm:py-28 scroll-mt-24'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {!hideHeader && (
          <ScrollReveal className="text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-4">Galeria</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-wide">
              Nossos <span className="text-rose-gold italic">trabalhos</span>
            </h2>
            <p className="text-sm text-warm-gray mt-4 max-w-lg mx-auto leading-relaxed">
              {hasPhotos
                ? 'Resultados reais de cabelo e unhas — feitos com carinho no salão.'
                : 'Em breve, fotos dos trabalhos realizados.'}
            </p>
          </ScrollReveal>
        )}

        {hasPhotos ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.figure
                key={img.src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i * 0.07, 0.5), duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/10 bg-marble shadow-[0_8px_30px_-12px_rgba(61,43,31,0.12)] transition-shadow duration-500 group-hover:shadow-[0_16px_40px_-12px_rgba(61,43,31,0.18)]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
                {img.category && (
                  <figcaption className="mt-2.5 text-center">
                    <span className="text-[10px] font-semibold text-warm-gray-light uppercase tracking-[0.2em]">
                      {img.category}
                    </span>
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-warm-gray">Fotos em breve.</p>
        )}
      </div>
    </section>
  )
}
