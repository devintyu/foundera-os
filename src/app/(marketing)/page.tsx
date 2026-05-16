"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Search,
  Package,
  Users,
  Brain,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Market Intelligence",
    description:
      "AI-powered market research, competitor analysis, and opportunity scoring in minutes — not weeks.",
  },
  {
    icon: Package,
    title: "Offer Architect",
    description:
      "Build irresistible offers with AI positioning, pricing psychology, and conversion-optimized structure.",
  },
  {
    icon: Users,
    title: "Audience Intelligence",
    description:
      "Deep persona building — pain points, desires, objections, and emotional triggers mapped by AI.",
  },
  {
    icon: Brain,
    title: "Funnel Architect",
    description:
      "AI-designed sales funnels — traffic strategy, conversion optimization, and metrics benchmarks.",
  },
  {
    icon: BarChart3,
    title: "AI Copywriter",
    description:
      "Generate high-converting headlines, hooks, body copy, and CTAs for any channel — instantly.",
  },
  {
    icon: Brain,
    title: "Strategy Advisor",
    description:
      "Live Opus-level strategy sessions — diagnosis, bottleneck detection, and 90-day growth roadmaps.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$29",
    features: ["50 AI calls/month", "Market research", "Offer builder", "Audience personas"],
  },
  {
    name: "Pro",
    price: "$79",
    popular: true,
    features: [
      "500 AI calls/month",
      "10 Opus strategy sessions",
      "All agents unlocked",
      "Priority support",
    ],
  },
  {
    name: "Business",
    price: "$199",
    features: [
      "2,000 AI calls/month",
      "50 Opus strategy sessions",
      "Team collaboration",
      "Custom prompts",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8FAFC]">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
              <Zap className="h-4 w-4 text-[#00F0FF]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              FOUNDERA <span className="text-[#00F0FF]">OS</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00F0FF]/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/5 px-4 py-1.5 text-sm font-medium text-[#00F0FF]">
              <Zap className="h-3.5 w-3.5" />
              AI Founder Operating System
            </div>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            One person can now
            <br />
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              possess the power
            </span>
            <br />
            of a company.
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-[#94A3B8] md:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your AI command center — business strategist, market analyst, offer
            architect, and founder mentor. All in one platform.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-8 py-3.5 text-base font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_32px_rgba(0,240,255,0.3)]"
            >
              Start Building Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="rounded-xl border border-[#1E1E2E] px-8 py-3.5 text-base font-medium text-[#94A3B8] transition-colors hover:border-[#00F0FF]/30 hover:text-[#F8FAFC]"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Your AI{" "}
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
                Workforce
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-[#94A3B8]">
              Six AI systems working together to help you build, launch, and
              scale your business.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="glass-card group rounded-2xl p-8 transition-all duration-300 hover:border-[#00F0FF]/20 hover:shadow-[0_0_32px_rgba(0,240,255,0.06)]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
                    <Icon className="h-6 w-6 text-[#00F0FF]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="leading-relaxed text-[#94A3B8]">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[#1E1E2E] py-32">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Up and running in{" "}
            <span className="text-[#00F0FF]">5 minutes</span>
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Onboard",
                desc: "Answer 5 quick questions about your business, stage, and goals.",
              },
              {
                step: "02",
                title: "Blueprint",
                desc: "AI generates your Founder Blueprint — niche, positioning, offer ideas, and action plan.",
              },
              {
                step: "03",
                title: "Execute",
                desc: "Use your AI workforce to research markets, craft offers, and build your business.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00F0FF]/20 bg-[#00F0FF]/5 text-lg font-bold text-[#00F0FF]">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#94A3B8]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Simple{" "}
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-[#94A3B8]">
            Start free. Upgrade when your business demands it.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-[#00F0FF]/40 bg-[#00F0FF]/5 shadow-[0_0_48px_rgba(0,240,255,0.08)]"
                    : "border-[#1E1E2E] bg-[#12121A]/80"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-1 text-xs font-bold text-[#0A0A0F]">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="mb-1 text-lg font-semibold">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-[#94A3B8]">/mo</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-[#10B981]" />
                      <span className="text-[#94A3B8]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] text-[#0A0A0F]"
                      : "border border-[#1E1E2E] text-[#F8FAFC] hover:border-[#00F0FF]/30"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#1E1E2E] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
              <BarChart3 className="h-8 w-8 text-[#00F0FF]" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to build your empire?
          </h2>
          <p className="mb-8 text-lg text-[#94A3B8]">
            Join founders who are using AI to operate like a Fortune 500 company
            — as a team of one.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-10 py-4 text-lg font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]"
          >
            Start Free Today
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E2E] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#00F0FF]" />
            <span className="text-sm font-semibold">FOUNDERA OS</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            &copy; 2026 Foundera OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
