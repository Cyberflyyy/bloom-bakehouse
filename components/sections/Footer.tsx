type FooterProps = {
  layout?: "minimal" | "columns" | "centered";
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  instagram?: string;
  links?: string[];
};

// "@handle" z URL profilu: https://www.instagram.com/bloom.wroclaw/ -> @bloom.wroclaw
const igHandle = (url: string) => "@" + (url.replace(/\/+$/, "").split("/").pop() || "instagram");

const slugify = (s: string) =>
  "#" + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");

export default function Footer({ layout = "minimal", name, address, phone, hours, instagram, links = [] }: FooterProps) {
  const year = new Date().getFullYear();
  const base: React.CSSProperties = { background: "var(--color-primary)", color: "#ffffff" };

  if (layout === "columns") {
    return (
      <footer style={base}>
        <div className="container py-14 grid sm:grid-cols-3 gap-10">
          <div>
            <p className="font-[var(--font-display)] text-xl font-bold mb-2">{name}</p>
            {address && <p className="text-white/70 text-sm">{address}</p>}
          </div>
          <div>
            <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/60">Kontakt</p>
            <ul className="space-y-1.5 text-sm text-white/80">
              {phone && <li><a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">{phone}</a></li>}
              {hours && <li>{hours}</li>}
            </ul>
          </div>
          {links.length > 0 && (
            <div>
              <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/60">Nawigacja</p>
              <ul className="space-y-1.5 text-sm text-white/80">
                {links.map((l) => (
                  <li key={l}><a href={slugify(l)} className="hover:text-white">{l}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
          © {year} {name}. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    );
  }

  if (layout === "centered") {
    return (
      <footer style={base} className="text-center">
        <div className="container py-12">
          <p className="font-[var(--font-display)] text-xl font-bold mb-3">{name}</p>
          {links.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-white/80 mb-4">
              {links.map((l) => (
                <li key={l}><a href={slugify(l)} className="hover:text-white">{l}</a></li>
              ))}
            </ul>
          )}
          <p className="text-xs text-white/50">© {year} {name}. Wszelkie prawa zastrzeżone.</p>
        </div>
      </footer>
    );
  }

  // minimal
  return (
    <footer style={base}>
      <div className="container py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-white/75">
        <div>
          <p className="font-[var(--font-display)] font-bold text-white">{name}</p>
          {address && <p className="mt-1">{address}</p>}
        </div>
        <div className="text-left sm:text-right">
          <p className="space-x-3">
            {phone && <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">{phone}</a>}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {igHandle(instagram)}
              </a>
            )}
          </p>
          <p className="mt-1 text-white/50">© {year} Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
