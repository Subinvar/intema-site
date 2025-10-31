import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Обёртки над Link/useRouter, учитывают текущую локаль
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)