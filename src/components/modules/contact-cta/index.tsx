import type { ModuleProps } from '../../../types/module'
import { useSiteSharedInfo } from '../../renderer/SiteSharedInfoContext'
import { ContactCTAView } from './ContactCTAView'
import { normalizeContactCTA } from './normalize'

export function ContactCTA({ module }: ModuleProps) {
  const siteInfo = useSiteSharedInfo()
  const data = normalizeContactCTA(module.data as Record<string, unknown>, siteInfo)
  return <ContactCTAView data={data} />
}
