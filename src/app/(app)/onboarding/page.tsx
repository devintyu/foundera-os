"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  Briefcase,
  Target,
  AlertTriangle,
  Rocket,
  Check,
  Search,
  Lightbulb,
  TrendingUp,
  Megaphone,
  Zap,
  BookOpen,
  Bot,
  Package,
  Users,
  Globe,
  BarChart3,
  Settings,
  DollarSign,
  HelpCircle,
  ArrowRight,
  MapPin,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface OnboardingData {
  fullName: string;
  role: string;
  experienceLevel: string;
  industry: string;
  businessDescription: string;
  revenueStage: string;
  goals: string[];
  bottleneck: string;
}

interface Blueprint {
  niche_suggestions: string[];
  business_model: string;
  positioning: string;
  offer_ideas: string[];
  audience_strategy: string;
  funnel_recommendations: string;
  next_steps: string[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "Who are you?", icon: User },
  { label: "Your business", icon: Briefcase },
  { label: "Your goals", icon: Target },
  { label: "Your bottleneck", icon: AlertTriangle },
  { label: "Blueprint", icon: Rocket },
];

const ROLES = [
  "entrepreneur",
  "freelancer",
  "consultant",
  "coach",
  "creator",
  "agency",
  "educator",
  "SME owner",
];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Just getting started",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Seasoned professional",
  },
];

const INDUSTRIES = [
  "technology",
  "health",
  "finance",
  "education",
  "ecommerce",
  "marketing",
  "real estate",
  "food",
  "fitness",
  "consulting",
  "coaching",
  "creative",
  "other",
];

const REVENUE_STAGES = [
  { value: "pre-revenue", label: "Pre-revenue", description: "Not earning yet" },
  { value: "early", label: "Early", description: "<$5k/mo" },
  { value: "growing", label: "Growing", description: "$5-50k/mo" },
  { value: "scaling", label: "Scaling", description: "$50k+/mo" },
];

const GOALS = [
  { value: "Build first offer", icon: Package },
  { value: "Get more clients", icon: Users },
  { value: "Automate operations", icon: Settings },
  { value: "Scale revenue", icon: TrendingUp },
  { value: "Build personal brand", icon: Megaphone },
  { value: "Launch digital product", icon: Rocket },
  { value: "Build AI workflows", icon: Bot },
];

const BOTTLENECKS = [
  { value: "No clear offer", icon: Package },
  { value: "No audience", icon: Users },
  { value: "Low traffic", icon: Globe },
  { value: "Poor conversion", icon: BarChart3 },
  { value: "No systems", icon: Settings },
  { value: "Pricing confusion", icon: DollarSign },
  { value: "Don't know where to start", icon: HelpCircle },
];

const LOADING_MESSAGES = [
  "Analyzing your profile...",
  "Researching your market...",
  "Crafting your strategy...",
  "Building your blueprint...",
];

/* ------------------------------------------------------------------ */
/*  Shared input classes                                               */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-3 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/25";

const selectClass =
  "w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition-colors focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/25 appearance-none cursor-pointer";

/* ------------------------------------------------------------------ */
/*  Step Components                                                    */
/* ------------------------------------------------------------------ */

