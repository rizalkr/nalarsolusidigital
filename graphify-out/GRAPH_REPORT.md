# Graph Report - nalarsolusidigital  (2026-10-31)

## Corpus Check
- 47 files · ~20,709 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 269 nodes · 496 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1984e15a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PRD — Website Profil Nalar Solusi Digital
- package.json
- 8. Spesifikasi Desain dan Copywriting
- ConsultationModal.tsx
- site.ts
- compilerOptions
- whatsapp.ts
- dependencies
- page.tsx
- layout.tsx
- eslint.config.mjs
- scripts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `siteConfig` - 26 edges
2. `PRD — Website Profil Nalar Solusi Digital` - 20 edges
3. `vitest` - 19 edges
4. `compilerOptions` - 16 edges
5. `lucide-react` - 13 edges
6. `next` - 13 edges
7. `@testing-library/react` - 12 edges
8. `HomePage()` - 11 edges
9. `buildWhatsAppUrl()` - 10 edges
10. `8. Spesifikasi Desain dan Copywriting` - 9 edges

## Surprising Connections (you probably didn't know these)
- `DemoDeckProps` --references--> `DemoItem`  [EXTRACTED]
  src/components/DemoDeck.tsx → src/config/site.ts
- `HomePage()` --calls--> `Approach()`  [EXTRACTED]
  src/app/page.tsx → src/components/Approach.tsx
- `HomePage()` --calls--> `ConsultationModal()`  [EXTRACTED]
  src/app/page.tsx → src/components/ConsultationModal.tsx
- `HomePage()` --calls--> `ContactCTA()`  [EXTRACTED]
  src/app/page.tsx → src/components/ContactCTA.tsx
- `HomePage()` --calls--> `Footer()`  [EXTRACTED]
  src/app/page.tsx → src/components/Footer.tsx

## Import Cycles
- None detected.

## Communities (13 total, 1 thin omitted)

### Community 0 - "PRD — Website Profil Nalar Solusi Digital"
Cohesion: 0.04
Nodes (46): 10. Kebutuhan Fungsional, 11. Kebutuhan Nonfungsional, 12. Konfigurasi Data, 13. Arsitektur dan Teknologi, 14. Pengujian, 15. Tahapan Implementasi, 16. Risiko dan Mitigasi, 17. Data yang Belum Tersedia (+38 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (35): devDependencies, autoprefixer@^10.4.20, eslint@^9.20.1, eslint-config-next@^15.2.0, jsdom@^26.0.0, postcss@^8.5.2, tailwindcss@^3.4.17, @testing-library/jest-dom@^6.6.3 (+27 more)

### Community 2 - "8. Spesifikasi Desain dan Copywriting"
Cohesion: 0.07
Nodes (30): 8.1 Navbar, 8.2 Hero, 8.3 Section Layanan, 8.4 Section Contoh Solusi, 8.5 Section Cara Kerja, 8.6 Section Pendekatan Nalar, 8.7 CTA Penutup, 8.8 Footer (+22 more)

### Community 3 - "ConsultationModal.tsx"
Cohesion: 0.15
Nodes (18): @testing-library/react@^16.2.0, lucide-react, @testing-library/react, getContrast(), getLuminance(), ConsultationButton(), ConsultationButtonProps, CONSULTATION_CATEGORIES (+10 more)

### Community 4 - "site.ts"
Cohesion: 0.14
Nodes (16): robots(), sitemap(), Approach(), principleIcons, HowItWorks(), stepIcons, LogoItem, NavItem (+8 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "whatsapp.ts"
Cohesion: 0.24
Nodes (10): nextConfig, next, Footer(), MobileNav(), MobileNavProps, Navbar(), buildWhatsAppUrl(), BuildWhatsAppUrlOptions (+2 more)

### Community 7 - "dependencies"
Cohesion: 0.16
Nodes (14): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, next@^15.2.0, react@^19.0.0, react-dom@^19.0.0, tailwind-merge@^3.0.2, clsx (+6 more)

### Community 8 - "page.tsx"
Cohesion: 0.25
Nodes (9): HomePage(), DemoCarousel(), DemoCarouselProps, DemoModal(), DemoModalProps, DemoShowcase(), serviceIcons, Services() (+1 more)

### Community 9 - "layout.tsx"
Cohesion: 0.24
Nodes (8): @vercel/analytics@^2.0.1, @vercel/speed-insights@^2.0.0, @vercel/analytics, @vercel/speed-insights, metadata, plusJakartaSans, RootLayout(), viewport

### Community 10 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 11 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PRD — Website Profil Nalar Solusi Digital` connect `PRD — Website Profil Nalar Solusi Digital` to `8. Spesifikasi Desain dan Copywriting`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `PRD — Website Profil Nalar Solusi Digital` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `package.json` to `ConsultationModal.tsx`, `site.ts`, `whatsapp.ts`, `page.tsx`, `layout.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Why does `8. Spesifikasi Desain dan Copywriting` connect `8. Spesifikasi Desain dan Copywriting` to `PRD — Website Profil Nalar Solusi Digital`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `8. Spesifikasi Desain dan Copywriting` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `ConsultationModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14532019704433496 - nodes in this community are weakly interconnected._