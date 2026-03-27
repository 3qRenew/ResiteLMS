import { ArrowUpRight, FileText, MapPin, Phone } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type { ContactCTAData, ContactCTAItem, ContactCTAKind } from './normalize'

interface ContactCTAViewProps {
  data: ContactCTAData
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const ICON_MAP: Record<ContactCTAKind, IconComponent> = {
  form: FileText,
  phone: Phone,
  map: MapPin,
  link: ArrowUpRight,
}

function ContactCTAButton({ item }: { item: ContactCTAItem }) {
  const Icon = ICON_MAP[item.kind]

  return (
    <a
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      className="group relative flex min-h-[104px] items-center justify-between gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="mt-0.5 rounded-full bg-blue-50 p-3 text-blue-700">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900">{item.label}</div>
          {item.description && (
            <div className="mt-1 text-sm leading-relaxed text-gray-500">
              {item.description}
            </div>
          )}
        </div>
      </div>

      <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-600" />
    </a>
  )
}

export function ContactCTAView({ data }: ContactCTAViewProps) {
  const visibleItems = data.items.filter((item) => !item.disabled)

  if (visibleItems.length === 0) return null

  return (
    <section className="bg-[#f3f3ef] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <h2
            className="text-3xl font-bold leading-tight text-[#2f3a32]"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            {data.heading}
          </h2>
          {data.description && (
            <p className="mt-3 text-sm leading-7 text-gray-600">{data.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {visibleItems.map((item) => (
            <ContactCTAButton key={`${item.kind}-${item.label}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
