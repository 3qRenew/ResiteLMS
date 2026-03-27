/**
 * SjsTextImageBlock — 通用圖文模組（升級版）
 *
 * imagePosition:
 *   'left'  → Desktop: 圖左(50%)文右(50%)；Mobile: 上圖下文
 *   'right' → Desktop: 圖右(50%)文左(50%)；Mobile: 上圖下文
 *   'top'   → Desktop & Mobile: 圖上(100%)文下，文字置中
 *
 * images 陣列：
 *   1 張 → 靜態圖片（無輪播 UI）
 *   多張 → Embla Carousel，含左右箭頭、Dots、點擊 Lightbox
 *
 * Data flow:
 *   module.data → normalizeTextImageBlock() → TextImageBlockData → render
 */
import { Carousel } from '../../ui/Carousel'
import { Reveal } from '../../ui/Reveal'
import type { ModuleProps } from '../index'
import type { CarouselImage } from '../../ui/Carousel'
import { normalizeTextImageBlock } from './SjsTextImageBlock.normalize'

// ── Component ─────────────────────────────────────────────────────────────────

export function SjsTextImageBlock({ module }: ModuleProps) {
  const d      = normalizeTextImageBlock(module.data as Record<string, unknown>)
  // ContentBlockImage is structurally identical to CarouselImage — cast is safe
  const images = d.images as CarouselImage[]
  const pos    = d.imagePosition
  const isTop  = pos === 'top'

  // Reveal directions — image and text slide in from opposite sides
  const imgRevealDir = pos === 'left' ? 'right' : pos === 'right' ? 'left' : 'up'
  const txtRevealDir = pos === 'left' ? 'left'  : pos === 'right' ? 'right' : 'up'

  // ── Image block (shared between layouts) ──────────────────────────────────
  const imageBlock = (
    <Reveal
      direction={imgRevealDir}
      className={isTop ? 'w-full' : 'w-full xl:w-1/2 shrink-0'}
    >
      {images.length === 0 ? (
        <div
          className="w-full flex items-center justify-center text-sm"
          style={{ paddingTop: '66.67%', background: '#e5e5e5', color: '#aaa', position: 'relative' }}
        >
          <span className="absolute inset-0 flex items-center justify-center">請上傳圖片</span>
        </div>
      ) : images.length === 1 ? (
        <div className="relative overflow-hidden" style={{ paddingTop: '66.67%' }}>
          <img
            src={images[0].url}
            alt={images[0].caption ?? d.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {images[0].caption && (
            <span
              className="absolute bottom-2 right-2 text-xs px-2 py-0.5"
              style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}
            >
              {images[0].caption}
            </span>
          )}
        </div>
      ) : (
        <Carousel
          images={images}
          showArrows
          enableLightbox
          aspectRatio="66.67%"
        />
      )}
    </Reveal>
  )

  // ── Text block ─────────────────────────────────────────────────────────────
  const textBlock = (
    <Reveal
      direction={txtRevealDir}
      delay={0.12}
      className={isTop ? 'w-full max-w-3xl mx-auto' : 'w-full xl:w-1/2'}
    >
      {d.sectionLabel && (
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: '#c9c9c9' }}>
          {d.sectionLabel}
        </p>
      )}
      <div className="flex gap-4 items-start mb-4">
        <div className="w-1 shrink-0 self-stretch rounded-full" style={{ background: '#5d8d75' }} />
        <div>
          <h2
            className="text-3xl font-bold leading-snug"
            style={{ color: '#595757', fontFamily: "'Noto Serif TC', serif" }}
          >
            {d.title}
          </h2>
          {d.subtitle && (
            <p className="mt-1 text-base" style={{ color: '#888' }}>{d.subtitle}</p>
          )}
        </div>
      </div>
      {d.description && (
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#595757' }}>
          {d.description}
        </p>
      )}
    </Reveal>
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section className="py-16 overflow-hidden" style={{ backgroundColor: d.backgroundColor }}>
      <div className="max-w-7xl mx-auto px-6">
        {isTop ? (
          // Top layout: image full width, text centered below
          <div className="flex flex-col gap-10">
            {imageBlock}
            {textBlock}
          </div>
        ) : (
          // Left / Right layout: side by side on XL, stacked on mobile
          <div className={`flex flex-col xl:flex-row${pos === 'right' ? '-reverse' : ''} gap-10 items-center`}>
            {imageBlock}
            {textBlock}
          </div>
        )}
      </div>
    </section>
  )
}
