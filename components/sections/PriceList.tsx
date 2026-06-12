type PriceItem = { name: string; price: string; desc?: string };
type PriceCategory = { category: string; items: PriceItem[] };

type PriceListProps = {
  layout?: "simple-rows" | "two-column" | "categories";
  withDesc?: boolean;
  heading: string;
  items?: PriceItem[];
  categories?: PriceCategory[];
  note?: string;
};

function Row({ item, withDesc }: { item: PriceItem; withDesc: boolean }) {
  return (
    <div className="py-4">
      <div className="flex items-baseline gap-3">
        {/* min-w-0 pozwala dlugiej nazwie sie zawinac zamiast rozpychac wiersz poza ekran */}
        <span className="font-semibold text-lg min-w-0">{item.name}</span>
        <span
          className="flex-1 border-b border-dotted translate-y-[-4px] min-w-[1rem]"
          style={{ borderColor: "color-mix(in srgb, var(--color-text) 25%, transparent)" }}
        />
        <span className="font-semibold whitespace-nowrap shrink-0" style={{ color: "var(--color-accent)" }}>
          {item.price}
        </span>
      </div>
      {withDesc && item.desc && <p className="muted text-sm mt-1">{item.desc}</p>}
    </div>
  );
}

export default function PriceList({
  layout = "simple-rows",
  withDesc = true,
  heading,
  items = [],
  categories = [],
  note,
}: PriceListProps) {
  if (!items.length && !categories.length) return null;

  return (
    <section id="cennik" className="section">
      <div className="container max-w-4xl">
        <div className="max-w-xl mb-12">
          <span className="eyebrow">Cennik</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">{heading}</h2>
        </div>

        {layout === "simple-rows" && (
          <div className="max-w-2xl divide-y" style={{ borderColor: "color-mix(in srgb, var(--color-text) 8%, transparent)" }}>
            {items.map((it) => <Row key={it.name} item={it} withDesc={withDesc} />)}
          </div>
        )}

        {layout === "two-column" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {items.map((it) => <Row key={it.name} item={it} withDesc={withDesc} />)}
          </div>
        )}

        {layout === "categories" && (
          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat.category}>
                <h3 className="font-semibold text-xl mb-3" style={{ color: "var(--color-accent)" }}>
                  {cat.category}
                </h3>
                <div className="divide-y" style={{ borderColor: "color-mix(in srgb, var(--color-text) 8%, transparent)" }}>
                  {cat.items.map((it) => <Row key={it.name} item={it} withDesc={withDesc} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {note && <p className="muted text-sm mt-8">{note}</p>}
      </div>
    </section>
  );
}
