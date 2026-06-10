'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'

const topUpPackages = [
  {
    id: 'small',
    credits: 1000,
    priceUSD: 10,
    priceMYR: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_SMALL_PRICE_ID,
    popular: false,
    savings: null as string | null,
  },
  {
    id: 'medium',
    credits: 3500,
    priceUSD: 29,
    priceMYR: 129,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_MEDIUM_PRICE_ID,
    popular: true,
    savings: '17% off',
  },
  {
    id: 'large',
    credits: 12000,
    priceUSD: 79,
    priceMYR: 359,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_LARGE_PRICE_ID,
    popular: false,
    savings: '24% off',
  },
  {
    id: 'premium',
    credits: 35000,
    priceUSD: 199,
    priceMYR: 899,
    priceId: process.env.NEXT_PUBLIC_STRIPE_TOPUP_PREMIUM_PRICE_ID,
    popular: false,
    savings: '43% off',
  },
]

export default function TopUpOptions() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleTopUp = async (priceId: string | undefined, credits: number, priceUSD: number) => {
    if (!priceId) {
      alert('Price ID not configured. Please check environment variables.')
      return
    }

    setLoading(priceId)

    try {
      const response = await fetch('/api/stripe/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, credits, amount: priceUSD }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to initiate top-up. Please try again.')
      }
    } catch (error) {
      console.error('Top-up error:', error)
      alert('Failed to initiate top-up. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Top Up Credits</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topUpPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-lg border p-6 transition-all hover:scale-105 ${
              pkg.popular
                ? 'border-[#00F0FF] shadow-lg shadow-[#00F0FF]/20'
                : 'border-[#1E1E2E] hover:border-[#94A3B8]/30'
            } bg-[#0A0A0F]`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00F0FF] px-3 py-0.5 text-xs font-bold text-black">
                MOST POPULAR
              </span>
            )}

            {pkg.savings && (
              <span className="absolute right-2 top-2 rounded-full bg-[#10B981]/20 px-2 py-0.5 text-[10px] font-medium text-[#10B981]">
                {pkg.savings}
              </span>
            )}

            <div className="mb-4 text-center">
              <Zap className="mx-auto mb-2 h-8 w-8 text-[#00F0FF]" />
              <p className="text-3xl font-bold text-white">{pkg.credits.toLocaleString()}</p>
              <p className="text-xs text-[#94A3B8]">Credits</p>
            </div>

            <div className="mb-4 text-center">
              <p className="text-2xl font-bold text-white">${pkg.priceUSD}</p>
              <p className="text-xs text-[#94A3B8]">or RM{pkg.priceMYR}</p>
            </div>

            <button
              onClick={() => handleTopUp(pkg.priceId, pkg.credits, pkg.priceUSD)}
              disabled={loading === pkg.priceId || !pkg.priceId}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                pkg.popular
                  ? 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90'
                  : 'border border-[#1E1E2E] text-[#F8FAFC] hover:bg-[#1E1E2E]'
              } disabled:opacity-50`}
            >
              {loading === pkg.priceId ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                'Top Up Now'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
