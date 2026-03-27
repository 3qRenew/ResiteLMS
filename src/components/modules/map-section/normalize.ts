export type MapSectionHeightMode = 'sm' | 'md' | 'lg' | 'custom'

export interface MapSectionData extends Record<string, unknown> {
  title: string
  address: string
  mapLink: string
  embedUrl: string
  heightMode: MapSectionHeightMode
  customHeightPx: number
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function normalizeHeightMode(value: unknown): MapSectionHeightMode {
  return value === 'sm' || value === 'md' || value === 'lg' || value === 'custom'
    ? value
    : 'md'
}

function normalizeCustomHeightPx(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(1200, Math.max(240, Math.round(value)))
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) {
      return Math.min(1200, Math.max(240, parsed))
    }
  }

  return 480
}

function sanitizeEmbedUrl(value: unknown): string {
  const url = asString(value)
  if (!url) return ''

  const lower = url.toLowerCase()
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('//')
  ) {
    return url
  }

  return ''
}

export function normalizeMapSection(raw: Record<string, unknown>): MapSectionData {
  return {
    title: asString(raw.title, '地圖位置'),
    address: asString(raw.address),
    mapLink: asString(raw.mapLink, '#') || '#',
    embedUrl: sanitizeEmbedUrl(raw.embedUrl),
    heightMode: normalizeHeightMode(raw.heightMode),
    customHeightPx: normalizeCustomHeightPx(raw.customHeightPx),
  }
}
