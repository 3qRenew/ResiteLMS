// Pure View — 不含任何 Editor 邏輯
import type { ModuleProps } from './index'

interface NavLink {
  label: string
  href: string
}

interface NavbarData {
  logo: string
  links: NavLink[]
}

export function Navbar({ module }: ModuleProps) {
  const { logo, links } = module.data as unknown as NavbarData

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-gray-900">{logo}</span>
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
