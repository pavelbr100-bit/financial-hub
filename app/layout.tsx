import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: {
    default: 'FinWiser — Your finances, only wiser',
    template: '%s | FinWiser',
  },
  description:
    'Your finances, only wiser. Free loan, mortgage, and compound interest calculators — no signup required.',
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
  ],
  openGraph: {
    title: 'FinWiser — Your finances, only wiser',
    description: 'Your finances, only wiser.',
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
