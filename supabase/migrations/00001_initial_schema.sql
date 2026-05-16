-- =============================================================================
-- Foundera OS: Initial Schema Migration
-- Creates all 10 core tables with RLS policies, triggers, and constraints
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id            uuid        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name     text        NOT NULL,
  avatar_url    text,
  role          text        NOT NULL DEFAULT 'founder',
  founder_stage text        NOT NULL CHECK (founder_stage IN ('explorer','builder','operator','scaler','owner')),
  industry      text,
  experience_level text     NOT NULL CHECK (experience_level IN ('beginner','intermediate','advanced')),
  revenue_stage text        NOT NULL CHECK (revenue_stage IN ('pre-revenue','early','growing','scaling')),
  goals         text[]      NOT NULL DEFAULT '{}',
  current_bottleneck text,
  plan          text        NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter','pro','business','elite')),
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. ONBOARDING_RESPONSES
-- ---------------------------------------------------------------------------
CREATE TABLE public.onboarding_responses (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_key text        NOT NULL,
  answer       jsonb       NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "onboarding_responses_select_own" ON public.onboarding_responses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "onboarding_responses_insert_own" ON public.onboarding_responses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "onboarding_responses_update_own" ON public.onboarding_responses
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "onboarding_responses_delete_own" ON public.onboarding_responses
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. FOUNDER_BLUEPRINTS
-- ---------------------------------------------------------------------------
CREATE TABLE public.founder_blueprints (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  niche_suggestions     jsonb,
  business_model        jsonb,
  positioning           jsonb,
  offer_ideas           jsonb,
  audience_strategy     jsonb,
  funnel_recommendations jsonb,
  next_steps            jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "founder_blueprints_select_own" ON public.founder_blueprints
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "founder_blueprints_insert_own" ON public.founder_blueprints
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "founder_blueprints_update_own" ON public.founder_blueprints
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "founder_blueprints_delete_own" ON public.founder_blueprints
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. MARKET_RESEARCH
-- ---------------------------------------------------------------------------
CREATE TABLE public.market_research (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  industry          text        NOT NULL,
  niche             text        NOT NULL,
  opportunity_score integer     NOT NULL CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
  report            jsonb       NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "market_research_select_own" ON public.market_research
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "market_research_insert_own" ON public.market_research
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "market_research_update_own" ON public.market_research
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "market_research_delete_own" ON public.market_research
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 5. OFFERS
-- ---------------------------------------------------------------------------
CREATE TABLE public.offers (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             text        NOT NULL,
  description       text        NOT NULL,
  pricing           jsonb       NOT NULL,
  target_audience   text        NOT NULL,
  value_proposition text        NOT NULL,
  bonuses           jsonb,
  guarantee         text,
  funnel_type       text        NOT NULL CHECK (funnel_type IN ('webinar','landing','email','whatsapp')),
  status            text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_select_own" ON public.offers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "offers_insert_own" ON public.offers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "offers_update_own" ON public.offers
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "offers_delete_own" ON public.offers
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 6. AUDIENCE_PERSONAS
-- ---------------------------------------------------------------------------
CREATE TABLE public.audience_personas (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name               text        NOT NULL,
  demographics       jsonb,
  psychographics     jsonb,
  pain_points        jsonb,
  desires            jsonb,
  objections         jsonb,
  emotional_triggers jsonb,
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audience_personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audience_personas_select_own" ON public.audience_personas
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "audience_personas_insert_own" ON public.audience_personas
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "audience_personas_update_own" ON public.audience_personas
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "audience_personas_delete_own" ON public.audience_personas
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. AI_CONVERSATIONS
-- ---------------------------------------------------------------------------
CREATE TABLE public.ai_conversations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_type  text        NOT NULL,
  title       text        NOT NULL,
  messages    jsonb       NOT NULL DEFAULT '[]'::jsonb,
  context     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_conversations_select_own" ON public.ai_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ai_conversations_insert_own" ON public.ai_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_conversations_update_own" ON public.ai_conversations
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_conversations_delete_own" ON public.ai_conversations
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 8. AI_OUTPUTS
-- ---------------------------------------------------------------------------
CREATE TABLE public.ai_outputs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_type  text        NOT NULL,
  output_type text        NOT NULL CHECK (output_type IN ('report','copy','funnel','strategy')),
  title       text        NOT NULL,
  content     jsonb       NOT NULL,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_outputs_select_own" ON public.ai_outputs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ai_outputs_insert_own" ON public.ai_outputs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_outputs_update_own" ON public.ai_outputs
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_outputs_delete_own" ON public.ai_outputs
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 9. SUBSCRIPTIONS
-- ---------------------------------------------------------------------------
CREATE TABLE public.subscriptions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  plan                    text        NOT NULL DEFAULT 'starter',
  status                  text        NOT NULL DEFAULT 'active',
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX subscriptions_stripe_customer_id_key
  ON public.subscriptions (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_key
  ON public.subscriptions (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "subscriptions_insert_own" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions_update_own" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions_delete_own" ON public.subscriptions
  FOR DELETE USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 10. USAGE_TRACKING
-- ---------------------------------------------------------------------------
CREATE TABLE public.usage_tracking (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month          text        NOT NULL,
  ai_calls_count integer     NOT NULL DEFAULT 0,
  tokens_used    integer     NOT NULL DEFAULT 0,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.usage_tracking
  ADD CONSTRAINT usage_tracking_user_month_unique UNIQUE (user_id, month);

CREATE POLICY "usage_tracking_select_own" ON public.usage_tracking
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "usage_tracking_insert_own" ON public.usage_tracking
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "usage_tracking_update_own" ON public.usage_tracking
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "usage_tracking_delete_own" ON public.usage_tracking
  FOR DELETE USING (user_id = auth.uid());

-- =============================================================================
-- TRIGGER FUNCTIONS
-- =============================================================================

-- Auto-update updated_at column --------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on sign-up -------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    founder_stage,
    experience_level,
    revenue_stage
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'explorer',
    'beginner',
    'pre-revenue'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
