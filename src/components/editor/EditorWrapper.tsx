import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'

interface EditorWrapperProps {
  sectionId: string
  children: ReactNode
}

export function EditorWrapper({ sectionId, children }: EditorWrapperProps) {
  const [isHovered, setIsHovered] = useState(false)

  const activeSectionId = useEditorStore((s) => s.activeSectionId)
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode)
  const pageData = useEditorStore((s) => s.pageData)
  const setActiveSectionId = useEditorStore((s) => s.setActiveSectionId)
  const deleteSection = useEditorStore((s) => s.deleteSection)
  const moveSectionUp = useEditorStore((s) => s.moveSectionUp)
  const moveSectionDown = useEditorStore((s) => s.moveSectionDown)

  if (isPreviewMode) return <>{children}</>

  const isActive = activeSectionId === sectionId

  // 計算是否可上移/下移
  const sorted = pageData
    ? [...pageData.sections].sort((a, b) => a.order - b.order)
    : []
  const idx = sorted.findIndex((s) => s.id === sectionId)
  const canMoveUp = idx > 0
  const canMoveDown = idx < sorted.length - 1

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (window.confirm('確定要刪除這個區塊嗎？')) {
      deleteSection(sectionId)
    }
  }

  return (
    <div
      className="relative cursor-pointer transition-all"
      style={{
        outline: isActive
          ? '2px solid #2563eb'
          : isHovered
            ? '2px dashed #93c5fd'
            : '2px solid transparent',
        outlineOffset: '-2px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setActiveSectionId(sectionId)}
    >
      {/* 頂部工具列（active 或 hover 時顯示）*/}
      {(isActive || isHovered) && (
        <div
          className="absolute top-2 left-2 z-50 flex items-center gap-1 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Section 標籤 */}
          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-l-md rounded-r-none">
            {sectionId}
          </span>

          {/* 上移 */}
          <button
            onClick={(e) => { e.stopPropagation(); moveSectionUp(sectionId) }}
            disabled={!canMoveUp}
            title="上移"
            className="bg-blue-600 text-white p-0.5 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={14} />
          </button>

          {/* 下移 */}
          <button
            onClick={(e) => { e.stopPropagation(); moveSectionDown(sectionId) }}
            disabled={!canMoveDown}
            title="下移"
            className="bg-blue-600 text-white p-0.5 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={14} />
          </button>

          {/* 刪除 */}
          <button
            onClick={handleDelete}
            title="刪除區塊"
            className="bg-red-500 text-white p-0.5 rounded-r-md hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {children}
    </div>
  )
}
