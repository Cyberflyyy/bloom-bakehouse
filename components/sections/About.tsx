type Stat = { label: string; value: string };

type AboutProps = {
  layout?: "text-only" | "text-image-left" | "text-image-right" | "two-column" | "centered-narrow";
  imageStyle?: "none" | "rounded" | "circle" | "framed";
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
  stats?: Stat[];
};

const imgClass: Record<string, string> = {
  none: "",
  rounded: "rounded-[var(--radius)]",
  circle: "rounded-full aspect-square object-cover",
  framed: "rounded-[var(--radius)] ring-8 ring-[var(--color-bg)] shadow-soft",
};

function Stats({ stats }: { stats?: Stat[] }) {
  if (!stats?.length) return null;
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="text-3xl font-bold font-[var(--font-display)]" style={{ color: "var(--color-accent)" }}>
            {s.value}
          </dt>
          <dd className="muted text-sm mt-1">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function Image({ image, imageAlt, imageStyle }: { image?: string; imageAlt?: string; imageStyle: string }) {
  if (!image || imageStyle === "none") return null;
  return (
    <div className="relative">
      <img
        src={image}
        alt={imageAlt || "Zdjęcie firmy"}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover max-h-[480px] ${imgClass[imageStyle]}`}
      />
    </div>
  );
}

export default function About({
  layout = "text-image-right",
  imageStyle = "rounded",
  heading,
  body,
  image,
  imageAlt,
  stats,
}: AboutProps) {
  if (layout === "centered-narrow" || layout === "text-only") {
    return (
      <section id="o-nas" className="section">
        <div className="container max-w-2xl text-center">
          <span className="eyebrow">O nas</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-5">{heading}</h2>
          <p className="muted text-lg leading-relaxed">{body}</p>
          <div className="flex justify-center"><Stats stats={stats} /></div>
        </div>
      </section>
    );
  }

  if (layout === "two-column") {
    return (
      <section id="o-nas" className="section">
        <div className="container grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="eyebrow">O nas</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">{heading}</h2>
          </div>
          <div>
            <p className="muted text-lg leading-relaxed">{body}</p>
            <Stats stats={stats} />
          </div>
        </div>
      </section>
    );
  }

  const reversed = layout === "text-image-left";
  return (
    <section id="o-nas" className="section">
      <div className={`container grid md:grid-cols-2 gap-12 items-center ${reversed ? "" : ""}`}>
        <div className={reversed ? "md:order-2" : ""}>
          <span className="eyebrow">O nas</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-5">{heading}</h2>
          <p className="muted text-lg leading-relaxed">{body}</p>
          <Stats stats={stats} />
        </div>
        <div className={reversed ? "md:order-1" : ""}>
          <Image image={image} imageAlt={imageAlt} imageStyle={imageStyle} />
        </div>
      </div>
    </section>
  );
}
