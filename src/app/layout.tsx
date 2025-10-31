// src/app/layout.tsx
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();

  const pathname =
    headersList.get('next-url') ??
    headersList.get('x-invoke-path') ??
    headersList.get('x-matched-path') ??
    '';

  if (pathname.startsWith('/admin')) {
    return children;
  }

  const locale = await getLocale(); // берётся из i18n/request.ts

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}