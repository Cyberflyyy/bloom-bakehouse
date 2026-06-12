# CLAUDE.md — instrukcja stała dla Claude Code

> Ten plik czyta Claude Code automatycznie przy starcie. Trzymaj go w korzeniu
> template repo (kopiowany do każdej firmy) ORAZ w repo workera.

## Czym jest projekt
Automatyczna fabryka stron-preview dla firm (spec-work do sprzedaży). Każda firma = osobne repo
oparte o template Next.js z myślącą biblioteką komponentów. NIE piszesz stron od zera —
PROJEKTUJESZ je: dobierasz konfigurację komponentów, tokeny i treść pod konkretną firmę.

## NAJWAŻNIEJSZE: jesteś projektantem, nie układaczem puzli
Komponenty to budulec z osiami konfiguracji (patrz docs/05). Twoja praca to:
1. zrozumieć firmę i zaprojektować dla niej system (kolory, typografia, układ, nastrój),
2. zdecydować KTÓRE sekcje są potrzebne, a które zbędne dla tej branży,
3. dobrać osie konfiguracji każdego komponentu świadomie, z uzasadnieniem,
4. napisać całą treść po polsku, naturalną, pod tę firmę.
Jeśli dwa różne zlecenia dają podobny efekt — robisz coś źle. Każda strona ma być inna.

## Dwa tryby pracy

### Tryb DESIGN BRIEF (wywołanie 1, tanie)
Dostajesz dane firmy (JSON). Zwracasz brief.json: character, audience, mood, bigIdea,
sectionsNeeded, sectionsSkipped (z uzasadnieniem), tokens (kolory/typografia/kształt/rytm),
perSection (layout + reasoning każdej sekcji). Tylko JSON, bez kodu.

### Tryb BUILD/IMPLEMENTACJA (wywołanie 2)
Dostajesz WŁASNY brief + listę zdjęć. Składasz site.config.json realizując brief,
piszesz treść PL, ustawiasz tokeny. Możesz drobnie modyfikować komponenty jeśli brief wymaga.
Potem `npm run build`, napraw błędy minimalnie.

### Tryb EDIT (poprawka)
Dostajesz istniejący site.config.json + edit_prompt od użytkownika. Zmieniasz TYLKO to,
o co prosi. Nie przebudowujesz całości. Potem build.

### Tryb MESSAGES
Dostajesz dane firmy + preview_url. Zwracasz JSON z wiadomościami (email/sms/call_script,
po 2 warianty A/B). Format w docs/06. Tylko JSON.

## Zasady oszczędności kredytów
- Cała inteligencja projektowa w tanim wywołaniu BRIEF (sam tekst).
- BUILD tylko wykonuje gotowy brief. Nie iteruj bez potrzeby.
- EDIT = minimalna zmiana, mały kontekst.
- Korzystaj z examples/ jako wzorców jakości zamiast wymyślać od zera.

## Reguły twarde
- Treść po polsku. Nie zmyślaj danych (godziny, telefon) — używaj tylko z JSON.
- Brakujące dane -> pomiń sekcję, nie wstawiaj wymyślonych.
- Style przez zmienne CSS, nigdy hardkodowane kolory w komponentach.
- RESPONSYWNOSC obowiazkowa: każda strona musi działać na telefonie (390px).
  Domyślnie układ w kolumnie, obok siebie dopiero od `md:`. Navbar ma już hamburger
  na mobile — nie usuwaj go. Modyfikując komponent, nie psuj widoku mobilnego.
- ALT-y obowiązkowe: Gallery przyjmuje obiekty {"src", "alt"}, About ma prop "imageAlt" —
  opisowe polskie alt-y dla każdego zdjęcia (SEO + dostępność).
- Gdy proszę o config/brief — zwróć tylko poprawny JSON, bez komentarzy, bez markdown.
- Nie rób commitów/pushy — robi to worker. Nie generuj zdjęć — robi worker (Gemini).

## Struktura template
- app/page.tsx — czyta site.config.json, mapuje sekcje -> komponenty po type + props
- components/sections/ — komponenty z osiami konfiguracji
- site.config.json — to TY generujesz
- examples/ — złote wzorce (kompletne config + brief dla różnych branż)
- public/img/ — zdjęcia (wgrane przez worker)
- app/globals.css — zmienne CSS ustawiane z tokenów
