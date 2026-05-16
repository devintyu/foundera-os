import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getFunnelPrompt } from "@/lib/ai/prompts/funnel";
import { getUserAndTrack } from "@/lib/ai/with-tracking";

export async function POST(request: Request) {
  try {
    const { offer, audience, pricePoint, goal } = await request.json();

    const userMessage = `Design a complete sales funnel for this business:

Offer: ${offer}
Target Audience: ${audience}
Price Point: ${pricePoint || "Not specified"}
Primary Goal: ${goal || "Generate sales"}

Design the most effective funnel to convert cold traffic into paying customers for this specific offer and audience.`;

    const result = await routeAI({
      agentType: "funnel_architect",
      systemPrompt: getFunnelPrompt(),
      userMessage,
      maxTokens: 4096,
    });

    await getUserAndTrack(result.tokensUsed);

    try {
      const parsed = JSON.parse(result.content);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        funnel_type:
          "Lead Magnet → Email Nurture → Sales Page funnel. This is the most reliable funnel type for your offer because it builds trust before asking for the sale, which is critical when your audience doesn't know you yet.",
        stages: [
          "Stage 1 — Awareness Hook: Create a scroll-stopping ad or content piece that calls out your ideal customer's #1 pain point. Use pattern interrupts and curiosity to drive clicks.",
          "Stage 2 — Lead Magnet Landing Page: Offer a high-value free resource (checklist, template, mini-course) that solves a specific sub-problem of your audience. Keep the opt-in page focused: headline, 3 bullet points, email capture.",
          "Stage 3 — Email Nurture (5-7 emails over 10 days): Build trust through value-first content. Share frameworks, case studies, and quick wins. Position yourself as the expert who understands their world.",
          "Stage 4 — Sales Page / Offer Presentation: Present your core offer with a clear problem-agitation-solution structure. Include social proof, risk reversal (guarantee), and urgency.",
          "Stage 5 — Follow-up & Objection Handling: Automated follow-up sequence for non-buyers addressing the top 3 objections. Include testimonials, FAQ, and a deadline or bonus incentive.",
        ],
        traffic_channels: [
          "Meta Ads (Facebook/Instagram): Start with interest-based targeting of your ideal audience. Lead with problem-aware ad creative. Expected CPL: $2-8 depending on niche.",
          "Content Marketing (LinkedIn or YouTube): Create 2-3 pieces of educational content per week that demonstrate expertise. Repurpose into lead magnets. Slower but compounds over time.",
          "Strategic Partnerships: Partner with complementary businesses to access their audience through guest content, co-webinars, or affiliate arrangements.",
        ],
        conversion_optimizations: [
          "Ad → Landing Page drop-off: Ensure message match between ad creative and landing page headline. The visitor should see the exact promise repeated. Target: 30-50% opt-in rate.",
          "Email open rate decay: Front-load your best content in emails 1-3. Use curiosity-driven subject lines. Segment engaged vs. unengaged subscribers by day 5.",
          "Sales page abandonment: Add exit-intent popup with a downsell or payment plan option. Include a video sales letter for visitors who won't read long copy.",
        ],
        metrics: {
          expected_opt_in_rate: "25-45%",
          expected_sales_conversion: "2-5%",
          estimated_cpl: "$3-$10",
          estimated_cpa: "$50-$200",
        },
        quick_wins: [
          "Create a one-page lead magnet (checklist or template) that solves your audience's most urgent micro-problem — this can be done in 2-3 hours.",
          "Set up a 5-email welcome sequence that delivers the lead magnet, shares your story, provides value, and makes your offer.",
          "Write 3 variations of your core ad/hook and test them with $20/day budget to find the winning angle before scaling.",
        ],
      });
    }
  } catch (error) {
    console.error("Funnel builder error:", error);
    return NextResponse.json(
      { error: "Failed to generate funnel" },
      { status: 500 }
    );
  }
}
