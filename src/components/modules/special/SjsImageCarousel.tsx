// Pure View — 圖片輪播區塊（整合 Carousel UI + Reveal）
// 適用場景：交通、公設、樣品屋、外觀等任何圖片輪播 section
import { Carousel } from '../../ui/Carousel'
import { Reveal } from '../../ui/Reveal'
import type { ModuleProps } from '../index'

interface CarouselImageItem {
  url: string
  caption?: string
}

interface SjsImageCarouselData {
  sectionLabel: string
  title: string
  description1: string
  description2: string
  /** JSON 陣列字串 or 直接陣列，格式: [{url, caption}] */
  images: CarouselImageItem[] | string
  disclaimer: string
  /** 文字區在上方 (top) 或下方 (bottom)，預設 bottom */
  textPosition: 'top' | 'bottom'
}

function parseImages(raw: CarouselImageItem[] | string): CarouselImageItem[] {
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}

export function SjsImageCarousel({ module }: ModuleProps) {
  const d = module.data as unknown as SjsImageCarouselData
  const images = parseImages(d.images)
  const textOnTop = d.textPosition === 'top'

  const textBlock = (
    <Reveal direction="up" className="mb-8">
      {d.sectionLabel && (
        <p className="text-sm tracking-[0.3em] uppercase mb-2" style={{ color: '#c9c9c9' }}>
          {d.sectionLabel}
        </p>
      )}
      <h2
        className="text-3xl font-bold mb-4 leading-snug"
        style={{ color: '#5d8d75', fontFamily: "'Noto Serif TC', serif" }}
      >
        {d.title}
      </h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed" style={{ color: '#595757' }}>
        {d.description1 && <p>{d.description1}</p>}
        {d.description2 && <p>{d.description2}</p>}
      </div>
    </Reveal>
  )

  return (
    <section className="py-16 overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
      <div className="max-w-7xl mx-auto px-6">
        {textOnTop && textBlock}

        <Reveal direction="up" delay={textOnTop ? 0.1 : 0}>
          <Carousel
            images={images}
            disclaimer={d.disclaimer}
            aspectRatio="60%"
            showArrows
            enableLightbox
          />
        </Reveal>

        {!textOnTop && <div className="mt-8">{textBlock}</div>}
      </div>
    </section>
  )
}
