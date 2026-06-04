import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePanelGallery } from '../hooks/useGalleryPhotos'
import { uploadGalleryPhoto, deleteGalleryPhoto } from '../lib/gallery'
import { GALLERY_UPLOAD_CATEGORIES } from '../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export default function PanelGaleria() {
  const { photos, loading, refresh } = usePanelGallery()
  const fileRef = useRef(null)
  const [category, setCategory] = useState('Cabelo')
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState(null)

  const showMsg = (text, isError = false) => {
    setMessage({ text, isError })
    setTimeout(() => setMessage(null), 5000)
  }

  const onPickFile = () => fileRef.current?.click()

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      await uploadGalleryPhoto(file, { category })
      await refresh()
      showMsg('Foto publicada na galeria do site.')
    } catch (err) {
      showMsg(err?.message || 'Não foi possível enviar a foto.', true)
    } finally {
      setUploading(false)
    }
  }

  const onDelete = async (photo) => {
    if (!confirm('Remover esta foto da galeria do site?')) return
    setDeletingId(photo.id)
    try {
      await deleteGalleryPhoto(photo)
      await refresh()
      showMsg('Foto removida.')
    } catch (err) {
      showMsg(err?.message || 'Não foi possível remover.', true)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-serif text-xl text-charcoal tracking-wide">Fotos da galeria</h2>
        <p className="text-xs text-warm-gray mt-2 max-w-xl leading-relaxed">
          Envie fotos dos trabalhos (cabelo ou unhas). Elas aparecem no site em{' '}
          <Link to="/galeria" className="text-rose-gold hover:underline">
            Galeria
          </Link>
          . Quando houver fotos aqui, elas substituem as fotos fixas antigas do site.
        </p>
      </div>

      {message && (
        <p
          className={`text-center text-xs font-semibold py-2.5 rounded-full ${
            message.isError ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          {message.text}
        </p>
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="card-luxury rounded-2xl p-5 sm:p-6 space-y-4"
      >
        <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em]">
          Nova foto
        </p>

        <div>
          <label className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.15em]">
            Tipo
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {GALLERY_UPLOAD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  category === cat ? 'btn-luxury' : 'border border-gold/20 text-warm-gray'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          capture="environment"
          className="hidden"
          onChange={onFileChange}
        />

        <button
          type="button"
          disabled={uploading}
          onClick={onPickFile}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-gold/30 text-sm font-semibold text-charcoal hover:border-rose-gold/50 hover:bg-rose-gold-light/30 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Enviando...' : 'Escolher foto do celular ou computador'}
        </button>
        <p className="text-[10px] text-warm-gray-light text-center">
          JPG, PNG ou WebP — a imagem é ajustada automaticamente antes de subir.
        </p>
      </motion.div>

      <div className="space-y-3">
        <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em]">
          Suas fotos ({photos.length})
        </p>

        {loading ? (
          <p className="text-sm text-warm-gray text-center py-8">Carregando...</p>
        ) : photos.length === 0 ? (
          <div className="card-luxury rounded-2xl p-8 text-center text-sm text-warm-gray">
            Nenhuma foto enviada ainda. O site ainda mostra as fotos que o desenvolvedor colocou
            até você publicar a primeira aqui.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="card-luxury rounded-2xl overflow-hidden"
              >
                <div className="aspect-[4/5] bg-marble">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-rose-gold uppercase tracking-wider">
                    {photo.category}
                  </span>
                  <button
                    type="button"
                    disabled={deletingId === photo.id}
                    onClick={() => onDelete(photo)}
                    className="w-full py-2 rounded-full border border-gold/25 text-[10px] font-bold uppercase tracking-wider text-warm-gray hover:border-red-300 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    {deletingId === photo.id ? 'Removendo...' : 'Remover'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
