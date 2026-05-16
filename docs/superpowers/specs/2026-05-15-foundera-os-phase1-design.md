# Foundera OS - Phase 1 MVP Architecture Spec

## Overview

Foundera OS is an AI Founder Operating System — a SaaS platform that helps entrepreneurs, freelancers, and SME owners build and operate AI One-Person Companies. It functions as an AI command center: business strategist, market analyst, offer architect, and founder mentor in one platform.

**Tagline:** "One person can now possess the power of a company."

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (latest) + TypeScript |
| Styling | TailwindCSS + ShadCN UI + Framer Motion |
| Auth + DB | Supabase (Auth + PostgreSQL + RLS) |
| AI (cheap) | OpenAI GPT-4o-mini — copywriting, hooks, headlines |
| AI (medium) | Claude Sonnet — market research, offers, audience analysis |
| AI (deep) | Claude Opus — founder strategy, business diagnosis |
| Payments | Stripe (subscriptions) |
| Hosting | Vercel |
| Analytics | PostHog |

## Database Schema

### profiles
Extends Supabase `auth.users`. Created via trigger on signup.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, references auth.users |
| full_name | text | |
| avatar_url | text | nullable |
| role | text | 'founder' default |
| founder_stage | text | explorer/builder/operator/scaler/owner |
| industry | text | nullable |
| experience_level | text | beginner/intermediate/advanced |
| revenue_stage | text | pre-revenue/early/growing/scaling |
| goals | text[] | array of goal strings |
| current_bottleneck | text | nullable |
| plan | text | starter/pro/business/elite, default 'starter' |
| onboarding_completed | boolean | default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### onboarding_responses
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| question_key | text | e.g. 'who_are_you', 'industry' |
| answer | jsonb | flexible answer storage |
| created_at | timestamptz | |

### founder_blueprints
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| niche_suggestions | jsonb | |
| business_model | jsonb | |
| positioning | jsonb | |
| offer_ideas | jsonb | |
| audience_strategy | jsonb | |
| funnel_recommendations | jsonb | |
| next_steps | jsonb | |
| created_at | timestamptz | |

### market_research
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| title | text | |
| industry | text | |
| niche | text | |
| opportunity_score | integer | 0-100 |
| report | jsonb | full AI-generated report |
| created_at | timestamptz | |

### offers
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| title | text | |
| description | text | |
| pricing | jsonb | price tiers, currency |
| target_audience | text | |
| value_proposition | text | |
| bonuses | jsonb | array of bonus items |
| guarantee | text | |
| funnel_type | text | webinar/landing/email/whatsapp |
| status | text | draft/active/archived |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### audience_personas
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| name | text | persona name |
| demographics | jsonb | age, location, income, etc. |
| psychographics | jsonb | values, lifestyle, etc. |
| pain_points | jsonb | array |
| desires | jsonb | array |
| objections | jsonb | array |
| emotional_triggers | jsonb | array |
| created_at | timestamptz | |

### ai_conversations
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| agent_type | text | market_researcher/copywriter/offer_builder/etc. |
| title | text | |
| messages | jsonb | array of {role, content, timestamp} |
| context | jsonb | injected user context |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### ai_outputs
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| agent_type | text | |
| output_type | text | report/copy/funnel/strategy |
| title | text | |
| content | jsonb | structured output |
| metadata | jsonb | tokens used, model, etc. |
| created_at | timestamptz | |

### subscriptions
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| stripe_customer_id | text | |
| stripe_subscription_id | text | |
| plan | text | starter/pro/business/elite |
| status | text | active/canceled/past_due |
| current_period_start | timestamptz | |
| current_period_end | timestamptz | |
| created_at | timestamptz | |

### usage_tracking
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK profiles |
| month | text | YYYY-MM format |
| ai_calls_count | integer | default 0 |
| tokens_used | integer | default 0 |
| updated_at | timestamptz | |

**RLS Policy:** All tables enforce `user_id = auth.uid()` for select/insert/update/delete.

## AI Agent Architecture

### Model Router (`lib/ai/router.ts`)
Central routing layer that:
- Determines which model to use based on agent type
- Injects user context from profile + onboarding
- Manages prompt caching (system prompts cached per agent)
- Tracks token usage in `usage_tracking`
- Enforces plan-based rate limits

### Agent Definitions

**OpenAI GPT-4o-mini (fast/cheap tasks):**
- Copywriter Agent — sales copy, email sequences, ad copy
- Hook Generator — attention-grabbing hooks for content
- Headline Generator — headlines for landing pages, ads
- Content Angle Generator — content ideas and angles

**Claude Sonnet (medium complexity):**
- Market Research Agent — industry analysis, opportunity scoring, competitor gaps
- Offer Builder Agent — offer structure, pricing, bonuses, guarantees
- Audience Analyst Agent — persona building, pain/desire mapping, objection analysis
- Funnel Architect Agent — funnel design, landing page copy, email sequences

