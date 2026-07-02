# FinWiser AdSense "Low Value Content" — Fix Playbook for Claude Code (v2)

Rewritten for the real stack per `CLAUDE.md`: **Next.js 15 App Router + TypeScript**,
deployed to **Cloudflare Workers via OpenNext**, Tailwind, Supabase. Articles are
**TSX files** (`app/learn/<slug>/page.tsx`) with metadata in **`lib/articles.ts`**
(the `ArticleMeta` interface is the schema — no MDX, no frontmatter, no zod). JSON-LD
is built in `components/ArticleLayout.tsx`. Sitemap is `app/sitemap.ts`. Redirects go
in `next.config` (NOT `public/_redirects` — that's a Cloudflare Pages feature and you're
on Workers).

Run phases **one at a time**, verify, commit, then continue. Deletion is destructive —
Phase 1 proposes a map for your approval before removing anything.

**Why it was rejected:** bulk near-duplicate articles, un-proofread drift between
`lib/articles.ts` and the TSX bodies (title/count/date mismatches), thin/duplicated
state-mortgage pages, and only an *org-level* author on YMYL finance content. We fix
all of it, then let the domain age ~4–6 weeks before resubmitting **once**.

---

## Phase 0 — Recon (change nothing)

> Read `CLAUDE.md`, then report — don't edit anything yet:
> 1. Print the full `articles[]` array from `lib/articles.ts`: for every entry, its
>    `slug`, `title`, `date`, `category`, `calculatorHref`. CLAUDE.md says there are
>    25 articles but the live Learn index only shows 14 — I need the complete list.
> 2. Print the `ArticleMeta` interface.
> 3. Show `components/ArticleLayout.tsx` — specifically how the H1/title, the date
>    byline (line ~90), and the three JSON-LD schemas (lines ~28–65) are built, and
>    where `author`/`publisher` come from.
> 4. Open `app/learn/mortgage-payoff-strategies/page.tsx` and show its H1 and intro
>    text, then compare to that slug's `title`/`date` in `lib/articles.ts`. I observed
>    the index card says "5 Ways… / May 12, 2026" but the rendered article says
>    "7 Strategies… / March 3, 2026" — find where that divergence comes from.
> 5. Show `next.config.*`, `app/sitemap.ts`, `app/robots.ts`, and confirm
>    `public/ads.txt` and any redirect config do/don't exist.
> 6. List the 6 state mortgage pages and how `StateMortgageCalculatorPage` differs (if
>    at all) per state via `lib/data/`.
> Summarize as a table I can scan.

---

## Phase 1 — Consolidate duplicates (highest impact; get my approval before deleting)

With 25 articles there are more duplicate clusters than the 14 I could see live. Build
the full map first, show me, then execute.

**Confirmed seed clusters** (from the 14 visible — extend these with the other ~11):

- **Mortgage payoff / extra payments / saving interest** → keep `mortgage-payoff-strategies`;
  fold in `extra-mortgage-payments-how-much-can-you-save`, `how-to-save-on-mortgage-interest`
- **Compound interest** → keep `compound-interest-guide`; fold in `what-is-compound-interest`
- **Avalanche vs snowball** → keep `debt-avalanche-vs-snowball`; fold in `avalanche-vs-snowball-debt-payoff`
- **Amortization (what it is)** → keep `what-is-amortization`; fold in `what-is-loan-amortization`
- Keep but **differentiate**: `mortgage-amortization-explained` (narrow: why interest is
  front-loaded), `debt-payoff-strategies` (broad toolkit, not the method comparison)
- Keep as distinct: `how-much-house-can-you-afford`, `15-year-vs-30-year-mortgage`,
  `fixed-vs-variable-interest-rate`

> Task: Enumerate all 25 articles and cluster them by topic. Using the seed clusters
> above as a starting point, produce a proposed consolidation map: for each cluster,
> pick ONE canonical survivor and list the slugs to merge+redirect into it. Aim to land
> around 9–12 genuinely distinct articles. **Do not delete anything yet** — output the
> proposed map as a table (Keep / Merge-into / one-line reason) and stop for my approval.

After I approve:

> Task: Execute the approved map. For each "merge" article:
> 1. Read loser + survivor; extract any net-new section/example/data point from the
>    loser into the survivor where it fits (don't pad).
> 2. Delete the loser's `app/learn/<slug>/page.tsx` and remove its entry from the
>    `articles[]` array in `lib/articles.ts`.
> 3. Differentiate `mortgage-amortization-explained` and `debt-payoff-strategies` so
>    they clearly don't repeat their canonical neighbors; have them link to those
>    instead of re-explaining.
> Then add the 301-class redirects. We're on Workers/OpenNext, so put them in
> `next.config` via the async `redirects()` function (Next's `permanent: true` returns
> 308, which Google treats like a 301 for consolidation — that's fine). Example shape:
>
> ```js
> // next.config.mjs
> async redirects() {
>   return [
>     { source: '/learn/extra-mortgage-payments-how-much-can-you-save', destination: '/learn/mortgage-payoff-strategies', permanent: true },
>     { source: '/learn/how-to-save-on-mortgage-interest',               destination: '/learn/mortgage-payoff-strategies', permanent: true },
>     { source: '/learn/what-is-compound-interest',                      destination: '/learn/compound-interest-guide',     permanent: true },
>     { source: '/learn/avalanche-vs-snowball-debt-payoff',              destination: '/learn/debt-avalanche-vs-snowball',  permanent: true },
>     { source: '/learn/what-is-loan-amortization',                      destination: '/learn/what-is-amortization',        permanent: true },
>     // + any additional pairs from the approved map
>   ];
> }
> ```
>
> Confirm OpenNext honors `next.config` redirects in this project (it should via the
> routing layer); if not, fall back to a Cloudflare Worker-level redirect. Finally,
> grep the repo for every deleted slug and fix stray internal links (Learn index,
> footer, sidebars, related-article links).

Verify: `npm run build` clean; deleted slugs redirect to canonicals; Learn index and
`app/sitemap.ts` reflect the reduced set; `grep -r` for dead slugs is clean outside the
redirect config.

---

## Phase 2 — Reconcile metadata drift + fix AI tells

`lib/articles.ts` and the TSX bodies have diverged (the `mortgage-payoff-strategies`
title/date mismatch is one confirmed case; the "7 strategies" title vs. 5 listed in the
body is another). Make `lib/articles.ts` the genuine single source of truth.

> Task: Audit every surviving article for internal consistency. For each:
> 1. Compare the `title` in `lib/articles.ts` to the H1/`<title>` actually rendered
>    (whether from `meta.title` or hardcoded in the `page.tsx` body). Make them
>    identical — prefer driving the H1 from `meta.title` so they can't drift again.
> 2. Compare any number in the title ("7 strategies") to the count actually present in
>    the body. Make them agree (fix the title or add the items).
> 3. Ensure the date renders from exactly one field (`meta.date`) everywhere — the card,
>    the byline, and JSON-LD `datePublished`. Remove any hardcoded date strings in
>    bodies. Confirm the index card and the article byline now show the SAME date for
>    every slug.
> 4. Fix orphaned "see below" references, mis-numbered H2 sequences, and any stat quoted
>    two different ways.
> Report each fix per article.

> Task (dates): Today is well into June 2026, so the old March–May "future" dates are
> now in the past and fine. But ensure NO article `date` is later than today, and where
> we edited an article in Phase 1–3, that's a real update — see Phase 4 for adding an
> `updated`/`dateModified` field rather than just bumping the original date.

Verify: spot-check 3 articles; card title = H1 = SEO title, counts match, one date
everywhere.

---

## Phase 3 — De-template so they don't look machine-stamped

The visible set shares one skeleton (shock-stat intro → numbered H2s → table → FAQ →
CTA). Uniformity across a burst is itself a low-value signal.

> Task: Reduce structural uniformity across the surviving articles without lowering
> quality:
> - At least 3 articles use a non-listicle structure (narrative explainer,
>   problem→worked-scenario→takeaway, or Q&A).
> - Vary intro style/length; not every article opens on a shock stat.
> - Tables only where they earn their place — not in every article.
> - Keep FAQ blocks only where questions are genuinely distinct; cut filler FAQs (and
>   remember the `FAQPage` JSON-LD is conditional on the `faq` prop, so dropping FAQs
>   should also drop that schema for those pages).
> - Add one original, non-generic element per article (a worked example deep-linked to
>   the matching calculator, a "common mistake" callout, or a realistic mini-case).
> Don't pad for word count. Report structural changes per article.

Verify: read 3 articles back-to-back — they read as written, not stamped.

---

## Phase 4 — Upgrade E-E-A-T (named author, not just org)

JSON-LD already has an org-level author/publisher. For YMYL finance, add a real named
Person and make authorship visible.

> Task 4a — Author model. In `lib/articles.ts` (or a small shared `lib/author.ts`),
> define a single author object: real name, short bio, optional credentials, optional
> profile link. Add optional `author` + `updated` (last-reviewed date string) fields to
> the `ArticleMeta` interface; default `author` to the site author. Backfill `updated`
> = today on every article we edited.

> Task 4b — Visible byline + bio. In `components/ArticleLayout.tsx`, render the author
> name and a "Published {date} · Last reviewed {updated}" line near the H1, plus a short
> author bio box at the foot of the article. Keep it on-brand.

> Task 4c — JSON-LD. Change the `BlogPosting` `author` from the org to a `Person`
> (named author), keep `publisher` as the FinWiser `Organization` (with logo), and set
> `dateModified` from `meta.updated` (falling back to `date`). Keep `datePublished` from
> `date`. Ensure valid JSON.

> Task 4d — About + Contact. Rewrite `/about` to name the real person/entity behind
> FinWiser, why it exists, how calculators are built and checked, and an editorial
> "informational, not financial advice" note. Add a real `/contact` route (email or
> simple form — Supabase is available if you want to store submissions). Link both from
> the footer; keep existing Privacy/Terms/How-it-works.

Verify: an article shows a named byline + last-reviewed date; About names a real
person/entity with a working contact path. After deploy, run an article through Google's
Rich Results Test — `Article` with `Person` author, no errors.

---

## Phase 5 — Calculator audit + fix the state-page duplication

Calculators already carry 150–390 lines of prose, so **don't bulk-add content** — audit
quality and kill the real duplication risk: the 6 config-driven state mortgage pages.

> Task 5a — Quality pass. For each of the 7 calculators + compare page, skim the prose:
> remove any boilerplate that's near-identical across pages, ensure each "how to read
> results / FAQ" section is page-specific, and confirm internal links point to the
> (now consolidated) Learn articles. Light touch — these are mostly fine.

> Task 5b — State pages (the risk). The 6 state mortgage pages render from one
> `StateMortgageCalculatorPage` template via `lib/data/`. Six near-identical pages read
> as templated thin content. For EACH state, make the page genuinely state-specific:
> real typical property-tax rate, common homeowners-insurance considerations, any
> state-specific closing-cost/transfer-tax quirks, and a state-relevant example. If a
> given state can't be made meaningfully unique, tell me and we'll redirect it to the
> main mortgage calculator (add to the Phase 1 redirect list) rather than ship a
> near-duplicate. Report, per state, "made distinct" or "recommend redirect."

Verify: state pages are clearly differentiated or flagged for redirect; no two
calculator pages share large identical prose blocks.

---

## Phase 6 — Keep thin/utility pages out of the review surface

> Task: In `app/sitemap.ts`, confirm only real content is emitted (Learn articles from
> `lib/articles.ts`, calculators, About, Contact, How-it-works, Privacy, Terms) and that
> auth routes (`app/auth/login`, `app/auth/signup`) and any internal/utility routes are
> NOT included. Add `export const metadata = { robots: { index: false, follow: false } }`
> (or the appropriate `robots` field) to the auth route segments so they're noindexed.
> Check `app/robots.ts` doesn't accidentally block content paths. Print the final list
> of URLs the sitemap will emit.

Verify: built sitemap contains content pages only; auth pages noindexed.

---

## Phase 7 — ads.txt

> Task: Create `public/ads.txt` with exactly:
>
> ```
> google.com, pub-5438252770961085, DIRECT, f08c47fec0942fa0
> ```
>
> Confirm it serves at `https://finwiser.net/ads.txt` after deploy. (Static files in
> `public/` are served at the site root by Next/OpenNext.)

Verify after deploy: `curl https://finwiser.net/ads.txt` returns that exact line.

---

## Phase 8 — Build, deploy, verify, then gate the resubmission

> Task: Run `npm run build` (and the OpenNext/wrangler build per this project's scripts),
> report warnings/errors, and confirm:
> - Article count reduced to the approved set; all build.
> - Card title = H1 = SEO title and a single consistent date for every article.
> - All redirects present in `next.config`.
> - Named-Person author byline + last-reviewed date render; About + Contact live.
> - State pages distinct or flagged for redirect.
> - `public/ads.txt` present; sitemap excludes auth; auth pages noindexed.
> - `grep` for deleted slugs clean outside redirect config.
> Output a full summary of every file added/changed/deleted across all phases.

**Manual steps (you, Pavel — not Claude Code):**
1. Deploy to Cloudflare Workers; verify live: `curl -I` a deleted slug → 308 to
   canonical; `ads.txt` resolves; articles show the named byline.
2. Run 2–3 articles through Google's **Rich Results Test** + **Mobile-Friendly** check.
3. In **Search Console**: submit the updated sitemap, request indexing on the
   consolidated canonicals, and confirm the redirected old URLs drop out over time.
4. **Wait ~4–6 weeks.** Let the domain age and pick up some real traffic (cross-link
   from your Five Minute Watch Reviews footer or anywhere legitimate). Reapplying after
   every edit trains AdSense against you.
5. Resubmit to AdSense **once**, when the checklist below is all green.

---

## Pre-resubmission checklist

- [ ] ~9–12 distinct articles; no two cover the same topic
- [ ] Every article: card title = H1 = SEO title; title count = body count; one date everywhere
- [ ] Named **Person** author byline + "last reviewed" date visible and in JSON-LD
- [ ] Article structures vary (not all listicles)
- [ ] About names a real person/entity; working Contact; "informational, not advice" note
- [ ] `Article` JSON-LD validates (Person author + Organization publisher + dates)
- [ ] Calculator prose de-boilerplated; 6 state pages genuinely distinct OR redirected
- [ ] Auth/thin pages excluded from sitemap and noindexed
- [ ] `public/ads.txt` live and correct
- [ ] All redirects verified live (308 → canonical); no internal links to dead slugs
- [ ] Domain aged a few weeks with some real visits

---

## Notes / realistic expectations

- Calculator + finance sites are a hard AdSense category, and a new domain in a YMYL
  niche compounds it. Depth + visible named authorship matter more than volume here.
- If a strong resubmission is still declined, **Ezoic** is a lower-bar stepping stone;
  **Mediavine/Raptive** are the higher-RPM goal once traffic grows.
- Update your CLAUDE.md content pipeline to require a human review + a dedup/consistency
  check (card-vs-body title, count, date) before any article ships, so you don't
  recreate the burst-of-near-duplicates pattern that caused this.
