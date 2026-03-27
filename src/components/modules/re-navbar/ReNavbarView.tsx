/**
 * ReNavbarView — Pure presentational component.
 *
 * Receives NormalizedData + explicit behaviour props only.
 * No raw module.data access. No useEditing() call. No editor-context awareness.
 *
 * Editor-mode behaviour is controlled entirely by the container (index.tsx):
 *   forceVisible={true}  → always show (overrides sticky threshold)
 *                          and switches to `relative` positioning so the bar
 *                          does not escape the editor canvas.
 *
 * Layout:
 *   Mobile / Tablet : bottom action bar (grid-cols-4)
 *   Desktop xl      : top navigation bar (flex-row)
 */
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, MapPinned, MessageCircle, Phone } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type { NavAction, ReNavbarData } from './normalize'

// ── Icon map ──────────────────────────────────────────────────────────────────

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const ICON_MAP: Record<string, IconComponent> = {
  phone:    Phone,
  facebook: MessageCircle,
  map:      MapPinned,
  booking:  Mail,
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ReNavbarViewProps {
  data:          ReNavbarData
  isSticky:      boolean
  /**
   * When true: always visible + uses `relative` positioning.
   * Set by the editor container so the bar stays inside the canvas.
   * Never set from inside the view itself.
   */
  forceVisible?: boolean
}

// ── View ──────────────────────────────────────────────────────────────────────

export function ReNavbarView({ data, isSticky, forceVisible = false }: ReNavbarViewProps) {
  const shouldReduceMotion = useReducedMotion()
  const isVisible = isSticky || forceVisible
  const navClass  = forceVisible
    ? 'relative z-10 w-full'
    : 'fixed inset-x-0 bottom-0 z-50 xl:top-0 xl:bottom-auto'

  if (data.actions.length === 0) return null

  return (
    <motion.nav
      className={navClass}
      initial={false}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={
        shouldReduceMotion
          ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
          : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }
      }
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="flex items-stretch justify-between overflow-hidden border-t border-black/10 bg-[rgba(252,252,252,0.78)] shadow-[0_-6px_20px_rgba(0,0,0,0.1)] supports-backdrop-filter:backdrop-blur-xl supports-backdrop-filter:backdrop-saturate-150 xl:border-t-0 xl:border-b xl:shadow-[1px_1px_3px_rgba(0,0,0,0.1)]">

        {/* Logo — desktop only */}
        <a
          href="#"
          className="hidden shrink-0 items-center px-[2%] xl:flex"
          aria-label={data.logoAlt}
        >
          {data.logoImage ? (
            <img
              src={data.logoImage}
              alt={data.logoAlt}
              className="h-8 w-auto object-contain xl:h-9"
            />
          ) : (
            <span
              className="text-lg font-semibold tracking-[0.08em] text-[#2f2f2f] xl:text-xl"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              {data.logoAlt}
            </span>
          )}
        </a>

        {/* Action buttons */}
        <div className="grid w-full grid-cols-4 xl:flex xl:w-auto xl:min-w-150">
          {data.actions.map((action: NavAction) => {
            const Icon = ICON_MAP[action.kind] ?? Phone
            return (
              <a
                key={action.kind}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className="flex min-w-0 flex-col items-center justify-center gap-1 border-l border-black/10 px-2 py-3 text-center text-[#333] transition-colors duration-300 hover:bg-white/70 xl:min-w-37.5 xl:px-6 xl:py-5"
              >
                <Icon className="h-4.5 w-4.5 xl:hidden" strokeWidth={2.2} />
                <span className="text-[14px] font-medium leading-tight xl:text-[1.2rem]">
                  {action.label}
                </span>
                {action.sublabel && (
                  <span className="hidden text-sm leading-none xl:block">
                    {action.sublabel}
                  </span>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
