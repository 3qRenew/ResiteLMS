import { useRef, useState } from 'react'
import { Upload, ImageIcon, X, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const BUCKET = 'project-assets'
const MAX_SIZE_MB = 5

interface ImageUploaderProps {
  currentUrl?: string
  onUpload: (url: string) => void
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function ImageUploader({ currentUrl, onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)

    if (!file.type.startsWith('image/')) {
      setError('請上傳圖片檔案（JPG、PNG、WebP 等）')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`圖片大小不能超過 ${MAX_SIZE_MB}MB`)
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      onUpload(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗，請再試一次')
    } finally {
      setIsUploading(false)
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="mt-2">
      {/* 拖曳 / 點擊區域 */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
          ${isUploading ? 'cursor-not-allowed' : ''}`}
      >
        {/* 目前圖片預覽 */}
        {currentUrl ? (
          <div className="relative aspect-video">
            <img
              src={currentUrl}
              alt="preview"
              className="w-full h-full object-cover"
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium">
                <Upload size={14} />
                更換圖片
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-gray-400">
            <ImageIcon size={24} strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-xs font-medium">點擊或拖曳圖片</p>
              <p className="text-xs mt-0.5">JPG、PNG、WebP，最大 {MAX_SIZE_MB}MB</p>
            </div>
          </div>
        )}

        {/* 上傳進度遮罩 */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-2 text-blue-600 text-xs font-medium">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            上傳中…
          </div>
        )}
      </div>

      {/* 錯誤提示 */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={11} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}
