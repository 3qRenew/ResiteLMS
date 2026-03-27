import type { ChangeEvent } from 'react'
import { ImageUploader } from './ImageUploader'
import type { SiteSharedInfo, SiteSharedSocialLink } from '../../types/siteSharedInfo'

interface SiteInfoPanelProps {
  value: SiteSharedInfo
  onChange: (patch: Partial<SiteSharedInfo>) => void
}

function updateSocialLink(
  socialLinks: SiteSharedSocialLink[],
  index: number,
  patch: Partial<SiteSharedSocialLink>,
): SiteSharedSocialLink[] {
  return socialLinks.map((link, currentIndex) =>
    currentIndex === index ? { ...link, ...patch } : link,
  )
}

export function SiteInfoPanel({ value, onChange }: SiteInfoPanelProps) {
  function handleTextChange<K extends keyof SiteSharedInfo>(key: K) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      onChange({ [key]: e.target.value } as Pick<SiteSharedInfo, K>)
    }
  }

  function handleAddSocialLink() {
    onChange({
      socialLinks: [
        ...value.socialLinks,
        { label: '', href: '' },
      ],
    })
  }

  function handleSocialLinkChange(index: number, patch: Partial<SiteSharedSocialLink>) {
    onChange({
      socialLinks: updateSocialLink(value.socialLinks, index, patch),
    })
  }

  function handleDeleteSocialLink(index: number) {
    onChange({
      socialLinks: value.socialLinks.filter((_, currentIndex) => currentIndex !== index),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">建案名稱</label>
        <input type="text" value={value.projectName} onChange={handleTextChange('projectName')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Logo 圖片</label>
        <input type="text" value={value.projectLogoUrl} onChange={handleTextChange('projectLogoUrl')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
        <ImageUploader
          currentUrl={value.projectLogoUrl}
          onUpload={(url) => onChange({ projectLogoUrl: url })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">電話</label>
        <input type="text" value={value.phone} onChange={handleTextChange('phone')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">接待中心地址</label>
        <input type="text" value={value.receptionAddress} onChange={handleTextChange('receptionAddress')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">地圖連結</label>
        <input type="text" value={value.mapLink} onChange={handleTextChange('mapLink')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">地圖嵌入網址</label>
        <input type="text" value={value.mapEmbedUrl} onChange={handleTextChange('mapEmbedUrl')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">表單錨點 ID</label>
        <input type="text" value={value.formAnchorId} onChange={handleTextChange('formAnchorId')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">品牌名稱</label>
        <input type="text" value={value.brandName} onChange={handleTextChange('brandName')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">品牌連結</label>
        <input type="text" value={value.brandUrl} onChange={handleTextChange('brandUrl')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">版權文字</label>
        <input type="text" value={value.copyrightText} onChange={handleTextChange('copyrightText')} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">社群連結</label>
          <button type="button" onClick={handleAddSocialLink} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
            新增
          </button>
        </div>

        {value.socialLinks.length === 0 && (
          <p className="rounded-md border border-dashed border-gray-200 bg-white px-3 py-2 text-xs text-gray-400">
            尚未設定社群連結
          </p>
        )}

        {value.socialLinks.map((link, index) => (
          <div key={`${index}-${link.href}`} className="rounded-md border border-gray-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">連結 {index + 1}</span>
              <button type="button" onClick={() => handleDeleteSocialLink(index)} className="text-xs text-red-500 hover:text-red-600 transition-colors">
                刪除
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleSocialLinkChange(index, { label: e.target.value })}
                placeholder="標籤"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => handleSocialLinkChange(index, { href: e.target.value })}
                placeholder="連結網址"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