**Claude Opus (deep strategy — usage-gated):**
- Founder Strategy Advisor — business diagnosis, strategic guidance
- Business Bottleneck Detector — identifies what's blocking growth
- Growth Roadmap Generator — 90-day action plans

### Agent Interface
Each agent implements:
```typescript
interface AIAgent {
  id: string;
  name: string;
  role: string;
  model: 'gpt-4o-mini' | 'claude-sonnet' | 'claude-opus';
  systemPrompt: string;
  outputSchema: z.ZodSchema;
  maxTokens: number;
}
```

### Usage Limits by Plan
| Plan | AI Calls/month | Opus Access |
|------|---------------|-------------|
| Starter ($29) | 50 | No |
| Pro ($79) | 500 | 10/month |
| Business ($199) | 2000 | 50/month |
| Elite ($499) | Unlimited | Unlimited |

## Folder Structure

```
foundera-os/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx            # App shell (sidebar + topbar)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── market/page.tsx
│   │   │   ├── offers/page.tsx
│   │   │   ├── audience/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── billing/page.tsx
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── market-research/route.ts
│   │   │   │   ├── offer-builder/route.ts
│   │   │   │   ├── audience-research/route.ts
│   │   │   │   ├── copywriter/route.ts
│   │   │   │   └── strategy/route.ts
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/route.ts
│   │   │   │   ├── portal/route.ts
│   │   │   │   └── webhook/route.ts
│   │   │   └── onboarding/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                       # ShadCN base components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── dashboard/
│   │   ├── market/
│   │   ├── offers/
│   │   ├── audience/
│   │   ├── onboarding/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts          # Auth middleware
│   │   ├── ai/
│   │   │   ├── router.ts             # Model routing + caching
│   │   │   ├── agents/               # Agent configs
│   │   │   │   ├── market-researcher.ts
│   │   │   │   ├── copywriter.ts
│   │   │   │   ├── offer-builder.ts
│   │   │   │   ├── audience-analyst.ts
│   │   │   │   ├── strategy-advisor.ts
│   │   │   │   └── types.ts
│   │   │   └── prompts/              # System prompts (cached)
│   │   │       ├── market-research.ts
│   │   │       ├── copywriting.ts
│   │   │       ├── offer-building.ts
│   │   │       ├── audience.ts
│   │   │       └── strategy.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useSubscription.ts
│   │   └── useAI.ts
│   └── types/
│       ├── database.ts
│       ├── ai.ts
│       └── index.ts
├── supabase/
│   ├── migrations/
│   └── config.toml
├── public/
├── docs/
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Onboarding Flow

5-step wizard → AI-generated Founder Blueprint:

1. **Who are you?** — name, role (dropdown: entrepreneur/freelancer/consultant/coach/creator/agency/educator/SME owner), experience level (beginner/intermediate/advanced)
2. **Your business** — industry (searchable dropdown), current business description (text), revenue stage (pre-revenue/early <$5k/mo/growing $5-50k/mo/scaling $50k+/mo)
3. **Your goals** — multi-select: build first offer, get more clients, automate operations, scale revenue, build personal brand, launch digital product, build AI workflows
4. **Your bottleneck** — single select: no clear offer, no audience, low traffic, poor conversion, no systems, pricing confusion, don't know where to start
5. **Generating Founder Blueprint** — animated loading → displays: niche suggestions, business model recommendation, positioning statement, offer ideas, audience strategy, funnel recommendation, next 3 action steps

## UI Design

- **Base:** `#0A0A0F` (near-black)
- **Surface:** `#12121A` (cards, sidebar)
- **Border:** `#1E1E2E` (subtle borders)
- **Accent primary:** `#00F0FF` (neon cyan)
- **Accent secondary:** `#8B5CF6` (purple)
- **Success:** `#10B981`
- **Warning:** `#F59E0B`
- **Text primary:** `#F8FAFC`
- **Text secondary:** `#94A3B8`
- **Glass cards:** `bg-white/5 backdrop-blur-xl border border-white/10`
- **Animations:** Framer Motion page transitions, hover effects, loading states

## Phase 1 MVP Scope

Build in this order:
1. Project setup (Next.js + Supabase + Tailwind + ShadCN)
2. Landing page (dark premium command center aesthetic)
3. Authentication (Supabase Auth — email + Google)
4. Onboarding wizard (5 steps → Founder Blueprint)
5. App shell (sidebar + topbar + mobile nav)
6. Dashboard (Founder GPS + stage detection + health score)
7. Market Intelligence (research agent interface)
8. Offer Architect (offer builder interface)
9. Audience Intelligence (persona builder interface)
10. Settings + Billing (Stripe integration)

## Phase 2 (future)
- AI Workforce Command Center
- Funnel Generator
- Strategy Dashboard
- Industry Playbooks
- Full billing with plan gating

## Phase 3 (future)
- Automation integrations
- CRM integrations
- Collaboration
- Marketplace
- White-label
