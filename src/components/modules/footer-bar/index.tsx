import type { ModuleDefinition, ModuleProps } from '../../../types/module'
import { SPECIAL_MODULE_DEFAULTS } from '../../../data/moduleDefaults'
import { useSiteSharedInfo } from '../../renderer/SiteSharedInfoContext'
import { FooterBarView } from './FooterBarView'
import { normalizeFooterBar, type FooterBarData } from './normalize'

export function FooterBar({ module }: ModuleProps) {
  const siteInfo = useSiteSharedInfo()
  const data = normalizeFooterBar(module.data as Record<string, unknown>, siteInfo)
  return <FooterBarView data={data} />
}

export const footerBarDefinition: ModuleDefinition<FooterBarData> = {
  type: 'footer_bar',
  normalize: normalizeFooterBar,
  defaultData: SPECIAL_MODULE_DEFAULTS['footer_bar'].data as FooterBarData,
  Component: FooterBar,
}
