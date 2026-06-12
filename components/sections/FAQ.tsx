type FAQItem = { q: string; a: string };

type FAQProps = {
  layout?: "accordion" | "two-column";
  withContact?: boolean;
  heading: string;
  items: FAQItem[];
  phone?: string;
};

export default function FAQ({
  layout = "accordion",
  withContact = false,
  heading,
  items,
  phone,
}: FAQProps) {
  if (!items?.length) return null;

  return (
    <section id="faq" className="section">
      <div className="container max-w-4xl">
        <div className="max-w-xl mb-12">
          <span className="eyebrow">Częste pytania</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{heading}</h2>
        </div>

        {layout === "accordion" && (
          <div className="divide-y" style={{ borderColor: "color-mix(in srgb, var(--color-text) 10%, transparent)" }}>
            {items.map((it) => (
              <details key={it.q} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-lg">
                  {it.q}
                  <span className="transition-transform group-open:rotate-45 text-2xl muted shrink-0">+</span>
                </summary>
                <p className="muted text-sm mt-3 leading-relaxed">{it.a}</p>
              </details>
            ))}
          </div>
        )}

        {layout === "two-column" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {items.map((it) => (
              <div key={it.q}>
                <h3 className="font-semibold text-lg mb-2">{it.q}</h3>
                <p className="muted text-sm leading-relaxed">{it.a}</p>
              </div>
            ))}
          </div>
        )}

        {withContact && phone && (
          <p className="muted text-sm mt-10">
            Nie znalazłeś odpowiedzi?{" "}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold underline underline-offset-4" style={{ color: "var(--color-accent)" }}>
              Zadzwoń: {phone}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
