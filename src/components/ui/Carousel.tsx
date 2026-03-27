// Headless Embla Carousel + built-in Lightbox
// Used as the base UI primitive for all image carousels across the platform.
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { EmblaOptionsType } from 'embla-carousel'

export interface CarouselImage {
  url: string
  caption?: string
}

interface CarouselProps {
  images: CarouselImage[]
  options?: EmblaOptionsType
  /** Tailwind classes applied to the outer wrapper */
  className?: string
  /** Tailwind classes applied to each slide */
  slideClassName?: string
  /** Show prev/next arrow buttons */
  showArrows?: boolean
  /** Aspect ratio of each slide, e.g. "56.25%" for 16:9, "70%" for ~3:2 */
  aspectRatio?: string
  /** Enable click-to-lightbox */
  enableLightbox?: boolean
  /** Label shown on first slide (e.g. "3D示意圖") */
  disclaimer?: string
}

export function Carousel({
  images,
  options,
  className = '',
  slideClassName = '',
  showArrows = true,
  aspectRatio = '66.67%',
  enableLightbox = true,
  disclaimer,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...options })
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }
    emblaApi.on('select', update)
    update()
    return () => { emblaApi.off('select', update) }
  }, [emblaApi])

  if (images.length === 0) return null

  return (
    <>
      <div className={`relative overflow-hidden ${className}`}>
        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative shrink-0 w-full ${slideClassName}`}
                style={{ paddingTop: aspectRatio }}
                onClick={() => enableLightbox && setLightboxSrc(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.caption ?? `slide ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover${enableLightbox ? ' cursor-zoom-in' : ''}`}
                />
                {/* Caption */}
                {img.caption && (
                  <span
                    className="absolute bottom-2 left-3 text-xs px-2 py-0.5"
                    style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
                  >
                    {img.caption}
                  </span>
                )}
                {/* Disclaimer on first slide */}
                {i === 0 && disclaimer && (
                  <span
                    className="absolute bottom-2 right-3 text-xs px-2 py-0.5"
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}
                  >
                    {disclaimer}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              aria-label="上一張"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 transition"
            >
              ‹
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              aria-label="下一張"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 transition"
            >
              ›
            </button>
          </>
        )}

        {/* Swipe hint overlay (shows only on mobile) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-white/70 text-xs pointer-events-none md:hidden">
            <span>← 左右滑動 →</span>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxSrc(null)}
          >
            <motion.img
              src={lightboxSrc}
              alt="preview"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-5 text-white text-3xl leading-none hover:opacity-70"
              onClick={() => setLightboxSrc(null)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
