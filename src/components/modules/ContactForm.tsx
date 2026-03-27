// ContactForm — 預約聯絡表單
//
// Data flow:
//   module.data → normalizeContactForm() → ContactFormData → render
//   Form state (name/phone/email) is local UI state, not module data.
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { ModuleProps } from './index'
import { normalizeContactForm } from './ContactForm.normalize'
import { useSiteSharedInfo } from '../renderer/SiteSharedInfoContext'

interface LeadPayload {
  name:       string
  phone:      string
  email:      string
  project_id: string | null
}

async function submitLead(payload: LeadPayload) {
  const { error } = await supabase.from('leads').insert(payload)
  if (error) throw new Error(error.message)
}

export function ContactForm({ module }: ModuleProps) {
  const siteInfo = useSiteSharedInfo()
  const { heading, buttonLabel, projectId, formAnchorId } = normalizeContactForm(
    module.data as Record<string, unknown>,
    siteInfo,
  )

  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: submitLead,
    onSuccess: () => {
      setName('')
      setPhone('')
      setEmail('')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ name, phone, email, project_id: projectId })
  }

  // ── 成功畫面 ─────────────────────────────────────────────────
  if (mutation.isSuccess) {
    return (
      <section id={formAnchorId} className="bg-gray-50 py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={56} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">預約成功！</h2>
          <p className="text-gray-500 mb-8">我們將在 24 小時內與您聯繫。</p>
          <button
            onClick={() => mutation.reset()}
            className="text-sm text-blue-600 underline underline-offset-2"
          >
            再次預約
          </button>
        </div>
      </section>
    )
  }

  // ── 表單畫面 ─────────────────────────────────────────────────
  return (
    <section id={formAnchorId} className="bg-gray-50 py-24 px-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{heading}</h2>

        {mutation.isError && (
          <div className="flex items-center gap-2 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertCircle size={16} className="shrink-0" />
            {mutation.error instanceof Error
              ? mutation.error.message
              : '提交失敗，請稍後再試。'}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入您的姓名"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              電話 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="請輸入您的聯絡電話"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入您的 Email（選填）"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
          >
            {mutation.isPending ? '送出中…' : buttonLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
