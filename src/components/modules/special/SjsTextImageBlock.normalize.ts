// Normalize — SjsTextImageBlock (module_type: content_block)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.

export interface ContentBlockImage {
  url:      string
  caption?: string
}

export interface TextImageBlockData {
  sectionLabel:    string
  title:           string
  subtitle:        string
  description:     string
  images:          ContentBlockImage[]
  imagePosition:   'left' | 'right' | 'top'
  backgroundColor: string
}

function parseImages(raw: unknown): ContentBlockImage[] {
  if (Array.isArray(raw)) return raw as ContentBlockImage[]
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as ContentBlockImage[] } catch { return [] }
  }
  return []
}

export function normalizeTextImageBlock(raw: Record<string, unknown>): TextImageBlockData {
  const pos = raw.imagePosition as string
  return {
    sectionLabel:    String(raw.sectionLabel    ?? ''),
    title:           String(raw.title           ?? ''),
    subtitle:        String(raw.subtitle        ?? ''),
    description:     String(raw.description     ?? ''),
    images:          parseImages(raw.images ?? []),
    imagePosition:   (['left', 'right', 'top'].includes(pos) ? pos : 'left') as 'left' | 'right' | 'top',
    backgroundColor: String(raw.backgroundColor || '#ffffff'),
  }
}
