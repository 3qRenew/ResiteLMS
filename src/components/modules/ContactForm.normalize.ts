// Normalize — ContactForm (module_type: contact_form)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.
import type { SiteSharedInfo } from '../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../data/siteSharedInfoDefaults'

export type ContactFormFieldKind =
  | 'name'
  | 'gender'
  | 'title'
  | 'phone'
  | 'email'
  | 'city'
  | 'district'
  | 'note'

export interface ContactFormField {
  kind: ContactFormFieldKind
  label: string
  required: boolean
  placeholder: string
  options: string[]
}

export interface ContactFormRecaptcha {
  enabled: boolean
  siteKey: string
}

export interface ContactFormLocationSchema {
  cityLabel: string
  districtLabel: string
  cityOptions: string[]
  districtOptions: Record<string, string[]>
}

export interface ContactFormData extends Record<string, unknown> {
  heading:       string
  buttonLabel:   string
  projectId:     string | null
  formAnchorId:  string
  fields:        ContactFormField[]
  recaptcha:     ContactFormRecaptcha
  location:      ContactFormLocationSchema
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

function normalizeField(raw: unknown): ContactFormField | null {
  if (typeof raw !== 'object' || raw === null) return null

  const source = raw as Record<string, unknown>
  const kind = source.kind

  if (
    kind !== 'name' &&
    kind !== 'gender' &&
    kind !== 'title' &&
    kind !== 'phone' &&
    kind !== 'email' &&
    kind !== 'city' &&
    kind !== 'district' &&
    kind !== 'note'
  ) {
    return null
  }

  return {
    kind,
    label: asString(source.label, kind),
    required: asBoolean(source.required, false),
    placeholder: asString(source.placeholder),
    options: asStringArray(source.options),
  }
}

function defaultFields(): ContactFormField[] {
  return [
    { kind: 'name', label: '姓名', required: true, placeholder: '請輸入您的姓名', options: [] },
    { kind: 'gender', label: '稱謂', required: false, placeholder: '', options: ['先生', '小姐'] },
    { kind: 'title', label: '職稱', required: false, placeholder: '請輸入您的職稱', options: [] },
    { kind: 'phone', label: '電話', required: true, placeholder: '請輸入您的聯絡電話', options: [] },
    { kind: 'email', label: 'Email', required: false, placeholder: '請輸入您的 Email（選填）', options: [] },
    { kind: 'city', label: '城市', required: false, placeholder: '請選擇城市', options: [] },
    { kind: 'district', label: '地區', required: false, placeholder: '請選擇地區', options: [] },
    { kind: 'note', label: '留言', required: false, placeholder: '歡迎留言，將有專人為您服務', options: [] },
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
    heading:      asString(raw.heading, '預約參觀'),
    buttonLabel:  asString(raw.buttonLabel, '送出預約'),
    projectId:    typeof raw.projectId === 'string' ? raw.projectId : null,
    formAnchorId: asString(raw.formAnchorId) || siteInfo.formAnchorId || 'contact',
    fields:       normalizeFields(raw.fields),
    recaptcha: {
      enabled: asBoolean(raw.recaptchaEnabled, false),
      siteKey: asString(raw.recaptchaSiteKey),
    },
    location: {
      cityLabel: asString(raw.cityLabel, '居住城市'),
      districtLabel: asString(raw.districtLabel, '鄉鎮市區'),
      cityOptions: asStringArray(raw.cityOptions),
      districtOptions:
        typeof raw.districtOptions === 'object' && raw.districtOptions !== null
          ? Object.fromEntries(
              Object.entries(raw.districtOptions).map(([key, value]) => [key, asStringArray(value)]),
            )
          : {},
    },
  }
}
