"use client";

import { useState } from "react";
import siteConfig from "@/site.config.json";
import type { SiteConfig } from "@/lib/types";

type ContactProps = {
  layout?: "info-and-map" | "info-and-form" | "centered-cta";
  mapStyle?: "none" | "embed";
  heading?: string;
  phone?: string;
  email?: string;
  address?: string;
  instagram?: string;
  mapsUrl?: string;
};

const config = siteConfig as unknown as SiteConfig;

// "@handle" z URL profilu: https://www.instagram.com/bloom.wroclaw/ -> @bloom.wroclaw
const igHandle = (url: string) => "@" + (url.replace(/\/+$/, "").split("/").pop() || "instagram");

function InfoList({ phone, email, address, instagram }: { phone?: string; email?: string; address?: string; instagram?: string }) {
  const rows = [
    phone && { label: "Telefon", value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    email && { label: "E-mail", value: email, href: `mailto:${email}` },
    instagram && { label: "Instagram", value: igHandle(instagram), href: instagram },
    address && { label: "Adres", value: address, href: undefined },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <dl className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <dt className="eyebrow">{r.label}</dt>
          <dd className="text-lg mt-1">
            {r.href ? (
              <a
                href={r.href}
                className="hover:opacity-70 transition-opacity"
                {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {r.value}
              </a>
            ) : (
              r.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Map({ mapStyle, mapsUrl }: { mapStyle?: string; mapsUrl?: string }) {
  if (mapStyle !== "embed" || !mapsUrl) return null;
  return (
    <div className="aspect-[4/3] rounded-[var(--radius)] overflow-hidden card">
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(mapsUrl)}&output=embed`}
        className="w-full h-full border-0"
        loading="lazy"
        title="Mapa"
      />
    </div>
  );
}

type FormState = "idle" | "sending" | "sent" | "error";

function ContactForm({ phone, email }: { phone?: string; email?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const inputClass = "w-full rounded-[var(--radius)] border px-4 py-2.5 bg-transparent";
  const inputStyle = { borderColor: "color-mix(in srgb, var(--color-text) 18%, transparent)" };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot: boty wypełniają ukryte pole — udajemy sukces bez wysyłki.
    if (fd.get("company")) {
      setState("sent");
      return;
    }

    const { leads, site } = config;
    if (!leads?.supabaseUrl || !leads?.anonKey) {
      // Stare strony / dev template bez bloku leads: fallback na mailto.
      if (email) {
        const body = encodeURIComponent(String(fd.get("message") || ""));
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("Wiadomość ze strony")}&body=${body}`;
      }
      return;
    }

    setState("sending");
    try {
      const res = await fetch(`${leads.supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          apikey: leads.anonKey,
          Authorization: `Bearer ${leads.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          site_slug: site?.slug || "nieznana-strona",
          name: String(fd.get("name") || "").slice(0, 200),
          email: String(fd.get("email") || "").slice(0, 200),
          phone: String(fd.get("phone") || "").slice(0, 50),
          message: String(fd.get("message") || "").slice(0, 2000),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[200px]">
        <span className="text-3xl">✓</span>
        <p className="text-lg font-semibold">Dziękujemy za wiadomość!</p>
        <p className="muted">Odezwiemy się wkrótce.</p>
      </div>
    );
  }

  return (
    <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
      <input name="name" className={inputClass} style={inputStyle} placeholder="Imię i nazwisko" autoComplete="name" />
      <input name="email" className={inputClass} style={inputStyle} placeholder="E-mail" type="email" autoComplete="email" />
      <input name="phone" className={inputClass} style={inputStyle} placeholder="Telefon (opcjonalnie)" type="tel" autoComplete="tel" />
      <textarea name="message" className={inputClass} style={inputStyle} placeholder="Wiadomość" rows={4} required />
      {/* Honeypot — niewidoczne dla ludzi, boty je wypełniają */}
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn--solid w-full" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Wysyłanie..." : "Wyślij wiadomość"}
      </button>
      {state === "error" && (
        <p className="text-sm" style={{ color: "#dc2626" }}>
          Nie udało się wysłać wiadomości.{" "}
          {phone && (
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="underline">Zadzwoń: {phone}</a>
          )}
          {!phone && email && (
            <a href={`mailto:${email}`} className="underline">Napisz: {email}</a>
          )}
        </p>
      )}
    </form>
  );
}

export default function Contact({
  layout = "info-and-map",
  mapStyle = "embed",
  heading = "Kontakt",
  phone,
  email,
  address,
  instagram,
  mapsUrl,
}: ContactProps) {
  if (layout === "centered-cta") {
    return (
      <section id="kontakt" className="section text-center">
        <div className="container max-w-xl">
          <span className="eyebrow">Kontakt</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">{heading}</h2>
          <div className="flex flex-col items-center gap-3">
            {phone && <a href={`tel:${phone.replace(/\s+/g, "")}`} className="btn btn--solid">Zadzwoń: {phone}</a>}
            {email && <a href={`mailto:${email}`} className="btn--text font-medium">{email}</a>}
            {address && <p className="muted">{address}</p>}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "info-and-form") {
    return (
      <section id="kontakt" className="section">
        <div className="container grid md:grid-cols-2 gap-12">
          <div>
            <span className="eyebrow">Kontakt</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">{heading}</h2>
            <InfoList phone={phone} email={email} address={address} instagram={instagram} />
          </div>
          <ContactForm phone={phone} email={email} />
        </div>
      </section>
    );
  }

  // info-and-map
  return (
    <section id="kontakt" className="section">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Kontakt</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">{heading}</h2>
          <InfoList phone={phone} email={email} address={address} instagram={instagram} />
        </div>
        <Map mapStyle={mapStyle} mapsUrl={mapsUrl || address} />
      </div>
    </section>
  );
}
