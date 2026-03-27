import type { SiteSharedInfo } from '../../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../../data/siteSharedInfoDefaults'

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

export function normalizeReNavbar(
  raw: Record<string, unknown>,
  siteInfo: SiteSharedInfo = defaultSiteSharedInfo,
): ReNavbarData {
  const d = raw as ReNavbarRawData

  // logoImage / logoAlt: raw > siteInfo > hardcoded default (both branches)
  const logoImage = d.logoImage ?? siteInfo.projectLogoUrl ?? ''
  const logoAlt   = d.logoAlt   ?? siteInfo.projectName    ?? '建案名稱'

  // If Codex-normalized actions[] already exist, use them directly (actions整包優先)
  if (Array.isArray(d.actions) && d.actions.length > 0) {
    return { logoImage, logoAlt, actions: d.actions }
  }

  // Flat fields path — derive actions with shared fallbacks
  const resolvedPhone = d.phoneNumber ?? siteInfo.phone ?? ''

  const actions: NavAction[] = [
    {
      kind:     'phone',
      href:     d.phonePath || (resolvedPhone ? `tel:${resolvedPhone}` : 'tel:'),
      label:    '貴賓專線',
      sublabel: resolvedPhone,
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
      href:     d.mapsUrl || siteInfo.mapLink || '#',
      label:    '地圖導航',
      sublabel: 'GoogleMap',
      external: true,
    },
    {
      kind:     'booking',
      href:     d.bookingLink || (siteInfo.formAnchorId ? `#${siteInfo.formAnchorId}` : '#contact'),
      label:    '立即預約',
      sublabel: 'Booking',
      external: false,
    },
  ]

  return { logoImage, logoAlt, actions }
}
