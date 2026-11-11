# SEO Audit Baseline — ujjwal-seo.com

Audit date: 11 October 2026
Scope: repository at commit `4515a05` + live site `https://ujjwal-seo.com/`
Rule followed: **no files were modified before this audit was written.**

Every finding below was checked against the repository, the built `dist/` output, or the live site. Where something could not be verified, it says so.

---

## 1. Project inventory

| Item | Finding |
|---|---|
| Framework | Astro **7.2.6** (latest available: 7.3.5) |
| Integrations | `@astrojs/sitemap` 3.7.3 — no other dependencies |
| Node | v22.17.1 (`engines: >=22.12.0`) |
| Rendering | Static site generation (`output: 'static'`), 38 routes + 4 redirect stubs |
| Hosting | Netlify (confirmed by response headers). **No `netlify.toml` or `_redirects` file in the repo** — all Netlify settings live in the Netlify dashboard |
| DNS | Netlify DNS (NS1). Apex + `www` resolve to Netlify; `www` and `http` 301 → `https://ujjwal-seo.com/` |
| CSS | One global stylesheet (`src/styles/global.css`) + component-scoped `<style>` blocks |
| JavaScript | No client framework. Inline scripts: mobile menu (Header), map interactions. Third-party: Ahrefs analytics (all pages), Calendly + Cal.com embeds (`/reserver-un-appel/`) |
| Fonts | Google Fonts (Inter + Playfair Display) via `fonts.googleapis.com` stylesheet, `display=swap` |
| Forms | One Netlify form (`name="contact"`), honeypot, consent checkbox, redirects to `/merci/` |
| Analytics | Ahrefs Web Analytics script in `BaseLayout.astro` |
| Search Console | Meta verification tag present on all 38 pages (verified live) |
| Env vars | No `.env` files. `.gitignore` covers `.env*`. No secrets found in source |
| Lint / test scripts | **None** (`package.json` has only `dev`, `build`, `preview`) |
| Language | `<html lang="fr">` on all pages, `og:locale=fr_FR` |

### Routes (from build)
- **Indexable (34):** `/`, `/a-propos/`, `/approche/`, `/contact/`, `/realisations/`, `/reserver-un-appel/`, `/blog/` + 7 articles, `/services/` + 6 services, `/zones-intervention/` + 4 department pages + 1 region page + 7 city pages
- **Noindex (3):** `/mentions-legales/`, `/politique-confidentialite/`, `/merci/`
- **Redirect stubs (4):** `/seo-rennes/`, `/seo-bretagne/`, `/services/seo-on-page/`, `/services/accompagnement-seo/`
- **404:** `/404.html`

Every indexable page has exactly 1 `<h1>`, a unique `<title>`, a meta description and a self-referencing canonical on `https://ujjwal-seo.com`. No duplicate titles.

---

## 2. Findings

Priority scale: **Critical** = misleading/broken/legal or security exposure; **High** = clear ranking, trust or conversion loss; **Medium** = meaningful improvement; **Low** = polish/maintenance.

