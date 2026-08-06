# FinWiser — SEO & AdSense Remediation Tasks

Instructions for Claude Code. Work through tasks in order. After each task, list the files changed and stop for my confirmation before continuing.

**IMPORTANT — DO NOT VALIDATE OR RE-DERIVE CALCULATIONS.** All corrected figures below were verified externally against standard amortization. Use the exact numbers provided verbatim. Do not recompute, "double-check," or adjust them. A reference script exists at `scripts/verify-article-math.mjs` — do not run it or modify it as part of these tasks.

---

## Task 1 — Fix math errors in `learn/mortgage-payoff-strategies` (HIGHEST PRIORITY)

This article was the basis of the prior AdSense "low value content" rejection risk. Apply these exact text corrections in the article TSX file:

### 1a. Intro paragraph
- Current: "you'll pay over $420,000 in interest alone"
- Change to: "you'll pay nearly $420,000 in interest alone"

### 1b. Strategy 1 example ("One Extra Payment Per Year")
- Current: "adding $244/month (one-twelfth of the monthly payment) cuts the loan to roughly 24 years and saves approximately $85,000 in total interest."
- Change to: "adding $184/month (one-twelfth of the $2,212 monthly payment) cuts the loan to roughly 24 years and saves approximately $102,000 in total interest."

### 1c. Strategy 3 example ("Round Up Your Monthly Payment")
- Current: "paying an extra $100/month cuts the term by about 4 years and saves roughly $44,000 in interest."
- Change to: "paying an extra $100/month cuts the term by about 4 years and saves roughly $69,000 in interest."

### 1d. Strategy 5 ("Refinance to a Shorter Term")
- Current: "you'll pay roughly $190,000 less in total interest"
- Change to: "you'll pay roughly $248,000 less in total interest"
- The payment figures in this section ($2,000 and $2,613) are correct — leave them.

### 1e. FAQ: "Do biweekly mortgage payments really save money?"
- Current: "biweekly payments typically save $40,000 to $50,000 in interest and pay off the loan 4 to 5 years earlier than scheduled."
- Change to: "biweekly payments typically save around $100,000 in interest and pay off the loan about 6 years earlier than scheduled."
- This also makes the FAQ consistent with Strategy 2 of the same article.

### 1f. Strategy table at the bottom
Update the "Biweekly payments" and "One extra payment per year" rows if their ranges now conflict with the corrected examples above. Both rows should read **"$50,000–$100,000+"** for typical interest saved. Leave all other rows unchanged.

Do NOT touch: the recast example (~$300/mo drop), the PMI example (~3 years / ~$35,000), or any other numbers in this article. They are verified correct.

Also bump the "Reviewed" date on this article to today's date.

---

## Task 2 — Add missing metadata to state mortgage pages and /learn index

**Problem:** The state mortgage calculator pages (e.g. `/calculators/mortgage/north-carolina`) and the `/learn` index page render with NO meta description, NO canonical, NO Open Graph tags, NO robots directive, and NO google-adsense-account meta. Only `<title>` and viewport are present. The homepage, article pages, and About page have full metadata — so a shared metadata helper likely already exists; these routes just don't use it.

**Fix:**
1. Locate the route files for the state pages (likely a dynamic `[state]` segment or six static routes) and `/learn/page.tsx`.
2. Add `generateMetadata` (or a static `metadata` export) to each, producing the same metadata shape as the article pages:
   - Unique `description` per state page (mention the state name and its pre-loaded property tax rate — e.g. "Free North Carolina mortgage calculator with NC's 0.77% average property tax rate pre-loaded...")
   - `alternates.canonical` → exact URL with no trailing slash, matching site-wide convention (e.g. `https://finwiser.net/calculators/mortgage/north-carolina`)
   - Full OG + Twitter card tags (reuse the existing og-image.png), `og:type: website`
   - robots: `index, follow` with the same googlebot directives used on the homepage
   - The `google-adsense-account` meta tag, same as other pages
3. Do the same for `/learn` index: description summarizing the guide library, canonical `https://finwiser.net/learn`, OG/Twitter tags, robots, adsense meta.
4. Check `/calculators/mortgage` (main calculator): it has description/OG but appears to be **missing a canonical tag**. Add it. Audit the other five calculator pages for the same gap and fix any that are missing canonicals.

---

## Task 3 — De-duplicate FAQ answers on all six state pages

**Problem:** State page FAQ answers copy sentences verbatim from the page body. On the NC page, one FAQ answer even contains the same sentence twice back-to-back:

> "The average effective property tax rate in North Carolina is approximately 0.77% of assessed home value per year. North Carolina's average effective property tax rate is 0.77%, well below the national average of 1.1%..."

This duplicated/templated text is exactly the "low value content" pattern AdSense flags.

**Fix for all six states (NC, SC, GA, FL, TX, VA):**
1. Remove any sentence that appears twice within the same FAQ answer.
2. Rewrite each FAQ answer so it does not repeat body copy verbatim. The answer should be self-contained and phrased differently — same facts, different sentences. Keep each answer 2–4 sentences.
3. Do not change any tax rates, home prices, program names, or dollar figures — facts stay identical, only phrasing changes.

---

## Task 4 — Remove the meta-keywords tag site-wide

The same 16-term keyword list is emitted on every page, including terms for calculators that don't exist on the site ("balloon loan calculator"). Google ignores meta keywords and a duplicated stuffed list reads as spam to a human AdSense reviewer.

**Fix:** Find where `keywords` is set in the metadata config (likely a shared layout or metadata helper) and remove it entirely from all pages. Do not replace it with per-page keywords — just delete it.

---

## Task 5 — Investigate stale build/cache on `/calculators/mortgage`

The live `/calculators/mortgage` page is serving an OLD footer: no State Calculators section, no Biweekly Mortgage link, no About/Contact links. Every other page serves the current footer.

**Fix:**
1. Confirm the footer is a shared component imported by the mortgage calculator page (not a stale copy local to that route). If the route has its own hardcoded footer, replace it with the shared component.
2. If the code is already correct, this is a Cloudflare cache issue — note it in your summary and remind me to purge the Cloudflare Workers/CDN cache after deploy. Do not attempt to purge cache yourself.

---

## Task 6 — Verify crawl/monetization files exist

Confirm these exist in the project and are served at the root. Create or fix any that are missing:

1. `robots.txt` — allows all, references the sitemap.
2. `sitemap.xml` — includes all calculator pages, all six state pages, /learn, all 13 articles, /about, /contact, /how-it-works. Exclude /auth/* and /privacy, /terms can be included.
3. `ads.txt` — must contain exactly:
   ```
   google.com, pub-5438252770961085, DIRECT, f08c47fec0942fa0
   ```

---

## Task 7 — Final summary

When all tasks are done, output:
- A file-by-file change list
- Anything you could not complete and why
- A reminder checklist for me: deploy, purge Cloudflare cache, spot-check the NC page + /learn metadata in view-source, run the Rich Results Test on one state page and one article, then resubmit AdSense after the aging window.

**Reminder: at no point recompute or sanity-check the financial figures. Apply the numbers in Task 1 exactly as written.**
