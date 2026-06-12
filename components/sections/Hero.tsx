type HeroProps = {
  layout?: "left-text" | "right-text" | "centered" | "split" | "fullscreen-overlay" | "text-only";
  mediaType?: "photo" | "gradient" | "solid" | "none";
  height?: "compact" | "medium" | "tall" | "fullscreen";
  ctaStyle?: "solid" | "outline" | "double";
  accent?: "none" | "badge" | "line";
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  bgImage?: string;
  badge?: string;
};

// Na mobile nieco nizsze proporcje niz na desktopie.
const heightClass: Record<string, string> = {
  compact: "min-h-[60vh] md:min-h-[55vh]",
  medium: "min-h-[65vh] md:min-h-[70vh]",
  tall: "min-h-[80vh] md:min-h-[85vh]",
  fullscreen: "min-h-[90vh] md:min-h-screen",
};

// Pionowy padding dla heroow tekstowych — gwarantuje, ze tresc (badge, naglowek)
// ma oddech i nie przykleja sie do navbara / nie ucina u gory na mobile.
const heroPad = "py-20 md:py-24";

function Media({ mediaType, bgImage, dark }: { mediaType: string; bgImage?: string; dark?: boolean }) {
  if (mediaType === "photo" && bgImage) {
    return (
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        {dark && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/25" />}
      </div>
    );
  }
  if (mediaType === "gradient") {
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
        }}
      />
    );
  }
  if (mediaType === "solid") {
    return <div className="absolute inset-0 -z-10" style={{ background: "var(--color-primary)" }} />;
  }
  return null;
}

function Accent({ accent, badge }: { accent?: string; badge?: string }) {
  if (accent === "badge" && badge) {
    return <span className="card shadow-soft inline-block px-4 py-1.5 text-sm font-semibold mb-5 text-[var(--color-text)]">{badge}</span>;
  }
  if (accent === "line") {
    return <span className="block w-16 h-[3px] mb-5" style={{ background: "var(--color-accent)" }} />;
  }
  return null;
}

function Ctas({ ctaStyle, ctaText, ctaHref, light }: { ctaStyle?: string; ctaText?: string; ctaHref?: string; light?: boolean }) {
  if (!ctaText) return null;
  if (ctaStyle === "double") {
    return (
      <div className="flex flex-wrap gap-4">
        <a href={ctaHref || "#kontakt"} className="btn btn--solid">{ctaText}</a>
        <a href="#o-nas" className={`btn ${light ? "btn--outline !border-white !text-white hover:!bg-white hover:!text-[var(--color-text)]" : "btn--outline"}`}>
          Dowiedz się więcej
        </a>
      </div>
    );
  }
  if (ctaStyle === "outline") {
    return (
      <a href={ctaHref || "#kontakt"} className={`btn ${light ? "btn--outline !border-white !text-white hover:!bg-white hover:!text-[var(--color-text)]" : "btn--outline"}`}>
        {ctaText}
      </a>
    );
  }
  return (
    <a href={ctaHref || "#kontakt"} className="btn btn--solid">
      {ctaText}
    </a>
  );
}

export default function Hero({
  layout = "left-text",
  mediaType = "photo",
  height = "tall",
  ctaStyle = "solid",
  accent = "none",
  title,
  subtitle,
  ctaText,
  ctaHref,
  bgImage,
  badge,
}: HeroProps) {
  const hasMedia = mediaType !== "none";
  const light = hasMedia && (mediaType === "photo" || mediaType === "gradient" || mediaType === "solid");
  const textColor = light ? "#ffffff" : "var(--color-text)";

  if (layout === "text-only") {
    return (
      <section className={`relative flex items-center ${heightClass[height]} ${heroPad}`}>
        <div className="container max-w-3xl text-center mx-auto">
          <Accent accent={accent} badge={badge} />
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-5">{title}</h1>
          {subtitle && <p className="muted text-lg md:text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>}
          <div className="flex justify-center"><Ctas ctaStyle={ctaStyle} ctaText={ctaText} ctaHref={ctaHref} /></div>
        </div>
      </section>
    );
  }

  if (layout === "fullscreen-overlay" || layout === "centered") {
    return (
      <section className={`relative isolate flex items-center justify-center ${heightClass[height]} ${heroPad} text-center`} style={{ color: textColor }}>
        <Media mediaType={mediaType} bgImage={bgImage} dark={light} />
        <div className="container max-w-3xl">
          <Accent accent={accent} badge={badge} />
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-5">{title}</h1>
          {subtitle && (
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${light ? "text-white/85" : "muted"}`}>{subtitle}</p>
          )}
          <div className="flex justify-center"><Ctas ctaStyle={ctaStyle} ctaText={ctaText} ctaHref={ctaHref} light={light} /></div>
        </div>
      </section>
    );
  }

  if (layout === "split") {
    return (
      <section className={`relative grid md:grid-cols-2 ${heightClass[height]} items-stretch`}>
        <div className={`flex items-center order-2 md:order-1 ${heroPad} md:py-0`}>
          <div className="container md:pr-0">
            <Accent accent={accent} badge={badge} />
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-5">{title}</h1>
            {subtitle && <p className="muted text-lg mb-8 max-w-md">{subtitle}</p>}
            <Ctas ctaStyle={ctaStyle} ctaText={ctaText} ctaHref={ctaHref} />
          </div>
        </div>
        <div className="relative min-h-[40vh] order-1 md:order-2">
          {mediaType === "photo" && bgImage ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }} />
          )}
        </div>
      </section>
    );
  }

  // left-text / right-text (default)
  const reversed = layout === "right-text";
  return (
    <section className={`relative isolate flex items-center ${heightClass[height]} ${heroPad}`} style={{ color: textColor }}>
      <Media mediaType={mediaType} bgImage={bgImage} dark={light} />
      <div className="container">
        <div className={`max-w-xl ${reversed ? "ml-auto text-right" : ""}`}>
          <Accent accent={accent} badge={badge} />
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-5">{title}</h1>
          {subtitle && <p className={`text-lg md:text-xl mb-8 ${light ? "text-white/85" : "muted"}`}>{subtitle}</p>}
          <div className={reversed ? "flex justify-end" : ""}>
            <Ctas ctaStyle={ctaStyle} ctaText={ctaText} ctaHref={ctaHref} light={light} />
          </div>
        </div>
      </div>
    </section>
  );
}
