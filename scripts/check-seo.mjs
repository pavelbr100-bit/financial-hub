#!/usr/bin/env node
/**
 * SEO regression guard.
 *
 * Boots nothing itself — point it at a running server (`npm run start` after
 * `npm run build`) and it crawls every URL in the sitemap, asserting the
 * invariants that are easy to break silently when editing metadata:
 *
 *   - <title> present and <= 60 chars (Google truncates around there)
 *   - <meta name="description"> present and <= 160 chars
 *   - a canonical that matches the URL actually being served
 *   - exactly one <h1>
 *   - every application/ld+json block parses as JSON
 *
 * Checking rendered HTML rather than parsing the source is deliberate: metadata
 * is assembled from template literals, `??` fallbacks in lib/articles.ts, and
 * generateStateMortgageMetadata(), so only the rendered output is authoritative.
 * Driving the list off the sitemap means new pages are covered automatically.
 *
 *   npm run check:seo                 # against http://localhost:3000
 *   BASE_URL=https://finwiser.net npm run check:seo
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const CANONICAL_ORIGIN = 'https://finwiser.net'
const MAX_TITLE = 60
const MAX_DESCRIPTION = 160

const decodeEntities = s =>
  s
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

async function main() {
  let sitemap
  try {
    const res = await fetch(`${BASE}/sitemap.xml`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    sitemap = await res.text()
  } catch (err) {
    console.error(`Could not fetch ${BASE}/sitemap.xml — is the server running?`)
    console.error(`  ${err.message}`)
    process.exit(2)
  }

  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => m[1].replace(CANONICAL_ORIGIN, ''))
    .map(p => (p === '' ? '/' : p))

  if (paths.length === 0) {
    console.error('Sitemap contained no <loc> entries — refusing to report success.')
    process.exit(2)
  }

  const failures = []

  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) {
      failures.push(`${path} — HTTP ${res.status}`)
      continue
    }
    const html = await res.text()

    const title = decodeEntities((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '')
    const description = decodeEntities(
      (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? ''
    )
    const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1] ?? ''
    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length

    const problems = []

    if (!title) problems.push('no <title>')
    else if (title.length > MAX_TITLE) problems.push(`title ${title.length} > ${MAX_TITLE} — "${title}"`)

    if (!description) problems.push('no meta description')
    else if (description.length > MAX_DESCRIPTION)
      problems.push(`description ${description.length} > ${MAX_DESCRIPTION}`)

    const expectedCanonical = `${CANONICAL_ORIGIN}${path === '/' ? '' : path}`
    if (!canonical) problems.push('no canonical')
    else if (canonical !== expectedCanonical)
      problems.push(`canonical is "${canonical}", expected "${expectedCanonical}"`)

    if (h1Count !== 1) problems.push(`${h1Count} <h1> elements, expected exactly 1`)

    for (const block of html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    )) {
      try {
        JSON.parse(block[1])
      } catch {
        problems.push('a JSON-LD block failed to parse')
        break
      }
    }

    if (problems.length) failures.push(`${path}\n    - ${problems.join('\n    - ')}`)
  }

  if (failures.length) {
    console.error(`\nSEO check FAILED — ${failures.length} of ${paths.length} routes:\n`)
    for (const f of failures) console.error(`  ${f}`)
    console.error('')
    process.exit(1)
  }

  console.log(`SEO check passed — ${paths.length} routes, all within limits.`)
}

main()
