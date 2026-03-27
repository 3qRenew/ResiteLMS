// Normalize — ImageGallery (module_type: image_gallery)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.

export interface ImageGalleryData {
  sectionLabel: string
  title:        string
  description1: string
  description2: string
  description3: string
  image1:       string
  image2:       string
  image3:       string
  imageCaption: string
}

export function normalizeImageGallery(raw: Record<string, unknown>): ImageGalleryData {
  return {
    sectionLabel: String(raw.sectionLabel ?? ''),
    title:        String(raw.title        ?? ''),
    description1: String(raw.description1 ?? ''),
    description2: String(raw.description2 ?? ''),
    description3: String(raw.description3 ?? ''),
    image1:       String(raw.image1       ?? ''),
    image2:       String(raw.image2       ?? ''),
    image3:       String(raw.image3       ?? ''),
    imageCaption: String(raw.imageCaption ?? ''),
  }
}
