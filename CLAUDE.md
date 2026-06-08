# FinWiser — CLAUDE.md

## Stack
- **Framework:** Next.js 15 (App Router), TypeScript
- **Deployment:** Cloudflare Workers via OpenNext (`open-next.config.ts`, `wrangler.jsonc`)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (auth + saved calculations)
- **Ads:** Google AdSense (ca-pub-5438252770961085, slot 2503689657)

## Directory Structure

```
app/
  calculators/          7 calculators + 6 state mortgage variants
  learn/                13 article pages (TSX, not MDX)
  about/                About page — named author, how calculators are built
  contact/              Contact page — mailto links for corrections & feedback
  page.tsx              homepage
  sitemap.ts            programmatic sitemap
  robots.ts             robots.txt
components/
  ArticleLayout.tsx     article wrapper — JSON-LD, breadcrumb, byline, author bio
  calculators/          interactive calculator components
lib/
  articles.ts           SINGLE SOURCE OF TRUTH for all article metadata
  author.ts             siteAuthor constant (name, bio, url) — imported by ArticleLayout & About
  calculators/          calculator logic
  data/                 state-specific mortgage configs
public/
  _headers              Cloudflare cache headers (/_next/static/* immutable)
  og-image.png          shared OG image
  googlec37c7deb2993535b.html  Search Console verification
  ads.txt               AdSense publisher verification (pub-5438252770961085)
  # _redirects does NOT exist — use next.config.mjs redirects only
```

## Learn Articles

- **Location:** `app/learn/<slug>/page.tsx` — 13 articles, each a TSX file
- **Metadata schema:** `lib/articles.ts` — `ArticleMeta` interface + `articles[]` array
- **Fields per article:** `slug`, `title`, `description`, `date`, `updated?` (both human-readable strings e.g. "March 3, 2026"), `readMinutes`, `category`, `categoryColor`, `calculatorHref`, `calculatorLabel`
- **No MDX, no frontmatter** — all metadata lives in `lib/articles.ts`; article bodies are TSX/JSX
- **Date rendering:** `ArticleLayout.tsx` renders "Published {meta.date} · Reviewed {meta.updated}" in the byline. Dates are never hardcoded in article body files.
- **Date format in articles.ts:** Human-readable string e.g. `"March 3, 2026"`. Converted to ISO for JSON-LD via `toISODate()`. `updated` falls back to `date` in JSON-LD `dateModified`.
- **Metadata title rule:** Every `page.tsx` must use `` title: { absolute: `${meta.title} | FinWiser` } `` — never a hardcoded string. The H1 is rendered by `ArticleLayout` from `meta.title`; keeping the `<title>` tag in sync prevents drift.

### 13 surviving article slugs (in date order)

| Slug | Date | Category |
|---|---|---|
| `mortgage-payoff-strategies` | March 3, 2026 | Mortgage |
| `compound-interest-guide` | March 7, 2026 | Investing |
| `debt-avalanche-vs-snowball` | March 12, 2026 | Debt |
| `what-is-amortization` | March 17, 2026 | Loans |
| `mortgage-amortization-explained` | March 21, 2026 | Mortgage |
| `how-much-house-can-you-afford` | April 1, 2026 | Mortgage |
| `15-year-vs-30-year-mortgage` | April 14, 2026 | Mortgage |
| `debt-payoff-strategies` | April 23, 2026 | Debt |
| `fixed-vs-variable-interest-rate` | April 28, 2026 | Loans |
| `how-car-loan-interest-works` | May 7, 2026 | Auto Loans |
| `new-vs-used-car-loan` | May 12, 2026 | Auto Loans |
| `how-to-get-best-car-loan-rate` | May 16, 2026 | Auto Loans |
| `how-to-pay-off-car-loan-early` | May 23, 2026 | Auto Loans |

11 slugs were deleted and replaced with permanent redirects in `next.config.mjs` (see Redirects section).

## Calculators

| Calculator | Path | Notes |
|---|---|---|
| Mortgage | `app/calculators/mortgage/page.tsx` | Largest (~390 lines prose) |
| Mortgage Compare | `app/calculators/mortgage/compare/page.tsx` | 15 vs 30 year |
| Biweekly Mortgage | `app/calculators/biweekly-mortgage/page.tsx` | |
| Car Loan | `app/calculators/car-loan/page.tsx` | |
| Compound Interest | `app/calculators/compound-interest/page.tsx` | |
| Debt Payoff | `app/calculators/debt-payoff/page.tsx` | |
| Loan Amortization | `app/calculators/loan-amortization/page.tsx` | |
| State Mortgages | `app/calculators/mortgage/{nc,sc,ga,fl,tx,va}/page.tsx` | Config-driven via `StateMortgageCalculatorPage` |

Each calculator page has 150–350 lines of surrounding prose (explainer sections, formulas, FAQs, related links).

## JSON-LD (Articles)

Generated in `components/ArticleLayout.tsx`. Three schemas per article:
1. `BlogPosting` — headline, description, url, `datePublished` from `meta.date`, `dateModified` from `meta.updated` (fallback `meta.date`), `author` as **Person** (Pavel Borishkevich), `publisher` as Organization (FinWiser + logo)
2. `BreadcrumbList` — Home → Learn → Article title
3. `FAQPage` — conditional, only if `faq` prop is passed

Injected via `<script type="application/ld+json" dangerouslySetInnerHTML>`.

## Author

`lib/author.ts` exports `siteAuthor` — a single object with `name`, `bio`, and `url`. Import this wherever the author is referenced (ArticleLayout, About page) to keep name/bio in sync. Do not hardcode the author name in any component.

## Redirects

11 permanent (308) redirects live in `next.config.mjs`. These cover deleted slugs from the Phase 1 consolidation:

