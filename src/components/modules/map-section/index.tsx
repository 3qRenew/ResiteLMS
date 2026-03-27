import type { ModuleDefinition, ModuleProps } from '../../../types/module'
import { SPECIAL_MODULE_DEFAULTS } from '../../../data/moduleDefaults'
import { MapSectionView } from './MapSectionView'
import { normalizeMapSection, type MapSectionData } from './normalize'

export function MapSection({ module }: ModuleProps) {
  const data = normalizeMapSection(module.data as Record<string, unknown>)
  return <MapSectionView data={data} />
}

export const mapSectionDefinition: ModuleDefinition<MapSectionData> = {
  type: 'map_section',
  normalize: normalizeMapSection,
  defaultData: SPECIAL_MODULE_DEFAULTS['map_section'].data as MapSectionData,
  Component: MapSection,
}
