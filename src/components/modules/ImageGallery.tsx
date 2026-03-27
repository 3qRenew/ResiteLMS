// Pure View — 三格圖片展示（固定 3 欄，不足補佔位符）
// Desktop：靜態 3-col grid；Mobile：Carousel
//
// Data flow:
//   module.data → normalizeImageGallery() → ImageGalleryData → render
import { Carousel } from '../ui/Carousel'
import { Reveal } from '../ui/Reveal'
import type { ModuleProps } from './index'
import { normalizeImageGallery } from './ImageGallery.normalize'

/** Always renders exactly 3 columns. Empty slots show a placeholder. */
export function ImageGallery({ module }: ModuleProps) {
  const d        = normalizeImageGallery(module.data as Record<string, unknown>)
  const rawSlots = [d.image1, d.image2, d.image3]

  const carouselImages = rawSlots
    .filter(Boolean)
    .map((url) => ({ url, caption: d.imageCaption }))

  return (
    <section className="py-16 overflow-hidden" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Fixed 3-column grid — desktop */}
        <Reveal direction="up" className="mb-10 hidden md:block">
          <div className="grid grid-cols-3 gap-2">
            {rawSlots.map((imgUrl, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{ paddingTop: '70%' }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`${d.title} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={{ background: '#f0f0f0', color: '#bbb' }}
                  >
                    圖片 {i + 1}
                  </div>
                )}
                {i === 0 && imgUrl && d.imageCaption && (
                  <span
                    className="absolute bottom-2 right-2 text-xs px-2 py-0.5"
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}
                  >
                    {d.imageCaption}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile carousel */}
        {carouselImages.length > 0 && (
          <Reveal direction="up" className="md:hidden mb-10">
            <Carousel
              images={carouselImages}
              aspectRatio="70%"
              showArrows
              enableLightbox
            />
          </Reveal>
        )}

        {/* Text area */}
        <Reveal direction="up" delay={0.1} className="max-w-2xl">
          {d.sectionLabel && (
            <p className="text-sm tracking-[0.3em] uppercase mb-2" style={{ color: '#c9c9c9' }}>
              {d.sectionLabel}
            </p>
          )}
          <h2
            className="text-3xl font-bold mb-5 leading-snug"
            style={{ color: '#5d8d75', fontFamily: "'Noto Serif TC', serif" }}
          >
            {d.title}
          </h2>
          <div className="flex flex-col gap-2 text-sm leading-relaxed" style={{ color: '#595757' }}>
            {d.description1 && <p>{d.description1}</p>}
            {d.description2 && <p>{d.description2}</p>}
            {d.description3 && <p>{d.description3}</p>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
