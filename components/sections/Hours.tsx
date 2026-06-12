"use client";

type HoursProps = {
  layout?: "table" | "day-list" | "inline-compact" | "card-with-status";
  hours: Record<string, string>;
  showStatus?: boolean;
  heading?: string;
};

const DAY_NAMES = [
  "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota",
];

function isOpenNow(hours: Record<string, string>): { open: boolean; today?: string } {
  const today = DAY_NAMES[new Date().getDay()];
  const range = hours[today];
  if (!range) return { open: false, today };
  const m = range.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return { open: false, today };
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const start = parseInt(m[1]) * 60 + parseInt(m[2]);
  const end = parseInt(m[3]) * 60 + parseInt(m[4]);
  return { open: minutesNow >= start && minutesNow < end, today };
}

function StatusBadge({ hours }: { hours: Record<string, string> }) {
  const { open } = isOpenNow(hours);
  return (
    <span
      className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full"
      style={{
        background: open ? "color-mix(in srgb, #16a34a 16%, transparent)" : "color-mix(in srgb, #dc2626 14%, transparent)",
        color: open ? "#16a34a" : "#dc2626",
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: open ? "#16a34a" : "#dc2626" }} />
      {open ? "Otwarte teraz" : "Zamknięte"}
    </span>
  );
}

export default function Hours({ layout = "table", hours, showStatus = false, heading }: HoursProps) {
  const days = Object.entries(hours);
  if (!days.length) return null;
  const { today } = isOpenNow(hours);

  return (
    <section id="godziny" className="section--tight">
      <div className="container max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow">Godziny otwarcia</span>
            {heading && <h2 className="text-3xl font-bold mt-2">{heading}</h2>}
          </div>
          {showStatus && <StatusBadge hours={hours} />}
        </div>

        {layout === "inline-compact" && (
          <p className="muted text-lg">
            {days.map(([d, r], i) => (
              <span key={d}>
                <strong style={{ color: "var(--color-text)" }}>{d}:</strong> {r}
                {i < days.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        )}

        {layout === "day-list" && (
          <ul className="space-y-2">
            {days.map(([d, r]) => (
              <li key={d} className={`flex justify-between text-base ${d === today ? "font-semibold" : "muted"}`}>
                <span>{d}</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        {(layout === "table" || layout === "card-with-status") && (
          <div className={layout === "card-with-status" ? "card p-6" : ""}>
            <table className="w-full text-base">
              <tbody>
                {days.map(([d, r]) => (
                  <tr
                    key={d}
                    className={d === today ? "font-semibold" : ""}
                    style={{ borderTop: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)" }}
                  >
                    <td className="py-2.5 pr-4">{d}</td>
                    <td className={`py-2.5 text-right ${d === today ? "" : "muted"}`}>{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
