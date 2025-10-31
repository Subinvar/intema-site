// src/app/layout.tsx
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale(); // берётся из i18n/request.ts
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}