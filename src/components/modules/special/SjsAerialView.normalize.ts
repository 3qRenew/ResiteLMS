// Normalize — SjsAerialView (module_type: aerial_view)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.

export interface AerialViewData {
  sectionLabel:    string
  title:           string
  mapImageUrl:     string
  projectAnchorX:  number   // 0–100, mobile focal point + pin X
  projectAnchorY:  number   // 0–100, pin Y
  disclaimer:      string
  mobileHeight:    string   // px as string, e.g. "560"
  backgroundColor: string
}

export function normalizeAerialView(raw: Record<string, unknown>): AerialViewData {
  return {
    sectionLabel:    String(raw.sectionLabel    ?? ''),
    title:           String(raw.title           ?? ''),
    mapImageUrl:     String(raw.mapImageUrl     ?? ''),
    projectAnchorX:  typeof raw.projectAnchorX === 'number' ? raw.projectAnchorX : 50,
    projectAnchorY:  typeof raw.projectAnchorY === 'number' ? raw.projectAnchorY : 50,
    disclaimer:      String(raw.disclaimer      ?? ''),
    mobileHeight:    String(raw.mobileHeight    ?? '560'),
    backgroundColor: String(raw.backgroundColor || '#1a2233'),
  }
}
