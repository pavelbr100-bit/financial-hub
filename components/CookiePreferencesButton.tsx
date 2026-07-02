'use client'

export default function CookiePreferencesButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('finwiser_open_preferences'))}
      className="text-navy-500 hover:text-navy-300 text-xs transition-colors"
    >
      Cookie Preferences
    </button>
  )
}
