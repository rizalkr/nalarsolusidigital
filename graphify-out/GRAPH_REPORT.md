# Graph Report - nalarsolusidigital  (2026-11-03)

## Corpus Check
- 93 files · ~46,007 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 500 nodes · 1075 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `302d0991`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PRD — Website Profil Nalar Solusi Digital
- package.json
- 8. Spesifikasi Desain dan Copywriting
- site.ts
- 2. API Endpoints
- compilerOptions
- repository.ts
- dependencies
- lucide-react
- react
- eslint.config.mjs
- csv-mapper.ts
- postcss.config.mjs
- Draf Copy — Penambahan Informasi Web Nalar Solusi Digital
- next
- 2. API Endpoints
- app/layout.tsx
- scripts
- vite-tsconfig-paths
- tailwindcss
- @testing-library/jest-dom

## God Nodes (most connected - your core abstractions)
1. `next` - 34 edges
2. `siteConfig` - 28 edges
3. `vitest` - 26 edges
4. `lucide-react` - 23 edges
5. `react` - 23 edges
6. `LeadStatus` - 20 edges
7. `PRD — Website Profil Nalar Solusi Digital` - 20 edges
8. `VerificationStatus` - 18 edges
9. `validateInternalApiKey()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- ``LeadStatus`` --references--> `LeadStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts
- ``VerificationStatus`` --references--> `VerificationStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts
- `Quick Summary of Endpoints` --references--> `PATCH()`  [INFERRED]
  docs/API_REFERENCE.md → src/app/api/internal/leads/[id]/route.ts
- `2.6. Patch Lead Fields & Status` --references--> `PATCH()`  [INFERRED]
  docs/internal-api.md → src/app/api/internal/leads/[id]/route.ts
- `1. Authentication & Security` --references--> `canTransition()`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/rules.ts

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "PRD — Website Profil Nalar Solusi Digital"
Cohesion: 0.04
Nodes (46): 10. Kebutuhan Fungsional, 11. Kebutuhan Nonfungsional, 12. Konfigurasi Data, 13. Arsitektur dan Teknologi, 14. Pengujian, 15. Tahapan Implementasi, 16. Risiko dan Mitigasi, 17. Data yang Belum Tersedia (+38 more)

### Community 1 - "package.json"
Cohesion: 0.09
Nodes (32): devDependencies, autoprefixer@^10.4.20, eslint@^9.20.1, eslint-config-next@^15.2.0, jsdom@^26.0.0, postcss@^8.5.2, server-only@^0.0.1, @testing-library/dom@^10.4.2 (+24 more)

### Community 2 - "8. Spesifikasi Desain dan Copywriting"
Cohesion: 0.07
Nodes (30): 8.1 Navbar, 8.2 Hero, 8.3 Section Layanan, 8.4 Section Contoh Solusi, 8.5 Section Cara Kerja, 8.6 Section Pendekatan Nalar, 8.7 CTA Penutup, 8.8 Footer (+22 more)

### Community 3 - "site.ts"
Cohesion: 0.07
Nodes (52): @testing-library/react, vitest, HomePage(), getContrast(), getLuminance(), robots(), sitemap(), CaraKerja() (+44 more)

### Community 4 - "2. API Endpoints"
Cohesion: 0.08
Nodes (22): 3. Summary of Status Enums, Admin Nalar — Internal API Documentation for Tepa Agent, `LeadStatus`, `VerificationStatus`, 1. Get Due Follow-ups, 1. Manual Setup Checklist for Rizal, 2. Get Queue Summary, 3. Search and List Leads (+14 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "repository.ts"
Cohesion: 0.09
Nodes (47): AntreanPage(), dynamic, updateLeadStatusAction(), { mockLeadWithWa }, dynamic, LeadsPage(), LeadsPageProps, AdminDashboardPage() (+39 more)

### Community 7 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, next@^15.2.0, papaparse@^5.7.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.12.7 (+7 more)

### Community 8 - "lucide-react"
Cohesion: 0.16
Nodes (16): lucide-react, react, AdminLayout(), metadata, AdminNavbar(), DemoCarouselProps, DemoDeck(), DemoDeckProps (+8 more)

### Community 9 - "react"
Cohesion: 0.19
Nodes (13): @supabase/ssr, loginAction(), LoginActionResult, logoutAction(), AdminLoginPage(), initialState, createClient(), getSupabaseConfig() (+5 more)

### Community 10 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 11 - "csv-mapper.ts"
Cohesion: 0.18
Nodes (19): ActionResponse, commitImportCsvAction(), ImportCsvPage(), ALLOWED_IMPORT_INITIAL_STATUSES, coerceString(), determineLeadStatuses(), FORBIDDEN_DIRECT_OUTREACH_STATUSES, ImportSummary (+11 more)

### Community 13 - "Draf Copy — Penambahan Informasi Web Nalar Solusi Digital"
Cohesion: 0.29
Nodes (6): A. Section Email Bisnis — DIPERKUAT, B. Section Kontak — BARU, C. FAQ — BARU, Catatan implementasi (untuk nanti), Draf Copy — Penambahan Informasi Web Nalar Solusi Digital, KONFIGURASI (dibaca dari env — nilai hanya di lokal/VPS; di prompt/dokumen cukup sebut nama variabelnya)

### Community 14 - "next"
Cohesion: 0.09
Nodes (33): Admin Nalar — API Reference, Import Rules Summary, Quick Summary of Endpoints, 1. Authentication & Security, Error Responses, nextConfig, next, dynamic (+25 more)

### Community 15 - "2. API Endpoints"
Cohesion: 0.08
Nodes (24): 2.1. Get Due Follow-ups, 2.2. Get Queue Summary, 2.3. Search and List Leads, 2.4. Get Lead Detail, 2.5. Record Interaction & Transition Status, 2.6. Patch Lead Fields & Status, 2.7. Batch Import Leads, 2. API Endpoints (+16 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.24
Nodes (8): @vercel/analytics@^2.0.1, @vercel/speed-insights@^2.0.0, @vercel/analytics, @vercel/speed-insights, metadata, plusJakartaSans, RootLayout(), viewport

### Community 17 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, test:watch

### Community 18 - "vite-tsconfig-paths"
Cohesion: 0.40
Nodes (4): vite-tsconfig-paths@^5.1.4, @vitejs/plugin-react@^4.3.4, vite-tsconfig-paths, @vitejs/plugin-react

### Community 19 - "tailwindcss"
Cohesion: 0.50
Nodes (3): tailwindcss@^3.4.17, tailwindcss, config

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `site.ts`, `repository.ts`, `dependencies`, `lucide-react`, `react`, `csv-mapper.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `PRD — Website Profil Nalar Solusi Digital` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `site.ts` to `package.json`, `repository.ts`, `csv-mapper.ts`, `next`, `app/layout.tsx`, `vite-tsconfig-paths`, `@testing-library/jest-dom`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08522727272727272 - nodes in this community are weakly interconnected._
- **Why does `react` connect `lucide-react` to `package.json`, `site.ts`, `repository.ts`, `dependencies`, `react`, `csv-mapper.ts`, `next`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `8. Spesifikasi Desain dan Copywriting` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06839945280437756 - nodes in this community are weakly interconnected._