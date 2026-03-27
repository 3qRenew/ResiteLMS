import React, { Suspense } from 'react'
import type { ReactNode } from 'react'
import type { Section, Module } from '../../types'
import type { SiteSharedInfo } from '../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../data/siteSharedInfoDefaults'
import { MODULE_REGISTRY } from '../modules'
import { EditingProvider } from './EditingContext'
import { SiteSharedInfoProvider } from './SiteSharedInfoContext'

// ── Fallback for unknown module types ──────────────────────────────────────

function UnknownModulePlaceholder({ moduleType }: { moduleType: string }) {
  return (
    <div className="border border-dashed border-gray-400 rounded p-4 text-sm text-gray-500 text-center">
      未知模組類型：<code className="font-mono">{moduleType}</code>
    </div>
  )
}

// ── Single module dispatcher ────────────────────────────────────────────────

function ModuleRenderer({ module, isEditing }: { module: Module; isEditing?: boolean }) {
  const definition = MODULE_REGISTRY[module.module_type]

  if (!definition) {
    return <UnknownModulePlaceholder moduleType={module.module_type} />
  }

  const { Component } = definition

  return (
    <Suspense fallback={<div className="animate-pulse h-16 bg-gray-100 rounded" />}>
      <Component module={module} isEditing={isEditing} />
    </Suspense>
  )
}

// ── Main renderer ───────────────────────────────────────────────────────────

interface GenericRendererProps {
  sections: Section[]
  /** 選填：提供後，每個 section 會被此 wrapper 包裹（Editor 模式用）*/
  wrapSection?: (sectionId: string, children: ReactNode) => ReactNode
  /** 傳入 true 時，各 module 可顯示編輯器專屬 UI（如瞄準器）*/
  isEditing?: boolean
  /** 選填：傳入後注入 SiteSharedInfoContext；未傳入時使用 defaultSiteSharedInfo */
  siteInfo?: SiteSharedInfo
}

/**
 * Pure View renderer — accepts a sections array and dispatches each module
 * to its registered component. No editor chrome here.
 *
 * EditingProvider is created ONCE at this level; all modules consume it via
 * useEditing() — no per-module provider nesting.
 * PublicView passes no isEditing (undefined → false), so editor UI is never shown.
 */
export function GenericRenderer({ sections, wrapSection, isEditing, siteInfo }: GenericRendererProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order)

  return (
    <SiteSharedInfoProvider value={siteInfo ?? defaultSiteSharedInfo}>
    <EditingProvider value={!!isEditing}>
      <div className="resite-page">
        {sorted.map((section) => {
          const content = (
            <section key={section.id} id={`section-${section.id}`} className="resite-section">
              {[...section.modules]
                .sort((a, b) => a.order - b.order)
                .map((mod) => (
                  <ModuleRenderer key={mod.id} module={mod} isEditing={isEditing} />
                ))}
            </section>
          )

          return wrapSection ? (
            <React.Fragment key={section.id}>
              {wrapSection(section.id, content)}
            </React.Fragment>
          ) : content
        })}
      </div>
    </EditingProvider>
    </SiteSharedInfoProvider>
  )
}