function StepWhoAreYou({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">Who are you?</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Tell us a bit about yourself so we can personalize your experience.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
          Full name
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      {/* Role */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
          What best describes you?
        </label>
        <div className="relative">
          <select
            value={data.role}
            onChange={(e) => onChange({ role: e.target.value })}
            className={selectClass}
          >
            <option value="">Select your role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#94A3B8]" />
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="mb-3 block text-sm font-medium text-[#F8FAFC]">
          Experience level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {EXPERIENCE_LEVELS.map((lvl) => (
            <button
              key={lvl.value}
              type="button"
              onClick={() => onChange({ experienceLevel: lvl.value })}
              className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                data.experienceLevel === lvl.value
                  ? "border-[#00F0FF]/60 bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.08)]"
                  : "border-[#1E1E2E] bg-[#12121A]/60 hover:border-[#1E1E2E]/80 hover:bg-[#12121A]"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  data.experienceLevel === lvl.value
                    ? "text-[#00F0FF]"
                    : "text-[#F8FAFC]"
                }`}
              >
                {lvl.label}
              </p>
              <p className="mt-0.5 text-xs text-[#94A3B8]">
                {lvl.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepYourBusiness({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const [industrySearch, setIndustrySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = INDUSTRIES.filter((i) =>
    i.toLowerCase().includes(industrySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">Your business</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Help us understand your business so we can craft the right strategy.
        </p>
      </div>

      {/* Industry (searchable dropdown) */}
      <div className="relative">
        <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
          Industry
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={industrySearch || data.industry}
            onChange={(e) => {
              setIndustrySearch(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) onChange({ industry: "" });
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search industry..."
            className={`${inputClass} pl-10`}
          />
        </div>
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-[#1E1E2E] bg-[#12121A] shadow-xl">
            {filtered.map((ind) => (
              <button
                key={ind}
                type="button"
                onMouseDown={() => {
                  onChange({ industry: ind });
                  setIndustrySearch("");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#00F0FF]/10 ${
                  data.industry === ind
                    ? "text-[#00F0FF]"
                    : "text-[#F8FAFC]"
                }`}
              >
                {ind.charAt(0).toUpperCase() + ind.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Business Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
          Describe your business (or idea)
        </label>
        <textarea
          value={data.businessDescription}
          onChange={(e) => onChange({ businessDescription: e.target.value })}
          placeholder="What does your business do? Who do you serve? What problem do you solve?"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Revenue Stage */}
      <div>
        <label className="mb-3 block text-sm font-medium text-[#F8FAFC]">
          Revenue stage
        </label>
        <div className="grid grid-cols-2 gap-3">
          {REVENUE_STAGES.map((stage) => (
            <button
              key={stage.value}
              type="button"
              onClick={() => onChange({ revenueStage: stage.value })}
              className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                data.revenueStage === stage.value
                  ? "border-[#00F0FF]/60 bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.08)]"
                  : "border-[#1E1E2E] bg-[#12121A]/60 hover:border-[#1E1E2E]/80 hover:bg-[#12121A]"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  data.revenueStage === stage.value
                    ? "text-[#00F0FF]"
                    : "text-[#F8FAFC]"
                }`}
              >
                {stage.label}
              </p>
              <p className="mt-0.5 text-xs text-[#94A3B8]">
                {stage.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepYourGoals({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const toggle = (goal: string) => {
    const goals = data.goals.includes(goal)
      ? data.goals.filter((g) => g !== goal)
      : [...data.goals, goal];
    onChange({ goals });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">Your goals</h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Select all that apply. We will prioritize these in your blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOALS.map((goal) => {
          const Icon = goal.icon;
          const selected = data.goals.includes(goal.value);
          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggle(goal.value)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                selected
                  ? "border-[#00F0FF]/60 bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.08)]"
                  : "border-[#1E1E2E] bg-[#12121A]/60 hover:border-[#1E1E2E]/80 hover:bg-[#12121A]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-[#00F0FF]/20"
                    : "bg-[#1E1E2E]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    selected ? "text-[#00F0FF]" : "text-[#94A3B8]"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  selected ? "text-[#00F0FF]" : "text-[#F8FAFC]"
                }`}
              >
                {goal.value}
              </span>
              {selected && (
                <Check className="ml-auto h-4 w-4 shrink-0 text-[#00F0FF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepYourBottleneck({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">
          Your biggest bottleneck
        </h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          What is the single biggest thing holding you back right now?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {BOTTLENECKS.map((bn) => {
          const Icon = bn.icon;
          const selected = data.bottleneck === bn.value;
          return (
            <button
              key={bn.value}
              type="button"
              onClick={() => onChange({ bottleneck: bn.value })}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                selected
                  ? "border-[#8B5CF6]/60 bg-[#8B5CF6]/10 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                  : "border-[#1E1E2E] bg-[#12121A]/60 hover:border-[#1E1E2E]/80 hover:bg-[#12121A]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-[#8B5CF6]/20"
                    : "bg-[#1E1E2E]"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    selected ? "text-[#8B5CF6]" : "text-[#94A3B8]"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  selected ? "text-[#8B5CF6]" : "text-[#F8FAFC]"
                }`}
              >
                {bn.value}
              </span>
              {selected && (
                <Check className="ml-auto h-4 w-4 shrink-0 text-[#8B5CF6]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBlueprint({
  data,
  blueprint,
  loading,
  loadingMessage,
  progress,
  onSave,
  saving,
}: {
  data: OnboardingData;
  blueprint: Blueprint | null;
  loading: boolean;
  loadingMessage: string;
  progress: number;
  onSave: () => void;
  saving: boolean;
}) {

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-full border-2 border-[#1E1E2E]" />
          <motion.div
            className="absolute inset-0 h-20 w-20 rounded-full border-2 border-transparent border-t-[#00F0FF]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-[#00F0FF]" />
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-[#F8FAFC]">
          Generating your Founder Blueprint
        </h2>

        <motion.p
          key={loadingMessage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-8 text-sm text-[#94A3B8]"
        >
          {loadingMessage}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-[#94A3B8]">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  if (!blueprint) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/10">
          <Check className="h-7 w-7 text-[#10B981]" />
        </div>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">
          Your Founder Blueprint is ready!
        </h2>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Here is your personalized strategy, {data.fullName || "Founder"}.
        </p>
      </div>

      {/* Niche Suggestions */}
      <BlueprintCard
        icon={Lightbulb}
        title="Niche Suggestions"
        color="cyan"
      >
        <ul className="space-y-2">
          {blueprint.niche_suggestions.map((n, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
              <span className="mt-0.5 text-[#00F0FF]">{i + 1}.</span>
              {n}
            </li>
          ))}
        </ul>
      </BlueprintCard>

      {/* Business Model */}
      <BlueprintCard
        icon={Briefcase}
        title="Business Model"
        color="purple"
      >
        <p className="text-sm leading-relaxed text-[#94A3B8]">
          {blueprint.business_model}
        </p>
      </BlueprintCard>

      {/* Positioning */}
      <BlueprintCard
        icon={MapPin}
        title="Positioning Statement"
        color="cyan"
      >
        <p className="text-sm italic leading-relaxed text-[#F8FAFC]">
          &ldquo;{blueprint.positioning}&rdquo;
        </p>
      </BlueprintCard>

      {/* Offer Ideas */}
      <BlueprintCard
        icon={Package}
        title="Offer Ideas"
        color="purple"
      >
        <ul className="space-y-2">
          {blueprint.offer_ideas.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
              {o}
            </li>
          ))}
        </ul>
      </BlueprintCard>

      {/* Audience Strategy */}
      <BlueprintCard
        icon={Users}
        title="Audience Strategy"
        color="cyan"
      >
        <p className="text-sm leading-relaxed text-[#94A3B8]">
          {blueprint.audience_strategy}
        </p>
      </BlueprintCard>

      {/* Funnel Recommendations */}
      <BlueprintCard
        icon={MessageSquare}
        title="Funnel Recommendation"
        color="purple"
      >
        <p className="text-sm leading-relaxed text-[#94A3B8]">
          {blueprint.funnel_recommendations}
        </p>
      </BlueprintCard>

      {/* Next Steps */}
      <BlueprintCard
        icon={Rocket}
        title="Your Next 3 Action Steps"
        color="green"
      >
        <ol className="space-y-3">
          {blueprint.next_steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#94A3B8]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-xs font-bold text-[#10B981]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </BlueprintCard>

      {/* Go to Dashboard */}
      <div className="pt-4">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-6 py-3.5 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F]" />
              Saving your blueprint...
            </>
          ) : (
            <>
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Blueprint Card                                                     */
/* ------------------------------------------------------------------ */

function BlueprintCard({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: "cyan" | "purple" | "green";
  children: React.ReactNode;
}) {
  const accents = {
    cyan: {
      border: "border-[#00F0FF]/20",
      iconBg: "bg-[#00F0FF]/10",
      iconText: "text-[#00F0FF]",
    },
    purple: {
      border: "border-[#8B5CF6]/20",
      iconBg: "bg-[#8B5CF6]/10",
      iconText: "text-[#8B5CF6]",
    },
    green: {
      border: "border-[#10B981]/20",
      iconBg: "bg-[#10B981]/10",
      iconText: "text-[#10B981]",
    },
  };

  const a = accents[color];

  return (
    <div
      className={`rounded-xl border ${a.border} bg-[#12121A]/60 p-5 backdrop-blur-sm`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${a.iconText}`} />
        </div>
        <h3 className="text-sm font-semibold text-[#F8FAFC]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const { user, loading: userLoading } = useUser();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    role: "",
    experienceLevel: "",
    industry: "",
    businessDescription: "",
    revenueStage: "",
    goals: [],
    bottleneck: "",
  });

  const router = useRouter();
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [blueprintLoading, setBlueprintLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  // Pre-fill name from auth
  useEffect(() => {
    if (user?.user_metadata?.full_name && !data.fullName) {
      setData((prev) => ({
        ...prev,
        fullName: user.user_metadata.full_name as string,
      }));
    }
  }, [user, data.fullName]);

  const onChange = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  // Step validation
  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return !!(data.fullName && data.role && data.experienceLevel);
      case 1:
        return !!(data.industry && data.businessDescription && data.revenueStage);
      case 2:
        return data.goals.length > 0;
      case 3:
        return !!data.bottleneck;
      default:
        return false;
    }
  };

  // Generate blueprint
  const generateBlueprint = useCallback(async () => {
    setBlueprintLoading(true);
    setProgress(0);
    setLoadingMessage(LOADING_MESSAGES[0]);

    // Cycle through loading messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = Math.min(msgIndex + 1, LOADING_MESSAGES.length - 1);
      setLoadingMessage(LOADING_MESSAGES[msgIndex]);
    }, 2500);

    // Animate progress
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 500);

    try {
      const res = await fetch("/api/onboarding/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setProgress(100);
      setBlueprint(json.blueprint);
    } catch {
      // Even on error the API returns mock data, but just in case:
      setProgress(100);
    } finally {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      setBlueprintLoading(false);
    }
  }, [data]);

  const saveOnboarding = useCallback(async () => {
    setSaving(true);
    try {
      const responses = [
        { question_key: "fullName", answer: data.fullName },
        { question_key: "role", answer: data.role },
        { question_key: "experienceLevel", answer: data.experienceLevel },
        { question_key: "industry", answer: data.industry },
        { question_key: "businessDescription", answer: data.businessDescription },
        { question_key: "revenueStage", answer: data.revenueStage },
        { question_key: "goals", answer: data.goals },
        { question_key: "bottleneck", answer: data.bottleneck },
      ];

      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses,
          blueprint,
          fullName: data.fullName,
          role: data.role,
          experienceLevel: data.experienceLevel,
          industry: data.industry,
          revenueStage: data.revenueStage,
          goals: data.goals,
          bottleneck: data.bottleneck,
        }),
      });
    } catch (error) {
      console.error("Failed to save onboarding:", error);
    } finally {
      setSaving(false);
      router.push("/dashboard");
    }
  }, [data, blueprint, router]);

  const goNext = () => {
    if (step < 4) {
      setDirection(1);
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === 4) {
        generateBlueprint();
      }
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-24 lg:pb-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_16px_rgba(0,240,255,0.2)]"
                      : isCompleted
                        ? "border-[#10B981] bg-[#10B981]/10"
                        : "border-[#1E1E2E] bg-[#12121A]"
                  }`}
                >
                  {isCompleted ? (
                    <Check
                      className="h-4 w-4 text-[#10B981]"
                    />
                  ) : (
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-[#00F0FF]" : "text-[#94A3B8]/50"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`hidden text-[10px] font-medium sm:block ${
                    isActive
                      ? "text-[#00F0FF]"
                      : isCompleted
                        ? "text-[#10B981]"
                        : "text-[#94A3B8]/50"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connecting progress line */}
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6]"
            initial={false}
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Glass card container */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 0 && (
              <StepWhoAreYou data={data} onChange={onChange} />
            )}
            {step === 1 && (
              <StepYourBusiness data={data} onChange={onChange} />
            )}
            {step === 2 && (
              <StepYourGoals data={data} onChange={onChange} />
            )}
            {step === 3 && (
              <StepYourBottleneck data={data} onChange={onChange} />
            )}
            {step === 4 && (
              <StepBlueprint
                data={data}
                blueprint={blueprint}
                loading={blueprintLoading}
                loadingMessage={loadingMessage}
                progress={progress}
                onSave={saveOnboarding}
                saving={saving}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step < 4 && (
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-lg border border-[#1E1E2E] bg-[#12121A] px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#00F0FF]/20 hover:text-[#F8FAFC]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed()}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === 3 ? "Generate Blueprint" : "Next"}
            {step === 3 ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* Back button on step 5 while loading */}
      {step === 4 && blueprintLoading && (
        <div className="mt-6">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 rounded-lg border border-[#1E1E2E] bg-[#12121A] px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition-colors hover:border-[#00F0FF]/20 hover:text-[#F8FAFC]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      )}
    </div>
  );
}