| # | Priority | Area | Issue (evidence) | Files affected | Recommendation |
|---|---|---|---|---|---|
| 1 | **Critical** | Structured data | All 7 city pages declare Wikidata `sameAs` IDs that point to unrelated entities. Verified via Wikidata API: Q47703 = *Le Parrain* (film), Q212629 = *Oxycombustion*, Q185145 = *grande puissance*, Q193740 = *Live Aid*, etc. I introduced these in the redesign without verifying them. | `src/pages/zones-intervention/seo-*.astro` | Remove the `sameAs` values (or replace with verified IDs). |
| 2 | **Critical** | Legal / trust | Privacy policy states *"Ce site n'utilise actuellement aucun outil d'analyse d'audience"*, but the Ahrefs analytics script loads on every page. | `src/pages/politique-confidentialite.astro`, `src/layouts/BaseLayout.astro` | Disclose Ahrefs (provider, purpose, data, retention) or remove the script. Consent requirement to be confirmed (see LEGAL review). |
| 3 | **Critical** | Conversion | `/reserver-un-appel/` embeds Calendly with the placeholder URL `calendly.com/votre-compte` and also loads Cal.com. The booking widget cannot work. The page is indexed and in the sitemap. | `src/pages/reserver-un-appel.astro` | Insert the real booking URL, or remove the widget and point to contact/WhatsApp. Load only one booking provider. |
| 4 | **Critical** | Security | `npm audit`: 6 vulnerabilities (1 critical: `astro <7.2.8`; high: `devalue`, `http-cache-semantics`, `js-yaml`, `sharp`, `undici`). Build-time only for a static site, but should be patched. | `package.json`, `package-lock.json` | Upgrade Astro to 7.3.x and sitemap to 3.7.4, re-run audit and build. |
| 5 | **High** | Content accuracy | City pages contain figures I wrote without sources: population (Rennes 450 000, Laval 115 000, Fougères 55 000, Redon 66 000, Châteaubriant 45 000, Janzé 25 000), *"taux de chômage parmi les plus faibles de France"* (Vitré), *"1h10 de TGV"* (Laval). | `src/pages/zones-intervention/seo-*.astro` | Verify with INSEE or remove. |
| 6 | **High** | Location accuracy | `seo-local.astro` says *"Basé à Rennes"*; the legal notice gives an address in **Moutiers (35130)**; `zones-intervention/index.astro` says *"Implanté au cœur de la Bretagne et des Pays de la Loire"*. These contradict each other. | `services/seo-local.astro`, `zones-intervention/index.astro`, `contact.astro` | Pick one truthful statement (e.g. "basé près de Vitré, en Ille-et-Vilaine") and use it everywhere. **Needs owner confirmation.** |
| 7 | **High** | Structured data / local | `/contact/` JSON-LD declares a street address, telephone and e-mail that are **not visible** on the contact page. | `src/pages/contact.astro` | Either show them on the page or drop them from the schema. Owner must decide whether the home address should be public. |
| 8 | **High** | Redirects | The 4 legacy URLs return **HTTP 200 + meta-refresh**, not a 301 (Astro static redirects without a Netlify adapter/`_redirects`). | `astro.config.mjs` | Add `public/_redirects` with real 301s. |
| 9 | **High** | Broken asset | `/assets/blog/seo-vs-geo.jpg` returns 404 but is referenced as the article's featured image and in its Article schema. | `src/content/blog/seo-vs-geo.md` | Add a real image or remove the reference. |
| 10 | **High** | Doorway risk | 4 department pages (`ille-et-vilaine`, `mayenne`, `loire-atlantique`, `maine-et-loire`) are mostly short lists of cities; `maine-et-loire` links to no page of its own. The 7 city pages share one template with 2–3 paragraphs + FAQ each. The new brief explicitly asks to avoid unnecessary location pages. | `src/pages/zones-intervention/*` | Consolidate thin department pages into the hub (with 301s); keep only city pages with genuinely local, verified content. **Strategy decision needed (see §4).** |
| 11 | **High** | Forms / a11y | Form has `novalidate` and no script, so browser validation is disabled and there are no error messages. Empty required fields can be submitted. | `src/components/ContactForm.astro` | Remove `novalidate` (native validation) or add accessible JS validation with `aria-describedby` errors. |
| 12 | **High** | Positioning conflict | The new brief asks for homepage title *"Consultant SEO à Rennes et en Bretagne"* and a structure with *SEO on-page*, *Accompagnement SEO*, *SEO Rennes*, *SEO Bretagne*. The previous brief (implemented 3–4 Oct) required a national *"Consultant SEO & GEO"* positioning with `/services/seo-contenu/`, `/services/strategie-seo/`, `/services/geo/` and `/zones-intervention/`. | Site-wide | **Owner decision required before Phases 3–4.** |
| 13 | Medium | CTA consistency | At least 4 different primary CTAs: *Parler de votre projet*, *Réserver un appel* (→ broken page), *Demander un audit SEO*, *Échanger sur vos enjeux*. | Header, service pages, `CTA` usages | Choose one primary CTA and one secondary. |
| 14 | Medium | Realisations | `/realisations/` has no case studies but says *"les résultats que mes clients constatent"* and *"Des résultats concrets, mesurables"*. Thin + implied claims. | `src/pages/realisations.astro` | Reword honestly; consider `noindex` until real case studies exist. |
| 15 | Medium | Performance | Several inner pages still use full-bleed JPG heroes, 1600px, 220–550 KB, no `srcset`, no WebP/AVIF (e.g. `/blog/` uses `local-shop.jpg` 548 KB as eager LCP image). | `blog/index.astro`, `services/audit-seo.astro`, `services/seo-technique.astro`, `services/seo-local.astro`, `realisations.astro`, `404.astro` | Use Astro `<Image>`/`<Picture>` (WebP/AVIF + srcset) or the SVG hero already used elsewhere. |
| 16 | Medium | Performance / GDPR | Google Fonts loaded from Google's CDN: a render-blocking third-party stylesheet that also sends visitor IPs to Google (German courts have ruled this a GDPR issue). | `src/layouts/BaseLayout.astro` | Self-host the two fonts (woff2, subset latin) with `font-display: swap`. |
| 17 | Medium | Security headers | Live response only sends `Strict-Transport-Security`. No `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection or CSP. | none (Netlify config missing) | Add `public/_headers`. CSP must allow Ahrefs, Netlify forms and any booking tool. |
| 18 | Medium | Structured data | Entities are not connected: homepage uses `ProfessionalService`, blog uses `Organization` as publisher, no `@id`s. Article schema has no `dateModified`. BreadcrumbList only on pages using `ServiceLayout`; zone/approche/about pages show breadcrumbs without schema. | `BaseLayout`, `ServiceLayout`, `blog/[...slug].astro`, page files | One `@graph` with stable `@id`s (`#person`, `#business`, `#website`). |
| 19 | Medium | Meta descriptions | Many descriptions are 160–215 characters and will be truncated in Google. | Most pages | Trim to roughly 140–160 characters. |
| 20 | Medium | Visible contact info | Contact page shows no e-mail or phone, only the form and WhatsApp. | `src/pages/contact.astro` | Show the contact methods the owner wants public. |
| 21 | Low | FAQ schema | FAQPage markup is valid and matches visible FAQs, but Google has limited FAQ rich results to authority sites since 2023. No harm, little gain. | FAQ component pages | Keep; do not expect rich results. |
| 22 | Low | Legacy branding | `theme-color` is still the old cream `#F9F6F1`; default `og:image:alt` still says *"…à Rennes et en Bretagne"*. | `BaseLayout.astro` | Align with whichever positioning is chosen. |
| 23 | Low | Dead code | Unused components `Hero.astro`, `HomeHero.astro`, `Button.astro`; unused images `architecture.jpg`, `bretagne-coast.jpg`, `calm-coast.jpg`, `countryside-path.jpg`, `ujjwal-lage-homepage.jpg`, `ujjwal-lage-portrait.jpg` (~1.5 MB deployed for nothing); empty `brandguideline.md`. | listed | Remove after confirming they are not wanted. |
| 24 | Low | Tooling | No lint, type-check or test scripts. | `package.json` | Add `astro check` at minimum. |
| 25 | Low | Form a11y | Required asterisks are `aria-hidden` with no legend explaining them (the `required` attribute still conveys it to screen readers). | `ContactForm.astro` | Add "* champs obligatoires". |

