// ContactForm — 預約聯絡表單
//
// Data flow:
//   module.data → normalizeContactForm() → ContactFormData → render
//   Form state is fields-driven local UI state, not module data.
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { ModuleProps } from './index'
import type { ContactFormField } from './ContactForm.normalize'
import { normalizeContactForm } from './ContactForm.normalize'

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
  const { heading, buttonLabel, projectId, formAnchorId, fields } = normalizeContactForm(
    module.data as Record<string, unknown>,
  )

  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const mutation = useMutation({
    mutationFn: submitLead,
    onSuccess: () => {
      setFormValues({})
    },
  })

  function fieldKey(index: number) {
    return `field-${index}`
  }

  function updateFieldValue(index: number, value: string) {
    setFormValues((current) => ({
      ...current,
      [fieldKey(index)]: value,
    }))
  }

  function getFieldValue(index: number): string {
    return formValues[fieldKey(index)] ?? ''
  }

  function getLeadPayload() {
    const firstTextFieldIndex = fields.findIndex((field) => field.type === 'text')
    const firstTelFieldIndex = fields.findIndex((field) => field.type === 'tel')

    return {
      name: firstTextFieldIndex >= 0 ? getFieldValue(firstTextFieldIndex) : '',
      phone: firstTelFieldIndex >= 0 ? getFieldValue(firstTelFieldIndex) : '',
      email: '',
      project_id: projectId,
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate(getLeadPayload())
  }

  function renderField(field: ContactFormField, index: number) {
    const value = getFieldValue(index)
    const baseFieldClassName =
      'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => updateFieldValue(index, e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={`${baseFieldClassName} min-h-28 resize-y`}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => updateFieldValue(index, e.target.value)}
          required={field.required}
          className={baseFieldClassName}
        >
          <option value="">{field.placeholder || `請選擇${field.label}`}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'radio') {
      return (
        <div className="flex flex-wrap gap-3">
          {field.options.map((option) => (
            <label
              key={option}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
            >
              <input
                type="radio"
                name={fieldKey(index)}
                value={option}
                checked={value === option}
                onChange={(e) => updateFieldValue(index, e.target.value)}
                required={field.required && !value}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )
    }

    return (
      <input
        type={field.type}
        required={field.required}
        value={value}
        onChange={(e) => updateFieldValue(index, e.target.value)}
        placeholder={field.placeholder}
        className={baseFieldClassName}
      />
    )
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
          {fields.map((field, index) => (
            <div key={`${field.label}-${index}`} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              {renderField(field, index)}
            </div>
          ))}

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
