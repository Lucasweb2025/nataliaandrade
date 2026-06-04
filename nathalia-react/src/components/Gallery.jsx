import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import GalleryLightbox from './GalleryLightbox'
import { GALLERY_CATEGORIES } from '../lib/constants'
import { usePublicGallery } from '../hooks/useGalleryPhotos'

export default function Gallery({ hideHeader = false }) {
  const { images, loading } = usePublicGallery()
  const hasPhotos = images.length > 0
  const [category, setCategory] = useState('Todos')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered = useMemo(() => {
    if (category === 'Todos') return images
    return images.filter((img) => img.category === category)
  }, [images, category])

  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
  const goNext = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length))

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
              {loading
                ? 'Carregando fotos...'
                : hasPhotos
                  ? 'Resultados reais de cabelo e unhas — feitos com carinho no salão.'
                  : 'Em breve, fotos dos trabalhos realizados.'}
            </p>
          </ScrollReveal>
        )}

        {hasPhotos && !loading && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategory(cat); setLightboxIndex(null) }}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  category === cat ? 'btn-luxury' : 'border border-gold/20 text-warm-gray hover:border-rose-gold/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-sm text-warm-gray py-12">Carregando galeria...</p>
        ) : hasPhotos && filtered.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
            {filtered.map((img, i) => (
              <motion.figure
                key={img.id || img.src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i * 0.07, 0.5), duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="w-full text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold/50 rounded-2xl sm:rounded-3xl"
                  aria-label={`Ampliar: ${img.alt}`}
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
                </button>
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
        ) : hasPhotos ? (
          <p className="text-center text-sm text-warm-gray">Nenhuma foto nesta categoria.</p>
        ) : (
          <p className="text-center text-sm text-warm-gray">Fotos em breve.</p>
        )}

        <GalleryLightbox
          images={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>
    </section>
  )
}
