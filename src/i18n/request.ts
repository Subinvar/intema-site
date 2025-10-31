import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

const isSupportedLocale = (locale: unknown): locale is (typeof routing.locales)[number] =>
  typeof locale === 'string' && routing.locales.includes(locale as (typeof routing.locales)[number])

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = isSupportedLocale(requested) ? requested : routing.defaultLocale

  return { locale }
})