import type { SiteSharedInfo } from '../../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../../data/siteSharedInfoDefaults'

export type FooterBarSocialKind = 'line' | 'facebook' | 'link'

export interface FooterBarSocialLink {
  kind: FooterBarSocialKind
  label: string
  href: string
}

export interface FooterBarData extends Record<string, unknown> {
  brandName: string
  brandUrl: string
  copyrightText: string
  socialLinks: FooterBarSocialLink[]
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function normalizeSocialKind(value: unknown): FooterBarSocialKind | null {
  if (value === 'line' || value === 'facebook' || value === 'link') return value
  return null
}

function normalizeSocialLinks(raw: unknown): FooterBarSocialLink[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => {
      const kind = normalizeSocialKind(item.kind)
      const href = asString(item.href)

      if (!kind || !href) return null

      return {
        kind,
        label: asString(item.label, '前往連結'),
        href,
      }
    })
    .filter((item): item is FooterBarSocialLink => item !== null)
}

/** SiteSharedInfo.socialLinks has no `kind` — default to 'link' when promoting. */
function sharedToFooterLinks(shared: SiteSharedInfo['socialLinks']): FooterBarSocialLink[] {
  return shared
    .filter((item) => item.href)
    .map((item) => ({ kind: 'link' as const, label: item.label || '前往連結', href: item.href }))
}

function resolveCopyrightText(raw: Record<string, unknown>, siteInfo: SiteSharedInfo): string {
  const explicit = asString(raw.copyrightText)
  if (explicit) return explicit

  if (siteInfo.copyrightText) return siteInfo.copyrightText

  const name = siteInfo.projectName
  return name ? `Copyright © ${name}` : 'Copyright © 建案名稱'
}

export function normalizeFooterBar(
  raw: Record<string, unknown>,
  siteInfo: SiteSharedInfo = defaultSiteSharedInfo,
): FooterBarData {
  const rawLinks = normalizeSocialLinks(raw.socialLinks)

  return {
    brandName:     asString(raw.brandName) || siteInfo.brandName || '品牌名稱',
    brandUrl:      asString(raw.brandUrl)  || siteInfo.brandUrl  || '#',
    copyrightText: resolveCopyrightText(raw, siteInfo),
    socialLinks:   rawLinks.length > 0 ? rawLinks : sharedToFooterLinks(siteInfo.socialLinks),
  }
}
