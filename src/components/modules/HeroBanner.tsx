// Pure View — 主視覺 Banner（全螢幕背景圖 + Logo + 標題 + CTA）
//
// Data flow:
//   raw module.data (Record<string, unknown>)
//     → normalizeHeroBanner()   ← explicit, testable
//     → HeroBannerData          ← typed, safe
//     → render
//
// Backward compat: sjs_banner keys in the registry resolve here;
// normalizeHeroBanner accepts the same field names SjsBanner used.
import type { ModuleProps } from './index'

// ── Normalize ─────────────────────────────────────────────────────────────────

export interface HeroBannerData {
  backgroundImage: string
  logoImage:       string
  propertyName:    string
  brandName:       string
  tagline:         string
  ctaLabel:        string
  ctaHref:         string
}

export function normalizeHeroBanner(raw: Record<string, unknown>): HeroBannerData {
  return {
    backgroundImage: String(raw.backgroundImage ?? ''),
    logoImage:       String(raw.logoImage       ?? ''),
    propertyName:    String(raw.propertyName    ?? ''),
    brandName:       String(raw.brandName       ?? ''),
    tagline:         String(raw.tagline         ?? ''),
    ctaLabel:        String(raw.ctaLabel        ?? ''),
    ctaHref:         String(raw.ctaHref         ?? '#'),
  }
}

// ── View ──────────────────────────────────────────────────────────────────────

export function HeroBanner({ module }: ModuleProps) {
  const d = normalizeHeroBanner(module.data as Record<string, unknown>)

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#c9c9c9' }}
    >
      {/* 背景圖 */}
      {d.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${d.backgroundImage})` }}
        />
      )}
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 內容 */}
      <div className="relative z-10 text-center px-6 text-white flex flex-col items-center gap-6">
        {d.logoImage && (
          <img src={d.logoImage} alt={d.propertyName} className="w-40 object-contain" />
        )}

        <h1
          className="text-6xl md:text-8xl font-bold tracking-widest"
          style={{ fontFamily: "'Noto Serif TC', serif", textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          {d.propertyName}
        </h1>

        <h2 className="text-lg md:text-xl font-light tracking-wider opacity-90">
          {d.brandName}
        </h2>

        <h3
          className="text-base md:text-lg tracking-widest opacity-80"
          style={{ color: '#d8d8d8' }}
        >
          {d.tagline}
        </h3>

        {d.ctaLabel && (
          <a
            href={d.ctaHref || '#'}
            className="mt-4 inline-block border border-white/60 text-white text-sm px-8 py-3 tracking-widest hover:bg-white/20 transition-colors"
          >
            {d.ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
