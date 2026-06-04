/** Categorias rápidas no painel (opção A: presets + Outra) */
export const GALLERY_PRESET_CATEGORIES = ['Cabelo', 'Unhas', 'Sobrancelha', 'Salão']

export const GALLERY_OTHER_LABEL = 'Outra'

const PRESET_LOWER = Object.fromEntries(
  GALLERY_PRESET_CATEGORIES.map((p) => [p.toLowerCase(), p])
)

/** Normaliza texto digitado: trim, espaços, primeira letra de cada palavra */
export function normalizeCategoryLabel(raw) {
  const s = String(raw || '')
    .trim()
    .replace(/\s+/g, ' ')
  if (!s) return ''
  return s
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function canonicalCategory(category) {
  const key = String(category || '').trim().toLowerCase()
  return PRESET_LOWER[key] || normalizeCategoryLabel(category)
}

/** Preset selecionado ou categoria customizada (2–40 caracteres) */
export function resolveUploadCategory(preset, customText) {
  if (preset !== GALLERY_OTHER_LABEL) {
    if (!GALLERY_PRESET_CATEGORIES.includes(preset)) {
      throw new Error('Escolha um tipo de foto.')
    }
    return preset
  }

  const label = normalizeCategoryLabel(customText)
  if (label.length < 2) {
    throw new Error('Digite o nome da categoria (mínimo 2 letras).')
  }
  if (label.length > 40) {
    throw new Error('Categoria muito longa (máximo 40 caracteres).')
  }
  if (GALLERY_PRESET_CATEGORIES.some((p) => p.toLowerCase() === label.toLowerCase())) {
    throw new Error('Use o botão da categoria em vez de digitar o mesmo nome.')
  }
  return label
}

export function defaultAltForCategory(category) {
  switch (canonicalCategory(category)) {
    case 'Cabelo':
      return 'Trabalho capilar'
    case 'Unhas':
      return 'Manicure'
    case 'Sobrancelha':
      return 'Design de sobrancelha'
    case 'Salão':
      return 'Salão Nathalia Andrade'
    default:
      return category ? `Trabalho — ${category}` : 'Trabalho'
  }
}

/** Filtros da galeria pública: Todos + presets com foto + categorias custom */
export function buildGalleryFilterCategories(images) {
  const filters = ['Todos']
  const custom = new Set()

  GALLERY_PRESET_CATEGORIES.forEach((preset) => {
    const has = images.some(
      (img) => canonicalCategory(img.category) === preset
    )
    if (has) filters.push(preset)
  })

  images.forEach((img) => {
    const c = canonicalCategory(img.category)
    if (!c || GALLERY_PRESET_CATEGORIES.includes(c)) return
    custom.add(c)
  })

  return [...filters, ...[...custom].sort((a, b) => a.localeCompare(b, 'pt-BR'))]
}

export function matchesGalleryCategory(img, filter) {
  if (filter === 'Todos') return true
  return canonicalCategory(img.category) === filter
}
