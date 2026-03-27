// Pure View — 空拍地圖區塊（可拖移 panorama + 地標標記）
// 桌面：超寬圖可左右拖移（framer-motion drag）
// 手機：固定高度，touch-pan-x 滾動
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '../../ui/Reveal'
import type { ModuleProps } from '../index'

interface MapMarker {
  /** 0–100, percentage from left of the image */
  x: number
  /** 0–100, percentage from top of the image */
  y: number
  label: string
}

interface SjsSkyMapSectionData {
  sectionLabel: string
  title: string
  mapImageUrl: string
  /** 免責聲明，例如「空拍示意，實際依現況為準」 */
  disclaimer: string
  /** JSON 陣列字串 or 直接陣列，格式: [{x, y, label}] */
  markers: MapMarker[] | string
}

function parseMarkers(raw: MapMarker[] | string): MapMarker[] {
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}

export function SjsSkyMapSection({ module }: ModuleProps) {
  const d = module.data as unknown as SjsSkyMapSectionData
  const markers = parseMarkers(d.markers)

  const constraintRef = useRef<HTMLDivElement>(null)
  const [dragConstraint, setDragConstraint] = useState(0)

  // Calculate how much the image can travel horizontally
  useEffect(() => {
    function calc() {
      const el = constraintRef.current
      if (!el) return
      // image is rendered at 200% of container width on desktop
      const imgW = el.offsetWidth * 2
      const gap = Math.max(0, imgW - el.offsetWidth)
      setDragConstraint(gap / 2)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return (
    <section className="py-16 overflow-hidden" style={{ backgroundColor: '#f5f5f0' }}>
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <Reveal direction="up">
          {d.sectionLabel && (
            <p className="text-sm tracking-[0.3em] uppercase mb-2" style={{ color: '#c9c9c9' }}>
              {d.sectionLabel}
            </p>
          )}
          <h2
            className="text-3xl font-bold"
            style={{ color: '#595757', fontFamily: "'Noto Serif TC', serif" }}
          >
            {d.title}
          </h2>
        </Reveal>
      </div>

      {/* Map Area */}
      {d.mapImageUrl ? (
        <>
          {/* Desktop: draggable panorama */}
          <div
            ref={constraintRef}
            className="hidden md:block relative overflow-hidden w-full"
            style={{ height: '480px' }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: -dragConstraint, right: dragConstraint }}
              dragElastic={0.05}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{ width: '200%', left: '-50%' }}
            >
              <div className="relative w-full h-full">
                <img
                  src={d.mapImageUrl}
                  alt={d.title}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                {/* Markers */}
                {markers.map((m, i) => (
                  <div
                    key={i}
                    className="absolute flex flex-col items-center pointer-events-none"
                    style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -100%)' }}
                  >
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap mb-1"
                      style={{ background: 'rgba(93,141,117,0.9)', color: '#fff' }}
                    >
                      {m.label}
                    </span>
                    <div className="w-2 h-2 rounded-full" style={{ background: '#5d8d75' }} />
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Drag hint */}
            <div
              className="absolute bottom-3 right-4 text-xs px-2 py-1 pointer-events-none"
              style={{ background: 'rgba(0,0,0,0.35)', color: '#fff', borderRadius: '4px' }}
            >
              ← 拖移地圖 →
            </div>
          </div>

          {/* Mobile: native scroll */}
          <div
            className="md:hidden w-full overflow-x-auto"
            style={{ height: '260px', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}
          >
            <div className="relative h-full" style={{ width: '200%' }}>
              <img
                src={d.mapImageUrl}
                alt={d.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
              {markers.map((m, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded whitespace-nowrap mb-1"
                    style={{ background: 'rgba(93,141,117,0.9)', color: '#fff' }}
                  >
                    {m.label}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#5d8d75' }} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: '320px', background: '#e5e5e5', color: '#aaa', fontSize: '14px' }}
        >
          請上傳空拍地圖圖片
        </div>
      )}

      {/* Disclaimer */}
      {d.disclaimer && (
        <div className="max-w-7xl mx-auto px-6 mt-3">
          <p className="text-xs" style={{ color: '#aaa' }}>
            ※ {d.disclaimer}
          </p>
        </div>
      )}
    </section>
  )
}
