/**
 * MODULE_REGISTRY — Registry v3.1
 *
 * Every entry is a complete ModuleDefinition<T>:
 *   type        — module_type key stored in DB
 *   normalize   — pure function: raw JSON → typed data (never identity for active modules)
 *   defaultData — used when creating a new module of this type
 *   Component   — lazy-loaded React component
 *
 * Normalize files (.normalize.ts) are imported STATICALLY (lightweight, no React deps).
 * Component files are imported DYNAMICALLY via lazy() for code-splitting.
 *
 * Deprecated modules use LegacyModuleAdapter:
 *   normalize = identity, defaultData = {} (never created fresh, only rendered from DB).
 */
import { lazy } from 'react'
import type { ComponentType } from 'react'
import type { ModuleDefinition, ModuleProps } from '../../types/module'

// ── Normalize functions (static imports — no heavy UI deps) ───────────────────
import { normalizeReNavbar }         from './re-navbar/normalize'
import { normalizeFeatures }         from './Features.normalize'
import { normalizeContactForm }      from './ContactForm.normalize'
import { normalizeContactCTA }       from './contact-cta/normalize'
import { normalizeHeroBanner }       from './HeroBanner'
import { normalizeTextImageBlock }   from './special/SjsTextImageBlock.normalize'
import { normalizeImageGallery }     from './ImageGallery.normalize'
import { normalizePropertyInfo }     from './PropertyInfo.normalize'
import { normalizeMapSection }       from './map-section/normalize'
import { normalizeFooterBar }       from './footer-bar/normalize'
import { normalizeAerialView }       from './special/SjsAerialView.normalize'
import { normalizeVideoSection }     from './VideoSection.normalize'

// ── Default data (static imports — shared with SPECIAL_MODULE_DEFAULTS) ───────
import {
  MODULE_DEFAULTS,
  SPECIAL_MODULE_DEFAULTS,
} from '../../data/moduleDefaults'

// Re-export so existing `import type { ModuleProps } from './index'` still works.
export type { ModuleProps }

// ── LegacyModuleAdapter ───────────────────────────────────────────────────────
// Wraps a bare ComponentType into a full ModuleDefinition for deprecated modules.
// • normalize  — identity (raw data passes through unchanged)
// • defaultData — {} (deprecated modules are never created fresh)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LegacyModuleAdapter(
  type: string,
  Component: ComponentType<ModuleProps>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ModuleDefinition<any> {
  return {
    type,
    normalize: (raw) => raw,
    defaultData: {},
    Component,
  }
}

