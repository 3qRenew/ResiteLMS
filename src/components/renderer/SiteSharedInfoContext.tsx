/**
 * SiteSharedInfoContext — provides site-level shared info to the module subtree.
 * Mirrors the EditingContext pattern: single Provider in GenericRenderer,
 * consumed via useSiteSharedInfo() in module entries that need it.
 *
 * Default value is defaultSiteSharedInfo so the hook is safe to call anywhere,
 * even outside a Provider (e.g., Storybook, unit tests).
 */
import { createContext, useContext } from 'react'
import type { SiteSharedInfo } from '../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../data/siteSharedInfoDefaults'

const SiteSharedInfoContext = createContext<SiteSharedInfo>(defaultSiteSharedInfo)

export const SiteSharedInfoProvider = SiteSharedInfoContext.Provider

export function useSiteSharedInfo(): SiteSharedInfo {
  return useContext(SiteSharedInfoContext)
}
