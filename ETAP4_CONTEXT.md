# Etap 4 — Biblioteka komponentów: STATUS = UKOŃCZONY ✅

Ten plik to "zrzut stanu" do przekazania między rozmowami z Claude Code. Po jego przeczytaniu
możesz bezpiecznie zrobić `/clear` i zacząć nową rozmowę od **Etapu 5 (Worker)**.

## Co zostało zrobione

1. **Bezpieczeństwo kluczy API** (problem znaleziony na starcie tej sesji):
   - `api.txt` z 7 żywymi sekretami leżał luzem na pulpicie — **usunięty**
   - Klucze przeniesione do:
     - `auto-web/worker/.env` (SUPABASE_URL, SUPABASE_SERVICE_KEY, GITHUB_TOKEN, GITHUB_USER,
       VERCEL_TOKEN, GEMINI_API_KEY, OUTPUT_DIR, TEMPLATE_DIR, PAUSE_BEFORE_PUBLISH=true)
     - `auto-web/panel/.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Dodane `.gitignore` w obu folderach (`.env`/`.env.local`, `node_modules/`, `.next/`)
   - ⚠️ **Rozważ rotację `GITHUB_TOKEN` i `VERCEL_TOKEN`** — były zapisane jawnie w pliku
     tekstowym przez jakiś czas (zalecenie z planu, nie wykonane — decyzja użytkownika)

2. **Template Next.js zbudowany od zera** (wcześniej folder `template/` był całkowicie pusty,
   mimo że użytkownik sądził, że Etap 4 jest zrobiony):
   - Scaffolding: `create-next-app` (TypeScript, Tailwind CSS v4, App Router, ESLint, npm)
   - `CLAUDE.md` skopiowany do korzenia (instrukcje projektowe dla Claude Code)
   - `app/globals.css` — pełny system tokenów CSS (kolory, fonty z Google Fonts, radius,
     rytm) + klasy narzędziowe (`.section`, `.btn`, `.card`, `.eyebrow`, `.muted`, itd.)
   - `lib/types.ts` — typy `Theme`/`Section`/`SiteConfig` + `themeToCssVars()`
   - **10 komponentów sekcji** w `components/sections/`: Navbar, Hero, About, Services,
     Gallery, Hours, Reviews, Contact, CTABanner, Footer — każdy z wieloma wariantami
     layoutu zgodnie ze specyfikacją z `START.md`/`05_BIBLIOTEKA_KOMPONENTOW.md`
   - `components/sections/index.tsx` — `sectionRegistry` (mapowanie type → komponent)
   - `app/page.tsx` — czyta `site.config.json`, wstrzykuje zmienne CSS motywu, renderuje
     sekcje z rejestru
   - `site.config.json` — przykładowa konfiguracja "Kawiarnia Cynamon" (motyw kawiarniany:
     brąz/beż, Playfair Display + Inter) — **to jest domyślny config repo**
   - `public/img/*.svg` — 5 placeholder SVG (hero, about, gallery-1/2/3)
   - Usunięte domyślne artefakty scaffoldingu (`public/file.svg`, `globe.svg`, `next.svg`,
     `vercel.svg`, `window.svg`, `AGENTS.md`)

3. **Folder `examples/`** — 5 kompletnych par `site.config.json` + `brief.json` (wzorce
   jakości) dla różnych branż:
   - `kawiarnia/` — kawiarnia (ciepły, kameralny klimat)
   - `kancelaria-prawna/` — kancelaria prawna
   - `salon-fryzjerski/` — salon fryzjerski
   - `warsztat-samochodowy/` — warsztat samochodowy (ciemny motyw, surowy charakter)
   - `klinika-medyczna/` — klinika medyczna (zieleń, spokój, zaufanie)
   - Każdy `brief.json` zawiera pełne uzasadnienie projektowe: character, audience, mood,
     bigIdea, sectionsNeeded/sectionsSkipped (z powodami), tokens, perSection (reasoning)

4. **Weryfikacja**: wszystkie 5 configów z `examples/` przechodzi `npm run build` bez
   błędów. Strona kawiarni renderuje się poprawnie wizualnie (sprawdzone przez Playwright
   screenshot + inspekcję computed styles).

## Napotkane i naprawione błędy (WAŻNE — nieoczywiste pułapki)

1. **Kolejność `@import` w CSS**: Google Fonts `@import` musi być PRZED `@import "tailwindcss"`,
   inaczej PostCSS rzuca ostrzeżeniem "@import rules must precede all rules".

2. **Hero — niewidoczny tekst (bug stacking context)**: Tła/nakładki Hero z `-z-10`
   renderowały się ZA tłem strony zamiast za tekstem sekcji, bo rodzic nie tworzył nowego
   stacking context. **Fix**: dodanie klasy `isolate` do `<section>` (warianty
   `fullscreen-overlay`/`centered` i `left-text`/`right-text`).

3. **🔴 KRYTYCZNY: kolizja zmiennej `--spacing` z Tailwind v4**: Token motywu nazwany
   `--spacing` nadpisał WEWNĘTRZNĄ zmienną Tailwind v4 (`--spacing`, domyślnie `0.25rem`),
   której framework używa do KAŻDEGO utility z odstępami: `calc(var(--spacing) * N)` dla
   `inset-*`, `p-*`, `m-*`, `gap-*` itd. Efekt: `inset-0` liczyło się jako
   `calc(normal * 0)` → przeglądarka fallbackowała na `auto` → tło Hero zapadało się do 0×0.
   **Fix**: zmiana nazwy zmiennej CSS z `--spacing` na `--rhythm` w `globals.css` i
   `lib/types.ts` (klucz JSON w `site.config.json` zostaje `spacing` — to format wejściowy
   ze specyfikacji, zmienia się tylko docelowa nazwa zmiennej CSS).
   ⚠️ **Jeśli kiedyś dodajesz nowy token motywu, NIGDY nie nadawaj mu nazwy zmiennej CSS,
   która koliduje z wewnętrznymi zmiennymi Tailwind v4** (`--spacing`, `--radius` w
   niektórych konfiguracjach, etc.) — sprawdź dokumentację Tailwind v4 przed dodaniem.

4. **"Event handlers cannot be passed to Client Component props"**: `Contact.tsx` (Server
   Component) miał `<form onSubmit={...}>`. **Fix**: dodanie `"use client";` na górze pliku.

5. **Ciemny motyw — "łatany" wygląd (bug tła)**: Przy `warsztat-samochodowy` (tło
   `#15171C`) ogólne tło strony zostawało białe, a tylko pojedyncze elementy (karty, stopka)
   były ciemne — bo zmienne CSS motywu były ustawiane inline na `<div>` zagnieżdżonym w
   `<body>`, a `body { background: var(--color-bg) }` w globals.css brało wartość domyślną
   z `:root` (jasny motyw), nie z nadpisania na konkretnej stronie. **Fix**: dodanie
   `background: "var(--color-bg)", color: "var(--color-text)"` bezpośrednio do inline
   `style` na wrapper-divie w `app/page.tsx`. Zweryfikowane screenshotem — działa poprawnie.

## Co dalej (NIE rozpoczęte w tej sesji — celowo)

Zgodnie z instrukcją użytkownika, praca na tym etapie się kończy. Następne etapy do zrobienia
w NOWEJ rozmowie:

- **Etap 5 — Worker** (`auto-web/worker/`): inicjalizacja npm, instalacja zależności
  (`@supabase/supabase-js`, `playwright`, `@google/genai`, `dotenv`), `.env` już gotowy
  (przeniesiony z api.txt), skopiowanie plików kontekstowych (`CLAUDE.md`, `04_WORKER.md`,
  `05_BIBLIOTEKA_KOMPONENTOW.md`, `06_WIADOMOSCI.md`, `PROMPTY_RUNTIME.md`), zbudowanie
  `worker.js` przez Claude Code wg promptu z sekcji 5.5 `START.md`, test
  `node worker.js --test "Nazwa firmy" "link_maps"`.
- **Etap 6 — Panel** (`auto-web/panel/`): formularz `/`, lista zleceń `/jobs` z Realtime,
  szczegóły `/jobs/[id]`. `.env.local` już gotowy. Publikacja na Vercel.
- **Etap 7 — Test end-to-end**: pełny przebieg worker + panel na żywej firmie.

Pełny plan z checklistami: `C:\Users\bkarp\.claude\plans\wrzuci-em-tutaj-klucze-api-noble-puddle.md`

## Stan środowiska na koniec sesji

- `site.config.json` przywrócony do configu "Kawiarnia Cynamon" (domyślny dla repo)
- Folder `.next` wyczyszczony (cache był nieaktualny po zmianach CSS)
- Serwer deweloperski (`npm run dev`) zatrzymany
