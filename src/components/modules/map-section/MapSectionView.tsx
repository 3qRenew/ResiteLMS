import { ExternalLink, MapPin } from 'lucide-react'
import type { MapSectionData } from './normalize'

interface MapSectionViewProps {
  data: MapSectionData
}

function resolveHeight(heightMode: MapSectionData['heightMode'], customHeightPx: number): number {
  switch (heightMode) {
    case 'sm':
      return 320
    case 'lg':
      return 640
    case 'custom':
      return customHeightPx
    case 'md':
    default:
      return 480
  }
}

export function MapSectionView({ data }: MapSectionViewProps) {
  const height = resolveHeight(data.heightMode, data.customHeightPx)

  return (
    <section className="bg-[#f6f4ef] px-6 py-14">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/5 px-6 py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              className="text-3xl font-bold leading-tight text-[#2e372f]"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              {data.title}
            </h2>
            {data.address && (
              <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{data.address}</span>
              </p>
            )}
          </div>

          {data.mapLink !== '#' && (
            <a
              href={data.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#cbd5c9] px-4 py-2 text-sm font-medium text-[#334336] transition-colors hover:bg-[#eef3eb]"
            >
              開啟地圖
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {data.embedUrl ? (
          <div className="w-full" style={{ height }}>
            <iframe
              src={data.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={data.title}
            />
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center bg-[#e8e5df] text-sm text-gray-500"
            style={{ height }}
          >
            尚未提供嵌入地圖
          </div>
        )}
      </div>
    </section>
  )
}
