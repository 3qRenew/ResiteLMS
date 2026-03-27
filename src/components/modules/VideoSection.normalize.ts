// Normalize — VideoSection (module_type: video_section)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.

export interface VideoSectionData {
  videoUrl:  string   // mp4 影片網址
  posterUrl: string   // 封面圖（影片載入前顯示）
  autoPlay:  boolean  // 自動播放
  muted:     boolean  // 靜音
}

export function normalizeVideoSection(raw: Record<string, unknown>): VideoSectionData {
  return {
    videoUrl:  String(raw.videoUrl  ?? ''),
    posterUrl: String(raw.posterUrl ?? ''),
    autoPlay:  raw.autoPlay !== false,
    muted:     raw.muted    !== false,
  }
}
