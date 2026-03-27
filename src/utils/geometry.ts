/**
 * geometry.ts — Pure coordinate-system functions for the aerial-map framing engine.
 *
 * All functions are side-effect free. No magic numbers: every formula is derived
 * from viewportWidth / renderedWidth relationships.
 *
 * Coordinate convention:
 *   - Normalized positions (anchorX, marker x/y) are stored as 0–100 (percentage)
 *     in module data, so the Sidebar slider works naturally.
 *   - Pass them to these functions as-is; the functions treat them as percentages
 *     and convert internally where needed.
 */

// ── Breakpoint ────────────────────────────────────────────────────────────────

/** Viewport widths below this value enter Mobile (pan) mode. */
export const DESKTOP_BREAKPOINT_PX = 1280

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SceneGeometry {
  renderedWidth: number
  renderedHeight: number
}

/**
 * Describes how object-fit:cover renders an image inside a container.
 * Used to convert normalized image coordinates → CSS position within container.
 */
export interface CoverGeometry {
  /** The uniform scale factor applied to the image by cover. */
  coverScale: number
  /** Image width after scaling. May be larger than container width. */
  effectiveWidth: number
  /** Image height after scaling. May be larger than container height. */
  effectiveHeight: number
  /** Horizontal pixels hidden on each side (left & right). */
  offsetX: number
  /** Vertical pixels hidden on each side (top & bottom). */
  offsetY: number
}

// ── Mobile / Pan mode ─────────────────────────────────────────────────────────

/**
 * Calculate scene dimensions for Mobile (pan) mode.
 *
 * Primary strategy: height-first — scale image so its height fills `targetHeight`.
 * Min-width guard: if the resulting width < viewportWidth × minWidthMultiplier,
 * flip to width-first — set width = viewportWidth × minWidthMultiplier and derive height.
 * This prevents blank side-bars at tablet widths where the image isn't wide enough.
 */
export function calculateMobileScene(
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  viewportWidth: number,
  targetHeight: number,
  minWidthMultiplier = 1.5
): SceneGeometry {
  const aspectRatio = imageNaturalWidth / imageNaturalHeight
  const heightDrivenWidth = imageNaturalWidth * (targetHeight / imageNaturalHeight)
  const minRequiredWidth = viewportWidth * minWidthMultiplier

  if (heightDrivenWidth >= minRequiredWidth) {
    return { renderedWidth: heightDrivenWidth, renderedHeight: targetHeight }
  }

  // Width-driven fallback: expand to meet minimum width requirement
  return {
    renderedWidth: minRequiredWidth,
    renderedHeight: minRequiredWidth / aspectRatio,
  }
}

/**
 * Calculate the translateX needed to center a normalized anchor point
 * (0–100) in the viewport.
 *
 * Formula: targetTranslateX = (viewportWidth / 2) − (anchorX/100 × renderedWidth)
 */
export function calculateAnchorTranslateX(
  anchorX: number,         // 0–100
  renderedWidth: number,
  viewportWidth: number
): number {
  return (viewportWidth / 2) - ((anchorX / 100) * renderedWidth)
}

/**
 * Clamp translateX so the scene never reveals blank space.
 *
 * - If scene fits within viewport: center it.
 * - Otherwise: clamp between [viewportWidth − renderedWidth, 0].
 */
export function clampTranslateX(
  translateX: number,
  renderedWidth: number,
  viewportWidth: number
): number {
  if (renderedWidth <= viewportWidth) {
    return (viewportWidth - renderedWidth) / 2
  }
  const minX = viewportWidth - renderedWidth
  const maxX = 0
  return Math.max(minX, Math.min(maxX, translateX))
}

// ── Desktop / Cover mode ──────────────────────────────────────────────────────

/**
 * Calculate the object-fit:cover geometry for Desktop mode.
 *
 * CSS cover: scale the image so it completely fills the container;
 * the dominant axis is the one that needs less scaling.
 */
export function calculateCoverGeometry(
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  containerWidth: number,
  containerHeight: number
): CoverGeometry {
  const scaleX = containerWidth / imageNaturalWidth
  const scaleY = containerHeight / imageNaturalHeight
  const coverScale = Math.max(scaleX, scaleY)
  const effectiveWidth = imageNaturalWidth * coverScale
  const effectiveHeight = imageNaturalHeight * coverScale
  return {
    coverScale,
    effectiveWidth,
    effectiveHeight,
    offsetX: (effectiveWidth - containerWidth) / 2,
    offsetY: (effectiveHeight - containerHeight) / 2,
  }
}

/**
 * Convert a normalized image coordinate (0–100) to a CSS percentage position
 * within a cover-fitted container.
 *
 * Returns values that can be used directly as CSS `left` / `top` percentages.
 * Values outside 0–100 indicate the marker is outside the visible viewport.
 */
export function coverNormalizedToContainerPercent(
  normalizedX: number,   // 0–100
  normalizedY: number,   // 0–100
  cover: CoverGeometry,
  containerWidth: number,
  containerHeight: number
): { xPct: number; yPct: number } {
  const xPct =
    ((normalizedX / 100) * cover.effectiveWidth - cover.offsetX) / containerWidth * 100
  const yPct =
    ((normalizedY / 100) * cover.effectiveHeight - cover.offsetY) / containerHeight * 100
  return { xPct, yPct }
}
