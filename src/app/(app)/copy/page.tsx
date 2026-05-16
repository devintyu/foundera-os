"use client";

import { useState } from "react";
import {
  PenTool,
  Type,
  MessageCircle,
  FileText,
  Megaphone,
  Plus,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";

interface CopyResult {
  headlines: string[];
  hooks: string[];
  body_copy: string;
  cta_options: string[];
}

const COPY_TYPES = [
  { value: "landing-page", label: "Landing Page", icon: FileText },
  { value: "ad-copy", label: "Ad Copy", icon: Megaphone },
  { value: "email-sequence", label: "Email Sequence", icon: MessageCircle },
  { value: "social-media", label: "Social Media", icon: MessageCircle },
];

export default function CopyPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copyType, setCopyType] = useState("landing-page");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [result, setResult] = useState<CopyResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/copywriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: copyType, product, audience, tone }),
      });
      const data: CopyResult = await res.json();
      setResult(data);
      setShowForm(false);
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              AI Copywriter
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">
            Generate high-converting copy for any channel
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setResult(null);
          }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
        >
          {showForm ? (
            <>
              <ArrowLeft className="h-4 w-4" /> Back
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Generate Copy
            </>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl"
        >
          {/* Copy Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
              Copy Type
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {COPY_TYPES.map((ct) => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={() => setCopyType(ct.value)}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-all ${
                      copyType === ct.value
                        ? "border-[#00F0FF]/50 bg-[#00F0FF]/10 text-[#00F0FF]"
                        : "border-[#1E1E2E] text-[#94A3B8] hover:border-[#1E1E2E]/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {ct.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
              Product / Service
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. Online course teaching freelancers how to land $10k clients"
              required
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Freelance designers earning $3-5k/month who want to scale"
              required
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
              Tone / Voice{" "}
              <span className="text-[#94A3B8]">(optional)</span>
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g. Bold and direct, Warm and empathetic, Professional"
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            <PenTool className="h-4 w-4" />
            {loading ? "Generating..." : "Generate Copy"}
          </button>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-16 backdrop-blur-xl">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0s_infinite] rounded-full bg-[#00F0FF]" />
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0.15s_infinite] rounded-full bg-[#8B5CF6]" />
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0.3s_infinite] rounded-full bg-[#00F0FF]" />
          </div>
          <p className="mt-4 text-sm text-[#94A3B8]">
            AI copywriter is crafting your copy...
          </p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Headlines */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00F0FF]/10">
                <Type className="h-5 w-5 text-[#00F0FF]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Headlines
              </h3>
            </div>
            <div className="space-y-2">
              {result.headlines.map((h, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-lg border border-[#1E1E2E] bg-[#0A0A0F]/50 p-3"
                >
                  <p className="text-sm font-medium text-[#F8FAFC]">{h}</p>
                  <button
                    onClick={() => copyText(`h-${i}`, h)}
                    className="ml-3 shrink-0 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {copiedIdx === `h-${i}` ? (
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hooks */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
                <MessageCircle className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Hooks</h3>
            </div>
            <div className="space-y-2">
              {result.hooks.map((hook, i) => (
                <div
                  key={i}
                  className="group flex items-start justify-between rounded-lg border border-[#1E1E2E] bg-[#0A0A0F]/50 p-3"
                >
                  <p className="text-sm leading-relaxed text-[#94A3B8]">
                    {hook}
                  </p>
                  <button
                    onClick={() => copyText(`hk-${i}`, hook)}
                    className="ml-3 mt-0.5 shrink-0 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {copiedIdx === `hk-${i}` ? (
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Body Copy */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                  <FileText className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  Body Copy
                </h3>
              </div>
              <button
                onClick={() => copyText("body", result.body_copy)}
                className="flex items-center gap-1.5 rounded-md border border-[#1E1E2E] px-2.5 py-1 text-xs text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
              >
                {copiedIdx === "body" ? (
                  <>
                    <Check className="h-3 w-3 text-[#10B981]" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#94A3B8]">
              {result.body_copy}
            </p>
          </div>

          {/* CTAs */}
          <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/10">
                <Megaphone className="h-5 w-5 text-[#10B981]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Call-to-Action Options
              </h3>
            </div>
            <div className="space-y-2">
              {result.cta_options.map((cta, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-lg border border-[#10B981]/20 bg-[#0A0A0F]/30 p-3"
                >
                  <p className="text-sm font-medium text-[#F8FAFC]">{cta}</p>
                  <button
                    onClick={() => copyText(`cta-${i}`, cta)}
                    className="ml-3 shrink-0 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {copiedIdx === `cta-${i}` ? (
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !showForm && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-20 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
            <PenTool className="h-7 w-7 text-[#00F0FF]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">
            Generate your first copy
          </h3>
          <p className="mt-1 text-sm text-[#94A3B8]">
            AI-powered headlines, hooks, body copy, and CTAs
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
          >
            <Plus className="h-4 w-4" /> Generate Copy
          </button>
        </div>
      )}
    </div>
  );
}
