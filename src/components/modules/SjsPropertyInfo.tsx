// Pure View — 案件資訊表 + Google Maps 嵌入（Footer 資訊區）
import type { ModuleProps } from './index'

interface SjsPropertyInfoData {
  phone: string
  receptionAddress: string
  projectLocation: string
  investorCompany: string
  coInvestorCompany: string
  marketingCompany: string
  agentName: string
  agentLicense: string
  permitNumber: string
  mapsEmbedUrl: string
  copyrightText: string
}

export function SjsPropertyInfo({ module }: ModuleProps) {
  const d = module.data as unknown as SjsPropertyInfoData

  const infoItems = [
    { label: '投資興建', value: [d.investorCompany, d.coInvestorCompany].filter(Boolean).join('\n') },
    { label: '企劃銷售', value: d.marketingCompany },
    { label: '接待會館', value: d.receptionAddress },
    { label: '基地位置', value: d.projectLocation },
    { label: '貴賓專線', value: d.phone },
    { label: '建照號碼', value: d.permitNumber },
    { label: '經紀人', value: d.agentName ? `${d.agentName} ${d.agentLicense || ''}` : '' },
  ].filter((item) => item.value)

  return (
    <section style={{ backgroundColor: '#eee' }}>
      {/* 案件資訊 */}
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

          <ul className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {infoItems.map((item) => (
              <li key={item.label} className="flex gap-3 text-sm" style={{ color: '#595757' }}>
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
