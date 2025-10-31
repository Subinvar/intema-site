import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

// Важно: не перехватываем /api, /_next, файлы со знаком точки и т.п.
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}