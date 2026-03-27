// ContactForm — PHP 契約表單
//
// Data flow:
//   module.data → normalizeContactForm() → ContactFormData → HTML form POST → PHP
//   action = https://form.utmost.com.tw/admins/contactemailgo.php?id={formActionId}
//   method = post
//   hidden: go_email = service
//   field name attributes must match PhpFieldKey whitelist
import { useEffect, useRef } from 'react'
import type { ModuleProps } from './index'
import { normalizeContactForm } from './ContactForm.normalize'
import { useSiteSharedInfo } from '../renderer/SiteSharedInfoContext'

interface GrecaptchaInstance {
  render: (container: HTMLElement, parameters: { sitekey: string }) => number
  ready: (callback: () => void) => void
  reset: (widgetId?: number) => void
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaInstance
  }
}

const BASE_FIELD_CLASS =
  'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export function ContactForm({ module }: ModuleProps) {
  const siteInfo = useSiteSharedInfo()
  const {
    heading, buttonLabel, formAnchorId, fields, privacyText,
    formActionId, recaptchaEnabled, recaptchaSiteKey,
  } = normalizeContactForm(module.data as Record<string, unknown>, siteInfo)

  const safeFormActionId = formActionId.trim()
  const safeRecaptchaSiteKey = recaptchaSiteKey.trim()

  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!recaptchaEnabled || !safeRecaptchaSiteKey) return

    let cancelled = false
    let intervalId: ReturnType<typeof setInterval> | null = null

    const tryRender = () => {
      if (cancelled || widgetIdRef.current !== null) {
        if (intervalId !== null) clearInterval(intervalId)
        return
      }
      const container = recaptchaContainerRef.current
      if (!container || container.hasChildNodes()) return

      if (typeof window.grecaptcha?.ready !== 'function') return

      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }

      window.grecaptcha.ready(() => {
        if (cancelled || widgetIdRef.current !== null) return
        const el = recaptchaContainerRef.current
        if (!el || el.hasChildNodes()) return
        widgetIdRef.current = window.grecaptcha!.render(el, { sitekey: safeRecaptchaSiteKey })
      })
    }

    tryRender()
    intervalId = setInterval(tryRender, 200)

    return () => {
      cancelled = true
      if (intervalId !== null) clearInterval(intervalId)
      widgetIdRef.current = null
    }
  }, [recaptchaEnabled, safeRecaptchaSiteKey])
  const phpAction = safeFormActionId
    ? `https://form.utmost.com.tw/admins/contactemailgo.php?id=${safeFormActionId}`
    : '#'

  if (fields.length === 0) return null

  return (
    <section id={formAnchorId} className="bg-gray-50 py-24 px-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{heading}</h2>

        <form action={phpAction} method="post" className="flex flex-col gap-5">
          {/* PHP 固定 hidden 欄位 */}
          <input type="hidden" name="go_email" value="service" />

          {!safeFormActionId && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              尚未設定表單代碼
            </p>
          )}

          {fields.map((field, index) => (
            <div key={`${field.name}-${index}`} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>

              {field.widget === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={`${BASE_FIELD_CLASS} min-h-28 resize-y`}
                />
              ) : field.widget === 'select' ? (
                <select name={field.name} required={field.required} className={BASE_FIELD_CLASS}>
                  <option value="">{field.placeholder || `請選擇${field.label}`}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.widget === 'radio' ? (
                <div className="flex flex-wrap gap-3">
                  {field.options.map((opt) => (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <input type="radio" name={field.name} value={opt} required={field.required} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : field.widget === 'checkbox' ? (
                <div className="flex flex-wrap gap-3">
                  {field.options.map((opt) => (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    >
                      <input type="checkbox" name={field.name} value={opt} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.widget}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  className={BASE_FIELD_CLASS}
                />
              )}
            </div>
          ))}

          <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              name="privacy"
              required
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{privacyText}</span>
          </label>

          {recaptchaEnabled && safeRecaptchaSiteKey && (
            /* reCAPTCHA script is loaded at the page level (index.html).
               Widget is rendered explicitly via grecaptcha.render() in useEffect
               to avoid auto-render timing mismatch with React dynamic mount. */
            <div ref={recaptchaContainerRef} />
          )}

          {recaptchaEnabled && !safeRecaptchaSiteKey && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              尚未設定 reCAPTCHA key
            </p>
          )}

          <button
            type="submit"
            disabled={!safeFormActionId}
            className="mt-2 w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
