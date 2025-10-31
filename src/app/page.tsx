import { redirect } from 'next/navigation'

export default function RootPage() {
  // редирект на дефолтную локаль
  redirect('/ru')
}