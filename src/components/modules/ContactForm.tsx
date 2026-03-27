// ContactForm — PHP 契約表單
//
// Data flow:
//   module.data → normalizeContactForm() → ContactFormData → HTML form POST → PHP
//   action = https://form.utmost.com.tw/admins/contactemailgo.php?id={formActionId}
//   method = post
//   hidden: go_email = service
//   field name attributes must match PhpFieldKey whitelist
import type { ModuleProps } from './index'
import { normalizeContactForm } from './ContactForm.normalize'
import { useSiteSharedInfo } from '../renderer/SiteSharedInfoContext'

const BASE_FIELD_CLASS =
  'w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export function ContactForm({ module }: ModuleProps) {
  const siteInfo = useSiteSharedInfo()
  const {
    heading, buttonLabel, formAnchorId, fields,
    formActionId, recaptchaEnabled, recaptchaSiteKey,
  } = normalizeContactForm(module.data as Record<string, unknown>, siteInfo)

  const phpAction = formActionId
    ? `https://form.utmost.com.tw/admins/contactemailgo.php?id=${formActionId}`
    : ''

  return (
    <section id={formAnchorId} className="bg-gray-50 py-24 px-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{heading}</h2>

        <form action={phpAction} method="post" className="flex flex-col gap-5">
          {/* PHP 固定 hidden 欄位 */}
          <input type="hidden" name="go_email" value="service" />

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

          {recaptchaEnabled && recaptchaSiteKey && (
            <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all mt-2"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
