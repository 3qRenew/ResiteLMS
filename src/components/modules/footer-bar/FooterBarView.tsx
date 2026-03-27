import { Link as LinkIcon, MessageCircleMore, Share2 } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type { FooterBarData, FooterBarSocialKind } from './normalize'

interface FooterBarViewProps {
  data: FooterBarData
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const ICON_MAP: Record<FooterBarSocialKind, IconComponent> = {
  line: MessageCircleMore,
  facebook: Share2,
  link: LinkIcon,
}

export function FooterBarView({ data }: FooterBarViewProps) {
  return (
    <footer className="border-t border-black/10 bg-[#d7d0c4] px-6 py-4 text-[#4a4239]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <a
            href={data.brandUrl}
            target={data.brandUrl !== '#' ? '_blank' : undefined}
            rel={data.brandUrl !== '#' ? 'noopener noreferrer' : undefined}
            className="text-sm font-semibold tracking-[0.08em] transition-opacity hover:opacity-75"
          >
            {data.brandName}
          </a>
          <small className="text-xs leading-6 text-[#5d554b]">
            {data.copyrightText}
          </small>
        </div>

        {data.socialLinks.length > 0 && (
          <div className="flex items-center gap-2">
            {data.socialLinks.map((link) => {
              const Icon = ICON_MAP[link.kind]

              return (
                <a
                  key={`${link.kind}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#8f8579]/40 bg-white/50 text-[#5d554b] transition-colors hover:bg-white hover:text-[#2f2a25]"
                >
                  <Icon className="h-4 w-4" strokeWidth={2.1} />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </footer>
  )
}
