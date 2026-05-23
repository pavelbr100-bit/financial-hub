import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: {
    default: 'FinWiser — Free Financial Calculators',
    template: '%s | FinWiser',
  },
  description:
    'Free online financial calculators. Loan amortization, mortgage, compound interest and more — no signup required.',
  keywords: ['loan calculator', 'amortization', 'mortgage calculator', 'financial tools'],
  openGraph: {
    title: 'FinWiser — Free Financial Calculators',
    description: 'Free online financial calculators and tools.',
    type: 'website',
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
