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

  return <ReNavbarView data={data} isSticky={isSticky} forceVisible={isEditing} />
}
