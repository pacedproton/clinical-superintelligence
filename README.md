# Clinical Superintelligence: website

Source for **clinical-superintelligence.com**, the public site of a research initiative in
Computational Clinical Reasoning.

## Run it

Requires Node 18+ (tested with Node 22).

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # typecheck, build, prerender, copy check -> dist/
npm run preview    # serve the production build at http://localhost:4173
```

`dist/` is a fully static site (two prerendered HTML pages plus hashed assets). Deploy it to
any static host or CDN. The pages work without JavaScript; JavaScript adds the interactive
timeline, the sensitivity figure and the mobile menu.

## Stack

- **React 18 + TypeScript**, bundled by **Vite** as a multi-page build:
  - `/` is `index.html` -> `src/entry-home.tsx`
  - `/case-study/` is `case-study/index.html` -> `src/entry-case.tsx`
- **Prerendering:** `src/entry-server.tsx` is built for SSR and `scripts/prerender.mjs` injects
  the rendered markup into each page, which then hydrates on the client.
- **Fonts:** Newsreader (editorial serif), IBM Plex Sans and IBM Plex Mono, self-hosted via
  Fontsource. No third-party requests, no analytics, no trackers, no cookies.
- **Figures:** hand-written SVG components. No chart or UI libraries.

## Layout

```
src/
  content/       site.ts (all homepage copy), case.ts (case data, phases, claims)
  components/    Header, Footer, HeroFigure, CapabilityGlyph, CaseTimeline,
                 ClaimsTable, SensitivityFigure, EvidenceGlyph
  pages/         Home.tsx, CaseStudy.tsx
  styles/        base.css (tokens, type, primitives), components.css
  lib/           rich.tsx (inline subscript/emphasis markup), hooks.ts
public/          favicon, og.png (social card), robots.txt, sitemap.xml
scripts/         prerender.mjs, check-copy.mjs
```

Copy lives in `src/content/` as typed data, separate from presentation. Content strings use a
tiny markup: `O_2` renders a subscript, `*text*` renders emphasis.

## Editorial guardrails

- `npm run check:copy` (run automatically by `build`) fails if any em or en dash appears.
- Case-study figures from the source analysis are always labelled as unvalidated claims;
  narrative details are labelled *reported*. Keep this distinction when editing `case.ts`.
- There is no patient input form, calculator, analytics, or contact form by design.

## Future backend

The planned backend is Rust. The content modules in `src/content/` are shaped so they can
later be served as JSON from a Rust API (for example Axum) without changing components:
replace the imports with a fetch at build time or at runtime. The static build needs no
server until then.
