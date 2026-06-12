"use client";

import { useState } from "react";

type Review = { text: string; author: string; rating?: number };

type ReviewsProps = {
  layout?: "carousel" | "cards-grid" | "single-featured" | "quote-wall";
  withRating?: boolean;
  withGoogleBadge?: boolean;
  heading?: string;
  reviews: Review[];
};

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex gap-0.5 text-sm" style={{ color: "var(--color-accent)" }} aria-label={`Ocena ${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium muted">
      <span className="font-semibold" style={{ color: "var(--color-text)" }}>G</span> Opinie Google
    </span>
  );
}

function Card({ r, withRating, withGoogleBadge }: { r: Review; withRating?: boolean; withGoogleBadge?: boolean }) {
  return (
    <div className="card p-6 flex flex-col gap-4 h-full">
      {withRating && <Stars rating={r.rating} />}
      <p className="leading-relaxed">&bdquo;{r.text}&rdquo;</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="font-semibold text-sm">{r.author}</span>
        {withGoogleBadge && <GoogleBadge />}
      </div>
    </div>
  );
}

export default function Reviews({
  layout = "cards-grid",
  withRating = true,
  withGoogleBadge = false,
  heading,
  reviews,
}: ReviewsProps) {
  const [active, setActive] = useState(0);
  if (!reviews?.length) return null;

  return (
    <section id="opinie" className="section">
      <div className="container">
        {heading && (
          <div className="max-w-xl mb-10">
            <span className="eyebrow">Opinie</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">{heading}</h2>
          </div>
        )}

        {layout === "cards-grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <Card key={i} r={r} withRating={withRating} withGoogleBadge={withGoogleBadge} />
            ))}
          </div>
        )}

        {layout === "quote-wall" && (
          <div className="columns-1 md:columns-2 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {reviews.map((r, i) => (
              <Card key={i} r={r} withRating={withRating} withGoogleBadge={withGoogleBadge} />
            ))}
          </div>
        )}

        {layout === "single-featured" && (
          <div className="max-w-2xl mx-auto text-center">
            {withRating && <div className="flex justify-center mb-4"><Stars rating={reviews[active].rating} /></div>}
            <p className="text-xl md:text-2xl leading-relaxed font-[var(--font-display)]">
              &bdquo;{reviews[active].text}&rdquo;
            </p>
            <p className="font-semibold mt-5">{reviews[active].author}</p>
            {reviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Opinia ${i + 1}`}
                    className="w-2.5 h-2.5 rounded-full transition-opacity"
                    style={{ background: "var(--color-accent)", opacity: i === active ? 1 : 0.3 }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {layout === "carousel" && (
          <div className="flex gap-6 overflow-x-auto snap-x pb-2 -mx-[clamp(1.25rem,4vw,2.5rem)] px-[clamp(1.25rem,4vw,2.5rem)]">
            {reviews.map((r, i) => (
              <div key={i} className="snap-start shrink-0 w-[85vw] sm:w-[420px]">
                <Card r={r} withRating={withRating} withGoogleBadge={withGoogleBadge} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
