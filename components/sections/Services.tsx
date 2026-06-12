type ServiceItem = { name: string; desc?: string; price?: string; icon?: string };

type ServicesProps = {
  layout?: "cards-grid" | "list-icons" | "alternating-rows" | "accordion" | "numbered";
  columns?: 2 | 3 | 4;
  withPricing?: boolean;
  withIcons?: boolean;
  heading: string;
  items: ServiceItem[];
};

const colsClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function Icon({ icon }: { icon?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius)] text-xl shrink-0"
      style={{ background: "color-mix(in srgb, var(--color-accent) 14%, transparent)", color: "var(--color-accent)" }}
    >
      {icon || "✦"}
    </span>
  );
}

function Price({ price }: { price?: string }) {
  if (!price) return null;
  return <span className="font-semibold whitespace-nowrap" style={{ color: "var(--color-accent)" }}>{price}</span>;
}

export default function Services({
  layout = "cards-grid",
  columns = 3,
  withPricing = false,
  withIcons = true,
  heading,
  items,
}: ServicesProps) {
  return (
    <section id="uslugi" className="section">
      <div className="container">
        <div className="max-w-xl mb-12">
          <span className="eyebrow">Oferta</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{heading}</h2>
        </div>

        {layout === "cards-grid" && (
          <div className={`grid grid-cols-1 ${colsClass[columns]} gap-6`}>
            {items.map((it) => (
              <div key={it.name} className="card p-6">
                {withIcons && <div className="mb-4"><Icon icon={it.icon} /></div>}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-semibold text-lg">{it.name}</h3>
                  {withPricing && <Price price={it.price} />}
                </div>
                {it.desc && <p className="muted text-sm leading-relaxed">{it.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {layout === "list-icons" && (
          <div className={`grid grid-cols-1 ${colsClass[columns]} gap-x-10 gap-y-8`}>
            {items.map((it) => (
              <div key={it.name} className="flex gap-4">
                {withIcons && <Icon icon={it.icon} />}
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-lg">{it.name}</h3>
                    {withPricing && <Price price={it.price} />}
                  </div>
                  {it.desc && <p className="muted text-sm mt-1 leading-relaxed">{it.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {layout === "alternating-rows" && (
          <div className="divide-y" style={{ borderColor: "color-mix(in srgb, var(--color-text) 10%, transparent)" }}>
            {items.map((it, i) => (
              <div key={it.name} className={`flex flex-wrap items-center justify-between gap-4 py-6 ${i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""}`}>
                <div className="flex items-center gap-4">
                  {withIcons && <Icon icon={it.icon} />}
                  <div>
                    <h3 className="font-semibold text-lg">{it.name}</h3>
                    {it.desc && <p className="muted text-sm mt-1">{it.desc}</p>}
                  </div>
                </div>
                {withPricing && <Price price={it.price} />}
              </div>
            ))}
          </div>
        )}

        {layout === "numbered" && (
          <div className={`grid grid-cols-1 ${colsClass[columns]} gap-8`}>
            {items.map((it, i) => (
              <div key={it.name}>
                <span className="block text-4xl font-bold font-[var(--font-display)] mb-3" style={{ color: "var(--color-accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="font-semibold text-lg">{it.name}</h3>
                  {withPricing && <Price price={it.price} />}
                </div>
                {it.desc && <p className="muted text-sm leading-relaxed">{it.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {layout === "accordion" && (
          <div className="max-w-3xl divide-y" style={{ borderColor: "color-mix(in srgb, var(--color-text) 10%, transparent)" }}>
            {items.map((it) => (
              <details key={it.name} className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-lg">
                  <span className="flex items-center gap-4">
                    {withIcons && <Icon icon={it.icon} />}
                    {it.name}
                  </span>
                  <span className="flex items-center gap-3">
                    {withPricing && <Price price={it.price} />}
                    <span className="transition-transform group-open:rotate-45 text-2xl muted">+</span>
                  </span>
                </summary>
                {it.desc && <p className="muted text-sm mt-3 leading-relaxed pl-0">{it.desc}</p>}
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
