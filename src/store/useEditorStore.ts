import { create } from 'zustand'
import type { Page, Section } from '../types'
import { MODULE_DEFAULTS, SJS_MODULE_DEFAULTS, SPECIAL_MODULE_DEFAULTS } from '../data/moduleDefaults'
import { defaultSiteSharedInfo } from '../data/siteSharedInfoDefaults'
import type { SiteSharedInfo } from '../types/siteSharedInfo'

interface EditorState {
  activeSectionId: string | null
  isDragging: boolean
  pageData: Page | null
  isPreviewMode: boolean
  siteInfo: SiteSharedInfo

  setActiveSectionId: (id: string | null) => void
  setIsDragging: (dragging: boolean) => void
  setPageData: (page: Page) => void
  setSiteInfo: (siteInfo: SiteSharedInfo) => void
  updateSiteInfo: (patch: Partial<SiteSharedInfo>) => void
  resetPageData: () => void
  togglePreviewMode: () => void
  updateModuleData: (sectionId: string, moduleId: string, partialData: Record<string, unknown>) => void
  addSection: (moduleType: string) => void
  deleteSection: (sectionId: string) => void
  moveSectionUp: (sectionId: string) => void
  moveSectionDown: (sectionId: string) => void
}

function uid() {
  return crypto.randomUUID().slice(0, 8)
}

function getInitialModuleData(moduleType: string, data: Record<string, unknown>): Record<string, unknown> {
  if (moduleType !== 're_navbar') return { ...data }

  const { phonePath: _phonePath, ...rest } = data
  return rest
}

export const useEditorStore = create<EditorState>()((set) => ({
  activeSectionId: null,
  isDragging: false,
  pageData: null,
  isPreviewMode: false,
  siteInfo: defaultSiteSharedInfo,

  setActiveSectionId: (id) => set({ activeSectionId: id }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  setPageData: (page) => set({ pageData: page }),
  setSiteInfo: (siteInfo) => set({ siteInfo }),
  updateSiteInfo: (patch) =>
    set((state) => ({
      siteInfo: {
        ...state.siteInfo,
        ...patch,
      },
    })),
  resetPageData: () =>
    set({
      pageData: null,
      activeSectionId: null,
      isPreviewMode: false,
      siteInfo: defaultSiteSharedInfo,
    }),
  togglePreviewMode: () => set((s) => ({ isPreviewMode: !s.isPreviewMode })),

  updateModuleData: (sectionId, moduleId, partialData) =>
    set((state) => {
      if (!state.pageData) return state
      return {
        pageData: {
          ...state.pageData,
          sections: state.pageData.sections.map((section) =>
            section.id !== sectionId
              ? section
              : {
                  ...section,
                  modules: section.modules.map((mod) =>
                    mod.id !== moduleId
                      ? mod
                      : { ...mod, data: { ...mod.data, ...partialData } }
                  ),
                }
          ),
        },
      }
    }),

  addSection: (moduleType) =>
    set((state) => {
      if (!state.pageData) return state
      const defaults = MODULE_DEFAULTS[moduleType] ?? SJS_MODULE_DEFAULTS[moduleType] ?? SPECIAL_MODULE_DEFAULTS[moduleType]
      if (!defaults) return state

      const maxOrder = state.pageData.sections.reduce(
        (max, s) => Math.max(max, s.order),
        0
      )
      const sectionId = `section-${uid()}`
      const moduleId = `module-${uid()}`

      const newSection: Section = {
        id: sectionId,
        page_id: state.pageData.id,
        order: maxOrder + 1,
        modules: [{
          ...defaults,
          id: moduleId,
          section_id: sectionId,
          data: getInitialModuleData(moduleType, defaults.data),
        }],
      }

      return {
        pageData: {
          ...state.pageData,
          sections: [...state.pageData.sections, newSection],
        },
        activeSectionId: sectionId,
      }
    }),

  deleteSection: (sectionId) =>
    set((state) => {
      if (!state.pageData) return state
      return {
        activeSectionId: state.activeSectionId === sectionId ? null : state.activeSectionId,
        pageData: {
          ...state.pageData,
          sections: state.pageData.sections.filter((s) => s.id !== sectionId),
        },
      }
    }),

  moveSectionUp: (sectionId) =>
    set((state) => {
      if (!state.pageData) return state
      const sorted = [...state.pageData.sections].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((s) => s.id === sectionId)
      if (idx <= 0) return state
      const prev = sorted[idx - 1]
      const curr = sorted[idx]
      return {
        pageData: {
          ...state.pageData,
          sections: state.pageData.sections.map((s) => {
            if (s.id === curr.id) return { ...s, order: prev.order }
            if (s.id === prev.id) return { ...s, order: curr.order }
            return s
          }),
        },
      }
    }),

  moveSectionDown: (sectionId) =>
    set((state) => {
      if (!state.pageData) return state
      const sorted = [...state.pageData.sections].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((s) => s.id === sectionId)
      if (idx < 0 || idx >= sorted.length - 1) return state
      const next = sorted[idx + 1]
      const curr = sorted[idx]
      return {
        pageData: {
          ...state.pageData,
          sections: state.pageData.sections.map((s) => {
            if (s.id === curr.id) return { ...s, order: next.order }
            if (s.id === next.id) return { ...s, order: curr.order }
            return s
          }),
        },
      }
    }),
}))
