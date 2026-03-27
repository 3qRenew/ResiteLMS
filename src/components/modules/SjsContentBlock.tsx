// Pure View — 圖文兩欄區塊（Facade / Architecture / 各主題說明頁）
import type { ModuleProps } from './index'

interface SjsContentBlockData {
  sectionLabel: string
  title: string
  description1: string
  description2: string
  description3: string
  mainImage: string
  imageCaption: string
}

export function SjsContentBlock({ module }: ModuleProps) {
  const d = module.data as unknown as SjsContentBlockData

  return (
    <section className="py-16 px-0 overflow-hidden" style={{ backgroundColor: '#f4f4f4' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* 文字側 */}
          <div className="flex-1 max-w-lg">
            {d.sectionLabel && (
              <p className="text-sm tracking-[0.3em] uppercase mb-2" style={{ color: '#c9c9c9' }}>
                {d.sectionLabel}
              </p>
            )}
            <div className="w-px h-12 mb-4" style={{ background: '#5d8d75' }} />
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 leading-snug"
              style={{ color: '#5d8d75', fontFamily: "'Noto Serif TC', serif" }}
            >
              {d.title}
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: '#595757' }}>
              {d.description1 && <p>{d.description1}</p>}
              {d.description2 && <p>{d.description2}</p>}
              {d.description3 && <p>{d.description3}</p>}
            </div>
          </div>

          {/* 圖片側 */}
          {d.mainImage && (
            <div className="flex-1 w-full relative">
              <div className="relative" style={{ paddingTop: '80%' }}>
                <img
                  src={d.mainImage}
                  alt={d.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {d.imageCaption && (
                <p className="text-xs text-right mt-1" style={{ color: '#c9c9c9' }}>
                  {d.imageCaption}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
