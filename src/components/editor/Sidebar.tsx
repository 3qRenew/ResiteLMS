import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Save, CheckCircle, AlertCircle, ChevronLeft, Eye, EyeOff,
  Link2, Check, ExternalLink, Plus, X, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useEditorStore } from '../../store/useEditorStore'
import { ImageUploader } from './ImageUploader'
import { SiteInfoPanel } from './SiteInfoPanel'
import { MODULE_LABELS } from '../../data/moduleDefaults'
import type { Module, Section, SiteSharedInfo } from '../../types'

// ── 欄位中文標籤對照表 ────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  // 通用
  title: '標題',
  subtitle: '副標題',
  heading: '區塊標題',
  sectionLabel: '區塊標籤',
  description: '說明文字',
  description1: '說明文字 1',
  description2: '說明文字 2',
  description3: '說明文字 3',
  disclaimer: '免責聲明',
  // 圖片
  backgroundImage: '背景圖片',
  logoImage: 'Logo 圖片',
  logoAlt: 'Logo 替代文字',
  mainImage: '主圖片',
  imageUrl: '圖片網址',
  imageCaption: '圖片說明',
  imagePosition: '圖片位置',
  mapImageUrl: '地圖圖片',
  image1: '圖片 1',
  image2: '圖片 2',
  image3: '圖片 3',
  url: '圖片網址',
  caption: '說明文字',
  // 影片
  videoUrl: '影片網址（mp4）',
  posterUrl: '影片封面圖',
  autoPlay: '自動播放',
  muted: '靜音',
  // CTA / 連結
  ctaLabel: '按鈕文字',
  ctaHref: '按鈕連結',
  bookingLink: '預約連結',
  facebookUrl: 'Facebook 連結',
  mapsUrl: '地圖連結',
  mapsEmbedUrl: '地圖嵌入網址',
  href: '連結網址',
  label: '標籤文字',
  // 聯絡 / 品牌
  logo: 'Logo 文字',
  propertyName: '建案名稱',
  brandName: '品牌名稱',
  tagline: '標語',
  phoneNumber: '電話號碼',
  phonePath: '電話連結',
  phone: '電話',
  // 案件資訊
  receptionAddress: '接待中心地址',
  projectLocation: '基地位置',
  investorCompany: '投資公司',
  coInvestorCompany: '共同投資公司',
  marketingCompany: '行銷公司',
  agentName: '經紀人姓名',
  agentLicense: '經紀人執照號碼',
  permitNumber: '建照號碼',
  copyrightText: '版權文字',
  // 空拍地圖
  projectAnchorX: '建案位置 X',
  projectAnchorY: '建案位置 Y',
  mobileHeight: '手機版高度 (px)',
  backgroundColor: '背景顏色',
  textPosition: '文字位置',
  // 輪播 / 陣列
  images: '圖片列表',
  links: '連結列表',
  // Features 積木
  feature1Icon: '特色 1 圖示',
  feature1Title: '特色 1 標題',
  feature1Description: '特色 1 說明',
  feature2Icon: '特色 2 圖示',
  feature2Title: '特色 2 標題',
  feature2Description: '特色 2 說明',
  feature3Icon: '特色 3 圖示',
  feature3Title: '特色 3 標題',
  feature3Description: '特色 3 說明',
  buttonLabel: '按鈕文字',
}

function toLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

// ── 存檔邏輯 ──────────────────────────────────────────────────────────────────

const MOCK_ID_SENTINEL = 'project-1'

const THUMBNAIL_MODULE_TYPES = new Set(['hero_standard', 'hero_banner', 'sjs_banner'])

function extractThumbnail(sections: Section[]): string | null {
  for (const section of sections) {
    for (const mod of section.modules) {
      if (THUMBNAIL_MODULE_TYPES.has(mod.module_type)) {
        return (mod.data.backgroundImage as string) ?? null
      }
    }
  }
  return null
}

