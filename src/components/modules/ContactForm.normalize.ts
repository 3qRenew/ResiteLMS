// Normalize — ContactForm (module_type: contact_form)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.
import type { SiteSharedInfo } from '../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../data/siteSharedInfoDefaults'

export type ContactFormFieldType = 'text' | 'tel' | 'radio' | 'select' | 'textarea'

export interface ContactFormField {
  type: ContactFormFieldType
  label: string
  required: boolean
  placeholder: string
  options: string[]
}

interface ContactFormFieldRaw {
  type?: unknown
  kind?: unknown
  label?: unknown
  required?: unknown
  placeholder?: unknown
  options?: unknown
}

export interface ContactFormData extends Record<string, unknown> {
  heading: string
  buttonLabel: string
  projectId: string | null
  formAnchorId: string
  fields: ContactFormField[]
  recaptchaEnabled: boolean
  privacyEnabled: boolean
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function normalizeFieldType(value: unknown): ContactFormFieldType | null {
  if (
    value === 'text' ||
    value === 'tel' ||
    value === 'radio' ||
    value === 'select' ||
    value === 'textarea'
  ) {
    return value
  }

  return null
}

function mapLegacyKindToType(value: unknown): ContactFormFieldType | null {
  switch (value) {
    case 'name':
    case 'title':
    case 'email':
      return 'text'
    case 'phone':
      return 'tel'
    case 'gender':
      return 'radio'
    case 'city':
    case 'district':
      return 'select'
    case 'note':
      return 'textarea'
    default:
      return null
  }
}

function normalizeField(raw: unknown): ContactFormField | null {
  if (typeof raw !== 'object' || raw === null) return null

  const source = raw as ContactFormFieldRaw
  const type = normalizeFieldType(source.type) ?? mapLegacyKindToType(source.kind)
  const label = asString(source.label).trim()

  if (!type || !label) return null

  return {
    type,
    label,
    required: asBoolean(source.required, false),
    placeholder: asString(source.placeholder),
    options: asStringArray(source.options),
  }
}

function defaultFields(): ContactFormField[] {
  return [
    { type: 'text', label: '姓名', required: true, placeholder: '請輸入您的姓名', options: [] },
    { type: 'tel', label: '電話', required: true, placeholder: '請輸入您的聯絡電話', options: [] },
  ]
}

function normalizeFields(raw: unknown): ContactFormField[] {
  if (!Array.isArray(raw)) return defaultFields()

  const fields = raw
    .map((field) => normalizeField(field))
    .filter((field): field is ContactFormField => field !== null)

  return fields.length > 0 ? fields : defaultFields()
}

export function normalizeContactForm(
  raw: Record<string, unknown>,
  siteInfo: SiteSharedInfo = defaultSiteSharedInfo,
): ContactFormData {
  return {
    heading: asString(raw.heading, '預約參觀'),
    buttonLabel: asString(raw.buttonLabel, '送出預約'),
    projectId: typeof raw.projectId === 'string' ? raw.projectId : null,
    formAnchorId: asString(raw.formAnchorId) || siteInfo.formAnchorId || 'contact',
    fields: normalizeFields(raw.fields),
    recaptchaEnabled: asBoolean(raw.recaptchaEnabled, false),
    privacyEnabled: asBoolean(raw.privacyEnabled, false),
  }
}
