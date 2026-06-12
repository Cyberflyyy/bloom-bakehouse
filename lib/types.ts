export type Theme = {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  muted: string;
  displayFont: string;
  bodyFont: string;
  radius: string;
  spacing: "tight" | "normal" | "loose" | string;
};

export type Section = {
  type: string;
  props: Record<string, any>;
};

export type Meta = {
  title: string;
  description: string;
  ogImage?: string;
};

// Blok wstrzykiwany przez workera po buildConfig — nie generuje go Claude.
export type SiteInfo = {
  slug: string;
  url: string;
};

// Dane do wysyłki formularza kontaktowego (tabela leads w Supabase, insert-only RLS).
export type LeadsConfig = {
  supabaseUrl: string;
  anonKey: string;
};

export type SiteConfig = {
  theme: Theme;
  meta?: Meta;
  site?: SiteInfo;
  leads?: LeadsConfig;
  sections: Section[];
};

// "--rhythm" not "--spacing": Tailwind v4 owns --spacing internally (calc(var(--spacing) * N)
// drives every inset/padding/gap utility), so reusing that name breaks all spacing site-wide.
export const themeToCssVars = (theme: Theme): React.CSSProperties =>
  ({
    "--color-primary": theme.primary,
    "--color-accent": theme.accent,
    "--color-bg": theme.bg,
    "--color-text": theme.text,
    "--color-muted": theme.muted,
    "--font-display": `"${theme.displayFont}", serif`,
    "--font-body": `"${theme.bodyFont}", sans-serif`,
    "--radius": theme.radius,
    "--rhythm": theme.spacing,
  }) as React.CSSProperties;