async function saveProject(
  projectId: string,
  title: string,
  slug: string,
  sections: Section[],
  siteInfo: SiteSharedInfo,
): Promise<string> {
  const isNew = projectId === MOCK_ID_SENTINEL
  const payload = {
    ...(isNew ? {} : { id: projectId }),
    name: title,
    slug,
    project_data: { sections, siteInfo },
    thumbnail_url: extractThumbnail(sections),
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await supabase
    .from('projects')
    .upsert(payload, { onConflict: 'id' })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return (data as { id: string }).id
}

// ── 陣列欄位編輯器 ────────────────────────────────────────────────────────────

type AnyRecord = Record<string, unknown>

function isImageKey(key: string) {
  const k = key.toLowerCase()
  // videoUrl is a video file, not an image — exclude it
  if (k === 'videourl') return false
  // Must END with a URL/image suffix — prevents 'imageCaption', 'imagePosition' from triggering
  return k.endsWith('url') || k.endsWith('image') || k.endsWith('img') || k === 'url'
}

/** 根據第一個現有項目建立空白項目 */
function createBlankItem(template: AnyRecord): AnyRecord {
  if (Object.keys(template).length === 0) return {}
  return Object.fromEntries(
    Object.entries(template).map(([k, v]) => {
      if (typeof v === 'number') return [k, 0]
      if (typeof v === 'boolean') return [k, false]
      return [k, '']
    })
  )
}

/** 取得項目的預覽文字 */
function getItemPreview(item: AnyRecord, idx: number): string {
  const label = item.label ?? item.caption ?? item.title ?? item.name
  if (typeof label === 'string' && label) return label
  const urlVal = Object.entries(item).find(([k]) => isImageKey(k) && typeof item[k] === 'string' && item[k])
  if (urlVal) return '圖片'
  return `項目 ${idx + 1}`
}

function ArrayFieldEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: AnyRecord[]
  onChange: (newItems: AnyRecord[]) => void
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  function addItem() {
    const template = items[0] ?? {}
    const blank = createBlankItem(template)
    const next = [...items, blank]
    onChange(next)
    setExpandedIdx(next.length - 1)
  }

  function deleteItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx))
    setExpandedIdx((prev) => (prev === idx ? null : prev))
  }

  function moveItem(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
    setExpandedIdx(target)
  }

  function updateField(idx: number, key: string, value: unknown) {
    onChange(items.map((item, i) => (i === idx ? { ...item, [key]: value } : item)))
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
          <span className="ml-1.5 font-normal text-gray-300 normal-case">({items.length} 項)</span>
        </label>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {items.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">尚無項目</p>
        )}

        {items.map((item, idx) => {
          const preview = getItemPreview(item, idx)
          const thumbUrl = Object.entries(item).find(
            ([k, v]) => isImageKey(k) && typeof v === 'string' && v
          )?.[1] as string | undefined

          return (
            <div key={idx} className="bg-white">
              {/* ── 項目列 ── */}
              <div className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-50 transition-colors">
                {/* 展開按鈕 + 縮圖/預覽 */}
                <button
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="flex-1 min-w-0 flex items-center gap-2 text-left"
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt=""
                      className="w-8 h-6 object-cover rounded shrink-0 border border-gray-100"
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-blue-200 shrink-0" />
                  )}
                  <span className="text-xs text-gray-700 truncate">{preview}</span>
                  <span className="ml-auto shrink-0 text-gray-300">
                    {expandedIdx === idx ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </span>
                </button>

                {/* 上下移動 */}
                <button
                  onClick={() => moveItem(idx, -1)}
                  disabled={idx === 0}
                  title="上移"
                  className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(idx, 1)}
                  disabled={idx === items.length - 1}
                  title="下移"
                  className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition"
                >
                  ↓
                </button>

                {/* 刪除 */}
                <button
                  onClick={() => deleteItem(idx)}
                  title="刪除"
                  className="p-0.5 text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 size={11} />
                </button>
              </div>

              {/* ── 展開的子欄位 ── */}
              {expandedIdx === idx && (
                <div className="px-3 pt-2 pb-3 bg-gray-50 flex flex-col gap-2.5 border-t border-gray-100">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wide">
                        {toLabel(key)}
                      </label>
                      {typeof value === 'boolean' ? (
                        /* 布林欄位：Toggle switch */
                        <button
                          role="switch"
                          aria-checked={value}
                          onClick={() => updateField(idx, key, !value)}
                          className={`relative flex items-center w-10 h-5 rounded-full transition-colors shrink-0
                            ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transition-transform
                              ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
                          />
                          <span className="sr-only">{value ? '顯示' : '隱藏'}</span>
                        </button>
                      ) : typeof value === 'number' ? (
                        /* 數字欄位：Slider（適用 x/y 座標 0–100）*/
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={value}
                            onChange={(e) => updateField(idx, key, Number(e.target.value))}
                            className="flex-1 accent-blue-500"
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={value}
                            onChange={(e) => updateField(idx, key, Number(e.target.value))}
                            className="w-12 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-center outline-none focus:border-blue-400"
                          />
                        </div>
                      ) : (
                        /* 文字欄位 */
                        <>
                          <input
                            type="text"
                            value={String(value ?? '')}
                            onChange={(e) => updateField(idx, key, e.target.value)}
                            className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                          />
                          {isImageKey(key) && (
                            <ImageUploader
                              currentUrl={String(value ?? '')}
                              onUpload={(url) => updateField(idx, key, url)}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* 新增項目 */}
        <button
          onClick={addItem}
          className="flex items-center justify-center gap-1.5 w-full py-2 text-xs text-gray-400
            hover:text-blue-600 hover:bg-blue-50 transition-colors bg-white"
        >
          <Plus size={11} />
          新增項目
        </button>
      </div>
    </div>
  )
}

// ── 廢棄欄位黑名單（舊存檔殘留，不顯示於 UI）────────────────────────────────

const DEPRECATED_FIELDS: Record<string, string[]> = {
  sjs_aerial_view: ['markers', 'showMarkers'],
  aerial_view:     ['markers', 'showMarkers'],
}

// ── 單一 Module 的欄位編輯器 ─────────────────────────────────────────────────

function ModuleFieldEditor({
  sectionId,
  module,
}: {
  sectionId: string
  module: Module
}) {
  const updateModuleData = useEditorStore((s) => s.updateModuleData)

  const deprecated = new Set(DEPRECATED_FIELDS[module.module_type] ?? [])
  const entries = Object.entries(module.data).filter(([k]) => !deprecated.has(k))
  const booleanFields = entries.filter(([, v]) => typeof v === 'boolean') as [string, boolean][]
  const stringFields = entries.filter(([, v]) => typeof v === 'string') as [string, string][]
  const numberFields = entries.filter(([, v]) => typeof v === 'number' && !Array.isArray(v)) as [string, number][]
  const arrayFields = entries.filter(([, v]) => Array.isArray(v)) as [string, AnyRecord[]][]

  if (booleanFields.length === 0 && stringFields.length === 0 && numberFields.length === 0 && arrayFields.length === 0) {
    return <p className="text-xs text-gray-400">此模組沒有可編輯的欄位。</p>
  }

  const isImageField = (key: string) => key.toLowerCase().includes('image')
  const isColorField = (key: string) => key.toLowerCase().includes('color')
  /** anchor fields (projectAnchorX/Y, x, y): 0–100 slider */
  const isAnchorField = (key: string) => /anchor|^x$|^y$/i.test(key)

  return (
    <div className="flex flex-col gap-4">
      {/* 布林欄位 */}
      {booleanFields.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {toLabel(key)}
          </label>
          <button
            role="switch"
            aria-checked={value}
            onClick={() => updateModuleData(sectionId, module.id, { [key]: !value })}
            className={`relative flex items-center w-10 h-5 rounded-full transition-colors shrink-0
              ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transition-transform
                ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
            <span className="sr-only">{value ? '開啟' : '關閉'}</span>
          </button>
        </div>
      ))}

      {/* 字串欄位 */}
      {stringFields.map(([key, value]) => {
        // imagePosition：特殊 toggle（支援 left / right / top）
        if (key === 'imagePosition') {
          const options: { val: string; label: string }[] = [
            { val: 'left',  label: '圖左文右' },
            { val: 'right', label: '圖右文左' },
            { val: 'top',   label: '圖上文下' },
          ]
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {toLabel(key)}
              </label>
              <div className="flex gap-1.5">
                {options.map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => updateModuleData(sectionId, module.id, { imagePosition: val })}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all
                      ${value === val
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )
        }

        // textPosition：toggle
        if (key === 'textPosition') {
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {toLabel(key)}
              </label>
              <div className="flex gap-2">
                {(['top', 'bottom'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateModuleData(sectionId, module.id, { textPosition: pos })}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all
                      ${value === pos
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {pos === 'top' ? '文字在上' : '文字在下'}
                  </button>
                ))}
              </div>
            </div>
          )
        }

        // 顏色欄位：color picker + hex input
        if (isColorField(key)) {
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {toLabel(key)}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => updateModuleData(sectionId, module.id, { [key]: e.target.value })}
                  className="w-9 h-9 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateModuleData(sectionId, module.id, { [key]: e.target.value })}
                  className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-mono text-gray-800 outline-none
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="#000000"
                />
              </div>
            </div>
          )
        }

        // 一般文字欄位
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {toLabel(key)}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => updateModuleData(sectionId, module.id, { [key]: e.target.value })}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none
                focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
            {isImageField(key) && (
              <ImageUploader
                currentUrl={value}
                onUpload={(url) => updateModuleData(sectionId, module.id, { [key]: url })}
              />
            )}
          </div>
        )
      })}

      {/* 數字欄位 */}
      {numberFields.map(([key, value]) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {toLabel(key)}
          </label>
          {isAnchorField(key) ? (
            /* Anchor / coordinate field: slider 0–100 with decimal precision */
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={value}
                onChange={(e) =>
                  updateModuleData(sectionId, module.id, { [key]: Number(e.target.value) })
                }
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={value}
                onChange={(e) =>
                  updateModuleData(sectionId, module.id, { [key]: Number(e.target.value) })
                }
                className="w-14 rounded border border-gray-200 bg-white px-1.5 py-1 text-xs text-center outline-none focus:border-blue-400"
              />
            </div>
          ) : (
            /* General numeric field: plain number input */
            <input
              type="number"
              value={value}
              onChange={(e) =>
                updateModuleData(sectionId, module.id, { [key]: Number(e.target.value) })
              }
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          )}
        </div>
      ))}

      {/* 陣列欄位 */}
      {arrayFields.map(([key, items]) => (
        <ArrayFieldEditor
          key={key}
          label={toLabel(key)}
          items={items}
          onChange={(newItems) => updateModuleData(sectionId, module.id, { [key]: newItems })}
        />
      ))}

    </div>
  )
}

