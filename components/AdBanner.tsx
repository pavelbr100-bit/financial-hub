'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'horizontal' | 'rectangle' | 'vertical'
  className?: string
}

const formatClass: Record<string, string> = {
  horizontal: 'h-[90px] w-full',
  rectangle:  'h-[250px] w-full max-w-[300px]',
  vertical:   'h-[600px] w-[160px]',
}

declare global {
  interface Window { adsbygoogle: unknown[] }
}

type ConsentLevel = 'personalized' | 'nonPersonalized' | 'pending'

function getConsentLevel(): ConsentLevel {
  const val = localStorage.getItem('finwiser_consent')
  if (val === 'all') return 'personalized'
  if (val === 'analytics' || val === 'essential') return 'nonPersonalized'
  return 'pending'
}

export default function AdBanner({ slot, format = 'horizontal', className = '' }: AdBannerProps) {
  const isProduction = process.env.NODE_ENV === 'production'
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const pushed = useRef(false)

  useEffect(() => {
    if (!isProduction || !clientId) return

    function tryPush() {
      if (pushed.current) return
      const level = getConsentLevel()
      if (level === 'pending') return
      try {
        pushed.current = true
        const pushArg = level === 'nonPersonalized' ? { params: { google_npa: '1' } } : {}
        ;(window.adsbygoogle = window.adsbygoogle || []).push(pushArg)
      } catch {}
    }

    tryPush()
    window.addEventListener('finwiser_consent_updated', tryPush)
    return () => window.removeEventListener('finwiser_consent_updated', tryPush)
  }, [isProduction, clientId])

  if (!clientId) return null

  if (isProduction && clientId) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Development placeholder
  return (
    <div
      className={`
        flex items-center justify-center border-2 border-dashed border-slate-300
        bg-slate-50 rounded-lg text-slate-400 text-xs font-medium tracking-wide
        ${formatClass[format]} ${className}
      `}
    >
      <span>AdSense Banner — slot: {slot}</span>
    </div>
  )
}
