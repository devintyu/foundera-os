-- =============================================================================
-- Fix: Insert plan data + create missing tables
-- =============================================================================

-- 1. Seed plan data
INSERT INTO public.plans (id, name, monthly_price_usd, monthly_price_myr, monthly_ai_credits, monthly_gemini_tokens, monthly_claude_tokens, max_agents, max_workspaces, allow_claude_strategy, allow_deep_thinking) VALUES
  ('starter',    'Starter',    29,   129,  1000,   1000000,   50000,   5,  1, false, false),
  ('pro',        'Pro',        79,   359,  4000,   5000000,  250000,  15,  3, true,  false),
  ('business',   'Agency',    199,   899, 12000,  20000000, 1000000,  50, 10, true,  true),
  ('elite',      'Enterprise', 499, 2299, 50000, 100000000, 5000000, 999, 999, true, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create ai_usage_logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id          text,
  task_type         text        NOT NULL,
  model_used        text        NOT NULL,
  input_tokens      integer     NOT NULL DEFAULT 0,
  output_tokens     integer     NOT NULL DEFAULT 0,
  total_tokens      integer     NOT NULL DEFAULT 0,
  estimated_cost_usd numeric(10,6) NOT NULL DEFAULT 0,
  credit_deducted   integer     NOT NULL DEFAULT 0,
  source            text        DEFAULT 'api',
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage_logs' AND policyname = 'ai_usage_logs_select_own') THEN
    CREATE POLICY "ai_usage_logs_select_own" ON public.ai_usage_logs FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage_logs' AND policyname = 'ai_usage_logs_insert_own') THEN
    CREATE POLICY "ai_usage_logs_insert_own" ON public.ai_usage_logs FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_usage_logs' AND policyname = 'ai_usage_logs_admin_select') THEN
    CREATE POLICY "ai_usage_logs_admin_select" ON public.ai_usage_logs FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_created ON public.ai_usage_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model ON public.ai_usage_logs (model_used, created_at DESC);

-- 3. Create topup_transactions table
CREATE TABLE IF NOT EXISTS public.topup_transactions (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_id   text,
  topup_package_name  text        NOT NULL,
  amount_usd          numeric(10,2) NOT NULL,
  amount_myr          numeric(10,2) NOT NULL DEFAULT 0,
  ai_credits_added    integer     NOT NULL,
  status              text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.topup_transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topup_transactions' AND policyname = 'topup_transactions_select_own') THEN
    CREATE POLICY "topup_transactions_select_own" ON public.topup_transactions FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topup_transactions' AND policyname = 'topup_transactions_insert_own') THEN
    CREATE POLICY "topup_transactions_insert_own" ON public.topup_transactions FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topup_transactions' AND policyname = 'topup_transactions_admin_select') THEN
    CREATE POLICY "topup_transactions_admin_select" ON public.topup_transactions FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_topup_transactions_user ON public.topup_transactions (user_id, created_at DESC);

-- 4. Ensure the auto-create trigger exists
CREATE OR REPLACE FUNCTION public.handle_new_user_ai_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_ai_balances (user_id, plan_id)
  VALUES (NEW.id, COALESCE(NEW.plan, 'starter'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_ai_balance ON public.profiles;
CREATE TRIGGER on_profile_created_ai_balance
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_ai_balance();