// ── Sidebar 主體 ──────────────────────────────────────────────────────────────

export function Sidebar() {
  const navigate = useNavigate()
  const activeSectionId = useEditorStore((s) => s.activeSectionId)
  const pageData = useEditorStore((s) => s.pageData)
  const siteInfo = useEditorStore((s) => s.siteInfo)
  const setPageData = useEditorStore((s) => s.setPageData)
  const updateSiteInfo = useEditorStore((s) => s.updateSiteInfo)
  const resetPageData = useEditorStore((s) => s.resetPageData)
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode)
  const togglePreviewMode = useEditorStore((s) => s.togglePreviewMode)
  const addSection = useEditorStore((s) => s.addSection)

  const [savedOk, setSavedOk] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showModulePicker, setShowModulePicker] = useState(false)
  const [activeTab, setActiveTab] = useState<'site_info' | 'module_settings'>('module_settings')

  function handleBack() {
    resetPageData()
    navigate('/')
  }

  function handleCopyLink() {
    if (!pageData) return
    const url = `${window.location.origin}/view/${pageData.project_id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const activeSection = pageData?.sections.find((s) => s.id === activeSectionId)

  const { mutate: handleSave, isPending, isError, error } = useMutation({
    mutationFn: () => {
      if (!pageData) throw new Error('no page data')
      return saveProject(pageData.project_id, pageData.title, pageData.slug, pageData.sections, siteInfo)
    },
    onSuccess: (dbId) => {
      if (pageData && pageData.project_id === MOCK_ID_SENTINEL) {
        setPageData({ ...pageData, id: dbId, project_id: dbId })
      }
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 3000)
    },
  })

  return (
    <aside className="h-full flex flex-col bg-gray-50 border-l border-gray-200">
      {/* ── 返回按鈕 ── */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-500
          hover:text-gray-900 hover:bg-gray-100 border-b border-gray-200 bg-white
          transition-colors group w-full text-left"
      >
        <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        返回儀表板
      </button>

      {/* ── Header：預覽切換 + 存檔 ── */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-700 shrink-0 flex-1">屬性面板</h2>
        <button
          onClick={togglePreviewMode}
          title={isPreviewMode ? '退出預覽' : '預覽模式'}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md transition-all
            ${isPreviewMode
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {isPreviewMode ? <EyeOff size={13} /> : <Eye size={13} />}
          {isPreviewMode ? '退出' : '預覽'}
        </button>
        <button
          onClick={() => handleSave()}
          disabled={isPending || !pageData}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md transition-all
            bg-blue-600 text-white hover:bg-blue-700 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={13} />
          {isPending ? '儲存中…' : '儲存'}
        </button>
      </div>

      {/* ── 分享連結 ── */}
      <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center gap-1">
        <button
          onClick={handleCopyLink}
          disabled={!pageData}
          className="flex-1 flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600
            py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Link2 size={13} />}
          <span>{copied ? '已複製連結！' : '複製分享連結'}</span>
        </button>
        <button
          onClick={() => pageData && window.open(`/view/${pageData.project_id}`, '_blank')}
          disabled={!pageData}
          title="另開視窗預覽"
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md
            transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ExternalLink size={13} />
        </button>
      </div>

      {/* ── 存檔狀態通知 ── */}
      {savedOk && (
        <div className="mx-4 mt-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <CheckCircle size={13} className="shrink-0" />
          已成功儲存到 Supabase！
        </div>
      )}
      {isError && (
        <div className="mx-4 mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {error instanceof Error ? error.message : '儲存失敗'}
        </div>
      )}

      {/* ── 欄位編輯區 ── */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 rounded-lg bg-gray-100 p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('site_info')}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'site_info'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              專案資訊
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('module_settings')}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'module_settings'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              區塊設定
            </button>
          </div>
        </div>

        {activeTab === 'site_info' && (
          <SiteInfoPanel value={siteInfo} onChange={updateSiteInfo} />
        )}

        {activeTab === 'module_settings' && !activeSectionId && (
          <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400 text-sm gap-2">
            <div className="text-2xl">👆</div>
            請點擊左側區塊進行編輯
          </div>
        )}

        {activeTab === 'module_settings' && activeSectionId && !activeSection && (
          <p className="text-xs text-gray-400">找不到對應的區塊。</p>
        )}

        {activeTab === 'module_settings' && activeSection &&
          [...activeSection.modules]
            .sort((a, b) => a.order - b.order)
            .map((mod) => (
              <div key={mod.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {mod.module_type}
                  </span>
                </div>
                <ModuleFieldEditor sectionId={activeSection.id} module={mod} />
              </div>
            ))}
      </div>

      {/* ── 新增區塊 ── */}
      <div className="border-t border-gray-200 bg-white">
        {showModulePicker ? (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">選擇區塊類型</span>
              <button
                onClick={() => setShowModulePicker(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {Object.entries(MODULE_LABELS).map(([type, { label, icon }]) => (
                <button
                  key={type}
                  onClick={() => {
                    addSection(type)
                    setShowModulePicker(false)
                  }}
                  className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-gray-700
                    rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowModulePicker(true)}
            className="flex items-center justify-center gap-1.5 w-full py-3 text-xs font-medium
              text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Plus size={13} />
            新增區塊
          </button>
        )}
      </div>

      {/* ── Footer（active 時顯示 section ID）── */}
      {activeSectionId && !showModulePicker && (
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-300 font-mono truncate">{activeSectionId}</p>
        </div>
      )}
    </aside>
  )
}
