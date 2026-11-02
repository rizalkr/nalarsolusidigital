# Graph Report - nalarsolusidigital  (2026-11-02)

## Corpus Check
- 87 files · ~42,875 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .ico 1)

## Summary
- 476 nodes · 1017 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e14c0eb`
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
- page.tsx
- react
- eslint.config.mjs
- csv-mapper.ts
- postcss.config.mjs
- Draf Copy — Penambahan Informasi Web Nalar Solusi Digital

## God Nodes (most connected - your core abstractions)
1. `next` - 33 edges
2. `siteConfig` - 28 edges
3. `react` - 23 edges
4. `vitest` - 23 edges
5. `lucide-react` - 22 edges
6. `PRD — Website Profil Nalar Solusi Digital` - 20 edges
7. `LeadStatus` - 19 edges
8. `VerificationStatus` - 17 edges
9. `validateInternalApiKey()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- ``LeadStatus`` --references--> `LeadStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts
- ``VerificationStatus`` --references--> `VerificationStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts
- `2.3. Search and List Leads` --references--> `LeadStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts
- `2.5. Record Interaction & Transition Status` --references--> `LeadStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts
- `2.3. Search and List Leads` --references--> `VerificationStatus`  [INFERRED]
  docs/internal-api.md → src/lib/admin/leads/types.ts

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "PRD — Website Profil Nalar Solusi Digital"
Cohesion: 0.04
Nodes (46): 10. Kebutuhan Fungsional, 11. Kebutuhan Nonfungsional, 12. Konfigurasi Data, 13. Arsitektur dan Teknologi, 14. Pengujian, 15. Tahapan Implementasi, 16. Risiko dan Mitigasi, 17. Data yang Belum Tersedia (+38 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (48): devDependencies, autoprefixer@^10.4.20, eslint@^9.20.1, eslint-config-next@^15.2.0, jsdom@^26.0.0, postcss@^8.5.2, server-only@^0.0.1, tailwindcss@^3.4.17 (+40 more)

### Community 2 - "8. Spesifikasi Desain dan Copywriting"
Cohesion: 0.07
Nodes (30): 8.1 Navbar, 8.2 Hero, 8.3 Section Layanan, 8.4 Section Contoh Solusi, 8.5 Section Cara Kerja, 8.6 Section Pendekatan Nalar, 8.7 CTA Penutup, 8.8 Footer (+22 more)

### Community 3 - "site.ts"
Cohesion: 0.07
Nodes (55): lucide-react, @testing-library/react, vitest, HomePage(), getContrast(), getLuminance(), robots(), sitemap() (+47 more)

### Community 4 - "2. API Endpoints"
Cohesion: 0.05
Nodes (42): 2.1. Get Due Follow-ups, 2.2. Get Queue Summary, 2.3. Search and List Leads, 2.4. Get Lead Detail, 2.5. Record Interaction & Transition Status, 2.7. Batch Import Leads, 2. API Endpoints, 3. Summary of Status Enums (+34 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "repository.ts"
Cohesion: 0.06
Nodes (75): 1. Authentication & Security, 2.6. Patch Lead Fields & Status, Error Responses, Example Request: Pause Lead After Follow-up 2, Example Response (HTTP 200), nextConfig, next, AntreanPage() (+67 more)

### Community 7 - "dependencies"
Cohesion: 0.09
Nodes (24): dependencies, clsx@^2.1.1, lucide-react@^0.475.0, next@^15.2.0, papaparse@^5.7.0, react@^19.0.0, react-dom@^19.0.0, @supabase/ssr@^0.12.7 (+16 more)

### Community 8 - "page.tsx"
Cohesion: 0.42
Nodes (6): DemoCarousel(), DemoCarouselProps, DemoModal(), DemoModalProps, DemoShowcase(), DemoItem

### Community 9 - "react"
Cohesion: 0.14
Nodes (18): @supabase/supabase-js@^2.118.0, react, @supabase/ssr, @supabase/supabase-js, AdminLayout(), metadata, loginAction(), LoginActionResult (+10 more)

### Community 10 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 11 - "csv-mapper.ts"
Cohesion: 0.29
Nodes (11): commitImportCsvAction(), ImportCsvPage(), determineLeadStatuses(), ImportSummary, mapRawRowToLead(), parseBoolean(), parseNumber(), processImportRows() (+3 more)

### Community 13 - "Draf Copy — Penambahan Informasi Web Nalar Solusi Digital"
Cohesion: 0.29
Nodes (6): A. Section Email Bisnis — DIPERKUAT, B. Section Kontak — BARU, C. FAQ — BARU, Catatan implementasi (untuk nanti), Draf Copy — Penambahan Informasi Web Nalar Solusi Digital, KONFIGURASI (dibaca dari env — nilai hanya di lokal/VPS; di prompt/dokumen cukup sebut nama variabelnya)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `repository.ts` to `package.json`, `site.ts`, `dependencies`, `page.tsx`, `react`, `csv-mapper.ts`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `PRD — Website Profil Nalar Solusi Digital` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `package.json`, `site.ts`, `repository.ts`, `dependencies`, `page.tsx`, `csv-mapper.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05203619909502263 - nodes in this community are weakly interconnected._
- **Why does `Admin Nalar — Internal API Documentation for Tepa Agent` connect `2. API Endpoints` to `repository.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `8. Spesifikasi Desain dan Copywriting` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06687565308254964 - nodes in this community are weakly interconnected._