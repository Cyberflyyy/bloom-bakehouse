import type { SiteConfig } from "./types";

// Polskie nazwy dni (klucze sekcji Hours) -> schema.org dayOfWeek.
const DAY_MAP: Record<string, string> = {
  "Poniedziałek": "Monday",
  "Wtorek": "Tuesday",
  "Środa": "Wednesday",
  "Czwartek": "Thursday",
  "Piątek": "Friday",
  "Sobota": "Saturday",
  "Niedziela": "Sunday",
};

function parseHours(hours: Record<string, string>) {
  const specs: { "@type": string; dayOfWeek: string; opens: string; closes: string }[] = [];
  for (const [day, range] of Object.entries(hours)) {
    const dayEn = DAY_MAP[day];
    const m = typeof range === "string" ? range.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/) : null;
    if (!dayEn || !m) continue; // "Zamknięte" i nietypowe formaty pomijamy
    specs.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayEn,
      opens: `${m[1].padStart(2, "0")}:${m[2]}`,
      closes: `${m[3].padStart(2, "0")}:${m[4]}`,
    });
  }
  return specs;
}

// Buduje JSON-LD LocalBusiness z danych już obecnych w configu (sekcje contact/hours).
// Tolerancyjne: pola bez danych są pomijane, nigdy nie zmyślamy wartości.
export function buildLocalBusinessJsonLd(config: SiteConfig): Record<string, unknown> | null {
  const contact = config.sections.find((s) => s.type === "contact")?.props ?? {};
  const hours = config.sections.find((s) => s.type === "hours")?.props?.hours as
    | Record<string, string>
    | undefined;

  const name = config.meta?.title;
  if (!name) return null;

  const jsonld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
  };
  if (config.meta?.description) jsonld.description = config.meta.description;
  if (config.site?.url) jsonld.url = config.site.url;
  if (config.meta?.ogImage && config.site?.url) {
    jsonld.image = new URL(config.meta.ogImage, config.site.url).href;
  }
  if (contact.phone) jsonld.telephone = contact.phone;
  if (contact.email) jsonld.email = contact.email;
  if (contact.address) {
    jsonld.address = { "@type": "PostalAddress", streetAddress: contact.address };
  }
  if (hours) {
    const specs = parseHours(hours);
    if (specs.length) jsonld.openingHoursSpecification = specs;
  }
  return jsonld;
}
