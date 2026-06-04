import PageShell from '../components/PageShell'
import Gallery from '../components/Gallery'
import { INSTAGRAM_URL } from '../lib/constants'

export default function Galeria() {
  return (
    <PageShell
      eyebrow="Galeria"
      title={
        <>
          Conheça o <span className="text-rose-gold italic">espaço</span>
        </>
      }
      subtitle="Fotos do salão e dos trabalhos realizados. Em breve, mais imagens reais do ateliê."
      heroExtra={
        INSTAGRAM_URL ? (
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold inline-flex mt-8 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]"
          >
            Ver no Instagram
          </a>
        ) : null
      }
    >
      <Gallery hideHeader />
    </PageShell>
  )
}
