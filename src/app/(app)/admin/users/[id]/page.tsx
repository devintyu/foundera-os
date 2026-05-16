"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  User,
  Zap,
  Crown,
  Calendar,
  MessageSquare,
  Save,
} from "lucide-react";

interface UserDetail {
  profile: {
    id: string;
    full_name: string;
    role: string;
    plan: string;
    founder_stage: string;
    industry: string | null;
    experience_level: string;
    revenue_stage: string;
    goals: string[];
    current_bottleneck: string | null;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
  };
  subscription: {
    plan: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
  } | null;
  usageHistory: { month: string; ai_calls_count: number; tokens_used: number }[];
  recentConversations: { id: string; agent_type: string; title: string; created_at: string }[];
}

const AGENT_LABELS: Record<string, string> = {
  market_researcher: "Market Research",
  offer_builder: "Offer Architect",
  audience_analyst: "Audience Intel",
  funnel_architect: "Funnel Architect",
  copywriter: "AI Copywriter",
  strategy_advisor: "Strategy Advisor",
};

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [editRole, setEditRole] = useState("");
  const [editPlan, setEditPlan] = useState("");
  const [editStage, setEditStage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) {
          setError("Failed to load user.");
          return;
        }
        const d: UserDetail = await res.json();
        setData(d);
        setEditRole(d.profile.role);
        setEditPlan(d.profile.plan);
        setEditStage(d.profile.founder_stage);
      } catch {
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole, plan: editPlan, founder_stage: editStage }),
      });
      if (res.ok) {
        const updated = await res.json();
        setData((prev) => prev ? { ...prev, profile: updated.profile } : prev);
        setSaveMsg("Saved!");
        setTimeout(() => setSaveMsg(""), 2000);
      } else {
        setSaveMsg("Save failed");
      }
    } catch {
      setSaveMsg("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Shield className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-[#F8FAFC]">{error}</p>
      </div>
    );
  }

  const { profile, subscription, usageHistory, recentConversations } = data;
  const initials = (profile.full_name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] hover:text-[#F8FAFC]">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00F0FF] text-lg font-semibold text-white">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC]">{profile.full_name || "Unnamed"}</h1>
            <p className="text-xs text-[#94A3B8]">
              Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Edit */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6 lg:col-span-1">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
            <User className="h-4 w-4 text-[#00F0FF]" /> Profile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#00F0FF]/50"
              >
                <option value="founder">Founder</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Plan</label>
              <select
                value={editPlan}
                onChange={(e) => setEditPlan(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#00F0FF]/50"
              >
                <option value="starter">Starter ($29)</option>
                <option value="pro">Pro ($79)</option>
                <option value="business">Business ($199)</option>
                <option value="elite">Elite ($499)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#94A3B8]">Founder Stage</label>
              <select
                value={editStage}
                onChange={(e) => setEditStage(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#00F0FF]/50"
              >
                <option value="explorer">Explorer</option>
                <option value="builder">Builder</option>
                <option value="operator">Operator</option>
                <option value="scaler">Scaler</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saveMsg && (
              <p className={`text-center text-xs ${saveMsg === "Saved!" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {saveMsg}
              </p>
            )}
          </div>

          {/* Quick Info */}
          <div className="mt-6 space-y-2 border-t border-[#1E1E2E] pt-4">
            <div className="flex justify-between text-xs">
              <span className="text-[#94A3B8]">Industry</span>
              <span className="text-[#F8FAFC]">{profile.industry || "—"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#94A3B8]">Experience</span>
              <span className="capitalize text-[#F8FAFC]">{profile.experience_level}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#94A3B8]">Revenue Stage</span>
              <span className="capitalize text-[#F8FAFC]">{profile.revenue_stage.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#94A3B8]">Onboarded</span>
              <span className={profile.onboarding_completed ? "text-[#10B981]" : "text-[#F59E0B]"}>
                {profile.onboarding_completed ? "Yes" : "No"}
              </span>
            </div>
            {profile.goals && profile.goals.length > 0 && (
              <div className="pt-2">
                <p className="mb-1 text-xs text-[#94A3B8]">Goals</p>
                <div className="flex flex-wrap gap-1">
                  {profile.goals.map((g, i) => (
                    <span key={i} className="rounded-full bg-[#1E1E2E] px-2 py-0.5 text-[10px] text-[#94A3B8]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Subscription */}
          <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
              <Crown className="h-4 w-4 text-[#F59E0B]" /> Subscription
            </h3>
            {subscription ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[#94A3B8]">Plan</p>
                  <p className="mt-1 text-sm font-medium capitalize text-[#F8FAFC]">{subscription.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Status</p>
                  <p className={`mt-1 text-sm font-medium ${subscription.status === "active" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {subscription.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Period Start</p>
                  <p className="mt-1 text-sm text-[#F8FAFC]">
                    {new Date(subscription.current_period_start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Period End</p>
                  <p className="mt-1 text-sm text-[#F8FAFC]">
                    {new Date(subscription.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">No active subscription (free tier)</p>
            )}
          </div>

          {/* Usage History */}
          <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
              <Zap className="h-4 w-4 text-[#8B5CF6]" /> Usage History
            </h3>
            {usageHistory.length > 0 ? (
              <div className="space-y-2">
                {usageHistory.map((u) => (
                  <div key={u.month} className="flex items-center justify-between rounded-lg bg-[#1E1E2E]/50 px-4 py-2.5">
                    <span className="text-sm font-medium text-[#F8FAFC]">
                      <Calendar className="mr-2 inline h-3.5 w-3.5 text-[#94A3B8]" />
                      {u.month}
                    </span>
                    <div className="flex gap-6 text-xs text-[#94A3B8]">
                      <span>{u.ai_calls_count} calls</span>
                      <span>
                        {u.tokens_used > 1000
                          ? `${(u.tokens_used / 1000).toFixed(1)}K`
                          : u.tokens_used}{" "}
                        tokens
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">No usage recorded</p>
            )}
          </div>

          {/* Recent AI Conversations */}
          <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
              <MessageSquare className="h-4 w-4 text-[#00F0FF]" /> Recent AI Conversations
            </h3>
            {recentConversations.length > 0 ? (
              <div className="space-y-2">
                {recentConversations.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#1E1E2E]/50 px-4 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{c.title}</p>
                      <p className="text-xs text-[#94A3B8]">{AGENT_LABELS[c.agent_type] || c.agent_type}</p>
                    </div>
                    <span className="text-xs text-[#94A3B8]">
                      {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">No conversations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
