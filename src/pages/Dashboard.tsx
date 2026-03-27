import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Loader2, LayoutDashboard, Trash2, AlertCircle, ImageOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { defaultSections } from '../data/defaultSections'

interface ProjectRow {
  id: string
  name: string
  slug: string
  thumbnail_url: string | null
  updated_at: string
  created_at: string
}

// ── Supabase calls ────────────────────────────────────────────────────────────

async function fetchAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, slug, thumbnail_url, updated_at, created_at')
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as ProjectRow[]
}

async function createProject(): Promise<string> {
  const slug = `project-${Date.now()}`
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: '新建案專案',
      slug,
      project_data: { sections: defaultSections },
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return (data as { id: string }).id
}

async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ── 相對時間格式 ──────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return '剛剛'
  if (mins < 60) return `${mins} 分鐘前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  return new Date(iso).toLocaleDateString('zh-TW')
}

// ── 單張專案卡片 ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onDelete,
}: {
  project: ProjectRow
  onDelete: (id: string) => void
}) {
  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`確定要刪除「${project.name}」嗎？此操作無法復原。`)) {
      onDelete(project.id)
    }
  }

  return (
    <Link
      to={`/project/${project.id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col"
    >
      {/* 縮圖區 */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff size={28} strokeWidth={1.5} />
            <span className="text-xs">暫無預覽</span>
          </div>
        )}

        {/* 刪除按鈕（hover 才顯示） */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200
            text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50
            opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          title="刪除專案"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* 資訊區 */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
          {project.name}
        </h3>
        <p className="text-xs text-gray-400 font-mono truncate">{project.slug}</p>
        <p className="text-xs text-gray-300 mt-auto pt-2">
          更新於 {timeAgo(project.updated_at ?? project.created_at)}
        </p>
      </div>
    </Link>
  )
}

// ── Dashboard 頁面 ────────────────────────────────────────────────────────────

export function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchAllProjects,
  })

  const { mutate: handleCreate, isPending: isCreating } = useMutation({
    mutationFn: createProject,
    onSuccess: (newId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate(`/project/${newId}`)
    },
  })

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-none">Resite</h1>
              <p className="text-xs text-gray-400 mt-0.5">建案行銷頁管理後台</p>
            </div>
          </div>

          <button
            onClick={() => handleCreate()}
            disabled={isCreating}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl
              hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isCreating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            新建專案
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-8 py-8">

        {/* 統計列 */}
        {projects && projects.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">共</span>
            <span className="text-sm font-bold text-gray-900">{projects.length}</span>
            <span className="text-sm text-gray-500">個專案</span>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm py-12 justify-center">
            <Loader2 size={18} className="animate-spin" />
            載入中…
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {error instanceof Error ? error.message : '載入失敗，請重新整理'}
          </div>
        )}

        {/* Empty state */}
        {projects && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <LayoutDashboard size={28} className="text-blue-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                開始建立您的第一個建案頁面吧！
              </h2>
              <p className="text-sm text-gray-400">點擊右上角「新建專案」，幾分鐘內生成專業行銷頁。</p>
            </div>
            <button
              onClick={() => handleCreate()}
              disabled={isCreating}
              className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl
                hover:bg-blue-700 active:scale-95 disabled:opacity-60 transition-all mt-2 shadow-sm"
            >
              {isCreating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              建立第一個專案
            </button>
          </div>
        )}

        {/* Project grid */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