// ── Active modules (Registry v3) — 出現在新增選單 ─────────────────────────────
//
// Registry is a runtime dispatch table; ModuleDefinition<any> is intentional here.
// Strong typing lives inside each normalize file and component.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MODULE_REGISTRY: Record<string, ModuleDefinition<any>> = {

  // ── 通用積木 ──────────────────────────────────────────────────────────────
  features: {
    type:        'features',
    normalize:   normalizeFeatures,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    defaultData: MODULE_DEFAULTS['features'].data,
    Component:   lazy(() => import('./Features').then((m) => ({ default: m.Features }))),
  },
  contact_form: {
    type:        'contact_form',
    normalize:   normalizeContactForm,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    defaultData: MODULE_DEFAULTS['contact_form'].data,
    Component:   lazy(() => import('./ContactForm').then((m) => ({ default: m.ContactForm }))),
  },
  contact_cta: {
    type:        'contact_cta',
    normalize:   normalizeContactCTA,
    defaultData: SPECIAL_MODULE_DEFAULTS['contact_cta'].data,
    Component:   lazy(() => import('./contact-cta').then((m) => ({ default: m.ContactCTA }))),
  },

  // ── 主力積木（v3）────────────────────────────────────────────────────────
  re_navbar: {
    type:        're_navbar',
    normalize:   normalizeReNavbar,
    defaultData: SPECIAL_MODULE_DEFAULTS['re_navbar'].data,
    Component:   lazy(() => import('./re-navbar').then((m) => ({ default: m.ReNavbar }))),
  },
  hero_banner: {
    type:        'hero_banner',
    normalize:   normalizeHeroBanner,
    defaultData: SPECIAL_MODULE_DEFAULTS['hero_banner'].data,
    Component:   lazy(() => import('./HeroBanner').then((m) => ({ default: m.HeroBanner }))),
  },
  content_block: {
    type:        'content_block',
    normalize:   normalizeTextImageBlock,
    defaultData: SPECIAL_MODULE_DEFAULTS['content_block'].data,
    Component:   lazy(() => import('./special/SjsTextImageBlock').then((m) => ({ default: m.SjsTextImageBlock }))),
  },
  image_gallery: {
    type:        'image_gallery',
    normalize:   normalizeImageGallery,
    defaultData: SPECIAL_MODULE_DEFAULTS['image_gallery'].data,
    Component:   lazy(() => import('./ImageGallery').then((m) => ({ default: m.ImageGallery }))),
  },
  property_info: {
    type:        'property_info',
    normalize:   normalizePropertyInfo,
    defaultData: SPECIAL_MODULE_DEFAULTS['property_info'].data,
    Component:   lazy(() => import('./PropertyInfo').then((m) => ({ default: m.PropertyInfo }))),
  },
  map_section: {
    type:        'map_section',
    normalize:   normalizeMapSection,
    defaultData: SPECIAL_MODULE_DEFAULTS['map_section'].data,
    Component:   lazy(() => import('./map-section').then((m) => ({ default: m.MapSection }))),
  },
  footer_bar: {
    type:        'footer_bar',
    normalize:   normalizeFooterBar,
    defaultData: SPECIAL_MODULE_DEFAULTS['footer_bar'].data,
    Component:   lazy(() => import('./footer-bar').then((m) => ({ default: m.FooterBar }))),
  },
  aerial_view: {
    type:        'aerial_view',
    normalize:   normalizeAerialView,
    defaultData: SPECIAL_MODULE_DEFAULTS['aerial_view'].data,
    Component:   lazy(() => import('./special/SjsAerialView').then((m) => ({ default: m.SjsAerialView }))),
  },
  video_section: {
    type:        'video_section',
    normalize:   normalizeVideoSection,
    defaultData: SPECIAL_MODULE_DEFAULTS['video_section'].data,
    Component:   lazy(() => import('./VideoSection').then((m) => ({ default: m.VideoSection }))),
  },

  // ── 廢棄模組（僅保留以渲染舊存檔，不出現在新增選單）─────────────────────
  navbar:                 LegacyModuleAdapter('navbar',                 lazy(() => import('./Navbar').then((m) => ({ default: m.Navbar })))),
  hero_standard:          LegacyModuleAdapter('hero_standard',          lazy(() => import('./HeroStandard').then((m) => ({ default: m.HeroStandard })))),
  sjs_banner:             LegacyModuleAdapter('sjs_banner',             lazy(() => import('./HeroBanner').then((m) => ({ default: m.HeroBanner })))),
  sjs_navbar:             LegacyModuleAdapter('sjs_navbar',             lazy(() => import('./re-navbar').then((m) => ({ default: m.ReNavbar })))),
  sjs_content_block:      LegacyModuleAdapter('sjs_content_block',      lazy(() => import('./SjsContentBlock').then((m) => ({ default: m.SjsContentBlock })))),
  sjs_gallery3:           LegacyModuleAdapter('sjs_gallery3',           lazy(() => import('./ImageGallery').then((m) => ({ default: m.ImageGallery })))),
  sjs_property_info:      LegacyModuleAdapter('sjs_property_info',      lazy(() => import('./PropertyInfo').then((m) => ({ default: m.PropertyInfo })))),
  sjs_aerial_view:        LegacyModuleAdapter('sjs_aerial_view',        lazy(() => import('./special/SjsAerialView').then((m) => ({ default: m.SjsAerialView })))),
  sjs_text_image_section: LegacyModuleAdapter('sjs_text_image_section', lazy(() => import('./special/SjsTextImageBlock').then((m) => ({ default: m.SjsTextImageBlock })))),
  sjs_text_image:         LegacyModuleAdapter('sjs_text_image',         lazy(() => import('./special/SjsTextImageSection').then((m) => ({ default: m.SjsTextImageSection })))),
  sjs_image_carousel:     LegacyModuleAdapter('sjs_image_carousel',     lazy(() => import('./special/SjsImageCarousel').then((m) => ({ default: m.SjsImageCarousel })))),
  sjs_sky_map:            LegacyModuleAdapter('sjs_sky_map',            lazy(() => import('./special/SjsSkyMapSection').then((m) => ({ default: m.SjsSkyMapSection })))),
}
