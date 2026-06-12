type CTABannerProps = {
  layout?: "full-bar" | "boxed" | "split";
  style?: "solid-color" | "image-bg" | "bordered";
  headline: string;
  ctaText: string;
  ctaHref?: string;
  bgImage?: string;
};

export default function CTABanner({
  layout = "full-bar",
  style = "solid-color",
  headline,
  ctaText,
  ctaHref = "#kontakt",
  bgImage,
}: CTABannerProps) {
  const isImage = style === "image-bg" && bgImage;
  const isSolid = style === "solid-color";
  const textLight = isImage || isSolid;

  const surfaceStyle: React.CSSProperties = isImage
    ? { backgroundImage: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : isSolid
    ? { background: "linear-gradient(120deg, var(--color-primary), var(--color-accent))" }
    : { border: "1.5px solid var(--color-accent)" };

  const content = (
    <div className={`flex flex-wrap items-center justify-between gap-6 ${layout === "split" ? "" : "text-center sm:text-left"}`}>
      <h2 className={`text-2xl md:text-3xl font-bold max-w-xl ${layout === "boxed" || layout === "split" ? "" : "mx-auto sm:mx-0"}`} style={{ color: textLight ? "#fff" : "var(--color-text)" }}>
        {headline}
      </h2>
      <a
        href={ctaHref}
        className={`btn shrink-0 ${textLight ? "bg-white text-[var(--color-text)] hover:opacity-90" : "btn--solid"}`}
      >
        {ctaText}
      </a>
    </div>
  );

  if (layout === "boxed") {
    return (
      <section className="section--tight">
        <div className="container">
          <div className="rounded-[var(--radius)] p-8 md:p-12" style={surfaceStyle}>
            {content}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "split") {
    return (
      <section className="py-10" style={surfaceStyle}>
        <div className="container">{content}</div>
      </section>
    );
  }

  // full-bar
  return (
    <section className="py-10" style={surfaceStyle}>
      <div className="container">{content}</div>
    </section>
  );
}
