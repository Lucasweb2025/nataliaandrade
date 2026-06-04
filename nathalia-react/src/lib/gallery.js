import { supabase, isSupabaseConfigured } from './supabase'
import { STATIC_GALLERY_IMAGES } from './constants'
import { normalizeCategoryLabel, defaultAltForCategory } from './galleryCategories'

export const GALLERY_BUCKET = 'galeria'
const TABLE = 'galeria_fotos'
const MAX_INPUT_BYTES = 12 * 1024 * 1024
const MAX_EDGE = 1600

export function galleryPublicUrl(storagePath) {
  if (!isSupabaseConfigured) return ''
  const base = import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, '')
  return `${base}/storage/v1/object/public/${GALLERY_BUCKET}/${storagePath}`
}

function fromRow(row) {
  return {
    id: row.id,
    src: galleryPublicUrl(row.storage_path),
    alt: row.alt,
    category: row.category,
    storagePath: row.storage_path,
    sortOrder: row.sort_order,
    cloud: true,
  }
}

export async function fetchCloudGalleryPhotos() {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, storage_path, category, alt, sort_order, created_at')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Galeria fetch:', error.message)
    return []
  }

  return (data || []).map(fromRow)
}

/** Fotos exibidas no site: nuvem se houver; senão as fixas do deploy */
export async function fetchPublicGalleryPhotos() {
  const cloud = await fetchCloudGalleryPhotos()
  if (cloud.length > 0) return { images: cloud, source: 'cloud' }
  return { images: STATIC_GALLERY_IMAGES, source: 'static' }
}

function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Arquivo de imagem inválido.'))
    }
    img.src = url
  })
}

/** Reduz tamanho antes do upload (celular costuma mandar fotos enormes) */
export async function prepareGalleryImage(file) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Envie uma imagem (JPG, PNG ou WebP).')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande. Use uma foto de até 12 MB.')
  }

  const img = await readFileAsImage(file)
  let { width, height } = img
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  width = Math.round(width * scale)
  height = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Não foi possível processar a imagem.'))),
      'image/jpeg',
      0.85
    )
  })

  return { blob, contentType: 'image/jpeg', extension: 'jpg' }
}

export async function uploadGalleryPhoto(file, { category, alt }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase não configurado.')
  }

  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new Error('Faça login no painel para enviar fotos.')
  }

  const label = normalizeCategoryLabel(category)
  if (label.length < 2 || label.length > 40) {
    throw new Error('Categoria inválida (2 a 40 caracteres).')
  }

  const { blob, contentType, extension } = await prepareGalleryImage(file)
  const storagePath = `${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(storagePath, blob, { contentType, upsert: false })

  if (uploadError) throw uploadError

  const { data, error: insertError } = await supabase
    .from(TABLE)
    .insert({
      storage_path: storagePath,
      category: label,
      alt: (alt || '').trim() || defaultAltForCategory(label),
      sort_order: Date.now(),
    })
    .select('id, storage_path, category, alt, sort_order, created_at')
    .single()

  if (insertError) {
    await supabase.storage.from(GALLERY_BUCKET).remove([storagePath])
    throw insertError
  }

  return fromRow(data)
}

export async function deleteGalleryPhoto(photo) {
  if (!photo?.id || !photo.storagePath) return
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase não configurado.')
  }

  const { error: storageError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .remove([photo.storagePath])

  if (storageError) throw storageError

  const { error } = await supabase.from(TABLE).delete().eq('id', photo.id)
  if (error) throw error
}

export function subscribeGalleryPhotos(onChange) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  const channel = supabase
    .channel('galeria-fotos-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE },
      () => {
        fetchCloudGalleryPhotos().then(onChange).catch(() => {})
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
