import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { GenericRenderer } from '../components/renderer/GenericRenderer'
import { EditorWrapper } from '../components/editor/EditorWrapper'
import { Sidebar } from '../components/editor/Sidebar'
import { useEditorStore } from '../store/useEditorStore'
import type { Section } from '../types'
import type { SiteSharedInfo } from '../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../data/siteSharedInfoDefaults'

interface ProjectRow {
  id: string
  name: string
  slug: string
  project_data: {
    sections: Section[]
    /** Optional site-level shared info stored alongside sections in the JSONB blob. */
    siteInfo?: Partial<SiteSharedInfo>
  }
}

async function fetchProject(projectId: string): Promise<ProjectRow> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, slug, project_data')
    .eq('id', projectId)
    .single()

  if (error) throw new Error(error.message)
  return data as ProjectRow
}

export function Editor() {
  const { projectId } = useParams<{ projectId: string }>()
  const setPageData = useEditorStore((s) => s.setPageData)
  const setSiteInfo = useEditorStore((s) => s.setSiteInfo)
  const resetPageData = useEditorStore((s) => s.resetPageData)
  const pageData = useEditorStore((s) => s.pageData)
  const siteInfo = useEditorStore((s) => s.siteInfo)
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode)

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
  })

  // 抓到資料後初始化 store
  useEffect(() => {
    if (!project) return
    setPageData({
      id: project.id,
      project_id: project.id,
      title: project.name,
      slug: project.slug,
      sections: project.project_data?.sections ?? [],
    })
    setSiteInfo({
      ...defaultSiteSharedInfo,
      ...(project.project_data?.siteInfo ?? {}),
    })
  }, [project, setPageData, setSiteInfo])

  // 離開頁面時清除 store，避免切換專案時資料殘留
  useEffect(() => {
    return () => resetPageData()
  }, [resetPageData])

  // ── 錯誤狀態 ──
  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 text-gray-500">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm">{error instanceof Error ? error.message : '載入失敗'}</p>
        <Link to="/" className="text-sm text-blue-600 underline underline-offset-2">
          返回 Dashboard
        </Link>
      </div>
    )
  }

  // ── 載入中 ──
  if (isLoading || !pageData) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 gap-2">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">載入專案中…</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* ── 預覽區（預覽模式時填滿全螢幕）── */}
      <div className="flex-1 overflow-y-auto relative">
        <GenericRenderer
          sections={pageData.sections}
          isEditing={!isPreviewMode}
          siteInfo={siteInfo}
          wrapSection={(sectionId, children) => (
            <EditorWrapper key={sectionId} sectionId={sectionId}>
              {children}
            </EditorWrapper>
          )}
        />
      </div>

      {/* ── 右側編輯面板（預覽模式時隱藏）── */}
      {!isPreviewMode && (
        <div className="w-80 shrink-0 relative z-50">
          <Sidebar />
        </div>
      )}
    </div>
  )
}
