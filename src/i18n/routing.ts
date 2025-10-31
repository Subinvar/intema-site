import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Все поддерживаемые локали
  locales: ['ru', 'en'],
  // Дефолтная локаль
  defaultLocale: 'ru',
})

// (опционально) пригодится дальше:
// export type AppLocale = (typeof routing.locales)[number]