### Confirmed working (no action needed)
- HTTPS, `http→https` and `www→apex` 301s, HSTS.
- Canonicals, `og:url`, JSON-LD URLs, sitemap and robots.txt all on `https://ujjwal-seo.com`.
- Sitemap: 34 URLs, excludes noindex pages and redirect stubs.
- robots.txt: `Allow: /`, no blocking rules, correct sitemap URL.
- One H1 per page, unique titles, `lang="fr"`, skip link present.
- All `<img>` tags have an `alt` attribute (the one empty `alt` is a decorative hero).
- Search Console meta tag present once in `<head>` on all real pages.
- Netlify form has honeypot and consent checkbox.

### Not verified yet (tools to run in Phase 15)
- Lighthouse / Core Web Vitals (no lab or field data collected yet).
- axe accessibility scan, colour contrast measurements.
- Full internal link crawl.
- Whether the Netlify form actually delivers submissions (requires a test submission).
- Netlify dashboard settings (form notifications, asset optimisation, deploy contexts).

---

## 3. Gaps by category

**Local SEO:** no visible NAP on contact page; conflicting "based in" statements; unknown Google Business Profile status; no verified local facts on city pages.
**Conversion:** broken booking page, inconsistent CTAs, form without validation feedback, no visible phone/e-mail, realisations page without evidence.
**Content:** no real case studies; city pages contain unverified numbers; blog lacks `updatedDate` usage and author bio block (to confirm in Phase 12).
**Accessibility:** form errors; required-field legend; contrast and keyboard flow still to be measured.
**Performance:** JPG heroes without responsive variants; third-party fonts; Calendly + Cal.com both loaded.

---

## 4. Decisions needed from the owner before implementation

1. **Positioning:** keep *"Consultant SEO & GEO"* (national, current) or switch to *"Consultant SEO à Rennes et en Bretagne"* (new brief)?
2. **Architecture:** keep current service slugs (`seo-contenu`, `strategie-seo`, `geo`) or return to `seo-on-page` / `accompagnement-seo`? Every URL change needs 301s and resets some indexing.
3. **Location pages:** how many to keep, and which local facts are true?
4. **Business facts:** where exactly is the business based (Rennes vs Moutiers)? Should the street address, phone and e-mail be public? Real booking URL? Google Business Profile URL? Training/certifications to mention?

---

## 5. Recommended implementation order

1. **Safe fixes, independent of strategy (do first):** #1 Wikidata, #2 privacy/Ahrefs disclosure, #3 booking page, #4 dependency upgrade, #8 real 301s, #9 missing image, #11 form validation, #17 security headers, #25 form legend.
2. **After owner answers §4:** #5, #6, #7, #10, #12, #13, #14, #20, #22.
3. **Performance pass:** #15, #16, then Lighthouse measurement.
4. **Structured data graph:** #18 once business facts are confirmed.
5. **Content and meta polish:** #19, blog review (Phase 12).
6. **Cleanup and tooling:** #23, #24.
