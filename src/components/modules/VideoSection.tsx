/**
 * VideoSection — 影片區塊
 *
 * 支援 mp4 背景影片（可設自動播放、靜音、封面圖）。
 * framer-motion 淡入進場動畫。
 *
 * Data flow:
 *   module.data → normalizeVideoSection() → VideoSectionData → render
 */
import { motion } from 'framer-motion'
import type { ModuleProps } from './index'
import { normalizeVideoSection } from './VideoSection.normalize'

export function VideoSection({ module }: ModuleProps) {
  const d = normalizeVideoSection(module.data as Record<string, unknown>)

  if (!d.videoUrl) {
    return (
      <div
        className="w-full flex items-center justify-center text-sm"
        style={{ height: '400px', background: '#111', color: '#555' }}
      >
        請輸入影片網址
      </div>
    )
  }

  return (
    <motion.section
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
    >
      <video
        src={d.videoUrl}
        poster={d.posterUrl || undefined}
        autoPlay={d.autoPlay}
        muted={d.muted}
        loop
        playsInline
        className="w-full block"
        style={{ display: 'block' }}
      />
    </motion.section>
  )
}
