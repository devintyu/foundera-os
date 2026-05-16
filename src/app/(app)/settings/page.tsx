"use client";

import { useState } from "react";
import { User, Mail, Building2, Target, Save } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState("");
  const [founderStage, setFounderStage] = useState("explorer");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const stages = [
    { value: "explorer", label: "Explorer", desc: "Figuring things out" },
    { value: "builder", label: "Builder", desc: "Building first offer" },
    { value: "operator", label: "Operator", desc: "Running the business" },
    { value: "scaler", label: "Scaler", desc: "Growing revenue" },
    { value: "owner", label: "Owner", desc: "Delegating & systemizing" },
  ];

  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
          Settings
        </h1>
        <p className="mt-1 text-[#94A3B8]">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        {/* Profile Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-lg font-semibold text-[#F8FAFC]">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                <User className="h-4 w-4" /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:border-[#00F0FF]/50 focus:outline-none focus:ring-1 focus:ring-[#00F0FF]/30"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                <Mail className="h-4 w-4" /> Email
              </label>
              <input
                type="email"
                disabled
                value="founder@example.com"
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F]/50 px-4 py-2.5 text-sm text-[#94A3B8] opacity-60"
              />
              <p className="mt-1 text-xs text-[#94A3B8]">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                <Building2 className="h-4 w-4" /> Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:border-[#00F0FF]/50 focus:outline-none focus:ring-1 focus:ring-[#00F0FF]/30"
                placeholder="e.g. Technology, Health, Education"
              />
            </div>
          </div>
        </div>

        {/* Founder Stage */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-[#F8FAFC]">
            <Target className="h-5 w-5 text-[#00F0FF]" /> Founder Stage
          </h2>
          <p className="mb-4 text-sm text-[#94A3B8]">Where are you in your journey?</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage) => (
              <button
                key={stage.value}
                type="button"
                onClick={() => setFounderStage(stage.value)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  founderStage === stage.value
                    ? "border-[#00F0FF]/40 bg-[#00F0FF]/10"
                    : "border-[#1E1E2E] bg-[#12121A]/80 hover:border-[#1E1E2E]/80"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    founderStage === stage.value
                      ? "text-[#00F0FF]"
                      : "text-[#F8FAFC]"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">{stage.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
