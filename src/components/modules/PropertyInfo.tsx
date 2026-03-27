// Pure View — 案件資訊表 + Google Maps 嵌入（Footer 資訊區）
//
// Data flow:
//   module.data → normalizePropertyInfo() → PropertyInfoData → render
import type { ModuleProps } from './index'
import { normalizePropertyInfo } from './PropertyInfo.normalize'
import { useSiteSharedInfo } from '../renderer/SiteSharedInfoContext'

export function PropertyInfo({ module }: ModuleProps) {
  const siteInfo = useSiteSharedInfo()
  const d = normalizePropertyInfo(module.data as Record<string, unknown>, siteInfo)
  const gridColsClass = d.columns === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'

  return (
    <section style={{ backgroundColor: '#eee' }}>
      {/* 案件資訊 */}
      {d.items.length > 0 && (
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#c9c9c9' }}>
                Information
              </p>
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: '#595757', fontFamily: "'Noto Serif TC', serif" }}
              >
                案件資訊
              </h2>
            </div>

            <ul className={`flex-1 grid grid-cols-1 ${gridColsClass} gap-x-12 gap-y-3`}>
              {d.items.map((item) => (
                <li key={`${item.label}-${item.value}`} className="flex gap-3 text-sm" style={{ color: '#595757' }}>
                  <span
                    className="shrink-0 font-medium px-2 py-0.5 text-xs self-start"
                    style={{ background: '#5d8d75', color: '#fff', marginTop: '2px' }}
                  >
                    {item.label}
                  </span>
                  <span className="whitespace-pre-line leading-relaxed">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Google Maps */}
      {d.mapsEmbedUrl && (
        <div className="w-full" style={{ height: '300px' }}>
          <iframe
            src={d.mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="地圖"
          />
        </div>
      )}

      {/* Copyright */}
      {d.copyrightText && (
        <div className="py-3 text-center" style={{ backgroundColor: '#c9c9c9' }}>
          <small className="text-xs" style={{ color: '#595757' }}>
            {d.copyrightText} All rights reserved.
          </small>
        </div>
      )}
    </section>
  )
}
