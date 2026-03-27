/**
 * SjsAerialView — Precision aerial-map section.
 *
 * Desktop  → Ratio-First, No-Clipping.
 *            Container grows with natural aspect ratio.
 *            ProjectPin at left:anchorX%, top:anchorY% directly on the image plane.
 *
 * Mobile   → Height-First, Width-Overflow, Draggable.
 *            Scene height driven by framing hook (dynamic scale compensation).
 *            framer-motion drag="x" with dragConstraints from overflow.
 *            projectAnchorX sets the initial focal point (via useMotionValue).
 *            ProjectPin on scene layer — drags with the image.
 *
 * Pin:  projectAnchorX/Y is the single source of truth for the building location.
 *       A "本建案" ProjectPin is always rendered there.
 *       POI marker system removed — add back when needed.
 *
 * Editor-only overlay: red crosshair at (projectAnchorX, projectAnchorY).
 *   Rendered only when isEditing=true, hidden in preview and public view.
 *
 * Data flow:
 *   module.data → normalizeAerialView() → AerialViewData → render
 */
import { useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Reveal } from '../../ui/Reveal'
import { useLocationHeroFraming } from '../../../hooks/useLocationHeroFraming'
import type { ModuleProps } from '../index'
import { normalizeAerialView } from './SjsAerialView.normalize'

// ── Project anchor crosshair (editor-only) ────────────────────────────────────

function ProjectAnchorCrosshair({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      {/* Horizontal arm */}
      <div className="absolute" style={{ top: '50%', left: '-16px', width: '32px', height: '1px', background: '#ef4444', opacity: 0.9 }} />
      {/* Vertical arm */}
      <div className="absolute" style={{ left: '50%', top: '-16px', height: '32px', width: '1px', background: '#ef4444', opacity: 0.9 }} />
      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: '8px', height: '8px',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ef4444',
          boxShadow: '0 0 0 2px rgba(255,255,255,0.8)',
        }}
      />
      {/* Label */}
      <div
        className="absolute whitespace-nowrap text-white font-medium px-1.5 py-0.5 rounded"
        style={{
          top: '50%', left: 'calc(50% + 14px)',
          transform: 'translateY(-50%)',
          background: 'rgba(180,50,50,0.9)',
          fontSize: '11px',
          letterSpacing: '0.04em',
        }}
      >
        建案位置
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SjsAerialView({ module, isEditing }: ModuleProps) {
  const d = normalizeAerialView(module.data as Record<string, unknown>)

  const mobileHeight = parseInt(d.mobileHeight) || 560
  const anchorX      = d.projectAnchorX
  const anchorY      = d.projectAnchorY

  // Auto-detect natural image dimensions
  const [imgSize, setImgSize] = useState({ w: 3000, h: 1200 })
  useEffect(() => {
    if (!d.mapImageUrl) return
    const img = new window.Image()
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setImgSize({ w: img.naturalWidth, h: img.naturalHeight })
      }
    }
    img.src = d.mapImageUrl
  }, [d.mapImageUrl])

  const framing = useLocationHeroFraming({
    imageNaturalWidth: imgSize.w,
    imageNaturalHeight: imgSize.h,
    anchorX,
    mobileHeight,
  })

  const dragLeft = framing.isMobile
    ? Math.min(0, framing.viewportWidth - framing.sceneWidth)
    : 0
  const targetX = framing.isMobile ? framing.translateX : 0

  // MotionValue drives the scene's x position.
  // Set imperatively whenever targetX changes (image load, resize, anchor edit)
  // so the position always updates without needing a remount.
  const motionX = useMotionValue(targetX)
  useEffect(() => {
    motionX.set(targetX)
  }, [targetX, motionX])

  return (
    <section className="overflow-hidden" style={{ backgroundColor: d.backgroundColor }}>

      {/* ── Header text ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Reveal direction="up">
          {d.sectionLabel && (
            <p className="text-sm tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {d.sectionLabel}
            </p>
          )}
          <h2
            className="text-3xl font-bold"
            style={{ color: '#fff', fontFamily: "'Noto Serif TC', serif" }}
          >
            {d.title}
          </h2>
        </Reveal>
      </div>

      {d.mapImageUrl ? (
        <>
          {/* ════════════════════════════════════════════════════
              DESKTOP — Ratio-First, No-Clipping
          ════════════════════════════════════════════════════ */}
          <div
            className="hidden xl:block relative w-full"
            style={{ aspectRatio: `${imgSize.w} / ${imgSize.h}` }}
          >
            <img
              src={d.mapImageUrl}
              alt={d.title}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'fill' }}
              draggable={false}
            />

            {isEditing && <ProjectAnchorCrosshair x={anchorX} y={anchorY} />}

            {d.disclaimer && (
              <div
                className="absolute bottom-3 left-4 text-xs text-white px-2 py-1 pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '4px' }}
              >
                ※ {d.disclaimer}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════
              MOBILE — Height-First, Width-Overflow, Draggable
          ════════════════════════════════════════════════════ */}
          <div
            className="xl:hidden relative w-full overflow-hidden"
            style={{ height: framing.isMobile ? framing.sceneHeight : mobileHeight }}
          >
            {framing.isMobile && (
              <motion.div
                key={`scene-${d.mapImageUrl}-${anchorX}-${mobileHeight}`}
                className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: dragLeft, right: 0 }}
                dragElastic={0.06}
                dragMomentum
                style={{
                  x: motionX,
                  width: framing.sceneWidth,
                  height: framing.sceneHeight,
                  willChange: 'transform',
                }}
              >
                <img
                  src={d.mapImageUrl}
                  alt={d.title}
                  className="w-full h-full select-none"
                  style={{ objectFit: 'fill', display: 'block' }}
                  draggable={false}
                />

                {isEditing && <ProjectAnchorCrosshair x={anchorX} y={anchorY} />}
              </motion.div>
            )}

            {/* Fixed overlays — stay in viewport regardless of drag */}
            <div
              className="absolute bottom-3 right-3 z-20 text-xs text-white px-2 py-1 pointer-events-none"
              style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '4px' }}
            >
              ← 左右滑動 →
            </div>
            {d.disclaimer && (
              <div
                className="absolute bottom-3 left-3 z-20 text-xs text-white px-2 py-1 pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.45)', borderRadius: '4px' }}
              >
                ※ {d.disclaimer}
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className="w-full flex items-center justify-center text-sm text-white/40"
          style={{ height: mobileHeight, background: 'rgba(255,255,255,0.05)' }}
        >
          請上傳空拍地圖圖片
        </div>
      )}
    </section>
  )
}
