// ── Data models ───────────────────────────────────────────────────────────────

export interface ReNavbarRawData {
  logoImage?:   string
  logoAlt?:     string
  phoneNumber?: string
  phonePath?:   string
  facebookUrl?: string
  mapsUrl?:     string
  bookingLink?: string
  /** Legacy: Codex pre-normalized actions array */
  actions?: NavAction[]
}

export interface NavAction {
  kind:      'phone' | 'facebook' | 'map' | 'booking'
  href:      string
  label:     string
  sublabel?: string
  external?: boolean
}

export interface ReNavbarData {
  logoImage: string
  logoAlt:   string
  actions:   NavAction[]
}

// ── Normalize ─────────────────────────────────────────────────────────────────

export function normalizeReNavbar(raw: Record<string, unknown>): ReNavbarData {
  const d = raw as ReNavbarRawData

  // If Codex-normalized actions[] already exist, use them directly
  if (Array.isArray(d.actions) && d.actions.length > 0) {
    return {
      logoImage: d.logoImage ?? '',
      logoAlt:   d.logoAlt ?? '建案名稱',
      actions:   d.actions,
    }
  }

  // Derive actions from raw flat fields
  const actions: NavAction[] = [
    {
      kind:     'phone',
      href:     d.phonePath || (d.phoneNumber ? `tel:${d.phoneNumber}` : 'tel:'),
      label:    '貴賓專線',
      sublabel: d.phoneNumber ?? '',
      external: false,
    },
    {
      kind:     'facebook',
      href:     d.facebookUrl || '#',
      label:    '粉絲專頁',
      sublabel: 'FaceBook',
      external: true,
    },
    {
      kind:     'map',
      href:     d.mapsUrl || '#',
      label:    '地圖導航',
      sublabel: 'GoogleMap',
      external: true,
    },
    {
      kind:     'booking',
      href:     d.bookingLink || '#contact',
      label:    '立即預約',
      sublabel: 'Booking',
      external: false,
    },
  ]

  return {
    logoImage: d.logoImage ?? '',
    logoAlt:   d.logoAlt ?? '建案名稱',
    actions,
  }
}
