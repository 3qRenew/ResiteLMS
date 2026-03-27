import { defaultSiteSharedInfo } from '../../../data/siteSharedInfoDefaults'
import type { SiteSharedInfo } from '../../../types/siteSharedInfo'

export type ContactCTAKind = 'form' | 'phone' | 'map' | 'link'

interface ContactCTAItemRaw {
  kind?: unknown
  label?: unknown
  description?: unknown
  href?: unknown
  disabled?: unknown
  external?: unknown
}

export interface ContactCTAItem {
  kind: ContactCTAKind
  label: string
  description: string
  href: string
  disabled: boolean
  external: boolean
}

export interface ContactCTAData extends Record<string, unknown> {
  heading: string
  description: string
  items: ContactCTAItem[]
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function normalizeKind(value: unknown): ContactCTAKind {
  return value === 'form' || value === 'phone' || value === 'map' || value === 'link'
    ? value
    : 'link'
}

function normalizeAnchor(anchorId: string): string {
  if (!anchorId) return '#'
  return anchorId.startsWith('#') ? anchorId : `#${anchorId}`
}

function normalizePhoneHref(phone: string): string {
  return phone ? `tel:${phone}` : '#'
}

function createDefaultItems(siteInfo: SiteSharedInfo): ContactCTAItem[] {
  return [
    {
      kind: 'form',
      label: '表單預約',
      description: '立即留下資訊',
      href: normalizeAnchor(siteInfo.formAnchorId),
      disabled: false,
      external: false,
    },
    {
      kind: 'phone',
      label: '電話聯絡',
      description: siteInfo.phone || '貴賓專線',
      href: normalizePhoneHref(siteInfo.phone),
      disabled: false,
      external: false,
    },
    {
      kind: 'map',
      label: '接待位置',
      description: siteInfo.receptionAddress || '查看地圖',
      href: siteInfo.mapLink || '#',
      disabled: false,
      external: true,
    },
  ]
}

function normalizeItem(raw: ContactCTAItemRaw): ContactCTAItem {
  const kind = normalizeKind(raw.kind)
  const fallbackExternal = kind === 'map' || kind === 'link'

  return {
    kind,
    label: asString(raw.label, '前往連結'),
    description: asString(raw.description),
    href: asString(raw.href, '#') || '#',
    disabled: asBoolean(raw.disabled, false),
    external: asBoolean(raw.external, fallbackExternal),
  }
}

export function normalizeContactCTA(
  raw: Record<string, unknown>,
  siteInfo: SiteSharedInfo = defaultSiteSharedInfo,
): ContactCTAData {
  const rawItems = Array.isArray(raw.items) ? raw.items : []
  const normalizedItems = rawItems
    .filter((item): item is ContactCTAItemRaw => typeof item === 'object' && item !== null)
    .map((item) => normalizeItem(item))

  return {
    heading: asString(raw.heading, '聯絡我們'),
    description: asString(raw.description, '選擇最適合你的聯絡方式，我們會盡快回覆。'),
    items: normalizedItems.length > 0 ? normalizedItems : createDefaultItems(siteInfo),
  }
}
