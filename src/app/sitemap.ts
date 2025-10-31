import type { MetadataRoute } from 'next';

/**
 * Базовый адрес сайта:
 * - в проде используем NEXT_PUBLIC_SITE_URL (например, https://intema.ru)
 * - локально fallback на http://localhost:3000
 */
const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Поддерживаемые локали и базовые (статические) пути.
 * При необходимости дополни список путей (например, /products, /docs, /news).
 */
const locales = ['ru', 'en'] as const;
type Locale = (typeof locales)[number];

const localizedUrl = (locale: Locale, path: string) => `${site}/${locale}${path}`;
const staticPaths: string[] = [
  '', // корень локали -> /ru, /en
  '/about',
  '/catalog',
  '/contacts',
];

/**
 * Хелпер для alternates.languages (hreflang)
 */
function alternatesFor(path: string) {
  return Object.fromEntries(
    locales.map((locale) => [locale, localizedUrl(locale, path)]),
  ) as Record<Locale, string>;
}

/**
 * Заготовка для динамических путей (например, страницы/товары из Payload).
 * Сейчас возвращает пусто (безопасно). Позже можно наполнить.
 * Пример интеграции см. ниже в комментарии.
 */
async function getDynamicPaths(): Promise<string[]> {
  // TODO: подключить реальные данные из Payload, например:
  //
  // import payload from 'payload'
  // const { docs } = await payload.find({
  //   collection: 'pages',
  //   depth: 0,
  //   limit: 1000,
  //   where: { _status: { equals: 'published' } }
  // })
  // return docs.map(p => p.slug ? `/${p.slug}` : '').filter(Boolean);
  //
  // Важно: при использовании payload в рънтайме убедись, что есть инициализация
  // Payload в среде Next (либо вынеси в отдельный endpoint).
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1) Статические локализованные URL
  const localizedStatic = staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: now,
      alternates: { languages: alternatesFor(path) },
    })),
  );

  // 2) Динамические локализованные URL (если появятся)
  let localizedDynamic: MetadataRoute.Sitemap = [];
  try {
    const dynamicPaths = await getDynamicPaths();
    localizedDynamic = dynamicPaths.flatMap((path) =>
      locales.map((locale) => ({
        url: localizedUrl(locale, path),
        lastModified: now,
        alternates: { languages: alternatesFor(path) },
      })),
    );
  } catch {
    // Молча игнорируем ошибки БД/инициализации — sitemap всё равно сгенерируется.
  }

  // 3) Корень (/) — у нас редирект на /ru, но можно оставить запись с alternates
  const rootEntry: MetadataRoute.Sitemap = [
    {
      url: `${site}/`,
      lastModified: now,
      alternates: { languages: alternatesFor('') },
    },
  ];

  return [...rootEntry, ...localizedStatic, ...localizedDynamic];
}