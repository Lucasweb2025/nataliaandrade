import { useState, useEffect, useCallback } from 'react'
import {
  fetchPublicGalleryPhotos,
  fetchCloudGalleryPhotos,
  subscribeGalleryPhotos,
} from '../lib/gallery'

export function usePublicGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('static')

  const load = useCallback(() => {
    setLoading(true)
    fetchPublicGalleryPhotos()
      .then(({ images: list, source: src }) => {
        setImages(list)
        setSource(src)
      })
      .catch(() => {
        setImages([])
        setSource('static')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    return subscribeGalleryPhotos(() => {
      fetchPublicGalleryPhotos().then(({ images: list, source: src }) => {
        setImages(list)
        setSource(src)
      })
    })
  }, [load])

  return { images, loading, source, refresh: load }
}

export function usePanelGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetchCloudGalleryPhotos()
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    return subscribeGalleryPhotos(setPhotos)
  }, [load])

  return { photos, loading, refresh: load }
}
