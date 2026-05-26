import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  metadataBase: new URL('https://finwiser.net'),
  title: {
    default: 'FinWiser — Free Financial Calculators for Mortgages, Loans & Investing',
    template: '%s | FinWiser',
  },
  description:
    'Free financial calculators for mortgages, loans, compound interest, and debt payoff. No signup required. Make smarter money decisions with FinWiser.',
  keywords: [
    'mortgage calculator',
    'loan amortization calculator',
    'free mortgage calculator',
    'loan payment calculator',
    'amortization schedule',
    'mortgage payment calculator',
    'extra payment mortgage calculator',
    'compare mortgage rates',
    'balloon loan calculator',
    'monthly payment calculator',
    '30 year mortgage calculator',
    '15 year mortgage calculator',
    'financial calculator',
    'how much house can I afford',
    'compound interest calculator',
    'debt payoff calculator',
  ],
  openGraph: {
    title: 'FinWiser — Free Financial Calculators',
    description: 'Free calculators for mortgages, loans, compound interest, and debt payoff. No signup required.',
    type: 'website',
    url: 'https://finwiser.net',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FinWiser — Free Financial Calculators' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinWiser — Free Financial Calculators',
    description: 'Free calculators for mortgages, loans, compound interest, and debt payoff. No signup required.',
    images: ['/og-image.png'],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {adSenseClient && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Navbar user={user ? { email: user.email } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
