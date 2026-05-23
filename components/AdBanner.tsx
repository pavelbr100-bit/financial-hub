'use client'

// Replace data-ad-* attributes with your real AdSense values once approved.
// Set NEXT_PUBLIC_ADSENSE_CLIENT in your .env.local to your ca-pub-XXXXXXXXXXXXXXXX id.

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

export default function AdBanner({ slot, format = 'horizontal', className = '' }: AdBannerProps) {
  const isProduction = process.env.NODE_ENV === 'production'
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

  if (!clientId) return null

  if (isProduction && clientId) {
    // Live AdSense unit — script tag is loaded once in layout.tsx <head>
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

  // Development / staging placeholder
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
