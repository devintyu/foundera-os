export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: "founder" | "admin";
  founder_stage: "explorer" | "builder" | "operator" | "scaler" | "owner";
  industry: string | null;
  experience_level: "beginner" | "intermediate" | "advanced";
  revenue_stage: "pre_revenue" | "early" | "growing" | "scaling";
  goals: string[];
  current_bottleneck: string | null;
  plan: "starter" | "pro" | "business" | "elite";
  preferred_language: "en" | "zh";
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface FounderBlueprint {
  id: string;
  user_id: string;
  niche_suggestions: Record<string, unknown>;
  business_model: Record<string, unknown>;
  positioning: Record<string, unknown>;
  offer_ideas: Record<string, unknown>;
  audience_strategy: Record<string, unknown>;
  funnel_recommendations: Record<string, unknown>;
  next_steps: Record<string, unknown>;
  created_at: string;
}

export interface MarketResearch {
  id: string;
  user_id: string;
  title: string;
  industry: string;
  niche: string;
  opportunity_score: number;
  report: Record<string, unknown>;
  created_at: string;
}

export interface Offer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  pricing: Record<string, unknown>;
  target_audience: string;
  value_proposition: string;
  bonuses: Record<string, unknown>;
  guarantee: string;
  funnel_type: "webinar" | "landing" | "email" | "whatsapp";
  status: "draft" | "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface AudiencePersona {
  id: string;
  user_id: string;
  name: string;
  demographics: Record<string, unknown>;
  psychographics: Record<string, unknown>;
  pain_points: string[];
  desires: string[];
  objections: string[];
  emotional_triggers: string[];
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  agent_type: string;
  title: string;
  messages: { role: string; content: string; timestamp: string }[];
  context: Record<string, unknown>;
  detected_language: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: "starter" | "pro" | "business" | "elite";
  status: "active" | "canceled" | "past_due";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  month: string;
  ai_calls_count: number;
  tokens_used: number;
  updated_at: string;
}
