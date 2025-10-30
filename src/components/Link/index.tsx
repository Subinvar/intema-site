// src/components/Link/index.tsx
import * as React from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
// если не настроен alias "@", используйте относительный путь: "../../lib/utils"
import { cn } from "@/lib/utils";

/** Варианты оформления (поддерживаем и variant, и appearance) */
export const linkVariants = cva(
  "inline-flex items-center transition focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "text-brand hover:underline",
        link: "underline underline-offset-4",
        primary: "text-white bg-brand px-3 py-1.5 rounded-md hover:opacity-90",
        secondary: "text-brand border border-brand px-3 py-1.5 rounded-md hover:bg-brand/10",
        icon: "p-2 rounded",
        clear: "",
      },
      size: {
        sm: "text-sm",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

type StyleProps = VariantProps<typeof linkVariants>;

/** Минимальные типы под reference из CMS */
type PageLike = { slug?: string } | null | undefined;
type PostLike = { slug?: string } | null | undefined;

type Reference =
  | { relationTo: "pages"; value: string | PageLike }
  | { relationTo: "posts"; value: string | PostLike };

/** Это «CMS-ссылка», которую вы прокидываете как {...link} */
type CMSLinkAppearance =
  | "default"
  | "primary"
  | "secondary"
  | "link"
  | "outline"
  | null;

type CMSLinkData = {
  type?: "reference" | "custom" | null; // из CMS: "reference" или "custom"
  newTab?: boolean | null;
  reference?: Reference | null;
  url?: string | null;
  label?: string;
  appearance?: CMSLinkAppearance; // часто встречается в блоках
};

const appearanceVariantMap: Record<
  Exclude<CMSLinkAppearance, null | undefined>,
  StyleProps["variant"]
> = {
  default: "default",
  primary: "primary",
  secondary: "secondary",
  link: "link",
  outline: "secondary",
};

type AnchorBaseProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "href" | "className" | "target" | "rel" | "type"
>;

/** Итоговые пропсы компонента */
type Props = AnchorBaseProps &
  StyleProps &
  CMSLinkData & {
    href?: NextLinkProps["href"]; // можно задать напрямую, тогда CMS-поля игнорим
    className?: string;
    children?: React.ReactNode;
  };

const CMSLink = React.forwardRef<HTMLAnchorElement, Props>(function CMSLink(
  {
    // CMS-поля
    type: linkType,
    newTab,
    reference,
    url,
    label,
    appearance,

    // стили
    variant,
    size,
    className,

    // базовые html/next props
    href: hrefProp,
    children,
    ...rest
  },
  ref
) {
  // 1) строим href
  let href: NextLinkProps["href"] | string | undefined = hrefProp;

  if (!href) {
    if (linkType === "custom" && url) {
      href = url;
    } else if (linkType === "reference" && reference) {
      const rel = reference.relationTo;
      const val = reference.value;

      // когда value — строка (id) — слага может не быть, тогда fallback на корень
      const slug =
        typeof val === "string" ? undefined : val?.slug || undefined;

      if (rel === "pages") href = slug ? `/${slug}` : "/";
      if (rel === "posts") href = slug ? `/blog/${slug}` : "/blog";
    }
  }

  // 2) target/rel для newTab
  const target = newTab ? "_blank" : undefined;
  const relAttr = newTab ? "noopener noreferrer" : undefined;

  // 3) appearance поддерживаем как синоним variant
  const variantFromAppearance =
    appearance == null ? undefined : appearanceVariantMap[appearance];

  const effectiveVariant = (variant ?? variantFromAppearance) ?? "default";

  return (
    <NextLink
      href={href || "#"}
      ref={ref}
      target={target}
      rel={relAttr}
      className={cn(linkVariants({ variant: effectiveVariant, size }), className)}
      {...rest}
    >
      {children ?? label}
    </NextLink>
  );
});

export { CMSLink };
export type { CMSLinkData };