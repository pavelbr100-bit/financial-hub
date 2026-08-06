# FinWiser — SEO Implementation Brief for Claude Code

**Project:** finwiser.net — Next.js (App Router, TypeScript), deployed behind Cloudflare
**Goal:** Implement the code-fixable SEO items from the FinWiser SEO audit
**Out of scope:** Writing marketing copy (scaffolded with `TODO` markers), link building, calculator math for new tools

Read this whole document before starting. Work through the phases in order — later phases depend on components built in earlier ones. Commit after each phase.

---

## Context: why these changes

The site is technically excellent (Lighthouse 100/100 performance and SEO) but ranks nowhere — 77 keywords, all in positions 60–100. Two causes: almost no backlinks (not fixable in code) and **weak on-page signals** (very fixable in code):

- All 7 audited page titles exceed 65 characters and get truncated in search results
- H1s don't match the keywords the pages should target
- **Zero JSON-LD structured data exists anywhere on the site**
- The debt payoff calculator implements the debt snowball method but never uses the phrase "Debt Snowball Calculator" — that's a 6,600/month keyword with difficulty 12
- Internal linking is global-footer-only; there are no contextual in-body links
- Several calculator pages have under 400 words of content

---

## Phase 0 — Discovery

Before changing anything, establish the ground truth and report it back.

1. Map the `app/` directory. List every route segment and its `page.tsx`, plus any `layout.tsx` files.
2. **Find the root `metadata` export in `app/layout.tsx`.** Determine whether it uses a `title.template` (e.g. `"%s | FinWiser"`). This is critical — several tasks below require dropping the `| FinWiser` suffix, which means using `title: { absolute: "..." }` on those pages rather than a plain string.
3. Check whether `metadataBase` is set in the root layout. If not, add it (`new URL("https://finwiser.net")`) — without it, Open Graph and canonical URLs can resolve incorrectly.
4. Identify how the existing debt payoff calculator handles avalanche vs. snowball strategy selection. Note the component name, its props, and whether the strategy is a prop, a URL param, or internal state. Phase 5 depends on this.
5. Note whether `app/sitemap.ts` and `app/robots.ts` exist, or whether these are static files in `public/`.
6. Note the styling approach (Tailwind? CSS modules?) so new components match existing conventions.
7. Confirm TypeScript strictness settings and whether there's an existing `components/` or `lib/` convention to follow.

**Report findings before proceeding.** If anything below conflicts with the actual repo structure, follow the repo's conventions and flag the deviation.

---

## Phase 1 — Shared SEO infrastructure

Build these first; everything else uses them.

### 1.1 `lib/site.ts` — single source of truth

```ts
export const SITE = {
  name: "FinWiser",
  url: "https://finwiser.net",
  tagline: "Your finances, only wiser.",
  logo: "https://finwiser.net/og-image.png",
} as const;

export const AUTHOR = {
  name: "Pavel Borishkevich",
  url: "https://finwiser.net/about",
  // TODO: add jobTitle and a one-line credential string — this matters for YMYL finance content
  jobTitle: "TODO",
} as const;
```

### 1.2 `components/seo/JsonLd.tsx` — generic emitter

```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Render this inside server components (page bodies). Do not add `key` collisions if multiple instances appear on one page — that's fine, multiple `ld+json` blocks per page are valid.

### 1.3 `components/seo/CalculatorSchema.tsx` — WebApplication

This is the highest-value schema on the site. It tells Google the page **is an interactive tool**, which is the primary ranking signal for calculator queries.

```tsx
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

type Props = {
  name: string;          // e.g. "Debt Snowball Calculator"
  description: string;
  path: string;          // e.g. "/calculators/debt-snowball"
  featureList?: string[];
};

export function CalculatorSchema({ name, description, path, featureList }: Props) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: `${SITE.url}${path}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
        },
        ...(featureList ? { featureList } : {}),
      }}
    />
  );
}
```

### 1.4 `components/seo/BreadcrumbSchema.tsx`

