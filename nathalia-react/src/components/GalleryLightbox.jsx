import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GalleryLightbox({ images, index, onClose, onPrev, onNext }) {
  const open = index !== null && index >= 0 && index < images.length
  const img = open ? images[index] : null

  const onKey = useCallback(
    (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [open, onClose, onPrev, onNext]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={img.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white text-xl hover:bg-white/20 transition-colors"
            aria-label="Fechar"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPrev() }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-colors"
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 transition-colors"
                aria-label="Próxima"
              >
                ›
              </button>
            </>
          )}
          <motion.figure
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="max-w-lg w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-white/90 text-sm">
              {img.category && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-gold-light block mb-1">
                  {img.category}
                </span>
              )}
              <span className="text-xs text-white/60">
                {index + 1} / {images.length}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
