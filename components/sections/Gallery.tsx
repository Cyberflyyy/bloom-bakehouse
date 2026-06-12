import siteConfig from "@/site.config.json";
import type { SiteConfig } from "@/lib/types";

type GalleryImage = string | { src: string; alt?: string };

type GalleryProps = {
  layout?: "grid" | "masonry" | "full-width-strip" | "two-large";
  aspect?: "square" | "landscape" | "mixed";
  heading?: string;
  images: GalleryImage[];
};

const aspectClass: Record<string, string> = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  mixed: "",
};

const fallbackAlt = `${(siteConfig as unknown as SiteConfig).meta?.title || "Nasza firma"} — zdjęcie`;

const norm = (img: GalleryImage) =>
  typeof img === "string" ? { src: img, alt: fallbackAlt } : { src: img.src, alt: img.alt || fallbackAlt };

export default function Gallery({ layout = "grid", aspect = "landscape", heading, images }: GalleryProps) {
  if (!images?.length) return null;

  const items = images.map(norm);

  const Img = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`w-full h-full object-cover rounded-[var(--radius)] ${className}`}
    />
  );

  return (
    <section id="galeria" className="section">
      <div className="container">
        {heading && (
          <div className="max-w-xl mb-10">
            <span className="eyebrow">Galeria</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">{heading}</h2>
          </div>
        )}

        {layout === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((img, i) => (
              <div key={i} className={aspectClass[aspect] || "aspect-[4/3]"}>
                <Img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        )}

        {layout === "masonry" && (
          <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
            {items.map((img, i) => (
              <Img key={i} src={img.src} alt={img.alt} className={i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"} />
            ))}
          </div>
        )}

        {layout === "full-width-strip" && (
          <div className="flex gap-4 overflow-x-auto snap-x pb-2 -mx-[clamp(1.25rem,4vw,2.5rem)] px-[clamp(1.25rem,4vw,2.5rem)]">
            {items.map((img, i) => (
              <div key={i} className="snap-start shrink-0 w-[78vw] sm:w-[42vw] lg:w-[32vw] aspect-[4/3]">
                <Img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        )}

        {layout === "two-large" && (
          <div className="grid md:grid-cols-2 gap-4">
            {items.slice(0, 2).map((img, i) => (
              <div key={i} className="aspect-[4/5]">
                <Img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
