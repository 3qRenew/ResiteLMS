/**
 * useLocationHeroFraming — Reactive framing calculator for aerial-map modules.
 *
 * Desktop mode: aspect-ratio driven, no cropping, no translation needed.
 *               Markers sit at (x%, y%) directly within the natural image space.
 *
 * Mobile mode:  scene is scaled to fill `mobileHeight`; translateX centers
 *               the `projectAnchorX` in the viewport.
 *
 * Anchor / marker coordinates are 0–100 (matching Sidebar slider range).
 */
import { useState, useEffect, useCallback } from 'react'
import {
  DESKTOP_BREAKPOINT_PX,
  calculateMobileScene,
  calculateAnchorTranslateX,
  clampTranslateX,
} from '../utils/geometry'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FramingOptions {
  imageNaturalWidth: number
  imageNaturalHeight: number
  /** Normalized anchor X position, 0–100 (drives mobile centering) */
  anchorX: number
  /** Mobile viewport height in px */
  mobileHeight: number
}

/** Desktop: image fills 100% width at natural aspect ratio — no translation. */
interface DesktopFraming {
  isMobile: false
  viewportWidth: number
}

/** Mobile: scene is wider than viewport; translateX centers the anchor. */
interface MobileFraming {
  isMobile: true
  viewportWidth: number
  viewportHeight: number
  translateX: number
  sceneWidth: number
  sceneHeight: number
}

export type FramingResult = DesktopFraming | MobileFraming

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLocationHeroFraming(opts: FramingOptions): FramingResult {
  const { imageNaturalWidth, imageNaturalHeight, anchorX, mobileHeight } = opts

  const compute = useCallback((): FramingResult => {
    const vw = window.innerWidth
    if (vw >= DESKTOP_BREAKPOINT_PX) {
      // Desktop: natural aspect ratio, no framing math needed
      return { isMobile: false, viewportWidth: vw }
    }

    // Guard against uninitialized image dimensions
    if (imageNaturalWidth <= 0 || imageNaturalHeight <= 0) {
      return { isMobile: true, viewportWidth: vw, viewportHeight: mobileHeight,
               translateX: 0, sceneWidth: vw, sceneHeight: mobileHeight }
    }

    const { renderedWidth, renderedHeight } = calculateMobileScene(
      imageNaturalWidth, imageNaturalHeight, vw, mobileHeight
    )
    const raw = calculateAnchorTranslateX(anchorX, renderedWidth, vw)
    const translateX = clampTranslateX(raw, renderedWidth, vw)

    return {
      isMobile: true,
      viewportWidth: vw,
      viewportHeight: mobileHeight,
      translateX,
      sceneWidth: renderedWidth,
      sceneHeight: renderedHeight,
    }
  }, [imageNaturalWidth, imageNaturalHeight, anchorX, mobileHeight])

  const [result, setResult] = useState<FramingResult>(compute)

  useEffect(() => {
    setResult(compute())
    const onResize = () => setResult(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [compute])

  return result
}
