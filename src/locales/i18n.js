import { I18nManager } from 'react-native'
import { I18n } from 'i18n-js'

// Import all locales
import en from './en.json'
import th from './th.json'

const i18n = new I18n({
  en,
  th,
})

// Fallback ไปภาษาอังกฤษถ้าหาคำแปลไม่เจอ
i18n.enableFallback = true

// ภาษา fallback
i18n.defaultLocale = 'en'

// ภาษาที่แอปใช้ตอนเริ่มต้น
i18n.locale = 'th'

const currentLocale = i18n.locale || i18n.defaultLocale

// Is it a RTL language?
export const isRTL =
  currentLocale.startsWith('he') || currentLocale.startsWith('ar')

// Allow RTL alignment in RTL languages
I18nManager.allowRTL(isRTL)

// Localizing momentjs
if (currentLocale.startsWith('th')) {
  require('moment/locale/th')
}

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return i18n.t(name, params)
}

export default i18n