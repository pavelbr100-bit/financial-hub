'use client'

import { useMemo, useSyncExternalStore } from 'react'

// The query string never changes without a navigation (which remounts the page),
// so there is nothing to subscribe to.
const subscribe = () => () => {}
const getSnapshot = () => window.location.search
const getServerSnapshot = () => null

/**
 * Returns the URL query params after hydration (`null` during prerendering and
 * hydration, then the real params).
 *
 * The site is a static export, so pages cannot read `searchParams` on the server.
 * Reading `window.location` through useSyncExternalStore keeps the prebuilt HTML
 * intact, avoids a hydration mismatch, and needs no Suspense boundary (unlike
 * `useSearchParams()`).
 */
export function useQueryParams(): Record<string, string> | null {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return useMemo(
    () => (search === null ? null : Object.fromEntries(new URLSearchParams(search))),
    [search],
  )
}
