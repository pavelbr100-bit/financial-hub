'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'finwiser_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [advertising, setAdvertising] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
  }, [])

  function save(value: string) {
    localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
    setShowModal(false)
    window.dispatchEvent(new Event('finwiser_consent_updated'))
  }

  function savePreferences() {
    save(advertising ? 'all' : 'essential')
  }

  if (!visible) return null

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy-900 border-t border-navy-700 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-navy-300 text-sm leading-relaxed flex-1">
            We use cookies to serve ads and understand how our tools are used. See our{' '}
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium text-navy-300 border border-navy-600 hover:border-navy-400 hover:text-white rounded-lg transition-colors"
            >
              Manage Preferences
            </button>
            <button
              onClick={() => save('essential')}
              className="px-4 py-2 text-sm font-medium text-navy-300 border border-navy-600 hover:border-navy-400 hover:text-white rounded-lg transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={() => save('all')}
              className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-1">Cookie Preferences</h2>
            <p className="text-slate-500 text-sm mb-6">
              Choose which cookies you allow. Essential cookies are always active — they&apos;re required for the site to work.
            </p>

            <div className="space-y-1">
              {/* Essential */}
              <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-navy-900">Essential</p>
                  <p className="text-xs text-slate-500 mt-0.5">Required for the site to function correctly</p>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Always on
                </span>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-navy-900">Analytics</p>
                  <p className="text-xs text-slate-500 mt-0.5">Helps us understand how our tools are used</p>
                </div>
                <button
                  onClick={() => setAnalytics(v => !v)}
                  aria-pressed={analytics}
                  className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${analytics ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${analytics ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Advertising */}
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-semibold text-navy-900">Advertising</p>
                  <p className="text-xs text-slate-500 mt-0.5">Enables personalized ads via Google AdSense</p>
                </div>
                <button
                  onClick={() => setAdvertising(v => !v)}
                  aria-pressed={advertising}
                  className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${advertising ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${advertising ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
