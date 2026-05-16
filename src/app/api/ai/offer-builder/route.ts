import { NextRequest, NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";

const MOCK_DATA = {
  offer_name: "The Accelerator Blueprint",
  value_proposition:
    "A done-with-you program that helps ambitious professionals build and launch their first profitable online business in 90 days — without quitting their day job or spending thousands on ads.",
  pricing_structure:
    "Three tiers: Starter ($497 one-time), Growth ($997 one-time + 2 coaching calls), and VIP ($2,497 with unlimited coaching for 90 days). Payment plans available for Growth and VIP.",
  bonuses: [
    "Private community access with weekly live Q&A sessions ($997 value)",
    "Done-for-you landing page templates and email sequences ($497 value)",
    "90-day accountability tracker with milestone rewards ($197 value)",
    "Exclusive partner discounts on tools and software ($300+ value)",
    "Bonus masterclass: 'First $10K Month Playbook' ($297 value)",
  ],
  guarantee:
    "30-day 'Try It' money-back guarantee. If you complete the first 3 modules, follow the action steps, and don't see measurable progress toward your launch, get a full refund — no questions asked.",
  sales_angle:
    "Lead with the pain of staying stuck in a career that doesn't fulfill them. Emphasize the 90-day transformation timeline and the 'done-with-you' support that eliminates overwhelm. Use testimonials from people who launched while working full-time. The hook: 'What if 90 days from now, you had a business that actually works?'",
};

const SYSTEM_PROMPT = `You are a world-class offer strategist and pricing expert who has helped build multi-million dollar offers.
Design an irresistible offer based on the given inputs and return your response as a JSON object with the following structure:
{
  "offer_name": "A compelling, memorable offer name",
  "value_proposition": "A clear, powerful value proposition (2-3 sentences)",
  "pricing_structure": "Detailed pricing strategy with tiers if applicable",
  "bonuses": ["array of 4-6 high-value bonuses with perceived values"],
  "guarantee": "A bold, risk-reversing guarantee",
  "sales_angle": "The primary sales angle and messaging strategy (2-3 sentences)"
}
Return ONLY valid JSON, no markdown or extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { title, target_audience, problem, price_range, offer_type } =
      await req.json();

    if (!title || !target_audience || !problem) {
      return NextResponse.json(
        { error: "Title, target audience, and problem are required" },
        { status: 400 }
      );
    }

    const userMessage = `Design an irresistible offer:
Offer Title: ${title}
Target Audience: ${target_audience}
Core Problem: ${problem}
Price Range: ${price_range || "Flexible"}
Offer Type: ${offer_type || "Not specified"}

Create a complete offer with compelling name, value proposition, pricing, bonuses, guarantee, and sales angle.`;

    try {
      const aiResponse = await routeAI({
        agentType: "offer_builder",
        systemPrompt: SYSTEM_PROMPT,
        userMessage,
        maxTokens: 4096,
      });

      const parsed = JSON.parse(aiResponse.content);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(MOCK_DATA);
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to process offer builder request" },
      { status: 500 }
    );
  }
}
