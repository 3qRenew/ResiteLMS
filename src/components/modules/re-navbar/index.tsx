/**
 * re-navbar/index.tsx — Module entry point (V3 pattern)
 *
 * Orchestrates: normalize raw data → run behaviour hook → render View.
 * Uses EditingContext so the View itself stays free of editor concerns.
 */
import { useState, useEffect } from 'react'
import type { ModuleProps } from '../index'
import { normalizeReNavbar } from './normalize'
import { ReNavbarView } from './ReNavbarView'
import { useEditing } from '../../renderer/EditingContext'
import { useSiteSharedInfo } from '../../renderer/SiteSharedInfoContext'

// ── Sticky hook ───────────────────────────────────────────────────────────────

const STICKY_OFFSET_PX = 60
const MOBILE_BOTTOM_SPACER_PX = 80

function useNavbarSticky(offset: number): boolean {
  const [isSticky, setIsSticky] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.scrollY > offset : false
  )

  useEffect(() => {
    let frameId = 0
    const update = () => {
      frameId = 0
      setIsSticky(window.scrollY > offset)
    }
    const onScroll = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameId !== 0) window.cancelAnimationFrame(frameId)
    }
  }, [offset])

  return isSticky
}

// ── Module component ──────────────────────────────────────────────────────────

export function ReNavbar({ module }: ModuleProps) {
  const siteInfo  = useSiteSharedInfo()
  const data      = normalizeReNavbar(module.data, siteInfo)
  const isSticky  = useNavbarSticky(STICKY_OFFSET_PX)
  const isEditing = useEditing()

  return (
    <>
      {/*
        Temporary workaround:
        re_navbar is currently treated as a special module and placed at the end
        of the page content. On mobile it uses fixed-bottom positioning, which
        can overlap the last section. We therefore add a module-local spacer here
        instead of touching global layout/body styles.

        Long term, re_navbar should be upgraded to page-level chrome / shell UI
        and no longer participate in normal content ordering.
      */}
      {!isEditing && (
        <div
          aria-hidden="true"
          className="xl:hidden"
          style={{ height: `${MOBILE_BOTTOM_SPACER_PX}px` }}
        />
      )}
      <ReNavbarView data={data} isSticky={isSticky} forceVisible={isEditing} />
    </>
  )
}
