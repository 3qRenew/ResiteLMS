// Normalize — ContactForm (module_type: contact_form)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.
import type { SiteSharedInfo } from '../../types/siteSharedInfo'
import { defaultSiteSharedInfo } from '../../data/siteSharedInfoDefaults'

// ── PHP field name whitelist ──────────────────────────────────────────────────

export const PHP_FIELD_KEYS = [
  'contact_name',
  'contact_phone',
  'contact_email',
  'contact_sex',
  'contact_age',
  'contact_budget',
  'contact_room[]',
  'contact_car',
  'contact_ping',
  'contact_know',
  'contact_area',
  'contact_address',
  'contact_note',
  'my_date',
  'my_time',
] as const

export type PhpFieldKey = (typeof PHP_FIELD_KEYS)[number]

export const PHP_FIELD_KEY_LABELS: Record<PhpFieldKey, string> = {
  'contact_name':    '姓名',
  'contact_phone':   '電話',
  'contact_email':   'Email',
  'contact_sex':     '稱謂',
  'contact_age':     '年齡',
  'contact_budget':  '預算',
  'contact_room[]':  '房型',
  'contact_car':     '車位需求',
  'contact_ping':    '坪數',
  'contact_know':    '得知管道',
  'contact_area':    '居住城市',
  'contact_address': '鄉鎮市區',
  'contact_note':    '留言',
  'my_date':         '預約日期',
  'my_time':         '預約時間',
}

export type PhpFieldWidget = 'text' | 'tel' | 'email' | 'radio' | 'select' | 'textarea' | 'checkbox'

export const PHP_WIDGET_OPTIONS: Array<{ value: PhpFieldWidget; label: string }> = [
  { value: 'text',     label: '文字' },
  { value: 'tel',      label: '電話' },
  { value: 'email',    label: 'Email' },
  { value: 'textarea', label: '多行文字' },
  { value: 'select',   label: '下拉選單' },
  { value: 'radio',    label: '單選' },
  { value: 'checkbox', label: '多選' },
]

export interface ContactFormField {
  name:        PhpFieldKey
  widget:      PhpFieldWidget
  label:       string
  required:    boolean
  placeholder: string
  options:     string[]
}

export interface ContactFormData extends Record<string, unknown> {
  formActionId:     string
  recaptchaEnabled: boolean
  recaptchaSiteKey: string   // temp: stored in module data; key governance deferred
  formAnchorId:     string
  heading:          string
  buttonLabel:      string
  privacyText:      string
  fields:           ContactFormField[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function isPhpFieldKey(value: unknown): value is PhpFieldKey {
  return PHP_FIELD_KEYS.includes(value as PhpFieldKey)
}

function isPhpWidget(value: unknown): value is PhpFieldWidget {
  return (
    value === 'text' ||
    value === 'tel' ||
    value === 'email' ||
    value === 'radio' ||
    value === 'select' ||
    value === 'textarea' ||
    value === 'checkbox'
  )
}

// ── Legacy mapping (kind / type → name / widget) ──────────────────────────────

const LEGACY_KIND_TO_NAME: Record<string, PhpFieldKey> = {
  name:     'contact_name',
  phone:    'contact_phone',
  email:    'contact_email',
  gender:   'contact_sex',
  title:    'contact_sex',
  city:     'contact_area',
  district: 'contact_address',
  note:     'contact_note',
}

const LEGACY_KIND_TO_WIDGET: Record<string, PhpFieldWidget> = {
  name:     'text',
  phone:    'tel',
  email:    'email',
  gender:   'radio',
  title:    'radio',
  city:     'select',
  district: 'select',
  note:     'textarea',
}

// ── Field normalize ───────────────────────────────────────────────────────────

interface RawField {
  name?:        unknown
  kind?:        unknown
  widget?:      unknown
  type?:        unknown   // legacy widget field name
  label?:       unknown
  required?:    unknown
  placeholder?: unknown
  options?:     unknown
}

function normalizeField(raw: unknown): ContactFormField | null {
  if (typeof raw !== 'object' || raw === null) return null
  const src = raw as RawField

  // Resolve name: new schema → legacy kind → drop
  let name: PhpFieldKey | null = null
  if (isPhpFieldKey(src.name)) {
    name = src.name
  } else {
    const kindStr = typeof src.kind === 'string' ? src.kind : null
    if (kindStr && LEGACY_KIND_TO_NAME[kindStr]) {
      name = LEGACY_KIND_TO_NAME[kindStr]
    }
  }
  if (!name) return null

  // Resolve widget: new schema → legacy kind → legacy type field → fallback text
  let widget: PhpFieldWidget = 'text'
  if (isPhpWidget(src.widget)) {
    widget = src.widget
  } else {
    const kindStr = typeof src.kind === 'string' ? src.kind : null
    if (kindStr && LEGACY_KIND_TO_WIDGET[kindStr]) {
      widget = LEGACY_KIND_TO_WIDGET[kindStr]
    } else if (isPhpWidget(src.type)) {
      widget = src.type
    }
  }

  return {
    name,
    widget,
    label:       asString(src.label, PHP_FIELD_KEY_LABELS[name]),
    required:    asBoolean(src.required, false),
    placeholder: asString(src.placeholder),
    options:     asStringArray(src.options),
  }
}

function defaultFields(): ContactFormField[] {
  return [
    { name: 'contact_name',  widget: 'text', label: '姓名', required: true,  placeholder: '請輸入您的姓名',    options: [] },
    { name: 'contact_phone', widget: 'tel',  label: '電話', required: true,  placeholder: '請輸入您的聯絡電話', options: [] },
  ]
}

function normalizeFields(raw: unknown): ContactFormField[] {
  if (!Array.isArray(raw)) return defaultFields()

  const seenNames = new Set<PhpFieldKey>()
  const fields: ContactFormField[] = []

  for (const item of raw) {
    const field = normalizeField(item)
    if (!field) continue
    if (seenNames.has(field.name)) continue   // dedup: keep first, drop duplicate name
    seenNames.add(field.name)
    fields.push(field)
  }

  return fields.length > 0 ? fields : defaultFields()
}

// ── Main export ───────────────────────────────────────────────────────────────

export function normalizeContactForm(
  raw: Record<string, unknown>,
  siteInfo: SiteSharedInfo = defaultSiteSharedInfo,
): ContactFormData {
  return {
    formActionId:     asString(raw.formActionId),
    recaptchaEnabled: asBoolean(raw.recaptchaEnabled, false),
    recaptchaSiteKey: asString(raw.recaptchaSiteKey),
    formAnchorId:     asString(raw.formAnchorId) || siteInfo.formAnchorId || 'contact',
    heading:          asString(raw.heading, '預約參觀'),
    buttonLabel:      asString(raw.buttonLabel, '送出預約'),
    privacyText:      asString(raw.privacyText, '我已閱讀並同意隱私政策'),
    fields:           normalizeFields(raw.fields),
  }
}
