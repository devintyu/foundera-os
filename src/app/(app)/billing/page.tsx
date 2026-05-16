"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Zap, Crown, Rocket, Loader2 } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    icon: Zap,
    features: [
      "50 AI calls/month",
      "Market research agent",
      "Offer builder agent",
      "Audience personas",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    popular: true,
    icon: Crown,
    features: [
      "500 AI calls/month",
      "10 Opus strategy sessions",
      "All agents unlocked",
      "Funnel architect",
      "Priority support",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 199,
    icon: Rocket,
    features: [
      "2,000 AI calls/month",
      "50 Opus strategy sessions",
      "Custom AI prompts",
      "Team collaboration",
      "Dedicated support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 499,
    icon: Crown,
    features: [
      "Unlimited AI calls",
      "Unlimited Opus sessions",
      "White-glove onboarding",
      "Custom integrations",
      "1-on-1 strategy calls",
    ],
  },
];

export default function BillingPage() {
  const [currentPlan] = useState("starter");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";

  async function handleUpgrade(planId: string) {
    try {
      setLoading(planId);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned:", data.error);
        setLoading(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(null);
    }
  }

  async function handleManageSubscription() {
    try {
      setLoading("portal");
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No portal URL returned:", data.error);
        setLoading(null);
      }
    } catch (error) {
      console.error("Portal error:", error);
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
          Billing
        </h1>
        <p className="mt-1 text-[#94A3B8]">
          Manage your subscription and usage
        </p>
      </div>

      {/* Success/Canceled Messages */}
      {success && (
        <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 p-4 text-sm text-[#10B981]">
          Your subscription has been activated! Welcome to your new plan.
        </div>
      )}
      {canceled && (
        <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm text-[#F59E0B]">
          Checkout was canceled. No changes were made to your subscription.
        </div>
      )}

      {/* Current Plan */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#94A3B8]">Current Plan</p>
            <p className="text-2xl font-bold text-[#F8FAFC]">
              Starter{" "}
              <span className="text-base font-normal text-[#94A3B8]">
                — $29/mo
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-medium text-[#10B981]">
              Active
            </div>
            {currentPlan !== "starter" && (
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={loading === "portal"}
                className="rounded-lg border border-[#1E1E2E] px-4 py-1.5 text-xs font-medium text-[#F8FAFC] transition-colors hover:border-[#00F0FF]/30 disabled:opacity-50"
              >
                {loading === "portal" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Manage Subscription"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Usage */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-[#94A3B8]">AI Calls</span>
              <span className="font-medium text-[#F8FAFC]">12 / 50</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#1E1E2E]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6]"
                style={{ width: "24%" }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-[#94A3B8]">Opus Sessions</span>
              <span className="font-medium text-[#F8FAFC]">0 / 0</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#1E1E2E]">
              <div className="h-full rounded-full bg-[#1E1E2E]" />
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Upgrade to Pro to unlock
            </p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setBillingPeriod("monthly")}
          className={`text-sm font-medium transition-colors ${
            billingPeriod === "monthly" ? "text-[#F8FAFC]" : "text-[#94A3B8]"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() =>
            setBillingPeriod(
              billingPeriod === "monthly" ? "yearly" : "monthly"
            )
          }
          className={`relative h-6 w-11 rounded-full transition-colors ${
            billingPeriod === "yearly" ? "bg-[#00F0FF]" : "bg-[#1E1E2E]"
          }`}
        >
          <div
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              billingPeriod === "yearly" ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod("yearly")}
          className={`text-sm font-medium transition-colors ${
            billingPeriod === "yearly" ? "text-[#F8FAFC]" : "text-[#94A3B8]"
          }`}
        >
          Yearly{" "}
          <span className="text-xs text-[#10B981]">Save 20%</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price =
            billingPeriod === "yearly"
              ? Math.round(plan.price * 0.8)
              : plan.price;
          const isCurrent = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 transition-all ${
                plan.popular
                  ? "border-[#00F0FF]/40 bg-[#00F0FF]/5 shadow-[0_0_48px_rgba(0,240,255,0.06)]"
                  : "border-[#1E1E2E] bg-[#12121A]/80"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-3 py-0.5 text-[10px] font-bold text-[#0A0A0F]">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
                <Icon className="h-5 w-5 text-[#00F0FF]" />
              </div>

              <h3 className="text-lg font-semibold text-[#F8FAFC]">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#F8FAFC]">
                  ${price}
                </span>
                <span className="text-[#94A3B8]">/mo</span>
              </div>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#10B981]" />
                    <span className="text-[#94A3B8]">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isCurrent || loading === plan.id}
                onClick={() => !isCurrent && handleUpgrade(plan.id)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  isCurrent
                    ? "border border-[#1E1E2E] text-[#94A3B8]"
                    : plan.popular
                      ? "bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] text-[#0A0A0F]"
                      : "border border-[#1E1E2E] text-[#F8FAFC] hover:border-[#00F0FF]/30"
                }`}
              >
                {loading === plan.id && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
