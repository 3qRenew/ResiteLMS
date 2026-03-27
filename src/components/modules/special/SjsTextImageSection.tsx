/**
 * SjsTextImageSection — 圖文兩欄區塊
 *
 * imagePosition:
 *   'left'  → Desktop(xl): 圖左(50%)文右(50%)；Mobile: 上圖下文
 *   'right' → Desktop(xl): 圖右(50%)文左(50%)；Mobile: 上圖下文
 *   'top'   → 圖上(100%)文下，文字置中 max-w-3xl
 *
 * 圖片欄位（向下相容）：
 *   新：images: [{ url, caption }]  — 支援多張，自動啟用 Carousel + Lightbox
 *   舊：imageUrl + imageCaption     — 單張靜態，自動轉換為 images[]
 */
import { Carousel } from '../../ui/Carousel'
import { Reveal } from '../../ui/Reveal'
import type { CarouselImage } from '../../ui/Carousel'
import type { ModuleProps } from '../index'

// ── Data model ────────────────────────────────────────────────────────────────

interface SjsTextImageSectionData {
  sectionLabel?: string
  title: string
  description1?: string
  description2?: string
  description3?: string
  // New: array of images (preferred)
  images?: CarouselImage[] | string
  // Legacy: single image (auto-normalised below)
  imageUrl?: string
  imageCaption?: string
  imagePosition: 'left' | 'right' | 'top'
}

function resolveImages(d: SjsTextImageSectionData): CarouselImage[] {
  // 1. Parse new images[] field
  if (d.images) {
    const arr = Array.isArray(d.images)
      ? d.images
      : (() => { try { return JSON.parse(d.images as string) } catch { return [] } })()
    if (arr.length > 0) return arr
  }
  // 2. Fallback to legacy imageUrl
  if (d.imageUrl) return [{ url: d.imageUrl, caption: d.imageCaption }]
  return []
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SjsTextImageSection({ module }: ModuleProps) {
  const d = module.data as unknown as SjsTextImageSectionData
  const images = resolveImages(d)
  const pos = d.imagePosition ?? 'left'
  const isTop = pos === 'top'

  // Reveal directions — opposite sides create a crossing effect
  const imgDir = pos === 'left' ? 'right' : pos === 'right' ? 'left' : 'up'
  const txtDir = pos === 'left' ? 'left'  : pos === 'right' ? 'right' : 'up'

  // ── Image block ────────────────────────────────────────────────────────────
  const imageBlock = (
    <Reveal
      direction={imgDir}
      className={isTop ? 'w-full' : 'w-full xl:w-1/2 shrink-0'}
    >
      {images.length === 0 ? (
        <div
          className="relative overflow-hidden"
          style={{ paddingTop: '70%', background: '#e5e5e5' }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: '#aaa' }}>
            請上傳圖片
          </span>
        </div>
      ) : (
        <Carousel
          images={images}
          showArrows={images.length > 1}
          enableLightbox
          aspectRatio="70%"
        />
      )}
    </Reveal>
  )

  // ── Text block ─────────────────────────────────────────────────────────────
  const textBlock = (
    <Reveal
      direction={txtDir}
      delay={0.15}
      className={isTop ? 'w-full max-w-3xl mx-auto' : 'w-full xl:w-1/2'}
    >
      {d.sectionLabel && (
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: '#c9c9c9' }}>
          {d.sectionLabel}
        </p>
      )}
      <div className="flex gap-4 items-start mb-5">
        <div className="w-1 shrink-0 self-stretch rounded-full" style={{ background: '#5d8d75' }} />
        <h2
          className="text-3xl font-bold leading-snug"
          style={{ color: '#595757', fontFamily: "'Noto Serif TC', serif" }}
        >
          {d.title}
        </h2>
      </div>
      <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: '#595757' }}>
        {d.description1 && <p>{d.description1}</p>}
        {d.description2 && <p>{d.description2}</p>}
        {d.description3 && <p>{d.description3}</p>}
      </div>
    </Reveal>
  )

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <section className="py-16 overflow-hidden" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6">
        {isTop ? (
          <div className="flex flex-col gap-10">
            {imageBlock}
            {textBlock}
          </div>
        ) : (
          <div className={`flex flex-col xl:flex-row${pos === 'right' ? '-reverse' : ''} gap-10 items-center`}>
            {imageBlock}
            {textBlock}
          </div>
        )}
      </div>
    </section>
  )
}
