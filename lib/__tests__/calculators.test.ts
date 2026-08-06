import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  calculators,
  calculatorCategories,
  stateCalculators,
  allCalculatorHrefs,
} from '../calculators'
import sitemap from '../../app/sitemap'

const APP_CALC_DIR = join(process.cwd(), 'app', 'calculators')

/**
 * Walk app/calculators and return every route that has a page.tsx, excluding the
 * hub index itself. This is the ground truth the registry must match.
 */
function routesOnDisk(): string[] {
  const found: string[] = []
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const nextDir = join(dir, entry.name)
      const route = `${prefix}/${entry.name}`
      if (existsSync(join(nextDir, 'page.tsx'))) found.push(route)
      walk(nextDir, route)
    }
  }
  walk(APP_CALC_DIR, '/calculators')
  return found.sort()
}

describe('calculator registry', () => {
  it('lists every calculator route that exists on disk', () => {
    const onDisk = routesOnDisk()
    const registered = allCalculatorHrefs().sort()
    const missing = onDisk.filter((r) => !registered.includes(r))
    expect(missing, `routes on disk but missing from lib/calculators.ts: ${missing}`).toEqual([])
  })

  it('does not list routes that have no page', () => {
    const onDisk = routesOnDisk()
    const orphans = allCalculatorHrefs().filter((r) => !onDisk.includes(r))
    expect(orphans, `registered routes with no page.tsx: ${orphans}`).toEqual([])
  })

  it('has no duplicate hrefs', () => {
    const hrefs = allCalculatorHrefs()
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('assigns every calculator to a rendered category', () => {
    for (const calc of calculators) {
      expect(calculatorCategories, `${calc.name} has an unrendered category`).toContain(
        calc.category
      )
    }
  })

  it('gives every category at least one calculator', () => {
    for (const category of calculatorCategories) {
      expect(calculators.some((c) => c.category === category), `${category} is empty`).toBe(true)
    }
  })

  it('gives every entry a name and a blurb that is not the name', () => {
    for (const calc of calculators) {
      expect(calc.name.length).toBeGreaterThan(0)
      expect(calc.blurb.length).toBeGreaterThan(20)
      expect(calc.blurb).not.toBe(calc.name)
    }
  })

  it('derives state entries from the state configs', () => {
    expect(stateCalculators.length).toBe(6)
    for (const state of stateCalculators) {
      expect(state.href).toMatch(/^\/calculators\/mortgage\/[a-z-]+$/)
      expect(state.note).toMatch(/^\d+(\.\d+)?% average property tax pre-loaded$/)
    }
  })
})

describe('sitemap', () => {
  it('includes every calculator route from the registry', () => {
    const urls = sitemap().map((e) => e.url)
    for (const href of allCalculatorHrefs()) {
      expect(urls, `sitemap is missing ${href}`).toContain(`https://finwiser.net${href}`)
    }
  })

  it('includes the calculators hub itself', () => {
    expect(sitemap().map((e) => e.url)).toContain('https://finwiser.net/calculators')
  })

  it('lists no URL twice', () => {
    const urls = sitemap().map((e) => e.url)
    const dupes = urls.filter((u, i) => urls.indexOf(u) !== i)
    expect(dupes, `duplicate sitemap URLs: ${dupes}`).toEqual([])
  })

  it('excludes auth and other noindexed routes', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls.some((u) => u.includes('/auth/'))).toBe(false)
    expect(urls.some((u) => u.includes('/saved'))).toBe(false)
  })
})
