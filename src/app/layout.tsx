// src/app/layout.tsx
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import { headers } from 'next/headers';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = headers();

  const getHeader = (() => {
    if (typeof headersList !== 'object' || !headersList) {
      return undefined;
    }

    const candidate = Reflect.get(headersList, 'get') as
      | ((name: string) => string | null)
      | undefined;

    return typeof candidate === 'function' ? candidate.bind(headersList) : undefined;
  })();

  const pathname =
    getHeader?.('next-url') ??
    getHeader?.('x-invoke-path') ??
    getHeader?.('x-matched-path') ??
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