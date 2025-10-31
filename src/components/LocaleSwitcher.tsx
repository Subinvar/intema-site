'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export default function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (next: (typeof routing.locales)[number]) => {
    // Перезапрашиваем текущую страницу в другой локали
    router.replace({ pathname }, { locale: next })
  }

  return (
    <div className="flex gap-2 text-sm">
      <button onClick={() => switchTo('ru')}>RU</button>
      <span>·</span>
      <button onClick={() => switchTo('en')}>EN</button>
    </div>
  )
}