/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` writes plain HTML/JS/RSC files to out/, which
  // Cloudflare serves as Workers static assets. No Worker script runs for any
  // request — static asset requests are free, unlimited, and use no CPU time.
  //
  // Consequences of static export:
  //  - No server code at request time: no cookies(), headers(), searchParams,
  //    middleware, route handlers or server actions. Auth is client-side.
  //  - next.config `redirects()` / `headers()` are not applied. Redirects live in
  //    public/_redirects and headers in public/_headers (Cloudflare reads both).
  output: 'export',
}

export default nextConfig
