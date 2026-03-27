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

  return (
    <section style={{ backgroundColor: '#eee' }}>
      {/* 案件資訊 */}
      {d.items.length > 0 && (
        <div className="topBox px-6 py-[3%] lg:px-[10%]">
          <div className="container-fluid">
            <div className="infoList row flex flex-col gap-10 lg:flex-row">
              <div className="col-lg-4 w-full lg:w-1/3">
                <p className="mb-1 text-xs uppercase tracking-[0.3em]" style={{ color: '#c9c9c9' }}>
                  Information
                </p>
                <h2
                  className="text-lg font-bold"
                  style={{ color: '#595757', fontFamily: "'Noto Serif TC', serif" }}
                >
                  案件資訊
                </h2>
              </div>

              <div className="col-lg-8 w-full lg:w-2/3">
                <ul
                  className="CaseInfo flex list-none flex-wrap p-0"
                  style={{
                    margin: 0,
                    lineHeight: 3,
                    borderTop: '1px solid rgb(174, 174, 174)',
                  }}
                >
                  {d.items.map((item) => (
                    <li
                      key={`${item.label}-${item.value}`}
                      className="block w-full px-0 py-4 lg:w-1/2"
                      style={{
                        borderBottom: '1px solid rgb(174, 174, 174)',
                        color: '#595757',
                      }}
                    >
                      <span className="font-medium">
                        {item.label}
                        <span aria-hidden="true">：</span>
                      </span>
                      <span className="ml-1 whitespace-pre-line leading-relaxed">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
