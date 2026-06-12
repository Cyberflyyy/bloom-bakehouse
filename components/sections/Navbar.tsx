"use client";

import { useEffect, useState } from "react";

type NavbarProps = {
  layout?: "left-logo" | "centered" | "split" | "minimal";
  behavior?: "static" | "sticky" | "transparent-on-hero";
  cta?: "none" | "button" | "phone";
  name: string;
  links?: string[];
  phone?: string;
};

const slugify = (s: string) =>
  "#" + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");

export default function Navbar({
  layout = "left-logo",
  behavior = "sticky",
  cta = "none",
  name,
  links = [],
  phone,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const transparent = behavior === "transparent-on-hero" && !scrolled && !open;

  useEffect(() => {
    if (behavior !== "transparent-on-hero") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [behavior]);

  // Blokuj scroll tla, gdy menu mobilne otwarte
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const positionClass = behavior === "static" ? "relative" : "sticky top-0 z-50";
  const bgClass = transparent
    ? "bg-transparent"
    : "backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/85 bg-[var(--color-bg)] shadow-[0_1px_0_0_color-mix(in_srgb,var(--color-text)_8%,transparent)]";
  const textColor = transparent ? "#ffffff" : "var(--color-text)";

  const Logo = (
    <a href="#" onClick={() => setOpen(false)} className="font-[var(--font-display)] text-xl font-bold tracking-tight" style={{ color: textColor }}>
      {name}
    </a>
  );

  // Linki desktopowe — ukryte na mobile (tam jest hamburger)
  const Links = (
    <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
      {links.map((l) => (
        <li key={l}>
          <a href={slugify(l)} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: textColor }}>
            {l}
          </a>
        </li>
      ))}
    </ul>
  );

  const Cta =
    cta === "button" ? (
      <a href="#kontakt" className="btn btn--solid !py-2.5 !px-5 text-sm">
        Skontaktuj się
      </a>
    ) : cta === "phone" && phone ? (
      <a
        href={`tel:${phone.replace(/\s+/g, "")}`}
        className="btn btn--outline !py-2.5 !px-5 text-sm"
        style={!transparent ? undefined : { color: "#fff", borderColor: "#fff" }}
      >
        {phone}
      </a>
    ) : null;

  // CTA na desktopie chowamy na mobile (jest w panelu mobilnym)
  const CtaDesktop = Cta ? <span className="hidden md:inline-flex">{Cta}</span> : null;

  // Przycisk hamburger — tylko mobile
  const Burger = (links.length > 0 || cta !== "none") && (
    <button
      type="button"
      aria-label={open ? "Zamknij menu" : "Otwórz menu"}
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 -mr-2 gap-[5px]"
    >
      <span className="block w-6 h-[2px] rounded-full transition-transform duration-300" style={{ background: textColor, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
      <span className="block w-6 h-[2px] rounded-full transition-opacity duration-200" style={{ background: textColor, opacity: open ? 0 : 1 }} />
      <span className="block w-6 h-[2px] rounded-full transition-transform duration-300" style={{ background: textColor, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
    </button>
  );

  // Desktopowy uklad (4 warianty) — bez zmian wizualnych na >= md
  let inner;
  if (layout === "centered") {
    inner = (
      <div className="flex flex-col items-center md:gap-3 md:py-4">
        <div className="flex md:hidden w-full items-center justify-between py-3.5">{Logo}{Burger}</div>
        <div className="hidden md:flex flex-col items-center gap-3">
          {Logo}
          <div className="flex items-center gap-6">{Links}{CtaDesktop}</div>
        </div>
      </div>
    );
  } else if (layout === "split") {
    inner = (
      <>
        <div className="flex md:hidden items-center justify-between py-3.5">{Logo}{Burger}</div>
        <div className="hidden md:flex items-center justify-between py-4 relative">
          {Links}
          <div className="absolute left-1/2 -translate-x-1/2">{Logo}</div>
          <div>{CtaDesktop}</div>
        </div>
      </>
    );
  } else if (layout === "minimal") {
    inner = (
      <div className="flex items-center justify-between py-3.5 md:py-4">
        {Logo}
        {CtaDesktop}
        {Burger}
      </div>
    );
  } else {
    inner = (
      <div className="flex items-center justify-between py-3.5 md:py-4">
        {Logo}
        <div className="flex items-center gap-7">{Links}{CtaDesktop}{Burger}</div>
      </div>
    );
  }

  return (
    <header className={`${positionClass} ${bgClass} transition-colors duration-300`}>
      <nav className="container">{inner}</nav>

      {/* Panel mobilny — rozwijany pod paskiem nawigacji */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${open ? "max-h-[80vh]" : "max-h-0"}`}
        style={{ background: "var(--color-bg)" }}
      >
        <div className="container py-4 flex flex-col gap-1 border-t" style={{ borderColor: "color-mix(in srgb, var(--color-text) 10%, transparent)" }}>
          {links.map((l) => (
            <a
              key={l}
              href={slugify(l)}
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium border-b last:border-b-0"
              style={{ color: "var(--color-text)", borderColor: "color-mix(in srgb, var(--color-text) 7%, transparent)" }}
            >
              {l}
            </a>
          ))}
          {cta === "phone" && phone && (
            <a href={`tel:${phone.replace(/\s+/g, "")}`} onClick={() => setOpen(false)} className="btn btn--solid w-full mt-3">
              Zadzwoń: {phone}
            </a>
          )}
          {cta === "button" && (
            <a href="#kontakt" onClick={() => setOpen(false)} className="btn btn--solid w-full mt-3">
              Skontaktuj się
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
