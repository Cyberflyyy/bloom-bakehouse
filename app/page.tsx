import { sectionRegistry } from "@/components/sections";
import { themeToCssVars, type SiteConfig } from "@/lib/types";
import siteConfig from "@/site.config.json";

export default function Home() {
  const config = siteConfig as unknown as SiteConfig;
  const { theme, sections } = config;

  return (
    <div
      style={{ ...themeToCssVars(theme), background: "var(--color-bg)", color: "var(--color-text)" }}
      className="flex flex-col min-h-screen"
    >
      {sections.map((section, i) => {
        const Component = sectionRegistry[section.type];
        if (!Component) return null;
        return <Component key={`${section.type}-${i}`} {...section.props} />;
      })}
    </div>
  );
}
