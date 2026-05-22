import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

// Required for Cloudflare Pages local dev emulation
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages requires standalone output when using next-on-pages
  // The @cloudflare/next-on-pages CLI handles the actual compilation
}

export default nextConfig
