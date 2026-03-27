// Normalize — Features (module_type: features)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.

export interface FeaturesData {
  heading:             string
  feature1Icon:        string
  feature1Title:       string
  feature1Description: string
  feature2Icon:        string
  feature2Title:       string
  feature2Description: string
  feature3Icon:        string
  feature3Title:       string
  feature3Description: string
}

export function normalizeFeatures(raw: Record<string, unknown>): FeaturesData {
  return {
    heading:             String(raw.heading             ?? ''),
    feature1Icon:        String(raw.feature1Icon        ?? '🏠'),
    feature1Title:       String(raw.feature1Title       ?? ''),
    feature1Description: String(raw.feature1Description ?? ''),
    feature2Icon:        String(raw.feature2Icon        ?? '📍'),
    feature2Title:       String(raw.feature2Title       ?? ''),
    feature2Description: String(raw.feature2Description ?? ''),
    feature3Icon:        String(raw.feature3Icon        ?? '🌿'),
    feature3Title:       String(raw.feature3Title       ?? ''),
    feature3Description: String(raw.feature3Description ?? ''),
  }
}
