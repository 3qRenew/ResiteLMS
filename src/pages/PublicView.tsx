import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { GenericRenderer } from '../components/renderer/GenericRenderer'
import type { Section, SiteSharedInfo } from '../types'
import { defaultSiteSharedInfo } from '../data/siteSharedInfoDefaults'

interface ProjectRow {
  id: string
  name: string
  slug: string
  project_data: { sections: Section[]; siteInfo?: Partial<SiteSharedInfo> }
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

/**
 * 公開展示頁 — 純渲染，無任何編輯 UI。
 * 網址傳給客戶，他們看到的就是完整的建案行銷頁。
 */
export function PublicView() {
  const { projectId } = useParams<{ projectId: string }>()

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project-public', projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400 gap-2">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">載入中…</span>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3 text-gray-500">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm">{error instanceof Error ? error.message : '頁面不存在'}</p>
        <Link to="/" className="text-xs text-blue-600 underline underline-offset-2">
          返回首頁
        </Link>
      </div>
    )
  }

  const sections = project.project_data?.sections ?? []
  // NOTE: 暫時路徑 — 直接讀 project_data（非 published snapshot）。
  // 待 publish pipeline 完成後，改為讀 published_data.siteInfo。
  const siteInfo: SiteSharedInfo = { ...defaultSiteSharedInfo, ...(project.project_data?.siteInfo ?? {}) }

  return <GenericRenderer sections={sections} siteInfo={siteInfo} />
}
