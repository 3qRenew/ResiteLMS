// Pure View — 不含任何 Editor 邏輯
import type { ModuleProps } from './index'

interface HeroStandardData {
  title: string
  subtitle: string
  backgroundImage: string
  ctaLabel: string
  ctaHref: string
}

export function HeroStandard({ module }: ModuleProps) {
  const { title, subtitle, backgroundImage, ctaLabel, ctaHref } =
    module.data as unknown as HeroStandardData

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/55" />

      {/* 主內容 */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-200 mb-8">{subtitle}</p>
        <a
          href={ctaHref}
          className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  )
}