| Old slug | Redirects to |
|---|---|
| `extra-mortgage-payments-how-much-can-you-save` | `mortgage-payoff-strategies` |
| `how-to-save-on-mortgage-interest` | `mortgage-payoff-strategies` |
| `biweekly-vs-monthly-mortgage-payments` | `mortgage-payoff-strategies` |
| `what-is-loan-amortization` | `what-is-amortization` |
| `what-is-compound-interest` | `compound-interest-guide` |
| `avalanche-vs-snowball-debt-payoff` | `debt-avalanche-vs-snowball` |
| `avalanche-vs-snowball-comparison` | `debt-avalanche-vs-snowball` |
| `car-loan-term-length-guide` | `how-car-loan-interest-works` |
| `car-loan-down-payment-guide` | `how-car-loan-interest-works` |
| `dealer-financing-vs-bank-loan` | `how-to-get-best-car-loan-rate` |
| `new-car-vs-used-car-loan` | `new-vs-used-car-loan` |

Do not add `public/_redirects` — use `next.config.mjs` redirects only.

## Key Patterns

- **Adding a new article:** Add entry to `lib/articles.ts` array, create `app/learn/<slug>/page.tsx` that calls `getArticle(slug)` and returns `<ArticleLayout>`. Use `` title: { absolute: `${meta.title} | FinWiser` } `` in metadata — never hardcode.
- **Adding a new state mortgage page:** Add state config to `lib/data/`, create `app/calculators/mortgage/<state>/page.tsx` that renders `<StateMortgageCalculatorPage>`.
- **No content schema file** (not Astro) — the TypeScript `ArticleMeta` interface in `lib/articles.ts` IS the schema.
- **`public/ads.txt` exists** — do not modify; contains the AdSense publisher line.
- **Auth pages are noindexed** via `app/auth/layout.tsx` (server component, sets `robots: { index: false, follow: false }` for the whole `/auth/` tree). Auth routes are also disallowed in `app/robots.ts`. Do not add auth pages to the sitemap.

## Article Math Accuracy

All numerical examples in article bodies must be verifiable from first principles. Key rules:

- **Verify before writing.** Use `node -e "..."` or the vitest test suite to confirm dollar figures, interest totals, and term lengths before publishing. Never round-trip from memory.
- **Consistency across the page.** Every strategy's interest-savings range must agree across the inline callout, the FAQ, and the summary table. A reader who checks all three should see the same numbers.
- **Explicit assumptions.** Whenever a calculation result is quoted, the loan amount, rate, and term must be stated in the same sentence or callout — never leave the reader to guess the inputs.
- **Pinned test cases.** Key article example values are pinned in dedicated test sections labelled "article example values":
  - `lib/calculators/__tests__/compoundInterest.test.ts` — compound interest article examples
  - `lib/calculators/__tests__/debtPayoff.test.ts` — debt avalanche/snowball article examples (single-debt, 3-debt callout, Marcus case)
  When adding or changing a numerical example in any article, add or update the corresponding test. Run `npm test` before committing.
- **Debt payoff examples require stated minimum payments.** Avalanche/snowball timelines and interest totals cannot be verified without knowing minimum payments. Either list explicit minimums or use a "total monthly budget" model (set `minPayment: 0`, pass full budget as `extraMonthly`). Never leave minimum payments implied.
- **Common error patterns caught in prior audits:**
  - Monthly vs quarterly compounding confusion (e.g. `$10k × (1+r/4)^80` mistakenly labelled monthly)
  - Annual vs monthly contribution formulas (multiply PMT by 12 vs use monthly annuity formula)
  - Quoting the 15-year loan's own interest cost instead of the savings vs the 30-year alternative
  - Credit card growth figures that imply ~17% APR while the surrounding text says 20–29%
  - Debt payoff timelines stated without minimum payments (unverifiable; corrected in `debt-avalanche-vs-snowball`)

## Sitemap

`app/sitemap.ts` — programmatic Next.js sitemap. Pulls article slugs from `lib/articles.ts` and calculator paths statically. Automatically reflects the 13-article set.

## Article Dates

All 13 articles have `date` (March–May 2026) and `updated` (May–June 2026). Both are human-readable strings. `updated` is staggered across articles — no two share the same value. Dates render from `meta.date` / `meta.updated` only; no article body hardcodes a date string.

When editing an article, update its `updated` field in `lib/articles.ts` to today's date.

## Article Structure Standards (Phase 3)

To avoid templated / machine-stamped appearance, maintain structural variety:

- **Non-listicle articles (≥3):** `debt-payoff-strategies` (narrative plan-building), `how-to-get-best-car-loan-rate` (chronological shopping journey), `how-to-pay-off-car-loan-early` (problem→scenario→takeaway). Keep these as narrative — do not revert to numbered tips.
- **Original element per article:** Every article has one of: a realistic named mini-case, a "Common mistake" callout, or a worked example specific to that article's topic. Do not remove these when editing.
- **FAQ scope:** FAQs are conditional on the `faq` prop. Only include FAQs that are genuinely distinct from the article body. `debt-payoff-strategies` has 3 FAQs; `fixed-vs-variable-interest-rate` has 3 FAQs; others have 5–6. Do not pad back to a uniform count.
- **Tables:** Keep only where a comparison is the primary purpose of the section (15-year vs 30-year, avalanche vs snowball, amortization payment rows). Do not add tables for visual variety alone.
- **Intro variety:** Not every article should open on a shock stat. `compound-interest-guide` opens with a conceptual framing; `how-to-pay-off-car-loan-early` opens with a specific loan scenario; `how-to-get-best-car-loan-rate` opens with the preparation insight. Preserve these different entry points.