```tsx
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export type Crumb = { name: string; path: string };

export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${SITE.url}${item.path}`,
        })),
      }}
    />
  );
}
```

Also build a **visible** `<Breadcrumbs>` UI component using the same `Crumb[]` data. Google prefers breadcrumb markup that corresponds to visible navigation. Render both from one array passed down from the page.

### 1.5 `components/FaqSection.tsx` — visible FAQ + schema from one source

**This is the most important component in this phase.** Google requires that `FAQPage` schema content match what's visible on the page. Deriving both from the same array makes drift structurally impossible.

```tsx
import { JsonLd } from "./seo/JsonLd";

export type FaqItem = { question: string; answer: string };

export function FaqSection({
  items,
  heading = "Frequently Asked Questions",
}: {
  items: FaqItem[];
  heading?: string;
}) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading">{heading}</h2>
      {items.map((item) => (
        <div key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </section>
  );
}
```

Constraints to enforce in code review:
- Answers must be plain text (no JSX children). If rich formatting is needed later, add a separate `answerHtml` field and use it for both rendering and schema.
- Never render `FaqSection` with an empty array — emit nothing instead.

### 1.6 `components/seo/ArticleSchema.tsx` — for `/learn` pages

```tsx
import { JsonLd } from "./JsonLd";
import { SITE, AUTHOR } from "@/lib/site";

type Props = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;  // ISO 8601
  dateModified?: string;
};

export function ArticleSchema({
  headline, description, path, datePublished, dateModified,
}: Props) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        url: `${SITE.url}${path}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}${path}` },
        datePublished,
        dateModified: dateModified ?? datePublished,
        author: {
          "@type": "Person",
          name: AUTHOR.name,
          url: AUTHOR.url,
          jobTitle: AUTHOR.jobTitle,
        },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          logo: { "@type": "ImageObject", url: SITE.logo },
        },
      }}
    />
  );
}
```

You'll need real `datePublished` values. Pull them from git history (`git log --diff-filter=A --format=%aI -1 -- <file>`) rather than inventing dates.

### 1.7 `components/RelatedCalculators.tsx`

Currently every page links to every other page only through the global footer. That passes almost no targeted authority. This component renders a **contextual in-body** block of 3–4 related tools.

```tsx
import Link from "next/link";

export type CalcLink = { href: string; label: string; blurb: string };

