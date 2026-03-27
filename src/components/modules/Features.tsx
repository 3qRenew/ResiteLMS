// Pure View — 三欄特色區塊
//
// Data flow:
//   module.data → normalizeFeatures() → FeaturesData → render
import type { ModuleProps } from './index'
import { normalizeFeatures } from './Features.normalize'

export function Features({ module }: ModuleProps) {
  const d = normalizeFeatures(module.data as Record<string, unknown>)

  const items = [
    { icon: d.feature1Icon, title: d.feature1Title, description: d.feature1Description },
    { icon: d.feature2Icon, title: d.feature2Title, description: d.feature2Description },
    { icon: d.feature3Icon, title: d.feature3Title, description: d.feature3Description },
  ]

  return (
    <section id="features" className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">{d.heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="text-5xl">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
