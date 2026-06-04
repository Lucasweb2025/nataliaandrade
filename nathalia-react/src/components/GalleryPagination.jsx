export default function GalleryPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const go = (p) => {
    const next = Math.min(totalPages, Math.max(1, p))
    onPageChange(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className="mt-10 sm:mt-12 flex flex-col items-center gap-4"
      aria-label="Páginas da galeria"
    >
      <p className="text-[10px] font-semibold text-warm-gray uppercase tracking-[0.2em]">
        Página {page} de {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => go(page - 1)}
          className="px-4 py-2 rounded-full border border-gold/20 text-[10px] font-bold uppercase tracking-wider text-warm-gray hover:border-rose-gold/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            className={`min-w-[2.5rem] h-10 rounded-full text-xs font-bold transition-colors ${
              p === page ? 'btn-luxury' : 'border border-gold/20 text-warm-gray hover:border-rose-gold/40'
            }`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => go(page + 1)}
          className="px-4 py-2 rounded-full border border-gold/20 text-[10px] font-bold uppercase tracking-wider text-warm-gray hover:border-rose-gold/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </nav>
  )
}