export function RelatedCalculators({ items }: { items: CalcLink[] }) {
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading">Related calculators</h2>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
            <p>{item.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Anchor text must be the target page's **exact target keyword** (e.g. "Mortgage Payoff Calculator", not "click here" or "our other tool").

---

## Phase 2 — Route rename: debt-payoff → debt-snowball

The single highest-value change on the site.

### 2.1 Move the route

Rename `app/calculators/debt-payoff/` → `app/calculators/debt-snowball/`.

### 2.2 Add the permanent redirect

In `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/calculators/debt-payoff",
        destination: "/calculators/debt-snowball",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
```

### 2.3 Update every internal reference

Grep the whole repo for `debt-payoff` and update: footer nav, any calculator index/hub page, the `/learn/debt-avalanche-vs-snowball` article's internal link, sitemap entries, and any hardcoded arrays of calculator routes.

**Acceptance:** `rg "debt-payoff"` returns zero results outside `next.config.ts`.

### 2.4 Update the page metadata and H1

```ts
export const metadata: Metadata = {
  // Use `absolute` ONLY if the root layout defines a title.template
  title: { absolute: "Debt Snowball Calculator — Free, No Signup" },
  description:
    "Free debt snowball calculator. Enter your debts and see your exact debt-free date, total interest, and how extra payments speed it up. No signup.",
  alternates: { canonical: "https://finwiser.net/calculators/debt-snowball" },
  openGraph: {
    title: "Debt Snowball Calculator — Free, No Signup",
    description:
      "See your debt-free date with the snowball method. Free, instant, no account required.",
    url: "https://finwiser.net/calculators/debt-snowball",
    type: "website",
  },
};
```

Change the H1 from `Debt Payoff Planner` to **`Debt Snowball Calculator`**.

---

## Phase 3 — Metadata and H1 sweep

Apply to every page. Two hard rules:

- **Titles must be ≤ 60 characters.** Every current title is 70–86 and gets truncated.
- **Meta descriptions must be 150–155 characters.** Four are currently over 160.

Drop the `| FinWiser` suffix on calculator pages — nobody searches the brand yet, so it wastes characters that should carry keywords. Keep it on `/learn` pages and the homepage.

### 3.1 Titles

| Route | New title (`title.absolute`) | Chars |
|---|---|---|
| `/calculators/debt-snowball` | `Debt Snowball Calculator — Free, No Signup` | 42 |
| `/calculators/loan-amortization` | `Amortization Calculator — Free Loan Schedule` | 44 |
| `/calculators/car-loan` | `Car Payment Calculator — Free Auto Loan Estimate` | 48 |
| `/calculators/compound-interest` | `Compound Interest Calculator — Free & Instant` | 45 |
| `/calculators/mortgage` | `Mortgage Calculator with Taxes, Insurance & PMI` | 47 |
| `/calculators/biweekly-mortgage` | `Biweekly Mortgage Calculator — See Your Savings` | 47 |
| `/calculators/mortgage/compare` | `Mortgage Comparison Calculator — Compare 3 Loans` | 48 |

### 3.2 H1s

Calculator page H1s must be the exact tool name people search for — not a friendly brand phrase.

| Route | Current H1 | New H1 |
|---|---|---|
| `/calculators/debt-snowball` | Debt Payoff Planner | **Debt Snowball Calculator** |
| `/calculators/mortgage/compare` | Compare Mortgages | **Mortgage Comparison Calculator** |
| `/calculators/car-loan` | Car Loan Calculator | **Car Payment Calculator** |
| `/calculators/loan-amortization` | Loan Amortization Calculator | **Amortization Calculator** |

Leave these H1s alone — they're already correct: `/calculators/mortgage` ("Mortgage Calculator"), `/calculators/compound-interest` ("Compound Interest Calculator"), `/calculators/biweekly-mortgage` ("Biweekly Mortgage Payment Calculator").

**Enforce exactly one `<h1>` per page.** Audit for pages where a layout and a page both emit one.

### 3.3 Meta descriptions to shorten

| Route | Current length | Action |
|---|---|---|
| `/calculators/loan-amortization` | 202 | Trim to ≤155 |
| `/calculators/compound-interest` | 204 | Trim to ≤155 |
| `/calculators/mortgage` | 197 | Trim to ≤155 |
| `/learn/compound-interest-guide` | 178 | Trim to ≤155 |

### 3.4 Canonicals and Open Graph

Every page needs `alternates.canonical` set to its absolute URL. Verify each page's `openGraph.url` matches its canonical — mismatches are a common silent bug.

### 3.5 Add a length guard

Add a small dev-time assertion or a lint script that fails the build if any page's `title` exceeds 60 chars or `description` exceeds 160. This prevents regression.

---

## Phase 4 — Wire schema and internal links into every page

For **each calculator page**, add inside the page component:

```tsx
<BreadcrumbSchema items={[
  { name: "Home", path: "/" },
  { name: "Calculators", path: "/calculators" },
  { name: "Debt Snowball Calculator", path: "/calculators/debt-snowball" },
]} />
<CalculatorSchema
  name="Debt Snowball Calculator"
  description="..."           // reuse the meta description
  path="/calculators/debt-snowball"
  featureList={["Snowball payoff order", "Debt-free date", "Total interest", "Extra payment impact"]}
/>
```

Plus the visible `<Breadcrumbs>` and `<RelatedCalculators>` components.

For **each `/learn` page**, add `<ArticleSchema>` and `<BreadcrumbSchema>`.

### 4.1 Retrofit the existing FAQ

`/learn/debt-avalanche-vs-snowball` already has a visible FAQ with six Q&As and **no schema on it**. This is the easiest win in the repo. Extract those six Q&As into a `FaqItem[]` and render through `<FaqSection>` so schema is emitted automatically. Preserve the existing wording verbatim.

### 4.2 Contextual internal links

Add these **in body prose**, not in nav or footer:

| From | Anchor text | To |
|---|---|---|
| `/learn/debt-avalanche-vs-snowball` | debt snowball calculator | `/calculators/debt-snowball` |
| `/learn/debt-avalanche-vs-snowball` | debt avalanche calculator | `/calculators/debt-avalanche` |
| `/learn/what-is-amortization` | amortization calculator | `/calculators/loan-amortization` |
| `/learn/mortgage-payoff-strategies` | mortgage payoff calculator | `/calculators/mortgage-payoff` |
| `/learn/compound-interest-guide` | compound interest calculator | `/calculators/compound-interest` |

If a Phase 5 target route doesn't exist yet, add the link in the same commit that creates the route — don't ship links to 404s.

---

## Phase 5 — Content scaffolding

Create the structural shell for the content that needs to be written. Every calculator page should follow this section order:

```tsx
<Breadcrumbs items={crumbs} />
<h1>{TOOL_NAME}</h1>
<p>{/* Intro: 2–3 sentences, must contain the exact target keyword */}</p>

<CalculatorComponent />

<section>
  <h2>How {TOOL_NAME_LOWER} works</h2>
  {/* TODO: mechanics + the formula */}
</section>

<section>
  <h2>Example</h2>
  {/* TODO: worked example with real numbers */}
</section>

<section>
  <h2>When this helps — and when it doesn't</h2>
  {/* TODO: honest judgment, not filler */}
</section>

<FaqSection items={FAQ_ITEMS} />
<RelatedCalculators items={RELATED} />
```

Define `FAQ_ITEMS` as a typed const at the top of each page file with the questions pre-filled and answers as `"TODO"`. **Guard against shipping placeholders:** make `FaqSection` throw in development (or the build script fail) if any answer equals `"TODO"`, so empty schema can never reach production.

### 5.1 Pre-fill these FAQ questions

Taken from live Google "People Also Ask" boxes for the target keywords — these are literally the questions Google wants answered.

**`/calculators/mortgage-payoff`:**
- What is the 2% rule for mortgage payoff?
- How do I pay off a 30 year mortgage in 5 years?
- How much does an extra principal payment reduce my mortgage?
- What is the formula for paying off a mortgage early?

**`/calculators/debt-snowball`:**
- Which is better, snowball or avalanche?
- How to pay off $10,000 in credit card debt fast?
- What does Dave Ramsey say about the debt snowball?
- How long will it take to pay off $30,000 in debt?

**`/calculators/mortgage/compare`:**
- Which mortgage calculator is most accurate?
- How much difference does .25% make on a mortgage?
- How much is a $350,000 mortgage at 6% for 30 years?

### 5.2 New routes to scaffold

Create these with full SEO shells (metadata, schema, breadcrumbs, FAQ scaffold, related links) and a `TODO` marker where calculator logic goes.

| Route | Target keyword | Volume/mo | Notes |
|---|---|---|---|
| `/calculators/mortgage-payoff` | mortgage payoff calculator | 60,500 | **Highest priority.** Must also cover "extra payment mortgage calculator" (33,100/mo) — same SERP, one page. Support extra monthly payment, one-time lump sum, and biweekly modes. |
| `/calculators/debt-avalanche` | debt avalanche calculator | 1,000 | Reuse the existing debt engine with strategy preset to avalanche (see Phase 0 finding #4). |
| `/calculators/student-loan-payoff` | student loan payoff calculator | 5,400 | Competition index 1 — lowest on the whole list. |
| `/calculators/auto-loan-payoff` | auto loan payoff calculator | 14,800 | Competition index 6. |
| `/calculators/credit-card-payoff` | credit card payoff calculator | 27,100 | |
| `/calculators/rent-vs-buy` | rent vs buy calculator | 14,800 | |

**Cannibalization warning:** `/calculators/mortgage-payoff`, `/calculators/biweekly-mortgage`, and `/calculators/mortgage` overlap. Keep them clearly differentiated — payoff page owns extra payments and lump sums, biweekly page owns the biweekly schedule, main mortgage page owns taxes/insurance/PMI. Cross-link them; don't duplicate content between them.

### 5.3 About page

Create `/about` with author credentials and a contact method. This is a real ranking input in YMYL finance categories, not decoration. Add `Person` + `Organization` schema. Link `AUTHOR.url` to it.

---

## Phase 6 — Sitemap, robots, verification

### 6.1 `app/sitemap.ts`

Generate from a single route registry rather than a hand-maintained list, so new pages can't be forgotten:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "", "/about", "/calculators",
    "/calculators/mortgage", "/calculators/mortgage-payoff",
    "/calculators/biweekly-mortgage", "/calculators/mortgage/compare",
    "/calculators/loan-amortization", "/calculators/car-loan",
    "/calculators/compound-interest", "/calculators/debt-snowball",
    "/calculators/debt-avalanche",
    // ...state pages, /learn pages
  ];
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
```

**Exclude** `/auth/login` and `/auth/signup` from the sitemap and add `robots: { index: false }` to their metadata.

Remove the old `/calculators/debt-payoff` entry.

### 6.2 `app/robots.ts`

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/auth/", "/api/"] }],
    sitemap: "https://finwiser.net/sitemap.xml",
  };
}
```

Note: the current sitemap is served with an encoding that some crawlers can't read cleanly. Verify the generated one returns `Content-Type: application/xml` and is fetchable as plain text.

### 6.3 Verification checklist

Run all of these before calling the work done:

- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] `curl -s https://localhost:3000/calculators/debt-snowball | grep -c 'application/ld+json'` returns ≥ 2 on every calculator page
- [ ] Every JSON-LD block parses: extract and run through `JSON.parse`
- [ ] Paste rendered HTML from 3 pages into Google's Rich Results Test — zero errors
- [ ] `curl -sI https://localhost:3000/calculators/debt-payoff` returns 308 with correct `Location`
- [ ] Exactly one `<h1>` per route
- [ ] No title over 60 chars, no description over 160 — assert programmatically across all routes
- [ ] `rg "TODO"` in `FAQ_ITEMS` arrays returns nothing before deploying
- [ ] `rg "debt-payoff"` returns only the `next.config.ts` redirect
- [ ] No internal links point to non-existent routes
- [ ] Lighthouse SEO score still 100 on 3 sampled pages

### 6.4 Post-deploy (manual, for the site owner)

Not code, but required for any of this to matter:

1. In Google Search Console, submit the updated sitemap
2. Use URL Inspection → "Request Indexing" on every changed page
3. Watch the Coverage report for the `debt-payoff` → `debt-snowball` redirect being processed

---

## Priority if time is limited

If you can only do part of this, do it in this order:

1. **Phase 2** — the debt-snowball rename (6,600/mo keyword, difficulty 12, one day of work)
2. **Phase 1.2–1.5 + Phase 4** — schema infrastructure and wiring (site currently has zero structured data)
3. **Phase 3** — title/H1/meta sweep (every title is currently truncated in search results)
4. **Phase 4.2** — contextual internal links
5. **Phase 5.2** — the `/calculators/mortgage-payoff` route (60,500/mo, competition index 4)
6. Everything else

---

## Things to explicitly NOT do

- **Don't build more state mortgage pages.** The six that exist (NC, SC, GA, FL, TX, VA) generate ~6 visits/month combined and dilute internal link equity. Programmatic state pages work after you have domain authority, not before. Leave them live, don't invest.
- **Don't add schema types that don't match visible content.** Fabricated `Review`, `AggregateRating`, or `FAQPage` markup without corresponding on-page content is a manual-action risk. Every schema field must reflect something a user can see.
- **Don't touch performance.** Lighthouse is already 100/100. Adding JSON-LD is a few KB of inline text and won't move it — but verify, don't assume.
- **Don't remove the "not financial advice" disclaimer.** It's a YMYL trust signal.
